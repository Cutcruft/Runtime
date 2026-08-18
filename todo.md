# CutCruft — План работ: редакторы (TipTap/X6/three.js/canvas), i18n, overlays, сборка

Статус легенды:
- `[ ]` — задача не начата
- `[~]` — в работе
- `[x]` — выполнено (с результатом)
- `[!]` — блокер / пересмотрено

---

## Текущий статус (18.08.2026)

**Готово:** Фазы 0–8, 10.2, 11, 12, 14, блоки B, D, A, C и E ядра, Фаза 13.1 полностью, Фаза 13.2 (вынос builtin UI в плагины), полный suite `mvn -o -pl runtime -am clean test` = 202 PASS, WS smoke всех типов команд PASS.

**Фаза 13.1 — Модульность UI (полностью завершена):**
- SDK: `FrontendComponentDefinition`, `PluginContext.registerFrontendComponent()`.
- Backend: `Main.kt`/`RuntimeReloader`/`WorkspaceConfigurationBuilder` (pluginComponents + component type validation), `PluginAssetsService` (js/css/fonts/map + 10 расширений).
- Frontend: `runtimeClient.ts` facade (~50 API), `pluginLoader.ts` (EDITOR_TYPE_MAP + MIGRATION_ALIASES), `index.html` importmap, vendor Vue ESM, `vite.runtime-client.config.ts`.
- Editor plugins: 4 Maven modules (editor-canvas/richtext/diagram/scene3d), JARs с clean structure (`com/...Plugin.class + frontend/<name>.js + style.css`).
- Capability flags: проверены по исходникам, исправлены (Canvas +6, RichText +2, Diagram +7, Scene3D −1 false positive +3).
- Migration aliases: `canvas2d`↔`canvas`, `richtext`↔`richtext`, `diagram`↔`diagram`, `scene3d`↔`scene3d`.
- Component type validation: `WorkspaceConfigurationBuilder.validateComponentTypes()` — warning при неизвестных типах в конфиге страниц.

**Фаза 13.2 — Вынос builtin UI-компонентов в плагины (полностью завершена):**
- Все 21 builtin компонент (Text, Image, Badge, Divider, Space, Button, Card, Tabs, Grid, Stat, List, Table, Form, Input, Select, Textarea, Checkbox, Avatar, Progress, Accordion, Frame) вынесены из ядра в плагин `builtin-ui`.
- `runtimeClient.ts` расширен: экспорт `ComponentHost`, `mountShortcut`, `registerShortcut`, `emitShortcutAction`, + подтипы (`FormFieldConfig`, `BadgeTone`, `TableColumnConfig`, `TableRowAction`, `TablePaginationConfig`, `TabsItemConfig`, `AccordionItemConfig`, `ButtonVariant`, `ButtonSize`).
- Все 21 `.vue` файлов переписаны: импорты из `@cutcrft/runtime-client` вместо внутренних модулей (`useConfig`, `useData`, `bindingEngine`, `format`, `icon`, `session`, `i18n`, `toasts`, `ComponentHost`, `ShortcutService`, `componentSpec`).
- `componentRegistry.ts` очищен: удалены все hardcoded импорты, `registerBuiltinComponents()` стал no-op; компоненты загружаются через `pluginLoader.ts`.
- `vite.component-build.config.ts`: Vite lib-build для всех 21 компонентов, `vue` + `@cutcrft/runtime-client` externalized, стабильный chunk name `vendor.js`.
- 21 JS-бандл (0.6–12 KB каждый, ~45 KB суммарно) + `style.css` (14.6 KB).
- Maven-модуль `plugins/builtin-ui/`: `BuiltinUiPlugin.kt` регистрирует все 21 компонент; JAR: `com/...Plugin.class + frontend/*.js + frontend/style.css` (clean structure).

**Ближайшие шаги по плану:**
- [ ] **Фаза 13 (кастомные компоненты)** — спроектировать API добавления кастомных компонентов в редакторы (Canvas2D, Diagram, Scene3D) через плагины.
- [ ] **Фаза 10.3 Storybook / UIDocs** — расширить stories для builtin-компонентов и редакторов; visual regression; plugin-provided component docs.

---

## Решения, зафиксированные с пользователем

| Вопрос | Решение |
|---|---|
| Доставка JS редакторов | **Pre-built JS bundles в JAR**. Каждый редактор — отдельный плагин (`editor-canvas/richtext/diagram/scene3d`), собирается Vite lib-build, копируется в `resources/frontend/` JAR. Frontend грузит через dynamic `import()` по URL из `/config` `pluginComponents[]`. runtime-client facade реэкспортирует API плагинам. |
| Хранение контента | **Объекты runtime**: сущность плагина (напр. `demo.document`) с JSON-полем `content`; загрузка через `data`-биндинг, сохранение командой `document.save`. |
| three.js | **Декларативный scene-graph**: меши/материалы/свет/камеры в конфиге + загрузка GLTF/GLB ассетов с `/plugin-assets/...`. |
| X6-диаграммы | **Полная конфигурируемость движка через плагины**: declarative-конфиг покрывает engine/shapes/plugins/layout. Escape-hatch — кастомный код через `registerComponent`. |
| i18n | **Ресурсы в JAR плагина** (`messages/<lang>.json`), runtime агрегирует в `/config`; ссылка на перевод в конфиге — интерполяция `{{<pluginId>.<key>}}` (в т.ч. частичная), fallback локаль → `defaultLocale` → ключ; в коде `t(key, params)`. Резолв — на клиенте. |
| Модалки/меню/тултипы | **Декларативные триггеры**: конфиг-привязка к типам компонентов/объектов + события жестов (contextmenu/dblclick/selection/drag) на eventBus. |
| Canvas 2D | **Оба**: интерактивная доска (примитивы) + свободное рисование. Нативный Canvas 2D API, минимум зависимостей. |

---

## Фаза 0 — Фундамент

### 0.1 i18n в ядре

**Цель:** плагины поставляют переводы ресурсами JAR; runtime агрегирует каталоги; фронт переводит свои тексты.

#### Backend / SDK
- [x] `sdk`: формат каталога — JSON `{ "key": "value" }` в `messages/<lang>.json` в ресурсах JAR (док: комментарии в `MessageCatalogLoader`).
- [x] `runtime`: `MessageRegistry` (`application/i18n/MessageRegistry.kt`) — агрегация каталогов, неймспейсинг ключей `<pluginId>.<key>`, core — `core.*`.
- [x] `runtime`: `MessageCatalogLoader` (`infrastructure/i18n/MessageCatalogLoader.kt`) — сканирование `messages/*.json` в JAR плагина (JarFile по `descriptor.jarPath`) + загрузка core-каталога из classpath; флаттеннинг вложенных объектов в точечные ключи.
- [x] `runtime`: `WorkspaceConfiguration.i18n` (`I18nConfiguration`: `defaultLocale`, `locales`, `messages`) + `WorkspaceConfigurationBuilder.buildI18n` (принимает `MessageRegistry`).
- [x] `runtime`: `ApplicationConfig`/`RuntimeConfig` — секция `i18n.defaultLocale` + `ConfigLoader`.
- [x] `runtime`: core-каталог `runtime/src/main/resources/messages/en.json` (`core.*`), подключён в `Main.kt`.
- [x] `runtime`: тесты `MessageCatalogLoaderTest` (загрузка из jar, неймспейсинг, флаттеннинг, classpath core) — PASS.

#### Frontend
- [x] `frontend/src/store/i18n.ts` — стейт локали, `t(key, params)` (интерполяция `{param}`, плюрализация `_one`/`_many`), `setLocale` (localStorage), init из `/config`, `useI18n`.
- [x] `frontend/src/protocol/types.ts` — `I18nConfiguration` в `WorkspaceConfig`; `configStore.i18n`.
- [x] `main.ts` — `i18nStore.init` после загрузки конфига.
- [x] Переведены тексты: `UiTable` (поиск/rows/refresh/loading/empty/delete), `UiForm` (submit/loading), `CommandPalette` (placeholder/empty), `UiList` (loading/empty).

**Результат:** `[x]` — выполнено. Backend PASS (mvn test), frontend собирается (vue-tsc + vite, 94 модуля).

### 0.2 Overlay / жесты («вебхуки»)

**Цель:** декларативные модалки/меню/панели/тултипы + события жестов, на которые они вешаются.

#### componentSpec
- [x] Типы: `OverlayDefinition` (базовый), `MenuSpec` (`items: MenuItem[]` c командами/действиями/подменю), `ModalSpec` (`title`, `content: ComponentDefinition`, `footer`), `PanelSpec` (`side: left|right|bottom`, `width`), `TooltipSpec` (`text`/`content`, `placement`).
- [x] `TriggerSpec`: `event: 'contextmenu' | 'dblclick' | 'selection' | 'hover' | 'drag'`, `target: { componentType?, objectType?, componentId? }`, `action: 'openMenu' | 'openModal' | 'openPanel' | 'openTooltip'`, `menu/modal/panel/tooltip` ссылка или inline.
- [x] `ActionBinding` расширить: `openMenu`, `openModal`, `openPanel`, `closeOverlay`, `copyToClipboard`.
- [x] Компонентный конфиг: `contextMenu?: MenuSpec`, `tooltip?: TooltipSpec`, `overlays?: OverlayDefinition[]` на `BaseComponentConfig`.

