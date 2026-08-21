import { jsx as e, jsxs as p, Fragment as $ } from "preact/jsx-runtime";
import { useSignal as E, computed as w } from "@preact/signals";
import { useRef as D, useEffect as x } from "preact/hooks";
import { resolveEditor as ie, resolveComponent as oe, i18nStore as k, layerStore as G, Container as le, toasts as K, pageStore as b, configStore as y, routerStore as j, sessionStore as I, iconView as L, overlayService as P, themeStore as _, dataStore as ce } from "@cutcrft/plugin-sdk";
import { createPortal as de } from "preact/compat";
var ue = "_1pb7hjk1", ve = "_1pb7hjk2", pe = "_1pb7hjk4", he = "_1pb7hjk5", fe = "_1pb7hjk6", me = "_1pb7hjk7", ge = "_1pb7hjke", be = "_1pb7hjkf", we = "_1pb7hjkg", V = "_1pb7hjkh", ye = "_1pb7hjki", ke = "_1pb7hjkj", Ce = "_1pb7hjkk", xe = "_1pb7hjkl", $e = "_1pb7hjkm", Ie = "_1pb7hjkn";
function H({ component: t, context: v }) {
  const r = ie(t.type) ?? oe(t.type);
  return r ? /* @__PURE__ */ e(r, { config: t.config, context: v, "data-gesture-type": t.type }) : /* @__PURE__ */ p("div", { class: ue, children: [
    /* @__PURE__ */ e("strong", { children: t.type }),
    /* @__PURE__ */ e("pre", { class: ve, children: JSON.stringify(t.config, null, 2) })
  ] });
}
function Pe({ section: t, context: v }) {
  const o = Math.max(1, Math.min(t.columns, 4));
  return /* @__PURE__ */ e(
    "section",
    {
      class: he,
      style: {
        gridTemplateColumns: `repeat(${o}, minmax(0, 1fr))`,
        gap: "var(--rt-space)"
      },
      children: t.components.map((r, d) => /* @__PURE__ */ e(
        H,
        {
          component: r,
          context: v
        },
        `${d}:${r.type}`
      ))
    }
  );
}
function Ee({ layer: t, context: v }) {
  const o = D(null), r = t.pointerEvents === "pass-through";
  function d() {
    const i = o.current;
    if (!i || !r) return;
    i.querySelectorAll(
      'button, a, input, select, textarea, [role="button"], [role="tab"], [data-interactive], .editor, .toolbar'
    ).forEach((m) => {
      m.style.pointerEvents = "auto";
    });
  }
  x(() => {
    if (!r) return;
    d();
    const i = new MutationObserver(() => d());
    return o.current && i.observe(o.current, { childList: !0, subtree: !0 }), () => i.disconnect();
  }, [r]);
  const a = {
    zIndex: String(t.order),
    opacity: String(t.opacity ?? 1),
    pointerEvents: r ? "none" : t.pointerEvents ?? "auto"
  }, n = t.position;
  return n && (n.type && (a.position = n.type), n.top != null && (a.top = n.top), n.left != null && (a.left = n.left), n.right != null && (a.right = n.right), n.bottom != null && (a.bottom = n.bottom), n.width != null && (a.width = n.width), n.height != null && (a.height = n.height)), t.style && Object.assign(a, t.style), /* @__PURE__ */ e(
    "div",
    {
      ref: o,
      class: `${fe} ${t.className ?? ""} ${t.visible ? "" : me}`,
      style: a,
      "data-layer-id": t.id,
      children: t.sections.map((i) => /* @__PURE__ */ e(Pe, { section: i, context: v }, i.id))
    }
  );
}
function W({ page: t, context: v }) {
  const o = k.tr, r = G.hasLayers(t), d = r ? G.getVisibleLayers(t.id, t.layers) : [];
  return /* @__PURE__ */ p("article", { children: [
    /* @__PURE__ */ e("h2", { class: pe, children: o(t.title) }),
    r ? d.map((a) => /* @__PURE__ */ e(Ee, { layer: a, pageId: t.id, context: v }, a.id)) : t.sections.map((a) => /* @__PURE__ */ e(
      le,
      {
        context: v,
        component: Se(a)
      },
      a.id
    ))
  ] });
}
function Se(t) {
  const v = (t.components ?? []).map((o) => ({
    type: o.type,
    config: o.config,
    children: o.children
  }));
  return {
    type: "Section",
    config: {
      id: t.id,
      layout: t.layout,
      columns: t.columns,
      children: v
    }
  };
}
function F() {
  const t = K.list;
  return /* @__PURE__ */ e("div", { class: Ce, children: t.map((v) => /* @__PURE__ */ e(
    "div",
    {
      class: `${xe} ${v.kind === "error" ? $e : v.kind === "success" ? Ie : ""}`,
      onClick: () => K.remove(v.id),
      children: v.message
    },
    v.id
  )) });
}
function je() {
  const t = D(null), v = b.openPages.map((a) => {
    const n = y.pages.find((i) => i.id === a);
    return { pageId: a, title: n ? k.tr(n.title) : a };
  });
  function o(a) {
    j.open(a);
  }
  function r(a, n) {
    a.stopPropagation(), b.closeTab(n);
  }
  function d(a, n) {
    a.button === 1 && r(a, n);
  }
  return x(() => {
    const a = t.current, n = a == null ? void 0 : a.querySelector(`.${V}`);
    n == null || n.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
  }, [b.activePageId]), /* @__PURE__ */ e("div", { class: ge, children: /* @__PURE__ */ e("div", { ref: t, class: be, children: v.map((a) => /* @__PURE__ */ p(
    "button",
    {
      type: "button",
      class: `${we} ${b.activePageId === a.pageId ? V : ""}`,
      onClick: () => o(a.pageId),
      onAuxClick: (n) => d(n, a.pageId),
      children: [
        /* @__PURE__ */ e("span", { class: ye, children: a.title }),
        /* @__PURE__ */ e(
          "span",
          {
            class: ke,
            role: "button",
            tabIndex: -1,
            "aria-label": "Close",
            onClick: (n) => r(n, a.pageId),
            children: "×"
          }
        )
      ]
    },
    a.pageId
  )) }) });
}
var Le = "qn03df0", _e = "qn03df1", Te = "qn03df2", Me = "qn03df3", qe = "qn03df4", Ae = "qn03df5", De = "qn03df6", He = "qn03df7", N = "qn03df8", Be = "qn03df9", Re = "qn03dfa", Oe = "qn03dfb";
function z() {
  const t = k.t, v = k.tr, o = E(!1), r = E(""), d = E(0), a = w(() => {
    const u = y.pages.map((h) => ({
      kind: "page",
      id: `page:${h.id}`,
      description: v(h.title),
      icon: "◈",
      pageId: h.id
    })), c = /* @__PURE__ */ new Map();
    for (const h of y.commands) {
      if (h.visibility === "PRIVATE") continue;
      const f = h.group ?? "Commands";
      c.has(f) || c.set(f, []), c.get(f).push({ kind: "command", id: h.id, description: h.description, group: f, command: h });
    }
    const g = Array.from(c.entries()).map(([h, f]) => ({ label: h, items: f }));
    return [{ label: "Pages", items: u }, ...g].filter((h) => h.items.length > 0);
  }), n = w(() => a.value.flatMap((u) => u.items)), i = w(() => {
    const u = r.value.trim().toLowerCase();
    return u ? a.value.map((c) => ({
      label: c.label,
      items: c.items.filter(
        (g) => g.id.toLowerCase().includes(u) || g.description.toLowerCase().includes(u)
      )
    })).filter((c) => c.items.length > 0) : a.value;
  });
  function l(u) {
    o.value = !1, u.kind === "page" && u.pageId ? b.openPage(u.pageId) : u.command && I.executeCommand(u.command.id, {}).catch(() => {
    });
  }
  function m(u, c) {
    let g = 0;
    for (const h of i.value) {
      if (h === u) return g + c;
      g += h.items.length;
    }
    return c;
  }
  return x(() => {
    const u = (c) => {
      if ((c.metaKey || c.ctrlKey) && c.key.toLowerCase() === "k") {
        c.preventDefault(), o.value = !o.value, r.value = "", d.value = 0;
        return;
      }
      if (o.value) {
        if (c.key === "Escape") {
          o.value = !1;
          return;
        }
        if (c.key === "ArrowDown") {
          c.preventDefault(), d.value = Math.min(d.value + 1, n.value.length - 1);
          return;
        }
        if (c.key === "ArrowUp") {
          c.preventDefault(), d.value = Math.max(d.value - 1, 0);
          return;
        }
        c.key === "Enter" && n.value.length > 0 && (c.preventDefault(), l(n.value[d.value]));
      }
    };
    return window.addEventListener("keydown", u), () => window.removeEventListener("keydown", u);
  }, []), o.value ? /* @__PURE__ */ e("div", { class: Le, onClick: (u) => {
    u.target === u.currentTarget && (o.value = !1);
  }, children: /* @__PURE__ */ p("div", { class: _e, children: [
    /* @__PURE__ */ e(
      "input",
      {
        class: Te,
        placeholder: t("core.palette.placeholder"),
        onInput: (u) => {
          r.value = u.target.value, d.value = 0;
        },
        autofocus: !0
      }
    ),
    /* @__PURE__ */ p("ul", { class: Me, children: [
      i.value.map((u) => /* @__PURE__ */ p($, { children: [
        /* @__PURE__ */ e("li", { class: qe, children: u.label }),
        u.items.map((c, g) => /* @__PURE__ */ p(
          "li",
          {
            class: `${Ae}${m(u, g) === d.value ? ` ${De}` : ""}`,
            onClick: () => l(c),
            children: [
              c.icon && /* @__PURE__ */ e("span", { class: He, children: c.icon }),
              c.kind === "command" ? /* @__PURE__ */ e("code", { class: N, children: c.id }) : /* @__PURE__ */ e("span", { class: `${N} ${Be}`, children: c.id.replace(/^page:/, "") }),
              /* @__PURE__ */ e("span", { class: Re, children: c.description })
            ]
          },
          c.id
        ))
      ] })),
      n.value.length === 0 && /* @__PURE__ */ e("li", { class: Oe, children: t("core.palette.empty") })
    ] })
  ] }) }) : null;
}
var Ge = "_1u4vxn0", Ke = "_1u4vxn1", Ve = "_1u4vxn2", We = "_1u4vxn3", Fe = "_1u4vxn4", Ne = "_1u4vxn5", ze = "_1u4vxn6", Ue = "_1u4vxn7", U = "_1u4vxn8", Je = "_1u4vxn9", Qe = "_1u4vxnb";
function Xe({ open: t, onClose: v }) {
  const o = k.tr, r = E(/* @__PURE__ */ new Set()), d = w(() => {
    var m, u, c, g;
    const i = (g = (c = (u = (m = y.app) == null ? void 0 : m.shell) == null ? void 0 : u.sidebar) == null ? void 0 : c.groups) != null && g.length ? y.app.shell.sidebar.groups : y.navigation, l = /* @__PURE__ */ new Map();
    for (const h of i) {
      const f = h.group ? o(h.group) : "";
      l.has(f) || l.set(f, []), l.get(f).push(h);
    }
    return Array.from(l.entries()).map(([h, f]) => ({ title: h, items: f }));
  });
  function a(i) {
    i && (j.open(i), v == null || v());
  }
  function n(i) {
    const l = new Set(r.value);
    l.has(i) ? l.delete(i) : l.add(i), r.value = l;
  }
  return x(() => {
    var u, c, g, h;
    const i = b.activePageId;
    if (!i) return;
    const m = ((h = (g = (c = (u = y.app) == null ? void 0 : u.shell) == null ? void 0 : c.sidebar) == null ? void 0 : g.groups) != null && h.length ? y.app.shell.sidebar.groups : y.navigation).find((f) => f.pageId === i);
    if (m && m.group) {
      const f = new Set(r.value);
      f.delete(o(m.group)), r.value = f;
    }
  }, [b.activePageId]), /* @__PURE__ */ p($, { children: [
    t && /* @__PURE__ */ e("div", { class: Qe, onClick: v }),
    /* @__PURE__ */ e("aside", { class: `${Ge}${t ? ` ${Ke}` : ""}`, children: /* @__PURE__ */ e("nav", { children: d.value.map((i) => /* @__PURE__ */ p($, { children: [
      i.title && /* @__PURE__ */ p("div", { class: Ve, onClick: () => n(i.title), children: [
        /* @__PURE__ */ e("span", { class: `${We}${r.value.has(i.title) ? "" : ` ${Fe}`}`, children: "▸" }),
        /* @__PURE__ */ e("span", { children: i.title })
      ] }),
      !r.value.has(i.title) && /* @__PURE__ */ e("ul", { class: Ne, children: i.items.map((l) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ p(
        "a",
        {
          class: `${ze}${b.activePageId === l.pageId ? ` ${Ue}` : ""}`,
          onClick: (m) => {
            m.preventDefault(), a(l.pageId);
          },
          children: [
            L(l.icon).src ? /* @__PURE__ */ e("img", { class: `${U} ${Je}`, src: L(l.icon).src, alt: "" }) : L(l.icon).glyph ? /* @__PURE__ */ e("span", { class: U, children: L(l.icon).glyph }) : null,
            /* @__PURE__ */ e("span", { children: o(l.label) })
          ]
        }
      ) }, l.id)) })
    ] })) }) })
  ] });
}
var Ye = "esh2400", J = "esh2401", Q = "esh2402", X = "esh2403", Ze = "esh2404", Y = "esh2405", Z = "esh2406", ee = "esh2407", et = "esh2408", M = "esh2409", tt = "esh240a", nt = "esh240b", at = "esh240c", rt = "esh240d", st = "esh240e", it = "esh240f", ot = "esh240g", lt = "esh240h", ct = "esh240i", dt = "esh240j", ut = "esh240k", vt = "esh240l", pt = "esh240m", ht = "esh240n", ft = "esh240o", mt = "esh240p", gt = "esh240q";
function bt({ instance: t }) {
  var d, a;
  const v = k.tr, o = E(null);
  x(() => {
    const n = () => P.close(t.uid), i = (l) => {
      l.key === "Escape" && (l.stopPropagation(), P.close(t.uid));
    };
    return document.addEventListener("mousedown", n, !0), window.addEventListener("keydown", i, !0), () => {
      document.removeEventListener("mousedown", n, !0), window.removeEventListener("keydown", i, !0);
    };
  }, [t.uid]);
  const r = (n, i) => {
    var m;
    if (!((m = n.items) != null && m.length)) {
      o.value = null;
      return;
    }
    const l = i.currentTarget.getBoundingClientRect();
    o.value = { item: n, x: l.right + 2, y: l.top - 4 };
  };
  return /* @__PURE__ */ p($, { children: [
    /* @__PURE__ */ e(
      "div",
      {
        class: Ye,
        style: { left: `${((d = t.anchor) == null ? void 0 : d.x) ?? 0}px`, top: `${((a = t.anchor) == null ? void 0 : a.y) ?? 0}px` },
        onContextMenu: (n) => n.preventDefault(),
        children: (t.definition.items ?? []).map((n, i) => {
          var l, m;
          return /* @__PURE__ */ e(
            "div",
            {
              class: `${J} ${n.divider, ""}${n.disabled ? ` ${Q}` : ""}${n.danger ? ` ${X}` : ""}${(l = n.items) != null && l.length ? ` ${Ze}` : ""}`,
              onClick: (u) => {
                var c;
                u.stopPropagation(), (c = n.items) != null && c.length || P.executeMenuItem(n, t);
              },
              onMouseEnter: (u) => r(n, u),
              onMouseLeave: () => {
                o.value = null;
              },
              children: n.divider ? /* @__PURE__ */ e("span", { class: M }) : /* @__PURE__ */ p($, { children: [
                /* @__PURE__ */ e("span", { class: Y, children: n.icon ?? "" }),
                /* @__PURE__ */ e("span", { class: Z, children: v(n.label) }),
                n.shortcut && /* @__PURE__ */ e("span", { class: ee, children: n.shortcut }),
                ((m = n.items) == null ? void 0 : m.length) && /* @__PURE__ */ e("span", { class: et, children: "›" })
              ] })
            },
            i
          );
        })
      }
    ),
    o.value && /* @__PURE__ */ e(
      "div",
      {
        class: tt,
        style: { left: `${o.value.x}px`, top: `${o.value.y}px` },
        onClick: (n) => n.stopPropagation(),
        children: (o.value.item.items ?? []).map((n, i) => /* @__PURE__ */ e(
          "div",
          {
            class: `${J}${n.divider ? ` ${M}` : ""}${n.disabled ? ` ${Q}` : ""}${n.danger ? ` ${X}` : ""}`,
            onClick: (l) => {
              l.stopPropagation(), P.executeMenuItem(n, t);
            },
            children: n.divider ? /* @__PURE__ */ e("span", { class: M }) : /* @__PURE__ */ p($, { children: [
              /* @__PURE__ */ e("span", { class: Y, children: n.icon ?? "" }),
              /* @__PURE__ */ e("span", { class: Z, children: v(n.label) }),
              n.shortcut && /* @__PURE__ */ e("span", { class: ee, children: n.shortcut })
            ] })
          },
          i
        ))
      }
    )
  ] });
}
function wt({ instance: t }) {
  const v = k.tr, o = () => P.close(t.uid);
  return x(() => {
    const r = (d) => {
      d.key === "Escape" && (d.stopPropagation(), o());
    };
    return window.addEventListener("keydown", r, !0), () => window.removeEventListener("keydown", r, !0);
  }, [t.uid]), /* @__PURE__ */ e("div", { class: nt, onMouseDown: (r) => {
    r.target === r.currentTarget && o();
  }, children: /* @__PURE__ */ p("div", { class: at, style: { width: t.definition.width ?? "min(90vw, 32rem)" }, role: "dialog", children: [
    t.definition.title && /* @__PURE__ */ p("header", { class: rt, children: [
      /* @__PURE__ */ e("h3", { class: st, children: v(t.definition.title ?? "") }),
      /* @__PURE__ */ e("button", { class: it, onClick: o, children: "✕" })
    ] }),
    /* @__PURE__ */ e("div", { class: ot, children: t.definition.content && /* @__PURE__ */ e(H, { component: t.definition.content, context: t.context }) })
  ] }) });
}
function yt({ instance: t }) {
  const v = k.tr, o = t.definition.side ?? "right", r = t.definition.width ?? "24rem", d = t.definition.width ?? "40vh", a = () => P.close(t.uid);
  return x(() => {
    const i = (l) => {
      l.key === "Escape" && (l.stopPropagation(), a());
    };
    return window.addEventListener("keydown", i, !0), () => window.removeEventListener("keydown", i, !0);
  }, [t.uid]), /* @__PURE__ */ e("div", { class: lt, onMouseDown: (i) => {
    i.target === i.currentTarget && a();
  }, children: /* @__PURE__ */ p(
    "aside",
    {
      class: `${ct} ${o === "left" ? dt : o === "bottom" ? vt : ut}`,
      style: o === "bottom" ? { height: d } : { width: r },
      children: [
        t.definition.title && /* @__PURE__ */ p("header", { class: pt, children: [
          /* @__PURE__ */ e("h3", { class: ht, children: v(t.definition.title ?? "") }),
          /* @__PURE__ */ e("button", { class: ft, onClick: a, children: "✕" })
        ] }),
        /* @__PURE__ */ e("div", { class: mt, children: t.definition.content && /* @__PURE__ */ e(H, { component: t.definition.content, context: t.context }) })
      ]
    }
  ) });
}
function kt({ instance: t }) {
  const v = k.tr, o = D(null), r = () => {
    var n, i;
    const d = o.current;
    if (!d) return;
    const a = d.getBoundingClientRect();
    d.style.left = `${Math.min(Math.max(8, ((n = t.anchor) == null ? void 0 : n.x) ?? 8), window.innerWidth - a.width - 8)}px`, d.style.top = `${Math.min(Math.max(8, ((i = t.anchor) == null ? void 0 : i.y) ?? 8), window.innerHeight - a.height - 8)}px`;
  };
  return x(() => {
    r();
    const d = (a) => {
      a.key === "Escape" && (a.stopPropagation(), P.close(t.uid));
    };
    return window.addEventListener("keydown", d, !0), window.addEventListener("resize", r), () => {
      window.removeEventListener("keydown", d, !0), window.removeEventListener("resize", r);
    };
  }, [t.uid]), /* @__PURE__ */ e(
    "div",
    {
      ref: o,
      class: gt,
      style: { "--rt-placement": t.definition.placement ?? "top" },
      onMouseDown: (d) => d.stopPropagation(),
      children: v(t.definition.text ?? "")
    }
  );
}
function te() {
  const { overlaysSignal: t } = P, o = t.value.map((r) => {
    switch (r.definition.kind) {
      case "menu":
        return /* @__PURE__ */ e(bt, { instance: r }, r.uid);
      case "modal":
        return /* @__PURE__ */ e(wt, { instance: r }, r.uid);
      case "panel":
        return /* @__PURE__ */ e(yt, { instance: r }, r.uid);
      case "tooltip":
        return /* @__PURE__ */ e(kt, { instance: r }, r.uid);
      default:
        return null;
    }
  });
  return de(/* @__PURE__ */ e($, { children: o }), document.body);
}
var q = "shvpie0", Ct = "shvpie1", ne = "shvpie2", T = "shvpie3", xt = "shvpie4", $t = "shvpie5", It = "shvpie6", Pt = "shvpie7", Et = "shvpie8", St = "shvpie9", jt = "shvpiea", Lt = "shvpieb", S = "shvpiec", _t = "shvpied", ae = "shvpiee", Tt = "shvpief", Mt = "shvpieg", A = "shvpieh", qt = "shvpiei";
function At(t) {
  return t.startsWith("http") || t.startsWith("data:");
}
function Gt() {
  const t = k.t, v = k.tr, o = w(() => y.app), r = w(() => {
    var s;
    return ((s = o.value) == null ? void 0 : s.layout) ?? "topbar";
  }), d = w(() => I.isConnected), a = w(() => I.projectId), n = w(() => {
    var s;
    return v(((s = o.value) == null ? void 0 : s.title) ?? "Runtime");
  }), i = w(() => {
    var C;
    const s = (C = o.value) == null ? void 0 : C.logo;
    return s && At(s) ? s : void 0;
  }), l = E(!1), m = E([]), u = w(() => {
    var s, C, O;
    return ((O = (C = (s = y.app) == null ? void 0 : s.shell) == null ? void 0 : C.topbar) == null ? void 0 : O.actions) ?? [];
  }), c = w(() => u.value.length > 0);
  async function g(s) {
    s.action === "navigate" && s.page ? (j.open(s.page), l.value = !1) : s.action === "command" && s.command && await I.executeCommand(s.command, s.params ?? {});
  }
  x(() => {
    fetch("/workspaces").then((s) => s.ok ? s.json() : null).then((s) => {
      var C;
      (C = s == null ? void 0 : s.workspaces) != null && C.length && (m.value = s.workspaces);
    }).catch(() => {
    });
  }, []);
  async function h(s) {
    s !== I.workspaceId && (await I.setWorkspace(s), location.reload());
  }
  const f = w(
    () => y.pages.find((s) => s.id === b.activePageId)
  ), B = w(() => ({ page: b.activePageId })), re = w(() => {
    switch (_.mode) {
      case "dark":
        return "☾";
      case "light":
        return "☀";
      default:
        return "◐";
    }
  });
  function se(s) {
    s && (j.open(s), l.value = !1);
  }
  async function R() {
    try {
      await I.createProject();
    } catch (s) {
      ce.reportCommandError("project.create", s);
    }
  }
  return x(() => {
    _.init();
  }, []), j.isEmbed ? /* @__PURE__ */ p("div", { class: `${q} ${qt}`, children: [
    /* @__PURE__ */ e("main", { class: ne, children: /* @__PURE__ */ e("div", { class: T, children: f.value ? /* @__PURE__ */ e(W, { page: f.value, context: B.value }, f.value.id) : /* @__PURE__ */ e("div", { class: A, children: /* @__PURE__ */ e("p", { children: t("core.app.pageNotFound") }) }) }) }),
    /* @__PURE__ */ e(F, {}),
    /* @__PURE__ */ e(z, {}),
    /* @__PURE__ */ e(te, {})
  ] }) : /* @__PURE__ */ p("div", { class: `${q} ${q}`, children: [
    /* @__PURE__ */ p("header", { class: xt, children: [
      r.value === "sidebar" && /* @__PURE__ */ e(
        "button",
        {
          class: S,
          "aria-expanded": l.value,
          "aria-label": "Toggle navigation",
          onClick: () => {
            l.value = !l.value;
          },
          children: "☰"
        }
      ),
      /* @__PURE__ */ p("div", { class: $t, children: [
        i.value && /* @__PURE__ */ e("img", { src: i.value, class: It, alt: "" }),
        /* @__PURE__ */ e("h1", { class: Pt, children: n.value })
      ] }),
      r.value !== "sidebar" && /* @__PURE__ */ e("nav", { class: Et, children: y.navigation.map((s) => /* @__PURE__ */ e(
        "a",
        {
          class: `${St}${b.activePageId === s.pageId ? ` ${jt}` : ""}`,
          onClick: (C) => {
            C.preventDefault(), se(s.pageId);
          },
          children: v(s.label)
        },
        s.id
      )) }),
      /* @__PURE__ */ p("div", { class: Lt, children: [
        c.value ? /* @__PURE__ */ p($, { children: [
          m.value.length > 1 ? /* @__PURE__ */ e(
            "select",
            {
              class: _t,
              value: I.workspaceId ?? "default",
              title: "Workspace",
              onChange: (s) => h(s.target.value),
              children: m.value.map((s) => /* @__PURE__ */ e("option", { value: s, children: s }, s))
            }
          ) : null,
          u.value.map((s) => /* @__PURE__ */ e(
            "button",
            {
              class: S,
              title: s.label,
              onClick: () => g(s),
              children: s.icon ?? s.label
            },
            s.id
          ))
        ] }) : /* @__PURE__ */ p($, { children: [
          /* @__PURE__ */ e(
            "button",
            {
              class: S,
              disabled: !b.canGoBack,
              title: "Back",
              onClick: () => b.back(),
              children: "←"
            }
          ),
          /* @__PURE__ */ e(
            "button",
            {
              class: S,
              disabled: !b.canGoForward,
              title: "Forward",
              onClick: () => b.forward(),
              children: "→"
            }
          ),
          /* @__PURE__ */ e(
            "button",
            {
              class: S,
              title: `Theme: ${_.mode}`,
              onClick: () => _.cycle(),
              children: re.value
            }
          )
        ] }),
        /* @__PURE__ */ e("span", { class: `${ae} ${d.value ? Tt : Mt}`, children: d.value ? t("core.app.online") : t("core.app.offline") }),
        a.value && /* @__PURE__ */ e("span", { class: ae, children: a.value.slice(0, 8) }),
        !a.value && /* @__PURE__ */ e("button", { class: "ui-button ui-button--primary", onClick: R, children: t("core.app.newProject") })
      ] })
    ] }),
    /* @__PURE__ */ p("div", { class: Ct, children: [
      r.value === "sidebar" && /* @__PURE__ */ e(Xe, { open: l.value, onClose: () => {
        l.value = !1;
      } }),
      /* @__PURE__ */ p("main", { class: ne, children: [
        b.openPages.length > 0 && /* @__PURE__ */ e(je, {}),
        a.value ? f.value ? /* @__PURE__ */ e("div", { class: `${T}${r.value === "sidebar", ""}`, children: /* @__PURE__ */ e(W, { page: f.value, context: B.value }, f.value.id) }) : /* @__PURE__ */ e("div", { class: T, children: /* @__PURE__ */ e("div", { class: A, children: /* @__PURE__ */ e("p", { children: t("core.app.pageNotFound") }) }) }) : /* @__PURE__ */ e("div", { class: T, children: /* @__PURE__ */ p("div", { class: A, children: [
          /* @__PURE__ */ e("p", { children: t("core.app.noProject") }),
          /* @__PURE__ */ e("button", { class: "ui-button ui-button--primary", onClick: R, children: t("core.app.createProject") })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ e(F, {}),
    /* @__PURE__ */ e(z, {}),
    /* @__PURE__ */ e(te, {})
  ] });
}
export {
  Gt as default
};
