import { defineComponent as b, ref as h, computed as g, onMounted as k, onUnmounted as x, openBlock as a, createElementBlock as c, normalizeStyle as C, unref as e, normalizeClass as z, toDisplayString as i, createCommentVNode as d, Fragment as v, createTextVNode as f } from "vue";
import { useCfg as K, findAction as p, mountShortcut as S, iconView as s, runAction as $, sessionStore as w, resolveParams as A } from "@cutcrft/runtime-client";
const B = ["disabled", "title"], N = ["src"], V = {
  key: 1,
  class: "ui-button__icon"
}, E = {
  key: 4,
  class: "ui-button__shortcut"
}, D = /* @__PURE__ */ b({
  __name: "UiButton",
  props: {
    config: {},
    context: {}
  },
  setup(y) {
    const u = y, t = K(u.config, {
      label: "Execute",
      variant: "default",
      size: "medium"
    }), o = h(!1), r = g(() => {
      var n;
      return { ...u.context ?? {}, page: ((n = u.context) == null ? void 0 : n.page) ?? null };
    });
    async function _() {
      if (o.value || t.value.disabled) return;
      const n = p(t.value.actions, "click");
      if (n) {
        o.value = !0;
        try {
          await $(n, r.value);
        } finally {
          o.value = !1;
        }
        return;
      }
      if (t.value.command) {
        o.value = !0;
        try {
          await w.executeCommand(t.value.command, A(t.value.params, r.value));
        } finally {
          o.value = !1;
        }
      }
    }
    let l = null;
    return k(() => {
      const n = t.value.shortcutKeys;
      if (n && n.length > 0 && (t.value.command || p(t.value.actions, "click"))) {
        const m = {
          id: `button:${t.value.command ?? "action"}:${t.value.label ?? "btn"}`,
          keys: n,
          action: "command",
          command: t.value.command,
          params: t.value.params,
          scope: "component"
        };
        l = S(m);
      }
    }), x(() => {
      l == null || l();
    }), (n, m) => (a(), c("button", {
      class: z(["ui-button", [`ui-button--${e(t).variant}`, `ui-button--${e(t).size}`, e(t).className]]),
      disabled: o.value || e(t).disabled,
      title: e(t).tooltip,
      style: C(e(t).style),
      onClick: _
    }, [
      e(s)(e(t).icon).src ? (a(), c("img", {
        key: 0,
        class: "ui-button__icon ui-button__icon--img",
        src: e(s)(e(t).icon).src,
        alt: ""
      }, null, 8, N)) : e(s)(e(t).icon).glyph ? (a(), c("span", V, i(e(s)(e(t).icon).glyph), 1)) : d("", !0),
      o.value ? (a(), c(v, { key: 2 }, [
        f("Working…")
      ], 64)) : (a(), c(v, { key: 3 }, [
        f(i(e(t).label), 1)
      ], 64)),
      e(t).shortcutKeys && e(t).shortcutKeys.length > 0 ? (a(), c("kbd", E, i(e(t).shortcutKeys.join(" ")), 1)) : d("", !0)
    ], 14, B));
  }
});
export {
  D as default
};
