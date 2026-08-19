import { defineComponent as y, ref as r, onMounted as b, openBlock as a, createElementBlock as s, unref as o, normalizeStyle as C, normalizeClass as x, toDisplayString as f, createCommentVNode as h, withDirectives as V, createElementVNode as v, Fragment as k, renderList as A, vModelSelect as K } from "vue";
import { useCfg as U, sessionStore as w, runAction as E, findAction as N } from "@cutcrft/runtime-client";
import { _ as z } from "./vendor2.js";
const B = ["title"], D = {
  key: 0,
  class: "ui-field__label"
}, L = ["disabled"], M = ["value"], F = /* @__PURE__ */ y({
  __name: "UiSelect",
  props: {
    config: {},
    context: {}
  },
  setup(p) {
    const u = p, n = U(u.config, {}), i = r(n.value.defaultValue ?? ""), c = r([]), d = r(!1);
    async function m() {
      const e = n.value.options;
      if (!(!e || d.value)) {
        try {
          const t = await w.execute(e.command, e.params ?? {});
          t.status === "SUCCESS" && Array.isArray(t.value) && (c.value = t.value);
        } catch {
        }
        d.value = !0;
      }
    }
    b(m);
    function _(e) {
      const t = n.value.options;
      if (!t) return String(e);
      const l = t.valueKey;
      return l in e ? String(e[l]) : String(e);
    }
    function S(e) {
      const t = n.value.options;
      if (!t) return String(e);
      const l = t.labelKey;
      return l in e ? String(e[l]) : String(e);
    }
    function g() {
      E(N(n.value.actions, "change"), { ...u.context ?? {}, payload: { value: i.value } });
    }
    return (e, t) => (a(), s("label", {
      class: x(["ui-field", o(n).className]),
      style: C(o(n).style),
      title: o(n).tooltip
    }, [
      o(n).label ? (a(), s("span", D, f(o(n).label), 1)) : h("", !0),
      V(v("select", {
        "onUpdate:modelValue": t[0] || (t[0] = (l) => i.value = l),
        disabled: o(n).disabled,
        onChange: g
      }, [
        t[1] || (t[1] = v("option", { value: "" }, "—", -1)),
        (a(!0), s(k, null, A(c.value, (l) => (a(), s("option", {
          key: String(l),
          value: _(l)
        }, f(S(l)), 9, M))), 128))
      ], 40, L), [
        [K, i.value]
      ])
    ], 14, B));
  }
}), q = /* @__PURE__ */ z(F, [["__scopeId", "data-v-bd6e8a85"]]);
export {
  q as default
};
