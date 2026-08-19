import { defineComponent as c, computed as r, openBlock as i, createBlock as p, resolveDynamicComponent as u, unref as e, normalizeStyle as f, normalizeClass as m, withCtx as x, createTextVNode as d, toDisplayString as _ } from "vue";
import { useCfg as g, useData as v, formatValue as y } from "@cutcrft/runtime-client";
import { _ as C } from "./vendor2.js";
const T = /* @__PURE__ */ c({
  __name: "UiText",
  props: {
    config: {},
    context: {}
  },
  setup(n) {
    const o = n, t = g(o.config, { tag: "p", text: "", align: "left" }), { value: s } = v(
      () => t.value.data,
      () => o.context ?? {}
    ), l = r(() => {
      const a = t.value.text;
      return a || (t.value.data ? y(s.value) : "");
    });
    return (a, D) => (i(), p(u(e(t).tag ?? "p"), {
      class: m(["ui-text", e(t).className]),
      style: f({ textAlign: e(t).align, ...e(t).style ?? {} }),
      title: e(t).tooltip
    }, {
      default: x(() => [
        d(_(l.value), 1)
      ]),
      _: 1
    }, 8, ["class", "style", "title"]));
  }
}), B = /* @__PURE__ */ C(T, [["__scopeId", "data-v-96d612dd"]]);
export {
  B as default
};
