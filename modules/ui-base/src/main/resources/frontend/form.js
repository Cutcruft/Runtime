import { jsxs as v, jsx as o } from "preact/jsx-runtime";
import { useSignal as h } from "@preact/signals";
import { useRef as U, useEffect as L } from "preact/hooks";
import { i18nStore as F, useContainerQuery as M, useCfg as B, sessionStore as w, findAction as D, runAction as O, toasts as P } from "@cutcrft/plugin-sdk";
function H(d) {
  var k, C;
  const y = F.t, g = U(null), x = M(g), u = B(d.config, { submitLabel: "", fields: [], layout: {} }), r = u.value.fields ?? [], n = h({}), i = h({}), f = h({}), c = h(!1);
  function S(e) {
    return e.defaultValue !== void 0 ? e.defaultValue : e.type === "checkbox" ? !1 : "";
  }
  function $() {
    const e = {}, t = {};
    for (const a of r)
      a.name in n.value || (e[a.name] = S(a)), t[a.name] = "";
    n.value = { ...n.value, ...e }, i.value = t;
  }
  L(() => {
    $();
  }, [r.map((e) => e.name).join(",")]), L(() => {
    r.filter((e) => e.options).forEach((e) => N(e));
  }, [r.map((e) => e.name).join(",")]);
  async function N(e) {
    if (!(!e.options || f.value[e.name]))
      try {
        const t = await w.execute(e.options.command, e.options.params ?? {});
        t.status === "SUCCESS" && Array.isArray(t.value) && (f.value = { ...f.value, [e.name]: t.value });
      } catch {
      }
  }
  function q(e) {
    return e.options ? f.value[e.name] ?? [] : [];
  }
  function l(e) {
    return e.label ?? e.name;
  }
  function E(e, t) {
    if (!e.options) return String(t);
    const a = e.options.valueKey;
    return a in t ? String(t[a]) : String(t);
  }
  function V(e, t) {
    if (!e.options) return String(t);
    const a = e.options.labelKey;
    return a in t ? String(t[a]) : String(t);
  }
  function A() {
    let e = !0;
    const t = {};
    for (const a of r) {
      const s = n.value[a.name], b = String(s ?? "").trim();
      if (a.required && (s === "" || s === !1 || s === void 0)) {
        t[a.name] = `${l(a)} is required`, e = !1;
        continue;
      }
      if (a.type !== "checkbox" && a.minLength !== void 0 && b.length < a.minLength ? (t[a.name] = `${l(a)} must be at least ${a.minLength} characters`, e = !1) : a.type !== "checkbox" && a.maxLength !== void 0 && b.length > a.maxLength && (t[a.name] = `${l(a)} must be at most ${a.maxLength} characters`, e = !1), a.type === "number" && s !== "") {
        const m = Number(s);
        Number.isNaN(m) || (a.min !== void 0 && m < a.min && (t[a.name] = `${l(a)} must be at least ${a.min}`, e = !1), a.max !== void 0 && m > a.max && (t[a.name] = `${l(a)} must be at most ${a.max}`, e = !1));
      }
    }
    return i.value = t, e;
  }
  function j() {
    const e = {};
    for (const t of r) {
      const a = n.value[t.name];
      a === "" || a === void 0 || (e[t.name] = t.type === "number" ? Number(a) : a);
    }
    return e;
  }
  async function I() {
    var e;
    if (!c.value && A()) {
      c.value = !0;
      try {
        const t = j(), a = D(u.value.actions, "submit");
        if (a)
          await O(a, { ...d.context ?? {}, values: t });
        else if (u.value.command) {
          const s = await w.executeCommand(u.value.command, t);
          if (s.status === "SUCCESS")
            P.push({ message: "Saved", kind: "success" }), $();
          else if ((e = s.fieldErrors) != null && e.length) {
            const b = {};
            for (const m of s.fieldErrors) b[m.field] = m.message;
            i.value = b;
          }
        }
      } finally {
        c.value = !1;
      }
    }
  }
  function K() {
    const e = {}, t = {};
    for (const a of r)
      e[a.name] = S(a), t[a.name] = "";
    n.value = e, i.value = t;
  }
  function p(e, t) {
    n.value = { ...n.value, [e]: t };
  }
  const _ = Math.max(1, Math.min(((k = u.value.layout) == null ? void 0 : k.columns) ?? 1, 4)), R = {
    display: "grid",
    gridTemplateColumns: `repeat(${x.value === "sm" ? 1 : _}, minmax(0, 1fr))`,
    gap: ((C = u.value.layout) == null ? void 0 : C.gap) ?? "var(--rt-space-sm)",
    alignItems: "start"
  };
  return /* @__PURE__ */ v(
    "form",
    {
      ref: g,
      class: `ui-form ui-form--cq-${x.value}${u.value.className ? " " + u.value.className : ""}`,
      style: R,
      onSubmit: (e) => {
        e.preventDefault(), I();
      },
      children: [
        r.map((e) => /* @__PURE__ */ v(
          "div",
          {
            class: `ui-form__field${e.type === "textarea" || e.type === "checkbox" ? " ui-form__field--full" : ""}`,
            children: [
              e.type !== "checkbox" ? /* @__PURE__ */ v("label", { htmlFor: `field-${e.name}`, children: [
                l(e),
                e.required ? /* @__PURE__ */ o("span", { class: "ui-form__required", children: " *" }) : null
              ] }) : null,
              e.type === "text" || e.type === "email" || e.type === "password" ? /* @__PURE__ */ o(
                "input",
                {
                  id: `field-${e.name}`,
                  type: e.type,
                  placeholder: e.placeholder,
                  disabled: e.disabled,
                  value: String(n.value[e.name] ?? ""),
                  onInput: (t) => p(e.name, t.target.value)
                }
              ) : null,
              e.type === "number" ? /* @__PURE__ */ o(
                "input",
                {
                  id: `field-${e.name}`,
                  type: "number",
                  placeholder: e.placeholder,
                  disabled: e.disabled,
                  value: String(n.value[e.name] ?? ""),
                  onInput: (t) => p(e.name, t.target.value)
                }
              ) : null,
              e.type === "textarea" ? /* @__PURE__ */ o(
                "textarea",
                {
                  id: `field-${e.name}`,
                  placeholder: e.placeholder,
                  rows: e.rows ?? 3,
                  disabled: e.disabled,
                  value: String(n.value[e.name] ?? ""),
                  onInput: (t) => p(e.name, t.target.value)
                }
              ) : null,
              e.type === "select" ? /* @__PURE__ */ v(
                "select",
                {
                  id: `field-${e.name}`,
                  disabled: e.disabled,
                  value: String(n.value[e.name] ?? ""),
                  onChange: (t) => p(e.name, t.target.value),
                  children: [
                    /* @__PURE__ */ o("option", { value: "", children: "—" }),
                    q(e).map((t) => /* @__PURE__ */ o("option", { value: E(e, t), children: V(e, t) }, String(t)))
                  ]
                }
              ) : null,
              e.type === "checkbox" ? /* @__PURE__ */ v("label", { class: "ui-form__checkbox", children: [
                /* @__PURE__ */ o(
                  "input",
                  {
                    id: `field-${e.name}`,
                    type: "checkbox",
                    disabled: e.disabled,
                    checked: !!n.value[e.name],
                    onChange: (t) => p(e.name, t.target.checked)
                  }
                ),
                l(e)
              ] }) : null,
              i.value[e.name] ? /* @__PURE__ */ o("span", { class: "ui-form__error", children: i.value[e.name] }) : null
            ]
          },
          e.name
        )),
        /* @__PURE__ */ v("div", { class: `ui-form__actions${_ > 1 ? " ui-form__actions--full" : ""}`, children: [
          /* @__PURE__ */ o("button", { class: "ui-button ui-button--primary", type: "submit", disabled: c.value, children: c.value ? y("core.button.loading") : u.value.submitLabel || y("core.form.submit") }),
          u.value.showReset ? /* @__PURE__ */ o("button", { type: "button", class: "ui-button", disabled: c.value, onClick: K, children: u.value.resetLabel ?? "Reset" }) : null
        ] })
      ]
    }
  );
}
export {
  H as default
};
