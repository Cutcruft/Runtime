import { jsxs as s, jsx as e } from "preact/jsx-runtime";
import { useCfg as u } from "@cutcrft/runtime-client";
function i(a) {
  const l = u(a.config, { rows: 3, placeholder: "" });
  return /* @__PURE__ */ s("label", { class: `ui-field${l.value.className ? " " + l.value.className : ""}`, style: l.value.style, children: [
    l.value.label ? /* @__PURE__ */ e("span", { class: "ui-field__label", children: l.value.label }) : null,
    /* @__PURE__ */ e(
      "textarea",
      {
        class: "ui-textarea",
        rows: l.value.rows,
        placeholder: l.value.placeholder,
        defaultValue: l.value.defaultValue,
        disabled: l.value.disabled,
        title: l.value.tooltip
      }
    )
  ] });
}
export {
  i as default
};
