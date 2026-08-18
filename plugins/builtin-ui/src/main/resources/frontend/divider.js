import { defineComponent as n, computed as c, openBlock as o, createElementBlock as s, normalizeStyle as a, unref as t, normalizeClass as d, toDisplayString as p, createCommentVNode as l } from "vue";
import { useCfg as m } from "@cutcrft/runtime-client";
import { _ } from "./vendor.js";
const u = {
  key: 0,
  class: "ui-divider__text"
}, f = /* @__PURE__ */ n({
  __name: "UiDivider",
  props: {
    config: {},
    context: {}
  },
  setup(i) {
    const e = m(i.config, {}), r = c(() => e.value.dashed === !0);
    return (x, g) => (o(), s("div", {
      class: d(["ui-divider", { "ui-divider--dashed": r.value }]),
      style: a(t(e).style)
    }, [
      t(e).text ? (o(), s("span", u, p(t(e).text), 1)) : l("", !0)
    ], 6));
  }
}), k = /* @__PURE__ */ _(f, [["__scopeId", "data-v-293bfe7b"]]);
export {
  k as default
};
