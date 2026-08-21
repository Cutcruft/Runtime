import { jsxs as u, jsx as i } from "preact/jsx-runtime";
import { useSignal as r } from "@preact/signals";
import { useCfg as v, Container as b } from "@cutcrft/plugin-sdk";
function p(t) {
  var c, n;
  const e = v(t.config, { tabs: [], activeTab: "" }), s = r(e.value.activeTab ?? ((n = (c = e.value.tabs) == null ? void 0 : c[0]) == null ? void 0 : n.id) ?? ""), l = e.value.tabs ?? [];
  return /* @__PURE__ */ u("div", { class: `ui-tabs${e.value.className ? " " + e.value.className : ""}`, style: e.value.style, children: [
    /* @__PURE__ */ i("div", { class: "ui-tabs__bar", role: "tablist", children: l.map((a) => /* @__PURE__ */ i(
      "button",
      {
        role: "tab",
        "aria-selected": s.value === a.id,
        class: `ui-tabs__tab${s.value === a.id ? " ui-tabs__tab--active" : ""}`,
        disabled: a.disabled,
        onClick: () => {
          s.value = a.id;
        },
        children: a.label
      },
      a.id
    )) }),
    /* @__PURE__ */ i("div", { class: "ui-tabs__content", children: l.filter((a) => a.id === s.value).map((a) => /* @__PURE__ */ i("div", { children: (a.components ?? []).map((o, d) => /* @__PURE__ */ i(b, { component: o, context: t.context }, d)) }, a.id)) })
  ] });
}
export {
  p as default
};
