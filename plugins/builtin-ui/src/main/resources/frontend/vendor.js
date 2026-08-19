import { defineComponent as m, computed as i, openBlock as n, createBlock as p, Suspense as d, withCtx as a, resolveDynamicComponent as u, createElementVNode as o, toDisplayString as c, createElementBlock as f } from "vue";
import { resolveEditor as y, resolveComponent as g } from "@cutcrft/runtime-client";
import { _ as v } from "./vendor2.js";
const x = {
  class: "component-loader",
  role: "status"
}, _ = { class: "component-loader__label" }, k = {
  key: 1,
  class: "component-unknown"
}, C = /* @__PURE__ */ m({
  __name: "ComponentHost",
  props: {
    component: {},
    context: {}
  },
  setup(e) {
    const s = e, l = i(() => {
      const t = y(s.component.type);
      return t || g(s.component.type);
    });
    return (t, r) => l.value ? (n(), p(d, { key: 0 }, {
      fallback: a(() => [
        o("div", x, [
          r[0] || (r[0] = o("span", { class: "component-loader__spinner" }, null, -1)),
          o("span", _, c(e.component.type), 1)
        ])
      ]),
      default: a(() => [
        (n(), p(u(l.value), {
          config: e.component.config,
          context: e.context,
          "data-gesture-type": e.component.type
        }, null, 8, ["config", "context", "data-gesture-type"]))
      ]),
      _: 1
    })) : (n(), f("div", k, [
      o("strong", null, c(e.component.type), 1),
      o("pre", null, c(JSON.stringify(e.component.config, null, 2)), 1)
    ]));
  }
}), E = /* @__PURE__ */ v(C, [["__scopeId", "data-v-4b3b6531"]]);
export {
  E as C
};
