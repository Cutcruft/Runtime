import { defineComponent as lt, ref as P, computed as I, watch as Te, onMounted as it, onBeforeUnmount as st, openBlock as _, createElementBlock as M, normalizeStyle as Pe, Fragment as se, renderList as ce, normalizeClass as re, toDisplayString as Ie, unref as De, createElementVNode as ue, createCommentVNode as Re } from "vue";
import { i18nStore as ct, useCfg as rt, useData as ut, toasts as ze, subscribeEvent as ft, overlayService as vt, sessionStore as dt, resolveParams as yt } from "@cutcrft/runtime-client";
const ht = {
  key: 0,
  class: "ui-canvas__toolbar"
}, pt = ["title", "onClick"], xt = {
  key: 0,
  class: "ui-canvas__palette"
}, mt = ["title", "onClick"], gt = ["value"], wt = ["value"], kt = 50, bt = /* @__PURE__ */ lt({
  __name: "UiCanvas",
  props: {
    config: {},
    context: {}
  },
  setup(U) {
    const R = U, d = ct.t, v = rt(R.config, {
      colors: ["#111827", "#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"],
      widths: [2, 4, 8],
      grid: !1,
      strokeWidth: 4,
      tool: "draw"
    }), y = P(null), Q = P(null), x = I(() => !v.value.readonly && v.value.disabled !== !0), fe = I(() => v.value.height), ve = I(() => v.value.id), Be = I(() => v.value.content), { value: Ke, error: de } = ut(
      () => Be.value,
      () => R.context ?? {}
    ), r = P([]);
    let i = -1, Z = v.value.strokeColor ?? "#111827", H = v.value.strokeWidth ?? 4;
    const h = P(v.value.tool ?? "draw"), p = P(null), u = { x: 0, y: 0, scale: 1 };
    let w = 1, z = !1, L = !1, A = !1, O = !1, F = { x: 0, y: 0 }, ee = { x: 0, y: 0 }, B = !1, m = [], k = null, $ = null, K = -1, ye = !1, Y = null, o = null, E = null, he = 0, J = null, C = [], D = [];
    const pe = P(!1), xe = P(!1);
    function te() {
      return he += 1, `el_${Date.now().toString(36)}_${he}`;
    }
    const Ye = ["select", "pan", "draw", "erase", "rect", "ellipse", "line", "arrow", "clear"], me = I(() => v.value.toolbar === !1 ? [] : v.value.toolbar ?? Ye), Ee = I(() => v.value.colors ?? ["#111827", "#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"]), We = I(() => v.value.widths ?? [2, 4, 8]);
    function g() {
      var e;
      !x.value || !((e = v.value.save) != null && e.command) || (Y && clearTimeout(Y), Y = setTimeout(() => {
        Ne();
      }, 600));
    }
    function Xe() {
      const e = { elements: r.value };
      return JSON.stringify(e);
    }
    async function Ne() {
      var n;
      if (!((n = v.value.save) != null && n.command)) return;
      const e = { ...v.value.save.params ?? {}, content: Xe() };
      try {
        await dt.executeCommand(v.value.save.command, yt(e, R.context ?? {})), ze.push({ message: d("core.editor.saved"), kind: "success" });
      } catch {
      }
    }
    function Ue(e) {
      r.value = (e.elements ?? []).map((n) => n.id ? n : { ...n, id: te() }), i = -1, C = [], D = [], V(), f();
    }
    function ne() {
      return r.value.map((e) => ({ ...e, points: e.points.map((n) => ({ ...n })) }));
    }
    function V() {
      pe.value = C.length > 0, xe.value = D.length > 0;
    }
    function b(e) {
      const n = ne();
      e && i >= 0 && n[i] && (n[i] = { ...n[i], points: e.map((t) => ({ x: t.x, y: t.y })) }), C.push(n), C.length > kt && C.shift(), D.length = 0, V();
    }
    function ae() {
      !x.value || C.length === 0 || (D.push(ne()), r.value = C.pop() ?? [], i = -1, V(), g(), f());
    }
    function G() {
      !x.value || D.length === 0 || (C.push(ne()), r.value = D.pop() ?? [], i = -1, V(), g(), f());
    }
    Te(
      () => Ke.value,
      (e) => {
        if (!(e == null || ye))
          try {
            Ue(JSON.parse(String(e))), ye = !0;
          } catch {
          }
      }
    );
    function ge(e) {
      var t;
      const n = ((t = y.value) == null ? void 0 : t.getBoundingClientRect()) ?? { left: 0, top: 0 };
      return {
        x: (e.clientX - n.left - u.x) / u.scale,
        y: (e.clientY - n.top - u.y) / u.scale
      };
    }
    function we() {
      const e = y.value;
      if (!e) return;
      w = window.devicePixelRatio || 1;
      const n = e.getBoundingClientRect();
      e.width = Math.max(1, Math.round(n.width * w)), e.height = Math.max(1, Math.round(n.height * w)), o = e.getContext("2d"), f();
    }
    function f() {
      if (!o || !y.value) return;
      o.setTransform(w, 0, 0, w, 0, 0), o.clearRect(0, 0, y.value.width / w, y.value.height / w);
      const e = v.value.background ?? "#ffffff";
      o.fillStyle = e, o.fillRect(0, 0, y.value.width / w, y.value.height / w), o.save(), o.translate(u.x, u.y), o.scale(u.scale, u.scale), v.value.grid && He();
      for (let n = 0; n < r.value.length; n++)
        ke(r.value[n], n === i);
      if (p.value && ke(p.value, !1), x.value && h.value === "select" && i >= 0) {
        const n = W(r.value[i]);
        n && Ae(n);
      }
      o.restore();
    }
    function He() {
      var s, c;
      if (!o) return;
      const e = 20, n = { x: -u.x / u.scale, y: -u.y / u.scale, w: (((s = y.value) == null ? void 0 : s.width) ?? 0) / u.scale, h: (((c = y.value) == null ? void 0 : c.height) ?? 0) / u.scale };
      o.strokeStyle = "#eef2f7", o.lineWidth = 1 / u.scale, o.beginPath();
      const t = Math.floor(n.x / e) * e, a = Math.floor(n.y / e) * e;
      for (let l = t; l <= n.x + n.w; l += e)
        o.moveTo(l, n.y), o.lineTo(l, n.y + n.h);
      for (let l = a; l <= n.y + n.h; l += e)
        o.moveTo(n.x, l), o.lineTo(n.x + n.w, l);
      o.stroke();
    }
    function ke(e, n) {
      if (o) {
        if (o.strokeStyle = e.color, o.fillStyle = e.color, o.lineWidth = e.width, o.lineCap = "round", o.lineJoin = "round", e.type === "path") {
          const t = o;
          t.beginPath(), e.points.forEach((a, s) => s === 0 ? t.moveTo(a.x, a.y) : t.lineTo(a.x, a.y)), t.stroke();
        } else if (e.type === "rect")
          e.points.length >= 2 && o.strokeRect(e.points[0].x, e.points[0].y, e.points[1].x - e.points[0].x, e.points[1].y - e.points[0].y);
        else if (e.type === "ellipse")
          e.points.length >= 2 && (o.beginPath(), o.ellipse(
            (e.points[0].x + e.points[1].x) / 2,
            (e.points[0].y + e.points[1].y) / 2,
            Math.abs(e.points[1].x - e.points[0].x) / 2,
            Math.abs(e.points[1].y - e.points[0].y) / 2,
            0,
            0,
            Math.PI * 2
          ), o.stroke());
        else if ((e.type === "line" || e.type === "arrow") && e.points.length >= 2) {
          const [t, a] = e.points;
          if (o.beginPath(), o.moveTo(t.x, t.y), o.lineTo(a.x, a.y), o.stroke(), e.type === "arrow") {
            const s = Math.atan2(a.y - t.y, a.x - t.x), c = Math.max(8, e.width * 3);
            o.beginPath(), o.moveTo(a.x, a.y), o.lineTo(a.x - c * Math.cos(s - Math.PI / 6), a.y - c * Math.sin(s - Math.PI / 6)), o.moveTo(a.x, a.y), o.lineTo(a.x - c * Math.cos(s + Math.PI / 6), a.y - c * Math.sin(s + Math.PI / 6)), o.stroke();
          }
        }
        if (n) {
          const t = W(e);
          t && (o.strokeStyle = "#3b82f6", o.lineWidth = 1.5 / u.scale, o.setLineDash([6 / u.scale, 4 / u.scale]), o.strokeRect(t.x, t.y, t.w, t.h), o.setLineDash([]));
        }
      }
    }
    function W(e) {
      if (!e.points.length) return null;
      let n = 1 / 0, t = 1 / 0, a = -1 / 0, s = -1 / 0;
      for (const l of e.points)
        n = Math.min(n, l.x), t = Math.min(t, l.y), a = Math.max(a, l.x), s = Math.max(s, l.y);
      const c = e.width + 4;
      return { x: n - c, y: t - c, w: a - n + c * 2, h: s - t + c * 2 };
    }
    const Le = {
      nw: "nwse-resize",
      n: "ns-resize",
      ne: "nesw-resize",
      e: "ew-resize",
      se: "nwse-resize",
      s: "ns-resize",
      sw: "nesw-resize",
      w: "ew-resize"
    };
    function be(e) {
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
    function _e(e) {
      if (i < 0) return null;
      const n = r.value[i];
      if (!n || n.points.length < 2) return null;
      const t = W(n);
      if (!t) return null;
      for (const a of be(t))
        if (Math.hypot((a.x - e.x) * u.scale, (a.y - e.y) * u.scale) <= 9) return a.id;
      return null;
    }
    function Ae(e) {
      if (!o) return;
      const n = 6 / u.scale;
      o.strokeStyle = "#3b82f6", o.lineWidth = 1.5 / u.scale, o.fillStyle = "#ffffff";
      for (const t of be(e))
        o.fillRect(t.x - n / 2, t.y - n / 2, n, n), o.strokeRect(t.x - n / 2, t.y - n / 2, n, n);
    }
    function Oe(e) {
      const n = y.value;
      if (!n) return;
      if (h.value !== "select") {
        n.style.cursor = "crosshair";
        return;
      }
      const t = _e(e);
      if (t) {
        n.style.cursor = Le[t];
        return;
      }
      n.style.cursor = oe(e) >= 0 ? "move" : "crosshair";
    }
    function Me(e, n, t) {
      const a = t.x - n.x, s = t.y - n.y, c = a * a + s * s;
      let l = c === 0 ? 0 : ((e.x - n.x) * a + (e.y - n.y) * s) / c;
      return l = Math.max(0, Math.min(1, l)), Math.hypot(e.x - (n.x + l * a), e.y - (n.y + l * s));
    }
    function oe(e) {
      for (let n = r.value.length - 1; n >= 0; n--) {
        const t = r.value[n];
        if (t.type === "path") {
          for (let a = 1; a < t.points.length; a++)
            if (Me(e, t.points[a - 1], t.points[a]) <= t.width / 2 + 4) return n;
        } else if (t.type === "line" || t.type === "arrow") {
          if (t.points.length >= 2 && Me(e, t.points[0], t.points[1]) <= t.width / 2 + 4) return n;
        } else {
          const a = W(t);
          if (a && e.x >= a.x && e.x <= a.x + a.w && e.y >= a.y && e.y <= a.y + a.h) return n;
        }
      }
      return -1;
    }
    function Fe(e) {
      const n = Math.max(8, H * 1.5);
      let t = !1;
      for (let a = r.value.length - 1; a >= 0; a--)
        r.value[a].points.some((l) => Math.hypot(l.x - e.x, l.y - e.y) <= n) && (r.value.splice(a, 1), t = !0);
      return t && (i >= r.value.length && (i = -1), g()), t;
    }
    function $e() {
      if (p.value) {
        const e = p.value;
        e.points.length >= 2 && (b(), e.id = te(), r.value.push(e), i = -1, g());
      }
      p.value = null;
    }
    function Je(e) {
      var t;
      if (!x.value) return;
      K = e.pointerId, (t = y.value) == null || t.setPointerCapture(K), F = { x: e.clientX, y: e.clientY };
      const n = ge(e);
      if (h.value === "pan") {
        O = !0;
        return;
      }
      if (h.value === "select") {
        if (i >= 0) {
          const s = _e(n), c = W(r.value[i]);
          if (s && c) {
            A = !0, k = s, $ = c, m = r.value[i].points.map((l) => ({ ...l }));
            return;
          }
        }
        const a = oe(n);
        i = a, L = a >= 0, ee = n, B = !1, a >= 0 && (m = r.value[a].points.map((s) => ({ ...s }))), f();
        return;
      }
      if (h.value === "erase") {
        Fe(n), f();
        return;
      }
      z = !0, p.value = {
        type: h.value === "draw" ? "path" : h.value,
        points: [n],
        color: Z,
        width: H
      };
    }
    function Ve(e) {
      const n = ge(e);
      if (O) {
        u.x += e.clientX - F.x, u.y += e.clientY - F.y, F = { x: e.clientX, y: e.clientY }, f();
        return;
      }
      if (A && k && $ && i >= 0) {
        const t = $;
        let a = t.x, s = t.y, c = t.w, l = t.h;
        switch (k) {
          case "nw":
            a = n.x, s = n.y, c = t.x + t.w - n.x, l = t.y + t.h - n.y;
            break;
          case "n":
            s = n.y, l = t.y + t.h - n.y;
            break;
          case "ne":
            s = n.y, c = n.x - t.x, l = t.y + t.h - n.y;
            break;
          case "e":
            c = n.x - t.x;
            break;
          case "se":
            c = n.x - t.x, l = n.y - t.y;
            break;
          case "s":
            l = n.y - t.y;
            break;
          case "sw":
            a = n.x, c = t.x + t.w - n.x, l = n.y - t.y;
            break;
          case "w":
            a = n.x, c = t.x + t.w - n.x;
            break;
        }
        const T = r.value[i], j = e.shiftKey, N = t.w / t.h;
        j && !Number.isNaN(N) && isFinite(N) && (k === "n" || k === "s" ? c = l * N : l = c / N, k === "n" && (s = t.y + t.h - l), k === "s" && l < 0 && (s = t.y + t.h), k === "w" && (a = t.x + t.w - c)), c === 0 && (c = 1), l === 0 && (l = 1);
        const q = c / t.w, ot = l / t.h;
        T.points = m.map((Se) => ({ x: a + (Se.x - t.x) * q, y: s + (Se.y - t.y) * ot })), f();
        return;
      }
      if (L && i >= 0) {
        const t = n.x - ee.x, a = n.y - ee.y;
        (t !== 0 || a !== 0) && (B = !0);
        const s = r.value[i];
        s.points = m.map((c) => ({ x: c.x + t, y: c.y + a })), f();
        return;
      }
      if (z && p.value) {
        if (p.value.type === "path") {
          const t = p.value.points[p.value.points.length - 1];
          Math.hypot(n.x - t.x, n.y - t.y) > 1 && p.value.points.push(n);
        } else
          p.value.points[1] = n;
        f();
      } else h.value === "select" && !z && Oe(n);
    }
    function Ce() {
      var e;
      if (K >= 0 && ((e = y.value) == null || e.releasePointerCapture(K), K = -1), z && (z = !1, $e()), A) {
        if (A = !1, k = null, $ = null, m.length > 0) {
          const n = i >= 0 ? r.value[i] : void 0;
          (!n || n.points.length !== m.length || n.points.some((a, s) => a.x !== m[s].x || a.y !== m[s].y)) && b(m), m = [];
        }
        g(), B = !1;
      }
      O && (O = !1), L && (L = !1, B && (b(m), g()), B = !1, m = []), f();
    }
    function Ge(e) {
      var T;
      e.preventDefault();
      const n = ((T = y.value) == null ? void 0 : T.getBoundingClientRect()) ?? { left: 0, top: 0 }, t = e.clientX - n.left, a = e.clientY - n.top, s = e.deltaY < 0 ? 1.12 : 0.89, c = Math.min(8, Math.max(0.1, u.scale * s)), l = c / u.scale;
      u.x = t - (t - u.x) * l, u.y = a - (a - u.y) * l, u.scale = c, f();
    }
    function je(e) {
      if (x.value) {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
          e.preventDefault(), e.shiftKey ? G() : ae();
          return;
        }
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "y") {
          e.preventDefault(), G();
          return;
        }
        if ((e.metaKey || e.ctrlKey) && e.key === "]") {
          e.preventDefault(), le();
          return;
        }
        if ((e.metaKey || e.ctrlKey) && e.key === "[") {
          e.preventDefault(), ie();
          return;
        }
        (e.key === "Delete" || e.key === "Backspace") && i >= 0 && (e.preventDefault(), b(), r.value.splice(i, 1), i = -1, g(), f());
      }
    }
    function S(e) {
      h.value = e;
    }
    function qe(e) {
      Z = e;
    }
    function Qe(e) {
      H = e;
    }
    function Ze() {
      x.value && r.value.length !== 0 && (b(), r.value = [], i = -1, p.value = null, g(), f());
    }
    function le() {
      if (i < 0 || i >= r.value.length) return;
      b();
      const e = r.value.splice(i, 1)[0];
      r.value.push(e), i = r.value.length - 1, g(), f();
    }
    function ie() {
      if (i < 0 || i >= r.value.length) return;
      b();
      const e = r.value.splice(i, 1)[0];
      r.value.unshift(e), i = 0, g(), f();
    }
    function et() {
      u.x = 0, u.y = 0, u.scale = 1, f();
    }
    function tt() {
      if (i < 0 || i >= r.value.length) return;
      b();
      const e = r.value[i], n = {
        id: te(),
        type: e.type,
        points: e.points.map((t) => ({ x: t.x + 16, y: t.y + 16 })),
        color: e.color,
        width: e.width
      };
      r.value.push(n), i = r.value.length - 1, g(), f();
    }
    function nt(e) {
      var l;
      if (!x.value) return;
      const n = ((l = y.value) == null ? void 0 : l.getBoundingClientRect()) ?? { left: 0, top: 0 }, t = {
        x: (e.clientX - n.left - u.x) / u.scale,
        y: (e.clientY - n.top - u.y) / u.scale
      }, a = oe(t);
      if (a < 0) return;
      i = a, f();
      const s = r.value[a];
      vt.onGesture({
        event: "contextmenu",
        componentType: "Canvas2D",
        objectType: "canvas.element",
        componentId: ve.value,
        row: { id: s.id, type: s.type },
        x: e.clientX,
        y: e.clientY
      }) && e.preventDefault();
    }
    function at(e) {
      var a;
      if (e.editor !== "canvas" || e.componentId && e.componentId !== ve.value || !x.value) return;
      if (e.command === "undo") {
        ae();
        return;
      }
      if (e.command === "redo") {
        G();
        return;
      }
      const n = (a = e.params) == null ? void 0 : a.id, t = n ? r.value.findIndex((s) => s.id === n) : -1;
      if (!(t < 0))
        switch (i = t, e.command) {
          case "delete":
            b(), r.value.splice(t, 1), i = -1, g(), f();
            break;
          case "duplicate":
            tt();
            break;
          case "front":
            le();
            break;
          case "back":
            ie();
            break;
        }
    }
    Te(x, (e) => {
      e || (p.value = null, f());
    }), it(() => {
      we(), E = new ResizeObserver(we), Q.value && E.observe(Q.value), de.value && ze.push({ message: de.value, kind: "error" }), J = ft((e) => {
        e.kind === "editor.command" && at(e.payload);
      });
    }), st(() => {
      Y && clearTimeout(Y), E == null || E.disconnect(), J == null || J();
    });
    const X = {
      select: { label: d("core.editor.canvas.select"), icon: "➤", action: () => S("select"), active: () => h.value === "select" },
      pan: { label: d("core.editor.canvas.pan"), icon: "✋", action: () => S("pan"), active: () => h.value === "pan" },
      draw: { label: d("core.editor.canvas.draw"), icon: "✏", action: () => S("draw"), active: () => h.value === "draw" },
      erase: { label: d("core.editor.canvas.erase"), icon: "⌫", action: () => S("erase"), active: () => h.value === "erase" },
      rect: { label: d("core.editor.canvas.rect"), icon: "▭", action: () => S("rect"), active: () => h.value === "rect" },
      ellipse: { label: d("core.editor.canvas.ellipse"), icon: "◯", action: () => S("ellipse"), active: () => h.value === "ellipse" },
      line: { label: d("core.editor.canvas.line"), icon: "╱", action: () => S("line"), active: () => h.value === "line" },
      arrow: { label: d("core.editor.canvas.arrow"), icon: "➔", action: () => S("arrow"), active: () => h.value === "arrow" },
      clear: { label: d("core.editor.canvas.clear"), icon: "∅", action: () => Ze() },
      undo: { label: d("core.editor.undo"), icon: "↩", action: () => ae(), disabled: () => !pe.value },
      redo: { label: d("core.editor.redo"), icon: "↪", action: () => G(), disabled: () => !xe.value },
      front: { label: d("core.editor.canvas.front"), icon: "⇡", action: () => le(), disabled: () => i < 0 },
      back: { label: d("core.editor.canvas.back"), icon: "⇣", action: () => ie(), disabled: () => i < 0 }
    };
    return (e, n) => (_(), M("div", {
      class: "ui-canvas",
      style: Pe(fe.value ? { height: fe.value } : void 0),
      "data-gesture-type": "Canvas2D"
    }, [
      me.value.length ? (_(), M("div", ht, [
        (_(!0), M(se, null, ce(me.value, (t) => {
          var a, s, c, l, T, j;
          return _(), M("button", {
            key: t,
            class: re(["ui-canvas__btn", { "ui-canvas__btn--active": (s = (a = X[t]) == null ? void 0 : a.active) == null ? void 0 : s.call(a), "ui-canvas__btn--disabled": !x.value && t !== "pan" || ((l = (c = X[t]) == null ? void 0 : c.disabled) == null ? void 0 : l.call(c)) }]),
            title: (T = X[t]) == null ? void 0 : T.label,
            onClick: (N) => {
              var q;
              return (q = X[t]) == null ? void 0 : q.action();
            }
          }, Ie((j = X[t]) == null ? void 0 : j.icon), 11, pt);
        }), 128)),
        x.value ? (_(), M("span", xt, [
          (_(!0), M(se, null, ce(Ee.value, (t) => (_(), M("button", {
            key: t,
            class: re(["ui-canvas__swatch", { "ui-canvas__swatch--active": t === De(Z) }]),
            style: Pe({ background: t }),
            title: t,
            onClick: (a) => qe(t)
          }, null, 14, mt))), 128)),
          ue("select", {
            class: "ui-canvas__width",
            value: De(H),
            onChange: n[0] || (n[0] = (t) => Qe(Number(t.target.value)))
          }, [
            (_(!0), M(se, null, ce(We.value, (t) => (_(), M("option", {
              key: t,
              value: t
            }, Ie(t), 9, wt))), 128))
          ], 40, gt)
        ])) : Re("", !0)
      ])) : Re("", !0),
      ue("div", {
        class: "ui-canvas__stage",
        ref_key: "hostEl",
        ref: Q,
        onDblclick: et
      }, [
        ue("canvas", {
          ref_key: "canvasRef",
          ref: y,
          tabindex: "0",
          class: re(["ui-canvas__surface", { "ui-canvas__surface--readonly": !x.value }]),
          onPointerdown: Je,
          onPointermove: Ve,
          onPointerup: Ce,
          onPointercancel: Ce,
          onWheel: Ge,
          onContextmenu: nt,
          onKeydown: je
        }, null, 34)
      ], 544)
    ], 4));
  }
}), _t = (U, R) => {
  const d = U.__vccOpts || U;
  for (const [v, y] of R)
    d[v] = y;
  return d;
}, St = /* @__PURE__ */ _t(bt, [["__scopeId", "data-v-4cd12d4d"]]);
export {
  St as default
};
