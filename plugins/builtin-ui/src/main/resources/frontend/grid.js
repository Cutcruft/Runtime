import { defineComponent as p, computed as n, openBlock as t, createElementBlock as r, normalizeStyle as i, normalizeClass as u, unref as c, Fragment as f, renderList as d, createBlock as g } from "vue";
import { C as x } from "./vendor.js";
import { useCfg as _ } from "@cutcrft/runtime-client";
import { _ as v } from "./vendor2.js";
const C = /* @__PURE__ */ p({
  __name: "UiGrid",
  props: {
    config: {},
    context: {}
  },
  setup(o) {
    const e = _(o.config, { columns: 1, gap: "var(--rt-space)" }), a = n(() => Math.max(1, Math.min(e.value.columns ?? 1, 12))), s = n(() => ({
      gridTemplateColumns: `repeat(${a.value}, minmax(0, 1fr))`,
      gap: e.value.gap,
      ...e.value.style ?? {}
    }));
    return (k, h) => (t(), r("div", {
      class: u(["ui-grid", c(e).className]),
      style: i(s.value)
    }, [
      (t(!0), r(f, null, d(c(e).components ?? [], (m, l) => (t(), g(x, {
        key: l,
        component: m,
        context: o.context
      }, null, 8, ["component", "context"]))), 128))
    ], 6));
  }
}), S = /* @__PURE__ */ v(C, [["__scopeId", "data-v-f75cd2f7"]]);
export {
  S as default
};
