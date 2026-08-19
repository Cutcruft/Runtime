import { defineComponent as c, computed as n, openBlock as o, createElementBlock as s, normalizeStyle as a, unref as t, normalizeClass as d, toDisplayString as p, createCommentVNode as l } from "vue";
import { useCfg as m } from "@cutcrft/runtime-client";
import { _ } from "./vendor2.js";
const f = {
  key: 0,
  class: "ui-divider__text"
}, u = /* @__PURE__ */ c({
  __name: "UiDivider",
  props: {
    config: {},
    context: {}
  },
  setup(i) {
    const e = m(i.config, {}), r = n(() => e.value.dashed === !0);
    return (x, g) => (o(), s("div", {
      class: d(["ui-divider", { "ui-divider--dashed": r.value }]),
      style: a(t(e).style)
    }, [
      t(e).text ? (o(), s("span", f, p(t(e).text), 1)) : l("", !0)
    ], 6));
  }
}), k = /* @__PURE__ */ _(u, [["__scopeId", "data-v-89f4ebcf"]]);
export {
  k as default
};
