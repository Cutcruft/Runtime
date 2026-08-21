import { jsxs as v, jsx as l } from "preact/jsx-runtime";
import { useCfg as i, useData as c, formatNumber as n } from "@cutcrft/plugin-sdk";
function d(s) {
  const e = i(s.config, { value: 0, tone: "default", showLabel: !1 }), { value: a } = c(
    () => e.value.data,
    () => s.context ?? {}
  );
  let t = e.value.value;
  if (e.value.data) {
    const r = e.value.valueKey && a.value && typeof a.value == "object" ? a.value[e.value.valueKey] : a.value;
    typeof r == "number" && (t = r);
  }
  const u = Math.max(0, Math.min(100, Number(t) || 0)), o = e.value.label ?? n(u, 0) + "%";
  return /* @__PURE__ */ v("div", { class: `ui-progress ui-progress--${e.value.tone}${e.value.className ? " " + e.value.className : ""}`, style: e.value.style, title: e.value.tooltip, children: [
    /* @__PURE__ */ l("div", { class: "ui-progress__track", children: /* @__PURE__ */ l("div", { class: "ui-progress__bar", style: { width: `${u}%` } }) }),
    e.value.showLabel ? /* @__PURE__ */ l("span", { class: "ui-progress__label", children: o }) : null
  ] });
}
export {
  d as default
};
