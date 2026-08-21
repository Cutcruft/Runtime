import { jsxs as n, jsx as l } from "preact/jsx-runtime";
import { useRef as v } from "preact/hooks";
import { useContainerQuery as h, useCfg as m, Container as f, runAction as b, findAction as _, resolveParams as r, sessionStore as g } from "@cutcrft/plugin-sdk";
function A(i) {
  var u;
  const c = v(null), s = h(c), e = m(i.config, { bordered: !0, padding: "var(--rt-space-lg)" });
  async function d(a, t) {
    a && (b(_(e.value.actions, "headerAction"), {
      ...i.context ?? {},
      payload: { command: a, params: r(t, i.context ?? {}) }
    }), await g.executeCommand(a, r(t, i.context ?? {})));
  }
  const o = i.context;
  return /* @__PURE__ */ n(
    "section",
    {
      ref: c,
      class: `ui-card ui-card--cq-${s.value}${e.value.bordered ? " ui-card--bordered" : ""}${e.value.className ? " " + e.value.className : ""}`,
      style: e.value.style,
      children: [
        e.value.title || e.value.subtitle || (u = e.value.headerActions) != null && u.length ? /* @__PURE__ */ n("header", { class: "ui-card__header", children: [
          /* @__PURE__ */ n("div", { class: "ui-card__heading", children: [
            e.value.title ? /* @__PURE__ */ l("h3", { class: "ui-card__title", children: e.value.title }) : null,
            e.value.subtitle ? /* @__PURE__ */ l("p", { class: "ui-card__subtitle", children: e.value.subtitle }) : null
          ] }),
          e.value.headerActions ? /* @__PURE__ */ l("div", { class: "ui-card__actions", children: e.value.headerActions.map((a, t) => /* @__PURE__ */ l(
            "button",
            {
              class: `ui-button ui-button--${a.variant ?? "default"} ui-button--small`,
              onClick: () => d(a.command ?? "", a.params),
              children: a.label
            },
            t
          )) }) : null
        ] }) : null,
        /* @__PURE__ */ l("div", { class: "ui-card__body", style: { padding: e.value.padding }, children: (e.value.components ?? []).map((a, t) => /* @__PURE__ */ l(f, { component: a, context: o }, t)) })
      ]
    }
  );
}
export {
  A as default
};
