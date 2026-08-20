import { jsxs as u, jsx as l } from "preact/jsx-runtime";
import { useCfg as n, useData as r, formatNumber as v } from "@cutcrft/runtime-client";
function o(t) {
  const e = n(t.config, { tone: "default", precision: 0 }), { value: s } = r(
    () => e.value.data,
    () => t.context ?? {}
  );
  let a = e.value.data ? s.value : e.value.value;
  Array.isArray(a) ? a = a.length : a && typeof a == "object" && e.value.valueKey && (a = a[e.value.valueKey]);
  const i = v(a, e.value.precision);
  return /* @__PURE__ */ u("div", { class: `ui-stat ui-stat--${e.value.tone}${e.value.className ? " " + e.value.className : ""}`, style: e.value.style, title: e.value.tooltip, children: [
    /* @__PURE__ */ l("span", { class: "ui-stat__label", children: e.value.label }),
    /* @__PURE__ */ u("span", { class: "ui-stat__value", children: [
      e.value.prefix ? /* @__PURE__ */ l("span", { class: "ui-stat__affix", children: e.value.prefix }) : null,
      i,
      e.value.suffix ? /* @__PURE__ */ l("span", { class: "ui-stat__affix", children: e.value.suffix }) : null
    ] }),
    e.value.trend ? /* @__PURE__ */ l("span", { class: `ui-stat__trend ui-stat__trend--${e.value.trend}`, children: e.value.trend === "up" ? "▲" : e.value.trend === "down" ? "▼" : "—" }) : null
  ] });
}
export {
  o as default
};
