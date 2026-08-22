# CutCruft Runtime

JVM-платформа для приложений, расширяемых плагинами и модулями. Ядро — только data-слой (HTTP/WebSocket, реестры, конфиги, тема). UI полностью вынесен в модули, логика — в плагины. Связь UI и команд — декларативно через `ui.yaml`.

## Архитектура (V11)

```
demo/config/
  application.yaml   ← сервер, хранилище, плагины
  ui.yaml            ← ВСЁ интерфейсы: страницы, навигация, тема, оверлеи, шорткаты

runtime/             ← Ядро (data-only): Ktor HTTP+WS, реестры, сессии, аудит, тема
  frontend/          ← Preact data-слой (main.tsx, store/, renderer/, events/)
sdk/                 ← Публичные контракты: Plugin/Module API (backend + frontend)
  frontend/          ← pluginSdk.js — Container host, stores, registries, CSS
modules/             ← UI-модули (примитивы + редакторы)
  ui-base/           ← AppShell, Button, Table, Form, Input, Tabs, ...
  ui-layout/         ← Grid, Stack, Card, Section, Group, Spacer
  editor-richtext/   ← tiptap-редактор
  editor-canvas/     ← antv/x6-редактор
  editor-diagram/    ← antv/x6-диаграмма
  editor-scene3d/    ← three.js-редактор
plugins/             ← Шаблонные плагины
demo/                ← Демо-конфиг + плагины (только команды, без UI)
tmp/                 ← Билд-артефакты (tmp/plugins/, .gitignore)
```

### Ключевые принципы

- **Ядро не знает о UI**: `runtime/frontend/` — только data (store, renderer, protocol, events). Без React-компонентов, без tiptap/antv/three.
- **Модули несут примитивы**: каждый модуль регистрирует `registerPrimitive` в `ModuleContext`, frontend-бандлы подгружаются динамически.
- **Плагины несут логику**: `registerCommand`, `registerEntity` — без UI.
- **ui.yaml — единственный источник интерфейса**: страницы, навигация, тема, оверлеи, шорткаты, подписки.
- **Полная изоляция воркспейсов**: каждый воркспейс имеет свой `EntityStore`, `ProjectLocks`, `dispatcher`.

## Быстрый старт

Требования: JDK 17, Maven 3.9+, Node.js 18+.

```bash
make build   # frontend + SDK + модули + демо-плагины + JAR ядра
make dev     # собрать и запустить Runtime на http://0.0.0.0:8080
```

### Конфигурация

| Файл | Назначение |
|---|---|
| `demo/config/application.yaml` | Сервер (host/port), хранилище (backend), плагины (directories) |
| `demo/config/ui.yaml` | Интерфейс: app, theme, pages, navigation, overlays, shortcuts, subscriptions |
| `demo/demo-plugin/config.yaml` | Конфиг демо-плагина (commandRegistry, entityRegistry, wsHandlers) |

### Цели Makefile

| Цель | Что делает |
|---|---|
| `make sdk` | Устанавливает `runtime-sdk` в локальный `~/.m2` |
| `make frontend` | Собирает runtime/frontend + sdk/frontend (pluginSdk.js + pluginSdk.css) |
| `make modules` | Собирает модули (`ui-base`, `ui-layout`, `editor-*`) в `tmp/plugins/` |
| `make plugin` | Собирает демо-плагины в `tmp/plugins/` |
| `make plugins` | SDK + модули + демо-плагины |
| `make build` | Frontend + plugins + JAR ядра |
| `make dev` | Сборка и запуск |
| `make clean` | Очистка артефактов |

## Фронтенд-архитектура

```
runtime/frontend/              ← Data-слой ядра (без UI-компонентов)
  main.tsx                     ← Mount: resolveComponent('App'), store, renderer
  store/                       ← configStore, theme, projectStore, entityStore
  renderer/componentRegistry   ← registerComponent / resolveComponent
  events/                      ← eventBus, ShortcutService
  protocol/                    ← WS-протокол, types
  plugin/pluginLoader          ← Динамическая загрузка бандлов из /config.pluginComponents[]

sdk/frontend/                  ← Публичный TS API для плагинов/модулей
  index.ts                     ← Container, stores, registries, services, types
  primitives/Container.tsx     ← Рекурсивный рендер config.children
  vite.config.ts               ← Сборка: pluginSdk.js + pluginSdk.css (single-file ESM)

modules/*/frontend/            ← UI-бандлы модулей (каждый со своим vite.config)
  ui-base/frontend/            ← App.tsx + Ui* компоненты (button.js, table.js, ...)
  ui-layout/frontend/          ← Grid, Stack, Card, Section, Group, Spacer
```

### Поток данных

1. `main.tsx` монтирует `resolveComponent('App')` — AppShell из ui-base
2. `pluginLoader` загружает бандлы модулей (App, Ui*, редакторы) из `/plugin-assets/`
3. Каждый бандл вызывает `registerPrimitive(name, component, { cssPath })` в `ModuleContext`
4. `configStore` загружает конфиг с `/config` (включая ui.yaml → pages, navigation, theme)
5. `renderer` рекурсивно рендерит дерево компонентов из конфига
6. `Container` (sdk) рекурсивно рендерит `config.children`

### importmap

```json
{
  "imports": {
    "@cutcrft/plugin-sdk": "/pluginSdk.js",
    "@cutcrft/runtime-client": "/pluginSdk.js",
    "preact": "/vendor/preact.module.js",
    "preact/hooks": "/vendor/preact-hooks.module.js"
  }
}
```

## WS-протокол

WebSocket `/ws`; параметры всегда в `payload.params`.

```json
{
  "type": "command.execute",
  "requestId": "uuid",
  "payload": {
    "commandId": "demo.create",
    "params": { "title": "T1" }
  }
}
```

- `project.create` / `project.open` привязывают сессию к проекту.
- Результат: `command.result` со `status`, JSON-`value` и `references`.
- Модули расширяют протокол: неизвестные типы маршрутизируются в `WsMessageHandler` модуля.

## Тестирование

```bash
mvn test     # 218 юнит-тестов ядра (sdk 28 + runtime 190)
```

## Лицензия

Проект распространяется под [GNU AGPL v3](LICENSE). Плагины, загружаемые в Runtime, считаются доверенным кодом и под лицензию проекта не подпадают.
