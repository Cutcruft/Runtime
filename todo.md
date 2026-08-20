# CutCruft — План работ

Статус легенды:
- `[ ]` — задача не начата
- `[~]` — в работе
- `[x]` — выполнено (с результатом)
- `[!]` — блокер / пересмотрено

---

## Текущий статус (20.08.2026)

### 🏗️ В РАБОТЕ: V7 — стилистика, авто-обновление, plugin-driven root, чистка

Спроектировано (ответы пользователя):
1. **Типизированная тема в YAML** — `theme: { mode, palette:{light,dark}, typography, radii, spacing, motion }` → CSS-переменные `--rt-*`.
2. **Storybook** — развить каталог `/uidocs` (dev-only, уже работает), документировать компоненты + токены.
3. **Авто-обновление** — реактивный `useData` по revision-сигналу + серверные подписки (убрать кнопку Обновить).
4. **Полностью plugin-driven root** — ядро без UI: всё (даже root layout) приходит из плагина.
5. **Чистка мёртвого кода** — убрать неиспользуемые + отчёт.

### 🔧 Исправлено ранее: плагины не загружались (только raw json)
- [x] **Причина**: `.plugins/` JAR были перезаписаны старыми Vue-бандлами (Makefile собирал из `.plugins/` вместо `plugins/`), которые не могли загрузиться без vue в importmap → плагины падали → пустые страницы.
- [x] **Makefile fix**: `plugins` target собирает из `plugins/<name>/pom.xml` (исходники), копирует JAR + config в `.plugins/`.
- [x] Все 5 plugin JAR пересинхронизированы (0 vue-imports).
- [x] **Единый экземпляр Preact**: main bundle externalizes `preact`/`@preact/signals` (importmap) — плагинные компоненты и shell используют один preact (устранён конфликт hooks `__H`).
- [x] **Персистентность проектов**: `config/application.yaml` добавлена `storage: files` секция (`.data/projects`); `DefaultEntityStore` → write-through flush после каждой мутации (проекты переживают рестарт).
- [x] **Запуск с конфигом**: `RUNTIME_CONFIG` (абсолютный путь) в Makefile `dev` (cwd сервера — `/`, относительный путь не работал).
- [x] Очищен мусор из `static/` (`components/`, `editors/`, тестовые html).
- [x] **Смоук PASS**: все 4 редактора + 21 компонент грузятся как Preact, 0 failed; открытый проект рендерит ui-table (12), ui-stat (9), ui-card (12), ui-badge (5); backend 224 теста PASS.

### ✅ Завершено ранее
- [x] Инфраструктура перед миграцией: globalSingleton (19 ключей), mutation bugs, canvas2d warning, Cache-Control, DOM repaint, Suspense removal, eager editor import.
- [x] M0 — Preact + Vanilla Extract build infra; M1 — CSS Extraction (7 .css.ts); M2 — все primitives TSX; M3 — 11 stores на signals; M4 — renderer/registry/services без Vue.
- [x] M5/M6 — Оболочки (CommandPalette, Sidebar, OverlayHost + 4 hosts, App.tsx) на Preact.
- [x] M7 — 21 .vue файл удалён, main.ts удалён, `vue-tsc` → `tsc`, Storybook → Preact.
- [x] Backend 202 теста PASS. Frontend-сборки PASS. WS smoke + UI smoke (headless Chrome) PASS.

### 🏗️ В РАБОТЕ: Архитектура v3 — полный уход от Vue, мульти-воркспейс, YAML SDK

Спроектировано и согласовано (ответы пользователя):

**1. Ядро = хост плагинов.** Ядро содержит: загрузчики плагинов, реестры (entity/command/ui/component), WS/HTTP, движок скриптов, тему. Вся функциональность и UI (включая builtin-компоненты и редакторы) — плагины, собираемые в единый продукт.

**2. Полный уход от Vue.** Все 21 builtin-компонент (Button, Table, Form, Stat…) + 4 редактора (Canvas/Diagram/RichText/Scene3D) → Preact TSX. Vue удаляется из всего: deps, vendor, importmap.

**3. SDK: Kotlin-код И YAML (оба пути).**
- Структура плагина: каталог файлов — `plugin.yaml` + `entities/*.yaml` + `commands/*.yaml` + `ui/*.yaml` + `scripts/*.kts` + `sql/*.sql` + `messages/en.yaml`.
- Модели: декларативные поля (ссылки `to:`, enum, валидаторы min/max/pattern) + авто-CRUD команды.
- Команды: авто-CRUD + .kts скрипты + .sql запросы + REST/gRPC исходящие вызовы.
- UI: в YAML ИЛИ в Kotlin (оба пути). i18n — отдельные файлы messages/.
- Скрипты/SQL: inline И файлы по пути.
- Loader в SDK, работает через существующий `PluginContext`.

**4. Мульти-воркспейс + сессии/проекты.**
- WS URL несёт воркспейс: `/ws/<workspace>`; проект в URL WS: `/ws/<workspace>/<projectId>`.
- Один WS = один проект; один пользователь открывает несколько WS для разных проектов; несколько сессий на один проект (реактивность).
- Активный проект хранится на сервере; команды выполняются на активном проекте сессии.
- Воркспейс = изолированный конфиг + плагины. Проект = только данные (модели/UI из воркспейса).

**5. WS-протокол v2.**
- Явный handshake: connect → workspace state + проекты → project.open.
- `subscribe/unsubscribe {entityType, filter}` с серверным фильтром → `object.changed` только подписанным.
- `commands.reloaded` событие при релоаде плагинов.
- fieldErrors: `{status:'ERROR', error:{message, fieldErrors:[{field, code, message}]}}`.
- Бэкенд валидирует params по схеме (required/типы/enum/min/max) + .kts хуки.

