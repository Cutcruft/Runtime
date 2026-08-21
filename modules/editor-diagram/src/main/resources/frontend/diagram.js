var Pu = Object.defineProperty;
var Au = (i, t, e) => t in i ? Pu(i, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : i[t] = e;
var Tt = (i, t, e) => Au(i, typeof t != "symbol" ? t + "" : t, e);
import { jsxs as mo, jsx as dn } from "preact/jsx-runtime";
import { useSignal as $s, computed as Ii } from "@preact/signals";
import { useRef as bo, useEffect as Mu } from "preact/hooks";
import { i18nStore as Tu, useCfg as Nu, useData as Lu, toasts as Kn, subscribeEvent as Iu, configStore as _s, overlayService as ju, cursorStore as yo, sessionStore as ji, resolveParams as ku } from "@cutcrft/plugin-sdk";
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
class Ut {
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
})(Ut || (Ut = {}));
class vo {
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
})(vo || (vo = {}));
var Ka = typeof global == "object" && global && global.Object === Object && global, Ru = typeof self == "object" && self && self.Object === Object && self, pe = Ka || Ru || Function("return this")(), re = pe.Symbol, Za = Object.prototype, Du = Za.hasOwnProperty, $u = Za.toString, Zn = re ? re.toStringTag : void 0;
function _u(i) {
  var t = Du.call(i, Zn), e = i[Zn];
  try {
    i[Zn] = void 0;
    var n = !0;
  } catch {
  }
  var s = $u.call(i);
  return n && (t ? i[Zn] = e : delete i[Zn]), s;
}
var Bu = Object.prototype, zu = Bu.toString;
function Vu(i) {
  return zu.call(i);
}
var Fu = "[object Null]", Gu = "[object Undefined]", wo = re ? re.toStringTag : void 0;
function qe(i) {
  return i == null ? i === void 0 ? Gu : Fu : wo && wo in Object(i) ? _u(i) : Vu(i);
}
function de(i) {
  return i != null && typeof i == "object";
}
var Hu = "[object Symbol]";
function xe(i) {
  return typeof i == "symbol" || de(i) && qe(i) == Hu;
}
function Gi(i, t) {
  for (var e = -1, n = i == null ? 0 : i.length, s = Array(n); ++e < n; )
    s[e] = t(i[e], e, i);
  return s;
}
var qt = Array.isArray, xo = re ? re.prototype : void 0, Eo = xo ? xo.toString : void 0;
function Qa(i) {
  if (typeof i == "string")
    return i;
  if (qt(i))
    return Gi(i, Qa) + "";
  if (xe(i))
    return Eo ? Eo.call(i) : "";
  var t = i + "";
  return t == "0" && 1 / i == -1 / 0 ? "-0" : t;
}
var qu = /\s/;
function Uu(i) {
  for (var t = i.length; t-- && qu.test(i.charAt(t)); )
    ;
  return t;
}
var Wu = /^\s+/;
function Xu(i) {
  return i && i.slice(0, Uu(i) + 1).replace(Wu, "");
}
function vt(i) {
  var t = typeof i;
  return i != null && (t == "object" || t == "function");
}
var Co = NaN, Yu = /^[-+]0x[0-9a-f]+$/i, Ju = /^0b[01]+$/i, Ku = /^0o[0-7]+$/i, Zu = parseInt;
function ni(i) {
  if (typeof i == "number")
    return i;
  if (xe(i))
    return Co;
  if (vt(i)) {
    var t = typeof i.valueOf == "function" ? i.valueOf() : i;
    i = vt(t) ? t + "" : t;
  }
  if (typeof i != "string")
    return i === 0 ? i : +i;
  i = Xu(i);
  var e = Ju.test(i);
  return e || Ku.test(i) ? Zu(i.slice(2), e ? 2 : 8) : Yu.test(i) ? Co : +i;
}
function Bn(i) {
  return i;
}
var Qu = "[object AsyncFunction]", td = "[object Function]", ed = "[object GeneratorFunction]", nd = "[object Proxy]";
function Ar(i) {
  if (!vt(i))
    return !1;
  var t = qe(i);
  return t == td || t == ed || t == Qu || t == nd;
}
var Bs = pe["__core-js_shared__"], So = function() {
  var i = /[^.]+$/.exec(Bs && Bs.keys && Bs.keys.IE_PROTO || "");
  return i ? "Symbol(src)_1." + i : "";
}();
function id(i) {
  return !!So && So in i;
}
var sd = Function.prototype, rd = sd.toString;
function an(i) {
  if (i != null) {
    try {
      return rd.call(i);
    } catch {
    }
    try {
      return i + "";
    } catch {
    }
  }
  return "";
}
var od = /[\\^$.*+?()[\]{}|]/g, ad = /^\[object .+?Constructor\]$/, ld = Function.prototype, cd = Object.prototype, hd = ld.toString, ud = cd.hasOwnProperty, dd = RegExp(
  "^" + hd.call(ud).replace(od, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function fd(i) {
  if (!vt(i) || id(i))
    return !1;
  var t = Ar(i) ? dd : ad;
  return t.test(an(i));
}
function gd(i, t) {
  return i == null ? void 0 : i[t];
}
function ln(i, t) {
  var e = gd(i, t);
  return fd(e) ? e : void 0;
}
var nr = ln(pe, "WeakMap"), Oo = Object.create, pd = /* @__PURE__ */ function() {
  function i() {
  }
  return function(t) {
    if (!vt(t))
      return {};
    if (Oo)
      return Oo(t);
    i.prototype = t;
    var e = new i();
    return i.prototype = void 0, e;
  };
}();
function tl(i, t, e) {
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
function md() {
}
function el(i, t) {
  var e = -1, n = i.length;
  for (t || (t = Array(n)); ++e < n; )
    t[e] = i[e];
  return t;
}
var bd = 800, yd = 16, vd = Date.now;
function wd(i) {
  var t = 0, e = 0;
  return function() {
    var n = vd(), s = yd - (n - e);
    if (e = n, s > 0) {
      if (++t >= bd)
        return arguments[0];
    } else
      t = 0;
    return i.apply(void 0, arguments);
  };
}
function xd(i) {
  return function() {
    return i;
  };
}
var qi = function() {
  try {
    var i = ln(Object, "defineProperty");
    return i({}, "", {}), i;
  } catch {
  }
}(), Ed = qi ? function(i, t) {
  return qi(i, "toString", {
    configurable: !0,
    enumerable: !1,
    value: xd(t),
    writable: !0
  });
} : Bn, nl = wd(Ed);
function Cd(i, t) {
  for (var e = -1, n = i == null ? 0 : i.length; ++e < n && t(i[e], e, i) !== !1; )
    ;
  return i;
}
function Sd(i, t, e, n) {
  for (var s = i.length, r = e + -1; ++r < s; )
    if (t(i[r], r, i))
      return r;
  return -1;
}
function Od(i) {
  return i !== i;
}
function Pd(i, t, e) {
  for (var n = e - 1, s = i.length; ++n < s; )
    if (i[n] === t)
      return n;
  return -1;
}
function Ad(i, t, e) {
  return t === t ? Pd(i, t, e) : Sd(i, Od, e);
}
function il(i, t) {
  var e = i == null ? 0 : i.length;
  return !!e && Ad(i, t, 0) > -1;
}
var Md = 9007199254740991, Td = /^(?:0|[1-9]\d*)$/;
function ds(i, t) {
  var e = typeof i;
  return t = t ?? Md, !!t && (e == "number" || e != "symbol" && Td.test(i)) && i > -1 && i % 1 == 0 && i < t;
}
function fs(i, t, e) {
  t == "__proto__" && qi ? qi(i, t, {
    configurable: !0,
    enumerable: !0,
    value: e,
    writable: !0
  }) : i[t] = e;
}
function zn(i, t) {
  return i === t || i !== i && t !== t;
}
var Nd = Object.prototype, Ld = Nd.hasOwnProperty;
function Mr(i, t, e) {
  var n = i[t];
  (!(Ld.call(i, t) && zn(n, e)) || e === void 0 && !(t in i)) && fs(i, t, e);
}
function Ci(i, t, e, n) {
  var s = !e;
  e || (e = {});
  for (var r = -1, o = t.length; ++r < o; ) {
    var a = t[r], l = void 0;
    l === void 0 && (l = i[a]), s ? fs(e, a, l) : Mr(e, a, l);
  }
  return e;
}
var Po = Math.max;
function sl(i, t, e) {
  return t = Po(t === void 0 ? i.length - 1 : t, 0), function() {
    for (var n = arguments, s = -1, r = Po(n.length - t, 0), o = Array(r); ++s < r; )
      o[s] = n[t + s];
    s = -1;
    for (var a = Array(t + 1); ++s < t; )
      a[s] = n[s];
    return a[t] = e(o), tl(i, this, a);
  };
}
function Vn(i, t) {
  return nl(sl(i, t, Bn), i + "");
}
var Id = 9007199254740991;
function Tr(i) {
  return typeof i == "number" && i > -1 && i % 1 == 0 && i <= Id;
}
function cn(i) {
  return i != null && Tr(i.length) && !Ar(i);
}
function Ui(i, t, e) {
  if (!vt(e))
    return !1;
  var n = typeof t;
  return (n == "number" ? cn(e) && ds(t, e.length) : n == "string" && t in e) ? zn(e[t], i) : !1;
}
function rl(i) {
  return Vn(function(t, e) {
    var n = -1, s = e.length, r = s > 1 ? e[s - 1] : void 0, o = s > 2 ? e[2] : void 0;
    for (r = i.length > 3 && typeof r == "function" ? (s--, r) : void 0, o && Ui(e[0], e[1], o) && (r = s < 3 ? void 0 : r, s = 1), t = Object(t); ++n < s; ) {
      var a = e[n];
      a && i(t, a, n, r);
    }
    return t;
  });
}
var jd = Object.prototype;
function gs(i) {
  var t = i && i.constructor, e = typeof t == "function" && t.prototype || jd;
  return i === e;
}
function kd(i, t) {
  for (var e = -1, n = Array(i); ++e < i; )
    n[e] = t(e);
  return n;
}
var Rd = "[object Arguments]";
function Ao(i) {
  return de(i) && qe(i) == Rd;
}
var ol = Object.prototype, Dd = ol.hasOwnProperty, $d = ol.propertyIsEnumerable, mn = Ao(/* @__PURE__ */ function() {
  return arguments;
}()) ? Ao : function(i) {
  return de(i) && Dd.call(i, "callee") && !$d.call(i, "callee");
};
function _d() {
  return !1;
}
var al = typeof exports == "object" && exports && !exports.nodeType && exports, Mo = al && typeof module == "object" && module && !module.nodeType && module, Bd = Mo && Mo.exports === al, To = Bd ? pe.Buffer : void 0, zd = To ? To.isBuffer : void 0, bn = zd || _d, Vd = "[object Arguments]", Fd = "[object Array]", Gd = "[object Boolean]", Hd = "[object Date]", qd = "[object Error]", Ud = "[object Function]", Wd = "[object Map]", Xd = "[object Number]", Yd = "[object Object]", Jd = "[object RegExp]", Kd = "[object Set]", Zd = "[object String]", Qd = "[object WeakMap]", tf = "[object ArrayBuffer]", ef = "[object DataView]", nf = "[object Float32Array]", sf = "[object Float64Array]", rf = "[object Int8Array]", of = "[object Int16Array]", af = "[object Int32Array]", lf = "[object Uint8Array]", cf = "[object Uint8ClampedArray]", hf = "[object Uint16Array]", uf = "[object Uint32Array]", ft = {};
ft[nf] = ft[sf] = ft[rf] = ft[of] = ft[af] = ft[lf] = ft[cf] = ft[hf] = ft[uf] = !0;
ft[Vd] = ft[Fd] = ft[tf] = ft[Gd] = ft[ef] = ft[Hd] = ft[qd] = ft[Ud] = ft[Wd] = ft[Xd] = ft[Yd] = ft[Jd] = ft[Kd] = ft[Zd] = ft[Qd] = !1;
function df(i) {
  return de(i) && Tr(i.length) && !!ft[qe(i)];
}
function ps(i) {
  return function(t) {
    return i(t);
  };
}
var ll = typeof exports == "object" && exports && !exports.nodeType && exports, ii = ll && typeof module == "object" && module && !module.nodeType && module, ff = ii && ii.exports === ll, zs = ff && Ka.process, yn = function() {
  try {
    var i = ii && ii.require && ii.require("util").types;
    return i || zs && zs.binding && zs.binding("util");
  } catch {
  }
}(), No = yn && yn.isTypedArray, ms = No ? ps(No) : df, gf = Object.prototype, pf = gf.hasOwnProperty;
function cl(i, t) {
  var e = qt(i), n = !e && mn(i), s = !e && !n && bn(i), r = !e && !n && !s && ms(i), o = e || n || s || r, a = o ? kd(i.length, String) : [], l = a.length;
  for (var c in i)
    (t || pf.call(i, c)) && !(o && // Safari 9 has enumerable `arguments.length` in strict mode.
    (c == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
    s && (c == "offset" || c == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
    r && (c == "buffer" || c == "byteLength" || c == "byteOffset") || // Skip index properties.
    ds(c, l))) && a.push(c);
  return a;
}
function hl(i, t) {
  return function(e) {
    return i(t(e));
  };
}
var mf = hl(Object.keys, Object), bf = Object.prototype, yf = bf.hasOwnProperty;
function ul(i) {
  if (!gs(i))
    return mf(i);
  var t = [];
  for (var e in Object(i))
    yf.call(i, e) && e != "constructor" && t.push(e);
  return t;
}
function Si(i) {
  return cn(i) ? cl(i) : ul(i);
}
function vf(i) {
  var t = [];
  if (i != null)
    for (var e in Object(i))
      t.push(e);
  return t;
}
var wf = Object.prototype, xf = wf.hasOwnProperty;
function Ef(i) {
  if (!vt(i))
    return vf(i);
  var t = gs(i), e = [];
  for (var n in i)
    n == "constructor" && (t || !xf.call(i, n)) || e.push(n);
  return e;
}
function Fn(i) {
  return cn(i) ? cl(i, !0) : Ef(i);
}
var Cf = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, Sf = /^\w*$/;
function Nr(i, t) {
  if (qt(i))
    return !1;
  var e = typeof i;
  return e == "number" || e == "symbol" || e == "boolean" || i == null || xe(i) ? !0 : Sf.test(i) || !Cf.test(i) || t != null && i in Object(t);
}
var di = ln(Object, "create");
function Of() {
  this.__data__ = di ? di(null) : {}, this.size = 0;
}
function Pf(i) {
  var t = this.has(i) && delete this.__data__[i];
  return this.size -= t ? 1 : 0, t;
}
var Af = "__lodash_hash_undefined__", Mf = Object.prototype, Tf = Mf.hasOwnProperty;
function Nf(i) {
  var t = this.__data__;
  if (di) {
    var e = t[i];
    return e === Af ? void 0 : e;
  }
  return Tf.call(t, i) ? t[i] : void 0;
}
var Lf = Object.prototype, If = Lf.hasOwnProperty;
function jf(i) {
  var t = this.__data__;
  return di ? t[i] !== void 0 : If.call(t, i);
}
var kf = "__lodash_hash_undefined__";
function Rf(i, t) {
  var e = this.__data__;
  return this.size += this.has(i) ? 0 : 1, e[i] = di && t === void 0 ? kf : t, this;
}
function en(i) {
  var t = -1, e = i == null ? 0 : i.length;
  for (this.clear(); ++t < e; ) {
    var n = i[t];
    this.set(n[0], n[1]);
  }
}
en.prototype.clear = Of;
en.prototype.delete = Pf;
en.prototype.get = Nf;
en.prototype.has = jf;
en.prototype.set = Rf;
function Df() {
  this.__data__ = [], this.size = 0;
}
function bs(i, t) {
  for (var e = i.length; e--; )
    if (zn(i[e][0], t))
      return e;
  return -1;
}
var $f = Array.prototype, _f = $f.splice;
function Bf(i) {
  var t = this.__data__, e = bs(t, i);
  if (e < 0)
    return !1;
  var n = t.length - 1;
  return e == n ? t.pop() : _f.call(t, e, 1), --this.size, !0;
}
function zf(i) {
  var t = this.__data__, e = bs(t, i);
  return e < 0 ? void 0 : t[e][1];
}
function Vf(i) {
  return bs(this.__data__, i) > -1;
}
function Ff(i, t) {
  var e = this.__data__, n = bs(e, i);
  return n < 0 ? (++this.size, e.push([i, t])) : e[n][1] = t, this;
}
function Le(i) {
  var t = -1, e = i == null ? 0 : i.length;
  for (this.clear(); ++t < e; ) {
    var n = i[t];
    this.set(n[0], n[1]);
  }
}
Le.prototype.clear = Df;
Le.prototype.delete = Bf;
Le.prototype.get = zf;
Le.prototype.has = Vf;
Le.prototype.set = Ff;
var fi = ln(pe, "Map");
function Gf() {
  this.size = 0, this.__data__ = {
    hash: new en(),
    map: new (fi || Le)(),
    string: new en()
  };
}
function Hf(i) {
  var t = typeof i;
  return t == "string" || t == "number" || t == "symbol" || t == "boolean" ? i !== "__proto__" : i === null;
}
function ys(i, t) {
  var e = i.__data__;
  return Hf(t) ? e[typeof t == "string" ? "string" : "hash"] : e.map;
}
function qf(i) {
  var t = ys(this, i).delete(i);
  return this.size -= t ? 1 : 0, t;
}
function Uf(i) {
  return ys(this, i).get(i);
}
function Wf(i) {
  return ys(this, i).has(i);
}
function Xf(i, t) {
  var e = ys(this, i), n = e.size;
  return e.set(i, t), this.size += e.size == n ? 0 : 1, this;
}
function Ie(i) {
  var t = -1, e = i == null ? 0 : i.length;
  for (this.clear(); ++t < e; ) {
    var n = i[t];
    this.set(n[0], n[1]);
  }
}
Ie.prototype.clear = Gf;
Ie.prototype.delete = qf;
Ie.prototype.get = Uf;
Ie.prototype.has = Wf;
Ie.prototype.set = Xf;
var Yf = "Expected a function";
function Lr(i, t) {
  if (typeof i != "function" || t != null && typeof t != "function")
    throw new TypeError(Yf);
  var e = function() {
    var n = arguments, s = t ? t.apply(this, n) : n[0], r = e.cache;
    if (r.has(s))
      return r.get(s);
    var o = i.apply(this, n);
    return e.cache = r.set(s, o) || r, o;
  };
  return e.cache = new (Lr.Cache || Ie)(), e;
}
Lr.Cache = Ie;
var Jf = 500;
function Kf(i) {
  var t = Lr(i, function(n) {
    return e.size === Jf && e.clear(), n;
  }), e = t.cache;
  return t;
}
var Zf = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, Qf = /\\(\\)?/g, tg = Kf(function(i) {
  var t = [];
  return i.charCodeAt(0) === 46 && t.push(""), i.replace(Zf, function(e, n, s, r) {
    t.push(s ? r.replace(Qf, "$1") : n || e);
  }), t;
});
function Oi(i) {
  return i == null ? "" : Qa(i);
}
function vs(i, t) {
  return qt(i) ? i : Nr(i, t) ? [i] : tg(Oi(i));
}
function Pi(i) {
  if (typeof i == "string" || xe(i))
    return i;
  var t = i + "";
  return t == "0" && 1 / i == -1 / 0 ? "-0" : t;
}
function ws(i, t) {
  t = vs(t, i);
  for (var e = 0, n = t.length; i != null && e < n; )
    i = i[Pi(t[e++])];
  return e && e == n ? i : void 0;
}
function eg(i, t, e) {
  var n = i == null ? void 0 : ws(i, t);
  return n === void 0 ? e : n;
}
function Ir(i, t) {
  for (var e = -1, n = t.length, s = i.length; ++e < n; )
    i[s + e] = t[e];
  return i;
}
var Lo = re ? re.isConcatSpreadable : void 0;
function ng(i) {
  return qt(i) || mn(i) || !!(Lo && i && i[Lo]);
}
function xs(i, t, e, n, s) {
  var r = -1, o = i.length;
  for (e || (e = ng), s || (s = []); ++r < o; ) {
    var a = i[r];
    e(a) ? Ir(s, a) : n || (s[s.length] = a);
  }
  return s;
}
function ig(i) {
  var t = i == null ? 0 : i.length;
  return t ? xs(i) : [];
}
function sg(i) {
  return nl(sl(i, void 0, ig), i + "");
}
var jr = hl(Object.getPrototypeOf, Object), rg = "[object Object]", og = Function.prototype, ag = Object.prototype, dl = og.toString, lg = ag.hasOwnProperty, cg = dl.call(Object);
function Se(i) {
  if (!de(i) || qe(i) != rg)
    return !1;
  var t = jr(i);
  if (t === null)
    return !0;
  var e = lg.call(t, "constructor") && t.constructor;
  return typeof e == "function" && e instanceof e && dl.call(e) == cg;
}
function hg(i, t, e) {
  var n = -1, s = i.length;
  t < 0 && (t = -t > s ? 0 : s + t), e = e > s ? s : e, e < 0 && (e += s), s = t > e ? 0 : e - t >>> 0, t >>>= 0;
  for (var r = Array(s); ++n < s; )
    r[n] = i[n + t];
  return r;
}
function ug(i, t, e) {
  var n = i.length;
  return e = e === void 0 ? n : e, !t && e >= n ? i : hg(i, t, e);
}
var dg = "\\ud800-\\udfff", fg = "\\u0300-\\u036f", gg = "\\ufe20-\\ufe2f", pg = "\\u20d0-\\u20ff", mg = fg + gg + pg, bg = "\\ufe0e\\ufe0f", yg = "\\u200d", vg = RegExp("[" + yg + dg + mg + bg + "]");
function fl(i) {
  return vg.test(i);
}
function wg(i) {
  return i.split("");
}
var gl = "\\ud800-\\udfff", xg = "\\u0300-\\u036f", Eg = "\\ufe20-\\ufe2f", Cg = "\\u20d0-\\u20ff", Sg = xg + Eg + Cg, Og = "\\ufe0e\\ufe0f", Pg = "[" + gl + "]", ir = "[" + Sg + "]", sr = "\\ud83c[\\udffb-\\udfff]", Ag = "(?:" + ir + "|" + sr + ")", pl = "[^" + gl + "]", ml = "(?:\\ud83c[\\udde6-\\uddff]){2}", bl = "[\\ud800-\\udbff][\\udc00-\\udfff]", Mg = "\\u200d", yl = Ag + "?", vl = "[" + Og + "]?", Tg = "(?:" + Mg + "(?:" + [pl, ml, bl].join("|") + ")" + vl + yl + ")*", Ng = vl + yl + Tg, Lg = "(?:" + [pl + ir + "?", ir, ml, bl, Pg].join("|") + ")", Ig = RegExp(sr + "(?=" + sr + ")|" + Lg + Ng, "g");
function jg(i) {
  return i.match(Ig) || [];
}
function kg(i) {
  return fl(i) ? jg(i) : wg(i);
}
function wl(i) {
  return function(t) {
    t = Oi(t);
    var e = fl(t) ? kg(t) : void 0, n = e ? e[0] : t.charAt(0), s = e ? ug(e, 1).join("") : t.slice(1);
    return n[i]() + s;
  };
}
var Wi = wl("toUpperCase");
function Rg(i) {
  return Wi(Oi(i).toLowerCase());
}
function Dg(i, t, e, n) {
  for (var s = -1, r = i == null ? 0 : i.length; ++s < r; )
    e = t(e, i[s], s, i);
  return e;
}
function $g(i) {
  return function(t) {
    return i == null ? void 0 : i[t];
  };
}
var _g = {
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
}, Bg = $g(_g), zg = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g, Vg = "\\u0300-\\u036f", Fg = "\\ufe20-\\ufe2f", Gg = "\\u20d0-\\u20ff", Hg = Vg + Fg + Gg, qg = "[" + Hg + "]", Ug = RegExp(qg, "g");
function Wg(i) {
  return i = Oi(i), i && i.replace(zg, Bg).replace(Ug, "");
}
var Xg = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;
function Yg(i) {
  return i.match(Xg) || [];
}
var Jg = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;
function Kg(i) {
  return Jg.test(i);
}
var xl = "\\ud800-\\udfff", Zg = "\\u0300-\\u036f", Qg = "\\ufe20-\\ufe2f", tp = "\\u20d0-\\u20ff", ep = Zg + Qg + tp, El = "\\u2700-\\u27bf", Cl = "a-z\\xdf-\\xf6\\xf8-\\xff", np = "\\xac\\xb1\\xd7\\xf7", ip = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf", sp = "\\u2000-\\u206f", rp = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", Sl = "A-Z\\xc0-\\xd6\\xd8-\\xde", op = "\\ufe0e\\ufe0f", Ol = np + ip + sp + rp, Pl = "['’]", Io = "[" + Ol + "]", ap = "[" + ep + "]", Al = "\\d+", lp = "[" + El + "]", Ml = "[" + Cl + "]", Tl = "[^" + xl + Ol + Al + El + Cl + Sl + "]", cp = "\\ud83c[\\udffb-\\udfff]", hp = "(?:" + ap + "|" + cp + ")", up = "[^" + xl + "]", Nl = "(?:\\ud83c[\\udde6-\\uddff]){2}", Ll = "[\\ud800-\\udbff][\\udc00-\\udfff]", gn = "[" + Sl + "]", dp = "\\u200d", jo = "(?:" + Ml + "|" + Tl + ")", fp = "(?:" + gn + "|" + Tl + ")", ko = "(?:" + Pl + "(?:d|ll|m|re|s|t|ve))?", Ro = "(?:" + Pl + "(?:D|LL|M|RE|S|T|VE))?", Il = hp + "?", jl = "[" + op + "]?", gp = "(?:" + dp + "(?:" + [up, Nl, Ll].join("|") + ")" + jl + Il + ")*", pp = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", mp = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", bp = jl + Il + gp, yp = "(?:" + [lp, Nl, Ll].join("|") + ")" + bp, vp = RegExp([
  gn + "?" + Ml + "+" + ko + "(?=" + [Io, gn, "$"].join("|") + ")",
  fp + "+" + Ro + "(?=" + [Io, gn + jo, "$"].join("|") + ")",
  gn + "?" + jo + "+" + ko,
  gn + "+" + Ro,
  mp,
  pp,
  Al,
  yp
].join("|"), "g");
function wp(i) {
  return i.match(vp) || [];
}
function xp(i, t, e) {
  return i = Oi(i), t = t, t === void 0 ? Kg(i) ? wp(i) : Yg(i) : i.match(t) || [];
}
var Ep = "['’]", Cp = RegExp(Ep, "g");
function kl(i) {
  return function(t) {
    return Dg(xp(Wg(t).replace(Cp, "")), i, "");
  };
}
var Es = kl(function(i, t, e) {
  return t = t.toLowerCase(), i + (e ? Rg(t) : t);
});
function Sp(i, t, e) {
  return i === i && (e !== void 0 && (i = i <= e ? i : e), t !== void 0 && (i = i >= t ? i : t)), i;
}
function se(i, t, e) {
  return e === void 0 && (e = t, t = void 0), e !== void 0 && (e = ni(e), e = e === e ? e : 0), t !== void 0 && (t = ni(t), t = t === t ? t : 0), Sp(ni(i), t, e);
}
function Op() {
  this.__data__ = new Le(), this.size = 0;
}
function Pp(i) {
  var t = this.__data__, e = t.delete(i);
  return this.size = t.size, e;
}
function Ap(i) {
  return this.__data__.get(i);
}
function Mp(i) {
  return this.__data__.has(i);
}
var Tp = 200;
function Np(i, t) {
  var e = this.__data__;
  if (e instanceof Le) {
    var n = e.__data__;
    if (!fi || n.length < Tp - 1)
      return n.push([i, t]), this.size = ++e.size, this;
    e = this.__data__ = new Ie(n);
  }
  return e.set(i, t), this.size = e.size, this;
}
function he(i) {
  var t = this.__data__ = new Le(i);
  this.size = t.size;
}
he.prototype.clear = Op;
he.prototype.delete = Pp;
he.prototype.get = Ap;
he.prototype.has = Mp;
he.prototype.set = Np;
function Lp(i, t) {
  return i && Ci(t, Si(t), i);
}
function Ip(i, t) {
  return i && Ci(t, Fn(t), i);
}
var Rl = typeof exports == "object" && exports && !exports.nodeType && exports, Do = Rl && typeof module == "object" && module && !module.nodeType && module, jp = Do && Do.exports === Rl, $o = jp ? pe.Buffer : void 0, _o = $o ? $o.allocUnsafe : void 0;
function Dl(i, t) {
  if (t)
    return i.slice();
  var e = i.length, n = _o ? _o(e) : new i.constructor(e);
  return i.copy(n), n;
}
function kp(i, t) {
  for (var e = -1, n = i == null ? 0 : i.length, s = 0, r = []; ++e < n; ) {
    var o = i[e];
    t(o, e, i) && (r[s++] = o);
  }
  return r;
}
function $l() {
  return [];
}
var Rp = Object.prototype, Dp = Rp.propertyIsEnumerable, Bo = Object.getOwnPropertySymbols, kr = Bo ? function(i) {
  return i == null ? [] : (i = Object(i), kp(Bo(i), function(t) {
    return Dp.call(i, t);
  }));
} : $l;
function $p(i, t) {
  return Ci(i, kr(i), t);
}
var _p = Object.getOwnPropertySymbols, _l = _p ? function(i) {
  for (var t = []; i; )
    Ir(t, kr(i)), i = jr(i);
  return t;
} : $l;
function Bp(i, t) {
  return Ci(i, _l(i), t);
}
function Bl(i, t, e) {
  var n = t(i);
  return qt(i) ? n : Ir(n, e(i));
}
function rr(i) {
  return Bl(i, Si, kr);
}
function zp(i) {
  return Bl(i, Fn, _l);
}
var or = ln(pe, "DataView"), ar = ln(pe, "Promise"), pn = ln(pe, "Set"), zo = "[object Map]", Vp = "[object Object]", Vo = "[object Promise]", Fo = "[object Set]", Go = "[object WeakMap]", Ho = "[object DataView]", Fp = an(or), Gp = an(fi), Hp = an(ar), qp = an(pn), Up = an(nr), ne = qe;
(or && ne(new or(new ArrayBuffer(1))) != Ho || fi && ne(new fi()) != zo || ar && ne(ar.resolve()) != Vo || pn && ne(new pn()) != Fo || nr && ne(new nr()) != Go) && (ne = function(i) {
  var t = qe(i), e = t == Vp ? i.constructor : void 0, n = e ? an(e) : "";
  if (n)
    switch (n) {
      case Fp:
        return Ho;
      case Gp:
        return zo;
      case Hp:
        return Vo;
      case qp:
        return Fo;
      case Up:
        return Go;
    }
  return t;
});
var Wp = Object.prototype, Xp = Wp.hasOwnProperty;
function Yp(i) {
  var t = i.length, e = new i.constructor(t);
  return t && typeof i[0] == "string" && Xp.call(i, "index") && (e.index = i.index, e.input = i.input), e;
}
var Xi = pe.Uint8Array;
function Rr(i) {
  var t = new i.constructor(i.byteLength);
  return new Xi(t).set(new Xi(i)), t;
}
function Jp(i, t) {
  var e = t ? Rr(i.buffer) : i.buffer;
  return new i.constructor(e, i.byteOffset, i.byteLength);
}
var Kp = /\w*$/;
function Zp(i) {
  var t = new i.constructor(i.source, Kp.exec(i));
  return t.lastIndex = i.lastIndex, t;
}
var qo = re ? re.prototype : void 0, Uo = qo ? qo.valueOf : void 0;
function Qp(i) {
  return Uo ? Object(Uo.call(i)) : {};
}
function zl(i, t) {
  var e = t ? Rr(i.buffer) : i.buffer;
  return new i.constructor(e, i.byteOffset, i.length);
}
var tm = "[object Boolean]", em = "[object Date]", nm = "[object Map]", im = "[object Number]", sm = "[object RegExp]", rm = "[object Set]", om = "[object String]", am = "[object Symbol]", lm = "[object ArrayBuffer]", cm = "[object DataView]", hm = "[object Float32Array]", um = "[object Float64Array]", dm = "[object Int8Array]", fm = "[object Int16Array]", gm = "[object Int32Array]", pm = "[object Uint8Array]", mm = "[object Uint8ClampedArray]", bm = "[object Uint16Array]", ym = "[object Uint32Array]";
function vm(i, t, e) {
  var n = i.constructor;
  switch (t) {
    case lm:
      return Rr(i);
    case tm:
    case em:
      return new n(+i);
    case cm:
      return Jp(i, e);
    case hm:
    case um:
    case dm:
    case fm:
    case gm:
    case pm:
    case mm:
    case bm:
    case ym:
      return zl(i, e);
    case nm:
      return new n();
    case im:
    case om:
      return new n(i);
    case sm:
      return Zp(i);
    case rm:
      return new n();
    case am:
      return Qp(i);
  }
}
function Vl(i) {
  return typeof i.constructor == "function" && !gs(i) ? pd(jr(i)) : {};
}
var wm = "[object Map]";
function xm(i) {
  return de(i) && ne(i) == wm;
}
var Wo = yn && yn.isMap, Em = Wo ? ps(Wo) : xm, Cm = "[object Set]";
function Sm(i) {
  return de(i) && ne(i) == Cm;
}
var Xo = yn && yn.isSet, Om = Xo ? ps(Xo) : Sm, Pm = 1, Am = 2, Mm = 4, Fl = "[object Arguments]", Tm = "[object Array]", Nm = "[object Boolean]", Lm = "[object Date]", Im = "[object Error]", Gl = "[object Function]", jm = "[object GeneratorFunction]", km = "[object Map]", Rm = "[object Number]", Hl = "[object Object]", Dm = "[object RegExp]", $m = "[object Set]", _m = "[object String]", Bm = "[object Symbol]", zm = "[object WeakMap]", Vm = "[object ArrayBuffer]", Fm = "[object DataView]", Gm = "[object Float32Array]", Hm = "[object Float64Array]", qm = "[object Int8Array]", Um = "[object Int16Array]", Wm = "[object Int32Array]", Xm = "[object Uint8Array]", Ym = "[object Uint8ClampedArray]", Jm = "[object Uint16Array]", Km = "[object Uint32Array]", dt = {};
dt[Fl] = dt[Tm] = dt[Vm] = dt[Fm] = dt[Nm] = dt[Lm] = dt[Gm] = dt[Hm] = dt[qm] = dt[Um] = dt[Wm] = dt[km] = dt[Rm] = dt[Hl] = dt[Dm] = dt[$m] = dt[_m] = dt[Bm] = dt[Xm] = dt[Ym] = dt[Jm] = dt[Km] = !0;
dt[Im] = dt[Gl] = dt[zm] = !1;
function si(i, t, e, n, s, r) {
  var o, a = t & Pm, l = t & Am, c = t & Mm;
  if (o !== void 0)
    return o;
  if (!vt(i))
    return i;
  var h = qt(i);
  if (h) {
    if (o = Yp(i), !a)
      return el(i, o);
  } else {
    var u = ne(i), d = u == Gl || u == jm;
    if (bn(i))
      return Dl(i, a);
    if (u == Hl || u == Fl || d && !s) {
      if (o = l || d ? {} : Vl(i), !a)
        return l ? Bp(i, Ip(o, i)) : $p(i, Lp(o, i));
    } else {
      if (!dt[u])
        return s ? i : {};
      o = vm(i, u, a);
    }
  }
  r || (r = new he());
  var f = r.get(i);
  if (f)
    return f;
  r.set(i, o), Om(i) ? i.forEach(function(m) {
    o.add(si(m, t, e, m, i, r));
  }) : Em(i) && i.forEach(function(m, b) {
    o.set(b, si(m, t, e, b, i, r));
  });
  var g = c ? l ? zp : rr : l ? Fn : Si, p = h ? void 0 : g(i);
  return Cd(p || i, function(m, b) {
    p && (b = m, m = i[b]), Mr(o, b, si(m, t, e, b, i, r));
  }), o;
}
var Zm = 4;
function lr(i) {
  return si(i, Zm);
}
var Qm = 1, tb = 4;
function gt(i) {
  return si(i, Qm | tb);
}
var eb = "__lodash_hash_undefined__";
function nb(i) {
  return this.__data__.set(i, eb), this;
}
function ib(i) {
  return this.__data__.has(i);
}
function vn(i) {
  var t = -1, e = i == null ? 0 : i.length;
  for (this.__data__ = new Ie(); ++t < e; )
    this.add(i[t]);
}
vn.prototype.add = vn.prototype.push = nb;
vn.prototype.has = ib;
function sb(i, t) {
  for (var e = -1, n = i == null ? 0 : i.length; ++e < n; )
    if (t(i[e], e, i))
      return !0;
  return !1;
}
function Dr(i, t) {
  return i.has(t);
}
var rb = 1, ob = 2;
function ql(i, t, e, n, s, r) {
  var o = e & rb, a = i.length, l = t.length;
  if (a != l && !(o && l > a))
    return !1;
  var c = r.get(i), h = r.get(t);
  if (c && h)
    return c == t && h == i;
  var u = -1, d = !0, f = e & ob ? new vn() : void 0;
  for (r.set(i, t), r.set(t, i); ++u < a; ) {
    var g = i[u], p = t[u];
    if (n)
      var m = o ? n(p, g, u, t, i, r) : n(g, p, u, i, t, r);
    if (m !== void 0) {
      if (m)
        continue;
      d = !1;
      break;
    }
    if (f) {
      if (!sb(t, function(b, v) {
        if (!Dr(f, v) && (g === b || s(g, b, e, n, r)))
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
function ab(i) {
  var t = -1, e = Array(i.size);
  return i.forEach(function(n, s) {
    e[++t] = [s, n];
  }), e;
}
function $r(i) {
  var t = -1, e = Array(i.size);
  return i.forEach(function(n) {
    e[++t] = n;
  }), e;
}
var lb = 1, cb = 2, hb = "[object Boolean]", ub = "[object Date]", db = "[object Error]", fb = "[object Map]", gb = "[object Number]", pb = "[object RegExp]", mb = "[object Set]", bb = "[object String]", yb = "[object Symbol]", vb = "[object ArrayBuffer]", wb = "[object DataView]", Yo = re ? re.prototype : void 0, Vs = Yo ? Yo.valueOf : void 0;
function xb(i, t, e, n, s, r, o) {
  switch (e) {
    case wb:
      if (i.byteLength != t.byteLength || i.byteOffset != t.byteOffset)
        return !1;
      i = i.buffer, t = t.buffer;
    case vb:
      return !(i.byteLength != t.byteLength || !r(new Xi(i), new Xi(t)));
    case hb:
    case ub:
    case gb:
      return zn(+i, +t);
    case db:
      return i.name == t.name && i.message == t.message;
    case pb:
    case bb:
      return i == t + "";
    case fb:
      var a = ab;
    case mb:
      var l = n & lb;
      if (a || (a = $r), i.size != t.size && !l)
        return !1;
      var c = o.get(i);
      if (c)
        return c == t;
      n |= cb, o.set(i, t);
      var h = ql(a(i), a(t), n, s, r, o);
      return o.delete(i), h;
    case yb:
      if (Vs)
        return Vs.call(i) == Vs.call(t);
  }
  return !1;
}
var Eb = 1, Cb = Object.prototype, Sb = Cb.hasOwnProperty;
function Ob(i, t, e, n, s, r) {
  var o = e & Eb, a = rr(i), l = a.length, c = rr(t), h = c.length;
  if (l != h && !o)
    return !1;
  for (var u = l; u--; ) {
    var d = a[u];
    if (!(o ? d in t : Sb.call(t, d)))
      return !1;
  }
  var f = r.get(i), g = r.get(t);
  if (f && g)
    return f == t && g == i;
  var p = !0;
  r.set(i, t), r.set(t, i);
  for (var m = o; ++u < l; ) {
    d = a[u];
    var b = i[d], v = t[d];
    if (n)
      var y = o ? n(v, b, d, t, i, r) : n(b, v, d, i, t, r);
    if (!(y === void 0 ? b === v || s(b, v, e, n, r) : y)) {
      p = !1;
      break;
    }
    m || (m = d == "constructor");
  }
  if (p && !m) {
    var x = i.constructor, E = t.constructor;
    x != E && "constructor" in i && "constructor" in t && !(typeof x == "function" && x instanceof x && typeof E == "function" && E instanceof E) && (p = !1);
  }
  return r.delete(i), r.delete(t), p;
}
var Pb = 1, Jo = "[object Arguments]", Ko = "[object Array]", ki = "[object Object]", Ab = Object.prototype, Zo = Ab.hasOwnProperty;
function Mb(i, t, e, n, s, r) {
  var o = qt(i), a = qt(t), l = o ? Ko : ne(i), c = a ? Ko : ne(t);
  l = l == Jo ? ki : l, c = c == Jo ? ki : c;
  var h = l == ki, u = c == ki, d = l == c;
  if (d && bn(i)) {
    if (!bn(t))
      return !1;
    o = !0, h = !1;
  }
  if (d && !h)
    return r || (r = new he()), o || ms(i) ? ql(i, t, e, n, s, r) : xb(i, t, l, e, n, s, r);
  if (!(e & Pb)) {
    var f = h && Zo.call(i, "__wrapped__"), g = u && Zo.call(t, "__wrapped__");
    if (f || g) {
      var p = f ? i.value() : i, m = g ? t.value() : t;
      return r || (r = new he()), s(p, m, e, n, r);
    }
  }
  return d ? (r || (r = new he()), Ob(i, t, e, n, s, r)) : !1;
}
function Cs(i, t, e, n, s) {
  return i === t ? !0 : i == null || t == null || !de(i) && !de(t) ? i !== i && t !== t : Mb(i, t, e, n, Cs, s);
}
var Tb = 1, Nb = 2;
function Lb(i, t, e, n) {
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
      var h = new he(), u;
      if (!(u === void 0 ? Cs(c, l, Tb | Nb, n, h) : u))
        return !1;
    }
  }
  return !0;
}
function Ul(i) {
  return i === i && !vt(i);
}
function Ib(i) {
  for (var t = Si(i), e = t.length; e--; ) {
    var n = t[e], s = i[n];
    t[e] = [n, s, Ul(s)];
  }
  return t;
}
function Wl(i, t) {
  return function(e) {
    return e == null ? !1 : e[i] === t && (t !== void 0 || i in Object(e));
  };
}
function jb(i) {
  var t = Ib(i);
  return t.length == 1 && t[0][2] ? Wl(t[0][0], t[0][1]) : function(e) {
    return e === i || Lb(e, i, t);
  };
}
function kb(i, t) {
  return i != null && t in Object(i);
}
function Xl(i, t, e) {
  t = vs(t, i);
  for (var n = -1, s = t.length, r = !1; ++n < s; ) {
    var o = Pi(t[n]);
    if (!(r = i != null && e(i, o)))
      break;
    i = i[o];
  }
  return r || ++n != s ? r : (s = i == null ? 0 : i.length, !!s && Tr(s) && ds(o, s) && (qt(i) || mn(i)));
}
function Yl(i, t) {
  return i != null && Xl(i, t, kb);
}
var Rb = 1, Db = 2;
function $b(i, t) {
  return Nr(i) && Ul(t) ? Wl(Pi(i), t) : function(e) {
    var n = eg(e, i);
    return n === void 0 && n === t ? Yl(e, i) : Cs(t, n, Rb | Db);
  };
}
function _b(i) {
  return function(t) {
    return t == null ? void 0 : t[i];
  };
}
function Bb(i) {
  return function(t) {
    return ws(t, i);
  };
}
function zb(i) {
  return Nr(i) ? _b(Pi(i)) : Bb(i);
}
function _r(i) {
  return typeof i == "function" ? i : i == null ? Bn : typeof i == "object" ? qt(i) ? $b(i[0], i[1]) : jb(i) : zb(i);
}
function Vb(i, t, e, n) {
  for (var s = -1, r = i == null ? 0 : i.length; ++s < r; ) {
    var o = i[s];
    t(n, o, e(o), i);
  }
  return n;
}
function Fb(i) {
  return function(t, e, n) {
    for (var s = -1, r = Object(t), o = n(t), a = o.length; a--; ) {
      var l = o[++s];
      if (e(r[l], l, r) === !1)
        break;
    }
    return t;
  };
}
var Jl = Fb();
function Gb(i, t) {
  return i && Jl(i, t, Si);
}
function Hb(i, t) {
  return function(e, n) {
    if (e == null)
      return e;
    if (!cn(e))
      return i(e, n);
    for (var s = e.length, r = -1, o = Object(e); ++r < s && n(o[r], r, o) !== !1; )
      ;
    return e;
  };
}
var Kl = Hb(Gb);
function qb(i, t, e, n) {
  return Kl(i, function(s, r, o) {
    t(n, s, e(s), o);
  }), n;
}
function Ub(i, t) {
  return function(e, n) {
    var s = qt(e) ? Vb : qb, r = t ? t() : {};
    return s(e, i, _r(n), r);
  };
}
var Fs = function() {
  return pe.Date.now();
}, Wb = "Expected a function", Xb = Math.max, Yb = Math.min;
function Jb(i, t, e) {
  var n, s, r, o, a, l, c = 0, h = !1, u = !1, d = !0;
  if (typeof i != "function")
    throw new TypeError(Wb);
  t = ni(t) || 0, vt(e) && (h = !!e.leading, u = "maxWait" in e, r = u ? Xb(ni(e.maxWait) || 0, t) : r, d = "trailing" in e ? !!e.trailing : d);
  function f(S) {
    var C = n, O = s;
    return n = s = void 0, c = S, o = i.apply(O, C), o;
  }
  function g(S) {
    return c = S, a = setTimeout(b, t), h ? f(S) : o;
  }
  function p(S) {
    var C = S - l, O = S - c, P = t - C;
    return u ? Yb(P, r - O) : P;
  }
  function m(S) {
    var C = S - l, O = S - c;
    return l === void 0 || C >= t || C < 0 || u && O >= r;
  }
  function b() {
    var S = Fs();
    if (m(S))
      return v(S);
    a = setTimeout(b, p(S));
  }
  function v(S) {
    return a = void 0, d && n ? f(S) : (n = s = void 0, o);
  }
  function y() {
    a !== void 0 && clearTimeout(a), c = 0, n = l = s = a = void 0;
  }
  function x() {
    return a === void 0 ? o : v(Fs());
  }
  function E() {
    var S = Fs(), C = m(S);
    if (n = arguments, s = this, l = S, C) {
      if (a === void 0)
        return g(l);
      if (u)
        return clearTimeout(a), a = setTimeout(b, t), f(l);
    }
    return a === void 0 && (a = setTimeout(b, t)), o;
  }
  return E.cancel = y, E.flush = x, E;
}
var Zl = Object.prototype, Kb = Zl.hasOwnProperty, Zb = Vn(function(i, t) {
  i = Object(i);
  var e = -1, n = t.length, s = n > 2 ? t[2] : void 0;
  for (s && Ui(t[0], t[1], s) && (n = 1); ++e < n; )
    for (var r = t[e], o = Fn(r), a = -1, l = o.length; ++a < l; ) {
      var c = o[a], h = i[c];
      (h === void 0 || zn(h, Zl[c]) && !Kb.call(i, c)) && (i[c] = r[c]);
    }
  return i;
});
function cr(i, t, e) {
  (e !== void 0 && !zn(i[t], e) || e === void 0 && !(t in i)) && fs(i, t, e);
}
function Yi(i) {
  return de(i) && cn(i);
}
function hr(i, t) {
  if (!(t === "constructor" && typeof i[t] == "function") && t != "__proto__")
    return i[t];
}
function Qb(i) {
  return Ci(i, Fn(i));
}
function ty(i, t, e, n, s, r, o) {
  var a = hr(i, e), l = hr(t, e), c = o.get(l);
  if (c) {
    cr(i, e, c);
    return;
  }
  var h = r ? r(a, l, e + "", i, t, o) : void 0, u = h === void 0;
  if (u) {
    var d = qt(l), f = !d && bn(l), g = !d && !f && ms(l);
    h = l, d || f || g ? qt(a) ? h = a : Yi(a) ? h = el(a) : f ? (u = !1, h = Dl(l, !0)) : g ? (u = !1, h = zl(l, !0)) : h = [] : Se(l) || mn(l) ? (h = a, mn(a) ? h = Qb(a) : (!vt(a) || Ar(a)) && (h = Vl(l))) : u = !1;
  }
  u && (o.set(l, h), s(h, l, n, r, o), o.delete(l)), cr(i, e, h);
}
function Ss(i, t, e, n, s) {
  i !== t && Jl(t, function(r, o) {
    if (s || (s = new he()), vt(r))
      ty(i, t, o, e, Ss, n, s);
    else {
      var a = n ? n(hr(i, o), r, o + "", i, t, s) : void 0;
      a === void 0 && (a = r), cr(i, o, a);
    }
  }, Fn);
}
function Ql(i, t, e, n, s, r) {
  return vt(i) && vt(t) && (r.set(t, i), Ss(i, t, void 0, Ql, r), r.delete(t)), i;
}
var ey = rl(function(i, t, e, n) {
  Ss(i, t, e, n);
}), tc = Vn(function(i) {
  return i.push(void 0, Ql), tl(ey, void 0, i);
}), ny = 200;
function iy(i, t, e, n) {
  var s = -1, r = il, o = !0, a = i.length, l = [], c = t.length;
  if (!a)
    return l;
  t.length >= ny && (r = Dr, o = !1, t = new vn(t));
  t:
    for (; ++s < a; ) {
      var h = i[s], u = h;
      if (h = h !== 0 ? h : 0, o && u === u) {
        for (var d = c; d--; )
          if (t[d] === u)
            continue t;
        l.push(h);
      } else r(t, u, n) || l.push(h);
    }
  return l;
}
var sy = Vn(function(i, t) {
  return Yi(i) ? iy(i, xs(t, 1, Yi, !0)) : [];
});
function ry(i, t) {
  var e = -1, n = cn(i) ? Array(i.length) : [];
  return Kl(i, function(s, r, o) {
    n[++e] = t(s, r, o);
  }), n;
}
var oy = Object.prototype, ay = oy.hasOwnProperty, Qo = Ub(function(i, t, e) {
  ay.call(i, e) ? i[e].push(t) : fs(i, e, [t]);
});
function ly(i, t) {
  return i > t;
}
var cy = Object.prototype, hy = cy.hasOwnProperty;
function uy(i, t) {
  return i != null && hy.call(i, t);
}
function Ri(i, t) {
  return i != null && Xl(i, t, uy);
}
var dy = "[object Map]", fy = "[object Set]", gy = Object.prototype, py = gy.hasOwnProperty;
function ec(i) {
  if (i == null)
    return !0;
  if (cn(i) && (qt(i) || typeof i == "string" || typeof i.splice == "function" || bn(i) || ms(i) || mn(i)))
    return !i.length;
  var t = ne(i);
  if (t == dy || t == fy)
    return !i.size;
  if (gs(i))
    return !ul(i).length;
  for (var e in i)
    if (py.call(i, e))
      return !1;
  return !0;
}
function ye(i, t) {
  return Cs(i, t);
}
var my = "[object Number]";
function ta(i) {
  return typeof i == "number" || de(i) && qe(i) == my;
}
var by = wl("toLowerCase");
function yy(i, t, e) {
  for (var n = -1, s = i.length; ++n < s; ) {
    var r = i[n], o = t(r);
    if (o != null && (a === void 0 ? o === o && !xe(o) : e(o, a)))
      var a = o, l = r;
  }
  return l;
}
function vy(i) {
  return i && i.length ? yy(i, Bn, ly) : void 0;
}
var Nt = rl(function(i, t, e) {
  Ss(i, t, e);
});
function wy(i, t, e, n) {
  if (!vt(i))
    return i;
  t = vs(t, i);
  for (var s = -1, r = t.length, o = r - 1, a = i; a != null && ++s < r; ) {
    var l = Pi(t[s]), c = e;
    if (l === "__proto__" || l === "constructor" || l === "prototype")
      return i;
    if (s != o) {
      var h = a[l];
      c = void 0, c === void 0 && (c = vt(h) ? h : ds(t[s + 1]) ? [] : {});
    }
    Mr(a, l, c), a = a[l];
  }
  return i;
}
function xy(i, t, e) {
  for (var n = -1, s = t.length, r = {}; ++n < s; ) {
    var o = t[n], a = ws(i, o);
    e(a, o) && wy(r, vs(o, i), a);
  }
  return r;
}
function Ey(i, t) {
  var e = i.length;
  for (i.sort(t); e--; )
    i[e] = i[e].value;
  return i;
}
function Cy(i, t) {
  if (i !== t) {
    var e = i !== void 0, n = i === null, s = i === i, r = xe(i), o = t !== void 0, a = t === null, l = t === t, c = xe(t);
    if (!a && !c && !r && i > t || r && o && l && !a && !c || n && o && l || !e && l || !s)
      return 1;
    if (!n && !r && !c && i < t || c && e && s && !n && !r || a && e && s || !o && s || !l)
      return -1;
  }
  return 0;
}
function Sy(i, t, e) {
  for (var n = -1, s = i.criteria, r = t.criteria, o = s.length, a = e.length; ++n < o; ) {
    var l = Cy(s[n], r[n]);
    if (l) {
      if (n >= a)
        return l;
      var c = e[n];
      return l * (c == "desc" ? -1 : 1);
    }
  }
  return i.index - t.index;
}
function Oy(i, t, e) {
  t.length ? t = Gi(t, function(r) {
    return qt(r) ? function(o) {
      return ws(o, r.length === 1 ? r[0] : r);
    } : r;
  }) : t = [Bn];
  var n = -1;
  t = Gi(t, ps(_r));
  var s = ry(i, function(r, o, a) {
    var l = Gi(t, function(c) {
      return c(r);
    });
    return { criteria: l, index: ++n, value: r };
  });
  return Ey(s, function(r, o) {
    return Sy(r, o, e);
  });
}
function Py(i, t) {
  return xy(i, t, function(e, n) {
    return Yl(i, n);
  });
}
var ea = sg(function(i, t) {
  return i == null ? {} : Py(i, t);
}), Br = Vn(function(i, t) {
  if (i == null)
    return [];
  var e = t.length;
  return e > 1 && Ui(i, t[0], t[1]) ? t = [] : e > 2 && Ui(t[0], t[1], t[2]) && (t = [t[0]]), Oy(i, xs(t), []);
}), Ay = 4294967295, My = Ay - 1, Ty = Math.floor, Ny = Math.min;
function nc(i, t, e, n) {
  var s = 0, r = i == null ? 0 : i.length;
  if (r === 0)
    return 0;
  t = e(t);
  for (var o = t !== t, a = t === null, l = xe(t), c = t === void 0; s < r; ) {
    var h = Ty((s + r) / 2), u = e(i[h]), d = u !== void 0, f = u === null, g = u === u, p = xe(u);
    if (o)
      var m = g;
    else c ? m = g && d : a ? m = g && d && !f : l ? m = g && d && !f && !p : f || p ? m = !1 : m = u < t;
    m ? s = h + 1 : r = h;
  }
  return Ny(r, My);
}
var Ly = 4294967295, Iy = Ly >>> 1;
function jy(i, t, e) {
  var n = 0, s = i == null ? n : i.length;
  if (typeof t == "number" && t === t && s <= Iy) {
    for (; n < s; ) {
      var r = n + s >>> 1, o = i[r];
      o !== null && !xe(o) && o < t ? n = r + 1 : s = r;
    }
    return s;
  }
  return nc(i, t, Bn);
}
function ky(i, t) {
  return jy(i, t);
}
function Ry(i, t, e) {
  return nc(i, t, _r(e));
}
var Dy = kl(function(i, t, e) {
  return i + (e ? " " : "") + Wi(t);
}), $y = "Expected a function";
function _y(i, t, e) {
  var n = !0, s = !0;
  if (typeof i != "function")
    throw new TypeError($y);
  return vt(e) && (n = "leading" in e ? !0 : n, s = "trailing" in e ? !!e.trailing : s), Jb(i, t, {
    leading: n,
    maxWait: t,
    trailing: s
  });
}
var By = 1 / 0, zy = pn && 1 / $r(new pn([, -0]))[1] == By ? function(i) {
  return new pn(i);
} : md, Vy = 200;
function ic(i, t, e) {
  var n = -1, s = il, r = i.length, o = !0, a = [], l = a;
  if (r >= Vy) {
    var c = zy(i);
    if (c)
      return $r(c);
    o = !1, s = Dr, l = new vn();
  } else
    l = a;
  t:
    for (; ++n < r; ) {
      var h = i[n], u = h;
      if (h = h !== 0 ? h : 0, o && u === u) {
        for (var d = l.length; d--; )
          if (l[d] === u)
            continue t;
        a.push(h);
      } else s(l, u, e) || (l !== a && l.push(u), a.push(h));
    }
  return a;
}
var na = Vn(function(i) {
  return ic(xs(i, 1, Yi, !0));
});
function sc(i) {
  return i && i.length ? ic(i) : [];
}
function rc(i, t, e) {
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
  return rc(i, t, e);
}
function Fy(i) {
  return typeof i == "object" && i.then && typeof i.then == "function";
}
function ur(i) {
  return i != null && (i instanceof Promise || Fy(i));
}
function zr(...i) {
  const t = [];
  if (i.forEach((n) => {
    Array.isArray(n) ? t.push(...n) : t.push(n);
  }), t.some((n) => ur(n))) {
    const n = t.map((s) => ur(s) ? s : Promise.resolve(s !== !1));
    return Promise.all(n).then((s) => s.reduce((r, o) => o !== !1 && r, !0));
  }
  return t.every((n) => n !== !1);
}
function Gy(...i) {
  const t = zr(i);
  return typeof t == "boolean" ? Promise.resolve(t) : t;
}
function Gs(i, t) {
  const e = [];
  for (let n = 0; n < i.length; n += 2) {
    const s = i[n], r = i[n + 1], o = Array.isArray(t) ? t : [t], a = rc(s, r, o);
    e.push(a);
  }
  return zr(e);
}
class Hy {
  constructor() {
    this.listeners = {};
  }
  on(t, e, n) {
    return e == null ? this : (this.listeners[t] || (this.listeners[t] = []), this.listeners[t].push(e, n), this);
  }
  once(t, e, n) {
    const s = (...r) => (this.off(t, s), Gs([e, n], r));
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
      r != null && (n = Gs([...r], e));
    }
    const s = this.listeners["*"];
    return s != null ? zr([
      n,
      Gs([...s], [t, ...e])
    ]) : n;
  }
  emit(t, ...e) {
    return this.trigger(t, ...e);
  }
}
function qy(i, ...t) {
  t.forEach((e) => {
    Object.getOwnPropertyNames(e.prototype).forEach((n) => {
      n !== "constructor" && Object.defineProperty(i.prototype, n, Object.getOwnPropertyDescriptor(e.prototype, n));
    });
  });
}
const Uy = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(i, t) {
  i.__proto__ = t;
} || function(i, t) {
  for (const e in t)
    Object.prototype.hasOwnProperty.call(t, e) && (i[e] = t[e]);
};
function Wy(i, t) {
  Uy(i, t);
  function e() {
    this.constructor = i;
  }
  i.prototype = t === null ? Object.create(t) : (e.prototype = t.prototype, new e());
}
class Xy {
}
const Yy = /^\s*class\s+/.test(`${Xy}`) || /^\s*class\s*\{/.test(`${class {
}}`);
function Vr(i, t) {
  let e;
  return Yy ? e = class extends t {
  } : (e = function() {
    return t.apply(this, arguments);
  }, Wy(e, t)), Object.defineProperty(e, "name", { value: i }), e;
}
function ia(i) {
  return i === "__proto__";
}
function Fr(i, t, e = "/") {
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
function Gn(i, t, e, n = "/") {
  const s = Array.isArray(t) ? t : t.split(n), r = s.pop();
  if (r && !ia(r)) {
    let o = i;
    s.forEach((a) => {
      ia(a) || (o[a] == null && (o[a] = {}), o = o[a]);
    }), o[r] = e;
  }
  return i;
}
function sa(i, t, e = "/") {
  const n = Array.isArray(t) ? t.slice() : t.split(e), s = n.pop();
  if (s)
    if (n.length > 0) {
      const r = Fr(i, n);
      r && delete r[s];
    } else
      delete i[s];
  return i;
}
var Jy = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
};
class At extends Hy {
  dispose() {
    this.off();
  }
}
Jy([
  Ut.dispose()
], At.prototype, "dispose", null);
(function(i) {
  i.dispose = Ut.dispose;
})(At || (At = {}));
qy(At, Ut);
const oc = (i) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (e) => t[e] || (t[e] = i(e));
}, ac = oc((i) => i.replace(/\B([A-Z])/g, "-$1").toLowerCase()), Gr = oc((i) => Dy(Es(i)).replace(/ /g, ""));
function Hs(i) {
  let t = 2166136261, e = !1, n = i;
  for (let s = 0, r = n.length; s < r; s += 1) {
    let o = n.charCodeAt(s);
    o > 127 && !e && (n = unescape(encodeURIComponent(n)), o = n.charCodeAt(s), e = !0), t ^= o, t += (t << 1) + (t << 4) + (t << 7) + (t << 8) + (t << 24);
  }
  return t >>> 0;
}
function Ji() {
  let i = "";
  const t = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
  for (let e = 0, n = t.length; e < n; e += 1) {
    const s = t[e], r = Math.random() * 16 | 0, o = s === "x" ? r : s === "y" ? r & 3 | 8 : s;
    i += o.toString(16);
  }
  return i;
}
function Ky(i, t, e) {
  const n = Math.min(2, Math.floor(i.length * 0.34));
  let s = Math.floor(i.length * 0.4) + 1, r, o = !1;
  const a = i.toLowerCase();
  for (const l of t) {
    const c = e(l);
    if (c !== void 0 && Math.abs(c.length - a.length) <= n) {
      const h = c.toLowerCase();
      if (h === a) {
        if (c === i)
          continue;
        return l;
      }
      if (o || c.length < 3)
        continue;
      const u = Zy(a, h, s - 1);
      if (u === void 0)
        continue;
      u < 3 ? (o = !0, r = l) : (s = u, r = l);
    }
  }
  return r;
}
function Zy(i, t, e) {
  let n = new Array(t.length + 1), s = new Array(t.length + 1);
  const r = e + 1;
  for (let a = 0; a <= t.length; a += 1)
    n[a] = a;
  for (let a = 1; a <= i.length; a += 1) {
    const l = i.charCodeAt(a - 1), c = a > e ? a - e : 1, h = t.length > e + a ? e + a : t.length;
    s[0] = a;
    let u = a;
    for (let f = 1; f < c; f += 1)
      s[f] = r;
    for (let f = c; f <= h; f += 1) {
      const g = l === t.charCodeAt(f - 1) ? n[f - 1] : Math.min(
        /* delete */
        n[f] + 1,
        /* insert */
        s[f - 1] + 1,
        /* substitute */
        n[f - 1] + 2
      );
      s[f] = g, u = Math.min(u, g);
    }
    for (let f = h + 1; f <= t.length; f += 1)
      s[f] = r;
    if (u > e)
      return;
    const d = n;
    n = s, s = d;
  }
  const o = n[t.length];
  return o > e ? void 0 : o;
}
function Te(i) {
  return typeof i == "string" && i.slice(-1) === "%";
}
function ue(i, t) {
  if (i == null)
    return 0;
  let e;
  if (typeof i == "string") {
    if (e = parseFloat(i), Te(i) && (e /= 100, Number.isFinite(e)))
      return e * t;
  } else
    e = i;
  return Number.isFinite(e) ? e > 0 && e < 1 ? e * t : e : 0;
}
function nn(i) {
  if (typeof i == "object") {
    let e = 0, n = 0, s = 0, r = 0;
    return i.vertical != null && Number.isFinite(i.vertical) && (n = r = i.vertical), i.horizontal != null && Number.isFinite(i.horizontal) && (s = e = i.horizontal), i.left != null && Number.isFinite(i.left) && (e = i.left), i.top != null && Number.isFinite(i.top) && (n = i.top), i.right != null && Number.isFinite(i.right) && (s = i.right), i.bottom != null && Number.isFinite(i.bottom) && (r = i.bottom), { top: n, right: s, bottom: r, left: e };
  }
  let t = 0;
  return i != null && Number.isFinite(i) && (t = i), { top: t, right: t, bottom: t, left: t };
}
let Hr = !1, lc = !1, cc = !1, hc = !1, uc = !1, dc = !1, fc = !1, gc = !1, pc = !1, mc = !1, bc = !1, yc = !1, vc = !1, wc = !1, xc = !1, Ec = !1;
if (typeof navigator == "object") {
  const i = navigator.userAgent;
  Hr = i.indexOf("Macintosh") >= 0, lc = !!i.match(/(iPad|iPhone|iPod)/g), cc = i.indexOf("Windows") >= 0, hc = i.indexOf("MSIE") >= 0, uc = !!i.match(/Trident\/7\./), dc = !!i.match(/Edge\//), fc = i.indexOf("Mozilla/") >= 0 && i.indexOf("MSIE") < 0 && i.indexOf("Edge/") < 0, pc = i.indexOf("Chrome/") >= 0 && i.indexOf("Edge/") < 0, mc = i.indexOf("Opera/") >= 0 || i.indexOf("OPR/") >= 0, bc = i.indexOf("Firefox/") >= 0, yc = i.indexOf("AppleWebKit/") >= 0 && i.indexOf("Chrome/") < 0 && i.indexOf("Edge/") < 0, typeof document == "object" && (Ec = !document.createElementNS || `${document.createElementNS("http://www.w3.org/2000/svg", "foreignObject")}` != "[object SVGForeignObjectElement]" || i.indexOf("Opera/") >= 0);
}
typeof window == "object" && (gc = window.chrome != null && window.chrome.app != null && window.chrome.app.runtime != null, wc = window.PointerEvent != null && !Hr);
if (typeof document == "object") {
  vc = "ontouchstart" in document.documentElement;
  try {
    const i = Object.defineProperty({}, "passive", {
      get() {
        xc = !0;
      }
    }), t = document.createElement("div");
    t.addEventListener && t.addEventListener("click", () => {
    }, i);
  } catch {
  }
}
var _e;
(function(i) {
  i.IS_MAC = Hr, i.IS_IOS = lc, i.IS_WINDOWS = cc, i.IS_IE = hc, i.IS_IE11 = uc, i.IS_EDGE = dc, i.IS_NETSCAPE = fc, i.IS_CHROME_APP = gc, i.IS_CHROME = pc, i.IS_OPERA = mc, i.IS_FIREFOX = bc, i.IS_SAFARI = yc, i.SUPPORT_TOUCH = vc, i.SUPPORT_POINTER = wc, i.SUPPORT_PASSIVE = xc, i.NO_FOREIGNOBJECT = Ec, i.SUPPORT_FOREIGNOBJECT = !i.NO_FOREIGNOBJECT;
})(_e || (_e = {}));
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
})(_e || (_e = {}));
const qr = /[\t\r\n\f]/g, Ur = /\S+/g, wn = (i) => ` ${i} `;
function xn(i) {
  return i && i.getAttribute && i.getAttribute("class") || "";
}
function Hn(i, t) {
  if (i == null || t == null)
    return !1;
  const e = wn(xn(i)), n = wn(t);
  return i.nodeType === 1 ? e.replace(qr, " ").includes(n) : !1;
}
function U(i, t) {
  if (!(i == null || t == null)) {
    if (typeof t == "function")
      return U(i, t(xn(i)));
    if (typeof t == "string" && i.nodeType === 1) {
      const e = t.match(Ur) || [], n = wn(xn(i)).replace(qr, " ");
      let s = e.reduce((r, o) => r.indexOf(wn(o)) < 0 ? `${r}${o} ` : r, n);
      s = s.trim(), n !== s && i.setAttribute("class", s);
    }
  }
}
function Ht(i, t) {
  if (i != null) {
    if (typeof t == "function")
      return Ht(i, t(xn(i)));
    if ((!t || typeof t == "string") && i.nodeType === 1) {
      const e = (t || "").match(Ur) || [], n = wn(xn(i)).replace(qr, " ");
      let s = e.reduce((r, o) => {
        const a = wn(o);
        return r.indexOf(a) > -1 ? r.replace(a, " ") : r;
      }, n);
      s = t ? s.trim() : "", n !== s && i.setAttribute("class", s);
    }
  }
}
function Cc(i, t, e) {
  if (!(i == null || t == null)) {
    if (e != null && typeof t == "string") {
      e ? U(i, t) : Ht(i, t);
      return;
    }
    if (typeof t == "function")
      return Cc(i, t(xn(i), e), e);
    typeof t == "string" && (t.match(Ur) || []).forEach((s) => {
      Hn(i, s) ? Ht(i, s) : U(i, s);
    });
  }
}
let ra = 0;
function Qy() {
  return ra += 1, `v${ra}`;
}
function Wr(i) {
  return (i.id == null || i.id === "") && (i.id = Qy()), i.id;
}
function Be(i) {
  return i == null ? !1 : typeof i.getScreenCTM == "function" && i instanceof SVGElement;
}
const Rt = {
  svg: "http://www.w3.org/2000/svg",
  xmlns: "http://www.w3.org/2000/xmlns/",
  xml: "http://www.w3.org/XML/1998/namespace",
  xlink: "http://www.w3.org/1999/xlink",
  xhtml: "http://www.w3.org/1999/xhtml"
}, oa = "1.1";
function aa(i, t = document) {
  return t.createElement(i);
}
function Xr(i, t = Rt.xhtml, e = document) {
  return e.createElementNS(t, i);
}
function me(i, t = document) {
  return Xr(i, Rt.svg, t);
}
function Ki(i) {
  if (i) {
    const e = `<svg xmlns="${Rt.svg}" xmlns:xlink="${Rt.xlink}" version="${oa}">${i}</svg>`, { documentElement: n } = t0(e, { async: !1 });
    return n;
  }
  const t = document.createElementNS(Rt.svg, "svg");
  return t.setAttributeNS(Rt.xmlns, "xmlns:xlink", Rt.xlink), t.setAttribute("version", oa), t;
}
function t0(i, t = {}) {
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
function e0(i, t = !0) {
  const e = i.nodeName;
  return t ? e.toLowerCase() : e.toUpperCase();
}
function Yr(i) {
  let t = 0, e = i.previousSibling;
  for (; e; )
    e.nodeType === 1 && (t += 1), e = e.previousSibling;
  return t;
}
function n0(i, t) {
  return i.querySelectorAll(t);
}
function i0(i, t) {
  return i.querySelector(t);
}
function Sc(i, t, e) {
  const n = i.ownerSVGElement;
  let s = i.parentNode;
  for (; s && s !== e && s !== n; ) {
    if (Hn(s, t))
      return s;
    s = s.parentNode;
  }
  return null;
}
function Jr(i, t) {
  const e = t && t.parentNode;
  return i === e || !!(e && e.nodeType === 1 && i.compareDocumentPosition(e) & 16);
}
function ve(i) {
  i && (Array.isArray(i) ? i : [i]).forEach((e) => {
    e.parentNode && e.parentNode.removeChild(e);
  });
}
function Ai(i) {
  for (; i.firstChild; )
    i.removeChild(i.firstChild);
}
function hn(i, t) {
  (Array.isArray(t) ? t : [t]).forEach((n) => {
    n != null && i.appendChild(n);
  });
}
function Oc(i, t) {
  const e = i.firstChild;
  return e ? Kr(e, t) : hn(i, t);
}
function Kr(i, t) {
  const e = i.parentNode;
  e && (Array.isArray(t) ? t : [t]).forEach((s) => {
    s != null && e.insertBefore(s, i);
  });
}
function ri(i, t) {
  t != null && t.appendChild(i);
}
function la(i) {
  try {
    return i instanceof HTMLElement;
  } catch {
    return typeof i == "object" && i.nodeType === 1 && typeof i.style == "object" && typeof i.ownerDocument == "object";
  }
}
function s0(i, t) {
  const e = [];
  let n = i.firstChild;
  for (; n; n = n.nextSibling)
    n.nodeType === 1 && (!t || Hn(n, t)) && e.push(n);
  return e;
}
const Pc = [
  "viewBox",
  "attributeName",
  "attributeType",
  "repeatCount",
  "textLength",
  "lengthAdjust",
  "gradientUnits"
];
function r0(i, t) {
  return i.getAttribute(t);
}
function Zr(i, t) {
  const e = Mc(t);
  e.ns ? i.hasAttributeNS(e.ns, e.local) && i.removeAttributeNS(e.ns, e.local) : i.hasAttribute(t) && i.removeAttribute(t);
}
function Qr(i, t, e) {
  if (e == null)
    return Zr(i, t);
  const n = Mc(t);
  n.ns && typeof e == "string" ? i.setAttributeNS(n.ns, t, e) : t === "id" ? i.id = `${e}` : i.setAttribute(t, `${e}`);
}
function Ac(i, t) {
  Object.keys(t).forEach((e) => {
    Qr(i, e, t[e]);
  });
}
function et(i, t, e) {
  if (t == null) {
    const n = i.attributes, s = {};
    for (let r = 0; r < n.length; r += 1)
      s[n[r].name] = n[r].value;
    return s;
  }
  if (typeof t == "string" && e === void 0)
    return i.getAttribute(t);
  typeof t == "object" ? Ac(i, t) : Qr(i, t, e);
}
function Mc(i) {
  if (i.indexOf(":") !== -1) {
    const t = i.split(":");
    return {
      ns: Rt[t[0]],
      local: t[1]
    };
  }
  return {
    ns: null,
    local: i
  };
}
function gi(i) {
  const t = {};
  return Object.keys(i).forEach((e) => {
    const n = Pc.includes(e) ? e : ac(e);
    t[n] = i[e];
  }), t;
}
function Di(i) {
  const t = {};
  return i.split(";").forEach((n) => {
    const s = n.trim();
    if (s) {
      const r = s.split("=");
      r.length && (t[r[0].trim()] = r[1] ? r[1].trim() : "");
    }
  }), t;
}
function dr(i, t) {
  return Object.keys(t).forEach((e) => {
    if (e === "class")
      i[e] = i[e] ? `${i[e]} ${t[e]}` : t[e];
    else if (e === "style") {
      const n = typeof i[e] == "object", s = typeof t[e] == "object";
      let r, o;
      n && s ? (r = i[e], o = t[e]) : n ? (r = i[e], o = Di(t[e])) : s ? (r = Di(i[e]), o = t[e]) : (r = Di(i[e]), o = Di(t[e])), i[e] = dr(r, o);
    } else
      i[e] = t[e];
  }), i;
}
function o0(i, t, e = {}) {
  const n = e.offset || 0, s = [], r = [];
  let o, a, l = null;
  for (let c = 0; c < i.length; c += 1) {
    o = r[c] = i[c];
    for (let h = 0, u = t.length; h < u; h += 1) {
      const d = t[h], f = d.start + n, g = d.end + n;
      c >= f && c < g && (typeof o == "string" ? o = r[c] = {
        t: i[c],
        attrs: d.attrs
      } : o.attrs = dr(dr({}, o.attrs), d.attrs), e.includeAnnotationIndices && (o.annotations == null && (o.annotations = []), o.annotations.push(h)));
    }
    a = r[c - 1], a ? vt(o) && vt(a) ? (l = l, JSON.stringify(o.attrs) === JSON.stringify(a.attrs) ? l.t += o.t : (s.push(l), l = o)) : vt(o) || vt(a) ? (l = l, s.push(l), l = o) : l = (l || "") + o : l = o;
  }
  return l != null && s.push(l), s;
}
function a0(i) {
  return i.replace(/ /g, " ");
}
var ca;
(function(i) {
  function t(c) {
    const h = "data:";
    return c.substr(0, h.length) === h;
  }
  i.isDataUrl = t;
  function e(c, h) {
    if (!c || t(c)) {
      setTimeout(() => h(null, c));
      return;
    }
    const u = () => {
      h(new Error(`Failed to load image: ${c}`));
    }, d = window.FileReader ? (
      // chrome, IE10+
      (g) => {
        if (g.status === 200) {
          const p = new FileReader();
          p.onload = (m) => {
            const b = m.target.result;
            h(null, b);
          }, p.onerror = u, p.readAsDataURL(g.response);
        } else
          u();
      }
    ) : (g) => {
      const p = (m) => {
        const v = [];
        for (let y = 0; y < m.length; y += 32768)
          v.push(String.fromCharCode.apply(null, m.subarray(y, y + 32768)));
        return v.join("");
      };
      if (g.status === 200) {
        let m = c.split(".").pop() || "png";
        m === "svg" && (m = "svg+xml");
        const b = `data:image/${m};base64,`, v = new Uint8Array(g.response), y = b + btoa(p(v));
        h(null, y);
      } else
        u();
    }, f = new XMLHttpRequest();
    f.responseType = window.FileReader ? "blob" : "arraybuffer", f.open("GET", c, !0), f.addEventListener("error", u), f.addEventListener("load", () => d(f)), f.send();
  }
  i.imageToDataUri = e;
  function n(c) {
    let h = c.replace(/\s/g, "");
    h = decodeURIComponent(h);
    const u = h.indexOf(","), d = h.slice(0, u), f = d.split(":")[1].split(";")[0], g = h.slice(u + 1);
    let p;
    d.indexOf("base64") >= 0 ? p = atob(g) : p = unescape(encodeURIComponent(g));
    const m = new Uint8Array(p.length);
    for (let b = 0; b < p.length; b += 1)
      m[b] = p.charCodeAt(b);
    return new Blob([m], { type: f });
  }
  i.dataUriToBlob = n;
  function s(c, h) {
    const u = window.navigator.msSaveBlob;
    if (u)
      u(c, h);
    else {
      const d = window.URL.createObjectURL(c), f = document.createElement("a");
      f.href = d, f.download = h, document.body.appendChild(f), f.click(), document.body.removeChild(f), window.URL.revokeObjectURL(d);
    }
  }
  i.downloadBlob = s;
  function r(c, h) {
    const u = n(c);
    s(u, h);
  }
  i.downloadDataUri = r;
  function o(c) {
    const h = c.match(/<svg[^>]*viewBox\s*=\s*(["']?)(.+?)\1[^>]*>/i);
    return h && h[2] ? h[2].replace(/\s+/, " ").split(" ") : null;
  }
  function a(c) {
    const h = parseFloat(c);
    return Number.isNaN(h) ? null : h;
  }
  function l(c, h = {}) {
    let u = null;
    const d = (y) => (u == null && (u = o(c)), u != null ? a(u[y]) : null), f = (y) => {
      const x = c.match(y);
      return x && x[2] ? a(x[2]) : null;
    };
    let g = h.width;
    if (g == null && (g = f(/<svg[^>]*width\s*=\s*(["']?)(.+?)\1[^>]*>/i)), g == null && (g = d(2)), g == null)
      throw new Error("Can not parse width from svg string");
    let p = h.height;
    if (p == null && (p = f(/<svg[^>]*height\s*=\s*(["']?)(.+?)\1[^>]*>/i)), p == null && (p = d(3)), p == null)
      throw new Error("Can not parse height from svg string");
    return `data:image/svg+xml,${encodeURIComponent(c).replace(/'/g, "%27").replace(/"/g, "%22")}`;
  }
  i.svgToDataUrl = l;
})(ca || (ca = {}));
let Je;
const l0 = {
  px(i) {
    return i;
  },
  mm(i) {
    return Je * i;
  },
  cm(i) {
    return Je * i * 10;
  },
  in(i) {
    return Je * i * 25.4;
  },
  pt(i) {
    return Je * (25.4 * i / 72);
  },
  pc(i) {
    return Je * (25.4 * i / 6);
  }
};
var ha;
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
    Je == null && (Je = t("1", "1", "mm").width);
    const r = s ? l0[s] : null;
    return r ? r(n) : n;
  }
  i.toPx = e;
})(ha || (ha = {}));
const c0 = /-(.)/g;
function h0(i) {
  return i.replace(c0, (t, e) => e.toUpperCase());
}
const qs = {}, ua = ["webkit", "ms", "moz", "o"], Tc = typeof document < "u" ? document.createElement("div").style : {};
function u0(i) {
  for (let t = 0; t < ua.length; t += 1) {
    const e = ua[t] + i;
    if (e in Tc)
      return e;
  }
  return null;
}
function d0(i) {
  const t = h0(i);
  if (qs[t] == null) {
    const e = t.charAt(0).toUpperCase() + t.slice(1);
    qs[t] = t in Tc ? t : u0(e);
  }
  return qs[t];
}
function da(i, t) {
  const e = i.ownerDocument && i.ownerDocument.defaultView && i.ownerDocument.defaultView.opener ? i.ownerDocument.defaultView.getComputedStyle(i, null) : window.getComputedStyle(i, null);
  return e && t ? e.getPropertyValue(t) || e[t] : e;
}
const f0 = {
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
function g0(i) {
  return /^--/.test(i);
}
function p0(i, t, e) {
  const n = window.getComputedStyle(i, null);
  return e ? n.getPropertyValue(t) || void 0 : n[t] || i.style[t];
}
function m0(i, t) {
  return !f0[i] && typeof t == "number" ? `${t}px` : t;
}
function kt(i, t, e) {
  if (typeof t == "string") {
    const n = g0(t);
    if (n || (t = d0(t)), e === void 0)
      return p0(i, t, n);
    n || (e = m0(t, e));
    const s = i.style;
    n ? s.setProperty(t, e) : s[t] = e;
    return;
  }
  for (const n in t)
    kt(i, n, t[n]);
}
const Zi = /* @__PURE__ */ new WeakMap();
function fa(i, t) {
  const e = Es(t), n = Zi.get(i);
  if (n)
    return n[e];
}
function b0(i, t, e) {
  const n = Es(t), s = Zi.get(i);
  s ? s[n] = e : Zi.set(i, {
    [n]: e
  });
}
function sn(i, t, e) {
  if (!t) {
    const n = {};
    return Object.keys(Zi).forEach((s) => {
      n[s] = fa(i, s);
    }), n;
  }
  if (typeof t == "string") {
    if (e === void 0)
      return fa(i, t);
    b0(i, t, e);
    return;
  }
  for (const n in t)
    sn(i, n, t[n]);
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
        s = Ki();
      else if (t[0] === "<") {
        const r = Ki(t);
        s = document.importNode(r.firstChild, !0);
      } else
        s = document.createElementNS(Rt.svg, t);
    else
      s = t;
    this.node = s, e && this.setAttributes(e), n && this.append(n);
  }
  transform(t, e) {
    return t == null ? En(this.node) : (En(this.node, t, e), this);
  }
  translate(t, e = 0, n = {}) {
    return t == null ? pa(this.node) : (pa(this.node, t, e, n), this);
  }
  rotate(t, e, n, s = {}) {
    return t == null ? pr(this.node) : (pr(this.node, t, e, n, s), this);
  }
  scale(t, e) {
    return t == null ? mr(this.node) : (mr(this.node, t, e), this);
  }
  /**
   * Returns an SVGMatrix that specifies the transformation necessary
   * to convert this coordinate system into `target` coordinate system.
   */
  getTransformToElement(t) {
    const e = G.toNode(t);
    return ai(this.node, e);
  }
  removeAttribute(t) {
    return Zr(this.node, t), this;
  }
  getAttribute(t) {
    return r0(this.node, t);
  }
  setAttribute(t, e) {
    return Qr(this.node, t, e), this;
  }
  setAttributes(t) {
    return Ac(this.node, t), this;
  }
  attr(t, e) {
    return t == null ? et(this.node) : typeof t == "string" && e === void 0 ? et(this.node, t) : (typeof t == "object" ? et(this.node, t) : et(this.node, t, e), this);
  }
  svg() {
    return this.node instanceof SVGSVGElement ? this : G.create(this.node.ownerSVGElement);
  }
  defs() {
    const t = this.svg() || this, e = t.node.getElementsByTagName("defs")[0];
    return e ? G.create(e) : G.create("defs").appendTo(t);
  }
  text(t, e = {}) {
    return Lc(this.node, t, e), this;
  }
  tagName() {
    return e0(this.node);
  }
  clone() {
    return G.create(this.node.cloneNode(!0));
  }
  remove() {
    return ve(this.node), this;
  }
  empty() {
    return Ai(this.node), this;
  }
  append(t) {
    return hn(this.node, G.toNodes(t)), this;
  }
  appendTo(t) {
    return ri(this.node, G.isVector(t) ? t.node : t), this;
  }
  prepend(t) {
    return Oc(this.node, G.toNodes(t)), this;
  }
  before(t) {
    return Kr(this.node, G.toNodes(t)), this;
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
    const e = [], n = n0(this.node, t);
    if (n)
      for (let s = 0, r = n.length; s < r; s += 1)
        e.push(G.create(n[s]));
    return e;
  }
  findOne(t) {
    const e = i0(this.node, t);
    return e ? G.create(e) : null;
  }
  findParentByClass(t, e) {
    const n = Sc(this.node, t, e);
    return n ? G.create(n) : null;
  }
  matches(t) {
    const e = this.node;
    this.node.matches;
    const n = e.matches || e.matchesSelector || e.msMatchesSelector || e.mozMatchesSelector || e.webkitMatchesSelector || e.oMatchesSelector || null;
    return n && n.call(e, t);
  }
  contains(t) {
    return Jr(this.node, G.isVector(t) ? t.node : t);
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
    return Yr(this.node);
  }
  hasClass(t) {
    return Hn(this.node, t);
  }
  addClass(t) {
    return U(this.node, t), this;
  }
  removeClass(t) {
    return Ht(this.node, t), this;
  }
  toggleClass(t, e) {
    return Cc(this.node, t, e), this;
  }
  toLocalPoint(t, e) {
    return $0(this.node, t, e);
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
    return this.node instanceof SVGPathElement ? x0(this.node, t) : [];
  }
  toPath() {
    return G.create(M0(this.node));
  }
  toPathData() {
    return Rc(this.node);
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
      const a = Ki(o), l = [];
      for (let c = 0, h = a.childNodes.length; c < h; c += 1) {
        const u = a.childNodes[c];
        l.push(e(document.importNode(u, !0)));
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
function y0(i, t) {
  const e = G.create(t), n = G.create("textPath"), s = i.d;
  if (s && i["xlink:href"] === void 0) {
    const r = G.create("path").attr("d", s).appendTo(e.defs());
    n.attr("xlink:href", `#${r.id}`);
  }
  return typeof i == "object" && n.attr(i), n.node;
}
function v0(i, t, e) {
  const n = e.eol, s = e.baseSize, r = e.lineHeight;
  let o = 0, a;
  const l = {}, c = t.length - 1;
  for (let h = 0; h <= c; h += 1) {
    let u = t[h], d = null;
    if (typeof u == "object") {
      const f = u.attrs, g = G.create("tspan", f);
      a = g.node;
      let p = u.t;
      n && h === c && (p += n), a.textContent = p;
      const m = f.class;
      m && g.addClass(m), e.includeAnnotationIndices && g.attr("annotations", u.annotations.join(",")), d = parseFloat(f["font-size"]), d === void 0 && (d = s), d && d > o && (o = d);
    } else
      n && h === c && (u += n), a = document.createTextNode(u || " "), s && s > o && (o = s);
    i.appendChild(a);
  }
  return o && (l.maxFontSize = o), r ? l.lineHeight = r : o && (l.lineHeight = o * 1.2), l;
}
const Nc = /em$/;
function $i(i, t) {
  const e = parseFloat(i);
  return Nc.test(i) ? e * t : e;
}
function w0(i, t, e, n) {
  if (!Array.isArray(t))
    return 0;
  const s = t.length;
  if (!s)
    return 0;
  let r = t[0];
  const o = $i(r.maxFontSize, e) || e;
  let a = 0;
  const l = $i(n, e);
  for (let u = 1; u < s; u += 1) {
    r = t[u];
    const d = $i(r.lineHeight, e) || l;
    a += d;
  }
  const c = $i(r.maxFontSize, e) || e;
  let h;
  switch (i) {
    case "middle":
      h = o / 2 - 0.15 * c - a / 2;
      break;
    case "bottom":
      h = -(0.25 * c) - a;
      break;
    case "top":
    default:
      h = 0.8 * o;
      break;
  }
  return h;
}
function Lc(i, t, e = {}) {
  t = a0(t);
  const n = e.eol;
  let s = e.textPath;
  const r = e.textVerticalAnchor, o = r === "middle" || r === "bottom" || r === "top";
  let a = e.x;
  a === void 0 && (a = i.getAttribute("x") || 0);
  const l = e.includeAnnotationIndices;
  let c = e.annotations;
  c && !Array.isArray(c) && (c = [c]);
  const h = e.lineHeight, u = h === "auto", d = u ? "1.5em" : h || "1em";
  let f = !0;
  const g = i.childNodes;
  if (g.length === 1) {
    const P = g[0];
    P && P.tagName.toUpperCase() === "TITLE" && (f = !1);
  }
  f && Ai(i), et(i, {
    // Preserve spaces, do not consecutive spaces to get collapsed to one.
    "xml:space": "preserve",
    // An empty text gets rendered into the DOM in webkit-based browsers.
    // In order to unify this behaviour across all browsers
    // we rather hide the text element when it's empty.
    display: t || e.displayEmpty ? null : "none"
  });
  const p = et(i, "font-size");
  let m = parseFloat(p);
  m || (m = 16, (o || c) && !p && et(i, "font-size", `${m}`));
  let b;
  s ? (typeof s == "string" && (s = { d: s }), b = y0(s, i)) : b = document.createDocumentFragment();
  let v, y = 0, x;
  const E = t.split(`
`), S = [], C = E.length - 1;
  for (let P = 0; P <= C; P += 1) {
    v = d;
    let I = "v-line";
    const T = me("tspan");
    let j, H = E[P];
    if (H)
      if (c) {
        const F = o0(H, c, {
          offset: -y,
          includeAnnotationIndices: l
        });
        j = v0(T, F, {
          eol: P !== C && n,
          baseSize: m,
          lineHeight: u ? null : d,
          includeAnnotationIndices: l
        });
        const A = j.lineHeight;
        A && u && P !== 0 && (v = A), P === 0 && (x = j.maxFontSize * 0.8);
      } else
        n && P !== C && (H += n), T.textContent = H;
    else {
      T.textContent = "-", I += " v-empty-line";
      const F = T.style;
      F.fillOpacity = 0, F.strokeOpacity = 0, c && (j = {});
    }
    j && S.push(j), P > 0 && T.setAttribute("dy", v), (P > 0 || s) && T.setAttribute("x", a), T.className.baseVal = I, b.appendChild(T), y += H.length + 1;
  }
  if (o)
    if (c)
      v = w0(r, S, m, d);
    else if (r === "top")
      v = "0.8em";
    else {
      let P;
      switch (C > 0 ? (P = parseFloat(d) || 1, P *= C, Nc.test(d) || (P /= m)) : P = 0, r) {
        case "middle":
          v = `${0.3 - P / 2}em`;
          break;
        case "bottom":
          v = `${-P - 0.3}em`;
          break;
      }
    }
  else r === 0 ? v = "0em" : r ? v = r : (v = 0, i.getAttribute("y") == null && i.setAttribute("y", `${x || "0.8em"}`));
  b.firstChild.setAttribute("dy", v), i.appendChild(b);
}
function oi(i, t = {}) {
  const e = document.createElement("canvas").getContext("2d");
  if (!i)
    return { width: 0 };
  const n = [], s = t["font-size"] ? `${parseFloat(t["font-size"])}px` : "14px";
  return n.push(t["font-style"] || "normal"), n.push(t["font-variant"] || "normal"), n.push(t["font-weight"] || 400), n.push(s), n.push(t["font-family"] || "sans-serif"), e.font = n.join(" "), e.measureText(i);
}
function ga(i, t, e, n = {}) {
  if (t >= e)
    return [i, ""];
  const s = i.length, r = {};
  let o = Math.round(t / e * s - 1);
  for (o < 0 && (o = 0); o >= 0 && o < s; ) {
    const a = i.slice(0, o), l = r[a] || oi(a, n).width, c = i.slice(0, o + 1), h = r[c] || oi(c, n).width;
    if (r[a] = l, r[c] = h, l > t)
      o -= 1;
    else if (h <= t)
      o += 1;
    else
      break;
  }
  return [i.slice(0, o), i.slice(o)];
}
function Ic(i, t, e = {}, n = {}) {
  const s = t.width, r = t.height, o = n.eol || `
`, a = e.fontSize || 14, l = e.lineHeight ? parseFloat(e.lineHeight) : Math.ceil(a * 1.4), c = Math.floor(r / l);
  if (i.indexOf(o) > -1) {
    const m = Ji(), b = [];
    return i.split(o).map((v) => {
      const y = Ic(v, Object.assign(Object.assign({}, t), { height: Number.MAX_SAFE_INTEGER }), e, Object.assign(Object.assign({}, n), { eol: m }));
      y && b.push(...y.split(m));
    }), b.slice(0, c).join(o);
  }
  const { width: h } = oi(i, e);
  if (h < s)
    return i;
  const u = [];
  let d = i, f = h, g = n.ellipsis, p = 0;
  g && (typeof g != "string" && (g = "…"), p = oi(g, e).width);
  for (let m = 0; m < c; m += 1)
    if (f > s)
      if (m === c - 1) {
        const [v] = ga(d, s - p, f, e);
        u.push(g ? `${v}${g}` : v);
      } else {
        const [v, y] = ga(d, s, f, e);
        u.push(v), d = y, f = oi(d, e).width;
      }
    else {
      u.push(d);
      break;
    }
  return u.join(o);
}
const fr = 0.551784;
function Ft(i, t, e = NaN) {
  const n = i.getAttribute(t);
  if (n == null)
    return e;
  const s = parseFloat(n);
  return Number.isNaN(s) ? e : s;
}
function x0(i, t = 1) {
  const e = i.getTotalLength(), n = [];
  let s = 0, r;
  for (; s < e; )
    r = i.getPointAtLength(s), n.push({ distance: s, x: r.x, y: r.y }), s += t;
  return n;
}
function E0(i) {
  return [
    "M",
    Ft(i, "x1"),
    Ft(i, "y1"),
    "L",
    Ft(i, "x2"),
    Ft(i, "y2")
  ].join(" ");
}
function C0(i) {
  const t = Qi(i);
  return t.length === 0 ? null : `${jc(t)} Z`;
}
function S0(i) {
  const t = Qi(i);
  return t.length === 0 ? null : jc(t);
}
function jc(i) {
  return `M ${i.map((e) => `${e.x} ${e.y}`).join(" L")}`;
}
function Qi(i) {
  const t = [], e = i.points;
  if (e)
    for (let n = 0, s = e.numberOfItems; n < s; n += 1)
      t.push(e.getItem(n));
  return t;
}
function O0(i) {
  const t = Ft(i, "cx", 0), e = Ft(i, "cy", 0), n = Ft(i, "r"), s = n * fr;
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
function P0(i) {
  const t = Ft(i, "cx", 0), e = Ft(i, "cy", 0), n = Ft(i, "rx"), s = Ft(i, "ry") || n, r = n * fr, o = s * fr;
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
function A0(i) {
  return kc({
    x: Ft(i, "x", 0),
    y: Ft(i, "y", 0),
    width: Ft(i, "width", 0),
    height: Ft(i, "height", 0),
    rx: Ft(i, "rx", 0),
    ry: Ft(i, "ry", 0)
  });
}
function kc(i) {
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
function M0(i) {
  const t = me("path");
  et(t, et(i));
  const e = Rc(i);
  return e && t.setAttribute("d", e), t;
}
function Rc(i) {
  const t = i.tagName.toLowerCase();
  switch (t) {
    case "path":
      return i.getAttribute("d");
    case "line":
      return E0(i);
    case "polygon":
      return C0(i);
    case "polyline":
      return S0(i);
    case "ellipse":
      return P0(i);
    case "circle":
      return O0(i);
    case "rect":
      return A0(i);
  }
  throw new Error(`"${t}" cannot be converted to svg path element.`);
}
const T0 = /(\w+)\(([^,)]+),?([^)]+)?\)/gi, Dc = /[ ,]+/, N0 = /^(\w+)\((.*)\)/;
function L0(i, t) {
  const n = me("svg").createSVGPoint();
  return n.x = i, n.y = t, n;
}
function $t(i) {
  const e = me("svg").createSVGMatrix();
  if (i != null) {
    const n = i, s = e;
    for (const r in n)
      s[r] = n[r];
  }
  return e;
}
function Qn(i) {
  const t = me("svg");
  return i != null ? (i instanceof DOMMatrix || (i = $t(i)), t.createSVGTransformFromMatrix(i)) : t.createSVGTransform();
}
function pi(i) {
  let t = $t();
  const e = i != null && i.match(T0);
  if (!e)
    return t;
  for (let n = 0, s = e.length; n < s; n += 1) {
    const o = e[n].match(N0);
    if (o) {
      let a, l, c, h, u, d = $t();
      const f = o[2].split(Dc);
      switch (o[1].toLowerCase()) {
        case "scale":
          a = parseFloat(f[0]), l = f[1] === void 0 ? a : parseFloat(f[1]), d = d.scaleNonUniform(a, l);
          break;
        case "translate":
          c = parseFloat(f[0]), h = parseFloat(f[1]), d = d.translate(c, h);
          break;
        case "rotate":
          u = parseFloat(f[0]), c = parseFloat(f[1]) || 0, h = parseFloat(f[2]) || 0, c !== 0 || h !== 0 ? d = d.translate(c, h).rotate(u).translate(-c, -h) : d = d.rotate(u);
          break;
        case "skewx":
          u = parseFloat(f[0]), d = d.skewX(u);
          break;
        case "skewy":
          u = parseFloat(f[0]), d = d.skewY(u);
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
function qn(i) {
  const t = i || {}, e = t.a != null ? t.a : 1, n = t.b != null ? t.b : 0, s = t.c != null ? t.c : 0, r = t.d != null ? t.d : 1, o = t.e != null ? t.e : 0, a = t.f != null ? t.f : 0;
  return `matrix(${e},${n},${s},${r},${o},${a})`;
}
function Os(i) {
  let t, e, n;
  if (i) {
    const r = Dc;
    if (i.trim().indexOf("matrix") >= 0) {
      const o = pi(i), a = I0(o);
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
function gr(i, t) {
  const e = t.x * i.a + t.y * i.c + 0, n = t.x * i.b + t.y * i.d + 0;
  return { x: e, y: n };
}
function I0(i) {
  const t = gr(i, { x: 0, y: 1 }), e = gr(i, { x: 1, y: 0 }), n = 180 / Math.PI * Math.atan2(t.y, t.x) - 90, s = 180 / Math.PI * Math.atan2(e.y, e.x);
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
function j0(i) {
  let t, e, n, s;
  return i ? (t = i.a == null ? 1 : i.a, s = i.d == null ? 1 : i.d, e = i.b, n = i.c) : t = s = 1, {
    sx: e ? Math.sqrt(t * t + e * e) : t,
    sy: n ? Math.sqrt(n * n + s * s) : s
  };
}
function k0(i) {
  let t = { x: 0, y: 1 };
  i && (t = gr(i, t));
  const e = 180 * Math.atan2(t.y, t.x) / Math.PI % 360 - 90;
  return {
    angle: e % 360 + (e < 0 ? 360 : 0)
  };
}
function R0(i) {
  return {
    tx: i && i.e || 0,
    ty: i && i.f || 0
  };
}
function En(i, t, e = {}) {
  if (t == null)
    return pi(et(i, "transform"));
  if (e.absolute) {
    i.setAttribute("transform", qn(t));
    return;
  }
  const n = i.transform, s = Qn(t);
  n.baseVal.appendItem(s);
}
function pa(i, t, e = 0, n = {}) {
  let s = et(i, "transform");
  const r = Os(s);
  if (t == null)
    return r.translation;
  s = r.raw, s = s.replace(/translate\([^)]*\)/g, "").trim();
  const o = n.absolute ? t : r.translation.tx + t, a = n.absolute ? e : r.translation.ty + e, l = `translate(${o},${a})`;
  i.setAttribute("transform", `${l} ${s}`.trim());
}
function pr(i, t, e, n, s = {}) {
  let r = et(i, "transform");
  const o = Os(r);
  if (t == null)
    return o.rotation;
  r = o.raw, r = r.replace(/rotate\([^)]*\)/g, "").trim(), t %= 360;
  const a = s.absolute ? t : o.rotation.angle + t, l = e != null && n != null ? `,${e},${n}` : "", c = `rotate(${a}${l})`;
  i.setAttribute("transform", `${r} ${c}`.trim());
}
function mr(i, t, e) {
  let n = et(i, "transform");
  const s = Os(n);
  if (t == null)
    return s.scale;
  e = e ?? t, n = s.raw, n = n.replace(/scale\([^)]*\)/g, "").trim();
  const r = `scale(${t},${e})`;
  i.setAttribute("transform", `${n} ${r}`.trim());
}
function ai(i, t) {
  if (Be(t) && Be(i)) {
    const e = t.getScreenCTM(), n = i.getScreenCTM();
    if (e && n)
      return e.inverse().multiply(n);
  }
  return $t();
}
function D0(i, t) {
  let e = $t();
  if (Be(t) && Be(i)) {
    let n = i;
    const s = [];
    for (; n && n !== t; ) {
      const r = n.getAttribute("transform") || null, o = pi(r);
      s.push(o), n = n.parentNode;
    }
    s.reverse().forEach((r) => {
      e = e.multiply(r);
    });
  }
  return e;
}
function $0(i, t, e) {
  const n = i instanceof SVGSVGElement ? i : i.ownerSVGElement, s = n.createSVGPoint();
  s.x = t, s.y = e;
  try {
    const r = n.getScreenCTM(), o = s.matrixTransform(r.inverse()), a = ai(i, n).inverse();
    return o.matrixTransform(a);
  } catch {
    return s;
  }
}
var ie;
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
})(ie || (ie = {}));
var Ke;
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
})(Ke || (Ke = {}));
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
    const s = [], r = Ke.get(e), o = r && r.events && r.events[n.type], a = o && o.handlers || [], l = o ? o.delegateCount : 0;
    if (l > 0 && // Support: Firefox <=42 - 66+
    // Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
    // https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
    // Support: IE 11+
    // ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
    !(n.type === "click" && typeof n.button == "number" && n.button >= 1)) {
      for (let c = n.target; c !== e; c = c.parentNode || e)
        if (c.nodeType === 1 && !(n.type === "click" && c.disabled === !0)) {
          const h = [], u = {};
          for (let d = 0; d < l; d += 1) {
            const f = a[d], g = f.selector;
            if (g != null && u[g] == null) {
              const p = e, m = [];
              p.querySelectorAll(g).forEach((b) => {
                m.push(b);
              }), u[g] = m.includes(c);
            }
            u[g] && h.push(f);
          }
          h.length && s.push({ elem: c, handlers: h });
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
class we {
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
})(we || (we = {}));
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
})(we || (we = {}));
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
})(we || (we = {}));
(function(i) {
  ie.register("load", {
    noBubble: !0
  });
})();
(function(i) {
  ie.register("beforeunload", {
    postDispatch(t, e) {
      e.result !== void 0 && e.originalEvent && (e.originalEvent.returnValue = e.result);
    }
  });
})();
(function(i) {
  ie.register("mouseenter", {
    delegateType: "mouseover",
    bindType: "mouseover",
    handle(t, e) {
      let n;
      const s = e.relatedTarget, r = e.handleObj;
      return (!s || s !== t && !q.contains(t, s)) && (e.type = r.originType, n = r.handler.call(t, e), e.type = "mouseover"), n;
    }
  }), ie.register("mouseleave", {
    delegateType: "mouseout",
    bindType: "mouseout",
    handle(t, e) {
      let n;
      const s = e.relatedTarget, r = e.handleObj;
      return (!s || s !== t && !q.contains(t, s)) && (e.type = r.originType, n = r.handler.call(t, e), e.type = "mouseout"), n;
    }
  });
})();
var _0 = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
}, mi;
(function(i) {
  let t;
  function e(o, a, l, c, h) {
    if (!q.isValidTarget(o))
      return;
    let u;
    if (typeof l != "function") {
      const { handler: p, selector: m } = l, b = _0(l, ["handler", "selector"]);
      l = p, h = m, u = b;
    }
    const d = Ke.ensure(o);
    let f = d.handler;
    f == null && (f = d.handler = function(p, ...m) {
      return t !== p.type ? s(o, p, ...m) : void 0;
    });
    const g = q.ensureHandlerId(l);
    q.splitType(a).forEach((p) => {
      const { originType: m, namespaces: b } = q.normalizeType(p);
      if (!m)
        return;
      let v = m, y = ie.get(v);
      v = (h ? y.delegateType : y.bindType) || v, y = ie.get(v);
      const x = Object.assign({
        type: v,
        originType: m,
        data: c,
        selector: h,
        guid: g,
        handler: l,
        namespace: b.join(".")
      }, u), E = d.events;
      let S = E[v];
      S || (S = E[v] = { handlers: [], delegateCount: 0 }, (!y.setup || y.setup(o, c, b, f) === !1) && q.addEventListener(o, v, f)), y.add && (q.removeHandlerId(x.handler), y.add(o, x), q.setHandlerId(x.handler, g)), h ? (S.handlers.splice(S.delegateCount, 0, x), S.delegateCount += 1) : S.handlers.push(x);
    });
  }
  i.on = e;
  function n(o, a, l, c, h) {
    const u = Ke.get(o);
    if (!u)
      return;
    const d = u.events;
    d && (q.splitType(a).forEach((f) => {
      const { originType: g, namespaces: p } = q.normalizeType(f);
      if (!g) {
        Object.keys(d).forEach((E) => {
          n(o, E + f, l, c, !0);
        });
        return;
      }
      let m = g;
      const b = ie.get(m);
      m = (c ? b.delegateType : b.bindType) || m;
      const v = d[m];
      if (!v)
        return;
      const y = p.length > 0 ? new RegExp(`(^|\\.)${p.join("\\.(?:.*\\.|)")}(\\.|$)`) : null, x = v.handlers.length;
      for (let E = v.handlers.length - 1; E >= 0; E -= 1) {
        const S = v.handlers[E];
        (h || g === S.originType) && (!l || q.getHandlerId(l) === S.guid) && (y == null || S.namespace && y.test(S.namespace)) && (c == null || c === S.selector || c === "**" && S.selector) && (v.handlers.splice(E, 1), S.selector && (v.delegateCount -= 1), b.remove && b.remove(o, S));
      }
      x && v.handlers.length === 0 && ((!b.teardown || b.teardown(o, p, u.handler) === !1) && q.removeEventListener(o, m, u.handler), delete d[m]);
    }), Object.keys(d).length === 0 && Ke.remove(o));
  }
  i.off = n;
  function s(o, a, ...l) {
    const c = we.create(a);
    c.delegateTarget = o;
    const h = ie.get(c.type);
    if (h.preDispatch && h.preDispatch(o, c) === !1)
      return;
    const u = q.getHandlerQueue(o, c);
    for (let d = 0, f = u.length; d < f && !c.isPropagationStopped(); d += 1) {
      const g = u[d];
      c.currentTarget = g.elem;
      for (let p = 0, m = g.handlers.length; p < m && !c.isImmediatePropagationStopped(); p += 1) {
        const b = g.handlers[p];
        if (c.rnamespace == null || b.namespace && c.rnamespace.test(b.namespace)) {
          c.handleObj = b, c.data = b.data;
          const v = ie.get(b.originType).handle, y = v ? v(g.elem, c, ...l) : b.handler.call(g.elem, c, ...l);
          y !== void 0 && (c.result = y, y === !1 && (c.preventDefault(), c.stopPropagation()));
        }
      }
    }
    return h.postDispatch && h.postDispatch(o, c), c.result;
  }
  i.dispatch = s;
  function r(o, a, l, c) {
    let h = o, u = typeof o == "string" ? o : o.type, d = typeof o == "string" || h.namespace == null ? [] : h.namespace.split(".");
    const f = l;
    if (f.nodeType === 3 || f.nodeType === 8)
      return;
    u.indexOf(".") > -1 && (d = u.split("."), u = d.shift(), d.sort());
    const g = u.indexOf(":") < 0 && `on${u}`;
    h = o instanceof we ? o : new we(u, typeof o == "object" ? o : null), h.namespace = d.join("."), h.rnamespace = h.namespace ? new RegExp(`(^|\\.)${d.join("\\.(?:.*\\.|)")}(\\.|$)`) : null, h.result = void 0, h.target || (h.target = f);
    const p = [h];
    Array.isArray(a) ? p.push(...a) : p.push(a);
    const m = ie.get(u);
    if (!c && m.trigger && m.trigger(f, h, a) === !1)
      return;
    let b;
    const v = [f];
    if (!c && !m.noBubble && !q.isWindow(f)) {
      b = m.delegateType || u;
      let x = f, E = f.parentNode;
      for (; E != null; )
        v.push(E), x = E, E = E.parentNode;
      const S = f.ownerDocument || document;
      if (x === S) {
        const C = x.defaultView || x.parentWindow || window;
        v.push(C);
      }
    }
    let y = f;
    for (let x = 0, E = v.length; x < E && !h.isPropagationStopped(); x += 1) {
      const S = v[x];
      y = S, h.type = x > 1 ? b : m.bindType || u;
      const C = Ke.get(S);
      C && C.events[h.type] && C.handler && C.handler.call(S, ...p);
      const O = g && S[g] || null;
      O && q.isValidTarget(S) && (h.result = O.call(S, ...p), h.result === !1 && h.preventDefault());
    }
    if (h.type = u, !c && !h.isDefaultPrevented()) {
      const x = m.preventDefault;
      if ((x == null || x(v.pop(), h, a) === !1) && q.isValidTarget(f) && g && typeof f[u] == "function" && !q.isWindow(f)) {
        const E = f[g];
        E && (f[g] = null), t = u, h.isPropagationStopped() && y.addEventListener(u, q.stopPropagationCallback), f[u](), h.isPropagationStopped() && y.removeEventListener(u, q.stopPropagationCallback), t = void 0, E && (f[g] = E);
      }
    }
    return h.result;
  }
  i.trigger = r;
})(mi || (mi = {}));
var Vt;
(function(i) {
  function t(r, o, a, l, c) {
    return li.on(r, o, a, l, c), r;
  }
  i.on = t;
  function e(r, o, a, l, c) {
    return li.on(r, o, a, l, c, !0), r;
  }
  i.once = e;
  function n(r, o, a, l) {
    return li.off(r, o, a, l), r;
  }
  i.off = n;
  function s(r, o, a, l) {
    return mi.trigger(o, a, r, l), r;
  }
  i.trigger = s;
})(Vt || (Vt = {}));
var li;
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
      a = function(h, ...u) {
        return i.off(n, h), c.call(this, h, ...u);
      }, q.setHandlerId(a, q.ensureHandlerId(c));
    }
    mi.on(n, s, a, o, r);
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
    (r === !1 || typeof r == "function") && (o = r, r = void 0), o === !1 && (o = q.returnFalse), mi.off(n, s, o, r);
  }
  i.off = e;
})(li || (li = {}));
class $c {
  constructor(t, e, n) {
    this.animationFrameId = 0, this.deltaX = 0, this.deltaY = 0, this.eventName = _e.isEventSupported("wheel") ? "wheel" : "mousewheel", this.target = t, this.onWheelCallback = e, this.onWheelGuard = n, this.onWheel = this.onWheel.bind(this), this.didWheel = this.didWheel.bind(this);
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
function br(i) {
  const t = i.getBoundingClientRect(), e = i.ownerDocument.defaultView;
  return {
    top: t.top + e.pageYOffset,
    left: t.left + e.pageXOffset
  };
}
function B0(i) {
  return i.getBoundingClientRect().width;
}
function z0(i) {
  return i.getBoundingClientRect().height;
}
function _c(i, t = 60) {
  let e = null;
  return (...n) => {
    e && clearTimeout(e), e = window.setTimeout(() => {
      i.apply(this, n);
    }, t);
  };
}
function V0(i) {
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
  }, s = _c(() => {
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
function F0(i) {
  let t = null, e = [];
  const n = _c(() => {
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
const G0 = typeof ResizeObserver < "u" ? F0 : V0;
var ts;
(function(i) {
  const t = /* @__PURE__ */ new WeakMap();
  function e(s) {
    let r = t.get(s);
    return r || (r = G0(s), t.set(s, r), r);
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
})(ts || (ts = {}));
let yr = class Bc {
  constructor(t = {}) {
    this.comparator = t.comparator || Bc.defaultComparator, this.index = {}, this.data = t.data || [], this.heapify();
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
})(yr || (yr = {}));
var vr;
(function(i) {
  function t(e, n, s = (r, o) => 1) {
    const r = {}, o = {}, a = {}, l = new yr();
    for (r[n] = 0, Object.keys(e).forEach((c) => {
      c !== n && (r[c] = 1 / 0), l.insert(r[c], c, c);
    }); !l.isEmpty(); ) {
      const c = l.remove();
      a[c] = !0;
      const h = e[c] || [];
      for (let u = 0; u < h.length; u += 1) {
        const d = h[u];
        if (!a[d]) {
          const f = r[c] + s(c, d);
          f < r[d] && (r[d] = f, o[d] = c, l.updatePriority(d, f));
        }
      }
    }
    return o;
  }
  i.run = t;
})(vr || (vr = {}));
class Ae {
  constructor(t, e, n, s) {
    if (t == null)
      return this.set(255, 255, 255, 1);
    if (typeof t == "number")
      return this.set(t, e, n, s);
    if (typeof t == "string")
      return Ae.fromString(t) || this;
    if (Array.isArray(t))
      return this.set(t);
    this.set(t.r, t.g, t.b, t.a == null ? 1 : t.a);
  }
  blend(t, e, n) {
    this.set(t.r + (e.r - t.r) * n, t.g + (e.g - t.g) * n, t.b + (e.b - t.b) * n, t.a + (e.a - t.a) * n);
  }
  lighten(t) {
    const e = Ae.lighten(this.toArray(), t);
    this.r = e[0], this.g = e[1], this.b = e[2], this.a = e[3];
  }
  darken(t) {
    this.lighten(-t);
  }
  set(t, e, n, s) {
    const r = Array.isArray(t) ? t[0] : t, o = Array.isArray(t) ? t[1] : e, a = Array.isArray(t) ? t[2] : n, l = Array.isArray(t) ? t[3] : s;
    return this.r = Math.round(se(r, 0, 255)), this.g = Math.round(se(o, 0, 255)), this.b = Math.round(se(a, 0, 255)), this.a = l == null ? 1 : se(l, 0, 1), this;
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
    return Ae.rgba2hsla(this.r, this.g, this.b, this.a);
  }
  toCSS(t) {
    const e = `${this.r},${this.g},${this.b},`;
    return t ? `rgb(${e})` : `rgba(${e},${this.a})`;
  }
  toGrey() {
    return Ae.makeGrey(Math.round((this.r + this.g + this.b) / 3), this.a);
  }
  toArray() {
    return [this.r, this.g, this.b, this.a];
  }
  toString() {
    return this.toCSS();
  }
}
(function(i) {
  function t(y) {
    return new i(y);
  }
  i.fromArray = t;
  function e(y) {
    return new i([...g(y), 1]);
  }
  i.fromHex = e;
  function n(y) {
    const x = y.toLowerCase().match(/^rgba?\(([\s.,0-9]+)\)/);
    if (x) {
      const E = x[1].split(/\s*,\s*/).map((S) => parseInt(S, 10));
      return new i(E);
    }
    return null;
  }
  i.fromRGBA = n;
  function s(y, x, E) {
    E < 0 && ++E, E > 1 && --E;
    const S = 6 * E;
    return S < 1 ? y + (x - y) * S : 2 * E < 1 ? x : 3 * E < 2 ? y + (x - y) * (2 / 3 - E) * 6 : y;
  }
  function r(y) {
    const x = y.toLowerCase().match(/^hsla?\(([\s.,0-9]+)\)/);
    if (x) {
      const E = x[2].split(/\s*,\s*/), S = (parseFloat(E[0]) % 360 + 360) % 360 / 360, C = parseFloat(E[1]) / 100, O = parseFloat(E[2]) / 100, P = E[3] == null ? 1 : parseInt(E[3], 10);
      return new i(c(S, C, O, P));
    }
    return null;
  }
  i.fromHSLA = r;
  function o(y) {
    if (y.startsWith("#"))
      return e(y);
    if (y.startsWith("rgb"))
      return n(y);
    const x = i.named[y];
    return x ? e(x) : r(y);
  }
  i.fromString = o;
  function a(y, x) {
    return i.fromArray([y, y, y, x]);
  }
  i.makeGrey = a;
  function l(y, x, E, S) {
    const C = Array.isArray(y) ? y[0] : y, O = Array.isArray(y) ? y[1] : x, P = Array.isArray(y) ? y[2] : E, I = Array.isArray(y) ? y[3] : S, T = Math.max(C, O, P), j = Math.min(C, O, P), H = (T + j) / 2;
    let F = 0, A = 0;
    if (j !== T) {
      const N = T - j;
      switch (A = H > 0.5 ? N / (2 - T - j) : N / (T + j), T) {
        case C:
          F = (O - P) / N + (O < P ? 6 : 0);
          break;
        case O:
          F = (P - C) / N + 2;
          break;
        case P:
          F = (C - O) / N + 4;
          break;
      }
      F /= 6;
    }
    return [F, A, H, I ?? 1];
  }
  i.rgba2hsla = l;
  function c(y, x, E, S) {
    const C = Array.isArray(y) ? y[0] : y, O = Array.isArray(y) ? y[1] : x, P = Array.isArray(y) ? y[2] : E, I = Array.isArray(y) ? y[3] : S, T = P <= 0.5 ? P * (O + 1) : P + O - P * O, j = 2 * P - T;
    return [
      s(j, T, C + 1 / 3) * 256,
      s(j, T, C) * 256,
      s(j, T, C - 1 / 3) * 256,
      I ?? 1
    ];
  }
  i.hsla2rgba = c;
  function h(y) {
    return new i(Math.round(Math.random() * 256), Math.round(Math.random() * 256), Math.round(Math.random() * 256), y ? void 0 : parseFloat(Math.random().toFixed(2)));
  }
  i.random = h;
  function u() {
    const y = "0123456789ABCDEF";
    let x = "#";
    for (let E = 0; E < 6; E += 1)
      x += y[Math.floor(Math.random() * 16)];
    return x;
  }
  i.randomHex = u;
  function d(y) {
    return h(y).toString();
  }
  i.randomRGBA = d;
  function f(y, x) {
    if (typeof y == "string") {
      const P = y[0] === "#", [I, T, j] = g(y);
      return x ? I * 0.299 + T * 0.587 + j * 0.114 > 186 ? "#000000" : "#ffffff" : `${P ? "#" : ""}${p(255 - I, 255 - T, 255 - j)}`;
    }
    const E = y[0], S = y[1], C = y[2], O = y[3];
    return x ? E * 0.299 + S * 0.587 + C * 0.114 > 186 ? [0, 0, 0, O] : [255, 255, 255, O] : [255 - E, 255 - S, 255 - C, O];
  }
  i.invert = f;
  function g(y) {
    const x = y.indexOf("#") === 0 ? y : `#${y}`;
    let E = +`0x${x.substr(1)}`;
    if (!(x.length === 4 || x.length === 7) || Number.isNaN(E))
      throw new Error("Invalid hex color.");
    const S = x.length === 4 ? 4 : 8, C = (1 << S) - 1, O = ["b", "g", "r"].map(() => {
      const P = E & C;
      return E >>= S, S === 4 ? 17 * P : P;
    });
    return [O[2], O[1], O[0]];
  }
  function p(y, x, E) {
    const S = (C) => C.length < 2 ? `0${C}` : C;
    return `${S(y.toString(16))}${S(x.toString(16))}${S(E.toString(16))}`;
  }
  function m(y, x) {
    return v(y, x);
  }
  i.lighten = m;
  function b(y, x) {
    return v(y, -x);
  }
  i.darken = b;
  function v(y, x) {
    if (typeof y == "string") {
      const C = y[0] === "#", O = parseInt(C ? y.substr(1) : y, 16), P = se((O >> 16) + x, 0, 255), I = se((O >> 8 & 255) + x, 0, 255), T = se((O & 255) + x, 0, 255);
      return `${C ? "#" : ""}${(T | I << 8 | P << 16).toString(16)}`;
    }
    const E = p(y[0], y[1], y[2]), S = g(v(E, x));
    return [S[0], S[1], S[2], y[3]];
  }
})(Ae || (Ae = {}));
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
})(Ae || (Ae = {}));
class wr {
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
var ze;
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
      const o = t(s), a = t(r), l = o.or.sort(), c = a.or.sort(), h = o.and.sort(), u = a.and.sort(), d = (f, g) => f.length === g.length && (f.length === 0 || f.every((p, m) => p === g[m]));
      return d(l, c) && d(h, u);
    }
    return s == null && r == null;
  }
  i.equals = e;
  function n(s, r, o) {
    if (r == null || Array.isArray(r) && r.length === 0)
      return o ? s.altKey !== !0 && s.ctrlKey !== !0 && s.metaKey !== !0 && s.shiftKey !== !0 : !0;
    const { or: a, and: l } = t(r), c = (h) => {
      const u = `${h.toLowerCase()}Key`;
      return s[u] === !0;
    };
    return a.some((h) => c(h)) && l.every((h) => c(h));
  }
  i.isMatch = n;
})(ze || (ze = {}));
var rn;
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
})(rn || (rn = {}));
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
})(rn || (rn = {}));
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
  function h(A) {
    return A * A * A * A;
  }
  i.easeInQuart = h;
  function u(A) {
    const N = A - 1;
    return 1 - N * N * N * N;
  }
  i.easeOutQuart = u;
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
  function b(A) {
    return A === 1 ? 1 : -Math.pow(2, -10 * A) + 1;
  }
  i.easeOutExpo = b;
  function v(A) {
    if (A === 0 || A === 1)
      return A;
    const N = A * 2, V = N - 1;
    return N < 1 ? 0.5 * Math.pow(2, 10 * V) : 0.5 * (-Math.pow(2, -10 * V) + 2);
  }
  i.easeInOutExpo = v;
  function y(A) {
    const N = A / 1;
    return -1 * (Math.sqrt(1 - N * A) - 1);
  }
  i.easeInCirc = y;
  function x(A) {
    const N = A - 1;
    return Math.sqrt(1 - N * N);
  }
  i.easeOutCirc = x;
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
  function O(A, N = 1.70158) {
    const V = A * 2, st = V - 2, Q = N * 1.525;
    return V < 1 ? 0.5 * V * V * ((Q + 1) * V - Q) : 0.5 * (st * st * ((Q + 1) * st + Q) + 2);
  }
  i.easeInOutBack = O;
  function P(A, N = 0.7) {
    if (A === 0 || A === 1)
      return A;
    const st = A / 1 - 1, Q = 1 - N, ut = Q / (2 * Math.PI) * Math.asin(1);
    return -(Math.pow(2, 10 * st) * // eslint-disable-line
    Math.sin((st - ut) * (2 * Math.PI) / Q));
  }
  i.easeInElastic = P;
  function I(A, N = 0.7) {
    const V = 1 - N, st = A * 2;
    if (A === 0 || A === 1)
      return A;
    const Q = V / (2 * Math.PI) * Math.asin(1);
    return Math.pow(2, -10 * st) * // eslint-disable-line
    Math.sin((st - Q) * (2 * Math.PI) / V) + 1;
  }
  i.easeOutElastic = I;
  function T(A, N = 0.65) {
    const V = 1 - N;
    if (A === 0 || A === 1)
      return A;
    const st = A * 2, Q = st - 1, ut = V / (2 * Math.PI) * Math.asin(1);
    return st < 1 ? -0.5 * (Math.pow(2, 10 * Q) * // eslint-disable-line
    Math.sin((Q - ut) * (2 * Math.PI) / V)) : Math.pow(2, -10 * Q) * // eslint-disable-line
    Math.sin((Q - ut) * (2 * Math.PI) / V) * 0.5 + 1;
  }
  i.easeInOutElastic = T;
  function j(A) {
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
  i.easeOutBounce = j;
  function H(A) {
    return 1 - j(1 - A);
  }
  i.easeInBounce = H;
  function F(A) {
    return A < 0.5 ? H(A * 2) * 0.5 : j(A * 2 - 1) * 0.5 + 0.5;
  }
  i.easeInOutBounce = F;
})(rn || (rn = {}));
var Ze;
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
    const n = /(-?[0-9]*.[0-9]*)(px|em|cm|mm|in|pt|pc|%)/, s = n.exec(t), r = n.exec(e), o = r ? r[1] : "", a = s ? +s[1] : 0, l = r ? +r[1] : 0, c = o.indexOf("."), h = c > 0 ? o[1].length - c - 1 : 0, u = l - a, d = s ? s[2] : "";
    return (f) => (a + u * f).toFixed(h) + d;
  }, i.color = (t, e) => {
    const n = parseInt(t.slice(1), 16), s = parseInt(e.slice(1), 16), r = n & 255, o = (s & 255) - r, a = n & 65280, l = (s & 65280) - a, c = n & 16711680, h = (s & 16711680) - c;
    return (u) => {
      const d = r + o * u & 255, f = a + l * u & 65280, g = c + h * u & 16711680;
      return `#${(1 << 24 | d | f | g).toString(16).slice(1)}`;
    };
  };
})(Ze || (Ze = {}));
const ci = [];
function Ps(i, t) {
  const e = ci.find((n) => n.name === i);
  if (!(e && (e.loadTimes += 1, e.loadTimes > 1)) && !_e.isApplyingHMR()) {
    const n = document.createElement("style");
    n.setAttribute("type", "text/css"), n.textContent = t;
    const s = document.querySelector("head");
    s && s.insertBefore(n, s.firstChild), ci.push({
      name: i,
      loadTimes: 1,
      styleElement: n
    });
  }
}
function As(i) {
  const t = ci.findIndex((e) => e.name === i);
  if (t > -1) {
    const e = ci[t];
    if (e.loadTimes -= 1, e.loadTimes > 0)
      return;
    let n = e.styleElement;
    n && n.parentNode && n.parentNode.removeChild(n), n = null, ci.splice(t, 1);
  }
}
var ct;
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
})(ct || (ct = {}));
var lt;
(function(i) {
  function t(a, l = 0) {
    return Number.isInteger(a) ? a : +a.toFixed(l);
  }
  i.round = t;
  function e(a, l) {
    let c, h;
    if (l == null ? (h = a ?? 1, c = 0) : (h = l, c = a ?? 0), h < c) {
      const u = c;
      c = h, h = u;
    }
    return Math.floor(Math.random() * (h - c + 1) + c);
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
    const c = a.x - l.x, h = a.y - l.y;
    return c * c + h * h;
  }
  i.squaredLength = o;
})(lt || (lt = {}));
class Ue {
  valueOf() {
    return this.toJSON();
  }
  toString() {
    return JSON.stringify(this.toJSON());
  }
}
class w extends Ue {
  constructor(t, e) {
    super(), this.x = t ?? 0, this.y = e ?? 0;
  }
  /**
   * Rounds the point to the given precision.
   */
  round(t = 0) {
    return this.x = lt.round(this.x, t), this.y = lt.round(this.y, t), this;
  }
  add(t, e) {
    const n = w.create(t, e);
    return this.x += n.x, this.y += n.y, this;
  }
  update(t, e) {
    const n = w.create(t, e);
    return this.x = n.x, this.y = n.y, this;
  }
  translate(t, e) {
    const n = w.create(t, e);
    return this.x += n.x, this.y += n.y, this;
  }
  /**
   * Rotate the point by `degree` around `center`.
   */
  rotate(t, e) {
    const n = w.rotate(this, t, e);
    return this.x = n.x, this.y = n.y, this;
  }
  /**
   * Scale point by `sx` and `sy` around the given `origin`. If origin is
   * not specified, the point is scaled around `0, 0`.
   */
  scale(t, e, n = new w()) {
    const s = w.create(n);
    return this.x = s.x + t * (this.x - s.x), this.y = s.y + e * (this.y - s.y), this;
  }
  /**
   * Chooses the point closest to this point from among `points`. If `points`
   * is an empty array, `null` is returned.
   */
  closest(t) {
    if (t.length === 1)
      return w.create(t[0]);
    let e = null, n = 1 / 0;
    return t.forEach((s) => {
      const r = this.squaredDistance(s);
      r < n && (e = s, n = r);
    }), e ? w.create(e) : null;
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
    const e = w.create(t), n = this.x - e.x, s = this.y - e.y;
    return n * n + s * s;
  }
  manhattanDistance(t) {
    const e = w.create(t);
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
  theta(t = new w()) {
    const e = w.create(t), n = -(e.y - this.y), s = e.x - this.x;
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
    return new w(0, 0).angleBetween(this, t);
  }
  /**
   * Converts rectangular to polar coordinates.
   */
  toPolar(t) {
    return this.update(w.toPolar(this, t)), this;
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
  changeInAngle(t, e, n = new w()) {
    return this.clone().translate(-t, -e).theta(n) - this.theta(n);
  }
  /**
   * If the point lies outside the rectangle `rect`, adjust the point so that
   * it becomes the nearest point on the boundary of `rect`.
   */
  adhereToRect(t) {
    return lt.containsPoint(t, this) || (this.x = Math.min(Math.max(this.x, t.x), t.x + t.width), this.y = Math.min(Math.max(this.y, t.y), t.y + t.height)), this;
  }
  /**
   * Returns the bearing(cardinal direction) between me and the given point.
   *
   * @see https://en.wikipedia.org/wiki/Cardinal_direction
   */
  bearing(t) {
    const e = w.create(t), n = ct.toRad(this.y), s = ct.toRad(e.y), r = this.x, o = e.x, a = ct.toRad(o - r), l = Math.sin(a) * Math.cos(s), c = Math.cos(n) * Math.sin(s) - Math.sin(n) * Math.cos(s) * Math.cos(a), h = ct.toDeg(Math.atan2(l, c)), u = ["NE", "E", "SE", "S", "SW", "W", "NW", "N"];
    let d = h - 22.5;
    return d < 0 && (d += 360), d = parseInt(d / 45, 10), u[d];
  }
  /**
   * Returns the cross product of the vector from me to `p1` and the vector
   * from me to `p2`.
   *
   * The left-hand rule is used because the coordinate system is left-handed.
   */
  cross(t, e) {
    if (t != null && e != null) {
      const n = w.create(t), s = w.create(e);
      return (s.x - this.x) * (n.y - this.y) - (s.y - this.y) * (n.x - this.x);
    }
    return NaN;
  }
  /**
   * Returns the dot product of this point with given other point.
   */
  dot(t) {
    const e = w.create(t);
    return this.x * e.x + this.y * e.y;
  }
  diff(t, e) {
    if (typeof t == "number")
      return new w(this.x - t, this.y - e);
    const n = w.create(t);
    return new w(this.x - n.x, this.y - n.y);
  }
  /**
   * Returns an interpolation between me and point `p` for a parametert in
   * the closed interval `[0, 1]`.
   */
  lerp(t, e) {
    const n = w.create(t);
    return new w((1 - e) * this.x + e * n.x, (1 - e) * this.y + e * n.y);
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
    const n = w.create(t), s = ct.toRad(n.theta(this));
    return this.translate(Math.cos(s) * e, -Math.sin(s) * e);
  }
  /**
   * Returns a point that is the reflection of me with the center of inversion
   * in `ref` point.
   */
  reflection(t) {
    return w.create(t).move(this, this.distance(t));
  }
  snapToGrid(t, e) {
    return this.x = lt.snapToGrid(this.x, t), this.y = lt.snapToGrid(this.y, e ?? t), this;
  }
  equals(t) {
    const e = w.create(t);
    return e != null && e.x === this.x && e.y === this.y;
  }
  clone() {
    return w.clone(this);
  }
  /**
   * Returns the point as a simple JSON object. For example: `{ x: 0, y: 0 }`.
   */
  toJSON() {
    return w.toJSON(this);
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
})(w || (w = {}));
(function(i) {
  function t(n) {
    return n != null && typeof n == "object" && typeof n.x == "number" && typeof n.y == "number";
  }
  i.isPointLike = t;
  function e(n) {
    return n != null && Array.isArray(n) && n.length === 2 && typeof n[0] == "number" && typeof n[1] == "number";
  }
  i.isPointData = e;
})(w || (w = {}));
(function(i) {
  function t(u, d) {
    return u == null || typeof u == "number" ? new i(u, d) : e(u);
  }
  i.create = t;
  function e(u) {
    return i.isPoint(u) ? new i(u.x, u.y) : Array.isArray(u) ? new i(u[0], u[1]) : new i(u.x, u.y);
  }
  i.clone = e;
  function n(u) {
    return i.isPoint(u) ? { x: u.x, y: u.y } : Array.isArray(u) ? { x: u[0], y: u[1] } : { x: u.x, y: u.y };
  }
  i.toJSON = n;
  function s(u, d, f = new i()) {
    let g = Math.abs(u * Math.cos(d)), p = Math.abs(u * Math.sin(d));
    const m = e(f), b = ct.normalize(ct.toDeg(d));
    return b < 90 ? p = -p : b < 180 ? (g = -g, p = -p) : b < 270 && (g = -g), new i(m.x + g, m.y + p);
  }
  i.fromPolar = s;
  function r(u, d = new i()) {
    const f = e(u), g = e(d), p = f.x - g.x, m = f.y - g.y;
    return new i(
      Math.sqrt(p * p + m * m),
      // r
      ct.toRad(g.theta(f))
    );
  }
  i.toPolar = r;
  function o(u, d) {
    return u === d ? !0 : u != null && d != null ? u.x === d.x && u.y === d.y : !1;
  }
  i.equals = o;
  function a(u, d) {
    if (u == null && d != null || u != null && d == null || u != null && d != null && u.length !== d.length)
      return !1;
    if (u != null && d != null) {
      for (let f = 0, g = u.length; f < g; f += 1)
        if (!o(u[f], d[f]))
          return !1;
    }
    return !0;
  }
  i.equalPoints = a;
  function l(u, d, f, g) {
    return new i(lt.random(u, d), lt.random(f, g));
  }
  i.random = l;
  function c(u, d, f) {
    const g = ct.toRad(ct.normalize(-d)), p = Math.sin(g), m = Math.cos(g);
    return h(u, m, p, f);
  }
  i.rotate = c;
  function h(u, d, f, g = new i()) {
    const p = e(u), m = e(g), b = p.x - m.x, v = p.y - m.y, y = b * d - v * f, x = v * d + b * f;
    return new i(y + m.x, x + m.y);
  }
  i.rotateEx = h;
})(w || (w = {}));
class R extends Ue {
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
    return new w(this.x, this.y);
  }
  get topLeft() {
    return new w(this.x, this.y);
  }
  get topCenter() {
    return new w(this.x + this.width / 2, this.y);
  }
  get topRight() {
    return new w(this.x + this.width, this.y);
  }
  get center() {
    return new w(this.x + this.width / 2, this.y + this.height / 2);
  }
  get bottomLeft() {
    return new w(this.x, this.y + this.height);
  }
  get bottomCenter() {
    return new w(this.x + this.width / 2, this.y + this.height);
  }
  get bottomRight() {
    return new w(this.x + this.width, this.y + this.height);
  }
  get corner() {
    return new w(this.x + this.width, this.y + this.height);
  }
  get rightMiddle() {
    return new w(this.x + this.width, this.y + this.height / 2);
  }
  get leftMiddle() {
    return new w(this.x, this.y + this.height / 2);
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
    const e = ct.toRad(t), n = Math.abs(Math.sin(e)), s = Math.abs(Math.cos(e)), r = this.width * s + this.height * n, o = this.width * n + this.height * s;
    return new R(this.x + (this.width - r) / 2, this.y + (this.height - o) / 2, r, o);
  }
  round(t = 0) {
    return this.x = lt.round(this.x, t), this.y = lt.round(this.y, t), this.width = lt.round(this.width, t), this.height = lt.round(this.height, t), this;
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
    const n = w.create(t, e);
    return this.x += n.x, this.y += n.y, this;
  }
  scale(t, e, n = new w()) {
    const s = this.origin.scale(t, e, n);
    return this.x = s.x, this.y = s.y, this.width *= t, this.height *= e, this;
  }
  rotate(t, e = this.getCenter()) {
    if (t !== 0) {
      const n = ct.toRad(t), s = Math.cos(n), r = Math.sin(n);
      let o = this.getOrigin(), a = this.getTopRight(), l = this.getBottomRight(), c = this.getBottomLeft();
      o = w.rotateEx(o, s, r, e), a = w.rotateEx(a, s, r, e), l = w.rotateEx(l, s, r, e), c = w.rotateEx(c, s, r, e);
      const h = new R(o.x, o.y, 0, 0);
      h.add(a.x, a.y, 0, 0), h.add(l.x, l.y, 0, 0), h.add(c.x, c.y, 0, 0), this.update(h);
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
    let o = 1 / 0, a = 1 / 0, l = 1 / 0, c = 1 / 0, h = 1 / 0, u = 1 / 0, d = 1 / 0, f = 1 / 0;
    const g = n.topLeft;
    g.x < s && (o = (this.x - s) / (g.x - s)), g.y < r && (h = (this.y - r) / (g.y - r));
    const p = n.bottomRight;
    p.x > s && (a = (this.x + this.width - s) / (p.x - s)), p.y > r && (u = (this.y + this.height - r) / (p.y - r));
    const m = n.topRight;
    m.x > s && (l = (this.x + this.width - s) / (m.x - s)), m.y < r && (d = (this.y - r) / (m.y - r));
    const b = n.bottomLeft;
    return b.x < s && (c = (this.x - s) / (b.x - s)), b.y > r && (f = (this.y + this.height - r) / (b.y - r)), {
      sx: Math.min(o, a, l, c),
      sy: Math.min(h, u, d, f)
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
    return lt.containsPoint(this, w.create(t, e));
  }
  containsRect(t, e, n, s) {
    const r = R.create(t, e, n, s), o = this.x, a = this.y, l = this.width, c = this.height, h = r.x, u = r.y, d = r.width, f = r.height;
    return l === 0 || c === 0 || d === 0 || f === 0 ? !1 : h >= o && u >= a && h + d <= o + l && u + f <= a + c;
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
    const n = w.clone(t), s = this.center;
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
    const o = this.origin, a = this.corner, l = r.origin, c = r.corner, h = Math.max(o.x, l.x), u = Math.max(o.y, l.y);
    return new R(h, u, Math.min(a.x, c.x) - h, Math.min(a.y, c.y) - u);
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
    const e = R.clone(t), n = this.origin, s = this.corner, r = e.origin, o = e.corner, a = Math.min(n.x, r.x), l = Math.min(n.y, r.y), c = Math.max(s.x, o.x), h = Math.max(s.y, o.y);
    return new R(a, l, c - a, h - l);
  }
  /**
   * Returns a string ("top", "left", "right" or "bottom") denoting the side of
   * the rectangle which is nearest to the point `p`.
   */
  getNearestSideToPoint(t) {
    const e = w.clone(t), n = e.x - this.x, s = this.x + this.width - e.x, r = e.y - this.y, o = this.y + this.height - e.y;
    let a = n, l = "left";
    return s < a && (a = s, l = "right"), r < a && (a = r, l = "top"), o < a && (l = "bottom"), l;
  }
  /**
   * Returns a point on the boundary of the rectangle nearest to the point `p`.
   */
  getNearestPointToPoint(t) {
    const e = w.clone(t);
    if (this.containsPoint(e)) {
      const n = this.getNearestSideToPoint(e);
      if (n === "left")
        return new w(this.x, e.y);
      if (n === "top")
        return new w(e.x, this.y);
      if (n === "right")
        return new w(this.x + this.width, e.y);
      if (n === "bottom")
        return new w(e.x, this.y + this.height);
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
class D extends Ue {
  get center() {
    return new w((this.start.x + this.end.x) / 2, (this.start.y + this.end.y) / 2);
  }
  constructor(t, e, n, s) {
    super(), typeof t == "number" && typeof e == "number" ? (this.start = new w(t, e), this.end = new w(n, s)) : (this.start = w.create(t), this.end = w.create(e));
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
    return new w(this.end.x - this.start.x, this.end.y - this.start.y);
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
    const t = new w(this.start.x + 1, this.start.y);
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
    const e = new w(this.end.x - this.start.x, this.end.y - this.start.y), n = new w(t.end.x - t.start.x, t.end.y - t.start.y), s = e.x * n.y - e.y * n.x, r = new w(t.start.x - this.start.x, t.start.y - this.start.y), o = r.x * n.y - r.y * n.x, a = r.x * e.y - r.y * e.x;
    if (s === 0 || o * s < 0 || a * s < 0)
      return null;
    if (s > 0) {
      if (o > s || a > s)
        return null;
    } else if (o < s || a < s)
      return null;
    return new w(this.start.x + o * e.x / s, this.start.y + o * e.y / s);
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
    const e = w.clone(t), n = this.start, s = this.end;
    return ((s.x - n.x) * (e.y - n.y) - (s.y - n.y) * (e.x - n.x)) / this.length();
  }
  pointSquaredDistance(t, e) {
    const n = w.create(t, e);
    return this.closestPoint(n).squaredDistance(n);
  }
  pointDistance(t, e) {
    const n = w.create(t, e);
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
    const n = w.create(t, e);
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
class fe extends Ue {
  get center() {
    return new w(this.x, this.y);
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
    const n = w.create(t, e), s = n.x - this.x, r = n.y - this.y, o = this.a, a = this.b;
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
    const e = [], n = this.a, s = this.b, r = t.start, o = t.end, a = t.vector(), l = r.diff(new w(this.x, this.y)), c = new w(a.x / (n * n), a.y / (s * s)), h = new w(l.x / (n * n), l.y / (s * s)), u = a.dot(c), d = a.dot(h), f = l.dot(h) - 1, g = d * d - u * f;
    if (g < 0)
      return null;
    if (g > 0) {
      const p = Math.sqrt(g), m = (-d - p) / u, b = (-d + p) / u;
      if ((m < 0 || m > 1) && (b < 0 || b > 1))
        return null;
      m >= 0 && m <= 1 && e.push(r.lerp(o, m)), b >= 0 && b <= 1 && e.push(r.lerp(o, b));
    } else {
      const p = -d / u;
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
    const n = w.clone(t);
    e && n.rotate(e, this.getCenter());
    const s = n.x - this.x, r = n.y - this.y;
    let o;
    if (s === 0)
      return o = this.bbox().getNearestPointToPoint(n), e ? o.rotate(-e, this.getCenter()) : o;
    const a = r / s, l = a * a, c = this.a * this.a, h = this.b * this.b;
    let u = Math.sqrt(1 / (1 / c + l / h));
    u = s < 0 ? -u : u;
    const d = a * u;
    return o = new w(this.x + u, this.y + d), e ? o.rotate(-e, this.getCenter()) : o;
  }
  /**
   * Returns the angle between the x-axis and the tangent from a point. It is
   * valid for points lying on the ellipse boundary only.
   */
  tangentTheta(t) {
    const e = w.clone(t), n = e.x, s = e.y, r = this.a, o = this.b, a = this.bbox().center, l = a.x, c = a.y, h = 30, u = n > a.x + r / 2, d = n < a.x - r / 2;
    let f, g;
    return u || d ? (g = n > a.x ? s - h : s + h, f = r * r / (n - l) - r * r * (s - c) * (g - c) / (o * o * (n - l)) + l) : (f = s > a.y ? n + h : n - h, g = o * o / (s - c) - o * o * (n - l) * (f - l) / (r * r * (s - c)) + c), new w(f, g).theta(e);
  }
  scale(t, e) {
    return this.a *= t, this.b *= e, this;
  }
  rotate(t, e) {
    const n = R.fromEllipse(this);
    n.rotate(t, e);
    const s = fe.fromRect(n);
    return this.a = s.a, this.b = s.b, this.x = s.x, this.y = s.y, this;
  }
  translate(t, e) {
    const n = w.create(t, e);
    return this.x += n.x, this.y += n.y, this;
  }
  equals(t) {
    return t != null && t.x === this.x && t.y === this.y && t.a === this.a && t.b === this.b;
  }
  clone() {
    return new fe(this.x, this.y, this.a, this.b);
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
})(fe || (fe = {}));
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
})(fe || (fe = {}));
const H0 = new RegExp("^[\\s\\dLMCZz,.]*$");
function q0(i) {
  return typeof i != "string" ? !1 : H0.test(i);
}
function Us(i, t) {
  return (i % t + t) % t;
}
function U0(i, t, e, n, s) {
  const r = [], o = i[i.length - 1], a = t != null && t > 0, l = t || 0;
  if (n && a) {
    i = i.slice();
    const u = i[0], d = new w(o.x + (u.x - o.x) / 2, o.y + (u.y - o.y) / 2);
    i.splice(0, 0, d);
  }
  let c = i[0], h = 1;
  for (e ? r.push("M", c.x, c.y) : r.push("L", c.x, c.y); h < (n ? i.length : i.length - 1); ) {
    let u = i[Us(h, i.length)], d = c.x - u.x, f = c.y - u.y;
    if (a && (d !== 0 || f !== 0) && (s == null || s.indexOf(h - 1) < 0)) {
      let g = Math.sqrt(d * d + f * f);
      const p = d * Math.min(l, g / 2) / g, m = f * Math.min(l, g / 2) / g, b = u.x + p, v = u.y + m;
      r.push("L", b, v);
      let y = i[Us(h + 1, i.length)];
      for (; h < i.length - 2 && Math.round(y.x - u.x) === 0 && Math.round(y.y - u.y) === 0; )
        y = i[Us(h + 2, i.length)], h += 1;
      d = y.x - u.x, f = y.y - u.y, g = Math.max(1, Math.sqrt(d * d + f * f));
      const x = d * Math.min(l, g / 2) / g, E = f * Math.min(l, g / 2) / g, S = u.x + x, C = u.y + E;
      r.push("Q", u.x, u.y, S, C), u = new w(S, C);
    } else
      r.push("L", u.x, u.y);
    c = u, h += 1;
  }
  return n ? r.push("Z") : r.push("L", o.x, o.y), r.map((u) => typeof u == "string" ? u : +u.toFixed(3)).join(" ");
}
function zc(i, t = {}) {
  const e = [];
  return i && i.length && i.forEach((n) => {
    Array.isArray(n) ? e.push({ x: n[0], y: n[1] }) : e.push({ x: n.x, y: n.y });
  }), U0(e, t.round, t.initialMove == null || t.initialMove, t.close, t.exclude);
}
function es(i, t, e, n, s = 0, r = 0, o = 0, a, l) {
  if (e === 0 || n === 0)
    return [];
  a -= i, l -= t, e = Math.abs(e), n = Math.abs(n);
  const c = -a / 2, h = -l / 2, u = Math.cos(s * Math.PI / 180), d = Math.sin(s * Math.PI / 180), f = u * c + d * h, g = -1 * d * c + u * h, p = f * f, m = g * g, b = e * e, v = n * n, y = p / b + m / v;
  let x;
  if (y > 1)
    e = Math.sqrt(y) * e, n = Math.sqrt(y) * n, x = 0;
  else {
    let X = 1;
    r === o && (X = -1), x = X * Math.sqrt((b * v - b * m - v * p) / (b * m + v * p));
  }
  const E = x * e * g / n, S = -1 * x * n * f / e, C = u * E - d * S + a / 2, O = d * E + u * S + l / 2;
  let P = Math.atan2((g - S) / n, (f - E) / e) - Math.atan2(0, 1), I = P >= 0 ? P : 2 * Math.PI + P;
  P = Math.atan2((-g - S) / n, (-f - E) / e) - Math.atan2((g - S) / n, (f - E) / e);
  let T = P >= 0 ? P : 2 * Math.PI + P;
  o === 0 && T > 0 ? T -= 2 * Math.PI : o !== 0 && T < 0 && (T += 2 * Math.PI);
  const j = T * 2 / Math.PI, H = Math.ceil(j < 0 ? -1 * j : j), F = T / H, A = 8 / 3 * Math.sin(F / 4) * Math.sin(F / 4) / Math.sin(F / 2), N = u * e, V = u * n, st = d * e, Q = d * n;
  let ut = Math.cos(I), $ = Math.sin(I), K = -A * (N * $ + Q * ut), tt = -A * (st * $ - V * ut), W = 0, nt = 0;
  const xt = [];
  for (let X = 0; X < H; X += 1) {
    I += F, ut = Math.cos(I), $ = Math.sin(I), W = N * ut - Q * $ + C, nt = st * ut + V * $ + O;
    const Et = -A * (N * $ + Q * ut), le = -A * (st * $ - V * ut), Bt = X * 6;
    xt[Bt] = Number(K + i), xt[Bt + 1] = Number(tt + t), xt[Bt + 2] = Number(W - Et + i), xt[Bt + 3] = Number(nt - le + t), xt[Bt + 4] = Number(W + i), xt[Bt + 5] = Number(nt + t), K = W + Et, tt = nt + le;
  }
  return xt.map((X) => +X.toFixed(2));
}
function W0(i, t, e, n, s = 0, r = 0, o = 0, a, l) {
  const c = [], h = es(i, t, e, n, s, r, o, a, l);
  if (h != null)
    for (let u = 0, d = h.length; u < d; u += 6)
      c.push("C", h[u], h[u + 1], h[u + 2], h[u + 3], h[u + 4], h[u + 5]);
  return c.join(" ");
}
class Ot extends Ue {
  get start() {
    return this.points[0] || null;
  }
  get end() {
    return this.points[this.points.length - 1] || null;
  }
  constructor(t) {
    if (super(), t != null) {
      if (typeof t == "string")
        return Ot.parse(t);
      this.points = t.map((e) => w.create(e));
    } else
      this.points = [];
  }
  scale(t, e, n = new w()) {
    return this.points.forEach((s) => s.scale(t, e, n)), this;
  }
  rotate(t, e) {
    return this.points.forEach((n) => n.rotate(t, e)), this;
  }
  translate(t, e) {
    const n = w.create(t, e);
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
      const l = r[o], c = l.x, h = l.y;
      c < t && (t = c), c > e && (e = c), h < n && (n = h), h > s && (s = h);
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
      const c = new D(e[a], e[a + 1]), h = c.length(), u = c.closestPointNormalizedLength(t), f = c.pointAt(u).squaredDistance(t);
      f < o && (o = f, r = s + u * h), s += h;
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
    const e = w.clone(t), n = e.x, s = e.y, r = this.points, o = r.length;
    let a = o - 1, l = 0;
    for (let c = 0; c < o; c += 1) {
      const h = r[a], u = r[c];
      if (e.equals(h))
        return !0;
      const d = new D(h, u);
      if (d.containsPoint(t))
        return !0;
      if (s <= h.y && s > u.y || s > h.y && s <= u.y) {
        const f = h.x - n > u.x - n ? h.x - n : u.x - n;
        if (f >= 0) {
          const g = new w(n + f, s), p = new D(t, g);
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
      const c = s ? a : l - 1 - a, h = e[c], u = e[c + 1], d = new D(h, u), f = h.distance(u);
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
      const c = s ? a : l - 1 - a, h = e[c], u = e[c + 1], d = new D(h, u), f = h.distance(u);
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
      const r = s, o = s + 1, a = s + 2, l = e[r], c = e[o], h = e[a];
      new D(l, h).closestPoint(c).distance(c) <= n ? e.splice(o, 1) : s += 1;
    }
    return this;
  }
  toHull() {
    const t = this.points, e = t.length;
    if (e === 0)
      return new Ot();
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
          const p = o.pop(), m = p[0], b = o.pop(), v = b[0], y = v.cross(m, f);
          if (y < 0)
            o.push(b), o.push(p), o.push(d), g = !0;
          else if (y === 0) {
            const E = m.angleBetween(v, f);
            Math.abs(E - 180) < 1e-10 || m.equals(f) || v.equals(m) ? (r[a(p)] = m, o.push(b)) : Math.abs((E + 1) % 360 - 1) < 1e-10 && (o.push(b), s.push(p));
          } else
            r[a(p)] = m, o.push(b);
        }
    }
    o.length > 2 && o.pop();
    let l, c = -1;
    for (let d = 0, f = o.length; d < f; d += 1) {
      const g = o[d][1];
      (l === void 0 || g < l) && (l = g, c = d);
    }
    let h = [];
    if (c > 0) {
      const d = o.slice(c), f = o.slice(0, c);
      h = d.concat(f);
    } else
      h = o;
    const u = [];
    for (let d = 0, f = h.length; d < f; d += 1)
      u.push(h[d][0]);
    return new Ot(u);
  }
  equals(t) {
    return t == null || t.points.length !== this.points.length ? !1 : t.points.every((e, n) => e.equals(this.points[n]));
  }
  clone() {
    return new Ot(this.points.map((t) => t.clone()));
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
})(Ot || (Ot = {}));
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
})(Ot || (Ot = {}));
class yt extends Ue {
  constructor(t, e, n, s) {
    super(), this.PRECISION = 3, this.start = w.create(t), this.controlPoint1 = w.create(e), this.controlPoint2 = w.create(n), this.end = w.create(s);
  }
  bbox() {
    const t = this.start, e = this.controlPoint1, n = this.controlPoint2, s = this.end, r = t.x, o = t.y, a = e.x, l = e.y, c = n.x, h = n.y, u = s.x, d = s.y, f = [], g = [[], []];
    let p, m, b, v, y, x, E, S;
    for (let N = 0; N < 2; N += 1) {
      if (N === 0 ? (m = 6 * r - 12 * a + 6 * c, p = -3 * r + 9 * a - 9 * c + 3 * u, b = 3 * a - 3 * r) : (m = 6 * o - 12 * l + 6 * h, p = -3 * o + 9 * l - 9 * h + 3 * d, b = 3 * l - 3 * o), Math.abs(p) < 1e-12) {
        if (Math.abs(m) < 1e-12)
          continue;
        v = -b / m, v > 0 && v < 1 && f.push(v);
        continue;
      }
      E = m * m - 4 * b * p, S = Math.sqrt(E), !(E < 0) && (y = (-m + S) / (2 * p), y > 0 && y < 1 && f.push(y), x = (-m - S) / (2 * p), x > 0 && x < 1 && f.push(x));
    }
    let C, O, P, I = f.length;
    const T = I;
    for (; I; )
      I -= 1, v = f[I], P = 1 - v, C = P * P * P * r + 3 * P * P * v * a + 3 * P * v * v * c + v * v * v * u, g[0][I] = C, O = P * P * P * o + 3 * P * P * v * l + 3 * P * v * v * h + v * v * v * d, g[1][I] = O;
    f[T] = 0, f[T + 1] = 1, g[0][T] = r, g[1][T] = o, g[0][T + 1] = u, g[1][T + 1] = d, f.length = T + 2, g[0].length = T + 2, g[1].length = T + 2;
    const j = Math.min.apply(null, g[0]), H = Math.min.apply(null, g[1]), F = Math.max.apply(null, g[0]), A = Math.max.apply(null, g[1]);
    return new R(j, H, F - j, A - H);
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
    let o = null, a = 0, l = 0, c = 0, h = 0, u = 0, d = null;
    const f = s.length;
    let g = f > 0 ? 1 / f : 0;
    for (s.forEach((p, m) => {
      const b = p.start.distance(t), v = p.end.distance(t), y = b + v;
      (d == null || y < d) && (o = p, a = m * g, l = (m + 1) * g, c = b, h = v, d = y, u = p.endpointDistance());
    }); ; ) {
      const p = c ? Math.abs(c - h) / c : 0, m = h != null ? Math.abs(c - h) / h : 0, b = p < r || m < r, v = c ? c < u * r : !0, y = h ? h < u * r : !0;
      if (b || (v || y))
        return c <= h ? a : l;
      const E = o.divide(0.5);
      g /= 2;
      const S = E[0].start.distance(t), C = E[0].end.distance(t), O = S + C, P = E[1].start.distance(t), I = E[1].end.distance(t), T = P + I;
      O <= T ? (o = E[0], l -= g, c = S, h = C) : (o = E[1], a += g, c = P, h = I);
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
        new yt(e, e, e, e),
        new yt(e, n, s, r)
      ];
    if (t >= 1)
      return [
        new yt(e, n, s, r),
        new yt(r, r, r, r)
      ];
    const o = this.getSkeletonPoints(t), a = o.startControlPoint1, l = o.startControlPoint2, c = o.divider, h = o.dividerControlPoint1, u = o.dividerControlPoint2;
    return [
      new yt(e, a, l, c),
      new yt(c, h, u, r)
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
    const o = new D(e, n).pointAt(t), a = new D(n, s).pointAt(t), l = new D(s, r).pointAt(t), c = new D(o, a).pointAt(t), h = new D(a, l).pointAt(t), u = new D(c, h).pointAt(t);
    return {
      startControlPoint1: o,
      startControlPoint2: c,
      divider: u,
      dividerControlPoint1: h,
      dividerControlPoint2: l
    };
  }
  getSubdivisions(t = {}) {
    const e = this.getPrecision(t);
    let n = [
      new yt(this.start, this.controlPoint1, this.controlPoint2, this.end)
    ];
    if (e === 0)
      return n;
    let s = this.endpointDistance();
    const r = Math.pow(10, -e);
    let o = 0;
    for (; ; ) {
      o += 1;
      const a = [];
      n.forEach((h) => {
        const u = h.divide(0.5);
        a.push(u[0], u[1]);
      });
      const l = a.reduce((h, u) => h + u.endpointDistance(), 0), c = l !== 0 ? (l - s) / l : 0;
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
    let a = null, l, c, h = 0, u = 0, d = 0;
    const f = r.length;
    let g = f > 0 ? 1 / f : 0;
    for (let b = 0; b < f; b += 1) {
      const v = n ? b : f - 1 - b, y = r[b], x = y.endpointDistance();
      if (t <= d + x) {
        a = y, l = v * g, c = (v + 1) * g, h = n ? t - d : x + d - t, u = n ? x + d - t : t - d;
        break;
      }
      d += x;
    }
    if (a == null)
      return n ? 1 : 0;
    const p = this.length(o), m = Math.pow(10, -s);
    for (; ; ) {
      let b;
      if (b = p !== 0 ? h / p : 0, b < m)
        return l;
      if (b = p !== 0 ? u / p : 0, b < m)
        return c;
      let v, y;
      const x = a.divide(0.5);
      g /= 2;
      const E = x[0].endpointDistance(), S = x[1].endpointDistance();
      h <= E ? (a = x[0], c -= g, v = h, y = E - v) : (a = x[1], l += g, v = h - E, y = S - v), h = v, u = y;
    }
  }
  toPoints(t = {}) {
    const e = this.getDivisions(t), n = [e[0].start.clone()];
    return e.forEach((s) => n.push(s.end.clone())), n;
  }
  toPolyline(t = {}) {
    return new Ot(this.toPoints(t));
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
    return new yt(this.start, this.controlPoint1, this.controlPoint2, this.end);
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
})(yt || (yt = {}));
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
    const r = s.map((d) => w.clone(d)), o = [], a = [], l = r.length - 1;
    if (l === 1)
      return o[0] = new w((2 * r[0].x + r[1].x) / 3, (2 * r[0].y + r[1].y) / 3), a[0] = new w(2 * o[0].x - r[0].x, 2 * o[0].y - r[0].y), [o, a];
    const c = [];
    for (let d = 1; d < l - 1; d += 1)
      c[d] = 4 * r[d].x + 2 * r[d + 1].x;
    c[0] = r[0].x + 2 * r[1].x, c[l - 1] = (8 * r[l - 1].x + r[l].x) / 2;
    const h = t(c);
    for (let d = 1; d < l - 1; d += 1)
      c[d] = 4 * r[d].y + 2 * r[d + 1].y;
    c[0] = r[0].y + 2 * r[1].y, c[l - 1] = (8 * r[l - 1].y + r[l].y) / 2;
    const u = t(c);
    for (let d = 0; d < l; d += 1)
      o.push(new w(h[d], u[d])), d < l - 1 ? a.push(new w(2 * r[d + 1].x - h[d + 1], 2 * r[d + 1].y - u[d + 1])) : a.push(new w((r[l].x + h[l - 1]) / 2, (r[l].y + u[l - 1]) / 2));
    return [o, a];
  }
  function n(s) {
    if (s == null || Array.isArray(s) && s.length < 2)
      throw new Error("At least 2 points are required");
    const r = e(s), o = [];
    for (let a = 0, l = r[0].length; a < l; a += 1) {
      const c = new w(r[0][a].x, r[0][a].y), h = new w(r[1][a].x, r[1][a].y);
      o.push(new i(s[a], c, h, s[a + 1]));
    }
    return o;
  }
  i.throughPoints = n;
})(yt || (yt = {}));
class Ms extends Ue {
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
class Gt extends Ms {
  constructor(t, e) {
    super(), D.isLine(t) ? this.endPoint = t.end.clone().round(2) : this.endPoint = w.create(t, e).round(2);
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
    return [new Gt(e[0]), new Gt(e[1])];
  }
  divideAtLength(t) {
    const e = this.line.divideAtLength(t);
    return [new Gt(e[0]), new Gt(e[1])];
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
    return new Gt(this.end);
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
    if (w.isPointLike(s))
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
})(Gt || (Gt = {}));
class Cn extends Ms {
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
      e[1].isDifferentiable() ? new Gt(e[0]) : this.clone(),
      new Gt(e[1])
    ];
  }
  divideAtLength(t) {
    const e = this.line.divideAtLength(t);
    return [
      e[1].isDifferentiable() ? new Gt(e[0]) : this.clone(),
      new Gt(e[1])
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
    return new Cn();
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
})(Cn || (Cn = {}));
class Sn extends Ms {
  constructor(t, e) {
    super(), this.isVisible = !1, this.isSubpathStart = !0, D.isLine(t) || yt.isCurve(t) ? this.endPoint = t.end.clone().round(2) : this.endPoint = w.create(t, e).round(2);
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
    return new Sn(this.end);
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
    if (yt.isCurve(s))
      return new i(s);
    if (w.isPointLike(s)) {
      if (n === 1)
        return new i(s);
      const o = [];
      for (let a = 0; a < n; a += 1)
        a === 0 ? o.push(new i(e[a])) : o.push(new Gt(e[a]));
      return o;
    }
    if (n === 2)
      return new i(+e[0], +e[1]);
    const r = [];
    for (let o = 0; o < n; o += 2) {
      const a = +e[o], l = +e[o + 1];
      o === 0 ? r.push(new i(a, l)) : r.push(new Gt(a, l));
    }
    return r;
  }
  i.create = t;
})(Sn || (Sn = {}));
class ee extends Ms {
  constructor(t, e, n, s, r, o) {
    super(), yt.isCurve(t) ? (this.controlPoint1 = t.controlPoint1.clone().round(2), this.controlPoint2 = t.controlPoint2.clone().round(2), this.endPoint = t.end.clone().round(2)) : typeof t == "number" ? (this.controlPoint1 = new w(t, e).round(2), this.controlPoint2 = new w(n, s).round(2), this.endPoint = new w(r, o).round(2)) : (this.controlPoint1 = w.create(t).round(2), this.controlPoint2 = w.create(e).round(2), this.endPoint = w.create(n).round(2));
  }
  get type() {
    return "C";
  }
  get curve() {
    return new yt(this.start, this.controlPoint1, this.controlPoint2, this.end);
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
    return [new ee(n[0]), new ee(n[1])];
  }
  divideAtLength(t, e = {}) {
    const n = this.curve.divideAtLength(t, e);
    return [new ee(n[0]), new ee(n[1])];
  }
  divideAtT(t) {
    const e = this.curve.divideAtT(t);
    return [new ee(e[0]), new ee(e[1])];
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
    return new ee(this.controlPoint1, this.controlPoint2, this.end);
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
    if (yt.isCurve(s))
      return new i(s);
    if (w.isPointLike(s)) {
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
})(ee || (ee = {}));
function _i(i, t, e) {
  return {
    x: i * Math.cos(e) - t * Math.sin(e),
    y: i * Math.sin(e) + t * Math.cos(e)
  };
}
function ma(i, t, e, n, s, r) {
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
function Vc(i, t, e, n, s, r, o, a, l, c) {
  const h = Math.PI * 120 / 180, u = Math.PI / 180 * (+s || 0);
  let d = [], f, g, p, m, b;
  if (c)
    g = c[0], p = c[1], m = c[2], b = c[3];
  else {
    f = _i(i, t, -u), i = f.x, t = f.y, f = _i(a, l, -u), a = f.x, l = f.y;
    const F = (i - a) / 2, A = (t - l) / 2;
    let N = F * F / (e * e) + A * A / (n * n);
    N > 1 && (N = Math.sqrt(N), e = N * e, n = N * n);
    const V = e * e, st = n * n, Q = (r === o ? -1 : 1) * Math.sqrt(Math.abs((V * st - V * A * A - st * F * F) / (V * A * A + st * F * F)));
    m = Q * e * A / n + (i + a) / 2, b = Q * -n * F / e + (t + l) / 2, g = Math.asin((t - b) / n), p = Math.asin((l - b) / n), g = i < m ? Math.PI - g : g, p = a < m ? Math.PI - p : p, g < 0 && (g = Math.PI * 2 + g), p < 0 && (p = Math.PI * 2 + p), o && g > p && (g -= Math.PI * 2), !o && p > g && (p -= Math.PI * 2);
  }
  let v = p - g;
  if (Math.abs(v) > h) {
    const F = p, A = a, N = l;
    p = g + h * (o && p > g ? 1 : -1), a = m + e * Math.cos(p), l = b + n * Math.sin(p), d = Vc(a, l, e, n, s, 0, o, A, N, [
      p,
      F,
      m,
      b
    ]);
  }
  v = p - g;
  const y = Math.cos(g), x = Math.sin(g), E = Math.cos(p), S = Math.sin(p), C = Math.tan(v / 4), O = 4 / 3 * (e * C), P = 4 / 3 * (n * C), I = [i, t], T = [i + O * x, t - P * y], j = [a + O * S, l - P * E], H = [a, l];
  if (T[0] = 2 * I[0] - T[0], T[1] = 2 * I[1] - T[1], c)
    return [T, j, H].concat(d);
  {
    d = [T, j, H].concat(d).join().split(",");
    const F = [], A = d.length;
    for (let N = 0; N < A; N += 1)
      F[N] = N % 2 ? _i(+d[N - 1], +d[N], u).y : _i(+d[N], +d[N + 1], u).x;
    return F;
  }
}
function X0(i) {
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
    let h = a.toLowerCase();
    l.replace(n, (d, f) => (f && c.push(+f), d)), h === "m" && c.length > 2 && (r.push([a, ...c.splice(0, 2)]), h = "l", a = a === "m" ? "l" : "L");
    const u = s[h];
    for (; c.length >= u && (r.push([a, ...c.splice(0, u)]), !!u); )
      ;
    return o;
  }), r;
}
function Y0(i) {
  const t = X0(i);
  if (!t || !t.length)
    return [["M", 0, 0]];
  let e = 0, n = 0, s = 0, r = 0;
  const o = [];
  for (let a = 0, l = t.length; a < l; a += 1) {
    const c = [];
    o.push(c);
    const h = t[a], u = h[0];
    if (u !== u.toUpperCase())
      switch (c[0] = u.toUpperCase(), c[0]) {
        case "A":
          c[1] = h[1], c[2] = h[2], c[3] = h[3], c[4] = h[4], c[5] = h[5], c[6] = +h[6] + e, c[7] = +h[7] + n;
          break;
        case "V":
          c[1] = +h[1] + n;
          break;
        case "H":
          c[1] = +h[1] + e;
          break;
        case "M":
          s = +h[1] + e, r = +h[2] + n;
          for (let d = 1, f = h.length; d < f; d += 1)
            c[d] = +h[d] + (d % 2 ? e : n);
          break;
        default:
          for (let d = 1, f = h.length; d < f; d += 1)
            c[d] = +h[d] + (d % 2 ? e : n);
          break;
      }
    else
      for (let d = 0, f = h.length; d < f; d += 1)
        c[d] = h[d];
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
function J0(i) {
  const t = Y0(i), e = { x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null };
  function n(l, c, h) {
    let u, d;
    if (!l)
      return ["C", c.x, c.y, c.x, c.y, c.x, c.y];
    switch (l[0] in { T: 1, Q: 1 } || (c.qx = null, c.qy = null), l[0]) {
      case "M":
        c.X = l[1], c.Y = l[2];
        break;
      case "A":
        return parseFloat(l[1]) === 0 || parseFloat(l[2]) === 0 ? ["L", l[6], l[7]] : ["C"].concat(Vc.apply(0, [c.x, c.y].concat(l.slice(1))));
      case "S":
        return h === "C" || h === "S" ? (u = c.x * 2 - c.bx, d = c.y * 2 - c.by) : (u = c.x, d = c.y), ["C", u, d].concat(l.slice(1));
      case "T":
        return h === "Q" || h === "T" ? (c.qx = c.x * 2 - c.qx, c.qy = c.y * 2 - c.qy) : (c.qx = c.x, c.qy = c.y), ["C"].concat(ma(c.x, c.y, c.qx, c.qy, l[1], l[2]));
      case "Q":
        return c.qx = l[1], c.qy = l[2], ["C"].concat(ma(c.x, c.y, l[1], l[2], l[3], l[4]));
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
      const h = l[c];
      for (; h.length; )
        r[c] = "A", c += 1, l.splice(c, 0, ["C"].concat(h.splice(0, 6)));
      l.splice(c, 1), a = t.length;
    }
  }
  const r = [];
  let o = "", a = t.length;
  for (let l = 0; l < a; l += 1) {
    let c = "";
    t[l] && (c = t[l][0]), c !== "C" && (r[l] = c, l > 0 && (o = r[l - 1])), t[l] = n(t[l], e, o), r[l] !== "A" && c === "C" && (r[l] = "C"), s(t, l);
    const h = t[l], u = h.length;
    e.x = h[u - 2], e.y = h[u - 1], e.bx = parseFloat(h[u - 4]) || e.x, e.by = parseFloat(h[u - 3]) || e.y;
  }
  return (!t[0][0] || t[0][0] !== "M") && t.unshift(["M", 0, 0]), t;
}
function K0(i) {
  return J0(i).map((t) => t.map((e) => typeof e == "string" ? e : lt.round(e, 2))).join(",").split(",").join(" ");
}
class B extends Ue {
  constructor(t) {
    if (super(), this.PRECISION = 3, this.segments = [], Array.isArray(t))
      if (D.isLine(t[0]) || yt.isCurve(t[0])) {
        let e = null;
        t.forEach((s, r) => {
          r === 0 && this.appendSegment(B.createSegment("M", s.start)), e != null && !e.end.equals(s.start) && this.appendSegment(B.createSegment("M", s.start)), D.isLine(s) ? this.appendSegment(B.createSegment("L", s.end)) : yt.isCurve(s) && this.appendSegment(B.createSegment("C", s.controlPoint1, s.controlPoint2, s.end)), e = s;
        });
      } else
        t.forEach((n) => {
          n.isSegment && this.appendSegment(n);
        });
    else t != null && (D.isLine(t) ? (this.appendSegment(B.createSegment("M", t.start)), this.appendSegment(B.createSegment("L", t.end))) : yt.isCurve(t) ? (this.appendSegment(B.createSegment("M", t.start)), this.appendSegment(B.createSegment("C", t.controlPoint1, t.controlPoint2, t.end))) : Ot.isPolyline(t) ? t.points && t.points.length && t.points.forEach((e, n) => {
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
    return this.appendSegment(Sn.create.call(null, ...t));
  }
  lineTo(...t) {
    return this.appendSegment(Gt.create.call(null, ...t));
  }
  curveTo(...t) {
    return this.appendSegment(ee.create.call(null, ...t));
  }
  arcTo(t, e, n, s, r, o, a) {
    const l = this.end || new w(), c = typeof o == "number" ? es(l.x, l.y, t, e, n, s, r, o, a) : es(l.x, l.y, t, e, n, s, r, o.x, o.y);
    if (c != null)
      for (let h = 0, u = c.length; h < u; h += 6)
        this.curveTo(c[h], c[h + 1], c[h + 2], c[h + 3], c[h + 4], c[h + 5]);
    return this;
  }
  quadTo(t, e, n, s) {
    const r = this.end || new w(), o = ["M", r.x, r.y];
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
    return this.appendSegment(Cn.create());
  }
  drawPoints(t, e = {}) {
    const n = zc(t, e), s = B.parse(n);
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
      for (let c = 0, h = e.length; c < h; c += 1) {
        const u = e[c];
        s = this.prepareSegment(u, o, a), this.segments.splice(t + c, 0, s), o = s, l && s.isSubpathStart && (l = !1);
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
    const n = lt.clamp(t, 0, 1), s = this.getOptions(e), o = this.length(s) * n;
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
      const h = s ? c : n - 1 - c, u = this.segments[h], d = o[h], f = u.length({ precision: r, subdivisions: d });
      if (u.isVisible) {
        if (t <= a + f)
          return h;
        l = h;
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
      const c = this.segments[a], h = s[a];
      if (c.isVisible) {
        const u = c.closestPointT(t, {
          precision: n,
          subdivisions: h
        }), d = c.pointAtT(u), f = lt.squaredLength(d, t);
        f < o && (r = { segmentIndex: a, value: u }, o = f);
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
      const c = this.segments[a], h = s[a];
      if (c.isDifferentiable()) {
        const u = c.closestPointT(t, {
          precision: n,
          subdivisions: h
        }), d = c.pointAtT(u), f = lt.squaredLength(d, t);
        f < o && (r = c.tangentAtT(u), o = f);
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
    for (let c = 0, h = this.segments.length; c < h; c += 1) {
      const u = n ? c : h - 1 - c, d = this.segments[u], f = r[u], g = d.length({
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
    const r = lt.clamp(t.value, 0, 1);
    return e[s].pointAtT(r);
  }
  divideAt(t, e = {}) {
    if (this.segments.length === 0)
      return null;
    const n = lt.clamp(t, 0, 1), s = this.getOptions(e), o = this.length(s) * n;
    return this.divideAtLength(o, s);
  }
  divideAtLength(t, e = {}) {
    if (this.segments.length === 0)
      return null;
    let n = !0;
    t < 0 && (n = !1, t = -t);
    const s = this.getPrecision(e), r = this.getSubdivisions(e);
    let o = 0, a, l, c, h, u;
    for (let E = 0, S = this.segments.length; E < S; E += 1) {
      const C = n ? E : S - 1 - E, O = this.getSegment(C), P = r[C], I = { precision: s, subdivisions: P }, T = O.length(I);
      if (O.isDifferentiable() && (c = O, h = C, t <= o + T)) {
        l = C, a = O.divideAtLength((n ? 1 : -1) * (t - o), I);
        break;
      }
      o += T;
    }
    if (!c)
      return null;
    a || (l = h, u = n ? 1 : 0, a = c.divideAtT(u));
    const d = this.clone(), f = l;
    d.replaceSegment(f, a);
    const g = f;
    let p = f + 1, m = f + 2;
    a[0].isDifferentiable() || (d.removeSegment(g), p -= 1, m -= 1);
    const b = d.getSegment(p).start;
    d.insertSegment(p, B.createSegment("M", b)), m += 1, a[1].isDifferentiable() || (d.removeSegment(m - 1), m -= 1);
    const v = m - g - 1;
    for (let E = m, S = d.segments.length; E < S; E += 1) {
      const C = this.getSegment(E - v), O = d.getSegment(E);
      if (O.type === "Z" && !C.subpathStartSegment.end.equals(O.subpathStartSegment.end)) {
        const P = B.createSegment("L", C.end);
        d.replaceSegment(E, P);
      }
    }
    const y = new B(d.segments.slice(0, p)), x = new B(d.segments.slice(p));
    return [y, x];
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
    let r = lt.clamp(t.value, 0, 1);
    s >= n && (s = n - 1, r = 1);
    const o = this.getPrecision(e), a = this.getSubdivisions(e);
    let l = 0;
    for (let u = 0; u < s; u += 1) {
      const d = this.segments[u], f = a[u];
      l += d.length({ precision: o, subdivisions: f });
    }
    const c = this.segments[s], h = a[s];
    return l += c.lengthAtT(r, { precision: o, subdivisions: h }), l;
  }
  tangentAt(t, e = {}) {
    if (this.segments.length === 0)
      return null;
    const n = lt.clamp(t, 0, 1), s = this.getOptions(e), o = this.length(s) * n;
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
      const h = n ? l : c - 1 - l, u = this.segments[h], d = r[h], f = u.length({ precision: s, subdivisions: d });
      if (u.isDifferentiable()) {
        if (t <= a + f)
          return u.tangentAtLength((n ? 1 : -1) * (t - a), {
            precision: s,
            subdivisions: d
          });
        o = u;
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
    const s = lt.clamp(t.value, 0, 1);
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
        c.length > 0 ? c.forEach((h) => o.push(h.start)) : o.push(l.start);
      } else o.length > 0 && (o.push(e[a - 1].end), r.push(o), o = []);
    }
    return o.length > 0 && (o.push(this.end), r.push(o)), r;
  }
  toPolylines(t = {}) {
    const e = this.toPoints(t);
    return e ? e.map((n) => new Ot(n)) : null;
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
        const c = o[a], h = /(?:[a-zA-Z])|(?:(?:-?\d+(?:\.\d+)?(?:e[-+]?\d+)?))|(?:(?:-?\.\d+))/g, u = c.match(h);
        if (u != null) {
          const d = u[0], f = u.slice(1).map((p) => +p), g = e.call(null, d, ...f);
          s.appendSegment(g);
        }
      }
    return s;
  }
  i.parse = t;
  function e(n, ...s) {
    if (n === "M")
      return Sn.create.call(null, ...s);
    if (n === "L")
      return Gt.create.call(null, ...s);
    if (n === "C")
      return ee.create.call(null, ...s);
    if (n === "z" || n === "Z")
      return Cn.create();
    throw new Error(`Invalid path segment type "${n}"`);
  }
  i.createSegment = e;
})(B || (B = {}));
(function(i) {
  i.normalize = K0, i.isValid = q0, i.drawArc = W0, i.drawPoints = zc, i.arcToCurves = es;
})(B || (B = {}));
class Mt {
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
    this.exist(t) && !n && !_e.isApplyingHMR() && this.onDuplicated(t);
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
      throw this.options.onConflict && z(this.options.onConflict, this, t), new Error(`${Wi(this.options.type)} with name '${t}' already registered.`);
    } catch (e) {
      throw e;
    }
  }
  onNotFound(t, e) {
    throw new Error(this.getSpellingSuggestion(t, e));
  }
  getSpellingSuggestion(t, e) {
    const n = this.getSpellingSuggestionForName(t), s = e ? `${e} ${by(this.options.type)}` : this.options.type;
    return (
      // eslint-disable-next-line
      `${Wi(s)} with name '${t}' does not exist.${n ? ` Did you mean '${n}'?` : ""}`
    );
  }
  getSpellingSuggestionForName(t) {
    return Ky(t, Object.keys(this.data), (e) => e);
  }
}
(function(i) {
  function t(e) {
    return new i(e);
  }
  i.create = t;
})(Mt || (Mt = {}));
const Z0 = {
  color: "#aaaaaa",
  thickness: 1,
  markup: "rect",
  update(i, t) {
    const e = t.thickness * t.sx, n = t.thickness * t.sy;
    et(i, {
      width: e,
      height: n,
      rx: e,
      ry: n,
      fill: t.color
    });
  }
}, Q0 = {
  color: "#aaaaaa",
  thickness: 1,
  markup: "rect",
  update(i, t) {
    const e = t.sx <= 1 ? t.thickness * t.sx : t.thickness;
    et(i, {
      width: e,
      height: e,
      rx: e,
      ry: e,
      fill: t.color
    });
  }
}, tv = {
  color: "rgba(224,224,224,1)",
  thickness: 1,
  markup: "path",
  update(i, t) {
    let e;
    const n = t.width, s = t.height, r = t.thickness;
    n - r >= 0 && s - r >= 0 ? e = ["M", n, 0, "H0 M0 0 V0", s].join(" ") : e = "M 0 0 0 0", et(i, {
      d: e,
      stroke: t.color,
      "stroke-width": t.thickness
    });
  }
}, ev = [
  {
    color: "rgba(224,224,224,1)",
    thickness: 1,
    markup: "path",
    update(i, t) {
      let e;
      const n = t.width, s = t.height, r = t.thickness;
      n - r >= 0 && s - r >= 0 ? e = ["M", n, 0, "H0 M0 0 V0", s].join(" ") : e = "M 0 0 0 0", et(i, {
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
      s - o >= 0 && r - o >= 0 ? e = ["M", s, 0, "H0 M0 0 V0", r].join(" ") : e = "M 0 0 0 0", t.width = s, t.height = r, et(i, {
        d: e,
        stroke: t.color,
        "stroke-width": t.thickness
      });
    }
  }
], nv = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  dot: Z0,
  doubleMesh: ev,
  fixedDot: Q0,
  mesh: tv
}, Symbol.toStringTag, { value: "Module" }));
class De {
  constructor() {
    this.patterns = {}, this.root = G.create(Ki(), {
      width: "100%",
      height: "100%"
    }, [me("defs")]).node;
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
  i.presets = nv, i.registry = Mt.create({
    type: "grid"
  }), i.registry.register(i.presets, !0);
})(De || (De = {}));
const Fc = function(i) {
  const t = document.createElement("canvas"), e = i.width, n = i.height;
  t.width = e * 2, t.height = n;
  const s = t.getContext("2d");
  return s.drawImage(i, 0, 0, e, n), s.translate(2 * e, 0), s.scale(-1, 1), s.drawImage(i, 0, 0, e, n), t;
}, Gc = function(i) {
  const t = document.createElement("canvas"), e = i.width, n = i.height;
  t.width = e, t.height = n * 2;
  const s = t.getContext("2d");
  return s.drawImage(i, 0, 0, e, n), s.translate(0, 2 * n), s.scale(1, -1), s.drawImage(i, 0, 0, e, n), t;
}, Hc = function(i) {
  const t = document.createElement("canvas"), e = i.width, n = i.height;
  t.width = 2 * e, t.height = 2 * n;
  const s = t.getContext("2d");
  return s.drawImage(i, 0, 0, e, n), s.setTransform(-1, 0, 0, -1, t.width, t.height), s.drawImage(i, 0, 0, e, n), s.setTransform(-1, 0, 0, 1, t.width, 0), s.drawImage(i, 0, 0, e, n), s.setTransform(1, 0, 0, -1, 0, t.height), s.drawImage(i, 0, 0, e, n), t;
}, iv = function(i, t) {
  const e = i.width, n = i.height, s = document.createElement("canvas");
  s.width = e * 3, s.height = n * 3;
  const r = s.getContext("2d"), o = t.angle != null ? -t.angle : -20, a = ct.toRad(o), l = s.width / 4, c = s.height / 4;
  for (let h = 0; h < 4; h += 1)
    for (let u = 0; u < 4; u += 1)
      (h + u) % 2 > 0 && (r.setTransform(1, 0, 0, 1, (2 * h - 1) * l, (2 * u - 1) * c), r.rotate(a), r.drawImage(i, -e / 2, -n / 2, e, n));
  return s;
}, sv = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  flipX: Fc,
  flipXY: Hc,
  flipY: Gc,
  watermark: iv
}, Symbol.toStringTag, { value: "Module" }));
var bi;
(function(i) {
  i.presets = Object.assign({}, sv), i.presets["flip-x"] = Fc, i.presets["flip-y"] = Gc, i.presets["flip-xy"] = Hc, i.registry = Mt.create({
    type: "background pattern"
  }), i.registry.register(i.presets, !0);
})(bi || (bi = {}));
function to(i, t) {
  return i ?? t;
}
function Dt(i, t) {
  return i != null && Number.isFinite(i) ? i : t;
}
function rv(i = {}) {
  const t = to(i.color, "blue"), e = Dt(i.width, 1), n = Dt(i.margin, 2), s = Dt(i.opacity, 1), r = n, o = n + e;
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
function ov(i = {}) {
  const t = to(i.color, "red"), e = Dt(i.blur, 0), n = Dt(i.width, 1), s = Dt(i.opacity, 1);
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
function av(i = {}) {
  const t = Dt(i.x, 2);
  return `
    <filter>
      <feGaussianBlur stdDeviation="${i.y != null && Number.isFinite(i.y) ? [t, i.y] : t}"/>
    </filter>
  `.trim();
}
function lv(i = {}) {
  const t = Dt(i.dx, 0), e = Dt(i.dy, 0), n = to(i.color, "black"), s = Dt(i.blur, 4), r = Dt(i.opacity, 1);
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
function cv(i = {}) {
  const t = Dt(i.amount, 1), e = 0.2126 + 0.7874 * (1 - t), n = 0.7152 - 0.7152 * (1 - t), s = 0.0722 - 0.0722 * (1 - t), r = 0.2126 - 0.2126 * (1 - t), o = 0.7152 + 0.2848 * (1 - t), a = 0.0722 - 0.0722 * (1 - t), l = 0.2126 - 0.2126 * (1 - t), c = 0.0722 + 0.9278 * (1 - t);
  return `
    <filter>
      <feColorMatrix type="matrix" values="${e} ${n} ${s} 0 0 ${r} ${o} ${a} 0 0 ${l} ${n} ${c} 0 0 0 0 0 1 0"/>
    </filter>
  `.trim();
}
function hv(i = {}) {
  const t = Dt(i.amount, 1), e = 0.393 + 0.607 * (1 - t), n = 0.769 - 0.769 * (1 - t), s = 0.189 - 0.189 * (1 - t), r = 0.349 - 0.349 * (1 - t), o = 0.686 + 0.314 * (1 - t), a = 0.168 - 0.168 * (1 - t), l = 0.272 - 0.272 * (1 - t), c = 0.534 - 0.534 * (1 - t), h = 0.131 + 0.869 * (1 - t);
  return `
      <filter>
        <feColorMatrix type="matrix" values="${e} ${n} ${s} 0 0 ${r} ${o} ${a} 0 0 ${l} ${c} ${h} 0 0 0 0 0 1 0"/>
      </filter>
    `.trim();
}
function uv(i = {}) {
  return `
      <filter>
        <feColorMatrix type="saturate" values="${1 - Dt(i.amount, 1)}"/>
      </filter>
    `.trim();
}
function dv(i = {}) {
  return `
      <filter>
        <feColorMatrix type="hueRotate" values="${Dt(i.angle, 0)}"/>
      </filter>
    `.trim();
}
function fv(i = {}) {
  const t = Dt(i.amount, 1), e = 1 - t;
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
function gv(i = {}) {
  const t = Dt(i.amount, 1);
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
function pv(i = {}) {
  const t = Dt(i.amount, 1), e = 0.5 - t / 2;
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
const mv = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  blur: av,
  brightness: gv,
  contrast: pv,
  dropShadow: lv,
  grayScale: cv,
  highlight: ov,
  hueRotate: dv,
  invert: fv,
  outline: rv,
  saturate: uv,
  sepia: hv
}, Symbol.toStringTag, { value: "Module" }));
var On;
(function(i) {
  i.presets = mv, i.registry = Mt.create({
    type: "filter"
  }), i.registry.register(i.presets, !0);
})(On || (On = {}));
const bv = {
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
}, yv = {
  // We do not set `ref` attribute directly on an element.
  // The attribute itself does not qualify for relative positioning.
}, qc = {
  position: Ts("x", "width", "origin")
}, Uc = {
  position: Ts("y", "height", "origin")
}, vv = {
  position: Ts("x", "width", "corner")
}, wv = {
  position: Ts("y", "height", "corner")
}, Wc = {
  set: Ve("width", "width")
}, Xc = {
  set: Ve("height", "height")
}, xv = {
  set: Ve("rx", "width")
}, Ev = {
  set: Ve("ry", "height")
}, Yc = {
  set: ((i) => {
    const t = Ve(i, "width"), e = Ve(i, "height");
    return function(n, s) {
      const r = s.refBBox, o = r.height > r.width ? t : e;
      return z(o, this, n, s);
    };
  })("r")
}, Cv = {
  set(i, { refBBox: t }) {
    let e = parseFloat(i);
    const n = Te(i);
    n && (e /= 100);
    const s = Math.sqrt(t.height * t.height + t.width * t.width);
    let r;
    return Number.isFinite(e) && (n || e >= 0 && e <= 1 ? r = e * s : r = Math.max(e + s, 0)), { r };
  }
}, Sv = {
  set: Ve("cx", "width")
}, Ov = {
  set: Ve("cy", "height")
}, Jc = {
  set: Qc({ resetOffset: !0 })
}, Pv = {
  set: Qc({ resetOffset: !1 })
}, Kc = {
  set: th({ resetOffset: !0 })
}, Av = {
  set: th({ resetOffset: !1 })
}, Mv = Yc, Tv = Jc, Nv = Kc, Lv = qc, Iv = Uc, jv = Wc, kv = Xc;
function Ts(i, t, e) {
  return (n, { refBBox: s }) => {
    if (n == null)
      return null;
    let r = parseFloat(n);
    const o = Te(n);
    o && (r /= 100);
    let a;
    if (Number.isFinite(r)) {
      const c = s[e];
      o || r > 0 && r < 1 ? a = c[i] + s[t] * r : a = c[i] + r;
    }
    const l = new w();
    return l[i] = a || 0, l;
  };
}
function Ve(i, t) {
  return function(e, { refBBox: n }) {
    let s = parseFloat(e);
    const r = Te(e);
    r && (s /= 100);
    const o = {};
    if (Number.isFinite(s)) {
      const a = r || s >= 0 && s <= 1 ? s * n[t] : Math.max(s + n[t], 0);
      o[i] = a;
    }
    return o;
  };
}
function Zc(i, t) {
  const e = "x6-shape", n = t && t.resetOffset;
  return function(s, { elem: r, refBBox: o }) {
    let a = sn(r, e);
    if (!a || a.value !== s) {
      const p = i(s);
      a = {
        value: s,
        shape: p,
        shapeBBox: p.bbox()
      }, sn(r, e, a);
    }
    const l = a.shape.clone(), c = a.shapeBBox.clone(), h = c.getOrigin(), u = o.getOrigin();
    c.x = u.x, c.y = u.y;
    const d = o.getMaxScaleToFit(c, u), f = c.width === 0 || o.width === 0 ? 1 : d.sx, g = c.height === 0 || o.height === 0 ? 1 : d.sy;
    return l.scale(f, g, h), n && l.translate(-h.x, -h.y), l;
  };
}
function Qc(i) {
  function t(n) {
    return B.parse(n);
  }
  const e = Zc(t, i);
  return (n, s) => ({
    d: e(n, s).serialize()
  });
}
function th(i) {
  const t = Zc((e) => new Ot(e), i);
  return (e, n) => ({
    points: t(e, n).serialize()
  });
}
const Rv = {
  qualify: Se,
  set(i, { view: t }) {
    return `url(#${t.graph.defineGradient(i)})`;
  }
}, Dv = {
  qualify: Se,
  set(i, { view: t }) {
    const e = t.cell, n = Object.assign({}, i);
    if (e.isEdge() && n.type === "linearGradient") {
      const s = t, r = s.sourcePoint, o = s.targetPoint;
      n.id = `gradient-${n.type}-${e.id}`, n.attrs = Object.assign(Object.assign({}, n.attrs), { x1: r.x, y1: r.y, x2: o.x, y2: o.y, gradientUnits: "userSpaceOnUse" }), t.graph.defs.remove(n.id);
    }
    return `url(#${t.graph.defineGradient(n)})`;
  }
}, eh = {
  qualify(i, { attrs: t }) {
    return t.textWrap == null || !Se(t.textWrap);
  },
  set(i, { view: t, elem: e, attrs: n }) {
    const s = "x6-text", r = sn(e, s), o = (h) => {
      try {
        return JSON.parse(h);
      } catch {
        return h;
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
      const h = a.textPath;
      if (h != null && typeof h == "object") {
        const u = h.selector;
        if (typeof u == "string") {
          const d = t.find(u)[0];
          d instanceof SVGPathElement && (Wr(d), a.textPath = Object.assign({ "xlink:href": `#${d.id}` }, h));
        }
      }
      Lc(e, `${i}`, a), sn(e, s, c);
    }
  }
}, $v = {
  qualify: Se,
  set(i, { view: t, elem: e, attrs: n, refBBox: s }) {
    const r = i, o = r.width || 0;
    Te(o) ? s.width *= parseFloat(o) / 100 : o <= 0 ? s.width += o : s.width = o;
    const a = r.height || 0;
    Te(a) ? s.height *= parseFloat(a) / 100 : a <= 0 ? s.height += a : s.height = a;
    let l, c = r.text;
    c == null && (c = n.text || (e == null ? void 0 : e.textContent)), c != null ? l = Ic(`${c}`, s, {
      "font-weight": n["font-weight"] || n.fontWeight,
      "font-size": n["font-size"] || n.fontSize,
      "font-family": n["font-family"] || n.fontFamily,
      lineHeight: n.lineHeight
    }, {
      // svgDocument: view.graph.view.svg,
      ellipsis: r.ellipsis
      // hyphen: info.hyphen as string,
      // breakWord: info.breakWord as boolean,
    }) : l = "", z(eh.set, this, l, {
      view: t,
      elem: e,
      attrs: n,
      refBBox: s,
      cell: t.cell
    });
  }
}, Un = (i, { attrs: t }) => t.text !== void 0, _v = {
  qualify: Un
}, Bv = {
  qualify: Un
}, zv = {
  qualify: Un
}, Vv = {
  qualify: Un
}, Fv = {
  qualify: Un
}, Gv = {
  qualify: Un
}, Hv = {
  qualify(i, { elem: t }) {
    return t instanceof SVGElement;
  },
  set(i, { elem: t }) {
    const e = "x6-title", n = `${i}`, s = sn(t, e);
    if (s == null || s !== n) {
      sn(t, e, n);
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
}, qv = {
  offset: nh("x", "width", "right")
}, Uv = {
  offset: nh("y", "height", "bottom")
}, Wv = {
  offset(i, { refBBox: t }) {
    return i ? { x: -t.x, y: -t.y } : { x: 0, y: 0 };
  }
};
function nh(i, t, e) {
  return (n, { refBBox: s }) => {
    const r = new w();
    let o;
    return n === "middle" ? o = s[t] / 2 : n === e ? o = s[t] : typeof n == "number" && Number.isFinite(n) ? o = n > -1 && n < 1 ? -s[t] * n : -n : Te(n) ? o = s[t] * parseFloat(n) / 100 : o = 0, r[i] = -(s[i] + o), r;
  };
}
const Xv = {
  qualify: Se,
  set(i, { elem: t }) {
    kt(t, i);
  }
}, Yv = {
  set(i, { elem: t }) {
    t.innerHTML = `${i}`;
  }
}, Jv = {
  qualify: Se,
  set(i, { view: t }) {
    return `url(#${t.graph.defineFilter(i)})`;
  }
}, Kv = {
  set(i) {
    return i != null && typeof i == "object" && i.id ? i.id : i;
  }
};
function We(i, t, e) {
  let n, s;
  typeof t == "object" ? (n = t.x, s = t.y) : (n = t, s = e);
  const r = B.parse(i), o = r.bbox();
  if (o) {
    let a = -o.height / 2 - o.y, l = -o.width / 2 - o.x;
    typeof n == "number" && (l -= n), typeof s == "number" && (a -= s), r.translate(l, a);
  }
  return r.serialize();
}
var ih = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
};
const Zv = (i) => {
  var { size: t, width: e, height: n, offset: s, open: r } = i, o = ih(i, ["size", "width", "height", "offset", "open"]);
  return sh({ size: t, width: e, height: n, offset: s }, r === !0, !0, void 0, o);
}, Qv = (i) => {
  var { size: t, width: e, height: n, offset: s, factor: r } = i, o = ih(i, ["size", "width", "height", "offset", "factor"]);
  return sh({ size: t, width: e, height: n, offset: s }, !1, !1, r, o);
};
function sh(i, t, e, n = 3 / 4, s = {}) {
  const r = i.size || 10, o = i.width || r, a = i.height || r, l = new B(), c = {};
  if (t)
    l.moveTo(o, 0).lineTo(0, a / 2).lineTo(o, a), c.fill = "none";
  else {
    if (l.moveTo(0, a / 2), l.lineTo(o, 0), !e) {
      const h = se(n, 0, 1);
      l.lineTo(o * h, a / 2);
    }
    l.lineTo(o, a), l.close();
  }
  return Object.assign(Object.assign(Object.assign({}, c), s), { tagName: "path", d: We(l.serialize(), {
    x: i.offset != null ? i.offset : -o / 2
  }) });
}
var tw = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
};
const ew = (i) => {
  var { size: t, width: e, height: n, offset: s } = i, r = tw(i, ["size", "width", "height", "offset"]);
  const o = t || 10, a = e || o, l = n || o, c = new B();
  return c.moveTo(0, l / 2).lineTo(a / 2, 0).lineTo(a, l / 2).lineTo(a / 2, l).close(), Object.assign(Object.assign({}, r), { tagName: "path", d: We(c.serialize(), s ?? -a / 2) });
};
var nw = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
};
const iw = (i) => {
  var { d: t, offsetX: e, offsetY: n } = i, s = nw(i, ["d", "offsetX", "offsetY"]);
  return Object.assign(Object.assign({}, s), { tagName: "path", d: We(t, e, n) });
};
var sw = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
};
const rw = (i) => {
  var { size: t, width: e, height: n, offset: s } = i, r = sw(i, ["size", "width", "height", "offset"]);
  const o = t || 10, a = e || o, l = n || o, c = new B();
  return c.moveTo(0, 0).lineTo(a, l).moveTo(0, l).lineTo(a, 0), Object.assign(Object.assign({}, r), { tagName: "path", fill: "none", d: We(c.serialize(), s || -a / 2) });
};
var ow = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
};
const aw = (i) => {
  var { width: t, height: e, offset: n, open: s, flip: r } = i, o = ow(i, ["width", "height", "offset", "open", "flip"]);
  let a = e || 6;
  const l = t || 10, c = s === !0, h = r === !0, u = Object.assign(Object.assign({}, o), { tagName: "path" });
  h && (a = -a);
  const d = new B();
  return d.moveTo(0, a).lineTo(l, 0), c ? u.fill = "none" : (d.lineTo(l, a), d.close()), u.d = We(d.serialize(), {
    x: n || -l / 2,
    y: a / 2
  }), u;
};
var rh = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
};
const oh = (i) => {
  var { r: t } = i, e = rh(i, ["r"]);
  const n = t || 5;
  return Object.assign(Object.assign({ cx: n }, e), { tagName: "circle", r: n });
}, lw = (i) => {
  var { r: t } = i, e = rh(i, ["r"]);
  const n = t || 5, s = new B();
  return s.moveTo(n, 0).lineTo(n, n * 2), s.moveTo(0, n).lineTo(n * 2, n), {
    children: [
      Object.assign(Object.assign({}, oh({ r: n })), { fill: "none" }),
      Object.assign(Object.assign({}, e), { tagName: "path", d: We(s.serialize(), -n) })
    ]
  };
};
var cw = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
};
const hw = (i) => {
  var { rx: t, ry: e } = i, n = cw(i, ["rx", "ry"]);
  const s = t || 5, r = e || 5;
  return Object.assign(Object.assign({ cx: s }, n), { tagName: "ellipse", rx: s, ry: r });
}, uw = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  async: aw,
  block: Zv,
  circle: oh,
  circlePlus: lw,
  classic: Qv,
  cross: rw,
  diamond: ew,
  ellipse: hw,
  path: iw
}, Symbol.toStringTag, { value: "Module" }));
var Fe;
(function(i) {
  i.presets = uw, i.registry = Mt.create({
    type: "marker"
  }), i.registry.register(i.presets, !0);
})(Fe || (Fe = {}));
(function(i) {
  i.normalize = We;
})(Fe || (Fe = {}));
var dw = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
};
function eo(i) {
  return typeof i == "string" || Se(i);
}
const fw = {
  qualify: eo,
  set(i, { view: t, attrs: e }) {
    return no("marker-start", i, t, e);
  }
}, gw = {
  qualify: eo,
  set(i, { view: t, attrs: e }) {
    return no("marker-end", i, t, e, {
      transform: "rotate(180)"
    });
  }
}, pw = {
  qualify: eo,
  set(i, { view: t, attrs: e }) {
    return no("marker-mid", i, t, e);
  }
};
function no(i, t, e, n, s = {}) {
  const r = typeof t == "string" ? { name: t } : t, { name: o, args: a } = r, l = dw(r, ["name", "args"]);
  let c = l;
  if (o && typeof o == "string") {
    const u = Fe.registry.get(o);
    if (u)
      c = u(Object.assign(Object.assign({}, l), a));
    else
      return Fe.registry.onNotFound(o);
  }
  const h = Object.assign(Object.assign(Object.assign({}, mw(n, i)), s), c);
  return {
    [i]: `url(#${e.graph.defineMarker(h)})`
  };
}
function mw(i, t) {
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
const Mi = (i, { view: t }) => t.cell.isEdge(), bw = {
  qualify: Mi,
  set(i, t) {
    var e, n, s, r;
    const o = t.view, a = i.reverse || !1, l = i.stubs || 0;
    let c;
    if (Number.isFinite(l) && l !== 0)
      if (a) {
        let h, u;
        const d = o.getConnectionLength() || 0;
        l < 0 ? (h = (d + l) / 2, u = -l) : (h = l, u = d - l * 2);
        const f = o.getConnection();
        c = (r = (s = (n = (e = f == null ? void 0 : f.divideAtLength(h)) === null || e === void 0 ? void 0 : e[1]) === null || n === void 0 ? void 0 : n.divideAtLength(u)) === null || s === void 0 ? void 0 : s[0]) === null || r === void 0 ? void 0 : r.serialize();
      } else {
        let h;
        l < 0 ? h = ((o.getConnectionLength() || 0) + l) / 2 : h = l;
        const u = o.getConnection();
        if (u) {
          const d = u.divideAtLength(h), f = u.divideAtLength(-h);
          d && f && (c = `${d[0].serialize()} ${f[1].serialize()}`);
        }
      }
    return { d: c || o.getConnectionPathData() };
  }
}, ah = {
  qualify: Mi,
  set: Ns("getTangentAtLength", { rotate: !0 })
}, yw = {
  qualify: Mi,
  set: Ns("getTangentAtLength", { rotate: !1 })
}, lh = {
  qualify: Mi,
  set: Ns("getTangentAtRatio", { rotate: !0 })
}, vw = {
  qualify: Mi,
  set: Ns("getTangentAtRatio", { rotate: !1 })
}, ww = ah, xw = lh;
function Ns(i, t) {
  const e = { x: 1, y: 0 };
  return (n, s) => {
    let r, o;
    const a = s.view, l = a[i](Number(n));
    return l ? (o = t.rotate ? l.vector().vectorAngle(e) : 0, r = l.start) : (r = a.path.start, o = 0), o === 0 ? { transform: `translate(${r.x},${r.y}')` } : {
      transform: `translate(${r.x},${r.y}') rotate(${o})`
    };
  };
}
const Ew = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  annotations: Vv,
  atConnectionLength: ww,
  atConnectionLengthIgnoreGradient: yw,
  atConnectionLengthKeepGradient: ah,
  atConnectionRatio: xw,
  atConnectionRatioIgnoreGradient: vw,
  atConnectionRatioKeepGradient: lh,
  connection: bw,
  displayEmpty: Gv,
  eol: Fv,
  fill: Rv,
  filter: Jv,
  html: Yv,
  lineHeight: _v,
  port: Kv,
  ref: yv,
  refCx: Sv,
  refCy: Ov,
  refD: Tv,
  refDKeepOffset: Pv,
  refDResetOffset: Jc,
  refDx: vv,
  refDy: wv,
  refHeight: Xc,
  refHeight2: kv,
  refPoints: Nv,
  refPointsKeepOffset: Av,
  refPointsResetOffset: Kc,
  refR: Mv,
  refRCircumscribed: Cv,
  refRInscribed: Yc,
  refRx: xv,
  refRy: Ev,
  refWidth: Wc,
  refWidth2: jv,
  refX: qc,
  refX2: Lv,
  refY: Uc,
  refY2: Iv,
  resetOffset: Wv,
  sourceMarker: fw,
  stroke: Dv,
  style: Xv,
  targetMarker: gw,
  text: eh,
  textPath: zv,
  textVerticalAnchor: Bv,
  textWrap: $v,
  title: Hv,
  vertexMarker: pw,
  xAlign: qv,
  yAlign: Uv
}, Symbol.toStringTag, { value: "Module" }));
var Ee;
(function(i) {
  function t(e, n, s) {
    return !!(e != null && (typeof e == "string" || typeof e.qualify != "function" || z(e.qualify, this, n, s)));
  }
  i.isValidDefinition = t;
})(Ee || (Ee = {}));
(function(i) {
  i.presets = Object.assign(Object.assign({}, bv), Ew), i.registry = Mt.create({
    type: "attribute definition"
  }), i.registry.register(i.presets, !0);
})(Ee || (Ee = {}));
const oe = {
  prefixCls: "x6",
  autoInsertCSS: !0,
  useCSSSelector: !0,
  prefix(i) {
    return `${oe.prefixCls}-${i}`;
  }
}, ba = oe.prefix("highlighted"), Cw = {
  highlight(i, t, e) {
    const n = e && e.className || ba;
    U(t, n);
  },
  unhighlight(i, t, e) {
    const n = e && e.className || ba;
    Ht(t, n);
  }
}, ya = oe.prefix("highlight-opacity"), Sw = {
  highlight(i, t) {
    U(t, ya);
  },
  unhighlight(i, t) {
    Ht(t, ya);
  }
};
var at;
(function(i) {
  i.normalizeMarker = We;
  function t(d, f) {
    const g = L0(d.x, d.y).matrixTransform(f);
    return new w(g.x, g.y);
  }
  i.transformPoint = t;
  function e(d, f) {
    return new D(t(d.start, f), t(d.end, f));
  }
  i.transformLine = e;
  function n(d, f) {
    let g = d instanceof Ot ? d.points : d;
    return Array.isArray(g) || (g = []), new Ot(g.map((p) => t(p, f)));
  }
  i.transformPolyline = n;
  function s(d, f) {
    const p = me("svg").createSVGPoint();
    p.x = d.x, p.y = d.y;
    const m = p.matrixTransform(f);
    p.x = d.x + d.width, p.y = d.y;
    const b = p.matrixTransform(f);
    p.x = d.x + d.width, p.y = d.y + d.height;
    const v = p.matrixTransform(f);
    p.x = d.x, p.y = d.y + d.height;
    const y = p.matrixTransform(f), x = Math.min(m.x, b.x, v.x, y.x), E = Math.max(m.x, b.x, v.x, y.x), S = Math.min(m.y, b.y, v.y, y.y), C = Math.max(m.y, b.y, v.y, y.y);
    return new R(x, S, E - x, C - S);
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
    const b = ai(d, g || m);
    return s(p, b);
  }
  i.bbox = r;
  function o(d, f = {}) {
    let g;
    if (!d.ownerSVGElement || !Be(d)) {
      if (la(d)) {
        const { left: v, top: y, width: x, height: E } = a(d);
        return new R(v, y, x, E);
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
      const v = ai(d, m);
      return s(g, v);
    }
    {
      const v = d.childNodes, y = v.length;
      if (y === 0)
        return o(d, {
          target: m
        });
      m || (m = d);
      for (let x = 0; x < y; x += 1) {
        const E = v[x];
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
      let b = d;
      for (; b; )
        f += b.offsetLeft, g += b.offsetTop, b = b.offsetParent, b && (f += parseInt(da(b, "borderLeft"), 10), g += parseInt(da(b, "borderTop"), 10));
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
        return new fe(f("cx"), f("cy"), f("r"), f("r"));
      case "ellipse":
        return new fe(f("cx"), f("cy"), f("rx"), f("ry"));
      case "polyline": {
        const g = Qi(d);
        return new Ot(g);
      }
      case "polygon": {
        const g = Qi(d);
        return g.length > 1 && g.push(g[0]), new Ot(g);
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
    const m = w.create(f), b = w.create(g);
    p || (p = d instanceof SVGSVGElement ? d : d.ownerSVGElement);
    const v = mr(d);
    d.setAttribute("transform", "");
    const y = o(d, {
      target: p
    }).scale(v.sx, v.sy), x = Qn();
    x.setTranslate(-y.x - y.width / 2, -y.y - y.height / 2);
    const E = Qn(), S = m.angleBetween(b, m.clone().translate(1, 0));
    S && E.setRotate(S, 0, 0);
    const C = Qn(), O = m.clone().move(b, y.width / 2);
    C.setTranslate(2 * m.x - O.x, 2 * m.y - O.y);
    const P = ai(d, p), I = Qn();
    I.setMatrix(C.matrix.multiply(E.matrix.multiply(x.matrix.multiply(P.scale(v.sx, v.sy))))), d.setAttribute("transform", qn(I.matrix));
  }
  i.translateAndAutoOrient = c;
  function h(d) {
    if (d == null)
      return null;
    let f = d;
    do {
      let g = f.tagName;
      if (typeof g != "string")
        return null;
      if (g = g.toUpperCase(), Hn(f, "x6-port"))
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
  i.findShapeNode = h;
  function u(d) {
    const f = h(d);
    if (!Be(f)) {
      if (la(d)) {
        const { left: m, top: b, width: v, height: y } = a(d);
        return new R(m, b, v, y);
      }
      return new R(0, 0, 0, 0);
    }
    return l(f).bbox() || R.create();
  }
  i.getBBoxV2 = u;
})(at || (at = {}));
const Ow = {
  padding: 3,
  rx: 0,
  ry: 0,
  attrs: {
    "stroke-width": 3,
    stroke: "#FEB663"
  }
}, Pw = {
  highlight(i, t, e) {
    const n = ke.getHighlighterId(t, e);
    if (ke.hasCache(n))
      return;
    e = tc({}, e, Ow);
    const s = G.create(t);
    let r, o;
    try {
      r = s.toPathData();
    } catch {
      o = at.bbox(s.node, !0), r = kc(Object.assign(Object.assign({}, e), o));
    }
    const a = me("path");
    if (et(a, Object.assign({ d: r, "pointer-events": "none", "vector-effect": "non-scaling-stroke", fill: "none" }, e.attrs ? gi(e.attrs) : null)), i.isEdgeElement(t))
      et(a, "d", i.getConnectionPathData());
    else {
      let h = s.getTransformToElement(i.container);
      const u = e.padding;
      if (u) {
        o == null && (o = at.bbox(s.node, !0));
        const d = o.x + o.width / 2, f = o.y + o.height / 2;
        o = at.transformRectangle(o, h);
        const g = Math.max(o.width, 1), p = Math.max(o.height, 1), m = (g + u) / g, b = (p + u) / p, v = $t({
          a: m,
          b: 0,
          c: 0,
          d: b,
          e: d - m * d,
          f: f - b * f
        });
        h = h.multiply(v);
      }
      En(a, h);
    }
    U(a, oe.prefix("highlight-stroke"));
    const l = i.cell, c = () => ke.removeHighlighter(n);
    l.on("removed", c), l.model && l.model.on("reseted", c), i.container.appendChild(a), ke.setCache(n, a);
  },
  unhighlight(i, t, e) {
    ke.removeHighlighter(ke.getHighlighterId(t, e));
  }
};
var ke;
(function(i) {
  function t(o, a) {
    return Wr(o), o.id + JSON.stringify(a);
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
    a && (ve(a), delete e[o]);
  }
  i.removeHighlighter = r;
})(ke || (ke = {}));
const Aw = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  className: Cw,
  opacity: Sw,
  stroke: Pw
}, Symbol.toStringTag, { value: "Module" }));
var Me;
(function(i) {
  function t(e, n) {
    if (typeof n.highlight != "function")
      throw new Error(`Highlighter '${e}' is missing required \`highlight()\` method`);
    if (typeof n.unhighlight != "function")
      throw new Error(`Highlighter '${e}' is missing required \`unhighlight()\` method`);
  }
  i.check = t;
})(Me || (Me = {}));
(function(i) {
  i.presets = Aw, i.registry = Mt.create({
    type: "highlighter"
  }), i.registry.register(i.presets, !0);
})(Me || (Me = {}));
function xr(i, t = {}) {
  return new w(ue(t.x, i.width), ue(t.y, i.height));
}
function io(i, t, e) {
  return Object.assign({ angle: t, position: i.toJSON() }, e);
}
const Mw = (i, t) => i.map(({ x: e, y: n, angle: s }) => io(xr(t, { x: e, y: n }), s || 0)), Tw = (i, t, e) => {
  const n = e.start || 0, s = e.step || 20;
  return ch(i, t, n, (r, o) => (r + 0.5 - o / 2) * s);
}, Nw = (i, t, e) => {
  const n = e.start || 0, s = e.step || 360 / i.length;
  return ch(i, t, n, (r) => r * s);
};
function ch(i, t, e, n) {
  const s = t.getCenter(), r = t.getTopCenter(), o = t.width / t.height, a = fe.fromRect(t), l = i.length;
  return i.map((c, h) => {
    const u = e + n(h, l), d = r.clone().rotate(-u, s).scale(o, 1, s), f = c.compensateRotate ? -a.tangentTheta(d) : 0;
    return (c.dx || c.dy) && d.translate(c.dx || 0, c.dy || 0), c.dr && d.move(s, c.dr), io(d.round(), f, c);
  });
}
var Lw = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
};
const Iw = (i, t, e) => {
  const n = xr(t, e.start || t.getOrigin()), s = xr(t, e.end || t.getCorner());
  return Ti(i, n, s, e);
}, jw = (i, t, e) => Ti(i, t.getTopLeft(), t.getBottomLeft(), e), kw = (i, t, e) => Ti(i, t.getTopRight(), t.getBottomRight(), e), Rw = (i, t, e) => Ti(i, t.getTopLeft(), t.getTopRight(), e), Dw = (i, t, e) => Ti(i, t.getBottomLeft(), t.getBottomRight(), e);
function Ti(i, t, e, n) {
  const s = new D(t, e), r = i.length;
  return i.map((o, a) => {
    var { strict: l } = o, c = Lw(o, ["strict"]);
    const h = l || n.strict ? (a + 1) / (r + 1) : (a + 0.5) / r, u = s.pointAt(h);
    return (c.dx || c.dy) && u.translate(c.dx || 0, c.dy || 0), io(u.round(), 0, c);
  });
}
const $w = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  absolute: Mw,
  bottom: Dw,
  ellipse: Tw,
  ellipseSpread: Nw,
  left: jw,
  line: Iw,
  right: kw,
  top: Rw
}, Symbol.toStringTag, { value: "Module" }));
var Qe;
(function(i) {
  i.presets = $w, i.registry = Mt.create({
    type: "port layout"
  }), i.registry.register(i.presets, !0);
})(Qe || (Qe = {}));
const _w = {
  position: { x: 0, y: 0 },
  angle: 0,
  attrs: {
    ".": {
      y: "0",
      "text-anchor": "start"
    }
  }
};
function Xe(i, t) {
  const { x: e, y: n, angle: s, attrs: r } = t || {};
  return tc({}, { angle: s, attrs: r, position: { x: e, y: n } }, i, _w);
}
const Bw = (i, t, e) => Xe({ position: t.getTopLeft() }, e), zw = (i, t, e) => Xe({
  position: { x: -15, y: 0 },
  attrs: { ".": { y: ".3em", "text-anchor": "end" } }
}, e), Vw = (i, t, e) => Xe({
  position: { x: 15, y: 0 },
  attrs: { ".": { y: ".3em", "text-anchor": "start" } }
}, e), Fw = (i, t, e) => Xe({
  position: { x: 0, y: -15 },
  attrs: { ".": { "text-anchor": "middle" } }
}, e), Gw = (i, t, e) => Xe({
  position: { x: 0, y: 15 },
  attrs: { ".": { y: ".6em", "text-anchor": "middle" } }
}, e), Hw = (i, t, e) => hh(i, t, !1, e), qw = (i, t, e) => hh(i, t, !0, e), Uw = (i, t, e) => uh(i, t, !1, e), Ww = (i, t, e) => uh(i, t, !0, e);
function hh(i, t, e, n) {
  const s = n.offset != null ? n.offset : 15, r = t.getCenter().theta(i), o = dh(t);
  let a, l, c, h, u = 0;
  return r < o[1] || r > o[2] ? (a = ".3em", l = s, c = 0, h = "start") : r < o[0] ? (a = "0", l = 0, c = -s, e ? (u = -90, h = "start") : h = "middle") : r < o[3] ? (a = ".3em", l = -s, c = 0, h = "end") : (a = ".6em", l = 0, c = s, e ? (u = 90, h = "start") : h = "middle"), Xe({
    position: {
      x: Math.round(l),
      y: Math.round(c)
    },
    angle: u,
    attrs: {
      ".": {
        y: a,
        "text-anchor": h
      }
    }
  }, n);
}
function uh(i, t, e, n) {
  const s = n.offset != null ? n.offset : 15, r = t.getCenter().theta(i), o = dh(t);
  let a, l, c, h, u = 0;
  return r < o[1] || r > o[2] ? (a = ".3em", l = -s, c = 0, h = "end") : r < o[0] ? (a = ".6em", l = 0, c = s, e ? (u = 90, h = "start") : h = "middle") : r < o[3] ? (a = ".3em", l = s, c = 0, h = "start") : (a = "0em", l = 0, c = -s, e ? (u = -90, h = "start") : h = "middle"), Xe({
    position: {
      x: Math.round(l),
      y: Math.round(c)
    },
    angle: u,
    attrs: {
      ".": {
        y: a,
        "text-anchor": h
      }
    }
  }, n);
}
function dh(i) {
  const t = i.getCenter(), e = t.theta(i.getTopLeft()), n = t.theta(i.getBottomLeft()), s = t.theta(i.getBottomRight()), r = t.theta(i.getTopRight());
  return [e, r, s, n];
}
const Xw = (i, t, e) => fh(i.diff(t.getCenter()), !1, e), Yw = (i, t, e) => fh(i.diff(t.getCenter()), !0, e);
function fh(i, t, e) {
  const n = e.offset != null ? e.offset : 20, s = new w(0, 0), r = -i.theta(s), o = i.clone().move(s, n).diff(i).round();
  let a = ".3em", l, c = r;
  return (r + 90) % 180 === 0 ? (l = t ? "end" : "middle", !t && r === -270 && (a = "0em")) : r > -270 && r < -90 ? (l = "start", c = r - 180) : l = "end", Xe({
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
const Jw = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  bottom: Gw,
  inside: Uw,
  insideOriented: Ww,
  left: zw,
  manual: Bw,
  outside: Hw,
  outsideOriented: qw,
  radial: Xw,
  radialOriented: Yw,
  right: Vw,
  top: Fw
}, Symbol.toStringTag, { value: "Module" }));
var Pn;
(function(i) {
  i.presets = Jw, i.registry = Mt.create({
    type: "port label layout"
  }), i.registry.register(i.presets, !0);
})(Pn || (Pn = {}));
var Kw = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
};
class it extends At {
  get priority() {
    return 2;
  }
  /** If need remove `this.container` DOM */
  get disposeContainer() {
    return !0;
  }
  constructor() {
    super(), this.cid = Er.uniqueId(), it.views[this.cid] = this;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  confirmUpdate(t, e) {
    return 0;
  }
  empty(t = this.container) {
    return Ai(t), this;
  }
  unmount(t = this.container) {
    return ve(t), this;
  }
  remove(t = this.container) {
    return t === this.container ? (this.removeEventListeners(document), this.onRemove(), delete it.views[this.cid], this.disposeContainer && this.unmount(t)) : this.unmount(t), this;
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
    return Ht(e, Array.isArray(t) ? t.join(" ") : t), this;
  }
  setStyle(t, e = this.container) {
    return kt(e, t), this;
  }
  setAttrs(t, e = this.container) {
    return t != null && e != null && et(e, t), this;
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
    return it.find(t, e, n).elems;
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
      const s = Yr(t) + 1;
      n = `${t.tagName.toLowerCase()}:nth-child(${s})`, e && (n += ` > ${e}`), n = this.getSelector(t.parentNode, n);
    }
    return n;
  }
  prefixClassName(t) {
    return oe.prefix(t);
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
    return Vt.off(this.container, this.getEventNamespace()), this;
  }
  delegateDocumentEvents(t, e) {
    return this.addEventListeners(document, t, e), this;
  }
  undelegateDocumentEvents() {
    return this.removeEventListeners(document), this;
  }
  delegateEvent(t, e, n) {
    return Vt.on(this.container, t + this.getEventNamespace(), e, n), this;
  }
  undelegateEvent(t, e, n) {
    const s = t + this.getEventNamespace();
    return e == null ? Vt.off(this.container, s) : typeof e == "string" ? Vt.off(this.container, s, e, n) : Vt.off(this.container, s, e), this;
  }
  addEventListeners(t, e, n) {
    if (e == null)
      return this;
    const s = this.getEventNamespace();
    return Object.keys(e).forEach((r) => {
      const o = this.getEventHandler(e[r]);
      typeof o == "function" && Vt.on(t, r + s, n, o);
    }), this;
  }
  removeEventListeners(t) {
    return t != null && Vt.off(t, this.getEventNamespace()), this;
  }
  getEventNamespace() {
    return `.${oe.prefixCls}-event-${this.cid}`;
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
    return it.normalizeEvent(t);
  }
  dispose() {
    this.remove();
  }
}
Kw([
  it.dispose()
], it.prototype, "dispose", null);
(function(i) {
  function t(s, r) {
    return r ? me(s || "g") : Xr(s || "div");
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
})(it || (it = {}));
(function(i) {
  i.views = {};
  function t(e) {
    return i.views[e] || null;
  }
  i.getView = t;
})(it || (it = {}));
var Er;
(function(i) {
  let t = 0;
  function e() {
    const n = `v${t}`;
    return t += 1, n;
  }
  i.uniqueId = e;
})(Er || (Er = {}));
class Zw {
  constructor(t) {
    this.view = t, this.clean();
  }
  clean() {
    this.elemCache && this.elemCache.dispose(), this.elemCache = new wr(), this.pathCache = {};
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
      e.matrix = D0(t, n);
    }
    return $t(e.matrix);
  }
  getShape(t) {
    const e = this.get(t);
    return e.shape == null && (e.shape = at.toGeometryShape(t)), e.shape.clone();
  }
  getBoundingRect(t) {
    const e = this.get(t);
    return e.boundingRect == null && (e.boundingRect = at.getBBoxV2(t)), e.boundingRect.clone();
  }
}
var pt;
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
    return c == null || e(c) ? c : gt(c);
  }
  i.clone = n;
  function s(c) {
    return `${c}`.trim().replace(/[\r|\n]/g, " ").replace(/>\s+</g, "><");
  }
  i.sanitize = s;
  function r(c, h = { ns: Rt.svg }) {
    const u = document.createDocumentFragment(), d = {}, f = {}, g = [
      {
        markup: Array.isArray(c) ? c : [c],
        parent: u,
        ns: h.ns
      }
    ];
    for (; g.length > 0; ) {
      const p = g.pop();
      let m = p.ns || Rt.svg;
      const b = p.markup, v = p.parent;
      b.forEach((y) => {
        const x = y.tagName;
        if (!x)
          throw new TypeError("Invalid tagName");
        y.ns && (m = y.ns);
        const E = m ? Xr(x, m) : aa(x), S = y.attrs;
        S && et(E, gi(S));
        const C = y.style;
        C && kt(E, C);
        const O = y.className;
        O != null && E.setAttribute("class", Array.isArray(O) ? O.join(" ") : O), y.textContent && (E.textContent = y.textContent);
        const P = y.selector;
        if (P != null) {
          if (f[P])
            throw new TypeError("Selector must be unique");
          f[P] = E;
        }
        if (y.groupSelector) {
          let T = y.groupSelector;
          Array.isArray(T) || (T = [T]), T.forEach((j) => {
            d[j] || (d[j] = []), d[j].push(E);
          });
        }
        v.appendChild(E);
        const I = y.children;
        Array.isArray(I) && g.push({ ns: m, markup: I, parent: E });
      });
    }
    return Object.keys(d).forEach((p) => {
      if (f[p])
        throw new Error("Ambiguous group selector");
      f[p] = d[p];
    }), { fragment: u, selectors: f, groups: d };
  }
  i.parseJSONMarkup = r;
  function o(c) {
    return c instanceof SVGElement ? me("g") : aa("div");
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
    const h = r(c), u = h.fragment;
    let d = null;
    return u.childNodes.length > 1 ? (d = o(u.firstChild), d.appendChild(u)) : d = u.firstChild, { elem: d, selectors: h.selectors };
  }
  i.renderMarkup = a;
  function l(c) {
    const h = G.createVectors(c), u = document.createDocumentFragment();
    for (let d = 0, f = h.length; d < f; d += 1) {
      const g = h[d].node;
      u.appendChild(g);
    }
    return { fragment: u, selectors: {} };
  }
  i.parseLabelStringMarkup = l;
})(pt || (pt = {}));
(function(i) {
  function t(e, n, s) {
    if (e != null) {
      let r;
      const o = e.tagName.toLowerCase();
      if (e === n)
        return typeof s == "string" ? r = `> ${o} > ${s}` : r = `> ${o}`, r;
      const a = e.parentNode;
      if (a && a.childNodes.length > 1) {
        const l = Yr(e) + 1;
        r = `${o}:nth-child(${l})`;
      } else
        r = o;
      return s && (r += ` > ${s}`), t(e.parentNode, n, r);
    }
    return s;
  }
  i.getSelector = t;
})(pt || (pt = {}));
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
})(pt || (pt = {}));
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
})(pt || (pt = {}));
(function(i) {
  function t(e = !1) {
    return {
      tagName: "foreignObject",
      selector: "fo",
      children: [
        {
          ns: Rt.xhtml,
          tagName: "body",
          selector: "foBody",
          attrs: {
            xmlns: Rt.xhtml
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
})(pt || (pt = {}));
class gh {
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
      const c = e[l], h = this.getDefinition(l), u = z(Ee.isValidDefinition, this.view, h, c, {
        elem: t,
        attrs: e,
        cell: this.cell,
        view: this.view
      });
      if (h && u)
        typeof h == "string" ? (n == null && (n = {}), n[h] = c) : c !== null && a.push({ name: l, definition: h });
      else {
        n == null && (n = {});
        const d = Pc.includes(l) ? l : ac(l);
        n[d] = c;
      }
    }), a.forEach(({ name: l, definition: c }) => {
      const h = e[l];
      typeof c.set == "function" && (s == null && (s = {}), s[l] = h), typeof c.offset == "function" && (r == null && (r = {}), r[l] = h), typeof c.position == "function" && (o == null && (o = {}), o[l] = h);
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
    const r = [], o = new wr();
    return Object.keys(t).forEach((a) => {
      const l = t[a];
      if (!Se(l))
        return;
      const { isCSSSelector: c, elems: h } = it.find(a, e, s);
      n[a] = h;
      for (let u = 0, d = h.length; u < d; u += 1) {
        const f = h[u], g = s && s[a] === f, p = o.get(f);
        if (p) {
          p.array || (r.push(f), p.array = !0, p.attrs = [p.attrs], p.priority = [p.priority]);
          const m = p.attrs, b = p.priority;
          if (g)
            m.unshift(l), b.unshift(-1);
          else {
            const v = ky(b, c ? -1 : d);
            m.splice(v, 0, l), b.splice(v, 0, d);
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
      l.attrs = c.reduceRight((h, u) => Nt(h, u), {});
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
      const b = o[m], v = this.getDefinition(m);
      if (v != null) {
        const y = z(v.set, this.view, b, c());
        typeof y == "object" ? r = Object.assign(Object.assign({}, r), y) : y != null && (r[m] = y);
      }
    }), t instanceof HTMLElement) {
      this.view.setAttrs(r, t);
      return;
    }
    const h = r.transform, u = h ? `${h}` : null, d = pi(u), f = new w(d.e, d.f);
    h && (delete r.transform, d.e = 0, d.f = 0);
    let g = !1;
    a != null && Object.keys(a).forEach((m) => {
      const b = a[m], v = this.getDefinition(m);
      if (v != null) {
        const y = z(v.position, this.view, b, c());
        y != null && (g = !0, f.translate(w.create(y)));
      }
    }), this.view.setAttrs(r, t);
    let p = !1;
    if (l != null) {
      const m = this.view.getBoundingRectOfElement(t);
      if (m.width > 0 && m.height > 0) {
        const b = at.transformRectangle(m, d);
        Object.keys(l).forEach((v) => {
          const y = l[v], x = this.getDefinition(v);
          if (x != null) {
            const E = z(x.offset, this.view, y, {
              elem: t,
              cell: this.cell,
              view: this.view,
              attrs: s,
              refBBox: b
            });
            E != null && (p = !0, f.translate(w.create(E)));
          }
        });
      }
    }
    (h != null || g || p) && (f.round(1), d.e = Number.isFinite(f.x) ? f.x : 0, d.f = Number.isFinite(f.y) ? f.y : 0, t.setAttribute("transform", qn(d)));
  }
  update(t, e, n) {
    const s = {}, r = this.findAttrs(n.attrs || e, t, s, n.selectors), o = n.attrs ? this.findAttrs(e, t, s, n.selectors) : r, a = [];
    r.each((h) => {
      const u = h.elem, d = h.attrs, f = this.processAttrs(u, d);
      if (f.set == null && f.position == null && f.offset == null)
        this.view.setAttrs(f.normal, u);
      else {
        const g = o.get(u), p = g ? g.attrs : null, m = p && d.ref == null ? p.ref : d.ref;
        let b;
        if (m) {
          if (b = (s[m] || this.view.find(m, t, n.selectors))[0], !b)
            throw new Error(`"${m}" reference does not exist.`);
        } else
          b = null;
        const v = {
          node: u,
          refNode: b,
          attributes: p,
          processedAttributes: f
        }, y = a.findIndex((x) => x.refNode === u);
        y > -1 ? a.splice(y, 0, v) : a.push(v);
      }
    });
    const l = new wr();
    let c;
    a.forEach((h) => {
      const u = h.node, d = h.refNode;
      let f;
      const g = d != null && n.rotatableNode != null && Jr(n.rotatableNode, d);
      if (d && (f = l.get(d)), !f) {
        const b = g ? n.rotatableNode : t;
        f = d ? at.getBBox(d, { target: b }) : n.rootBBox, d && l.set(d, f);
      }
      let p;
      n.attrs && h.attributes ? (p = this.processAttrs(u, h.attributes), this.mergeProcessedAttrs(p, h.processedAttributes)) : p = h.processedAttributes;
      let m = f;
      g && n.rotatableNode != null && !n.rotatableNode.contains(u) && (c || (c = pi(et(n.rotatableNode, "transform"))), m = at.transformRectangle(f, c)), this.updateRelativeAttrs(u, p, m);
    });
  }
}
class ph {
  get cell() {
    return this.view.cell;
  }
  constructor(t, e, n = []) {
    this.view = t;
    const s = {}, r = {};
    let o = 0;
    Object.keys(e).forEach((l) => {
      let c = e[l];
      Array.isArray(c) || (c = [c]), c.forEach((h) => {
        let u = s[h];
        u || (o += 1, u = s[h] = 1 << o), r[l] |= u;
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
var Qw = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
}, tx = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
};
class Pt extends it {
  static getDefaults() {
    return this.defaults;
  }
  static config(t) {
    this.defaults = this.getOptions(t);
  }
  static getOptions(t) {
    const e = (c, h) => h != null ? sc([
      ...Array.isArray(c) ? c : [c],
      ...Array.isArray(h) ? h : [h]
    ]) : Array.isArray(c) ? [...c] : [c], n = gt(this.getDefaults()), { bootstrap: s, actions: r, events: o, documentEvents: a } = t, l = tx(t, ["bootstrap", "actions", "events", "documentEvents"]);
    return s && (n.bootstrap = e(n.bootstrap, s)), r && Object.entries(r).forEach(([c, h]) => {
      const u = n.actions[c];
      h && u ? n.actions[c] = e(u, h) : h && (n.actions[c] = e(h));
    }), o && (n.events = Object.assign(Object.assign({}, n.events), o)), t.documentEvents && (n.documentEvents = Object.assign(Object.assign({}, n.documentEvents), a)), Nt(n, l);
  }
  get [Symbol.toStringTag]() {
    return Pt.toStringTag;
  }
  constructor(t, e = {}) {
    super(), this.cell = t, this.options = this.ensureOptions(e), this.graph = this.options.graph, this.attr = new gh(this), this.flag = new ph(this, this.options.actions, this.options.bootstrap), this.cache = new Zw(this), this.setContainer(this.ensureContainer()), this.setup(), this.init();
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
    return it.createElement(this.getContainerTagName(), this.options.isSvgElement);
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
    const n = pt.parseJSONMarkup(t), s = n.selectors, r = this.rootSelector;
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
    return at.transformRectangle(e, r.multiply(s).multiply(n));
  }
  getUnrotatedBBoxOfElement(t) {
    const e = this.getBoundingRectOfElement(t), n = this.getMatrixOfElement(t), s = this.getRootTranslatedMatrix();
    return at.transformRectangle(e, s.multiply(n));
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
    return $t().translate(e.x, e.y);
  }
  getRootRotatedMatrix() {
    let t = $t();
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
      const e = Lt.isToolsView(t) ? t : new Lt(t);
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
Pt.defaults = {
  isSvgElement: !0,
  rootSelector: "root",
  priority: 0,
  bootstrap: [],
  actions: {}
};
Qw([
  Pt.dispose()
], Pt.prototype, "dispose", null);
(function(i) {
  i.Flag = ph, i.Attr = gh;
})(Pt || (Pt = {}));
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
})(Pt || (Pt = {}));
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
})(Pt || (Pt = {}));
(function(i) {
  i.registry = Mt.create({
    type: "view"
  });
})(Pt || (Pt = {}));
class Lt extends it {
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
    return Lt.toStringTag;
  }
  constructor(t = {}) {
    super(), this.svgContainer = this.createContainer(!0, t), this.htmlContainer = this.createContainer(!1, t), this.config(t);
  }
  createContainer(t, e) {
    const n = t ? it.createElement("g", !0) : it.createElement("div", !1);
    return U(n, this.prefixClassName("cell-tools")), e.className && U(n, e.className), n;
  }
  config(t) {
    if (this.options = Object.assign(Object.assign({}, this.options), t), !Pt.isCellView(t.view) || t.view === this.cellView)
      return this;
    this.cellView = t.view, this.cell.isEdge() ? (U(this.svgContainer, this.prefixClassName("edge-tools")), U(this.htmlContainer, this.prefixClassName("edge-tools"))) : this.cell.isNode() && (U(this.svgContainer, this.prefixClassName("node-tools")), U(this.htmlContainer, this.prefixClassName("node-tools"))), this.svgContainer.setAttribute("data-cell-id", this.cell.id), this.htmlContainer.setAttribute("data-cell-id", this.cell.id), this.name && (this.svgContainer.setAttribute("data-tools-name", this.name), this.htmlContainer.setAttribute("data-tools-name", this.name));
    const e = this.options.items;
    if (!Array.isArray(e))
      return this;
    this.tools = [];
    const n = [];
    e.forEach((s) => {
      Lt.ToolItem.isToolItem(s) ? s.name === "vertices" ? n.unshift(s) : n.push(s) : (typeof s == "object" ? s.name : s) === "vertices" ? n.unshift(s) : n.push(s);
    });
    for (let s = 0; s < n.length; s += 1) {
      const r = n[s];
      let o;
      if (Lt.ToolItem.isToolItem(r))
        o = r;
      else {
        const a = typeof r == "object" ? r.name : r, l = typeof r == "object" ? r.args || {} : {};
        if (a) {
          if (this.cell.isNode()) {
            const c = Mn.registry.get(a);
            if (c)
              o = new c(l);
            else
              return Mn.registry.onNotFound(a);
          } else if (this.cell.isEdge()) {
            const c = Tn.registry.get(a);
            if (c)
              o = new c(l);
            else
              return Tn.registry.onNotFound(a);
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
    return t && (t.forEach((e) => e.remove()), this.tools = null), ve(this.svgContainer), ve(this.htmlContainer), super.remove();
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
})(Lt || (Lt = {}));
(function(i) {
  class t extends it {
    static getDefaults() {
      return this.defaults;
    }
    static config(n) {
      this.defaults = this.getOptions(n);
    }
    static getOptions(n) {
      return Nt(gt(this.getDefaults()), n);
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
      super(), this.visible = !0, this.options = this.getOptions(n), this.container = it.createElement(this.options.tagName || "g", this.options.isSVGElement !== !1), U(this.container, this.prefixClassName("cell-tool")), typeof this.options.className == "string" && U(this.container, this.options.className), this.init();
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
        const s = pt.parseJSONMarkup(n);
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
      return o ? Gr(o) : (n += 1, `CustomTool${n}`);
    }
    function r(o) {
      const a = Vr(s(o.name), this);
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
})(Lt || (Lt = {}));
const ex = (i) => i;
function va(i, t) {
  return t === 0 ? "0%" : `${Math.round(i / t * 100)}%`;
}
function mh(i) {
  return (e, n, s, r) => n.isEdgeElement(s) ? ix(i, e, n, s, r) : nx(i, e, n, s, r);
}
function nx(i, t, e, n, s) {
  const r = e.cell, o = r.getAngle(), a = e.getUnrotatedBBoxOfElement(n), l = r.getBBox().getCenter(), c = w.create(s).rotate(o, l);
  let h = c.x - a.x, u = c.y - a.y;
  return i && (h = va(h, a.width), u = va(u, a.height)), t.anchor = {
    name: "topLeft",
    args: {
      dx: h,
      dy: u,
      rotate: !0
    }
  }, t;
}
function ix(i, t, e, n, s) {
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
const sx = mh(!0), rx = mh(!1), ox = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  noop: ex,
  pinAbsolute: rx,
  pinRelative: sx
}, Symbol.toStringTag, { value: "Module" }));
var Cr;
(function(i) {
  i.presets = ox, i.registry = Mt.create({
    type: "connection strategy"
  }), i.registry.register(i.presets, !0);
})(Cr || (Cr = {}));
function bh(i, t, e, n) {
  return z(Cr.presets.pinRelative, this.graph, {}, t, e, i, this.cell, n, {}).anchor;
}
function yh(i, t) {
  return t ? i.cell.getBBox() : i.cell.isEdge() ? i.getConnection().bbox() : i.getUnrotatedBBoxOfElement(i.container);
}
class Ge extends Lt.ToolItem {
  onRender() {
    U(this.container, this.prefixClassName("cell-tool-button")), this.update();
  }
  update() {
    return this.updatePosition(), this;
  }
  updatePosition() {
    const e = this.cellView.cell.isEdge() ? this.getEdgeMatrix() : this.getNodeMatrix();
    En(this.container, e, { absolute: !0 });
  }
  getNodeMatrix() {
    const t = this.cellView, e = this.options;
    let { x: n = 0, y: s = 0 } = e;
    const { offset: r, useCellGeometry: o, rotate: a } = e;
    let l = yh(t, o);
    const c = t.cell.getAngle();
    a || (l = l.bbox(c));
    let h = 0, u = 0;
    typeof r == "number" ? (h = r, u = r) : typeof r == "object" && (h = r.x, u = r.y), n = ue(n, l.width), s = ue(s, l.height);
    let d = $t().translate(l.x + l.width / 2, l.y + l.height / 2);
    return a && (d = d.rotate(c)), d = d.translate(n + h - l.width / 2, s + u - l.height / 2), d;
  }
  getEdgeMatrix() {
    const t = this.cellView, e = this.options, { offset: n = 0, distance: s = 0, rotate: r } = e;
    let o, a, l;
    const c = ue(s, 1);
    c >= 0 && c <= 1 ? o = t.getTangentAtRatio(c) : o = t.getTangentAtLength(c), o ? (a = o.start, l = o.vector().vectorAngle(new w(1, 0)) || 0) : (a = t.getConnection().start, l = 0);
    let h = $t().translate(a.x, a.y).rotate(l);
    return typeof n == "object" ? h = h.translate(n.x || 0, n.y || 0) : h = h.translate(0, n), r || (h = h.rotate(-l)), h;
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
})(Ge || (Ge = {}));
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
})(Ge || (Ge = {}));
var ax = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
};
class ns extends Lt.ToolItem {
  onRender() {
    if (U(this.container, this.prefixClassName("cell-tool-boundary")), this.options.attrs) {
      const t = this.options.attrs, { class: e } = t, n = ax(t, ["class"]);
      et(this.container, gi(n)), e && U(this.container, e);
    }
    this.update();
  }
  update() {
    const t = this.cellView, e = this.options, { useCellGeometry: n, rotate: s } = e, r = nn(e.padding);
    let o = yh(t, n).moveAndExpand({
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
          pr(this.container, l, c.x, c.y, {
            absolute: !0
          });
        } else
          o = o.bbox(l);
    }
    return et(this.container, o.toJSON()), this;
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
})(ns || (ns = {}));
class yi extends Lt.ToolItem {
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
      prev: w.create(s),
      next: w.create(r)
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
        const { x: c, y: h } = l;
        c === o && h === a && n.onClick(r, o, a);
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
    const e = this.guard(t), n = this.options.addable && this.cellView.can("vertexAddable"), s = this.options.modifiers ? ze.isMatch(t, this.options.modifiers) : !0;
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
  class t extends it {
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
      this.container = it.createElement("circle", !0);
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
})(yi || (yi = {}));
(function(i) {
  const t = oe.prefix("edge-tool-vertex-path");
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
})(yi || (yi = {}));
class vi extends Lt.ToolItem {
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
    const s = t.options.axis, r = t.options.index, l = this.cellView.cell.getVertices(), c = l[r - 2] || n.sourceAnchor, h = l[r + 1] || n.targetAnchor, u = this.options.snapRadius;
    return Math.abs(e[s] - c[s]) < u ? e[s] = c[s] : Math.abs(e[s] - h[s]) < u && (e[s] = h[s]), e;
  }
  onHandleChanging({ handle: t, e }) {
    const n = this.graph, s = this.options, r = this.cellView, o = s.anchor, a = t.options.axis, l = t.options.index - 1, c = this.getEventData(e), h = this.normalizeEvent(e), u = n.snapToGrid(h.clientX, h.clientY), d = this.snapHandle(t, u.clone(), c), f = gt(this.vertices);
    let g = f[l], p = f[l + 1];
    const m = r.sourceView, b = r.sourceBBox;
    let v = !1, y = !1;
    if (g ? l === 0 ? b.containsPoint(g) ? (f.shift(), this.shiftHandleIndexes(-1), v = !0) : (g[a] = d[a], y = !0) : g[a] = d[a] : (g = r.sourceAnchor.toJSON(), g[a] = d[a], b.containsPoint(g) ? v = !0 : (f.unshift(g), this.shiftHandleIndexes(1), y = !0)), typeof o == "function" && m) {
      if (v) {
        const O = c.sourceAnchor.clone();
        O[a] = d[a];
        const P = z(o, r, O, m, r.sourceMagnet || m.container, "source", r, this);
        this.resetAnchor("source", P);
      }
      y && this.resetAnchor("source", c.sourceAnchorDef);
    }
    const x = r.targetView, E = r.targetBBox;
    let S = !1, C = !1;
    if (p ? l === f.length - 2 ? E.containsPoint(p) ? (f.pop(), S = !0) : (p[a] = d[a], C = !0) : p[a] = d[a] : (p = r.targetAnchor.toJSON(), p[a] = d[a], E.containsPoint(p) ? S = !0 : (f.push(p), C = !0)), typeof o == "function" && x) {
      if (S) {
        const O = c.targetAnchor.clone();
        O[a] = d[a];
        const P = z(o, r, O, x, r.targetMagnet || x.container, "target", r, this);
        this.resetAnchor("target", P);
      }
      C && this.resetAnchor("target", c.targetAnchorDef);
    }
    w.equalPoints(f, this.vertices) || this.cellView.cell.setVertices(f, { ui: !0, toolId: this.cid }), this.updateHandle(t, g, p, 0), s.stopPropagation || r.notifyMouseMove(h, u.x, u.y);
  }
  onHandleChange({ handle: t, e }) {
    const n = this.options, s = this.handles, r = this.cellView, o = t.options.index;
    if (Array.isArray(s)) {
      for (let a = 0, l = s.length; a < l; a += 1)
        a !== o && s[a].hide();
      if (this.focus(), this.setEventData(e, {
        sourceAnchor: r.sourceAnchor.clone(),
        targetAnchor: r.targetAnchor.clone(),
        sourceAnchorDef: gt(this.cell.prop(["source", "anchor"])),
        targetAnchorDef: gt(this.cell.prop(["target", "anchor"]))
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
        const h = l.getCenter(), u = o ? "x" : "y";
        h[u] += s || 0;
        const d = l.vector().vectorAngle(new w(1, 0));
        t.updatePosition(h.x, h.y, d, this.cellView), t.show(), t.options.axis = u;
      }
    } else
      t.hide();
  }
  onRemove() {
    this.resetHandles();
  }
}
(function(i) {
  class t extends it {
    constructor(n) {
      super(), this.options = n, this.render(), this.delegateEvents({
        mousedown: "onMouseDown",
        touchstart: "onMouseDown"
      });
    }
    render() {
      this.container = it.createElement("rect", !0);
      const n = this.options.attrs;
      if (typeof n == "function") {
        const s = i.getDefaults();
        this.setAttrs(Object.assign(Object.assign({}, s.attrs), n(this)));
      } else
        this.setAttrs(n);
      this.addClass(this.prefixClassName("edge-tool-segment"));
    }
    updatePosition(n, s, r, o) {
      const a = o.getClosestPoint(new w(n, s)) || new w(n, s);
      let l = $t().translate(a.x, a.y);
      if (a.equals({ x: n, y: s }))
        l = l.rotate(r);
      else {
        let h = new D(n, s, a.x, a.y).vector().vectorAngle(new w(1, 0));
        h !== 0 && (h += 90), l = l.rotate(h);
      }
      this.setAttrs({
        transform: qn(l),
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
})(vi || (vi = {}));
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
    anchor: bh
  });
})(vi || (vi = {}));
class is extends Lt.ToolItem {
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
      let c, h, u;
      r.isEdgeElement(a) ? (c = r.getBBox(), h = 0, u = c.getCenter()) : (c = r.getUnrotatedBBoxOfElement(a), h = o.getAngle(), u = c.getCenter(), h && u.rotate(-h, o.getBBox().getCenter())), c.inflate(l), et(e, {
        x: -c.width / 2,
        y: -c.height / 2,
        width: c.width,
        height: c.height,
        transform: `translate(${u.x}, ${u.y}) rotate(${h})`
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
      l = w.create(d);
    }
    if (this.options.restrictArea)
      if (s.isEdgeElement(a)) {
        const d = s.getClosestPoint(l);
        d && (l = d);
      } else {
        const d = s.getUnrotatedBBoxOfElement(a), f = o.getAngle(), g = o.getBBox().getCenter(), p = l.clone().rotate(f, g);
        d.containsPoint(p) || (l = d.getNearestPointToPoint(p).rotate(-f, g));
      }
    let h;
    const u = this.options.anchor;
    typeof u == "function" && (h = z(u, n, l, s, a, e, n, this)), this.resetAnchor(h), this.update();
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
    anchor: bh,
    snap(t, e, n, s, r, o) {
      const a = o.options.snapRadius || 0, l = s === "source", c = l ? 0 : -1, h = this.cell.getVertexAt(c) || this.getTerminalAnchor(l ? "target" : "source");
      return h && (Math.abs(h.x - t.x) < a && (t.x = h.x), Math.abs(h.y - t.y) < a && (t.y = h.y)), t;
    }
  });
})(is || (is = {}));
const lx = is.define({
  name: "source-anchor",
  type: "source"
}), cx = is.define({
  name: "target-anchor",
  type: "target"
});
var hx = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
};
class ss extends Lt.ToolItem {
  get type() {
    return this.options.type;
  }
  get ratio() {
    return this.options.ratio;
  }
  init() {
    if (this.options.attrs) {
      const t = this.options.attrs, { class: e } = t, n = hx(t, ["class"]);
      this.setAttrs(n, this.container), e && U(this.container, e);
    }
  }
  onRender() {
    U(this.container, this.prefixClassName(`edge-tool-${this.type}-arrowhead`)), this.update();
  }
  update() {
    const t = this.ratio, e = this.cellView, n = e.getTangentAtRatio(t), s = n ? n.start : e.getPointAtRatio(t), r = n && n.vector().vectorAngle(new w(1, 0)) || 0;
    if (!s)
      return this;
    const o = $t().translate(s.x, s.y).rotate(r);
    return En(this.container, o, { absolute: !0 }), this;
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
})(ss || (ss = {}));
const ux = ss.define({
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
}), dx = ss.define({
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
class An extends Lt.ToolItem {
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
    this.editor = Lt.createElement("div", !1), this.addClass(t, this.editor), this.editor.contentEditable = "true", this.container.appendChild(this.editor);
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
    let s = w.create(), r = 20, o = "", { x: a, y: l } = this.options;
    const { width: c, height: h } = this.options;
    if (typeof a < "u" && typeof l < "u") {
      const f = e.getBBox();
      a = ue(a, f.width), l = ue(l, f.height), s = f.topLeft.translate(a, l), r = f.width - a * 2;
    } else {
      const f = e.getBBox();
      s = f.center, r = f.width - 4, o = "translate(-50%, -50%)";
    }
    const u = t.scale(), { style: d } = n;
    s = t.localToGraph(s), d.left = `${s.x}px`, d.top = `${s.y}px`, d.transform = `scale(${u.sx}, ${u.sy}) ${o}`, d.minWidth = `${r}px`, typeof c == "number" && (d.width = `${c}px`), typeof h == "number" && (d.height = `${h}px`);
  }
  updateEdgeEditorTransform() {
    if (!this.event)
      return;
    const { graph: t, editor: e } = this;
    if (!e)
      return;
    let n = w.create(), s = 20;
    const { style: r } = e, o = this.event.target, a = o.parentElement;
    if (a && Hn(a, this.prefixClassName("edge-label"))) {
      const h = a.getAttribute("data-index") || "0";
      this.labelIndex = parseInt(h, 10);
      const u = a.getAttribute("transform"), { translation: d } = Os(u);
      n = new w(d.tx, d.ty), s = at.getBBox(o).width;
    } else {
      if (!this.options.labelAddable)
        return this;
      n = t.clientToLocal(w.create(this.event.clientX, this.event.clientY));
      const u = this.cellView.path.closestPointLength(n);
      this.distance = u, this.labelIndex = -1;
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
            Gn(s, `attrs/${e}`, t), n.appendLabel(s);
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
})(An || (An = {}));
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
})(An || (An = {}));
var vh = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
}, Mn;
(function(i) {
  i.presets = {
    boundary: ns,
    button: Ge,
    "button-remove": Ge.Remove,
    "node-editor": An.NodeEditor
  }, i.registry = Mt.create({
    type: "node tool",
    process(t, e) {
      if (typeof e == "function")
        return e;
      let n = Lt.ToolItem;
      const { inherit: s } = e, r = vh(e, ["inherit"]);
      if (s) {
        const o = this.get(s);
        o == null ? this.onNotFound(s, "inherited") : n = o;
      }
      return r.name == null && (r.name = t), n.define.call(n, r);
    }
  }), i.registry.register(i.presets, !0);
})(Mn || (Mn = {}));
var Tn;
(function(i) {
  i.presets = {
    boundary: ns,
    vertices: yi,
    segments: vi,
    button: Ge,
    "button-remove": Ge.Remove,
    "source-anchor": lx,
    "target-anchor": cx,
    "source-arrowhead": ux,
    "target-arrowhead": dx,
    "edge-editor": An.EdgeEditor
  }, i.registry = Mt.create({
    type: "edge tool",
    process(t, e) {
      if (typeof e == "function")
        return e;
      let n = Lt.ToolItem;
      const { inherit: s } = e, r = vh(e, ["inherit"]);
      if (s) {
        const o = this.get(s);
        o == null ? this.onNotFound(s, "inherited") : n = o;
      }
      return r.name == null && (r.name = t), n.define.call(n, r);
    }
  }), i.registry.register(i.presets, !0);
})(Tn || (Tn = {}));
const fx = je("center"), gx = je("topCenter"), px = je("bottomCenter"), mx = je("leftMiddle"), bx = je("rightMiddle"), yx = je("topLeft"), vx = je("topRight"), wx = je("bottomLeft"), xx = je("bottomRight");
function je(i) {
  return function(t, e, n, s = {}) {
    let r;
    t.cell.visible ? r = s.rotate ? t.getUnrotatedBBoxOfElement(e) : t.getBBoxOfElement(e) : r = t.cell.getBBox();
    const o = r[i];
    o.x += ue(s.dx, r.width), o.y += ue(s.dy, r.height);
    const a = t.cell;
    return s.rotate ? o.rotate(-a.getAngle(), a.getBBox().getCenter()) : o;
  };
}
function Ls(i) {
  return function(t, e, n, s) {
    if (n instanceof Element) {
      const r = this.graph.findViewByElem(n);
      let o;
      if (r)
        if (r.isEdgeElement(n)) {
          const a = s.fixedAt != null ? s.fixedAt : "50%";
          o = wh(r, a);
        } else
          o = r.getBBoxOfElement(n).getCenter();
      else
        o = new w();
      return i.call(this, t, e, o, s);
    }
    return i.apply(this, arguments);
  };
}
function wh(i, t) {
  const e = Te(t), n = typeof t == "string" ? parseFloat(t) : t;
  return e ? i.getPointAtRatio(n / 100) : i.getPointAtLength(n);
}
const Ex = function(i, t, e, n) {
  const s = ct.normalize(i.cell.getAngle()), r = i.cell.visible ? i.getBBoxOfElement(t) : i.cell.getBBox(), o = r.getCenter(), a = r.getTopLeft(), l = r.getBottomRight();
  let c = n.padding;
  if (Number.isFinite(c) || (c = 0), a.y + c <= e.y && e.y <= l.y - c) {
    const h = e.y - o.y;
    o.x += s === 0 || s === 180 ? 0 : h * 1 / Math.tan(ct.toRad(s)), o.y += h;
  } else if (a.x + c <= e.x && e.x <= l.x - c) {
    const h = e.x - o.x;
    o.y += s === 90 || s === 270 ? 0 : h * Math.tan(ct.toRad(s)), o.x += h;
  }
  return o;
}, Cx = Ls(Ex), Sx = function(i, t, e, n, s) {
  const r = i.cell.getConnectionPoint(this.cell, s);
  return (n.dx || n.dy) && r.translate(n.dx || 0, n.dy || 0), r;
}, Ox = function(i, t, e, n) {
  let s, r = 0, o;
  const a = i.cell;
  n.rotate ? (s = i.getUnrotatedBBoxOfElement(t), o = a.getBBox().getCenter(), r = a.getAngle()) : a.visible ? s = i.getBBoxOfElement(t) : s = i.cell.getBBox();
  const l = n.padding;
  l != null && Number.isFinite(l) && s.inflate(l), n.rotate && e.rotate(r, o);
  const c = s.getNearestSideToPoint(e);
  let h;
  switch (c) {
    case "left":
      h = s.getLeftMiddle();
      break;
    case "right":
      h = s.getRightMiddle();
      break;
    case "top":
      h = s.getTopCenter();
      break;
    case "bottom":
      h = s.getBottomCenter();
      break;
  }
  const u = n.direction;
  return u === "H" ? (c === "top" || c === "bottom") && (e.x <= s.x + s.width ? h = s.getLeftMiddle() : h = s.getRightMiddle()) : u === "V" && (e.y <= s.y + s.height ? h = s.getTopCenter() : h = s.getBottomCenter()), n.rotate ? h.rotate(-r, o) : h;
}, Px = Ls(Ox), Ax = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  bottom: px,
  bottomLeft: wx,
  bottomRight: xx,
  center: fx,
  left: mx,
  midSide: Px,
  nodeCenter: Sx,
  orth: Cx,
  right: bx,
  top: gx,
  topLeft: yx,
  topRight: vx
}, Symbol.toStringTag, { value: "Module" }));
var Nn;
(function(i) {
  i.presets = Ax, i.registry = Mt.create({
    type: "node endpoint"
  }), i.registry.register(i.presets, !0);
})(Nn || (Nn = {}));
const Mx = function(i, t, e, n) {
  let s = n.ratio != null ? n.ratio : 0.5;
  return s > 1 && (s /= 100), i.getPointAtRatio(s);
}, Tx = function(i, t, e, n) {
  const s = n.length != null ? n.length : 20;
  return i.getPointAtLength(s);
}, xh = function(i, t, e, n) {
  const s = i.getClosestPoint(e);
  return s ?? new w();
}, Nx = Ls(xh), Lx = function(i, t, e, n) {
  const r = i.getConnection(), o = i.getConnectionSubdivisions(), a = new D(e.clone().translate(0, 1e6), e.clone().translate(0, -1e6)), l = new D(e.clone().translate(1e6, 0), e.clone().translate(-1e6, 0)), c = a.intersect(r, {
    segmentSubdivisions: o
  }), h = l.intersect(r, {
    segmentSubdivisions: o
  }), u = [];
  return c && u.push(...c), h && u.push(...h), u.length > 0 ? e.closest(u) : n.fallbackAt != null ? wh(i, n.fallbackAt) : z(xh, this, i, t, e, n);
}, Ix = Ls(Lx), jx = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  closest: Nx,
  length: Tx,
  orth: Ix,
  ratio: Mx
}, Symbol.toStringTag, { value: "Module" }));
var Ln;
(function(i) {
  i.presets = jx, i.registry = Mt.create({
    type: "edge endpoint"
  }), i.registry.register(i.presets, !0);
})(Ln || (Ln = {}));
function Is(i, t, e) {
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
function rs(i) {
  const t = i.getAttribute("stroke-width");
  return t === null ? 0 : parseFloat(t) || 0;
}
function kx(i) {
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
const Eh = function(i, t, e, n) {
  const s = t.getBBoxOfElement(e);
  n.stroked && s.inflate(rs(e) / 2);
  const r = i.intersect(s), o = r && r.length ? i.start.closest(r) : i.end;
  return Is(o, i.start, n.offset);
}, Rx = function(i, t, e, n, s) {
  const r = t.cell, o = r.isNode() ? r.getAngle() : 0;
  if (o === 0)
    return z(Eh, this, i, t, e, n, s);
  const a = t.getUnrotatedBBoxOfElement(e);
  n.stroked && a.inflate(rs(e) / 2);
  const l = a.getCenter(), c = i.clone().rotate(o, l), h = c.setLength(1e6).intersect(a), u = h && h.length ? c.start.closest(h).rotate(-o, l) : i.end;
  return Is(u, i.start, n.offset);
}, Dx = function(i, t, e, n) {
  let s, r;
  const o = i.end, a = n.selector;
  if (typeof a == "string" ? s = t.findOne(a) : Array.isArray(a) ? s = Fr(e, a) : s = kx(e), !Be(s)) {
    if (s === e || !Be(e))
      return o;
    s = e;
  }
  const l = t.getShapeOfElement(s), c = t.getMatrixOfElement(s), h = t.getRootTranslatedMatrix(), u = t.getRootRotatedMatrix(), d = h.multiply(u).multiply(c), f = d.inverse(), g = at.transformLine(i, f), p = g.start.clone(), m = t.getDataOfElement(s);
  if (n.insideout === !1) {
    m.shapeBBox == null && (m.shapeBBox = l.bbox());
    const x = m.shapeBBox;
    if (x != null && x.containsPoint(p))
      return o;
  }
  n.extrapolate === !0 && g.setLength(1e6);
  let b;
  if (B.isPath(l)) {
    const x = n.precision || 2;
    m.segmentSubdivisions == null && (m.segmentSubdivisions = l.getSegmentSubdivisions({
      precision: x
    })), b = {
      precision: x,
      segmentSubdivisions: m.segmentSubdivisions
    }, r = g.intersect(l, b);
  } else
    r = g.intersect(l);
  r ? Array.isArray(r) && (r = p.closest(r)) : n.sticky === !0 && (R.isRectangle(l) ? r = l.getNearestPointToPoint(p) : fe.isEllipse(l) ? r = l.intersectsWithLineFromCenterToPoint(p) : r = l.closestPoint(p, b));
  const v = r ? at.transformPoint(r, d) : o;
  let y = n.offset || 0;
  return n.stroked !== !1 && (typeof y == "object" ? (y = Object.assign({}, y), y.x == null && (y.x = 0), y.x += rs(s) / 2) : y += rs(s) / 2), Is(v, i.start, y);
};
function $x(i, t, e = 0) {
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
const _x = function(i, t, e, n) {
  const { alignOffset: s, align: r } = n;
  return r && $x(i, r, s), Is(i.end, i.start, n.offset);
}, Bx = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  anchor: _x,
  bbox: Eh,
  boundary: Dx,
  rect: Rx
}, Symbol.toStringTag, { value: "Module" }));
var In;
(function(i) {
  i.presets = Bx, i.registry = Mt.create({
    type: "connection point"
  }), i.registry.register(i.presets, !0);
})(In || (In = {}));
const zx = function(i) {
  return [...i];
}, Vx = function(i, t, e) {
  const n = t.side || "bottom", s = nn(t.padding || 40), r = e.sourceBBox, o = e.targetBBox, a = r.getCenter(), l = o.getCenter();
  let c, h, u;
  switch (n) {
    case "top":
      u = -1, c = "y", h = "height";
      break;
    case "left":
      u = -1, c = "x", h = "width";
      break;
    case "right":
      u = 1, c = "x", h = "width";
      break;
    case "bottom":
    default:
      u = 1, c = "y", h = "height";
      break;
  }
  return a[c] += u * (r[h] / 2 + s[n]), l[c] += u * (o[h] / 2 + s[n]), u * (a[c] - l[c]) > 0 ? l[c] = a[c] : a[c] = l[c], [a.toJSON(), ...i, l.toJSON()];
};
function Bi(i) {
  return new R(i.x, i.y, 0, 0);
}
function os(i = {}) {
  const t = nn(i.padding || 20);
  return {
    x: -t.left,
    y: -t.top,
    width: t.left + t.right,
    height: t.top + t.bottom
  };
}
function Ch(i, t = {}) {
  return i.sourceBBox.clone().moveAndExpand(os(t));
}
function Sh(i, t = {}) {
  return i.targetBBox.clone().moveAndExpand(os(t));
}
function Fx(i, t = {}) {
  return i.sourceAnchor ? i.sourceAnchor : Ch(i, t).getCenter();
}
function Gx(i, t = {}) {
  return i.targetAnchor ? i.targetAnchor : Sh(i, t).getCenter();
}
const Oh = function(i, t, e) {
  let n = Ch(e, t), s = Sh(e, t);
  const r = Fx(e, t), o = Gx(e, t);
  n = n.union(Bi(r)), s = s.union(Bi(o));
  const a = i.map((h) => w.create(h));
  a.unshift(r), a.push(o);
  let l = null;
  const c = [];
  for (let h = 0, u = a.length - 1; h < u; h += 1) {
    let d = null;
    const f = a[h], g = a[h + 1], p = te.getBearing(f, g) != null;
    if (h === 0)
      h + 1 === u ? n.intersectsWithRect(s.clone().inflate(1)) ? d = te.insideNode(f, g, n, s) : p || (d = te.nodeToNode(f, g, n, s)) : n.containsPoint(g) ? d = te.insideNode(f, g, n, Bi(g).moveAndExpand(os(t))) : p || (d = te.nodeToVertex(f, g, n));
    else if (h + 1 === u) {
      const m = p && te.getBearing(g, f) === l;
      s.containsPoint(f) || m ? d = te.insideNode(f, g, Bi(f).moveAndExpand(os(t)), s, l) : p || (d = te.vertexToNode(f, g, s, l));
    } else p || (d = te.vertexToVertex(f, g, l));
    d ? (c.push(...d.points), l = d.direction) : l = te.getBearing(f, g), h + 1 < u && c.push(g);
  }
  return c;
};
var te;
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
  function n(u, d, f) {
    let g = new w(u.x, d.y);
    return f.containsPoint(g) && (g = new w(d.x, u.y)), g;
  }
  function s(u, d) {
    return u[d === "W" || d === "E" ? "width" : "height"];
  }
  i.getBBoxSize = s;
  function r(u, d) {
    return u.x === d.x ? u.y > d.y ? "N" : "S" : u.y === d.y ? u.x > d.x ? "W" : "E" : null;
  }
  i.getBearing = r;
  function o(u, d, f) {
    const g = new w(u.x, d.y), p = new w(d.x, u.y), m = r(u, g), b = r(u, p), v = f ? t[f] : null, y = m === f || m !== v && (b === v || b !== f) ? g : p;
    return { points: [y], direction: r(y, d) };
  }
  i.vertexToVertex = o;
  function a(u, d, f) {
    const g = n(u, d, f);
    return { points: [g], direction: r(g, d) };
  }
  i.nodeToVertex = a;
  function l(u, d, f, g) {
    const p = [new w(u.x, d.y), new w(d.x, u.y)], m = p.filter((y) => !f.containsPoint(y)), b = m.filter((y) => r(y, u) !== g);
    let v;
    if (b.length > 0)
      return v = b.filter((y) => r(u, y) === g).pop(), v = v || b[0], {
        points: [v],
        direction: r(v, d)
      };
    {
      v = sy(p, m)[0];
      const y = w.create(d).move(v, -s(f, g) / 2);
      return {
        points: [n(y, u, f), y],
        direction: r(y, d)
      };
    }
  }
  i.vertexToNode = l;
  function c(u, d, f, g) {
    let p = a(d, u, g);
    const m = p.points[0];
    if (f.containsPoint(m)) {
      p = a(u, d, f);
      const b = p.points[0];
      if (g.containsPoint(b)) {
        const v = w.create(u).move(b, -s(f, r(u, b)) / 2), y = w.create(d).move(m, -s(g, r(d, m)) / 2), x = new D(v, y).getCenter(), E = a(u, x, f), S = o(x, d, E.direction);
        p.points = [E.points[0], S.points[0]], p.direction = S.direction;
      }
    }
    return p;
  }
  i.nodeToNode = c;
  function h(u, d, f, g, p) {
    const m = f.union(g).inflate(1), b = m.getCenter(), v = b.distance(d) > b.distance(u), y = v ? d : u, x = v ? u : d;
    let E, S, C;
    p ? (E = w.fromPolar(m.width + m.height, e[p], y), E = m.getNearestPointToPoint(E).move(E, -1)) : E = m.getNearestPointToPoint(y).move(y, 1), S = n(E, x, m);
    let O;
    E.round().equals(S.round()) ? (S = w.fromPolar(m.width + m.height, ct.toRad(E.theta(y)) + Math.PI / 2, x), S = m.getNearestPointToPoint(S).move(x, 1).round(), C = n(E, S, m), O = v ? [S, C, E] : [E, C, S]) : O = v ? [S, E] : [E, S];
    const P = r(v ? E : S, d);
    return {
      points: O,
      direction: P
    };
  }
  i.insideNode = h;
})(te || (te = {}));
const Hx = {
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
    return Re(this.step, this);
  },
  directions() {
    const i = Re(this.step, this), t = Re(this.cost, this);
    return [
      { cost: t, offsetX: i, offsetY: 0 },
      { cost: t, offsetX: -i, offsetY: 0 },
      { cost: t, offsetX: 0, offsetY: i },
      { cost: t, offsetX: 0, offsetY: -i }
    ];
  },
  penalties() {
    const i = Re(this.step, this);
    return {
      0: 0,
      45: i / 2,
      90: i / 2
    };
  },
  paddingBox() {
    const i = Re(this.step, this);
    return {
      x: -i,
      y: -i,
      width: 2 * i,
      height: 2 * i
    };
  },
  fallbackRouter: Oh,
  draggingRouter: null,
  snapToGrid: !0
};
function Re(i, t) {
  return typeof i == "function" ? i.call(t) : i;
}
function qx(i) {
  const t = Object.keys(i).reduce((e, n) => {
    const s = e;
    return n === "fallbackRouter" || n === "draggingRouter" || n === "fallbackRoute" ? s[n] = i[n] : s[n] = Re(i[n], i), e;
  }, {});
  if (t.padding) {
    const e = nn(t.padding);
    t.paddingBox = {
      x: -e.left,
      y: -e.top,
      width: e.left + e.right,
      height: e.top + e.bottom
    };
  }
  return t.directions.forEach((e) => {
    const n = new w(0, 0), s = new w(e.offsetX, e.offsetY);
    e.angle = ct.normalize(n.theta(s));
  }), t;
}
const wa = 1, xa = 2;
class Ux {
  constructor() {
    this.items = [], this.hash = {}, this.values = {};
  }
  add(t, e) {
    this.hash[t] ? this.items.splice(this.items.indexOf(t), 1) : this.hash[t] = wa, this.values[t] = e;
    const n = Ry(this.items, t, (s) => this.values[s]);
    this.items.splice(n, 0, t);
  }
  pop() {
    const t = this.items.shift();
    return t && (this.hash[t] = xa), t;
  }
  isOpen(t) {
    return this.hash[t] === wa;
  }
  isClose(t) {
    return this.hash[t] === xa;
  }
  isEmpty() {
    return this.items.length === 0;
  }
}
class Wx {
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
    const n = this.options, s = n.excludeTerminals.reduce((c, h) => {
      const u = e[h];
      if (u) {
        const d = t.getCell(u.cell);
        d && c.push(d);
      }
      return c;
    }, []);
    let r = [];
    const o = t.getCell(e.getSourceCellId());
    o && (r = na(r, o.getAncestors().map((c) => c.id)));
    const a = t.getCell(e.getTargetCellId());
    a && (r = na(r, a.getAncestors().map((c) => c.id)));
    const l = this.mapGridSize;
    return t.getNodes().reduce((c, h) => {
      const u = s.some((m) => m.id === h.id), d = h.shape ? n.excludeShapes.includes(h.shape) : !1, f = n.excludeNodes.some((m) => typeof m == "string" ? h.id === m : m === h), g = r.includes(h.id), p = d || u || f || g;
      if (h.isVisible() && !p) {
        const m = h.getBBox().moveAndExpand(n.paddingBox), b = m.getOrigin().snapToGrid(l), v = m.getCorner().snapToGrid(l);
        for (let y = b.x; y <= v.x; y += l)
          for (let x = b.y; x <= v.y; x += l) {
            const E = new w(y, x).toString();
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
function Ph(i, t) {
  const e = i.sourceBBox.clone();
  return t && t.paddingBox ? e.moveAndExpand(t.paddingBox) : e;
}
function Ah(i, t) {
  const e = i.targetBBox.clone();
  return t && t.paddingBox ? e.moveAndExpand(t.paddingBox) : e;
}
function Mh(i, t) {
  return i.sourceAnchor ? i.sourceAnchor : Ph(i, t).getCenter();
}
function Xx(i, t) {
  return i.targetAnchor ? i.targetAnchor : Ah(i, t).getCenter();
}
function Ws(i, t, e, n, s) {
  const r = 360 / e, o = i.theta(Yx(i, t, n, s)), a = ct.normalize(o + r / 2);
  return r * Math.floor(a / r);
}
function Yx(i, t, e, n) {
  const s = n.step, r = t.x - i.x, o = t.y - i.y, a = r / e.x, l = o / e.y, c = a * s, h = l * s;
  return new w(i.x + c, i.y + h);
}
function Ea(i, t) {
  const e = Math.abs(i - t);
  return e > 180 ? 360 - e : e;
}
function Jx(i, t) {
  const e = t.step;
  return t.directions.forEach((n) => {
    n.gridOffsetX = n.offsetX / e * i.x, n.gridOffsetY = n.offsetY / e * i.y;
  }), t.directions;
}
function Kx(i, t, e) {
  return {
    source: t.clone(),
    x: Ca(e.x - t.x, i),
    y: Ca(e.y - t.y, i)
  };
}
function Ca(i, t) {
  if (!i)
    return t;
  const e = Math.abs(i), n = Math.round(e / t);
  if (!n)
    return e;
  const s = n * t, o = (e - s) / n;
  return t + o;
}
function Zx(i, t) {
  const e = t.source, n = lt.snapToGrid(i.x - e.x, t.x) + e.x, s = lt.snapToGrid(i.y - e.y, t.y) + e.y;
  return new w(n, s);
}
function ti(i, t) {
  return i.round(t);
}
function Hi(i, t, e) {
  return ti(Zx(i.clone(), t), e);
}
function hi(i) {
  return i.toString();
}
function Xs(i) {
  return new w(i.x === 0 ? 0 : Math.abs(i.x) / i.x, i.y === 0 ? 0 : Math.abs(i.y) / i.y);
}
function Sa(i, t) {
  let e = 1 / 0;
  for (let n = 0, s = t.length; n < s; n += 1) {
    const r = i.manhattanDistance(t[n]);
    r < e && (e = r);
  }
  return e;
}
function Oa(i, t, e, n, s) {
  const r = s.precision, o = s.directionMap, a = i.diff(t.getCenter()), l = Object.keys(o).reduce((c, h) => {
    if (e.includes(h)) {
      const u = o[h], d = new w(i.x + u.x * (Math.abs(a.x) + t.width), i.y + u.y * (Math.abs(a.y) + t.height)), g = new D(i, d).intersect(t) || [];
      let p, m = null;
      for (let b = 0; b < g.length; b += 1) {
        const v = g[b], y = i.squaredDistance(v);
        (p == null || y > p) && (p = y, m = v);
      }
      if (m) {
        let b = Hi(m, n, r);
        t.containsPoint(b) && (b = Hi(b.translate(u.x * n.x, u.y * n.y), n, r)), c.push(b);
      }
    }
    return c;
  }, []);
  return t.containsPoint(i) || l.push(Hi(i, n, r)), l;
}
function Qx(i, t, e, n, s) {
  const r = [];
  let o = Xs(s.diff(e)), a = hi(e), l = i[a], c;
  for (; l; ) {
    c = t[a];
    const d = Xs(c.diff(l));
    d.equals(o) || (r.unshift(c), o = d), a = hi(l), l = i[a];
  }
  const h = t[a];
  return Xs(h.diff(n)).equals(o) || r.unshift(h), r;
}
function t1(i, t, e, n, s) {
  const r = s.precision;
  let o, a;
  R.isRectangle(t) ? o = ti(Mh(i, s).clone(), r) : o = ti(t.clone(), r), R.isRectangle(e) ? a = ti(Xx(i, s).clone(), r) : a = ti(e.clone(), r);
  const l = Kx(s.step, o, a), c = o, h = a;
  let u, d;
  if (R.isRectangle(t) ? u = Oa(c, t, s.startDirections, l, s) : u = [c], R.isRectangle(e) ? d = Oa(a, e, s.endDirections, l, s) : d = [h], u = u.filter((f) => n.isAccessible(f)), d = d.filter((f) => n.isAccessible(f)), u.length > 0 && d.length > 0) {
    const f = new Ux(), g = {}, p = {}, m = {};
    for (let I = 0, T = u.length; I < T; I += 1) {
      const j = u[I], H = hi(j);
      f.add(H, Sa(j, d)), g[H] = j, m[H] = 0;
    }
    const b = s.previousDirectionAngle, v = b === void 0;
    let y, x;
    const E = Jx(l, s), S = E.length, C = d.reduce((I, T) => {
      const j = hi(T);
      return I.push(j), I;
    }, []), O = w.equalPoints(u, d);
    let P = s.maxLoopCount;
    for (; !f.isEmpty() && P > 0; ) {
      const I = f.pop(), T = g[I], j = p[I], H = m[I], F = T.equals(c), A = j == null;
      let N;
      if (A ? v ? F ? N = null : N = Ws(c, T, S, l, s) : N = b : N = Ws(j, T, S, l, s), !(A && O) && C.indexOf(I) >= 0)
        return s.previousDirectionAngle = N, Qx(p, g, T, c, h);
      for (let st = 0; st < S; st += 1) {
        y = E[st];
        const Q = y.angle;
        if (x = Ea(N, Q), !(v && F) && x > s.maxDirectionChange)
          continue;
        const ut = Hi(T.clone().translate(y.gridOffsetX || 0, y.gridOffsetY || 0), l, r), $ = hi(ut);
        if (f.isClose($) || !n.isAccessible(ut))
          continue;
        if (C.indexOf($) >= 0 && !ut.equals(h)) {
          const xt = Ws(ut, h, S, l, s);
          if (Ea(Q, xt) > s.maxDirectionChange)
            continue;
        }
        const K = y.cost, tt = F ? 0 : s.penalties[x], W = H + K + tt;
        (!f.isOpen($) || W < m[$]) && (g[$] = ut, p[$] = T, m[$] = W, f.add($, W + Sa(ut, d)));
      }
      P -= 1;
    }
  }
  return s.fallbackRoute ? z(s.fallbackRoute, this, c, h, s) : null;
}
function e1(i, t = 10) {
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
const n1 = function(i, t, e) {
  const n = qx(t), s = Ph(e, n), r = Ah(e, n), o = Mh(e, n), a = new Wx(n).build(e.graph.model, e.cell), l = i.map((f) => w.create(f)), c = [];
  let h = o, u, d;
  for (let f = 0, g = l.length; f <= g; f += 1) {
    let p = null;
    if (u = d || s, d = l[f], d == null) {
      d = r;
      const b = e.cell;
      if ((b.getSourceCellId() == null || b.getTargetCellId() == null) && typeof n.draggingRouter == "function") {
        const y = u === s ? o : u, x = d.getOrigin();
        p = z(n.draggingRouter, e, y, x, n);
      }
    }
    if (p == null && (p = t1(e, u, d, a, n)), p === null)
      return console.warn("Unable to execute manhattan algorithm, use orth instead"), z(n.fallbackRouter, this, i, n, e);
    const m = p[0];
    m && m.equals(h) && p.shift(), h = p[p.length - 1] || h, c.push(...p);
  }
  return n.snapToGrid ? e1(c, e.graph.grid.getGridSize()) : c;
}, Th = function(i, t, e) {
  return z(n1, this, i, Object.assign(Object.assign({}, Hx), t), e);
}, i1 = {
  maxDirectionChange: 45,
  // an array of directions to find next points on the route
  // different from start/end directions
  directions() {
    const i = Re(this.step, this), t = Re(this.cost, this), e = Math.ceil(Math.sqrt(i * i << 1));
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
      const y = r;
      r = o, o = y;
    }
    const a = n % 90 < 45 ? r : o, l = new D(i, a), c = 90 * Math.ceil(n / 90), h = w.fromPolar(l.squaredLength(), ct.toRad(c + 135), a), u = new D(t, h), d = l.intersectsWithLine(u), f = d || t, g = d ? f : i, p = 360 / e.directions.length, m = g.theta(t), b = ct.normalize(m + p / 2), v = p * Math.floor(b / p);
    return e.previousDirectionAngle = v, f && s.push(f.round()), s.push(t), s;
  }
}, s1 = function(i, t, e) {
  return z(Th, this, i, Object.assign(Object.assign({}, i1), t), e);
}, r1 = function(i, t, e) {
  const n = t.offset || 32, s = t.min == null ? 16 : t.min;
  let r = 0, o = t.direction;
  const a = e.sourceBBox, l = e.targetBBox, c = a.getCenter(), h = l.getCenter();
  if (typeof n == "number" && (r = n), o == null) {
    let b = l.left - a.right, v = l.top - a.bottom;
    b >= 0 && v >= 0 ? o = b >= v ? "L" : "T" : b <= 0 && v >= 0 ? (b = a.left - l.right, b >= 0 ? o = b >= v ? "R" : "T" : o = "T") : b >= 0 && v <= 0 ? (v = a.top - l.bottom, v >= 0 ? o = b >= v ? "L" : "B" : o = "L") : (b = a.left - l.right, v = a.top - l.bottom, b >= 0 && v >= 0 ? o = b >= v ? "R" : "B" : b <= 0 && v >= 0 ? o = "B" : b >= 0 && v <= 0 ? o = "R" : o = Math.abs(b) > Math.abs(v) ? "R" : "B");
  }
  o === "H" ? o = h.x - c.x >= 0 ? "L" : "R" : o === "V" && (o = h.y - c.y >= 0 ? "T" : "B"), n === "center" && (o === "L" ? r = (l.left - a.right) / 2 : o === "R" ? r = (a.left - l.right) / 2 : o === "T" ? r = (l.top - a.bottom) / 2 : o === "B" && (r = (a.top - l.bottom) / 2));
  let u, d, f;
  const g = o === "L" || o === "R";
  if (g) {
    if (h.y === c.y)
      return [...i];
    f = o === "L" ? 1 : -1, u = "x", d = "width";
  } else {
    if (h.x === c.x)
      return [...i];
    f = o === "T" ? 1 : -1, u = "y", d = "height";
  }
  const p = c.clone(), m = h.clone();
  if (p[u] += f * (a[d] / 2 + r), m[u] -= f * (l[d] / 2 + r), g) {
    const b = p.x, v = m.x, y = a.width / 2 + s, x = l.width / 2 + s;
    h.x > c.x ? v <= b && (p.x = Math.max(v, c.x + y), m.x = Math.min(b, h.x - x)) : v >= b && (p.x = Math.min(v, c.x - y), m.x = Math.max(b, h.x + x));
  } else {
    const b = p.y, v = m.y, y = a.height / 2 + s, x = l.height / 2 + s;
    h.y > c.y ? v <= b && (p.y = Math.max(v, c.y + y), m.y = Math.min(b, h.y - x)) : v >= b && (p.y = Math.min(v, c.y - y), m.y = Math.max(b, h.y + x));
  }
  return [p.toJSON(), ...i, m.toJSON()];
};
function fn(i, t) {
  if (t != null && t !== !1) {
    const e = typeof t == "boolean" ? 0 : t;
    if (e > 0) {
      const n = w.create(i[1]).move(i[2], e), s = w.create(i[1]).move(i[0], e);
      return [n.toJSON(), ...i, s.toJSON()];
    }
    {
      const n = i[1];
      return [Object.assign({}, n), ...i, Object.assign({}, n)];
    }
  }
  return i;
}
const o1 = function(i, t, e) {
  const n = t.width || 50, r = (t.height || 80) / 2, o = t.angle || "auto", a = e.sourceAnchor, l = e.targetAnchor, c = e.sourceBBox, h = e.targetBBox;
  if (a.equals(l)) {
    const u = (b) => {
      const v = ct.toRad(b), y = Math.sin(v), x = Math.cos(v), E = new w(a.x + x * n, a.y + y * n), S = new w(E.x - x * r, E.y - y * r), C = S.clone().rotate(-90, E), O = S.clone().rotate(90, E);
      return [C.toJSON(), E.toJSON(), O.toJSON()];
    }, d = (b) => {
      const v = a.clone().move(b, -1), y = new D(v, b);
      return !c.containsPoint(b) && !c.intersectsWithLine(y);
    }, f = [0, 90, 180, 270, 45, 135, 225, 315];
    if (typeof o == "number")
      return fn(u(o), t.merge);
    const g = c.getCenter();
    if (g.equals(a))
      return fn(u(0), t.merge);
    const p = g.angleBetween(a, g.clone().translate(1, 0));
    let m = u(p);
    if (d(m[1]))
      return fn(m, t.merge);
    for (let b = 1, v = f.length; b < v; b += 1)
      if (m = u(p + f[b]), d(m[1]))
        return fn(m, t.merge);
    return fn(m, t.merge);
  }
  {
    const u = new D(a, l);
    let d = u.parallel(-n), f = d.getCenter(), g = d.start.clone().move(d.end, r), p = d.end.clone().move(d.start, r);
    const m = u.parallel(-1), b = new D(m.start, f), v = new D(m.end, f);
    if ((c.containsPoint(f) || h.containsPoint(f) || c.intersectsWithLine(b) || c.intersectsWithLine(v) || h.intersectsWithLine(b) || h.intersectsWithLine(v)) && (d = u.parallel(n), f = d.getCenter(), g = d.start.clone().move(d.end, r), p = d.end.clone().move(d.start, r)), t.merge) {
      const y = new D(a, l), x = new D(f, y.center).setLength(Number.MAX_SAFE_INTEGER), E = c.intersectsWithLine(x), S = h.intersectsWithLine(x), C = E ? Array.isArray(E) ? E : [E] : [];
      S && (Array.isArray(S) ? C.push(...S) : C.push(S));
      const O = y.center.closest(C);
      O ? (e.sourceAnchor = O.clone(), e.targetAnchor = O.clone()) : (e.sourceAnchor = y.center.clone(), e.targetAnchor = y.center.clone());
    }
    return fn([g.toJSON(), f.toJSON(), p.toJSON()], t.merge);
  }
}, a1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  er: r1,
  loop: o1,
  manhattan: Th,
  metro: s1,
  normal: zx,
  oneSide: Vx,
  orth: Oh
}, Symbol.toStringTag, { value: "Module" }));
var $e;
(function(i) {
  i.presets = a1, i.registry = Mt.create({
    type: "router"
  }), i.registry.register(i.presets, !0);
})($e || ($e = {}));
const l1 = function(i, t, e, n = {}) {
  const s = [i, ...e, t], r = new Ot(s), o = new B(r);
  return n.raw ? o : o.serialize();
}, c1 = function(i, t, e, n = {}) {
  const s = e.length === 3 ? 0 : 1, r = w.create(e[0 + s]), o = w.create(e[2 + s]), a = w.create(e[1 + s]);
  if (!w.equals(i, t)) {
    const c = new w((i.x + t.x) / 2, (i.y + t.y) / 2), h = c.angleBetween(w.create(i).rotate(90, c), a);
    h > 1 && (r.rotate(180 - h, c), o.rotate(180 - h, c), a.rotate(180 - h, c));
  }
  const l = `
     M ${i.x} ${i.y}
     Q ${r.x} ${r.y} ${a.x} ${a.y}
     Q ${o.x} ${o.y} ${t.x} ${t.y}
  `;
  return n.raw ? B.parse(l) : l;
}, h1 = function(i, t, e, n = {}) {
  const s = new B();
  s.appendSegment(B.createSegment("M", i));
  const r = 1 / 3, o = 2 / 3, a = n.radius || 10;
  let l, c;
  for (let h = 0, u = e.length; h < u; h += 1) {
    const d = w.create(e[h]), f = e[h - 1] || i, g = e[h + 1] || t;
    l = c || d.distance(f) / 2, c = d.distance(g) / 2;
    const p = -Math.min(a, l), m = -Math.min(a, c), b = d.clone().move(f, p).round(), v = d.clone().move(g, m).round(), y = new w(r * b.x + o * d.x, o * d.y + r * b.y), x = new w(r * v.x + o * d.x, o * d.y + r * v.y);
    s.appendSegment(B.createSegment("L", b)), s.appendSegment(B.createSegment("C", y, x, v));
  }
  return s.appendSegment(B.createSegment("L", t)), n.raw ? s : s.serialize();
}, u1 = function(i, t, e, n = {}) {
  let s, r = n.direction;
  if (e && e.length !== 0) {
    const o = [i, ...e, t], a = yt.throughPoints(o);
    s = new B(a);
  } else if (s = new B(), s.appendSegment(B.createSegment("M", i)), r || (r = Math.abs(i.x - t.x) >= Math.abs(i.y - t.y) ? "H" : "V"), r === "H") {
    const o = (i.x + t.x) / 2;
    s.appendSegment(B.createSegment("C", o, i.y, o, t.y, t.x, t.y));
  } else {
    const o = (i.y + t.y) / 2;
    s.appendSegment(B.createSegment("C", i.x, o, t.x, o, t.x, t.y));
  }
  return n.raw ? s : s.serialize();
}, Pa = 1, zi = 1 / 3, Vi = 2 / 3;
function d1(i) {
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
function Ys(i, t, e = []) {
  const n = [i, ...e, t], s = [];
  return n.forEach((r, o) => {
    const a = n[o + 1];
    a != null && s.push(new D(r, a));
  }), s;
}
function f1(i, t) {
  const e = [];
  return t.forEach((n) => {
    const s = i.intersectsWithLine(n);
    if (s) {
      const { x: r, y: o } = s, { start: a, end: l } = n, c = Math.round(a.x) === Math.round(r) && Math.round(a.y) === Math.round(o), h = Math.round(l.x) === Math.round(r) && Math.round(l.y) === Math.round(o);
      if (c || h)
        return;
      e.push(s);
    }
  }), e;
}
function Aa(i, t) {
  return new D(i, t).squaredLength();
}
function g1(i, t, e) {
  return t.reduce((n, s, r) => {
    if (as.includes(s))
      return n;
    const o = n.pop() || i, a = w.create(s).move(o.start, -e);
    let l = w.create(s).move(o.start, +e);
    const c = t[r + 1];
    if (c != null) {
      const d = l.distance(c);
      d <= e && (l = c.move(o.start, d), as.push(c));
    } else if (a.distance(o.end) < e * 2 + Pa)
      return n.push(o), n;
    if (l.distance(o.start) < e * 2 + Pa)
      return n.push(o), n;
    const u = new D(a, l);
    return wi.push(u), n.push(new D(o.start, a), u, new D(l, o.end)), n;
  }, []);
}
function Ma(i, t, e, n) {
  const s = new B();
  let r;
  return r = B.createSegment("M", i[0].start), s.appendSegment(r), i.forEach((o, a) => {
    if (wi.includes(o)) {
      let l, c, h, u;
      if (e === "arc") {
        l = -90, c = o.start.diff(o.end), (c.x < 0 || c.x === 0 && c.y < 0) && (l += 180);
        const f = o.getCenter(), g = new D(f, o.end).rotate(l, f);
        let p;
        p = new D(o.start, f), h = p.pointAt(2 / 3).rotate(l, o.start), u = g.pointAt(1 / 3).rotate(-l, g.end), r = B.createSegment("C", h, u, g.end), s.appendSegment(r), p = new D(f, o.end), h = g.pointAt(1 / 3).rotate(l, g.end), u = p.pointAt(1 / 3).rotate(-l, o.end), r = B.createSegment("C", h, u, o.end), s.appendSegment(r);
      } else if (e === "gap")
        r = B.createSegment("M", o.end), s.appendSegment(r);
      else if (e === "cubic") {
        l = o.start.theta(o.end);
        const d = t * 0.6;
        let f = t * 1.35;
        c = o.start.diff(o.end), (c.x < 0 || c.x === 0 && c.y < 0) && (f *= -1), h = new w(o.start.x + d, o.start.y + f).rotate(l, o.start), u = new w(o.end.x - d, o.end.y + f).rotate(l, o.end), r = B.createSegment("C", h, u, o.end), s.appendSegment(r);
      }
    } else {
      const l = i[a + 1];
      n === 0 || !l || wi.includes(l) ? (r = B.createSegment("L", o.end), s.appendSegment(r)) : p1(n, s, o.end, o.start, l.end);
    }
  }), s;
}
function p1(i, t, e, n, s) {
  const r = e.distance(n) / 2, o = e.distance(s) / 2, a = -Math.min(i, r), l = -Math.min(i, o), c = e.clone().move(n, a).round(), h = e.clone().move(s, l).round(), u = new w(zi * c.x + Vi * e.x, Vi * e.y + zi * c.y), d = new w(zi * h.x + Vi * e.x, Vi * e.y + zi * h.y);
  let f;
  f = B.createSegment("L", c), t.appendSegment(f), f = B.createSegment("C", u, d, h), t.appendSegment(f);
}
let wi, as;
const m1 = function(i, t, e, n = {}) {
  wi = [], as = [], d1(this);
  const s = n.size || 5, r = n.type || "arc", o = n.radius || 0, a = n.ignoreConnectors || ["smooth"], l = this.graph, h = l.model.getEdges();
  if (h.length === 1)
    return Ma(Ys(i, t, e), s, r, o);
  const u = this.cell, d = h.indexOf(u), f = l.options.connecting.connector || {}, g = h.filter((x, E) => {
    const S = x.getConnector() || f;
    return a.includes(S.name) ? !1 : E > d ? S.name !== "jumpover" : !0;
  }), p = g.map((x) => l.findViewByCell(x)), m = Ys(i, t, e), b = p.map((x) => x == null ? [] : x === this ? m : Ys(x.sourcePoint, x.targetPoint, x.routePoints)), v = [];
  m.forEach((x) => {
    const E = g.reduce((S, C, O) => {
      if (C !== u) {
        const P = f1(x, b[O]);
        S.push(...P);
      }
      return S;
    }, []).sort((S, C) => Aa(x.start, S) - Aa(x.start, C));
    E.length > 0 ? v.push(...g1(x, E, s)) : v.push(x);
  });
  const y = Ma(v, s, r, o);
  return wi = [], as = [], n.raw ? y : y.serialize();
}, b1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  jumpover: m1,
  loop: c1,
  normal: l1,
  rounded: h1,
  smooth: u1
}, Symbol.toStringTag, { value: "Module" }));
var tn;
(function(i) {
  i.presets = b1, i.registry = Mt.create({
    type: "connector"
  }), i.registry.register(i.presets, !0);
})(tn || (tn = {}));
var y1 = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
};
class Nh extends At {
  constructor(t = {}) {
    super(), this.pending = !1, this.changing = !1, this.data = {}, this.mutate(gt(t)), this.changed = {};
  }
  mutate(t, e = {}) {
    const n = e.unset === !0, s = e.silent === !0, r = [], o = this.changing;
    this.changing = !0, o || (this.previous = gt(this.data), this.changed = {});
    const a = this.data, l = this.previous, c = this.changed;
    if (Object.keys(t).forEach((h) => {
      const u = h, d = t[u];
      ye(a[u], d) || r.push(u), ye(l[u], d) ? delete c[u] : c[u] = d, n ? delete a[u] : a[u] = d;
    }), !s && r.length > 0 && (this.pending = !0, this.pendingOptions = e, r.forEach((h) => {
      this.emit("change:*", {
        key: h,
        options: e,
        store: this,
        current: a[h],
        previous: l[h]
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
    return Fr(this.data, t, "/");
  }
  setByPath(t, e, n = {}) {
    const s = "/", r = Array.isArray(t) ? [...t] : t.split(s), o = Array.isArray(t) ? t.join(s) : t, a = r[0], l = r.length;
    if (n.propertyPath = o, n.propertyValue = e, n.propertyPathArray = r, l === 1)
      this.set(a, e, n);
    else {
      const c = {};
      let h = c, u = a;
      for (let g = 1; g < l; g += 1) {
        const p = r[g], m = Number.isFinite(Number(p));
        h = h[u] = m ? [] : {}, u = p;
      }
      Gn(c, r, e, s);
      const d = gt(this.data);
      n.rewrite && sa(d, t, s);
      const f = Nt(d, c);
      this.set(a, f[a], n);
    }
    return this;
  }
  removeByPath(t, e) {
    const n = Array.isArray(t) ? t : t.split("/"), s = n[0];
    if (n.length === 1)
      this.remove(s, e);
    else {
      const r = n.slice(1), o = gt(this.get(s));
      o && sa(o, r), this.set(s, o, e);
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
      return this.hasChanged() ? gt(this.changed) : null;
    const e = this.changing ? this.previous : this.data, n = {};
    let s;
    for (const r in t) {
      const o = t[r];
      ye(e[r], o) || (n[r] = o, s = !0);
    }
    return s ? gt(n) : null;
  }
  /**
   * Returns a copy of the store's `data` object.
   */
  toJSON() {
    return gt(this.data);
  }
  clone() {
    const t = this.constructor;
    return new t(this.data);
  }
  dispose() {
    this.off(), this.data = {}, this.previous = {}, this.changed = {}, this.pending = !1, this.changing = !1, this.pendingOptions = null, this.trigger("disposed", { store: this });
  }
}
y1([
  At.dispose()
], Nh.prototype, "dispose", null);
class xi {
  constructor(t) {
    this.cell = t, this.ids = {}, this.cache = {};
  }
  get() {
    return Object.keys(this.ids);
  }
  start(t, e, n = {}, s = "/") {
    const r = this.cell.getPropByPath(t), o = Zb(n, xi.defaultOptions), a = this.getTiming(o.timing), l = this.getInterp(o.interp, r, e);
    let c = 0;
    const h = Array.isArray(t) ? t.join(s) : t, u = Array.isArray(t) ? t : t.split(s), d = () => {
      const f = (/* @__PURE__ */ new Date()).getTime();
      c === 0 && (c = f);
      let p = (f - c) / o.duration;
      p < 1 ? this.ids[h] = requestAnimationFrame(d) : p = 1;
      const m = l(a(p));
      this.cell.setPropByPath(u, m), n.progress && n.progress(Object.assign({ progress: p, currentValue: m }, this.getArgs(h))), p === 1 && (this.cell.notify("transition:complete", this.getArgs(h)), n.complete && n.complete(this.getArgs(h)), this.cell.notify("transition:finish", this.getArgs(h)), n.finish && n.finish(this.getArgs(h)), this.clean(h));
    };
    return setTimeout(() => {
      this.stop(t, void 0, s), this.cache[h] = { startValue: r, targetValue: e, options: o }, this.ids[h] = requestAnimationFrame(d), this.cell.notify("transition:start", this.getArgs(h)), n.start && n.start(this.getArgs(h));
    }, n.delay), this.stop.bind(this, t, s, n);
  }
  stop(t, e = {}, n = "/") {
    const s = Array.isArray(t) ? t : t.split(n);
    return Object.keys(this.ids).filter((r) => ye(s, r.split(n).slice(0, s.length))).forEach((r) => {
      cancelAnimationFrame(this.ids[r]);
      const o = this.cache[r], a = this.getArgs(r), l = Object.assign(Object.assign({}, o.options), e), c = l.jumpedToEnd;
      c && o.targetValue != null && (this.cell.setPropByPath(r, o.targetValue), this.cell.notify("transition:end", Object.assign({}, a)), this.cell.notify("transition:complete", Object.assign({}, a)), l.complete && l.complete(Object.assign({}, a)));
      const h = Object.assign({ jumpedToEnd: c }, a);
      this.cell.notify("transition:stop", Object.assign({}, h)), l.stop && l.stop(Object.assign({}, h)), this.cell.notify("transition:finish", Object.assign({}, a)), l.finish && l.finish(Object.assign({}, a)), this.clean(r);
    }), this;
  }
  clean(t) {
    delete this.ids[t], delete this.cache[t];
  }
  getTiming(t) {
    return typeof t == "string" ? rn[t] : t;
  }
  getInterp(t, e, n) {
    return t ? t(e, n) : typeof n == "number" ? Ze.number(e, n) : typeof n == "string" ? n[0] === "#" ? Ze.color(e, n) : Ze.unit(e, n) : Ze.object(e, n);
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
})(xi || (xi = {}));
var v1 = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
}, Lh = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
};
class J extends At {
  static config(t) {
    const { markup: e, propHooks: n, attrHooks: s } = t, r = Lh(t, ["markup", "propHooks", "attrHooks"]);
    e != null && (this.markup = e), n && (this.propHooks = this.propHooks.slice(), Array.isArray(n) ? this.propHooks.push(...n) : typeof n == "function" ? this.propHooks.push(n) : Object.values(n).forEach((o) => {
      typeof o == "function" && this.propHooks.push(o);
    })), s && (this.attrHooks = Object.assign(Object.assign({}, this.attrHooks), s)), this.defaults = Nt({}, this.defaults, r);
  }
  static getMarkup() {
    return this.markup;
  }
  static getDefaults(t) {
    return t ? this.defaults : gt(this.defaults);
  }
  static getAttrHooks() {
    return this.attrHooks;
  }
  static applyPropHooks(t, e) {
    return this.propHooks.reduce((n, s) => s ? z(s, t, n) : n, e);
  }
  // #endregion
  get [Symbol.toStringTag]() {
    return J.toStringTag;
  }
  constructor(t = {}) {
    super();
    const n = this.constructor.getDefaults(!0), s = Nt({}, this.preprocess(n), this.preprocess(t));
    this.id = s.id || Ji(), this.store = new Nh(s), this.animation = new xi(this), this.setup(), this.init(), this.postprocess(t);
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
    return n == null && e !== !0 && (r.id = Ji()), r;
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
      this.store.set(Nt({}, this.getProp(), s), e), this.postprocess(t);
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
        e.deep === !1 ? n(Object.assign(Object.assign({}, s), t)) : n(Nt({}, s, t));
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
    let s = n[t] || Ee.registry.get(t);
    if (!s) {
      const r = Es(t);
      s = n[r] || Ee.registry.get(r);
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
        e.deep === !1 ? n(typeof t == "object" ? Object.assign(Object.assign({}, s), t) : t) : n(Nt({}, s, t));
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
    return J.getCommonAncestor(this, ...t);
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
    return J.isCell(t) ? t.addChild(this, e) : t.addCell(this, e), this;
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
        l && l.forEach((h) => h.updateParent(n)), c && c.forEach((h) => h.updateParent(n));
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
    let a = gt(this.getTools());
    if (a == null || r == null || a.name === r)
      return a == null && (a = {}), a.items || (a.items = []), a.name = r, a.items = [...a.items, ...s], this.setTools(Object.assign({}, a), o);
  }
  setTools(t, e = {}) {
    return t == null ? this.removeTools() : this.store.set("tools", J.normalizeTools(t), e), this;
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
    const n = gt(this.getTools());
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
    return new w();
  }
  toJSON(t = {}) {
    const e = Object.assign({}, this.store.get()), n = Object.prototype.toString, s = this.isNode() ? "node" : this.isEdge() ? "edge" : "cell";
    if (!e.shape) {
      const g = this.constructor;
      throw new Error(`Unable to serialize ${s} missing "shape" prop, check the ${s} "${g.name || n.call(g)}"`);
    }
    const r = this.constructor, o = t.diff === !0, a = e.attrs || {}, l = r.getDefaults(!0), c = o ? this.preprocess(l, !0) : l, h = c.attrs || {}, u = {};
    Object.entries(e).forEach(([g, p]) => {
      if (p != null && !Array.isArray(p) && typeof p == "object" && !Se(p))
        throw new Error(`Can only serialize ${s} with plain-object props, but got a "${n.call(p)}" type of key "${g}" on ${s} "${this.id}"`);
      if (g !== "attrs" && g !== "shape" && o) {
        const m = c[g];
        ye(p, m) && delete e[g];
      }
    }), Object.keys(a).forEach((g) => {
      const p = a[g], m = h[g];
      Object.keys(p).forEach((b) => {
        const v = p[b], y = m ? m[b] : null;
        v != null && typeof v == "object" && !Array.isArray(v) ? Object.keys(v).forEach((x) => {
          const E = v[x];
          if (m == null || y == null || !vt(y) || !ye(y[x], E)) {
            u[g] == null && (u[g] = {}), u[g][b] == null && (u[g][b] = {});
            const S = u[g][b];
            S[x] = E;
          }
        }) : (m == null || !ye(y, v)) && (u[g] == null && (u[g] = {}), u[g][b] = v);
      });
    });
    const d = Object.assign(Object.assign({}, e), { attrs: ec(u) ? void 0 : u });
    d.attrs == null && delete d.attrs;
    const f = d;
    return f.angle === 0 && delete f.angle, gt(f);
  }
  clone(t = {}) {
    if (!t.deep) {
      const n = Object.assign({}, this.store.get());
      t.keepId || delete n.id, delete n.parent, delete n.children;
      const s = this.constructor;
      return new s(n);
    }
    return J.deepClone(this)[this.id];
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
J.defaults = {};
J.attrHooks = {};
J.propHooks = [];
v1([
  At.dispose()
], J.prototype, "dispose", null);
(function(i) {
  function t(e) {
    return typeof e == "string" ? { items: [e] } : Array.isArray(e) ? { items: e } : e.items ? e : {
      items: [e]
    };
  }
  i.normalizeTools = t;
})(J || (J = {}));
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
})(J || (J = {}));
(function(i) {
  function t(...r) {
    const o = r.filter((l) => l != null).map((l) => l.getAncestors()).sort((l, c) => l.length - c.length);
    return o.shift().find((l) => o.every((c) => c.includes(l))) || null;
  }
  i.getCommonAncestor = t;
  function e(r, o = {}) {
    let a = null;
    for (let l = 0, c = r.length; l < c; l += 1) {
      const h = r[l];
      let u = h.getBBox(o);
      if (u) {
        if (h.isNode()) {
          const d = h.getAngle();
          d != null && d !== 0 && (u = u.bbox(d));
        }
        a = a == null ? u : a.union(u);
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
    const o = sc(r), a = o.reduce((l, c) => (l[c.id] = c.clone(), l), {});
    return o.forEach((l) => {
      const c = a[l.id];
      if (c.isEdge()) {
        const d = c.getSourceCellId(), f = c.getTargetCellId();
        d && a[d] && c.setSource(Object.assign(Object.assign({}, c.getSource()), { cell: a[d].id })), f && a[f] && c.setTarget(Object.assign(Object.assign({}, c.getTarget()), { cell: a[f].id }));
      }
      const h = l.getParent();
      h && a[h.id] && c.setParent(a[h.id]);
      const u = l.getChildren();
      if (u && u.length) {
        const d = u.reduce((f, g) => (a[g.id] && f.push(a[g.id]), f), []);
        d.length > 0 && c.setChildren(d);
      }
    }), a;
  }
  i.cloneCells = s;
})(J || (J = {}));
(function(i) {
  i.config({
    propHooks(t) {
      var { tools: e } = t, n = Lh(t, ["tools"]);
      return e && (n.tools = i.normalizeTools(e)), n;
    }
  });
})(J || (J = {}));
var jn;
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
})(jn || (jn = {}));
class w1 {
  constructor(t) {
    this.ports = [], this.groups = {}, this.init(gt(t));
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
      const u = Qe.registry.get(o);
      if (u == null)
        return Qe.registry.onNotFound(o);
      a = u;
    } else
      a = Qe.presets.left;
    const l = n.map((u) => u && u.position && u.position.args || {}), c = r && r.args || {};
    return a(l, e, c).map((u, d) => {
      const f = n[d];
      return {
        portLayout: u,
        portId: f.id,
        portSize: f.size,
        portAttrs: f.attrs,
        labelSize: f.label.size,
        labelLayout: this.getPortLabelLayout(f, w.create(u.position), e)
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
    return e.markup = e.markup || n.markup, e.attrs = Nt({}, n.attrs, e.attrs), e.position = this.createPosition(n, e), e.label = Nt({}, n.label, this.getLabel(e)), e.zIndex = this.getZIndex(n, e), e.size = Object.assign(Object.assign({}, n.size), e.size), e;
  }
  getZIndex(t, e) {
    return typeof e.zIndex == "number" ? e.zIndex : typeof t.zIndex == "number" || t.zIndex === "auto" ? t.zIndex : "auto";
  }
  createPosition(t, e) {
    return Nt({
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
    const s = t.label.position.name || "left", r = t.label.position.args || {}, o = Pn.registry.get(s) || Pn.presets.left;
    return o ? o(e, n, r) : null;
  }
}
var js = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
};
let mt = class Ih extends J {
  get [Symbol.toStringTag]() {
    return Ih.toStringTag;
  }
  constructor(t = {}) {
    super(t), this.initPorts();
  }
  preprocess(t, e) {
    const { x: n, y: s, width: r, height: o } = t, a = js(t, ["x", "y", "width", "height"]);
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
      const l = ct.normalize(this.getAngle() || 0);
      n.absolute && (a += Math.floor((l + 45) / 90), a %= 4);
      const c = this.getBBox();
      let h;
      a === 0 ? h = c.getBottomLeft() : a === 1 ? h = c.getCorner() : a === 2 ? h = c.getTopRight() : h = c.getOrigin();
      const u = h.clone().rotate(-l, c.getCenter()), d = Math.sqrt(t * t + e * e) / 2;
      let f = a * Math.PI / 2;
      f += Math.atan(a % 2 === 0 ? e / t : t / e), f -= ct.toRad(l);
      const p = w.fromPolar(d, f, u).clone().translate(t / -2, e / -2);
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
      const o = this.getBBox({ deep: !0 }), a = n.restrict, l = s.x - o.x, c = s.y - o.y, h = Math.max(a.x + l, Math.min(a.x + a.width + l - o.width, s.x + t)), u = Math.max(a.y + c, Math.min(a.y + a.height + c - o.height, s.y + e));
      t = h - s.x, e = u - s.y;
    }
    const r = {
      x: s.x + t,
      y: s.y + e
    };
    return n.tx = t, n.ty = e, n.transition ? (typeof n.transition != "object" && (n.transition = {}), this.transition("position", r, Object.assign(Object.assign({}, n.transition), { interp: Ze.object })), this.eachChild((o) => {
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
      return e.push(this), J.getCellsBBox(e);
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
    const c = this.getPortsPosition(a.group)[o].position, h = w.create(c).translate(n.getOrigin()), u = this.getAngle();
    return u && h.rotate(-u, s), h;
  }
  /**
   * Sets cell's size and position based on the children bbox and given padding.
   */
  fit(t = {}) {
    const n = (this.getChildren() || []).filter((c) => c.isNode());
    if (n.length === 0)
      return this;
    this.startBatch("fit-embeds", t), t.deep && n.forEach((c) => c.fit(t));
    let { x: s, y: r, width: o, height: a } = J.getCellsBBox(n);
    const l = nn(t.padding);
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
    return this.store.get("defaultPortContainerMarkup") || pt.getPortContainerMarkup();
  }
  getPortContainerMarkup() {
    return this.store.get("portContainerMarkup") || this.getDefaultPortContainerMarkup();
  }
  setPortContainerMarkup(t, e = {}) {
    return this.store.set("portContainerMarkup", pt.clone(t), e), this;
  }
  get portMarkup() {
    return this.getPortMarkup();
  }
  set portMarkup(t) {
    this.setPortMarkup(t);
  }
  getDefaultPortMarkup() {
    return this.store.get("defaultPortMarkup") || pt.getPortMarkup();
  }
  getPortMarkup() {
    return this.store.get("portMarkup") || this.getDefaultPortMarkup();
  }
  setPortMarkup(t, e = {}) {
    return this.store.set("portMarkup", pt.clone(t), e), this;
  }
  get portLabelMarkup() {
    return this.getPortLabelMarkup();
  }
  set portLabelMarkup(t) {
    this.setPortLabelMarkup(t);
  }
  getDefaultPortLabelMarkup() {
    return this.store.get("defaultPortLabelMarkup") || pt.getPortLabelMarkup();
  }
  getPortLabelMarkup() {
    return this.store.get("portLabelMarkup") || this.getDefaultPortLabelMarkup();
  }
  setPortLabelMarkup(t, e = {}) {
    return this.store.set("portLabelMarkup", pt.clone(t), e), this;
  }
  get ports() {
    const t = this.store.get("ports", { items: [] });
    return t.items == null && (t.items = []), t;
  }
  getPorts() {
    return gt(this.ports.items);
  }
  getPortsByGroup(t) {
    return this.getPorts().filter((e) => e.group === t);
  }
  getPort(t) {
    return gt(this.ports.items.find((e) => e.id && e.id === t));
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
    r && !ec(n) && (r.getConnectedEdges(this, { incoming: !0 }).forEach((l) => {
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
    return Ji();
  }
  updatePortData() {
    const t = this.validatePorts();
    if (t.length > 0)
      throw this.store.set("ports", this.store.getPrevious("ports")), new Error(t.join(" "));
    const e = this.port ? this.port.getPorts() : null;
    this.port = new w1(this.ports);
    const n = this.port.getPorts(), s = e ? n.filter((o) => e.find((a) => a.id === o.id) ? null : o) : [...n], r = e ? e.filter((o) => n.find((a) => a.id === o.id) ? null : o) : [];
    s.length > 0 && this.notify("ports:added", { added: s, cell: this, node: this }), r.length > 0 && this.notify("ports:removed", { removed: r, cell: this, node: this });
  }
};
mt.defaults = {
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
})(mt || (mt = {}));
(function(i) {
  i.config({
    propHooks(t) {
      var { ports: e } = t, n = js(t, ["ports"]);
      return e && (n.ports = Array.isArray(e) ? { items: e } : e), n;
    }
  });
})(mt || (mt = {}));
(function(i) {
  i.registry = Mt.create({
    type: "node",
    process(t, e) {
      if (jn.exist(t, !0))
        throw new Error(`Node with name '${t}' was registered by anthor Edge`);
      if (typeof e == "function")
        return e.config({ shape: t }), e;
      let n = i;
      const { inherit: s } = e, r = js(e, ["inherit"]);
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
  }), jn.setNodeRegistry(i.registry);
})(mt || (mt = {}));
(function(i) {
  let t = 0;
  function e(r) {
    return r ? Gr(r) : (t += 1, `CustomNode${t}`);
  }
  function n(r) {
    const { constructorName: o, overwrite: a } = r, l = js(r, ["constructorName", "overwrite"]), c = Vr(e(o || l.shape), this);
    return c.config(l), l.shape && i.registry.register(l.shape, c, a), c;
  }
  i.define = n;
  function s(r) {
    const o = r.shape || "rect", a = i.registry.get(o);
    return a ? new a(r) : i.registry.onNotFound(o);
  }
  i.create = s;
})(mt || (mt = {}));
var ks = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
};
let wt = class jh extends J {
  get [Symbol.toStringTag]() {
    return jh.toStringTag;
  }
  constructor(t = {}) {
    super(t);
  }
  preprocess(t, e) {
    const { source: n, sourceCell: s, sourcePort: r, sourcePoint: o, target: a, targetCell: l, targetPort: c, targetPoint: h } = t, d = ks(t, ["source", "sourceCell", "sourcePort", "sourcePoint", "target", "targetCell", "targetPort", "targetPoint"]), f = (g) => typeof g == "string" || typeof g == "number";
    if (n != null)
      if (J.isCell(n))
        d.source = { cell: n.id };
      else if (f(n))
        d.source = { cell: n };
      else if (w.isPoint(n))
        d.source = n.toJSON();
      else if (Array.isArray(n))
        d.source = { x: n[0], y: n[1] };
      else {
        const g = n.cell;
        J.isCell(g) ? d.source = Object.assign(Object.assign({}, n), { cell: g.id }) : d.source = n;
      }
    if (s != null || r != null) {
      let g = d.source;
      if (s != null) {
        const p = f(s) ? s : s.id;
        g ? g.cell = p : g = d.source = { cell: p };
      }
      r != null && g && (g.port = r);
    } else o != null && (d.source = w.create(o).toJSON());
    if (a != null)
      if (J.isCell(a))
        d.target = { cell: a.id };
      else if (f(a))
        d.target = { cell: a };
      else if (w.isPoint(a))
        d.target = a.toJSON();
      else if (Array.isArray(a))
        d.target = { x: a[0], y: a[1] };
      else {
        const g = a.cell;
        J.isCell(g) ? d.target = Object.assign(Object.assign({}, a), { cell: g.id }) : d.target = a;
      }
    if (l != null || c != null) {
      let g = d.target;
      if (l != null) {
        const p = f(l) ? l : l.id;
        g ? g.cell = p : g = d.target = { cell: p };
      }
      c != null && g && (g.port = c);
    } else h != null && (d.target = w.create(h).toJSON());
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
    if (J.isCell(e))
      return this.store.set(t, Nt({}, n, { cell: e.id }), s), this;
    const r = e;
    return w.isPoint(e) || r.x != null && r.y != null ? (this.store.set(t, Nt({}, n, { x: r.x, y: r.y }), s), this) : (this.store.set(t, gt(e), s), this);
  }
  getSourcePoint() {
    return this.getTerminalPoint("source");
  }
  getTargetPoint() {
    return this.getTerminalPoint("target");
  }
  getTerminalPoint(t) {
    const e = this[t];
    if (w.isPointLike(e))
      return w.create(e);
    const n = this.getTerminalCell(t);
    return n ? n.getConnectionPoint(this, t) : new w();
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
    return gt(e);
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
    const n = t && e ? e.filter((r) => t.find((o) => r === o || ye(r, o)) ? null : r) : e ? [...e] : [], s = t && e ? t.filter((r) => e.find((o) => r === o || ye(r, o)) ? null : r) : t ? [...t] : [];
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
    return this.store.set("vertices", n.map((s) => w.toJSON(s)), e), this;
  }
  insertVertex(t, e, n = {}) {
    const s = this.getVertices(), r = s.length;
    let o = e != null && Number.isFinite(e) ? e : r;
    return o < 0 && (o = r + o + 1), s.splice(o, 0, w.toJSON(t)), this.setVertices(s, n);
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
    const n = t && e ? e.filter((r) => t.find((o) => w.equals(r, o)) ? null : r) : e ? [...e] : [], s = t && e ? t.filter((r) => e.find((o) => w.equals(r, o)) ? null : r) : t ? [...t] : [];
    n.length > 0 && this.notify("vertexs:added", { added: n, cell: this, edge: this }), s.length > 0 && this.notify("vertexs:removed", { removed: s, cell: this, edge: this });
  }
  // #endregion
  // #region markup
  getDefaultMarkup() {
    return this.store.get("defaultMarkup") || pt.getEdgeMarkup();
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
    return this.applyToPoints((r) => w.create(r).scale(t, e, n).toJSON(), s);
  }
  applyToPoints(t, e = {}) {
    const n = {}, s = this.getSource(), r = this.getTarget();
    w.isPointLike(s) && (n.source = t(s)), w.isPointLike(r) && (n.target = t(r));
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
      ...this.getVertices().map((e) => w.create(e)),
      this.getTargetPoint()
    ];
    return new Ot(t);
  }
  updateParent(t) {
    let e = null;
    const n = this.getSourceCell(), s = this.getTargetCell(), r = this.getParent();
    return n && s && (n === s || n.isDescendantOf(s) ? e = s : s.isDescendantOf(n) ? e = n : e = J.getCommonAncestor(n, s)), r && e && e.id !== r.id && r.unembed(this, t), e && (!r || r.id !== e.id) && e.embed(this, t), e;
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
wt.defaults = {};
(function(i) {
  function t(e, n) {
    const s = e, r = n;
    return s.cell === r.cell ? s.port === r.port || s.port == null && r.port == null : !1;
  }
  i.equalTerminals = t;
})(wt || (wt = {}));
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
})(wt || (wt = {}));
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
})(wt || (wt = {}));
(function(i) {
  i.registry = Mt.create({
    type: "edge",
    process(t, e) {
      if (jn.exist(t, !1))
        throw new Error(`Edge with name '${t}' was registered by anthor Node`);
      if (typeof e == "function")
        return e.config({ shape: t }), e;
      let n = i;
      const { inherit: s = "edge" } = e, r = ks(e, ["inherit"]);
      if (typeof s == "string") {
        const a = this.get(s || "edge");
        a == null && s ? this.onNotFound(s, "inherited") : n = a;
      } else
        n = s;
      r.constructorName == null && (r.constructorName = t);
      const o = n.define.call(n, r);
      return o.config({ shape: t }), o;
    }
  }), jn.setEdgeRegistry(i.registry);
})(wt || (wt = {}));
(function(i) {
  let t = 0;
  function e(r) {
    return r ? Gr(r) : (t += 1, `CustomEdge${t}`);
  }
  function n(r) {
    const { constructorName: o, overwrite: a } = r, l = ks(r, ["constructorName", "overwrite"]), c = Vr(e(o || l.shape), this);
    return c.config(l), l.shape && i.registry.register(l.shape, c, a), c;
  }
  i.define = n;
  function s(r) {
    const o = r.shape || "edge", a = i.registry.get(o);
    return a ? new a(r) : i.registry.onNotFound(o);
  }
  i.create = s;
})(wt || (wt = {}));
(function(i) {
  const t = "basic.edge";
  i.config({
    shape: t,
    propHooks(e) {
      const { label: n, vertices: s } = e, r = ks(e, ["label", "vertices"]);
      if (n) {
        r.labels == null && (r.labels = []);
        const o = typeof n == "string" ? i.parseStringLabel(n) : n;
        r.labels.push(o);
      }
      return s && Array.isArray(s) && (r.vertices = s.map((o) => w.create(o).toJSON())), r;
    }
  }), i.registry.register(t, i);
})(wt || (wt = {}));
var x1 = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
};
class ls extends At {
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
    const h = [], u = [];
    return o.forEach((d) => {
      const f = this.get(d);
      f ? r.merge && !d.isSameStore(f) && (f.setProp(d.getProp(), n), u.push(f), a && !c && (l == null || typeof l == "function" ? c = f.hasChanged() : typeof l == "string" ? c = f.hasChanged(l) : c = l.some((g) => f.hasChanged(g)))) : (h.push(d), this.reference(d));
    }), h.length && (a && (c = !0), this.cells.splice(s, 0, ...h), this.length = this.cells.length), c && this.sort({ silent: !0 }), r.silent || (h.forEach((d, f) => {
      const g = {
        cell: d,
        index: s + f,
        options: r
      };
      this.trigger("added", g), r.dryrun || d.notify("added", Object.assign({}, g));
    }), c && this.trigger("sorted"), (h.length || u.length) && this.trigger("updated", {
      added: h,
      merged: u,
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
    return this.comparator != null && (this.cells = Br(this.cells, this.comparator), t.silent || this.trigger("sorted")), this;
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
x1([
  ls.dispose()
], ls.prototype, "dispose", null);
var E1 = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
};
class Yt extends At {
  get [Symbol.toStringTag]() {
    return Yt.toStringTag;
  }
  constructor(t = []) {
    super(), this.batches = {}, this.addings = /* @__PURE__ */ new WeakMap(), this.nodes = {}, this.edges = {}, this.outgoings = {}, this.incomings = {}, this.collection = new ls(t), this.setup();
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
      const o = J.isCell(s.cell) ? s.cell.id : s.cell, a = n[o], l = a ? a.indexOf(t.id) : -1;
      l >= 0 && (a.splice(l, 1), a.length === 0 && delete n[o]);
    }
    const r = t.getTerminal(e);
    if (r && r.cell) {
      const o = J.isCell(r.cell) ? r.cell.id : r.cell, a = n[o] || [];
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
    const n = mt.isNode(t) ? t : this.createNode(t);
    return this.addCell(n, e), n;
  }
  updateNode(t, e = {}) {
    const n = this.createNode(t), s = n.getProp();
    return n.dispose(), this.updateCell(s, e);
  }
  createNode(t) {
    return mt.create(t);
  }
  addEdge(t, e = {}) {
    const n = wt.isEdge(t) ? t : this.createEdge(t);
    return this.addCell(n, e), n;
  }
  createEdge(t) {
    return wt.create(t);
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
    const c = (h, u) => {
      const d = u ? this.getOutgoingEdges(h) : this.getIncomingEdges(h);
      if (d != null && d.forEach((f) => {
        r[f.id] || (n.push(f), r[f.id] = !0, o && (a && c(f, !1), l && c(f, !0)));
      }), o && h.isEdge()) {
        const f = u ? h.getTargetCell() : h.getSourceCell();
        f && f.isEdge() && (r[f.id] || (n.push(f), c(f, u)));
      }
    };
    if (l && c(s, !0), a && c(s, !1), e.deep) {
      const h = s.getDescendants({ deep: !0 }), u = {};
      h.forEach((f) => {
        f.isNode() && (u[f.id] = !0);
      });
      const d = (f, g) => {
        const p = g ? this.getOutgoingEdges(f.id) : this.getIncomingEdges(f.id);
        p != null && p.forEach((m) => {
          if (!r[m.id]) {
            const b = m.getSourceCell(), v = m.getTargetCell();
            if (!e.enclosed && b && u[b.id] && v && u[v.id])
              return;
            n.push(m), r[m.id] = !0;
          }
        });
      };
      h.forEach((f) => {
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
      const c = l.hasLoop(e), h = l.getSourceCell(), u = l.getTargetCell();
      return n && h && h.isNode() && !a[h.id] && (c || h !== t && (!e.deep || !h.isDescendantOf(t))) && (a[h.id] = h), s && u && u.isNode() && !a[u.id] && (c || u !== t && (!e.deep || !u.isDescendantOf(t))) && (a[u.id] = u), a;
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
    }), J.getCommonAncestor(...e);
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
      a(l), e.deep && l.getDescendants({ deep: !0 }).forEach((h) => a(h));
    }), o.forEach((l) => {
      const c = l.getSourceCell(), h = l.getTargetCell();
      c && !s[c.id] && (n.push(c), s[c.id] = c, c.isNode() && r.push(c)), h && !s[h.id] && (n.push(h), s[h.id] = h, h.isNode() && r.push(h));
    }), r.forEach((l) => {
      this.getConnectedEdges(l, e).forEach((h) => {
        const u = h.getSourceCell(), d = h.getTargetCell();
        !s[h.id] && u && s[u.id] && d && s[d.id] && (n.push(h), s[h.id] = h);
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
    return J.cloneCells(t);
  }
  getNodesFromPoint(t, e) {
    const n = typeof t == "number" ? { x: t, y: e || 0 } : t;
    return this.getNodes().filter((s) => s.getBBox().containsPoint(n));
  }
  getNodesInArea(t, e, n, s, r) {
    const o = typeof t == "number" ? new R(t, e, n, s) : R.create(t), a = typeof t == "number" ? r : e, l = a && a.strict;
    return this.getNodes().filter((c) => {
      const h = c.getBBox();
      return l ? o.containsRect(h) : o.isIntersectWithRect(h);
    });
  }
  getEdgesInArea(t, e, n, s, r) {
    const o = typeof t == "number" ? new R(t, e, n, s) : R.create(t), a = typeof t == "number" ? r : e, l = a && a.strict;
    return this.getEdges().filter((c) => {
      const h = c.getBBox();
      return h.width === 0 ? h.inflate(1, 0) : h.height === 0 && h.inflate(0, 1), l ? o.containsRect(h) : o.isIntersectWithRect(h);
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
    return J.getCellsBBox(t, e);
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
      l.forEach((h) => {
        o[h.id] = o[a.id] + 1, s.splice(c, 0, h);
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
      const h = c.getSourceCellId(), u = c.getTargetCellId();
      h && u && (s[h] || (s[h] = []), s[u] || (s[u] = []), s[h].push(u), n.directed || s[u].push(h));
    });
    const r = typeof t == "string" ? t : t.id, o = vr.run(s, r, n.weight), a = [];
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
    return Yt.toJSON(this.getCells(), t);
  }
  parseJSON(t) {
    return Yt.fromJSON(t);
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
E1([
  Yt.dispose()
], Yt.prototype, "dispose", null);
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
})(Yt || (Yt = {}));
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
        if (mt.registry.exist(o))
          return mt.create(r);
        if (wt.registry.exist(o))
          return wt.create(r);
      }
      throw new Error("The `shape` should be specified when creating a node/edge instance");
    });
  }
  i.fromJSON = e;
})(Yt || (Yt = {}));
var C1 = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
};
let He = class extends mt {
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
      const { label: e } = t, n = C1(t, ["label"]);
      return e && Gn(n, "attrs/text/text", e), n;
    },
    visible: !0
  });
})(He || (He = {}));
var S1 = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
};
function O1(i, t = "body") {
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
function P1(i = "xlink:href") {
  return (e) => {
    const { imageUrl: n, imageWidth: s, imageHeight: r } = e, o = S1(e, ["imageUrl", "imageWidth", "imageHeight"]);
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
function Wn(i, t, e = {}) {
  const n = {
    constructorName: i,
    markup: O1(i, e.selector),
    attrs: {
      [i]: Object.assign({}, He.bodyAttr)
    }
  };
  return (e.parent || He).define(Nt(n, t, { shape: i }));
}
Wn("rect", {
  attrs: {
    body: {
      refWidth: "100%",
      refHeight: "100%"
    }
  }
});
const A1 = wt.define({
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
Wn("ellipse", {
  attrs: {
    body: {
      refCx: "50%",
      refCy: "50%",
      refRx: "50%",
      refRy: "50%"
    }
  }
});
var M1 = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
};
class kn extends He {
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
    return t == null ? this.removePoints() : this.setAttrByPath("body/refPoints", kn.pointsToString(t), e), this;
  }
  removePoints() {
    return this.removeAttrByPath("body/refPoints"), this;
  }
}
(function(i) {
  function t(e) {
    return typeof e == "string" ? e : e.map((n) => Array.isArray(n) ? n.join(",") : w.isPointLike(n) ? `${n.x}, ${n.y}` : "").join(" ");
  }
  i.pointsToString = t, i.config({
    propHooks(e) {
      const { points: n } = e, s = M1(e, ["points"]);
      if (n) {
        const r = t(n);
        r && Gn(s, "attrs/body/refPoints", r);
      }
      return s;
    }
  });
})(kn || (kn = {}));
Wn("polygon", {}, { parent: kn });
Wn("polyline", {}, { parent: kn });
var T1 = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
};
He.define({
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
    const { path: t } = i, e = T1(i, ["path"]);
    return t && Gn(e, "attrs/body/refD", t), e;
  }
});
var N1 = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
};
He.define({
  shape: "text-block",
  markup: [
    {
      tagName: "rect",
      selector: "body"
    },
    _e.SUPPORT_FOREIGNOBJECT ? {
      tagName: "foreignObject",
      selector: "foreignObject",
      children: [
        {
          tagName: "div",
          ns: Rt.xhtml,
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
    body: Object.assign(Object.assign({}, He.bodyAttr), { refWidth: "100%", refHeight: "100%" }),
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
    const { text: t } = i, e = N1(i, ["text"]);
    return t && Gn(e, "attrs/label/text", t), e;
  },
  attrHooks: {
    text: {
      set(i, { cell: t, view: e, refBBox: n, elem: s, attrs: r }) {
        if (s instanceof HTMLElement)
          s.textContent = i;
        else {
          const o = r.style || {}, a = { text: i, width: -5, height: "100%" }, l = Object.assign({ textVerticalAnchor: "middle" }, o), c = Ee.presets.textWrap;
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
Wn("image", {
  attrs: {
    image: {
      refWidth: "100%",
      refHeight: "100%"
    }
  },
  propHooks: P1()
}, {
  selector: "image"
});
Wn("circle", {
  attrs: {
    body: {
      refCx: "50%",
      refCy: "50%",
      refR: "50%"
    }
  }
});
class ge extends Pt {
  constructor() {
    super(...arguments), this.portsCache = {};
  }
  get [Symbol.toStringTag]() {
    return ge.toStringTag;
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
      this.can("magnetConnectable") ? Ht(e, n) : U(e, n);
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
      ve(t.portElement);
    });
  }
  renderPorts() {
    const t = this.container, e = [];
    t.childNodes.forEach((o) => {
      e.push(o);
    });
    const n = this.cell.getParsedPorts(), s = Qo(n, "zIndex"), r = "auto";
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
    n[e] || e < 0 ? Kr(n[Math.max(e, 0)], s) : hn(this.container, s);
  }
  getPortElement(t) {
    const e = this.portsCache[t.id];
    return e ? e.portElement : this.createPortElement(t);
  }
  createPortElement(t) {
    let e = pt.renderMarkup(this.cell.getPortContainerMarkup());
    const n = e.elem;
    if (n == null)
      throw new Error("Invalid port container markup.");
    e = pt.renderMarkup(this.getPortMarkup(t));
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
      if (e = pt.renderMarkup(this.getPortLabelMarkup(t.label)), l = e.elem, c = e.selectors, l == null)
        throw new Error("Invalid port label markup.");
      if (r && c) {
        for (const u in c)
          if (r[u] && u !== this.rootSelector)
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
        const u = {
          selectors: l.portSelectors || {}
        };
        o.portSize && (u.rootBBox = R.fromSize(o.portSize)), this.updateAttrs(l.portElement, o.portAttrs, u);
      }
      const h = o.labelLayout;
      if (h && l.portLabelElement && (this.applyPortTransform(l.portLabelElement, h, -(c.angle || 0)), h.attrs)) {
        const u = {
          selectors: l.portLabelSelectors || {}
        };
        o.labelSize && (u.rootBBox = R.fromSize(o.labelSize)), this.updateAttrs(l.portLabelElement, h.attrs, u);
      }
    }
  }
  applyPortTransform(t, e, n = 0) {
    const s = e.angle, r = e.position, o = $t().rotate(n).translate(r.x || 0, r.y || 0).rotate(s || 0);
    En(t, o, { absolute: !0 });
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
    }).filter((d) => J.isCell(d) && this.cell.id !== d.id && !d.isDescendantOf(this.cell)) : s.model.getNodesUnderNode(n, {
      by: o
    });
    if (r.frontOnly && a.length > 0) {
      const d = Qo(a, "zIndex"), f = vy(Object.keys(d).map((g) => parseInt(g, 10)));
      f && (a = d[f]);
    }
    a = a.filter((d) => d.visible);
    let l = null;
    const c = e.candidateEmbedView, h = r.validate;
    for (let d = a.length - 1; d >= 0; d -= 1) {
      const f = a[d];
      if (c && c.cell.id === f.id) {
        l = c;
        break;
      } else {
        const g = f.findView(s);
        if (h && z(h, s, {
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
    const u = s.snapToGrid(t.clientX, t.clientY);
    this.notify("node:embedding", {
      e: t,
      cell: n,
      node: n,
      view: s.findViewByCell(n),
      x: u.x,
      y: u.y,
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
    const r = w.create(s.cell.getPosition());
    s.setEventData(t, {
      moving: !1,
      offset: r.diff(e, n),
      restrict: this.getRestrictArea(s)
    });
  }
  dragNode(t, e, n) {
    const s = this.cell, r = this.graph, o = r.getGridSize(), a = this.getEventData(t), l = a.offset, c = a.restrict;
    a.moving || (a.moving = !0, this.addClass("node-moving"), this.notifyNodeMove("node:move", t, e, n, this.cell)), this.autoScrollGraph(t.clientX, t.clientY);
    const h = lt.snapToGrid(e + l.x, o), u = lt.snapToGrid(n + l.y, o);
    s.setPosition(h, u, {
      restrict: c,
      deep: !0,
      ui: !0
    }), r.options.embedding.enabled && (a.embedding || (this.prepareEmbedding(t), a.embedding = !0), this.processEmbedding(t, a));
  }
  autoOffsetNode() {
    const t = this.cell, e = this.graph, n = Object.assign({ id: t.id }, t.getPosition()), r = e.getNodes().map((c) => {
      const h = c.getPosition();
      return { id: c.id, x: h.x, y: h.y };
    }).filter((c) => c.id !== n.id), o = [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1]
      // offset to left top
    ];
    let a = e.getGridSize();
    const l = (c) => r.some((h) => h.x === c.x && h.y === c.y);
    for (; l(n); ) {
      let c = !1;
      for (let h = 0; h < o.length; h += 1) {
        const u = o[h], d = {
          x: n.x + u[0] * a,
          y: n.y + u[1] * a
        };
        if (!l(d)) {
          t.translate(u[0] * a, u[1] * a), c = !0;
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
})(ge || (ge = {}));
ge.config({
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
ge.registry.register("node", ge, !0);
var L1 = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
};
class Ne extends Pt {
  constructor() {
    super(...arguments), this.POINT_ROUNDING = 2, this.labelDestroyFn = {};
  }
  get [Symbol.toStringTag]() {
    return Ne.toStringTag;
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
    s ? this.empty(s) : (s = me("g"), this.addClass(this.prefixClassName("edge-labels"), s), this.labelContainer = s);
    for (let r = 0, o = e.length; r < o; r += 1) {
      const a = e[r], l = this.normalizeLabelMarkup(this.parseLabelMarkup(a.markup));
      let c, h;
      if (l)
        c = l.node, h = l.selectors;
      else {
        const d = t.getDefaultLabel(), f = this.normalizeLabelMarkup(this.parseLabelMarkup(d.markup));
        c = f.node, h = f.selectors;
      }
      c.setAttribute("data-index", `${r}`), s.appendChild(c);
      const u = this.rootSelector;
      if (h[u])
        throw new Error("Ambiguous label root selector.");
      h[u] = c, this.labelCache[r] = c, this.labelSelectors[r] = h;
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
            return typeof t.propertyValue == "object" && Ri(t.propertyValue, "markup");
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
        const c = e[r], h = Nt({}, s.attrs, c.attrs);
        this.updateAttrs(a, h, {
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
    const e = this.cell.getAttrs(), { text: n } = e, s = L1(e, ["text"]);
    return s != null && this.updateAttrs(this.container, s, {
      selectors: this.selectors
    }), this.updateLabelPositions(), this.updateTools(t), this;
  }
  removeRedundantLinearVertices(t = {}) {
    const e = this.cell, n = e.getVertices(), s = [this.sourceAnchor, ...n, this.targetAnchor], r = s.length, o = new Ot(s);
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
        return w.create(this.sourceAnchor);
      case "target":
        return w.create(this.targetAnchor);
      default:
        throw new Error(`Unknown terminal type '${t}'`);
    }
  }
  getTerminalConnectionPoint(t) {
    switch (t) {
      case "source":
        return w.create(this.sourcePoint);
      case "target":
        return w.create(this.targetPoint);
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
      this.routePoints = new Ot(this.routePoints).translate(n, s).points, this.translateConnectionPoints(n, s), this.path.translate(n, s);
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
    const a = this.cell, l = a[t], c = a[n], h = this.getTerminalView(t), u = this.getTerminalView(n), d = this.getTerminalMagnet(t), f = this.getTerminalMagnet(n);
    if (h) {
      let g;
      e ? g = w.create(e) : u ? g = f : g = w.create(c), r = this.getAnchor(l.anchor, h, d, g, t);
    } else
      r = w.create(l);
    if (u) {
      const g = w.create(s || r);
      o = this.getAnchor(c.anchor, u, f, g, n);
    } else
      o = w.isPointLike(c) ? w.create(c) : new w();
    return {
      [t]: r,
      [n]: o
    };
  }
  getAnchor(t, e, n, s, r) {
    const o = e.isEdgeElement(n), a = this.graph.options.connecting;
    let l = typeof t == "string" ? { name: t } : t;
    if (!l) {
      const u = o ? (r === "source" ? a.sourceEdgeAnchor : a.targetEdgeAnchor) || a.edgeAnchor : (r === "source" ? a.sourceAnchor : a.targetAnchor) || a.anchor;
      l = typeof u == "string" ? { name: u } : u;
    }
    if (!l)
      throw new Error("Anchor should be specified.");
    let c;
    const h = l.name;
    if (o) {
      const u = Ln.registry.get(h);
      if (typeof u != "function")
        return Ln.registry.onNotFound(h);
      c = z(u, this, e, n, s, l.args || {}, r);
    } else {
      const u = Nn.registry.get(h);
      if (typeof u != "function")
        return Nn.registry.onNotFound(h);
      c = z(u, this, e, n, s, l.args || {}, r);
    }
    return c ? c.round(this.POINT_ROUNDING) : new w();
  }
  findRoutePoints(t = []) {
    const e = this.graph.options.connecting.router || $e.presets.normal, n = this.cell.getRouter() || e;
    let s;
    if (typeof n == "function")
      s = z(n, this, t, {}, this);
    else {
      const r = typeof n == "string" ? n : n.name, o = typeof n == "string" ? {} : n.args || {}, a = r ? $e.registry.get(r) : $e.presets.normal;
      if (typeof a != "function")
        return $e.registry.onNotFound(r);
      s = z(a, this, t, o, this);
    }
    return s == null ? t.map((r) => w.create(r)) : s.map((r) => w.create(r));
  }
  findConnectionPoints(t, e, n) {
    const s = this.cell, r = this.graph.options.connecting, o = s.getSource(), a = s.getTarget(), l = this.sourceView, c = this.targetView, h = t[0], u = t[t.length - 1];
    let d;
    if (l && !l.isEdgeElement(this.sourceMagnet)) {
      const g = this.sourceMagnet || l.container, p = h || n, m = new D(p, e), b = o.connectionPoint || r.sourceConnectionPoint || r.connectionPoint;
      d = this.getConnectionPoint(b, l, g, m, "source");
    } else
      d = e;
    let f;
    if (c && !c.isEdgeElement(this.targetMagnet)) {
      const g = this.targetMagnet || c.container, p = a.connectionPoint || r.targetConnectionPoint || r.connectionPoint, m = u || e, b = new D(m, n);
      f = this.getConnectionPoint(p, c, g, b, "target");
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
    const a = typeof t == "string" ? t : t.name, l = typeof t == "string" ? {} : t.args, c = In.registry.get(a);
    if (typeof c != "function")
      return In.registry.onNotFound(a);
    const h = z(c, this, s, e, n, l || {}, r);
    return h ? h.round(this.POINT_ROUNDING) : o;
  }
  findMarkerPoints(t, e, n) {
    const s = (u) => {
      const d = this.cell.getAttrs(), f = Object.keys(d);
      for (let g = 0, p = f.length; g < p; g += 1) {
        const m = d[f[g]];
        if (m[`${u}Marker`] || m[`${u}-marker`]) {
          const b = m.strokeWidth || m["stroke-width"];
          if (b)
            return parseFloat(b);
          break;
        }
      }
      return null;
    }, r = t[0], o = t[t.length - 1];
    let a, l;
    const c = s("source");
    c && (a = e.clone().move(r || n, -c));
    const h = s("target");
    return h && (l = n.clone().move(o || e, -h)), this.sourceMarkerPoint = a || e.clone(), this.targetMarkerPoint = l || n.clone(), {
      source: a,
      target: l
    };
  }
  findPath(t, e, n) {
    const s = this.cell.getConnector() || this.graph.options.connecting.connector;
    let r, o, a;
    if (typeof s == "string" ? r = s : (r = s.name, o = s.args), r) {
      const c = tn.registry.get(r);
      if (typeof c != "function")
        return tn.registry.onNotFound(r);
      a = c;
    } else
      a = tn.presets.normal;
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
      const h = this.normalizeLabelPosition(l.position), u = Nt({}, r, h), d = this.getLabelTransformationMatrix(u);
      c.setAttribute("transform", qn(d));
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
    return t === null ? null : t === void 0 ? e === null ? null : e : Nt({}, e, t);
  }
  // #endregion
  getConnection() {
    return this.path != null ? this.path.clone() : null;
  }
  getConnectionPathData() {
    if (this.path == null)
      return "";
    const t = this.cache.pathCache;
    return Ri(t, "data") || (t.data = this.path.serialize()), t.data || "";
  }
  getConnectionSubdivisions() {
    if (this.path == null)
      return null;
    const t = this.cache.pathCache;
    return Ri(t, "segmentSubdivisions") || (t.segmentSubdivisions = this.path.getSegmentSubdivisions()), t.segmentSubdivisions;
  }
  getConnectionLength() {
    if (this.path == null)
      return 0;
    const t = this.cache.pathCache;
    return Ri(t, "length") || (t.length = this.path.length({
      segmentSubdivisions: this.getConnectionSubdivisions()
    })), t.length;
  }
  getPointAtLength(t) {
    return this.path == null ? null : this.path.pointAtLength(t, {
      segmentSubdivisions: this.getConnectionSubdivisions()
    });
  }
  getPointAtRatio(t) {
    return this.path == null ? null : (Te(t) && (t = parseFloat(t) / 100), this.path.pointAt(t, {
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
    const l = a && a.absoluteOffset, c = !(a && a.absoluteDistance), h = a && a.absoluteDistance && a.reverseDistance, u = this.path, d = {
      segmentSubdivisions: this.getConnectionSubdivisions()
    }, f = new w(t, e), g = u.closestPointT(f, d), p = this.getConnectionLength() || 0;
    let m = u.lengthAtT(g, d);
    c && (m = p > 0 ? m / p : 0), h && (m = -1 * (p - m) || 1), r.distance = m;
    let b;
    l || (b = u.tangentAtT(g));
    let v;
    if (b)
      v = b.pointOffset(f);
    else {
      const y = u.pointAtT(g), x = f.diff(y);
      v = { x: x.x, y: x.y };
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
    const h = l.x !== 0 || l.y !== 0 || a === 0, u = n.keepGradient, d = n.ensureLegibility, f = this.path, g = { segmentSubdivisions: this.getConnectionSubdivisions() }, p = o ? r * this.getConnectionLength() : r, m = f.tangentAtLength(p, g);
    let b, v = s;
    if (m) {
      if (h)
        b = m.start, b.translate(l);
      else {
        const y = m.clone();
        y.rotate(-90, m.start), y.setLength(a), b = y.end;
      }
      u && (v = m.angle() + s, d && (v = ct.normalize((v + 90) % 180 - 90)));
    } else
      b = f.start, h && b.translate(l);
    return $t().translate(b.x, b.y).rotate(v);
  }
  getVertexIndex(t, e) {
    const s = this.cell.getVertices(), r = this.getClosestPointLength(new w(t, e));
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
    if (Sc(t.target, "edge-tool", this.container)) {
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
      initialTerminal: lr(this.cell[t]),
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
    const l = this.graph.options.connecting, c = l.allowLoop, h = l.allowNode, u = l.allowEdge, d = l.allowPort, f = l.allowMulti, g = l.validateConnection, p = o ? o.cell : null, m = r === "target" ? n : t, b = r === "target" ? s : e;
    let v = !0;
    const y = (x) => {
      const E = r === "source" ? a ? a.port : null : p ? p.getSourcePortId() : null, S = r === "target" ? a ? a.port : null : p ? p.getTargetPortId() : null;
      return z(x, this.graph, {
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
    if (c != null && (typeof c == "boolean" ? !c && t === n && (v = !1) : v = y(c)), v && d != null && (typeof d == "boolean" ? !d && b && (v = !1) : v = y(d)), v && u != null && (typeof u == "boolean" ? !u && Ne.isEdgeView(m) && (v = !1) : v = y(u)), v && h != null && b == null && (typeof h == "boolean" ? !h && ge.isNodeView(m) && (v = !1) : v = y(h)), v && f != null && o) {
      const x = o.cell, E = r === "source" ? a : x.getSource(), S = r === "target" ? a : x.getTarget(), C = a ? this.graph.getCellById(a.cell) : null;
      if (E && S && E.cell && S.cell && C)
        if (typeof f == "function")
          v = y(f);
        else {
          const O = this.graph.model.getConnectedEdges(C, {
            outgoing: r === "source",
            incoming: r === "target"
          });
          O.length && (f === "withPort" ? O.some((I) => {
            const T = I.getSource(), j = I.getTarget();
            return T && j && T.cell === E.cell && j.cell === S.cell && T.port != null && T.port === E.port && j.port != null && j.port === S.port;
          }) && (v = !1) : f || O.some((I) => {
            const T = I.getSource(), j = I.getTarget();
            return T && j && T.cell === E.cell && j.cell === S.cell;
          }) && (v = !1));
        }
    }
    return v && g != null && (v = y(g)), v;
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
      const x = s.renderer.findEdgeViewsFromPoint({ x: t, y: e }, a).filter((E) => E !== this);
      c.push(...x);
    }
    const h = n.closestView || null, u = n.closestMagnet || null;
    n.closestView = null, n.closestMagnet = null;
    let d, f = Number.MAX_SAFE_INTEGER;
    const g = new w(t, e);
    c.forEach((x) => {
      if (x.container.getAttribute("magnet") !== "false") {
        if (x.isNodeView())
          d = l === "center" ? x.cell.getBBox().getCenter().distance(g) : x.cell.getBBox().getNearestPointToPoint(g).distance(g);
        else if (x.isEdgeView()) {
          const E = x.getClosestPoint(g);
          E ? d = E.distance(g) : d = Number.MAX_SAFE_INTEGER;
        }
        d < a && d < f && (u === x.container || this.validateConnection(...n.getValidateConnectionArgs(x, null), x.getEdgeTerminal(x.container, t, e, this.cell, n.terminalType))) && (f = d, n.closestView = x, n.closestMagnet = x.container);
      }
      x.container.querySelectorAll("[magnet]").forEach((E) => {
        if (E.getAttribute("magnet") !== "false") {
          const S = x.getBBoxOfElement(E);
          d = g.distance(S.getCenter()), d < a && d < f && (u === E || this.validateConnection(...n.getValidateConnectionArgs(x, E), x.getEdgeTerminal(E, t, e, this.cell, n.terminalType))) && (f = d, n.closestView = x, n.closestMagnet = E);
        }
      });
    });
    let p;
    const m = n.terminalType, b = n.closestView, v = n.closestMagnet, y = u !== v;
    if (h && y && h.unhighlight(u, {
      type: "magnetAdsorbed"
    }), b) {
      if (!y)
        return;
      b.highlight(v, {
        type: "magnetAdsorbed"
      }), p = b.getEdgeTerminal(v, t, e, this.cell, m);
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
    if (r && !wt.equalTerminals(s, r)) {
      const a = this.graph, l = s, c = l.cell ? a.getCellById(l.cell) : null, h = l.port, u = c ? a.findViewByCell(c) : null, d = c || t.isNewEdge ? null : w.create(s).toJSON(), f = r, g = f.cell ? a.getCellById(f.cell) : null, p = f.port, m = g ? a.findViewByCell(g) : null, b = g ? null : w.create(r).toJSON();
      this.notify("edge:connected", {
        e,
        previousCell: c,
        previousPort: h,
        previousView: u,
        previousPoint: d,
        currentCell: g,
        currentView: m,
        currentPort: p,
        currentPoint: b,
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
        for (let c = 0, h = l.length; c < h; c += 1)
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
    const s = this.getEventData(t), r = this.cell.getLabelAt(s.index), o = Nt({}, r, {
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
})(Ne || (Ne = {}));
Ne.config({
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
Ne.registry.register("edge", Ne, !0);
var I1 = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
};
class Ce extends it {
  /** Graph's `this.container` is from outer, should not dispose */
  get disposeContainer() {
    return !1;
  }
  get options() {
    return this.graph.options;
  }
  constructor(t) {
    super(), this.graph = t;
    const { selectors: e, fragment: n } = pt.parseJSONMarkup(Ce.markup);
    this.background = e.background, this.grid = e.grid, this.svg = e.svg, this.defs = e.defs, this.viewport = e.viewport, this.primer = e.primer, this.stage = e.stage, this.decorator = e.decorator, this.overlay = e.overlay, this.container = this.options.container, this.restore = Ce.snapshoot(this.container), U(this.container, this.prefixClassName("graph")), hn(this.container, n), this.delegateEvents();
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
    return t.type === "mousedown" && t.button === 2 || this.options.guard && this.options.guard(t, e) ? !0 : t.data && t.data.guarded !== void 0 ? t.data.guarded : !(e && e.cell && J.isCell(e.cell) || this.svg === t.target || this.container === t.target || this.svg.contains(t.target));
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
      const o = new we(t, {
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
I1([
  it.dispose()
], Ce.prototype, "dispose", null);
(function(i) {
  const t = `${oe.prefixCls}-graph`;
  i.markup = [
    {
      ns: Rt.xhtml,
      tagName: "div",
      selector: "background",
      className: `${t}-background`
    },
    {
      ns: Rt.xhtml,
      tagName: "div",
      selector: "grid",
      className: `${t}-grid`
    },
    {
      ns: Rt.svg,
      tagName: "svg",
      selector: "svg",
      className: `${t}-svg`,
      attrs: {
        width: "100%",
        height: "100%",
        "xmlns:xlink": Rt.xlink
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
      for (Ai(n); n.attributes.length > 0; )
        n.removeAttribute(n.attributes[0].name);
      for (let r = 0, o = s.attributes.length; r < o; r += 1) {
        const a = s.attributes[r];
        n.setAttribute(a.name, a.value);
      }
      s.childNodes.forEach((r) => n.appendChild(r));
    };
  }
  i.snapshoot = e;
})(Ce || (Ce = {}));
(function(i) {
  const t = oe.prefixCls;
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
})(Ce || (Ce = {}));
const j1 = `.x6-graph {
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
class _t extends Ut {
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
var k1 = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
};
class Sr extends _t {
  init() {
    Ps("core", j1);
  }
  dispose() {
    As("core");
  }
}
k1([
  Sr.dispose()
], Sr.prototype, "dispose", null);
var R1 = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
}, Ei;
(function(i) {
  function t(e) {
    const { grid: n, panning: s, mousewheel: r, embedding: o } = e, a = R1(
      e,
      ["grid", "panning", "mousewheel", "embedding"]
    ), l = e.container;
    if (l != null)
      a.width == null && (a.width = l.clientWidth), a.height == null && (a.height = l.clientHeight);
    else
      throw new Error("Ensure the container of the graph is specified and valid");
    const c = Nt({}, i.defaults, a), h = { size: 10, visible: !1 };
    return typeof n == "number" ? c.grid = { size: n, visible: !1 } : typeof n == "boolean" ? c.grid = Object.assign(Object.assign({}, h), { visible: n }) : c.grid = Object.assign(Object.assign({}, h), n), [
      "panning",
      "mousewheel",
      "embedding"
    ].forEach((d) => {
      const f = e[d];
      typeof f == "boolean" ? c[d].enabled = f : c[d] = Object.assign(Object.assign({}, c[d]), f);
    }), c;
  }
  i.get = t;
})(Ei || (Ei = {}));
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
          className: oe.prefix("available-node")
        }
      },
      magnetAvailable: {
        name: "className",
        args: {
          className: oe.prefix("available-magnet")
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
        return new A1();
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
})(Ei || (Ei = {}));
var D1 = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
}, $1 = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
};
class so extends _t {
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
      const h = `pattern_${c}`, u = n.a || 1, d = n.d || 1, { update: f, markup: g } = l, p = $1(l, ["update", "markup"]), m = Object.assign(Object.assign(Object.assign({}, p), r[c]), {
        sx: u,
        sy: d,
        ox: n.e || 0,
        oy: n.f || 0,
        width: e * u,
        height: e * d
      });
      s.has(h) || s.add(h, G.create("pattern", { id: h, patternUnits: "userSpaceOnUse" }, G.createVectors(g)).node);
      const b = s.get(h);
      typeof f == "function" && f(b.childNodes[0], m);
      let v = m.ox % m.width;
      v < 0 && (v += m.width);
      let y = m.oy % m.height;
      y < 0 && (y += m.height), et(b, {
        x: v,
        y,
        width: m.width,
        height: m.height
      });
    });
    const o = new XMLSerializer().serializeToString(s.root), a = `url(data:image/svg+xml;base64,${btoa(o)})`;
    this.elem.style.backgroundImage = a;
  }
  getInstance() {
    return this.instance || (this.instance = new De()), this.instance;
  }
  resolveGrid(t) {
    if (!t)
      return [];
    const e = t.type;
    if (e == null)
      return [
        Object.assign(Object.assign({}, De.presets.dot), t.args)
      ];
    const n = De.registry.get(e);
    if (n) {
      let s = t.args || [];
      return Array.isArray(s) || (s = [s]), Array.isArray(n) ? n.map((r, o) => Object.assign(Object.assign({}, r), s[o])) : [Object.assign(Object.assign({}, n), s[0])];
    }
    return De.registry.onNotFound(e);
  }
  dispose() {
    this.stopListening(), this.clear();
  }
}
D1([
  _t.dispose()
], so.prototype, "dispose", null);
class kh extends _t {
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
    return t !== this.viewportTransformString && (this.viewportMatrix = this.viewport.getCTM(), this.viewportTransformString = t), $t(this.viewportMatrix);
  }
  /**
   * Sets new transformation with the given `matrix`
   */
  setMatrix(t) {
    const e = $t(t);
    e.a = Number.isFinite(e.a) ? e.a : 1, e.b = Number.isFinite(e.b) ? e.b : 0, e.c = Number.isFinite(e.c) ? e.c : 0, e.d = Number.isFinite(e.d) ? e.d : 1, e.e = Number.isFinite(e.e) ? e.e : 0, e.f = Number.isFinite(e.f) ? e.f : 0;
    const n = qn(e);
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
    return ta(t) || (t = this.container.clientWidth), ta(e) || (e = this.container.clientHeight), { width: t, height: e };
  }
  getScale() {
    return j0(this.getMatrix());
  }
  scale(t, e = t, n = 0, s = 0) {
    if (t = this.clampScale(t), e = this.clampScale(e), n || s) {
      const l = this.getTranslation(), c = l.tx - n * (t - 1), h = l.ty - s * (e - 1);
      (c !== l.tx || h !== l.ty) && this.translate(c, h);
    }
    const r = this.getMatrix(), o = Number.isFinite(t) ? t : 1, a = Number.isFinite(e) ? e : 1;
    return r.a = o, r.d = a, this.setMatrix(r), this.graph.trigger("scale", { sx: o, sy: a, ox: n, oy: s }), this;
  }
  clampScale(t) {
    const e = this.graph.options.scaling;
    return se(t, e.min || 0.01, e.max || 16);
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
      const c = this.getTranslation(), h = r.sx === 0 ? 1 : r.sx, u = r.sy === 0 ? 1 : r.sy, d = a - (a - c.tx) * (n / h), f = l - (l - c.ty) * (s / u);
      (d !== c.tx || f !== c.ty) && this.translate(d, f);
    }
    return this.scale(n, s), this;
  }
  getRotation() {
    return k0(this.getMatrix());
  }
  rotate(t, e, n) {
    if (e == null || n == null) {
      const r = at.getBBox(this.stage);
      e = r.width / 2, n = r.height / 2;
    }
    const s = this.getMatrix().translate(e, n).rotate(t).translate(-e, -n);
    return this.setMatrix(s), this;
  }
  getTranslation() {
    return R0(this.getMatrix());
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
      const y = t;
      t = y.gridWidth || 1, e = y.gridHeight || 1, n = y.padding || 0, s = y;
    } else
      t = t || 1, e = e || 1, n = n || 0, s == null && (s = {});
    const r = nn(n), o = s.border || 0, a = s.contentArea ? R.create(s.contentArea) : this.getContentArea(s);
    o > 0 && a.inflate(o);
    const l = this.getScale(), c = this.getTranslation(), h = l.sx, u = l.sy;
    a.x *= h, a.y *= u, a.width *= h, a.height *= u;
    let d = Math.max(Math.ceil((a.width + a.x) / t), 1) * t, f = Math.max(Math.ceil((a.height + a.y) / e), 1) * e, g = 0, p = 0;
    (s.allowNewOrigin === "negative" && a.x < 0 || s.allowNewOrigin === "positive" && a.x >= 0 || s.allowNewOrigin === "any") && (g = Math.ceil(-a.x / t) * t, g += r.left, d += g), (s.allowNewOrigin === "negative" && a.y < 0 || s.allowNewOrigin === "positive" && a.y >= 0 || s.allowNewOrigin === "any") && (p = Math.ceil(-a.y / e) * e, p += r.top, f += p), d += r.right, f += r.bottom, d = Math.max(d, s.minWidth || 0), f = Math.max(f, s.minHeight || 0), d = Math.min(d, s.maxWidth || Number.MAX_SAFE_INTEGER), f = Math.min(f, s.maxHeight || Number.MAX_SAFE_INTEGER);
    const m = this.getComputedSize(), b = d !== m.width || f !== m.height;
    return (g !== c.tx || p !== c.ty) && this.translate(g, p), b && this.resize(d, f), new R(-g / h, -p / u, d / h, f / u);
  }
  scaleContentToFit(t = {}) {
    this.scaleContentToFitImpl(t);
  }
  scaleContentToFitImpl(t = {}, e = !0) {
    let n, s;
    if (t.contentArea) {
      const b = t.contentArea;
      n = this.graph.localToGraph(b), s = w.create(b);
    } else
      n = this.getContentBBox(t), s = this.graph.graphToLocal(n);
    if (!n.width || !n.height)
      return;
    const r = nn(t.padding), o = t.minScale || 0, a = t.maxScale || Number.MAX_SAFE_INTEGER, l = t.minScaleX || o, c = t.maxScaleX || a, h = t.minScaleY || o, u = t.maxScaleY || a;
    let d;
    if (t.viewportArea)
      d = t.viewportArea;
    else {
      const b = this.getComputedSize(), v = this.getTranslation();
      d = {
        x: v.tx,
        y: v.ty,
        width: b.width,
        height: b.height
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
    if (m && (g = m * Math.floor(g / m), p = m * Math.floor(p / m)), g = se(g, l, c), p = se(p, h, u), this.scale(g, p), e) {
      const b = this.options, v = d.x - s.x * g - b.x, y = d.y - s.y * p - b.y;
      this.translate(v, y);
    }
  }
  getContentArea(t = {}) {
    return t.useCellGeometry !== !1 ? this.model.getAllCellsBBox() || new R() : at.getBBox(this.stage);
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
    e = ue(e, Math.max(0, s.width)), e < 0 && (e = s.width + e), n = ue(n, Math.max(0, s.height)), n < 0 && (n = s.height + n);
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
var _1 = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
};
class ro extends _t {
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
    const l = bi.registry.get(a);
    if (typeof l == "function") {
      const h = e.quality || 1;
      t.width *= h, t.height *= h;
      const u = l(t, e);
      if (!(u instanceof HTMLCanvasElement))
        throw new Error("Background pattern must return an HTML Canvas instance");
      s = u.toDataURL("image/png"), e.repeat && a !== e.repeat ? a = e.repeat : a = "repeat", typeof o == "object" ? (o.width *= u.width / t.width, o.height *= u.height / t.height) : o === void 0 && (e.size = {
        width: u.width / h,
        height: u.height / h
      });
    } else
      s = t.src, o === void 0 && (e.size = {
        width: t.width,
        height: t.height
      });
    n != null && typeof e.size == "object" && e.image === n.image && e.repeat === n.repeat && e.quality === n.quality && (n.size = lr(e.size));
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
      this.optionsCache = lr(e);
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
_1([
  _t.dispose()
], ro.prototype, "dispose", null);
var B1 = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
};
class oo extends _t {
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
    this.graph.on("blank:mousedown", this.onMouseDown, this), this.graph.on("node:unhandled:mousedown", this.onMouseDown, this), this.graph.on("edge:unhandled:mousedown", this.onMouseDown, this), Vt.on(this.graph.container, "mousedown", this.onRightMouseDown), Vt.on(document.body, {
      keydown: this.onKeyDown,
      keyup: this.onKeyUp
    }), this.mousewheelHandle = new $c(this.graph.container, this.onMouseWheel.bind(this), this.allowMouseWheel.bind(this)), this.mousewheelHandle.enable();
  }
  stopListening() {
    this.graph.off("blank:mousedown", this.onMouseDown, this), this.graph.off("node:unhandled:mousedown", this.onMouseDown, this), this.graph.off("edge:unhandled:mousedown", this.onMouseDown, this), Vt.off(this.graph.container, "mousedown", this.onRightMouseDown), Vt.off(document.body, {
      keydown: this.onKeyDown,
      keyup: this.onKeyUp
    }), this.mousewheelHandle && this.mousewheelHandle.disable();
  }
  allowPanning(t, e) {
    return t.spaceKey = this.isSpaceKeyPressed, this.pannable && ze.isMatch(t, this.widgetOptions.modifiers, e);
  }
  startPanning(t) {
    const e = this.view.normalizeEvent(t);
    this.clientX = e.clientX, this.clientY = e.clientY, this.panning = !0, this.updateClassName(t), Vt.on(document.body, {
      "mousemove.panning touchmove.panning": this.pan.bind(this),
      "mouseup.panning touchend.panning": this.stopPanning.bind(this),
      "mouseleave.panning": this.stopPanning.bind(this)
    }), Vt.on(window, "mouseup.panning", this.stopPanning.bind(this));
  }
  pan(t) {
    const e = this.view.normalizeEvent(t), n = e.clientX - this.clientX, s = e.clientY - this.clientY;
    this.clientX = e.clientX, this.clientY = e.clientY, this.graph.translateBy(n, s);
  }
  // eslint-disable-next-line
  stopPanning(t) {
    this.panning = !1, this.updateClassName(t), Vt.off(document.body, ".panning"), Vt.off(window, ".panning");
  }
  updateClassName(t) {
    const e = this.widgetOptions.eventTypes;
    if ((e == null ? void 0 : e.length) === 1 && e.includes("mouseWheel"))
      return;
    const n = this.view.container, s = this.view.prefixClassName("graph-panning"), r = this.view.prefixClassName("graph-pannable"), o = this.graph.getPlugin("selection"), a = o && o.allowRubberband(t, !0), l = (e == null ? void 0 : e.includes("leftMouseDown")) && !a;
    this.allowPanning(t ?? {}, !0) || this.allowPanning(t ?? {}) && l ? this.panning ? (U(n, s), Ht(n, r)) : (Ht(n, s), U(n, r)) : this.panning || (Ht(n, s), Ht(n, r));
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
B1([
  _t.dispose()
], oo.prototype, "dispose", null);
var z1 = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
};
class ao extends _t {
  constructor() {
    super(...arguments), this.cumulatedFactor = 1;
  }
  get widgetOptions() {
    return this.options.mousewheel;
  }
  init() {
    this.container = this.graph.container, this.target = this.widgetOptions.global ? document : this.container, this.mousewheelHandle = new $c(this.target, this.onMouseWheel.bind(this), this.allowMouseWheel.bind(this)), this.widgetOptions.enabled && this.enable(!0);
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
    return (e == null || e(t)) && ze.isMatch(t, this.widgetOptions.modifiers);
  }
  onMouseWheel(t) {
    const e = this.widgetOptions.guard;
    if ((e == null || e(t)) && ze.isMatch(t, this.widgetOptions.modifiers)) {
      const n = this.widgetOptions.factor || 1.2;
      this.currentScale == null && (this.startPos = { x: t.clientX, y: t.clientY }, this.currentScale = this.graph.transform.getScale().sx), t.deltaY < 0 ? (this.currentScale < 0.15 ? this.cumulatedFactor = (this.currentScale + 0.01) / this.currentScale : this.cumulatedFactor = Math.round(this.currentScale * n * 20) / 20 / this.currentScale, this.cumulatedFactor <= 1 && (this.cumulatedFactor = 1.05)) : (this.currentScale <= 0.15 ? this.cumulatedFactor = (this.currentScale - 0.01) / this.currentScale : this.cumulatedFactor = Math.round(this.currentScale * (1 / n) * 20) / 20 / this.currentScale, this.cumulatedFactor >= 1 && (this.cumulatedFactor = 0.95)), this.cumulatedFactor = Math.max(0.01, Math.min(this.currentScale * this.cumulatedFactor, 160) / this.currentScale);
      const r = this.currentScale;
      let o = this.graph.transform.clampScale(r * this.cumulatedFactor);
      const a = this.widgetOptions.minScale || Number.MIN_SAFE_INTEGER, l = this.widgetOptions.maxScale || Number.MAX_SAFE_INTEGER;
      if (o = se(o, a, l), o !== r)
        if (this.widgetOptions.zoomAtMousePosition) {
          const h = !!this.graph.getPlugin("scroller") ? this.graph.clientToLocal(this.startPos) : this.graph.clientToGraph(this.startPos);
          this.graph.zoom(o, {
            absolute: !0,
            center: h.clone()
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
z1([
  Ut.dispose()
], ao.prototype, "dispose", null);
var V1 = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
};
class Rh extends _t {
  init() {
    this.resetRenderArea = _y(this.resetRenderArea, 200, {
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
V1([
  _t.dispose()
], Rh.prototype, "dispose", null);
class F1 {
  constructor() {
    this.isFlushing = !1, this.isFlushPending = !1, this.scheduleId = 0, this.queue = [], this.frameInterval = 33, this.initialTime = Date.now();
  }
  queueJob(t) {
    if (t.priority & Oe.PRIOR)
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
var Oe;
(function(i) {
  i[i.Update = 2] = "Update", i[i.RenderEdge = 4] = "RenderEdge", i[i.RenderNode = 8] = "RenderNode", i[i.PRIOR = 1048576] = "PRIOR";
})(Oe || (Oe = {}));
var G1 = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
};
class jt extends Ut {
  get model() {
    return this.graph.model;
  }
  get container() {
    return this.graph.view.stage;
  }
  constructor(t) {
    super(), this.views = {}, this.willRemoveViews = {}, this.queue = new F1(), this.graph = t, this.init();
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
    n && this.requestViewUpdate(n.view, jt.FLAG_INSERT, e, Oe.Update, !0);
  }
  onCellVisibleChanged({ cell: t, current: e }) {
    this.toggleVisible(t, !!e);
  }
  requestViewUpdate(t, e, n = {}, s = Oe.Update, r = !0) {
    const o = t.cell.id, a = this.views[o];
    if (!a)
      return;
    a.flag = e, a.options = n, (t.hasAction(e, ["translate", "resize", "rotate"]) || n.async === !1) && (s = Oe.PRIOR, r = !1), this.queue.queueJob({
      id: o,
      priority: s,
      cb: () => {
        this.renderViewInArea(t, e, n);
        const h = n.queue;
        if (h) {
          const u = h.indexOf(t.cell.id);
          u >= 0 && h.splice(u, 1), h.length === 0 && this.graph.trigger("render:done");
        }
      }
    }), this.getEffectedEdges(t).forEach((h) => {
      this.requestViewUpdate(h.view, h.flag, n, s, !1);
    }), r && this.flush();
  }
  setRenderArea(t) {
    this.renderArea = t, this.flushWaitingViews();
  }
  isViewMounted(t) {
    if (t == null)
      return !1;
    const e = this.views[t.cell.id];
    return e ? e.state === jt.ViewState.MOUNTED : !1;
  }
  renderViews(t, e = {}) {
    t.sort((n, s) => n.isNode() && s.isEdge() ? -1 : 0), t.forEach((n) => {
      const s = n.id, r = this.views;
      let o = 0, a = r[s];
      if (a)
        o = jt.FLAG_INSERT;
      else {
        const l = this.createCellView(n);
        l && (l.graph = this.graph, o = jt.FLAG_INSERT | l.getBootstrapFlag(), a = {
          view: l,
          flag: o,
          options: e,
          state: jt.ViewState.CREATED
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
    this.isUpdatable(t) ? (a = this.updateView(t, e, n), o.flag = a) : o.state === jt.ViewState.MOUNTED ? (a = this.updateView(t, e, n), o.flag = a) : o.state = jt.ViewState.WAITING, a && s.isEdge() && !(a & t.getFlag(["source", "target"])) && this.queue.queueJob({
      id: r,
      priority: Oe.RenderEdge,
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
      if (t && t.state === jt.ViewState.WAITING) {
        const { view: e, flag: n, options: s } = t;
        this.requestViewUpdate(e, n, s, this.getRenderPriority(e), !1);
      }
    }), this.flush();
  }
  updateView(t, e, n = {}) {
    if (t == null)
      return 0;
    if (Pt.isCellView(t)) {
      if (e & jt.FLAG_REMOVE)
        return this.removeView(t.cell), 0;
      e & jt.FLAG_INSERT && (this.insertView(t), e ^= jt.FLAG_INSERT);
    }
    return e ? t.confirmUpdate(e, n) : 0;
  }
  insertView(t) {
    const e = this.views[t.cell.id];
    if (e) {
      const n = t.cell.getZIndex(), s = this.addZPivot(n);
      this.container.insertBefore(t.container, s), t.cell.isVisible() || this.toggleVisible(t.cell, !1), e.state = jt.ViewState.MOUNTED, this.graph.trigger("view:mounted", { view: t });
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
    s && kt(s.view.container, {
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
      const r = Pt.registry.get(s);
      return r ? new r(t, e) : Pt.registry.onNotFound(s);
    }
    return t.isNode() ? new ge(t, e) : t.isEdge() ? new Ne(t, e) : null;
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
      const h = ["update"];
      a.getTargetCell() === n && h.push("target"), a.getSourceCell() === n && h.push("source"), e.push({
        id: a.id,
        view: c,
        flag: c.getFlag(h)
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
    return t.cell.isNode() ? Oe.RenderNode : Oe.RenderEdge;
  }
  dispose() {
    this.stopListening(), Object.keys(this.views).forEach((t) => {
      this.views[t].view.dispose();
    }), this.views = {};
  }
}
G1([
  Ut.dispose()
], jt.prototype, "dispose", null);
(function(i) {
  i.FLAG_INSERT = 1 << 30, i.FLAG_REMOVE = 1 << 29, i.FLAG_RENDER = (1 << 26) - 1;
})(jt || (jt = {}));
(function(i) {
  (function(t) {
    t[t.CREATED = 0] = "CREATED", t[t.MOUNTED = 1] = "MOUNTED", t[t.WAITING = 2] = "WAITING";
  })(i.ViewState || (i.ViewState = {}));
})(jt || (jt = {}));
var H1 = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
};
class lo extends _t {
  constructor() {
    super(...arguments), this.schedule = new jt(this.graph);
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
    const e = J.isCell(t) ? t.id : t, n = this.schedule.views;
    return n[e] ? n[e].view : null;
  }
  findViewsFromPoint(t) {
    const e = { x: t.x, y: t.y };
    return this.model.getCells().map((n) => this.findViewByCell(n)).filter((n) => n != null ? at.getBBox(n.container, {
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
        const r = at.getBBox(s.container, {
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
H1([
  _t.dispose()
], lo.prototype, "dispose", null);
var Ta = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
};
class Dh extends _t {
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
    if (e || (e = `filter-${n}-${this.cid}-${Hs(JSON.stringify(t))}`), !this.isDefined(e)) {
      const s = On.registry.get(n);
      if (s == null)
        return On.registry.onNotFound(n);
      const r = s(t.args || {}), o = Object.assign(Object.assign({ x: -1, y: -1, width: 3, height: 3, filterUnits: "objectBoundingBox" }, t.attrs), { id: e });
      G.create(pt.sanitize(r), o).appendTo(this.defs);
    }
    return e;
  }
  gradient(t) {
    let e = t.id;
    const n = t.type;
    if (e || (e = `gradient-${n}-${this.cid}-${Hs(JSON.stringify(t))}`), !this.isDefined(e)) {
      const r = t.stops.map((l) => {
        const c = l.opacity != null && Number.isFinite(l.opacity) ? l.opacity : 1;
        return `<stop offset="${l.offset}" stop-color="${l.color}" stop-opacity="${c}"/>`;
      }), o = `<${n}>${r.join("")}</${n}>`, a = Object.assign({ id: e }, t.attrs);
      G.create(o, a).appendTo(this.defs);
    }
    return e;
  }
  marker(t) {
    const { id: e, refX: n, refY: s, markerUnits: r, markerOrient: o, tagName: a, children: l } = t, c = Ta(t, ["id", "refX", "refY", "markerUnits", "markerOrient", "tagName", "children"]);
    let h = e;
    if (h || (h = `marker-${this.cid}-${Hs(JSON.stringify(t))}`), !this.isDefined(h)) {
      a !== "path" && delete c.d;
      const u = G.create("marker", {
        refX: n,
        refY: s,
        id: h,
        overflow: "visible",
        orient: o ?? "auto",
        markerUnits: r || "userSpaceOnUse"
      }, l ? l.map((d) => {
        var { tagName: f } = d, g = Ta(d, ["tagName"]);
        return G.create(`${f}` || "path", gi(Object.assign(Object.assign({}, c), g)));
      }) : [G.create(a || "path", gi(c))]);
      this.defs.appendChild(u.node);
    }
    return h;
  }
  remove(t) {
    const e = this.svg.getElementById(t);
    e && e.parentNode && e.parentNode.removeChild(e);
  }
}
class $h extends _t {
  getClientMatrix() {
    return $t(this.view.stage.getScreenCTM());
  }
  /**
   * Returns coordinates of the graph viewport, relative to the window.
   */
  getClientOffset() {
    const t = this.view.svg.getBoundingClientRect();
    return new w(t.left, t.top);
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
    const n = w.create(t, e);
    return at.transformPoint(n, this.graph.matrix());
  }
  localToClientPoint(t, e) {
    const n = w.create(t, e);
    return at.transformPoint(n, this.getClientMatrix());
  }
  localToPagePoint(t, e) {
    return (typeof t == "number" ? this.localToGraphPoint(t, e) : this.localToGraphPoint(t)).translate(this.getPageOffset());
  }
  localToGraphRect(t, e, n, s) {
    const r = R.create(t, e, n, s);
    return at.transformRectangle(r, this.graph.matrix());
  }
  localToClientRect(t, e, n, s) {
    const r = R.create(t, e, n, s);
    return at.transformRectangle(r, this.getClientMatrix());
  }
  localToPageRect(t, e, n, s) {
    return (typeof t == "number" ? this.localToGraphRect(t, e, n, s) : this.localToGraphRect(t)).translate(this.getPageOffset());
  }
  graphToLocalPoint(t, e) {
    const n = w.create(t, e);
    return at.transformPoint(n, this.graph.matrix().inverse());
  }
  clientToLocalPoint(t, e) {
    const n = w.create(t, e);
    return at.transformPoint(n, this.getClientMatrix().inverse());
  }
  clientToGraphPoint(t, e) {
    const n = w.create(t, e);
    return at.transformPoint(n, this.graph.matrix().multiply(this.getClientMatrix().inverse()));
  }
  pageToLocalPoint(t, e) {
    const s = w.create(t, e).diff(this.getPageOffset());
    return this.graphToLocalPoint(s);
  }
  graphToLocalRect(t, e, n, s) {
    const r = R.create(t, e, n, s);
    return at.transformRectangle(r, this.graph.matrix().inverse());
  }
  clientToLocalRect(t, e, n, s) {
    const r = R.create(t, e, n, s);
    return at.transformRectangle(r, this.getClientMatrix().inverse());
  }
  clientToGraphRect(t, e, n, s) {
    const r = R.create(t, e, n, s);
    return at.transformRectangle(r, this.graph.matrix().multiply(this.getClientMatrix().inverse()));
  }
  pageToLocalRect(t, e, n, s) {
    const r = R.create(t, e, n, s), o = this.getPageOffset();
    return r.x -= o.x, r.y -= o.y, this.graphToLocalRect(r);
  }
}
var q1 = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
};
class cs extends _t {
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
    } : n, r = s.name, o = Me.registry.get(r);
    return o == null ? Me.registry.onNotFound(r) : (Me.check(r, o), {
      name: r,
      highlighter: o,
      args: s.args || {}
    });
  }
  getHighlighterId(t, e) {
    return Wr(t), e.name + t.id + JSON.stringify(e.args);
  }
  unhighlight(t) {
    const e = this.highlights[t];
    e && (e.highlighter.unhighlight(e.cellView, e.magnet, e.args), delete this.highlights[t]);
  }
  dispose() {
    Object.keys(this.highlights).forEach((t) => this.unhighlight(t)), this.stopListening();
  }
}
q1([
  cs.dispose()
], cs.prototype, "dispose", null);
var U1 = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
};
class _h extends _t {
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
      e && ts.bind(e, () => {
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
    ts.clear(this.graph.container);
  }
}
U1([
  _t.dispose()
], _h.prototype, "dispose", null);
var W1 = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
};
let k = class Bh extends At {
  get container() {
    return this.options.container;
  }
  get [Symbol.toStringTag]() {
    return Bh.toStringTag;
  }
  constructor(t) {
    super(), this.installedPlugins = /* @__PURE__ */ new Set(), this.options = Ei.get(t), this.css = new Sr(this), this.view = new Ce(this), this.defs = new Dh(this), this.coord = new $h(this), this.transform = new kh(this), this.highlight = new cs(this), this.grid = new so(this), this.background = new ro(this), this.options.model ? this.model = this.options.model : (this.model = new Yt(), this.model.graph = this), this.renderer = new lo(this), this.panning = new oo(this), this.mousewheel = new ao(this), this.virtualRender = new Rh(this), this.size = new _h(this);
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
    return this.addCell(t.map((n) => mt.isNode(n) ? n : this.createNode(n)), e);
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
    return this.addCell(t.map((n) => wt.isEdge(n) ? n : this.createEdge(n)), e);
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
    return J.isCell(t) ? this.findViewByCell(t) : this.findViewByElem(t);
  }
  findViews(t) {
    return R.isRectangleLike(t) ? this.findViewsInArea(t) : w.isPointLike(t) ? this.findViewsFromPoint(t) : [];
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
W1([
  At.dispose()
], k.prototype, "dispose", null);
(function(i) {
  i.View = Ce, i.Renderer = lo, i.MouseWheel = ao, i.DefsManager = Dh, i.GridManager = so, i.CoordManager = $h, i.TransformManager = kh, i.HighlightManager = cs, i.BackgroundManager = ro, i.PanningManager = oo;
})(k || (k = {}));
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
})(k || (k = {}));
(function(i) {
  function t(e, n) {
    const s = e instanceof HTMLElement ? new i({ container: e }) : new i(e);
    return n != null && s.fromJSON(n), s;
  }
  i.render = t;
})(k || (k = {}));
(function(i) {
  i.registerNode = mt.registry.register, i.registerEdge = wt.registry.register, i.registerView = Pt.registry.register, i.registerAttr = Ee.registry.register, i.registerGrid = De.registry.register, i.registerFilter = On.registry.register, i.registerNodeTool = Mn.registry.register, i.registerEdgeTool = Tn.registry.register, i.registerBackground = bi.registry.register, i.registerHighlighter = Me.registry.register, i.registerPortLayout = Qe.registry.register, i.registerPortLabelLayout = Pn.registry.register, i.registerMarker = Fe.registry.register, i.registerRouter = $e.registry.register, i.registerConnector = tn.registry.register, i.registerAnchor = Nn.registry.register, i.registerEdgeAnchor = Ln.registry.register, i.registerConnectionPoint = In.registry.register;
})(k || (k = {}));
(function(i) {
  i.unregisterNode = mt.registry.unregister, i.unregisterEdge = wt.registry.unregister, i.unregisterView = Pt.registry.unregister, i.unregisterAttr = Ee.registry.unregister, i.unregisterGrid = De.registry.unregister, i.unregisterFilter = On.registry.unregister, i.unregisterNodeTool = Mn.registry.unregister, i.unregisterEdgeTool = Tn.registry.unregister, i.unregisterBackground = bi.registry.unregister, i.unregisterHighlighter = Me.registry.unregister, i.unregisterPortLayout = Qe.registry.unregister, i.unregisterPortLabelLayout = Pn.registry.unregister, i.unregisterMarker = Fe.registry.unregister, i.unregisterRouter = $e.registry.unregister, i.unregisterConnector = tn.registry.unregister, i.unregisterAnchor = Nn.registry.unregister, i.unregisterEdgeAnchor = Ln.registry.unregister, i.unregisterConnectionPoint = In.registry.unregister;
})(k || (k = {}));
var X1 = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
}, Y1 = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
};
class Rn extends mt {
}
(function(i) {
  class t extends ge {
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
        Ai(n);
        const s = i.shapeMaps[this.cell.shape];
        if (!s)
          return;
        let { html: r } = s;
        typeof r == "function" && (r = r(this.cell)), r && (typeof r == "string" ? n.innerHTML = r : hn(n, r));
      }
    }
    dispose() {
      this.cell.off("change:*", this.onCellChangeAny, this);
    }
  }
  X1([
    t.dispose()
  ], t.prototype, "dispose", null), i.View = t, function(e) {
    e.action = "html", e.config({
      bootstrap: [e.action],
      actions: {
        html: e.action
      }
    }), ge.registry.register("html-view", e, !0);
  }(t = i.View || (i.View = {}));
})(Rn || (Rn = {}));
(function(i) {
  i.config({
    view: "html-view",
    markup: [
      {
        tagName: "rect",
        selector: "body"
      },
      Object.assign({}, pt.getForeignObjectMarkup()),
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
  }), mt.registry.register("html", i, !0);
})(Rn || (Rn = {}));
(function(i) {
  i.shapeMaps = {};
  function t(e) {
    const { shape: n, html: s, effect: r, inherit: o } = e, a = Y1(e, ["shape", "html", "effect", "inherit"]);
    if (!n)
      throw new Error("should specify shape in config");
    i.shapeMaps[n] = {
      html: s,
      effect: r
    }, k.registerNode(n, Object.assign({ inherit: o || "html" }, a), !0);
  }
  i.register = t;
})(Rn || (Rn = {}));
var J1 = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
};
class zh extends it {
  get graph() {
    return this.options.graph;
  }
  get boxClassName() {
    return this.prefixClassName(Xt.classNames.box);
  }
  get $boxes() {
    return s0(this.container, this.boxClassName);
  }
  get handleOptions() {
    return this.options;
  }
  constructor(t) {
    super(), this.options = t, this.options.model && (this.options.collection = this.options.model.collection), this.options.collection ? this.collection = this.options.collection : (this.collection = new ls([], {
      comparator: Xt.depthComparator
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
    const { showNodeSelectionBox: n, pointerEvents: s } = this.options, { ui: r, selection: o, translateBy: a, snapped: l } = e, c = (n !== !0 || s && this.getPointerEventsValue(s) === "none") && !this.translating && !o, h = r && a && t.id === a;
    if (c && (h || l)) {
      this.translating = !0;
      const u = t.position(), d = t.previous("position"), f = u.x - d.x, g = u.y - d.y;
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
      const r = br(s), o = s.scrollLeft, a = s.scrollTop;
      e = t.clientX - r.left + window.pageXOffset + o, n = t.clientY - r.top + window.pageYOffset + a;
    }
    kt(this.container, {
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
    }), this.delegateDocumentEvents(Xt.documentEvents, t.data);
  }
  filter(t) {
    const e = this.options.filter;
    return t.filter((n) => Array.isArray(e) ? e.some((s) => typeof s == "string" ? n.shape === s : n.id === s.id) : typeof e == "function" ? z(e, this.graph, n) : !0);
  }
  stopSelecting(t) {
    const e = this.graph, n = this.getEventData(t);
    switch (n.action) {
      case "selecting": {
        let r = B0(this.container), o = z0(this.container);
        const a = br(this.container), l = e.pageToLocal(a.left, a.top), c = e.transform.getScale();
        r /= c.sx, o /= c.sy;
        const h = new R(l.x, l.y, r, o), u = this.getCellViewsInArea(h).map((d) => d.cell);
        this.reset(u, { batch: !0 }), this.hideRubberband();
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
    this.notifyBoxEvent("box:mousedown", e, s.x, s.y), this.delegateDocumentEvents(Xt.documentEvents, e.data);
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
      const o = this.collection.toArray(), a = J.getCellsBBox(o, { deep: !0 }) || R.create(), l = r.x - a.x, c = r.y - a.y, h = r.x + r.width - (a.x + a.width), u = r.y + r.height - (a.y + a.height);
      if (n < l && (n = l), s < c && (s = c), h < n && (n = h), u < s && (s = u), !this.options.following) {
        const d = t.x - e.originX, f = t.y - e.originY;
        n = d <= l || d >= h ? 0 : n, s = f <= c || f >= u ? 0 : s;
      }
    }
    return {
      dx: n,
      dy: s
    };
  }
  updateElementPosition(t, e, n) {
    const s = kt(t, "left"), r = kt(t, "top"), o = s ? parseFloat(s) : 0, a = r ? parseFloat(r) : 0;
    kt(t, "left", o + e), kt(t, "top", a + n);
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
        r.moving !== !0 && (ri(this.container, this.graph.container), this.showRubberband(), r.moving = !0);
        const { scrollerX: o, scrollerY: a } = this.autoScrollGraph(e.clientX, e.clientY);
        r.scrollerX += o, r.scrollerY += a;
        const l = e.clientX - r.clientX + r.scrollerX, c = e.clientY - r.clientY + r.scrollerY, h = parseInt(kt(this.container, "left") || "0", 10), u = parseInt(kt(this.container, "top") || "0", 10);
        kt(this.container, {
          left: l < 0 ? r.offsetX + l : h,
          top: c < 0 ? r.offsetY + c : u,
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
    this.removeCellUnSelectedClassName(t), this.canShowSelectionBox(t) && (ve(this.container.querySelector(`[data-cell-id="${t.id}"]`)), this.$boxes.length === 0 && this.hide(), this.boxCount = Math.max(0, this.boxCount - 1));
  }
  destroyAllSelectionBoxes(t) {
    t.forEach((e) => this.removeCellUnSelectedClassName(e)), this.hide(), ve(this.$boxes), this.boxCount = 0;
  }
  hide() {
    Ht(this.container, this.prefixClassName(Xt.classNames.rubberband)), Ht(this.container, this.prefixClassName(Xt.classNames.selected));
  }
  showRubberband() {
    U(this.container, this.prefixClassName(Xt.classNames.rubberband));
  }
  hideRubberband() {
    Ht(this.container, this.prefixClassName(Xt.classNames.rubberband));
  }
  showSelected() {
    Zr(this.container, "style"), U(this.container, this.prefixClassName(Xt.classNames.selected));
  }
  createContainer() {
    this.container = document.createElement("div"), U(this.container, this.prefixClassName(Xt.classNames.root)), this.options.className && U(this.container, this.options.className), this.selectionContainer = document.createElement("div"), U(this.selectionContainer, this.prefixClassName(Xt.classNames.inner)), this.selectionContent = document.createElement("div"), U(this.selectionContent, this.prefixClassName(Xt.classNames.content)), hn(this.selectionContainer, this.selectionContent), et(this.selectionContainer, "data-selection-length", this.collection.length), Oc(this.container, this.selectionContainer);
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
    }), kt(this.selectionContainer, {
      position: "absolute",
      pointerEvents: "none",
      left: t.x,
      top: t.y,
      width: e.x - t.x,
      height: e.y - t.y
    }), et(this.selectionContainer, "data-selection-length", this.collection.length);
    const s = this.options.content;
    if (s)
      if (typeof s == "function") {
        const r = z(s, this.graph, this, this.selectionContent);
        r && (this.selectionContent.innerHTML = r);
      } else
        this.selectionContent.innerHTML = s;
    this.collection.length > 0 && !this.container.parentNode ? ri(this.container, this.graph.container) : this.collection.length <= 0 && this.container.parentNode && this.container.parentNode.removeChild(this.container);
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
        U(r, s), U(r, `${s}-${t.isNode() ? "node" : "edge"}`), et(r, "data-cell-id", t.id), kt(r, {
          position: "absolute",
          left: n.x,
          top: n.y,
          width: n.width,
          height: n.height,
          pointerEvents: o ? this.getPointerEventsValue(o) : "auto"
        }), ri(r, this.container), this.showSelected(), this.boxCount += 1;
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
        const s = e[t], r = et(s, "data-cell-id");
        ve(s), this.boxCount -= 1;
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
J1([
  it.dispose()
], zh.prototype, "dispose", null);
var Xt;
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
})(Xt || (Xt = {}));
const K1 = `.x6-widget-selection {
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
k.prototype.isSelectionEnabled = function() {
  const i = this.getPlugin("selection");
  return i ? i.isEnabled() : !1;
};
k.prototype.enableSelection = function() {
  const i = this.getPlugin("selection");
  return i && i.enable(), this;
};
k.prototype.disableSelection = function() {
  const i = this.getPlugin("selection");
  return i && i.disable(), this;
};
k.prototype.toggleSelection = function(i) {
  const t = this.getPlugin("selection");
  return t && t.toggleEnabled(i), this;
};
k.prototype.isMultipleSelection = function() {
  const i = this.getPlugin("selection");
  return i ? i.isMultipleSelection() : !1;
};
k.prototype.enableMultipleSelection = function() {
  const i = this.getPlugin("selection");
  return i && i.enableMultipleSelection(), this;
};
k.prototype.disableMultipleSelection = function() {
  const i = this.getPlugin("selection");
  return i && i.disableMultipleSelection(), this;
};
k.prototype.toggleMultipleSelection = function(i) {
  const t = this.getPlugin("selection");
  return t && t.toggleMultipleSelection(i), this;
};
k.prototype.isSelectionMovable = function() {
  const i = this.getPlugin("selection");
  return i ? i.isSelectionMovable() : !1;
};
k.prototype.enableSelectionMovable = function() {
  const i = this.getPlugin("selection");
  return i && i.enableSelectionMovable(), this;
};
k.prototype.disableSelectionMovable = function() {
  const i = this.getPlugin("selection");
  return i && i.disableSelectionMovable(), this;
};
k.prototype.toggleSelectionMovable = function(i) {
  const t = this.getPlugin("selection");
  return t && t.toggleSelectionMovable(i), this;
};
k.prototype.isRubberbandEnabled = function() {
  const i = this.getPlugin("selection");
  return i ? i.isRubberbandEnabled() : !1;
};
k.prototype.enableRubberband = function() {
  const i = this.getPlugin("selection");
  return i && i.enableRubberband(), this;
};
k.prototype.disableRubberband = function() {
  const i = this.getPlugin("selection");
  return i && i.disableRubberband(), this;
};
k.prototype.toggleRubberband = function(i) {
  const t = this.getPlugin("selection");
  return t && t.toggleRubberband(i), this;
};
k.prototype.isStrictRubberband = function() {
  const i = this.getPlugin("selection");
  return i ? i.isStrictRubberband() : !1;
};
k.prototype.enableStrictRubberband = function() {
  const i = this.getPlugin("selection");
  return i && i.enableStrictRubberband(), this;
};
k.prototype.disableStrictRubberband = function() {
  const i = this.getPlugin("selection");
  return i && i.disableStrictRubberband(), this;
};
k.prototype.toggleStrictRubberband = function(i) {
  const t = this.getPlugin("selection");
  return t && t.toggleStrictRubberband(i), this;
};
k.prototype.setRubberbandModifiers = function(i) {
  const t = this.getPlugin("selection");
  return t && t.setRubberbandModifiers(i), this;
};
k.prototype.setSelectionFilter = function(i) {
  const t = this.getPlugin("selection");
  return t && t.setSelectionFilter(i), this;
};
k.prototype.setSelectionDisplayContent = function(i) {
  const t = this.getPlugin("selection");
  return t && t.setSelectionDisplayContent(i), this;
};
k.prototype.isSelectionEmpty = function() {
  const i = this.getPlugin("selection");
  return i ? i.isEmpty() : !0;
};
k.prototype.cleanSelection = function(i) {
  const t = this.getPlugin("selection");
  return t && t.clean(i), this;
};
k.prototype.resetSelection = function(i, t) {
  const e = this.getPlugin("selection");
  return e && e.reset(i, t), this;
};
k.prototype.getSelectedCells = function() {
  const i = this.getPlugin("selection");
  return i ? i.getSelectedCells() : [];
};
k.prototype.getSelectedCellCount = function() {
  const i = this.getPlugin("selection");
  return i ? i.getSelectedCellCount() : 0;
};
k.prototype.isSelected = function(i) {
  const t = this.getPlugin("selection");
  return t ? t.isSelected(i) : !1;
};
k.prototype.select = function(i, t) {
  const e = this.getPlugin("selection");
  return e && e.select(i, t), this;
};
k.prototype.unselect = function(i, t) {
  const e = this.getPlugin("selection");
  return e && e.unselect(i, t), this;
};
var Z1 = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
};
class Dn extends At {
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
    super(), this.name = "selection", this.movedMap = /* @__PURE__ */ new WeakMap(), this.unselectMap = /* @__PURE__ */ new WeakMap(), this.options = Object.assign(Object.assign({ enabled: !0 }, Dn.defaultOptions), t), Ps(this.name, K1);
  }
  init(t) {
    this.graph = t, this.selectionImpl = new zh(Object.assign(Object.assign({}, this.options), { graph: t })), this.setup(), this.startListening();
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
    return !this.rubberbandDisabled && ze.isMatch(t, this.options.modifiers, e);
  }
  allowMultipleSelection(t) {
    return this.isMultiple() && ze.isMatch(t, this.options.multipleSelectionModifiers);
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
    this.stopListening(), this.off(), this.selectionImpl.dispose(), As(this.name);
  }
}
Z1([
  At.dispose()
], Dn.prototype, "dispose", null);
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
})(Dn || (Dn = {}));
var Q1 = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
}, tE = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
};
class Vh extends it {
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
    const { graph: e } = t, n = tE(t, ["graph"]);
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
        const s = t.getBBox(), r = s.bbox(t.getAngle()), o = r.getTopLeft(), a = r.getBottomRight(), l = ct.normalize(t.getAngle()), c = this.options.tolerance || 0;
        let h, u, d, f, g, p;
        const m = {
          vertical: 0,
          horizontal: 0
        }, b = e.direction, v = e.trueDirection, y = e.relativeDirection;
        v.indexOf("right") !== -1 ? m.vertical = a.x : m.vertical = o.x, v.indexOf("bottom") !== -1 ? m.horizontal = a.y : m.horizontal = o.y, this.model.getNodes().some((j) => {
          if (this.isIgnored(t, j))
            return !1;
          const H = j.getBBox().bbox(j.getAngle()), F = H.getTopLeft(), A = H.getBottomRight(), N = {
            vertical: [F.x, A.x],
            horizontal: [F.y, A.y]
          }, V = {};
          return Object.keys(N).forEach((st) => {
            const Q = st, ut = N[Q].map(($) => ({
              position: $,
              distance: Math.abs($ - m[Q])
            })).filter(($) => $.distance <= c);
            V[Q] = Br(ut, ($) => $.distance);
          }), h == null && V.vertical.length > 0 && (h = V.vertical[0].position, u = Math.min(r.y, H.y), d = Math.max(a.y, A.y) - u), f == null && V.horizontal.length > 0 && (f = V.horizontal[0].position, g = Math.min(r.x, H.x), p = Math.max(a.x, A.x) - g), h != null && f != null;
        }), this.hide();
        let x = 0, E = 0;
        (f != null || h != null) && (h != null && (x = v.indexOf("right") !== -1 ? h - a.x : o.x - h), f != null && (E = v.indexOf("bottom") !== -1 ? f - a.y : o.y - f));
        let S = 0, C = 0;
        if (l % 90 === 0)
          l === 90 || l === 270 ? (S = E, C = x) : (S = x, C = E);
        else {
          const j = l >= 0 && l < 90 ? 1 : l >= 90 && l < 180 ? 4 : l >= 180 && l < 270 ? 3 : 2;
          f != null && h != null && (x < E ? (E = 0, f = void 0) : (x = 0, h = void 0));
          const H = ct.toRad(l % 90);
          x && (S = j === 3 ? x / Math.cos(H) : x / Math.sin(H)), E && (C = j === 3 ? E / Math.cos(H) : E / Math.sin(H));
          const F = j === 1 || j === 3;
          switch (y) {
            case "top":
            case "bottom":
              C = E ? E / (F ? Math.cos(H) : Math.sin(H)) : x / (F ? Math.sin(H) : Math.cos(H));
              break;
            case "left":
            case "right":
              S = x ? x / (F ? Math.cos(H) : Math.sin(H)) : E / (F ? Math.sin(H) : Math.cos(H));
              break;
          }
        }
        switch (y) {
          case "top":
          case "bottom":
            S = 0;
            break;
          case "left":
          case "right":
            C = 0;
            break;
        }
        const O = this.graph.getGridSize();
        let P = Math.max(s.width + S, O), I = Math.max(s.height + C, O);
        e.minWidth && e.minWidth > O && (P = Math.max(P, e.minWidth)), e.minHeight && e.minHeight > O && (I = Math.max(I, e.minHeight)), e.maxWidth && (P = Math.min(P, e.maxWidth)), e.maxHeight && (I = Math.min(I, e.maxHeight)), e.preserveAspectRatio && (C < S ? I = P * (s.height / s.width) : P = I * (s.width / s.height)), (P !== s.width || I !== s.height) && (t.resize(P, I, {
          direction: b,
          relativeDirection: y,
          trueDirection: v,
          snapped: !0,
          snaplines: this.cid,
          restrict: this.getRestrictArea(n)
        }), d && (d += I - s.height), p && (p += P - s.width));
        const T = t.getBBox().bbox(l);
        h && Math.abs(T.x - h) > 1 && Math.abs(T.width + T.x - h) > 1 && (h = void 0), f && Math.abs(T.y - f) > 1 && Math.abs(T.height + T.y - f) > 1 && (f = void 0), this.update({
          verticalLeft: h,
          verticalTop: u,
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
    const o = r.cell, a = o.getSize(), l = o.getPosition(), c = new R(n - this.offset.x, s - this.offset.y, a.width, a.height), h = o.getAngle(), u = c.getCenter(), d = c.bbox(h), f = d.getTopLeft(), g = d.getBottomRight(), p = this.options.tolerance || 0;
    let m, b, v, y, x, E, S = 0, C = 0;
    if (this.model.getNodes().some((O) => {
      if (this.isIgnored(o, O))
        return !1;
      const P = O.getBBox().bbox(O.getAngle()), I = P.getCenter(), T = P.getTopLeft(), j = P.getBottomRight();
      return m == null && (Math.abs(I.x - u.x) < p ? (m = I.x, S = 0.5) : Math.abs(T.x - f.x) < p ? (m = T.x, S = 0) : Math.abs(T.x - g.x) < p ? (m = T.x, S = 1) : Math.abs(j.x - g.x) < p ? (m = j.x, S = 1) : Math.abs(j.x - f.x) < p && (m = j.x), m != null && (b = Math.min(d.y, P.y), v = Math.max(g.y, j.y) - b)), y == null && (Math.abs(I.y - u.y) < p ? (y = I.y, C = 0.5) : Math.abs(T.y - f.y) < p ? y = T.y : Math.abs(T.y - g.y) < p ? (y = T.y, C = 1) : Math.abs(j.y - g.y) < p ? (y = j.y, C = 1) : Math.abs(j.y - f.y) < p && (y = j.y), y != null && (x = Math.min(d.x, P.x), E = Math.max(g.x, j.x) - x)), m != null && y != null;
    }), this.hide(), y != null || m != null) {
      y != null && (d.y = y - C * d.height), m != null && (d.x = m - S * d.width);
      const O = d.getCenter(), P = O.x - c.width / 2, I = O.y - c.height / 2, T = P - l.x, j = I - l.y;
      (T !== 0 || j !== 0) && (o.translate(T, j, {
        snapped: !0,
        restrict: this.getRestrictArea(r)
      }), E && (E += T), v && (v += j)), this.update({
        verticalLeft: m,
        verticalTop: b,
        verticalHeight: v,
        horizontalTop: y,
        horizontalLeft: x,
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
      const e = this.graph.localToGraph(new w(t.horizontalLeft, t.horizontalTop)), n = this.graph.localToGraph(new w(t.horizontalLeft + t.horizontalWidth, t.horizontalTop));
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
      const e = this.graph.localToGraph(new w(t.verticalLeft, t.verticalTop)), n = this.graph.localToGraph(new w(t.verticalLeft, t.verticalTop + t.verticalHeight));
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
Q1([
  it.dispose()
], Vh.prototype, "dispose", null);
const eE = `.x6-widget-snapline {
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
k.prototype.isSnaplineEnabled = function() {
  const i = this.getPlugin("snapline");
  return i ? i.isEnabled() : !1;
};
k.prototype.enableSnapline = function() {
  const i = this.getPlugin("snapline");
  return i && i.enable(), this;
};
k.prototype.disableSnapline = function() {
  const i = this.getPlugin("snapline");
  return i && i.disable(), this;
};
k.prototype.toggleSnapline = function() {
  const i = this.getPlugin("snapline");
  return i && i.toggleEnabled(), this;
};
k.prototype.hideSnapline = function() {
  const i = this.getPlugin("snapline");
  return i && i.hide(), this;
};
k.prototype.setSnaplineFilter = function(i) {
  const t = this.getPlugin("snapline");
  return t && t.setFilter(i), this;
};
k.prototype.isSnaplineOnResizingEnabled = function() {
  const i = this.getPlugin("snapline");
  return i ? i.isOnResizingEnabled() : !1;
};
k.prototype.enableSnaplineOnResizing = function() {
  const i = this.getPlugin("snapline");
  return i && i.enableOnResizing(), this;
};
k.prototype.disableSnaplineOnResizing = function() {
  const i = this.getPlugin("snapline");
  return i && i.disableOnResizing(), this;
};
k.prototype.toggleSnaplineOnResizing = function(i) {
  const t = this.getPlugin("snapline");
  return t && t.toggleOnResizing(i), this;
};
k.prototype.isSharpSnapline = function() {
  const i = this.getPlugin("snapline");
  return i ? i.isSharp() : !1;
};
k.prototype.enableSharpSnapline = function() {
  const i = this.getPlugin("snapline");
  return i && i.enableSharp(), this;
};
k.prototype.disableSharpSnapline = function() {
  const i = this.getPlugin("snapline");
  return i && i.disableSharp(), this;
};
k.prototype.toggleSharpSnapline = function(i) {
  const t = this.getPlugin("snapline");
  return t && t.toggleSharp(i), this;
};
k.prototype.getSnaplineTolerance = function() {
  const i = this.getPlugin("snapline");
  if (i)
    return i.getTolerance();
};
k.prototype.setSnaplineTolerance = function(i) {
  const t = this.getPlugin("snapline");
  return t && t.setTolerance(i), this;
};
var nE = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
};
class Fh extends Ut {
  constructor(t = {}) {
    super(), this.name = "snapline", this.options = Object.assign({ enabled: !0, tolerance: 10 }, t), Ps(this.name, eE);
  }
  init(t) {
    this.snaplineImpl = new Vh(Object.assign(Object.assign({}, this.options), { graph: t }));
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
    this.snaplineImpl.dispose(), As(this.name);
  }
}
nE([
  Ut.dispose()
], Fh.prototype, "dispose", null);
k.prototype.isHistoryEnabled = function() {
  const i = this.getPlugin("history");
  return i ? i.isEnabled() : !1;
};
k.prototype.enableHistory = function() {
  const i = this.getPlugin("history");
  return i && i.enable(), this;
};
k.prototype.disableHistory = function() {
  const i = this.getPlugin("history");
  return i && i.disable(), this;
};
k.prototype.toggleHistory = function(i) {
  const t = this.getPlugin("history");
  return t && t.toggleEnabled(i), this;
};
k.prototype.undo = function(i) {
  const t = this.getPlugin("history");
  return t && t.undo(i), this;
};
k.prototype.redo = function(i) {
  const t = this.getPlugin("history");
  return t && t.redo(i), this;
};
k.prototype.undoAndCancel = function(i) {
  const t = this.getPlugin("history");
  return t && t.cancel(i), this;
};
k.prototype.canUndo = function() {
  const i = this.getPlugin("history");
  return i ? i.canUndo() : !1;
};
k.prototype.canRedo = function() {
  const i = this.getPlugin("history");
  return i ? i.canRedo() : !1;
};
k.prototype.cleanHistory = function(i) {
  const t = this.getPlugin("history");
  return t && t.clean(i), this;
};
k.prototype.getHistoryStackSize = function() {
  return this.getPlugin("history").getSize();
};
k.prototype.getUndoStackSize = function() {
  return this.getPlugin("history").getUndoSize();
};
k.prototype.getRedoStackSize = function() {
  return this.getPlugin("history").getRedoSize();
};
k.prototype.getUndoRemainSize = function() {
  return this.getPlugin("history").getUndoRemainSize();
};
var Gh = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
};
class $n extends At {
  constructor(t = {}) {
    super(), this.name = "history", this.batchCommands = null, this.batchLevel = 0, this.lastBatchIndex = -1, this.freezed = !1, this.stackSize = 0, this.handlers = [];
    const { stackSize: e = 0 } = t;
    this.stackSize = e, this.options = bt.getOptions(t), this.validator = new $n.Validator({
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
    const n = Array.isArray(t) ? bt.sortBatchCommands(t) : [t];
    for (let s = n.length - 1; s >= 0; s -= 1) {
      const r = n[s], o = Object.assign(Object.assign({}, e), ea(r.options, this.options.revertOptionsList || []));
      this.executeCommand(r, !0, o);
    }
    this.freezed = !1;
  }
  applyCommand(t, e) {
    this.freezed = !0;
    const n = Array.isArray(t) ? bt.sortBatchCommands(t) : [t];
    for (let s = 0; s < n.length; s += 1) {
      const r = n[s], o = Object.assign(Object.assign({}, e), ea(r.options, this.options.applyOptionsList || []));
      this.executeCommand(r, !1, o);
    }
    this.freezed = !1;
  }
  executeCommand(t, e, n) {
    const s = this.model, r = s.getCell(t.data.id), o = t.event;
    if (bt.isAddEvent(o) && e || bt.isRemoveEvent(o) && !e)
      r && r.remove(n);
    else if (bt.isAddEvent(o) && !e || bt.isRemoveEvent(o) && e) {
      const a = t.data;
      a.node ? s.addNode(a.props, n) : a.edge && s.addEdge(a.props, n);
    } else if (bt.isChangeEvent(o)) {
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
    if (s.dryrun || bt.isAddEvent(t) && this.options.ignoreAdd || bt.isRemoveEvent(t) && this.options.ignoreRemove || bt.isChangeEvent(t) && this.options.ignoreChange)
      return;
    const r = this.options.beforeAddCommand;
    if (r != null && z(r, this, t, e) === !1)
      return;
    t === "cell:change:*" && (t = `cell:change:${n.key}`);
    const o = n.cell, a = Yt.isModel(o);
    let l;
    if (this.batchCommands) {
      l = this.batchCommands[Math.max(this.lastBatchIndex, 0)];
      const h = a && !l.modelChange || l.data.id !== o.id, u = l.event !== t;
      if (this.lastBatchIndex >= 0 && (h || u)) {
        const d = this.batchCommands.findIndex((f) => (a && f.modelChange || f.data.id === o.id) && f.event === t);
        d < 0 || bt.isAddEvent(t) || bt.isRemoveEvent(t) ? l = this.createCommand({ batch: !0 }) : (l = this.batchCommands[d], this.batchCommands.splice(d, 1)), this.batchCommands.push(l), this.lastBatchIndex = this.batchCommands.length - 1;
      }
    } else
      l = this.createCommand({ batch: !1 });
    if (bt.isAddEvent(t) || bt.isRemoveEvent(t)) {
      const h = l.data;
      return l.event = t, l.options = s, h.id = o.id, h.props = gt(o.toJSON()), o.isEdge() ? h.edge = !0 : o.isNode() && (h.node = !0), this.push(l, s);
    }
    if (bt.isChangeEvent(t)) {
      const h = e.key, u = l.data;
      return (!l.batch || !l.event) && (l.event = t, l.options = s, u.key = h, u.prev == null && (u.prev = {}), u.prev[h] = gt(o.previous(h)), a ? l.modelChange = !0 : u.id = o.id), u.next == null && (u.next = {}), u.next[h] = gt(o.prop(h)), this.push(l, s);
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
        if (bt.isAddEvent(r)) {
          const a = e.findIndex((l) => bt.isRemoveEvent(l.event) && l.data.id === o);
          if (a >= 0) {
            e = e.filter((l, c) => a < c || l.data.id !== o);
            continue;
          }
        } else if (bt.isRemoveEvent(r)) {
          const a = e.findIndex((l) => bt.isAddEvent(l.event) && l.data.id === o);
          if (a >= 0) {
            e.splice(a, 1);
            continue;
          }
        } else if (bt.isChangeEvent(r)) {
          const a = s.data;
          if (ye(a.prev, a.next))
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
Gh([
  At.dispose()
], $n.prototype, "dispose", null);
(function(i) {
  class t extends At {
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
          const h = o[a];
          a += 1;
          try {
            if (h)
              h(c, n, l);
            else {
              r = c;
              return;
            }
          } catch (u) {
            l(u);
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
  Gh([
    At.dispose()
  ], t.prototype, "dispose", null), i.Validator = t;
})($n || ($n = {}));
var bt;
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
    ], l = ["batch:start", "batch:stop"], c = o.eventNames ? o.eventNames.filter((h) => !(i.isChangeEvent(h) || a.includes(h) || l.includes(h))) : a;
    return Object.assign(Object.assign({ enabled: !0 }, o), { eventNames: c, applyOptionsList: o.applyOptionsList || ["propertyPath"], revertOptionsList: o.revertOptionsList || ["propertyPath"] });
  }
  i.getOptions = s;
  function r(o) {
    const a = [];
    for (let l = 0, c = o.length; l < c; l += 1) {
      const h = o[l];
      let u = null;
      if (i.isAddEvent(h.event)) {
        const d = h.data.id;
        for (let f = 0; f < l; f += 1)
          if (o[f].data.id === d) {
            u = f;
            break;
          }
      }
      u !== null ? a.splice(u, 0, h) : a.push(h);
    }
    return a;
  }
  i.sortBatchCommands = r;
})(bt || (bt = {}));
function Hh(i) {
  return i && i.__esModule && Object.prototype.hasOwnProperty.call(i, "default") ? i.default : i;
}
var qh = { exports: {} };
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
    function h(C, O, P) {
      if (C.addEventListener) {
        C.addEventListener(O, P, !1);
        return;
      }
      C.attachEvent("on" + O, P);
    }
    function u(C) {
      if (C.type == "keypress") {
        var O = String.fromCharCode(C.which);
        return C.shiftKey || (O = O.toLowerCase()), O;
      }
      return s[C.which] ? s[C.which] : r[C.which] ? r[C.which] : String.fromCharCode(C.which).toLowerCase();
    }
    function d(C, O) {
      return C.sort().join(",") === O.sort().join(",");
    }
    function f(C) {
      var O = [];
      return C.shiftKey && O.push("shift"), C.altKey && O.push("alt"), C.ctrlKey && O.push("ctrl"), C.metaKey && O.push("meta"), O;
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
    function b() {
      if (!l) {
        l = {};
        for (var C in s)
          C > 95 && C < 112 || s.hasOwnProperty(C) && (l[s[C]] = C);
      }
      return l;
    }
    function v(C, O, P) {
      return P || (P = b()[C] ? "keydown" : "keypress"), P == "keypress" && O.length && (P = "keydown"), P;
    }
    function y(C) {
      return C === "+" ? ["+"] : (C = C.replace(/\+{2}/g, "+plus"), C.split("+"));
    }
    function x(C, O) {
      var P, I, T, j = [];
      for (P = y(C), T = 0; T < P.length; ++T)
        I = P[T], a[I] && (I = a[I]), O && O != "keypress" && o[I] && (I = o[I], j.push("shift")), m(I) && j.push(I);
      return O = v(I, j, O), {
        key: I,
        modifiers: j,
        action: O
      };
    }
    function E(C, O) {
      return C === null || C === e ? !1 : C === O ? !0 : E(C.parentNode, O);
    }
    function S(C) {
      var O = this;
      if (C = C || e, !(O instanceof S))
        return new S(C);
      O.target = C, O._callbacks = {}, O._directMap = {};
      var P = {}, I, T = !1, j = !1, H = !1;
      function F($) {
        $ = $ || {};
        var K = !1, tt;
        for (tt in P) {
          if ($[tt]) {
            K = !0;
            continue;
          }
          P[tt] = 0;
        }
        K || (H = !1);
      }
      function A($, K, tt, W, nt, xt) {
        var X, Et, le = [], Bt = tt.type;
        if (!O._callbacks[$])
          return [];
        for (Bt == "keyup" && m($) && (K = [$]), X = 0; X < O._callbacks[$].length; ++X)
          if (Et = O._callbacks[$][X], !(!W && Et.seq && P[Et.seq] != Et.level) && Bt == Et.action && (Bt == "keypress" && !tt.metaKey && !tt.ctrlKey || d(K, Et.modifiers))) {
            var Ni = !W && Et.combo == nt, Li = W && Et.seq == W && Et.level == xt;
            (Ni || Li) && O._callbacks[$].splice(X, 1), le.push(Et);
          }
        return le;
      }
      function N($, K, tt, W) {
        O.stopCallback(K, K.target || K.srcElement, tt, W) || $(K, tt) === !1 && (g(K), p(K));
      }
      O._handleKey = function($, K, tt) {
        var W = A($, K, tt), nt, xt = {}, X = 0, Et = !1;
        for (nt = 0; nt < W.length; ++nt)
          W[nt].seq && (X = Math.max(X, W[nt].level));
        for (nt = 0; nt < W.length; ++nt) {
          if (W[nt].seq) {
            if (W[nt].level != X)
              continue;
            Et = !0, xt[W[nt].seq] = 1, N(W[nt].callback, tt, W[nt].combo, W[nt].seq);
            continue;
          }
          Et || N(W[nt].callback, tt, W[nt].combo);
        }
        var le = tt.type == "keypress" && j;
        tt.type == H && !m($) && !le && F(xt), j = Et && tt.type == "keydown";
      };
      function V($) {
        typeof $.which != "number" && ($.which = $.keyCode);
        var K = u($);
        if (K) {
          if ($.type == "keyup" && T === K) {
            T = !1;
            return;
          }
          O.handleKey(K, f($), $);
        }
      }
      function st() {
        clearTimeout(I), I = setTimeout(F, 1e3);
      }
      function Q($, K, tt, W) {
        P[$] = 0;
        function nt(Bt) {
          return function() {
            H = Bt, ++P[$], st();
          };
        }
        function xt(Bt) {
          N(tt, Bt, $), W !== "keyup" && (T = u(Bt)), setTimeout(F, 10);
        }
        for (var X = 0; X < K.length; ++X) {
          var Et = X + 1 === K.length, le = Et ? xt : nt(W || x(K[X + 1]).action);
          ut(K[X], le, W, $, X);
        }
      }
      function ut($, K, tt, W, nt) {
        O._directMap[$ + ":" + tt] = K, $ = $.replace(/\s+/g, " ");
        var xt = $.split(" "), X;
        if (xt.length > 1) {
          Q($, xt, K, tt);
          return;
        }
        X = x($, tt), O._callbacks[X.key] = O._callbacks[X.key] || [], A(X.key, X.modifiers, { type: X.action }, W, $, nt), O._callbacks[X.key][W ? "unshift" : "push"]({
          callback: K,
          modifiers: X.modifiers,
          action: X.action,
          seq: W,
          level: nt,
          combo: $
        });
      }
      O._bindMultiple = function($, K, tt) {
        for (var W = 0; W < $.length; ++W)
          ut($[W], K, tt);
      }, h(C, "keypress", V), h(C, "keydown", V), h(C, "keyup", V);
    }
    S.prototype.bind = function(C, O, P) {
      var I = this;
      return C = C instanceof Array ? C : [C], I._bindMultiple.call(I, C, O, P), I;
    }, S.prototype.unbind = function(C, O) {
      var P = this;
      return P.bind.call(P, C, function() {
      }, O);
    }, S.prototype.trigger = function(C, O) {
      var P = this;
      return P._directMap[C + ":" + O] && P._directMap[C + ":" + O]({}, C), P;
    }, S.prototype.reset = function() {
      var C = this;
      return C._callbacks = {}, C._directMap = {}, C;
    }, S.prototype.stopCallback = function(C, O) {
      var P = this;
      if ((" " + O.className + " ").indexOf(" mousetrap ") > -1 || E(O, P.target))
        return !1;
      if ("composedPath" in C && typeof C.composedPath == "function") {
        var I = C.composedPath()[0];
        I !== C.target && (O = I);
      }
      return O.tagName == "INPUT" || O.tagName == "SELECT" || O.tagName == "TEXTAREA" || O.isContentEditable;
    }, S.prototype.handleKey = function() {
      var C = this;
      return C._handleKey.apply(C, arguments);
    }, S.addKeycodes = function(C) {
      for (var O in C)
        C.hasOwnProperty(O) && (s[O] = C[O]);
      l = null;
    }, S.init = function() {
      var C = S(e);
      for (var O in C)
        O.charAt(0) !== "_" && (S[O] = /* @__PURE__ */ function(P) {
          return function() {
            return C[P].apply(C, arguments);
          };
        }(O));
    }, S.init(), t.Mousetrap = S, i.exports && (i.exports = S);
  })(typeof window < "u" ? window : null, typeof window < "u" ? document : null);
})(qh);
var iE = qh.exports;
const sE = /* @__PURE__ */ Hh(iE);
var rE = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
};
class _n extends Ut {
  get graph() {
    return this.options.graph;
  }
  constructor(t) {
    super(), this.options = t;
    const e = this.graph.getPlugin("scroller");
    this.container = e ? e.container : this.graph.container, t.global ? this.target = document : (this.target = this.container, this.disabled || this.target.setAttribute("tabindex", "-1"), this.graph.on("cell:mouseup", this.focus, this), this.graph.on("blank:mouseup", this.focus, this)), this.mousetrap = _n.createMousetrap(this);
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
    return e ? e === this.target || n === this.target || e === document.body ? !0 : Jr(this.container, e) : !1;
  }
  isInputEvent(t) {
    var e;
    const n = t.target, s = (e = n == null ? void 0 : n.tagName) === null || e === void 0 ? void 0 : e.toLowerCase();
    let r = ["input", "textarea"].includes(s);
    return et(n, "contenteditable") === "true" && (r = !0), r;
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
rE([
  Ut.dispose()
], _n.prototype, "dispose", null);
(function(i) {
  function t(e) {
    const n = new sE(e.target), s = n.stopCallback;
    return n.stopCallback = (r, o, a) => e.isEnabledForEvent(r) ? s ? s.call(n, r, o, a) : !1 : !0, n;
  }
  i.createMousetrap = t;
})(_n || (_n = {}));
k.prototype.isKeyboardEnabled = function() {
  const i = this.getPlugin("keyboard");
  return i ? i.isEnabled() : !1;
};
k.prototype.enableKeyboard = function() {
  const i = this.getPlugin("keyboard");
  return i && i.enable(), this;
};
k.prototype.disableKeyboard = function() {
  const i = this.getPlugin("keyboard");
  return i && i.disable(), this;
};
k.prototype.toggleKeyboard = function(i) {
  const t = this.getPlugin("keyboard");
  return t && t.toggleEnabled(i), this;
};
k.prototype.bindKey = function(i, t, e) {
  const n = this.getPlugin("keyboard");
  return n && n.bindKey(i, t, e), this;
};
k.prototype.unbindKey = function(i, t) {
  const e = this.getPlugin("keyboard");
  return e && e.unbindKey(i, t), this;
};
k.prototype.clearKeys = function() {
  const i = this.getPlugin("keyboard");
  return i && i.clear(), this;
};
k.prototype.triggerKey = function(i, t) {
  const e = this.getPlugin("keyboard");
  return e && e.trigger(i, t), this;
};
var oE = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
};
class Uh extends Ut {
  constructor(t = {}) {
    super(), this.name = "keyboard", this.options = Object.assign({ enabled: !0 }, t);
  }
  init(t) {
    this.keyboardImpl = new _n(Object.assign(Object.assign({}, this.options), { graph: t }));
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
oE([
  Ut.dispose()
], Uh.prototype, "dispose", null);
class aE {
  constructor() {
    this.cells = [];
  }
  copy(t, e, n = {}) {
    this.options = Object.assign({}, n);
    const r = (Yt.isModel(e) ? e : e.model).cloneSubGraph(t, n);
    this.cells = Br(Object.keys(r).map((o) => r[o]), (o) => o.isEdge() ? 2 : 1), this.serialize(n);
  }
  cut(t, e, n = {}) {
    this.copy(t, e, n), (k.isGraph(e) ? e.model : e).batchUpdate("cut", () => {
      t.forEach((r) => r.remove());
    });
  }
  paste(t, e = {}) {
    const n = Object.assign(Object.assign({}, this.options), e), { offset: s, edgeProps: r, nodeProps: o } = n;
    let a = 20, l = 20;
    s && (a = typeof s == "number" ? s : s.dx, l = typeof s == "number" ? s : s.dy), this.deserialize(n);
    const c = this.cells;
    c.forEach((u) => {
      u.model = null, u.removeProp("zIndex"), (a || l) && u.translate(a, l), o && u.isNode() && u.prop(o), r && u.isEdge() && u.prop(r);
    });
    const h = k.isGraph(t) ? t.model : t;
    return h.batchUpdate("paste", () => {
      h.addCells(this.cells);
    }), this.copy(c, t, e), c;
  }
  serialize(t) {
    t.useLocalStorage !== !1 && ui.save(this.cells);
  }
  deserialize(t) {
    if (t.useLocalStorage) {
      const e = ui.fetch();
      e && (this.cells = e);
    }
  }
  isEmpty(t = {}) {
    return t.useLocalStorage && this.deserialize(t), this.cells.length <= 0;
  }
  clean() {
    this.options = {}, this.cells = [], ui.clean();
  }
}
var ui;
(function(i) {
  const t = `${oe.prefixCls}.clipboard.cells`;
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
        return Yt.fromJSON(o);
    }
  }
  i.fetch = n;
  function s() {
    window.localStorage && localStorage.removeItem(t);
  }
  i.clean = s;
})(ui || (ui = {}));
k.prototype.isClipboardEnabled = function() {
  const i = this.getPlugin("clipboard");
  return i ? i.isEnabled() : !1;
};
k.prototype.enableClipboard = function() {
  const i = this.getPlugin("clipboard");
  return i && i.enable(), this;
};
k.prototype.disableClipboard = function() {
  const i = this.getPlugin("clipboard");
  return i && i.disable(), this;
};
k.prototype.toggleClipboard = function(i) {
  const t = this.getPlugin("clipboard");
  return t && t.toggleEnabled(i), this;
};
k.prototype.isClipboardEmpty = function(i) {
  const t = this.getPlugin("clipboard");
  return t ? t.isEmpty(i) : !0;
};
k.prototype.getCellsInClipboard = function() {
  const i = this.getPlugin("clipboard");
  return i ? i.getCellsInClipboard() : [];
};
k.prototype.cleanClipboard = function() {
  const i = this.getPlugin("clipboard");
  return i && i.clean(), this;
};
k.prototype.copy = function(i, t) {
  const e = this.getPlugin("clipboard");
  return e && e.copy(i, t), this;
};
k.prototype.cut = function(i, t) {
  const e = this.getPlugin("clipboard");
  return e && e.cut(i, t), this;
};
k.prototype.paste = function(i, t) {
  const e = this.getPlugin("clipboard");
  return e ? e.paste(i, t) : [];
};
var lE = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
}, cE = function(i, t) {
  var e = {};
  for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && t.indexOf(n) < 0 && (e[n] = i[n]);
  if (i != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(i); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(i, n[s]) && (e[n[s]] = i[n[s]]);
  return e;
};
class Wh extends At {
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
    this.graph = t, this.clipboardImpl = new aE(), this.clipboardImpl.deserialize(this.options);
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
    return cE(t, ["enabled"]);
  }
  notify(t, e) {
    this.trigger(t, e), this.graph.trigger(t, e);
  }
  dispose() {
    this.clean(!0), this.off();
  }
}
lE([
  At.dispose()
], Wh.prototype, "dispose", null);
const hE = `.x6-widget-dnd {
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
var uE = function(i, t, e, n) {
  var s = arguments.length, r = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, e) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") r = Reflect.decorate(i, t, e, n);
  else for (var a = i.length - 1; a >= 0; a--) (o = i[a]) && (r = (s < 3 ? o(r) : s > 3 ? o(t, e, r) : o(t, e)) || r);
  return s > 3 && r && Object.defineProperty(t, e, r), r;
};
class on extends it {
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
    super(), this.name = "dnd", this.options = Object.assign(Object.assign({}, on.defaults), t), this.init();
  }
  init() {
    Ps(this.name, hE), this.container = document.createElement("div"), U(this.container, this.prefixClassName("widget-dnd")), this.draggingGraph = new k(Object.assign(Object.assign({}, this.options.delegateGraphOptions), { container: document.createElement("div"), width: 1, height: 1, async: !1 })), hn(this.container, this.draggingGraph.container);
  }
  start(t, e) {
    const n = e;
    n.preventDefault(), this.targetModel.startBatch("dnd"), U(this.container, "dragging"), ri(this.container, this.options.draggingContainer || document.body), this.sourceNode = t, this.prepareDragging(t, n.clientX, n.clientY);
    const s = this.updateNodePosition(n.clientX, n.clientY);
    this.isSnaplineEnabled() && (this.snapline.captureCursorOffset({
      e: n,
      node: t,
      cell: t,
      view: this.draggingView,
      x: s.x,
      y: s.y
    }), this.draggingNode.on("change:position", this.snap, this)), this.delegateDocumentEvents(on.documentEvents, n.data);
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
      const h = this.targetGraph.transform.getScale();
      s.scale(h.sx, h.sy), a *= Math.max(h.sx, h.sy);
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
    return this.draggingGraph && kt(this.container, {
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
      const c = this.drop(e, { x: n.clientX, y: n.clientY }), h = (u) => {
        u ? (this.onDropped(e), this.targetGraph.options.embedding.enabled && s && (s.setEventData(n, {
          cell: u,
          graph: this.targetGraph,
          candidateEmbedView: this.candidateEmbedView
        }), s.finalizeEmbedding(n, s.getEventData(n)))) : this.onDropInvalid(), this.candidateEmbedView = null, this.targetModel.stopBatch("dnd");
      };
      ur(c) ? (this.undelegateDocumentEvents(), c.then(h)) : h(c);
    }
  }
  clearDragging() {
    this.draggingNode && (this.sourceNode = null, this.draggingNode.remove(), this.draggingNode = null, this.draggingView = null, this.delta = null, this.padding = null, this.snapOffset = null, this.originOffset = null, this.undelegateDocumentEvents());
  }
  onDropped(t) {
    this.draggingNode === t && (this.clearDragging(), Ht(this.container, "dragging"), ve(this.container));
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
    const e = br(t), n = document.body.scrollTop || document.documentElement.scrollTop, s = document.body.scrollLeft || document.documentElement.scrollLeft;
    return R.create({
      x: e.left + parseInt(kt(t, "border-left-width"), 10) - s,
      y: e.top + parseInt(kt(t, "border-top-width"), 10) - n,
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
      a.position(lt.snapToGrid(r.x, c), lt.snapToGrid(r.y, c)), a.removeZIndex();
      const h = this.options.validateNode, u = h ? h(a, {
        sourceNode: o,
        draggingNode: t,
        droppingNode: a,
        targetGraph: n,
        draggingGraph: this.draggingGraph
      }) : !0;
      return typeof u == "boolean" ? u ? (s.addCell(a, { stencil: this.cid }), a) : null : Gy(u).then((d) => d ? (s.addCell(a, { stencil: this.cid }), a) : null);
    }
    return null;
  }
  onRemove() {
    this.draggingGraph && (this.draggingGraph.view.remove(), this.draggingGraph.dispose());
  }
  dispose() {
    this.remove(), As(this.name);
  }
}
uE([
  it.dispose()
], on.prototype, "dispose", null);
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
})(on || (on = {}));
var dE = "\0", Ye = "\0", Na = "";
let fE = class {
  constructor(t) {
    Tt(this, "_isDirected", !0);
    Tt(this, "_isMultigraph", !1);
    Tt(this, "_isCompound", !1);
    // Label for the graph itself
    Tt(this, "_label");
    // Defaults to be set when creating a new node
    Tt(this, "_defaultNodeLabelFn", () => {
    });
    // Defaults to be set when creating a new edge
    Tt(this, "_defaultEdgeLabelFn", () => {
    });
    // v -> label
    Tt(this, "_nodes", {});
    // v -> edgeObj
    Tt(this, "_in", {});
    // u -> v -> Number
    Tt(this, "_preds", {});
    // v -> edgeObj
    Tt(this, "_out", {});
    // v -> w -> Number
    Tt(this, "_sucs", {});
    // e -> edgeObj
    Tt(this, "_edgeObjs", {});
    // e -> label
    Tt(this, "_edgeLabels", {});
    /* Number of nodes in the graph. Should only be changed by the implementation. */
    Tt(this, "_nodeCount", 0);
    /* Number of edges in the graph. Should only be changed by the implementation. */
    Tt(this, "_edgeCount", 0);
    Tt(this, "_parent");
    Tt(this, "_children");
    t && (this._isDirected = Object.hasOwn(t, "directed") ? t.directed : !0, this._isMultigraph = Object.hasOwn(t, "multigraph") ? t.multigraph : !1, this._isCompound = Object.hasOwn(t, "compound") ? t.compound : !1), this._isCompound && (this._parent = {}, this._children = {}, this._children[Ye] = {});
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
    return Object.hasOwn(this._nodes, t) ? (arguments.length > 1 && (this._nodes[t] = e), this) : (this._nodes[t] = arguments.length > 1 ? e : this._defaultNodeLabelFn(t), this._isCompound && (this._parent[t] = Ye, this._children[t] = {}, this._children[Ye][t] = !0), this._in[t] = {}, this._preds[t] = {}, this._out[t] = {}, this._sucs[t] = {}, ++this._nodeCount, this);
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
      e = Ye;
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
      if (e !== Ye)
        return e;
    }
  }
  /**
   * Gets list of direct children of node v.
   * Complexity: O(1).
   */
  children(t = Ye) {
    if (this._isCompound) {
      var e = this._children[t];
      if (e)
        return Object.keys(e);
    } else {
      if (t === Ye)
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
    var a = ei(this._isDirected, t, e, n);
    if (Object.hasOwn(this._edgeLabels, a))
      return r && (this._edgeLabels[a] = s), this;
    if (n !== void 0 && !this._isMultigraph)
      throw new Error("Cannot set a named edge when isMultigraph = false");
    this.setNode(t), this.setNode(e), this._edgeLabels[a] = r ? s : this._defaultEdgeLabelFn(t, e, n);
    var l = gE(this._isDirected, t, e, n);
    return t = l.v, e = l.w, Object.freeze(l), this._edgeObjs[a] = l, La(this._preds[e], t), La(this._sucs[t], e), this._in[e][a] = l, this._out[t][a] = l, this._edgeCount++, this;
  }
  /**
   * Gets the label for the specified edge.
   * Complexity: O(1).
   */
  edge(t, e, n) {
    var s = arguments.length === 1 ? Js(this._isDirected, arguments[0]) : ei(this._isDirected, t, e, n);
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
    var s = arguments.length === 1 ? Js(this._isDirected, arguments[0]) : ei(this._isDirected, t, e, n);
    return Object.hasOwn(this._edgeLabels, s);
  }
  /**
   * Removes the specified edge from the graph. No subgraphs are considered.
   * Complexity: O(1).
   */
  removeEdge(t, e, n) {
    var s = arguments.length === 1 ? Js(this._isDirected, arguments[0]) : ei(this._isDirected, t, e, n), r = this._edgeObjs[s];
    return r && (t = r.v, e = r.w, delete this._edgeLabels[s], delete this._edgeObjs[s], Ia(this._preds[e], t), Ia(this._sucs[t], e), delete this._in[e][s], delete this._out[t][s], this._edgeCount--), this;
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
function La(i, t) {
  i[t] ? i[t]++ : i[t] = 1;
}
function Ia(i, t) {
  --i[t] || delete i[t];
}
function ei(i, t, e, n) {
  var s = "" + t, r = "" + e;
  if (!i && s > r) {
    var o = s;
    s = r, r = o;
  }
  return s + Na + r + Na + (n === void 0 ? dE : n);
}
function gE(i, t, e, n) {
  var s = "" + t, r = "" + e;
  if (!i && s > r) {
    var o = s;
    s = r, r = o;
  }
  var a = { v: s, w: r };
  return n && (a.name = n), a;
}
function Js(i, t) {
  return ei(i, t.v, t.w, t.name);
}
var co = fE, pE = "2.2.4", mE = {
  Graph: co,
  version: pE
}, bE = co, yE = {
  write: vE,
  read: EE
};
function vE(i) {
  var t = {
    options: {
      directed: i.isDirected(),
      multigraph: i.isMultigraph(),
      compound: i.isCompound()
    },
    nodes: wE(i),
    edges: xE(i)
  };
  return i.graph() !== void 0 && (t.value = structuredClone(i.graph())), t;
}
function wE(i) {
  return i.nodes().map(function(t) {
    var e = i.node(t), n = i.parent(t), s = { v: t };
    return e !== void 0 && (s.value = e), n !== void 0 && (s.parent = n), s;
  });
}
function xE(i) {
  return i.edges().map(function(t) {
    var e = i.edge(t), n = { v: t.v, w: t.w };
    return t.name !== void 0 && (n.name = t.name), e !== void 0 && (n.value = e), n;
  });
}
function EE(i) {
  var t = new bE(i.options).setGraph(i.value);
  return i.nodes.forEach(function(e) {
    t.setNode(e.v, e.value), e.parent && t.setParent(e.v, e.parent);
  }), i.edges.forEach(function(e) {
    t.setEdge({ v: e.v, w: e.w, name: e.name }, e.value);
  }), t;
}
var CE = SE;
function SE(i) {
  var t = {}, e = [], n;
  function s(r) {
    Object.hasOwn(t, r) || (t[r] = !0, n.push(r), i.successors(r).forEach(s), i.predecessors(r).forEach(s));
  }
  return i.nodes().forEach(function(r) {
    n = [], s(r), n.length && e.push(n);
  }), e;
}
let OE = class {
  constructor() {
    Tt(this, "_arr", []);
    Tt(this, "_keyIndices", {});
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
var Xh = OE, PE = Xh, Yh = ME, AE = () => 1;
function ME(i, t, e, n) {
  return TE(
    i,
    String(t),
    e || AE,
    n || function(s) {
      return i.outEdges(s);
    }
  );
}
function TE(i, t, e, n) {
  var s = {}, r = new PE(), o, a, l = function(c) {
    var h = c.v !== o ? c.v : c.w, u = s[h], d = e(c), f = a.distance + d;
    if (d < 0)
      throw new Error("dijkstra does not allow negative edge weights. Bad edge: " + c + " Weight: " + d);
    f < u.distance && (u.distance = f, u.predecessor = o, r.decrease(h, f));
  };
  for (i.nodes().forEach(function(c) {
    var h = c === t ? 0 : Number.POSITIVE_INFINITY;
    s[c] = { distance: h }, r.add(c, h);
  }); r.size() > 0 && (o = r.removeMin(), a = s[o], a.distance !== Number.POSITIVE_INFINITY); )
    n(o).forEach(l);
  return s;
}
var NE = Yh, LE = IE;
function IE(i, t, e) {
  return i.nodes().reduce(function(n, s) {
    return n[s] = NE(i, s, t, e), n;
  }, {});
}
var Jh = jE;
function jE(i) {
  var t = 0, e = [], n = {}, s = [];
  function r(o) {
    var a = n[o] = {
      onStack: !0,
      lowlink: t,
      index: t++
    };
    if (e.push(o), i.successors(o).forEach(function(h) {
      Object.hasOwn(n, h) ? n[h].onStack && (a.lowlink = Math.min(a.lowlink, n[h].index)) : (r(h), a.lowlink = Math.min(a.lowlink, n[h].lowlink));
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
var kE = Jh, RE = DE;
function DE(i) {
  return kE(i).filter(function(t) {
    return t.length > 1 || t.length === 1 && i.hasEdge(t[0], t[0]);
  });
}
var $E = BE, _E = () => 1;
function BE(i, t, e) {
  return zE(
    i,
    t || _E,
    e || function(n) {
      return i.outEdges(n);
    }
  );
}
function zE(i, t, e) {
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
        var h = l[r], u = o[c], d = l[c], f = h.distance + u.distance;
        f < d.distance && (d.distance = f, d.predecessor = u.predecessor);
      });
    });
  }), n;
}
function Kh(i) {
  var t = {}, e = {}, n = [];
  function s(r) {
    if (Object.hasOwn(e, r))
      throw new Or();
    Object.hasOwn(t, r) || (e[r] = !0, t[r] = !0, i.predecessors(r).forEach(s), delete e[r], n.push(r));
  }
  if (i.sinks().forEach(s), Object.keys(t).length !== i.nodeCount())
    throw new Or();
  return n;
}
class Or extends Error {
  constructor() {
    super(...arguments);
  }
}
var Zh = Kh;
Kh.CycleException = Or;
var ja = Zh, VE = FE;
function FE(i) {
  try {
    ja(i);
  } catch (t) {
    if (t instanceof ja.CycleException)
      return !1;
    throw t;
  }
  return !0;
}
var Qh = GE;
function GE(i, t, e) {
  Array.isArray(t) || (t = [t]);
  var n = i.isDirected() ? (a) => i.successors(a) : (a) => i.neighbors(a), s = e === "post" ? HE : qE, r = [], o = {};
  return t.forEach((a) => {
    if (!i.hasNode(a))
      throw new Error("Graph does not have node: " + a);
    s(a, n, o, r);
  }), r;
}
function HE(i, t, e, n) {
  for (var s = [[i, !1]]; s.length > 0; ) {
    var r = s.pop();
    r[1] ? n.push(r[0]) : Object.hasOwn(e, r[0]) || (e[r[0]] = !0, s.push([r[0], !0]), tu(t(r[0]), (o) => s.push([o, !1])));
  }
}
function qE(i, t, e, n) {
  for (var s = [i]; s.length > 0; ) {
    var r = s.pop();
    Object.hasOwn(e, r) || (e[r] = !0, n.push(r), tu(t(r), (o) => s.push(o)));
  }
}
function tu(i, t) {
  for (var e = i.length; e--; )
    t(i[e], e, i);
  return i;
}
var UE = Qh, WE = XE;
function XE(i, t) {
  return UE(i, t, "post");
}
var YE = Qh, JE = KE;
function KE(i, t) {
  return YE(i, t, "pre");
}
var ZE = co, QE = Xh, tC = eC;
function eC(i, t) {
  var e = new ZE(), n = {}, s = new QE(), r;
  function o(l) {
    var c = l.v === r ? l.w : l.v, h = s.priority(c);
    if (h !== void 0) {
      var u = t(l);
      u < h && (n[c] = r, s.decrease(c, u));
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
var nC = {
  components: CE,
  dijkstra: Yh,
  dijkstraAll: LE,
  findCycles: RE,
  floydWarshall: $E,
  isAcyclic: VE,
  postorder: WE,
  preorder: JE,
  prim: tC,
  tarjan: Jh,
  topsort: Zh
}, ka = mE, be = {
  Graph: ka.Graph,
  json: yE,
  alg: nC,
  version: ka.version
};
let iC = class {
  constructor() {
    let t = {};
    t._next = t._prev = t, this._sentinel = t;
  }
  dequeue() {
    let t = this._sentinel, e = t._prev;
    if (e !== t)
      return Ra(e), e;
  }
  enqueue(t) {
    let e = this._sentinel;
    t._prev && t._next && Ra(t), t._next = e._next, e._next._prev = t, e._next = t, t._prev = e;
  }
  toString() {
    let t = [], e = this._sentinel, n = e._prev;
    for (; n !== e; )
      t.push(JSON.stringify(n, sC)), n = n._prev;
    return "[" + t.join(", ") + "]";
  }
};
function Ra(i) {
  i._prev._next = i._next, i._next._prev = i._prev, delete i._next, delete i._prev;
}
function sC(i, t) {
  if (i !== "_next" && i !== "_prev")
    return t;
}
var rC = iC;
let oC = be.Graph, aC = rC;
var lC = hC;
let cC = () => 1;
function hC(i, t) {
  if (i.nodeCount() <= 1)
    return [];
  let e = dC(i, t || cC);
  return uC(e.graph, e.buckets, e.zeroIdx).flatMap((s) => i.outEdges(s.v, s.w));
}
function uC(i, t, e) {
  let n = [], s = t[t.length - 1], r = t[0], o;
  for (; i.nodeCount(); ) {
    for (; o = r.dequeue(); )
      Ks(i, t, e, o);
    for (; o = s.dequeue(); )
      Ks(i, t, e, o);
    if (i.nodeCount()) {
      for (let a = t.length - 2; a > 0; --a)
        if (o = t[a].dequeue(), o) {
          n = n.concat(Ks(i, t, e, o, !0));
          break;
        }
    }
  }
  return n;
}
function Ks(i, t, e, n, s) {
  let r = s ? [] : void 0;
  return i.inEdges(n.v).forEach((o) => {
    let a = i.edge(o), l = i.node(o.v);
    s && r.push({ v: o.v, w: o.w }), l.out -= a, Pr(t, e, l);
  }), i.outEdges(n.v).forEach((o) => {
    let a = i.edge(o), l = o.w, c = i.node(l);
    c.in -= a, Pr(t, e, c);
  }), i.removeNode(n.v), r;
}
function dC(i, t) {
  let e = new oC(), n = 0, s = 0;
  i.nodes().forEach((a) => {
    e.setNode(a, { v: a, in: 0, out: 0 });
  }), i.edges().forEach((a) => {
    let l = e.edge(a.v, a.w) || 0, c = t(a), h = l + c;
    e.setEdge(a.v, a.w, h), s = Math.max(s, e.node(a.v).out += c), n = Math.max(n, e.node(a.w).in += c);
  });
  let r = fC(s + n + 3).map(() => new aC()), o = n + 1;
  return e.nodes().forEach((a) => {
    Pr(r, o, e.node(a));
  }), { graph: e, buckets: r, zeroIdx: o };
}
function Pr(i, t, e) {
  e.out ? e.in ? i[e.out - e.in + t].enqueue(e) : i[i.length - 1].enqueue(e) : i[0].enqueue(e);
}
function fC(i) {
  const t = [];
  for (let e = 0; e < i; e++)
    t.push(e);
  return t;
}
let eu = be.Graph;
var It = {
  addBorderNode: EC,
  addDummyNode: nu,
  applyWithChunking: Rs,
  asNonCompoundGraph: pC,
  buildLayerMatrix: vC,
  intersectRect: yC,
  mapValues: TC,
  maxRank: su,
  normalizeRanks: wC,
  notime: PC,
  partition: SC,
  pick: MC,
  predecessorWeights: bC,
  range: ou,
  removeEmptyRanks: xC,
  simplify: gC,
  successorWeights: mC,
  time: OC,
  uniqueId: ru,
  zipObject: ho
};
function nu(i, t, e, n) {
  for (var s = n; i.hasNode(s); )
    s = ru(n);
  return e.dummy = t, i.setNode(s, e), s;
}
function gC(i) {
  let t = new eu().setGraph(i.graph());
  return i.nodes().forEach((e) => t.setNode(e, i.node(e))), i.edges().forEach((e) => {
    let n = t.edge(e.v, e.w) || { weight: 0, minlen: 1 }, s = i.edge(e);
    t.setEdge(e.v, e.w, {
      weight: n.weight + s.weight,
      minlen: Math.max(n.minlen, s.minlen)
    });
  }), t;
}
function pC(i) {
  let t = new eu({ multigraph: i.isMultigraph() }).setGraph(i.graph());
  return i.nodes().forEach((e) => {
    i.children(e).length || t.setNode(e, i.node(e));
  }), i.edges().forEach((e) => {
    t.setEdge(e, i.edge(e));
  }), t;
}
function mC(i) {
  let t = i.nodes().map((e) => {
    let n = {};
    return i.outEdges(e).forEach((s) => {
      n[s.w] = (n[s.w] || 0) + i.edge(s).weight;
    }), n;
  });
  return ho(i.nodes(), t);
}
function bC(i) {
  let t = i.nodes().map((e) => {
    let n = {};
    return i.inEdges(e).forEach((s) => {
      n[s.v] = (n[s.v] || 0) + i.edge(s).weight;
    }), n;
  });
  return ho(i.nodes(), t);
}
function yC(i, t) {
  let e = i.x, n = i.y, s = t.x - e, r = t.y - n, o = i.width / 2, a = i.height / 2;
  if (!s && !r)
    throw new Error("Not possible to find intersection inside of the rectangle");
  let l, c;
  return Math.abs(r) * o > Math.abs(s) * a ? (r < 0 && (a = -a), l = a * s / r, c = a) : (s < 0 && (o = -o), l = o, c = o * r / s), { x: e + l, y: n + c };
}
function vC(i) {
  let t = ou(su(i) + 1).map(() => []);
  return i.nodes().forEach((e) => {
    let n = i.node(e), s = n.rank;
    s !== void 0 && (t[s][n.order] = e);
  }), t;
}
function wC(i) {
  let t = i.nodes().map((n) => {
    let s = i.node(n).rank;
    return s === void 0 ? Number.MAX_VALUE : s;
  }), e = Rs(Math.min, t);
  i.nodes().forEach((n) => {
    let s = i.node(n);
    Object.hasOwn(s, "rank") && (s.rank -= e);
  });
}
function xC(i) {
  let t = i.nodes().map((o) => i.node(o).rank), e = Rs(Math.min, t), n = [];
  i.nodes().forEach((o) => {
    let a = i.node(o).rank - e;
    n[a] || (n[a] = []), n[a].push(o);
  });
  let s = 0, r = i.graph().nodeRankFactor;
  Array.from(n).forEach((o, a) => {
    o === void 0 && a % r !== 0 ? --s : o !== void 0 && s && o.forEach((l) => i.node(l).rank += s);
  });
}
function EC(i, t, e, n) {
  let s = {
    width: 0,
    height: 0
  };
  return arguments.length >= 4 && (s.rank = e, s.order = n), nu(i, "border", s, t);
}
function CC(i, t = iu) {
  const e = [];
  for (let n = 0; n < i.length; n += t) {
    const s = i.slice(n, n + t);
    e.push(s);
  }
  return e;
}
const iu = 65535;
function Rs(i, t) {
  if (t.length > iu) {
    const e = CC(t);
    return i.apply(null, e.map((n) => i.apply(null, n)));
  } else
    return i.apply(null, t);
}
function su(i) {
  const e = i.nodes().map((n) => {
    let s = i.node(n).rank;
    return s === void 0 ? Number.MIN_VALUE : s;
  });
  return Rs(Math.max, e);
}
function SC(i, t) {
  let e = { lhs: [], rhs: [] };
  return i.forEach((n) => {
    t(n) ? e.lhs.push(n) : e.rhs.push(n);
  }), e;
}
function OC(i, t) {
  let e = Date.now();
  try {
    return t();
  } finally {
    console.log(i + " time: " + (Date.now() - e) + "ms");
  }
}
function PC(i, t) {
  return t();
}
let AC = 0;
function ru(i) {
  var t = ++AC;
  return i + ("" + t);
}
function ou(i, t, e = 1) {
  t == null && (t = i, i = 0);
  let n = (r) => r < t;
  e < 0 && (n = (r) => t < r);
  const s = [];
  for (let r = i; n(r); r += e)
    s.push(r);
  return s;
}
function MC(i, t) {
  const e = {};
  for (const n of t)
    i[n] !== void 0 && (e[n] = i[n]);
  return e;
}
function TC(i, t) {
  let e = t;
  return typeof t == "string" && (e = (n) => n[t]), Object.entries(i).reduce((n, [s, r]) => (n[s] = e(r, s), n), {});
}
function ho(i, t) {
  return i.reduce((e, n, s) => (e[n] = t[s], e), {});
}
let NC = lC, LC = It.uniqueId;
var IC = {
  run: jC,
  undo: RC
};
function jC(i) {
  (i.graph().acyclicer === "greedy" ? NC(i, e(i)) : kC(i)).forEach((n) => {
    let s = i.edge(n);
    i.removeEdge(n), s.forwardName = n.name, s.reversed = !0, i.setEdge(n.w, n.v, s, LC("rev"));
  });
  function e(n) {
    return (s) => n.edge(s).weight;
  }
}
function kC(i) {
  let t = [], e = {}, n = {};
  function s(r) {
    Object.hasOwn(n, r) || (n[r] = !0, e[r] = !0, i.outEdges(r).forEach((o) => {
      Object.hasOwn(e, o.w) ? t.push(o) : s(o.w);
    }), delete e[r]);
  }
  return i.nodes().forEach(s), t;
}
function RC(i) {
  i.edges().forEach((t) => {
    let e = i.edge(t);
    if (e.reversed) {
      i.removeEdge(t);
      let n = e.forwardName;
      delete e.reversed, delete e.forwardName, i.setEdge(t.w, t.v, e, n);
    }
  });
}
let DC = It;
var $C = {
  run: _C,
  undo: zC
};
function _C(i) {
  i.graph().dummyChains = [], i.edges().forEach((t) => BC(i, t));
}
function BC(i, t) {
  let e = t.v, n = i.node(e).rank, s = t.w, r = i.node(s).rank, o = t.name, a = i.edge(t), l = a.labelRank;
  if (r === n + 1) return;
  i.removeEdge(t);
  let c, h, u;
  for (u = 0, ++n; n < r; ++u, ++n)
    a.points = [], h = {
      width: 0,
      height: 0,
      edgeLabel: a,
      edgeObj: t,
      rank: n
    }, c = DC.addDummyNode(i, "edge", h, "_d"), n === l && (h.width = a.width, h.height = a.height, h.dummy = "edge-label", h.labelpos = a.labelpos), i.setEdge(e, c, { weight: a.weight }, o), u === 0 && i.graph().dummyChains.push(c), e = c;
  i.setEdge(e, s, { weight: a.weight }, o);
}
function zC(i) {
  i.graph().dummyChains.forEach((t) => {
    let e = i.node(t), n = e.edgeLabel, s;
    for (i.setEdge(e.edgeObj, n); e.dummy; )
      s = i.successors(t)[0], i.removeNode(t), n.points.push({ x: e.x, y: e.y }), e.dummy === "edge-label" && (n.x = e.x, n.y = e.y, n.width = e.width, n.height = e.height), t = s, e = i.node(t);
  });
}
const { applyWithChunking: VC } = It;
var Ds = {
  longestPath: FC,
  slack: GC
};
function FC(i) {
  var t = {};
  function e(n) {
    var s = i.node(n);
    if (Object.hasOwn(t, n))
      return s.rank;
    t[n] = !0;
    let r = i.outEdges(n).map((a) => a == null ? Number.POSITIVE_INFINITY : e(a.w) - i.edge(a).minlen);
    var o = VC(Math.min, r);
    return o === Number.POSITIVE_INFINITY && (o = 0), s.rank = o;
  }
  i.sources().forEach(e);
}
function GC(i, t) {
  return i.node(t.w).rank - i.node(t.v).rank - i.edge(t).minlen;
}
var HC = be.Graph, hs = Ds.slack, au = qC;
function qC(i) {
  var t = new HC({ directed: !1 }), e = i.nodes()[0], n = i.nodeCount();
  t.setNode(e, {});
  for (var s, r; UC(t, i) < n; )
    s = WC(t, i), r = t.hasNode(s.v) ? hs(i, s) : -hs(i, s), XC(t, i, r);
  return t;
}
function UC(i, t) {
  function e(n) {
    t.nodeEdges(n).forEach((s) => {
      var r = s.v, o = n === r ? s.w : r;
      !i.hasNode(o) && !hs(t, s) && (i.setNode(o, {}), i.setEdge(n, o, {}), e(o));
    });
  }
  return i.nodes().forEach(e), i.nodeCount();
}
function WC(i, t) {
  return t.edges().reduce((n, s) => {
    let r = Number.POSITIVE_INFINITY;
    return i.hasNode(s.v) !== i.hasNode(s.w) && (r = hs(t, s)), r < n[0] ? [r, s] : n;
  }, [Number.POSITIVE_INFINITY, null])[1];
}
function XC(i, t, e) {
  i.nodes().forEach((n) => t.node(n).rank += e);
}
var YC = au, Da = Ds.slack, JC = Ds.longestPath, KC = be.alg.preorder, ZC = be.alg.postorder, QC = It.simplify, tS = un;
un.initLowLimValues = fo;
un.initCutValues = uo;
un.calcCutValue = lu;
un.leaveEdge = hu;
un.enterEdge = uu;
un.exchangeEdges = du;
function un(i) {
  i = QC(i), JC(i);
  var t = YC(i);
  fo(t), uo(t, i);
  for (var e, n; e = hu(t); )
    n = uu(t, i, e), du(t, i, e, n);
}
function uo(i, t) {
  var e = ZC(i, i.nodes());
  e = e.slice(0, e.length - 1), e.forEach((n) => eS(i, t, n));
}
function eS(i, t, e) {
  var n = i.node(e), s = n.parent;
  i.edge(e, s).cutvalue = lu(i, t, e);
}
function lu(i, t, e) {
  var n = i.node(e), s = n.parent, r = !0, o = t.edge(e, s), a = 0;
  return o || (r = !1, o = t.edge(s, e)), a = o.weight, t.nodeEdges(e).forEach((l) => {
    var c = l.v === e, h = c ? l.w : l.v;
    if (h !== s) {
      var u = c === r, d = t.edge(l).weight;
      if (a += u ? d : -d, iS(i, e, h)) {
        var f = i.edge(e, h).cutvalue;
        a += u ? -f : f;
      }
    }
  }), a;
}
function fo(i, t) {
  arguments.length < 2 && (t = i.nodes()[0]), cu(i, {}, 1, t);
}
function cu(i, t, e, n, s) {
  var r = e, o = i.node(n);
  return t[n] = !0, i.neighbors(n).forEach((a) => {
    Object.hasOwn(t, a) || (e = cu(i, t, e, a, n));
  }), o.low = r, o.lim = e++, s ? o.parent = s : delete o.parent, e;
}
function hu(i) {
  return i.edges().find((t) => i.edge(t).cutvalue < 0);
}
function uu(i, t, e) {
  var n = e.v, s = e.w;
  t.hasEdge(n, s) || (n = e.w, s = e.v);
  var r = i.node(n), o = i.node(s), a = r, l = !1;
  r.lim > o.lim && (a = o, l = !0);
  var c = t.edges().filter((h) => l === $a(i, i.node(h.v), a) && l !== $a(i, i.node(h.w), a));
  return c.reduce((h, u) => Da(t, u) < Da(t, h) ? u : h);
}
function du(i, t, e, n) {
  var s = e.v, r = e.w;
  i.removeEdge(s, r), i.setEdge(n.v, n.w, {}), fo(i), uo(i, t), nS(i, t);
}
function nS(i, t) {
  var e = i.nodes().find((s) => !t.node(s).parent), n = KC(i, e);
  n = n.slice(1), n.forEach((s) => {
    var r = i.node(s).parent, o = t.edge(s, r), a = !1;
    o || (o = t.edge(r, s), a = !0), t.node(s).rank = t.node(r).rank + (a ? o.minlen : -o.minlen);
  });
}
function iS(i, t, e) {
  return i.hasEdge(t, e);
}
function $a(i, t, e) {
  return e.low <= t.lim && t.lim <= e.lim;
}
var sS = Ds, fu = sS.longestPath, rS = au, oS = tS, aS = lS;
function lS(i) {
  var t = i.graph().ranker;
  if (t instanceof Function)
    return t(i);
  switch (i.graph().ranker) {
    case "network-simplex":
      _a(i);
      break;
    case "tight-tree":
      hS(i);
      break;
    case "longest-path":
      cS(i);
      break;
    case "none":
      break;
    default:
      _a(i);
  }
}
var cS = fu;
function hS(i) {
  fu(i), rS(i);
}
function _a(i) {
  oS(i);
}
var uS = dS;
function dS(i) {
  let t = gS(i);
  i.graph().dummyChains.forEach((e) => {
    let n = i.node(e), s = n.edgeObj, r = fS(i, t, s.v, s.w), o = r.path, a = r.lca, l = 0, c = o[l], h = !0;
    for (; e !== s.w; ) {
      if (n = i.node(e), h) {
        for (; (c = o[l]) !== a && i.node(c).maxRank < n.rank; )
          l++;
        c === a && (h = !1);
      }
      if (!h) {
        for (; l < o.length - 1 && i.node(c = o[l + 1]).minRank <= n.rank; )
          l++;
        c = o[l];
      }
      i.setParent(e, c), e = i.successors(e)[0];
    }
  });
}
function fS(i, t, e, n) {
  let s = [], r = [], o = Math.min(t[e].low, t[n].low), a = Math.max(t[e].lim, t[n].lim), l, c;
  l = e;
  do
    l = i.parent(l), s.push(l);
  while (l && (t[l].low > o || a > t[l].lim));
  for (c = l, l = n; (l = i.parent(l)) !== c; )
    r.push(l);
  return { path: s.concat(r.reverse()), lca: c };
}
function gS(i) {
  let t = {}, e = 0;
  function n(s) {
    let r = e;
    i.children(s).forEach(n), t[s] = { low: r, lim: e++ };
  }
  return i.children().forEach(n), t;
}
let us = It;
var pS = {
  run: mS,
  cleanup: vS
};
function mS(i) {
  let t = us.addDummyNode(i, "root", {}, "_root"), e = bS(i), n = Object.values(e), s = us.applyWithChunking(Math.max, n) - 1, r = 2 * s + 1;
  i.graph().nestingRoot = t, i.edges().forEach((a) => i.edge(a).minlen *= r);
  let o = yS(i) + 1;
  i.children().forEach((a) => gu(i, t, r, o, s, e, a)), i.graph().nodeRankFactor = r;
}
function gu(i, t, e, n, s, r, o) {
  let a = i.children(o);
  if (!a.length) {
    o !== t && i.setEdge(t, o, { weight: 0, minlen: e });
    return;
  }
  let l = us.addBorderNode(i, "_bt"), c = us.addBorderNode(i, "_bb"), h = i.node(o);
  i.setParent(l, o), h.borderTop = l, i.setParent(c, o), h.borderBottom = c, a.forEach((u) => {
    gu(i, t, e, n, s, r, u);
    let d = i.node(u), f = d.borderTop ? d.borderTop : u, g = d.borderBottom ? d.borderBottom : u, p = d.borderTop ? n : 2 * n, m = f !== g ? 1 : s - r[o] + 1;
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
function bS(i) {
  var t = {};
  function e(n, s) {
    var r = i.children(n);
    r && r.length && r.forEach((o) => e(o, s + 1)), t[n] = s;
  }
  return i.children().forEach((n) => e(n, 1)), t;
}
function yS(i) {
  return i.edges().reduce((t, e) => t + i.edge(e).weight, 0);
}
function vS(i) {
  var t = i.graph();
  i.removeNode(t.nestingRoot), delete t.nestingRoot, i.edges().forEach((e) => {
    var n = i.edge(e);
    n.nestingEdge && i.removeEdge(e);
  });
}
let wS = It;
var xS = ES;
function ES(i) {
  function t(e) {
    let n = i.children(e), s = i.node(e);
    if (n.length && n.forEach(t), Object.hasOwn(s, "minRank")) {
      s.borderLeft = [], s.borderRight = [];
      for (let r = s.minRank, o = s.maxRank + 1; r < o; ++r)
        Ba(i, "borderLeft", "_bl", e, s, r), Ba(i, "borderRight", "_br", e, s, r);
    }
  }
  i.children().forEach(t);
}
function Ba(i, t, e, n, s, r) {
  let o = { width: 0, height: 0, rank: r, borderType: t }, a = s[t][r - 1], l = wS.addDummyNode(i, "border", o, e);
  s[t][r] = l, i.setParent(l, n), a && i.setEdge(a, l, { weight: 1 });
}
var CS = {
  adjust: SS,
  undo: OS
};
function SS(i) {
  let t = i.graph().rankdir.toLowerCase();
  (t === "lr" || t === "rl") && pu(i);
}
function OS(i) {
  let t = i.graph().rankdir.toLowerCase();
  (t === "bt" || t === "rl") && PS(i), (t === "lr" || t === "rl") && (AS(i), pu(i));
}
function pu(i) {
  i.nodes().forEach((t) => za(i.node(t))), i.edges().forEach((t) => za(i.edge(t)));
}
function za(i) {
  let t = i.width;
  i.width = i.height, i.height = t;
}
function PS(i) {
  i.nodes().forEach((t) => Zs(i.node(t))), i.edges().forEach((t) => {
    let e = i.edge(t);
    e.points.forEach(Zs), Object.hasOwn(e, "y") && Zs(e);
  });
}
function Zs(i) {
  i.y = -i.y;
}
function AS(i) {
  i.nodes().forEach((t) => Qs(i.node(t))), i.edges().forEach((t) => {
    let e = i.edge(t);
    e.points.forEach(Qs), Object.hasOwn(e, "x") && Qs(e);
  });
}
function Qs(i) {
  let t = i.x;
  i.x = i.y, i.y = t;
}
let Va = It;
var MS = TS;
function TS(i) {
  let t = {}, e = i.nodes().filter((l) => !i.children(l).length), n = e.map((l) => i.node(l).rank), s = Va.applyWithChunking(Math.max, n), r = Va.range(s + 1).map(() => []);
  function o(l) {
    if (t[l]) return;
    t[l] = !0;
    let c = i.node(l);
    r[c.rank].push(l), i.successors(l).forEach(o);
  }
  return e.sort((l, c) => i.node(l).rank - i.node(c).rank).forEach(o), r;
}
let NS = It.zipObject;
var LS = IS;
function IS(i, t) {
  let e = 0;
  for (let n = 1; n < t.length; ++n)
    e += jS(i, t[n - 1], t[n]);
  return e;
}
function jS(i, t, e) {
  let n = NS(e, e.map((c, h) => h)), s = t.flatMap((c) => i.outEdges(c).map((h) => ({ pos: n[h.w], weight: i.edge(h).weight })).sort((h, u) => h.pos - u.pos)), r = 1;
  for (; r < e.length; ) r <<= 1;
  let o = 2 * r - 1;
  r -= 1;
  let a = new Array(o).fill(0), l = 0;
  return s.forEach((c) => {
    let h = c.pos + r;
    a[h] += c.weight;
    let u = 0;
    for (; h > 0; )
      h % 2 && (u += a[h + 1]), h = h - 1 >> 1, a[h] += c.weight;
    l += c.weight * u;
  }), l;
}
var kS = RS;
function RS(i, t = []) {
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
let DS = It;
var $S = _S;
function _S(i, t) {
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
  return BS(n);
}
function BS(i) {
  let t = [];
  function e(s) {
    return (r) => {
      r.merged || (r.barycenter === void 0 || s.barycenter === void 0 || r.barycenter >= s.barycenter) && zS(s, r);
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
  return t.filter((s) => !s.merged).map((s) => DS.pick(s, ["vs", "i", "barycenter", "weight"]));
}
function zS(i, t) {
  let e = 0, n = 0;
  i.weight && (e += i.barycenter * i.weight, n += i.weight), t.weight && (e += t.barycenter * t.weight, n += t.weight), i.vs = t.vs.concat(i.vs), i.barycenter = e / n, i.weight = n, i.i = Math.min(t.i, i.i), t.merged = !0;
}
let VS = It;
var FS = GS;
function GS(i, t) {
  let e = VS.partition(i, (h) => Object.hasOwn(h, "barycenter")), n = e.lhs, s = e.rhs.sort((h, u) => u.i - h.i), r = [], o = 0, a = 0, l = 0;
  n.sort(HS(!!t)), l = Fa(r, s, l), n.forEach((h) => {
    l += h.vs.length, r.push(h.vs), o += h.barycenter * h.weight, a += h.weight, l = Fa(r, s, l);
  });
  let c = { vs: r.flat(!0) };
  return a && (c.barycenter = o / a, c.weight = a), c;
}
function Fa(i, t, e) {
  let n;
  for (; t.length && (n = t[t.length - 1]).i <= e; )
    t.pop(), i.push(n.vs), e++;
  return e;
}
function HS(i) {
  return (t, e) => t.barycenter < e.barycenter ? -1 : t.barycenter > e.barycenter ? 1 : i ? e.i - t.i : t.i - e.i;
}
let qS = kS, US = $S, WS = FS;
var XS = mu;
function mu(i, t, e, n) {
  let s = i.children(t), r = i.node(t), o = r ? r.borderLeft : void 0, a = r ? r.borderRight : void 0, l = {};
  o && (s = s.filter((d) => d !== o && d !== a));
  let c = qS(i, s);
  c.forEach((d) => {
    if (i.children(d.v).length) {
      let f = mu(i, d.v, e, n);
      l[d.v] = f, Object.hasOwn(f, "barycenter") && JS(d, f);
    }
  });
  let h = US(c, e);
  YS(h, l);
  let u = WS(h, n);
  if (o && (u.vs = [o, u.vs, a].flat(!0), i.predecessors(o).length)) {
    let d = i.node(i.predecessors(o)[0]), f = i.node(i.predecessors(a)[0]);
    Object.hasOwn(u, "barycenter") || (u.barycenter = 0, u.weight = 0), u.barycenter = (u.barycenter * u.weight + d.order + f.order) / (u.weight + 2), u.weight += 2;
  }
  return u;
}
function YS(i, t) {
  i.forEach((e) => {
    e.vs = e.vs.flatMap((n) => t[n] ? t[n].vs : n);
  });
}
function JS(i, t) {
  i.barycenter !== void 0 ? (i.barycenter = (i.barycenter * i.weight + t.barycenter * t.weight) / (i.weight + t.weight), i.weight += t.weight) : (i.barycenter = t.barycenter, i.weight = t.weight);
}
let KS = be.Graph, ZS = It;
var QS = tO;
function tO(i, t, e, n) {
  n || (n = i.nodes());
  let s = eO(i), r = new KS({ compound: !0 }).setGraph({ root: s }).setDefaultNodeLabel((o) => i.node(o));
  return n.forEach((o) => {
    let a = i.node(o), l = i.parent(o);
    (a.rank === t || a.minRank <= t && t <= a.maxRank) && (r.setNode(o), r.setParent(o, l || s), i[e](o).forEach((c) => {
      let h = c.v === o ? c.w : c.v, u = r.edge(h, o), d = u !== void 0 ? u.weight : 0;
      r.setEdge(h, o, { weight: i.edge(c).weight + d });
    }), Object.hasOwn(a, "minRank") && r.setNode(o, {
      borderLeft: a.borderLeft[t],
      borderRight: a.borderRight[t]
    }));
  }), r;
}
function eO(i) {
  for (var t; i.hasNode(t = ZS.uniqueId("_root")); ) ;
  return t;
}
var nO = iO;
function iO(i, t, e) {
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
let sO = MS, rO = LS, oO = XS, aO = QS, lO = nO, cO = be.Graph, Fi = It;
var hO = bu;
function bu(i, t) {
  if (t && typeof t.customOrder == "function") {
    t.customOrder(i, bu);
    return;
  }
  let e = Fi.maxRank(i), n = Ga(i, Fi.range(1, e + 1), "inEdges"), s = Ga(i, Fi.range(e - 1, -1, -1), "outEdges"), r = sO(i);
  if (Ha(i, r), t && t.disableOptimalOrderHeuristic)
    return;
  let o = Number.POSITIVE_INFINITY, a;
  for (let l = 0, c = 0; c < 4; ++l, ++c) {
    uO(l % 2 ? n : s, l % 4 >= 2), r = Fi.buildLayerMatrix(i);
    let h = rO(i, r);
    h < o && (c = 0, a = Object.assign({}, r), o = h);
  }
  Ha(i, a);
}
function Ga(i, t, e) {
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
    return aO(i, r, e, n.get(r) || []);
  });
}
function uO(i, t) {
  let e = new cO();
  i.forEach(function(n) {
    let s = n.graph().root, r = oO(n, s, e, t);
    r.vs.forEach((o, a) => n.node(o).order = a), lO(n, e, r.vs);
  });
}
function Ha(i, t) {
  Object.values(t).forEach((e) => e.forEach((n, s) => i.node(n).order = s));
}
let dO = be.Graph, Pe = It;
var fO = {
  positionX: SO
};
function gO(i, t) {
  let e = {};
  function n(s, r) {
    let o = 0, a = 0, l = s.length, c = r[r.length - 1];
    return r.forEach((h, u) => {
      let d = mO(i, h), f = d ? i.node(d).order : l;
      (d || h === c) && (r.slice(a, u + 1).forEach((g) => {
        i.predecessors(g).forEach((p) => {
          let m = i.node(p), b = m.order;
          (b < o || f < b) && !(m.dummy && i.node(g).dummy) && yu(e, p, g);
        });
      }), a = u + 1, o = f);
    }), r;
  }
  return t.length && t.reduce(n), e;
}
function pO(i, t) {
  let e = {};
  function n(r, o, a, l, c) {
    let h;
    Pe.range(o, a).forEach((u) => {
      h = r[u], i.node(h).dummy && i.predecessors(h).forEach((d) => {
        let f = i.node(d);
        f.dummy && (f.order < l || f.order > c) && yu(e, d, h);
      });
    });
  }
  function s(r, o) {
    let a = -1, l, c = 0;
    return o.forEach((h, u) => {
      if (i.node(h).dummy === "border") {
        let d = i.predecessors(h);
        d.length && (l = i.node(d[0]).order, n(o, c, u, a, l), c = u, a = l);
      }
      n(o, c, o.length, l, r.length);
    }), o;
  }
  return t.length && t.reduce(s), e;
}
function mO(i, t) {
  if (i.node(t).dummy)
    return i.predecessors(t).find((e) => i.node(e).dummy);
}
function yu(i, t, e) {
  if (t > e) {
    let s = t;
    t = e, e = s;
  }
  let n = i[t];
  n || (i[t] = n = {}), n[e] = !0;
}
function bO(i, t, e) {
  if (t > e) {
    let n = t;
    t = e, e = n;
  }
  return !!i[t] && Object.hasOwn(i[t], e);
}
function yO(i, t, e, n) {
  let s = {}, r = {}, o = {};
  return t.forEach((a) => {
    a.forEach((l, c) => {
      s[l] = l, r[l] = l, o[l] = c;
    });
  }), t.forEach((a) => {
    let l = -1;
    a.forEach((c) => {
      let h = n(c);
      if (h.length) {
        h = h.sort((d, f) => o[d] - o[f]);
        let u = (h.length - 1) / 2;
        for (let d = Math.floor(u), f = Math.ceil(u); d <= f; ++d) {
          let g = h[d];
          r[c] === c && l < o[g] && !bO(e, c, g) && (r[g] = c, r[c] = s[c] = s[g], l = o[g]);
        }
      }
    });
  }), { root: s, align: r };
}
function vO(i, t, e, n, s) {
  let r = {}, o = wO(i, t, e, s), a = s ? "borderLeft" : "borderRight";
  function l(u, d) {
    let f = o.nodes(), g = f.pop(), p = {};
    for (; g; )
      p[g] ? u(g) : (p[g] = !0, f.push(g), f = f.concat(d(g))), g = f.pop();
  }
  function c(u) {
    r[u] = o.inEdges(u).reduce((d, f) => Math.max(d, r[f.v] + o.edge(f)), 0);
  }
  function h(u) {
    let d = o.outEdges(u).reduce((g, p) => Math.min(g, r[p.w] - o.edge(p)), Number.POSITIVE_INFINITY), f = i.node(u);
    d !== Number.POSITIVE_INFINITY && f.borderType !== a && (r[u] = Math.max(r[u], d));
  }
  return l(c, o.predecessors.bind(o)), l(h, o.successors.bind(o)), Object.keys(n).forEach((u) => r[u] = r[e[u]]), r;
}
function wO(i, t, e, n) {
  let s = new dO(), r = i.graph(), o = OO(r.nodesep, r.edgesep, n);
  return t.forEach((a) => {
    let l;
    a.forEach((c) => {
      let h = e[c];
      if (s.setNode(h), l) {
        var u = e[l], d = s.edge(u, h);
        s.setEdge(u, h, Math.max(o(i, c, l), d || 0));
      }
      l = c;
    });
  }), s;
}
function xO(i, t) {
  return Object.values(t).reduce((e, n) => {
    let s = Number.NEGATIVE_INFINITY, r = Number.POSITIVE_INFINITY;
    Object.entries(n).forEach(([a, l]) => {
      let c = PO(i, a) / 2;
      s = Math.max(l + c, s), r = Math.min(l - c, r);
    });
    const o = s - r;
    return o < e[0] && (e = [o, n]), e;
  }, [Number.POSITIVE_INFINITY, null])[1];
}
function EO(i, t) {
  let e = Object.values(t), n = Pe.applyWithChunking(Math.min, e), s = Pe.applyWithChunking(Math.max, e);
  ["u", "d"].forEach((r) => {
    ["l", "r"].forEach((o) => {
      let a = r + o, l = i[a];
      if (l === t) return;
      let c = Object.values(l), h = n - Pe.applyWithChunking(Math.min, c);
      o !== "l" && (h = s - Pe.applyWithChunking(Math.max, c)), h && (i[a] = Pe.mapValues(l, (u) => u + h));
    });
  });
}
function CO(i, t) {
  return Pe.mapValues(i.ul, (e, n) => {
    if (t)
      return i[t.toLowerCase()][n];
    {
      let s = Object.values(i).map((r) => r[n]).sort((r, o) => r - o);
      return (s[1] + s[2]) / 2;
    }
  });
}
function SO(i) {
  let t = Pe.buildLayerMatrix(i), e = Object.assign(
    gO(i, t),
    pO(i, t)
  ), n = {}, s;
  ["u", "d"].forEach((o) => {
    s = o === "u" ? t : Object.values(t).reverse(), ["l", "r"].forEach((a) => {
      a === "r" && (s = s.map((u) => Object.values(u).reverse()));
      let l = (o === "u" ? i.predecessors : i.successors).bind(i), c = yO(i, s, e, l), h = vO(
        i,
        s,
        c.root,
        c.align,
        a === "r"
      );
      a === "r" && (h = Pe.mapValues(h, (u) => -u)), n[o + a] = h;
    });
  });
  let r = xO(i, n);
  return EO(n, r), CO(n, i.graph().align);
}
function OO(i, t, e) {
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
function PO(i, t) {
  return i.node(t).width;
}
let vu = It, AO = fO.positionX;
var MO = TO;
function TO(i) {
  i = vu.asNonCompoundGraph(i), NO(i), Object.entries(AO(i)).forEach(([t, e]) => i.node(t).x = e);
}
function NO(i) {
  let t = vu.buildLayerMatrix(i), e = i.graph().ranksep, n = 0;
  t.forEach((s) => {
    const r = s.reduce((o, a) => {
      const l = i.node(a).height;
      return o > l ? o : l;
    }, 0);
    s.forEach((o) => i.node(o).y = n + r / 2), n += r + e;
  });
}
let qa = IC, Ua = $C, LO = aS, IO = It.normalizeRanks, jO = uS, kO = It.removeEmptyRanks, Wa = pS, RO = xS, Xa = CS, DO = hO, $O = MO, ae = It, _O = be.Graph;
var BO = zO;
function zO(i, t) {
  let e = t && t.debugTiming ? ae.time : ae.notime;
  e("layout", () => {
    let n = e("  buildLayoutGraph", () => JO(i));
    e("  runLayout", () => VO(n, e, t)), e("  updateInputGraph", () => FO(i, n));
  });
}
function VO(i, t, e) {
  t("    makeSpaceForEdgeLabels", () => KO(i)), t("    removeSelfEdges", () => oP(i)), t("    acyclic", () => qa.run(i)), t("    nestingGraph.run", () => Wa.run(i)), t("    rank", () => LO(ae.asNonCompoundGraph(i))), t("    injectEdgeLabelProxies", () => ZO(i)), t("    removeEmptyRanks", () => kO(i)), t("    nestingGraph.cleanup", () => Wa.cleanup(i)), t("    normalizeRanks", () => IO(i)), t("    assignRankMinMax", () => QO(i)), t("    removeEdgeLabelProxies", () => tP(i)), t("    normalize.run", () => Ua.run(i)), t("    parentDummyChains", () => jO(i)), t("    addBorderSegments", () => RO(i)), t("    order", () => DO(i, e)), t("    insertSelfEdges", () => aP(i)), t("    adjustCoordinateSystem", () => Xa.adjust(i)), t("    position", () => $O(i)), t("    positionSelfEdges", () => lP(i)), t("    removeBorderNodes", () => rP(i)), t("    normalize.undo", () => Ua.undo(i)), t("    fixupEdgeLabelCoords", () => iP(i)), t("    undoCoordinateSystem", () => Xa.undo(i)), t("    translateGraph", () => eP(i)), t("    assignNodeIntersects", () => nP(i)), t("    reversePoints", () => sP(i)), t("    acyclic.undo", () => qa.undo(i));
}
function FO(i, t) {
  i.nodes().forEach((e) => {
    let n = i.node(e), s = t.node(e);
    n && (n.x = s.x, n.y = s.y, n.rank = s.rank, t.children(e).length && (n.width = s.width, n.height = s.height));
  }), i.edges().forEach((e) => {
    let n = i.edge(e), s = t.edge(e);
    n.points = s.points, Object.hasOwn(s, "x") && (n.x = s.x, n.y = s.y);
  }), i.graph().width = t.graph().width, i.graph().height = t.graph().height;
}
let GO = ["nodesep", "edgesep", "ranksep", "marginx", "marginy"], HO = { ranksep: 50, edgesep: 20, nodesep: 50, rankdir: "tb" }, qO = ["acyclicer", "ranker", "rankdir", "align"], UO = ["width", "height", "rank"], Ya = { width: 0, height: 0 }, WO = ["minlen", "weight", "width", "height", "labeloffset"], XO = {
  minlen: 1,
  weight: 1,
  width: 0,
  height: 0,
  labeloffset: 10,
  labelpos: "r"
}, YO = ["labelpos"];
function JO(i) {
  let t = new _O({ multigraph: !0, compound: !0 }), e = er(i.graph());
  return t.setGraph(Object.assign(
    {},
    HO,
    tr(e, GO),
    ae.pick(e, qO)
  )), i.nodes().forEach((n) => {
    let s = er(i.node(n));
    const r = tr(s, UO);
    Object.keys(Ya).forEach((o) => {
      r[o] === void 0 && (r[o] = Ya[o]);
    }), t.setNode(n, r), t.setParent(n, i.parent(n));
  }), i.edges().forEach((n) => {
    let s = er(i.edge(n));
    t.setEdge(n, Object.assign(
      {},
      XO,
      tr(s, WO),
      ae.pick(s, YO)
    ));
  }), t;
}
function KO(i) {
  let t = i.graph();
  t.ranksep /= 2, i.edges().forEach((e) => {
    let n = i.edge(e);
    n.minlen *= 2, n.labelpos.toLowerCase() !== "c" && (t.rankdir === "TB" || t.rankdir === "BT" ? n.width += n.labeloffset : n.height += n.labeloffset);
  });
}
function ZO(i) {
  i.edges().forEach((t) => {
    let e = i.edge(t);
    if (e.width && e.height) {
      let n = i.node(t.v), r = { rank: (i.node(t.w).rank - n.rank) / 2 + n.rank, e: t };
      ae.addDummyNode(i, "edge-proxy", r, "_ep");
    }
  });
}
function QO(i) {
  let t = 0;
  i.nodes().forEach((e) => {
    let n = i.node(e);
    n.borderTop && (n.minRank = i.node(n.borderTop).rank, n.maxRank = i.node(n.borderBottom).rank, t = Math.max(t, n.maxRank));
  }), i.graph().maxRank = t;
}
function tP(i) {
  i.nodes().forEach((t) => {
    let e = i.node(t);
    e.dummy === "edge-proxy" && (i.edge(e.e).labelRank = e.rank, i.removeNode(t));
  });
}
function eP(i) {
  let t = Number.POSITIVE_INFINITY, e = 0, n = Number.POSITIVE_INFINITY, s = 0, r = i.graph(), o = r.marginx || 0, a = r.marginy || 0;
  function l(c) {
    let h = c.x, u = c.y, d = c.width, f = c.height;
    t = Math.min(t, h - d / 2), e = Math.max(e, h + d / 2), n = Math.min(n, u - f / 2), s = Math.max(s, u + f / 2);
  }
  i.nodes().forEach((c) => l(i.node(c))), i.edges().forEach((c) => {
    let h = i.edge(c);
    Object.hasOwn(h, "x") && l(h);
  }), t -= o, n -= a, i.nodes().forEach((c) => {
    let h = i.node(c);
    h.x -= t, h.y -= n;
  }), i.edges().forEach((c) => {
    let h = i.edge(c);
    h.points.forEach((u) => {
      u.x -= t, u.y -= n;
    }), Object.hasOwn(h, "x") && (h.x -= t), Object.hasOwn(h, "y") && (h.y -= n);
  }), r.width = e - t + o, r.height = s - n + a;
}
function nP(i) {
  i.edges().forEach((t) => {
    let e = i.edge(t), n = i.node(t.v), s = i.node(t.w), r, o;
    e.points ? (r = e.points[0], o = e.points[e.points.length - 1]) : (e.points = [], r = s, o = n), e.points.unshift(ae.intersectRect(n, r)), e.points.push(ae.intersectRect(s, o));
  });
}
function iP(i) {
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
function sP(i) {
  i.edges().forEach((t) => {
    let e = i.edge(t);
    e.reversed && e.points.reverse();
  });
}
function rP(i) {
  i.nodes().forEach((t) => {
    if (i.children(t).length) {
      let e = i.node(t), n = i.node(e.borderTop), s = i.node(e.borderBottom), r = i.node(e.borderLeft[e.borderLeft.length - 1]), o = i.node(e.borderRight[e.borderRight.length - 1]);
      e.width = Math.abs(o.x - r.x), e.height = Math.abs(s.y - n.y), e.x = r.x + e.width / 2, e.y = n.y + e.height / 2;
    }
  }), i.nodes().forEach((t) => {
    i.node(t).dummy === "border" && i.removeNode(t);
  });
}
function oP(i) {
  i.edges().forEach((t) => {
    if (t.v === t.w) {
      var e = i.node(t.v);
      e.selfEdges || (e.selfEdges = []), e.selfEdges.push({ e: t, label: i.edge(t) }), i.removeEdge(t);
    }
  });
}
function aP(i) {
  var t = ae.buildLayerMatrix(i);
  t.forEach((e) => {
    var n = 0;
    e.forEach((s, r) => {
      var o = i.node(s);
      o.order = r + n, (o.selfEdges || []).forEach((a) => {
        ae.addDummyNode(i, "selfedge", {
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
function lP(i) {
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
function tr(i, t) {
  return ae.mapValues(ae.pick(i, t), Number);
}
function er(i) {
  var t = {};
  return i && Object.entries(i).forEach(([e, n]) => {
    typeof e == "string" && (e = e.toLowerCase()), t[e] = n;
  }), t;
}
let cP = It, hP = be.Graph;
var uP = {
  debugOrdering: dP
};
function dP(i) {
  let t = cP.buildLayerMatrix(i), e = new hP({ compound: !0, multigraph: !0 }).setGraph({});
  return i.nodes().forEach((n) => {
    e.setNode(n, { label: n }), e.setParent(n, "layer" + i.node(n).rank);
  }), i.edges().forEach((n) => e.setEdge(n.v, n.w, {}, n.name)), t.forEach((n, s) => {
    let r = "layer" + s;
    e.setNode(r, { rank: "same" }), n.reduce((o, a) => (e.setEdge(o, a, { style: "invis" }), a));
  }), e;
}
var fP = "1.1.8", gP = {
  graphlib: be,
  layout: BO,
  debug: uP,
  util: {
    time: It.time,
    notime: It.notime
  },
  version: fP
};
const Ja = /* @__PURE__ */ Hh(gP);
function SP(i) {
  var go, po;
  const t = Tu.t, e = Nu(i.config, {
    grid: !0,
    panning: !0,
    mousewheel: !1,
    snap: !0
  }), n = bo(null), s = bo(null), r = $s(null), o = Ii(() => e.value.id), a = Ii(() => !e.value.readonly && e.value.disabled !== !0), l = Ii(() => e.value.height), c = Ii(() => e.value.content), { value: h, error: u } = Lu(() => c.value, () => i.context ?? {});
  let d = !1, f = null, g = null, p = null, m = null, b = null, v = null;
  const y = $s(!1), x = $s(!1), E = { rx: 6, ry: 6, strokeWidth: 1.5 }, S = { fontSize: 13, fontFamily: "system-ui, sans-serif" }, C = ["addRect", "addEllipse", "addEdge", "delete", "fit", "layout", "undo", "redo"], O = e.value.toolbar === !1 ? [] : e.value.toolbar ?? C, P = ((go = e.value.stencil) == null ? void 0 : go.nodes) ?? [];
  function I(M) {
    const L = {
      id: M.id,
      x: M.position().x,
      y: M.position().y,
      width: M.size().width,
      height: M.size().height
    }, _ = M.shape;
    return _ === "image" ? (L.shape = "image", L.imageUrl = M.attr("image/xlink:href") ?? void 0) : (L.shape = _ === "ellipse" ? "ellipse" : "rect", L.label = M.attr("label/text") ?? void 0, L.fill = M.attr("body/fill") ?? void 0, L.stroke = M.attr("body/stroke") ?? void 0, L.color = M.attr("label/fill") ?? void 0), L;
  }
  function T() {
    const M = r.value;
    if (!M) return "";
    const L = {
      nodes: M.getNodes().map(I),
      edges: M.getEdges().map((_) => {
        const Z = _.getSourceCell(), Ct = _.getTargetCell();
        return {
          id: _.id,
          source: Z instanceof mt ? Z.id : _.getSourceCellId() ?? "",
          target: Ct instanceof mt ? Ct.id : _.getTargetCellId() ?? "",
          label: _.attr("label/text") ?? void 0,
          color: _.attr("line/stroke") ?? void 0
        };
      })
    };
    return JSON.stringify(L);
  }
  function j() {
    var M;
    !a.value || !((M = e.value.save) != null && M.command) || (g && clearTimeout(g), g = setTimeout(() => {
      H();
    }, 600));
  }
  async function H() {
    var L;
    if (!((L = e.value.save) != null && L.command)) return;
    const M = { ...e.value.save.params ?? {}, content: T() };
    try {
      await ji.executeCommand(e.value.save.command, ku(M, i.context ?? {})), Kn.push({ message: t("core.editor.saved"), kind: "success" });
    } catch {
    }
  }
  function F(M) {
    const L = M.width ?? 140, _ = M.height ?? 48;
    return M.shape === "image" ? {
      id: M.id,
      shape: "image",
      x: M.x ?? 0,
      y: M.y ?? 0,
      width: L,
      height: _,
      attrs: { image: { "xlink:href": M.imageUrl ?? "", width: L, height: _, magnet: !0 } }
    } : {
      id: M.id,
      shape: M.shape === "ellipse" ? "ellipse" : "rect",
      x: M.x ?? 0,
      y: M.y ?? 0,
      width: L,
      height: _,
      attrs: {
        body: { ...E, fill: M.fill ?? (M.shape === "ellipse" ? "#eef4ff" : "#f6f8fb"), stroke: M.stroke ?? "#94a3b8", magnet: !0 },
        label: { ...S, text: M.label ?? "", fill: M.color ?? "#1e293b" }
      }
    };
  }
  function A(M) {
    const L = M.line && M.line !== "rounded" ? { name: M.line } : void 0, _ = M.line === "manhattan" || M.line === "metro" ? { name: "rounded" } : { name: M.line ?? "rounded" };
    return {
      id: M.id,
      source: M.source,
      target: M.target,
      router: L,
      connector: _,
      attrs: {
        line: { stroke: M.color ?? "#64748b", strokeWidth: 2 },
        label: { text: M.label ?? "", fontSize: 12 }
      }
    };
  }
  function N(M) {
    var _;
    const L = r.value;
    if (L) {
      L.clearCells();
      for (const Z of M.nodes ?? []) L.addNode(F(Z));
      for (const Z of M.edges ?? []) L.addEdge(A(Z));
      (_ = M.nodes) != null && _.length && L.zoomToFit({ padding: 24, maxScale: 1.5 });
    }
  }
  function V(M) {
    if (!r.value || !a.value) return;
    const L = { x: 60 + Math.round(Math.random() * 180), y: 60 + Math.round(Math.random() * 120), width: 140, height: 48 }, _ = { id: `${M}_${Date.now()}`, shape: M, ...L, label: M === "ellipse" ? "Ellipse" : "Rectangle" };
    r.value.addNode(F(_)), j();
  }
  function st() {
    !r.value || !a.value || (d = !0, f = null, Kn.push({ message: t("core.editor.diagram.pickSource"), kind: "info" }));
  }
  function Q() {
    !r.value || !a.value || (r.value.getSelectedCells().forEach((M) => M.remove()), j());
  }
  function ut(M) {
    if (r.value && M instanceof mt) {
      const L = M.position();
      r.value.addNode(F({ ...I(M), id: `${M.shape}_${Date.now()}`, x: L.x + 24, y: L.y + 24 }));
    }
  }
  function $(M) {
    var Z;
    if (M.editor !== "diagram" || M.componentId && M.componentId !== o.value || !r.value || !a.value) return;
    const L = (Z = M.params) == null ? void 0 : Z.id, _ = L ? r.value.getCellById(L) : null;
    if (_)
      switch (M.command) {
        case "delete":
          _.remove(), j();
          break;
        case "duplicate":
          ut(_), j();
          break;
        case "front":
          _.toFront(), j();
          break;
        case "back":
          _.toBack(), j();
          break;
      }
  }
  function K() {
    var M;
    (M = r.value) == null || M.zoomToFit({ padding: 24, maxScale: 2 });
  }
  function tt() {
    var Wt, Zt;
    const M = r.value;
    if (!M) return;
    const L = M.getNodes();
    if (L.length === 0) return;
    const _ = [...L].sort((rt, ot) => {
      const zt = rt.position(), Jt = ot.position();
      return zt.y - Jt.y || zt.x - Jt.x;
    }), Z = Math.max(1, Math.ceil(Math.sqrt(L.length))), Ct = ((Wt = e.value.layout) == null ? void 0 : Wt.gapX) ?? 40, Y = ((Zt = e.value.layout) == null ? void 0 : Zt.gapY) ?? 40, ht = Math.max(..._.map((rt) => rt.size().width)) + Ct, St = Math.max(..._.map((rt) => rt.size().height)) + Y;
    _.forEach((rt, ot) => {
      const zt = ot % Z, Jt = Math.floor(ot / Z);
      rt.position(zt * ht, Jt * St);
    });
  }
  function W() {
    var Z, Ct;
    const M = r.value;
    if (!M) return;
    const L = M.getNodes();
    if (L.length === 0) return;
    const _ = new Ja.graphlib.Graph();
    _.setDefaultEdgeLabel(() => ({})), _.setGraph({ rankdir: "LR", nodesep: ((Z = e.value.layout) == null ? void 0 : Z.gapX) ?? 40, ranksep: ((Ct = e.value.layout) == null ? void 0 : Ct.gapY) ?? 40 }), L.forEach((Y) => _.setNode(Y.id, { width: Y.size().width, height: Y.size().height })), M.getEdges().forEach((Y) => {
      const ht = Y.getSourceCellId(), St = Y.getTargetCellId();
      ht && St && _.setEdge(ht, St);
    }), Ja.layout(_), L.forEach((Y) => {
      const ht = _.node(Y.id);
      ht && Y.position(ht.x - Y.size().width / 2, ht.y - Y.size().height / 2);
    });
  }
  function nt() {
    var rt;
    const M = r.value;
    if (!M) return;
    const L = M.getNodes();
    if (L.length === 0) return;
    const _ = L.length, Z = ((rt = e.value.layout) == null ? void 0 : rt.gapX) ?? 60, Ct = Math.max(...L.map((ot) => ot.size().width)), Y = Math.max(...L.map((ot) => ot.size().height)), ht = _ <= 1 ? 0 : Math.max((Ct + Y) / 2 + Z, _ * (Ct + Z) / (2 * Math.PI)), St = Ct / 2, Wt = Y / 2;
    [...L].sort((ot, zt) => ot.id.localeCompare(zt.id)).forEach((ot, zt) => {
      const Jt = 2 * Math.PI * zt / _ - Math.PI / 2;
      ot.position(St + ht * Math.cos(Jt) - ot.size().width / 2, Wt + ht * Math.sin(Jt) - ot.size().height / 2);
    });
  }
  function xt() {
    var L;
    if (!r.value || !a.value) return;
    const M = ((L = e.value.layout) == null ? void 0 : L.type) ?? "grid";
    M === "dagre" ? W() : M === "circle" ? nt() : tt(), j();
  }
  function X() {
    var M, L;
    y.value = ((M = r.value) == null ? void 0 : M.canUndo()) ?? !1, x.value = ((L = r.value) == null ? void 0 : L.canRedo()) ?? !1;
  }
  function Et(M, L, _) {
    var Y, ht, St, Wt, Zt, rt;
    if (!((Y = _s.collaboration) != null && Y.cursorsEnabled)) return;
    const Z = ((ht = e.value.content) == null ? void 0 : ht.entityType) ?? "", Ct = ((Wt = (St = i.context) == null ? void 0 : St.row) == null ? void 0 : Wt.id) ?? "";
    !Z || !Ct || ji.sendRaw("cursor.update", {
      entityType: Z,
      objectId: Ct,
      position: { nodeId: M, x: L, y: _ },
      selection: { nodeId: M },
      name: ((Zt = ji.localParticipant) == null ? void 0 : Zt.name) ?? "Anonymous",
      color: ((rt = ji.localParticipant) == null ? void 0 : rt.color) ?? "#999"
    });
  }
  function le(M, L, _) {
    p && clearTimeout(p), p = setTimeout(() => Et(M, L, _), 100);
  }
  function Bt() {
    var St, Wt, Zt;
    const M = s.current, L = r.value;
    if (!M || !L) return;
    const _ = ((St = e.value.content) == null ? void 0 : St.entityType) ?? "", Z = ((Zt = (Wt = i.context) == null ? void 0 : Wt.row) == null ? void 0 : Zt.id) ?? "", Ct = yo.getCursorsForObject(_, Z), Y = /* @__PURE__ */ new Map();
    for (const rt of Array.from(M.children)) {
      const ot = rt, zt = ot.dataset.cursorSession;
      zt && Y.set(zt, ot);
    }
    const ht = /* @__PURE__ */ new Set();
    for (const rt of Ct) {
      ht.add(rt.sessionId);
      const ot = rt.position;
      if (!ot) continue;
      let zt, Jt;
      if (ot.nodeId) {
        const ce = L.getCellById(ot.nodeId);
        if (!(ce instanceof mt)) continue;
        const Kt = ce.position(), Yn = L.zoom(), Jn = L.translate();
        zt = (Kt.x + (ot.x ?? 0)) * Yn + Jn.x, Jt = (Kt.y + (ot.y ?? 0)) * Yn + Jn.y;
      } else {
        const ce = L.zoom(), Kt = L.translate();
        zt = (ot.x ?? 0) * ce + Kt.x, Jt = (ot.y ?? 0) * ce + Kt.y;
      }
      let Qt = Y.get(rt.sessionId);
      if (!Qt) {
        Qt = document.createElement("div"), Qt.className = "diagram-remote-cursor", Qt.dataset.cursorSession = rt.sessionId;
        const ce = document.createElement("div");
        ce.className = "diagram-remote-cursor__dot", ce.style.background = rt.color;
        const Kt = document.createElement("span");
        Kt.className = "diagram-remote-cursor__label", Kt.style.background = rt.color, Kt.textContent = rt.name, Qt.appendChild(ce), Qt.appendChild(Kt), M.appendChild(Qt);
      }
      Qt.style.left = `${zt}px`, Qt.style.top = `${Jt}px`, Qt.style.display = "";
    }
    for (const [rt, ot] of Y)
      ht.has(rt) || (ot.style.display = "none");
  }
  function Ni() {
    var M;
    (M = r.value) == null || M.undo(), X();
  }
  function Li() {
    var M;
    (M = r.value) == null || M.redo(), X();
  }
  function wu() {
    !r.value || !a.value || r.value.copy(r.value.getSelectedCells());
  }
  function xu() {
    !r.value || !a.value || (r.value.paste({ offset: 32 }), j());
  }
  function Eu() {
    !r.value || !a.value || (r.value.cut(r.value.getSelectedCells()), j());
  }
  function Cu(M) {
    var _;
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
    return (_ = r.value) == null ? void 0 : _.createNode(F(L));
  }
  function Su(M, L) {
    !a.value || !r.value || !v || v.start(Cu(M), L);
  }
  function Ou() {
    const M = n.current;
    if (!M) return;
    const L = new k({
      container: M,
      grid: e.value.grid ? { size: 10, visible: !0 } : !1,
      panning: e.value.panning ? { enabled: !0, eventTypes: ["leftMouseDown", "mouseWheel"] } : !1,
      mousewheel: e.value.mousewheel ? { enabled: !0, modifiers: ["ctrl", "meta"], minScale: 0.2, maxScale: 3 } : !1,
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
    L.use(new Dn({ enabled: a.value, multiple: !0, rubberband: !0 })), L.use(new Fh({ enabled: !0 })), e.value.history !== !1 && (L.use(new $n({ enabled: !0 })), L.on("history:change", X), X());
    const Z = new Uh();
    L.use(Z), Z.bindKey(["meta+z", "ctrl+z"], () => (Ni(), !1)), Z.bindKey(["meta+shift+z", "ctrl+shift+z", "meta+y", "ctrl+y"], () => (Li(), !1)), Z.bindKey(["backspace", "delete"], () => (Q(), !1)), Z.bindKey(["meta+c", "ctrl+c"], () => (wu(), !1)), Z.bindKey(["meta+v", "ctrl+v"], () => (xu(), !1)), Z.bindKey(["meta+x", "ctrl+x"], () => (Eu(), !1));
    const Ct = new Wh();
    if (L.use(Ct), v = new on({ target: L, scaled: !0 }), L.on("cell:click", () => {
      if (!d || !f) return;
      const Y = L.getSelectedCells().find((ht) => ht instanceof mt);
      Y && Y.id !== f.id && (L.addEdge(A({ source: f.id, target: Y.id, line: "rounded" })), d = !1, f = null, j(), Kn.push({ message: t("core.editor.diagram.edgeAdded"), kind: "success" }));
    }), L.on("blank:click", () => {
      d = !1, f = null;
    }), L.on("node:mousedown", (Y) => {
      d && (f = Y.node, Kn.push({ message: t("core.editor.diagram.pickTarget"), kind: "info" }));
    }), L.on("node:contextmenu", ({ node: Y, e: ht }) => {
      const St = ht;
      ju.onGesture({
        event: "contextmenu",
        componentType: "Diagram",
        objectType: "diagram.node",
        componentId: o.value,
        row: { id: Y.id, label: Y.attr("label/text") ?? Y.id },
        x: St.clientX,
        y: St.clientY
      }) && (ht.preventDefault(), ht.stopPropagation());
    }), L.on("cell:added", () => j()), L.on("cell:removed", () => j()), L.on("cell:change:position", () => j()), L.on("cell:change:size", () => j()), L.on("cell:change:attrs", () => j()), L.on("edge:connected", () => j()), L.on("node:mousemove", ({ node: Y, e: ht }) => {
      var Kt, Yn, Jn;
      if (!((Kt = _s.collaboration) != null && Kt.cursorsEnabled)) return;
      const St = ht, Wt = Y.position(), Zt = Y.size(), rt = L.zoom(), ot = L.translate(), zt = Wt.x * rt + ot.x, Jt = Wt.y * rt + ot.y, Qt = (St.clientX - (((Yn = n.current) == null ? void 0 : Yn.getBoundingClientRect().left) ?? 0) - zt) / rt, ce = (St.clientY - (((Jn = n.current) == null ? void 0 : Jn.getBoundingClientRect().top) ?? 0) - Jt) / rt;
      le(Y.id, Math.max(0, Math.min(Qt, Zt.width)), Math.max(0, Math.min(ce, Zt.height)));
    }), b = yo.subscribe(Bt), r.value = L, h.value != null)
      try {
        N(JSON.parse(String(h.value)));
      } catch {
      }
  }
  Mu(() => {
    const M = requestAnimationFrame(Ou);
    return u.value && Kn.push({ message: u.value, kind: "error" }), m = Iu((L) => {
      L.kind === "editor.command" && $(L.payload);
    }), () => {
      var L;
      cancelAnimationFrame(M), g && clearTimeout(g), p && clearTimeout(p), m == null || m(), b == null || b(), (L = r.value) == null || L.dispose(), r.value = null;
    };
  }, []);
  const Xn = {
    addRect: { label: t("core.editor.diagram.addRect"), icon: "▭", action: () => V("rect") },
    addEllipse: { label: t("core.editor.diagram.addEllipse"), icon: "◯", action: () => V("ellipse") },
    addEdge: { label: t("core.editor.diagram.addEdge"), icon: "↔", action: () => st(), active: () => d },
    delete: { label: t("core.editor.diagram.delete"), icon: "✕", action: () => Q() },
    fit: { label: t("core.editor.diagram.fit"), icon: "⛶", action: () => K() },
    layout: { label: t("core.editor.diagram.layout"), icon: "▦", action: () => xt() },
    undo: { label: t("core.editor.undo"), icon: "↩", action: () => Ni(), disabled: () => !y.value },
    redo: { label: t("core.editor.redo"), icon: "↪", action: () => Li(), disabled: () => !x.value }
  };
  return /* @__PURE__ */ mo("div", { class: "ui-diagram", style: l.value ? { height: l.value } : void 0, "data-gesture-type": "Diagram", children: [
    O.length ? /* @__PURE__ */ dn("div", { class: "ui-diagram__toolbar", children: O.map((M) => {
      var L, _, Z, Ct, Y, ht;
      return /* @__PURE__ */ dn(
        "button",
        {
          class: `ui-diagram__btn${(_ = (L = Xn[M]) == null ? void 0 : L.active) != null && _.call(L) ? " ui-diagram__btn--active" : ""}${!a.value && M !== "fit" || (Ct = (Z = Xn[M]) == null ? void 0 : Z.disabled) != null && Ct.call(Z) ? " ui-diagram__btn--disabled" : ""}`,
          title: (Y = Xn[M]) == null ? void 0 : Y.label,
          onClick: () => {
            var St;
            return (St = Xn[M]) == null ? void 0 : St.action();
          },
          children: (ht = Xn[M]) == null ? void 0 : ht.icon
        },
        M
      );
    }) }) : null,
    /* @__PURE__ */ mo("div", { class: "ui-diagram__body", children: [
      P.length ? /* @__PURE__ */ dn("aside", { class: "ui-diagram__stencil", "aria-label": "Stencil", children: P.map((M, L) => /* @__PURE__ */ dn(
        "div",
        {
          class: `ui-diagram__stencil-item${a.value ? "" : " ui-diagram__stencil-item--disabled"}`,
          onMouseDown: (_) => Su(M, _),
          children: M.label ?? "Node"
        },
        L
      )) }) : null,
      /* @__PURE__ */ dn("div", { class: `ui-diagram__canvas${a.value ? "" : " ui-diagram__canvas--readonly"}`, ref: n, children: (po = _s.collaboration) != null && po.cursorsEnabled ? /* @__PURE__ */ dn("div", { ref: s, class: "ui-diagram__cursor-overlay" }) : null })
    ] })
  ] });
}
export {
  SP as default
};
