# CutCruft Runtime

JVM-платформа для приложений, расширяемых плагинами и модулями: ядро управляет проектами, командами и сущностями, а плагины/модули добавляют предметные модели, команды и UI.

## Структура репозитория

| Каталог | Содержимое |
|---|---|
| `runtime/` | Ядро: Ktor-сервер (HTTP + WebSocket), реестры команд/сущностей, сессии, аудит, хранение проектов. Плюс `runtime/frontend/` — Preact-фронтенд ядра (data-слой + сборка дерева UI). |
| `sdk/` | Публичные контракты Plugin/Module API (артефакт `io.runtime:runtime-sdk`), против которых компилируются плагины и модули. Плюс `sdk/frontend/` — runtime-client SDK для фронтенд-бандлов. |
| `modules/` | Базовый набор модулей: `ui-base` (примитивы Button/Table/Form/...), редакторы (`editor-canvas`, `editor-diagram`, `editor-richtext`, `editor-scene3d`). |
| `plugins/` | Шаблонные плагины, полезные в любом приложении. |
| `demo/` | Набор конфигов и плагинов для демо-приложения: `demo/config/application.yaml`, `demo/demo-plugin`, `demo/demo-storage-plugin`, `demo/plugins/yaml-demo`, `demo/workspaces/`. |
| `tmp/` | Всё билд-временное: собранные плагины (`tmp/plugins/`), данные (`tmp/data/`). В `.gitignore`. |

## Быстрый старт

Требования: JDK 17, Maven 3.9+, Node.js 18+.

```bash
make build   # frontend + SDK + модули + демо-плагины + JAR ядра
make dev     # собрать и запустить Runtime на http://0.0.0.0:8080
```

Конфигурация — `demo/config/application.yaml` (`server.host`, `server.port`, `plugins.directories`, `ui.theme`).

### Цели Makefile

| Цель | Что делает |
|---|---|
| `make sdk` | Устанавливает `runtime-sdk` в локальный `~/.m2` |
| `make frontend` | Собирает фронтенд ядра (`npm install && npm run build`) |
| `make modules` | Собирает базовые модули (`modules/*`) и кладёт JAR в `tmp/plugins/` |
| `make plugin` | Собирает демо-плагины (`demo/demo-plugin`, `demo/demo-storage-plugin`) в `tmp/plugins/` |
| `make plugins` | SDK + модули + демо-плагины |
| `make backend` | Пакетирует JAR ядра |
| `make build` | Frontend + SDK + модули + плагины + JAR ядра |
| `make dev` | Сборка и запуск (`mvn exec:java`) |
| `make clean` | Очистка артефактов |

## Проверка

```bash
mvn test     # юнит-тесты ядра
```

## WS-протокол (кратко)

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

- `project.create` / `project.open` привязывают сессию к проекту (перепривязка в любой момент), `projectId` — в `params`.
- Результат: `command.result` со `status`, типизированным JSON-`value` и `references` затронутых объектов.
- Транспортные ошибки (непривязанная сессия, неизвестный тип) — `error` с `payload.message`.
- Модули могут расширять протокол: неизвестные типы маршрутизируются в зарегистрированные `WsMessageHandler` модуля (ответ — `<type>.response`).

## Лицензия

Проект распространяется под [GNU AGPL v3](LICENSE). Плагины, загружаемые в Runtime, считаются доверенным кодом и под лицензию проекта не подпадают.
