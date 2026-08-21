import { jsxs as s, jsx as n } from "preact/jsx-runtime";
import { computed as b, useSignal as m } from "@preact/signals";
import { useRef as J, useEffect as ne } from "preact/hooks";
import { i18nStore as ue, useContainerQuery as oe, useCfg as se, useData as ie, animationApi as re, formatValue as j, findAction as w, runAction as k, buildModelParams as ce, sessionStore as Q, isDisabledByModel as de } from "@cutcrft/plugin-sdk";
function he(o) {
  var E;
  const d = ue.t, M = J(null), U = oe(M), l = se(o.config, {
    // V7.3: auto-refresh via revision signals; the manual button is opt-in.
    showRefresh: !1,
    showRowCount: !0,
    searchable: !1,
    sortable: !1,
    pagination: { pageSize: 10, pageSizeOptions: [10, 25, 50] }
  }), N = b(() => {
    if (l.value.data) return l.value.data;
    const e = o.config.command;
    if (e)
      return { command: e, entityType: o.config.entityType };
  }), { value: S, error: P, loading: p, reload: _ } = ie(
    () => N.value,
    () => o.context ?? {}
  ), f = b(
    () => Array.isArray(S.value) ? S.value : []
  ), x = J(null);
  ne(() => {
    if (!x.current || !f.value.length) return;
    const e = x.current, a = re.apply(e, {
      keyframes: [{ backgroundColor: "rgba(64, 128, 255, 0.08)" }, { backgroundColor: "rgba(64, 128, 255, 0)" }],
      duration: 400,
      easing: "ease-out",
      iterations: 1,
      fill: "none"
    });
    return () => a();
  }, [S.value]);
  const C = b(() => {
    if (l.value.columns && l.value.columns.length > 0) return l.value.columns;
    const e = o.config.columns;
    if (e && e.length > 0) return e;
    const a = f.value[0];
    return a ? Object.keys(a).map((u) => ({ key: u })) : [];
  }), R = m(""), q = b(() => {
    const e = R.value.trim().toLowerCase();
    if (!e) return f.value;
    const a = C.value;
    return f.value.filter(
      (u) => a.some((t) => j(u[t.key]).toLowerCase().includes(e))
    );
  }), h = m(null), g = m("asc");
  function K(e) {
    return e.sortable ?? l.value.sortable ?? !1;
  }
  function V(e) {
    h.value === e ? g.value = g.value === "asc" ? "desc" : "asc" : (h.value = e, g.value = "asc");
  }
  const A = b(() => {
    if (!h.value) return q.value;
    const e = h.value;
    return [...q.value].sort((a, u) => {
      const t = a[e], r = u[e];
      let i;
      return typeof t == "number" && typeof r == "number" ? i = t - r : i = String(t ?? "").localeCompare(String(r ?? "")), g.value === "asc" ? i : -i;
    });
  }), v = l.value.pagination === !1 ? null : l.value.pagination ?? {}, D = v !== null, y = m((v == null ? void 0 : v.pageSize) ?? 10), W = (v == null ? void 0 : v.pageSizeOptions) ?? [10, 25, 50], c = m(1), L = b(() => D ? Math.max(1, Math.ceil(A.value.length / y.value)) : 1), T = b(() => {
    if (!D) return A.value;
    const e = (c.value - 1) * y.value;
    return A.value.slice(e, e + y.value);
  }), z = (((E = l.value.rowActions) == null ? void 0 : E.length) ?? 0) + (l.value.deleteCommand || o.config.deleteCommand ? 1 : 0), O = m(/* @__PURE__ */ new Set());
  function G(e) {
    var r;
    const a = String(e.id ?? e[((r = C.value[0]) == null ? void 0 : r.key) ?? ""]), u = new Set(O.value);
    u.has(a) ? u.delete(a) : u.add(a), O.value = u;
    const t = f.value.filter((i) => {
      var I;
      return u.has(String(i.id ?? i[((I = C.value[0]) == null ? void 0 : I.key) ?? ""]));
    });
    k(w(l.value.actions, "selectionChange"), { ...o.context ?? {}, payload: { selected: t } });
  }
  function H(e, a) {
    return String(e.id ?? a);
  }
  function X(e) {
    return e.label ?? e.key;
  }
  function Y(e, a) {
    var t, r, i;
    if ((t = e.badge) != null && t.toneField) return a[e.badge.toneField] ?? "neutral";
    const u = j(a[e.key]);
    return ((i = (r = e.badge) == null ? void 0 : r.tones) == null ? void 0 : i[u]) ?? "neutral";
  }
  function B(e, a) {
    return j(a[e.key]);
  }
  function Z(e) {
    k(w(l.value.actions, "rowSelect"), { ...o.context ?? {}, row: e });
  }
  async function ee(e, a) {
    if (e.confirm && !window.confirm(e.confirm)) return;
    const u = { ...o.context ?? {}, row: a };
    if (e.spec) {
      await k({ event: "click", spec: e.spec, confirm: e.confirm }, u);
      return;
    }
    if (e.command)
      try {
        const t = ce(e.command, e.params, e.entityType, e.fields, u);
        await Q.executeCommand(e.command, t), await _();
      } catch {
      }
  }
  function te(e, a) {
    return de(e.disabledWhen, { ...o.context ?? {}, row: a });
  }
  async function le(e) {
    if (typeof e.id != "string") return;
    const a = w(l.value.actions, "rowDelete");
    if (a) {
      await k(a, { ...o.context ?? {}, row: e }), await _();
      return;
    }
    const u = l.value.deleteCommand ?? o.config.deleteCommand;
    if (u && window.confirm("Delete this row?"))
      try {
        await Q.executeCommand(u, { id: e.id }), await _();
      } catch {
      }
  }
  const ae = !!(l.value.deleteCommand || o.config.deleteCommand || w(l.value.actions, "rowDelete")), $ = C.value, F = $.length + (l.value.selectable ? 1 : 0) + (z > 0 ? 1 : 0);
  return /* @__PURE__ */ s("div", { ref: M, class: `ui-table ui-table--cq-${U.value}${l.value.className ? " " + l.value.className : ""}`, style: l.value.style, title: l.value.tooltip, children: [
    l.value.searchable || l.value.showRefresh || l.value.showRowCount ? /* @__PURE__ */ s("div", { class: "ui-table__toolbar", children: [
      l.value.searchable ? /* @__PURE__ */ n(
        "input",
        {
          class: "ui-table__search",
          type: "search",
          placeholder: d("core.table.search"),
          value: R.value,
          onInput: (e) => {
            R.value = e.target.value, c.value = 1;
          }
        }
      ) : null,
      l.value.showRowCount ? /* @__PURE__ */ n("span", { class: "ui-table__count", children: d("core.table.rows", { count: f.value.length }) }) : null,
      l.value.showRefresh ? /* @__PURE__ */ n("button", { class: "ui-button ui-button--small", disabled: p.value, onClick: () => _(), children: p.value ? d("core.button.loading") : d("core.table.refresh") }) : null
    ] }) : null,
    P.value ? /* @__PURE__ */ n("p", { class: "ui-table__error", children: P.value }) : /* @__PURE__ */ s("table", { class: "ui-table__grid", children: [
      /* @__PURE__ */ n("thead", { children: /* @__PURE__ */ s("tr", { children: [
        l.value.selectable ? /* @__PURE__ */ n("th", { class: "ui-table__checkbox-col" }) : null,
        $.map((e) => /* @__PURE__ */ s(
          "th",
          {
            style: { width: e.width, textAlign: e.align },
            class: K(e) ? "ui-table__sortable" : "",
            onClick: () => K(e) && V(e.key),
            children: [
              X(e),
              h.value === e.key ? /* @__PURE__ */ n("span", { class: "ui-table__sort-indicator", children: g.value === "asc" ? "↑" : "↓" }) : null
            ]
          },
          e.key
        )),
        z > 0 ? /* @__PURE__ */ n("th", { class: "ui-table__actions-col" }) : null
      ] }) }),
      /* @__PURE__ */ s("tbody", { ref: x, children: [
        p.value && T.value.length === 0 ? /* @__PURE__ */ n("tr", { children: /* @__PURE__ */ n("td", { colspan: F, class: "ui-table__state", children: d("core.button.loading") }) }) : null,
        !p.value && T.value.length === 0 ? /* @__PURE__ */ n("tr", { children: /* @__PURE__ */ n("td", { colspan: F, class: "ui-table__state", children: l.value.emptyText ?? d("core.table.empty") }) }) : null,
        T.value.map((e, a) => {
          var u;
          return /* @__PURE__ */ s(
            "tr",
            {
              class: "ui-table__row",
              "data-gesture-role": "row",
              "data-gesture-object-type": ((u = N.value) == null ? void 0 : u.entityType) ?? void 0,
              "data-gesture-row": JSON.stringify(e),
              onClick: () => Z(e),
              children: [
                l.value.selectable ? /* @__PURE__ */ n("td", { class: "ui-table__checkbox-col", children: /* @__PURE__ */ n(
                  "input",
                  {
                    type: "checkbox",
                    checked: O.value.has(String(e.id)),
                    onClick: (t) => {
                      t.stopPropagation(), G(e);
                    }
                  }
                ) }) : null,
                $.map((t) => /* @__PURE__ */ s("td", { style: { textAlign: t.align }, children: [
                  t.render === "badge" ? /* @__PURE__ */ n("span", { class: "ui-table__badge-wrap", children: /* @__PURE__ */ n("span", { class: `ui-badge ui-badge--${Y(t, e)}`, children: B(t, e) }) }) : null,
                  t.render === "boolean" ? /* @__PURE__ */ n("span", { class: `ui-table__bool ${e[t.key] ? "ui-table__bool--yes" : "ui-table__bool--no"}`, children: e[t.key] ? "✓" : "✕" }) : null,
                  t.render !== "badge" && t.render !== "boolean" ? /* @__PURE__ */ n("span", { children: B(t, e) }) : null
                ] }, t.key)),
                z > 0 ? /* @__PURE__ */ s("td", { class: "ui-table__actions-col", onClick: (t) => t.stopPropagation(), children: [
                  (l.value.rowActions ?? []).map((t) => /* @__PURE__ */ n(
                    "button",
                    {
                      class: `ui-button ui-button--small${t.variant === "danger" ? " ui-button--danger" : ""}`,
                      disabled: te(t, e),
                      onClick: () => ee(t, e),
                      children: t.label
                    },
                    t.label
                  )),
                  ae ? /* @__PURE__ */ n("button", { class: "ui-button ui-button--small ui-button--danger", onClick: () => le(e), children: d("core.table.delete") }) : null
                ] }) : null
              ]
            },
            H(e, a)
          );
        })
      ] })
    ] }),
    D ? /* @__PURE__ */ s("div", { class: "ui-table__pagination", children: [
      /* @__PURE__ */ n("button", { class: "ui-button ui-button--small", disabled: c.value <= 1, onClick: () => {
        c.value -= 1;
      }, children: "‹" }),
      /* @__PURE__ */ s("span", { class: "ui-table__page-info", children: [
        c.value,
        " / ",
        L.value
      ] }),
      /* @__PURE__ */ n("button", { class: "ui-button ui-button--small", disabled: c.value >= L.value, onClick: () => {
        c.value += 1;
      }, children: "›" }),
      /* @__PURE__ */ n(
        "select",
        {
          class: "ui-table__page-size",
          value: y.value,
          onChange: (e) => {
            y.value = Number(e.target.value), c.value = 1;
          },
          children: W.map((e) => /* @__PURE__ */ n("option", { value: e, children: e }, e))
        }
      )
    ] }) : null
  ] });
}
export {
  he as default
};
