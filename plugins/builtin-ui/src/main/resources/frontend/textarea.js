import { defineComponent as i, ref as u, openBlock as n, createElementBlock as s, unref as t, normalizeStyle as d, normalizeClass as p, toDisplayString as _, createCommentVNode as f, createElementVNode as m } from "vue";
import { useCfg as v, runAction as h, findAction as g } from "@cutcrft/runtime-client";
import { _ as x } from "./vendor.js";
const b = ["title"], y = {
  key: 0,
  class: "ui-field__label"
}, C = ["value", "rows", "placeholder", "disabled"], w = /* @__PURE__ */ i({
  __name: "UiTextarea",
  props: {
    config: {},
    context: {}
  },
  setup(c) {
    const o = c, e = v(o.config, { rows: 3 }), a = u(e.value.defaultValue ?? "");
    function r(l) {
      a.value = l.target.value, h(g(e.value.actions, "change"), { ...o.context ?? {}, payload: { value: a.value } });
    }
    return (l, k) => (n(), s("label", {
      class: p(["ui-field", t(e).className]),
      style: d(t(e).style),
      title: t(e).tooltip
    }, [
      t(e).label ? (n(), s("span", y, _(t(e).label), 1)) : f("", !0),
      m("textarea", {
        value: a.value,
        rows: t(e).rows,
        placeholder: t(e).placeholder,
        disabled: t(e).disabled,
        onInput: r
      }, null, 40, C)
    ], 14, b));
  }
}), A = /* @__PURE__ */ x(w, [["__scopeId", "data-v-c13a1021"]]);
export {
  A as default
};
