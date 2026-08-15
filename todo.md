# CutCruft — План работ: редакторы (TipTap/X6/three.js/canvas), i18n, overlays, сборка

Статус легенды:
- `[ ]` — задача не начата
- `[~]` — в работе
- `[x]` — выполнено (с результатом)
- `[!]` — блокер / пересмотрено

---

## Решения, зафиксированные с пользователем

| Вопрос | Решение |
|---|---|
| Доставка JS редакторов | **Ленивые чанки в ядре** (`dynamic import()` + Vite code-split). Тяжёлые либы грузятся только при появлении типа в конфиге. Escape-hatch для будущего: `registerComponent` + JS-бандлы плагинов (заложено в `frontend/src/renderer/componentRegistry.ts`). |
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
- [ ] `layout {dagre|circle}`, dnd/stencil-палитра, history/clipboard/keyboard — не в скоупе демо, escape-hatch через `registerComponent`.
- [x] Документация маппинга конфиг→Graph API — `docs/Редакторы.md`.

### 2.3 Scene3D (three.js)
- [x] Установить deps (`three@^0.185.1`, `@types/three`).
- [x] `UiScene3D.vue`: процедурная сцена из `content` (box/sphere/cylinder/model-gltf), тулбар add/delete/resetCamera, pick по клику, авто-вращение.
- [x] Схема `camera` (`fov/position/target`, применяется при старте и в resetCamera) + `lights` (`ambient.intensity`, `directional.intensity/position`) — декларативно.
- [ ] Nested objects, textures, environment/fog — упрощено; GLTF через `GLTFLoader` + `/plugin-assets/`.
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
- [ ] (Опция/позже) JS-бандлы плагинов — документировать как escape-hatch, если понадобится «JAR без 3D».

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
| Dev-режим | **Hot-reload у ядра**: разработчик получает собранное ядро и пишет плагины. `dev.enabled`; watch исходников плагинов (пересборка JAR + рестарт runtime); живой релоад конфига на клиенте (поллинг `/config` → обновление UI без F5); dev/prod в сборке (dev: source maps, без минфикации). |
| Автодокументация | **Web-страница /docs** (команды с группами + WS-протокол из живого конфига/дескрипторов) + **Storybook** для UI-компонентов и редакторов (mock-конфиги). |
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
- [ ] `UiCard` (`title/icon/actions/body/footer`), `UiAvatar` (`name/color/initials`), `UiProgress` (`value/max/tone`), `UiTabs` (внутрикомпонентные вкладки), `UiAccordion`, `UiBadge` (расширить tone).
- [ ] `UiColumn`/layout-контейнеры (`gap/grow/scroll`); `UiList` — `sortable`.
- [ ] Типы в `componentSpec` + builtin-реестр; конфиг демо: страница «Доски» из карточек/аватаров/прогресса (сборка доски из примитивов).

### 7.2 DnD (перетаскивание)
- [ ] `frontend/src/events/dndService.ts` — drag-инициация из компонента (переиспользует drag-жест), drag-overlay (полупрозрачная копия), drop-зоны по `accept`-типам; события на eventBus.
- [ ] `componentSpec`: `drag: {type, data}` / `drop: {accept, onDrop: {action/command, params}}`.
- [ ] Демо: перетаскивание карточек между колонками (список-доска из примитивов) → команда `demo.movecard` (переупорядочивание/перенос между колонками).
- [ ] Стенсил-палитра в Diagram использует dnd (см. Фазу 8).

### 7.3 UiImage + иконки из ассетов плагина
- [ ] `UiImage` компонент (`src`, `fit: cover|contain|fill`, `alt`, `ratio`); src — ассет плагина или внешний URL.
- [ ] Резолв `icon`/`logo` в конфиге: путь вида `assets/*.ext` → `/plugin-assets/<pluginId>/...` — в nav/меню/кнопках/табах (поле icon у navigation/menu уже есть; добавить в Button/Badge/UiCard/UiList).
- [ ] Демо: иконки nav/меню из assets; UiImage на странице «Доски».

