import { jsxs as ae, jsx as T } from "preact/jsx-runtime";
import { computed as j, useSignal as W } from "@preact/signals";
import { useRef as ke, useEffect as ie } from "preact/hooks";
import { i18nStore as Qe, useCfg as Ze, useData as et, toasts as Me, subscribeEvent as tt, overlayService as nt, sessionStore as at, resolveParams as it } from "@cutcrft/plugin-sdk";
function rt(F) {
  const y = Qe.t, d = Ze(F.config, {
    colors: ["#111827", "#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"],
    widths: [2, 4, 8],
    grid: !1,
    strokeWidth: 4,
    tool: "draw"
  }), h = ke(null), J = ke(null), p = j(() => !d.value.readonly && d.value.disabled !== !0), le = j(() => d.value.height), oe = j(() => d.value.id), Ce = j(() => d.value.content), { value: se, error: ce } = et(() => Ce.value, () => F.context ?? {}), r = W([]);
  let o = -1, G = d.value.strokeColor ?? "#111827", X = d.value.strokeWidth ?? 4;
  const v = W(d.value.tool ?? "draw"), x = W(null), u = { x: 0, y: 0, scale: 1 };
  let b = 1, I = !1, B = !1, E = !1, N = !1, H = { x: 0, y: 0 }, q = { x: 0, y: 0 }, P = !1, m = [], k = null, $ = null, R = -1, re = !1, D = null, l = null, z = null, ue = 0, A = null;
  const Se = 50;
  let C = [], _ = [];
  const fe = W(!1), de = W(!1);
  function V() {
    return ue += 1, `el_${Date.now().toString(36)}_${ue}`;
  }
  const _e = ["select", "pan", "draw", "erase", "rect", "ellipse", "line", "arrow", "clear"], ve = d.value.toolbar === !1 ? [] : d.value.toolbar ?? _e, Te = d.value.colors ?? ["#111827", "#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"], Ie = d.value.widths ?? [2, 4, 8];
  function g() {
    var e;
    !p.value || !((e = d.value.save) != null && e.command) || (D && clearTimeout(D), D = setTimeout(() => {
      Re();
    }, 600));
  }
  function Pe() {
    const e = { elements: r.value };
    return JSON.stringify(e);
  }
  async function Re() {
    var t;
    if (!((t = d.value.save) != null && t.command)) return;
    const e = { ...d.value.save.params ?? {}, content: Pe() };
    try {
      await at.executeCommand(d.value.save.command, it(e, F.context ?? {})), Me.push({ message: y("core.editor.saved"), kind: "success" });
    } catch {
    }
  }
  function De(e) {
    r.value = (e.elements ?? []).map((t) => t.id ? t : { ...t, id: V() }), o = -1, C = [], _ = [], L(), f();
  }
  function Q() {
    return r.value.map((e) => ({ ...e, points: e.points.map((t) => ({ ...t })) }));
  }
  function L() {
    fe.value = C.length > 0, de.value = _.length > 0;
  }
  function M(e) {
    const t = Q();
    e && o >= 0 && t[o] && (t[o] = { ...t[o], points: e.map((n) => ({ x: n.x, y: n.y })) }), C.push(t), C.length > Se && C.shift(), _.length = 0, L();
  }
  function Z() {
    !p.value || C.length === 0 || (_.push(Q()), r.value = C.pop() ?? [], o = -1, L(), g(), f());
  }
  function U() {
    !p.value || _.length === 0 || (C.push(Q()), r.value = _.pop() ?? [], o = -1, L(), g(), f());
  }
  function he(e) {
    var n;
    const t = ((n = h.current) == null ? void 0 : n.getBoundingClientRect()) ?? { left: 0, top: 0 };
    return {
      x: (e.clientX - t.left - u.x) / u.scale,
      y: (e.clientY - t.top - u.y) / u.scale
    };
  }
  function ye() {
    const e = h.current;
    if (!e) return;
    b = window.devicePixelRatio || 1;
    const t = e.getBoundingClientRect();
    e.width = Math.max(1, Math.round(t.width * b)), e.height = Math.max(1, Math.round(t.height * b)), l = e.getContext("2d"), f();
  }
  function f() {
    if (!l || !h.current) return;
    l.setTransform(b, 0, 0, b, 0, 0), l.clearRect(0, 0, h.current.width / b, h.current.height / b);
    const e = d.value.background ?? "#ffffff";
    l.fillStyle = e, l.fillRect(0, 0, h.current.width / b, h.current.height / b), l.save(), l.translate(u.x, u.y), l.scale(u.scale, u.scale), d.value.grid && ze();
    for (let t = 0; t < r.value.length; t++)
      pe(r.value[t], t === o);
    if (x.value && pe(x.value, !1), p.value && v.value === "select" && o >= 0) {
      const t = Y(r.value[o]);
      t && Ke(t);
    }
    l.restore();
  }
  function ze() {
    var i, c;
    if (!l) return;
    const e = 20, t = { x: -u.x / u.scale, y: -u.y / u.scale, w: (((i = h.current) == null ? void 0 : i.width) ?? 0) / u.scale, h: (((c = h.current) == null ? void 0 : c.height) ?? 0) / u.scale };
    l.strokeStyle = "#eef2f7", l.lineWidth = 1 / u.scale, l.beginPath();
    const n = Math.floor(t.x / e) * e, a = Math.floor(t.y / e) * e;
    for (let s = n; s <= t.x + t.w; s += e)
      l.moveTo(s, t.y), l.lineTo(s, t.y + t.h);
    for (let s = a; s <= t.y + t.h; s += e)
      l.moveTo(t.x, s), l.lineTo(t.x + t.w, s);
    l.stroke();
  }
  function pe(e, t) {
    if (l) {
      if (l.strokeStyle = e.color, l.fillStyle = e.color, l.lineWidth = e.width, l.lineCap = "round", l.lineJoin = "round", e.type === "path") {
        const n = l;
        n.beginPath(), e.points.forEach((a, i) => i === 0 ? n.moveTo(a.x, a.y) : n.lineTo(a.x, a.y)), n.stroke();
      } else if (e.type === "rect")
        e.points.length >= 2 && l.strokeRect(e.points[0].x, e.points[0].y, e.points[1].x - e.points[0].x, e.points[1].y - e.points[0].y);
      else if (e.type === "ellipse")
        e.points.length >= 2 && (l.beginPath(), l.ellipse(
          (e.points[0].x + e.points[1].x) / 2,
          (e.points[0].y + e.points[1].y) / 2,
          Math.abs(e.points[1].x - e.points[0].x) / 2,
          Math.abs(e.points[1].y - e.points[0].y) / 2,
          0,
          0,
          Math.PI * 2
        ), l.stroke());
      else if ((e.type === "line" || e.type === "arrow") && e.points.length >= 2) {
        const [n, a] = e.points;
        if (l.beginPath(), l.moveTo(n.x, n.y), l.lineTo(a.x, a.y), l.stroke(), e.type === "arrow") {
          const i = Math.atan2(a.y - n.y, a.x - n.x), c = Math.max(8, e.width * 3);
          l.beginPath(), l.moveTo(a.x, a.y), l.lineTo(a.x - c * Math.cos(i - Math.PI / 6), a.y - c * Math.sin(i - Math.PI / 6)), l.moveTo(a.x, a.y), l.lineTo(a.x - c * Math.cos(i + Math.PI / 6), a.y - c * Math.sin(i + Math.PI / 6)), l.stroke();
        }
      }
      if (t) {
        const n = Y(e);
        n && (l.strokeStyle = "#3b82f6", l.lineWidth = 1.5 / u.scale, l.setLineDash([6 / u.scale, 4 / u.scale]), l.strokeRect(n.x, n.y, n.w, n.h), l.setLineDash([]));
      }
    }
  }
  function Y(e) {
    if (!e.points.length) return null;
    let t = 1 / 0, n = 1 / 0, a = -1 / 0, i = -1 / 0;
    for (const s of e.points)
      t = Math.min(t, s.x), n = Math.min(n, s.y), a = Math.max(a, s.x), i = Math.max(i, s.y);
    const c = e.width + 4;
    return { x: t - c, y: n - c, w: a - t + c * 2, h: i - n + c * 2 };
  }
  const Ye = {
    nw: "nwse-resize",
    n: "ns-resize",
    ne: "nesw-resize",
    e: "ew-resize",
    se: "nwse-resize",
    s: "ns-resize",
    sw: "nesw-resize",
    w: "ew-resize"
  };
  function xe(e) {
    return [
      { id: "nw", x: e.x, y: e.y },
      { id: "n", x: e.x + e.w / 2, y: e.y },
      { id: "ne", x: e.x + e.w, y: e.y },
      { id: "e", x: e.x + e.w, y: e.y + e.h / 2 },
      { id: "se", x: e.x + e.w, y: e.y + e.h },
      { id: "s", x: e.x + e.w / 2, y: e.y + e.h },
      { id: "sw", x: e.x, y: e.y + e.h },
      { id: "w", x: e.x, y: e.y + e.h / 2 }
    ];
  }
  function me(e) {
    if (o < 0) return null;
    const t = r.value[o];
    if (!t || t.points.length < 2) return null;
    const n = Y(t);
    if (!n) return null;
    for (const a of xe(n))
      if (Math.hypot((a.x - e.x) * u.scale, (a.y - e.y) * u.scale) <= 9) return a.id;
    return null;
  }
  function Ke(e) {
    if (!l) return;
    const t = 6 / u.scale;
    l.strokeStyle = "#3b82f6", l.lineWidth = 1.5 / u.scale, l.fillStyle = "#ffffff";
    for (const n of xe(e))
      l.fillRect(n.x - t / 2, n.y - t / 2, t, t), l.strokeRect(n.x - t / 2, n.y - t / 2, t, t);
  }
  function We(e) {
    const t = h.current;
    if (!t) return;
    if (v.value !== "select") {
      t.style.cursor = "crosshair";
      return;
    }
    const n = me(e);
    if (n) {
      t.style.cursor = Ye[n];
      return;
    }
    t.style.cursor = ee(e) >= 0 ? "move" : "crosshair";
  }
  function ge(e, t, n) {
    const a = n.x - t.x, i = n.y - t.y, c = a * a + i * i;
    let s = c === 0 ? 0 : ((e.x - t.x) * a + (e.y - t.y) * i) / c;
    return s = Math.max(0, Math.min(1, s)), Math.hypot(e.x - (t.x + s * a), e.y - (t.y + s * i));
  }
  function ee(e) {
    for (let t = r.value.length - 1; t >= 0; t--) {
      const n = r.value[t];
      if (n.type === "path") {
        for (let a = 1; a < n.points.length; a++)
          if (ge(e, n.points[a - 1], n.points[a]) <= n.width / 2 + 4) return t;
      } else if (n.type === "line" || n.type === "arrow") {
        if (n.points.length >= 2 && ge(e, n.points[0], n.points[1]) <= n.width / 2 + 4) return t;
      } else {
        const a = Y(n);
        if (a && e.x >= a.x && e.x <= a.x + a.w && e.y >= a.y && e.y <= a.y + a.h) return t;
      }
    }
    return -1;
  }
  function Xe(e) {
    const t = Math.max(8, X * 1.5);
    let n = !1;
    const a = [...r.value];
    for (let i = a.length - 1; i >= 0; i--)
      a[i].points.some((w) => Math.hypot(w.x - e.x, w.y - e.y) <= t) && (a.splice(i, 1), n = !0);
    return n && (r.value = a, o >= r.value.length && (o = -1), g()), n;
  }
  function Be() {
    if (x.value) {
      const e = x.value;
      if (e.points.length >= 2) {
        M(), e.id = V();
        const t = [...r.value, e];
        r.value = t, o = -1, g();
      }
    }
    x.value = null;
  }
  function Ee(e) {
    var n;
    if (!p.value) return;
    R = e.pointerId, (n = h.current) == null || n.setPointerCapture(R), H = { x: e.clientX, y: e.clientY };
    const t = he(e);
    if (v.value === "pan") {
      N = !0;
      return;
    }
    if (v.value === "select") {
      if (o >= 0) {
        const i = me(t), c = Y(r.value[o]);
        if (i && c) {
          E = !0, k = i, $ = c, m = r.value[o].points.map((s) => ({ ...s }));
          return;
        }
      }
      const a = ee(t);
      o = a, B = a >= 0, q = t, P = !1, a >= 0 && (m = r.value[a].points.map((i) => ({ ...i }))), f();
      return;
    }
    if (v.value === "erase") {
      Xe(t), f();
      return;
    }
    I = !0, x.value = {
      type: v.value === "draw" ? "path" : v.value,
      points: [t],
      color: G,
      width: X
    };
  }
  function Ne(e) {
    const t = he(e);
    if (N) {
      u.x += e.clientX - H.x, u.y += e.clientY - H.y, H = { x: e.clientX, y: e.clientY }, f();
      return;
    }
    if (E && k && $ && o >= 0) {
      const n = $;
      let a = n.x, i = n.y, c = n.w, s = n.h;
      switch (k) {
        case "nw":
          a = t.x, i = t.y, c = n.x + n.w - t.x, s = n.y + n.h - t.y;
          break;
        case "n":
          i = t.y, s = n.y + n.h - t.y;
          break;
        case "ne":
          i = t.y, c = t.x - n.x, s = n.y + n.h - t.y;
          break;
        case "e":
          c = t.x - n.x;
          break;
        case "se":
          c = t.x - n.x, s = t.y - n.y;
          break;
        case "s":
          s = t.y - n.y;
          break;
        case "sw":
          a = t.x, c = n.x + n.w - t.x, s = t.y - n.y;
          break;
        case "w":
          a = t.x, c = n.x + n.w - t.x;
          break;
      }
      const w = r.value[o], Ge = e.shiftKey, O = n.w / n.h;
      Ge && !Number.isNaN(O) && isFinite(O) && (k === "n" || k === "s" ? c = s * O : s = c / O, k === "n" && (i = n.y + n.h - s), k === "s" && s < 0 && (i = n.y + n.h), k === "w" && (a = n.x + n.w - c)), c === 0 && (c = 1), s === 0 && (s = 1);
      const qe = c / n.w, Ve = s / n.h;
      w.points = m.map((be) => ({ x: a + (be.x - n.x) * qe, y: i + (be.y - n.y) * Ve })), f();
      return;
    }
    if (B && o >= 0) {
      const n = t.x - q.x, a = t.y - q.y;
      (n !== 0 || a !== 0) && (P = !0);
      const i = r.value[o];
      i.points = m.map((c) => ({ x: c.x + n, y: c.y + a })), f();
      return;
    }
    if (I && x.value) {
      if (x.value.type === "path") {
        const n = x.value.points[x.value.points.length - 1];
        Math.hypot(t.x - n.x, t.y - n.y) > 1 && x.value.points.push(t);
      } else
        x.value.points[1] = t;
      f();
    } else v.value === "select" && !I && We(t);
  }
  function we() {
    var e;
    if (R >= 0 && ((e = h.current) == null || e.releasePointerCapture(R), R = -1), I && (I = !1, Be()), E) {
      if (E = !1, k = null, $ = null, m.length > 0) {
        const t = o >= 0 ? r.value[o] : void 0;
        (!t || t.points.length !== m.length || t.points.some((a, i) => a.x !== m[i].x || a.y !== m[i].y)) && M(m), m = [];
      }
      g(), P = !1;
    }
    N && (N = !1), B && (B = !1, P && (M(m), g()), P = !1, m = []), f();
  }
  function He(e) {
    var w;
    e.preventDefault();
    const t = ((w = h.current) == null ? void 0 : w.getBoundingClientRect()) ?? { left: 0, top: 0 }, n = e.clientX - t.left, a = e.clientY - t.top, i = e.deltaY < 0 ? 1.12 : 0.89, c = Math.min(8, Math.max(0.1, u.scale * i)), s = c / u.scale;
    u.x = n - (n - u.x) * s, u.y = a - (a - u.y) * s, u.scale = c, f();
  }
  function $e(e) {
    if (p.value) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
        e.preventDefault(), e.shiftKey ? U() : Z();
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "y") {
        e.preventDefault(), U();
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "]") {
        e.preventDefault(), te();
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "[") {
        e.preventDefault(), ne();
        return;
      }
      if ((e.key === "Delete" || e.key === "Backspace") && o >= 0) {
        e.preventDefault(), M();
        const t = [...r.value];
        t.splice(o, 1), r.value = t, o = -1, g(), f();
      }
    }
  }
  function S(e) {
    v.value = e;
  }
  function Ae(e) {
    G = e;
  }
  function Le(e) {
    X = e;
  }
  function Ue() {
    p.value && r.value.length !== 0 && (M(), r.value = [], o = -1, x.value = null, g(), f());
  }
  function te() {
    if (o < 0 || o >= r.value.length) return;
    M();
    const e = [...r.value], t = e.splice(o, 1)[0];
    e.push(t), r.value = e, o = e.length - 1, g(), f();
  }
  function ne() {
    if (o < 0 || o >= r.value.length) return;
    M();
    const e = [...r.value], t = e.splice(o, 1)[0];
    e.unshift(t), r.value = e, o = 0, g(), f();
  }
  function Oe() {
    u.x = 0, u.y = 0, u.scale = 1, f();
  }
  function je() {
    if (o < 0 || o >= r.value.length) return;
    M();
    const e = r.value[o], t = {
      id: V(),
      type: e.type,
      points: e.points.map((a) => ({ x: a.x + 16, y: a.y + 16 })),
      color: e.color,
      width: e.width
    }, n = [...r.value, t];
    r.value = n, o = n.length - 1, g(), f();
  }
  function Fe(e) {
    var s;
    if (!p.value) return;
    const t = ((s = h.current) == null ? void 0 : s.getBoundingClientRect()) ?? { left: 0, top: 0 }, n = { x: (e.clientX - t.left - u.x) / u.scale, y: (e.clientY - t.top - u.y) / u.scale }, a = ee(n);
    if (a < 0) return;
    o = a, f();
    const i = r.value[a];
    nt.onGesture({
      event: "contextmenu",
      componentType: "Canvas2D",
      objectType: "canvas.element",
      componentId: oe.value,
      row: { id: i.id, type: i.type },
      x: e.clientX,
      y: e.clientY
    }) && e.preventDefault();
  }
  function Je(e) {
    var a;
    if (e.editor !== "canvas" || e.componentId && e.componentId !== oe.value || !p.value) return;
    if (e.command === "undo") {
      Z();
      return;
    }
    if (e.command === "redo") {
      U();
      return;
    }
    const t = (a = e.params) == null ? void 0 : a.id, n = t ? r.value.findIndex((i) => i.id === t) : -1;
    if (!(n < 0))
      switch (o = n, e.command) {
        case "delete":
          M();
          const i = [...r.value];
          i.splice(n, 1), r.value = i, o = -1, g(), f();
          break;
        case "duplicate":
          je();
          break;
        case "front":
          te();
          break;
        case "back":
          ne();
          break;
      }
  }
  ie(() => {
    const e = se.value;
    if (!(e == null || re))
      try {
        De(JSON.parse(String(e))), re = !0;
      } catch {
      }
  }, [se.value]), ie(() => (ye(), z = new ResizeObserver(ye), J.current && z.observe(J.current), ce.value && Me.push({ message: ce.value, kind: "error" }), A = tt((e) => {
    e.kind === "editor.command" && Je(e.payload);
  }), () => {
    D && clearTimeout(D), z == null || z.disconnect(), A == null || A();
  }), []), ie(() => {
    p.value || (x.value = null, f());
  }, [p.value]);
  const K = {
    select: { label: y("core.editor.canvas.select"), icon: "➤", action: () => S("select"), active: () => v.value === "select" },
    pan: { label: y("core.editor.canvas.pan"), icon: "✋", action: () => S("pan"), active: () => v.value === "pan" },
    draw: { label: y("core.editor.canvas.draw"), icon: "✏", action: () => S("draw"), active: () => v.value === "draw" },
    erase: { label: y("core.editor.canvas.erase"), icon: "⌫", action: () => S("erase"), active: () => v.value === "erase" },
    rect: { label: y("core.editor.canvas.rect"), icon: "▭", action: () => S("rect"), active: () => v.value === "rect" },
    ellipse: { label: y("core.editor.canvas.ellipse"), icon: "◯", action: () => S("ellipse"), active: () => v.value === "ellipse" },
    line: { label: y("core.editor.canvas.line"), icon: "╱", action: () => S("line"), active: () => v.value === "line" },
    arrow: { label: y("core.editor.canvas.arrow"), icon: "➔", action: () => S("arrow"), active: () => v.value === "arrow" },
    clear: { label: y("core.editor.canvas.clear"), icon: "∅", action: () => Ue() },
    undo: { label: y("core.editor.undo"), icon: "↩", action: () => Z(), disabled: () => !fe.value },
    redo: { label: y("core.editor.redo"), icon: "↪", action: () => U(), disabled: () => !de.value },
    front: { label: y("core.editor.canvas.front"), icon: "⇡", action: () => te(), disabled: () => o < 0 },
    back: { label: y("core.editor.canvas.back"), icon: "⇣", action: () => ne(), disabled: () => o < 0 }
  };
  return /* @__PURE__ */ ae("div", { class: "ui-canvas", style: le.value ? { height: le.value } : void 0, "data-gesture-type": "Canvas2D", children: [
    ve.length ? /* @__PURE__ */ ae("div", { class: "ui-canvas__toolbar", children: [
      ve.map((e) => {
        var t, n, a, i, c, s;
        return /* @__PURE__ */ T(
          "button",
          {
            class: `ui-canvas__btn${(n = (t = K[e]) == null ? void 0 : t.active) != null && n.call(t) ? " ui-canvas__btn--active" : ""}${!p.value && e !== "pan" || (i = (a = K[e]) == null ? void 0 : a.disabled) != null && i.call(a) ? " ui-canvas__btn--disabled" : ""}`,
            title: (c = K[e]) == null ? void 0 : c.label,
            onClick: () => {
              var w;
              return (w = K[e]) == null ? void 0 : w.action();
            },
            children: (s = K[e]) == null ? void 0 : s.icon
          },
          e
        );
      }),
      p.value ? /* @__PURE__ */ ae("span", { class: "ui-canvas__palette", children: [
        Te.map((e) => /* @__PURE__ */ T(
          "button",
          {
            class: `ui-canvas__swatch${e === G ? " ui-canvas__swatch--active" : ""}`,
            style: { background: e },
            title: e,
            onClick: () => Ae(e)
          },
          e
        )),
        /* @__PURE__ */ T("select", { class: "ui-canvas__width", value: X, onChange: (e) => Le(Number(e.target.value)), children: Ie.map((e) => /* @__PURE__ */ T("option", { value: e, children: e }, e)) })
      ] }) : null
    ] }) : null,
    /* @__PURE__ */ T("div", { class: "ui-canvas__stage", ref: J, onDblClick: Oe, children: /* @__PURE__ */ T(
      "canvas",
      {
        ref: h,
        tabIndex: 0,
        class: `ui-canvas__surface${p.value ? "" : " ui-canvas__surface--readonly"}`,
        onPointerDown: Ee,
        onPointerMove: Ne,
        onPointerUp: we,
        onPointerCancel: we,
        onWheel: He,
        onContextMenu: Fe,
        onKeyDown: $e
      }
    ) })
  ] });
}
export {
  rt as default
};
