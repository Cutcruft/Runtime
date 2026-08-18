import { defineComponent as n, openBlock as s, createElementBlock as a, unref as e, normalizeStyle as r, normalizeClass as c, toDisplayString as i } from "vue";
import { useCfg as l } from "@cutcrft/runtime-client";
const p = ["title"], d = /* @__PURE__ */ n({
  __name: "UiBadge",
  props: {
    config: {},
    context: {}
  },
  setup(o) {
    const t = l(o.config, { tone: "neutral", text: "" });
    return (f, u) => (s(), a("span", {
      class: c(["ui-badge", [`ui-badge--${e(t).tone}`, e(t).className]]),
      style: r(e(t).style),
      title: e(t).tooltip
    }, i(e(t).text), 15, p));
  }
});
export {
  d as default
};
