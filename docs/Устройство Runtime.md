# Устройство Runtime

## 1. Назначение

Runtime — JVM-ядро, которое предоставляет plugin-ориентированную среду выполнения. Оно не содержит предметной логики, но обеспечивает:

- загрузку внешних JAR-плагинов и их жизненный цикл;
- управление проектами и объектами проектов;
- выполнение команд плагинов;
- ведение журнала операций (audit);
- сохранение и загрузку состояния проекта;
- HTTP/WebSocket-интерфейс и раздачу статического frontend.

Репо — Maven reactor из двух модулей:

| Модуль | Артефакт | Содержимое |
|---|---|---|
| `sdk` | `io.runtime:runtime-sdk` | Контракты Plugin API (только интерфейсы и базовые классы, зависимость только `kotlin-stdlib`) |
| `runtime` | `io.runtime:runtime` | Ядро: реестры, проекты, аудит, загрузка плагинов, HTTP/WS |

Плагины компилируются только против артефакта `io.runtime:runtime-sdk`; ядро (`runtime`) содержит и контракты (через зависимость на SDK), и реализацию.

## 2. Технологический стек

| Компонент | Технология |
|---|---|
| Язык | Kotlin |
| Сборка | Maven (multi-module, Kotlin 2.3.0, target 17) |
| HTTP / WebSocket | Ktor 3.5 (Netty) |
| Сериализация моделей | Jackson (`jackson-databind` + `jackson-module-kotlin`) |
| WS-протокол | kotlinx.serialization 1.8.0 |
| Конфигурация | SnakeYAML |
| Frontend | Vue 3 + Vite |
| Тестирование | JUnit 5 + MockK |
| Документация SDK | Dokka 2.2.0 (фаза `package`), source-jar |

## 3. Слои архитектуры

```
sdk/src/main/kotlin/runtime/domain/     # контракты Plugin API
├── command/                  # Command, CommandContext, CommandResult
├── entity/                   # EntityType, EntityDefinition
├── obj/                      # ObjectId, ObjectRef, ObjectList (интерфейс)
└── plugin/                   # Plugin, PluginInfo/Id/Version, PluginContext, UIDefinition

runtime/src/main/kotlin/runtime/
├── Main.kt
├── domain/                       # Модели, структуры данных, интерфейсы ядра
│   ├── audit/                    # AuditEvent, AuditEventId, AuditLog
│   ├── command/                  # CommandRegistry, ProjectBoundCommandContext
│   ├── entity/                   # EntityRegistry
│   ├── obj/                      # SynchronizedObjectList
│   ├── project/                  # ProjectId, Project, ProjectRegistry
│   ├── session/                  # Session, SessionRegistry
│   └── workspace/                # Workspace, WorkspaceConfiguration
├── application/                  # Сервисы и оркестрация
│   ├── workspace/WorkspaceBuilder.kt
│   ├── project/ProjectFactory.kt, ProjectService.kt, ProjectSerializer.kt
│   ├── project/commands/BuiltInProjectCommands.kt
│   ├── command/CommandExecutor.kt, CommandContextImpl.kt
│   └── audit/AuditService.kt, AuditReplayer.kt
├── infrastructure/
│   ├── plugin/                   # PluginLoader, PluginClassLoader, PluginDescriptor(Loader), DependencyResolver, PluginContextImpl
│   ├── configuration/            # RuntimeConfig, ConfigLoader
│   └── web/                      # WebServer
└── interfaces/
    ├── http/HttpEndpoints.kt
    └── ws/WsSessionHandler.kt, SessionRouting.kt, WsProtocol.kt, WsEnvelope.kt, WsMessageType.kt
```

Правило зависимостей: `application → domain → sdk`; `plugins → sdk`. Плагины не видят классы ядра.

## 4. Модели и структуры данных

> Помечены модулем-владельцем. Без пометки — общее.

### 4.1 `runtime.domain.obj.ObjectId` (SDK)

Постоянный UUID-идентификатор экземпляра объекта проекта.

