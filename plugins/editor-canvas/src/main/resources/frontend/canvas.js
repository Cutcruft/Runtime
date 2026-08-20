var Qt = Object.defineProperty;
var Zt = (e, t, n) => t in e ? Qt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var U = (e, t, n) => Zt(e, typeof t != "symbol" ? t + "" : t, n);
import { jsxs as ze, jsx as te } from "preact/jsx-runtime";
import { signal as P, computed as ae, effect as en, useSignal as X } from "@preact/signals";
import { useEffect as le, useRef as ft } from "preact/hooks";
const E = {
  COMMAND_EXECUTE: "command.execute",
  COMMAND_RESULT: "command.result",
  PROJECT_EVENT: "project.event",
  PROJECT_BOUND: "project.bound",
  OBJECT_CHANGED: "object.changed",
  ERROR: "error",
  SUBSCRIBE: "subscribe",
  UNSUBSCRIBE: "unsubscribe",
  COMMANDS_RELOADED: "commands.reloaded",
  PRESENCE_JOIN: "presence.join",
  PRESENCE_LEAVE: "presence.leave",
  PRESENCE_LIST: "presence.list",
  CLIENT_IDENTITY: "client.identity",
  CURSOR_UPDATE: "cursor.update"
};
function tn(e) {
  const t = JSON.parse(e);
  return {
    type: t.type ?? "unknown",
    requestId: t.requestId,
    payload: t.payload ?? {}
  };
}
function vt(e) {
  return JSON.stringify({
    type: e.type,
    ...e.requestId ? { requestId: e.requestId } : {},
    payload: e.payload
  });
}
const nn = 2e4, on = 1e3, an = 1e4;
class rn {
  constructor(t, n = {}) {
    U(this, "socket", null);
    U(this, "pending", /* @__PURE__ */ new Map());
    U(this, "reconnectAttempt", 0);
    U(this, "reconnectTimer", null);
    U(this, "closed", !1);
    U(this, "url");
    U(this, "status", "disconnected");
    U(this, "onStatusChange", null);
    U(this, "onEvent", null);
    this.url = sn(t, n);
  }
  connect() {
    this.closed = !1, this.setStatus("connecting");
    try {
      const t = new WebSocket(this.url);
      this.socket = t, t.onopen = () => this.handleOpen(), t.onmessage = (n) => this.handleMessage(n.data), t.onerror = () => {
      }, t.onclose = () => this.handleClose();
    } catch {
      this.handleClose();
    }
  }
  close() {
    var t;
    this.closed = !0, this.clearReconnectTimer(), (t = this.socket) == null || t.close(), this.socket = null, this.rejectAll("Connection closed"), this.setStatus("disconnected");
  }
  getStatus() {
    return this.status;
  }
  execute(t, n, r = nn) {
    return new Promise((c, h) => {
      if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
        h("Not connected");
        return;
      }
      const I = ln(), R = window.setTimeout(() => {
        this.pending.delete(I), h(`Command '${t}' timed out`);
      }, r);
      this.pending.set(I, { resolve: c, reject: h, timer: R }), this.socket.send(
        vt({
          type: E.COMMAND_EXECUTE,
          requestId: I,
          payload: { commandId: t, params: n }
        })
      );
    });
  }
  /** Subscribes to object.changed for an entity type with an optional server-side filter. */
  subscribe(t, n) {
    this.sendRaw(E.SUBSCRIBE, { entityType: t, ...n ? { filter: n } : {} });
  }
  /** Unsubscribes from object.changed for an entity type (optionally matching a filter). */
  unsubscribe(t, n) {
    this.sendRaw(E.UNSUBSCRIBE, { entityType: t, ...n ? { filter: n } : {} });
  }
  sendRaw(t, n) {
    !this.socket || this.socket.readyState !== WebSocket.OPEN || this.socket.send(vt({ type: t, payload: n }));
  }
  handleOpen() {
    this.reconnectAttempt = 0, this.setStatus("connected");
  }
  handleMessage(t) {
    var r;
    let n;
    try {
      n = tn(String(t));
    } catch {
      return;
    }
    if (n.type === E.COMMAND_RESULT) {
      this.resolvePending(n.requestId, n.payload);
      return;
    }
    n.type === E.ERROR && (this.rejectPending(n.requestId, n.payload.message ?? "Unknown error"), n.requestId) || (r = this.onEvent) == null || r.call(this, n);
  }
  handleClose() {
    this.socket = null, this.rejectAll("Connection lost"), this.setStatus("disconnected"), !this.closed && this.scheduleReconnect();
  }
  scheduleReconnect() {
    this.clearReconnectTimer();
    const t = Math.min(on * 2 ** this.reconnectAttempt, an);
    this.reconnectAttempt += 1, this.reconnectTimer = window.setTimeout(() => this.connect(), t);
  }
  clearReconnectTimer() {
    this.reconnectTimer !== null && (window.clearTimeout(this.reconnectTimer), this.reconnectTimer = null);
  }
  resolvePending(t, n) {
    if (!t) return;
    const r = this.pending.get(t);
    r && (this.pending.delete(t), window.clearTimeout(r.timer), r.resolve(n));
  }
  rejectPending(t, n) {
    if (!t) return;
    const r = this.pending.get(t);
    r && (this.pending.delete(t), window.clearTimeout(r.timer), r.reject(n));
  }
  rejectAll(t) {
    this.pending.forEach((n) => {
      window.clearTimeout(n.timer), n.reject(t);
    }), this.pending.clear();
  }
  setStatus(t) {
    var n;
    this.status = t, (n = this.onStatusChange) == null || n.call(this, t);
  }
}
function sn(e, t) {
  const n = window.location.protocol === "https:" ? "wss:" : "ws:";
  let r = e;
  return t.workspaceId && (r = `${r.replace(/\/$/, "")}/${encodeURIComponent(t.workspaceId)}`), t.workspaceId && t.projectId && (r = `${r}/${encodeURIComponent(t.projectId)}`), `${n}//${window.location.host}${r}`;
}
function ln() {
  const e = new Uint8Array(16);
  if (typeof crypto < "u" && typeof crypto.getRandomValues == "function")
    crypto.getRandomValues(e);
  else
    for (let n = 0; n < e.length; n++)
      e[n] = Math.floor(Math.random() * 256);
  e[6] = e[6] & 15 | 64, e[8] = e[8] & 63 | 128;
  const t = Array.from(e, (n) => n.toString(16).padStart(2, "0"));
  return [
    t.slice(0, 4).join(""),
    t.slice(4, 6).join(""),
    t.slice(6, 8).join(""),
    t.slice(8, 10).join(""),
    t.slice(10, 16).join("")
  ].join("-");
}
function j(e, t) {
  const n = globalThis;
  return n[e] || (n[e] = t()), n[e];
}
const { handlers: Xe } = j("__cc_evbus", () => ({
  handlers: /* @__PURE__ */ new Set()
}));
function cn(e) {
  return Xe.add(e), () => Xe.delete(e);
}
function Q(e) {
  Xe.forEach((t) => t(e));
}
const { config: Me, pollState: Hn } = j("__cc_cfg", () => ({
  config: P(null),
  pollState: {
    pollTimer: null,
    lastConfigJson: "",
    loadedSections: /* @__PURE__ */ new Set()
  }
})), ge = {
  get app() {
    var e;
    return (e = Me.value) == null ? void 0 : e.app;
  },
  get pages() {
    var e;
    return ((e = Me.value) == null ? void 0 : e.pages) ?? [];
  },
  get transport() {
    var e;
    return (e = Me.value) == null ? void 0 : e.transport;
  },
  get collaboration() {
    var e;
    return ((e = Me.value) == null ? void 0 : e.collaboration) ?? { enabled: !1, cursorsEnabled: !1 };
  }
}, un = 4e3, { list: F, toastState: dn } = j("__cc_toast", () => ({
  list: P([]),
  toastState: { nextId: 1 }
})), J = {
  get list() {
    return F.value;
  },
  push(e) {
    const t = dn.nextId++;
    F.value = [...F.value, { id: t, message: e.message, kind: e.kind ?? "info" }], window.setTimeout(() => {
      F.value = F.value.filter((n) => n.id !== t);
    }, un);
  },
  remove(e) {
    F.value = F.value.filter((t) => t.id !== e);
  }
}, B = j("__cc_data", () => P(/* @__PURE__ */ new Map()));
function ne(e, t) {
  const n = B.value, r = n.get(e) ?? { revision: 0, rows: [], loading: !1, error: null };
  t(r);
  const c = new Map(n);
  c.set(e, r), B.value = c;
}
const Z = {
  get caches() {
    return B.value;
  },
  invalidate(e) {
    ne(e, (t) => {
      t.revision += 1;
    });
  },
  revision(e) {
    var t;
    return ((t = B.value.get(e)) == null ? void 0 : t.revision) ?? 0;
  },
  rows(e) {
    var t;
    return ((t = B.value.get(e)) == null ? void 0 : t.rows) ?? [];
  },
  loading(e) {
    var t;
    return ((t = B.value.get(e)) == null ? void 0 : t.loading) ?? !1;
  },
  error(e) {
    var t;
    return ((t = B.value.get(e)) == null ? void 0 : t.error) ?? null;
  },
  async loadList(e, t, n) {
    ne(e, (r) => {
      r.loading = !0, r.error = null;
    }), H.subscribe(e);
    try {
      const r = await H.execute(t, n ?? {});
      r.status === "ERROR" ? ne(e, (c) => {
        c.error = r.error ?? "Command failed", c.rows = [];
      }) : ne(e, (c) => {
        c.rows = Array.isArray(r.value) ? r.value : [];
      });
    } catch (r) {
      ne(e, (c) => {
        c.error = String(r), c.rows = [];
      });
    } finally {
      ne(e, (r) => {
        r.loading = !1;
      });
    }
  },
  clearAll() {
    B.value = /* @__PURE__ */ new Map();
  },
  refreshAll() {
    const e = new Map(B.value);
    for (const [t, n] of e)
      e.set(t, { ...n, revision: n.revision + 1 });
    B.value = e;
  },
  reportCommandError(e, t) {
    J.push({ message: `Command '${e}' failed: ${String(t)}`, kind: "error" });
  }
};
function fn() {
  const e = j("__cc_layer", () => P(/* @__PURE__ */ new Map()));
  function t(g, m, A) {
    const f = new Map(e.value);
    let i = f.get(g);
    i ? (i = new Map(i), f.set(g, i)) : (i = /* @__PURE__ */ new Map(), f.set(g, i)), i.set(m, A), e.value = f;
  }
  function n(g, m) {
    const A = r(g, m, !0);
    return t(g, m, !A), !A;
  }
  function r(g, m, A) {
    var f;
    return ((f = e.value.get(g)) == null ? void 0 : f.get(m)) ?? A;
  }
  function c(g, m) {
    return r(g, m.id, m.visible ?? !0);
  }
  function h(g, m) {
    return m.filter((A) => c(g, A)).sort((A, f) => A.order - f.order);
  }
  function I(g) {
    return Array.isArray(g.layers) && g.layers.length > 0;
  }
  function R(g) {
    t(g.pageId, g.layerId, g.visible);
  }
  return {
    overrides: e,
    setVisible: t,
    toggle: n,
    isVisible: r,
    isLayerVisible: c,
    getVisibleLayers: h,
    hasLayers: I,
    handleLayerEvent: R
  };
}
const vn = fn(), T = j("__cc_presence", () => P({
  participants: [],
  localSessionId: null
})), re = {
  get participants() {
    return T.value.participants;
  },
  get count() {
    return T.value.participants.length;
  },
  get localSessionId() {
    return T.value.localSessionId;
  },
  get localParticipant() {
    return T.value.participants.find((e) => e.sessionId === T.value.localSessionId);
  },
  setLocalSessionId(e) {
    T.value = { ...T.value, localSessionId: e };
  },
  updateParticipants(e) {
    T.value = { ...T.value, participants: e };
  },
  addParticipant(e) {
    T.value.participants.find((t) => t.sessionId === e.sessionId) || (T.value = { ...T.value, participants: [...T.value.participants, e] });
  },
  removeParticipant(e) {
    T.value = { ...T.value, participants: T.value.participants.filter((t) => t.sessionId !== e) };
  },
  clear() {
    T.value = { participants: [], localSessionId: null };
  }
}, { state: $, listeners: Ge } = j("__cc_cursor", () => ({
  state: P({ cursors: /* @__PURE__ */ new Map() }),
  listeners: /* @__PURE__ */ new Set()
})), pn = 1e4;
function he() {
  for (const e of Ge) e();
}
const pt = {
  get all() {
    return Array.from($.value.cursors.values());
  },
  getCursorsForObject(e, t) {
    return this.all.filter((n) => n.entityType === e && n.objectId === t);
  },
  getCursorsBySession(e) {
    return this.all.filter((t) => t.sessionId === e);
  },
  updateCursor(e) {
    const t = new Map($.value.cursors);
    t.set(e.sessionId, { ...e, lastSeen: Date.now() }), $.value = { cursors: t }, he();
  },
  removeCursor(e) {
    const t = new Map($.value.cursors);
    t.delete(e), $.value = { cursors: t }, he();
  },
  removeObjectCursors(e, t) {
    const n = new Map($.value.cursors);
    for (const [r, c] of n)
      c.entityType === e && c.objectId === t && n.delete(r);
    $.value = { cursors: n }, he();
  },
  purgeStale() {
    const e = Date.now(), t = new Map($.value.cursors);
    for (const [n, r] of t)
      e - r.lastSeen > pn && t.delete(n);
    $.value = { cursors: t }, he();
  },
  clear() {
    $.value = { cursors: /* @__PURE__ */ new Map() }, he();
  },
  subscribe(e) {
    return Ge.add(e), () => {
      Ge.delete(e);
    };
  }
}, He = "cc.projectId", Fe = "cc.workspaceId", { wsStatus: Je, projectId: se, workspaceId: Ke, sessionState: k } = j("__cc_sess", () => ({
  wsStatus: P("disconnected"),
  projectId: P(null),
  workspaceId: P(null),
  sessionState: { client: null, reconnectProjectId: null }
}));
function Oe(e) {
  try {
    e ? localStorage.setItem(He, e) : localStorage.removeItem(He);
  } catch {
  }
}
function ht() {
  try {
    return localStorage.getItem(He);
  } catch {
    return null;
  }
}
function hn(e) {
  try {
    e ? localStorage.setItem(Fe, e) : localStorage.removeItem(Fe);
  } catch {
  }
}
function yn() {
  try {
    return localStorage.getItem(Fe);
  } catch {
    return null;
  }
}
const H = {
  get wsStatus() {
    return Je.value;
  },
  get projectId() {
    return se.value;
  },
  get workspaceId() {
    return Ke.value;
  },
  get isConnected() {
    return Je.value === "connected";
  },
  get localParticipant() {
    return re.localParticipant;
  },
  init() {
    var r;
    const e = ((r = ge.transport) == null ? void 0 : r.wsPath) ?? "/ws", n = yn() ?? wn();
    n && (Ke.value = n), k.client = new rn(e, {
      workspaceId: n ?? void 0,
      projectId: se.value ?? ht() ?? void 0
    }), k.client.onStatusChange = (c) => {
      if (Je.value = c, c === "connected") {
        je();
        const h = k.reconnectProjectId ?? ht();
        h && Sn(h);
      } else c === "disconnected" && re.clear();
    }, k.client.onEvent = (c) => xn(c), k.client.connect();
  },
  setWorkspace(e) {
    var t;
    Ke.value = e, hn(e), (t = k.client) == null || t.close(), this.init();
  },
  execute(e, t) {
    return k.client ? k.client.execute(e, t) : Promise.reject(new Error("Session not initialized"));
  },
  sendRaw(e, t) {
    k.client && k.client.sendRaw(e, t);
  },
  subscribe(e, t) {
    var n;
    (n = k.client) == null || n.subscribe(e, t);
  },
  unsubscribe(e, t) {
    var n;
    (n = k.client) == null || n.unsubscribe(e, t);
  },
  async createProject() {
    const e = await Ve("project.create", null), t = yt(e);
    return se.value = t, k.reconnectProjectId = t, Oe(t), Z.refreshAll(), je(), t;
  },
  async openProject(e) {
    const t = await Ve("project.open", { projectId: e }), n = yt(t);
    return se.value = n, k.reconnectProjectId = n, Oe(n), Z.refreshAll(), je(), n;
  },
  async executeCommand(e, t) {
    const n = await Ve(e, t);
    return n.status === "ERROR" && Z.reportCommandError(e, n.error ?? "Command failed"), n;
  }
};
function je() {
  var e;
  !((e = ge.collaboration) != null && e.enabled) || !k.client || k.client.sendRaw(E.CLIENT_IDENTITY, {
    name: gn(),
    color: mn()
  });
}
function gn() {
  const e = ["Swift", "Calm", "Bright", "Bold", "Kind"], t = ["Fox", "Owl", "Bear", "Wolf", "Hawk"], n = e[Math.floor(Math.random() * e.length)], r = t[Math.floor(Math.random() * t.length)];
  return `${n} ${r}`;
}
function mn() {
  return `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`;
}
async function Ve(e, t) {
  if (!k.client) throw new Error("Session not initialized");
  const n = await k.client.execute(e, t);
  if (n.status === "ERROR")
    throw new Error(n.error ?? `Command '${e}' failed`);
  return n;
}
function yt(e) {
  const t = e.value;
  if (t && typeof t.projectId == "string") return t.projectId;
  throw new Error("Command result did not contain projectId");
}
function wn() {
  const e = window.location.pathname.match(/^\/ws\/([^/]+)/);
  return (e == null ? void 0 : e[1]) ?? null;
}
function xn(e) {
  var t;
  switch (e.type) {
    case E.PROJECT_BOUND: {
      const n = e.payload.projectId;
      typeof n == "string" && (se.value = n, k.reconnectProjectId = n, Oe(n), Z.refreshAll(), je()), Q({ kind: E.PROJECT_BOUND, payload: e.payload });
      break;
    }
    case E.PROJECT_EVENT: {
      const n = e.payload, r = n.projectId;
      typeof r == "string" && (se.value = r), n.type === "layer.visibility" && vn.handleLayerEvent({
        pageId: n.pageId,
        layerId: n.layerId,
        visible: n.visible
      }), Q({ kind: E.PROJECT_EVENT, payload: n });
      break;
    }
    case E.OBJECT_CHANGED: {
      const n = e.payload.entityType;
      typeof n == "string" && Z.invalidate(n), Q({ kind: E.OBJECT_CHANGED, payload: e.payload });
      break;
    }
    case E.PRESENCE_LIST: {
      const n = e.payload.participants;
      Array.isArray(n) && re.updateParticipants(n);
      break;
    }
    case E.PRESENCE_JOIN: {
      const n = e.payload;
      n != null && n.sessionId && re.addParticipant(n);
      break;
    }
    case E.PRESENCE_LEAVE: {
      const n = e.payload.sessionId;
      n && (re.removeParticipant(n), pt.removeCursor(n));
      break;
    }
    case E.CURSOR_UPDATE: {
      const n = e.payload, r = n.sessionId;
      if (r && ((t = ge.collaboration) != null && t.cursorsEnabled)) {
        const c = re.participants.find((h) => h.sessionId === r);
        pt.updateCursor({
          sessionId: r,
          name: n.name ?? (c == null ? void 0 : c.name) ?? "Anonymous",
          color: n.color ?? (c == null ? void 0 : c.color) ?? "#999",
          entityType: n.entityType,
          objectId: n.objectId,
          position: n.position,
          selection: n.selection
        });
      }
      break;
    }
    case E.ERROR: {
      const n = e.payload.message ?? "Unknown error";
      J.push({ message: n, kind: "error" }), Q({ kind: E.ERROR, payload: e.payload });
      break;
    }
    case E.COMMANDS_RELOADED: {
      J.push({ message: "Plugin configuration reloaded", kind: "info" }), Z.refreshAll(), Q({ kind: E.COMMANDS_RELOADED, payload: e.payload });
      break;
    }
    default:
      Q({ kind: e.type, payload: e.payload });
  }
}
function Sn(e) {
  H.openProject(e).catch(() => {
    console.warn(`[Session] project.open failed for ${e}, creating new project`), Oe(null), k.reconnectProjectId = null, H.createProject().catch((t) => {
      console.error("[Session] auto-create after failed open also failed:", t);
    });
  });
}
const mt = "rt.locale", bn = /\{\{\s*([^{}\s]+)\s*\}\}/g;
function En(e) {
  var r;
  if (!e) return "en";
  const t = localStorage.getItem(mt);
  if (t && e.locales.includes(t)) return t;
  const n = (r = navigator.language) == null ? void 0 : r.split("-")[0];
  return n && e.locales.includes(n) ? n : e.defaultLocale;
}
const b = j("__cc_i18n", () => P({
  config: null,
  locale: "en"
}));
function wt(e, t) {
  return t ? e.replace(/\{(\w+)\}/g, (n, r) => {
    const c = t[r];
    return c == null ? n : String(c);
  }) : e;
}
function kn(e, t) {
  const n = typeof (t == null ? void 0 : t.count) == "number" ? t.count : void 0;
  if (n !== void 0) {
    const r = n === 1 ? `${e}_one` : `${e}_many`;
    if (In(r)) return r;
  }
  return e;
}
function In(e) {
  var n, r;
  const t = ((n = b.value.config) == null ? void 0 : n.messages[b.value.locale]) ?? ((r = b.value.config) == null ? void 0 : r.messages[b.value.config.defaultLocale]);
  return t != null && e in t;
}
function xt(e, t) {
  var c, h;
  const n = ((c = b.value.config) == null ? void 0 : c.messages[b.value.locale]) ?? ((h = b.value.config) == null ? void 0 : h.messages[b.value.config.defaultLocale]) ?? {}, r = kn(e, t);
  return wt(n[r] ?? e, t);
}
function St(e, t) {
  return e.includes("{{") ? e.replace(bn, (n, r) => xt(r, t)) : e;
}
function qe(e) {
  if (typeof e == "string")
    return St(e);
  if (Array.isArray(e))
    return e.map((t) => qe(t));
  if (e !== null && typeof e == "object") {
    const t = e, n = {};
    for (const r of Object.keys(t)) n[r] = qe(t[r]);
    return n;
  }
  return e;
}
function Cn(e, t, n) {
  var h;
  const r = ((h = b.value.config) == null ? void 0 : h.messages[e]) ?? {}, c = n && typeof n.count == "number" ? `${t}_${n.count === 1 ? "one" : "many"}` : t;
  return wt(r[c] ?? r[t] ?? t, n);
}
const xe = {
  get loaded() {
    return b.value.config !== null;
  },
  get defaultLocale() {
    var e;
    return ((e = b.value.config) == null ? void 0 : e.defaultLocale) ?? "en";
  },
  get locales() {
    var e;
    return ((e = b.value.config) == null ? void 0 : e.locales) ?? ["en"];
  },
  get locale() {
    return b.value.locale;
  },
  t: xt,
  tr: St,
  deepTranslate: qe,
  /** Initializes from workspace config, respecting stored/browser locale. */
  init(e) {
    b.value = { ...b.value, config: e, locale: En(e) };
  },
  setLocale(e) {
    !b.value.config || !b.value.config.locales.includes(e) || (b.value = { ...b.value, locale: e }, localStorage.setItem(mt, e));
  },
  /** Available locales other than the current one (for a switcher). */
  otherLocales: ae(() => {
    var e;
    return ((e = b.value.config) == null ? void 0 : e.locales.filter((t) => t !== b.value.locale)) ?? [];
  }),
  translateFor: Cn
};
function Tn(e, t) {
  return { ...t, ...e };
}
function _n(e, t) {
  return ae(() => xe.deepTranslate(Tn(e, t)));
}
const bt = "cc.openPages", Qe = "cc.activePage", { activePageId: w, openPages: S, backStack: _, forwardStack: D } = j("__cc_page", () => ({
  activePageId: P(null),
  openPages: P([]),
  backStack: P([]),
  forwardStack: P([])
}));
function Et() {
  try {
    localStorage.setItem(bt, JSON.stringify(S.value)), w.value ? localStorage.setItem(Qe, w.value) : localStorage.removeItem(Qe);
  } catch {
  }
}
function Pn() {
  try {
    const e = localStorage.getItem(bt), t = e ? JSON.parse(e) : [], n = localStorage.getItem(Qe);
    return { openPages: t, activePageId: n };
  } catch {
    return { openPages: [], activePageId: null };
  }
}
function ye(e) {
  return S.value.indexOf(e);
}
const Rn = {
  get activePageId() {
    return w.value;
  },
  get openPages() {
    return S.value;
  },
  get canGoBack() {
    return _.value.length > 0;
  },
  get canGoForward() {
    return D.value.length > 0;
  },
  init() {
    var t;
    const e = Pn();
    if (e.openPages.length > 0) {
      const n = new Set(ge.pages.map((r) => r.id));
      S.value = e.openPages.filter((r) => n.has(r)), e.activePageId && n.has(e.activePageId) ? w.value = e.activePageId : S.value.length > 0 && (w.value = S.value[0]), Et();
    } else {
      const n = (t = ge.app) == null ? void 0 : t.landingPageId;
      n && this.openPage(n);
    }
  },
  /** Set the active page from a URL deep-link / browser back-forward without touching history stacks. */
  restore(e) {
    e !== w.value && (ye(e) === -1 && (S.value = [...S.value, e]), w.value = e);
  },
  openPage(e) {
    if (e === w.value) return;
    ye(e) === -1 && (S.value = [...S.value, e]), w.value !== null && (_.value = [..._.value, w.value]), D.value = [], w.value = e;
  },
  closeTab(e) {
    const t = ye(e);
    if (t !== -1 && (S.value = S.value.filter((n) => n !== e), _.value = _.value.filter((n) => n !== e), D.value = D.value.filter((n) => n !== e), w.value === e)) {
      const n = S.value[t] ?? S.value[t - 1] ?? null;
      w.value = n, n && (_.value = [..._.value, n]);
    }
  },
  closeOthers(e) {
    S.value = [e], _.value = _.value.filter((t) => t === e), D.value = [], w.value = e;
  },
  closeAll() {
    S.value = [], _.value = [], D.value = [], w.value = null;
  },
  back() {
    const e = _.value[_.value.length - 1];
    e !== void 0 && (_.value = _.value.slice(0, -1), w.value !== null && (D.value = [...D.value, w.value]), w.value = e, ye(e) === -1 && (S.value = [...S.value, e]));
  },
  forward() {
    const e = D.value[D.value.length - 1];
    e !== void 0 && (D.value = D.value.slice(0, -1), w.value !== null && (_.value = [..._.value, w.value]), w.value = e, ye(e) === -1 && (S.value = [...S.value, e]));
  }
};
en(() => {
  w.value, S.value, Et();
});
const { overlaysSignal: q, overlayState: gt } = j("__cc_overlay", () => ({
  overlaysSignal: P([]),
  overlayState: { uidCounter: 0 }
})), Ae = j("__cc_overlay_defs", () => /* @__PURE__ */ new Map()), oe = j("__cc_overlay_triggers", () => []);
function Mn() {
  return gt.uidCounter += 1, gt.uidCounter;
}
const An = ["menu", "modal", "panel", "tooltip"], jn = ["contextmenu", "dblclick", "selection", "hover", "drag"], On = ["left", "right", "bottom"], Nn = ["top", "right", "bottom", "left"];
function kt(e) {
  var t;
  return {
    label: e.label,
    icon: e.icon,
    command: e.command,
    params: e.params,
    spec: e.spec,
    confirm: e.confirm,
    items: (t = e.items) == null ? void 0 : t.map(kt),
    divider: e.divider,
    disabled: e.disabled,
    danger: e.danger,
    shortcut: e.shortcut
  };
}
function Dn(e) {
  var t;
  return {
    id: e.id,
    kind: An.includes(e.kind) ? e.kind : "menu",
    title: e.title,
    content: e.content,
    items: (t = e.items) == null ? void 0 : t.map(kt),
    width: e.width,
    side: On.includes(e.side) ? e.side : void 0,
    text: e.text,
    placement: Nn.includes(e.placement) ? e.placement : void 0
  };
}
function Ln(e) {
  return {
    event: jn.includes(e.event) ? e.event : "contextmenu",
    componentType: e.componentType,
    objectType: e.objectType,
    componentId: e.componentId,
    overlay: e.overlay,
    anchor: e.anchor === "center" ? "center" : "pointer"
  };
}
function Un(e, t) {
  return !(e.event !== t.event || e.componentType && e.componentType.toLowerCase() !== (t.componentType ?? "").toLowerCase() || e.objectType && e.objectType !== t.objectType || e.componentId && e.componentId !== t.componentId);
}
const G = {
  /** Raw signal for Preact signal integration. */
  get overlaysSignal() {
    return q;
  },
  get overlays() {
    return q.value;
  },
  /** Registers local (component-level) overlay definitions. Returns an unregister fn. */
  registerDefinitions(e) {
    return e.forEach((t) => Ae.set(t.id, t)), () => e.forEach((t) => Ae.delete(t.id));
  },
  /** Registers workspace-level overlay definitions (from /config). */
  registerWorkspace(e, t) {
    e.forEach((n) => {
      Ae.set(n.id, Dn(n));
    }), oe.length = 0, oe.push(...t.map(Ln));
  },
  registerLocalTriggers(e) {
    oe.push(...e);
    const t = oe.length - e.length;
    return () => {
      oe.splice(t, e.length);
    };
  },
  open(e, t, n = {}) {
    const r = Ae.get(e);
    if (!r) return null;
    const c = q.value, h = r.kind === "menu" ? c.filter((m) => m.definition.kind === "menu") : c.filter((m) => m.definition.kind !== "modal" && m.definition.kind !== "panel"), I = new Set(h.map((m) => m.uid)), R = c.filter((m) => !I.has(m.uid)), g = {
      uid: Mn(),
      overlayId: e,
      definition: r,
      anchor: t,
      context: n
    };
    return q.value = [...R, g], g;
  },
  close(e) {
    q.value = q.value.filter((t) => t.uid !== e);
  },
  closeAll() {
    q.value = [];
  },
  /** Routes a gesture (from GestureListener) to the first matching trigger. Returns true if an overlay opened. */
  onGesture(e) {
    const t = oe.find((c) => Un(c, e));
    if (!t) return !1;
    const n = t.anchor === "center" ? null : { x: e.x, y: e.y }, r = {
      payload: {
        componentType: e.componentType,
        objectType: e.objectType,
        componentId: e.componentId
      }
    };
    return e.row && (r.row = e.row), G.open(t.overlay, n, r) !== null;
  },
  /** Executes a menu item with the instance context. */
  async executeMenuItem(e, t) {
    if (!e.disabled) {
      if (e.spec) {
        await zn({ spec: e.spec, confirm: e.confirm }, t.context) && G.close(t.uid);
        return;
      }
      if (e.command) {
        if (e.confirm && !window.confirm(xe.tr(e.confirm))) return;
        try {
          await H.executeCommand(e.command, we(e.params, t.context)), J.push({ message: `'${e.command}' ok`, kind: "success" });
        } catch {
        }
        G.close(t.uid);
        return;
      }
      G.close(t.uid);
    }
  },
  async copyText(e) {
    try {
      await navigator.clipboard.writeText(e), J.push({ message: "Copied to clipboard", kind: "success" });
    } catch {
    }
  }
}, $n = /^\$([\w.]+)$/;
function Bn(e, t) {
  const n = e.split(".");
  let r = t[n[0]];
  for (let c = 1; c < n.length && r != null; c++)
    r = r[n[c]];
  return r;
}
function me(e, t) {
  if (typeof e == "string") {
    const n = $n.exec(e);
    if (n) {
      const r = Bn(n[1], t);
      if (r !== void 0) return r;
    }
    return e;
  }
  if (Array.isArray(e))
    return e.map((n) => me(n, t));
  if (e !== null && typeof e == "object") {
    const n = {};
    for (const [r, c] of Object.entries(e))
      n[r] = me(c, t);
    return n;
  }
  return e;
}
function we(e, t) {
  return e ? me(e, t) : {};
}
async function Wn(e, t) {
  if (!(e != null && e.command)) return { value: null, error: null };
  try {
    const n = await H.execute(e.command, we(e.params, t));
    return n.status === "ERROR" ? { value: null, error: n.error ?? `Command '${e.command}' failed` } : { value: n.value, error: null };
  } catch (n) {
    return { value: null, error: String(n) };
  }
}
async function Yn(e, t) {
  var n;
  switch (e.action) {
    case "navigate":
      return Rn.openPage(e.page), !0;
    case "command": {
      try {
        (await H.executeCommand(e.command, we(e.params, t))).status === "SUCCESS" && J.push({ message: `'${e.command}' ok`, kind: "success" });
      } catch {
      }
      return !0;
    }
    case "toast": {
      const r = me(e.message, t);
      return J.push({ message: xe.tr(String(r)), kind: "info" }), !0;
    }
    case "openModal":
    case "openPanel":
    case "openMenu":
      return G.open(e.overlay, e.action === "openMenu" ? { x: 0, y: 0 } : null, t), !0;
    case "closeOverlay":
      return G.closeAll(), !0;
    case "copyToClipboard": {
      const r = e.value !== void 0 ? String(me(e.value, t)) : "";
      return G.copyText(r), !0;
    }
    case "editor":
      return Q({
        kind: "editor.command",
        payload: {
          editor: e.editor,
          command: e.command,
          params: we(e.params, t),
          componentId: (n = t.payload) == null ? void 0 : n.componentId
        }
      }), !0;
    default:
      return !1;
  }
}
async function zn(e, t) {
  return !e || e.confirm && !window.confirm(xe.tr(e.confirm)) ? !1 : Yn(e.spec, t);
}
function Jn(e, t) {
  const n = X(null), r = X(null), c = X(!1);
  async function h() {
    const I = e();
    if (!(I != null && I.command)) {
      n.value = null, r.value = null, c.value = !1;
      return;
    }
    c.value = !0;
    const R = await Wn(I, t());
    n.value = R.value, r.value = R.error, c.value = !1;
  }
  return le(() => {
    var R;
    const I = (R = e()) == null ? void 0 : R.entityType;
    I && (Z.revision(I), h());
  }, []), le(() => {
    e(), h();
  }, []), le(() => {
    h();
  }, []), { value: n, error: r, loading: c, reload: h };
}
function Fn(e) {
  const t = xe.t, n = _n(e.config, {
    colors: ["#111827", "#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"],
    widths: [2, 4, 8],
    grid: !1,
    strokeWidth: 4,
    tool: "draw"
  }), r = ft(null), c = ft(null), h = ae(() => !n.value.readonly && n.value.disabled !== !0), I = ae(() => n.value.height), R = ae(() => n.value.id), g = ae(() => n.value.content), { value: m, error: A } = Jn(() => g.value, () => e.context ?? {}), f = X([]);
  let i = -1, Ne = n.value.strokeColor ?? "#111827", Se = n.value.strokeWidth ?? 4;
  const C = X(n.value.tool ?? "draw"), M = X(null), y = { x: 0, y: 0, scale: 1 };
  let W = 1, ce = !1, be = !1, Ee = !1, ke = !1, Ie = { x: 0, y: 0 }, De = { x: 0, y: 0 }, ie = !1, O = [], Y = null, Ce = null, ue = -1, Ze = !1, de = null, d = null, fe = null, et = 0, Te = null;
  const It = 50;
  let K = [], ee = [];
  const tt = X(!1), nt = X(!1);
  function Le() {
    return et += 1, `el_${Date.now().toString(36)}_${et}`;
  }
  const Ct = ["select", "pan", "draw", "erase", "rect", "ellipse", "line", "arrow", "clear"], ot = n.value.toolbar === !1 ? [] : n.value.toolbar ?? Ct, Tt = n.value.colors ?? ["#111827", "#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"], _t = n.value.widths ?? [2, 4, 8];
  function N() {
    var o;
    !h.value || !((o = n.value.save) != null && o.command) || (de && clearTimeout(de), de = setTimeout(() => {
      Rt();
    }, 600));
  }
  function Pt() {
    const o = { elements: f.value };
    return JSON.stringify(o);
  }
  async function Rt() {
    var a;
    if (!((a = n.value.save) != null && a.command)) return;
    const o = { ...n.value.save.params ?? {}, content: Pt() };
    try {
      await H.executeCommand(n.value.save.command, we(o, e.context ?? {})), J.push({ message: t("core.editor.saved"), kind: "success" });
    } catch {
    }
  }
  function Mt(o) {
    f.value = (o.elements ?? []).map((a) => a.id ? a : { ...a, id: Le() }), i = -1, K = [], ee = [], _e(), x();
  }
  function Ue() {
    return f.value.map((o) => ({ ...o, points: o.points.map((a) => ({ ...a })) }));
  }
  function _e() {
    tt.value = K.length > 0, nt.value = ee.length > 0;
  }
  function z(o) {
    const a = Ue();
    o && i >= 0 && a[i] && (a[i] = { ...a[i], points: o.map((s) => ({ x: s.x, y: s.y })) }), K.push(a), K.length > It && K.shift(), ee.length = 0, _e();
  }
  function $e() {
    !h.value || K.length === 0 || (ee.push(Ue()), f.value = K.pop() ?? [], i = -1, _e(), N(), x());
  }
  function Pe() {
    !h.value || ee.length === 0 || (K.push(Ue()), f.value = ee.pop() ?? [], i = -1, _e(), N(), x());
  }
  function at(o) {
    var s;
    const a = ((s = r.current) == null ? void 0 : s.getBoundingClientRect()) ?? { left: 0, top: 0 };
    return {
      x: (o.clientX - a.left - y.x) / y.scale,
      y: (o.clientY - a.top - y.y) / y.scale
    };
  }
  function rt() {
    const o = r.current;
    if (!o) return;
    W = window.devicePixelRatio || 1;
    const a = o.getBoundingClientRect();
    o.width = Math.max(1, Math.round(a.width * W)), o.height = Math.max(1, Math.round(a.height * W)), d = o.getContext("2d"), x();
  }
  function x() {
    if (!d || !r.current) return;
    d.setTransform(W, 0, 0, W, 0, 0), d.clearRect(0, 0, r.current.width / W, r.current.height / W);
    const o = n.value.background ?? "#ffffff";
    d.fillStyle = o, d.fillRect(0, 0, r.current.width / W, r.current.height / W), d.save(), d.translate(y.x, y.y), d.scale(y.scale, y.scale), n.value.grid && At();
    for (let a = 0; a < f.value.length; a++)
      st(f.value[a], a === i);
    if (M.value && st(M.value, !1), h.value && C.value === "select" && i >= 0) {
      const a = ve(f.value[i]);
      a && Ot(a);
    }
    d.restore();
  }
  function At() {
    var u, p;
    if (!d) return;
    const o = 20, a = { x: -y.x / y.scale, y: -y.y / y.scale, w: (((u = r.current) == null ? void 0 : u.width) ?? 0) / y.scale, h: (((p = r.current) == null ? void 0 : p.height) ?? 0) / y.scale };
    d.strokeStyle = "#eef2f7", d.lineWidth = 1 / y.scale, d.beginPath();
    const s = Math.floor(a.x / o) * o, l = Math.floor(a.y / o) * o;
    for (let v = s; v <= a.x + a.w; v += o)
      d.moveTo(v, a.y), d.lineTo(v, a.y + a.h);
    for (let v = l; v <= a.y + a.h; v += o)
      d.moveTo(a.x, v), d.lineTo(a.x + a.w, v);
    d.stroke();
  }
  function st(o, a) {
    if (d) {
      if (d.strokeStyle = o.color, d.fillStyle = o.color, d.lineWidth = o.width, d.lineCap = "round", d.lineJoin = "round", o.type === "path") {
        const s = d;
        s.beginPath(), o.points.forEach((l, u) => u === 0 ? s.moveTo(l.x, l.y) : s.lineTo(l.x, l.y)), s.stroke();
      } else if (o.type === "rect")
        o.points.length >= 2 && d.strokeRect(o.points[0].x, o.points[0].y, o.points[1].x - o.points[0].x, o.points[1].y - o.points[0].y);
      else if (o.type === "ellipse")
        o.points.length >= 2 && (d.beginPath(), d.ellipse(
          (o.points[0].x + o.points[1].x) / 2,
          (o.points[0].y + o.points[1].y) / 2,
          Math.abs(o.points[1].x - o.points[0].x) / 2,
          Math.abs(o.points[1].y - o.points[0].y) / 2,
          0,
          0,
          Math.PI * 2
        ), d.stroke());
      else if ((o.type === "line" || o.type === "arrow") && o.points.length >= 2) {
        const [s, l] = o.points;
        if (d.beginPath(), d.moveTo(s.x, s.y), d.lineTo(l.x, l.y), d.stroke(), o.type === "arrow") {
          const u = Math.atan2(l.y - s.y, l.x - s.x), p = Math.max(8, o.width * 3);
          d.beginPath(), d.moveTo(l.x, l.y), d.lineTo(l.x - p * Math.cos(u - Math.PI / 6), l.y - p * Math.sin(u - Math.PI / 6)), d.moveTo(l.x, l.y), d.lineTo(l.x - p * Math.cos(u + Math.PI / 6), l.y - p * Math.sin(u + Math.PI / 6)), d.stroke();
        }
      }
      if (a) {
        const s = ve(o);
        s && (d.strokeStyle = "#3b82f6", d.lineWidth = 1.5 / y.scale, d.setLineDash([6 / y.scale, 4 / y.scale]), d.strokeRect(s.x, s.y, s.w, s.h), d.setLineDash([]));
      }
    }
  }
  function ve(o) {
    if (!o.points.length) return null;
    let a = 1 / 0, s = 1 / 0, l = -1 / 0, u = -1 / 0;
    for (const v of o.points)
      a = Math.min(a, v.x), s = Math.min(s, v.y), l = Math.max(l, v.x), u = Math.max(u, v.y);
    const p = o.width + 4;
    return { x: a - p, y: s - p, w: l - a + p * 2, h: u - s + p * 2 };
  }
  const jt = {
    nw: "nwse-resize",
    n: "ns-resize",
    ne: "nesw-resize",
    e: "ew-resize",
    se: "nwse-resize",
    s: "ns-resize",
    sw: "nesw-resize",
    w: "ew-resize"
  };
  function lt(o) {
    return [
      { id: "nw", x: o.x, y: o.y },
      { id: "n", x: o.x + o.w / 2, y: o.y },
      { id: "ne", x: o.x + o.w, y: o.y },
      { id: "e", x: o.x + o.w, y: o.y + o.h / 2 },
      { id: "se", x: o.x + o.w, y: o.y + o.h },
      { id: "s", x: o.x + o.w / 2, y: o.y + o.h },
      { id: "sw", x: o.x, y: o.y + o.h },
      { id: "w", x: o.x, y: o.y + o.h / 2 }
    ];
  }
  function ct(o) {
    if (i < 0) return null;
    const a = f.value[i];
    if (!a || a.points.length < 2) return null;
    const s = ve(a);
    if (!s) return null;
    for (const l of lt(s))
      if (Math.hypot((l.x - o.x) * y.scale, (l.y - o.y) * y.scale) <= 9) return l.id;
    return null;
  }
  function Ot(o) {
    if (!d) return;
    const a = 6 / y.scale;
    d.strokeStyle = "#3b82f6", d.lineWidth = 1.5 / y.scale, d.fillStyle = "#ffffff";
    for (const s of lt(o))
      d.fillRect(s.x - a / 2, s.y - a / 2, a, a), d.strokeRect(s.x - a / 2, s.y - a / 2, a, a);
  }
  function Nt(o) {
    const a = r.current;
    if (!a) return;
    if (C.value !== "select") {
      a.style.cursor = "crosshair";
      return;
    }
    const s = ct(o);
    if (s) {
      a.style.cursor = jt[s];
      return;
    }
    a.style.cursor = Be(o) >= 0 ? "move" : "crosshair";
  }
  function it(o, a, s) {
    const l = s.x - a.x, u = s.y - a.y, p = l * l + u * u;
    let v = p === 0 ? 0 : ((o.x - a.x) * l + (o.y - a.y) * u) / p;
    return v = Math.max(0, Math.min(1, v)), Math.hypot(o.x - (a.x + v * l), o.y - (a.y + v * u));
  }
  function Be(o) {
    for (let a = f.value.length - 1; a >= 0; a--) {
      const s = f.value[a];
      if (s.type === "path") {
        for (let l = 1; l < s.points.length; l++)
          if (it(o, s.points[l - 1], s.points[l]) <= s.width / 2 + 4) return a;
      } else if (s.type === "line" || s.type === "arrow") {
        if (s.points.length >= 2 && it(o, s.points[0], s.points[1]) <= s.width / 2 + 4) return a;
      } else {
        const l = ve(s);
        if (l && o.x >= l.x && o.x <= l.x + l.w && o.y >= l.y && o.y <= l.y + l.h) return a;
      }
    }
    return -1;
  }
  function Dt(o) {
    const a = Math.max(8, Se * 1.5);
    let s = !1;
    const l = [...f.value];
    for (let u = l.length - 1; u >= 0; u--)
      l[u].points.some((L) => Math.hypot(L.x - o.x, L.y - o.y) <= a) && (l.splice(u, 1), s = !0);
    return s && (f.value = l, i >= f.value.length && (i = -1), N()), s;
  }
  function Lt() {
    if (M.value) {
      const o = M.value;
      if (o.points.length >= 2) {
        z(), o.id = Le();
        const a = [...f.value, o];
        f.value = a, i = -1, N();
      }
    }
    M.value = null;
  }
  function Ut(o) {
    var s;
    if (!h.value) return;
    ue = o.pointerId, (s = r.current) == null || s.setPointerCapture(ue), Ie = { x: o.clientX, y: o.clientY };
    const a = at(o);
    if (C.value === "pan") {
      ke = !0;
      return;
    }
    if (C.value === "select") {
      if (i >= 0) {
        const u = ct(a), p = ve(f.value[i]);
        if (u && p) {
          Ee = !0, Y = u, Ce = p, O = f.value[i].points.map((v) => ({ ...v }));
          return;
        }
      }
      const l = Be(a);
      i = l, be = l >= 0, De = a, ie = !1, l >= 0 && (O = f.value[l].points.map((u) => ({ ...u }))), x();
      return;
    }
    if (C.value === "erase") {
      Dt(a), x();
      return;
    }
    ce = !0, M.value = {
      type: C.value === "draw" ? "path" : C.value,
      points: [a],
      color: Ne,
      width: Se
    };
  }
  function $t(o) {
    const a = at(o);
    if (ke) {
      y.x += o.clientX - Ie.x, y.y += o.clientY - Ie.y, Ie = { x: o.clientX, y: o.clientY }, x();
      return;
    }
    if (Ee && Y && Ce && i >= 0) {
      const s = Ce;
      let l = s.x, u = s.y, p = s.w, v = s.h;
      switch (Y) {
        case "nw":
          l = a.x, u = a.y, p = s.x + s.w - a.x, v = s.y + s.h - a.y;
          break;
        case "n":
          u = a.y, v = s.y + s.h - a.y;
          break;
        case "ne":
          u = a.y, p = a.x - s.x, v = s.y + s.h - a.y;
          break;
        case "e":
          p = a.x - s.x;
          break;
        case "se":
          p = a.x - s.x, v = a.y - s.y;
          break;
        case "s":
          v = a.y - s.y;
          break;
        case "sw":
          l = a.x, p = s.x + s.w - a.x, v = a.y - s.y;
          break;
        case "w":
          l = a.x, p = s.x + s.w - a.x;
          break;
      }
      const L = f.value[i], Ht = o.shiftKey, Re = s.w / s.h;
      Ht && !Number.isNaN(Re) && isFinite(Re) && (Y === "n" || Y === "s" ? p = v * Re : v = p / Re, Y === "n" && (u = s.y + s.h - v), Y === "s" && v < 0 && (u = s.y + s.h), Y === "w" && (l = s.x + s.w - p)), p === 0 && (p = 1), v === 0 && (v = 1);
      const Ft = p / s.w, qt = v / s.h;
      L.points = O.map((dt) => ({ x: l + (dt.x - s.x) * Ft, y: u + (dt.y - s.y) * qt })), x();
      return;
    }
    if (be && i >= 0) {
      const s = a.x - De.x, l = a.y - De.y;
      (s !== 0 || l !== 0) && (ie = !0);
      const u = f.value[i];
      u.points = O.map((p) => ({ x: p.x + s, y: p.y + l })), x();
      return;
    }
    if (ce && M.value) {
      if (M.value.type === "path") {
        const s = M.value.points[M.value.points.length - 1];
        Math.hypot(a.x - s.x, a.y - s.y) > 1 && M.value.points.push(a);
      } else
        M.value.points[1] = a;
      x();
    } else C.value === "select" && !ce && Nt(a);
  }
  function ut() {
    var o;
    if (ue >= 0 && ((o = r.current) == null || o.releasePointerCapture(ue), ue = -1), ce && (ce = !1, Lt()), Ee) {
      if (Ee = !1, Y = null, Ce = null, O.length > 0) {
        const a = i >= 0 ? f.value[i] : void 0;
        (!a || a.points.length !== O.length || a.points.some((l, u) => l.x !== O[u].x || l.y !== O[u].y)) && z(O), O = [];
      }
      N(), ie = !1;
    }
    ke && (ke = !1), be && (be = !1, ie && (z(O), N()), ie = !1, O = []), x();
  }
  function Bt(o) {
    var L;
    o.preventDefault();
    const a = ((L = r.current) == null ? void 0 : L.getBoundingClientRect()) ?? { left: 0, top: 0 }, s = o.clientX - a.left, l = o.clientY - a.top, u = o.deltaY < 0 ? 1.12 : 0.89, p = Math.min(8, Math.max(0.1, y.scale * u)), v = p / y.scale;
    y.x = s - (s - y.x) * v, y.y = l - (l - y.y) * v, y.scale = p, x();
  }
  function Wt(o) {
    if (h.value) {
      if ((o.metaKey || o.ctrlKey) && o.key.toLowerCase() === "z") {
        o.preventDefault(), o.shiftKey ? Pe() : $e();
        return;
      }
      if ((o.metaKey || o.ctrlKey) && o.key.toLowerCase() === "y") {
        o.preventDefault(), Pe();
        return;
      }
      if ((o.metaKey || o.ctrlKey) && o.key === "]") {
        o.preventDefault(), We();
        return;
      }
      if ((o.metaKey || o.ctrlKey) && o.key === "[") {
        o.preventDefault(), Ye();
        return;
      }
      if ((o.key === "Delete" || o.key === "Backspace") && i >= 0) {
        o.preventDefault(), z();
        const a = [...f.value];
        a.splice(i, 1), f.value = a, i = -1, N(), x();
      }
    }
  }
  function V(o) {
    C.value = o;
  }
  function Yt(o) {
    Ne = o;
  }
  function zt(o) {
    Se = o;
  }
  function Jt() {
    h.value && f.value.length !== 0 && (z(), f.value = [], i = -1, M.value = null, N(), x());
  }
  function We() {
    if (i < 0 || i >= f.value.length) return;
    z();
    const o = [...f.value], a = o.splice(i, 1)[0];
    o.push(a), f.value = o, i = o.length - 1, N(), x();
  }
  function Ye() {
    if (i < 0 || i >= f.value.length) return;
    z();
    const o = [...f.value], a = o.splice(i, 1)[0];
    o.unshift(a), f.value = o, i = 0, N(), x();
  }
  function Kt() {
    y.x = 0, y.y = 0, y.scale = 1, x();
  }
  function Vt() {
    if (i < 0 || i >= f.value.length) return;
    z();
    const o = f.value[i], a = {
      id: Le(),
      type: o.type,
      points: o.points.map((l) => ({ x: l.x + 16, y: l.y + 16 })),
      color: o.color,
      width: o.width
    }, s = [...f.value, a];
    f.value = s, i = s.length - 1, N(), x();
  }
  function Xt(o) {
    var v;
    if (!h.value) return;
    const a = ((v = r.current) == null ? void 0 : v.getBoundingClientRect()) ?? { left: 0, top: 0 }, s = { x: (o.clientX - a.left - y.x) / y.scale, y: (o.clientY - a.top - y.y) / y.scale }, l = Be(s);
    if (l < 0) return;
    i = l, x();
    const u = f.value[l];
    G.onGesture({
      event: "contextmenu",
      componentType: "Canvas2D",
      objectType: "canvas.element",
      componentId: R.value,
      row: { id: u.id, type: u.type },
      x: o.clientX,
      y: o.clientY
    }) && o.preventDefault();
  }
  function Gt(o) {
    var l;
    if (o.editor !== "canvas" || o.componentId && o.componentId !== R.value || !h.value) return;
    if (o.command === "undo") {
      $e();
      return;
    }
    if (o.command === "redo") {
      Pe();
      return;
    }
    const a = (l = o.params) == null ? void 0 : l.id, s = a ? f.value.findIndex((u) => u.id === a) : -1;
    if (!(s < 0))
      switch (i = s, o.command) {
        case "delete":
          z();
          const u = [...f.value];
          u.splice(s, 1), f.value = u, i = -1, N(), x();
          break;
        case "duplicate":
          Vt();
          break;
        case "front":
          We();
          break;
        case "back":
          Ye();
          break;
      }
  }
  le(() => {
    const o = m.value;
    if (!(o == null || Ze))
      try {
        Mt(JSON.parse(String(o))), Ze = !0;
      } catch {
      }
  }, [m.value]), le(() => (rt(), fe = new ResizeObserver(rt), c.current && fe.observe(c.current), A.value && J.push({ message: A.value, kind: "error" }), Te = cn((o) => {
    o.kind === "editor.command" && Gt(o.payload);
  }), () => {
    de && clearTimeout(de), fe == null || fe.disconnect(), Te == null || Te();
  }), []), le(() => {
    h.value || (M.value = null, x());
  }, [h.value]);
  const pe = {
    select: { label: t("core.editor.canvas.select"), icon: "➤", action: () => V("select"), active: () => C.value === "select" },
    pan: { label: t("core.editor.canvas.pan"), icon: "✋", action: () => V("pan"), active: () => C.value === "pan" },
    draw: { label: t("core.editor.canvas.draw"), icon: "✏", action: () => V("draw"), active: () => C.value === "draw" },
    erase: { label: t("core.editor.canvas.erase"), icon: "⌫", action: () => V("erase"), active: () => C.value === "erase" },
    rect: { label: t("core.editor.canvas.rect"), icon: "▭", action: () => V("rect"), active: () => C.value === "rect" },
    ellipse: { label: t("core.editor.canvas.ellipse"), icon: "◯", action: () => V("ellipse"), active: () => C.value === "ellipse" },
    line: { label: t("core.editor.canvas.line"), icon: "╱", action: () => V("line"), active: () => C.value === "line" },
    arrow: { label: t("core.editor.canvas.arrow"), icon: "➔", action: () => V("arrow"), active: () => C.value === "arrow" },
    clear: { label: t("core.editor.canvas.clear"), icon: "∅", action: () => Jt() },
    undo: { label: t("core.editor.undo"), icon: "↩", action: () => $e(), disabled: () => !tt.value },
    redo: { label: t("core.editor.redo"), icon: "↪", action: () => Pe(), disabled: () => !nt.value },
    front: { label: t("core.editor.canvas.front"), icon: "⇡", action: () => We(), disabled: () => i < 0 },
    back: { label: t("core.editor.canvas.back"), icon: "⇣", action: () => Ye(), disabled: () => i < 0 }
  };
  return /* @__PURE__ */ ze("div", { class: "ui-canvas", style: I.value ? { height: I.value } : void 0, "data-gesture-type": "Canvas2D", children: [
    ot.length ? /* @__PURE__ */ ze("div", { class: "ui-canvas__toolbar", children: [
      ot.map((o) => {
        var a, s, l, u, p, v;
        return /* @__PURE__ */ te(
          "button",
          {
            class: `ui-canvas__btn${(s = (a = pe[o]) == null ? void 0 : a.active) != null && s.call(a) ? " ui-canvas__btn--active" : ""}${!h.value && o !== "pan" || (u = (l = pe[o]) == null ? void 0 : l.disabled) != null && u.call(l) ? " ui-canvas__btn--disabled" : ""}`,
            title: (p = pe[o]) == null ? void 0 : p.label,
            onClick: () => {
              var L;
              return (L = pe[o]) == null ? void 0 : L.action();
            },
            children: (v = pe[o]) == null ? void 0 : v.icon
          },
          o
        );
      }),
      h.value ? /* @__PURE__ */ ze("span", { class: "ui-canvas__palette", children: [
        Tt.map((o) => /* @__PURE__ */ te(
          "button",
          {
            class: `ui-canvas__swatch${o === Ne ? " ui-canvas__swatch--active" : ""}`,
            style: { background: o },
            title: o,
            onClick: () => Yt(o)
          },
          o
        )),
        /* @__PURE__ */ te("select", { class: "ui-canvas__width", value: Se, onChange: (o) => zt(Number(o.target.value)), children: _t.map((o) => /* @__PURE__ */ te("option", { value: o, children: o }, o)) })
      ] }) : null
    ] }) : null,
    /* @__PURE__ */ te("div", { class: "ui-canvas__stage", ref: c, onDblClick: Kt, children: /* @__PURE__ */ te(
      "canvas",
      {
        ref: r,
        tabIndex: 0,
        class: `ui-canvas__surface${h.value ? "" : " ui-canvas__surface--readonly"}`,
        onPointerDown: Ut,
        onPointerMove: $t,
        onPointerUp: ut,
        onPointerCancel: ut,
        onWheel: Bt,
        onContextMenu: Xt,
        onKeyDown: Wt
      }
    ) })
  ] });
}
export {
  Fn as default
};
