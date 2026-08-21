import { jsxs as v, jsx as u } from "preact/jsx-runtime";
import { useSignal as i } from "@preact/signals";
import { useCfg as g, sessionStore as m, runAction as S, findAction as p } from "@cutcrft/plugin-sdk";
import { useEffect as y } from "preact/hooks";
function C(s) {
  const l = g(s.config, {}), n = i(l.value.defaultValue ?? ""), o = i([]), r = i(!1);
  y(() => {
    const e = l.value.options;
    !e || r.value || m.execute(e.command, e.params ?? {}).then((a) => {
      a.status === "SUCCESS" && Array.isArray(a.value) && (o.value = a.value);
    }).catch(() => {
    }).finally(() => {
      r.value = !0;
    });
  }, [l.value.options]);
  function c(e) {
    const a = l.value.options;
    if (!a) return String(e);
    const t = a.valueKey;
    return t in e ? String(e[t]) : String(e);
  }
  function f(e) {
    const a = l.value.options;
    if (!a) return String(e);
    const t = a.labelKey;
    return t in e ? String(e[t]) : String(e);
  }
  function d(e) {
    const a = e.target;
    n.value = a.value, S(p(l.value.actions, "change"), {
      ...s.context ?? {},
      payload: { value: n.value }
    });
  }
  return /* @__PURE__ */ v("label", { class: `ui-field${l.value.className ? " " + l.value.className : ""}`, style: l.value.style, title: l.value.tooltip, children: [
    l.value.label ? /* @__PURE__ */ u("span", { class: "ui-field__label", children: l.value.label }) : null,
    /* @__PURE__ */ v("select", { value: n.value, disabled: l.value.disabled, onChange: d, children: [
      /* @__PURE__ */ u("option", { value: "", children: "—" }),
      o.value.map((e) => /* @__PURE__ */ u("option", { value: c(e), children: f(e) }, c(e)))
    ] })
  ] });
}
export {
  C as default
};
