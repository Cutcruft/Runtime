import { defineComponent as Q, ref as L, computed as x, reactive as g, watch as j, onMounted as G, openBlock as s, createElementBlock as r, withModifiers as H, normalizeStyle as J, normalizeClass as k, unref as c, Fragment as N, renderList as M, createTextVNode as q, toDisplayString as p, createCommentVNode as b, withDirectives as y, vModelDynamic as W, vModelText as A, createElementVNode as v, vModelSelect as X, vModelCheckbox as Y } from "vue";
import { i18nStore as Z, useContainerQuery as ee, useCfg as te, sessionStore as E, findAction as ae, runAction as ne, toasts as oe } from "@cutcrft/runtime-client";
import { _ as se } from "./vendor.js";
const re = ["for"], ue = {
  key: 0,
  class: "ui-form__required"
}, le = ["id", "onUpdate:modelValue", "type", "placeholder", "disabled"], ie = ["id", "onUpdate:modelValue", "placeholder", "disabled"], ce = ["id", "onUpdate:modelValue", "placeholder", "rows", "disabled"], me = ["id", "onUpdate:modelValue", "disabled"], de = ["value"], pe = {
  key: 5,
  class: "ui-form__checkbox"
}, be = ["id", "onUpdate:modelValue", "disabled"], ye = {
  key: 6,
  class: "ui-form__error"
}, ve = ["disabled"], fe = ["disabled"], he = /* @__PURE__ */ Q({
  __name: "UiForm",
  props: {
    config: {},
    context: {}
  },
  setup(K) {
    const S = K, V = Z.t, $ = L(null), C = ee($), u = te(S.config, { submitLabel: "", fields: [], layout: {} }), m = x(() => u.value.fields ?? []), o = g({}), l = g({}), f = g({}), d = L(!1);
    function U(a) {
      return a.defaultValue !== void 0 ? a.defaultValue : a.type === "checkbox" ? !1 : "";
    }
    function h() {
      for (const a of m.value)
        o[a.name] = U(a), l[a.name] = "";
    }
    h(), j(m, (a) => {
      for (const t of a)
        t.name in o || (o[t.name] = U(t));
    });
    async function D(a) {
      if (!(!a.options || f[a.name]))
        try {
          const t = await E.execute(a.options.command, a.options.params ?? {});
          t.status === "SUCCESS" && Array.isArray(t.value) && (f[a.name] = t.value);
        } catch {
        }
    }
    G(() => {
      m.value.filter((a) => a.options).forEach((a) => D(a));
    });
    function F(a) {
      return a.options ? f[a.name] ?? [] : [];
    }
    function i(a) {
      return a.label ?? a.name;
    }
    function R(a, t) {
      if (!a.options) return String(t);
      const e = a.options.valueKey;
      return e in t ? String(t[e]) : String(t);
    }
    function T(a, t) {
      if (!a.options) return String(t);
      const e = a.options.labelKey;
      return e in t ? String(t[e]) : String(t);
    }
    function z() {
      let a = !0;
      for (const t of m.value) {
        const e = o[t.name], n = String(e ?? "").trim();
        if (l[t.name] = "", t.required && (e === "" || e === !1 || e === void 0)) {
          l[t.name] = `${i(t)} is required`, a = !1;
          continue;
        }
        if (t.type !== "checkbox" && t.minLength !== void 0 && n.length < t.minLength ? (l[t.name] = `${i(t)} must be at least ${t.minLength} characters`, a = !1) : t.type !== "checkbox" && t.maxLength !== void 0 && n.length > t.maxLength && (l[t.name] = `${i(t)} must be at most ${t.maxLength} characters`, a = !1), t.type === "number" && e !== "") {
          const _ = Number(e);
          Number.isNaN(_) || (t.min !== void 0 && _ < t.min && (l[t.name] = `${i(t)} must be at least ${t.min}`, a = !1), t.max !== void 0 && _ > t.max && (l[t.name] = `${i(t)} must be at most ${t.max}`, a = !1));
        }
      }
      return a;
    }
    function B() {
      const a = {};
      for (const t of m.value) {
        const e = o[t.name];
        e === "" || e === void 0 || (a[t.name] = t.type === "number" ? Number(e) : e);
      }
      return a;
    }
    async function I() {
      if (!d.value && z()) {
        d.value = !0;
        try {
          const a = B(), t = ae(u.value.actions, "submit");
          t ? await ne(t, { ...S.context ?? {}, values: a }) : u.value.command && (await E.executeCommand(u.value.command, a)).status === "SUCCESS" && (oe.push({ message: "Saved", kind: "success" }), h());
        } finally {
          d.value = !1;
        }
      }
    }
    function O() {
      h();
    }
    const w = x(() => {
      var a;
      return Math.max(1, Math.min(((a = u.value.layout) == null ? void 0 : a.columns) ?? 1, 4));
    }), P = x(() => {
      var a;
      return {
        gridTemplateColumns: `repeat(${C.value === "sm" ? 1 : w.value}, minmax(0, 1fr))`,
        gap: ((a = u.value.layout) == null ? void 0 : a.gap) ?? "var(--rt-space-sm)"
      };
    });
    return (a, t) => (s(), r("form", {
      ref_key: "root",
      ref: $,
      class: k(["ui-form", [c(u).className, `ui-form--cq-${c(C)}`]]),
      style: J(P.value),
      onSubmit: H(I, ["prevent"])
    }, [
      (s(!0), r(N, null, M(m.value, (e) => (s(), r("div", {
        key: e.name,
        class: k(["ui-form__field", { "ui-form__field--full": e.type === "textarea" || e.type === "checkbox" }])
      }, [
        e.type !== "checkbox" ? (s(), r("label", {
          key: 0,
          for: `field-${e.name}`
        }, [
          q(p(i(e)), 1),
          e.required ? (s(), r("span", ue, " *")) : b("", !0)
        ], 8, re)) : b("", !0),
        e.type === "text" || e.type === "email" || e.type === "password" ? y((s(), r("input", {
          key: 1,
          id: `field-${e.name}`,
          "onUpdate:modelValue": (n) => o[e.name] = n,
          type: e.type,
          placeholder: e.placeholder,
          disabled: e.disabled
        }, null, 8, le)), [
          [W, o[e.name]]
        ]) : e.type === "number" ? y((s(), r("input", {
          key: 2,
          id: `field-${e.name}`,
          "onUpdate:modelValue": (n) => o[e.name] = n,
          type: "number",
          placeholder: e.placeholder,
          disabled: e.disabled
        }, null, 8, ie)), [
          [
            A,
            o[e.name],
            void 0,
            { number: !0 }
          ]
        ]) : e.type === "textarea" ? y((s(), r("textarea", {
          key: 3,
          id: `field-${e.name}`,
          "onUpdate:modelValue": (n) => o[e.name] = n,
          placeholder: e.placeholder,
          rows: e.rows ?? 3,
          disabled: e.disabled
        }, null, 8, ce)), [
          [A, o[e.name]]
        ]) : e.type === "select" ? y((s(), r("select", {
          key: 4,
          id: `field-${e.name}`,
          "onUpdate:modelValue": (n) => o[e.name] = n,
          disabled: e.disabled
        }, [
          t[0] || (t[0] = v("option", { value: "" }, "—", -1)),
          (s(!0), r(N, null, M(F(e), (n) => (s(), r("option", {
            key: String(n),
            value: R(e, n)
          }, p(T(e, n)), 9, de))), 128))
        ], 8, me)), [
          [X, o[e.name]]
        ]) : e.type === "checkbox" ? (s(), r("label", pe, [
          y(v("input", {
            id: `field-${e.name}`,
            "onUpdate:modelValue": (n) => o[e.name] = n,
            type: "checkbox",
            disabled: e.disabled
          }, null, 8, be), [
            [Y, o[e.name]]
          ]),
          q(" " + p(i(e)), 1)
        ])) : b("", !0),
        l[e.name] ? (s(), r("span", ye, p(l[e.name]), 1)) : b("", !0)
      ], 2))), 128)),
      v("div", {
        class: k(["ui-form__actions", { "ui-form__actions--full": w.value > 1 }])
      }, [
        v("button", {
          class: "ui-button ui-button--primary",
          type: "submit",
          disabled: d.value
        }, p(d.value ? c(V)("core.button.loading") : c(u).submitLabel || c(V)("core.form.submit")), 9, ve),
        c(u).showReset ? (s(), r("button", {
          key: 0,
          type: "button",
          class: "ui-button",
          disabled: d.value,
          onClick: O
        }, p(c(u).resetLabel ?? "Reset"), 9, fe)) : b("", !0)
      ], 2)
    ], 38));
  }
}), ke = /* @__PURE__ */ se(he, [["__scopeId", "data-v-966eb150"]]);
export {
  ke as default
};
