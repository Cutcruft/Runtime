import { defineComponent as x, ref as b, watch as g, openBlock as c, createElementBlock as s, normalizeStyle as y, unref as d, normalizeClass as _, Fragment as f, renderList as m, createElementVNode as i, toDisplayString as k, withDirectives as C, createBlock as w, vShow as S } from "vue";
import { C as A } from "./vendor.js";
import { useCfg as B, runAction as z, findAction as D } from "@cutcrft/runtime-client";
import { _ as E } from "./vendor2.js";
const I = ["disabled", "aria-expanded", "onClick"], N = { class: "ui-accordion__label" }, U = { class: "ui-accordion__body" }, j = /* @__PURE__ */ x({
  __name: "UiAccordion",
  props: {
    config: {},
    context: {}
  },
  setup(l) {
    var u;
    const r = l, t = B(r.config, { items: [] }), a = b(
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
      class: _(["ui-accordion", d(t).className]),
      style: y(d(t).style)
    }, [
      (c(!0), s(f, null, m(d(t).items, (n) => (c(), s("div", {
        key: n.id,
        class: "ui-accordion__item"
      }, [
        i("button", {
          class: _(["ui-accordion__header", { "ui-accordion__header--open": a.value.has(n.id), "ui-accordion__header--disabled": n.disabled }]),
          disabled: n.disabled,
          "aria-expanded": a.value.has(n.id),
          onClick: (p) => v(n.id)
        }, [
          o[0] || (o[0] = i("span", { class: "ui-accordion__caret" }, "▸", -1)),
          i("span", N, k(n.label), 1)
        ], 10, I),
        C(i("div", U, [
          (c(!0), s(f, null, m(n.components ?? [], (p, h) => (c(), w(A, {
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
}), $ = /* @__PURE__ */ E(j, [["__scopeId", "data-v-df1084e2"]]);
export {
  $ as default
};
