import { defineComponent as B, ref as p, computed as U, openBlock as u, createElementBlock as i, unref as t, normalizeStyle as H, normalizeClass as f, toDisplayString as v, Fragment as m, renderList as A, createVNode as O, createElementVNode as Q, createCommentVNode as E } from "vue";
import { C as j } from "./vendor.js";
import { i18nStore as x, useContainerQuery as G, useCfg as J, useData as M, formatValue as N, runAction as P, findAction as R } from "@cutcrft/runtime-client";
import { _ as W } from "./vendor2.js";
const X = ["title"], Y = {
  key: 0,
  class: "ui-list__state"
}, Z = {
  key: 1,
  class: "ui-list__error"
}, ee = {
  key: 0,
  class: "ui-list__templated"
}, te = ["draggable", "onDragstart", "onDragover", "onDrop"], le = {
  key: 1,
  class: "ui-list__plain"
}, ae = ["draggable", "onDragstart", "onDragover", "onDrop"], oe = { class: "ui-list__label" }, re = {
  key: 0,
  class: "ui-list__value"
}, ne = {
  key: 2,
  class: "ui-list__state"
}, se = /* @__PURE__ */ B({
  __name: "UiList",
  props: {
    config: {},
    context: {}
  },
  setup(V) {
    const d = V, y = x.t, b = p(null), w = G(b), e = J(d.config, { labelField: "name", itemKey: "id" }), { value: D, error: h, loading: k } = M(
      () => e.value.data,
      () => d.context ?? {}
    ), c = U(
      () => Array.isArray(D.value) ? D.value : []
    ), s = p(null), _ = p(null);
    function I(o) {
      return e.value.labelField ? N(o[e.value.labelField]) : "";
    }
    function K(o) {
      return e.value.valueField ? N(o[e.value.valueField]) : "";
    }
    function g(o, a) {
      const r = e.value.itemKey;
      return String(r ? o[r] ?? a : a);
    }
    function T(o, a) {
      e.value.sortable && (s.value = o, a.dataTransfer && (a.dataTransfer.effectAllowed = "move", a.dataTransfer.setData("text/plain", String(o))));
    }
    function C(o, a) {
      !e.value.sortable || s.value === null || (a.preventDefault(), a.dataTransfer && (a.dataTransfer.dropEffect = "move"), _.value = o);
    }
    function F(o) {
      if (!e.value.sortable || s.value === null) return;
      const a = s.value, r = o;
      if (s.value = null, _.value = null, a === r) return;
      const l = c.value[a] ?? null, n = [...c.value], [L] = n.splice(a, 1);
      n.splice(r, 0, L);
      const $ = n.map((q, z) => g(q, z));
      P(R(e.value.actions, "reorder"), {
        ...d.context ?? {},
        payload: { from: a, to: r, row: l, ids: $ }
      });
    }
    function S() {
      s.value = null, _.value = null;
    }
    return (o, a) => (u(), i("div", {
      ref_key: "root",
      ref: b,
      class: f(["ui-list", [t(e).className, `ui-list--cq-${t(w)}`]]),
      style: H(t(e).style),
      title: t(e).tooltip
    }, [
      t(k) && c.value.length === 0 ? (u(), i("p", Y, v(t(y)("core.button.loading")), 1)) : t(h) ? (u(), i("p", Z, v(t(h)), 1)) : (u(), i(m, { key: 2 }, [
        t(e).itemTemplate ? (u(), i("ul", ee, [
          (u(!0), i(m, null, A(c.value, (r, l) => (u(), i("li", {
            key: g(r, l),
            draggable: t(e).sortable,
            class: f(["ui-list__drag", {
              "ui-list__drag--dragging": t(e).sortable && s.value === l,
              "ui-list__drag--over": t(e).sortable && _.value === l && s.value !== null && s.value !== l
            }]),
            onDragstart: (n) => T(l, n),
            onDragover: (n) => C(l, n),
            onDrop: (n) => F(l),
            onDragend: S
          }, [
            O(j, {
              component: t(e).itemTemplate,
              context: { ...d.context ?? {}, row: r }
            }, null, 8, ["component", "context"])
          ], 42, te))), 128))
        ])) : (u(), i("ul", le, [
          (u(!0), i(m, null, A(c.value, (r, l) => (u(), i("li", {
            key: g(r, l),
            draggable: t(e).sortable,
            class: f(["ui-list__row", {
              "ui-list__row--dragging": t(e).sortable && s.value === l,
              "ui-list__row--over": t(e).sortable && _.value === l && s.value !== null && s.value !== l
            }]),
            onDragstart: (n) => T(l, n),
            onDragover: (n) => C(l, n),
            onDrop: (n) => F(l),
            onDragend: S
          }, [
            Q("span", oe, v(I(r)), 1),
            t(e).valueField ? (u(), i("span", re, v(K(r)), 1)) : E("", !0)
          ], 42, ae))), 128))
        ])),
        !t(k) && c.value.length === 0 ? (u(), i("p", ne, v(t(e).emptyText ?? t(y)("core.table.empty")), 1)) : E("", !0)
      ], 64))
    ], 14, X));
  }
}), ve = /* @__PURE__ */ W(se, [["__scopeId", "data-v-f4bb41ee"]]);
export {
  ve as default
};
