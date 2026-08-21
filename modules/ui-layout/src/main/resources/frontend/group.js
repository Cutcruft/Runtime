import { jsx as a } from "preact/jsx-runtime";
import { useCfg as o } from "@cutcrft/plugin-sdk";
import { r as t } from "./vendor.js";
function i(r) {
  const e = o(r.config, {});
  return /* @__PURE__ */ a("div", { class: `ui-layout-group${e.value.className ? " " + e.value.className : ""}`, style: e.value.style, children: t(r) });
}
export {
  i as default
};
