var Cd = Object.defineProperty;
var Sd = (i, t, e) => t in i ? Cd(i, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : i[t] = e;
var at = (i, t, e) => Sd(i, typeof t != "symbol" ? t + "" : t, e);
import { ref as Xt, reactive as oi, computed as Ye, watch as $r, onMounted as Fl, defineComponent as Pd, nextTick as Od, onBeforeUnmount as Ad, openBlock as qe, createElementBlock as Ue, normalizeStyle as Md, Fragment as ia, renderList as sa, normalizeClass as pr, toDisplayString as ra, createCommentVNode as mr, createElementVNode as oa, unref as Td } from "vue";
typeof window == "object" && window.NodeList && !NodeList.prototype.forEach && (NodeList.prototype.forEach = Array.prototype.forEach);
typeof window < "u" && function(i) {
  i.forEach((t) => {
    Object.prototype.hasOwnProperty.call(t, "append") || Object.defineProperty(t, "append", {
      configurable: !0,
      enumerable: !0,
      writable: !0,
      value(...e) {
        const n = document.createDocumentFragment();
        e.forEach((s) => {
          const r = s instanceof Node;
          n.appendChild(r ? s : document.createTextNode(String(s)));
        }), this.appendChild(n);
      }
    });
  });
}([Element.prototype, Document.prototype, DocumentFragment.prototype]);
class Zt {
  get disposed() {
    return this._disposed === !0;
  }
  dispose() {
    this._disposed = !0;
  }
}
(function(i) {
  function t() {
    return (e, n, s) => {
      const r = s.value, o = e.__proto__;
      s.value = function(...a) {
        this.disposed || (r.call(this, ...a), o.dispose.call(this));
      };
    };
  }
  i.dispose = t;
})(Zt || (Zt = {}));
class aa {
  constructor() {
    this.isDisposed = !1, this.items = /* @__PURE__ */ new Set();
  }
  /**
   * Test whether the set has been disposed.
   */
  get disposed() {
    return this.isDisposed;
  }
  /**
   * Dispose of the set and the items it contains.
   *
   * #### Notes
   * Items are disposed in the order they are added to the set.
   */
  dispose() {
    this.isDisposed || (this.isDisposed = !0, this.items.forEach((t) => {
      t.dispose();
    }), this.items.clear());
  }
  /**
   * Test whether the set contains a specific item.
   *
   * @param item - The item of interest.
   *
   * @returns `true` if the set contains the item, `false` otherwise.
   */
  contains(t) {
    return this.items.has(t);
  }
  /**
   * Add a disposable item to the set.
   *
   * @param item - The item to add to the set.
   *
   * #### Notes
   * If the item is already contained in the set, this is a no-op.
   */
  add(t) {
    this.items.add(t);
  }
  /**
   * Remove a disposable item from the set.
   *
   * @param item - The item to remove from the set.
   *
   * #### Notes
   * If the item is not contained in the set, this is a no-op.
   */
  remove(t) {
    this.items.delete(t);
  }
  /**
   * Remove all items from the set.
   */
  clear() {
    this.items.clear();
  }
}
(function(i) {
  function t(e) {
    const n = new i();
    return e.forEach((s) => {
      n.add(s);
    }), n;
  }
  i.from = t;
})(aa || (aa = {}));
var Gl = typeof global == "object" && global && global.Object === Object && global, Nd = typeof self == "object" && self && self.Object === Object && self, Ce = Gl || Nd || Function("return this")(), de = Ce.Symbol, Hl = Object.prototype, Id = Hl.hasOwnProperty, jd = Hl.toString, vi = de ? de.toStringTag : void 0;
function Ld(i) {
  var t = Id.call(i, vi), e = i[vi];
  try {
    i[vi] = void 0;
    var n = !0;
  } catch {
  }
  var s = jd.call(i);
  return n && (t ? i[vi] = e : delete i[vi]), s;
}
var kd = Object.prototype, Rd = kd.toString;
function Dd(i) {
  return Rd.call(i);
}
var _d = "[object Null]", $d = "[object Undefined]", la = de ? de.toStringTag : void 0;
function cn(i) {
  return i == null ? i === void 0 ? $d : _d : la && la in Object(i) ? Ld(i) : Dd(i);
}
function we(i) {
  return i != null && typeof i == "object";
}
var Bd = "[object Symbol]";
function Ie(i) {
  return typeof i == "symbol" || we(i) && cn(i) == Bd;
}
function bs(i, t) {
  for (var e = -1, n = i == null ? 0 : i.length, s = Array(n); ++e < n; )
    s[e] = t(i[e], e, i);
  return s;
}
var Kt = Array.isArray, ca = de ? de.prototype : void 0, ua = ca ? ca.toString : void 0;
function ql(i) {
  if (typeof i == "string")
    return i;
  if (Kt(i))
    return bs(i, ql) + "";
  if (Ie(i))
    return ua ? ua.call(i) : "";
  var t = i + "";
  return t == "0" && 1 / i == -1 / 0 ? "-0" : t;
}
var zd = /\s/;
function Vd(i) {
  for (var t = i.length; t-- && zd.test(i.charAt(t)); )
    ;
  return t;
}
var Fd = /^\s+/;
function Gd(i) {
  return i && i.slice(0, Vd(i) + 1).replace(Fd, "");
}
function Ct(i) {
  var t = typeof i;
  return i != null && (t == "object" || t == "function");
}
var ha = NaN, Hd = /^[-+]0x[0-9a-f]+$/i, qd = /^0b[01]+$/i, Ud = /^0o[0-7]+$/i, Wd = parseInt;
function Ai(i) {
  if (typeof i == "number")
    return i;
  if (Ie(i))
    return ha;
  if (Ct(i)) {
    var t = typeof i.valueOf == "function" ? i.valueOf() : i;
    i = Ct(t) ? t + "" : t;
  }
  if (typeof i != "string")
    return i === 0 ? i : +i;
  i = Gd(i);
  var e = qd.test(i);
  return e || Ud.test(i) ? Wd(i.slice(2), e ? 2 : 8) : Hd.test(i) ? ha : +i;
}
function ai(i) {
  return i;
}
var Xd = "[object AsyncFunction]", Yd = "[object Function]", Jd = "[object GeneratorFunction]", Kd = "[object Proxy]";
function go(i) {
  if (!Ct(i))
    return !1;
  var t = cn(i);
  return t == Yd || t == Jd || t == Xd || t == Kd;
}
var br = Ce["__core-js_shared__"], da = function() {
  var i = /[^.]+$/.exec(br && br.keys && br.keys.IE_PROTO || "");
  return i ? "Symbol(src)_1." + i : "";
}();
function Zd(i) {
  return !!da && da in i;
}
var Qd = Function.prototype, tf = Qd.toString;
function Pn(i) {
  if (i != null) {
    try {
      return tf.call(i);
    } catch {
    }
    try {
      return i + "";
    } catch {
    }
  }
  return "";
}
var ef = /[\\^$.*+?()[\]{}|]/g, nf = /^\[object .+?Constructor\]$/, sf = Function.prototype, rf = Object.prototype, of = sf.toString, af = rf.hasOwnProperty, lf = RegExp(
  "^" + of.call(af).replace(ef, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function cf(i) {
  if (!Ct(i) || Zd(i))
    return !1;
  var t = go(i) ? lf : nf;
  return t.test(Pn(i));
}
function uf(i, t) {
  return i == null ? void 0 : i[t];
}
function On(i, t) {
  var e = uf(i, t);
  return cf(e) ? e : void 0;
}
var Br = On(Ce, "WeakMap"), fa = Object.create, hf = /* @__PURE__ */ function() {
  function i() {
  }
  return function(t) {
    if (!Ct(t))
      return {};
    if (fa)
      return fa(t);
    i.prototype = t;
    var e = new i();
    return i.prototype = void 0, e;
  };
}();
function Ul(i, t, e) {
  switch (e.length) {
    case 0:
      return i.call(t);
    case 1:
      return i.call(t, e[0]);
    case 2:
      return i.call(t, e[0], e[1]);
    case 3:
      return i.call(t, e[0], e[1], e[2]);
  }
  return i.apply(t, e);
}
function df() {
}
function Wl(i, t) {
  var e = -1, n = i.length;
  for (t || (t = Array(n)); ++e < n; )
    t[e] = i[e];
  return t;
}
var ff = 800, gf = 16, pf = Date.now;
function mf(i) {
  var t = 0, e = 0;
  return function() {
    var n = pf(), s = gf - (n - e);
    if (e = n, s > 0) {
      if (++t >= ff)
        return arguments[0];
    } else
      t = 0;
    return i.apply(void 0, arguments);
  };
}
function bf(i) {
  return function() {
    return i;
  };
}
var ws = function() {
  try {
    var i = On(Object, "defineProperty");
    return i({}, "", {}), i;
  } catch {
  }
}(), yf = ws ? function(i, t) {
  return ws(i, "toString", {
    configurable: !0,
    enumerable: !1,
    value: bf(t),
    writable: !0
  });
} : ai, Xl = mf(yf);
function vf(i, t) {
  for (var e = -1, n = i == null ? 0 : i.length; ++e < n && t(i[e], e, i) !== !1; )
    ;
  return i;
}
function wf(i, t, e, n) {
  for (var s = i.length, r = e + -1; ++r < s; )
    if (t(i[r], r, i))
      return r;
  return -1;
}
function xf(i) {
  return i !== i;
}
function Ef(i, t, e) {
  for (var n = e - 1, s = i.length; ++n < s; )
    if (i[n] === t)
      return n;
  return -1;
}
function Cf(i, t, e) {
  return t === t ? Ef(i, t, e) : wf(i, xf, e);
}
function Yl(i, t) {
  var e = i == null ? 0 : i.length;
  return !!e && Cf(i, t, 0) > -1;
}
var Sf = 9007199254740991, Pf = /^(?:0|[1-9]\d*)$/;
function Fs(i, t) {
  var e = typeof i;
  return t = t ?? Sf, !!t && (e == "number" || e != "symbol" && Pf.test(i)) && i > -1 && i % 1 == 0 && i < t;
}
function Gs(i, t, e) {
  t == "__proto__" && ws ? ws(i, t, {
    configurable: !0,
    enumerable: !0,
    value: e,
    writable: !0
  }) : i[t] = e;
}
function li(i, t) {
  return i === t || i !== i && t !== t;
}
var Of = Object.prototype, Af = Of.hasOwnProperty;
function po(i, t, e) {
  var n = i[t];
  (!(Af.call(i, t) && li(n, e)) || e === void 0 && !(t in i)) && Gs(i, t, e);
}
function Zi(i, t, e, n) {
  var s = !e;
  e || (e = {});
  for (var r = -1, o = t.length; ++r < o; ) {
    var a = t[r], l = void 0;
    l === void 0 && (l = i[a]), s ? Gs(e, a, l) : po(e, a, l);
  }
  return e;
}
var ga = Math.max;
function Jl(i, t, e) {
  return t = ga(t === void 0 ? i.length - 1 : t, 0), function() {
    for (var n = arguments, s = -1, r = ga(n.length - t, 0), o = Array(r); ++s < r; )
      o[s] = n[t + s];
    s = -1;
    for (var a = Array(t + 1); ++s < t; )
      a[s] = n[s];
    return a[t] = e(o), Ul(i, this, a);
  };
}
function ci(i, t) {
  return Xl(Jl(i, t, ai), i + "");
}
var Mf = 9007199254740991;
function mo(i) {
  return typeof i == "number" && i > -1 && i % 1 == 0 && i <= Mf;
}
function An(i) {
  return i != null && mo(i.length) && !go(i);
}
function xs(i, t, e) {
  if (!Ct(e))
    return !1;
  var n = typeof t;
  return (n == "number" ? An(e) && Fs(t, e.length) : n == "string" && t in e) ? li(e[t], i) : !1;
}
function Kl(i) {
  return ci(function(t, e) {
    var n = -1, s = e.length, r = s > 1 ? e[s - 1] : void 0, o = s > 2 ? e[2] : void 0;
    for (r = i.length > 3 && typeof r == "function" ? (s--, r) : void 0, o && xs(e[0], e[1], o) && (r = s < 3 ? void 0 : r, s = 1), t = Object(t); ++n < s; ) {
      var a = e[n];
      a && i(t, a, n, r);
    }
    return t;
  });
}
var Tf = Object.prototype;
function Hs(i) {
  var t = i && i.constructor, e = typeof t == "function" && t.prototype || Tf;
  return i === e;
}
function Nf(i, t) {
  for (var e = -1, n = Array(i); ++e < i; )
    n[e] = t(e);
  return n;
}
var If = "[object Arguments]";
function pa(i) {
  return we(i) && cn(i) == If;
}
var Zl = Object.prototype, jf = Zl.hasOwnProperty, Lf = Zl.propertyIsEnumerable, _n = pa(/* @__PURE__ */ function() {
  return arguments;
}()) ? pa : function(i) {
  return we(i) && jf.call(i, "callee") && !Lf.call(i, "callee");
};
function kf() {
  return !1;
}
var Ql = typeof exports == "object" && exports && !exports.nodeType && exports, ma = Ql && typeof module == "object" && module && !module.nodeType && module, Rf = ma && ma.exports === Ql, ba = Rf ? Ce.Buffer : void 0, Df = ba ? ba.isBuffer : void 0, $n = Df || kf, _f = "[object Arguments]", $f = "[object Array]", Bf = "[object Boolean]", zf = "[object Date]", Vf = "[object Error]", Ff = "[object Function]", Gf = "[object Map]", Hf = "[object Number]", qf = "[object Object]", Uf = "[object RegExp]", Wf = "[object Set]", Xf = "[object String]", Yf = "[object WeakMap]", Jf = "[object ArrayBuffer]", Kf = "[object DataView]", Zf = "[object Float32Array]", Qf = "[object Float64Array]", tg = "[object Int8Array]", eg = "[object Int16Array]", ng = "[object Int32Array]", ig = "[object Uint8Array]", sg = "[object Uint8ClampedArray]", rg = "[object Uint16Array]", og = "[object Uint32Array]", gt = {};
gt[Zf] = gt[Qf] = gt[tg] = gt[eg] = gt[ng] = gt[ig] = gt[sg] = gt[rg] = gt[og] = !0;
gt[_f] = gt[$f] = gt[Jf] = gt[Bf] = gt[Kf] = gt[zf] = gt[Vf] = gt[Ff] = gt[Gf] = gt[Hf] = gt[qf] = gt[Uf] = gt[Wf] = gt[Xf] = gt[Yf] = !1;
function ag(i) {
  return we(i) && mo(i.length) && !!gt[cn(i)];
}
function qs(i) {
  return function(t) {
    return i(t);
  };
}
var tc = typeof exports == "object" && exports && !exports.nodeType && exports, Mi = tc && typeof module == "object" && module && !module.nodeType && module, lg = Mi && Mi.exports === tc, yr = lg && Gl.process, Bn = function() {
  try {
    var i = Mi && Mi.require && Mi.require("util").types;
    return i || yr && yr.binding && yr.binding("util");
  } catch {
  }
}(), ya = Bn && Bn.isTypedArray, Us = ya ? qs(ya) : ag, cg = Object.prototype, ug = cg.hasOwnProperty;
function ec(i, t) {
  var e = Kt(i), n = !e && _n(i), s = !e && !n && $n(i), r = !e && !n && !s && Us(i), o = e || n || s || r, a = o ? Nf(i.length, String) : [], l = a.length;
  for (var c in i)
    (t || ug.call(i, c)) && !(o && // Safari 9 has enumerable `arguments.length` in strict mode.
    (c == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
    s && (c == "offset" || c == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
    r && (c == "buffer" || c == "byteLength" || c == "byteOffset") || // Skip index properties.
    Fs(c, l))) && a.push(c);
  return a;
}
function nc(i, t) {
  return function(e) {
    return i(t(e));
  };
}
var hg = nc(Object.keys, Object), dg = Object.prototype, fg = dg.hasOwnProperty;
function ic(i) {
  if (!Hs(i))
    return hg(i);
  var t = [];
  for (var e in Object(i))
    fg.call(i, e) && e != "constructor" && t.push(e);
  return t;
}
function Qi(i) {
  return An(i) ? ec(i) : ic(i);
}
function gg(i) {
  var t = [];
  if (i != null)
    for (var e in Object(i))
      t.push(e);
  return t;
}
var pg = Object.prototype, mg = pg.hasOwnProperty;
function bg(i) {
  if (!Ct(i))
    return gg(i);
  var t = Hs(i), e = [];
  for (var n in i)
    n == "constructor" && (t || !mg.call(i, n)) || e.push(n);
  return e;
}
function ui(i) {
  return An(i) ? ec(i, !0) : bg(i);
}
var yg = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, vg = /^\w*$/;
function bo(i, t) {
  if (Kt(i))
    return !1;
  var e = typeof i;
  return e == "number" || e == "symbol" || e == "boolean" || i == null || Ie(i) ? !0 : vg.test(i) || !yg.test(i) || t != null && i in Object(t);
}
var Bi = On(Object, "create");
function wg() {
  this.__data__ = Bi ? Bi(null) : {}, this.size = 0;
}
function xg(i) {
  var t = this.has(i) && delete this.__data__[i];
  return this.size -= t ? 1 : 0, t;
}
var Eg = "__lodash_hash_undefined__", Cg = Object.prototype, Sg = Cg.hasOwnProperty;
function Pg(i) {
  var t = this.__data__;
  if (Bi) {
    var e = t[i];
    return e === Eg ? void 0 : e;
  }
  return Sg.call(t, i) ? t[i] : void 0;
}
var Og = Object.prototype, Ag = Og.hasOwnProperty;
function Mg(i) {
  var t = this.__data__;
  return Bi ? t[i] !== void 0 : Ag.call(t, i);
}
var Tg = "__lodash_hash_undefined__";
function Ng(i, t) {
  var e = this.__data__;
  return this.size += this.has(i) ? 0 : 1, e[i] = Bi && t === void 0 ? Tg : t, this;
}
function wn(i) {
  var t = -1, e = i == null ? 0 : i.length;
  for (this.clear(); ++t < e; ) {
    var n = i[t];
    this.set(n[0], n[1]);
  }
}
wn.prototype.clear = wg;
wn.prototype.delete = xg;
wn.prototype.get = Pg;
wn.prototype.has = Mg;
wn.prototype.set = Ng;
function Ig() {
  this.__data__ = [], this.size = 0;
}
function Ws(i, t) {
  for (var e = i.length; e--; )
    if (li(i[e][0], t))
      return e;
  return -1;
}
var jg = Array.prototype, Lg = jg.splice;
function kg(i) {
  var t = this.__data__, e = Ws(t, i);
  if (e < 0)
    return !1;
  var n = t.length - 1;
  return e == n ? t.pop() : Lg.call(t, e, 1), --this.size, !0;
}
function Rg(i) {
  var t = this.__data__, e = Ws(t, i);
  return e < 0 ? void 0 : t[e][1];
}
function Dg(i) {
  return Ws(this.__data__, i) > -1;
}
function _g(i, t) {
  var e = this.__data__, n = Ws(e, i);
  return n < 0 ? (++this.size, e.push([i, t])) : e[n][1] = t, this;
}
function Fe(i) {
  var t = -1, e = i == null ? 0 : i.length;
  for (this.clear(); ++t < e; ) {
    var n = i[t];
    this.set(n[0], n[1]);
  }
}
Fe.prototype.clear = Ig;
Fe.prototype.delete = kg;
Fe.prototype.get = Rg;
Fe.prototype.has = Dg;
Fe.prototype.set = _g;
var zi = On(Ce, "Map");
function $g() {
  this.size = 0, this.__data__ = {
    hash: new wn(),
    map: new (zi || Fe)(),
    string: new wn()
  };
}
function Bg(i) {
  var t = typeof i;
  return t == "string" || t == "number" || t == "symbol" || t == "boolean" ? i !== "__proto__" : i === null;
}
function Xs(i, t) {
  var e = i.__data__;
  return Bg(t) ? e[typeof t == "string" ? "string" : "hash"] : e.map;
}
function zg(i) {
  var t = Xs(this, i).delete(i);
  return this.size -= t ? 1 : 0, t;
}
function Vg(i) {
  return Xs(this, i).get(i);
}
function Fg(i) {
  return Xs(this, i).has(i);
}
function Gg(i, t) {
  var e = Xs(this, i), n = e.size;
  return e.set(i, t), this.size += e.size == n ? 0 : 1, this;
}
function Ge(i) {
  var t = -1, e = i == null ? 0 : i.length;
  for (this.clear(); ++t < e; ) {
    var n = i[t];
    this.set(n[0], n[1]);
  }
}
Ge.prototype.clear = $g;
Ge.prototype.delete = zg;
Ge.prototype.get = Vg;
Ge.prototype.has = Fg;
Ge.prototype.set = Gg;
var Hg = "Expected a function";
function yo(i, t) {
  if (typeof i != "function" || t != null && typeof t != "function")
    throw new TypeError(Hg);
  var e = function() {
    var n = arguments, s = t ? t.apply(this, n) : n[0], r = e.cache;
    if (r.has(s))
      return r.get(s);
    var o = i.apply(this, n);
    return e.cache = r.set(s, o) || r, o;
  };
  return e.cache = new (yo.Cache || Ge)(), e;
}
yo.Cache = Ge;
var qg = 500;
function Ug(i) {
  var t = yo(i, function(n) {
    return e.size === qg && e.clear(), n;
  }), e = t.cache;
  return t;
}
var Wg = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, Xg = /\\(\\)?/g, Yg = Ug(function(i) {
  var t = [];
  return i.charCodeAt(0) === 46 && t.push(""), i.replace(Wg, function(e, n, s, r) {
    t.push(s ? r.replace(Xg, "$1") : n || e);
  }), t;
});
function ts(i) {
  return i == null ? "" : ql(i);
}
function Ys(i, t) {
  return Kt(i) ? i : bo(i, t) ? [i] : Yg(ts(i));
}
function es(i) {
  if (typeof i == "string" || Ie(i))
    return i;
  var t = i + "";
  return t == "0" && 1 / i == -1 / 0 ? "-0" : t;
}
function Js(i, t) {
  t = Ys(t, i);
  for (var e = 0, n = t.length; i != null && e < n; )
    i = i[es(t[e++])];
  return e && e == n ? i : void 0;
}
function Jg(i, t, e) {
  var n = i == null ? void 0 : Js(i, t);
  return n === void 0 ? e : n;
}
function vo(i, t) {
  for (var e = -1, n = t.length, s = i.length; ++e < n; )
    i[s + e] = t[e];
  return i;
}
var va = de ? de.isConcatSpreadable : void 0;
function Kg(i) {
  return Kt(i) || _n(i) || !!(va && i && i[va]);
}
function Ks(i, t, e, n, s) {
  var r = -1, o = i.length;
  for (e || (e = Kg), s || (s = []); ++r < o; ) {
    var a = i[r];
    e(a) ? vo(s, a) : n || (s[s.length] = a);
  }
  return s;
}
function Zg(i) {
  var t = i == null ? 0 : i.length;
  return t ? Ks(i) : [];
}
function Qg(i) {
  return Xl(Jl(i, void 0, Zg), i + "");
}
var wo = nc(Object.getPrototypeOf, Object), tp = "[object Object]", ep = Function.prototype, np = Object.prototype, sc = ep.toString, ip = np.hasOwnProperty, sp = sc.call(Object);
function ke(i) {
  if (!we(i) || cn(i) != tp)
    return !1;
  var t = wo(i);
  if (t === null)
    return !0;
  var e = ip.call(t, "constructor") && t.constructor;
  return typeof e == "function" && e instanceof e && sc.call(e) == sp;
}
function rp(i, t, e) {
  var n = -1, s = i.length;
  t < 0 && (t = -t > s ? 0 : s + t), e = e > s ? s : e, e < 0 && (e += s), s = t > e ? 0 : e - t >>> 0, t >>>= 0;
  for (var r = Array(s); ++n < s; )
    r[n] = i[n + t];
  return r;
}
function op(i, t, e) {
  var n = i.length;
  return e = e === void 0 ? n : e, !t && e >= n ? i : rp(i, t, e);
}
var ap = "\\ud800-\\udfff", lp = "\\u0300-\\u036f", cp = "\\ufe20-\\ufe2f", up = "\\u20d0-\\u20ff", hp = lp + cp + up, dp = "\\ufe0e\\ufe0f", fp = "\\u200d", gp = RegExp("[" + fp + ap + hp + dp + "]");
function rc(i) {
  return gp.test(i);
}
function pp(i) {
  return i.split("");
}
var oc = "\\ud800-\\udfff", mp = "\\u0300-\\u036f", bp = "\\ufe20-\\ufe2f", yp = "\\u20d0-\\u20ff", vp = mp + bp + yp, wp = "\\ufe0e\\ufe0f", xp = "[" + oc + "]", zr = "[" + vp + "]", Vr = "\\ud83c[\\udffb-\\udfff]", Ep = "(?:" + zr + "|" + Vr + ")", ac = "[^" + oc + "]", lc = "(?:\\ud83c[\\udde6-\\uddff]){2}", cc = "[\\ud800-\\udbff][\\udc00-\\udfff]", Cp = "\\u200d", uc = Ep + "?", hc = "[" + wp + "]?", Sp = "(?:" + Cp + "(?:" + [ac, lc, cc].join("|") + ")" + hc + uc + ")*", Pp = hc + uc + Sp, Op = "(?:" + [ac + zr + "?", zr, lc, cc, xp].join("|") + ")", Ap = RegExp(Vr + "(?=" + Vr + ")|" + Op + Pp, "g");
function Mp(i) {
  return i.match(Ap) || [];
}
function Tp(i) {
  return rc(i) ? Mp(i) : pp(i);
}
function dc(i) {
  return function(t) {
    t = ts(t);
    var e = rc(t) ? Tp(t) : void 0, n = e ? e[0] : t.charAt(0), s = e ? op(e, 1).join("") : t.slice(1);
    return n[i]() + s;
  };
}
var Es = dc("toUpperCase");
function Np(i) {
  return Es(ts(i).toLowerCase());
}
function Ip(i, t, e, n) {
  for (var s = -1, r = i == null ? 0 : i.length; ++s < r; )
    e = t(e, i[s], s, i);
  return e;
}
function jp(i) {
  return function(t) {
    return i == null ? void 0 : i[t];
  };
}
var Lp = {
  // Latin-1 Supplement block.
  À: "A",
  Á: "A",
  Â: "A",
  Ã: "A",
  Ä: "A",
  Å: "A",
  à: "a",
  á: "a",
  â: "a",
  ã: "a",
  ä: "a",
  å: "a",
  Ç: "C",
  ç: "c",
  Ð: "D",
  ð: "d",
  È: "E",
  É: "E",
  Ê: "E",
  Ë: "E",
  è: "e",
  é: "e",
  ê: "e",
  ë: "e",
  Ì: "I",
  Í: "I",
  Î: "I",
  Ï: "I",
  ì: "i",
  í: "i",
  î: "i",
  ï: "i",
  Ñ: "N",
  ñ: "n",
  Ò: "O",
  Ó: "O",
  Ô: "O",
  Õ: "O",
  Ö: "O",
  Ø: "O",
  ò: "o",
  ó: "o",
  ô: "o",
  õ: "o",
  ö: "o",
  ø: "o",
  Ù: "U",
  Ú: "U",
  Û: "U",
  Ü: "U",
  ù: "u",
  ú: "u",
  û: "u",
  ü: "u",
  Ý: "Y",
  ý: "y",
  ÿ: "y",
  Æ: "Ae",
  æ: "ae",
  Þ: "Th",
  þ: "th",
  ß: "ss",
  // Latin Extended-A block.
  Ā: "A",
  Ă: "A",
  Ą: "A",
  ā: "a",
  ă: "a",
  ą: "a",
  Ć: "C",
  Ĉ: "C",
  Ċ: "C",
  Č: "C",
  ć: "c",
  ĉ: "c",
  ċ: "c",
  č: "c",
  Ď: "D",
  Đ: "D",
  ď: "d",
  đ: "d",
  Ē: "E",
  Ĕ: "E",
  Ė: "E",
  Ę: "E",
  Ě: "E",
  ē: "e",
  ĕ: "e",
  ė: "e",
  ę: "e",
  ě: "e",
  Ĝ: "G",
  Ğ: "G",
  Ġ: "G",
  Ģ: "G",
  ĝ: "g",
  ğ: "g",
  ġ: "g",
  ģ: "g",
  Ĥ: "H",
  Ħ: "H",
  ĥ: "h",
  ħ: "h",
  Ĩ: "I",
  Ī: "I",
  Ĭ: "I",
  Į: "I",
  İ: "I",
  ĩ: "i",
  ī: "i",
  ĭ: "i",
  į: "i",
  ı: "i",
  Ĵ: "J",
  ĵ: "j",
  Ķ: "K",
  ķ: "k",
  ĸ: "k",
  Ĺ: "L",
  Ļ: "L",
  Ľ: "L",
  Ŀ: "L",
  Ł: "L",
  ĺ: "l",
  ļ: "l",
  ľ: "l",
  ŀ: "l",
  ł: "l",
  Ń: "N",
  Ņ: "N",
  Ň: "N",
  Ŋ: "N",
  ń: "n",
  ņ: "n",
  ň: "n",
  ŋ: "n",
  Ō: "O",
  Ŏ: "O",
  Ő: "O",
  ō: "o",
  ŏ: "o",
  ő: "o",
  Ŕ: "R",
  Ŗ: "R",
  Ř: "R",
  ŕ: "r",
  ŗ: "r",
  ř: "r",
  Ś: "S",
  Ŝ: "S",
  Ş: "S",
  Š: "S",
  ś: "s",
  ŝ: "s",
  ş: "s",
  š: "s",
  Ţ: "T",
  Ť: "T",
  Ŧ: "T",
  ţ: "t",
  ť: "t",
  ŧ: "t",
  Ũ: "U",
  Ū: "U",
  Ŭ: "U",
  Ů: "U",
  Ű: "U",
  Ų: "U",
  ũ: "u",
  ū: "u",
  ŭ: "u",
  ů: "u",
  ű: "u",
  ų: "u",
  Ŵ: "W",
  ŵ: "w",
  Ŷ: "Y",
  ŷ: "y",
  Ÿ: "Y",
  Ź: "Z",
  Ż: "Z",
  Ž: "Z",
  ź: "z",
  ż: "z",
  ž: "z",
  Ĳ: "IJ",
  ĳ: "ij",
  Œ: "Oe",
  œ: "oe",
  ŉ: "'n",
  ſ: "s"
}, kp = jp(Lp), Rp = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g, Dp = "\\u0300-\\u036f", _p = "\\ufe20-\\ufe2f", $p = "\\u20d0-\\u20ff", Bp = Dp + _p + $p, zp = "[" + Bp + "]", Vp = RegExp(zp, "g");
function Fp(i) {
  return i = ts(i), i && i.replace(Rp, kp).replace(Vp, "");
}
var Gp = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;
function Hp(i) {
  return i.match(Gp) || [];
}
var qp = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;
function Up(i) {
  return qp.test(i);
}
var fc = "\\ud800-\\udfff", Wp = "\\u0300-\\u036f", Xp = "\\ufe20-\\ufe2f", Yp = "\\u20d0-\\u20ff", Jp = Wp + Xp + Yp, gc = "\\u2700-\\u27bf", pc = "a-z\\xdf-\\xf6\\xf8-\\xff", Kp = "\\xac\\xb1\\xd7\\xf7", Zp = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf", Qp = "\\u2000-\\u206f", tm = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", mc = "A-Z\\xc0-\\xd6\\xd8-\\xde", em = "\\ufe0e\\ufe0f", bc = Kp + Zp + Qp + tm, yc = "['’]", wa = "[" + bc + "]", nm = "[" + Jp + "]", vc = "\\d+", im = "[" + gc + "]", wc = "[" + pc + "]", xc = "[^" + fc + bc + vc + gc + pc + mc + "]", sm = "\\ud83c[\\udffb-\\udfff]", rm = "(?:" + nm + "|" + sm + ")", om = "[^" + fc + "]", Ec = "(?:\\ud83c[\\udde6-\\uddff]){2}", Cc = "[\\ud800-\\udbff][\\udc00-\\udfff]", kn = "[" + mc + "]", am = "\\u200d", xa = "(?:" + wc + "|" + xc + ")", lm = "(?:" + kn + "|" + xc + ")", Ea = "(?:" + yc + "(?:d|ll|m|re|s|t|ve))?", Ca = "(?:" + yc + "(?:D|LL|M|RE|S|T|VE))?", Sc = rm + "?", Pc = "[" + em + "]?", cm = "(?:" + am + "(?:" + [om, Ec, Cc].join("|") + ")" + Pc + Sc + ")*", um = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", hm = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", dm = Pc + Sc + cm, fm = "(?:" + [im, Ec, Cc].join("|") + ")" + dm, gm = RegExp([
  kn + "?" + wc + "+" + Ea + "(?=" + [wa, kn, "$"].join("|") + ")",
  lm + "+" + Ca + "(?=" + [wa, kn + xa, "$"].join("|") + ")",
  kn + "?" + xa + "+" + Ea,
  kn + "+" + Ca,
  hm,
  um,
  vc,
  fm
].join("|"), "g");
function pm(i) {
  return i.match(gm) || [];
}
function mm(i, t, e) {
  return i = ts(i), t = t, t === void 0 ? Up(i) ? pm(i) : Hp(i) : i.match(t) || [];
}
var bm = "['’]", ym = RegExp(bm, "g");
function Oc(i) {
  return function(t) {
    return Ip(mm(Fp(t).replace(ym, "")), i, "");
  };
}
var Zs = Oc(function(i, t, e) {
  return t = t.toLowerCase(), i + (e ? Np(t) : t);
});
function vm(i, t, e) {
  return i === i && (e !== void 0 && (i = i <= e ? i : e), t !== void 0 && (i = i >= t ? i : t)), i;
}
function he(i, t, e) {
  return e === void 0 && (e = t, t = void 0), e !== void 0 && (e = Ai(e), e = e === e ? e : 0), t !== void 0 && (t = Ai(t), t = t === t ? t : 0), vm(Ai(i), t, e);
}
function wm() {
  this.__data__ = new Fe(), this.size = 0;
}
function xm(i) {
  var t = this.__data__, e = t.delete(i);
  return this.size = t.size, e;
}
function Em(i) {
  return this.__data__.get(i);
}
function Cm(i) {
  return this.__data__.has(i);
}
var Sm = 200;
function Pm(i, t) {
  var e = this.__data__;
  if (e instanceof Fe) {
    var n = e.__data__;
    if (!zi || n.length < Sm - 1)
      return n.push([i, t]), this.size = ++e.size, this;
    e = this.__data__ = new Ge(n);
  }
  return e.set(i, t), this.size = e.size, this;
}
function ye(i) {
  var t = this.__data__ = new Fe(i);
  this.size = t.size;
}
ye.prototype.clear = wm;
ye.prototype.delete = xm;
ye.prototype.get = Em;
ye.prototype.has = Cm;
ye.prototype.set = Pm;
function Om(i, t) {
  return i && Zi(t, Qi(t), i);
}
function Am(i, t) {
  return i && Zi(t, ui(t), i);
}
var Ac = typeof exports == "object" && exports && !exports.nodeType && exports, Sa = Ac && typeof module == "object" && module && !module.nodeType && module, Mm = Sa && Sa.exports === Ac, Pa = Mm ? Ce.Buffer : void 0, Oa = Pa ? Pa.allocUnsafe : void 0;
function Mc(i, t) {
  if (t)
    return i.slice();
  var e = i.length, n = Oa ? Oa(e) : new i.constructor(e);
  return i.copy(n), n;
}
function Tm(i, t) {
  for (var e = -1, n = i == null ? 0 : i.length, s = 0, r = []; ++e < n; ) {
    var o = i[e];
    t(o, e, i) && (r[s++] = o);
  }
  return r;
}
function Tc() {
  return [];
}
var Nm = Object.prototype, Im = Nm.propertyIsEnumerable, Aa = Object.getOwnPropertySymbols, xo = Aa ? function(i) {
  return i == null ? [] : (i = Object(i), Tm(Aa(i), function(t) {
    return Im.call(i, t);
  }));
} : Tc;
function jm(i, t) {
  return Zi(i, xo(i), t);
}
var Lm = Object.getOwnPropertySymbols, Nc = Lm ? function(i) {
  for (var t = []; i; )
    vo(t, xo(i)), i = wo(i);
  return t;
} : Tc;
function km(i, t) {
  return Zi(i, Nc(i), t);
}
function Ic(i, t, e) {
  var n = t(i);
  return Kt(i) ? n : vo(n, e(i));
}
function Fr(i) {
  return Ic(i, Qi, xo);
}
function Rm(i) {
  return Ic(i, ui, Nc);
}
var Gr = On(Ce, "DataView"), Hr = On(Ce, "Promise"), Dn = On(Ce, "Set"), Ma = "[object Map]", Dm = "[object Object]", Ta = "[object Promise]", Na = "[object Set]", Ia = "[object WeakMap]", ja = "[object DataView]", _m = Pn(Gr), $m = Pn(zi), Bm = Pn(Hr), zm = Pn(Dn), Vm = Pn(Br), ce = cn;
(Gr && ce(new Gr(new ArrayBuffer(1))) != ja || zi && ce(new zi()) != Ma || Hr && ce(Hr.resolve()) != Ta || Dn && ce(new Dn()) != Na || Br && ce(new Br()) != Ia) && (ce = function(i) {
  var t = cn(i), e = t == Dm ? i.constructor : void 0, n = e ? Pn(e) : "";
  if (n)
    switch (n) {
      case _m:
        return ja;
      case $m:
        return Ma;
      case Bm:
        return Ta;
      case zm:
        return Na;
      case Vm:
        return Ia;
    }
  return t;
});
var Fm = Object.prototype, Gm = Fm.hasOwnProperty;
function Hm(i) {
  var t = i.length, e = new i.constructor(t);
  return t && typeof i[0] == "string" && Gm.call(i, "index") && (e.index = i.index, e.input = i.input), e;
}
var Cs = Ce.Uint8Array;
function Eo(i) {
  var t = new i.constructor(i.byteLength);
  return new Cs(t).set(new Cs(i)), t;
}
function qm(i, t) {
  var e = t ? Eo(i.buffer) : i.buffer;
  return new i.constructor(e, i.byteOffset, i.byteLength);
}
var Um = /\w*$/;
function Wm(i) {
  var t = new i.constructor(i.source, Um.exec(i));
  return t.lastIndex = i.lastIndex, t;
}
var La = de ? de.prototype : void 0, ka = La ? La.valueOf : void 0;
function Xm(i) {
  return ka ? Object(ka.call(i)) : {};
}
function jc(i, t) {
  var e = t ? Eo(i.buffer) : i.buffer;
  return new i.constructor(e, i.byteOffset, i.length);
}
var Ym = "[object Boolean]", Jm = "[object Date]", Km = "[object Map]", Zm = "[object Number]", Qm = "[object RegExp]", tb = "[object Set]", eb = "[object String]", nb = "[object Symbol]", ib = "[object ArrayBuffer]", sb = "[object DataView]", rb = "[object Float32Array]", ob = "[object Float64Array]", ab = "[object Int8Array]", lb = "[object Int16Array]", cb = "[object Int32Array]", ub = "[object Uint8Array]", hb = "[object Uint8ClampedArray]", db = "[object Uint16Array]", fb = "[object Uint32Array]";
function gb(i, t, e) {
  var n = i.constructor;
  switch (t) {
    case ib:
      return Eo(i);
    case Ym:
    case Jm:
      return new n(+i);
    case sb:
      return qm(i, e);
    case rb:
    case ob:
    case ab:
    case lb:
    case cb:
    case ub:
    case hb:
    case db:
    case fb:
      return jc(i, e);
    case Km:
      return new n();
    case Zm:
    case eb:
      return new n(i);
    case Qm:
      return Wm(i);
    case tb:
      return new n();
    case nb:
      return Xm(i);
  }
}
function Lc(i) {
  return typeof i.constructor == "function" && !Hs(i) ? hf(wo(i)) : {};
}
var pb = "[object Map]";
function mb(i) {
  return we(i) && ce(i) == pb;
}
var Ra = Bn && Bn.isMap, bb = Ra ? qs(Ra) : mb, yb = "[object Set]";
function vb(i) {
  return we(i) && ce(i) == yb;
}
var Da = Bn && Bn.isSet, wb = Da ? qs(Da) : vb, xb = 1, Eb = 2, Cb = 4, kc = "[object Arguments]", Sb = "[object Array]", Pb = "[object Boolean]", Ob = "[object Date]", Ab = "[object Error]", Rc = "[object Function]", Mb = "[object GeneratorFunction]", Tb = "[object Map]", Nb = "[object Number]", Dc = "[object Object]", Ib = "[object RegExp]", jb = "[object Set]", Lb = "[object String]", kb = "[object Symbol]", Rb = "[object WeakMap]", Db = "[object ArrayBuffer]", _b = "[object DataView]", $b = "[object Float32Array]", Bb = "[object Float64Array]", zb = "[object Int8Array]", Vb = "[object Int16Array]", Fb = "[object Int32Array]", Gb = "[object Uint8Array]", Hb = "[object Uint8ClampedArray]", qb = "[object Uint16Array]", Ub = "[object Uint32Array]", ft = {};
ft[kc] = ft[Sb] = ft[Db] = ft[_b] = ft[Pb] = ft[Ob] = ft[$b] = ft[Bb] = ft[zb] = ft[Vb] = ft[Fb] = ft[Tb] = ft[Nb] = ft[Dc] = ft[Ib] = ft[jb] = ft[Lb] = ft[kb] = ft[Gb] = ft[Hb] = ft[qb] = ft[Ub] = !0;
ft[Ab] = ft[Rc] = ft[Rb] = !1;
function Ti(i, t, e, n, s, r) {
  var o, a = t & xb, l = t & Eb, c = t & Cb;
  if (o !== void 0)
    return o;
  if (!Ct(i))
    return i;
  var u = Kt(i);
  if (u) {
    if (o = Hm(i), !a)
      return Wl(i, o);
  } else {
    var h = ce(i), d = h == Rc || h == Mb;
    if ($n(i))
      return Mc(i, a);
    if (h == Dc || h == kc || d && !s) {
      if (o = l || d ? {} : Lc(i), !a)
        return l ? km(i, Am(o, i)) : jm(i, Om(o, i));
    } else {
      if (!ft[h])
        return s ? i : {};
      o = gb(i, h, a);
    }
  }
  r || (r = new ye());
  var f = r.get(i);
  if (f)
    return f;
  r.set(i, o), wb(i) ? i.forEach(function(m) {
    o.add(Ti(m, t, e, m, i, r));
  }) : bb(i) && i.forEach(function(m, y) {
    o.set(y, Ti(m, t, e, y, i, r));
  });
  var g = c ? l ? Rm : Fr : l ? ui : Qi, p = u ? void 0 : g(i);
  return vf(p || i, function(m, y) {
    p && (y = m, m = i[y]), po(o, y, Ti(m, t, e, y, i, r));
  }), o;
}
var Wb = 4;
function qr(i) {
  return Ti(i, Wb);
}
var Xb = 1, Yb = 4;
function pt(i) {
  return Ti(i, Xb | Yb);
}
var Jb = "__lodash_hash_undefined__";
function Kb(i) {
  return this.__data__.set(i, Jb), this;
}
function Zb(i) {
  return this.__data__.has(i);
}
function zn(i) {
  var t = -1, e = i == null ? 0 : i.length;
  for (this.__data__ = new Ge(); ++t < e; )
    this.add(i[t]);
}
zn.prototype.add = zn.prototype.push = Kb;
zn.prototype.has = Zb;
function Qb(i, t) {
  for (var e = -1, n = i == null ? 0 : i.length; ++e < n; )
    if (t(i[e], e, i))
      return !0;
  return !1;
}
function Co(i, t) {
  return i.has(t);
}
var ty = 1, ey = 2;
function _c(i, t, e, n, s, r) {
  var o = e & ty, a = i.length, l = t.length;
  if (a != l && !(o && l > a))
    return !1;
  var c = r.get(i), u = r.get(t);
  if (c && u)
    return c == t && u == i;
  var h = -1, d = !0, f = e & ey ? new zn() : void 0;
  for (r.set(i, t), r.set(t, i); ++h < a; ) {
    var g = i[h], p = t[h];
    if (n)
      var m = o ? n(p, g, h, t, i, r) : n(g, p, h, i, t, r);
    if (m !== void 0) {
      if (m)
        continue;
      d = !1;
      break;
    }
    if (f) {
      if (!Qb(t, function(y, v) {
        if (!Co(f, v) && (g === y || s(g, y, e, n, r)))
          return f.push(v);
      })) {
        d = !1;
        break;
      }
    } else if (!(g === p || s(g, p, e, n, r))) {
      d = !1;
      break;
    }
  }
  return r.delete(i), r.delete(t), d;
}
function ny(i) {
  var t = -1, e = Array(i.size);
  return i.forEach(function(n, s) {
    e[++t] = [s, n];
  }), e;
}
function So(i) {
  var t = -1, e = Array(i.size);
  return i.forEach(function(n) {
    e[++t] = n;
  }), e;
}
var iy = 1, sy = 2, ry = "[object Boolean]", oy = "[object Date]", ay = "[object Error]", ly = "[object Map]", cy = "[object Number]", uy = "[object RegExp]", hy = "[object Set]", dy = "[object String]", fy = "[object Symbol]", gy = "[object ArrayBuffer]", py = "[object DataView]", _a = de ? de.prototype : void 0, vr = _a ? _a.valueOf : void 0;
function my(i, t, e, n, s, r, o) {
  switch (e) {
    case py:
      if (i.byteLength != t.byteLength || i.byteOffset != t.byteOffset)
        return !1;
      i = i.buffer, t = t.buffer;
    case gy:
      return !(i.byteLength != t.byteLength || !r(new Cs(i), new Cs(t)));
    case ry:
    case oy:
    case cy:
      return li(+i, +t);
    case ay:
      return i.name == t.name && i.message == t.message;
    case uy:
    case dy:
      return i == t + "";
    case ly:
      var a = ny;
    case hy:
      var l = n & iy;
      if (a || (a = So), i.size != t.size && !l)
        return !1;
      var c = o.get(i);
      if (c)
        return c == t;
      n |= sy, o.set(i, t);
      var u = _c(a(i), a(t), n, s, r, o);
      return o.delete(i), u;
    case fy:
      if (vr)
        return vr.call(i) == vr.call(t);
  }
  return !1;
}
var by = 1, yy = Object.prototype, vy = yy.hasOwnProperty;
function wy(i, t, e, n, s, r) {
  var o = e & by, a = Fr(i), l = a.length, c = Fr(t), u = c.length;
  if (l != u && !o)
    return !1;
  for (var h = l; h--; ) {
    var d = a[h];
    if (!(o ? d in t : vy.call(t, d)))
      return !1;
  }
  var f = r.get(i), g = r.get(t);
  if (f && g)
    return f == t && g == i;
  var p = !0;
  r.set(i, t), r.set(t, i);
  for (var m = o; ++h < l; ) {
    d = a[h];
    var y = i[d], v = t[d];
    if (n)
      var b = o ? n(v, y, d, t, i, r) : n(y, v, d, i, t, r);
    if (!(b === void 0 ? y === v || s(y, v, e, n, r) : b)) {
      p = !1;
      break;
    }
    m || (m = d == "constructor");
  }
  if (p && !m) {
    var w = i.constructor, E = t.constructor;
    w != E && "constructor" in i && "constructor" in t && !(typeof w == "function" && w instanceof w && typeof E == "function" && E instanceof E) && (p = !1);
  }
  return r.delete(i), r.delete(t), p;
}
var xy = 1, $a = "[object Arguments]", Ba = "[object Array]", os = "[object Object]", Ey = Object.prototype, za = Ey.hasOwnProperty;
function Cy(i, t, e, n, s, r) {
  var o = Kt(i), a = Kt(t), l = o ? Ba : ce(i), c = a ? Ba : ce(t);
  l = l == $a ? os : l, c = c == $a ? os : c;
  var u = l == os, h = c == os, d = l == c;
  if (d && $n(i)) {
    if (!$n(t))
      return !1;
    o = !0, u = !1;
  }
  if (d && !u)
    return r || (r = new ye()), o || Us(i) ? _c(i, t, e, n, s, r) : my(i, t, l, e, n, s, r);
  if (!(e & xy)) {
    var f = u && za.call(i, "__wrapped__"), g = h && za.call(t, "__wrapped__");
    if (f || g) {
      var p = f ? i.value() : i, m = g ? t.value() : t;
      return r || (r = new ye()), s(p, m, e, n, r);
    }
  }
  return d ? (r || (r = new ye()), wy(i, t, e, n, s, r)) : !1;
}
function Qs(i, t, e, n, s) {
  return i === t ? !0 : i == null || t == null || !we(i) && !we(t) ? i !== i && t !== t : Cy(i, t, e, n, Qs, s);
}
var Sy = 1, Py = 2;
function Oy(i, t, e, n) {
  var s = e.length, r = s;
  if (i == null)
    return !r;
  for (i = Object(i); s--; ) {
    var o = e[s];
    if (o[2] ? o[1] !== i[o[0]] : !(o[0] in i))
      return !1;
  }
  for (; ++s < r; ) {
    o = e[s];
    var a = o[0], l = i[a], c = o[1];
    if (o[2]) {
      if (l === void 0 && !(a in i))
        return !1;
    } else {
      var u = new ye(), h;
      if (!(h === void 0 ? Qs(c, l, Sy | Py, n, u) : h))
        return !1;
    }
  }
  return !0;
}
function $c(i) {
  return i === i && !Ct(i);
}
function Ay(i) {
  for (var t = Qi(i), e = t.length; e--; ) {
    var n = t[e], s = i[n];
    t[e] = [n, s, $c(s)];
  }
  return t;
}
function Bc(i, t) {
  return function(e) {
    return e == null ? !1 : e[i] === t && (t !== void 0 || i in Object(e));
  };
}
function My(i) {
  var t = Ay(i);
  return t.length == 1 && t[0][2] ? Bc(t[0][0], t[0][1]) : function(e) {
    return e === i || Oy(e, i, t);
  };
}
function Ty(i, t) {
  return i != null && t in Object(i);
}
function zc(i, t, e) {
  t = Ys(t, i);
  for (var n = -1, s = t.length, r = !1; ++n < s; ) {
    var o = es(t[n]);
    if (!(r = i != null && e(i, o)))
      break;
    i = i[o];
  }
  return r || ++n != s ? r : (s = i == null ? 0 : i.length, !!s && mo(s) && Fs(o, s) && (Kt(i) || _n(i)));
}
function Vc(i, t) {
  return i != null && zc(i, t, Ty);
}
var Ny = 1, Iy = 2;
function jy(i, t) {
  return bo(i) && $c(t) ? Bc(es(i), t) : function(e) {
    var n = Jg(e, i);
    return n === void 0 && n === t ? Vc(e, i) : Qs(t, n, Ny | Iy);
  };
}
function Ly(i) {
  return function(t) {
    return t == null ? void 0 : t[i];
  };
}
function ky(i) {
  return function(t) {
    return Js(t, i);
  };
}
function Ry(i) {
  return bo(i) ? Ly(es(i)) : ky(i);
}
function Po(i) {
  return typeof i == "function" ? i : i == null ? ai : typeof i == "object" ? Kt(i) ? jy(i[0], i[1]) : My(i) : Ry(i);
}
function Dy(i, t, e, n) {
  for (var s = -1, r = i == null ? 0 : i.length; ++s < r; ) {
    var o = i[s];
    t(n, o, e(o), i);
  }
  return n;
}
function _y(i) {
  return function(t, e, n) {
    for (var s = -1, r = Object(t), o = n(t), a = o.length; a--; ) {
      var l = o[++s];
      if (e(r[l], l, r) === !1)
        break;
    }
    return t;
  };
}
var Fc = _y();
function $y(i, t) {
  return i && Fc(i, t, Qi);
}
function By(i, t) {
  return function(e, n) {
    if (e == null)
      return e;
    if (!An(e))
      return i(e, n);
    for (var s = e.length, r = -1, o = Object(e); ++r < s && n(o[r], r, o) !== !1; )
      ;
    return e;
  };
}
var Gc = By($y);
function zy(i, t, e, n) {
  return Gc(i, function(s, r, o) {
    t(n, s, e(s), o);
  }), n;
}
function Vy(i, t) {
  return function(e, n) {
    var s = Kt(e) ? Dy : zy, r = t ? t() : {};
    return s(e, i, Po(n), r);
  };
}
var wr = function() {
  return Ce.Date.now();
}, Fy = "Expected a function", Gy = Math.max, Hy = Math.min;
function qy(i, t, e) {
  var n, s, r, o, a, l, c = 0, u = !1, h = !1, d = !0;
  if (typeof i != "function")
    throw new TypeError(Fy);
  t = Ai(t) || 0, Ct(e) && (u = !!e.leading, h = "maxWait" in e, r = h ? Gy(Ai(e.maxWait) || 0, t) : r, d = "trailing" in e ? !!e.trailing : d);
  function f(S) {
    var C = n, P = s;
    return n = s = void 0, c = S, o = i.apply(P, C), o;
  }
  function g(S) {
    return c = S, a = setTimeout(y, t), u ? f(S) : o;
  }
  function p(S) {
    var C = S - l, P = S - c, O = t - C;
    return h ? Hy(O, r - P) : O;
  }
  function m(S) {
    var C = S - l, P = S - c;
    return l === void 0 || C >= t || C < 0 || h && P >= r;
  }
  function y() {
    var S = wr();
    if (m(S))
      return v(S);
    a = setTimeout(y, p(S));
  }
  function v(S) {
    return a = void 0, d && n ? f(S) : (n = s = void 0, o);
  }
  function b() {
    a !== void 0 && clearTimeout(a), c = 0, n = l = s = a = void 0;
  }
  function w() {
    return a === void 0 ? o : v(wr());
  }
  function E() {
    var S = wr(), C = m(S);
    if (n = arguments, s = this, l = S, C) {
      if (a === void 0)
        return g(l);
      if (h)
        return clearTimeout(a), a = setTimeout(y, t), f(l);
    }
    return a === void 0 && (a = setTimeout(y, t)), o;
  }
  return E.cancel = b, E.flush = w, E;
}
var Hc = Object.prototype, Uy = Hc.hasOwnProperty, Wy = ci(function(i, t) {
  i = Object(i);
  var e = -1, n = t.length, s = n > 2 ? t[2] : void 0;
  for (s && xs(t[0], t[1], s) && (n = 1); ++e < n; )
    for (var r = t[e], o = ui(r), a = -1, l = o.length; ++a < l; ) {
      var c = o[a], u = i[c];
      (u === void 0 || li(u, Hc[c]) && !Uy.call(i, c)) && (i[c] = r[c]);
    }
  return i;
});
function Ur(i, t, e) {
  (e !== void 0 && !li(i[t], e) || e === void 0 && !(t in i)) && Gs(i, t, e);
}
function Ss(i) {
  return we(i) && An(i);
}
function Wr(i, t) {
  if (!(t === "constructor" && typeof i[t] == "function") && t != "__proto__")
    return i[t];
}
function Xy(i) {
  return Zi(i, ui(i));
}
function Yy(i, t, e, n, s, r, o) {
  var a = Wr(i, e), l = Wr(t, e), c = o.get(l);
  if (c) {
    Ur(i, e, c);
    return;
  }
  var u = r ? r(a, l, e + "", i, t, o) : void 0, h = u === void 0;
  if (h) {
    var d = Kt(l), f = !d && $n(l), g = !d && !f && Us(l);
    u = l, d || f || g ? Kt(a) ? u = a : Ss(a) ? u = Wl(a) : f ? (h = !1, u = Mc(l, !0)) : g ? (h = !1, u = jc(l, !0)) : u = [] : ke(l) || _n(l) ? (u = a, _n(a) ? u = Xy(a) : (!Ct(a) || go(a)) && (u = Lc(l))) : h = !1;
  }
  h && (o.set(l, u), s(u, l, n, r, o), o.delete(l)), Ur(i, e, u);
}
function tr(i, t, e, n, s) {
  i !== t && Fc(t, function(r, o) {
    if (s || (s = new ye()), Ct(r))
      Yy(i, t, o, e, tr, n, s);
    else {
      var a = n ? n(Wr(i, o), r, o + "", i, t, s) : void 0;
      a === void 0 && (a = r), Ur(i, o, a);
    }
  }, ui);
}
function qc(i, t, e, n, s, r) {
  return Ct(i) && Ct(t) && (r.set(t, i), tr(i, t, void 0, qc, r), r.delete(t)), i;
}
var Jy = Kl(function(i, t, e, n) {
  tr(i, t, e, n);
}), Uc = ci(function(i) {
  return i.push(void 0, qc), Ul(Jy, void 0, i);
}), Ky = 200;
function Zy(i, t, e, n) {
  var s = -1, r = Yl, o = !0, a = i.length, l = [], c = t.length;
  if (!a)
    return l;
  t.length >= Ky && (r = Co, o = !1, t = new zn(t));
  t:
    for (; ++s < a; ) {
      var u = i[s], h = u;
      if (u = u !== 0 ? u : 0, o && h === h) {
        for (var d = c; d--; )
          if (t[d] === h)
            continue t;
        l.push(u);
      } else r(t, h, n) || l.push(u);
    }
  return l;
}
var Qy = ci(function(i, t) {
  return Ss(i) ? Zy(i, Ks(t, 1, Ss, !0)) : [];
});
function tv(i, t) {
  var e = -1, n = An(i) ? Array(i.length) : [];
  return Gc(i, function(s, r, o) {
    n[++e] = t(s, r, o);
  }), n;
}
var ev = Object.prototype, nv = ev.hasOwnProperty, Va = Vy(function(i, t, e) {
  nv.call(i, e) ? i[e].push(t) : Gs(i, e, [t]);
});
function iv(i, t) {
  return i > t;
}
var sv = Object.prototype, rv = sv.hasOwnProperty;
function ov(i, t) {
  return i != null && rv.call(i, t);
}
function as(i, t) {
  return i != null && zc(i, t, ov);
}
var av = "[object Map]", lv = "[object Set]", cv = Object.prototype, uv = cv.hasOwnProperty;
function Wc(i) {
  if (i == null)
    return !0;
  if (An(i) && (Kt(i) || typeof i == "string" || typeof i.splice == "function" || $n(i) || Us(i) || _n(i)))
    return !i.length;
  var t = ce(i);
  if (t == av || t == lv)
    return !i.size;
  if (Hs(i))
    return !ic(i).length;
  for (var e in i)
    if (uv.call(i, e))
      return !1;
  return !0;
}
function Me(i, t) {
  return Qs(i, t);
}
var hv = "[object Number]";
function Fa(i) {
  return typeof i == "number" || we(i) && cn(i) == hv;
}
var dv = dc("toLowerCase");
function fv(i, t, e) {
  for (var n = -1, s = i.length; ++n < s; ) {
    var r = i[n], o = t(r);
    if (o != null && (a === void 0 ? o === o && !Ie(o) : e(o, a)))
      var a = o, l = r;
  }
  return l;
}
function gv(i) {
  return i && i.length ? fv(i, ai, iv) : void 0;
}
var kt = Kl(function(i, t, e) {
  tr(i, t, e);
});
function pv(i, t, e, n) {
  if (!Ct(i))
    return i;
  t = Ys(t, i);
  for (var s = -1, r = t.length, o = r - 1, a = i; a != null && ++s < r; ) {
    var l = es(t[s]), c = e;
    if (l === "__proto__" || l === "constructor" || l === "prototype")
      return i;
    if (s != o) {
      var u = a[l];
      c = void 0, c === void 0 && (c = Ct(u) ? u : Fs(t[s + 1]) ? [] : {});
    }
    po(a, l, c), a = a[l];
  }
  return i;
}
function mv(i, t, e) {
  for (var n = -1, s = t.length, r = {}; ++n < s; ) {
    var o = t[n], a = Js(i, o);
    e(a, o) && pv(r, Ys(o, i), a);
  }
  return r;
}
function bv(i, t) {
  var e = i.length;
  for (i.sort(t); e--; )
    i[e] = i[e].value;
  return i;
}
function yv(i, t) {
  if (i !== t) {
    var e = i !== void 0, n = i === null, s = i === i, r = Ie(i), o = t !== void 0, a = t === null, l = t === t, c = Ie(t);
    if (!a && !c && !r && i > t || r && o && l && !a && !c || n && o && l || !e && l || !s)
      return 1;
    if (!n && !r && !c && i < t || c && e && s && !n && !r || a && e && s || !o && s || !l)
      return -1;
  }
  return 0;
}
function vv(i, t, e) {
  for (var n = -1, s = i.criteria, r = t.criteria, o = s.length, a = e.length; ++n < o; ) {
    var l = yv(s[n], r[n]);
    if (l) {
      if (n >= a)
        return l;
      var c = e[n];
      return l * (c == "desc" ? -1 : 1);
    }
  }
  return i.index - t.index;
}
function wv(i, t, e) {
  t.length ? t = bs(t, function(r) {
    return Kt(r) ? function(o) {
      return Js(o, r.length === 1 ? r[0] : r);
    } : r;
  }) : t = [ai];
  var n = -1;
  t = bs(t, qs(Po));
  var s = tv(i, function(r, o, a) {
    var l = bs(t, function(c) {
      return c(r);
    });
    return { criteria: l, index: ++n, value: r };
  });
  return bv(s, function(r, o) {
    return vv(r, o, e);
  });
}
function xv(i, t) {
  return mv(i, t, function(e, n) {
    return Vc(i, n);
  });
}
var Ga = Qg(function(i, t) {
  return i == null ? {} : xv(i, t);
}), Oo = ci(function(i, t) {
  if (i == null)
    return [];
  var e = t.length;
  return e > 1 && xs(i, t[0], t[1]) ? t = [] : e > 2 && xs(t[0], t[1], t[2]) && (t = [t[0]]), wv(i, Ks(t), []);
}), Ev = 4294967295, Cv = Ev - 1, Sv = Math.floor, Pv = Math.min;
function Xc(i, t, e, n) {
  var s = 0, r = i == null ? 0 : i.length;
  if (r === 0)
    return 0;
  t = e(t);
  for (var o = t !== t, a = t === null, l = Ie(t), c = t === void 0; s < r; ) {
    var u = Sv((s + r) / 2), h = e(i[u]), d = h !== void 0, f = h === null, g = h === h, p = Ie(h);
    if (o)
      var m = g;
    else c ? m = g && d : a ? m = g && d && !f : l ? m = g && d && !f && !p : f || p ? m = !1 : m = h < t;
    m ? s = u + 1 : r = u;
  }
  return Pv(r, Cv);
}
var Ov = 4294967295, Av = Ov >>> 1;
function Mv(i, t, e) {
  var n = 0, s = i == null ? n : i.length;
  if (typeof t == "number" && t === t && s <= Av) {
    for (; n < s; ) {
      var r = n + s >>> 1, o = i[r];
      o !== null && !Ie(o) && o < t ? n = r + 1 : s = r;
    }
    return s;
  }
  return Xc(i, t, ai);
}
function Tv(i, t) {
  return Mv(i, t);
}
function Nv(i, t, e) {
  return Xc(i, t, Po(e));
}
var Iv = Oc(function(i, t, e) {
  return i + (e ? " " : "") + Es(t);
}), jv = "Expected a function";
function Lv(i, t, e) {
  var n = !0, s = !0;
  if (typeof i != "function")
    throw new TypeError(jv);
  return Ct(e) && (n = "leading" in e ? !0 : n, s = "trailing" in e ? !!e.trailing : s), qy(i, t, {
    leading: n,
    maxWait: t,
    trailing: s
  });
}
var kv = 1 / 0, Rv = Dn && 1 / So(new Dn([, -0]))[1] == kv ? function(i) {
  return new Dn(i);
} : df, Dv = 200;
function Yc(i, t, e) {
  var n = -1, s = Yl, r = i.length, o = !0, a = [], l = a;
  if (r >= Dv) {
    var c = Rv(i);
    if (c)
      return So(c);
    o = !1, s = Co, l = new zn();
  } else
    l = a;
  t:
    for (; ++n < r; ) {
      var u = i[n], h = u;
      if (u = u !== 0 ? u : 0, o && h === h) {
        for (var d = l.length; d--; )
          if (l[d] === h)
            continue t;
        a.push(u);
      } else s(l, h, e) || (l !== a && l.push(h), a.push(u));
    }
  return a;
}
var Ha = ci(function(i) {
  return Yc(Ks(i, 1, Ss, !0));
});
function Jc(i) {
  return i && i.length ? Yc(i) : [];
}
function Kc(i, t, e) {
  if (e)
    switch (e.length) {
      case 0:
        return i.call(t);
      case 1:
        return i.call(t, e[0]);
      case 2:
        return i.call(t, e[0], e[1]);
      case 3:
        return i.call(t, e[0], e[1], e[2]);
      case 4:
        return i.call(t, e[0], e[1], e[2], e[3]);
      case 5:
        return i.call(t, e[0], e[1], e[2], e[3], e[4]);
      case 6:
        return i.call(t, e[0], e[1], e[2], e[3], e[4], e[5]);
      default:
        return i.apply(t, e);
    }
  return i.call(t);
}
function z(i, t, ...e) {
  return Kc(i, t, e);
}
function _v(i) {
  return typeof i == "object" && i.then && typeof i.then == "function";
}
function Xr(i) {
  return i != null && (i instanceof Promise || _v(i));
}
function Ao(...i) {
  const t = [];
  if (i.forEach((n) => {
    Array.isArray(n) ? t.push(...n) : t.push(n);
  }), t.some((n) => Xr(n))) {
    const n = t.map((s) => Xr(s) ? s : Promise.resolve(s !== !1));
    return Promise.all(n).then((s) => s.reduce((r, o) => o !== !1 && r, !0));
  }
  return t.every((n) => n !== !1);
}
function $v(...i) {
  const t = Ao(i);
  return typeof t == "boolean" ? Promise.resolve(t) : t;
}
function xr(i, t) {
  const e = [];
  for (let n = 0; n < i.length; n += 2) {
    const s = i[n], r = i[n + 1], o = Array.isArray(t) ? t : [t], a = Kc(s, r, o);
    e.push(a);
  }
  return Ao(e);
}
class Bv {
  constructor() {
    this.listeners = {};
  }
  on(t, e, n) {
    return e == null ? this : (this.listeners[t] || (this.listeners[t] = []), this.listeners[t].push(e, n), this);
  }
  once(t, e, n) {
    const s = (...r) => (this.off(t, s), xr([e, n], r));
    return this.on(t, s, this);
  }
  off(t, e, n) {
    if (!(t || e || n))
      return this.listeners = {}, this;
    const s = this.listeners;
    return (t ? [t] : Object.keys(s)).forEach((o) => {
      const a = s[o];
      if (a) {
        if (!(e || n)) {
          delete s[o];
          return;
        }
        for (let l = a.length - 2; l >= 0; l -= 2)
          e && a[l] !== e || n && a[l + 1] !== n || a.splice(l, 2);
      }
    }), this;
  }
  trigger(t, ...e) {
    let n = !0;
    if (t !== "*") {
      const r = this.listeners[t];
      r != null && (n = xr([...r], e));
    }
    const s = this.listeners["*"];
    return s != null ? Ao([
      n,
      xr([...s], [t, ...e])
    ]) : n;
  }
  emit(t, ...e) {
    return this.trigger(t, ...e);
  }
}
function zv(i, ...t) {
  t.forEach((e) => {
    Object.getOwnPropertyNames(e.prototype).forEach((n) => {
      n !== "constructor" && Object.defineProperty(i.prototype, n, Object.getOwnPropertyDescriptor(e.prototype, n));
    });
  });
}
const Vv = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(i, t) {
  i.__proto__ = t;
} || function(i, t) {
  for (const e in t)
    Object.prototype.hasOwnProperty.call(t, e) && (i[e] = t[e]);
};
function Fv(i, t) {
  Vv(i, t);
  function e() {
    this.constructor = i;
  }
  i.prototype = t === null ? Object.create(t) : (e.prototype = t.prototype, new e());
}
class Gv {
}
const Hv = /^\s*class\s+/.test(`${Gv}`) || /^\s*class\s*\{/.test(`${class {
}}`);
function Mo(i, t) {
  let e;
  return Hv ? e = class extends t {
  } : (e = function() {
    return t.apply(this, arguments);
  }, Fv(e, t)), Object.defineProperty(e, "name", { value: i }), e;
}
function qa(i) {
  return i === "__proto__";
}
function To(i, t, e = "/") {
  let n;
  const s = Array.isArray(t) ? t : t.split(e);
  if (s.length)
    for (n = i; s.length; ) {
      const r = s.shift();
      if (Object(n) === n && r && r in n)
        n = n[r];
      else
        return;
    }
  return n;
}
function hi(i, t, e, n = "/") {
  const s = Array.isArray(t) ? t : t.split(n), r = s.pop();
  if (r && !qa(r)) {
    let o = i;
    s.forEach((a) => {
      qa(a) || (o[a] == null && (o[a] = {}), o = o[a]);
    }), o[r] = e;
  }
  return i;
}
function Ua(i, t, e = "/") {
  const n = Array.isArray(t) ? t.slice() : t.split(e), s = n.pop();
  if (s)
    if (n.length > 0) {
      const r = To(i, n);
      r && delete r[s];
    } else
      delete i[s];
  return i;
}
var qv = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
};
class Nt extends Bv {
  dispose() {
    this.off();
  }
}
qv([
  Zt.dispose()
], Nt.prototype, "dispose", null);
(function(i) {
  i.dispose = Zt.dispose;
})(Nt || (Nt = {}));
zv(Nt, Zt);
const Zc = (i) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (e) => t[e] || (t[e] = i(e));
}, Qc = Zc((i) => i.replace(/\B([A-Z])/g, "-$1").toLowerCase()), No = Zc((i) => Iv(Zs(i)).replace(/ /g, ""));
function Er(i) {
  let t = 2166136261, e = !1, n = i;
  for (let s = 0, r = n.length; s < r; s += 1) {
    let o = n.charCodeAt(s);
    o > 127 && !e && (n = unescape(encodeURIComponent(n)), o = n.charCodeAt(s), e = !0), t ^= o, t += (t << 1) + (t << 4) + (t << 7) + (t << 8) + (t << 24);
  }
  return t >>> 0;
}
function Ps() {
  let i = "";
  const t = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
  for (let e = 0, n = t.length; e < n; e += 1) {
    const s = t[e], r = Math.random() * 16 | 0, o = s === "x" ? r : s === "y" ? r & 3 | 8 : s;
    i += o.toString(16);
  }
  return i;
}
function Uv(i, t, e) {
  const n = Math.min(2, Math.floor(i.length * 0.34));
  let s = Math.floor(i.length * 0.4) + 1, r, o = !1;
  const a = i.toLowerCase();
  for (const l of t) {
    const c = e(l);
    if (c !== void 0 && Math.abs(c.length - a.length) <= n) {
      const u = c.toLowerCase();
      if (u === a) {
        if (c === i)
          continue;
        return l;
      }
      if (o || c.length < 3)
        continue;
      const h = Wv(a, u, s - 1);
      if (h === void 0)
        continue;
      h < 3 ? (o = !0, r = l) : (s = h, r = l);
    }
  }
  return r;
}
function Wv(i, t, e) {
  let n = new Array(t.length + 1), s = new Array(t.length + 1);
  const r = e + 1;
  for (let a = 0; a <= t.length; a += 1)
    n[a] = a;
  for (let a = 1; a <= i.length; a += 1) {
    const l = i.charCodeAt(a - 1), c = a > e ? a - e : 1, u = t.length > e + a ? e + a : t.length;
    s[0] = a;
    let h = a;
    for (let f = 1; f < c; f += 1)
      s[f] = r;
    for (let f = c; f <= u; f += 1) {
      const g = l === t.charCodeAt(f - 1) ? n[f - 1] : Math.min(
        /* delete */
        n[f] + 1,
        /* insert */
        s[f - 1] + 1,
        /* substitute */
        n[f - 1] + 2
      );
      s[f] = g, h = Math.min(h, g);
    }
    for (let f = u + 1; f <= t.length; f += 1)
      s[f] = r;
    if (h > e)
      return;
    const d = n;
    n = s, s = d;
  }
  const o = n[t.length];
  return o > e ? void 0 : o;
}
function ze(i) {
  return typeof i == "string" && i.slice(-1) === "%";
}
function ve(i, t) {
  if (i == null)
    return 0;
  let e;
  if (typeof i == "string") {
    if (e = parseFloat(i), ze(i) && (e /= 100, Number.isFinite(e)))
      return e * t;
  } else
    e = i;
  return Number.isFinite(e) ? e > 0 && e < 1 ? e * t : e : 0;
}
function xn(i) {
  if (typeof i == "object") {
    let e = 0, n = 0, s = 0, r = 0;
    return i.vertical != null && Number.isFinite(i.vertical) && (n = r = i.vertical), i.horizontal != null && Number.isFinite(i.horizontal) && (s = e = i.horizontal), i.left != null && Number.isFinite(i.left) && (e = i.left), i.top != null && Number.isFinite(i.top) && (n = i.top), i.right != null && Number.isFinite(i.right) && (s = i.right), i.bottom != null && Number.isFinite(i.bottom) && (r = i.bottom), { top: n, right: s, bottom: r, left: e };
  }
  let t = 0;
  return i != null && Number.isFinite(i) && (t = i), { top: t, right: t, bottom: t, left: t };
}
let Io = !1, tu = !1, eu = !1, nu = !1, iu = !1, su = !1, ru = !1, ou = !1, au = !1, lu = !1, cu = !1, uu = !1, hu = !1, du = !1, fu = !1, gu = !1;
if (typeof navigator == "object") {
  const i = navigator.userAgent;
  Io = i.indexOf("Macintosh") >= 0, tu = !!i.match(/(iPad|iPhone|iPod)/g), eu = i.indexOf("Windows") >= 0, nu = i.indexOf("MSIE") >= 0, iu = !!i.match(/Trident\/7\./), su = !!i.match(/Edge\//), ru = i.indexOf("Mozilla/") >= 0 && i.indexOf("MSIE") < 0 && i.indexOf("Edge/") < 0, au = i.indexOf("Chrome/") >= 0 && i.indexOf("Edge/") < 0, lu = i.indexOf("Opera/") >= 0 || i.indexOf("OPR/") >= 0, cu = i.indexOf("Firefox/") >= 0, uu = i.indexOf("AppleWebKit/") >= 0 && i.indexOf("Chrome/") < 0 && i.indexOf("Edge/") < 0, typeof document == "object" && (gu = !document.createElementNS || `${document.createElementNS("http://www.w3.org/2000/svg", "foreignObject")}` != "[object SVGForeignObjectElement]" || i.indexOf("Opera/") >= 0);
}
typeof window == "object" && (ou = window.chrome != null && window.chrome.app != null && window.chrome.app.runtime != null, du = window.PointerEvent != null && !Io);
if (typeof document == "object") {
  hu = "ontouchstart" in document.documentElement;
  try {
    const i = Object.defineProperty({}, "passive", {
      get() {
        fu = !0;
      }
    }), t = document.createElement("div");
    t.addEventListener && t.addEventListener("click", () => {
    }, i);
  } catch {
  }
}
var en;
(function(i) {
  i.IS_MAC = Io, i.IS_IOS = tu, i.IS_WINDOWS = eu, i.IS_IE = nu, i.IS_IE11 = iu, i.IS_EDGE = su, i.IS_NETSCAPE = ru, i.IS_CHROME_APP = ou, i.IS_CHROME = au, i.IS_OPERA = lu, i.IS_FIREFOX = cu, i.IS_SAFARI = uu, i.SUPPORT_TOUCH = hu, i.SUPPORT_POINTER = du, i.SUPPORT_PASSIVE = fu, i.NO_FOREIGNOBJECT = gu, i.SUPPORT_FOREIGNOBJECT = !i.NO_FOREIGNOBJECT;
})(en || (en = {}));
(function(i) {
  function t() {
    const r = window.module;
    return r != null && r.hot != null && r.hot.status != null ? r.hot.status() : "unkonwn";
  }
  i.getHMRStatus = t;
  function e() {
    return t() === "apply";
  }
  i.isApplyingHMR = e;
  const n = {
    select: "input",
    change: "input",
    submit: "form",
    reset: "form",
    error: "img",
    load: "img",
    abort: "img"
  };
  function s(r) {
    const o = document.createElement(n[r] || "div"), a = `on${r}`;
    let l = a in o;
    return l || (o.setAttribute(a, "return;"), l = typeof o[a] == "function"), l;
  }
  i.isEventSupported = s;
})(en || (en = {}));
const jo = /[\t\r\n\f]/g, Lo = /\S+/g, Vn = (i) => ` ${i} `;
function Fn(i) {
  return i && i.getAttribute && i.getAttribute("class") || "";
}
function di(i, t) {
  if (i == null || t == null)
    return !1;
  const e = Vn(Fn(i)), n = Vn(t);
  return i.nodeType === 1 ? e.replace(jo, " ").includes(n) : !1;
}
function U(i, t) {
  if (!(i == null || t == null)) {
    if (typeof t == "function")
      return U(i, t(Fn(i)));
    if (typeof t == "string" && i.nodeType === 1) {
      const e = t.match(Lo) || [], n = Vn(Fn(i)).replace(jo, " ");
      let s = e.reduce((r, o) => r.indexOf(Vn(o)) < 0 ? `${r}${o} ` : r, n);
      s = s.trim(), n !== s && i.setAttribute("class", s);
    }
  }
}
function Jt(i, t) {
  if (i != null) {
    if (typeof t == "function")
      return Jt(i, t(Fn(i)));
    if ((!t || typeof t == "string") && i.nodeType === 1) {
      const e = (t || "").match(Lo) || [], n = Vn(Fn(i)).replace(jo, " ");
      let s = e.reduce((r, o) => {
        const a = Vn(o);
        return r.indexOf(a) > -1 ? r.replace(a, " ") : r;
      }, n);
      s = t ? s.trim() : "", n !== s && i.setAttribute("class", s);
    }
  }
}
function pu(i, t, e) {
  if (!(i == null || t == null)) {
    if (e != null && typeof t == "string") {
      e ? U(i, t) : Jt(i, t);
      return;
    }
    if (typeof t == "function")
      return pu(i, t(Fn(i), e), e);
    typeof t == "string" && (t.match(Lo) || []).forEach((s) => {
      di(i, s) ? Jt(i, s) : U(i, s);
    });
  }
}
let Wa = 0;
function Xv() {
  return Wa += 1, `v${Wa}`;
}
function ko(i) {
  return (i.id == null || i.id === "") && (i.id = Xv()), i.id;
}
function nn(i) {
  return i == null ? !1 : typeof i.getScreenCTM == "function" && i instanceof SVGElement;
}
const Bt = {
  svg: "http://www.w3.org/2000/svg",
  xmlns: "http://www.w3.org/2000/xmlns/",
  xml: "http://www.w3.org/XML/1998/namespace",
  xlink: "http://www.w3.org/1999/xlink",
  xhtml: "http://www.w3.org/1999/xhtml"
}, Xa = "1.1";
function Ya(i, t = document) {
  return t.createElement(i);
}
function Ro(i, t = Bt.xhtml, e = document) {
  return e.createElementNS(t, i);
}
function Se(i, t = document) {
  return Ro(i, Bt.svg, t);
}
function Os(i) {
  if (i) {
    const e = `<svg xmlns="${Bt.svg}" xmlns:xlink="${Bt.xlink}" version="${Xa}">${i}</svg>`, { documentElement: n } = Yv(e, { async: !1 });
    return n;
  }
  const t = document.createElementNS(Bt.svg, "svg");
  return t.setAttributeNS(Bt.xmlns, "xmlns:xlink", Bt.xlink), t.setAttribute("version", Xa), t;
}
function Yv(i, t = {}) {
  let e;
  try {
    const n = new DOMParser();
    if (t.async != null) {
      const s = n;
      s.async = t.async;
    }
    e = n.parseFromString(i, t.mimeType || "text/xml");
  } catch {
    e = void 0;
  }
  if (!e || e.getElementsByTagName("parsererror").length)
    throw new Error(`Invalid XML: ${i}`);
  return e;
}
function Jv(i, t = !0) {
  const e = i.nodeName;
  return t ? e.toLowerCase() : e.toUpperCase();
}
function Do(i) {
  let t = 0, e = i.previousSibling;
  for (; e; )
    e.nodeType === 1 && (t += 1), e = e.previousSibling;
  return t;
}
function Kv(i, t) {
  return i.querySelectorAll(t);
}
function Zv(i, t) {
  return i.querySelector(t);
}
function mu(i, t, e) {
  const n = i.ownerSVGElement;
  let s = i.parentNode;
  for (; s && s !== e && s !== n; ) {
    if (di(s, t))
      return s;
    s = s.parentNode;
  }
  return null;
}
function _o(i, t) {
  const e = t && t.parentNode;
  return i === e || !!(e && e.nodeType === 1 && i.compareDocumentPosition(e) & 16);
}
function Te(i) {
  i && (Array.isArray(i) ? i : [i]).forEach((e) => {
    e.parentNode && e.parentNode.removeChild(e);
  });
}
function ns(i) {
  for (; i.firstChild; )
    i.removeChild(i.firstChild);
}
function Mn(i, t) {
  (Array.isArray(t) ? t : [t]).forEach((n) => {
    n != null && i.appendChild(n);
  });
}
function bu(i, t) {
  const e = i.firstChild;
  return e ? $o(e, t) : Mn(i, t);
}
function $o(i, t) {
  const e = i.parentNode;
  e && (Array.isArray(t) ? t : [t]).forEach((s) => {
    s != null && e.insertBefore(s, i);
  });
}
function Ni(i, t) {
  t != null && t.appendChild(i);
}
function Ja(i) {
  try {
    return i instanceof HTMLElement;
  } catch {
    return typeof i == "object" && i.nodeType === 1 && typeof i.style == "object" && typeof i.ownerDocument == "object";
  }
}
function Qv(i, t) {
  const e = [];
  let n = i.firstChild;
  for (; n; n = n.nextSibling)
    n.nodeType === 1 && (!t || di(n, t)) && e.push(n);
  return e;
}
const yu = [
  "viewBox",
  "attributeName",
  "attributeType",
  "repeatCount",
  "textLength",
  "lengthAdjust",
  "gradientUnits"
];
function t0(i, t) {
  return i.getAttribute(t);
}
function Bo(i, t) {
  const e = wu(t);
  e.ns ? i.hasAttributeNS(e.ns, e.local) && i.removeAttributeNS(e.ns, e.local) : i.hasAttribute(t) && i.removeAttribute(t);
}
function zo(i, t, e) {
  if (e == null)
    return Bo(i, t);
  const n = wu(t);
  n.ns && typeof e == "string" ? i.setAttributeNS(n.ns, t, e) : t === "id" ? i.id = `${e}` : i.setAttribute(t, `${e}`);
}
function vu(i, t) {
  Object.keys(t).forEach((e) => {
    zo(i, e, t[e]);
  });
}
function nt(i, t, e) {
  if (t == null) {
    const n = i.attributes, s = {};
    for (let r = 0; r < n.length; r += 1)
      s[n[r].name] = n[r].value;
    return s;
  }
  if (typeof t == "string" && e === void 0)
    return i.getAttribute(t);
  typeof t == "object" ? vu(i, t) : zo(i, t, e);
}
function wu(i) {
  if (i.indexOf(":") !== -1) {
    const t = i.split(":");
    return {
      ns: Bt[t[0]],
      local: t[1]
    };
  }
  return {
    ns: null,
    local: i
  };
}
function Vi(i) {
  const t = {};
  return Object.keys(i).forEach((e) => {
    const n = yu.includes(e) ? e : Qc(e);
    t[n] = i[e];
  }), t;
}
function ls(i) {
  const t = {};
  return i.split(";").forEach((n) => {
    const s = n.trim();
    if (s) {
      const r = s.split("=");
      r.length && (t[r[0].trim()] = r[1] ? r[1].trim() : "");
    }
  }), t;
}
function Yr(i, t) {
  return Object.keys(t).forEach((e) => {
    if (e === "class")
      i[e] = i[e] ? `${i[e]} ${t[e]}` : t[e];
    else if (e === "style") {
      const n = typeof i[e] == "object", s = typeof t[e] == "object";
      let r, o;
      n && s ? (r = i[e], o = t[e]) : n ? (r = i[e], o = ls(t[e])) : s ? (r = ls(i[e]), o = t[e]) : (r = ls(i[e]), o = ls(t[e])), i[e] = Yr(r, o);
    } else
      i[e] = t[e];
  }), i;
}
function e0(i, t, e = {}) {
  const n = e.offset || 0, s = [], r = [];
  let o, a, l = null;
  for (let c = 0; c < i.length; c += 1) {
    o = r[c] = i[c];
    for (let u = 0, h = t.length; u < h; u += 1) {
      const d = t[u], f = d.start + n, g = d.end + n;
      c >= f && c < g && (typeof o == "string" ? o = r[c] = {
        t: i[c],
        attrs: d.attrs
      } : o.attrs = Yr(Yr({}, o.attrs), d.attrs), e.includeAnnotationIndices && (o.annotations == null && (o.annotations = []), o.annotations.push(u)));
    }
    a = r[c - 1], a ? Ct(o) && Ct(a) ? (l = l, JSON.stringify(o.attrs) === JSON.stringify(a.attrs) ? l.t += o.t : (s.push(l), l = o)) : Ct(o) || Ct(a) ? (l = l, s.push(l), l = o) : l = (l || "") + o : l = o;
  }
  return l != null && s.push(l), s;
}
function n0(i) {
  return i.replace(/ /g, " ");
}
var Ka;
(function(i) {
  function t(c) {
    const u = "data:";
    return c.substr(0, u.length) === u;
  }
  i.isDataUrl = t;
  function e(c, u) {
    if (!c || t(c)) {
      setTimeout(() => u(null, c));
      return;
    }
    const h = () => {
      u(new Error(`Failed to load image: ${c}`));
    }, d = window.FileReader ? (
      // chrome, IE10+
      (g) => {
        if (g.status === 200) {
          const p = new FileReader();
          p.onload = (m) => {
            const y = m.target.result;
            u(null, y);
          }, p.onerror = h, p.readAsDataURL(g.response);
        } else
          h();
      }
    ) : (g) => {
      const p = (m) => {
        const v = [];
        for (let b = 0; b < m.length; b += 32768)
          v.push(String.fromCharCode.apply(null, m.subarray(b, b + 32768)));
        return v.join("");
      };
      if (g.status === 200) {
        let m = c.split(".").pop() || "png";
        m === "svg" && (m = "svg+xml");
        const y = `data:image/${m};base64,`, v = new Uint8Array(g.response), b = y + btoa(p(v));
        u(null, b);
      } else
        h();
    }, f = new XMLHttpRequest();
    f.responseType = window.FileReader ? "blob" : "arraybuffer", f.open("GET", c, !0), f.addEventListener("error", h), f.addEventListener("load", () => d(f)), f.send();
  }
  i.imageToDataUri = e;
  function n(c) {
    let u = c.replace(/\s/g, "");
    u = decodeURIComponent(u);
    const h = u.indexOf(","), d = u.slice(0, h), f = d.split(":")[1].split(";")[0], g = u.slice(h + 1);
    let p;
    d.indexOf("base64") >= 0 ? p = atob(g) : p = unescape(encodeURIComponent(g));
    const m = new Uint8Array(p.length);
    for (let y = 0; y < p.length; y += 1)
      m[y] = p.charCodeAt(y);
    return new Blob([m], { type: f });
  }
  i.dataUriToBlob = n;
  function s(c, u) {
    const h = window.navigator.msSaveBlob;
    if (h)
      h(c, u);
    else {
      const d = window.URL.createObjectURL(c), f = document.createElement("a");
      f.href = d, f.download = u, document.body.appendChild(f), f.click(), document.body.removeChild(f), window.URL.revokeObjectURL(d);
    }
  }
  i.downloadBlob = s;
  function r(c, u) {
    const h = n(c);
    s(h, u);
  }
  i.downloadDataUri = r;
  function o(c) {
    const u = c.match(/<svg[^>]*viewBox\s*=\s*(["']?)(.+?)\1[^>]*>/i);
    return u && u[2] ? u[2].replace(/\s+/, " ").split(" ") : null;
  }
  function a(c) {
    const u = parseFloat(c);
    return Number.isNaN(u) ? null : u;
  }
  function l(c, u = {}) {
    let h = null;
    const d = (b) => (h == null && (h = o(c)), h != null ? a(h[b]) : null), f = (b) => {
      const w = c.match(b);
      return w && w[2] ? a(w[2]) : null;
    };
    let g = u.width;
    if (g == null && (g = f(/<svg[^>]*width\s*=\s*(["']?)(.+?)\1[^>]*>/i)), g == null && (g = d(2)), g == null)
      throw new Error("Can not parse width from svg string");
    let p = u.height;
    if (p == null && (p = f(/<svg[^>]*height\s*=\s*(["']?)(.+?)\1[^>]*>/i)), p == null && (p = d(3)), p == null)
      throw new Error("Can not parse height from svg string");
    return `data:image/svg+xml,${encodeURIComponent(c).replace(/'/g, "%27").replace(/"/g, "%22")}`;
  }
  i.svgToDataUrl = l;
})(Ka || (Ka = {}));
let gn;
const i0 = {
  px(i) {
    return i;
  },
  mm(i) {
    return gn * i;
  },
  cm(i) {
    return gn * i * 10;
  },
  in(i) {
    return gn * i * 25.4;
  },
  pt(i) {
    return gn * (25.4 * i / 72);
  },
  pc(i) {
    return gn * (25.4 * i / 6);
  }
};
var Za;
(function(i) {
  function t(n, s, r) {
    const o = document.createElement("div"), a = o.style;
    a.display = "inline-block", a.position = "absolute", a.left = "-15000px", a.top = "-15000px", a.width = n + (r || "px"), a.height = s + (r || "px"), document.body.appendChild(o);
    const l = o.getBoundingClientRect(), c = {
      width: l.width || 0,
      height: l.height || 0
    };
    return document.body.removeChild(o), c;
  }
  i.measure = t;
  function e(n, s) {
    gn == null && (gn = t("1", "1", "mm").width);
    const r = s ? i0[s] : null;
    return r ? r(n) : n;
  }
  i.toPx = e;
})(Za || (Za = {}));
const s0 = /-(.)/g;
function r0(i) {
  return i.replace(s0, (t, e) => e.toUpperCase());
}
const Cr = {}, Qa = ["webkit", "ms", "moz", "o"], xu = typeof document < "u" ? document.createElement("div").style : {};
function o0(i) {
  for (let t = 0; t < Qa.length; t += 1) {
    const e = Qa[t] + i;
    if (e in xu)
      return e;
  }
  return null;
}
function a0(i) {
  const t = r0(i);
  if (Cr[t] == null) {
    const e = t.charAt(0).toUpperCase() + t.slice(1);
    Cr[t] = t in xu ? t : o0(e);
  }
  return Cr[t];
}
function tl(i, t) {
  const e = i.ownerDocument && i.ownerDocument.defaultView && i.ownerDocument.defaultView.opener ? i.ownerDocument.defaultView.getComputedStyle(i, null) : window.getComputedStyle(i, null);
  return e && t ? e.getPropertyValue(t) || e[t] : e;
}
const l0 = {
  animationIterationCount: !0,
  columnCount: !0,
  flexGrow: !0,
  flexShrink: !0,
  fontWeight: !0,
  gridArea: !0,
  gridColumn: !0,
  gridColumnEnd: !0,
  gridColumnStart: !0,
  gridRow: !0,
  gridRowEnd: !0,
  gridRowStart: !0,
  lineHeight: !0,
  opacity: !0,
  order: !0,
  orphans: !0,
  widows: !0,
  zIndex: !0
};
function c0(i) {
  return /^--/.test(i);
}
function u0(i, t, e) {
  const n = window.getComputedStyle(i, null);
  return e ? n.getPropertyValue(t) || void 0 : n[t] || i.style[t];
}
function h0(i, t) {
  return !l0[i] && typeof t == "number" ? `${t}px` : t;
}
function $t(i, t, e) {
  if (typeof t == "string") {
    const n = c0(t);
    if (n || (t = a0(t)), e === void 0)
      return u0(i, t, n);
    n || (e = h0(t, e));
    const s = i.style;
    n ? s.setProperty(t, e) : s[t] = e;
    return;
  }
  for (const n in t)
    $t(i, n, t[n]);
}
const As = /* @__PURE__ */ new WeakMap();
function el(i, t) {
  const e = Zs(t), n = As.get(i);
  if (n)
    return n[e];
}
function d0(i, t, e) {
  const n = Zs(t), s = As.get(i);
  s ? s[n] = e : As.set(i, {
    [n]: e
  });
}
function En(i, t, e) {
  if (!t) {
    const n = {};
    return Object.keys(As).forEach((s) => {
      n[s] = el(i, s);
    }), n;
  }
  if (typeof t == "string") {
    if (e === void 0)
      return el(i, t);
    d0(i, t, e);
    return;
  }
  for (const n in t)
    En(i, n, t[n]);
}
class G {
  get [Symbol.toStringTag]() {
    return G.toStringTag;
  }
  get type() {
    return this.node.nodeName;
  }
  get id() {
    return this.node.id;
  }
  set id(t) {
    this.node.id = t;
  }
  constructor(t, e, n) {
    if (!t)
      throw new TypeError("Invalid element to create vector");
    let s;
    if (G.isVector(t))
      s = t.node;
    else if (typeof t == "string")
      if (t.toLowerCase() === "svg")
        s = Os();
      else if (t[0] === "<") {
        const r = Os(t);
        s = document.importNode(r.firstChild, !0);
      } else
        s = document.createElementNS(Bt.svg, t);
    else
      s = t;
    this.node = s, e && this.setAttributes(e), n && this.append(n);
  }
  transform(t, e) {
    return t == null ? Gn(this.node) : (Gn(this.node, t, e), this);
  }
  translate(t, e = 0, n = {}) {
    return t == null ? il(this.node) : (il(this.node, t, e, n), this);
  }
  rotate(t, e, n, s = {}) {
    return t == null ? Zr(this.node) : (Zr(this.node, t, e, n, s), this);
  }
  scale(t, e) {
    return t == null ? Qr(this.node) : (Qr(this.node, t, e), this);
  }
  /**
   * Returns an SVGMatrix that specifies the transformation necessary
   * to convert this coordinate system into `target` coordinate system.
   */
  getTransformToElement(t) {
    const e = G.toNode(t);
    return ji(this.node, e);
  }
  removeAttribute(t) {
    return Bo(this.node, t), this;
  }
  getAttribute(t) {
    return t0(this.node, t);
  }
  setAttribute(t, e) {
    return zo(this.node, t, e), this;
  }
  setAttributes(t) {
    return vu(this.node, t), this;
  }
  attr(t, e) {
    return t == null ? nt(this.node) : typeof t == "string" && e === void 0 ? nt(this.node, t) : (typeof t == "object" ? nt(this.node, t) : nt(this.node, t, e), this);
  }
  svg() {
    return this.node instanceof SVGSVGElement ? this : G.create(this.node.ownerSVGElement);
  }
  defs() {
    const t = this.svg() || this, e = t.node.getElementsByTagName("defs")[0];
    return e ? G.create(e) : G.create("defs").appendTo(t);
  }
  text(t, e = {}) {
    return Cu(this.node, t, e), this;
  }
  tagName() {
    return Jv(this.node);
  }
  clone() {
    return G.create(this.node.cloneNode(!0));
  }
  remove() {
    return Te(this.node), this;
  }
  empty() {
    return ns(this.node), this;
  }
  append(t) {
    return Mn(this.node, G.toNodes(t)), this;
  }
  appendTo(t) {
    return Ni(this.node, G.isVector(t) ? t.node : t), this;
  }
  prepend(t) {
    return bu(this.node, G.toNodes(t)), this;
  }
  before(t) {
    return $o(this.node, G.toNodes(t)), this;
  }
  replace(t) {
    return this.node.parentNode && this.node.parentNode.replaceChild(G.toNode(t), this.node), G.create(t);
  }
  first() {
    return this.node.firstChild ? G.create(this.node.firstChild) : null;
  }
  last() {
    return this.node.lastChild ? G.create(this.node.lastChild) : null;
  }
  get(t) {
    const e = this.node.childNodes[t];
    return e ? G.create(e) : null;
  }
  indexOf(t) {
    return Array.prototype.slice.call(this.node.childNodes).indexOf(G.toNode(t));
  }
  find(t) {
    const e = [], n = Kv(this.node, t);
    if (n)
      for (let s = 0, r = n.length; s < r; s += 1)
        e.push(G.create(n[s]));
    return e;
  }
  findOne(t) {
    const e = Zv(this.node, t);
    return e ? G.create(e) : null;
  }
  findParentByClass(t, e) {
    const n = mu(this.node, t, e);
    return n ? G.create(n) : null;
  }
  matches(t) {
    const e = this.node;
    this.node.matches;
    const n = e.matches || e.matchesSelector || e.msMatchesSelector || e.mozMatchesSelector || e.webkitMatchesSelector || e.oMatchesSelector || null;
    return n && n.call(e, t);
  }
  contains(t) {
    return _o(this.node, G.isVector(t) ? t.node : t);
  }
  wrap(t) {
    const e = G.create(t), n = this.node.parentNode;
    return n != null && n.insertBefore(e.node, this.node), e.append(this);
  }
  parent(t) {
    let e = this;
    if (e.node.parentNode == null)
      return null;
    if (e = G.create(e.node.parentNode), t == null)
      return e;
    do
      if (typeof t == "string" ? e.matches(t) : e instanceof t)
        return e;
    while (e = G.create(e.node.parentNode));
    return e;
  }
  children() {
    const t = this.node.childNodes, e = [];
    for (let n = 0; n < t.length; n += 1)
      t[n].nodeType === 1 && e.push(G.create(t[n]));
    return e;
  }
  eachChild(t, e) {
    const n = this.children();
    for (let s = 0, r = n.length; s < r; s += 1)
      t.call(n[s], n[s], s, n), e && n[s].eachChild(t, e);
    return this;
  }
  index() {
    return Do(this.node);
  }
  hasClass(t) {
    return di(this.node, t);
  }
  addClass(t) {
    return U(this.node, t), this;
  }
  removeClass(t) {
    return Jt(this.node, t), this;
  }
  toggleClass(t, e) {
    return pu(this.node, t, e), this;
  }
  toLocalPoint(t, e) {
    return j0(this.node, t, e);
  }
  /**
   * Samples the underlying SVG element (it currently works only on
   * paths - where it is most useful anyway). Returns an array of objects
   * of the form `{ x: Number, y: Number, distance: Number }`. Each of these
   * objects represent a point on the path. This basically creates a discrete
   * representation of the path (which is possible a curve). The sampling
   * interval defines the accuracy of the sampling. In other words, we travel
   * from the beginning of the path to the end by interval distance (on the
   * path, not between the resulting points) and collect the discrete points
   * on the path. This is very useful in many situations. For example, SVG
   * does not provide a built-in mechanism to find intersections between two
   * paths. Using sampling, we can just generate bunch of points for each of
   * the path and find the closest ones from each set.
   */
  sample(t = 1) {
    return this.node instanceof SVGPathElement ? m0(this.node, t) : [];
  }
  toPath() {
    return G.create(C0(this.node));
  }
  toPathData() {
    return Au(this.node);
  }
}
(function(i) {
  i.toStringTag = `X6.${i.name}`;
  function t(o) {
    if (o == null)
      return !1;
    if (o instanceof i)
      return !0;
    const a = o[Symbol.toStringTag], l = o;
    return (a == null || a === i.toStringTag) && l.node instanceof SVGElement && typeof l.sample == "function" && typeof l.toPath == "function";
  }
  i.isVector = t;
  function e(o, a, l) {
    return new i(o, a, l);
  }
  i.create = e;
  function n(o) {
    if (o[0] === "<") {
      const a = Os(o), l = [];
      for (let c = 0, u = a.childNodes.length; c < u; c += 1) {
        const h = a.childNodes[c];
        l.push(e(document.importNode(h, !0)));
      }
      return l;
    }
    return [e(o)];
  }
  i.createVectors = n;
  function s(o) {
    return t(o) ? o.node : o;
  }
  i.toNode = s;
  function r(o) {
    return Array.isArray(o) ? o.map((a) => s(a)) : [s(o)];
  }
  i.toNodes = r;
})(G || (G = {}));
function f0(i, t) {
  const e = G.create(t), n = G.create("textPath"), s = i.d;
  if (s && i["xlink:href"] === void 0) {
    const r = G.create("path").attr("d", s).appendTo(e.defs());
    n.attr("xlink:href", `#${r.id}`);
  }
  return typeof i == "object" && n.attr(i), n.node;
}
function g0(i, t, e) {
  const n = e.eol, s = e.baseSize, r = e.lineHeight;
  let o = 0, a;
  const l = {}, c = t.length - 1;
  for (let u = 0; u <= c; u += 1) {
    let h = t[u], d = null;
    if (typeof h == "object") {
      const f = h.attrs, g = G.create("tspan", f);
      a = g.node;
      let p = h.t;
      n && u === c && (p += n), a.textContent = p;
      const m = f.class;
      m && g.addClass(m), e.includeAnnotationIndices && g.attr("annotations", h.annotations.join(",")), d = parseFloat(f["font-size"]), d === void 0 && (d = s), d && d > o && (o = d);
    } else
      n && u === c && (h += n), a = document.createTextNode(h || " "), s && s > o && (o = s);
    i.appendChild(a);
  }
  return o && (l.maxFontSize = o), r ? l.lineHeight = r : o && (l.lineHeight = o * 1.2), l;
}
const Eu = /em$/;
function cs(i, t) {
  const e = parseFloat(i);
  return Eu.test(i) ? e * t : e;
}
function p0(i, t, e, n) {
  if (!Array.isArray(t))
    return 0;
  const s = t.length;
  if (!s)
    return 0;
  let r = t[0];
  const o = cs(r.maxFontSize, e) || e;
  let a = 0;
  const l = cs(n, e);
  for (let h = 1; h < s; h += 1) {
    r = t[h];
    const d = cs(r.lineHeight, e) || l;
    a += d;
  }
  const c = cs(r.maxFontSize, e) || e;
  let u;
  switch (i) {
    case "middle":
      u = o / 2 - 0.15 * c - a / 2;
      break;
    case "bottom":
      u = -(0.25 * c) - a;
      break;
    case "top":
    default:
      u = 0.8 * o;
      break;
  }
  return u;
}
function Cu(i, t, e = {}) {
  t = n0(t);
  const n = e.eol;
  let s = e.textPath;
  const r = e.textVerticalAnchor, o = r === "middle" || r === "bottom" || r === "top";
  let a = e.x;
  a === void 0 && (a = i.getAttribute("x") || 0);
  const l = e.includeAnnotationIndices;
  let c = e.annotations;
  c && !Array.isArray(c) && (c = [c]);
  const u = e.lineHeight, h = u === "auto", d = h ? "1.5em" : u || "1em";
  let f = !0;
  const g = i.childNodes;
  if (g.length === 1) {
    const O = g[0];
    O && O.tagName.toUpperCase() === "TITLE" && (f = !1);
  }
  f && ns(i), nt(i, {
    // Preserve spaces, do not consecutive spaces to get collapsed to one.
    "xml:space": "preserve",
    // An empty text gets rendered into the DOM in webkit-based browsers.
    // In order to unify this behaviour across all browsers
    // we rather hide the text element when it's empty.
    display: t || e.displayEmpty ? null : "none"
  });
  const p = nt(i, "font-size");
  let m = parseFloat(p);
  m || (m = 16, (o || c) && !p && nt(i, "font-size", `${m}`));
  let y;
  s ? (typeof s == "string" && (s = { d: s }), y = f0(s, i)) : y = document.createDocumentFragment();
  let v, b = 0, w;
  const E = t.split(`
`), S = [], C = E.length - 1;
  for (let O = 0; O <= C; O += 1) {
    v = d;
    let I = "v-line";
    const T = Se("tspan");
    let k, H = E[O];
    if (H)
      if (c) {
        const $ = e0(H, c, {
          offset: -b,
          includeAnnotationIndices: l
        });
        k = g0(T, $, {
          eol: O !== C && n,
          baseSize: m,
          lineHeight: h ? null : d,
          includeAnnotationIndices: l
        });
        const A = k.lineHeight;
        A && h && O !== 0 && (v = A), O === 0 && (w = k.maxFontSize * 0.8);
      } else
        n && O !== C && (H += n), T.textContent = H;
    else {
      T.textContent = "-", I += " v-empty-line";
      const $ = T.style;
      $.fillOpacity = 0, $.strokeOpacity = 0, c && (k = {});
    }
    k && S.push(k), O > 0 && T.setAttribute("dy", v), (O > 0 || s) && T.setAttribute("x", a), T.className.baseVal = I, y.appendChild(T), b += H.length + 1;
  }
  if (o)
    if (c)
      v = p0(r, S, m, d);
    else if (r === "top")
      v = "0.8em";
    else {
      let O;
      switch (C > 0 ? (O = parseFloat(d) || 1, O *= C, Eu.test(d) || (O /= m)) : O = 0, r) {
        case "middle":
          v = `${0.3 - O / 2}em`;
          break;
        case "bottom":
          v = `${-O - 0.3}em`;
          break;
      }
    }
  else r === 0 ? v = "0em" : r ? v = r : (v = 0, i.getAttribute("y") == null && i.setAttribute("y", `${w || "0.8em"}`));
  y.firstChild.setAttribute("dy", v), i.appendChild(y);
}
function Ii(i, t = {}) {
  const e = document.createElement("canvas").getContext("2d");
  if (!i)
    return { width: 0 };
  const n = [], s = t["font-size"] ? `${parseFloat(t["font-size"])}px` : "14px";
  return n.push(t["font-style"] || "normal"), n.push(t["font-variant"] || "normal"), n.push(t["font-weight"] || 400), n.push(s), n.push(t["font-family"] || "sans-serif"), e.font = n.join(" "), e.measureText(i);
}
function nl(i, t, e, n = {}) {
  if (t >= e)
    return [i, ""];
  const s = i.length, r = {};
  let o = Math.round(t / e * s - 1);
  for (o < 0 && (o = 0); o >= 0 && o < s; ) {
    const a = i.slice(0, o), l = r[a] || Ii(a, n).width, c = i.slice(0, o + 1), u = r[c] || Ii(c, n).width;
    if (r[a] = l, r[c] = u, l > t)
      o -= 1;
    else if (u <= t)
      o += 1;
    else
      break;
  }
  return [i.slice(0, o), i.slice(o)];
}
function Su(i, t, e = {}, n = {}) {
  const s = t.width, r = t.height, o = n.eol || `
`, a = e.fontSize || 14, l = e.lineHeight ? parseFloat(e.lineHeight) : Math.ceil(a * 1.4), c = Math.floor(r / l);
  if (i.indexOf(o) > -1) {
    const m = Ps(), y = [];
    return i.split(o).map((v) => {
      const b = Su(v, Object.assign(Object.assign({}, t), { height: Number.MAX_SAFE_INTEGER }), e, Object.assign(Object.assign({}, n), { eol: m }));
      b && y.push(...b.split(m));
    }), y.slice(0, c).join(o);
  }
  const { width: u } = Ii(i, e);
  if (u < s)
    return i;
  const h = [];
  let d = i, f = u, g = n.ellipsis, p = 0;
  g && (typeof g != "string" && (g = "…"), p = Ii(g, e).width);
  for (let m = 0; m < c; m += 1)
    if (f > s)
      if (m === c - 1) {
        const [v] = nl(d, s - p, f, e);
        h.push(g ? `${v}${g}` : v);
      } else {
        const [v, b] = nl(d, s, f, e);
        h.push(v), d = b, f = Ii(d, e).width;
      }
    else {
      h.push(d);
      break;
    }
  return h.join(o);
}
const Jr = 0.551784;
function Wt(i, t, e = NaN) {
  const n = i.getAttribute(t);
  if (n == null)
    return e;
  const s = parseFloat(n);
  return Number.isNaN(s) ? e : s;
}
function m0(i, t = 1) {
  const e = i.getTotalLength(), n = [];
  let s = 0, r;
  for (; s < e; )
    r = i.getPointAtLength(s), n.push({ distance: s, x: r.x, y: r.y }), s += t;
  return n;
}
function b0(i) {
  return [
    "M",
    Wt(i, "x1"),
    Wt(i, "y1"),
    "L",
    Wt(i, "x2"),
    Wt(i, "y2")
  ].join(" ");
}
function y0(i) {
  const t = Ms(i);
  return t.length === 0 ? null : `${Pu(t)} Z`;
}
function v0(i) {
  const t = Ms(i);
  return t.length === 0 ? null : Pu(t);
}
function Pu(i) {
  return `M ${i.map((e) => `${e.x} ${e.y}`).join(" L")}`;
}
function Ms(i) {
  const t = [], e = i.points;
  if (e)
    for (let n = 0, s = e.numberOfItems; n < s; n += 1)
      t.push(e.getItem(n));
  return t;
}
function w0(i) {
  const t = Wt(i, "cx", 0), e = Wt(i, "cy", 0), n = Wt(i, "r"), s = n * Jr;
  return [
    "M",
    t,
    e - n,
    "C",
    t + s,
    e - n,
    t + n,
    e - s,
    t + n,
    e,
    "C",
    t + n,
    e + s,
    t + s,
    e + n,
    t,
    e + n,
    "C",
    t - s,
    e + n,
    t - n,
    e + s,
    t - n,
    e,
    "C",
    t - n,
    e - s,
    t - s,
    e - n,
    t,
    e - n,
    "Z"
  ].join(" ");
}
function x0(i) {
  const t = Wt(i, "cx", 0), e = Wt(i, "cy", 0), n = Wt(i, "rx"), s = Wt(i, "ry") || n, r = n * Jr, o = s * Jr;
  return [
    "M",
    t,
    e - s,
    "C",
    t + r,
    e - s,
    t + n,
    e - o,
    t + n,
    e,
    "C",
    t + n,
    e + o,
    t + r,
    e + s,
    t,
    e + s,
    "C",
    t - r,
    e + s,
    t - n,
    e + o,
    t - n,
    e,
    "C",
    t - n,
    e - o,
    t - r,
    e - s,
    t,
    e - s,
    "Z"
  ].join(" ");
}
function E0(i) {
  return Ou({
    x: Wt(i, "x", 0),
    y: Wt(i, "y", 0),
    width: Wt(i, "width", 0),
    height: Wt(i, "height", 0),
    rx: Wt(i, "rx", 0),
    ry: Wt(i, "ry", 0)
  });
}
function Ou(i) {
  let t;
  const e = i.x, n = i.y, s = i.width, r = i.height, o = Math.min(i.rx || i["top-rx"] || 0, s / 2), a = Math.min(i.rx || i["bottom-rx"] || 0, s / 2), l = Math.min(i.ry || i["top-ry"] || 0, r / 2), c = Math.min(i.ry || i["bottom-ry"] || 0, r / 2);
  return o || a || l || c ? t = [
    "M",
    e,
    n + l,
    "v",
    r - l - c,
    "a",
    a,
    c,
    0,
    0,
    0,
    a,
    c,
    "h",
    s - 2 * a,
    "a",
    a,
    c,
    0,
    0,
    0,
    a,
    -c,
    "v",
    -(r - c - l),
    "a",
    o,
    l,
    0,
    0,
    0,
    -o,
    -l,
    "h",
    -(s - 2 * o),
    "a",
    o,
    l,
    0,
    0,
    0,
    -o,
    l,
    "Z"
  ] : t = ["M", e, n, "H", e + s, "V", n + r, "H", e, "V", n, "Z"], t.join(" ");
}
function C0(i) {
  const t = Se("path");
  nt(t, nt(i));
  const e = Au(i);
  return e && t.setAttribute("d", e), t;
}
function Au(i) {
  const t = i.tagName.toLowerCase();
  switch (t) {
    case "path":
      return i.getAttribute("d");
    case "line":
      return b0(i);
    case "polygon":
      return y0(i);
    case "polyline":
      return v0(i);
    case "ellipse":
      return x0(i);
    case "circle":
      return w0(i);
    case "rect":
      return E0(i);
  }
  throw new Error(`"${t}" cannot be converted to svg path element.`);
}
const S0 = /(\w+)\(([^,)]+),?([^)]+)?\)/gi, Mu = /[ ,]+/, P0 = /^(\w+)\((.*)\)/;
function O0(i, t) {
  const n = Se("svg").createSVGPoint();
  return n.x = i, n.y = t, n;
}
function Vt(i) {
  const e = Se("svg").createSVGMatrix();
  if (i != null) {
    const n = i, s = e;
    for (const r in n)
      s[r] = n[r];
  }
  return e;
}
function Ci(i) {
  const t = Se("svg");
  return i != null ? (i instanceof DOMMatrix || (i = Vt(i)), t.createSVGTransformFromMatrix(i)) : t.createSVGTransform();
}
function Fi(i) {
  let t = Vt();
  const e = i != null && i.match(S0);
  if (!e)
    return t;
  for (let n = 0, s = e.length; n < s; n += 1) {
    const o = e[n].match(P0);
    if (o) {
      let a, l, c, u, h, d = Vt();
      const f = o[2].split(Mu);
      switch (o[1].toLowerCase()) {
        case "scale":
          a = parseFloat(f[0]), l = f[1] === void 0 ? a : parseFloat(f[1]), d = d.scaleNonUniform(a, l);
          break;
        case "translate":
          c = parseFloat(f[0]), u = parseFloat(f[1]), d = d.translate(c, u);
          break;
        case "rotate":
          h = parseFloat(f[0]), c = parseFloat(f[1]) || 0, u = parseFloat(f[2]) || 0, c !== 0 || u !== 0 ? d = d.translate(c, u).rotate(h).translate(-c, -u) : d = d.rotate(h);
          break;
        case "skewx":
          h = parseFloat(f[0]), d = d.skewX(h);
          break;
        case "skewy":
          h = parseFloat(f[0]), d = d.skewY(h);
          break;
        case "matrix":
          d.a = parseFloat(f[0]), d.b = parseFloat(f[1]), d.c = parseFloat(f[2]), d.d = parseFloat(f[3]), d.e = parseFloat(f[4]), d.f = parseFloat(f[5]);
          break;
        default:
          continue;
      }
      t = t.multiply(d);
    }
  }
  return t;
}
function fi(i) {
  const t = i || {}, e = t.a != null ? t.a : 1, n = t.b != null ? t.b : 0, s = t.c != null ? t.c : 0, r = t.d != null ? t.d : 1, o = t.e != null ? t.e : 0, a = t.f != null ? t.f : 0;
  return `matrix(${e},${n},${s},${r},${o},${a})`;
}
function er(i) {
  let t, e, n;
  if (i) {
    const r = Mu;
    if (i.trim().indexOf("matrix") >= 0) {
      const o = Fi(i), a = A0(o);
      t = [a.translateX, a.translateY], e = [a.rotation], n = [a.scaleX, a.scaleY];
      const l = [];
      (t[0] !== 0 || t[1] !== 0) && l.push(`translate(${t.join(",")})`), (n[0] !== 1 || n[1] !== 1) && l.push(`scale(${n.join(",")})`), e[0] !== 0 && l.push(`rotate(${e[0]})`), i = l.join(" ");
    } else {
      const o = i.match(/translate\((.*?)\)/);
      o && (t = o[1].split(r));
      const a = i.match(/rotate\((.*?)\)/);
      a && (e = a[1].split(r));
      const l = i.match(/scale\((.*?)\)/);
      l && (n = l[1].split(r));
    }
  }
  const s = n && n[0] ? parseFloat(n[0]) : 1;
  return {
    raw: i || "",
    translation: {
      tx: t && t[0] ? parseInt(t[0], 10) : 0,
      ty: t && t[1] ? parseInt(t[1], 10) : 0
    },
    rotation: {
      angle: e && e[0] ? parseInt(e[0], 10) : 0,
      cx: e && e[1] ? parseInt(e[1], 10) : void 0,
      cy: e && e[2] ? parseInt(e[2], 10) : void 0
    },
    scale: {
      sx: s,
      sy: n && n[1] ? parseFloat(n[1]) : s
    }
  };
}
function Kr(i, t) {
  const e = t.x * i.a + t.y * i.c + 0, n = t.x * i.b + t.y * i.d + 0;
  return { x: e, y: n };
}
function A0(i) {
  const t = Kr(i, { x: 0, y: 1 }), e = Kr(i, { x: 1, y: 0 }), n = 180 / Math.PI * Math.atan2(t.y, t.x) - 90, s = 180 / Math.PI * Math.atan2(e.y, e.x);
  return {
    skewX: n,
    skewY: s,
    translateX: i.e,
    translateY: i.f,
    scaleX: Math.sqrt(i.a * i.a + i.b * i.b),
    scaleY: Math.sqrt(i.c * i.c + i.d * i.d),
    rotation: n
  };
}
function M0(i) {
  let t, e, n, s;
  return i ? (t = i.a == null ? 1 : i.a, s = i.d == null ? 1 : i.d, e = i.b, n = i.c) : t = s = 1, {
    sx: e ? Math.sqrt(t * t + e * e) : t,
    sy: n ? Math.sqrt(n * n + s * s) : s
  };
}
function T0(i) {
  let t = { x: 0, y: 1 };
  i && (t = Kr(i, t));
  const e = 180 * Math.atan2(t.y, t.x) / Math.PI % 360 - 90;
  return {
    angle: e % 360 + (e < 0 ? 360 : 0)
  };
}
function N0(i) {
  return {
    tx: i && i.e || 0,
    ty: i && i.f || 0
  };
}
function Gn(i, t, e = {}) {
  if (t == null)
    return Fi(nt(i, "transform"));
  if (e.absolute) {
    i.setAttribute("transform", fi(t));
    return;
  }
  const n = i.transform, s = Ci(t);
  n.baseVal.appendItem(s);
}
function il(i, t, e = 0, n = {}) {
  let s = nt(i, "transform");
  const r = er(s);
  if (t == null)
    return r.translation;
  s = r.raw, s = s.replace(/translate\([^)]*\)/g, "").trim();
  const o = n.absolute ? t : r.translation.tx + t, a = n.absolute ? e : r.translation.ty + e, l = `translate(${o},${a})`;
  i.setAttribute("transform", `${l} ${s}`.trim());
}
function Zr(i, t, e, n, s = {}) {
  let r = nt(i, "transform");
  const o = er(r);
  if (t == null)
    return o.rotation;
  r = o.raw, r = r.replace(/rotate\([^)]*\)/g, "").trim(), t %= 360;
  const a = s.absolute ? t : o.rotation.angle + t, l = e != null && n != null ? `,${e},${n}` : "", c = `rotate(${a}${l})`;
  i.setAttribute("transform", `${r} ${c}`.trim());
}
function Qr(i, t, e) {
  let n = nt(i, "transform");
  const s = er(n);
  if (t == null)
    return s.scale;
  e = e ?? t, n = s.raw, n = n.replace(/scale\([^)]*\)/g, "").trim();
  const r = `scale(${t},${e})`;
  i.setAttribute("transform", `${n} ${r}`.trim());
}
function ji(i, t) {
  if (nn(t) && nn(i)) {
    const e = t.getScreenCTM(), n = i.getScreenCTM();
    if (e && n)
      return e.inverse().multiply(n);
  }
  return Vt();
}
function I0(i, t) {
  let e = Vt();
  if (nn(t) && nn(i)) {
    let n = i;
    const s = [];
    for (; n && n !== t; ) {
      const r = n.getAttribute("transform") || null, o = Fi(r);
      s.push(o), n = n.parentNode;
    }
    s.reverse().forEach((r) => {
      e = e.multiply(r);
    });
  }
  return e;
}
function j0(i, t, e) {
  const n = i instanceof SVGSVGElement ? i : i.ownerSVGElement, s = n.createSVGPoint();
  s.x = t, s.y = e;
  try {
    const r = n.getScreenCTM(), o = s.matrixTransform(r.inverse()), a = ji(i, n).inverse();
    return o.matrixTransform(a);
  } catch {
    return s;
  }
}
var ue;
(function(i) {
  const t = {};
  function e(r) {
    return t[r] || {};
  }
  i.get = e;
  function n(r, o) {
    t[r] = o;
  }
  i.register = n;
  function s(r) {
    delete t[r];
  }
  i.unregister = s;
})(ue || (ue = {}));
var pn;
(function(i) {
  const t = /* @__PURE__ */ new WeakMap();
  function e(r) {
    return t.has(r) || t.set(r, { events: /* @__PURE__ */ Object.create(null) }), t.get(r);
  }
  i.ensure = e;
  function n(r) {
    return t.get(r);
  }
  i.get = n;
  function s(r) {
    return t.delete(r);
  }
  i.remove = s;
})(pn || (pn = {}));
var q;
(function(i) {
  i.returnTrue = () => !0, i.returnFalse = () => !1;
  function t(s) {
    s.stopPropagation();
  }
  i.stopPropagationCallback = t;
  function e(s, r, o) {
    s.addEventListener != null && s.addEventListener(r, o);
  }
  i.addEventListener = e;
  function n(s, r, o) {
    s.removeEventListener != null && s.removeEventListener(r, o);
  }
  i.removeEventListener = n;
})(q || (q = {}));
(function(i) {
  const t = /[^\x20\t\r\n\f]+/g, e = /^([^.]*)(?:\.(.+)|)/;
  function n(a) {
    return (a || "").match(t) || [""];
  }
  i.splitType = n;
  function s(a) {
    const l = e.exec(a) || [];
    return {
      originType: l[1] ? l[1].trim() : l[1],
      namespaces: l[2] ? l[2].split(".").map((c) => c.trim()).sort() : []
    };
  }
  i.normalizeType = s;
  function r(a) {
    return a.nodeType === 1 || a.nodeType === 9 || !+a.nodeType;
  }
  i.isValidTarget = r;
  function o(a, l) {
    if (l) {
      const c = a;
      return c.querySelector != null && c.querySelector(l) != null;
    }
    return !0;
  }
  i.isValidSelector = o;
})(q || (q = {}));
(function(i) {
  let t = 0;
  const e = /* @__PURE__ */ new WeakMap();
  function n(a) {
    return e.has(a) || (e.set(a, t), t += 1), e.get(a);
  }
  i.ensureHandlerId = n;
  function s(a) {
    return e.get(a);
  }
  i.getHandlerId = s;
  function r(a) {
    return e.delete(a);
  }
  i.removeHandlerId = r;
  function o(a, l) {
    return e.set(a, l);
  }
  i.setHandlerId = o;
})(q || (q = {}));
(function(i) {
  function t(e, n) {
    const s = [], r = pn.get(e), o = r && r.events && r.events[n.type], a = o && o.handlers || [], l = o ? o.delegateCount : 0;
    if (l > 0 && // Support: Firefox <=42 - 66+
    // Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
    // https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
    // Support: IE 11+
    // ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
    !(n.type === "click" && typeof n.button == "number" && n.button >= 1)) {
      for (let c = n.target; c !== e; c = c.parentNode || e)
        if (c.nodeType === 1 && !(n.type === "click" && c.disabled === !0)) {
          const u = [], h = {};
          for (let d = 0; d < l; d += 1) {
            const f = a[d], g = f.selector;
            if (g != null && h[g] == null) {
              const p = e, m = [];
              p.querySelectorAll(g).forEach((y) => {
                m.push(y);
              }), h[g] = m.includes(c);
            }
            h[g] && u.push(f);
          }
          u.length && s.push({ elem: c, handlers: u });
        }
    }
    return l < a.length && s.push({ elem: e, handlers: a.slice(l) }), s;
  }
  i.getHandlerQueue = t;
})(q || (q = {}));
(function(i) {
  function t(e) {
    return e != null && e === e.window;
  }
  i.isWindow = t;
})(q || (q = {}));
(function(i) {
  function t(e, n) {
    const s = e.nodeType === 9 ? e.documentElement : e, r = n && n.parentNode;
    return e === r || !!(r && r.nodeType === 1 && // Support: IE 9 - 11+
    // IE doesn't have `contains` on SVG.
    (s.contains ? s.contains(r) : e.compareDocumentPosition && e.compareDocumentPosition(r) & 16));
  }
  i.contains = t;
})(q || (q = {}));
class Ne {
  constructor(t, e) {
    this.isDefaultPrevented = q.returnFalse, this.isPropagationStopped = q.returnFalse, this.isImmediatePropagationStopped = q.returnFalse, this.isSimulated = !1, this.preventDefault = () => {
      const n = this.originalEvent;
      this.isDefaultPrevented = q.returnTrue, n && !this.isSimulated && n.preventDefault();
    }, this.stopPropagation = () => {
      const n = this.originalEvent;
      this.isPropagationStopped = q.returnTrue, n && !this.isSimulated && n.stopPropagation();
    }, this.stopImmediatePropagation = () => {
      const n = this.originalEvent;
      this.isImmediatePropagationStopped = q.returnTrue, n && !this.isSimulated && n.stopImmediatePropagation(), this.stopPropagation();
    }, typeof t == "string" ? this.type = t : t.type && (this.originalEvent = t, this.type = t.type, this.isDefaultPrevented = t.defaultPrevented ? q.returnTrue : q.returnFalse, this.target = t.target, this.currentTarget = t.currentTarget, this.relatedTarget = t.relatedTarget, this.timeStamp = t.timeStamp), e && Object.assign(this, e), this.timeStamp || (this.timeStamp = Date.now());
  }
}
(function(i) {
  function t(e) {
    return e instanceof i ? e : new i(e);
  }
  i.create = t;
})(Ne || (Ne = {}));
(function(i) {
  function t(e, n) {
    Object.defineProperty(i.prototype, e, {
      enumerable: !0,
      configurable: !0,
      get: typeof n == "function" ? (
        // eslint-disable-next-line
        function() {
          if (this.originalEvent)
            return n(this.originalEvent);
        }
      ) : (
        // eslint-disable-next-line
        function() {
          if (this.originalEvent)
            return this.originalEvent[e];
        }
      ),
      set(s) {
        Object.defineProperty(this, e, {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: s
        });
      }
    });
  }
  i.addProperty = t;
})(Ne || (Ne = {}));
(function(i) {
  const t = {
    bubbles: !0,
    cancelable: !0,
    eventPhase: !0,
    detail: !0,
    view: !0,
    button: !0,
    buttons: !0,
    clientX: !0,
    clientY: !0,
    offsetX: !0,
    offsetY: !0,
    pageX: !0,
    pageY: !0,
    screenX: !0,
    screenY: !0,
    toElement: !0,
    pointerId: !0,
    pointerType: !0,
    char: !0,
    code: !0,
    charCode: !0,
    key: !0,
    keyCode: !0,
    touches: !0,
    changedTouches: !0,
    targetTouches: !0,
    which: !0,
    altKey: !0,
    ctrlKey: !0,
    metaKey: !0,
    shiftKey: !0
  };
  Object.keys(t).forEach((e) => i.addProperty(e, t[e]));
})(Ne || (Ne = {}));
(function(i) {
  ue.register("load", {
    noBubble: !0
  });
})();
(function(i) {
  ue.register("beforeunload", {
    postDispatch(t, e) {
      e.result !== void 0 && e.originalEvent && (e.originalEvent.returnValue = e.result);
    }
  });
})();
(function(i) {
  ue.register("mouseenter", {
    delegateType: "mouseover",
    bindType: "mouseover",
    handle(t, e) {
      let n;
      const s = e.relatedTarget, r = e.handleObj;
      return (!s || s !== t && !q.contains(t, s)) && (e.type = r.originType, n = r.handler.call(t, e), e.type = "mouseover"), n;
    }
  }), ue.register("mouseleave", {
    delegateType: "mouseout",
    bindType: "mouseout",
    handle(t, e) {
      let n;
      const s = e.relatedTarget, r = e.handleObj;
      return (!s || s !== t && !q.contains(t, s)) && (e.type = r.originType, n = r.handler.call(t, e), e.type = "mouseout"), n;
    }
  });
})();
var L0 = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
}, Gi;
(function(i) {
  let t;
  function e(o, a, l, c, u) {
    if (!q.isValidTarget(o))
      return;
    let h;
    if (typeof l != "function") {
      const { handler: p, selector: m } = l, y = L0(l, ["handler", "selector"]);
      l = p, u = m, h = y;
    }
    const d = pn.ensure(o);
    let f = d.handler;
    f == null && (f = d.handler = function(p, ...m) {
      return t !== p.type ? s(o, p, ...m) : void 0;
    });
    const g = q.ensureHandlerId(l);
    q.splitType(a).forEach((p) => {
      const { originType: m, namespaces: y } = q.normalizeType(p);
      if (!m)
        return;
      let v = m, b = ue.get(v);
      v = (u ? b.delegateType : b.bindType) || v, b = ue.get(v);
      const w = Object.assign({
        type: v,
        originType: m,
        data: c,
        selector: u,
        guid: g,
        handler: l,
        namespace: y.join(".")
      }, h), E = d.events;
      let S = E[v];
      S || (S = E[v] = { handlers: [], delegateCount: 0 }, (!b.setup || b.setup(o, c, y, f) === !1) && q.addEventListener(o, v, f)), b.add && (q.removeHandlerId(w.handler), b.add(o, w), q.setHandlerId(w.handler, g)), u ? (S.handlers.splice(S.delegateCount, 0, w), S.delegateCount += 1) : S.handlers.push(w);
    });
  }
  i.on = e;
  function n(o, a, l, c, u) {
    const h = pn.get(o);
    if (!h)
      return;
    const d = h.events;
    d && (q.splitType(a).forEach((f) => {
      const { originType: g, namespaces: p } = q.normalizeType(f);
      if (!g) {
        Object.keys(d).forEach((E) => {
          n(o, E + f, l, c, !0);
        });
        return;
      }
      let m = g;
      const y = ue.get(m);
      m = (c ? y.delegateType : y.bindType) || m;
      const v = d[m];
      if (!v)
        return;
      const b = p.length > 0 ? new RegExp(`(^|\\.)${p.join("\\.(?:.*\\.|)")}(\\.|$)`) : null, w = v.handlers.length;
      for (let E = v.handlers.length - 1; E >= 0; E -= 1) {
        const S = v.handlers[E];
        (u || g === S.originType) && (!l || q.getHandlerId(l) === S.guid) && (b == null || S.namespace && b.test(S.namespace)) && (c == null || c === S.selector || c === "**" && S.selector) && (v.handlers.splice(E, 1), S.selector && (v.delegateCount -= 1), y.remove && y.remove(o, S));
      }
      w && v.handlers.length === 0 && ((!y.teardown || y.teardown(o, p, h.handler) === !1) && q.removeEventListener(o, m, h.handler), delete d[m]);
    }), Object.keys(d).length === 0 && pn.remove(o));
  }
  i.off = n;
  function s(o, a, ...l) {
    const c = Ne.create(a);
    c.delegateTarget = o;
    const u = ue.get(c.type);
    if (u.preDispatch && u.preDispatch(o, c) === !1)
      return;
    const h = q.getHandlerQueue(o, c);
    for (let d = 0, f = h.length; d < f && !c.isPropagationStopped(); d += 1) {
      const g = h[d];
      c.currentTarget = g.elem;
      for (let p = 0, m = g.handlers.length; p < m && !c.isImmediatePropagationStopped(); p += 1) {
        const y = g.handlers[p];
        if (c.rnamespace == null || y.namespace && c.rnamespace.test(y.namespace)) {
          c.handleObj = y, c.data = y.data;
          const v = ue.get(y.originType).handle, b = v ? v(g.elem, c, ...l) : y.handler.call(g.elem, c, ...l);
          b !== void 0 && (c.result = b, b === !1 && (c.preventDefault(), c.stopPropagation()));
        }
      }
    }
    return u.postDispatch && u.postDispatch(o, c), c.result;
  }
  i.dispatch = s;
  function r(o, a, l, c) {
    let u = o, h = typeof o == "string" ? o : o.type, d = typeof o == "string" || u.namespace == null ? [] : u.namespace.split(".");
    const f = l;
    if (f.nodeType === 3 || f.nodeType === 8)
      return;
    h.indexOf(".") > -1 && (d = h.split("."), h = d.shift(), d.sort());
    const g = h.indexOf(":") < 0 && `on${h}`;
    u = o instanceof Ne ? o : new Ne(h, typeof o == "object" ? o : null), u.namespace = d.join("."), u.rnamespace = u.namespace ? new RegExp(`(^|\\.)${d.join("\\.(?:.*\\.|)")}(\\.|$)`) : null, u.result = void 0, u.target || (u.target = f);
    const p = [u];
    Array.isArray(a) ? p.push(...a) : p.push(a);
    const m = ue.get(h);
    if (!c && m.trigger && m.trigger(f, u, a) === !1)
      return;
    let y;
    const v = [f];
    if (!c && !m.noBubble && !q.isWindow(f)) {
      y = m.delegateType || h;
      let w = f, E = f.parentNode;
      for (; E != null; )
        v.push(E), w = E, E = E.parentNode;
      const S = f.ownerDocument || document;
      if (w === S) {
        const C = w.defaultView || w.parentWindow || window;
        v.push(C);
      }
    }
    let b = f;
    for (let w = 0, E = v.length; w < E && !u.isPropagationStopped(); w += 1) {
      const S = v[w];
      b = S, u.type = w > 1 ? y : m.bindType || h;
      const C = pn.get(S);
      C && C.events[u.type] && C.handler && C.handler.call(S, ...p);
      const P = g && S[g] || null;
      P && q.isValidTarget(S) && (u.result = P.call(S, ...p), u.result === !1 && u.preventDefault());
    }
    if (u.type = h, !c && !u.isDefaultPrevented()) {
      const w = m.preventDefault;
      if ((w == null || w(v.pop(), u, a) === !1) && q.isValidTarget(f) && g && typeof f[h] == "function" && !q.isWindow(f)) {
        const E = f[g];
        E && (f[g] = null), t = h, u.isPropagationStopped() && b.addEventListener(h, q.stopPropagationCallback), f[h](), u.isPropagationStopped() && b.removeEventListener(h, q.stopPropagationCallback), t = void 0, E && (f[g] = E);
      }
    }
    return u.result;
  }
  i.trigger = r;
})(Gi || (Gi = {}));
var Ut;
(function(i) {
  function t(r, o, a, l, c) {
    return Li.on(r, o, a, l, c), r;
  }
  i.on = t;
  function e(r, o, a, l, c) {
    return Li.on(r, o, a, l, c, !0), r;
  }
  i.once = e;
  function n(r, o, a, l) {
    return Li.off(r, o, a, l), r;
  }
  i.off = n;
  function s(r, o, a, l) {
    return Gi.trigger(o, a, r, l), r;
  }
  i.trigger = s;
})(Ut || (Ut = {}));
var Li;
(function(i) {
  function t(n, s, r, o, a, l) {
    if (typeof s == "object") {
      typeof r != "string" && (o = o || r, r = void 0), Object.keys(s).forEach((c) => t(n, c, r, o, s[c], l));
      return;
    }
    if (o == null && a == null ? (a = r, o = r = void 0) : a == null && (typeof r == "string" ? (a = o, o = void 0) : (a = o, o = r, r = void 0)), a === !1)
      a = q.returnFalse;
    else if (!a)
      return;
    if (l) {
      const c = a;
      a = function(u, ...h) {
        return i.off(n, u), c.call(this, u, ...h);
      }, q.setHandlerId(a, q.ensureHandlerId(c));
    }
    Gi.on(n, s, a, o, r);
  }
  i.on = t;
  function e(n, s, r, o) {
    const a = s;
    if (a && a.preventDefault != null && a.handleObj != null) {
      const l = a.handleObj;
      e(a.delegateTarget, l.namespace ? `${l.originType}.${l.namespace}` : l.originType, l.selector, l.handler);
      return;
    }
    if (typeof s == "object") {
      const l = s;
      Object.keys(l).forEach((c) => e(n, c, r, l[c]));
      return;
    }
    (r === !1 || typeof r == "function") && (o = r, r = void 0), o === !1 && (o = q.returnFalse), Gi.off(n, s, o, r);
  }
  i.off = e;
})(Li || (Li = {}));
class Tu {
  constructor(t, e, n) {
    this.animationFrameId = 0, this.deltaX = 0, this.deltaY = 0, this.eventName = en.isEventSupported("wheel") ? "wheel" : "mousewheel", this.target = t, this.onWheelCallback = e, this.onWheelGuard = n, this.onWheel = this.onWheel.bind(this), this.didWheel = this.didWheel.bind(this);
  }
  enable() {
    this.target.addEventListener(this.eventName, this.onWheel, {
      passive: !1
    });
  }
  disable() {
    this.target.removeEventListener(this.eventName, this.onWheel);
  }
  onWheel(t) {
    if (this.onWheelGuard != null && !this.onWheelGuard(t))
      return;
    this.deltaX += t.deltaX, this.deltaY += t.deltaY, t.preventDefault();
    let e;
    (this.deltaX !== 0 || this.deltaY !== 0) && (t.stopPropagation(), e = !0), e === !0 && this.animationFrameId === 0 && (this.animationFrameId = requestAnimationFrame(() => {
      this.didWheel(t);
    }));
  }
  didWheel(t) {
    this.animationFrameId = 0, this.onWheelCallback(t, this.deltaX, this.deltaY), this.deltaX = 0, this.deltaY = 0;
  }
}
function to(i) {
  const t = i.getBoundingClientRect(), e = i.ownerDocument.defaultView;
  return {
    top: t.top + e.pageYOffset,
    left: t.left + e.pageXOffset
  };
}
function k0(i) {
  return i.getBoundingClientRect().width;
}
function R0(i) {
  return i.getBoundingClientRect().height;
}
function Nu(i, t = 60) {
  let e = null;
  return (...n) => {
    e && clearTimeout(e), e = window.setTimeout(() => {
      i.apply(this, n);
    }, t);
  };
}
function D0(i) {
  let t = null, e = [];
  const n = () => {
    if (getComputedStyle(i).position === "static") {
      const c = i.style;
      c.position = "relative";
    }
    const l = document.createElement("object");
    return l.onload = () => {
      l.contentDocument.defaultView.addEventListener("resize", s), s();
    }, l.style.display = "block", l.style.position = "absolute", l.style.top = "0", l.style.left = "0", l.style.height = "100%", l.style.width = "100%", l.style.overflow = "hidden", l.style.pointerEvents = "none", l.style.zIndex = "-1", l.style.opacity = "0", l.setAttribute("tabindex", "-1"), l.type = "text/html", i.appendChild(l), l.data = "about:blank", l;
  }, s = Nu(() => {
    e.forEach((l) => l(i));
  }), r = (l) => {
    t || (t = n()), e.indexOf(l) === -1 && e.push(l);
  }, o = () => {
    t && t.parentNode && (t.contentDocument && t.contentDocument.defaultView.removeEventListener("resize", s), t.parentNode.removeChild(t), t = null, e = []);
  };
  return {
    element: i,
    bind: r,
    destroy: o,
    unbind: (l) => {
      const c = e.indexOf(l);
      c !== -1 && e.splice(c, 1), e.length === 0 && t && o();
    }
  };
}
function _0(i) {
  let t = null, e = [];
  const n = Nu(() => {
    e.forEach((l) => {
      l(i);
    });
  }), s = () => {
    const l = new ResizeObserver(n);
    return l.observe(i), n(), l;
  }, r = (l) => {
    t || (t = s()), e.indexOf(l) === -1 && e.push(l);
  }, o = () => {
    t && (t.disconnect(), e = [], t = null);
  };
  return {
    element: i,
    bind: r,
    destroy: o,
    unbind: (l) => {
      const c = e.indexOf(l);
      c !== -1 && e.splice(c, 1), e.length === 0 && t && o();
    }
  };
}
const $0 = typeof ResizeObserver < "u" ? _0 : D0;
var Ts;
(function(i) {
  const t = /* @__PURE__ */ new WeakMap();
  function e(s) {
    let r = t.get(s);
    return r || (r = $0(s), t.set(s, r), r);
  }
  function n(s) {
    s.destroy(), t.delete(s.element);
  }
  i.bind = (s, r) => {
    const o = e(s);
    return o.bind(r), () => o.unbind(r);
  }, i.clear = (s) => {
    const r = e(s);
    n(r);
  };
})(Ts || (Ts = {}));
let eo = class Iu {
  constructor(t = {}) {
    this.comparator = t.comparator || Iu.defaultComparator, this.index = {}, this.data = t.data || [], this.heapify();
  }
  /**
   * Returns `true` if the priority queue is empty, `false` otherwise.
   */
  isEmpty() {
    return this.data.length === 0;
  }
  /**
   * Inserts a value with priority to the queue. Optionally pass a unique
   * id of this item. Passing unique IDs for each item you insert allows
   * you to use the `updatePriority()` operation.
   * @param priority
   * @param value
   * @param id
   */
  insert(t, e, n) {
    const s = { priority: t, value: e }, r = this.data.length;
    return n && (s.id = n, this.index[n] = r), this.data.push(s), this.bubbleUp(r), this;
  }
  /**
   * Returns the value of an item with the highest priority.
   */
  peek() {
    return this.data[0] ? this.data[0].value : null;
  }
  /**
   * Returns the highest priority in the queue.
   */
  peekPriority() {
    return this.data[0] ? this.data[0].priority : null;
  }
  updatePriority(t, e) {
    const n = this.index[t];
    if (typeof n > "u")
      throw new Error(`Node with id '${t}' was not found in the heap.`);
    const s = this.data, r = s[n].priority, o = this.comparator(e, r);
    o < 0 ? (s[n].priority = e, this.bubbleUp(n)) : o > 0 && (s[n].priority = e, this.bubbleDown(n));
  }
  /**
   * Removes the item with the highest priority from the queue
   *
   * @returns The value of the removed item.
   */
  remove() {
    const t = this.data, e = t[0], n = t.pop();
    return e.id && delete this.index[e.id], t.length > 0 && (t[0] = n, n.id && (this.index[n.id] = 0), this.bubbleDown(0)), e ? e.value : null;
  }
  heapify() {
    for (let t = 0; t < this.data.length; t += 1)
      this.bubbleUp(t);
  }
  bubbleUp(t) {
    const e = this.data;
    let n, s, r = t;
    for (; r > 0 && (s = r - 1 >>> 1, this.comparator(e[r].priority, e[s].priority) < 0); ) {
      n = e[s], e[s] = e[r];
      let o = e[r].id;
      o != null && (this.index[o] = s), e[r] = n, o = e[r].id, o != null && (this.index[o] = r), r = s;
    }
  }
  bubbleDown(t) {
    const e = this.data, n = e.length - 1;
    let s = t;
    for (; ; ) {
      const r = (s << 1) + 1, o = r + 1;
      let a = s;
      if (r <= n && this.comparator(e[r].priority, e[a].priority) < 0 && (a = r), o <= n && this.comparator(e[o].priority, e[a].priority) < 0 && (a = o), a !== s) {
        const l = e[a];
        e[a] = e[s];
        let c = e[s].id;
        c != null && (this.index[c] = a), e[s] = l, c = e[s].id, c != null && (this.index[c] = s), s = a;
      } else
        break;
    }
  }
};
(function(i) {
  i.defaultComparator = (t, e) => t - e;
})(eo || (eo = {}));
var no;
(function(i) {
  function t(e, n, s = (r, o) => 1) {
    const r = {}, o = {}, a = {}, l = new eo();
    for (r[n] = 0, Object.keys(e).forEach((c) => {
      c !== n && (r[c] = 1 / 0), l.insert(r[c], c, c);
    }); !l.isEmpty(); ) {
      const c = l.remove();
      a[c] = !0;
      const u = e[c] || [];
      for (let h = 0; h < u.length; h += 1) {
        const d = u[h];
        if (!a[d]) {
          const f = r[c] + s(c, d);
          f < r[d] && (r[d] = f, o[d] = c, l.updatePriority(d, f));
        }
      }
    }
    return o;
  }
  i.run = t;
})(no || (no = {}));
class _e {
  constructor(t, e, n, s) {
    if (t == null)
      return this.set(255, 255, 255, 1);
    if (typeof t == "number")
      return this.set(t, e, n, s);
    if (typeof t == "string")
      return _e.fromString(t) || this;
    if (Array.isArray(t))
      return this.set(t);
    this.set(t.r, t.g, t.b, t.a == null ? 1 : t.a);
  }
  blend(t, e, n) {
    this.set(t.r + (e.r - t.r) * n, t.g + (e.g - t.g) * n, t.b + (e.b - t.b) * n, t.a + (e.a - t.a) * n);
  }
  lighten(t) {
    const e = _e.lighten(this.toArray(), t);
    this.r = e[0], this.g = e[1], this.b = e[2], this.a = e[3];
  }
  darken(t) {
    this.lighten(-t);
  }
  set(t, e, n, s) {
    const r = Array.isArray(t) ? t[0] : t, o = Array.isArray(t) ? t[1] : e, a = Array.isArray(t) ? t[2] : n, l = Array.isArray(t) ? t[3] : s;
    return this.r = Math.round(he(r, 0, 255)), this.g = Math.round(he(o, 0, 255)), this.b = Math.round(he(a, 0, 255)), this.a = l == null ? 1 : he(l, 0, 1), this;
  }
  toHex() {
    return `#${["r", "g", "b"].map((e) => {
      const n = this[e].toString(16);
      return n.length < 2 ? `0${n}` : n;
    }).join("")}`;
  }
  toRGBA() {
    return this.toArray();
  }
  toHSLA() {
    return _e.rgba2hsla(this.r, this.g, this.b, this.a);
  }
  toCSS(t) {
    const e = `${this.r},${this.g},${this.b},`;
    return t ? `rgb(${e})` : `rgba(${e},${this.a})`;
  }
  toGrey() {
    return _e.makeGrey(Math.round((this.r + this.g + this.b) / 3), this.a);
  }
  toArray() {
    return [this.r, this.g, this.b, this.a];
  }
  toString() {
    return this.toCSS();
  }
}
(function(i) {
  function t(b) {
    return new i(b);
  }
  i.fromArray = t;
  function e(b) {
    return new i([...g(b), 1]);
  }
  i.fromHex = e;
  function n(b) {
    const w = b.toLowerCase().match(/^rgba?\(([\s.,0-9]+)\)/);
    if (w) {
      const E = w[1].split(/\s*,\s*/).map((S) => parseInt(S, 10));
      return new i(E);
    }
    return null;
  }
  i.fromRGBA = n;
  function s(b, w, E) {
    E < 0 && ++E, E > 1 && --E;
    const S = 6 * E;
    return S < 1 ? b + (w - b) * S : 2 * E < 1 ? w : 3 * E < 2 ? b + (w - b) * (2 / 3 - E) * 6 : b;
  }
  function r(b) {
    const w = b.toLowerCase().match(/^hsla?\(([\s.,0-9]+)\)/);
    if (w) {
      const E = w[2].split(/\s*,\s*/), S = (parseFloat(E[0]) % 360 + 360) % 360 / 360, C = parseFloat(E[1]) / 100, P = parseFloat(E[2]) / 100, O = E[3] == null ? 1 : parseInt(E[3], 10);
      return new i(c(S, C, P, O));
    }
    return null;
  }
  i.fromHSLA = r;
  function o(b) {
    if (b.startsWith("#"))
      return e(b);
    if (b.startsWith("rgb"))
      return n(b);
    const w = i.named[b];
    return w ? e(w) : r(b);
  }
  i.fromString = o;
  function a(b, w) {
    return i.fromArray([b, b, b, w]);
  }
  i.makeGrey = a;
  function l(b, w, E, S) {
    const C = Array.isArray(b) ? b[0] : b, P = Array.isArray(b) ? b[1] : w, O = Array.isArray(b) ? b[2] : E, I = Array.isArray(b) ? b[3] : S, T = Math.max(C, P, O), k = Math.min(C, P, O), H = (T + k) / 2;
    let $ = 0, A = 0;
    if (k !== T) {
      const N = T - k;
      switch (A = H > 0.5 ? N / (2 - T - k) : N / (T + k), T) {
        case C:
          $ = (P - O) / N + (P < O ? 6 : 0);
          break;
        case P:
          $ = (O - C) / N + 2;
          break;
        case O:
          $ = (C - P) / N + 4;
          break;
      }
      $ /= 6;
    }
    return [$, A, H, I ?? 1];
  }
  i.rgba2hsla = l;
  function c(b, w, E, S) {
    const C = Array.isArray(b) ? b[0] : b, P = Array.isArray(b) ? b[1] : w, O = Array.isArray(b) ? b[2] : E, I = Array.isArray(b) ? b[3] : S, T = O <= 0.5 ? O * (P + 1) : O + P - O * P, k = 2 * O - T;
    return [
      s(k, T, C + 1 / 3) * 256,
      s(k, T, C) * 256,
      s(k, T, C - 1 / 3) * 256,
      I ?? 1
    ];
  }
  i.hsla2rgba = c;
  function u(b) {
    return new i(Math.round(Math.random() * 256), Math.round(Math.random() * 256), Math.round(Math.random() * 256), b ? void 0 : parseFloat(Math.random().toFixed(2)));
  }
  i.random = u;
  function h() {
    const b = "0123456789ABCDEF";
    let w = "#";
    for (let E = 0; E < 6; E += 1)
      w += b[Math.floor(Math.random() * 16)];
    return w;
  }
  i.randomHex = h;
  function d(b) {
    return u(b).toString();
  }
  i.randomRGBA = d;
  function f(b, w) {
    if (typeof b == "string") {
      const O = b[0] === "#", [I, T, k] = g(b);
      return w ? I * 0.299 + T * 0.587 + k * 0.114 > 186 ? "#000000" : "#ffffff" : `${O ? "#" : ""}${p(255 - I, 255 - T, 255 - k)}`;
    }
    const E = b[0], S = b[1], C = b[2], P = b[3];
    return w ? E * 0.299 + S * 0.587 + C * 0.114 > 186 ? [0, 0, 0, P] : [255, 255, 255, P] : [255 - E, 255 - S, 255 - C, P];
  }
  i.invert = f;
  function g(b) {
    const w = b.indexOf("#") === 0 ? b : `#${b}`;
    let E = +`0x${w.substr(1)}`;
    if (!(w.length === 4 || w.length === 7) || Number.isNaN(E))
      throw new Error("Invalid hex color.");
    const S = w.length === 4 ? 4 : 8, C = (1 << S) - 1, P = ["b", "g", "r"].map(() => {
      const O = E & C;
      return E >>= S, S === 4 ? 17 * O : O;
    });
    return [P[2], P[1], P[0]];
  }
  function p(b, w, E) {
    const S = (C) => C.length < 2 ? `0${C}` : C;
    return `${S(b.toString(16))}${S(w.toString(16))}${S(E.toString(16))}`;
  }
  function m(b, w) {
    return v(b, w);
  }
  i.lighten = m;
  function y(b, w) {
    return v(b, -w);
  }
  i.darken = y;
  function v(b, w) {
    if (typeof b == "string") {
      const C = b[0] === "#", P = parseInt(C ? b.substr(1) : b, 16), O = he((P >> 16) + w, 0, 255), I = he((P >> 8 & 255) + w, 0, 255), T = he((P & 255) + w, 0, 255);
      return `${C ? "#" : ""}${(T | I << 8 | O << 16).toString(16)}`;
    }
    const E = p(b[0], b[1], b[2]), S = g(v(E, w));
    return [S[0], S[1], S[2], b[3]];
  }
})(_e || (_e = {}));
(function(i) {
  i.named = {
    aliceblue: "#f0f8ff",
    antiquewhite: "#faebd7",
    aqua: "#00ffff",
    aquamarine: "#7fffd4",
    azure: "#f0ffff",
    beige: "#f5f5dc",
    bisque: "#ffe4c4",
    black: "#000000",
    blanchedalmond: "#ffebcd",
    blue: "#0000ff",
    blueviolet: "#8a2be2",
    brown: "#a52a2a",
    burlywood: "#deb887",
    burntsienna: "#ea7e5d",
    cadetblue: "#5f9ea0",
    chartreuse: "#7fff00",
    chocolate: "#d2691e",
    coral: "#ff7f50",
    cornflowerblue: "#6495ed",
    cornsilk: "#fff8dc",
    crimson: "#dc143c",
    cyan: "#00ffff",
    darkblue: "#00008b",
    darkcyan: "#008b8b",
    darkgoldenrod: "#b8860b",
    darkgray: "#a9a9a9",
    darkgreen: "#006400",
    darkgrey: "#a9a9a9",
    darkkhaki: "#bdb76b",
    darkmagenta: "#8b008b",
    darkolivegreen: "#556b2f",
    darkorange: "#ff8c00",
    darkorchid: "#9932cc",
    darkred: "#8b0000",
    darksalmon: "#e9967a",
    darkseagreen: "#8fbc8f",
    darkslateblue: "#483d8b",
    darkslategray: "#2f4f4f",
    darkslategrey: "#2f4f4f",
    darkturquoise: "#00ced1",
    darkviolet: "#9400d3",
    deeppink: "#ff1493",
    deepskyblue: "#00bfff",
    dimgray: "#696969",
    dimgrey: "#696969",
    dodgerblue: "#1e90ff",
    firebrick: "#b22222",
    floralwhite: "#fffaf0",
    forestgreen: "#228b22",
    fuchsia: "#ff00ff",
    gainsboro: "#dcdcdc",
    ghostwhite: "#f8f8ff",
    gold: "#ffd700",
    goldenrod: "#daa520",
    gray: "#808080",
    green: "#008000",
    greenyellow: "#adff2f",
    grey: "#808080",
    honeydew: "#f0fff0",
    hotpink: "#ff69b4",
    indianred: "#cd5c5c",
    indigo: "#4b0082",
    ivory: "#fffff0",
    khaki: "#f0e68c",
    lavender: "#e6e6fa",
    lavenderblush: "#fff0f5",
    lawngreen: "#7cfc00",
    lemonchiffon: "#fffacd",
    lightblue: "#add8e6",
    lightcoral: "#f08080",
    lightcyan: "#e0ffff",
    lightgoldenrodyellow: "#fafad2",
    lightgray: "#d3d3d3",
    lightgreen: "#90ee90",
    lightgrey: "#d3d3d3",
    lightpink: "#ffb6c1",
    lightsalmon: "#ffa07a",
    lightseagreen: "#20b2aa",
    lightskyblue: "#87cefa",
    lightslategray: "#778899",
    lightslategrey: "#778899",
    lightsteelblue: "#b0c4de",
    lightyellow: "#ffffe0",
    lime: "#00ff00",
    limegreen: "#32cd32",
    linen: "#faf0e6",
    magenta: "#ff00ff",
    maroon: "#800000",
    mediumaquamarine: "#66cdaa",
    mediumblue: "#0000cd",
    mediumorchid: "#ba55d3",
    mediumpurple: "#9370db",
    mediumseagreen: "#3cb371",
    mediumslateblue: "#7b68ee",
    mediumspringgreen: "#00fa9a",
    mediumturquoise: "#48d1cc",
    mediumvioletred: "#c71585",
    midnightblue: "#191970",
    mintcream: "#f5fffa",
    mistyrose: "#ffe4e1",
    moccasin: "#ffe4b5",
    navajowhite: "#ffdead",
    navy: "#000080",
    oldlace: "#fdf5e6",
    olive: "#808000",
    olivedrab: "#6b8e23",
    orange: "#ffa500",
    orangered: "#ff4500",
    orchid: "#da70d6",
    palegoldenrod: "#eee8aa",
    palegreen: "#98fb98",
    paleturquoise: "#afeeee",
    palevioletred: "#db7093",
    papayawhip: "#ffefd5",
    peachpuff: "#ffdab9",
    peru: "#cd853f",
    pink: "#ffc0cb",
    plum: "#dda0dd",
    powderblue: "#b0e0e6",
    purple: "#800080",
    rebeccapurple: "#663399",
    red: "#ff0000",
    rosybrown: "#bc8f8f",
    royalblue: "#4169e1",
    saddlebrown: "#8b4513",
    salmon: "#fa8072",
    sandybrown: "#f4a460",
    seagreen: "#2e8b57",
    seashell: "#fff5ee",
    sienna: "#a0522d",
    silver: "#c0c0c0",
    skyblue: "#87ceeb",
    slateblue: "#6a5acd",
    slategray: "#708090",
    slategrey: "#708090",
    snow: "#fffafa",
    springgreen: "#00ff7f",
    steelblue: "#4682b4",
    tan: "#d2b48c",
    teal: "#008080",
    thistle: "#d8bfd8",
    tomato: "#ff6347",
    turquoise: "#40e0d0",
    violet: "#ee82ee",
    wheat: "#f5deb3",
    white: "#ffffff",
    whitesmoke: "#f5f5f5",
    yellow: "#ffff00",
    yellowgreen: "#9acd32"
  };
})(_e || (_e = {}));
class io {
  constructor() {
    this.clear();
  }
  clear() {
    this.map = /* @__PURE__ */ new WeakMap(), this.arr = [];
  }
  has(t) {
    return this.map.has(t);
  }
  get(t) {
    return this.map.get(t);
  }
  set(t, e) {
    this.map.set(t, e), this.arr.push(t);
  }
  delete(t) {
    const e = this.arr.indexOf(t);
    e >= 0 && this.arr.splice(e, 1);
    const n = this.map.get(t);
    return this.map.delete(t), n;
  }
  each(t) {
    this.arr.forEach((e) => {
      const n = this.map.get(e);
      t(n, e);
    });
  }
  dispose() {
    this.clear();
  }
}
var sn;
(function(i) {
  function t(s) {
    const r = [], o = [];
    return Array.isArray(s) ? r.push(...s) : s.split("|").forEach((a) => {
      a.indexOf("&") === -1 ? r.push(a) : o.push(...a.split("&"));
    }), { or: r, and: o };
  }
  i.parse = t;
  function e(s, r) {
    if (s != null && r != null) {
      const o = t(s), a = t(r), l = o.or.sort(), c = a.or.sort(), u = o.and.sort(), h = a.and.sort(), d = (f, g) => f.length === g.length && (f.length === 0 || f.every((p, m) => p === g[m]));
      return d(l, c) && d(u, h);
    }
    return s == null && r == null;
  }
  i.equals = e;
  function n(s, r, o) {
    if (r == null || Array.isArray(r) && r.length === 0)
      return o ? s.altKey !== !0 && s.ctrlKey !== !0 && s.metaKey !== !0 && s.shiftKey !== !0 : !0;
    const { or: a, and: l } = t(r), c = (u) => {
      const h = `${u.toLowerCase()}Key`;
      return s[h] === !0;
    };
    return a.some((u) => c(u)) && l.every((u) => c(u));
  }
  i.isMatch = n;
})(sn || (sn = {}));
var Cn;
(function(i) {
  i.linear = (t) => t, i.quad = (t) => t * t, i.cubic = (t) => t * t * t, i.inout = (t) => {
    if (t <= 0)
      return 0;
    if (t >= 1)
      return 1;
    const e = t * t, n = e * t;
    return 4 * (t < 0.5 ? n : 3 * (t - e) + n - 0.75);
  }, i.exponential = (t) => Math.pow(2, 10 * (t - 1)), i.bounce = (t) => {
    for (let e = 0, n = 1; ; e += n, n /= 2)
      if (t >= (7 - 4 * e) / 11) {
        const s = (11 - 6 * e - 11 * t) / 4;
        return -s * s + n * n;
      }
  };
})(Cn || (Cn = {}));
(function(i) {
  i.decorators = {
    reverse(t) {
      return (e) => 1 - t(1 - e);
    },
    reflect(t) {
      return (e) => 0.5 * (e < 0.5 ? t(2 * e) : 2 - t(2 - 2 * e));
    },
    clamp(t, e = 0, n = 1) {
      return (s) => {
        const r = t(s);
        return r < e ? e : r > n ? n : r;
      };
    },
    back(t = 1.70158) {
      return (e) => e * e * ((t + 1) * e - t);
    },
    elastic(t = 1.5) {
      return (e) => Math.pow(2, 10 * (e - 1)) * Math.cos(20 * Math.PI * t / 3 * e);
    }
  };
})(Cn || (Cn = {}));
(function(i) {
  function t(A) {
    return -1 * Math.cos(A * (Math.PI / 2)) + 1;
  }
  i.easeInSine = t;
  function e(A) {
    return Math.sin(A * (Math.PI / 2));
  }
  i.easeOutSine = e;
  function n(A) {
    return -0.5 * (Math.cos(Math.PI * A) - 1);
  }
  i.easeInOutSine = n;
  function s(A) {
    return A * A;
  }
  i.easeInQuad = s;
  function r(A) {
    return A * (2 - A);
  }
  i.easeOutQuad = r;
  function o(A) {
    return A < 0.5 ? 2 * A * A : -1 + (4 - 2 * A) * A;
  }
  i.easeInOutQuad = o;
  function a(A) {
    return A * A * A;
  }
  i.easeInCubic = a;
  function l(A) {
    const N = A - 1;
    return N * N * N + 1;
  }
  i.easeOutCubic = l;
  function c(A) {
    return A < 0.5 ? 4 * A * A * A : (A - 1) * (2 * A - 2) * (2 * A - 2) + 1;
  }
  i.easeInOutCubic = c;
  function u(A) {
    return A * A * A * A;
  }
  i.easeInQuart = u;
  function h(A) {
    const N = A - 1;
    return 1 - N * N * N * N;
  }
  i.easeOutQuart = h;
  function d(A) {
    const N = A - 1;
    return A < 0.5 ? 8 * A * A * A * A : 1 - 8 * N * N * N * N;
  }
  i.easeInOutQuart = d;
  function f(A) {
    return A * A * A * A * A;
  }
  i.easeInQuint = f;
  function g(A) {
    const N = A - 1;
    return 1 + N * N * N * N * N;
  }
  i.easeOutQuint = g;
  function p(A) {
    const N = A - 1;
    return A < 0.5 ? 16 * A * A * A * A * A : 1 + 16 * N * N * N * N * N;
  }
  i.easeInOutQuint = p;
  function m(A) {
    return A === 0 ? 0 : Math.pow(2, 10 * (A - 1));
  }
  i.easeInExpo = m;
  function y(A) {
    return A === 1 ? 1 : -Math.pow(2, -10 * A) + 1;
  }
  i.easeOutExpo = y;
  function v(A) {
    if (A === 0 || A === 1)
      return A;
    const N = A * 2, V = N - 1;
    return N < 1 ? 0.5 * Math.pow(2, 10 * V) : 0.5 * (-Math.pow(2, -10 * V) + 2);
  }
  i.easeInOutExpo = v;
  function b(A) {
    const N = A / 1;
    return -1 * (Math.sqrt(1 - N * A) - 1);
  }
  i.easeInCirc = b;
  function w(A) {
    const N = A - 1;
    return Math.sqrt(1 - N * N);
  }
  i.easeOutCirc = w;
  function E(A) {
    const N = A * 2, V = N - 2;
    return N < 1 ? -0.5 * (Math.sqrt(1 - N * N) - 1) : 0.5 * (Math.sqrt(1 - V * V) + 1);
  }
  i.easeInOutCirc = E;
  function S(A, N = 1.70158) {
    return A * A * ((N + 1) * A - N);
  }
  i.easeInBack = S;
  function C(A, N = 1.70158) {
    const V = A / 1 - 1;
    return V * V * ((N + 1) * V + N) + 1;
  }
  i.easeOutBack = C;
  function P(A, N = 1.70158) {
    const V = A * 2, it = V - 2, Q = N * 1.525;
    return V < 1 ? 0.5 * V * V * ((Q + 1) * V - Q) : 0.5 * (it * it * ((Q + 1) * it + Q) + 2);
  }
  i.easeInOutBack = P;
  function O(A, N = 0.7) {
    if (A === 0 || A === 1)
      return A;
    const it = A / 1 - 1, Q = 1 - N, dt = Q / (2 * Math.PI) * Math.asin(1);
    return -(Math.pow(2, 10 * it) * // eslint-disable-line
    Math.sin((it - dt) * (2 * Math.PI) / Q));
  }
  i.easeInElastic = O;
  function I(A, N = 0.7) {
    const V = 1 - N, it = A * 2;
    if (A === 0 || A === 1)
      return A;
    const Q = V / (2 * Math.PI) * Math.asin(1);
    return Math.pow(2, -10 * it) * // eslint-disable-line
    Math.sin((it - Q) * (2 * Math.PI) / V) + 1;
  }
  i.easeOutElastic = I;
  function T(A, N = 0.65) {
    const V = 1 - N;
    if (A === 0 || A === 1)
      return A;
    const it = A * 2, Q = it - 1, dt = V / (2 * Math.PI) * Math.asin(1);
    return it < 1 ? -0.5 * (Math.pow(2, 10 * Q) * // eslint-disable-line
    Math.sin((Q - dt) * (2 * Math.PI) / V)) : Math.pow(2, -10 * Q) * // eslint-disable-line
    Math.sin((Q - dt) * (2 * Math.PI) / V) * 0.5 + 1;
  }
  i.easeInOutElastic = T;
  function k(A) {
    const N = A / 1;
    if (N < 1 / 2.75)
      return 7.5625 * N * N;
    if (N < 2 / 2.75) {
      const V = N - 0.5454545454545454;
      return 7.5625 * V * V + 0.75;
    }
    if (N < 2.5 / 2.75) {
      const V = N - 0.8181818181818182;
      return 7.5625 * V * V + 0.9375;
    }
    {
      const V = N - 0.9545454545454546;
      return 7.5625 * V * V + 0.984375;
    }
  }
  i.easeOutBounce = k;
  function H(A) {
    return 1 - k(1 - A);
  }
  i.easeInBounce = H;
  function $(A) {
    return A < 0.5 ? H(A * 2) * 0.5 : k(A * 2 - 1) * 0.5 + 0.5;
  }
  i.easeInOutBounce = $;
})(Cn || (Cn = {}));
var mn;
(function(i) {
  i.number = (t, e) => {
    const n = e - t;
    return (s) => t + n * s;
  }, i.object = (t, e) => {
    const n = Object.keys(t);
    return (s) => {
      const r = {};
      for (let o = n.length - 1; o !== -1; o -= 1) {
        const a = n[o];
        r[a] = t[a] + (e[a] - t[a]) * s;
      }
      return r;
    };
  }, i.unit = (t, e) => {
    const n = /(-?[0-9]*.[0-9]*)(px|em|cm|mm|in|pt|pc|%)/, s = n.exec(t), r = n.exec(e), o = r ? r[1] : "", a = s ? +s[1] : 0, l = r ? +r[1] : 0, c = o.indexOf("."), u = c > 0 ? o[1].length - c - 1 : 0, h = l - a, d = s ? s[2] : "";
    return (f) => (a + h * f).toFixed(u) + d;
  }, i.color = (t, e) => {
    const n = parseInt(t.slice(1), 16), s = parseInt(e.slice(1), 16), r = n & 255, o = (s & 255) - r, a = n & 65280, l = (s & 65280) - a, c = n & 16711680, u = (s & 16711680) - c;
    return (h) => {
      const d = r + o * h & 255, f = a + l * h & 65280, g = c + u * h & 16711680;
      return `#${(1 << 24 | d | f | g).toString(16).slice(1)}`;
    };
  };
})(mn || (mn = {}));
const ki = [];
function nr(i, t) {
  const e = ki.find((n) => n.name === i);
  if (!(e && (e.loadTimes += 1, e.loadTimes > 1)) && !en.isApplyingHMR()) {
    const n = document.createElement("style");
    n.setAttribute("type", "text/css"), n.textContent = t;
    const s = document.querySelector("head");
    s && s.insertBefore(n, s.firstChild), ki.push({
      name: i,
      loadTimes: 1,
      styleElement: n
    });
  }
}
function ir(i) {
  const t = ki.findIndex((e) => e.name === i);
  if (t > -1) {
    const e = ki[t];
    if (e.loadTimes -= 1, e.loadTimes > 0)
      return;
    let n = e.styleElement;
    n && n.parentNode && n.parentNode.removeChild(n), n = null, ki.splice(t, 1);
  }
}
var ut;
(function(i) {
  function t(n) {
    return 180 * n / Math.PI % 360;
  }
  i.toDeg = t, i.toRad = function(n, s = !1) {
    return (s ? n : n % 360) * Math.PI / 180;
  };
  function e(n) {
    return n % 360 + (n < 0 ? 360 : 0);
  }
  i.normalize = e;
})(ut || (ut = {}));
var ct;
(function(i) {
  function t(a, l = 0) {
    return Number.isInteger(a) ? a : +a.toFixed(l);
  }
  i.round = t;
  function e(a, l) {
    let c, u;
    if (l == null ? (u = a ?? 1, c = 0) : (u = l, c = a ?? 0), u < c) {
      const h = c;
      c = u, u = h;
    }
    return Math.floor(Math.random() * (u - c + 1) + c);
  }
  i.random = e;
  function n(a, l, c) {
    return Number.isNaN(a) ? NaN : Number.isNaN(l) || Number.isNaN(c) ? 0 : l < c ? a < l ? l : a > c ? c : a : a < c ? c : a > l ? l : a;
  }
  i.clamp = n;
  function s(a, l) {
    return l * Math.round(a / l);
  }
  i.snapToGrid = s;
  function r(a, l) {
    return l != null && a != null && l.x >= a.x && l.x <= a.x + a.width && l.y >= a.y && l.y <= a.y + a.height;
  }
  i.containsPoint = r;
  function o(a, l) {
    const c = a.x - l.x, u = a.y - l.y;
    return c * c + u * u;
  }
  i.squaredLength = o;
})(ct || (ct = {}));
class un {
  valueOf() {
    return this.toJSON();
  }
  toString() {
    return JSON.stringify(this.toJSON());
  }
}
class x extends un {
  constructor(t, e) {
    super(), this.x = t ?? 0, this.y = e ?? 0;
  }
  /**
   * Rounds the point to the given precision.
   */
  round(t = 0) {
    return this.x = ct.round(this.x, t), this.y = ct.round(this.y, t), this;
  }
  add(t, e) {
    const n = x.create(t, e);
    return this.x += n.x, this.y += n.y, this;
  }
  update(t, e) {
    const n = x.create(t, e);
    return this.x = n.x, this.y = n.y, this;
  }
  translate(t, e) {
    const n = x.create(t, e);
    return this.x += n.x, this.y += n.y, this;
  }
  /**
   * Rotate the point by `degree` around `center`.
   */
  rotate(t, e) {
    const n = x.rotate(this, t, e);
    return this.x = n.x, this.y = n.y, this;
  }
  /**
   * Scale point by `sx` and `sy` around the given `origin`. If origin is
   * not specified, the point is scaled around `0, 0`.
   */
  scale(t, e, n = new x()) {
    const s = x.create(n);
    return this.x = s.x + t * (this.x - s.x), this.y = s.y + e * (this.y - s.y), this;
  }
  /**
   * Chooses the point closest to this point from among `points`. If `points`
   * is an empty array, `null` is returned.
   */
  closest(t) {
    if (t.length === 1)
      return x.create(t[0]);
    let e = null, n = 1 / 0;
    return t.forEach((s) => {
      const r = this.squaredDistance(s);
      r < n && (e = s, n = r);
    }), e ? x.create(e) : null;
  }
  /**
   * Returns the distance between the point and another point `p`.
   */
  distance(t) {
    return Math.sqrt(this.squaredDistance(t));
  }
  /**
   * Returns the squared distance between the point and another point `p`.
   *
   * Useful for distance comparisons in which real distance is not necessary
   * (saves one `Math.sqrt()` operation).
   */
  squaredDistance(t) {
    const e = x.create(t), n = this.x - e.x, s = this.y - e.y;
    return n * n + s * s;
  }
  manhattanDistance(t) {
    const e = x.create(t);
    return Math.abs(e.x - this.x) + Math.abs(e.y - this.y);
  }
  /**
   * Returns the magnitude of the point vector.
   *
   * @see http://en.wikipedia.org/wiki/Magnitude_(mathematics)
   */
  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y) || 0.01;
  }
  /**
   * Returns the angle(in degrees) between vector from this point to `p` and
   * the x-axis.
   */
  theta(t = new x()) {
    const e = x.create(t), n = -(e.y - this.y), s = e.x - this.x;
    let r = Math.atan2(n, s);
    return r < 0 && (r = 2 * Math.PI + r), 180 * r / Math.PI;
  }
  /**
   * Returns the angle(in degrees) between vector from this point to `p1` and
   * the vector from this point to `p2`.
   *
   * The ordering of points `p1` and `p2` is important.
   *
   * The function returns a value between `0` and `180` when the angle (in the
   * direction from `p1` to `p2`) is clockwise, and a value between `180` and
   * `360` when the angle is counterclockwise.
   *
   * Returns `NaN` if either of the points `p1` and `p2` is equal with this point.
   */
  angleBetween(t, e) {
    if (this.equals(t) || this.equals(e))
      return NaN;
    let n = this.theta(e) - this.theta(t);
    return n < 0 && (n += 360), n;
  }
  /**
   * Returns the angle(in degrees) between the line from `(0,0)` and this point
   * and the line from `(0,0)` to `p`.
   *
   * The function returns a value between `0` and `180` when the angle (in the
   * direction from this point to `p`) is clockwise, and a value between `180`
   * and `360` when the angle is counterclockwise. Returns `NaN` if called from
   * point `(0,0)` or if `p` is `(0,0)`.
   */
  vectorAngle(t) {
    return new x(0, 0).angleBetween(this, t);
  }
  /**
   * Converts rectangular to polar coordinates.
   */
  toPolar(t) {
    return this.update(x.toPolar(this, t)), this;
  }
  /**
   * Returns the change in angle(in degrees) that is the result of moving the
   * point from its previous position to its current position.
   *
   * More specifically, this function computes the angle between the line from
   * the ref point to the previous position of this point(i.e. current position
   * `-dx`, `-dy`) and the line from the `ref` point to the current position of
   * this point.
   *
   * The function returns a positive value between `0` and `180` when the angle
   * (in the direction from previous position of this point to its current
   * position) is clockwise, and a negative value between `0` and `-180` when
   * the angle is counterclockwise.
   *
   * The function returns `0` if the previous and current positions of this
   * point are the same (i.e. both `dx` and `dy` are `0`).
   */
  changeInAngle(t, e, n = new x()) {
    return this.clone().translate(-t, -e).theta(n) - this.theta(n);
  }
  /**
   * If the point lies outside the rectangle `rect`, adjust the point so that
   * it becomes the nearest point on the boundary of `rect`.
   */
  adhereToRect(t) {
    return ct.containsPoint(t, this) || (this.x = Math.min(Math.max(this.x, t.x), t.x + t.width), this.y = Math.min(Math.max(this.y, t.y), t.y + t.height)), this;
  }
  /**
   * Returns the bearing(cardinal direction) between me and the given point.
   *
   * @see https://en.wikipedia.org/wiki/Cardinal_direction
   */
  bearing(t) {
    const e = x.create(t), n = ut.toRad(this.y), s = ut.toRad(e.y), r = this.x, o = e.x, a = ut.toRad(o - r), l = Math.sin(a) * Math.cos(s), c = Math.cos(n) * Math.sin(s) - Math.sin(n) * Math.cos(s) * Math.cos(a), u = ut.toDeg(Math.atan2(l, c)), h = ["NE", "E", "SE", "S", "SW", "W", "NW", "N"];
    let d = u - 22.5;
    return d < 0 && (d += 360), d = parseInt(d / 45, 10), h[d];
  }
  /**
   * Returns the cross product of the vector from me to `p1` and the vector
   * from me to `p2`.
   *
   * The left-hand rule is used because the coordinate system is left-handed.
   */
  cross(t, e) {
    if (t != null && e != null) {
      const n = x.create(t), s = x.create(e);
      return (s.x - this.x) * (n.y - this.y) - (s.y - this.y) * (n.x - this.x);
    }
    return NaN;
  }
  /**
   * Returns the dot product of this point with given other point.
   */
  dot(t) {
    const e = x.create(t);
    return this.x * e.x + this.y * e.y;
  }
  diff(t, e) {
    if (typeof t == "number")
      return new x(this.x - t, this.y - e);
    const n = x.create(t);
    return new x(this.x - n.x, this.y - n.y);
  }
  /**
   * Returns an interpolation between me and point `p` for a parametert in
   * the closed interval `[0, 1]`.
   */
  lerp(t, e) {
    const n = x.create(t);
    return new x((1 - e) * this.x + e * n.x, (1 - e) * this.y + e * n.y);
  }
  /**
   * Normalize the point vector, scale the line segment between `(0, 0)`
   * and the point in order for it to have the given length. If length is
   * not specified, it is considered to be `1`; in that case, a unit vector
   * is computed.
   */
  normalize(t = 1) {
    const e = t / this.magnitude();
    return this.scale(e, e);
  }
  /**
   * Moves this point along the line starting from `ref` to this point by a
   * certain `distance`.
   */
  move(t, e) {
    const n = x.create(t), s = ut.toRad(n.theta(this));
    return this.translate(Math.cos(s) * e, -Math.sin(s) * e);
  }
  /**
   * Returns a point that is the reflection of me with the center of inversion
   * in `ref` point.
   */
  reflection(t) {
    return x.create(t).move(this, this.distance(t));
  }
  snapToGrid(t, e) {
    return this.x = ct.snapToGrid(this.x, t), this.y = ct.snapToGrid(this.y, e ?? t), this;
  }
  equals(t) {
    const e = x.create(t);
    return e != null && e.x === this.x && e.y === this.y;
  }
  clone() {
    return x.clone(this);
  }
  /**
   * Returns the point as a simple JSON object. For example: `{ x: 0, y: 0 }`.
   */
  toJSON() {
    return x.toJSON(this);
  }
  serialize() {
    return `${this.x} ${this.y}`;
  }
}
(function(i) {
  function t(e) {
    return e != null && e instanceof i;
  }
  i.isPoint = t;
})(x || (x = {}));
(function(i) {
  function t(n) {
    return n != null && typeof n == "object" && typeof n.x == "number" && typeof n.y == "number";
  }
  i.isPointLike = t;
  function e(n) {
    return n != null && Array.isArray(n) && n.length === 2 && typeof n[0] == "number" && typeof n[1] == "number";
  }
  i.isPointData = e;
})(x || (x = {}));
(function(i) {
  function t(h, d) {
    return h == null || typeof h == "number" ? new i(h, d) : e(h);
  }
  i.create = t;
  function e(h) {
    return i.isPoint(h) ? new i(h.x, h.y) : Array.isArray(h) ? new i(h[0], h[1]) : new i(h.x, h.y);
  }
  i.clone = e;
  function n(h) {
    return i.isPoint(h) ? { x: h.x, y: h.y } : Array.isArray(h) ? { x: h[0], y: h[1] } : { x: h.x, y: h.y };
  }
  i.toJSON = n;
  function s(h, d, f = new i()) {
    let g = Math.abs(h * Math.cos(d)), p = Math.abs(h * Math.sin(d));
    const m = e(f), y = ut.normalize(ut.toDeg(d));
    return y < 90 ? p = -p : y < 180 ? (g = -g, p = -p) : y < 270 && (g = -g), new i(m.x + g, m.y + p);
  }
  i.fromPolar = s;
  function r(h, d = new i()) {
    const f = e(h), g = e(d), p = f.x - g.x, m = f.y - g.y;
    return new i(
      Math.sqrt(p * p + m * m),
      // r
      ut.toRad(g.theta(f))
    );
  }
  i.toPolar = r;
  function o(h, d) {
    return h === d ? !0 : h != null && d != null ? h.x === d.x && h.y === d.y : !1;
  }
  i.equals = o;
  function a(h, d) {
    if (h == null && d != null || h != null && d == null || h != null && d != null && h.length !== d.length)
      return !1;
    if (h != null && d != null) {
      for (let f = 0, g = h.length; f < g; f += 1)
        if (!o(h[f], d[f]))
          return !1;
    }
    return !0;
  }
  i.equalPoints = a;
  function l(h, d, f, g) {
    return new i(ct.random(h, d), ct.random(f, g));
  }
  i.random = l;
  function c(h, d, f) {
    const g = ut.toRad(ut.normalize(-d)), p = Math.sin(g), m = Math.cos(g);
    return u(h, m, p, f);
  }
  i.rotate = c;
  function u(h, d, f, g = new i()) {
    const p = e(h), m = e(g), y = p.x - m.x, v = p.y - m.y, b = y * d - v * f, w = v * d + y * f;
    return new i(b + m.x, w + m.y);
  }
  i.rotateEx = u;
})(x || (x = {}));
class R extends un {
  get left() {
    return this.x;
  }
  get top() {
    return this.y;
  }
  get right() {
    return this.x + this.width;
  }
  get bottom() {
    return this.y + this.height;
  }
  get origin() {
    return new x(this.x, this.y);
  }
  get topLeft() {
    return new x(this.x, this.y);
  }
  get topCenter() {
    return new x(this.x + this.width / 2, this.y);
  }
  get topRight() {
    return new x(this.x + this.width, this.y);
  }
  get center() {
    return new x(this.x + this.width / 2, this.y + this.height / 2);
  }
  get bottomLeft() {
    return new x(this.x, this.y + this.height);
  }
  get bottomCenter() {
    return new x(this.x + this.width / 2, this.y + this.height);
  }
  get bottomRight() {
    return new x(this.x + this.width, this.y + this.height);
  }
  get corner() {
    return new x(this.x + this.width, this.y + this.height);
  }
  get rightMiddle() {
    return new x(this.x + this.width, this.y + this.height / 2);
  }
  get leftMiddle() {
    return new x(this.x, this.y + this.height / 2);
  }
  get topLine() {
    return new D(this.topLeft, this.topRight);
  }
  get rightLine() {
    return new D(this.topRight, this.bottomRight);
  }
  get bottomLine() {
    return new D(this.bottomLeft, this.bottomRight);
  }
  get leftLine() {
    return new D(this.topLeft, this.bottomLeft);
  }
  constructor(t, e, n, s) {
    super(), this.x = t ?? 0, this.y = e ?? 0, this.width = n ?? 0, this.height = s ?? 0;
  }
  getOrigin() {
    return this.origin;
  }
  getTopLeft() {
    return this.topLeft;
  }
  getTopCenter() {
    return this.topCenter;
  }
  getTopRight() {
    return this.topRight;
  }
  getCenter() {
    return this.center;
  }
  getCenterX() {
    return this.x + this.width / 2;
  }
  getCenterY() {
    return this.y + this.height / 2;
  }
  getBottomLeft() {
    return this.bottomLeft;
  }
  getBottomCenter() {
    return this.bottomCenter;
  }
  getBottomRight() {
    return this.bottomRight;
  }
  getCorner() {
    return this.corner;
  }
  getRightMiddle() {
    return this.rightMiddle;
  }
  getLeftMiddle() {
    return this.leftMiddle;
  }
  getTopLine() {
    return this.topLine;
  }
  getRightLine() {
    return this.rightLine;
  }
  getBottomLine() {
    return this.bottomLine;
  }
  getLeftLine() {
    return this.leftLine;
  }
  /**
   * Returns a rectangle that is the bounding box of the rectangle.
   *
   * If `angle` is specified, the bounding box calculation will take into
   * account the rotation of the rectangle by angle degrees around its center.
   */
  bbox(t) {
    if (!t)
      return this.clone();
    const e = ut.toRad(t), n = Math.abs(Math.sin(e)), s = Math.abs(Math.cos(e)), r = this.width * s + this.height * n, o = this.width * n + this.height * s;
    return new R(this.x + (this.width - r) / 2, this.y + (this.height - o) / 2, r, o);
  }
  round(t = 0) {
    return this.x = ct.round(this.x, t), this.y = ct.round(this.y, t), this.width = ct.round(this.width, t), this.height = ct.round(this.height, t), this;
  }
  add(t, e, n, s) {
    const r = R.create(t, e, n, s), o = Math.min(this.x, r.x), a = Math.min(this.y, r.y), l = Math.max(this.x + this.width, r.x + r.width), c = Math.max(this.y + this.height, r.y + r.height);
    return this.x = o, this.y = a, this.width = l - o, this.height = c - a, this;
  }
  update(t, e, n, s) {
    const r = R.create(t, e, n, s);
    return this.x = r.x, this.y = r.y, this.width = r.width, this.height = r.height, this;
  }
  inflate(t, e) {
    const n = t, s = e ?? t;
    return this.x -= n, this.y -= s, this.width += 2 * n, this.height += 2 * s, this;
  }
  snapToGrid(t, e) {
    const n = this.origin.snapToGrid(t, e), s = this.corner.snapToGrid(t, e);
    return this.x = n.x, this.y = n.y, this.width = s.x - n.x, this.height = s.y - n.y, this;
  }
  translate(t, e) {
    const n = x.create(t, e);
    return this.x += n.x, this.y += n.y, this;
  }
  scale(t, e, n = new x()) {
    const s = this.origin.scale(t, e, n);
    return this.x = s.x, this.y = s.y, this.width *= t, this.height *= e, this;
  }
  rotate(t, e = this.getCenter()) {
    if (t !== 0) {
      const n = ut.toRad(t), s = Math.cos(n), r = Math.sin(n);
      let o = this.getOrigin(), a = this.getTopRight(), l = this.getBottomRight(), c = this.getBottomLeft();
      o = x.rotateEx(o, s, r, e), a = x.rotateEx(a, s, r, e), l = x.rotateEx(l, s, r, e), c = x.rotateEx(c, s, r, e);
      const u = new R(o.x, o.y, 0, 0);
      u.add(a.x, a.y, 0, 0), u.add(l.x, l.y, 0, 0), u.add(c.x, c.y, 0, 0), this.update(u);
    }
    return this;
  }
  rotate90() {
    const t = (this.width - this.height) / 2;
    this.x += t, this.y -= t;
    const e = this.width;
    return this.width = this.height, this.height = e, this;
  }
  /**
   * Translates the rectangle by `rect.x` and `rect.y` and expand it by
   * `rect.width` and `rect.height`.
   */
  moveAndExpand(t) {
    const e = R.clone(t);
    return this.x += e.x || 0, this.y += e.y || 0, this.width += e.width || 0, this.height += e.height || 0, this;
  }
  /**
   * Returns an object where `sx` and `sy` give the maximum scaling that can be
   * applied to the rectangle so that it would still fit into `limit`. If
   * `origin` is specified, the rectangle is scaled around it; otherwise, it is
   * scaled around its center.
   */
  getMaxScaleToFit(t, e = this.center) {
    const n = R.clone(t), s = e.x, r = e.y;
    let o = 1 / 0, a = 1 / 0, l = 1 / 0, c = 1 / 0, u = 1 / 0, h = 1 / 0, d = 1 / 0, f = 1 / 0;
    const g = n.topLeft;
    g.x < s && (o = (this.x - s) / (g.x - s)), g.y < r && (u = (this.y - r) / (g.y - r));
    const p = n.bottomRight;
    p.x > s && (a = (this.x + this.width - s) / (p.x - s)), p.y > r && (h = (this.y + this.height - r) / (p.y - r));
    const m = n.topRight;
    m.x > s && (l = (this.x + this.width - s) / (m.x - s)), m.y < r && (d = (this.y - r) / (m.y - r));
    const y = n.bottomLeft;
    return y.x < s && (c = (this.x - s) / (y.x - s)), y.y > r && (f = (this.y + this.height - r) / (y.y - r)), {
      sx: Math.min(o, a, l, c),
      sy: Math.min(u, h, d, f)
    };
  }
  /**
   * Returns a number that specifies the maximum scaling that can be applied to
   * the rectangle along both axes so that it would still fit into `limit`. If
   * `origin` is specified, the rectangle is scaled around it; otherwise, it is
   * scaled around its center.
   */
  getMaxUniformScaleToFit(t, e = this.center) {
    const n = this.getMaxScaleToFit(t, e);
    return Math.min(n.sx, n.sy);
  }
  containsPoint(t, e) {
    return ct.containsPoint(this, x.create(t, e));
  }
  containsRect(t, e, n, s) {
    const r = R.create(t, e, n, s), o = this.x, a = this.y, l = this.width, c = this.height, u = r.x, h = r.y, d = r.width, f = r.height;
    return l === 0 || c === 0 || d === 0 || f === 0 ? !1 : u >= o && h >= a && u + d <= o + l && h + f <= a + c;
  }
  /**
   * Returns an array of the intersection points of the rectangle and the line.
   * Return `null` if no intersection exists.
   */
  intersectsWithLine(t) {
    const e = [
      this.topLine,
      this.rightLine,
      this.bottomLine,
      this.leftLine
    ], n = [], s = [];
    return e.forEach((r) => {
      const o = t.intersectsWithLine(r);
      o !== null && s.indexOf(o.toString()) < 0 && (n.push(o), s.push(o.toString()));
    }), n.length > 0 ? n : null;
  }
  /**
   * Returns the point on the boundary of the rectangle that is the intersection
   * of the rectangle with a line starting in the center the rectangle ending in
   * the point `p`.
   *
   * If `angle` is specified, the intersection will take into account the
   * rotation of the rectangle by `angle` degrees around its center.
   */
  intersectsWithLineFromCenterToPoint(t, e) {
    const n = x.clone(t), s = this.center;
    let r = null;
    e != null && e !== 0 && n.rotate(e, s);
    const o = [this.topLine, this.rightLine, this.bottomLine, this.leftLine], a = new D(s, n);
    for (let l = o.length - 1; l >= 0; l -= 1) {
      const c = o[l].intersectsWithLine(a);
      if (c !== null) {
        r = c;
        break;
      }
    }
    return r && e != null && e !== 0 && r.rotate(-e, s), r;
  }
  intersectsWithRect(t, e, n, s) {
    const r = R.create(t, e, n, s);
    if (!this.isIntersectWithRect(r))
      return null;
    const o = this.origin, a = this.corner, l = r.origin, c = r.corner, u = Math.max(o.x, l.x), h = Math.max(o.y, l.y);
    return new R(u, h, Math.min(a.x, c.x) - u, Math.min(a.y, c.y) - h);
  }
  isIntersectWithRect(t, e, n, s) {
    const r = R.create(t, e, n, s), o = this.origin, a = this.corner, l = r.origin, c = r.corner;
    return !(c.x <= o.x || c.y <= o.y || l.x >= a.x || l.y >= a.y);
  }
  /**
   * Normalize the rectangle, i.e. make it so that it has non-negative
   * width and height. If width is less than `0`, the function swaps left and
   * right corners and if height is less than `0`, the top and bottom corners
   * are swapped.
   */
  normalize() {
    let t = this.x, e = this.y, n = this.width, s = this.height;
    return this.width < 0 && (t = this.x + this.width, n = -this.width), this.height < 0 && (e = this.y + this.height, s = -this.height), this.x = t, this.y = e, this.width = n, this.height = s, this;
  }
  /**
   * Returns a rectangle that is a union of this rectangle and rectangle `rect`.
   */
  union(t) {
    const e = R.clone(t), n = this.origin, s = this.corner, r = e.origin, o = e.corner, a = Math.min(n.x, r.x), l = Math.min(n.y, r.y), c = Math.max(s.x, o.x), u = Math.max(s.y, o.y);
    return new R(a, l, c - a, u - l);
  }
  /**
   * Returns a string ("top", "left", "right" or "bottom") denoting the side of
   * the rectangle which is nearest to the point `p`.
   */
  getNearestSideToPoint(t) {
    const e = x.clone(t), n = e.x - this.x, s = this.x + this.width - e.x, r = e.y - this.y, o = this.y + this.height - e.y;
    let a = n, l = "left";
    return s < a && (a = s, l = "right"), r < a && (a = r, l = "top"), o < a && (l = "bottom"), l;
  }
  /**
   * Returns a point on the boundary of the rectangle nearest to the point `p`.
   */
  getNearestPointToPoint(t) {
    const e = x.clone(t);
    if (this.containsPoint(e)) {
      const n = this.getNearestSideToPoint(e);
      if (n === "left")
        return new x(this.x, e.y);
      if (n === "top")
        return new x(e.x, this.y);
      if (n === "right")
        return new x(this.x + this.width, e.y);
      if (n === "bottom")
        return new x(e.x, this.y + this.height);
    }
    return e.adhereToRect(this);
  }
  equals(t) {
    return t != null && t.x === this.x && t.y === this.y && t.width === this.width && t.height === this.height;
  }
  clone() {
    return new R(this.x, this.y, this.width, this.height);
  }
  toJSON() {
    return { x: this.x, y: this.y, width: this.width, height: this.height };
  }
  serialize() {
    return `${this.x} ${this.y} ${this.width} ${this.height}`;
  }
}
(function(i) {
  function t(e) {
    return e != null && e instanceof i;
  }
  i.isRectangle = t;
})(R || (R = {}));
(function(i) {
  function t(e) {
    return e != null && typeof e == "object" && typeof e.x == "number" && typeof e.y == "number" && typeof e.width == "number" && typeof e.height == "number";
  }
  i.isRectangleLike = t;
})(R || (R = {}));
(function(i) {
  function t(o, a, l, c) {
    return o == null || typeof o == "number" ? new i(o, a, l, c) : e(o);
  }
  i.create = t;
  function e(o) {
    return i.isRectangle(o) ? o.clone() : Array.isArray(o) ? new i(o[0], o[1], o[2], o[3]) : new i(o.x, o.y, o.width, o.height);
  }
  i.clone = e;
  function n(o) {
    return new i(o.x - o.a, o.y - o.b, 2 * o.a, 2 * o.b);
  }
  i.fromEllipse = n;
  function s(o) {
    return new i(0, 0, o.width, o.height);
  }
  i.fromSize = s;
  function r(o, a) {
    return new i(o.x, o.y, a.width, a.height);
  }
  i.fromPositionAndSize = r;
})(R || (R = {}));
class D extends un {
  get center() {
    return new x((this.start.x + this.end.x) / 2, (this.start.y + this.end.y) / 2);
  }
  constructor(t, e, n, s) {
    super(), typeof t == "number" && typeof e == "number" ? (this.start = new x(t, e), this.end = new x(n, s)) : (this.start = x.create(t), this.end = x.create(e));
  }
  getCenter() {
    return this.center;
  }
  /**
   * Rounds the line to the given `precision`.
   */
  round(t = 0) {
    return this.start.round(t), this.end.round(t), this;
  }
  translate(t, e) {
    return typeof t == "number" ? (this.start.translate(t, e), this.end.translate(t, e)) : (this.start.translate(t), this.end.translate(t)), this;
  }
  /**
   * Rotate the line by `angle` around `origin`.
   */
  rotate(t, e) {
    return this.start.rotate(t, e), this.end.rotate(t, e), this;
  }
  /**
   * Scale the line by `sx` and `sy` about the given `origin`. If origin is not
   * specified, the line is scaled around `0,0`.
   */
  scale(t, e, n) {
    return this.start.scale(t, e, n), this.end.scale(t, e, n), this;
  }
  /**
   * Returns the length of the line.
   */
  length() {
    return Math.sqrt(this.squaredLength());
  }
  /**
   * Useful for distance comparisons in which real length is not necessary
   * (saves one `Math.sqrt()` operation).
   */
  squaredLength() {
    const t = this.start.x - this.end.x, e = this.start.y - this.end.y;
    return t * t + e * e;
  }
  /**
   * Scale the line so that it has the requested length. The start point of
   * the line is preserved.
   */
  setLength(t) {
    const e = this.length();
    if (!e)
      return this;
    const n = t / e;
    return this.scale(n, n, this.start);
  }
  parallel(t) {
    const e = this.clone();
    if (!e.isDifferentiable())
      return e;
    const { start: n, end: s } = e, r = n.clone().rotate(270, s), o = s.clone().rotate(90, n);
    return n.move(o, t), s.move(r, t), e;
  }
  /**
   * Returns the vector of the line with length equal to length of the line.
   */
  vector() {
    return new x(this.end.x - this.start.x, this.end.y - this.start.y);
  }
  /**
   * Returns the angle of incline of the line.
   *
   * The function returns `NaN` if the start and end endpoints of the line
   * both lie at the same coordinates(it is impossible to determine the angle
   * of incline of a line that appears to be a point). The
   * `line.isDifferentiable()` function may be used in advance to determine
   * whether the angle of incline can be computed for a given line.
   */
  angle() {
    const t = new x(this.start.x + 1, this.start.y);
    return this.start.angleBetween(this.end, t);
  }
  /**
   * Returns a rectangle that is the bounding box of the line.
   */
  bbox() {
    const t = Math.min(this.start.x, this.end.x), e = Math.min(this.start.y, this.end.y), n = Math.max(this.start.x, this.end.x), s = Math.max(this.start.y, this.end.y);
    return new R(t, e, n - t, s - e);
  }
  /**
   * Returns the bearing (cardinal direction) of the line.
   *
   * The return value is one of the following strings:
   * 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW' and 'N'.
   *
   * The function returns 'N' if the two endpoints of the line are coincident.
   */
  bearing() {
    return this.start.bearing(this.end);
  }
  /**
   * Returns the point on the line that lies closest to point `p`.
   */
  closestPoint(t) {
    return this.pointAt(this.closestPointNormalizedLength(t));
  }
  /**
   * Returns the length of the line up to the point that lies closest to point `p`.
   */
  closestPointLength(t) {
    return this.closestPointNormalizedLength(t) * this.length();
  }
  /**
   * Returns a line that is tangent to the line at the point that lies closest
   * to point `p`.
   */
  closestPointTangent(t) {
    return this.tangentAt(this.closestPointNormalizedLength(t));
  }
  /**
   * Returns the normalized length (distance from the start of the line / total
   * line length) of the line up to the point that lies closest to point.
   */
  closestPointNormalizedLength(t) {
    const e = this.vector().dot(new D(this.start, t).vector()), n = Math.min(1, Math.max(0, e / this.squaredLength()));
    return Number.isNaN(n) ? 0 : n;
  }
  /**
   * Returns a point on the line that lies `rate` (normalized length) away from
   * the beginning of the line.
   */
  pointAt(t) {
    const e = this.start, n = this.end;
    return t <= 0 ? e.clone() : t >= 1 ? n.clone() : e.lerp(n, t);
  }
  /**
   * Returns a point on the line that lies length away from the beginning of
   * the line.
   */
  pointAtLength(t) {
    const e = this.start, n = this.end;
    let s = !0;
    t < 0 && (s = !1, t = -t);
    const r = this.length();
    if (t >= r)
      return s ? n.clone() : e.clone();
    const o = (s ? t : r - t) / r;
    return this.pointAt(o);
  }
  /**
   * Divides the line into two lines at the point that lies `rate` (normalized
   * length) away from the beginning of the line.
   */
  divideAt(t) {
    const e = this.pointAt(t);
    return [
      new D(this.start, e),
      new D(e, this.end)
    ];
  }
  /**
   * Divides the line into two lines at the point that lies length away from
   * the beginning of the line.
   */
  divideAtLength(t) {
    const e = this.pointAtLength(t);
    return [
      new D(this.start, e),
      new D(e, this.end)
    ];
  }
  /**
   * Returns `true` if the point `p` lies on the line. Return `false` otherwise.
   */
  containsPoint(t) {
    const e = this.start, n = this.end;
    if (e.cross(t, n) !== 0)
      return !1;
    const s = this.length();
    return !(new D(e, t).length() > s || new D(t, n).length() > s);
  }
  intersect(t, e) {
    const n = t.intersectsWithLine(this, e);
    return n ? Array.isArray(n) ? n : [n] : null;
  }
  /**
   * Returns the intersection point of the line with another line. Returns
   * `null` if no intersection exists.
   */
  intersectsWithLine(t) {
    const e = new x(this.end.x - this.start.x, this.end.y - this.start.y), n = new x(t.end.x - t.start.x, t.end.y - t.start.y), s = e.x * n.y - e.y * n.x, r = new x(t.start.x - this.start.x, t.start.y - this.start.y), o = r.x * n.y - r.y * n.x, a = r.x * e.y - r.y * e.x;
    if (s === 0 || o * s < 0 || a * s < 0)
      return null;
    if (s > 0) {
      if (o > s || a > s)
        return null;
    } else if (o < s || a < s)
      return null;
    return new x(this.start.x + o * e.x / s, this.start.y + o * e.y / s);
  }
  /**
   * Returns `true` if a tangent line can be found for the line.
   *
   * Tangents cannot be found if both of the line endpoints are coincident
   * (the line appears to be a point).
   */
  isDifferentiable() {
    return !this.start.equals(this.end);
  }
  /**
   * Returns the perpendicular distance between the line and point. The
   * distance is positive if the point lies to the right of the line, negative
   * if the point lies to the left of the line, and `0` if the point lies on
   * the line.
   */
  pointOffset(t) {
    const e = x.clone(t), n = this.start, s = this.end;
    return ((s.x - n.x) * (e.y - n.y) - (s.y - n.y) * (e.x - n.x)) / this.length();
  }
  pointSquaredDistance(t, e) {
    const n = x.create(t, e);
    return this.closestPoint(n).squaredDistance(n);
  }
  pointDistance(t, e) {
    const n = x.create(t, e);
    return this.closestPoint(n).distance(n);
  }
  /**
   * Returns a line tangent to the line at point that lies `rate` (normalized
   * length) away from the beginning of the line.
   */
  tangentAt(t) {
    if (!this.isDifferentiable())
      return null;
    const e = this.start, n = this.end, s = this.pointAt(t), r = new D(e, n);
    return r.translate(s.x - e.x, s.y - e.y), r;
  }
  /**
   * Returns a line tangent to the line at point that lies `length` away from
   * the beginning of the line.
   */
  tangentAtLength(t) {
    if (!this.isDifferentiable())
      return null;
    const e = this.start, n = this.end, s = this.pointAtLength(t), r = new D(e, n);
    return r.translate(s.x - e.x, s.y - e.y), r;
  }
  relativeCcw(t, e) {
    const n = x.create(t, e);
    let s = n.x - this.start.x, r = n.y - this.start.y;
    const o = this.end.x - this.start.x, a = this.end.y - this.start.y;
    let l = s * a - r * o;
    return l === 0 && (l = s * o + r * a, l > 0 && (s -= o, r -= a, l = s * o + r * a, l < 0 && (l = 0))), l < 0 ? -1 : l > 0 ? 1 : 0;
  }
  /**
   * Return `true` if the line equals the other line.
   */
  equals(t) {
    return t != null && this.start.x === t.start.x && this.start.y === t.start.y && this.end.x === t.end.x && this.end.y === t.end.y;
  }
  /**
   * Returns another line which is a clone of the line.
   */
  clone() {
    return new D(this.start, this.end);
  }
  toJSON() {
    return { start: this.start.toJSON(), end: this.end.toJSON() };
  }
  serialize() {
    return [this.start.serialize(), this.end.serialize()].join(" ");
  }
}
(function(i) {
  function t(e) {
    return e != null && e instanceof i;
  }
  i.isLine = t;
})(D || (D = {}));
class xe extends un {
  get center() {
    return new x(this.x, this.y);
  }
  constructor(t, e, n, s) {
    super(), this.x = t ?? 0, this.y = e ?? 0, this.a = n ?? 0, this.b = s ?? 0;
  }
  /**
   * Returns a rectangle that is the bounding box of the ellipse.
   */
  bbox() {
    return R.fromEllipse(this);
  }
  /**
   * Returns a point that is the center of the ellipse.
   */
  getCenter() {
    return this.center;
  }
  inflate(t, e) {
    const n = t, s = e ?? t;
    return this.a += 2 * n, this.b += 2 * s, this;
  }
  normalizedDistance(t, e) {
    const n = x.create(t, e), s = n.x - this.x, r = n.y - this.y, o = this.a, a = this.b;
    return s * s / (o * o) + r * r / (a * a);
  }
  containsPoint(t, e) {
    return this.normalizedDistance(t, e) <= 1;
  }
  /**
   * Returns an array of the intersection points of the ellipse and the line.
   * Returns `null` if no intersection exists.
   */
  intersectsWithLine(t) {
    const e = [], n = this.a, s = this.b, r = t.start, o = t.end, a = t.vector(), l = r.diff(new x(this.x, this.y)), c = new x(a.x / (n * n), a.y / (s * s)), u = new x(l.x / (n * n), l.y / (s * s)), h = a.dot(c), d = a.dot(u), f = l.dot(u) - 1, g = d * d - h * f;
    if (g < 0)
      return null;
    if (g > 0) {
      const p = Math.sqrt(g), m = (-d - p) / h, y = (-d + p) / h;
      if ((m < 0 || m > 1) && (y < 0 || y > 1))
        return null;
      m >= 0 && m <= 1 && e.push(r.lerp(o, m)), y >= 0 && y <= 1 && e.push(r.lerp(o, y));
    } else {
      const p = -d / h;
      if (p >= 0 && p <= 1)
        e.push(r.lerp(o, p));
      else
        return null;
    }
    return e;
  }
  /**
   * Returns the point on the boundary of the ellipse that is the
   * intersection of the ellipse with a line starting in the center
   * of the ellipse ending in the point `p`.
   *
   * If angle is specified, the intersection will take into account
   * the rotation of the ellipse by angle degrees around its center.
   */
  intersectsWithLineFromCenterToPoint(t, e = 0) {
    const n = x.clone(t);
    e && n.rotate(e, this.getCenter());
    const s = n.x - this.x, r = n.y - this.y;
    let o;
    if (s === 0)
      return o = this.bbox().getNearestPointToPoint(n), e ? o.rotate(-e, this.getCenter()) : o;
    const a = r / s, l = a * a, c = this.a * this.a, u = this.b * this.b;
    let h = Math.sqrt(1 / (1 / c + l / u));
    h = s < 0 ? -h : h;
    const d = a * h;
    return o = new x(this.x + h, this.y + d), e ? o.rotate(-e, this.getCenter()) : o;
  }
  /**
   * Returns the angle between the x-axis and the tangent from a point. It is
   * valid for points lying on the ellipse boundary only.
   */
  tangentTheta(t) {
    const e = x.clone(t), n = e.x, s = e.y, r = this.a, o = this.b, a = this.bbox().center, l = a.x, c = a.y, u = 30, h = n > a.x + r / 2, d = n < a.x - r / 2;
    let f, g;
    return h || d ? (g = n > a.x ? s - u : s + u, f = r * r / (n - l) - r * r * (s - c) * (g - c) / (o * o * (n - l)) + l) : (f = s > a.y ? n + u : n - u, g = o * o / (s - c) - o * o * (n - l) * (f - l) / (r * r * (s - c)) + c), new x(f, g).theta(e);
  }
  scale(t, e) {
    return this.a *= t, this.b *= e, this;
  }
  rotate(t, e) {
    const n = R.fromEllipse(this);
    n.rotate(t, e);
    const s = xe.fromRect(n);
    return this.a = s.a, this.b = s.b, this.x = s.x, this.y = s.y, this;
  }
  translate(t, e) {
    const n = x.create(t, e);
    return this.x += n.x, this.y += n.y, this;
  }
  equals(t) {
    return t != null && t.x === this.x && t.y === this.y && t.a === this.a && t.b === this.b;
  }
  clone() {
    return new xe(this.x, this.y, this.a, this.b);
  }
  toJSON() {
    return { x: this.x, y: this.y, a: this.a, b: this.b };
  }
  serialize() {
    return `${this.x} ${this.y} ${this.a} ${this.b}`;
  }
}
(function(i) {
  function t(e) {
    return e != null && e instanceof i;
  }
  i.isEllipse = t;
})(xe || (xe = {}));
(function(i) {
  function t(s, r, o, a) {
    return s == null || typeof s == "number" ? new i(s, r, o, a) : e(s);
  }
  i.create = t;
  function e(s) {
    return i.isEllipse(s) ? s.clone() : Array.isArray(s) ? new i(s[0], s[1], s[2], s[3]) : new i(s.x, s.y, s.a, s.b);
  }
  i.parse = e;
  function n(s) {
    const r = s.center;
    return new i(r.x, r.y, s.width / 2, s.height / 2);
  }
  i.fromRect = n;
})(xe || (xe = {}));
const B0 = new RegExp("^[\\s\\dLMCZz,.]*$");
function z0(i) {
  return typeof i != "string" ? !1 : B0.test(i);
}
function Sr(i, t) {
  return (i % t + t) % t;
}
function V0(i, t, e, n, s) {
  const r = [], o = i[i.length - 1], a = t != null && t > 0, l = t || 0;
  if (n && a) {
    i = i.slice();
    const h = i[0], d = new x(o.x + (h.x - o.x) / 2, o.y + (h.y - o.y) / 2);
    i.splice(0, 0, d);
  }
  let c = i[0], u = 1;
  for (e ? r.push("M", c.x, c.y) : r.push("L", c.x, c.y); u < (n ? i.length : i.length - 1); ) {
    let h = i[Sr(u, i.length)], d = c.x - h.x, f = c.y - h.y;
    if (a && (d !== 0 || f !== 0) && (s == null || s.indexOf(u - 1) < 0)) {
      let g = Math.sqrt(d * d + f * f);
      const p = d * Math.min(l, g / 2) / g, m = f * Math.min(l, g / 2) / g, y = h.x + p, v = h.y + m;
      r.push("L", y, v);
      let b = i[Sr(u + 1, i.length)];
      for (; u < i.length - 2 && Math.round(b.x - h.x) === 0 && Math.round(b.y - h.y) === 0; )
        b = i[Sr(u + 2, i.length)], u += 1;
      d = b.x - h.x, f = b.y - h.y, g = Math.max(1, Math.sqrt(d * d + f * f));
      const w = d * Math.min(l, g / 2) / g, E = f * Math.min(l, g / 2) / g, S = h.x + w, C = h.y + E;
      r.push("Q", h.x, h.y, S, C), h = new x(S, C);
    } else
      r.push("L", h.x, h.y);
    c = h, u += 1;
  }
  return n ? r.push("Z") : r.push("L", o.x, o.y), r.map((h) => typeof h == "string" ? h : +h.toFixed(3)).join(" ");
}
function ju(i, t = {}) {
  const e = [];
  return i && i.length && i.forEach((n) => {
    Array.isArray(n) ? e.push({ x: n[0], y: n[1] }) : e.push({ x: n.x, y: n.y });
  }), V0(e, t.round, t.initialMove == null || t.initialMove, t.close, t.exclude);
}
function Ns(i, t, e, n, s = 0, r = 0, o = 0, a, l) {
  if (e === 0 || n === 0)
    return [];
  a -= i, l -= t, e = Math.abs(e), n = Math.abs(n);
  const c = -a / 2, u = -l / 2, h = Math.cos(s * Math.PI / 180), d = Math.sin(s * Math.PI / 180), f = h * c + d * u, g = -1 * d * c + h * u, p = f * f, m = g * g, y = e * e, v = n * n, b = p / y + m / v;
  let w;
  if (b > 1)
    e = Math.sqrt(b) * e, n = Math.sqrt(b) * n, w = 0;
  else {
    let Y = 1;
    r === o && (Y = -1), w = Y * Math.sqrt((y * v - y * m - v * p) / (y * m + v * p));
  }
  const E = w * e * g / n, S = -1 * w * n * f / e, C = h * E - d * S + a / 2, P = d * E + h * S + l / 2;
  let O = Math.atan2((g - S) / n, (f - E) / e) - Math.atan2(0, 1), I = O >= 0 ? O : 2 * Math.PI + O;
  O = Math.atan2((-g - S) / n, (-f - E) / e) - Math.atan2((g - S) / n, (f - E) / e);
  let T = O >= 0 ? O : 2 * Math.PI + O;
  o === 0 && T > 0 ? T -= 2 * Math.PI : o !== 0 && T < 0 && (T += 2 * Math.PI);
  const k = T * 2 / Math.PI, H = Math.ceil(k < 0 ? -1 * k : k), $ = T / H, A = 8 / 3 * Math.sin($ / 4) * Math.sin($ / 4) / Math.sin($ / 2), N = h * e, V = h * n, it = d * e, Q = d * n;
  let dt = Math.cos(I), _ = Math.sin(I), Z = -A * (N * _ + Q * dt), tt = -A * (it * _ - V * dt), W = 0, st = 0;
  const Pt = [];
  for (let Y = 0; Y < H; Y += 1) {
    I += $, dt = Math.cos(I), _ = Math.sin(I), W = N * dt - Q * _ + C, st = it * dt + V * _ + P;
    const Ot = -A * (N * _ + Q * dt), Qt = -A * (it * _ - V * dt), Gt = Y * 6;
    Pt[Gt] = Number(Z + i), Pt[Gt + 1] = Number(tt + t), Pt[Gt + 2] = Number(W - Ot + i), Pt[Gt + 3] = Number(st - Qt + t), Pt[Gt + 4] = Number(W + i), Pt[Gt + 5] = Number(st + t), Z = W + Ot, tt = st + Qt;
  }
  return Pt.map((Y) => +Y.toFixed(2));
}
function F0(i, t, e, n, s = 0, r = 0, o = 0, a, l) {
  const c = [], u = Ns(i, t, e, n, s, r, o, a, l);
  if (u != null)
    for (let h = 0, d = u.length; h < d; h += 6)
      c.push("C", u[h], u[h + 1], u[h + 2], u[h + 3], u[h + 4], u[h + 5]);
  return c.join(" ");
}
class Mt extends un {
  get start() {
    return this.points[0] || null;
  }
  get end() {
    return this.points[this.points.length - 1] || null;
  }
  constructor(t) {
    if (super(), t != null) {
      if (typeof t == "string")
        return Mt.parse(t);
      this.points = t.map((e) => x.create(e));
    } else
      this.points = [];
  }
  scale(t, e, n = new x()) {
    return this.points.forEach((s) => s.scale(t, e, n)), this;
  }
  rotate(t, e) {
    return this.points.forEach((n) => n.rotate(t, e)), this;
  }
  translate(t, e) {
    const n = x.create(t, e);
    return this.points.forEach((s) => s.translate(n.x, n.y)), this;
  }
  round(t = 0) {
    return this.points.forEach((e) => e.round(t)), this;
  }
  bbox() {
    if (this.points.length === 0)
      return new R();
    let t = 1 / 0, e = -1 / 0, n = 1 / 0, s = -1 / 0;
    const r = this.points;
    for (let o = 0, a = r.length; o < a; o += 1) {
      const l = r[o], c = l.x, u = l.y;
      c < t && (t = c), c > e && (e = c), u < n && (n = u), u > s && (s = u);
    }
    return new R(t, n, e - t, s - n);
  }
  closestPoint(t) {
    const e = this.closestPointLength(t);
    return this.pointAtLength(e);
  }
  closestPointLength(t) {
    const e = this.points, n = e.length;
    if (n === 0 || n === 1)
      return 0;
    let s = 0, r = 0, o = 1 / 0;
    for (let a = 0, l = n - 1; a < l; a += 1) {
      const c = new D(e[a], e[a + 1]), u = c.length(), h = c.closestPointNormalizedLength(t), f = c.pointAt(h).squaredDistance(t);
      f < o && (o = f, r = s + h * u), s += u;
    }
    return r;
  }
  closestPointNormalizedLength(t) {
    const e = this.length();
    return e === 0 ? 0 : this.closestPointLength(t) / e;
  }
  closestPointTangent(t) {
    const e = this.closestPointLength(t);
    return this.tangentAtLength(e);
  }
  containsPoint(t) {
    if (this.points.length === 0)
      return !1;
    const e = x.clone(t), n = e.x, s = e.y, r = this.points, o = r.length;
    let a = o - 1, l = 0;
    for (let c = 0; c < o; c += 1) {
      const u = r[a], h = r[c];
      if (e.equals(u))
        return !0;
      const d = new D(u, h);
      if (d.containsPoint(t))
        return !0;
      if (s <= u.y && s > h.y || s > u.y && s <= h.y) {
        const f = u.x - n > h.x - n ? u.x - n : h.x - n;
        if (f >= 0) {
          const g = new x(n + f, s), p = new D(t, g);
          d.intersectsWithLine(p) && (l += 1);
        }
      }
      a = c;
    }
    return l % 2 === 1;
  }
  intersectsWithLine(t) {
    const e = [];
    for (let n = 0, s = this.points.length - 1; n < s; n += 1) {
      const r = this.points[n], o = this.points[n + 1], a = t.intersectsWithLine(new D(r, o));
      a && e.push(a);
    }
    return e.length > 0 ? e : null;
  }
  isDifferentiable() {
    for (let t = 0, e = this.points.length - 1; t < e; t += 1) {
      const n = this.points[t], s = this.points[t + 1];
      if (new D(n, s).isDifferentiable())
        return !0;
    }
    return !1;
  }
  length() {
    let t = 0;
    for (let e = 0, n = this.points.length - 1; e < n; e += 1) {
      const s = this.points[e], r = this.points[e + 1];
      t += s.distance(r);
    }
    return t;
  }
  pointAt(t) {
    const e = this.points, n = e.length;
    if (n === 0)
      return null;
    if (n === 1 || t <= 0)
      return e[0].clone();
    if (t >= 1)
      return e[n - 1].clone();
    const r = this.length() * t;
    return this.pointAtLength(r);
  }
  pointAtLength(t) {
    const e = this.points, n = e.length;
    if (n === 0)
      return null;
    if (n === 1)
      return e[0].clone();
    let s = !0;
    t < 0 && (s = !1, t = -t);
    let r = 0;
    for (let a = 0, l = n - 1; a < l; a += 1) {
      const c = s ? a : l - 1 - a, u = e[c], h = e[c + 1], d = new D(u, h), f = u.distance(h);
      if (t <= r + f)
        return d.pointAtLength((s ? 1 : -1) * (t - r));
      r += f;
    }
    return (s ? e[n - 1] : e[0]).clone();
  }
  tangentAt(t) {
    const n = this.points.length;
    if (n === 0 || n === 1)
      return null;
    t < 0 && (t = 0), t > 1 && (t = 1);
    const r = this.length() * t;
    return this.tangentAtLength(r);
  }
  tangentAtLength(t) {
    const e = this.points, n = e.length;
    if (n === 0 || n === 1)
      return null;
    let s = !0;
    t < 0 && (s = !1, t = -t);
    let r, o = 0;
    for (let a = 0, l = n - 1; a < l; a += 1) {
      const c = s ? a : l - 1 - a, u = e[c], h = e[c + 1], d = new D(u, h), f = u.distance(h);
      if (d.isDifferentiable()) {
        if (t <= o + f)
          return d.tangentAtLength((s ? 1 : -1) * (t - o));
        r = d;
      }
      o += f;
    }
    if (r) {
      const a = s ? 1 : 0;
      return r.tangentAt(a);
    }
    return null;
  }
  simplify(t = {}) {
    const e = this.points;
    if (e.length < 3)
      return this;
    const n = t.threshold || 0;
    let s = 0;
    for (; e[s + 2]; ) {
      const r = s, o = s + 1, a = s + 2, l = e[r], c = e[o], u = e[a];
      new D(l, u).closestPoint(c).distance(c) <= n ? e.splice(o, 1) : s += 1;
    }
    return this;
  }
  toHull() {
    const t = this.points, e = t.length;
    if (e === 0)
      return new Mt();
    let n = t[0];
    for (let d = 1; d < e; d += 1)
      (t[d].y < n.y || t[d].y === n.y && t[d].x > n.x) && (n = t[d]);
    const s = [];
    for (let d = 0; d < e; d += 1) {
      let f = n.theta(t[d]);
      f === 0 && (f = 360), s.push([t[d], d, f]);
    }
    if (s.sort((d, f) => {
      let g = d[2] - f[2];
      return g === 0 && (g = f[1] - d[1]), g;
    }), s.length > 2) {
      const d = s[s.length - 1];
      s.unshift(d);
    }
    const r = {}, o = [], a = (d) => `${d[0].toString()}@${d[1]}`;
    for (; s.length !== 0; ) {
      const d = s.pop(), f = d[0];
      if (r[a(d)])
        continue;
      let g = !1;
      for (; !g; )
        if (o.length < 2)
          o.push(d), g = !0;
        else {
          const p = o.pop(), m = p[0], y = o.pop(), v = y[0], b = v.cross(m, f);
          if (b < 0)
            o.push(y), o.push(p), o.push(d), g = !0;
          else if (b === 0) {
            const E = m.angleBetween(v, f);
            Math.abs(E - 180) < 1e-10 || m.equals(f) || v.equals(m) ? (r[a(p)] = m, o.push(y)) : Math.abs((E + 1) % 360 - 1) < 1e-10 && (o.push(y), s.push(p));
          } else
            r[a(p)] = m, o.push(y);
        }
    }
    o.length > 2 && o.pop();
    let l, c = -1;
    for (let d = 0, f = o.length; d < f; d += 1) {
      const g = o[d][1];
      (l === void 0 || g < l) && (l = g, c = d);
    }
    let u = [];
    if (c > 0) {
      const d = o.slice(c), f = o.slice(0, c);
      u = d.concat(f);
    } else
      u = o;
    const h = [];
    for (let d = 0, f = u.length; d < f; d += 1)
      h.push(u[d][0]);
    return new Mt(h);
  }
  equals(t) {
    return t == null || t.points.length !== this.points.length ? !1 : t.points.every((e, n) => e.equals(this.points[n]));
  }
  clone() {
    return new Mt(this.points.map((t) => t.clone()));
  }
  toJSON() {
    return this.points.map((t) => t.toJSON());
  }
  serialize() {
    return this.points.map((t) => `${t.serialize()}`).join(" ");
  }
}
(function(i) {
  function t(e) {
    return e != null && e instanceof i;
  }
  i.isPolyline = t;
})(Mt || (Mt = {}));
(function(i) {
  function t(e) {
    const n = e.trim();
    if (n === "")
      return new i();
    const s = [], r = n.split(/\s*,\s*|\s+/);
    for (let o = 0, a = r.length; o < a; o += 2)
      s.push({ x: +r[o], y: +r[o + 1] });
    return new i(s);
  }
  i.parse = t;
})(Mt || (Mt = {}));
class Et extends un {
  constructor(t, e, n, s) {
    super(), this.PRECISION = 3, this.start = x.create(t), this.controlPoint1 = x.create(e), this.controlPoint2 = x.create(n), this.end = x.create(s);
  }
  bbox() {
    const t = this.start, e = this.controlPoint1, n = this.controlPoint2, s = this.end, r = t.x, o = t.y, a = e.x, l = e.y, c = n.x, u = n.y, h = s.x, d = s.y, f = [], g = [[], []];
    let p, m, y, v, b, w, E, S;
    for (let N = 0; N < 2; N += 1) {
      if (N === 0 ? (m = 6 * r - 12 * a + 6 * c, p = -3 * r + 9 * a - 9 * c + 3 * h, y = 3 * a - 3 * r) : (m = 6 * o - 12 * l + 6 * u, p = -3 * o + 9 * l - 9 * u + 3 * d, y = 3 * l - 3 * o), Math.abs(p) < 1e-12) {
        if (Math.abs(m) < 1e-12)
          continue;
        v = -y / m, v > 0 && v < 1 && f.push(v);
        continue;
      }
      E = m * m - 4 * y * p, S = Math.sqrt(E), !(E < 0) && (b = (-m + S) / (2 * p), b > 0 && b < 1 && f.push(b), w = (-m - S) / (2 * p), w > 0 && w < 1 && f.push(w));
    }
    let C, P, O, I = f.length;
    const T = I;
    for (; I; )
      I -= 1, v = f[I], O = 1 - v, C = O * O * O * r + 3 * O * O * v * a + 3 * O * v * v * c + v * v * v * h, g[0][I] = C, P = O * O * O * o + 3 * O * O * v * l + 3 * O * v * v * u + v * v * v * d, g[1][I] = P;
    f[T] = 0, f[T + 1] = 1, g[0][T] = r, g[1][T] = o, g[0][T + 1] = h, g[1][T + 1] = d, f.length = T + 2, g[0].length = T + 2, g[1].length = T + 2;
    const k = Math.min.apply(null, g[0]), H = Math.min.apply(null, g[1]), $ = Math.max.apply(null, g[0]), A = Math.max.apply(null, g[1]);
    return new R(k, H, $ - k, A - H);
  }
  closestPoint(t, e = {}) {
    return this.pointAtT(this.closestPointT(t, e));
  }
  closestPointLength(t, e = {}) {
    const n = this.getOptions(e);
    return this.lengthAtT(this.closestPointT(t, n), n);
  }
  closestPointNormalizedLength(t, e = {}) {
    const n = this.getOptions(e), s = this.closestPointLength(t, n);
    if (!s)
      return 0;
    const r = this.length(n);
    return r === 0 ? 0 : s / r;
  }
  closestPointT(t, e = {}) {
    const n = this.getPrecision(e), s = this.getDivisions(e), r = Math.pow(10, -n);
    let o = null, a = 0, l = 0, c = 0, u = 0, h = 0, d = null;
    const f = s.length;
    let g = f > 0 ? 1 / f : 0;
    for (s.forEach((p, m) => {
      const y = p.start.distance(t), v = p.end.distance(t), b = y + v;
      (d == null || b < d) && (o = p, a = m * g, l = (m + 1) * g, c = y, u = v, d = b, h = p.endpointDistance());
    }); ; ) {
      const p = c ? Math.abs(c - u) / c : 0, m = u != null ? Math.abs(c - u) / u : 0, y = p < r || m < r, v = c ? c < h * r : !0, b = u ? u < h * r : !0;
      if (y || (v || b))
        return c <= u ? a : l;
      const E = o.divide(0.5);
      g /= 2;
      const S = E[0].start.distance(t), C = E[0].end.distance(t), P = S + C, O = E[1].start.distance(t), I = E[1].end.distance(t), T = O + I;
      P <= T ? (o = E[0], l -= g, c = S, u = C) : (o = E[1], a += g, c = O, u = I);
    }
  }
  closestPointTangent(t, e = {}) {
    return this.tangentAtT(this.closestPointT(t, e));
  }
  containsPoint(t, e = {}) {
    return this.toPolyline(e).containsPoint(t);
  }
  divideAt(t, e = {}) {
    if (t <= 0)
      return this.divideAtT(0);
    if (t >= 1)
      return this.divideAtT(1);
    const n = this.tAt(t, e);
    return this.divideAtT(n);
  }
  divideAtLength(t, e = {}) {
    const n = this.tAtLength(t, e);
    return this.divideAtT(n);
  }
  divide(t) {
    return this.divideAtT(t);
  }
  divideAtT(t) {
    const e = this.start, n = this.controlPoint1, s = this.controlPoint2, r = this.end;
    if (t <= 0)
      return [
        new Et(e, e, e, e),
        new Et(e, n, s, r)
      ];
    if (t >= 1)
      return [
        new Et(e, n, s, r),
        new Et(r, r, r, r)
      ];
    const o = this.getSkeletonPoints(t), a = o.startControlPoint1, l = o.startControlPoint2, c = o.divider, u = o.dividerControlPoint1, h = o.dividerControlPoint2;
    return [
      new Et(e, a, l, c),
      new Et(c, u, h, r)
    ];
  }
  endpointDistance() {
    return this.start.distance(this.end);
  }
  getSkeletonPoints(t) {
    const e = this.start, n = this.controlPoint1, s = this.controlPoint2, r = this.end;
    if (t <= 0)
      return {
        startControlPoint1: e.clone(),
        startControlPoint2: e.clone(),
        divider: e.clone(),
        dividerControlPoint1: n.clone(),
        dividerControlPoint2: s.clone()
      };
    if (t >= 1)
      return {
        startControlPoint1: n.clone(),
        startControlPoint2: s.clone(),
        divider: r.clone(),
        dividerControlPoint1: r.clone(),
        dividerControlPoint2: r.clone()
      };
    const o = new D(e, n).pointAt(t), a = new D(n, s).pointAt(t), l = new D(s, r).pointAt(t), c = new D(o, a).pointAt(t), u = new D(a, l).pointAt(t), h = new D(c, u).pointAt(t);
    return {
      startControlPoint1: o,
      startControlPoint2: c,
      divider: h,
      dividerControlPoint1: u,
      dividerControlPoint2: l
    };
  }
  getSubdivisions(t = {}) {
    const e = this.getPrecision(t);
    let n = [
      new Et(this.start, this.controlPoint1, this.controlPoint2, this.end)
    ];
    if (e === 0)
      return n;
    let s = this.endpointDistance();
    const r = Math.pow(10, -e);
    let o = 0;
    for (; ; ) {
      o += 1;
      const a = [];
      n.forEach((u) => {
        const h = u.divide(0.5);
        a.push(h[0], h[1]);
      });
      const l = a.reduce((u, h) => u + h.endpointDistance(), 0), c = l !== 0 ? (l - s) / l : 0;
      if (o > 1 && c < r)
        return a;
      n = a, s = l;
    }
  }
  length(t = {}) {
    return this.getDivisions(t).reduce((n, s) => n + s.endpointDistance(), 0);
  }
  lengthAtT(t, e = {}) {
    if (t <= 0)
      return 0;
    const n = e.precision === void 0 ? this.PRECISION : e.precision;
    return this.divide(t)[0].length({ precision: n });
  }
  pointAt(t, e = {}) {
    if (t <= 0)
      return this.start.clone();
    if (t >= 1)
      return this.end.clone();
    const n = this.tAt(t, e);
    return this.pointAtT(n);
  }
  pointAtLength(t, e = {}) {
    const n = this.tAtLength(t, e);
    return this.pointAtT(n);
  }
  pointAtT(t) {
    return t <= 0 ? this.start.clone() : t >= 1 ? this.end.clone() : this.getSkeletonPoints(t).divider;
  }
  isDifferentiable() {
    const t = this.start, e = this.controlPoint1, n = this.controlPoint2, s = this.end;
    return !(t.equals(e) && e.equals(n) && n.equals(s));
  }
  tangentAt(t, e = {}) {
    if (!this.isDifferentiable())
      return null;
    t < 0 ? t = 0 : t > 1 && (t = 1);
    const n = this.tAt(t, e);
    return this.tangentAtT(n);
  }
  tangentAtLength(t, e = {}) {
    if (!this.isDifferentiable())
      return null;
    const n = this.tAtLength(t, e);
    return this.tangentAtT(n);
  }
  tangentAtT(t) {
    if (!this.isDifferentiable())
      return null;
    t < 0 && (t = 0), t > 1 && (t = 1);
    const e = this.getSkeletonPoints(t), n = e.startControlPoint2, s = e.dividerControlPoint1, r = e.divider, o = new D(n, s);
    return o.translate(r.x - n.x, r.y - n.y), o;
  }
  getPrecision(t = {}) {
    return t.precision == null ? this.PRECISION : t.precision;
  }
  getDivisions(t = {}) {
    if (t.subdivisions != null)
      return t.subdivisions;
    const e = this.getPrecision(t);
    return this.getSubdivisions({ precision: e });
  }
  getOptions(t = {}) {
    const e = this.getPrecision(t), n = this.getDivisions(t);
    return { precision: e, subdivisions: n };
  }
  tAt(t, e = {}) {
    if (t <= 0)
      return 0;
    if (t >= 1)
      return 1;
    const n = this.getOptions(e), r = this.length(n) * t;
    return this.tAtLength(r, n);
  }
  tAtLength(t, e = {}) {
    let n = !0;
    t < 0 && (n = !1, t = -t);
    const s = this.getPrecision(e), r = this.getDivisions(e), o = { precision: s, subdivisions: r };
    let a = null, l, c, u = 0, h = 0, d = 0;
    const f = r.length;
    let g = f > 0 ? 1 / f : 0;
    for (let y = 0; y < f; y += 1) {
      const v = n ? y : f - 1 - y, b = r[y], w = b.endpointDistance();
      if (t <= d + w) {
        a = b, l = v * g, c = (v + 1) * g, u = n ? t - d : w + d - t, h = n ? w + d - t : t - d;
        break;
      }
      d += w;
    }
    if (a == null)
      return n ? 1 : 0;
    const p = this.length(o), m = Math.pow(10, -s);
    for (; ; ) {
      let y;
      if (y = p !== 0 ? u / p : 0, y < m)
        return l;
      if (y = p !== 0 ? h / p : 0, y < m)
        return c;
      let v, b;
      const w = a.divide(0.5);
      g /= 2;
      const E = w[0].endpointDistance(), S = w[1].endpointDistance();
      u <= E ? (a = w[0], c -= g, v = u, b = E - v) : (a = w[1], l += g, v = u - E, b = S - v), u = v, h = b;
    }
  }
  toPoints(t = {}) {
    const e = this.getDivisions(t), n = [e[0].start.clone()];
    return e.forEach((s) => n.push(s.end.clone())), n;
  }
  toPolyline(t = {}) {
    return new Mt(this.toPoints(t));
  }
  scale(t, e, n) {
    return this.start.scale(t, e, n), this.controlPoint1.scale(t, e, n), this.controlPoint2.scale(t, e, n), this.end.scale(t, e, n), this;
  }
  rotate(t, e) {
    return this.start.rotate(t, e), this.controlPoint1.rotate(t, e), this.controlPoint2.rotate(t, e), this.end.rotate(t, e), this;
  }
  translate(t, e) {
    return typeof t == "number" ? (this.start.translate(t, e), this.controlPoint1.translate(t, e), this.controlPoint2.translate(t, e), this.end.translate(t, e)) : (this.start.translate(t), this.controlPoint1.translate(t), this.controlPoint2.translate(t), this.end.translate(t)), this;
  }
  equals(t) {
    return t != null && this.start.equals(t.start) && this.controlPoint1.equals(t.controlPoint1) && this.controlPoint2.equals(t.controlPoint2) && this.end.equals(t.end);
  }
  clone() {
    return new Et(this.start, this.controlPoint1, this.controlPoint2, this.end);
  }
  toJSON() {
    return {
      start: this.start.toJSON(),
      controlPoint1: this.controlPoint1.toJSON(),
      controlPoint2: this.controlPoint2.toJSON(),
      end: this.end.toJSON()
    };
  }
  serialize() {
    return [
      this.start.serialize(),
      this.controlPoint1.serialize(),
      this.controlPoint2.serialize(),
      this.end.serialize()
    ].join(" ");
  }
}
(function(i) {
  function t(e) {
    return e != null && e instanceof i;
  }
  i.isCurve = t;
})(Et || (Et = {}));
(function(i) {
  function t(s) {
    const r = s.length, o = [], a = [];
    let l = 2;
    o[0] = s[0] / l;
    for (let c = 1; c < r; c += 1)
      a[c] = 1 / l, l = (c < r - 1 ? 4 : 3.5) - a[c], o[c] = (s[c] - o[c - 1]) / l;
    for (let c = 1; c < r; c += 1)
      o[r - c - 1] -= a[r - c] * o[r - c];
    return o;
  }
  function e(s) {
    const r = s.map((d) => x.clone(d)), o = [], a = [], l = r.length - 1;
    if (l === 1)
      return o[0] = new x((2 * r[0].x + r[1].x) / 3, (2 * r[0].y + r[1].y) / 3), a[0] = new x(2 * o[0].x - r[0].x, 2 * o[0].y - r[0].y), [o, a];
    const c = [];
    for (let d = 1; d < l - 1; d += 1)
      c[d] = 4 * r[d].x + 2 * r[d + 1].x;
    c[0] = r[0].x + 2 * r[1].x, c[l - 1] = (8 * r[l - 1].x + r[l].x) / 2;
    const u = t(c);
    for (let d = 1; d < l - 1; d += 1)
      c[d] = 4 * r[d].y + 2 * r[d + 1].y;
    c[0] = r[0].y + 2 * r[1].y, c[l - 1] = (8 * r[l - 1].y + r[l].y) / 2;
    const h = t(c);
    for (let d = 0; d < l; d += 1)
      o.push(new x(u[d], h[d])), d < l - 1 ? a.push(new x(2 * r[d + 1].x - u[d + 1], 2 * r[d + 1].y - h[d + 1])) : a.push(new x((r[l].x + u[l - 1]) / 2, (r[l].y + h[l - 1]) / 2));
    return [o, a];
  }
  function n(s) {
    if (s == null || Array.isArray(s) && s.length < 2)
      throw new Error("At least 2 points are required");
    const r = e(s), o = [];
    for (let a = 0, l = r[0].length; a < l; a += 1) {
      const c = new x(r[0][a].x, r[0][a].y), u = new x(r[1][a].x, r[1][a].y);
      o.push(new i(s[a], c, u, s[a + 1]));
    }
    return o;
  }
  i.throughPoints = n;
})(Et || (Et = {}));
class sr extends un {
  constructor() {
    super(...arguments), this.isVisible = !0, this.isSegment = !0, this.isSubpathStart = !1;
  }
  get end() {
    return this.endPoint;
  }
  get start() {
    if (this.previousSegment == null)
      throw new Error("Missing previous segment. (This segment cannot be the first segment of a path, or segment has not yet been added to a path.)");
    return this.previousSegment.end;
  }
  closestPointT(t, e) {
    if (this.closestPointNormalizedLength)
      return this.closestPointNormalizedLength(t);
    throw new Error("Neither `closestPointT` nor `closestPointNormalizedLength` method is implemented.");
  }
  // eslint-disable-next-line
  lengthAtT(t, e) {
    if (t <= 0)
      return 0;
    const n = this.length();
    return t >= 1 ? n : n * t;
  }
  divideAtT(t) {
    if (this.divideAt)
      return this.divideAt(t);
    throw new Error("Neither `divideAtT` nor `divideAt` method is implemented.");
  }
  pointAtT(t) {
    if (this.pointAt)
      return this.pointAt(t);
    throw new Error("Neither `pointAtT` nor `pointAt` method is implemented.");
  }
  tangentAtT(t) {
    if (this.tangentAt)
      return this.tangentAt(t);
    throw new Error("Neither `tangentAtT` nor `tangentAt` method is implemented.");
  }
}
class Yt extends sr {
  constructor(t, e) {
    super(), D.isLine(t) ? this.endPoint = t.end.clone().round(2) : this.endPoint = x.create(t, e).round(2);
  }
  get type() {
    return "L";
  }
  get line() {
    return new D(this.start, this.end);
  }
  bbox() {
    return this.line.bbox();
  }
  closestPoint(t) {
    return this.line.closestPoint(t);
  }
  closestPointLength(t) {
    return this.line.closestPointLength(t);
  }
  closestPointNormalizedLength(t) {
    return this.line.closestPointNormalizedLength(t);
  }
  closestPointTangent(t) {
    return this.line.closestPointTangent(t);
  }
  length() {
    return this.line.length();
  }
  divideAt(t) {
    const e = this.line.divideAt(t);
    return [new Yt(e[0]), new Yt(e[1])];
  }
  divideAtLength(t) {
    const e = this.line.divideAtLength(t);
    return [new Yt(e[0]), new Yt(e[1])];
  }
  getSubdivisions() {
    return [];
  }
  pointAt(t) {
    return this.line.pointAt(t);
  }
  pointAtLength(t) {
    return this.line.pointAtLength(t);
  }
  tangentAt(t) {
    return this.line.tangentAt(t);
  }
  tangentAtLength(t) {
    return this.line.tangentAtLength(t);
  }
  isDifferentiable() {
    return this.previousSegment == null ? !1 : !this.start.equals(this.end);
  }
  clone() {
    return new Yt(this.end);
  }
  scale(t, e, n) {
    return this.end.scale(t, e, n), this;
  }
  rotate(t, e) {
    return this.end.rotate(t, e), this;
  }
  translate(t, e) {
    return typeof t == "number" ? this.end.translate(t, e) : this.end.translate(t), this;
  }
  equals(t) {
    return this.type === t.type && this.start.equals(t.start) && this.end.equals(t.end);
  }
  toJSON() {
    return {
      type: this.type,
      start: this.start.toJSON(),
      end: this.end.toJSON()
    };
  }
  serialize() {
    const t = this.end;
    return `${this.type} ${t.x} ${t.y}`;
  }
}
(function(i) {
  function t(...e) {
    const n = e.length, s = e[0];
    if (D.isLine(s))
      return new i(s);
    if (x.isPointLike(s))
      return n === 1 ? new i(s) : e.map((o) => new i(o));
    if (n === 2)
      return new i(+e[0], +e[1]);
    const r = [];
    for (let o = 0; o < n; o += 2) {
      const a = +e[o], l = +e[o + 1];
      r.push(new i(a, l));
    }
    return r;
  }
  i.create = t;
})(Yt || (Yt = {}));
class Hn extends sr {
  get end() {
    if (!this.subpathStartSegment)
      throw new Error("Missing subpath start segment. (This segment needs a subpath start segment (e.g. MoveTo), or segment has not yet been added to a path.)");
    return this.subpathStartSegment.end;
  }
  get type() {
    return "Z";
  }
  get line() {
    return new D(this.start, this.end);
  }
  bbox() {
    return this.line.bbox();
  }
  closestPoint(t) {
    return this.line.closestPoint(t);
  }
  closestPointLength(t) {
    return this.line.closestPointLength(t);
  }
  closestPointNormalizedLength(t) {
    return this.line.closestPointNormalizedLength(t);
  }
  closestPointTangent(t) {
    return this.line.closestPointTangent(t);
  }
  length() {
    return this.line.length();
  }
  divideAt(t) {
    const e = this.line.divideAt(t);
    return [
      // do not actually cut into the segment, first divided part can stay as Z
      e[1].isDifferentiable() ? new Yt(e[0]) : this.clone(),
      new Yt(e[1])
    ];
  }
  divideAtLength(t) {
    const e = this.line.divideAtLength(t);
    return [
      e[1].isDifferentiable() ? new Yt(e[0]) : this.clone(),
      new Yt(e[1])
    ];
  }
  getSubdivisions() {
    return [];
  }
  pointAt(t) {
    return this.line.pointAt(t);
  }
  pointAtLength(t) {
    return this.line.pointAtLength(t);
  }
  tangentAt(t) {
    return this.line.tangentAt(t);
  }
  tangentAtLength(t) {
    return this.line.tangentAtLength(t);
  }
  isDifferentiable() {
    return !this.previousSegment || !this.subpathStartSegment ? !1 : !this.start.equals(this.end);
  }
  scale() {
    return this;
  }
  rotate() {
    return this;
  }
  translate() {
    return this;
  }
  equals(t) {
    return this.type === t.type && this.start.equals(t.start) && this.end.equals(t.end);
  }
  clone() {
    return new Hn();
  }
  toJSON() {
    return {
      type: this.type,
      start: this.start.toJSON(),
      end: this.end.toJSON()
    };
  }
  serialize() {
    return this.type;
  }
}
(function(i) {
  function t() {
    return new i();
  }
  i.create = t;
})(Hn || (Hn = {}));
class qn extends sr {
  constructor(t, e) {
    super(), this.isVisible = !1, this.isSubpathStart = !0, D.isLine(t) || Et.isCurve(t) ? this.endPoint = t.end.clone().round(2) : this.endPoint = x.create(t, e).round(2);
  }
  get start() {
    throw new Error("Illegal access. Moveto segments should not need a start property.");
  }
  get type() {
    return "M";
  }
  bbox() {
    return null;
  }
  closestPoint() {
    return this.end.clone();
  }
  closestPointLength() {
    return 0;
  }
  closestPointNormalizedLength() {
    return 0;
  }
  closestPointT() {
    return 1;
  }
  closestPointTangent() {
    return null;
  }
  length() {
    return 0;
  }
  lengthAtT() {
    return 0;
  }
  divideAt() {
    return [this.clone(), this.clone()];
  }
  divideAtLength() {
    return [this.clone(), this.clone()];
  }
  getSubdivisions() {
    return [];
  }
  pointAt() {
    return this.end.clone();
  }
  pointAtLength() {
    return this.end.clone();
  }
  pointAtT() {
    return this.end.clone();
  }
  tangentAt() {
    return null;
  }
  tangentAtLength() {
    return null;
  }
  tangentAtT() {
    return null;
  }
  isDifferentiable() {
    return !1;
  }
  scale(t, e, n) {
    return this.end.scale(t, e, n), this;
  }
  rotate(t, e) {
    return this.end.rotate(t, e), this;
  }
  translate(t, e) {
    return typeof t == "number" ? this.end.translate(t, e) : this.end.translate(t), this;
  }
  clone() {
    return new qn(this.end);
  }
  equals(t) {
    return this.type === t.type && this.end.equals(t.end);
  }
  toJSON() {
    return {
      type: this.type,
      end: this.end.toJSON()
    };
  }
  serialize() {
    const t = this.end;
    return `${this.type} ${t.x} ${t.y}`;
  }
}
(function(i) {
  function t(...e) {
    const n = e.length, s = e[0];
    if (D.isLine(s))
      return new i(s);
    if (Et.isCurve(s))
      return new i(s);
    if (x.isPointLike(s)) {
      if (n === 1)
        return new i(s);
      const o = [];
      for (let a = 0; a < n; a += 1)
        a === 0 ? o.push(new i(e[a])) : o.push(new Yt(e[a]));
      return o;
    }
    if (n === 2)
      return new i(+e[0], +e[1]);
    const r = [];
    for (let o = 0; o < n; o += 2) {
      const a = +e[o], l = +e[o + 1];
      o === 0 ? r.push(new i(a, l)) : r.push(new Yt(a, l));
    }
    return r;
  }
  i.create = t;
})(qn || (qn = {}));
class le extends sr {
  constructor(t, e, n, s, r, o) {
    super(), Et.isCurve(t) ? (this.controlPoint1 = t.controlPoint1.clone().round(2), this.controlPoint2 = t.controlPoint2.clone().round(2), this.endPoint = t.end.clone().round(2)) : typeof t == "number" ? (this.controlPoint1 = new x(t, e).round(2), this.controlPoint2 = new x(n, s).round(2), this.endPoint = new x(r, o).round(2)) : (this.controlPoint1 = x.create(t).round(2), this.controlPoint2 = x.create(e).round(2), this.endPoint = x.create(n).round(2));
  }
  get type() {
    return "C";
  }
  get curve() {
    return new Et(this.start, this.controlPoint1, this.controlPoint2, this.end);
  }
  bbox() {
    return this.curve.bbox();
  }
  closestPoint(t) {
    return this.curve.closestPoint(t);
  }
  closestPointLength(t) {
    return this.curve.closestPointLength(t);
  }
  closestPointNormalizedLength(t) {
    return this.curve.closestPointNormalizedLength(t);
  }
  closestPointTangent(t) {
    return this.curve.closestPointTangent(t);
  }
  length() {
    return this.curve.length();
  }
  divideAt(t, e = {}) {
    const n = this.curve.divideAt(t, e);
    return [new le(n[0]), new le(n[1])];
  }
  divideAtLength(t, e = {}) {
    const n = this.curve.divideAtLength(t, e);
    return [new le(n[0]), new le(n[1])];
  }
  divideAtT(t) {
    const e = this.curve.divideAtT(t);
    return [new le(e[0]), new le(e[1])];
  }
  getSubdivisions() {
    return [];
  }
  pointAt(t) {
    return this.curve.pointAt(t);
  }
  pointAtLength(t) {
    return this.curve.pointAtLength(t);
  }
  tangentAt(t) {
    return this.curve.tangentAt(t);
  }
  tangentAtLength(t) {
    return this.curve.tangentAtLength(t);
  }
  isDifferentiable() {
    if (!this.previousSegment)
      return !1;
    const t = this.start, e = this.controlPoint1, n = this.controlPoint2, s = this.end;
    return !(t.equals(e) && e.equals(n) && n.equals(s));
  }
  scale(t, e, n) {
    return this.controlPoint1.scale(t, e, n), this.controlPoint2.scale(t, e, n), this.end.scale(t, e, n), this;
  }
  rotate(t, e) {
    return this.controlPoint1.rotate(t, e), this.controlPoint2.rotate(t, e), this.end.rotate(t, e), this;
  }
  translate(t, e) {
    return typeof t == "number" ? (this.controlPoint1.translate(t, e), this.controlPoint2.translate(t, e), this.end.translate(t, e)) : (this.controlPoint1.translate(t), this.controlPoint2.translate(t), this.end.translate(t)), this;
  }
  equals(t) {
    return this.start.equals(t.start) && this.end.equals(t.end) && this.controlPoint1.equals(t.controlPoint1) && this.controlPoint2.equals(t.controlPoint2);
  }
  clone() {
    return new le(this.controlPoint1, this.controlPoint2, this.end);
  }
  toJSON() {
    return {
      type: this.type,
      start: this.start.toJSON(),
      controlPoint1: this.controlPoint1.toJSON(),
      controlPoint2: this.controlPoint2.toJSON(),
      end: this.end.toJSON()
    };
  }
  serialize() {
    const t = this.controlPoint1, e = this.controlPoint2, n = this.end;
    return [this.type, t.x, t.y, e.x, e.y, n.x, n.y].join(" ");
  }
}
(function(i) {
  function t(...e) {
    const n = e.length, s = e[0];
    if (Et.isCurve(s))
      return new i(s);
    if (x.isPointLike(s)) {
      if (n === 3)
        return new i(e[0], e[1], e[2]);
      const o = [];
      for (let a = 0; a < n; a += 3)
        o.push(new i(e[a], e[a + 1], e[a + 2]));
      return o;
    }
    if (n === 6)
      return new i(e[0], e[1], e[2], e[3], e[4], e[5]);
    const r = [];
    for (let o = 0; o < n; o += 6)
      r.push(new i(e[o], e[o + 1], e[o + 2], e[o + 3], e[o + 4], e[o + 5]));
    return r;
  }
  i.create = t;
})(le || (le = {}));
function us(i, t, e) {
  return {
    x: i * Math.cos(e) - t * Math.sin(e),
    y: i * Math.sin(e) + t * Math.cos(e)
  };
}
function sl(i, t, e, n, s, r) {
  const o = 0.3333333333333333, a = 2 / 3;
  return [
    o * i + a * e,
    o * t + a * n,
    o * s + a * e,
    o * r + a * n,
    s,
    r
  ];
}
function Lu(i, t, e, n, s, r, o, a, l, c) {
  const u = Math.PI * 120 / 180, h = Math.PI / 180 * (+s || 0);
  let d = [], f, g, p, m, y;
  if (c)
    g = c[0], p = c[1], m = c[2], y = c[3];
  else {
    f = us(i, t, -h), i = f.x, t = f.y, f = us(a, l, -h), a = f.x, l = f.y;
    const $ = (i - a) / 2, A = (t - l) / 2;
    let N = $ * $ / (e * e) + A * A / (n * n);
    N > 1 && (N = Math.sqrt(N), e = N * e, n = N * n);
    const V = e * e, it = n * n, Q = (r === o ? -1 : 1) * Math.sqrt(Math.abs((V * it - V * A * A - it * $ * $) / (V * A * A + it * $ * $)));
    m = Q * e * A / n + (i + a) / 2, y = Q * -n * $ / e + (t + l) / 2, g = Math.asin((t - y) / n), p = Math.asin((l - y) / n), g = i < m ? Math.PI - g : g, p = a < m ? Math.PI - p : p, g < 0 && (g = Math.PI * 2 + g), p < 0 && (p = Math.PI * 2 + p), o && g > p && (g -= Math.PI * 2), !o && p > g && (p -= Math.PI * 2);
  }
  let v = p - g;
  if (Math.abs(v) > u) {
    const $ = p, A = a, N = l;
    p = g + u * (o && p > g ? 1 : -1), a = m + e * Math.cos(p), l = y + n * Math.sin(p), d = Lu(a, l, e, n, s, 0, o, A, N, [
      p,
      $,
      m,
      y
    ]);
  }
  v = p - g;
  const b = Math.cos(g), w = Math.sin(g), E = Math.cos(p), S = Math.sin(p), C = Math.tan(v / 4), P = 4 / 3 * (e * C), O = 4 / 3 * (n * C), I = [i, t], T = [i + P * w, t - O * b], k = [a + P * S, l - O * E], H = [a, l];
  if (T[0] = 2 * I[0] - T[0], T[1] = 2 * I[1] - T[1], c)
    return [T, k, H].concat(d);
  {
    d = [T, k, H].concat(d).join().split(",");
    const $ = [], A = d.length;
    for (let N = 0; N < A; N += 1)
      $[N] = N % 2 ? us(+d[N - 1], +d[N], h).y : us(+d[N], +d[N + 1], h).x;
    return $;
  }
}
function G0(i) {
  if (!i)
    return null;
  const t = `	
\v\f\r   ᠎             　\u2028\u2029`, e = new RegExp(
    `([a-z])[${t},]*((-?\\d*\\.?\\d*(?:e[\\-+]?\\d+)?[${t}]*,?[${t}]*)+)`,
    // eslint-disable-line
    "ig"
  ), n = new RegExp(
    // eslint-disable-next-line
    `(-?\\d*\\.?\\d*(?:e[\\-+]?\\d+)?)[${t}]*,?[${t}]*`,
    "ig"
  ), s = {
    a: 7,
    c: 6,
    h: 1,
    l: 2,
    m: 2,
    q: 4,
    s: 4,
    t: 2,
    v: 1,
    z: 0
  }, r = [];
  return i.replace(e, (o, a, l) => {
    const c = [];
    let u = a.toLowerCase();
    l.replace(n, (d, f) => (f && c.push(+f), d)), u === "m" && c.length > 2 && (r.push([a, ...c.splice(0, 2)]), u = "l", a = a === "m" ? "l" : "L");
    const h = s[u];
    for (; c.length >= h && (r.push([a, ...c.splice(0, h)]), !!h); )
      ;
    return o;
  }), r;
}
function H0(i) {
  const t = G0(i);
  if (!t || !t.length)
    return [["M", 0, 0]];
  let e = 0, n = 0, s = 0, r = 0;
  const o = [];
  for (let a = 0, l = t.length; a < l; a += 1) {
    const c = [];
    o.push(c);
    const u = t[a], h = u[0];
    if (h !== h.toUpperCase())
      switch (c[0] = h.toUpperCase(), c[0]) {
        case "A":
          c[1] = u[1], c[2] = u[2], c[3] = u[3], c[4] = u[4], c[5] = u[5], c[6] = +u[6] + e, c[7] = +u[7] + n;
          break;
        case "V":
          c[1] = +u[1] + n;
          break;
        case "H":
          c[1] = +u[1] + e;
          break;
        case "M":
          s = +u[1] + e, r = +u[2] + n;
          for (let d = 1, f = u.length; d < f; d += 1)
            c[d] = +u[d] + (d % 2 ? e : n);
          break;
        default:
          for (let d = 1, f = u.length; d < f; d += 1)
            c[d] = +u[d] + (d % 2 ? e : n);
          break;
      }
    else
      for (let d = 0, f = u.length; d < f; d += 1)
        c[d] = u[d];
    switch (c[0]) {
      case "Z":
        e = +s, n = +r;
        break;
      case "H":
        e = c[1];
        break;
      case "V":
        n = c[1];
        break;
      case "M":
        s = c[c.length - 2], r = c[c.length - 1], e = c[c.length - 2], n = c[c.length - 1];
        break;
      default:
        e = c[c.length - 2], n = c[c.length - 1];
        break;
    }
  }
  return o;
}
function q0(i) {
  const t = H0(i), e = { x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null };
  function n(l, c, u) {
    let h, d;
    if (!l)
      return ["C", c.x, c.y, c.x, c.y, c.x, c.y];
    switch (l[0] in { T: 1, Q: 1 } || (c.qx = null, c.qy = null), l[0]) {
      case "M":
        c.X = l[1], c.Y = l[2];
        break;
      case "A":
        return parseFloat(l[1]) === 0 || parseFloat(l[2]) === 0 ? ["L", l[6], l[7]] : ["C"].concat(Lu.apply(0, [c.x, c.y].concat(l.slice(1))));
      case "S":
        return u === "C" || u === "S" ? (h = c.x * 2 - c.bx, d = c.y * 2 - c.by) : (h = c.x, d = c.y), ["C", h, d].concat(l.slice(1));
      case "T":
        return u === "Q" || u === "T" ? (c.qx = c.x * 2 - c.qx, c.qy = c.y * 2 - c.qy) : (c.qx = c.x, c.qy = c.y), ["C"].concat(sl(c.x, c.y, c.qx, c.qy, l[1], l[2]));
      case "Q":
        return c.qx = l[1], c.qy = l[2], ["C"].concat(sl(c.x, c.y, l[1], l[2], l[3], l[4]));
      case "H":
        return ["L"].concat(l[1], c.y);
      case "V":
        return ["L"].concat(c.x, l[1]);
    }
    return l;
  }
  function s(l, c) {
    if (l[c].length > 7) {
      l[c].shift();
      const u = l[c];
      for (; u.length; )
        r[c] = "A", c += 1, l.splice(c, 0, ["C"].concat(u.splice(0, 6)));
      l.splice(c, 1), a = t.length;
    }
  }
  const r = [];
  let o = "", a = t.length;
  for (let l = 0; l < a; l += 1) {
    let c = "";
    t[l] && (c = t[l][0]), c !== "C" && (r[l] = c, l > 0 && (o = r[l - 1])), t[l] = n(t[l], e, o), r[l] !== "A" && c === "C" && (r[l] = "C"), s(t, l);
    const u = t[l], h = u.length;
    e.x = u[h - 2], e.y = u[h - 1], e.bx = parseFloat(u[h - 4]) || e.x, e.by = parseFloat(u[h - 3]) || e.y;
  }
  return (!t[0][0] || t[0][0] !== "M") && t.unshift(["M", 0, 0]), t;
}
function U0(i) {
  return q0(i).map((t) => t.map((e) => typeof e == "string" ? e : ct.round(e, 2))).join(",").split(",").join(" ");
}
class B extends un {
  constructor(t) {
    if (super(), this.PRECISION = 3, this.segments = [], Array.isArray(t))
      if (D.isLine(t[0]) || Et.isCurve(t[0])) {
        let e = null;
        t.forEach((s, r) => {
          r === 0 && this.appendSegment(B.createSegment("M", s.start)), e != null && !e.end.equals(s.start) && this.appendSegment(B.createSegment("M", s.start)), D.isLine(s) ? this.appendSegment(B.createSegment("L", s.end)) : Et.isCurve(s) && this.appendSegment(B.createSegment("C", s.controlPoint1, s.controlPoint2, s.end)), e = s;
        });
      } else
        t.forEach((n) => {
          n.isSegment && this.appendSegment(n);
        });
    else t != null && (D.isLine(t) ? (this.appendSegment(B.createSegment("M", t.start)), this.appendSegment(B.createSegment("L", t.end))) : Et.isCurve(t) ? (this.appendSegment(B.createSegment("M", t.start)), this.appendSegment(B.createSegment("C", t.controlPoint1, t.controlPoint2, t.end))) : Mt.isPolyline(t) ? t.points && t.points.length && t.points.forEach((e, n) => {
      const s = n === 0 ? B.createSegment("M", e) : B.createSegment("L", e);
      this.appendSegment(s);
    }) : t.isSegment && this.appendSegment(t));
  }
  get start() {
    const t = this.segments, e = t.length;
    if (e === 0)
      return null;
    for (let n = 0; n < e; n += 1) {
      const s = t[n];
      if (s.isVisible)
        return s.start;
    }
    return t[e - 1].end;
  }
  get end() {
    const t = this.segments, e = t.length;
    if (e === 0)
      return null;
    for (let n = e - 1; n >= 0; n -= 1) {
      const s = t[n];
      if (s.isVisible)
        return s.end;
    }
    return t[e - 1].end;
  }
  moveTo(...t) {
    return this.appendSegment(qn.create.call(null, ...t));
  }
  lineTo(...t) {
    return this.appendSegment(Yt.create.call(null, ...t));
  }
  curveTo(...t) {
    return this.appendSegment(le.create.call(null, ...t));
  }
  arcTo(t, e, n, s, r, o, a) {
    const l = this.end || new x(), c = typeof o == "number" ? Ns(l.x, l.y, t, e, n, s, r, o, a) : Ns(l.x, l.y, t, e, n, s, r, o.x, o.y);
    if (c != null)
      for (let u = 0, h = c.length; u < h; u += 6)
        this.curveTo(c[u], c[u + 1], c[u + 2], c[u + 3], c[u + 4], c[u + 5]);
    return this;
  }
  quadTo(t, e, n, s) {
    const r = this.end || new x(), o = ["M", r.x, r.y];
    if (typeof t == "number")
      o.push("Q", t, e, n, s);
    else {
      const l = e;
      o.push("Q", t.x, t.y, l.x, l.y);
    }
    const a = B.parse(o.join(" "));
    return this.appendSegment(a.segments.slice(1)), this;
  }
  close() {
    return this.appendSegment(Hn.create());
  }
  drawPoints(t, e = {}) {
    const n = ju(t, e), s = B.parse(n);
    s && s.segments && this.appendSegment(s.segments);
  }
  bbox() {
    const t = this.segments, e = t.length;
    if (e === 0)
      return null;
    let n;
    for (let r = 0; r < e; r += 1) {
      const o = t[r];
      if (o.isVisible) {
        const a = o.bbox();
        a != null && (n = n ? n.union(a) : a);
      }
    }
    if (n != null)
      return n;
    const s = t[e - 1];
    return new R(s.end.x, s.end.y, 0, 0);
  }
  appendSegment(t) {
    const e = this.segments.length;
    let n = e !== 0 ? this.segments[e - 1] : null, s;
    const r = null;
    if (Array.isArray(t))
      for (let o = 0, a = t.length; o < a; o += 1) {
        const l = t[o];
        s = this.prepareSegment(l, n, r), this.segments.push(s), n = s;
      }
    else t != null && t.isSegment && (s = this.prepareSegment(t, n, r), this.segments.push(s));
    return this;
  }
  insertSegment(t, e) {
    const n = this.segments.length;
    if (t < 0 && (t = n + t + 1), t > n || t < 0)
      throw new Error("Index out of range.");
    let s, r = null, o = null;
    if (n !== 0 && (t >= 1 ? (r = this.segments[t - 1], o = r.nextSegment) : (r = null, o = this.segments[0])), !Array.isArray(e))
      s = this.prepareSegment(e, r, o), this.segments.splice(t, 0, s);
    else
      for (let a = 0, l = e.length; a < l; a += 1) {
        const c = e[a];
        s = this.prepareSegment(c, r, o), this.segments.splice(t + a, 0, s), r = s;
      }
    return this;
  }
  removeSegment(t) {
    const e = this.fixIndex(t), n = this.segments.splice(e, 1)[0], s = n.previousSegment, r = n.nextSegment;
    return s && (s.nextSegment = r), r && (r.previousSegment = s), n.isSubpathStart && r && this.updateSubpathStartSegment(r), n;
  }
  replaceSegment(t, e) {
    const n = this.fixIndex(t);
    let s;
    const r = this.segments[n];
    let o = r.previousSegment;
    const a = r.nextSegment;
    let l = r.isSubpathStart;
    if (!Array.isArray(e))
      s = this.prepareSegment(e, o, a), this.segments.splice(n, 1, s), l && s.isSubpathStart && (l = !1);
    else {
      this.segments.splice(t, 1);
      for (let c = 0, u = e.length; c < u; c += 1) {
        const h = e[c];
        s = this.prepareSegment(h, o, a), this.segments.splice(t + c, 0, s), o = s, l && s.isSubpathStart && (l = !1);
      }
    }
    l && a && this.updateSubpathStartSegment(a);
  }
  getSegment(t) {
    const e = this.fixIndex(t);
    return this.segments[e];
  }
  fixIndex(t) {
    const e = this.segments.length;
    if (e === 0)
      throw new Error("Path has no segments.");
    let n = t;
    for (; n < 0; )
      n = e + n;
    if (n >= e || n < 0)
      throw new Error("Index out of range.");
    return n;
  }
  segmentAt(t, e = {}) {
    const n = this.segmentIndexAt(t, e);
    return n ? this.getSegment(n) : null;
  }
  segmentAtLength(t, e = {}) {
    const n = this.segmentIndexAtLength(t, e);
    return n ? this.getSegment(n) : null;
  }
  segmentIndexAt(t, e = {}) {
    if (this.segments.length === 0)
      return null;
    const n = ct.clamp(t, 0, 1), s = this.getOptions(e), o = this.length(s) * n;
    return this.segmentIndexAtLength(o, s);
  }
  segmentIndexAtLength(t, e = {}) {
    const n = this.segments.length;
    if (n === 0)
      return null;
    let s = !0;
    t < 0 && (s = !1, t = -t);
    const r = this.getPrecision(e), o = this.getSubdivisions(e);
    let a = 0, l = null;
    for (let c = 0; c < n; c += 1) {
      const u = s ? c : n - 1 - c, h = this.segments[u], d = o[u], f = h.length({ precision: r, subdivisions: d });
      if (h.isVisible) {
        if (t <= a + f)
          return u;
        l = u;
      }
      a += f;
    }
    return l;
  }
  getSegmentSubdivisions(t = {}) {
    const e = this.getPrecision(t), n = [];
    for (let s = 0, r = this.segments.length; s < r; s += 1) {
      const a = this.segments[s].getSubdivisions({ precision: e });
      n.push(a);
    }
    return n;
  }
  updateSubpathStartSegment(t) {
    let e = t.previousSegment, n = t;
    for (; n && !n.isSubpathStart; )
      e != null ? n.subpathStartSegment = e.subpathStartSegment : n.subpathStartSegment = null, e = n, n = n.nextSegment;
  }
  prepareSegment(t, e, n) {
    t.previousSegment = e, t.nextSegment = n, e != null && (e.nextSegment = t), n != null && (n.previousSegment = t);
    let s = t;
    return t.isSubpathStart && (t.subpathStartSegment = t, s = n), s != null && this.updateSubpathStartSegment(s), t;
  }
  closestPoint(t, e = {}) {
    const n = this.closestPointT(t, e);
    return n ? this.pointAtT(n) : null;
  }
  closestPointLength(t, e = {}) {
    const n = this.getOptions(e), s = this.closestPointT(t, n);
    return s ? this.lengthAtT(s, n) : 0;
  }
  closestPointNormalizedLength(t, e = {}) {
    const n = this.getOptions(e), s = this.closestPointLength(t, n);
    if (s === 0)
      return 0;
    const r = this.length(n);
    return r === 0 ? 0 : s / r;
  }
  closestPointT(t, e = {}) {
    if (this.segments.length === 0)
      return null;
    const n = this.getPrecision(e), s = this.getSubdivisions(e);
    let r, o = 1 / 0;
    for (let a = 0, l = this.segments.length; a < l; a += 1) {
      const c = this.segments[a], u = s[a];
      if (c.isVisible) {
        const h = c.closestPointT(t, {
          precision: n,
          subdivisions: u
        }), d = c.pointAtT(h), f = ct.squaredLength(d, t);
        f < o && (r = { segmentIndex: a, value: h }, o = f);
      }
    }
    return r || { segmentIndex: this.segments.length - 1, value: 1 };
  }
  closestPointTangent(t, e = {}) {
    if (this.segments.length === 0)
      return null;
    const n = this.getPrecision(e), s = this.getSubdivisions(e);
    let r, o = 1 / 0;
    for (let a = 0, l = this.segments.length; a < l; a += 1) {
      const c = this.segments[a], u = s[a];
      if (c.isDifferentiable()) {
        const h = c.closestPointT(t, {
          precision: n,
          subdivisions: u
        }), d = c.pointAtT(h), f = ct.squaredLength(d, t);
        f < o && (r = c.tangentAtT(h), o = f);
      }
    }
    return r || null;
  }
  containsPoint(t, e = {}) {
    const n = this.toPolylines(e);
    if (!n)
      return !1;
    let s = 0;
    for (let r = 0, o = n.length; r < o; r += 1)
      n[r].containsPoint(t) && (s += 1);
    return s % 2 === 1;
  }
  pointAt(t, e = {}) {
    if (this.segments.length === 0)
      return null;
    if (t <= 0)
      return this.start.clone();
    if (t >= 1)
      return this.end.clone();
    const n = this.getOptions(e), r = this.length(n) * t;
    return this.pointAtLength(r, n);
  }
  pointAtLength(t, e = {}) {
    if (this.segments.length === 0)
      return null;
    if (t === 0)
      return this.start.clone();
    let n = !0;
    t < 0 && (n = !1, t = -t);
    const s = this.getPrecision(e), r = this.getSubdivisions(e);
    let o, a = 0;
    for (let c = 0, u = this.segments.length; c < u; c += 1) {
      const h = n ? c : u - 1 - c, d = this.segments[h], f = r[h], g = d.length({
        precision: s,
        subdivisions: f
      });
      if (d.isVisible) {
        if (t <= a + g)
          return d.pointAtLength((n ? 1 : -1) * (t - a), {
            precision: s,
            subdivisions: f
          });
        o = d;
      }
      a += g;
    }
    return o ? n ? o.end : o.start : this.segments[this.segments.length - 1].end.clone();
  }
  pointAtT(t) {
    const e = this.segments, n = e.length;
    if (n === 0)
      return null;
    const s = t.segmentIndex;
    if (s < 0)
      return e[0].pointAtT(0);
    if (s >= n)
      return e[n - 1].pointAtT(1);
    const r = ct.clamp(t.value, 0, 1);
    return e[s].pointAtT(r);
  }
  divideAt(t, e = {}) {
    if (this.segments.length === 0)
      return null;
    const n = ct.clamp(t, 0, 1), s = this.getOptions(e), o = this.length(s) * n;
    return this.divideAtLength(o, s);
  }
  divideAtLength(t, e = {}) {
    if (this.segments.length === 0)
      return null;
    let n = !0;
    t < 0 && (n = !1, t = -t);
    const s = this.getPrecision(e), r = this.getSubdivisions(e);
    let o = 0, a, l, c, u, h;
    for (let E = 0, S = this.segments.length; E < S; E += 1) {
      const C = n ? E : S - 1 - E, P = this.getSegment(C), O = r[C], I = { precision: s, subdivisions: O }, T = P.length(I);
      if (P.isDifferentiable() && (c = P, u = C, t <= o + T)) {
        l = C, a = P.divideAtLength((n ? 1 : -1) * (t - o), I);
        break;
      }
      o += T;
    }
    if (!c)
      return null;
    a || (l = u, h = n ? 1 : 0, a = c.divideAtT(h));
    const d = this.clone(), f = l;
    d.replaceSegment(f, a);
    const g = f;
    let p = f + 1, m = f + 2;
    a[0].isDifferentiable() || (d.removeSegment(g), p -= 1, m -= 1);
    const y = d.getSegment(p).start;
    d.insertSegment(p, B.createSegment("M", y)), m += 1, a[1].isDifferentiable() || (d.removeSegment(m - 1), m -= 1);
    const v = m - g - 1;
    for (let E = m, S = d.segments.length; E < S; E += 1) {
      const C = this.getSegment(E - v), P = d.getSegment(E);
      if (P.type === "Z" && !C.subpathStartSegment.end.equals(P.subpathStartSegment.end)) {
        const O = B.createSegment("L", C.end);
        d.replaceSegment(E, O);
      }
    }
    const b = new B(d.segments.slice(0, p)), w = new B(d.segments.slice(p));
    return [b, w];
  }
  intersectsWithLine(t, e = {}) {
    const n = this.toPolylines(e);
    if (n == null)
      return null;
    let s = null;
    for (let r = 0, o = n.length; r < o; r += 1) {
      const a = n[r], l = t.intersect(a);
      l && (s == null && (s = []), Array.isArray(l) ? s.push(...l) : s.push(l));
    }
    return s;
  }
  isDifferentiable() {
    for (let t = 0, e = this.segments.length; t < e; t += 1)
      if (this.segments[t].isDifferentiable())
        return !0;
    return !1;
  }
  isValid() {
    const t = this.segments;
    return t.length === 0 || t[0].type === "M";
  }
  length(t = {}) {
    if (this.segments.length === 0)
      return 0;
    const e = this.getSubdivisions(t);
    let n = 0;
    for (let s = 0, r = this.segments.length; s < r; s += 1) {
      const o = this.segments[s], a = e[s];
      n += o.length({ subdivisions: a });
    }
    return n;
  }
  lengthAtT(t, e = {}) {
    const n = this.segments.length;
    if (n === 0)
      return 0;
    let s = t.segmentIndex;
    if (s < 0)
      return 0;
    let r = ct.clamp(t.value, 0, 1);
    s >= n && (s = n - 1, r = 1);
    const o = this.getPrecision(e), a = this.getSubdivisions(e);
    let l = 0;
    for (let h = 0; h < s; h += 1) {
      const d = this.segments[h], f = a[h];
      l += d.length({ precision: o, subdivisions: f });
    }
    const c = this.segments[s], u = a[s];
    return l += c.lengthAtT(r, { precision: o, subdivisions: u }), l;
  }
  tangentAt(t, e = {}) {
    if (this.segments.length === 0)
      return null;
    const n = ct.clamp(t, 0, 1), s = this.getOptions(e), o = this.length(s) * n;
    return this.tangentAtLength(o, s);
  }
  tangentAtLength(t, e = {}) {
    if (this.segments.length === 0)
      return null;
    let n = !0;
    t < 0 && (n = !1, t = -t);
    const s = this.getPrecision(e), r = this.getSubdivisions(e);
    let o, a = 0;
    for (let l = 0, c = this.segments.length; l < c; l += 1) {
      const u = n ? l : c - 1 - l, h = this.segments[u], d = r[u], f = h.length({ precision: s, subdivisions: d });
      if (h.isDifferentiable()) {
        if (t <= a + f)
          return h.tangentAtLength((n ? 1 : -1) * (t - a), {
            precision: s,
            subdivisions: d
          });
        o = h;
      }
      a += f;
    }
    if (o) {
      const l = n ? 1 : 0;
      return o.tangentAtT(l);
    }
    return null;
  }
  tangentAtT(t) {
    const e = this.segments.length;
    if (e === 0)
      return null;
    const n = t.segmentIndex;
    if (n < 0)
      return this.segments[0].tangentAtT(0);
    if (n >= e)
      return this.segments[e - 1].tangentAtT(1);
    const s = ct.clamp(t.value, 0, 1);
    return this.segments[n].tangentAtT(s);
  }
  getPrecision(t = {}) {
    return t.precision == null ? this.PRECISION : t.precision;
  }
  getSubdivisions(t = {}) {
    if (t.segmentSubdivisions == null) {
      const e = this.getPrecision(t);
      return this.getSegmentSubdivisions({ precision: e });
    }
    return t.segmentSubdivisions;
  }
  getOptions(t = {}) {
    const e = this.getPrecision(t), n = this.getSubdivisions(t);
    return { precision: e, segmentSubdivisions: n };
  }
  toPoints(t = {}) {
    const e = this.segments, n = e.length;
    if (n === 0)
      return null;
    const s = this.getSubdivisions(t), r = [];
    let o = [];
    for (let a = 0; a < n; a += 1) {
      const l = e[a];
      if (l.isVisible) {
        const c = s[a];
        c.length > 0 ? c.forEach((u) => o.push(u.start)) : o.push(l.start);
      } else o.length > 0 && (o.push(e[a - 1].end), r.push(o), o = []);
    }
    return o.length > 0 && (o.push(this.end), r.push(o)), r;
  }
  toPolylines(t = {}) {
    const e = this.toPoints(t);
    return e ? e.map((n) => new Mt(n)) : null;
  }
  scale(t, e, n) {
    return this.segments.forEach((s) => s.scale(t, e, n)), this;
  }
  rotate(t, e) {
    return this.segments.forEach((n) => n.rotate(t, e)), this;
  }
  translate(t, e) {
    return typeof t == "number" ? this.segments.forEach((n) => n.translate(t, e)) : this.segments.forEach((n) => n.translate(t)), this;
  }
  clone() {
    const t = new B();
    return this.segments.forEach((e) => t.appendSegment(e.clone())), t;
  }
  equals(t) {
    if (t == null)
      return !1;
    const e = this.segments, n = t.segments, s = e.length;
    if (n.length !== s)
      return !1;
    for (let r = 0; r < s; r += 1) {
      const o = e[r], a = n[r];
      if (o.type !== a.type || !o.equals(a))
        return !1;
    }
    return !0;
  }
  toJSON() {
    return this.segments.map((t) => t.toJSON());
  }
  serialize() {
    if (!this.isValid())
      throw new Error("Invalid path segments.");
    return this.segments.map((t) => t.serialize()).join(" ");
  }
  toString() {
    return this.serialize();
  }
}
(function(i) {
  function t(e) {
    return e != null && e instanceof i;
  }
  i.isPath = t;
})(B || (B = {}));
(function(i) {
  function t(n) {
    if (!n)
      return new i();
    const s = new i(), r = /(?:[a-zA-Z] *)(?:(?:-?\d+(?:\.\d+)?(?:e[-+]?\d+)? *,? *)|(?:-?\.\d+ *,? *))+|(?:[a-zA-Z] *)(?! |\d|-|\.)/g, o = i.normalize(n).match(r);
    if (o != null)
      for (let a = 0, l = o.length; a < l; a += 1) {
        const c = o[a], u = /(?:[a-zA-Z])|(?:(?:-?\d+(?:\.\d+)?(?:e[-+]?\d+)?))|(?:(?:-?\.\d+))/g, h = c.match(u);
        if (h != null) {
          const d = h[0], f = h.slice(1).map((p) => +p), g = e.call(null, d, ...f);
          s.appendSegment(g);
        }
      }
    return s;
  }
  i.parse = t;
  function e(n, ...s) {
    if (n === "M")
      return qn.create.call(null, ...s);
    if (n === "L")
      return Yt.create.call(null, ...s);
    if (n === "C")
      return le.create.call(null, ...s);
    if (n === "z" || n === "Z")
      return Hn.create();
    throw new Error(`Invalid path segment type "${n}"`);
  }
  i.createSegment = e;
})(B || (B = {}));
(function(i) {
  i.normalize = U0, i.isValid = z0, i.drawArc = F0, i.drawPoints = ju, i.arcToCurves = Ns;
})(B || (B = {}));
class It {
  constructor(t) {
    this.options = Object.assign({}, t), this.data = this.options.data || {}, this.register = this.register.bind(this), this.unregister = this.unregister.bind(this);
  }
  get names() {
    return Object.keys(this.data);
  }
  register(t, e, n = !1) {
    if (typeof t == "object") {
      Object.entries(t).forEach(([o, a]) => {
        this.register(o, a, e);
      });
      return;
    }
    this.exist(t) && !n && !en.isApplyingHMR() && this.onDuplicated(t);
    const s = this.options.process, r = s ? z(s, this, t, e) : e;
    return this.data[t] = r, r;
  }
  unregister(t) {
    const e = t ? this.data[t] : null;
    return delete this.data[t], e;
  }
  get(t) {
    return t ? this.data[t] : null;
  }
  exist(t) {
    return t ? this.data[t] != null : !1;
  }
  onDuplicated(t) {
    try {
      throw this.options.onConflict && z(this.options.onConflict, this, t), new Error(`${Es(this.options.type)} with name '${t}' already registered.`);
    } catch (e) {
      throw e;
    }
  }
  onNotFound(t, e) {
    throw new Error(this.getSpellingSuggestion(t, e));
  }
  getSpellingSuggestion(t, e) {
    const n = this.getSpellingSuggestionForName(t), s = e ? `${e} ${dv(this.options.type)}` : this.options.type;
    return (
      // eslint-disable-next-line
      `${Es(s)} with name '${t}' does not exist.${n ? ` Did you mean '${n}'?` : ""}`
    );
  }
  getSpellingSuggestionForName(t) {
    return Uv(t, Object.keys(this.data), (e) => e);
  }
}
(function(i) {
  function t(e) {
    return new i(e);
  }
  i.create = t;
})(It || (It = {}));
const W0 = {
  color: "#aaaaaa",
  thickness: 1,
  markup: "rect",
  update(i, t) {
    const e = t.thickness * t.sx, n = t.thickness * t.sy;
    nt(i, {
      width: e,
      height: n,
      rx: e,
      ry: n,
      fill: t.color
    });
  }
}, X0 = {
  color: "#aaaaaa",
  thickness: 1,
  markup: "rect",
  update(i, t) {
    const e = t.sx <= 1 ? t.thickness * t.sx : t.thickness;
    nt(i, {
      width: e,
      height: e,
      rx: e,
      ry: e,
      fill: t.color
    });
  }
}, Y0 = {
  color: "rgba(224,224,224,1)",
  thickness: 1,
  markup: "path",
  update(i, t) {
    let e;
    const n = t.width, s = t.height, r = t.thickness;
    n - r >= 0 && s - r >= 0 ? e = ["M", n, 0, "H0 M0 0 V0", s].join(" ") : e = "M 0 0 0 0", nt(i, {
      d: e,
      stroke: t.color,
      "stroke-width": t.thickness
    });
  }
}, J0 = [
  {
    color: "rgba(224,224,224,1)",
    thickness: 1,
    markup: "path",
    update(i, t) {
      let e;
      const n = t.width, s = t.height, r = t.thickness;
      n - r >= 0 && s - r >= 0 ? e = ["M", n, 0, "H0 M0 0 V0", s].join(" ") : e = "M 0 0 0 0", nt(i, {
        d: e,
        stroke: t.color,
        "stroke-width": t.thickness
      });
    }
  },
  {
    color: "rgba(224,224,224,0.2)",
    thickness: 3,
    factor: 4,
    markup: "path",
    update(i, t) {
      let e;
      const n = t.factor || 1, s = t.width * n, r = t.height * n, o = t.thickness;
      s - o >= 0 && r - o >= 0 ? e = ["M", s, 0, "H0 M0 0 V0", r].join(" ") : e = "M 0 0 0 0", t.width = s, t.height = r, nt(i, {
        d: e,
        stroke: t.color,
        "stroke-width": t.thickness
      });
    }
  }
], K0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  dot: W0,
  doubleMesh: J0,
  fixedDot: X0,
  mesh: Y0
}, Symbol.toStringTag, { value: "Module" }));
class Ze {
  constructor() {
    this.patterns = {}, this.root = G.create(Os(), {
      width: "100%",
      height: "100%"
    }, [Se("defs")]).node;
  }
  add(t, e) {
    const n = this.root.childNodes[0];
    n && n.appendChild(e), this.patterns[t] = e, G.create("rect", {
      width: "100%",
      height: "100%",
      fill: `url(#${t})`
    }).appendTo(this.root);
  }
  get(t) {
    return this.patterns[t];
  }
  has(t) {
    return this.patterns[t] != null;
  }
}
(function(i) {
  i.presets = K0, i.registry = It.create({
    type: "grid"
  }), i.registry.register(i.presets, !0);
})(Ze || (Ze = {}));
const ku = function(i) {
  const t = document.createElement("canvas"), e = i.width, n = i.height;
  t.width = e * 2, t.height = n;
  const s = t.getContext("2d");
  return s.drawImage(i, 0, 0, e, n), s.translate(2 * e, 0), s.scale(-1, 1), s.drawImage(i, 0, 0, e, n), t;
}, Ru = function(i) {
  const t = document.createElement("canvas"), e = i.width, n = i.height;
  t.width = e, t.height = n * 2;
  const s = t.getContext("2d");
  return s.drawImage(i, 0, 0, e, n), s.translate(0, 2 * n), s.scale(1, -1), s.drawImage(i, 0, 0, e, n), t;
}, Du = function(i) {
  const t = document.createElement("canvas"), e = i.width, n = i.height;
  t.width = 2 * e, t.height = 2 * n;
  const s = t.getContext("2d");
  return s.drawImage(i, 0, 0, e, n), s.setTransform(-1, 0, 0, -1, t.width, t.height), s.drawImage(i, 0, 0, e, n), s.setTransform(-1, 0, 0, 1, t.width, 0), s.drawImage(i, 0, 0, e, n), s.setTransform(1, 0, 0, -1, 0, t.height), s.drawImage(i, 0, 0, e, n), t;
}, Z0 = function(i, t) {
  const e = i.width, n = i.height, s = document.createElement("canvas");
  s.width = e * 3, s.height = n * 3;
  const r = s.getContext("2d"), o = t.angle != null ? -t.angle : -20, a = ut.toRad(o), l = s.width / 4, c = s.height / 4;
  for (let u = 0; u < 4; u += 1)
    for (let h = 0; h < 4; h += 1)
      (u + h) % 2 > 0 && (r.setTransform(1, 0, 0, 1, (2 * u - 1) * l, (2 * h - 1) * c), r.rotate(a), r.drawImage(i, -e / 2, -n / 2, e, n));
  return s;
}, Q0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  flipX: ku,
  flipXY: Du,
  flipY: Ru,
  watermark: Z0
}, Symbol.toStringTag, { value: "Module" }));
var Hi;
(function(i) {
  i.presets = Object.assign({}, Q0), i.presets["flip-x"] = ku, i.presets["flip-y"] = Ru, i.presets["flip-xy"] = Du, i.registry = It.create({
    type: "background pattern"
  }), i.registry.register(i.presets, !0);
})(Hi || (Hi = {}));
function Vo(i, t) {
  return i ?? t;
}
function zt(i, t) {
  return i != null && Number.isFinite(i) ? i : t;
}
function tw(i = {}) {
  const t = Vo(i.color, "blue"), e = zt(i.width, 1), n = zt(i.margin, 2), s = zt(i.opacity, 1), r = n, o = n + e;
  return `
    <filter>
      <feFlood flood-color="${t}" flood-opacity="${s}" result="colored"/>
      <feMorphology in="SourceAlpha" result="morphedOuter" operator="dilate" radius="${o}" />
      <feMorphology in="SourceAlpha" result="morphedInner" operator="dilate" radius="${r}" />
      <feComposite result="morphedOuterColored" in="colored" in2="morphedOuter" operator="in"/>
      <feComposite operator="xor" in="morphedOuterColored" in2="morphedInner" result="outline"/>
      <feMerge>
        <feMergeNode in="outline"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  `.trim();
}
function ew(i = {}) {
  const t = Vo(i.color, "red"), e = zt(i.blur, 0), n = zt(i.width, 1), s = zt(i.opacity, 1);
  return `
      <filter>
        <feFlood flood-color="${t}" flood-opacity="${s}" result="colored"/>
        <feMorphology result="morphed" in="SourceGraphic" operator="dilate" radius="${n}"/>
        <feComposite result="composed" in="colored" in2="morphed" operator="in"/>
        <feGaussianBlur result="blured" in="composed" stdDeviation="${e}"/>
        <feBlend in="SourceGraphic" in2="blured" mode="normal"/>
      </filter>
    `.trim();
}
function nw(i = {}) {
  const t = zt(i.x, 2);
  return `
    <filter>
      <feGaussianBlur stdDeviation="${i.y != null && Number.isFinite(i.y) ? [t, i.y] : t}"/>
    </filter>
  `.trim();
}
function iw(i = {}) {
  const t = zt(i.dx, 0), e = zt(i.dy, 0), n = Vo(i.color, "black"), s = zt(i.blur, 4), r = zt(i.opacity, 1);
  return "SVGFEDropShadowElement" in window ? `<filter>
         <feDropShadow stdDeviation="${s}" dx="${t}" dy="${e}" flood-color="${n}" flood-opacity="${r}" />
       </filter>`.trim() : `<filter>
         <feGaussianBlur in="SourceAlpha" stdDeviation="${s}" />
         <feOffset dx="${t}" dy="${e}" result="offsetblur" />
         <feFlood flood-color="${n}" />
         <feComposite in2="offsetblur" operator="in" />
         <feComponentTransfer>
           <feFuncA type="linear" slope="${r}" />
         </feComponentTransfer>
         <feMerge>
           <feMergeNode/>
           <feMergeNode in="SourceGraphic"/>
         </feMerge>
       </filter>`.trim();
}
function sw(i = {}) {
  const t = zt(i.amount, 1), e = 0.2126 + 0.7874 * (1 - t), n = 0.7152 - 0.7152 * (1 - t), s = 0.0722 - 0.0722 * (1 - t), r = 0.2126 - 0.2126 * (1 - t), o = 0.7152 + 0.2848 * (1 - t), a = 0.0722 - 0.0722 * (1 - t), l = 0.2126 - 0.2126 * (1 - t), c = 0.0722 + 0.9278 * (1 - t);
  return `
    <filter>
      <feColorMatrix type="matrix" values="${e} ${n} ${s} 0 0 ${r} ${o} ${a} 0 0 ${l} ${n} ${c} 0 0 0 0 0 1 0"/>
    </filter>
  `.trim();
}
function rw(i = {}) {
  const t = zt(i.amount, 1), e = 0.393 + 0.607 * (1 - t), n = 0.769 - 0.769 * (1 - t), s = 0.189 - 0.189 * (1 - t), r = 0.349 - 0.349 * (1 - t), o = 0.686 + 0.314 * (1 - t), a = 0.168 - 0.168 * (1 - t), l = 0.272 - 0.272 * (1 - t), c = 0.534 - 0.534 * (1 - t), u = 0.131 + 0.869 * (1 - t);
  return `
      <filter>
        <feColorMatrix type="matrix" values="${e} ${n} ${s} 0 0 ${r} ${o} ${a} 0 0 ${l} ${c} ${u} 0 0 0 0 0 1 0"/>
      </filter>
    `.trim();
}
function ow(i = {}) {
  return `
      <filter>
        <feColorMatrix type="saturate" values="${1 - zt(i.amount, 1)}"/>
      </filter>
    `.trim();
}
function aw(i = {}) {
  return `
      <filter>
        <feColorMatrix type="hueRotate" values="${zt(i.angle, 0)}"/>
      </filter>
    `.trim();
}
function lw(i = {}) {
  const t = zt(i.amount, 1), e = 1 - t;
  return `
      <filter>
        <feComponentTransfer>
          <feFuncR type="table" tableValues="${t} ${e}"/>
          <feFuncG type="table" tableValues="${t} ${e}"/>
          <feFuncB type="table" tableValues="${t} ${e}"/>
        </feComponentTransfer>
      </filter>
    `.trim();
}
function cw(i = {}) {
  const t = zt(i.amount, 1);
  return `
    <filter>
      <feComponentTransfer>
        <feFuncR type="linear" slope="${t}"/>
        <feFuncG type="linear" slope="${t}"/>
        <feFuncB type="linear" slope="${t}"/>
      </feComponentTransfer>
    </filter>
  `.trim();
}
function uw(i = {}) {
  const t = zt(i.amount, 1), e = 0.5 - t / 2;
  return `
    <filter>
     <feComponentTransfer>
        <feFuncR type="linear" slope="${t}" intercept="${e}"/>
        <feFuncG type="linear" slope="${t}" intercept="${e}"/>
        <feFuncB type="linear" slope="${t}" intercept="${e}"/>
      </feComponentTransfer>
    </filter>
  `.trim();
}
const hw = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  blur: nw,
  brightness: cw,
  contrast: uw,
  dropShadow: iw,
  grayScale: sw,
  highlight: ew,
  hueRotate: aw,
  invert: lw,
  outline: tw,
  saturate: ow,
  sepia: rw
}, Symbol.toStringTag, { value: "Module" }));
var Un;
(function(i) {
  i.presets = hw, i.registry = It.create({
    type: "filter"
  }), i.registry.register(i.presets, !0);
})(Un || (Un = {}));
const dw = {
  xlinkHref: "xlink:href",
  xlinkShow: "xlink:show",
  xlinkRole: "xlink:role",
  xlinkType: "xlink:type",
  xlinkArcrole: "xlink:arcrole",
  xlinkTitle: "xlink:title",
  xlinkActuate: "xlink:actuate",
  xmlSpace: "xml:space",
  xmlBase: "xml:base",
  xmlLang: "xml:lang",
  preserveAspectRatio: "preserveAspectRatio",
  requiredExtension: "requiredExtension",
  requiredFeatures: "requiredFeatures",
  systemLanguage: "systemLanguage",
  externalResourcesRequired: "externalResourceRequired"
}, fw = {
  // We do not set `ref` attribute directly on an element.
  // The attribute itself does not qualify for relative positioning.
}, _u = {
  position: rr("x", "width", "origin")
}, $u = {
  position: rr("y", "height", "origin")
}, gw = {
  position: rr("x", "width", "corner")
}, pw = {
  position: rr("y", "height", "corner")
}, Bu = {
  set: rn("width", "width")
}, zu = {
  set: rn("height", "height")
}, mw = {
  set: rn("rx", "width")
}, bw = {
  set: rn("ry", "height")
}, Vu = {
  set: ((i) => {
    const t = rn(i, "width"), e = rn(i, "height");
    return function(n, s) {
      const r = s.refBBox, o = r.height > r.width ? t : e;
      return z(o, this, n, s);
    };
  })("r")
}, yw = {
  set(i, { refBBox: t }) {
    let e = parseFloat(i);
    const n = ze(i);
    n && (e /= 100);
    const s = Math.sqrt(t.height * t.height + t.width * t.width);
    let r;
    return Number.isFinite(e) && (n || e >= 0 && e <= 1 ? r = e * s : r = Math.max(e + s, 0)), { r };
  }
}, vw = {
  set: rn("cx", "width")
}, ww = {
  set: rn("cy", "height")
}, Fu = {
  set: qu({ resetOffset: !0 })
}, xw = {
  set: qu({ resetOffset: !1 })
}, Gu = {
  set: Uu({ resetOffset: !0 })
}, Ew = {
  set: Uu({ resetOffset: !1 })
}, Cw = Vu, Sw = Fu, Pw = Gu, Ow = _u, Aw = $u, Mw = Bu, Tw = zu;
function rr(i, t, e) {
  return (n, { refBBox: s }) => {
    if (n == null)
      return null;
    let r = parseFloat(n);
    const o = ze(n);
    o && (r /= 100);
    let a;
    if (Number.isFinite(r)) {
      const c = s[e];
      o || r > 0 && r < 1 ? a = c[i] + s[t] * r : a = c[i] + r;
    }
    const l = new x();
    return l[i] = a || 0, l;
  };
}
function rn(i, t) {
  return function(e, { refBBox: n }) {
    let s = parseFloat(e);
    const r = ze(e);
    r && (s /= 100);
    const o = {};
    if (Number.isFinite(s)) {
      const a = r || s >= 0 && s <= 1 ? s * n[t] : Math.max(s + n[t], 0);
      o[i] = a;
    }
    return o;
  };
}
function Hu(i, t) {
  const e = "x6-shape", n = t && t.resetOffset;
  return function(s, { elem: r, refBBox: o }) {
    let a = En(r, e);
    if (!a || a.value !== s) {
      const p = i(s);
      a = {
        value: s,
        shape: p,
        shapeBBox: p.bbox()
      }, En(r, e, a);
    }
    const l = a.shape.clone(), c = a.shapeBBox.clone(), u = c.getOrigin(), h = o.getOrigin();
    c.x = h.x, c.y = h.y;
    const d = o.getMaxScaleToFit(c, h), f = c.width === 0 || o.width === 0 ? 1 : d.sx, g = c.height === 0 || o.height === 0 ? 1 : d.sy;
    return l.scale(f, g, u), n && l.translate(-u.x, -u.y), l;
  };
}
function qu(i) {
  function t(n) {
    return B.parse(n);
  }
  const e = Hu(t, i);
  return (n, s) => ({
    d: e(n, s).serialize()
  });
}
function Uu(i) {
  const t = Hu((e) => new Mt(e), i);
  return (e, n) => ({
    points: t(e, n).serialize()
  });
}
const Nw = {
  qualify: ke,
  set(i, { view: t }) {
    return `url(#${t.graph.defineGradient(i)})`;
  }
}, Iw = {
  qualify: ke,
  set(i, { view: t }) {
    const e = t.cell, n = Object.assign({}, i);
    if (e.isEdge() && n.type === "linearGradient") {
      const s = t, r = s.sourcePoint, o = s.targetPoint;
      n.id = `gradient-${n.type}-${e.id}`, n.attrs = Object.assign(Object.assign({}, n.attrs), { x1: r.x, y1: r.y, x2: o.x, y2: o.y, gradientUnits: "userSpaceOnUse" }), t.graph.defs.remove(n.id);
    }
    return `url(#${t.graph.defineGradient(n)})`;
  }
}, Wu = {
  qualify(i, { attrs: t }) {
    return t.textWrap == null || !ke(t.textWrap);
  },
  set(i, { view: t, elem: e, attrs: n }) {
    const s = "x6-text", r = En(e, s), o = (u) => {
      try {
        return JSON.parse(u);
      } catch {
        return u;
      }
    }, a = {
      x: n.x,
      eol: n.eol,
      annotations: o(n.annotations),
      textPath: o(n["text-path"] || n.textPath),
      textVerticalAnchor: n["text-vertical-anchor"] || n.textVerticalAnchor,
      displayEmpty: (n["display-empty"] || n.displayEmpty) === "true",
      lineHeight: n["line-height"] || n.lineHeight
    }, l = n["font-size"] || n.fontSize, c = JSON.stringify([i, a]);
    if (l && e.setAttribute("font-size", l), r == null || r !== c) {
      const u = a.textPath;
      if (u != null && typeof u == "object") {
        const h = u.selector;
        if (typeof h == "string") {
          const d = t.find(h)[0];
          d instanceof SVGPathElement && (ko(d), a.textPath = Object.assign({ "xlink:href": `#${d.id}` }, u));
        }
      }
      Cu(e, `${i}`, a), En(e, s, c);
    }
  }
}, jw = {
  qualify: ke,
  set(i, { view: t, elem: e, attrs: n, refBBox: s }) {
    const r = i, o = r.width || 0;
    ze(o) ? s.width *= parseFloat(o) / 100 : o <= 0 ? s.width += o : s.width = o;
    const a = r.height || 0;
    ze(a) ? s.height *= parseFloat(a) / 100 : a <= 0 ? s.height += a : s.height = a;
    let l, c = r.text;
    c == null && (c = n.text || (e == null ? void 0 : e.textContent)), c != null ? l = Su(`${c}`, s, {
      "font-weight": n["font-weight"] || n.fontWeight,
      "font-size": n["font-size"] || n.fontSize,
      "font-family": n["font-family"] || n.fontFamily,
      lineHeight: n.lineHeight
    }, {
      // svgDocument: view.graph.view.svg,
      ellipsis: r.ellipsis
      // hyphen: info.hyphen as string,
      // breakWord: info.breakWord as boolean,
    }) : l = "", z(Wu.set, this, l, {
      view: t,
      elem: e,
      attrs: n,
      refBBox: s,
      cell: t.cell
    });
  }
}, gi = (i, { attrs: t }) => t.text !== void 0, Lw = {
  qualify: gi
}, kw = {
  qualify: gi
}, Rw = {
  qualify: gi
}, Dw = {
  qualify: gi
}, _w = {
  qualify: gi
}, $w = {
  qualify: gi
}, Bw = {
  qualify(i, { elem: t }) {
    return t instanceof SVGElement;
  },
  set(i, { elem: t }) {
    const e = "x6-title", n = `${i}`, s = En(t, e);
    if (s == null || s !== n) {
      En(t, e, n);
      const r = t.firstChild;
      if (r && r.tagName.toUpperCase() === "TITLE") {
        const o = r;
        o.textContent = n;
      } else {
        const o = document.createElementNS(t.namespaceURI, "title");
        o.textContent = n, t.insertBefore(o, r);
      }
    }
  }
}, zw = {
  offset: Xu("x", "width", "right")
}, Vw = {
  offset: Xu("y", "height", "bottom")
}, Fw = {
  offset(i, { refBBox: t }) {
    return i ? { x: -t.x, y: -t.y } : { x: 0, y: 0 };
  }
};
function Xu(i, t, e) {
  return (n, { refBBox: s }) => {
    const r = new x();
    let o;
    return n === "middle" ? o = s[t] / 2 : n === e ? o = s[t] : typeof n == "number" && Number.isFinite(n) ? o = n > -1 && n < 1 ? -s[t] * n : -n : ze(n) ? o = s[t] * parseFloat(n) / 100 : o = 0, r[i] = -(s[i] + o), r;
  };
}
const Gw = {
  qualify: ke,
  set(i, { elem: t }) {
    $t(t, i);
  }
}, Hw = {
  set(i, { elem: t }) {
    t.innerHTML = `${i}`;
  }
}, qw = {
  qualify: ke,
  set(i, { view: t }) {
    return `url(#${t.graph.defineFilter(i)})`;
  }
}, Uw = {
  set(i) {
    return i != null && typeof i == "object" && i.id ? i.id : i;
  }
};
function hn(i, t, e) {
  let n, s;
  typeof t == "object" ? (n = t.x, s = t.y) : (n = t, s = e);
  const r = B.parse(i), o = r.bbox();
  if (o) {
    let a = -o.height / 2 - o.y, l = -o.width / 2 - o.x;
    typeof n == "number" && (l -= n), typeof s == "number" && (a -= s), r.translate(l, a);
  }
  return r.serialize();
}
var Yu = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
};
const Ww = (i) => {
  var { size: t, width: e, height: n, offset: s, open: r } = i, o = Yu(i, ["size", "width", "height", "offset", "open"]);
  return Ju({ size: t, width: e, height: n, offset: s }, r === !0, !0, void 0, o);
}, Xw = (i) => {
  var { size: t, width: e, height: n, offset: s, factor: r } = i, o = Yu(i, ["size", "width", "height", "offset", "factor"]);
  return Ju({ size: t, width: e, height: n, offset: s }, !1, !1, r, o);
};
function Ju(i, t, e, n = 3 / 4, s = {}) {
  const r = i.size || 10, o = i.width || r, a = i.height || r, l = new B(), c = {};
  if (t)
    l.moveTo(o, 0).lineTo(0, a / 2).lineTo(o, a), c.fill = "none";
  else {
    if (l.moveTo(0, a / 2), l.lineTo(o, 0), !e) {
      const u = he(n, 0, 1);
      l.lineTo(o * u, a / 2);
    }
    l.lineTo(o, a), l.close();
  }
  return Object.assign(Object.assign(Object.assign({}, c), s), { tagName: "path", d: hn(l.serialize(), {
    x: i.offset != null ? i.offset : -o / 2
  }) });
}
var Yw = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
};
const Jw = (i) => {
  var { size: t, width: e, height: n, offset: s } = i, r = Yw(i, ["size", "width", "height", "offset"]);
  const o = t || 10, a = e || o, l = n || o, c = new B();
  return c.moveTo(0, l / 2).lineTo(a / 2, 0).lineTo(a, l / 2).lineTo(a / 2, l).close(), Object.assign(Object.assign({}, r), { tagName: "path", d: hn(c.serialize(), s ?? -a / 2) });
};
var Kw = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
};
const Zw = (i) => {
  var { d: t, offsetX: e, offsetY: n } = i, s = Kw(i, ["d", "offsetX", "offsetY"]);
  return Object.assign(Object.assign({}, s), { tagName: "path", d: hn(t, e, n) });
};
var Qw = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
};
const tx = (i) => {
  var { size: t, width: e, height: n, offset: s } = i, r = Qw(i, ["size", "width", "height", "offset"]);
  const o = t || 10, a = e || o, l = n || o, c = new B();
  return c.moveTo(0, 0).lineTo(a, l).moveTo(0, l).lineTo(a, 0), Object.assign(Object.assign({}, r), { tagName: "path", fill: "none", d: hn(c.serialize(), s || -a / 2) });
};
var ex = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
};
const nx = (i) => {
  var { width: t, height: e, offset: n, open: s, flip: r } = i, o = ex(i, ["width", "height", "offset", "open", "flip"]);
  let a = e || 6;
  const l = t || 10, c = s === !0, u = r === !0, h = Object.assign(Object.assign({}, o), { tagName: "path" });
  u && (a = -a);
  const d = new B();
  return d.moveTo(0, a).lineTo(l, 0), c ? h.fill = "none" : (d.lineTo(l, a), d.close()), h.d = hn(d.serialize(), {
    x: n || -l / 2,
    y: a / 2
  }), h;
};
var Ku = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
};
const Zu = (i) => {
  var { r: t } = i, e = Ku(i, ["r"]);
  const n = t || 5;
  return Object.assign(Object.assign({ cx: n }, e), { tagName: "circle", r: n });
}, ix = (i) => {
  var { r: t } = i, e = Ku(i, ["r"]);
  const n = t || 5, s = new B();
  return s.moveTo(n, 0).lineTo(n, n * 2), s.moveTo(0, n).lineTo(n * 2, n), {
    children: [
      Object.assign(Object.assign({}, Zu({ r: n })), { fill: "none" }),
      Object.assign(Object.assign({}, e), { tagName: "path", d: hn(s.serialize(), -n) })
    ]
  };
};
var sx = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
};
const rx = (i) => {
  var { rx: t, ry: e } = i, n = sx(i, ["rx", "ry"]);
  const s = t || 5, r = e || 5;
  return Object.assign(Object.assign({ cx: s }, n), { tagName: "ellipse", rx: s, ry: r });
}, ox = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  async: nx,
  block: Ww,
  circle: Zu,
  circlePlus: ix,
  classic: Xw,
  cross: tx,
  diamond: Jw,
  ellipse: rx,
  path: Zw
}, Symbol.toStringTag, { value: "Module" }));
var on;
(function(i) {
  i.presets = ox, i.registry = It.create({
    type: "marker"
  }), i.registry.register(i.presets, !0);
})(on || (on = {}));
(function(i) {
  i.normalize = hn;
})(on || (on = {}));
var ax = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
};
function Fo(i) {
  return typeof i == "string" || ke(i);
}
const lx = {
  qualify: Fo,
  set(i, { view: t, attrs: e }) {
    return Go("marker-start", i, t, e);
  }
}, cx = {
  qualify: Fo,
  set(i, { view: t, attrs: e }) {
    return Go("marker-end", i, t, e, {
      transform: "rotate(180)"
    });
  }
}, ux = {
  qualify: Fo,
  set(i, { view: t, attrs: e }) {
    return Go("marker-mid", i, t, e);
  }
};
function Go(i, t, e, n, s = {}) {
  const r = typeof t == "string" ? { name: t } : t, { name: o, args: a } = r, l = ax(r, ["name", "args"]);
  let c = l;
  if (o && typeof o == "string") {
    const h = on.registry.get(o);
    if (h)
      c = h(Object.assign(Object.assign({}, l), a));
    else
      return on.registry.onNotFound(o);
  }
  const u = Object.assign(Object.assign(Object.assign({}, hx(n, i)), s), c);
  return {
    [i]: `url(#${e.graph.defineMarker(u)})`
  };
}
function hx(i, t) {
  const e = {}, n = i.stroke;
  typeof n == "string" && (e.stroke = n, e.fill = n);
  let s = i.strokeOpacity;
  if (s == null && (s = i["stroke-opacity"]), s == null && (s = i.opacity), s != null && (e["stroke-opacity"] = s, e["fill-opacity"] = s), t !== "marker-mid") {
    const r = parseFloat(i.strokeWidth || i["stroke-width"]);
    if (Number.isFinite(r) && r > 1) {
      const o = Math.ceil(r / 2);
      e.refX = t === "marker-start" ? o : -o;
    }
  }
  return e;
}
const is = (i, { view: t }) => t.cell.isEdge(), dx = {
  qualify: is,
  set(i, t) {
    var e, n, s, r;
    const o = t.view, a = i.reverse || !1, l = i.stubs || 0;
    let c;
    if (Number.isFinite(l) && l !== 0)
      if (a) {
        let u, h;
        const d = o.getConnectionLength() || 0;
        l < 0 ? (u = (d + l) / 2, h = -l) : (u = l, h = d - l * 2);
        const f = o.getConnection();
        c = (r = (s = (n = (e = f == null ? void 0 : f.divideAtLength(u)) === null || e === void 0 ? void 0 : e[1]) === null || n === void 0 ? void 0 : n.divideAtLength(h)) === null || s === void 0 ? void 0 : s[0]) === null || r === void 0 ? void 0 : r.serialize();
      } else {
        let u;
        l < 0 ? u = ((o.getConnectionLength() || 0) + l) / 2 : u = l;
        const h = o.getConnection();
        if (h) {
          const d = h.divideAtLength(u), f = h.divideAtLength(-u);
          d && f && (c = `${d[0].serialize()} ${f[1].serialize()}`);
        }
      }
    return { d: c || o.getConnectionPathData() };
  }
}, Qu = {
  qualify: is,
  set: or("getTangentAtLength", { rotate: !0 })
}, fx = {
  qualify: is,
  set: or("getTangentAtLength", { rotate: !1 })
}, th = {
  qualify: is,
  set: or("getTangentAtRatio", { rotate: !0 })
}, gx = {
  qualify: is,
  set: or("getTangentAtRatio", { rotate: !1 })
}, px = Qu, mx = th;
function or(i, t) {
  const e = { x: 1, y: 0 };
  return (n, s) => {
    let r, o;
    const a = s.view, l = a[i](Number(n));
    return l ? (o = t.rotate ? l.vector().vectorAngle(e) : 0, r = l.start) : (r = a.path.start, o = 0), o === 0 ? { transform: `translate(${r.x},${r.y}')` } : {
      transform: `translate(${r.x},${r.y}') rotate(${o})`
    };
  };
}
const bx = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  annotations: Dw,
  atConnectionLength: px,
  atConnectionLengthIgnoreGradient: fx,
  atConnectionLengthKeepGradient: Qu,
  atConnectionRatio: mx,
  atConnectionRatioIgnoreGradient: gx,
  atConnectionRatioKeepGradient: th,
  connection: dx,
  displayEmpty: $w,
  eol: _w,
  fill: Nw,
  filter: qw,
  html: Hw,
  lineHeight: Lw,
  port: Uw,
  ref: fw,
  refCx: vw,
  refCy: ww,
  refD: Sw,
  refDKeepOffset: xw,
  refDResetOffset: Fu,
  refDx: gw,
  refDy: pw,
  refHeight: zu,
  refHeight2: Tw,
  refPoints: Pw,
  refPointsKeepOffset: Ew,
  refPointsResetOffset: Gu,
  refR: Cw,
  refRCircumscribed: yw,
  refRInscribed: Vu,
  refRx: mw,
  refRy: bw,
  refWidth: Bu,
  refWidth2: Mw,
  refX: _u,
  refX2: Ow,
  refY: $u,
  refY2: Aw,
  resetOffset: Fw,
  sourceMarker: lx,
  stroke: Iw,
  style: Gw,
  targetMarker: cx,
  text: Wu,
  textPath: Rw,
  textVerticalAnchor: kw,
  textWrap: jw,
  title: Bw,
  vertexMarker: ux,
  xAlign: zw,
  yAlign: Vw
}, Symbol.toStringTag, { value: "Module" }));
var je;
(function(i) {
  function t(e, n, s) {
    return !!(e != null && (typeof e == "string" || typeof e.qualify != "function" || z(e.qualify, this, n, s)));
  }
  i.isValidDefinition = t;
})(je || (je = {}));
(function(i) {
  i.presets = Object.assign(Object.assign({}, dw), bx), i.registry = It.create({
    type: "attribute definition"
  }), i.registry.register(i.presets, !0);
})(je || (je = {}));
const fe = {
  prefixCls: "x6",
  autoInsertCSS: !0,
  useCSSSelector: !0,
  prefix(i) {
    return `${fe.prefixCls}-${i}`;
  }
}, rl = fe.prefix("highlighted"), yx = {
  highlight(i, t, e) {
    const n = e && e.className || rl;
    U(t, n);
  },
  unhighlight(i, t, e) {
    const n = e && e.className || rl;
    Jt(t, n);
  }
}, ol = fe.prefix("highlight-opacity"), vx = {
  highlight(i, t) {
    U(t, ol);
  },
  unhighlight(i, t) {
    Jt(t, ol);
  }
};
var lt;
(function(i) {
  i.normalizeMarker = hn;
  function t(d, f) {
    const g = O0(d.x, d.y).matrixTransform(f);
    return new x(g.x, g.y);
  }
  i.transformPoint = t;
  function e(d, f) {
    return new D(t(d.start, f), t(d.end, f));
  }
  i.transformLine = e;
  function n(d, f) {
    let g = d instanceof Mt ? d.points : d;
    return Array.isArray(g) || (g = []), new Mt(g.map((p) => t(p, f)));
  }
  i.transformPolyline = n;
  function s(d, f) {
    const p = Se("svg").createSVGPoint();
    p.x = d.x, p.y = d.y;
    const m = p.matrixTransform(f);
    p.x = d.x + d.width, p.y = d.y;
    const y = p.matrixTransform(f);
    p.x = d.x + d.width, p.y = d.y + d.height;
    const v = p.matrixTransform(f);
    p.x = d.x, p.y = d.y + d.height;
    const b = p.matrixTransform(f), w = Math.min(m.x, y.x, v.x, b.x), E = Math.max(m.x, y.x, v.x, b.x), S = Math.min(m.y, y.y, v.y, b.y), C = Math.max(m.y, y.y, v.y, b.y);
    return new R(w, S, E - w, C - S);
  }
  i.transformRectangle = s;
  function r(d, f, g) {
    let p;
    const m = d.ownerSVGElement;
    if (!m)
      return new R(0, 0, 0, 0);
    try {
      p = d.getBBox();
    } catch {
      p = {
        x: d.clientLeft,
        y: d.clientTop,
        width: d.clientWidth,
        height: d.clientHeight
      };
    }
    if (f)
      return R.create(p);
    const y = ji(d, g || m);
    return s(p, y);
  }
  i.bbox = r;
  function o(d, f = {}) {
    let g;
    if (!d.ownerSVGElement || !nn(d)) {
      if (Ja(d)) {
        const { left: v, top: b, width: w, height: E } = a(d);
        return new R(v, b, w, E);
      }
      return new R(0, 0, 0, 0);
    }
    let m = f.target;
    if (!f.recursive) {
      try {
        g = d.getBBox();
      } catch {
        g = {
          x: d.clientLeft,
          y: d.clientTop,
          width: d.clientWidth,
          height: d.clientHeight
        };
      }
      if (!m)
        return R.create(g);
      const v = ji(d, m);
      return s(g, v);
    }
    {
      const v = d.childNodes, b = v.length;
      if (b === 0)
        return o(d, {
          target: m
        });
      m || (m = d);
      for (let w = 0; w < b; w += 1) {
        const E = v[w];
        let S;
        E.childNodes.length === 0 ? S = o(E, {
          target: m
        }) : S = o(E, {
          target: m,
          recursive: !0
        }), g ? g = g.union(S) : g = S;
      }
      return g;
    }
  }
  i.getBBox = o;
  function a(d) {
    let f = 0, g = 0, p = 0, m = 0;
    if (d) {
      let y = d;
      for (; y; )
        f += y.offsetLeft, g += y.offsetTop, y = y.offsetParent, y && (f += parseInt(tl(y, "borderLeft"), 10), g += parseInt(tl(y, "borderTop"), 10));
      p = d.offsetWidth, m = d.offsetHeight;
    }
    return {
      left: f,
      top: g,
      width: p,
      height: m
    };
  }
  i.getBoundingOffsetRect = a;
  function l(d) {
    const f = (g) => {
      const p = d.getAttribute(g), m = p ? parseFloat(p) : 0;
      return Number.isNaN(m) ? 0 : m;
    };
    switch (d instanceof SVGElement && d.nodeName.toLowerCase()) {
      case "rect":
        return new R(f("x"), f("y"), f("width"), f("height"));
      case "circle":
        return new xe(f("cx"), f("cy"), f("r"), f("r"));
      case "ellipse":
        return new xe(f("cx"), f("cy"), f("rx"), f("ry"));
      case "polyline": {
        const g = Ms(d);
        return new Mt(g);
      }
      case "polygon": {
        const g = Ms(d);
        return g.length > 1 && g.push(g[0]), new Mt(g);
      }
      case "path": {
        let g = d.getAttribute("d");
        return B.isValid(g) || (g = B.normalize(g)), B.parse(g);
      }
      case "line":
        return new D(f("x1"), f("y1"), f("x2"), f("y2"));
    }
    return o(d);
  }
  i.toGeometryShape = l;
  function c(d, f, g, p) {
    const m = x.create(f), y = x.create(g);
    p || (p = d instanceof SVGSVGElement ? d : d.ownerSVGElement);
    const v = Qr(d);
    d.setAttribute("transform", "");
    const b = o(d, {
      target: p
    }).scale(v.sx, v.sy), w = Ci();
    w.setTranslate(-b.x - b.width / 2, -b.y - b.height / 2);
    const E = Ci(), S = m.angleBetween(y, m.clone().translate(1, 0));
    S && E.setRotate(S, 0, 0);
    const C = Ci(), P = m.clone().move(y, b.width / 2);
    C.setTranslate(2 * m.x - P.x, 2 * m.y - P.y);
    const O = ji(d, p), I = Ci();
    I.setMatrix(C.matrix.multiply(E.matrix.multiply(w.matrix.multiply(O.scale(v.sx, v.sy))))), d.setAttribute("transform", fi(I.matrix));
  }
  i.translateAndAutoOrient = c;
  function u(d) {
    if (d == null)
      return null;
    let f = d;
    do {
      let g = f.tagName;
      if (typeof g != "string")
        return null;
      if (g = g.toUpperCase(), di(f, "x6-port"))
        f = f.nextElementSibling;
      else if (g === "G")
        f = f.firstElementChild;
      else if (g === "TITLE")
        f = f.nextElementSibling;
      else
        break;
    } while (f);
    return f;
  }
  i.findShapeNode = u;
  function h(d) {
    const f = u(d);
    if (!nn(f)) {
      if (Ja(d)) {
        const { left: m, top: y, width: v, height: b } = a(d);
        return new R(m, y, v, b);
      }
      return new R(0, 0, 0, 0);
    }
    return l(f).bbox() || R.create();
  }
  i.getBBoxV2 = h;
})(lt || (lt = {}));
const wx = {
  padding: 3,
  rx: 0,
  ry: 0,
  attrs: {
    "stroke-width": 3,
    stroke: "#FEB663"
  }
}, xx = {
  highlight(i, t, e) {
    const n = Je.getHighlighterId(t, e);
    if (Je.hasCache(n))
      return;
    e = Uc({}, e, wx);
    const s = G.create(t);
    let r, o;
    try {
      r = s.toPathData();
    } catch {
      o = lt.bbox(s.node, !0), r = Ou(Object.assign(Object.assign({}, e), o));
    }
    const a = Se("path");
    if (nt(a, Object.assign({ d: r, "pointer-events": "none", "vector-effect": "non-scaling-stroke", fill: "none" }, e.attrs ? Vi(e.attrs) : null)), i.isEdgeElement(t))
      nt(a, "d", i.getConnectionPathData());
    else {
      let u = s.getTransformToElement(i.container);
      const h = e.padding;
      if (h) {
        o == null && (o = lt.bbox(s.node, !0));
        const d = o.x + o.width / 2, f = o.y + o.height / 2;
        o = lt.transformRectangle(o, u);
        const g = Math.max(o.width, 1), p = Math.max(o.height, 1), m = (g + h) / g, y = (p + h) / p, v = Vt({
          a: m,
          b: 0,
          c: 0,
          d: y,
          e: d - m * d,
          f: f - y * f
        });
        u = u.multiply(v);
      }
      Gn(a, u);
    }
    U(a, fe.prefix("highlight-stroke"));
    const l = i.cell, c = () => Je.removeHighlighter(n);
    l.on("removed", c), l.model && l.model.on("reseted", c), i.container.appendChild(a), Je.setCache(n, a);
  },
  unhighlight(i, t, e) {
    Je.removeHighlighter(Je.getHighlighterId(t, e));
  }
};
var Je;
(function(i) {
  function t(o, a) {
    return ko(o), o.id + JSON.stringify(a);
  }
  i.getHighlighterId = t;
  const e = {};
  function n(o, a) {
    e[o] = a;
  }
  i.setCache = n;
  function s(o) {
    return e[o] != null;
  }
  i.hasCache = s;
  function r(o) {
    const a = e[o];
    a && (Te(a), delete e[o]);
  }
  i.removeHighlighter = r;
})(Je || (Je = {}));
const Ex = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  className: yx,
  opacity: vx,
  stroke: xx
}, Symbol.toStringTag, { value: "Module" }));
var Be;
(function(i) {
  function t(e, n) {
    if (typeof n.highlight != "function")
      throw new Error(`Highlighter '${e}' is missing required \`highlight()\` method`);
    if (typeof n.unhighlight != "function")
      throw new Error(`Highlighter '${e}' is missing required \`unhighlight()\` method`);
  }
  i.check = t;
})(Be || (Be = {}));
(function(i) {
  i.presets = Ex, i.registry = It.create({
    type: "highlighter"
  }), i.registry.register(i.presets, !0);
})(Be || (Be = {}));
function so(i, t = {}) {
  return new x(ve(t.x, i.width), ve(t.y, i.height));
}
function Ho(i, t, e) {
  return Object.assign({ angle: t, position: i.toJSON() }, e);
}
const Cx = (i, t) => i.map(({ x: e, y: n, angle: s }) => Ho(so(t, { x: e, y: n }), s || 0)), Sx = (i, t, e) => {
  const n = e.start || 0, s = e.step || 20;
  return eh(i, t, n, (r, o) => (r + 0.5 - o / 2) * s);
}, Px = (i, t, e) => {
  const n = e.start || 0, s = e.step || 360 / i.length;
  return eh(i, t, n, (r) => r * s);
};
function eh(i, t, e, n) {
  const s = t.getCenter(), r = t.getTopCenter(), o = t.width / t.height, a = xe.fromRect(t), l = i.length;
  return i.map((c, u) => {
    const h = e + n(u, l), d = r.clone().rotate(-h, s).scale(o, 1, s), f = c.compensateRotate ? -a.tangentTheta(d) : 0;
    return (c.dx || c.dy) && d.translate(c.dx || 0, c.dy || 0), c.dr && d.move(s, c.dr), Ho(d.round(), f, c);
  });
}
var Ox = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
};
const Ax = (i, t, e) => {
  const n = so(t, e.start || t.getOrigin()), s = so(t, e.end || t.getCorner());
  return ss(i, n, s, e);
}, Mx = (i, t, e) => ss(i, t.getTopLeft(), t.getBottomLeft(), e), Tx = (i, t, e) => ss(i, t.getTopRight(), t.getBottomRight(), e), Nx = (i, t, e) => ss(i, t.getTopLeft(), t.getTopRight(), e), Ix = (i, t, e) => ss(i, t.getBottomLeft(), t.getBottomRight(), e);
function ss(i, t, e, n) {
  const s = new D(t, e), r = i.length;
  return i.map((o, a) => {
    var { strict: l } = o, c = Ox(o, ["strict"]);
    const u = l || n.strict ? (a + 1) / (r + 1) : (a + 0.5) / r, h = s.pointAt(u);
    return (c.dx || c.dy) && h.translate(c.dx || 0, c.dy || 0), Ho(h.round(), 0, c);
  });
}
const jx = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  absolute: Cx,
  bottom: Ix,
  ellipse: Sx,
  ellipseSpread: Px,
  left: Mx,
  line: Ax,
  right: Tx,
  top: Nx
}, Symbol.toStringTag, { value: "Module" }));
var bn;
(function(i) {
  i.presets = jx, i.registry = It.create({
    type: "port layout"
  }), i.registry.register(i.presets, !0);
})(bn || (bn = {}));
const Lx = {
  position: { x: 0, y: 0 },
  angle: 0,
  attrs: {
    ".": {
      y: "0",
      "text-anchor": "start"
    }
  }
};
function dn(i, t) {
  const { x: e, y: n, angle: s, attrs: r } = t || {};
  return Uc({}, { angle: s, attrs: r, position: { x: e, y: n } }, i, Lx);
}
const kx = (i, t, e) => dn({ position: t.getTopLeft() }, e), Rx = (i, t, e) => dn({
  position: { x: -15, y: 0 },
  attrs: { ".": { y: ".3em", "text-anchor": "end" } }
}, e), Dx = (i, t, e) => dn({
  position: { x: 15, y: 0 },
  attrs: { ".": { y: ".3em", "text-anchor": "start" } }
}, e), _x = (i, t, e) => dn({
  position: { x: 0, y: -15 },
  attrs: { ".": { "text-anchor": "middle" } }
}, e), $x = (i, t, e) => dn({
  position: { x: 0, y: 15 },
  attrs: { ".": { y: ".6em", "text-anchor": "middle" } }
}, e), Bx = (i, t, e) => nh(i, t, !1, e), zx = (i, t, e) => nh(i, t, !0, e), Vx = (i, t, e) => ih(i, t, !1, e), Fx = (i, t, e) => ih(i, t, !0, e);
function nh(i, t, e, n) {
  const s = n.offset != null ? n.offset : 15, r = t.getCenter().theta(i), o = sh(t);
  let a, l, c, u, h = 0;
  return r < o[1] || r > o[2] ? (a = ".3em", l = s, c = 0, u = "start") : r < o[0] ? (a = "0", l = 0, c = -s, e ? (h = -90, u = "start") : u = "middle") : r < o[3] ? (a = ".3em", l = -s, c = 0, u = "end") : (a = ".6em", l = 0, c = s, e ? (h = 90, u = "start") : u = "middle"), dn({
    position: {
      x: Math.round(l),
      y: Math.round(c)
    },
    angle: h,
    attrs: {
      ".": {
        y: a,
        "text-anchor": u
      }
    }
  }, n);
}
function ih(i, t, e, n) {
  const s = n.offset != null ? n.offset : 15, r = t.getCenter().theta(i), o = sh(t);
  let a, l, c, u, h = 0;
  return r < o[1] || r > o[2] ? (a = ".3em", l = -s, c = 0, u = "end") : r < o[0] ? (a = ".6em", l = 0, c = s, e ? (h = 90, u = "start") : u = "middle") : r < o[3] ? (a = ".3em", l = s, c = 0, u = "start") : (a = "0em", l = 0, c = -s, e ? (h = -90, u = "start") : u = "middle"), dn({
    position: {
      x: Math.round(l),
      y: Math.round(c)
    },
    angle: h,
    attrs: {
      ".": {
        y: a,
        "text-anchor": u
      }
    }
  }, n);
}
function sh(i) {
  const t = i.getCenter(), e = t.theta(i.getTopLeft()), n = t.theta(i.getBottomLeft()), s = t.theta(i.getBottomRight()), r = t.theta(i.getTopRight());
  return [e, r, s, n];
}
const Gx = (i, t, e) => rh(i.diff(t.getCenter()), !1, e), Hx = (i, t, e) => rh(i.diff(t.getCenter()), !0, e);
function rh(i, t, e) {
  const n = e.offset != null ? e.offset : 20, s = new x(0, 0), r = -i.theta(s), o = i.clone().move(s, n).diff(i).round();
  let a = ".3em", l, c = r;
  return (r + 90) % 180 === 0 ? (l = t ? "end" : "middle", !t && r === -270 && (a = "0em")) : r > -270 && r < -90 ? (l = "start", c = r - 180) : l = "end", dn({
    position: o.round().toJSON(),
    angle: t ? c : 0,
    attrs: {
      ".": {
        y: a,
        "text-anchor": l
      }
    }
  }, e);
}
const qx = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  bottom: $x,
  inside: Vx,
  insideOriented: Fx,
  left: Rx,
  manual: kx,
  outside: Bx,
  outsideOriented: zx,
  radial: Gx,
  radialOriented: Hx,
  right: Dx,
  top: _x
}, Symbol.toStringTag, { value: "Module" }));
var Wn;
(function(i) {
  i.presets = qx, i.registry = It.create({
    type: "port label layout"
  }), i.registry.register(i.presets, !0);
})(Wn || (Wn = {}));
var Ux = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
};
class rt extends Nt {
  get priority() {
    return 2;
  }
  /** If need remove `this.container` DOM */
  get disposeContainer() {
    return !0;
  }
  constructor() {
    super(), this.cid = ro.uniqueId(), rt.views[this.cid] = this;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  confirmUpdate(t, e) {
    return 0;
  }
  empty(t = this.container) {
    return ns(t), this;
  }
  unmount(t = this.container) {
    return Te(t), this;
  }
  remove(t = this.container) {
    return t === this.container ? (this.removeEventListeners(document), this.onRemove(), delete rt.views[this.cid], this.disposeContainer && this.unmount(t)) : this.unmount(t), this;
  }
  onRemove() {
  }
  setClass(t, e = this.container) {
    e.classList.value = Array.isArray(t) ? t.join(" ") : t;
  }
  addClass(t, e = this.container) {
    return U(e, Array.isArray(t) ? t.join(" ") : t), this;
  }
  removeClass(t, e = this.container) {
    return Jt(e, Array.isArray(t) ? t.join(" ") : t), this;
  }
  setStyle(t, e = this.container) {
    return $t(e, t), this;
  }
  setAttrs(t, e = this.container) {
    return t != null && e != null && nt(e, t), this;
  }
  /**
   * Returns the value of the specified attribute of `node`.
   *
   * If the node does not set a value for attribute, start recursing up
   * the DOM tree from node to lookup for attribute at the ancestors of
   * node. If the recursion reaches CellView's root node and attribute
   * is not found even there, return `null`.
   */
  findAttr(t, e = this.container) {
    let n = e;
    for (; n && n.nodeType === 1; ) {
      const s = n.getAttribute(t);
      if (s != null)
        return s;
      if (n === this.container)
        return null;
      n = n.parentNode;
    }
    return null;
  }
  find(t, e = this.container, n = this.selectors) {
    return rt.find(t, e, n).elems;
  }
  findOne(t, e = this.container, n = this.selectors) {
    const s = this.find(t, e, n);
    return s.length > 0 ? s[0] : null;
  }
  findByAttr(t, e = this.container) {
    let n = e;
    for (; n && n.getAttribute; ) {
      const s = n.getAttribute(t);
      if ((s != null || n === this.container) && s !== "false")
        return n;
      n = n.parentNode;
    }
    return null;
  }
  getSelector(t, e) {
    let n;
    if (t === this.container)
      return typeof e == "string" && (n = `> ${e}`), n;
    if (t) {
      const s = Do(t) + 1;
      n = `${t.tagName.toLowerCase()}:nth-child(${s})`, e && (n += ` > ${e}`), n = this.getSelector(t.parentNode, n);
    }
    return n;
  }
  prefixClassName(t) {
    return fe.prefix(t);
  }
  delegateEvents(t, e) {
    if (t == null)
      return this;
    e || this.undelegateEvents();
    const n = /^(\S+)\s*(.*)$/;
    return Object.keys(t).forEach((s) => {
      const r = s.match(n);
      if (r == null)
        return;
      const o = this.getEventHandler(t[s]);
      typeof o == "function" && this.delegateEvent(r[1], r[2], o);
    }), this;
  }
  undelegateEvents() {
    return Ut.off(this.container, this.getEventNamespace()), this;
  }
  delegateDocumentEvents(t, e) {
    return this.addEventListeners(document, t, e), this;
  }
  undelegateDocumentEvents() {
    return this.removeEventListeners(document), this;
  }
  delegateEvent(t, e, n) {
    return Ut.on(this.container, t + this.getEventNamespace(), e, n), this;
  }
  undelegateEvent(t, e, n) {
    const s = t + this.getEventNamespace();
    return e == null ? Ut.off(this.container, s) : typeof e == "string" ? Ut.off(this.container, s, e, n) : Ut.off(this.container, s, e), this;
  }
  addEventListeners(t, e, n) {
    if (e == null)
      return this;
    const s = this.getEventNamespace();
    return Object.keys(e).forEach((r) => {
      const o = this.getEventHandler(e[r]);
      typeof o == "function" && Ut.on(t, r + s, n, o);
    }), this;
  }
  removeEventListeners(t) {
    return t != null && Ut.off(t, this.getEventNamespace()), this;
  }
  getEventNamespace() {
    return `.${fe.prefixCls}-event-${this.cid}`;
  }
  // eslint-disable-next-line
  getEventHandler(t) {
    let e;
    if (typeof t == "string") {
      const n = this[t];
      typeof n == "function" && (e = (...s) => n.call(this, ...s));
    } else
      e = (...n) => t.call(this, ...n);
    return e;
  }
  getEventTarget(t, e = {}) {
    const { target: n, type: s, clientX: r = 0, clientY: o = 0 } = t;
    return e.fromPoint || s === "touchmove" || s === "touchend" ? document.elementFromPoint(r, o) : n;
  }
  stopPropagation(t) {
    return this.setEventData(t, { propagationStopped: !0 }), this;
  }
  isPropagationStopped(t) {
    return this.getEventData(t).propagationStopped === !0;
  }
  getEventData(t) {
    return this.eventData(t);
  }
  setEventData(t, e) {
    return this.eventData(t, e);
  }
  eventData(t, e) {
    if (t == null)
      throw new TypeError("Event object required");
    let n = t.data;
    const s = `__${this.cid}__`;
    return e == null ? n == null ? {} : n[s] || {} : (n == null && (n = t.data = {}), n[s] == null ? n[s] = Object.assign({}, e) : n[s] = Object.assign(Object.assign({}, n[s]), e), n[s]);
  }
  normalizeEvent(t) {
    return rt.normalizeEvent(t);
  }
  dispose() {
    this.remove();
  }
}
Ux([
  rt.dispose()
], rt.prototype, "dispose", null);
(function(i) {
  function t(s, r) {
    return r ? Se(s || "g") : Ro(s || "div");
  }
  i.createElement = t;
  function e(s, r, o) {
    if (!s || s === ".")
      return { elems: [r] };
    if (o) {
      const a = o[s];
      if (a)
        return { elems: Array.isArray(a) ? a : [a] };
    }
    {
      const a = s.includes(">") ? `:scope ${s}` : s;
      return {
        isCSSSelector: !0,
        // $(rootElem).find(selector).toArray() as Element[]
        elems: Array.prototype.slice.call(r.querySelectorAll(a))
      };
    }
  }
  i.find = e;
  function n(s) {
    let r = s;
    const o = s.originalEvent, a = o && o.changedTouches && o.changedTouches[0];
    if (a) {
      for (const l in s)
        a[l] === void 0 && (a[l] = s[l]);
      r = a;
    }
    return r;
  }
  i.normalizeEvent = n;
})(rt || (rt = {}));
(function(i) {
  i.views = {};
  function t(e) {
    return i.views[e] || null;
  }
  i.getView = t;
})(rt || (rt = {}));
var ro;
(function(i) {
  let t = 0;
  function e() {
    const n = `v${t}`;
    return t += 1, n;
  }
  i.uniqueId = e;
})(ro || (ro = {}));
class Wx {
  constructor(t) {
    this.view = t, this.clean();
  }
  clean() {
    this.elemCache && this.elemCache.dispose(), this.elemCache = new io(), this.pathCache = {};
  }
  get(t) {
    return this.elemCache.has(t) || this.elemCache.set(t, {}), this.elemCache.get(t);
  }
  getData(t) {
    const e = this.get(t);
    return e.data || (e.data = {}), e.data;
  }
  getMatrix(t) {
    const e = this.get(t);
    if (e.matrix == null) {
      const n = this.view.container;
      e.matrix = I0(t, n);
    }
    return Vt(e.matrix);
  }
  getShape(t) {
    const e = this.get(t);
    return e.shape == null && (e.shape = lt.toGeometryShape(t)), e.shape.clone();
  }
  getBoundingRect(t) {
    const e = this.get(t);
    return e.boundingRect == null && (e.boundingRect = lt.getBBoxV2(t)), e.boundingRect.clone();
  }
}
var mt;
(function(i) {
  function t(c) {
    return c != null && !e(c);
  }
  i.isJSONMarkup = t;
  function e(c) {
    return c != null && typeof c == "string";
  }
  i.isStringMarkup = e;
  function n(c) {
    return c == null || e(c) ? c : pt(c);
  }
  i.clone = n;
  function s(c) {
    return `${c}`.trim().replace(/[\r|\n]/g, " ").replace(/>\s+</g, "><");
  }
  i.sanitize = s;
  function r(c, u = { ns: Bt.svg }) {
    const h = document.createDocumentFragment(), d = {}, f = {}, g = [
      {
        markup: Array.isArray(c) ? c : [c],
        parent: h,
        ns: u.ns
      }
    ];
    for (; g.length > 0; ) {
      const p = g.pop();
      let m = p.ns || Bt.svg;
      const y = p.markup, v = p.parent;
      y.forEach((b) => {
        const w = b.tagName;
        if (!w)
          throw new TypeError("Invalid tagName");
        b.ns && (m = b.ns);
        const E = m ? Ro(w, m) : Ya(w), S = b.attrs;
        S && nt(E, Vi(S));
        const C = b.style;
        C && $t(E, C);
        const P = b.className;
        P != null && E.setAttribute("class", Array.isArray(P) ? P.join(" ") : P), b.textContent && (E.textContent = b.textContent);
        const O = b.selector;
        if (O != null) {
          if (f[O])
            throw new TypeError("Selector must be unique");
          f[O] = E;
        }
        if (b.groupSelector) {
          let T = b.groupSelector;
          Array.isArray(T) || (T = [T]), T.forEach((k) => {
            d[k] || (d[k] = []), d[k].push(E);
          });
        }
        v.appendChild(E);
        const I = b.children;
        Array.isArray(I) && g.push({ ns: m, markup: I, parent: E });
      });
    }
    return Object.keys(d).forEach((p) => {
      if (f[p])
        throw new Error("Ambiguous group selector");
      f[p] = d[p];
    }), { fragment: h, selectors: f, groups: d };
  }
  i.parseJSONMarkup = r;
  function o(c) {
    return c instanceof SVGElement ? Se("g") : Ya("div");
  }
  function a(c) {
    if (e(c)) {
      const f = G.createVectors(c), g = f.length;
      if (g === 1)
        return {
          elem: f[0].node
        };
      if (g > 1) {
        const p = o(f[0].node);
        return f.forEach((m) => {
          p.appendChild(m.node);
        }), { elem: p };
      }
      return {};
    }
    const u = r(c), h = u.fragment;
    let d = null;
    return h.childNodes.length > 1 ? (d = o(h.firstChild), d.appendChild(h)) : d = h.firstChild, { elem: d, selectors: u.selectors };
  }
  i.renderMarkup = a;
  function l(c) {
    const u = G.createVectors(c), h = document.createDocumentFragment();
    for (let d = 0, f = u.length; d < f; d += 1) {
      const g = u[d].node;
      h.appendChild(g);
    }
    return { fragment: h, selectors: {} };
  }
  i.parseLabelStringMarkup = l;
})(mt || (mt = {}));
(function(i) {
  function t(e, n, s) {
    if (e != null) {
      let r;
      const o = e.tagName.toLowerCase();
      if (e === n)
        return typeof s == "string" ? r = `> ${o} > ${s}` : r = `> ${o}`, r;
      const a = e.parentNode;
      if (a && a.childNodes.length > 1) {
        const l = Do(e) + 1;
        r = `${o}:nth-child(${l})`;
      } else
        r = o;
      return s && (r += ` > ${s}`), t(e.parentNode, n, r);
    }
    return s;
  }
  i.getSelector = t;
})(mt || (mt = {}));
(function(i) {
  function t() {
    return "g";
  }
  i.getPortContainerMarkup = t;
  function e() {
    return {
      tagName: "circle",
      selector: "circle",
      attrs: {
        r: 10,
        fill: "#FFFFFF",
        stroke: "#000000"
      }
    };
  }
  i.getPortMarkup = e;
  function n() {
    return {
      tagName: "text",
      selector: "text",
      attrs: {
        fill: "#000000"
      }
    };
  }
  i.getPortLabelMarkup = n;
})(mt || (mt = {}));
(function(i) {
  function t() {
    return [
      {
        tagName: "path",
        selector: "wrap",
        groupSelector: "lines",
        attrs: {
          fill: "none",
          cursor: "pointer",
          stroke: "transparent",
          strokeLinecap: "round"
        }
      },
      {
        tagName: "path",
        selector: "line",
        groupSelector: "lines",
        attrs: {
          fill: "none",
          pointerEvents: "none"
        }
      }
    ];
  }
  i.getEdgeMarkup = t;
})(mt || (mt = {}));
(function(i) {
  function t(e = !1) {
    return {
      tagName: "foreignObject",
      selector: "fo",
      children: [
        {
          ns: Bt.xhtml,
          tagName: "body",
          selector: "foBody",
          attrs: {
            xmlns: Bt.xhtml
          },
          style: {
            width: "100%",
            height: "100%",
            background: "transparent"
          },
          children: e ? [] : [
            {
              tagName: "div",
              selector: "foContent",
              style: {
                width: "100%",
                height: "100%"
              }
            }
          ]
        }
      ]
    };
  }
  i.getForeignObjectMarkup = t;
})(mt || (mt = {}));
class oh {
  constructor(t) {
    this.view = t;
  }
  get cell() {
    return this.view.cell;
  }
  getDefinition(t) {
    return this.cell.getAttrDefinition(t);
  }
  processAttrs(t, e) {
    let n, s, r, o;
    const a = [];
    return Object.keys(e).forEach((l) => {
      const c = e[l], u = this.getDefinition(l), h = z(je.isValidDefinition, this.view, u, c, {
        elem: t,
        attrs: e,
        cell: this.cell,
        view: this.view
      });
      if (u && h)
        typeof u == "string" ? (n == null && (n = {}), n[u] = c) : c !== null && a.push({ name: l, definition: u });
      else {
        n == null && (n = {});
        const d = yu.includes(l) ? l : Qc(l);
        n[d] = c;
      }
    }), a.forEach(({ name: l, definition: c }) => {
      const u = e[l];
      typeof c.set == "function" && (s == null && (s = {}), s[l] = u), typeof c.offset == "function" && (r == null && (r = {}), r[l] = u), typeof c.position == "function" && (o == null && (o = {}), o[l] = u);
    }), {
      raw: e,
      normal: n,
      set: s,
      offset: r,
      position: o
    };
  }
  mergeProcessedAttrs(t, e) {
    t.set = Object.assign(Object.assign({}, t.set), e.set), t.position = Object.assign(Object.assign({}, t.position), e.position), t.offset = Object.assign(Object.assign({}, t.offset), e.offset);
    const n = t.normal && t.normal.transform;
    n != null && e.normal && (e.normal.transform = n), t.normal = e.normal;
  }
  findAttrs(t, e, n, s) {
    const r = [], o = new io();
    return Object.keys(t).forEach((a) => {
      const l = t[a];
      if (!ke(l))
        return;
      const { isCSSSelector: c, elems: u } = rt.find(a, e, s);
      n[a] = u;
      for (let h = 0, d = u.length; h < d; h += 1) {
        const f = u[h], g = s && s[a] === f, p = o.get(f);
        if (p) {
          p.array || (r.push(f), p.array = !0, p.attrs = [p.attrs], p.priority = [p.priority]);
          const m = p.attrs, y = p.priority;
          if (g)
            m.unshift(l), y.unshift(-1);
          else {
            const v = Tv(y, c ? -1 : d);
            m.splice(v, 0, l), y.splice(v, 0, d);
          }
        } else
          o.set(f, {
            elem: f,
            attrs: l,
            priority: g ? -1 : d,
            array: !1
          });
      }
    }), r.forEach((a) => {
      const l = o.get(a), c = l.attrs;
      l.attrs = c.reduceRight((u, h) => kt(u, h), {});
    }), o;
  }
  updateRelativeAttrs(t, e, n) {
    const s = e.raw || {};
    let r = e.normal || {};
    const o = e.set, a = e.position, l = e.offset, c = () => ({
      elem: t,
      cell: this.cell,
      view: this.view,
      attrs: s,
      refBBox: n.clone()
    });
    if (o != null && Object.keys(o).forEach((m) => {
      const y = o[m], v = this.getDefinition(m);
      if (v != null) {
        const b = z(v.set, this.view, y, c());
        typeof b == "object" ? r = Object.assign(Object.assign({}, r), b) : b != null && (r[m] = b);
      }
    }), t instanceof HTMLElement) {
      this.view.setAttrs(r, t);
      return;
    }
    const u = r.transform, h = u ? `${u}` : null, d = Fi(h), f = new x(d.e, d.f);
    u && (delete r.transform, d.e = 0, d.f = 0);
    let g = !1;
    a != null && Object.keys(a).forEach((m) => {
      const y = a[m], v = this.getDefinition(m);
      if (v != null) {
        const b = z(v.position, this.view, y, c());
        b != null && (g = !0, f.translate(x.create(b)));
      }
    }), this.view.setAttrs(r, t);
    let p = !1;
    if (l != null) {
      const m = this.view.getBoundingRectOfElement(t);
      if (m.width > 0 && m.height > 0) {
        const y = lt.transformRectangle(m, d);
        Object.keys(l).forEach((v) => {
          const b = l[v], w = this.getDefinition(v);
          if (w != null) {
            const E = z(w.offset, this.view, b, {
              elem: t,
              cell: this.cell,
              view: this.view,
              attrs: s,
              refBBox: y
            });
            E != null && (p = !0, f.translate(x.create(E)));
          }
        });
      }
    }
    (u != null || g || p) && (f.round(1), d.e = Number.isFinite(f.x) ? f.x : 0, d.f = Number.isFinite(f.y) ? f.y : 0, t.setAttribute("transform", fi(d)));
  }
  update(t, e, n) {
    const s = {}, r = this.findAttrs(n.attrs || e, t, s, n.selectors), o = n.attrs ? this.findAttrs(e, t, s, n.selectors) : r, a = [];
    r.each((u) => {
      const h = u.elem, d = u.attrs, f = this.processAttrs(h, d);
      if (f.set == null && f.position == null && f.offset == null)
        this.view.setAttrs(f.normal, h);
      else {
        const g = o.get(h), p = g ? g.attrs : null, m = p && d.ref == null ? p.ref : d.ref;
        let y;
        if (m) {
          if (y = (s[m] || this.view.find(m, t, n.selectors))[0], !y)
            throw new Error(`"${m}" reference does not exist.`);
        } else
          y = null;
        const v = {
          node: h,
          refNode: y,
          attributes: p,
          processedAttributes: f
        }, b = a.findIndex((w) => w.refNode === h);
        b > -1 ? a.splice(b, 0, v) : a.push(v);
      }
    });
    const l = new io();
    let c;
    a.forEach((u) => {
      const h = u.node, d = u.refNode;
      let f;
      const g = d != null && n.rotatableNode != null && _o(n.rotatableNode, d);
      if (d && (f = l.get(d)), !f) {
        const y = g ? n.rotatableNode : t;
        f = d ? lt.getBBox(d, { target: y }) : n.rootBBox, d && l.set(d, f);
      }
      let p;
      n.attrs && u.attributes ? (p = this.processAttrs(h, u.attributes), this.mergeProcessedAttrs(p, u.processedAttributes)) : p = u.processedAttributes;
      let m = f;
      g && n.rotatableNode != null && !n.rotatableNode.contains(h) && (c || (c = Fi(nt(n.rotatableNode, "transform"))), m = lt.transformRectangle(f, c)), this.updateRelativeAttrs(h, p, m);
    });
  }
}
class ah {
  get cell() {
    return this.view.cell;
  }
  constructor(t, e, n = []) {
    this.view = t;
    const s = {}, r = {};
    let o = 0;
    Object.keys(e).forEach((l) => {
      let c = e[l];
      Array.isArray(c) || (c = [c]), c.forEach((u) => {
        let h = s[u];
        h || (o += 1, h = s[u] = 1 << o), r[l] |= h;
      });
    });
    let a = n;
    if (Array.isArray(a) || (a = [a]), a.forEach((l) => {
      s[l] || (o += 1, s[l] = 1 << o);
    }), o > 25)
      throw new Error("Maximum number of flags exceeded.");
    this.flags = s, this.attrs = r, this.bootstrap = n;
  }
  getFlag(t) {
    const e = this.flags;
    return e == null ? 0 : Array.isArray(t) ? t.reduce((n, s) => n | e[s], 0) : e[t] | 0;
  }
  hasAction(t, e) {
    return t & this.getFlag(e);
  }
  removeAction(t, e) {
    return t ^ t & this.getFlag(e);
  }
  getBootstrapFlag() {
    return this.getFlag(this.bootstrap);
  }
  getChangedFlag() {
    let t = 0;
    return this.attrs && Object.keys(this.attrs).forEach((e) => {
      this.cell.hasChanged(e) && (t |= this.attrs[e]);
    }), t;
  }
}
var Xx = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
}, Yx = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
};
class Tt extends rt {
  static getDefaults() {
    return this.defaults;
  }
  static config(t) {
    this.defaults = this.getOptions(t);
  }
  static getOptions(t) {
    const e = (c, u) => u != null ? Jc([
      ...Array.isArray(c) ? c : [c],
      ...Array.isArray(u) ? u : [u]
    ]) : Array.isArray(c) ? [...c] : [c], n = pt(this.getDefaults()), { bootstrap: s, actions: r, events: o, documentEvents: a } = t, l = Yx(t, ["bootstrap", "actions", "events", "documentEvents"]);
    return s && (n.bootstrap = e(n.bootstrap, s)), r && Object.entries(r).forEach(([c, u]) => {
      const h = n.actions[c];
      u && h ? n.actions[c] = e(h, u) : u && (n.actions[c] = e(u));
    }), o && (n.events = Object.assign(Object.assign({}, n.events), o)), t.documentEvents && (n.documentEvents = Object.assign(Object.assign({}, n.documentEvents), a)), kt(n, l);
  }
  get [Symbol.toStringTag]() {
    return Tt.toStringTag;
  }
  constructor(t, e = {}) {
    super(), this.cell = t, this.options = this.ensureOptions(e), this.graph = this.options.graph, this.attr = new oh(this), this.flag = new ah(this, this.options.actions, this.options.bootstrap), this.cache = new Wx(this), this.setContainer(this.ensureContainer()), this.setup(), this.init();
  }
  init() {
  }
  onRemove() {
    this.removeTools();
  }
  get priority() {
    return this.options.priority;
  }
  get rootSelector() {
    return this.options.rootSelector;
  }
  getConstructor() {
    return this.constructor;
  }
  ensureOptions(t) {
    return this.getConstructor().getOptions(t);
  }
  getContainerTagName() {
    return this.options.isSvgElement ? "g" : "div";
  }
  getContainerStyle() {
  }
  getContainerAttrs() {
    return {
      "data-cell-id": this.cell.id,
      "data-shape": this.cell.shape
    };
  }
  getContainerClassName() {
    return this.prefixClassName("cell");
  }
  ensureContainer() {
    return rt.createElement(this.getContainerTagName(), this.options.isSvgElement);
  }
  setContainer(t) {
    if (this.container !== t) {
      this.undelegateEvents(), this.container = t, this.options.events != null && this.delegateEvents(this.options.events);
      const e = this.getContainerAttrs();
      e != null && this.setAttrs(e, t);
      const n = this.getContainerStyle();
      n != null && this.setStyle(n, t);
      const s = this.getContainerClassName();
      s != null && this.addClass(s, t);
    }
    return this;
  }
  isNodeView() {
    return !1;
  }
  isEdgeView() {
    return !1;
  }
  render() {
    return this;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  confirmUpdate(t, e = {}) {
    return 0;
  }
  getBootstrapFlag() {
    return this.flag.getBootstrapFlag();
  }
  getFlag(t) {
    return this.flag.getFlag(t);
  }
  hasAction(t, e) {
    return this.flag.hasAction(t, e);
  }
  removeAction(t, e) {
    return this.flag.removeAction(t, e);
  }
  handleAction(t, e, n, s) {
    if (this.hasAction(t, e)) {
      n();
      const r = [e];
      return s && (typeof s == "string" ? r.push(s) : r.push(...s)), this.removeAction(t, r);
    }
    return t;
  }
  setup() {
    this.cell.on("changed", this.onCellChanged, this);
  }
  onCellChanged({ options: t }) {
    this.onAttrsChange(t);
  }
  onAttrsChange(t) {
    let e = this.flag.getChangedFlag();
    t.updated || !e || (t.dirty && this.hasAction(e, "update") && (e |= this.getFlag("render")), t.toolId && (t.async = !1), this.graph != null && this.graph.renderer.requestViewUpdate(this, e, t));
  }
  parseJSONMarkup(t, e) {
    const n = mt.parseJSONMarkup(t), s = n.selectors, r = this.rootSelector;
    if (e && r) {
      if (s[r])
        throw new Error("Invalid root selector");
      s[r] = e;
    }
    return n;
  }
  can(t) {
    let e = this.graph.options.interacting;
    if (typeof e == "function" && (e = z(e, this.graph, this)), typeof e == "object") {
      let n = e[t];
      return typeof n == "function" && (n = z(n, this.graph, this)), n !== !1;
    }
    return typeof e == "boolean" ? e : !1;
  }
  cleanCache() {
    return this.cache.clean(), this;
  }
  getCache(t) {
    return this.cache.get(t);
  }
  getDataOfElement(t) {
    return this.cache.getData(t);
  }
  getMatrixOfElement(t) {
    return this.cache.getMatrix(t);
  }
  getShapeOfElement(t) {
    return this.cache.getShape(t);
  }
  getBoundingRectOfElement(t) {
    return this.cache.getBoundingRect(t);
  }
  getBBoxOfElement(t) {
    const e = this.getBoundingRectOfElement(t), n = this.getMatrixOfElement(t), s = this.getRootRotatedMatrix(), r = this.getRootTranslatedMatrix();
    return lt.transformRectangle(e, r.multiply(s).multiply(n));
  }
  getUnrotatedBBoxOfElement(t) {
    const e = this.getBoundingRectOfElement(t), n = this.getMatrixOfElement(t), s = this.getRootTranslatedMatrix();
    return lt.transformRectangle(e, s.multiply(n));
  }
  getBBox(t = {}) {
    let e;
    if (t.useCellGeometry) {
      const n = this.cell, s = n.isNode() ? n.getAngle() : 0;
      e = n.getBBox().bbox(s);
    } else
      e = this.getBBoxOfElement(this.container);
    return this.graph.coord.localToGraphRect(e);
  }
  getRootTranslatedMatrix() {
    const t = this.cell, e = t.isNode() ? t.getPosition() : { x: 0, y: 0 };
    return Vt().translate(e.x, e.y);
  }
  getRootRotatedMatrix() {
    let t = Vt();
    const e = this.cell, n = e.isNode() ? e.getAngle() : 0;
    if (n) {
      const s = e.getBBox(), r = s.width / 2, o = s.height / 2;
      t = t.translate(r, o).rotate(n).translate(-r, -o);
    }
    return t;
  }
  findMagnet(t = this.container) {
    return this.findByAttr("magnet", t);
  }
  updateAttrs(t, e, n = {}) {
    n.rootBBox == null && (n.rootBBox = new R()), n.selectors == null && (n.selectors = this.selectors), this.attr.update(t, e, n);
  }
  isEdgeElement(t) {
    return this.cell.isEdge() && (t == null || t === this.container);
  }
  // #region highlight
  prepareHighlight(t, e = {}) {
    const n = t || this.container;
    return e.partial = n === this.container, n;
  }
  highlight(t, e = {}) {
    const n = this.prepareHighlight(t, e);
    return this.notify("cell:highlight", {
      magnet: n,
      options: e,
      view: this,
      cell: this.cell
    }), this.isEdgeView() ? this.notify("edge:highlight", {
      magnet: n,
      options: e,
      view: this,
      edge: this.cell,
      cell: this.cell
    }) : this.isNodeView() && this.notify("node:highlight", {
      magnet: n,
      options: e,
      view: this,
      node: this.cell,
      cell: this.cell
    }), this;
  }
  unhighlight(t, e = {}) {
    const n = this.prepareHighlight(t, e);
    return this.notify("cell:unhighlight", {
      magnet: n,
      options: e,
      view: this,
      cell: this.cell
    }), this.isNodeView() ? this.notify("node:unhighlight", {
      magnet: n,
      options: e,
      view: this,
      node: this.cell,
      cell: this.cell
    }) : this.isEdgeView() && this.notify("edge:unhighlight", {
      magnet: n,
      options: e,
      view: this,
      edge: this.cell,
      cell: this.cell
    }), this;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  notifyUnhighlight(t, e) {
  }
  // #endregion
  getEdgeTerminal(t, e, n, s, r) {
    const o = this.cell, a = this.findAttr("port", t), l = t.getAttribute("data-selector"), c = { cell: o.id };
    return l != null && (c.magnet = l), a != null ? (c.port = a, o.isNode() && !o.hasPort(a) && l == null && (c.selector = this.getSelector(t))) : l == null && this.container !== t && (c.selector = this.getSelector(t)), c;
  }
  getMagnetFromEdgeTerminal(t) {
    const e = this.cell, n = this.container, s = t.port;
    let r = t.magnet, o;
    return s != null && e.isNode() && e.hasPort(s) ? o = this.findPortElem(s, r) || n : (r || (r = t.selector), !r && s != null && (r = `[port="${s}"]`), o = this.findOne(r, n, this.selectors)), o;
  }
  hasTools(t) {
    const e = this.tools;
    return e == null ? !1 : t == null ? !0 : e.name === t;
  }
  addTools(t) {
    if (this.removeTools(), t) {
      if (!this.can("toolsAddable"))
        return this;
      const e = Rt.isToolsView(t) ? t : new Rt(t);
      this.tools = e, e.config({ view: this }), e.mount();
    }
    return this;
  }
  updateTools(t = {}) {
    return this.tools && this.tools.update(t), this;
  }
  removeTools() {
    return this.tools && (this.tools.remove(), this.tools = null), this;
  }
  hideTools() {
    return this.tools && this.tools.hide(), this;
  }
  showTools() {
    return this.tools && this.tools.show(), this;
  }
  renderTools() {
    const t = this.cell.getTools();
    return this.addTools(t), this;
  }
  notify(t, e) {
    return this.trigger(t, e), this.graph.trigger(t, e), this;
  }
  getEventArgs(t, e, n) {
    const s = this, r = s.cell;
    return e == null || n == null ? { e: t, view: s, cell: r } : { e: t, x: e, y: n, view: s, cell: r };
  }
  onClick(t, e, n) {
    this.notify("cell:click", this.getEventArgs(t, e, n));
  }
  onDblClick(t, e, n) {
    this.notify("cell:dblclick", this.getEventArgs(t, e, n));
  }
  onContextMenu(t, e, n) {
    this.notify("cell:contextmenu", this.getEventArgs(t, e, n));
  }
  onMouseDown(t, e, n) {
    this.cell.model && (this.cachedModelForMouseEvent = this.cell.model, this.cachedModelForMouseEvent.startBatch("mouse")), this.notify("cell:mousedown", this.getEventArgs(t, e, n));
  }
  onMouseUp(t, e, n) {
    this.notify("cell:mouseup", this.getEventArgs(t, e, n)), this.cachedModelForMouseEvent && (this.cachedModelForMouseEvent.stopBatch("mouse", { cell: this.cell }), this.cachedModelForMouseEvent = null);
  }
  onMouseMove(t, e, n) {
    this.notify("cell:mousemove", this.getEventArgs(t, e, n));
  }
  onMouseOver(t) {
    this.notify("cell:mouseover", this.getEventArgs(t));
  }
  onMouseOut(t) {
    this.notify("cell:mouseout", this.getEventArgs(t));
  }
  onMouseEnter(t) {
    this.notify("cell:mouseenter", this.getEventArgs(t));
  }
  onMouseLeave(t) {
    this.notify("cell:mouseleave", this.getEventArgs(t));
  }
  onMouseWheel(t, e, n, s) {
    this.notify("cell:mousewheel", Object.assign({ delta: s }, this.getEventArgs(t, e, n)));
  }
  onCustomEvent(t, e, n, s) {
    this.notify("cell:customevent", Object.assign({ name: e }, this.getEventArgs(t, n, s))), this.notify(e, Object.assign({}, this.getEventArgs(t, n, s)));
  }
  onMagnetMouseDown(t, e, n, s) {
  }
  onMagnetDblClick(t, e, n, s) {
  }
  onMagnetContextMenu(t, e, n, s) {
  }
  onLabelMouseDown(t, e, n) {
  }
  checkMouseleave(t) {
    const e = this.getEventTarget(t, { fromPoint: !0 }), n = this.graph.findViewByElem(e);
    n !== this && (this.onMouseLeave(t), n && n.onMouseEnter(t));
  }
  dispose() {
    this.cell.off("changed", this.onCellChanged, this);
  }
}
Tt.defaults = {
  isSvgElement: !0,
  rootSelector: "root",
  priority: 0,
  bootstrap: [],
  actions: {}
};
Xx([
  Tt.dispose()
], Tt.prototype, "dispose", null);
(function(i) {
  i.Flag = ah, i.Attr = oh;
})(Tt || (Tt = {}));
(function(i) {
  i.toStringTag = `X6.${i.name}`;
  function t(e) {
    if (e == null)
      return !1;
    if (e instanceof i)
      return !0;
    const n = e[Symbol.toStringTag], s = e;
    return (n == null || n === i.toStringTag) && typeof s.isNodeView == "function" && typeof s.isEdgeView == "function" && typeof s.confirmUpdate == "function";
  }
  i.isCellView = t;
})(Tt || (Tt = {}));
(function(i) {
  function t(n) {
    return function(s) {
      s.config({ priority: n });
    };
  }
  i.priority = t;
  function e(n) {
    return function(s) {
      s.config({ bootstrap: n });
    };
  }
  i.bootstrap = e;
})(Tt || (Tt = {}));
(function(i) {
  i.registry = It.create({
    type: "view"
  });
})(Tt || (Tt = {}));
class Rt extends rt {
  get name() {
    return this.options.name;
  }
  get graph() {
    return this.cellView.graph;
  }
  get cell() {
    return this.cellView.cell;
  }
  get [Symbol.toStringTag]() {
    return Rt.toStringTag;
  }
  constructor(t = {}) {
    super(), this.svgContainer = this.createContainer(!0, t), this.htmlContainer = this.createContainer(!1, t), this.config(t);
  }
  createContainer(t, e) {
    const n = t ? rt.createElement("g", !0) : rt.createElement("div", !1);
    return U(n, this.prefixClassName("cell-tools")), e.className && U(n, e.className), n;
  }
  config(t) {
    if (this.options = Object.assign(Object.assign({}, this.options), t), !Tt.isCellView(t.view) || t.view === this.cellView)
      return this;
    this.cellView = t.view, this.cell.isEdge() ? (U(this.svgContainer, this.prefixClassName("edge-tools")), U(this.htmlContainer, this.prefixClassName("edge-tools"))) : this.cell.isNode() && (U(this.svgContainer, this.prefixClassName("node-tools")), U(this.htmlContainer, this.prefixClassName("node-tools"))), this.svgContainer.setAttribute("data-cell-id", this.cell.id), this.htmlContainer.setAttribute("data-cell-id", this.cell.id), this.name && (this.svgContainer.setAttribute("data-tools-name", this.name), this.htmlContainer.setAttribute("data-tools-name", this.name));
    const e = this.options.items;
    if (!Array.isArray(e))
      return this;
    this.tools = [];
    const n = [];
    e.forEach((s) => {
      Rt.ToolItem.isToolItem(s) ? s.name === "vertices" ? n.unshift(s) : n.push(s) : (typeof s == "object" ? s.name : s) === "vertices" ? n.unshift(s) : n.push(s);
    });
    for (let s = 0; s < n.length; s += 1) {
      const r = n[s];
      let o;
      if (Rt.ToolItem.isToolItem(r))
        o = r;
      else {
        const a = typeof r == "object" ? r.name : r, l = typeof r == "object" ? r.args || {} : {};
        if (a) {
          if (this.cell.isNode()) {
            const c = Yn.registry.get(a);
            if (c)
              o = new c(l);
            else
              return Yn.registry.onNotFound(a);
          } else if (this.cell.isEdge()) {
            const c = Jn.registry.get(a);
            if (c)
              o = new c(l);
            else
              return Jn.registry.onNotFound(a);
          }
        }
      }
      o && (o.config(this.cellView, this), o.render(), (o.options.isSVGElement !== !1 ? this.svgContainer : this.htmlContainer).appendChild(o.container), this.tools.push(o));
    }
    return this;
  }
  update(t = {}) {
    const e = this.tools;
    return e && e.forEach((n) => {
      t.toolId !== n.cid && n.isVisible() && n.update();
    }), this;
  }
  focus(t) {
    const e = this.tools;
    return e && e.forEach((n) => {
      t === n ? n.show() : n.hide();
    }), this;
  }
  blur(t) {
    const e = this.tools;
    return e && e.forEach((n) => {
      n !== t && !n.isVisible() && (n.show(), n.update());
    }), this;
  }
  hide() {
    return this.focus(null);
  }
  show() {
    return this.blur(null);
  }
  remove() {
    const t = this.tools;
    return t && (t.forEach((e) => e.remove()), this.tools = null), Te(this.svgContainer), Te(this.htmlContainer), super.remove();
  }
  mount() {
    const t = this.tools, e = this.cellView;
    if (e && t) {
      const n = t.some((r) => r.options.isSVGElement !== !1), s = t.some((r) => r.options.isSVGElement === !1);
      n && (this.options.local ? e.container : e.graph.view.decorator).appendChild(this.svgContainer), s && this.graph.container.appendChild(this.htmlContainer);
    }
    return this;
  }
}
(function(i) {
  i.toStringTag = `X6.${i.name}`;
  function t(e) {
    if (e == null)
      return !1;
    if (e instanceof i)
      return !0;
    const n = e[Symbol.toStringTag], s = e;
    return (n == null || n === i.toStringTag) && s.graph != null && s.cell != null && typeof s.config == "function" && typeof s.update == "function" && typeof s.focus == "function" && typeof s.blur == "function" && typeof s.show == "function" && typeof s.hide == "function";
  }
  i.isToolsView = t;
})(Rt || (Rt = {}));
(function(i) {
  class t extends rt {
    static getDefaults() {
      return this.defaults;
    }
    static config(n) {
      this.defaults = this.getOptions(n);
    }
    static getOptions(n) {
      return kt(pt(this.getDefaults()), n);
    }
    get graph() {
      return this.cellView.graph;
    }
    get cell() {
      return this.cellView.cell;
    }
    get name() {
      return this.options.name;
    }
    get [Symbol.toStringTag]() {
      return t.toStringTag;
    }
    constructor(n = {}) {
      super(), this.visible = !0, this.options = this.getOptions(n), this.container = rt.createElement(this.options.tagName || "g", this.options.isSVGElement !== !1), U(this.container, this.prefixClassName("cell-tool")), typeof this.options.className == "string" && U(this.container, this.options.className), this.init();
    }
    init() {
    }
    getOptions(n) {
      return this.constructor.getOptions(n);
    }
    delegateEvents() {
      return this.options.events && super.delegateEvents(this.options.events), this;
    }
    config(n, s) {
      return this.cellView = n, this.parent = s, this.stamp(this.container), this.cell.isEdge() ? U(this.container, this.prefixClassName("edge-tool")) : this.cell.isNode() && U(this.container, this.prefixClassName("node-tool")), this.name && this.container.setAttribute("data-tool-name", this.name), this.delegateEvents(), this;
    }
    render() {
      this.empty();
      const n = this.options.markup;
      if (n) {
        const s = mt.parseJSONMarkup(n);
        this.container.appendChild(s.fragment), this.childNodes = s.selectors;
      }
      return this.onRender(), this;
    }
    onRender() {
    }
    update() {
      return this;
    }
    stamp(n) {
      n && n.setAttribute("data-cell-id", this.cellView.cell.id);
    }
    show() {
      return this.container.style.display = "", this.visible = !0, this;
    }
    hide() {
      return this.container.style.display = "none", this.visible = !1, this;
    }
    isVisible() {
      return this.visible;
    }
    focus() {
      const n = this.options.focusOpacity;
      return n != null && Number.isFinite(n) && (this.container.style.opacity = `${n}`), this.parent.focus(this), this;
    }
    blur() {
      return this.container.style.opacity = "", this.parent.blur(this), this;
    }
    guard(n) {
      return this.graph == null || this.cellView == null ? !0 : this.graph.view.guard(n, this.cellView);
    }
  }
  t.defaults = {
    isSVGElement: !0,
    tagName: "g"
  }, i.ToolItem = t, function(e) {
    let n = 0;
    function s(o) {
      return o ? No(o) : (n += 1, `CustomTool${n}`);
    }
    function r(o) {
      const a = Mo(s(o.name), this);
      return a.config(o), a;
    }
    e.define = r;
  }(t = i.ToolItem || (i.ToolItem = {})), function(e) {
    e.toStringTag = `X6.${e.name}`;
    function n(s) {
      if (s == null)
        return !1;
      if (s instanceof e)
        return !0;
      const r = s[Symbol.toStringTag], o = s;
      return (r == null || r === e.toStringTag) && o.graph != null && o.cell != null && typeof o.config == "function" && typeof o.update == "function" && typeof o.focus == "function" && typeof o.blur == "function" && typeof o.show == "function" && typeof o.hide == "function" && typeof o.isVisible == "function";
    }
    e.isToolItem = n;
  }(t = i.ToolItem || (i.ToolItem = {}));
})(Rt || (Rt = {}));
const Jx = (i) => i;
function al(i, t) {
  return t === 0 ? "0%" : `${Math.round(i / t * 100)}%`;
}
function lh(i) {
  return (e, n, s, r) => n.isEdgeElement(s) ? Zx(i, e, n, s, r) : Kx(i, e, n, s, r);
}
function Kx(i, t, e, n, s) {
  const r = e.cell, o = r.getAngle(), a = e.getUnrotatedBBoxOfElement(n), l = r.getBBox().getCenter(), c = x.create(s).rotate(o, l);
  let u = c.x - a.x, h = c.y - a.y;
  return i && (u = al(u, a.width), h = al(h, a.height)), t.anchor = {
    name: "topLeft",
    args: {
      dx: u,
      dy: h,
      rotate: !0
    }
  }, t;
}
function Zx(i, t, e, n, s) {
  const r = e.getConnection();
  if (!r)
    return t;
  const o = r.closestPointLength(s);
  if (i) {
    const a = r.length();
    t.anchor = {
      name: "ratio",
      args: {
        ratio: o / a
      }
    };
  } else
    t.anchor = {
      name: "length",
      args: {
        length: o
      }
    };
  return t;
}
const Qx = lh(!0), t1 = lh(!1), e1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  noop: Jx,
  pinAbsolute: t1,
  pinRelative: Qx
}, Symbol.toStringTag, { value: "Module" }));
var oo;
(function(i) {
  i.presets = e1, i.registry = It.create({
    type: "connection strategy"
  }), i.registry.register(i.presets, !0);
})(oo || (oo = {}));
function ch(i, t, e, n) {
  return z(oo.presets.pinRelative, this.graph, {}, t, e, i, this.cell, n, {}).anchor;
}
function uh(i, t) {
  return t ? i.cell.getBBox() : i.cell.isEdge() ? i.getConnection().bbox() : i.getUnrotatedBBoxOfElement(i.container);
}
class an extends Rt.ToolItem {
  onRender() {
    U(this.container, this.prefixClassName("cell-tool-button")), this.update();
  }
  update() {
    return this.updatePosition(), this;
  }
  updatePosition() {
    const e = this.cellView.cell.isEdge() ? this.getEdgeMatrix() : this.getNodeMatrix();
    Gn(this.container, e, { absolute: !0 });
  }
  getNodeMatrix() {
    const t = this.cellView, e = this.options;
    let { x: n = 0, y: s = 0 } = e;
    const { offset: r, useCellGeometry: o, rotate: a } = e;
    let l = uh(t, o);
    const c = t.cell.getAngle();
    a || (l = l.bbox(c));
    let u = 0, h = 0;
    typeof r == "number" ? (u = r, h = r) : typeof r == "object" && (u = r.x, h = r.y), n = ve(n, l.width), s = ve(s, l.height);
    let d = Vt().translate(l.x + l.width / 2, l.y + l.height / 2);
    return a && (d = d.rotate(c)), d = d.translate(n + u - l.width / 2, s + h - l.height / 2), d;
  }
  getEdgeMatrix() {
    const t = this.cellView, e = this.options, { offset: n = 0, distance: s = 0, rotate: r } = e;
    let o, a, l;
    const c = ve(s, 1);
    c >= 0 && c <= 1 ? o = t.getTangentAtRatio(c) : o = t.getTangentAtLength(c), o ? (a = o.start, l = o.vector().vectorAngle(new x(1, 0)) || 0) : (a = t.getConnection().start, l = 0);
    let u = Vt().translate(a.x, a.y).rotate(l);
    return typeof n == "object" ? u = u.translate(n.x || 0, n.y || 0) : u = u.translate(0, n), r || (u = u.rotate(-l)), u;
  }
  onMouseDown(t) {
    if (this.guard(t))
      return;
    t.stopPropagation(), t.preventDefault();
    const e = this.options.onClick;
    typeof e == "function" && z(e, this.cellView, {
      e: t,
      view: this.cellView,
      cell: this.cellView.cell,
      btn: this
    });
  }
}
(function(i) {
  i.config({
    name: "button",
    useCellGeometry: !0,
    events: {
      mousedown: "onMouseDown",
      touchstart: "onMouseDown"
    }
  });
})(an || (an = {}));
(function(i) {
  i.Remove = i.define({
    name: "button-remove",
    markup: [
      {
        tagName: "circle",
        selector: "button",
        attrs: {
          r: 7,
          fill: "#FF1D00",
          cursor: "pointer"
        }
      },
      {
        tagName: "path",
        selector: "icon",
        attrs: {
          d: "M -3 -3 3 3 M -3 3 3 -3",
          fill: "none",
          stroke: "#FFFFFF",
          "stroke-width": 2,
          "pointer-events": "none"
        }
      }
    ],
    distance: 60,
    offset: 0,
    useCellGeometry: !0,
    onClick({ view: t, btn: e }) {
      e.parent.remove(), t.cell.remove({ ui: !0, toolId: e.cid });
    }
  });
})(an || (an = {}));
var n1 = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
};
class Is extends Rt.ToolItem {
  onRender() {
    if (U(this.container, this.prefixClassName("cell-tool-boundary")), this.options.attrs) {
      const t = this.options.attrs, { class: e } = t, n = n1(t, ["class"]);
      nt(this.container, Vi(n)), e && U(this.container, e);
    }
    this.update();
  }
  update() {
    const t = this.cellView, e = this.options, { useCellGeometry: n, rotate: s } = e, r = xn(e.padding);
    let o = uh(t, n).moveAndExpand({
      x: -r.left,
      y: -r.top,
      width: r.left + r.right,
      height: r.top + r.bottom
    });
    const a = t.cell;
    if (a.isNode()) {
      const l = a.getAngle();
      if (l)
        if (s) {
          const c = a.getBBox().getCenter();
          Zr(this.container, l, c.x, c.y, {
            absolute: !0
          });
        } else
          o = o.bbox(l);
    }
    return nt(this.container, o.toJSON()), this;
  }
}
(function(i) {
  i.config({
    name: "boundary",
    tagName: "rect",
    padding: 10,
    useCellGeometry: !0,
    attrs: {
      fill: "none",
      stroke: "#333",
      "stroke-width": 0.5,
      "stroke-dasharray": "5, 5",
      "pointer-events": "none"
    }
  });
})(Is || (Is = {}));
class qi extends Rt.ToolItem {
  constructor() {
    super(...arguments), this.handles = [];
  }
  get vertices() {
    return this.cellView.cell.getVertices();
  }
  onRender() {
    return this.addClass(this.prefixClassName("edge-tool-vertices")), this.options.addable && this.updatePath(), this.resetHandles(), this.renderHandles(), this;
  }
  update() {
    return this.vertices.length === this.handles.length ? this.updateHandles() : (this.resetHandles(), this.renderHandles()), this.options.addable && this.updatePath(), this;
  }
  resetHandles() {
    const t = this.handles;
    this.handles = [], t && t.forEach((e) => {
      this.stopHandleListening(e), e.remove();
    });
  }
  renderHandles() {
    const t = this.vertices;
    for (let e = 0, n = t.length; e < n; e += 1) {
      const s = t[e], r = this.options.createHandle, o = this.options.processHandle, a = r({
        index: e,
        graph: this.graph,
        guard: (l) => this.guard(l),
        attrs: this.options.attrs || {}
      });
      o && o(a), a.updatePosition(s.x, s.y), this.stamp(a.container), this.container.appendChild(a.container), this.handles.push(a), this.startHandleListening(a);
    }
  }
  updateHandles() {
    const t = this.vertices;
    for (let e = 0, n = t.length; e < n; e += 1) {
      const s = t[e], r = this.handles[e];
      r && r.updatePosition(s.x, s.y);
    }
  }
  updatePath() {
    const t = this.childNodes.connection;
    t && t.setAttribute("d", this.cellView.getConnectionPathData());
  }
  startHandleListening(t) {
    const e = this.cellView;
    e.can("vertexMovable") && (t.on("change", this.onHandleChange, this), t.on("changing", this.onHandleChanging, this), t.on("changed", this.onHandleChanged, this)), e.can("vertexDeletable") && t.on("remove", this.onHandleRemove, this);
  }
  stopHandleListening(t) {
    const e = this.cellView;
    e.can("vertexMovable") && (t.off("change", this.onHandleChange, this), t.off("changing", this.onHandleChanging, this), t.off("changed", this.onHandleChanged, this)), e.can("vertexDeletable") && t.off("remove", this.onHandleRemove, this);
  }
  getNeighborPoints(t) {
    const e = this.cellView, n = this.vertices, s = t > 0 ? n[t - 1] : e.sourceAnchor, r = t < n.length - 1 ? n[t + 1] : e.targetAnchor;
    return {
      prev: x.create(s),
      next: x.create(r)
    };
  }
  getMouseEventArgs(t) {
    const e = this.normalizeEvent(t), { x: n, y: s } = this.graph.snapToGrid(e.clientX, e.clientY);
    return { e, x: n, y: s };
  }
  onHandleChange({ e: t }) {
    this.focus();
    const e = this.cellView;
    if (e.cell.startBatch("move-vertex", { ui: !0, toolId: this.cid }), !this.options.stopPropagation) {
      const { e: n, x: s, y: r } = this.getMouseEventArgs(t);
      this.eventData(n, { start: { x: s, y: r } }), e.notifyMouseDown(n, s, r);
    }
  }
  onHandleChanging({ handle: t, e }) {
    const n = this.cellView, s = t.options.index, { e: r, x: o, y: a } = this.getMouseEventArgs(e), l = { x: o, y: a };
    this.snapVertex(l, s), n.cell.setVertexAt(s, l, { ui: !0, toolId: this.cid }), t.updatePosition(l.x, l.y), this.options.stopPropagation || n.notifyMouseMove(r, o, a);
  }
  stopBatch(t) {
    this.cell.stopBatch("move-vertex", { ui: !0, toolId: this.cid }), t && this.cell.stopBatch("add-vertex", { ui: !0, toolId: this.cid });
  }
  onHandleChanged({ e: t }) {
    const e = this.options, n = this.cellView;
    if (e.addable && this.updatePath(), !e.removeRedundancies) {
      this.stopBatch(this.eventData(t).vertexAdded);
      return;
    }
    n.removeRedundantLinearVertices({
      ui: !0,
      toolId: this.cid
    }) && this.render(), this.blur(), this.stopBatch(this.eventData(t).vertexAdded);
    const { e: r, x: o, y: a } = this.getMouseEventArgs(t);
    if (!this.options.stopPropagation) {
      n.notifyMouseUp(r, o, a);
      const { start: l } = this.eventData(r);
      if (l) {
        const { x: c, y: u } = l;
        c === o && u === a && n.onClick(r, o, a);
      }
    }
    n.checkMouseleave(r), e.onChanged && e.onChanged({ edge: n.cell, edgeView: n });
  }
  snapVertex(t, e) {
    const n = this.options.snapRadius || 0;
    if (n > 0) {
      const s = this.getNeighborPoints(e), r = s.prev, o = s.next;
      Math.abs(t.x - r.x) < n ? t.x = r.x : Math.abs(t.x - o.x) < n && (t.x = o.x), Math.abs(t.y - r.y) < n ? t.y = s.prev.y : Math.abs(t.y - o.y) < n && (t.y = o.y);
    }
  }
  onHandleRemove({ handle: t, e }) {
    if (this.options.removable) {
      const n = t.options.index, s = this.cellView;
      s.cell.removeVertexAt(n, { ui: !0 }), this.options.addable && this.updatePath(), s.checkMouseleave(this.normalizeEvent(e));
    }
  }
  allowAddVertex(t) {
    const e = this.guard(t), n = this.options.addable && this.cellView.can("vertexAddable"), s = this.options.modifiers ? sn.isMatch(t, this.options.modifiers) : !0;
    return !e && n && s;
  }
  onPathMouseDown(t) {
    const e = this.cellView;
    if (!this.allowAddVertex(t))
      return;
    t.stopPropagation(), t.preventDefault();
    const n = this.normalizeEvent(t), s = this.graph.snapToGrid(n.clientX, n.clientY).toJSON();
    e.cell.startBatch("add-vertex", { ui: !0, toolId: this.cid });
    const r = e.getVertexIndex(s.x, s.y);
    this.snapVertex(s, r), e.cell.insertVertex(s, r, {
      ui: !0,
      toolId: this.cid
    }), this.render();
    const o = this.handles[r];
    this.eventData(n, { vertexAdded: !0 }), o.onMouseDown(n);
  }
  onRemove() {
    this.resetHandles();
  }
}
(function(i) {
  class t extends rt {
    get graph() {
      return this.options.graph;
    }
    constructor(n) {
      super(), this.options = n, this.render(), this.delegateEvents({
        mousedown: "onMouseDown",
        touchstart: "onMouseDown",
        dblclick: "onDoubleClick"
      });
    }
    render() {
      this.container = rt.createElement("circle", !0);
      const n = this.options.attrs;
      if (typeof n == "function") {
        const s = i.getDefaults();
        this.setAttrs(Object.assign(Object.assign({}, s.attrs), n(this)));
      } else
        this.setAttrs(n);
      this.addClass(this.prefixClassName("edge-tool-vertex"));
    }
    updatePosition(n, s) {
      this.setAttrs({ cx: n, cy: s });
    }
    onMouseDown(n) {
      this.options.guard(n) || (n.stopPropagation(), n.preventDefault(), this.graph.view.undelegateEvents(), this.delegateDocumentEvents({
        mousemove: "onMouseMove",
        touchmove: "onMouseMove",
        mouseup: "onMouseUp",
        touchend: "onMouseUp",
        touchcancel: "onMouseUp"
      }, n.data), this.emit("change", { e: n, handle: this }));
    }
    onMouseMove(n) {
      this.emit("changing", { e: n, handle: this });
    }
    onMouseUp(n) {
      this.emit("changed", { e: n, handle: this }), this.undelegateDocumentEvents(), this.graph.view.delegateEvents();
    }
    onDoubleClick(n) {
      this.emit("remove", { e: n, handle: this });
    }
  }
  i.Handle = t;
})(qi || (qi = {}));
(function(i) {
  const t = fe.prefix("edge-tool-vertex-path");
  i.config({
    name: "vertices",
    snapRadius: 20,
    addable: !0,
    removable: !0,
    removeRedundancies: !0,
    stopPropagation: !0,
    attrs: {
      r: 6,
      fill: "#333",
      stroke: "#fff",
      cursor: "move",
      "stroke-width": 2
    },
    createHandle: (e) => new i.Handle(e),
    markup: [
      {
        tagName: "path",
        selector: "connection",
        className: t,
        attrs: {
          fill: "none",
          stroke: "transparent",
          "stroke-width": 10,
          cursor: "pointer"
        }
      }
    ],
    events: {
      [`mousedown .${t}`]: "onPathMouseDown",
      [`touchstart .${t}`]: "onPathMouseDown"
    }
  });
})(qi || (qi = {}));
class Ui extends Rt.ToolItem {
  constructor() {
    super(...arguments), this.handles = [];
  }
  get vertices() {
    return this.cellView.cell.getVertices();
  }
  update() {
    return this.render(), this;
  }
  onRender() {
    U(this.container, this.prefixClassName("edge-tool-segments")), this.resetHandles();
    const t = this.cellView, e = [...this.vertices];
    e.unshift(t.sourcePoint), e.push(t.targetPoint);
    for (let n = 0, s = e.length; n < s - 1; n += 1) {
      const r = e[n], o = e[n + 1], a = this.renderHandle(r, o, n);
      this.stamp(a.container), this.handles.push(a);
    }
    return this;
  }
  renderHandle(t, e, n) {
    const s = this.options.createHandle({
      index: n,
      graph: this.graph,
      guard: (r) => this.guard(r),
      attrs: this.options.attrs || {}
    });
    return this.options.processHandle && this.options.processHandle(s), this.updateHandle(s, t, e), this.container.appendChild(s.container), this.startHandleListening(s), s;
  }
  startHandleListening(t) {
    t.on("change", this.onHandleChange, this), t.on("changing", this.onHandleChanging, this), t.on("changed", this.onHandleChanged, this);
  }
  stopHandleListening(t) {
    t.off("change", this.onHandleChange, this), t.off("changing", this.onHandleChanging, this), t.off("changed", this.onHandleChanged, this);
  }
  resetHandles() {
    const t = this.handles;
    this.handles = [], t && t.forEach((e) => {
      this.stopHandleListening(e), e.remove();
    });
  }
  shiftHandleIndexes(t) {
    const e = this.handles;
    for (let n = 0, s = e.length; n < s; n += 1)
      e[n].options.index += t;
  }
  resetAnchor(t, e) {
    const n = this.cellView.cell, s = {
      ui: !0,
      toolId: this.cid
    };
    e ? n.prop([t, "anchor"], e, s) : n.removeProp([t, "anchor"], s);
  }
  snapHandle(t, e, n) {
    const s = t.options.axis, r = t.options.index, l = this.cellView.cell.getVertices(), c = l[r - 2] || n.sourceAnchor, u = l[r + 1] || n.targetAnchor, h = this.options.snapRadius;
    return Math.abs(e[s] - c[s]) < h ? e[s] = c[s] : Math.abs(e[s] - u[s]) < h && (e[s] = u[s]), e;
  }
  onHandleChanging({ handle: t, e }) {
    const n = this.graph, s = this.options, r = this.cellView, o = s.anchor, a = t.options.axis, l = t.options.index - 1, c = this.getEventData(e), u = this.normalizeEvent(e), h = n.snapToGrid(u.clientX, u.clientY), d = this.snapHandle(t, h.clone(), c), f = pt(this.vertices);
    let g = f[l], p = f[l + 1];
    const m = r.sourceView, y = r.sourceBBox;
    let v = !1, b = !1;
    if (g ? l === 0 ? y.containsPoint(g) ? (f.shift(), this.shiftHandleIndexes(-1), v = !0) : (g[a] = d[a], b = !0) : g[a] = d[a] : (g = r.sourceAnchor.toJSON(), g[a] = d[a], y.containsPoint(g) ? v = !0 : (f.unshift(g), this.shiftHandleIndexes(1), b = !0)), typeof o == "function" && m) {
      if (v) {
        const P = c.sourceAnchor.clone();
        P[a] = d[a];
        const O = z(o, r, P, m, r.sourceMagnet || m.container, "source", r, this);
        this.resetAnchor("source", O);
      }
      b && this.resetAnchor("source", c.sourceAnchorDef);
    }
    const w = r.targetView, E = r.targetBBox;
    let S = !1, C = !1;
    if (p ? l === f.length - 2 ? E.containsPoint(p) ? (f.pop(), S = !0) : (p[a] = d[a], C = !0) : p[a] = d[a] : (p = r.targetAnchor.toJSON(), p[a] = d[a], E.containsPoint(p) ? S = !0 : (f.push(p), C = !0)), typeof o == "function" && w) {
      if (S) {
        const P = c.targetAnchor.clone();
        P[a] = d[a];
        const O = z(o, r, P, w, r.targetMagnet || w.container, "target", r, this);
        this.resetAnchor("target", O);
      }
      C && this.resetAnchor("target", c.targetAnchorDef);
    }
    x.equalPoints(f, this.vertices) || this.cellView.cell.setVertices(f, { ui: !0, toolId: this.cid }), this.updateHandle(t, g, p, 0), s.stopPropagation || r.notifyMouseMove(u, h.x, h.y);
  }
  onHandleChange({ handle: t, e }) {
    const n = this.options, s = this.handles, r = this.cellView, o = t.options.index;
    if (Array.isArray(s)) {
      for (let a = 0, l = s.length; a < l; a += 1)
        a !== o && s[a].hide();
      if (this.focus(), this.setEventData(e, {
        sourceAnchor: r.sourceAnchor.clone(),
        targetAnchor: r.targetAnchor.clone(),
        sourceAnchorDef: pt(this.cell.prop(["source", "anchor"])),
        targetAnchorDef: pt(this.cell.prop(["target", "anchor"]))
      }), this.cell.startBatch("move-segment", { ui: !0, toolId: this.cid }), !n.stopPropagation) {
        const a = this.normalizeEvent(e), l = this.graph.snapToGrid(a.clientX, a.clientY);
        r.notifyMouseDown(a, l.x, l.y);
      }
    }
  }
  onHandleChanged({ e: t }) {
    const e = this.options, n = this.cellView;
    e.removeRedundancies && n.removeRedundantLinearVertices({ ui: !0, toolId: this.cid });
    const s = this.normalizeEvent(t), r = this.graph.snapToGrid(s.clientX, s.clientY);
    this.render(), this.blur(), this.cell.stopBatch("move-segment", { ui: !0, toolId: this.cid }), e.stopPropagation || n.notifyMouseUp(s, r.x, r.y), n.checkMouseleave(s), e.onChanged && e.onChanged({ edge: n.cell, edgeView: n });
  }
  updateHandle(t, e, n, s = 0) {
    const r = this.options.precision || 0, o = Math.abs(e.x - n.x) < r, a = Math.abs(e.y - n.y) < r;
    if (o || a) {
      const l = new D(e, n);
      if (l.length() < this.options.threshold)
        t.hide();
      else {
        const u = l.getCenter(), h = o ? "x" : "y";
        u[h] += s || 0;
        const d = l.vector().vectorAngle(new x(1, 0));
        t.updatePosition(u.x, u.y, d, this.cellView), t.show(), t.options.axis = h;
      }
    } else
      t.hide();
  }
  onRemove() {
    this.resetHandles();
  }
}
(function(i) {
  class t extends rt {
    constructor(n) {
      super(), this.options = n, this.render(), this.delegateEvents({
        mousedown: "onMouseDown",
        touchstart: "onMouseDown"
      });
    }
    render() {
      this.container = rt.createElement("rect", !0);
      const n = this.options.attrs;
      if (typeof n == "function") {
        const s = i.getDefaults();
        this.setAttrs(Object.assign(Object.assign({}, s.attrs), n(this)));
      } else
        this.setAttrs(n);
      this.addClass(this.prefixClassName("edge-tool-segment"));
    }
    updatePosition(n, s, r, o) {
      const a = o.getClosestPoint(new x(n, s)) || new x(n, s);
      let l = Vt().translate(a.x, a.y);
      if (a.equals({ x: n, y: s }))
        l = l.rotate(r);
      else {
        let u = new D(n, s, a.x, a.y).vector().vectorAngle(new x(1, 0));
        u !== 0 && (u += 90), l = l.rotate(u);
      }
      this.setAttrs({
        transform: fi(l),
        cursor: r % 180 === 0 ? "row-resize" : "col-resize"
      });
    }
    onMouseDown(n) {
      this.options.guard(n) || (this.trigger("change", { e: n, handle: this }), n.stopPropagation(), n.preventDefault(), this.options.graph.view.undelegateEvents(), this.delegateDocumentEvents({
        mousemove: "onMouseMove",
        touchmove: "onMouseMove",
        mouseup: "onMouseUp",
        touchend: "onMouseUp",
        touchcancel: "onMouseUp"
      }, n.data));
    }
    onMouseMove(n) {
      this.emit("changing", { e: n, handle: this });
    }
    onMouseUp(n) {
      this.emit("changed", { e: n, handle: this }), this.undelegateDocumentEvents(), this.options.graph.view.delegateEvents();
    }
    show() {
      this.container.style.display = "";
    }
    hide() {
      this.container.style.display = "none";
    }
  }
  i.Handle = t;
})(Ui || (Ui = {}));
(function(i) {
  i.config({
    name: "segments",
    precision: 0.5,
    threshold: 40,
    snapRadius: 10,
    stopPropagation: !0,
    removeRedundancies: !0,
    attrs: {
      width: 20,
      height: 8,
      x: -10,
      y: -4,
      rx: 4,
      ry: 4,
      fill: "#333",
      stroke: "#fff",
      "stroke-width": 2
    },
    createHandle: (t) => new i.Handle(t),
    anchor: ch
  });
})(Ui || (Ui = {}));
class js extends Rt.ToolItem {
  get type() {
    return this.options.type;
  }
  onRender() {
    U(this.container, this.prefixClassName(`edge-tool-${this.type}-anchor`)), this.toggleArea(!1), this.update();
  }
  update() {
    const t = this.type;
    return this.cellView.getTerminalView(t) ? (this.updateAnchor(), this.updateArea(), this.container.style.display = "") : this.container.style.display = "none", this;
  }
  updateAnchor() {
    const t = this.childNodes;
    if (!t)
      return;
    const e = t.anchor;
    if (!e)
      return;
    const n = this.type, s = this.cellView, r = this.options, o = s.getTerminalAnchor(n), a = s.cell.prop([n, "anchor"]);
    e.setAttribute("transform", `translate(${o.x}, ${o.y})`);
    const l = a ? r.customAnchorAttrs : r.defaultAnchorAttrs;
    l && Object.keys(l).forEach((c) => {
      e.setAttribute(c, l[c]);
    });
  }
  updateArea() {
    const t = this.childNodes;
    if (!t)
      return;
    const e = t.area;
    if (!e)
      return;
    const n = this.type, s = this.cellView, r = s.getTerminalView(n);
    if (r) {
      const o = r.cell, a = s.getTerminalMagnet(n);
      let l = this.options.areaPadding || 0;
      Number.isFinite(l) || (l = 0);
      let c, u, h;
      r.isEdgeElement(a) ? (c = r.getBBox(), u = 0, h = c.getCenter()) : (c = r.getUnrotatedBBoxOfElement(a), u = o.getAngle(), h = c.getCenter(), u && h.rotate(-u, o.getBBox().getCenter())), c.inflate(l), nt(e, {
        x: -c.width / 2,
        y: -c.height / 2,
        width: c.width,
        height: c.height,
        transform: `translate(${h.x}, ${h.y}) rotate(${u})`
      });
    }
  }
  toggleArea(t) {
    if (this.childNodes) {
      const e = this.childNodes.area;
      e && (e.style.display = t ? "" : "none");
    }
  }
  onMouseDown(t) {
    this.guard(t) || (t.stopPropagation(), t.preventDefault(), this.graph.view.undelegateEvents(), this.options.documentEvents && this.delegateDocumentEvents(this.options.documentEvents), this.focus(), this.toggleArea(this.options.restrictArea), this.cell.startBatch("move-anchor", {
      ui: !0,
      toolId: this.cid
    }));
  }
  resetAnchor(t) {
    const e = this.type, n = this.cell;
    t ? n.prop([e, "anchor"], t, {
      rewrite: !0,
      ui: !0,
      toolId: this.cid
    }) : n.removeProp([e, "anchor"], {
      ui: !0,
      toolId: this.cid
    });
  }
  onMouseMove(t) {
    const e = this.type, n = this.cellView, s = n.getTerminalView(e);
    if (s == null)
      return;
    const r = this.normalizeEvent(t), o = s.cell, a = n.getTerminalMagnet(e);
    let l = this.graph.coord.clientToLocalPoint(r.clientX, r.clientY);
    const c = this.options.snap;
    if (typeof c == "function") {
      const d = z(c, n, l, s, a, e, n, this);
      l = x.create(d);
    }
    if (this.options.restrictArea)
      if (s.isEdgeElement(a)) {
        const d = s.getClosestPoint(l);
        d && (l = d);
      } else {
        const d = s.getUnrotatedBBoxOfElement(a), f = o.getAngle(), g = o.getBBox().getCenter(), p = l.clone().rotate(f, g);
        d.containsPoint(p) || (l = d.getNearestPointToPoint(p).rotate(-f, g));
      }
    let u;
    const h = this.options.anchor;
    typeof h == "function" && (u = z(h, n, l, s, a, e, n, this)), this.resetAnchor(u), this.update();
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onMouseUp(t) {
    this.graph.view.delegateEvents(), this.undelegateDocumentEvents(), this.blur(), this.toggleArea(!1);
    const e = this.cellView;
    this.options.removeRedundancies && e.removeRedundantLinearVertices({ ui: !0, toolId: this.cid }), this.cell.stopBatch("move-anchor", { ui: !0, toolId: this.cid });
  }
  onDblClick() {
    const t = this.options.resetAnchor;
    t && this.resetAnchor(t === !0 ? void 0 : t), this.update();
  }
}
(function(i) {
  i.config({
    tagName: "g",
    markup: [
      {
        tagName: "circle",
        selector: "anchor",
        attrs: {
          cursor: "pointer"
        }
      },
      {
        tagName: "rect",
        selector: "area",
        attrs: {
          "pointer-events": "none",
          fill: "none",
          stroke: "#33334F",
          "stroke-dasharray": "2,4",
          rx: 5,
          ry: 5
        }
      }
    ],
    events: {
      mousedown: "onMouseDown",
      touchstart: "onMouseDown",
      dblclick: "onDblClick"
    },
    documentEvents: {
      mousemove: "onMouseMove",
      touchmove: "onMouseMove",
      mouseup: "onMouseUp",
      touchend: "onMouseUp",
      touchcancel: "onMouseUp"
    },
    customAnchorAttrs: {
      "stroke-width": 4,
      stroke: "#33334F",
      fill: "#FFFFFF",
      r: 5
    },
    defaultAnchorAttrs: {
      "stroke-width": 2,
      stroke: "#FFFFFF",
      fill: "#33334F",
      r: 6
    },
    areaPadding: 6,
    snapRadius: 10,
    resetAnchor: !0,
    restrictArea: !0,
    removeRedundancies: !0,
    anchor: ch,
    snap(t, e, n, s, r, o) {
      const a = o.options.snapRadius || 0, l = s === "source", c = l ? 0 : -1, u = this.cell.getVertexAt(c) || this.getTerminalAnchor(l ? "target" : "source");
      return u && (Math.abs(u.x - t.x) < a && (t.x = u.x), Math.abs(u.y - t.y) < a && (t.y = u.y)), t;
    }
  });
})(js || (js = {}));
const i1 = js.define({
  name: "source-anchor",
  type: "source"
}), s1 = js.define({
  name: "target-anchor",
  type: "target"
});
var r1 = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
};
class Ls extends Rt.ToolItem {
  get type() {
    return this.options.type;
  }
  get ratio() {
    return this.options.ratio;
  }
  init() {
    if (this.options.attrs) {
      const t = this.options.attrs, { class: e } = t, n = r1(t, ["class"]);
      this.setAttrs(n, this.container), e && U(this.container, e);
    }
  }
  onRender() {
    U(this.container, this.prefixClassName(`edge-tool-${this.type}-arrowhead`)), this.update();
  }
  update() {
    const t = this.ratio, e = this.cellView, n = e.getTangentAtRatio(t), s = n ? n.start : e.getPointAtRatio(t), r = n && n.vector().vectorAngle(new x(1, 0)) || 0;
    if (!s)
      return this;
    const o = Vt().translate(s.x, s.y).rotate(r);
    return Gn(this.container, o, { absolute: !0 }), this;
  }
  onMouseDown(t) {
    if (this.guard(t))
      return;
    t.stopPropagation(), t.preventDefault();
    const e = this.cellView;
    if (e.can("arrowheadMovable")) {
      e.cell.startBatch("move-arrowhead", {
        ui: !0,
        toolId: this.cid
      });
      const n = this.graph.snapToGrid(t.clientX, t.clientY), s = e.prepareArrowheadDragging(this.type, {
        x: n.x,
        y: n.y,
        options: Object.assign(Object.assign({}, this.options), { toolId: this.cid })
      });
      this.cellView.setEventData(t, s), this.delegateDocumentEvents(this.options.documentEvents, t.data), e.graph.view.undelegateEvents(), this.container.style.pointerEvents = "none";
    }
    this.focus();
  }
  onMouseMove(t) {
    const e = this.normalizeEvent(t), n = this.graph.snapToGrid(e.clientX, e.clientY);
    this.cellView.onMouseMove(e, n.x, n.y), this.update();
  }
  onMouseUp(t) {
    this.undelegateDocumentEvents();
    const e = this.normalizeEvent(t), n = this.cellView, s = this.graph.snapToGrid(e.clientX, e.clientY);
    n.onMouseUp(e, s.x, s.y), this.graph.view.delegateEvents(), this.blur(), this.container.style.pointerEvents = "", n.cell.stopBatch("move-arrowhead", {
      ui: !0,
      toolId: this.cid
    });
  }
}
(function(i) {
  i.config({
    tagName: "path",
    isSVGElement: !0,
    events: {
      mousedown: "onMouseDown",
      touchstart: "onMouseDown"
    },
    documentEvents: {
      mousemove: "onMouseMove",
      touchmove: "onMouseMove",
      mouseup: "onMouseUp",
      touchend: "onMouseUp",
      touchcancel: "onMouseUp"
    }
  });
})(Ls || (Ls = {}));
const o1 = Ls.define({
  name: "source-arrowhead",
  type: "source",
  ratio: 0,
  attrs: {
    d: "M 10 -8 -10 0 10 8 Z",
    fill: "#333",
    stroke: "#fff",
    "stroke-width": 2,
    cursor: "move"
  }
}), a1 = Ls.define({
  name: "target-arrowhead",
  type: "target",
  ratio: 1,
  attrs: {
    d: "M -10 -8 10 0 -10 8 Z",
    fill: "#333",
    stroke: "#fff",
    "stroke-width": 2,
    cursor: "move"
  }
});
class Xn extends Rt.ToolItem {
  constructor() {
    super(...arguments), this.labelIndex = -1, this.distance = 0.5, this.dblClick = this.onCellDblClick.bind(this);
  }
  onRender() {
    const t = this.cellView;
    t && t.on("cell:dblclick", this.dblClick);
  }
  createElement() {
    const t = [
      this.prefixClassName(`${this.cell.isEdge() ? "edge" : "node"}-tool-editor`),
      this.prefixClassName("cell-tool-editor")
    ];
    this.editor = Rt.createElement("div", !1), this.addClass(t, this.editor), this.editor.contentEditable = "true", this.container.appendChild(this.editor);
  }
  removeElement() {
    this.undelegateDocumentEvents(), this.editor && (this.container.removeChild(this.editor), this.editor = null);
  }
  updateEditor() {
    const { cell: t, editor: e } = this;
    if (!e)
      return;
    const { style: n } = e;
    t.isNode() ? this.updateNodeEditorTransform() : t.isEdge() && this.updateEdgeEditorTransform();
    const { attrs: s } = this.options;
    n.fontSize = `${s.fontSize}px`, n.fontFamily = s.fontFamily, n.color = s.color, n.backgroundColor = s.backgroundColor;
    const r = this.getCellText() || "";
    return e.innerText = r, this.setCellText(""), this;
  }
  updateNodeEditorTransform() {
    const { graph: t, cell: e, editor: n } = this;
    if (!n)
      return;
    let s = x.create(), r = 20, o = "", { x: a, y: l } = this.options;
    const { width: c, height: u } = this.options;
    if (typeof a < "u" && typeof l < "u") {
      const f = e.getBBox();
      a = ve(a, f.width), l = ve(l, f.height), s = f.topLeft.translate(a, l), r = f.width - a * 2;
    } else {
      const f = e.getBBox();
      s = f.center, r = f.width - 4, o = "translate(-50%, -50%)";
    }
    const h = t.scale(), { style: d } = n;
    s = t.localToGraph(s), d.left = `${s.x}px`, d.top = `${s.y}px`, d.transform = `scale(${h.sx}, ${h.sy}) ${o}`, d.minWidth = `${r}px`, typeof c == "number" && (d.width = `${c}px`), typeof u == "number" && (d.height = `${u}px`);
  }
  updateEdgeEditorTransform() {
    if (!this.event)
      return;
    const { graph: t, editor: e } = this;
    if (!e)
      return;
    let n = x.create(), s = 20;
    const { style: r } = e, o = this.event.target, a = o.parentElement;
    if (a && di(a, this.prefixClassName("edge-label"))) {
      const u = a.getAttribute("data-index") || "0";
      this.labelIndex = parseInt(u, 10);
      const h = a.getAttribute("transform"), { translation: d } = er(h);
      n = new x(d.tx, d.ty), s = lt.getBBox(o).width;
    } else {
      if (!this.options.labelAddable)
        return this;
      n = t.clientToLocal(x.create(this.event.clientX, this.event.clientY));
      const h = this.cellView.path.closestPointLength(n);
      this.distance = h, this.labelIndex = -1;
    }
    n = t.localToGraph(n);
    const c = t.scale();
    r.left = `${n.x}px`, r.top = `${n.y}px`, r.minWidth = `${s}px`, r.transform = `scale(${c.sx}, ${c.sy}) translate(-50%, -50%)`;
  }
  onDocumentMouseUp(t) {
    if (this.editor && t.target !== this.editor) {
      const e = this.editor.innerText.replace(/\n$/, "") || "";
      this.setCellText(e !== "" ? e : null), this.removeElement();
    }
  }
  onCellDblClick({ e: t }) {
    this.editor || (t.stopPropagation(), this.removeElement(), this.event = t, this.createElement(), this.updateEditor(), this.autoFocus(), this.delegateDocumentEvents(this.options.documentEvents));
  }
  onMouseDown(t) {
    t.stopPropagation();
  }
  autoFocus() {
    setTimeout(() => {
      this.editor && (this.editor.focus(), this.selectText());
    });
  }
  selectText() {
    if (window.getSelection && this.editor) {
      const t = document.createRange(), e = window.getSelection();
      t.selectNodeContents(this.editor), e.removeAllRanges(), e.addRange(t);
    }
  }
  getCellText() {
    const { getText: t } = this.options;
    if (typeof t == "function")
      return z(t, this.cellView, {
        cell: this.cell,
        index: this.labelIndex
      });
    if (typeof t == "string") {
      if (this.cell.isNode())
        return this.cell.attr(t);
      if (this.cell.isEdge() && this.labelIndex !== -1)
        return this.cell.prop(`labels/${this.labelIndex}/attrs/${t}`);
    }
  }
  setCellText(t) {
    const e = this.options.setText;
    if (typeof e == "function") {
      z(e, this.cellView, {
        cell: this.cell,
        value: t,
        index: this.labelIndex,
        distance: this.distance
      });
      return;
    }
    if (typeof e == "string") {
      if (this.cell.isNode()) {
        t !== null && this.cell.attr(e, t);
        return;
      }
      if (this.cell.isEdge()) {
        const n = this.cell;
        if (this.labelIndex === -1) {
          if (t) {
            const s = {
              position: {
                distance: this.distance
              },
              attrs: {}
            };
            hi(s, `attrs/${e}`, t), n.appendLabel(s);
          }
        } else
          t !== null ? n.prop(`labels/${this.labelIndex}/attrs/${e}`, t) : typeof this.labelIndex == "number" && n.removeLabelAt(this.labelIndex);
      }
    }
  }
  onRemove() {
    const t = this.cellView;
    t && t.off("cell:dblclick", this.dblClick), this.removeElement();
  }
}
(function(i) {
  i.config({
    tagName: "div",
    isSVGElement: !1,
    events: {
      mousedown: "onMouseDown",
      touchstart: "onMouseDown"
    },
    documentEvents: {
      mouseup: "onDocumentMouseUp",
      touchend: "onDocumentMouseUp",
      touchcancel: "onDocumentMouseUp"
    }
  });
})(Xn || (Xn = {}));
(function(i) {
  i.NodeEditor = i.define({
    attrs: {
      fontSize: 14,
      fontFamily: "Arial, helvetica, sans-serif",
      color: "#000",
      backgroundColor: "#fff"
    },
    getText: "text/text",
    setText: "text/text"
  }), i.EdgeEditor = i.define({
    attrs: {
      fontSize: 14,
      fontFamily: "Arial, helvetica, sans-serif",
      color: "#000",
      backgroundColor: "#fff"
    },
    labelAddable: !0,
    getText: "label/text",
    setText: "label/text"
  });
})(Xn || (Xn = {}));
var hh = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
}, Yn;
(function(i) {
  i.presets = {
    boundary: Is,
    button: an,
    "button-remove": an.Remove,
    "node-editor": Xn.NodeEditor
  }, i.registry = It.create({
    type: "node tool",
    process(t, e) {
      if (typeof e == "function")
        return e;
      let n = Rt.ToolItem;
      const { inherit: s } = e, r = hh(e, ["inherit"]);
      if (s) {
        const o = this.get(s);
        o == null ? this.onNotFound(s, "inherited") : n = o;
      }
      return r.name == null && (r.name = t), n.define.call(n, r);
    }
  }), i.registry.register(i.presets, !0);
})(Yn || (Yn = {}));
var Jn;
(function(i) {
  i.presets = {
    boundary: Is,
    vertices: qi,
    segments: Ui,
    button: an,
    "button-remove": an.Remove,
    "source-anchor": i1,
    "target-anchor": s1,
    "source-arrowhead": o1,
    "target-arrowhead": a1,
    "edge-editor": Xn.EdgeEditor
  }, i.registry = It.create({
    type: "edge tool",
    process(t, e) {
      if (typeof e == "function")
        return e;
      let n = Rt.ToolItem;
      const { inherit: s } = e, r = hh(e, ["inherit"]);
      if (s) {
        const o = this.get(s);
        o == null ? this.onNotFound(s, "inherited") : n = o;
      }
      return r.name == null && (r.name = t), n.define.call(n, r);
    }
  }), i.registry.register(i.presets, !0);
})(Jn || (Jn = {}));
const l1 = He("center"), c1 = He("topCenter"), u1 = He("bottomCenter"), h1 = He("leftMiddle"), d1 = He("rightMiddle"), f1 = He("topLeft"), g1 = He("topRight"), p1 = He("bottomLeft"), m1 = He("bottomRight");
function He(i) {
  return function(t, e, n, s = {}) {
    let r;
    t.cell.visible ? r = s.rotate ? t.getUnrotatedBBoxOfElement(e) : t.getBBoxOfElement(e) : r = t.cell.getBBox();
    const o = r[i];
    o.x += ve(s.dx, r.width), o.y += ve(s.dy, r.height);
    const a = t.cell;
    return s.rotate ? o.rotate(-a.getAngle(), a.getBBox().getCenter()) : o;
  };
}
function ar(i) {
  return function(t, e, n, s) {
    if (n instanceof Element) {
      const r = this.graph.findViewByElem(n);
      let o;
      if (r)
        if (r.isEdgeElement(n)) {
          const a = s.fixedAt != null ? s.fixedAt : "50%";
          o = dh(r, a);
        } else
          o = r.getBBoxOfElement(n).getCenter();
      else
        o = new x();
      return i.call(this, t, e, o, s);
    }
    return i.apply(this, arguments);
  };
}
function dh(i, t) {
  const e = ze(t), n = typeof t == "string" ? parseFloat(t) : t;
  return e ? i.getPointAtRatio(n / 100) : i.getPointAtLength(n);
}
const b1 = function(i, t, e, n) {
  const s = ut.normalize(i.cell.getAngle()), r = i.cell.visible ? i.getBBoxOfElement(t) : i.cell.getBBox(), o = r.getCenter(), a = r.getTopLeft(), l = r.getBottomRight();
  let c = n.padding;
  if (Number.isFinite(c) || (c = 0), a.y + c <= e.y && e.y <= l.y - c) {
    const u = e.y - o.y;
    o.x += s === 0 || s === 180 ? 0 : u * 1 / Math.tan(ut.toRad(s)), o.y += u;
  } else if (a.x + c <= e.x && e.x <= l.x - c) {
    const u = e.x - o.x;
    o.y += s === 90 || s === 270 ? 0 : u * Math.tan(ut.toRad(s)), o.x += u;
  }
  return o;
}, y1 = ar(b1), v1 = function(i, t, e, n, s) {
  const r = i.cell.getConnectionPoint(this.cell, s);
  return (n.dx || n.dy) && r.translate(n.dx || 0, n.dy || 0), r;
}, w1 = function(i, t, e, n) {
  let s, r = 0, o;
  const a = i.cell;
  n.rotate ? (s = i.getUnrotatedBBoxOfElement(t), o = a.getBBox().getCenter(), r = a.getAngle()) : a.visible ? s = i.getBBoxOfElement(t) : s = i.cell.getBBox();
  const l = n.padding;
  l != null && Number.isFinite(l) && s.inflate(l), n.rotate && e.rotate(r, o);
  const c = s.getNearestSideToPoint(e);
  let u;
  switch (c) {
    case "left":
      u = s.getLeftMiddle();
      break;
    case "right":
      u = s.getRightMiddle();
      break;
    case "top":
      u = s.getTopCenter();
      break;
    case "bottom":
      u = s.getBottomCenter();
      break;
  }
  const h = n.direction;
  return h === "H" ? (c === "top" || c === "bottom") && (e.x <= s.x + s.width ? u = s.getLeftMiddle() : u = s.getRightMiddle()) : h === "V" && (e.y <= s.y + s.height ? u = s.getTopCenter() : u = s.getBottomCenter()), n.rotate ? u.rotate(-r, o) : u;
}, x1 = ar(w1), E1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  bottom: u1,
  bottomLeft: p1,
  bottomRight: m1,
  center: l1,
  left: h1,
  midSide: x1,
  nodeCenter: v1,
  orth: y1,
  right: d1,
  top: c1,
  topLeft: f1,
  topRight: g1
}, Symbol.toStringTag, { value: "Module" }));
var Kn;
(function(i) {
  i.presets = E1, i.registry = It.create({
    type: "node endpoint"
  }), i.registry.register(i.presets, !0);
})(Kn || (Kn = {}));
const C1 = function(i, t, e, n) {
  let s = n.ratio != null ? n.ratio : 0.5;
  return s > 1 && (s /= 100), i.getPointAtRatio(s);
}, S1 = function(i, t, e, n) {
  const s = n.length != null ? n.length : 20;
  return i.getPointAtLength(s);
}, fh = function(i, t, e, n) {
  const s = i.getClosestPoint(e);
  return s ?? new x();
}, P1 = ar(fh), O1 = function(i, t, e, n) {
  const r = i.getConnection(), o = i.getConnectionSubdivisions(), a = new D(e.clone().translate(0, 1e6), e.clone().translate(0, -1e6)), l = new D(e.clone().translate(1e6, 0), e.clone().translate(-1e6, 0)), c = a.intersect(r, {
    segmentSubdivisions: o
  }), u = l.intersect(r, {
    segmentSubdivisions: o
  }), h = [];
  return c && h.push(...c), u && h.push(...u), h.length > 0 ? e.closest(h) : n.fallbackAt != null ? dh(i, n.fallbackAt) : z(fh, this, i, t, e, n);
}, A1 = ar(O1), M1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  closest: P1,
  length: S1,
  orth: A1,
  ratio: C1
}, Symbol.toStringTag, { value: "Module" }));
var Zn;
(function(i) {
  i.presets = M1, i.registry = It.create({
    type: "edge endpoint"
  }), i.registry.register(i.presets, !0);
})(Zn || (Zn = {}));
function lr(i, t, e) {
  let n;
  if (typeof e == "object") {
    if (Number.isFinite(e.y)) {
      const r = new D(t, i), { start: o, end: a } = r.parallel(e.y);
      t = o, i = a;
    }
    n = e.x;
  } else
    n = e;
  if (n == null || !Number.isFinite(n))
    return i;
  const s = i.distance(t);
  return n === 0 && s > 0 ? i : i.move(t, -Math.min(n, s - 1));
}
function ks(i) {
  const t = i.getAttribute("stroke-width");
  return t === null ? 0 : parseFloat(t) || 0;
}
function T1(i) {
  if (i == null)
    return null;
  let t = i;
  do {
    let e = t.tagName;
    if (typeof e != "string")
      return null;
    if (e = e.toUpperCase(), e === "G")
      t = t.firstElementChild;
    else if (e === "TITLE")
      t = t.nextElementSibling;
    else
      break;
  } while (t);
  return t;
}
const gh = function(i, t, e, n) {
  const s = t.getBBoxOfElement(e);
  n.stroked && s.inflate(ks(e) / 2);
  const r = i.intersect(s), o = r && r.length ? i.start.closest(r) : i.end;
  return lr(o, i.start, n.offset);
}, N1 = function(i, t, e, n, s) {
  const r = t.cell, o = r.isNode() ? r.getAngle() : 0;
  if (o === 0)
    return z(gh, this, i, t, e, n, s);
  const a = t.getUnrotatedBBoxOfElement(e);
  n.stroked && a.inflate(ks(e) / 2);
  const l = a.getCenter(), c = i.clone().rotate(o, l), u = c.setLength(1e6).intersect(a), h = u && u.length ? c.start.closest(u).rotate(-o, l) : i.end;
  return lr(h, i.start, n.offset);
}, I1 = function(i, t, e, n) {
  let s, r;
  const o = i.end, a = n.selector;
  if (typeof a == "string" ? s = t.findOne(a) : Array.isArray(a) ? s = To(e, a) : s = T1(e), !nn(s)) {
    if (s === e || !nn(e))
      return o;
    s = e;
  }
  const l = t.getShapeOfElement(s), c = t.getMatrixOfElement(s), u = t.getRootTranslatedMatrix(), h = t.getRootRotatedMatrix(), d = u.multiply(h).multiply(c), f = d.inverse(), g = lt.transformLine(i, f), p = g.start.clone(), m = t.getDataOfElement(s);
  if (n.insideout === !1) {
    m.shapeBBox == null && (m.shapeBBox = l.bbox());
    const w = m.shapeBBox;
    if (w != null && w.containsPoint(p))
      return o;
  }
  n.extrapolate === !0 && g.setLength(1e6);
  let y;
  if (B.isPath(l)) {
    const w = n.precision || 2;
    m.segmentSubdivisions == null && (m.segmentSubdivisions = l.getSegmentSubdivisions({
      precision: w
    })), y = {
      precision: w,
      segmentSubdivisions: m.segmentSubdivisions
    }, r = g.intersect(l, y);
  } else
    r = g.intersect(l);
  r ? Array.isArray(r) && (r = p.closest(r)) : n.sticky === !0 && (R.isRectangle(l) ? r = l.getNearestPointToPoint(p) : xe.isEllipse(l) ? r = l.intersectsWithLineFromCenterToPoint(p) : r = l.closestPoint(p, y));
  const v = r ? lt.transformPoint(r, d) : o;
  let b = n.offset || 0;
  return n.stroked !== !1 && (typeof b == "object" ? (b = Object.assign({}, b), b.x == null && (b.x = 0), b.x += ks(s) / 2) : b += ks(s) / 2), lr(v, i.start, b);
};
function j1(i, t, e = 0) {
  const { start: n, end: s } = i;
  let r, o, a, l;
  switch (t) {
    case "left":
      l = "x", r = s, o = n, a = -1;
      break;
    case "right":
      l = "x", r = n, o = s, a = 1;
      break;
    case "top":
      l = "y", r = s, o = n, a = -1;
      break;
    case "bottom":
      l = "y", r = n, o = s, a = 1;
      break;
    default:
      return;
  }
  n[l] < s[l] ? r[l] = o[l] : o[l] = r[l], Number.isFinite(e) && (r[l] += a * e, o[l] += a * e);
}
const L1 = function(i, t, e, n) {
  const { alignOffset: s, align: r } = n;
  return r && j1(i, r, s), lr(i.end, i.start, n.offset);
}, k1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  anchor: L1,
  bbox: gh,
  boundary: I1,
  rect: N1
}, Symbol.toStringTag, { value: "Module" }));
var Qn;
(function(i) {
  i.presets = k1, i.registry = It.create({
    type: "connection point"
  }), i.registry.register(i.presets, !0);
})(Qn || (Qn = {}));
const R1 = function(i) {
  return [...i];
}, D1 = function(i, t, e) {
  const n = t.side || "bottom", s = xn(t.padding || 40), r = e.sourceBBox, o = e.targetBBox, a = r.getCenter(), l = o.getCenter();
  let c, u, h;
  switch (n) {
    case "top":
      h = -1, c = "y", u = "height";
      break;
    case "left":
      h = -1, c = "x", u = "width";
      break;
    case "right":
      h = 1, c = "x", u = "width";
      break;
    case "bottom":
    default:
      h = 1, c = "y", u = "height";
      break;
  }
  return a[c] += h * (r[u] / 2 + s[n]), l[c] += h * (o[u] / 2 + s[n]), h * (a[c] - l[c]) > 0 ? l[c] = a[c] : a[c] = l[c], [a.toJSON(), ...i, l.toJSON()];
};
function hs(i) {
  return new R(i.x, i.y, 0, 0);
}
function Rs(i = {}) {
  const t = xn(i.padding || 20);
  return {
    x: -t.left,
    y: -t.top,
    width: t.left + t.right,
    height: t.top + t.bottom
  };
}
function ph(i, t = {}) {
  return i.sourceBBox.clone().moveAndExpand(Rs(t));
}
function mh(i, t = {}) {
  return i.targetBBox.clone().moveAndExpand(Rs(t));
}
function _1(i, t = {}) {
  return i.sourceAnchor ? i.sourceAnchor : ph(i, t).getCenter();
}
function $1(i, t = {}) {
  return i.targetAnchor ? i.targetAnchor : mh(i, t).getCenter();
}
const bh = function(i, t, e) {
  let n = ph(e, t), s = mh(e, t);
  const r = _1(e, t), o = $1(e, t);
  n = n.union(hs(r)), s = s.union(hs(o));
  const a = i.map((u) => x.create(u));
  a.unshift(r), a.push(o);
  let l = null;
  const c = [];
  for (let u = 0, h = a.length - 1; u < h; u += 1) {
    let d = null;
    const f = a[u], g = a[u + 1], p = oe.getBearing(f, g) != null;
    if (u === 0)
      u + 1 === h ? n.intersectsWithRect(s.clone().inflate(1)) ? d = oe.insideNode(f, g, n, s) : p || (d = oe.nodeToNode(f, g, n, s)) : n.containsPoint(g) ? d = oe.insideNode(f, g, n, hs(g).moveAndExpand(Rs(t))) : p || (d = oe.nodeToVertex(f, g, n));
    else if (u + 1 === h) {
      const m = p && oe.getBearing(g, f) === l;
      s.containsPoint(f) || m ? d = oe.insideNode(f, g, hs(f).moveAndExpand(Rs(t)), s, l) : p || (d = oe.vertexToNode(f, g, s, l));
    } else p || (d = oe.vertexToVertex(f, g, l));
    d ? (c.push(...d.points), l = d.direction) : l = oe.getBearing(f, g), u + 1 < h && c.push(g);
  }
  return c;
};
var oe;
(function(i) {
  const t = {
    N: "S",
    S: "N",
    E: "W",
    W: "E"
  }, e = {
    N: -Math.PI / 2 * 3,
    S: -Math.PI / 2,
    E: 0,
    W: Math.PI
  };
  function n(h, d, f) {
    let g = new x(h.x, d.y);
    return f.containsPoint(g) && (g = new x(d.x, h.y)), g;
  }
  function s(h, d) {
    return h[d === "W" || d === "E" ? "width" : "height"];
  }
  i.getBBoxSize = s;
  function r(h, d) {
    return h.x === d.x ? h.y > d.y ? "N" : "S" : h.y === d.y ? h.x > d.x ? "W" : "E" : null;
  }
  i.getBearing = r;
  function o(h, d, f) {
    const g = new x(h.x, d.y), p = new x(d.x, h.y), m = r(h, g), y = r(h, p), v = f ? t[f] : null, b = m === f || m !== v && (y === v || y !== f) ? g : p;
    return { points: [b], direction: r(b, d) };
  }
  i.vertexToVertex = o;
  function a(h, d, f) {
    const g = n(h, d, f);
    return { points: [g], direction: r(g, d) };
  }
  i.nodeToVertex = a;
  function l(h, d, f, g) {
    const p = [new x(h.x, d.y), new x(d.x, h.y)], m = p.filter((b) => !f.containsPoint(b)), y = m.filter((b) => r(b, h) !== g);
    let v;
    if (y.length > 0)
      return v = y.filter((b) => r(h, b) === g).pop(), v = v || y[0], {
        points: [v],
        direction: r(v, d)
      };
    {
      v = Qy(p, m)[0];
      const b = x.create(d).move(v, -s(f, g) / 2);
      return {
        points: [n(b, h, f), b],
        direction: r(b, d)
      };
    }
  }
  i.vertexToNode = l;
  function c(h, d, f, g) {
    let p = a(d, h, g);
    const m = p.points[0];
    if (f.containsPoint(m)) {
      p = a(h, d, f);
      const y = p.points[0];
      if (g.containsPoint(y)) {
        const v = x.create(h).move(y, -s(f, r(h, y)) / 2), b = x.create(d).move(m, -s(g, r(d, m)) / 2), w = new D(v, b).getCenter(), E = a(h, w, f), S = o(w, d, E.direction);
        p.points = [E.points[0], S.points[0]], p.direction = S.direction;
      }
    }
    return p;
  }
  i.nodeToNode = c;
  function u(h, d, f, g, p) {
    const m = f.union(g).inflate(1), y = m.getCenter(), v = y.distance(d) > y.distance(h), b = v ? d : h, w = v ? h : d;
    let E, S, C;
    p ? (E = x.fromPolar(m.width + m.height, e[p], b), E = m.getNearestPointToPoint(E).move(E, -1)) : E = m.getNearestPointToPoint(b).move(b, 1), S = n(E, w, m);
    let P;
    E.round().equals(S.round()) ? (S = x.fromPolar(m.width + m.height, ut.toRad(E.theta(b)) + Math.PI / 2, w), S = m.getNearestPointToPoint(S).move(w, 1).round(), C = n(E, S, m), P = v ? [S, C, E] : [E, C, S]) : P = v ? [S, E] : [E, S];
    const O = r(v ? E : S, d);
    return {
      points: P,
      direction: O
    };
  }
  i.insideNode = u;
})(oe || (oe = {}));
const B1 = {
  step: 10,
  maxLoopCount: 2e3,
  precision: 1,
  maxDirectionChange: 90,
  perpendicular: !0,
  excludeTerminals: [],
  excludeNodes: [],
  excludeShapes: [],
  startDirections: ["top", "right", "bottom", "left"],
  endDirections: ["top", "right", "bottom", "left"],
  directionMap: {
    top: { x: 0, y: -1 },
    right: { x: 1, y: 0 },
    bottom: { x: 0, y: 1 },
    left: { x: -1, y: 0 }
  },
  cost() {
    return Ke(this.step, this);
  },
  directions() {
    const i = Ke(this.step, this), t = Ke(this.cost, this);
    return [
      { cost: t, offsetX: i, offsetY: 0 },
      { cost: t, offsetX: -i, offsetY: 0 },
      { cost: t, offsetX: 0, offsetY: i },
      { cost: t, offsetX: 0, offsetY: -i }
    ];
  },
  penalties() {
    const i = Ke(this.step, this);
    return {
      0: 0,
      45: i / 2,
      90: i / 2
    };
  },
  paddingBox() {
    const i = Ke(this.step, this);
    return {
      x: -i,
      y: -i,
      width: 2 * i,
      height: 2 * i
    };
  },
  fallbackRouter: bh,
  draggingRouter: null,
  snapToGrid: !0
};
function Ke(i, t) {
  return typeof i == "function" ? i.call(t) : i;
}
function z1(i) {
  const t = Object.keys(i).reduce((e, n) => {
    const s = e;
    return n === "fallbackRouter" || n === "draggingRouter" || n === "fallbackRoute" ? s[n] = i[n] : s[n] = Ke(i[n], i), e;
  }, {});
  if (t.padding) {
    const e = xn(t.padding);
    t.paddingBox = {
      x: -e.left,
      y: -e.top,
      width: e.left + e.right,
      height: e.top + e.bottom
    };
  }
  return t.directions.forEach((e) => {
    const n = new x(0, 0), s = new x(e.offsetX, e.offsetY);
    e.angle = ut.normalize(n.theta(s));
  }), t;
}
const ll = 1, cl = 2;
class V1 {
  constructor() {
    this.items = [], this.hash = {}, this.values = {};
  }
  add(t, e) {
    this.hash[t] ? this.items.splice(this.items.indexOf(t), 1) : this.hash[t] = ll, this.values[t] = e;
    const n = Nv(this.items, t, (s) => this.values[s]);
    this.items.splice(n, 0, t);
  }
  pop() {
    const t = this.items.shift();
    return t && (this.hash[t] = cl), t;
  }
  isOpen(t) {
    return this.hash[t] === ll;
  }
  isClose(t) {
    return this.hash[t] === cl;
  }
  isEmpty() {
    return this.items.length === 0;
  }
}
class F1 {
  constructor(t) {
    this.options = t, this.mapGridSize = 100, this.map = {};
  }
  /**
   * Builds a map of all nodes for quicker obstacle queries i.e. is a point
   * contained in any obstacle?
   *
   * A simplified grid search.
   */
  build(t, e) {
    const n = this.options, s = n.excludeTerminals.reduce((c, u) => {
      const h = e[u];
      if (h) {
        const d = t.getCell(h.cell);
        d && c.push(d);
      }
      return c;
    }, []);
    let r = [];
    const o = t.getCell(e.getSourceCellId());
    o && (r = Ha(r, o.getAncestors().map((c) => c.id)));
    const a = t.getCell(e.getTargetCellId());
    a && (r = Ha(r, a.getAncestors().map((c) => c.id)));
    const l = this.mapGridSize;
    return t.getNodes().reduce((c, u) => {
      const h = s.some((m) => m.id === u.id), d = u.shape ? n.excludeShapes.includes(u.shape) : !1, f = n.excludeNodes.some((m) => typeof m == "string" ? u.id === m : m === u), g = r.includes(u.id), p = d || h || f || g;
      if (u.isVisible() && !p) {
        const m = u.getBBox().moveAndExpand(n.paddingBox), y = m.getOrigin().snapToGrid(l), v = m.getCorner().snapToGrid(l);
        for (let b = y.x; b <= v.x; b += l)
          for (let w = y.y; w <= v.y; w += l) {
            const E = new x(b, w).toString();
            c[E] == null && (c[E] = []), c[E].push(m);
          }
      }
      return c;
    }, this.map), this;
  }
  isAccessible(t) {
    const e = t.clone().snapToGrid(this.mapGridSize).toString(), n = this.map[e];
    return n ? n.every((s) => !s.containsPoint(t)) : !0;
  }
}
function yh(i, t) {
  const e = i.sourceBBox.clone();
  return t && t.paddingBox ? e.moveAndExpand(t.paddingBox) : e;
}
function vh(i, t) {
  const e = i.targetBBox.clone();
  return t && t.paddingBox ? e.moveAndExpand(t.paddingBox) : e;
}
function wh(i, t) {
  return i.sourceAnchor ? i.sourceAnchor : yh(i, t).getCenter();
}
function G1(i, t) {
  return i.targetAnchor ? i.targetAnchor : vh(i, t).getCenter();
}
function Pr(i, t, e, n, s) {
  const r = 360 / e, o = i.theta(H1(i, t, n, s)), a = ut.normalize(o + r / 2);
  return r * Math.floor(a / r);
}
function H1(i, t, e, n) {
  const s = n.step, r = t.x - i.x, o = t.y - i.y, a = r / e.x, l = o / e.y, c = a * s, u = l * s;
  return new x(i.x + c, i.y + u);
}
function ul(i, t) {
  const e = Math.abs(i - t);
  return e > 180 ? 360 - e : e;
}
function q1(i, t) {
  const e = t.step;
  return t.directions.forEach((n) => {
    n.gridOffsetX = n.offsetX / e * i.x, n.gridOffsetY = n.offsetY / e * i.y;
  }), t.directions;
}
function U1(i, t, e) {
  return {
    source: t.clone(),
    x: hl(e.x - t.x, i),
    y: hl(e.y - t.y, i)
  };
}
function hl(i, t) {
  if (!i)
    return t;
  const e = Math.abs(i), n = Math.round(e / t);
  if (!n)
    return e;
  const s = n * t, o = (e - s) / n;
  return t + o;
}
function W1(i, t) {
  const e = t.source, n = ct.snapToGrid(i.x - e.x, t.x) + e.x, s = ct.snapToGrid(i.y - e.y, t.y) + e.y;
  return new x(n, s);
}
function Si(i, t) {
  return i.round(t);
}
function ys(i, t, e) {
  return Si(W1(i.clone(), t), e);
}
function Ri(i) {
  return i.toString();
}
function Or(i) {
  return new x(i.x === 0 ? 0 : Math.abs(i.x) / i.x, i.y === 0 ? 0 : Math.abs(i.y) / i.y);
}
function dl(i, t) {
  let e = 1 / 0;
  for (let n = 0, s = t.length; n < s; n += 1) {
    const r = i.manhattanDistance(t[n]);
    r < e && (e = r);
  }
  return e;
}
function fl(i, t, e, n, s) {
  const r = s.precision, o = s.directionMap, a = i.diff(t.getCenter()), l = Object.keys(o).reduce((c, u) => {
    if (e.includes(u)) {
      const h = o[u], d = new x(i.x + h.x * (Math.abs(a.x) + t.width), i.y + h.y * (Math.abs(a.y) + t.height)), g = new D(i, d).intersect(t) || [];
      let p, m = null;
      for (let y = 0; y < g.length; y += 1) {
        const v = g[y], b = i.squaredDistance(v);
        (p == null || b > p) && (p = b, m = v);
      }
      if (m) {
        let y = ys(m, n, r);
        t.containsPoint(y) && (y = ys(y.translate(h.x * n.x, h.y * n.y), n, r)), c.push(y);
      }
    }
    return c;
  }, []);
  return t.containsPoint(i) || l.push(ys(i, n, r)), l;
}
function X1(i, t, e, n, s) {
  const r = [];
  let o = Or(s.diff(e)), a = Ri(e), l = i[a], c;
  for (; l; ) {
    c = t[a];
    const d = Or(c.diff(l));
    d.equals(o) || (r.unshift(c), o = d), a = Ri(l), l = i[a];
  }
  const u = t[a];
  return Or(u.diff(n)).equals(o) || r.unshift(u), r;
}
function Y1(i, t, e, n, s) {
  const r = s.precision;
  let o, a;
  R.isRectangle(t) ? o = Si(wh(i, s).clone(), r) : o = Si(t.clone(), r), R.isRectangle(e) ? a = Si(G1(i, s).clone(), r) : a = Si(e.clone(), r);
  const l = U1(s.step, o, a), c = o, u = a;
  let h, d;
  if (R.isRectangle(t) ? h = fl(c, t, s.startDirections, l, s) : h = [c], R.isRectangle(e) ? d = fl(a, e, s.endDirections, l, s) : d = [u], h = h.filter((f) => n.isAccessible(f)), d = d.filter((f) => n.isAccessible(f)), h.length > 0 && d.length > 0) {
    const f = new V1(), g = {}, p = {}, m = {};
    for (let I = 0, T = h.length; I < T; I += 1) {
      const k = h[I], H = Ri(k);
      f.add(H, dl(k, d)), g[H] = k, m[H] = 0;
    }
    const y = s.previousDirectionAngle, v = y === void 0;
    let b, w;
    const E = q1(l, s), S = E.length, C = d.reduce((I, T) => {
      const k = Ri(T);
      return I.push(k), I;
    }, []), P = x.equalPoints(h, d);
    let O = s.maxLoopCount;
    for (; !f.isEmpty() && O > 0; ) {
      const I = f.pop(), T = g[I], k = p[I], H = m[I], $ = T.equals(c), A = k == null;
      let N;
      if (A ? v ? $ ? N = null : N = Pr(c, T, S, l, s) : N = y : N = Pr(k, T, S, l, s), !(A && P) && C.indexOf(I) >= 0)
        return s.previousDirectionAngle = N, X1(p, g, T, c, u);
      for (let it = 0; it < S; it += 1) {
        b = E[it];
        const Q = b.angle;
        if (w = ul(N, Q), !(v && $) && w > s.maxDirectionChange)
          continue;
        const dt = ys(T.clone().translate(b.gridOffsetX || 0, b.gridOffsetY || 0), l, r), _ = Ri(dt);
        if (f.isClose(_) || !n.isAccessible(dt))
          continue;
        if (C.indexOf(_) >= 0 && !dt.equals(u)) {
          const Pt = Pr(dt, u, S, l, s);
          if (ul(Q, Pt) > s.maxDirectionChange)
            continue;
        }
        const Z = b.cost, tt = $ ? 0 : s.penalties[w], W = H + Z + tt;
        (!f.isOpen(_) || W < m[_]) && (g[_] = dt, p[_] = T, m[_] = W, f.add(_, W + dl(dt, d)));
      }
      O -= 1;
    }
  }
  return s.fallbackRoute ? z(s.fallbackRoute, this, c, u, s) : null;
}
function J1(i, t = 10) {
  if (i.length <= 1)
    return i;
  for (let e = 0, n = i.length; e < n - 1; e += 1) {
    const s = i[e], r = i[e + 1];
    if (s.x === r.x) {
      const o = t * Math.round(s.x / t);
      s.x !== o && (s.x = o, r.x = o);
    } else if (s.y === r.y) {
      const o = t * Math.round(s.y / t);
      s.y !== o && (s.y = o, r.y = o);
    }
  }
  return i;
}
const K1 = function(i, t, e) {
  const n = z1(t), s = yh(e, n), r = vh(e, n), o = wh(e, n), a = new F1(n).build(e.graph.model, e.cell), l = i.map((f) => x.create(f)), c = [];
  let u = o, h, d;
  for (let f = 0, g = l.length; f <= g; f += 1) {
    let p = null;
    if (h = d || s, d = l[f], d == null) {
      d = r;
      const y = e.cell;
      if ((y.getSourceCellId() == null || y.getTargetCellId() == null) && typeof n.draggingRouter == "function") {
        const b = h === s ? o : h, w = d.getOrigin();
        p = z(n.draggingRouter, e, b, w, n);
      }
    }
    if (p == null && (p = Y1(e, h, d, a, n)), p === null)
      return console.warn("Unable to execute manhattan algorithm, use orth instead"), z(n.fallbackRouter, this, i, n, e);
    const m = p[0];
    m && m.equals(u) && p.shift(), u = p[p.length - 1] || u, c.push(...p);
  }
  return n.snapToGrid ? J1(c, e.graph.grid.getGridSize()) : c;
}, xh = function(i, t, e) {
  return z(K1, this, i, Object.assign(Object.assign({}, B1), t), e);
}, Z1 = {
  maxDirectionChange: 45,
  // an array of directions to find next points on the route
  // different from start/end directions
  directions() {
    const i = Ke(this.step, this), t = Ke(this.cost, this), e = Math.ceil(Math.sqrt(i * i << 1));
    return [
      { cost: t, offsetX: i, offsetY: 0 },
      { cost: e, offsetX: i, offsetY: i },
      { cost: t, offsetX: 0, offsetY: i },
      { cost: e, offsetX: -i, offsetY: i },
      { cost: t, offsetX: -i, offsetY: 0 },
      { cost: e, offsetX: -i, offsetY: -i },
      { cost: t, offsetX: 0, offsetY: -i },
      { cost: e, offsetX: i, offsetY: -i }
    ];
  },
  // a simple route used in situations when main routing method fails
  // (exceed max number of loop iterations, inaccessible)
  fallbackRoute(i, t, e) {
    const n = i.theta(t), s = [];
    let r = { x: t.x, y: i.y }, o = { x: i.x, y: t.y };
    if (n % 180 > 90) {
      const b = r;
      r = o, o = b;
    }
    const a = n % 90 < 45 ? r : o, l = new D(i, a), c = 90 * Math.ceil(n / 90), u = x.fromPolar(l.squaredLength(), ut.toRad(c + 135), a), h = new D(t, u), d = l.intersectsWithLine(h), f = d || t, g = d ? f : i, p = 360 / e.directions.length, m = g.theta(t), y = ut.normalize(m + p / 2), v = p * Math.floor(y / p);
    return e.previousDirectionAngle = v, f && s.push(f.round()), s.push(t), s;
  }
}, Q1 = function(i, t, e) {
  return z(xh, this, i, Object.assign(Object.assign({}, Z1), t), e);
}, tE = function(i, t, e) {
  const n = t.offset || 32, s = t.min == null ? 16 : t.min;
  let r = 0, o = t.direction;
  const a = e.sourceBBox, l = e.targetBBox, c = a.getCenter(), u = l.getCenter();
  if (typeof n == "number" && (r = n), o == null) {
    let y = l.left - a.right, v = l.top - a.bottom;
    y >= 0 && v >= 0 ? o = y >= v ? "L" : "T" : y <= 0 && v >= 0 ? (y = a.left - l.right, y >= 0 ? o = y >= v ? "R" : "T" : o = "T") : y >= 0 && v <= 0 ? (v = a.top - l.bottom, v >= 0 ? o = y >= v ? "L" : "B" : o = "L") : (y = a.left - l.right, v = a.top - l.bottom, y >= 0 && v >= 0 ? o = y >= v ? "R" : "B" : y <= 0 && v >= 0 ? o = "B" : y >= 0 && v <= 0 ? o = "R" : o = Math.abs(y) > Math.abs(v) ? "R" : "B");
  }
  o === "H" ? o = u.x - c.x >= 0 ? "L" : "R" : o === "V" && (o = u.y - c.y >= 0 ? "T" : "B"), n === "center" && (o === "L" ? r = (l.left - a.right) / 2 : o === "R" ? r = (a.left - l.right) / 2 : o === "T" ? r = (l.top - a.bottom) / 2 : o === "B" && (r = (a.top - l.bottom) / 2));
  let h, d, f;
  const g = o === "L" || o === "R";
  if (g) {
    if (u.y === c.y)
      return [...i];
    f = o === "L" ? 1 : -1, h = "x", d = "width";
  } else {
    if (u.x === c.x)
      return [...i];
    f = o === "T" ? 1 : -1, h = "y", d = "height";
  }
  const p = c.clone(), m = u.clone();
  if (p[h] += f * (a[d] / 2 + r), m[h] -= f * (l[d] / 2 + r), g) {
    const y = p.x, v = m.x, b = a.width / 2 + s, w = l.width / 2 + s;
    u.x > c.x ? v <= y && (p.x = Math.max(v, c.x + b), m.x = Math.min(y, u.x - w)) : v >= y && (p.x = Math.min(v, c.x - b), m.x = Math.max(y, u.x + w));
  } else {
    const y = p.y, v = m.y, b = a.height / 2 + s, w = l.height / 2 + s;
    u.y > c.y ? v <= y && (p.y = Math.max(v, c.y + b), m.y = Math.min(y, u.y - w)) : v >= y && (p.y = Math.min(v, c.y - b), m.y = Math.max(y, u.y + w));
  }
  return [p.toJSON(), ...i, m.toJSON()];
};
function Nn(i, t) {
  if (t != null && t !== !1) {
    const e = typeof t == "boolean" ? 0 : t;
    if (e > 0) {
      const n = x.create(i[1]).move(i[2], e), s = x.create(i[1]).move(i[0], e);
      return [n.toJSON(), ...i, s.toJSON()];
    }
    {
      const n = i[1];
      return [Object.assign({}, n), ...i, Object.assign({}, n)];
    }
  }
  return i;
}
const eE = function(i, t, e) {
  const n = t.width || 50, r = (t.height || 80) / 2, o = t.angle || "auto", a = e.sourceAnchor, l = e.targetAnchor, c = e.sourceBBox, u = e.targetBBox;
  if (a.equals(l)) {
    const h = (y) => {
      const v = ut.toRad(y), b = Math.sin(v), w = Math.cos(v), E = new x(a.x + w * n, a.y + b * n), S = new x(E.x - w * r, E.y - b * r), C = S.clone().rotate(-90, E), P = S.clone().rotate(90, E);
      return [C.toJSON(), E.toJSON(), P.toJSON()];
    }, d = (y) => {
      const v = a.clone().move(y, -1), b = new D(v, y);
      return !c.containsPoint(y) && !c.intersectsWithLine(b);
    }, f = [0, 90, 180, 270, 45, 135, 225, 315];
    if (typeof o == "number")
      return Nn(h(o), t.merge);
    const g = c.getCenter();
    if (g.equals(a))
      return Nn(h(0), t.merge);
    const p = g.angleBetween(a, g.clone().translate(1, 0));
    let m = h(p);
    if (d(m[1]))
      return Nn(m, t.merge);
    for (let y = 1, v = f.length; y < v; y += 1)
      if (m = h(p + f[y]), d(m[1]))
        return Nn(m, t.merge);
    return Nn(m, t.merge);
  }
  {
    const h = new D(a, l);
    let d = h.parallel(-n), f = d.getCenter(), g = d.start.clone().move(d.end, r), p = d.end.clone().move(d.start, r);
    const m = h.parallel(-1), y = new D(m.start, f), v = new D(m.end, f);
    if ((c.containsPoint(f) || u.containsPoint(f) || c.intersectsWithLine(y) || c.intersectsWithLine(v) || u.intersectsWithLine(y) || u.intersectsWithLine(v)) && (d = h.parallel(n), f = d.getCenter(), g = d.start.clone().move(d.end, r), p = d.end.clone().move(d.start, r)), t.merge) {
      const b = new D(a, l), w = new D(f, b.center).setLength(Number.MAX_SAFE_INTEGER), E = c.intersectsWithLine(w), S = u.intersectsWithLine(w), C = E ? Array.isArray(E) ? E : [E] : [];
      S && (Array.isArray(S) ? C.push(...S) : C.push(S));
      const P = b.center.closest(C);
      P ? (e.sourceAnchor = P.clone(), e.targetAnchor = P.clone()) : (e.sourceAnchor = b.center.clone(), e.targetAnchor = b.center.clone());
    }
    return Nn([g.toJSON(), f.toJSON(), p.toJSON()], t.merge);
  }
}, nE = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  er: tE,
  loop: eE,
  manhattan: xh,
  metro: Q1,
  normal: R1,
  oneSide: D1,
  orth: bh
}, Symbol.toStringTag, { value: "Module" }));
var Qe;
(function(i) {
  i.presets = nE, i.registry = It.create({
    type: "router"
  }), i.registry.register(i.presets, !0);
})(Qe || (Qe = {}));
const iE = function(i, t, e, n = {}) {
  const s = [i, ...e, t], r = new Mt(s), o = new B(r);
  return n.raw ? o : o.serialize();
}, sE = function(i, t, e, n = {}) {
  const s = e.length === 3 ? 0 : 1, r = x.create(e[0 + s]), o = x.create(e[2 + s]), a = x.create(e[1 + s]);
  if (!x.equals(i, t)) {
    const c = new x((i.x + t.x) / 2, (i.y + t.y) / 2), u = c.angleBetween(x.create(i).rotate(90, c), a);
    u > 1 && (r.rotate(180 - u, c), o.rotate(180 - u, c), a.rotate(180 - u, c));
  }
  const l = `
     M ${i.x} ${i.y}
     Q ${r.x} ${r.y} ${a.x} ${a.y}
     Q ${o.x} ${o.y} ${t.x} ${t.y}
  `;
  return n.raw ? B.parse(l) : l;
}, rE = function(i, t, e, n = {}) {
  const s = new B();
  s.appendSegment(B.createSegment("M", i));
  const r = 1 / 3, o = 2 / 3, a = n.radius || 10;
  let l, c;
  for (let u = 0, h = e.length; u < h; u += 1) {
    const d = x.create(e[u]), f = e[u - 1] || i, g = e[u + 1] || t;
    l = c || d.distance(f) / 2, c = d.distance(g) / 2;
    const p = -Math.min(a, l), m = -Math.min(a, c), y = d.clone().move(f, p).round(), v = d.clone().move(g, m).round(), b = new x(r * y.x + o * d.x, o * d.y + r * y.y), w = new x(r * v.x + o * d.x, o * d.y + r * v.y);
    s.appendSegment(B.createSegment("L", y)), s.appendSegment(B.createSegment("C", b, w, v));
  }
  return s.appendSegment(B.createSegment("L", t)), n.raw ? s : s.serialize();
}, oE = function(i, t, e, n = {}) {
  let s, r = n.direction;
  if (e && e.length !== 0) {
    const o = [i, ...e, t], a = Et.throughPoints(o);
    s = new B(a);
  } else if (s = new B(), s.appendSegment(B.createSegment("M", i)), r || (r = Math.abs(i.x - t.x) >= Math.abs(i.y - t.y) ? "H" : "V"), r === "H") {
    const o = (i.x + t.x) / 2;
    s.appendSegment(B.createSegment("C", o, i.y, o, t.y, t.x, t.y));
  } else {
    const o = (i.y + t.y) / 2;
    s.appendSegment(B.createSegment("C", i.x, o, t.x, o, t.x, t.y));
  }
  return n.raw ? s : s.serialize();
}, gl = 1, ds = 1 / 3, fs = 2 / 3;
function aE(i) {
  let t = i.graph._jumpOverUpdateList;
  if (t == null && (t = i.graph._jumpOverUpdateList = [], i.graph.on("cell:mouseup", () => {
    const e = i.graph._jumpOverUpdateList;
    setTimeout(() => {
      for (let n = 0; n < e.length; n += 1)
        e[n].update();
    });
  }), i.graph.on("model:reseted", () => {
    t = i.graph._jumpOverUpdateList = [];
  })), t.indexOf(i) < 0) {
    t.push(i);
    const e = () => t.splice(t.indexOf(i), 1);
    i.cell.once("change:connector", e), i.cell.once("removed", e);
  }
}
function Ar(i, t, e = []) {
  const n = [i, ...e, t], s = [];
  return n.forEach((r, o) => {
    const a = n[o + 1];
    a != null && s.push(new D(r, a));
  }), s;
}
function lE(i, t) {
  const e = [];
  return t.forEach((n) => {
    const s = i.intersectsWithLine(n);
    if (s) {
      const { x: r, y: o } = s, { start: a, end: l } = n, c = Math.round(a.x) === Math.round(r) && Math.round(a.y) === Math.round(o), u = Math.round(l.x) === Math.round(r) && Math.round(l.y) === Math.round(o);
      if (c || u)
        return;
      e.push(s);
    }
  }), e;
}
function pl(i, t) {
  return new D(i, t).squaredLength();
}
function cE(i, t, e) {
  return t.reduce((n, s, r) => {
    if (Ds.includes(s))
      return n;
    const o = n.pop() || i, a = x.create(s).move(o.start, -e);
    let l = x.create(s).move(o.start, +e);
    const c = t[r + 1];
    if (c != null) {
      const d = l.distance(c);
      d <= e && (l = c.move(o.start, d), Ds.push(c));
    } else if (a.distance(o.end) < e * 2 + gl)
      return n.push(o), n;
    if (l.distance(o.start) < e * 2 + gl)
      return n.push(o), n;
    const h = new D(a, l);
    return Wi.push(h), n.push(new D(o.start, a), h, new D(l, o.end)), n;
  }, []);
}
function ml(i, t, e, n) {
  const s = new B();
  let r;
  return r = B.createSegment("M", i[0].start), s.appendSegment(r), i.forEach((o, a) => {
    if (Wi.includes(o)) {
      let l, c, u, h;
      if (e === "arc") {
        l = -90, c = o.start.diff(o.end), (c.x < 0 || c.x === 0 && c.y < 0) && (l += 180);
        const f = o.getCenter(), g = new D(f, o.end).rotate(l, f);
        let p;
        p = new D(o.start, f), u = p.pointAt(2 / 3).rotate(l, o.start), h = g.pointAt(1 / 3).rotate(-l, g.end), r = B.createSegment("C", u, h, g.end), s.appendSegment(r), p = new D(f, o.end), u = g.pointAt(1 / 3).rotate(l, g.end), h = p.pointAt(1 / 3).rotate(-l, o.end), r = B.createSegment("C", u, h, o.end), s.appendSegment(r);
      } else if (e === "gap")
        r = B.createSegment("M", o.end), s.appendSegment(r);
      else if (e === "cubic") {
        l = o.start.theta(o.end);
        const d = t * 0.6;
        let f = t * 1.35;
        c = o.start.diff(o.end), (c.x < 0 || c.x === 0 && c.y < 0) && (f *= -1), u = new x(o.start.x + d, o.start.y + f).rotate(l, o.start), h = new x(o.end.x - d, o.end.y + f).rotate(l, o.end), r = B.createSegment("C", u, h, o.end), s.appendSegment(r);
      }
    } else {
      const l = i[a + 1];
      n === 0 || !l || Wi.includes(l) ? (r = B.createSegment("L", o.end), s.appendSegment(r)) : uE(n, s, o.end, o.start, l.end);
    }
  }), s;
}
function uE(i, t, e, n, s) {
  const r = e.distance(n) / 2, o = e.distance(s) / 2, a = -Math.min(i, r), l = -Math.min(i, o), c = e.clone().move(n, a).round(), u = e.clone().move(s, l).round(), h = new x(ds * c.x + fs * e.x, fs * e.y + ds * c.y), d = new x(ds * u.x + fs * e.x, fs * e.y + ds * u.y);
  let f;
  f = B.createSegment("L", c), t.appendSegment(f), f = B.createSegment("C", h, d, u), t.appendSegment(f);
}
let Wi, Ds;
const hE = function(i, t, e, n = {}) {
  Wi = [], Ds = [], aE(this);
  const s = n.size || 5, r = n.type || "arc", o = n.radius || 0, a = n.ignoreConnectors || ["smooth"], l = this.graph, u = l.model.getEdges();
  if (u.length === 1)
    return ml(Ar(i, t, e), s, r, o);
  const h = this.cell, d = u.indexOf(h), f = l.options.connecting.connector || {}, g = u.filter((w, E) => {
    const S = w.getConnector() || f;
    return a.includes(S.name) ? !1 : E > d ? S.name !== "jumpover" : !0;
  }), p = g.map((w) => l.findViewByCell(w)), m = Ar(i, t, e), y = p.map((w) => w == null ? [] : w === this ? m : Ar(w.sourcePoint, w.targetPoint, w.routePoints)), v = [];
  m.forEach((w) => {
    const E = g.reduce((S, C, P) => {
      if (C !== h) {
        const O = lE(w, y[P]);
        S.push(...O);
      }
      return S;
    }, []).sort((S, C) => pl(w.start, S) - pl(w.start, C));
    E.length > 0 ? v.push(...cE(w, E, s)) : v.push(w);
  });
  const b = ml(v, s, r, o);
  return Wi = [], Ds = [], n.raw ? b : b.serialize();
}, dE = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  jumpover: hE,
  loop: sE,
  normal: iE,
  rounded: rE,
  smooth: oE
}, Symbol.toStringTag, { value: "Module" }));
var yn;
(function(i) {
  i.presets = dE, i.registry = It.create({
    type: "connector"
  }), i.registry.register(i.presets, !0);
})(yn || (yn = {}));
var fE = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
};
class Eh extends Nt {
  constructor(t = {}) {
    super(), this.pending = !1, this.changing = !1, this.data = {}, this.mutate(pt(t)), this.changed = {};
  }
  mutate(t, e = {}) {
    const n = e.unset === !0, s = e.silent === !0, r = [], o = this.changing;
    this.changing = !0, o || (this.previous = pt(this.data), this.changed = {});
    const a = this.data, l = this.previous, c = this.changed;
    if (Object.keys(t).forEach((u) => {
      const h = u, d = t[h];
      Me(a[h], d) || r.push(h), Me(l[h], d) ? delete c[h] : c[h] = d, n ? delete a[h] : a[h] = d;
    }), !s && r.length > 0 && (this.pending = !0, this.pendingOptions = e, r.forEach((u) => {
      this.emit("change:*", {
        key: u,
        options: e,
        store: this,
        current: a[u],
        previous: l[u]
      });
    })), o)
      return this;
    if (!s)
      for (; this.pending; )
        this.pending = !1, this.emit("changed", {
          current: a,
          previous: l,
          store: this,
          options: this.pendingOptions
        });
    return this.pending = !1, this.changing = !1, this.pendingOptions = null, this;
  }
  get(t, e) {
    if (t == null)
      return this.data;
    const n = this.data[t];
    return n ?? e;
  }
  getPrevious(t) {
    if (this.previous) {
      const e = this.previous[t];
      return e ?? void 0;
    }
  }
  set(t, e, n) {
    return t != null && (typeof t == "object" ? this.mutate(t, e) : this.mutate({ [t]: e }, n)), this;
  }
  remove(t, e) {
    const s = {};
    let r;
    if (typeof t == "string")
      s[t] = void 0, r = e;
    else if (Array.isArray(t))
      t.forEach((o) => s[o] = void 0), r = e;
    else {
      for (const o in this.data)
        s[o] = void 0;
      r = t;
    }
    return this.mutate(s, Object.assign(Object.assign({}, r), { unset: !0 })), this;
  }
  getByPath(t) {
    return To(this.data, t, "/");
  }
  setByPath(t, e, n = {}) {
    const s = "/", r = Array.isArray(t) ? [...t] : t.split(s), o = Array.isArray(t) ? t.join(s) : t, a = r[0], l = r.length;
    if (n.propertyPath = o, n.propertyValue = e, n.propertyPathArray = r, l === 1)
      this.set(a, e, n);
    else {
      const c = {};
      let u = c, h = a;
      for (let g = 1; g < l; g += 1) {
        const p = r[g], m = Number.isFinite(Number(p));
        u = u[h] = m ? [] : {}, h = p;
      }
      hi(c, r, e, s);
      const d = pt(this.data);
      n.rewrite && Ua(d, t, s);
      const f = kt(d, c);
      this.set(a, f[a], n);
    }
    return this;
  }
  removeByPath(t, e) {
    const n = Array.isArray(t) ? t : t.split("/"), s = n[0];
    if (n.length === 1)
      this.remove(s, e);
    else {
      const r = n.slice(1), o = pt(this.get(s));
      o && Ua(o, r), this.set(s, o, e);
    }
    return this;
  }
  hasChanged(t) {
    return t == null ? Object.keys(this.changed).length > 0 : t in this.changed;
  }
  /**
   * Returns an object containing all the data that have changed,
   * or `null` if there are no changes. Useful for determining what
   * parts of a view need to be updated.
   */
  getChanges(t) {
    if (t == null)
      return this.hasChanged() ? pt(this.changed) : null;
    const e = this.changing ? this.previous : this.data, n = {};
    let s;
    for (const r in t) {
      const o = t[r];
      Me(e[r], o) || (n[r] = o, s = !0);
    }
    return s ? pt(n) : null;
  }
  /**
   * Returns a copy of the store's `data` object.
   */
  toJSON() {
    return pt(this.data);
  }
  clone() {
    const t = this.constructor;
    return new t(this.data);
  }
  dispose() {
    this.off(), this.data = {}, this.previous = {}, this.changed = {}, this.pending = !1, this.changing = !1, this.pendingOptions = null, this.trigger("disposed", { store: this });
  }
}
fE([
  Nt.dispose()
], Eh.prototype, "dispose", null);
class Xi {
  constructor(t) {
    this.cell = t, this.ids = {}, this.cache = {};
  }
  get() {
    return Object.keys(this.ids);
  }
  start(t, e, n = {}, s = "/") {
    const r = this.cell.getPropByPath(t), o = Wy(n, Xi.defaultOptions), a = this.getTiming(o.timing), l = this.getInterp(o.interp, r, e);
    let c = 0;
    const u = Array.isArray(t) ? t.join(s) : t, h = Array.isArray(t) ? t : t.split(s), d = () => {
      const f = (/* @__PURE__ */ new Date()).getTime();
      c === 0 && (c = f);
      let p = (f - c) / o.duration;
      p < 1 ? this.ids[u] = requestAnimationFrame(d) : p = 1;
      const m = l(a(p));
      this.cell.setPropByPath(h, m), n.progress && n.progress(Object.assign({ progress: p, currentValue: m }, this.getArgs(u))), p === 1 && (this.cell.notify("transition:complete", this.getArgs(u)), n.complete && n.complete(this.getArgs(u)), this.cell.notify("transition:finish", this.getArgs(u)), n.finish && n.finish(this.getArgs(u)), this.clean(u));
    };
    return setTimeout(() => {
      this.stop(t, void 0, s), this.cache[u] = { startValue: r, targetValue: e, options: o }, this.ids[u] = requestAnimationFrame(d), this.cell.notify("transition:start", this.getArgs(u)), n.start && n.start(this.getArgs(u));
    }, n.delay), this.stop.bind(this, t, s, n);
  }
  stop(t, e = {}, n = "/") {
    const s = Array.isArray(t) ? t : t.split(n);
    return Object.keys(this.ids).filter((r) => Me(s, r.split(n).slice(0, s.length))).forEach((r) => {
      cancelAnimationFrame(this.ids[r]);
      const o = this.cache[r], a = this.getArgs(r), l = Object.assign(Object.assign({}, o.options), e), c = l.jumpedToEnd;
      c && o.targetValue != null && (this.cell.setPropByPath(r, o.targetValue), this.cell.notify("transition:end", Object.assign({}, a)), this.cell.notify("transition:complete", Object.assign({}, a)), l.complete && l.complete(Object.assign({}, a)));
      const u = Object.assign({ jumpedToEnd: c }, a);
      this.cell.notify("transition:stop", Object.assign({}, u)), l.stop && l.stop(Object.assign({}, u)), this.cell.notify("transition:finish", Object.assign({}, a)), l.finish && l.finish(Object.assign({}, a)), this.clean(r);
    }), this;
  }
  clean(t) {
    delete this.ids[t], delete this.cache[t];
  }
  getTiming(t) {
    return typeof t == "string" ? Cn[t] : t;
  }
  getInterp(t, e, n) {
    return t ? t(e, n) : typeof n == "number" ? mn.number(e, n) : typeof n == "string" ? n[0] === "#" ? mn.color(e, n) : mn.unit(e, n) : mn.object(e, n);
  }
  getArgs(t) {
    const e = this.cache[t];
    return {
      path: t,
      startValue: e.startValue,
      targetValue: e.targetValue,
      cell: this.cell
    };
  }
}
(function(i) {
  i.defaultOptions = {
    delay: 10,
    duration: 100,
    timing: "linear"
  };
})(Xi || (Xi = {}));
var gE = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
}, Ch = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
};
class K extends Nt {
  static config(t) {
    const { markup: e, propHooks: n, attrHooks: s } = t, r = Ch(t, ["markup", "propHooks", "attrHooks"]);
    e != null && (this.markup = e), n && (this.propHooks = this.propHooks.slice(), Array.isArray(n) ? this.propHooks.push(...n) : typeof n == "function" ? this.propHooks.push(n) : Object.values(n).forEach((o) => {
      typeof o == "function" && this.propHooks.push(o);
    })), s && (this.attrHooks = Object.assign(Object.assign({}, this.attrHooks), s)), this.defaults = kt({}, this.defaults, r);
  }
  static getMarkup() {
    return this.markup;
  }
  static getDefaults(t) {
    return t ? this.defaults : pt(this.defaults);
  }
  static getAttrHooks() {
    return this.attrHooks;
  }
  static applyPropHooks(t, e) {
    return this.propHooks.reduce((n, s) => s ? z(s, t, n) : n, e);
  }
  // #endregion
  get [Symbol.toStringTag]() {
    return K.toStringTag;
  }
  constructor(t = {}) {
    super();
    const n = this.constructor.getDefaults(!0), s = kt({}, this.preprocess(n), this.preprocess(t));
    this.id = s.id || Ps(), this.store = new Eh(s), this.animation = new Xi(this), this.setup(), this.init(), this.postprocess(t);
  }
  init() {
  }
  // #region model
  get model() {
    return this._model;
  }
  set model(t) {
    this._model !== t && (this._model = t);
  }
  // #endregion
  preprocess(t, e) {
    const n = t.id, r = this.constructor.applyPropHooks(this, t);
    return n == null && e !== !0 && (r.id = Ps()), r;
  }
  postprocess(t) {
  }
  // eslint-disable-line
  setup() {
    this.store.on("change:*", (t) => {
      const { key: e, current: n, previous: s, options: r } = t;
      this.notify("change:*", {
        key: e,
        options: r,
        current: n,
        previous: s,
        cell: this
      }), this.notify(`change:${e}`, {
        options: r,
        current: n,
        previous: s,
        cell: this
      });
      const o = e;
      (o === "source" || o === "target") && this.notify("change:terminal", {
        type: o,
        current: n,
        previous: s,
        options: r,
        cell: this
      });
    }), this.store.on("changed", ({ options: t }) => this.notify("changed", { options: t, cell: this }));
  }
  notify(t, e) {
    this.trigger(t, e);
    const n = this.model;
    return n && (n.notify(`cell:${t}`, e), this.isNode() ? n.notify(`node:${t}`, Object.assign(Object.assign({}, e), { node: this })) : this.isEdge() && n.notify(`edge:${t}`, Object.assign(Object.assign({}, e), { edge: this }))), this;
  }
  isNode() {
    return !1;
  }
  isEdge() {
    return !1;
  }
  isSameStore(t) {
    return this.store === t.store;
  }
  get view() {
    return this.store.get("view");
  }
  get shape() {
    return this.store.get("shape", "");
  }
  getProp(t, e) {
    return t == null ? this.store.get() : this.store.get(t, e);
  }
  setProp(t, e, n) {
    if (typeof t == "string")
      this.store.set(t, e, n);
    else {
      const s = this.preprocess(t, !0);
      this.store.set(kt({}, this.getProp(), s), e), this.postprocess(t);
    }
    return this;
  }
  removeProp(t, e) {
    return typeof t == "string" || Array.isArray(t) ? this.store.removeByPath(t, e) : this.store.remove(e), this;
  }
  hasChanged(t) {
    return t == null ? this.store.hasChanged() : this.store.hasChanged(t);
  }
  getPropByPath(t) {
    return this.store.getByPath(t);
  }
  setPropByPath(t, e, n = {}) {
    return this.model && (t === "children" ? this._children = e ? e.map((s) => this.model.getCell(s)).filter((s) => s != null) : null : t === "parent" && (this._parent = e ? this.model.getCell(e) : null)), this.store.setByPath(t, e, n), this;
  }
  removePropByPath(t, e = {}) {
    const n = Array.isArray(t) ? t : t.split("/");
    return n[0] === "attrs" && (e.dirty = !0), this.store.removeByPath(n, e), this;
  }
  prop(t, e, n) {
    return t == null ? this.getProp() : typeof t == "string" || Array.isArray(t) ? arguments.length === 1 ? this.getPropByPath(t) : e == null ? this.removePropByPath(t, n || {}) : this.setPropByPath(t, e, n || {}) : this.setProp(t, e || {});
  }
  previous(t) {
    return this.store.getPrevious(t);
  }
  // #endregion
  // #region zIndex
  get zIndex() {
    return this.getZIndex();
  }
  set zIndex(t) {
    t == null ? this.removeZIndex() : this.setZIndex(t);
  }
  getZIndex() {
    return this.store.get("zIndex");
  }
  setZIndex(t, e = {}) {
    return this.store.set("zIndex", t, e), this;
  }
  removeZIndex(t = {}) {
    return this.store.remove("zIndex", t), this;
  }
  toFront(t = {}) {
    const e = this.model;
    if (e) {
      let n = e.getMaxZIndex(), s;
      t.deep ? (s = this.getDescendants({ deep: !0, breadthFirst: !0 }), s.unshift(this)) : s = [this], n = n - s.length + 1;
      const r = e.total();
      let o = e.indexOf(this) !== r - s.length;
      o || (o = s.some((a, l) => a.getZIndex() !== n + l)), o && this.batchUpdate("to-front", () => {
        n += s.length, s.forEach((a, l) => {
          a.setZIndex(n + l, t);
        });
      });
    }
    return this;
  }
  toBack(t = {}) {
    const e = this.model;
    if (e) {
      let n = e.getMinZIndex(), s;
      t.deep ? (s = this.getDescendants({ deep: !0, breadthFirst: !0 }), s.unshift(this)) : s = [this];
      let r = e.indexOf(this) !== 0;
      r || (r = s.some((o, a) => o.getZIndex() !== n + a)), r && this.batchUpdate("to-back", () => {
        n -= s.length, s.forEach((o, a) => {
          o.setZIndex(n + a, t);
        });
      });
    }
    return this;
  }
  // #endregion
  // #region markup
  get markup() {
    return this.getMarkup();
  }
  set markup(t) {
    t == null ? this.removeMarkup() : this.setMarkup(t);
  }
  getMarkup() {
    let t = this.store.get("markup");
    return t == null && (t = this.constructor.getMarkup()), t;
  }
  setMarkup(t, e = {}) {
    return this.store.set("markup", t, e), this;
  }
  removeMarkup(t = {}) {
    return this.store.remove("markup", t), this;
  }
  // #endregion
  // #region attrs
  get attrs() {
    return this.getAttrs();
  }
  set attrs(t) {
    t == null ? this.removeAttrs() : this.setAttrs(t);
  }
  getAttrs() {
    const t = this.store.get("attrs");
    return t ? Object.assign({}, t) : {};
  }
  setAttrs(t, e = {}) {
    if (t == null)
      this.removeAttrs(e);
    else {
      const n = (s) => this.store.set("attrs", s, e);
      if (e.overwrite === !0)
        n(t);
      else {
        const s = this.getAttrs();
        e.deep === !1 ? n(Object.assign(Object.assign({}, s), t)) : n(kt({}, s, t));
      }
    }
    return this;
  }
  replaceAttrs(t, e = {}) {
    return this.setAttrs(t, Object.assign(Object.assign({}, e), { overwrite: !0 }));
  }
  updateAttrs(t, e = {}) {
    return this.setAttrs(t, Object.assign(Object.assign({}, e), { deep: !1 }));
  }
  removeAttrs(t = {}) {
    return this.store.remove("attrs", t), this;
  }
  getAttrDefinition(t) {
    if (!t)
      return null;
    const n = this.constructor.getAttrHooks() || {};
    let s = n[t] || je.registry.get(t);
    if (!s) {
      const r = Zs(t);
      s = n[r] || je.registry.get(r);
    }
    return s || null;
  }
  getAttrByPath(t) {
    return t == null || t === "" ? this.getAttrs() : this.getPropByPath(this.prefixAttrPath(t));
  }
  setAttrByPath(t, e, n = {}) {
    return this.setPropByPath(this.prefixAttrPath(t), e, n), this;
  }
  removeAttrByPath(t, e = {}) {
    return this.removePropByPath(this.prefixAttrPath(t), e), this;
  }
  prefixAttrPath(t) {
    return Array.isArray(t) ? ["attrs"].concat(t) : `attrs/${t}`;
  }
  attr(t, e, n) {
    return t == null ? this.getAttrByPath() : typeof t == "string" || Array.isArray(t) ? arguments.length === 1 ? this.getAttrByPath(t) : e == null ? this.removeAttrByPath(t, n || {}) : this.setAttrByPath(t, e, n || {}) : this.setAttrs(t, e || {});
  }
  // #endregion
  // #region visible
  get visible() {
    return this.isVisible();
  }
  set visible(t) {
    this.setVisible(t);
  }
  setVisible(t, e = {}) {
    return this.store.set("visible", t, e), this;
  }
  isVisible() {
    return this.store.get("visible") !== !1;
  }
  show(t = {}) {
    return this.isVisible() || this.setVisible(!0, t), this;
  }
  hide(t = {}) {
    return this.isVisible() && this.setVisible(!1, t), this;
  }
  toggleVisible(t, e = {}) {
    const n = typeof t == "boolean" ? t : !this.isVisible(), s = typeof t == "boolean" ? e : t;
    return n ? this.show(s) : this.hide(s), this;
  }
  // #endregion
  // #region data
  get data() {
    return this.getData();
  }
  set data(t) {
    this.setData(t);
  }
  getData() {
    return this.store.get("data");
  }
  setData(t, e = {}) {
    if (t == null)
      this.removeData(e);
    else {
      const n = (s) => this.store.set("data", s, e);
      if (e.overwrite === !0)
        n(t);
      else {
        const s = this.getData();
        e.deep === !1 ? n(typeof t == "object" ? Object.assign(Object.assign({}, s), t) : t) : n(kt({}, s, t));
      }
    }
    return this;
  }
  replaceData(t, e = {}) {
    return this.setData(t, Object.assign(Object.assign({}, e), { overwrite: !0 }));
  }
  updateData(t, e = {}) {
    return this.setData(t, Object.assign(Object.assign({}, e), { deep: !1 }));
  }
  removeData(t = {}) {
    return this.store.remove("data", t), this;
  }
  // #endregion
  // #region parent children
  get parent() {
    return this.getParent();
  }
  get children() {
    return this.getChildren();
  }
  getParentId() {
    return this.store.get("parent");
  }
  getParent() {
    const t = this.getParentId();
    if (t && this.model) {
      const e = this.model.getCell(t);
      return this._parent = e, e;
    }
    return null;
  }
  getChildren() {
    const t = this.store.get("children");
    if (t && t.length && this.model) {
      const e = t.map((n) => {
        var s;
        return (s = this.model) === null || s === void 0 ? void 0 : s.getCell(n);
      }).filter((n) => n != null);
      return this._children = e, [...e];
    }
    return null;
  }
  hasParent() {
    return this.parent != null;
  }
  isParentOf(t) {
    return t != null && t.getParent() === this;
  }
  isChildOf(t) {
    return t != null && this.getParent() === t;
  }
  eachChild(t, e) {
    return this.children && this.children.forEach(t, e), this;
  }
  filterChild(t, e) {
    return this.children ? this.children.filter(t, e) : [];
  }
  getChildCount() {
    return this.children == null ? 0 : this.children.length;
  }
  getChildIndex(t) {
    return this.children == null ? -1 : this.children.indexOf(t);
  }
  getChildAt(t) {
    return this.children != null && t >= 0 ? this.children[t] : null;
  }
  getAncestors(t = {}) {
    const e = [];
    let n = this.getParent();
    for (; n; )
      e.push(n), n = t.deep !== !1 ? n.getParent() : null;
    return e;
  }
  getDescendants(t = {}) {
    if (t.deep !== !1) {
      if (t.breadthFirst) {
        const e = [], n = this.getChildren() || [];
        for (; n.length > 0; ) {
          const s = n.shift(), r = s.getChildren();
          e.push(s), r && n.push(...r);
        }
        return e;
      }
      {
        const e = this.getChildren() || [];
        return e.forEach((n) => {
          e.push(...n.getDescendants(t));
        }), e;
      }
    }
    return this.getChildren() || [];
  }
  isDescendantOf(t, e = {}) {
    if (t == null)
      return !1;
    if (e.deep !== !1) {
      let n = this.getParent();
      for (; n; ) {
        if (n === t)
          return !0;
        n = n.getParent();
      }
      return !1;
    }
    return this.isChildOf(t);
  }
  isAncestorOf(t, e = {}) {
    return t == null ? !1 : t.isDescendantOf(this, e);
  }
  contains(t) {
    return this.isAncestorOf(t);
  }
  getCommonAncestor(...t) {
    return K.getCommonAncestor(this, ...t);
  }
  setParent(t, e = {}) {
    return this._parent = t, t ? this.store.set("parent", t.id, e) : this.store.remove("parent", e), this;
  }
  setChildren(t, e = {}) {
    return this._children = t, t != null ? this.store.set("children", t.map((n) => n.id), e) : this.store.remove("children", e), this;
  }
  unembed(t, e = {}) {
    const n = this.children;
    if (n != null && t != null) {
      const s = this.getChildIndex(t);
      s !== -1 && (n.splice(s, 1), t.setParent(null, e), this.setChildren(n, e));
    }
    return this;
  }
  embed(t, e = {}) {
    return t.addTo(this, e), this;
  }
  addTo(t, e = {}) {
    return K.isCell(t) ? t.addChild(this, e) : t.addCell(this, e), this;
  }
  insertTo(t, e, n = {}) {
    return t.insertChild(this, e, n), this;
  }
  addChild(t, e = {}) {
    return this.insertChild(t, void 0, e);
  }
  insertChild(t, e, n = {}) {
    if (t != null && t !== this) {
      const s = t.getParent(), r = this !== s;
      let o = e;
      if (o == null && (o = this.getChildCount(), r || (o -= 1)), s) {
        const l = s.getChildren();
        if (l) {
          const c = l.indexOf(t);
          c >= 0 && (t.setParent(null, n), l.splice(c, 1), s.setChildren(l, n));
        }
      }
      let a = this.children;
      if (a == null ? (a = [], a.push(t)) : a.splice(o, 0, t), t.setParent(this, n), this.setChildren(a, n), r && this.model) {
        const l = this.model.getIncomingEdges(this), c = this.model.getOutgoingEdges(this);
        l && l.forEach((u) => u.updateParent(n)), c && c.forEach((u) => u.updateParent(n));
      }
      this.model && this.model.addCell(t, n);
    }
    return this;
  }
  removeFromParent(t = {}) {
    const e = this.getParent();
    if (e != null) {
      const n = e.getChildIndex(this);
      e.removeChildAt(n, t);
    }
    return this;
  }
  removeChild(t, e = {}) {
    const n = this.getChildIndex(t);
    return this.removeChildAt(n, e);
  }
  removeChildAt(t, e = {}) {
    const n = this.getChildAt(t);
    return this.children != null && n != null && (this.unembed(n, e), n.remove(e)), n;
  }
  remove(t = {}) {
    return this.batchUpdate("remove", () => {
      const e = this.getParent();
      e && e.removeChild(this, t), t.deep !== !1 && this.eachChild((n) => n.remove(t)), this.model && this.model.removeCell(this, t);
    }), this;
  }
  transition(t, e, n = {}, s = "/") {
    return this.animation.start(t, e, n, s);
  }
  stopTransition(t, e, n = "/") {
    return this.animation.stop(t, e, n), this;
  }
  getTransitions() {
    return this.animation.get();
  }
  // #endregion
  // #region transform
  // eslint-disable-next-line
  translate(t, e, n) {
    return this;
  }
  scale(t, e, n, s) {
    return this;
  }
  addTools(t, e, n) {
    const s = Array.isArray(t) ? t : [t], r = typeof e == "string" ? e : null, o = typeof e == "object" ? e : typeof n == "object" ? n : {};
    if (o.reset)
      return this.setTools({ name: r, items: s, local: o.local }, o);
    let a = pt(this.getTools());
    if (a == null || r == null || a.name === r)
      return a == null && (a = {}), a.items || (a.items = []), a.name = r, a.items = [...a.items, ...s], this.setTools(Object.assign({}, a), o);
  }
  setTools(t, e = {}) {
    return t == null ? this.removeTools() : this.store.set("tools", K.normalizeTools(t), e), this;
  }
  getTools() {
    return this.store.get("tools");
  }
  removeTools(t = {}) {
    return this.store.remove("tools", t), this;
  }
  hasTools(t) {
    const e = this.getTools();
    return e == null ? !1 : t == null ? !0 : e.name === t;
  }
  hasTool(t) {
    const e = this.getTools();
    return e == null ? !1 : e.items.some((n) => typeof n == "string" ? n === t : n.name === t);
  }
  removeTool(t, e = {}) {
    const n = pt(this.getTools());
    if (n) {
      let s = !1;
      const r = n.items.slice(), o = (a) => {
        r.splice(a, 1), s = !0;
      };
      if (typeof t == "number")
        o(t);
      else
        for (let a = r.length - 1; a >= 0; a -= 1) {
          const l = r[a];
          (typeof l == "string" ? l === t : l.name === t) && o(a);
        }
      s && (n.items = r, this.setTools(n, e));
    }
    return this;
  }
  // #endregion
  // #region common
  // eslint-disable-next-line
  getBBox(t) {
    return new R();
  }
  // eslint-disable-next-line
  getConnectionPoint(t, e) {
    return new x();
  }
  toJSON(t = {}) {
    const e = Object.assign({}, this.store.get()), n = Object.prototype.toString, s = this.isNode() ? "node" : this.isEdge() ? "edge" : "cell";
    if (!e.shape) {
      const g = this.constructor;
      throw new Error(`Unable to serialize ${s} missing "shape" prop, check the ${s} "${g.name || n.call(g)}"`);
    }
    const r = this.constructor, o = t.diff === !0, a = e.attrs || {}, l = r.getDefaults(!0), c = o ? this.preprocess(l, !0) : l, u = c.attrs || {}, h = {};
    Object.entries(e).forEach(([g, p]) => {
      if (p != null && !Array.isArray(p) && typeof p == "object" && !ke(p))
        throw new Error(`Can only serialize ${s} with plain-object props, but got a "${n.call(p)}" type of key "${g}" on ${s} "${this.id}"`);
      if (g !== "attrs" && g !== "shape" && o) {
        const m = c[g];
        Me(p, m) && delete e[g];
      }
    }), Object.keys(a).forEach((g) => {
      const p = a[g], m = u[g];
      Object.keys(p).forEach((y) => {
        const v = p[y], b = m ? m[y] : null;
        v != null && typeof v == "object" && !Array.isArray(v) ? Object.keys(v).forEach((w) => {
          const E = v[w];
          if (m == null || b == null || !Ct(b) || !Me(b[w], E)) {
            h[g] == null && (h[g] = {}), h[g][y] == null && (h[g][y] = {});
            const S = h[g][y];
            S[w] = E;
          }
        }) : (m == null || !Me(b, v)) && (h[g] == null && (h[g] = {}), h[g][y] = v);
      });
    });
    const d = Object.assign(Object.assign({}, e), { attrs: Wc(h) ? void 0 : h });
    d.attrs == null && delete d.attrs;
    const f = d;
    return f.angle === 0 && delete f.angle, pt(f);
  }
  clone(t = {}) {
    if (!t.deep) {
      const n = Object.assign({}, this.store.get());
      t.keepId || delete n.id, delete n.parent, delete n.children;
      const s = this.constructor;
      return new s(n);
    }
    return K.deepClone(this)[this.id];
  }
  findView(t) {
    return t.findViewByCell(this);
  }
  // #endregion
  // #region batch
  startBatch(t, e = {}, n = this.model) {
    return this.notify("batch:start", { name: t, data: e, cell: this }), n && n.startBatch(t, Object.assign(Object.assign({}, e), { cell: this })), this;
  }
  stopBatch(t, e = {}, n = this.model) {
    return n && n.stopBatch(t, Object.assign(Object.assign({}, e), { cell: this })), this.notify("batch:stop", { name: t, data: e, cell: this }), this;
  }
  batchUpdate(t, e, n) {
    const s = this.model;
    this.startBatch(t, n, s);
    const r = e();
    return this.stopBatch(t, n, s), r;
  }
  // #endregion
  // #region IDisposable
  dispose() {
    this.removeFromParent(), this.store.dispose();
  }
}
K.defaults = {};
K.attrHooks = {};
K.propHooks = [];
gE([
  Nt.dispose()
], K.prototype, "dispose", null);
(function(i) {
  function t(e) {
    return typeof e == "string" ? { items: [e] } : Array.isArray(e) ? { items: e } : e.items ? e : {
      items: [e]
    };
  }
  i.normalizeTools = t;
})(K || (K = {}));
(function(i) {
  i.toStringTag = `X6.${i.name}`;
  function t(e) {
    if (e == null)
      return !1;
    if (e instanceof i)
      return !0;
    const n = e[Symbol.toStringTag], s = e;
    return (n == null || n === i.toStringTag) && typeof s.isNode == "function" && typeof s.isEdge == "function" && typeof s.prop == "function" && typeof s.attr == "function";
  }
  i.isCell = t;
})(K || (K = {}));
(function(i) {
  function t(...r) {
    const o = r.filter((l) => l != null).map((l) => l.getAncestors()).sort((l, c) => l.length - c.length);
    return o.shift().find((l) => o.every((c) => c.includes(l))) || null;
  }
  i.getCommonAncestor = t;
  function e(r, o = {}) {
    let a = null;
    for (let l = 0, c = r.length; l < c; l += 1) {
      const u = r[l];
      let h = u.getBBox(o);
      if (h) {
        if (u.isNode()) {
          const d = u.getAngle();
          d != null && d !== 0 && (h = h.bbox(d));
        }
        a = a == null ? h : a.union(h);
      }
    }
    return a;
  }
  i.getCellsBBox = e;
  function n(r) {
    const o = [r, ...r.getDescendants({ deep: !0 })];
    return i.cloneCells(o);
  }
  i.deepClone = n;
  function s(r) {
    const o = Jc(r), a = o.reduce((l, c) => (l[c.id] = c.clone(), l), {});
    return o.forEach((l) => {
      const c = a[l.id];
      if (c.isEdge()) {
        const d = c.getSourceCellId(), f = c.getTargetCellId();
        d && a[d] && c.setSource(Object.assign(Object.assign({}, c.getSource()), { cell: a[d].id })), f && a[f] && c.setTarget(Object.assign(Object.assign({}, c.getTarget()), { cell: a[f].id }));
      }
      const u = l.getParent();
      u && a[u.id] && c.setParent(a[u.id]);
      const h = l.getChildren();
      if (h && h.length) {
        const d = h.reduce((f, g) => (a[g.id] && f.push(a[g.id]), f), []);
        d.length > 0 && c.setChildren(d);
      }
    }), a;
  }
  i.cloneCells = s;
})(K || (K = {}));
(function(i) {
  i.config({
    propHooks(t) {
      var { tools: e } = t, n = Ch(t, ["tools"]);
      return e && (n.tools = i.normalizeTools(e)), n;
    }
  });
})(K || (K = {}));
var ti;
(function(i) {
  let t, e;
  function n(o, a) {
    return a ? t != null && t.exist(o) : e != null && e.exist(o);
  }
  i.exist = n;
  function s(o) {
    t = o;
  }
  i.setEdgeRegistry = s;
  function r(o) {
    e = o;
  }
  i.setNodeRegistry = r;
})(ti || (ti = {}));
class pE {
  constructor(t) {
    this.ports = [], this.groups = {}, this.init(pt(t));
  }
  getPorts() {
    return this.ports;
  }
  getGroup(t) {
    return t != null ? this.groups[t] : null;
  }
  getPortsByGroup(t) {
    return this.ports.filter((e) => e.group === t || e.group == null && t == null);
  }
  getPortsLayoutByGroup(t, e) {
    const n = this.getPortsByGroup(t), s = t ? this.getGroup(t) : null, r = s ? s.position : null, o = r ? r.name : null;
    let a;
    if (o != null) {
      const h = bn.registry.get(o);
      if (h == null)
        return bn.registry.onNotFound(o);
      a = h;
    } else
      a = bn.presets.left;
    const l = n.map((h) => h && h.position && h.position.args || {}), c = r && r.args || {};
    return a(l, e, c).map((h, d) => {
      const f = n[d];
      return {
        portLayout: h,
        portId: f.id,
        portSize: f.size,
        portAttrs: f.attrs,
        labelSize: f.label.size,
        labelLayout: this.getPortLabelLayout(f, x.create(h.position), e)
      };
    });
  }
  init(t) {
    const { groups: e, items: n } = t;
    e != null && Object.keys(e).forEach((s) => {
      this.groups[s] = this.parseGroup(e[s]);
    }), Array.isArray(n) && n.forEach((s) => {
      this.ports.push(this.parsePort(s));
    });
  }
  parseGroup(t) {
    return Object.assign(Object.assign({}, t), { label: this.getLabel(t, !0), position: this.getPortPosition(t.position, !0) });
  }
  parsePort(t) {
    const e = Object.assign({}, t), n = this.getGroup(t.group) || {};
    return e.markup = e.markup || n.markup, e.attrs = kt({}, n.attrs, e.attrs), e.position = this.createPosition(n, e), e.label = kt({}, n.label, this.getLabel(e)), e.zIndex = this.getZIndex(n, e), e.size = Object.assign(Object.assign({}, n.size), e.size), e;
  }
  getZIndex(t, e) {
    return typeof e.zIndex == "number" ? e.zIndex : typeof t.zIndex == "number" || t.zIndex === "auto" ? t.zIndex : "auto";
  }
  createPosition(t, e) {
    return kt({
      name: "left",
      args: {}
    }, t.position, { args: e.args });
  }
  getPortPosition(t, e = !1) {
    if (t == null) {
      if (e)
        return { name: "left", args: {} };
    } else {
      if (typeof t == "string")
        return {
          name: t,
          args: {}
        };
      if (Array.isArray(t))
        return {
          name: "absolute",
          args: { x: t[0], y: t[1] }
        };
      if (typeof t == "object")
        return t;
    }
    return { args: {} };
  }
  getPortLabelPosition(t, e = !1) {
    if (t == null) {
      if (e)
        return { name: "left", args: {} };
    } else {
      if (typeof t == "string")
        return {
          name: t,
          args: {}
        };
      if (typeof t == "object")
        return t;
    }
    return { args: {} };
  }
  getLabel(t, e = !1) {
    const n = t.label || {};
    return n.position = this.getPortLabelPosition(n.position, e), n;
  }
  getPortLabelLayout(t, e, n) {
    const s = t.label.position.name || "left", r = t.label.position.args || {}, o = Wn.registry.get(s) || Wn.presets.left;
    return o ? o(e, n, r) : null;
  }
}
var cr = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
};
let vt = class Sh extends K {
  get [Symbol.toStringTag]() {
    return Sh.toStringTag;
  }
  constructor(t = {}) {
    super(t), this.initPorts();
  }
  preprocess(t, e) {
    const { x: n, y: s, width: r, height: o } = t, a = cr(t, ["x", "y", "width", "height"]);
    if (n != null || s != null) {
      const l = a.position;
      a.position = Object.assign(Object.assign({}, l), { x: n ?? (l ? l.x : 0), y: s ?? (l ? l.y : 0) });
    }
    if (r != null || o != null) {
      const l = a.size;
      a.size = Object.assign(Object.assign({}, l), { width: r ?? (l ? l.width : 0), height: o ?? (l ? l.height : 0) });
    }
    return super.preprocess(a, e);
  }
  isNode() {
    return !0;
  }
  size(t, e, n) {
    return t === void 0 ? this.getSize() : typeof t == "number" ? this.setSize(t, e, n) : this.setSize(t, e);
  }
  getSize() {
    const t = this.store.get("size");
    return t ? Object.assign({}, t) : { width: 1, height: 1 };
  }
  setSize(t, e, n) {
    return typeof t == "object" ? this.resize(t.width, t.height, e) : this.resize(t, e, n), this;
  }
  resize(t, e, n = {}) {
    this.startBatch("resize", n);
    const s = n.direction;
    if (s) {
      const r = this.getSize();
      switch (s) {
        case "left":
        case "right":
          e = r.height;
          break;
        case "top":
        case "bottom":
          t = r.width;
          break;
      }
      let a = {
        right: 0,
        "top-right": 0,
        top: 1,
        "top-left": 1,
        left: 2,
        "bottom-left": 2,
        bottom: 3,
        "bottom-right": 3
      }[s];
      const l = ut.normalize(this.getAngle() || 0);
      n.absolute && (a += Math.floor((l + 45) / 90), a %= 4);
      const c = this.getBBox();
      let u;
      a === 0 ? u = c.getBottomLeft() : a === 1 ? u = c.getCorner() : a === 2 ? u = c.getTopRight() : u = c.getOrigin();
      const h = u.clone().rotate(-l, c.getCenter()), d = Math.sqrt(t * t + e * e) / 2;
      let f = a * Math.PI / 2;
      f += Math.atan(a % 2 === 0 ? e / t : t / e), f -= ut.toRad(l);
      const p = x.fromPolar(d, f, h).clone().translate(t / -2, e / -2);
      this.store.set("size", { width: t, height: e }, n), this.setPosition(p.x, p.y, n);
    } else
      this.store.set("size", { width: t, height: e }, n);
    return this.stopBatch("resize", n), this;
  }
  scale(t, e, n, s = {}) {
    const r = this.getBBox().scale(t, e, n ?? void 0);
    return this.startBatch("scale", s), this.setPosition(r.x, r.y, s), this.resize(r.width, r.height, s), this.stopBatch("scale"), this;
  }
  position(t, e, n) {
    return typeof t == "number" ? this.setPosition(t, e, n) : this.getPosition(t);
  }
  getPosition(t = {}) {
    if (t.relative) {
      const n = this.getParent();
      if (n != null && n.isNode()) {
        const s = this.getPosition(), r = n.getPosition();
        return {
          x: s.x - r.x,
          y: s.y - r.y
        };
      }
    }
    const e = this.store.get("position");
    return e ? Object.assign({}, e) : { x: 0, y: 0 };
  }
  setPosition(t, e, n = {}) {
    let s, r, o;
    if (typeof t == "object" ? (s = t.x, r = t.y, o = e || {}) : (s = t, r = e, o = n || {}), o.relative) {
      const a = this.getParent();
      if (a != null && a.isNode()) {
        const l = a.getPosition();
        s += l.x, r += l.y;
      }
    }
    if (o.deep) {
      const a = this.getPosition();
      this.translate(s - a.x, r - a.y, o);
    } else
      this.store.set("position", { x: s, y: r }, o);
    return this;
  }
  translate(t = 0, e = 0, n = {}) {
    if (t === 0 && e === 0)
      return this;
    n.translateBy = n.translateBy || this.id;
    const s = this.getPosition();
    if (n.restrict != null && n.translateBy === this.id) {
      const o = this.getBBox({ deep: !0 }), a = n.restrict, l = s.x - o.x, c = s.y - o.y, u = Math.max(a.x + l, Math.min(a.x + a.width + l - o.width, s.x + t)), h = Math.max(a.y + c, Math.min(a.y + a.height + c - o.height, s.y + e));
      t = u - s.x, e = h - s.y;
    }
    const r = {
      x: s.x + t,
      y: s.y + e
    };
    return n.tx = t, n.ty = e, n.transition ? (typeof n.transition != "object" && (n.transition = {}), this.transition("position", r, Object.assign(Object.assign({}, n.transition), { interp: mn.object })), this.eachChild((o) => {
      var a;
      ((a = n.exclude) === null || a === void 0 ? void 0 : a.includes(o)) || o.translate(t, e, n);
    })) : (this.startBatch("translate", n), this.store.set("position", r, n), this.eachChild((o) => {
      var a;
      ((a = n.exclude) === null || a === void 0 ? void 0 : a.includes(o)) || o.translate(t, e, n);
    }), this.stopBatch("translate", n)), this;
  }
  angle(t, e) {
    return t == null ? this.getAngle() : this.rotate(t, e);
  }
  getAngle() {
    return this.store.get("angle", 0);
  }
  rotate(t, e = {}) {
    const n = this.getAngle();
    if (e.center) {
      const s = this.getSize(), r = this.getPosition(), o = this.getBBox().getCenter();
      o.rotate(n - t, e.center);
      const a = o.x - s.width / 2 - r.x, l = o.y - s.height / 2 - r.y;
      this.startBatch("rotate", { angle: t, options: e }), this.setPosition(r.x + a, r.y + l, e), this.rotate(t, Object.assign(Object.assign({}, e), { center: null })), this.stopBatch("rotate");
    } else
      this.store.set("angle", e.absolute ? t : (n + t) % 360, e);
    return this;
  }
  // #endregion
  // #region common
  getBBox(t = {}) {
    if (t.deep) {
      const e = this.getDescendants({ deep: !0, breadthFirst: !0 });
      return e.push(this), K.getCellsBBox(e);
    }
    return R.fromPositionAndSize(this.getPosition(), this.getSize());
  }
  getConnectionPoint(t, e) {
    const n = this.getBBox(), s = n.getCenter(), r = t.getTerminal(e);
    if (r == null)
      return s;
    const o = r.port;
    if (!o || !this.hasPort(o))
      return s;
    const a = this.getPort(o);
    if (!a || !a.group)
      return s;
    const c = this.getPortsPosition(a.group)[o].position, u = x.create(c).translate(n.getOrigin()), h = this.getAngle();
    return h && u.rotate(-h, s), u;
  }
  /**
   * Sets cell's size and position based on the children bbox and given padding.
   */
  fit(t = {}) {
    const n = (this.getChildren() || []).filter((c) => c.isNode());
    if (n.length === 0)
      return this;
    this.startBatch("fit-embeds", t), t.deep && n.forEach((c) => c.fit(t));
    let { x: s, y: r, width: o, height: a } = K.getCellsBBox(n);
    const l = xn(t.padding);
    return s -= l.left, r -= l.top, o += l.left + l.right, a += l.bottom + l.top, this.store.set({
      position: { x: s, y: r },
      size: { width: o, height: a }
    }, t), this.stopBatch("fit-embeds"), this;
  }
  // #endregion
  // #region ports
  get portContainerMarkup() {
    return this.getPortContainerMarkup();
  }
  set portContainerMarkup(t) {
    this.setPortContainerMarkup(t);
  }
  getDefaultPortContainerMarkup() {
    return this.store.get("defaultPortContainerMarkup") || mt.getPortContainerMarkup();
  }
  getPortContainerMarkup() {
    return this.store.get("portContainerMarkup") || this.getDefaultPortContainerMarkup();
  }
  setPortContainerMarkup(t, e = {}) {
    return this.store.set("portContainerMarkup", mt.clone(t), e), this;
  }
  get portMarkup() {
    return this.getPortMarkup();
  }
  set portMarkup(t) {
    this.setPortMarkup(t);
  }
  getDefaultPortMarkup() {
    return this.store.get("defaultPortMarkup") || mt.getPortMarkup();
  }
  getPortMarkup() {
    return this.store.get("portMarkup") || this.getDefaultPortMarkup();
  }
  setPortMarkup(t, e = {}) {
    return this.store.set("portMarkup", mt.clone(t), e), this;
  }
  get portLabelMarkup() {
    return this.getPortLabelMarkup();
  }
  set portLabelMarkup(t) {
    this.setPortLabelMarkup(t);
  }
  getDefaultPortLabelMarkup() {
    return this.store.get("defaultPortLabelMarkup") || mt.getPortLabelMarkup();
  }
  getPortLabelMarkup() {
    return this.store.get("portLabelMarkup") || this.getDefaultPortLabelMarkup();
  }
  setPortLabelMarkup(t, e = {}) {
    return this.store.set("portLabelMarkup", mt.clone(t), e), this;
  }
  get ports() {
    const t = this.store.get("ports", { items: [] });
    return t.items == null && (t.items = []), t;
  }
  getPorts() {
    return pt(this.ports.items);
  }
  getPortsByGroup(t) {
    return this.getPorts().filter((e) => e.group === t);
  }
  getPort(t) {
    return pt(this.ports.items.find((e) => e.id && e.id === t));
  }
  getPortAt(t) {
    return this.ports.items[t] || null;
  }
  hasPorts() {
    return this.ports.items.length > 0;
  }
  hasPort(t) {
    return this.getPortIndex(t) !== -1;
  }
  getPortIndex(t) {
    const e = typeof t == "string" ? t : t.id;
    return e != null ? this.ports.items.findIndex((n) => n.id === e) : -1;
  }
  getPortsPosition(t) {
    const e = this.getSize();
    return this.port.getPortsLayoutByGroup(t, new R(0, 0, e.width, e.height)).reduce((s, r) => {
      const o = r.portLayout;
      return s[r.portId] = {
        position: Object.assign({}, o.position),
        angle: o.angle || 0
      }, s;
    }, {});
  }
  getPortProp(t, e) {
    return this.getPropByPath(this.prefixPortPath(t, e));
  }
  setPortProp(t, e, n, s) {
    if (typeof e == "string" || Array.isArray(e)) {
      const a = this.prefixPortPath(t, e), l = n;
      return this.setPropByPath(a, l, s);
    }
    const r = this.prefixPortPath(t), o = e;
    return this.setPropByPath(r, o, n);
  }
  removePortProp(t, e, n) {
    return typeof e == "string" || Array.isArray(e) ? this.removePropByPath(this.prefixPortPath(t, e), n) : this.removePropByPath(this.prefixPortPath(t), e);
  }
  portProp(t, e, n, s) {
    return e == null ? this.getPortProp(t) : typeof e == "string" || Array.isArray(e) ? arguments.length === 2 ? this.getPortProp(t, e) : n == null ? this.removePortProp(t, e, s) : this.setPortProp(t, e, n, s) : this.setPortProp(t, e, n);
  }
  prefixPortPath(t, e) {
    const n = this.getPortIndex(t);
    if (n === -1)
      throw new Error(`Unable to find port with id: "${t}"`);
    return e == null || e === "" ? ["ports", "items", `${n}`] : Array.isArray(e) ? ["ports", "items", `${n}`, ...e] : `ports/items/${n}/${e}`;
  }
  addPort(t, e) {
    const n = [...this.ports.items];
    return n.push(t), this.setPropByPath("ports/items", n, e), this;
  }
  addPorts(t, e) {
    return this.setPropByPath("ports/items", [...this.ports.items, ...t], e), this;
  }
  insertPort(t, e, n) {
    const s = [...this.ports.items];
    return s.splice(t, 0, e), this.setPropByPath("ports/items", s, n), this;
  }
  removePort(t, e = {}) {
    return this.removePortAt(this.getPortIndex(t), e);
  }
  removePortAt(t, e = {}) {
    if (t >= 0) {
      const n = [...this.ports.items];
      n.splice(t, 1), e.rewrite = !0, this.setPropByPath("ports/items", n, e);
    }
    return this;
  }
  removePorts(t, e) {
    let n;
    if (Array.isArray(t)) {
      if (n = e || {}, t.length) {
        n.rewrite = !0;
        const r = [...this.ports.items].filter((o) => !t.some((a) => {
          const l = typeof a == "string" ? a : a.id;
          return o.id === l;
        }));
        this.setPropByPath("ports/items", r, n);
      }
    } else
      n = t || {}, n.rewrite = !0, this.setPropByPath("ports/items", [], n);
    return this;
  }
  getParsedPorts() {
    return this.port.getPorts();
  }
  getParsedGroups() {
    return this.port.groups;
  }
  getPortsLayoutByGroup(t, e) {
    return this.port.getPortsLayoutByGroup(t, e);
  }
  initPorts() {
    this.updatePortData(), this.on("change:ports", () => {
      this.processRemovedPort(), this.updatePortData();
    });
  }
  processRemovedPort() {
    const t = this.ports, e = {};
    t.items.forEach((o) => {
      o.id && (e[o.id] = !0);
    });
    const n = {};
    (this.store.getPrevious("ports") || {
      items: []
    }).items.forEach((o) => {
      o.id && !e[o.id] && (n[o.id] = !0);
    });
    const r = this.model;
    r && !Wc(n) && (r.getConnectedEdges(this, { incoming: !0 }).forEach((l) => {
      const c = l.getTargetPortId();
      c && n[c] && l.remove();
    }), r.getConnectedEdges(this, { outgoing: !0 }).forEach((l) => {
      const c = l.getSourcePortId();
      c && n[c] && l.remove();
    }));
  }
  validatePorts() {
    const t = {}, e = [];
    return this.ports.items.forEach((n) => {
      typeof n != "object" && e.push(`Invalid port ${n}.`), n.id == null && (n.id = this.generatePortId()), t[n.id] && e.push("Duplicitied port id."), t[n.id] = !0;
    }), e;
  }
  generatePortId() {
    return Ps();
  }
  updatePortData() {
    const t = this.validatePorts();
    if (t.length > 0)
      throw this.store.set("ports", this.store.getPrevious("ports")), new Error(t.join(" "));
    const e = this.port ? this.port.getPorts() : null;
    this.port = new pE(this.ports);
    const n = this.port.getPorts(), s = e ? n.filter((o) => e.find((a) => a.id === o.id) ? null : o) : [...n], r = e ? e.filter((o) => n.find((a) => a.id === o.id) ? null : o) : [];
    s.length > 0 && this.notify("ports:added", { added: s, cell: this, node: this }), r.length > 0 && this.notify("ports:removed", { removed: r, cell: this, node: this });
  }
};
vt.defaults = {
  angle: 0,
  position: { x: 0, y: 0 },
  size: { width: 1, height: 1 }
};
(function(i) {
  i.toStringTag = `X6.${i.name}`;
  function t(e) {
    if (e == null)
      return !1;
    if (e instanceof i)
      return !0;
    const n = e[Symbol.toStringTag], s = e;
    return (n == null || n === i.toStringTag) && typeof s.isNode == "function" && typeof s.isEdge == "function" && typeof s.prop == "function" && typeof s.attr == "function" && typeof s.size == "function" && typeof s.position == "function";
  }
  i.isNode = t;
})(vt || (vt = {}));
(function(i) {
  i.config({
    propHooks(t) {
      var { ports: e } = t, n = cr(t, ["ports"]);
      return e && (n.ports = Array.isArray(e) ? { items: e } : e), n;
    }
  });
})(vt || (vt = {}));
(function(i) {
  i.registry = It.create({
    type: "node",
    process(t, e) {
      if (ti.exist(t, !0))
        throw new Error(`Node with name '${t}' was registered by anthor Edge`);
      if (typeof e == "function")
        return e.config({ shape: t }), e;
      let n = i;
      const { inherit: s } = e, r = cr(e, ["inherit"]);
      if (s)
        if (typeof s == "string") {
          const a = this.get(s);
          a == null ? this.onNotFound(s, "inherited") : n = a;
        } else
          n = s;
      r.constructorName == null && (r.constructorName = t);
      const o = n.define.call(n, r);
      return o.config({ shape: t }), o;
    }
  }), ti.setNodeRegistry(i.registry);
})(vt || (vt = {}));
(function(i) {
  let t = 0;
  function e(r) {
    return r ? No(r) : (t += 1, `CustomNode${t}`);
  }
  function n(r) {
    const { constructorName: o, overwrite: a } = r, l = cr(r, ["constructorName", "overwrite"]), c = Mo(e(o || l.shape), this);
    return c.config(l), l.shape && i.registry.register(l.shape, c, a), c;
  }
  i.define = n;
  function s(r) {
    const o = r.shape || "rect", a = i.registry.get(o);
    return a ? new a(r) : i.registry.onNotFound(o);
  }
  i.create = s;
})(vt || (vt = {}));
var ur = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
};
let St = class Ph extends K {
  get [Symbol.toStringTag]() {
    return Ph.toStringTag;
  }
  constructor(t = {}) {
    super(t);
  }
  preprocess(t, e) {
    const { source: n, sourceCell: s, sourcePort: r, sourcePoint: o, target: a, targetCell: l, targetPort: c, targetPoint: u } = t, d = ur(t, ["source", "sourceCell", "sourcePort", "sourcePoint", "target", "targetCell", "targetPort", "targetPoint"]), f = (g) => typeof g == "string" || typeof g == "number";
    if (n != null)
      if (K.isCell(n))
        d.source = { cell: n.id };
      else if (f(n))
        d.source = { cell: n };
      else if (x.isPoint(n))
        d.source = n.toJSON();
      else if (Array.isArray(n))
        d.source = { x: n[0], y: n[1] };
      else {
        const g = n.cell;
        K.isCell(g) ? d.source = Object.assign(Object.assign({}, n), { cell: g.id }) : d.source = n;
      }
    if (s != null || r != null) {
      let g = d.source;
      if (s != null) {
        const p = f(s) ? s : s.id;
        g ? g.cell = p : g = d.source = { cell: p };
      }
      r != null && g && (g.port = r);
    } else o != null && (d.source = x.create(o).toJSON());
    if (a != null)
      if (K.isCell(a))
        d.target = { cell: a.id };
      else if (f(a))
        d.target = { cell: a };
      else if (x.isPoint(a))
        d.target = a.toJSON();
      else if (Array.isArray(a))
        d.target = { x: a[0], y: a[1] };
      else {
        const g = a.cell;
        K.isCell(g) ? d.target = Object.assign(Object.assign({}, a), { cell: g.id }) : d.target = a;
      }
    if (l != null || c != null) {
      let g = d.target;
      if (l != null) {
        const p = f(l) ? l : l.id;
        g ? g.cell = p : g = d.target = { cell: p };
      }
      c != null && g && (g.port = c);
    } else u != null && (d.target = x.create(u).toJSON());
    return super.preprocess(d, e);
  }
  setup() {
    super.setup(), this.on("change:labels", (t) => this.onLabelsChanged(t)), this.on("change:vertices", (t) => this.onVertexsChanged(t));
  }
  isEdge() {
    return !0;
  }
  // #region terminal
  disconnect(t = {}) {
    return this.store.set({
      source: { x: 0, y: 0 },
      target: { x: 0, y: 0 }
    }, t), this;
  }
  get source() {
    return this.getSource();
  }
  set source(t) {
    this.setSource(t);
  }
  getSource() {
    return this.getTerminal("source");
  }
  getSourceCellId() {
    return this.source.cell;
  }
  getSourcePortId() {
    return this.source.port;
  }
  setSource(t, e, n = {}) {
    return this.setTerminal("source", t, e, n);
  }
  get target() {
    return this.getTarget();
  }
  set target(t) {
    this.setTarget(t);
  }
  getTarget() {
    return this.getTerminal("target");
  }
  getTargetCellId() {
    return this.target.cell;
  }
  getTargetPortId() {
    return this.target.port;
  }
  setTarget(t, e, n = {}) {
    return this.setTerminal("target", t, e, n);
  }
  getTerminal(t) {
    return Object.assign({}, this.store.get(t));
  }
  setTerminal(t, e, n, s = {}) {
    if (K.isCell(e))
      return this.store.set(t, kt({}, n, { cell: e.id }), s), this;
    const r = e;
    return x.isPoint(e) || r.x != null && r.y != null ? (this.store.set(t, kt({}, n, { x: r.x, y: r.y }), s), this) : (this.store.set(t, pt(e), s), this);
  }
  getSourcePoint() {
    return this.getTerminalPoint("source");
  }
  getTargetPoint() {
    return this.getTerminalPoint("target");
  }
  getTerminalPoint(t) {
    const e = this[t];
    if (x.isPointLike(e))
      return x.create(e);
    const n = this.getTerminalCell(t);
    return n ? n.getConnectionPoint(this, t) : new x();
  }
  getSourceCell() {
    return this.getTerminalCell("source");
  }
  getTargetCell() {
    return this.getTerminalCell("target");
  }
  getTerminalCell(t) {
    if (this.model) {
      const e = t === "source" ? this.getSourceCellId() : this.getTargetCellId();
      if (e)
        return this.model.getCell(e);
    }
    return null;
  }
  getSourceNode() {
    return this.getTerminalNode("source");
  }
  getTargetNode() {
    return this.getTerminalNode("target");
  }
  getTerminalNode(t) {
    let e = this;
    const n = {};
    for (; e && e.isEdge(); ) {
      if (n[e.id])
        return null;
      n[e.id] = !0, e = e.getTerminalCell(t);
    }
    return e && e.isNode() ? e : null;
  }
  // #endregion
  // #region router
  get router() {
    return this.getRouter();
  }
  set router(t) {
    t == null ? this.removeRouter() : this.setRouter(t);
  }
  getRouter() {
    return this.store.get("router");
  }
  setRouter(t, e, n) {
    return typeof t == "object" ? this.store.set("router", t, e) : this.store.set("router", { name: t, args: e }, n), this;
  }
  removeRouter(t = {}) {
    return this.store.remove("router", t), this;
  }
  // #endregion
  // #region connector
  get connector() {
    return this.getConnector();
  }
  set connector(t) {
    t == null ? this.removeConnector() : this.setConnector(t);
  }
  getConnector() {
    return this.store.get("connector");
  }
  setConnector(t, e, n) {
    return typeof t == "object" ? this.store.set("connector", t, e) : this.store.set("connector", { name: t, args: e }, n), this;
  }
  removeConnector(t = {}) {
    return this.store.remove("connector", t);
  }
  // #endregion
  // #region labels
  getDefaultLabel() {
    const t = this.constructor, e = this.store.get("defaultLabel") || t.defaultLabel || {};
    return pt(e);
  }
  get labels() {
    return this.getLabels();
  }
  set labels(t) {
    this.setLabels(t);
  }
  getLabels() {
    return [...this.store.get("labels", [])].map((t) => this.parseLabel(t));
  }
  setLabels(t, e = {}) {
    return this.store.set("labels", Array.isArray(t) ? t : [t], e), this;
  }
  insertLabel(t, e, n = {}) {
    const s = this.getLabels(), r = s.length;
    let o = e != null && Number.isFinite(e) ? e : r;
    return o < 0 && (o = r + o + 1), s.splice(o, 0, this.parseLabel(t)), this.setLabels(s, n);
  }
  appendLabel(t, e = {}) {
    return this.insertLabel(t, -1, e);
  }
  getLabelAt(t) {
    const e = this.getLabels();
    return t != null && Number.isFinite(t) ? this.parseLabel(e[t]) : null;
  }
  setLabelAt(t, e, n = {}) {
    if (t != null && Number.isFinite(t)) {
      const s = this.getLabels();
      s[t] = this.parseLabel(e), this.setLabels(s, n);
    }
    return this;
  }
  removeLabelAt(t, e = {}) {
    const n = this.getLabels(), s = t != null && Number.isFinite(t) ? t : -1, r = n.splice(s, 1);
    return this.setLabels(n, e), r.length ? r[0] : null;
  }
  parseLabel(t) {
    return typeof t == "string" ? this.constructor.parseStringLabel(t) : t;
  }
  onLabelsChanged({ previous: t, current: e }) {
    const n = t && e ? e.filter((r) => t.find((o) => r === o || Me(r, o)) ? null : r) : e ? [...e] : [], s = t && e ? t.filter((r) => e.find((o) => r === o || Me(r, o)) ? null : r) : t ? [...t] : [];
    n.length > 0 && this.notify("labels:added", { added: n, cell: this, edge: this }), s.length > 0 && this.notify("labels:removed", { removed: s, cell: this, edge: this });
  }
  // #endregion
  // #region vertices
  get vertices() {
    return this.getVertices();
  }
  set vertices(t) {
    this.setVertices(t);
  }
  getVertices() {
    return [...this.store.get("vertices", [])];
  }
  setVertices(t, e = {}) {
    const n = Array.isArray(t) ? t : [t];
    return this.store.set("vertices", n.map((s) => x.toJSON(s)), e), this;
  }
  insertVertex(t, e, n = {}) {
    const s = this.getVertices(), r = s.length;
    let o = e != null && Number.isFinite(e) ? e : r;
    return o < 0 && (o = r + o + 1), s.splice(o, 0, x.toJSON(t)), this.setVertices(s, n);
  }
  appendVertex(t, e = {}) {
    return this.insertVertex(t, -1, e);
  }
  getVertexAt(t) {
    return t != null && Number.isFinite(t) ? this.getVertices()[t] : null;
  }
  setVertexAt(t, e, n = {}) {
    if (t != null && Number.isFinite(t)) {
      const s = this.getVertices();
      s[t] = e, this.setVertices(s, n);
    }
    return this;
  }
  removeVertexAt(t, e = {}) {
    const n = this.getVertices(), s = t != null && Number.isFinite(t) ? t : -1;
    return n.splice(s, 1), this.setVertices(n, e);
  }
  onVertexsChanged({ previous: t, current: e }) {
    const n = t && e ? e.filter((r) => t.find((o) => x.equals(r, o)) ? null : r) : e ? [...e] : [], s = t && e ? t.filter((r) => e.find((o) => x.equals(r, o)) ? null : r) : t ? [...t] : [];
    n.length > 0 && this.notify("vertexs:added", { added: n, cell: this, edge: this }), s.length > 0 && this.notify("vertexs:removed", { removed: s, cell: this, edge: this });
  }
  // #endregion
  // #region markup
  getDefaultMarkup() {
    return this.store.get("defaultMarkup") || mt.getEdgeMarkup();
  }
  getMarkup() {
    return super.getMarkup() || this.getDefaultMarkup();
  }
  // #endregion
  // #region transform
  /**
   * Translate the edge vertices (and source and target if they are points)
   * by `tx` pixels in the x-axis and `ty` pixels in the y-axis.
   */
  translate(t, e, n = {}) {
    return n.translateBy = n.translateBy || this.id, n.tx = t, n.ty = e, this.applyToPoints((s) => ({
      x: (s.x || 0) + t,
      y: (s.y || 0) + e
    }), n);
  }
  /**
   * Scales the edge's points (vertices) relative to the given origin.
   */
  scale(t, e, n, s = {}) {
    return this.applyToPoints((r) => x.create(r).scale(t, e, n).toJSON(), s);
  }
  applyToPoints(t, e = {}) {
    const n = {}, s = this.getSource(), r = this.getTarget();
    x.isPointLike(s) && (n.source = t(s)), x.isPointLike(r) && (n.target = t(r));
    const o = this.getVertices();
    return o.length > 0 && (n.vertices = o.map(t)), this.store.set(n, e), this;
  }
  // #endregion
  // #region common
  getBBox() {
    return this.getPolyline().bbox();
  }
  getConnectionPoint() {
    return this.getPolyline().pointAt(0.5);
  }
  getPolyline() {
    const t = [
      this.getSourcePoint(),
      ...this.getVertices().map((e) => x.create(e)),
      this.getTargetPoint()
    ];
    return new Mt(t);
  }
  updateParent(t) {
    let e = null;
    const n = this.getSourceCell(), s = this.getTargetCell(), r = this.getParent();
    return n && s && (n === s || n.isDescendantOf(s) ? e = s : s.isDescendantOf(n) ? e = n : e = K.getCommonAncestor(n, s)), r && e && e.id !== r.id && r.unembed(this, t), e && (!r || r.id !== e.id) && e.embed(this, t), e;
  }
  hasLoop(t = {}) {
    const e = this.getSource(), n = this.getTarget(), s = e.cell, r = n.cell;
    if (!s || !r)
      return !1;
    let o = s === r;
    if (!o && t.deep && this._model) {
      const a = this.getSourceCell(), l = this.getTargetCell();
      a && l && (o = a.isAncestorOf(l, t) || l.isAncestorOf(a, t));
    }
    return o;
  }
  getFragmentAncestor() {
    const t = [this, this.getSourceNode(), this.getTargetNode()].filter((e) => e != null);
    return this.getCommonAncestor(...t);
  }
  isFragmentDescendantOf(t) {
    const e = this.getFragmentAncestor();
    return !!e && (e.id === t.id || e.isDescendantOf(t));
  }
};
St.defaults = {};
(function(i) {
  function t(e, n) {
    const s = e, r = n;
    return s.cell === r.cell ? s.port === r.port || s.port == null && r.port == null : !1;
  }
  i.equalTerminals = t;
})(St || (St = {}));
(function(i) {
  i.defaultLabel = {
    markup: [
      {
        tagName: "rect",
        selector: "body"
      },
      {
        tagName: "text",
        selector: "label"
      }
    ],
    attrs: {
      text: {
        fill: "#000",
        fontSize: 14,
        textAnchor: "middle",
        textVerticalAnchor: "middle",
        pointerEvents: "none"
      },
      rect: {
        ref: "label",
        fill: "#fff",
        rx: 3,
        ry: 3,
        refWidth: 1,
        refHeight: 1,
        refX: 0,
        refY: 0
      }
    },
    position: {
      distance: 0.5
    }
  };
  function t(e) {
    return {
      attrs: { label: { text: e } }
    };
  }
  i.parseStringLabel = t;
})(St || (St = {}));
(function(i) {
  i.toStringTag = `X6.${i.name}`;
  function t(e) {
    if (e == null)
      return !1;
    if (e instanceof i)
      return !0;
    const n = e[Symbol.toStringTag], s = e;
    return (n == null || n === i.toStringTag) && typeof s.isNode == "function" && typeof s.isEdge == "function" && typeof s.prop == "function" && typeof s.attr == "function" && typeof s.disconnect == "function" && typeof s.getSource == "function" && typeof s.getTarget == "function";
  }
  i.isEdge = t;
})(St || (St = {}));
(function(i) {
  i.registry = It.create({
    type: "edge",
    process(t, e) {
      if (ti.exist(t, !1))
        throw new Error(`Edge with name '${t}' was registered by anthor Node`);
      if (typeof e == "function")
        return e.config({ shape: t }), e;
      let n = i;
      const { inherit: s = "edge" } = e, r = ur(e, ["inherit"]);
      if (typeof s == "string") {
        const a = this.get(s || "edge");
        a == null && s ? this.onNotFound(s, "inherited") : n = a;
      } else
        n = s;
      r.constructorName == null && (r.constructorName = t);
      const o = n.define.call(n, r);
      return o.config({ shape: t }), o;
    }
  }), ti.setEdgeRegistry(i.registry);
})(St || (St = {}));
(function(i) {
  let t = 0;
  function e(r) {
    return r ? No(r) : (t += 1, `CustomEdge${t}`);
  }
  function n(r) {
    const { constructorName: o, overwrite: a } = r, l = ur(r, ["constructorName", "overwrite"]), c = Mo(e(o || l.shape), this);
    return c.config(l), l.shape && i.registry.register(l.shape, c, a), c;
  }
  i.define = n;
  function s(r) {
    const o = r.shape || "edge", a = i.registry.get(o);
    return a ? new a(r) : i.registry.onNotFound(o);
  }
  i.create = s;
})(St || (St = {}));
(function(i) {
  const t = "basic.edge";
  i.config({
    shape: t,
    propHooks(e) {
      const { label: n, vertices: s } = e, r = ur(e, ["label", "vertices"]);
      if (n) {
        r.labels == null && (r.labels = []);
        const o = typeof n == "string" ? i.parseStringLabel(n) : n;
        r.labels.push(o);
      }
      return s && Array.isArray(s) && (r.vertices = s.map((o) => x.create(o).toJSON())), r;
    }
  }), i.registry.register(t, i);
})(St || (St = {}));
var mE = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
};
class _s extends Nt {
  constructor(t, e = {}) {
    super(), this.length = 0, this.comparator = e.comparator || "zIndex", this.clean(), t && this.reset(t, { silent: !0 });
  }
  toJSON() {
    return this.cells.map((t) => t.toJSON());
  }
  add(t, e, n) {
    let s, r;
    typeof e == "number" ? (s = e, r = Object.assign({ merge: !1 }, n)) : (s = this.length, r = Object.assign({ merge: !1 }, e)), s > this.length && (s = this.length), s < 0 && (s += this.length + 1);
    const o = Array.isArray(t) ? t : [t], a = this.comparator && typeof e != "number" && r.sort !== !1, l = this.comparator || null;
    let c = !1;
    const u = [], h = [];
    return o.forEach((d) => {
      const f = this.get(d);
      f ? r.merge && !d.isSameStore(f) && (f.setProp(d.getProp(), n), h.push(f), a && !c && (l == null || typeof l == "function" ? c = f.hasChanged() : typeof l == "string" ? c = f.hasChanged(l) : c = l.some((g) => f.hasChanged(g)))) : (u.push(d), this.reference(d));
    }), u.length && (a && (c = !0), this.cells.splice(s, 0, ...u), this.length = this.cells.length), c && this.sort({ silent: !0 }), r.silent || (u.forEach((d, f) => {
      const g = {
        cell: d,
        index: s + f,
        options: r
      };
      this.trigger("added", g), r.dryrun || d.notify("added", Object.assign({}, g));
    }), c && this.trigger("sorted"), (u.length || h.length) && this.trigger("updated", {
      added: u,
      merged: h,
      removed: [],
      options: r
    })), this;
  }
  remove(t, e = {}) {
    const n = Array.isArray(t) ? t : [t], s = this.removeCells(n, e);
    return !e.silent && s.length > 0 && this.trigger("updated", {
      options: e,
      removed: s,
      added: [],
      merged: []
    }), Array.isArray(t) ? s : s[0];
  }
  removeCells(t, e) {
    const n = [];
    for (let s = 0; s < t.length; s += 1) {
      const r = this.get(t[s]);
      if (r == null)
        continue;
      const o = this.cells.indexOf(r);
      this.cells.splice(o, 1), this.length -= 1, delete this.map[r.id], n.push(r), this.unreference(r), e.dryrun || r.remove(), e.silent || (this.trigger("removed", { cell: r, index: o, options: e }), e.dryrun || r.notify("removed", { cell: r, index: o, options: e }));
    }
    return n;
  }
  reset(t, e = {}) {
    const n = this.cells.slice();
    if (n.forEach((s) => this.unreference(s)), this.clean(), this.add(t, Object.assign({ silent: !0 }, e)), !e.silent) {
      const s = this.cells.slice();
      this.trigger("reseted", {
        options: e,
        previous: n,
        current: s
      });
      const r = [], o = [];
      s.forEach((a) => {
        n.some((c) => c.id === a.id) || r.push(a);
      }), n.forEach((a) => {
        s.some((c) => c.id === a.id) || o.push(a);
      }), this.trigger("updated", { options: e, added: r, removed: o, merged: [] });
    }
    return this;
  }
  push(t, e) {
    return this.add(t, this.length, e);
  }
  pop(t) {
    const e = this.at(this.length - 1);
    return this.remove(e, t);
  }
  unshift(t, e) {
    return this.add(t, 0, e);
  }
  shift(t) {
    const e = this.at(0);
    return this.remove(e, t);
  }
  get(t) {
    if (t == null)
      return null;
    const e = typeof t == "string" || typeof t == "number" ? t : t.id;
    return this.map[e] || null;
  }
  has(t) {
    return this.get(t) != null;
  }
  at(t) {
    return t < 0 && (t += this.length), this.cells[t] || null;
  }
  first() {
    return this.at(0);
  }
  last() {
    return this.at(-1);
  }
  indexOf(t) {
    return this.cells.indexOf(t);
  }
  toArray() {
    return this.cells.slice();
  }
  sort(t = {}) {
    return this.comparator != null && (this.cells = Oo(this.cells, this.comparator), t.silent || this.trigger("sorted")), this;
  }
  clone() {
    const t = this.constructor;
    return new t(this.cells.slice(), {
      comparator: this.comparator
    });
  }
  reference(t) {
    this.map[t.id] = t, t.on("*", this.notifyCellEvent, this);
  }
  unreference(t) {
    t.off("*", this.notifyCellEvent, this), delete this.map[t.id];
  }
  notifyCellEvent(t, e) {
    const n = e.cell;
    this.trigger(`cell:${t}`, e), n && (n.isNode() ? this.trigger(`node:${t}`, Object.assign(Object.assign({}, e), { node: n })) : n.isEdge() && this.trigger(`edge:${t}`, Object.assign(Object.assign({}, e), { edge: n })));
  }
  clean() {
    this.length = 0, this.cells = [], this.map = {};
  }
  dispose() {
    this.reset([]);
  }
}
mE([
  _s.dispose()
], _s.prototype, "dispose", null);
var bE = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
};
class ie extends Nt {
  get [Symbol.toStringTag]() {
    return ie.toStringTag;
  }
  constructor(t = []) {
    super(), this.batches = {}, this.addings = /* @__PURE__ */ new WeakMap(), this.nodes = {}, this.edges = {}, this.outgoings = {}, this.incomings = {}, this.collection = new _s(t), this.setup();
  }
  notify(t, e) {
    this.trigger(t, e);
    const n = this.graph;
    return n && (t === "sorted" || t === "reseted" || t === "updated" ? n.trigger(`model:${t}`, e) : n.trigger(t, e)), this;
  }
  setup() {
    const t = this.collection;
    t.on("sorted", () => this.notify("sorted", null)), t.on("updated", (e) => this.notify("updated", e)), t.on("cell:change:zIndex", () => this.sortOnChangeZ()), t.on("added", ({ cell: e }) => {
      this.onCellAdded(e);
    }), t.on("removed", (e) => {
      const n = e.cell;
      this.onCellRemoved(n, e.options), this.notify("cell:removed", e), n.isNode() ? this.notify("node:removed", Object.assign(Object.assign({}, e), { node: n })) : n.isEdge() && this.notify("edge:removed", Object.assign(Object.assign({}, e), { edge: n }));
    }), t.on("reseted", (e) => {
      this.onReset(e.current), this.notify("reseted", e);
    }), t.on("edge:change:source", ({ edge: e }) => this.onEdgeTerminalChanged(e, "source")), t.on("edge:change:target", ({ edge: e }) => {
      this.onEdgeTerminalChanged(e, "target");
    });
  }
  sortOnChangeZ() {
    this.collection.sort();
  }
  onCellAdded(t) {
    const e = t.id;
    t.isEdge() ? (t.updateParent(), this.edges[e] = !0, this.onEdgeTerminalChanged(t, "source"), this.onEdgeTerminalChanged(t, "target")) : this.nodes[e] = !0;
  }
  onCellRemoved(t, e) {
    const n = t.id;
    if (t.isEdge()) {
      delete this.edges[n];
      const s = t.getSource(), r = t.getTarget();
      if (s && s.cell) {
        const o = this.outgoings[s.cell], a = o ? o.indexOf(n) : -1;
        a >= 0 && (o.splice(a, 1), o.length === 0 && delete this.outgoings[s.cell]);
      }
      if (r && r.cell) {
        const o = this.incomings[r.cell], a = o ? o.indexOf(n) : -1;
        a >= 0 && (o.splice(a, 1), o.length === 0 && delete this.incomings[r.cell]);
      }
    } else
      delete this.nodes[n];
    e.clear || (e.disconnectEdges ? this.disconnectConnectedEdges(t, e) : this.removeConnectedEdges(t, e)), t.model === this && (t.model = null);
  }
  onReset(t) {
    this.nodes = {}, this.edges = {}, this.outgoings = {}, this.incomings = {}, t.forEach((e) => this.onCellAdded(e));
  }
  onEdgeTerminalChanged(t, e) {
    const n = e === "source" ? this.outgoings : this.incomings, s = t.previous(e);
    if (s && s.cell) {
      const o = K.isCell(s.cell) ? s.cell.id : s.cell, a = n[o], l = a ? a.indexOf(t.id) : -1;
      l >= 0 && (a.splice(l, 1), a.length === 0 && delete n[o]);
    }
    const r = t.getTerminal(e);
    if (r && r.cell) {
      const o = K.isCell(r.cell) ? r.cell.id : r.cell, a = n[o] || [];
      a.indexOf(t.id) === -1 && a.push(t.id), n[o] = a;
    }
  }
  prepareCell(t, e) {
    return !t.model && (!e || !e.dryrun) && (t.model = this), t.zIndex == null && t.setZIndex(this.getMaxZIndex() + 1, { silent: !0 }), t;
  }
  resetCells(t, e = {}) {
    return t.map((n) => this.prepareCell(n, Object.assign(Object.assign({}, e), { dryrun: !0 }))), this.collection.reset(t, e), t.map((n) => this.prepareCell(n, { options: e })), this;
  }
  clear(t = {}) {
    const e = this.getCells();
    if (e.length === 0)
      return this;
    const n = Object.assign(Object.assign({}, t), { clear: !0 });
    return this.batchUpdate("clear", () => {
      const s = e.sort((r, o) => {
        const a = r.isEdge() ? 1 : 2, l = o.isEdge() ? 1 : 2;
        return a - l;
      });
      for (; s.length > 0; ) {
        const r = s.shift();
        r && r.remove(n);
      }
    }, n), this;
  }
  addNode(t, e = {}) {
    const n = vt.isNode(t) ? t : this.createNode(t);
    return this.addCell(n, e), n;
  }
  updateNode(t, e = {}) {
    const n = this.createNode(t), s = n.getProp();
    return n.dispose(), this.updateCell(s, e);
  }
  createNode(t) {
    return vt.create(t);
  }
  addEdge(t, e = {}) {
    const n = St.isEdge(t) ? t : this.createEdge(t);
    return this.addCell(n, e), n;
  }
  createEdge(t) {
    return St.create(t);
  }
  updateEdge(t, e = {}) {
    const n = this.createEdge(t), s = n.getProp();
    return n.dispose(), this.updateCell(s, e);
  }
  addCell(t, e = {}) {
    return Array.isArray(t) ? this.addCells(t, e) : (!this.collection.has(t) && !this.addings.has(t) && (this.addings.set(t, !0), this.collection.add(this.prepareCell(t, e), e), t.eachChild((n) => this.addCell(n, e)), this.addings.delete(t)), this);
  }
  addCells(t, e = {}) {
    const n = t.length;
    if (n === 0)
      return this;
    const s = Object.assign(Object.assign({}, e), { position: n - 1, maxPosition: n - 1 });
    return this.startBatch("add", Object.assign(Object.assign({}, s), { cells: t })), t.forEach((r) => {
      this.addCell(r, s), s.position -= 1;
    }), this.stopBatch("add", Object.assign(Object.assign({}, s), { cells: t })), this;
  }
  updateCell(t, e = {}) {
    const n = t.id && this.getCell(t.id);
    return n ? this.batchUpdate("update", () => (Object.entries(t).forEach(([s, r]) => n.setProp(s, r, e)), !0), t) : !1;
  }
  removeCell(t, e = {}) {
    const n = typeof t == "string" ? this.getCell(t) : t;
    return n && this.has(n) ? this.collection.remove(n, e) : null;
  }
  updateCellId(t, e) {
    if (t.id === e)
      return;
    this.startBatch("update", { id: e }), t.prop("id", e);
    const n = t.clone({ keepId: !0 });
    return this.addCell(n), this.getConnectedEdges(t).forEach((r) => {
      const o = r.getSourceCell(), a = r.getTargetCell();
      o === t && r.setSource(Object.assign(Object.assign({}, r.getSource()), { cell: e })), a === t && r.setTarget(Object.assign(Object.assign({}, r.getTarget()), { cell: e }));
    }), this.removeCell(t), this.stopBatch("update", { id: e }), n;
  }
  removeCells(t, e = {}) {
    return t.length ? this.batchUpdate("remove", () => t.map((n) => this.removeCell(n, e))) : [];
  }
  removeConnectedEdges(t, e = {}) {
    const n = this.getConnectedEdges(t);
    return n.forEach((s) => {
      s.remove(e);
    }), n;
  }
  disconnectConnectedEdges(t, e = {}) {
    const n = typeof t == "string" ? t : t.id;
    this.getConnectedEdges(t).forEach((s) => {
      const r = s.getSourceCellId(), o = s.getTargetCellId();
      r === n && s.setSource({ x: 0, y: 0 }, e), o === n && s.setTarget({ x: 0, y: 0 }, e);
    });
  }
  has(t) {
    return this.collection.has(t);
  }
  total() {
    return this.collection.length;
  }
  indexOf(t) {
    return this.collection.indexOf(t);
  }
  /**
   * Returns a cell from the graph by its id.
   */
  getCell(t) {
    return this.collection.get(t);
  }
  /**
   * Returns all the nodes and edges in the graph.
   */
  getCells() {
    return this.collection.toArray();
  }
  /**
   * Returns the first cell (node or edge) in the graph. The first cell is
   * defined as the cell with the lowest `zIndex`.
   */
  getFirstCell() {
    return this.collection.first();
  }
  /**
   * Returns the last cell (node or edge) in the graph. The last cell is
   * defined as the cell with the highest `zIndex`.
   */
  getLastCell() {
    return this.collection.last();
  }
  /**
   * Returns the lowest `zIndex` value in the graph.
   */
  getMinZIndex() {
    const t = this.collection.first();
    return t && t.getZIndex() || 0;
  }
  /**
   * Returns the highest `zIndex` value in the graph.
   */
  getMaxZIndex() {
    const t = this.collection.last();
    return t && t.getZIndex() || 0;
  }
  getCellsFromCache(t) {
    return t ? Object.keys(t).map((e) => this.getCell(e)).filter((e) => e != null) : [];
  }
  /**
   * Returns all the nodes in the graph.
   */
  getNodes() {
    return this.getCellsFromCache(this.nodes);
  }
  /**
   * Returns all the edges in the graph.
   */
  getEdges() {
    return this.getCellsFromCache(this.edges);
  }
  /**
   * Returns all outgoing edges for the node.
   */
  getOutgoingEdges(t) {
    const e = typeof t == "string" ? t : t.id, n = this.outgoings[e];
    return n ? n.map((s) => this.getCell(s)).filter((s) => s && s.isEdge()) : null;
  }
  /**
   * Returns all incoming edges for the node.
   */
  getIncomingEdges(t) {
    const e = typeof t == "string" ? t : t.id, n = this.incomings[e];
    return n ? n.map((s) => this.getCell(s)).filter((s) => s && s.isEdge()) : null;
  }
  /**
   * Returns edges connected with cell.
   */
  getConnectedEdges(t, e = {}) {
    const n = [], s = typeof t == "string" ? this.getCell(t) : t;
    if (s == null)
      return n;
    const r = {}, o = e.indirect;
    let a = e.incoming, l = e.outgoing;
    a == null && l == null && (a = l = !0);
    const c = (u, h) => {
      const d = h ? this.getOutgoingEdges(u) : this.getIncomingEdges(u);
      if (d != null && d.forEach((f) => {
        r[f.id] || (n.push(f), r[f.id] = !0, o && (a && c(f, !1), l && c(f, !0)));
      }), o && u.isEdge()) {
        const f = h ? u.getTargetCell() : u.getSourceCell();
        f && f.isEdge() && (r[f.id] || (n.push(f), c(f, h)));
      }
    };
    if (l && c(s, !0), a && c(s, !1), e.deep) {
      const u = s.getDescendants({ deep: !0 }), h = {};
      u.forEach((f) => {
        f.isNode() && (h[f.id] = !0);
      });
      const d = (f, g) => {
        const p = g ? this.getOutgoingEdges(f.id) : this.getIncomingEdges(f.id);
        p != null && p.forEach((m) => {
          if (!r[m.id]) {
            const y = m.getSourceCell(), v = m.getTargetCell();
            if (!e.enclosed && y && h[y.id] && v && h[v.id])
              return;
            n.push(m), r[m.id] = !0;
          }
        });
      };
      u.forEach((f) => {
        f.isEdge() || (l && d(f, !0), a && d(f, !1));
      });
    }
    return n;
  }
  isBoundary(t, e) {
    const n = typeof t == "string" ? this.getCell(t) : t, s = e ? this.getIncomingEdges(n) : this.getOutgoingEdges(n);
    return s == null || s.length === 0;
  }
  getBoundaryNodes(t) {
    const e = [];
    return Object.keys(this.nodes).forEach((n) => {
      if (this.isBoundary(n, t)) {
        const s = this.getCell(n);
        s && e.push(s);
      }
    }), e;
  }
  /**
   * Returns an array of all the roots of the graph.
   */
  getRoots() {
    return this.getBoundaryNodes(!0);
  }
  /**
   * Returns an array of all the leafs of the graph.
   */
  getLeafs() {
    return this.getBoundaryNodes(!1);
  }
  /**
   * Returns `true` if the node is a root node, i.e. there is no edges
   * coming to the node.
   */
  isRoot(t) {
    return this.isBoundary(t, !0);
  }
  /**
   * Returns `true` if the node is a leaf node, i.e. there is no edges
   * going out from the node.
   */
  isLeaf(t) {
    return this.isBoundary(t, !1);
  }
  /**
   * Returns all the neighbors of node in the graph. Neighbors are all
   * the nodes connected to node via either incoming or outgoing edge.
   */
  getNeighbors(t, e = {}) {
    let n = e.incoming, s = e.outgoing;
    n == null && s == null && (n = s = !0);
    const o = this.getConnectedEdges(t, e).reduce((a, l) => {
      const c = l.hasLoop(e), u = l.getSourceCell(), h = l.getTargetCell();
      return n && u && u.isNode() && !a[u.id] && (c || u !== t && (!e.deep || !u.isDescendantOf(t))) && (a[u.id] = u), s && h && h.isNode() && !a[h.id] && (c || h !== t && (!e.deep || !h.isDescendantOf(t))) && (a[h.id] = h), a;
    }, {});
    if (t.isEdge()) {
      if (n) {
        const a = t.getSourceCell();
        a && a.isNode() && !o[a.id] && (o[a.id] = a);
      }
      if (s) {
        const a = t.getTargetCell();
        a && a.isNode() && !o[a.id] && (o[a.id] = a);
      }
    }
    return Object.keys(o).map((a) => o[a]);
  }
  /**
   * Returns `true` if `cell2` is a neighbor of `cell1`.
   */
  isNeighbor(t, e, n = {}) {
    let s = n.incoming, r = n.outgoing;
    return s == null && r == null && (s = r = !0), this.getConnectedEdges(t, n).some((o) => {
      const a = o.getSourceCell(), l = o.getTargetCell();
      return !!(s && a && a.id === e.id || r && l && l.id === e.id);
    });
  }
  getSuccessors(t, e = {}) {
    const n = [];
    return this.search(t, (s, r) => {
      s !== t && this.matchDistance(r, e.distance) && n.push(s);
    }, Object.assign(Object.assign({}, e), { outgoing: !0 })), n;
  }
  /**
   * Returns `true` if `cell2` is a successor of `cell1`.
   */
  isSuccessor(t, e, n = {}) {
    let s = !1;
    return this.search(t, (r, o) => {
      if (r === e && r !== t && this.matchDistance(o, n.distance))
        return s = !0, !1;
    }, Object.assign(Object.assign({}, n), { outgoing: !0 })), s;
  }
  getPredecessors(t, e = {}) {
    const n = [];
    return this.search(t, (s, r) => {
      s !== t && this.matchDistance(r, e.distance) && n.push(s);
    }, Object.assign(Object.assign({}, e), { incoming: !0 })), n;
  }
  /**
   * Returns `true` if `cell2` is a predecessor of `cell1`.
   */
  isPredecessor(t, e, n = {}) {
    let s = !1;
    return this.search(t, (r, o) => {
      if (r === e && r !== t && this.matchDistance(o, n.distance))
        return s = !0, !1;
    }, Object.assign(Object.assign({}, n), { incoming: !0 })), s;
  }
  matchDistance(t, e) {
    return e == null ? !0 : typeof e == "function" ? e(t) : Array.isArray(e) && e.includes(t) ? !0 : t === e;
  }
  /**
   * Returns the common ancestor of the passed cells.
   */
  getCommonAncestor(...t) {
    const e = [];
    return t.forEach((n) => {
      n && (Array.isArray(n) ? e.push(...n) : e.push(n));
    }), K.getCommonAncestor(...e);
  }
  /**
   * Returns an array of cells that result from finding nodes/edges that
   * are connected to any of the cells in the cells array. This function
   * loops over cells and if the current cell is a edge, it collects its
   * source/target nodes; if it is an node, it collects its incoming and
   * outgoing edges if both the edge terminal (source/target) are in the
   * cells array.
   */
  getSubGraph(t, e = {}) {
    const n = [], s = {}, r = [], o = [], a = (l) => {
      s[l.id] || (n.push(l), s[l.id] = l, l.isEdge() && o.push(l), l.isNode() && r.push(l));
    };
    return t.forEach((l) => {
      a(l), e.deep && l.getDescendants({ deep: !0 }).forEach((u) => a(u));
    }), o.forEach((l) => {
      const c = l.getSourceCell(), u = l.getTargetCell();
      c && !s[c.id] && (n.push(c), s[c.id] = c, c.isNode() && r.push(c)), u && !s[u.id] && (n.push(u), s[u.id] = u, u.isNode() && r.push(u));
    }), r.forEach((l) => {
      this.getConnectedEdges(l, e).forEach((u) => {
        const h = u.getSourceCell(), d = u.getTargetCell();
        !s[u.id] && h && s[h.id] && d && s[d.id] && (n.push(u), s[u.id] = u);
      });
    }), n;
  }
  /**
   * Clones the whole subgraph (including all the connected links whose
   * source/target is in the subgraph). If `options.deep` is `true`, also
   * take into account all the embedded cells of all the subgraph cells.
   *
   * Returns a map of the form: { [original cell ID]: [clone] }.
   */
  cloneSubGraph(t, e = {}) {
    const n = this.getSubGraph(t, e);
    return this.cloneCells(n);
  }
  cloneCells(t) {
    return K.cloneCells(t);
  }
  getNodesFromPoint(t, e) {
    const n = typeof t == "number" ? { x: t, y: e || 0 } : t;
    return this.getNodes().filter((s) => s.getBBox().containsPoint(n));
  }
  getNodesInArea(t, e, n, s, r) {
    const o = typeof t == "number" ? new R(t, e, n, s) : R.create(t), a = typeof t == "number" ? r : e, l = a && a.strict;
    return this.getNodes().filter((c) => {
      const u = c.getBBox();
      return l ? o.containsRect(u) : o.isIntersectWithRect(u);
    });
  }
  getEdgesInArea(t, e, n, s, r) {
    const o = typeof t == "number" ? new R(t, e, n, s) : R.create(t), a = typeof t == "number" ? r : e, l = a && a.strict;
    return this.getEdges().filter((c) => {
      const u = c.getBBox();
      return u.width === 0 ? u.inflate(1, 0) : u.height === 0 && u.inflate(0, 1), l ? o.containsRect(u) : o.isIntersectWithRect(u);
    });
  }
  getNodesUnderNode(t, e = {}) {
    const n = t.getBBox();
    return (e.by == null || e.by === "bbox" ? this.getNodesInArea(n) : this.getNodesFromPoint(n[e.by])).filter((r) => t.id !== r.id && !r.isDescendantOf(t));
  }
  /**
   * Returns the bounding box that surrounds all cells in the graph.
   */
  getAllCellsBBox() {
    return this.getCellsBBox(this.getCells());
  }
  /**
   * Returns the bounding box that surrounds all the given cells.
   */
  getCellsBBox(t, e = {}) {
    return K.getCellsBBox(t, e);
  }
  // #region search
  search(t, e, n = {}) {
    n.breadthFirst ? this.breadthFirstSearch(t, e, n) : this.depthFirstSearch(t, e, n);
  }
  breadthFirstSearch(t, e, n = {}) {
    const s = [], r = {}, o = {};
    for (s.push(t), o[t.id] = 0; s.length > 0; ) {
      const a = s.shift();
      if (a == null || r[a.id] || (r[a.id] = !0, z(e, this, a, o[a.id]) === !1))
        continue;
      this.getNeighbors(a, n).forEach((c) => {
        o[c.id] = o[a.id] + 1, s.push(c);
      });
    }
  }
  depthFirstSearch(t, e, n = {}) {
    const s = [], r = {}, o = {};
    for (s.push(t), o[t.id] = 0; s.length > 0; ) {
      const a = s.pop();
      if (a == null || r[a.id] || (r[a.id] = !0, z(e, this, a, o[a.id]) === !1))
        continue;
      const l = this.getNeighbors(a, n), c = s.length;
      l.forEach((u) => {
        o[u.id] = o[a.id] + 1, s.splice(c, 0, u);
      });
    }
  }
  // #endregion
  // #region shortest path
  /** *
   * Returns an array of IDs of nodes on the shortest
   * path between source and target.
   */
  getShortestPath(t, e, n = {}) {
    const s = {};
    this.getEdges().forEach((c) => {
      const u = c.getSourceCellId(), h = c.getTargetCellId();
      u && h && (s[u] || (s[u] = []), s[h] || (s[h] = []), s[u].push(h), n.directed || s[h].push(u));
    });
    const r = typeof t == "string" ? t : t.id, o = no.run(s, r, n.weight), a = [];
    let l = typeof e == "string" ? e : e.id;
    for (o[l] && a.push(l); l = o[l]; )
      a.unshift(l);
    return a;
  }
  // #endregion
  // #region transform
  /**
   * Translate all cells in the graph by `tx` and `ty` pixels.
   */
  translate(t, e, n) {
    return this.getCells().filter((s) => !s.hasParent()).forEach((s) => s.translate(t, e, n)), this;
  }
  resize(t, e, n) {
    return this.resizeCells(t, e, this.getCells(), n);
  }
  resizeCells(t, e, n, s = {}) {
    const r = this.getCellsBBox(n);
    if (r) {
      const o = Math.max(t / r.width, 0), a = Math.max(e / r.height, 0), l = r.getOrigin();
      n.forEach((c) => c.scale(o, a, l, s));
    }
    return this;
  }
  // #endregion
  // #region serialize/deserialize
  toJSON(t = {}) {
    return ie.toJSON(this.getCells(), t);
  }
  parseJSON(t) {
    return ie.fromJSON(t);
  }
  fromJSON(t, e = {}) {
    const n = this.parseJSON(t);
    return this.resetCells(n, e), this;
  }
  // #endregion
  // #region batch
  startBatch(t, e = {}) {
    return this.batches[t] = (this.batches[t] || 0) + 1, this.notify("batch:start", { name: t, data: e }), this;
  }
  stopBatch(t, e = {}) {
    return this.batches[t] = (this.batches[t] || 0) - 1, this.notify("batch:stop", { name: t, data: e }), this;
  }
  batchUpdate(t, e, n = {}) {
    this.startBatch(t, n);
    const s = e();
    return this.stopBatch(t, n), s;
  }
  hasActiveBatch(t = Object.keys(this.batches)) {
    return (Array.isArray(t) ? t : [t]).some((n) => this.batches[n] > 0);
  }
  // #endregion
  dispose() {
    this.collection.dispose();
  }
}
bE([
  ie.dispose()
], ie.prototype, "dispose", null);
(function(i) {
  i.toStringTag = `X6.${i.name}`;
  function t(e) {
    if (e == null)
      return !1;
    if (e instanceof i)
      return !0;
    const n = e[Symbol.toStringTag], s = e;
    return (n == null || n === i.toStringTag) && typeof s.addNode == "function" && typeof s.addEdge == "function" && s.collection != null;
  }
  i.isModel = t;
})(ie || (ie = {}));
(function(i) {
  function t(n, s = {}) {
    return {
      cells: n.map((r) => r.toJSON(s))
    };
  }
  i.toJSON = t;
  function e(n) {
    const s = [];
    return Array.isArray(n) ? s.push(...n) : (n.cells && s.push(...n.cells), n.nodes && n.nodes.forEach((r) => {
      r.shape == null && (r.shape = "rect"), s.push(r);
    }), n.edges && n.edges.forEach((r) => {
      r.shape == null && (r.shape = "edge"), s.push(r);
    })), s.map((r) => {
      const o = r.shape;
      if (o) {
        if (vt.registry.exist(o))
          return vt.create(r);
        if (St.registry.exist(o))
          return St.create(r);
      }
      throw new Error("The `shape` should be specified when creating a node/edge instance");
    });
  }
  i.fromJSON = e;
})(ie || (ie = {}));
var yE = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
};
let ln = class extends vt {
  get label() {
    return this.getLabel();
  }
  set label(t) {
    this.setLabel(t);
  }
  getLabel() {
    return this.getAttrByPath("text/text");
  }
  setLabel(t, e) {
    return t == null ? this.removeLabel() : this.setAttrByPath("text/text", t, e), this;
  }
  removeLabel() {
    return this.removeAttrByPath("text/text"), this;
  }
};
(function(i) {
  i.bodyAttr = {
    fill: "#ffffff",
    stroke: "#333333",
    strokeWidth: 2
  }, i.labelAttr = {
    fontSize: 14,
    fill: "#000000",
    refX: 0.5,
    refY: 0.5,
    textAnchor: "middle",
    textVerticalAnchor: "middle",
    fontFamily: "Arial, helvetica, sans-serif"
  }, i.config({
    attrs: { text: Object.assign({}, i.labelAttr) },
    propHooks(t) {
      const { label: e } = t, n = yE(t, ["label"]);
      return e && hi(n, "attrs/text/text", e), n;
    },
    visible: !0
  });
})(ln || (ln = {}));
var vE = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
};
function wE(i, t = "body") {
  return [
    {
      tagName: i,
      selector: t
    },
    {
      tagName: "text",
      selector: "label"
    }
  ];
}
function xE(i = "xlink:href") {
  return (e) => {
    const { imageUrl: n, imageWidth: s, imageHeight: r } = e, o = vE(e, ["imageUrl", "imageWidth", "imageHeight"]);
    if (n != null || s != null || r != null) {
      const a = () => {
        if (o.attrs) {
          const l = o.attrs.image;
          n != null && (l[i] = n), s != null && (l.width = s), r != null && (l.height = r), o.attrs.image = l;
        }
      };
      o.attrs ? (o.attrs.image == null && (o.attrs.image = {}), a()) : (o.attrs = {
        image: {}
      }, a());
    }
    return o;
  };
}
function pi(i, t, e = {}) {
  const n = {
    constructorName: i,
    markup: wE(i, e.selector),
    attrs: {
      [i]: Object.assign({}, ln.bodyAttr)
    }
  };
  return (e.parent || ln).define(kt(n, t, { shape: i }));
}
pi("rect", {
  attrs: {
    body: {
      refWidth: "100%",
      refHeight: "100%"
    }
  }
});
const EE = St.define({
  shape: "edge",
  markup: [
    {
      tagName: "path",
      selector: "wrap",
      groupSelector: "lines",
      attrs: {
        fill: "none",
        cursor: "pointer",
        stroke: "transparent",
        strokeLinecap: "round"
      }
    },
    {
      tagName: "path",
      selector: "line",
      groupSelector: "lines",
      attrs: {
        fill: "none",
        pointerEvents: "none"
      }
    }
  ],
  attrs: {
    lines: {
      connection: !0,
      strokeLinejoin: "round"
    },
    wrap: {
      strokeWidth: 10
    },
    line: {
      stroke: "#333",
      strokeWidth: 2,
      targetMarker: "classic"
    }
  }
});
pi("ellipse", {
  attrs: {
    body: {
      refCx: "50%",
      refCy: "50%",
      refRx: "50%",
      refRy: "50%"
    }
  }
});
var CE = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
};
class ei extends ln {
  get points() {
    return this.getPoints();
  }
  set points(t) {
    this.setPoints(t);
  }
  getPoints() {
    return this.getAttrByPath("body/refPoints");
  }
  setPoints(t, e) {
    return t == null ? this.removePoints() : this.setAttrByPath("body/refPoints", ei.pointsToString(t), e), this;
  }
  removePoints() {
    return this.removeAttrByPath("body/refPoints"), this;
  }
}
(function(i) {
  function t(e) {
    return typeof e == "string" ? e : e.map((n) => Array.isArray(n) ? n.join(",") : x.isPointLike(n) ? `${n.x}, ${n.y}` : "").join(" ");
  }
  i.pointsToString = t, i.config({
    propHooks(e) {
      const { points: n } = e, s = CE(e, ["points"]);
      if (n) {
        const r = t(n);
        r && hi(s, "attrs/body/refPoints", r);
      }
      return s;
    }
  });
})(ei || (ei = {}));
pi("polygon", {}, { parent: ei });
pi("polyline", {}, { parent: ei });
var SE = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
};
ln.define({
  shape: "path",
  markup: [
    {
      tagName: "rect",
      selector: "bg"
    },
    {
      tagName: "path",
      selector: "body"
    },
    {
      tagName: "text",
      selector: "label"
    }
  ],
  attrs: {
    bg: {
      refWidth: "100%",
      refHeight: "100%",
      fill: "none",
      stroke: "none",
      pointerEvents: "all"
    },
    body: {
      fill: "none",
      stroke: "#000",
      strokeWidth: 2
    }
  },
  propHooks(i) {
    const { path: t } = i, e = SE(i, ["path"]);
    return t && hi(e, "attrs/body/refD", t), e;
  }
});
var PE = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
};
ln.define({
  shape: "text-block",
  markup: [
    {
      tagName: "rect",
      selector: "body"
    },
    en.SUPPORT_FOREIGNOBJECT ? {
      tagName: "foreignObject",
      selector: "foreignObject",
      children: [
        {
          tagName: "div",
          ns: Bt.xhtml,
          selector: "label",
          style: {
            width: "100%",
            height: "100%",
            position: "static",
            backgroundColor: "transparent",
            textAlign: "center",
            margin: 0,
            padding: "0px 5px",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }
        }
      ]
    } : {
      tagName: "text",
      selector: "label",
      attrs: {
        textAnchor: "middle"
      }
    }
  ],
  attrs: {
    body: Object.assign(Object.assign({}, ln.bodyAttr), { refWidth: "100%", refHeight: "100%" }),
    foreignObject: {
      refWidth: "100%",
      refHeight: "100%"
    },
    label: {
      style: {
        fontSize: 14
      }
    }
  },
  propHooks(i) {
    const { text: t } = i, e = PE(i, ["text"]);
    return t && hi(e, "attrs/label/text", t), e;
  },
  attrHooks: {
    text: {
      set(i, { cell: t, view: e, refBBox: n, elem: s, attrs: r }) {
        if (s instanceof HTMLElement)
          s.textContent = i;
        else {
          const o = r.style || {}, a = { text: i, width: -5, height: "100%" }, l = Object.assign({ textVerticalAnchor: "middle" }, o), c = je.presets.textWrap;
          return z(c.set, this, a, {
            cell: t,
            view: e,
            elem: s,
            refBBox: n,
            attrs: l
          }), { fill: o.color || null };
        }
      },
      position(i, { refBBox: t, elem: e }) {
        if (e instanceof SVGElement)
          return t.getCenter();
      }
    }
  }
});
pi("image", {
  attrs: {
    image: {
      refWidth: "100%",
      refHeight: "100%"
    }
  },
  propHooks: xE()
}, {
  selector: "image"
});
pi("circle", {
  attrs: {
    body: {
      refCx: "50%",
      refCy: "50%",
      refR: "50%"
    }
  }
});
class Ee extends Tt {
  constructor() {
    super(...arguments), this.portsCache = {};
  }
  get [Symbol.toStringTag]() {
    return Ee.toStringTag;
  }
  getContainerClassName() {
    const t = [
      super.getContainerClassName(),
      this.prefixClassName("node")
    ];
    return this.can("nodeMovable") || t.push(this.prefixClassName("node-immovable")), t.join(" ");
  }
  updateClassName(t) {
    const e = t.target;
    if (e.hasAttribute("magnet")) {
      const n = this.prefixClassName("port-unconnectable");
      this.can("magnetConnectable") ? Jt(e, n) : U(e, n);
    } else {
      const n = this.prefixClassName("node-immovable");
      this.can("nodeMovable") ? this.removeClass(n) : this.addClass(n);
    }
  }
  isNodeView() {
    return !0;
  }
  confirmUpdate(t, e = {}) {
    let n = t;
    return this.hasAction(n, "ports") && (this.removePorts(), this.cleanPortsCache()), this.hasAction(n, "render") ? (this.render(), n = this.removeAction(n, [
      "render",
      "update",
      "resize",
      "translate",
      "rotate",
      "ports",
      "tools"
    ])) : (n = this.handleAction(n, "resize", () => this.resize(), "update"), n = this.handleAction(
      n,
      "update",
      () => this.update(),
      // `update()` will render ports when useCSSSelectors are enabled
      "ports"
    ), n = this.handleAction(n, "translate", () => this.translate()), n = this.handleAction(n, "rotate", () => this.rotate()), n = this.handleAction(n, "ports", () => this.renderPorts()), n = this.handleAction(n, "tools", () => {
      this.getFlag("tools") === t ? this.renderTools() : this.updateTools(e);
    })), n;
  }
  update(t) {
    this.cleanCache(), this.removePorts();
    const e = this.cell, n = e.getSize(), s = e.getAttrs();
    this.updateAttrs(this.container, s, {
      attrs: t === s ? null : t,
      rootBBox: new R(0, 0, n.width, n.height),
      selectors: this.selectors
    }), this.renderPorts();
  }
  renderMarkup() {
    const t = this.cell.markup;
    if (t) {
      if (typeof t == "string")
        throw new TypeError("Not support string markup.");
      return this.renderJSONMarkup(t);
    }
    throw new TypeError("Invalid node markup.");
  }
  renderJSONMarkup(t) {
    const e = this.parseJSONMarkup(t, this.container);
    this.selectors = e.selectors, this.container.appendChild(e.fragment);
  }
  render() {
    return this.empty(), this.renderMarkup(), this.resize(), this.updateTransform(), this.renderTools(), this;
  }
  resize() {
    this.cell.getAngle() && this.rotate(), this.update();
  }
  translate() {
    this.updateTransform();
  }
  rotate() {
    this.updateTransform();
  }
  getTranslationString() {
    const t = this.cell.getPosition();
    return `translate(${t.x},${t.y})`;
  }
  getRotationString() {
    const t = this.cell.getAngle();
    if (t) {
      const e = this.cell.getSize();
      return `rotate(${t},${e.width / 2},${e.height / 2})`;
    }
  }
  updateTransform() {
    let t = this.getTranslationString();
    const e = this.getRotationString();
    e && (t += ` ${e}`), this.container.setAttribute("transform", t);
  }
  // #region ports
  findPortElem(t, e) {
    const n = t ? this.portsCache[t] : null;
    if (!n)
      return null;
    const s = n.portContentElement, r = n.portContentSelectors || {};
    return this.findOne(e, s, r);
  }
  cleanPortsCache() {
    this.portsCache = {};
  }
  removePorts() {
    Object.values(this.portsCache).forEach((t) => {
      Te(t.portElement);
    });
  }
  renderPorts() {
    const t = this.container, e = [];
    t.childNodes.forEach((o) => {
      e.push(o);
    });
    const n = this.cell.getParsedPorts(), s = Va(n, "zIndex"), r = "auto";
    s[r] && s[r].forEach((o) => {
      const a = this.getPortElement(o);
      t.append(a), e.push(a);
    }), Object.keys(s).forEach((o) => {
      if (o !== r) {
        const a = parseInt(o, 10);
        this.appendPorts(s[o], a, e);
      }
    }), this.updatePorts();
  }
  appendPorts(t, e, n) {
    const s = t.map((r) => this.getPortElement(r));
    n[e] || e < 0 ? $o(n[Math.max(e, 0)], s) : Mn(this.container, s);
  }
  getPortElement(t) {
    const e = this.portsCache[t.id];
    return e ? e.portElement : this.createPortElement(t);
  }
  createPortElement(t) {
    let e = mt.renderMarkup(this.cell.getPortContainerMarkup());
    const n = e.elem;
    if (n == null)
      throw new Error("Invalid port container markup.");
    e = mt.renderMarkup(this.getPortMarkup(t));
    const s = e.elem, r = e.selectors;
    if (s == null)
      throw new Error("Invalid port markup.");
    this.setAttrs({
      port: t.id,
      "port-group": t.group
    }, s);
    let o = "x6-port";
    t.group && (o += ` x6-port-${t.group}`), U(n, o), U(n, "x6-port"), U(s, "x6-port-body"), n.appendChild(s);
    let a = r, l, c;
    if (this.existPortLabel(t)) {
      if (e = mt.renderMarkup(this.getPortLabelMarkup(t.label)), l = e.elem, c = e.selectors, l == null)
        throw new Error("Invalid port label markup.");
      if (r && c) {
        for (const h in c)
          if (r[h] && h !== this.rootSelector)
            throw new Error("Selectors within port must be unique.");
        a = Object.assign(Object.assign({}, r), c);
      }
      U(l, "x6-port-label"), n.appendChild(l);
    }
    return this.portsCache[t.id] = {
      portElement: n,
      portSelectors: a,
      portLabelElement: l,
      portLabelSelectors: c,
      portContentElement: s,
      portContentSelectors: r
    }, this.graph.options.onPortRendered && this.graph.options.onPortRendered({
      port: t,
      node: this.cell,
      container: n,
      selectors: a,
      labelContainer: l,
      labelSelectors: c,
      contentContainer: s,
      contentSelectors: r
    }), n;
  }
  updatePorts() {
    const t = this.cell.getParsedGroups(), e = Object.keys(t);
    e.length === 0 ? this.updatePortGroup() : e.forEach((n) => this.updatePortGroup(n));
  }
  updatePortGroup(t) {
    const e = R.fromSize(this.cell.getSize()), n = this.cell.getPortsLayoutByGroup(t, e);
    for (let s = 0, r = n.length; s < r; s += 1) {
      const o = n[s], a = o.portId, l = this.portsCache[a] || {}, c = o.portLayout;
      if (this.applyPortTransform(l.portElement, c), o.portAttrs != null) {
        const h = {
          selectors: l.portSelectors || {}
        };
        o.portSize && (h.rootBBox = R.fromSize(o.portSize)), this.updateAttrs(l.portElement, o.portAttrs, h);
      }
      const u = o.labelLayout;
      if (u && l.portLabelElement && (this.applyPortTransform(l.portLabelElement, u, -(c.angle || 0)), u.attrs)) {
        const h = {
          selectors: l.portLabelSelectors || {}
        };
        o.labelSize && (h.rootBBox = R.fromSize(o.labelSize)), this.updateAttrs(l.portLabelElement, u.attrs, h);
      }
    }
  }
  applyPortTransform(t, e, n = 0) {
    const s = e.angle, r = e.position, o = Vt().rotate(n).translate(r.x || 0, r.y || 0).rotate(s || 0);
    Gn(t, o, { absolute: !0 });
  }
  getPortMarkup(t) {
    return t.markup || this.cell.portMarkup;
  }
  getPortLabelMarkup(t) {
    return t.markup || this.cell.portLabelMarkup;
  }
  existPortLabel(t) {
    return t.attrs && t.attrs.text;
  }
  getEventArgs(t, e, n) {
    const s = this, r = s.cell, o = r;
    return e == null || n == null ? { e: t, view: s, node: r, cell: o } : { e: t, x: e, y: n, view: s, node: r, cell: o };
  }
  getPortEventArgs(t, e, n) {
    const s = this, r = s.cell, o = r;
    return n ? {
      e: t,
      x: n.x,
      y: n.y,
      view: s,
      node: r,
      cell: o,
      port: e
    } : { e: t, view: s, node: r, cell: o, port: e };
  }
  notifyMouseDown(t, e, n) {
    super.onMouseDown(t, e, n), this.notify("node:mousedown", this.getEventArgs(t, e, n));
  }
  notifyMouseMove(t, e, n) {
    super.onMouseMove(t, e, n), this.notify("node:mousemove", this.getEventArgs(t, e, n));
  }
  notifyMouseUp(t, e, n) {
    super.onMouseUp(t, e, n), this.notify("node:mouseup", this.getEventArgs(t, e, n));
  }
  notifyPortEvent(t, e, n) {
    const s = this.findAttr("port", e.target);
    if (s) {
      const r = e.type;
      t === "node:port:mouseenter" ? e.type = "mouseenter" : t === "node:port:mouseleave" && (e.type = "mouseleave"), this.notify(t, this.getPortEventArgs(e, s, n)), e.type = r;
    }
  }
  onClick(t, e, n) {
    super.onClick(t, e, n), this.notify("node:click", this.getEventArgs(t, e, n)), this.notifyPortEvent("node:port:click", t, { x: e, y: n });
  }
  onDblClick(t, e, n) {
    super.onDblClick(t, e, n), this.notify("node:dblclick", this.getEventArgs(t, e, n)), this.notifyPortEvent("node:port:dblclick", t, { x: e, y: n });
  }
  onContextMenu(t, e, n) {
    super.onContextMenu(t, e, n), this.notify("node:contextmenu", this.getEventArgs(t, e, n)), this.notifyPortEvent("node:port:contextmenu", t, { x: e, y: n });
  }
  onMouseDown(t, e, n) {
    this.isPropagationStopped(t) || (this.notifyMouseDown(t, e, n), this.notifyPortEvent("node:port:mousedown", t, { x: e, y: n }), this.startNodeDragging(t, e, n));
  }
  onMouseMove(t, e, n) {
    const s = this.getEventData(t), r = s.action;
    if (r === "magnet")
      this.dragMagnet(t, e, n);
    else {
      if (r === "move") {
        const a = s.targetView || this;
        a.dragNode(t, e, n), a.notify("node:moving", {
          e: t,
          x: e,
          y: n,
          view: a,
          cell: a.cell,
          node: a.cell
        });
      }
      this.notifyMouseMove(t, e, n), this.notifyPortEvent("node:port:mousemove", t, { x: e, y: n });
    }
    this.setEventData(t, s);
  }
  onMouseUp(t, e, n) {
    const s = this.getEventData(t), r = s.action;
    r === "magnet" ? this.stopMagnetDragging(t, e, n) : (this.notifyMouseUp(t, e, n), this.notifyPortEvent("node:port:mouseup", t, { x: e, y: n }), r === "move" && (s.targetView || this).stopNodeDragging(t, e, n));
    const o = s.targetMagnet;
    o && this.onMagnetClick(t, o, e, n), this.checkMouseleave(t);
  }
  onMouseOver(t) {
    super.onMouseOver(t), this.notify("node:mouseover", this.getEventArgs(t)), this.notifyPortEvent("node:port:mouseenter", t), this.notifyPortEvent("node:port:mouseover", t);
  }
  onMouseOut(t) {
    super.onMouseOut(t), this.notify("node:mouseout", this.getEventArgs(t)), this.notifyPortEvent("node:port:mouseleave", t), this.notifyPortEvent("node:port:mouseout", t);
  }
  onMouseEnter(t) {
    this.updateClassName(t), super.onMouseEnter(t), this.notify("node:mouseenter", this.getEventArgs(t));
  }
  onMouseLeave(t) {
    super.onMouseLeave(t), this.notify("node:mouseleave", this.getEventArgs(t));
  }
  onMouseWheel(t, e, n, s) {
    super.onMouseWheel(t, e, n, s), this.notify("node:mousewheel", Object.assign({ delta: s }, this.getEventArgs(t, e, n)));
  }
  onMagnetClick(t, e, n, s) {
    const r = this.graph;
    r.view.getMouseMovedCount(t) > r.options.clickThreshold || this.notify("node:magnet:click", Object.assign({ magnet: e }, this.getEventArgs(t, n, s)));
  }
  onMagnetDblClick(t, e, n, s) {
    this.notify("node:magnet:dblclick", Object.assign({ magnet: e }, this.getEventArgs(t, n, s)));
  }
  onMagnetContextMenu(t, e, n, s) {
    this.notify("node:magnet:contextmenu", Object.assign({ magnet: e }, this.getEventArgs(t, n, s)));
  }
  onMagnetMouseDown(t, e, n, s) {
    this.startMagnetDragging(t, n, s);
  }
  onCustomEvent(t, e, n, s) {
    this.notify("node:customevent", Object.assign({ name: e }, this.getEventArgs(t, n, s))), super.onCustomEvent(t, e, n, s);
  }
  prepareEmbedding(t) {
    const e = this.graph, s = this.getEventData(t).cell || this.cell, r = e.findViewByCell(s), o = e.snapToGrid(t.clientX, t.clientY);
    this.notify("node:embed", {
      e: t,
      node: s,
      view: r,
      cell: s,
      x: o.x,
      y: o.y,
      currentParent: s.getParent()
    });
  }
  processEmbedding(t, e) {
    const n = e.cell || this.cell, s = e.graph || this.graph, r = s.options.embedding, o = r.findParent;
    let a = typeof o == "function" ? z(o, s, {
      view: this,
      node: this.cell
    }).filter((d) => K.isCell(d) && this.cell.id !== d.id && !d.isDescendantOf(this.cell)) : s.model.getNodesUnderNode(n, {
      by: o
    });
    if (r.frontOnly && a.length > 0) {
      const d = Va(a, "zIndex"), f = gv(Object.keys(d).map((g) => parseInt(g, 10)));
      f && (a = d[f]);
    }
    a = a.filter((d) => d.visible);
    let l = null;
    const c = e.candidateEmbedView, u = r.validate;
    for (let d = a.length - 1; d >= 0; d -= 1) {
      const f = a[d];
      if (c && c.cell.id === f.id) {
        l = c;
        break;
      } else {
        const g = f.findView(s);
        if (u && z(u, s, {
          child: this.cell,
          parent: g.cell,
          childView: this,
          parentView: g
        })) {
          l = g;
          break;
        }
      }
    }
    this.clearEmbedding(e), l && l.highlight(null, { type: "embedding" }), e.candidateEmbedView = l;
    const h = s.snapToGrid(t.clientX, t.clientY);
    this.notify("node:embedding", {
      e: t,
      cell: n,
      node: n,
      view: s.findViewByCell(n),
      x: h.x,
      y: h.y,
      currentParent: n.getParent(),
      candidateParent: l ? l.cell : null
    });
  }
  clearEmbedding(t) {
    const e = t.candidateEmbedView;
    e && (e.unhighlight(null, { type: "embedding" }), t.candidateEmbedView = null);
  }
  finalizeEmbedding(t, e) {
    this.graph.startBatch("embedding");
    const n = e.cell || this.cell, s = e.graph || this.graph, r = s.findViewByCell(n), o = n.getParent(), a = e.candidateEmbedView;
    if (a ? (a.unhighlight(null, { type: "embedding" }), e.candidateEmbedView = null, (o == null || o.id !== a.cell.id) && a.cell.insertChild(n, void 0, { ui: !0 })) : o && o.unembed(n, { ui: !0 }), s.model.getConnectedEdges(n, { deep: !0 }).forEach((l) => {
      l.updateParent({ ui: !0 });
    }), r && a) {
      const l = s.snapToGrid(t.clientX, t.clientY);
      r.notify("node:embedded", {
        e: t,
        cell: n,
        x: l.x,
        y: l.y,
        node: n,
        view: s.findViewByCell(n),
        previousParent: o,
        currentParent: n.getParent()
      });
    }
    this.graph.stopBatch("embedding");
  }
  getDelegatedView() {
    let t = this.cell, e = this;
    for (; e && !t.isEdge(); ) {
      if (!t.hasParent() || e.can("stopDelegateOnDragging"))
        return e;
      t = t.getParent(), e = this.graph.findViewByCell(t);
    }
    return null;
  }
  validateMagnet(t, e, n) {
    if (e.getAttribute("magnet") !== "passive") {
      const s = this.graph.options.connecting.validateMagnet;
      return s ? z(s, this.graph, {
        e: n,
        magnet: e,
        view: t,
        cell: t.cell
      }) : !0;
    }
    return !1;
  }
  startMagnetDragging(t, e, n) {
    if (!this.can("magnetConnectable"))
      return;
    t.stopPropagation();
    const s = t.currentTarget, r = this.graph;
    this.setEventData(t, {
      targetMagnet: s
    }), this.validateMagnet(this, s, t) ? (r.options.magnetThreshold <= 0 && this.startConnectting(t, s, e, n), this.setEventData(t, {
      action: "magnet"
    }), this.stopPropagation(t)) : this.onMouseDown(t, e, n), r.view.delegateDragEvents(t, this);
  }
  startConnectting(t, e, n, s) {
    this.graph.model.startBatch("add-edge");
    const r = this.createEdgeFromMagnet(e, n, s);
    r.setEventData(t, r.prepareArrowheadDragging("target", {
      x: n,
      y: s,
      isNewEdge: !0,
      fallbackAction: "remove"
    })), this.setEventData(t, { edgeView: r }), r.notifyMouseDown(t, n, s);
  }
  getDefaultEdge(t, e) {
    let n;
    const s = this.graph.options.connecting.createEdge;
    return s && (n = z(s, this.graph, {
      sourceMagnet: e,
      sourceView: t,
      sourceCell: t.cell
    })), n;
  }
  createEdgeFromMagnet(t, e, n) {
    const s = this.graph, r = s.model, o = this.getDefaultEdge(this, t);
    return o.setSource(Object.assign(Object.assign({}, o.getSource()), this.getEdgeTerminal(t, e, n, o, "source"))), o.setTarget(Object.assign(Object.assign({}, o.getTarget()), { x: e, y: n })), o.addTo(r, { async: !1, ui: !0 }), o.findView(s);
  }
  dragMagnet(t, e, n) {
    const s = this.getEventData(t), r = s.edgeView;
    if (r)
      r.onMouseMove(t, e, n), this.autoScrollGraph(t.clientX, t.clientY);
    else {
      const o = this.graph, a = o.options.magnetThreshold, l = this.getEventTarget(t), c = s.targetMagnet;
      if (a === "onleave") {
        if (c === l || c.contains(l))
          return;
      } else if (o.view.getMouseMovedCount(t) <= a)
        return;
      this.startConnectting(t, c, e, n);
    }
  }
  stopMagnetDragging(t, e, n) {
    const r = this.eventData(t).edgeView;
    r && (r.onMouseUp(t, e, n), this.graph.model.stopBatch("add-edge"));
  }
  notifyUnhandledMouseDown(t, e, n) {
    this.notify("node:unhandled:mousedown", {
      e: t,
      x: e,
      y: n,
      view: this,
      cell: this.cell,
      node: this.cell
    });
  }
  notifyNodeMove(t, e, n, s, r) {
    let o = [r];
    const a = this.graph.getPlugin("selection");
    if (a && a.isSelectionMovable()) {
      const l = a.getSelectedCells();
      l.includes(r) && (o = l.filter((c) => c.isNode()));
    }
    o.forEach((l) => {
      this.notify(t, {
        e,
        x: n,
        y: s,
        cell: l,
        node: l,
        view: l.findView(this.graph)
      });
    });
  }
  getRestrictArea(t) {
    const e = this.graph.options.translating.restrict, n = typeof e == "function" ? z(e, this.graph, t) : e;
    return typeof n == "number" ? this.graph.transform.getGraphArea().inflate(n) : n === !0 ? this.graph.transform.getGraphArea() : n || null;
  }
  startNodeDragging(t, e, n) {
    const s = this.getDelegatedView();
    if (s == null || !s.can("nodeMovable"))
      return this.notifyUnhandledMouseDown(t, e, n);
    this.setEventData(t, {
      targetView: s,
      action: "move"
    });
    const r = x.create(s.cell.getPosition());
    s.setEventData(t, {
      moving: !1,
      offset: r.diff(e, n),
      restrict: this.getRestrictArea(s)
    });
  }
  dragNode(t, e, n) {
    const s = this.cell, r = this.graph, o = r.getGridSize(), a = this.getEventData(t), l = a.offset, c = a.restrict;
    a.moving || (a.moving = !0, this.addClass("node-moving"), this.notifyNodeMove("node:move", t, e, n, this.cell)), this.autoScrollGraph(t.clientX, t.clientY);
    const u = ct.snapToGrid(e + l.x, o), h = ct.snapToGrid(n + l.y, o);
    s.setPosition(u, h, {
      restrict: c,
      deep: !0,
      ui: !0
    }), r.options.embedding.enabled && (a.embedding || (this.prepareEmbedding(t), a.embedding = !0), this.processEmbedding(t, a));
  }
  autoOffsetNode() {
    const t = this.cell, e = this.graph, n = Object.assign({ id: t.id }, t.getPosition()), r = e.getNodes().map((c) => {
      const u = c.getPosition();
      return { id: c.id, x: u.x, y: u.y };
    }).filter((c) => c.id !== n.id), o = [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1]
      // offset to left top
    ];
    let a = e.getGridSize();
    const l = (c) => r.some((u) => u.x === c.x && u.y === c.y);
    for (; l(n); ) {
      let c = !1;
      for (let u = 0; u < o.length; u += 1) {
        const h = o[u], d = {
          x: n.x + h[0] * a,
          y: n.y + h[1] * a
        };
        if (!l(d)) {
          t.translate(h[0] * a, h[1] * a), c = !0;
          break;
        }
      }
      if (c)
        break;
      a += e.getGridSize();
    }
  }
  stopNodeDragging(t, e, n) {
    const s = this.getEventData(t), r = this.graph;
    s.embedding && this.finalizeEmbedding(t, s), s.moving && (r.options.translating.autoOffset && this.autoOffsetNode(), this.removeClass("node-moving"), this.notifyNodeMove("node:moved", t, e, n, this.cell)), s.moving = !1, s.embedding = !1;
  }
  // eslint-disable-next-line
  autoScrollGraph(t, e) {
    const n = this.graph.getPlugin("scroller");
    n && n.autoScroll(t, e);
  }
}
(function(i) {
  i.toStringTag = `X6.${i.name}`;
  function t(e) {
    if (e == null)
      return !1;
    if (e instanceof i)
      return !0;
    const n = e[Symbol.toStringTag], s = e;
    return (n == null || n === i.toStringTag) && typeof s.isNodeView == "function" && typeof s.isEdgeView == "function" && typeof s.confirmUpdate == "function" && typeof s.update == "function" && typeof s.findPortElem == "function" && typeof s.resize == "function" && typeof s.rotate == "function" && typeof s.translate == "function";
  }
  i.isNodeView = t;
})(Ee || (Ee = {}));
Ee.config({
  isSvgElement: !0,
  priority: 0,
  bootstrap: ["render"],
  actions: {
    view: ["render"],
    markup: ["render"],
    attrs: ["update"],
    size: ["resize", "ports", "tools"],
    angle: ["rotate", "tools"],
    position: ["translate", "tools"],
    ports: ["ports"],
    tools: ["tools"]
  }
});
Ee.registry.register("node", Ee, !0);
var OE = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
};
class Ve extends Tt {
  constructor() {
    super(...arguments), this.POINT_ROUNDING = 2, this.labelDestroyFn = {};
  }
  get [Symbol.toStringTag]() {
    return Ve.toStringTag;
  }
  getContainerClassName() {
    return [super.getContainerClassName(), this.prefixClassName("edge")].join(" ");
  }
  get sourceBBox() {
    const t = this.sourceView;
    if (!t) {
      const n = this.cell.getSource();
      return new R(n.x, n.y);
    }
    const e = this.sourceMagnet;
    return t.isEdgeElement(e) ? new R(this.sourceAnchor.x, this.sourceAnchor.y) : t.getBBoxOfElement(e || t.container);
  }
  get targetBBox() {
    const t = this.targetView;
    if (!t) {
      const n = this.cell.getTarget();
      return new R(n.x, n.y);
    }
    const e = this.targetMagnet;
    return t.isEdgeElement(e) ? new R(this.targetAnchor.x, this.targetAnchor.y) : t.getBBoxOfElement(e || t.container);
  }
  isEdgeView() {
    return !0;
  }
  confirmUpdate(t, e = {}) {
    let n = t;
    if (this.hasAction(n, "source")) {
      if (!this.updateTerminalProperties("source"))
        return n;
      n = this.removeAction(n, "source");
    }
    if (this.hasAction(n, "target")) {
      if (!this.updateTerminalProperties("target"))
        return n;
      n = this.removeAction(n, "target");
    }
    return this.hasAction(n, "render") ? (this.render(), n = this.removeAction(n, ["render", "update", "labels", "tools"]), n) : (n = this.handleAction(n, "update", () => this.update(e)), n = this.handleAction(n, "labels", () => this.onLabelsChange(e)), n = this.handleAction(n, "tools", () => this.renderTools()), n);
  }
  // #region render
  render() {
    return this.empty(), this.renderMarkup(), this.labelContainer = null, this.renderLabels(), this.update(), this.renderTools(), this;
  }
  renderMarkup() {
    const t = this.cell.markup;
    if (t) {
      if (typeof t == "string")
        throw new TypeError("Not support string markup.");
      return this.renderJSONMarkup(t);
    }
    throw new TypeError("Invalid edge markup.");
  }
  renderJSONMarkup(t) {
    const e = this.parseJSONMarkup(t, this.container);
    this.selectors = e.selectors, this.container.append(e.fragment);
  }
  customizeLabels() {
    if (this.labelContainer) {
      const t = this.cell, e = t.labels;
      for (let n = 0, s = e.length; n < s; n += 1) {
        const r = e[n], o = this.labelCache[n], a = this.labelSelectors[n], l = this.graph.options.onEdgeLabelRendered;
        if (l) {
          const c = l({
            edge: t,
            label: r,
            container: o,
            selectors: a
          });
          c && (this.labelDestroyFn[n] = c);
        }
      }
    }
  }
  destroyCustomizeLabels() {
    const t = this.cell.labels;
    if (this.labelCache && this.labelSelectors && this.labelDestroyFn)
      for (let e = 0, n = t.length; e < n; e += 1) {
        const s = this.labelDestroyFn[e], r = this.labelCache[e], o = this.labelSelectors[e];
        s && r && o && s({
          edge: this.cell,
          label: t[e],
          container: r,
          selectors: o
        });
      }
    this.labelDestroyFn = {};
  }
  renderLabels() {
    const t = this.cell, e = t.getLabels(), n = e.length;
    let s = this.labelContainer;
    if (this.labelCache = {}, this.labelSelectors = {}, n <= 0)
      return s && s.parentNode && s.parentNode.removeChild(s), this;
    s ? this.empty(s) : (s = Se("g"), this.addClass(this.prefixClassName("edge-labels"), s), this.labelContainer = s);
    for (let r = 0, o = e.length; r < o; r += 1) {
      const a = e[r], l = this.normalizeLabelMarkup(this.parseLabelMarkup(a.markup));
      let c, u;
      if (l)
        c = l.node, u = l.selectors;
      else {
        const d = t.getDefaultLabel(), f = this.normalizeLabelMarkup(this.parseLabelMarkup(d.markup));
        c = f.node, u = f.selectors;
      }
      c.setAttribute("data-index", `${r}`), s.appendChild(c);
      const h = this.rootSelector;
      if (u[h])
        throw new Error("Ambiguous label root selector.");
      u[h] = c, this.labelCache[r] = c, this.labelSelectors[r] = u;
    }
    return s.parentNode == null && this.container.appendChild(s), this.updateLabels(), this.customizeLabels(), this;
  }
  onLabelsChange(t = {}) {
    this.destroyCustomizeLabels(), this.shouldRerenderLabels(t) ? this.renderLabels() : this.updateLabels(), this.updateLabelPositions();
  }
  shouldRerenderLabels(t = {}) {
    const e = this.cell.previous("labels");
    if (e == null)
      return !0;
    if ("propertyPathArray" in t && "propertyValue" in t) {
      const n = t.propertyPathArray || [], s = n.length;
      if (s > 1) {
        const r = n[1];
        if (e[r]) {
          if (s === 2)
            return typeof t.propertyValue == "object" && as(t.propertyValue, "markup");
          if (n[2] !== "markup")
            return !1;
        }
      }
    }
    return !0;
  }
  parseLabelMarkup(t) {
    return t ? typeof t == "string" ? this.parseLabelStringMarkup(t) : this.parseJSONMarkup(t) : null;
  }
  parseLabelStringMarkup(t) {
    const e = G.createVectors(t), n = document.createDocumentFragment();
    for (let s = 0, r = e.length; s < r; s += 1) {
      const o = e[s].node;
      n.appendChild(o);
    }
    return { fragment: n, selectors: {} };
  }
  normalizeLabelMarkup(t) {
    if (t == null)
      return;
    const e = t.fragment;
    if (!(e instanceof DocumentFragment) || !e.hasChildNodes())
      throw new Error("Invalid label markup.");
    let n;
    const s = e.childNodes;
    return s.length > 1 || s[0].nodeName.toUpperCase() !== "G" ? n = G.create("g").append(e) : n = G.create(s[0]), n.addClass(this.prefixClassName("edge-label")), {
      node: n.node,
      selectors: t.selectors
    };
  }
  updateLabels() {
    if (this.labelContainer) {
      const t = this.cell, e = t.labels, n = this.can("edgeLabelMovable"), s = t.getDefaultLabel();
      for (let r = 0, o = e.length; r < o; r += 1) {
        const a = this.labelCache[r], l = this.labelSelectors[r];
        a.setAttribute("cursor", n ? "move" : "default");
        const c = e[r], u = kt({}, s.attrs, c.attrs);
        this.updateAttrs(a, u, {
          selectors: l,
          rootBBox: c.size ? R.fromSize(c.size) : void 0
        });
      }
    }
  }
  renderTools() {
    const t = this.cell.getTools();
    return this.addTools(t), this;
  }
  // #endregion
  // #region updating
  update(t = {}) {
    this.cleanCache(), this.updateConnection(t);
    const e = this.cell.getAttrs(), { text: n } = e, s = OE(e, ["text"]);
    return s != null && this.updateAttrs(this.container, s, {
      selectors: this.selectors
    }), this.updateLabelPositions(), this.updateTools(t), this;
  }
  removeRedundantLinearVertices(t = {}) {
    const e = this.cell, n = e.getVertices(), s = [this.sourceAnchor, ...n, this.targetAnchor], r = s.length, o = new Mt(s);
    o.simplify({ threshold: 0.01 });
    const a = o.points.map((c) => c.toJSON()), l = a.length;
    return r === l ? 0 : (e.setVertices(a.slice(1, l - 1), t), r - l);
  }
  getTerminalView(t) {
    switch (t) {
      case "source":
        return this.sourceView || null;
      case "target":
        return this.targetView || null;
      default:
        throw new Error(`Unknown terminal type '${t}'`);
    }
  }
  getTerminalAnchor(t) {
    switch (t) {
      case "source":
        return x.create(this.sourceAnchor);
      case "target":
        return x.create(this.targetAnchor);
      default:
        throw new Error(`Unknown terminal type '${t}'`);
    }
  }
  getTerminalConnectionPoint(t) {
    switch (t) {
      case "source":
        return x.create(this.sourcePoint);
      case "target":
        return x.create(this.targetPoint);
      default:
        throw new Error(`Unknown terminal type '${t}'`);
    }
  }
  getTerminalMagnet(t, e = {}) {
    switch (t) {
      case "source": {
        if (e.raw)
          return this.sourceMagnet;
        const n = this.sourceView;
        return n ? this.sourceMagnet || n.container : null;
      }
      case "target": {
        if (e.raw)
          return this.targetMagnet;
        const n = this.targetView;
        return n ? this.targetMagnet || n.container : null;
      }
      default:
        throw new Error(`Unknown terminal type '${t}'`);
    }
  }
  updateConnection(t = {}) {
    const e = this.cell;
    if (t.translateBy && e.isFragmentDescendantOf(t.translateBy)) {
      const n = t.tx || 0, s = t.ty || 0;
      this.routePoints = new Mt(this.routePoints).translate(n, s).points, this.translateConnectionPoints(n, s), this.path.translate(n, s);
    } else {
      const n = e.getVertices(), s = this.findAnchors(n);
      this.sourceAnchor = s.source, this.targetAnchor = s.target, this.routePoints = this.findRoutePoints(n);
      const r = this.findConnectionPoints(this.routePoints, this.sourceAnchor, this.targetAnchor);
      this.sourcePoint = r.source, this.targetPoint = r.target;
      const o = this.findMarkerPoints(this.routePoints, this.sourcePoint, this.targetPoint);
      this.path = this.findPath(this.routePoints, o.source || this.sourcePoint, o.target || this.targetPoint);
    }
    this.cleanCache();
  }
  findAnchors(t) {
    const e = this.cell, n = e.source, s = e.target, r = t[0], o = t[t.length - 1];
    return s.priority && !n.priority ? this.findAnchorsOrdered("target", o, "source", r) : this.findAnchorsOrdered("source", r, "target", o);
  }
  findAnchorsOrdered(t, e, n, s) {
    let r, o;
    const a = this.cell, l = a[t], c = a[n], u = this.getTerminalView(t), h = this.getTerminalView(n), d = this.getTerminalMagnet(t), f = this.getTerminalMagnet(n);
    if (u) {
      let g;
      e ? g = x.create(e) : h ? g = f : g = x.create(c), r = this.getAnchor(l.anchor, u, d, g, t);
    } else
      r = x.create(l);
    if (h) {
      const g = x.create(s || r);
      o = this.getAnchor(c.anchor, h, f, g, n);
    } else
      o = x.isPointLike(c) ? x.create(c) : new x();
    return {
      [t]: r,
      [n]: o
    };
  }
  getAnchor(t, e, n, s, r) {
    const o = e.isEdgeElement(n), a = this.graph.options.connecting;
    let l = typeof t == "string" ? { name: t } : t;
    if (!l) {
      const h = o ? (r === "source" ? a.sourceEdgeAnchor : a.targetEdgeAnchor) || a.edgeAnchor : (r === "source" ? a.sourceAnchor : a.targetAnchor) || a.anchor;
      l = typeof h == "string" ? { name: h } : h;
    }
    if (!l)
      throw new Error("Anchor should be specified.");
    let c;
    const u = l.name;
    if (o) {
      const h = Zn.registry.get(u);
      if (typeof h != "function")
        return Zn.registry.onNotFound(u);
      c = z(h, this, e, n, s, l.args || {}, r);
    } else {
      const h = Kn.registry.get(u);
      if (typeof h != "function")
        return Kn.registry.onNotFound(u);
      c = z(h, this, e, n, s, l.args || {}, r);
    }
    return c ? c.round(this.POINT_ROUNDING) : new x();
  }
  findRoutePoints(t = []) {
    const e = this.graph.options.connecting.router || Qe.presets.normal, n = this.cell.getRouter() || e;
    let s;
    if (typeof n == "function")
      s = z(n, this, t, {}, this);
    else {
      const r = typeof n == "string" ? n : n.name, o = typeof n == "string" ? {} : n.args || {}, a = r ? Qe.registry.get(r) : Qe.presets.normal;
      if (typeof a != "function")
        return Qe.registry.onNotFound(r);
      s = z(a, this, t, o, this);
    }
    return s == null ? t.map((r) => x.create(r)) : s.map((r) => x.create(r));
  }
  findConnectionPoints(t, e, n) {
    const s = this.cell, r = this.graph.options.connecting, o = s.getSource(), a = s.getTarget(), l = this.sourceView, c = this.targetView, u = t[0], h = t[t.length - 1];
    let d;
    if (l && !l.isEdgeElement(this.sourceMagnet)) {
      const g = this.sourceMagnet || l.container, p = u || n, m = new D(p, e), y = o.connectionPoint || r.sourceConnectionPoint || r.connectionPoint;
      d = this.getConnectionPoint(y, l, g, m, "source");
    } else
      d = e;
    let f;
    if (c && !c.isEdgeElement(this.targetMagnet)) {
      const g = this.targetMagnet || c.container, p = a.connectionPoint || r.targetConnectionPoint || r.connectionPoint, m = h || e, y = new D(m, n);
      f = this.getConnectionPoint(p, c, g, y, "target");
    } else
      f = n;
    return {
      source: d,
      target: f
    };
  }
  getConnectionPoint(t, e, n, s, r) {
    const o = s.end;
    if (t == null)
      return o;
    const a = typeof t == "string" ? t : t.name, l = typeof t == "string" ? {} : t.args, c = Qn.registry.get(a);
    if (typeof c != "function")
      return Qn.registry.onNotFound(a);
    const u = z(c, this, s, e, n, l || {}, r);
    return u ? u.round(this.POINT_ROUNDING) : o;
  }
  findMarkerPoints(t, e, n) {
    const s = (h) => {
      const d = this.cell.getAttrs(), f = Object.keys(d);
      for (let g = 0, p = f.length; g < p; g += 1) {
        const m = d[f[g]];
        if (m[`${h}Marker`] || m[`${h}-marker`]) {
          const y = m.strokeWidth || m["stroke-width"];
          if (y)
            return parseFloat(y);
          break;
        }
      }
      return null;
    }, r = t[0], o = t[t.length - 1];
    let a, l;
    const c = s("source");
    c && (a = e.clone().move(r || n, -c));
    const u = s("target");
    return u && (l = n.clone().move(o || e, -u)), this.sourceMarkerPoint = a || e.clone(), this.targetMarkerPoint = l || n.clone(), {
      source: a,
      target: l
    };
  }
  findPath(t, e, n) {
    const s = this.cell.getConnector() || this.graph.options.connecting.connector;
    let r, o, a;
    if (typeof s == "string" ? r = s : (r = s.name, o = s.args), r) {
      const c = yn.registry.get(r);
      if (typeof c != "function")
        return yn.registry.onNotFound(r);
      a = c;
    } else
      a = yn.presets.normal;
    const l = z(a, this, e, n, t, Object.assign(Object.assign({}, o), { raw: !0 }), this);
    return typeof l == "string" ? B.parse(l) : l;
  }
  translateConnectionPoints(t, e) {
    this.sourcePoint.translate(t, e), this.targetPoint.translate(t, e), this.sourceAnchor.translate(t, e), this.targetAnchor.translate(t, e), this.sourceMarkerPoint.translate(t, e), this.targetMarkerPoint.translate(t, e);
  }
  updateLabelPositions() {
    if (this.labelContainer == null)
      return this;
    if (!this.path)
      return this;
    const e = this.cell, n = e.getLabels();
    if (n.length === 0)
      return this;
    const s = e.getDefaultLabel(), r = this.normalizeLabelPosition(s.position);
    for (let o = 0, a = n.length; o < a; o += 1) {
      const l = n[o], c = this.labelCache[o];
      if (!c)
        continue;
      const u = this.normalizeLabelPosition(l.position), h = kt({}, r, u), d = this.getLabelTransformationMatrix(h);
      c.setAttribute("transform", fi(d));
    }
    return this;
  }
  updateTerminalProperties(t) {
    const e = this.cell, n = this.graph, s = e[t], r = s && s.cell, o = `${t}View`;
    if (!r)
      return this[o] = null, this.updateTerminalMagnet(t), !0;
    const a = n.getCellById(r);
    if (!a)
      throw new Error(`Edge's ${t} node with id "${r}" not exists`);
    const l = a.findView(n);
    return l ? (this[o] = l, this.updateTerminalMagnet(t), !0) : !1;
  }
  updateTerminalMagnet(t) {
    const e = `${t}Magnet`, n = this.getTerminalView(t);
    if (n) {
      let s = n.getMagnetFromEdgeTerminal(this.cell[t]);
      s === n.container && (s = null), this[e] = s;
    } else
      this[e] = null;
  }
  getLabelPositionAngle(t) {
    const e = this.cell.getLabelAt(t);
    return e && e.position && typeof e.position == "object" && e.position.angle || 0;
  }
  getLabelPositionArgs(t) {
    const e = this.cell.getLabelAt(t);
    if (e && e.position && typeof e.position == "object")
      return e.position.options;
  }
  getDefaultLabelPositionArgs() {
    const t = this.cell.getDefaultLabel();
    if (t && t.position && typeof t.position == "object")
      return t.position.options;
  }
  mergeLabelPositionArgs(t, e) {
    return t === null ? null : t === void 0 ? e === null ? null : e : kt({}, e, t);
  }
  // #endregion
  getConnection() {
    return this.path != null ? this.path.clone() : null;
  }
  getConnectionPathData() {
    if (this.path == null)
      return "";
    const t = this.cache.pathCache;
    return as(t, "data") || (t.data = this.path.serialize()), t.data || "";
  }
  getConnectionSubdivisions() {
    if (this.path == null)
      return null;
    const t = this.cache.pathCache;
    return as(t, "segmentSubdivisions") || (t.segmentSubdivisions = this.path.getSegmentSubdivisions()), t.segmentSubdivisions;
  }
  getConnectionLength() {
    if (this.path == null)
      return 0;
    const t = this.cache.pathCache;
    return as(t, "length") || (t.length = this.path.length({
      segmentSubdivisions: this.getConnectionSubdivisions()
    })), t.length;
  }
  getPointAtLength(t) {
    return this.path == null ? null : this.path.pointAtLength(t, {
      segmentSubdivisions: this.getConnectionSubdivisions()
    });
  }
  getPointAtRatio(t) {
    return this.path == null ? null : (ze(t) && (t = parseFloat(t) / 100), this.path.pointAt(t, {
      segmentSubdivisions: this.getConnectionSubdivisions()
    }));
  }
  getTangentAtLength(t) {
    return this.path == null ? null : this.path.tangentAtLength(t, {
      segmentSubdivisions: this.getConnectionSubdivisions()
    });
  }
  getTangentAtRatio(t) {
    return this.path == null ? null : this.path.tangentAt(t, {
      segmentSubdivisions: this.getConnectionSubdivisions()
    });
  }
  getClosestPoint(t) {
    return this.path == null ? null : this.path.closestPoint(t, {
      segmentSubdivisions: this.getConnectionSubdivisions()
    });
  }
  getClosestPointLength(t) {
    return this.path == null ? null : this.path.closestPointLength(t, {
      segmentSubdivisions: this.getConnectionSubdivisions()
    });
  }
  getClosestPointRatio(t) {
    return this.path == null ? null : this.path.closestPointNormalizedLength(t, {
      segmentSubdivisions: this.getConnectionSubdivisions()
    });
  }
  getLabelPosition(t, e, n, s) {
    const r = { distance: 0 };
    let o = 0, a;
    typeof n == "number" ? (o = n, a = s) : a = n, a != null && (r.options = a);
    const l = a && a.absoluteOffset, c = !(a && a.absoluteDistance), u = a && a.absoluteDistance && a.reverseDistance, h = this.path, d = {
      segmentSubdivisions: this.getConnectionSubdivisions()
    }, f = new x(t, e), g = h.closestPointT(f, d), p = this.getConnectionLength() || 0;
    let m = h.lengthAtT(g, d);
    c && (m = p > 0 ? m / p : 0), u && (m = -1 * (p - m) || 1), r.distance = m;
    let y;
    l || (y = h.tangentAtT(g));
    let v;
    if (y)
      v = y.pointOffset(f);
    else {
      const b = h.pointAtT(g), w = f.diff(b);
      v = { x: w.x, y: w.y };
    }
    return r.offset = v, r.angle = o, r;
  }
  normalizeLabelPosition(t) {
    return typeof t == "number" ? { distance: t } : t;
  }
  getLabelTransformationMatrix(t) {
    const e = this.normalizeLabelPosition(t), n = e.options || {}, s = e.angle || 0, r = e.distance, o = r > 0 && r <= 1;
    let a = 0;
    const l = { x: 0, y: 0 }, c = e.offset;
    c && (typeof c == "number" ? a = c : (c.x != null && (l.x = c.x), c.y != null && (l.y = c.y)));
    const u = l.x !== 0 || l.y !== 0 || a === 0, h = n.keepGradient, d = n.ensureLegibility, f = this.path, g = { segmentSubdivisions: this.getConnectionSubdivisions() }, p = o ? r * this.getConnectionLength() : r, m = f.tangentAtLength(p, g);
    let y, v = s;
    if (m) {
      if (u)
        y = m.start, y.translate(l);
      else {
        const b = m.clone();
        b.rotate(-90, m.start), b.setLength(a), y = b.end;
      }
      h && (v = m.angle() + s, d && (v = ut.normalize((v + 90) % 180 - 90)));
    } else
      y = f.start, u && y.translate(l);
    return Vt().translate(y.x, y.y).rotate(v);
  }
  getVertexIndex(t, e) {
    const s = this.cell.getVertices(), r = this.getClosestPointLength(new x(t, e));
    let o = 0;
    if (r != null)
      for (const a = s.length; o < a; o += 1) {
        const l = s[o], c = this.getClosestPointLength(l);
        if (c != null && r < c)
          break;
      }
    return o;
  }
  getEventArgs(t, e, n) {
    const s = this, r = s.cell, o = r;
    return e == null || n == null ? { e: t, view: s, edge: r, cell: o } : { e: t, x: e, y: n, view: s, edge: r, cell: o };
  }
  notifyUnhandledMouseDown(t, e, n) {
    this.notify("edge:unhandled:mousedown", {
      e: t,
      x: e,
      y: n,
      view: this,
      cell: this.cell,
      edge: this.cell
    });
  }
  notifyMouseDown(t, e, n) {
    super.onMouseDown(t, e, n), this.notify("edge:mousedown", this.getEventArgs(t, e, n));
  }
  notifyMouseMove(t, e, n) {
    super.onMouseMove(t, e, n), this.notify("edge:mousemove", this.getEventArgs(t, e, n));
  }
  notifyMouseUp(t, e, n) {
    super.onMouseUp(t, e, n), this.notify("edge:mouseup", this.getEventArgs(t, e, n));
  }
  onClick(t, e, n) {
    super.onClick(t, e, n), this.notify("edge:click", this.getEventArgs(t, e, n));
  }
  onDblClick(t, e, n) {
    super.onDblClick(t, e, n), this.notify("edge:dblclick", this.getEventArgs(t, e, n));
  }
  onContextMenu(t, e, n) {
    super.onContextMenu(t, e, n), this.notify("edge:contextmenu", this.getEventArgs(t, e, n));
  }
  onMouseDown(t, e, n) {
    this.notifyMouseDown(t, e, n), this.startEdgeDragging(t, e, n);
  }
  onMouseMove(t, e, n) {
    const s = this.getEventData(t);
    switch (s.action) {
      case "drag-label": {
        this.dragLabel(t, e, n);
        break;
      }
      case "drag-arrowhead": {
        this.dragArrowhead(t, e, n);
        break;
      }
      case "drag-edge": {
        this.dragEdge(t, e, n);
        break;
      }
    }
    return this.notifyMouseMove(t, e, n), s;
  }
  onMouseUp(t, e, n) {
    const s = this.getEventData(t);
    switch (s.action) {
      case "drag-label": {
        this.stopLabelDragging(t, e, n);
        break;
      }
      case "drag-arrowhead": {
        this.stopArrowheadDragging(t, e, n);
        break;
      }
      case "drag-edge": {
        this.stopEdgeDragging(t, e, n);
        break;
      }
    }
    return this.notifyMouseUp(t, e, n), this.checkMouseleave(t), s;
  }
  onMouseOver(t) {
    super.onMouseOver(t), this.notify("edge:mouseover", this.getEventArgs(t));
  }
  onMouseOut(t) {
    super.onMouseOut(t), this.notify("edge:mouseout", this.getEventArgs(t));
  }
  onMouseEnter(t) {
    super.onMouseEnter(t), this.notify("edge:mouseenter", this.getEventArgs(t));
  }
  onMouseLeave(t) {
    super.onMouseLeave(t), this.notify("edge:mouseleave", this.getEventArgs(t));
  }
  onMouseWheel(t, e, n, s) {
    super.onMouseWheel(t, e, n, s), this.notify("edge:mousewheel", Object.assign({ delta: s }, this.getEventArgs(t, e, n)));
  }
  onCustomEvent(t, e, n, s) {
    if (mu(t.target, "edge-tool", this.container)) {
      if (t.stopPropagation(), this.can("useEdgeTools")) {
        if (e === "edge:remove") {
          this.cell.remove({ ui: !0 });
          return;
        }
        this.notify("edge:customevent", Object.assign({ name: e }, this.getEventArgs(t, n, s)));
      }
      this.notifyMouseDown(t, n, s);
    } else
      this.notify("edge:customevent", Object.assign({ name: e }, this.getEventArgs(t, n, s))), super.onCustomEvent(t, e, n, s);
  }
  onLabelMouseDown(t, e, n) {
    this.notifyMouseDown(t, e, n), this.startLabelDragging(t, e, n), this.getEventData(t).stopPropagation && t.stopPropagation();
  }
  // #region drag edge
  startEdgeDragging(t, e, n) {
    if (!this.can("edgeMovable")) {
      this.notifyUnhandledMouseDown(t, e, n);
      return;
    }
    this.setEventData(t, {
      x: e,
      y: n,
      moving: !1,
      action: "drag-edge"
    });
  }
  dragEdge(t, e, n) {
    const s = this.getEventData(t);
    s.moving || (s.moving = !0, this.addClass("edge-moving"), this.notify("edge:move", {
      e: t,
      x: e,
      y: n,
      view: this,
      cell: this.cell,
      edge: this.cell
    })), this.cell.translate(e - s.x, n - s.y, { ui: !0 }), this.setEventData(t, { x: e, y: n }), this.notify("edge:moving", {
      e: t,
      x: e,
      y: n,
      view: this,
      cell: this.cell,
      edge: this.cell
    });
  }
  stopEdgeDragging(t, e, n) {
    const s = this.getEventData(t);
    s.moving && (this.removeClass("edge-moving"), this.notify("edge:moved", {
      e: t,
      x: e,
      y: n,
      view: this,
      cell: this.cell,
      edge: this.cell
    })), s.moving = !1;
  }
  // #endregion
  // #region drag arrowhead
  prepareArrowheadDragging(t, e) {
    const n = this.getTerminalMagnet(t), s = {
      action: "drag-arrowhead",
      x: e.x,
      y: e.y,
      isNewEdge: e.isNewEdge === !0,
      terminalType: t,
      initialMagnet: n,
      initialTerminal: qr(this.cell[t]),
      fallbackAction: e.fallbackAction || "revert",
      getValidateConnectionArgs: this.createValidateConnectionArgs(t),
      options: e.options
    };
    return this.beforeArrowheadDragging(s), s;
  }
  createValidateConnectionArgs(t) {
    const e = [];
    e[4] = t, e[5] = this;
    let n, s = 0, r = 0;
    t === "source" ? (s = 2, n = "target") : (r = 2, n = "source");
    const o = this.cell[n], a = o.cell;
    if (a) {
      let l;
      const c = e[s] = this.graph.findViewByCell(a);
      c && (l = c.getMagnetFromEdgeTerminal(o), l === c.container && (l = void 0)), e[s + 1] = l;
    }
    return (l, c) => (e[r] = l, e[r + 1] = l.container === c ? void 0 : c, e);
  }
  beforeArrowheadDragging(t) {
    t.zIndex = this.cell.zIndex, this.cell.toFront();
    const e = this.container.style;
    t.pointerEvents = e.pointerEvents, e.pointerEvents = "none", this.graph.options.connecting.highlight && this.highlightAvailableMagnets(t);
  }
  afterArrowheadDragging(t) {
    t.zIndex != null && (this.cell.setZIndex(t.zIndex, { ui: !0 }), t.zIndex = null);
    const e = this.container;
    e.style.pointerEvents = t.pointerEvents || "", this.graph.options.connecting.highlight && this.unhighlightAvailableMagnets(t);
  }
  validateConnection(t, e, n, s, r, o, a) {
    const l = this.graph.options.connecting, c = l.allowLoop, u = l.allowNode, h = l.allowEdge, d = l.allowPort, f = l.allowMulti, g = l.validateConnection, p = o ? o.cell : null, m = r === "target" ? n : t, y = r === "target" ? s : e;
    let v = !0;
    const b = (w) => {
      const E = r === "source" ? a ? a.port : null : p ? p.getSourcePortId() : null, S = r === "target" ? a ? a.port : null : p ? p.getTargetPortId() : null;
      return z(w, this.graph, {
        edge: p,
        edgeView: o,
        sourceView: t,
        targetView: n,
        sourcePort: E,
        targetPort: S,
        sourceMagnet: e,
        targetMagnet: s,
        sourceCell: t ? t.cell : null,
        targetCell: n ? n.cell : null,
        type: r
      });
    };
    if (c != null && (typeof c == "boolean" ? !c && t === n && (v = !1) : v = b(c)), v && d != null && (typeof d == "boolean" ? !d && y && (v = !1) : v = b(d)), v && h != null && (typeof h == "boolean" ? !h && Ve.isEdgeView(m) && (v = !1) : v = b(h)), v && u != null && y == null && (typeof u == "boolean" ? !u && Ee.isNodeView(m) && (v = !1) : v = b(u)), v && f != null && o) {
      const w = o.cell, E = r === "source" ? a : w.getSource(), S = r === "target" ? a : w.getTarget(), C = a ? this.graph.getCellById(a.cell) : null;
      if (E && S && E.cell && S.cell && C)
        if (typeof f == "function")
          v = b(f);
        else {
          const P = this.graph.model.getConnectedEdges(C, {
            outgoing: r === "source",
            incoming: r === "target"
          });
          P.length && (f === "withPort" ? P.some((I) => {
            const T = I.getSource(), k = I.getTarget();
            return T && k && T.cell === E.cell && k.cell === S.cell && T.port != null && T.port === E.port && k.port != null && k.port === S.port;
          }) && (v = !1) : f || P.some((I) => {
            const T = I.getSource(), k = I.getTarget();
            return T && k && T.cell === E.cell && k.cell === S.cell;
          }) && (v = !1));
        }
    }
    return v && g != null && (v = b(g)), v;
  }
  allowConnectToBlank(t) {
    const e = this.graph, s = e.options.connecting.allowBlank;
    if (typeof s != "function")
      return !!s;
    const r = e.findViewByCell(t), o = t.getSourceCell(), a = t.getTargetCell(), l = e.findViewByCell(o), c = e.findViewByCell(a);
    return z(s, e, {
      edge: t,
      edgeView: r,
      sourceCell: o,
      targetCell: a,
      sourceView: l,
      targetView: c,
      sourcePort: t.getSourcePortId(),
      targetPort: t.getTargetPortId(),
      sourceMagnet: r.sourceMagnet,
      targetMagnet: r.targetMagnet
    });
  }
  validateEdge(t, e, n) {
    const s = this.graph;
    if (!this.allowConnectToBlank(t)) {
      const o = t.getSourceCellId(), a = t.getTargetCellId();
      if (!(o && a))
        return !1;
    }
    const r = s.options.connecting.validateEdge;
    return r ? z(r, s, {
      edge: t,
      type: e,
      previous: n
    }) : !0;
  }
  arrowheadDragging(t, e, n, s) {
    s.x = e, s.y = n, s.currentTarget !== t && (s.currentMagnet && s.currentView && s.currentView.unhighlight(s.currentMagnet, {
      type: "magnetAdsorbed"
    }), s.currentView = this.graph.findViewByElem(t), s.currentView ? (s.currentMagnet = s.currentView.findMagnet(t), s.currentMagnet && this.validateConnection(...s.getValidateConnectionArgs(s.currentView, s.currentMagnet), s.currentView.getEdgeTerminal(s.currentMagnet, e, n, this.cell, s.terminalType)) ? s.currentView.highlight(s.currentMagnet, {
      type: "magnetAdsorbed"
    }) : s.currentMagnet = null) : s.currentMagnet = null), s.currentTarget = t, this.cell.prop(s.terminalType, { x: e, y: n }, Object.assign(Object.assign({}, s.options), { ui: !0 }));
  }
  arrowheadDragged(t, e, n) {
    const s = t.currentView, r = t.currentMagnet;
    if (!r || !s)
      return;
    s.unhighlight(r, { type: "magnetAdsorbed" });
    const o = t.terminalType, a = s.getEdgeTerminal(r, e, n, this.cell, o);
    this.cell.setTerminal(o, a, { ui: !0 });
  }
  snapArrowhead(t, e, n) {
    const s = this.graph, { snap: r, allowEdge: o } = s.options.connecting, a = typeof r == "object" && r.radius || 50, l = typeof r == "object" && r.anchor || "center", c = s.renderer.findViewsInArea({
      x: t - a,
      y: e - a,
      width: 2 * a,
      height: 2 * a
    }, { nodeOnly: !0 });
    if (o) {
      const w = s.renderer.findEdgeViewsFromPoint({ x: t, y: e }, a).filter((E) => E !== this);
      c.push(...w);
    }
    const u = n.closestView || null, h = n.closestMagnet || null;
    n.closestView = null, n.closestMagnet = null;
    let d, f = Number.MAX_SAFE_INTEGER;
    const g = new x(t, e);
    c.forEach((w) => {
      if (w.container.getAttribute("magnet") !== "false") {
        if (w.isNodeView())
          d = l === "center" ? w.cell.getBBox().getCenter().distance(g) : w.cell.getBBox().getNearestPointToPoint(g).distance(g);
        else if (w.isEdgeView()) {
          const E = w.getClosestPoint(g);
          E ? d = E.distance(g) : d = Number.MAX_SAFE_INTEGER;
        }
        d < a && d < f && (h === w.container || this.validateConnection(...n.getValidateConnectionArgs(w, null), w.getEdgeTerminal(w.container, t, e, this.cell, n.terminalType))) && (f = d, n.closestView = w, n.closestMagnet = w.container);
      }
      w.container.querySelectorAll("[magnet]").forEach((E) => {
        if (E.getAttribute("magnet") !== "false") {
          const S = w.getBBoxOfElement(E);
          d = g.distance(S.getCenter()), d < a && d < f && (h === E || this.validateConnection(...n.getValidateConnectionArgs(w, E), w.getEdgeTerminal(E, t, e, this.cell, n.terminalType))) && (f = d, n.closestView = w, n.closestMagnet = E);
        }
      });
    });
    let p;
    const m = n.terminalType, y = n.closestView, v = n.closestMagnet, b = h !== v;
    if (u && b && u.unhighlight(h, {
      type: "magnetAdsorbed"
    }), y) {
      if (!b)
        return;
      y.highlight(v, {
        type: "magnetAdsorbed"
      }), p = y.getEdgeTerminal(v, t, e, this.cell, m);
    } else
      p = { x: t, y: e };
    this.cell.setTerminal(m, p, {}, Object.assign(Object.assign({}, n.options), { ui: !0 }));
  }
  snapArrowheadEnd(t) {
    const e = t.closestView, n = t.closestMagnet;
    e && n && (e.unhighlight(n, {
      type: "magnetAdsorbed"
    }), t.currentMagnet = e.findMagnet(n)), t.closestView = null, t.closestMagnet = null;
  }
  finishEmbedding(t) {
    this.graph.options.embedding.enabled && this.cell.updateParent() && (t.zIndex = null);
  }
  fallbackConnection(t) {
    switch (t.fallbackAction) {
      case "remove":
        this.cell.remove({ ui: !0 });
        break;
      case "revert":
      default:
        this.cell.prop(t.terminalType, t.initialTerminal, {
          ui: !0
        });
        break;
    }
  }
  notifyConnectionEvent(t, e) {
    const n = t.terminalType, s = t.initialTerminal, r = this.cell[n];
    if (r && !St.equalTerminals(s, r)) {
      const a = this.graph, l = s, c = l.cell ? a.getCellById(l.cell) : null, u = l.port, h = c ? a.findViewByCell(c) : null, d = c || t.isNewEdge ? null : x.create(s).toJSON(), f = r, g = f.cell ? a.getCellById(f.cell) : null, p = f.port, m = g ? a.findViewByCell(g) : null, y = g ? null : x.create(r).toJSON();
      this.notify("edge:connected", {
        e,
        previousCell: c,
        previousPort: u,
        previousView: h,
        previousPoint: d,
        currentCell: g,
        currentView: m,
        currentPort: p,
        currentPoint: y,
        previousMagnet: t.initialMagnet,
        currentMagnet: t.currentMagnet,
        edge: this.cell,
        view: this,
        type: n,
        isNew: t.isNewEdge
      });
    }
  }
  highlightAvailableMagnets(t) {
    const e = this.graph, n = e.model.getCells();
    t.marked = {};
    for (let s = 0, r = n.length; s < r; s += 1) {
      const o = e.findViewByCell(n[s]);
      if (!o || o.cell.id === this.cell.id)
        continue;
      const a = Array.prototype.slice.call(o.container.querySelectorAll("[magnet]"));
      o.container.getAttribute("magnet") !== "false" && a.push(o.container);
      const l = a.filter((c) => this.validateConnection(...t.getValidateConnectionArgs(o, c), o.getEdgeTerminal(c, t.x, t.y, this.cell, t.terminalType)));
      if (l.length > 0) {
        for (let c = 0, u = l.length; c < u; c += 1)
          o.highlight(l[c], { type: "magnetAvailable" });
        o.highlight(null, { type: "nodeAvailable" }), t.marked[o.cell.id] = l;
      }
    }
  }
  unhighlightAvailableMagnets(t) {
    const e = t.marked || {};
    Object.keys(e).forEach((n) => {
      const s = this.graph.findViewByCell(n);
      s && (e[n].forEach((o) => {
        s.unhighlight(o, { type: "magnetAvailable" });
      }), s.unhighlight(null, { type: "nodeAvailable" }));
    }), t.marked = null;
  }
  startArrowheadDragging(t, e, n) {
    if (!this.can("arrowheadMovable")) {
      this.notifyUnhandledMouseDown(t, e, n);
      return;
    }
    const r = t.target.getAttribute("data-terminal"), o = this.prepareArrowheadDragging(r, { x: e, y: n });
    this.setEventData(t, o);
  }
  dragArrowhead(t, e, n) {
    const s = this.getEventData(t);
    this.graph.options.connecting.snap ? this.snapArrowhead(e, n, s) : this.arrowheadDragging(this.getEventTarget(t), e, n, s);
  }
  stopArrowheadDragging(t, e, n) {
    const s = this.graph, r = this.getEventData(t);
    s.options.connecting.snap ? this.snapArrowheadEnd(r) : this.arrowheadDragged(r, e, n), this.validateEdge(this.cell, r.terminalType, r.initialTerminal) ? (this.finishEmbedding(r), this.notifyConnectionEvent(r, t)) : this.fallbackConnection(r), this.afterArrowheadDragging(r);
  }
  // #endregion
  // #region drag lable
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  startLabelDragging(t, e, n) {
    if (this.can("edgeLabelMovable")) {
      const s = t.currentTarget, r = parseInt(s.getAttribute("data-index"), 10), o = this.getLabelPositionAngle(r), a = this.getLabelPositionArgs(r), l = this.getDefaultLabelPositionArgs(), c = this.mergeLabelPositionArgs(a, l);
      this.setEventData(t, {
        index: r,
        positionAngle: o,
        positionArgs: c,
        stopPropagation: !0,
        action: "drag-label"
      });
    } else
      this.setEventData(t, { stopPropagation: !0 });
    this.graph.view.delegateDragEvents(t, this);
  }
  dragLabel(t, e, n) {
    const s = this.getEventData(t), r = this.cell.getLabelAt(s.index), o = kt({}, r, {
      position: this.getLabelPosition(e, n, s.positionAngle, s.positionArgs)
    });
    this.cell.setLabelAt(s.index, o);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  stopLabelDragging(t, e, n) {
  }
}
(function(i) {
  i.toStringTag = `X6.${i.name}`;
  function t(e) {
    if (e == null)
      return !1;
    if (e instanceof i)
      return !0;
    const n = e[Symbol.toStringTag], s = e;
    return (n == null || n === i.toStringTag) && typeof s.isNodeView == "function" && typeof s.isEdgeView == "function" && typeof s.confirmUpdate == "function" && typeof s.update == "function" && typeof s.getConnection == "function";
  }
  i.isEdgeView = t;
})(Ve || (Ve = {}));
Ve.config({
  isSvgElement: !0,
  priority: 1,
  bootstrap: ["render", "source", "target"],
  actions: {
    view: ["render"],
    markup: ["render"],
    attrs: ["update"],
    source: ["source", "update"],
    target: ["target", "update"],
    router: ["update"],
    connector: ["update"],
    labels: ["labels"],
    defaultLabel: ["labels"],
    tools: ["tools"],
    vertices: ["vertices", "update"]
  }
});
Ve.registry.register("edge", Ve, !0);
var AE = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
};
class Le extends rt {
  /** Graph's `this.container` is from outer, should not dispose */
  get disposeContainer() {
    return !1;
  }
  get options() {
    return this.graph.options;
  }
  constructor(t) {
    super(), this.graph = t;
    const { selectors: e, fragment: n } = mt.parseJSONMarkup(Le.markup);
    this.background = e.background, this.grid = e.grid, this.svg = e.svg, this.defs = e.defs, this.viewport = e.viewport, this.primer = e.primer, this.stage = e.stage, this.decorator = e.decorator, this.overlay = e.overlay, this.container = this.options.container, this.restore = Le.snapshoot(this.container), U(this.container, this.prefixClassName("graph")), Mn(this.container, n), this.delegateEvents();
  }
  delegateEvents() {
    const t = this.constructor;
    return super.delegateEvents(t.events), this;
  }
  /**
   * Guard the specified event. If the event is not interesting, it
   * returns `true`, otherwise returns `false`.
   */
  guard(t, e) {
    return t.type === "mousedown" && t.button === 2 || this.options.guard && this.options.guard(t, e) ? !0 : t.data && t.data.guarded !== void 0 ? t.data.guarded : !(e && e.cell && K.isCell(e.cell) || this.svg === t.target || this.container === t.target || this.svg.contains(t.target));
  }
  findView(t) {
    return this.graph.findViewByElem(t);
  }
  onDblClick(t) {
    this.options.preventDefaultDblClick && t.preventDefault();
    const e = this.normalizeEvent(t), n = this.findView(e.target);
    if (this.guard(e, n))
      return;
    const s = this.graph.snapToGrid(e.clientX, e.clientY);
    n ? n.onDblClick(e, s.x, s.y) : this.graph.trigger("blank:dblclick", {
      e,
      x: s.x,
      y: s.y
    });
  }
  onClick(t) {
    if (this.getMouseMovedCount(t) <= this.options.clickThreshold) {
      const e = this.normalizeEvent(t), n = this.findView(e.target);
      if (this.guard(e, n))
        return;
      const s = this.graph.snapToGrid(e.clientX, e.clientY);
      n ? n.onClick(e, s.x, s.y) : this.graph.trigger("blank:click", {
        e,
        x: s.x,
        y: s.y
      });
    }
  }
  isPreventDefaultContextMenu(t) {
    let e = this.options.preventDefaultContextMenu;
    return typeof e == "function" && (e = z(e, this.graph, { view: t })), e;
  }
  onContextMenu(t) {
    const e = this.normalizeEvent(t), n = this.findView(e.target);
    if (this.isPreventDefaultContextMenu(n) && t.preventDefault(), this.guard(e, n))
      return;
    const s = this.graph.snapToGrid(e.clientX, e.clientY);
    n ? n.onContextMenu(e, s.x, s.y) : this.graph.trigger("blank:contextmenu", {
      e,
      x: s.x,
      y: s.y
    });
  }
  delegateDragEvents(t, e) {
    t.data == null && (t.data = {}), this.setEventData(t, {
      currentView: e || null,
      mouseMovedCount: 0,
      startPosition: {
        x: t.clientX,
        y: t.clientY
      }
    });
    const n = this.constructor;
    this.delegateDocumentEvents(n.documentEvents, t.data), this.undelegateEvents();
  }
  getMouseMovedCount(t) {
    return this.getEventData(t).mouseMovedCount || 0;
  }
  onMouseDown(t) {
    const e = this.normalizeEvent(t), n = this.findView(e.target);
    if (this.guard(e, n))
      return;
    this.options.preventDefaultMouseDown && t.preventDefault();
    const s = this.graph.snapToGrid(e.clientX, e.clientY);
    n ? n.onMouseDown(e, s.x, s.y) : (this.options.preventDefaultBlankAction && ["touchstart"].includes(e.type) && t.preventDefault(), this.graph.trigger("blank:mousedown", {
      e,
      x: s.x,
      y: s.y
    })), this.delegateDragEvents(e, n);
  }
  onMouseMove(t) {
    const e = this.getEventData(t), n = e.startPosition;
    if (n && n.x === t.clientX && n.y === t.clientY || (e.mouseMovedCount == null && (e.mouseMovedCount = 0), e.mouseMovedCount += 1, e.mouseMovedCount <= this.options.moveThreshold))
      return;
    const r = this.normalizeEvent(t), o = this.graph.snapToGrid(r.clientX, r.clientY), a = e.currentView;
    a ? a.onMouseMove(r, o.x, o.y) : this.graph.trigger("blank:mousemove", {
      e: r,
      x: o.x,
      y: o.y
    }), this.setEventData(r, e);
  }
  onMouseUp(t) {
    this.undelegateDocumentEvents();
    const e = this.normalizeEvent(t), n = this.graph.snapToGrid(e.clientX, e.clientY), r = this.getEventData(t).currentView;
    if (r ? r.onMouseUp(e, n.x, n.y) : this.graph.trigger("blank:mouseup", {
      e,
      x: n.x,
      y: n.y
    }), !t.isPropagationStopped()) {
      const o = new Ne(t, {
        type: "click",
        data: t.data
      });
      this.onClick(o);
    }
    t.stopImmediatePropagation(), this.delegateEvents();
  }
  onMouseOver(t) {
    const e = this.normalizeEvent(t), n = this.findView(e.target);
    if (!this.guard(e, n))
      if (n)
        n.onMouseOver(e);
      else {
        if (this.container === e.target)
          return;
        this.graph.trigger("blank:mouseover", { e });
      }
  }
  onMouseOut(t) {
    const e = this.normalizeEvent(t), n = this.findView(e.target);
    if (!this.guard(e, n))
      if (n)
        n.onMouseOut(e);
      else {
        if (this.container === e.target)
          return;
        this.graph.trigger("blank:mouseout", { e });
      }
  }
  onMouseEnter(t) {
    const e = this.normalizeEvent(t), n = this.findView(e.target);
    if (this.guard(e, n))
      return;
    const s = this.graph.findViewByElem(e.relatedTarget);
    if (n) {
      if (s === n)
        return;
      n.onMouseEnter(e);
    } else {
      if (s)
        return;
      this.graph.trigger("graph:mouseenter", { e });
    }
  }
  onMouseLeave(t) {
    const e = this.normalizeEvent(t), n = this.findView(e.target);
    if (this.guard(e, n))
      return;
    const s = this.graph.findViewByElem(e.relatedTarget);
    if (n) {
      if (s === n)
        return;
      n.onMouseLeave(e);
    } else {
      if (s)
        return;
      this.graph.trigger("graph:mouseleave", { e });
    }
  }
  onMouseWheel(t) {
    const e = this.normalizeEvent(t), n = this.findView(e.target);
    if (this.guard(e, n))
      return;
    const s = e.originalEvent, r = this.graph.snapToGrid(s.clientX, s.clientY), o = Math.max(-1, Math.min(1, s.wheelDelta || -s.detail));
    n ? n.onMouseWheel(e, r.x, r.y, o) : this.graph.trigger("blank:mousewheel", {
      e,
      delta: o,
      x: r.x,
      y: r.y
    });
  }
  onCustomEvent(t) {
    const e = t.currentTarget, n = e.getAttribute("event") || e.getAttribute("data-event");
    if (n) {
      const s = this.findView(e);
      if (s) {
        const r = this.normalizeEvent(t);
        if (this.guard(r, s))
          return;
        const o = this.graph.snapToGrid(r.clientX, r.clientY);
        s.onCustomEvent(r, n, o.x, o.y);
      }
    }
  }
  handleMagnetEvent(t, e) {
    const n = t.currentTarget, s = n.getAttribute("magnet");
    if (s && s.toLowerCase() !== "false") {
      const r = this.findView(n);
      if (r) {
        const o = this.normalizeEvent(t);
        if (this.guard(o, r))
          return;
        const a = this.graph.snapToGrid(o.clientX, o.clientY);
        z(e, this.graph, r, o, n, a.x, a.y);
      }
    }
  }
  onMagnetMouseDown(t) {
    this.handleMagnetEvent(t, (e, n, s, r, o) => {
      e.onMagnetMouseDown(n, s, r, o);
    });
  }
  onMagnetDblClick(t) {
    this.handleMagnetEvent(t, (e, n, s, r, o) => {
      e.onMagnetDblClick(n, s, r, o);
    });
  }
  onMagnetContextMenu(t) {
    const e = this.findView(t.target);
    this.isPreventDefaultContextMenu(e) && t.preventDefault(), this.handleMagnetEvent(t, (n, s, r, o, a) => {
      n.onMagnetContextMenu(s, r, o, a);
    });
  }
  onLabelMouseDown(t) {
    const e = t.currentTarget, n = this.findView(e);
    if (n) {
      const s = this.normalizeEvent(t);
      if (this.guard(s, n))
        return;
      const r = this.graph.snapToGrid(s.clientX, s.clientY);
      n.onLabelMouseDown(s, r.x, r.y);
    }
  }
  onImageDragStart() {
    return !1;
  }
  dispose() {
    this.undelegateEvents(), this.undelegateDocumentEvents(), this.restore(), this.restore = () => {
    };
  }
}
AE([
  rt.dispose()
], Le.prototype, "dispose", null);
(function(i) {
  const t = `${fe.prefixCls}-graph`;
  i.markup = [
    {
      ns: Bt.xhtml,
      tagName: "div",
      selector: "background",
      className: `${t}-background`
    },
    {
      ns: Bt.xhtml,
      tagName: "div",
      selector: "grid",
      className: `${t}-grid`
    },
    {
      ns: Bt.svg,
      tagName: "svg",
      selector: "svg",
      className: `${t}-svg`,
      attrs: {
        width: "100%",
        height: "100%",
        "xmlns:xlink": Bt.xlink
      },
      children: [
        {
          tagName: "defs",
          selector: "defs"
        },
        {
          tagName: "g",
          selector: "viewport",
          className: `${t}-svg-viewport`,
          children: [
            {
              tagName: "g",
              selector: "primer",
              className: `${t}-svg-primer`
            },
            {
              tagName: "g",
              selector: "stage",
              className: `${t}-svg-stage`
            },
            {
              tagName: "g",
              selector: "decorator",
              className: `${t}-svg-decorator`
            },
            {
              tagName: "g",
              selector: "overlay",
              className: `${t}-svg-overlay`
            }
          ]
        }
      ]
    }
  ];
  function e(n) {
    const s = n.cloneNode();
    return n.childNodes.forEach((r) => s.appendChild(r)), () => {
      for (ns(n); n.attributes.length > 0; )
        n.removeAttribute(n.attributes[0].name);
      for (let r = 0, o = s.attributes.length; r < o; r += 1) {
        const a = s.attributes[r];
        n.setAttribute(a.name, a.value);
      }
      s.childNodes.forEach((r) => n.appendChild(r));
    };
  }
  i.snapshoot = e;
})(Le || (Le = {}));
(function(i) {
  const t = fe.prefixCls;
  i.events = {
    dblclick: "onDblClick",
    contextmenu: "onContextMenu",
    touchstart: "onMouseDown",
    mousedown: "onMouseDown",
    mouseover: "onMouseOver",
    mouseout: "onMouseOut",
    mouseenter: "onMouseEnter",
    mouseleave: "onMouseLeave",
    mousewheel: "onMouseWheel",
    DOMMouseScroll: "onMouseWheel",
    [`mouseenter  .${t}-cell`]: "onMouseEnter",
    [`mouseleave  .${t}-cell`]: "onMouseLeave",
    [`mouseenter  .${t}-cell-tools`]: "onMouseEnter",
    [`mouseleave  .${t}-cell-tools`]: "onMouseLeave",
    [`mousedown   .${t}-cell [event]`]: "onCustomEvent",
    [`touchstart  .${t}-cell [event]`]: "onCustomEvent",
    [`mousedown   .${t}-cell [data-event]`]: "onCustomEvent",
    [`touchstart  .${t}-cell [data-event]`]: "onCustomEvent",
    [`dblclick    .${t}-cell [magnet]`]: "onMagnetDblClick",
    [`contextmenu .${t}-cell [magnet]`]: "onMagnetContextMenu",
    [`mousedown   .${t}-cell [magnet]`]: "onMagnetMouseDown",
    [`touchstart  .${t}-cell [magnet]`]: "onMagnetMouseDown",
    [`dblclick    .${t}-cell [data-magnet]`]: "onMagnetDblClick",
    [`contextmenu .${t}-cell [data-magnet]`]: "onMagnetContextMenu",
    [`mousedown   .${t}-cell [data-magnet]`]: "onMagnetMouseDown",
    [`touchstart  .${t}-cell [data-magnet]`]: "onMagnetMouseDown",
    [`dragstart   .${t}-cell image`]: "onImageDragStart",
    [`mousedown   .${t}-edge .${t}-edge-label`]: "onLabelMouseDown",
    [`touchstart  .${t}-edge .${t}-edge-label`]: "onLabelMouseDown"
  }, i.documentEvents = {
    mousemove: "onMouseMove",
    touchmove: "onMouseMove",
    mouseup: "onMouseUp",
    touchend: "onMouseUp",
    touchcancel: "onMouseUp"
  };
})(Le || (Le = {}));
const ME = `.x6-graph {
  position: relative;
  overflow: hidden;
  outline: none;
  touch-action: none;
}
.x6-graph-background,
.x6-graph-grid,
.x6-graph-svg {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.x6-graph-background-stage,
.x6-graph-grid-stage,
.x6-graph-svg-stage {
  user-select: none;
}
.x6-graph.x6-graph-pannable {
  cursor: grab;
  cursor: -moz-grab;
  cursor: -webkit-grab;
}
.x6-graph.x6-graph-panning {
  cursor: grabbing;
  cursor: -moz-grabbing;
  cursor: -webkit-grabbing;
  user-select: none;
}
.x6-node {
  cursor: move;
  /* stylelint-disable-next-line */
}
.x6-node.x6-node-immovable {
  cursor: default;
}
.x6-node * {
  -webkit-user-drag: none;
}
.x6-node .scalable * {
  vector-effect: non-scaling-stroke;
}
.x6-node [magnet='true'] {
  cursor: crosshair;
  transition: opacity 0.3s;
}
.x6-node [magnet='true']:hover {
  opacity: 0.7;
}
.x6-node foreignObject {
  display: block;
  overflow: visible;
  background-color: transparent;
}
.x6-node foreignObject > body {
  position: static;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: visible;
  background-color: transparent;
}
.x6-edge .source-marker,
.x6-edge .target-marker {
  vector-effect: non-scaling-stroke;
}
.x6-edge .connection {
  stroke-linejoin: round;
  fill: none;
}
.x6-edge .connection-wrap {
  cursor: move;
  opacity: 0;
  fill: none;
  stroke: #000;
  stroke-width: 15;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.x6-edge .connection-wrap:hover {
  opacity: 0.4;
  stroke-opacity: 0.4;
}
.x6-edge .vertices {
  cursor: move;
  opacity: 0;
}
.x6-edge .vertices .vertex {
  fill: #1abc9c;
}
.x6-edge .vertices .vertex :hover {
  fill: #34495e;
  stroke: none;
}
.x6-edge .vertices .vertex-remove {
  cursor: pointer;
  fill: #fff;
}
.x6-edge .vertices .vertex-remove-area {
  cursor: pointer;
  opacity: 0.1;
}
.x6-edge .vertices .vertex-group:hover .vertex-remove-area {
  opacity: 1;
}
.x6-edge .arrowheads {
  cursor: move;
  opacity: 0;
}
.x6-edge .arrowheads .arrowhead {
  fill: #1abc9c;
}
.x6-edge .arrowheads .arrowhead :hover {
  fill: #f39c12;
  stroke: none;
}
.x6-edge .tools {
  cursor: pointer;
  opacity: 0;
}
.x6-edge .tools .tool-options {
  display: none;
}
.x6-edge .tools .tool-remove circle {
  fill: #f00;
}
.x6-edge .tools .tool-remove path {
  fill: #fff;
}
.x6-edge:hover .vertices,
.x6-edge:hover .arrowheads,
.x6-edge:hover .tools {
  opacity: 1;
}
.x6-highlight-opacity {
  opacity: 0.3;
}
.x6-cell-tool-editor {
  position: relative;
  display: inline-block;
  min-height: 1em;
  margin: 0;
  padding: 0;
  line-height: 1;
  white-space: normal;
  text-align: center;
  vertical-align: top;
  overflow-wrap: normal;
  outline: none;
  transform-origin: 0 0;
  -webkit-user-drag: none;
}
.x6-edge-tool-editor {
  border: 1px solid #275fc5;
  border-radius: 2px;
}
`;
class Ft extends Zt {
  get options() {
    return this.graph.options;
  }
  get model() {
    return this.graph.model;
  }
  get view() {
    return this.graph.view;
  }
  constructor(t) {
    super(), this.graph = t, this.init();
  }
  init() {
  }
}
var TE = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
};
class ao extends Ft {
  init() {
    nr("core", ME);
  }
  dispose() {
    ir("core");
  }
}
TE([
  ao.dispose()
], ao.prototype, "dispose", null);
var NE = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
}, Yi;
(function(i) {
  function t(e) {
    const { grid: n, panning: s, mousewheel: r, embedding: o } = e, a = NE(
      e,
      ["grid", "panning", "mousewheel", "embedding"]
    ), l = e.container;
    if (l != null)
      a.width == null && (a.width = l.clientWidth), a.height == null && (a.height = l.clientHeight);
    else
      throw new Error("Ensure the container of the graph is specified and valid");
    const c = kt({}, i.defaults, a), u = { size: 10, visible: !1 };
    return typeof n == "number" ? c.grid = { size: n, visible: !1 } : typeof n == "boolean" ? c.grid = Object.assign(Object.assign({}, u), { visible: n }) : c.grid = Object.assign(Object.assign({}, u), n), [
      "panning",
      "mousewheel",
      "embedding"
    ].forEach((d) => {
      const f = e[d];
      typeof f == "boolean" ? c[d].enabled = f : c[d] = Object.assign(Object.assign({}, c[d]), f);
    }), c;
  }
  i.get = t;
})(Yi || (Yi = {}));
(function(i) {
  i.defaults = {
    x: 0,
    y: 0,
    scaling: {
      min: 0.01,
      max: 16
    },
    grid: {
      size: 10,
      visible: !1
    },
    background: !1,
    panning: {
      enabled: !1,
      eventTypes: ["leftMouseDown"]
    },
    mousewheel: {
      enabled: !1,
      factor: 1.2,
      zoomAtMousePosition: !0
    },
    highlighting: {
      default: {
        name: "stroke",
        args: {
          padding: 3
        }
      },
      nodeAvailable: {
        name: "className",
        args: {
          className: fe.prefix("available-node")
        }
      },
      magnetAvailable: {
        name: "className",
        args: {
          className: fe.prefix("available-magnet")
        }
      }
    },
    connecting: {
      snap: !1,
      allowLoop: !0,
      allowNode: !0,
      allowEdge: !1,
      allowPort: !0,
      allowBlank: !0,
      allowMulti: !0,
      highlight: !1,
      anchor: "center",
      edgeAnchor: "ratio",
      connectionPoint: "boundary",
      router: "normal",
      connector: "normal",
      validateConnection({ type: t, sourceView: e, targetView: n }) {
        return (t === "target" ? n : e) != null;
      },
      createEdge() {
        return new EE();
      }
    },
    translating: {
      restrict: !1
    },
    embedding: {
      enabled: !1,
      findParent: "bbox",
      frontOnly: !0,
      validate: () => !0
    },
    moveThreshold: 0,
    clickThreshold: 0,
    magnetThreshold: 0,
    preventDefaultDblClick: !0,
    preventDefaultMouseDown: !1,
    preventDefaultContextMenu: !0,
    preventDefaultBlankAction: !0,
    interacting: {
      edgeLabelMovable: !1
    },
    async: !0,
    virtual: !1,
    guard: () => !1
  };
})(Yi || (Yi = {}));
var IE = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
}, jE = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
};
class qo extends Ft {
  get elem() {
    return this.view.grid;
  }
  get grid() {
    return this.options.grid;
  }
  init() {
    this.startListening(), this.draw(this.grid);
  }
  startListening() {
    this.graph.on("scale", this.update, this), this.graph.on("translate", this.update, this);
  }
  stopListening() {
    this.graph.off("scale", this.update, this), this.graph.off("translate", this.update, this);
  }
  setVisible(t) {
    this.grid.visible !== t && (this.grid.visible = t, this.update());
  }
  getGridSize() {
    return this.grid.size;
  }
  setGridSize(t) {
    this.grid.size = Math.max(t, 1), this.update();
  }
  show() {
    this.setVisible(!0), this.update();
  }
  hide() {
    this.setVisible(!1), this.update();
  }
  clear() {
    this.elem.style.backgroundImage = "";
  }
  draw(t) {
    this.clear(), this.instance = null, Object.assign(this.grid, t), this.patterns = this.resolveGrid(t), this.update();
  }
  update(t = {}) {
    const e = this.grid.size;
    if (e <= 1 || !this.grid.visible)
      return this.clear();
    const n = this.graph.matrix(), s = this.getInstance(), r = Array.isArray(t) ? t : [t];
    this.patterns.forEach((l, c) => {
      const u = `pattern_${c}`, h = n.a || 1, d = n.d || 1, { update: f, markup: g } = l, p = jE(l, ["update", "markup"]), m = Object.assign(Object.assign(Object.assign({}, p), r[c]), {
        sx: h,
        sy: d,
        ox: n.e || 0,
        oy: n.f || 0,
        width: e * h,
        height: e * d
      });
      s.has(u) || s.add(u, G.create("pattern", { id: u, patternUnits: "userSpaceOnUse" }, G.createVectors(g)).node);
      const y = s.get(u);
      typeof f == "function" && f(y.childNodes[0], m);
      let v = m.ox % m.width;
      v < 0 && (v += m.width);
      let b = m.oy % m.height;
      b < 0 && (b += m.height), nt(y, {
        x: v,
        y: b,
        width: m.width,
        height: m.height
      });
    });
    const o = new XMLSerializer().serializeToString(s.root), a = `url(data:image/svg+xml;base64,${btoa(o)})`;
    this.elem.style.backgroundImage = a;
  }
  getInstance() {
    return this.instance || (this.instance = new Ze()), this.instance;
  }
  resolveGrid(t) {
    if (!t)
      return [];
    const e = t.type;
    if (e == null)
      return [
        Object.assign(Object.assign({}, Ze.presets.dot), t.args)
      ];
    const n = Ze.registry.get(e);
    if (n) {
      let s = t.args || [];
      return Array.isArray(s) || (s = [s]), Array.isArray(n) ? n.map((r, o) => Object.assign(Object.assign({}, r), s[o])) : [Object.assign(Object.assign({}, n), s[0])];
    }
    return Ze.registry.onNotFound(e);
  }
  dispose() {
    this.stopListening(), this.clear();
  }
}
IE([
  Ft.dispose()
], qo.prototype, "dispose", null);
class Oh extends Ft {
  get container() {
    return this.graph.view.container;
  }
  get viewport() {
    return this.graph.view.viewport;
  }
  get stage() {
    return this.graph.view.stage;
  }
  init() {
    this.resize();
  }
  /**
   * Returns the current transformation matrix of the graph.
   */
  getMatrix() {
    const t = this.viewport.getAttribute("transform");
    return t !== this.viewportTransformString && (this.viewportMatrix = this.viewport.getCTM(), this.viewportTransformString = t), Vt(this.viewportMatrix);
  }
  /**
   * Sets new transformation with the given `matrix`
   */
  setMatrix(t) {
    const e = Vt(t);
    e.a = Number.isFinite(e.a) ? e.a : 1, e.b = Number.isFinite(e.b) ? e.b : 0, e.c = Number.isFinite(e.c) ? e.c : 0, e.d = Number.isFinite(e.d) ? e.d : 1, e.e = Number.isFinite(e.e) ? e.e : 0, e.f = Number.isFinite(e.f) ? e.f : 0;
    const n = fi(e);
    this.viewport.setAttribute("transform", n), this.viewportMatrix = e, this.viewportTransformString = n;
  }
  resize(t, e) {
    let n = t === void 0 ? this.options.width : t, s = e === void 0 ? this.options.height : e;
    this.options.width = n, this.options.height = s, typeof n == "number" && (n = Math.round(n)), typeof s == "number" && (s = Math.round(s)), this.container.style.width = n == null ? "" : `${n}px`, this.container.style.height = s == null ? "" : `${s}px`;
    const r = this.getComputedSize();
    return this.graph.trigger("resize", Object.assign({}, r)), this;
  }
  getComputedSize() {
    let t = this.options.width, e = this.options.height;
    return Fa(t) || (t = this.container.clientWidth), Fa(e) || (e = this.container.clientHeight), { width: t, height: e };
  }
  getScale() {
    return M0(this.getMatrix());
  }
  scale(t, e = t, n = 0, s = 0) {
    if (t = this.clampScale(t), e = this.clampScale(e), n || s) {
      const l = this.getTranslation(), c = l.tx - n * (t - 1), u = l.ty - s * (e - 1);
      (c !== l.tx || u !== l.ty) && this.translate(c, u);
    }
    const r = this.getMatrix(), o = Number.isFinite(t) ? t : 1, a = Number.isFinite(e) ? e : 1;
    return r.a = o, r.d = a, this.setMatrix(r), this.graph.trigger("scale", { sx: o, sy: a, ox: n, oy: s }), this;
  }
  clampScale(t) {
    const e = this.graph.options.scaling;
    return he(t, e.min || 0.01, e.max || 16);
  }
  getZoom() {
    return this.getScale().sx;
  }
  zoom(t, e) {
    e = e || {};
    let n = t, s = t;
    const r = this.getScale(), o = this.getComputedSize();
    let a = o.width / 2, l = o.height / 2;
    if (e.absolute || (n += r.sx, s += r.sy), e.scaleGrid && (n = Math.round(n / e.scaleGrid) * e.scaleGrid, s = Math.round(s / e.scaleGrid) * e.scaleGrid), e.maxScale && (n = Math.min(e.maxScale, n), s = Math.min(e.maxScale, s)), e.minScale && (n = Math.max(e.minScale, n), s = Math.max(e.minScale, s)), e.center && (a = e.center.x, l = e.center.y), n = this.clampScale(n), s = this.clampScale(s), n = Number.isFinite(n) ? n : r.sx, s = Number.isFinite(s) ? s : r.sy, a || l) {
      const c = this.getTranslation(), u = r.sx === 0 ? 1 : r.sx, h = r.sy === 0 ? 1 : r.sy, d = a - (a - c.tx) * (n / u), f = l - (l - c.ty) * (s / h);
      (d !== c.tx || f !== c.ty) && this.translate(d, f);
    }
    return this.scale(n, s), this;
  }
  getRotation() {
    return T0(this.getMatrix());
  }
  rotate(t, e, n) {
    if (e == null || n == null) {
      const r = lt.getBBox(this.stage);
      e = r.width / 2, n = r.height / 2;
    }
    const s = this.getMatrix().translate(e, n).rotate(t).translate(-e, -n);
    return this.setMatrix(s), this;
  }
  getTranslation() {
    return N0(this.getMatrix());
  }
  translate(t, e) {
    const n = this.getMatrix();
    n.e = Number.isFinite(t) ? t : 0, n.f = Number.isFinite(e) ? e : 0, this.setMatrix(n);
    const s = this.getTranslation();
    return this.options.x = s.tx, this.options.y = s.ty, this.graph.trigger("translate", Object.assign({}, s)), this;
  }
  setOrigin(t, e) {
    return this.translate(t || 0, e || 0);
  }
  fitToContent(t, e, n, s) {
    if (typeof t == "object") {
      const b = t;
      t = b.gridWidth || 1, e = b.gridHeight || 1, n = b.padding || 0, s = b;
    } else
      t = t || 1, e = e || 1, n = n || 0, s == null && (s = {});
    const r = xn(n), o = s.border || 0, a = s.contentArea ? R.create(s.contentArea) : this.getContentArea(s);
    o > 0 && a.inflate(o);
    const l = this.getScale(), c = this.getTranslation(), u = l.sx, h = l.sy;
    a.x *= u, a.y *= h, a.width *= u, a.height *= h;
    let d = Math.max(Math.ceil((a.width + a.x) / t), 1) * t, f = Math.max(Math.ceil((a.height + a.y) / e), 1) * e, g = 0, p = 0;
    (s.allowNewOrigin === "negative" && a.x < 0 || s.allowNewOrigin === "positive" && a.x >= 0 || s.allowNewOrigin === "any") && (g = Math.ceil(-a.x / t) * t, g += r.left, d += g), (s.allowNewOrigin === "negative" && a.y < 0 || s.allowNewOrigin === "positive" && a.y >= 0 || s.allowNewOrigin === "any") && (p = Math.ceil(-a.y / e) * e, p += r.top, f += p), d += r.right, f += r.bottom, d = Math.max(d, s.minWidth || 0), f = Math.max(f, s.minHeight || 0), d = Math.min(d, s.maxWidth || Number.MAX_SAFE_INTEGER), f = Math.min(f, s.maxHeight || Number.MAX_SAFE_INTEGER);
    const m = this.getComputedSize(), y = d !== m.width || f !== m.height;
    return (g !== c.tx || p !== c.ty) && this.translate(g, p), y && this.resize(d, f), new R(-g / u, -p / h, d / u, f / h);
  }
  scaleContentToFit(t = {}) {
    this.scaleContentToFitImpl(t);
  }
  scaleContentToFitImpl(t = {}, e = !0) {
    let n, s;
    if (t.contentArea) {
      const y = t.contentArea;
      n = this.graph.localToGraph(y), s = x.create(y);
    } else
      n = this.getContentBBox(t), s = this.graph.graphToLocal(n);
    if (!n.width || !n.height)
      return;
    const r = xn(t.padding), o = t.minScale || 0, a = t.maxScale || Number.MAX_SAFE_INTEGER, l = t.minScaleX || o, c = t.maxScaleX || a, u = t.minScaleY || o, h = t.maxScaleY || a;
    let d;
    if (t.viewportArea)
      d = t.viewportArea;
    else {
      const y = this.getComputedSize(), v = this.getTranslation();
      d = {
        x: v.tx,
        y: v.ty,
        width: y.width,
        height: y.height
      };
    }
    d = R.create(d).moveAndExpand({
      x: r.left,
      y: r.top,
      width: -r.left - r.right,
      height: -r.top - r.bottom
    });
    const f = this.getScale();
    let g = d.width / n.width * f.sx, p = d.height / n.height * f.sy;
    t.preserveAspectRatio !== !1 && (g = p = Math.min(g, p));
    const m = t.scaleGrid;
    if (m && (g = m * Math.floor(g / m), p = m * Math.floor(p / m)), g = he(g, l, c), p = he(p, u, h), this.scale(g, p), e) {
      const y = this.options, v = d.x - s.x * g - y.x, b = d.y - s.y * p - y.y;
      this.translate(v, b);
    }
  }
  getContentArea(t = {}) {
    return t.useCellGeometry !== !1 ? this.model.getAllCellsBBox() || new R() : lt.getBBox(this.stage);
  }
  getContentBBox(t = {}) {
    return this.graph.localToGraph(this.getContentArea(t));
  }
  getGraphArea() {
    const t = R.fromSize(this.getComputedSize());
    return this.graph.graphToLocal(t);
  }
  zoomToRect(t, e = {}) {
    const n = R.create(t), s = this.graph;
    e.contentArea = n, e.viewportArea == null && (e.viewportArea = {
      x: s.options.x,
      y: s.options.y,
      width: this.options.width,
      height: this.options.height
    }), this.scaleContentToFitImpl(e, !1);
    const r = n.getCenter();
    return this.centerPoint(r.x, r.y), this;
  }
  zoomToFit(t = {}) {
    return this.zoomToRect(this.getContentArea(t), t);
  }
  centerPoint(t, e) {
    const n = this.getComputedSize(), s = this.getScale(), r = this.getTranslation(), o = n.width / 2, a = n.height / 2;
    t = typeof t == "number" ? t : o, e = typeof e == "number" ? e : a, t = o - t * s.sx, e = a - e * s.sy, (r.tx !== t || r.ty !== e) && this.translate(t, e);
  }
  centerContent(t) {
    const n = this.graph.getContentArea(t).getCenter();
    this.centerPoint(n.x, n.y);
  }
  centerCell(t) {
    return this.positionCell(t, "center");
  }
  positionPoint(t, e, n) {
    const s = this.getComputedSize();
    e = ve(e, Math.max(0, s.width)), e < 0 && (e = s.width + e), n = ve(n, Math.max(0, s.height)), n < 0 && (n = s.height + n);
    const r = this.getTranslation(), o = this.getScale(), a = e - t.x * o.sx, l = n - t.y * o.sy;
    (r.tx !== a || r.ty !== l) && this.translate(a, l);
  }
  positionRect(t, e) {
    const n = R.create(t);
    switch (e) {
      case "center":
        return this.positionPoint(n.getCenter(), "50%", "50%");
      case "top":
        return this.positionPoint(n.getTopCenter(), "50%", 0);
      case "top-right":
        return this.positionPoint(n.getTopRight(), "100%", 0);
      case "right":
        return this.positionPoint(n.getRightMiddle(), "100%", "50%");
      case "bottom-right":
        return this.positionPoint(n.getBottomRight(), "100%", "100%");
      case "bottom":
        return this.positionPoint(n.getBottomCenter(), "50%", "100%");
      case "bottom-left":
        return this.positionPoint(n.getBottomLeft(), 0, "100%");
      case "left":
        return this.positionPoint(n.getLeftMiddle(), 0, "50%");
      case "top-left":
        return this.positionPoint(n.getTopLeft(), 0, 0);
      default:
        return this;
    }
  }
  positionCell(t, e) {
    const n = t.getBBox();
    return this.positionRect(n, e);
  }
  positionContent(t, e) {
    const n = this.graph.getContentArea(e);
    return this.positionRect(n, t);
  }
}
var LE = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
};
class Uo extends Ft {
  get elem() {
    return this.view.background;
  }
  init() {
    this.startListening(), this.options.background && this.draw(this.options.background);
  }
  startListening() {
    this.graph.on("scale", this.update, this), this.graph.on("translate", this.update, this);
  }
  stopListening() {
    this.graph.off("scale", this.update, this), this.graph.off("translate", this.update, this);
  }
  updateBackgroundImage(t = {}) {
    let e = t.size || "auto auto", n = t.position || "center";
    const s = this.graph.transform.getScale(), r = this.graph.translate();
    if (typeof n == "object") {
      const o = r.tx + s.sx * (n.x || 0), a = r.ty + s.sy * (n.y || 0);
      n = `${o}px ${a}px`;
    }
    typeof e == "object" && (e = R.fromSize(e).scale(s.sx, s.sy), e = `${e.width}px ${e.height}px`), this.elem.style.backgroundSize = e, this.elem.style.backgroundPosition = n;
  }
  drawBackgroundImage(t, e = {}) {
    if (!(t instanceof HTMLImageElement)) {
      this.elem.style.backgroundImage = "";
      return;
    }
    const n = this.optionsCache;
    if (n && n.image !== e.image)
      return;
    let s;
    const r = e.opacity, o = e.size;
    let a = e.repeat || "no-repeat";
    const l = Hi.registry.get(a);
    if (typeof l == "function") {
      const u = e.quality || 1;
      t.width *= u, t.height *= u;
      const h = l(t, e);
      if (!(h instanceof HTMLCanvasElement))
        throw new Error("Background pattern must return an HTML Canvas instance");
      s = h.toDataURL("image/png"), e.repeat && a !== e.repeat ? a = e.repeat : a = "repeat", typeof o == "object" ? (o.width *= h.width / t.width, o.height *= h.height / t.height) : o === void 0 && (e.size = {
        width: h.width / u,
        height: h.height / u
      });
    } else
      s = t.src, o === void 0 && (e.size = {
        width: t.width,
        height: t.height
      });
    n != null && typeof e.size == "object" && e.image === n.image && e.repeat === n.repeat && e.quality === n.quality && (n.size = qr(e.size));
    const c = this.elem.style;
    c.backgroundImage = `url(${s})`, c.backgroundRepeat = a, c.opacity = r == null || r >= 1 ? "" : `${r}`, this.updateBackgroundImage(e);
  }
  updateBackgroundColor(t) {
    this.elem.style.backgroundColor = t || "";
  }
  updateBackgroundOptions(t) {
    this.graph.options.background = t;
  }
  update() {
    this.optionsCache && this.updateBackgroundImage(this.optionsCache);
  }
  draw(t) {
    const e = t || {};
    if (this.updateBackgroundOptions(t), this.updateBackgroundColor(e.color), e.image) {
      this.optionsCache = qr(e);
      const n = document.createElement("img");
      n.onload = () => this.drawBackgroundImage(n, t), n.setAttribute("crossorigin", "anonymous"), n.src = e.image;
    } else
      this.drawBackgroundImage(null), this.optionsCache = null;
  }
  clear() {
    this.draw();
  }
  dispose() {
    this.clear(), this.stopListening();
  }
}
LE([
  Ft.dispose()
], Uo.prototype, "dispose", null);
var kE = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
};
class Wo extends Ft {
  get widgetOptions() {
    return this.options.panning;
  }
  get pannable() {
    return this.widgetOptions && this.widgetOptions.enabled === !0;
  }
  init() {
    this.onRightMouseDown = this.onRightMouseDown.bind(this), this.onKeyDown = this.onKeyDown.bind(this), this.onKeyUp = this.onKeyUp.bind(this), this.startListening(), this.updateClassName();
  }
  startListening() {
    this.graph.on("blank:mousedown", this.onMouseDown, this), this.graph.on("node:unhandled:mousedown", this.onMouseDown, this), this.graph.on("edge:unhandled:mousedown", this.onMouseDown, this), Ut.on(this.graph.container, "mousedown", this.onRightMouseDown), Ut.on(document.body, {
      keydown: this.onKeyDown,
      keyup: this.onKeyUp
    }), this.mousewheelHandle = new Tu(this.graph.container, this.onMouseWheel.bind(this), this.allowMouseWheel.bind(this)), this.mousewheelHandle.enable();
  }
  stopListening() {
    this.graph.off("blank:mousedown", this.onMouseDown, this), this.graph.off("node:unhandled:mousedown", this.onMouseDown, this), this.graph.off("edge:unhandled:mousedown", this.onMouseDown, this), Ut.off(this.graph.container, "mousedown", this.onRightMouseDown), Ut.off(document.body, {
      keydown: this.onKeyDown,
      keyup: this.onKeyUp
    }), this.mousewheelHandle && this.mousewheelHandle.disable();
  }
  allowPanning(t, e) {
    return t.spaceKey = this.isSpaceKeyPressed, this.pannable && sn.isMatch(t, this.widgetOptions.modifiers, e);
  }
  startPanning(t) {
    const e = this.view.normalizeEvent(t);
    this.clientX = e.clientX, this.clientY = e.clientY, this.panning = !0, this.updateClassName(t), Ut.on(document.body, {
      "mousemove.panning touchmove.panning": this.pan.bind(this),
      "mouseup.panning touchend.panning": this.stopPanning.bind(this),
      "mouseleave.panning": this.stopPanning.bind(this)
    }), Ut.on(window, "mouseup.panning", this.stopPanning.bind(this));
  }
  pan(t) {
    const e = this.view.normalizeEvent(t), n = e.clientX - this.clientX, s = e.clientY - this.clientY;
    this.clientX = e.clientX, this.clientY = e.clientY, this.graph.translateBy(n, s);
  }
  // eslint-disable-next-line
  stopPanning(t) {
    this.panning = !1, this.updateClassName(t), Ut.off(document.body, ".panning"), Ut.off(window, ".panning");
  }
  updateClassName(t) {
    const e = this.widgetOptions.eventTypes;
    if ((e == null ? void 0 : e.length) === 1 && e.includes("mouseWheel"))
      return;
    const n = this.view.container, s = this.view.prefixClassName("graph-panning"), r = this.view.prefixClassName("graph-pannable"), o = this.graph.getPlugin("selection"), a = o && o.allowRubberband(t, !0), l = (e == null ? void 0 : e.includes("leftMouseDown")) && !a;
    this.allowPanning(t ?? {}, !0) || this.allowPanning(t ?? {}) && l ? this.panning ? (U(n, s), Jt(n, r)) : (Jt(n, s), U(n, r)) : this.panning || (Jt(n, s), Jt(n, r));
  }
  onMouseDown({ e: t }) {
    if (!this.allowBlankMouseDown(t))
      return;
    const e = this.graph.getPlugin("selection"), n = e && e.allowRubberband(t, !0);
    (this.allowPanning(t, !0) || this.allowPanning(t) && !n) && this.startPanning(t);
  }
  onRightMouseDown(t) {
    const e = this.widgetOptions.eventTypes;
    e != null && e.includes("rightMouseDown") && t.button === 2 && this.allowPanning(t, !0) && this.startPanning(t);
  }
  onMouseWheel(t, e, n) {
    this.graph.translateBy(-e, -n);
  }
  onKeyDown(t) {
    t.which === 32 && (this.isSpaceKeyPressed = !0), this.updateClassName(t);
  }
  onKeyUp(t) {
    t.which === 32 && (this.isSpaceKeyPressed = !1), this.updateClassName(t);
  }
  allowBlankMouseDown(t) {
    const e = this.widgetOptions.eventTypes;
    return (e == null ? void 0 : e.includes("leftMouseDown")) && t.button === 0 || (e == null ? void 0 : e.includes("mouseWheelDown")) && t.button === 1;
  }
  allowMouseWheel(t) {
    var e;
    return this.pannable && !t.ctrlKey && ((e = this.widgetOptions.eventTypes) === null || e === void 0 ? void 0 : e.includes("mouseWheel"));
  }
  autoPanning(t, e) {
    const s = this.graph.getGraphArea();
    let r = 0, o = 0;
    t <= s.left + 10 && (r = -10), e <= s.top + 10 && (o = -10), t >= s.right - 10 && (r = 10), e >= s.bottom - 10 && (o = 10), (r !== 0 || o !== 0) && this.graph.translateBy(-r, -o);
  }
  enablePanning() {
    this.pannable || (this.widgetOptions.enabled = !0, this.updateClassName());
  }
  disablePanning() {
    this.pannable && (this.widgetOptions.enabled = !1, this.updateClassName());
  }
  dispose() {
    this.stopListening();
  }
}
kE([
  Ft.dispose()
], Wo.prototype, "dispose", null);
var RE = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
};
class Xo extends Ft {
  constructor() {
    super(...arguments), this.cumulatedFactor = 1;
  }
  get widgetOptions() {
    return this.options.mousewheel;
  }
  init() {
    this.container = this.graph.container, this.target = this.widgetOptions.global ? document : this.container, this.mousewheelHandle = new Tu(this.target, this.onMouseWheel.bind(this), this.allowMouseWheel.bind(this)), this.widgetOptions.enabled && this.enable(!0);
  }
  get disabled() {
    return this.widgetOptions.enabled !== !0;
  }
  enable(t) {
    (this.disabled || t) && (this.widgetOptions.enabled = !0, this.mousewheelHandle.enable());
  }
  disable() {
    this.disabled || (this.widgetOptions.enabled = !1, this.mousewheelHandle.disable());
  }
  allowMouseWheel(t) {
    const e = this.widgetOptions.guard;
    return (e == null || e(t)) && sn.isMatch(t, this.widgetOptions.modifiers);
  }
  onMouseWheel(t) {
    const e = this.widgetOptions.guard;
    if ((e == null || e(t)) && sn.isMatch(t, this.widgetOptions.modifiers)) {
      const n = this.widgetOptions.factor || 1.2;
      this.currentScale == null && (this.startPos = { x: t.clientX, y: t.clientY }, this.currentScale = this.graph.transform.getScale().sx), t.deltaY < 0 ? (this.currentScale < 0.15 ? this.cumulatedFactor = (this.currentScale + 0.01) / this.currentScale : this.cumulatedFactor = Math.round(this.currentScale * n * 20) / 20 / this.currentScale, this.cumulatedFactor <= 1 && (this.cumulatedFactor = 1.05)) : (this.currentScale <= 0.15 ? this.cumulatedFactor = (this.currentScale - 0.01) / this.currentScale : this.cumulatedFactor = Math.round(this.currentScale * (1 / n) * 20) / 20 / this.currentScale, this.cumulatedFactor >= 1 && (this.cumulatedFactor = 0.95)), this.cumulatedFactor = Math.max(0.01, Math.min(this.currentScale * this.cumulatedFactor, 160) / this.currentScale);
      const r = this.currentScale;
      let o = this.graph.transform.clampScale(r * this.cumulatedFactor);
      const a = this.widgetOptions.minScale || Number.MIN_SAFE_INTEGER, l = this.widgetOptions.maxScale || Number.MAX_SAFE_INTEGER;
      if (o = he(o, a, l), o !== r)
        if (this.widgetOptions.zoomAtMousePosition) {
          const u = !!this.graph.getPlugin("scroller") ? this.graph.clientToLocal(this.startPos) : this.graph.clientToGraph(this.startPos);
          this.graph.zoom(o, {
            absolute: !0,
            center: u.clone()
          });
        } else
          this.graph.zoom(o, { absolute: !0 });
      this.currentScale = null, this.cumulatedFactor = 1;
    }
  }
  dispose() {
    this.disable();
  }
}
RE([
  Zt.dispose()
], Xo.prototype, "dispose", null);
var DE = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
};
class Ah extends Ft {
  init() {
    this.resetRenderArea = Lv(this.resetRenderArea, 200, {
      leading: !0
    }), this.resetRenderArea(), this.startListening();
  }
  startListening() {
    this.graph.on("translate", this.resetRenderArea, this), this.graph.on("scale", this.resetRenderArea, this), this.graph.on("resize", this.resetRenderArea, this);
  }
  stopListening() {
    this.graph.off("translate", this.resetRenderArea, this), this.graph.off("scale", this.resetRenderArea, this), this.graph.off("resize", this.resetRenderArea, this);
  }
  enableVirtualRender() {
    this.options.virtual = !0, this.resetRenderArea();
  }
  disableVirtualRender() {
    this.options.virtual = !1, this.graph.renderer.setRenderArea(void 0);
  }
  resetRenderArea() {
    if (this.options.virtual) {
      const t = this.graph.getGraphArea();
      this.graph.renderer.setRenderArea(t);
    }
  }
  dispose() {
    this.stopListening();
  }
}
DE([
  Ft.dispose()
], Ah.prototype, "dispose", null);
class _E {
  constructor() {
    this.isFlushing = !1, this.isFlushPending = !1, this.scheduleId = 0, this.queue = [], this.frameInterval = 33, this.initialTime = Date.now();
  }
  queueJob(t) {
    if (t.priority & Re.PRIOR)
      t.cb();
    else {
      const e = this.findInsertionIndex(t);
      e >= 0 && this.queue.splice(e, 0, t);
    }
  }
  queueFlush() {
    !this.isFlushing && !this.isFlushPending && (this.isFlushPending = !0, this.scheduleJob());
  }
  queueFlushSync() {
    !this.isFlushing && !this.isFlushPending && (this.isFlushPending = !0, this.flushJobsSync());
  }
  clearJobs() {
    this.queue.length = 0, this.isFlushing = !1, this.isFlushPending = !1, this.cancelScheduleJob();
  }
  flushJobs() {
    this.isFlushPending = !1, this.isFlushing = !0;
    const t = this.getCurrentTime();
    let e;
    for (; (e = this.queue.shift()) && (e.cb(), !(this.getCurrentTime() - t >= this.frameInterval)); )
      ;
    this.isFlushing = !1, this.queue.length && this.queueFlush();
  }
  flushJobsSync() {
    this.isFlushPending = !1, this.isFlushing = !0;
    let t;
    for (; t = this.queue.shift(); )
      try {
        t.cb();
      } catch (e) {
        console.log(e);
      }
    this.isFlushing = !1;
  }
  findInsertionIndex(t) {
    let e = 0, n = this.queue.length, s = n - 1;
    const r = t.priority;
    for (; e <= s; ) {
      const o = (s - e >> 1) + e;
      r <= this.queue[o].priority ? e = o + 1 : (n = o, s = o - 1);
    }
    return n;
  }
  scheduleJob() {
    "requestIdleCallback" in window ? (this.scheduleId && this.cancelScheduleJob(), this.scheduleId = window.requestIdleCallback(this.flushJobs.bind(this), {
      timeout: 100
    })) : (this.scheduleId && this.cancelScheduleJob(), this.scheduleId = window.setTimeout(this.flushJobs.bind(this)));
  }
  cancelScheduleJob() {
    "cancelIdleCallback" in window ? (this.scheduleId && window.cancelIdleCallback(this.scheduleId), this.scheduleId = 0) : (this.scheduleId && clearTimeout(this.scheduleId), this.scheduleId = 0);
  }
  getCurrentTime() {
    return typeof performance == "object" && typeof performance.now == "function" ? performance.now() : Date.now() - this.initialTime;
  }
}
var Re;
(function(i) {
  i[i.Update = 2] = "Update", i[i.RenderEdge = 4] = "RenderEdge", i[i.RenderNode = 8] = "RenderNode", i[i.PRIOR = 1048576] = "PRIOR";
})(Re || (Re = {}));
var $E = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
};
class _t extends Zt {
  get model() {
    return this.graph.model;
  }
  get container() {
    return this.graph.view.stage;
  }
  constructor(t) {
    super(), this.views = {}, this.willRemoveViews = {}, this.queue = new _E(), this.graph = t, this.init();
  }
  init() {
    this.startListening(), this.renderViews(this.model.getCells());
  }
  startListening() {
    this.model.on("reseted", this.onModelReseted, this), this.model.on("cell:added", this.onCellAdded, this), this.model.on("cell:removed", this.onCellRemoved, this), this.model.on("cell:change:zIndex", this.onCellZIndexChanged, this), this.model.on("cell:change:visible", this.onCellVisibleChanged, this);
  }
  stopListening() {
    this.model.off("reseted", this.onModelReseted, this), this.model.off("cell:added", this.onCellAdded, this), this.model.off("cell:removed", this.onCellRemoved, this), this.model.off("cell:change:zIndex", this.onCellZIndexChanged, this), this.model.off("cell:change:visible", this.onCellVisibleChanged, this);
  }
  onModelReseted({ options: t }) {
    this.queue.clearJobs(), this.removeZPivots(), this.resetViews();
    const e = this.model.getCells();
    this.renderViews(e, Object.assign(Object.assign({}, t), { queue: e.map((n) => n.id) }));
  }
  onCellAdded({ cell: t, options: e }) {
    this.renderViews([t], e);
  }
  onCellRemoved({ cell: t }) {
    this.removeViews([t]);
  }
  onCellZIndexChanged({ cell: t, options: e }) {
    const n = this.views[t.id];
    n && this.requestViewUpdate(n.view, _t.FLAG_INSERT, e, Re.Update, !0);
  }
  onCellVisibleChanged({ cell: t, current: e }) {
    this.toggleVisible(t, !!e);
  }
  requestViewUpdate(t, e, n = {}, s = Re.Update, r = !0) {
    const o = t.cell.id, a = this.views[o];
    if (!a)
      return;
    a.flag = e, a.options = n, (t.hasAction(e, ["translate", "resize", "rotate"]) || n.async === !1) && (s = Re.PRIOR, r = !1), this.queue.queueJob({
      id: o,
      priority: s,
      cb: () => {
        this.renderViewInArea(t, e, n);
        const u = n.queue;
        if (u) {
          const h = u.indexOf(t.cell.id);
          h >= 0 && u.splice(h, 1), u.length === 0 && this.graph.trigger("render:done");
        }
      }
    }), this.getEffectedEdges(t).forEach((u) => {
      this.requestViewUpdate(u.view, u.flag, n, s, !1);
    }), r && this.flush();
  }
  setRenderArea(t) {
    this.renderArea = t, this.flushWaitingViews();
  }
  isViewMounted(t) {
    if (t == null)
      return !1;
    const e = this.views[t.cell.id];
    return e ? e.state === _t.ViewState.MOUNTED : !1;
  }
  renderViews(t, e = {}) {
    t.sort((n, s) => n.isNode() && s.isEdge() ? -1 : 0), t.forEach((n) => {
      const s = n.id, r = this.views;
      let o = 0, a = r[s];
      if (a)
        o = _t.FLAG_INSERT;
      else {
        const l = this.createCellView(n);
        l && (l.graph = this.graph, o = _t.FLAG_INSERT | l.getBootstrapFlag(), a = {
          view: l,
          flag: o,
          options: e,
          state: _t.ViewState.CREATED
        }, this.views[s] = a);
      }
      a && this.requestViewUpdate(a.view, o, e, this.getRenderPriority(a.view), !1);
    }), this.flush();
  }
  renderViewInArea(t, e, n = {}) {
    const s = t.cell, r = s.id, o = this.views[r];
    if (!o)
      return;
    let a = 0;
    this.isUpdatable(t) ? (a = this.updateView(t, e, n), o.flag = a) : o.state === _t.ViewState.MOUNTED ? (a = this.updateView(t, e, n), o.flag = a) : o.state = _t.ViewState.WAITING, a && s.isEdge() && !(a & t.getFlag(["source", "target"])) && this.queue.queueJob({
      id: r,
      priority: Re.RenderEdge,
      cb: () => {
        this.updateView(t, e, n);
      }
    });
  }
  removeViews(t) {
    t.forEach((e) => {
      const n = e.id, s = this.views[n];
      s && (this.willRemoveViews[n] = s, delete this.views[n], this.queue.queueJob({
        id: n,
        priority: this.getRenderPriority(s.view),
        cb: () => {
          this.removeView(s.view);
        }
      }));
    }), this.flush();
  }
  flush() {
    this.graph.options.async ? this.queue.queueFlush() : this.queue.queueFlushSync();
  }
  flushWaitingViews() {
    Object.values(this.views).forEach((t) => {
      if (t && t.state === _t.ViewState.WAITING) {
        const { view: e, flag: n, options: s } = t;
        this.requestViewUpdate(e, n, s, this.getRenderPriority(e), !1);
      }
    }), this.flush();
  }
  updateView(t, e, n = {}) {
    if (t == null)
      return 0;
    if (Tt.isCellView(t)) {
      if (e & _t.FLAG_REMOVE)
        return this.removeView(t.cell), 0;
      e & _t.FLAG_INSERT && (this.insertView(t), e ^= _t.FLAG_INSERT);
    }
    return e ? t.confirmUpdate(e, n) : 0;
  }
  insertView(t) {
    const e = this.views[t.cell.id];
    if (e) {
      const n = t.cell.getZIndex(), s = this.addZPivot(n);
      this.container.insertBefore(t.container, s), t.cell.isVisible() || this.toggleVisible(t.cell, !1), e.state = _t.ViewState.MOUNTED, this.graph.trigger("view:mounted", { view: t });
    }
  }
  resetViews() {
    this.willRemoveViews = Object.assign(Object.assign({}, this.views), this.willRemoveViews), Object.values(this.willRemoveViews).forEach((t) => {
      t && this.removeView(t.view);
    }), this.views = {}, this.willRemoveViews = {};
  }
  removeView(t) {
    const e = t.cell, n = this.willRemoveViews[e.id];
    n && t && (n.view.remove(), delete this.willRemoveViews[e.id], this.graph.trigger("view:unmounted", { view: t }));
  }
  toggleVisible(t, e) {
    const n = this.model.getConnectedEdges(t);
    for (let r = 0, o = n.length; r < o; r += 1) {
      const a = n[r];
      if (e) {
        const l = a.getSourceCell(), c = a.getTargetCell();
        if (l && !l.isVisible() || c && !c.isVisible())
          continue;
        this.toggleVisible(a, !0);
      } else
        this.toggleVisible(a, !1);
    }
    const s = this.views[t.id];
    s && $t(s.view.container, {
      display: e ? "unset" : "none"
    });
  }
  addZPivot(t = 0) {
    this.zPivots == null && (this.zPivots = {});
    const e = this.zPivots;
    let n = e[t];
    if (n)
      return n;
    n = e[t] = document.createComment(`z-index:${t + 1}`);
    let s = -1 / 0;
    for (const o in e) {
      const a = +o;
      a < t && a > s && (s = a, t - 1);
    }
    const r = this.container;
    if (s !== -1 / 0) {
      const o = e[s];
      r.insertBefore(n, o.nextSibling);
    } else
      r.insertBefore(n, r.firstChild);
    return n;
  }
  removeZPivots() {
    this.zPivots && Object.values(this.zPivots).forEach((t) => {
      t && t.parentNode && t.parentNode.removeChild(t);
    }), this.zPivots = {};
  }
  createCellView(t) {
    const e = { graph: this.graph }, n = this.graph.options.createCellView;
    if (n) {
      const r = z(n, this.graph, t);
      if (r)
        return new r(t, e);
      if (r === null)
        return null;
    }
    const s = t.view;
    if (s != null && typeof s == "string") {
      const r = Tt.registry.get(s);
      return r ? new r(t, e) : Tt.registry.onNotFound(s);
    }
    return t.isNode() ? new Ee(t, e) : t.isEdge() ? new Ve(t, e) : null;
  }
  getEffectedEdges(t) {
    const e = [], n = t.cell, s = this.model.getConnectedEdges(n);
    for (let r = 0, o = s.length; r < o; r += 1) {
      const a = s[r], l = this.views[a.id];
      if (!l)
        continue;
      const c = l.view;
      if (!this.isViewMounted(c))
        continue;
      const u = ["update"];
      a.getTargetCell() === n && u.push("target"), a.getSourceCell() === n && u.push("source"), e.push({
        id: a.id,
        view: c,
        flag: c.getFlag(u)
      });
    }
    return e;
  }
  isUpdatable(t) {
    if (t.isNodeView())
      return this.renderArea ? this.renderArea.isIntersectWithRect(t.cell.getBBox()) : !0;
    if (t.isEdgeView()) {
      const e = t.cell, n = e.getSourceCell(), s = e.getTargetCell();
      if (this.renderArea && n && s)
        return this.renderArea.isIntersectWithRect(n.getBBox()) || this.renderArea.isIntersectWithRect(s.getBBox());
    }
    return !0;
  }
  getRenderPriority(t) {
    return t.cell.isNode() ? Re.RenderNode : Re.RenderEdge;
  }
  dispose() {
    this.stopListening(), Object.keys(this.views).forEach((t) => {
      this.views[t].view.dispose();
    }), this.views = {};
  }
}
$E([
  Zt.dispose()
], _t.prototype, "dispose", null);
(function(i) {
  i.FLAG_INSERT = 1 << 30, i.FLAG_REMOVE = 1 << 29, i.FLAG_RENDER = (1 << 26) - 1;
})(_t || (_t = {}));
(function(i) {
  (function(t) {
    t[t.CREATED = 0] = "CREATED", t[t.MOUNTED = 1] = "MOUNTED", t[t.WAITING = 2] = "WAITING";
  })(i.ViewState || (i.ViewState = {}));
})(_t || (_t = {}));
var BE = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
};
class Yo extends Ft {
  constructor() {
    super(...arguments), this.schedule = new _t(this.graph);
  }
  requestViewUpdate(t, e, n = {}) {
    this.schedule.requestViewUpdate(t, e, n);
  }
  isViewMounted(t) {
    return this.schedule.isViewMounted(t);
  }
  setRenderArea(t) {
    this.schedule.setRenderArea(t);
  }
  findViewByElem(t) {
    if (t == null)
      return null;
    const e = this.options.container, n = typeof t == "string" ? e.querySelector(t) : t instanceof Element ? t : t[0];
    if (n) {
      const s = this.graph.view.findAttr("data-cell-id", n);
      if (s) {
        const r = this.schedule.views;
        if (r[s])
          return r[s].view;
      }
    }
    return null;
  }
  findViewByCell(t) {
    if (t == null)
      return null;
    const e = K.isCell(t) ? t.id : t, n = this.schedule.views;
    return n[e] ? n[e].view : null;
  }
  findViewsFromPoint(t) {
    const e = { x: t.x, y: t.y };
    return this.model.getCells().map((n) => this.findViewByCell(n)).filter((n) => n != null ? lt.getBBox(n.container, {
      target: this.view.stage
    }).containsPoint(e) : !1);
  }
  findEdgeViewsFromPoint(t, e = 5) {
    return this.model.getEdges().map((n) => this.findViewByCell(n)).filter((n) => {
      if (n != null) {
        const s = n.getClosestPoint(t);
        if (s)
          return s.distance(t) <= e;
      }
      return !1;
    });
  }
  findViewsInArea(t, e = {}) {
    const n = R.create(t);
    return this.model.getCells().map((s) => this.findViewByCell(s)).filter((s) => {
      if (s) {
        if (e.nodeOnly && !s.isNodeView())
          return !1;
        const r = lt.getBBox(s.container, {
          target: this.view.stage
        });
        return r.width === 0 ? r.inflate(1, 0) : r.height === 0 && r.inflate(0, 1), e.strict ? n.containsRect(r) : n.isIntersectWithRect(r);
      }
      return !1;
    });
  }
  dispose() {
    this.schedule.dispose();
  }
}
BE([
  Ft.dispose()
], Yo.prototype, "dispose", null);
var bl = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
};
class Mh extends Ft {
  get cid() {
    return this.graph.view.cid;
  }
  get svg() {
    return this.view.svg;
  }
  get defs() {
    return this.view.defs;
  }
  isDefined(t) {
    return this.svg.getElementById(t) != null;
  }
  filter(t) {
    let e = t.id;
    const n = t.name;
    if (e || (e = `filter-${n}-${this.cid}-${Er(JSON.stringify(t))}`), !this.isDefined(e)) {
      const s = Un.registry.get(n);
      if (s == null)
        return Un.registry.onNotFound(n);
      const r = s(t.args || {}), o = Object.assign(Object.assign({ x: -1, y: -1, width: 3, height: 3, filterUnits: "objectBoundingBox" }, t.attrs), { id: e });
      G.create(mt.sanitize(r), o).appendTo(this.defs);
    }
    return e;
  }
  gradient(t) {
    let e = t.id;
    const n = t.type;
    if (e || (e = `gradient-${n}-${this.cid}-${Er(JSON.stringify(t))}`), !this.isDefined(e)) {
      const r = t.stops.map((l) => {
        const c = l.opacity != null && Number.isFinite(l.opacity) ? l.opacity : 1;
        return `<stop offset="${l.offset}" stop-color="${l.color}" stop-opacity="${c}"/>`;
      }), o = `<${n}>${r.join("")}</${n}>`, a = Object.assign({ id: e }, t.attrs);
      G.create(o, a).appendTo(this.defs);
    }
    return e;
  }
  marker(t) {
    const { id: e, refX: n, refY: s, markerUnits: r, markerOrient: o, tagName: a, children: l } = t, c = bl(t, ["id", "refX", "refY", "markerUnits", "markerOrient", "tagName", "children"]);
    let u = e;
    if (u || (u = `marker-${this.cid}-${Er(JSON.stringify(t))}`), !this.isDefined(u)) {
      a !== "path" && delete c.d;
      const h = G.create("marker", {
        refX: n,
        refY: s,
        id: u,
        overflow: "visible",
        orient: o ?? "auto",
        markerUnits: r || "userSpaceOnUse"
      }, l ? l.map((d) => {
        var { tagName: f } = d, g = bl(d, ["tagName"]);
        return G.create(`${f}` || "path", Vi(Object.assign(Object.assign({}, c), g)));
      }) : [G.create(a || "path", Vi(c))]);
      this.defs.appendChild(h.node);
    }
    return u;
  }
  remove(t) {
    const e = this.svg.getElementById(t);
    e && e.parentNode && e.parentNode.removeChild(e);
  }
}
class Th extends Ft {
  getClientMatrix() {
    return Vt(this.view.stage.getScreenCTM());
  }
  /**
   * Returns coordinates of the graph viewport, relative to the window.
   */
  getClientOffset() {
    const t = this.view.svg.getBoundingClientRect();
    return new x(t.left, t.top);
  }
  /**
   * Returns coordinates of the graph viewport, relative to the document.
   */
  getPageOffset() {
    return this.getClientOffset().translate(window.scrollX, window.scrollY);
  }
  snapToGrid(t, e) {
    return (typeof t == "number" ? this.clientToLocalPoint(t, e) : this.clientToLocalPoint(t.x, t.y)).snapToGrid(this.graph.getGridSize());
  }
  localToGraphPoint(t, e) {
    const n = x.create(t, e);
    return lt.transformPoint(n, this.graph.matrix());
  }
  localToClientPoint(t, e) {
    const n = x.create(t, e);
    return lt.transformPoint(n, this.getClientMatrix());
  }
  localToPagePoint(t, e) {
    return (typeof t == "number" ? this.localToGraphPoint(t, e) : this.localToGraphPoint(t)).translate(this.getPageOffset());
  }
  localToGraphRect(t, e, n, s) {
    const r = R.create(t, e, n, s);
    return lt.transformRectangle(r, this.graph.matrix());
  }
  localToClientRect(t, e, n, s) {
    const r = R.create(t, e, n, s);
    return lt.transformRectangle(r, this.getClientMatrix());
  }
  localToPageRect(t, e, n, s) {
    return (typeof t == "number" ? this.localToGraphRect(t, e, n, s) : this.localToGraphRect(t)).translate(this.getPageOffset());
  }
  graphToLocalPoint(t, e) {
    const n = x.create(t, e);
    return lt.transformPoint(n, this.graph.matrix().inverse());
  }
  clientToLocalPoint(t, e) {
    const n = x.create(t, e);
    return lt.transformPoint(n, this.getClientMatrix().inverse());
  }
  clientToGraphPoint(t, e) {
    const n = x.create(t, e);
    return lt.transformPoint(n, this.graph.matrix().multiply(this.getClientMatrix().inverse()));
  }
  pageToLocalPoint(t, e) {
    const s = x.create(t, e).diff(this.getPageOffset());
    return this.graphToLocalPoint(s);
  }
  graphToLocalRect(t, e, n, s) {
    const r = R.create(t, e, n, s);
    return lt.transformRectangle(r, this.graph.matrix().inverse());
  }
  clientToLocalRect(t, e, n, s) {
    const r = R.create(t, e, n, s);
    return lt.transformRectangle(r, this.getClientMatrix().inverse());
  }
  clientToGraphRect(t, e, n, s) {
    const r = R.create(t, e, n, s);
    return lt.transformRectangle(r, this.graph.matrix().multiply(this.getClientMatrix().inverse()));
  }
  pageToLocalRect(t, e, n, s) {
    const r = R.create(t, e, n, s), o = this.getPageOffset();
    return r.x -= o.x, r.y -= o.y, this.graphToLocalRect(r);
  }
}
var zE = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
};
class $s extends Ft {
  constructor() {
    super(...arguments), this.highlights = {};
  }
  init() {
    this.startListening();
  }
  startListening() {
    this.graph.on("cell:highlight", this.onCellHighlight, this), this.graph.on("cell:unhighlight", this.onCellUnhighlight, this);
  }
  stopListening() {
    this.graph.off("cell:highlight", this.onCellHighlight, this), this.graph.off("cell:unhighlight", this.onCellUnhighlight, this);
  }
  onCellHighlight({ view: t, magnet: e, options: n = {} }) {
    const s = this.resolveHighlighter(n);
    if (!s)
      return;
    const r = this.getHighlighterId(e, s);
    if (!this.highlights[r]) {
      const o = s.highlighter;
      o.highlight(t, e, Object.assign({}, s.args)), this.highlights[r] = {
        cellView: t,
        magnet: e,
        highlighter: o,
        args: s.args
      };
    }
  }
  onCellUnhighlight({ magnet: t, options: e = {} }) {
    const n = this.resolveHighlighter(e);
    if (!n)
      return;
    const s = this.getHighlighterId(t, n);
    this.unhighlight(s);
  }
  resolveHighlighter(t) {
    const e = this.options;
    let n = t.highlighter;
    if (n == null) {
      const a = t.type;
      n = a && e.highlighting[a] || e.highlighting.default;
    }
    if (n == null)
      return null;
    const s = typeof n == "string" ? {
      name: n
    } : n, r = s.name, o = Be.registry.get(r);
    return o == null ? Be.registry.onNotFound(r) : (Be.check(r, o), {
      name: r,
      highlighter: o,
      args: s.args || {}
    });
  }
  getHighlighterId(t, e) {
    return ko(t), e.name + t.id + JSON.stringify(e.args);
  }
  unhighlight(t) {
    const e = this.highlights[t];
    e && (e.highlighter.unhighlight(e.cellView, e.magnet, e.args), delete this.highlights[t]);
  }
  dispose() {
    Object.keys(this.highlights).forEach((t) => this.unhighlight(t)), this.stopListening();
  }
}
zE([
  $s.dispose()
], $s.prototype, "dispose", null);
var VE = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
};
class Nh extends Ft {
  getScroller() {
    const t = this.graph.getPlugin("scroller");
    return t && t.options.enabled ? t : null;
  }
  getContainer() {
    const t = this.getScroller();
    return t ? t.container.parentElement : this.graph.container.parentElement;
  }
  getSensorTarget() {
    const t = this.options.autoResize;
    if (t)
      return typeof t == "boolean" ? this.getContainer() : t;
  }
  init() {
    if (this.options.autoResize) {
      const e = this.getSensorTarget();
      e && Ts.bind(e, () => {
        const n = e.offsetWidth, s = e.offsetHeight;
        this.resize(n, s);
      });
    }
  }
  resize(t, e) {
    const n = this.getScroller();
    n ? n.resize(t, e) : this.graph.transform.resize(t, e);
  }
  dispose() {
    Ts.clear(this.graph.container);
  }
}
VE([
  Ft.dispose()
], Nh.prototype, "dispose", null);
var FE = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
};
let j = class Ih extends Nt {
  get container() {
    return this.options.container;
  }
  get [Symbol.toStringTag]() {
    return Ih.toStringTag;
  }
  constructor(t) {
    super(), this.installedPlugins = /* @__PURE__ */ new Set(), this.options = Yi.get(t), this.css = new ao(this), this.view = new Le(this), this.defs = new Mh(this), this.coord = new Th(this), this.transform = new Oh(this), this.highlight = new $s(this), this.grid = new qo(this), this.background = new Uo(this), this.options.model ? this.model = this.options.model : (this.model = new ie(), this.model.graph = this), this.renderer = new Yo(this), this.panning = new Wo(this), this.mousewheel = new Xo(this), this.virtualRender = new Ah(this), this.size = new Nh(this);
  }
  // #region model
  isNode(t) {
    return t.isNode();
  }
  isEdge(t) {
    return t.isEdge();
  }
  resetCells(t, e = {}) {
    return this.model.resetCells(t, e), this;
  }
  clearCells(t = {}) {
    return this.model.clear(t), this;
  }
  toJSON(t = {}) {
    return this.model.toJSON(t);
  }
  parseJSON(t) {
    return this.model.parseJSON(t);
  }
  fromJSON(t, e = {}) {
    return this.model.fromJSON(t, e), this;
  }
  getCellById(t) {
    return this.model.getCell(t);
  }
  addNode(t, e = {}) {
    return this.model.addNode(t, e);
  }
  addNodes(t, e = {}) {
    return this.addCell(t.map((n) => vt.isNode(n) ? n : this.createNode(n)), e);
  }
  createNode(t) {
    return this.model.createNode(t);
  }
  removeNode(t, e = {}) {
    return this.model.removeCell(t, e);
  }
  addEdge(t, e = {}) {
    return this.model.addEdge(t, e);
  }
  addEdges(t, e = {}) {
    return this.addCell(t.map((n) => St.isEdge(n) ? n : this.createEdge(n)), e);
  }
  removeEdge(t, e = {}) {
    return this.model.removeCell(t, e);
  }
  createEdge(t) {
    return this.model.createEdge(t);
  }
  addCell(t, e = {}) {
    return this.model.addCell(t, e), this;
  }
  removeCell(t, e = {}) {
    return this.model.removeCell(t, e);
  }
  removeCells(t, e = {}) {
    return this.model.removeCells(t, e);
  }
  removeConnectedEdges(t, e = {}) {
    return this.model.removeConnectedEdges(t, e);
  }
  disconnectConnectedEdges(t, e = {}) {
    return this.model.disconnectConnectedEdges(t, e), this;
  }
  hasCell(t) {
    return this.model.has(t);
  }
  getCells() {
    return this.model.getCells();
  }
  getCellCount() {
    return this.model.total();
  }
  /**
   * Returns all the nodes in the graph.
   */
  getNodes() {
    return this.model.getNodes();
  }
  /**
   * Returns all the edges in the graph.
   */
  getEdges() {
    return this.model.getEdges();
  }
  /**
   * Returns all outgoing edges for the node.
   */
  getOutgoingEdges(t) {
    return this.model.getOutgoingEdges(t);
  }
  /**
   * Returns all incoming edges for the node.
   */
  getIncomingEdges(t) {
    return this.model.getIncomingEdges(t);
  }
  /**
   * Returns edges connected with cell.
   */
  getConnectedEdges(t, e = {}) {
    return this.model.getConnectedEdges(t, e);
  }
  /**
   * Returns an array of all the roots of the graph.
   */
  getRootNodes() {
    return this.model.getRoots();
  }
  /**
   * Returns an array of all the leafs of the graph.
   */
  getLeafNodes() {
    return this.model.getLeafs();
  }
  /**
   * Returns `true` if the node is a root node, i.e.
   * there is no  edges coming to the node.
   */
  isRootNode(t) {
    return this.model.isRoot(t);
  }
  /**
   * Returns `true` if the node is a leaf node, i.e.
   * there is no edges going out from the node.
   */
  isLeafNode(t) {
    return this.model.isLeaf(t);
  }
  /**
   * Returns all the neighbors of node in the graph. Neighbors are all
   * the nodes connected to node via either incoming or outgoing edge.
   */
  getNeighbors(t, e = {}) {
    return this.model.getNeighbors(t, e);
  }
  /**
   * Returns `true` if `cell2` is a neighbor of `cell1`.
   */
  isNeighbor(t, e, n = {}) {
    return this.model.isNeighbor(t, e, n);
  }
  getSuccessors(t, e = {}) {
    return this.model.getSuccessors(t, e);
  }
  /**
   * Returns `true` if `cell2` is a successor of `cell1`.
   */
  isSuccessor(t, e, n = {}) {
    return this.model.isSuccessor(t, e, n);
  }
  getPredecessors(t, e = {}) {
    return this.model.getPredecessors(t, e);
  }
  /**
   * Returns `true` if `cell2` is a predecessor of `cell1`.
   */
  isPredecessor(t, e, n = {}) {
    return this.model.isPredecessor(t, e, n);
  }
  getCommonAncestor(...t) {
    return this.model.getCommonAncestor(...t);
  }
  /**
   * Returns an array of cells that result from finding nodes/edges that
   * are connected to any of the cells in the cells array. This function
   * loops over cells and if the current cell is a edge, it collects its
   * source/target nodes; if it is an node, it collects its incoming and
   * outgoing edges if both the edge terminal (source/target) are in the
   * cells array.
   */
  getSubGraph(t, e = {}) {
    return this.model.getSubGraph(t, e);
  }
  /**
   * Clones the whole subgraph (including all the connected links whose
   * source/target is in the subgraph). If `options.deep` is `true`, also
   * take into account all the embedded cells of all the subgraph cells.
   *
   * Returns a map of the form: { [original cell ID]: [clone] }.
   */
  cloneSubGraph(t, e = {}) {
    return this.model.cloneSubGraph(t, e);
  }
  cloneCells(t) {
    return this.model.cloneCells(t);
  }
  getNodesFromPoint(t, e) {
    return this.model.getNodesFromPoint(t, e);
  }
  getNodesInArea(t, e, n, s, r) {
    return this.model.getNodesInArea(t, e, n, s, r);
  }
  getNodesUnderNode(t, e = {}) {
    return this.model.getNodesUnderNode(t, e);
  }
  searchCell(t, e, n = {}) {
    return this.model.search(t, e, n), this;
  }
  /** *
   * Returns an array of IDs of nodes on the shortest
   * path between source and target.
   */
  getShortestPath(t, e, n = {}) {
    return this.model.getShortestPath(t, e, n);
  }
  /**
   * Returns the bounding box that surrounds all cells in the graph.
   */
  getAllCellsBBox() {
    return this.model.getAllCellsBBox();
  }
  /**
   * Returns the bounding box that surrounds all the given cells.
   */
  getCellsBBox(t, e = {}) {
    return this.model.getCellsBBox(t, e);
  }
  startBatch(t, e = {}) {
    this.model.startBatch(t, e);
  }
  stopBatch(t, e = {}) {
    this.model.stopBatch(t, e);
  }
  batchUpdate(t, e, n) {
    const s = typeof t == "string" ? t : "update", r = typeof t == "string" ? e : t, o = typeof e == "function" ? n : e;
    this.startBatch(s, o);
    const a = r();
    return this.stopBatch(s, o), a;
  }
  updateCellId(t, e) {
    return this.model.updateCellId(t, e);
  }
  // #endregion
  // #region view
  findView(t) {
    return K.isCell(t) ? this.findViewByCell(t) : this.findViewByElem(t);
  }
  findViews(t) {
    return R.isRectangleLike(t) ? this.findViewsInArea(t) : x.isPointLike(t) ? this.findViewsFromPoint(t) : [];
  }
  findViewByCell(t) {
    return this.renderer.findViewByCell(t);
  }
  findViewByElem(t) {
    return this.renderer.findViewByElem(t);
  }
  findViewsFromPoint(t, e) {
    const n = typeof t == "number" ? { x: t, y: e } : t;
    return this.renderer.findViewsFromPoint(n);
  }
  findViewsInArea(t, e, n, s, r) {
    const o = typeof t == "number" ? {
      x: t,
      y: e,
      width: n,
      height: s
    } : t, a = typeof t == "number" ? r : e;
    return this.renderer.findViewsInArea(o, a);
  }
  matrix(t) {
    return typeof t > "u" ? this.transform.getMatrix() : (this.transform.setMatrix(t), this);
  }
  resize(t, e) {
    const n = this.getPlugin("scroller");
    return n ? n.resize(t, e) : this.transform.resize(t, e), this;
  }
  scale(t, e = t, n = 0, s = 0) {
    return typeof t > "u" ? this.transform.getScale() : (this.transform.scale(t, e, n, s), this);
  }
  zoom(t, e) {
    const n = this.getPlugin("scroller");
    if (n) {
      if (typeof t > "u")
        return n.zoom();
      n.zoom(t, e);
    } else {
      if (typeof t > "u")
        return this.transform.getZoom();
      this.transform.zoom(t, e);
    }
    return this;
  }
  zoomTo(t, e = {}) {
    const n = this.getPlugin("scroller");
    return n ? n.zoom(t, Object.assign(Object.assign({}, e), { absolute: !0 })) : this.transform.zoom(t, Object.assign(Object.assign({}, e), { absolute: !0 })), this;
  }
  zoomToRect(t, e = {}) {
    const n = this.getPlugin("scroller");
    return n ? n.zoomToRect(t, e) : this.transform.zoomToRect(t, e), this;
  }
  zoomToFit(t = {}) {
    const e = this.getPlugin("scroller");
    return e ? e.zoomToFit(t) : this.transform.zoomToFit(t), this;
  }
  rotate(t, e, n) {
    return typeof t > "u" ? this.transform.getRotation() : (this.transform.rotate(t, e, n), this);
  }
  translate(t, e) {
    return typeof t > "u" ? this.transform.getTranslation() : (this.transform.translate(t, e), this);
  }
  translateBy(t, e) {
    const n = this.translate(), s = n.tx + t, r = n.ty + e;
    return this.translate(s, r);
  }
  getGraphArea() {
    return this.transform.getGraphArea();
  }
  getContentArea(t = {}) {
    return this.transform.getContentArea(t);
  }
  getContentBBox(t = {}) {
    return this.transform.getContentBBox(t);
  }
  fitToContent(t, e, n, s) {
    return this.transform.fitToContent(t, e, n, s);
  }
  scaleContentToFit(t = {}) {
    return this.transform.scaleContentToFit(t), this;
  }
  /**
   * Position the center of graph to the center of the viewport.
   */
  center(t) {
    return this.centerPoint(t);
  }
  centerPoint(t, e, n) {
    const s = this.getPlugin("scroller");
    return s ? s.centerPoint(t, e, n) : this.transform.centerPoint(t, e), this;
  }
  centerContent(t) {
    const e = this.getPlugin("scroller");
    return e ? e.centerContent(t) : this.transform.centerContent(t), this;
  }
  centerCell(t, e) {
    const n = this.getPlugin("scroller");
    return n ? n.centerCell(t, e) : this.transform.centerCell(t), this;
  }
  positionPoint(t, e, n, s = {}) {
    const r = this.getPlugin("scroller");
    return r ? r.positionPoint(t, e, n, s) : this.transform.positionPoint(t, e, n), this;
  }
  positionRect(t, e, n) {
    const s = this.getPlugin("scroller");
    return s ? s.positionRect(t, e, n) : this.transform.positionRect(t, e), this;
  }
  positionCell(t, e, n) {
    const s = this.getPlugin("scroller");
    return s ? s.positionCell(t, e, n) : this.transform.positionCell(t, e), this;
  }
  positionContent(t, e) {
    const n = this.getPlugin("scroller");
    return n ? n.positionContent(t, e) : this.transform.positionContent(t, e), this;
  }
  snapToGrid(t, e) {
    return this.coord.snapToGrid(t, e);
  }
  pageToLocal(t, e, n, s) {
    return R.isRectangleLike(t) ? this.coord.pageToLocalRect(t) : typeof t == "number" && typeof e == "number" && typeof n == "number" && typeof s == "number" ? this.coord.pageToLocalRect(t, e, n, s) : this.coord.pageToLocalPoint(t, e);
  }
  localToPage(t, e, n, s) {
    return R.isRectangleLike(t) ? this.coord.localToPageRect(t) : typeof t == "number" && typeof e == "number" && typeof n == "number" && typeof s == "number" ? this.coord.localToPageRect(t, e, n, s) : this.coord.localToPagePoint(t, e);
  }
  clientToLocal(t, e, n, s) {
    return R.isRectangleLike(t) ? this.coord.clientToLocalRect(t) : typeof t == "number" && typeof e == "number" && typeof n == "number" && typeof s == "number" ? this.coord.clientToLocalRect(t, e, n, s) : this.coord.clientToLocalPoint(t, e);
  }
  localToClient(t, e, n, s) {
    return R.isRectangleLike(t) ? this.coord.localToClientRect(t) : typeof t == "number" && typeof e == "number" && typeof n == "number" && typeof s == "number" ? this.coord.localToClientRect(t, e, n, s) : this.coord.localToClientPoint(t, e);
  }
  localToGraph(t, e, n, s) {
    return R.isRectangleLike(t) ? this.coord.localToGraphRect(t) : typeof t == "number" && typeof e == "number" && typeof n == "number" && typeof s == "number" ? this.coord.localToGraphRect(t, e, n, s) : this.coord.localToGraphPoint(t, e);
  }
  graphToLocal(t, e, n, s) {
    return R.isRectangleLike(t) ? this.coord.graphToLocalRect(t) : typeof t == "number" && typeof e == "number" && typeof n == "number" && typeof s == "number" ? this.coord.graphToLocalRect(t, e, n, s) : this.coord.graphToLocalPoint(t, e);
  }
  clientToGraph(t, e, n, s) {
    return R.isRectangleLike(t) ? this.coord.clientToGraphRect(t) : typeof t == "number" && typeof e == "number" && typeof n == "number" && typeof s == "number" ? this.coord.clientToGraphRect(t, e, n, s) : this.coord.clientToGraphPoint(t, e);
  }
  // #endregion
  // #region defs
  defineFilter(t) {
    return this.defs.filter(t);
  }
  defineGradient(t) {
    return this.defs.gradient(t);
  }
  defineMarker(t) {
    return this.defs.marker(t);
  }
  // #endregion
  // #region grid
  getGridSize() {
    return this.grid.getGridSize();
  }
  setGridSize(t) {
    return this.grid.setGridSize(t), this;
  }
  showGrid() {
    return this.grid.show(), this;
  }
  hideGrid() {
    return this.grid.hide(), this;
  }
  clearGrid() {
    return this.grid.clear(), this;
  }
  drawGrid(t) {
    return this.grid.draw(t), this;
  }
  // #endregion
  // #region background
  updateBackground() {
    return this.background.update(), this;
  }
  drawBackground(t, e) {
    const n = this.getPlugin("scroller");
    return n != null && (this.options.background == null || !e) ? n.drawBackground(t, e) : this.background.draw(t), this;
  }
  clearBackground(t) {
    const e = this.getPlugin("scroller");
    return e != null && (this.options.background == null || !t) ? e.clearBackground(t) : this.background.clear(), this;
  }
  // #endregion
  // #region virtual-render
  enableVirtualRender() {
    return this.virtualRender.enableVirtualRender(), this;
  }
  disableVirtualRender() {
    return this.virtualRender.disableVirtualRender(), this;
  }
  // #endregion
  // #region mousewheel
  isMouseWheelEnabled() {
    return !this.mousewheel.disabled;
  }
  enableMouseWheel() {
    return this.mousewheel.enable(), this;
  }
  disableMouseWheel() {
    return this.mousewheel.disable(), this;
  }
  toggleMouseWheel(t) {
    return t == null ? this.isMouseWheelEnabled() ? this.disableMouseWheel() : this.enableMouseWheel() : t ? this.enableMouseWheel() : this.disableMouseWheel(), this;
  }
  // #endregion
  // #region panning
  isPannable() {
    const t = this.getPlugin("scroller");
    return t ? t.isPannable() : this.panning.pannable;
  }
  enablePanning() {
    const t = this.getPlugin("scroller");
    return t ? t.enablePanning() : this.panning.enablePanning(), this;
  }
  disablePanning() {
    const t = this.getPlugin("scroller");
    return t ? t.disablePanning() : this.panning.disablePanning(), this;
  }
  togglePanning(t) {
    return t == null ? this.isPannable() ? this.disablePanning() : this.enablePanning() : t !== this.isPannable() && (t ? this.enablePanning() : this.disablePanning()), this;
  }
  // #endregion
  // #region plugin
  use(t, ...e) {
    return this.installedPlugins.has(t) || (this.installedPlugins.add(t), t.init(this, ...e)), this;
  }
  getPlugin(t) {
    return Array.from(this.installedPlugins).find((e) => e.name === t);
  }
  getPlugins(t) {
    return Array.from(this.installedPlugins).filter((e) => t.includes(e.name));
  }
  enablePlugins(t) {
    let e = t;
    Array.isArray(e) || (e = [e]);
    const n = this.getPlugins(e);
    return n == null || n.forEach((s) => {
      var r;
      (r = s == null ? void 0 : s.enable) === null || r === void 0 || r.call(s);
    }), this;
  }
  disablePlugins(t) {
    let e = t;
    Array.isArray(e) || (e = [e]);
    const n = this.getPlugins(e);
    return n == null || n.forEach((s) => {
      var r;
      (r = s == null ? void 0 : s.disable) === null || r === void 0 || r.call(s);
    }), this;
  }
  isPluginEnabled(t) {
    var e;
    const n = this.getPlugin(t);
    return (e = n == null ? void 0 : n.isEnabled) === null || e === void 0 ? void 0 : e.call(n);
  }
  disposePlugins(t) {
    let e = t;
    Array.isArray(e) || (e = [e]);
    const n = this.getPlugins(e);
    return n == null || n.forEach((s) => {
      s.dispose(), this.installedPlugins.delete(s);
    }), this;
  }
  // #endregion
  // #region dispose
  dispose(t = !0) {
    t && this.model.dispose(), this.css.dispose(), this.defs.dispose(), this.grid.dispose(), this.coord.dispose(), this.transform.dispose(), this.highlight.dispose(), this.background.dispose(), this.mousewheel.dispose(), this.panning.dispose(), this.view.dispose(), this.renderer.dispose(), this.installedPlugins.forEach((e) => {
      e.dispose();
    });
  }
};
FE([
  Nt.dispose()
], j.prototype, "dispose", null);
(function(i) {
  i.View = Le, i.Renderer = Yo, i.MouseWheel = Xo, i.DefsManager = Mh, i.GridManager = qo, i.CoordManager = Th, i.TransformManager = Oh, i.HighlightManager = $s, i.BackgroundManager = Uo, i.PanningManager = Wo;
})(j || (j = {}));
(function(i) {
  i.toStringTag = `X6.${i.name}`;
  function t(e) {
    if (e == null)
      return !1;
    if (e instanceof i)
      return !0;
    const n = e[Symbol.toStringTag];
    return n == null || n === i.toStringTag;
  }
  i.isGraph = t;
})(j || (j = {}));
(function(i) {
  function t(e, n) {
    const s = e instanceof HTMLElement ? new i({ container: e }) : new i(e);
    return n != null && s.fromJSON(n), s;
  }
  i.render = t;
})(j || (j = {}));
(function(i) {
  i.registerNode = vt.registry.register, i.registerEdge = St.registry.register, i.registerView = Tt.registry.register, i.registerAttr = je.registry.register, i.registerGrid = Ze.registry.register, i.registerFilter = Un.registry.register, i.registerNodeTool = Yn.registry.register, i.registerEdgeTool = Jn.registry.register, i.registerBackground = Hi.registry.register, i.registerHighlighter = Be.registry.register, i.registerPortLayout = bn.registry.register, i.registerPortLabelLayout = Wn.registry.register, i.registerMarker = on.registry.register, i.registerRouter = Qe.registry.register, i.registerConnector = yn.registry.register, i.registerAnchor = Kn.registry.register, i.registerEdgeAnchor = Zn.registry.register, i.registerConnectionPoint = Qn.registry.register;
})(j || (j = {}));
(function(i) {
  i.unregisterNode = vt.registry.unregister, i.unregisterEdge = St.registry.unregister, i.unregisterView = Tt.registry.unregister, i.unregisterAttr = je.registry.unregister, i.unregisterGrid = Ze.registry.unregister, i.unregisterFilter = Un.registry.unregister, i.unregisterNodeTool = Yn.registry.unregister, i.unregisterEdgeTool = Jn.registry.unregister, i.unregisterBackground = Hi.registry.unregister, i.unregisterHighlighter = Be.registry.unregister, i.unregisterPortLayout = bn.registry.unregister, i.unregisterPortLabelLayout = Wn.registry.unregister, i.unregisterMarker = on.registry.unregister, i.unregisterRouter = Qe.registry.unregister, i.unregisterConnector = yn.registry.unregister, i.unregisterAnchor = Kn.registry.unregister, i.unregisterEdgeAnchor = Zn.registry.unregister, i.unregisterConnectionPoint = Qn.registry.unregister;
})(j || (j = {}));
var GE = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
}, HE = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
};
class ni extends vt {
}
(function(i) {
  class t extends Ee {
    init() {
      super.init(), this.cell.on("change:*", this.onCellChangeAny, this);
    }
    onCellChangeAny({ key: n }) {
      const s = i.shapeMaps[this.cell.shape];
      if (s) {
        const { effect: r } = s;
        (!r || r.includes(n)) && this.renderHTMLComponent();
      }
    }
    confirmUpdate(n) {
      const s = super.confirmUpdate(n);
      return this.handleAction(s, t.action, () => this.renderHTMLComponent());
    }
    renderHTMLComponent() {
      const n = this.selectors && this.selectors.foContent;
      if (n) {
        ns(n);
        const s = i.shapeMaps[this.cell.shape];
        if (!s)
          return;
        let { html: r } = s;
        typeof r == "function" && (r = r(this.cell)), r && (typeof r == "string" ? n.innerHTML = r : Mn(n, r));
      }
    }
    dispose() {
      this.cell.off("change:*", this.onCellChangeAny, this);
    }
  }
  GE([
    t.dispose()
  ], t.prototype, "dispose", null), i.View = t, function(e) {
    e.action = "html", e.config({
      bootstrap: [e.action],
      actions: {
        html: e.action
      }
    }), Ee.registry.register("html-view", e, !0);
  }(t = i.View || (i.View = {}));
})(ni || (ni = {}));
(function(i) {
  i.config({
    view: "html-view",
    markup: [
      {
        tagName: "rect",
        selector: "body"
      },
      Object.assign({}, mt.getForeignObjectMarkup()),
      {
        tagName: "text",
        selector: "label"
      }
    ],
    attrs: {
      body: {
        fill: "none",
        stroke: "none",
        refWidth: "100%",
        refHeight: "100%"
      },
      fo: {
        refWidth: "100%",
        refHeight: "100%"
      }
    }
  }), vt.registry.register("html", i, !0);
})(ni || (ni = {}));
(function(i) {
  i.shapeMaps = {};
  function t(e) {
    const { shape: n, html: s, effect: r, inherit: o } = e, a = HE(e, ["shape", "html", "effect", "inherit"]);
    if (!n)
      throw new Error("should specify shape in config");
    i.shapeMaps[n] = {
      html: s,
      effect: r
    }, j.registerNode(n, Object.assign({ inherit: o || "html" }, a), !0);
  }
  i.register = t;
})(ni || (ni = {}));
var qE = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
};
class jh extends rt {
  get graph() {
    return this.options.graph;
  }
  get boxClassName() {
    return this.prefixClassName(ee.classNames.box);
  }
  get $boxes() {
    return Qv(this.container, this.boxClassName);
  }
  get handleOptions() {
    return this.options;
  }
  constructor(t) {
    super(), this.options = t, this.options.model && (this.options.collection = this.options.model.collection), this.options.collection ? this.collection = this.options.collection : (this.collection = new _s([], {
      comparator: ee.depthComparator
    }), this.options.collection = this.collection), this.boxCount = 0, this.createContainer(), this.startListening();
  }
  startListening() {
    const t = this.graph, e = this.collection;
    this.delegateEvents({
      [`mousedown .${this.boxClassName}`]: "onSelectionBoxMouseDown",
      [`touchstart .${this.boxClassName}`]: "onSelectionBoxMouseDown"
    }, !0), t.on("scale", this.onGraphTransformed, this), t.on("translate", this.onGraphTransformed, this), t.model.on("updated", this.onModelUpdated, this), e.on("added", this.onCellAdded, this), e.on("removed", this.onCellRemoved, this), e.on("reseted", this.onReseted, this), e.on("updated", this.onCollectionUpdated, this), e.on("node:change:position", this.onNodePositionChanged, this), e.on("cell:changed", this.onCellChanged, this);
  }
  stopListening() {
    const t = this.graph, e = this.collection;
    this.undelegateEvents(), t.off("scale", this.onGraphTransformed, this), t.off("translate", this.onGraphTransformed, this), t.model.off("updated", this.onModelUpdated, this), e.off("added", this.onCellAdded, this), e.off("removed", this.onCellRemoved, this), e.off("reseted", this.onReseted, this), e.off("updated", this.onCollectionUpdated, this), e.off("node:change:position", this.onNodePositionChanged, this), e.off("cell:changed", this.onCellChanged, this);
  }
  onRemove() {
    this.stopListening();
  }
  onGraphTransformed() {
    this.updateSelectionBoxes();
  }
  onCellChanged() {
    this.updateSelectionBoxes();
  }
  onNodePositionChanged({ node: t, options: e }) {
    const { showNodeSelectionBox: n, pointerEvents: s } = this.options, { ui: r, selection: o, translateBy: a, snapped: l } = e, c = (n !== !0 || s && this.getPointerEventsValue(s) === "none") && !this.translating && !o, u = r && a && t.id === a;
    if (c && (u || l)) {
      this.translating = !0;
      const h = t.position(), d = t.previous("position"), f = h.x - d.x, g = h.y - d.y;
      (f !== 0 || g !== 0) && this.translateSelectedNodes(f, g, t, e), this.translating = !1;
    }
  }
  onModelUpdated({ removed: t }) {
    t && t.length && this.unselect(t);
  }
  isEmpty() {
    return this.length <= 0;
  }
  isSelected(t) {
    return this.collection.has(t);
  }
  get length() {
    return this.collection.length;
  }
  get cells() {
    return this.collection.toArray();
  }
  select(t, e = {}) {
    e.dryrun = !0;
    const n = this.filter(Array.isArray(t) ? t : [t]);
    return this.collection.add(n, e), this;
  }
  unselect(t, e = {}) {
    return e.dryrun = !0, this.collection.remove(Array.isArray(t) ? t : [t], e), this;
  }
  reset(t, e = {}) {
    if (t) {
      if (e.batch) {
        const c = this.filter(Array.isArray(t) ? t : [t]);
        return this.collection.reset(c, Object.assign(Object.assign({}, e), { ui: !0 })), this;
      }
      const n = this.cells, s = this.filter(Array.isArray(t) ? t : [t]), r = {}, o = {};
      n.forEach((c) => r[c.id] = c), s.forEach((c) => o[c.id] = c);
      const a = [], l = [];
      return s.forEach((c) => {
        r[c.id] || a.push(c);
      }), n.forEach((c) => {
        o[c.id] || l.push(c);
      }), l.length && this.unselect(l, Object.assign(Object.assign({}, e), { ui: !0 })), a.length && this.select(a, Object.assign(Object.assign({}, e), { ui: !0 })), l.length === 0 && a.length === 0 && this.updateContainer(), this;
    }
    return this.clean(e);
  }
  clean(t = {}) {
    return this.length && (t.batch === !1 ? this.unselect(this.cells, t) : this.collection.reset([], Object.assign(Object.assign({}, t), { ui: !0 }))), this;
  }
  setFilter(t) {
    this.options.filter = t;
  }
  setContent(t) {
    this.options.content = t;
  }
  startSelecting(t) {
    t = this.normalizeEvent(t), this.clean();
    let e, n;
    const s = this.graph.container;
    if (t.offsetX != null && t.offsetY != null && s.contains(t.target))
      e = t.offsetX, n = t.offsetY;
    else {
      const r = to(s), o = s.scrollLeft, a = s.scrollTop;
      e = t.clientX - r.left + window.pageXOffset + o, n = t.clientY - r.top + window.pageYOffset + a;
    }
    $t(this.container, {
      top: n,
      left: e,
      width: 1,
      height: 1
    }), this.setEventData(t, {
      action: "selecting",
      clientX: t.clientX,
      clientY: t.clientY,
      offsetX: e,
      offsetY: n,
      scrollerX: 0,
      scrollerY: 0,
      moving: !1
    }), this.delegateDocumentEvents(ee.documentEvents, t.data);
  }
  filter(t) {
    const e = this.options.filter;
    return t.filter((n) => Array.isArray(e) ? e.some((s) => typeof s == "string" ? n.shape === s : n.id === s.id) : typeof e == "function" ? z(e, this.graph, n) : !0);
  }
  stopSelecting(t) {
    const e = this.graph, n = this.getEventData(t);
    switch (n.action) {
      case "selecting": {
        let r = k0(this.container), o = R0(this.container);
        const a = to(this.container), l = e.pageToLocal(a.left, a.top), c = e.transform.getScale();
        r /= c.sx, o /= c.sy;
        const u = new R(l.x, l.y, r, o), h = this.getCellViewsInArea(u).map((d) => d.cell);
        this.reset(h, { batch: !0 }), this.hideRubberband();
        break;
      }
      case "translating": {
        const r = e.snapToGrid(t.clientX, t.clientY);
        if (!this.options.following) {
          const o = n;
          this.updateSelectedNodesPosition({
            dx: o.clientX - o.originX,
            dy: o.clientY - o.originY
          });
        }
        this.graph.model.stopBatch("move-selection"), this.notifyBoxEvent("box:mouseup", t, r.x, r.y);
        break;
      }
      default: {
        this.clean();
        break;
      }
    }
  }
  onMouseUp(t) {
    this.getEventData(t).action && (this.stopSelecting(t), this.undelegateDocumentEvents());
  }
  onSelectionBoxMouseDown(t) {
    this.options.following || t.stopPropagation();
    const e = this.normalizeEvent(t);
    this.options.movable && this.startTranslating(e);
    const n = this.getCellViewFromElem(e.target);
    this.setEventData(e, { activeView: n });
    const s = this.graph.snapToGrid(e.clientX, e.clientY);
    this.notifyBoxEvent("box:mousedown", e, s.x, s.y), this.delegateDocumentEvents(ee.documentEvents, e.data);
  }
  startTranslating(t) {
    this.graph.model.startBatch("move-selection");
    const e = this.graph.snapToGrid(t.clientX, t.clientY);
    this.setEventData(t, {
      action: "translating",
      clientX: e.x,
      clientY: e.y,
      originX: e.x,
      originY: e.y
    });
  }
  getRestrictArea() {
    const t = this.graph.options.translating.restrict, e = typeof t == "function" ? z(t, this.graph, null) : t;
    return typeof e == "number" ? this.graph.transform.getGraphArea().inflate(e) : e === !0 ? this.graph.transform.getGraphArea() : e || null;
  }
  getSelectionOffset(t, e) {
    let n = t.x - e.clientX, s = t.y - e.clientY;
    const r = this.getRestrictArea();
    if (r) {
      const o = this.collection.toArray(), a = K.getCellsBBox(o, { deep: !0 }) || R.create(), l = r.x - a.x, c = r.y - a.y, u = r.x + r.width - (a.x + a.width), h = r.y + r.height - (a.y + a.height);
      if (n < l && (n = l), s < c && (s = c), u < n && (n = u), h < s && (s = h), !this.options.following) {
        const d = t.x - e.originX, f = t.y - e.originY;
        n = d <= l || d >= u ? 0 : n, s = f <= c || f >= h ? 0 : s;
      }
    }
    return {
      dx: n,
      dy: s
    };
  }
  updateElementPosition(t, e, n) {
    const s = $t(t, "left"), r = $t(t, "top"), o = s ? parseFloat(s) : 0, a = r ? parseFloat(r) : 0;
    $t(t, "left", o + e), $t(t, "top", a + n);
  }
  updateSelectedNodesPosition(t) {
    const { dx: e, dy: n } = t;
    if (e || n)
      if (this.translateSelectedNodes(e, n), this.boxesUpdated)
        this.collection.length > 1 && this.updateSelectionBoxes();
      else {
        const s = this.graph.transform.getScale();
        for (let r = 0, o = this.$boxes, a = o.length; r < a; r += 1)
          this.updateElementPosition(o[r], e * s.sx, n * s.sy);
        this.updateElementPosition(this.selectionContainer, e * s.sx, n * s.sy);
      }
  }
  autoScrollGraph(t, e) {
    const n = this.graph.getPlugin("scroller");
    return n ? n.autoScroll(t, e) : { scrollerX: 0, scrollerY: 0 };
  }
  adjustSelection(t) {
    const e = this.normalizeEvent(t), n = this.getEventData(e);
    switch (n.action) {
      case "selecting": {
        const r = n;
        r.moving !== !0 && (Ni(this.container, this.graph.container), this.showRubberband(), r.moving = !0);
        const { scrollerX: o, scrollerY: a } = this.autoScrollGraph(e.clientX, e.clientY);
        r.scrollerX += o, r.scrollerY += a;
        const l = e.clientX - r.clientX + r.scrollerX, c = e.clientY - r.clientY + r.scrollerY, u = parseInt($t(this.container, "left") || "0", 10), h = parseInt($t(this.container, "top") || "0", 10);
        $t(this.container, {
          left: l < 0 ? r.offsetX + l : u,
          top: c < 0 ? r.offsetY + c : h,
          width: Math.abs(l),
          height: Math.abs(c)
        });
        break;
      }
      case "translating": {
        const r = this.graph.snapToGrid(e.clientX, e.clientY), o = n, a = this.getSelectionOffset(r, o);
        this.options.following ? this.updateSelectedNodesPosition(a) : this.updateContainerPosition(a), a.dx && (o.clientX = r.x), a.dy && (o.clientY = r.y), this.notifyBoxEvent("box:mousemove", t, r.x, r.y);
        break;
      }
    }
    this.boxesUpdated = !1;
  }
  translateSelectedNodes(t, e, n, s) {
    const r = {}, o = [];
    if (n && (r[n.id] = !0), this.collection.toArray().forEach((a) => {
      a.getDescendants({ deep: !0 }).forEach((l) => {
        r[l.id] = !0;
      });
    }), s && s.translateBy) {
      const a = this.graph.getCellById(s.translateBy);
      a && (r[a.id] = !0, a.getDescendants({ deep: !0 }).forEach((l) => {
        r[l.id] = !0;
      }), o.push(a));
    }
    this.collection.toArray().forEach((a) => {
      if (!r[a.id]) {
        const l = Object.assign(Object.assign({}, s), { selection: this.cid, exclude: o });
        a.translate(t, e, l), this.graph.model.getConnectedEdges(a).forEach((c) => {
          r[c.id] || (c.translate(t, e, l), r[c.id] = !0);
        });
      }
    });
  }
  getCellViewsInArea(t) {
    const e = this.graph, n = {
      strict: this.options.strict
    };
    let s = [];
    return this.options.rubberNode && (s = s.concat(e.model.getNodesInArea(t, n).map((r) => e.renderer.findViewByCell(r)).filter((r) => r != null))), this.options.rubberEdge && (s = s.concat(e.model.getEdgesInArea(t, n).map((r) => e.renderer.findViewByCell(r)).filter((r) => r != null))), s;
  }
  notifyBoxEvent(t, e, n, s) {
    const o = this.getEventData(e).activeView;
    this.trigger(t, { e, view: o, x: n, y: s, cell: o.cell });
  }
  getSelectedClassName(t) {
    return this.prefixClassName(`${t.isNode() ? "node" : "edge"}-selected`);
  }
  addCellSelectedClassName(t) {
    const e = this.graph.renderer.findViewByCell(t);
    e && e.addClass(this.getSelectedClassName(t));
  }
  removeCellUnSelectedClassName(t) {
    const e = this.graph.renderer.findViewByCell(t);
    e && e.removeClass(this.getSelectedClassName(t));
  }
  destroySelectionBox(t) {
    this.removeCellUnSelectedClassName(t), this.canShowSelectionBox(t) && (Te(this.container.querySelector(`[data-cell-id="${t.id}"]`)), this.$boxes.length === 0 && this.hide(), this.boxCount = Math.max(0, this.boxCount - 1));
  }
  destroyAllSelectionBoxes(t) {
    t.forEach((e) => this.removeCellUnSelectedClassName(e)), this.hide(), Te(this.$boxes), this.boxCount = 0;
  }
  hide() {
    Jt(this.container, this.prefixClassName(ee.classNames.rubberband)), Jt(this.container, this.prefixClassName(ee.classNames.selected));
  }
  showRubberband() {
    U(this.container, this.prefixClassName(ee.classNames.rubberband));
  }
  hideRubberband() {
    Jt(this.container, this.prefixClassName(ee.classNames.rubberband));
  }
  showSelected() {
    Bo(this.container, "style"), U(this.container, this.prefixClassName(ee.classNames.selected));
  }
  createContainer() {
    this.container = document.createElement("div"), U(this.container, this.prefixClassName(ee.classNames.root)), this.options.className && U(this.container, this.options.className), this.selectionContainer = document.createElement("div"), U(this.selectionContainer, this.prefixClassName(ee.classNames.inner)), this.selectionContent = document.createElement("div"), U(this.selectionContent, this.prefixClassName(ee.classNames.content)), Mn(this.selectionContainer, this.selectionContent), nt(this.selectionContainer, "data-selection-length", this.collection.length), bu(this.container, this.selectionContainer);
  }
  updateContainerPosition(t) {
    (t.dx || t.dy) && this.updateElementPosition(this.selectionContainer, t.dx, t.dy);
  }
  updateContainer() {
    const t = { x: 1 / 0, y: 1 / 0 }, e = { x: 0, y: 0 };
    this.collection.toArray().filter((r) => this.canShowSelectionBox(r)).forEach((r) => {
      const o = this.graph.renderer.findViewByCell(r);
      if (o) {
        const a = o.getBBox({
          useCellGeometry: !0
        });
        t.x = Math.min(t.x, a.x), t.y = Math.min(t.y, a.y), e.x = Math.max(e.x, a.x + a.width), e.y = Math.max(e.y, a.y + a.height);
      }
    }), $t(this.selectionContainer, {
      position: "absolute",
      pointerEvents: "none",
      left: t.x,
      top: t.y,
      width: e.x - t.x,
      height: e.y - t.y
    }), nt(this.selectionContainer, "data-selection-length", this.collection.length);
    const s = this.options.content;
    if (s)
      if (typeof s == "function") {
        const r = z(s, this.graph, this, this.selectionContent);
        r && (this.selectionContent.innerHTML = r);
      } else
        this.selectionContent.innerHTML = s;
    this.collection.length > 0 && !this.container.parentNode ? Ni(this.container, this.graph.container) : this.collection.length <= 0 && this.container.parentNode && this.container.parentNode.removeChild(this.container);
  }
  canShowSelectionBox(t) {
    return t.isNode() && this.options.showNodeSelectionBox === !0 || t.isEdge() && this.options.showEdgeSelectionBox === !0;
  }
  getPointerEventsValue(t) {
    return typeof t == "string" ? t : t(this.cells);
  }
  createSelectionBox(t) {
    if (this.addCellSelectedClassName(t), this.canShowSelectionBox(t)) {
      const e = this.graph.renderer.findViewByCell(t);
      if (e) {
        const n = e.getBBox({
          useCellGeometry: !0
        }), s = this.boxClassName, r = document.createElement("div"), o = this.options.pointerEvents;
        U(r, s), U(r, `${s}-${t.isNode() ? "node" : "edge"}`), nt(r, "data-cell-id", t.id), $t(r, {
          position: "absolute",
          left: n.x,
          top: n.y,
          width: n.width,
          height: n.height,
          pointerEvents: o ? this.getPointerEventsValue(o) : "auto"
        }), Ni(r, this.container), this.showSelected(), this.boxCount += 1;
      }
    }
  }
  updateSelectionBoxes() {
    this.collection.length > 0 && (this.boxesUpdated = !0, this.confirmUpdate());
  }
  confirmUpdate() {
    if (this.boxCount) {
      this.hide();
      for (let t = 0, e = this.$boxes, n = e.length; t < n; t += 1) {
        const s = e[t], r = nt(s, "data-cell-id");
        Te(s), this.boxCount -= 1;
        const o = this.collection.get(r);
        o && this.createSelectionBox(o);
      }
      this.updateContainer();
    }
    return 0;
  }
  getCellViewFromElem(t) {
    const e = t.getAttribute("data-cell-id");
    if (e) {
      const n = this.collection.get(e);
      if (n)
        return this.graph.renderer.findViewByCell(n);
    }
    return null;
  }
  onCellRemoved({ cell: t }) {
    this.destroySelectionBox(t), this.updateContainer();
  }
  onReseted({ previous: t, current: e }) {
    this.destroyAllSelectionBoxes(t), e.forEach((n) => {
      this.listenCellRemoveEvent(n), this.createSelectionBox(n);
    }), this.updateContainer();
  }
  onCellAdded({ cell: t }) {
    this.listenCellRemoveEvent(t), this.createSelectionBox(t), this.updateContainer();
  }
  listenCellRemoveEvent(t) {
    t.off("removed", this.onCellRemoved, this), t.on("removed", this.onCellRemoved, this);
  }
  onCollectionUpdated({ added: t, removed: e, options: n }) {
    t.forEach((r) => {
      this.trigger("cell:selected", { cell: r, options: n }), r.isNode() ? this.trigger("node:selected", { cell: r, options: n, node: r }) : r.isEdge() && this.trigger("edge:selected", { cell: r, options: n, edge: r });
    }), e.forEach((r) => {
      this.trigger("cell:unselected", { cell: r, options: n }), r.isNode() ? this.trigger("node:unselected", { cell: r, options: n, node: r }) : r.isEdge() && this.trigger("edge:unselected", { cell: r, options: n, edge: r });
    });
    const s = {
      added: t,
      removed: e,
      options: n,
      selected: this.cells.filter((r) => !!this.graph.getCellById(r.id))
    };
    this.trigger("selection:changed", s);
  }
  // #endregion
  dispose() {
    this.clean(), this.remove(), this.off();
  }
}
qE([
  rt.dispose()
], jh.prototype, "dispose", null);
var ee;
(function(i) {
  const t = "widget-selection";
  i.classNames = {
    root: t,
    inner: `${t}-inner`,
    box: `${t}-box`,
    content: `${t}-content`,
    rubberband: `${t}-rubberband`,
    selected: `${t}-selected`
  }, i.documentEvents = {
    mousemove: "adjustSelection",
    touchmove: "adjustSelection",
    mouseup: "onMouseUp",
    touchend: "onMouseUp",
    touchcancel: "onMouseUp"
  };
  function e(n) {
    return n.getAncestors().length;
  }
  i.depthComparator = e;
})(ee || (ee = {}));
const UE = `.x6-widget-selection {
  position: absolute;
  top: 0;
  left: 0;
  display: none;
  width: 0;
  height: 0;
  touch-action: none;
}
.x6-widget-selection-rubberband {
  display: block;
  overflow: visible;
  opacity: 0.3;
}
.x6-widget-selection-selected {
  display: block;
}
.x6-widget-selection-box {
  cursor: move;
}
.x6-widget-selection-inner[data-selection-length='0'],
.x6-widget-selection-inner[data-selection-length='1'] {
  display: none;
}
.x6-widget-selection-content {
  position: absolute;
  top: 100%;
  right: -20px;
  left: -20px;
  margin-top: 30px;
  padding: 6px;
  line-height: 14px;
  text-align: center;
  border-radius: 6px;
}
.x6-widget-selection-content:empty {
  display: none;
}
.x6-widget-selection-rubberband {
  background-color: #3498db;
  border: 2px solid #2980b9;
}
.x6-widget-selection-box {
  box-sizing: content-box !important;
  margin-top: -4px;
  margin-left: -4px;
  padding-right: 4px;
  padding-bottom: 4px;
  border: 2px dashed #feb663;
  box-shadow: 2px 2px 5px #d3d3d3;
}
.x6-widget-selection-inner {
  box-sizing: content-box !important;
  margin-top: -8px;
  margin-left: -8px;
  padding-right: 12px;
  padding-bottom: 12px;
  border: 2px solid #feb663;
  box-shadow: 2px 2px 5px #d3d3d3;
}
.x6-widget-selection-content {
  color: #fff;
  font-size: 10px;
  background-color: #6a6b8a;
}
`;
j.prototype.isSelectionEnabled = function() {
  const i = this.getPlugin("selection");
  return i ? i.isEnabled() : !1;
};
j.prototype.enableSelection = function() {
  const i = this.getPlugin("selection");
  return i && i.enable(), this;
};
j.prototype.disableSelection = function() {
  const i = this.getPlugin("selection");
  return i && i.disable(), this;
};
j.prototype.toggleSelection = function(i) {
  const t = this.getPlugin("selection");
  return t && t.toggleEnabled(i), this;
};
j.prototype.isMultipleSelection = function() {
  const i = this.getPlugin("selection");
  return i ? i.isMultipleSelection() : !1;
};
j.prototype.enableMultipleSelection = function() {
  const i = this.getPlugin("selection");
  return i && i.enableMultipleSelection(), this;
};
j.prototype.disableMultipleSelection = function() {
  const i = this.getPlugin("selection");
  return i && i.disableMultipleSelection(), this;
};
j.prototype.toggleMultipleSelection = function(i) {
  const t = this.getPlugin("selection");
  return t && t.toggleMultipleSelection(i), this;
};
j.prototype.isSelectionMovable = function() {
  const i = this.getPlugin("selection");
  return i ? i.isSelectionMovable() : !1;
};
j.prototype.enableSelectionMovable = function() {
  const i = this.getPlugin("selection");
  return i && i.enableSelectionMovable(), this;
};
j.prototype.disableSelectionMovable = function() {
  const i = this.getPlugin("selection");
  return i && i.disableSelectionMovable(), this;
};
j.prototype.toggleSelectionMovable = function(i) {
  const t = this.getPlugin("selection");
  return t && t.toggleSelectionMovable(i), this;
};
j.prototype.isRubberbandEnabled = function() {
  const i = this.getPlugin("selection");
  return i ? i.isRubberbandEnabled() : !1;
};
j.prototype.enableRubberband = function() {
  const i = this.getPlugin("selection");
  return i && i.enableRubberband(), this;
};
j.prototype.disableRubberband = function() {
  const i = this.getPlugin("selection");
  return i && i.disableRubberband(), this;
};
j.prototype.toggleRubberband = function(i) {
  const t = this.getPlugin("selection");
  return t && t.toggleRubberband(i), this;
};
j.prototype.isStrictRubberband = function() {
  const i = this.getPlugin("selection");
  return i ? i.isStrictRubberband() : !1;
};
j.prototype.enableStrictRubberband = function() {
  const i = this.getPlugin("selection");
  return i && i.enableStrictRubberband(), this;
};
j.prototype.disableStrictRubberband = function() {
  const i = this.getPlugin("selection");
  return i && i.disableStrictRubberband(), this;
};
j.prototype.toggleStrictRubberband = function(i) {
  const t = this.getPlugin("selection");
  return t && t.toggleStrictRubberband(i), this;
};
j.prototype.setRubberbandModifiers = function(i) {
  const t = this.getPlugin("selection");
  return t && t.setRubberbandModifiers(i), this;
};
j.prototype.setSelectionFilter = function(i) {
  const t = this.getPlugin("selection");
  return t && t.setSelectionFilter(i), this;
};
j.prototype.setSelectionDisplayContent = function(i) {
  const t = this.getPlugin("selection");
  return t && t.setSelectionDisplayContent(i), this;
};
j.prototype.isSelectionEmpty = function() {
  const i = this.getPlugin("selection");
  return i ? i.isEmpty() : !0;
};
j.prototype.cleanSelection = function(i) {
  const t = this.getPlugin("selection");
  return t && t.clean(i), this;
};
j.prototype.resetSelection = function(i, t) {
  const e = this.getPlugin("selection");
  return e && e.reset(i, t), this;
};
j.prototype.getSelectedCells = function() {
  const i = this.getPlugin("selection");
  return i ? i.getSelectedCells() : [];
};
j.prototype.getSelectedCellCount = function() {
  const i = this.getPlugin("selection");
  return i ? i.getSelectedCellCount() : 0;
};
j.prototype.isSelected = function(i) {
  const t = this.getPlugin("selection");
  return t ? t.isSelected(i) : !1;
};
j.prototype.select = function(i, t) {
  const e = this.getPlugin("selection");
  return e && e.select(i, t), this;
};
j.prototype.unselect = function(i, t) {
  const e = this.getPlugin("selection");
  return e && e.unselect(i, t), this;
};
var WE = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
};
class ii extends Nt {
  get rubberbandDisabled() {
    return this.options.enabled !== !0 || this.options.rubberband !== !0;
  }
  get disabled() {
    return this.options.enabled !== !0;
  }
  get length() {
    return this.selectionImpl.length;
  }
  get cells() {
    return this.selectionImpl.cells;
  }
  constructor(t = {}) {
    super(), this.name = "selection", this.movedMap = /* @__PURE__ */ new WeakMap(), this.unselectMap = /* @__PURE__ */ new WeakMap(), this.options = Object.assign(Object.assign({ enabled: !0 }, ii.defaultOptions), t), nr(this.name, UE);
  }
  init(t) {
    this.graph = t, this.selectionImpl = new jh(Object.assign(Object.assign({}, this.options), { graph: t })), this.setup(), this.startListening();
  }
  // #region api
  isEnabled() {
    return !this.disabled;
  }
  enable() {
    this.disabled && (this.options.enabled = !0);
  }
  disable() {
    this.disabled || (this.options.enabled = !1);
  }
  toggleEnabled(t) {
    return t != null ? t !== this.isEnabled() && (t ? this.enable() : this.disable()) : this.isEnabled() ? this.disable() : this.enable(), this;
  }
  isMultipleSelection() {
    return this.isMultiple();
  }
  enableMultipleSelection() {
    return this.enableMultiple(), this;
  }
  disableMultipleSelection() {
    return this.disableMultiple(), this;
  }
  toggleMultipleSelection(t) {
    return t != null ? t !== this.isMultipleSelection() && (t ? this.enableMultipleSelection() : this.disableMultipleSelection()) : this.isMultipleSelection() ? this.disableMultipleSelection() : this.enableMultipleSelection(), this;
  }
  isSelectionMovable() {
    return this.options.movable !== !1;
  }
  enableSelectionMovable() {
    return this.selectionImpl.options.movable = !0, this;
  }
  disableSelectionMovable() {
    return this.selectionImpl.options.movable = !1, this;
  }
  toggleSelectionMovable(t) {
    return t != null ? t !== this.isSelectionMovable() && (t ? this.enableSelectionMovable() : this.disableSelectionMovable()) : this.isSelectionMovable() ? this.disableSelectionMovable() : this.enableSelectionMovable(), this;
  }
  isRubberbandEnabled() {
    return !this.rubberbandDisabled;
  }
  enableRubberband() {
    return this.rubberbandDisabled && (this.options.rubberband = !0), this;
  }
  disableRubberband() {
    return this.rubberbandDisabled || (this.options.rubberband = !1), this;
  }
  toggleRubberband(t) {
    return t != null ? t !== this.isRubberbandEnabled() && (t ? this.enableRubberband() : this.disableRubberband()) : this.isRubberbandEnabled() ? this.disableRubberband() : this.enableRubberband(), this;
  }
  isStrictRubberband() {
    return this.selectionImpl.options.strict === !0;
  }
  enableStrictRubberband() {
    return this.selectionImpl.options.strict = !0, this;
  }
  disableStrictRubberband() {
    return this.selectionImpl.options.strict = !1, this;
  }
  toggleStrictRubberband(t) {
    return t != null ? t !== this.isStrictRubberband() && (t ? this.enableStrictRubberband() : this.disableStrictRubberband()) : this.isStrictRubberband() ? this.disableStrictRubberband() : this.enableStrictRubberband(), this;
  }
  setRubberbandModifiers(t) {
    this.setModifiers(t);
  }
  setSelectionFilter(t) {
    return this.setFilter(t), this;
  }
  setSelectionDisplayContent(t) {
    return this.setContent(t), this;
  }
  isEmpty() {
    return this.length <= 0;
  }
  clean(t = {}) {
    return this.selectionImpl.clean(t), this;
  }
  reset(t, e = {}) {
    return this.selectionImpl.reset(t ? this.getCells(t) : [], e), this;
  }
  getSelectedCells() {
    return this.cells;
  }
  getSelectedCellCount() {
    return this.length;
  }
  isSelected(t) {
    return this.selectionImpl.isSelected(t);
  }
  select(t, e = {}) {
    const n = this.getCells(t);
    return n.length && (this.isMultiple() ? this.selectionImpl.select(n, e) : this.reset(n.slice(0, 1), e)), this;
  }
  unselect(t, e = {}) {
    return this.selectionImpl.unselect(this.getCells(t), e), this;
  }
  // #endregion
  setup() {
    this.selectionImpl.on("*", (t, e) => {
      this.trigger(t, e), this.graph.trigger(t, e);
    });
  }
  startListening() {
    this.graph.on("blank:mousedown", this.onBlankMouseDown, this), this.graph.on("blank:click", this.onBlankClick, this), this.graph.on("cell:mousemove", this.onCellMouseMove, this), this.graph.on("cell:mouseup", this.onCellMouseUp, this), this.selectionImpl.on("box:mousedown", this.onBoxMouseDown, this);
  }
  stopListening() {
    this.graph.off("blank:mousedown", this.onBlankMouseDown, this), this.graph.off("blank:click", this.onBlankClick, this), this.graph.off("cell:mousemove", this.onCellMouseMove, this), this.graph.off("cell:mouseup", this.onCellMouseUp, this), this.selectionImpl.off("box:mousedown", this.onBoxMouseDown, this);
  }
  onBlankMouseDown({ e: t }) {
    if (!this.allowBlankMouseDown(t))
      return;
    const e = this.graph.panning.allowPanning(t, !0), n = this.graph.getPlugin("scroller"), s = n && n.allowPanning(t, !0);
    (this.allowRubberband(t, !0) || this.allowRubberband(t) && !s && !e) && this.startRubberband(t);
  }
  allowBlankMouseDown(t) {
    const e = this.options.eventTypes;
    return (e == null ? void 0 : e.includes("leftMouseDown")) && t.button === 0 || (e == null ? void 0 : e.includes("mouseWheelDown")) && t.button === 1;
  }
  onBlankClick() {
    this.clean();
  }
  allowRubberband(t, e) {
    return !this.rubberbandDisabled && sn.isMatch(t, this.options.modifiers, e);
  }
  allowMultipleSelection(t) {
    return this.isMultiple() && sn.isMatch(t, this.options.multipleSelectionModifiers);
  }
  onCellMouseMove({ cell: t }) {
    this.movedMap.set(t, !0);
  }
  onCellMouseUp({ e: t, cell: e }) {
    const n = this.options;
    let s = this.disabled;
    !s && this.movedMap.has(e) && (s = n.selectCellOnMoved === !1, s || (s = n.selectNodeOnMoved === !1 && e.isNode()), s || (s = n.selectEdgeOnMoved === !1 && e.isEdge())), s || (this.allowMultipleSelection(t) ? this.unselectMap.has(e) ? this.unselectMap.delete(e) : this.isSelected(e) ? this.unselect(e) : this.select(e) : this.reset(e)), this.movedMap.delete(e);
  }
  onBoxMouseDown({ e: t, cell: e }) {
    this.disabled || this.allowMultipleSelection(t) && (this.unselect(e), this.unselectMap.set(e, !0));
  }
  getCells(t) {
    return (Array.isArray(t) ? t : [t]).map((e) => typeof e == "string" ? this.graph.getCellById(e) : e).filter((e) => e != null);
  }
  startRubberband(t) {
    return this.rubberbandDisabled || this.selectionImpl.startSelecting(t), this;
  }
  isMultiple() {
    return this.options.multiple !== !1;
  }
  enableMultiple() {
    return this.options.multiple = !0, this;
  }
  disableMultiple() {
    return this.options.multiple = !1, this;
  }
  setModifiers(t) {
    return this.options.modifiers = t, this;
  }
  setContent(t) {
    return this.selectionImpl.setContent(t), this;
  }
  setFilter(t) {
    return this.selectionImpl.setFilter(t), this;
  }
  dispose() {
    this.stopListening(), this.off(), this.selectionImpl.dispose(), ir(this.name);
  }
}
WE([
  Nt.dispose()
], ii.prototype, "dispose", null);
(function(i) {
  i.defaultOptions = {
    rubberband: !1,
    rubberNode: !0,
    rubberEdge: !1,
    pointerEvents: "auto",
    multiple: !0,
    multipleSelectionModifiers: ["ctrl", "meta"],
    movable: !0,
    strict: !1,
    selectCellOnMoved: !1,
    selectNodeOnMoved: !1,
    selectEdgeOnMoved: !1,
    following: !0,
    content: null,
    eventTypes: ["leftMouseDown", "mouseWheelDown"]
  };
})(ii || (ii = {}));
var XE = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
}, YE = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
};
class Lh extends rt {
  get model() {
    return this.graph.model;
  }
  get containerClassName() {
    return this.prefixClassName("widget-snapline");
  }
  get verticalClassName() {
    return `${this.containerClassName}-vertical`;
  }
  get horizontalClassName() {
    return `${this.containerClassName}-horizontal`;
  }
  constructor(t) {
    super();
    const { graph: e } = t, n = YE(t, ["graph"]);
    this.graph = e, this.options = Object.assign({}, n), this.offset = { x: 0, y: 0 }, this.render(), this.disabled || this.startListening();
  }
  get disabled() {
    return this.options.enabled !== !0;
  }
  enable() {
    this.disabled && (this.options.enabled = !0, this.startListening());
  }
  disable() {
    this.disabled || (this.options.enabled = !1, this.stopListening());
  }
  setFilter(t) {
    this.options.filter = t;
  }
  render() {
    const t = this.containerWrapper = new G("svg"), e = this.horizontal = new G("line"), n = this.vertical = new G("line");
    t.addClass(this.containerClassName), e.addClass(this.horizontalClassName), n.addClass(this.verticalClassName), t.setAttribute("width", "100%"), t.setAttribute("height", "100%"), e.setAttribute("display", "none"), n.setAttribute("display", "none"), t.append([e, n]), this.options.className && t.addClass(this.options.className), this.container = this.containerWrapper.node;
  }
  startListening() {
    this.stopListening(), this.graph.on("node:mousedown", this.captureCursorOffset, this), this.graph.on("node:mousemove", this.snapOnMoving, this), this.model.on("batch:stop", this.onBatchStop, this), this.delegateDocumentEvents({
      mouseup: "hide",
      touchend: "hide"
    });
  }
  stopListening() {
    this.graph.off("node:mousedown", this.captureCursorOffset, this), this.graph.off("node:mousemove", this.snapOnMoving, this), this.model.off("batch:stop", this.onBatchStop, this), this.undelegateDocumentEvents();
  }
  onBatchStop({ name: t, data: e }) {
    t === "resize" && this.snapOnResizing(e.cell, e);
  }
  captureCursorOffset({ view: t, x: e, y: n }) {
    const s = t.getDelegatedView();
    if (s && this.isNodeMovable(s)) {
      const r = t.cell.getPosition();
      this.offset = {
        x: e - r.x,
        y: n - r.y
      };
    }
  }
  isNodeMovable(t) {
    return t && t.cell.isNode() && t.can("nodeMovable");
  }
  getRestrictArea(t) {
    const e = this.graph.options.translating.restrict, n = typeof e == "function" ? z(e, this.graph, t) : e;
    return typeof n == "number" ? this.graph.transform.getGraphArea().inflate(n) : n === !0 ? this.graph.transform.getGraphArea() : n || null;
  }
  snapOnResizing(t, e) {
    if (this.options.resizing && !e.snapped && e.ui && e.direction && e.trueDirection) {
      const n = this.graph.renderer.findViewByCell(t);
      if (n && n.cell.isNode()) {
        const s = t.getBBox(), r = s.bbox(t.getAngle()), o = r.getTopLeft(), a = r.getBottomRight(), l = ut.normalize(t.getAngle()), c = this.options.tolerance || 0;
        let u, h, d, f, g, p;
        const m = {
          vertical: 0,
          horizontal: 0
        }, y = e.direction, v = e.trueDirection, b = e.relativeDirection;
        v.indexOf("right") !== -1 ? m.vertical = a.x : m.vertical = o.x, v.indexOf("bottom") !== -1 ? m.horizontal = a.y : m.horizontal = o.y, this.model.getNodes().some((k) => {
          if (this.isIgnored(t, k))
            return !1;
          const H = k.getBBox().bbox(k.getAngle()), $ = H.getTopLeft(), A = H.getBottomRight(), N = {
            vertical: [$.x, A.x],
            horizontal: [$.y, A.y]
          }, V = {};
          return Object.keys(N).forEach((it) => {
            const Q = it, dt = N[Q].map((_) => ({
              position: _,
              distance: Math.abs(_ - m[Q])
            })).filter((_) => _.distance <= c);
            V[Q] = Oo(dt, (_) => _.distance);
          }), u == null && V.vertical.length > 0 && (u = V.vertical[0].position, h = Math.min(r.y, H.y), d = Math.max(a.y, A.y) - h), f == null && V.horizontal.length > 0 && (f = V.horizontal[0].position, g = Math.min(r.x, H.x), p = Math.max(a.x, A.x) - g), u != null && f != null;
        }), this.hide();
        let w = 0, E = 0;
        (f != null || u != null) && (u != null && (w = v.indexOf("right") !== -1 ? u - a.x : o.x - u), f != null && (E = v.indexOf("bottom") !== -1 ? f - a.y : o.y - f));
        let S = 0, C = 0;
        if (l % 90 === 0)
          l === 90 || l === 270 ? (S = E, C = w) : (S = w, C = E);
        else {
          const k = l >= 0 && l < 90 ? 1 : l >= 90 && l < 180 ? 4 : l >= 180 && l < 270 ? 3 : 2;
          f != null && u != null && (w < E ? (E = 0, f = void 0) : (w = 0, u = void 0));
          const H = ut.toRad(l % 90);
          w && (S = k === 3 ? w / Math.cos(H) : w / Math.sin(H)), E && (C = k === 3 ? E / Math.cos(H) : E / Math.sin(H));
          const $ = k === 1 || k === 3;
          switch (b) {
            case "top":
            case "bottom":
              C = E ? E / ($ ? Math.cos(H) : Math.sin(H)) : w / ($ ? Math.sin(H) : Math.cos(H));
              break;
            case "left":
            case "right":
              S = w ? w / ($ ? Math.cos(H) : Math.sin(H)) : E / ($ ? Math.sin(H) : Math.cos(H));
              break;
          }
        }
        switch (b) {
          case "top":
          case "bottom":
            S = 0;
            break;
          case "left":
          case "right":
            C = 0;
            break;
        }
        const P = this.graph.getGridSize();
        let O = Math.max(s.width + S, P), I = Math.max(s.height + C, P);
        e.minWidth && e.minWidth > P && (O = Math.max(O, e.minWidth)), e.minHeight && e.minHeight > P && (I = Math.max(I, e.minHeight)), e.maxWidth && (O = Math.min(O, e.maxWidth)), e.maxHeight && (I = Math.min(I, e.maxHeight)), e.preserveAspectRatio && (C < S ? I = O * (s.height / s.width) : O = I * (s.width / s.height)), (O !== s.width || I !== s.height) && (t.resize(O, I, {
          direction: y,
          relativeDirection: b,
          trueDirection: v,
          snapped: !0,
          snaplines: this.cid,
          restrict: this.getRestrictArea(n)
        }), d && (d += I - s.height), p && (p += O - s.width));
        const T = t.getBBox().bbox(l);
        u && Math.abs(T.x - u) > 1 && Math.abs(T.width + T.x - u) > 1 && (u = void 0), f && Math.abs(T.y - f) > 1 && Math.abs(T.height + T.y - f) > 1 && (f = void 0), this.update({
          verticalLeft: u,
          verticalTop: h,
          verticalHeight: d,
          horizontalTop: f,
          horizontalLeft: g,
          horizontalWidth: p
        });
      }
    }
  }
  snapOnMoving({ view: t, e, x: n, y: s }) {
    const r = t.getEventData(e).delegatedView || t;
    if (!this.isNodeMovable(r))
      return;
    const o = r.cell, a = o.getSize(), l = o.getPosition(), c = new R(n - this.offset.x, s - this.offset.y, a.width, a.height), u = o.getAngle(), h = c.getCenter(), d = c.bbox(u), f = d.getTopLeft(), g = d.getBottomRight(), p = this.options.tolerance || 0;
    let m, y, v, b, w, E, S = 0, C = 0;
    if (this.model.getNodes().some((P) => {
      if (this.isIgnored(o, P))
        return !1;
      const O = P.getBBox().bbox(P.getAngle()), I = O.getCenter(), T = O.getTopLeft(), k = O.getBottomRight();
      return m == null && (Math.abs(I.x - h.x) < p ? (m = I.x, S = 0.5) : Math.abs(T.x - f.x) < p ? (m = T.x, S = 0) : Math.abs(T.x - g.x) < p ? (m = T.x, S = 1) : Math.abs(k.x - g.x) < p ? (m = k.x, S = 1) : Math.abs(k.x - f.x) < p && (m = k.x), m != null && (y = Math.min(d.y, O.y), v = Math.max(g.y, k.y) - y)), b == null && (Math.abs(I.y - h.y) < p ? (b = I.y, C = 0.5) : Math.abs(T.y - f.y) < p ? b = T.y : Math.abs(T.y - g.y) < p ? (b = T.y, C = 1) : Math.abs(k.y - g.y) < p ? (b = k.y, C = 1) : Math.abs(k.y - f.y) < p && (b = k.y), b != null && (w = Math.min(d.x, O.x), E = Math.max(g.x, k.x) - w)), m != null && b != null;
    }), this.hide(), b != null || m != null) {
      b != null && (d.y = b - C * d.height), m != null && (d.x = m - S * d.width);
      const P = d.getCenter(), O = P.x - c.width / 2, I = P.y - c.height / 2, T = O - l.x, k = I - l.y;
      (T !== 0 || k !== 0) && (o.translate(T, k, {
        snapped: !0,
        restrict: this.getRestrictArea(r)
      }), E && (E += T), v && (v += k)), this.update({
        verticalLeft: m,
        verticalTop: y,
        verticalHeight: v,
        horizontalTop: b,
        horizontalLeft: w,
        horizontalWidth: E
      });
    }
  }
  isIgnored(t, e) {
    return e.id === t.id || e.isDescendantOf(t) || !this.filter(e);
  }
  filter(t) {
    const e = this.options.filter;
    return Array.isArray(e) ? e.some((n) => typeof n == "string" ? t.shape === n : t.id === n.id) : typeof e == "function" ? z(e, this.graph, t) : !0;
  }
  update(t) {
    if (t.horizontalTop) {
      const e = this.graph.localToGraph(new x(t.horizontalLeft, t.horizontalTop)), n = this.graph.localToGraph(new x(t.horizontalLeft + t.horizontalWidth, t.horizontalTop));
      this.horizontal.setAttributes({
        x1: this.options.sharp ? `${e.x}` : "0",
        y1: `${e.y}`,
        x2: this.options.sharp ? `${n.x}` : "100%",
        y2: `${n.y}`,
        display: "inherit"
      });
    } else
      this.horizontal.setAttribute("display", "none");
    if (t.verticalLeft) {
      const e = this.graph.localToGraph(new x(t.verticalLeft, t.verticalTop)), n = this.graph.localToGraph(new x(t.verticalLeft, t.verticalTop + t.verticalHeight));
      this.vertical.setAttributes({
        x1: `${e.x}`,
        y1: this.options.sharp ? `${e.y}` : "0",
        x2: `${n.x}`,
        y2: this.options.sharp ? `${n.y}` : "100%",
        display: "inherit"
      });
    } else
      this.vertical.setAttribute("display", "none");
    this.show();
  }
  resetTimer() {
    this.timer && (clearTimeout(this.timer), this.timer = null);
  }
  show() {
    return this.resetTimer(), this.container.parentNode == null && this.graph.container.appendChild(this.container), this;
  }
  hide() {
    this.resetTimer(), this.vertical.setAttribute("display", "none"), this.horizontal.setAttribute("display", "none");
    const t = this.options.clean, e = typeof t == "number" ? t : t !== !1 ? 3e3 : 0;
    return e > 0 && (this.timer = window.setTimeout(() => {
      this.container.parentNode !== null && this.unmount();
    }, e)), this;
  }
  onRemove() {
    this.stopListening(), this.hide();
  }
  dispose() {
    this.remove();
  }
}
XE([
  rt.dispose()
], Lh.prototype, "dispose", null);
const JE = `.x6-widget-snapline {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  pointer-events: none;
}
.x6-widget-snapline-vertical,
.x6-widget-snapline-horizontal {
  stroke: #2ecc71;
  stroke-width: 1px;
}
`;
j.prototype.isSnaplineEnabled = function() {
  const i = this.getPlugin("snapline");
  return i ? i.isEnabled() : !1;
};
j.prototype.enableSnapline = function() {
  const i = this.getPlugin("snapline");
  return i && i.enable(), this;
};
j.prototype.disableSnapline = function() {
  const i = this.getPlugin("snapline");
  return i && i.disable(), this;
};
j.prototype.toggleSnapline = function() {
  const i = this.getPlugin("snapline");
  return i && i.toggleEnabled(), this;
};
j.prototype.hideSnapline = function() {
  const i = this.getPlugin("snapline");
  return i && i.hide(), this;
};
j.prototype.setSnaplineFilter = function(i) {
  const t = this.getPlugin("snapline");
  return t && t.setFilter(i), this;
};
j.prototype.isSnaplineOnResizingEnabled = function() {
  const i = this.getPlugin("snapline");
  return i ? i.isOnResizingEnabled() : !1;
};
j.prototype.enableSnaplineOnResizing = function() {
  const i = this.getPlugin("snapline");
  return i && i.enableOnResizing(), this;
};
j.prototype.disableSnaplineOnResizing = function() {
  const i = this.getPlugin("snapline");
  return i && i.disableOnResizing(), this;
};
j.prototype.toggleSnaplineOnResizing = function(i) {
  const t = this.getPlugin("snapline");
  return t && t.toggleOnResizing(i), this;
};
j.prototype.isSharpSnapline = function() {
  const i = this.getPlugin("snapline");
  return i ? i.isSharp() : !1;
};
j.prototype.enableSharpSnapline = function() {
  const i = this.getPlugin("snapline");
  return i && i.enableSharp(), this;
};
j.prototype.disableSharpSnapline = function() {
  const i = this.getPlugin("snapline");
  return i && i.disableSharp(), this;
};
j.prototype.toggleSharpSnapline = function(i) {
  const t = this.getPlugin("snapline");
  return t && t.toggleSharp(i), this;
};
j.prototype.getSnaplineTolerance = function() {
  const i = this.getPlugin("snapline");
  if (i)
    return i.getTolerance();
};
j.prototype.setSnaplineTolerance = function(i) {
  const t = this.getPlugin("snapline");
  return t && t.setTolerance(i), this;
};
var KE = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
};
class kh extends Zt {
  constructor(t = {}) {
    super(), this.name = "snapline", this.options = Object.assign({ enabled: !0, tolerance: 10 }, t), nr(this.name, JE);
  }
  init(t) {
    this.snaplineImpl = new Lh(Object.assign(Object.assign({}, this.options), { graph: t }));
  }
  // #region api
  isEnabled() {
    return !this.snaplineImpl.disabled;
  }
  enable() {
    this.snaplineImpl.enable();
  }
  disable() {
    this.snaplineImpl.disable();
  }
  toggleEnabled(t) {
    if (t != null)
      t !== this.isEnabled() && (t ? this.enable() : this.disable());
    else
      return this.isEnabled() ? this.disable() : this.enable(), this;
  }
  hide() {
    return this.snaplineImpl.hide(), this;
  }
  setFilter(t) {
    return this.snaplineImpl.setFilter(t), this;
  }
  isOnResizingEnabled() {
    return this.snaplineImpl.options.resizing === !0;
  }
  enableOnResizing() {
    return this.snaplineImpl.options.resizing = !0, this;
  }
  disableOnResizing() {
    return this.snaplineImpl.options.resizing = !1, this;
  }
  toggleOnResizing(t) {
    return t != null ? t !== this.isOnResizingEnabled() && (t ? this.enableOnResizing() : this.disableOnResizing()) : this.isOnResizingEnabled() ? this.disableOnResizing() : this.enableOnResizing(), this;
  }
  isSharp() {
    return this.snaplineImpl.options.sharp === !0;
  }
  enableSharp() {
    return this.snaplineImpl.options.sharp = !0, this;
  }
  disableSharp() {
    return this.snaplineImpl.options.sharp = !1, this;
  }
  toggleSharp(t) {
    return t != null ? t !== this.isSharp() && (t ? this.enableSharp() : this.disableSharp()) : this.isSharp() ? this.disableSharp() : this.enableSharp(), this;
  }
  getTolerance() {
    return this.snaplineImpl.options.tolerance;
  }
  setTolerance(t) {
    return this.snaplineImpl.options.tolerance = t, this;
  }
  captureCursorOffset(t) {
    this.snaplineImpl.captureCursorOffset(t);
  }
  snapOnMoving(t) {
    this.snaplineImpl.snapOnMoving(t);
  }
  // #endregion
  dispose() {
    this.snaplineImpl.dispose(), ir(this.name);
  }
}
KE([
  Zt.dispose()
], kh.prototype, "dispose", null);
j.prototype.isHistoryEnabled = function() {
  const i = this.getPlugin("history");
  return i ? i.isEnabled() : !1;
};
j.prototype.enableHistory = function() {
  const i = this.getPlugin("history");
  return i && i.enable(), this;
};
j.prototype.disableHistory = function() {
  const i = this.getPlugin("history");
  return i && i.disable(), this;
};
j.prototype.toggleHistory = function(i) {
  const t = this.getPlugin("history");
  return t && t.toggleEnabled(i), this;
};
j.prototype.undo = function(i) {
  const t = this.getPlugin("history");
  return t && t.undo(i), this;
};
j.prototype.redo = function(i) {
  const t = this.getPlugin("history");
  return t && t.redo(i), this;
};
j.prototype.undoAndCancel = function(i) {
  const t = this.getPlugin("history");
  return t && t.cancel(i), this;
};
j.prototype.canUndo = function() {
  const i = this.getPlugin("history");
  return i ? i.canUndo() : !1;
};
j.prototype.canRedo = function() {
  const i = this.getPlugin("history");
  return i ? i.canRedo() : !1;
};
j.prototype.cleanHistory = function(i) {
  const t = this.getPlugin("history");
  return t && t.clean(i), this;
};
j.prototype.getHistoryStackSize = function() {
  return this.getPlugin("history").getSize();
};
j.prototype.getUndoStackSize = function() {
  return this.getPlugin("history").getUndoSize();
};
j.prototype.getRedoStackSize = function() {
  return this.getPlugin("history").getRedoSize();
};
j.prototype.getUndoRemainSize = function() {
  return this.getPlugin("history").getUndoRemainSize();
};
var Rh = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
};
class si extends Nt {
  constructor(t = {}) {
    super(), this.name = "history", this.batchCommands = null, this.batchLevel = 0, this.lastBatchIndex = -1, this.freezed = !1, this.stackSize = 0, this.handlers = [];
    const { stackSize: e = 0 } = t;
    this.stackSize = e, this.options = wt.getOptions(t), this.validator = new si.Validator({
      history: this,
      cancelInvalid: this.options.cancelInvalid
    });
  }
  init(t) {
    this.graph = t, this.model = this.graph.model, this.clean(), this.startListening();
  }
  // #region api
  isEnabled() {
    return !this.disabled;
  }
  enable() {
    this.disabled && (this.options.enabled = !0);
  }
  disable() {
    this.disabled || (this.options.enabled = !1);
  }
  toggleEnabled(t) {
    return t != null ? t !== this.isEnabled() && (t ? this.enable() : this.disable()) : this.isEnabled() ? this.disable() : this.enable(), this;
  }
  undo(t = {}) {
    if (!this.disabled) {
      const e = this.undoStack.pop();
      e && (this.revertCommand(e, t), this.redoStack.push(e), this.notify("undo", e, t));
    }
    return this;
  }
  redo(t = {}) {
    if (!this.disabled) {
      const e = this.redoStack.pop();
      e && (this.applyCommand(e, t), this.undoStackPush(e), this.notify("redo", e, t));
    }
    return this;
  }
  /**
   * Same as `undo()` but does not store the undo-ed command to the
   * `redoStack`. Canceled command therefore cannot be redo-ed.
   */
  cancel(t = {}) {
    if (!this.disabled) {
      const e = this.undoStack.pop();
      e && (this.revertCommand(e, t), this.redoStack = [], this.notify("cancel", e, t));
    }
    return this;
  }
  getSize() {
    return this.stackSize;
  }
  getUndoRemainSize() {
    const t = this.undoStack.length;
    return this.stackSize - t;
  }
  getUndoSize() {
    return this.undoStack.length;
  }
  getRedoSize() {
    return this.redoStack.length;
  }
  canUndo() {
    return !this.disabled && this.undoStack.length > 0;
  }
  canRedo() {
    return !this.disabled && this.redoStack.length > 0;
  }
  clean(t = {}) {
    return this.undoStack = [], this.redoStack = [], this.notify("clean", null, t), this;
  }
  // #endregion
  get disabled() {
    return this.options.enabled !== !0;
  }
  validate(t, ...e) {
    return this.validator.validate(t, ...e), this;
  }
  startListening() {
    this.model.on("batch:start", this.initBatchCommand, this), this.model.on("batch:stop", this.storeBatchCommand, this), this.options.eventNames && this.options.eventNames.forEach((t, e) => {
      this.handlers[e] = this.addCommand.bind(this, t), this.model.on(t, this.handlers[e]);
    }), this.validator.on("invalid", (t) => this.trigger("invalid", t));
  }
  stopListening() {
    this.model.off("batch:start", this.initBatchCommand, this), this.model.off("batch:stop", this.storeBatchCommand, this), this.options.eventNames && (this.options.eventNames.forEach((t, e) => {
      this.model.off(t, this.handlers[e]);
    }), this.handlers.length = 0), this.validator.off("invalid");
  }
  createCommand(t) {
    return {
      batch: t ? t.batch : !1,
      data: {}
    };
  }
  revertCommand(t, e) {
    this.freezed = !0;
    const n = Array.isArray(t) ? wt.sortBatchCommands(t) : [t];
    for (let s = n.length - 1; s >= 0; s -= 1) {
      const r = n[s], o = Object.assign(Object.assign({}, e), Ga(r.options, this.options.revertOptionsList || []));
      this.executeCommand(r, !0, o);
    }
    this.freezed = !1;
  }
  applyCommand(t, e) {
    this.freezed = !0;
    const n = Array.isArray(t) ? wt.sortBatchCommands(t) : [t];
    for (let s = 0; s < n.length; s += 1) {
      const r = n[s], o = Object.assign(Object.assign({}, e), Ga(r.options, this.options.applyOptionsList || []));
      this.executeCommand(r, !1, o);
    }
    this.freezed = !1;
  }
  executeCommand(t, e, n) {
    const s = this.model, r = s.getCell(t.data.id), o = t.event;
    if (wt.isAddEvent(o) && e || wt.isRemoveEvent(o) && !e)
      r && r.remove(n);
    else if (wt.isAddEvent(o) && !e || wt.isRemoveEvent(o) && e) {
      const a = t.data;
      a.node ? s.addNode(a.props, n) : a.edge && s.addEdge(a.props, n);
    } else if (wt.isChangeEvent(o)) {
      const a = t.data, l = a.key;
      if (l && r) {
        const c = e ? a.prev[l] : a.next[l];
        a.key === "attrs" && this.ensureUndefinedAttrs(c, e ? a.next[l] : a.prev[l]) && (n.dirty = !0), r.prop(l, c, n);
      }
    } else {
      const a = this.options.executeCommand;
      a && z(a, this, t, e, n);
    }
  }
  addCommand(t, e) {
    if (this.freezed || this.disabled)
      return;
    const n = e, s = n.options || {};
    if (s.dryrun || wt.isAddEvent(t) && this.options.ignoreAdd || wt.isRemoveEvent(t) && this.options.ignoreRemove || wt.isChangeEvent(t) && this.options.ignoreChange)
      return;
    const r = this.options.beforeAddCommand;
    if (r != null && z(r, this, t, e) === !1)
      return;
    t === "cell:change:*" && (t = `cell:change:${n.key}`);
    const o = n.cell, a = ie.isModel(o);
    let l;
    if (this.batchCommands) {
      l = this.batchCommands[Math.max(this.lastBatchIndex, 0)];
      const u = a && !l.modelChange || l.data.id !== o.id, h = l.event !== t;
      if (this.lastBatchIndex >= 0 && (u || h)) {
        const d = this.batchCommands.findIndex((f) => (a && f.modelChange || f.data.id === o.id) && f.event === t);
        d < 0 || wt.isAddEvent(t) || wt.isRemoveEvent(t) ? l = this.createCommand({ batch: !0 }) : (l = this.batchCommands[d], this.batchCommands.splice(d, 1)), this.batchCommands.push(l), this.lastBatchIndex = this.batchCommands.length - 1;
      }
    } else
      l = this.createCommand({ batch: !1 });
    if (wt.isAddEvent(t) || wt.isRemoveEvent(t)) {
      const u = l.data;
      return l.event = t, l.options = s, u.id = o.id, u.props = pt(o.toJSON()), o.isEdge() ? u.edge = !0 : o.isNode() && (u.node = !0), this.push(l, s);
    }
    if (wt.isChangeEvent(t)) {
      const u = e.key, h = l.data;
      return (!l.batch || !l.event) && (l.event = t, l.options = s, h.key = u, h.prev == null && (h.prev = {}), h.prev[u] = pt(o.previous(u)), a ? l.modelChange = !0 : h.id = o.id), h.next == null && (h.next = {}), h.next[u] = pt(o.prop(u)), this.push(l, s);
    }
    const c = this.options.afterAddCommand;
    c && z(c, this, t, e, l), this.push(l, s);
  }
  /**
   * Gather multiple changes into a single command. These commands could
   * be reverted with single `undo()` call. From the moment the function
   * is called every change made on model is not stored into the undoStack.
   * Changes are temporarily kept until `storeBatchCommand()` is called.
   */
  // eslint-disable-next-line
  initBatchCommand(t) {
    this.freezed || (this.batchCommands ? this.batchLevel += 1 : (this.batchCommands = [this.createCommand({ batch: !0 })], this.batchLevel = 0, this.lastBatchIndex = -1));
  }
  /**
   * Store changes temporarily kept in the undoStack. You have to call this
   * function as many times as `initBatchCommand()` been called.
   */
  storeBatchCommand(t) {
    if (!this.freezed)
      if (this.batchCommands && this.batchLevel <= 0) {
        const e = this.filterBatchCommand(this.batchCommands);
        e.length > 0 && (this.redoStack = [], this.undoStackPush(e), this.consolidateCommands(), this.notify("add", e, t)), this.batchCommands = null, this.lastBatchIndex = -1, this.batchLevel = 0;
      } else this.batchCommands && this.batchLevel > 0 && (this.batchLevel -= 1);
  }
  filterBatchCommand(t) {
    let e = t.slice();
    const n = [];
    for (; e.length > 0; ) {
      const s = e.shift(), r = s.event, o = s.data.id;
      if (r != null && (o != null || s.modelChange)) {
        if (wt.isAddEvent(r)) {
          const a = e.findIndex((l) => wt.isRemoveEvent(l.event) && l.data.id === o);
          if (a >= 0) {
            e = e.filter((l, c) => a < c || l.data.id !== o);
            continue;
          }
        } else if (wt.isRemoveEvent(r)) {
          const a = e.findIndex((l) => wt.isAddEvent(l.event) && l.data.id === o);
          if (a >= 0) {
            e.splice(a, 1);
            continue;
          }
        } else if (wt.isChangeEvent(r)) {
          const a = s.data;
          if (Me(a.prev, a.next))
            continue;
        }
        n.push(s);
      }
    }
    return n;
  }
  notify(t, e, n) {
    const s = e == null ? null : Array.isArray(e) ? e : [e];
    this.emit(t, { cmds: s, options: n }), this.graph.trigger(`history:${t}`, { cmds: s, options: n }), this.emit("change", { cmds: s, options: n }), this.graph.trigger("history:change", { cmds: s, options: n });
  }
  push(t, e) {
    this.redoStack = [], t.batch ? (this.lastBatchIndex = Math.max(this.lastBatchIndex, 0), this.emit("batch", { cmd: t, options: e })) : (this.undoStackPush(t), this.consolidateCommands(), this.notify("add", t, e));
  }
  /**
   * Conditionally combine multiple undo items into one.
   *
   * Currently this is only used combine a `cell:changed:position` event
   * followed by multiple `cell:change:parent` and `cell:change:children`
   * events, such that a "move + embed" action can be undone in one step.
   *
   * See https://github.com/antvis/X6/issues/2421
   *
   * This is an ugly WORKAROUND. It does not solve deficiencies in the batch
   * system itself.
   */
  consolidateCommands() {
    var t;
    const e = this.undoStack[this.undoStack.length - 1], n = this.undoStack[this.undoStack.length - 2];
    if (!Array.isArray(e))
      return;
    const s = new Set(e.map((o) => o.event));
    if (s.size !== 2 || !s.has("cell:change:parent") || !s.has("cell:change:children") || !e.every((o) => {
      var a;
      return o.batch && ((a = o.options) === null || a === void 0 ? void 0 : a.ui);
    }) || !Array.isArray(n) || n.length !== 1)
      return;
    const r = n[0];
    r.event !== "cell:change:position" || !(!((t = r.options) === null || t === void 0) && t.ui) || (n.push(...e), this.undoStack.pop());
  }
  undoStackPush(t) {
    if (this.stackSize === 0) {
      this.undoStack.push(t);
      return;
    }
    this.undoStack.length >= this.stackSize && this.undoStack.shift(), this.undoStack.push(t);
  }
  ensureUndefinedAttrs(t, e) {
    let n = !1;
    return t !== null && e !== null && typeof t == "object" && typeof e == "object" && Object.keys(e).forEach((s) => {
      t[s] === void 0 && e[s] !== void 0 ? (t[s] = void 0, n = !0) : typeof t[s] == "object" && typeof e[s] == "object" && (n = this.ensureUndefinedAttrs(t[s], e[s]));
    }), n;
  }
  dispose() {
    this.validator.dispose(), this.clean(), this.stopListening(), this.off();
  }
}
Rh([
  Nt.dispose()
], si.prototype, "dispose", null);
(function(i) {
  class t extends Nt {
    constructor(n) {
      super(), this.map = {}, this.command = n.history, this.cancelInvalid = n.cancelInvalid !== !1, this.command.on("add", this.onCommandAdded, this);
    }
    onCommandAdded({ cmds: n }) {
      return Array.isArray(n) ? n.every((s) => this.isValidCommand(s)) : this.isValidCommand(n);
    }
    isValidCommand(n) {
      if (n.options && n.options.validation === !1)
        return !0;
      const s = n.event && this.map[n.event] || [];
      let r = null;
      return s.forEach((o) => {
        let a = 0;
        const l = (c) => {
          const u = o[a];
          a += 1;
          try {
            if (u)
              u(c, n, l);
            else {
              r = c;
              return;
            }
          } catch (h) {
            l(h);
          }
        };
        l(r);
      }), r ? (this.cancelInvalid && this.command.cancel(), this.emit("invalid", { err: r }), !1) : !0;
    }
    validate(n, ...s) {
      const r = Array.isArray(n) ? n : n.split(/\s+/);
      return s.forEach((o) => {
        if (typeof o != "function")
          throw new Error(`${r.join(" ")} requires callback functions.`);
      }), r.forEach((o) => {
        this.map[o] == null && (this.map[o] = []), this.map[o].push(s);
      }), this;
    }
    dispose() {
      this.command.off("add", this.onCommandAdded, this);
    }
  }
  Rh([
    Nt.dispose()
  ], t.prototype, "dispose", null), i.Validator = t;
})(si || (si = {}));
var wt;
(function(i) {
  function t(o) {
    return o === "cell:added";
  }
  i.isAddEvent = t;
  function e(o) {
    return o === "cell:removed";
  }
  i.isRemoveEvent = e;
  function n(o) {
    return o != null && o.startsWith("cell:change:");
  }
  i.isChangeEvent = n;
  function s(o) {
    const a = [
      "cell:added",
      "cell:removed",
      "cell:change:*"
    ], l = ["batch:start", "batch:stop"], c = o.eventNames ? o.eventNames.filter((u) => !(i.isChangeEvent(u) || a.includes(u) || l.includes(u))) : a;
    return Object.assign(Object.assign({ enabled: !0 }, o), { eventNames: c, applyOptionsList: o.applyOptionsList || ["propertyPath"], revertOptionsList: o.revertOptionsList || ["propertyPath"] });
  }
  i.getOptions = s;
  function r(o) {
    const a = [];
    for (let l = 0, c = o.length; l < c; l += 1) {
      const u = o[l];
      let h = null;
      if (i.isAddEvent(u.event)) {
        const d = u.data.id;
        for (let f = 0; f < l; f += 1)
          if (o[f].data.id === d) {
            h = f;
            break;
          }
      }
      h !== null ? a.splice(h, 0, u) : a.push(u);
    }
    return a;
  }
  i.sortBatchCommands = r;
})(wt || (wt = {}));
function Dh(i) {
  return i && i.__esModule && Object.prototype.hasOwnProperty.call(i, "default") ? i.default : i;
}
var _h = { exports: {} };
(function(i) {
  (function(t, e, n) {
    if (!t)
      return;
    for (var s = {
      8: "backspace",
      9: "tab",
      13: "enter",
      16: "shift",
      17: "ctrl",
      18: "alt",
      20: "capslock",
      27: "esc",
      32: "space",
      33: "pageup",
      34: "pagedown",
      35: "end",
      36: "home",
      37: "left",
      38: "up",
      39: "right",
      40: "down",
      45: "ins",
      46: "del",
      91: "meta",
      93: "meta",
      224: "meta"
    }, r = {
      106: "*",
      107: "+",
      109: "-",
      110: ".",
      111: "/",
      186: ";",
      187: "=",
      188: ",",
      189: "-",
      190: ".",
      191: "/",
      192: "`",
      219: "[",
      220: "\\",
      221: "]",
      222: "'"
    }, o = {
      "~": "`",
      "!": "1",
      "@": "2",
      "#": "3",
      $: "4",
      "%": "5",
      "^": "6",
      "&": "7",
      "*": "8",
      "(": "9",
      ")": "0",
      _: "-",
      "+": "=",
      ":": ";",
      '"': "'",
      "<": ",",
      ">": ".",
      "?": "/",
      "|": "\\"
    }, a = {
      option: "alt",
      command: "meta",
      return: "enter",
      escape: "esc",
      plus: "+",
      mod: /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? "meta" : "ctrl"
    }, l, c = 1; c < 20; ++c)
      s[111 + c] = "f" + c;
    for (c = 0; c <= 9; ++c)
      s[c + 96] = c.toString();
    function u(C, P, O) {
      if (C.addEventListener) {
        C.addEventListener(P, O, !1);
        return;
      }
      C.attachEvent("on" + P, O);
    }
    function h(C) {
      if (C.type == "keypress") {
        var P = String.fromCharCode(C.which);
        return C.shiftKey || (P = P.toLowerCase()), P;
      }
      return s[C.which] ? s[C.which] : r[C.which] ? r[C.which] : String.fromCharCode(C.which).toLowerCase();
    }
    function d(C, P) {
      return C.sort().join(",") === P.sort().join(",");
    }
    function f(C) {
      var P = [];
      return C.shiftKey && P.push("shift"), C.altKey && P.push("alt"), C.ctrlKey && P.push("ctrl"), C.metaKey && P.push("meta"), P;
    }
    function g(C) {
      if (C.preventDefault) {
        C.preventDefault();
        return;
      }
      C.returnValue = !1;
    }
    function p(C) {
      if (C.stopPropagation) {
        C.stopPropagation();
        return;
      }
      C.cancelBubble = !0;
    }
    function m(C) {
      return C == "shift" || C == "ctrl" || C == "alt" || C == "meta";
    }
    function y() {
      if (!l) {
        l = {};
        for (var C in s)
          C > 95 && C < 112 || s.hasOwnProperty(C) && (l[s[C]] = C);
      }
      return l;
    }
    function v(C, P, O) {
      return O || (O = y()[C] ? "keydown" : "keypress"), O == "keypress" && P.length && (O = "keydown"), O;
    }
    function b(C) {
      return C === "+" ? ["+"] : (C = C.replace(/\+{2}/g, "+plus"), C.split("+"));
    }
    function w(C, P) {
      var O, I, T, k = [];
      for (O = b(C), T = 0; T < O.length; ++T)
        I = O[T], a[I] && (I = a[I]), P && P != "keypress" && o[I] && (I = o[I], k.push("shift")), m(I) && k.push(I);
      return P = v(I, k, P), {
        key: I,
        modifiers: k,
        action: P
      };
    }
    function E(C, P) {
      return C === null || C === e ? !1 : C === P ? !0 : E(C.parentNode, P);
    }
    function S(C) {
      var P = this;
      if (C = C || e, !(P instanceof S))
        return new S(C);
      P.target = C, P._callbacks = {}, P._directMap = {};
      var O = {}, I, T = !1, k = !1, H = !1;
      function $(_) {
        _ = _ || {};
        var Z = !1, tt;
        for (tt in O) {
          if (_[tt]) {
            Z = !0;
            continue;
          }
          O[tt] = 0;
        }
        Z || (H = !1);
      }
      function A(_, Z, tt, W, st, Pt) {
        var Y, Ot, Qt = [], Gt = tt.type;
        if (!P._callbacks[_])
          return [];
        for (Gt == "keyup" && m(_) && (Z = [_]), Y = 0; Y < P._callbacks[_].length; ++Y)
          if (Ot = P._callbacks[_][Y], !(!W && Ot.seq && O[Ot.seq] != Ot.level) && Gt == Ot.action && (Gt == "keypress" && !tt.metaKey && !tt.ctrlKey || d(Z, Ot.modifiers))) {
            var fr = !W && Ot.combo == st, gr = W && Ot.seq == W && Ot.level == Pt;
            (fr || gr) && P._callbacks[_].splice(Y, 1), Qt.push(Ot);
          }
        return Qt;
      }
      function N(_, Z, tt, W) {
        P.stopCallback(Z, Z.target || Z.srcElement, tt, W) || _(Z, tt) === !1 && (g(Z), p(Z));
      }
      P._handleKey = function(_, Z, tt) {
        var W = A(_, Z, tt), st, Pt = {}, Y = 0, Ot = !1;
        for (st = 0; st < W.length; ++st)
          W[st].seq && (Y = Math.max(Y, W[st].level));
        for (st = 0; st < W.length; ++st) {
          if (W[st].seq) {
            if (W[st].level != Y)
              continue;
            Ot = !0, Pt[W[st].seq] = 1, N(W[st].callback, tt, W[st].combo, W[st].seq);
            continue;
          }
          Ot || N(W[st].callback, tt, W[st].combo);
        }
        var Qt = tt.type == "keypress" && k;
        tt.type == H && !m(_) && !Qt && $(Pt), k = Ot && tt.type == "keydown";
      };
      function V(_) {
        typeof _.which != "number" && (_.which = _.keyCode);
        var Z = h(_);
        if (Z) {
          if (_.type == "keyup" && T === Z) {
            T = !1;
            return;
          }
          P.handleKey(Z, f(_), _);
        }
      }
      function it() {
        clearTimeout(I), I = setTimeout($, 1e3);
      }
      function Q(_, Z, tt, W) {
        O[_] = 0;
        function st(Gt) {
          return function() {
            H = Gt, ++O[_], it();
          };
        }
        function Pt(Gt) {
          N(tt, Gt, _), W !== "keyup" && (T = h(Gt)), setTimeout($, 10);
        }
        for (var Y = 0; Y < Z.length; ++Y) {
          var Ot = Y + 1 === Z.length, Qt = Ot ? Pt : st(W || w(Z[Y + 1]).action);
          dt(Z[Y], Qt, W, _, Y);
        }
      }
      function dt(_, Z, tt, W, st) {
        P._directMap[_ + ":" + tt] = Z, _ = _.replace(/\s+/g, " ");
        var Pt = _.split(" "), Y;
        if (Pt.length > 1) {
          Q(_, Pt, Z, tt);
          return;
        }
        Y = w(_, tt), P._callbacks[Y.key] = P._callbacks[Y.key] || [], A(Y.key, Y.modifiers, { type: Y.action }, W, _, st), P._callbacks[Y.key][W ? "unshift" : "push"]({
          callback: Z,
          modifiers: Y.modifiers,
          action: Y.action,
          seq: W,
          level: st,
          combo: _
        });
      }
      P._bindMultiple = function(_, Z, tt) {
        for (var W = 0; W < _.length; ++W)
          dt(_[W], Z, tt);
      }, u(C, "keypress", V), u(C, "keydown", V), u(C, "keyup", V);
    }
    S.prototype.bind = function(C, P, O) {
      var I = this;
      return C = C instanceof Array ? C : [C], I._bindMultiple.call(I, C, P, O), I;
    }, S.prototype.unbind = function(C, P) {
      var O = this;
      return O.bind.call(O, C, function() {
      }, P);
    }, S.prototype.trigger = function(C, P) {
      var O = this;
      return O._directMap[C + ":" + P] && O._directMap[C + ":" + P]({}, C), O;
    }, S.prototype.reset = function() {
      var C = this;
      return C._callbacks = {}, C._directMap = {}, C;
    }, S.prototype.stopCallback = function(C, P) {
      var O = this;
      if ((" " + P.className + " ").indexOf(" mousetrap ") > -1 || E(P, O.target))
        return !1;
      if ("composedPath" in C && typeof C.composedPath == "function") {
        var I = C.composedPath()[0];
        I !== C.target && (P = I);
      }
      return P.tagName == "INPUT" || P.tagName == "SELECT" || P.tagName == "TEXTAREA" || P.isContentEditable;
    }, S.prototype.handleKey = function() {
      var C = this;
      return C._handleKey.apply(C, arguments);
    }, S.addKeycodes = function(C) {
      for (var P in C)
        C.hasOwnProperty(P) && (s[P] = C[P]);
      l = null;
    }, S.init = function() {
      var C = S(e);
      for (var P in C)
        P.charAt(0) !== "_" && (S[P] = /* @__PURE__ */ function(O) {
          return function() {
            return C[O].apply(C, arguments);
          };
        }(P));
    }, S.init(), t.Mousetrap = S, i.exports && (i.exports = S);
  })(typeof window < "u" ? window : null, typeof window < "u" ? document : null);
})(_h);
var ZE = _h.exports;
const QE = /* @__PURE__ */ Dh(ZE);
var tC = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
};
class ri extends Zt {
  get graph() {
    return this.options.graph;
  }
  constructor(t) {
    super(), this.options = t;
    const e = this.graph.getPlugin("scroller");
    this.container = e ? e.container : this.graph.container, t.global ? this.target = document : (this.target = this.container, this.disabled || this.target.setAttribute("tabindex", "-1"), this.graph.on("cell:mouseup", this.focus, this), this.graph.on("blank:mouseup", this.focus, this)), this.mousetrap = ri.createMousetrap(this);
  }
  get disabled() {
    return this.options.enabled !== !0;
  }
  enable() {
    this.disabled && (this.options.enabled = !0, this.target instanceof HTMLElement && this.target.setAttribute("tabindex", "-1"));
  }
  disable() {
    this.disabled || (this.options.enabled = !1, this.target instanceof HTMLElement && this.target.removeAttribute("tabindex"));
  }
  on(t, e, n) {
    this.mousetrap.bind(this.getKeys(t), e, n);
  }
  off(t, e) {
    this.mousetrap.unbind(this.getKeys(t), e);
  }
  clear() {
    this.mousetrap.reset();
  }
  trigger(t, e) {
    this.mousetrap.trigger(t, e);
  }
  focus(t) {
    if (this.isInputEvent(t.e))
      return;
    this.target.focus({
      preventScroll: !0
    });
  }
  getKeys(t) {
    return (Array.isArray(t) ? t : [t]).map((e) => this.formatkey(e));
  }
  formatkey(t) {
    const e = t.toLocaleLowerCase().replace(/\s/g, "").replace("delete", "del").replace("cmd", "command").replace("arrowup", "up").replace("arrowright", "right").replace("arrowdown", "down").replace("arrowleft", "left"), n = this.options.format;
    return n ? z(n, this.graph, e) : e;
  }
  isGraphEvent(t) {
    const e = t.target, n = t.currentTarget;
    return e ? e === this.target || n === this.target || e === document.body ? !0 : _o(this.container, e) : !1;
  }
  isInputEvent(t) {
    var e;
    const n = t.target, s = (e = n == null ? void 0 : n.tagName) === null || e === void 0 ? void 0 : e.toLowerCase();
    let r = ["input", "textarea"].includes(s);
    return nt(n, "contenteditable") === "true" && (r = !0), r;
  }
  isEnabledForEvent(t) {
    const e = !this.disabled && this.isGraphEvent(t), n = this.isInputEvent(t);
    if (e) {
      if (n && (t.key === "Backspace" || t.key === "Delete"))
        return !1;
      if (this.options.guard)
        return z(this.options.guard, this.graph, t);
    }
    return e;
  }
  dispose() {
    this.mousetrap.reset();
  }
}
tC([
  Zt.dispose()
], ri.prototype, "dispose", null);
(function(i) {
  function t(e) {
    const n = new QE(e.target), s = n.stopCallback;
    return n.stopCallback = (r, o, a) => e.isEnabledForEvent(r) ? s ? s.call(n, r, o, a) : !1 : !0, n;
  }
  i.createMousetrap = t;
})(ri || (ri = {}));
j.prototype.isKeyboardEnabled = function() {
  const i = this.getPlugin("keyboard");
  return i ? i.isEnabled() : !1;
};
j.prototype.enableKeyboard = function() {
  const i = this.getPlugin("keyboard");
  return i && i.enable(), this;
};
j.prototype.disableKeyboard = function() {
  const i = this.getPlugin("keyboard");
  return i && i.disable(), this;
};
j.prototype.toggleKeyboard = function(i) {
  const t = this.getPlugin("keyboard");
  return t && t.toggleEnabled(i), this;
};
j.prototype.bindKey = function(i, t, e) {
  const n = this.getPlugin("keyboard");
  return n && n.bindKey(i, t, e), this;
};
j.prototype.unbindKey = function(i, t) {
  const e = this.getPlugin("keyboard");
  return e && e.unbindKey(i, t), this;
};
j.prototype.clearKeys = function() {
  const i = this.getPlugin("keyboard");
  return i && i.clear(), this;
};
j.prototype.triggerKey = function(i, t) {
  const e = this.getPlugin("keyboard");
  return e && e.trigger(i, t), this;
};
var eC = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
};
class $h extends Zt {
  constructor(t = {}) {
    super(), this.name = "keyboard", this.options = Object.assign({ enabled: !0 }, t);
  }
  init(t) {
    this.keyboardImpl = new ri(Object.assign(Object.assign({}, this.options), { graph: t }));
  }
  // #region api
  isEnabled() {
    return !this.keyboardImpl.disabled;
  }
  enable() {
    this.keyboardImpl.enable();
  }
  disable() {
    this.keyboardImpl.disable();
  }
  toggleEnabled(t) {
    return t != null ? t !== this.isEnabled() && (t ? this.enable() : this.disable()) : this.isEnabled() ? this.disable() : this.enable(), this;
  }
  bindKey(t, e, n) {
    return this.keyboardImpl.on(t, e, n), this;
  }
  trigger(t, e) {
    return this.keyboardImpl.trigger(t, e), this;
  }
  clear() {
    return this.keyboardImpl.clear(), this;
  }
  unbindKey(t, e) {
    return this.keyboardImpl.off(t, e), this;
  }
  // #endregion
  dispose() {
    this.keyboardImpl.dispose();
  }
}
eC([
  Zt.dispose()
], $h.prototype, "dispose", null);
class nC {
  constructor() {
    this.cells = [];
  }
  copy(t, e, n = {}) {
    this.options = Object.assign({}, n);
    const r = (ie.isModel(e) ? e : e.model).cloneSubGraph(t, n);
    this.cells = Oo(Object.keys(r).map((o) => r[o]), (o) => o.isEdge() ? 2 : 1), this.serialize(n);
  }
  cut(t, e, n = {}) {
    this.copy(t, e, n), (j.isGraph(e) ? e.model : e).batchUpdate("cut", () => {
      t.forEach((r) => r.remove());
    });
  }
  paste(t, e = {}) {
    const n = Object.assign(Object.assign({}, this.options), e), { offset: s, edgeProps: r, nodeProps: o } = n;
    let a = 20, l = 20;
    s && (a = typeof s == "number" ? s : s.dx, l = typeof s == "number" ? s : s.dy), this.deserialize(n);
    const c = this.cells;
    c.forEach((h) => {
      h.model = null, h.removeProp("zIndex"), (a || l) && h.translate(a, l), o && h.isNode() && h.prop(o), r && h.isEdge() && h.prop(r);
    });
    const u = j.isGraph(t) ? t.model : t;
    return u.batchUpdate("paste", () => {
      u.addCells(this.cells);
    }), this.copy(c, t, e), c;
  }
  serialize(t) {
    t.useLocalStorage !== !1 && Di.save(this.cells);
  }
  deserialize(t) {
    if (t.useLocalStorage) {
      const e = Di.fetch();
      e && (this.cells = e);
    }
  }
  isEmpty(t = {}) {
    return t.useLocalStorage && this.deserialize(t), this.cells.length <= 0;
  }
  clean() {
    this.options = {}, this.cells = [], Di.clean();
  }
}
var Di;
(function(i) {
  const t = `${fe.prefixCls}.clipboard.cells`;
  function e(r) {
    if (window.localStorage) {
      const o = r.map((a) => a.toJSON());
      localStorage.setItem(t, JSON.stringify(o));
    }
  }
  i.save = e;
  function n() {
    if (window.localStorage) {
      const r = localStorage.getItem(t), o = r ? JSON.parse(r) : [];
      if (o)
        return ie.fromJSON(o);
    }
  }
  i.fetch = n;
  function s() {
    window.localStorage && localStorage.removeItem(t);
  }
  i.clean = s;
})(Di || (Di = {}));
j.prototype.isClipboardEnabled = function() {
  const i = this.getPlugin("clipboard");
  return i ? i.isEnabled() : !1;
};
j.prototype.enableClipboard = function() {
  const i = this.getPlugin("clipboard");
  return i && i.enable(), this;
};
j.prototype.disableClipboard = function() {
  const i = this.getPlugin("clipboard");
  return i && i.disable(), this;
};
j.prototype.toggleClipboard = function(i) {
  const t = this.getPlugin("clipboard");
  return t && t.toggleEnabled(i), this;
};
j.prototype.isClipboardEmpty = function(i) {
  const t = this.getPlugin("clipboard");
  return t ? t.isEmpty(i) : !0;
};
j.prototype.getCellsInClipboard = function() {
  const i = this.getPlugin("clipboard");
  return i ? i.getCellsInClipboard() : [];
};
j.prototype.cleanClipboard = function() {
  const i = this.getPlugin("clipboard");
  return i && i.clean(), this;
};
j.prototype.copy = function(i, t) {
  const e = this.getPlugin("clipboard");
  return e && e.copy(i, t), this;
};
j.prototype.cut = function(i, t) {
  const e = this.getPlugin("clipboard");
  return e && e.cut(i, t), this;
};
j.prototype.paste = function(i, t) {
  const e = this.getPlugin("clipboard");
  return e ? e.paste(i, t) : [];
};
var iC = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
}, sC = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
};
class Bh extends Nt {
  get disabled() {
    return this.options.enabled !== !0;
  }
  get cells() {
    return this.clipboardImpl.cells;
  }
  constructor(t = {}) {
    super(), this.name = "clipboard", this.options = Object.assign({ enabled: !0 }, t);
  }
  init(t) {
    this.graph = t, this.clipboardImpl = new nC(), this.clipboardImpl.deserialize(this.options);
  }
  // #region api
  isEnabled() {
    return !this.disabled;
  }
  enable() {
    this.disabled && (this.options.enabled = !0);
  }
  disable() {
    this.disabled || (this.options.enabled = !1);
  }
  toggleEnabled(t) {
    return t != null ? t !== this.isEnabled() && (t ? this.enable() : this.disable()) : this.isEnabled() ? this.disable() : this.enable(), this;
  }
  isEmpty(t = {}) {
    return this.clipboardImpl.isEmpty(t);
  }
  getCellsInClipboard() {
    return this.cells;
  }
  clean(t) {
    return (!this.disabled || t) && (this.clipboardImpl.clean(), this.notify("clipboard:changed", { cells: [] })), this;
  }
  copy(t, e = {}) {
    return this.disabled || (this.clipboardImpl.copy(t, this.graph, Object.assign(Object.assign({}, this.commonOptions), e)), this.notify("clipboard:changed", { cells: t })), this;
  }
  cut(t, e = {}) {
    return this.disabled || (this.clipboardImpl.cut(t, this.graph, Object.assign(Object.assign({}, this.commonOptions), e)), this.notify("clipboard:changed", { cells: t })), this;
  }
  paste(t = {}, e = this.graph) {
    return this.disabled ? [] : this.clipboardImpl.paste(e, Object.assign(Object.assign({}, this.commonOptions), t));
  }
  // #endregion
  get commonOptions() {
    const t = this.options, { enabled: e } = t;
    return sC(t, ["enabled"]);
  }
  notify(t, e) {
    this.trigger(t, e), this.graph.trigger(t, e);
  }
  dispose() {
    this.clean(!0), this.off();
  }
}
iC([
  Nt.dispose()
], Bh.prototype, "dispose", null);
const rC = `.x6-widget-dnd {
  position: absolute;
  top: -10000px;
  left: -10000px;
  z-index: 999999;
  display: none;
  cursor: move;
  opacity: 0.7;
  pointer-events: 'cursor';
}
.x6-widget-dnd.dragging {
  display: inline-block;
}
.x6-widget-dnd.dragging * {
  pointer-events: none !important;
}
.x6-widget-dnd .x6-graph {
  background: transparent;
  box-shadow: none;
}
`;
var oC = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
};
class Sn extends rt {
  get targetScroller() {
    return this.options.target.getPlugin("scroller");
  }
  get targetGraph() {
    return this.options.target;
  }
  get targetModel() {
    return this.targetGraph.model;
  }
  get snapline() {
    return this.options.target.getPlugin("snapline");
  }
  constructor(t) {
    super(), this.name = "dnd", this.options = Object.assign(Object.assign({}, Sn.defaults), t), this.init();
  }
  init() {
    nr(this.name, rC), this.container = document.createElement("div"), U(this.container, this.prefixClassName("widget-dnd")), this.draggingGraph = new j(Object.assign(Object.assign({}, this.options.delegateGraphOptions), { container: document.createElement("div"), width: 1, height: 1, async: !1 })), Mn(this.container, this.draggingGraph.container);
  }
  start(t, e) {
    const n = e;
    n.preventDefault(), this.targetModel.startBatch("dnd"), U(this.container, "dragging"), Ni(this.container, this.options.draggingContainer || document.body), this.sourceNode = t, this.prepareDragging(t, n.clientX, n.clientY);
    const s = this.updateNodePosition(n.clientX, n.clientY);
    this.isSnaplineEnabled() && (this.snapline.captureCursorOffset({
      e: n,
      node: t,
      cell: t,
      view: this.draggingView,
      x: s.x,
      y: s.y
    }), this.draggingNode.on("change:position", this.snap, this)), this.delegateDocumentEvents(Sn.documentEvents, n.data);
  }
  isSnaplineEnabled() {
    return this.snapline && this.snapline.isEnabled();
  }
  prepareDragging(t, e, n) {
    const s = this.draggingGraph, r = s.model, o = this.options.getDragNode(t, {
      sourceNode: t,
      draggingGraph: s,
      targetGraph: this.targetGraph
    });
    o.position(0, 0);
    let a = 5;
    if (this.isSnaplineEnabled() && (a += this.snapline.options.tolerance || 0), this.isSnaplineEnabled() || this.options.scaled) {
      const u = this.targetGraph.transform.getScale();
      s.scale(u.sx, u.sy), a *= Math.max(u.sx, u.sy);
    } else
      s.scale(1, 1);
    this.clearDragging(), r.resetCells([o]);
    const l = s.findViewByCell(o);
    l.undelegateEvents(), l.cell.off("changed"), s.fitToContent({
      padding: a,
      allowNewOrigin: "any",
      useCellGeometry: !1
    });
    const c = l.getBBox();
    this.geometryBBox = l.getBBox({ useCellGeometry: !0 }), this.delta = this.geometryBBox.getTopLeft().diff(c.getTopLeft()), this.draggingNode = o, this.draggingView = l, this.draggingBBox = o.getBBox(), this.padding = a, this.originOffset = this.updateGraphPosition(e, n);
  }
  updateGraphPosition(t, e) {
    const n = document.body.scrollTop || document.documentElement.scrollTop, s = document.body.scrollLeft || document.documentElement.scrollLeft, r = this.delta, o = this.geometryBBox, a = this.padding || 5, l = {
      left: t - r.x - o.width / 2 - a + s,
      top: e - r.y - o.height / 2 - a + n
    };
    return this.draggingGraph && $t(this.container, {
      left: `${l.left}px`,
      top: `${l.top}px`
    }), l;
  }
  updateNodePosition(t, e) {
    const n = this.targetGraph.clientToLocal(t, e), s = this.draggingBBox;
    return n.x -= s.width / 2, n.y -= s.height / 2, this.draggingNode.position(n.x, n.y), n;
  }
  snap({ cell: t, current: e, options: n }) {
    const s = t;
    if (n.snapped) {
      const r = this.draggingBBox;
      s.position(r.x + n.tx, r.y + n.ty, { silent: !0 }), this.draggingView.translate(), s.position(e.x, e.y, { silent: !0 }), this.snapOffset = {
        x: n.tx,
        y: n.ty
      };
    } else
      this.snapOffset = null;
  }
  onDragging(t) {
    const e = this.draggingView;
    if (e) {
      t.preventDefault();
      const n = this.normalizeEvent(t), s = n.clientX, r = n.clientY;
      this.updateGraphPosition(s, r);
      const o = this.updateNodePosition(s, r), a = this.targetGraph.options.embedding.enabled, l = (a || this.isSnaplineEnabled()) && this.isInsideValidArea({
        x: s,
        y: r
      });
      if (a) {
        e.setEventData(n, {
          graph: this.targetGraph,
          candidateEmbedView: this.candidateEmbedView
        });
        const c = e.getEventData(n);
        l ? e.processEmbedding(n, c) : e.clearEmbedding(c), this.candidateEmbedView = c.candidateEmbedView;
      }
      this.isSnaplineEnabled() && (l ? this.snapline.snapOnMoving({
        e: n,
        view: e,
        x: o.x,
        y: o.y
      }) : this.snapline.hide());
    }
  }
  onDragEnd(t) {
    const e = this.draggingNode;
    if (e) {
      const n = this.normalizeEvent(t), s = this.draggingView, r = this.draggingBBox, o = this.snapOffset;
      let a = r.x, l = r.y;
      o && (a += o.x, l += o.y), e.position(a, l, { silent: !0 });
      const c = this.drop(e, { x: n.clientX, y: n.clientY }), u = (h) => {
        h ? (this.onDropped(e), this.targetGraph.options.embedding.enabled && s && (s.setEventData(n, {
          cell: h,
          graph: this.targetGraph,
          candidateEmbedView: this.candidateEmbedView
        }), s.finalizeEmbedding(n, s.getEventData(n)))) : this.onDropInvalid(), this.candidateEmbedView = null, this.targetModel.stopBatch("dnd");
      };
      Xr(c) ? (this.undelegateDocumentEvents(), c.then(u)) : u(c);
    }
  }
  clearDragging() {
    this.draggingNode && (this.sourceNode = null, this.draggingNode.remove(), this.draggingNode = null, this.draggingView = null, this.delta = null, this.padding = null, this.snapOffset = null, this.originOffset = null, this.undelegateDocumentEvents());
  }
  onDropped(t) {
    this.draggingNode === t && (this.clearDragging(), Jt(this.container, "dragging"), Te(this.container));
  }
  onDropInvalid() {
    const t = this.draggingNode;
    t && this.onDropped(t);
  }
  isInsideValidArea(t) {
    let e, n = null;
    const s = this.targetGraph, r = this.targetScroller;
    this.options.dndContainer && (n = this.getDropArea(this.options.dndContainer));
    const o = n && n.containsPoint(t);
    if (r)
      if (r.options.autoResize)
        e = this.getDropArea(r.container);
      else {
        const a = this.getDropArea(r.container);
        e = this.getDropArea(s.container).intersectsWithRect(a);
      }
    else
      e = this.getDropArea(s.container);
    return !o && e && e.containsPoint(t);
  }
  getDropArea(t) {
    const e = to(t), n = document.body.scrollTop || document.documentElement.scrollTop, s = document.body.scrollLeft || document.documentElement.scrollLeft;
    return R.create({
      x: e.left + parseInt($t(t, "border-left-width"), 10) - s,
      y: e.top + parseInt($t(t, "border-top-width"), 10) - n,
      width: t.clientWidth,
      height: t.clientHeight
    });
  }
  drop(t, e) {
    if (this.isInsideValidArea(e)) {
      const n = this.targetGraph, s = n.model, r = n.clientToLocal(e), o = this.sourceNode, a = this.options.getDropNode(t, {
        sourceNode: o,
        draggingNode: t,
        targetGraph: this.targetGraph,
        draggingGraph: this.draggingGraph
      }), l = a.getBBox();
      r.x += l.x - l.width / 2, r.y += l.y - l.height / 2;
      const c = this.snapOffset ? 1 : n.getGridSize();
      a.position(ct.snapToGrid(r.x, c), ct.snapToGrid(r.y, c)), a.removeZIndex();
      const u = this.options.validateNode, h = u ? u(a, {
        sourceNode: o,
        draggingNode: t,
        droppingNode: a,
        targetGraph: n,
        draggingGraph: this.draggingGraph
      }) : !0;
      return typeof h == "boolean" ? h ? (s.addCell(a, { stencil: this.cid }), a) : null : $v(h).then((d) => d ? (s.addCell(a, { stencil: this.cid }), a) : null);
    }
    return null;
  }
  onRemove() {
    this.draggingGraph && (this.draggingGraph.view.remove(), this.draggingGraph.dispose());
  }
  dispose() {
    this.remove(), ir(this.name);
  }
}
oC([
  rt.dispose()
], Sn.prototype, "dispose", null);
(function(i) {
  i.defaults = {
    // animation: false,
    getDragNode: (t) => t.clone(),
    getDropNode: (t) => t.clone()
  }, i.documentEvents = {
    mousemove: "onDragging",
    touchmove: "onDragging",
    mouseup: "onDragEnd",
    touchend: "onDragEnd",
    touchcancel: "onDragEnd"
  };
})(Sn || (Sn = {}));
var aC = "\0", fn = "\0", yl = "";
let lC = class {
  constructor(t) {
    at(this, "_isDirected", !0);
    at(this, "_isMultigraph", !1);
    at(this, "_isCompound", !1);
    // Label for the graph itself
    at(this, "_label");
    // Defaults to be set when creating a new node
    at(this, "_defaultNodeLabelFn", () => {
    });
    // Defaults to be set when creating a new edge
    at(this, "_defaultEdgeLabelFn", () => {
    });
    // v -> label
    at(this, "_nodes", {});
    // v -> edgeObj
    at(this, "_in", {});
    // u -> v -> Number
    at(this, "_preds", {});
    // v -> edgeObj
    at(this, "_out", {});
    // v -> w -> Number
    at(this, "_sucs", {});
    // e -> edgeObj
    at(this, "_edgeObjs", {});
    // e -> label
    at(this, "_edgeLabels", {});
    /* Number of nodes in the graph. Should only be changed by the implementation. */
    at(this, "_nodeCount", 0);
    /* Number of edges in the graph. Should only be changed by the implementation. */
    at(this, "_edgeCount", 0);
    at(this, "_parent");
    at(this, "_children");
    t && (this._isDirected = Object.hasOwn(t, "directed") ? t.directed : !0, this._isMultigraph = Object.hasOwn(t, "multigraph") ? t.multigraph : !1, this._isCompound = Object.hasOwn(t, "compound") ? t.compound : !1), this._isCompound && (this._parent = {}, this._children = {}, this._children[fn] = {});
  }
  /* === Graph functions ========= */
  /**
   * Whether graph was created with 'directed' flag set to true or not.
   */
  isDirected() {
    return this._isDirected;
  }
  /**
   * Whether graph was created with 'multigraph' flag set to true or not.
   */
  isMultigraph() {
    return this._isMultigraph;
  }
  /**
   * Whether graph was created with 'compound' flag set to true or not.
   */
  isCompound() {
    return this._isCompound;
  }
  /**
   * Sets the label of the graph.
   */
  setGraph(t) {
    return this._label = t, this;
  }
  /**
   * Gets the graph label.
   */
  graph() {
    return this._label;
  }
  /* === Node functions ========== */
  /**
   * Sets the default node label. If newDefault is a function, it will be
   * invoked ach time when setting a label for a node. Otherwise, this label
   * will be assigned as default label in case if no label was specified while
   * setting a node.
   * Complexity: O(1).
   */
  setDefaultNodeLabel(t) {
    return this._defaultNodeLabelFn = t, typeof t != "function" && (this._defaultNodeLabelFn = () => t), this;
  }
  /**
   * Gets the number of nodes in the graph.
   * Complexity: O(1).
   */
  nodeCount() {
    return this._nodeCount;
  }
  /**
   * Gets all nodes of the graph. Note, the in case of compound graph subnodes are
   * not included in list.
   * Complexity: O(1).
   */
  nodes() {
    return Object.keys(this._nodes);
  }
  /**
   * Gets list of nodes without in-edges.
   * Complexity: O(|V|).
   */
  sources() {
    var t = this;
    return this.nodes().filter((e) => Object.keys(t._in[e]).length === 0);
  }
  /**
   * Gets list of nodes without out-edges.
   * Complexity: O(|V|).
   */
  sinks() {
    var t = this;
    return this.nodes().filter((e) => Object.keys(t._out[e]).length === 0);
  }
  /**
   * Invokes setNode method for each node in names list.
   * Complexity: O(|names|).
   */
  setNodes(t, e) {
    var n = arguments, s = this;
    return t.forEach(function(r) {
      n.length > 1 ? s.setNode(r, e) : s.setNode(r);
    }), this;
  }
  /**
   * Creates or updates the value for the node v in the graph. If label is supplied
   * it is set as the value for the node. If label is not supplied and the node was
   * created by this call then the default node label will be assigned.
   * Complexity: O(1).
   */
  setNode(t, e) {
    return Object.hasOwn(this._nodes, t) ? (arguments.length > 1 && (this._nodes[t] = e), this) : (this._nodes[t] = arguments.length > 1 ? e : this._defaultNodeLabelFn(t), this._isCompound && (this._parent[t] = fn, this._children[t] = {}, this._children[fn][t] = !0), this._in[t] = {}, this._preds[t] = {}, this._out[t] = {}, this._sucs[t] = {}, ++this._nodeCount, this);
  }
  /**
   * Gets the label of node with specified name.
   * Complexity: O(|V|).
   */
  node(t) {
    return this._nodes[t];
  }
  /**
   * Detects whether graph has a node with specified name or not.
   */
  hasNode(t) {
    return Object.hasOwn(this._nodes, t);
  }
  /**
   * Remove the node with the name from the graph or do nothing if the node is not in
   * the graph. If the node was removed this function also removes any incident
   * edges.
   * Complexity: O(1).
   */
  removeNode(t) {
    var e = this;
    if (Object.hasOwn(this._nodes, t)) {
      var n = (s) => e.removeEdge(e._edgeObjs[s]);
      delete this._nodes[t], this._isCompound && (this._removeFromParentsChildList(t), delete this._parent[t], this.children(t).forEach(function(s) {
        e.setParent(s);
      }), delete this._children[t]), Object.keys(this._in[t]).forEach(n), delete this._in[t], delete this._preds[t], Object.keys(this._out[t]).forEach(n), delete this._out[t], delete this._sucs[t], --this._nodeCount;
    }
    return this;
  }
  /**
   * Sets node p as a parent for node v if it is defined, or removes the
   * parent for v if p is undefined. Method throws an exception in case of
   * invoking it in context of noncompound graph.
   * Average-case complexity: O(1).
   */
  setParent(t, e) {
    if (!this._isCompound)
      throw new Error("Cannot set parent in a non-compound graph");
    if (e === void 0)
      e = fn;
    else {
      e += "";
      for (var n = e; n !== void 0; n = this.parent(n))
        if (n === t)
          throw new Error("Setting " + e + " as parent of " + t + " would create a cycle");
      this.setNode(e);
    }
    return this.setNode(t), this._removeFromParentsChildList(t), this._parent[t] = e, this._children[e][t] = !0, this;
  }
  _removeFromParentsChildList(t) {
    delete this._children[this._parent[t]][t];
  }
  /**
   * Gets parent node for node v.
   * Complexity: O(1).
   */
  parent(t) {
    if (this._isCompound) {
      var e = this._parent[t];
      if (e !== fn)
        return e;
    }
  }
  /**
   * Gets list of direct children of node v.
   * Complexity: O(1).
   */
  children(t = fn) {
    if (this._isCompound) {
      var e = this._children[t];
      if (e)
        return Object.keys(e);
    } else {
      if (t === fn)
        return this.nodes();
      if (this.hasNode(t))
        return [];
    }
  }
  /**
   * Return all nodes that are predecessors of the specified node or undefined if node v is not in
   * the graph. Behavior is undefined for undirected graphs - use neighbors instead.
   * Complexity: O(|V|).
   */
  predecessors(t) {
    var e = this._preds[t];
    if (e)
      return Object.keys(e);
  }
  /**
   * Return all nodes that are successors of the specified node or undefined if node v is not in
   * the graph. Behavior is undefined for undirected graphs - use neighbors instead.
   * Complexity: O(|V|).
   */
  successors(t) {
    var e = this._sucs[t];
    if (e)
      return Object.keys(e);
  }
  /**
   * Return all nodes that are predecessors or successors of the specified node or undefined if
   * node v is not in the graph.
   * Complexity: O(|V|).
   */
  neighbors(t) {
    var e = this.predecessors(t);
    if (e) {
      const s = new Set(e);
      for (var n of this.successors(t))
        s.add(n);
      return Array.from(s.values());
    }
  }
  isLeaf(t) {
    var e;
    return this.isDirected() ? e = this.successors(t) : e = this.neighbors(t), e.length === 0;
  }
  /**
   * Creates new graph with nodes filtered via filter. Edges incident to rejected node
   * are also removed. In case of compound graph, if parent is rejected by filter,
   * than all its children are rejected too.
   * Average-case complexity: O(|E|+|V|).
   */
  filterNodes(t) {
    var e = new this.constructor({
      directed: this._isDirected,
      multigraph: this._isMultigraph,
      compound: this._isCompound
    });
    e.setGraph(this.graph());
    var n = this;
    Object.entries(this._nodes).forEach(function([o, a]) {
      t(o) && e.setNode(o, a);
    }), Object.values(this._edgeObjs).forEach(function(o) {
      e.hasNode(o.v) && e.hasNode(o.w) && e.setEdge(o, n.edge(o));
    });
    var s = {};
    function r(o) {
      var a = n.parent(o);
      return a === void 0 || e.hasNode(a) ? (s[o] = a, a) : a in s ? s[a] : r(a);
    }
    return this._isCompound && e.nodes().forEach((o) => e.setParent(o, r(o))), e;
  }
  /* === Edge functions ========== */
  /**
   * Sets the default edge label or factory function. This label will be
   * assigned as default label in case if no label was specified while setting
   * an edge or this function will be invoked each time when setting an edge
   * with no label specified and returned value * will be used as a label for edge.
   * Complexity: O(1).
   */
  setDefaultEdgeLabel(t) {
    return this._defaultEdgeLabelFn = t, typeof t != "function" && (this._defaultEdgeLabelFn = () => t), this;
  }
  /**
   * Gets the number of edges in the graph.
   * Complexity: O(1).
   */
  edgeCount() {
    return this._edgeCount;
  }
  /**
   * Gets edges of the graph. In case of compound graph subgraphs are not considered.
   * Complexity: O(|E|).
   */
  edges() {
    return Object.values(this._edgeObjs);
  }
  /**
   * Establish an edges path over the nodes in nodes list. If some edge is already
   * exists, it will update its label, otherwise it will create an edge between pair
   * of nodes with label provided or default label if no label provided.
   * Complexity: O(|nodes|).
   */
  setPath(t, e) {
    var n = this, s = arguments;
    return t.reduce(function(r, o) {
      return s.length > 1 ? n.setEdge(r, o, e) : n.setEdge(r, o), o;
    }), this;
  }
  /**
   * Creates or updates the label for the edge (v, w) with the optionally supplied
   * name. If label is supplied it is set as the value for the edge. If label is not
   * supplied and the edge was created by this call then the default edge label will
   * be assigned. The name parameter is only useful with multigraphs.
   */
  setEdge() {
    var t, e, n, s, r = !1, o = arguments[0];
    typeof o == "object" && o !== null && "v" in o ? (t = o.v, e = o.w, n = o.name, arguments.length === 2 && (s = arguments[1], r = !0)) : (t = o, e = arguments[1], n = arguments[3], arguments.length > 2 && (s = arguments[2], r = !0)), t = "" + t, e = "" + e, n !== void 0 && (n = "" + n);
    var a = Pi(this._isDirected, t, e, n);
    if (Object.hasOwn(this._edgeLabels, a))
      return r && (this._edgeLabels[a] = s), this;
    if (n !== void 0 && !this._isMultigraph)
      throw new Error("Cannot set a named edge when isMultigraph = false");
    this.setNode(t), this.setNode(e), this._edgeLabels[a] = r ? s : this._defaultEdgeLabelFn(t, e, n);
    var l = cC(this._isDirected, t, e, n);
    return t = l.v, e = l.w, Object.freeze(l), this._edgeObjs[a] = l, vl(this._preds[e], t), vl(this._sucs[t], e), this._in[e][a] = l, this._out[t][a] = l, this._edgeCount++, this;
  }
  /**
   * Gets the label for the specified edge.
   * Complexity: O(1).
   */
  edge(t, e, n) {
    var s = arguments.length === 1 ? Mr(this._isDirected, arguments[0]) : Pi(this._isDirected, t, e, n);
    return this._edgeLabels[s];
  }
  /**
   * Gets the label for the specified edge and converts it to an object.
   * Complexity: O(1)
   */
  edgeAsObj() {
    const t = this.edge(...arguments);
    return typeof t != "object" ? { label: t } : t;
  }
  /**
   * Detects whether the graph contains specified edge or not. No subgraphs are considered.
   * Complexity: O(1).
   */
  hasEdge(t, e, n) {
    var s = arguments.length === 1 ? Mr(this._isDirected, arguments[0]) : Pi(this._isDirected, t, e, n);
    return Object.hasOwn(this._edgeLabels, s);
  }
  /**
   * Removes the specified edge from the graph. No subgraphs are considered.
   * Complexity: O(1).
   */
  removeEdge(t, e, n) {
    var s = arguments.length === 1 ? Mr(this._isDirected, arguments[0]) : Pi(this._isDirected, t, e, n), r = this._edgeObjs[s];
    return r && (t = r.v, e = r.w, delete this._edgeLabels[s], delete this._edgeObjs[s], wl(this._preds[e], t), wl(this._sucs[t], e), delete this._in[e][s], delete this._out[t][s], this._edgeCount--), this;
  }
  /**
   * Return all edges that point to the node v. Optionally filters those edges down to just those
   * coming from node u. Behavior is undefined for undirected graphs - use nodeEdges instead.
   * Complexity: O(|E|).
   */
  inEdges(t, e) {
    var n = this._in[t];
    if (n) {
      var s = Object.values(n);
      return e ? s.filter((r) => r.v === e) : s;
    }
  }
  /**
   * Return all edges that are pointed at by node v. Optionally filters those edges down to just
   * those point to w. Behavior is undefined for undirected graphs - use nodeEdges instead.
   * Complexity: O(|E|).
   */
  outEdges(t, e) {
    var n = this._out[t];
    if (n) {
      var s = Object.values(n);
      return e ? s.filter((r) => r.w === e) : s;
    }
  }
  /**
   * Returns all edges to or from node v regardless of direction. Optionally filters those edges
   * down to just those between nodes v and w regardless of direction.
   * Complexity: O(|E|).
   */
  nodeEdges(t, e) {
    var n = this.inEdges(t, e);
    if (n)
      return n.concat(this.outEdges(t, e));
  }
};
function vl(i, t) {
  i[t] ? i[t]++ : i[t] = 1;
}
function wl(i, t) {
  --i[t] || delete i[t];
}
function Pi(i, t, e, n) {
  var s = "" + t, r = "" + e;
  if (!i && s > r) {
    var o = s;
    s = r, r = o;
  }
  return s + yl + r + yl + (n === void 0 ? aC : n);
}
function cC(i, t, e, n) {
  var s = "" + t, r = "" + e;
  if (!i && s > r) {
    var o = s;
    s = r, r = o;
  }
  var a = { v: s, w: r };
  return n && (a.name = n), a;
}
function Mr(i, t) {
  return Pi(i, t.v, t.w, t.name);
}
var Jo = lC, uC = "2.2.4", hC = {
  Graph: Jo,
  version: uC
}, dC = Jo, fC = {
  write: gC,
  read: bC
};
function gC(i) {
  var t = {
    options: {
      directed: i.isDirected(),
      multigraph: i.isMultigraph(),
      compound: i.isCompound()
    },
    nodes: pC(i),
    edges: mC(i)
  };
  return i.graph() !== void 0 && (t.value = structuredClone(i.graph())), t;
}
function pC(i) {
  return i.nodes().map(function(t) {
    var e = i.node(t), n = i.parent(t), s = { v: t };
    return e !== void 0 && (s.value = e), n !== void 0 && (s.parent = n), s;
  });
}
function mC(i) {
  return i.edges().map(function(t) {
    var e = i.edge(t), n = { v: t.v, w: t.w };
    return t.name !== void 0 && (n.name = t.name), e !== void 0 && (n.value = e), n;
  });
}
function bC(i) {
  var t = new dC(i.options).setGraph(i.value);
  return i.nodes.forEach(function(e) {
    t.setNode(e.v, e.value), e.parent && t.setParent(e.v, e.parent);
  }), i.edges.forEach(function(e) {
    t.setEdge({ v: e.v, w: e.w, name: e.name }, e.value);
  }), t;
}
var yC = vC;
function vC(i) {
  var t = {}, e = [], n;
  function s(r) {
    Object.hasOwn(t, r) || (t[r] = !0, n.push(r), i.successors(r).forEach(s), i.predecessors(r).forEach(s));
  }
  return i.nodes().forEach(function(r) {
    n = [], s(r), n.length && e.push(n);
  }), e;
}
let wC = class {
  constructor() {
    at(this, "_arr", []);
    at(this, "_keyIndices", {});
  }
  /**
   * Returns the number of elements in the queue. Takes `O(1)` time.
   */
  size() {
    return this._arr.length;
  }
  /**
   * Returns the keys that are in the queue. Takes `O(n)` time.
   */
  keys() {
    return this._arr.map(function(t) {
      return t.key;
    });
  }
  /**
   * Returns `true` if **key** is in the queue and `false` if not.
   */
  has(t) {
    return Object.hasOwn(this._keyIndices, t);
  }
  /**
   * Returns the priority for **key**. If **key** is not present in the queue
   * then this function returns `undefined`. Takes `O(1)` time.
   *
   * @param {Object} key
   */
  priority(t) {
    var e = this._keyIndices[t];
    if (e !== void 0)
      return this._arr[e].priority;
  }
  /**
   * Returns the key for the minimum element in this queue. If the queue is
   * empty this function throws an Error. Takes `O(1)` time.
   */
  min() {
    if (this.size() === 0)
      throw new Error("Queue underflow");
    return this._arr[0].key;
  }
  /**
   * Inserts a new key into the priority queue. If the key already exists in
   * the queue this function returns `false`; otherwise it will return `true`.
   * Takes `O(n)` time.
   *
   * @param {Object} key the key to add
   * @param {Number} priority the initial priority for the key
   */
  add(t, e) {
    var n = this._keyIndices;
    if (t = String(t), !Object.hasOwn(n, t)) {
      var s = this._arr, r = s.length;
      return n[t] = r, s.push({ key: t, priority: e }), this._decrease(r), !0;
    }
    return !1;
  }
  /**
   * Removes and returns the smallest key in the queue. Takes `O(log n)` time.
   */
  removeMin() {
    this._swap(0, this._arr.length - 1);
    var t = this._arr.pop();
    return delete this._keyIndices[t.key], this._heapify(0), t.key;
  }
  /**
   * Decreases the priority for **key** to **priority**. If the new priority is
   * greater than the previous priority, this function will throw an Error.
   *
   * @param {Object} key the key for which to raise priority
   * @param {Number} priority the new priority for the key
   */
  decrease(t, e) {
    var n = this._keyIndices[t];
    if (e > this._arr[n].priority)
      throw new Error("New priority is greater than current priority. Key: " + t + " Old: " + this._arr[n].priority + " New: " + e);
    this._arr[n].priority = e, this._decrease(n);
  }
  _heapify(t) {
    var e = this._arr, n = 2 * t, s = n + 1, r = t;
    n < e.length && (r = e[n].priority < e[r].priority ? n : r, s < e.length && (r = e[s].priority < e[r].priority ? s : r), r !== t && (this._swap(t, r), this._heapify(r)));
  }
  _decrease(t) {
    for (var e = this._arr, n = e[t].priority, s; t !== 0 && (s = t >> 1, !(e[s].priority < n)); )
      this._swap(t, s), t = s;
  }
  _swap(t, e) {
    var n = this._arr, s = this._keyIndices, r = n[t], o = n[e];
    n[t] = o, n[e] = r, s[o.key] = t, s[r.key] = e;
  }
};
var zh = wC, xC = zh, Vh = CC, EC = () => 1;
function CC(i, t, e, n) {
  return SC(
    i,
    String(t),
    e || EC,
    n || function(s) {
      return i.outEdges(s);
    }
  );
}
function SC(i, t, e, n) {
  var s = {}, r = new xC(), o, a, l = function(c) {
    var u = c.v !== o ? c.v : c.w, h = s[u], d = e(c), f = a.distance + d;
    if (d < 0)
      throw new Error("dijkstra does not allow negative edge weights. Bad edge: " + c + " Weight: " + d);
    f < h.distance && (h.distance = f, h.predecessor = o, r.decrease(u, f));
  };
  for (i.nodes().forEach(function(c) {
    var u = c === t ? 0 : Number.POSITIVE_INFINITY;
    s[c] = { distance: u }, r.add(c, u);
  }); r.size() > 0 && (o = r.removeMin(), a = s[o], a.distance !== Number.POSITIVE_INFINITY); )
    n(o).forEach(l);
  return s;
}
var PC = Vh, OC = AC;
function AC(i, t, e) {
  return i.nodes().reduce(function(n, s) {
    return n[s] = PC(i, s, t, e), n;
  }, {});
}
var Fh = MC;
function MC(i) {
  var t = 0, e = [], n = {}, s = [];
  function r(o) {
    var a = n[o] = {
      onStack: !0,
      lowlink: t,
      index: t++
    };
    if (e.push(o), i.successors(o).forEach(function(u) {
      Object.hasOwn(n, u) ? n[u].onStack && (a.lowlink = Math.min(a.lowlink, n[u].index)) : (r(u), a.lowlink = Math.min(a.lowlink, n[u].lowlink));
    }), a.lowlink === a.index) {
      var l = [], c;
      do
        c = e.pop(), n[c].onStack = !1, l.push(c);
      while (o !== c);
      s.push(l);
    }
  }
  return i.nodes().forEach(function(o) {
    Object.hasOwn(n, o) || r(o);
  }), s;
}
var TC = Fh, NC = IC;
function IC(i) {
  return TC(i).filter(function(t) {
    return t.length > 1 || t.length === 1 && i.hasEdge(t[0], t[0]);
  });
}
var jC = kC, LC = () => 1;
function kC(i, t, e) {
  return RC(
    i,
    t || LC,
    e || function(n) {
      return i.outEdges(n);
    }
  );
}
function RC(i, t, e) {
  var n = {}, s = i.nodes();
  return s.forEach(function(r) {
    n[r] = {}, n[r][r] = { distance: 0 }, s.forEach(function(o) {
      r !== o && (n[r][o] = { distance: Number.POSITIVE_INFINITY });
    }), e(r).forEach(function(o) {
      var a = o.v === r ? o.w : o.v, l = t(o);
      n[r][a] = { distance: l, predecessor: r };
    });
  }), s.forEach(function(r) {
    var o = n[r];
    s.forEach(function(a) {
      var l = n[a];
      s.forEach(function(c) {
        var u = l[r], h = o[c], d = l[c], f = u.distance + h.distance;
        f < d.distance && (d.distance = f, d.predecessor = h.predecessor);
      });
    });
  }), n;
}
function Gh(i) {
  var t = {}, e = {}, n = [];
  function s(r) {
    if (Object.hasOwn(e, r))
      throw new lo();
    Object.hasOwn(t, r) || (e[r] = !0, t[r] = !0, i.predecessors(r).forEach(s), delete e[r], n.push(r));
  }
  if (i.sinks().forEach(s), Object.keys(t).length !== i.nodeCount())
    throw new lo();
  return n;
}
class lo extends Error {
  constructor() {
    super(...arguments);
  }
}
var Hh = Gh;
Gh.CycleException = lo;
var xl = Hh, DC = _C;
function _C(i) {
  try {
    xl(i);
  } catch (t) {
    if (t instanceof xl.CycleException)
      return !1;
    throw t;
  }
  return !0;
}
var qh = $C;
function $C(i, t, e) {
  Array.isArray(t) || (t = [t]);
  var n = i.isDirected() ? (a) => i.successors(a) : (a) => i.neighbors(a), s = e === "post" ? BC : zC, r = [], o = {};
  return t.forEach((a) => {
    if (!i.hasNode(a))
      throw new Error("Graph does not have node: " + a);
    s(a, n, o, r);
  }), r;
}
function BC(i, t, e, n) {
  for (var s = [[i, !1]]; s.length > 0; ) {
    var r = s.pop();
    r[1] ? n.push(r[0]) : Object.hasOwn(e, r[0]) || (e[r[0]] = !0, s.push([r[0], !0]), Uh(t(r[0]), (o) => s.push([o, !1])));
  }
}
function zC(i, t, e, n) {
  for (var s = [i]; s.length > 0; ) {
    var r = s.pop();
    Object.hasOwn(e, r) || (e[r] = !0, n.push(r), Uh(t(r), (o) => s.push(o)));
  }
}
function Uh(i, t) {
  for (var e = i.length; e--; )
    t(i[e], e, i);
  return i;
}
var VC = qh, FC = GC;
function GC(i, t) {
  return VC(i, t, "post");
}
var HC = qh, qC = UC;
function UC(i, t) {
  return HC(i, t, "pre");
}
var WC = Jo, XC = zh, YC = JC;
function JC(i, t) {
  var e = new WC(), n = {}, s = new XC(), r;
  function o(l) {
    var c = l.v === r ? l.w : l.v, u = s.priority(c);
    if (u !== void 0) {
      var h = t(l);
      h < u && (n[c] = r, s.decrease(c, h));
    }
  }
  if (i.nodeCount() === 0)
    return e;
  i.nodes().forEach(function(l) {
    s.add(l, Number.POSITIVE_INFINITY), e.setNode(l);
  }), s.decrease(i.nodes()[0], 0);
  for (var a = !1; s.size() > 0; ) {
    if (r = s.removeMin(), Object.hasOwn(n, r))
      e.setEdge(r, n[r]);
    else {
      if (a)
        throw new Error("Input graph is not connected: " + i);
      a = !0;
    }
    i.nodeEdges(r).forEach(o);
  }
  return e;
}
var KC = {
  components: yC,
  dijkstra: Vh,
  dijkstraAll: OC,
  findCycles: NC,
  floydWarshall: jC,
  isAcyclic: DC,
  postorder: FC,
  preorder: qC,
  prim: YC,
  tarjan: Fh,
  topsort: Hh
}, El = hC, Pe = {
  Graph: El.Graph,
  json: fC,
  alg: KC,
  version: El.version
};
let ZC = class {
  constructor() {
    let t = {};
    t._next = t._prev = t, this._sentinel = t;
  }
  dequeue() {
    let t = this._sentinel, e = t._prev;
    if (e !== t)
      return Cl(e), e;
  }
  enqueue(t) {
    let e = this._sentinel;
    t._prev && t._next && Cl(t), t._next = e._next, e._next._prev = t, e._next = t, t._prev = e;
  }
  toString() {
    let t = [], e = this._sentinel, n = e._prev;
    for (; n !== e; )
      t.push(JSON.stringify(n, QC)), n = n._prev;
    return "[" + t.join(", ") + "]";
  }
};
function Cl(i) {
  i._prev._next = i._next, i._next._prev = i._prev, delete i._next, delete i._prev;
}
function QC(i, t) {
  if (i !== "_next" && i !== "_prev")
    return t;
}
var tS = ZC;
let eS = Pe.Graph, nS = tS;
var iS = rS;
let sS = () => 1;
function rS(i, t) {
  if (i.nodeCount() <= 1)
    return [];
  let e = aS(i, t || sS);
  return oS(e.graph, e.buckets, e.zeroIdx).flatMap((s) => i.outEdges(s.v, s.w));
}
function oS(i, t, e) {
  let n = [], s = t[t.length - 1], r = t[0], o;
  for (; i.nodeCount(); ) {
    for (; o = r.dequeue(); )
      Tr(i, t, e, o);
    for (; o = s.dequeue(); )
      Tr(i, t, e, o);
    if (i.nodeCount()) {
      for (let a = t.length - 2; a > 0; --a)
        if (o = t[a].dequeue(), o) {
          n = n.concat(Tr(i, t, e, o, !0));
          break;
        }
    }
  }
  return n;
}
function Tr(i, t, e, n, s) {
  let r = s ? [] : void 0;
  return i.inEdges(n.v).forEach((o) => {
    let a = i.edge(o), l = i.node(o.v);
    s && r.push({ v: o.v, w: o.w }), l.out -= a, co(t, e, l);
  }), i.outEdges(n.v).forEach((o) => {
    let a = i.edge(o), l = o.w, c = i.node(l);
    c.in -= a, co(t, e, c);
  }), i.removeNode(n.v), r;
}
function aS(i, t) {
  let e = new eS(), n = 0, s = 0;
  i.nodes().forEach((a) => {
    e.setNode(a, { v: a, in: 0, out: 0 });
  }), i.edges().forEach((a) => {
    let l = e.edge(a.v, a.w) || 0, c = t(a), u = l + c;
    e.setEdge(a.v, a.w, u), s = Math.max(s, e.node(a.v).out += c), n = Math.max(n, e.node(a.w).in += c);
  });
  let r = lS(s + n + 3).map(() => new nS()), o = n + 1;
  return e.nodes().forEach((a) => {
    co(r, o, e.node(a));
  }), { graph: e, buckets: r, zeroIdx: o };
}
function co(i, t, e) {
  e.out ? e.in ? i[e.out - e.in + t].enqueue(e) : i[i.length - 1].enqueue(e) : i[0].enqueue(e);
}
function lS(i) {
  const t = [];
  for (let e = 0; e < i; e++)
    t.push(e);
  return t;
}
let Wh = Pe.Graph;
var Dt = {
  addBorderNode: bS,
  addDummyNode: Xh,
  applyWithChunking: hr,
  asNonCompoundGraph: uS,
  buildLayerMatrix: gS,
  intersectRect: fS,
  mapValues: SS,
  maxRank: Jh,
  normalizeRanks: pS,
  notime: xS,
  partition: vS,
  pick: CS,
  predecessorWeights: dS,
  range: Zh,
  removeEmptyRanks: mS,
  simplify: cS,
  successorWeights: hS,
  time: wS,
  uniqueId: Kh,
  zipObject: Ko
};
function Xh(i, t, e, n) {
  for (var s = n; i.hasNode(s); )
    s = Kh(n);
  return e.dummy = t, i.setNode(s, e), s;
}
function cS(i) {
  let t = new Wh().setGraph(i.graph());
  return i.nodes().forEach((e) => t.setNode(e, i.node(e))), i.edges().forEach((e) => {
    let n = t.edge(e.v, e.w) || { weight: 0, minlen: 1 }, s = i.edge(e);
    t.setEdge(e.v, e.w, {
      weight: n.weight + s.weight,
      minlen: Math.max(n.minlen, s.minlen)
    });
  }), t;
}
function uS(i) {
  let t = new Wh({ multigraph: i.isMultigraph() }).setGraph(i.graph());
  return i.nodes().forEach((e) => {
    i.children(e).length || t.setNode(e, i.node(e));
  }), i.edges().forEach((e) => {
    t.setEdge(e, i.edge(e));
  }), t;
}
function hS(i) {
  let t = i.nodes().map((e) => {
    let n = {};
    return i.outEdges(e).forEach((s) => {
      n[s.w] = (n[s.w] || 0) + i.edge(s).weight;
    }), n;
  });
  return Ko(i.nodes(), t);
}
function dS(i) {
  let t = i.nodes().map((e) => {
    let n = {};
    return i.inEdges(e).forEach((s) => {
      n[s.v] = (n[s.v] || 0) + i.edge(s).weight;
    }), n;
  });
  return Ko(i.nodes(), t);
}
function fS(i, t) {
  let e = i.x, n = i.y, s = t.x - e, r = t.y - n, o = i.width / 2, a = i.height / 2;
  if (!s && !r)
    throw new Error("Not possible to find intersection inside of the rectangle");
  let l, c;
  return Math.abs(r) * o > Math.abs(s) * a ? (r < 0 && (a = -a), l = a * s / r, c = a) : (s < 0 && (o = -o), l = o, c = o * r / s), { x: e + l, y: n + c };
}
function gS(i) {
  let t = Zh(Jh(i) + 1).map(() => []);
  return i.nodes().forEach((e) => {
    let n = i.node(e), s = n.rank;
    s !== void 0 && (t[s][n.order] = e);
  }), t;
}
function pS(i) {
  let t = i.nodes().map((n) => {
    let s = i.node(n).rank;
    return s === void 0 ? Number.MAX_VALUE : s;
  }), e = hr(Math.min, t);
  i.nodes().forEach((n) => {
    let s = i.node(n);
    Object.hasOwn(s, "rank") && (s.rank -= e);
  });
}
function mS(i) {
  let t = i.nodes().map((o) => i.node(o).rank), e = hr(Math.min, t), n = [];
  i.nodes().forEach((o) => {
    let a = i.node(o).rank - e;
    n[a] || (n[a] = []), n[a].push(o);
  });
  let s = 0, r = i.graph().nodeRankFactor;
  Array.from(n).forEach((o, a) => {
    o === void 0 && a % r !== 0 ? --s : o !== void 0 && s && o.forEach((l) => i.node(l).rank += s);
  });
}
function bS(i, t, e, n) {
  let s = {
    width: 0,
    height: 0
  };
  return arguments.length >= 4 && (s.rank = e, s.order = n), Xh(i, "border", s, t);
}
function yS(i, t = Yh) {
  const e = [];
  for (let n = 0; n < i.length; n += t) {
    const s = i.slice(n, n + t);
    e.push(s);
  }
  return e;
}
const Yh = 65535;
function hr(i, t) {
  if (t.length > Yh) {
    const e = yS(t);
    return i.apply(null, e.map((n) => i.apply(null, n)));
  } else
    return i.apply(null, t);
}
function Jh(i) {
  const e = i.nodes().map((n) => {
    let s = i.node(n).rank;
    return s === void 0 ? Number.MIN_VALUE : s;
  });
  return hr(Math.max, e);
}
function vS(i, t) {
  let e = { lhs: [], rhs: [] };
  return i.forEach((n) => {
    t(n) ? e.lhs.push(n) : e.rhs.push(n);
  }), e;
}
function wS(i, t) {
  let e = Date.now();
  try {
    return t();
  } finally {
    console.log(i + " time: " + (Date.now() - e) + "ms");
  }
}
function xS(i, t) {
  return t();
}
let ES = 0;
function Kh(i) {
  var t = ++ES;
  return i + ("" + t);
}
function Zh(i, t, e = 1) {
  t == null && (t = i, i = 0);
  let n = (r) => r < t;
  e < 0 && (n = (r) => t < r);
  const s = [];
  for (let r = i; n(r); r += e)
    s.push(r);
  return s;
}
function CS(i, t) {
  const e = {};
  for (const n of t)
    i[n] !== void 0 && (e[n] = i[n]);
  return e;
}
function SS(i, t) {
  let e = t;
  return typeof t == "string" && (e = (n) => n[t]), Object.entries(i).reduce((n, [s, r]) => (n[s] = e(r, s), n), {});
}
function Ko(i, t) {
  return i.reduce((e, n, s) => (e[n] = t[s], e), {});
}
let PS = iS, OS = Dt.uniqueId;
var AS = {
  run: MS,
  undo: NS
};
function MS(i) {
  (i.graph().acyclicer === "greedy" ? PS(i, e(i)) : TS(i)).forEach((n) => {
    let s = i.edge(n);
    i.removeEdge(n), s.forwardName = n.name, s.reversed = !0, i.setEdge(n.w, n.v, s, OS("rev"));
  });
  function e(n) {
    return (s) => n.edge(s).weight;
  }
}
function TS(i) {
  let t = [], e = {}, n = {};
  function s(r) {
    Object.hasOwn(n, r) || (n[r] = !0, e[r] = !0, i.outEdges(r).forEach((o) => {
      Object.hasOwn(e, o.w) ? t.push(o) : s(o.w);
    }), delete e[r]);
  }
  return i.nodes().forEach(s), t;
}
function NS(i) {
  i.edges().forEach((t) => {
    let e = i.edge(t);
    if (e.reversed) {
      i.removeEdge(t);
      let n = e.forwardName;
      delete e.reversed, delete e.forwardName, i.setEdge(t.w, t.v, e, n);
    }
  });
}
let IS = Dt;
var jS = {
  run: LS,
  undo: RS
};
function LS(i) {
  i.graph().dummyChains = [], i.edges().forEach((t) => kS(i, t));
}
function kS(i, t) {
  let e = t.v, n = i.node(e).rank, s = t.w, r = i.node(s).rank, o = t.name, a = i.edge(t), l = a.labelRank;
  if (r === n + 1) return;
  i.removeEdge(t);
  let c, u, h;
  for (h = 0, ++n; n < r; ++h, ++n)
    a.points = [], u = {
      width: 0,
      height: 0,
      edgeLabel: a,
      edgeObj: t,
      rank: n
    }, c = IS.addDummyNode(i, "edge", u, "_d"), n === l && (u.width = a.width, u.height = a.height, u.dummy = "edge-label", u.labelpos = a.labelpos), i.setEdge(e, c, { weight: a.weight }, o), h === 0 && i.graph().dummyChains.push(c), e = c;
  i.setEdge(e, s, { weight: a.weight }, o);
}
function RS(i) {
  i.graph().dummyChains.forEach((t) => {
    let e = i.node(t), n = e.edgeLabel, s;
    for (i.setEdge(e.edgeObj, n); e.dummy; )
      s = i.successors(t)[0], i.removeNode(t), n.points.push({ x: e.x, y: e.y }), e.dummy === "edge-label" && (n.x = e.x, n.y = e.y, n.width = e.width, n.height = e.height), t = s, e = i.node(t);
  });
}
const { applyWithChunking: DS } = Dt;
var dr = {
  longestPath: _S,
  slack: $S
};
function _S(i) {
  var t = {};
  function e(n) {
    var s = i.node(n);
    if (Object.hasOwn(t, n))
      return s.rank;
    t[n] = !0;
    let r = i.outEdges(n).map((a) => a == null ? Number.POSITIVE_INFINITY : e(a.w) - i.edge(a).minlen);
    var o = DS(Math.min, r);
    return o === Number.POSITIVE_INFINITY && (o = 0), s.rank = o;
  }
  i.sources().forEach(e);
}
function $S(i, t) {
  return i.node(t.w).rank - i.node(t.v).rank - i.edge(t).minlen;
}
var BS = Pe.Graph, Bs = dr.slack, Qh = zS;
function zS(i) {
  var t = new BS({ directed: !1 }), e = i.nodes()[0], n = i.nodeCount();
  t.setNode(e, {});
  for (var s, r; VS(t, i) < n; )
    s = FS(t, i), r = t.hasNode(s.v) ? Bs(i, s) : -Bs(i, s), GS(t, i, r);
  return t;
}
function VS(i, t) {
  function e(n) {
    t.nodeEdges(n).forEach((s) => {
      var r = s.v, o = n === r ? s.w : r;
      !i.hasNode(o) && !Bs(t, s) && (i.setNode(o, {}), i.setEdge(n, o, {}), e(o));
    });
  }
  return i.nodes().forEach(e), i.nodeCount();
}
function FS(i, t) {
  return t.edges().reduce((n, s) => {
    let r = Number.POSITIVE_INFINITY;
    return i.hasNode(s.v) !== i.hasNode(s.w) && (r = Bs(t, s)), r < n[0] ? [r, s] : n;
  }, [Number.POSITIVE_INFINITY, null])[1];
}
function GS(i, t, e) {
  i.nodes().forEach((n) => t.node(n).rank += e);
}
var HS = Qh, Sl = dr.slack, qS = dr.longestPath, US = Pe.alg.preorder, WS = Pe.alg.postorder, XS = Dt.simplify, YS = Tn;
Tn.initLowLimValues = Qo;
Tn.initCutValues = Zo;
Tn.calcCutValue = td;
Tn.leaveEdge = nd;
Tn.enterEdge = id;
Tn.exchangeEdges = sd;
function Tn(i) {
  i = XS(i), qS(i);
  var t = HS(i);
  Qo(t), Zo(t, i);
  for (var e, n; e = nd(t); )
    n = id(t, i, e), sd(t, i, e, n);
}
function Zo(i, t) {
  var e = WS(i, i.nodes());
  e = e.slice(0, e.length - 1), e.forEach((n) => JS(i, t, n));
}
function JS(i, t, e) {
  var n = i.node(e), s = n.parent;
  i.edge(e, s).cutvalue = td(i, t, e);
}
function td(i, t, e) {
  var n = i.node(e), s = n.parent, r = !0, o = t.edge(e, s), a = 0;
  return o || (r = !1, o = t.edge(s, e)), a = o.weight, t.nodeEdges(e).forEach((l) => {
    var c = l.v === e, u = c ? l.w : l.v;
    if (u !== s) {
      var h = c === r, d = t.edge(l).weight;
      if (a += h ? d : -d, ZS(i, e, u)) {
        var f = i.edge(e, u).cutvalue;
        a += h ? -f : f;
      }
    }
  }), a;
}
function Qo(i, t) {
  arguments.length < 2 && (t = i.nodes()[0]), ed(i, {}, 1, t);
}
function ed(i, t, e, n, s) {
  var r = e, o = i.node(n);
  return t[n] = !0, i.neighbors(n).forEach((a) => {
    Object.hasOwn(t, a) || (e = ed(i, t, e, a, n));
  }), o.low = r, o.lim = e++, s ? o.parent = s : delete o.parent, e;
}
function nd(i) {
  return i.edges().find((t) => i.edge(t).cutvalue < 0);
}
function id(i, t, e) {
  var n = e.v, s = e.w;
  t.hasEdge(n, s) || (n = e.w, s = e.v);
  var r = i.node(n), o = i.node(s), a = r, l = !1;
  r.lim > o.lim && (a = o, l = !0);
  var c = t.edges().filter((u) => l === Pl(i, i.node(u.v), a) && l !== Pl(i, i.node(u.w), a));
  return c.reduce((u, h) => Sl(t, h) < Sl(t, u) ? h : u);
}
function sd(i, t, e, n) {
  var s = e.v, r = e.w;
  i.removeEdge(s, r), i.setEdge(n.v, n.w, {}), Qo(i), Zo(i, t), KS(i, t);
}
function KS(i, t) {
  var e = i.nodes().find((s) => !t.node(s).parent), n = US(i, e);
  n = n.slice(1), n.forEach((s) => {
    var r = i.node(s).parent, o = t.edge(s, r), a = !1;
    o || (o = t.edge(r, s), a = !0), t.node(s).rank = t.node(r).rank + (a ? o.minlen : -o.minlen);
  });
}
function ZS(i, t, e) {
  return i.hasEdge(t, e);
}
function Pl(i, t, e) {
  return e.low <= t.lim && t.lim <= e.lim;
}
var QS = dr, rd = QS.longestPath, tP = Qh, eP = YS, nP = iP;
function iP(i) {
  var t = i.graph().ranker;
  if (t instanceof Function)
    return t(i);
  switch (i.graph().ranker) {
    case "network-simplex":
      Ol(i);
      break;
    case "tight-tree":
      rP(i);
      break;
    case "longest-path":
      sP(i);
      break;
    case "none":
      break;
    default:
      Ol(i);
  }
}
var sP = rd;
function rP(i) {
  rd(i), tP(i);
}
function Ol(i) {
  eP(i);
}
var oP = aP;
function aP(i) {
  let t = cP(i);
  i.graph().dummyChains.forEach((e) => {
    let n = i.node(e), s = n.edgeObj, r = lP(i, t, s.v, s.w), o = r.path, a = r.lca, l = 0, c = o[l], u = !0;
    for (; e !== s.w; ) {
      if (n = i.node(e), u) {
        for (; (c = o[l]) !== a && i.node(c).maxRank < n.rank; )
          l++;
        c === a && (u = !1);
      }
      if (!u) {
        for (; l < o.length - 1 && i.node(c = o[l + 1]).minRank <= n.rank; )
          l++;
        c = o[l];
      }
      i.setParent(e, c), e = i.successors(e)[0];
    }
  });
}
function lP(i, t, e, n) {
  let s = [], r = [], o = Math.min(t[e].low, t[n].low), a = Math.max(t[e].lim, t[n].lim), l, c;
  l = e;
  do
    l = i.parent(l), s.push(l);
  while (l && (t[l].low > o || a > t[l].lim));
  for (c = l, l = n; (l = i.parent(l)) !== c; )
    r.push(l);
  return { path: s.concat(r.reverse()), lca: c };
}
function cP(i) {
  let t = {}, e = 0;
  function n(s) {
    let r = e;
    i.children(s).forEach(n), t[s] = { low: r, lim: e++ };
  }
  return i.children().forEach(n), t;
}
let zs = Dt;
var uP = {
  run: hP,
  cleanup: gP
};
function hP(i) {
  let t = zs.addDummyNode(i, "root", {}, "_root"), e = dP(i), n = Object.values(e), s = zs.applyWithChunking(Math.max, n) - 1, r = 2 * s + 1;
  i.graph().nestingRoot = t, i.edges().forEach((a) => i.edge(a).minlen *= r);
  let o = fP(i) + 1;
  i.children().forEach((a) => od(i, t, r, o, s, e, a)), i.graph().nodeRankFactor = r;
}
function od(i, t, e, n, s, r, o) {
  let a = i.children(o);
  if (!a.length) {
    o !== t && i.setEdge(t, o, { weight: 0, minlen: e });
    return;
  }
  let l = zs.addBorderNode(i, "_bt"), c = zs.addBorderNode(i, "_bb"), u = i.node(o);
  i.setParent(l, o), u.borderTop = l, i.setParent(c, o), u.borderBottom = c, a.forEach((h) => {
    od(i, t, e, n, s, r, h);
    let d = i.node(h), f = d.borderTop ? d.borderTop : h, g = d.borderBottom ? d.borderBottom : h, p = d.borderTop ? n : 2 * n, m = f !== g ? 1 : s - r[o] + 1;
    i.setEdge(l, f, {
      weight: p,
      minlen: m,
      nestingEdge: !0
    }), i.setEdge(g, c, {
      weight: p,
      minlen: m,
      nestingEdge: !0
    });
  }), i.parent(o) || i.setEdge(t, l, { weight: 0, minlen: s + r[o] });
}
function dP(i) {
  var t = {};
  function e(n, s) {
    var r = i.children(n);
    r && r.length && r.forEach((o) => e(o, s + 1)), t[n] = s;
  }
  return i.children().forEach((n) => e(n, 1)), t;
}
function fP(i) {
  return i.edges().reduce((t, e) => t + i.edge(e).weight, 0);
}
function gP(i) {
  var t = i.graph();
  i.removeNode(t.nestingRoot), delete t.nestingRoot, i.edges().forEach((e) => {
    var n = i.edge(e);
    n.nestingEdge && i.removeEdge(e);
  });
}
let pP = Dt;
var mP = bP;
function bP(i) {
  function t(e) {
    let n = i.children(e), s = i.node(e);
    if (n.length && n.forEach(t), Object.hasOwn(s, "minRank")) {
      s.borderLeft = [], s.borderRight = [];
      for (let r = s.minRank, o = s.maxRank + 1; r < o; ++r)
        Al(i, "borderLeft", "_bl", e, s, r), Al(i, "borderRight", "_br", e, s, r);
    }
  }
  i.children().forEach(t);
}
function Al(i, t, e, n, s, r) {
  let o = { width: 0, height: 0, rank: r, borderType: t }, a = s[t][r - 1], l = pP.addDummyNode(i, "border", o, e);
  s[t][r] = l, i.setParent(l, n), a && i.setEdge(a, l, { weight: 1 });
}
var yP = {
  adjust: vP,
  undo: wP
};
function vP(i) {
  let t = i.graph().rankdir.toLowerCase();
  (t === "lr" || t === "rl") && ad(i);
}
function wP(i) {
  let t = i.graph().rankdir.toLowerCase();
  (t === "bt" || t === "rl") && xP(i), (t === "lr" || t === "rl") && (EP(i), ad(i));
}
function ad(i) {
  i.nodes().forEach((t) => Ml(i.node(t))), i.edges().forEach((t) => Ml(i.edge(t)));
}
function Ml(i) {
  let t = i.width;
  i.width = i.height, i.height = t;
}
function xP(i) {
  i.nodes().forEach((t) => Nr(i.node(t))), i.edges().forEach((t) => {
    let e = i.edge(t);
    e.points.forEach(Nr), Object.hasOwn(e, "y") && Nr(e);
  });
}
function Nr(i) {
  i.y = -i.y;
}
function EP(i) {
  i.nodes().forEach((t) => Ir(i.node(t))), i.edges().forEach((t) => {
    let e = i.edge(t);
    e.points.forEach(Ir), Object.hasOwn(e, "x") && Ir(e);
  });
}
function Ir(i) {
  let t = i.x;
  i.x = i.y, i.y = t;
}
let Tl = Dt;
var CP = SP;
function SP(i) {
  let t = {}, e = i.nodes().filter((l) => !i.children(l).length), n = e.map((l) => i.node(l).rank), s = Tl.applyWithChunking(Math.max, n), r = Tl.range(s + 1).map(() => []);
  function o(l) {
    if (t[l]) return;
    t[l] = !0;
    let c = i.node(l);
    r[c.rank].push(l), i.successors(l).forEach(o);
  }
  return e.sort((l, c) => i.node(l).rank - i.node(c).rank).forEach(o), r;
}
let PP = Dt.zipObject;
var OP = AP;
function AP(i, t) {
  let e = 0;
  for (let n = 1; n < t.length; ++n)
    e += MP(i, t[n - 1], t[n]);
  return e;
}
function MP(i, t, e) {
  let n = PP(e, e.map((c, u) => u)), s = t.flatMap((c) => i.outEdges(c).map((u) => ({ pos: n[u.w], weight: i.edge(u).weight })).sort((u, h) => u.pos - h.pos)), r = 1;
  for (; r < e.length; ) r <<= 1;
  let o = 2 * r - 1;
  r -= 1;
  let a = new Array(o).fill(0), l = 0;
  return s.forEach((c) => {
    let u = c.pos + r;
    a[u] += c.weight;
    let h = 0;
    for (; u > 0; )
      u % 2 && (h += a[u + 1]), u = u - 1 >> 1, a[u] += c.weight;
    l += c.weight * h;
  }), l;
}
var TP = NP;
function NP(i, t = []) {
  return t.map((e) => {
    let n = i.inEdges(e);
    if (n.length) {
      let s = n.reduce((r, o) => {
        let a = i.edge(o), l = i.node(o.v);
        return {
          sum: r.sum + a.weight * l.order,
          weight: r.weight + a.weight
        };
      }, { sum: 0, weight: 0 });
      return {
        v: e,
        barycenter: s.sum / s.weight,
        weight: s.weight
      };
    } else
      return { v: e };
  });
}
let IP = Dt;
var jP = LP;
function LP(i, t) {
  let e = {};
  i.forEach((s, r) => {
    let o = e[s.v] = {
      indegree: 0,
      in: [],
      out: [],
      vs: [s.v],
      i: r
    };
    s.barycenter !== void 0 && (o.barycenter = s.barycenter, o.weight = s.weight);
  }), t.edges().forEach((s) => {
    let r = e[s.v], o = e[s.w];
    r !== void 0 && o !== void 0 && (o.indegree++, r.out.push(e[s.w]));
  });
  let n = Object.values(e).filter((s) => !s.indegree);
  return kP(n);
}
function kP(i) {
  let t = [];
  function e(s) {
    return (r) => {
      r.merged || (r.barycenter === void 0 || s.barycenter === void 0 || r.barycenter >= s.barycenter) && RP(s, r);
    };
  }
  function n(s) {
    return (r) => {
      r.in.push(s), --r.indegree === 0 && i.push(r);
    };
  }
  for (; i.length; ) {
    let s = i.pop();
    t.push(s), s.in.reverse().forEach(e(s)), s.out.forEach(n(s));
  }
  return t.filter((s) => !s.merged).map((s) => IP.pick(s, ["vs", "i", "barycenter", "weight"]));
}
function RP(i, t) {
  let e = 0, n = 0;
  i.weight && (e += i.barycenter * i.weight, n += i.weight), t.weight && (e += t.barycenter * t.weight, n += t.weight), i.vs = t.vs.concat(i.vs), i.barycenter = e / n, i.weight = n, i.i = Math.min(t.i, i.i), t.merged = !0;
}
let DP = Dt;
var _P = $P;
function $P(i, t) {
  let e = DP.partition(i, (u) => Object.hasOwn(u, "barycenter")), n = e.lhs, s = e.rhs.sort((u, h) => h.i - u.i), r = [], o = 0, a = 0, l = 0;
  n.sort(BP(!!t)), l = Nl(r, s, l), n.forEach((u) => {
    l += u.vs.length, r.push(u.vs), o += u.barycenter * u.weight, a += u.weight, l = Nl(r, s, l);
  });
  let c = { vs: r.flat(!0) };
  return a && (c.barycenter = o / a, c.weight = a), c;
}
function Nl(i, t, e) {
  let n;
  for (; t.length && (n = t[t.length - 1]).i <= e; )
    t.pop(), i.push(n.vs), e++;
  return e;
}
function BP(i) {
  return (t, e) => t.barycenter < e.barycenter ? -1 : t.barycenter > e.barycenter ? 1 : i ? e.i - t.i : t.i - e.i;
}
let zP = TP, VP = jP, FP = _P;
var GP = ld;
function ld(i, t, e, n) {
  let s = i.children(t), r = i.node(t), o = r ? r.borderLeft : void 0, a = r ? r.borderRight : void 0, l = {};
  o && (s = s.filter((d) => d !== o && d !== a));
  let c = zP(i, s);
  c.forEach((d) => {
    if (i.children(d.v).length) {
      let f = ld(i, d.v, e, n);
      l[d.v] = f, Object.hasOwn(f, "barycenter") && qP(d, f);
    }
  });
  let u = VP(c, e);
  HP(u, l);
  let h = FP(u, n);
  if (o && (h.vs = [o, h.vs, a].flat(!0), i.predecessors(o).length)) {
    let d = i.node(i.predecessors(o)[0]), f = i.node(i.predecessors(a)[0]);
    Object.hasOwn(h, "barycenter") || (h.barycenter = 0, h.weight = 0), h.barycenter = (h.barycenter * h.weight + d.order + f.order) / (h.weight + 2), h.weight += 2;
  }
  return h;
}
function HP(i, t) {
  i.forEach((e) => {
    e.vs = e.vs.flatMap((n) => t[n] ? t[n].vs : n);
  });
}
function qP(i, t) {
  i.barycenter !== void 0 ? (i.barycenter = (i.barycenter * i.weight + t.barycenter * t.weight) / (i.weight + t.weight), i.weight += t.weight) : (i.barycenter = t.barycenter, i.weight = t.weight);
}
let UP = Pe.Graph, WP = Dt;
var XP = YP;
function YP(i, t, e, n) {
  n || (n = i.nodes());
  let s = JP(i), r = new UP({ compound: !0 }).setGraph({ root: s }).setDefaultNodeLabel((o) => i.node(o));
  return n.forEach((o) => {
    let a = i.node(o), l = i.parent(o);
    (a.rank === t || a.minRank <= t && t <= a.maxRank) && (r.setNode(o), r.setParent(o, l || s), i[e](o).forEach((c) => {
      let u = c.v === o ? c.w : c.v, h = r.edge(u, o), d = h !== void 0 ? h.weight : 0;
      r.setEdge(u, o, { weight: i.edge(c).weight + d });
    }), Object.hasOwn(a, "minRank") && r.setNode(o, {
      borderLeft: a.borderLeft[t],
      borderRight: a.borderRight[t]
    }));
  }), r;
}
function JP(i) {
  for (var t; i.hasNode(t = WP.uniqueId("_root")); ) ;
  return t;
}
var KP = ZP;
function ZP(i, t, e) {
  let n = {}, s;
  e.forEach((r) => {
    let o = i.parent(r), a, l;
    for (; o; ) {
      if (a = i.parent(o), a ? (l = n[a], n[a] = o) : (l = s, s = o), l && l !== o) {
        t.setEdge(l, o);
        return;
      }
      o = a;
    }
  });
}
let QP = CP, tO = OP, eO = GP, nO = XP, iO = KP, sO = Pe.Graph, gs = Dt;
var rO = cd;
function cd(i, t) {
  if (t && typeof t.customOrder == "function") {
    t.customOrder(i, cd);
    return;
  }
  let e = gs.maxRank(i), n = Il(i, gs.range(1, e + 1), "inEdges"), s = Il(i, gs.range(e - 1, -1, -1), "outEdges"), r = QP(i);
  if (jl(i, r), t && t.disableOptimalOrderHeuristic)
    return;
  let o = Number.POSITIVE_INFINITY, a;
  for (let l = 0, c = 0; c < 4; ++l, ++c) {
    oO(l % 2 ? n : s, l % 4 >= 2), r = gs.buildLayerMatrix(i);
    let u = tO(i, r);
    u < o && (c = 0, a = Object.assign({}, r), o = u);
  }
  jl(i, a);
}
function Il(i, t, e) {
  const n = /* @__PURE__ */ new Map(), s = (r, o) => {
    n.has(r) || n.set(r, []), n.get(r).push(o);
  };
  for (const r of i.nodes()) {
    const o = i.node(r);
    if (typeof o.rank == "number" && s(o.rank, r), typeof o.minRank == "number" && typeof o.maxRank == "number")
      for (let a = o.minRank; a <= o.maxRank; a++)
        a !== o.rank && s(a, r);
  }
  return t.map(function(r) {
    return nO(i, r, e, n.get(r) || []);
  });
}
function oO(i, t) {
  let e = new sO();
  i.forEach(function(n) {
    let s = n.graph().root, r = eO(n, s, e, t);
    r.vs.forEach((o, a) => n.node(o).order = a), iO(n, e, r.vs);
  });
}
function jl(i, t) {
  Object.values(t).forEach((e) => e.forEach((n, s) => i.node(n).order = s));
}
let aO = Pe.Graph, De = Dt;
var lO = {
  positionX: vO
};
function cO(i, t) {
  let e = {};
  function n(s, r) {
    let o = 0, a = 0, l = s.length, c = r[r.length - 1];
    return r.forEach((u, h) => {
      let d = hO(i, u), f = d ? i.node(d).order : l;
      (d || u === c) && (r.slice(a, h + 1).forEach((g) => {
        i.predecessors(g).forEach((p) => {
          let m = i.node(p), y = m.order;
          (y < o || f < y) && !(m.dummy && i.node(g).dummy) && ud(e, p, g);
        });
      }), a = h + 1, o = f);
    }), r;
  }
  return t.length && t.reduce(n), e;
}
function uO(i, t) {
  let e = {};
  function n(r, o, a, l, c) {
    let u;
    De.range(o, a).forEach((h) => {
      u = r[h], i.node(u).dummy && i.predecessors(u).forEach((d) => {
        let f = i.node(d);
        f.dummy && (f.order < l || f.order > c) && ud(e, d, u);
      });
    });
  }
  function s(r, o) {
    let a = -1, l, c = 0;
    return o.forEach((u, h) => {
      if (i.node(u).dummy === "border") {
        let d = i.predecessors(u);
        d.length && (l = i.node(d[0]).order, n(o, c, h, a, l), c = h, a = l);
      }
      n(o, c, o.length, l, r.length);
    }), o;
  }
  return t.length && t.reduce(s), e;
}
function hO(i, t) {
  if (i.node(t).dummy)
    return i.predecessors(t).find((e) => i.node(e).dummy);
}
function ud(i, t, e) {
  if (t > e) {
    let s = t;
    t = e, e = s;
  }
  let n = i[t];
  n || (i[t] = n = {}), n[e] = !0;
}
function dO(i, t, e) {
  if (t > e) {
    let n = t;
    t = e, e = n;
  }
  return !!i[t] && Object.hasOwn(i[t], e);
}
function fO(i, t, e, n) {
  let s = {}, r = {}, o = {};
  return t.forEach((a) => {
    a.forEach((l, c) => {
      s[l] = l, r[l] = l, o[l] = c;
    });
  }), t.forEach((a) => {
    let l = -1;
    a.forEach((c) => {
      let u = n(c);
      if (u.length) {
        u = u.sort((d, f) => o[d] - o[f]);
        let h = (u.length - 1) / 2;
        for (let d = Math.floor(h), f = Math.ceil(h); d <= f; ++d) {
          let g = u[d];
          r[c] === c && l < o[g] && !dO(e, c, g) && (r[g] = c, r[c] = s[c] = s[g], l = o[g]);
        }
      }
    });
  }), { root: s, align: r };
}
function gO(i, t, e, n, s) {
  let r = {}, o = pO(i, t, e, s), a = s ? "borderLeft" : "borderRight";
  function l(h, d) {
    let f = o.nodes(), g = f.pop(), p = {};
    for (; g; )
      p[g] ? h(g) : (p[g] = !0, f.push(g), f = f.concat(d(g))), g = f.pop();
  }
  function c(h) {
    r[h] = o.inEdges(h).reduce((d, f) => Math.max(d, r[f.v] + o.edge(f)), 0);
  }
  function u(h) {
    let d = o.outEdges(h).reduce((g, p) => Math.min(g, r[p.w] - o.edge(p)), Number.POSITIVE_INFINITY), f = i.node(h);
    d !== Number.POSITIVE_INFINITY && f.borderType !== a && (r[h] = Math.max(r[h], d));
  }
  return l(c, o.predecessors.bind(o)), l(u, o.successors.bind(o)), Object.keys(n).forEach((h) => r[h] = r[e[h]]), r;
}
function pO(i, t, e, n) {
  let s = new aO(), r = i.graph(), o = wO(r.nodesep, r.edgesep, n);
  return t.forEach((a) => {
    let l;
    a.forEach((c) => {
      let u = e[c];
      if (s.setNode(u), l) {
        var h = e[l], d = s.edge(h, u);
        s.setEdge(h, u, Math.max(o(i, c, l), d || 0));
      }
      l = c;
    });
  }), s;
}
function mO(i, t) {
  return Object.values(t).reduce((e, n) => {
    let s = Number.NEGATIVE_INFINITY, r = Number.POSITIVE_INFINITY;
    Object.entries(n).forEach(([a, l]) => {
      let c = xO(i, a) / 2;
      s = Math.max(l + c, s), r = Math.min(l - c, r);
    });
    const o = s - r;
    return o < e[0] && (e = [o, n]), e;
  }, [Number.POSITIVE_INFINITY, null])[1];
}
function bO(i, t) {
  let e = Object.values(t), n = De.applyWithChunking(Math.min, e), s = De.applyWithChunking(Math.max, e);
  ["u", "d"].forEach((r) => {
    ["l", "r"].forEach((o) => {
      let a = r + o, l = i[a];
      if (l === t) return;
      let c = Object.values(l), u = n - De.applyWithChunking(Math.min, c);
      o !== "l" && (u = s - De.applyWithChunking(Math.max, c)), u && (i[a] = De.mapValues(l, (h) => h + u));
    });
  });
}
function yO(i, t) {
  return De.mapValues(i.ul, (e, n) => {
    if (t)
      return i[t.toLowerCase()][n];
    {
      let s = Object.values(i).map((r) => r[n]).sort((r, o) => r - o);
      return (s[1] + s[2]) / 2;
    }
  });
}
function vO(i) {
  let t = De.buildLayerMatrix(i), e = Object.assign(
    cO(i, t),
    uO(i, t)
  ), n = {}, s;
  ["u", "d"].forEach((o) => {
    s = o === "u" ? t : Object.values(t).reverse(), ["l", "r"].forEach((a) => {
      a === "r" && (s = s.map((h) => Object.values(h).reverse()));
      let l = (o === "u" ? i.predecessors : i.successors).bind(i), c = fO(i, s, e, l), u = gO(
        i,
        s,
        c.root,
        c.align,
        a === "r"
      );
      a === "r" && (u = De.mapValues(u, (h) => -h)), n[o + a] = u;
    });
  });
  let r = mO(i, n);
  return bO(n, r), yO(n, i.graph().align);
}
function wO(i, t, e) {
  return (n, s, r) => {
    let o = n.node(s), a = n.node(r), l = 0, c;
    if (l += o.width / 2, Object.hasOwn(o, "labelpos"))
      switch (o.labelpos.toLowerCase()) {
        case "l":
          c = -o.width / 2;
          break;
        case "r":
          c = o.width / 2;
          break;
      }
    if (c && (l += e ? c : -c), c = 0, l += (o.dummy ? t : i) / 2, l += (a.dummy ? t : i) / 2, l += a.width / 2, Object.hasOwn(a, "labelpos"))
      switch (a.labelpos.toLowerCase()) {
        case "l":
          c = a.width / 2;
          break;
        case "r":
          c = -a.width / 2;
          break;
      }
    return c && (l += e ? c : -c), c = 0, l;
  };
}
function xO(i, t) {
  return i.node(t).width;
}
let hd = Dt, EO = lO.positionX;
var CO = SO;
function SO(i) {
  i = hd.asNonCompoundGraph(i), PO(i), Object.entries(EO(i)).forEach(([t, e]) => i.node(t).x = e);
}
function PO(i) {
  let t = hd.buildLayerMatrix(i), e = i.graph().ranksep, n = 0;
  t.forEach((s) => {
    const r = s.reduce((o, a) => {
      const l = i.node(a).height;
      return o > l ? o : l;
    }, 0);
    s.forEach((o) => i.node(o).y = n + r / 2), n += r + e;
  });
}
let Ll = AS, kl = jS, OO = nP, AO = Dt.normalizeRanks, MO = oP, TO = Dt.removeEmptyRanks, Rl = uP, NO = mP, Dl = yP, IO = rO, jO = CO, ge = Dt, LO = Pe.Graph;
var kO = RO;
function RO(i, t) {
  let e = t && t.debugTiming ? ge.time : ge.notime;
  e("layout", () => {
    let n = e("  buildLayoutGraph", () => qO(i));
    e("  runLayout", () => DO(n, e, t)), e("  updateInputGraph", () => _O(i, n));
  });
}
function DO(i, t, e) {
  t("    makeSpaceForEdgeLabels", () => UO(i)), t("    removeSelfEdges", () => eA(i)), t("    acyclic", () => Ll.run(i)), t("    nestingGraph.run", () => Rl.run(i)), t("    rank", () => OO(ge.asNonCompoundGraph(i))), t("    injectEdgeLabelProxies", () => WO(i)), t("    removeEmptyRanks", () => TO(i)), t("    nestingGraph.cleanup", () => Rl.cleanup(i)), t("    normalizeRanks", () => AO(i)), t("    assignRankMinMax", () => XO(i)), t("    removeEdgeLabelProxies", () => YO(i)), t("    normalize.run", () => kl.run(i)), t("    parentDummyChains", () => MO(i)), t("    addBorderSegments", () => NO(i)), t("    order", () => IO(i, e)), t("    insertSelfEdges", () => nA(i)), t("    adjustCoordinateSystem", () => Dl.adjust(i)), t("    position", () => jO(i)), t("    positionSelfEdges", () => iA(i)), t("    removeBorderNodes", () => tA(i)), t("    normalize.undo", () => kl.undo(i)), t("    fixupEdgeLabelCoords", () => ZO(i)), t("    undoCoordinateSystem", () => Dl.undo(i)), t("    translateGraph", () => JO(i)), t("    assignNodeIntersects", () => KO(i)), t("    reversePoints", () => QO(i)), t("    acyclic.undo", () => Ll.undo(i));
}
function _O(i, t) {
  i.nodes().forEach((e) => {
    let n = i.node(e), s = t.node(e);
    n && (n.x = s.x, n.y = s.y, n.rank = s.rank, t.children(e).length && (n.width = s.width, n.height = s.height));
  }), i.edges().forEach((e) => {
    let n = i.edge(e), s = t.edge(e);
    n.points = s.points, Object.hasOwn(s, "x") && (n.x = s.x, n.y = s.y);
  }), i.graph().width = t.graph().width, i.graph().height = t.graph().height;
}
let $O = ["nodesep", "edgesep", "ranksep", "marginx", "marginy"], BO = { ranksep: 50, edgesep: 20, nodesep: 50, rankdir: "tb" }, zO = ["acyclicer", "ranker", "rankdir", "align"], VO = ["width", "height", "rank"], _l = { width: 0, height: 0 }, FO = ["minlen", "weight", "width", "height", "labeloffset"], GO = {
  minlen: 1,
  weight: 1,
  width: 0,
  height: 0,
  labeloffset: 10,
  labelpos: "r"
}, HO = ["labelpos"];
function qO(i) {
  let t = new LO({ multigraph: !0, compound: !0 }), e = Lr(i.graph());
  return t.setGraph(Object.assign(
    {},
    BO,
    jr(e, $O),
    ge.pick(e, zO)
  )), i.nodes().forEach((n) => {
    let s = Lr(i.node(n));
    const r = jr(s, VO);
    Object.keys(_l).forEach((o) => {
      r[o] === void 0 && (r[o] = _l[o]);
    }), t.setNode(n, r), t.setParent(n, i.parent(n));
  }), i.edges().forEach((n) => {
    let s = Lr(i.edge(n));
    t.setEdge(n, Object.assign(
      {},
      GO,
      jr(s, FO),
      ge.pick(s, HO)
    ));
  }), t;
}
function UO(i) {
  let t = i.graph();
  t.ranksep /= 2, i.edges().forEach((e) => {
    let n = i.edge(e);
    n.minlen *= 2, n.labelpos.toLowerCase() !== "c" && (t.rankdir === "TB" || t.rankdir === "BT" ? n.width += n.labeloffset : n.height += n.labeloffset);
  });
}
function WO(i) {
  i.edges().forEach((t) => {
    let e = i.edge(t);
    if (e.width && e.height) {
      let n = i.node(t.v), r = { rank: (i.node(t.w).rank - n.rank) / 2 + n.rank, e: t };
      ge.addDummyNode(i, "edge-proxy", r, "_ep");
    }
  });
}
function XO(i) {
  let t = 0;
  i.nodes().forEach((e) => {
    let n = i.node(e);
    n.borderTop && (n.minRank = i.node(n.borderTop).rank, n.maxRank = i.node(n.borderBottom).rank, t = Math.max(t, n.maxRank));
  }), i.graph().maxRank = t;
}
function YO(i) {
  i.nodes().forEach((t) => {
    let e = i.node(t);
    e.dummy === "edge-proxy" && (i.edge(e.e).labelRank = e.rank, i.removeNode(t));
  });
}
function JO(i) {
  let t = Number.POSITIVE_INFINITY, e = 0, n = Number.POSITIVE_INFINITY, s = 0, r = i.graph(), o = r.marginx || 0, a = r.marginy || 0;
  function l(c) {
    let u = c.x, h = c.y, d = c.width, f = c.height;
    t = Math.min(t, u - d / 2), e = Math.max(e, u + d / 2), n = Math.min(n, h - f / 2), s = Math.max(s, h + f / 2);
  }
  i.nodes().forEach((c) => l(i.node(c))), i.edges().forEach((c) => {
    let u = i.edge(c);
    Object.hasOwn(u, "x") && l(u);
  }), t -= o, n -= a, i.nodes().forEach((c) => {
    let u = i.node(c);
    u.x -= t, u.y -= n;
  }), i.edges().forEach((c) => {
    let u = i.edge(c);
    u.points.forEach((h) => {
      h.x -= t, h.y -= n;
    }), Object.hasOwn(u, "x") && (u.x -= t), Object.hasOwn(u, "y") && (u.y -= n);
  }), r.width = e - t + o, r.height = s - n + a;
}
function KO(i) {
  i.edges().forEach((t) => {
    let e = i.edge(t), n = i.node(t.v), s = i.node(t.w), r, o;
    e.points ? (r = e.points[0], o = e.points[e.points.length - 1]) : (e.points = [], r = s, o = n), e.points.unshift(ge.intersectRect(n, r)), e.points.push(ge.intersectRect(s, o));
  });
}
function ZO(i) {
  i.edges().forEach((t) => {
    let e = i.edge(t);
    if (Object.hasOwn(e, "x"))
      switch ((e.labelpos === "l" || e.labelpos === "r") && (e.width -= e.labeloffset), e.labelpos) {
        case "l":
          e.x -= e.width / 2 + e.labeloffset;
          break;
        case "r":
          e.x += e.width / 2 + e.labeloffset;
          break;
      }
  });
}
function QO(i) {
  i.edges().forEach((t) => {
    let e = i.edge(t);
    e.reversed && e.points.reverse();
  });
}
function tA(i) {
  i.nodes().forEach((t) => {
    if (i.children(t).length) {
      let e = i.node(t), n = i.node(e.borderTop), s = i.node(e.borderBottom), r = i.node(e.borderLeft[e.borderLeft.length - 1]), o = i.node(e.borderRight[e.borderRight.length - 1]);
      e.width = Math.abs(o.x - r.x), e.height = Math.abs(s.y - n.y), e.x = r.x + e.width / 2, e.y = n.y + e.height / 2;
    }
  }), i.nodes().forEach((t) => {
    i.node(t).dummy === "border" && i.removeNode(t);
  });
}
function eA(i) {
  i.edges().forEach((t) => {
    if (t.v === t.w) {
      var e = i.node(t.v);
      e.selfEdges || (e.selfEdges = []), e.selfEdges.push({ e: t, label: i.edge(t) }), i.removeEdge(t);
    }
  });
}
function nA(i) {
  var t = ge.buildLayerMatrix(i);
  t.forEach((e) => {
    var n = 0;
    e.forEach((s, r) => {
      var o = i.node(s);
      o.order = r + n, (o.selfEdges || []).forEach((a) => {
        ge.addDummyNode(i, "selfedge", {
          width: a.label.width,
          height: a.label.height,
          rank: o.rank,
          order: r + ++n,
          e: a.e,
          label: a.label
        }, "_se");
      }), delete o.selfEdges;
    });
  });
}
function iA(i) {
  i.nodes().forEach((t) => {
    var e = i.node(t);
    if (e.dummy === "selfedge") {
      var n = i.node(e.e.v), s = n.x + n.width / 2, r = n.y, o = e.x - s, a = n.height / 2;
      i.setEdge(e.e, e.label), i.removeNode(t), e.label.points = [
        { x: s + 2 * o / 3, y: r - a },
        { x: s + 5 * o / 6, y: r - a },
        { x: s + o, y: r },
        { x: s + 5 * o / 6, y: r + a },
        { x: s + 2 * o / 3, y: r + a }
      ], e.label.x = e.x, e.label.y = e.y;
    }
  });
}
function jr(i, t) {
  return ge.mapValues(ge.pick(i, t), Number);
}
function Lr(i) {
  var t = {};
  return i && Object.entries(i).forEach(([e, n]) => {
    typeof e == "string" && (e = e.toLowerCase()), t[e] = n;
  }), t;
}
let sA = Dt, rA = Pe.Graph;
var oA = {
  debugOrdering: aA
};
function aA(i) {
  let t = sA.buildLayerMatrix(i), e = new rA({ compound: !0, multigraph: !0 }).setGraph({});
  return i.nodes().forEach((n) => {
    e.setNode(n, { label: n }), e.setParent(n, "layer" + i.node(n).rank);
  }), i.edges().forEach((n) => e.setEdge(n.v, n.w, {}, n.name)), t.forEach((n, s) => {
    let r = "layer" + s;
    e.setNode(r, { rank: "same" }), n.reduce((o, a) => (e.setEdge(o, a, { style: "invis" }), a));
  }), e;
}
var lA = "1.1.8", cA = {
  graphlib: Pe,
  layout: kO,
  debug: oA,
  util: {
    time: Dt.time,
    notime: Dt.notime
  },
  version: lA
};
const $l = /* @__PURE__ */ Dh(cA), ne = {
  COMMAND_EXECUTE: "command.execute",
  COMMAND_RESULT: "command.result",
  PROJECT_EVENT: "project.event",
  OBJECT_CHANGED: "object.changed",
  ERROR: "error",
  PRESENCE_JOIN: "presence.join",
  PRESENCE_LEAVE: "presence.leave",
  PRESENCE_LIST: "presence.list",
  CLIENT_IDENTITY: "client.identity",
  CURSOR_UPDATE: "cursor.update"
};
function uA(i) {
  const t = JSON.parse(i);
  return {
    type: t.type ?? "unknown",
    requestId: t.requestId,
    payload: t.payload ?? {}
  };
}
function Bl(i) {
  return JSON.stringify({
    type: i.type,
    ...i.requestId ? { requestId: i.requestId } : {},
    payload: i.payload
  });
}
const hA = 2e4, dA = 1e3, fA = 1e4;
class gA {
  constructor(t) {
    at(this, "socket", null);
    at(this, "pending", /* @__PURE__ */ new Map());
    at(this, "reconnectAttempt", 0);
    at(this, "reconnectTimer", null);
    at(this, "closed", !1);
    at(this, "url");
    at(this, "status", "disconnected");
    at(this, "onStatusChange", null);
    at(this, "onEvent", null);
    this.url = pA(t);
  }
  connect() {
    this.closed = !1, this.setStatus("connecting");
    try {
      const t = new WebSocket(this.url);
      this.socket = t, t.onopen = () => this.handleOpen(), t.onmessage = (e) => this.handleMessage(e.data), t.onerror = () => {
      }, t.onclose = () => this.handleClose();
    } catch {
      this.handleClose();
    }
  }
  close() {
    var t;
    this.closed = !0, this.clearReconnectTimer(), (t = this.socket) == null || t.close(), this.socket = null, this.rejectAll("Connection closed"), this.setStatus("disconnected");
  }
  getStatus() {
    return this.status;
  }
  execute(t, e, n = hA) {
    return new Promise((s, r) => {
      if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
        r("Not connected");
        return;
      }
      const o = mA(), a = window.setTimeout(() => {
        this.pending.delete(o), r(`Command '${t}' timed out`);
      }, n);
      this.pending.set(o, { resolve: s, reject: r, timer: a }), this.socket.send(
        Bl({
          type: ne.COMMAND_EXECUTE,
          requestId: o,
          payload: { commandId: t, params: e }
        })
      );
    });
  }
  sendRaw(t, e) {
    !this.socket || this.socket.readyState !== WebSocket.OPEN || this.socket.send(Bl({ type: t, payload: e }));
  }
  handleOpen() {
    this.reconnectAttempt = 0, this.setStatus("connected");
  }
  handleMessage(t) {
    var n;
    let e;
    try {
      e = uA(String(t));
    } catch {
      return;
    }
    if (e.type === ne.COMMAND_RESULT) {
      this.resolvePending(e.requestId, e.payload);
      return;
    }
    e.type === ne.ERROR && this.rejectPending(e.requestId, e.payload.message ?? "Unknown error"), (n = this.onEvent) == null || n.call(this, e);
  }
  handleClose() {
    this.socket = null, this.rejectAll("Connection lost"), this.setStatus("disconnected"), !this.closed && this.scheduleReconnect();
  }
  scheduleReconnect() {
    this.clearReconnectTimer();
    const t = Math.min(dA * 2 ** this.reconnectAttempt, fA);
    this.reconnectAttempt += 1, this.reconnectTimer = window.setTimeout(() => this.connect(), t);
  }
  clearReconnectTimer() {
    this.reconnectTimer !== null && (window.clearTimeout(this.reconnectTimer), this.reconnectTimer = null);
  }
  resolvePending(t, e) {
    if (!t) return;
    const n = this.pending.get(t);
    n && (this.pending.delete(t), window.clearTimeout(n.timer), n.resolve(e));
  }
  rejectPending(t, e) {
    if (!t) return;
    const n = this.pending.get(t);
    n && (this.pending.delete(t), window.clearTimeout(n.timer), n.reject(e));
  }
  rejectAll(t) {
    this.pending.forEach((e) => {
      window.clearTimeout(e.timer), e.reject(t);
    }), this.pending.clear();
  }
  setStatus(t) {
    var e;
    this.status = t, (e = this.onStatusChange) == null || e.call(this, t);
  }
}
function pA(i) {
  return `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}${i}`;
}
function mA() {
  const i = new Uint8Array(16);
  if (typeof crypto < "u" && typeof crypto.getRandomValues == "function")
    crypto.getRandomValues(i);
  else
    for (let e = 0; e < i.length; e++)
      i[e] = Math.floor(Math.random() * 256);
  i[6] = i[6] & 15 | 64, i[8] = i[8] & 63 | 128;
  const t = Array.from(i, (e) => e.toString(16).padStart(2, "0"));
  return [
    t.slice(0, 4).join(""),
    t.slice(4, 6).join(""),
    t.slice(6, 8).join(""),
    t.slice(8, 10).join(""),
    t.slice(10, 16).join("")
  ].join("-");
}
const uo = /* @__PURE__ */ new Set();
function bA(i) {
  return uo.add(i), () => uo.delete(i);
}
function Oi(i) {
  uo.forEach((t) => t(i));
}
const xt = Xt(null);
let wi = null, kr = "";
const vn = {
  get value() {
    return xt.value;
  },
  get loaded() {
    return xt.value !== null;
  },
  get app() {
    var i;
    return (i = xt.value) == null ? void 0 : i.app;
  },
  get navigation() {
    var i;
    return ((i = xt.value) == null ? void 0 : i.navigation) ?? [];
  },
  get pages() {
    var i;
    return ((i = xt.value) == null ? void 0 : i.pages) ?? [];
  },
  get shortcuts() {
    var i;
    return ((i = xt.value) == null ? void 0 : i.shortcuts) ?? [];
  },
  get subscriptions() {
    var i;
    return ((i = xt.value) == null ? void 0 : i.subscriptions) ?? [];
  },
  get commands() {
    var i;
    return ((i = xt.value) == null ? void 0 : i.commands) ?? [];
  },
  get entities() {
    var i;
    return ((i = xt.value) == null ? void 0 : i.entities) ?? [];
  },
  get overlays() {
    var i;
    return ((i = xt.value) == null ? void 0 : i.overlays) ?? [];
  },
  get overlayTriggers() {
    var i;
    return ((i = xt.value) == null ? void 0 : i.overlayTriggers) ?? [];
  },
  get pluginComponents() {
    var i;
    return ((i = xt.value) == null ? void 0 : i.pluginComponents) ?? [];
  },
  get transport() {
    var i;
    return (i = xt.value) == null ? void 0 : i.transport;
  },
  get theme() {
    var i;
    return (i = xt.value) == null ? void 0 : i.app.theme;
  },
  get i18n() {
    var i;
    return ((i = xt.value) == null ? void 0 : i.i18n) ?? null;
  },
  get routing() {
    var i;
    return ((i = xt.value) == null ? void 0 : i.routing) ?? { mode: "hash", redirects: [] };
  },
  get protocol() {
    var i;
    return ((i = xt.value) == null ? void 0 : i.protocol) ?? { messages: [] };
  },
  get dev() {
    var i;
    return ((i = xt.value) == null ? void 0 : i.dev) ?? { enabled: !1, pollIntervalMs: 0 };
  },
  get collaboration() {
    var i;
    return ((i = xt.value) == null ? void 0 : i.collaboration) ?? { enabled: !1, cursorsEnabled: !1 };
  },
  async load() {
    const i = await fetch("/config");
    if (!i.ok)
      throw new Error(`Failed to load config: HTTP ${i.status}`);
    const t = await i.json();
    xt.value = t, kr = JSON.stringify(t), this.startPollingIfNeeded();
  },
  startPollingIfNeeded() {
    var t;
    if (wi) return;
    const i = (t = xt.value) == null ? void 0 : t.dev;
    !(i != null && i.enabled) || i.pollIntervalMs <= 0 || (wi = setInterval(() => {
      this.pollForChanges();
    }, i.pollIntervalMs));
  },
  async pollForChanges() {
    try {
      const i = await fetch("/config");
      if (!i.ok) return;
      const t = await i.text();
      if (t !== kr) {
        console.log("[dev] Config changed, reloading...");
        const e = JSON.parse(t);
        xt.value = e, kr = t;
      }
    } catch {
    }
  },
  stopPolling() {
    wi && (clearInterval(wi), wi = null);
  }
}, yA = 4e3, In = Xt([]);
let vA = 1;
const be = {
  get list() {
    return In.value;
  },
  push(i) {
    const t = vA++;
    In.value.push({ id: t, message: i.message, kind: i.kind ?? "info" }), window.setTimeout(() => {
      In.value = In.value.filter((e) => e.id !== t);
    }, yA);
  },
  remove(i) {
    In.value = In.value.filter((t) => t.id !== i);
  }
}, _i = oi(/* @__PURE__ */ new Map());
function jn(i) {
  let t = _i.get(i);
  return t || (t = { revision: 0, rows: [], loading: !1, error: null }, _i.set(i, t)), t;
}
const $i = {
  get caches() {
    return _i;
  },
  invalidate(i) {
    jn(i).revision += 1;
  },
  revision(i) {
    return jn(i).revision;
  },
  rows(i) {
    return jn(i).rows;
  },
  loading(i) {
    return jn(i).loading;
  },
  error(i) {
    return jn(i).error;
  },
  async loadList(i, t, e) {
    const n = jn(i);
    n.loading = !0, n.error = null;
    try {
      const s = await $e.execute(t, e ?? {});
      s.status === "ERROR" ? (n.error = s.error ?? "Command failed", n.rows = []) : n.rows = Array.isArray(s.value) ? s.value : [];
    } catch (s) {
      n.error = String(s), n.rows = [];
    } finally {
      n.loading = !1;
    }
  },
  clearAll() {
    _i.clear();
  },
  refreshAll() {
    _i.forEach((i) => {
      i.revision += 1;
    });
  },
  reportCommandError(i, t) {
    be.push({ message: `Command '${i}' failed: ${String(t)}`, kind: "error" });
  }
};
function wA() {
  const i = oi(/* @__PURE__ */ new Map());
  function t(l, c, u) {
    let h = i.get(l);
    h || (h = /* @__PURE__ */ new Map(), i.set(l, h)), h.set(c, u);
  }
  function e(l, c) {
    const u = n(l, c, !0);
    return t(l, c, !u), !u;
  }
  function n(l, c, u) {
    var h;
    return ((h = i.get(l)) == null ? void 0 : h.get(c)) ?? u;
  }
  function s(l, c) {
    return n(l, c.id, c.visible ?? !0);
  }
  function r(l, c) {
    return c.filter((u) => s(l, u)).sort((u, h) => u.order - h.order);
  }
  function o(l) {
    return Array.isArray(l.layers) && l.layers.length > 0;
  }
  function a(l) {
    t(l.pageId, l.layerId, l.visible);
  }
  return {
    overrides: i,
    setVisible: t,
    toggle: e,
    isVisible: n,
    isLayerVisible: s,
    getVisibleLayers: r,
    hasLayers: o,
    handleLayerEvent: a
  };
}
const xA = wA(), se = oi({
  participants: [],
  localSessionId: null
}), Rn = {
  get participants() {
    return se.participants;
  },
  get count() {
    return se.participants.length;
  },
  get localSessionId() {
    return se.localSessionId;
  },
  get localParticipant() {
    return se.participants.find((i) => i.sessionId === se.localSessionId);
  },
  setLocalSessionId(i) {
    se.localSessionId = i;
  },
  updateParticipants(i) {
    se.participants = i;
  },
  addParticipant(i) {
    se.participants.find((t) => t.sessionId === i.sessionId) || se.participants.push(i);
  },
  removeParticipant(i) {
    se.participants = se.participants.filter((t) => t.sessionId !== i);
  },
  clear() {
    se.participants = [], se.localSessionId = null;
  }
}, We = oi({
  cursors: /* @__PURE__ */ new Map()
}), EA = 1e4, ho = /* @__PURE__ */ new Set();
function xi() {
  for (const i of ho) i();
}
const Vs = {
  get all() {
    return Array.from(We.cursors.values());
  },
  getCursorsForObject(i, t) {
    return this.all.filter((e) => e.entityType === i && e.objectId === t);
  },
  getCursorsBySession(i) {
    return this.all.filter((t) => t.sessionId === i);
  },
  updateCursor(i) {
    We.cursors.set(i.sessionId, {
      ...i,
      lastSeen: Date.now()
    }), xi();
  },
  removeCursor(i) {
    We.cursors.delete(i), xi();
  },
  removeObjectCursors(i, t) {
    for (const [e, n] of We.cursors)
      n.entityType === i && n.objectId === t && We.cursors.delete(e);
    xi();
  },
  purgeStale() {
    const i = Date.now();
    for (const [t, e] of We.cursors)
      i - e.lastSeen > EA && We.cursors.delete(t);
    xi();
  },
  clear() {
    We.cursors.clear(), xi();
  },
  subscribe(i) {
    return ho.add(i), () => {
      ho.delete(i);
    };
  }
}, Rr = Xt("disconnected"), vs = Xt(null);
let ae = null, ps = null;
const $e = {
  get wsStatus() {
    return Rr.value;
  },
  get projectId() {
    return vs.value;
  },
  get isConnected() {
    return Rr.value === "connected";
  },
  get localParticipant() {
    return Rn.localParticipant;
  },
  init() {
    var t;
    const i = ((t = vn.transport) == null ? void 0 : t.wsPath) ?? "/ws";
    ae = new gA(i), ae.onStatusChange = (e) => {
      Rr.value = e, e === "connected" ? (Dr(), ps && OA(ps)) : e === "disconnected" && Rn.clear();
    }, ae.onEvent = (e) => PA(e), ae.connect();
  },
  execute(i, t) {
    return ae ? ae.execute(i, t) : Promise.reject(new Error("Session not initialized"));
  },
  sendRaw(i, t) {
    ae && ae.sendRaw(i, t);
  },
  async createProject() {
    const i = await _r("project.create", null), t = zl(i);
    return vs.value = t, ps = t, $i.refreshAll(), Dr(), t;
  },
  async openProject(i) {
    const t = await _r("project.open", { projectId: i });
    return vs.value = zl(t), ps = i, $i.refreshAll(), Dr(), i;
  },
  async executeCommand(i, t) {
    const e = await _r(i, t);
    return e.status === "ERROR" && $i.reportCommandError(i, e.error ?? "Command failed"), e;
  }
};
function Dr() {
  var i;
  !((i = vn.collaboration) != null && i.enabled) || !ae || ae.sendRaw(ne.CLIENT_IDENTITY, {
    name: CA(),
    color: SA()
  });
}
function CA() {
  const i = ["Swift", "Calm", "Bright", "Bold", "Kind"], t = ["Fox", "Owl", "Bear", "Wolf", "Hawk"], e = i[Math.floor(Math.random() * i.length)], n = t[Math.floor(Math.random() * t.length)];
  return `${e} ${n}`;
}
function SA() {
  return `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`;
}
async function _r(i, t) {
  if (!ae) throw new Error("Session not initialized");
  const e = await ae.execute(i, t);
  if (e.status === "ERROR")
    throw new Error(e.error ?? `Command '${i}' failed`);
  return e;
}
function zl(i) {
  const t = i.value;
  if (t && typeof t.projectId == "string") return t.projectId;
  throw new Error("Command result did not contain projectId");
}
function PA(i) {
  var t;
  switch (i.type) {
    case ne.PROJECT_EVENT: {
      const e = i.payload, n = e.projectId;
      typeof n == "string" && (vs.value = n), e.type === "layer.visibility" && xA.handleLayerEvent({
        pageId: e.pageId,
        layerId: e.layerId,
        visible: e.visible
      }), Oi({ kind: ne.PROJECT_EVENT, payload: e });
      break;
    }
    case ne.OBJECT_CHANGED: {
      const e = i.payload.entityType;
      typeof e == "string" && $i.invalidate(e), Oi({ kind: ne.OBJECT_CHANGED, payload: i.payload });
      break;
    }
    case ne.PRESENCE_LIST: {
      const e = i.payload.participants;
      Array.isArray(e) && Rn.updateParticipants(e);
      break;
    }
    case ne.PRESENCE_JOIN: {
      const e = i.payload;
      e != null && e.sessionId && Rn.addParticipant(e);
      break;
    }
    case ne.PRESENCE_LEAVE: {
      const e = i.payload.sessionId;
      e && (Rn.removeParticipant(e), Vs.removeCursor(e));
      break;
    }
    case ne.CURSOR_UPDATE: {
      const e = i.payload, n = e.sessionId;
      if (n && ((t = vn.collaboration) != null && t.cursorsEnabled)) {
        const s = Rn.participants.find((r) => r.sessionId === n);
        Vs.updateCursor({
          sessionId: n,
          name: e.name ?? (s == null ? void 0 : s.name) ?? "Anonymous",
          color: e.color ?? (s == null ? void 0 : s.color) ?? "#999",
          entityType: e.entityType,
          objectId: e.objectId,
          position: e.position,
          selection: e.selection
        });
      }
      break;
    }
    case ne.ERROR: {
      const e = i.payload.message ?? "Unknown error";
      be.push({ message: e, kind: "error" }), Oi({ kind: ne.ERROR, payload: i.payload });
      break;
    }
    default:
      Oi({ kind: i.type, payload: i.payload });
  }
}
function OA(i) {
  $e.openProject(i).catch(() => {
  });
}
const dd = "rt.locale", AA = /\{\{\s*([^{}\s]+)\s*\}\}/g;
function MA(i) {
  var n;
  if (!i) return "en";
  const t = localStorage.getItem(dd);
  if (t && i.locales.includes(t)) return t;
  const e = (n = navigator.language) == null ? void 0 : n.split("-")[0];
  return e && i.locales.includes(e) ? e : i.defaultLocale;
}
const Lt = oi({
  config: null,
  locale: "en"
});
function fd(i, t) {
  return t ? i.replace(/\{(\w+)\}/g, (e, n) => {
    const s = t[n];
    return s == null ? e : String(s);
  }) : i;
}
function TA(i, t) {
  const e = typeof (t == null ? void 0 : t.count) == "number" ? t.count : void 0;
  if (e !== void 0) {
    const n = e === 1 ? `${i}_one` : `${i}_many`;
    if (NA(n)) return n;
  }
  return i;
}
function NA(i) {
  var e, n;
  const t = ((e = Lt.config) == null ? void 0 : e.messages[Lt.locale]) ?? ((n = Lt.config) == null ? void 0 : n.messages[Lt.config.defaultLocale]);
  return t != null && i in t;
}
function gd(i, t) {
  var s, r;
  const e = ((s = Lt.config) == null ? void 0 : s.messages[Lt.locale]) ?? ((r = Lt.config) == null ? void 0 : r.messages[Lt.config.defaultLocale]) ?? {}, n = TA(i, t);
  return fd(e[n] ?? i, t);
}
function pd(i, t) {
  return i.includes("{{") ? i.replace(AA, (e, n) => gd(n, t)) : i;
}
function fo(i) {
  if (typeof i == "string")
    return pd(i);
  if (Array.isArray(i))
    return i.map((t) => fo(t));
  if (i !== null && typeof i == "object") {
    const t = i, e = {};
    for (const n of Object.keys(t)) e[n] = fo(t[n]);
    return e;
  }
  return i;
}
function IA(i, t, e) {
  var r;
  const n = ((r = Lt.config) == null ? void 0 : r.messages[i]) ?? {}, s = e && typeof e.count == "number" ? `${t}_${e.count === 1 ? "one" : "many"}` : t;
  return fd(n[s] ?? n[t] ?? t, e);
}
const rs = {
  get loaded() {
    return Lt.config !== null;
  },
  get defaultLocale() {
    var i;
    return ((i = Lt.config) == null ? void 0 : i.defaultLocale) ?? "en";
  },
  get locales() {
    var i;
    return ((i = Lt.config) == null ? void 0 : i.locales) ?? ["en"];
  },
  get locale() {
    return Lt.locale;
  },
  t: gd,
  tr: pd,
  deepTranslate: fo,
  /** Initializes from workspace config, respecting stored/browser locale. */
  init(i) {
    Lt.config = i, Lt.locale = MA(i);
  },
  setLocale(i) {
    !Lt.config || !Lt.config.locales.includes(i) || (Lt.locale = i, localStorage.setItem(dd, i));
  },
  /** Available locales other than the current one (for a switcher). */
  otherLocales: Ye(() => {
    var i;
    return ((i = Lt.config) == null ? void 0 : i.locales.filter((t) => t !== Lt.locale)) ?? [];
  }),
  translateFor: IA
};
function jA(i, t) {
  return { ...t, ...i };
}
function LA(i, t) {
  return Ye(() => rs.deepTranslate(jA(i, t)));
}
const qt = Xt(null), me = Xt([]), Oe = Xt([]), Xe = Xt([]);
function Ei(i) {
  return me.value.indexOf(i);
}
const kA = {
  get activePageId() {
    return qt.value;
  },
  get openPages() {
    return me.value;
  },
  get canGoBack() {
    return Oe.value.length > 0;
  },
  get canGoForward() {
    return Xe.value.length > 0;
  },
  init() {
    var t;
    const i = (t = vn.app) == null ? void 0 : t.landingPageId;
    i && this.openPage(i);
  },
  /** Set the active page from a URL deep-link / browser back-forward without touching history stacks. */
  restore(i) {
    i !== qt.value && (Ei(i) === -1 && me.value.push(i), qt.value = i);
  },
  openPage(i) {
    if (i === qt.value) return;
    Ei(i) === -1 && me.value.push(i), qt.value !== null && Oe.value.push(qt.value), Xe.value = [], qt.value = i;
  },
  closeTab(i) {
    const t = Ei(i);
    if (t !== -1 && (me.value.splice(t, 1), Oe.value = Oe.value.filter((e) => e !== i), Xe.value = Xe.value.filter((e) => e !== i), qt.value === i)) {
      const e = me.value[t] ?? me.value[t - 1] ?? null;
      qt.value = e, e && Oe.value.push(e);
    }
  },
  closeOthers(i) {
    me.value = [i], Oe.value = Oe.value.filter((t) => t === i), Xe.value = [], qt.value = i;
  },
  closeAll() {
    me.value = [], Oe.value = [], Xe.value = [], qt.value = null;
  },
  back() {
    const i = Oe.value.pop();
    i !== void 0 && (qt.value !== null && Xe.value.push(qt.value), qt.value = i, Ei(i) === -1 && me.value.push(i));
  },
  forward() {
    const i = Xe.value.pop();
    i !== void 0 && (qt.value !== null && Oe.value.push(qt.value), qt.value = i, Ei(i) === -1 && me.value.push(i));
  }
}, Ae = oi({ overlays: [] });
let Vl = 0;
const ms = /* @__PURE__ */ new Map(), Ln = [];
function RA() {
  return Vl += 1, Vl;
}
const DA = ["menu", "modal", "panel", "tooltip"], _A = ["contextmenu", "dblclick", "selection", "hover", "drag"], $A = ["left", "right", "bottom"], BA = ["top", "right", "bottom", "left"];
function md(i) {
  var t;
  return {
    label: i.label,
    icon: i.icon,
    command: i.command,
    params: i.params,
    spec: i.spec,
    confirm: i.confirm,
    items: (t = i.items) == null ? void 0 : t.map(md),
    divider: i.divider,
    disabled: i.disabled,
    danger: i.danger,
    shortcut: i.shortcut
  };
}
function zA(i) {
  var t;
  return {
    id: i.id,
    kind: DA.includes(i.kind) ? i.kind : "menu",
    title: i.title,
    content: i.content,
    items: (t = i.items) == null ? void 0 : t.map(md),
    width: i.width,
    side: $A.includes(i.side) ? i.side : void 0,
    text: i.text,
    placement: BA.includes(i.placement) ? i.placement : void 0
  };
}
function VA(i) {
  return {
    event: _A.includes(i.event) ? i.event : "contextmenu",
    componentType: i.componentType,
    objectType: i.objectType,
    componentId: i.componentId,
    overlay: i.overlay,
    anchor: i.anchor === "center" ? "center" : "pointer"
  };
}
function FA(i, t) {
  return !(i.event !== t.event || i.componentType && i.componentType.toLowerCase() !== (t.componentType ?? "").toLowerCase() || i.objectType && i.objectType !== t.objectType || i.componentId && i.componentId !== t.componentId);
}
const tn = {
  get overlays() {
    return Ae.overlays;
  },
  /** Registers local (component-level) overlay definitions. Returns an unregister fn. */
  registerDefinitions(i) {
    return i.forEach((t) => ms.set(t.id, t)), () => i.forEach((t) => ms.delete(t.id));
  },
  /** Registers workspace-level overlay definitions (from /config). */
  registerWorkspace(i, t) {
    i.forEach((e) => {
      ms.set(e.id, zA(e));
    }), Ln.length = 0, Ln.push(...t.map(VA));
  },
  registerLocalTriggers(i) {
    Ln.push(...i);
    const t = Ln.length - i.length;
    return () => {
      Ln.splice(t, i.length);
    };
  },
  open(i, t, e = {}) {
    const n = ms.get(i);
    if (!n) return null;
    (n.kind === "menu" ? Ae.overlays.filter((o) => o.definition.kind === "menu") : Ae.overlays.filter((o) => o.definition.kind !== "modal" && o.definition.kind !== "panel")).forEach((o) => {
      const a = Ae.overlays.indexOf(o);
      a >= 0 && Ae.overlays.splice(a, 1);
    });
    const r = {
      uid: RA(),
      overlayId: i,
      definition: n,
      anchor: t,
      context: e
    };
    return Ae.overlays.push(r), r;
  },
  close(i) {
    const t = Ae.overlays.findIndex((e) => e.uid === i);
    t >= 0 && Ae.overlays.splice(t, 1);
  },
  closeAll() {
    Ae.overlays.splice(0, Ae.overlays.length);
  },
  /** Routes a gesture (from GestureListener) to the first matching trigger. Returns true if an overlay opened. */
  onGesture(i) {
    const t = Ln.find((s) => FA(s, i));
    if (!t) return !1;
    const e = t.anchor === "center" ? null : { x: i.x, y: i.y }, n = {
      payload: {
        componentType: i.componentType,
        objectType: i.objectType,
        componentId: i.componentId
      }
    };
    return i.row && (n.row = i.row), tn.open(t.overlay, e, n) !== null;
  },
  /** Executes a menu item with the instance context. */
  async executeMenuItem(i, t) {
    if (!i.disabled) {
      if (i.spec) {
        await WA({ spec: i.spec, confirm: i.confirm }, t.context) && tn.close(t.uid);
        return;
      }
      if (i.command) {
        if (i.confirm && !window.confirm(rs.tr(i.confirm))) return;
        try {
          await $e.executeCommand(i.command, Ki(i.params, t.context)), be.push({ message: `'${i.command}' ok`, kind: "success" });
        } catch {
        }
        tn.close(t.uid);
        return;
      }
      tn.close(t.uid);
    }
  },
  async copyText(i) {
    try {
      await navigator.clipboard.writeText(i), be.push({ message: "Copied to clipboard", kind: "success" });
    } catch {
    }
  }
}, GA = /^\$([\w.]+)$/;
function HA(i, t) {
  const e = i.split(".");
  let n = t[e[0]];
  for (let s = 1; s < e.length && n != null; s++)
    n = n[e[s]];
  return n;
}
function Ji(i, t) {
  if (typeof i == "string") {
    const e = GA.exec(i);
    if (e) {
      const n = HA(e[1], t);
      if (n !== void 0) return n;
    }
    return i;
  }
  if (Array.isArray(i))
    return i.map((e) => Ji(e, t));
  if (i !== null && typeof i == "object") {
    const e = {};
    for (const [n, s] of Object.entries(i))
      e[n] = Ji(s, t);
    return e;
  }
  return i;
}
function Ki(i, t) {
  return i ? Ji(i, t) : {};
}
async function qA(i, t) {
  if (!(i != null && i.command)) return { value: null, error: null };
  try {
    const e = await $e.execute(i.command, Ki(i.params, t));
    return e.status === "ERROR" ? { value: null, error: e.error ?? `Command '${i.command}' failed` } : { value: e.value, error: null };
  } catch (e) {
    return { value: null, error: String(e) };
  }
}
async function UA(i, t) {
  var e;
  switch (i.action) {
    case "navigate":
      return kA.openPage(i.page), !0;
    case "command": {
      try {
        (await $e.executeCommand(i.command, Ki(i.params, t))).status === "SUCCESS" && be.push({ message: `'${i.command}' ok`, kind: "success" });
      } catch {
      }
      return !0;
    }
    case "toast": {
      const n = Ji(i.message, t);
      return be.push({ message: rs.tr(String(n)), kind: "info" }), !0;
    }
    case "openModal":
    case "openPanel":
    case "openMenu":
      return tn.open(i.overlay, i.action === "openMenu" ? { x: 0, y: 0 } : null, t), !0;
    case "closeOverlay":
      return tn.closeAll(), !0;
    case "copyToClipboard": {
      const n = i.value !== void 0 ? String(Ji(i.value, t)) : "";
      return tn.copyText(n), !0;
    }
    case "editor":
      return Oi({
        kind: "editor.command",
        payload: {
          editor: i.editor,
          command: i.command,
          params: Ki(i.params, t),
          componentId: (e = t.payload) == null ? void 0 : e.componentId
        }
      }), !0;
    default:
      return !1;
  }
}
async function WA(i, t) {
  return !i || i.confirm && !window.confirm(rs.tr(i.confirm)) ? !1 : UA(i.spec, t);
}
function XA(i, t) {
  const e = Xt(null), n = Xt(null), s = Xt(!1);
  async function r() {
    const o = i();
    if (!(o != null && o.command)) {
      e.value = null, n.value = null, s.value = !1;
      return;
    }
    s.value = !0;
    const a = await qA(o, t());
    e.value = a.value, n.value = a.error, s.value = !1;
  }
  return $r(
    () => {
      var a;
      const o = (a = i()) == null ? void 0 : a.entityType;
      return o ? $i.revision(o) : 0;
    },
    () => r()
  ), $r(i, () => r()), Fl(() => r()), { value: e, error: n, loading: s, reload: r };
}
const YA = {
  key: 0,
  class: "ui-diagram__toolbar"
}, JA = ["title", "onClick"], KA = { class: "ui-diagram__body" }, ZA = {
  key: 0,
  class: "ui-diagram__stencil",
  "aria-label": "Stencil"
}, QA = ["onMousedown"], tM = /* @__PURE__ */ Pd({
  __name: "UiDiagram",
  props: {
    config: {},
    context: {}
  },
  setup(i) {
    const t = i, e = rs.t, n = LA(t.config, {
      grid: !0,
      panning: !0,
      mousewheel: !1,
      snap: !0
    }), s = Xt(null), r = Xt(null), o = Ye(() => n.value.id), a = Ye(() => !n.value.readonly && n.value.disabled !== !0), l = Ye(() => n.value.height), c = Ye(() => n.value.content), { value: u, error: h } = XA(
      () => c.value,
      () => t.context ?? {}
    );
    let d = !1, f = !1, g = null, p = null, m = null, y = null;
    const v = Xt(!1), b = Xt(!1), w = Xt(null);
    let E = null, S = null;
    const C = { rx: 6, ry: 6, strokeWidth: 1.5 }, P = { fontSize: 13, fontFamily: "system-ui, sans-serif" }, O = ["addRect", "addEllipse", "addEdge", "delete", "fit", "layout", "undo", "redo"], I = Ye(() => n.value.toolbar === !1 ? [] : n.value.toolbar ?? O), T = Ye(() => {
      var M;
      return ((M = n.value.stencil) == null ? void 0 : M.nodes) ?? [];
    });
    function k(M) {
      const L = {
        id: M.id,
        x: M.position().x,
        y: M.position().y,
        width: M.size().width,
        height: M.size().height
      }, F = M.shape;
      return F === "image" ? (L.shape = "image", L.imageUrl = M.attr("image/xlink:href") ?? void 0) : (L.shape = F === "ellipse" ? "ellipse" : "rect", L.label = M.attr("label/text") ?? void 0, L.fill = M.attr("body/fill") ?? void 0, L.stroke = M.attr("body/stroke") ?? void 0, L.color = M.attr("label/fill") ?? void 0), L;
    }
    function H() {
      if (!r.value) return "";
      const M = {
        nodes: r.value.getNodes().map(k),
        edges: r.value.getEdges().map((L) => {
          const F = L.getSourceCell(), J = L.getTargetCell();
          return {
            id: L.id,
            source: F instanceof vt ? F.id : L.getSourceCellId() ?? "",
            target: J instanceof vt ? J.id : L.getTargetCellId() ?? "",
            label: L.attr("label/text") ?? void 0,
            color: L.attr("line/stroke") ?? void 0
          };
        })
      };
      return JSON.stringify(M);
    }
    function $() {
      var M;
      !a.value || !((M = n.value.save) != null && M.command) || (p && clearTimeout(p), p = setTimeout(() => {
        A();
      }, 600));
    }
    async function A() {
      var L;
      if (!((L = n.value.save) != null && L.command)) return;
      const M = { ...n.value.save.params ?? {}, content: H() };
      try {
        await $e.executeCommand(n.value.save.command, Ki(M, t.context ?? {})), be.push({ message: e("core.editor.saved"), kind: "success" });
      } catch {
      }
    }
    function N(M) {
      const L = M.width ?? 140, F = M.height ?? 48;
      return M.shape === "image" ? {
        id: M.id,
        shape: "image",
        x: M.x ?? 0,
        y: M.y ?? 0,
        width: L,
        height: F,
        attrs: {
          image: {
            "xlink:href": M.imageUrl ?? "",
            width: L,
            height: F,
            magnet: !0
          }
        }
      } : {
        id: M.id,
        shape: M.shape === "ellipse" ? "ellipse" : "rect",
        x: M.x ?? 0,
        y: M.y ?? 0,
        width: L,
        height: F,
        attrs: {
          body: {
            ...C,
            fill: M.fill ?? (M.shape === "ellipse" ? "#eef4ff" : "#f6f8fb"),
            stroke: M.stroke ?? "#94a3b8",
            magnet: !0
          },
          label: {
            ...P,
            text: M.label ?? "",
            fill: M.color ?? "#1e293b"
          }
        }
      };
    }
    function V(M) {
      const L = M.line && M.line !== "rounded" ? { name: M.line } : void 0, F = M.line === "manhattan" || M.line === "metro" ? { name: "rounded" } : { name: M.line ?? "rounded" };
      return {
        id: M.id,
        source: M.source,
        target: M.target,
        router: L,
        connector: F,
        attrs: {
          line: { stroke: M.color ?? "#64748b", strokeWidth: 2 },
          label: { text: M.label ?? "", fontSize: 12 }
        }
      };
    }
    function it(M) {
      var L;
      if (r.value) {
        r.value.clearCells();
        for (const F of M.nodes ?? [])
          r.value.addNode(N(F));
        for (const F of M.edges ?? [])
          r.value.addEdge(V(F));
        (L = M.nodes) != null && L.length && r.value.zoomToFit({ padding: 24, maxScale: 1.5 });
      }
    }
    $r(
      () => u.value,
      (M) => {
        if (!(M == null || d) && r.value)
          try {
            it(JSON.parse(String(M))), d = !0;
          } catch {
          }
      }
    );
    function Q(M) {
      if (!r.value || !a.value) return;
      const L = {
        x: 60 + Math.round(Math.random() * 180),
        y: 60 + Math.round(Math.random() * 120),
        width: 140,
        height: 48
      }, F = {
        id: `${M}_${Date.now()}`,
        shape: M,
        ...L,
        label: M === "ellipse" ? "Ellipse" : "Rectangle"
      };
      r.value.addNode(N(F)), $();
    }
    function dt() {
      !r.value || !a.value || (f = !0, g = null, be.push({ message: e("core.editor.diagram.pickSource"), kind: "info" }));
    }
    function _() {
      !r.value || !a.value || (r.value.getSelectedCells().forEach((M) => M.remove()), $());
    }
    function Z(M) {
      if (r.value && M instanceof vt) {
        const L = M.position();
        r.value.addNode(
          N({
            ...k(M),
            id: `${M.shape}_${Date.now()}`,
            x: L.x + 24,
            y: L.y + 24
          })
        );
      }
    }
    function tt(M) {
      var J;
      if (M.editor !== "diagram" || M.componentId && M.componentId !== o.value || !r.value || !a.value) return;
      const L = (J = M.params) == null ? void 0 : J.id, F = L ? r.value.getCellById(L) : null;
      if (F)
        switch (M.command) {
          case "delete":
            F.remove(), $();
            break;
          case "duplicate":
            Z(F), $();
            break;
          case "front":
            F.toFront(), $();
            break;
          case "back":
            F.toBack(), $();
            break;
        }
    }
    function W() {
      var M;
      (M = r.value) == null || M.zoomToFit({ padding: 24, maxScale: 2 });
    }
    function st() {
      var Ht, yt;
      const M = r.value;
      if (!M) return;
      const L = M.getNodes();
      if (L.length === 0) return;
      const F = [...L].sort((et, ht) => {
        const te = et.position(), jt = ht.position();
        return te.y - jt.y || te.x - jt.x;
      }), J = Math.max(1, Math.ceil(Math.sqrt(L.length))), bt = ((Ht = n.value.layout) == null ? void 0 : Ht.gapX) ?? 40, X = ((yt = n.value.layout) == null ? void 0 : yt.gapY) ?? 40, ot = Math.max(...F.map((et) => et.size().width)) + bt, At = Math.max(...F.map((et) => et.size().height)) + X;
      F.forEach((et, ht) => {
        const te = ht % J, jt = Math.floor(ht / J);
        et.position(te * ot, jt * At);
      });
    }
    function Pt() {
      var J, bt;
      const M = r.value;
      if (!M) return;
      const L = M.getNodes();
      if (L.length === 0) return;
      const F = new $l.graphlib.Graph();
      F.setDefaultEdgeLabel(() => ({})), F.setGraph({
        rankdir: "LR",
        nodesep: ((J = n.value.layout) == null ? void 0 : J.gapX) ?? 40,
        ranksep: ((bt = n.value.layout) == null ? void 0 : bt.gapY) ?? 40
      }), L.forEach((X) => F.setNode(X.id, { width: X.size().width, height: X.size().height })), M.getEdges().forEach((X) => {
        const ot = X.getSourceCellId(), At = X.getTargetCellId();
        ot && At && F.setEdge(ot, At);
      }), $l.layout(F), L.forEach((X) => {
        const ot = F.node(X.id);
        ot && X.position(ot.x - X.size().width / 2, ot.y - X.size().height / 2);
      });
    }
    function Y() {
      var et;
      const M = r.value;
      if (!M) return;
      const L = M.getNodes();
      if (L.length === 0) return;
      const F = L.length, J = ((et = n.value.layout) == null ? void 0 : et.gapX) ?? 60, bt = Math.max(...L.map((ht) => ht.size().width)), X = Math.max(...L.map((ht) => ht.size().height)), ot = F <= 1 ? 0 : Math.max((bt + X) / 2 + J, F * (bt + J) / (2 * Math.PI)), At = bt / 2, Ht = X / 2;
      [...L].sort((ht, te) => ht.id.localeCompare(te.id)).forEach((ht, te) => {
        const jt = 2 * Math.PI * te / F - Math.PI / 2;
        ht.position(At + ot * Math.cos(jt) - ht.size().width / 2, Ht + ot * Math.sin(jt) - ht.size().height / 2);
      });
    }
    function Ot() {
      var L;
      if (!r.value || !a.value) return;
      const M = ((L = n.value.layout) == null ? void 0 : L.type) ?? "grid";
      M === "dagre" ? Pt() : M === "circle" ? Y() : st(), $();
    }
    function Qt() {
      var M, L;
      v.value = ((M = r.value) == null ? void 0 : M.canUndo()) ?? !1, b.value = ((L = r.value) == null ? void 0 : L.canRedo()) ?? !1;
    }
    function Gt(M, L, F) {
      var X, ot, At, Ht, yt, et;
      if (!((X = vn.collaboration) != null && X.cursorsEnabled)) return;
      const J = ((ot = n.value.content) == null ? void 0 : ot.entityType) ?? "", bt = ((Ht = (At = t.context) == null ? void 0 : At.row) == null ? void 0 : Ht.id) ?? "";
      !J || !bt || $e.sendRaw("cursor.update", {
        entityType: J,
        objectId: bt,
        position: { nodeId: M, x: L, y: F },
        selection: { nodeId: M },
        name: ((yt = $e.localParticipant) == null ? void 0 : yt.name) ?? "Anonymous",
        color: ((et = $e.localParticipant) == null ? void 0 : et.color) ?? "#999"
      });
    }
    function fr(M, L, F) {
      E && clearTimeout(E), E = setTimeout(() => Gt(M, L, F), 100);
    }
    function gr() {
      var ot, At, Ht;
      if (!w.value || !r.value) return;
      const M = w.value, L = ((ot = n.value.content) == null ? void 0 : ot.entityType) ?? "", F = ((Ht = (At = t.context) == null ? void 0 : At.row) == null ? void 0 : Ht.id) ?? "", J = Vs.getCursorsForObject(L, F), bt = /* @__PURE__ */ new Map();
      for (const yt of Array.from(M.children)) {
        const et = yt, ht = et.dataset.cursorSession;
        ht && bt.set(ht, et);
      }
      const X = /* @__PURE__ */ new Set();
      for (const yt of J) {
        X.add(yt.sessionId);
        const et = yt.position;
        if (!et) continue;
        let ht, te;
        if (et.nodeId) {
          const pe = r.value.getCellById(et.nodeId);
          if (!(pe instanceof vt)) continue;
          const re = pe.position(), bi = r.value.zoom(), yi = r.value.translate();
          ht = (re.x + (et.x ?? 0)) * bi + yi.x, te = (re.y + (et.y ?? 0)) * bi + yi.y;
        } else {
          const pe = r.value.zoom(), re = r.value.translate();
          ht = (et.x ?? 0) * pe + re.x, te = (et.y ?? 0) * pe + re.y;
        }
        let jt = bt.get(yt.sessionId);
        if (!jt) {
          jt = document.createElement("div"), jt.className = "diagram-remote-cursor", jt.dataset.cursorSession = yt.sessionId;
          const pe = document.createElement("div");
          pe.className = "diagram-remote-cursor__dot", pe.style.background = yt.color;
          const re = document.createElement("span");
          re.className = "diagram-remote-cursor__label", re.style.background = yt.color, re.textContent = yt.name, jt.appendChild(pe), jt.appendChild(re), M.appendChild(jt);
        }
        jt.style.left = `${ht}px`, jt.style.top = `${te}px`, jt.style.display = "";
      }
      for (const [yt, et] of bt)
        X.has(yt) || (et.style.display = "none");
    }
    function ta() {
      var M;
      (M = r.value) == null || M.undo(), Qt();
    }
    function ea() {
      var M;
      (M = r.value) == null || M.redo(), Qt();
    }
    function bd() {
      !r.value || !a.value || r.value.copy(r.value.getSelectedCells());
    }
    function yd() {
      !r.value || !a.value || (r.value.paste({ offset: 32 }), $());
    }
    function vd() {
      !r.value || !a.value || (r.value.cut(r.value.getSelectedCells()), $());
    }
    function wd(M) {
      var F;
      const L = {
        id: `stencil_${Date.now().toString(36)}_${Math.floor(Math.random() * 1e6)}`,
        shape: M.shape ?? "rect",
        x: 0,
        y: 0,
        width: M.width,
        height: M.height,
        label: M.label,
        fill: M.fill,
        stroke: M.stroke,
        color: M.color,
        imageUrl: M.imageUrl
      };
      return (F = r.value) == null ? void 0 : F.createNode(N(L));
    }
    function xd(M, L) {
      !a.value || !r.value || !y || y.start(wd(M), L);
    }
    function Ed() {
      const M = s.value;
      if (!M) return;
      const L = new j({
        container: M,
        grid: n.value.grid ? { size: 10, visible: !0 } : !1,
        panning: n.value.panning ? { enabled: !0, eventTypes: ["leftMouseDown", "mouseWheel"] } : !1,
        mousewheel: n.value.mousewheel ? { enabled: !0, modifiers: ["ctrl", "meta"], minScale: 0.2, maxScale: 3 } : !1,
        interacting: () => a.value,
        connecting: {
          snap: !0,
          allowBlank: !1,
          allowLoop: !1,
          allowNode: !0,
          router: { name: "manhattan" },
          connector: { name: "rounded" },
          connectionPoint: "boundary"
        },
        background: { color: "#ffffff" }
      });
      L.use(new ii({ enabled: a.value, multiple: !0, rubberband: !0 })), L.use(new kh({ enabled: !0 })), n.value.history !== !1 && (L.use(new si({ enabled: !0 })), L.on("history:change", Qt), Qt());
      const J = new $h();
      L.use(J), J.bindKey(["meta+z", "ctrl+z"], () => (ta(), !1)), J.bindKey(["meta+shift+z", "ctrl+shift+z", "meta+y", "ctrl+y"], () => (ea(), !1)), J.bindKey(["backspace", "delete"], () => (_(), !1)), J.bindKey(["meta+c", "ctrl+c"], () => (bd(), !1)), J.bindKey(["meta+v", "ctrl+v"], () => (yd(), !1)), J.bindKey(["meta+x", "ctrl+x"], () => (vd(), !1));
      const bt = new Bh();
      if (L.use(bt), y = new Sn({ target: L, scaled: !0 }), L.on("cell:click", () => {
        if (!f || !g) return;
        const X = L.getSelectedCells().find((ot) => ot instanceof vt);
        X && X.id !== g.id && (L.addEdge(
          V({ source: g.id, target: X.id, line: "rounded" })
        ), f = !1, g = null, $(), be.push({ message: e("core.editor.diagram.edgeAdded"), kind: "success" }));
      }), L.on("blank:click", () => {
        f = !1, g = null;
      }), L.on("node:mousedown", (X) => {
        f && (g = X.node, be.push({ message: e("core.editor.diagram.pickTarget"), kind: "info" }));
      }), L.on("node:contextmenu", ({ node: X, e: ot }) => {
        const At = ot;
        tn.onGesture({
          event: "contextmenu",
          componentType: "Diagram",
          objectType: "diagram.node",
          componentId: o.value,
          row: { id: X.id, label: X.attr("label/text") ?? X.id },
          x: At.clientX,
          y: At.clientY
        }) && (ot.preventDefault(), ot.stopPropagation());
      }), L.on("cell:added", () => $()), L.on("cell:removed", () => $()), L.on("cell:change:position", () => $()), L.on("cell:change:size", () => $()), L.on("cell:change:attrs", () => $()), L.on("edge:connected", () => $()), L.on("node:mousemove", ({ node: X, e: ot }) => {
        var bi, yi, na;
        if (!((bi = vn.collaboration) != null && bi.cursorsEnabled)) return;
        const At = ot, Ht = X.position(), yt = X.size(), et = L.zoom(), ht = L.translate(), te = Ht.x * et + ht.x, jt = Ht.y * et + ht.y, pe = (At.clientX - (((yi = s.value) == null ? void 0 : yi.getBoundingClientRect().left) ?? 0) - te) / et, re = (At.clientY - (((na = s.value) == null ? void 0 : na.getBoundingClientRect().top) ?? 0) - jt) / et;
        fr(X.id, Math.max(0, Math.min(pe, yt.width)), Math.max(0, Math.min(re, yt.height)));
      }), S = Vs.subscribe(gr), r.value = L, u.value != null)
        try {
          it(JSON.parse(String(u.value))), d = !0;
        } catch {
        }
    }
    Fl(() => {
      Od(Ed), h.value && be.push({ message: h.value, kind: "error" }), m = bA((M) => {
        M.kind === "editor.command" && tt(M.payload);
      });
    }), Ad(() => {
      var M;
      p && clearTimeout(p), E && clearTimeout(E), m == null || m(), S == null || S(), (M = r.value) == null || M.dispose(), r.value = null;
    });
    const mi = {
      addRect: { label: e("core.editor.diagram.addRect"), icon: "▭", action: () => Q("rect") },
      addEllipse: { label: e("core.editor.diagram.addEllipse"), icon: "◯", action: () => Q("ellipse") },
      addEdge: {
        label: e("core.editor.diagram.addEdge"),
        icon: "↔",
        action: () => dt(),
        active: () => f
      },
      delete: { label: e("core.editor.diagram.delete"), icon: "✕", action: () => _() },
      fit: { label: e("core.editor.diagram.fit"), icon: "⛶", action: () => W() },
      layout: { label: e("core.editor.diagram.layout"), icon: "▦", action: () => Ot() },
      undo: { label: e("core.editor.undo"), icon: "↩", action: () => ta(), disabled: () => !v.value },
      redo: { label: e("core.editor.redo"), icon: "↪", action: () => ea(), disabled: () => !b.value }
    };
    return (M, L) => {
      var F;
      return qe(), Ue("div", {
        class: "ui-diagram",
        style: Md(l.value ? { height: l.value } : void 0),
        "data-gesture-type": "Diagram"
      }, [
        I.value.length ? (qe(), Ue("div", YA, [
          (qe(!0), Ue(ia, null, sa(I.value, (J) => {
            var bt, X, ot, At, Ht, yt;
            return qe(), Ue("button", {
              key: J,
              class: pr(["ui-diagram__btn", { "ui-diagram__btn--active": (X = (bt = mi[J]) == null ? void 0 : bt.active) == null ? void 0 : X.call(bt), "ui-diagram__btn--disabled": !a.value && J !== "fit" || ((At = (ot = mi[J]) == null ? void 0 : ot.disabled) == null ? void 0 : At.call(ot)) }]),
              title: (Ht = mi[J]) == null ? void 0 : Ht.label,
              onClick: (et) => {
                var ht;
                return (ht = mi[J]) == null ? void 0 : ht.action();
              }
            }, ra((yt = mi[J]) == null ? void 0 : yt.icon), 11, JA);
          }), 128))
        ])) : mr("", !0),
        oa("div", KA, [
          T.value.length ? (qe(), Ue("aside", ZA, [
            (qe(!0), Ue(ia, null, sa(T.value, (J, bt) => (qe(), Ue("div", {
              key: bt,
              class: pr(["ui-diagram__stencil-item", { "ui-diagram__stencil-item--disabled": !a.value }]),
              onMousedown: (X) => xd(J, X)
            }, ra(J.label ?? "Node"), 43, QA))), 128))
          ])) : mr("", !0),
          oa("div", {
            class: pr(["ui-diagram__canvas", { "ui-diagram__canvas--readonly": !a.value }]),
            ref_key: "hostEl",
            ref: s
          }, [
            (F = Td(vn).collaboration) != null && F.cursorsEnabled ? (qe(), Ue("div", {
              key: 0,
              ref_key: "cursorOverlayEl",
              ref: w,
              class: "ui-diagram__cursor-overlay"
            }, null, 512)) : mr("", !0)
          ], 2)
        ])
      ], 4);
    };
  }
}), eM = (i, t) => {
  const e = i.__vccOpts || i;
  for (const [n, s] of t)
    e[n] = s;
  return e;
}, lM = /* @__PURE__ */ eM(tM, [["__scopeId", "data-v-47207a81"]]);
export {
  lM as default
};
