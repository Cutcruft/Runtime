import { jsx as i } from "preact/jsx-runtime";
import { useCfg as l, iconView as s } from "@cutcrft/runtime-client";
function v(t) {
  const e = l(t.config, { src: "", alt: "", fit: "cover" }), a = s(e.value.src).src ?? e.value.src ?? "", c = {
    objectFit: e.value.fit ?? "cover",
    ...e.value.style ?? {}
  };
  return /* @__PURE__ */ i(
    "img",
    {
      class: `ui-image${e.value.className ? " " + e.value.className : ""}`,
      src: a,
      alt: e.value.alt ?? "",
      title: e.value.tooltip,
      style: c,
      width: e.value.width,
      height: e.value.height
    }
  );
}
export {
  v as default
};