#### Frontend (механика)
- [x] `frontend/src/overlay/overlayService.ts` — реактивный стек оверлеев (`open/close/toggle`), приоритет, z-index, закрытие по Esc/клику вне.
- [x] Компоненты-хосты: `ContextMenuHost.vue`, `ModalHost.vue`, `PanelHost.vue`, `TooltipHost.vue` (+ `OverlayHost.vue` — телеморт всех).
- [x] `frontend/src/events/GestureListener.ts` — глобальный перехват `contextmenu`, `dblclick`, `selectionchange`, drag-инициация; публикует на eventBus `gesture.<event>` с контекстом `{componentType, objectType?, row?, x, y}`.
- [x] `GestureContext` (inject/provide) — каждый компонент отдаёт свой тип/контекст (для таблиц — объект строки).
- [x] `SubscriptionEngine`/диспетчер: событие жеста → поиск триггера по конфигу (глобальные `workspace.overlays` + локальные в конфиге компонента) → открыть оверлей с резолвом параметров (`$row.id` и т.п.).
- [x] `bindingEngine.dispatchAction`: реализовать `openModal/openPanel/openMenu/closeOverlay/copyToClipboard`.

#### Backend
- [x] Модели `OverlayEntry`/`OverlayTriggerEntry`/`MenuItemEntry` в `WorkspaceConfiguration`.
- [x] `UiConfig.overlayComponentType`/`overlayTriggerComponentType` + defaults в `application.yaml` + `ConfigLoader`.
- [x] `WorkspaceConfigurationBuilder.buildOverlays`/`buildOverlayTriggers`/`buildMenuItems`/`buildComponent`.
- [x] Демо: оверлей `task-row-menu` (Complete/Delete/Copy/Open modal) + `task-details-modal` + триггер `contextmenu` на `Table`+`demo.task`.
- [x] Gesture-метаданные: `ComponentHost` (`data-gesture-type`), `UiTable` строки (`data-gesture-object-type`, `data-gesture-row` JSON).

**Результат:** `[x]` — выполнено. Фронт собирается (vue-tsc + vite), runtime PASS, smoke `/config` отдаёт оверлеи и триггеры.

---

## Фаза 1 — Каркас редакторов

- [x] `frontend/src/editor/editorRegistry.ts` — ленивая регистрация: `registerEditor(type, () => import(...))`, `resolveEditor` с кэшем `defineAsyncComponent`, `isEditorType`, `registeredEditorTypes`.
- [x] `ComponentHost.vue` — поддержка асинхронных компонентов: сначала `editorRegistry` (async), потом builtin-реестр; `<Suspense>` + фолбэк-скелетон (`component-loader`), `data-gesture-type` сохранён.
- [x] `componentSpec.ts` — `EditorBaseConfig` (`content: DataBinding`, `save: {command, params}`, `readonly`, `height`, `placeholder`) + `EditorSaveSpec`. Пер-редакторные конфиги — в Фазе 2.
- [x] `runtime`: `GET /plugin-assets/<pluginId>/<path>` — `PluginAssetsService` (чтение из JAR по `descriptor.jarPath`, нормализация пути без traversal, вайтлист расширений gltf/glb/bin/json/png/jpg/webp/svg/gif/ktx2/hdr/tga, лимит 16 МБ) + маршрут в `HttpEndpoints` (content-type по расширению) + подключение в `Main.kt`.
- [x] Тест `PluginAssetsServiceTest` (доступные типы, traversal, disallowed ext, unknown plugin) — PASS.
- [x] Демо-ассет `demo-plugin/src/main/resources/assets/scene.glb` — smoke `/plugin-assets/demo/assets/scene.glb` → 200 `model/gltf-binary`.

**Результат:** `[x]` — выполнено. Фронт собирается (111 модулей), runtime тесты PASS, smoke endpoint в порядке.

**Заметка:** модель контента демо (`demo.document` + команды) — перенесена в Фазу 4, как и планировалось.

---

## Фаза 2 — Редакторы (каждый — ленивый чанк)

### 2.1 RichText (TipTap) — `@tiptap/vue-3`
- [x] Установить deps (tiptap core + starter-kit, link, underline, placeholder, table, task-list, image — все `^2.27.2`).
- [x] `UiRichText.vue`: загрузка контента через `data`-биндинг, дебаунс-сохранение командой (600 мс), режим `readonly`/`disabled`, тулбар.
- [x] Конфиг: `extensions: [{name, options}]`, `toolbar: [...]` (или `false`), `placeholder`, `contentFormat: 'json'|'html'`, `height`.
- [x] Mention с dataSource (опции из команды плагина `demo.mentions`) — Фаза 5.
- [x] Контекстное меню нод X6-диаграмм (overlay + клиентский экшен `editor`) — Фаза 5.

### 2.2 Diagram (X6) — `@antv/x6`
- [x] Установить deps (`@antv/x6@^2.19.2`, плагины `selection`/`snapline`; snapping в 2.x выпилен из ядра — заменён snapline).
- [x] `UiDiagram.vue`: контент `{nodes, edges}` (JSON), сохранение командой, select/delete/fit, add-edge в режиме «источник→цель».
- [x] Конфиг движка: `grid`, `panning`, `mousewheel`, `toolbar` (или `false`), подключение рёбер (magnet/manhattan/rounded), `readonly`.
- [x] Кнопка `layout` (грид-раскладка: сортировка по (y,x), `Math.ceil(sqrt(n))` колонок) + конфиг `layout: {gapX, gapY}`.
- [x] `layout {dagre|circle}`, dnd/stencil-палитра, history/clipboard/keyboard — **реализовано в Фазе 8.2** ([x] ниже), escape-hatch через `registerComponent` сохранён.
- [x] Документация маппинга конфиг→Graph API — `docs/Редакторы.md`.

### 2.3 Scene3D (three.js)
- [x] Установить deps (`three@^0.185.1`, `@types/three`).
- [x] `UiScene3D.vue`: процедурная сцена из `content` (box/sphere/cylinder/model-gltf), тулбар add/delete/resetCamera, pick по клику, авто-вращение.
- [x] Схема `camera` (`fov/position/target`, применяется при старте и в resetCamera) + `lights` (`ambient.intensity`, `directional.intensity/position`) — декларативно.
- [x] Nested objects, textures, environment/fog — **реализовано в Фазе 8.3** ([x] ниже, упрощённо); GLTF через `GLTFLoader` + `/plugin-assets/`.
- [x] Ленивая инициализация renderer при монтировании; cleanup (dispose geometry/material/renderer/controls/RAF) при размонтировании.

### 2.4 Canvas2D — доска + рисование (нативный Canvas 2D API)
- [x] `UiCanvas.vue`: примитивы (rect/ellipse/line/arrow) + свободные штрихи (pen/eraser), pan/zoom, сетка, palettа + толщина.
- [x] Инструменты из конфига: `toolbar: [select, pan, draw, erase, rect, ellipse, line, arrow, front, back, clear]`, `colors`, `widths`, `tool`, `grid`, `background`.
- [x] Выделение + перемещение перетаскиванием + resize за 8 ручек (Shift — пропорции) + z-order (`front`/`back` кнопки и `⌘[`/`⌘]`) + удаление (Delete/Backspace).
- [x] Сохранение сцены в объект runtime (JSON `{elements}`), дебаунс 600 мс.

**Результат:** `[x]` — выполнено. Все 4 редактора — ленивые чанки (не в начальном бандле 137 КБ): RichText 374 КБ, Diagram 497 КБ, Scene3D 639 КБ, Canvas 12 КБ. vue-tsc + vite build PASS. Canvas2D: перемещение/resize (8 ручек, Shift-пропорции)/z-order. Diagram: кнопка `layout` (грид). Scene3D: `camera`/`lights` декларативно. Документация маппинга — `docs/Редакторы.md`.

---

## Фаза 3 — Оптимизация сборки

- [x] `vite.config.ts`: ленивые `dynamic import()` уже изолируют каждую либу в свой чанк (RichText/TipTap, Diagram/X6, Scene3D/three, Canvas — по одному чанку на редактор); `manualChunks` не требуется — либы не шарится между начальным бандлом и редакторами.
- [x] `chunkSizeWarningLimit` поднят до 700 КБ (единственный чанк >500 КБ — ленивый Scene3D 638 КБ).
- [x] Проверено: чанки грузятся только при использовании типа (появление в конфиге) — `dist/` анализ + код-сплит.
- [x] Начальный бандл не вырос: `index` 137.7 КБ (48.9 gzip), 1178 модулей суммарно.
- [x] (Опция/позже) JS-бандлы плагинов — escape-hatch задокументирован (`registerComponent` + будущий `registerComponent` с JS-бандлами плагинов в `componentRegistry.ts`); не требуется для MVP.

**Результат:** `[x]` — выполнено. Сборка чистая, без предупреждений.

---

## Фаза 4 — Демо-плагин и проверка end-to-end

- [x] `demo.document` сущность (`DocumentDefinition` + `Document`) и команды `demo.createdocument` / `demo.listdocuments` / `demo.loaddocument` / `demo.savedocument` (upsert по UUID id, объекты runtime). Плоские имена команд — конвенция движка (`^[a-z][a-z0-9]*$`).
- [x] Страница «Документы»: UiRichText (content→`demo.loaddocument`, save→`demo.savedocument`).
- [x] Страница «Диаграммы»: X6-граф (ноды/рёбра), сохранение.
- [x] Страница «Scene»: three.js сцена (box/sphere/cylinder + GLTF через `/plugin-assets`), сохранение.
- [x] Страница «Whiteboard»: canvas с примитивами и рисованием, сохранение.
- [x] i18n: core-каталог в runtime теперь `en.json` + `ru.json` (все `core.*` ключи, включая `editor.*`, `editor.canvas.front/back`, `editor.diagram.layout`); каталог сообщений demo-плагина (`messages/en.json` + `messages/ru.json` в JAR, 52 ключа на локаль) — строки страниц/кнопок демо переведены (интерполяция `{{key}}` + `deepTranslate` на фронте, см. Фазу 4.1). Итог `/config`: `locales [en, ru]`, 114 ключа на локаль (62 core + 52 demo).
- [x] Редакторы демо переведены/расширены: canvas `front`/`back`, diagram `layout`, scene3d `camera`/`lights` в конфиге демо.
- [x] Контекстное меню: ПКМ по строке таблицы задач → Complete/Delete/Copy/Open modal (overlay + `$row.id`) — из Фазы 0.2.
- [x] Проверка: `npm run build` PASS; `mvn test` (runtime) — 67 тестов PASS, включая новый `DocumentCommandsTest` (save/load/upsert/list/errors); smoke `/config` — страницы `boards,tasks,docs,diagram,scene,board,export` + команды документов; чанки 3D/tiptap/x6 вне начального бандла.

