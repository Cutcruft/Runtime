import { jsx as i } from "preact/jsx-runtime";
import { useCfg as l } from "@cutcrft/runtime-client";
import { r as o } from "./vendor.js";
function u(a) {
  const e = l(a.config, { direction: "horizontal", gap: "0.5rem" }), r = {
    display: "flex",
    flexDirection: (e.value.direction ?? "horizontal") === "vertical" ? "column" : "row",
    gap: e.value.gap,
    flexWrap: e.value.wrap ? "wrap" : "nowrap",
    alignItems: e.value.align,
    ...e.value.style ?? {}
  };
  return /* @__PURE__ */ i("div", { class: `ui-space${e.value.className ? " " + e.value.className : ""}`, style: r, children: o(e.value.components, a.context) });
}
export {
  u as default
};