**6. /config разбит по секциям.**
- `/config/core`, `/config/pages`, `/config/commands` (схемы + entityType), `/config/entities`, `/config/i18n`, `/config/overlays`, `/config/components`, `/config/transport`.

**7. Кнопки с моделями данных.**
- `ButtonConfig`: `{label, command, entityType, fields, disabledWhen}` — фронт валидирует/блокирует по схеме модели и схеме команды.

### Порядок работ
1. **WS-протокол v2** (начато) — бэкенд + фронт.
2. **SDK: YAML-loader + авто-CRUD + команды** (.kts/.sql/REST).
3. **/config разбивка**.
4. **Preact-переписывание** builtin-компонентов и редакторов.
5. **Мульти-воркспейс** + сессии/проекты.
6. **Кнопки с моделями** (ButtonConfig).

---

## Архитектура миграции

### Стек
| Что | Было (Vue) | Стало (Preact) |
|---|---|---|
| VDOM | Vue 3 SFC (`<script setup>`, `computed`, `ref`, `onMounted`) | Preact (~3KB) + JSX/TSX |
| Реактивность | `reactive()` / `ref()` / `computed()` | `signal()` / `computed()` / `effect()` / `batch()` — `@preact/signals` |
| CSS | `<style scoped>` в SFC | Vanilla Extract — zero-runtime `.css.ts` файлы, type-safe токены |
| Сборка | `@vitejs/plugin-vue` + `vue-tsc` | `@preact/preset-vite` + standard `tsc` |
| Редакторы | Vue SFC (UiCanvas/UiDiagram/UiRichText/UiScene3D) | **Полный rewrite** на Preact + native API |
| Plugin API | `runtimeClient.ts` (Vue-зависимый) | Новый API с нуля (breaking change) |

### Почему именно так
- **Preact** — совместимый с React API (~3KB), все React-библиотеки работают.
- **@preact/signals** — встроенная реактивность, заменяет Vue `computed`/`ref`, работает через `signal.value`.
- **Vanilla Extract** — zero-runtime CSS-in-TS, type-safe токены, runtime **не платит** за CSS-in-JS.
- **Полный rewrite редакторов** — Vue-опыт не переносится (SFC, composition API, lifecycle hooks), проще писать чисто.
- **Breaking change для плагинов** — runtimeClient facade меняется, плагины пересобираются. Приемлемо для MVP.

### Store mapping (Vue → Signals)
| Vue concept | @preact/signals |
|---|---|
| `ref(value)` | `signal(value)` → read/write `.value` |
| `computed(() => ...)` | `computed(() => ...)` → read `.value` |
| `reactive({})` | `signal({})` — object inside signal |
| `watchEffect(fn)` | `effect(fn)` — auto-tracks dependencies |
| `watch(source, fn)` | `effect(() => { const v = source.value; fn(v); })` |
| `provide/inject` | Preact Context (`createContext`) + signals |
| `<template v-for>` | `items.map(item => <Comp />)` |
| `v-if` / `v-else` | Ternary / `&&` |
| `v-model` | `value` + `onInput` / `onChange` |
| `@click` | `onClick` |
| `:class="{ active: bool }"` | `class={bool ? styles.active : ''}` |
| `<slot>` | `{children}` prop |
| `<Suspense>` | Not needed (synchronous plugin loading in Phase M0) |

### Структура файлов (после миграции)
```
frontend/src/
├── main.tsx                    # entry — ReactDOM.createRoot, bootstrap
├── App.tsx                     # root component (layout, topbar, sidebar)
├── styles/
│   ├── global.css.ts           # Vanilla Extract global resets
│   └── tokens.css.ts           # CSS variable definitions
├── core/
│   ├── primitives/
│   │   ├── index.ts            # barrel
│   │   ├── Container.tsx
│   │   ├── Page.tsx
│   │   ├── Section.tsx
│   │   ├── Layer.tsx
│   │   ├── Tabs.tsx
│   │   ├── Toast.tsx
│   │   ├── Stack.tsx
│   │   ├── Grid.tsx
│   │   ├── Slot.tsx
│   │   ├── Portal.tsx
│   │   └── styles.css.ts       # Vanilla Extract styles for all primitives
│   ├── services/               # unchanged (pure TS, no Vue deps)
│   │   ├── pluginContext.ts
│   │   ├── entityStore.ts
│   │   ├── eventBus.ts
│   │   ├── animations.ts
│   │   ├── auditLog.ts
│   │   ├── clipboard.ts
│   │   ├── modal.ts
│   │   └── storage.ts
│   ├── ThemeProvider.tsx
│   └── PluginContextProvider.tsx
├── store/                      # all stores — @preact/signals
│   ├── config.ts
│   ├── session.ts
│   ├── data.ts
│   ├── i18n.ts
│   ├── page.ts
│   ├── router.ts
│   ├── theme.ts
│   ├── toasts.ts
│   ├── layer.ts
│   ├── cursors.ts
│   └── presence.ts
├── editor/
│   ├── editorRegistry.ts       # sync + async registration (unchanged logic)
│   ├── UiCanvas.tsx            # full rewrite — Preact + native Canvas 2D
│   ├── UiDiagram.tsx           # full rewrite — Preact + @antv/x6
│   ├── UiRichText.tsx          # full rewrite — Preact + @tiptap/core
│   ├── UiScene3D.tsx           # full rewrite — Preact + three.js
│   └── RemoteCursors.tsx
├── components/                 # shell components
│   ├── CommandPalette.tsx
│   ├── Sidebar.tsx
│   └── DocsPage.tsx
├── overlay/
│   ├── OverlayHost.tsx
│   ├── ContextMenuHost.tsx
│   ├── ModalHost.tsx
│   ├── PanelHost.tsx
│   └── TooltipHost.tsx
├── pages/                      # page-level wrappers (if any)
├── events/                     # unchanged (pure TS)
│   ├── ShortcutService.ts
│   ├── SubscriptionEngine.ts
│   ├── GestureListener.ts
│   └── eventBus.ts
├── protocol/                   # unchanged (pure TS types)
│   ├── types.ts
│   ├── componentSpec.ts
│   ├── envelope.ts
│   └── WsClient.ts
├── plugin/
│   ├── pluginLoader.ts         # rewritten for Preact (import *.tsx)
│   └── runtimeClient.ts        # new API surface
├── renderer/                   # rewritten
│   ├── bindingEngine.ts        # same logic, different reactive primitives
│   ├── componentRegistry.ts
│   ├── format.ts               # unchanged (pure TS)
│   ├── icon.ts                 # unchanged (pure TS)
│   ├── useConfig.ts            # rewritten: useSignal-based hooks
│   ├── useData.ts
│   └── useContainerQuery.ts
└── utils/
    └── globalSingleton.ts      # unchanged
```

