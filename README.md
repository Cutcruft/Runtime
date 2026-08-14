# CutCruft Runtime

JVM-платформа для приложений, расширяемых плагинами: ядро управляет проектами, командами и сущностями, а плагины добавляют предметные модели, команды и UI.

- **Ядро** (`runtime/`) — Ktor-сервер (HTTP + WebSocket), реестры команд/сущностей, сессии, аудит, хранение проектов.
- **SDK** (`sdk/`, артефакт `io.runtime:runtime-sdk`) — публичные контракты Plugin API, против которых компилируются плагины.
- **Плагины** — внешние JAR, загружаемые динамически (parent-first `PluginClassLoader`, изоляция между плагинами).
- **Frontend** (`frontend/`) — Vue 3 + Vite, собирается в статику и попадает в JAR ядра.

## Быстрый старт

Требования: JDK 17, Maven 3.9+, Node.js 18+.

```bash
make build   # frontend + SDK + демо-плагины + JAR ядра
make dev     # собрать и запустить Runtime на http://0.0.0.0:8080
```

Конфигурация — `config/application.yaml` (`server.host`, `server.port`, `plugins.directories`).

### Цели Makefile

| Цель | Что делает |
|---|---|
| `make sdk` | Устанавливает `runtime-sdk` в локальный `~/.m2` |
| `make frontend` | Собирает Vue-фронтенд (`npm install && npm run build`) |
| `make plugin` | Собирает оба демо-плагина в `plugins/demo/` и `plugins/demo-storage/` |
| `make backend` | Пакетирует JAR ядра |
| `make build` | Frontend + SDK + плагины + JAR ядра |
| `make dev` | Сборка и запуск (`mvn exec:java`) |
| `make clean` | Очистка артефактов |

## Проверка

```bash
mvn test     # юнит-тесты ядра (текущее: 34)
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

## Документация

Подробные материалы — в [`docs/`](docs/README.md): архитектура, устройство ядра, Plugin API, эталон демо-плагинов.

## Лицензия

Проект распространяется под [GNU AGPL v3](LICENSE). Плагины, загружаемые в Runtime, считаются доверенным кодом и под лицензию проекта не подпадают.
