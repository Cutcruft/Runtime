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
4. **UI декларативен** — Frontend строит интерфейс из `UIDefinition`.
