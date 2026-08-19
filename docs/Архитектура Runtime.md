# Архитектура Runtime

## 1. Обзор

Runtime — Kotlin-ядро для обработки команд над проектами. Оно не реализует домен конечного продукта: предметные модели, команды и UI поставляются внешними **плагинами**. Runtime только управляет проектами, их состоянием и командными сессиями.

Frontend всегда обращается к Runtime через HTTP API.

```
+---------------------------------------------------------------+
|  Frontend                                                      |
|  (JVM CLI / HTTP Web UI)                                       |
+---------------------------------------------------------------+
                              |
                          HTTP API
                              |
+---------------------------------------------------------------+
|  Runtime (domain)                                             |
|  - models/ (Project, Session, AuditEvent, RuntimeConfig, ...) |
|  - repositories/ (ProjectRepository, SessionRepository, ...)  |
|  - ProjectService      - EntityRegistry                       |
|  - CommandExecutor     - PluginManager                        |
|  - WorkspaceConfiguration                                     |
+---------------------------------------------------------------+
                              |
                         Plugin API
                              |
+---------------------------------------------------------------+
|  Plugins (внешние JAR)                                        |
|  - EntityDefinition  - Command  - UIDefinition                |
+---------------------------------------------------------------+
```

## 2. Слои

Модули (Maven reactor):

| Модуль | Содержимое | Назначение |
|---|---|---|
| `sdk` (артефакт `io.runtime:runtime-sdk`) | Контракты Plugin API: `Plugin`, `PluginContext`, `Command`, `CommandContext`, `CommandResult`, `EntityDefinition`, `EntityType`, `ObjectList`, `ObjectId`, `ObjectRef`, `PluginInfo/Id/Version`, `UIDefinition` | Артефакт, против которого компилируются плагины |
| `runtime` | Ядро: `Project`, `ProjectService`, `ProjectRepository`, `SynchronizedObjectList`, реестры, `PluginManager`, HTTP/WS | Запуск Runtime |

Слои внутри ядра:

| Слой | Содержимое | Зависит от |
|---|---|---|
| Application | `CommandExecutor`, `ProjectService`, `AuditService`, `SessionManager`, `CommandDispatchService`, `WorkspaceConfigurationBuilder`, HTTP/WS | domain, sdk |
| Domain | `models/` (модели: `Project`, `Session`, `AuditEvent`, `RuntimeConfig`, `WorkspaceConfiguration`, ...), `repositories/` (порты-хранилища: `ProjectRepository`, `SessionRepository`, `CommandRegistry`, `EntityRegistry`, `AuditLog`) | sdk |
| SDK (контракты) | `Plugin`, `Command`, `CommandContext`, `EntityDefinition`, `ObjectList` | kotlin-stdlib |
| Plugins | внешние JAR, реализуют контракты SDK | sdk |

Правило зависимостей: application → domain → sdk; plugins → sdk. Плагины ссылаются только на контракты SDK (`runtime.domain.plugin/command/entity/obj`) и не видят классы ядра.

## 3. Компоненты

### 3.1 Project

Хранит объекты проекта как типизированные коллекции `ObjectList`, по одной на `EntityType`.

```kotlin
class Project(
    val id: UUID,
    val name: String,
    val createdAt: Instant,
    val modifiedAt: Instant,
    private val lists: MutableMap<EntityType, ObjectList>
)
```

API:

| Метод | Назначение |
|---|---|
| `objectList(type)` | Получить `ObjectList` по типу (create-on-demand) |
| `objectLists()` | Все коллекции |
| `getObject(type, id)` | Объект по типу и идентификатору |

### 3.2 ObjectList

Контракт `ObjectList<T>` живёт в SDK (`io.runtime:runtime-sdk`); потокобезопасная реализация `SynchronizedObjectList` — в ядре.

