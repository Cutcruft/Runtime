import { jsxs as d, jsx as c } from "preact/jsx-runtime";
import { useSignal as f } from "@preact/signals";
import { useCfg as b, isDisabledByModel as y, findAction as r, mountShortcut as h, iconView as p, runAction as g, buildModelParams as x, sessionStore as _ } from "@cutcrft/plugin-sdk";
import { useEffect as k } from "preact/hooks";
function A(n) {
  var i;
  const e = b(n.config, { label: "Execute", variant: "default", size: "medium" }), t = f(!1), u = { ...n.context ?? {}, page: ((i = n.context) == null ? void 0 : i.page) ?? null }, m = y(e.value.disabledWhen, u), s = t.value || e.value.disabled || m;
  async function v() {
    if (s) return;
    const a = r(e.value.actions, "click");
    if (a) {
      t.value = !0;
      try {
        await g(a, u);
      } finally {
        t.value = !1;
      }
      return;
    }
    if (e.value.command) {
      const o = x(
        e.value.command,
        e.value.params,
        e.value.entityType,
        e.value.fields,
        u
      );
      t.value = !0;
      try {
        await _.executeCommand(e.value.command, o);
      } finally {
        t.value = !1;
      }
    }
  }
  k(() => {
    const a = e.value.shortcutKeys;
    if (a && a.length > 0 && (e.value.command || r(e.value.actions, "click"))) {
      const o = {
        id: `button:${e.value.command ?? "action"}:${e.value.label ?? "btn"}`,
        keys: a,
        action: "command",
        command: e.value.command,
        params: e.value.params,
        scope: "component"
      };
      return h(o);
    }
  }, [e.value.command, e.value.shortcutKeys]);
  const l = p(e.value.icon);
  return /* @__PURE__ */ d(
    "button",
    {
      class: `ui-button ui-button--${e.value.variant} ui-button--${e.value.size}${e.value.className ? " " + e.value.className : ""}`,
      disabled: s,
      title: e.value.tooltip,
      style: e.value.style,
      onClick: v,
      children: [
        l.src ? /* @__PURE__ */ c("img", { class: "ui-button__icon ui-button__icon--img", src: l.src, alt: "" }) : null,
        l.glyph ? /* @__PURE__ */ c("span", { class: "ui-button__icon", children: l.glyph }) : null,
        t.value ? "Working…" : e.value.label,
        e.value.shortcutKeys && e.value.shortcutKeys.length > 0 ? /* @__PURE__ */ c("kbd", { class: "ui-button__shortcut", children: e.value.shortcutKeys.join(" ") }) : null
      ]
    }
  );
}
export {
  A as default
};
