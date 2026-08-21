let classCounter = 0
let styleElement: HTMLStyleElement | null = null

export interface AnimationApi {
  /** Apply a CSS animation to an element, returns a cleanup function */
  apply(element: HTMLElement, options: AnimationOptions): () => void
  /** Create a named animation class that can be toggled */
  class(name: string, keyframes: Keyframe[], options?: KeyframeAnimationOptions): string
  /** Remove all plugin animation styles */
  clear(): void
}

export interface AnimationOptions {
  keyframes: Keyframe[]
  duration?: number
  easing?: string
  iterations?: number
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse'
  fill?: 'none' | 'forwards' | 'backwards' | 'both'
  delay?: number
  onEnd?: () => void
}

function ensureStyleElement(): HTMLStyleElement {
  if (!styleElement) {
    const el = document.createElement('style')
    el.id = 'cc-plugin-animations'
    document.head.appendChild(el)
    styleElement = el
  }
  return styleElement
}

function generateClassName(prefix: string): string {
  return `${prefix}-${++classCounter}`
}

export const animationApi: AnimationApi = {
  apply(element: HTMLElement, options: AnimationOptions): () => void {
    const animation = element.animate(options.keyframes, {
      duration: options.duration ?? 300,
      easing: options.easing ?? 'ease',
      iterations: options.iterations ?? 1,
      direction: options.direction ?? 'normal',
      fill: options.fill ?? 'forwards',
      delay: options.delay ?? 0
    })

    if (options.onEnd) {
      animation.addEventListener('finish', options.onEnd, { once: true })
    }

    return () => {
      animation.cancel()
    }
  },

  class(name: string, keyframes: Keyframe[], options?: KeyframeAnimationOptions): string {
    const className = generateClassName(`cc-anim-${name}`)
    const style = ensureStyleElement()

    // Build @keyframes rule
    const keyframeName = className
    let keyframeCSS = `@keyframes ${keyframeName} {\n`
    keyframes.forEach((kf) => {
      const props = Object.entries(kf)
        .filter(([k]) => k !== 'offset' && k !== 'easing' && k !== 'composite')
        .map(([k, v]) => `  ${k}: ${v};`)
        .join('\n')
      const offset = kf.offset != null ? `${kf.offset * 100}%` : ''
      keyframeCSS += `${offset ? `  ${offset} {\n` : ''}${props}\n${offset ? '  }\n' : ''}`
    })
    keyframeCSS += '}\n'

    // Build class rule
    const duration = options?.duration ?? '300ms'
    const easing = options?.easing ?? 'ease'
    const iterations = options?.iterations ?? '1'
    const fill = options?.fill ?? 'forwards'
    const rule = `.${className} { animation: ${keyframeName} ${duration} ${easing} ${iterations} ${fill}; }\n`

    style.textContent = (style.textContent ?? '') + keyframeCSS + rule

    return className
  },

  clear(): void {
    if (styleElement) {
      styleElement.textContent = ''
    }
  }
}
