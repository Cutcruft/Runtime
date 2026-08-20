import { jsxs as t, jsx as e } from "preact/jsx-runtime";
import { useCfg as u } from "@cutcrft/runtime-client";
function c(a) {
  const l = u(a.config, { type: "text", placeholder: "" });
  return /* @__PURE__ */ t("label", { class: `ui-field${l.value.className ? " " + l.value.className : ""}`, style: l.value.style, children: [
    l.value.label ? /* @__PURE__ */ e("span", { class: "ui-field__label", children: l.value.label }) : null,
    /* @__PURE__ */ e(
      "input",
      {
        class: "ui-input",
        type: l.value.type ?? "text",
        placeholder: l.value.placeholder,
        defaultValue: l.value.defaultValue,
        disabled: l.value.disabled,
        title: l.value.tooltip
      }
    )
  ] });
}
export {
  c as default
};