```kotlin
@JvmInline
value class ObjectId(val value: UUID) {
    companion object { fun generate(): ObjectId }
}
```

Свойства:

| Свойство | Правило |
|---|---|
| Создание | UUID генерируется при `ObjectList.create` |
| Изменение | UUID сохраняется |
| Удаление | UUID больше не используется для текущего состояния |
| Восстановление | UUID сохраняется при save/load и replay |

### 4.2 `runtime.domain.obj.ObjectRef` (SDK)

Идентификационная ссылка на экземпляр `ObjectList` (только для адресации и аудита).

```kotlin
data class ObjectRef(
    val entityType: EntityType,
    val objectId: ObjectId
)
```

`ObjectRef` **не является связью между сущностями**. Если плагину нужна связь (например, «сервер привязан к базе»), он описывает её собственной моделью со своими полями. Ядро не интерпретирует связи.

### 4.3 `runtime.domain.obj.ObjectList<T>` (SDK) и `SynchronizedObjectList` (ядро)

Контракт коллекции экземпляров одной модели внутри `Project` объявлен в SDK; потокобезопасная реализация `SynchronizedObjectList` живёт в ядре.

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

| Операция | Поведение |
|---|---|
| `create(model)` | Генерация UUID, сохранение, возврат `ObjectRef` |
| `create(id, model)` | Вставка с фиксированным UUID (используется replay и загрузкой) |
| `get(objectId)` | Получение модели по идентификатору |
| `update(objectId, model)` | Замена состояния с тем же UUID |
| `delete(objectId)` | Удаление из текущего состояния |
| `list()` | Список `ObjectRef` |
| `values()` | Копия списка значений |
| `size()` | Количество элементов |

**Потокобезопасность:** `SynchronizedObjectList` защищён `ReentrantReadWriteLock` — чтения могут идти параллельно, записи сериализуются.

**Командам передаётся ссылка на `ObjectList`** (без копирования) через `CommandContext`; команды мутируют общую структуру напрямую.

### 4.4 `runtime.domain.entity.EntityType` (SDK)

Стабильный идентификатор модели: `<pluginId>.<entityName>`, например `server.server`, `demo.task`. Паттерн `^[a-z][a-z0-9]*\.[a-z][a-z0-9]*$`.

### 4.5 `runtime.domain.entity.EntityDefinition` (SDK)

```kotlin
interface EntityDefinition {
    val type: EntityType
    val modelClass: Class<*>   // используется Jackson при save/load
}
```

`modelClass` позволяет `ProjectSerializer` десериализовать модели плагинов без аннотаций.

### 4.6 `runtime.domain.entity.EntityRegistry` (ядро)

Потокобезопасный реестр (`ConcurrentHashMap`) моделей. Хранит только определения, не экземпляры.

| Операция | Назначение |
|---|---|
| `register(definition)` | Регистрация модели; повторная регистрация — ошибка |
| `get(type)` | Получение по `EntityType` |
| `exists(type)` | Проверка существования |
| `list()` | Множество зарегистрированных типов |

### 4.7 `runtime.domain.command.Command` (SDK)

Базовый класс команд плагинов.

```kotlin
abstract class Command(
    val name: String,          // короткое имя: [a-z][a-z0-9]*
    val description: String = ""
) {
    abstract suspend fun execute(context: CommandContext, params: Any?): CommandResult
}
```

Полный идентификатор команды в реестре: `<pluginId>.<name>`, например `demo.create`, `project.save`. Для встроенных команд `pluginId = "project"`.

### 4.8 `runtime.domain.command.CommandRegistry` (ядро)

Потокобезопасный реестр команд — `ConcurrentHashMap<String, Command>`, ключ — полный идентификатор.

| Операция | Назначение |
|---|---|
| `register(pluginId, command)` | Регистрация с ключом `<pluginId>.<name>` |
| `register(id, command)` | Регистрация с готовым ключом |
| `get(id)` | Получение команды |
| `all()` | Снимок `Map<String, Command>` |

При конфликте идентификатора регистрация завершается ошибкой.

