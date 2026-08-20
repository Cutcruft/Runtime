import { jsxs as f, jsx as r, Fragment as q } from "preact/jsx-runtime";
import { useSignal as y } from "@preact/signals";
import { useRef as I } from "preact/hooks";
import { i18nStore as N, useContainerQuery as $, useCfg as k, useData as w, Container as L, formatValue as T, runAction as Q, findAction as R } from "@cutcrft/runtime-client";
function B(o) {
  const g = N.t, m = I(null), S = $(m), a = k(o.config, { labelField: "name", itemKey: "id" }), { value: p, error: c, loading: i } = w(
    () => a.value.data,
    () => o.context ?? {}
  ), n = Array.isArray(p.value) ? p.value : [], u = y(null), s = y(null);
  function F(e) {
    return a.value.labelField ? T(e[a.value.labelField]) : "";
  }
  function A(e) {
    return a.value.valueField ? T(e[a.value.valueField]) : "";
  }
  function v(e, l) {
    const t = a.value.itemKey;
    return String(t ? e[t] ?? l : l);
  }
  function _(e, l) {
    a.value.sortable && (u.value = e, l.dataTransfer && (l.dataTransfer.effectAllowed = "move", l.dataTransfer.setData("text/plain", String(e))));
  }
  function b(e, l) {
    !a.value.sortable || u.value === null || (l.preventDefault(), l.dataTransfer && (l.dataTransfer.dropEffect = "move"), s.value = e);
  }
  function D(e) {
    if (!a.value.sortable || u.value === null) return;
    const l = u.value, t = e;
    if (u.value = null, s.value = null, l === t) return;
    const C = n[l] ?? null, d = [...n], [E] = d.splice(l, 1);
    d.splice(t, 0, E);
    const K = d.map((O, j) => v(O, j));
    Q(R(a.value.actions, "reorder"), {
      ...o.context ?? {},
      payload: { from: l, to: t, row: C, ids: K }
    });
  }
  function h(e, l) {
    let t = l;
    return a.value.sortable && u.value === e && (t += " ui-list__drag--dragging"), a.value.sortable && s.value === e && u.value !== null && u.value !== e && (t += " ui-list__drag--over"), t;
  }
  return /* @__PURE__ */ f("div", { ref: m, class: `ui-list ui-list--cq-${S.value}${a.value.className ? " " + a.value.className : ""}`, style: a.value.style, title: a.value.tooltip, children: [
    i.value && n.length === 0 ? /* @__PURE__ */ r("p", { class: "ui-list__state", children: g("core.button.loading") }) : null,
    !i.value && c.value ? /* @__PURE__ */ r("p", { class: "ui-list__error", children: c.value }) : null,
    !i.value && !c.value ? /* @__PURE__ */ f(q, { children: [
      a.value.itemTemplate ? /* @__PURE__ */ r("ul", { class: "ui-list__templated", children: n.map((e, l) => /* @__PURE__ */ r(
        "li",
        {
          draggable: a.value.sortable,
          class: h(l, "ui-list__drag"),
          onDragStart: (t) => _(l, t),
          onDragOver: (t) => b(l, t),
          onDrop: () => D(l),
          onDragEnd: () => {
            u.value = null, s.value = null;
          },
          children: /* @__PURE__ */ r(L, { component: a.value.itemTemplate, context: { ...o.context ?? {}, row: e } })
        },
        v(e, l)
      )) }) : /* @__PURE__ */ r("ul", { class: "ui-list__plain", children: n.map((e, l) => /* @__PURE__ */ f(
        "li",
        {
          draggable: a.value.sortable,
          class: h(l, "ui-list__row"),
          onDragStart: (t) => _(l, t),
          onDragOver: (t) => b(l, t),
          onDrop: () => D(l),
          onDragEnd: () => {
            u.value = null, s.value = null;
          },
          children: [
            /* @__PURE__ */ r("span", { class: "ui-list__label", children: F(e) }),
            a.value.valueField ? /* @__PURE__ */ r("span", { class: "ui-list__value", children: A(e) }) : null
          ]
        },
        v(e, l)
      )) }),
      !i.value && n.length === 0 ? /* @__PURE__ */ r("p", { class: "ui-list__state", children: a.value.emptyText ?? g("core.table.empty") }) : null
    ] }) : null
  ] });
}
export {
  B as default
};
