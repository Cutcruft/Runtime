import { defineComponent as c, unref as e, openBlock as o, createElementBlock as i, normalizeStyle as n, normalizeClass as l, toDisplayString as p } from "vue";
import { useCfg as m } from "@cutcrft/runtime-client";
import { _ as f } from "./vendor2.js";
const _ = ["src", "alt", "title"], g = {
  key: 1,
  class: "ui-image--empty"
}, h = /* @__PURE__ */ c({
  __name: "UiImage",
  props: {
    config: {},
    context: {}
  },
  setup(a) {
    const t = m(a.config, { fit: "cover" });
    function r(s) {
      return s.startsWith("http") || s.startsWith("data:") || s.startsWith("/");
    }
    return (s, d) => e(t).src && r(e(t).src) ? (o(), i("img", {
      key: 0,
      class: l(["ui-image", e(t).className]),
      src: e(t).src,
      alt: e(t).alt ?? "",
      title: e(t).tooltip,
      style: n({ objectFit: e(t).fit, width: e(t).width, height: e(t).height, ...e(t).style ?? {} })
    }, null, 14, _)) : (o(), i("span", g, "image: " + p(e(t).src), 1));
  }
}), C = /* @__PURE__ */ f(h, [["__scopeId", "data-v-a5484b6f"]]);
export {
  C as default
};