### 4.9 `runtime.domain.command.CommandContext` (SDK)

Контекст выполнения команды. **Не содержит `Project`** — проект и его id скрыты от плагинов.

```kotlin
interface CommandContext {
    fun <T> getObject(entityType: EntityType, objectId: ObjectId): T?
    fun <T> objectList(entityType: EntityType): ObjectList<T>
    fun <T> withProjectLock(block: () -> T): T
}
```

| Метод | Назначение |
|---|---|
| `getObject(type, id)` | Получение объекта по типу и идентификатору |
| `objectList(type)` | Ссылка на `ObjectList` проекта (без копирования) |
| `withProjectLock {}` | Выполнение блока под блокировкой проекта |

### 4.10 `runtime.domain.command.ProjectBoundCommandContext` (ядро)

Расширение контекста для встроенных команд ядра, которым нужен доступ к проекту:

```kotlin
interface ProjectBoundCommandContext : CommandContext {
    val project: Project
}
```

`CommandContextImpl` реализует его. Встроенные команды получают проект через `(context as? ProjectBoundCommandContext)?.project` (`requireProject()` в `BuiltInProjectCommands`). Команды плагинов не могут привести контекст к этому типу — класс находится в ядре.

### 4.11 `runtime.domain.command.CommandResult` (SDK)

```kotlin
data class CommandResult(
    val status: Status,                    // SUCCESS / ERROR
    val value: Any? = null,                // основной результат
    val references: List<ObjectRef> = emptyList(),  // затронутые/созданные объекты
    val error: String? = null
) {
    enum class Status { SUCCESS, ERROR }
    companion object {
        fun success(value: Any? = null, references: List<ObjectRef> = emptyList()): CommandResult
        fun error(message: String): CommandResult
    }
}
```

`references` используется для аудита и replay.

### 4.12 `runtime.domain.project.ProjectId` (ядро)

UUID проекта (`value class`, `generate()`).

### 4.13 `runtime.domain.project.Project` (ядро)

Изолированное состояние рабочей области.

```kotlin
class Project(
    val id: ProjectId,
    private val objectLists: Map<EntityType, ObjectList<*>>
) {
    val auditLog: AuditLog
    fun <T> objectList(entityType: EntityType): ObjectList<T>?
    fun registeredEntityTypes(): Set<EntityType>
    fun <T> withLock(block: () -> T): T
}
```

`Project` владеет `ObjectList` для каждой зарегистрированной модели. Проект не знает конкретные Kotlin-классы моделей плагинов.

### 4.14 `runtime.domain.project.ProjectRegistry` (ядро)

Потокобезопасный реестр (`ConcurrentHashMap`) активных проектов: `register` (повторная регистрация — `IllegalArgumentException`), `get`, `list`, `remove`.

### 4.15 `runtime.domain.plugin.Plugin` (SDK)

```kotlin
abstract class Plugin {
    abstract val info: PluginInfo
    open fun initialize(context: PluginContext) {}
    open fun start() {}
    open fun stop() {}
}
```

Плагин регистрирует свои расширения в `initialize` через `PluginContext`. Менеджер плагина не хранит реестры самостоятельно.

### 4.16 `runtime.domain.plugin.PluginInfo` / `PluginId` / `PluginVersion` (SDK)

- `PluginInfo(id: PluginId, version: PluginVersion, apiVersion: Int)` — метаданные плагина;
- `PluginId` — `value class`, шаблон `[a-z][a-z0-9-]*`;
- `PluginVersion` — `value class`, семантическая версия (`^\d+(\.\d+)*$`).

`apiVersion` = мажорная версия `runtime-sdk`, против которой собран плагин.

### 4.17 `runtime.domain.plugin.PluginContext` (SDK)

```kotlin
interface PluginContext {
    fun registerEntity(definition: EntityDefinition)
    fun registerCommand(command: Command)
    fun registerUi(ui: UIDefinition)
}
```

Команда регистрируется в реестре ядра под ключом `<pluginId>.<name>`, где `pluginId` — id плагина, загружающего контекст (`PluginContextImpl`).

