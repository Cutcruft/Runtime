import { jsx as t } from "preact/jsx-runtime";
import { useCfg as o } from "@cutcrft/plugin-sdk";
import { r as l } from "./vendor.js";
function m(e) {
  const a = o(e.config, { columns: 1 }), s = {
    display: "grid",
    gridTemplateColumns: `repeat(${Math.max(1, Math.min(a.value.columns ?? 1, 4))}, minmax(0, 1fr))`,
    gap: a.value.gap ?? "var(--rt-space)",
    ...a.value.style ?? {}
  };
  return /* @__PURE__ */ t(
    "section",
    {
      class: `ui-layout-section${a.value.className ? " " + a.value.className : ""}`,
      style: s,
      children: l(e)
    }
  );
}
export {
  m as default
};
