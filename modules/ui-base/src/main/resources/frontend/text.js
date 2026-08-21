import { jsx as l } from "preact/jsx-runtime";
import { useCfg as u, useData as i, formatValue as o } from "@cutcrft/plugin-sdk";
function v(n) {
  const e = u(n.config, { tag: "p", text: "", align: "left" }), { value: c } = i(
    () => e.value.data,
    () => n.context ?? {}
  ), t = e.value.text || (e.value.data ? o(c.value) : ""), r = e.value.tag ?? "p", s = { textAlign: e.value.align, ...e.value.style ?? {} }, a = {
    class: `ui-text${e.value.className ? " " + e.value.className : ""}`,
    style: s,
    title: e.value.tooltip
  };
  switch (r) {
    case "h1":
      return /* @__PURE__ */ l("h1", { ...a, children: t });
    case "h2":
      return /* @__PURE__ */ l("h2", { ...a, children: t });
    case "h3":
      return /* @__PURE__ */ l("h3", { ...a, children: t });
    case "h4":
      return /* @__PURE__ */ l("h4", { ...a, children: t });
    case "span":
      return /* @__PURE__ */ l("span", { ...a, children: t });
    case "div":
      return /* @__PURE__ */ l("div", { ...a, children: t });
    case "label":
      return /* @__PURE__ */ l("label", { ...a, children: t });
    default:
      return /* @__PURE__ */ l("p", { ...a, children: t });
  }
}
export {
  v as default
};