```kotlin
// sdk/
interface ObjectList<T> {
    val entityType: EntityType
    fun create(model: T): ObjectRef
    fun create(objectId: ObjectId, model: T): Boolean
    fun get(objectId: ObjectId): T?
    fun update(objectId: ObjectId, model: T): Boolean
    fun delete(objectId: ObjectId): Boolean
    fun list(): List<ObjectRef>
    fun values(): List<T>
    fun size(): Int
}
```

| Метод | Назначение |
|---|---|
| `create(value)` | Создать объект, вернуть `ObjectRef` |
| `update(id, value)` | Обновить объект |
| `delete(id)` | Удалить объект |
| `get(id)` | Прочитать объект |
| `values()` | Все объекты (копия) |
| `size()` | Размер |

Каждая операция работает под ReadWriteLock: чтение — read lock, изменение — write lock.

### 3.3 ProjectRepository (порт) и InMemoryProjectRepository

Хранилище активных проектов. Порт `ProjectRepository` объявлен в `runtime.domain.repositories`, реализация `InMemoryProjectRepository` (`ConcurrentHashMap`) — в `runtime.infrastructure.inmem`.

```kotlin
interface ProjectRepository {
    fun register(project: Project)
    fun get(id: ProjectId): Project?
    fun list(): Set<ProjectId>
    fun remove(id: ProjectId): Project?
    fun replace(project: Project)
}
```

### 3.4 ProjectService

Сериализация и десериализация проектов (Jackson). Сериализатор определяет формат хранения; persistence-плагин получает/отдаёт JSON через команды `project.save` / `project.load`. Напрямую сервис плагинам недоступен.

```kotlin
class ProjectService(
    private val projectRepository: ProjectRepository,
    private val projectFactory: ProjectFactory,
    private val serializer: ProjectSerializer
) {
    fun createProject(id: ProjectId): Project
    fun getProject(id: ProjectId): Project?
    fun listProjects(): Set<ProjectId>
    fun removeProject(id: ProjectId): Project?
    fun saveProject(project: Project): String
    fun loadProject(id: ProjectId, data: String): Project
}
```

### 3.5 CommandRegistry

```kotlin
class CommandRegistry {
    fun register(pluginId: PluginId, command: Command)
    fun register(id: String, command: Command)
    fun get(id: String): Command?
    fun all(): Map<String, Command>
}
```

Команды регистрируют плагины в `initialize`. Встроенные команды (`project.*`) регистрируются ядром и живут в том же реестре.

### 3.6 EntityRegistry

```kotlin
class EntityRegistry {
    fun register(definition: EntityDefinition)
    fun get(type: EntityType): EntityDefinition?
    fun exists(type: EntityType): Boolean
    fun list(): Set<EntityType>
}
```

### 3.7 PluginManager

Управляет загрузкой, валидацией, регистрацией и запуском плагинов. Разрешает зависимости (топологическая сортировка). Для каждого плагина создаётся `PluginClassLoader` (parent-first).

## 4. Встроенные команды ядра

Ядро регистрирует команды жизненного цикла проекта:

| Команда | Назначение |
|---|---|
| `project.create` | Создать проект |
| `project.open` | Открыть проект (загрузить в registry) |
| `project.list` | Список открытых проектов |
| `project.save` | Сериализовать проект (JSON) |
| `project.load` | Восстановить проект из JSON |

Встроенные команды выполняют специализированную логику и не являются примерами команд плагинов.

## 5. WorkspaceConfiguration

`GET /config` возвращает метаданные окружения: версию, API-версию, списки команд, сущностей и UI. Собирается из `CommandRegistry`, `EntityRegistry` и зарегистрированных `UIDefinition`.

Плагин не участвует в сборке напрямую — ядро агрегирует его регистрации.

## 6. Аудит

Команды возвращают `CommandResult` со списком `references` — идентификаторы объектов, затронутых командой. Это основа для будущего аудита изменений (лог действий пользователя).