**Результат:** `[x]` — выполнено. i18n закрыт: core `en`+`ru` + каталог demo в JAR (`messages/{en,ru}.json`, 52 ключа) — `/config` отдаёт `locales [en,ru]`, 115 ключей на локаль (63 core + 52 demo); интерполяция `{{key}}` + `deepTranslate` на фронте (см. Фазу 4.1). Editor docs — `docs/Редакторы.md`.

---

## Фаза 4.1 — i18n: интерполяция `{{key}}`

- [x] `frontend/src/store/i18n.ts`: ссылка на перевод в конфиге — интерполяция `{{<pluginId>.<key>}}` вместо маркера `t:`; глубокий резолв по конфигу (`deepTranslate`/`tr`), в т.ч. частичный внутри строки (`"{{a}} · {{b}}"`); fallback: выбранная локаль → `defaultLocale` → сырой ключ. `t(key, params)` (плюрализация `_one`/`_many`, `{param}`) сохранён для кода компонентов.
- [x] Демо: мигрированы все 59 `t:`-маркеров → `{{demo.*}}`; живой пример частичной интерполяции — подзаголовок карточки досок `"{{demo.boards.card.subtitle}} · {{demo.app.edition}}"` (новый ключ `demo.app.edition` в en/ru).
- [x] Док: `docs/Редакторы.md` — раздел i18n обновлён (синтаксис `{{key}}`, частичная интерполяция, fallback, декларация ключами каталога).
- [x] Проверка: vue-tsc + vite build PASS; `mvn test` — 67 тестов PASS; `/config` — 116 ключей/локаль, `t:demo` в конфиге не осталось, резолв частичной строки подтверждён для en и ru (en: «Manage your boards · Demo», ru: «Управление досками · Демо»), fallback отсутствующего ключа → `defaultLocale`/ключ; WS smoke (project.create → open → demo.loaddocument notes+diagram → demo.listdocuments) PASS.

**Результат:** `[x]` — выполнено. Синтаксис переводов в конфиге переведён с `t:key` на `{{key}}`-интерполяцию, движок поддерживает частичную подстановку, каталоги по-прежнему живут в `messages/<lang>.json` плагина.

---

## Фаза 5 — Mention + контекстные меню в редакторах

### 5.1 @-mention в RichText (опции из команды плагина)
- [x] Deps: `@tiptap/extension-mention@^2.27.2` + `@tiptap/suggestion@^2.27.2`.
- [x] `componentSpec.ts`: `RichTextConfig.mentions?: { command, params?, trigger? }` (по умолчанию trigger `@`).
- [x] `UiRichText.vue`: mention-extension на базе Suggestion; кандидаты грузятся командой плагина (`loadData` через `bindingEngine`), принимается массив `[{id,label}]` или `{items:[…]}`; попап под кареткой (mousedown/клик, ArrowUp/Down, Enter, Escape); вставка ноды `{type:'mention', attrs:{id,label}}`; рендер метки `@label`; round-trip в HTML через renderHTML/parseHTML. `loadMentions()` на onMounted, очистка попапа в onBeforeUnmount.
- [x] Демо: команда `demo.mentions` (`MentionsCommand.kt`, 8 кандидатов: люди + теги); конфиг страницы «Документы» — `mentions: {command: "demo.mentions"}`.

### 5.2 Контекстное меню в редакторах (Diagram node)
- [x] `componentSpec.ts`: `ActionSpec` — новый вариант `{ action: 'editor'; editor; command; params? }`.
- [x] `bindingEngine.dispatchAction`: case `editor` → `emitEvent({kind:'editor.command', payload:{componentId, editor, command, params}})`; `params` резолвятся через `resolveParams` (`$row.*`); `runAction` подтверждение (confirm) переводится через `i18nStore.tr`.
- [x] `UiDiagram.vue`: на `node:contextmenu` → `overlayService.onGesture({event, componentType:'Diagram', objectType:'diagram.node', componentId, row:{id,label}, x, y})`; подписка на `editor.command` (скоп editor='diagram' + совпадение componentId) — команды `delete` (с confirm), `duplicate`, `front`, `back`; оверлей закрывается при клике/смене выделения.
- [x] Демо: оверлей `diagram-node-menu` (Duplicate / Delete) + триггер `{event: contextmenu, objectType: 'diagram.node'}`; ключи `demo.diagram.menu.*` (duplicate, delete, delete.confirm) в en/ru; странице диаграмм задан `id: "diagram-editor"` для скоупа команд.

**Проверка:** vue-tsc + vite build PASS (RichText чанк 384 КБ — mention добавил ~10 КБ, чанк остаётся ленивым); `mvn test` — 67 тестов PASS; `/config` — команды `demo.mentions`/`demo.savedocument`, оверлей `diagram-node-menu` + триггер `diagram.node`, mentions в конфиге docs-страницы, id `diagram-editor`, 119 ключей/локаль (в т.ч. `demo.diagram.menu.*`); WS smoke — `demo.mentions` → 8 кандидатов, create/open/load/list PASS.

**Результат:** `[x]` — выполнено. RichText научился @-mention (данные — команда плагина через `loadData`), а ноды X6-диаграмм открывают контекстное меню через оверлей с новым клиентским экшеном `editor` (команды идут через eventBus, скоуп по componentId).

---

## Решения на следующие фазы (Фазы 7–12)

| Вопрос | Решение |
|---|---|
| Направления | Все четыре: оболочка (сайдбар/табы/темы), UI-примитивы для сборки (в т.ч. доски), завершение редакторов, коллаборация/реальный мир — плюс персистентность. Канбан-доску напрямую НЕ делаем: проектируем компоненты так, чтобы доску можно было собрать из них. |
| Хранилище | **Файловая система + JSON** (основной диск бэкенд); Redis — опция. |
| Персистентность как оптимизация памяти | **Гибрид**: при большом числе сущностей — частичный offload холодных данных на FS (или Redis); порог `maxEntities`, LRU-вытеснение, пакетная группировка записей; `storage.enabled=false` → чистая память (текущее поведение). Бэкенды: `memory \| files \| redis \| hybrid` через конфиг. |
| Undo/redo | **Внутри редакторов** (локальные стеки команд): TipTap history есть; X6 history/clipboard/keyboard; canvas/scene — свой стек. Runtime не трогаем. |
| Навигация | **Сайдбар + табы сразу**: дерево навигации по группам (sidebar), открытые страницы — табами; история вперёд/назад. |
| Тёмная тема | **CSS-переменные + auto** (prefers-color-scheme) с переключателем light/dark/auto; `AppShell.theme.mode` — значение по умолчанию. |
| Dev-инструменты | **Отдельное Go-приложение разработчика**: знает, где находится Runtime, помогает создавать/собирать/проверять плагины и запускать сценарии разработки. Существующий hot-reload ядра остаётся инфраструктурным заделом, но целевой CLI пока только помечен в плане, без проектирования и реализации. |
| Автодокументация | **Web-страница /docs** (команды с группами + WS-протокол из живого конфига/дескрипторов) + **Storybook/UIDocs** для UI-компонентов и редакторов. Собранный Storybook отдаётся Runtime по `/uidocs` только в dev-режиме, использует тему из ядра и `/config`-adapter; редакторы в UIDocs должны полностью перенастраиваться как plugin-provided Vue-компоненты. |
| iframe и редиректы | **UiFrame** компонент (`{type:"Frame", src}`) + **редиректы из конфига** (`redirects: [{from, to}]`) + **эмбед-режим страниц** (`/embed?page=<id>`, без шапки/сайдбара/табов). |
| Роутинг | **Оба стиля через конфиг**: hash (`#/page/<id>`) по умолчанию, опционально History API (`/page/<id>` с SPA-fallback). URL отражает активную страницу/табы, deep-link, браузерный back/forward. |
| Картинки/иконки | **Иконки из ассетов плагина** (`icon/logo/image` → `/plugin-assets/<pluginId>/...`) + компонент **UiImage** (`src/fit/alt/ratio`). Встроенного набора иконок нет. |
| Адаптивность | **Везде**: оболочка (сайдбар→drawer, топбар сворачивается, табы скролл), компоненты (container queries — компактные режимы), редакторы (перенос тулбаров, ресайз по контейнеру через ResizeObserver). |
| Группы команд | **Поле `group`** в дескрипторе команды → `/config` (`commands[].group`); секции в CommandPalette и в /docs. Бэкенд-реестр остаётся плоским (группировка — презентационная). |
| Мультиюзер | **Ядро конфигурируемо**: один пользователь или много — определяют плагины (идентичность, присутствие). Коллаборация off по умолчанию; подписки/события уже заложены. |

---

## Фаза 6 — Оболочка: сайдбар, табы, темы

### 6.1 Навигация: сайдбар + табы
- [x] Backend: `NavigationEntry` — поля `group` (раздел) и `icon`; `ui.navigationFields.group/icon` в yaml; `buildNavigation` парсит их.
- [x] Frontend: типы `NavigationEntry.group/icon`; демо-навигация получает группы (Overview/Editors) и иконки (все 7 пунктов, включая nav-export из storage-плагина).
- [x] `frontend/src/store/page.ts` — `pageStore`: активная страница, стек открытых табов, история back/forward; `openPage/closeTab/closeOthers/closeAll/back/forward`; `configStore` больше не хранит навигацию (делегирует pageStore, убран циклический импорт).
- [x] `Sidebar.vue`: группировка по `group`, иконки, активный пункт, сворачиваемые группы.
- [x] `TabsBar.vue`: открытые табы (заголовок), активный, закрытие (x/средняя кнопка), скролл при переполнении.
- [x] `App.vue`: лейауты `sidebar` (сайдбар + контент + табы) и `topbar` (табы под шапкой); кнопки back/forward; landing-страница → первый таб.
- [x] CommandPalette: страницы в списке (открытие табом); шорткаты back/forward `⌘[`/`⌘]` + `alt+←/→` (actions `pageBack`/`pageForward`).

