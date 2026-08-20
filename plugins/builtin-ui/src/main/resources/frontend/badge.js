import { jsx as a } from "preact/jsx-runtime";
import { useCfg as l } from "@cutcrft/runtime-client";
function o(t) {
  const e = l(t.config, { tone: "neutral", text: "" });
  return /* @__PURE__ */ a(
    "span",
    {
      class: `ui-badge ui-badge--${e.value.tone}${e.value.className ? " " + e.value.className : ""}`,
      style: e.value.style,
      title: e.value.tooltip,
      children: e.value.text
    }
  );
}
export {
  o as default
};