```kotlin
class CommandResult(
    val success: Boolean,
    val message: String? = null,
    val value: Any? = null,
    val references: List<ObjectRef> = emptyList()
) {
    companion object {
        fun success(value: Any? = null, references: List<ObjectRef> = emptyList()): CommandResult
        fun error(message: String): CommandResult
    }
}
```

## 7. Многопоточность

- Команды выполняются параллельно на `Dispatchers.Default`.
- `ObjectList` потокобезопасен (ReadWriteLock).
- Для атомарной серии изменений команда оборачивает блок в `context.withProjectLock {}`.

## 8. Поток команды

1. Frontend отправляет WebSocket-сообщение `command.execute` с `commandId` и `params`.
2. `WsSessionHandler` находит привязанный к сессии проект и вызывает `CommandExecutor`.
3. `CommandExecutor` создаёт `CommandContextImpl` (реализует `CommandContext`; встроенные команды получают `Project` через приведение к `CommandContextImpl`).
4. Команда исполняется и возвращает `CommandResult`.
5. Runtime сериализует результат в JSON (Jackson).

## 9. Диаграмма состояния проекта

```
create() ──► NEW
open()   ──► ACTIVE (загружен в registry)
save()   ──► сериализация (состояние не меняется)
close()  ──► CLOSED
```

## 10. Файловая структура

```
CutCruft/
├── pom.xml                    # агрегатор runtime-parent (modules: sdk, runtime)
├── Makefile                   # frontend/sdk/plugin/backend/build/dev/clean
├── sdk/                       # артефакт io.runtime:runtime-sdk
│   └── src/main/kotlin/runtime/domain/
│       ├── command/           # Command, CommandResult, CommandContext (контракты)
│       ├── entity/            # EntityDefinition, EntityType
│       ├── obj/               # ObjectId, ObjectList, ObjectRef
│       └── plugin/            # Plugin, PluginContext, PluginInfo/Id/Version, UIDefinition
├── runtime/
│   ├── src/main/kotlin/runtime/
│   │   ├── application/       # CommandExecutor, CommandContextImpl, ProjectLocks, ProjectService/Serializer/Factory,
│   │   │                      # BuiltInProjectCommands, AuditService/AuditReplayer, SessionManager/CommandDispatchService,
│   │   │                      # WorkspaceConfigurationBuilder
│   │   ├── domain/            # models/ (по файлу на сущность: Project, Session, AuditEvent, WorkspaceConfiguration,
│   │   │                      # RuntimeConfig, PluginDescriptor, CommandIds, Messages)
│   │   │                      # repositories/ (порты: ProjectRepository, SessionRepository, CommandRegistry,
│   │   │                      # EntityRegistry, AuditLog)
│   │   ├── infrastructure/    # configuration (ConfigLoader), inmem (InMemory* адаптеры), obj (SynchronizedObjectList),
│   │   │                      # plugin (PluginLoader, PluginClassLoader, PluginDescriptorLoader, PluginContextImpl),
│   │   │                      # web (WebServer, HttpEndpoints), ws (WsSessionHandler, WsProtocol, WsEnvelope, WsMessageType)
│   │   └── Main.kt            # композиционный корень
│   ├── src/main/resources/static/  # frontend build (копируется и попадает в JAR)
│   ├── src/test/kotlin/       # тесты
│   └── pom.xml
├── config/
│   └── application.yaml       # server.host/port, plugins.directories
├── plugins/
│   ├── demo/                  # демо-плагин (config.yaml + demo.jar)
│   └── demo-storage/          # демо-плагин storage (config.yaml + demo-storage.jar)
├── demo-plugin/               # исходники демо-плагина (зависит от SDK)
├── demo-storage-plugin/       # исходники storage-плагина (зависит от SDK и от demo)
├── frontend/                  # Vue 3 + Vite + TS
└── docs/
    ├── Устройство Плагинов.md
    ├── Устройство Runtime.md
    ├── Архитектура Runtime.md
    ├── Демо плагин.md
    └── README.md
```