### 4.18 `runtime.domain.plugin.UIDefinition` (SDK)

```kotlin
interface UIDefinition {
    val componentType: String
    val config: Map<String, Any>
}
```

Декларативное описание UI (Page, Navigation, Table, Button, Form и т.д.).

### 4.19 `runtime.domain.audit.AuditEvent` / `AuditEventId` / `AuditLog` (ядро)

Упорядоченная последовательность событий операций.

```kotlin
data class AuditEvent(
    val eventId: AuditEventId,
    val timestamp: Instant,
    val commandId: String?,
    val arguments: Map<String, Any?>,
    val result: CommandResult?,
    val affectedObjects: List<ObjectRef>,
    val sessionId: String?
)
```

`AuditLog` — потокобезопасный список событий (`CopyOnWriteArrayList`), методы `append`, `all`, `clear`.

### 4.20 `runtime.domain.session.Session` / `SessionRegistry` (ядро)

- `Session(sessionId, webSocket, projectId?, project?)` — WebSocket-соединение, привязанное к одному проекту;
- `SessionRegistry` — потокобезопасные индексы `sessionId → Session` и `projectId → Set<sessionId>`; методы `register`, `get`, `remove`, `bindProject`, `getSessionsForProject`, `list`.

### 4.21 `runtime.domain.workspace.Workspace` (ядро)

Главный контекст запущенного Runtime.

```kotlin
class Workspace(
    val configuration: WorkspaceConfiguration,
    val commandRegistry: CommandRegistry,
    val entityRegistry: EntityRegistry,
    val projectRegistry: ProjectRegistry,
    val sessionRegistry: SessionRegistry
)
```

### 4.22 `runtime.domain.workspace.WorkspaceConfiguration` (ядро)

Агрегированная конфигурация UI, собранная после загрузки всех плагинов.

```kotlin
data class WorkspaceConfiguration(
    val navigation: List<NavigationEntry>,   // id, label, pageId
    val pages: List<PageDefinition>,          // id, title
    val components: List<ComponentDefinition>,// type, config
    val commands: List<CommandEntry>,         // id + description
    val entities: List<EntityEntry>           // type
)
```

`commands` формируется из ключей `CommandRegistry`, `entities` — из `EntityRegistry.list()`, остальное — из UI-определений плагинов (`WorkspaceBuilder` фильтрует `componentType == Navigation/Page`).

### 4.23 `runtime.application.project.ProjectSerializer` (ядро)

Сериализация состояния проекта в JSON (Jackson + Kotlin module) и обратно.

```kotlin
class ProjectSerializer(private val entityRegistry: EntityRegistry) {
    fun serialize(project: Project): String
    fun deserialize(projectId: ProjectId, data: String): Project
}
```

Формат:

```json
{
  "objects": {
    "demo.task": [
      { "id": "<uuid>", "value": { "title": "...", "status": "open" } }
    ]
  }
}
```

При десериализации класс каждой модели берётся из `EntityDefinition.modelClass`, UUID объектов сохраняются. Неизвестный тип создаёт пустой `SynchronizedObjectList` без модели.

### 4.24 `runtime.application.project.ProjectService` (ядро)

```kotlin
class ProjectService(projectRegistry, projectFactory, serializer) {
    fun createProject(id: ProjectId): Project
    fun getProject(id: ProjectId): Project?
    fun listProjects(): Set<ProjectId>
    fun removeProject(id: ProjectId): Project?
    fun saveProject(project: Project): String
    fun loadProject(id: ProjectId, data: String): Project
}
```

`saveProject`/`loadProject` — методы сохранения и загрузки проекта. Ядро сериализует состояние; **физическое хранение (файл/БД/remote) — ответственность плагина**. Сервис недоступен плагинам напрямую — только через команды `project.save` / `project.load`.

### 4.25 `runtime.application.project.ProjectFactory` (ядро)

Создаёт `Project` с `ObjectList` (`SynchronizedObjectList`) для каждой зарегистрированной модели.

