import { jsxs as t, jsx as l } from "preact/jsx-runtime";
import { useCfg as u } from "@cutcrft/plugin-sdk";
import { r } from "./vendor.js";
function c(a) {
  const e = u(a.config, { bordered: !0, padding: "var(--rt-space-lg)" });
  return /* @__PURE__ */ t(
    "section",
    {
      class: `ui-layout-card${e.value.bordered ? " ui-layout-card--bordered" : ""}${e.value.className ? " " + e.value.className : ""}`,
      style: e.value.style,
      children: [
        e.value.title || e.value.subtitle ? /* @__PURE__ */ t("header", { class: "ui-layout-card__header", children: [
          e.value.title ? /* @__PURE__ */ l("h3", { class: "ui-layout-card__title", children: e.value.title }) : null,
          e.value.subtitle ? /* @__PURE__ */ l("p", { class: "ui-layout-card__subtitle", children: e.value.subtitle }) : null
        ] }) : null,
        /* @__PURE__ */ l("div", { class: "ui-layout-card__body", style: { padding: e.value.padding }, children: r(a) })
      ]
    }
  );
}
export {
  c as default
};
