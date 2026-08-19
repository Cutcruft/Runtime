import { defineComponent as i, ref as r, openBlock as d, createElementBlock as u, unref as t, normalizeStyle as p, normalizeClass as f, createElementVNode as a, toDisplayString as _ } from "vue";
import { useCfg as m, runAction as h, findAction as b } from "@cutcrft/runtime-client";
import { _ as k } from "./vendor2.js";
const x = ["title"], g = ["checked", "disabled"], v = /* @__PURE__ */ i({
  __name: "UiCheckbox",
  props: {
    config: {},
    context: {}
  },
  setup(l) {
    const o = l, e = m(o.config, {}), c = r(e.value.defaultValue ?? !1);
    function s(n) {
      c.value = n.target.checked, h(b(e.value.actions, "change"), {
        ...o.context ?? {},
        payload: { value: c.value }
      });
    }
    return (n, y) => (d(), u("label", {
      class: f(["ui-checkbox", t(e).className]),
      style: p(t(e).style),
      title: t(e).tooltip
    }, [
      a("input", {
        type: "checkbox",
        checked: c.value,
        disabled: t(e).disabled,
        onChange: s
      }, null, 40, g),
      a("span", null, _(t(e).label), 1)
    ], 14, x));
  }
}), B = /* @__PURE__ */ k(v, [["__scopeId", "data-v-cb12c9bc"]]);
export {
  B as default
};