### 4.26 `runtime.application.command.CommandExecutor` (ядро)

```kotlin
class CommandExecutor(commandRegistry, auditService) {
    suspend fun execute(project: Project, commandId: String, params: Any?, sessionId: String?): CommandResult
}
```

- находит команду по полному id;
- выполняет её на `Dispatchers.Default` (многопоточность);
- создаёт `CommandContextImpl(project)` (реализует `ProjectBoundCommandContext`);
- записывает событие в `AuditLog` проекта через `AuditService`.

### 4.27 `runtime.application.audit.AuditService` / `AuditReplayer` (ядро)

- `AuditService.record(project, commandId, arguments, result, sessionId)` — создаёт `AuditEvent` и добавляет в лог проекта;
- `AuditReplayer.replay(project, events)` — восстанавливает состояние из событий: по `references` делает create/update/delete (create с сохранением UUID); значение берётся из `result.value` (delete — когда `value == null`).

## 5. Многопоточность и блокировки

| Уровень | Механизм |
|---|---|
| `SynchronizedObjectList` | `ReentrantReadWriteLock` (чтения параллельны, записи сериализованы) |
| `Project` | `ReentrantLock` + `withLock {}` |
| `CommandContext` | `withProjectLock {}` — атомарная серия операций команды |
| `CommandExecutor` | выполнение на `Dispatchers.Default` |
| Реестры | `ConcurrentHashMap` / `CopyOnWriteArrayList` |

Команды получают `ObjectList` **по ссылке** и могут выполняться параллельно. Для атомарности многошаговых изменений используется `context.withProjectLock {}`.

## 6. Встроенные команды

Зарегистрированы под `PluginId("project")`:

| Command ID | Описание |
|---|---|
| `project.create` | Создание проекта (параметр `projectId` опционален) |
| `project.open` | Открытие существующего проекта по `projectId` |
| `project.list` | Список идентификаторов проектов |
| `project.save` | Сериализация текущего проекта в JSON, возвращает `{projectId, data}` |
| `project.load` | Восстановление проекта из `data` (JSON), возвращает `{projectId}` |

`project.create` и `project.open` на WebSocket обрабатываются слоем сессий (привязка сессии к проекту через `SessionRegistry.bindProject`), остальные команды выполняются `CommandExecutor` в контексте привязанного проекта. Команды `project.save`/`project.load` получают проект через `ProjectBoundCommandContext`.

## 7. Web-слой

### HTTP

| Endpoint | Назначение |
|---|---|
| `GET /` | Статический frontend из classpath (`staticResources("/", "static")`; в dev — `target/classes/static`, в JAR — внутри артефакта) |
| `GET /config` | `WorkspaceConfiguration` (JSON, Jackson + ContentNegotiation) |

### WebSocket `WS /ws`

Типы сообщений (`WsMessageType`): `command.execute`, `command.result`, `project.event`, `object.changed`, `error`.

Единый envelope — параметры всегда в `payload.params`:

```json
{
  "type": "command.execute",
  "requestId": "uuid",
  "payload": {
    "commandId": "demo.create",
    "params": { "title": "T1", "boardId": "..." }
  }
}
```

| Направление | Тип |
|---|---|
| Client → Server | `command.execute` |
| Server → Client | `command.result` |
| Server → Client | `error` |

Привязка сессии: сессия привязана ровно к одному проекту. `project.create` / `project.open` обрабатываются слоем сессий и **всегда перепривязывают** сессию (даже если она уже привязана к другому проекту); их параметры (`projectId`) читаются из `payload.params`. Команда на непривязанной сессии отклоняется с `type: "error"` (`Session not bound to a project...`).

Результат команды в `command.result`:

```json
{
  "type": "command.result",
  "requestId": "uuid",
  "payload": {
    "status": "SUCCESS",
    "value": { "title": "T1", "status": "open" },
    "references": [{ "entityType": "demo.task", "objectId": "..." }]
  }
}
```

