import { jsx as t } from "preact/jsx-runtime";
import { useCfg as i, iconView as r } from "@cutcrft/plugin-sdk";
function u(e) {
  const a = e.trim().split(/\s+/);
  return a.length >= 2 ? (a[0][0] + a[a.length - 1][0]).toUpperCase() : e.slice(0, 2).toUpperCase();
}
function o(e) {
  const a = i(e.config, { size: "medium", tone: "neutral" }), l = r(a.value.src).src ?? a.value.src, s = a.value.fallback ?? (a.value.name ? u(a.value.name) : "");
  return /* @__PURE__ */ t(
    "span",
    {
      class: `ui-avatar ui-avatar--${a.value.size} ui-avatar--${a.value.tone}${a.value.className ? " " + a.value.className : ""}`,
      style: a.value.style,
      title: a.value.tooltip,
      children: l ? /* @__PURE__ */ t("img", { class: "ui-avatar__img", src: l, alt: "" }) : /* @__PURE__ */ t("span", { class: "ui-avatar__fallback", children: s })
    }
  );
}
export {
  o as default
};
