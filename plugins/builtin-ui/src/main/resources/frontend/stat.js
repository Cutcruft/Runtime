import { defineComponent as p, computed as d, openBlock as o, createElementBlock as n, unref as t, normalizeStyle as m, normalizeClass as r, createElementVNode as c, toDisplayString as s, createCommentVNode as l, createTextVNode as v } from "vue";
import { useCfg as y, useData as x, formatNumber as h } from "@cutcrft/runtime-client";
import { _ as g } from "./vendor2.js";
const b = ["title"], k = { class: "ui-stat__label" }, N = { class: "ui-stat__value" }, C = {
  key: 0,
  class: "ui-stat__affix"
}, S = {
  key: 1,
  class: "ui-stat__affix"
}, V = /* @__PURE__ */ p({
  __name: "UiStat",
  props: {
    config: {},
    context: {}
  },
  setup(u) {
    const i = u, e = y(i.config, { tone: "default", precision: 0 }), { value: _ } = x(
      () => e.value.data,
      () => i.context ?? {}
    ), f = d(() => {
      let a = e.value.data ? _.value : e.value.value;
      return Array.isArray(a) ? a = a.length : a && typeof a == "object" && e.value.valueKey && (a = a[e.value.valueKey]), h(a, e.value.precision);
    });
    return (a, z) => (o(), n("div", {
      class: r(["ui-stat", [`ui-stat--${t(e).tone}`, t(e).className]]),
      style: m(t(e).style),
      title: t(e).tooltip
    }, [
      c("span", k, s(t(e).label), 1),
      c("span", N, [
        t(e).prefix ? (o(), n("span", C, s(t(e).prefix), 1)) : l("", !0),
        v(s(f.value), 1),
        t(e).suffix ? (o(), n("span", S, s(t(e).suffix), 1)) : l("", !0)
      ]),
      t(e).trend ? (o(), n("span", {
        key: 0,
        class: r(["ui-stat__trend", `ui-stat__trend--${t(e).trend}`])
      }, s(t(e).trend === "up" ? "▲" : t(e).trend === "down" ? "▼" : "—"), 3)) : l("", !0)
    ], 14, b));
  }
}), E = /* @__PURE__ */ g(V, [["__scopeId", "data-v-5bfe622d"]]);
export {
  E as default
};
