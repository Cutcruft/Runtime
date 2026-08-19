var Qt = Object.defineProperty;
var Zt = (e, t, o) => t in e ? Qt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: o }) : e[t] = o;
var N = (e, t, o) => Zt(e, typeof t != "symbol" ? t + "" : t, o);
import { ref as E, reactive as ne, computed as Y, watch as Oe, onMounted as kt, defineComponent as en, onBeforeUnmount as tn, openBlock as z, createElementBlock as W, normalizeStyle as vt, Fragment as Ke, renderList as Ve, normalizeClass as Xe, toDisplayString as ht, unref as yt, createElementVNode as Je, createCommentVNode as mt } from "vue";
const C = {
  COMMAND_EXECUTE: "command.execute",
  COMMAND_RESULT: "command.result",
  PROJECT_EVENT: "project.event",
  OBJECT_CHANGED: "object.changed",
  ERROR: "error",
  PRESENCE_JOIN: "presence.join",
  PRESENCE_LEAVE: "presence.leave",
  PRESENCE_LIST: "presence.list",
  CLIENT_IDENTITY: "client.identity",
  CURSOR_UPDATE: "cursor.update"
};
function nn(e) {
  const t = JSON.parse(e);
  return {
    type: t.type ?? "unknown",
    requestId: t.requestId,
    payload: t.payload ?? {}
  };
}
function gt(e) {
  return JSON.stringify({
    type: e.type,
    ...e.requestId ? { requestId: e.requestId } : {},
    payload: e.payload
  });
}
const on = 2e4, rn = 1e3, an = 1e4;
class sn {
  constructor(t) {
    N(this, "socket", null);
    N(this, "pending", /* @__PURE__ */ new Map());
    N(this, "reconnectAttempt", 0);
    N(this, "reconnectTimer", null);
    N(this, "closed", !1);
    N(this, "url");
    N(this, "status", "disconnected");
    N(this, "onStatusChange", null);
    N(this, "onEvent", null);
    this.url = ln(t);
  }
  connect() {
    this.closed = !1, this.setStatus("connecting");
    try {
      const t = new WebSocket(this.url);
      this.socket = t, t.onopen = () => this.handleOpen(), t.onmessage = (o) => this.handleMessage(o.data), t.onerror = () => {
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
  execute(t, o, s = on) {
    return new Promise((l, m) => {
      if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
        m("Not connected");
        return;
      }
      const y = cn(), S = window.setTimeout(() => {
        this.pending.delete(y), m(`Command '${t}' timed out`);
      }, s);
      this.pending.set(y, { resolve: l, reject: m, timer: S }), this.socket.send(
        gt({
          type: C.COMMAND_EXECUTE,
          requestId: y,
          payload: { commandId: t, params: o }
        })
      );
    });
  }
  sendRaw(t, o) {
    !this.socket || this.socket.readyState !== WebSocket.OPEN || this.socket.send(gt({ type: t, payload: o }));
  }
  handleOpen() {
    this.reconnectAttempt = 0, this.setStatus("connected");
  }
  handleMessage(t) {
    var s;
    let o;
    try {
      o = nn(String(t));
    } catch {
      return;
    }
    if (o.type === C.COMMAND_RESULT) {
      this.resolvePending(o.requestId, o.payload);
      return;
    }
    o.type === C.ERROR && this.rejectPending(o.requestId, o.payload.message ?? "Unknown error"), (s = this.onEvent) == null || s.call(this, o);
  }
  handleClose() {
    this.socket = null, this.rejectAll("Connection lost"), this.setStatus("disconnected"), !this.closed && this.scheduleReconnect();
  }
  scheduleReconnect() {
    this.clearReconnectTimer();
    const t = Math.min(rn * 2 ** this.reconnectAttempt, an);
    this.reconnectAttempt += 1, this.reconnectTimer = window.setTimeout(() => this.connect(), t);
  }
  clearReconnectTimer() {
    this.reconnectTimer !== null && (window.clearTimeout(this.reconnectTimer), this.reconnectTimer = null);
  }
  resolvePending(t, o) {
    if (!t) return;
    const s = this.pending.get(t);
    s && (this.pending.delete(t), window.clearTimeout(s.timer), s.resolve(o));
  }
  rejectPending(t, o) {
    if (!t) return;
    const s = this.pending.get(t);
    s && (this.pending.delete(t), window.clearTimeout(s.timer), s.reject(o));
  }
  rejectAll(t) {
    this.pending.forEach((o) => {
      window.clearTimeout(o.timer), o.reject(t);
    }), this.pending.clear();
  }
  setStatus(t) {
    var o;
    this.status = t, (o = this.onStatusChange) == null || o.call(this, t);
  }
}
function ln(e) {
  return `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}${e}`;
}
function cn() {
  const e = new Uint8Array(16);
  if (typeof crypto < "u" && typeof crypto.getRandomValues == "function")
    crypto.getRandomValues(e);
  else
    for (let o = 0; o < e.length; o++)
      e[o] = Math.floor(Math.random() * 256);
  e[6] = e[6] & 15 | 64, e[8] = e[8] & 63 | 128;
  const t = Array.from(e, (o) => o.toString(16).padStart(2, "0"));
  return [
    t.slice(0, 4).join(""),
    t.slice(4, 6).join(""),
    t.slice(6, 8).join(""),
    t.slice(8, 10).join(""),
    t.slice(10, 16).join("")
  ].join("-");
}
const Qe = /* @__PURE__ */ new Set();
function un(e) {
  return Qe.add(e), () => Qe.delete(e);
}
function ve(e) {
  Qe.forEach((t) => t(e));
}
const He = E(null), Ne = {
  get app() {
    var e;
    return (e = He.value) == null ? void 0 : e.app;
  },
  get transport() {
    var e;
    return (e = He.value) == null ? void 0 : e.transport;
  },
  get collaboration() {
    var e;
    return ((e = He.value) == null ? void 0 : e.collaboration) ?? { enabled: !1, cursorsEnabled: !1 };
  }
}, dn = 4e3, Q = E([]);
let fn = 1;
const G = {
  get list() {
    return Q.value;
  },
  push(e) {
    const t = fn++;
    Q.value.push({ id: t, message: e.message, kind: e.kind ?? "info" }), window.setTimeout(() => {
      Q.value = Q.value.filter((o) => o.id !== t);
    }, dn);
  },
  remove(e) {
    Q.value = Q.value.filter((t) => t.id !== e);
  }
}, he = ne(/* @__PURE__ */ new Map());
function Z(e) {
  let t = he.get(e);
  return t || (t = { revision: 0, rows: [], loading: !1, error: null }, he.set(e, t)), t;
}
const ye = {
  get caches() {
    return he;
  },
  invalidate(e) {
    Z(e).revision += 1;
  },
  revision(e) {
    return Z(e).revision;
  },
  rows(e) {
    return Z(e).rows;
  },
  loading(e) {
    return Z(e).loading;
  },
  error(e) {
    return Z(e).error;
  },
  async loadList(e, t, o) {
    const s = Z(e);
    s.loading = !0, s.error = null;
    try {
      const l = await oe.execute(t, o ?? {});
      l.status === "ERROR" ? (s.error = l.error ?? "Command failed", s.rows = []) : s.rows = Array.isArray(l.value) ? l.value : [];
    } catch (l) {
      s.error = String(l), s.rows = [];
    } finally {
      s.loading = !1;
    }
  },
  clearAll() {
    he.clear();
  },
  refreshAll() {
    he.forEach((e) => {
      e.revision += 1;
    });
  },
  reportCommandError(e, t) {
    G.push({ message: `Command '${e}' failed: ${String(t)}`, kind: "error" });
  }
};
function pn() {
  const e = ne(/* @__PURE__ */ new Map());
  function t(g, _, M) {
    let R = e.get(g);
    R || (R = /* @__PURE__ */ new Map(), e.set(g, R)), R.set(_, M);
  }
  function o(g, _) {
    const M = s(g, _, !0);
    return t(g, _, !M), !M;
  }
  function s(g, _, M) {
    var R;
    return ((R = e.get(g)) == null ? void 0 : R.get(_)) ?? M;
  }
  function l(g, _) {
    return s(g, _.id, _.visible ?? !0);
  }
  function m(g, _) {
    return _.filter((M) => l(g, M)).sort((M, R) => M.order - R.order);
  }
  function y(g) {
    return Array.isArray(g.layers) && g.layers.length > 0;
  }
  function S(g) {
    t(g.pageId, g.layerId, g.visible);
  }
  return {
    overrides: e,
    setVisible: t,
    toggle: o,
    isVisible: s,
    isLayerVisible: l,
    getVisibleLayers: m,
    hasLayers: y,
    handleLayerEvent: S
  };
}
const vn = pn(), I = ne({
  participants: [],
  localSessionId: null
}), te = {
  get participants() {
    return I.participants;
  },
  get count() {
    return I.participants.length;
  },
  get localSessionId() {
    return I.localSessionId;
  },
  get localParticipant() {
    return I.participants.find((e) => e.sessionId === I.localSessionId);
  },
  setLocalSessionId(e) {
    I.localSessionId = e;
  },
  updateParticipants(e) {
    I.participants = e;
  },
  addParticipant(e) {
    I.participants.find((t) => t.sessionId === e.sessionId) || I.participants.push(e);
  },
  removeParticipant(e) {
    I.participants = I.participants.filter((t) => t.sessionId !== e);
  },
  clear() {
    I.participants = [], I.localSessionId = null;
  }
}, X = ne({
  cursors: /* @__PURE__ */ new Map()
}), hn = 1e4, Ze = /* @__PURE__ */ new Set();
function fe() {
  for (const e of Ze) e();
}
const wt = {
  get all() {
    return Array.from(X.cursors.values());
  },
  getCursorsForObject(e, t) {
    return this.all.filter((o) => o.entityType === e && o.objectId === t);
  },
  getCursorsBySession(e) {
    return this.all.filter((t) => t.sessionId === e);
  },
  updateCursor(e) {
    X.cursors.set(e.sessionId, {
      ...e,
      lastSeen: Date.now()
    }), fe();
  },
  removeCursor(e) {
    X.cursors.delete(e), fe();
  },
  removeObjectCursors(e, t) {
    for (const [o, s] of X.cursors)
      s.entityType === e && s.objectId === t && X.cursors.delete(o);
    fe();
  },
  purgeStale() {
    const e = Date.now();
    for (const [t, o] of X.cursors)
      e - o.lastSeen > hn && X.cursors.delete(t);
    fe();
  },
  clear() {
    X.cursors.clear(), fe();
  },
  subscribe(e) {
    return Ze.add(e), () => {
      Ze.delete(e);
    };
  }
}, Ge = E("disconnected"), je = E(null);
let j = null, Pe = null;
const oe = {
  get wsStatus() {
    return Ge.value;
  },
  get projectId() {
    return je.value;
  },
  get isConnected() {
    return Ge.value === "connected";
  },
  get localParticipant() {
    return te.localParticipant;
  },
  init() {
    var t;
    const e = ((t = Ne.transport) == null ? void 0 : t.wsPath) ?? "/ws";
    j = new sn(e), j.onStatusChange = (o) => {
      Ge.value = o, o === "connected" ? (Fe(), Pe && wn(Pe)) : o === "disconnected" && te.clear();
    }, j.onEvent = (o) => gn(o), j.connect();
  },
  execute(e, t) {
    return j ? j.execute(e, t) : Promise.reject(new Error("Session not initialized"));
  },
  sendRaw(e, t) {
    j && j.sendRaw(e, t);
  },
  async createProject() {
    const e = await qe("project.create", null), t = xt(e);
    return je.value = t, Pe = t, ye.refreshAll(), Fe(), t;
  },
  async openProject(e) {
    const t = await qe("project.open", { projectId: e });
    return je.value = xt(t), Pe = e, ye.refreshAll(), Fe(), e;
  },
  async executeCommand(e, t) {
    const o = await qe(e, t);
    return o.status === "ERROR" && ye.reportCommandError(e, o.error ?? "Command failed"), o;
  }
};
function Fe() {
  var e;
  !((e = Ne.collaboration) != null && e.enabled) || !j || j.sendRaw(C.CLIENT_IDENTITY, {
    name: yn(),
    color: mn()
  });
}
function yn() {
  const e = ["Swift", "Calm", "Bright", "Bold", "Kind"], t = ["Fox", "Owl", "Bear", "Wolf", "Hawk"], o = e[Math.floor(Math.random() * e.length)], s = t[Math.floor(Math.random() * t.length)];
  return `${o} ${s}`;
}
function mn() {
  return `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`;
}
async function qe(e, t) {
  if (!j) throw new Error("Session not initialized");
  const o = await j.execute(e, t);
  if (o.status === "ERROR")
    throw new Error(o.error ?? `Command '${e}' failed`);
  return o;
}
function xt(e) {
  const t = e.value;
  if (t && typeof t.projectId == "string") return t.projectId;
  throw new Error("Command result did not contain projectId");
}
function gn(e) {
  var t;
  switch (e.type) {
    case C.PROJECT_EVENT: {
      const o = e.payload, s = o.projectId;
      typeof s == "string" && (je.value = s), o.type === "layer.visibility" && vn.handleLayerEvent({
        pageId: o.pageId,
        layerId: o.layerId,
        visible: o.visible
      }), ve({ kind: C.PROJECT_EVENT, payload: o });
      break;
    }
    case C.OBJECT_CHANGED: {
      const o = e.payload.entityType;
      typeof o == "string" && ye.invalidate(o), ve({ kind: C.OBJECT_CHANGED, payload: e.payload });
      break;
    }
    case C.PRESENCE_LIST: {
      const o = e.payload.participants;
      Array.isArray(o) && te.updateParticipants(o);
      break;
    }
    case C.PRESENCE_JOIN: {
      const o = e.payload;
      o != null && o.sessionId && te.addParticipant(o);
      break;
    }
    case C.PRESENCE_LEAVE: {
      const o = e.payload.sessionId;
      o && (te.removeParticipant(o), wt.removeCursor(o));
      break;
    }
    case C.CURSOR_UPDATE: {
      const o = e.payload, s = o.sessionId;
      if (s && ((t = Ne.collaboration) != null && t.cursorsEnabled)) {
        const l = te.participants.find((m) => m.sessionId === s);
        wt.updateCursor({
          sessionId: s,
          name: o.name ?? (l == null ? void 0 : l.name) ?? "Anonymous",
          color: o.color ?? (l == null ? void 0 : l.color) ?? "#999",
          entityType: o.entityType,
          objectId: o.objectId,
          position: o.position,
          selection: o.selection
        });
      }
      break;
    }
    case C.ERROR: {
      const o = e.payload.message ?? "Unknown error";
      G.push({ message: o, kind: "error" }), ve({ kind: C.ERROR, payload: e.payload });
      break;
    }
    default:
      ve({ kind: e.type, payload: e.payload });
  }
}
function wn(e) {
  oe.openProject(e).catch(() => {
  });
}
const bt = "rt.locale", xn = /\{\{\s*([^{}\s]+)\s*\}\}/g;
function En(e) {
  var s;
  if (!e) return "en";
  const t = localStorage.getItem(bt);
  if (t && e.locales.includes(t)) return t;
  const o = (s = navigator.language) == null ? void 0 : s.split("-")[0];
  return o && e.locales.includes(o) ? o : e.defaultLocale;
}
const x = ne({
  config: null,
  locale: "en"
});
function St(e, t) {
  return t ? e.replace(/\{(\w+)\}/g, (o, s) => {
    const l = t[s];
    return l == null ? o : String(l);
  }) : e;
}
function kn(e, t) {
  const o = typeof (t == null ? void 0 : t.count) == "number" ? t.count : void 0;
  if (o !== void 0) {
    const s = o === 1 ? `${e}_one` : `${e}_many`;
    if (bn(s)) return s;
  }
  return e;
}
function bn(e) {
  var o, s;
  const t = ((o = x.config) == null ? void 0 : o.messages[x.locale]) ?? ((s = x.config) == null ? void 0 : s.messages[x.config.defaultLocale]);
  return t != null && e in t;
}
function Tt(e, t) {
  var l, m;
  const o = ((l = x.config) == null ? void 0 : l.messages[x.locale]) ?? ((m = x.config) == null ? void 0 : m.messages[x.config.defaultLocale]) ?? {}, s = kn(e, t);
  return St(o[s] ?? e, t);
}
function Ct(e, t) {
  return e.includes("{{") ? e.replace(xn, (o, s) => Tt(s, t)) : e;
}
function et(e) {
  if (typeof e == "string")
    return Ct(e);
  if (Array.isArray(e))
    return e.map((t) => et(t));
  if (e !== null && typeof e == "object") {
    const t = e, o = {};
    for (const s of Object.keys(t)) o[s] = et(t[s]);
    return o;
  }
  return e;
}
function Sn(e, t, o) {
  var m;
  const s = ((m = x.config) == null ? void 0 : m.messages[e]) ?? {}, l = o && typeof o.count == "number" ? `${t}_${o.count === 1 ? "one" : "many"}` : t;
  return St(s[l] ?? s[t] ?? t, o);
}
const we = {
  get loaded() {
    return x.config !== null;
  },
  get defaultLocale() {
    var e;
    return ((e = x.config) == null ? void 0 : e.defaultLocale) ?? "en";
  },
  get locales() {
    var e;
    return ((e = x.config) == null ? void 0 : e.locales) ?? ["en"];
  },
  get locale() {
    return x.locale;
  },
  t: Tt,
  tr: Ct,
  deepTranslate: et,
  /** Initializes from workspace config, respecting stored/browser locale. */
  init(e) {
    x.config = e, x.locale = En(e);
  },
  setLocale(e) {
    !x.config || !x.config.locales.includes(e) || (x.locale = e, localStorage.setItem(bt, e));
  },
  /** Available locales other than the current one (for a switcher). */
  otherLocales: Y(() => {
    var e;
    return ((e = x.config) == null ? void 0 : e.locales.filter((t) => t !== x.locale)) ?? [];
  }),
  translateFor: Sn
};
function Tn(e, t) {
  return { ...t, ...e };
}
function Cn(e, t) {
  return Y(() => we.deepTranslate(Tn(e, t)));
}
const b = E(null), O = E([]), L = E([]), J = E([]);
function pe(e) {
  return O.value.indexOf(e);
}
const _n = {
  get activePageId() {
    return b.value;
  },
  get openPages() {
    return O.value;
  },
  get canGoBack() {
    return L.value.length > 0;
  },
  get canGoForward() {
    return J.value.length > 0;
  },
  init() {
    var t;
    const e = (t = Ne.app) == null ? void 0 : t.landingPageId;
    e && this.openPage(e);
  },
  /** Set the active page from a URL deep-link / browser back-forward without touching history stacks. */
  restore(e) {
    e !== b.value && (pe(e) === -1 && O.value.push(e), b.value = e);
  },
  openPage(e) {
    if (e === b.value) return;
    pe(e) === -1 && O.value.push(e), b.value !== null && L.value.push(b.value), J.value = [], b.value = e;
  },
  closeTab(e) {
    const t = pe(e);
    if (t !== -1 && (O.value.splice(t, 1), L.value = L.value.filter((o) => o !== e), J.value = J.value.filter((o) => o !== e), b.value === e)) {
      const o = O.value[t] ?? O.value[t - 1] ?? null;
      b.value = o, o && L.value.push(o);
    }
  },
  closeOthers(e) {
    O.value = [e], L.value = L.value.filter((t) => t === e), J.value = [], b.value = e;
  },
  closeAll() {
    O.value = [], L.value = [], J.value = [], b.value = null;
  },
  back() {
    const e = L.value.pop();
    e !== void 0 && (b.value !== null && J.value.push(b.value), b.value = e, pe(e) === -1 && O.value.push(e));
  },
  forward() {
    const e = J.value.pop();
    e !== void 0 && (b.value !== null && L.value.push(b.value), b.value = e, pe(e) === -1 && O.value.push(e));
  }
}, D = ne({ overlays: [] });
let Et = 0;
const Ae = /* @__PURE__ */ new Map(), ee = [];
function In() {
  return Et += 1, Et;
}
const Mn = ["menu", "modal", "panel", "tooltip"], Rn = ["contextmenu", "dblclick", "selection", "hover", "drag"], Pn = ["left", "right", "bottom"], An = ["top", "right", "bottom", "left"];
function _t(e) {
  var t;
  return {
    label: e.label,
    icon: e.icon,
    command: e.command,
    params: e.params,
    spec: e.spec,
    confirm: e.confirm,
    items: (t = e.items) == null ? void 0 : t.map(_t),
    divider: e.divider,
    disabled: e.disabled,
    danger: e.danger,
    shortcut: e.shortcut
  };
}
function jn(e) {
  var t;
  return {
    id: e.id,
    kind: Mn.includes(e.kind) ? e.kind : "menu",
    title: e.title,
    content: e.content,
    items: (t = e.items) == null ? void 0 : t.map(_t),
    width: e.width,
    side: Pn.includes(e.side) ? e.side : void 0,
    text: e.text,
    placement: An.includes(e.placement) ? e.placement : void 0
  };
}
function On(e) {
  return {
    event: Rn.includes(e.event) ? e.event : "contextmenu",
    componentType: e.componentType,
    objectType: e.objectType,
    componentId: e.componentId,
    overlay: e.overlay,
    anchor: e.anchor === "center" ? "center" : "pointer"
  };
}
function Nn(e, t) {
  return !(e.event !== t.event || e.componentType && e.componentType.toLowerCase() !== (t.componentType ?? "").toLowerCase() || e.objectType && e.objectType !== t.objectType || e.componentId && e.componentId !== t.componentId);
}
const H = {
  get overlays() {
    return D.overlays;
  },
  /** Registers local (component-level) overlay definitions. Returns an unregister fn. */
  registerDefinitions(e) {
    return e.forEach((t) => Ae.set(t.id, t)), () => e.forEach((t) => Ae.delete(t.id));
  },
  /** Registers workspace-level overlay definitions (from /config). */
  registerWorkspace(e, t) {
    e.forEach((o) => {
      Ae.set(o.id, jn(o));
    }), ee.length = 0, ee.push(...t.map(On));
  },
  registerLocalTriggers(e) {
    ee.push(...e);
    const t = ee.length - e.length;
    return () => {
      ee.splice(t, e.length);
    };
  },
  open(e, t, o = {}) {
    const s = Ae.get(e);
    if (!s) return null;
    (s.kind === "menu" ? D.overlays.filter((y) => y.definition.kind === "menu") : D.overlays.filter((y) => y.definition.kind !== "modal" && y.definition.kind !== "panel")).forEach((y) => {
      const S = D.overlays.indexOf(y);
      S >= 0 && D.overlays.splice(S, 1);
    });
    const m = {
      uid: In(),
      overlayId: e,
      definition: s,
      anchor: t,
      context: o
    };
    return D.overlays.push(m), m;
  },
  close(e) {
    const t = D.overlays.findIndex((o) => o.uid === e);
    t >= 0 && D.overlays.splice(t, 1);
  },
  closeAll() {
    D.overlays.splice(0, D.overlays.length);
  },
  /** Routes a gesture (from GestureListener) to the first matching trigger. Returns true if an overlay opened. */
  onGesture(e) {
    const t = ee.find((l) => Nn(l, e));
    if (!t) return !1;
    const o = t.anchor === "center" ? null : { x: e.x, y: e.y }, s = {
      payload: {
        componentType: e.componentType,
        objectType: e.objectType,
        componentId: e.componentId
      }
    };
    return e.row && (s.row = e.row), H.open(t.overlay, o, s) !== null;
  },
  /** Executes a menu item with the instance context. */
  async executeMenuItem(e, t) {
    if (!e.disabled) {
      if (e.spec) {
        await Bn({ spec: e.spec, confirm: e.confirm }, t.context) && H.close(t.uid);
        return;
      }
      if (e.command) {
        if (e.confirm && !window.confirm(we.tr(e.confirm))) return;
        try {
          await oe.executeCommand(e.command, ge(e.params, t.context)), G.push({ message: `'${e.command}' ok`, kind: "success" });
        } catch {
        }
        H.close(t.uid);
        return;
      }
      H.close(t.uid);
    }
  },
  async copyText(e) {
    try {
      await navigator.clipboard.writeText(e), G.push({ message: "Copied to clipboard", kind: "success" });
    } catch {
    }
  }
}, Ln = /^\$([\w.]+)$/;
function Dn(e, t) {
  const o = e.split(".");
  let s = t[o[0]];
  for (let l = 1; l < o.length && s != null; l++)
    s = s[o[l]];
  return s;
}
function me(e, t) {
  if (typeof e == "string") {
    const o = Ln.exec(e);
    if (o) {
      const s = Dn(o[1], t);
      if (s !== void 0) return s;
    }
    return e;
  }
  if (Array.isArray(e))
    return e.map((o) => me(o, t));
  if (e !== null && typeof e == "object") {
    const o = {};
    for (const [s, l] of Object.entries(e))
      o[s] = me(l, t);
    return o;
  }
  return e;
}
function ge(e, t) {
  return e ? me(e, t) : {};
}
async function $n(e, t) {
  if (!(e != null && e.command)) return { value: null, error: null };
  try {
    const o = await oe.execute(e.command, ge(e.params, t));
    return o.status === "ERROR" ? { value: null, error: o.error ?? `Command '${e.command}' failed` } : { value: o.value, error: null };
  } catch (o) {
    return { value: null, error: String(o) };
  }
}
async function Un(e, t) {
  var o;
  switch (e.action) {
    case "navigate":
      return _n.openPage(e.page), !0;
    case "command": {
      try {
        (await oe.executeCommand(e.command, ge(e.params, t))).status === "SUCCESS" && G.push({ message: `'${e.command}' ok`, kind: "success" });
      } catch {
      }
      return !0;
    }
    case "toast": {
      const s = me(e.message, t);
      return G.push({ message: we.tr(String(s)), kind: "info" }), !0;
    }
    case "openModal":
    case "openPanel":
    case "openMenu":
      return H.open(e.overlay, e.action === "openMenu" ? { x: 0, y: 0 } : null, t), !0;
    case "closeOverlay":
      return H.closeAll(), !0;
    case "copyToClipboard": {
      const s = e.value !== void 0 ? String(me(e.value, t)) : "";
      return H.copyText(s), !0;
    }
    case "editor":
      return ve({
        kind: "editor.command",
        payload: {
          editor: e.editor,
          command: e.command,
          params: ge(e.params, t),
          componentId: (o = t.payload) == null ? void 0 : o.componentId
        }
      }), !0;
    default:
      return !1;
  }
}
async function Bn(e, t) {
  return !e || e.confirm && !window.confirm(we.tr(e.confirm)) ? !1 : Un(e.spec, t);
}
function zn(e, t) {
  const o = E(null), s = E(null), l = E(!1);
  async function m() {
    const y = e();
    if (!(y != null && y.command)) {
      o.value = null, s.value = null, l.value = !1;
      return;
    }
    l.value = !0;
    const S = await $n(y, t());
    o.value = S.value, s.value = S.error, l.value = !1;
  }
  return Oe(
    () => {
      var S;
      const y = (S = e()) == null ? void 0 : S.entityType;
      return y ? ye.revision(y) : 0;
    },
    () => m()
  ), Oe(e, () => m()), kt(() => m()), { value: o, error: s, loading: l, reload: m };
}
const Wn = {
  key: 0,
  class: "ui-canvas__toolbar"
}, Yn = ["title", "onClick"], Kn = {
  key: 0,
  class: "ui-canvas__palette"
}, Vn = ["title", "onClick"], Xn = ["value"], Jn = ["value"], Hn = 50, Gn = /* @__PURE__ */ en({
  __name: "UiCanvas",
  props: {
    config: {},
    context: {}
  },
  setup(e) {
    const t = e, o = we.t, s = Cn(t.config, {
      colors: ["#111827", "#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"],
      widths: [2, 4, 8],
      grid: !1,
      strokeWidth: 4,
      tool: "draw"
    }), l = E(null), m = E(null), y = Y(() => !s.value.readonly && s.value.disabled !== !0), S = Y(() => s.value.height), g = Y(() => s.value.id), _ = Y(() => s.value.content), { value: M, error: R } = zn(
      () => _.value,
      () => t.context ?? {}
    ), v = E([]);
    let d = -1, Le = s.value.strokeColor ?? "#111827", xe = s.value.strokeWidth ?? 4;
    const k = E(s.value.tool ?? "draw"), T = E(null), h = { x: 0, y: 0, scale: 1 };
    let $ = 1, re = !1, Ee = !1, ke = !1, be = !1, Se = { x: 0, y: 0 }, De = { x: 0, y: 0 }, ae = !1, P = [], U = null, Te = null, se = -1, tt = !1, ie = null, c = null, le = null, nt = 0, Ce = null, K = [], q = [];
    const ot = E(!1), rt = E(!1);
    function $e() {
      return nt += 1, `el_${Date.now().toString(36)}_${nt}`;
    }
    const It = ["select", "pan", "draw", "erase", "rect", "ellipse", "line", "arrow", "clear"], at = Y(() => s.value.toolbar === !1 ? [] : s.value.toolbar ?? It), Mt = Y(() => s.value.colors ?? ["#111827", "#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"]), Rt = Y(() => s.value.widths ?? [2, 4, 8]);
    function A() {
      var n;
      !y.value || !((n = s.value.save) != null && n.command) || (ie && clearTimeout(ie), ie = setTimeout(() => {
        At();
      }, 600));
    }
    function Pt() {
      const n = { elements: v.value };
      return JSON.stringify(n);
    }
    async function At() {
      var a;
      if (!((a = s.value.save) != null && a.command)) return;
      const n = { ...s.value.save.params ?? {}, content: Pt() };
      try {
        await oe.executeCommand(s.value.save.command, ge(n, t.context ?? {})), G.push({ message: o("core.editor.saved"), kind: "success" });
      } catch {
      }
    }
    function jt(n) {
      v.value = (n.elements ?? []).map((a) => a.id ? a : { ...a, id: $e() }), d = -1, K = [], q = [], _e(), w();
    }
    function Ue() {
      return v.value.map((n) => ({ ...n, points: n.points.map((a) => ({ ...a })) }));
    }
    function _e() {
      ot.value = K.length > 0, rt.value = q.length > 0;
    }
    function B(n) {
      const a = Ue();
      n && d >= 0 && a[d] && (a[d] = { ...a[d], points: n.map((r) => ({ x: r.x, y: r.y })) }), K.push(a), K.length > Hn && K.shift(), q.length = 0, _e();
    }
    function Be() {
      !y.value || K.length === 0 || (q.push(Ue()), v.value = K.pop() ?? [], d = -1, _e(), A(), w());
    }
    function Ie() {
      !y.value || q.length === 0 || (K.push(Ue()), v.value = q.pop() ?? [], d = -1, _e(), A(), w());
    }
    Oe(
      () => M.value,
      (n) => {
        if (!(n == null || tt))
          try {
            jt(JSON.parse(String(n))), tt = !0;
          } catch {
          }
      }
    );
    function st(n) {
      var r;
      const a = ((r = l.value) == null ? void 0 : r.getBoundingClientRect()) ?? { left: 0, top: 0 };
      return {
        x: (n.clientX - a.left - h.x) / h.scale,
        y: (n.clientY - a.top - h.y) / h.scale
      };
    }
    function it() {
      const n = l.value;
      if (!n) return;
      $ = window.devicePixelRatio || 1;
      const a = n.getBoundingClientRect();
      n.width = Math.max(1, Math.round(a.width * $)), n.height = Math.max(1, Math.round(a.height * $)), c = n.getContext("2d"), w();
    }
    function w() {
      if (!c || !l.value) return;
      c.setTransform($, 0, 0, $, 0, 0), c.clearRect(0, 0, l.value.width / $, l.value.height / $);
      const n = s.value.background ?? "#ffffff";
      c.fillStyle = n, c.fillRect(0, 0, l.value.width / $, l.value.height / $), c.save(), c.translate(h.x, h.y), c.scale(h.scale, h.scale), s.value.grid && Ot();
      for (let a = 0; a < v.value.length; a++)
        lt(v.value[a], a === d);
      if (T.value && lt(T.value, !1), y.value && k.value === "select" && d >= 0) {
        const a = ce(v.value[d]);
        a && Lt(a);
      }
      c.restore();
    }
    function Ot() {
      var f, p;
      if (!c) return;
      const n = 20, a = { x: -h.x / h.scale, y: -h.y / h.scale, w: (((f = l.value) == null ? void 0 : f.width) ?? 0) / h.scale, h: (((p = l.value) == null ? void 0 : p.height) ?? 0) / h.scale };
      c.strokeStyle = "#eef2f7", c.lineWidth = 1 / h.scale, c.beginPath();
      const r = Math.floor(a.x / n) * n, i = Math.floor(a.y / n) * n;
      for (let u = r; u <= a.x + a.w; u += n)
        c.moveTo(u, a.y), c.lineTo(u, a.y + a.h);
      for (let u = i; u <= a.y + a.h; u += n)
        c.moveTo(a.x, u), c.lineTo(a.x + a.w, u);
      c.stroke();
    }
    function lt(n, a) {
      if (c) {
        if (c.strokeStyle = n.color, c.fillStyle = n.color, c.lineWidth = n.width, c.lineCap = "round", c.lineJoin = "round", n.type === "path") {
          const r = c;
          r.beginPath(), n.points.forEach((i, f) => f === 0 ? r.moveTo(i.x, i.y) : r.lineTo(i.x, i.y)), r.stroke();
        } else if (n.type === "rect")
          n.points.length >= 2 && c.strokeRect(n.points[0].x, n.points[0].y, n.points[1].x - n.points[0].x, n.points[1].y - n.points[0].y);
        else if (n.type === "ellipse")
          n.points.length >= 2 && (c.beginPath(), c.ellipse(
            (n.points[0].x + n.points[1].x) / 2,
            (n.points[0].y + n.points[1].y) / 2,
            Math.abs(n.points[1].x - n.points[0].x) / 2,
            Math.abs(n.points[1].y - n.points[0].y) / 2,
            0,
            0,
            Math.PI * 2
          ), c.stroke());
        else if ((n.type === "line" || n.type === "arrow") && n.points.length >= 2) {
          const [r, i] = n.points;
          if (c.beginPath(), c.moveTo(r.x, r.y), c.lineTo(i.x, i.y), c.stroke(), n.type === "arrow") {
            const f = Math.atan2(i.y - r.y, i.x - r.x), p = Math.max(8, n.width * 3);
            c.beginPath(), c.moveTo(i.x, i.y), c.lineTo(i.x - p * Math.cos(f - Math.PI / 6), i.y - p * Math.sin(f - Math.PI / 6)), c.moveTo(i.x, i.y), c.lineTo(i.x - p * Math.cos(f + Math.PI / 6), i.y - p * Math.sin(f + Math.PI / 6)), c.stroke();
          }
        }
        if (a) {
          const r = ce(n);
          r && (c.strokeStyle = "#3b82f6", c.lineWidth = 1.5 / h.scale, c.setLineDash([6 / h.scale, 4 / h.scale]), c.strokeRect(r.x, r.y, r.w, r.h), c.setLineDash([]));
        }
      }
    }
    function ce(n) {
      if (!n.points.length) return null;
      let a = 1 / 0, r = 1 / 0, i = -1 / 0, f = -1 / 0;
      for (const u of n.points)
        a = Math.min(a, u.x), r = Math.min(r, u.y), i = Math.max(i, u.x), f = Math.max(f, u.y);
      const p = n.width + 4;
      return { x: a - p, y: r - p, w: i - a + p * 2, h: f - r + p * 2 };
    }
    const Nt = {
      nw: "nwse-resize",
      n: "ns-resize",
      ne: "nesw-resize",
      e: "ew-resize",
      se: "nwse-resize",
      s: "ns-resize",
      sw: "nesw-resize",
      w: "ew-resize"
    };
    function ct(n) {
      return [
        { id: "nw", x: n.x, y: n.y },
        { id: "n", x: n.x + n.w / 2, y: n.y },
        { id: "ne", x: n.x + n.w, y: n.y },
        { id: "e", x: n.x + n.w, y: n.y + n.h / 2 },
        { id: "se", x: n.x + n.w, y: n.y + n.h },
        { id: "s", x: n.x + n.w / 2, y: n.y + n.h },
        { id: "sw", x: n.x, y: n.y + n.h },
        { id: "w", x: n.x, y: n.y + n.h / 2 }
      ];
    }
    function ut(n) {
      if (d < 0) return null;
      const a = v.value[d];
      if (!a || a.points.length < 2) return null;
      const r = ce(a);
      if (!r) return null;
      for (const i of ct(r))
        if (Math.hypot((i.x - n.x) * h.scale, (i.y - n.y) * h.scale) <= 9) return i.id;
      return null;
    }
    function Lt(n) {
      if (!c) return;
      const a = 6 / h.scale;
      c.strokeStyle = "#3b82f6", c.lineWidth = 1.5 / h.scale, c.fillStyle = "#ffffff";
      for (const r of ct(n))
        c.fillRect(r.x - a / 2, r.y - a / 2, a, a), c.strokeRect(r.x - a / 2, r.y - a / 2, a, a);
    }
    function Dt(n) {
      const a = l.value;
      if (!a) return;
      if (k.value !== "select") {
        a.style.cursor = "crosshair";
        return;
      }
      const r = ut(n);
      if (r) {
        a.style.cursor = Nt[r];
        return;
      }
      a.style.cursor = ze(n) >= 0 ? "move" : "crosshair";
    }
    function dt(n, a, r) {
      const i = r.x - a.x, f = r.y - a.y, p = i * i + f * f;
      let u = p === 0 ? 0 : ((n.x - a.x) * i + (n.y - a.y) * f) / p;
      return u = Math.max(0, Math.min(1, u)), Math.hypot(n.x - (a.x + u * i), n.y - (a.y + u * f));
    }
    function ze(n) {
      for (let a = v.value.length - 1; a >= 0; a--) {
        const r = v.value[a];
        if (r.type === "path") {
          for (let i = 1; i < r.points.length; i++)
            if (dt(n, r.points[i - 1], r.points[i]) <= r.width / 2 + 4) return a;
        } else if (r.type === "line" || r.type === "arrow") {
          if (r.points.length >= 2 && dt(n, r.points[0], r.points[1]) <= r.width / 2 + 4) return a;
        } else {
          const i = ce(r);
          if (i && n.x >= i.x && n.x <= i.x + i.w && n.y >= i.y && n.y <= i.y + i.h) return a;
        }
      }
      return -1;
    }
    function $t(n) {
      const a = Math.max(8, xe * 1.5);
      let r = !1;
      for (let i = v.value.length - 1; i >= 0; i--)
        v.value[i].points.some((u) => Math.hypot(u.x - n.x, u.y - n.y) <= a) && (v.value.splice(i, 1), r = !0);
      return r && (d >= v.value.length && (d = -1), A()), r;
    }
    function Ut() {
      if (T.value) {
        const n = T.value;
        n.points.length >= 2 && (B(), n.id = $e(), v.value.push(n), d = -1, A());
      }
      T.value = null;
    }
    function Bt(n) {
      var r;
      if (!y.value) return;
      se = n.pointerId, (r = l.value) == null || r.setPointerCapture(se), Se = { x: n.clientX, y: n.clientY };
      const a = st(n);
      if (k.value === "pan") {
        be = !0;
        return;
      }
      if (k.value === "select") {
        if (d >= 0) {
          const f = ut(a), p = ce(v.value[d]);
          if (f && p) {
            ke = !0, U = f, Te = p, P = v.value[d].points.map((u) => ({ ...u }));
            return;
          }
        }
        const i = ze(a);
        d = i, Ee = i >= 0, De = a, ae = !1, i >= 0 && (P = v.value[i].points.map((f) => ({ ...f }))), w();
        return;
      }
      if (k.value === "erase") {
        $t(a), w();
        return;
      }
      re = !0, T.value = {
        type: k.value === "draw" ? "path" : k.value,
        points: [a],
        color: Le,
        width: xe
      };
    }
    function zt(n) {
      const a = st(n);
      if (be) {
        h.x += n.clientX - Se.x, h.y += n.clientY - Se.y, Se = { x: n.clientX, y: n.clientY }, w();
        return;
      }
      if (ke && U && Te && d >= 0) {
        const r = Te;
        let i = r.x, f = r.y, p = r.w, u = r.h;
        switch (U) {
          case "nw":
            i = a.x, f = a.y, p = r.x + r.w - a.x, u = r.y + r.h - a.y;
            break;
          case "n":
            f = a.y, u = r.y + r.h - a.y;
            break;
          case "ne":
            f = a.y, p = a.x - r.x, u = r.y + r.h - a.y;
            break;
          case "e":
            p = a.x - r.x;
            break;
          case "se":
            p = a.x - r.x, u = a.y - r.y;
            break;
          case "s":
            u = a.y - r.y;
            break;
          case "sw":
            i = a.x, p = r.x + r.w - a.x, u = a.y - r.y;
            break;
          case "w":
            i = a.x, p = r.x + r.w - a.x;
            break;
        }
        const F = v.value[d], Me = n.shiftKey, de = r.w / r.h;
        Me && !Number.isNaN(de) && isFinite(de) && (U === "n" || U === "s" ? p = u * de : u = p / de, U === "n" && (f = r.y + r.h - u), U === "s" && u < 0 && (f = r.y + r.h), U === "w" && (i = r.x + r.w - p)), p === 0 && (p = 1), u === 0 && (u = 1);
        const Re = p / r.w, qt = u / r.h;
        F.points = P.map((pt) => ({ x: i + (pt.x - r.x) * Re, y: f + (pt.y - r.y) * qt })), w();
        return;
      }
      if (Ee && d >= 0) {
        const r = a.x - De.x, i = a.y - De.y;
        (r !== 0 || i !== 0) && (ae = !0);
        const f = v.value[d];
        f.points = P.map((p) => ({ x: p.x + r, y: p.y + i })), w();
        return;
      }
      if (re && T.value) {
        if (T.value.type === "path") {
          const r = T.value.points[T.value.points.length - 1];
          Math.hypot(a.x - r.x, a.y - r.y) > 1 && T.value.points.push(a);
        } else
          T.value.points[1] = a;
        w();
      } else k.value === "select" && !re && Dt(a);
    }
    function ft() {
      var n;
      if (se >= 0 && ((n = l.value) == null || n.releasePointerCapture(se), se = -1), re && (re = !1, Ut()), ke) {
        if (ke = !1, U = null, Te = null, P.length > 0) {
          const a = d >= 0 ? v.value[d] : void 0;
          (!a || a.points.length !== P.length || a.points.some((i, f) => i.x !== P[f].x || i.y !== P[f].y)) && B(P), P = [];
        }
        A(), ae = !1;
      }
      be && (be = !1), Ee && (Ee = !1, ae && (B(P), A()), ae = !1, P = []), w();
    }
    function Wt(n) {
      var F;
      n.preventDefault();
      const a = ((F = l.value) == null ? void 0 : F.getBoundingClientRect()) ?? { left: 0, top: 0 }, r = n.clientX - a.left, i = n.clientY - a.top, f = n.deltaY < 0 ? 1.12 : 0.89, p = Math.min(8, Math.max(0.1, h.scale * f)), u = p / h.scale;
      h.x = r - (r - h.x) * u, h.y = i - (i - h.y) * u, h.scale = p, w();
    }
    function Yt(n) {
      if (y.value) {
        if ((n.metaKey || n.ctrlKey) && n.key.toLowerCase() === "z") {
          n.preventDefault(), n.shiftKey ? Ie() : Be();
          return;
        }
        if ((n.metaKey || n.ctrlKey) && n.key.toLowerCase() === "y") {
          n.preventDefault(), Ie();
          return;
        }
        if ((n.metaKey || n.ctrlKey) && n.key === "]") {
          n.preventDefault(), We();
          return;
        }
        if ((n.metaKey || n.ctrlKey) && n.key === "[") {
          n.preventDefault(), Ye();
          return;
        }
        (n.key === "Delete" || n.key === "Backspace") && d >= 0 && (n.preventDefault(), B(), v.value.splice(d, 1), d = -1, A(), w());
      }
    }
    function V(n) {
      k.value = n;
    }
    function Kt(n) {
      Le = n;
    }
    function Vt(n) {
      xe = n;
    }
    function Xt() {
      y.value && v.value.length !== 0 && (B(), v.value = [], d = -1, T.value = null, A(), w());
    }
    function We() {
      if (d < 0 || d >= v.value.length) return;
      B();
      const n = v.value.splice(d, 1)[0];
      v.value.push(n), d = v.value.length - 1, A(), w();
    }
    function Ye() {
      if (d < 0 || d >= v.value.length) return;
      B();
      const n = v.value.splice(d, 1)[0];
      v.value.unshift(n), d = 0, A(), w();
    }
    function Jt() {
      h.x = 0, h.y = 0, h.scale = 1, w();
    }
    function Ht() {
      if (d < 0 || d >= v.value.length) return;
      B();
      const n = v.value[d], a = {
        id: $e(),
        type: n.type,
        points: n.points.map((r) => ({ x: r.x + 16, y: r.y + 16 })),
        color: n.color,
        width: n.width
      };
      v.value.push(a), d = v.value.length - 1, A(), w();
    }
    function Gt(n) {
      var u;
      if (!y.value) return;
      const a = ((u = l.value) == null ? void 0 : u.getBoundingClientRect()) ?? { left: 0, top: 0 }, r = {
        x: (n.clientX - a.left - h.x) / h.scale,
        y: (n.clientY - a.top - h.y) / h.scale
      }, i = ze(r);
      if (i < 0) return;
      d = i, w();
      const f = v.value[i];
      H.onGesture({
        event: "contextmenu",
        componentType: "Canvas2D",
        objectType: "canvas.element",
        componentId: g.value,
        row: { id: f.id, type: f.type },
        x: n.clientX,
        y: n.clientY
      }) && n.preventDefault();
    }
    function Ft(n) {
      var i;
      if (n.editor !== "canvas" || n.componentId && n.componentId !== g.value || !y.value) return;
      if (n.command === "undo") {
        Be();
        return;
      }
      if (n.command === "redo") {
        Ie();
        return;
      }
      const a = (i = n.params) == null ? void 0 : i.id, r = a ? v.value.findIndex((f) => f.id === a) : -1;
      if (!(r < 0))
        switch (d = r, n.command) {
          case "delete":
            B(), v.value.splice(r, 1), d = -1, A(), w();
            break;
          case "duplicate":
            Ht();
            break;
          case "front":
            We();
            break;
          case "back":
            Ye();
            break;
        }
    }
    Oe(y, (n) => {
      n || (T.value = null, w());
    }), kt(() => {
      it(), le = new ResizeObserver(it), m.value && le.observe(m.value), R.value && G.push({ message: R.value, kind: "error" }), Ce = un((n) => {
        n.kind === "editor.command" && Ft(n.payload);
      });
    }), tn(() => {
      ie && clearTimeout(ie), le == null || le.disconnect(), Ce == null || Ce();
    });
    const ue = {
      select: { label: o("core.editor.canvas.select"), icon: "➤", action: () => V("select"), active: () => k.value === "select" },
      pan: { label: o("core.editor.canvas.pan"), icon: "✋", action: () => V("pan"), active: () => k.value === "pan" },
      draw: { label: o("core.editor.canvas.draw"), icon: "✏", action: () => V("draw"), active: () => k.value === "draw" },
      erase: { label: o("core.editor.canvas.erase"), icon: "⌫", action: () => V("erase"), active: () => k.value === "erase" },
      rect: { label: o("core.editor.canvas.rect"), icon: "▭", action: () => V("rect"), active: () => k.value === "rect" },
      ellipse: { label: o("core.editor.canvas.ellipse"), icon: "◯", action: () => V("ellipse"), active: () => k.value === "ellipse" },
      line: { label: o("core.editor.canvas.line"), icon: "╱", action: () => V("line"), active: () => k.value === "line" },
      arrow: { label: o("core.editor.canvas.arrow"), icon: "➔", action: () => V("arrow"), active: () => k.value === "arrow" },
      clear: { label: o("core.editor.canvas.clear"), icon: "∅", action: () => Xt() },
      undo: { label: o("core.editor.undo"), icon: "↩", action: () => Be(), disabled: () => !ot.value },
      redo: { label: o("core.editor.redo"), icon: "↪", action: () => Ie(), disabled: () => !rt.value },
      front: { label: o("core.editor.canvas.front"), icon: "⇡", action: () => We(), disabled: () => d < 0 },
      back: { label: o("core.editor.canvas.back"), icon: "⇣", action: () => Ye(), disabled: () => d < 0 }
    };
    return (n, a) => (z(), W("div", {
      class: "ui-canvas",
      style: vt(S.value ? { height: S.value } : void 0),
      "data-gesture-type": "Canvas2D"
    }, [
      at.value.length ? (z(), W("div", Wn, [
        (z(!0), W(Ke, null, Ve(at.value, (r) => {
          var i, f, p, u, F, Me;
          return z(), W("button", {
            key: r,
            class: Xe(["ui-canvas__btn", { "ui-canvas__btn--active": (f = (i = ue[r]) == null ? void 0 : i.active) == null ? void 0 : f.call(i), "ui-canvas__btn--disabled": !y.value && r !== "pan" || ((u = (p = ue[r]) == null ? void 0 : p.disabled) == null ? void 0 : u.call(p)) }]),
            title: (F = ue[r]) == null ? void 0 : F.label,
            onClick: (de) => {
              var Re;
              return (Re = ue[r]) == null ? void 0 : Re.action();
            }
          }, ht((Me = ue[r]) == null ? void 0 : Me.icon), 11, Yn);
        }), 128)),
        y.value ? (z(), W("span", Kn, [
          (z(!0), W(Ke, null, Ve(Mt.value, (r) => (z(), W("button", {
            key: r,
            class: Xe(["ui-canvas__swatch", { "ui-canvas__swatch--active": r === yt(Le) }]),
            style: vt({ background: r }),
            title: r,
            onClick: (i) => Kt(r)
          }, null, 14, Vn))), 128)),
          Je("select", {
            class: "ui-canvas__width",
            value: yt(xe),
            onChange: a[0] || (a[0] = (r) => Vt(Number(r.target.value)))
          }, [
            (z(!0), W(Ke, null, Ve(Rt.value, (r) => (z(), W("option", {
              key: r,
              value: r
            }, ht(r), 9, Jn))), 128))
          ], 40, Xn)
        ])) : mt("", !0)
      ])) : mt("", !0),
      Je("div", {
        class: "ui-canvas__stage",
        ref_key: "hostEl",
        ref: m,
        onDblclick: Jt
      }, [
        Je("canvas", {
          ref_key: "canvasRef",
          ref: l,
          tabindex: "0",
          class: Xe(["ui-canvas__surface", { "ui-canvas__surface--readonly": !y.value }]),
          onPointerdown: Bt,
          onPointermove: zt,
          onPointerup: ft,
          onPointercancel: ft,
          onWheel: Wt,
          onContextmenu: Gt,
          onKeydown: Yt
        }, null, 34)
      ], 544)
    ], 4));
  }
}), Fn = (e, t) => {
  const o = e.__vccOpts || e;
  for (const [s, l] of t)
    o[s] = l;
  return o;
}, Zn = /* @__PURE__ */ Fn(Gn, [["__scopeId", "data-v-3bf70a84"]]);
export {
  Zn as default
};
