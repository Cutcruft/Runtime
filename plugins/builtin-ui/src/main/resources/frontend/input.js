import { defineComponent as p, ref as r, openBlock as n, createElementBlock as s, unref as t, normalizeStyle as u, normalizeClass as d, toDisplayString as _, createCommentVNode as f, createElementVNode as m } from "vue";
import { useCfg as v, runAction as y, findAction as h } from "@cutcrft/runtime-client";
import { _ as b } from "./vendor.js";
const g = ["title"], x = {
  key: 0,
  class: "ui-field__label"
}, C = ["type", "value", "placeholder", "disabled"], I = /* @__PURE__ */ p({
  __name: "UiInput",
  props: {
    config: {},
    context: {}
  },
  setup(c) {
    const a = c, e = v(a.config, { type: "text" }), l = r(e.value.defaultValue ?? "");
    function i(o) {
      l.value = o.target.value, y(h(e.value.actions, "change"), { ...a.context ?? {}, payload: { value: l.value } });
    }
    return (o, k) => (n(), s("label", {
      class: d(["ui-field", t(e).className]),
      style: u(t(e).style),
      title: t(e).tooltip
    }, [
      t(e).label ? (n(), s("span", x, _(t(e).label), 1)) : f("", !0),
      m("input", {
        type: t(e).type,
        value: l.value,
        placeholder: t(e).placeholder,
        disabled: t(e).disabled,
        onInput: i
      }, null, 40, C)
    ], 14, g));
  }
}), A = /* @__PURE__ */ b(I, [["__scopeId", "data-v-be8239a7"]]);
export {
  A as default
};