### 7.4 Группировка команд
- [ ] Бэкенд: `CommandEntry` + `group` (дескриптор команды) → `/config` (`commands[].group`).
- [ ] CommandPalette: секции по группам (заголовки); /docs тоже группирует (Фаза 10).
- [ ] Демо: группы (workspace/documents/diagram/canvas/scene/storage…).

---
## Фаза 7 - 8 - спроектировать и реализовать небольшое изменение архитектуры
- [ ] перепроектировать систему таким образом чтобы то за что отвечает main плагин было частью ядра. Cтруктура страниц какой плагин ентерипоинт и настройка стилистики интерфейса переходит в ядро. В плагинах оставляем структуру самой страницы наполнение контентом и кнопками и все так же логику работы как и сейчас (правки вносим минимальные) 
- [ ] улучшить многопоточность и производительность ядра. Сделать так чтобы ядро могло обрабатывать несколько запросов одновременно учитывая что в ядре есть несколько плагинов которые могут обрабатывать запросы. Сделать так чтобы при обработке запроса не блокировался основной поток ядра. Продумать потокобезопасность и синхронизацию данных между потоками.

Требуется перепроектировать архитектуру ядра и плагинов таким образом чтобы ядро могло обрабатывать несколько запросов одновременно, учитывая что в ядре есть несколько плагинов которые могут обрабатывать запросы. Сделать так чтобы при обработке запроса не блокировался основной поток ядра. Продумать потокобезопасность и синхронизацию данных между потоками.
---

## Фаза 8 — Завершение редакторов

### 8.1 Контекстные меню Canvas2D / Scene3D (паттерн Фазы 5.2)
- [ ] `UiCanvas.vue`: `canvas.element` — contextmenu → `onGesture` (componentId, row: {id,type}), подписка `editor.command` — delete/duplicate/front/back.
- [ ] `UiScene3D.vue`: `scene3d.object` — ПКМ по мешу → onGesture (row: {id}), `editor.command` — delete/duplicate.
- [ ] Демо: оверлеи `canvas-element-menu`, `scene-object-menu` + триггеры.

### 8.2 Diagram: layout {dagre|circle}, стенсил, history
- [ ] `layout: {type: dagre|circle|grid}` — `@dagrejs/dagre` (или своя раскладка) / окружность / текущая грид-раскладка.
- [ ] Стенсил-палитра: `stencil: {nodes: [...]}` — палитра слева, dnd из палитры в граф (X6 `dnd` плагин + наш dnd из 7.2).
- [ ] History/clipboard/keyboard: X6-плагины (undo/redo `⌘Z`/`⌘⇧Z`, copy/paste), кнопки undo/redo в тулбаре.

### 8.3 Canvas2D undo/redo + Scene3D
- [ ] Canvas2D: стек команд (инкрементальные операции или снапшоты), undo/redo в тулбаре + `⌘Z`.
- [ ] Scene3D: nested objects (`children` в контенте), текстуры (color/material), fog — упрощённо.

---

## Фаза 9 — Роутинг, эмбед, редиректы, адаптивность

### 9.1 URL-роутинг
- [ ] Роутер-стор: hash `#/page/<id>` по умолчанию; `routing.mode: hash|history` из конфига (history — SPA-fallback на сервере: `/page/<id>` → index.html).
- [ ] Табы/активная страница ↔ URL: deep-link, браузерный back/forward, восстановление открытой страницы из URL при загрузке.

### 9.2 Редиректы
- [ ] `redirects: [{from, to}]` в конфиге; резолв в навигации (navigation.request + прямое открытие URL) и в роутере.

### 9.3 Эмбед-режим + UiFrame
- [ ] `/embed?page=<id>`: рендер страницы без шапки/сайдбара/табов (для встраивания во внешний сайт).
- [ ] `UiFrame` компонент: `{type:"Frame", src}` — URL/страница/ассет плагина.

### 9.4 Адаптивность оболочки
- [ ] Sidebar→drawer на мобильном (бургер), топбар сворачивается, табы скролл, шапка адаптивна.

### 9.5 Адаптивность редакторов и компонентов
- [ ] Тулбары редакторов переносятся; canvas/diagram/scene ресайз по контейнеру (ResizeObserver).
- [ ] Container queries для компонентов (UiTable/UiForm/UiCard/UiList) — компактные режимы.

