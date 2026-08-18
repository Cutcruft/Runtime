import { defineComponent as l, computed as p, openBlock as o, createElementBlock as n, unref as s, normalizeClass as d } from "vue";
import { useCfg as m } from "@cutcrft/runtime-client";
import { _ as u } from "./vendor.js";
const f = ["src", "title", "width", "height", "sandbox", "allow"], h = {
  key: 1,
  class: "ui-frame--empty"
}, g = /* @__PURE__ */ l({
  __name: "UiFrame",
  props: {
    config: {},
    context: {}
  },
  setup(i) {
    const t = m(i.config, { src: "" }), a = p(() => {
      const e = t.value.src;
      if (e.startsWith("page:")) {
        const r = e.slice(5);
        return `/embed?page=${encodeURIComponent(r)}`;
      }
      return e.startsWith("asset:") ? `/plugin-assets/${e.slice(6)}` : e;
    });
    function c(e) {
      return e.startsWith("http") || e.startsWith("https");
    }
    return (e, r) => a.value ? (o(), n("iframe", {
      key: 0,
      class: d(["ui-frame", s(t).className]),
      src: a.value,
      title: s(t).title ?? "Embedded frame",
      width: s(t).width,
      height: s(t).height,
      sandbox: s(t).sandbox,
      allow: c(a.value) ? void 0 : "clipboard-read; clipboard-write",
      loading: "lazy"
    }, null, 10, f)) : (o(), n("span", h, "frame: missing src"));
  }
}), w = /* @__PURE__ */ u(g, [["__scopeId", "data-v-d64abb2a"]]);
export {
  w as default
};