### 6.2 Темы (CSS-переменные + авто)
- [x] `frontend/src/store/theme.ts` — `themeStore`: `mode: auto|light|dark`, оверрайд в localStorage (`cc.theme`), подписка на `prefers-color-scheme`; `applyTheme` реактивно пересобирает токены (заменил `renderer/theme.ts`).
- [x] Переключатель темы в шапке (cycle: light → dark → auto), иконки ☀/☾/◐.
- [x] Хардкод в базовых компонентах переведён на переменные (CommandPalette; остальные — при работе с компонентами).

**Проверка Фазы 6:** vue-tsc + vite build PASS (index 143.7 КБ/50.7 gzip, ленивые чанки не тронуты); `mvn test` — 67 тестов PASS (включая builder с group/icon); `/config` — `app.layout: sidebar`, navigation с группами/иконками (7 пунктов), WS smoke PASS.

**Результат:** `[x]` — выполнено. Рабочая область получила сайдбар с группами навигации, табы открытых страниц (закрытие/история/шорткаты) и темы auto/light/dark с переключателем. Навигация — данные конфига (`navigation[].group/icon`), а не хардкод.

---

## Фаза 7 — UI-примитивы для сборки (в т.ч. досок) + DnD + картинки/иконки + группы команд

### 7.1 Примитивы
- [x] `UiAvatar` (`name`→инициалы / `src` / `fallback`, `size`, `tone`), `UiProgress` (`value`/`valueKey` из data-биндинга, `showLabel`, `label`, `tone`), `UiAccordion` (`items[].components`, открытие по заголовку, `change` action, aria-expanded), `UiTabs` (внутрикомпонентные вкладки — было), `UiBadge` (расширен tone) — было.
- [x] `UiList` — `sortable` (native HTML5 drag, `reorder` action с payload `{from, to, row, ids}`), визуальные состояния dragging/over. Layout-контейнеры (`Space`/`Grid`/`Column`) — есть.
- [x] Типы в `componentSpec` (`AvatarConfig`/`ProgressConfig`/`AccordionConfig`/`ListConfig.sortable`) + builtin-реестр; конфиг демо: таб «Виджеты» на странице «Доски» (Avatar/Progress/Accordion/sortable List задач).

### 7.2 DnD (перетаскивание)
- [x] Сорт-лист (drag-to-reorder) в `UiList`; payload reorder содержит новый порядок `ids` → команда `demo.reordertasks` (поле `order` у Task, `demo.list` сортирует; упорядочивание с частичным diff — обновляются только изменённые).
- [x] `componentSpec`: `ListConfig.sortable` + событие `reorder`; демо-биндинг: `reorder` → `demo.reordertasks` с `ids: "$payload.ids"`.
- [x] Демо: sortable List в табе «Виджеты» + команда `demo.reordertasks` (группа Tasks). Стенсил-палитра Diagram (X6 dnd) — Фаза 8.

### 7.3 UiImage + иконки из ассетов плагина
- [x] `UiImage` (`src/fit/alt/width/height`) — был; рендерит абсолютные пути, включая `/plugin-assets/...`.
- [x] Резолв ассетов на бэкенде: `WorkspaceConfigurationBuilder.resolveAssetUrls` — глубокий проход по конфигу каждого `RegisteredUi`: `assets|icons|images|static/*` → `/plugin-assets/<pluginId>/...` (в nav/меню/кнопках/страницах/оверлеях). Эндпоинт `/plugin-assets/{pluginId}/{path}` уже был.
- [x] `frontend/src/renderer/icon.ts` — `iconView(icon)` → `{glyph|src}`; `Sidebar` и `UiButton` рендерят `<img>` для URL-иконок.
- [x] Демо: `assets/icon-logo.svg` (новый ассет), nav-boards использует его; Avatar `src: assets/icon-logo.svg`.

### 7.4 Группировка команд
- [x] Бэкенд: SDK `Command(name, description, group)` + `CommandEntry.group` → `/config` (`commands[].group`); демо-команды сгруппированы (Tasks/Boards/Documents/Workspace/Storage; core `project.*` — без группы).
- [x] CommandPalette: секции по группам (Pages → Tasks → Boards → Documents → Workspace → Storage), заголовки, навигация по плоскому индексу.
- [x] Демо: группы всех команд (см. /config).

**Проверка Фазы 7:** vue-tsc + vite build PASS (index 149.4 КБ/52.4 gzip, ленивые чанки не тронуты); `mvn test` — 67 тестов PASS (включая builder с group + resolveAssetUrls в тесте); `/config` — `commands[].group`, nav-boards icon → `/plugin-assets/demo/assets/icon-logo.svg`, таб «Виджеты» (Avatar/Progress/Accordion/sortable List) + биндинг reorder; `/plugin-assets/demo/assets/icon-logo.svg` → 200 image/svg+xml; WS smoke: create 3 задач → `demo.reordertasks` (обратный порядок) → `demo.list` отдаёт новый порядок — PASS.

**Результат:** `[x]` — выполнено. Добавлены примитивы Avatar/Progress/Accordion, sortable List (DnD с персистом через `demo.reordertasks`), иконки/картинки из ассетов плагина (резолв на бэкенде `assets/*` → `/plugin-assets/...`, `<img>`-рендер), группы команд (секции в палитре). Доска собирается из примитивов (таб «Виджеты» на странице «Доски»).

---
## Фаза 7–8 — Перепроектирование ядра (конфигурация, многопоточность, команды, SQL, хранилище)

> Спроектировано 16.08.2026. Состоит из 5 блоков (A–E). Блоки B/D/E требуют уточняющих решений (см. вопросы внизу блока E). Исходные формулировки пользователя сохранены курсивом.

### A. Перенос ответственности «main-плагина» в ядро
*«Структура страниц, какой плагин является entrypoint'ом, и настройка стилистики интерфейса переходят в ядро. В плагинах остаётся структура самой страницы, наполнение контентом и кнопками и логика работы (правки минимальные).»*

**Решение (Q1):** слоёная модель — UI-конфигурация по-прежнему задаётся в плагинах, но сам фронтенд живёт в ядре, а базовые настройки, действующие для UI всех плагинов (цвета, язык, стилистические токены), находятся в ядре.

Текущее состояние:
- Оболочка (`App`: title/logo/layout) собирается из `App`-UIDefinition **main-плагина**, перекрывая дефолты `ui.app` (`WorkspaceConfigurationBuilder.buildApp`).
- Лендинг = `ui.landingPage` ИЛИ первая страница main-плагина (`firstPageOf`).
- Навигация сортируется: main-плагин первым, затем `order`. «Кто первый» завязан на понятие `ui.mainPlugin` (сейчас `null`).
- Стили: `ui.theme.tokens` уже в core-конфиге (`RuntimeConfig`).

Изменения:
- [x] **Базовый UI-слой ядра**: `ui.theme` расширен до глобальных стилистических токенов (палитра цветов, типографика, отступы, радиусы) — `ThemeConfig.tokens` (с суффиксами `.light/.dark`), фронт применяет через CSS-переменные (`frontend/src/store/theme.ts`); `ui.i18n.defaultLocale/locales` — базовая локаль всех плагинов (`I18nConfig` → `MessageRegistry`). Из `application.yaml` (RuntimeConfig). Это дефолт/нижний слой поверх UI плагинов.
- [x] **Плагины продолжают регистрировать `App`/`Page`/`Navigation`** — конфигурация оболочки и страниц остаётся плагин-ориентированной (frontend в ядре, конфиг из плагинов). `WorkspaceConfigurationBuilder` остаётся сборщиком, base-токены ядра (`app.theme`) подмешиваются под UI всех плагинов.
- [x] **Порядок отображения плагинов — ядро (Q-доп):** настройка `ui.pluginOrder: [<pluginId>, ...]` — явный список порядка отображения плагинов (навигация/лендинг/App). Плагины из списка — в указанном порядке, остальные после — по своему `order`; валидация (плагины из списка обязаны быть загружены). `buildNavigation` сортирует по `pluginOrder`; `ui.mainPlugin` убран.
- [x] **Entrypoint — ядро**: лендинг = `ui.landingPage` → первая навигационная запись (в порядке `pluginOrder`) → первая страница; fallback «первая страница main-плагина» (`firstPageOf`) убран.
- [x] Ядро агрегирует навигацию со всех плагинов; добавлено `ui.nav.include/exclude` по pluginId (фильтрация навигации).
- [x] Проверка: `/config` не меняет форму (тема 35 токенов, i18n en/ru, nav order); suite 130 PASS (включая pluginOrder/landing/App-fallback/include/exclude); live: переключение `ui.pluginOrder=[demo-storage, demo]` меняет nav (nav-export первым) и лендинг (`export`) — PASS.

### B. Многопоточность и производительность ядра
*«Ядро обрабатывает несколько запросов одновременно (в ядре несколько плагинов); при обработке запроса не блокируется основной поток ядра; продумать потокобезопасность и синхронизацию.»*

Текущее состояние:
- `CommandExecutor.execute` → `withContext(dispatcher)` (пул `command.executorThreads` или `Default`).
- WS-сессия обрабатывает сообщения **последовательно** (`consumeAsFlow().collect` в `WsSessionHandler`).
- `ProjectLocks` — опт-ин ReentrantLock на проект; команды сами вызывают `withProjectLock`.
- `SynchronizedObjectList` — RW-lock на список; проекты/сессии в безграничных CHM.

