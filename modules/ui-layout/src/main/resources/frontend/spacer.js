import { jsx as l } from "preact/jsx-runtime";
import { useCfg as t } from "@cutcrft/plugin-sdk";
function i(a) {
  const e = t(a.config, { grow: !1 }), s = {
    ...e.value.grow ? { flex: "1 1 auto" } : {},
    ...e.value.size ? { width: e.value.size, height: e.value.size } : {},
    ...e.value.style ?? {}
  };
  return /* @__PURE__ */ l("div", { class: `ui-layout-spacer${e.value.className ? " " + e.value.className : ""}`, style: s });
}
export {
  i as default
};
