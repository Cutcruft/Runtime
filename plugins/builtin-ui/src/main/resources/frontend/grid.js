import { defineComponent as p, computed as c, openBlock as t, createElementBlock as r, normalizeStyle as i, normalizeClass as u, unref as o, Fragment as f, renderList as d, createBlock as g } from "vue";
import { useCfg as x, ComponentHost as _ } from "@cutcrft/runtime-client";
import { _ as v } from "./vendor.js";
const y = /* @__PURE__ */ p({
  __name: "UiGrid",
  props: {
    config: {},
    context: {}
  },
  setup(n) {
    const e = x(n.config, { columns: 1, gap: "var(--rt-space)" }), a = c(() => Math.max(1, Math.min(e.value.columns ?? 1, 12))), s = c(() => ({
      gridTemplateColumns: `repeat(${a.value}, minmax(0, 1fr))`,
      gap: e.value.gap,
      ...e.value.style ?? {}
    }));
    return (k, h) => (t(), r("div", {
      class: u(["ui-grid", o(e).className]),
      style: i(s.value)
    }, [
      (t(!0), r(f, null, d(o(e).components ?? [], (l, m) => (t(), g(o(_), {
        key: m,
        component: l,
        context: n.context
      }, null, 8, ["component", "context"]))), 128))
    ], 6));
  }
}), M = /* @__PURE__ */ v(y, [["__scopeId", "data-v-8e4e4ee1"]]);
export {
  M as default
};