Изменения:
- [x] Декларация доступа команды: `Command.readOnly` (ANALYTICAL = read — блок D). Менеджер блокировок: **автоматический** per-project RW-lock вокруг выполнения (несколько чтений параллельно, запись сериализуется), опт-ин `withProjectLock` сохраняется для обратной совместимости. Вложенность (команда вызывает команду) — reentrant, без deadlock.
- [x] Параллельная обработка сообщений в WS: каждый envelope — отдельная coroutine с bounded-параллелизмом на сессию. **Решение (Q2): out-of-order допустим** — результаты мапятся по `requestId` (клиент уже это делает).
- [x] Не-блокирующий диспетчер: `CommandExecutor` на ограниченном пуле + очередь с back-pressure; блокирующий код команд (REST/БД/SQL) живёт на пуле, thread of Ktor/основной поток ядра не блокируется. `withTimeout`/отмена при превышении `command.timeoutMs`.
- [x] Модель потокобезопасности данных: RW-lock на (project) + снапшот-копии для чтения (аналитика читает снимок без блокировки записи); события публикуются после фиксации.
- [x] Нагрузочный smoke: N параллельных WS-сессий, замер p95; проверить отсутствие starvation.

**Проверка Блока B (16.08.2026):** `mvn -o -pl runtime -am test` — 76 тестов PASS (включая новые: RW-локи `ProjectLocksTest` — read параллельны / write исключает readers / write исключает writers / write после выхода всех readers; `CommandExecutorTest` — timeout → `commandTimeout` за ~100 мс (delay(5s) прерывается), busy при maxConcurrency=1 → `commandBusy`, read-only параллельны, error-результат не публикует события). Реализация: RW-lock на kotlinx `Mutex` (не thread-affine, отменяемый; ReentrantReadWriteLock ломался на thread-migration корутины — IllegalMonitorStateException); инвариант гейта «locked ⇔ readerCount>0» (утечка гейта при уходе не-первого ридера — исправлена). WS-сессия: per-session scope, `Channel(concurrencyLimit)` back-pressure, N воркеров, send через Mutex. Конфиг: `command.maxConcurrency/queueWaitMs/timeoutMs/wsConcurrency` (Main клампит maxConcurrency ≤ пул). WS smoke (сервер): create → 12 параллельных `demo.list` — все SUCCESS за 32 мс, подтверждён **out-of-order** приход (r0,r4,r8,… vs r0,r1,…), маппинг по requestId работает.

### C. i18n ядра — разобрать хардкод en/ru
*«i18n в main захардкожены en и ru.»*

Текущее состояние: `Main.kt` загружает все каталоги ядра автоматически; `MessageCatalogLoader.loadFromClasspathAll`.

- [x] Авто-обнаружение: скан `messages/<locale>.json` на classpath ядра (не хардкод двух файлов); `i18n.locales` — разрешённый список, `defaultLocale` обязателен; отсутствующий locale → ошибка при старте. `loadFromClasspathAll` сканирует classes-dir или JAR ядра (только свои ресурсы, без чужих каталогов); Main.kt:134–146: allowedLocales = `i18n.locales` (или обнаруженные), отсутствующий locale → `IllegalStateException`, `defaultLocale` вне зарегистрированных → ошибка старта.
- [x] Ключи ядра остаются `core.*`; константы `Messages.kt` — только референсы ключей (без хардкода текста). Проверено: `MessageCatalogLoaderTest` (`discovers all core catalogs from classpath` — en/ru, все ключи с префиксом `core.`), suite 130 PASS, сервер стартует.

### D. Команды: типы, публичность/приватность, SQL-движок, источники данных
*«Добавить в библиотеку плагинов SQL-движок и возможность легко добавлять источники данных и места для отправки данных как команды. Вводим 3 типа команд…»* (в тексте перечислено 5 типов — ниже 5).

SDK (sdk/src/main/kotlin/runtime/domain/command):
- [x] `CommandType { ANALYTICAL, SYSTEM, INFRASTRUCTURE, PIPELINE, LOGICAL }` — поле `type` у `Command` (default `LOGICAL`, обратная совместимость).
- [x] `Command.visibility: PUBLIC | PRIVATE` (default PUBLIC). PRIVATE: недоступна с WS/фронта, доступна ядру (пайплайны, планировщик, внутренние сервисы). `/config` отдаёт `visibility`; `CommandDispatchService` блокирует PRIVATE с WS.
- [x] `/config`: `commands[]` += `type`, `visibility`. CommandPalette фильтрует PRIVATE.
- [x] Все типы команд работают с моделями плагина через `CommandContext`/`EntityRegistry` (без изменений механизма — как сейчас).
- [x] Проверено (16.08.2026): 78 тестов PASS; `/config` отдаёт `type`/`visibility` для всех команд; тесты на блокировку PRIVATE (`private command is blocked from client dispatch`) и прохождение PUBLIC; ANALYTICAL всегда исполняется под read-lock.

Аналитические (SQL над структурами ядра):
- [x] Виртуальные таблицы = entity types проекта (`demo.task`, `demo.board`, …). Схема таблиц — **авто-маппинг полей модели через Jackson (Q4)**: сериализуемые поля → колонки; тип колонки из Jackson-значений (string/number/boolean).
- [x] Движок — **Apache Calcite (Q3)**: кастомная `Schema`/`ScannableTable`, `scan()` отдаёт строки из entity-списков проекта; полный SQL (SELECT/WHERE/JOIN/ORDER/GROUP BY/LIMIT) через Calcite. Валидация: только SELECT (без DML). Зависимость `org.apache.calcite:calcite-core` (1.38.0, пин в parent pom) живёт в runtime; SDK не тянет Calcite — плагины объявляют только SQL-строку.
- [x] `AnalyticalCommand(sql, params)`; `context.objectList` → таблица на момент запроса; результат — строки/JSON.
- [x] Проверено (16.08.2026): CalciteQueryEngineTest (8 тестов: SELECT/WHERE/ORDER, GROUP BY, JOIN, params `{param}`, запрет DML, неизвестная таблица, executor-routing); полный suite 86 тестов PASS; WS smoke `demo.report` (SQL GROUP BY по demo.task) → `[{"done":1},{"open":2}]`.

Системные (скрипты над моделями):
- [x] SDK-шаблоны: `EntityModelScript`/хелперы — типовые create/update/delete/validate для моделей плагина, генерируют `references`. (`sdk/.../domain/script/EntityModelScript.kt`; тесты `EntityModelScriptTest` 8 шт; demo `TaskScript`.)
- [x] Обработка ошибок в классе команд: в классе Command должно быть 2 метода отвечающих за исполнение (публичный final execute с try/catch и логированием через java.util.logging) и protected метод executeInternal, содержащий логику исполнения команды. executeInternal может кидать исключения, которые перехватываются в execute и залогированы; ошибка возвращается как `CommandResult.error("${e::class.simpleName}: ${e.message}")`.

Инфраструктурные (запрос/отправка по grpc/rest):
- [x] Реестр в SDK: `DataSource`/`DataSink` (`RestDataSource`/`GrpcDataSource`/`RestSink`/`GrpcSink`, kind REST/GRPC) + `PluginContext.registerDataSource/Sink`; команды ссылаются на них по id.
- [x] **REST + gRPC сразу (Q5)**: HTTP-клиент (JDK `HttpClient`, JSON-тело, 2xx-проверка) и gRPC-клиент (grpc-java 1.68.1, pin в parent pom; proto-`FileDescriptorSet` через `GrpcDataSource`, динамические `DynamicMessage`+`JsonFormat`); десериализация ответа в модель плагина (Jackson-значения).
- [x] `InfrastructureCommand(endpoint)` — SOURCE (invokeDataSource) / SINK (writeDataSink); `request(params)` строит тело, `parseResponse()` маппит ответ; read-only по умолчанию (общий read-lock).
- [x] Проверено (16.08.2026): InfrastructureClientTest (6 тестов: REST source/sink, HTTP-404, gRPC unary через InProcess + динамический дескриптор, executor-routing, неизвестный источник → ошибка); полный suite 92 теста PASS; WS smoke `demo.echo` (INFRASTRUCTURE) через локальный HTTP-echo → `{"echo":{"msg":"hello world","n":42},"status":"ok"}`.

Конвейер (Pipeline):
- [x] `PipelineCommand(steps)` кодом в плагине (Q5); шаг = `{command, params, input: {переменные из выхода предыдущих}, output: {имя → переменная}}`. Ядро исполняет последовательно, передаёт данные между шагами; единый лок/транзакция опционально. Параметры вызова пайплайна — начальные переменные; `input` подставляет переменную в params шага (при null-переменной — статическое значение); `output` считывает поле из value шага (map ИЛИ модель через рефлексию) или весь value при пустом ключе.
- [x] **Ошибки (Q4): fail-fast + `ignoreError`** — при ошибке шага пайплайн останавливается, результат — ошибка с индексом шага (`Step N (id) failed: ...`); шаг с `ignoreError: true` продолжает (ошибка попадает в результат шага). Исключение шага тоже превращается в ошибку шага.
- [x] Шагом может быть любая команда: `SYSTEM`/`ANALYTICAL`/`INFRASTRUCTURE`/`LOGICAL`-скрипт, а также вложенный `PIPELINE` (с guard от циклов/глубины — max 8). Шаги из `PRIVATE`-команд разрешены (ядро исполняет).
- [x] Пайплайн виден в `/config` как обычная команда (тип `PIPELINE`) и вызывается с WS; палитра показывает состав шагов (`steps`).
- [x] Проверено (16.08.2026): PipelineCommandTest (11 тестов: последовательность+output, входные params как переменные, fail-fast с индексом, ignoreError, неизвестный шаг, ANALYTICAL-шаг, вложенный пайплайн, цикл, глубина, извлечение из модели, null-переменная); полный suite 104 PASS; WS smoke `demo.seedtasks`/`demo.pipelineinput`/`demo.pipelineignore`/`demo.pipelinefail`.

