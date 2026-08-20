import { computed } from '@preact/signals'
import { useEffect, useRef } from 'preact/hooks'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { sessionStore } from '../store/session'
import { i18nStore } from '../store/i18n'
import { toasts } from '../store/toasts'
import { useCfg } from '../renderer/useConfig'
import { useData } from '../renderer/useData'
import { resolveParams } from '../renderer/bindingEngine'
import { overlayService } from '../overlay/overlayService'
import { subscribeEvent } from '../events/eventBus'
import type { BindingContext, Scene3DConfig, Scene3DContent, Scene3DObjectKind, Scene3DObjectSpec, Scene3DToolbarButton } from '../protocol/componentSpec'
import '../styles/scene3d.css'

interface ComponentProps {
  config: Record<string, unknown>
  context?: BindingContext
}

export default function UiScene3D(props: ComponentProps) {
  const t = i18nStore.t
  const cfg = useCfg<Scene3DConfig>(props.config, { grid: true, autoRotate: false })
  const hostEl = useRef<HTMLDivElement | null>(null)

  const editable = computed(() => !cfg.value.readonly && cfg.value.disabled !== true)
  const height = computed(() => cfg.value.height)
  const componentId = computed(() => cfg.value.id)

  const data = computed(() => cfg.value.content)
  const { value, error } = useData(() => data.value, () => props.context ?? {})

  let scene: THREE.Scene | null = null
  let camera: THREE.PerspectiveCamera | null = null
  let renderer: THREE.WebGLRenderer | null = null
  let controls: OrbitControls | null = null
  let resizeObserver: ResizeObserver | null = null
  let rafId = 0
  let disposed = false

  const objects = new Map<string, THREE.Object3D>()
  let selected: THREE.Object3D | null = null
  let selectedSpecId: string | null = null


  let saveTimer: ReturnType<typeof setTimeout> | null = null
  let unsubEditorCommands: (() => void) | null = null

  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()
  let dragOrigin = { x: 0, y: 0 }

  const toolbarButtons: Scene3DToolbarButton[] = ['addBox', 'addSphere', 'addCylinder', 'delete', 'resetCamera']
  const toolbar = cfg.value.toolbar === false ? [] : (cfg.value.toolbar ?? toolbarButtons)

  const DEFAULT_COLORS: Record<Scene3DObjectKind, number> = {
    box: 0x6b8afd,
    sphere: 0x34d399,
    cylinder: 0xf59e0b,
    model: 0x94a3b8
  }

  function currentBackground(): string {
    return cfg.value.background ?? '#ffffff'
  }

  function cameraSetup(): { fov: number; position: [number, number, number]; target: [number, number, number] } {
    return {
      fov: cfg.value.camera?.fov ?? 50,
      position: cfg.value.camera?.position ?? [4, 3.5, 5],
      target: cfg.value.camera?.target ?? [0, 0, 0]
    }
  }

  function lightSetup(): { ambient: number; directional: number; direction: [number, number, number] } {
    return {
      ambient: cfg.value.lights?.ambient?.intensity ?? 0.7,
      directional: cfg.value.lights?.directional?.intensity ?? 1.2,
      direction: cfg.value.lights?.directional?.position ?? [5, 8, 6]
    }
  }

  function selectSpec(specId: string | null): void {
    if (selected) {
      const mat = (selected as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined
      if (mat && 'emissive' in mat) mat.emissive.setHex(0x000000)
    }
    selected = specId ? objects.get(specId) ?? null : null
    selectedSpecId = specId
    if (selected) {
      const mat = (selected as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined
      if (mat && 'emissive' in mat) mat.emissive.setHex(0x000000)
    }
  }

  function scheduleSave(): void {
    if (!editable.value || !cfg.value.save?.command) return
    if (saveTimer) clearTimeout(saveTimer)
    saveTimer = setTimeout(() => { void save() }, 600)
  }

  function contentFor(): string {
    function serializeObject(obj: THREE.Object3D): Scene3DObjectSpec | null {
      if (!obj.userData.kind) return null
      const spec: Scene3DObjectSpec = {
        id: obj.userData.specId as string,
        kind: obj.userData.kind as Scene3DObjectKind,
        position: [obj.position.x, obj.position.y, obj.position.z],
        rotation: [obj.rotation.x, obj.rotation.y, obj.rotation.z],
        scale: [obj.scale.x, obj.scale.y, obj.scale.z]
      }
      const color = obj.userData.color as string | undefined
      if (color) spec.color = color
      const modelUrl = obj.userData.modelUrl as string | undefined
      if (modelUrl) spec.modelUrl = modelUrl
      const children = obj.children.map(serializeObject).filter((c): c is Scene3DObjectSpec => c !== null)
      if (children.length) spec.children = children
      return spec
    }
    const root: Scene3DObjectSpec[] = []
    for (const obj of objects.values()) {
      if (obj.parent !== scene) continue
      const spec = serializeObject(obj)
      if (spec) root.push(spec)
    }
    const content: Scene3DContent = { objects: root, background: currentBackground(), grid: cfg.value.grid }
    return JSON.stringify(content)
  }

  async function save(): Promise<void> {
    if (!cfg.value.save?.command) return
    const payload = { ...(cfg.value.save.params ?? {}), content: contentFor() }
    try {
      await sessionStore.executeCommand(cfg.value.save.command, resolveParams(payload, props.context ?? {}))
      toasts.push({ message: t('core.editor.saved'), kind: 'success' })
    } catch { /* error toast shown by session store */ }
  }

  function materialFor(spec: Scene3DObjectSpec): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({ color: spec.color ? new THREE.Color(spec.color).getHex() : DEFAULT_COLORS[spec.kind] })
  }

  function makePrimitive(kind: Scene3DObjectKind, spec?: Partial<Scene3DObjectSpec>): THREE.Object3D {
    const geometry =
      kind === 'box' ? new THREE.BoxGeometry(1, 1, 1)
      : kind === 'sphere' ? new THREE.SphereGeometry(0.6, 32, 16)
      : new THREE.CylinderGeometry(0.5, 0.5, 1, 32)
    const mesh = new THREE.Mesh(geometry, materialFor({ ...(spec as Scene3DObjectSpec), kind }))
    mesh.userData.kind = kind
    mesh.userData.color = spec?.color
    if (kind === 'sphere') mesh.position.y = 0.6
    else if (kind === 'box') mesh.position.y = 0.5
    else mesh.position.y = 0.5
    return mesh
  }

  function addObject(spec: Scene3DObjectSpec, parent?: THREE.Object3D): void {
    if (!scene) return
    let obj: THREE.Object3D
    if (spec.kind === 'model') {
      const placeholder = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.6), materialFor(spec))
      obj = placeholder
      if (spec.modelUrl) {
        const loader = new GLTFLoader()
        loader.load(
          new URL(spec.modelUrl, window.location.origin).toString(),
          (gltf) => {
            const model = gltf.scene
            model.position.copy(placeholder.position)
            model.rotation.copy(placeholder.rotation)
            model.scale.copy(placeholder.scale)
            model.userData = { ...placeholder.userData }
            if (placeholder.parent) {
              placeholder.parent.remove(placeholder)
              placeholder.parent.add(model)
            }
            while (placeholder.children.length) {
              const child = placeholder.children[0]
              placeholder.remove(child)
              model.add(child)
            }
            objects.set(spec.id, model)
          },
          undefined,
          () => { /* keep placeholder box if the model fails to load */ }
        )
      }
    } else {
      obj = makePrimitive(spec.kind, spec)
    }
    obj.position.set(spec.position[0], spec.position[1], spec.position[2])
    obj.rotation.set(spec.rotation?.[0] ?? 0, spec.rotation?.[1] ?? 0, spec.rotation?.[2] ?? 0)
    obj.scale.set(spec.scale?.[0] ?? 1, spec.scale?.[1] ?? 1, spec.scale?.[2] ?? 1)
    obj.userData.kind = spec.kind
    obj.userData.color = spec.color
    obj.userData.modelUrl = spec.modelUrl
    obj.userData.specId = spec.id
    objects.set(spec.id, obj)
    const attachTo = parent ?? scene
    attachTo.add(obj)
    for (const child of spec.children ?? []) addObject(child, obj)
  }

  function clearObjects(): void {
    objects.forEach((obj) => {
      obj.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry?.dispose()
          const mats = Array.isArray(child.material) ? child.material : [child.material]
          mats.forEach((m) => m?.dispose())
        }
      })
      obj.parent?.remove(obj)
    })
    objects.clear()
    selected = null
    selectedSpecId = null
  }

  function loadContent(content: Scene3DContent): void {
    clearObjects()
    for (const spec of content.objects ?? []) addObject(spec)
  }

  function setBackground(color: string): void {
    renderer?.setClearColor(color, 1)
  }

  function addPrimitive(kind: Scene3DObjectKind): void {
    if (!editable.value) return
    const spec: Scene3DObjectSpec = {
      id: `${kind}_${Date.now()}`,
      kind,
      position: [Math.round((Math.random() * 3 - 1.5) * 10) / 10, 0.5, Math.round((Math.random() * 3 - 1.5) * 10) / 10],
      color: `#${DEFAULT_COLORS[kind].toString(16).padStart(6, '0')}`
    }
    addObject(spec)
    scheduleSave()
  }

  function removeObjectFromMap(obj: THREE.Object3D): void {
    obj.children.forEach(removeObjectFromMap)
    const id = obj.userData.specId as string | undefined
    if (id) objects.delete(id)
  }

  function deleteSelected(): void {
    if (!editable.value || !selectedSpecId) return
    const specId = selectedSpecId
    const obj = objects.get(specId)
    if (obj) {
      obj.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry?.dispose()
          const mats = Array.isArray(child.material) ? child.material : [child.material]
          mats.forEach((m) => m?.dispose())
        }
      })
      removeObjectFromMap(obj)
      obj.parent?.remove(obj)
    }
    selected = null
    selectedSpecId = null
    scheduleSave()
  }

  function resetCamera(): void {
    if (!camera || !controls) return
    const setup = cameraSetup()
    camera.position.set(setup.position[0], setup.position[1], setup.position[2])
    camera.fov = setup.fov
    camera.updateProjectionMatrix()
    controls.target.set(setup.target[0], setup.target[1], setup.target[2])
    controls.update()
  }

  function objectAtPointer(e: MouseEvent): string | null {
    if (!renderer || !camera) return null
    const rect = renderer.domElement.getBoundingClientRect()
    const px = ((e.clientX - rect.left) / rect.width) * 2 - 1
    const py = -((e.clientY - rect.top) / rect.height) * 2 + 1
    raycaster.setFromCamera(new THREE.Vector2(px, py), camera)
    const hits = raycaster.intersectObjects([...objects.values()], true)
    if (!hits.length) return null
    let node: THREE.Object3D | null = hits[0].object
    while (node) {
      if (node.userData.kind) {
        const found = [...objects.keys()].find((id) => objects.get(id) === node)
        if (found) return found
        break
      }
      node = node.parent
    }
    return (hits[0].object.userData.specId as string | null) ?? null
  }

  function onContextMenu(e: MouseEvent): void {
    if (!editable.value) return
    const specId = objectAtPointer(e)
    if (!specId) return
    selectSpec(specId)
    const opened = overlayService.onGesture({
      event: 'contextmenu',
      componentType: 'Scene3D',
      objectType: 'scene3d.object',
      componentId: componentId.value,
      row: { id: specId },
      x: e.clientX,
      y: e.clientY
    })
    if (opened) e.preventDefault()
  }

  function serializeObjectForSpec(obj: THREE.Object3D): Scene3DObjectSpec | null {
    if (!obj.userData.kind) return null
    const spec: Scene3DObjectSpec = {
      id: obj.userData.specId as string,
      kind: obj.userData.kind as Scene3DObjectKind,
      position: [obj.position.x, obj.position.y, obj.position.z],
      rotation: [obj.rotation.x, obj.rotation.y, obj.rotation.z],
      scale: [obj.scale.x, obj.scale.y, obj.scale.z]
    }
    const color = obj.userData.color as string | undefined
    if (color) spec.color = color
    const modelUrl = obj.userData.modelUrl as string | undefined
    if (modelUrl) spec.modelUrl = modelUrl
    const children = obj.children.map(serializeObjectForSpec).filter((c): c is Scene3DObjectSpec => c !== null)
    if (children.length) spec.children = children
    return spec
  }

  function duplicateSelected(): void {
    if (!editable.value || !selectedSpecId) return
    const src = objects.get(selectedSpecId)
    if (!src) return
    const serialized = serializeObjectForSpec(src)
    if (!serialized) return
    const spec: Scene3DObjectSpec = {
      ...serialized,
      id: `obj_${Date.now().toString(36)}`,
      position: [src.position.x + 0.6, src.position.y, src.position.z + 0.6]
    }
    const parentObj = src.parent && src.parent !== scene ? src.parent : undefined
    addObject(spec, parentObj)
    selectSpec(spec.id)
    scheduleSave()
  }

  interface EditorCommandPayload {
    editor?: string
    command?: string
    componentId?: string
    params?: Record<string, unknown>
  }

  function handleEditorCommand(payload: EditorCommandPayload): void {
    if (payload.editor !== 'scene3d') return
    if (payload.componentId && payload.componentId !== componentId.value) return
    if (!editable.value) return
    const id = payload.params?.id as string | undefined
    if (!id || !objects.has(id)) return
    selectSpec(id)
    switch (payload.command) {
      case 'delete': deleteSelected(); break
      case 'duplicate': duplicateSelected(); break
    }
  }

  function onPointerDown(e: PointerEvent): void {
    dragOrigin = { x: e.clientX, y: e.clientY }
  }

  function onPointerUp(e: PointerEvent): void {
    if (!renderer || !editable.value) return
    const moved = Math.abs(e.clientX - dragOrigin.x) + Math.abs(e.clientY - dragOrigin.y)
    if (moved > 5) return
    const rect = renderer.domElement.getBoundingClientRect()
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
    raycaster.setFromCamera(pointer, camera as THREE.Camera)
    const hits = raycaster.intersectObjects([...objects.values()], true)
    let specId: string | null = null
    if (hits.length) {
      let node: THREE.Object3D | null = hits[0].object
      while (node) {
        if (node.userData.kind) {
          specId = [...objects.keys()].find((id) => objects.get(id) === node) ?? null
          break
        }
        node = node.parent
      }
      if (specId === null) specId = hits[0].object.userData.specId as string | null ?? null
    }
    selectSpec(specId)
  }

  function animate(): void {
    if (disposed) return
    rafId = requestAnimationFrame(animate)
    controls?.update()
    renderer?.render(scene as THREE.Scene, camera as THREE.Camera)
  }

  function setupScene(): void {
    const container = hostEl.current
    if (!container) return
    const width = container.clientWidth || 1
    const height = container.clientHeight || 1

    const setup = cameraSetup()
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(setup.fov, width / height, 0.1, 100)
    camera.position.set(setup.position[0], setup.position[1], setup.position[2])

    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(width, height)
    setBackground(currentBackground())
    container.appendChild(renderer.domElement)

    const fog = cfg.value.fog
    if (fog) {
      scene.fog = new THREE.Fog(fog.color ? new THREE.Color(fog.color) : new THREE.Color(currentBackground()), fog.near ?? 8, fog.far ?? 25)
    }

    const lights = lightSetup()
    scene.add(new THREE.AmbientLight(0xffffff, lights.ambient))
    const dir = new THREE.DirectionalLight(0xffffff, lights.directional)
    dir.position.set(lights.direction[0], lights.direction[1], lights.direction[2])
    scene.add(dir)

    const gridHelper = new THREE.GridHelper(10, 10, 0x94a3b8, 0xdbe3ee)
    gridHelper.visible = cfg.value.grid ?? true
    scene.add(gridHelper)

    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.autoRotate = cfg.value.autoRotate ?? false
    controls.target.set(setup.target[0], setup.target[1], setup.target[2])
    controls.update()

    renderer.domElement.addEventListener('pointerdown', onPointerDown)
    renderer.domElement.addEventListener('pointerup', onPointerUp)
    renderer.domElement.addEventListener('contextmenu', onContextMenu)

    resizeObserver = new ResizeObserver(() => {
      const w = container.clientWidth || 1
      const h = container.clientHeight || 1
      renderer?.setSize(w, h)
      if (camera) camera.aspect = w / h
      camera?.updateProjectionMatrix()
    })
    resizeObserver.observe(container)

    if (value.value != null) {
      try {
        loadContent(JSON.parse(String(value.value)) as Scene3DContent)
        void 0
      } catch { /* invalid content, keep empty scene */ }
    }

    animate()
  }

  // Lifecycle
  useEffect(() => {
    setupScene()
    if (error.value) toasts.push({ message: error.value, kind: 'error' })
    unsubEditorCommands = subscribeEvent((event) => {
      if (event.kind === 'editor.command') handleEditorCommand(event.payload as EditorCommandPayload)
    })
    return () => {
      disposed = true
      if (rafId) cancelAnimationFrame(rafId)
      if (saveTimer) clearTimeout(saveTimer)
      unsubEditorCommands?.()
      resizeObserver?.disconnect()
      controls?.dispose()
      clearObjects()
      renderer?.dispose()
      if (hostEl.current && renderer?.domElement) {
        renderer.domElement.removeEventListener('contextmenu', onContextMenu)
        hostEl.current.removeChild(renderer.domElement)
      }
      scene = null
      camera = null
      renderer = null
      controls = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Readonly toggle
  useEffect(() => {
    if (controls) controls.enabled = editable.value
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editable.value])

  const toolbarMeta: Record<Scene3DToolbarButton, { label: string; icon: string; action: () => void }> = {
    addBox: { label: t('core.editor.scene3d.addBox'), icon: '▦', action: () => addPrimitive('box') },
    addSphere: { label: t('core.editor.scene3d.addSphere'), icon: '◍', action: () => addPrimitive('sphere') },
    addCylinder: { label: t('core.editor.scene3d.addCylinder'), icon: '▮', action: () => addPrimitive('cylinder') },
    delete: { label: t('core.editor.scene3d.delete'), icon: '✕', action: () => deleteSelected() },
    resetCamera: { label: t('core.editor.scene3d.resetCamera'), icon: '◎', action: () => resetCamera() }
  }

  return (
    <div class="ui-scene3d" style={height.value ? { height: height.value } : undefined} data-gesture-type="Scene3D">
      {toolbar.length ? (
        <div class="ui-scene3d__toolbar">
          {toolbar.map((name) => (
            <button
              key={name}
              class={`ui-scene3d__btn${!editable.value ? ' ui-scene3d__btn--disabled' : ''}`}
              title={toolbarMeta[name]?.label}
              onClick={() => toolbarMeta[name]?.action()}
            >
              {toolbarMeta[name]?.icon}
            </button>
          ))}
        </div>
      ) : null}
      <div class="ui-scene3d__canvas" ref={hostEl} />
    </div>
  )
}
