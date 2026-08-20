import { jsxs as u, jsx as e } from "preact/jsx-runtime";
import { useCfg as s } from "@cutcrft/runtime-client";
function t(a) {
  const l = s(a.config, { label: "", defaultValue: !1 });
  return /* @__PURE__ */ u("label", { class: `ui-field ui-field--checkbox${l.value.className ? " " + l.value.className : ""}`, style: l.value.style, children: [
    /* @__PURE__ */ e("input", { type: "checkbox", class: "ui-checkbox", defaultChecked: l.value.defaultValue, disabled: l.value.disabled, title: l.value.tooltip }),
    l.value.label ? /* @__PURE__ */ e("span", { class: "ui-field__label", children: l.value.label }) : null
  ] });
}
export {
  t as default
};