Логическая (Kotlin-скрипт):
- [x] **Движок — собственный evaluator на K2JVMCompiler (Q1)**: `kotlin-compiler-embeddable` в runtime (kotlin-compiler-embeddable 2.3.0, исключён транзитивный coroutines — конфликт с ktor 1.11.0); SDK не тянет компилятор — плагины только объявляют команды. JSR-223 (`kotlin-scripting-jsr223`) офлайн отсутствует → `KotlinScriptEngine`: single-thread компиляция вне command-path, кэш по SHA-256, уникальный per-hash фасад (`LogicalScript_<hash8>Kt`), загрузчик после компиляции (URLClassLoader кеширует индекс директории), plugin-классы резолвятся через `PluginClassLoader` (identity с сущностями проекта).
- [x] **Скрипты — динамические, в проекте (Q2)**: хранятся как сущности проекта (скрипт = {id, name, code}), команда `LogicalScriptCommand(scriptType, scriptField)` резолвит код по `scriptId` из params/аргументов (Map/`id`/bare-строка); компиляция по требованию с кешем по хешу кода (пересборка при изменении — без пересборки плагина).
- [x] **Контекст — полный, без песочницы (Q3)**: скрипту доступны `CommandContext` (objectList/getObject/withProjectLock) + `params`; контракт — top-level `fun run(context: CommandContext, params: Any?): Any?`; возврат `CommandResult` (или обёртка); доверие как к коду плагина; движок преподносит `DEFAULT_SCRIPT_IMPORTS`.
- [x] Управление скриптами: демо-команды `demo.scriptcreate/scriptupdate/scriptdelete/scriptlist/scriptvalidate` + `demo.runscript` (LogicalScriptCommand); валидация синтаксиса (пробная компиляция) в scriptvalidate и при create/update; редактирование с WS.
- [x] Публичность/приватность распространяется на скриптовые команды: `LogicalScriptCommand(visibility = PRIVATE)` передаёт visibility в `Command`; блокировка PRIVATE с WS работает для всех типов (проверено на `CommandDispatchService` — тест `private command is blocked from client dispatch`), тип-независима.
- [x] Проверено (16.08.2026): `KotlinScriptEngineTest` (11 тестов: CommandResult как есть, обёртка возврата, params, чтение сущностей, withProjectLock, ошибка компиляции, исключение, missing run, кэш, validate, user imports) + `LogicalScriptCommandTest` (5 тестов: резолв по Map/bare-строке, ошибки missing/unknown/invalid id); полный suite `mvn -o -pl runtime -am clean test` = 119 PASS (0 failures); WS smoke D7 — scriptvalidate (good/bad/no-run) / scriptcreate / runscript (Map и bare id) / scriptlist / scriptupdate (id) / scriptdelete — все PASS; компилятор-сообщения фильтруются (только ERROR/EXCEPTION, без LOGGING-шума).
- [x] **Регрессия блока D (16.08.2026)**: полный suite 119 PASS + финальный WS smoke, покрывающий все 4 типа команд в одном прогоне — PIPELINE (seedtasks/pipelineinput/pipelineignore/pipelinefail), ANALYTICAL (demo.report SQL по demo.task → rows), INFRASTRUCTURE (demo.echo через локальный HTTP-echo), LOGICAL (scriptcreate/runscript/scriptvalidate) + `/config` отдаёт `type` для всех семейств (ANALYTICAL/INFRASTRUCTURE/PIPELINE/LOGICAL) — все PASS.

### E. Хранилище in-memory: улучшения (уточнение Фазы 11)
*«Получше продумать улучшения inmem хранилища из следующих фаз.»*

Текущее состояние: `InMemoryProjectRepository` (безграничный CHM), `SynchronizedObjectList` (RW-lock), `InMemoryAuditLog` (COW-список), сессии/реестры — безграничные.

- [x] `storage.backend: memory|files|redis|db|hybrid`; `storage.memory.maxEntities` (cap), `storage.eviction: lru`; `storage.enabled: false` → чистая память (как сейчас).
- [x] Гранулярность eviction — **per-entity (Q6)**: LRU по `(projectId, entityType, objectId)`; рефакторинг `Project` → `EntityStore` + интеграция всех команд (блок D даёт единую точку доступа через CommandContext).
- [x] Абстракция `EntityStore`: `get/put/remove(projectId, type, id)`, счётчик объектов/памяти, dirty-множество (для hybrid), снапшот-чтение.
- [x] Hybrid: hot-LRU слой (порог `maxEntities`) + cold (files/redis); write-behind flush батчами по (тип/проект), таймер/порог; load-on-miss при обращении.
- [x] Потокобезопасность: striped-locks/CHM; чтения не блокируют запись (snapshot-копии); flush не блокирует command-path.
- [x] Ограничения: audit уже `maxEventsPerProject`; сессии — TTL; entity/command реестры малы — оставить.
- [x] Интеграция: все команды (`project.*`, entity CRUD, документы, редакторы) идут через `Storage`; WS без изменений.
- [x] Тесты: files round-trip («рестарт» → load), hybrid с малым `maxEntities` (вытеснение/возврат), невалидный конфиг. `application.yaml`: default `memory`, пример `hybrid` комментарием.

---

### Решения (утверждены 16.08.2026)
- Q1. **Оболочка**: слоёная модель — UI-конфигурация задаётся в плагинах, фронтенд в ядре, базовые настройки для UI всех плагинов (цвета/язык/стилистика) — в ядре. Entrypoint — ядро (`ui.landingPage` → первая nav-запись).
- Q1-доп. **Порядок плагинов**: `ui.pluginOrder: [<pluginId>, ...]` — полный явный список порядка отображения плагинов; `ui.mainPlugin` убрать.
- Q2. **Порядок WS**: out-of-order допустим, маппинг по `requestId`.
- Q3. **SQL-движок**: Apache Calcite (schema над entity-списками проекта), только SELECT.
- Q4. **Схема таблиц**: авто-маппинг полей модели через Jackson.
- Q5. **Инфраструктура**: REST (JDK HttpClient) + gRPC (grpc-java) сразу.
- Q6. **LRU**: per-entity `(projectId, entityType, objectId)` — рефакторинг Project → EntityStore.
- Q7. **Порядок работ**: A → C → B → D → E (E перед Фазой 11; блок E уточняет Фазу 11).

---


## Фаза 8 — Завершение редакторов

### 8.1 Контекстные меню Canvas2D / Scene3D (паттерн Фазы 5.2)
- [x] `UiCanvas.vue`: `canvas.element` — contextmenu → `onGesture` (componentId, row: {id,type}), подписка `editor.command` — delete/duplicate/front/back.
- [x] `UiScene3D.vue`: `scene3d.object` — ПКМ по мешу → onGesture (row: {id}), `editor.command` — delete/duplicate.
- [x] Демо: оверлеи `canvas-element-menu`, `scene-object-menu` + триггеры.

### 8.2 Diagram: layout {dagre|circle}, стенсил, history
- [x] `layout: {type: dagre|circle|grid}` — `@dagrejs/dagre` (или своя раскладка) / окружность / текущая грид-раскладка.
- [x] Стенсил-палитра: `stencil: {nodes: [...]}` — палитра слева, dnd из палитры в граф (X6 `dnd` плагин + наш dnd из 7.2).
- [x] History/clipboard/keyboard: X6-плагины (undo/redo `⌘Z`/`⌘⇧Z`, copy/paste), кнопки undo/redo в тулбаре.

### 8.3 Canvas2D undo/redo + Scene3D
- [x] Canvas2D: стек команд (инкрементальные операции или снапшоты), undo/redo в тулбаре + `⌘Z`.
- [x] Scene3D: nested objects (`children` в контенте), текстуры (color/material), fog — упрощённо.

### Проверка Фазы 8 (smoke, 16.08.2026)
- [x] `npm run build` (vue-tsc + vite) — без ошибок; новые deps: `@antv/x6-plugin-history/keyboard/clipboard/dnd`, `@dagrejs/dagre`.
- [x] `/config`: `canvas-element-menu` (front/back/duplicate/delete) и `scene-object-menu` (duplicate/delete) + триггеры `canvas.element`→`canvas-element-menu`, `scene3d.object`→`scene-object-menu`.
- [x] Конфиги редакторов: diagram `layout {type: dagre, gapX 40, gapY 60}` + `stencil {4 узла}` + тулбар с undo/redo; scene3d `fog {#eef2f7, 10..26}`; canvas тулбар с undo/redo. i18n `demo.canvas.menu.*`, `demo.scene.menu.*`, `demo.stencil.*` (en/ru).
- [x] WS smoke (свежий проект): loaddocument diagram → `{nodes:4, edges:3}`; scene → `{objects:2}` c `sc_parent_1{children:[sc_child_1, sc_child_2]}`; board → пусто.
- [x] Визуальная проверка в браузере: ПКМ на элементе canvas / объекте сцены, стенсил+drag, `⌘Z`, layout-кнопка.

---

## Фаза 9 — Роутинг, эмбед, редиректы, адаптивность

### 9.1 URL-роутинг
- [x] Роутер-стор (`frontend/src/store/router.ts`): hash `#/page/<id>` по умолчанию; `routing.mode: hash|history` из конфига (history — SPA-fallback на сервере: `/page/<id>` → index.html, регистрируется после `/ws`).
- [x] Табы/активная страница ↔ URL: deep-link, браузерный back/forward, восстановление открытой страницы из URL при загрузке (`pageStore.restore`, watch activePageId → pushState, popstate/hashchange).

### 9.2 Редиректы
- [x] `redirects: [{from, to}]` в конфиге (валидация mode `hash|history`); резолв в навигации (navigation.request + прямое открытие URL) и в роутере — цепочки с защитой от циклов.

