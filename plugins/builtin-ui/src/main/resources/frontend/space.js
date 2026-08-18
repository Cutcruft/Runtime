import { defineComponent as s, computed as p, openBlock as o, createElementBlock as c, unref as t, normalizeStyle as i, normalizeClass as m, Fragment as u, renderList as f, createBlock as _ } from "vue";
import { useCfg as d, ComponentHost as g } from "@cutcrft/runtime-client";
import { _ as v } from "./vendor.js";
const x = ["title"], y = /* @__PURE__ */ s({
  __name: "UiSpace",
  props: {
    config: {},
    context: {}
  },
  setup(n) {
    const e = d(n.config, { direction: "horizontal", gap: "0.5rem" }), a = p(() => ({
      flexDirection: e.value.direction === "vertical" ? "column" : "row",
      gap: e.value.gap ?? "0.5rem",
      alignItems: e.value.align ?? "stretch",
      flexWrap: e.value.wrap ? "wrap" : "nowrap",
      ...e.value.style ?? {}
    }));
    return (k, w) => (o(), c("div", {
      class: m(["ui-space", t(e).className]),
      style: i(a.value),
      title: t(e).tooltip
    }, [
      (o(!0), c(u, null, f(t(e).components ?? [], (r, l) => (o(), _(t(g), {
        key: l,
        component: r,
        context: n.context
      }, null, 8, ["component", "context"]))), 128))
    ], 14, x));
  }
}), B = /* @__PURE__ */ v(y, [["__scopeId", "data-v-5396c840"]]);
export {
  B as default
};
