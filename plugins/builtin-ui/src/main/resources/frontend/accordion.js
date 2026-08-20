import { jsx as i, jsxs as d } from "preact/jsx-runtime";
import { useSignal as m } from "@preact/signals";
import { useCfg as p, Container as _ } from "@cutcrft/runtime-client";
function b(o) {
  var l, s;
  const c = p(o.config, { items: [] }), a = m(((s = (l = c.value.items) == null ? void 0 : l.find((n) => n.open)) == null ? void 0 : s.id) ?? null), r = c.value.items ?? [];
  return /* @__PURE__ */ i("div", { class: `ui-accordion${c.value.className ? " " + c.value.className : ""}`, style: c.value.style, children: r.map((n) => {
    const e = a.value === n.id;
    return /* @__PURE__ */ d("div", { class: `ui-accordion__item${e ? " ui-accordion__item--open" : ""}`, children: [
      /* @__PURE__ */ d(
        "button",
        {
          class: "ui-accordion__header",
          disabled: n.disabled,
          onClick: () => {
            a.value = e ? null : n.id;
          },
          children: [
            /* @__PURE__ */ i("span", { class: "ui-accordion__marker", children: e ? "▾" : "▸" }),
            /* @__PURE__ */ i("span", { class: "ui-accordion__label", children: n.label })
          ]
        }
      ),
      e ? /* @__PURE__ */ i("div", { class: "ui-accordion__content", children: (n.components ?? []).map((t, u) => /* @__PURE__ */ i(_, { component: t, context: o.context }, u)) }) : null
    ] }, n.id);
  }) });
}
export {
  b as default
};
