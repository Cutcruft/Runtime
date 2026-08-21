import { jsx as r, Fragment as i } from "preact/jsx-runtime";
import { Container as m } from "@cutcrft/plugin-sdk";
function l(t) {
  const o = t.config, n = o.children ?? o.components;
  return n != null && n.length ? /* @__PURE__ */ r(i, { children: n.map((e, c) => /* @__PURE__ */ r(m, { component: e, context: t.context }, c)) }) : null;
}
export {
  l as r
};