### Plugin API (новый runtimeClient)
Плагины больше не зависят от Vue. Новый контракт:
```typescript
// runtimeClient.ts — exports
export { signal, computed, effect, batch } from '@preact/signals'
export { useSignal, useComputed, useEffect } from '@preact/signals/preact'
export { h, Fragment } from 'preact'
export type { ComponentChildren, VNode } from 'preact'

// Plugin SDK shape:
// - registerComponent(type, ComponentFn)
// - registerEditor(type, EditorFn)
// - PluginContext (entityStore, events, theme, router, modal, clipboard, auditlog, toasts, format, config)
// - All signals are cross-bundle compatible via globalThis singletons
```

---

## Фаза M0 — Инфраструктура ✅

**Цель:** заменить Vite/Vue пайплайн на Preact, убедиться что `npm run build` проходит.

### Зависимости
- [x] Добавлены dependencies: `preact` (^10.x), `@preact/signals` (^2.x), `@preact/preset-vite`, `@vanilla-extract/vite-plugin`, `@vanilla-extract/css`.
- [x] `vue` оставлен в dependencies ( временно — нужен для пока ещё существующих `.vue` файлов ).

### Конфигурация сборки
- [x] `vite.config.ts`: `vue()` → `preact()` + `vanillaExtractPlugin()`.
- [x] `vite.runtime-client.config.ts`: `preact()` + `vue()` (временный) + `vanillaExtractPlugin()`, externalize preact/signals.
- [x] `tsconfig.json`: `jsx: "react-jsx"`, `jsxImportSource: "preact"`, `.vue` убраны из include.
- [x] `tsconfig.node.json`: оба vite config в include.

### Entry point
- [x] `main.tsx` создан: Preact bootstrap (сигналы demo, lazy-load App.tsx).
- [x] `App.tsx` создан: минимальный Preact stub.
- [x] `index.html`: importmap обновлён — `preact`, `preact/hooks`, `@preact/signals` из `/vendor/`.
- [x] Vendor ESM файлы скопированы в `public/vendor/`.

### Валидация
- [x] `npm run build` — PASS (tsc + vite + runtime-client).
- [x] Bundle: 56KB main + 59KB runtimeClient + 2.5KB CSS.

---

## Фаза M1 — CSS Extraction (Vanilla Extract) ✅

**Цель:** все `<style scoped>` блоки перенесены в `.css.ts` файлы, runtime не платит за CSS-in-JS.

### Подход
1. Для каждого компонента с `<style scoped>` создаётся `styles.css.ts` в той же директории.
2. CSS-классы экспортируются как type-safe объекты (`export const container = style({...})`).
3. Компоненты импортируют `styles` и применяют `class={styles.container}`.
4. Глобальные стили (body, *, font) → `styles/global.css.ts`.
5. CSS-переменные темы (`--rt-*`) определяются в `styles/tokens.css.ts` через `:root`.

### Файлы для извлечения
| Компонент | Текущий файл | Стилей (строк) |
|---|---|---|
| App.vue | `<style>` + `<style scoped>` | ~160 |
| Container.vue | `<style scoped>` | ~20 |
| Page.vue | `<style scoped>` | ~15 |
| Section.vue | `<style scoped>` | ~15 |
| Layer.vue | `<style scoped>` | ~20 |
| Tabs.vue | `<style scoped>` | ~30 |
| Toast.vue | `<style scoped>` | ~40 |
| Stack.vue | `<style scoped>` | ~10 |
| Grid.vue | `<style scoped>` | ~15 |
| Slot.vue | `<style scoped>` | ~5 |
| Portal.vue | (нет scoped) | 0 |
| CommandPalette.vue | `<style scoped>` | ~50 |
| Sidebar.vue | `<style scoped>` | ~60 |
| OverlayHost + 4 hosts | `<style scoped>` | ~40 суммарно |
| UiCanvas.vue | `<style scoped>` | ~80 (перепишем в M5) |
| UiDiagram.vue | `<style scoped>` | ~70 (перепишем в M5) |
| UiRichText.vue | `<style scoped>` | ~60 (перепишем в M5) |
| UiScene3D.vue | `<style scoped>` | ~50 (перепишем в M5) |

### Задачи
- [x] `styles/tokens.css.ts` — определить все CSS-переменные темы (`:root`).
- [x] `styles/global.css.ts` — глобальные стили (ui-button, ui-badge через Vanilla Extract `globalStyle`).
- [x] Извлечь стили для всех primitives (`primitives/styles.css.ts` — container, page, section, layer, tabs, toast, stack, grid, slot).
- [x] Извлечь стили для shell компонентов (`commandPalette.css.ts`, `sidebar.css.ts`).
- [x] Извлечь стили для overlay hosts (`overlay/overlayStyles.css.ts` — menu, modal, panel, tooltip).
- [ ] Редакторы (Canvas, Diagram, RichText, Scene3D) — стили переписываются в M5 (пока пропустить).
- [ ] Убрать все `<style>` блоки из `.vue` файлов (заменяются на `.css.ts` импорты) — будет сделано при переписывании компонентов.