- `status` — `SUCCESS` / `ERROR`; при `ERROR` присутствует `error` с сообщением.
- `value` — типизированное JSON-значение результата (модель, список, карта, число, строка или отсутствует).
- `references` — затронутые объекты (`entityType` + `objectId`).
- Ошибки транспорта/сессий (`Missing commandId`, `Session not bound...`, исключение при выполнении) приходят как `type: "error"` с `payload.message`.

`project.load` восстанавливает проект с тем же id (заменяет существующий) и перепривязывает сессию к загруженному состоянию.

Кодирование `WsProtocol` выполняет Jackson (полный JSON-эскейпинг), декодирование возвращает `Map<String, Any?>` с числами/булевыми/вложенными структурами.

## 8. Загрузка плагинов

1. Загрузка `RuntimeConfig` (`ConfigLoader` читает `config/application.yaml`: `server.host`, `server.port`, `plugins.directories`; при отсутствии файла — значения по умолчанию).
2. Discovery директорий, поиск `config.yaml`.
3. Загрузка `PluginDescriptor` (id, version, apiVersion, main, dependencies, jarPath — `<id>.jar` или единственный JAR в директории).
4. Разрешение зависимостей (`DependencyResolver`, топологическая сортировка, детект циклов).
5. Для каждого плагина: `PluginClassLoader` (parent-first), `Class.forName(mainClass)`.
6. `plugin.initialize(PluginContextImpl(pluginId, ...))` — плагин регистрирует entities/commands/ui.
7. `plugin.start()`.
8. Сборка `WorkspaceConfiguration` (`WorkspaceBuilder`).
9. Запуск HTTP/WebSocket (`WebServer`).

Весь процесс выполняет `WorkspaceBuilder.build()` в `Main.kt`.

## 9. Сохранение и загрузка проекта

```
сохранение:
Project → ProjectSerializer.serialize → JSON (String) → persistence-плагин (файл/БД/remote)

загрузка:
persistence-плагин → JSON (String) → ProjectSerializer.deserialize → Project → ProjectRegistry
```

Ядро отвечает за формат и преобразование, плагин — за хранилище. `project.save` / `project.load` доступны как WebSocket-команды; методы `ProjectService` используются ядром (сессии, встроенные команды) и не публикуются в SDK.

## 10. Жизненный цикл

| Фаза | Результат |
|---|---|
| Startup | JVM запущена |
| Configuration | Runtime config загружен |
| Discovery / Loading | Плагины найдены и загружены |
| Registration | entities/commands/ui зарегистрированы |
| Initialization / Start | Плагины инициализированы и запущены |
| Workspace Ready | Workspace сформирован |
| Web Ready | HTTP/WS доступны |
| Running | Система принимает запросы |
| Shutdown | Остановка сервера |

## 11. Ключевые инварианты

1. Runtime не знает конкретные модели плагинов.
2. Плагин загружается из внешнего JAR и компилируется только против `runtime-sdk`.
3. Workspace — контекст запущенного ядра; Project — владелец состояния.
4. `ObjectList` — контракт SDK, `SynchronizedObjectList` — реализация ядра; экземпляры адресуются через `ObjectId`.
5. **В ядре нет связей между сущностями** — связи описываются моделями плагинов.
6. Команда — `Command` с методом `execute`; реестр — `Map<String, Command>`.
7. Регистрация расширений плагина — через `PluginContext`.
8. Команды получают `ObjectList` по ссылке; параллелизм и блокировки предусмотрены ядром.
9. Команды не вызывают другие команды.
10. Audit — упорядоченная история операций; replay не перевыполняет команды.
11. Ядро сериализует состояние проекта (Jackson), хранение — задача плагина.
12. UI описывается декларативно; frontend не знает конкретных плагинов.
13. `/config` — агрегированная конфигурация; `/ws` привязан к одному Project на сессию.
14. `CommandContext` плагина не раскрывает `Project`; доступ к нему — только у встроенных команд через `ProjectBoundCommandContext`.
15. Плагины — доверенный код; hot reload не поддерживается.