---

## Фаза 10 — Dev-режим ядра + автодокументация + Storybook

### 10.1 Dev-режим ядра (hot-reload у ядра)
- [ ] `dev.enabled` в конфиге + режимы сборки фронта (dev: source maps, без минфикации; prod: текущая сборка).
- [ ] Watch плагинов: изменение исходников/ресурсов плагина → пересборка JAR + рестарт runtime (hot-reload у ядра, разработчик пишет только плагины).
- [ ] Живой релоад конфига на клиенте: поллинг `/config` (или SSE) → пересборка конфига в store → обновление UI без F5.
- [ ] Стартер/шаблон плагина + документация «как собрать приложение на ядре».

### 10.2 Автодокументация: /docs
- [ ] Страница /docs в конфиге ядра: команды (группы/описание/параметры) + WS-протокол (типы сообщений, envelope, ошибки) из живого конфига/дескрипторов.

### 10.3 Storybook
- [ ] Storybook для builtin-компонентов и редакторов (mock-конфиги/данные, декларативные сценарии).

---

## Фаза 11 — Хранилище: персистентность + оптимизация памяти (3 бэкенда)

### 9.1 Абстракция
- [ ] Интерфейс `Storage` в runtime: проекты, сущности/контент, аудит; бэкенд из конфига.
- [ ] Конфиг: `storage.backend: memory|files|redis|db|hybrid`, `storage.enabled` (false → чистая память), `storage.memory.maxEntities`, `storage.files.directory`, `storage.redis.url`, `storage.eviction` (lru).
- [ ] Фабрика бэкенда по конфигу, DI в `Main`.

### 9.2 Бэкенды
- [ ] `memory` — текущий `InMemoryProjectRepository`/`InMemoryAuditLog`.
- [ ] `files` — JSON: `<dir>/projects.json` (индексы) + `<dir>/<projectId>/**` (сущности, группировка по типам/пакетами), атомарная запись (tmp+rename), идемпотентная загрузка; большие `content` — отдельные blob-файлы.
- [ ] `redis` — ключи `cc:entity:<project>:<type>:<id>`, пайплайн-батчи (группировка).
- [ ] `db` — таблицы `projects`, `entities`, `audit_log`; индексы по проекту/типу/id; пакетная запись; атомарные транзакции (на выбор любая sql бд через jdbc). 
- [ ] `hybrid` — hot-слой в памяти (LRU, порог `maxEntities`), cold — files/redis; пакетная запись холодных сущностей (по типам/проекту), flush по таймеру/порогу; вытеснение по доступу.

### 9.3 Интеграция и проверка
- [ ] Все команды (`project.create/open/save/load/list`, entity CRUD, документы) через `Storage`; WS не меняется.
- [ ] Тесты: files round-trip (create → «рестарт» → load), hybrid с малым `maxEntities` (вытеснение/возврат), невалидный конфиг.
- [ ] Демо/`application.yaml`: default `memory`, пример `hybrid` комментарием.

---

## Фаза 12 — Коллаборация / конфигурируемое ядро

- [ ] Публикация событий мутаций сущностей на WS (канал проекта) + `collaboration.enabled` (по умолчанию off → текущее поведение).
- [ ] Присутствие: connect/disconnect, участники; идентичность — из плагина (`client.identity`), default anonymous (ядро не завязывается на single-user).
- [ ] Курсоры: RichText-каретки и выделение в Diagram — включается конфигом, опционально.
- [ ] Тесты: два WS-клиента, мутация → событие второму; `collaboration.enabled=false` — событий нет.

---

## Риски и решения

- **X6 полная конфигурируемость** — большой объём маппинга. Слои: базовые опции → фигуры → плагины → escape-hatch (registerComponent). Не пытаться покрыть 100% API сразу.
- **Версии либ** пиним (TipTap/X6/three обновляются часто).
- **Размер inline-контента в project JSON** — ок для MVP; blob-хранилище — отдельная задача (не в этом скоупе).
- **Canvas нативным API** — если объём инструментов раздуется, локальная замена на fabric/konva без внешних изменений.
