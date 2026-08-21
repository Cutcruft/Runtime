import { jsx as l } from "preact/jsx-runtime";
import { useCfg as o } from "@cutcrft/plugin-sdk";
function u(t) {
  const e = o(t.config, { src: "", height: "100%" }), a = e.value.src, s = {
    width: e.value.width ?? "100%",
    height: e.value.height ?? "100%",
    border: "none",
    ...e.value.style ?? {}
  };
  return /* @__PURE__ */ l(
    "iframe",
    {
      class: `ui-frame${e.value.className ? " " + e.value.className : ""}`,
      src: a,
      title: e.value.title ?? e.value.tooltip,
      style: s,
      sandbox: e.value.sandbox
    }
  );
}
export {
  u as default
};
