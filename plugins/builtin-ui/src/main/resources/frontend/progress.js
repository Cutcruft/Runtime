import { defineComponent as f, computed as r, openBlock as n, createElementBlock as u, unref as s, normalizeStyle as i, normalizeClass as v, createElementVNode as c, toDisplayString as d, createCommentVNode as g } from "vue";
import { useCfg as y, useData as b } from "@cutcrft/runtime-client";
import { _ as h } from "./vendor.js";
const x = ["title"], N = { class: "ui-progress__bar" }, C = {
  key: 0,
  class: "ui-progress__label"
}, k = /* @__PURE__ */ f({
  __name: "UiProgress",
  props: {
    config: {},
    context: {}
  },
  setup(p) {
    const l = p, e = y(l.config, { value: 0, tone: "default", showLabel: !1 }), { value: m } = b(
      () => e.value.data,
      () => l.context ?? {}
    ), o = r(() => {
      let t = e.value.data ? m.value : e.value.value;
      Array.isArray(t) ? t = t.length : t && typeof t == "object" && e.value.valueKey && (t = t[e.value.valueKey]);
      const a = typeof t == "number" ? t : Number(t ?? 0);
      return Number.isFinite(a) ? Math.max(0, Math.min(100, a)) : 0;
    }), _ = r(() => e.value.label != null ? e.value.label : `${Math.round(o.value)}%`);
    return (t, a) => (n(), u("div", {
      class: v(["ui-progress", [`ui-progress--${s(e).tone}`, s(e).className]]),
      style: i(s(e).style),
      title: s(e).tooltip
    }, [
      c("div", N, [
        c("div", {
          class: "ui-progress__fill",
          style: i({ width: `${o.value}%` })
        }, null, 4)
      ]),
      s(e).showLabel ? (n(), u("span", C, d(_.value), 1)) : g("", !0)
    ], 14, x));
  }
}), $ = /* @__PURE__ */ h(k, [["__scopeId", "data-v-afeb2262"]]);
export {
  $ as default
};
