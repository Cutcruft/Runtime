import { jsx as i } from "preact/jsx-runtime";
import { useCfg as a } from "@cutcrft/plugin-sdk";
function d(l) {
  const e = a(l.config, { dashed: !1 });
  return /* @__PURE__ */ i(
    "div",
    {
      class: `ui-divider${e.value.dashed ? " ui-divider--dashed" : ""}${e.value.className ? " " + e.value.className : ""}`,
      style: e.value.style,
      title: e.value.tooltip,
      children: e.value.text ? /* @__PURE__ */ i("span", { class: "ui-divider__text", children: e.value.text }) : null
    }
  );
}
export {
  d as default
};