## 11. Формат хранения проекта

```json
{
  "project": {
    "id": "...",
    "name": "...",
    "createdAt": "...",
    "modifiedAt": "..."
  },
  "objects": {
    "server.server": [ { "type": "server.server", "id": "...", "value": { ... } } ],
    "server.database": [ { ... } ]
  }
}
```

Точный формат определяет `ProjectSerializer` (ModelSerializer + Jackson). Данные хранилища сериализуются без знания типов объектов проекта — десериализация происходит при загрузке через `EntityRegistry` (маппинг `type → modelClass`).

## 12. Подключение плагинов

Директории плагинов задаются в `config/application.yaml` (`plugins.directories`). Плагин — это директория с JAR и `config.yaml`. Плагин не имеет собственных реестров; он регистрирует расширения в реестрах ядра через `PluginContext` во время `initialize`.

## 13. Управление жизненным циклом

| Компонент | Владелец |
|---|---|
| `Project` / `ObjectList` | Runtime (ядро) |
| Реестры (Command/Entity/UI) | Runtime (ядро) |
| Модели, команды, UI | Плагины |
| Хранилище проектов | Плагины (persistence) |

## 14. Принципы

1. **Ядро без предметного кода** — Runtime не знает ни одной предметной модели.
2. **Плагины доверенные** — загружаются локально, не sandboxed.
3. **Только WS API** — Frontend не знает runtime-классов: команды выполняются через `command.execute` по WebSocket `/ws`, конфигурация UI читается из `GET /config`.

---

## 15. Frontend Architecture

### 15.1 Принцип: «Тупой фронтенд»

Frontend — это **минимальный shell**, который:
- Рендерит UI
- Обрабатывает ввод
- Отправляет команды на backend
- **ИСКЛЮЧЕНИЕ**: render-логика (tiptap, three.js) — OK на фронте

Вся остальная логика — в Kotlin-плагинах на backend.

```
Frontend (TS/Vue):
├── Рендерит UI
├── Обрабатывает ввод
├── Отправляет команды на backend
└── ИСКЛЮЧЕНИЕ: render-логика (tiptap, three.js) — OK на фронте

Backend (Kotlin):
├── Вся бизнес-логика
├── Валидация данных
├── Обработка команд
└── Persistence
```

### 15.2 Структура ядра фронтенда

```
frontend/src/
├── core/
│   ├── primitives/          # Layout-примитивы
│   │   ├── Container.vue    # Рендерит зарегистрированный компонент по типу
│   │   ├── Page.vue         # Верхнеуровневый layout
│   │   ├── Section.vue      # Секция внутри страницы
│   │   ├── Stack.vue        # Горизонтальный/вертикальный стек
│   │   ├── Grid.vue         # Сетка
│   │   ├── Layer.vue        # z-index слой
│   │   ├── Slot.vue         # Именованная зона контента
│   │   └── Portal.vue       # Рендер в другую часть DOM
│   ├── features/            # Фичи интерфейса
│   │   ├── CommandPalette.vue
│   │   ├── Sidebar.vue
│   │   ├── Tabs.vue
│   │   ├── Toast.vue
│   │   └── Docs.vue
│   ├── theme/               # Темизация
│   │   ├── ThemeProvider.vue
│   │   └── theme.css        # Auto-generated из theme.yaml
│   ├── shortcuts/           # Горячие клавиши
│   │   └── ShortcutManager.ts
│   ├── commands/            # Реестр команд
│   │   └── CommandRegistry.ts
│   ├── events/              # Event bus (plugin-to-plugin)
│   │   └── EventBus.ts
│   ├── entity/              # Entity store API
│   │   └── EntityStore.ts
│   ├── animations/          # API анимаций
│   │   └── AnimationManager.ts
│   ├── router/              # Навигация
│   │   └── Router.ts
│   ├── modal/               # Модальные окна
│   │   └── ModalManager.ts
│   ├── clipboard/           # Буфер обмена
│   │   └── ClipboardManager.ts
│   ├── auditlog/            # Undo/аудит
│   │   └── AuditLog.ts
│   └── plugin/              # Загрузка плагинов
│       ├── pluginLoader.ts
│       ├── PluginContext.ts
│       └── registries/
│           ├── componentRegistry.ts
│           └── editorRegistry.ts
├── protocol/                # Типы и протоколы
│   ├── envelope.ts
│   └── types.ts
├── store/                   # Stores (session, i18n, toasts)
├── main.ts
└── runtimeClient.ts         # SDK facade для плагинов
```

