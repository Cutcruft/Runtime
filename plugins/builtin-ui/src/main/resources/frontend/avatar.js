import { defineComponent as u, computed as l, openBlock as a, createElementBlock as s, unref as e, normalizeStyle as m, normalizeClass as _, toDisplayString as f } from "vue";
import { useCfg as v, iconView as d } from "@cutcrft/runtime-client";
import { _ as g } from "./vendor.js";
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
    return (i, n) => (a(), s("span", {
      class: _(["ui-avatar", [`ui-avatar--${e(t).size}`, `ui-avatar--${e(t).tone}`, e(t).className]]),
      style: m(e(t).style),
      title: e(t).tooltip
    }, [
      o.value ? (a(), s("img", {
        key: 0,
        class: "ui-avatar__img",
        src: o.value,
        alt: ""
      }, null, 8, k)) : (a(), s("span", x, f(p.value), 1))
    ], 14, y));
  }
}), b = /* @__PURE__ */ g(h, [["__scopeId", "data-v-9eb89272"]]);
export {
  b as default
};