### Валидация
- [x] `npm run build` — PASS.
- [ ] Визуально: все стили сохранены (сравнить скриншоты до/после) — будет сделано при полной миграции.

---

## Фаза M2 — Core Primitives Rewrite

**Цель:** все 10 core primitives переписаны с Vue SFC на Preact TSX.

### Паттерн переписывания
```vue
<!-- БЫЛО: Container.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { useConfig } from '../renderer/useConfig'
const props = defineProps<{ componentId: string }>()
const { config } = useConfig(props.componentId)
</script>
<template>
  <div class="container" :class="`container--${config.layout}`">
    <slot />
  </div>
</template>
<style scoped>
.container { display: flex; }
.container--horizontal { flex-direction: row; }
.container--vertical { flex-direction: column; }
</style>
```

```tsx
// СТАЛО: Container.tsx
import { h, type ComponentChildren } from 'preact'
import { useConfig } from '../../renderer/useConfig'
import * as styles from './styles.css'

interface ContainerProps {
  componentId: string
  children?: ComponentChildren
}

export function Container({ componentId, children }: ContainerProps) {
  const config = useConfig(componentId)
  const layout = config.value?.layout ?? 'vertical'
  return h('div', {
    class: `${styles.container} ${styles[`container--${layout}`]}`
  }, children)
}
```

### Компоненты
- [ ] `Container.tsx` — layout (horizontal/vertical), children, gesture data attributes.
- [ ] `Page.tsx` — рендер sections/layers из page config, context provider.
- [ ] `Section.tsx` — рендер component tree из section config.
- [ ] `Layer.tsx` — z-index, opacity, position, pointer-events: pass-through (MutationObserver).
- [ ] `Tabs.tsx` — tab state (openPages, active), close/scroll/navigate.
- [ ] `Toast.tsx` — toast viewport, auto-dismiss, toasts signals.
- [ ] `Stack.tsx` — flex stack (horizontal/vertical), gap.
- [ ] `Grid.tsx` — CSS grid, responsive columns.
- [ ] `Slot.tsx` — named content zone with fallback.
- [ ] `Portal.tsx` — teleport via `createPortal`.

### Hooks (Preact)
- [ ] `useConfig(componentId)` — reads `configStore` signal, returns computed signal.
- [ ] `useData(componentId)` — reads `dataStore` signal for component data.
- [ ] `useI18n()` — returns `t()` and `tr()` from `i18nStore`.
- [ ] `useTheme()` — returns theme signals.

### Barrel
- [ ] `core/primitives/index.ts` — barrel exports for all primitives.

### Валидация
- [ ] `npm run build` — PASS.
- [ ] Все 10 primitives рендерятся (проверить на демо-странице).

---

## Фаза M3 — Store Layer Rewrite

**Цель:** все 11 store файлов переписаны с Vue `reactive`/`ref`/`computed` на `@preact/signals`.

### Паттерн переписывания
```typescript
// БЫЛО (Vue)
import { reactive, ref } from 'vue'
export const themeStore = reactive({
  mode: 'auto' as 'auto' | 'light' | 'dark',
  override: ref<string | null>(null),
})
export function cycle() { /* ... */ }

// СТАЛО (Signals)
import { signal, computed } from '@preact/signals'
const _mode = signal<'auto' | 'light' | 'dark'>('auto')
const _override = signal<string | null>(null)
export const themeStore = {
  get mode() { return _mode.value },
  get override() { return _override.value },
}
export function cycle() { /* ... */ }
```

### Stores
- [ ] `config.ts` — `configStore` (app, pages, navigation, commands, overlays, shortcuts, i18n, pluginComponents).
- [ ] `session.ts` — `sessionStore` (isConnected, projectId, WsClient, executeCommand).
- [ ] `data.ts` — `dataStore` (entityData, reportCommandError).
- [ ] `i18n.ts` — `i18nStore` (locale, t(), tr(), deepTranslate, init).
- [ ] `page.ts` — `pageStore` (activePageId, openPages, history, back/forward, openPage, closeTab).
- [ ] `router.ts` — `routerStore` (init, open, isEmbed).
- [ ] `theme.ts` — `themeStore` (mode, applyTheme, cycle, init, registerPluginTokens).
- [ ] `toasts.ts` — `toastStore` (toasts, info/warn/error, dismiss).
- [ ] `layer.ts` — `layerStore` (overrides, toggle, handleLayerEvent).
- [ ] `cursors.ts` — `cursorsStore` (remote cursors for collaboration).
- [ ] `presence.ts` — `presenceStore` (connected users).

### Singleton pattern
- [ ] Все stores используют `globalSingleton` для межбандлового шаринга (сигналы шарятся через `window[key]`).
- [ ] Убедиться что `signal` объекты шарятся (не значение, а ссылка на signal).

### Валидация
- [ ] `npm run build` — PASS.
- [ ] Все stores читаются/пишутся из компонентов.

---

## Фаза M4 — Renderer + Component Registry Rewrite

**Цель:** `bindingEngine.ts`, `componentRegistry.ts`, хуки `useConfig`/`useData` переписаны для Preact.