### 15.3 UI-примитивы

Ядро предоставляет **абстрактные строительные блоки**:

| Примитив | Назначение |
|---|---|
| `Container` | Рендерит зарегистрированный компонент по типу (resolve по registry) |
| `Page` | Верхнеуровневый layout (контейнер для sections/layers) |
| `Section` | Секция внутри страницы (auto-layout) |
| `Stack` | Горизонтальный/вертикальный стек (was SectionView) |
| `Grid` | Сетка (grid layout) |
| `Layer` | z-index слой (with visibility/opacity/position) |
| `Slot` | Именованная зона контента (как slot в web components) |
| `Portal` | Рендер в другую часть DOM |

### 15.4 Plugin Context API

Каждый плагин получает объект контекста:

```typescript
interface PluginContext {
  // Регистрация
  registerComponent(type: string, component: Component): void
  registerCommand(name: string, handler: Function): void
  registerShortcut(key: string, action: string): void
  
  // Тема (read-only)
  theme: ThemeObject
  
  // Хранилище
  storage: { get(key: string): any; set(key: string, value: any): void }
  
  // События (plugin-to-plugin)
  emit(event: string, data: any): void
  on(event: string, handler: Function): void
  
  // Entity Store
  entityStore: {
    list(entityType: string): Promise<Entity[]>
    get(entityType: string, id: string): Promise<Entity>
    create(entityType: string, data: any): Promise<Entity>
    update(entityType: string, id: string, data: any): Promise<Entity>
    delete(entityType: string, id: string): Promise<void>
  }
  
  // Анимации
  animate(element: Element, animation: string, options?: AnimationOptions): Promise<void>
  animation: { class(name: string): string }
  
  // Навигация
  router: {
    push(path: string): void
    replace(path: string): void
    back(): void
  }
  
  // Модальные окна
  modal: {
    open(component: Component, props?: any): Promise<any>
    close(result?: any): void
  }
  
  // Буфер обмена
  clipboard: {
    read(): Promise<string>
    write(text: string): Promise<void>
  }
  
  // Аудит-лог (undo)
  auditlog: {
    push(action: string, data: any): void
    undo(): Promise<void>
    canUndo(): boolean
  }
  
  // Утилиты
  format: FormatUtils
  icon: IconUtils
}
```

### 15.5 Theming System

Тема задаётся в YAML-конфиге ядра и автоматически генерирует CSS-переменные:

```yaml
# theme.yaml
colors:
  primary: '#3b82f6'
  secondary: '#64748b'
  background: '#ffffff'
  foreground: '#0f172a'

fonts:
  sans: 'Inter, sans-serif'
  mono: 'Fira Code, monospace'

spacing:
  sm: '8px'
  md: '16px'
  lg: '24px'

radius:
  sm: '4px'
  md: '8px'
  lg: '16px'

animations:
  fade-in: { duration: 200ms, easing: ease-out }
  slide-up: { duration: 300ms, easing: ease-in-out }
  scale-in: { duration: 150ms, easing: cubic-bezier(0.4, 0, 0.2, 1) }
```

Core генерирует:
- CSS-переменные (`--color-primary`, `--font-sans`, etc.)
- CSS-классы анимаций (`.anim-fade-in`, `.anim-slide-up`, etc.)

