import { defineComponent as g, ref as k, watch as y, computed as T, openBlock as o, createElementBlock as i, normalizeStyle as h, unref as c, normalizeClass as v, createElementVNode as f, Fragment as p, renderList as x, toDisplayString as B, createBlock as z } from "vue";
import { C as A } from "./vendor.js";
import { useCfg as E, runAction as N, findAction as S } from "@cutcrft/runtime-client";
import { _ as U } from "./vendor2.js";
const w = {
  class: "ui-tabs__bar",
  role: "tablist"
}, D = ["aria-selected", "disabled", "onClick"], F = { class: "ui-tabs__content" }, H = /* @__PURE__ */ g({
  __name: "UiTabs",
  props: {
    config: {},
    context: {}
  },
  setup(l) {
    var u, b;
    const r = l, a = E(r.config, { tabs: [] }), s = k(a.value.activeTab ?? ((b = (u = a.value.tabs) == null ? void 0 : u[0]) == null ? void 0 : b.id) ?? "");
    y(
      () => a.value.activeTab,
      (e) => {
        e && (s.value = e);
      }
    );
    const d = T(() => {
      var e;
      return (e = a.value.tabs) == null ? void 0 : e.find((n) => n.id === s.value);
    });
    function C(e) {
      var n;
      (n = d.value) != null && n.disabled || (s.value = e, N(S(a.value.actions, "tabsChange"), { ...r.context ?? {}, payload: { tab: e } }));
    }
    return (e, n) => {
      var _;
      return o(), i("div", {
        class: v(["ui-tabs", c(a).className]),
        style: h(c(a).style)
      }, [
        f("div", w, [
          (o(!0), i(p, null, x(c(a).tabs, (t) => (o(), i("button", {
            key: t.id,
            class: v(["ui-tabs__tab", { "ui-tabs__tab--active": t.id === s.value, "ui-tabs__tab--disabled": t.disabled }]),
            role: "tab",
            "aria-selected": t.id === s.value,
            disabled: t.disabled,
            onClick: (m) => C(t.id)
          }, B(t.label), 11, D))), 128))
        ]),
        f("div", F, [
          (o(!0), i(p, null, x(((_ = d.value) == null ? void 0 : _.components) ?? [], (t, m) => (o(), z(A, {
            key: m,
            component: t,
            context: l.context
          }, null, 8, ["component", "context"]))), 128))
        ])
      ], 6);
    };
  }
}), j = /* @__PURE__ */ U(H, [["__scopeId", "data-v-d3618225"]]);
export {
  j as default
};
