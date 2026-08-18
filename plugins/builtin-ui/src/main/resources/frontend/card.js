import { defineComponent as x, ref as v, openBlock as o, createElementBlock as n, normalizeStyle as p, unref as e, normalizeClass as f, createElementVNode as h, toDisplayString as d, createCommentVNode as a, Fragment as y, renderList as b, createBlock as A } from "vue";
import { useContainerQuery as B, useCfg as N, ComponentHost as S, runAction as $, findAction as q, resolveParams as k, sessionStore as z } from "@cutcrft/runtime-client";
import { _ as E } from "./vendor.js";
const U = {
  key: 0,
  class: "ui-card__header"
}, V = { class: "ui-card__heading" }, w = {
  key: 0,
  class: "ui-card__title"
}, D = {
  key: 1,
  class: "ui-card__subtitle"
}, F = {
  key: 0,
  class: "ui-card__actions"
}, H = ["onClick"], I = /* @__PURE__ */ x({
  __name: "UiCard",
  props: {
    config: {},
    context: {}
  },
  setup(u) {
    const s = u, _ = v(null), g = B(_), t = N(s.config, {
      bordered: !0,
      padding: "var(--rt-space-lg)"
    });
    async function C(c, i) {
      c && ($(q(t.value.actions, "headerAction"), {
        ...s.context ?? {},
        payload: { command: c, params: k(i, s.context ?? {}) }
      }), await z.executeCommand(c, k(i, s.context ?? {})));
    }
    return (c, i) => {
      var m;
      return o(), n("section", {
        ref_key: "root",
        ref: _,
        class: f(["ui-card", [e(t).className, `ui-card--cq-${e(g)}`, { "ui-card--bordered": e(t).bordered }]]),
        style: p(e(t).style)
      }, [
        e(t).title || e(t).subtitle || (m = e(t).headerActions) != null && m.length ? (o(), n("header", U, [
          h("div", V, [
            e(t).title ? (o(), n("h3", w, d(e(t).title), 1)) : a("", !0),
            e(t).subtitle ? (o(), n("p", D, d(e(t).subtitle), 1)) : a("", !0)
          ]),
          e(t).headerActions ? (o(), n("div", F, [
            (o(!0), n(y, null, b(e(t).headerActions, (r, l) => (o(), n("button", {
              key: l,
              class: f(["ui-button", [`ui-button--${r.variant ?? "default"}`, "ui-button--small"]]),
              onClick: (L) => C(r.command ?? "", r.params)
            }, d(r.label), 11, H))), 128))
          ])) : a("", !0)
        ])) : a("", !0),
        h("div", {
          class: "ui-card__body",
          style: p({ padding: e(t).padding })
        }, [
          (o(!0), n(y, null, b(e(t).components ?? [], (r, l) => (o(), A(e(S), {
            key: l,
            component: r,
            context: u.context
          }, null, 8, ["component", "context"]))), 128))
        ], 4)
      ], 6);
    };
  }
}), G = /* @__PURE__ */ E(I, [["__scopeId", "data-v-117c9299"]]);
export {
  G as default
};
