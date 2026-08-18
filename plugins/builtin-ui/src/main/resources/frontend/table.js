import { defineComponent as ve, ref as g, computed as r, watch as be, openBlock as o, createElementBlock as s, unref as l, normalizeStyle as q, normalizeClass as x, withDirectives as W, vModelText as _e, createCommentVNode as b, toDisplayString as i, createElementVNode as _, Fragment as S, renderList as R, createTextVNode as me, withModifiers as X, vModelSelect as fe } from "vue";
import { i18nStore as ge, useContainerQuery as pe, useCfg as ye, useData as he, formatValue as F, findAction as $, runAction as z, sessionStore as Y, resolveParams as ke } from "@cutcrft/runtime-client";
import { _ as Ce } from "./vendor.js";
const we = ["title"], xe = {
  key: 0,
  class: "ui-table__toolbar"
}, Se = ["placeholder"], Re = {
  key: 1,
  class: "ui-table__count"
}, Ae = ["disabled"], De = {
  key: 1,
  class: "ui-table__error"
}, Te = {
  key: 2,
  class: "ui-table__grid"
}, $e = {
  key: 0,
  class: "ui-table__checkbox-col"
}, ze = ["onClick"], Me = {
  key: 0,
  class: "ui-table__sort-indicator"
}, Ve = {
  key: 1,
  class: "ui-table__actions-col"
}, Ne = { key: 0 }, Oe = ["colspan"], Be = { key: 1 }, Le = ["colspan"], Ue = ["data-gesture-object-type", "data-gesture-row", "onClick"], je = {
  key: 0,
  class: "ui-table__checkbox-col"
}, qe = ["checked", "onClick"], Fe = {
  key: 0,
  class: "ui-table__badge-wrap"
}, Ke = { key: 2 }, Ee = ["onClick"], Pe = ["onClick"], Ie = {
  key: 3,
  class: "ui-table__pagination"
}, Je = ["disabled"], Qe = { class: "ui-table__page-info" }, Ge = ["disabled"], He = ["value"], We = /* @__PURE__ */ ve({
  __name: "UiTable",
  props: {
    config: {},
    context: {}
  },
  setup(Z) {
    var H;
    const d = Z, f = ge.t, K = g(null), ee = pe(K), a = ye(d.config, {
      showRefresh: !0,
      showRowCount: !0,
      searchable: !1,
      sortable: !1,
      pagination: { pageSize: 10, pageSizeOptions: [10, 25, 50] }
    }), E = r(() => {
      if (a.value.data) return a.value.data;
      const e = d.config.command;
      if (e)
        return { command: e, entityType: d.config.entityType };
    }), { value: P, error: I, loading: M, reload: y } = he(
      () => E.value,
      () => d.context ?? {}
    ), p = r(
      () => Array.isArray(P.value) ? P.value : []
    ), A = r(() => {
      if (a.value.columns && a.value.columns.length > 0) return a.value.columns;
      const e = d.config.columns;
      if (e && e.length > 0) return e;
      const n = p.value[0];
      return n ? Object.keys(n).map((t) => ({ key: t })) : [];
    }), D = r(() => {
      const e = A.value;
      return e.length > 0 || p.value.length === 0 ? e : [];
    }), V = g(""), J = r(() => {
      const e = V.value.trim().toLowerCase();
      if (!e) return p.value;
      const n = A.value;
      return p.value.filter(
        (t) => n.some((c) => F(t[c.key]).toLowerCase().includes(e))
      );
    }), h = g(null), k = g("asc");
    function Q(e) {
      return e.sortable ?? a.value.sortable ?? !1;
    }
    function te(e) {
      h.value === e ? k.value = k.value === "asc" ? "desc" : "asc" : (h.value = e, k.value = "asc");
    }
    const N = r(() => {
      if (!h.value) return J.value;
      const e = h.value;
      return [...J.value].sort((n, t) => {
        const c = n[e], v = t[e];
        let u;
        return typeof c == "number" && typeof v == "number" ? u = c - v : u = String(c ?? "").localeCompare(String(v ?? "")), k.value === "asc" ? u : -u;
      });
    }), O = r(
      () => a.value.pagination === !1 ? null : a.value.pagination ?? {}
    ), B = r(() => O.value !== null), C = g(((H = O.value) == null ? void 0 : H.pageSize) ?? 10), ne = r(() => {
      var e;
      return ((e = O.value) == null ? void 0 : e.pageSizeOptions) ?? [10, 25, 50];
    }), m = g(1), w = r(() => B.value ? Math.max(1, Math.ceil(N.value.length / C.value)) : 1), L = r(() => {
      if (!B.value) return N.value;
      const e = (m.value - 1) * C.value;
      return N.value.slice(e, e + C.value);
    });
    be(w, () => {
      m.value > w.value && (m.value = Math.max(1, w.value));
    });
    const T = r(() => {
      var n;
      return (((n = a.value.rowActions) == null ? void 0 : n.length) ?? 0) + (a.value.deleteCommand || d.config.deleteCommand ? 1 : 0);
    }), U = g(/* @__PURE__ */ new Set());
    function ae(e) {
      var v;
      const n = String(e.id ?? e[((v = A.value[0]) == null ? void 0 : v.key) ?? ""]), t = new Set(U.value);
      t.has(n) ? t.delete(n) : t.add(n), U.value = t;
      const c = p.value.filter((u) => {
        var j;
        return t.has(String(u.id ?? u[((j = A.value[0]) == null ? void 0 : j.key) ?? ""]));
      });
      z($(a.value.actions, "selectionChange"), { ...d.context ?? {}, payload: { selected: c } });
    }
    function le(e, n) {
      return String(e.id ?? n);
    }
    function oe(e) {
      return e.label ?? e.key;
    }
    function se(e, n) {
      var c, v, u;
      if ((c = e.badge) != null && c.toneField) return n[e.badge.toneField] ?? "neutral";
      const t = F(n[e.key]);
      return ((u = (v = e.badge) == null ? void 0 : v.tones) == null ? void 0 : u[t]) ?? "neutral";
    }
    function G(e, n) {
      return F(n[e.key]);
    }
    function ue(e) {
      z($(a.value.actions, "rowSelect"), { ...d.context ?? {}, row: e });
    }
    async function ie(e, n) {
      if (e.confirm && !window.confirm(e.confirm)) return;
      const t = { ...d.context ?? {}, row: n };
      if (e.spec) {
        await z({ event: "click", spec: e.spec, confirm: e.confirm }, t);
        return;
      }
      if (e.command)
        try {
          await Y.executeCommand(e.command, {
            id: n.id,
            ...ke(e.params, t)
          }), await y();
        } catch {
        }
    }
    async function re(e) {
      if (typeof e.id != "string") return;
      const n = $(a.value.actions, "rowDelete");
      if (n) {
        await z(n, { ...d.context ?? {}, row: e }), await y();
        return;
      }
      const t = a.value.deleteCommand ?? d.config.deleteCommand;
      if (t && window.confirm("Delete this row?"))
        try {
          await Y.executeCommand(t, { id: e.id }), await y();
        } catch {
        }
    }
    const ce = r(() => !!(a.value.deleteCommand || d.config.deleteCommand)), de = r(() => ce.value || !!$(a.value.actions, "rowDelete"));
    return (e, n) => (o(), s("div", {
      ref_key: "root",
      ref: K,
      class: x(["ui-table", [l(a).className, `ui-table--cq-${l(ee)}`]]),
      style: q(l(a).style),
      title: l(a).tooltip
    }, [
      l(a).searchable || l(a).showRefresh || l(a).showRowCount ? (o(), s("div", xe, [
        l(a).searchable ? W((o(), s("input", {
          key: 0,
          "onUpdate:modelValue": n[0] || (n[0] = (t) => V.value = t),
          class: "ui-table__search",
          type: "search",
          placeholder: l(f)("core.table.search")
        }, null, 8, Se)), [
          [_e, V.value]
        ]) : b("", !0),
        l(a).showRowCount ? (o(), s("span", Re, i(l(f)("core.table.rows", { count: p.value.length })), 1)) : b("", !0),
        l(a).showRefresh ? (o(), s("button", {
          key: 2,
          class: "ui-button ui-button--small",
          disabled: l(M),
          onClick: n[1] || (n[1] = //@ts-ignore
          (...t) => l(y) && l(y)(...t))
        }, i(l(M) ? l(f)("core.button.loading") : l(f)("core.table.refresh")), 9, Ae)) : b("", !0)
      ])) : b("", !0),
      l(I) ? (o(), s("p", De, i(l(I)), 1)) : (o(), s("table", Te, [
        _("thead", null, [
          _("tr", null, [
            l(a).selectable ? (o(), s("th", $e)) : b("", !0),
            (o(!0), s(S, null, R(D.value, (t) => (o(), s("th", {
              key: t.key,
              style: q({ width: t.width, textAlign: t.align }),
              class: x({ "ui-table__sortable": Q(t) }),
              onClick: (c) => Q(t) && te(t.key)
            }, [
              me(i(oe(t)) + " ", 1),
              h.value === t.key ? (o(), s("span", Me, i(k.value === "asc" ? "↑" : "↓"), 1)) : b("", !0)
            ], 14, ze))), 128)),
            T.value > 0 ? (o(), s("th", Ve)) : b("", !0)
          ])
        ]),
        _("tbody", null, [
          l(M) && L.value.length === 0 ? (o(), s("tr", Ne, [
            _("td", {
              colspan: D.value.length + (l(a).selectable ? 1 : 0) + (T.value > 0 ? 1 : 0),
              class: "ui-table__state"
            }, i(l(f)("core.button.loading")), 9, Oe)
          ])) : L.value.length === 0 ? (o(), s("tr", Be, [
            _("td", {
              colspan: D.value.length + (l(a).selectable ? 1 : 0) + (T.value > 0 ? 1 : 0),
              class: "ui-table__state"
            }, i(l(a).emptyText ?? l(f)("core.table.empty")), 9, Le)
          ])) : b("", !0),
          (o(!0), s(S, null, R(L.value, (t, c) => {
            var v;
            return o(), s("tr", {
              key: le(t, c),
              class: "ui-table__row",
              "data-gesture-role": "row",
              "data-gesture-object-type": ((v = E.value) == null ? void 0 : v.entityType) ?? void 0,
              "data-gesture-row": JSON.stringify(t),
              onClick: (u) => ue(t)
            }, [
              l(a).selectable ? (o(), s("td", je, [
                _("input", {
                  type: "checkbox",
                  checked: U.value.has(String(t.id)),
                  onClick: X((u) => ae(t), ["stop"])
                }, null, 8, qe)
              ])) : b("", !0),
              (o(!0), s(S, null, R(D.value, (u) => (o(), s("td", {
                key: u.key,
                style: q({ textAlign: u.align })
              }, [
                u.render === "badge" ? (o(), s("span", Fe, [
                  _("span", {
                    class: x(["ui-badge", `ui-badge--${se(u, t)}`])
                  }, i(G(u, t)), 3)
                ])) : u.render === "boolean" ? (o(), s("span", {
                  key: 1,
                  class: x(t[u.key] ? "ui-table__bool ui-table__bool--yes" : "ui-table__bool ui-table__bool--no")
                }, i(t[u.key] ? "✓" : "✕"), 3)) : (o(), s("span", Ke, i(G(u, t)), 1))
              ], 4))), 128)),
              T.value > 0 ? (o(), s("td", {
                key: 1,
                class: "ui-table__actions-col",
                onClick: n[2] || (n[2] = X(() => {
                }, ["stop"]))
              }, [
                (o(!0), s(S, null, R(l(a).rowActions ?? [], (u) => (o(), s("button", {
                  key: u.label,
                  class: x(["ui-button ui-button--small", { "ui-button--danger": u.variant === "danger" }]),
                  onClick: (j) => ie(u, t)
                }, i(u.label), 11, Ee))), 128)),
                de.value ? (o(), s("button", {
                  key: 0,
                  class: "ui-button ui-button--small ui-button--danger",
                  onClick: (u) => re(t)
                }, i(l(f)("core.table.delete")), 9, Pe)) : b("", !0)
              ])) : b("", !0)
            ], 8, Ue);
          }), 128))
        ])
      ])),
      B.value ? (o(), s("div", Ie, [
        _("button", {
          class: "ui-button ui-button--small",
          disabled: m.value <= 1,
          onClick: n[3] || (n[3] = (t) => m.value -= 1)
        }, "‹", 8, Je),
        _("span", Qe, i(m.value) + " / " + i(w.value), 1),
        _("button", {
          class: "ui-button ui-button--small",
          disabled: m.value >= w.value,
          onClick: n[4] || (n[4] = (t) => m.value += 1)
        }, "›", 8, Ge),
        W(_("select", {
          "onUpdate:modelValue": n[5] || (n[5] = (t) => C.value = t),
          class: "ui-table__page-size"
        }, [
          (o(!0), s(S, null, R(ne.value, (t) => (o(), s("option", {
            key: t,
            value: t
          }, i(t), 9, He))), 128))
        ], 512), [
          [
            fe,
            C.value,
            void 0,
            { number: !0 }
          ]
        ])
      ])) : b("", !0)
    ], 14, we));
  }
}), et = /* @__PURE__ */ Ce(We, [["__scopeId", "data-v-13cc7319"]]);
export {
  et as default
};
