import { jsx as l } from "preact/jsx-runtime";
import { useCfg as s } from "@cutcrft/runtime-client";
import { r as t } from "./vendor.js";
function m(a) {
  const e = s(a.config, { columns: 1, gap: "var(--rt-space)" }), r = {
    display: "grid",
    gridTemplateColumns: `repeat(${e.value.columns ?? 1}, minmax(0, 1fr))`,
    gap: e.value.gap,
    ...e.value.style ?? {}
  };
  return /* @__PURE__ */ l("div", { class: `ui-grid${e.value.className ? " " + e.value.className : ""}`, style: r, children: t(e.value.components, a.context) });
}
export {
  m as default
};
