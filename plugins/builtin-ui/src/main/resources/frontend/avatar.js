import { defineComponent as u, computed as l, openBlock as e, createElementBlock as s, unref as a, normalizeStyle as m, normalizeClass as _, toDisplayString as f } from "vue";
import { useCfg as v, iconView as d } from "@cutcrft/runtime-client";
import { _ as g } from "./vendor2.js";
const y = ["title"], k = ["src"], x = {
  key: 1,
  class: "ui-avatar__text"
}, h = /* @__PURE__ */ u({
  __name: "UiAvatar",
  props: {
    config: {},
    context: {}
  },
  setup(r) {
    const t = v(r.config, { size: "medium", tone: "neutral", name: "" });
    function c(i) {
      return i.split(/\s+/).filter(Boolean).slice(0, 2).map((n) => n[0]).join("").toUpperCase();
    }
    const p = l(() => t.value.fallback || c(t.value.name ?? "")), o = l(() => d(t.value.src).src);
    return (i, n) => (e(), s("span", {
      class: _(["ui-avatar", [`ui-avatar--${a(t).size}`, `ui-avatar--${a(t).tone}`, a(t).className]]),
      style: m(a(t).style),
      title: a(t).tooltip
    }, [
      o.value ? (e(), s("img", {
        key: 0,
        class: "ui-avatar__img",
        src: o.value,
        alt: ""
      }, null, 8, k)) : (e(), s("span", x, f(p.value), 1))
    ], 14, y));
  }
}), A = /* @__PURE__ */ g(h, [["__scopeId", "data-v-43794088"]]);
export {
  A as default
};
