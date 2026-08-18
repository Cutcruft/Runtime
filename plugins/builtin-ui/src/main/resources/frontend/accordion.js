import { defineComponent as x, ref as b, watch as g, openBlock as c, createElementBlock as s, normalizeStyle as y, unref as i, normalizeClass as _, Fragment as f, renderList as m, createElementVNode as d, toDisplayString as k, withDirectives as w, createBlock as C, vShow as S } from "vue";
import { useCfg as A, ComponentHost as B, runAction as z, findAction as D } from "@cutcrft/runtime-client";
import { _ as E } from "./vendor.js";
const I = ["disabled", "aria-expanded", "onClick"], N = { class: "ui-accordion__label" }, U = { class: "ui-accordion__body" }, j = /* @__PURE__ */ x({
  __name: "UiAccordion",
  props: {
    config: {},
    context: {}
  },
  setup(l) {
    var u;
    const r = l, t = A(r.config, { items: [] }), a = b(
      new Set(
        ((u = t.value.items) == null ? void 0 : u.filter((e) => e.open).map((e) => e.id)) ?? []
      )
    );
    g(
      () => {
        var e;
        return (e = t.value.items) == null ? void 0 : e.map((o) => o.id).join(",");
      },
      () => {
        const e = /* @__PURE__ */ new Set();
        for (const o of t.value.items ?? []) o.open && e.add(o.id);
        a.value = e;
      }
    );
    function v(e) {
      const o = new Set(a.value);
      o.has(e) ? o.delete(e) : o.add(e), a.value = o, z(D(t.value.actions, "change"), { ...r.context ?? {}, payload: { id: e } });
    }
    return (e, o) => (c(), s("div", {
      class: _(["ui-accordion", i(t).className]),
      style: y(i(t).style)
    }, [
      (c(!0), s(f, null, m(i(t).items, (n) => (c(), s("div", {
        key: n.id,
        class: "ui-accordion__item"
      }, [
        d("button", {
          class: _(["ui-accordion__header", { "ui-accordion__header--open": a.value.has(n.id), "ui-accordion__header--disabled": n.disabled }]),
          disabled: n.disabled,
          "aria-expanded": a.value.has(n.id),
          onClick: (p) => v(n.id)
        }, [
          o[0] || (o[0] = d("span", { class: "ui-accordion__caret" }, "▸", -1)),
          d("span", N, k(n.label), 1)
        ], 10, I),
        w(d("div", U, [
          (c(!0), s(f, null, m(n.components ?? [], (p, h) => (c(), C(i(B), {
            key: h,
            component: p,
            context: l.context
          }, null, 8, ["component", "context"]))), 128))
        ], 512), [
          [S, a.value.has(n.id)]
        ])
      ]))), 128))
    ], 6));
  }
}), V = /* @__PURE__ */ E(j, [["__scopeId", "data-v-e7b01232"]]);
export {
  V as default
};
