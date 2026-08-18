import { defineComponent as k, ref as y, watch as C, computed as T, openBlock as o, createElementBlock as c, normalizeStyle as h, unref as i, normalizeClass as v, createElementVNode as f, Fragment as p, renderList as x, toDisplayString as B, createBlock as z } from "vue";
import { useCfg as A, ComponentHost as E, runAction as N, findAction as S } from "@cutcrft/runtime-client";
import { _ as U } from "./vendor.js";
const w = {
  class: "ui-tabs__bar",
  role: "tablist"
}, D = ["aria-selected", "disabled", "onClick"], F = { class: "ui-tabs__content" }, H = /* @__PURE__ */ k({
  __name: "UiTabs",
  props: {
    config: {},
    context: {}
  },
  setup(l) {
    var d, b;
    const r = l, a = A(r.config, { tabs: [] }), n = y(a.value.activeTab ?? ((b = (d = a.value.tabs) == null ? void 0 : d[0]) == null ? void 0 : b.id) ?? "");
    C(
      () => a.value.activeTab,
      (e) => {
        e && (n.value = e);
      }
    );
    const u = T(() => {
      var e;
      return (e = a.value.tabs) == null ? void 0 : e.find((s) => s.id === n.value);
    });
    function g(e) {
      var s;
      (s = u.value) != null && s.disabled || (n.value = e, N(S(a.value.actions, "tabsChange"), { ...r.context ?? {}, payload: { tab: e } }));
    }
    return (e, s) => {
      var _;
      return o(), c("div", {
        class: v(["ui-tabs", i(a).className]),
        style: h(i(a).style)
      }, [
        f("div", w, [
          (o(!0), c(p, null, x(i(a).tabs, (t) => (o(), c("button", {
            key: t.id,
            class: v(["ui-tabs__tab", { "ui-tabs__tab--active": t.id === n.value, "ui-tabs__tab--disabled": t.disabled }]),
            role: "tab",
            "aria-selected": t.id === n.value,
            disabled: t.disabled,
            onClick: (m) => g(t.id)
          }, B(t.label), 11, D))), 128))
        ]),
        f("div", F, [
          (o(!0), c(p, null, x(((_ = u.value) == null ? void 0 : _.components) ?? [], (t, m) => (o(), z(i(E), {
            key: m,
            component: t,
            context: l.context
          }, null, 8, ["component", "context"]))), 128))
        ])
      ], 6);
    };
  }
}), $ = /* @__PURE__ */ U(H, [["__scopeId", "data-v-a45e1a13"]]);
export {
  $ as default
};