### Задачи
- [ ] `componentRegistry.ts` — `registerComponent(type, ComponentFn)` (Preact functional component). Убрать Vue `defineAsyncComponent`.
- [ ] `bindingEngine.ts` — сохранить логику (resolveParams, dispatchAction), заменить Vue реактивность на signals.
- [ ] `useConfig.ts` — хук читающий `configStore` signal. Возвращает `computed(() => configStore.getComponentConfig(id))`.
- [ ] `useData.ts` — хук читающий `dataStore` signal.
- [ ] `useContainerQuery.ts` — ResizeObserver + signals вместо Vue `ref`.
- [ ] `format.ts`, `icon.ts` — без изменений (чистый TS).
- [ ] `pluginLoader.ts` — переписать: загружать `.tsx` bundles вместо `.vue` / JS. `import()` для editor chunks. `registerEditorComponent()` (синхронная регистрация).
- [ ] `runtimeClient.ts` — новый facade: экспорт `h`, `Fragment`, `signal`, `computed`, `effect`, `batch` + все сервисы (pluginContext, entityStore, eventBus, modal, clipboard, auditlog, toasts, format, config). Без Vue зависимостей.

### Валидация
- [ ] `npm run build` — PASS.
- [ ] Plugin loading работает (bundles загружаются).

---

## Фаза M5 — Editor Rewrites

**Цель:** все 4 редактора переписаны с нуля на Preact + native APIs.

### Задачи
- [ ] `UiCanvas.tsx` — Preact + native Canvas 2D API. primitives (rect/ellipse/line/arrow), pen/eraser, pan/zoom, select/resize/move, z-order, toolbar, context menu, undo/redo. ~900 строк.
- [ ] `UiDiagram.tsx` — Preact + `@antv/x6`. graph config, toolbar, layout (dagre/circle/grid), stencil/dnd, history/clipboard, context menu, layers. ~850 строк.
- [ ] `UiRichText.tsx` — Preact + `@tiptap/core` (не `@tiptap/vue-3`). toolbar, extensions (mention, table, task-list), readonly, save/load, collaboration. ~500 строк.
- [ ] `UiScene3D.tsx` — Preact + `three.js`. scene graph, GLTF, camera/lights, fog, toolbar, pick/select, nested objects, textures. ~640 строк.
- [ ] `RemoteCursors.tsx` — collaboration cursors (Preact).

### Важно
- `@tiptap/core` работает без React/Vue — чистый JS. `@tiptap/vue-3` заменяется на `@tiptap/core` + ручной DOM монтаж через `useEffect`.
- `@antv/x6` — чистый JS, не зависит от фреймворка.
- `three.js` — чистый JS, рендер в `<canvas>` через `useEffect` + refs.

### Валидация
- [ ] `npm run build` — PASS.
- [ ] Все 4 редактора работают в demo (документы/диаграммы/сцена/доска).

---

## Фаза M6 — Shell Components + Overlays

**Цель:** CommandPalette, Sidebar, OverlayHost (5 файлов) переписаны на Preact.

### Задачи
- [ ] `CommandPalette.tsx` — модалка поиска команд, groups, keyboard nav, shortcut hints. ~300 строк.
- [ ] `Sidebar.tsx` — nav groups, icons, drawer (mobile), theme toggle. ~200 строк.
- [ ] `OverlayHost.tsx` — portal for all overlays.
- [ ] `ContextMenuHost.tsx` — context menu positioning, keyboard nav.
- [ ] `ModalHost.tsx` — modal dialog, backdrop, Esc close.
- [ ] `PanelHost.tsx` — slide panel (left/right/bottom).
- [ ] `TooltipHost.tsx` — tooltip positioning, show/hide.
- [ ] `DocsPage.tsx` — /docs page (render from config). ~100 строк.
- [ ] `App.tsx` — root layout (topbar/sidebar/embed), theme init, router. ~330 строк.

### Валидация
- [ ] `npm run build` — PASS.
- [ ] Полный UI работает: layout, navigation, tabs, toasts, overlays.

---

## Фаза M7 — Cleanup + Validation

**Цель:** удалить все Vue зависимости, финальная проверка.

### Задачи
- [x] Удалить `App.vue`, все оставшиеся `.vue` файлы (кроме 4 editors — собираются через `vite.editor-build.config.ts`).
- [ ] Удалить `vue` из `package.json` dependencies — **ПЕРЕСМОТРЕНО**: `vue` остаётся (editor build externalizes `vue`, импортируется через importmap).
- [ ] Удалить `@vitejs/plugin-vue`, `vue-tsc` из devDependencies — **ЧАСТИЧНО**: `vue-tsc` удалён, `@vitejs/plugin-vue` остаётся (editor build).
- [x] Заменить `@storybook/vue3-vite` на `@storybook/preact-vite` (stories → Preact, `.storybook/` обновлён).
- [x] `"src/**/*.vue"` в `tsconfig.json` exclude — оставлено (editors).
- [ ] Удалить `editor-build.config.ts` — **ПЕРЕСМОТРЕНО**: editors НЕ в основном бандле, собираются отдельно (см. `vite.editor-build.config.ts`).
- [x] `index.html` importmap обновлён: `preact`, `@preact/signals`, `@cutcrft/runtime-client` → `runtimeClient.js`, `vue` для editor bundles.
- [ ] Проверить что `.plugins/` bundles (builtin-ui, editor-*) пересобраны с новым runtime-client.
- [x] `npm run build` — PASS (tsc + vite + runtime-client).
- [x] `mvn -o -pl runtime -am test` — 202 PASS (backend не менялся).
- [ ] Демо: все страницы работают (boards/tasks/docs/diagram/scene/export).
- [x] WS smoke: create → task → save → list — PASS (протестировано websockets).
- [x] UI smoke (headless Chrome): main app рендерится (topbar/sidebar/tabs/empty-state), /docs рендерится (40 команд / 8 групп).
- [x] Размер bundles: main ~54KB (19KB gzip), App ~21KB (7.7KB), DocsPage ленивый ~3.5KB (1.2KB), runtimeClient ~59KB (16.6KB).
- [x] Обновить `runtimeClient.ts` docs / JSDoc.

---

## Фаза V1 — WS-протокол v2 (ядра + фронт)

**Цель:** явный handshake воркспейс/проект, подписки по моделям с серверным фильтром, fieldErrors, commands.reloaded.