Плагины расширяют тему через `config.yaml`:
```yaml
# plugin/config.yaml
theme:
  colors:
    my-brand: '#ff0000'
```

### 15.6 Keyboard Shortcuts

- YAML config + runtime UI (пользователь может менять в настройках)
- `ShortcutManager` управляет регистрацией/переназначением
- Плагины регистрируют через `config.yaml` или `ctx.registerShortcut()`

### 15.7 Event System (plugin-to-plugin)

Плагины общаются через события:
```typescript
// Плагин A
ctx.emit('canvas:export', { format: 'png' })

// Плагин B
ctx.on('canvas:export', handleExport)
```

### 15.8 Animation API

Плагины используют анимации через API:
```typescript
// Через API
await ctx.animate(element, 'fade-in', { duration: 200 })

// Или через CSS-класс
const className = ctx.animation.class('fade-in')  // → 'anim-fade-in'
```

Типы анимаций:
- Transition (fade, slide, scale, rotate)
- Loading (spinner, skeleton, pulse)
- Attention (shake, bounce, glow)
- Layout (expand, collapse, reflow)

### 15.9 Storybook (`/storybook`)

Built-in route в runtime:
- Доступен по `http://localhost:8080/storybook`
- Показывает все зарегистрированные компоненты
- Theming через YAML → live preview
- Редактирование темы через UI
- Экспорт в код

---

## 16. Plugin System (Frontend)

### 16.1 Структура плагина

```
plugins/my-plugin/
├── config.yaml           # Metadata + registration + dependencies
├── pom.xml               # Maven (для JAR)
├── src/main/
│   ├── kotlin/           # Backend (Kotlin)
│   │   └── MyPlugin.kt
│   └── resources/
│       ├── frontend/
│       │   ├── Button.js
│       │   ├── Button.html
│       │   └── style.css  (минимальный, тема из ядра)
│       └── META-INF/
│           └── plugin.yaml
└── target/
    └── my-plugin.jar
```

### 16.2 config.yaml

```yaml
name: my-plugin
version: 1.0.0
description: My custom plugin

dependencies:
  - builtin-ui
  - editor-canvas

coreVersion: '>=1.0.0 <2.0.0'

components:
  - type: my-button
    name: MyButton
    entry: frontend/Button.js
    template: frontend/Button.html
    props:
      variant: [primary, secondary, ghost]
      size: [sm, md, lg]
    capabilities: [text, icon, disabled]

commands:
  - name: my-button:submit
    backend: com.example.MyPlugin.handleSubmit
    shortcuts:
      - key: Enter
        action: submit

shortcuts:
  - key: Ctrl+Shift+M
    action: my-button:submit
    description: Submit form
```

### 16.3 Plugin Loading

1. Core starts
2. Core reads `theme.yaml` → generates CSS variables
3. Core scans `.plugins/` directory for JAR files
4. For each JAR:
   a. Read `config.yaml`
   b. Load JS bundle (dist/my-plugin.js)
   c. Execute plugin with PluginContext
   d. Plugin calls `ctx.registerComponent('my-button', MyButton)`
   e. Plugin calls `ctx.registerCommand('my-button:submit', handler)`
   f. Plugin calls `ctx.registerShortcut('Ctrl+Shift+M', 'my-button:submit')`
5. All components/commands/shortcuts registered
6. UI renders using registered components

### 16.4 Plugin Discovery

- Scan `.plugins/` directory + read `config.yaml`
- Topological sort based on dependencies
- Configurable error handling (`failOnError` flag)
- Manual update (replace JAR, restart)

### 16.5 Component Capabilities

Auto-detected from component implementation. Core determines which editors/components can use the plugin based on capabilities.

### 16.6 Template System

Hybrid: Vue SFC, HTML+TS, JSX/TSX — поддержка всех форматов.

### 16.7 Component Slots

Through `PluginContext.slots` (текущий подход).
4. **UI декларативен** — Frontend строит интерфейс из `UIDefinition`.