### 9.3 Эмбед-режим + UiFrame
- [x] `/embed?page=<id>` (сервер всегда отдаёт index.html; фронт: `runtime--embed` без шапки/сайдбара/табов, страница из `?page=` или лендинг).
- [x] `UiFrame` компонент (`components/UiFrame.vue`, тип `frame`): `{type:"Frame", src}` — `page:<id>`/`asset:<pluginId>/<path>`/URL.

### 9.4 Адаптивность оболочки
- [x] Sidebar→drawer на мобильном (бургер в топбаре, скрим, z-индексы), топбар `flex-wrap`, табы авто-скролл (`scrollIntoView`), шапка адаптивна (media 48rem).

### 9.5 Адаптивность редакторов и компонентов
- [x] Тулбары редакторов переносятся (`flex-wrap: wrap`); canvas/diagram/scene ресайз по контейнеру (ResizeObserver уже был — проверено).
- [x] Container queries для компонентов (`renderer/useContainerQuery.ts`, брейкпоинты 480/768 → классы `cq--sm/md`) — компактные режимы UiTable/UiForm/UiCard/UiList (поля в колонку, поиск на всю ширину, пагинация/экшены переносятся, заголовок карточки в колонку).

---

## Фаза 10 — Dev-инструменты + автодокументация + Storybook/UIDocs

### 10.1 Консольная dev-утилита на Go
- [~] Целевое решение: отдельное Go-приложение разработчика, которое знает расположение Runtime и помогает создавать плагины, собирать их, проверять конфиги и запускать dev-сценарии.
- [~] Пока только помечено в плане: **не проектировать детально и не реализовывать до отдельного решения**.
- [x] Инфраструктурный задел ядра уже есть: `dev.enabled`, вотчер плагинов, `RuntimeReloader`, live reload `/config`, Vite proxy. Он остаётся полезным, но больше не является формулировкой пункта 10.1.

### 10.2 Автодокументация: /docs
- [x] Страница /docs в конфиге ядра: команды (группы/описание/параметры) + WS-протокол (типы сообщений, envelope, ошибки) из живого конфига/дескрипторов.

### 10.3 Storybook / UIDocs
- [x] Базовый Storybook scaffold для Vue/Vite: `.storybook/*`, scripts `storybook`/`build-storybook`/`test-storybook`, первая story через `ComponentHost`.
- [x] Runtime route `/uidocs` отдаёт собранный Storybook из `frontend/storybook-static` **только в dev-режиме** (`dev.enabled=true`); в prod маршрут не публикуется.
- [x] Базовый `/config`-adapter: преобразует workspace config в UIDocs fixtures без отдельного формата.
- [x] Mock runtime harness повторяет форму `/config`, регистрирует builtin-компоненты и применяет CSS-переменные темы ядра.
- [ ] Расширить покрытие stories для всех builtin-компонентов и редакторов (mock-конфиги/данные, декларативные сценарии).
- [ ] Редакторы в UIDocs должны быть интерактивными и полностью перенастраиваемыми: конфиг, данные, toolbar, readonly, save/load, overlays/menus, shortcuts, layers-preview.
- [ ] Добавить visual regression/screenshot pipeline для Storybook/UIDocs.
- [ ] Учесть стратегическое решение: все редакторы переехали в плагины (Фаза 13.1); Storybook проектировать как документацию и песочницу не только builtin, но и plugin-provided компонентов.

---

## Фаза 11 — Хранилище: персистентность + оптимизация памяти (3 бэкенда)

### 11.1 Абстракция
- [x] Интерфейс `EntityStore` (`domain/storage/EntityStore.kt`): per-entity операции, open/exists/close/flush; `ColdStore` (load/persist/hasType/exists/availableTypes/close/closeAll); бэкенд из конфига.
- [x] Конфиг: `StorageConfig` (`backend: memory|files|redis|db|hybrid`, `enabled` false → чистая память, `memory.maxEntities`, `files.directory`, `redis.url`, `db.url`, `eviction: lru`) + парсинг в `ConfigLoader` + блок в `application.yaml` (default memory, пример hybrid комментарием).
- [x] Фабрика `StorageFactory` по конфигу, DI в `Main` (shutdown hook → `entityStore.closeAll()`). Возвращает `StorageResult(store, coldStore)`. Валидация: `redis`/`db` → требуют `url`; unknown backend / maxEntities=0 / eviction≠lru → IllegalArgumentException. ColdStore обогащает `ProjectService.listProjects()` (persisted projects visible after restart).
- [x] `DefaultEntityStore`: COW-map (volatile snapshot-чтение, synchronized COW-запись), LRU per-entity по access-времени, dirty-множество `(project,type)`, load-on-miss из cold, flush перед вытеснением (union hot+cold), `flush(projectId)/flushAll/close/closeAll`.

### 11.2 Бэкенды
- [x] `memory` — `DefaultEntityStore(cold = null)`, опциональный LRU-кап (`maxEntities`).
- [x] `files` — `FileColdStore`: JSON `<dir>/<projectId>/<entityType>.json` `{"type","objects":[{"id","value"}]}`, атомарная запись (tmp+rename, ATOMIC_MOVE), идемпотентная загрузка, десериализация в зарегистрированный modelClass; каталог создаётся лениво; write-behind flush по dirty-бакетам.
- [x] `redis` — `RedisColdStore`: ключи `cc:projects` (SET ID), `cc:types:{projectId}` (SET type), `cc:entity:{projectId}:{type}` (HASH id→JSON), Lettuce (Netty исключён из транзитивных зависимостей — конфликт с Ktor 4.2).
- [x] `db` — `DbColdStore`: H2 (in-memory/file), HikariCP connection pool; таблицы `projects` (project_id PK), `entities` (project_id+type+object_id PK, value TEXT); индексы, транзакции; `listPersistedProjects()` через SELECT.
- [x] `hybrid` — hot-слой в памяти (LRU, порог `maxEntities`), cold — files; вытеснение по доступу с flush (union) в cold; load-on-miss (get восстанавливает вытесненное из cold).

### 11.3 Интеграция и проверка
- [x] Все команды через `EntityStore`: `ProjectFactory`/`ProjectSerializer`/`ProjectService` переведены на store; `StoreObjectList` — ObjectList-фасад; `ProjectService.reopen` реидрируется после «рестарта» (`store.exists`); `project.save/load` сохраняют JSON-семантику.
- [x] Тесты (+25, suite 130 → **155 PASS**): `InMemoryEntityStoreTest` (CRUD, facade, LRU-eviction, unlimited), `FileEntityStoreTest` (round-trip через flush+reopen, removals persist, ProjectService реидратация, no `.tmp` leftovers), `HybridEntityStoreTest` (eviction+reload, closeAll→reopen), `StorageFactoryTest` (invalid configs: unknown/redis/db url required/maxEntities=0/eviction, disabled→memory, files lazy dir, hybrid cap), `DbColdStoreTest` (persist+load, exists, hasType, availableTypes, persist-empty-removes-type, listPersistedProjects, schema idempotency — 7 tests).
- [x] Демо/`application.yaml`: default `memory`/`enabled: false`, пример `hybrid` комментарием.

---

## Фаза 12 — Коллаборация / конфигурируемое ядро

- [x] Публикация событий мутаций сущностей на WS (канал проекта) + `collaboration.enabled` (по умолчанию off → текущее поведение).
- [x] Присутствие: connect/disconnect, участники; идентичность — из плагина (`client.identity`), default anonymous (ядро не завязывается на single-user).
- [x] Курсоры: RichText-каретки и выделение в Diagram — включается конфигом, опционально.
- [x] Тесты: два WS-клиента, мутация → событие второму; `collaboration.enabled=false` — событий нет.

---

## Фаза 13 — Кастомные компоненты (фаза требует тщательного проектирования)
- [x] Перенести редакторы в отдельные плагины (Фаза 13.1 — полностью завершена).
- [x] Спроектировать и продумать возможность добавления кастомных компонентов в редакторы (Canvas2D, Diagram, Scene3D) через плагины; конфигурируемые свойства компонентов, события, рендеринг, взаимодействие с редактором. (Реализовано в Фазе 13.1–13.2.)
- [x] Вынести из ядра UI-компоненты (builtin primitives) в плагины сделав максимально модульную систему. (Фаза 13.2: 21 компонент вынесен в `builtin-ui` плагин, JAR 12K.)


## Фаза 13.1 — Модульность UI: перенос компонентов и редакторов в плагины

**Цель:** спроектировать улучшение модульности системы так, чтобы из frontend ядра постепенно переехало всё, что может жить в плагинах: редакторы, сложные widgets, визуальные primitives/расширения, stories и документация компонентов. Ядро должно оставаться runtime-shell, protocol/registry, renderer host и загрузчик assets/bundles.

**Решения:**
- Frontend custom components регистрируются **так же как сейчас регистрируются плагины**: через JAR-плагины.
- JAR-плагин через SDK объявляет набор Vue-компонентов, их frontend bundle/assets/styles и JSON Schema конфигурации.
- Зарегистрированные компоненты становятся доступными через Runtime другим плагинам для использования в их UI-конфигурации.
- Frontend-bundles плагинов считаются полностью доверенным кодом, как и backend-код плагинов.
- Каждый редактор (`RichText`, `Diagram`, `Scene3D`, `Canvas2D`) стал отдельным plugin-provided компонентом/плагином.
- Для описания конфигурации компонента достаточно JSON Schema.
- Старые типы редакторов остаются только как migration aliases на период переезда.

