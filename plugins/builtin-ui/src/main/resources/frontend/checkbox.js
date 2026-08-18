import { defineComponent as i, ref as d, openBlock as r, createElementBlock as u, unref as t, normalizeStyle as p, normalizeClass as f, createElementVNode as a, toDisplayString as _ } from "vue";
import { useCfg as m, runAction as h, findAction as k } from "@cutcrft/runtime-client";
import { _ as b } from "./vendor.js";
const x = ["title"], g = ["checked", "disabled"], v = /* @__PURE__ */ i({
  __name: "UiCheckbox",
  props: {
    config: {},
    context: {}
  },
  setup(l) {
    const c = l, e = m(c.config, {}), o = d(e.value.defaultValue ?? !1);
    function s(n) {
      o.value = n.target.checked, h(k(e.value.actions, "change"), {
        ...c.context ?? {},
        payload: { value: o.value }
      });
    }
    return (n, y) => (r(), u("label", {
      class: f(["ui-checkbox", t(e).className]),
      style: p(t(e).style),
      title: t(e).tooltip
    }, [
      a("input", {
        type: "checkbox",
        checked: o.value,
        disabled: t(e).disabled,
        onChange: s
      }, null, 40, g),
      a("span", null, _(t(e).label), 1)
    ], 14, x));
  }
}), B = /* @__PURE__ */ b(v, [["__scopeId", "data-v-e0ddfde7"]]);
export {
  B as default
};
