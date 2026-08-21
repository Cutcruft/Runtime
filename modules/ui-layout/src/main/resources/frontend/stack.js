import { jsx as l } from "preact/jsx-runtime";
import { useCfg as r } from "@cutcrft/plugin-sdk";
import { r as i } from "./vendor.js";
function n(e) {
  const a = r(e.config, { direction: "vertical", gap: "var(--rt-space)" }), t = {
    display: "flex",
    flexDirection: (a.value.direction ?? "vertical") === "vertical" ? "column" : "row",
    gap: a.value.gap ?? "var(--rt-space)",
    ...a.value.wrap ? { flexWrap: "wrap" } : {},
    ...a.value.align ? { alignItems: a.value.align } : {},
    ...a.value.justify ? { justifyContent: a.value.justify } : {},
    ...a.value.style ?? {}
  };
  return /* @__PURE__ */ l("div", { class: `ui-layout-stack${a.value.className ? " " + a.value.className : ""}`, style: t, children: i(e) });
}
export {
  n as default
};
