import { jsx as t, Fragment as r } from "preact/jsx-runtime";
import { Container as l, useCfg as i } from "@cutcrft/plugin-sdk";
function c(a, e) {
  return a != null && a.length ? /* @__PURE__ */ t(r, { children: a.map((o, n) => /* @__PURE__ */ t(l, { component: o, context: e }, n)) }) : null;
}
function p(a) {
  const e = i(a.config, { direction: "horizontal", gap: "0.5rem" }), n = {
    display: "flex",
    flexDirection: (e.value.direction ?? "horizontal") === "vertical" ? "column" : "row",
    gap: e.value.gap,
    flexWrap: e.value.wrap ? "wrap" : "nowrap",
    alignItems: e.value.align,
    ...e.value.style ?? {}
  };
  return /* @__PURE__ */ t("div", { class: `ui-space${e.value.className ? " " + e.value.className : ""}`, style: n, children: c(e.value.components, a.context) });
}
export {
  p as default
};
