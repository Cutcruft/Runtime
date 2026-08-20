import { jsxs as o, jsx as n } from "preact/jsx-runtime";
import { computed as b, useSignal as h } from "@preact/signals";
import { useRef as te } from "preact/hooks";
import { i18nStore as ae, useContainerQuery as ne, useCfg as ue, useData as se, formatValue as O, findAction as C, runAction as k, buildModelParams as oe, sessionStore as J, isDisabledByModel as ie } from "@cutcrft/runtime-client";
function be(s) {
  var F;
  const d = ae.t, $ = te(null), Q = ne($), t = ue(s.config, {
    // V7.3: auto-refresh via revision signals; the manual button is opt-in.
    showRefresh: !1,
    showRowCount: !0,
    searchable: !1,
    sortable: !1,
    pagination: { pageSize: 10, pageSizeOptions: [10, 25, 50] }
  }), j = b(() => {
    if (t.value.data) return t.value.data;
    const e = s.config.command;
    if (e)
      return { command: e, entityType: s.config.entityType };
  }), { value: M, error: N, loading: p, reload: _ } = se(
    () => j.value,
    () => s.context ?? {}
  ), m = b(
    () => Array.isArray(M.value) ? M.value : []
  ), w = b(() => {
    if (t.value.columns && t.value.columns.length > 0) return t.value.columns;
    const e = s.config.columns;
    if (e && e.length > 0) return e;
    const a = m.value[0];
    return a ? Object.keys(a).map((u) => ({ key: u })) : [];
  }), S = h(""), P = b(() => {
    const e = S.value.trim().toLowerCase();
    if (!e) return m.value;
    const a = w.value;
    return m.value.filter(
      (u) => a.some((l) => O(u[l.key]).toLowerCase().includes(e))
    );
  }), f = h(null), g = h("asc");
  function q(e) {
    return e.sortable ?? t.value.sortable ?? !1;
  }
  function U(e) {
    f.value === e ? g.value = g.value === "asc" ? "desc" : "asc" : (f.value = e, g.value = "asc");
  }
  const x = b(() => {
    if (!f.value) return P.value;
    const e = f.value;
    return [...P.value].sort((a, u) => {
      const l = a[e], c = u[e];
      let i;
      return typeof l == "number" && typeof c == "number" ? i = l - c : i = String(l ?? "").localeCompare(String(c ?? "")), g.value === "asc" ? i : -i;
    });
  }), v = t.value.pagination === !1 ? null : t.value.pagination ?? {}, R = v !== null, y = h((v == null ? void 0 : v.pageSize) ?? 10), V = (v == null ? void 0 : v.pageSizeOptions) ?? [10, 25, 50], r = h(1), K = b(() => R ? Math.max(1, Math.ceil(x.value.length / y.value)) : 1), A = b(() => {
    if (!R) return x.value;
    const e = (r.value - 1) * y.value;
    return x.value.slice(e, e + y.value);
  }), D = (((F = t.value.rowActions) == null ? void 0 : F.length) ?? 0) + (t.value.deleteCommand || s.config.deleteCommand ? 1 : 0), T = h(/* @__PURE__ */ new Set());
  function W(e) {
    var c;
    const a = String(e.id ?? e[((c = w.value[0]) == null ? void 0 : c.key) ?? ""]), u = new Set(T.value);
    u.has(a) ? u.delete(a) : u.add(a), T.value = u;
    const l = m.value.filter((i) => {
      var I;
      return u.has(String(i.id ?? i[((I = w.value[0]) == null ? void 0 : I.key) ?? ""]));
    });
    k(C(t.value.actions, "selectionChange"), { ...s.context ?? {}, payload: { selected: l } });
  }
  function E(e, a) {
    return String(e.id ?? a);
  }
  function G(e) {
    return e.label ?? e.key;
  }
  function H(e, a) {
    var l, c, i;
    if ((l = e.badge) != null && l.toneField) return a[e.badge.toneField] ?? "neutral";
    const u = O(a[e.key]);
    return ((i = (c = e.badge) == null ? void 0 : c.tones) == null ? void 0 : i[u]) ?? "neutral";
  }
  function L(e, a) {
    return O(a[e.key]);
  }
  function X(e) {
    k(C(t.value.actions, "rowSelect"), { ...s.context ?? {}, row: e });
  }
  async function Y(e, a) {
    if (e.confirm && !window.confirm(e.confirm)) return;
    const u = { ...s.context ?? {}, row: a };
    if (e.spec) {
      await k({ event: "click", spec: e.spec, confirm: e.confirm }, u);
      return;
    }
    if (e.command)
      try {
        const l = oe(e.command, e.params, e.entityType, e.fields, u);
        await J.executeCommand(e.command, l), await _();
      } catch {
      }
  }
  function Z(e, a) {
    return ie(e.disabledWhen, { ...s.context ?? {}, row: a });
  }
  async function ee(e) {
    if (typeof e.id != "string") return;
    const a = C(t.value.actions, "rowDelete");
    if (a) {
      await k(a, { ...s.context ?? {}, row: e }), await _();
      return;
    }
    const u = t.value.deleteCommand ?? s.config.deleteCommand;
    if (u && window.confirm("Delete this row?"))
      try {
        await J.executeCommand(u, { id: e.id }), await _();
      } catch {
      }
  }
  const le = !!(t.value.deleteCommand || s.config.deleteCommand || C(t.value.actions, "rowDelete")), z = w.value, B = z.length + (t.value.selectable ? 1 : 0) + (D > 0 ? 1 : 0);
  return /* @__PURE__ */ o("div", { ref: $, class: `ui-table ui-table--cq-${Q.value}${t.value.className ? " " + t.value.className : ""}`, style: t.value.style, title: t.value.tooltip, children: [
    t.value.searchable || t.value.showRefresh || t.value.showRowCount ? /* @__PURE__ */ o("div", { class: "ui-table__toolbar", children: [
      t.value.searchable ? /* @__PURE__ */ n(
        "input",
        {
          class: "ui-table__search",
          type: "search",
          placeholder: d("core.table.search"),
          value: S.value,
          onInput: (e) => {
            S.value = e.target.value, r.value = 1;
          }
        }
      ) : null,
      t.value.showRowCount ? /* @__PURE__ */ n("span", { class: "ui-table__count", children: d("core.table.rows", { count: m.value.length }) }) : null,
      t.value.showRefresh ? /* @__PURE__ */ n("button", { class: "ui-button ui-button--small", disabled: p.value, onClick: () => _(), children: p.value ? d("core.button.loading") : d("core.table.refresh") }) : null
    ] }) : null,
    N.value ? /* @__PURE__ */ n("p", { class: "ui-table__error", children: N.value }) : /* @__PURE__ */ o("table", { class: "ui-table__grid", children: [
      /* @__PURE__ */ n("thead", { children: /* @__PURE__ */ o("tr", { children: [
        t.value.selectable ? /* @__PURE__ */ n("th", { class: "ui-table__checkbox-col" }) : null,
        z.map((e) => /* @__PURE__ */ o(
          "th",
          {
            style: { width: e.width, textAlign: e.align },
            class: q(e) ? "ui-table__sortable" : "",
            onClick: () => q(e) && U(e.key),
            children: [
              G(e),
              f.value === e.key ? /* @__PURE__ */ n("span", { class: "ui-table__sort-indicator", children: g.value === "asc" ? "↑" : "↓" }) : null
            ]
          },
          e.key
        )),
        D > 0 ? /* @__PURE__ */ n("th", { class: "ui-table__actions-col" }) : null
      ] }) }),
      /* @__PURE__ */ o("tbody", { children: [
        p.value && A.value.length === 0 ? /* @__PURE__ */ n("tr", { children: /* @__PURE__ */ n("td", { colspan: B, class: "ui-table__state", children: d("core.button.loading") }) }) : null,
        !p.value && A.value.length === 0 ? /* @__PURE__ */ n("tr", { children: /* @__PURE__ */ n("td", { colspan: B, class: "ui-table__state", children: t.value.emptyText ?? d("core.table.empty") }) }) : null,
        A.value.map((e, a) => {
          var u;
          return /* @__PURE__ */ o(
            "tr",
            {
              class: "ui-table__row",
              "data-gesture-role": "row",
              "data-gesture-object-type": ((u = j.value) == null ? void 0 : u.entityType) ?? void 0,
              "data-gesture-row": JSON.stringify(e),
              onClick: () => X(e),
              children: [
                t.value.selectable ? /* @__PURE__ */ n("td", { class: "ui-table__checkbox-col", children: /* @__PURE__ */ n(
                  "input",
                  {
                    type: "checkbox",
                    checked: T.value.has(String(e.id)),
                    onClick: (l) => {
                      l.stopPropagation(), W(e);
                    }
                  }
                ) }) : null,
                z.map((l) => /* @__PURE__ */ o("td", { style: { textAlign: l.align }, children: [
                  l.render === "badge" ? /* @__PURE__ */ n("span", { class: "ui-table__badge-wrap", children: /* @__PURE__ */ n("span", { class: `ui-badge ui-badge--${H(l, e)}`, children: L(l, e) }) }) : null,
                  l.render === "boolean" ? /* @__PURE__ */ n("span", { class: `ui-table__bool ${e[l.key] ? "ui-table__bool--yes" : "ui-table__bool--no"}`, children: e[l.key] ? "✓" : "✕" }) : null,
                  l.render !== "badge" && l.render !== "boolean" ? /* @__PURE__ */ n("span", { children: L(l, e) }) : null
                ] }, l.key)),
                D > 0 ? /* @__PURE__ */ o("td", { class: "ui-table__actions-col", onClick: (l) => l.stopPropagation(), children: [
                  (t.value.rowActions ?? []).map((l) => /* @__PURE__ */ n(
                    "button",
                    {
                      class: `ui-button ui-button--small${l.variant === "danger" ? " ui-button--danger" : ""}`,
                      disabled: Z(l, e),
                      onClick: () => Y(l, e),
                      children: l.label
                    },
                    l.label
                  )),
                  le ? /* @__PURE__ */ n("button", { class: "ui-button ui-button--small ui-button--danger", onClick: () => ee(e), children: d("core.table.delete") }) : null
                ] }) : null
              ]
            },
            E(e, a)
          );
        })
      ] })
    ] }),
    R ? /* @__PURE__ */ o("div", { class: "ui-table__pagination", children: [
      /* @__PURE__ */ n("button", { class: "ui-button ui-button--small", disabled: r.value <= 1, onClick: () => {
        r.value -= 1;
      }, children: "‹" }),
      /* @__PURE__ */ o("span", { class: "ui-table__page-info", children: [
        r.value,
        " / ",
        K.value
      ] }),
      /* @__PURE__ */ n("button", { class: "ui-button ui-button--small", disabled: r.value >= K.value, onClick: () => {
        r.value += 1;
      }, children: "›" }),
      /* @__PURE__ */ n(
        "select",
        {
          class: "ui-table__page-size",
          value: y.value,
          onChange: (e) => {
            y.value = Number(e.target.value), r.value = 1;
          },
          children: V.map((e) => /* @__PURE__ */ n("option", { value: e, children: e }, e))
        }
      )
    ] }) : null
  ] });
}
export {
  be as default
};
