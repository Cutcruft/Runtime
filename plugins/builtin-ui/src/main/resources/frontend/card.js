import { defineComponent as x, ref as v, openBlock as o, createElementBlock as n, normalizeStyle as p, unref as t, normalizeClass as f, createElementVNode as h, toDisplayString as d, createCommentVNode as a, Fragment as y, renderList as b, createBlock as A } from "vue";
import { useContainerQuery as B, useCfg as N, runAction as S, findAction as $, resolveParams as k, sessionStore as q } from "@cutcrft/runtime-client";
import { C as z } from "./vendor.js";
import { _ as E } from "./vendor2.js";
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
    const s = u, _ = v(null), C = B(_), e = N(s.config, {
      bordered: !0,
      padding: "var(--rt-space-lg)"
    });
    async function g(c, i) {
      c && (S($(e.value.actions, "headerAction"), {
        ...s.context ?? {},
        payload: { command: c, params: k(i, s.context ?? {}) }
      }), await q.executeCommand(c, k(i, s.context ?? {})));
    }
    return (c, i) => {
      var m;
      return o(), n("section", {
        ref_key: "root",
        ref: _,
        class: f(["ui-card", [t(e).className, `ui-card--cq-${t(C)}`, { "ui-card--bordered": t(e).bordered }]]),
        style: p(t(e).style)
      }, [
        t(e).title || t(e).subtitle || (m = t(e).headerActions) != null && m.length ? (o(), n("header", U, [
          h("div", V, [
            t(e).title ? (o(), n("h3", w, d(t(e).title), 1)) : a("", !0),
            t(e).subtitle ? (o(), n("p", D, d(t(e).subtitle), 1)) : a("", !0)
          ]),
          t(e).headerActions ? (o(), n("div", F, [
            (o(!0), n(y, null, b(t(e).headerActions, (r, l) => (o(), n("button", {
              key: l,
              class: f(["ui-button", [`ui-button--${r.variant ?? "default"}`, "ui-button--small"]]),
              onClick: (L) => g(r.command ?? "", r.params)
            }, d(r.label), 11, H))), 128))
          ])) : a("", !0)
        ])) : a("", !0),
        h("div", {
          class: "ui-card__body",
          style: p({ padding: t(e).padding })
        }, [
          (o(!0), n(y, null, b(t(e).components ?? [], (r, l) => (o(), A(z, {
            key: l,
            component: r,
            context: u.context
          }, null, 8, ["component", "context"]))), 128))
        ], 4)
      ], 6);
    };
  }
}), J = /* @__PURE__ */ E(I, [["__scopeId", "data-v-0bf32297"]]);
export {
  J as default
};