### 13.1.1 Границы ядра и плагинов
- [x] Определить минимальный набор, который остаётся в ядре: `AppShell`, `PageView`, `SectionView`, `ComponentHost`, registries, binding/event engines, overlay/layer hosts, i18n/theme stores, `/config`, `/plugin-assets`, `/uidocs` в dev.
- [x] Определить переносимые части: все редакторы (`RichText`, `Diagram`, `Scene3D`, `Canvas2D`) и максимально возможный набор UI-компонентов как plugin-provided Vue-компоненты.
- [x] Сохранить обратную совместимость только на период миграции: существующие `type: "RichText"|"Diagram"|"Scene3D"|"Canvas"` работают через temporary compatibility aliases, после миграции aliases удаляются.

### 13.1.2 SDK-контракт custom component plugin
- [x] `FrontendComponentDefinition` data class в SDK (`type`, `name`, `version`, `bundlePath`, `cssPath?`, `schema?`, `capabilities`).
- [x] `PluginContext.registerFrontendComponent(definition)` — метод интерфейса.
- [x] Плагин объявляет Vue-компонент; Runtime агрегирует и публикует в `/config` как доступные component types через `PluginComponentEntry`.
- [x] Компоненты одного плагина доступны UI-конфигам других плагинов через общий registry Runtime.
- [x] Runtime должен валидировать, что UI-конфиг страницы ссылается только на зарегистрированные component types и совместимые versions/capabilities.

### 13.1.3 Runtime/frontend registry и загрузка
- [x] `/config` отдаёт `pluginComponents[]` (type, pluginId, name, version, bundleUrl, cssUrl, capabilities) — агрегация из всех плагинов.
- [x] `pluginLoader.ts` — ленивая загрузка plugin bundles через `import()`, кэш по bundleUrl, изоляция ошибок.
- [x] runtime-client facade (`runtimeClient.ts`) — реэкспорт ~50 API для плагинов (useCfg, useData, sessionStore, configStore, i18n, overlays, events, components, editors).
- [x] `vite.runtime-client.config.ts` — Vite lib build, externalize Vue → `@cutcrft/runtime-client` в importmap.
- [x] `index.html` importmap: `vue` → vendor, `@cutcrft/runtime-client` → runtimeClient.js.
- [x] Описать runtime client API для plugin component в документации. (`runtimeClient.ts` — facade реэкспортирует ~50 API, документирован через JSDoc; полная API-референс — при необходимости расширить.)

### 13.1.4 Редакторы как отдельные plugin-provided компоненты
- [x] `EditorCanvasPlugin` (editor-canvas) — `FrontendComponentDefinition(type="Canvas", bundlePath="frontend/canvas.js", capabilities=["toolbar","layers","undo","redo","readonly","pan","zoom","select","draw","resize"])`.
- [x] `EditorRichTextPlugin` (editor-richtext) — `FrontendComponentDefinition(type="RichText", bundlePath="frontend/richtext.js", capabilities=["toolbar","collaboration","readonly","mentions","undo","redo"])`.
- [x] `EditorDiagramPlugin` (editor-diagram) — `FrontendComponentDefinition(type="Diagram", bundlePath="frontend/diagram.js", capabilities=["toolbar","collaboration","layers","readonly","layout","undo","redo","pan","zoom","select","resize","snap"])`.
- [x] `EditorScene3DPlugin` (editor-scene3d) — `FrontendComponentDefinition(type="Scene3D", bundlePath="frontend/scene3d.js", capabilities=["toolbar","readonly","pan","zoom","select"])`.
- [x] `vite.editor-build.config.ts` — Vite lib build для editor bundles (externalize Vue + runtime-client, EDITOR env var).
- [x] `tsconfig.json` — exclude `src/editors/**/*` (editor source только для отдельной сборки, не основного vue-tsc).
- [x] `main.ts` — hardcoded `registerEditor()` вызовы удалены; загрузка через `pluginLoader.ts`.
- [x] Capability-флаги для каждого редактора — проверены по исходникам, исправлены: Canvas +readonly/pan/zoom/select/draw/resize; RichText +undo/redo; Diagram +undo/redo/pan/zoom/select/resize/snap; Scene3D −layers (false positive), +pan/zoom/select.

### 13.1.5 Storybook/UIDocs для plugin components
- [ ] UIDocs в dev подтягивает stories из ядра и из JAR-плагинов, применяя тему ядра из `/config`.
- [ ] `/config`-adapter строит stories из живых страниц/компонентов, а plugin docs metadata добавляет ручные сценарии и controls.
- [ ] Visual regression запускается по core stories и plugin stories, с матрицей тем light/dark/auto и ключевых responsive размеров.

### 13.1.6 Безопасность, versioning и миграция
- [x] Модель полного доверия frontend-bundles плагинов зафиксирована (плагины = доверенный код, sandbox/подписи/CSP не обязательны для MVP).
- [ ] Продумать versioning SDK/frontend runtime API и migration path для старых плагинов.
- [ ] Описать план удаления temporary aliases после выноса редакторов в отдельные плагины.

**Проверка (18.08.2026):** 4 editor plugin JARs + 1 builtin-ui plugin JAR собраны. Editor JARs: editor-canvas 12K, editor-richtext 184K, editor-diagram 208K, editor-scene3d 236K — clean structure без дублей. Editor bundles: canvas 22KB, richtext 673KB, diagram 835KB, scene3D 1089KB. Builtin-ui JAR: 23 JS-бандлов + style.css (45KB + 15KB), `BuiltinUiPlugin.kt` регистрирует 21 компонент. Runtime-client facade 36KB (включает `ComponentHost`, `mountShortcut`, `registerShortcut`, `emitShortcutAction` + все подтипы `FormFieldConfig`, `BadgeTone`, `TableColumnConfig`, `TableRowAction`). Frontend build PASS (vite + vite.runtime-client). Backend tests: 202 PASS. Migration aliases: `canvas`→`canvas2d`, `richtext`/`diagram`/`scene3d` registered both ways. Component type validation in `WorkspaceConfigurationBuilder.validateComponentTypes()`. Pre-existing Storybook TS error (`@storybook/vue3`) remains — not related to our changes.

---

## Фаза 14 — Слои интерфейса через `/config`

**Цель:** добавить в движок интерфейсов декларативные слои, чтобы страница могла состоять из нескольких независимых фрагментов UI с разным порядком наложения, прозрачностью и правилами обработки событий.

**Базовое решение:** модель слоёв приходит через `/config`. Если у страницы нет `layers`, текущая модель `sections` остаётся обратимо совместимой и считается одним базовым слоем.

**Реализовано (18.08.2026):** модель данных, backend-сервис, команды layer.show/hide/toggle, фронтенд LayerView, WS-события, pass-through логика.

### 14.1 Модель конфигурации
- [x] `PageDefinition.layers: List<LayerDefinition>` — опциональный список слоёв страницы (default = `emptyList()`).
- [x] `LayerDefinition`: `id`, `title?`, `order`, `visible`, `opacity`, `position: LayerPosition`, `pointerEvents: auto|none|pass-through`, `className?`, `sections: List<SectionDefinition>`.
- [x] `LayerPosition`: `type: relative|absolute|fixed`, `top?`, `left?`, `width?`, `height?`.
- [x] `UiConfig`: `layerComponentType` + `LayerFields` (pageId, id, title, order, visible, opacity, positionType, pointerEvents, className, sections).
- [x] `WorkspaceConfigurationBuilder.buildLayers()` — парсит Layer-определения и привязывает к страницам по `pageId`.
- [x] `ConfigLoader` — парсинг layer-полей из YAML.
- [x] `pointerEvents: pass-through` — JS-логика через MutationObserver в LayerView.vue (marks interactive children with `pointer-events: auto`).

### 14.2 Runtime-поддержка
- [x] `LayerService` — ConcurrentHashMap для хранения override видимости по проектам (setVisible, getVisible, toggle, getAllOverrides, clear).
- [x] `LayerCommands` — `LayerShowCommand`, `LayerHideCommand`, `LayerToggleCommand` (CommandType.SYSTEM).
- [x] `CommandDispatchService` — определяет `layer.*` команды после execution, рассылает `RuntimeEvent.ProjectEvent(type="layer.visibility")`.
- [x] `Main.kt` — регистрация `LayerService` + layer commands.

### 14.3 Фронтенд
- [x] `protocol/types.ts` — `LayerDefinition`, `LayerPosition` интерфейсы.
- [x] `store/layer.ts` — реактивный layer-стор с overrides, toggle, handleLayerEvent(), getVisibleLayers().
- [x] `LayerView.vue` — рендеринг слоёв: z-index, opacity, position, pass-through JS (MutationObserver + PointerEventsGuard).
- [x] `PageView.vue` — рендер layers если `page.layers` существует, fallback на sections.
- [x] `session.ts` — обработка `project.event` с `type: "layer.visibility"` → layerStore.handleLayerEvent().

### 14.4 Тесты
- [x] `LayerServiceTest` (8 тестов) — setVisible, getVisible, toggle, getAllOverrides, clear, project isolation.
- [x] `WorkspaceConfigurationBuilderTest` — 3 новых теста: layers из plugin UI, separation by page, empty layers.

### 14.5 Осталось
- [~] Проверить взаимодействие слоёв с `OverlayHost`, `GestureListener`, drag/drop, Canvas2D, Diagram, Scene3D и keyboard shortcuts.
- [ ] Документация сценариев: HUD поверх редактора, панель инструментов поверх canvas, полупрозрачная инфо-панель, split-layer страница.
- [ ] Storybook/UIDocs сценарии для слоёв: базовый слой + прозрачный слой кнопок + слой подсказок.

---

## Риски и решения

- **X6 полная конфигурируемость** — большой объём маппинга. Слои: базовые опции → фигуры → плагины → escape-hatch (registerComponent). Не пытаться покрыть 100% API сразу.
- **Версии либ** пиним (TipTap/X6/three обновляются часто).
- **Размер inline-контента в project JSON** — ок для MVP; blob-хранилище — отдельная задача (не в этом скоупе).
- **Canvas нативным API** — если объём инструментов раздуется, локальная замена на fabric/konva без внешних изменений.
