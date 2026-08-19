import { defineComponent as p, ref as r, openBlock as n, createElementBlock as c, unref as t, normalizeStyle as u, normalizeClass as d, toDisplayString as f, createCommentVNode as _, createElementVNode as m } from "vue";
import { useCfg as v, runAction as y, findAction as h } from "@cutcrft/runtime-client";
import { _ as g } from "./vendor2.js";
const b = ["title"], x = {
  key: 0,
  class: "ui-field__label"
}, C = ["type", "value", "placeholder", "disabled"], I = /* @__PURE__ */ p({
  __name: "UiInput",
  props: {
    config: {},
    context: {}
  },
  setup(s) {
    const o = s, e = v(o.config, { type: "text" }), l = r(e.value.defaultValue ?? "");
    function i(a) {
      l.value = a.target.value, y(h(e.value.actions, "change"), { ...o.context ?? {}, payload: { value: l.value } });
    }
    return (a, k) => (n(), c("label", {
      class: d(["ui-field", t(e).className]),
      style: u(t(e).style),
      title: t(e).tooltip
    }, [
      t(e).label ? (n(), c("span", x, f(t(e).label), 1)) : _("", !0),
      m("input", {
        type: t(e).type,
        value: l.value,
        placeholder: t(e).placeholder,
        disabled: t(e).disabled,
        onInput: i
      }, null, 40, C)
    ], 14, b));
  }
}), A = /* @__PURE__ */ g(I, [["__scopeId", "data-v-f3742c42"]]);
export {
  A as default
};
