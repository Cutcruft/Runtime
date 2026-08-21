import { jsx as r } from "preact/jsx-runtime";
import { useCfg as u } from "@cutcrft/plugin-sdk";
import { r as o } from "./vendor.js";
function i(l) {
  const a = u(l.config, { columns: 1, gap: "var(--rt-space)" }), e = {
    display: "grid",
    gridTemplateColumns: `repeat(${a.value.columns ?? 1}, minmax(0, 1fr))`,
    gap: a.value.gap ?? "var(--rt-space)",
    ...a.value.rowGap ? { rowGap: a.value.rowGap } : {},
    ...a.value.columnGap ? { columnGap: a.value.columnGap } : {},
    ...a.value.align ? { alignItems: a.value.align } : {},
    ...a.value.style ?? {}
  };
  return /* @__PURE__ */ r("div", { class: `ui-layout-grid${a.value.className ? " " + a.value.className : ""}`, style: e, children: o(l) });
}
export {
  i as default
};