### Backend
- [x] `WsMessageType`: добавить PROJECT_BOUND, SUBSCRIBE, UNSUBSCRIBE, COMMANDS_RELOADED, WORKSPACE_STATE.
- [x] `CommandResult`: поле `fieldErrors: List<FieldError>` (SDK) + `validationError()`.
- [x] `CommandParameter`: добавить `entityType?`, `enum?`, `min?/max?`, `pattern?` для схемы валидации.
- [x] `CommandValidator` (new): валидация params по схеме команды → fieldErrors (required, типы, enum, min/max, pattern). 9 тестов PASS.
- [x] `CommandExecutor`: вызов validator перед выполнением; fieldErrors в результате.
- [x] `WsSessionHandler.sendCommandResult`: fieldErrors в payload (поле fieldErrors[]).
- [x] `Session`: поле `workspaceId`, подписки `Map<entityType, List<SubscriptionFilter>>` + add/remove/clear.
- [x] `WsSessionHandler`: URL `/ws/{workspace}/{projectId}` + `/ws/{workspace}` + legacy `/ws`; bind проекта при connect; `project.bound` ответ.
- [x] `subscribe/unsubscribe` хендлеры; серверный фильтр по entityType + filter.
- [x] `WsEventPublisher`: object.changed только подписанным сессиям (pure matcher `acceptsSubscription`, value→Map через Jackson). 7 новых тестов PASS.
- [x] `commands.reloaded`: broadcast после релоада плагинов (RuntimeReloader → `broadcastCommandsReloaded`).
- [x] Фикс: presence join на connect (presence.list → self, broadcast → others; без «Channel was cancelled»).
- [x] **WS v2 смоук PASS**: project.bound при connect, подписка demo.task filter{status=done} — open подавлен, done доставлен; fieldErrors на demo.create без title.
- [x] Полный backend: 209 тестов PASS (было 202, +7).

### Frontend
- [x] `envelope.ts`: WS_MESSAGE_TYPES + FieldError, ProjectBoundPayload, CommandsReloadedPayload.
- [x] `WsClient.ts`: URL `/ws/<ws>/<project>`, subscribe/unsubscribe API, WsClientOptions.
- [x] `sessionStore`: workspaceId, project.bound handling, commands.reloaded handling, subscribe/unsubscribe.
- [x] `dataStore`: auto-subscribe по entityType при loadList.
- [x] `runtimeClient`: `fieldErrorMap()` helper + FieldError/CommandResultPayload типы.
- [ ] fieldErrors маппинг на формы (Form/Input показ ошибок полей) — V4 (формы переписываются на Preact).
- [x] Frontend build PASS; headless Chrome smoke PASS (app рендерится).

### Известные ограничения V1
- `demo.taskcreate` (TaskScript) не декларирует параметры → валидация пропускается. Покрывается в V2 (EntityModelScript будет генерировать параметры из схемы модели).

---

## Фаза V2 — SDK: YAML-loader + авто-CRUD

**Цель:** плагин формируется YAML-каталогом (entities/, commands/, ui/, scripts/, sql/, messages/) + Kotlin-код. Loader в SDK.

