import { defineComponent as s, computed as p, openBlock as t, createElementBlock as c, unref as o, normalizeStyle as i, normalizeClass as m, Fragment as u, renderList as f, createBlock as _ } from "vue";
import { C as d } from "./vendor.js";
import { useCfg as g } from "@cutcrft/runtime-client";
import { _ as v } from "./vendor2.js";
const x = ["title"], y = /* @__PURE__ */ s({
  __name: "UiSpace",
  props: {
    config: {},
    context: {}
  },
  setup(n) {
    const e = g(n.config, { direction: "horizontal", gap: "0.5rem" }), r = p(() => ({
      flexDirection: e.value.direction === "vertical" ? "column" : "row",
      gap: e.value.gap ?? "0.5rem",
      alignItems: e.value.align ?? "stretch",
      flexWrap: e.value.wrap ? "wrap" : "nowrap",
      ...e.value.style ?? {}
    }));
    return (h, k) => (t(), c("div", {
      class: m(["ui-space", o(e).className]),
      style: i(r.value),
      title: o(e).tooltip
    }, [
      (t(!0), c(u, null, f(o(e).components ?? [], (a, l) => (t(), _(d, {
        key: l,
        component: a,
        context: n.context
      }, null, 8, ["component", "context"]))), 128))
    ], 14, x));
  }
}), b = /* @__PURE__ */ v(y, [["__scopeId", "data-v-66e2bceb"]]);
export {
  b as default
};