### SDK
- [x] `EntityField` schema: type, required, enum, min/max, pattern, reference(to), description, default.
- [x] `EntitySchema` (entityType, titleField, idField, fields) + `toConfigMap()`.
- [x] `EntityDefinition` расширен: `schema: EntitySchema?`; `SchemaEntityDefinition` (Map-based модель).
- [x] `SchemaValidator` — декларативная валидация Map-моделей (required, типы, enum, min/max, pattern, uuid, reference) + partial-update `validateProvided`. 7 тестов PASS.
- [x] `SchemaCrudCommands` — авто-CRUD (create/update/delete/list/validate) из схемы, Map-модели, params из схемы. 6 интеграционных тестов PASS.
- [x] `YamlEntityParser` — entities/*.yaml → SchemaEntityDefinition. 3 теста PASS.
- [x] `YamlCommandParser` — commands/*.yaml: auto-CRUD ref + script (.kts inline/file) + sql + rest. crudFactory (инжектится runtime).
- [x] `YamlUiParser` — ui/*.yaml → UIDefinition (Page/Navigation/Shortcut/...). 2 теста PASS.
- [x] `YamlMessagesParser` — messages/*.yaml → locale→(key→text).
- [x] `YamlPluginLoader` (SDK) — читает каталог плагина, регистрирует через PluginContext.
- [ ] `CommandContext.invokeRest`/`invokeGrpc` — REST/gRPC уже есть через `invokeDataSource` (InfrastructureCommand); YAML `rest:` команда готова.
- [ ] Demo-плагин перевести частично на YAML (пример: entities/commands YAML, UI Kotlin) — **ЧАСТИЧНО**: создан отдельный YAML-demo плагин (`.plugins/yaml-demo/`), demo-plugin остаётся Kotlin (оба пути работают).

### Runtime интеграция
- [x] SnakeYAML добавлен в sdk/pom.
- [x] `YamlResourceLoader` (runtime) — читает `yaml/` ресурсы из plugin JAR. 2 теста PASS.
- [x] `PluginBootstrap`: crudFactory wiring + загрузка entities/commands/ui/messages из JAR-ресурсов.
- [x] YAML-only плагины: `PluginDescriptor.mainClass` → nullable; `PluginManager` пропускает instantiate; directory-режим (`.plugins/yaml-demo/yaml/`).
- [x] `MessageCatalogLoader.loadFromJar` + `PluginAssetsService` поддержка directory-режима.
- [x] Полный backend: 217 тестов PASS (было 215, +2).
- [x] **YAML-demo плагин** (`.plugins/yaml-demo/`): entities/commands/ui/messages на чистом YAML. Смоук PASS:
  - `yaml-demo.projectcreate` SUCCESS (авто-CRUD)
  - `yaml-demo.projectcreate` без name → fieldErrors `[{field: name, code: required}]`
  - `yaml-demo.projectlist` возвращает сущность
  - `yaml-demo.stats` (.kts скрипт) → `{total: 1, active: 1}`
  - Page `yaml-projects` + Navigation `nav-yaml-projects` в /config

---

## Фаза V3 — /config разбивка по секциям

**Цель:** вместо одного большого /config — отдельные эндпоинты.

- [x] `HttpEndpoints`: `/config/core` (app, routing, transport, protocol, dev, collaboration), `/config/pages`, `/config/commands`, `/config/entities`, `/config/i18n`, `/config/overlays`, `/config/components`. 7 новых тестов PASS.
- [x] Entities со схемами полей: `EntityEntry.schema` (EntitySchema.toConfigMap) — для V6 привязки кнопок к моделям.
- [x] Frontend типы: `EntityFieldSchema`/`EntitySchema`/`EntityEntry.schema`.
- [x] Наследуемый `/config` → полный конфиг сохранён (backward-compat).
- [x] Frontend `configStore`: `CONFIG_SECTIONS` + `loadSection()` + `loadShellSections()` + `loadI18n()`; старт грузит только `/config/core` (~2KB vs ~50KB, -96%).
- [x] `main.tsx`: загрузка shell-секций + i18n после core.
- [x] `DocsPage`: грузит секцию `commands` по требованию.
- [x] Смоук PASS: 7 эндпоинтов 200; app рендерится (YAML Demo nav + YAML Projects); /docs рендерится.
- [x] Полный backend: 224 теста PASS (было 217, +7).

---

## Фаза V4 — Preact-переписывание builtin-компонентов и редакторов

**Цель:** полный уход от Vue. Все компоненты и редакторы — Preact TSX плагины.

### Builtin-компоненты (21) — Vue → Preact TSX
- [x] Все 21 компонента переписаны на Preact TSX: Text, Image, Badge, Divider, Space, Button, Card, Tabs, Grid, Stat, List, Table, Form, Input, Select, Textarea, Checkbox, Avatar, Progress, Accordion, Frame.
- [x] `vite.component-build.config.ts` → Preact build (external preact/signals/runtime-client).
- [x] `@preact/signals-core` + `preact/jsx-runtime` добавлены в vendor и importmap (необходимы для внешних бандлов).
- [x] `builtin.css` (frontend/src/styles) — все стили компонентов глобально (были Vue-scoped).
- [x] `BuiltinUiPlugin.kt`: убран cssPath (стили теперь в main bundle).
- [x] **Смоук PASS**: все 21 бандл загружаются как Preact, 0 ошибок; `.ui-button`/`.ui-stat` рендерятся в DOM.

### Редакторы (4) — Vue → Preact TSX ✅
- [x] `UiRichText.tsx` — @tiptap/core (без /vue-3) + Preact, ручной DOM-монтаж, toolbar/mentions/tables/save-load, RemoteCursors.
- [x] `UiCanvas.tsx` — native Canvas 2D + Preact (toolbar, tools, undo/redo, layers, resize, context menu).
- [x] `UiDiagram.tsx` — @antv/x6 + dagre + Preact (stencil/dnd, layout, history/clipboard, cursor overlay).
- [x] `UiScene3D.tsx` — three.js + Preact (scene graph, GLTF, camera/lights, raycast pick, context menu).
- [x] `vite.editor-build.config.ts` → Preact build (external preact/signals/runtime-client).
- [x] Стили редакторов: `richtext.css`, `canvas.css`, `diagram.css`, `scene3d.css`.

### Валидация ✅
- [x] `vue`, `@tiptap/vue-3`, `@vitejs/plugin-vue` удалены из package.json; vue удалён из importmap + vendor.
- [x] `npm run build` PASS; tsc PASS (0 .vue файлов в frontend + plugins).
- [x] **Смоук PASS**: все 4 редактора + 21 компонент загружаются как Preact, 0 failed, 0 vue-imports во всех 5 plugin JAR.
- [x] Backend 224 теста PASS.

---

## Фаза V5 — Мульти-воркспейс + сессии/проекты

**Цель:** несколько воркспейсов, изолированные конфиги+плагины; сессия↔проект (1 WS = 1 проект).

- [x] `WorkspaceRuntime` — изолированный срез (config, registries, workspaceConfiguration, sessions).
- [x] `WorkspaceServices` — сервисы воркспейса (dispatchService, sessionManager, projectService, eventPublisher, presence, activeSessions).
- [x] `WorkspaceRegistry` — реестр воркспейсов по id (default + дополнительные).
- [x] `WorkspaceBuilder` — строит изолированный воркспейс (разделяя entityStore/locks/dispatcher).
- [x] `Main.kt` — default-воркспейс из application.yaml + `workspaces/<id>/application.yaml` автодискавери.
- [x] `WebServer` — резолвит воркспейс из `/ws/{workspace}` и `/ws/{workspace}/{projectId}` (пер-воркспейс dispatch).
- [x] `HttpEndpoints` — `/config/{workspace}` + `/config/{workspace}/{section}` (изоляция конфигов), `/workspaces` (список), legacy `/config` → default.
- [x] Frontend: `configStore.setWorkspace()` (загрузка конфига воркспейса), `sessionStore.setWorkspace()` (переключение + reconnect WS), workspace switcher в topbar, boot из persisted workspace.
- [x] Тесты: HttpEndpointsTest +1 (V5 per-workspace config изоляция) — 18 PASS.
- [x] **Смоук PASS**: default (TITLE=Доска, 8 nav, Диаграмма), alt (TITLE=Alt Workspace, 0 nav); `/config/nope` 404; `/ws/alt` — `demo.create` → "Command not found".
- [x] Backend 225 тестов PASS.

---

## Фаза V6 — Кнопки с моделями данных

**Цель:** ButtonConfig `{label, command, entityType, fields, disabledWhen}` — типизированная привязка команд к моделям.

- [x] `ButtonConfig` расширен: `entityType`, `fields`, `disabledWhen` (componentSpec.ts).
- [x] `TableRowAction` расширен: `entityType`, `fields`, `disabledWhen`.
- [x] `renderer/modelBinding.ts`: `entitySchema()` (из /config/entities), `isDisabledByModel()`, `buildModelParams()` (fields/entityType), `missingRequiredFields()`.
- [x] `runtimeClient` экспортирует modelBinding хелперы (для плагинных бандлов).
- [x] `UiButton`: модель-бинддинг — params из fields/entityType, disabled по disabledWhen.
- [x] `UiTable`: rowActions с entityType/fields/disabledWhen (params авто-сбор, кнопки блокируются).
- [x] Demo: `demo.reopentask` команда + rowAction "Вернуть" c `entityType: demo.task`, `fields: {id: $row.id}`, `disabledWhen: {status: open}`.
- [x] i18n: `demo.tasks.reopen` (en/ru).
- [x] **Смоук PASS (browser)**: на странице tasks кнопка "Вернуть" у open-задачи `disabled=true`, у done-задачи `disabled=false`. Backend: `demo.reopentask` → SUCCESS для done, ERROR для open.
- [x] Backend 224 теста PASS.

---

## Фаза V7 — стилистика, авто-обновление, plugin-driven root, чистка

### V7.1 — Типизированная тема в YAML
- [x] Backend: `ThemeConfig` → `{ mode, palette:{light,dark}, typography, radii, spacing, motion }` (семантические блоки).
- [x] `ConfigLoader.parseTheme` — парсинг типизированной темы.
- [x] Frontend: `theme.ts` — flatten типизированной темы в `--rt-*` (палитра/типографика/радиусы/спейсинг/моушн), fallback на default.
- [x] Демо-конфиг: полная типизированная тема (palette/typography/radii/spacing/motion).
- [x] **Смоук PASS**: /config/core отдаёт typed theme; браузер применяет `--rt-color-bg=#f5f6f8`, `--rt-duration-normal=240ms`, `--rt-easing-default=cubic-bezier(...)`.

### V7.2 — Storybook каталог (/uidocs, dev-only)
- [x] Сторибуки: `ThemeTokens` (палитра/радиусы/спейсинг reference), `Button` (5 вариантов), `Display` (Stat/Badge/Progress/Tabs), `ComponentHost` (config-driven).
- [x] `uidocsRoot` резолвится из нескольких путей (исправлен cwd=/ баг).
- [x] `/uidocs` работает в dev (200, storybook-static), отключается при dev.enabled=false.
- [x] `npm run build-storybook` PASS.

### V7.3 — Авто-обновление (реактивный useData)
- [x] `dataStore`: per-entity `revisionSignal(entityType)` (реактивный сигнал, бампится при invalidate/object.changed).
- [x] `useData`: `useSignalEffect` — реактивный reload по revision-сигналу + subscribe к entityType.
- [x] Table: `showRefresh` default → false (кнопка Обновить скрыта, авто-обновление вместо неё).
- [x] **Смоук PASS**: браузерный тест — после мутации через WS (MUTATED=SUCCESS) badge сменился open→done без ручного клика (T_AFTER=done).
- [ ] Мягкие анимации при обновлении данных (fade/flash).

### V7.4 — Полностью plugin-driven root
- [x] Backend: `AppShell`/`ShellTopbar`/`ShellSidebar`/`ShellAction` в AppConfiguration.
- [x] `buildApp` → `buildShell` — парсинг декларативного шелла из App UI-дефиниции плагина.
- [x] Frontend: `AppShell`/`AppConfiguration` типы; App.tsx рендерит плагинные shell actions (navigate/command) вместо fallback Back/Forward/Theme.
- [x] Демо-плагин: `shell.topbar.actions` (nav-tasks, nav-boards).
- [x] **Смоук PASS**: topbar рендерит только плагинные кнопки ({{demo.page.tasks}}, {{demo.page.boards}}), fallback Back/Forward/Theme скрыты; клик по плагинной кнопке → навигация на tasks.
- [x] Backend 225 тестов PASS.
- [ ] Демо-плагин: sidebar тоже из плагина (пока навигация из конфига).
- [ ] CommandPalette/Sidebar переедут в плагин.

### V7.5 — Чистка мёртвого кода
- [ ] Удалить неиспользуемые primitives (Stack, Slot, Portal), ThemeProvider.
- [ ] Удалить неиспользуемые типы/экспорты из runtimeClient/componentSpec.
- [ ] Скрипт-отчёт неиспользуемых файлов/экспортов.
- [ ] `npm run build` PASS, backend тесты PASS.

---

## Риски и митигация

| Риск | Вероятность | Митигация |
|---|---|---|
| `@tiptap/core` без React/Vue — неочевидный API | Средняя | tiptap — чистый JS; DOM-монтаж через `useEffect` + `element.appendChild` |
| `@antv/x6` — unexpected Vue deps | Низкая | x6 — чистый JS; проверить `package.json` x6 |
| `three.js` — disposal/pipeline | Низкая | three — чистый JS; `useEffect` cleanup = `renderer.dispose()` |
| Plugin bundles сломаются | Высокая | breaking change: пересобрать все плагины, runtimeClient facade меняется |
| CSS-переменные темы не работают | Низкая | Vanilla Extract генерирует CSS, переменные `--rt-*` остаются теми же |
| `globalThis` singleton не шарит signals | Средняя | signal objects шарятся через `window[key]`, `.value` — реактивно |
| Storybook ломается | Средняя | заменить `@storybook/vue3-vite` на `@storybook/preact-vite` |
