var kh = Object.defineProperty;
var Sh = (n, e, t) => e in n ? kh(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var lt = (n, e, t) => Sh(n, typeof e != "symbol" ? e + "" : e, t);
import { shallowRef as xh, onMounted as Zr, onBeforeUnmount as ei, defineComponent as tr, h as ti, ref as Be, getCurrentInstance as Ch, watchEffect as Th, nextTick as Eh, unref as ji, markRaw as Mh, customRef as Oh, reactive as nr, computed as Mt, watch as br, openBlock as wi, createElementBlock as ki, normalizeStyle as Ah, Fragment as Nh, renderList as Dh, normalizeClass as Sa, toDisplayString as Rh, createCommentVNode as Ih, createElementVNode as Lh, createVNode as Ph } from "vue";
function ke(n) {
  this.content = n;
}
ke.prototype = {
  constructor: ke,
  find: function(n) {
    for (var e = 0; e < this.content.length; e += 2)
      if (this.content[e] === n) return e;
    return -1;
  },
  // :: (string) → ?any
  // Retrieve the value stored under `key`, or return undefined when
  // no such key exists.
  get: function(n) {
    var e = this.find(n);
    return e == -1 ? void 0 : this.content[e + 1];
  },
  // :: (string, any, ?string) → OrderedMap
  // Create a new map by replacing the value of `key` with a new
  // value, or adding a binding to the end of the map. If `newKey` is
  // given, the key of the binding will be replaced with that key.
  update: function(n, e, t) {
    var r = t && t != n ? this.remove(t) : this, i = r.find(n), o = r.content.slice();
    return i == -1 ? o.push(t || n, e) : (o[i + 1] = e, t && (o[i] = t)), new ke(o);
  },
  // :: (string) → OrderedMap
  // Return a map with the given key removed, if it existed.
  remove: function(n) {
    var e = this.find(n);
    if (e == -1) return this;
    var t = this.content.slice();
    return t.splice(e, 2), new ke(t);
  },
  // :: (string, any) → OrderedMap
  // Add a new key to the start of the map.
  addToStart: function(n, e) {
    return new ke([n, e].concat(this.remove(n).content));
  },
  // :: (string, any) → OrderedMap
  // Add a new key to the end of the map.
  addToEnd: function(n, e) {
    var t = this.remove(n).content.slice();
    return t.push(n, e), new ke(t);
  },
  // :: (string, string, any) → OrderedMap
  // Add a key after the given key. If `place` is not found, the new
  // key is added to the end.
  addBefore: function(n, e, t) {
    var r = this.remove(e), i = r.content.slice(), o = r.find(n);
    return i.splice(o == -1 ? i.length : o, 0, e, t), new ke(i);
  },
  // :: ((key: string, value: any))
  // Call the given function for each key/value pair in the map, in
  // order.
  forEach: function(n) {
    for (var e = 0; e < this.content.length; e += 2)
      n(this.content[e], this.content[e + 1]);
  },
  // :: (union<Object, OrderedMap>) → OrderedMap
  // Create a new map by prepending the keys in this map that don't
  // appear in `map` before the keys in `map`.
  prepend: function(n) {
    return n = ke.from(n), n.size ? new ke(n.content.concat(this.subtract(n).content)) : this;
  },
  // :: (union<Object, OrderedMap>) → OrderedMap
  // Create a new map by appending the keys in this map that don't
  // appear in `map` after the keys in `map`.
  append: function(n) {
    return n = ke.from(n), n.size ? new ke(this.subtract(n).content.concat(n.content)) : this;
  },
  // :: (union<Object, OrderedMap>) → OrderedMap
  // Create a map containing all the keys in this map that don't
  // appear in `map`.
  subtract: function(n) {
    var e = this;
    n = ke.from(n);
    for (var t = 0; t < n.content.length; t += 2)
      e = e.remove(n.content[t]);
    return e;
  },
  // :: () → Object
  // Turn ordered map into a plain object.
  toObject: function() {
    var n = {};
    return this.forEach(function(e, t) {
      n[e] = t;
    }), n;
  },
  // :: number
  // The amount of keys in this map.
  get size() {
    return this.content.length >> 1;
  }
};
ke.from = function(n) {
  if (n instanceof ke) return n;
  var e = [];
  if (n) for (var t in n) e.push(t, n[t]);
  return new ke(e);
};
function xu(n, e, t) {
  for (let r = 0; ; r++) {
    if (r == n.childCount || r == e.childCount)
      return n.childCount == e.childCount ? null : t;
    let i = n.child(r), o = e.child(r);
    if (i == o) {
      t += i.nodeSize;
      continue;
    }
    if (!i.sameMarkup(o))
      return t;
    if (i.isText && i.text != o.text) {
      let s = i.text, l = o.text, a = 0;
      for (; s[a] == l[a]; a++)
        t++;
      return a && a < s.length && a < l.length && Eu(s.charCodeAt(a - 1)) && Tu(s.charCodeAt(a)) && t--, t;
    }
    if (i.content.size || o.content.size) {
      let s = xu(i.content, o.content, t + 1);
      if (s != null)
        return s;
    }
    t += i.nodeSize;
  }
}
function Cu(n, e, t, r) {
  for (let i = n.childCount, o = e.childCount; ; ) {
    if (i == 0 || o == 0)
      return i == o ? null : { a: t, b: r };
    let s = n.child(--i), l = e.child(--o), a = s.nodeSize;
    if (s == l) {
      t -= a, r -= a;
      continue;
    }
    if (!s.sameMarkup(l))
      return { a: t, b: r };
    if (s.isText && s.text != l.text) {
      let c = s.text, u = l.text, d = c.length, f = u.length;
      for (; d > 0 && f > 0 && c[d - 1] == u[f - 1]; )
        d--, f--, t--, r--;
      return d && f && d < c.length && Eu(c.charCodeAt(d - 1)) && Tu(c.charCodeAt(d)) && (t++, r++), { a: t, b: r };
    }
    if (s.content.size || l.content.size) {
      let c = Cu(s.content, l.content, t - 1, r - 1);
      if (c)
        return c;
    }
    t -= a, r -= a;
  }
}
function Tu(n) {
  return n >= 56320 && n < 57344;
}
function Eu(n) {
  return n >= 55296 && n < 56320;
}
class C {
  /**
  @internal
  */
  constructor(e, t) {
    if (this.content = e, this.size = t || 0, t == null)
      for (let r = 0; r < e.length; r++)
        this.size += e[r].nodeSize;
  }
  /**
  Invoke a callback for all descendant nodes between the given two
  positions (relative to start of this fragment). Doesn't descend
  into a node when the callback returns `false`.
  */
  nodesBetween(e, t, r, i = 0, o) {
    for (let s = 0, l = 0; l < t; s++) {
      let a = this.content[s], c = l + a.nodeSize;
      if (c > e && r(a, i + l, o || null, s) !== !1 && a.content.size) {
        let u = l + 1;
        a.nodesBetween(Math.max(0, e - u), Math.min(a.content.size, t - u), r, i + u);
      }
      l = c;
    }
  }
  /**
  Call the given callback for every descendant node. `pos` will be
  relative to the start of the fragment. The callback may return
  `false` to prevent traversal of a given node's children.
  */
  descendants(e) {
    this.nodesBetween(0, this.size, e);
  }
  /**
  Extract the text between `from` and `to`. See the same method on
  [`Node`](https://prosemirror.net/docs/ref/#model.Node.textBetween).
  */
  textBetween(e, t, r, i) {
    let o = "", s = !0;
    return this.nodesBetween(e, t, (l, a) => {
      let c = l.isText ? l.text.slice(Math.max(e, a) - a, t - a) : l.isLeaf ? i ? typeof i == "function" ? i(l) : i : l.type.spec.leafText ? l.type.spec.leafText(l) : "" : "";
      l.isBlock && (l.isLeaf && c || l.isTextblock) && r && (s ? s = !1 : o += r), o += c;
    }, 0), o;
  }
  /**
  Create a new fragment containing the combined content of this
  fragment and the other.
  */
  append(e) {
    if (!e.size)
      return this;
    if (!this.size)
      return e;
    let t = this.lastChild, r = e.firstChild, i = this.content.slice(), o = 0;
    for (t.isText && t.sameMarkup(r) && (i[i.length - 1] = t.withText(t.text + r.text), o = 1); o < e.content.length; o++)
      i.push(e.content[o]);
    return new C(i, this.size + e.size);
  }
  /**
  Cut out the sub-fragment between the two given positions.
  */
  cut(e, t = this.size) {
    if (e == 0 && t == this.size)
      return this;
    let r = [], i = 0;
    if (t > e)
      for (let o = 0, s = 0; s < t; o++) {
        let l = this.content[o], a = s + l.nodeSize;
        a > e && ((s < e || a > t) && (l.isText ? l = l.cut(Math.max(0, e - s), Math.min(l.text.length, t - s)) : l = l.cut(Math.max(0, e - s - 1), Math.min(l.content.size, t - s - 1))), r.push(l), i += l.nodeSize), s = a;
      }
    return new C(r, i);
  }
  /**
  @internal
  */
  cutByIndex(e, t) {
    return e == t ? C.empty : e == 0 && t == this.content.length ? this : new C(this.content.slice(e, t));
  }
  /**
  Create a new fragment in which the node at the given index is
  replaced by the given node.
  */
  replaceChild(e, t) {
    let r = this.content[e];
    if (r == t)
      return this;
    let i = this.content.slice(), o = this.size + t.nodeSize - r.nodeSize;
    return i[e] = t, new C(i, o);
  }
  /**
  Create a new fragment by prepending the given node to this
  fragment.
  */
  addToStart(e) {
    return new C([e].concat(this.content), this.size + e.nodeSize);
  }
  /**
  Create a new fragment by appending the given node to this
  fragment.
  */
  addToEnd(e) {
    return new C(this.content.concat(e), this.size + e.nodeSize);
  }
  /**
  Compare this fragment to another one.
  */
  eq(e) {
    if (this.content.length != e.content.length)
      return !1;
    for (let t = 0; t < this.content.length; t++)
      if (!this.content[t].eq(e.content[t]))
        return !1;
    return !0;
  }
  /**
  The first child of the fragment, or `null` if it is empty.
  */
  get firstChild() {
    return this.content.length ? this.content[0] : null;
  }
  /**
  The last child of the fragment, or `null` if it is empty.
  */
  get lastChild() {
    return this.content.length ? this.content[this.content.length - 1] : null;
  }
  /**
  The number of child nodes in this fragment.
  */
  get childCount() {
    return this.content.length;
  }
  /**
  Get the child node at the given index. Raise an error when the
  index is out of range.
  */
  child(e) {
    let t = this.content[e];
    if (!t)
      throw new RangeError("Index " + e + " out of range for " + this);
    return t;
  }
  /**
  Get the child node at the given index, if it exists.
  */
  maybeChild(e) {
    return this.content[e] || null;
  }
  /**
  Call `f` for every child node, passing the node, its offset
  into this parent node, and its index.
  */
  forEach(e) {
    for (let t = 0, r = 0; t < this.content.length; t++) {
      let i = this.content[t];
      e(i, r, t), r += i.nodeSize;
    }
  }
  /**
  Find the first position at which this fragment and another
  fragment differ, or `null` if they are the same.
  */
  findDiffStart(e, t = 0) {
    return xu(this, e, t);
  }
  /**
  Find the first position, searching from the end, at which this
  fragment and the given fragment differ, or `null` if they are
  the same. Since this position will not be the same in both
  nodes, an object with two separate positions is returned.
  */
  findDiffEnd(e, t = this.size, r = e.size) {
    return Cu(this, e, t, r);
  }
  /**
  Find the index and inner offset corresponding to a given relative
  position in this fragment. The result object will be reused
  (overwritten) the next time the function is called. @internal
  */
  findIndex(e) {
    if (e == 0)
      return Si(0, e);
    if (e == this.size)
      return Si(this.content.length, e);
    if (e > this.size || e < 0)
      throw new RangeError(`Position ${e} outside of fragment (${this})`);
    for (let t = 0, r = 0; ; t++) {
      let i = this.child(t), o = r + i.nodeSize;
      if (o >= e)
        return o == e ? Si(t + 1, o) : Si(t, r);
      r = o;
    }
  }
  /**
  Return a debugging string that describes this fragment.
  */
  toString() {
    return "<" + this.toStringInner() + ">";
  }
  /**
  @internal
  */
  toStringInner() {
    return this.content.join(", ");
  }
  /**
  Create a JSON-serializeable representation of this fragment.
  */
  toJSON() {
    return this.content.length ? this.content.map((e) => e.toJSON()) : null;
  }
  /**
  Deserialize a fragment from its JSON representation.
  */
  static fromJSON(e, t) {
    if (!t)
      return C.empty;
    if (!Array.isArray(t))
      throw new RangeError("Invalid input for Fragment.fromJSON");
    return C.fromArray(t.map(e.nodeFromJSON));
  }
  /**
  Build a fragment from an array of nodes. Ensures that adjacent
  text nodes with the same marks are joined together.
  */
  static fromArray(e) {
    if (!e.length)
      return C.empty;
    let t, r = 0;
    for (let i = 0; i < e.length; i++) {
      let o = e[i];
      r += o.nodeSize, i && o.isText && e[i - 1].sameMarkup(o) ? (t || (t = e.slice(0, i)), t[t.length - 1] = o.withText(t[t.length - 1].text + o.text)) : t && t.push(o);
    }
    return new C(t || e, r);
  }
  /**
  Create a fragment from something that can be interpreted as a
  set of nodes. For `null`, it returns the empty fragment. For a
  fragment, the fragment itself. For a node or array of nodes, a
  fragment containing those nodes.
  */
  static from(e) {
    if (!e)
      return C.empty;
    if (e instanceof C)
      return e;
    if (Array.isArray(e))
      return this.fromArray(e);
    if (e.attrs)
      return new C([e], e.nodeSize);
    throw new RangeError("Can not convert " + e + " to a Fragment" + (e.nodesBetween ? " (looks like multiple versions of prosemirror-model were loaded)" : ""));
  }
}
C.empty = new C([], 0);
const ls = { index: 0, offset: 0 };
function Si(n, e) {
  return ls.index = n, ls.offset = e, ls;
}
function Qi(n, e) {
  if (n === e)
    return !0;
  if (!(n && typeof n == "object") || !(e && typeof e == "object"))
    return !1;
  let t = Array.isArray(n);
  if (Array.isArray(e) != t)
    return !1;
  if (t) {
    if (n.length != e.length)
      return !1;
    for (let r = 0; r < n.length; r++)
      if (!Qi(n[r], e[r]))
        return !1;
  } else {
    for (let r in n)
      if (!(r in e) || !Qi(n[r], e[r]))
        return !1;
    for (let r in e)
      if (!(r in n))
        return !1;
  }
  return !0;
}
let Q = class Fs {
  /**
  @internal
  */
  constructor(e, t) {
    this.type = e, this.attrs = t;
  }
  /**
  Given a set of marks, create a new set which contains this one as
  well, in the right position. If this mark is already in the set,
  the set itself is returned. If any marks that are set to be
  [exclusive](https://prosemirror.net/docs/ref/#model.MarkSpec.excludes) with this mark are present,
  those are replaced by this one.
  */
  addToSet(e) {
    let t, r = !1;
    for (let i = 0; i < e.length; i++) {
      let o = e[i];
      if (this.eq(o))
        return e;
      if (this.type.excludes(o.type))
        t || (t = e.slice(0, i));
      else {
        if (o.type.excludes(this.type))
          return e;
        !r && o.type.rank > this.type.rank && (t || (t = e.slice(0, i)), t.push(this), r = !0), t && t.push(o);
      }
    }
    return t || (t = e.slice()), r || t.push(this), t;
  }
  /**
  Remove this mark from the given set, returning a new set. If this
  mark is not in the set, the set itself is returned.
  */
  removeFromSet(e) {
    for (let t = 0; t < e.length; t++)
      if (this.eq(e[t]))
        return e.slice(0, t).concat(e.slice(t + 1));
    return e;
  }
  /**
  Test whether this mark is in the given set of marks.
  */
  isInSet(e) {
    for (let t = 0; t < e.length; t++)
      if (this.eq(e[t]))
        return !0;
    return !1;
  }
  /**
  Test whether this mark has the same type and attributes as
  another mark.
  */
  eq(e) {
    return this == e || this.type == e.type && Qi(this.attrs, e.attrs);
  }
  /**
  Convert this mark to a JSON-serializeable representation.
  */
  toJSON() {
    let e = { type: this.type.name };
    for (let t in this.attrs) {
      e.attrs = this.attrs;
      break;
    }
    return e;
  }
  /**
  Deserialize a mark from JSON.
  */
  static fromJSON(e, t) {
    if (!t)
      throw new RangeError("Invalid input for Mark.fromJSON");
    let r = e.marks[t.type];
    if (!r)
      throw new RangeError(`There is no mark type ${t.type} in this schema`);
    let i = r.create(t.attrs);
    return r.checkAttrs(i.attrs), i;
  }
  /**
  Test whether two sets of marks are identical.
  */
  static sameSet(e, t) {
    if (e == t)
      return !0;
    if (e.length != t.length)
      return !1;
    for (let r = 0; r < e.length; r++)
      if (!e[r].eq(t[r]))
        return !1;
    return !0;
  }
  /**
  Create a properly sorted mark set from null, a single mark, or an
  unsorted array of marks.
  */
  static setFrom(e) {
    if (!e || Array.isArray(e) && e.length == 0)
      return Fs.none;
    if (e instanceof Fs)
      return [e];
    let t = e.slice();
    return t.sort((r, i) => r.type.rank - i.type.rank), t;
  }
};
Q.none = [];
class Pr extends Error {
}
class A {
  /**
  Create a slice. When specifying a non-zero open depth, you must
  make sure that there are nodes of at least that depth at the
  appropriate side of the fragment—i.e. if the fragment is an
  empty paragraph node, `openStart` and `openEnd` can't be greater
  than 1.
  
  It is not necessary for the content of open nodes to conform to
  the schema's content constraints, though it should be a valid
  start/end/middle for such a node, depending on which sides are
  open.
  */
  constructor(e, t, r) {
    this.content = e, this.openStart = t, this.openEnd = r;
  }
  /**
  The size this slice would add when inserted into a document.
  */
  get size() {
    return this.content.size - this.openStart - this.openEnd;
  }
  /**
  @internal
  */
  insertAt(e, t) {
    let r = Ou(this.content, e + this.openStart, t, this.openStart + 1, this.openEnd + 1);
    return r && new A(r, this.openStart, this.openEnd);
  }
  /**
  @internal
  */
  removeBetween(e, t) {
    return new A(Mu(this.content, e + this.openStart, t + this.openStart), this.openStart, this.openEnd);
  }
  /**
  Tests whether this slice is equal to another slice.
  */
  eq(e) {
    return this.content.eq(e.content) && this.openStart == e.openStart && this.openEnd == e.openEnd;
  }
  /**
  @internal
  */
  toString() {
    return this.content + "(" + this.openStart + "," + this.openEnd + ")";
  }
  /**
  Convert a slice to a JSON-serializable representation.
  */
  toJSON() {
    if (!this.content.size)
      return null;
    let e = { content: this.content.toJSON() };
    return this.openStart > 0 && (e.openStart = this.openStart), this.openEnd > 0 && (e.openEnd = this.openEnd), e;
  }
  /**
  Deserialize a slice from its JSON representation.
  */
  static fromJSON(e, t) {
    if (!t)
      return A.empty;
    let r = t.openStart || 0, i = t.openEnd || 0;
    if (typeof r != "number" || typeof i != "number")
      throw new RangeError("Invalid input for Slice.fromJSON");
    return new A(C.fromJSON(e, t.content), r, i);
  }
  /**
  Create a slice from a fragment by taking the maximum possible
  open value on both side of the fragment.
  */
  static maxOpen(e, t = !0) {
    let r = 0, i = 0;
    for (let o = e.firstChild; o && !o.isLeaf && (t || !o.type.spec.isolating); o = o.firstChild)
      r++;
    for (let o = e.lastChild; o && !o.isLeaf && (t || !o.type.spec.isolating); o = o.lastChild)
      i++;
    return new A(e, r, i);
  }
}
A.empty = new A(C.empty, 0, 0);
function Mu(n, e, t) {
  let { index: r, offset: i } = n.findIndex(e), o = n.maybeChild(r), { index: s, offset: l } = n.findIndex(t);
  if (i == e || o.isText) {
    if (l != t && !n.child(s).isText)
      throw new RangeError("Removing non-flat range");
    return n.cut(0, e).append(n.cut(t));
  }
  if (r != s)
    throw new RangeError("Removing non-flat range");
  return n.replaceChild(r, o.copy(Mu(o.content, e - i - 1, t - i - 1)));
}
function Ou(n, e, t, r, i, o) {
  let { index: s, offset: l } = n.findIndex(e), a = n.maybeChild(s);
  if (l == e || a.isText)
    return o && r <= 0 && i <= 0 && !o.canReplace(s, s, t) ? null : n.cut(0, e).append(t).append(n.cut(e));
  let c = Ou(a.content, e - l - 1, t, s == 0 ? r - 1 : 0, s == n.childCount - 1 ? i - 1 : 0, a);
  return c && n.replaceChild(s, a.copy(c));
}
function Bh(n, e, t) {
  if (t.openStart > n.depth)
    throw new Pr("Inserted content deeper than insertion position");
  if (n.depth - t.openStart != e.depth - t.openEnd)
    throw new Pr("Inconsistent open depths");
  return Au(n, e, t, 0);
}
function Au(n, e, t, r) {
  let i = n.index(r), o = n.node(r);
  if (i == e.index(r) && r < n.depth - t.openStart) {
    let s = Au(n, e, t, r + 1);
    return o.copy(o.content.replaceChild(i, s));
  } else if (t.content.size)
    if (!t.openStart && !t.openEnd && n.depth == r && e.depth == r) {
      let s = n.parent, l = s.content;
      return yn(s, l.cut(0, n.parentOffset).append(t.content).append(l.cut(e.parentOffset)));
    } else {
      let { start: s, end: l } = Hh(t, n);
      return yn(o, Du(n, s, l, e, r));
    }
  else return yn(o, Zi(n, e, r));
}
function Nu(n, e) {
  if (!e.type.compatibleContent(n.type))
    throw new Pr("Cannot join " + e.type.name + " onto " + n.type.name);
}
function Vs(n, e, t) {
  let r = n.node(t);
  return Nu(r, e.node(t)), r;
}
function gn(n, e) {
  let t = e.length - 1;
  t >= 0 && n.isText && n.sameMarkup(e[t]) ? e[t] = n.withText(e[t].text + n.text) : e.push(n);
}
function vr(n, e, t, r) {
  let i = (e || n).node(t), o = 0, s = e ? e.index(t) : i.childCount;
  n && (o = n.index(t), n.depth > t ? o++ : n.textOffset && (gn(n.nodeAfter, r), o++));
  for (let l = o; l < s; l++)
    gn(i.child(l), r);
  e && e.depth == t && e.textOffset && gn(e.nodeBefore, r);
}
function yn(n, e) {
  if (!n.type.validContent(e))
    throw new Pr("Invalid content for node " + n.type.name);
  return n.copy(e);
}
function Du(n, e, t, r, i) {
  let o = n.depth > i && Vs(n, e, i + 1), s = r.depth > i && Vs(t, r, i + 1), l = [];
  return vr(null, n, i, l), o && s && e.index(i) == t.index(i) ? (Nu(o, s), gn(yn(o, Du(n, e, t, r, i + 1)), l)) : (o && gn(yn(o, Zi(n, e, i + 1)), l), vr(e, t, i, l), s && gn(yn(s, Zi(t, r, i + 1)), l)), vr(r, null, i, l), new C(l);
}
function Zi(n, e, t) {
  let r = [];
  if (vr(null, n, t, r), n.depth > t) {
    let i = Vs(n, e, t + 1);
    gn(yn(i, Zi(n, e, t + 1)), r);
  }
  return vr(e, null, t, r), new C(r);
}
function Hh(n, e) {
  let t = e.depth - n.openStart, i = e.node(t).copy(n.content);
  for (let o = t - 1; o >= 0; o--)
    i = e.node(o).copy(C.from(i));
  return {
    start: i.resolveNoCache(n.openStart + t),
    end: i.resolveNoCache(i.content.size - n.openEnd - t)
  };
}
class Br {
  /**
  @internal
  */
  constructor(e, t, r) {
    this.pos = e, this.path = t, this.parentOffset = r, this.depth = t.length / 3 - 1;
  }
  /**
  @internal
  */
  resolveDepth(e) {
    return e == null ? this.depth : e < 0 ? this.depth + e : e;
  }
  /**
  The parent node that the position points into. Note that even if
  a position points into a text node, that node is not considered
  the parent—text nodes are ‘flat’ in this model, and have no content.
  */
  get parent() {
    return this.node(this.depth);
  }
  /**
  The root node in which the position was resolved.
  */
  get doc() {
    return this.node(0);
  }
  /**
  The ancestor node at the given level. `p.node(p.depth)` is the
  same as `p.parent`.
  */
  node(e) {
    return this.path[this.resolveDepth(e) * 3];
  }
  /**
  The index into the ancestor at the given level. If this points
  at the 3rd node in the 2nd paragraph on the top level, for
  example, `p.index(0)` is 1 and `p.index(1)` is 2.
  */
  index(e) {
    return this.path[this.resolveDepth(e) * 3 + 1];
  }
  /**
  The index pointing after this position into the ancestor at the
  given level.
  */
  indexAfter(e) {
    return e = this.resolveDepth(e), this.index(e) + (e == this.depth && !this.textOffset ? 0 : 1);
  }
  /**
  The (absolute) position at the start of the node at the given
  level.
  */
  start(e) {
    return e = this.resolveDepth(e), e == 0 ? 0 : this.path[e * 3 - 1] + 1;
  }
  /**
  The (absolute) position at the end of the node at the given
  level.
  */
  end(e) {
    return e = this.resolveDepth(e), this.start(e) + this.node(e).content.size;
  }
  /**
  The (absolute) position directly before the wrapping node at the
  given level, or, when `depth` is `this.depth + 1`, the original
  position.
  */
  before(e) {
    if (e = this.resolveDepth(e), !e)
      throw new RangeError("There is no position before the top-level node");
    return e == this.depth + 1 ? this.pos : this.path[e * 3 - 1];
  }
  /**
  The (absolute) position directly after the wrapping node at the
  given level, or the original position when `depth` is `this.depth + 1`.
  */
  after(e) {
    if (e = this.resolveDepth(e), !e)
      throw new RangeError("There is no position after the top-level node");
    return e == this.depth + 1 ? this.pos : this.path[e * 3 - 1] + this.path[e * 3].nodeSize;
  }
  /**
  When this position points into a text node, this returns the
  distance between the position and the start of the text node.
  Will be zero for positions that point between nodes.
  */
  get textOffset() {
    return this.pos - this.path[this.path.length - 1];
  }
  /**
  Get the node directly after the position, if any. If the position
  points into a text node, only the part of that node after the
  position is returned.
  */
  get nodeAfter() {
    let e = this.parent, t = this.index(this.depth);
    if (t == e.childCount)
      return null;
    let r = this.pos - this.path[this.path.length - 1], i = e.child(t);
    return r ? e.child(t).cut(r) : i;
  }
  /**
  Get the node directly before the position, if any. If the
  position points into a text node, only the part of that node
  before the position is returned.
  */
  get nodeBefore() {
    let e = this.index(this.depth), t = this.pos - this.path[this.path.length - 1];
    return t ? this.parent.child(e).cut(0, t) : e == 0 ? null : this.parent.child(e - 1);
  }
  /**
  Get the position at the given index in the parent node at the
  given depth (which defaults to `this.depth`).
  */
  posAtIndex(e, t) {
    t = this.resolveDepth(t);
    let r = this.path[t * 3], i = t == 0 ? 0 : this.path[t * 3 - 1] + 1;
    for (let o = 0; o < e; o++)
      i += r.child(o).nodeSize;
    return i;
  }
  /**
  Get the marks at this position, factoring in the surrounding
  marks' [`inclusive`](https://prosemirror.net/docs/ref/#model.MarkSpec.inclusive) property. If the
  position is at the start of a non-empty node, the marks of the
  node after it (if any) are returned.
  */
  marks() {
    let e = this.parent, t = this.index();
    if (e.content.size == 0)
      return Q.none;
    if (this.textOffset)
      return e.child(t).marks;
    let r = e.maybeChild(t - 1), i = e.maybeChild(t);
    if (!r) {
      let l = r;
      r = i, i = l;
    }
    let o = r.marks;
    for (var s = 0; s < o.length; s++)
      o[s].type.spec.inclusive === !1 && (!i || !o[s].isInSet(i.marks)) && (o = o[s--].removeFromSet(o));
    return o;
  }
  /**
  Get the marks after the current position, if any, except those
  that are non-inclusive and not present at position `$end`. This
  is mostly useful for getting the set of marks to preserve after a
  deletion. Will return `null` if this position is at the end of
  its parent node or its parent node isn't a textblock (in which
  case no marks should be preserved).
  */
  marksAcross(e) {
    let t = this.parent.maybeChild(this.index());
    if (!t || !t.isInline)
      return null;
    let r = t.marks, i = e.parent.maybeChild(e.index());
    for (var o = 0; o < r.length; o++)
      r[o].type.spec.inclusive === !1 && (!i || !r[o].isInSet(i.marks)) && (r = r[o--].removeFromSet(r));
    return r;
  }
  /**
  The depth up to which this position and the given (non-resolved)
  position share the same parent nodes.
  */
  sharedDepth(e) {
    for (let t = this.depth; t > 0; t--)
      if (this.start(t) <= e && this.end(t) >= e)
        return t;
    return 0;
  }
  /**
  Returns a range based on the place where this position and the
  given position diverge around block content. If both point into
  the same textblock, for example, a range around that textblock
  will be returned. If they point into different blocks, the range
  around those blocks in their shared ancestor is returned. You can
  pass in an optional predicate that will be called with a parent
  node to see if a range into that parent is acceptable.
  */
  blockRange(e = this, t) {
    if (e.pos < this.pos)
      return e.blockRange(this);
    for (let r = this.depth - (this.parent.inlineContent || this.pos == e.pos ? 1 : 0); r >= 0; r--)
      if (e.pos <= this.end(r) && (!t || t(this.node(r))))
        return new eo(this, e, r);
    return null;
  }
  /**
  Query whether the given position shares the same parent node.
  */
  sameParent(e) {
    return this.pos - this.parentOffset == e.pos - e.parentOffset;
  }
  /**
  Return the greater of this and the given position.
  */
  max(e) {
    return e.pos > this.pos ? e : this;
  }
  /**
  Return the smaller of this and the given position.
  */
  min(e) {
    return e.pos < this.pos ? e : this;
  }
  /**
  @internal
  */
  toString() {
    let e = "";
    for (let t = 1; t <= this.depth; t++)
      e += (e ? "/" : "") + this.node(t).type.name + "_" + this.index(t - 1);
    return e + ":" + this.parentOffset;
  }
  /**
  @internal
  */
  static resolve(e, t) {
    if (!(t >= 0 && t <= e.content.size))
      throw new RangeError("Position " + t + " out of range");
    let r = [], i = 0, o = t;
    for (let s = e; ; ) {
      let { index: l, offset: a } = s.content.findIndex(o), c = o - a;
      if (r.push(s, l, i + a), !c || (s = s.child(l), s.isText))
        break;
      o = c - 1, i += a + 1;
    }
    return new Br(t, r, o);
  }
  /**
  @internal
  */
  static resolveCached(e, t) {
    let r = xa.get(e);
    if (r)
      for (let o = 0; o < r.elts.length; o++) {
        let s = r.elts[o];
        if (s.pos == t)
          return s;
      }
    else
      xa.set(e, r = new zh());
    let i = r.elts[r.i] = Br.resolve(e, t);
    return r.i = (r.i + 1) % $h, i;
  }
}
class zh {
  constructor() {
    this.elts = [], this.i = 0;
  }
}
const $h = 12, xa = /* @__PURE__ */ new WeakMap();
class eo {
  /**
  Construct a node range. `$from` and `$to` should point into the
  same node until at least the given `depth`, since a node range
  denotes an adjacent set of nodes in a single parent node.
  */
  constructor(e, t, r) {
    this.$from = e, this.$to = t, this.depth = r;
  }
  /**
  The position at the start of the range.
  */
  get start() {
    return this.$from.before(this.depth + 1);
  }
  /**
  The position at the end of the range.
  */
  get end() {
    return this.$to.after(this.depth + 1);
  }
  /**
  The parent node that the range points into.
  */
  get parent() {
    return this.$from.node(this.depth);
  }
  /**
  The start index of the range in the parent node.
  */
  get startIndex() {
    return this.$from.index(this.depth);
  }
  /**
  The end index of the range in the parent node.
  */
  get endIndex() {
    return this.$to.indexAfter(this.depth);
  }
}
const Fh = /* @__PURE__ */ Object.create(null);
let It = class js {
  /**
  @internal
  */
  constructor(e, t, r, i = Q.none) {
    this.type = e, this.attrs = t, this.marks = i, this.content = r || C.empty;
  }
  /**
  The array of this node's child nodes.
  */
  get children() {
    return this.content.content;
  }
  /**
  The size of this node, as defined by the integer-based [indexing
  scheme](https://prosemirror.net/docs/guide/#doc.indexing). For text nodes, this is the
  amount of characters. For other leaf nodes, it is one. For
  non-leaf nodes, it is the size of the content plus two (the
  start and end token).
  */
  get nodeSize() {
    return this.isLeaf ? 1 : 2 + this.content.size;
  }
  /**
  The number of children that the node has.
  */
  get childCount() {
    return this.content.childCount;
  }
  /**
  Get the child node at the given index. Raises an error when the
  index is out of range.
  */
  child(e) {
    return this.content.child(e);
  }
  /**
  Get the child node at the given index, if it exists.
  */
  maybeChild(e) {
    return this.content.maybeChild(e);
  }
  /**
  Call `f` for every child node, passing the node, its offset
  into this parent node, and its index.
  */
  forEach(e) {
    this.content.forEach(e);
  }
  /**
  Invoke a callback for all descendant nodes recursively overlapping
  the given two positions that are relative to start of this
  node's content. This includes all ancestors of the nodes
  containing the two positions. The callback is invoked with the
  node, its position relative to the original node (method receiver),
  its parent node, and its child index. When the callback returns
  false for a given node, that node's children will not be
  recursed over. The last parameter can be used to specify a
  starting position to count from.
  */
  nodesBetween(e, t, r, i = 0) {
    this.content.nodesBetween(e, t, r, i, this);
  }
  /**
  Call the given callback for every descendant node. Doesn't
  descend into a node when the callback returns `false`.
  */
  descendants(e) {
    this.nodesBetween(0, this.content.size, e);
  }
  /**
  Concatenates all the text nodes found in this fragment and its
  children.
  */
  get textContent() {
    return this.isLeaf && this.type.spec.leafText ? this.type.spec.leafText(this) : this.textBetween(0, this.content.size, "");
  }
  /**
  Get all text between positions `from` and `to`. When
  `blockSeparator` is given, it will be inserted to separate text
  from different block nodes. If `leafText` is given, it'll be
  inserted for every non-text leaf node encountered, otherwise
  [`leafText`](https://prosemirror.net/docs/ref/#model.NodeSpec.leafText) will be used.
  */
  textBetween(e, t, r, i) {
    return this.content.textBetween(e, t, r, i);
  }
  /**
  Returns this node's first child, or `null` if there are no
  children.
  */
  get firstChild() {
    return this.content.firstChild;
  }
  /**
  Returns this node's last child, or `null` if there are no
  children.
  */
  get lastChild() {
    return this.content.lastChild;
  }
  /**
  Test whether two nodes represent the same piece of document.
  */
  eq(e) {
    return this == e || this.sameMarkup(e) && this.content.eq(e.content);
  }
  /**
  Compare the markup (type, attributes, and marks) of this node to
  those of another. Returns `true` if both have the same markup.
  */
  sameMarkup(e) {
    return this.hasMarkup(e.type, e.attrs, e.marks);
  }
  /**
  Check whether this node's markup correspond to the given type,
  attributes, and marks.
  */
  hasMarkup(e, t, r) {
    return this.type == e && Qi(this.attrs, t || e.defaultAttrs || Fh) && Q.sameSet(this.marks, r || Q.none);
  }
  /**
  Create a new node with the same markup as this node, containing
  the given content (or empty, if no content is given).
  */
  copy(e = null) {
    return e == this.content ? this : new js(this.type, this.attrs, e, this.marks);
  }
  /**
  Create a copy of this node, with the given set of marks instead
  of the node's own marks.
  */
  mark(e) {
    return e == this.marks ? this : new js(this.type, this.attrs, this.content, e);
  }
  /**
  Create a copy of this node with only the content between the
  given positions. If `to` is not given, it defaults to the end of
  the node.
  */
  cut(e, t = this.content.size) {
    return e == 0 && t == this.content.size ? this : this.copy(this.content.cut(e, t));
  }
  /**
  Cut out the part of the document between the given positions, and
  return it as a `Slice` object.
  */
  slice(e, t = this.content.size, r = !1) {
    if (e == t)
      return A.empty;
    let i = this.resolve(e), o = this.resolve(t), s = r ? 0 : i.sharedDepth(t), l = i.start(s), c = i.node(s).content.cut(i.pos - l, o.pos - l);
    return new A(c, i.depth - s, o.depth - s);
  }
  /**
  Replace the part of the document between the given positions with
  the given slice. The slice must 'fit', meaning its open sides
  must be able to connect to the surrounding content, and its
  content nodes must be valid children for the node they are placed
  into. If any of this is violated, an error of type
  [`ReplaceError`](https://prosemirror.net/docs/ref/#model.ReplaceError) is thrown.
  */
  replace(e, t, r) {
    return Bh(this.resolve(e), this.resolve(t), r);
  }
  /**
  Find the node directly after the given position.
  */
  nodeAt(e) {
    for (let t = this; ; ) {
      let { index: r, offset: i } = t.content.findIndex(e);
      if (t = t.maybeChild(r), !t)
        return null;
      if (i == e || t.isText)
        return t;
      e -= i + 1;
    }
  }
  /**
  Find the (direct) child node after the given offset, if any,
  and return it along with its index and offset relative to this
  node.
  */
  childAfter(e) {
    let { index: t, offset: r } = this.content.findIndex(e);
    return { node: this.content.maybeChild(t), index: t, offset: r };
  }
  /**
  Find the (direct) child node before the given offset, if any,
  and return it along with its index and offset relative to this
  node.
  */
  childBefore(e) {
    if (e == 0)
      return { node: null, index: 0, offset: 0 };
    let { index: t, offset: r } = this.content.findIndex(e);
    if (r < e)
      return { node: this.content.child(t), index: t, offset: r };
    let i = this.content.child(t - 1);
    return { node: i, index: t - 1, offset: r - i.nodeSize };
  }
  /**
  Resolve the given position in the document, returning an
  [object](https://prosemirror.net/docs/ref/#model.ResolvedPos) with information about its context.
  */
  resolve(e) {
    return Br.resolveCached(this, e);
  }
  /**
  @internal
  */
  resolveNoCache(e) {
    return Br.resolve(this, e);
  }
  /**
  Test whether a given mark or mark type occurs in this document
  between the two given positions.
  */
  rangeHasMark(e, t, r) {
    let i = !1;
    return t > e && this.nodesBetween(e, t, (o) => (r.isInSet(o.marks) && (i = !0), !i)), i;
  }
  /**
  True when this is a block (non-inline node)
  */
  get isBlock() {
    return this.type.isBlock;
  }
  /**
  True when this is a textblock node, a block node with inline
  content.
  */
  get isTextblock() {
    return this.type.isTextblock;
  }
  /**
  True when this node allows inline content.
  */
  get inlineContent() {
    return this.type.inlineContent;
  }
  /**
  True when this is an inline node (a text node or a node that can
  appear among text).
  */
  get isInline() {
    return this.type.isInline;
  }
  /**
  True when this is a text node.
  */
  get isText() {
    return this.type.isText;
  }
  /**
  True when this is a leaf node.
  */
  get isLeaf() {
    return this.type.isLeaf;
  }
  /**
  True when this is an atom, i.e. when it does not have directly
  editable content. This is usually the same as `isLeaf`, but can
  be configured with the [`atom` property](https://prosemirror.net/docs/ref/#model.NodeSpec.atom)
  on a node's spec (typically used when the node is displayed as
  an uneditable [node view](https://prosemirror.net/docs/ref/#view.NodeView)).
  */
  get isAtom() {
    return this.type.isAtom;
  }
  /**
  Return a string representation of this node for debugging
  purposes.
  */
  toString() {
    if (this.type.spec.toDebugString)
      return this.type.spec.toDebugString(this);
    let e = this.type.name;
    return this.content.size && (e += "(" + this.content.toStringInner() + ")"), Ru(this.marks, e);
  }
  /**
  Get the content match in this node at the given index.
  */
  contentMatchAt(e) {
    let t = this.type.contentMatch.matchFragment(this.content, 0, e);
    if (!t)
      throw new Error("Called contentMatchAt on a node with invalid content");
    return t;
  }
  /**
  Test whether replacing the range between `from` and `to` (by
  child index) with the given replacement fragment (which defaults
  to the empty fragment) would leave the node's content valid. You
  can optionally pass `start` and `end` indices into the
  replacement fragment.
  */
  canReplace(e, t, r = C.empty, i = 0, o = r.childCount) {
    let s = this.contentMatchAt(e).matchFragment(r, i, o), l = s && s.matchFragment(this.content, t);
    if (!l || !l.validEnd)
      return !1;
    for (let a = i; a < o; a++)
      if (!this.type.allowsMarks(r.child(a).marks))
        return !1;
    return !0;
  }
  /**
  Test whether replacing the range `from` to `to` (by index) with
  a node of the given type would leave the node's content valid.
  */
  canReplaceWith(e, t, r, i) {
    if (i && !this.type.allowsMarks(i))
      return !1;
    let o = this.contentMatchAt(e).matchType(r), s = o && o.matchFragment(this.content, t);
    return s ? s.validEnd : !1;
  }
  /**
  Test whether the given node's content could be appended to this
  node. If that node is empty, this will only return true if there
  is at least one node type that can appear in both nodes (to avoid
  merging completely incompatible nodes).
  */
  canAppend(e) {
    return e.content.size ? this.canReplace(this.childCount, this.childCount, e.content) : this.type.compatibleContent(e.type);
  }
  /**
  Check whether this node and its descendants conform to the
  schema, and raise an exception when they do not.
  */
  check() {
    this.type.checkContent(this.content), this.type.checkAttrs(this.attrs);
    let e = Q.none;
    for (let t = 0; t < this.marks.length; t++) {
      let r = this.marks[t];
      r.type.checkAttrs(r.attrs), e = r.addToSet(e);
    }
    if (!Q.sameSet(e, this.marks))
      throw new RangeError(`Invalid collection of marks for node ${this.type.name}: ${this.marks.map((t) => t.type.name)}`);
    this.content.forEach((t) => t.check());
  }
  /**
  Return a JSON-serializeable representation of this node.
  */
  toJSON() {
    let e = { type: this.type.name };
    for (let t in this.attrs) {
      e.attrs = this.attrs;
      break;
    }
    return this.content.size && (e.content = this.content.toJSON()), this.marks.length && (e.marks = this.marks.map((t) => t.toJSON())), e;
  }
  /**
  Deserialize a node from its JSON representation.
  */
  static fromJSON(e, t) {
    if (!t)
      throw new RangeError("Invalid input for Node.fromJSON");
    let r;
    if (t.marks) {
      if (!Array.isArray(t.marks))
        throw new RangeError("Invalid mark data for Node.fromJSON");
      r = t.marks.map(e.markFromJSON);
    }
    if (t.type == "text") {
      if (typeof t.text != "string")
        throw new RangeError("Invalid text node in JSON");
      return e.text(t.text, r);
    }
    let i = C.fromJSON(e, t.content), o = e.nodeType(t.type).create(t.attrs, i, r);
    return o.type.checkAttrs(o.attrs), o;
  }
};
It.prototype.text = void 0;
class to extends It {
  /**
  @internal
  */
  constructor(e, t, r, i) {
    if (super(e, t, null, i), !r)
      throw new RangeError("Empty text nodes are not allowed");
    this.text = r;
  }
  toString() {
    return this.type.spec.toDebugString ? this.type.spec.toDebugString(this) : Ru(this.marks, JSON.stringify(this.text));
  }
  get textContent() {
    return this.text;
  }
  textBetween(e, t) {
    return this.text.slice(e, t);
  }
  get nodeSize() {
    return this.text.length;
  }
  mark(e) {
    return e == this.marks ? this : new to(this.type, this.attrs, this.text, e);
  }
  withText(e) {
    return e == this.text ? this : new to(this.type, this.attrs, e, this.marks);
  }
  cut(e = 0, t = this.text.length) {
    return e == 0 && t == this.text.length ? this : this.withText(this.text.slice(e, t));
  }
  eq(e) {
    return this.sameMarkup(e) && this.text == e.text;
  }
  toJSON() {
    let e = super.toJSON();
    return e.text = this.text, e;
  }
}
function Ru(n, e) {
  for (let t = n.length - 1; t >= 0; t--)
    e = n[t].type.name + "(" + e + ")";
  return e;
}
class Sn {
  /**
  @internal
  */
  constructor(e) {
    this.validEnd = e, this.next = [], this.wrapCache = [];
  }
  /**
  @internal
  */
  static parse(e, t) {
    let r = new Vh(e, t);
    if (r.next == null)
      return Sn.empty;
    let i = Iu(r);
    r.next && r.err("Unexpected trailing text");
    let o = Jh(qh(i));
    return Gh(o, r), o;
  }
  /**
  Match a node type, returning a match after that node if
  successful.
  */
  matchType(e) {
    for (let t = 0; t < this.next.length; t++)
      if (this.next[t].type == e)
        return this.next[t].next;
    return null;
  }
  /**
  Try to match a fragment. Returns the resulting match when
  successful.
  */
  matchFragment(e, t = 0, r = e.childCount) {
    let i = this;
    for (let o = t; i && o < r; o++)
      i = i.matchType(e.child(o).type);
    return i;
  }
  /**
  @internal
  */
  get inlineContent() {
    return this.next.length != 0 && this.next[0].type.isInline;
  }
  /**
  Get the first matching node type at this match position that can
  be generated.
  */
  get defaultType() {
    for (let e = 0; e < this.next.length; e++) {
      let { type: t } = this.next[e];
      if (!(t.isText || t.hasRequiredAttrs()))
        return t;
    }
    return null;
  }
  /**
  @internal
  */
  compatible(e) {
    for (let t = 0; t < this.next.length; t++)
      for (let r = 0; r < e.next.length; r++)
        if (this.next[t].type == e.next[r].type)
          return !0;
    return !1;
  }
  /**
  Try to match the given fragment, and if that fails, see if it can
  be made to match by inserting nodes in front of it. When
  successful, return a fragment of inserted nodes (which may be
  empty if nothing had to be inserted). When `toEnd` is true, only
  return a fragment if the resulting match goes to the end of the
  content expression.
  */
  fillBefore(e, t = !1, r = 0) {
    let i = [this];
    function o(s, l) {
      let a = s.matchFragment(e, r);
      if (a && (!t || a.validEnd))
        return C.from(l.map((c) => c.createAndFill()));
      for (let c = 0; c < s.next.length; c++) {
        let { type: u, next: d } = s.next[c];
        if (!(u.isText || u.hasRequiredAttrs()) && i.indexOf(d) == -1) {
          i.push(d);
          let f = o(d, l.concat(u));
          if (f)
            return f;
        }
      }
      return null;
    }
    return o(this, []);
  }
  /**
  Find a set of wrapping node types that would allow a node of the
  given type to appear at this position. The result may be empty
  (when it fits directly) and will be null when no such wrapping
  exists.
  */
  findWrapping(e) {
    for (let r = 0; r < this.wrapCache.length; r += 2)
      if (this.wrapCache[r] == e)
        return this.wrapCache[r + 1];
    let t = this.computeWrapping(e);
    return this.wrapCache.push(e, t), t;
  }
  /**
  @internal
  */
  computeWrapping(e) {
    let t = /* @__PURE__ */ Object.create(null), r = [{ match: this, type: null, via: null }];
    for (; r.length; ) {
      let i = r.shift(), o = i.match;
      if (o.matchType(e)) {
        let s = [];
        for (let l = i; l.type; l = l.via)
          s.push(l.type);
        return s.reverse();
      }
      for (let s = 0; s < o.next.length; s++) {
        let { type: l, next: a } = o.next[s];
        !l.isLeaf && !l.hasRequiredAttrs() && !(l.name in t) && (!i.type || a.validEnd) && (r.push({ match: l.contentMatch, type: l, via: i }), t[l.name] = !0);
      }
    }
    return null;
  }
  /**
  The number of outgoing edges this node has in the finite
  automaton that describes the content expression.
  */
  get edgeCount() {
    return this.next.length;
  }
  /**
  Get the _n_​th outgoing edge from this node in the finite
  automaton that describes the content expression.
  */
  edge(e) {
    if (e >= this.next.length)
      throw new RangeError(`There's no ${e}th edge in this content match`);
    return this.next[e];
  }
  /**
  @internal
  */
  toString() {
    let e = [];
    function t(r) {
      e.push(r);
      for (let i = 0; i < r.next.length; i++)
        e.indexOf(r.next[i].next) == -1 && t(r.next[i].next);
    }
    return t(this), e.map((r, i) => {
      let o = i + (r.validEnd ? "*" : " ") + " ";
      for (let s = 0; s < r.next.length; s++)
        o += (s ? ", " : "") + r.next[s].type.name + "->" + e.indexOf(r.next[s].next);
      return o;
    }).join(`
`);
  }
}
Sn.empty = new Sn(!0);
class Vh {
  constructor(e, t) {
    this.string = e, this.nodeTypes = t, this.inline = null, this.pos = 0, this.tokens = e.split(/\s*(?=\b|\W|$)/), this.tokens[this.tokens.length - 1] == "" && this.tokens.pop(), this.tokens[0] == "" && this.tokens.shift();
  }
  get next() {
    return this.tokens[this.pos];
  }
  eat(e) {
    return this.next == e && (this.pos++ || !0);
  }
  err(e) {
    throw new SyntaxError(e + " (in content expression '" + this.string + "')");
  }
}
function Iu(n) {
  let e = [];
  do
    e.push(jh(n));
  while (n.eat("|"));
  return e.length == 1 ? e[0] : { type: "choice", exprs: e };
}
function jh(n) {
  let e = [];
  do
    e.push(Wh(n));
  while (n.next && n.next != ")" && n.next != "|");
  return e.length == 1 ? e[0] : { type: "seq", exprs: e };
}
function Wh(n) {
  let e = Kh(n);
  for (; ; )
    if (n.eat("+"))
      e = { type: "plus", expr: e };
    else if (n.eat("*"))
      e = { type: "star", expr: e };
    else if (n.eat("?"))
      e = { type: "opt", expr: e };
    else if (n.eat("{"))
      e = _h(n, e);
    else
      break;
  return e;
}
function Ca(n) {
  /\D/.test(n.next) && n.err("Expected number, got '" + n.next + "'");
  let e = Number(n.next);
  return n.pos++, e;
}
function _h(n, e) {
  let t = Ca(n), r = t;
  return n.eat(",") && (n.next != "}" ? r = Ca(n) : r = -1), n.eat("}") || n.err("Unclosed braced range"), { type: "range", min: t, max: r, expr: e };
}
function Uh(n, e) {
  let t = n.nodeTypes, r = t[e];
  if (r)
    return [r];
  let i = [];
  for (let o in t) {
    let s = t[o];
    s.isInGroup(e) && i.push(s);
  }
  return i.length == 0 && n.err("No node type or group '" + e + "' found"), i;
}
function Kh(n) {
  if (n.eat("(")) {
    let e = Iu(n);
    return n.eat(")") || n.err("Missing closing paren"), e;
  } else if (/\W/.test(n.next))
    n.err("Unexpected token '" + n.next + "'");
  else {
    let e = Uh(n, n.next).map((t) => (n.inline == null ? n.inline = t.isInline : n.inline != t.isInline && n.err("Mixing inline and block content"), { type: "name", value: t }));
    return n.pos++, e.length == 1 ? e[0] : { type: "choice", exprs: e };
  }
}
function qh(n) {
  let e = [[]];
  return i(o(n, 0), t()), e;
  function t() {
    return e.push([]) - 1;
  }
  function r(s, l, a) {
    let c = { term: a, to: l };
    return e[s].push(c), c;
  }
  function i(s, l) {
    s.forEach((a) => a.to = l);
  }
  function o(s, l) {
    if (s.type == "choice")
      return s.exprs.reduce((a, c) => a.concat(o(c, l)), []);
    if (s.type == "seq")
      for (let a = 0; ; a++) {
        let c = o(s.exprs[a], l);
        if (a == s.exprs.length - 1)
          return c;
        i(c, l = t());
      }
    else if (s.type == "star") {
      let a = t();
      return r(l, a), i(o(s.expr, a), a), [r(a)];
    } else if (s.type == "plus") {
      let a = t();
      return i(o(s.expr, l), a), i(o(s.expr, a), a), [r(a)];
    } else {
      if (s.type == "opt")
        return [r(l)].concat(o(s.expr, l));
      if (s.type == "range") {
        let a = l;
        for (let c = 0; c < s.min; c++) {
          let u = t();
          i(o(s.expr, a), u), a = u;
        }
        if (s.max == -1)
          i(o(s.expr, a), a);
        else
          for (let c = s.min; c < s.max; c++) {
            let u = t();
            r(a, u), i(o(s.expr, a), u), a = u;
          }
        return [r(a)];
      } else {
        if (s.type == "name")
          return [r(l, void 0, s.value)];
        throw new Error("Unknown expr type");
      }
    }
  }
}
function Lu(n, e) {
  return e - n;
}
function Ta(n, e) {
  let t = [];
  return r(e), t.sort(Lu);
  function r(i) {
    let o = n[i];
    if (o.length == 1 && !o[0].term)
      return r(o[0].to);
    t.push(i);
    for (let s = 0; s < o.length; s++) {
      let { term: l, to: a } = o[s];
      !l && t.indexOf(a) == -1 && r(a);
    }
  }
}
function Jh(n) {
  let e = /* @__PURE__ */ Object.create(null);
  return t(Ta(n, 0));
  function t(r) {
    let i = [];
    r.forEach((s) => {
      n[s].forEach(({ term: l, to: a }) => {
        if (!l)
          return;
        let c;
        for (let u = 0; u < i.length; u++)
          i[u][0] == l && (c = i[u][1]);
        Ta(n, a).forEach((u) => {
          c || i.push([l, c = []]), c.indexOf(u) == -1 && c.push(u);
        });
      });
    });
    let o = e[r.join(",")] = new Sn(r.indexOf(n.length - 1) > -1);
    for (let s = 0; s < i.length; s++) {
      let l = i[s][1].sort(Lu);
      o.next.push({ type: i[s][0], next: e[l.join(",")] || t(l) });
    }
    return o;
  }
}
function Gh(n, e) {
  for (let t = 0, r = [n]; t < r.length; t++) {
    let i = r[t], o = !i.validEnd, s = [];
    for (let l = 0; l < i.next.length; l++) {
      let { type: a, next: c } = i.next[l];
      s.push(a.name), o && !(a.isText || a.hasRequiredAttrs()) && (o = !1), r.indexOf(c) == -1 && r.push(c);
    }
    o && e.err("Only non-generatable nodes (" + s.join(", ") + ") in a required position (see https://prosemirror.net/docs/guide/#generatable)");
  }
}
function Pu(n) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t in n) {
    let r = n[t];
    if (!r.hasDefault)
      return null;
    e[t] = r.default;
  }
  return e;
}
function Bu(n, e) {
  let t = /* @__PURE__ */ Object.create(null);
  for (let r in n) {
    let i = e && e[r];
    if (i === void 0) {
      let o = n[r];
      if (o.hasDefault)
        i = o.default;
      else
        throw new RangeError("No value supplied for attribute " + r);
    }
    t[r] = i;
  }
  return t;
}
function Hu(n, e, t, r) {
  for (let i in e)
    if (!(i in n))
      throw new RangeError(`Unsupported attribute ${i} for ${t} of type ${r}`);
  for (let i in n)
    n[i].validate && n[i].validate(e[i]);
}
function zu(n, e) {
  let t = /* @__PURE__ */ Object.create(null);
  if (e)
    for (let r in e)
      t[r] = new Xh(n, r, e[r]);
  return t;
}
let Ea = class $u {
  /**
  @internal
  */
  constructor(e, t, r) {
    this.name = e, this.schema = t, this.spec = r, this.markSet = null, this.groups = r.group ? r.group.split(" ") : [], this.attrs = zu(e, r.attrs), this.defaultAttrs = Pu(this.attrs), this.contentMatch = null, this.inlineContent = null, this.isBlock = !(r.inline || e == "text"), this.isText = e == "text";
  }
  /**
  True if this is an inline type.
  */
  get isInline() {
    return !this.isBlock;
  }
  /**
  True if this is a textblock type, a block that contains inline
  content.
  */
  get isTextblock() {
    return this.isBlock && this.inlineContent;
  }
  /**
  True for node types that allow no content.
  */
  get isLeaf() {
    return this.contentMatch == Sn.empty;
  }
  /**
  True when this node is an atom, i.e. when it does not have
  directly editable content.
  */
  get isAtom() {
    return this.isLeaf || !!this.spec.atom;
  }
  /**
  Return true when this node type is part of the given
  [group](https://prosemirror.net/docs/ref/#model.NodeSpec.group).
  */
  isInGroup(e) {
    return this.groups.indexOf(e) > -1;
  }
  /**
  The node type's [whitespace](https://prosemirror.net/docs/ref/#model.NodeSpec.whitespace) option.
  */
  get whitespace() {
    return this.spec.whitespace || (this.spec.code ? "pre" : "normal");
  }
  /**
  Tells you whether this node type has any required attributes.
  */
  hasRequiredAttrs() {
    for (let e in this.attrs)
      if (this.attrs[e].isRequired)
        return !0;
    return !1;
  }
  /**
  Indicates whether this node allows some of the same content as
  the given node type.
  */
  compatibleContent(e) {
    return this == e || this.contentMatch.compatible(e.contentMatch);
  }
  /**
  @internal
  */
  computeAttrs(e) {
    return !e && this.defaultAttrs ? this.defaultAttrs : Bu(this.attrs, e);
  }
  /**
  Create a `Node` of this type. The given attributes are
  checked and defaulted (you can pass `null` to use the type's
  defaults entirely, if no required attributes exist). `content`
  may be a `Fragment`, a node, an array of nodes, or
  `null`. Similarly `marks` may be `null` to default to the empty
  set of marks.
  */
  create(e = null, t, r) {
    if (this.isText)
      throw new Error("NodeType.create can't construct text nodes");
    return new It(this, this.computeAttrs(e), C.from(t), Q.setFrom(r));
  }
  /**
  Like [`create`](https://prosemirror.net/docs/ref/#model.NodeType.create), but check the given content
  against the node type's content restrictions, and throw an error
  if it doesn't match.
  */
  createChecked(e = null, t, r) {
    return t = C.from(t), this.checkContent(t), new It(this, this.computeAttrs(e), t, Q.setFrom(r));
  }
  /**
  Like [`create`](https://prosemirror.net/docs/ref/#model.NodeType.create), but see if it is
  necessary to add nodes to the start or end of the given fragment
  to make it fit the node. If no fitting wrapping can be found,
  return null. Note that, due to the fact that required nodes can
  always be created, this will always succeed if you pass null or
  `Fragment.empty` as content.
  */
  createAndFill(e = null, t, r) {
    if (e = this.computeAttrs(e), t = C.from(t), t.size) {
      let s = this.contentMatch.fillBefore(t);
      if (!s)
        return null;
      t = s.append(t);
    }
    let i = this.contentMatch.matchFragment(t), o = i && i.fillBefore(C.empty, !0);
    return o ? new It(this, e, t.append(o), Q.setFrom(r)) : null;
  }
  /**
  Returns true if the given fragment is valid content for this node
  type.
  */
  validContent(e) {
    let t = this.contentMatch.matchFragment(e);
    if (!t || !t.validEnd)
      return !1;
    for (let r = 0; r < e.childCount; r++)
      if (!this.allowsMarks(e.child(r).marks))
        return !1;
    return !0;
  }
  /**
  Throws a RangeError if the given fragment is not valid content for this
  node type.
  @internal
  */
  checkContent(e) {
    if (!this.validContent(e))
      throw new RangeError(`Invalid content for node ${this.name}: ${e.toString().slice(0, 50)}`);
  }
  /**
  @internal
  */
  checkAttrs(e) {
    Hu(this.attrs, e, "node", this.name);
  }
  /**
  Check whether the given mark type is allowed in this node.
  */
  allowsMarkType(e) {
    return this.markSet == null || this.markSet.indexOf(e) > -1;
  }
  /**
  Test whether the given set of marks are allowed in this node.
  */
  allowsMarks(e) {
    if (this.markSet == null)
      return !0;
    for (let t = 0; t < e.length; t++)
      if (!this.allowsMarkType(e[t].type))
        return !1;
    return !0;
  }
  /**
  Removes the marks that are not allowed in this node from the given set.
  */
  allowedMarks(e) {
    if (this.markSet == null)
      return e;
    let t;
    for (let r = 0; r < e.length; r++)
      this.allowsMarkType(e[r].type) ? t && t.push(e[r]) : t || (t = e.slice(0, r));
    return t ? t.length ? t : Q.none : e;
  }
  /**
  @internal
  */
  static compile(e, t) {
    let r = /* @__PURE__ */ Object.create(null);
    e.forEach((o, s) => r[o] = new $u(o, t, s));
    let i = t.spec.topNode || "doc";
    if (!r[i])
      throw new RangeError("Schema is missing its top node type ('" + i + "')");
    if (!r.text)
      throw new RangeError("Every schema needs a 'text' type");
    for (let o in r.text.attrs)
      throw new RangeError("The text node type should not have attributes");
    return r;
  }
};
function Yh(n, e, t) {
  let r = t.split("|");
  return (i) => {
    let o = i === null ? "null" : typeof i;
    if (r.indexOf(o) < 0)
      throw new RangeError(`Expected value of type ${r} for attribute ${e} on type ${n}, got ${o}`);
  };
}
class Xh {
  constructor(e, t, r) {
    this.hasDefault = Object.prototype.hasOwnProperty.call(r, "default"), this.default = r.default, this.validate = typeof r.validate == "string" ? Yh(e, t, r.validate) : r.validate;
  }
  get isRequired() {
    return !this.hasDefault;
  }
}
class jo {
  /**
  @internal
  */
  constructor(e, t, r, i) {
    this.name = e, this.rank = t, this.schema = r, this.spec = i, this.attrs = zu(e, i.attrs), this.excluded = null;
    let o = Pu(this.attrs);
    this.instance = o ? new Q(this, o) : null;
  }
  /**
  Create a mark of this type. `attrs` may be `null` or an object
  containing only some of the mark's attributes. The others, if
  they have defaults, will be added.
  */
  create(e = null) {
    return !e && this.instance ? this.instance : new Q(this, Bu(this.attrs, e));
  }
  /**
  @internal
  */
  static compile(e, t) {
    let r = /* @__PURE__ */ Object.create(null), i = 0;
    return e.forEach((o, s) => r[o] = new jo(o, i++, t, s)), r;
  }
  /**
  When there is a mark of this type in the given set, a new set
  without it is returned. Otherwise, the input set is returned.
  */
  removeFromSet(e) {
    for (var t = 0; t < e.length; t++)
      e[t].type == this && (e = e.slice(0, t).concat(e.slice(t + 1)), t--);
    return e;
  }
  /**
  Tests whether there is a mark of this type in the given set.
  */
  isInSet(e) {
    for (let t = 0; t < e.length; t++)
      if (e[t].type == this)
        return e[t];
  }
  /**
  @internal
  */
  checkAttrs(e) {
    Hu(this.attrs, e, "mark", this.name);
  }
  /**
  Queries whether a given mark type is
  [excluded](https://prosemirror.net/docs/ref/#model.MarkSpec.excludes) by this one.
  */
  excludes(e) {
    return this.excluded.indexOf(e) > -1;
  }
}
class Fu {
  /**
  Construct a schema from a schema [specification](https://prosemirror.net/docs/ref/#model.SchemaSpec).
  */
  constructor(e) {
    this.linebreakReplacement = null, this.cached = /* @__PURE__ */ Object.create(null);
    let t = this.spec = {};
    for (let i in e)
      t[i] = e[i];
    t.nodes = ke.from(e.nodes), t.marks = ke.from(e.marks || {}), this.nodes = Ea.compile(this.spec.nodes, this), this.marks = jo.compile(this.spec.marks, this);
    let r = /* @__PURE__ */ Object.create(null);
    for (let i in this.nodes) {
      if (i in this.marks)
        throw new RangeError(i + " can not be both a node and a mark");
      let o = this.nodes[i], s = o.spec.content || "", l = o.spec.marks;
      if (o.contentMatch = r[s] || (r[s] = Sn.parse(s, this.nodes)), o.inlineContent = o.contentMatch.inlineContent, o.spec.linebreakReplacement) {
        if (this.linebreakReplacement)
          throw new RangeError("Multiple linebreak nodes defined");
        if (!o.isInline || !o.isLeaf)
          throw new RangeError("Linebreak replacement nodes must be inline leaf nodes");
        this.linebreakReplacement = o;
      }
      o.markSet = l == "_" ? null : l ? Ma(this, l.split(" ")) : l == "" || !o.inlineContent ? [] : null;
    }
    for (let i in this.marks) {
      let o = this.marks[i], s = o.spec.excludes;
      o.excluded = s == null ? [o] : s == "" ? [] : Ma(this, s.split(" "));
    }
    this.nodeFromJSON = (i) => It.fromJSON(this, i), this.markFromJSON = (i) => Q.fromJSON(this, i), this.topNodeType = this.nodes[this.spec.topNode || "doc"], this.cached.wrappings = /* @__PURE__ */ Object.create(null);
  }
  /**
  Create a node in this schema. The `type` may be a string or a
  `NodeType` instance. Attributes will be extended with defaults,
  `content` may be a `Fragment`, `null`, a `Node`, or an array of
  nodes.
  */
  node(e, t = null, r, i) {
    if (typeof e == "string")
      e = this.nodeType(e);
    else if (e instanceof Ea) {
      if (e.schema != this)
        throw new RangeError("Node type from different schema used (" + e.name + ")");
    } else throw new RangeError("Invalid node type: " + e);
    return e.createChecked(t, r, i);
  }
  /**
  Create a text node in the schema. Empty text nodes are not
  allowed.
  */
  text(e, t) {
    let r = this.nodes.text;
    return new to(r, r.defaultAttrs, e, Q.setFrom(t));
  }
  /**
  Create a mark with the given type and attributes.
  */
  mark(e, t) {
    return typeof e == "string" && (e = this.marks[e]), e.create(t);
  }
  /**
  @internal
  */
  nodeType(e) {
    let t = this.nodes[e];
    if (!t)
      throw new RangeError("Unknown node type: " + e);
    return t;
  }
}
function Ma(n, e) {
  let t = [];
  for (let r = 0; r < e.length; r++) {
    let i = e[r], o = n.marks[i], s = o;
    if (o)
      t.push(o);
    else
      for (let l in n.marks) {
        let a = n.marks[l];
        (i == "_" || a.spec.group && a.spec.group.split(" ").indexOf(i) > -1) && t.push(s = a);
      }
    if (!s)
      throw new SyntaxError("Unknown mark type: '" + e[r] + "'");
  }
  return t;
}
function Qh(n) {
  return n.tag != null;
}
function Zh(n) {
  return n.style != null;
}
class Jt {
  /**
  Create a parser that targets the given schema, using the given
  parsing rules.
  */
  constructor(e, t) {
    this.schema = e, this.rules = t, this.tags = [], this.styles = [];
    let r = this.matchedStyles = [];
    t.forEach((i) => {
      if (Qh(i))
        this.tags.push(i);
      else if (Zh(i)) {
        let o = /[^=]*/.exec(i.style)[0];
        r.indexOf(o) < 0 && r.push(o), this.styles.push(i);
      }
    }), this.normalizeLists = !this.tags.some((i) => {
      if (!/^(ul|ol)\b/.test(i.tag) || !i.node)
        return !1;
      let o = e.nodes[i.node];
      return o.contentMatch.matchType(o);
    });
  }
  /**
  Parse a document from the content of a DOM node.
  */
  parse(e, t = {}) {
    let r = new Aa(this, t, !1);
    return r.addAll(e, Q.none, t.from, t.to), r.finish();
  }
  /**
  Parses the content of the given DOM node, like
  [`parse`](https://prosemirror.net/docs/ref/#model.DOMParser.parse), and takes the same set of
  options. But unlike that method, which produces a whole node,
  this one returns a slice that is open at the sides, meaning that
  the schema constraints aren't applied to the start of nodes to
  the left of the input and the end of nodes at the end.
  */
  parseSlice(e, t = {}) {
    let r = new Aa(this, t, !0);
    return r.addAll(e, Q.none, t.from, t.to), A.maxOpen(r.finish());
  }
  /**
  @internal
  */
  matchTag(e, t, r) {
    for (let i = r ? this.tags.indexOf(r) + 1 : 0; i < this.tags.length; i++) {
      let o = this.tags[i];
      if (np(e, o.tag) && (o.namespace === void 0 || e.namespaceURI == o.namespace) && (!o.context || t.matchesContext(o.context))) {
        if (o.getAttrs) {
          let s = o.getAttrs(e);
          if (s === !1)
            continue;
          o.attrs = s || void 0;
        }
        return o;
      }
    }
  }
  /**
  @internal
  */
  matchStyle(e, t, r, i) {
    for (let o = i ? this.styles.indexOf(i) + 1 : 0; o < this.styles.length; o++) {
      let s = this.styles[o], l = s.style;
      if (!(l.indexOf(e) != 0 || s.context && !r.matchesContext(s.context) || // Test that the style string either precisely matches the prop,
      // or has an '=' sign after the prop, followed by the given
      // value.
      l.length > e.length && (l.charCodeAt(e.length) != 61 || l.slice(e.length + 1) != t))) {
        if (s.getAttrs) {
          let a = s.getAttrs(t);
          if (a === !1)
            continue;
          s.attrs = a || void 0;
        }
        return s;
      }
    }
  }
  /**
  @internal
  */
  static schemaRules(e) {
    let t = [];
    function r(i) {
      let o = i.priority == null ? 50 : i.priority, s = 0;
      for (; s < t.length; s++) {
        let l = t[s];
        if ((l.priority == null ? 50 : l.priority) < o)
          break;
      }
      t.splice(s, 0, i);
    }
    for (let i in e.marks) {
      let o = e.marks[i].spec.parseDOM;
      o && o.forEach((s) => {
        r(s = Na(s)), s.mark || s.ignore || s.clearMark || (s.mark = i);
      });
    }
    for (let i in e.nodes) {
      let o = e.nodes[i].spec.parseDOM;
      o && o.forEach((s) => {
        r(s = Na(s)), s.node || s.ignore || s.mark || (s.node = i);
      });
    }
    return t;
  }
  /**
  Construct a DOM parser using the parsing rules listed in a
  schema's [node specs](https://prosemirror.net/docs/ref/#model.NodeSpec.parseDOM), reordered by
  [priority](https://prosemirror.net/docs/ref/#model.GenericParseRule.priority).
  */
  static fromSchema(e) {
    return e.cached.domParser || (e.cached.domParser = new Jt(e, Jt.schemaRules(e)));
  }
}
const Vu = {
  address: !0,
  article: !0,
  aside: !0,
  blockquote: !0,
  body: !0,
  canvas: !0,
  dd: !0,
  div: !0,
  dl: !0,
  fieldset: !0,
  figcaption: !0,
  figure: !0,
  footer: !0,
  form: !0,
  h1: !0,
  h2: !0,
  h3: !0,
  h4: !0,
  h5: !0,
  h6: !0,
  header: !0,
  hgroup: !0,
  hr: !0,
  li: !0,
  noscript: !0,
  ol: !0,
  output: !0,
  p: !0,
  pre: !0,
  section: !0,
  table: !0,
  tfoot: !0,
  ul: !0
}, ep = {
  head: !0,
  noscript: !0,
  object: !0,
  script: !0,
  style: !0,
  title: !0
}, ju = { ol: !0, ul: !0 }, Hr = 1, Ws = 2, wr = 4;
function Oa(n, e, t) {
  return e != null ? (e ? Hr : 0) | (e === "full" ? Ws : 0) : n && n.whitespace == "pre" ? Hr | Ws : t & ~wr;
}
class xi {
  constructor(e, t, r, i, o, s) {
    this.type = e, this.attrs = t, this.marks = r, this.solid = i, this.options = s, this.content = [], this.activeMarks = Q.none, this.match = o || (s & wr ? null : e.contentMatch);
  }
  findWrapping(e) {
    if (!this.match) {
      if (!this.type)
        return [];
      let t = this.type.contentMatch.fillBefore(C.from(e));
      if (t)
        this.match = this.type.contentMatch.matchFragment(t);
      else {
        let r = this.type.contentMatch, i;
        return (i = r.findWrapping(e.type)) ? (this.match = r, i) : null;
      }
    }
    return this.match.findWrapping(e.type);
  }
  finish(e) {
    if (!(this.options & Hr)) {
      let r = this.content[this.content.length - 1], i;
      if (r && r.isText && (i = /[ \t\r\n\u000c]+$/.exec(r.text))) {
        let o = r;
        r.text.length == i[0].length ? this.content.pop() : this.content[this.content.length - 1] = o.withText(o.text.slice(0, o.text.length - i[0].length));
      }
    }
    let t = C.from(this.content);
    return !e && this.match && (t = t.append(this.match.fillBefore(C.empty, !0))), this.type ? this.type.create(this.attrs, t, this.marks) : t;
  }
  inlineContext(e) {
    return this.type ? this.type.inlineContent : this.content.length ? this.content[0].isInline : e.parentNode && !Vu.hasOwnProperty(e.parentNode.nodeName.toLowerCase());
  }
}
class Aa {
  constructor(e, t, r) {
    this.parser = e, this.options = t, this.isOpen = r, this.open = 0, this.localPreserveWS = !1;
    let i = t.topNode, o, s = Oa(null, t.preserveWhitespace, 0) | (r ? wr : 0);
    i ? o = new xi(i.type, i.attrs, Q.none, !0, t.topMatch || i.type.contentMatch, s) : r ? o = new xi(null, null, Q.none, !0, null, s) : o = new xi(e.schema.topNodeType, null, Q.none, !0, null, s), this.nodes = [o], this.find = t.findPositions, this.needsBlock = !1;
  }
  get top() {
    return this.nodes[this.open];
  }
  // Add a DOM node to the content. Text is inserted as text node,
  // otherwise, the node is passed to `addElement` or, if it has a
  // `style` attribute, `addElementWithStyles`.
  addDOM(e, t) {
    e.nodeType == 3 ? this.addTextNode(e, t) : e.nodeType == 1 && this.addElement(e, t);
  }
  addTextNode(e, t) {
    let r = e.nodeValue, i = this.top, o = i.options & Ws ? "full" : this.localPreserveWS || (i.options & Hr) > 0, { schema: s } = this.parser;
    if (o === "full" || i.inlineContext(e) || /[^ \t\r\n\u000c]/.test(r)) {
      if (o)
        if (o === "full")
          r = r.replace(/\r\n?/g, `
`);
        else if (s.linebreakReplacement && /[\r\n]/.test(r) && this.top.findWrapping(s.linebreakReplacement.create())) {
          let l = r.split(/\r?\n|\r/);
          for (let a = 0; a < l.length; a++)
            a && this.insertNode(s.linebreakReplacement.create(), t, !0), l[a] && this.insertNode(s.text(l[a]), t, !/\S/.test(l[a]));
          r = "";
        } else
          r = r.replace(/\r?\n|\r/g, " ");
      else if (r = r.replace(/[ \t\r\n\u000c]+/g, " "), /^[ \t\r\n\u000c]/.test(r) && this.open == this.nodes.length - 1) {
        let l = i.content[i.content.length - 1], a = e.previousSibling;
        (!l || a && a.nodeName == "BR" || l.isText && /[ \t\r\n\u000c]$/.test(l.text)) && (r = r.slice(1));
      }
      r && this.insertNode(s.text(r), t, !/\S/.test(r)), this.findInText(e);
    } else
      this.findInside(e);
  }
  // Try to find a handler for the given tag and use that to parse. If
  // none is found, the element's content nodes are added directly.
  addElement(e, t, r) {
    let i = this.localPreserveWS, o = this.top;
    (e.tagName == "PRE" || /pre/.test(e.style && e.style.whiteSpace)) && (this.localPreserveWS = !0);
    let s = e.nodeName.toLowerCase(), l;
    ju.hasOwnProperty(s) && this.parser.normalizeLists && tp(e);
    let a = this.options.ruleFromNode && this.options.ruleFromNode(e) || (l = this.parser.matchTag(e, this, r));
    e: if (a ? a.ignore : ep.hasOwnProperty(s))
      this.findInside(e), this.ignoreFallback(e, t);
    else if (!a || a.skip || a.closeParent) {
      a && a.closeParent ? this.open = Math.max(0, this.open - 1) : a && a.skip.nodeType && (e = a.skip);
      let c, u = this.needsBlock;
      if (Vu.hasOwnProperty(s))
        o.content.length && o.content[0].isInline && this.open && (this.open--, o = this.top), c = !0, o.type || (this.needsBlock = !0);
      else if (!e.firstChild) {
        this.leafFallback(e, t);
        break e;
      }
      let d = a && a.skip ? t : this.readStyles(e, t);
      d && this.addAll(e, d), c && this.sync(o), this.needsBlock = u;
    } else {
      let c = this.readStyles(e, t);
      c && this.addElementByRule(e, a, c, a.consuming === !1 ? l : void 0);
    }
    this.localPreserveWS = i;
  }
  // Called for leaf DOM nodes that would otherwise be ignored
  leafFallback(e, t) {
    e.nodeName == "BR" && this.top.type && this.top.type.inlineContent && this.addTextNode(e.ownerDocument.createTextNode(`
`), t);
  }
  // Called for ignored nodes
  ignoreFallback(e, t) {
    e.nodeName == "BR" && (!this.top.type || !this.top.type.inlineContent) && this.findPlace(this.parser.schema.text("-"), t, !0);
  }
  // Run any style parser associated with the node's styles. Either
  // return an updated array of marks, or null to indicate some of the
  // styles had a rule with `ignore` set.
  readStyles(e, t) {
    let r = e.style;
    if (r && r.length)
      for (let i = 0; i < this.parser.matchedStyles.length; i++) {
        let o = this.parser.matchedStyles[i], s = r.getPropertyValue(o);
        if (s)
          for (let l = void 0; ; ) {
            let a = this.parser.matchStyle(o, s, this, l);
            if (!a)
              break;
            if (a.ignore)
              return null;
            if (a.clearMark ? t = t.filter((c) => !a.clearMark(c)) : t = t.concat(this.parser.schema.marks[a.mark].create(a.attrs)), a.consuming === !1)
              l = a;
            else
              break;
          }
      }
    return t;
  }
  // Look up a handler for the given node. If none are found, return
  // false. Otherwise, apply it, use its return value to drive the way
  // the node's content is wrapped, and return true.
  addElementByRule(e, t, r, i) {
    let o, s;
    if (t.node)
      if (s = this.parser.schema.nodes[t.node], s.isLeaf)
        this.insertNode(s.create(t.attrs), r, e.nodeName == "BR") || this.leafFallback(e, r);
      else {
        let a = this.enter(s, t.attrs || null, r, t.preserveWhitespace);
        a && (o = !0, r = a);
      }
    else {
      let a = this.parser.schema.marks[t.mark];
      r = r.concat(a.create(t.attrs));
    }
    let l = this.top;
    if (s && s.isLeaf)
      this.findInside(e);
    else if (i)
      this.addElement(e, r, i);
    else if (t.getContent)
      this.findInside(e), t.getContent(e, this.parser.schema).forEach((a) => this.insertNode(a, r, !1));
    else {
      let a = e;
      typeof t.contentElement == "string" ? a = e.querySelector(t.contentElement) : typeof t.contentElement == "function" ? a = t.contentElement(e) : t.contentElement && (a = t.contentElement), this.findAround(e, a, !0), this.addAll(a, r), this.findAround(e, a, !1);
    }
    o && this.sync(l) && this.open--;
  }
  // Add all child nodes between `startIndex` and `endIndex` (or the
  // whole node, if not given). If `sync` is passed, use it to
  // synchronize after every block element.
  addAll(e, t, r, i) {
    let o = r || 0;
    for (let s = r ? e.childNodes[r] : e.firstChild, l = i == null ? null : e.childNodes[i]; s != l; s = s.nextSibling, ++o)
      this.findAtPoint(e, o), this.addDOM(s, t);
    this.findAtPoint(e, o);
  }
  // Try to find a way to fit the given node type into the current
  // context. May add intermediate wrappers and/or leave non-solid
  // nodes that we're in.
  findPlace(e, t, r) {
    let i, o;
    for (let s = this.open, l = 0; s >= 0; s--) {
      let a = this.nodes[s], c = a.findWrapping(e);
      if (c && (!i || i.length > c.length + l) && (i = c, o = a, !c.length))
        break;
      if (a.solid) {
        if (r)
          break;
        l += 2;
      }
    }
    if (!i)
      return null;
    this.sync(o);
    for (let s = 0; s < i.length; s++)
      t = this.enterInner(i[s], null, t, !1);
    return t;
  }
  // Try to insert the given node, adjusting the context when needed.
  insertNode(e, t, r) {
    if (e.isInline && this.needsBlock && !this.top.type) {
      let o = this.textblockFromContext();
      o && (t = this.enterInner(o, null, t));
    }
    let i = this.findPlace(e, t, r);
    if (i) {
      this.closeExtra();
      let o = this.top;
      o.match && (o.match = o.match.matchType(e.type));
      let s = Q.none;
      for (let l of i.concat(e.marks))
        (o.type ? o.type.allowsMarkType(l.type) : Da(l.type, e.type)) && (s = l.addToSet(s));
      return o.content.push(e.mark(s)), !0;
    }
    return !1;
  }
  // Try to start a node of the given type, adjusting the context when
  // necessary.
  enter(e, t, r, i) {
    let o = this.findPlace(e.create(t), r, !1);
    return o && (o = this.enterInner(e, t, r, !0, i)), o;
  }
  // Open a node of the given type
  enterInner(e, t, r, i = !1, o) {
    this.closeExtra();
    let s = this.top;
    s.match = s.match && s.match.matchType(e);
    let l = Oa(e, o, s.options);
    s.options & wr && s.content.length == 0 && (l |= wr);
    let a = Q.none;
    return r = r.filter((c) => (s.type ? s.type.allowsMarkType(c.type) : Da(c.type, e)) ? (a = c.addToSet(a), !1) : !0), this.nodes.push(new xi(e, t, a, i, null, l)), this.open++, r;
  }
  // Make sure all nodes above this.open are finished and added to
  // their parents
  closeExtra(e = !1) {
    let t = this.nodes.length - 1;
    if (t > this.open) {
      for (; t > this.open; t--)
        this.nodes[t - 1].content.push(this.nodes[t].finish(e));
      this.nodes.length = this.open + 1;
    }
  }
  finish() {
    return this.open = 0, this.closeExtra(this.isOpen), this.nodes[0].finish(!!(this.isOpen || this.options.topOpen));
  }
  sync(e) {
    for (let t = this.open; t >= 0; t--) {
      if (this.nodes[t] == e)
        return this.open = t, !0;
      this.localPreserveWS && (this.nodes[t].options |= Hr);
    }
    return !1;
  }
  get currentPos() {
    this.closeExtra();
    let e = 0;
    for (let t = this.open; t >= 0; t--) {
      let r = this.nodes[t].content;
      for (let i = r.length - 1; i >= 0; i--)
        e += r[i].nodeSize;
      t && e++;
    }
    return e;
  }
  findAtPoint(e, t) {
    if (this.find)
      for (let r = 0; r < this.find.length; r++)
        this.find[r].node == e && this.find[r].offset == t && (this.find[r].pos = this.currentPos);
  }
  findInside(e) {
    if (this.find)
      for (let t = 0; t < this.find.length; t++)
        this.find[t].pos == null && e.nodeType == 1 && e.contains(this.find[t].node) && (this.find[t].pos = this.currentPos);
  }
  findAround(e, t, r) {
    if (e != t && this.find)
      for (let i = 0; i < this.find.length; i++)
        this.find[i].pos == null && e.nodeType == 1 && e.contains(this.find[i].node) && t.compareDocumentPosition(this.find[i].node) & (r ? 2 : 4) && (this.find[i].pos = this.currentPos);
  }
  findInText(e) {
    if (this.find)
      for (let t = 0; t < this.find.length; t++)
        this.find[t].node == e && (this.find[t].pos = this.currentPos - (e.nodeValue.length - this.find[t].offset));
  }
  // Determines whether the given context string matches this context.
  matchesContext(e) {
    if (e.indexOf("|") > -1)
      return e.split(/\s*\|\s*/).some(this.matchesContext, this);
    let t = e.split("/"), r = this.options.context, i = !this.isOpen && (!r || r.parent.type == this.nodes[0].type), o = -(r ? r.depth + 1 : 0) + (i ? 0 : 1), s = (l, a) => {
      for (; l >= 0; l--) {
        let c = t[l];
        if (c == "") {
          if (l == t.length - 1 || l == 0)
            continue;
          for (; a >= o; a--)
            if (s(l - 1, a))
              return !0;
          return !1;
        } else {
          let u = a > 0 || a == 0 && i ? this.nodes[a].type : r && a >= o ? r.node(a - o).type : null;
          if (!u || u.name != c && !u.isInGroup(c))
            return !1;
          a--;
        }
      }
      return !0;
    };
    return s(t.length - 1, this.open);
  }
  textblockFromContext() {
    let e = this.options.context;
    if (e)
      for (let t = e.depth; t >= 0; t--) {
        let r = e.node(t).contentMatchAt(e.indexAfter(t)).defaultType;
        if (r && r.isTextblock && r.defaultAttrs)
          return r;
      }
    for (let t in this.parser.schema.nodes) {
      let r = this.parser.schema.nodes[t];
      if (r.isTextblock && r.defaultAttrs)
        return r;
    }
  }
}
function tp(n) {
  for (let e = n.firstChild, t = null; e; e = e.nextSibling) {
    let r = e.nodeType == 1 ? e.nodeName.toLowerCase() : null;
    r && ju.hasOwnProperty(r) && t ? (t.appendChild(e), e = t) : r == "li" ? t = e : r && (t = null);
  }
}
function np(n, e) {
  return (n.matches || n.msMatchesSelector || n.webkitMatchesSelector || n.mozMatchesSelector).call(n, e);
}
function Na(n) {
  let e = {};
  for (let t in n)
    e[t] = n[t];
  return e;
}
function Da(n, e) {
  let t = e.schema.nodes;
  for (let r in t) {
    let i = t[r];
    if (!i.allowsMarkType(n))
      continue;
    let o = [], s = (l) => {
      o.push(l);
      for (let a = 0; a < l.edgeCount; a++) {
        let { type: c, next: u } = l.edge(a);
        if (c == e || o.indexOf(u) < 0 && s(u))
          return !0;
      }
    };
    if (s(i.contentMatch))
      return !0;
  }
}
class An {
  /**
  Create a serializer. `nodes` should map node names to functions
  that take a node and return a description of the corresponding
  DOM. `marks` does the same for mark names, but also gets an
  argument that tells it whether the mark's content is block or
  inline content (for typical use, it'll always be inline). A mark
  serializer may be `null` to indicate that marks of that type
  should not be serialized.
  */
  constructor(e, t) {
    this.nodes = e, this.marks = t;
  }
  /**
  Serialize the content of this fragment to a DOM fragment. When
  not in the browser, the `document` option, containing a DOM
  document, should be passed so that the serializer can create
  nodes.
  */
  serializeFragment(e, t = {}, r) {
    r || (r = Ci(t).createDocumentFragment());
    let i = r, o = [];
    return e.forEach((s) => {
      if (o.length || s.marks.length) {
        let l = 0, a = 0;
        for (; l < o.length && a < s.marks.length; ) {
          let c = s.marks[a];
          if (!this.marks[c.type.name]) {
            a++;
            continue;
          }
          if (!c.eq(o[l][0]) || c.type.spec.spanning === !1)
            break;
          l++, a++;
        }
        for (; l < o.length; )
          i = o.pop()[1];
        for (; a < s.marks.length; ) {
          let c = s.marks[a++], u = this.serializeMark(c, s.isInline, t);
          u && (o.push([c, i]), i.appendChild(u.dom), i = u.contentDOM || u.dom);
        }
      }
      i.appendChild(this.serializeNodeInner(s, t));
    }), r;
  }
  /**
  @internal
  */
  serializeNodeInner(e, t) {
    if (e.isText)
      return Ci(t).createTextNode(e.text);
    let { dom: r, contentDOM: i } = Wi(Ci(t), this.nodes[e.type.name](e), null, e.attrs);
    if (i) {
      if (e.isLeaf)
        throw new RangeError("Content hole not allowed in a leaf node spec");
      this.serializeFragment(e.content, t, i);
    }
    return r;
  }
  /**
  Serialize this node to a DOM node. This can be useful when you
  need to serialize a part of a document, as opposed to the whole
  document. To serialize a whole document, use
  [`serializeFragment`](https://prosemirror.net/docs/ref/#model.DOMSerializer.serializeFragment) on
  its [content](https://prosemirror.net/docs/ref/#model.Node.content).
  */
  serializeNode(e, t = {}) {
    let r = this.serializeNodeInner(e, t);
    for (let i = e.marks.length - 1; i >= 0; i--) {
      let o = this.serializeMark(e.marks[i], e.isInline, t);
      o && ((o.contentDOM || o.dom).appendChild(r), r = o.dom);
    }
    return r;
  }
  /**
  @internal
  */
  serializeMark(e, t, r = {}) {
    let i = this.marks[e.type.name];
    return i && Wi(Ci(r), i(e, t), null, e.attrs);
  }
  static renderSpec(e, t, r = null, i) {
    return typeof t == "string" ? { dom: e.createTextNode(t) } : Wi(e, t, r, i);
  }
  /**
  Build a serializer using the [`toDOM`](https://prosemirror.net/docs/ref/#model.NodeSpec.toDOM)
  properties in a schema's node and mark specs.
  */
  static fromSchema(e) {
    return e.cached.domSerializer || (e.cached.domSerializer = new An(this.nodesFromSchema(e), this.marksFromSchema(e)));
  }
  /**
  Gather the serializers in a schema's node specs into an object.
  This can be useful as a base to build a custom serializer from.
  */
  static nodesFromSchema(e) {
    let t = Ra(e.nodes);
    return t.text || (t.text = (r) => r.text), t;
  }
  /**
  Gather the serializers in a schema's mark specs into an object.
  */
  static marksFromSchema(e) {
    return Ra(e.marks);
  }
}
function Ra(n) {
  let e = {};
  for (let t in n) {
    let r = n[t].spec.toDOM;
    r && (e[t] = r);
  }
  return e;
}
function Ci(n) {
  return n.document || window.document;
}
const Ia = /* @__PURE__ */ new WeakMap();
function rp(n) {
  let e = Ia.get(n);
  return e === void 0 && Ia.set(n, e = ip(n)), e;
}
function ip(n) {
  let e = null;
  function t(r) {
    if (r && typeof r == "object")
      if (Array.isArray(r))
        if (typeof r[0] == "string")
          e || (e = []), e.push(r);
        else
          for (let i = 0; i < r.length; i++)
            t(r[i]);
      else
        for (let i in r)
          t(r[i]);
  }
  return t(n), e;
}
function Wi(n, e, t, r) {
  if (e.nodeType == 1)
    return { dom: e };
  if (e.dom && e.dom.nodeType == 1)
    return e;
  let i = e[0], o;
  if (typeof i != "string")
    throw new RangeError("Invalid array passed to renderSpec");
  if (r && (o = rp(r)) && o.indexOf(e) > -1)
    throw new RangeError("Using an array from an attribute object as a DOM spec. This may be an attempted cross site scripting attack.");
  let s = i.indexOf(" ");
  s > 0 && (t = i.slice(0, s), i = i.slice(s + 1));
  let l, a = t ? n.createElementNS(t, i) : n.createElement(i), c = e[1], u = 1;
  if (c && typeof c == "object" && c.nodeType == null && !Array.isArray(c)) {
    u = 2;
    for (let d in c)
      if (c[d] != null) {
        let f = d.indexOf(" ");
        f > 0 ? a.setAttributeNS(d.slice(0, f), d.slice(f + 1), c[d]) : d == "style" && a.style ? a.style.cssText = c[d] : a.setAttribute(d, c[d]);
      }
  }
  for (let d = u; d < e.length; d++) {
    let f = e[d];
    if (f === 0) {
      if (d < e.length - 1 || d > u)
        throw new RangeError("Content hole must be the only child of its parent node");
      return { dom: a, contentDOM: a };
    } else if (typeof f == "string")
      a.appendChild(n.createTextNode(f));
    else {
      let { dom: h, contentDOM: p } = Wi(n, f, t, r);
      if (a.appendChild(h), p) {
        if (l)
          throw new RangeError("Multiple content holes");
        l = p;
      }
    }
  }
  return { dom: a, contentDOM: l };
}
const Wu = 65535, _u = Math.pow(2, 16);
function op(n, e) {
  return n + e * _u;
}
function La(n) {
  return n & Wu;
}
function sp(n) {
  return (n - (n & Wu)) / _u;
}
const Uu = 1, Ku = 2, _i = 4, qu = 8;
class _s {
  /**
  @internal
  */
  constructor(e, t, r) {
    this.pos = e, this.delInfo = t, this.recover = r;
  }
  /**
  Tells you whether the position was deleted, that is, whether the
  step removed the token on the side queried (via the `assoc`)
  argument from the document.
  */
  get deleted() {
    return (this.delInfo & qu) > 0;
  }
  /**
  Tells you whether the token before the mapped position was deleted.
  */
  get deletedBefore() {
    return (this.delInfo & (Uu | _i)) > 0;
  }
  /**
  True when the token after the mapped position was deleted.
  */
  get deletedAfter() {
    return (this.delInfo & (Ku | _i)) > 0;
  }
  /**
  Tells whether any of the steps mapped through deletes across the
  position (including both the token before and after the
  position).
  */
  get deletedAcross() {
    return (this.delInfo & _i) > 0;
  }
}
class Ve {
  /**
  Create a position map. The modifications to the document are
  represented as an array of numbers, in which each group of three
  represents a modified chunk as `[start, oldSize, newSize]`.
  */
  constructor(e, t = !1) {
    if (this.ranges = e, this.inverted = t, !e.length && Ve.empty)
      return Ve.empty;
  }
  /**
  @internal
  */
  recover(e) {
    let t = 0, r = La(e);
    if (!this.inverted)
      for (let i = 0; i < r; i++)
        t += this.ranges[i * 3 + 2] - this.ranges[i * 3 + 1];
    return this.ranges[r * 3] + t + sp(e);
  }
  mapResult(e, t = 1) {
    return this._map(e, t, !1);
  }
  map(e, t = 1) {
    return this._map(e, t, !0);
  }
  /**
  @internal
  */
  _map(e, t, r) {
    let i = 0, o = this.inverted ? 2 : 1, s = this.inverted ? 1 : 2;
    for (let l = 0; l < this.ranges.length; l += 3) {
      let a = this.ranges[l] - (this.inverted ? i : 0);
      if (a > e)
        break;
      let c = this.ranges[l + o], u = this.ranges[l + s], d = a + c;
      if (e <= d) {
        let f = c ? e == a ? -1 : e == d ? 1 : t : t, h = a + i + (f < 0 ? 0 : u);
        if (r)
          return h;
        let p = e == (t < 0 ? a : d) ? null : op(l / 3, e - a), m = e == a ? Ku : e == d ? Uu : _i;
        return (t < 0 ? e != a : e != d) && (m |= qu), new _s(h, m, p);
      }
      i += u - c;
    }
    return r ? e + i : new _s(e + i, 0, null);
  }
  /**
  @internal
  */
  touches(e, t) {
    let r = 0, i = La(t), o = this.inverted ? 2 : 1, s = this.inverted ? 1 : 2;
    for (let l = 0; l < this.ranges.length; l += 3) {
      let a = this.ranges[l] - (this.inverted ? r : 0);
      if (a > e)
        break;
      let c = this.ranges[l + o], u = a + c;
      if (e <= u && l == i * 3)
        return !0;
      r += this.ranges[l + s] - c;
    }
    return !1;
  }
  /**
  Calls the given function on each of the changed ranges included in
  this map.
  */
  forEach(e) {
    let t = this.inverted ? 2 : 1, r = this.inverted ? 1 : 2;
    for (let i = 0, o = 0; i < this.ranges.length; i += 3) {
      let s = this.ranges[i], l = s - (this.inverted ? o : 0), a = s + (this.inverted ? 0 : o), c = this.ranges[i + t], u = this.ranges[i + r];
      e(l, l + c, a, a + u), o += u - c;
    }
  }
  /**
  Create an inverted version of this map. The result can be used to
  map positions in the post-step document to the pre-step document.
  */
  invert() {
    return new Ve(this.ranges, !this.inverted);
  }
  /**
  @internal
  */
  toString() {
    return (this.inverted ? "-" : "") + JSON.stringify(this.ranges);
  }
  /**
  Create a map that moves all positions by offset `n` (which may be
  negative). This can be useful when applying steps meant for a
  sub-document to a larger document, or vice-versa.
  */
  static offset(e) {
    return e == 0 ? Ve.empty : new Ve(e < 0 ? [0, -e, 0] : [0, 0, e]);
  }
}
Ve.empty = new Ve([]);
class zr {
  /**
  Create a new mapping with the given position maps.
  */
  constructor(e, t, r = 0, i = e ? e.length : 0) {
    this.mirror = t, this.from = r, this.to = i, this._maps = e || [], this.ownData = !(e || t);
  }
  /**
  The step maps in this mapping.
  */
  get maps() {
    return this._maps;
  }
  /**
  Create a mapping that maps only through a part of this one.
  */
  slice(e = 0, t = this.maps.length) {
    return new zr(this._maps, this.mirror, e, t);
  }
  /**
  Add a step map to the end of this mapping. If `mirrors` is
  given, it should be the index of the step map that is the mirror
  image of this one.
  */
  appendMap(e, t) {
    this.ownData || (this._maps = this._maps.slice(), this.mirror = this.mirror && this.mirror.slice(), this.ownData = !0), this.to = this._maps.push(e), t != null && this.setMirror(this._maps.length - 1, t);
  }
  /**
  Add all the step maps in a given mapping to this one (preserving
  mirroring information).
  */
  appendMapping(e) {
    for (let t = 0, r = this._maps.length; t < e._maps.length; t++) {
      let i = e.getMirror(t);
      this.appendMap(e._maps[t], i != null && i < t ? r + i : void 0);
    }
  }
  /**
  Finds the offset of the step map that mirrors the map at the
  given offset, in this mapping (as per the second argument to
  `appendMap`).
  */
  getMirror(e) {
    if (this.mirror) {
      for (let t = 0; t < this.mirror.length; t++)
        if (this.mirror[t] == e)
          return this.mirror[t + (t % 2 ? -1 : 1)];
    }
  }
  /**
  @internal
  */
  setMirror(e, t) {
    this.mirror || (this.mirror = []), this.mirror.push(e, t);
  }
  /**
  Append the inverse of the given mapping to this one.
  */
  appendMappingInverted(e) {
    for (let t = e.maps.length - 1, r = this._maps.length + e._maps.length; t >= 0; t--) {
      let i = e.getMirror(t);
      this.appendMap(e._maps[t].invert(), i != null && i > t ? r - i - 1 : void 0);
    }
  }
  /**
  Create an inverted version of this mapping.
  */
  invert() {
    let e = new zr();
    return e.appendMappingInverted(this), e;
  }
  /**
  Map a position through this mapping.
  */
  map(e, t = 1) {
    if (this.mirror)
      return this._map(e, t, !0);
    for (let r = this.from; r < this.to; r++)
      e = this._maps[r].map(e, t);
    return e;
  }
  /**
  Map a position through this mapping, returning a mapping
  result.
  */
  mapResult(e, t = 1) {
    return this._map(e, t, !1);
  }
  /**
  @internal
  */
  _map(e, t, r) {
    let i = 0;
    for (let o = this.from; o < this.to; o++) {
      let s = this._maps[o], l = s.mapResult(e, t);
      if (l.recover != null) {
        let a = this.getMirror(o);
        if (a != null && a > o && a < this.to) {
          o = a, e = this._maps[a].recover(l.recover);
          continue;
        }
      }
      i |= l.delInfo, e = l.pos;
    }
    return r ? e : new _s(e, i, null);
  }
}
const as = /* @__PURE__ */ Object.create(null);
class Ae {
  /**
  Get the step map that represents the changes made by this step,
  and which can be used to transform between positions in the old
  and the new document.
  */
  getMap() {
    return Ve.empty;
  }
  /**
  Try to merge this step with another one, to be applied directly
  after it. Returns the merged step when possible, null if the
  steps can't be merged.
  */
  merge(e) {
    return null;
  }
  /**
  Deserialize a step from its JSON representation. Will call
  through to the step class' own implementation of this method.
  */
  static fromJSON(e, t) {
    if (!t || !t.stepType)
      throw new RangeError("Invalid input for Step.fromJSON");
    let r = as[t.stepType];
    if (!r)
      throw new RangeError(`No step type ${t.stepType} defined`);
    return r.fromJSON(e, t);
  }
  /**
  To be able to serialize steps to JSON, each step needs a string
  ID to attach to its JSON representation. Use this method to
  register an ID for your step classes. Try to pick something
  that's unlikely to clash with steps from other modules.
  */
  static jsonID(e, t) {
    if (e in as)
      throw new RangeError("Duplicate use of step JSON ID " + e);
    return as[e] = t, t.prototype.jsonID = e, t;
  }
}
class he {
  /**
  @internal
  */
  constructor(e, t) {
    this.doc = e, this.failed = t;
  }
  /**
  Create a successful step result.
  */
  static ok(e) {
    return new he(e, null);
  }
  /**
  Create a failed step result.
  */
  static fail(e) {
    return new he(null, e);
  }
  /**
  Call [`Node.replace`](https://prosemirror.net/docs/ref/#model.Node.replace) with the given
  arguments. Create a successful result if it succeeds, and a
  failed one if it throws a `ReplaceError`.
  */
  static fromReplace(e, t, r, i) {
    try {
      return he.ok(e.replace(t, r, i));
    } catch (o) {
      if (o instanceof Pr)
        return he.fail(o.message);
      throw o;
    }
  }
}
function Al(n, e, t) {
  let r = [];
  for (let i = 0; i < n.childCount; i++) {
    let o = n.child(i);
    o.content.size && (o = o.copy(Al(o.content, e, o))), o.isInline && (o = e(o, t, i)), r.push(o);
  }
  return C.fromArray(r);
}
class Kt extends Ae {
  /**
  Create a mark step.
  */
  constructor(e, t, r) {
    super(), this.from = e, this.to = t, this.mark = r;
  }
  apply(e) {
    let t = e.slice(this.from, this.to), r = e.resolve(this.from), i = r.node(r.sharedDepth(this.to)), o = new A(Al(t.content, (s, l) => !s.isAtom || !l.type.allowsMarkType(this.mark.type) ? s : s.mark(this.mark.addToSet(s.marks)), i), t.openStart, t.openEnd);
    return he.fromReplace(e, this.from, this.to, o);
  }
  invert() {
    return new ft(this.from, this.to, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return t.deleted && r.deleted || t.pos >= r.pos ? null : new Kt(t.pos, r.pos, this.mark);
  }
  merge(e) {
    return e instanceof Kt && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from ? new Kt(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark) : null;
  }
  toJSON() {
    return {
      stepType: "addMark",
      mark: this.mark.toJSON(),
      from: this.from,
      to: this.to
    };
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number")
      throw new RangeError("Invalid input for AddMarkStep.fromJSON");
    return new Kt(t.from, t.to, e.markFromJSON(t.mark));
  }
}
Ae.jsonID("addMark", Kt);
class ft extends Ae {
  /**
  Create a mark-removing step.
  */
  constructor(e, t, r) {
    super(), this.from = e, this.to = t, this.mark = r;
  }
  apply(e) {
    let t = e.slice(this.from, this.to), r = new A(Al(t.content, (i) => i.mark(this.mark.removeFromSet(i.marks)), e), t.openStart, t.openEnd);
    return he.fromReplace(e, this.from, this.to, r);
  }
  invert() {
    return new Kt(this.from, this.to, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return t.deleted && r.deleted || t.pos >= r.pos ? null : new ft(t.pos, r.pos, this.mark);
  }
  merge(e) {
    return e instanceof ft && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from ? new ft(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark) : null;
  }
  toJSON() {
    return {
      stepType: "removeMark",
      mark: this.mark.toJSON(),
      from: this.from,
      to: this.to
    };
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number")
      throw new RangeError("Invalid input for RemoveMarkStep.fromJSON");
    return new ft(t.from, t.to, e.markFromJSON(t.mark));
  }
}
Ae.jsonID("removeMark", ft);
class qt extends Ae {
  /**
  Create a node mark step.
  */
  constructor(e, t) {
    super(), this.pos = e, this.mark = t;
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t)
      return he.fail("No node at mark step's position");
    let r = t.type.create(t.attrs, null, this.mark.addToSet(t.marks));
    return he.fromReplace(e, this.pos, this.pos + 1, new A(C.from(r), 0, t.isLeaf ? 0 : 1));
  }
  invert(e) {
    let t = e.nodeAt(this.pos);
    if (t) {
      let r = this.mark.addToSet(t.marks);
      if (r.length == t.marks.length) {
        for (let i = 0; i < t.marks.length; i++)
          if (!t.marks[i].isInSet(r))
            return new qt(this.pos, t.marks[i]);
        return new qt(this.pos, this.mark);
      }
    }
    return new xn(this.pos, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new qt(t.pos, this.mark);
  }
  toJSON() {
    return { stepType: "addNodeMark", pos: this.pos, mark: this.mark.toJSON() };
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.pos != "number")
      throw new RangeError("Invalid input for AddNodeMarkStep.fromJSON");
    return new qt(t.pos, e.markFromJSON(t.mark));
  }
}
Ae.jsonID("addNodeMark", qt);
class xn extends Ae {
  /**
  Create a mark-removing step.
  */
  constructor(e, t) {
    super(), this.pos = e, this.mark = t;
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t)
      return he.fail("No node at mark step's position");
    let r = t.type.create(t.attrs, null, this.mark.removeFromSet(t.marks));
    return he.fromReplace(e, this.pos, this.pos + 1, new A(C.from(r), 0, t.isLeaf ? 0 : 1));
  }
  invert(e) {
    let t = e.nodeAt(this.pos);
    return !t || !this.mark.isInSet(t.marks) ? this : new qt(this.pos, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new xn(t.pos, this.mark);
  }
  toJSON() {
    return { stepType: "removeNodeMark", pos: this.pos, mark: this.mark.toJSON() };
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.pos != "number")
      throw new RangeError("Invalid input for RemoveNodeMarkStep.fromJSON");
    return new xn(t.pos, e.markFromJSON(t.mark));
  }
}
Ae.jsonID("removeNodeMark", xn);
class fe extends Ae {
  /**
  The given `slice` should fit the 'gap' between `from` and
  `to`—the depths must line up, and the surrounding nodes must be
  able to be joined with the open sides of the slice. When
  `structure` is true, the step will fail if the content between
  from and to is not just a sequence of closing and then opening
  tokens (this is to guard against rebased replace steps
  overwriting something they weren't supposed to).
  */
  constructor(e, t, r, i = !1) {
    super(), this.from = e, this.to = t, this.slice = r, this.structure = i;
  }
  apply(e) {
    return this.structure && Us(e, this.from, this.to) ? he.fail("Structure replace would overwrite content") : he.fromReplace(e, this.from, this.to, this.slice);
  }
  getMap() {
    return new Ve([this.from, this.to - this.from, this.slice.size]);
  }
  invert(e) {
    return new fe(this.from, this.from + this.slice.size, e.slice(this.from, this.to));
  }
  map(e) {
    let t = e.mapResult(this.to, -1), r = this.from == this.to && fe.MAP_BIAS < 0 ? t : e.mapResult(this.from, 1);
    return r.deletedAcross && t.deletedAcross ? null : new fe(r.pos, Math.max(r.pos, t.pos), this.slice, this.structure);
  }
  merge(e) {
    if (!(e instanceof fe) || e.structure || this.structure)
      return null;
    if (this.from + this.slice.size == e.from && !this.slice.openEnd && !e.slice.openStart) {
      let t = this.slice.size + e.slice.size == 0 ? A.empty : new A(this.slice.content.append(e.slice.content), this.slice.openStart, e.slice.openEnd);
      return new fe(this.from, this.to + (e.to - e.from), t, this.structure);
    } else if (e.to == this.from && !this.slice.openStart && !e.slice.openEnd) {
      let t = this.slice.size + e.slice.size == 0 ? A.empty : new A(e.slice.content.append(this.slice.content), e.slice.openStart, this.slice.openEnd);
      return new fe(e.from, this.to, t, this.structure);
    } else
      return null;
  }
  toJSON() {
    let e = { stepType: "replace", from: this.from, to: this.to };
    return this.slice.size && (e.slice = this.slice.toJSON()), this.structure && (e.structure = !0), e;
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number")
      throw new RangeError("Invalid input for ReplaceStep.fromJSON");
    return new fe(t.from, t.to, A.fromJSON(e, t.slice), !!t.structure);
  }
}
fe.MAP_BIAS = 1;
Ae.jsonID("replace", fe);
class ye extends Ae {
  /**
  Create a replace-around step with the given range and gap.
  `insert` should be the point in the slice into which the content
  of the gap should be moved. `structure` has the same meaning as
  it has in the [`ReplaceStep`](https://prosemirror.net/docs/ref/#transform.ReplaceStep) class.
  */
  constructor(e, t, r, i, o, s, l = !1) {
    super(), this.from = e, this.to = t, this.gapFrom = r, this.gapTo = i, this.slice = o, this.insert = s, this.structure = l;
  }
  apply(e) {
    if (this.structure && (Us(e, this.from, this.gapFrom) || Us(e, this.gapTo, this.to)))
      return he.fail("Structure gap-replace would overwrite content");
    let t = e.slice(this.gapFrom, this.gapTo);
    if (t.openStart || t.openEnd)
      return he.fail("Gap is not a flat range");
    let r = this.slice.insertAt(this.insert, t.content);
    return r ? he.fromReplace(e, this.from, this.to, r) : he.fail("Content does not fit in gap");
  }
  getMap() {
    return new Ve([
      this.from,
      this.gapFrom - this.from,
      this.insert,
      this.gapTo,
      this.to - this.gapTo,
      this.slice.size - this.insert
    ]);
  }
  invert(e) {
    let t = this.gapTo - this.gapFrom;
    return new ye(this.from, this.from + this.slice.size + t, this.from + this.insert, this.from + this.insert + t, e.slice(this.from, this.to).removeBetween(this.gapFrom - this.from, this.gapTo - this.from), this.gapFrom - this.from, this.structure);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1), i = this.from == this.gapFrom ? t.pos : e.map(this.gapFrom, -1), o = this.to == this.gapTo ? r.pos : e.map(this.gapTo, 1);
    return t.deletedAcross && r.deletedAcross || i < t.pos || o > r.pos ? null : new ye(t.pos, r.pos, i, o, this.slice, this.insert, this.structure);
  }
  toJSON() {
    let e = {
      stepType: "replaceAround",
      from: this.from,
      to: this.to,
      gapFrom: this.gapFrom,
      gapTo: this.gapTo,
      insert: this.insert
    };
    return this.slice.size && (e.slice = this.slice.toJSON()), this.structure && (e.structure = !0), e;
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number" || typeof t.gapFrom != "number" || typeof t.gapTo != "number" || typeof t.insert != "number")
      throw new RangeError("Invalid input for ReplaceAroundStep.fromJSON");
    return new ye(t.from, t.to, t.gapFrom, t.gapTo, A.fromJSON(e, t.slice), t.insert, !!t.structure);
  }
}
Ae.jsonID("replaceAround", ye);
function Us(n, e, t) {
  let r = n.resolve(e), i = t - e, o = r.depth;
  for (; i > 0 && o > 0 && r.indexAfter(o) == r.node(o).childCount; )
    o--, i--;
  if (i > 0) {
    let s = r.node(o).maybeChild(r.indexAfter(o));
    for (; i > 0; ) {
      if (!s || s.isLeaf)
        return !0;
      s = s.firstChild, i--;
    }
  }
  return !1;
}
function lp(n, e, t, r) {
  let i = [], o = [], s, l;
  n.doc.nodesBetween(e, t, (a, c, u) => {
    if (!a.isInline)
      return;
    let d = a.marks;
    if (!r.isInSet(d) && u.type.allowsMarkType(r.type)) {
      let f = Math.max(c, e), h = Math.min(c + a.nodeSize, t), p = r.addToSet(d);
      for (let m = 0; m < d.length; m++)
        d[m].isInSet(p) || (s && s.to == f && s.mark.eq(d[m]) ? s.to = h : i.push(s = new ft(f, h, d[m])));
      l && l.to == f ? l.to = h : o.push(l = new Kt(f, h, r));
    }
  }), i.forEach((a) => n.step(a)), o.forEach((a) => n.step(a));
}
function ap(n, e, t, r) {
  let i = [], o = 0;
  n.doc.nodesBetween(e, t, (s, l) => {
    if (!s.isInline)
      return;
    o++;
    let a = null;
    if (r instanceof jo) {
      let c = s.marks, u;
      for (; u = r.isInSet(c); )
        (a || (a = [])).push(u), c = u.removeFromSet(c);
    } else r ? r.isInSet(s.marks) && (a = [r]) : a = s.marks;
    if (a && a.length) {
      let c = Math.min(l + s.nodeSize, t);
      for (let u = 0; u < a.length; u++) {
        let d = a[u], f;
        for (let h = 0; h < i.length; h++) {
          let p = i[h];
          p.step == o - 1 && d.eq(i[h].style) && (f = p);
        }
        f ? (f.to = c, f.step = o) : i.push({ style: d, from: Math.max(l, e), to: c, step: o });
      }
    }
  }), i.forEach((s) => n.step(new ft(s.from, s.to, s.style)));
}
function Nl(n, e, t, r = t.contentMatch, i = !0) {
  let o = n.doc.nodeAt(e), s = [], l = e + 1;
  for (let a = 0; a < o.childCount; a++) {
    let c = o.child(a), u = l + c.nodeSize, d = r.matchType(c.type);
    if (!d)
      s.push(new fe(l, u, A.empty));
    else {
      r = d;
      for (let f = 0; f < c.marks.length; f++)
        t.allowsMarkType(c.marks[f].type) || n.step(new ft(l, u, c.marks[f]));
      if (i && c.isText && t.whitespace != "pre") {
        let f, h = /\r?\n|\r/g, p;
        for (; f = h.exec(c.text); )
          p || (p = new A(C.from(t.schema.text(" ", t.allowedMarks(c.marks))), 0, 0)), s.push(new fe(l + f.index, l + f.index + f[0].length, p));
      }
    }
    l = u;
  }
  if (!r.validEnd) {
    let a = r.fillBefore(C.empty, !0);
    n.replace(l, l, new A(a, 0, 0));
  }
  for (let a = s.length - 1; a >= 0; a--)
    n.step(s[a]);
}
function cp(n, e, t) {
  return (e == 0 || n.canReplace(e, n.childCount)) && (t == n.childCount || n.canReplace(0, t));
}
function rr(n) {
  let t = n.parent.content.cutByIndex(n.startIndex, n.endIndex);
  for (let r = n.depth, i = 0, o = 0; ; --r) {
    let s = n.$from.node(r), l = n.$from.index(r) + i, a = n.$to.indexAfter(r) - o;
    if (r < n.depth && s.canReplace(l, a, t))
      return r;
    if (r == 0 || s.type.spec.isolating || !cp(s, l, a))
      break;
    l && (i = 1), a < s.childCount && (o = 1);
  }
  return null;
}
function up(n, e, t) {
  let { $from: r, $to: i, depth: o } = e, s = r.before(o + 1), l = i.after(o + 1), a = s, c = l, u = C.empty, d = 0;
  for (let p = o, m = !1; p > t; p--)
    m || r.index(p) > 0 ? (m = !0, u = C.from(r.node(p).copy(u)), d++) : a--;
  let f = C.empty, h = 0;
  for (let p = o, m = !1; p > t; p--)
    m || i.after(p + 1) < i.end(p) ? (m = !0, f = C.from(i.node(p).copy(f)), h++) : c++;
  n.step(new ye(a, c, s, l, new A(u.append(f), d, h), u.size - d, !0));
}
function Dl(n, e, t = null, r = n) {
  let i = dp(n, e), o = i && fp(r, e);
  return o ? i.map(Pa).concat({ type: e, attrs: t }).concat(o.map(Pa)) : null;
}
function Pa(n) {
  return { type: n, attrs: null };
}
function dp(n, e) {
  let { parent: t, startIndex: r, endIndex: i } = n, o = t.contentMatchAt(r).findWrapping(e);
  if (!o)
    return null;
  let s = o.length ? o[0] : e;
  return t.canReplaceWith(r, i, s) ? o : null;
}
function fp(n, e) {
  let { parent: t, startIndex: r, endIndex: i } = n, o = t.child(r), s = e.contentMatch.findWrapping(o.type);
  if (!s)
    return null;
  let a = (s.length ? s[s.length - 1] : e).contentMatch;
  for (let c = r; a && c < i; c++)
    a = a.matchType(t.child(c).type);
  return !a || !a.validEnd ? null : s;
}
function hp(n, e, t) {
  let r = C.empty;
  for (let s = t.length - 1; s >= 0; s--) {
    if (r.size) {
      let l = t[s].type.contentMatch.matchFragment(r);
      if (!l || !l.validEnd)
        throw new RangeError("Wrapper type given to Transform.wrap does not form valid content of its parent wrapper");
    }
    r = C.from(t[s].type.create(t[s].attrs, r));
  }
  let i = e.start, o = e.end;
  n.step(new ye(i, o, i, o, new A(r, 0, 0), t.length, !0));
}
function pp(n, e, t, r, i) {
  if (!r.isTextblock)
    throw new RangeError("Type given to setBlockType should be a textblock");
  let o = n.steps.length;
  n.doc.nodesBetween(e, t, (s, l) => {
    let a = typeof i == "function" ? i(s) : i;
    if (s.isTextblock && !s.hasMarkup(r, a) && mp(n.doc, n.mapping.slice(o).map(l), r)) {
      let c = null;
      if (r.schema.linebreakReplacement) {
        let h = r.whitespace == "pre", p = !!r.contentMatch.matchType(r.schema.linebreakReplacement);
        h && !p ? c = !1 : !h && p && (c = !0);
      }
      c === !1 && Gu(n, s, l, o), Nl(n, n.mapping.slice(o).map(l, 1), r, void 0, c === null);
      let u = n.mapping.slice(o), d = u.map(l, 1), f = u.map(l + s.nodeSize, 1);
      return n.step(new ye(d, f, d + 1, f - 1, new A(C.from(r.create(a, null, s.marks)), 0, 0), 1, !0)), c === !0 && Ju(n, s, l, o), !1;
    }
  });
}
function Ju(n, e, t, r) {
  e.forEach((i, o) => {
    if (i.isText) {
      let s, l = /\r?\n|\r/g;
      for (; s = l.exec(i.text); ) {
        let a = n.mapping.slice(r).map(t + 1 + o + s.index);
        n.replaceWith(a, a + 1, e.type.schema.linebreakReplacement.create());
      }
    }
  });
}
function Gu(n, e, t, r) {
  e.forEach((i, o) => {
    if (i.type == i.type.schema.linebreakReplacement) {
      let s = n.mapping.slice(r).map(t + 1 + o);
      n.replaceWith(s, s + 1, e.type.schema.text(`
`));
    }
  });
}
function mp(n, e, t) {
  let r = n.resolve(e), i = r.index();
  return r.parent.canReplaceWith(i, i + 1, t);
}
function gp(n, e, t, r, i) {
  let o = n.doc.nodeAt(e);
  if (!o)
    throw new RangeError("No node at given position");
  t || (t = o.type);
  let s = t.create(r, null, i || o.marks);
  if (o.isLeaf)
    return n.replaceWith(e, e + o.nodeSize, s);
  if (!t.validContent(o.content))
    throw new RangeError("Invalid content for node type " + t.name);
  n.step(new ye(e, e + o.nodeSize, e + 1, e + o.nodeSize - 1, new A(C.from(s), 0, 0), 1, !0));
}
function Lt(n, e, t = 1, r) {
  let i = n.resolve(e), o = i.depth - t, s = r && r[r.length - 1] || i.parent;
  if (o < 0 || i.parent.type.spec.isolating || !i.parent.canReplace(i.index(), i.parent.childCount) || !s.type.validContent(i.parent.content.cutByIndex(i.index(), i.parent.childCount)))
    return !1;
  for (let c = i.depth - 1, u = t - 2; c > o; c--, u--) {
    let d = i.node(c), f = i.index(c);
    if (d.type.spec.isolating)
      return !1;
    let h = d.content.cutByIndex(f, d.childCount), p = r && r[u + 1];
    p && (h = h.replaceChild(0, p.type.create(p.attrs)));
    let m = r && r[u] || d;
    if (!d.canReplace(f + 1, d.childCount) || !m.type.validContent(h))
      return !1;
  }
  let l = i.indexAfter(o), a = r && r[0];
  return i.node(o).canReplaceWith(l, l, a ? a.type : i.node(o + 1).type);
}
function yp(n, e, t = 1, r) {
  let i = n.doc.resolve(e), o = C.empty, s = C.empty;
  for (let l = i.depth, a = i.depth - t, c = t - 1; l > a; l--, c--) {
    o = C.from(i.node(l).copy(o));
    let u = r && r[c];
    s = C.from(u ? u.type.create(u.attrs, s) : i.node(l).copy(s));
  }
  n.step(new fe(e, e, new A(o.append(s), t, t), !0));
}
function en(n, e) {
  let t = n.resolve(e), r = t.index();
  return Yu(t.nodeBefore, t.nodeAfter) && t.parent.canReplace(r, r + 1);
}
function bp(n, e) {
  e.content.size || n.type.compatibleContent(e.type);
  let t = n.contentMatchAt(n.childCount), { linebreakReplacement: r } = n.type.schema;
  for (let i = 0; i < e.childCount; i++) {
    let o = e.child(i), s = o.type == r ? n.type.schema.nodes.text : o.type;
    if (t = t.matchType(s), !t || !n.type.allowsMarks(o.marks))
      return !1;
  }
  return t.validEnd;
}
function Yu(n, e) {
  return !!(n && e && !n.isLeaf && bp(n, e));
}
function Wo(n, e, t = -1) {
  let r = n.resolve(e);
  for (let i = r.depth; ; i--) {
    let o, s, l = r.index(i);
    if (i == r.depth ? (o = r.nodeBefore, s = r.nodeAfter) : t > 0 ? (o = r.node(i + 1), l++, s = r.node(i).maybeChild(l)) : (o = r.node(i).maybeChild(l - 1), s = r.node(i + 1)), o && !o.isTextblock && Yu(o, s) && r.node(i).canReplace(l, l + 1))
      return e;
    if (i == 0)
      break;
    e = t < 0 ? r.before(i) : r.after(i);
  }
}
function vp(n, e, t) {
  let r = null, { linebreakReplacement: i } = n.doc.type.schema, o = n.doc.resolve(e - t), s = o.node().type;
  if (i && s.inlineContent) {
    let u = s.whitespace == "pre", d = !!s.contentMatch.matchType(i);
    u && !d ? r = !1 : !u && d && (r = !0);
  }
  let l = n.steps.length;
  if (r === !1) {
    let u = n.doc.resolve(e + t);
    Gu(n, u.node(), u.before(), l);
  }
  s.inlineContent && Nl(n, e + t - 1, s, o.node().contentMatchAt(o.index()), r == null);
  let a = n.mapping.slice(l), c = a.map(e - t);
  if (n.step(new fe(c, a.map(e + t, -1), A.empty, !0)), r === !0) {
    let u = n.doc.resolve(c);
    Ju(n, u.node(), u.before(), n.steps.length);
  }
  return n;
}
function wp(n, e, t) {
  let r = n.resolve(e);
  if (r.parent.canReplaceWith(r.index(), r.index(), t))
    return e;
  if (r.parentOffset == 0)
    for (let i = r.depth - 1; i >= 0; i--) {
      let o = r.index(i);
      if (r.node(i).canReplaceWith(o, o, t))
        return r.before(i + 1);
      if (o > 0)
        return null;
    }
  if (r.parentOffset == r.parent.content.size)
    for (let i = r.depth - 1; i >= 0; i--) {
      let o = r.indexAfter(i);
      if (r.node(i).canReplaceWith(o, o, t))
        return r.after(i + 1);
      if (o < r.node(i).childCount)
        return null;
    }
  return null;
}
function Xu(n, e, t) {
  let r = n.resolve(e);
  if (!t.content.size)
    return e;
  let i = t.content;
  for (let o = 0; o < t.openStart; o++)
    i = i.firstChild.content;
  for (let o = 1; o <= (t.openStart == 0 && t.size ? 2 : 1); o++)
    for (let s = r.depth; s >= 0; s--) {
      let l = s == r.depth ? 0 : r.pos <= (r.start(s + 1) + r.end(s + 1)) / 2 ? -1 : 1, a = r.index(s) + (l > 0 ? 1 : 0), c = r.node(s), u = !1;
      if (o == 1)
        u = c.canReplace(a, a, i);
      else {
        let d = c.contentMatchAt(a).findWrapping(i.firstChild.type);
        u = d && c.canReplaceWith(a, a, d[0]);
      }
      if (u)
        return l == 0 ? r.pos : l < 0 ? r.before(s + 1) : r.after(s + 1);
    }
  return null;
}
function _o(n, e, t = e, r = A.empty) {
  if (e == t && !r.size)
    return null;
  let i = n.resolve(e), o = n.resolve(t);
  return Qu(i, o, r) ? new fe(e, t, r) : new kp(i, o, r).fit();
}
function Qu(n, e, t) {
  return !t.openStart && !t.openEnd && n.start() == e.start() && n.parent.canReplace(n.index(), e.index(), t.content);
}
class kp {
  constructor(e, t, r) {
    this.$from = e, this.$to = t, this.unplaced = r, this.frontier = [], this.placed = C.empty;
    for (let i = 0; i <= e.depth; i++) {
      let o = e.node(i);
      this.frontier.push({
        type: o.type,
        match: o.contentMatchAt(e.indexAfter(i))
      });
    }
    for (let i = e.depth; i > 0; i--)
      this.placed = C.from(e.node(i).copy(this.placed));
  }
  get depth() {
    return this.frontier.length - 1;
  }
  fit() {
    for (; this.unplaced.size; ) {
      let c = this.findFittable();
      c ? this.placeNodes(c) : this.openMore() || this.dropNode();
    }
    let e = this.mustMoveInline(), t = this.placed.size - this.depth - this.$from.depth, r = this.$from, i = this.close(e < 0 ? this.$to : r.doc.resolve(e));
    if (!i)
      return null;
    let o = this.placed, s = r.depth, l = i.depth;
    for (; s && l && o.childCount == 1; )
      o = o.firstChild.content, s--, l--;
    let a = new A(o, s, l);
    return e > -1 ? new ye(r.pos, e, this.$to.pos, this.$to.end(), a, t) : a.size || r.pos != this.$to.pos ? new fe(r.pos, i.pos, a) : null;
  }
  // Find a position on the start spine of `this.unplaced` that has
  // content that can be moved somewhere on the frontier. Returns two
  // depths, one for the slice and one for the frontier.
  findFittable() {
    let e = this.unplaced.openStart;
    for (let t = this.unplaced.content, r = 0, i = this.unplaced.openEnd; r < e; r++) {
      let o = t.firstChild;
      if (t.childCount > 1 && (i = 0), o.type.spec.isolating && i <= r) {
        e = r;
        break;
      }
      t = o.content;
    }
    for (let t = 1; t <= 2; t++)
      for (let r = t == 1 ? e : this.unplaced.openStart; r >= 0; r--) {
        let i, o = null;
        r ? (o = cs(this.unplaced.content, r - 1).firstChild, i = o.content) : i = this.unplaced.content;
        let s = i.firstChild;
        for (let l = this.depth; l >= 0; l--) {
          let { type: a, match: c } = this.frontier[l], u, d = null;
          if (t == 1 && (s ? c.matchType(s.type) || (d = c.fillBefore(C.from(s), !1)) : o && a.compatibleContent(o.type)))
            return { sliceDepth: r, frontierDepth: l, parent: o, inject: d };
          if (t == 2 && s && (u = c.findWrapping(s.type)))
            return { sliceDepth: r, frontierDepth: l, parent: o, wrap: u };
          if (o && c.matchType(o.type))
            break;
        }
      }
  }
  openMore() {
    let { content: e, openStart: t, openEnd: r } = this.unplaced, i = cs(e, t);
    return !i.childCount || i.firstChild.isLeaf ? !1 : (this.unplaced = new A(e, t + 1, Math.max(r, i.size + t >= e.size - r ? t + 1 : 0)), !0);
  }
  dropNode() {
    let { content: e, openStart: t, openEnd: r } = this.unplaced, i = cs(e, t);
    if (i.childCount <= 1 && t > 0) {
      let o = e.size - t <= t + i.size;
      this.unplaced = new A(pr(e, t - 1, 1), t - 1, o ? t - 1 : r);
    } else
      this.unplaced = new A(pr(e, t, 1), t, r);
  }
  // Move content from the unplaced slice at `sliceDepth` to the
  // frontier node at `frontierDepth`. Close that frontier node when
  // applicable.
  placeNodes({ sliceDepth: e, frontierDepth: t, parent: r, inject: i, wrap: o }) {
    for (; this.depth > t; )
      this.closeFrontierNode();
    if (o)
      for (let m = 0; m < o.length; m++)
        this.openFrontierNode(o[m]);
    let s = this.unplaced, l = r ? r.content : s.content, a = s.openStart - e, c = 0, u = [], { match: d, type: f } = this.frontier[t];
    if (i) {
      for (let m = 0; m < i.childCount; m++)
        u.push(i.child(m));
      d = d.matchFragment(i);
    }
    let h = l.size + e - (s.content.size - s.openEnd);
    for (; c < l.childCount; ) {
      let m = l.child(c), g = d.matchType(m.type);
      if (!g)
        break;
      c++, (c > 1 || a == 0 || m.content.size) && (d = g, u.push(Zu(m.mark(f.allowedMarks(m.marks)), c == 1 ? a : 0, c == l.childCount ? h : -1)));
    }
    let p = c == l.childCount;
    p || (h = -1), this.placed = mr(this.placed, t, C.from(u)), this.frontier[t].match = d, p && h < 0 && r && r.type == this.frontier[this.depth].type && this.frontier.length > 1 && this.closeFrontierNode();
    for (let m = 0, g = l; m < h; m++) {
      let b = g.lastChild;
      this.frontier.push({ type: b.type, match: b.contentMatchAt(b.childCount) }), g = b.content;
    }
    this.unplaced = p ? e == 0 ? A.empty : new A(pr(s.content, e - 1, 1), e - 1, h < 0 ? s.openEnd : e - 1) : new A(pr(s.content, e, c), s.openStart, s.openEnd);
  }
  mustMoveInline() {
    if (!this.$to.parent.isTextblock)
      return -1;
    let e = this.frontier[this.depth], t;
    if (!e.type.isTextblock || !us(this.$to, this.$to.depth, e.type, e.match, !1) || this.$to.depth == this.depth && (t = this.findCloseLevel(this.$to)) && t.depth == this.depth)
      return -1;
    let { depth: r } = this.$to, i = this.$to.after(r);
    for (; r > 1 && i == this.$to.end(--r); )
      ++i;
    return i;
  }
  findCloseLevel(e) {
    e: for (let t = Math.min(this.depth, e.depth); t >= 0; t--) {
      let { match: r, type: i } = this.frontier[t], o = t < e.depth && e.end(t + 1) == e.pos + (e.depth - (t + 1)), s = us(e, t, i, r, o);
      if (s) {
        for (let l = t - 1; l >= 0; l--) {
          let { match: a, type: c } = this.frontier[l], u = us(e, l, c, a, !0);
          if (!u || u.childCount)
            continue e;
        }
        return { depth: t, fit: s, move: o ? e.doc.resolve(e.after(t + 1)) : e };
      }
    }
  }
  close(e) {
    let t = this.findCloseLevel(e);
    if (!t)
      return null;
    for (; this.depth > t.depth; )
      this.closeFrontierNode();
    t.fit.childCount && (this.placed = mr(this.placed, t.depth, t.fit)), e = t.move;
    for (let r = t.depth + 1; r <= e.depth; r++) {
      let i = e.node(r), o = i.type.contentMatch.fillBefore(i.content, !0, e.index(r));
      this.openFrontierNode(i.type, i.attrs, o);
    }
    return e;
  }
  openFrontierNode(e, t = null, r) {
    let i = this.frontier[this.depth];
    i.match = i.match.matchType(e), this.placed = mr(this.placed, this.depth, C.from(e.create(t, r))), this.frontier.push({ type: e, match: e.contentMatch });
  }
  closeFrontierNode() {
    let t = this.frontier.pop().match.fillBefore(C.empty, !0);
    t.childCount && (this.placed = mr(this.placed, this.frontier.length, t));
  }
}
function pr(n, e, t) {
  return e == 0 ? n.cutByIndex(t, n.childCount) : n.replaceChild(0, n.firstChild.copy(pr(n.firstChild.content, e - 1, t)));
}
function mr(n, e, t) {
  return e == 0 ? n.append(t) : n.replaceChild(n.childCount - 1, n.lastChild.copy(mr(n.lastChild.content, e - 1, t)));
}
function cs(n, e) {
  for (let t = 0; t < e; t++)
    n = n.firstChild.content;
  return n;
}
function Zu(n, e, t) {
  if (e <= 0)
    return n;
  let r = n.content;
  return e > 1 && (r = r.replaceChild(0, Zu(r.firstChild, e - 1, r.childCount == 1 ? t - 1 : 0))), e > 0 && (r = n.type.contentMatch.fillBefore(r).append(r), t <= 0 && (r = r.append(n.type.contentMatch.matchFragment(r).fillBefore(C.empty, !0)))), n.copy(r);
}
function us(n, e, t, r, i) {
  let o = n.node(e), s = i ? n.indexAfter(e) : n.index(e);
  if (s == o.childCount && !t.compatibleContent(o.type))
    return null;
  let l = r.fillBefore(o.content, !0, s);
  return l && !Sp(t, o.content, s) ? l : null;
}
function Sp(n, e, t) {
  for (let r = t; r < e.childCount; r++)
    if (!n.allowsMarks(e.child(r).marks))
      return !0;
  return !1;
}
function xp(n) {
  return n.spec.defining || n.spec.definingForContent;
}
function Cp(n, e, t, r) {
  if (!r.size)
    return n.deleteRange(e, t);
  let i = n.doc.resolve(e), o = n.doc.resolve(t);
  if (Qu(i, o, r))
    return n.step(new fe(e, t, r));
  let s = td(i, o);
  s[s.length - 1] == 0 && s.pop();
  let l = -(i.depth + 1);
  s.unshift(l);
  for (let f = i.depth, h = i.pos - 1; f > 0; f--, h--) {
    let p = i.node(f).type.spec;
    if (p.defining || p.definingAsContext || p.isolating)
      break;
    s.indexOf(f) > -1 ? l = f : i.before(f) == h && s.splice(1, 0, -f);
  }
  let a = s.indexOf(l), c = [], u = r.openStart;
  for (let f = r.content, h = 0; ; h++) {
    let p = f.firstChild;
    if (c.push(p), h == r.openStart)
      break;
    f = p.content;
  }
  for (let f = u - 1; f >= 0; f--) {
    let h = c[f], p = xp(h.type);
    if (p && !h.sameMarkup(i.node(Math.abs(l) - 1)))
      u = f;
    else if (p || !h.type.isTextblock)
      break;
  }
  for (let f = r.openStart; f >= 0; f--) {
    let h = (f + u + 1) % (r.openStart + 1), p = c[h];
    if (p)
      for (let m = 0; m < s.length; m++) {
        let g = s[(m + a) % s.length], b = !0;
        g < 0 && (b = !1, g = -g);
        let T = i.node(g - 1), S = i.index(g - 1);
        if (T.canReplaceWith(S, S, p.type, p.marks))
          return n.replace(i.before(g), b ? o.after(g) : t, new A(ed(r.content, 0, r.openStart, h), h, r.openEnd));
      }
  }
  let d = n.steps.length;
  for (let f = s.length - 1; f >= 0 && (n.replace(e, t, r), !(n.steps.length > d)); f--) {
    let h = s[f];
    h < 0 || (e = i.before(h), t = o.after(h));
  }
}
function ed(n, e, t, r, i) {
  if (e < t) {
    let o = n.firstChild;
    n = n.replaceChild(0, o.copy(ed(o.content, e + 1, t, r, o)));
  }
  if (e > r) {
    let o = i.contentMatchAt(0), s = o.fillBefore(n).append(n);
    n = s.append(o.matchFragment(s).fillBefore(C.empty, !0));
  }
  return n;
}
function Tp(n, e, t, r) {
  if (!r.isInline && e == t && n.doc.resolve(e).parent.content.size) {
    let i = wp(n.doc, e, r.type);
    i != null && (e = t = i);
  }
  n.replaceRange(e, t, new A(C.from(r), 0, 0));
}
function Ep(n, e, t) {
  let r = n.doc.resolve(e), i = n.doc.resolve(t);
  if (r.parent.isTextblock && i.parent.isTextblock && r.start() != i.start() && r.parentOffset == 0 && i.parentOffset == 0) {
    let s = r.sharedDepth(t), l = !1;
    for (let a = r.depth; a > s; a--)
      r.node(a).type.spec.isolating && (l = !0);
    for (let a = i.depth; a > s; a--)
      i.node(a).type.spec.isolating && (l = !0);
    if (!l) {
      for (let a = r.depth; a > 0 && e == r.start(a); a--)
        e = r.before(a);
      for (let a = i.depth; a > 0 && t == i.start(a); a--)
        t = i.before(a);
      r = n.doc.resolve(e), i = n.doc.resolve(t);
    }
  }
  let o = td(r, i);
  for (let s = 0; s < o.length; s++) {
    let l = o[s], a = s == o.length - 1;
    if (a && l == 0 || r.node(l).type.contentMatch.validEnd)
      return n.delete(r.start(l), i.end(l));
    if (l > 0 && (a || r.node(l - 1).canReplace(r.index(l - 1), i.indexAfter(l - 1))))
      return n.delete(r.before(l), i.after(l));
  }
  for (let s = 1; s <= r.depth && s <= i.depth; s++)
    if (e - r.start(s) == r.depth - s && t > r.end(s) && i.end(s) - t != i.depth - s && r.start(s - 1) == i.start(s - 1) && r.node(s - 1).canReplace(r.index(s - 1), i.index(s - 1)))
      return n.delete(r.before(s), t);
  n.delete(e, t);
}
function td(n, e) {
  let t = [], r = Math.min(n.depth, e.depth);
  for (let i = r; i >= 0; i--) {
    let o = n.start(i);
    if (o < n.pos - (n.depth - i) || e.end(i) > e.pos + (e.depth - i) || n.node(i).type.spec.isolating || e.node(i).type.spec.isolating)
      break;
    (o == e.start(i) || i == n.depth && i == e.depth && n.parent.inlineContent && e.parent.inlineContent && i && e.start(i - 1) == o - 1) && t.push(i);
  }
  return t;
}
class _n extends Ae {
  /**
  Construct an attribute step.
  */
  constructor(e, t, r) {
    super(), this.pos = e, this.attr = t, this.value = r;
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t)
      return he.fail("No node at attribute step's position");
    let r = /* @__PURE__ */ Object.create(null);
    for (let o in t.attrs)
      r[o] = t.attrs[o];
    r[this.attr] = this.value;
    let i = t.type.create(r, null, t.marks);
    return he.fromReplace(e, this.pos, this.pos + 1, new A(C.from(i), 0, t.isLeaf ? 0 : 1));
  }
  getMap() {
    return Ve.empty;
  }
  invert(e) {
    return new _n(this.pos, this.attr, e.nodeAt(this.pos).attrs[this.attr]);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new _n(t.pos, this.attr, this.value);
  }
  toJSON() {
    return { stepType: "attr", pos: this.pos, attr: this.attr, value: this.value };
  }
  static fromJSON(e, t) {
    if (typeof t.pos != "number" || typeof t.attr != "string")
      throw new RangeError("Invalid input for AttrStep.fromJSON");
    return new _n(t.pos, t.attr, t.value);
  }
}
Ae.jsonID("attr", _n);
class $r extends Ae {
  /**
  Construct an attribute step.
  */
  constructor(e, t) {
    super(), this.attr = e, this.value = t;
  }
  apply(e) {
    let t = /* @__PURE__ */ Object.create(null);
    for (let i in e.attrs)
      t[i] = e.attrs[i];
    t[this.attr] = this.value;
    let r = e.type.create(t, e.content, e.marks);
    return he.ok(r);
  }
  getMap() {
    return Ve.empty;
  }
  invert(e) {
    return new $r(this.attr, e.attrs[this.attr]);
  }
  map(e) {
    return this;
  }
  toJSON() {
    return { stepType: "docAttr", attr: this.attr, value: this.value };
  }
  static fromJSON(e, t) {
    if (typeof t.attr != "string")
      throw new RangeError("Invalid input for DocAttrStep.fromJSON");
    return new $r(t.attr, t.value);
  }
}
Ae.jsonID("docAttr", $r);
let Un = class extends Error {
};
Un = function n(e) {
  let t = Error.call(this, e);
  return t.__proto__ = n.prototype, t;
};
Un.prototype = Object.create(Error.prototype);
Un.prototype.constructor = Un;
Un.prototype.name = "TransformError";
class Rl {
  /**
  Create a transform that starts with the given document.
  */
  constructor(e) {
    this.doc = e, this.steps = [], this.docs = [], this.mapping = new zr();
  }
  /**
  The starting document.
  */
  get before() {
    return this.docs.length ? this.docs[0] : this.doc;
  }
  /**
  Apply a new step in this transform, saving the result. Throws an
  error when the step fails.
  */
  step(e) {
    let t = this.maybeStep(e);
    if (t.failed)
      throw new Un(t.failed);
    return this;
  }
  /**
  Try to apply a step in this transformation, ignoring it if it
  fails. Returns the step result.
  */
  maybeStep(e) {
    let t = e.apply(this.doc);
    return t.failed || this.addStep(e, t.doc), t;
  }
  /**
  True when the document has been changed (when there are any
  steps).
  */
  get docChanged() {
    return this.steps.length > 0;
  }
  /**
  Return a single range, in post-transform document positions,
  that covers all content changed by this transform. Returns null
  if no replacements are made. Note that this will ignore changes
  that add/remove marks without replacing the underlying content.
  */
  changedRange() {
    let e = 1e9, t = -1e9;
    for (let r = 0; r < this.mapping.maps.length; r++) {
      let i = this.mapping.maps[r];
      r && (e = i.map(e, 1), t = i.map(t, -1)), i.forEach((o, s, l, a) => {
        e = Math.min(e, l), t = Math.max(t, a);
      });
    }
    return e == 1e9 ? null : { from: e, to: t };
  }
  /**
  @internal
  */
  addStep(e, t) {
    this.docs.push(this.doc), this.steps.push(e), this.mapping.appendMap(e.getMap()), this.doc = t;
  }
  /**
  Replace the part of the document between `from` and `to` with the
  given `slice`.
  */
  replace(e, t = e, r = A.empty) {
    let i = _o(this.doc, e, t, r);
    return i && this.step(i), this;
  }
  /**
  Replace the given range with the given content, which may be a
  fragment, node, or array of nodes.
  */
  replaceWith(e, t, r) {
    return this.replace(e, t, new A(C.from(r), 0, 0));
  }
  /**
  Delete the content between the given positions.
  */
  delete(e, t) {
    return this.replace(e, t, A.empty);
  }
  /**
  Insert the given content at the given position.
  */
  insert(e, t) {
    return this.replaceWith(e, e, t);
  }
  /**
  Replace a range of the document with a given slice, using
  `from`, `to`, and the slice's
  [`openStart`](https://prosemirror.net/docs/ref/#model.Slice.openStart) property as hints, rather
  than fixed start and end points. This method may grow the
  replaced area or close open nodes in the slice in order to get a
  fit that is more in line with WYSIWYG expectations, by dropping
  fully covered parent nodes of the replaced region when they are
  marked [non-defining as
  context](https://prosemirror.net/docs/ref/#model.NodeSpec.definingAsContext), or including an
  open parent node from the slice that _is_ marked as [defining
  its content](https://prosemirror.net/docs/ref/#model.NodeSpec.definingForContent).
  
  This is the method, for example, to handle paste. The similar
  [`replace`](https://prosemirror.net/docs/ref/#transform.Transform.replace) method is a more
  primitive tool which will _not_ move the start and end of its given
  range, and is useful in situations where you need more precise
  control over what happens.
  */
  replaceRange(e, t, r) {
    return Cp(this, e, t, r), this;
  }
  /**
  Replace the given range with a node, but use `from` and `to` as
  hints, rather than precise positions. When from and to are the same
  and are at the start or end of a parent node in which the given
  node doesn't fit, this method may _move_ them out towards a parent
  that does allow the given node to be placed. When the given range
  completely covers a parent node, this method may completely replace
  that parent node.
  */
  replaceRangeWith(e, t, r) {
    return Tp(this, e, t, r), this;
  }
  /**
  Delete the given range, expanding it to cover fully covered
  parent nodes until a valid replace is found.
  */
  deleteRange(e, t) {
    return Ep(this, e, t), this;
  }
  /**
  Split the content in the given range off from its parent, if there
  is sibling content before or after it, and move it up the tree to
  the depth specified by `target`. You'll probably want to use
  [`liftTarget`](https://prosemirror.net/docs/ref/#transform.liftTarget) to compute `target`, to make
  sure the lift is valid.
  */
  lift(e, t) {
    return up(this, e, t), this;
  }
  /**
  Join the blocks around the given position. If depth is 2, their
  last and first siblings are also joined, and so on.
  */
  join(e, t = 1) {
    return vp(this, e, t), this;
  }
  /**
  Wrap the given [range](https://prosemirror.net/docs/ref/#model.NodeRange) in the given set of wrappers.
  The wrappers are assumed to be valid in this position, and should
  probably be computed with [`findWrapping`](https://prosemirror.net/docs/ref/#transform.findWrapping).
  */
  wrap(e, t) {
    return hp(this, e, t), this;
  }
  /**
  Set the type of all textblocks (partly) between `from` and `to` to
  the given node type with the given attributes.
  */
  setBlockType(e, t = e, r, i = null) {
    return pp(this, e, t, r, i), this;
  }
  /**
  Change the type, attributes, and/or marks of the node at `pos`.
  When `type` isn't given, the existing node type is preserved,
  */
  setNodeMarkup(e, t, r = null, i) {
    return gp(this, e, t, r, i), this;
  }
  /**
  Set a single attribute on a given node to a new value.
  The `pos` addresses the document content. Use `setDocAttribute`
  to set attributes on the document itself.
  */
  setNodeAttribute(e, t, r) {
    return this.step(new _n(e, t, r)), this;
  }
  /**
  Set a single attribute on the document to a new value.
  */
  setDocAttribute(e, t) {
    return this.step(new $r(e, t)), this;
  }
  /**
  Add a mark to the node at position `pos`.
  */
  addNodeMark(e, t) {
    return this.step(new qt(e, t)), this;
  }
  /**
  Remove a mark (or all marks of the given type) from the node at
  position `pos`.
  */
  removeNodeMark(e, t) {
    let r = this.doc.nodeAt(e);
    if (!r)
      throw new RangeError("No node at position " + e);
    if (t instanceof Q)
      t.isInSet(r.marks) && this.step(new xn(e, t));
    else {
      let i = r.marks, o, s = [];
      for (; o = t.isInSet(i); )
        s.push(new xn(e, o)), i = o.removeFromSet(i);
      for (let l = s.length - 1; l >= 0; l--)
        this.step(s[l]);
    }
    return this;
  }
  /**
  Split the node at the given position, and optionally, if `depth` is
  greater than one, any number of nodes above that. By default, the
  parts split off will inherit the node type of the original node.
  This can be changed by passing an array of types and attributes to
  use after the split (with the outermost nodes coming first).
  */
  split(e, t = 1, r) {
    return yp(this, e, t, r), this;
  }
  /**
  Add the given mark to the inline content between `from` and `to`.
  */
  addMark(e, t, r) {
    return lp(this, e, t, r), this;
  }
  /**
  Remove marks from inline nodes between `from` and `to`. When
  `mark` is a single mark, remove precisely that mark. When it is
  a mark type, remove all marks of that type. When it is null,
  remove all marks of any type.
  */
  removeMark(e, t, r) {
    return ap(this, e, t, r), this;
  }
  /**
  Removes all marks and nodes from the content of the node at
  `pos` that don't match the given new parent node type. Accepts
  an optional starting [content match](https://prosemirror.net/docs/ref/#model.ContentMatch) as
  third argument.
  */
  clearIncompatible(e, t, r) {
    return Nl(this, e, t, r), this;
  }
}
const ds = /* @__PURE__ */ Object.create(null);
class H {
  /**
  Initialize a selection with the head and anchor and ranges. If no
  ranges are given, constructs a single range across `$anchor` and
  `$head`.
  */
  constructor(e, t, r) {
    this.$anchor = e, this.$head = t, this.ranges = r || [new nd(e.min(t), e.max(t))];
  }
  /**
  The selection's anchor, as an unresolved position.
  */
  get anchor() {
    return this.$anchor.pos;
  }
  /**
  The selection's head.
  */
  get head() {
    return this.$head.pos;
  }
  /**
  The lower bound of the selection's main range.
  */
  get from() {
    return this.$from.pos;
  }
  /**
  The upper bound of the selection's main range.
  */
  get to() {
    return this.$to.pos;
  }
  /**
  The resolved lower  bound of the selection's main range.
  */
  get $from() {
    return this.ranges[0].$from;
  }
  /**
  The resolved upper bound of the selection's main range.
  */
  get $to() {
    return this.ranges[0].$to;
  }
  /**
  Indicates whether the selection contains any content.
  */
  get empty() {
    let e = this.ranges;
    for (let t = 0; t < e.length; t++)
      if (e[t].$from.pos != e[t].$to.pos)
        return !1;
    return !0;
  }
  /**
  Get the content of this selection as a slice.
  */
  content() {
    return this.$from.doc.slice(this.from, this.to, !0);
  }
  /**
  Replace the selection with a slice or, if no slice is given,
  delete the selection. Will append to the given transaction.
  */
  replace(e, t = A.empty) {
    let r = t.content.lastChild, i = null;
    for (let l = 0; l < t.openEnd; l++)
      i = r, r = r.lastChild;
    let o = e.steps.length, s = this.ranges;
    for (let l = 0; l < s.length; l++) {
      let { $from: a, $to: c } = s[l], u = e.mapping.slice(o);
      e.replaceRange(u.map(a.pos), u.map(c.pos), l ? A.empty : t), l == 0 && za(e, o, (r ? r.isInline : i && i.isTextblock) ? -1 : 1);
    }
  }
  /**
  Replace the selection with the given node, appending the changes
  to the given transaction.
  */
  replaceWith(e, t) {
    let r = e.steps.length, i = this.ranges;
    for (let o = 0; o < i.length; o++) {
      let { $from: s, $to: l } = i[o], a = e.mapping.slice(r), c = a.map(s.pos), u = a.map(l.pos);
      o ? e.deleteRange(c, u) : (e.replaceRangeWith(c, u, t), za(e, r, t.isInline ? -1 : 1));
    }
  }
  /**
  Find a valid cursor or leaf node selection starting at the given
  position and searching back if `dir` is negative, and forward if
  positive. When `textOnly` is true, only consider cursor
  selections. Will return null when no valid selection position is
  found.
  */
  static findFrom(e, t, r = !1) {
    let i = e.parent.inlineContent ? new L(e) : Hn(e.node(0), e.parent, e.pos, e.index(), t, r);
    if (i)
      return i;
    for (let o = e.depth - 1; o >= 0; o--) {
      let s = t < 0 ? Hn(e.node(0), e.node(o), e.before(o + 1), e.index(o), t, r) : Hn(e.node(0), e.node(o), e.after(o + 1), e.index(o) + 1, t, r);
      if (s)
        return s;
    }
    return null;
  }
  /**
  Find a valid cursor or leaf node selection near the given
  position. Searches forward first by default, but if `bias` is
  negative, it will search backwards first.
  */
  static near(e, t = 1) {
    return this.findFrom(e, t) || this.findFrom(e, -t) || new _e(e.node(0));
  }
  /**
  Find the cursor or leaf node selection closest to the start of
  the given document. Will return an
  [`AllSelection`](https://prosemirror.net/docs/ref/#state.AllSelection) if no valid position
  exists.
  */
  static atStart(e) {
    return Hn(e, e, 0, 0, 1) || new _e(e);
  }
  /**
  Find the cursor or leaf node selection closest to the end of the
  given document.
  */
  static atEnd(e) {
    return Hn(e, e, e.content.size, e.childCount, -1) || new _e(e);
  }
  /**
  Deserialize the JSON representation of a selection. Must be
  implemented for custom classes (as a static class method).
  */
  static fromJSON(e, t) {
    if (!t || !t.type)
      throw new RangeError("Invalid input for Selection.fromJSON");
    let r = ds[t.type];
    if (!r)
      throw new RangeError(`No selection type ${t.type} defined`);
    return r.fromJSON(e, t);
  }
  /**
  To be able to deserialize selections from JSON, custom selection
  classes must register themselves with an ID string, so that they
  can be disambiguated. Try to pick something that's unlikely to
  clash with classes from other modules.
  */
  static jsonID(e, t) {
    if (e in ds)
      throw new RangeError("Duplicate use of selection JSON ID " + e);
    return ds[e] = t, t.prototype.jsonID = e, t;
  }
  /**
  Get a [bookmark](https://prosemirror.net/docs/ref/#state.SelectionBookmark) for this selection,
  which is a value that can be mapped without having access to a
  current document, and later resolved to a real selection for a
  given document again. (This is used mostly by the history to
  track and restore old selections.) The default implementation of
  this method just converts the selection to a text selection and
  returns the bookmark for that.
  */
  getBookmark() {
    return L.between(this.$anchor, this.$head).getBookmark();
  }
}
H.prototype.visible = !0;
class nd {
  /**
  Create a range.
  */
  constructor(e, t) {
    this.$from = e, this.$to = t;
  }
}
let Ba = !1;
function Ha(n) {
  !Ba && !n.parent.inlineContent && (Ba = !0, console.warn("TextSelection endpoint not pointing into a node with inline content (" + n.parent.type.name + ")"));
}
class L extends H {
  /**
  Construct a text selection between the given points.
  */
  constructor(e, t = e) {
    Ha(e), Ha(t), super(e, t);
  }
  /**
  Returns a resolved position if this is a cursor selection (an
  empty text selection), and null otherwise.
  */
  get $cursor() {
    return this.$anchor.pos == this.$head.pos ? this.$head : null;
  }
  map(e, t) {
    let r = e.resolve(t.map(this.head));
    if (!r.parent.inlineContent)
      return H.near(r);
    let i = e.resolve(t.map(this.anchor));
    return new L(i.parent.inlineContent ? i : r, r);
  }
  replace(e, t = A.empty) {
    if (super.replace(e, t), t == A.empty) {
      let r = this.$from.marksAcross(this.$to);
      r && e.ensureMarks(r);
    }
  }
  eq(e) {
    return e instanceof L && e.anchor == this.anchor && e.head == this.head;
  }
  getBookmark() {
    return new Uo(this.anchor, this.head);
  }
  toJSON() {
    return { type: "text", anchor: this.anchor, head: this.head };
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.anchor != "number" || typeof t.head != "number")
      throw new RangeError("Invalid input for TextSelection.fromJSON");
    return new L(e.resolve(t.anchor), e.resolve(t.head));
  }
  /**
  Create a text selection from non-resolved positions.
  */
  static create(e, t, r = t) {
    let i = e.resolve(t);
    return new this(i, r == t ? i : e.resolve(r));
  }
  /**
  Return a text selection that spans the given positions or, if
  they aren't text positions, find a text selection near them.
  `bias` determines whether the method searches forward (default)
  or backwards (negative number) first. Will fall back to calling
  [`Selection.near`](https://prosemirror.net/docs/ref/#state.Selection^near) when the document
  doesn't contain a valid text position.
  */
  static between(e, t, r) {
    let i = e.pos - t.pos;
    if ((!r || i) && (r = i >= 0 ? 1 : -1), !t.parent.inlineContent) {
      let o = H.findFrom(t, r, !0) || H.findFrom(t, -r, !0);
      if (o)
        t = o.$head;
      else
        return H.near(t, r);
    }
    return e.parent.inlineContent || (i == 0 ? e = t : (e = (H.findFrom(e, -r, !0) || H.findFrom(e, r, !0)).$anchor, e.pos < t.pos != i < 0 && (e = t))), new L(e, t);
  }
}
H.jsonID("text", L);
class Uo {
  constructor(e, t) {
    this.anchor = e, this.head = t;
  }
  map(e) {
    return new Uo(e.map(this.anchor), e.map(this.head));
  }
  resolve(e) {
    return L.between(e.resolve(this.anchor), e.resolve(this.head));
  }
}
class P extends H {
  /**
  Create a node selection. Does not verify the validity of its
  argument.
  */
  constructor(e) {
    let t = e.nodeAfter, r = e.node(0).resolve(e.pos + t.nodeSize);
    super(e, r), this.node = t;
  }
  map(e, t) {
    let { deleted: r, pos: i } = t.mapResult(this.anchor), o = e.resolve(i);
    return r ? H.near(o) : new P(o);
  }
  content() {
    return new A(C.from(this.node), 0, 0);
  }
  eq(e) {
    return e instanceof P && e.anchor == this.anchor;
  }
  toJSON() {
    return { type: "node", anchor: this.anchor };
  }
  getBookmark() {
    return new Il(this.anchor);
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.anchor != "number")
      throw new RangeError("Invalid input for NodeSelection.fromJSON");
    return new P(e.resolve(t.anchor));
  }
  /**
  Create a node selection from non-resolved positions.
  */
  static create(e, t) {
    return new P(e.resolve(t));
  }
  /**
  Determines whether the given node may be selected as a node
  selection.
  */
  static isSelectable(e) {
    return !e.isText && e.type.spec.selectable !== !1;
  }
}
P.prototype.visible = !1;
H.jsonID("node", P);
class Il {
  constructor(e) {
    this.anchor = e;
  }
  map(e) {
    let { deleted: t, pos: r } = e.mapResult(this.anchor);
    return t ? new Uo(r, r) : new Il(r);
  }
  resolve(e) {
    let t = e.resolve(this.anchor), r = t.nodeAfter;
    return r && P.isSelectable(r) ? new P(t) : H.near(t);
  }
}
class _e extends H {
  /**
  Create an all-selection over the given document.
  */
  constructor(e) {
    super(e.resolve(0), e.resolve(e.content.size));
  }
  replace(e, t = A.empty) {
    if (t == A.empty) {
      e.delete(0, e.doc.content.size);
      let r = H.atStart(e.doc);
      r.eq(e.selection) || e.setSelection(r);
    } else
      super.replace(e, t);
  }
  toJSON() {
    return { type: "all" };
  }
  /**
  @internal
  */
  static fromJSON(e) {
    return new _e(e);
  }
  map(e) {
    return new _e(e);
  }
  eq(e) {
    return e instanceof _e;
  }
  getBookmark() {
    return Mp;
  }
}
H.jsonID("all", _e);
const Mp = {
  map() {
    return this;
  },
  resolve(n) {
    return new _e(n);
  }
};
function Hn(n, e, t, r, i, o = !1) {
  if (e.inlineContent)
    return L.create(n, t);
  for (let s = r - (i > 0 ? 0 : 1); i > 0 ? s < e.childCount : s >= 0; s += i) {
    let l = e.child(s);
    if (l.isAtom) {
      if (!o && P.isSelectable(l))
        return P.create(n, t - (i < 0 ? l.nodeSize : 0));
    } else {
      let a = Hn(n, l, t + i, i < 0 ? l.childCount : 0, i, o);
      if (a)
        return a;
    }
    t += l.nodeSize * i;
  }
  return null;
}
function za(n, e, t) {
  let r = n.steps.length - 1;
  if (r < e)
    return;
  let i = n.steps[r];
  if (!(i instanceof fe || i instanceof ye))
    return;
  let o = n.mapping.maps[r], s;
  o.forEach((l, a, c, u) => {
    s == null && (s = u);
  }), n.setSelection(H.near(n.doc.resolve(s), t));
}
const $a = 1, Ti = 2, Fa = 4;
class Op extends Rl {
  /**
  @internal
  */
  constructor(e) {
    super(e.doc), this.curSelectionFor = 0, this.updated = 0, this.meta = /* @__PURE__ */ Object.create(null), this.time = Date.now(), this.curSelection = e.selection, this.storedMarks = e.storedMarks;
  }
  /**
  The transaction's current selection. This defaults to the editor
  selection [mapped](https://prosemirror.net/docs/ref/#state.Selection.map) through the steps in the
  transaction, but can be overwritten with
  [`setSelection`](https://prosemirror.net/docs/ref/#state.Transaction.setSelection).
  */
  get selection() {
    return this.curSelectionFor < this.steps.length && (this.curSelection = this.curSelection.map(this.doc, this.mapping.slice(this.curSelectionFor)), this.curSelectionFor = this.steps.length), this.curSelection;
  }
  /**
  Update the transaction's current selection. Will determine the
  selection that the editor gets when the transaction is applied.
  */
  setSelection(e) {
    if (e.$from.doc != this.doc)
      throw new RangeError("Selection passed to setSelection must point at the current document");
    return this.curSelection = e, this.curSelectionFor = this.steps.length, this.updated = (this.updated | $a) & ~Ti, this.storedMarks = null, this;
  }
  /**
  Whether the selection was explicitly updated by this transaction.
  */
  get selectionSet() {
    return (this.updated & $a) > 0;
  }
  /**
  Set the current stored marks.
  */
  setStoredMarks(e) {
    return this.storedMarks = e, this.updated |= Ti, this;
  }
  /**
  Make sure the current stored marks or, if that is null, the marks
  at the selection, match the given set of marks. Does nothing if
  this is already the case.
  */
  ensureMarks(e) {
    return Q.sameSet(this.storedMarks || this.selection.$from.marks(), e) || this.setStoredMarks(e), this;
  }
  /**
  Add a mark to the set of stored marks.
  */
  addStoredMark(e) {
    return this.ensureMarks(e.addToSet(this.storedMarks || this.selection.$head.marks()));
  }
  /**
  Remove a mark or mark type from the set of stored marks.
  */
  removeStoredMark(e) {
    return this.ensureMarks(e.removeFromSet(this.storedMarks || this.selection.$head.marks()));
  }
  /**
  Whether the stored marks were explicitly set for this transaction.
  */
  get storedMarksSet() {
    return (this.updated & Ti) > 0;
  }
  /**
  @internal
  */
  addStep(e, t) {
    super.addStep(e, t), this.updated = this.updated & ~Ti, this.storedMarks = null;
  }
  /**
  Update the timestamp for the transaction.
  */
  setTime(e) {
    return this.time = e, this;
  }
  /**
  Replace the current selection with the given slice.
  */
  replaceSelection(e) {
    return this.selection.replace(this, e), this;
  }
  /**
  Replace the selection with the given node. When `inheritMarks` is
  true and the content is inline, it inherits the marks from the
  place where it is inserted.
  */
  replaceSelectionWith(e, t = !0) {
    let r = this.selection;
    return t && (e = e.mark(this.storedMarks || (r.empty ? r.$from.marks() : r.$from.marksAcross(r.$to) || Q.none))), r.replaceWith(this, e), this;
  }
  /**
  Delete the selection.
  */
  deleteSelection() {
    return this.selection.replace(this), this;
  }
  /**
  Replace the given range, or the selection if no range is given,
  with a text node containing the given string.
  */
  insertText(e, t, r) {
    let i = this.doc.type.schema;
    if (t == null)
      return e ? this.replaceSelectionWith(i.text(e), !0) : this.deleteSelection();
    {
      if (r == null && (r = t), !e)
        return this.deleteRange(t, r);
      let o = this.storedMarks;
      if (!o) {
        let s = this.doc.resolve(t);
        o = r == t ? s.marks() : s.marksAcross(this.doc.resolve(r));
      }
      return this.replaceRangeWith(t, r, i.text(e, o)), !this.selection.empty && this.selection.to == t + e.length && this.setSelection(H.near(this.selection.$to)), this;
    }
  }
  /**
  Store a metadata property in this transaction, keyed either by
  name or by plugin.
  */
  setMeta(e, t) {
    return this.meta[typeof e == "string" ? e : e.key] = t, this;
  }
  /**
  Retrieve a metadata property for a given name or plugin.
  */
  getMeta(e) {
    return this.meta[typeof e == "string" ? e : e.key];
  }
  /**
  Returns true if this transaction doesn't contain any metadata,
  and can thus safely be extended.
  */
  get isGeneric() {
    for (let e in this.meta)
      return !1;
    return !0;
  }
  /**
  Indicate that the editor should scroll the selection into view
  when updated to the state produced by this transaction.
  */
  scrollIntoView() {
    return this.updated |= Fa, this;
  }
  /**
  True when this transaction has had `scrollIntoView` called on it.
  */
  get scrolledIntoView() {
    return (this.updated & Fa) > 0;
  }
}
function Va(n, e) {
  return !e || !n ? n : n.bind(e);
}
class gr {
  constructor(e, t, r) {
    this.name = e, this.init = Va(t.init, r), this.apply = Va(t.apply, r);
  }
}
const Ap = [
  new gr("doc", {
    init(n) {
      return n.doc || n.schema.topNodeType.createAndFill();
    },
    apply(n) {
      return n.doc;
    }
  }),
  new gr("selection", {
    init(n, e) {
      return n.selection || H.atStart(e.doc);
    },
    apply(n) {
      return n.selection;
    }
  }),
  new gr("storedMarks", {
    init(n) {
      return n.storedMarks || null;
    },
    apply(n, e, t, r) {
      return r.selection.$cursor ? n.storedMarks : null;
    }
  }),
  new gr("scrollToSelection", {
    init() {
      return 0;
    },
    apply(n, e) {
      return n.scrolledIntoView ? e + 1 : e;
    }
  })
];
class fs {
  constructor(e, t) {
    this.schema = e, this.plugins = [], this.pluginsByKey = /* @__PURE__ */ Object.create(null), this.fields = Ap.slice(), t && t.forEach((r) => {
      if (this.pluginsByKey[r.key])
        throw new RangeError("Adding different instances of a keyed plugin (" + r.key + ")");
      this.plugins.push(r), this.pluginsByKey[r.key] = r, r.spec.state && this.fields.push(new gr(r.key, r.spec.state, r));
    });
  }
}
class Vn {
  /**
  @internal
  */
  constructor(e) {
    this.config = e;
  }
  /**
  The schema of the state's document.
  */
  get schema() {
    return this.config.schema;
  }
  /**
  The plugins that are active in this state.
  */
  get plugins() {
    return this.config.plugins;
  }
  /**
  Apply the given transaction to produce a new state.
  */
  apply(e) {
    return this.applyTransaction(e).state;
  }
  /**
  @internal
  */
  filterTransaction(e, t = -1) {
    for (let r = 0; r < this.config.plugins.length; r++)
      if (r != t) {
        let i = this.config.plugins[r];
        if (i.spec.filterTransaction && !i.spec.filterTransaction.call(i, e, this))
          return !1;
      }
    return !0;
  }
  /**
  Verbose variant of [`apply`](https://prosemirror.net/docs/ref/#state.EditorState.apply) that
  returns the precise transactions that were applied (which might
  be influenced by the [transaction
  hooks](https://prosemirror.net/docs/ref/#state.PluginSpec.filterTransaction) of
  plugins) along with the new state.
  */
  applyTransaction(e) {
    if (!this.filterTransaction(e))
      return { state: this, transactions: [] };
    let t = [e], r = this.applyInner(e), i = null;
    for (; ; ) {
      let o = !1;
      for (let s = 0; s < this.config.plugins.length; s++) {
        let l = this.config.plugins[s];
        if (l.spec.appendTransaction) {
          let a = i ? i[s].n : 0, c = i ? i[s].state : this, u = a < t.length && l.spec.appendTransaction.call(l, a ? t.slice(a) : t, c, r);
          if (u && r.filterTransaction(u, s)) {
            if (u.setMeta("appendedTransaction", e), !i) {
              i = [];
              for (let d = 0; d < this.config.plugins.length; d++)
                i.push(d < s ? { state: r, n: t.length } : { state: this, n: 0 });
            }
            t.push(u), r = r.applyInner(u), o = !0;
          }
          i && (i[s] = { state: r, n: t.length });
        }
      }
      if (!o)
        return { state: r, transactions: t };
    }
  }
  /**
  @internal
  */
  applyInner(e) {
    if (!e.before.eq(this.doc))
      throw new RangeError("Applying a mismatched transaction");
    let t = new Vn(this.config), r = this.config.fields;
    for (let i = 0; i < r.length; i++) {
      let o = r[i];
      t[o.name] = o.apply(e, this[o.name], this, t);
    }
    return t;
  }
  /**
  Accessor that constructs and returns a new [transaction](https://prosemirror.net/docs/ref/#state.Transaction) from this state.
  */
  get tr() {
    return new Op(this);
  }
  /**
  Create a new state.
  */
  static create(e) {
    let t = new fs(e.doc ? e.doc.type.schema : e.schema, e.plugins), r = new Vn(t);
    for (let i = 0; i < t.fields.length; i++)
      r[t.fields[i].name] = t.fields[i].init(e, r);
    return r;
  }
  /**
  Create a new state based on this one, but with an adjusted set
  of active plugins. State fields that exist in both sets of
  plugins are kept unchanged. Those that no longer exist are
  dropped, and those that are new are initialized using their
  [`init`](https://prosemirror.net/docs/ref/#state.StateField.init) method, passing in the new
  configuration object..
  */
  reconfigure(e) {
    let t = new fs(this.schema, e.plugins), r = t.fields, i = new Vn(t);
    for (let o = 0; o < r.length; o++) {
      let s = r[o].name;
      i[s] = this.hasOwnProperty(s) ? this[s] : r[o].init(e, i);
    }
    return i;
  }
  /**
  Serialize this state to JSON. If you want to serialize the state
  of plugins, pass an object mapping property names to use in the
  resulting JSON object to plugin objects. The argument may also be
  a string or number, in which case it is ignored, to support the
  way `JSON.stringify` calls `toString` methods.
  */
  toJSON(e) {
    let t = { doc: this.doc.toJSON(), selection: this.selection.toJSON() };
    if (this.storedMarks && (t.storedMarks = this.storedMarks.map((r) => r.toJSON())), e && typeof e == "object")
      for (let r in e) {
        if (r == "doc" || r == "selection")
          throw new RangeError("The JSON fields `doc` and `selection` are reserved");
        let i = e[r], o = i.spec.state;
        o && o.toJSON && (t[r] = o.toJSON.call(i, this[i.key]));
      }
    return t;
  }
  /**
  Deserialize a JSON representation of a state. `config` should
  have at least a `schema` field, and should contain array of
  plugins to initialize the state with. `pluginFields` can be used
  to deserialize the state of plugins, by associating plugin
  instances with the property names they use in the JSON object.
  */
  static fromJSON(e, t, r) {
    if (!t)
      throw new RangeError("Invalid input for EditorState.fromJSON");
    if (!e.schema)
      throw new RangeError("Required config field 'schema' missing");
    let i = new fs(e.schema, e.plugins), o = new Vn(i);
    return i.fields.forEach((s) => {
      if (s.name == "doc")
        o.doc = It.fromJSON(e.schema, t.doc);
      else if (s.name == "selection")
        o.selection = H.fromJSON(o.doc, t.selection);
      else if (s.name == "storedMarks")
        t.storedMarks && (o.storedMarks = t.storedMarks.map(e.schema.markFromJSON));
      else {
        if (r)
          for (let l in r) {
            let a = r[l], c = a.spec.state;
            if (a.key == s.name && c && c.fromJSON && Object.prototype.hasOwnProperty.call(t, l)) {
              o[s.name] = c.fromJSON.call(a, e, t[l], o);
              return;
            }
          }
        o[s.name] = s.init(e, o);
      }
    }), o;
  }
}
function rd(n, e, t) {
  for (let r in n) {
    let i = n[r];
    i instanceof Function ? i = i.bind(e) : r == "handleDOMEvents" && (i = rd(i, e, {})), t[r] = i;
  }
  return t;
}
class ie {
  /**
  Create a plugin.
  */
  constructor(e) {
    this.spec = e, this.props = {}, e.props && rd(e.props, this, this.props), this.key = e.key ? e.key.key : id("plugin");
  }
  /**
  Extract the plugin's state field from an editor state.
  */
  getState(e) {
    return e[this.key];
  }
}
const hs = /* @__PURE__ */ Object.create(null);
function id(n) {
  return n in hs ? n + "$" + ++hs[n] : (hs[n] = 0, n + "$");
}
class ue {
  /**
  Create a plugin key.
  */
  constructor(e = "key") {
    this.key = id(e);
  }
  /**
  Get the active plugin with this key, if any, from an editor
  state.
  */
  get(e) {
    return e.config.pluginsByKey[this.key];
  }
  /**
  Get the plugin's state from an editor state.
  */
  getState(e) {
    return e[this.key];
  }
}
const Se = function(n) {
  for (var e = 0; ; e++)
    if (n = n.previousSibling, !n)
      return e;
}, Kn = function(n) {
  let e = n.assignedSlot || n.parentNode;
  return e && e.nodeType == 11 ? e.host : e;
};
let Ks = null;
const Ot = function(n, e, t) {
  let r = Ks || (Ks = document.createRange());
  return r.setEnd(n, t ?? n.nodeValue.length), r.setStart(n, e || 0), r;
}, Np = function() {
  Ks = null;
}, Cn = function(n, e, t, r) {
  return t && (ja(n, e, t, r, -1) || ja(n, e, t, r, 1));
}, Dp = /^(img|br|input|textarea|hr)$/i;
function ja(n, e, t, r, i) {
  for (var o; ; ) {
    if (n == t && e == r)
      return !0;
    if (e == (i < 0 ? 0 : Qe(n))) {
      let s = n.parentNode;
      if (!s || s.nodeType != 1 || ni(n) || Dp.test(n.nodeName) || n.contentEditable == "false")
        return !1;
      e = Se(n) + (i < 0 ? 0 : 1), n = s;
    } else if (n.nodeType == 1) {
      let s = n.childNodes[e + (i < 0 ? -1 : 0)];
      if (s.nodeType == 1 && s.contentEditable == "false")
        if (!((o = s.pmViewDesc) === null || o === void 0) && o.ignoreForSelection)
          e += i;
        else
          return !1;
      else
        n = s, e = i < 0 ? Qe(n) : 0;
    } else
      return !1;
  }
}
function Qe(n) {
  return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
}
function Rp(n, e) {
  for (; ; ) {
    if (n.nodeType == 3 && e)
      return n;
    if (n.nodeType == 1 && e > 0) {
      if (n.contentEditable == "false")
        return null;
      n = n.childNodes[e - 1], e = Qe(n);
    } else if (n.parentNode && !ni(n))
      e = Se(n), n = n.parentNode;
    else
      return null;
  }
}
function Ip(n, e) {
  for (; ; ) {
    if (n.nodeType == 3 && e < n.nodeValue.length)
      return n;
    if (n.nodeType == 1 && e < n.childNodes.length) {
      if (n.contentEditable == "false")
        return null;
      n = n.childNodes[e], e = 0;
    } else if (n.parentNode && !ni(n))
      e = Se(n) + 1, n = n.parentNode;
    else
      return null;
  }
}
function Lp(n, e, t) {
  for (let r = e == 0, i = e == Qe(n); r || i; ) {
    if (n == t)
      return !0;
    let o = Se(n);
    if (n = n.parentNode, !n)
      return !1;
    r = r && o == 0, i = i && o == Qe(n);
  }
}
function ni(n) {
  let e;
  for (let t = n; t && !(e = t.pmViewDesc); t = t.parentNode)
    ;
  return e && e.node && e.node.isBlock && (e.dom == n || e.contentDOM == n);
}
const Ko = function(n) {
  return n.focusNode && Cn(n.focusNode, n.focusOffset, n.anchorNode, n.anchorOffset);
};
function cn(n, e) {
  let t = document.createEvent("Event");
  return t.initEvent("keydown", !0, !0), t.keyCode = n, t.key = t.code = e, t;
}
function Pp(n) {
  let e = n.activeElement;
  for (; e && e.shadowRoot; )
    e = e.shadowRoot.activeElement;
  return e;
}
function Bp(n, e, t) {
  if (n.caretPositionFromPoint)
    try {
      let r = n.caretPositionFromPoint(e, t);
      if (r)
        return { node: r.offsetNode, offset: Math.min(Qe(r.offsetNode), r.offset) };
    } catch {
    }
  if (n.caretRangeFromPoint) {
    let r = n.caretRangeFromPoint(e, t);
    if (r)
      return { node: r.startContainer, offset: Math.min(Qe(r.startContainer), r.startOffset) };
  }
}
const pt = typeof navigator < "u" ? navigator : null, Wa = typeof document < "u" ? document : null, tn = pt && pt.userAgent || "", qs = /Edge\/(\d+)/.exec(tn), od = /MSIE \d/.exec(tn), Js = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(tn), He = !!(od || Js || qs), Gt = od ? document.documentMode : Js ? +Js[1] : qs ? +qs[1] : 0, Ze = !He && /gecko\/(\d+)/i.test(tn);
Ze && +(/Firefox\/(\d+)/.exec(tn) || [0, 0])[1];
const Gs = !He && /Chrome\/(\d+)/.exec(tn), Ce = !!Gs, sd = Gs ? +Gs[1] : 0, Me = !He && !!pt && /Apple Computer/.test(pt.vendor), qn = Me && (/Mobile\/\w+/.test(tn) || !!pt && pt.maxTouchPoints > 2), Xe = qn || (pt ? /Mac/.test(pt.platform) : !1), ld = pt ? /Win/.test(pt.platform) : !1, Nt = /Android \d/.test(tn), ri = !!Wa && "webkitFontSmoothing" in Wa.documentElement.style, Hp = ri ? +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1] : 0;
function zp(n) {
  let e = n.defaultView && n.defaultView.visualViewport;
  return e ? {
    left: 0,
    right: e.width,
    top: 0,
    bottom: e.height
  } : {
    left: 0,
    right: n.documentElement.clientWidth,
    top: 0,
    bottom: n.documentElement.clientHeight
  };
}
function St(n, e) {
  return typeof n == "number" ? n : n[e];
}
function $p(n) {
  let e = n.getBoundingClientRect(), t = e.width / n.offsetWidth || 1, r = e.height / n.offsetHeight || 1;
  return {
    left: e.left,
    right: e.left + n.clientWidth * t,
    top: e.top,
    bottom: e.top + n.clientHeight * r
  };
}
function _a(n, e, t) {
  if (!Ys(e) && e.left == 0)
    return;
  let r = n.someProp("scrollThreshold") || 0, i = n.someProp("scrollMargin") || 5, o = n.dom.ownerDocument;
  for (let s = t || n.dom; s; ) {
    if (s.nodeType != 1) {
      s = Kn(s);
      continue;
    }
    let l = s, a = l == o.body, c = a ? zp(o) : $p(l), u = 0, d = 0;
    if (e.top < c.top + St(r, "top") ? d = -(c.top - e.top + St(i, "top")) : e.bottom > c.bottom - St(r, "bottom") && (d = e.bottom - e.top > c.bottom - c.top ? e.top + St(i, "top") - c.top : e.bottom - c.bottom + St(i, "bottom")), e.left < c.left + St(r, "left") ? u = -(c.left - e.left + St(i, "left")) : e.right > c.right - St(r, "right") && (u = e.right - c.right + St(i, "right")), u || d)
      if (a)
        o.defaultView.scrollBy(u, d);
      else {
        let h = l.scrollLeft, p = l.scrollTop;
        d && (l.scrollTop += d), u && (l.scrollLeft += u);
        let m = l.scrollLeft - h, g = l.scrollTop - p;
        e = { left: e.left - m, top: e.top - g, right: e.right - m, bottom: e.bottom - g };
      }
    let f = a ? "fixed" : getComputedStyle(s).position;
    if (/^(fixed|sticky)$/.test(f))
      break;
    s = f == "absolute" ? s.offsetParent : Kn(s);
  }
}
function Fp(n) {
  let e = n.dom.getBoundingClientRect(), t = Math.max(0, e.top), r, i;
  for (let o = (e.left + e.right) / 2, s = t + 1; s < Math.min(innerHeight, e.bottom); s += 5) {
    let l = n.root.elementFromPoint(o, s);
    if (!l || l == n.dom || !n.dom.contains(l))
      continue;
    let a = l.getBoundingClientRect();
    if (a.top >= t - 20) {
      r = l, i = a.top;
      break;
    }
  }
  return { refDOM: r, refTop: i, stack: ad(n.dom) };
}
function ad(n) {
  let e = [], t = n.ownerDocument;
  for (let r = n; r && (e.push({ dom: r, top: r.scrollTop, left: r.scrollLeft }), n != t); r = Kn(r))
    ;
  return e;
}
function Vp({ refDOM: n, refTop: e, stack: t }) {
  let r = n ? n.getBoundingClientRect().top : 0;
  cd(t, r == 0 ? 0 : r - e);
}
function cd(n, e) {
  for (let t = 0; t < n.length; t++) {
    let { dom: r, top: i, left: o } = n[t];
    r.scrollTop != i + e && (r.scrollTop = i + e), r.scrollLeft != o && (r.scrollLeft = o);
  }
}
let Rn = null;
function jp(n) {
  if (n.setActive)
    return n.setActive();
  if (Rn)
    return n.focus(Rn);
  let e = ad(n);
  n.focus(Rn == null ? {
    get preventScroll() {
      return Rn = { preventScroll: !0 }, !0;
    }
  } : void 0), Rn || (Rn = !1, cd(e, 0));
}
function ud(n, e) {
  let t, r = 2e8, i, o = 0, s = e.top, l = e.top, a, c;
  for (let u = n.firstChild, d = 0; u; u = u.nextSibling, d++) {
    let f;
    if (u.nodeType == 1)
      f = u.getClientRects();
    else if (u.nodeType == 3)
      f = Ot(u).getClientRects();
    else
      continue;
    for (let h = 0; h < f.length; h++) {
      let p = f[h];
      if (p.top <= s && p.bottom >= l) {
        s = Math.max(p.bottom, s), l = Math.min(p.top, l);
        let m = p.left > e.left ? p.left - e.left : p.right < e.left ? e.left - p.right : 0;
        if (m < r) {
          t = u, r = m, i = m && t.nodeType == 3 ? {
            left: p.right < e.left ? p.right : p.left,
            top: e.top
          } : e, u.nodeType == 1 && m && (o = d + (e.left >= (p.left + p.right) / 2 ? 1 : 0));
          continue;
        }
      } else p.top > e.top && !a && p.left <= e.left && p.right >= e.left && (a = u, c = { left: Math.max(p.left, Math.min(p.right, e.left)), top: p.top });
      !t && (e.left >= p.right && e.top >= p.top || e.left >= p.left && e.top >= p.bottom) && (o = d + 1);
    }
  }
  return !t && a && (t = a, i = c, r = 0), t && t.nodeType == 3 ? Wp(t, i) : !t || r && t.nodeType == 1 ? { node: n, offset: o } : ud(t, i);
}
function Wp(n, e) {
  let t = n.nodeValue.length, r = document.createRange(), i;
  for (let o = 0; o < t; o++) {
    r.setEnd(n, o + 1), r.setStart(n, o);
    let s = Ft(r, 1);
    if (s.top != s.bottom && Ll(e, s)) {
      i = { node: n, offset: o + (e.left >= (s.left + s.right) / 2 ? 1 : 0) };
      break;
    }
  }
  return r.detach(), i || { node: n, offset: 0 };
}
function Ll(n, e) {
  return n.left >= e.left - 1 && n.left <= e.right + 1 && n.top >= e.top - 1 && n.top <= e.bottom + 1;
}
function _p(n, e) {
  let t = n.parentNode;
  return t && /^li$/i.test(t.nodeName) && e.left < n.getBoundingClientRect().left ? t : n;
}
function Up(n, e, t) {
  let { node: r, offset: i } = ud(e, t), o = -1;
  if (r.nodeType == 1 && !r.firstChild) {
    let s = r.getBoundingClientRect();
    o = s.left != s.right && t.left > (s.left + s.right) / 2 ? 1 : -1;
  }
  return n.docView.posFromDOM(r, i, o);
}
function Kp(n, e, t, r) {
  let i = -1;
  for (let o = e, s = !1; o != n.dom; ) {
    let l = n.docView.nearestDesc(o, !0), a;
    if (!l)
      return null;
    if (l.dom.nodeType == 1 && (l.node.isBlock && l.parent || !l.contentDOM) && // Ignore elements with zero-size bounding rectangles
    ((a = l.dom.getBoundingClientRect()).width || a.height) && (l.node.isBlock && l.parent && !/^T(R|BODY|HEAD|FOOT)$/.test(l.dom.nodeName) && (!s && a.left > r.left || a.top > r.top ? i = l.posBefore : (!s && a.right < r.left || a.bottom < r.top) && (i = l.posAfter), s = !0), !l.contentDOM && i < 0 && !l.node.isText))
      return (l.node.isBlock ? r.top < (a.top + a.bottom) / 2 : r.left < (a.left + a.right) / 2) ? l.posBefore : l.posAfter;
    o = l.dom.parentNode;
  }
  return i > -1 ? i : n.docView.posFromDOM(e, t, -1);
}
function dd(n, e, t) {
  let r = n.childNodes.length;
  if (r && t.top < t.bottom)
    for (let i = Math.max(0, Math.min(r - 1, Math.floor(r * (e.top - t.top) / (t.bottom - t.top)) - 2)), o = i; ; ) {
      let s = n.childNodes[o];
      if (s.nodeType == 1) {
        let l = s.getClientRects();
        for (let a = 0; a < l.length; a++) {
          let c = l[a];
          if (Ll(e, c))
            return dd(s, e, c);
        }
      }
      if ((o = (o + 1) % r) == i)
        break;
    }
  return n;
}
function qp(n, e) {
  let t = n.dom.ownerDocument, r, i = 0, o = Bp(t, e.left, e.top);
  o && ({ node: r, offset: i } = o);
  let s = (n.root.elementFromPoint ? n.root : t).elementFromPoint(e.left, e.top), l;
  if (!s || !n.dom.contains(s.nodeType != 1 ? s.parentNode : s)) {
    let c = n.dom.getBoundingClientRect();
    if (!Ll(e, c) || (s = dd(n.dom, e, c), !s))
      return null;
  }
  if (Me)
    for (let c = s; r && c; c = Kn(c))
      c.draggable && (r = void 0);
  if (s = _p(s, e), r) {
    if (Ze && r.nodeType == 1 && (i = Math.min(i, r.childNodes.length), i < r.childNodes.length)) {
      let u = r.childNodes[i], d;
      u.nodeName == "IMG" && (d = u.getBoundingClientRect()).right <= e.left && d.bottom > e.top && i++;
    }
    let c;
    ri && i && r.nodeType == 1 && (c = r.childNodes[i - 1]).nodeType == 1 && c.contentEditable == "false" && c.getBoundingClientRect().top >= e.top && i--, r == n.dom && i == r.childNodes.length - 1 && r.lastChild.nodeType == 1 && e.top > r.lastChild.getBoundingClientRect().bottom ? l = n.state.doc.content.size : (i == 0 || r.nodeType != 1 || r.childNodes[i - 1].nodeName != "BR") && (l = Kp(n, r, i, e));
  }
  l == null && (l = Up(n, s, e));
  let a = n.docView.nearestDesc(s, !0);
  return { pos: l, inside: a ? a.posAtStart - a.border : -1 };
}
function Ys(n) {
  return n.top < n.bottom || n.left < n.right;
}
function Ft(n, e) {
  let t = n.getClientRects();
  if (t.length) {
    let r = t[e < 0 ? 0 : t.length - 1];
    if (Ys(r))
      return r;
  }
  return Array.prototype.find.call(t, Ys) || n.getBoundingClientRect();
}
const Jp = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
function fd(n, e, t) {
  let { node: r, offset: i, atom: o } = n.docView.domFromPos(e, t < 0 ? -1 : 1), s = ri || Ze;
  if (r.nodeType == 3)
    if (s && (Jp.test(r.nodeValue) || (t < 0 ? !i : i == r.nodeValue.length))) {
      let a = Ft(Ot(r, i, i), t);
      if (Ze && i && /\s/.test(r.nodeValue[i - 1]) && i < r.nodeValue.length) {
        let c = Ft(Ot(r, i - 1, i - 1), -1);
        if (c.top == a.top) {
          let u = Ft(Ot(r, i, i + 1), -1);
          if (u.top != a.top)
            return ur(u, u.left < c.left);
        }
      }
      return a;
    } else {
      let a = i, c = i, u = t < 0 ? 1 : -1;
      return t < 0 && !i ? (c++, u = -1) : t >= 0 && i == r.nodeValue.length ? (a--, u = 1) : t < 0 ? a-- : c++, ur(Ft(Ot(r, a, c), u), u < 0);
    }
  if (!n.state.doc.resolve(e - (o || 0)).parent.inlineContent) {
    if (o == null && i && (t < 0 || i == Qe(r))) {
      let a = r.childNodes[i - 1];
      if (a.nodeType == 1)
        return ps(a.getBoundingClientRect(), !1);
    }
    if (o == null && i < Qe(r)) {
      let a = r.childNodes[i];
      if (a.nodeType == 1)
        return ps(a.getBoundingClientRect(), !0);
    }
    return ps(r.getBoundingClientRect(), t >= 0);
  }
  if (o == null && i && (t < 0 || i == Qe(r))) {
    let a = r.childNodes[i - 1], c = a.nodeType == 3 ? Ot(a, Qe(a) - (s ? 0 : 1)) : a.nodeType == 1 && (a.nodeName != "BR" || !a.nextSibling) ? a : null;
    if (c)
      return ur(Ft(c, 1), !1);
  }
  if (o == null && i < Qe(r)) {
    let a = r.childNodes[i];
    for (; a.pmViewDesc && a.pmViewDesc.ignoreForCoords; )
      a = a.nextSibling;
    let c = a ? a.nodeType == 3 ? Ot(a, 0, s ? 0 : 1) : a.nodeType == 1 ? a : null : null;
    if (c)
      return ur(Ft(c, -1), !0);
  }
  return ur(Ft(r.nodeType == 3 ? Ot(r) : r, -t), t >= 0);
}
function ur(n, e) {
  if (n.width == 0)
    return n;
  let t = e ? n.left : n.right;
  return { top: n.top, bottom: n.bottom, left: t, right: t };
}
function ps(n, e) {
  if (n.height == 0)
    return n;
  let t = e ? n.top : n.bottom;
  return { top: t, bottom: t, left: n.left, right: n.right };
}
function hd(n, e, t) {
  let r = n.state, i = n.root.activeElement;
  r != e && n.updateState(e), i != n.dom && n.focus();
  try {
    return t();
  } finally {
    r != e && n.updateState(r), i != n.dom && i && i.focus();
  }
}
function Gp(n, e, t) {
  let r = e.selection, i = t == "up" ? r.$from : r.$to;
  return hd(n, e, () => {
    let { node: o } = n.docView.domFromPos(i.pos, t == "up" ? -1 : 1);
    for (; ; ) {
      let l = n.docView.nearestDesc(o, !0);
      if (!l)
        break;
      if (l.node.isBlock) {
        o = l.contentDOM || l.dom;
        break;
      }
      o = l.dom.parentNode;
    }
    let s = fd(n, i.pos, 1);
    for (let l = o.firstChild; l; l = l.nextSibling) {
      let a;
      if (l.nodeType == 1)
        a = l.getClientRects();
      else if (l.nodeType == 3)
        a = Ot(l, 0, l.nodeValue.length).getClientRects();
      else
        continue;
      for (let c = 0; c < a.length; c++) {
        let u = a[c];
        if (u.bottom > u.top + 1 && (t == "up" ? s.top - u.top > (u.bottom - s.top) * 2 : u.bottom - s.bottom > (s.bottom - u.top) * 2))
          return !1;
      }
    }
    return !0;
  });
}
const Yp = /[\u0590-\u08ac]/;
function Xp(n, e, t) {
  let { $head: r } = e.selection;
  if (!r.parent.isTextblock)
    return !1;
  let i = r.parentOffset, o = !i, s = i == r.parent.content.size, l = n.domSelection();
  return l ? !Yp.test(r.parent.textContent) || !l.modify ? t == "left" || t == "backward" ? o : s : hd(n, e, () => {
    let { focusNode: a, focusOffset: c, anchorNode: u, anchorOffset: d } = n.domSelectionRange(), f = l.caretBidiLevel;
    l.modify("move", t, "character");
    let h = r.depth ? n.docView.domAfterPos(r.before()) : n.dom, { focusNode: p, focusOffset: m } = n.domSelectionRange(), g = p && !h.contains(p.nodeType == 1 ? p : p.parentNode) || a == p && c == m;
    try {
      l.collapse(u, d), a && (a != u || c != d) && l.extend && l.extend(a, c);
    } catch {
    }
    return f != null && (l.caretBidiLevel = f), g;
  }) : r.pos == r.start() || r.pos == r.end();
}
let Ua = null, Ka = null, qa = !1;
function Qp(n, e, t) {
  return Ua == e && Ka == t ? qa : (Ua = e, Ka = t, qa = t == "up" || t == "down" ? Gp(n, e, t) : Xp(n, e, t));
}
const et = 0, Ja = 1, dn = 2, ot = 3;
class ii {
  constructor(e, t, r, i) {
    this.parent = e, this.children = t, this.dom = r, this.contentDOM = i, this.dirty = et, r.pmViewDesc = this;
  }
  // Used to check whether a given description corresponds to a
  // widget/mark/node.
  matchesWidget(e) {
    return !1;
  }
  matchesMark(e) {
    return !1;
  }
  matchesNode(e, t, r) {
    return !1;
  }
  matchesHack(e) {
    return !1;
  }
  // When parsing in-editor content (in domchange.js), we allow
  // descriptions to determine the parse rules that should be used to
  // parse them.
  parseRule(e) {
    return null;
  }
  // Used by the editor's event handler to ignore events that come
  // from certain descs.
  stopEvent(e) {
    return !1;
  }
  // The size of the content represented by this desc.
  get size() {
    let e = 0;
    for (let t = 0; t < this.children.length; t++)
      e += this.children[t].size;
    return e;
  }
  // For block nodes, this represents the space taken up by their
  // start/end tokens.
  get border() {
    return 0;
  }
  destroy() {
    this.parent = void 0, this.dom.pmViewDesc == this && (this.dom.pmViewDesc = void 0);
    for (let e = 0; e < this.children.length; e++)
      this.children[e].destroy();
  }
  posBeforeChild(e) {
    for (let t = 0, r = this.posAtStart; ; t++) {
      let i = this.children[t];
      if (i == e)
        return r;
      r += i.size;
    }
  }
  get posBefore() {
    return this.parent.posBeforeChild(this);
  }
  get posAtStart() {
    return this.parent ? this.parent.posBeforeChild(this) + this.border : 0;
  }
  get posAfter() {
    return this.posBefore + this.size;
  }
  get posAtEnd() {
    return this.posAtStart + this.size - 2 * this.border;
  }
  localPosFromDOM(e, t, r) {
    if (this.contentDOM && this.contentDOM.contains(e.nodeType == 1 ? e : e.parentNode))
      if (r < 0) {
        let o, s;
        if (e == this.contentDOM)
          o = e.childNodes[t - 1];
        else {
          for (; e.parentNode != this.contentDOM; )
            e = e.parentNode;
          o = e.previousSibling;
        }
        for (; o && !((s = o.pmViewDesc) && s.parent == this); )
          o = o.previousSibling;
        return o ? this.posBeforeChild(s) + s.size : this.posAtStart;
      } else {
        let o, s;
        if (e == this.contentDOM)
          o = e.childNodes[t];
        else {
          for (; e.parentNode != this.contentDOM; )
            e = e.parentNode;
          o = e.nextSibling;
        }
        for (; o && !((s = o.pmViewDesc) && s.parent == this); )
          o = o.nextSibling;
        return o ? this.posBeforeChild(s) : this.posAtEnd;
      }
    let i;
    if (e == this.dom && this.contentDOM)
      i = t > Se(this.contentDOM);
    else if (this.contentDOM && this.contentDOM != this.dom && this.dom.contains(this.contentDOM))
      i = e.compareDocumentPosition(this.contentDOM) & 2;
    else if (this.dom.firstChild) {
      if (t == 0)
        for (let o = e; ; o = o.parentNode) {
          if (o == this.dom) {
            i = !1;
            break;
          }
          if (o.previousSibling)
            break;
        }
      if (i == null && t == e.childNodes.length)
        for (let o = e; ; o = o.parentNode) {
          if (o == this.dom) {
            i = !0;
            break;
          }
          if (o.nextSibling)
            break;
        }
    }
    return i ?? r > 0 ? this.posAtEnd : this.posAtStart;
  }
  nearestDesc(e, t = !1) {
    for (let r = !0, i = e; i; i = i.parentNode) {
      let o = this.getDesc(i), s;
      if (o && (!t || o.node))
        if (r && (s = o.nodeDOM) && !(s.nodeType == 1 ? s.contains(e.nodeType == 1 ? e : e.parentNode) : s == e))
          r = !1;
        else
          return o;
    }
  }
  getDesc(e) {
    let t = e.pmViewDesc;
    for (let r = t; r; r = r.parent)
      if (r == this)
        return t;
  }
  posFromDOM(e, t, r) {
    for (let i = e; i; i = i.parentNode) {
      let o = this.getDesc(i);
      if (o)
        return o.localPosFromDOM(e, t, r);
    }
    return -1;
  }
  // Find the desc for the node after the given pos, if any. (When a
  // parent node overrode rendering, there might not be one.)
  descAt(e) {
    for (let t = 0, r = 0; t < this.children.length; t++) {
      let i = this.children[t], o = r + i.size;
      if (r == e && o != r) {
        for (; !i.border && i.children.length; )
          for (let s = 0; s < i.children.length; s++) {
            let l = i.children[s];
            if (l.size) {
              i = l;
              break;
            }
          }
        return i;
      }
      if (e < o)
        return i.descAt(e - r - i.border);
      r = o;
    }
  }
  domFromPos(e, t) {
    if (!this.contentDOM)
      return { node: this.dom, offset: 0, atom: e + 1 };
    let r = 0, i = 0;
    for (let o = 0; r < this.children.length; r++) {
      let s = this.children[r], l = o + s.size;
      if (l > e || s instanceof md) {
        i = e - o;
        break;
      }
      o = l;
    }
    if (i)
      return this.children[r].domFromPos(i - this.children[r].border, t);
    for (let o; r && !(o = this.children[r - 1]).size && o instanceof pd && o.side >= 0; r--)
      ;
    if (t <= 0) {
      let o, s = !0;
      for (; o = r ? this.children[r - 1] : null, !(!o || o.dom.parentNode == this.contentDOM); r--, s = !1)
        ;
      return o && t && s && !o.border && !o.domAtom ? o.domFromPos(o.size, t) : { node: this.contentDOM, offset: o ? Se(o.dom) + 1 : 0 };
    } else {
      let o, s = !0;
      for (; o = r < this.children.length ? this.children[r] : null, !(!o || o.dom.parentNode == this.contentDOM); r++, s = !1)
        ;
      return o && s && !o.border && !o.domAtom ? o.domFromPos(0, t) : { node: this.contentDOM, offset: o ? Se(o.dom) : this.contentDOM.childNodes.length };
    }
  }
  // Used to find a DOM range in a single parent for a given changed
  // range.
  parseRange(e, t, r = 0) {
    if (this.children.length == 0)
      return { node: this.contentDOM, from: e, to: t, fromOffset: 0, toOffset: this.contentDOM.childNodes.length };
    let i = -1, o = -1;
    for (let s = r, l = 0; ; l++) {
      let a = this.children[l], c = s + a.size;
      if (i == -1 && e <= c) {
        let u = s + a.border;
        if (e >= u && t <= c - a.border && a.node && a.contentDOM && this.contentDOM.contains(a.contentDOM))
          return a.parseRange(e, t, u);
        e = s;
        for (let d = l; d > 0; d--) {
          let f = this.children[d - 1];
          if (f.size && f.dom.parentNode == this.contentDOM && !f.emptyChildAt(1)) {
            i = Se(f.dom) + 1;
            break;
          }
          e -= f.size;
        }
        i == -1 && (i = 0);
      }
      if (i > -1 && (c > t || l == this.children.length - 1)) {
        t = c;
        for (let u = l + 1; u < this.children.length; u++) {
          let d = this.children[u];
          if (d.size && d.dom.parentNode == this.contentDOM && !d.emptyChildAt(-1)) {
            o = Se(d.dom);
            break;
          }
          t += d.size;
        }
        o == -1 && (o = this.contentDOM.childNodes.length);
        break;
      }
      s = c;
    }
    return { node: this.contentDOM, from: e, to: t, fromOffset: i, toOffset: o };
  }
  emptyChildAt(e) {
    if (this.border || !this.contentDOM || !this.children.length)
      return !1;
    let t = this.children[e < 0 ? 0 : this.children.length - 1];
    return t.size == 0 || t.emptyChildAt(e);
  }
  domAfterPos(e) {
    let { node: t, offset: r } = this.domFromPos(e, 0);
    if (t.nodeType != 1 || r == t.childNodes.length)
      throw new RangeError("No node after pos " + e);
    return t.childNodes[r];
  }
  // View descs are responsible for setting any selection that falls
  // entirely inside of them, so that custom implementations can do
  // custom things with the selection. Note that this falls apart when
  // a selection starts in such a node and ends in another, in which
  // case we just use whatever domFromPos produces as a best effort.
  setSelection(e, t, r, i = !1) {
    let o = Math.min(e, t), s = Math.max(e, t);
    for (let h = 0, p = 0; h < this.children.length; h++) {
      let m = this.children[h], g = p + m.size;
      if (o > p && s < g)
        return m.setSelection(e - p - m.border, t - p - m.border, r, i);
      p = g;
    }
    let l = this.domFromPos(e, e ? -1 : 1), a = t == e ? l : this.domFromPos(t, t ? -1 : 1), c = r.root.getSelection(), u = r.domSelectionRange(), d = !1;
    if ((Ze || Me) && e == t) {
      let { node: h, offset: p } = l;
      if (h.nodeType == 3) {
        if (d = !!(p && h.nodeValue[p - 1] == `
`), d && p == h.nodeValue.length)
          for (let m = h, g; m; m = m.parentNode) {
            if (g = m.nextSibling) {
              g.nodeName == "BR" && (l = a = { node: g.parentNode, offset: Se(g) + 1 });
              break;
            }
            let b = m.pmViewDesc;
            if (b && b.node && b.node.isBlock)
              break;
          }
      } else {
        let m = h.childNodes[p - 1];
        d = m && (m.nodeName == "BR" || m.contentEditable == "false");
      }
    }
    if (Ze && u.focusNode && u.focusNode != a.node && u.focusNode.nodeType == 1) {
      let h = u.focusNode.childNodes[u.focusOffset];
      h && h.contentEditable == "false" && (i = !0);
    }
    if (!(i || d && Me) && Cn(l.node, l.offset, u.anchorNode, u.anchorOffset) && Cn(a.node, a.offset, u.focusNode, u.focusOffset))
      return;
    let f = !1;
    if ((c.extend || e == t) && !(d && Ze)) {
      c.collapse(l.node, l.offset);
      try {
        e != t && c.extend(a.node, a.offset), f = !0;
      } catch {
      }
    }
    if (!f) {
      if (e > t) {
        let p = l;
        l = a, a = p;
      }
      let h = document.createRange();
      h.setEnd(a.node, a.offset), h.setStart(l.node, l.offset), c.removeAllRanges(), c.addRange(h);
    }
  }
  ignoreMutation(e) {
    return !this.contentDOM && e.type != "selection";
  }
  get contentLost() {
    return this.contentDOM && this.contentDOM != this.dom && !this.dom.contains(this.contentDOM);
  }
  // Remove a subtree of the element tree that has been touched
  // by a DOM change, so that the next update will redraw it.
  markDirty(e, t) {
    for (let r = 0, i = 0; i < this.children.length; i++) {
      let o = this.children[i], s = r + o.size;
      if (r == s ? e <= s && t >= r : e < s && t > r) {
        let l = r + o.border, a = s - o.border;
        if (e >= l && t <= a) {
          this.dirty = e == r || t == s ? dn : Ja, e == l && t == a && (o.contentLost || o.dom.parentNode != this.contentDOM) ? o.dirty = ot : o.markDirty(e - l, t - l);
          return;
        } else
          o.dirty = o.dom == o.contentDOM && o.dom.parentNode == this.contentDOM && !o.children.length ? dn : ot;
      }
      r = s;
    }
    this.dirty = dn;
  }
  markParentsDirty() {
    let e = 1;
    for (let t = this.parent; t; t = t.parent, e++) {
      let r = e == 1 ? dn : Ja;
      t.dirty < r && (t.dirty = r);
    }
  }
  get domAtom() {
    return !1;
  }
  get ignoreForCoords() {
    return !1;
  }
  get ignoreForSelection() {
    return !1;
  }
  isText(e) {
    return !1;
  }
}
class pd extends ii {
  constructor(e, t, r, i) {
    let o, s = t.type.toDOM;
    if (typeof s == "function" && (s = s(r, () => {
      if (!o)
        return i;
      if (o.parent)
        return o.parent.posBeforeChild(o);
    })), !t.type.spec.raw) {
      if (s.nodeType != 1) {
        let l = document.createElement("span");
        l.appendChild(s), s = l;
      }
      s.contentEditable = "false", s.classList.add("ProseMirror-widget");
    }
    super(e, [], s, null), this.widget = t, this.widget = t, o = this;
  }
  matchesWidget(e) {
    return this.dirty == et && e.type.eq(this.widget.type);
  }
  parseRule() {
    return { ignore: !0 };
  }
  stopEvent(e) {
    let t = this.widget.spec.stopEvent;
    return t ? t(e) : !1;
  }
  ignoreMutation(e) {
    return e.type != "selection" || this.widget.spec.ignoreSelection;
  }
  destroy() {
    this.widget.type.destroy(this.dom), super.destroy();
  }
  get domAtom() {
    return !0;
  }
  get ignoreForSelection() {
    return !!this.widget.type.spec.relaxedSide;
  }
  get side() {
    return this.widget.type.side;
  }
}
class Zp extends ii {
  constructor(e, t, r, i) {
    super(e, [], t, null), this.textDOM = r, this.text = i;
  }
  get size() {
    return this.text.length;
  }
  localPosFromDOM(e, t) {
    return e != this.textDOM ? this.posAtStart + (t ? this.size : 0) : this.posAtStart + t;
  }
  domFromPos(e) {
    return { node: this.textDOM, offset: e };
  }
  ignoreMutation(e) {
    return e.type === "characterData" && e.target.nodeValue == e.oldValue;
  }
}
class Yt extends ii {
  constructor(e, t, r, i, o) {
    super(e, [], r, i), this.mark = t, this.spec = o;
  }
  static create(e, t, r, i) {
    let o = i.nodeViews[t.type.name], s = o && o(t, i, r);
    return (!s || !s.dom) && (s = An.renderSpec(document, t.type.spec.toDOM(t, r), null, t.attrs)), new Yt(e, t, s.dom, s.contentDOM || s.dom, s);
  }
  parseRule() {
    return this.dirty & ot || this.mark.type.spec.reparseInView ? null : { mark: this.mark.type.name, attrs: this.mark.attrs, contentElement: this.contentDOM };
  }
  matchesMark(e) {
    return this.dirty != ot && this.mark.eq(e);
  }
  markDirty(e, t) {
    if (super.markDirty(e, t), this.dirty != et) {
      let r = this.parent;
      for (; !r.node; )
        r = r.parent;
      r.dirty < this.dirty && (r.dirty = this.dirty), this.dirty = et;
    }
  }
  slice(e, t, r) {
    let i = Yt.create(this.parent, this.mark, !0, r), o = this.children, s = this.size;
    t < s && (o = Qs(o, t, s, r)), e > 0 && (o = Qs(o, 0, e, r));
    for (let l = 0; l < o.length; l++)
      o[l].parent = i;
    return i.children = o, i;
  }
  ignoreMutation(e) {
    return this.spec.ignoreMutation ? this.spec.ignoreMutation(e) : super.ignoreMutation(e);
  }
  destroy() {
    this.spec.destroy && this.spec.destroy(), super.destroy();
  }
}
class Xt extends ii {
  constructor(e, t, r, i, o, s, l) {
    super(e, [], o, s), this.node = t, this.outerDeco = r, this.innerDeco = i, this.nodeDOM = l;
  }
  // By default, a node is rendered using the `toDOM` method from the
  // node type spec. But client code can use the `nodeViews` spec to
  // supply a custom node view, which can influence various aspects of
  // the way the node works.
  //
  // (Using subclassing for this was intentionally decided against,
  // since it'd require exposing a whole slew of finicky
  // implementation details to the user code that they probably will
  // never need.)
  static create(e, t, r, i, o, s) {
    let l = o.nodeViews[t.type.name], a, c = l && l(t, o, () => {
      if (!a)
        return s;
      if (a.parent)
        return a.parent.posBeforeChild(a);
    }, r, i), u = c && c.dom, d = c && c.contentDOM;
    if (t.isText) {
      if (!u)
        u = document.createTextNode(t.text);
      else if (u.nodeType != 3)
        throw new RangeError("Text must be rendered as a DOM text node");
    } else u || ({ dom: u, contentDOM: d } = An.renderSpec(document, t.type.spec.toDOM(t), null, t.attrs));
    !d && !t.isText && u.nodeName != "BR" && (u.hasAttribute("contenteditable") || (u.contentEditable = "false"), t.type.spec.draggable && (u.draggable = !0));
    let f = u;
    return u = bd(u, r, t), c ? a = new em(e, t, r, i, u, d || null, f, c) : t.isText ? new qo(e, t, r, i, u, f) : new Xt(e, t, r, i, u, d || null, f);
  }
  parseRule(e) {
    if (this.node.type.spec.reparseInView)
      return null;
    let t = { node: this.node.type.name, attrs: this.node.attrs };
    if (this.node.type.whitespace == "pre" && (t.preserveWhitespace = "full"), !this.contentDOM)
      t.getContent = () => this.node.content;
    else if (!this.contentLost)
      t.contentElement = this.contentDOM;
    else {
      for (let r = this.children.length - 1; r >= 0; r--) {
        let i = this.children[r];
        if (this.dom.contains(i.dom.parentNode)) {
          t.contentElement = i.dom.parentNode;
          break;
        }
      }
      if (!t.contentElement) {
        let r = e && e.find((i) => i.nodeType == 1 && e.indexOf(i.parentNode) < 0 && this.dom.contains(i));
        r ? t.contentElement = r : t.getContent = () => C.empty;
      }
    }
    return t;
  }
  matchesNode(e, t, r) {
    return this.dirty == et && e.eq(this.node) && no(t, this.outerDeco) && r.eq(this.innerDeco);
  }
  get size() {
    return this.node.nodeSize;
  }
  get border() {
    return this.node.isLeaf ? 0 : 1;
  }
  // Syncs `this.children` to match `this.node.content` and the local
  // decorations, possibly introducing nesting for marks. Then, in a
  // separate step, syncs the DOM inside `this.contentDOM` to
  // `this.children`.
  updateChildren(e, t) {
    let r = this.node.inlineContent, i = t, o = e.composing ? this.localCompositionInfo(e, t) : null, s = o && o.pos > -1 ? o : null, l = o && o.pos < 0, a = new nm(this, s && s.node, e);
    om(this.node, this.innerDeco, (c, u, d) => {
      c.spec.marks ? a.syncToMarks(c.spec.marks, r, e, u) : c.type.side >= 0 && !d && a.syncToMarks(u == this.node.childCount ? Q.none : this.node.child(u).marks, r, e, u), a.placeWidget(c, e, i);
    }, (c, u, d, f) => {
      a.syncToMarks(c.marks, r, e, f);
      let h;
      a.findNodeMatch(c, u, d, f) || l && e.state.selection.from > i && e.state.selection.to < i + c.nodeSize && (h = a.findIndexWithChild(o.node)) > -1 && a.updateNodeAt(c, u, d, h, e) || a.updateNextNode(c, u, d, e, f, i) || a.addNode(c, u, d, e, i), i += c.nodeSize;
    }), a.syncToMarks([], r, e, 0), this.node.isTextblock && a.addTextblockHacks(), a.destroyRest(), (a.changed || this.dirty == dn) && (s && this.protectLocalComposition(e, s), gd(this.contentDOM, this.children, e), qn && sm(this.dom));
  }
  localCompositionInfo(e, t) {
    let { from: r, to: i } = e.state.selection;
    if (!(e.state.selection instanceof L) || r < t || i > t + this.node.content.size)
      return null;
    let o = e.input.compositionNode;
    if (!o || !this.dom.contains(o.parentNode))
      return null;
    if (this.node.inlineContent) {
      let s = o.nodeValue, l = lm(this.node.content, s, r - t, i - t);
      return l < 0 ? null : { node: o, pos: l, text: s };
    } else
      return { node: o, pos: -1, text: "" };
  }
  protectLocalComposition(e, { node: t, pos: r, text: i }) {
    if (this.getDesc(t))
      return;
    let o = t;
    for (; o.parentNode != this.contentDOM; o = o.parentNode) {
      for (; o.previousSibling; )
        o.parentNode.removeChild(o.previousSibling);
      for (; o.nextSibling; )
        o.parentNode.removeChild(o.nextSibling);
      o.pmViewDesc && (o.pmViewDesc = void 0);
    }
    let s = new Zp(this, o, t, i);
    e.input.compositionNodes.push(s), this.children = Qs(this.children, r, r + i.length, e, s);
  }
  // If this desc must be updated to match the given node decoration,
  // do so and return true.
  update(e, t, r, i) {
    return this.dirty == ot || !e.sameMarkup(this.node) ? !1 : (this.updateInner(e, t, r, i), !0);
  }
  updateInner(e, t, r, i) {
    this.updateOuterDeco(t), this.node = e, this.innerDeco = r, this.contentDOM && this.updateChildren(i, this.posAtStart), this.dirty = et;
  }
  updateOuterDeco(e) {
    if (no(e, this.outerDeco))
      return;
    let t = this.nodeDOM.nodeType != 1, r = this.dom;
    this.dom = yd(this.dom, this.nodeDOM, Xs(this.outerDeco, this.node, t), Xs(e, this.node, t)), this.dom != r && (r.pmViewDesc = void 0, this.dom.pmViewDesc = this), this.outerDeco = e;
  }
  // Mark this node as being the selected node.
  selectNode() {
    this.nodeDOM.nodeType == 1 && (this.nodeDOM.classList.add("ProseMirror-selectednode"), (this.contentDOM || !this.node.type.spec.draggable) && (this.nodeDOM.draggable = !0));
  }
  // Remove selected node marking from this node.
  deselectNode() {
    this.nodeDOM.nodeType == 1 && (this.nodeDOM.classList.remove("ProseMirror-selectednode"), (this.contentDOM || !this.node.type.spec.draggable) && this.nodeDOM.removeAttribute("draggable"));
  }
  get domAtom() {
    return this.node.isAtom;
  }
}
function Ga(n, e, t, r, i) {
  bd(r, e, n);
  let o = new Xt(void 0, n, e, t, r, r, r);
  return o.contentDOM && o.updateChildren(i, 0), o;
}
class qo extends Xt {
  constructor(e, t, r, i, o, s) {
    super(e, t, r, i, o, null, s);
  }
  parseRule() {
    let e = this.nodeDOM.parentNode;
    for (; e && e != this.dom && !e.pmIsDeco; )
      e = e.parentNode;
    return { skip: e || !0 };
  }
  update(e, t, r, i) {
    return this.dirty == ot || this.dirty != et && !this.inParent() || !e.sameMarkup(this.node) ? !1 : (this.updateOuterDeco(t), (this.dirty != et || e.text != this.node.text) && e.text != this.nodeDOM.nodeValue && (this.nodeDOM.nodeValue = e.text, i.trackWrites == this.nodeDOM && (i.trackWrites = null)), this.node = e, this.dirty = et, !0);
  }
  inParent() {
    let e = this.parent.contentDOM;
    for (let t = this.nodeDOM; t; t = t.parentNode)
      if (t == e)
        return !0;
    return !1;
  }
  domFromPos(e) {
    return { node: this.nodeDOM, offset: e };
  }
  localPosFromDOM(e, t, r) {
    return e == this.nodeDOM ? this.posAtStart + Math.min(t, this.node.text.length) : super.localPosFromDOM(e, t, r);
  }
  ignoreMutation(e) {
    return e.type != "characterData" && e.type != "selection";
  }
  slice(e, t, r) {
    let i = this.node.cut(e, t), o = document.createTextNode(i.text);
    return new qo(this.parent, i, this.outerDeco, this.innerDeco, o, o);
  }
  markDirty(e, t) {
    super.markDirty(e, t), this.dom != this.nodeDOM && (e == 0 || t == this.nodeDOM.nodeValue.length) && (this.dirty = ot);
  }
  get domAtom() {
    return !1;
  }
  isText(e) {
    return this.node.text == e;
  }
}
class md extends ii {
  parseRule() {
    return { ignore: !0 };
  }
  matchesHack(e) {
    return this.dirty == et && this.dom.nodeName == e;
  }
  get domAtom() {
    return !0;
  }
  get ignoreForCoords() {
    return this.dom.nodeName == "IMG";
  }
}
class em extends Xt {
  constructor(e, t, r, i, o, s, l, a) {
    super(e, t, r, i, o, s, l), this.spec = a;
  }
  // A custom `update` method gets to decide whether the update goes
  // through. If it does, and there's a `contentDOM` node, our logic
  // updates the children.
  update(e, t, r, i) {
    if (this.dirty == ot)
      return !1;
    if (this.spec.update && (this.node.type == e.type || this.spec.multiType)) {
      let o = this.spec.update(e, t, r);
      return o && this.updateInner(e, t, r, i), o;
    } else return !this.contentDOM && !e.isLeaf ? !1 : super.update(e, t, r, i);
  }
  selectNode() {
    this.spec.selectNode ? this.spec.selectNode() : super.selectNode();
  }
  deselectNode() {
    this.spec.deselectNode ? this.spec.deselectNode() : super.deselectNode();
  }
  setSelection(e, t, r, i) {
    this.spec.setSelection ? this.spec.setSelection(e, t, r.root) : super.setSelection(e, t, r, i);
  }
  destroy() {
    this.spec.destroy && this.spec.destroy(), super.destroy();
  }
  stopEvent(e) {
    return this.spec.stopEvent ? this.spec.stopEvent(e) : !1;
  }
  ignoreMutation(e) {
    return this.spec.ignoreMutation ? this.spec.ignoreMutation(e) : super.ignoreMutation(e);
  }
}
function gd(n, e, t) {
  let r = n.firstChild, i = !1;
  for (let o = 0; o < e.length; o++) {
    let s = e[o], l = s.dom;
    if (l.parentNode == n) {
      for (; l != r; )
        r = Ya(r), i = !0;
      r = r.nextSibling;
    } else
      i = !0, n.insertBefore(l, r);
    if (s instanceof Yt) {
      let a = r ? r.previousSibling : n.lastChild;
      gd(s.contentDOM, s.children, t), r = a ? a.nextSibling : n.firstChild;
    }
  }
  for (; r; )
    r = Ya(r), i = !0;
  i && t.trackWrites == n && (t.trackWrites = null);
}
const kr = function(n) {
  n && (this.nodeName = n);
};
kr.prototype = /* @__PURE__ */ Object.create(null);
const fn = [new kr()];
function Xs(n, e, t) {
  if (n.length == 0)
    return fn;
  let r = t ? fn[0] : new kr(), i = [r];
  for (let o = 0; o < n.length; o++) {
    let s = n[o].type.attrs;
    if (s) {
      s.nodeName && i.push(r = new kr(s.nodeName));
      for (let l in s) {
        let a = s[l];
        a != null && (t && i.length == 1 && i.push(r = new kr(e.isInline ? "span" : "div")), l == "class" ? r.class = (r.class ? r.class + " " : "") + a : l == "style" ? r.style = (r.style ? r.style + ";" : "") + a : l != "nodeName" && (r[l] = a));
      }
    }
  }
  return i;
}
function yd(n, e, t, r) {
  if (t == fn && r == fn)
    return e;
  let i = e;
  for (let o = 0; o < r.length; o++) {
    let s = r[o], l = t[o];
    if (o) {
      let a;
      l && l.nodeName == s.nodeName && i != n && (a = i.parentNode) && a.nodeName.toLowerCase() == s.nodeName || (a = document.createElement(s.nodeName), a.pmIsDeco = !0, a.appendChild(i), l = fn[0]), i = a;
    }
    tm(i, l || fn[0], s);
  }
  return i;
}
function tm(n, e, t) {
  for (let r in e)
    r != "class" && r != "style" && r != "nodeName" && !(r in t) && n.removeAttribute(r);
  for (let r in t)
    r != "class" && r != "style" && r != "nodeName" && t[r] != e[r] && n.setAttribute(r, t[r]);
  if (e.class != t.class) {
    let r = e.class ? e.class.split(" ").filter(Boolean) : [], i = t.class ? t.class.split(" ").filter(Boolean) : [];
    for (let o = 0; o < r.length; o++)
      i.indexOf(r[o]) == -1 && n.classList.remove(r[o]);
    for (let o = 0; o < i.length; o++)
      r.indexOf(i[o]) == -1 && n.classList.add(i[o]);
    n.classList.length == 0 && n.removeAttribute("class");
  }
  if (e.style != t.style) {
    if (e.style) {
      let r = /\s*([\w\-\xa1-\uffff]+)\s*:(?:"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|\(.*?\)|[^;])*/g, i;
      for (; i = r.exec(e.style); )
        n.style.removeProperty(i[1]);
    }
    t.style && (n.style.cssText += t.style);
  }
}
function bd(n, e, t) {
  return yd(n, n, fn, Xs(e, t, n.nodeType != 1));
}
function no(n, e) {
  if (n.length != e.length)
    return !1;
  for (let t = 0; t < n.length; t++)
    if (!n[t].type.eq(e[t].type))
      return !1;
  return !0;
}
function Ya(n) {
  let e = n.nextSibling;
  return n.parentNode.removeChild(n), e;
}
class nm {
  constructor(e, t, r) {
    this.lock = t, this.view = r, this.index = 0, this.stack = [], this.changed = !1, this.top = e, this.preMatch = rm(e.node.content, e);
  }
  // Destroy and remove the children between the given indices in
  // `this.top`.
  destroyBetween(e, t) {
    if (e != t) {
      for (let r = e; r < t; r++)
        this.top.children[r].destroy();
      this.top.children.splice(e, t - e), this.changed = !0;
    }
  }
  // Destroy all remaining children in `this.top`.
  destroyRest() {
    this.destroyBetween(this.index, this.top.children.length);
  }
  // Sync the current stack of mark descs with the given array of
  // marks, reusing existing mark descs when possible.
  syncToMarks(e, t, r, i) {
    let o = 0, s = this.stack.length >> 1, l = Math.min(s, e.length);
    for (; o < l && (o == s - 1 ? this.top : this.stack[o + 1 << 1]).matchesMark(e[o]) && e[o].type.spec.spanning !== !1; )
      o++;
    for (; o < s; )
      this.destroyRest(), this.top.dirty = et, this.index = this.stack.pop(), this.top = this.stack.pop(), s--;
    for (; s < e.length; ) {
      this.stack.push(this.top, this.index + 1);
      let a = -1, c = this.top.children.length;
      i < this.preMatch.index && (c = Math.min(this.index + 3, c));
      for (let u = this.index; u < c; u++) {
        let d = this.top.children[u];
        if (d.matchesMark(e[s]) && !this.isLocked(d.dom)) {
          a = u;
          break;
        }
      }
      if (a < 0 && this.index < this.top.children.length) {
        let u = this.top.children[this.index];
        u instanceof Yt && u.dirty != ot && u.mark.type == e[s].type && u.spec.update && !this.isLocked(u.dom) && u.spec.update(e[s]) && (u.mark = e[s], a = this.index, this.changed = !0);
      }
      if (a > -1)
        a > this.index && (this.changed = !0, this.destroyBetween(this.index, a)), this.top = this.top.children[this.index];
      else {
        let u = Yt.create(this.top, e[s], t, r);
        this.top.children.splice(this.index, 0, u), this.top = u, this.changed = !0;
      }
      this.index = 0, s++;
    }
  }
  // Try to find a node desc matching the given data. Skip over it and
  // return true when successful.
  findNodeMatch(e, t, r, i) {
    let o = -1, s;
    if (i >= this.preMatch.index && (s = this.preMatch.matches[i - this.preMatch.index]).parent == this.top && s.matchesNode(e, t, r))
      o = this.top.children.indexOf(s, this.index);
    else
      for (let l = this.index, a = Math.min(this.top.children.length, l + 5); l < a; l++) {
        let c = this.top.children[l];
        if (c.matchesNode(e, t, r) && !this.preMatch.matched.has(c)) {
          o = l;
          break;
        }
      }
    return o < 0 ? !1 : (this.destroyBetween(this.index, o), this.index++, !0);
  }
  updateNodeAt(e, t, r, i, o) {
    let s = this.top.children[i];
    return s.dirty == ot && s.dom == s.contentDOM && (s.dirty = dn), s.update(e, t, r, o) ? (this.destroyBetween(this.index, i), this.index++, !0) : !1;
  }
  findIndexWithChild(e) {
    for (; ; ) {
      let t = e.parentNode;
      if (!t)
        return -1;
      if (t == this.top.contentDOM) {
        let r = e.pmViewDesc;
        if (r) {
          for (let i = this.index; i < this.top.children.length; i++)
            if (this.top.children[i] == r)
              return i;
        }
        return -1;
      }
      e = t;
    }
  }
  // Try to update the next node, if any, to the given data. Checks
  // pre-matches to avoid overwriting nodes that could still be used.
  updateNextNode(e, t, r, i, o, s) {
    for (let l = this.index; l < this.top.children.length; l++) {
      let a = this.top.children[l];
      if (a instanceof Xt) {
        let c = this.preMatch.matched.get(a);
        if (c != null && c != o)
          return !1;
        let u = a.dom, d, f = this.isLocked(u) && !(e.isText && a.node && a.node.isText && a.nodeDOM.nodeValue == e.text && a.dirty != ot && no(t, a.outerDeco));
        if (!f && a.update(e, t, r, i))
          return this.destroyBetween(this.index, l), a.dom != u && (this.changed = !0), this.index++, !0;
        if (!f && (d = this.recreateWrapper(a, e, t, r, i, s)))
          return this.destroyBetween(this.index, l), this.top.children[this.index] = d, d.contentDOM && (d.dirty = dn, d.updateChildren(i, s + 1), d.dirty = et), this.changed = !0, this.index++, !0;
        break;
      }
    }
    return !1;
  }
  // When a node with content is replaced by a different node with
  // identical content, move over its children.
  recreateWrapper(e, t, r, i, o, s) {
    if (e.dirty || t.isAtom || !e.children.length || !e.node.content.eq(t.content) || !no(r, e.outerDeco) || !i.eq(e.innerDeco))
      return null;
    let l = Xt.create(this.top, t, r, i, o, s);
    if (l.contentDOM) {
      l.children = e.children, e.children = [];
      for (let a of l.children)
        a.parent = l;
    }
    return e.destroy(), l;
  }
  // Insert the node as a newly created node desc.
  addNode(e, t, r, i, o) {
    let s = Xt.create(this.top, e, t, r, i, o);
    s.contentDOM && s.updateChildren(i, o + 1), this.top.children.splice(this.index++, 0, s), this.changed = !0;
  }
  placeWidget(e, t, r) {
    let i = this.index < this.top.children.length ? this.top.children[this.index] : null;
    if (i && i.matchesWidget(e) && (e == i.widget || !i.widget.type.toDOM.parentNode))
      this.index++;
    else {
      let o = new pd(this.top, e, t, r);
      this.top.children.splice(this.index++, 0, o), this.changed = !0;
    }
  }
  // Make sure a textblock looks and behaves correctly in
  // contentEditable.
  addTextblockHacks() {
    let e = this.top.children[this.index - 1], t = this.top;
    for (; e instanceof Yt; )
      t = e, e = t.children[t.children.length - 1];
    (!e || // Empty textblock
    !(e instanceof qo) || /\n$/.test(e.node.text) || this.view.requiresGeckoHackNode && /\s$/.test(e.node.text)) && ((Me || Ce) && e && e.dom.contentEditable == "false" && this.addHackNode("IMG", t), this.addHackNode("BR", this.top));
  }
  addHackNode(e, t) {
    if (t == this.top && this.index < t.children.length && t.children[this.index].matchesHack(e))
      this.index++;
    else {
      let r = document.createElement(e);
      e == "IMG" && (r.className = "ProseMirror-separator", r.alt = ""), e == "BR" && (r.className = "ProseMirror-trailingBreak");
      let i = new md(this.top, [], r, null);
      t != this.top ? t.children.push(i) : t.children.splice(this.index++, 0, i), this.changed = !0;
    }
  }
  isLocked(e) {
    return this.lock && (e == this.lock || e.nodeType == 1 && e.contains(this.lock.parentNode));
  }
}
function rm(n, e) {
  let t = e, r = t.children.length, i = n.childCount, o = /* @__PURE__ */ new Map(), s = [];
  e: for (; i > 0; ) {
    let l;
    for (; ; )
      if (r) {
        let c = t.children[r - 1];
        if (c instanceof Yt)
          t = c, r = c.children.length;
        else {
          l = c, r--;
          break;
        }
      } else {
        if (t == e)
          break e;
        r = t.parent.children.indexOf(t), t = t.parent;
      }
    let a = l.node;
    if (a) {
      if (a != n.child(i - 1))
        break;
      --i, o.set(l, i), s.push(l);
    }
  }
  return { index: i, matched: o, matches: s.reverse() };
}
function im(n, e) {
  return n.type.side - e.type.side;
}
function om(n, e, t, r) {
  let i = e.locals(n), o = 0;
  if (i.length == 0) {
    for (let c = 0; c < n.childCount; c++) {
      let u = n.child(c);
      r(u, i, e.forChild(o, u), c), o += u.nodeSize;
    }
    return;
  }
  let s = 0, l = [], a = null;
  for (let c = 0; ; ) {
    let u, d;
    for (; s < i.length && i[s].to == o; ) {
      let g = i[s++];
      g.widget && (u ? (d || (d = [u])).push(g) : u = g);
    }
    if (u)
      if (d) {
        d.sort(im);
        for (let g = 0; g < d.length; g++)
          t(d[g], c, !!a);
      } else
        t(u, c, !!a);
    let f, h;
    if (a)
      h = -1, f = a, a = null;
    else if (c < n.childCount)
      h = c, f = n.child(c++);
    else
      break;
    for (let g = 0; g < l.length; g++)
      l[g].to <= o && l.splice(g--, 1);
    for (; s < i.length && i[s].from <= o && i[s].to > o; )
      l.push(i[s++]);
    let p = o + f.nodeSize;
    if (f.isText) {
      let g = p;
      s < i.length && i[s].from < g && (g = i[s].from);
      for (let b = 0; b < l.length; b++)
        l[b].to < g && (g = l[b].to);
      g < p && (a = f.cut(g - o), f = f.cut(0, g - o), p = g, h = -1);
    } else
      for (; s < i.length && i[s].to < p; )
        s++;
    let m = f.isInline && !f.isLeaf ? l.filter((g) => !g.inline) : l.slice();
    r(f, m, e.forChild(o, f), h), o = p;
  }
}
function sm(n) {
  if (n.nodeName == "UL" || n.nodeName == "OL") {
    let e = n.style.cssText;
    n.style.cssText = e + "; list-style: square !important", window.getComputedStyle(n).listStyle, n.style.cssText = e;
  }
}
function lm(n, e, t, r) {
  for (let i = 0, o = 0; i < n.childCount && o <= r; ) {
    let s = n.child(i++), l = o;
    if (o += s.nodeSize, !s.isText)
      continue;
    let a = s.text;
    for (; i < n.childCount; ) {
      let c = n.child(i++);
      if (o += c.nodeSize, !c.isText)
        break;
      a += c.text;
    }
    if (o >= t) {
      if (o >= r && a.slice(r - e.length - l, r - l) == e)
        return r - e.length;
      let c = l < r ? a.lastIndexOf(e, r - l - 1) : -1;
      if (c >= 0 && c + e.length + l >= t)
        return l + c;
      if (t == r && a.length >= r + e.length - l && a.slice(r - l, r - l + e.length) == e)
        return r;
    }
  }
  return -1;
}
function Qs(n, e, t, r, i) {
  let o = [];
  for (let s = 0, l = 0; s < n.length; s++) {
    let a = n[s], c = l, u = l += a.size;
    c >= t || u <= e ? o.push(a) : (c < e && o.push(a.slice(0, e - c, r)), i && (o.push(i), i = void 0), u > t && o.push(a.slice(t - c, a.size, r)));
  }
  return o;
}
function Pl(n, e = null) {
  let t = n.domSelectionRange(), r = n.state.doc;
  if (!t.focusNode)
    return null;
  let i = n.docView.nearestDesc(t.focusNode), o = i && i.size == 0, s = n.docView.posFromDOM(t.focusNode, t.focusOffset, 1);
  if (s < 0)
    return null;
  let l = r.resolve(s), a, c;
  if (Ko(t)) {
    for (a = s; i && !i.node; )
      i = i.parent;
    let d = i.node;
    if (i && d.isAtom && P.isSelectable(d) && i.parent && !(d.isInline && Lp(t.focusNode, t.focusOffset, i.dom))) {
      let f = i.posBefore;
      c = new P(s == f ? l : r.resolve(f));
    }
  } else {
    if (t instanceof n.dom.ownerDocument.defaultView.Selection && t.rangeCount > 1) {
      let d = s, f = s;
      for (let h = 0; h < t.rangeCount; h++) {
        let p = t.getRangeAt(h);
        d = Math.min(d, n.docView.posFromDOM(p.startContainer, p.startOffset, 1)), f = Math.max(f, n.docView.posFromDOM(p.endContainer, p.endOffset, -1));
      }
      if (d < 0)
        return null;
      [a, s] = f == n.state.selection.anchor ? [f, d] : [d, f], l = r.resolve(s);
    } else
      a = n.docView.posFromDOM(t.anchorNode, t.anchorOffset, 1);
    if (a < 0)
      return null;
  }
  let u = r.resolve(a);
  if (!c) {
    let d = e == "pointer" || n.state.selection.head < l.pos && !o ? 1 : -1;
    c = Bl(n, u, l, d);
  }
  return c;
}
function vd(n) {
  return n.editable ? n.hasFocus() : kd(n) && document.activeElement && document.activeElement.contains(n.dom);
}
function Pt(n, e = !1) {
  let t = n.state.selection;
  if (wd(n, t), !vd(n))
    return;
  let r = n.input.mouseDown;
  if (!e && Ce && r) {
    let i = n.domSelectionRange(), o = n.domObserver.currentSelection;
    if (i.anchorNode && o.anchorNode && Cn(i.anchorNode, i.anchorOffset, o.anchorNode, o.anchorOffset) && r.delaySelUpdate()) {
      n.domObserver.setCurSelection();
      return;
    }
  }
  if (n.domObserver.disconnectSelection(), n.cursorWrapper)
    cm(n);
  else {
    let { anchor: i, head: o } = t, s, l;
    Xa && !(t instanceof L) && (t.$from.parent.inlineContent || (s = Qa(n, t.from)), !t.empty && !t.$from.parent.inlineContent && (l = Qa(n, t.to))), n.docView.setSelection(i, o, n, e), Xa && (s && Za(s), l && Za(l)), t.visible ? n.dom.classList.remove("ProseMirror-hideselection") : (n.dom.classList.add("ProseMirror-hideselection"), "onselectionchange" in document && am(n));
  }
  n.domObserver.setCurSelection(), n.domObserver.connectSelection();
}
const Xa = Me || Ce && sd < 63;
function Qa(n, e) {
  let { node: t, offset: r } = n.docView.domFromPos(e, 0), i = r < t.childNodes.length ? t.childNodes[r] : null, o = r ? t.childNodes[r - 1] : null;
  if (Me && i && i.contentEditable == "false")
    return ms(i);
  if ((!i || i.contentEditable == "false") && (!o || o.contentEditable == "false")) {
    if (i)
      return ms(i);
    if (o)
      return ms(o);
  }
}
function ms(n) {
  return n.contentEditable = "true", Me && n.draggable && (n.draggable = !1, n.wasDraggable = !0), n;
}
function Za(n) {
  n.contentEditable = "false", n.wasDraggable && (n.draggable = !0, n.wasDraggable = null);
}
function am(n) {
  let e = n.dom.ownerDocument;
  e.removeEventListener("selectionchange", n.input.hideSelectionGuard);
  let t = n.domSelectionRange(), r = t.anchorNode, i = t.anchorOffset;
  e.addEventListener("selectionchange", n.input.hideSelectionGuard = () => {
    (t.anchorNode != r || t.anchorOffset != i) && (e.removeEventListener("selectionchange", n.input.hideSelectionGuard), setTimeout(() => {
      (!vd(n) || n.state.selection.visible) && n.dom.classList.remove("ProseMirror-hideselection");
    }, 20));
  });
}
function cm(n) {
  let e = n.domSelection();
  if (!e)
    return;
  let t = n.cursorWrapper.dom, r = t.nodeName == "IMG";
  r ? e.collapse(t.parentNode, Se(t) + 1) : e.collapse(t, 0), !r && !n.state.selection.visible && He && Gt <= 11 && (t.disabled = !0, t.disabled = !1);
}
function wd(n, e) {
  if (e instanceof P) {
    let t = n.docView.descAt(e.from);
    t != n.lastSelectedViewDesc && (ec(n), t && t.selectNode(), n.lastSelectedViewDesc = t);
  } else
    ec(n);
}
function ec(n) {
  n.lastSelectedViewDesc && (n.lastSelectedViewDesc.parent && n.lastSelectedViewDesc.deselectNode(), n.lastSelectedViewDesc = void 0);
}
function Bl(n, e, t, r) {
  return n.someProp("createSelectionBetween", (i) => i(n, e, t)) || L.between(e, t, r);
}
function tc(n) {
  return n.editable && !n.hasFocus() ? !1 : kd(n);
}
function kd(n) {
  let e = n.domSelectionRange();
  if (!e.anchorNode)
    return !1;
  try {
    return n.dom.contains(e.anchorNode.nodeType == 3 ? e.anchorNode.parentNode : e.anchorNode) && (n.editable || n.dom.contains(e.focusNode.nodeType == 3 ? e.focusNode.parentNode : e.focusNode));
  } catch {
    return !1;
  }
}
function um(n) {
  let e = n.docView.domFromPos(n.state.selection.anchor, 0), t = n.domSelectionRange();
  return Cn(e.node, e.offset, t.anchorNode, t.anchorOffset);
}
function Zs(n, e) {
  let { $anchor: t, $head: r } = n.selection, i = e > 0 ? t.max(r) : t.min(r), o = i.parent.inlineContent ? i.depth ? n.doc.resolve(e > 0 ? i.after() : i.before()) : null : i;
  return o && H.findFrom(o, e);
}
function Vt(n, e) {
  return n.dispatch(n.state.tr.setSelection(e).scrollIntoView()), !0;
}
function nc(n, e, t) {
  let r = n.state.selection;
  if (r instanceof L)
    if (t.indexOf("s") > -1) {
      let { $head: i } = r, o = i.textOffset ? null : e < 0 ? i.nodeBefore : i.nodeAfter;
      if (!o || o.isText || !o.isLeaf)
        return !1;
      let s = n.state.doc.resolve(i.pos + o.nodeSize * (e < 0 ? -1 : 1));
      return Vt(n, new L(r.$anchor, s));
    } else if (r.empty) {
      if (n.endOfTextblock(e > 0 ? "forward" : "backward")) {
        let i = Zs(n.state, e);
        return i && i instanceof P ? Vt(n, i) : !1;
      } else if (!(Xe && t.indexOf("m") > -1)) {
        let i = r.$head, o = i.textOffset ? null : e < 0 ? i.nodeBefore : i.nodeAfter, s;
        if (!o || o.isText)
          return !1;
        let l = e < 0 ? i.pos - o.nodeSize : i.pos;
        return o.isAtom || (s = n.docView.descAt(l)) && !s.contentDOM ? P.isSelectable(o) ? Vt(n, new P(e < 0 ? n.state.doc.resolve(i.pos - o.nodeSize) : i)) : ri ? Vt(n, new L(n.state.doc.resolve(e < 0 ? l : l + o.nodeSize))) : !1 : !1;
      }
    } else return !1;
  else {
    if (r instanceof P && r.node.isInline)
      return Vt(n, new L(e > 0 ? r.$to : r.$from));
    {
      let i = Zs(n.state, e);
      return i ? Vt(n, i) : !1;
    }
  }
}
function ro(n) {
  return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
}
function Sr(n, e) {
  let t = n.pmViewDesc;
  return t && t.size == 0 && (e < 0 || n.nextSibling || n.nodeName != "BR");
}
function In(n, e) {
  return e < 0 ? dm(n) : fm(n);
}
function dm(n) {
  let e = n.domSelectionRange(), t = e.focusNode, r = e.focusOffset;
  if (!t)
    return;
  let i, o, s = !1;
  for (Ze && t.nodeType == 1 && r < ro(t) && Sr(t.childNodes[r], -1) && (s = !0); ; )
    if (r > 0) {
      if (t.nodeType != 1)
        break;
      {
        let l = t.childNodes[r - 1];
        if (Sr(l, -1))
          i = t, o = --r;
        else if (l.nodeType == 3)
          t = l, r = t.nodeValue.length;
        else
          break;
      }
    } else {
      if (Sd(t))
        break;
      {
        let l = t.previousSibling;
        for (; l && Sr(l, -1); )
          i = t.parentNode, o = Se(l), l = l.previousSibling;
        if (l)
          t = l, r = ro(t);
        else {
          if (t = t.parentNode, t == n.dom)
            break;
          r = 0;
        }
      }
    }
  s ? el(n, t, r) : i && el(n, i, o);
}
function fm(n) {
  let e = n.domSelectionRange(), t = e.focusNode, r = e.focusOffset;
  if (!t)
    return;
  let i = ro(t), o, s;
  for (; ; )
    if (r < i) {
      if (t.nodeType != 1)
        break;
      let l = t.childNodes[r];
      if (Sr(l, 1))
        o = t, s = ++r;
      else
        break;
    } else {
      if (Sd(t))
        break;
      {
        let l = t.nextSibling;
        for (; l && Sr(l, 1); )
          o = l.parentNode, s = Se(l) + 1, l = l.nextSibling;
        if (l)
          t = l, r = 0, i = ro(t);
        else {
          if (t = t.parentNode, t == n.dom)
            break;
          r = i = 0;
        }
      }
    }
  o && el(n, o, s);
}
function Sd(n) {
  let e = n.pmViewDesc;
  return e && e.node && e.node.isBlock;
}
function hm(n, e) {
  for (; n && e == n.childNodes.length && !ni(n); )
    e = Se(n) + 1, n = n.parentNode;
  for (; n && e < n.childNodes.length; ) {
    let t = n.childNodes[e];
    if (t.nodeType == 3)
      return t;
    if (t.nodeType == 1 && t.contentEditable == "false")
      break;
    n = t, e = 0;
  }
}
function pm(n, e) {
  for (; n && !e && !ni(n); )
    e = Se(n), n = n.parentNode;
  for (; n && e; ) {
    let t = n.childNodes[e - 1];
    if (t.nodeType == 3)
      return t;
    if (t.nodeType == 1 && t.contentEditable == "false")
      break;
    n = t, e = n.childNodes.length;
  }
}
function el(n, e, t) {
  if (e.nodeType != 3) {
    let o, s;
    (s = hm(e, t)) ? (e = s, t = 0) : (o = pm(e, t)) && (e = o, t = o.nodeValue.length);
  }
  let r = n.domSelection();
  if (!r)
    return;
  if (Ko(r)) {
    let o = document.createRange();
    o.setEnd(e, t), o.setStart(e, t), r.removeAllRanges(), r.addRange(o);
  } else r.extend && r.extend(e, t);
  n.domObserver.setCurSelection();
  let { state: i } = n;
  setTimeout(() => {
    n.state == i && Pt(n);
  }, 50);
}
function rc(n, e) {
  let t = n.state.doc.resolve(e);
  if (!(Ce || ld) && t.parent.inlineContent) {
    let i = n.coordsAtPos(e);
    if (e > t.start()) {
      let o = n.coordsAtPos(e - 1), s = (o.top + o.bottom) / 2;
      if (s > i.top && s < i.bottom && Math.abs(o.left - i.left) > 1)
        return o.left < i.left ? "ltr" : "rtl";
    }
    if (e < t.end()) {
      let o = n.coordsAtPos(e + 1), s = (o.top + o.bottom) / 2;
      if (s > i.top && s < i.bottom && Math.abs(o.left - i.left) > 1)
        return o.left > i.left ? "ltr" : "rtl";
    }
  }
  return getComputedStyle(n.dom).direction == "rtl" ? "rtl" : "ltr";
}
function ic(n, e, t) {
  let r = n.state.selection;
  if (r instanceof L && !r.empty || t.indexOf("s") > -1 || Xe && t.indexOf("m") > -1)
    return !1;
  let { $from: i, $to: o } = r;
  if (!i.parent.inlineContent || n.endOfTextblock(e < 0 ? "up" : "down")) {
    let s = Zs(n.state, e);
    if (s && s instanceof P)
      return Vt(n, s);
  }
  if (!i.parent.inlineContent) {
    let s = e < 0 ? i : o, l = r instanceof _e ? H.near(s, e) : H.findFrom(s, e);
    return l ? Vt(n, l) : !1;
  }
  return !1;
}
function oc(n, e) {
  if (!(n.state.selection instanceof L))
    return !0;
  let { $head: t, $anchor: r, empty: i } = n.state.selection;
  if (!t.sameParent(r))
    return !0;
  if (!i)
    return !1;
  if (n.endOfTextblock(e > 0 ? "forward" : "backward"))
    return !0;
  let o = !t.textOffset && (e < 0 ? t.nodeBefore : t.nodeAfter);
  if (o && !o.isText) {
    let s = n.state.tr;
    return e < 0 ? s.delete(t.pos - o.nodeSize, t.pos) : s.delete(t.pos, t.pos + o.nodeSize), n.dispatch(s), !0;
  }
  return !1;
}
function sc(n, e, t) {
  n.domObserver.stop(), e.contentEditable = t, n.domObserver.start();
}
function mm(n) {
  if (!Me || n.state.selection.$head.parentOffset > 0)
    return !1;
  let { focusNode: e, focusOffset: t } = n.domSelectionRange();
  if (e && e.nodeType == 1 && t == 0 && e.firstChild && e.firstChild.contentEditable == "false") {
    let r = e.firstChild;
    sc(n, r, "true"), setTimeout(() => sc(n, r, "false"), 20);
  }
  return !1;
}
function gm(n) {
  let e = "";
  return n.ctrlKey && (e += "c"), n.metaKey && (e += "m"), n.altKey && (e += "a"), n.shiftKey && (e += "s"), e;
}
function ym(n, e) {
  let t = e.keyCode, r = gm(e);
  if (t == 8 || Xe && t == 72 && r == "c")
    return oc(n, -1) || In(n, -1);
  if (t == 46 && !e.shiftKey || Xe && t == 68 && r == "c")
    return oc(n, 1) || In(n, 1);
  if (t == 13 || t == 27)
    return !0;
  if (t == 37 || Xe && t == 66 && r == "c") {
    let i = t == 37 ? rc(n, n.state.selection.from) == "ltr" ? -1 : 1 : -1;
    return nc(n, i, r) || In(n, i);
  } else if (t == 39 || Xe && t == 70 && r == "c") {
    let i = t == 39 ? rc(n, n.state.selection.from) == "ltr" ? 1 : -1 : 1;
    return nc(n, i, r) || In(n, i);
  } else {
    if (t == 38 || Xe && t == 80 && r == "c")
      return ic(n, -1, r) || In(n, -1);
    if (t == 40 || Xe && t == 78 && r == "c")
      return mm(n) || ic(n, 1, r) || In(n, 1);
    if (r == (Xe ? "m" : "c") && (t == 66 || t == 73 || t == 89 || t == 90))
      return !0;
  }
  return !1;
}
function Hl(n, e) {
  n.someProp("transformCopied", (h) => {
    e = h(e, n);
  });
  let t = [], { content: r, openStart: i, openEnd: o } = e;
  for (; i > 1 && o > 1 && r.childCount == 1 && r.firstChild.childCount == 1; ) {
    i--, o--;
    let h = r.firstChild;
    t.push(h.type.name, h.attrs != h.type.defaultAttrs ? h.attrs : null), r = h.content;
  }
  let s = n.someProp("clipboardSerializer") || An.fromSchema(n.state.schema), l = Od(), a = l.createElement("div");
  a.appendChild(s.serializeFragment(r, { document: l }));
  let c = a.firstChild, u, d = 0;
  for (; c && c.nodeType == 1 && (u = Md[c.nodeName.toLowerCase()]); ) {
    for (let h = u.length - 1; h >= 0; h--) {
      let p = l.createElement(u[h]);
      for (; a.firstChild; )
        p.appendChild(a.firstChild);
      a.appendChild(p), d++;
    }
    c = a.firstChild;
  }
  c && c.nodeType == 1 && c.setAttribute("data-pm-slice", `${i} ${o}${d ? ` -${d}` : ""} ${JSON.stringify(t)}`);
  let f = n.someProp("clipboardTextSerializer", (h) => h(e, n)) || e.content.textBetween(0, e.content.size, `

`);
  return { dom: a, text: f, slice: e };
}
function xd(n, e, t, r, i) {
  let o = i.parent.type.spec.code, s, l;
  if (!t && !e)
    return null;
  let a = !!e && (r || o || !t);
  if (a) {
    if (n.someProp("transformPastedText", (f) => {
      e = f(e, o || r, n);
    }), o)
      return l = new A(C.from(n.state.schema.text(e.replace(/\r\n?/g, `
`))), 0, 0), n.someProp("transformPasted", (f) => {
        l = f(l, n, !0);
      }), l;
    let d = n.someProp("clipboardTextParser", (f) => f(e, i, r, n));
    if (d)
      l = d;
    else {
      let f = i.marks(), { schema: h } = n.state, p = An.fromSchema(h);
      s = document.createElement("div"), e.split(/(?:\r\n?|\n)+/).forEach((m) => {
        let g = s.appendChild(document.createElement("p"));
        m && g.appendChild(p.serializeNode(h.text(m, f)));
      });
    }
  } else
    n.someProp("transformPastedHTML", (d) => {
      t = d(t, n);
    }), s = km(t), ri && Sm(s);
  let c = s && s.querySelector("[data-pm-slice]"), u = c && /^(\d+) (\d+)(?: -(\d+))? (.*)/.exec(c.getAttribute("data-pm-slice") || "");
  if (u && u[3])
    for (let d = +u[3]; d > 0; d--) {
      let f = s.firstChild;
      for (; f && f.nodeType != 1; )
        f = f.nextSibling;
      if (!f)
        break;
      s = f;
    }
  if (l || (l = (n.someProp("clipboardParser") || n.someProp("domParser") || Jt.fromSchema(n.state.schema)).parseSlice(s, {
    preserveWhitespace: !!(a || u),
    context: i,
    ruleFromNode(f) {
      return f.nodeName == "BR" && !f.nextSibling && f.parentNode && !bm.test(f.parentNode.nodeName) ? { ignore: !0 } : null;
    }
  })), u)
    l = xm(lc(l, +u[1], +u[2]), u[4]);
  else if (l = A.maxOpen(vm(l.content, i), !0), l.openStart || l.openEnd) {
    let d = 0, f = 0;
    for (let h = l.content.firstChild; d < l.openStart && !h.type.spec.isolating; d++, h = h.firstChild)
      ;
    for (let h = l.content.lastChild; f < l.openEnd && !h.type.spec.isolating; f++, h = h.lastChild)
      ;
    l = lc(l, d, f);
  }
  return n.someProp("transformPasted", (d) => {
    l = d(l, n, a);
  }), l;
}
const bm = /^(a|abbr|acronym|b|cite|code|del|em|i|ins|kbd|label|output|q|ruby|s|samp|span|strong|sub|sup|time|u|tt|var)$/i;
function vm(n, e) {
  if (n.childCount < 2)
    return n;
  for (let t = e.depth; t >= 0; t--) {
    let i = e.node(t).contentMatchAt(e.index(t)), o, s = [];
    if (n.forEach((l) => {
      if (!s)
        return;
      let a = i.findWrapping(l.type), c;
      if (!a)
        return s = null;
      if (c = s.length && o.length && Td(a, o, l, s[s.length - 1], 0))
        s[s.length - 1] = c;
      else {
        s.length && (s[s.length - 1] = Ed(s[s.length - 1], o.length));
        let u = Cd(l, a);
        s.push(u), i = i.matchType(u.type), o = a;
      }
    }), s)
      return C.from(s);
  }
  return n;
}
function Cd(n, e, t = 0) {
  for (let r = e.length - 1; r >= t; r--)
    n = e[r].create(null, C.from(n));
  return n;
}
function Td(n, e, t, r, i) {
  if (i < n.length && i < e.length && n[i] == e[i]) {
    let o = Td(n, e, t, r.lastChild, i + 1);
    if (o)
      return r.copy(r.content.replaceChild(r.childCount - 1, o));
    if (r.contentMatchAt(r.childCount).matchType(i == n.length - 1 ? t.type : n[i + 1]))
      return r.copy(r.content.append(C.from(Cd(t, n, i + 1))));
  }
}
function Ed(n, e) {
  if (e == 0)
    return n;
  let t = n.content.replaceChild(n.childCount - 1, Ed(n.lastChild, e - 1)), r = n.contentMatchAt(n.childCount).fillBefore(C.empty, !0);
  return n.copy(t.append(r));
}
function tl(n, e, t, r, i, o) {
  let s = e < 0 ? n.firstChild : n.lastChild, l = s.content;
  return n.childCount > 1 && (o = 0), i < r - 1 && (l = tl(l, e, t, r, i + 1, o)), i >= t && (l = e < 0 ? s.contentMatchAt(0).fillBefore(l, o <= i).append(l) : l.append(s.contentMatchAt(s.childCount).fillBefore(C.empty, !0))), n.replaceChild(e < 0 ? 0 : n.childCount - 1, s.copy(l));
}
function lc(n, e, t) {
  return e < n.openStart && (n = new A(tl(n.content, -1, e, n.openStart, 0, n.openEnd), e, n.openEnd)), t < n.openEnd && (n = new A(tl(n.content, 1, t, n.openEnd, 0, 0), n.openStart, t)), n;
}
const Md = {
  thead: ["table"],
  tbody: ["table"],
  tfoot: ["table"],
  caption: ["table"],
  colgroup: ["table"],
  col: ["table", "colgroup"],
  tr: ["table", "tbody"],
  td: ["table", "tbody", "tr"],
  th: ["table", "tbody", "tr"]
};
function Od() {
  return document.implementation.createHTMLDocument("title");
}
let gs = null;
function wm(n) {
  let e = window.trustedTypes;
  return e ? (gs || (gs = e.defaultPolicy || e.createPolicy("ProseMirrorClipboard", { createHTML: (t) => t })), gs.createHTML(n)) : n;
}
function km(n) {
  let e = /^(\s*<meta [^>]*>)*/.exec(n);
  e && (n = n.slice(e[0].length));
  let t = Od(), r = t.body, i = /<([a-z][^>\s]+)/i.exec(n), o;
  if ((o = i && Md[i[1].toLowerCase()]) && (n = o.map((s) => "<" + s + ">").join("") + n + o.map((s) => "</" + s + ">").reverse().join("")), r.innerHTML = wm(n), o)
    for (let s = 0; s < o.length; s++)
      r = r.querySelector(o[s]) || r;
  for (let s = 0; s < t.styleSheets.length; s++) {
    let l = t.styleSheets[s];
    for (let a = 0; a < l.rules.length; a++) {
      let c = l.rules[a];
      if (c instanceof CSSStyleRule) {
        let u = r.querySelectorAll(c.selectorText);
        for (let d = 0; d < u.length; d++)
          u[d].style.cssText += c.style.cssText;
      }
    }
  }
  return r;
}
function Sm(n) {
  let e = n.querySelectorAll(Ce ? "span:not([class]):not([style])" : "span.Apple-converted-space");
  for (let t = 0; t < e.length; t++) {
    let r = e[t];
    r.childNodes.length == 1 && r.textContent == " " && r.parentNode && r.parentNode.replaceChild(n.ownerDocument.createTextNode(" "), r);
  }
}
function xm(n, e) {
  if (!n.size)
    return n;
  let t = n.content.firstChild.type.schema, r;
  try {
    r = JSON.parse(e);
  } catch {
    return n;
  }
  let { content: i, openStart: o, openEnd: s } = n;
  for (let l = r.length - 2; l >= 0; l -= 2) {
    let a = t.nodes[r[l]];
    if (!a || a.hasRequiredAttrs())
      break;
    i = C.from(a.create(r[l + 1], i)), o++, s++;
  }
  return new A(i, o, s);
}
const De = {}, Re = {}, Cm = { touchstart: !0, touchmove: !0 };
class Tm {
  constructor() {
    this.shiftKey = !1, this.mouseDown = null, this.lastKeyCode = null, this.lastKeyCodeTime = 0, this.lastClick = { time: 0, x: 0, y: 0, type: "", button: 0 }, this.lastSelectionOrigin = null, this.lastSelectionTime = 0, this.lastIOSEnter = 0, this.lastIOSEnterFallbackTimeout = -1, this.lastFocus = 0, this.lastTouch = 0, this.lastChromeDelete = 0, this.composing = !1, this.compositionNode = null, this.composingTimeout = -1, this.compositionNodes = [], this.compositionEndedAt = -2e8, this.compositionID = 1, this.badSafariComposition = !1, this.compositionPendingChanges = 0, this.domChangeCount = 0, this.eventHandlers = /* @__PURE__ */ Object.create(null), this.hideSelectionGuard = null;
  }
}
function Em(n) {
  for (let e in De) {
    let t = De[e];
    n.dom.addEventListener(e, n.input.eventHandlers[e] = (r) => {
      Om(n, r) && !zl(n, r) && (n.editable || !(r.type in Re)) && t(n, r);
    }, Cm[e] ? { passive: !0 } : void 0);
  }
  Me && n.dom.addEventListener("input", () => null), nl(n);
}
function Dt(n, e) {
  n.input.lastSelectionOrigin = e, n.input.lastSelectionTime = Date.now();
}
function Mm(n) {
  n.input.mouseDown && n.input.mouseDown.done(), n.domObserver.stop();
  for (let e in n.input.eventHandlers)
    n.dom.removeEventListener(e, n.input.eventHandlers[e]);
  clearTimeout(n.input.composingTimeout), clearTimeout(n.input.lastIOSEnterFallbackTimeout);
}
function nl(n) {
  n.someProp("handleDOMEvents", (e) => {
    for (let t in e)
      n.input.eventHandlers[t] || n.dom.addEventListener(t, n.input.eventHandlers[t] = (r) => zl(n, r));
  });
}
function zl(n, e) {
  return n.someProp("handleDOMEvents", (t) => {
    let r = t[e.type];
    return r ? r(n, e) || e.defaultPrevented : !1;
  });
}
function Om(n, e) {
  if (!e.bubbles)
    return !0;
  if (e.defaultPrevented)
    return !1;
  for (let t = e.target; t != n.dom; t = t.parentNode)
    if (!t || t.nodeType == 11 || t.pmViewDesc && t.pmViewDesc.stopEvent(e))
      return !1;
  return !0;
}
function Am(n, e) {
  !zl(n, e) && De[e.type] && (n.editable || !(e.type in Re)) && De[e.type](n, e);
}
Re.keydown = (n, e) => {
  let t = e;
  if (n.input.shiftKey = t.keyCode == 16 || t.shiftKey, !Rd(n) && (n.input.lastKeyCode = t.keyCode, n.input.lastKeyCodeTime = Date.now(), !(Nt && Ce && t.keyCode == 13)))
    if (t.keyCode != 229 && n.domObserver.forceFlush(), qn && t.keyCode == 13 && !t.ctrlKey && !t.altKey && !t.metaKey) {
      let r = Date.now();
      n.input.lastIOSEnter = r, n.input.lastIOSEnterFallbackTimeout = setTimeout(() => {
        n.input.lastIOSEnter == r && (n.someProp("handleKeyDown", (i) => i(n, cn(13, "Enter"))), n.input.lastIOSEnter = 0);
      }, 200);
    } else n.someProp("handleKeyDown", (r) => r(n, t)) || ym(n, t) ? t.preventDefault() : Dt(n, "key");
};
Re.keyup = (n, e) => {
  e.keyCode == 16 && (n.input.shiftKey = !1);
};
Re.keypress = (n, e) => {
  let t = e;
  if (Rd(n) || !t.charCode || t.ctrlKey && !t.altKey || Xe && t.metaKey)
    return;
  if (n.someProp("handleKeyPress", (i) => i(n, t))) {
    t.preventDefault();
    return;
  }
  let r = n.state.selection;
  if (!(r instanceof L) || !r.$from.sameParent(r.$to)) {
    let i = String.fromCharCode(t.charCode), o = () => n.state.tr.insertText(i).scrollIntoView();
    !/[\r\n]/.test(i) && !n.someProp("handleTextInput", (s) => s(n, r.$from.pos, r.$to.pos, i, o)) && n.dispatch(o()), t.preventDefault();
  }
};
function oi(n) {
  return { left: n.clientX, top: n.clientY };
}
function Nm(n, e) {
  let t = e.x - n.clientX, r = e.y - n.clientY;
  return t * t + r * r < 100;
}
function $l(n, e, t, r, i) {
  if (r == -1)
    return !1;
  let o = n.state.doc.resolve(r);
  for (let s = o.depth + 1; s > 0; s--)
    if (n.someProp(e, (l) => s > o.depth ? l(n, t, o.nodeAfter, o.before(s), i, !0) : l(n, t, o.node(s), o.before(s), i, !1)))
      return !0;
  return !1;
}
function si(n, e, t) {
  if (n.focused || n.focus(), n.state.selection.eq(e))
    return;
  let r = n.state.tr.setSelection(e);
  r.setMeta("pointer", !0), n.dispatch(r);
}
function Dm(n, e) {
  if (e == -1)
    return !1;
  let t = n.state.doc.resolve(e), r = t.nodeAfter;
  return r && r.isAtom && P.isSelectable(r) ? (si(n, new P(t)), !0) : !1;
}
function Rm(n, e) {
  if (e == -1)
    return !1;
  let t = n.state.selection, r, i;
  t instanceof P && (r = t.node);
  let o = n.state.doc.resolve(e);
  for (let s = o.depth + 1; s > 0; s--) {
    let l = s > o.depth ? o.nodeAfter : o.node(s);
    if (P.isSelectable(l)) {
      r && t.$from.depth > 0 && s >= t.$from.depth && o.before(t.$from.depth + 1) == t.$from.pos ? i = o.before(t.$from.depth) : i = o.before(s);
      break;
    }
  }
  return i != null ? (si(n, P.create(n.state.doc, i)), !0) : !1;
}
function Im(n, e, t, r, i) {
  return $l(n, "handleClickOn", e, t, r) || n.someProp("handleClick", (o) => o(n, e, r)) || (i ? Rm(n, t) : Dm(n, t));
}
function Lm(n, e, t, r) {
  return $l(n, "handleDoubleClickOn", e, t, r) || n.someProp("handleDoubleClick", (i) => i(n, e, r));
}
function Pm(n, e, t, r) {
  return $l(n, "handleTripleClickOn", e, t, r) || n.someProp("handleTripleClick", (i) => i(n, e, r)) || Bm(n, t, r);
}
function Bm(n, e, t) {
  if (t.button != 0)
    return !1;
  let r = Ad(n, e, !0), i = n.state.doc;
  return r ? (si(n, r), r instanceof L && i.eq(n.state.doc) && (n.input.mouseDown = new zm(n, r)), !0) : !1;
}
function Ad(n, e, t) {
  let r = n.state.doc;
  if (e == -1)
    return r.inlineContent ? L.create(r, 0, r.content.size) : null;
  let i = r.resolve(e);
  for (let o = i.depth + 1; o > 0; o--) {
    let s = o > i.depth ? i.nodeAfter : i.node(o), l = i.before(o);
    if (s.inlineContent)
      return L.create(r, l + 1, l + 1 + s.content.size);
    if (t && P.isSelectable(s))
      return P.create(r, l);
  }
  return null;
}
function Fl(n) {
  return io(n);
}
const Nd = Xe ? "metaKey" : "ctrlKey";
De.mousedown = (n, e) => {
  let t = e;
  n.input.shiftKey = t.shiftKey;
  let r = Fl(n), i = Date.now(), o = "singleClick";
  i - n.input.lastClick.time < 500 && Nm(t, n.input.lastClick) && !t[Nd] && n.input.lastClick.button == t.button && (n.input.lastClick.type == "singleClick" ? o = "doubleClick" : n.input.lastClick.type == "doubleClick" && (o = "tripleClick")), n.input.lastClick = { time: i, x: t.clientX, y: t.clientY, type: o, button: t.button }, n.input.mouseDown && n.input.mouseDown.done();
  let s = n.posAtCoords(oi(t));
  s && (o == "singleClick" ? n.input.mouseDown = new Hm(n, s, t, !!r) : (o == "doubleClick" ? Lm : Pm)(n, s.pos, s.inside, t) ? t.preventDefault() : Dt(n, "pointer"));
};
class Dd {
  constructor(e) {
    this.view = e, this.mightDrag = null, e.root.addEventListener("mouseup", this.up = this.up.bind(this)), e.root.addEventListener("mousemove", this.move = this.move.bind(this));
  }
  up(e) {
    this.done();
  }
  move(e) {
    e.buttons == 0 && this.done();
  }
  done() {
    this.view.root.removeEventListener("mouseup", this.up), this.view.root.removeEventListener("mousemove", this.move), this.view.input.mouseDown == this && (this.view.input.mouseDown = null);
  }
  delaySelUpdate() {
    return !1;
  }
}
class Hm extends Dd {
  constructor(e, t, r, i) {
    super(e), this.pos = t, this.event = r, this.flushed = i, this.delayedSelectionSync = !1, this.startDoc = e.state.doc, this.selectNode = !!r[Nd], this.allowDefault = r.shiftKey;
    let o, s;
    if (t.inside > -1)
      o = e.state.doc.nodeAt(t.inside), s = t.inside;
    else {
      let u = e.state.doc.resolve(t.pos);
      o = u.parent, s = u.depth ? u.before() : 0;
    }
    const l = i ? null : r.target, a = l ? e.docView.nearestDesc(l, !0) : null;
    this.target = a && a.nodeDOM.nodeType == 1 ? a.nodeDOM : null;
    let { selection: c } = e.state;
    r.button == 0 && (o.type.spec.draggable && o.type.spec.selectable !== !1 || c instanceof P && c.from <= s && c.to > s) && (this.mightDrag = {
      node: o,
      pos: s,
      addAttr: !!(this.target && !this.target.draggable),
      setUneditable: !!(this.target && Ze && !this.target.hasAttribute("contentEditable"))
    }), this.target && this.mightDrag && (this.mightDrag.addAttr || this.mightDrag.setUneditable) && (this.view.domObserver.stop(), this.mightDrag.addAttr && (this.target.draggable = !0), this.mightDrag.setUneditable && setTimeout(() => {
      this.view.input.mouseDown == this && this.target.setAttribute("contentEditable", "false");
    }, 20), this.view.domObserver.start()), Dt(e, "pointer");
  }
  done() {
    super.done(), this.mightDrag && this.target && (this.view.domObserver.stop(), this.mightDrag.addAttr && this.target.removeAttribute("draggable"), this.mightDrag.setUneditable && this.target.removeAttribute("contentEditable"), this.view.domObserver.start()), this.delayedSelectionSync && setTimeout(() => {
      this.view.isDestroyed || Pt(this.view);
    });
  }
  up(e) {
    if (this.done(), !this.view.dom.contains(e.target))
      return;
    let t = this.pos;
    this.view.state.doc != this.startDoc && (t = this.view.posAtCoords(oi(e))), this.updateAllowDefault(e), this.allowDefault || !t ? Dt(this.view, "pointer") : Im(this.view, t.pos, t.inside, e, this.selectNode) ? e.preventDefault() : e.button == 0 && (this.flushed || // Safari ignores clicks on draggable elements
    Me && this.mightDrag && !this.mightDrag.node.isAtom || // Chrome will sometimes treat a node selection as a
    // cursor, but still report that the node is selected
    // when asked through getSelection. You'll then get a
    // situation where clicking at the point where that
    // (hidden) cursor is doesn't change the selection, and
    // thus doesn't get a reaction from ProseMirror. This
    // works around that.
    Ce && !this.view.state.selection.visible && Math.min(Math.abs(t.pos - this.view.state.selection.from), Math.abs(t.pos - this.view.state.selection.to)) <= 2) ? (si(this.view, H.near(this.view.state.doc.resolve(t.pos))), e.preventDefault()) : Dt(this.view, "pointer");
  }
  move(e) {
    this.updateAllowDefault(e), Dt(this.view, "pointer"), super.move(e);
  }
  updateAllowDefault(e) {
    !this.allowDefault && (Math.abs(this.event.x - e.clientX) > 4 || Math.abs(this.event.y - e.clientY) > 4) && (this.allowDefault = !0);
  }
  delaySelUpdate() {
    return this.allowDefault ? (this.delayedSelectionSync = !0, !0) : !1;
  }
}
class zm extends Dd {
  constructor(e, t) {
    super(e), this.startSelection = t, this.startDoc = e.state.doc;
  }
  move(e) {
    if (e.buttons == 0 || this.view.isDestroyed || !this.view.state.doc.eq(this.startDoc)) {
      this.done();
      return;
    }
    e.preventDefault(), Dt(this.view, "pointer");
    let t = this.view.posAtCoords(oi(e)), r = t && Ad(this.view, t.inside, !1);
    if (!r)
      return;
    let { doc: i } = this.view.state, o = this.startSelection, [s, l] = r.from < o.from ? [o.to, r.from] : [o.from, r.to];
    si(this.view, L.create(i, s, l));
  }
}
De.touchstart = (n) => {
  n.input.lastTouch = Date.now(), Fl(n), Dt(n, "pointer");
};
De.touchmove = (n) => {
  n.input.lastTouch = Date.now(), Dt(n, "pointer");
};
De.contextmenu = (n) => Fl(n);
function Rd(n, e) {
  return n.composing ? !0 : Me && Math.abs(Date.now() - n.input.compositionEndedAt) < 500 ? (n.input.compositionEndedAt = -2e8, !0) : !1;
}
const $m = Nt ? 5e3 : -1;
Re.compositionstart = Re.compositionupdate = (n) => {
  if (!n.composing) {
    n.domObserver.flush();
    let { state: e } = n, t = e.selection.$to;
    if (e.selection instanceof L && (e.storedMarks || !t.textOffset && t.parentOffset && t.nodeBefore.marks.some((r) => r.type.spec.inclusive === !1) || Ce && ld && Fm(n)))
      n.markCursor = n.state.storedMarks || t.marks(), io(n, !0), n.markCursor = null;
    else if (io(n, !e.selection.empty), Ze && e.selection.empty && t.parentOffset && !t.textOffset && t.nodeBefore.marks.length) {
      let r = n.domSelectionRange();
      for (let i = r.focusNode, o = r.focusOffset; i && i.nodeType == 1 && o != 0; ) {
        let s = o < 0 ? i.lastChild : i.childNodes[o - 1];
        if (!s)
          break;
        if (s.nodeType == 3) {
          let l = n.domSelection();
          l && l.collapse(s, s.nodeValue.length);
          break;
        } else
          i = s, o = -1;
      }
    }
    n.input.composing = !0;
  }
  Id(n, $m);
};
function Fm(n) {
  let { focusNode: e, focusOffset: t } = n.domSelectionRange();
  if (!e || e.nodeType != 1 || t >= e.childNodes.length)
    return !1;
  let r = e.childNodes[t];
  return r.nodeType == 1 && r.contentEditable == "false";
}
Re.compositionend = (n, e) => {
  n.composing && (n.input.composing = !1, n.input.compositionEndedAt = Date.now(), n.input.compositionPendingChanges = n.domObserver.pendingRecords().length ? n.input.compositionID : 0, n.input.compositionNode = null, n.input.badSafariComposition ? n.domObserver.forceFlush() : n.input.compositionPendingChanges && Promise.resolve().then(() => n.domObserver.flush()), n.input.compositionID++, Id(n, 20));
};
function Id(n, e) {
  clearTimeout(n.input.composingTimeout), e > -1 && (n.input.composingTimeout = setTimeout(() => io(n), e));
}
function Ld(n) {
  for (n.composing && (n.input.composing = !1, n.input.compositionEndedAt = Date.now()); n.input.compositionNodes.length > 0; )
    n.input.compositionNodes.pop().markParentsDirty();
}
function Vm(n) {
  let e = n.domSelectionRange();
  if (!e.focusNode)
    return null;
  let t = Rp(e.focusNode, e.focusOffset), r = Ip(e.focusNode, e.focusOffset);
  if (t && r && t != r) {
    let i = r.pmViewDesc, o = n.domObserver.lastChangedTextNode;
    if (t == o || r == o)
      return o;
    if (!i || !i.isText(r.nodeValue))
      return r;
    if (n.input.compositionNode == r) {
      let s = t.pmViewDesc;
      if (!(!s || !s.isText(t.nodeValue)))
        return r;
    }
  }
  return t || r;
}
function io(n, e = !1) {
  if (!(Nt && n.domObserver.flushingSoon >= 0)) {
    if (n.domObserver.forceFlush(), Ld(n), e || n.docView && n.docView.dirty) {
      let t = Pl(n), r = n.state.selection;
      return t && !t.eq(r) ? n.dispatch(n.state.tr.setSelection(t)) : (n.markCursor || e) && !r.$from.node(r.$from.sharedDepth(r.to)).inlineContent ? n.dispatch(n.state.tr.deleteSelection()) : n.updateState(n.state), !0;
    }
    return !1;
  }
}
function jm(n, e) {
  if (!n.dom.parentNode)
    return;
  let t = n.dom.parentNode.appendChild(document.createElement("div"));
  t.appendChild(e), t.style.cssText = "position: fixed; left: -10000px; top: 10px";
  let r = getSelection(), i = document.createRange();
  i.selectNodeContents(e), n.dom.blur(), r.removeAllRanges(), r.addRange(i), setTimeout(() => {
    t.parentNode && t.parentNode.removeChild(t), n.focus();
  }, 50);
}
const Fr = He && Gt < 15 || qn && Hp < 604;
De.copy = Re.cut = (n, e) => {
  let t = e, r = n.state.selection, i = t.type == "cut";
  if (r.empty)
    return;
  let o = Fr ? null : t.clipboardData, s = r.content(), { dom: l, text: a } = Hl(n, s);
  o ? (t.preventDefault(), o.clearData(), o.setData("text/html", l.innerHTML), o.setData("text/plain", a)) : jm(n, l), i && n.dispatch(n.state.tr.deleteSelection().scrollIntoView().setMeta("uiEvent", "cut"));
};
function Wm(n) {
  return n.openStart == 0 && n.openEnd == 0 && n.content.childCount == 1 ? n.content.firstChild : null;
}
function _m(n, e) {
  if (!n.dom.parentNode)
    return;
  let t = n.input.shiftKey || n.state.selection.$from.parent.type.spec.code, r = n.dom.parentNode.appendChild(document.createElement(t ? "textarea" : "div"));
  t || (r.contentEditable = "true"), r.style.cssText = "position: fixed; left: -10000px; top: 10px", r.focus();
  let i = n.input.shiftKey && n.input.lastKeyCode != 45;
  setTimeout(() => {
    n.focus(), r.parentNode && r.parentNode.removeChild(r), t ? Vr(n, r.value, null, i, e) : Vr(n, r.textContent, r.innerHTML, i, e);
  }, 50);
}
function Vr(n, e, t, r, i) {
  let o = xd(n, e, t, r, n.state.selection.$from);
  if (n.someProp("handlePaste", (a) => a(n, i, o || A.empty)))
    return !0;
  if (!o)
    return !1;
  let s = Wm(o), l = s ? n.state.tr.replaceSelectionWith(s, r) : n.state.tr.replaceSelection(o);
  return n.dispatch(l.scrollIntoView().setMeta("paste", !0).setMeta("uiEvent", "paste")), !0;
}
function Pd(n) {
  let e = n.getData("text/plain") || n.getData("Text");
  if (e)
    return e;
  let t = n.getData("text/uri-list");
  return t ? t.replace(/\r?\n/g, " ") : "";
}
Re.paste = (n, e) => {
  let t = e;
  if (n.composing && !Nt)
    return;
  let r = Fr ? null : t.clipboardData, i = n.input.shiftKey && n.input.lastKeyCode != 45;
  r && Vr(n, Pd(r), r.getData("text/html"), i, t) ? t.preventDefault() : _m(n, t);
};
class Bd {
  constructor(e, t, r) {
    this.slice = e, this.move = t, this.node = r;
  }
}
const Um = Xe ? "altKey" : "ctrlKey";
function Hd(n, e) {
  let t;
  return n.someProp("dragCopies", (r) => {
    t = t || r(e);
  }), t != null ? !t : !e[Um];
}
De.dragstart = (n, e) => {
  let t = e, r = n.input.mouseDown;
  if (r && r.done(), !t.dataTransfer)
    return;
  let i = n.state.selection, o = i.empty ? null : n.posAtCoords(oi(t)), s;
  if (!(o && o.pos >= i.from && o.pos <= (i instanceof P ? i.to - 1 : i.to))) {
    if (r && r.mightDrag)
      s = P.create(n.state.doc, r.mightDrag.pos);
    else if (t.target && t.target.nodeType == 1) {
      let d = n.docView.nearestDesc(t.target, !0);
      d && d.node.type.spec.draggable && d != n.docView && (s = P.create(n.state.doc, d.posBefore));
    }
  }
  let l = (s || n.state.selection).content(), { dom: a, text: c, slice: u } = Hl(n, l);
  (!t.dataTransfer.files.length || !Ce || sd > 120) && t.dataTransfer.clearData(), t.dataTransfer.setData(Fr ? "Text" : "text/html", a.innerHTML), t.dataTransfer.effectAllowed = "copyMove", Fr || t.dataTransfer.setData("text/plain", c), n.dragging = new Bd(u, Hd(n, t), s);
};
De.dragend = (n) => {
  let e = n.dragging;
  window.setTimeout(() => {
    n.dragging == e && (n.dragging = null);
  }, 50);
};
Re.dragover = Re.dragenter = (n, e) => e.preventDefault();
Re.drop = (n, e) => {
  try {
    Km(n, e, n.dragging);
  } finally {
    n.dragging = null;
  }
};
function Km(n, e, t) {
  if (!e.dataTransfer)
    return;
  let r = n.posAtCoords(oi(e));
  if (!r)
    return;
  let i = n.state.doc.resolve(r.pos), o = t && t.slice;
  o ? n.someProp("transformPasted", (h) => {
    o = h(o, n, !1);
  }) : o = xd(n, Pd(e.dataTransfer), Fr ? null : e.dataTransfer.getData("text/html"), !1, i);
  let s = !!(t && Hd(n, e));
  if (n.someProp("handleDrop", (h) => h(n, e, o || A.empty, s))) {
    e.preventDefault();
    return;
  }
  if (!o)
    return;
  e.preventDefault();
  let l = o ? Xu(n.state.doc, i.pos, o) : i.pos;
  l == null && (l = i.pos);
  let a = n.state.tr;
  if (s) {
    let { node: h } = t;
    h ? h.replace(a) : a.deleteSelection();
  }
  let c = a.mapping.map(l), u = o.openStart == 0 && o.openEnd == 0 && o.content.childCount == 1, d = a.doc;
  if (u ? a.replaceRangeWith(c, c, o.content.firstChild) : a.replaceRange(c, c, o), a.doc.eq(d))
    return;
  let f = a.doc.resolve(c);
  if (u && P.isSelectable(o.content.firstChild) && f.nodeAfter && f.nodeAfter.sameMarkup(o.content.firstChild))
    a.setSelection(new P(f));
  else {
    let h = a.mapping.map(l);
    a.mapping.maps[a.mapping.maps.length - 1].forEach((p, m, g, b) => h = b), a.setSelection(Bl(n, f, a.doc.resolve(h)));
  }
  n.focus(), n.dispatch(a.setMeta("uiEvent", "drop"));
}
De.focus = (n) => {
  n.input.lastFocus = Date.now(), n.focused || (n.domObserver.stop(), n.dom.classList.add("ProseMirror-focused"), n.domObserver.start(), n.focused = !0, setTimeout(() => {
    n.docView && n.hasFocus() && !n.domObserver.currentSelection.eq(n.domSelectionRange()) && Pt(n);
  }, 20));
};
De.blur = (n, e) => {
  let t = e;
  n.focused && (n.domObserver.stop(), n.dom.classList.remove("ProseMirror-focused"), n.domObserver.start(), t.relatedTarget && n.dom.contains(t.relatedTarget) && n.domObserver.currentSelection.clear(), n.focused = !1);
};
De.beforeinput = (n, e) => {
  if (Nt && e.inputType == "deleteContentBackward") {
    n.domObserver.flushSoon();
    let { domChangeCount: r } = n.input;
    setTimeout(() => {
      if (n.input.domChangeCount != r || (n.dom.blur(), n.focus(), n.someProp("handleKeyDown", (o) => o(n, cn(8, "Backspace")))))
        return;
      let { $cursor: i } = n.state.selection;
      i && i.pos > 0 && n.dispatch(n.state.tr.delete(i.pos - 1, i.pos).scrollIntoView());
    }, 50);
  }
};
for (let n in Re)
  De[n] = Re[n];
function jr(n, e) {
  if (n == e)
    return !0;
  for (let t in n)
    if (n[t] !== e[t])
      return !1;
  for (let t in e)
    if (!(t in n))
      return !1;
  return !0;
}
class oo {
  constructor(e, t) {
    this.toDOM = e, this.spec = t || bn, this.side = this.spec.side || 0;
  }
  map(e, t, r, i) {
    let { pos: o, deleted: s } = e.mapResult(t.from + i, this.side < 0 ? -1 : 1);
    return s ? null : new me(o - r, o - r, this);
  }
  valid() {
    return !0;
  }
  eq(e) {
    return this == e || e instanceof oo && (this.spec.key && this.spec.key == e.spec.key || this.toDOM == e.toDOM && jr(this.spec, e.spec));
  }
  destroy(e) {
    this.spec.destroy && this.spec.destroy(e);
  }
}
class Qt {
  constructor(e, t) {
    this.attrs = e, this.spec = t || bn;
  }
  map(e, t, r, i) {
    let o = e.map(t.from + i, this.spec.inclusiveStart ? -1 : 1) - r, s = e.map(t.to + i, this.spec.inclusiveEnd ? 1 : -1) - r;
    return o >= s ? null : new me(o, s, this);
  }
  valid(e, t) {
    return t.from < t.to;
  }
  eq(e) {
    return this == e || e instanceof Qt && jr(this.attrs, e.attrs) && jr(this.spec, e.spec);
  }
  static is(e) {
    return e.type instanceof Qt;
  }
  destroy() {
  }
}
class Vl {
  constructor(e, t) {
    this.attrs = e, this.spec = t || bn;
  }
  map(e, t, r, i) {
    let o = e.mapResult(t.from + i, 1);
    if (o.deleted)
      return null;
    let s = e.mapResult(t.to + i, -1);
    return s.deleted || s.pos <= o.pos ? null : new me(o.pos - r, s.pos - r, this);
  }
  valid(e, t) {
    let { index: r, offset: i } = e.content.findIndex(t.from), o;
    return i == t.from && !(o = e.child(r)).isText && i + o.nodeSize == t.to;
  }
  eq(e) {
    return this == e || e instanceof Vl && jr(this.attrs, e.attrs) && jr(this.spec, e.spec);
  }
  destroy() {
  }
}
class me {
  /**
  @internal
  */
  constructor(e, t, r) {
    this.from = e, this.to = t, this.type = r;
  }
  /**
  @internal
  */
  copy(e, t) {
    return new me(e, t, this.type);
  }
  /**
  @internal
  */
  eq(e, t = 0) {
    return this.type.eq(e.type) && this.from + t == e.from && this.to + t == e.to;
  }
  /**
  @internal
  */
  map(e, t, r) {
    return this.type.map(e, this, t, r);
  }
  /**
  Creates a widget decoration, which is a DOM node that's shown in
  the document at the given position. It is recommended that you
  delay rendering the widget by passing a function that will be
  called when the widget is actually drawn in a view, but you can
  also directly pass a DOM node. `getPos` can be used to find the
  widget's current document position.
  */
  static widget(e, t, r) {
    return new me(e, e, new oo(t, r));
  }
  /**
  Creates an inline decoration, which adds the given attributes to
  each inline node between `from` and `to`.
  */
  static inline(e, t, r, i) {
    return new me(e, t, new Qt(r, i));
  }
  /**
  Creates a node decoration. `from` and `to` should point precisely
  before and after a node in the document. That node, and only that
  node, will receive the given attributes.
  */
  static node(e, t, r, i) {
    return new me(e, t, new Vl(r, i));
  }
  /**
  The spec provided when creating this decoration. Can be useful
  if you've stored extra information in that object.
  */
  get spec() {
    return this.type.spec;
  }
  /**
  @internal
  */
  get inline() {
    return this.type instanceof Qt;
  }
  /**
  @internal
  */
  get widget() {
    return this.type instanceof oo;
  }
}
const zn = [], bn = {};
class ee {
  /**
  @internal
  */
  constructor(e, t) {
    this.local = e.length ? e : zn, this.children = t.length ? t : zn;
  }
  /**
  Create a set of decorations, using the structure of the given
  document. This will consume (modify) the `decorations` array, so
  you must make a copy if you want need to preserve that.
  */
  static create(e, t) {
    return t.length ? so(t, e, 0, bn) : Ee;
  }
  /**
  Find all decorations in this set which touch the given range
  (including decorations that start or end directly at the
  boundaries) and match the given predicate on their spec. When
  `start` and `end` are omitted, all decorations in the set are
  considered. When `predicate` isn't given, all decorations are
  assumed to match.
  */
  find(e, t, r) {
    let i = [];
    return this.findInner(e ?? 0, t ?? 1e9, i, 0, r), i;
  }
  findInner(e, t, r, i, o) {
    for (let s = 0; s < this.local.length; s++) {
      let l = this.local[s];
      l.from <= t && l.to >= e && (!o || o(l.spec)) && r.push(l.copy(l.from + i, l.to + i));
    }
    for (let s = 0; s < this.children.length; s += 3)
      if (this.children[s] < t && this.children[s + 1] > e) {
        let l = this.children[s] + 1;
        this.children[s + 2].findInner(e - l, t - l, r, i + l, o);
      }
  }
  /**
  Map the set of decorations in response to a change in the
  document.
  */
  map(e, t, r) {
    return this == Ee || e.maps.length == 0 ? this : this.mapInner(e, t, 0, 0, r || bn);
  }
  /**
  @internal
  */
  mapInner(e, t, r, i, o) {
    let s;
    for (let l = 0; l < this.local.length; l++) {
      let a = this.local[l].map(e, r, i);
      a && a.type.valid(t, a) ? (s || (s = [])).push(a) : o.onRemove && o.onRemove(this.local[l].spec);
    }
    return this.children.length ? qm(this.children, s || [], e, t, r, i, o) : s ? new ee(s.sort(vn), zn) : Ee;
  }
  /**
  Add the given array of decorations to the ones in the set,
  producing a new set. Consumes the `decorations` array. Needs
  access to the current document to create the appropriate tree
  structure.
  */
  add(e, t) {
    return t.length ? this == Ee ? ee.create(e, t) : this.addInner(e, t, 0) : this;
  }
  addInner(e, t, r) {
    let i, o = 0;
    e.forEach((l, a) => {
      let c = a + r, u;
      if (u = $d(t, l, c)) {
        for (i || (i = this.children.slice()); o < i.length && i[o] < a; )
          o += 3;
        i[o] == a ? i[o + 2] = i[o + 2].addInner(l, u, c + 1) : i.splice(o, 0, a, a + l.nodeSize, so(u, l, c + 1, bn)), o += 3;
      }
    });
    let s = zd(o ? Fd(t) : t, -r);
    for (let l = 0; l < s.length; l++)
      s[l].type.valid(e, s[l]) || s.splice(l--, 1);
    return new ee(s.length ? this.local.concat(s).sort(vn) : this.local, i || this.children);
  }
  /**
  Create a new set that contains the decorations in this set, minus
  the ones in the given array.
  */
  remove(e) {
    return e.length == 0 || this == Ee ? this : this.removeInner(e, 0);
  }
  removeInner(e, t) {
    let r = this.children, i = this.local;
    for (let o = 0; o < r.length; o += 3) {
      let s, l = r[o] + t, a = r[o + 1] + t;
      for (let u = 0, d; u < e.length; u++)
        (d = e[u]) && d.from > l && d.to < a && (e[u] = null, (s || (s = [])).push(d));
      if (!s)
        continue;
      r == this.children && (r = this.children.slice());
      let c = r[o + 2].removeInner(s, l + 1);
      c != Ee ? r[o + 2] = c : (r.splice(o, 3), o -= 3);
    }
    if (i.length) {
      for (let o = 0, s; o < e.length; o++)
        if (s = e[o])
          for (let l = 0; l < i.length; l++)
            i[l].eq(s, t) && (i == this.local && (i = this.local.slice()), i.splice(l--, 1));
    }
    return r == this.children && i == this.local ? this : i.length || r.length ? new ee(i, r) : Ee;
  }
  forChild(e, t) {
    if (this == Ee)
      return this;
    if (t.isLeaf)
      return ee.empty;
    let r, i;
    for (let l = 0; l < this.children.length; l += 3)
      if (this.children[l] >= e) {
        this.children[l] == e && (r = this.children[l + 2]);
        break;
      }
    let o = e + 1, s = o + t.content.size;
    for (let l = 0; l < this.local.length; l++) {
      let a = this.local[l];
      if (a.from < s && a.to > o && a.type instanceof Qt) {
        let c = Math.max(o, a.from) - o, u = Math.min(s, a.to) - o;
        c < u && (i || (i = [])).push(a.copy(c, u));
      }
    }
    if (i) {
      let l = new ee(i.sort(vn), zn);
      return r ? new _t([l, r]) : l;
    }
    return r || Ee;
  }
  /**
  @internal
  */
  eq(e) {
    if (this == e)
      return !0;
    if (!(e instanceof ee) || this.local.length != e.local.length || this.children.length != e.children.length)
      return !1;
    for (let t = 0; t < this.local.length; t++)
      if (!this.local[t].eq(e.local[t]))
        return !1;
    for (let t = 0; t < this.children.length; t += 3)
      if (this.children[t] != e.children[t] || this.children[t + 1] != e.children[t + 1] || !this.children[t + 2].eq(e.children[t + 2]))
        return !1;
    return !0;
  }
  /**
  @internal
  */
  locals(e) {
    return jl(this.localsInner(e));
  }
  /**
  @internal
  */
  localsInner(e) {
    if (this == Ee)
      return zn;
    if (e.inlineContent || !this.local.some(Qt.is))
      return this.local;
    let t = [];
    for (let r = 0; r < this.local.length; r++)
      this.local[r].type instanceof Qt || t.push(this.local[r]);
    return t;
  }
  forEachSet(e) {
    e(this);
  }
}
ee.empty = new ee([], []);
ee.removeOverlap = jl;
const Ee = ee.empty;
class _t {
  constructor(e) {
    this.members = e;
  }
  map(e, t) {
    const r = this.members.map((i) => i.map(e, t, bn));
    return _t.from(r);
  }
  forChild(e, t) {
    if (t.isLeaf)
      return ee.empty;
    let r = [];
    for (let i = 0; i < this.members.length; i++) {
      let o = this.members[i].forChild(e, t);
      o != Ee && (o instanceof _t ? r = r.concat(o.members) : r.push(o));
    }
    return _t.from(r);
  }
  eq(e) {
    if (!(e instanceof _t) || e.members.length != this.members.length)
      return !1;
    for (let t = 0; t < this.members.length; t++)
      if (!this.members[t].eq(e.members[t]))
        return !1;
    return !0;
  }
  locals(e) {
    let t, r = !0;
    for (let i = 0; i < this.members.length; i++) {
      let o = this.members[i].localsInner(e);
      if (o.length)
        if (!t)
          t = o;
        else {
          r && (t = t.slice(), r = !1);
          for (let s = 0; s < o.length; s++)
            t.push(o[s]);
        }
    }
    return t ? jl(r ? t : t.sort(vn)) : zn;
  }
  // Create a group for the given array of decoration sets, or return
  // a single set when possible.
  static from(e) {
    switch (e.length) {
      case 0:
        return Ee;
      case 1:
        return e[0];
      default:
        return new _t(e.every((t) => t instanceof ee) ? e : e.reduce((t, r) => t.concat(r instanceof ee ? r : r.members), []));
    }
  }
  forEachSet(e) {
    for (let t = 0; t < this.members.length; t++)
      this.members[t].forEachSet(e);
  }
}
function qm(n, e, t, r, i, o, s) {
  let l = n.slice();
  for (let c = 0, u = o; c < t.maps.length; c++) {
    let d = 0;
    t.maps[c].forEach((f, h, p, m) => {
      let g = m - p - (h - f);
      for (let b = 0; b < l.length; b += 3) {
        let T = l[b + 1];
        if (T < 0 || f > T + u - d)
          continue;
        let S = l[b] + u - d;
        h >= S ? l[b + 1] = f <= S ? -2 : -1 : f >= u && g && (l[b] += g, l[b + 1] += g);
      }
      d += g;
    }), u = t.maps[c].map(u, -1);
  }
  let a = !1;
  for (let c = 0; c < l.length; c += 3)
    if (l[c + 1] < 0) {
      if (l[c + 1] == -2) {
        a = !0, l[c + 1] = -1;
        continue;
      }
      let u = t.map(n[c] + o), d = u - i;
      if (d < 0 || d >= r.content.size) {
        a = !0;
        continue;
      }
      let f = t.map(n[c + 1] + o, -1), h = f - i, { index: p, offset: m } = r.content.findIndex(d), g = r.maybeChild(p);
      if (g && m == d && m + g.nodeSize == h) {
        let b = l[c + 2].mapInner(t, g, u + 1, n[c] + o + 1, s);
        b != Ee ? (l[c] = d, l[c + 1] = h, l[c + 2] = b) : (l[c + 1] = -2, a = !0);
      } else
        a = !0;
    }
  if (a) {
    let c = Jm(l, n, e, t, i, o, s), u = so(c, r, 0, s);
    e = u.local;
    for (let d = 0; d < l.length; d += 3)
      l[d + 1] < 0 && (l.splice(d, 3), d -= 3);
    for (let d = 0, f = 0; d < u.children.length; d += 3) {
      let h = u.children[d];
      for (; f < l.length && l[f] < h; )
        f += 3;
      l.splice(f, 0, u.children[d], u.children[d + 1], u.children[d + 2]);
    }
  }
  return new ee(e.sort(vn), l);
}
function zd(n, e) {
  if (!e || !n.length)
    return n;
  let t = [];
  for (let r = 0; r < n.length; r++) {
    let i = n[r];
    t.push(new me(i.from + e, i.to + e, i.type));
  }
  return t;
}
function Jm(n, e, t, r, i, o, s) {
  function l(a, c) {
    for (let u = 0; u < a.local.length; u++) {
      let d = a.local[u].map(r, i, c);
      d ? t.push(d) : s.onRemove && s.onRemove(a.local[u].spec);
    }
    for (let u = 0; u < a.children.length; u += 3)
      l(a.children[u + 2], a.children[u] + c + 1);
  }
  for (let a = 0; a < n.length; a += 3)
    n[a + 1] == -1 && l(n[a + 2], e[a] + o + 1);
  return t;
}
function $d(n, e, t) {
  if (e.isLeaf)
    return null;
  let r = t + e.nodeSize, i = null;
  for (let o = 0, s; o < n.length; o++)
    (s = n[o]) && s.from > t && s.to < r && ((i || (i = [])).push(s), n[o] = null);
  return i;
}
function Fd(n) {
  let e = [];
  for (let t = 0; t < n.length; t++)
    n[t] != null && e.push(n[t]);
  return e;
}
function so(n, e, t, r) {
  let i = [], o = !1;
  e.forEach((l, a) => {
    let c = $d(n, l, a + t);
    if (c) {
      o = !0;
      let u = so(c, l, t + a + 1, r);
      u != Ee && i.push(a, a + l.nodeSize, u);
    }
  });
  let s = zd(o ? Fd(n) : n, -t).sort(vn);
  for (let l = 0; l < s.length; l++)
    s[l].type.valid(e, s[l]) || (r.onRemove && r.onRemove(s[l].spec), s.splice(l--, 1));
  return s.length || i.length ? new ee(s, i) : Ee;
}
function vn(n, e) {
  return n.from - e.from || n.to - e.to;
}
function jl(n) {
  let e = n;
  for (let t = 0; t < e.length - 1; t++) {
    let r = e[t];
    if (r.from != r.to)
      for (let i = t + 1; i < e.length; i++) {
        let o = e[i];
        if (o.from == r.from) {
          o.to != r.to && (e == n && (e = n.slice()), e[i] = o.copy(o.from, r.to), ac(e, i + 1, o.copy(r.to, o.to)));
          continue;
        } else {
          o.from < r.to && (e == n && (e = n.slice()), e[t] = r.copy(r.from, o.from), ac(e, i, r.copy(o.from, r.to)));
          break;
        }
      }
  }
  return e;
}
function ac(n, e, t) {
  for (; e < n.length && vn(t, n[e]) > 0; )
    e++;
  n.splice(e, 0, t);
}
function ys(n) {
  let e = [];
  return n.someProp("decorations", (t) => {
    let r = t(n.state);
    r && r != Ee && e.push(r);
  }), n.cursorWrapper && e.push(ee.create(n.state.doc, [n.cursorWrapper.deco])), _t.from(e);
}
const Gm = {
  childList: !0,
  characterData: !0,
  characterDataOldValue: !0,
  attributes: !0,
  attributeOldValue: !0,
  subtree: !0
}, Ym = He && Gt <= 11;
class Xm {
  constructor() {
    this.anchorNode = null, this.anchorOffset = 0, this.focusNode = null, this.focusOffset = 0;
  }
  set(e) {
    this.anchorNode = e.anchorNode, this.anchorOffset = e.anchorOffset, this.focusNode = e.focusNode, this.focusOffset = e.focusOffset;
  }
  clear() {
    this.anchorNode = this.focusNode = null;
  }
  eq(e) {
    return e.anchorNode == this.anchorNode && e.anchorOffset == this.anchorOffset && e.focusNode == this.focusNode && e.focusOffset == this.focusOffset;
  }
}
class Qm {
  constructor(e, t) {
    this.view = e, this.handleDOMChange = t, this.queue = [], this.flushingSoon = -1, this.observer = null, this.currentSelection = new Xm(), this.onCharData = null, this.suppressingSelectionUpdates = !1, this.lastChangedTextNode = null, this.observer = window.MutationObserver && new window.MutationObserver((r) => {
      for (let i = 0; i < r.length; i++)
        this.queue.push(r[i]);
      He && Gt <= 11 && r.some((i) => i.type == "childList" && i.removedNodes.length || i.type == "characterData" && i.oldValue.length > i.target.nodeValue.length) ? this.flushSoon() : Me && e.composing && r.some((i) => i.type == "childList" && i.target.nodeName == "TR") ? (e.input.badSafariComposition = !0, this.flushSoon()) : this.flush();
    }), Ym && (this.onCharData = (r) => {
      this.queue.push({ target: r.target, type: "characterData", oldValue: r.prevValue }), this.flushSoon();
    }), this.onSelectionChange = this.onSelectionChange.bind(this);
  }
  flushSoon() {
    this.flushingSoon < 0 && (this.flushingSoon = window.setTimeout(() => {
      this.flushingSoon = -1, this.flush();
    }, 20));
  }
  forceFlush() {
    this.flushingSoon > -1 && (window.clearTimeout(this.flushingSoon), this.flushingSoon = -1, this.flush());
  }
  start() {
    this.observer && (this.observer.takeRecords(), this.observer.observe(this.view.dom, Gm)), this.onCharData && this.view.dom.addEventListener("DOMCharacterDataModified", this.onCharData), this.connectSelection();
  }
  stop() {
    if (this.observer) {
      let e = this.observer.takeRecords();
      if (e.length) {
        for (let t = 0; t < e.length; t++)
          this.queue.push(e[t]);
        window.setTimeout(() => this.flush(), 20);
      }
      this.observer.disconnect();
    }
    this.onCharData && this.view.dom.removeEventListener("DOMCharacterDataModified", this.onCharData), this.disconnectSelection();
  }
  connectSelection() {
    this.view.dom.ownerDocument.addEventListener("selectionchange", this.onSelectionChange);
  }
  disconnectSelection() {
    this.view.dom.ownerDocument.removeEventListener("selectionchange", this.onSelectionChange);
  }
  suppressSelectionUpdates() {
    this.suppressingSelectionUpdates = !0, setTimeout(() => this.suppressingSelectionUpdates = !1, 50);
  }
  onSelectionChange() {
    if (tc(this.view)) {
      if (this.suppressingSelectionUpdates)
        return Pt(this.view);
      if (He && Gt <= 11 && !this.view.state.selection.empty) {
        let e = this.view.domSelectionRange();
        if (e.focusNode && Cn(e.focusNode, e.focusOffset, e.anchorNode, e.anchorOffset))
          return this.flushSoon();
      }
      this.flush();
    }
  }
  setCurSelection() {
    this.currentSelection.set(this.view.domSelectionRange());
  }
  ignoreSelectionChange(e) {
    if (!e.focusNode)
      return !0;
    let t = /* @__PURE__ */ new Set(), r;
    for (let o = e.focusNode; o; o = Kn(o))
      t.add(o);
    for (let o = e.anchorNode; o; o = Kn(o))
      if (t.has(o)) {
        r = o;
        break;
      }
    let i = r && this.view.docView.nearestDesc(r);
    if (i && i.ignoreMutation({
      type: "selection",
      target: r.nodeType == 3 ? r.parentNode : r
    }))
      return this.setCurSelection(), !0;
  }
  pendingRecords() {
    if (this.observer)
      for (let e of this.observer.takeRecords())
        this.queue.push(e);
    return this.queue;
  }
  flush() {
    let { view: e } = this;
    if (!e.docView || this.flushingSoon > -1)
      return;
    let t = this.pendingRecords();
    t.length && (this.queue = []);
    let r = e.domSelectionRange(), i = !this.suppressingSelectionUpdates && !this.currentSelection.eq(r) && tc(e) && !this.ignoreSelectionChange(r), o = -1, s = -1, l = !1, a = [];
    if (e.editable)
      for (let u = 0; u < t.length; u++) {
        let d = this.registerMutation(t[u], a);
        d && (o = o < 0 ? d.from : Math.min(d.from, o), s = s < 0 ? d.to : Math.max(d.to, s), d.typeOver && (l = !0));
      }
    if (a.some((u) => u.nodeName == "BR") && (e.input.lastKeyCode == 8 || e.input.lastKeyCode == 46 || Ce && (e.composing || e.input.compositionEndedAt > Date.now() - 50) && t.some((u) => u.type == "childList" && u.removedNodes.length))) {
      for (let u of a)
        if (u.nodeName == "BR" && u.parentNode) {
          let d = u.nextSibling;
          for (; d && d.nodeType == 1; ) {
            if (d.contentEditable == "false") {
              u.parentNode.removeChild(u);
              break;
            }
            d = d.firstChild;
          }
        }
    } else if (Ze && a.length) {
      let u = a.filter((d) => d.nodeName == "BR");
      if (u.length == 2) {
        let [d, f] = u;
        d.parentNode && d.parentNode.parentNode == f.parentNode ? f.remove() : d.remove();
      } else {
        let { focusNode: d } = this.currentSelection;
        for (let f of u) {
          let h = f.parentNode;
          h && h.nodeName == "LI" && (!d || tg(e, d) != h) && f.remove();
        }
      }
    }
    let c = null;
    o < 0 && i && e.input.lastFocus > Date.now() - 200 && Math.max(e.input.lastTouch, e.input.lastClick.time) < Date.now() - 300 && Ko(r) && (c = Pl(e)) && c.eq(H.near(e.state.doc.resolve(0), 1)) ? (e.input.lastFocus = 0, Pt(e), this.currentSelection.set(r), e.scrollToSelection()) : (o > -1 || i) && (o > -1 && (e.docView.markDirty(o, s), Zm(e)), e.input.badSafariComposition && (e.input.badSafariComposition = !1, ng(e, a)), this.handleDOMChange(o, s, l, a), e.docView && e.docView.dirty ? e.updateState(e.state) : this.currentSelection.eq(r) || Pt(e), this.currentSelection.set(r));
  }
  registerMutation(e, t) {
    if (t.indexOf(e.target) > -1)
      return null;
    let r = this.view.docView.nearestDesc(e.target);
    if (e.type == "attributes" && (r == this.view.docView || e.attributeName == "contenteditable" || // Firefox sometimes fires spurious events for null/empty styles
    e.attributeName == "style" && !e.oldValue && !e.target.getAttribute("style")) || !r || r.ignoreMutation(e))
      return null;
    if (e.type == "childList") {
      for (let u = 0; u < e.addedNodes.length; u++) {
        let d = e.addedNodes[u];
        t.push(d), d.nodeType == 3 && (this.lastChangedTextNode = d);
      }
      if (r.contentDOM && r.contentDOM != r.dom && !r.contentDOM.contains(e.target))
        return { from: r.posBefore, to: r.posAfter };
      let i = e.previousSibling, o = e.nextSibling;
      if (He && Gt <= 11 && e.addedNodes.length)
        for (let u = 0; u < e.addedNodes.length; u++) {
          let { previousSibling: d, nextSibling: f } = e.addedNodes[u];
          (!d || Array.prototype.indexOf.call(e.addedNodes, d) < 0) && (i = d), (!f || Array.prototype.indexOf.call(e.addedNodes, f) < 0) && (o = f);
        }
      let s = i && i.parentNode == e.target ? Se(i) + 1 : 0, l = r.localPosFromDOM(e.target, s, -1), a = o && o.parentNode == e.target ? Se(o) : e.target.childNodes.length, c = r.localPosFromDOM(e.target, a, 1);
      return { from: l, to: c };
    } else return e.type == "attributes" ? { from: r.posAtStart - r.border, to: r.posAtEnd + r.border } : (this.lastChangedTextNode = e.target, {
      from: r.posAtStart,
      to: r.posAtEnd,
      // An event was generated for a text change that didn't change
      // any text. Mark the dom change to fall back to assuming the
      // selection was typed over with an identical value if it can't
      // find another change.
      typeOver: e.target.nodeValue == e.oldValue
    });
  }
}
let cc = /* @__PURE__ */ new WeakMap(), uc = !1;
function Zm(n) {
  if (!cc.has(n) && (cc.set(n, null), ["normal", "nowrap", "pre-line"].indexOf(getComputedStyle(n.dom).whiteSpace) !== -1)) {
    if (n.requiresGeckoHackNode = Ze, uc)
      return;
    console.warn("ProseMirror expects the CSS white-space property to be set, preferably to 'pre-wrap'. It is recommended to load style/prosemirror.css from the prosemirror-view package."), uc = !0;
  }
}
function dc(n, e) {
  let t = e.startContainer, r = e.startOffset, i = e.endContainer, o = e.endOffset, s = n.domAtPos(n.state.selection.anchor);
  return Cn(s.node, s.offset, i, o) && ([t, r, i, o] = [i, o, t, r]), { anchorNode: t, anchorOffset: r, focusNode: i, focusOffset: o };
}
function eg(n, e) {
  if (e.getComposedRanges) {
    let i = e.getComposedRanges(n.root)[0];
    if (i)
      return dc(n, i);
  }
  let t;
  function r(i) {
    i.preventDefault(), i.stopImmediatePropagation(), t = i.getTargetRanges()[0];
  }
  return n.dom.addEventListener("beforeinput", r, !0), document.execCommand("indent"), n.dom.removeEventListener("beforeinput", r, !0), t ? dc(n, t) : null;
}
function tg(n, e) {
  for (let t = e.parentNode; t && t != n.dom; t = t.parentNode) {
    let r = n.docView.nearestDesc(t, !0);
    if (r && r.node.isBlock)
      return t;
  }
  return null;
}
function ng(n, e) {
  var t;
  let { focusNode: r, focusOffset: i } = n.domSelectionRange();
  for (let o of e)
    if (((t = o.parentNode) === null || t === void 0 ? void 0 : t.nodeName) == "TR") {
      let s = o.nextSibling;
      for (; s && s.nodeName != "TD" && s.nodeName != "TH"; )
        s = s.nextSibling;
      if (s) {
        let l = s;
        for (; ; ) {
          let a = l.firstChild;
          if (!a || a.nodeType != 1 || a.contentEditable == "false" || /^(BR|IMG)$/.test(a.nodeName))
            break;
          l = a;
        }
        l.insertBefore(o, l.firstChild), r == o && n.domSelection().collapse(o, i);
      } else
        o.parentNode.removeChild(o);
    }
}
function rg(n, e, t, r) {
  let { node: i, fromOffset: o, toOffset: s, from: l, to: a } = n.docView.parseRange(e, t), c = n.domSelectionRange(), u, d = c.anchorNode;
  if (d && n.dom.contains(d.nodeType == 1 ? d : d.parentNode) && (u = [{ node: d, offset: c.anchorOffset }], Ko(c) || u.push({ node: c.focusNode, offset: c.focusOffset })), Ce && n.input.lastKeyCode === 8)
    for (let b = s; b > o; b--) {
      let T = i.childNodes[b - 1], S = T.pmViewDesc;
      if (T.nodeName == "BR" && !S) {
        s = b;
        break;
      }
      if (!S || S.size)
        break;
    }
  let f = n.state.doc, h = n.someProp("domParser") || Jt.fromSchema(n.state.schema), p = f.resolve(l), m = null, g = h.parse(i, {
    topNode: p.parent,
    topMatch: p.parent.contentMatchAt(p.index()),
    topOpen: !0,
    from: o,
    to: s,
    preserveWhitespace: p.parent.type.whitespace == "pre" ? "full" : !0,
    findPositions: u,
    ruleFromNode: ig(r),
    context: p
  });
  if (u && u[0].pos != null) {
    let b = u[0].pos, T = u[1] && u[1].pos;
    T == null && (T = b), m = { anchor: b + l, head: T + l };
  }
  return { doc: g, sel: m, from: l, to: a };
}
const ig = (n) => (e) => {
  let t = e.pmViewDesc;
  if (t)
    return t.parseRule(n);
  if (e.nodeName == "BR" && e.parentNode) {
    if (Me && /^(ul|ol)$/i.test(e.parentNode.nodeName)) {
      let r = document.createElement("div");
      return r.appendChild(document.createElement("li")), { skip: r };
    } else if (e.parentNode.lastChild == e || Me && /^(tr|table)$/i.test(e.parentNode.nodeName))
      return { ignore: !0 };
  } else if (e.nodeName == "IMG" && e.getAttribute("mark-placeholder"))
    return { ignore: !0 };
  return null;
}, og = /^(a|abbr|acronym|b|bd[io]|big|br|button|cite|code|data(list)?|del|dfn|em|i|img|ins|kbd|label|map|mark|meter|output|q|ruby|s|samp|small|span|strong|su[bp]|time|u|tt|var)$/i;
function sg(n, e, t, r, i) {
  let o = n.input.compositionPendingChanges || (n.composing ? n.input.compositionID : 0);
  if (n.input.compositionPendingChanges = 0, e < 0) {
    let E = n.input.lastSelectionTime > Date.now() - 50 ? n.input.lastSelectionOrigin : null, k = Pl(n, E);
    if (k && !n.state.selection.eq(k)) {
      if (Ce && Nt && n.input.lastKeyCode === 13 && Date.now() - 100 < n.input.lastKeyCodeTime && n.someProp("handleKeyDown", (j) => j(n, cn(13, "Enter"))))
        return;
      let I = n.state.tr.setSelection(k);
      E == "pointer" ? I.setMeta("pointer", !0) : E == "key" && I.scrollIntoView(), o && I.setMeta("composition", o), n.dispatch(I);
    }
    return;
  }
  let s = n.state.doc.resolve(e), l = s.sharedDepth(t);
  e = s.before(l + 1), t = n.state.doc.resolve(t).after(l + 1);
  let a = n.state.selection, c = rg(n, e, t, i), u = n.state.doc, d = u.slice(c.from, c.to), f, h;
  n.input.lastKeyCode === 8 && Date.now() - 100 < n.input.lastKeyCodeTime ? (f = n.state.selection.to, h = "end") : (f = n.state.selection.from, h = "start"), n.input.lastKeyCode = null;
  let p = cg(d.content, c.doc.content, c.from, f, h);
  if (p && n.input.domChangeCount++, (qn && n.input.lastIOSEnter > Date.now() - 225 || Nt) && i.some((E) => E.nodeType == 1 && !og.test(E.nodeName)) && (!p || p.endA >= p.endB) && n.someProp("handleKeyDown", (E) => E(n, cn(13, "Enter")))) {
    n.input.lastIOSEnter = 0;
    return;
  }
  if (!p)
    if (r && a instanceof L && !a.empty && a.$head.sameParent(a.$anchor) && !n.composing && !(c.sel && c.sel.anchor != c.sel.head))
      p = { start: a.from, endA: a.to, endB: a.to };
    else {
      if (c.sel) {
        let E = fc(n, n.state.doc, c.sel);
        if (E && !E.eq(n.state.selection)) {
          let k = n.state.tr.setSelection(E);
          o && k.setMeta("composition", o), n.dispatch(k);
        }
      }
      return;
    }
  n.state.selection.from < n.state.selection.to && p.start == p.endB && n.state.selection instanceof L && (p.start > n.state.selection.from && p.start <= n.state.selection.from + 2 && n.state.selection.from >= c.from ? p.start = n.state.selection.from : p.endA < n.state.selection.to && p.endA >= n.state.selection.to - 2 && n.state.selection.to <= c.to && (p.endB += n.state.selection.to - p.endA, p.endA = n.state.selection.to)), He && Gt <= 11 && p.endB == p.start + 1 && p.endA == p.start && p.start > c.from && c.doc.textBetween(p.start - c.from - 1, p.start - c.from + 1) == "  " && (p.start--, p.endA--, p.endB--);
  let m = c.doc.resolveNoCache(p.start - c.from), g = c.doc.resolveNoCache(p.endB - c.from), b = u.resolve(p.start), T = m.sameParent(g) && m.parent.inlineContent && b.end() >= p.endA;
  if ((qn && n.input.lastIOSEnter > Date.now() - 225 && (!T || i.some((E) => E.nodeName == "DIV" || E.nodeName == "P")) || !T && m.pos < c.doc.content.size && (!m.sameParent(g) || !m.parent.inlineContent) && m.pos < g.pos && !/\S/.test(c.doc.textBetween(m.pos, g.pos, "", ""))) && n.someProp("handleKeyDown", (E) => E(n, cn(13, "Enter")))) {
    n.input.lastIOSEnter = 0;
    return;
  }
  if (n.state.selection.anchor > p.start && ag(u, p.start, p.endA, m, g) && n.someProp("handleKeyDown", (E) => E(n, cn(8, "Backspace")))) {
    Nt && Ce && n.domObserver.suppressSelectionUpdates();
    return;
  }
  Ce && p.endB == p.start && (n.input.lastChromeDelete = Date.now()), Nt && !T && m.start() != g.start() && g.parentOffset == 0 && m.depth == g.depth && c.sel && c.sel.anchor == c.sel.head && c.sel.head == p.endA && (p.endB -= 2, g = c.doc.resolveNoCache(p.endB - c.from), setTimeout(() => {
    n.someProp("handleKeyDown", function(E) {
      return E(n, cn(13, "Enter"));
    });
  }, 20));
  let S = p.start, y = p.endA, O = (E) => {
    let k = E || n.state.tr.replace(S, y, c.doc.slice(p.start - c.from, p.endB - c.from));
    if (c.sel) {
      let I = fc(n, k.doc, c.sel);
      I && !(Ce && n.composing && I.empty && (p.start != p.endB || n.input.lastChromeDelete < Date.now() - 100) && (I.head == S || I.head == k.mapping.map(y) - 1) || He && I.empty && I.head == S) && k.setSelection(I);
    }
    return o && k.setMeta("composition", o), k.scrollIntoView();
  }, x;
  if (T)
    if (m.pos == g.pos) {
      He && Gt <= 11 && m.parentOffset == 0 && (n.domObserver.suppressSelectionUpdates(), setTimeout(() => Pt(n), 20));
      let E = O(n.state.tr.delete(S, y)), k = u.resolve(p.start).marksAcross(u.resolve(p.endA));
      k && E.ensureMarks(k), n.dispatch(E);
    } else if (
      // Adding or removing a mark
      p.endA == p.endB && (x = lg(m.parent.content.cut(m.parentOffset, g.parentOffset), b.parent.content.cut(b.parentOffset, p.endA - b.start())))
    ) {
      let E = O(n.state.tr);
      x.type == "add" ? E.addMark(S, y, x.mark) : E.removeMark(S, y, x.mark), n.dispatch(E);
    } else if (m.parent.child(m.index()).isText && m.index() == g.index() - (g.textOffset ? 0 : 1)) {
      let E = m.parent.textBetween(m.parentOffset, g.parentOffset), k = () => O(n.state.tr.insertText(E, S, y));
      n.someProp("handleTextInput", (I) => I(n, S, y, E, k)) || n.dispatch(k());
    } else
      n.dispatch(O());
  else
    n.dispatch(O());
}
function fc(n, e, t) {
  return Math.max(t.anchor, t.head) > e.content.size ? null : Bl(n, e.resolve(t.anchor), e.resolve(t.head));
}
function lg(n, e) {
  let t = n.firstChild.marks, r = e.firstChild.marks, i = t, o = r, s, l, a;
  for (let u = 0; u < r.length; u++)
    i = r[u].removeFromSet(i);
  for (let u = 0; u < t.length; u++)
    o = t[u].removeFromSet(o);
  if (i.length == 1 && o.length == 0)
    l = i[0], s = "add", a = (u) => u.mark(l.addToSet(u.marks));
  else if (i.length == 0 && o.length == 1)
    l = o[0], s = "remove", a = (u) => u.mark(l.removeFromSet(u.marks));
  else
    return null;
  let c = [];
  for (let u = 0; u < e.childCount; u++)
    c.push(a(e.child(u)));
  if (C.from(c).eq(n))
    return { mark: l, type: s };
}
function ag(n, e, t, r, i) {
  if (
    // The content must have shrunk
    t - e <= i.pos - r.pos || // newEnd must point directly at or after the end of the block that newStart points into
    bs(r, !0, !1) < i.pos
  )
    return !1;
  let o = n.resolve(e);
  if (!r.parent.isTextblock) {
    let l = o.nodeAfter;
    return l != null && t == e + l.nodeSize;
  }
  if (o.parentOffset < o.parent.content.size || !o.parent.isTextblock)
    return !1;
  let s = n.resolve(bs(o, !0, !0));
  return !s.parent.isTextblock || s.pos > t || bs(s, !0, !1) < t ? !1 : r.parent.content.cut(r.parentOffset).eq(s.parent.content);
}
function bs(n, e, t) {
  let r = n.depth, i = e ? n.end() : n.pos;
  for (; r > 0 && (e || n.indexAfter(r) == n.node(r).childCount); )
    r--, i++, e = !1;
  if (t) {
    let o = n.node(r).maybeChild(n.indexAfter(r));
    for (; o && !o.isLeaf; )
      o = o.firstChild, i++;
  }
  return i;
}
function cg(n, e, t, r, i) {
  let o = n.findDiffStart(e, t), s = t + n.size, l = t + e.size;
  if (o == null)
    return null;
  let { a, b: c } = n.findDiffEnd(e, s, l);
  if (i == "end") {
    let u = Math.max(0, o - Math.min(a, c));
    r -= a + u - o;
  }
  if (a < o && s < l) {
    let u = r <= o && r >= a ? o - r : 0;
    o -= u, c = o + (c - a), a = o;
  } else if (c < o) {
    let u = r <= o && r >= c ? o - r : 0;
    o -= u, a = o + (a - c), c = o;
  }
  return { start: o, endA: a, endB: c };
}
class Vd {
  /**
  Create a view. `place` may be a DOM node that the editor should
  be appended to, a function that will place it into the document,
  or an object whose `mount` property holds the node to use as the
  document container. If it is `null`, the editor will not be
  added to the document.
  */
  constructor(e, t) {
    this._root = null, this.focused = !1, this.trackWrites = null, this.mounted = !1, this.markCursor = null, this.cursorWrapper = null, this.lastSelectedViewDesc = void 0, this.input = new Tm(), this.prevDirectPlugins = [], this.pluginViews = [], this.requiresGeckoHackNode = !1, this.dragging = null, this._props = t, this.state = t.state, this.directPlugins = t.plugins || [], this.directPlugins.forEach(yc), this.dispatch = this.dispatch.bind(this), this.dom = e && e.mount || document.createElement("div"), e && (e.appendChild ? e.appendChild(this.dom) : typeof e == "function" ? e(this.dom) : e.mount && (this.mounted = !0)), this.editable = mc(this), pc(this), this.nodeViews = gc(this), this.docView = Ga(this.state.doc, hc(this), ys(this), this.dom, this), this.domObserver = new Qm(this, (r, i, o, s) => sg(this, r, i, o, s)), this.domObserver.start(), Em(this), this.updatePluginViews();
  }
  /**
  Holds `true` when a
  [composition](https://w3c.github.io/uievents/#events-compositionevents)
  is active.
  */
  get composing() {
    return this.input.composing;
  }
  /**
  The view's current [props](https://prosemirror.net/docs/ref/#view.EditorProps).
  */
  get props() {
    if (this._props.state != this.state) {
      let e = this._props;
      this._props = {};
      for (let t in e)
        this._props[t] = e[t];
      this._props.state = this.state;
    }
    return this._props;
  }
  /**
  Update the view's props. Will immediately cause an update to
  the DOM.
  */
  update(e) {
    e.handleDOMEvents != this._props.handleDOMEvents && nl(this);
    let t = this._props;
    this._props = e, e.plugins && (e.plugins.forEach(yc), this.directPlugins = e.plugins), this.updateStateInner(e.state, t);
  }
  /**
  Update the view by updating existing props object with the object
  given as argument. Equivalent to `view.update(Object.assign({},
  view.props, props))`.
  */
  setProps(e) {
    let t = {};
    for (let r in this._props)
      t[r] = this._props[r];
    t.state = this.state;
    for (let r in e)
      t[r] = e[r];
    this.update(t);
  }
  /**
  Update the editor's `state` prop, without touching any of the
  other props.
  */
  updateState(e) {
    this.updateStateInner(e, this._props);
  }
  updateStateInner(e, t) {
    var r;
    let i = this.state, o = !1, s = !1;
    e.storedMarks && this.composing && (Ld(this), s = !0), this.state = e;
    let l = i.plugins != e.plugins || this._props.plugins != t.plugins;
    if (l || this._props.plugins != t.plugins || this._props.nodeViews != t.nodeViews) {
      let h = gc(this);
      dg(h, this.nodeViews) && (this.nodeViews = h, o = !0);
    }
    (l || t.handleDOMEvents != this._props.handleDOMEvents) && nl(this), this.editable = mc(this), pc(this);
    let a = ys(this), c = hc(this), u = i.plugins != e.plugins && !i.doc.eq(e.doc) ? "reset" : e.scrollToSelection > i.scrollToSelection ? "to selection" : "preserve", d = o || !this.docView.matchesNode(e.doc, c, a);
    (d || !e.selection.eq(i.selection)) && (s = !0);
    let f = u == "preserve" && s && this.dom.style.overflowAnchor == null && Fp(this);
    if (s) {
      this.domObserver.stop();
      let h = d && (He || Ce) && !this.composing && !i.selection.empty && !e.selection.empty && ug(i.selection, e.selection);
      if (d) {
        let m = Ce ? this.trackWrites = this.domSelectionRange().focusNode : null;
        this.composing && (this.input.compositionNode = Vm(this)), (o || !this.docView.update(e.doc, c, a, this)) && (this.docView.updateOuterDeco(c), this.docView.destroy(), this.docView = Ga(e.doc, c, a, this.dom, this)), m && (!this.trackWrites || !this.dom.contains(this.trackWrites)) && (h = !0);
      }
      let p = this.input.mouseDown;
      h || !(p && this.domObserver.currentSelection.eq(this.domSelectionRange()) && um(this) && p.delaySelUpdate()) ? Pt(this, h) : (wd(this, e.selection), this.domObserver.setCurSelection()), this.domObserver.start();
    }
    this.updatePluginViews(i), !((r = this.dragging) === null || r === void 0) && r.node && !i.doc.eq(e.doc) && this.updateDraggedNode(this.dragging, i), u == "reset" ? this.dom.scrollTop = 0 : u == "to selection" ? this.scrollToSelection() : f && Vp(f);
  }
  /**
  @internal
  */
  scrollToSelection() {
    let e = this.domSelectionRange().focusNode;
    if (!(!e || !this.dom.contains(e.nodeType == 1 ? e : e.parentNode))) {
      if (!this.someProp("handleScrollToSelection", (t) => t(this))) if (this.state.selection instanceof P) {
        let t = this.docView.domAfterPos(this.state.selection.from);
        t.nodeType == 1 && _a(this, t.getBoundingClientRect(), e);
      } else
        _a(this, this.coordsAtPos(this.state.selection.head, 1), e);
    }
  }
  destroyPluginViews() {
    let e;
    for (; e = this.pluginViews.pop(); )
      e.destroy && e.destroy();
  }
  updatePluginViews(e) {
    if (!e || e.plugins != this.state.plugins || this.directPlugins != this.prevDirectPlugins) {
      this.prevDirectPlugins = this.directPlugins, this.destroyPluginViews();
      for (let t = 0; t < this.directPlugins.length; t++) {
        let r = this.directPlugins[t];
        r.spec.view && this.pluginViews.push(r.spec.view(this));
      }
      for (let t = 0; t < this.state.plugins.length; t++) {
        let r = this.state.plugins[t];
        r.spec.view && this.pluginViews.push(r.spec.view(this));
      }
    } else
      for (let t = 0; t < this.pluginViews.length; t++) {
        let r = this.pluginViews[t];
        r.update && r.update(this, e);
      }
  }
  updateDraggedNode(e, t) {
    let r = e.node, i = -1;
    if (r.from < this.state.doc.content.size && this.state.doc.nodeAt(r.from) == r.node)
      i = r.from;
    else {
      let o = r.from + (this.state.doc.content.size - t.doc.content.size);
      (o > 0 && o < this.state.doc.content.size && this.state.doc.nodeAt(o)) == r.node && (i = o);
    }
    this.dragging = new Bd(e.slice, e.move, i < 0 ? void 0 : P.create(this.state.doc, i));
  }
  someProp(e, t) {
    let r = this._props && this._props[e], i;
    if (r != null && (i = t ? t(r) : r))
      return i;
    for (let s = 0; s < this.directPlugins.length; s++) {
      let l = this.directPlugins[s].props[e];
      if (l != null && (i = t ? t(l) : l))
        return i;
    }
    let o = this.state.plugins;
    if (o)
      for (let s = 0; s < o.length; s++) {
        let l = o[s].props[e];
        if (l != null && (i = t ? t(l) : l))
          return i;
      }
  }
  /**
  Query whether the view has focus.
  */
  hasFocus() {
    if (He) {
      let e = this.root.activeElement;
      if (e == this.dom)
        return !0;
      if (!e || !this.dom.contains(e))
        return !1;
      for (; e && this.dom != e && this.dom.contains(e); ) {
        if (e.contentEditable == "false")
          return !1;
        e = e.parentElement;
      }
      return !0;
    }
    return this.root.activeElement == this.dom;
  }
  /**
  Focus the editor.
  */
  focus() {
    this.domObserver.stop(), this.editable && jp(this.dom), Pt(this), this.domObserver.start();
  }
  /**
  Get the document root in which the editor exists. This will
  usually be the top-level `document`, but might be a [shadow
  DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Shadow_DOM)
  root if the editor is inside one.
  */
  get root() {
    let e = this._root;
    if (e == null) {
      for (let t = this.dom.parentNode; t; t = t.parentNode)
        if (t.nodeType == 9 || t.nodeType == 11 && t.host)
          return t.getSelection || (Object.getPrototypeOf(t).getSelection = () => t.ownerDocument.getSelection()), this._root = t;
    }
    return e || document;
  }
  /**
  When an existing editor view is moved to a new document or
  shadow tree, call this to make it recompute its root.
  */
  updateRoot() {
    this._root = null;
  }
  /**
  Given a pair of viewport coordinates, return the document
  position that corresponds to them. May return null if the given
  coordinates aren't inside of the editor. When an object is
  returned, its `pos` property is the position nearest to the
  coordinates, and its `inside` property holds the position of the
  inner node that the position falls inside of, or -1 if it is at
  the top level, not in any node.
  */
  posAtCoords(e) {
    return qp(this, e);
  }
  /**
  Returns the viewport rectangle at a given document position.
  `left` and `right` will be the same number, as this returns a
  flat cursor-ish rectangle. If the position is between two things
  that aren't directly adjacent, `side` determines which element
  is used. When < 0, the element before the position is used,
  otherwise the element after.
  */
  coordsAtPos(e, t = 1) {
    return fd(this, e, t);
  }
  /**
  Find the DOM position that corresponds to the given document
  position. When `side` is negative, find the position as close as
  possible to the content before the position. When positive,
  prefer positions close to the content after the position. When
  zero, prefer as shallow a position as possible.
  
  Note that you should **not** mutate the editor's internal DOM,
  only inspect it (and even that is usually not necessary).
  */
  domAtPos(e, t = 0) {
    return this.docView.domFromPos(e, t);
  }
  /**
  Find the DOM node that represents the document node after the
  given position. May return `null` when the position doesn't point
  in front of a node or if the node is inside an opaque node view.
  
  This is intended to be able to call things like
  `getBoundingClientRect` on that DOM node. Do **not** mutate the
  editor DOM directly, or add styling this way, since that will be
  immediately overriden by the editor as it redraws the node.
  */
  nodeDOM(e) {
    let t = this.docView.descAt(e);
    return t ? t.nodeDOM : null;
  }
  /**
  Find the document position that corresponds to a given DOM
  position. (Whenever possible, it is preferable to inspect the
  document structure directly, rather than poking around in the
  DOM, but sometimes—for example when interpreting an event
  target—you don't have a choice.)
  
  The `bias` parameter can be used to influence which side of a DOM
  node to use when the position is inside a leaf node.
  */
  posAtDOM(e, t, r = -1) {
    let i = this.docView.posFromDOM(e, t, r);
    if (i == null)
      throw new RangeError("DOM position not inside the editor");
    return i;
  }
  /**
  Find out whether the selection is at the end of a textblock when
  moving in a given direction. When, for example, given `"left"`,
  it will return true if moving left from the current cursor
  position would leave that position's parent textblock. Will apply
  to the view's current state by default, but it is possible to
  pass a different state.
  */
  endOfTextblock(e, t) {
    return Qp(this, t || this.state, e);
  }
  /**
  Run the editor's paste logic with the given HTML string. The
  `event`, if given, will be passed to the
  [`handlePaste`](https://prosemirror.net/docs/ref/#view.EditorProps.handlePaste) hook.
  */
  pasteHTML(e, t) {
    return Vr(this, "", e, !1, t || new ClipboardEvent("paste"));
  }
  /**
  Run the editor's paste logic with the given plain-text input.
  */
  pasteText(e, t) {
    return Vr(this, e, null, !0, t || new ClipboardEvent("paste"));
  }
  /**
  Serialize the given slice as it would be if it was copied from
  this editor. Returns a DOM element that contains a
  representation of the slice as its children, a textual
  representation, and the transformed slice (which can be
  different from the given input due to hooks like
  [`transformCopied`](https://prosemirror.net/docs/ref/#view.EditorProps.transformCopied)).
  */
  serializeForClipboard(e) {
    return Hl(this, e);
  }
  /**
  Removes the editor from the DOM and destroys all [node
  views](https://prosemirror.net/docs/ref/#view.NodeView).
  */
  destroy() {
    this.docView && (Mm(this), this.destroyPluginViews(), this.mounted ? (this.docView.update(this.state.doc, [], ys(this), this), this.dom.textContent = "") : this.dom.parentNode && this.dom.parentNode.removeChild(this.dom), this.docView.destroy(), this.docView = null, Np());
  }
  /**
  This is true when the view has been
  [destroyed](https://prosemirror.net/docs/ref/#view.EditorView.destroy) (and thus should not be
  used anymore).
  */
  get isDestroyed() {
    return this.docView == null;
  }
  /**
  Used for testing.
  */
  dispatchEvent(e) {
    return Am(this, e);
  }
  /**
  @internal
  */
  domSelectionRange() {
    let e = this.domSelection();
    return e ? Me && this.root.nodeType === 11 && Pp(this.dom.ownerDocument) == this.dom && eg(this, e) || e : { focusNode: null, focusOffset: 0, anchorNode: null, anchorOffset: 0 };
  }
  /**
  @internal
  */
  domSelection() {
    return this.root.getSelection();
  }
}
Vd.prototype.dispatch = function(n) {
  let e = this._props.dispatchTransaction;
  e ? e.call(this, n) : this.updateState(this.state.apply(n));
};
function hc(n) {
  let e = /* @__PURE__ */ Object.create(null);
  return e.class = "ProseMirror", e.contenteditable = String(n.editable), n.someProp("attributes", (t) => {
    if (typeof t == "function" && (t = t(n.state)), t)
      for (let r in t)
        r == "class" ? e.class += " " + t[r] : r == "style" ? e.style = (e.style ? e.style + ";" : "") + t[r] : !e[r] && r != "contenteditable" && r != "nodeName" && (e[r] = String(t[r]));
  }), e.translate || (e.translate = "no"), [me.node(0, n.state.doc.content.size, e)];
}
function pc(n) {
  if (n.markCursor) {
    let e = document.createElement("img");
    e.className = "ProseMirror-separator", e.setAttribute("mark-placeholder", "true"), e.setAttribute("alt", ""), n.cursorWrapper = { dom: e, deco: me.widget(n.state.selection.from, e, { raw: !0, marks: n.markCursor }) };
  } else
    n.cursorWrapper = null;
}
function mc(n) {
  return !n.someProp("editable", (e) => e(n.state) === !1);
}
function ug(n, e) {
  let t = Math.min(n.$anchor.sharedDepth(n.head), e.$anchor.sharedDepth(e.head));
  return n.$anchor.start(t) != e.$anchor.start(t);
}
function gc(n) {
  let e = /* @__PURE__ */ Object.create(null);
  function t(r) {
    for (let i in r)
      Object.prototype.hasOwnProperty.call(e, i) || (e[i] = r[i]);
  }
  return n.someProp("nodeViews", t), n.someProp("markViews", t), e;
}
function dg(n, e) {
  let t = 0, r = 0;
  for (let i in n) {
    if (n[i] != e[i])
      return !0;
    t++;
  }
  for (let i in e)
    r++;
  return t != r;
}
function yc(n) {
  if (n.spec.state || n.spec.filterTransaction || n.spec.appendTransaction)
    throw new RangeError("Plugins passed directly to the view must not have a state component");
}
var Zt = {
  8: "Backspace",
  9: "Tab",
  10: "Enter",
  12: "NumLock",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  44: "PrintScreen",
  45: "Insert",
  46: "Delete",
  59: ";",
  61: "=",
  91: "Meta",
  92: "Meta",
  106: "*",
  107: "+",
  108: ",",
  109: "-",
  110: ".",
  111: "/",
  144: "NumLock",
  145: "ScrollLock",
  160: "Shift",
  161: "Shift",
  162: "Control",
  163: "Control",
  164: "Alt",
  165: "Alt",
  173: "-",
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
}, lo = {
  48: ")",
  49: "!",
  50: "@",
  51: "#",
  52: "$",
  53: "%",
  54: "^",
  55: "&",
  56: "*",
  57: "(",
  59: ":",
  61: "+",
  173: "_",
  186: ":",
  187: "+",
  188: "<",
  189: "_",
  190: ">",
  191: "?",
  192: "~",
  219: "{",
  220: "|",
  221: "}",
  222: '"'
}, fg = typeof navigator < "u" && /Mac/.test(navigator.platform), hg = typeof navigator < "u" && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);
for (var xe = 0; xe < 10; xe++) Zt[48 + xe] = Zt[96 + xe] = String(xe);
for (var xe = 1; xe <= 24; xe++) Zt[xe + 111] = "F" + xe;
for (var xe = 65; xe <= 90; xe++)
  Zt[xe] = String.fromCharCode(xe + 32), lo[xe] = String.fromCharCode(xe);
for (var vs in Zt) lo.hasOwnProperty(vs) || (lo[vs] = Zt[vs]);
function pg(n) {
  var e = fg && n.metaKey && n.shiftKey && !n.ctrlKey && !n.altKey || hg && n.shiftKey && n.key && n.key.length == 1 || n.key == "Unidentified", t = !e && n.key || (n.shiftKey ? lo : Zt)[n.keyCode] || n.key || "Unidentified";
  return t == "Esc" && (t = "Escape"), t == "Del" && (t = "Delete"), t == "Left" && (t = "ArrowLeft"), t == "Up" && (t = "ArrowUp"), t == "Right" && (t = "ArrowRight"), t == "Down" && (t = "ArrowDown"), t;
}
const mg = typeof navigator < "u" && /Mac|iP(hone|[oa]d)/.test(navigator.platform), gg = typeof navigator < "u" && /Win/.test(navigator.platform);
function yg(n) {
  let e = n.split(/-(?!$)/), t = e[e.length - 1];
  t == "Space" && (t = " ");
  let r, i, o, s;
  for (let l = 0; l < e.length - 1; l++) {
    let a = e[l];
    if (/^(cmd|meta|m)$/i.test(a))
      s = !0;
    else if (/^a(lt)?$/i.test(a))
      r = !0;
    else if (/^(c|ctrl|control)$/i.test(a))
      i = !0;
    else if (/^s(hift)?$/i.test(a))
      o = !0;
    else if (/^mod$/i.test(a))
      mg ? s = !0 : i = !0;
    else
      throw new Error("Unrecognized modifier name: " + a);
  }
  return r && (t = "Alt-" + t), i && (t = "Ctrl-" + t), s && (t = "Meta-" + t), o && (t = "Shift-" + t), t;
}
function bg(n) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t in n)
    e[yg(t)] = n[t];
  return e;
}
function ws(n, e, t = !0) {
  return e.altKey && (n = "Alt-" + n), e.ctrlKey && (n = "Ctrl-" + n), e.metaKey && (n = "Meta-" + n), t && e.shiftKey && (n = "Shift-" + n), n;
}
function vg(n) {
  return new ie({ props: { handleKeyDown: Wl(n) } });
}
function Wl(n) {
  let e = bg(n);
  return function(t, r) {
    let i = pg(r), o, s = e[ws(i, r)];
    if (s && s(t.state, t.dispatch, t))
      return !0;
    if (i.length == 1 && i != " ") {
      if (r.shiftKey) {
        let l = e[ws(i, r, !1)];
        if (l && l(t.state, t.dispatch, t))
          return !0;
      }
      if ((r.altKey || r.metaKey || r.ctrlKey) && // Ctrl-Alt may be used for AltGr on Windows
      !(gg && r.ctrlKey && r.altKey) && (o = Zt[r.keyCode]) && o != i) {
        let l = e[ws(o, r)];
        if (l && l(t.state, t.dispatch, t))
          return !0;
      }
    }
    return !1;
  };
}
const _l = (n, e) => n.selection.empty ? !1 : (e && e(n.tr.deleteSelection().scrollIntoView()), !0);
function jd(n, e) {
  let { $cursor: t } = n.selection;
  return !t || (e ? !e.endOfTextblock("backward", n) : t.parentOffset > 0) ? null : t;
}
const Wd = (n, e, t) => {
  let r = jd(n, t);
  if (!r)
    return !1;
  let i = Ul(r);
  if (!i) {
    let s = r.blockRange(), l = s && rr(s);
    return l == null ? !1 : (e && e(n.tr.lift(s, l).scrollIntoView()), !0);
  }
  let o = i.nodeBefore;
  if (Qd(n, i, e, -1))
    return !0;
  if (r.parent.content.size == 0 && (Jn(o, "end") || P.isSelectable(o)))
    for (let s = r.depth; ; s--) {
      let l = _o(n.doc, r.before(s), r.after(s), A.empty);
      if (l && l.slice.size < l.to - l.from) {
        if (e) {
          let a = n.tr.step(l);
          a.setSelection(Jn(o, "end") ? H.findFrom(a.doc.resolve(a.mapping.map(i.pos, -1)), -1) : P.create(a.doc, i.pos - o.nodeSize)), e(a.scrollIntoView());
        }
        return !0;
      }
      if (s == 1 || r.node(s - 1).childCount > 1)
        break;
    }
  return o.isAtom && i.depth == r.depth - 1 ? (e && e(n.tr.delete(i.pos - o.nodeSize, i.pos).scrollIntoView()), !0) : !1;
}, wg = (n, e, t) => {
  let r = jd(n, t);
  if (!r)
    return !1;
  let i = Ul(r);
  return i ? _d(n, i, e) : !1;
}, kg = (n, e, t) => {
  let r = Kd(n, t);
  if (!r)
    return !1;
  let i = Kl(r);
  return i ? _d(n, i, e) : !1;
};
function _d(n, e, t) {
  let r = e.nodeBefore, i = r, o = e.pos - 1;
  for (; !i.isTextblock; o--) {
    if (i.type.spec.isolating)
      return !1;
    let u = i.lastChild;
    if (!u)
      return !1;
    i = u;
  }
  let s = e.nodeAfter, l = s, a = e.pos + 1;
  for (; !l.isTextblock; a++) {
    if (l.type.spec.isolating)
      return !1;
    let u = l.firstChild;
    if (!u)
      return !1;
    l = u;
  }
  let c = _o(n.doc, o, a, A.empty);
  if (!c || c.from != o || c instanceof fe && c.slice.size >= a - o)
    return !1;
  if (t) {
    let u = n.tr.step(c);
    u.setSelection(L.create(u.doc, o)), t(u.scrollIntoView());
  }
  return !0;
}
function Jn(n, e, t = !1) {
  for (let r = n; r; r = e == "start" ? r.firstChild : r.lastChild) {
    if (r.isTextblock)
      return !0;
    if (t && r.childCount != 1)
      return !1;
  }
  return !1;
}
const Ud = (n, e, t) => {
  let { $head: r, empty: i } = n.selection, o = r;
  if (!i)
    return !1;
  if (r.parent.isTextblock) {
    if (t ? !t.endOfTextblock("backward", n) : r.parentOffset > 0)
      return !1;
    o = Ul(r);
  }
  let s = o && o.nodeBefore;
  return !s || !P.isSelectable(s) ? !1 : (e && e(n.tr.setSelection(P.create(n.doc, o.pos - s.nodeSize)).scrollIntoView()), !0);
};
function Ul(n) {
  if (!n.parent.type.spec.isolating)
    for (let e = n.depth - 1; e >= 0; e--) {
      if (n.index(e) > 0)
        return n.doc.resolve(n.before(e + 1));
      if (n.node(e).type.spec.isolating)
        break;
    }
  return null;
}
function Kd(n, e) {
  let { $cursor: t } = n.selection;
  return !t || (e ? !e.endOfTextblock("forward", n) : t.parentOffset < t.parent.content.size) ? null : t;
}
const qd = (n, e, t) => {
  let r = Kd(n, t);
  if (!r)
    return !1;
  let i = Kl(r);
  if (!i)
    return !1;
  let o = i.nodeAfter;
  if (Qd(n, i, e, 1))
    return !0;
  if (r.parent.content.size == 0 && (Jn(o, "start") || P.isSelectable(o))) {
    let s = _o(n.doc, r.before(), r.after(), A.empty);
    if (s && s.slice.size < s.to - s.from) {
      if (e) {
        let l = n.tr.step(s);
        l.setSelection(Jn(o, "start") ? H.findFrom(l.doc.resolve(l.mapping.map(i.pos)), 1) : P.create(l.doc, l.mapping.map(i.pos))), e(l.scrollIntoView());
      }
      return !0;
    }
  }
  return o.isAtom && i.depth == r.depth - 1 ? (e && e(n.tr.delete(i.pos, i.pos + o.nodeSize).scrollIntoView()), !0) : !1;
}, Jd = (n, e, t) => {
  let { $head: r, empty: i } = n.selection, o = r;
  if (!i)
    return !1;
  if (r.parent.isTextblock) {
    if (t ? !t.endOfTextblock("forward", n) : r.parentOffset < r.parent.content.size)
      return !1;
    o = Kl(r);
  }
  let s = o && o.nodeAfter;
  return !s || !P.isSelectable(s) ? !1 : (e && e(n.tr.setSelection(P.create(n.doc, o.pos)).scrollIntoView()), !0);
};
function Kl(n) {
  if (!n.parent.type.spec.isolating)
    for (let e = n.depth - 1; e >= 0; e--) {
      let t = n.node(e);
      if (n.index(e) + 1 < t.childCount)
        return n.doc.resolve(n.after(e + 1));
      if (t.type.spec.isolating)
        break;
    }
  return null;
}
const Sg = (n, e) => {
  let t = n.selection, r = t instanceof P, i;
  if (r) {
    if (t.node.isTextblock || !en(n.doc, t.from))
      return !1;
    i = t.from;
  } else if (i = Wo(n.doc, t.from, -1), i == null)
    return !1;
  if (e) {
    let o = n.tr.join(i);
    r && o.setSelection(P.create(o.doc, i - n.doc.resolve(i).nodeBefore.nodeSize)), e(o.scrollIntoView());
  }
  return !0;
}, xg = (n, e) => {
  let t = n.selection, r;
  if (t instanceof P) {
    if (t.node.isTextblock || !en(n.doc, t.to))
      return !1;
    r = t.to;
  } else if (r = Wo(n.doc, t.to, 1), r == null)
    return !1;
  return e && e(n.tr.join(r).scrollIntoView()), !0;
}, Cg = (n, e) => {
  let { $from: t, $to: r } = n.selection, i = t.blockRange(r), o = i && rr(i);
  return o == null ? !1 : (e && e(n.tr.lift(i, o).scrollIntoView()), !0);
}, Gd = (n, e) => {
  let { $head: t, $anchor: r } = n.selection;
  return !t.parent.type.spec.code || !t.sameParent(r) ? !1 : (e && e(n.tr.insertText(`
`).scrollIntoView()), !0);
};
function ql(n) {
  for (let e = 0; e < n.edgeCount; e++) {
    let { type: t } = n.edge(e);
    if (t.isTextblock && !t.hasRequiredAttrs())
      return t;
  }
  return null;
}
const Tg = (n, e) => {
  let { $head: t, $anchor: r } = n.selection;
  if (!t.parent.type.spec.code || !t.sameParent(r))
    return !1;
  let i = t.node(-1), o = t.indexAfter(-1), s = ql(i.contentMatchAt(o));
  if (!s || !i.canReplaceWith(o, o, s))
    return !1;
  if (e) {
    let l = t.after(), a = n.tr.replaceWith(l, l, s.createAndFill());
    a.setSelection(H.near(a.doc.resolve(l), 1)), e(a.scrollIntoView());
  }
  return !0;
}, Yd = (n, e) => {
  let t = n.selection, { $from: r, $to: i } = t;
  if (t instanceof _e || r.parent.inlineContent || i.parent.inlineContent)
    return !1;
  let o = ql(i.parent.contentMatchAt(i.indexAfter()));
  if (!o || !o.isTextblock)
    return !1;
  if (e) {
    let s = (!r.parentOffset && i.index() < i.parent.childCount ? r : i).pos, l = n.tr.insert(s, o.createAndFill());
    l.setSelection(L.create(l.doc, s + 1)), e(l.scrollIntoView());
  }
  return !0;
}, Xd = (n, e) => {
  let { $cursor: t } = n.selection;
  if (!t || t.parent.content.size)
    return !1;
  if (t.depth > 1 && t.after() != t.end(-1)) {
    let o = t.before();
    if (Lt(n.doc, o))
      return e && e(n.tr.split(o).scrollIntoView()), !0;
  }
  let r = t.blockRange(), i = r && rr(r);
  return i == null ? !1 : (e && e(n.tr.lift(r, i).scrollIntoView()), !0);
};
function Eg(n) {
  return (e, t) => {
    if (e.selection instanceof P && e.selection.node.isBlock) {
      let { $from: h } = e.selection;
      return !h.parentOffset || !Lt(e.doc, h.pos) ? !1 : (t && t(e.tr.split(h.pos).scrollIntoView()), !0);
    }
    if (!e.selection.$from.depth)
      return !1;
    let r = e.tr;
    !e.selection.empty && (e.selection instanceof L || e.selection instanceof _e) && r.deleteSelection();
    let { $from: i } = r.selection, o = r.steps.length, s = [], l, a, c = !1, u = !1;
    for (let h = i.depth; ; h--)
      if (i.node(h).isBlock) {
        c = i.end(h) == i.pos + (i.depth - h), u = i.start(h) == i.pos - (i.depth - h), a = ql(i.node(h - 1).contentMatchAt(i.indexAfter(h - 1))), s.unshift(c && a ? { type: a } : null), l = h;
        break;
      } else {
        if (h == 1)
          return !1;
        s.unshift(null);
      }
    let d = i.pos, f = Lt(r.doc, d, s.length, s);
    if (f || (s[0] = a ? { type: a } : null, f = Lt(r.doc, d, s.length, s)), !f)
      return !1;
    if (r.split(d, s.length, s), !c && u && i.node(l).type != a) {
      let h = r.mapping.slice(o), p = h.map(i.before(l)), m = r.doc.resolve(p);
      a && i.node(l - 1).canReplaceWith(m.index(), m.index() + 1, a) && r.setNodeMarkup(h.map(i.before(l)), a);
    }
    return t && t(r.scrollIntoView()), !0;
  };
}
const Mg = Eg(), Og = (n, e) => {
  let { $from: t, to: r } = n.selection, i, o = t.sharedDepth(r);
  return o == 0 ? !1 : (i = t.before(o), e && e(n.tr.setSelection(P.create(n.doc, i))), !0);
};
function Ag(n, e, t) {
  let r = e.nodeBefore, i = e.nodeAfter, o = e.index();
  return !r || !i || !r.type.compatibleContent(i.type) ? !1 : !r.content.size && e.parent.canReplace(o - 1, o) ? (t && t(n.tr.delete(e.pos - r.nodeSize, e.pos).scrollIntoView()), !0) : !e.parent.canReplace(o, o + 1) || !(i.isTextblock || en(n.doc, e.pos)) ? !1 : (t && t(n.tr.join(e.pos).scrollIntoView()), !0);
}
function Qd(n, e, t, r) {
  let i = e.nodeBefore, o = e.nodeAfter, s, l, a = i.type.spec.isolating || o.type.spec.isolating;
  if (!a && Ag(n, e, t))
    return !0;
  let c = !a && e.parent.canReplace(e.index(), e.index() + 1);
  if (c && (s = (l = i.contentMatchAt(i.childCount)).findWrapping(o.type)) && l.matchType(s[0] || o.type).validEnd) {
    if (t) {
      let h = e.pos + o.nodeSize, p = C.empty;
      for (let b = s.length - 1; b >= 0; b--)
        p = C.from(s[b].create(null, p));
      p = C.from(i.copy(p));
      let m = n.tr.step(new ye(e.pos - 1, h, e.pos, h, new A(p, 1, 0), s.length, !0)), g = m.doc.resolve(h + 2 * s.length);
      g.nodeAfter && g.nodeAfter.type == i.type && en(m.doc, g.pos) && m.join(g.pos), t(m.scrollIntoView());
    }
    return !0;
  }
  let u = o.type.spec.isolating || r > 0 && a ? null : H.findFrom(e, 1), d = u && u.$from.blockRange(u.$to), f = d && rr(d);
  if (f != null && f >= e.depth)
    return t && t(n.tr.lift(d, f).scrollIntoView()), !0;
  if (c && Jn(o, "start", !0) && Jn(i, "end")) {
    let h = i, p = [];
    for (; p.push(h), !h.isTextblock; )
      h = h.lastChild;
    let m = o, g = 1;
    for (; !m.isTextblock; m = m.firstChild)
      g++;
    if (h.canReplace(h.childCount, h.childCount, m.content)) {
      if (t) {
        let b = C.empty;
        for (let S = p.length - 1; S >= 0; S--)
          b = C.from(p[S].copy(b));
        let T = n.tr.step(new ye(e.pos - p.length, e.pos + o.nodeSize, e.pos + g, e.pos + o.nodeSize - g, new A(b, p.length, 0), 0, !0));
        t(T.scrollIntoView());
      }
      return !0;
    }
  }
  return !1;
}
function Zd(n) {
  return function(e, t) {
    let r = e.selection, i = n < 0 ? r.$from : r.$to, o = i.depth;
    for (; i.node(o).isInline; ) {
      if (!o)
        return !1;
      o--;
    }
    return i.node(o).isTextblock ? (t && t(e.tr.setSelection(L.create(e.doc, n < 0 ? i.start(o) : i.end(o)))), !0) : !1;
  };
}
const Ng = Zd(-1), Dg = Zd(1);
function Rg(n, e = null) {
  return function(t, r) {
    let { $from: i, $to: o } = t.selection, s = i.blockRange(o), l = s && Dl(s, n, e);
    return l ? (r && r(t.tr.wrap(s, l).scrollIntoView()), !0) : !1;
  };
}
function bc(n, e = null) {
  return function(t, r) {
    let i = !1;
    for (let o = 0; o < t.selection.ranges.length && !i; o++) {
      let { $from: { pos: s }, $to: { pos: l } } = t.selection.ranges[o];
      t.doc.nodesBetween(s, l, (a, c) => {
        if (i)
          return !1;
        if (!(!a.isTextblock || a.hasMarkup(n, e)))
          if (a.type == n)
            i = !0;
          else {
            let u = t.doc.resolve(c), d = u.index();
            i = u.parent.canReplaceWith(d, d + 1, n);
          }
      });
    }
    if (!i)
      return !1;
    if (r) {
      let o = t.tr;
      for (let s = 0; s < t.selection.ranges.length; s++) {
        let { $from: { pos: l }, $to: { pos: a } } = t.selection.ranges[s];
        o.setBlockType(l, a, n, e);
      }
      r(o.scrollIntoView());
    }
    return !0;
  };
}
function Jl(...n) {
  return function(e, t, r) {
    for (let i = 0; i < n.length; i++)
      if (n[i](e, t, r))
        return !0;
    return !1;
  };
}
Jl(_l, Wd, Ud);
Jl(_l, qd, Jd);
Jl(Gd, Yd, Xd, Mg);
typeof navigator < "u" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : typeof os < "u" && os.platform && os.platform() == "darwin";
function Ig(n, e = null) {
  return function(t, r) {
    let { $from: i, $to: o } = t.selection, s = i.blockRange(o);
    if (!s)
      return !1;
    let l = r ? t.tr : null;
    return Lg(l, s, n, e) ? (r && r(l.scrollIntoView()), !0) : !1;
  };
}
function Lg(n, e, t, r = null) {
  let i = !1, o = e, s = e.$from.doc;
  if (e.depth >= 2 && e.$from.node(e.depth - 1).type.compatibleContent(t) && e.startIndex == 0) {
    if (e.$from.index(e.depth - 1) == 0)
      return !1;
    let a = s.resolve(e.start - 2);
    o = new eo(a, a, e.depth), e.endIndex < e.parent.childCount && (e = new eo(e.$from, s.resolve(e.$to.end(e.depth)), e.depth)), i = !0;
  }
  let l = Dl(o, t, r, e);
  return l ? (n && Pg(n, e, l, i, t), !0) : !1;
}
function Pg(n, e, t, r, i) {
  let o = C.empty;
  for (let u = t.length - 1; u >= 0; u--)
    o = C.from(t[u].type.create(t[u].attrs, o));
  n.step(new ye(e.start - (r ? 2 : 0), e.end, e.start, e.end, new A(o, 0, 0), t.length, !0));
  let s = 0;
  for (let u = 0; u < t.length; u++)
    t[u].type == i && (s = u + 1);
  let l = t.length - s, a = e.start + t.length - (r ? 2 : 0), c = e.parent;
  for (let u = e.startIndex, d = e.endIndex, f = !0; u < d; u++, f = !1)
    !f && Lt(n.doc, a, l) && (n.split(a, l), a += 2 * l), a += c.child(u).nodeSize;
  return n;
}
function Bg(n) {
  return function(e, t) {
    let { $from: r, $to: i } = e.selection, o = r.blockRange(i, (s) => s.childCount > 0 && s.firstChild.type == n);
    return o ? t ? r.node(o.depth - 1).type == n ? Hg(e, t, n, o) : zg(e, t, o) : !0 : !1;
  };
}
function Hg(n, e, t, r) {
  let i = n.tr, o = r.end, s = r.$to.end(r.depth);
  o < s && (i.step(new ye(o - 1, s, o, s, new A(C.from(t.create(null, r.parent.copy())), 1, 0), 1, !0)), r = new eo(i.doc.resolve(r.$from.pos), i.doc.resolve(s), r.depth));
  const l = rr(r);
  if (l == null)
    return !1;
  i.lift(r, l);
  let a = i.doc.resolve(i.mapping.map(o, -1) - 1);
  return en(i.doc, a.pos) && a.nodeBefore.type == a.nodeAfter.type && i.join(a.pos), e(i.scrollIntoView()), !0;
}
function zg(n, e, t) {
  let r = n.tr, i = t.parent;
  for (let h = t.end, p = t.endIndex - 1, m = t.startIndex; p > m; p--)
    h -= i.child(p).nodeSize, r.delete(h - 1, h + 1);
  let o = r.doc.resolve(t.start), s = o.nodeAfter;
  if (r.mapping.map(t.end) != t.start + o.nodeAfter.nodeSize)
    return !1;
  let l = t.startIndex == 0, a = t.endIndex == i.childCount, c = o.node(-1), u = o.index(-1);
  if (!c.canReplace(u + (l ? 0 : 1), u + 1, s.content.append(a ? C.empty : C.from(i))))
    return !1;
  let d = o.pos, f = d + s.nodeSize;
  return r.step(new ye(d - (l ? 1 : 0), f + (a ? 1 : 0), d + 1, f - 1, new A((l ? C.empty : C.from(i.copy(C.empty))).append(a ? C.empty : C.from(i.copy(C.empty))), l ? 0 : 1, a ? 0 : 1), l ? 0 : 1)), e(r.scrollIntoView()), !0;
}
function $g(n) {
  return function(e, t) {
    let { $from: r, $to: i } = e.selection, o = r.blockRange(i, (c) => c.childCount > 0 && c.firstChild.type == n);
    if (!o)
      return !1;
    let s = o.startIndex;
    if (s == 0)
      return !1;
    let l = o.parent, a = l.child(s - 1);
    if (a.type != n)
      return !1;
    if (t) {
      let c = a.lastChild && a.lastChild.type == l.type, u = C.from(c ? n.create() : null), d = new A(C.from(n.create(null, C.from(l.type.create(null, u)))), c ? 3 : 1, 0), f = o.start, h = o.end;
      t(e.tr.step(new ye(f - (c ? 3 : 1), h, f, h, d, 1, !0)).scrollIntoView());
    }
    return !0;
  };
}
function Jo(n) {
  const { state: e, transaction: t } = n;
  let { selection: r } = t, { doc: i } = t, { storedMarks: o } = t;
  return {
    ...e,
    apply: e.apply.bind(e),
    applyTransaction: e.applyTransaction.bind(e),
    plugins: e.plugins,
    schema: e.schema,
    reconfigure: e.reconfigure.bind(e),
    toJSON: e.toJSON.bind(e),
    get storedMarks() {
      return o;
    },
    get selection() {
      return r;
    },
    get doc() {
      return i;
    },
    get tr() {
      return r = t.selection, i = t.doc, o = t.storedMarks, t;
    }
  };
}
class Go {
  constructor(e) {
    this.editor = e.editor, this.rawCommands = this.editor.extensionManager.commands, this.customState = e.state;
  }
  get hasCustomState() {
    return !!this.customState;
  }
  get state() {
    return this.customState || this.editor.state;
  }
  get commands() {
    const { rawCommands: e, editor: t, state: r } = this, { view: i } = t, { tr: o } = r, s = this.buildProps(o);
    return Object.fromEntries(Object.entries(e).map(([l, a]) => [l, (...u) => {
      const d = a(...u)(s);
      return !o.getMeta("preventDispatch") && !this.hasCustomState && i.dispatch(o), d;
    }]));
  }
  get chain() {
    return () => this.createChain();
  }
  get can() {
    return () => this.createCan();
  }
  createChain(e, t = !0) {
    const { rawCommands: r, editor: i, state: o } = this, { view: s } = i, l = [], a = !!e, c = e || o.tr, u = () => (!a && t && !c.getMeta("preventDispatch") && !this.hasCustomState && s.dispatch(c), l.every((f) => f === !0)), d = {
      ...Object.fromEntries(Object.entries(r).map(([f, h]) => [f, (...m) => {
        const g = this.buildProps(c, t), b = h(...m)(g);
        return l.push(b), d;
      }])),
      run: u
    };
    return d;
  }
  createCan(e) {
    const { rawCommands: t, state: r } = this, i = !1, o = e || r.tr, s = this.buildProps(o, i);
    return {
      ...Object.fromEntries(Object.entries(t).map(([a, c]) => [a, (...u) => c(...u)({ ...s, dispatch: void 0 })])),
      chain: () => this.createChain(o, i)
    };
  }
  buildProps(e, t = !0) {
    const { rawCommands: r, editor: i, state: o } = this, { view: s } = i, l = {
      tr: e,
      editor: i,
      view: s,
      state: Jo({
        state: o,
        transaction: e
      }),
      dispatch: t ? () => {
      } : void 0,
      chain: () => this.createChain(e, t),
      can: () => this.createCan(e),
      get commands() {
        return Object.fromEntries(Object.entries(r).map(([a, c]) => [a, (...u) => c(...u)(l)]));
      }
    };
    return l;
  }
}
class Fg {
  constructor() {
    this.callbacks = {};
  }
  on(e, t) {
    return this.callbacks[e] || (this.callbacks[e] = []), this.callbacks[e].push(t), this;
  }
  emit(e, ...t) {
    const r = this.callbacks[e];
    return r && r.forEach((i) => i.apply(this, t)), this;
  }
  off(e, t) {
    const r = this.callbacks[e];
    return r && (t ? this.callbacks[e] = r.filter((i) => i !== t) : delete this.callbacks[e]), this;
  }
  once(e, t) {
    const r = (...i) => {
      this.off(e, r), t.apply(this, i);
    };
    return this.on(e, r);
  }
  removeAllListeners() {
    this.callbacks = {};
  }
}
function D(n, e, t) {
  return n.config[e] === void 0 && n.parent ? D(n.parent, e, t) : typeof n.config[e] == "function" ? n.config[e].bind({
    ...t,
    parent: n.parent ? D(n.parent, e, t) : null
  }) : n.config[e];
}
function Yo(n) {
  const e = n.filter((i) => i.type === "extension"), t = n.filter((i) => i.type === "node"), r = n.filter((i) => i.type === "mark");
  return {
    baseExtensions: e,
    nodeExtensions: t,
    markExtensions: r
  };
}
function ef(n) {
  const e = [], { nodeExtensions: t, markExtensions: r } = Yo(n), i = [...t, ...r], o = {
    default: null,
    rendered: !0,
    renderHTML: null,
    parseHTML: null,
    keepOnSplit: !0,
    isRequired: !1
  };
  return n.forEach((s) => {
    const l = {
      name: s.name,
      options: s.options,
      storage: s.storage,
      extensions: i
    }, a = D(s, "addGlobalAttributes", l);
    if (!a)
      return;
    a().forEach((u) => {
      u.types.forEach((d) => {
        Object.entries(u.attributes).forEach(([f, h]) => {
          e.push({
            type: d,
            name: f,
            attribute: {
              ...o,
              ...h
            }
          });
        });
      });
    });
  }), i.forEach((s) => {
    const l = {
      name: s.name,
      options: s.options,
      storage: s.storage
    }, a = D(s, "addAttributes", l);
    if (!a)
      return;
    const c = a();
    Object.entries(c).forEach(([u, d]) => {
      const f = {
        ...o,
        ...d
      };
      typeof (f == null ? void 0 : f.default) == "function" && (f.default = f.default()), f != null && f.isRequired && (f == null ? void 0 : f.default) === void 0 && delete f.default, e.push({
        type: s.name,
        name: u,
        attribute: f
      });
    });
  }), e;
}
function ve(n, e) {
  if (typeof n == "string") {
    if (!e.nodes[n])
      throw Error(`There is no node type named '${n}'. Maybe you forgot to add the extension?`);
    return e.nodes[n];
  }
  return n;
}
function Y(...n) {
  return n.filter((e) => !!e).reduce((e, t) => {
    const r = { ...e };
    return Object.entries(t).forEach(([i, o]) => {
      if (!r[i]) {
        r[i] = o;
        return;
      }
      if (i === "class") {
        const l = o ? String(o).split(" ") : [], a = r[i] ? r[i].split(" ") : [], c = l.filter((u) => !a.includes(u));
        r[i] = [...a, ...c].join(" ");
      } else if (i === "style") {
        const l = o ? o.split(";").map((u) => u.trim()).filter(Boolean) : [], a = r[i] ? r[i].split(";").map((u) => u.trim()).filter(Boolean) : [], c = /* @__PURE__ */ new Map();
        a.forEach((u) => {
          const [d, f] = u.split(":").map((h) => h.trim());
          c.set(d, f);
        }), l.forEach((u) => {
          const [d, f] = u.split(":").map((h) => h.trim());
          c.set(d, f);
        }), r[i] = Array.from(c.entries()).map(([u, d]) => `${u}: ${d}`).join("; ");
      } else
        r[i] = o;
    }), r;
  }, {});
}
function rl(n, e) {
  return e.filter((t) => t.type === n.type.name).filter((t) => t.attribute.rendered).map((t) => t.attribute.renderHTML ? t.attribute.renderHTML(n.attrs) || {} : {
    [t.name]: n.attrs[t.name]
  }).reduce((t, r) => Y(t, r), {});
}
function tf(n) {
  return typeof n == "function";
}
function V(n, e = void 0, ...t) {
  return tf(n) ? e ? n.bind(e)(...t) : n(...t) : n;
}
function Vg(n = {}) {
  return Object.keys(n).length === 0 && n.constructor === Object;
}
function jg(n) {
  return typeof n != "string" ? n : n.match(/^[+-]?(?:\d*\.)?\d+$/) ? Number(n) : n === "true" ? !0 : n === "false" ? !1 : n;
}
function vc(n, e) {
  return "style" in n ? n : {
    ...n,
    getAttrs: (t) => {
      const r = n.getAttrs ? n.getAttrs(t) : n.attrs;
      if (r === !1)
        return !1;
      const i = e.reduce((o, s) => {
        const l = s.attribute.parseHTML ? s.attribute.parseHTML(t) : jg(t.getAttribute(s.name));
        return l == null ? o : {
          ...o,
          [s.name]: l
        };
      }, {});
      return { ...r, ...i };
    }
  };
}
function wc(n) {
  return Object.fromEntries(
    // @ts-ignore
    Object.entries(n).filter(([e, t]) => e === "attrs" && Vg(t) ? !1 : t != null)
  );
}
function Wg(n, e) {
  var t;
  const r = ef(n), { nodeExtensions: i, markExtensions: o } = Yo(n), s = (t = i.find((c) => D(c, "topNode"))) === null || t === void 0 ? void 0 : t.name, l = Object.fromEntries(i.map((c) => {
    const u = r.filter((b) => b.type === c.name), d = {
      name: c.name,
      options: c.options,
      storage: c.storage,
      editor: e
    }, f = n.reduce((b, T) => {
      const S = D(T, "extendNodeSchema", d);
      return {
        ...b,
        ...S ? S(c) : {}
      };
    }, {}), h = wc({
      ...f,
      content: V(D(c, "content", d)),
      marks: V(D(c, "marks", d)),
      group: V(D(c, "group", d)),
      inline: V(D(c, "inline", d)),
      atom: V(D(c, "atom", d)),
      selectable: V(D(c, "selectable", d)),
      draggable: V(D(c, "draggable", d)),
      code: V(D(c, "code", d)),
      whitespace: V(D(c, "whitespace", d)),
      linebreakReplacement: V(D(c, "linebreakReplacement", d)),
      defining: V(D(c, "defining", d)),
      isolating: V(D(c, "isolating", d)),
      attrs: Object.fromEntries(u.map((b) => {
        var T;
        return [b.name, { default: (T = b == null ? void 0 : b.attribute) === null || T === void 0 ? void 0 : T.default }];
      }))
    }), p = V(D(c, "parseHTML", d));
    p && (h.parseDOM = p.map((b) => vc(b, u)));
    const m = D(c, "renderHTML", d);
    m && (h.toDOM = (b) => m({
      node: b,
      HTMLAttributes: rl(b, u)
    }));
    const g = D(c, "renderText", d);
    return g && (h.toText = g), [c.name, h];
  })), a = Object.fromEntries(o.map((c) => {
    const u = r.filter((g) => g.type === c.name), d = {
      name: c.name,
      options: c.options,
      storage: c.storage,
      editor: e
    }, f = n.reduce((g, b) => {
      const T = D(b, "extendMarkSchema", d);
      return {
        ...g,
        ...T ? T(c) : {}
      };
    }, {}), h = wc({
      ...f,
      inclusive: V(D(c, "inclusive", d)),
      excludes: V(D(c, "excludes", d)),
      group: V(D(c, "group", d)),
      spanning: V(D(c, "spanning", d)),
      code: V(D(c, "code", d)),
      attrs: Object.fromEntries(u.map((g) => {
        var b;
        return [g.name, { default: (b = g == null ? void 0 : g.attribute) === null || b === void 0 ? void 0 : b.default }];
      }))
    }), p = V(D(c, "parseHTML", d));
    p && (h.parseDOM = p.map((g) => vc(g, u)));
    const m = D(c, "renderHTML", d);
    return m && (h.toDOM = (g) => m({
      mark: g,
      HTMLAttributes: rl(g, u)
    })), [c.name, h];
  }));
  return new Fu({
    topNode: s,
    nodes: l,
    marks: a
  });
}
function ks(n, e) {
  return e.nodes[n] || e.marks[n] || null;
}
function kc(n, e) {
  return Array.isArray(e) ? e.some((t) => (typeof t == "string" ? t : t.name) === n.name) : e;
}
function Gl(n, e) {
  const t = An.fromSchema(e).serializeFragment(n), i = document.implementation.createHTMLDocument().createElement("div");
  return i.appendChild(t), i.innerHTML;
}
const _g = (n, e = 500) => {
  let t = "";
  const r = n.parentOffset;
  return n.parent.nodesBetween(Math.max(0, r - e), r, (i, o, s, l) => {
    var a, c;
    const u = ((c = (a = i.type.spec).toText) === null || c === void 0 ? void 0 : c.call(a, {
      node: i,
      pos: o,
      parent: s,
      index: l
    })) || i.textContent || "%leaf%";
    t += i.isAtom && !i.isText ? u : u.slice(0, Math.max(0, r - o));
  }), t;
};
function Yl(n) {
  return Object.prototype.toString.call(n) === "[object RegExp]";
}
class Xo {
  constructor(e) {
    this.find = e.find, this.handler = e.handler;
  }
}
const Ug = (n, e) => {
  if (Yl(e))
    return e.exec(n);
  const t = e(n);
  if (!t)
    return null;
  const r = [t.text];
  return r.index = t.index, r.input = n, r.data = t.data, t.replaceWith && (t.text.includes(t.replaceWith) || console.warn('[tiptap warn]: "inputRuleMatch.replaceWith" must be part of "inputRuleMatch.text".'), r.push(t.replaceWith)), r;
};
function Ei(n) {
  var e;
  const { editor: t, from: r, to: i, text: o, rules: s, plugin: l } = n, { view: a } = t;
  if (a.composing)
    return !1;
  const c = a.state.doc.resolve(r);
  if (
    // check for code node
    c.parent.type.spec.code || !((e = c.nodeBefore || c.nodeAfter) === null || e === void 0) && e.marks.find((f) => f.type.spec.code)
  )
    return !1;
  let u = !1;
  const d = _g(c) + o;
  return s.forEach((f) => {
    if (u)
      return;
    const h = Ug(d, f.find);
    if (!h)
      return;
    const p = a.state.tr, m = Jo({
      state: a.state,
      transaction: p
    }), g = {
      from: r - (h[0].length - o.length),
      to: i
    }, { commands: b, chain: T, can: S } = new Go({
      editor: t,
      state: m
    });
    f.handler({
      state: m,
      range: g,
      match: h,
      commands: b,
      chain: T,
      can: S
    }) === null || !p.steps.length || (p.setMeta(l, {
      transform: p,
      from: r,
      to: i,
      text: o
    }), a.dispatch(p), u = !0);
  }), u;
}
function Kg(n) {
  const { editor: e, rules: t } = n, r = new ie({
    state: {
      init() {
        return null;
      },
      apply(i, o, s) {
        const l = i.getMeta(r);
        if (l)
          return l;
        const a = i.getMeta("applyInputRules");
        return !!a && setTimeout(() => {
          let { text: u } = a;
          typeof u == "string" ? u = u : u = Gl(C.from(u), s.schema);
          const { from: d } = a, f = d + u.length;
          Ei({
            editor: e,
            from: d,
            to: f,
            text: u,
            rules: t,
            plugin: r
          });
        }), i.selectionSet || i.docChanged ? null : o;
      }
    },
    props: {
      handleTextInput(i, o, s, l) {
        return Ei({
          editor: e,
          from: o,
          to: s,
          text: l,
          rules: t,
          plugin: r
        });
      },
      handleDOMEvents: {
        compositionend: (i) => (setTimeout(() => {
          const { $cursor: o } = i.state.selection;
          o && Ei({
            editor: e,
            from: o.pos,
            to: o.pos,
            text: "",
            rules: t,
            plugin: r
          });
        }), !1)
      },
      // add support for input rules to trigger on enter
      // this is useful for example for code blocks
      handleKeyDown(i, o) {
        if (o.key !== "Enter")
          return !1;
        const { $cursor: s } = i.state.selection;
        return s ? Ei({
          editor: e,
          from: s.pos,
          to: s.pos,
          text: `
`,
          rules: t,
          plugin: r
        }) : !1;
      }
    },
    // @ts-ignore
    isInputRules: !0
  });
  return r;
}
function qg(n) {
  return Object.prototype.toString.call(n).slice(8, -1);
}
function Mi(n) {
  return qg(n) !== "Object" ? !1 : n.constructor === Object && Object.getPrototypeOf(n) === Object.prototype;
}
function Qo(n, e) {
  const t = { ...n };
  return Mi(n) && Mi(e) && Object.keys(e).forEach((r) => {
    Mi(e[r]) && Mi(n[r]) ? t[r] = Qo(n[r], e[r]) : t[r] = e[r];
  }), t;
}
class mt {
  constructor(e = {}) {
    this.type = "mark", this.name = "mark", this.parent = null, this.child = null, this.config = {
      name: this.name,
      defaultOptions: {}
    }, this.config = {
      ...this.config,
      ...e
    }, this.name = this.config.name, e.defaultOptions && Object.keys(e.defaultOptions).length > 0 && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`), this.options = this.config.defaultOptions, this.config.addOptions && (this.options = V(D(this, "addOptions", {
      name: this.name
    }))), this.storage = V(D(this, "addStorage", {
      name: this.name,
      options: this.options
    })) || {};
  }
  static create(e = {}) {
    return new mt(e);
  }
  configure(e = {}) {
    const t = this.extend({
      ...this.config,
      addOptions: () => Qo(this.options, e)
    });
    return t.name = this.name, t.parent = this.parent, t;
  }
  extend(e = {}) {
    const t = new mt(e);
    return t.parent = this, this.child = t, t.name = e.name ? e.name : t.parent.name, e.defaultOptions && Object.keys(e.defaultOptions).length > 0 && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${t.name}".`), t.options = V(D(t, "addOptions", {
      name: t.name
    })), t.storage = V(D(t, "addStorage", {
      name: t.name,
      options: t.options
    })), t;
  }
  static handleExit({ editor: e, mark: t }) {
    const { tr: r } = e.state, i = e.state.selection.$from;
    if (i.pos === i.end()) {
      const s = i.marks();
      if (!!!s.find((c) => (c == null ? void 0 : c.type.name) === t.name))
        return !1;
      const a = s.find((c) => (c == null ? void 0 : c.type.name) === t.name);
      return a && r.removeStoredMark(a), r.insertText(" ", i.pos), e.view.dispatch(r), !0;
    }
    return !1;
  }
}
function Jg(n) {
  return typeof n == "number";
}
class Gg {
  constructor(e) {
    this.find = e.find, this.handler = e.handler;
  }
}
const Yg = (n, e, t) => {
  if (Yl(e))
    return [...n.matchAll(e)];
  const r = e(n, t);
  return r ? r.map((i) => {
    const o = [i.text];
    return o.index = i.index, o.input = n, o.data = i.data, i.replaceWith && (i.text.includes(i.replaceWith) || console.warn('[tiptap warn]: "pasteRuleMatch.replaceWith" must be part of "pasteRuleMatch.text".'), o.push(i.replaceWith)), o;
  }) : [];
};
function Xg(n) {
  const { editor: e, state: t, from: r, to: i, rule: o, pasteEvent: s, dropEvent: l } = n, { commands: a, chain: c, can: u } = new Go({
    editor: e,
    state: t
  }), d = [];
  return t.doc.nodesBetween(r, i, (h, p) => {
    if (!h.isTextblock || h.type.spec.code)
      return;
    const m = Math.max(r, p), g = Math.min(i, p + h.content.size), b = h.textBetween(m - p, g - p, void 0, "￼");
    Yg(b, o.find, s).forEach((S) => {
      if (S.index === void 0)
        return;
      const y = m + S.index + 1, O = y + S[0].length, x = {
        from: t.tr.mapping.map(y),
        to: t.tr.mapping.map(O)
      }, E = o.handler({
        state: t,
        range: x,
        match: S,
        commands: a,
        chain: c,
        can: u,
        pasteEvent: s,
        dropEvent: l
      });
      d.push(E);
    });
  }), d.every((h) => h !== null);
}
let Oi = null;
const Qg = (n) => {
  var e;
  const t = new ClipboardEvent("paste", {
    clipboardData: new DataTransfer()
  });
  return (e = t.clipboardData) === null || e === void 0 || e.setData("text/html", n), t;
};
function Zg(n) {
  const { editor: e, rules: t } = n;
  let r = null, i = !1, o = !1, s = typeof ClipboardEvent < "u" ? new ClipboardEvent("paste") : null, l;
  try {
    l = typeof DragEvent < "u" ? new DragEvent("drop") : null;
  } catch {
    l = null;
  }
  const a = ({ state: u, from: d, to: f, rule: h, pasteEvt: p }) => {
    const m = u.tr, g = Jo({
      state: u,
      transaction: m
    });
    if (!(!Xg({
      editor: e,
      state: g,
      from: Math.max(d - 1, 0),
      to: f.b - 1,
      rule: h,
      pasteEvent: p,
      dropEvent: l
    }) || !m.steps.length)) {
      try {
        l = typeof DragEvent < "u" ? new DragEvent("drop") : null;
      } catch {
        l = null;
      }
      return s = typeof ClipboardEvent < "u" ? new ClipboardEvent("paste") : null, m;
    }
  };
  return t.map((u) => new ie({
    // we register a global drag handler to track the current drag source element
    view(d) {
      const f = (p) => {
        var m;
        r = !((m = d.dom.parentElement) === null || m === void 0) && m.contains(p.target) ? d.dom.parentElement : null, r && (Oi = e);
      }, h = () => {
        Oi && (Oi = null);
      };
      return window.addEventListener("dragstart", f), window.addEventListener("dragend", h), {
        destroy() {
          window.removeEventListener("dragstart", f), window.removeEventListener("dragend", h);
        }
      };
    },
    props: {
      handleDOMEvents: {
        drop: (d, f) => {
          if (o = r === d.dom.parentElement, l = f, !o) {
            const h = Oi;
            h != null && h.isEditable && setTimeout(() => {
              const p = h.state.selection;
              p && h.commands.deleteRange({ from: p.from, to: p.to });
            }, 10);
          }
          return !1;
        },
        paste: (d, f) => {
          var h;
          const p = (h = f.clipboardData) === null || h === void 0 ? void 0 : h.getData("text/html");
          return s = f, i = !!(p != null && p.includes("data-pm-slice")), !1;
        }
      }
    },
    appendTransaction: (d, f, h) => {
      const p = d[0], m = p.getMeta("uiEvent") === "paste" && !i, g = p.getMeta("uiEvent") === "drop" && !o, b = p.getMeta("applyPasteRules"), T = !!b;
      if (!m && !g && !T)
        return;
      if (T) {
        let { text: O } = b;
        typeof O == "string" ? O = O : O = Gl(C.from(O), h.schema);
        const { from: x } = b, E = x + O.length, k = Qg(O);
        return a({
          rule: u,
          state: h,
          from: x,
          to: { b: E },
          pasteEvt: k
        });
      }
      const S = f.doc.content.findDiffStart(h.doc.content), y = f.doc.content.findDiffEnd(h.doc.content);
      if (!(!Jg(S) || !y || S === y.b))
        return a({
          rule: u,
          state: h,
          from: S,
          to: y,
          pasteEvt: s
        });
    }
  }));
}
function ey(n) {
  const e = n.filter((t, r) => n.indexOf(t) !== r);
  return Array.from(new Set(e));
}
class jn {
  constructor(e, t) {
    this.splittableMarks = [], this.editor = t, this.extensions = jn.resolve(e), this.schema = Wg(this.extensions, t), this.setupExtensions();
  }
  /**
   * Returns a flattened and sorted extension list while
   * also checking for duplicated extensions and warns the user.
   * @param extensions An array of Tiptap extensions
   * @returns An flattened and sorted array of Tiptap extensions
   */
  static resolve(e) {
    const t = jn.sort(jn.flatten(e)), r = ey(t.map((i) => i.name));
    return r.length && console.warn(`[tiptap warn]: Duplicate extension names found: [${r.map((i) => `'${i}'`).join(", ")}]. This can lead to issues.`), t;
  }
  /**
   * Create a flattened array of extensions by traversing the `addExtensions` field.
   * @param extensions An array of Tiptap extensions
   * @returns A flattened array of Tiptap extensions
   */
  static flatten(e) {
    return e.map((t) => {
      const r = {
        name: t.name,
        options: t.options,
        storage: t.storage
      }, i = D(t, "addExtensions", r);
      return i ? [t, ...this.flatten(i())] : t;
    }).flat(10);
  }
  /**
   * Sort extensions by priority.
   * @param extensions An array of Tiptap extensions
   * @returns A sorted array of Tiptap extensions by priority
   */
  static sort(e) {
    return e.sort((r, i) => {
      const o = D(r, "priority") || 100, s = D(i, "priority") || 100;
      return o > s ? -1 : o < s ? 1 : 0;
    });
  }
  /**
   * Get all commands from the extensions.
   * @returns An object with all commands where the key is the command name and the value is the command function
   */
  get commands() {
    return this.extensions.reduce((e, t) => {
      const r = {
        name: t.name,
        options: t.options,
        storage: t.storage,
        editor: this.editor,
        type: ks(t.name, this.schema)
      }, i = D(t, "addCommands", r);
      return i ? {
        ...e,
        ...i()
      } : e;
    }, {});
  }
  /**
   * Get all registered Prosemirror plugins from the extensions.
   * @returns An array of Prosemirror plugins
   */
  get plugins() {
    const { editor: e } = this, t = jn.sort([...this.extensions].reverse()), r = [], i = [], o = t.map((s) => {
      const l = {
        name: s.name,
        options: s.options,
        storage: s.storage,
        editor: e,
        type: ks(s.name, this.schema)
      }, a = [], c = D(s, "addKeyboardShortcuts", l);
      let u = {};
      if (s.type === "mark" && D(s, "exitable", l) && (u.ArrowRight = () => mt.handleExit({ editor: e, mark: s })), c) {
        const m = Object.fromEntries(Object.entries(c()).map(([g, b]) => [g, () => b({ editor: e })]));
        u = { ...u, ...m };
      }
      const d = vg(u);
      a.push(d);
      const f = D(s, "addInputRules", l);
      kc(s, e.options.enableInputRules) && f && r.push(...f());
      const h = D(s, "addPasteRules", l);
      kc(s, e.options.enablePasteRules) && h && i.push(...h());
      const p = D(s, "addProseMirrorPlugins", l);
      if (p) {
        const m = p();
        a.push(...m);
      }
      return a;
    }).flat();
    return [
      Kg({
        editor: e,
        rules: r
      }),
      ...Zg({
        editor: e,
        rules: i
      }),
      ...o
    ];
  }
  /**
   * Get all attributes from the extensions.
   * @returns An array of attributes
   */
  get attributes() {
    return ef(this.extensions);
  }
  /**
   * Get all node views from the extensions.
   * @returns An object with all node views where the key is the node name and the value is the node view function
   */
  get nodeViews() {
    const { editor: e } = this, { nodeExtensions: t } = Yo(this.extensions);
    return Object.fromEntries(t.filter((r) => !!D(r, "addNodeView")).map((r) => {
      const i = this.attributes.filter((a) => a.type === r.name), o = {
        name: r.name,
        options: r.options,
        storage: r.storage,
        editor: e,
        type: ve(r.name, this.schema)
      }, s = D(r, "addNodeView", o);
      if (!s)
        return [];
      const l = (a, c, u, d, f) => {
        const h = rl(a, i);
        return s()({
          // pass-through
          node: a,
          view: c,
          getPos: u,
          decorations: d,
          innerDecorations: f,
          // tiptap-specific
          editor: e,
          extension: r,
          HTMLAttributes: h
        });
      };
      return [r.name, l];
    }));
  }
  /**
   * Go through all extensions, create extension storages & setup marks
   * & bind editor event listener.
   */
  setupExtensions() {
    this.extensions.forEach((e) => {
      var t;
      this.editor.extensionStorage[e.name] = e.storage;
      const r = {
        name: e.name,
        options: e.options,
        storage: e.storage,
        editor: this.editor,
        type: ks(e.name, this.schema)
      };
      e.type === "mark" && (!((t = V(D(e, "keepOnSplit", r))) !== null && t !== void 0) || t) && this.splittableMarks.push(e.name);
      const i = D(e, "onBeforeCreate", r), o = D(e, "onCreate", r), s = D(e, "onUpdate", r), l = D(e, "onSelectionUpdate", r), a = D(e, "onTransaction", r), c = D(e, "onFocus", r), u = D(e, "onBlur", r), d = D(e, "onDestroy", r);
      i && this.editor.on("beforeCreate", i), o && this.editor.on("create", o), s && this.editor.on("update", s), l && this.editor.on("selectionUpdate", l), a && this.editor.on("transaction", a), c && this.editor.on("focus", c), u && this.editor.on("blur", u), d && this.editor.on("destroy", d);
    });
  }
}
class ge {
  constructor(e = {}) {
    this.type = "extension", this.name = "extension", this.parent = null, this.child = null, this.config = {
      name: this.name,
      defaultOptions: {}
    }, this.config = {
      ...this.config,
      ...e
    }, this.name = this.config.name, e.defaultOptions && Object.keys(e.defaultOptions).length > 0 && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`), this.options = this.config.defaultOptions, this.config.addOptions && (this.options = V(D(this, "addOptions", {
      name: this.name
    }))), this.storage = V(D(this, "addStorage", {
      name: this.name,
      options: this.options
    })) || {};
  }
  static create(e = {}) {
    return new ge(e);
  }
  configure(e = {}) {
    const t = this.extend({
      ...this.config,
      addOptions: () => Qo(this.options, e)
    });
    return t.name = this.name, t.parent = this.parent, t;
  }
  extend(e = {}) {
    const t = new ge({ ...this.config, ...e });
    return t.parent = this, this.child = t, t.name = e.name ? e.name : t.parent.name, e.defaultOptions && Object.keys(e.defaultOptions).length > 0 && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${t.name}".`), t.options = V(D(t, "addOptions", {
      name: t.name
    })), t.storage = V(D(t, "addStorage", {
      name: t.name,
      options: t.options
    })), t;
  }
}
function nf(n, e, t) {
  const { from: r, to: i } = e, { blockSeparator: o = `

`, textSerializers: s = {} } = t || {};
  let l = "";
  return n.nodesBetween(r, i, (a, c, u, d) => {
    var f;
    a.isBlock && c > r && (l += o);
    const h = s == null ? void 0 : s[a.type.name];
    if (h)
      return u && (l += h({
        node: a,
        pos: c,
        parent: u,
        index: d,
        range: e
      })), !1;
    a.isText && (l += (f = a == null ? void 0 : a.text) === null || f === void 0 ? void 0 : f.slice(Math.max(r, c) - c, i - c));
  }), l;
}
function Xl(n) {
  return Object.fromEntries(Object.entries(n.nodes).filter(([, e]) => e.spec.toText).map(([e, t]) => [e, t.spec.toText]));
}
const ty = ge.create({
  name: "clipboardTextSerializer",
  addOptions() {
    return {
      blockSeparator: void 0
    };
  },
  addProseMirrorPlugins() {
    return [
      new ie({
        key: new ue("clipboardTextSerializer"),
        props: {
          clipboardTextSerializer: () => {
            const { editor: n } = this, { state: e, schema: t } = n, { doc: r, selection: i } = e, { ranges: o } = i, s = Math.min(...o.map((u) => u.$from.pos)), l = Math.max(...o.map((u) => u.$to.pos)), a = Xl(t);
            return nf(r, { from: s, to: l }, {
              ...this.options.blockSeparator !== void 0 ? { blockSeparator: this.options.blockSeparator } : {},
              textSerializers: a
            });
          }
        }
      })
    ];
  }
}), ny = () => ({ editor: n, view: e }) => (requestAnimationFrame(() => {
  var t;
  n.isDestroyed || (e.dom.blur(), (t = window == null ? void 0 : window.getSelection()) === null || t === void 0 || t.removeAllRanges());
}), !0), ry = (n = !1) => ({ commands: e }) => e.setContent("", n), iy = () => ({ state: n, tr: e, dispatch: t }) => {
  const { selection: r } = e, { ranges: i } = r;
  return t && i.forEach(({ $from: o, $to: s }) => {
    n.doc.nodesBetween(o.pos, s.pos, (l, a) => {
      if (l.type.isText)
        return;
      const { doc: c, mapping: u } = e, d = c.resolve(u.map(a)), f = c.resolve(u.map(a + l.nodeSize)), h = d.blockRange(f);
      if (!h)
        return;
      const p = rr(h);
      if (l.type.isTextblock) {
        const { defaultType: m } = d.parent.contentMatchAt(d.index());
        e.setNodeMarkup(h.start, m);
      }
      (p || p === 0) && e.lift(h, p);
    });
  }), !0;
}, oy = (n) => (e) => n(e), sy = () => ({ state: n, dispatch: e }) => Yd(n, e), ly = (n, e) => ({ editor: t, tr: r }) => {
  const { state: i } = t, o = i.doc.slice(n.from, n.to);
  r.deleteRange(n.from, n.to);
  const s = r.mapping.map(e);
  return r.insert(s, o.content), r.setSelection(new L(r.doc.resolve(Math.max(s - 1, 0)))), !0;
}, ay = () => ({ tr: n, dispatch: e }) => {
  const { selection: t } = n, r = t.$anchor.node();
  if (r.content.size > 0)
    return !1;
  const i = n.selection.$anchor;
  for (let o = i.depth; o > 0; o -= 1)
    if (i.node(o).type === r.type) {
      if (e) {
        const l = i.before(o), a = i.after(o);
        n.delete(l, a).scrollIntoView();
      }
      return !0;
    }
  return !1;
}, cy = (n) => ({ tr: e, state: t, dispatch: r }) => {
  const i = ve(n, t.schema), o = e.selection.$anchor;
  for (let s = o.depth; s > 0; s -= 1)
    if (o.node(s).type === i) {
      if (r) {
        const a = o.before(s), c = o.after(s);
        e.delete(a, c).scrollIntoView();
      }
      return !0;
    }
  return !1;
}, uy = (n) => ({ tr: e, dispatch: t }) => {
  const { from: r, to: i } = n;
  return t && e.delete(r, i), !0;
}, dy = () => ({ state: n, dispatch: e }) => _l(n, e), fy = () => ({ commands: n }) => n.keyboardShortcut("Enter"), hy = () => ({ state: n, dispatch: e }) => Tg(n, e);
function ao(n, e, t = { strict: !0 }) {
  const r = Object.keys(e);
  return r.length ? r.every((i) => t.strict ? e[i] === n[i] : Yl(e[i]) ? e[i].test(n[i]) : e[i] === n[i]) : !0;
}
function rf(n, e, t = {}) {
  return n.find((r) => r.type === e && ao(
    // Only check equality for the attributes that are provided
    Object.fromEntries(Object.keys(t).map((i) => [i, r.attrs[i]])),
    t
  ));
}
function Sc(n, e, t = {}) {
  return !!rf(n, e, t);
}
function Ql(n, e, t) {
  var r;
  if (!n || !e)
    return;
  let i = n.parent.childAfter(n.parentOffset);
  if ((!i.node || !i.node.marks.some((u) => u.type === e)) && (i = n.parent.childBefore(n.parentOffset)), !i.node || !i.node.marks.some((u) => u.type === e) || (t = t || ((r = i.node.marks[0]) === null || r === void 0 ? void 0 : r.attrs), !rf([...i.node.marks], e, t)))
    return;
  let s = i.index, l = n.start() + i.offset, a = s + 1, c = l + i.node.nodeSize;
  for (; s > 0 && Sc([...n.parent.child(s - 1).marks], e, t); )
    s -= 1, l -= n.parent.child(s).nodeSize;
  for (; a < n.parent.childCount && Sc([...n.parent.child(a).marks], e, t); )
    c += n.parent.child(a).nodeSize, a += 1;
  return {
    from: l,
    to: c
  };
}
function nn(n, e) {
  if (typeof n == "string") {
    if (!e.marks[n])
      throw Error(`There is no mark type named '${n}'. Maybe you forgot to add the extension?`);
    return e.marks[n];
  }
  return n;
}
const py = (n, e = {}) => ({ tr: t, state: r, dispatch: i }) => {
  const o = nn(n, r.schema), { doc: s, selection: l } = t, { $from: a, from: c, to: u } = l;
  if (i) {
    const d = Ql(a, o, e);
    if (d && d.from <= c && d.to >= u) {
      const f = L.create(s, d.from, d.to);
      t.setSelection(f);
    }
  }
  return !0;
}, my = (n) => (e) => {
  const t = typeof n == "function" ? n(e) : n;
  for (let r = 0; r < t.length; r += 1)
    if (t[r](e))
      return !0;
  return !1;
};
function Zl(n) {
  return n instanceof L;
}
function Rt(n = 0, e = 0, t = 0) {
  return Math.min(Math.max(n, e), t);
}
function of(n, e = null) {
  if (!e)
    return null;
  const t = H.atStart(n), r = H.atEnd(n);
  if (e === "start" || e === !0)
    return t;
  if (e === "end")
    return r;
  const i = t.from, o = r.to;
  return e === "all" ? L.create(n, Rt(0, i, o), Rt(n.content.size, i, o)) : L.create(n, Rt(e, i, o), Rt(e, i, o));
}
function xc() {
  return navigator.platform === "Android" || /android/i.test(navigator.userAgent);
}
function co() {
  return [
    "iPad Simulator",
    "iPhone Simulator",
    "iPod Simulator",
    "iPad",
    "iPhone",
    "iPod"
  ].includes(navigator.platform) || navigator.userAgent.includes("Mac") && "ontouchend" in document;
}
function gy() {
  return typeof navigator < "u" ? /^((?!chrome|android).)*safari/i.test(navigator.userAgent) : !1;
}
const yy = (n = null, e = {}) => ({ editor: t, view: r, tr: i, dispatch: o }) => {
  e = {
    scrollIntoView: !0,
    ...e
  };
  const s = () => {
    (co() || xc()) && r.dom.focus(), requestAnimationFrame(() => {
      t.isDestroyed || (r.focus(), gy() && !co() && !xc() && r.dom.focus({ preventScroll: !0 }));
    });
  };
  if (r.hasFocus() && n === null || n === !1)
    return !0;
  if (o && n === null && !Zl(t.state.selection))
    return s(), !0;
  const l = of(i.doc, n) || t.state.selection, a = t.state.selection.eq(l);
  return o && (a || i.setSelection(l), a && i.storedMarks && i.setStoredMarks(i.storedMarks), s()), !0;
}, by = (n, e) => (t) => n.every((r, i) => e(r, { ...t, index: i })), vy = (n, e) => ({ tr: t, commands: r }) => r.insertContentAt({ from: t.selection.from, to: t.selection.to }, n, e), sf = (n) => {
  const e = n.childNodes;
  for (let t = e.length - 1; t >= 0; t -= 1) {
    const r = e[t];
    r.nodeType === 3 && r.nodeValue && /^(\n\s\s|\n)$/.test(r.nodeValue) ? n.removeChild(r) : r.nodeType === 1 && sf(r);
  }
  return n;
};
function Ai(n) {
  const e = `<body>${n}</body>`, t = new window.DOMParser().parseFromString(e, "text/html").body;
  return sf(t);
}
function Wr(n, e, t) {
  if (n instanceof It || n instanceof C)
    return n;
  t = {
    slice: !0,
    parseOptions: {},
    ...t
  };
  const r = typeof n == "object" && n !== null, i = typeof n == "string";
  if (r)
    try {
      if (Array.isArray(n) && n.length > 0)
        return C.fromArray(n.map((l) => e.nodeFromJSON(l)));
      const s = e.nodeFromJSON(n);
      return t.errorOnInvalidContent && s.check(), s;
    } catch (o) {
      if (t.errorOnInvalidContent)
        throw new Error("[tiptap error]: Invalid JSON content", { cause: o });
      return console.warn("[tiptap warn]: Invalid content.", "Passed value:", n, "Error:", o), Wr("", e, t);
    }
  if (i) {
    if (t.errorOnInvalidContent) {
      let s = !1, l = "";
      const a = new Fu({
        topNode: e.spec.topNode,
        marks: e.spec.marks,
        // Prosemirror's schemas are executed such that: the last to execute, matches last
        // This means that we can add a catch-all node at the end of the schema to catch any content that we don't know how to handle
        nodes: e.spec.nodes.append({
          __tiptap__private__unknown__catch__all__node: {
            content: "inline*",
            group: "block",
            parseDOM: [
              {
                tag: "*",
                getAttrs: (c) => (s = !0, l = typeof c == "string" ? c : c.outerHTML, null)
              }
            ]
          }
        })
      });
      if (t.slice ? Jt.fromSchema(a).parseSlice(Ai(n), t.parseOptions) : Jt.fromSchema(a).parse(Ai(n), t.parseOptions), t.errorOnInvalidContent && s)
        throw new Error("[tiptap error]: Invalid HTML content", { cause: new Error(`Invalid element found: ${l}`) });
    }
    const o = Jt.fromSchema(e);
    return t.slice ? o.parseSlice(Ai(n), t.parseOptions).content : o.parse(Ai(n), t.parseOptions);
  }
  return Wr("", e, t);
}
function wy(n, e, t) {
  const r = n.steps.length - 1;
  if (r < e)
    return;
  const i = n.steps[r];
  if (!(i instanceof fe || i instanceof ye))
    return;
  const o = n.mapping.maps[r];
  let s = 0;
  o.forEach((l, a, c, u) => {
    s === 0 && (s = u);
  }), n.setSelection(H.near(n.doc.resolve(s), t));
}
const ky = (n) => !("type" in n), Sy = (n, e, t) => ({ tr: r, dispatch: i, editor: o }) => {
  var s;
  if (i) {
    t = {
      parseOptions: o.options.parseOptions,
      updateSelection: !0,
      applyInputRules: !1,
      applyPasteRules: !1,
      ...t
    };
    let l;
    const a = (g) => {
      o.emit("contentError", {
        editor: o,
        error: g,
        disableCollaboration: () => {
          o.storage.collaboration && (o.storage.collaboration.isDisabled = !0);
        }
      });
    }, c = {
      preserveWhitespace: "full",
      ...t.parseOptions
    };
    if (!t.errorOnInvalidContent && !o.options.enableContentCheck && o.options.emitContentError)
      try {
        Wr(e, o.schema, {
          parseOptions: c,
          errorOnInvalidContent: !0
        });
      } catch (g) {
        a(g);
      }
    try {
      l = Wr(e, o.schema, {
        parseOptions: c,
        errorOnInvalidContent: (s = t.errorOnInvalidContent) !== null && s !== void 0 ? s : o.options.enableContentCheck
      });
    } catch (g) {
      return a(g), !1;
    }
    let { from: u, to: d } = typeof n == "number" ? { from: n, to: n } : { from: n.from, to: n.to }, f = !0, h = !0;
    if ((ky(l) ? l : [l]).forEach((g) => {
      g.check(), f = f ? g.isText && g.marks.length === 0 : !1, h = h ? g.isBlock : !1;
    }), u === d && h) {
      const { parent: g } = r.doc.resolve(u);
      g.isTextblock && !g.type.spec.code && !g.childCount && (u -= 1, d += 1);
    }
    let m;
    if (f) {
      if (Array.isArray(e))
        m = e.map((g) => g.text || "").join("");
      else if (e instanceof C) {
        let g = "";
        e.forEach((b) => {
          b.text && (g += b.text);
        }), m = g;
      } else typeof e == "object" && e && e.text ? m = e.text : m = e;
      r.insertText(m, u, d);
    } else
      m = l, r.replaceWith(u, d, m);
    t.updateSelection && wy(r, r.steps.length - 1, -1), t.applyInputRules && r.setMeta("applyInputRules", { from: u, text: m }), t.applyPasteRules && r.setMeta("applyPasteRules", { from: u, text: m });
  }
  return !0;
}, xy = () => ({ state: n, dispatch: e }) => Sg(n, e), Cy = () => ({ state: n, dispatch: e }) => xg(n, e), Ty = () => ({ state: n, dispatch: e }) => Wd(n, e), Ey = () => ({ state: n, dispatch: e }) => qd(n, e), My = () => ({ state: n, dispatch: e, tr: t }) => {
  try {
    const r = Wo(n.doc, n.selection.$from.pos, -1);
    return r == null ? !1 : (t.join(r, 2), e && e(t), !0);
  } catch {
    return !1;
  }
}, Oy = () => ({ state: n, dispatch: e, tr: t }) => {
  try {
    const r = Wo(n.doc, n.selection.$from.pos, 1);
    return r == null ? !1 : (t.join(r, 2), e && e(t), !0);
  } catch {
    return !1;
  }
}, Ay = () => ({ state: n, dispatch: e }) => wg(n, e), Ny = () => ({ state: n, dispatch: e }) => kg(n, e);
function lf() {
  return typeof navigator < "u" ? /Mac/.test(navigator.platform) : !1;
}
function Dy(n) {
  const e = n.split(/-(?!$)/);
  let t = e[e.length - 1];
  t === "Space" && (t = " ");
  let r, i, o, s;
  for (let l = 0; l < e.length - 1; l += 1) {
    const a = e[l];
    if (/^(cmd|meta|m)$/i.test(a))
      s = !0;
    else if (/^a(lt)?$/i.test(a))
      r = !0;
    else if (/^(c|ctrl|control)$/i.test(a))
      i = !0;
    else if (/^s(hift)?$/i.test(a))
      o = !0;
    else if (/^mod$/i.test(a))
      co() || lf() ? s = !0 : i = !0;
    else
      throw new Error(`Unrecognized modifier name: ${a}`);
  }
  return r && (t = `Alt-${t}`), i && (t = `Ctrl-${t}`), s && (t = `Meta-${t}`), o && (t = `Shift-${t}`), t;
}
const Ry = (n) => ({ editor: e, view: t, tr: r, dispatch: i }) => {
  const o = Dy(n).split(/-(?!$)/), s = o.find((c) => !["Alt", "Ctrl", "Meta", "Shift"].includes(c)), l = new KeyboardEvent("keydown", {
    key: s === "Space" ? " " : s,
    altKey: o.includes("Alt"),
    ctrlKey: o.includes("Ctrl"),
    metaKey: o.includes("Meta"),
    shiftKey: o.includes("Shift"),
    bubbles: !0,
    cancelable: !0
  }), a = e.captureTransaction(() => {
    t.someProp("handleKeyDown", (c) => c(t, l));
  });
  return a == null || a.steps.forEach((c) => {
    const u = c.map(r.mapping);
    u && i && r.maybeStep(u);
  }), !0;
};
function _r(n, e, t = {}) {
  const { from: r, to: i, empty: o } = n.selection, s = e ? ve(e, n.schema) : null, l = [];
  n.doc.nodesBetween(r, i, (d, f) => {
    if (d.isText)
      return;
    const h = Math.max(r, f), p = Math.min(i, f + d.nodeSize);
    l.push({
      node: d,
      from: h,
      to: p
    });
  });
  const a = i - r, c = l.filter((d) => s ? s.name === d.node.type.name : !0).filter((d) => ao(d.node.attrs, t, { strict: !1 }));
  return o ? !!c.length : c.reduce((d, f) => d + f.to - f.from, 0) >= a;
}
const Iy = (n, e = {}) => ({ state: t, dispatch: r }) => {
  const i = ve(n, t.schema);
  return _r(t, i, e) ? Cg(t, r) : !1;
}, Ly = () => ({ state: n, dispatch: e }) => Xd(n, e), Py = (n) => ({ state: e, dispatch: t }) => {
  const r = ve(n, e.schema);
  return Bg(r)(e, t);
}, By = () => ({ state: n, dispatch: e }) => Gd(n, e);
function Zo(n, e) {
  return e.nodes[n] ? "node" : e.marks[n] ? "mark" : null;
}
function Cc(n, e) {
  const t = typeof e == "string" ? [e] : e;
  return Object.keys(n).reduce((r, i) => (t.includes(i) || (r[i] = n[i]), r), {});
}
const Hy = (n, e) => ({ tr: t, state: r, dispatch: i }) => {
  let o = null, s = null;
  const l = Zo(typeof n == "string" ? n : n.name, r.schema);
  return l ? (l === "node" && (o = ve(n, r.schema)), l === "mark" && (s = nn(n, r.schema)), i && t.selection.ranges.forEach((a) => {
    r.doc.nodesBetween(a.$from.pos, a.$to.pos, (c, u) => {
      o && o === c.type && t.setNodeMarkup(u, void 0, Cc(c.attrs, e)), s && c.marks.length && c.marks.forEach((d) => {
        s === d.type && t.addMark(u, u + c.nodeSize, s.create(Cc(d.attrs, e)));
      });
    });
  }), !0) : !1;
}, zy = () => ({ tr: n, dispatch: e }) => (e && n.scrollIntoView(), !0), $y = () => ({ tr: n, dispatch: e }) => {
  if (e) {
    const t = new _e(n.doc);
    n.setSelection(t);
  }
  return !0;
}, Fy = () => ({ state: n, dispatch: e }) => Ud(n, e), Vy = () => ({ state: n, dispatch: e }) => Jd(n, e), jy = () => ({ state: n, dispatch: e }) => Og(n, e), Wy = () => ({ state: n, dispatch: e }) => Dg(n, e), _y = () => ({ state: n, dispatch: e }) => Ng(n, e);
function il(n, e, t = {}, r = {}) {
  return Wr(n, e, {
    slice: !1,
    parseOptions: t,
    errorOnInvalidContent: r.errorOnInvalidContent
  });
}
const Uy = (n, e = !1, t = {}, r = {}) => ({ editor: i, tr: o, dispatch: s, commands: l }) => {
  var a, c;
  const { doc: u } = o;
  if (t.preserveWhitespace !== "full") {
    const d = il(n, i.schema, t, {
      errorOnInvalidContent: (a = r.errorOnInvalidContent) !== null && a !== void 0 ? a : i.options.enableContentCheck
    });
    return s && o.replaceWith(0, u.content.size, d).setMeta("preventUpdate", !e), !0;
  }
  return s && o.setMeta("preventUpdate", !e), l.insertContentAt({ from: 0, to: u.content.size }, n, {
    parseOptions: t,
    errorOnInvalidContent: (c = r.errorOnInvalidContent) !== null && c !== void 0 ? c : i.options.enableContentCheck
  });
};
function af(n, e) {
  const t = nn(e, n.schema), { from: r, to: i, empty: o } = n.selection, s = [];
  o ? (n.storedMarks && s.push(...n.storedMarks), s.push(...n.selection.$head.marks())) : n.doc.nodesBetween(r, i, (a) => {
    s.push(...a.marks);
  });
  const l = s.find((a) => a.type.name === t.name);
  return l ? { ...l.attrs } : {};
}
function Ky(n, e) {
  const t = new Rl(n);
  return e.forEach((r) => {
    r.steps.forEach((i) => {
      t.step(i);
    });
  }), t;
}
function qy(n) {
  for (let e = 0; e < n.edgeCount; e += 1) {
    const { type: t } = n.edge(e);
    if (t.isTextblock && !t.hasRequiredAttrs())
      return t;
  }
  return null;
}
function Jy(n, e, t) {
  const r = [];
  return n.nodesBetween(e.from, e.to, (i, o) => {
    t(i) && r.push({
      node: i,
      pos: o
    });
  }), r;
}
function cf(n, e) {
  for (let t = n.depth; t > 0; t -= 1) {
    const r = n.node(t);
    if (e(r))
      return {
        pos: t > 0 ? n.before(t) : 0,
        start: n.start(t),
        depth: t,
        node: r
      };
  }
}
function ea(n) {
  return (e) => cf(e.$from, n);
}
function uf(n, e) {
  const t = {
    from: 0,
    to: n.content.size
  };
  return nf(n, t, e);
}
function Gy(n, e) {
  const t = ve(e, n.schema), { from: r, to: i } = n.selection, o = [];
  n.doc.nodesBetween(r, i, (l) => {
    o.push(l);
  });
  const s = o.reverse().find((l) => l.type.name === t.name);
  return s ? { ...s.attrs } : {};
}
function df(n, e) {
  const t = Zo(typeof e == "string" ? e : e.name, n.schema);
  return t === "node" ? Gy(n, e) : t === "mark" ? af(n, e) : {};
}
function Yy(n, e = JSON.stringify) {
  const t = {};
  return n.filter((r) => {
    const i = e(r);
    return Object.prototype.hasOwnProperty.call(t, i) ? !1 : t[i] = !0;
  });
}
function Xy(n) {
  const e = Yy(n);
  return e.length === 1 ? e : e.filter((t, r) => !e.filter((o, s) => s !== r).some((o) => t.oldRange.from >= o.oldRange.from && t.oldRange.to <= o.oldRange.to && t.newRange.from >= o.newRange.from && t.newRange.to <= o.newRange.to));
}
function Qy(n) {
  const { mapping: e, steps: t } = n, r = [];
  return e.maps.forEach((i, o) => {
    const s = [];
    if (i.ranges.length)
      i.forEach((l, a) => {
        s.push({ from: l, to: a });
      });
    else {
      const { from: l, to: a } = t[o];
      if (l === void 0 || a === void 0)
        return;
      s.push({ from: l, to: a });
    }
    s.forEach(({ from: l, to: a }) => {
      const c = e.slice(o).map(l, -1), u = e.slice(o).map(a), d = e.invert().map(c, -1), f = e.invert().map(u);
      r.push({
        oldRange: {
          from: d,
          to: f
        },
        newRange: {
          from: c,
          to: u
        }
      });
    });
  }), Xy(r);
}
function ta(n, e, t) {
  const r = [];
  return n === e ? t.resolve(n).marks().forEach((i) => {
    const o = t.resolve(n), s = Ql(o, i.type);
    s && r.push({
      mark: i,
      ...s
    });
  }) : t.nodesBetween(n, e, (i, o) => {
    !i || (i == null ? void 0 : i.nodeSize) === void 0 || r.push(...i.marks.map((s) => ({
      from: o,
      to: o + i.nodeSize,
      mark: s
    })));
  }), r;
}
function Ui(n, e, t) {
  return Object.fromEntries(Object.entries(t).filter(([r]) => {
    const i = n.find((o) => o.type === e && o.name === r);
    return i ? i.attribute.keepOnSplit : !1;
  }));
}
function ol(n, e, t = {}) {
  const { empty: r, ranges: i } = n.selection, o = e ? nn(e, n.schema) : null;
  if (r)
    return !!(n.storedMarks || n.selection.$from.marks()).filter((d) => o ? o.name === d.type.name : !0).find((d) => ao(d.attrs, t, { strict: !1 }));
  let s = 0;
  const l = [];
  if (i.forEach(({ $from: d, $to: f }) => {
    const h = d.pos, p = f.pos;
    n.doc.nodesBetween(h, p, (m, g) => {
      if (!m.isText && !m.marks.length)
        return;
      const b = Math.max(h, g), T = Math.min(p, g + m.nodeSize), S = T - b;
      s += S, l.push(...m.marks.map((y) => ({
        mark: y,
        from: b,
        to: T
      })));
    });
  }), s === 0)
    return !1;
  const a = l.filter((d) => o ? o.name === d.mark.type.name : !0).filter((d) => ao(d.mark.attrs, t, { strict: !1 })).reduce((d, f) => d + f.to - f.from, 0), c = l.filter((d) => o ? d.mark.type !== o && d.mark.type.excludes(o) : !0).reduce((d, f) => d + f.to - f.from, 0);
  return (a > 0 ? a + c : a) >= s;
}
function Zy(n, e, t = {}) {
  if (!e)
    return _r(n, null, t) || ol(n, null, t);
  const r = Zo(e, n.schema);
  return r === "node" ? _r(n, e, t) : r === "mark" ? ol(n, e, t) : !1;
}
function Tc(n, e) {
  const { nodeExtensions: t } = Yo(e), r = t.find((s) => s.name === n);
  if (!r)
    return !1;
  const i = {
    name: r.name,
    options: r.options,
    storage: r.storage
  }, o = V(D(r, "group", i));
  return typeof o != "string" ? !1 : o.split(" ").includes("list");
}
function es(n, { checkChildren: e = !0, ignoreWhitespace: t = !1 } = {}) {
  var r;
  if (t) {
    if (n.type.name === "hardBreak")
      return !0;
    if (n.isText)
      return /^\s*$/m.test((r = n.text) !== null && r !== void 0 ? r : "");
  }
  if (n.isText)
    return !n.text;
  if (n.isAtom || n.isLeaf)
    return !1;
  if (n.content.childCount === 0)
    return !0;
  if (e) {
    let i = !0;
    return n.content.forEach((o) => {
      i !== !1 && (es(o, { ignoreWhitespace: t, checkChildren: e }) || (i = !1));
    }), i;
  }
  return !1;
}
function ff(n) {
  return n instanceof P;
}
function hf(n, e, t) {
  const i = n.state.doc.content.size, o = Rt(e, 0, i), s = Rt(t, 0, i), l = n.coordsAtPos(o), a = n.coordsAtPos(s, -1), c = Math.min(l.top, a.top), u = Math.max(l.bottom, a.bottom), d = Math.min(l.left, a.left), f = Math.max(l.right, a.right), h = f - d, p = u - c, b = {
    top: c,
    bottom: u,
    left: d,
    right: f,
    width: h,
    height: p,
    x: d,
    y: c
  };
  return {
    ...b,
    toJSON: () => b
  };
}
function e0(n, e, t) {
  var r;
  const { selection: i } = e;
  let o = null;
  if (Zl(i) && (o = i.$cursor), o) {
    const l = (r = n.storedMarks) !== null && r !== void 0 ? r : o.marks();
    return !!t.isInSet(l) || !l.some((a) => a.type.excludes(t));
  }
  const { ranges: s } = i;
  return s.some(({ $from: l, $to: a }) => {
    let c = l.depth === 0 ? n.doc.inlineContent && n.doc.type.allowsMarkType(t) : !1;
    return n.doc.nodesBetween(l.pos, a.pos, (u, d, f) => {
      if (c)
        return !1;
      if (u.isInline) {
        const h = !f || f.type.allowsMarkType(t), p = !!t.isInSet(u.marks) || !u.marks.some((m) => m.type.excludes(t));
        c = h && p;
      }
      return !c;
    }), c;
  });
}
const t0 = (n, e = {}) => ({ tr: t, state: r, dispatch: i }) => {
  const { selection: o } = t, { empty: s, ranges: l } = o, a = nn(n, r.schema);
  if (i)
    if (s) {
      const c = af(r, a);
      t.addStoredMark(a.create({
        ...c,
        ...e
      }));
    } else
      l.forEach((c) => {
        const u = c.$from.pos, d = c.$to.pos;
        r.doc.nodesBetween(u, d, (f, h) => {
          const p = Math.max(h, u), m = Math.min(h + f.nodeSize, d);
          f.marks.find((b) => b.type === a) ? f.marks.forEach((b) => {
            a === b.type && t.addMark(p, m, a.create({
              ...b.attrs,
              ...e
            }));
          }) : t.addMark(p, m, a.create(e));
        });
      });
  return e0(r, t, a);
}, n0 = (n, e) => ({ tr: t }) => (t.setMeta(n, e), !0), r0 = (n, e = {}) => ({ state: t, dispatch: r, chain: i }) => {
  const o = ve(n, t.schema);
  let s;
  return t.selection.$anchor.sameParent(t.selection.$head) && (s = t.selection.$anchor.parent.attrs), o.isTextblock ? i().command(({ commands: l }) => bc(o, { ...s, ...e })(t) ? !0 : l.clearNodes()).command(({ state: l }) => bc(o, { ...s, ...e })(l, r)).run() : (console.warn('[tiptap warn]: Currently "setNode()" only supports text block nodes.'), !1);
}, i0 = (n) => ({ tr: e, dispatch: t }) => {
  if (t) {
    const { doc: r } = e, i = Rt(n, 0, r.content.size), o = P.create(r, i);
    e.setSelection(o);
  }
  return !0;
}, o0 = (n) => ({ tr: e, dispatch: t }) => {
  if (t) {
    const { doc: r } = e, { from: i, to: o } = typeof n == "number" ? { from: n, to: n } : n, s = L.atStart(r).from, l = L.atEnd(r).to, a = Rt(i, s, l), c = Rt(o, s, l), u = L.create(r, a, c);
    e.setSelection(u);
  }
  return !0;
}, s0 = (n) => ({ state: e, dispatch: t }) => {
  const r = ve(n, e.schema);
  return $g(r)(e, t);
};
function Ec(n, e) {
  const t = n.storedMarks || n.selection.$to.parentOffset && n.selection.$from.marks();
  if (t) {
    const r = t.filter((i) => e == null ? void 0 : e.includes(i.type.name));
    n.tr.ensureMarks(r);
  }
}
const l0 = ({ keepMarks: n = !0 } = {}) => ({ tr: e, state: t, dispatch: r, editor: i }) => {
  const { selection: o, doc: s } = e, { $from: l, $to: a } = o, c = i.extensionManager.attributes, u = Ui(c, l.node().type.name, l.node().attrs);
  if (o instanceof P && o.node.isBlock)
    return !l.parentOffset || !Lt(s, l.pos) ? !1 : (r && (n && Ec(t, i.extensionManager.splittableMarks), e.split(l.pos).scrollIntoView()), !0);
  if (!l.parent.isBlock)
    return !1;
  const d = a.parentOffset === a.parent.content.size, f = l.depth === 0 ? void 0 : qy(l.node(-1).contentMatchAt(l.indexAfter(-1)));
  let h = d && f ? [
    {
      type: f,
      attrs: u
    }
  ] : void 0, p = Lt(e.doc, e.mapping.map(l.pos), 1, h);
  if (!h && !p && Lt(e.doc, e.mapping.map(l.pos), 1, f ? [{ type: f }] : void 0) && (p = !0, h = f ? [
    {
      type: f,
      attrs: u
    }
  ] : void 0), r) {
    if (p && (o instanceof L && e.deleteSelection(), e.split(e.mapping.map(l.pos), 1, h), f && !d && !l.parentOffset && l.parent.type !== f)) {
      const m = e.mapping.map(l.before()), g = e.doc.resolve(m);
      l.node(-1).canReplaceWith(g.index(), g.index() + 1, f) && e.setNodeMarkup(e.mapping.map(l.before()), f);
    }
    n && Ec(t, i.extensionManager.splittableMarks), e.scrollIntoView();
  }
  return p;
}, a0 = (n, e = {}) => ({ tr: t, state: r, dispatch: i, editor: o }) => {
  var s;
  const l = ve(n, r.schema), { $from: a, $to: c } = r.selection, u = r.selection.node;
  if (u && u.isBlock || a.depth < 2 || !a.sameParent(c))
    return !1;
  const d = a.node(-1);
  if (d.type !== l)
    return !1;
  const f = o.extensionManager.attributes;
  if (a.parent.content.size === 0 && a.node(-1).childCount === a.indexAfter(-1)) {
    if (a.depth === 2 || a.node(-3).type !== l || a.index(-2) !== a.node(-2).childCount - 1)
      return !1;
    if (i) {
      let b = C.empty;
      const T = a.index(-1) ? 1 : a.index(-2) ? 2 : 3;
      for (let k = a.depth - T; k >= a.depth - 3; k -= 1)
        b = C.from(a.node(k).copy(b));
      const S = a.indexAfter(-1) < a.node(-2).childCount ? 1 : a.indexAfter(-2) < a.node(-3).childCount ? 2 : 3, y = {
        ...Ui(f, a.node().type.name, a.node().attrs),
        ...e
      }, O = ((s = l.contentMatch.defaultType) === null || s === void 0 ? void 0 : s.createAndFill(y)) || void 0;
      b = b.append(C.from(l.createAndFill(null, O) || void 0));
      const x = a.before(a.depth - (T - 1));
      t.replace(x, a.after(-S), new A(b, 4 - T, 0));
      let E = -1;
      t.doc.nodesBetween(x, t.doc.content.size, (k, I) => {
        if (E > -1)
          return !1;
        k.isTextblock && k.content.size === 0 && (E = I + 1);
      }), E > -1 && t.setSelection(L.near(t.doc.resolve(E))), t.scrollIntoView();
    }
    return !0;
  }
  const h = c.pos === a.end() ? d.contentMatchAt(0).defaultType : null, p = {
    ...Ui(f, d.type.name, d.attrs),
    ...e
  }, m = {
    ...Ui(f, a.node().type.name, a.node().attrs),
    ...e
  };
  t.delete(a.pos, c.pos);
  const g = h ? [
    { type: l, attrs: p },
    { type: h, attrs: m }
  ] : [{ type: l, attrs: p }];
  if (!Lt(t.doc, a.pos, 2))
    return !1;
  if (i) {
    const { selection: b, storedMarks: T } = r, { splittableMarks: S } = o.extensionManager, y = T || b.$to.parentOffset && b.$from.marks();
    if (t.split(a.pos, 2, g).scrollIntoView(), !y || !i)
      return !0;
    const O = y.filter((x) => S.includes(x.type.name));
    t.ensureMarks(O);
  }
  return !0;
}, Ss = (n, e) => {
  const t = ea((s) => s.type === e)(n.selection);
  if (!t)
    return !0;
  const r = n.doc.resolve(Math.max(0, t.pos - 1)).before(t.depth);
  if (r === void 0)
    return !0;
  const i = n.doc.nodeAt(r);
  return t.node.type === (i == null ? void 0 : i.type) && en(n.doc, t.pos) && n.join(t.pos), !0;
}, xs = (n, e) => {
  const t = ea((s) => s.type === e)(n.selection);
  if (!t)
    return !0;
  const r = n.doc.resolve(t.start).after(t.depth);
  if (r === void 0)
    return !0;
  const i = n.doc.nodeAt(r);
  return t.node.type === (i == null ? void 0 : i.type) && en(n.doc, r) && n.join(r), !0;
}, c0 = (n, e, t, r = {}) => ({ editor: i, tr: o, state: s, dispatch: l, chain: a, commands: c, can: u }) => {
  const { extensions: d, splittableMarks: f } = i.extensionManager, h = ve(n, s.schema), p = ve(e, s.schema), { selection: m, storedMarks: g } = s, { $from: b, $to: T } = m, S = b.blockRange(T), y = g || m.$to.parentOffset && m.$from.marks();
  if (!S)
    return !1;
  const O = ea((x) => Tc(x.type.name, d))(m);
  if (S.depth >= 1 && O && S.depth - O.depth <= 1) {
    if (O.node.type === h)
      return c.liftListItem(p);
    if (Tc(O.node.type.name, d) && h.validContent(O.node.content) && l)
      return a().command(() => (o.setNodeMarkup(O.pos, h), !0)).command(() => Ss(o, h)).command(() => xs(o, h)).run();
  }
  return !t || !y || !l ? a().command(() => u().wrapInList(h, r) ? !0 : c.clearNodes()).wrapInList(h, r).command(() => Ss(o, h)).command(() => xs(o, h)).run() : a().command(() => {
    const x = u().wrapInList(h, r), E = y.filter((k) => f.includes(k.type.name));
    return o.ensureMarks(E), x ? !0 : c.clearNodes();
  }).wrapInList(h, r).command(() => Ss(o, h)).command(() => xs(o, h)).run();
}, u0 = (n, e = {}, t = {}) => ({ state: r, commands: i }) => {
  const { extendEmptyMarkRange: o = !1 } = t, s = nn(n, r.schema);
  return ol(r, s, e) ? i.unsetMark(s, { extendEmptyMarkRange: o }) : i.setMark(s, e);
}, d0 = (n, e, t = {}) => ({ state: r, commands: i }) => {
  const o = ve(n, r.schema), s = ve(e, r.schema), l = _r(r, o, t);
  let a;
  return r.selection.$anchor.sameParent(r.selection.$head) && (a = r.selection.$anchor.parent.attrs), l ? i.setNode(s, a) : i.setNode(o, { ...a, ...t });
}, f0 = (n, e = {}) => ({ state: t, commands: r }) => {
  const i = ve(n, t.schema);
  return _r(t, i, e) ? r.lift(i) : r.wrapIn(i, e);
}, h0 = () => ({ state: n, dispatch: e }) => {
  const t = n.plugins;
  for (let r = 0; r < t.length; r += 1) {
    const i = t[r];
    let o;
    if (i.spec.isInputRules && (o = i.getState(n))) {
      if (e) {
        const s = n.tr, l = o.transform;
        for (let a = l.steps.length - 1; a >= 0; a -= 1)
          s.step(l.steps[a].invert(l.docs[a]));
        if (o.text) {
          const a = s.doc.resolve(o.from).marks();
          s.replaceWith(o.from, o.to, n.schema.text(o.text, a));
        } else
          s.delete(o.from, o.to);
      }
      return !0;
    }
  }
  return !1;
}, p0 = () => ({ tr: n, dispatch: e }) => {
  const { selection: t } = n, { empty: r, ranges: i } = t;
  return r || e && i.forEach((o) => {
    n.removeMark(o.$from.pos, o.$to.pos);
  }), !0;
}, m0 = (n, e = {}) => ({ tr: t, state: r, dispatch: i }) => {
  var o;
  const { extendEmptyMarkRange: s = !1 } = e, { selection: l } = t, a = nn(n, r.schema), { $from: c, empty: u, ranges: d } = l;
  if (!i)
    return !0;
  if (u && s) {
    let { from: f, to: h } = l;
    const p = (o = c.marks().find((g) => g.type === a)) === null || o === void 0 ? void 0 : o.attrs, m = Ql(c, a, p);
    m && (f = m.from, h = m.to), t.removeMark(f, h, a);
  } else
    d.forEach((f) => {
      t.removeMark(f.$from.pos, f.$to.pos, a);
    });
  return t.removeStoredMark(a), !0;
}, g0 = (n, e = {}) => ({ tr: t, state: r, dispatch: i }) => {
  let o = null, s = null;
  const l = Zo(typeof n == "string" ? n : n.name, r.schema);
  return l ? (l === "node" && (o = ve(n, r.schema)), l === "mark" && (s = nn(n, r.schema)), i && t.selection.ranges.forEach((a) => {
    const c = a.$from.pos, u = a.$to.pos;
    let d, f, h, p;
    t.selection.empty ? r.doc.nodesBetween(c, u, (m, g) => {
      o && o === m.type && (h = Math.max(g, c), p = Math.min(g + m.nodeSize, u), d = g, f = m);
    }) : r.doc.nodesBetween(c, u, (m, g) => {
      g < c && o && o === m.type && (h = Math.max(g, c), p = Math.min(g + m.nodeSize, u), d = g, f = m), g >= c && g <= u && (o && o === m.type && t.setNodeMarkup(g, void 0, {
        ...m.attrs,
        ...e
      }), s && m.marks.length && m.marks.forEach((b) => {
        if (s === b.type) {
          const T = Math.max(g, c), S = Math.min(g + m.nodeSize, u);
          t.addMark(T, S, s.create({
            ...b.attrs,
            ...e
          }));
        }
      }));
    }), f && (d !== void 0 && t.setNodeMarkup(d, void 0, {
      ...f.attrs,
      ...e
    }), s && f.marks.length && f.marks.forEach((m) => {
      s === m.type && t.addMark(h, p, s.create({
        ...m.attrs,
        ...e
      }));
    }));
  }), !0) : !1;
}, y0 = (n, e = {}) => ({ state: t, dispatch: r }) => {
  const i = ve(n, t.schema);
  return Rg(i, e)(t, r);
}, b0 = (n, e = {}) => ({ state: t, dispatch: r }) => {
  const i = ve(n, t.schema);
  return Ig(i, e)(t, r);
};
var v0 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  blur: ny,
  clearContent: ry,
  clearNodes: iy,
  command: oy,
  createParagraphNear: sy,
  cut: ly,
  deleteCurrentNode: ay,
  deleteNode: cy,
  deleteRange: uy,
  deleteSelection: dy,
  enter: fy,
  exitCode: hy,
  extendMarkRange: py,
  first: my,
  focus: yy,
  forEach: by,
  insertContent: vy,
  insertContentAt: Sy,
  joinBackward: Ty,
  joinDown: Cy,
  joinForward: Ey,
  joinItemBackward: My,
  joinItemForward: Oy,
  joinTextblockBackward: Ay,
  joinTextblockForward: Ny,
  joinUp: xy,
  keyboardShortcut: Ry,
  lift: Iy,
  liftEmptyBlock: Ly,
  liftListItem: Py,
  newlineInCode: By,
  resetAttributes: Hy,
  scrollIntoView: zy,
  selectAll: $y,
  selectNodeBackward: Fy,
  selectNodeForward: Vy,
  selectParentNode: jy,
  selectTextblockEnd: Wy,
  selectTextblockStart: _y,
  setContent: Uy,
  setMark: t0,
  setMeta: n0,
  setNode: r0,
  setNodeSelection: i0,
  setTextSelection: o0,
  sinkListItem: s0,
  splitBlock: l0,
  splitListItem: a0,
  toggleList: c0,
  toggleMark: u0,
  toggleNode: d0,
  toggleWrap: f0,
  undoInputRule: h0,
  unsetAllMarks: p0,
  unsetMark: m0,
  updateAttributes: g0,
  wrapIn: y0,
  wrapInList: b0
});
const w0 = ge.create({
  name: "commands",
  addCommands() {
    return {
      ...v0
    };
  }
}), k0 = ge.create({
  name: "drop",
  addProseMirrorPlugins() {
    return [
      new ie({
        key: new ue("tiptapDrop"),
        props: {
          handleDrop: (n, e, t, r) => {
            this.editor.emit("drop", {
              editor: this.editor,
              event: e,
              slice: t,
              moved: r
            });
          }
        }
      })
    ];
  }
}), S0 = ge.create({
  name: "editable",
  addProseMirrorPlugins() {
    return [
      new ie({
        key: new ue("editable"),
        props: {
          editable: () => this.editor.options.editable
        }
      })
    ];
  }
}), x0 = new ue("focusEvents"), C0 = ge.create({
  name: "focusEvents",
  addProseMirrorPlugins() {
    const { editor: n } = this;
    return [
      new ie({
        key: x0,
        props: {
          handleDOMEvents: {
            focus: (e, t) => {
              n.isFocused = !0;
              const r = n.state.tr.setMeta("focus", { event: t }).setMeta("addToHistory", !1);
              return e.dispatch(r), !1;
            },
            blur: (e, t) => {
              n.isFocused = !1;
              const r = n.state.tr.setMeta("blur", { event: t }).setMeta("addToHistory", !1);
              return e.dispatch(r), !1;
            }
          }
        }
      })
    ];
  }
}), T0 = ge.create({
  name: "keymap",
  addKeyboardShortcuts() {
    const n = () => this.editor.commands.first(({ commands: s }) => [
      () => s.undoInputRule(),
      // maybe convert first text block node to default node
      () => s.command(({ tr: l }) => {
        const { selection: a, doc: c } = l, { empty: u, $anchor: d } = a, { pos: f, parent: h } = d, p = d.parent.isTextblock && f > 0 ? l.doc.resolve(f - 1) : d, m = p.parent.type.spec.isolating, g = d.pos - d.parentOffset, b = m && p.parent.childCount === 1 ? g === d.pos : H.atStart(c).from === f;
        return !u || !h.type.isTextblock || h.textContent.length || !b || b && d.parent.type.name === "paragraph" ? !1 : s.clearNodes();
      }),
      () => s.deleteSelection(),
      () => s.joinBackward(),
      () => s.selectNodeBackward()
    ]), e = () => this.editor.commands.first(({ commands: s }) => [
      () => s.deleteSelection(),
      () => s.deleteCurrentNode(),
      () => s.joinForward(),
      () => s.selectNodeForward()
    ]), r = {
      Enter: () => this.editor.commands.first(({ commands: s }) => [
        () => s.newlineInCode(),
        () => s.createParagraphNear(),
        () => s.liftEmptyBlock(),
        () => s.splitBlock()
      ]),
      "Mod-Enter": () => this.editor.commands.exitCode(),
      Backspace: n,
      "Mod-Backspace": n,
      "Shift-Backspace": n,
      Delete: e,
      "Mod-Delete": e,
      "Mod-a": () => this.editor.commands.selectAll()
    }, i = {
      ...r
    }, o = {
      ...r,
      "Ctrl-h": n,
      "Alt-Backspace": n,
      "Ctrl-d": e,
      "Ctrl-Alt-Backspace": e,
      "Alt-Delete": e,
      "Alt-d": e,
      "Ctrl-a": () => this.editor.commands.selectTextblockStart(),
      "Ctrl-e": () => this.editor.commands.selectTextblockEnd()
    };
    return co() || lf() ? o : i;
  },
  addProseMirrorPlugins() {
    return [
      // With this plugin we check if the whole document was selected and deleted.
      // In this case we will additionally call `clearNodes()` to convert e.g. a heading
      // to a paragraph if necessary.
      // This is an alternative to ProseMirror's `AllSelection`, which doesn’t work well
      // with many other commands.
      new ie({
        key: new ue("clearDocument"),
        appendTransaction: (n, e, t) => {
          if (n.some((m) => m.getMeta("composition")))
            return;
          const r = n.some((m) => m.docChanged) && !e.doc.eq(t.doc), i = n.some((m) => m.getMeta("preventClearDocument"));
          if (!r || i)
            return;
          const { empty: o, from: s, to: l } = e.selection, a = H.atStart(e.doc).from, c = H.atEnd(e.doc).to;
          if (o || !(s === a && l === c) || !es(t.doc))
            return;
          const f = t.tr, h = Jo({
            state: t,
            transaction: f
          }), { commands: p } = new Go({
            editor: this.editor,
            state: h
          });
          if (p.clearNodes(), !!f.steps.length)
            return f;
        }
      })
    ];
  }
}), E0 = ge.create({
  name: "paste",
  addProseMirrorPlugins() {
    return [
      new ie({
        key: new ue("tiptapPaste"),
        props: {
          handlePaste: (n, e, t) => {
            this.editor.emit("paste", {
              editor: this.editor,
              event: e,
              slice: t
            });
          }
        }
      })
    ];
  }
}), M0 = ge.create({
  name: "tabindex",
  addProseMirrorPlugins() {
    return [
      new ie({
        key: new ue("tabindex"),
        props: {
          attributes: () => this.editor.isEditable ? { tabindex: "0" } : {}
        }
      })
    ];
  }
});
class un {
  get name() {
    return this.node.type.name;
  }
  constructor(e, t, r = !1, i = null) {
    this.currentNode = null, this.actualDepth = null, this.isBlock = r, this.resolvedPos = e, this.editor = t, this.currentNode = i;
  }
  get node() {
    return this.currentNode || this.resolvedPos.node();
  }
  get element() {
    return this.editor.view.domAtPos(this.pos).node;
  }
  get depth() {
    var e;
    return (e = this.actualDepth) !== null && e !== void 0 ? e : this.resolvedPos.depth;
  }
  get pos() {
    return this.resolvedPos.pos;
  }
  get content() {
    return this.node.content;
  }
  set content(e) {
    let t = this.from, r = this.to;
    if (this.isBlock) {
      if (this.content.size === 0) {
        console.error(`You can’t set content on a block node. Tried to set content on ${this.name} at ${this.pos}`);
        return;
      }
      t = this.from + 1, r = this.to - 1;
    }
    this.editor.commands.insertContentAt({ from: t, to: r }, e);
  }
  get attributes() {
    return this.node.attrs;
  }
  get textContent() {
    return this.node.textContent;
  }
  get size() {
    return this.node.nodeSize;
  }
  get from() {
    return this.isBlock ? this.pos : this.resolvedPos.start(this.resolvedPos.depth);
  }
  get range() {
    return {
      from: this.from,
      to: this.to
    };
  }
  get to() {
    return this.isBlock ? this.pos + this.size : this.resolvedPos.end(this.resolvedPos.depth) + (this.node.isText ? 0 : 1);
  }
  get parent() {
    if (this.depth === 0)
      return null;
    const e = this.resolvedPos.start(this.resolvedPos.depth - 1), t = this.resolvedPos.doc.resolve(e);
    return new un(t, this.editor);
  }
  get before() {
    let e = this.resolvedPos.doc.resolve(this.from - (this.isBlock ? 1 : 2));
    return e.depth !== this.depth && (e = this.resolvedPos.doc.resolve(this.from - 3)), new un(e, this.editor);
  }
  get after() {
    let e = this.resolvedPos.doc.resolve(this.to + (this.isBlock ? 2 : 1));
    return e.depth !== this.depth && (e = this.resolvedPos.doc.resolve(this.to + 3)), new un(e, this.editor);
  }
  get children() {
    const e = [];
    return this.node.content.forEach((t, r) => {
      const i = t.isBlock && !t.isTextblock, o = t.isAtom && !t.isText, s = this.pos + r + (o ? 0 : 1);
      if (s < 0 || s > this.resolvedPos.doc.nodeSize - 2)
        return;
      const l = this.resolvedPos.doc.resolve(s);
      if (!i && l.depth <= this.depth)
        return;
      const a = new un(l, this.editor, i, i ? t : null);
      i && (a.actualDepth = this.depth + 1), e.push(new un(l, this.editor, i, i ? t : null));
    }), e;
  }
  get firstChild() {
    return this.children[0] || null;
  }
  get lastChild() {
    const e = this.children;
    return e[e.length - 1] || null;
  }
  closest(e, t = {}) {
    let r = null, i = this.parent;
    for (; i && !r; ) {
      if (i.node.type.name === e)
        if (Object.keys(t).length > 0) {
          const o = i.node.attrs, s = Object.keys(t);
          for (let l = 0; l < s.length; l += 1) {
            const a = s[l];
            if (o[a] !== t[a])
              break;
          }
        } else
          r = i;
      i = i.parent;
    }
    return r;
  }
  querySelector(e, t = {}) {
    return this.querySelectorAll(e, t, !0)[0] || null;
  }
  querySelectorAll(e, t = {}, r = !1) {
    let i = [];
    if (!this.children || this.children.length === 0)
      return i;
    const o = Object.keys(t);
    return this.children.forEach((s) => {
      r && i.length > 0 || (s.node.type.name === e && o.every((a) => t[a] === s.node.attrs[a]) && i.push(s), !(r && i.length > 0) && (i = i.concat(s.querySelectorAll(e, t, r))));
    }), i;
  }
  setAttribute(e) {
    const { tr: t } = this.editor.state;
    t.setNodeMarkup(this.from, void 0, {
      ...this.node.attrs,
      ...e
    }), this.editor.view.dispatch(t);
  }
}
const O0 = `.ProseMirror {
  position: relative;
}

.ProseMirror {
  word-wrap: break-word;
  white-space: pre-wrap;
  white-space: break-spaces;
  -webkit-font-variant-ligatures: none;
  font-variant-ligatures: none;
  font-feature-settings: "liga" 0; /* the above doesn't seem to work in Edge */
}

.ProseMirror [contenteditable="false"] {
  white-space: normal;
}

.ProseMirror [contenteditable="false"] [contenteditable="true"] {
  white-space: pre-wrap;
}

.ProseMirror pre {
  white-space: pre-wrap;
}

img.ProseMirror-separator {
  display: inline !important;
  border: none !important;
  margin: 0 !important;
  width: 0 !important;
  height: 0 !important;
}

.ProseMirror-gapcursor {
  display: none;
  pointer-events: none;
  position: absolute;
  margin: 0;
}

.ProseMirror-gapcursor:after {
  content: "";
  display: block;
  position: absolute;
  top: -2px;
  width: 20px;
  border-top: 1px solid black;
  animation: ProseMirror-cursor-blink 1.1s steps(2, start) infinite;
}

@keyframes ProseMirror-cursor-blink {
  to {
    visibility: hidden;
  }
}

.ProseMirror-hideselection *::selection {
  background: transparent;
}

.ProseMirror-hideselection *::-moz-selection {
  background: transparent;
}

.ProseMirror-hideselection * {
  caret-color: transparent;
}

.ProseMirror-focused .ProseMirror-gapcursor {
  display: block;
}

.tippy-box[data-animation=fade][data-state=hidden] {
  opacity: 0
}`;
function A0(n, e, t) {
  const r = document.querySelector("style[data-tiptap-style]");
  if (r !== null)
    return r;
  const i = document.createElement("style");
  return e && i.setAttribute("nonce", e), i.setAttribute("data-tiptap-style", ""), i.innerHTML = n, document.getElementsByTagName("head")[0].appendChild(i), i;
}
let N0 = class extends Fg {
  constructor(e = {}) {
    super(), this.isFocused = !1, this.isInitialized = !1, this.extensionStorage = {}, this.options = {
      element: document.createElement("div"),
      content: "",
      injectCSS: !0,
      injectNonce: void 0,
      extensions: [],
      autofocus: !1,
      editable: !0,
      editorProps: {},
      parseOptions: {},
      coreExtensionOptions: {},
      enableInputRules: !0,
      enablePasteRules: !0,
      enableCoreExtensions: !0,
      enableContentCheck: !1,
      emitContentError: !1,
      onBeforeCreate: () => null,
      onCreate: () => null,
      onUpdate: () => null,
      onSelectionUpdate: () => null,
      onTransaction: () => null,
      onFocus: () => null,
      onBlur: () => null,
      onDestroy: () => null,
      onContentError: ({ error: t }) => {
        throw t;
      },
      onPaste: () => null,
      onDrop: () => null
    }, this.isCapturingTransaction = !1, this.capturedTransaction = null, this.setOptions(e), this.createExtensionManager(), this.createCommandManager(), this.createSchema(), this.on("beforeCreate", this.options.onBeforeCreate), this.emit("beforeCreate", { editor: this }), this.on("contentError", this.options.onContentError), this.createView(), this.injectCSS(), this.on("create", this.options.onCreate), this.on("update", this.options.onUpdate), this.on("selectionUpdate", this.options.onSelectionUpdate), this.on("transaction", this.options.onTransaction), this.on("focus", this.options.onFocus), this.on("blur", this.options.onBlur), this.on("destroy", this.options.onDestroy), this.on("drop", ({ event: t, slice: r, moved: i }) => this.options.onDrop(t, r, i)), this.on("paste", ({ event: t, slice: r }) => this.options.onPaste(t, r)), window.setTimeout(() => {
      this.isDestroyed || (this.commands.focus(this.options.autofocus), this.emit("create", { editor: this }), this.isInitialized = !0);
    }, 0);
  }
  /**
   * Returns the editor storage.
   */
  get storage() {
    return this.extensionStorage;
  }
  /**
   * An object of all registered commands.
   */
  get commands() {
    return this.commandManager.commands;
  }
  /**
   * Create a command chain to call multiple commands at once.
   */
  chain() {
    return this.commandManager.chain();
  }
  /**
   * Check if a command or a command chain can be executed. Without executing it.
   */
  can() {
    return this.commandManager.can();
  }
  /**
   * Inject CSS styles.
   */
  injectCSS() {
    this.options.injectCSS && document && (this.css = A0(O0, this.options.injectNonce));
  }
  /**
   * Update editor options.
   *
   * @param options A list of options
   */
  setOptions(e = {}) {
    this.options = {
      ...this.options,
      ...e
    }, !(!this.view || !this.state || this.isDestroyed) && (this.options.editorProps && this.view.setProps(this.options.editorProps), this.view.updateState(this.state));
  }
  /**
   * Update editable state of the editor.
   */
  setEditable(e, t = !0) {
    this.setOptions({ editable: e }), t && this.emit("update", { editor: this, transaction: this.state.tr });
  }
  /**
   * Returns whether the editor is editable.
   */
  get isEditable() {
    return this.options.editable && this.view && this.view.editable;
  }
  /**
   * Returns the editor state.
   */
  get state() {
    return this.view.state;
  }
  /**
   * Register a ProseMirror plugin.
   *
   * @param plugin A ProseMirror plugin
   * @param handlePlugins Control how to merge the plugin into the existing plugins.
   * @returns The new editor state
   */
  registerPlugin(e, t) {
    const r = tf(t) ? t(e, [...this.state.plugins]) : [...this.state.plugins, e], i = this.state.reconfigure({ plugins: r });
    return this.view.updateState(i), i;
  }
  /**
   * Unregister a ProseMirror plugin.
   *
   * @param nameOrPluginKeyToRemove The plugins name
   * @returns The new editor state or undefined if the editor is destroyed
   */
  unregisterPlugin(e) {
    if (this.isDestroyed)
      return;
    const t = this.state.plugins;
    let r = t;
    if ([].concat(e).forEach((o) => {
      const s = typeof o == "string" ? `${o}$` : o.key;
      r = r.filter((l) => !l.key.startsWith(s));
    }), t.length === r.length)
      return;
    const i = this.state.reconfigure({
      plugins: r
    });
    return this.view.updateState(i), i;
  }
  /**
   * Creates an extension manager.
   */
  createExtensionManager() {
    var e, t;
    const i = [...this.options.enableCoreExtensions ? [
      S0,
      ty.configure({
        blockSeparator: (t = (e = this.options.coreExtensionOptions) === null || e === void 0 ? void 0 : e.clipboardTextSerializer) === null || t === void 0 ? void 0 : t.blockSeparator
      }),
      w0,
      C0,
      T0,
      M0,
      k0,
      E0
    ].filter((o) => typeof this.options.enableCoreExtensions == "object" ? this.options.enableCoreExtensions[o.name] !== !1 : !0) : [], ...this.options.extensions].filter((o) => ["extension", "node", "mark"].includes(o == null ? void 0 : o.type));
    this.extensionManager = new jn(i, this);
  }
  /**
   * Creates an command manager.
   */
  createCommandManager() {
    this.commandManager = new Go({
      editor: this
    });
  }
  /**
   * Creates a ProseMirror schema.
   */
  createSchema() {
    this.schema = this.extensionManager.schema;
  }
  /**
   * Creates a ProseMirror view.
   */
  createView() {
    var e;
    let t;
    try {
      t = il(this.options.content, this.schema, this.options.parseOptions, { errorOnInvalidContent: this.options.enableContentCheck });
    } catch (s) {
      if (!(s instanceof Error) || !["[tiptap error]: Invalid JSON content", "[tiptap error]: Invalid HTML content"].includes(s.message))
        throw s;
      this.emit("contentError", {
        editor: this,
        error: s,
        disableCollaboration: () => {
          this.storage.collaboration && (this.storage.collaboration.isDisabled = !0), this.options.extensions = this.options.extensions.filter((l) => l.name !== "collaboration"), this.createExtensionManager();
        }
      }), t = il(this.options.content, this.schema, this.options.parseOptions, { errorOnInvalidContent: !1 });
    }
    const r = of(t, this.options.autofocus);
    this.view = new Vd(this.options.element, {
      ...this.options.editorProps,
      attributes: {
        // add `role="textbox"` to the editor element
        role: "textbox",
        ...(e = this.options.editorProps) === null || e === void 0 ? void 0 : e.attributes
      },
      dispatchTransaction: this.dispatchTransaction.bind(this),
      state: Vn.create({
        doc: t,
        selection: r || void 0
      })
    });
    const i = this.state.reconfigure({
      plugins: this.extensionManager.plugins
    });
    this.view.updateState(i), this.createNodeViews(), this.prependClass();
    const o = this.view.dom;
    o.editor = this;
  }
  /**
   * Creates all node views.
   */
  createNodeViews() {
    this.view.isDestroyed || this.view.setProps({
      nodeViews: this.extensionManager.nodeViews
    });
  }
  /**
   * Prepend class name to element.
   */
  prependClass() {
    this.view.dom.className = `tiptap ${this.view.dom.className}`;
  }
  captureTransaction(e) {
    this.isCapturingTransaction = !0, e(), this.isCapturingTransaction = !1;
    const t = this.capturedTransaction;
    return this.capturedTransaction = null, t;
  }
  /**
   * The callback over which to send transactions (state updates) produced by the view.
   *
   * @param transaction An editor state transaction
   */
  dispatchTransaction(e) {
    if (this.view.isDestroyed)
      return;
    if (this.isCapturingTransaction) {
      if (!this.capturedTransaction) {
        this.capturedTransaction = e;
        return;
      }
      e.steps.forEach((s) => {
        var l;
        return (l = this.capturedTransaction) === null || l === void 0 ? void 0 : l.step(s);
      });
      return;
    }
    const t = this.state.apply(e), r = !this.state.selection.eq(t.selection);
    this.emit("beforeTransaction", {
      editor: this,
      transaction: e,
      nextState: t
    }), this.view.updateState(t), this.emit("transaction", {
      editor: this,
      transaction: e
    }), r && this.emit("selectionUpdate", {
      editor: this,
      transaction: e
    });
    const i = e.getMeta("focus"), o = e.getMeta("blur");
    i && this.emit("focus", {
      editor: this,
      event: i.event,
      transaction: e
    }), o && this.emit("blur", {
      editor: this,
      event: o.event,
      transaction: e
    }), !(!e.docChanged || e.getMeta("preventUpdate")) && this.emit("update", {
      editor: this,
      transaction: e
    });
  }
  /**
   * Get attributes of the currently selected node or mark.
   */
  getAttributes(e) {
    return df(this.state, e);
  }
  isActive(e, t) {
    const r = typeof e == "string" ? e : null, i = typeof e == "string" ? t : e;
    return Zy(this.state, r, i);
  }
  /**
   * Get the document as JSON.
   */
  getJSON() {
    return this.state.doc.toJSON();
  }
  /**
   * Get the document as HTML.
   */
  getHTML() {
    return Gl(this.state.doc.content, this.schema);
  }
  /**
   * Get the document as text.
   */
  getText(e) {
    const { blockSeparator: t = `

`, textSerializers: r = {} } = e || {};
    return uf(this.state.doc, {
      blockSeparator: t,
      textSerializers: {
        ...Xl(this.schema),
        ...r
      }
    });
  }
  /**
   * Check if there is no content.
   */
  get isEmpty() {
    return es(this.state.doc);
  }
  /**
   * Get the number of characters for the current document.
   *
   * @deprecated
   */
  getCharacterCount() {
    return console.warn('[tiptap warn]: "editor.getCharacterCount()" is deprecated. Please use "editor.storage.characterCount.characters()" instead.'), this.state.doc.content.size - 2;
  }
  /**
   * Destroy the editor.
   */
  destroy() {
    if (this.emit("destroy"), this.view) {
      const e = this.view.dom;
      e && e.editor && delete e.editor, this.view.destroy();
    }
    this.removeAllListeners();
  }
  /**
   * Check if the editor is already destroyed.
   */
  get isDestroyed() {
    var e;
    return !(!((e = this.view) === null || e === void 0) && e.docView);
  }
  $node(e, t) {
    var r;
    return ((r = this.$doc) === null || r === void 0 ? void 0 : r.querySelector(e, t)) || null;
  }
  $nodes(e, t) {
    var r;
    return ((r = this.$doc) === null || r === void 0 ? void 0 : r.querySelectorAll(e, t)) || null;
  }
  $pos(e) {
    const t = this.state.doc.resolve(e);
    return new un(t, this);
  }
  get $doc() {
    return this.$pos(0);
  }
};
function Gn(n) {
  return new Xo({
    find: n.find,
    handler: ({ state: e, range: t, match: r }) => {
      const i = V(n.getAttributes, void 0, r);
      if (i === !1 || i === null)
        return null;
      const { tr: o } = e, s = r[r.length - 1], l = r[0];
      if (s) {
        const a = l.search(/\S/), c = t.from + l.indexOf(s), u = c + s.length;
        if (ta(t.from, t.to, e.doc).filter((h) => h.mark.type.excluded.find((m) => m === n.type && m !== h.mark.type)).filter((h) => h.to > c).length)
          return null;
        u < t.to && o.delete(u, t.to), c > t.from && o.delete(t.from + a, c);
        const f = t.from + a + s.length;
        o.addMark(t.from + a, f, n.type.create(i || {})), o.removeStoredMark(n.type);
      }
    }
  });
}
function pf(n) {
  return new Xo({
    find: n.find,
    handler: ({ state: e, range: t, match: r }) => {
      const i = V(n.getAttributes, void 0, r) || {}, { tr: o } = e, s = t.from;
      let l = t.to;
      const a = n.type.create(i);
      if (r[1]) {
        const c = r[0].lastIndexOf(r[1]);
        let u = s + c;
        u > l ? u = l : l = u + r[1].length;
        const d = r[0][r[0].length - 1];
        o.insertText(d, s + r[0].length - 1), o.replaceWith(u, l, a);
      } else if (r[0]) {
        const c = n.type.isInline ? s : s - 1;
        o.insert(c, n.type.create(i)).delete(o.mapping.map(s), o.mapping.map(l));
      }
      o.scrollIntoView();
    }
  });
}
function sl(n) {
  return new Xo({
    find: n.find,
    handler: ({ state: e, range: t, match: r }) => {
      const i = e.doc.resolve(t.from), o = V(n.getAttributes, void 0, r) || {};
      if (!i.node(-1).canReplaceWith(i.index(-1), i.indexAfter(-1), n.type))
        return null;
      e.tr.delete(t.from, t.to).setBlockType(t.from, t.from, n.type, o);
    }
  });
}
function Yn(n) {
  return new Xo({
    find: n.find,
    handler: ({ state: e, range: t, match: r, chain: i }) => {
      const o = V(n.getAttributes, void 0, r) || {}, s = e.tr.delete(t.from, t.to), a = s.doc.resolve(t.from).blockRange(), c = a && Dl(a, n.type, o);
      if (!c)
        return null;
      if (s.wrap(a, c), n.keepMarks && n.editor) {
        const { selection: d, storedMarks: f } = e, { splittableMarks: h } = n.editor.extensionManager, p = f || d.$to.parentOffset && d.$from.marks();
        if (p) {
          const m = p.filter((g) => h.includes(g.type.name));
          s.ensureMarks(m);
        }
      }
      if (n.keepAttributes) {
        const d = n.type.name === "bulletList" || n.type.name === "orderedList" ? "listItem" : "taskList";
        i().updateAttributes(d, o).run();
      }
      const u = s.doc.resolve(t.from - 1).nodeBefore;
      u && u.type === n.type && en(s.doc, t.from - 1) && (!n.joinPredicate || n.joinPredicate(r, u)) && s.join(t.from - 1);
    }
  });
}
class ce {
  constructor(e = {}) {
    this.type = "node", this.name = "node", this.parent = null, this.child = null, this.config = {
      name: this.name,
      defaultOptions: {}
    }, this.config = {
      ...this.config,
      ...e
    }, this.name = this.config.name, e.defaultOptions && Object.keys(e.defaultOptions).length > 0 && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`), this.options = this.config.defaultOptions, this.config.addOptions && (this.options = V(D(this, "addOptions", {
      name: this.name
    }))), this.storage = V(D(this, "addStorage", {
      name: this.name,
      options: this.options
    })) || {};
  }
  static create(e = {}) {
    return new ce(e);
  }
  configure(e = {}) {
    const t = this.extend({
      ...this.config,
      addOptions: () => Qo(this.options, e)
    });
    return t.name = this.name, t.parent = this.parent, t;
  }
  extend(e = {}) {
    const t = new ce(e);
    return t.parent = this, this.child = t, t.name = e.name ? e.name : t.parent.name, e.defaultOptions && Object.keys(e.defaultOptions).length > 0 && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${t.name}".`), t.options = V(D(t, "addOptions", {
      name: t.name
    })), t.storage = V(D(t, "addStorage", {
      name: t.name,
      options: t.options
    })), t;
  }
}
function Tn(n) {
  return new Gg({
    find: n.find,
    handler: ({ state: e, range: t, match: r, pasteEvent: i }) => {
      const o = V(n.getAttributes, void 0, r, i);
      if (o === !1 || o === null)
        return null;
      const { tr: s } = e, l = r[r.length - 1], a = r[0];
      let c = t.to;
      if (l) {
        const u = a.search(/\S/), d = t.from + a.indexOf(l), f = d + l.length;
        if (ta(t.from, t.to, e.doc).filter((p) => p.mark.type.excluded.find((g) => g === n.type && g !== p.mark.type)).filter((p) => p.to > d).length)
          return null;
        f < t.to && s.delete(f, t.to), d > t.from && s.delete(t.from + u, d), c = t.from + u + l.length, s.addMark(t.from + u, c, n.type.create(o || {})), s.removeStoredMark(n.type);
      }
    }
  });
}
function D0(n, e) {
  const { selection: t } = n, { $from: r } = t;
  if (t instanceof P) {
    const o = r.index();
    return r.parent.canReplaceWith(o, o + 1, e);
  }
  let i = r.depth;
  for (; i >= 0; ) {
    const o = r.index(i);
    if (r.node(i).contentMatchAt(o).matchType(e))
      return !0;
    i -= 1;
  }
  return !1;
}
function R0(n) {
  return n.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
}
var ze = "top", nt = "bottom", rt = "right", $e = "left", na = "auto", li = [ze, nt, rt, $e], Xn = "start", Ur = "end", I0 = "clippingParents", mf = "viewport", dr = "popper", L0 = "reference", Mc = /* @__PURE__ */ li.reduce(function(n, e) {
  return n.concat([e + "-" + Xn, e + "-" + Ur]);
}, []), gf = /* @__PURE__ */ [].concat(li, [na]).reduce(function(n, e) {
  return n.concat([e, e + "-" + Xn, e + "-" + Ur]);
}, []), P0 = "beforeRead", B0 = "read", H0 = "afterRead", z0 = "beforeMain", $0 = "main", F0 = "afterMain", V0 = "beforeWrite", j0 = "write", W0 = "afterWrite", _0 = [P0, B0, H0, z0, $0, F0, V0, j0, W0];
function gt(n) {
  return n ? (n.nodeName || "").toLowerCase() : null;
}
function Ue(n) {
  if (n == null)
    return window;
  if (n.toString() !== "[object Window]") {
    var e = n.ownerDocument;
    return e && e.defaultView || window;
  }
  return n;
}
function En(n) {
  var e = Ue(n).Element;
  return n instanceof e || n instanceof Element;
}
function tt(n) {
  var e = Ue(n).HTMLElement;
  return n instanceof e || n instanceof HTMLElement;
}
function ra(n) {
  if (typeof ShadowRoot > "u")
    return !1;
  var e = Ue(n).ShadowRoot;
  return n instanceof e || n instanceof ShadowRoot;
}
function U0(n) {
  var e = n.state;
  Object.keys(e.elements).forEach(function(t) {
    var r = e.styles[t] || {}, i = e.attributes[t] || {}, o = e.elements[t];
    !tt(o) || !gt(o) || (Object.assign(o.style, r), Object.keys(i).forEach(function(s) {
      var l = i[s];
      l === !1 ? o.removeAttribute(s) : o.setAttribute(s, l === !0 ? "" : l);
    }));
  });
}
function K0(n) {
  var e = n.state, t = {
    popper: {
      position: e.options.strategy,
      left: "0",
      top: "0",
      margin: "0"
    },
    arrow: {
      position: "absolute"
    },
    reference: {}
  };
  return Object.assign(e.elements.popper.style, t.popper), e.styles = t, e.elements.arrow && Object.assign(e.elements.arrow.style, t.arrow), function() {
    Object.keys(e.elements).forEach(function(r) {
      var i = e.elements[r], o = e.attributes[r] || {}, s = Object.keys(e.styles.hasOwnProperty(r) ? e.styles[r] : t[r]), l = s.reduce(function(a, c) {
        return a[c] = "", a;
      }, {});
      !tt(i) || !gt(i) || (Object.assign(i.style, l), Object.keys(o).forEach(function(a) {
        i.removeAttribute(a);
      }));
    });
  };
}
const yf = {
  name: "applyStyles",
  enabled: !0,
  phase: "write",
  fn: U0,
  effect: K0,
  requires: ["computeStyles"]
};
function ht(n) {
  return n.split("-")[0];
}
var wn = Math.max, uo = Math.min, Qn = Math.round;
function ll() {
  var n = navigator.userAgentData;
  return n != null && n.brands && Array.isArray(n.brands) ? n.brands.map(function(e) {
    return e.brand + "/" + e.version;
  }).join(" ") : navigator.userAgent;
}
function bf() {
  return !/^((?!chrome|android).)*safari/i.test(ll());
}
function Zn(n, e, t) {
  e === void 0 && (e = !1), t === void 0 && (t = !1);
  var r = n.getBoundingClientRect(), i = 1, o = 1;
  e && tt(n) && (i = n.offsetWidth > 0 && Qn(r.width) / n.offsetWidth || 1, o = n.offsetHeight > 0 && Qn(r.height) / n.offsetHeight || 1);
  var s = En(n) ? Ue(n) : window, l = s.visualViewport, a = !bf() && t, c = (r.left + (a && l ? l.offsetLeft : 0)) / i, u = (r.top + (a && l ? l.offsetTop : 0)) / o, d = r.width / i, f = r.height / o;
  return {
    width: d,
    height: f,
    top: u,
    right: c + d,
    bottom: u + f,
    left: c,
    x: c,
    y: u
  };
}
function ia(n) {
  var e = Zn(n), t = n.offsetWidth, r = n.offsetHeight;
  return Math.abs(e.width - t) <= 1 && (t = e.width), Math.abs(e.height - r) <= 1 && (r = e.height), {
    x: n.offsetLeft,
    y: n.offsetTop,
    width: t,
    height: r
  };
}
function vf(n, e) {
  var t = e.getRootNode && e.getRootNode();
  if (n.contains(e))
    return !0;
  if (t && ra(t)) {
    var r = e;
    do {
      if (r && n.isSameNode(r))
        return !0;
      r = r.parentNode || r.host;
    } while (r);
  }
  return !1;
}
function Bt(n) {
  return Ue(n).getComputedStyle(n);
}
function q0(n) {
  return ["table", "td", "th"].indexOf(gt(n)) >= 0;
}
function rn(n) {
  return ((En(n) ? n.ownerDocument : (
    // $FlowFixMe[prop-missing]
    n.document
  )) || window.document).documentElement;
}
function ts(n) {
  return gt(n) === "html" ? n : (
    // this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    n.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    n.parentNode || // DOM Element detected
    (ra(n) ? n.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    rn(n)
  );
}
function Oc(n) {
  return !tt(n) || // https://github.com/popperjs/popper-core/issues/837
  Bt(n).position === "fixed" ? null : n.offsetParent;
}
function J0(n) {
  var e = /firefox/i.test(ll()), t = /Trident/i.test(ll());
  if (t && tt(n)) {
    var r = Bt(n);
    if (r.position === "fixed")
      return null;
  }
  var i = ts(n);
  for (ra(i) && (i = i.host); tt(i) && ["html", "body"].indexOf(gt(i)) < 0; ) {
    var o = Bt(i);
    if (o.transform !== "none" || o.perspective !== "none" || o.contain === "paint" || ["transform", "perspective"].indexOf(o.willChange) !== -1 || e && o.willChange === "filter" || e && o.filter && o.filter !== "none")
      return i;
    i = i.parentNode;
  }
  return null;
}
function ai(n) {
  for (var e = Ue(n), t = Oc(n); t && q0(t) && Bt(t).position === "static"; )
    t = Oc(t);
  return t && (gt(t) === "html" || gt(t) === "body" && Bt(t).position === "static") ? e : t || J0(n) || e;
}
function oa(n) {
  return ["top", "bottom"].indexOf(n) >= 0 ? "x" : "y";
}
function xr(n, e, t) {
  return wn(n, uo(e, t));
}
function G0(n, e, t) {
  var r = xr(n, e, t);
  return r > t ? t : r;
}
function wf() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}
function kf(n) {
  return Object.assign({}, wf(), n);
}
function Sf(n, e) {
  return e.reduce(function(t, r) {
    return t[r] = n, t;
  }, {});
}
var Y0 = function(e, t) {
  return e = typeof e == "function" ? e(Object.assign({}, t.rects, {
    placement: t.placement
  })) : e, kf(typeof e != "number" ? e : Sf(e, li));
};
function X0(n) {
  var e, t = n.state, r = n.name, i = n.options, o = t.elements.arrow, s = t.modifiersData.popperOffsets, l = ht(t.placement), a = oa(l), c = [$e, rt].indexOf(l) >= 0, u = c ? "height" : "width";
  if (!(!o || !s)) {
    var d = Y0(i.padding, t), f = ia(o), h = a === "y" ? ze : $e, p = a === "y" ? nt : rt, m = t.rects.reference[u] + t.rects.reference[a] - s[a] - t.rects.popper[u], g = s[a] - t.rects.reference[a], b = ai(o), T = b ? a === "y" ? b.clientHeight || 0 : b.clientWidth || 0 : 0, S = m / 2 - g / 2, y = d[h], O = T - f[u] - d[p], x = T / 2 - f[u] / 2 + S, E = xr(y, x, O), k = a;
    t.modifiersData[r] = (e = {}, e[k] = E, e.centerOffset = E - x, e);
  }
}
function Q0(n) {
  var e = n.state, t = n.options, r = t.element, i = r === void 0 ? "[data-popper-arrow]" : r;
  i != null && (typeof i == "string" && (i = e.elements.popper.querySelector(i), !i) || vf(e.elements.popper, i) && (e.elements.arrow = i));
}
const Z0 = {
  name: "arrow",
  enabled: !0,
  phase: "main",
  fn: X0,
  effect: Q0,
  requires: ["popperOffsets"],
  requiresIfExists: ["preventOverflow"]
};
function er(n) {
  return n.split("-")[1];
}
var eb = {
  top: "auto",
  right: "auto",
  bottom: "auto",
  left: "auto"
};
function tb(n, e) {
  var t = n.x, r = n.y, i = e.devicePixelRatio || 1;
  return {
    x: Qn(t * i) / i || 0,
    y: Qn(r * i) / i || 0
  };
}
function Ac(n) {
  var e, t = n.popper, r = n.popperRect, i = n.placement, o = n.variation, s = n.offsets, l = n.position, a = n.gpuAcceleration, c = n.adaptive, u = n.roundOffsets, d = n.isFixed, f = s.x, h = f === void 0 ? 0 : f, p = s.y, m = p === void 0 ? 0 : p, g = typeof u == "function" ? u({
    x: h,
    y: m
  }) : {
    x: h,
    y: m
  };
  h = g.x, m = g.y;
  var b = s.hasOwnProperty("x"), T = s.hasOwnProperty("y"), S = $e, y = ze, O = window;
  if (c) {
    var x = ai(t), E = "clientHeight", k = "clientWidth";
    if (x === Ue(t) && (x = rn(t), Bt(x).position !== "static" && l === "absolute" && (E = "scrollHeight", k = "scrollWidth")), x = x, i === ze || (i === $e || i === rt) && o === Ur) {
      y = nt;
      var I = d && x === O && O.visualViewport ? O.visualViewport.height : (
        // $FlowFixMe[prop-missing]
        x[E]
      );
      m -= I - r.height, m *= a ? 1 : -1;
    }
    if (i === $e || (i === ze || i === nt) && o === Ur) {
      S = rt;
      var j = d && x === O && O.visualViewport ? O.visualViewport.width : (
        // $FlowFixMe[prop-missing]
        x[k]
      );
      h -= j - r.width, h *= a ? 1 : -1;
    }
  }
  var K = Object.assign({
    position: l
  }, c && eb), B = u === !0 ? tb({
    x: h,
    y: m
  }, Ue(t)) : {
    x: h,
    y: m
  };
  if (h = B.x, m = B.y, a) {
    var F;
    return Object.assign({}, K, (F = {}, F[y] = T ? "0" : "", F[S] = b ? "0" : "", F.transform = (O.devicePixelRatio || 1) <= 1 ? "translate(" + h + "px, " + m + "px)" : "translate3d(" + h + "px, " + m + "px, 0)", F));
  }
  return Object.assign({}, K, (e = {}, e[y] = T ? m + "px" : "", e[S] = b ? h + "px" : "", e.transform = "", e));
}
function nb(n) {
  var e = n.state, t = n.options, r = t.gpuAcceleration, i = r === void 0 ? !0 : r, o = t.adaptive, s = o === void 0 ? !0 : o, l = t.roundOffsets, a = l === void 0 ? !0 : l, c = {
    placement: ht(e.placement),
    variation: er(e.placement),
    popper: e.elements.popper,
    popperRect: e.rects.popper,
    gpuAcceleration: i,
    isFixed: e.options.strategy === "fixed"
  };
  e.modifiersData.popperOffsets != null && (e.styles.popper = Object.assign({}, e.styles.popper, Ac(Object.assign({}, c, {
    offsets: e.modifiersData.popperOffsets,
    position: e.options.strategy,
    adaptive: s,
    roundOffsets: a
  })))), e.modifiersData.arrow != null && (e.styles.arrow = Object.assign({}, e.styles.arrow, Ac(Object.assign({}, c, {
    offsets: e.modifiersData.arrow,
    position: "absolute",
    adaptive: !1,
    roundOffsets: a
  })))), e.attributes.popper = Object.assign({}, e.attributes.popper, {
    "data-popper-placement": e.placement
  });
}
const rb = {
  name: "computeStyles",
  enabled: !0,
  phase: "beforeWrite",
  fn: nb,
  data: {}
};
var Ni = {
  passive: !0
};
function ib(n) {
  var e = n.state, t = n.instance, r = n.options, i = r.scroll, o = i === void 0 ? !0 : i, s = r.resize, l = s === void 0 ? !0 : s, a = Ue(e.elements.popper), c = [].concat(e.scrollParents.reference, e.scrollParents.popper);
  return o && c.forEach(function(u) {
    u.addEventListener("scroll", t.update, Ni);
  }), l && a.addEventListener("resize", t.update, Ni), function() {
    o && c.forEach(function(u) {
      u.removeEventListener("scroll", t.update, Ni);
    }), l && a.removeEventListener("resize", t.update, Ni);
  };
}
const ob = {
  name: "eventListeners",
  enabled: !0,
  phase: "write",
  fn: function() {
  },
  effect: ib,
  data: {}
};
var sb = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function Ki(n) {
  return n.replace(/left|right|bottom|top/g, function(e) {
    return sb[e];
  });
}
var lb = {
  start: "end",
  end: "start"
};
function Nc(n) {
  return n.replace(/start|end/g, function(e) {
    return lb[e];
  });
}
function sa(n) {
  var e = Ue(n), t = e.pageXOffset, r = e.pageYOffset;
  return {
    scrollLeft: t,
    scrollTop: r
  };
}
function la(n) {
  return Zn(rn(n)).left + sa(n).scrollLeft;
}
function ab(n, e) {
  var t = Ue(n), r = rn(n), i = t.visualViewport, o = r.clientWidth, s = r.clientHeight, l = 0, a = 0;
  if (i) {
    o = i.width, s = i.height;
    var c = bf();
    (c || !c && e === "fixed") && (l = i.offsetLeft, a = i.offsetTop);
  }
  return {
    width: o,
    height: s,
    x: l + la(n),
    y: a
  };
}
function cb(n) {
  var e, t = rn(n), r = sa(n), i = (e = n.ownerDocument) == null ? void 0 : e.body, o = wn(t.scrollWidth, t.clientWidth, i ? i.scrollWidth : 0, i ? i.clientWidth : 0), s = wn(t.scrollHeight, t.clientHeight, i ? i.scrollHeight : 0, i ? i.clientHeight : 0), l = -r.scrollLeft + la(n), a = -r.scrollTop;
  return Bt(i || t).direction === "rtl" && (l += wn(t.clientWidth, i ? i.clientWidth : 0) - o), {
    width: o,
    height: s,
    x: l,
    y: a
  };
}
function aa(n) {
  var e = Bt(n), t = e.overflow, r = e.overflowX, i = e.overflowY;
  return /auto|scroll|overlay|hidden/.test(t + i + r);
}
function xf(n) {
  return ["html", "body", "#document"].indexOf(gt(n)) >= 0 ? n.ownerDocument.body : tt(n) && aa(n) ? n : xf(ts(n));
}
function Cr(n, e) {
  var t;
  e === void 0 && (e = []);
  var r = xf(n), i = r === ((t = n.ownerDocument) == null ? void 0 : t.body), o = Ue(r), s = i ? [o].concat(o.visualViewport || [], aa(r) ? r : []) : r, l = e.concat(s);
  return i ? l : (
    // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
    l.concat(Cr(ts(s)))
  );
}
function al(n) {
  return Object.assign({}, n, {
    left: n.x,
    top: n.y,
    right: n.x + n.width,
    bottom: n.y + n.height
  });
}
function ub(n, e) {
  var t = Zn(n, !1, e === "fixed");
  return t.top = t.top + n.clientTop, t.left = t.left + n.clientLeft, t.bottom = t.top + n.clientHeight, t.right = t.left + n.clientWidth, t.width = n.clientWidth, t.height = n.clientHeight, t.x = t.left, t.y = t.top, t;
}
function Dc(n, e, t) {
  return e === mf ? al(ab(n, t)) : En(e) ? ub(e, t) : al(cb(rn(n)));
}
function db(n) {
  var e = Cr(ts(n)), t = ["absolute", "fixed"].indexOf(Bt(n).position) >= 0, r = t && tt(n) ? ai(n) : n;
  return En(r) ? e.filter(function(i) {
    return En(i) && vf(i, r) && gt(i) !== "body";
  }) : [];
}
function fb(n, e, t, r) {
  var i = e === "clippingParents" ? db(n) : [].concat(e), o = [].concat(i, [t]), s = o[0], l = o.reduce(function(a, c) {
    var u = Dc(n, c, r);
    return a.top = wn(u.top, a.top), a.right = uo(u.right, a.right), a.bottom = uo(u.bottom, a.bottom), a.left = wn(u.left, a.left), a;
  }, Dc(n, s, r));
  return l.width = l.right - l.left, l.height = l.bottom - l.top, l.x = l.left, l.y = l.top, l;
}
function Cf(n) {
  var e = n.reference, t = n.element, r = n.placement, i = r ? ht(r) : null, o = r ? er(r) : null, s = e.x + e.width / 2 - t.width / 2, l = e.y + e.height / 2 - t.height / 2, a;
  switch (i) {
    case ze:
      a = {
        x: s,
        y: e.y - t.height
      };
      break;
    case nt:
      a = {
        x: s,
        y: e.y + e.height
      };
      break;
    case rt:
      a = {
        x: e.x + e.width,
        y: l
      };
      break;
    case $e:
      a = {
        x: e.x - t.width,
        y: l
      };
      break;
    default:
      a = {
        x: e.x,
        y: e.y
      };
  }
  var c = i ? oa(i) : null;
  if (c != null) {
    var u = c === "y" ? "height" : "width";
    switch (o) {
      case Xn:
        a[c] = a[c] - (e[u] / 2 - t[u] / 2);
        break;
      case Ur:
        a[c] = a[c] + (e[u] / 2 - t[u] / 2);
        break;
    }
  }
  return a;
}
function Kr(n, e) {
  e === void 0 && (e = {});
  var t = e, r = t.placement, i = r === void 0 ? n.placement : r, o = t.strategy, s = o === void 0 ? n.strategy : o, l = t.boundary, a = l === void 0 ? I0 : l, c = t.rootBoundary, u = c === void 0 ? mf : c, d = t.elementContext, f = d === void 0 ? dr : d, h = t.altBoundary, p = h === void 0 ? !1 : h, m = t.padding, g = m === void 0 ? 0 : m, b = kf(typeof g != "number" ? g : Sf(g, li)), T = f === dr ? L0 : dr, S = n.rects.popper, y = n.elements[p ? T : f], O = fb(En(y) ? y : y.contextElement || rn(n.elements.popper), a, u, s), x = Zn(n.elements.reference), E = Cf({
    reference: x,
    element: S,
    placement: i
  }), k = al(Object.assign({}, S, E)), I = f === dr ? k : x, j = {
    top: O.top - I.top + b.top,
    bottom: I.bottom - O.bottom + b.bottom,
    left: O.left - I.left + b.left,
    right: I.right - O.right + b.right
  }, K = n.modifiersData.offset;
  if (f === dr && K) {
    var B = K[i];
    Object.keys(j).forEach(function(F) {
      var Z = [rt, nt].indexOf(F) >= 0 ? 1 : -1, ne = [ze, nt].indexOf(F) >= 0 ? "y" : "x";
      j[F] += B[ne] * Z;
    });
  }
  return j;
}
function hb(n, e) {
  e === void 0 && (e = {});
  var t = e, r = t.placement, i = t.boundary, o = t.rootBoundary, s = t.padding, l = t.flipVariations, a = t.allowedAutoPlacements, c = a === void 0 ? gf : a, u = er(r), d = u ? l ? Mc : Mc.filter(function(p) {
    return er(p) === u;
  }) : li, f = d.filter(function(p) {
    return c.indexOf(p) >= 0;
  });
  f.length === 0 && (f = d);
  var h = f.reduce(function(p, m) {
    return p[m] = Kr(n, {
      placement: m,
      boundary: i,
      rootBoundary: o,
      padding: s
    })[ht(m)], p;
  }, {});
  return Object.keys(h).sort(function(p, m) {
    return h[p] - h[m];
  });
}
function pb(n) {
  if (ht(n) === na)
    return [];
  var e = Ki(n);
  return [Nc(n), e, Nc(e)];
}
function mb(n) {
  var e = n.state, t = n.options, r = n.name;
  if (!e.modifiersData[r]._skip) {
    for (var i = t.mainAxis, o = i === void 0 ? !0 : i, s = t.altAxis, l = s === void 0 ? !0 : s, a = t.fallbackPlacements, c = t.padding, u = t.boundary, d = t.rootBoundary, f = t.altBoundary, h = t.flipVariations, p = h === void 0 ? !0 : h, m = t.allowedAutoPlacements, g = e.options.placement, b = ht(g), T = b === g, S = a || (T || !p ? [Ki(g)] : pb(g)), y = [g].concat(S).reduce(function(_, q) {
      return _.concat(ht(q) === na ? hb(e, {
        placement: q,
        boundary: u,
        rootBoundary: d,
        padding: c,
        flipVariations: p,
        allowedAutoPlacements: m
      }) : q);
    }, []), O = e.rects.reference, x = e.rects.popper, E = /* @__PURE__ */ new Map(), k = !0, I = y[0], j = 0; j < y.length; j++) {
      var K = y[j], B = ht(K), F = er(K) === Xn, Z = [ze, nt].indexOf(B) >= 0, ne = Z ? "width" : "height", X = Kr(e, {
        placement: K,
        boundary: u,
        rootBoundary: d,
        altBoundary: f,
        padding: c
      }), oe = Z ? F ? rt : $e : F ? nt : ze;
      O[ne] > x[ne] && (oe = Ki(oe));
      var J = Ki(oe), we = [];
      if (o && we.push(X[B] <= 0), l && we.push(X[oe] <= 0, X[J] <= 0), we.every(function(_) {
        return _;
      })) {
        I = K, k = !1;
        break;
      }
      E.set(K, we);
    }
    if (k)
      for (var Te = p ? 3 : 1, v = function(q) {
        var pe = y.find(function(Ke) {
          var Ie = E.get(Ke);
          if (Ie)
            return Ie.slice(0, q).every(function(bt) {
              return bt;
            });
        });
        if (pe)
          return I = pe, "break";
      }, N = Te; N > 0; N--) {
        var z = v(N);
        if (z === "break") break;
      }
    e.placement !== I && (e.modifiersData[r]._skip = !0, e.placement = I, e.reset = !0);
  }
}
const gb = {
  name: "flip",
  enabled: !0,
  phase: "main",
  fn: mb,
  requiresIfExists: ["offset"],
  data: {
    _skip: !1
  }
};
function Rc(n, e, t) {
  return t === void 0 && (t = {
    x: 0,
    y: 0
  }), {
    top: n.top - e.height - t.y,
    right: n.right - e.width + t.x,
    bottom: n.bottom - e.height + t.y,
    left: n.left - e.width - t.x
  };
}
function Ic(n) {
  return [ze, rt, nt, $e].some(function(e) {
    return n[e] >= 0;
  });
}
function yb(n) {
  var e = n.state, t = n.name, r = e.rects.reference, i = e.rects.popper, o = e.modifiersData.preventOverflow, s = Kr(e, {
    elementContext: "reference"
  }), l = Kr(e, {
    altBoundary: !0
  }), a = Rc(s, r), c = Rc(l, i, o), u = Ic(a), d = Ic(c);
  e.modifiersData[t] = {
    referenceClippingOffsets: a,
    popperEscapeOffsets: c,
    isReferenceHidden: u,
    hasPopperEscaped: d
  }, e.attributes.popper = Object.assign({}, e.attributes.popper, {
    "data-popper-reference-hidden": u,
    "data-popper-escaped": d
  });
}
const bb = {
  name: "hide",
  enabled: !0,
  phase: "main",
  requiresIfExists: ["preventOverflow"],
  fn: yb
};
function vb(n, e, t) {
  var r = ht(n), i = [$e, ze].indexOf(r) >= 0 ? -1 : 1, o = typeof t == "function" ? t(Object.assign({}, e, {
    placement: n
  })) : t, s = o[0], l = o[1];
  return s = s || 0, l = (l || 0) * i, [$e, rt].indexOf(r) >= 0 ? {
    x: l,
    y: s
  } : {
    x: s,
    y: l
  };
}
function wb(n) {
  var e = n.state, t = n.options, r = n.name, i = t.offset, o = i === void 0 ? [0, 0] : i, s = gf.reduce(function(u, d) {
    return u[d] = vb(d, e.rects, o), u;
  }, {}), l = s[e.placement], a = l.x, c = l.y;
  e.modifiersData.popperOffsets != null && (e.modifiersData.popperOffsets.x += a, e.modifiersData.popperOffsets.y += c), e.modifiersData[r] = s;
}
const kb = {
  name: "offset",
  enabled: !0,
  phase: "main",
  requires: ["popperOffsets"],
  fn: wb
};
function Sb(n) {
  var e = n.state, t = n.name;
  e.modifiersData[t] = Cf({
    reference: e.rects.reference,
    element: e.rects.popper,
    placement: e.placement
  });
}
const xb = {
  name: "popperOffsets",
  enabled: !0,
  phase: "read",
  fn: Sb,
  data: {}
};
function Cb(n) {
  return n === "x" ? "y" : "x";
}
function Tb(n) {
  var e = n.state, t = n.options, r = n.name, i = t.mainAxis, o = i === void 0 ? !0 : i, s = t.altAxis, l = s === void 0 ? !1 : s, a = t.boundary, c = t.rootBoundary, u = t.altBoundary, d = t.padding, f = t.tether, h = f === void 0 ? !0 : f, p = t.tetherOffset, m = p === void 0 ? 0 : p, g = Kr(e, {
    boundary: a,
    rootBoundary: c,
    padding: d,
    altBoundary: u
  }), b = ht(e.placement), T = er(e.placement), S = !T, y = oa(b), O = Cb(y), x = e.modifiersData.popperOffsets, E = e.rects.reference, k = e.rects.popper, I = typeof m == "function" ? m(Object.assign({}, e.rects, {
    placement: e.placement
  })) : m, j = typeof I == "number" ? {
    mainAxis: I,
    altAxis: I
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, I), K = e.modifiersData.offset ? e.modifiersData.offset[e.placement] : null, B = {
    x: 0,
    y: 0
  };
  if (x) {
    if (o) {
      var F, Z = y === "y" ? ze : $e, ne = y === "y" ? nt : rt, X = y === "y" ? "height" : "width", oe = x[y], J = oe + g[Z], we = oe - g[ne], Te = h ? -k[X] / 2 : 0, v = T === Xn ? E[X] : k[X], N = T === Xn ? -k[X] : -E[X], z = e.elements.arrow, _ = h && z ? ia(z) : {
        width: 0,
        height: 0
      }, q = e.modifiersData["arrow#persistent"] ? e.modifiersData["arrow#persistent"].padding : wf(), pe = q[Z], Ke = q[ne], Ie = xr(0, E[X], _[X]), bt = S ? E[X] / 2 - Te - Ie - pe - j.mainAxis : v - Ie - pe - j.mainAxis, vt = S ? -E[X] / 2 + Te + Ie + Ke + j.mainAxis : N + Ie + Ke + j.mainAxis, wt = e.elements.arrow && ai(e.elements.arrow), ci = wt ? y === "y" ? wt.clientTop || 0 : wt.clientLeft || 0 : 0, or = (F = K == null ? void 0 : K[y]) != null ? F : 0, ui = oe + bt - or - ci, di = oe + vt - or, sr = xr(h ? uo(J, ui) : J, oe, h ? wn(we, di) : we);
      x[y] = sr, B[y] = sr - oe;
    }
    if (l) {
      var lr, fi = y === "x" ? ze : $e, hi = y === "x" ? nt : rt, kt = x[O], Ht = O === "y" ? "height" : "width", ar = kt + g[fi], on = kt - g[hi], cr = [ze, $e].indexOf(b) !== -1, pi = (lr = K == null ? void 0 : K[O]) != null ? lr : 0, mi = cr ? ar : kt - E[Ht] - k[Ht] - pi + j.altAxis, gi = cr ? kt + E[Ht] + k[Ht] - pi - j.altAxis : on, yi = h && cr ? G0(mi, kt, gi) : xr(h ? mi : ar, kt, h ? gi : on);
      x[O] = yi, B[O] = yi - kt;
    }
    e.modifiersData[r] = B;
  }
}
const Eb = {
  name: "preventOverflow",
  enabled: !0,
  phase: "main",
  fn: Tb,
  requiresIfExists: ["offset"]
};
function Mb(n) {
  return {
    scrollLeft: n.scrollLeft,
    scrollTop: n.scrollTop
  };
}
function Ob(n) {
  return n === Ue(n) || !tt(n) ? sa(n) : Mb(n);
}
function Ab(n) {
  var e = n.getBoundingClientRect(), t = Qn(e.width) / n.offsetWidth || 1, r = Qn(e.height) / n.offsetHeight || 1;
  return t !== 1 || r !== 1;
}
function Nb(n, e, t) {
  t === void 0 && (t = !1);
  var r = tt(e), i = tt(e) && Ab(e), o = rn(e), s = Zn(n, i, t), l = {
    scrollLeft: 0,
    scrollTop: 0
  }, a = {
    x: 0,
    y: 0
  };
  return (r || !r && !t) && ((gt(e) !== "body" || // https://github.com/popperjs/popper-core/issues/1078
  aa(o)) && (l = Ob(e)), tt(e) ? (a = Zn(e, !0), a.x += e.clientLeft, a.y += e.clientTop) : o && (a.x = la(o))), {
    x: s.left + l.scrollLeft - a.x,
    y: s.top + l.scrollTop - a.y,
    width: s.width,
    height: s.height
  };
}
function Db(n) {
  var e = /* @__PURE__ */ new Map(), t = /* @__PURE__ */ new Set(), r = [];
  n.forEach(function(o) {
    e.set(o.name, o);
  });
  function i(o) {
    t.add(o.name);
    var s = [].concat(o.requires || [], o.requiresIfExists || []);
    s.forEach(function(l) {
      if (!t.has(l)) {
        var a = e.get(l);
        a && i(a);
      }
    }), r.push(o);
  }
  return n.forEach(function(o) {
    t.has(o.name) || i(o);
  }), r;
}
function Rb(n) {
  var e = Db(n);
  return _0.reduce(function(t, r) {
    return t.concat(e.filter(function(i) {
      return i.phase === r;
    }));
  }, []);
}
function Ib(n) {
  var e;
  return function() {
    return e || (e = new Promise(function(t) {
      Promise.resolve().then(function() {
        e = void 0, t(n());
      });
    })), e;
  };
}
function Lb(n) {
  var e = n.reduce(function(t, r) {
    var i = t[r.name];
    return t[r.name] = i ? Object.assign({}, i, r, {
      options: Object.assign({}, i.options, r.options),
      data: Object.assign({}, i.data, r.data)
    }) : r, t;
  }, {});
  return Object.keys(e).map(function(t) {
    return e[t];
  });
}
var Lc = {
  placement: "bottom",
  modifiers: [],
  strategy: "absolute"
};
function Pc() {
  for (var n = arguments.length, e = new Array(n), t = 0; t < n; t++)
    e[t] = arguments[t];
  return !e.some(function(r) {
    return !(r && typeof r.getBoundingClientRect == "function");
  });
}
function Pb(n) {
  n === void 0 && (n = {});
  var e = n, t = e.defaultModifiers, r = t === void 0 ? [] : t, i = e.defaultOptions, o = i === void 0 ? Lc : i;
  return function(l, a, c) {
    c === void 0 && (c = o);
    var u = {
      placement: "bottom",
      orderedModifiers: [],
      options: Object.assign({}, Lc, o),
      modifiersData: {},
      elements: {
        reference: l,
        popper: a
      },
      attributes: {},
      styles: {}
    }, d = [], f = !1, h = {
      state: u,
      setOptions: function(b) {
        var T = typeof b == "function" ? b(u.options) : b;
        m(), u.options = Object.assign({}, o, u.options, T), u.scrollParents = {
          reference: En(l) ? Cr(l) : l.contextElement ? Cr(l.contextElement) : [],
          popper: Cr(a)
        };
        var S = Rb(Lb([].concat(r, u.options.modifiers)));
        return u.orderedModifiers = S.filter(function(y) {
          return y.enabled;
        }), p(), h.update();
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function() {
        if (!f) {
          var b = u.elements, T = b.reference, S = b.popper;
          if (Pc(T, S)) {
            u.rects = {
              reference: Nb(T, ai(S), u.options.strategy === "fixed"),
              popper: ia(S)
            }, u.reset = !1, u.placement = u.options.placement, u.orderedModifiers.forEach(function(j) {
              return u.modifiersData[j.name] = Object.assign({}, j.data);
            });
            for (var y = 0; y < u.orderedModifiers.length; y++) {
              if (u.reset === !0) {
                u.reset = !1, y = -1;
                continue;
              }
              var O = u.orderedModifiers[y], x = O.fn, E = O.options, k = E === void 0 ? {} : E, I = O.name;
              typeof x == "function" && (u = x({
                state: u,
                options: k,
                name: I,
                instance: h
              }) || u);
            }
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: Ib(function() {
        return new Promise(function(g) {
          h.forceUpdate(), g(u);
        });
      }),
      destroy: function() {
        m(), f = !0;
      }
    };
    if (!Pc(l, a))
      return h;
    h.setOptions(c).then(function(g) {
      !f && c.onFirstUpdate && c.onFirstUpdate(g);
    });
    function p() {
      u.orderedModifiers.forEach(function(g) {
        var b = g.name, T = g.options, S = T === void 0 ? {} : T, y = g.effect;
        if (typeof y == "function") {
          var O = y({
            state: u,
            name: b,
            instance: h,
            options: S
          }), x = function() {
          };
          d.push(O || x);
        }
      });
    }
    function m() {
      d.forEach(function(g) {
        return g();
      }), d = [];
    }
    return h;
  };
}
var Bb = [ob, xb, rb, yf, kb, gb, Eb, Z0, bb], Hb = /* @__PURE__ */ Pb({
  defaultModifiers: Bb
}), zb = "tippy-box", Tf = "tippy-content", $b = "tippy-backdrop", Ef = "tippy-arrow", Mf = "tippy-svg-arrow", an = {
  passive: !0,
  capture: !0
}, Of = function() {
  return document.body;
};
function Fb(n, e) {
  return {}.hasOwnProperty.call(n, e);
}
function Cs(n, e, t) {
  if (Array.isArray(n)) {
    var r = n[e];
    return r ?? (Array.isArray(t) ? t[e] : t);
  }
  return n;
}
function ca(n, e) {
  var t = {}.toString.call(n);
  return t.indexOf("[object") === 0 && t.indexOf(e + "]") > -1;
}
function Af(n, e) {
  return typeof n == "function" ? n.apply(void 0, e) : n;
}
function Bc(n, e) {
  if (e === 0)
    return n;
  var t;
  return function(r) {
    clearTimeout(t), t = setTimeout(function() {
      n(r);
    }, e);
  };
}
function Vb(n, e) {
  var t = Object.assign({}, n);
  return e.forEach(function(r) {
    delete t[r];
  }), t;
}
function jb(n) {
  return n.split(/\s+/).filter(Boolean);
}
function $n(n) {
  return [].concat(n);
}
function Hc(n, e) {
  n.indexOf(e) === -1 && n.push(e);
}
function Wb(n) {
  return n.filter(function(e, t) {
    return n.indexOf(e) === t;
  });
}
function _b(n) {
  return n.split("-")[0];
}
function fo(n) {
  return [].slice.call(n);
}
function zc(n) {
  return Object.keys(n).reduce(function(e, t) {
    return n[t] !== void 0 && (e[t] = n[t]), e;
  }, {});
}
function Tr() {
  return document.createElement("div");
}
function qr(n) {
  return ["Element", "Fragment"].some(function(e) {
    return ca(n, e);
  });
}
function Ub(n) {
  return ca(n, "NodeList");
}
function Kb(n) {
  return ca(n, "MouseEvent");
}
function qb(n) {
  return !!(n && n._tippy && n._tippy.reference === n);
}
function Jb(n) {
  return qr(n) ? [n] : Ub(n) ? fo(n) : Array.isArray(n) ? n : fo(document.querySelectorAll(n));
}
function Ts(n, e) {
  n.forEach(function(t) {
    t && (t.style.transitionDuration = e + "ms");
  });
}
function $c(n, e) {
  n.forEach(function(t) {
    t && t.setAttribute("data-state", e);
  });
}
function Gb(n) {
  var e, t = $n(n), r = t[0];
  return r != null && (e = r.ownerDocument) != null && e.body ? r.ownerDocument : document;
}
function Yb(n, e) {
  var t = e.clientX, r = e.clientY;
  return n.every(function(i) {
    var o = i.popperRect, s = i.popperState, l = i.props, a = l.interactiveBorder, c = _b(s.placement), u = s.modifiersData.offset;
    if (!u)
      return !0;
    var d = c === "bottom" ? u.top.y : 0, f = c === "top" ? u.bottom.y : 0, h = c === "right" ? u.left.x : 0, p = c === "left" ? u.right.x : 0, m = o.top - r + d > a, g = r - o.bottom - f > a, b = o.left - t + h > a, T = t - o.right - p > a;
    return m || g || b || T;
  });
}
function Es(n, e, t) {
  var r = e + "EventListener";
  ["transitionend", "webkitTransitionEnd"].forEach(function(i) {
    n[r](i, t);
  });
}
function Fc(n, e) {
  for (var t = e; t; ) {
    var r;
    if (n.contains(t))
      return !0;
    t = t.getRootNode == null || (r = t.getRootNode()) == null ? void 0 : r.host;
  }
  return !1;
}
var dt = {
  isTouch: !1
}, Vc = 0;
function Xb() {
  dt.isTouch || (dt.isTouch = !0, window.performance && document.addEventListener("mousemove", Nf));
}
function Nf() {
  var n = performance.now();
  n - Vc < 20 && (dt.isTouch = !1, document.removeEventListener("mousemove", Nf)), Vc = n;
}
function Qb() {
  var n = document.activeElement;
  if (qb(n)) {
    var e = n._tippy;
    n.blur && !e.state.isVisible && n.blur();
  }
}
function Zb() {
  document.addEventListener("touchstart", Xb, an), window.addEventListener("blur", Qb);
}
var ev = typeof window < "u" && typeof document < "u", tv = ev ? (
  // @ts-ignore
  !!window.msCrypto
) : !1;
function Ln(n) {
  var e = n === "destroy" ? "n already-" : " ";
  return [n + "() was called on a" + e + "destroyed instance. This is a no-op but", "indicates a potential memory leak."].join(" ");
}
function jc(n) {
  var e = /[ \t]{2,}/g, t = /^[ \t]*/gm;
  return n.replace(e, " ").replace(t, "").trim();
}
function nv(n) {
  return jc(`
  %ctippy.js

  %c` + jc(n) + `

  %c👷‍ This is a development-only message. It will be removed in production.
  `);
}
function Df(n) {
  return [
    nv(n),
    // title
    "color: #00C584; font-size: 1.3em; font-weight: bold;",
    // message
    "line-height: 1.5",
    // footer
    "color: #a6a095;"
  ];
}
var Jr;
process.env.NODE_ENV !== "production" && rv();
function rv() {
  Jr = /* @__PURE__ */ new Set();
}
function At(n, e) {
  if (n && !Jr.has(e)) {
    var t;
    Jr.add(e), (t = console).warn.apply(t, Df(e));
  }
}
function cl(n, e) {
  if (n && !Jr.has(e)) {
    var t;
    Jr.add(e), (t = console).error.apply(t, Df(e));
  }
}
function iv(n) {
  var e = !n, t = Object.prototype.toString.call(n) === "[object Object]" && !n.addEventListener;
  cl(e, ["tippy() was passed", "`" + String(n) + "`", "as its targets (first) argument. Valid types are: String, Element,", "Element[], or NodeList."].join(" ")), cl(t, ["tippy() was passed a plain object which is not supported as an argument", "for virtual positioning. Use props.getReferenceClientRect instead."].join(" "));
}
var Rf = {
  animateFill: !1,
  followCursor: !1,
  inlinePositioning: !1,
  sticky: !1
}, ov = {
  allowHTML: !1,
  animation: "fade",
  arrow: !0,
  content: "",
  inertia: !1,
  maxWidth: 350,
  role: "tooltip",
  theme: "",
  zIndex: 9999
}, je = Object.assign({
  appendTo: Of,
  aria: {
    content: "auto",
    expanded: "auto"
  },
  delay: 0,
  duration: [300, 250],
  getReferenceClientRect: null,
  hideOnClick: !0,
  ignoreAttributes: !1,
  interactive: !1,
  interactiveBorder: 2,
  interactiveDebounce: 0,
  moveTransition: "",
  offset: [0, 10],
  onAfterUpdate: function() {
  },
  onBeforeUpdate: function() {
  },
  onCreate: function() {
  },
  onDestroy: function() {
  },
  onHidden: function() {
  },
  onHide: function() {
  },
  onMount: function() {
  },
  onShow: function() {
  },
  onShown: function() {
  },
  onTrigger: function() {
  },
  onUntrigger: function() {
  },
  onClickOutside: function() {
  },
  placement: "top",
  plugins: [],
  popperOptions: {},
  render: null,
  showOnCreate: !1,
  touch: !0,
  trigger: "mouseenter focus",
  triggerTarget: null
}, Rf, ov), sv = Object.keys(je), lv = function(e) {
  process.env.NODE_ENV !== "production" && Lf(e, []);
  var t = Object.keys(e);
  t.forEach(function(r) {
    je[r] = e[r];
  });
};
function If(n) {
  var e = n.plugins || [], t = e.reduce(function(r, i) {
    var o = i.name, s = i.defaultValue;
    if (o) {
      var l;
      r[o] = n[o] !== void 0 ? n[o] : (l = je[o]) != null ? l : s;
    }
    return r;
  }, {});
  return Object.assign({}, n, t);
}
function av(n, e) {
  var t = e ? Object.keys(If(Object.assign({}, je, {
    plugins: e
  }))) : sv, r = t.reduce(function(i, o) {
    var s = (n.getAttribute("data-tippy-" + o) || "").trim();
    if (!s)
      return i;
    if (o === "content")
      i[o] = s;
    else
      try {
        i[o] = JSON.parse(s);
      } catch {
        i[o] = s;
      }
    return i;
  }, {});
  return r;
}
function Wc(n, e) {
  var t = Object.assign({}, e, {
    content: Af(e.content, [n])
  }, e.ignoreAttributes ? {} : av(n, e.plugins));
  return t.aria = Object.assign({}, je.aria, t.aria), t.aria = {
    expanded: t.aria.expanded === "auto" ? e.interactive : t.aria.expanded,
    content: t.aria.content === "auto" ? e.interactive ? null : "describedby" : t.aria.content
  }, t;
}
function Lf(n, e) {
  n === void 0 && (n = {}), e === void 0 && (e = []);
  var t = Object.keys(n);
  t.forEach(function(r) {
    var i = Vb(je, Object.keys(Rf)), o = !Fb(i, r);
    o && (o = e.filter(function(s) {
      return s.name === r;
    }).length === 0), At(o, ["`" + r + "`", "is not a valid prop. You may have spelled it incorrectly, or if it's", "a plugin, forgot to pass it in an array as props.plugins.", `

`, `All props: https://atomiks.github.io/tippyjs/v6/all-props/
`, "Plugins: https://atomiks.github.io/tippyjs/v6/plugins/"].join(" "));
  });
}
var cv = function() {
  return "innerHTML";
};
function ul(n, e) {
  n[cv()] = e;
}
function _c(n) {
  var e = Tr();
  return n === !0 ? e.className = Ef : (e.className = Mf, qr(n) ? e.appendChild(n) : ul(e, n)), e;
}
function Uc(n, e) {
  qr(e.content) ? (ul(n, ""), n.appendChild(e.content)) : typeof e.content != "function" && (e.allowHTML ? ul(n, e.content) : n.textContent = e.content);
}
function dl(n) {
  var e = n.firstElementChild, t = fo(e.children);
  return {
    box: e,
    content: t.find(function(r) {
      return r.classList.contains(Tf);
    }),
    arrow: t.find(function(r) {
      return r.classList.contains(Ef) || r.classList.contains(Mf);
    }),
    backdrop: t.find(function(r) {
      return r.classList.contains($b);
    })
  };
}
function Pf(n) {
  var e = Tr(), t = Tr();
  t.className = zb, t.setAttribute("data-state", "hidden"), t.setAttribute("tabindex", "-1");
  var r = Tr();
  r.className = Tf, r.setAttribute("data-state", "hidden"), Uc(r, n.props), e.appendChild(t), t.appendChild(r), i(n.props, n.props);
  function i(o, s) {
    var l = dl(e), a = l.box, c = l.content, u = l.arrow;
    s.theme ? a.setAttribute("data-theme", s.theme) : a.removeAttribute("data-theme"), typeof s.animation == "string" ? a.setAttribute("data-animation", s.animation) : a.removeAttribute("data-animation"), s.inertia ? a.setAttribute("data-inertia", "") : a.removeAttribute("data-inertia"), a.style.maxWidth = typeof s.maxWidth == "number" ? s.maxWidth + "px" : s.maxWidth, s.role ? a.setAttribute("role", s.role) : a.removeAttribute("role"), (o.content !== s.content || o.allowHTML !== s.allowHTML) && Uc(c, n.props), s.arrow ? u ? o.arrow !== s.arrow && (a.removeChild(u), a.appendChild(_c(s.arrow))) : a.appendChild(_c(s.arrow)) : u && a.removeChild(u);
  }
  return {
    popper: e,
    onUpdate: i
  };
}
Pf.$$tippy = !0;
var uv = 1, Di = [], Ms = [];
function dv(n, e) {
  var t = Wc(n, Object.assign({}, je, If(zc(e)))), r, i, o, s = !1, l = !1, a = !1, c = !1, u, d, f, h = [], p = Bc(ui, t.interactiveDebounce), m, g = uv++, b = null, T = Wb(t.plugins), S = {
    // Is the instance currently enabled?
    isEnabled: !0,
    // Is the tippy currently showing and not transitioning out?
    isVisible: !1,
    // Has the instance been destroyed?
    isDestroyed: !1,
    // Is the tippy currently mounted to the DOM?
    isMounted: !1,
    // Has the tippy finished transitioning in?
    isShown: !1
  }, y = {
    // properties
    id: g,
    reference: n,
    popper: Tr(),
    popperInstance: b,
    props: t,
    state: S,
    plugins: T,
    // methods
    clearDelayTimeouts: mi,
    setProps: gi,
    setContent: yi,
    show: mh,
    hide: gh,
    hideWithInteractivity: yh,
    enable: cr,
    disable: pi,
    unmount: bh,
    destroy: vh
  };
  if (!t.render)
    return process.env.NODE_ENV !== "production" && cl(!0, "render() function has not been supplied."), y;
  var O = t.render(y), x = O.popper, E = O.onUpdate;
  x.setAttribute("data-tippy-root", ""), x.id = "tippy-" + y.id, y.popper = x, n._tippy = y, x._tippy = y;
  var k = T.map(function(w) {
    return w.fn(y);
  }), I = n.hasAttribute("aria-expanded");
  return wt(), Te(), oe(), J("onCreate", [y]), t.showOnCreate && ar(), x.addEventListener("mouseenter", function() {
    y.props.interactive && y.state.isVisible && y.clearDelayTimeouts();
  }), x.addEventListener("mouseleave", function() {
    y.props.interactive && y.props.trigger.indexOf("mouseenter") >= 0 && Z().addEventListener("mousemove", p);
  }), y;
  function j() {
    var w = y.props.touch;
    return Array.isArray(w) ? w : [w, 0];
  }
  function K() {
    return j()[0] === "hold";
  }
  function B() {
    var w;
    return !!((w = y.props.render) != null && w.$$tippy);
  }
  function F() {
    return m || n;
  }
  function Z() {
    var w = F().parentNode;
    return w ? Gb(w) : document;
  }
  function ne() {
    return dl(x);
  }
  function X(w) {
    return y.state.isMounted && !y.state.isVisible || dt.isTouch || u && u.type === "focus" ? 0 : Cs(y.props.delay, w ? 0 : 1, je.delay);
  }
  function oe(w) {
    w === void 0 && (w = !1), x.style.pointerEvents = y.props.interactive && !w ? "" : "none", x.style.zIndex = "" + y.props.zIndex;
  }
  function J(w, R, $) {
    if ($ === void 0 && ($ = !0), k.forEach(function(U) {
      U[w] && U[w].apply(U, R);
    }), $) {
      var G;
      (G = y.props)[w].apply(G, R);
    }
  }
  function we() {
    var w = y.props.aria;
    if (w.content) {
      var R = "aria-" + w.content, $ = x.id, G = $n(y.props.triggerTarget || n);
      G.forEach(function(U) {
        var Ne = U.getAttribute(R);
        if (y.state.isVisible)
          U.setAttribute(R, Ne ? Ne + " " + $ : $);
        else {
          var qe = Ne && Ne.replace($, "").trim();
          qe ? U.setAttribute(R, qe) : U.removeAttribute(R);
        }
      });
    }
  }
  function Te() {
    if (!(I || !y.props.aria.expanded)) {
      var w = $n(y.props.triggerTarget || n);
      w.forEach(function(R) {
        y.props.interactive ? R.setAttribute("aria-expanded", y.state.isVisible && R === F() ? "true" : "false") : R.removeAttribute("aria-expanded");
      });
    }
  }
  function v() {
    Z().removeEventListener("mousemove", p), Di = Di.filter(function(w) {
      return w !== p;
    });
  }
  function N(w) {
    if (!(dt.isTouch && (a || w.type === "mousedown"))) {
      var R = w.composedPath && w.composedPath()[0] || w.target;
      if (!(y.props.interactive && Fc(x, R))) {
        if ($n(y.props.triggerTarget || n).some(function($) {
          return Fc($, R);
        })) {
          if (dt.isTouch || y.state.isVisible && y.props.trigger.indexOf("click") >= 0)
            return;
        } else
          J("onClickOutside", [y, w]);
        y.props.hideOnClick === !0 && (y.clearDelayTimeouts(), y.hide(), l = !0, setTimeout(function() {
          l = !1;
        }), y.state.isMounted || pe());
      }
    }
  }
  function z() {
    a = !0;
  }
  function _() {
    a = !1;
  }
  function q() {
    var w = Z();
    w.addEventListener("mousedown", N, !0), w.addEventListener("touchend", N, an), w.addEventListener("touchstart", _, an), w.addEventListener("touchmove", z, an);
  }
  function pe() {
    var w = Z();
    w.removeEventListener("mousedown", N, !0), w.removeEventListener("touchend", N, an), w.removeEventListener("touchstart", _, an), w.removeEventListener("touchmove", z, an);
  }
  function Ke(w, R) {
    bt(w, function() {
      !y.state.isVisible && x.parentNode && x.parentNode.contains(x) && R();
    });
  }
  function Ie(w, R) {
    bt(w, R);
  }
  function bt(w, R) {
    var $ = ne().box;
    function G(U) {
      U.target === $ && (Es($, "remove", G), R());
    }
    if (w === 0)
      return R();
    Es($, "remove", d), Es($, "add", G), d = G;
  }
  function vt(w, R, $) {
    $ === void 0 && ($ = !1);
    var G = $n(y.props.triggerTarget || n);
    G.forEach(function(U) {
      U.addEventListener(w, R, $), h.push({
        node: U,
        eventType: w,
        handler: R,
        options: $
      });
    });
  }
  function wt() {
    K() && (vt("touchstart", or, {
      passive: !0
    }), vt("touchend", di, {
      passive: !0
    })), jb(y.props.trigger).forEach(function(w) {
      if (w !== "manual")
        switch (vt(w, or), w) {
          case "mouseenter":
            vt("mouseleave", di);
            break;
          case "focus":
            vt(tv ? "focusout" : "blur", sr);
            break;
          case "focusin":
            vt("focusout", sr);
            break;
        }
    });
  }
  function ci() {
    h.forEach(function(w) {
      var R = w.node, $ = w.eventType, G = w.handler, U = w.options;
      R.removeEventListener($, G, U);
    }), h = [];
  }
  function or(w) {
    var R, $ = !1;
    if (!(!y.state.isEnabled || lr(w) || l)) {
      var G = ((R = u) == null ? void 0 : R.type) === "focus";
      u = w, m = w.currentTarget, Te(), !y.state.isVisible && Kb(w) && Di.forEach(function(U) {
        return U(w);
      }), w.type === "click" && (y.props.trigger.indexOf("mouseenter") < 0 || s) && y.props.hideOnClick !== !1 && y.state.isVisible ? $ = !0 : ar(w), w.type === "click" && (s = !$), $ && !G && on(w);
    }
  }
  function ui(w) {
    var R = w.target, $ = F().contains(R) || x.contains(R);
    if (!(w.type === "mousemove" && $)) {
      var G = Ht().concat(x).map(function(U) {
        var Ne, qe = U._tippy, Nn = (Ne = qe.popperInstance) == null ? void 0 : Ne.state;
        return Nn ? {
          popperRect: U.getBoundingClientRect(),
          popperState: Nn,
          props: t
        } : null;
      }).filter(Boolean);
      Yb(G, w) && (v(), on(w));
    }
  }
  function di(w) {
    var R = lr(w) || y.props.trigger.indexOf("click") >= 0 && s;
    if (!R) {
      if (y.props.interactive) {
        y.hideWithInteractivity(w);
        return;
      }
      on(w);
    }
  }
  function sr(w) {
    y.props.trigger.indexOf("focusin") < 0 && w.target !== F() || y.props.interactive && w.relatedTarget && x.contains(w.relatedTarget) || on(w);
  }
  function lr(w) {
    return dt.isTouch ? K() !== w.type.indexOf("touch") >= 0 : !1;
  }
  function fi() {
    hi();
    var w = y.props, R = w.popperOptions, $ = w.placement, G = w.offset, U = w.getReferenceClientRect, Ne = w.moveTransition, qe = B() ? dl(x).arrow : null, Nn = U ? {
      getBoundingClientRect: U,
      contextElement: U.contextElement || F()
    } : n, ka = {
      name: "$$tippy",
      enabled: !0,
      phase: "beforeWrite",
      requires: ["computeStyles"],
      fn: function(bi) {
        var Dn = bi.state;
        if (B()) {
          var wh = ne(), ss = wh.box;
          ["placement", "reference-hidden", "escaped"].forEach(function(vi) {
            vi === "placement" ? ss.setAttribute("data-placement", Dn.placement) : Dn.attributes.popper["data-popper-" + vi] ? ss.setAttribute("data-" + vi, "") : ss.removeAttribute("data-" + vi);
          }), Dn.attributes.popper = {};
        }
      }
    }, sn = [{
      name: "offset",
      options: {
        offset: G
      }
    }, {
      name: "preventOverflow",
      options: {
        padding: {
          top: 2,
          bottom: 2,
          left: 5,
          right: 5
        }
      }
    }, {
      name: "flip",
      options: {
        padding: 5
      }
    }, {
      name: "computeStyles",
      options: {
        adaptive: !Ne
      }
    }, ka];
    B() && qe && sn.push({
      name: "arrow",
      options: {
        element: qe,
        padding: 3
      }
    }), sn.push.apply(sn, (R == null ? void 0 : R.modifiers) || []), y.popperInstance = Hb(Nn, x, Object.assign({}, R, {
      placement: $,
      onFirstUpdate: f,
      modifiers: sn
    }));
  }
  function hi() {
    y.popperInstance && (y.popperInstance.destroy(), y.popperInstance = null);
  }
  function kt() {
    var w = y.props.appendTo, R, $ = F();
    y.props.interactive && w === Of || w === "parent" ? R = $.parentNode : R = Af(w, [$]), R.contains(x) || R.appendChild(x), y.state.isMounted = !0, fi(), process.env.NODE_ENV !== "production" && At(y.props.interactive && w === je.appendTo && $.nextElementSibling !== x, ["Interactive tippy element may not be accessible via keyboard", "navigation because it is not directly after the reference element", "in the DOM source order.", `

`, "Using a wrapper <div> or <span> tag around the reference element", "solves this by creating a new parentNode context.", `

`, "Specifying `appendTo: document.body` silences this warning, but it", "assumes you are using a focus management solution to handle", "keyboard navigation.", `

`, "See: https://atomiks.github.io/tippyjs/v6/accessibility/#interactivity"].join(" "));
  }
  function Ht() {
    return fo(x.querySelectorAll("[data-tippy-root]"));
  }
  function ar(w) {
    y.clearDelayTimeouts(), w && J("onTrigger", [y, w]), q();
    var R = X(!0), $ = j(), G = $[0], U = $[1];
    dt.isTouch && G === "hold" && U && (R = U), R ? r = setTimeout(function() {
      y.show();
    }, R) : y.show();
  }
  function on(w) {
    if (y.clearDelayTimeouts(), J("onUntrigger", [y, w]), !y.state.isVisible) {
      pe();
      return;
    }
    if (!(y.props.trigger.indexOf("mouseenter") >= 0 && y.props.trigger.indexOf("click") >= 0 && ["mouseleave", "mousemove"].indexOf(w.type) >= 0 && s)) {
      var R = X(!1);
      R ? i = setTimeout(function() {
        y.state.isVisible && y.hide();
      }, R) : o = requestAnimationFrame(function() {
        y.hide();
      });
    }
  }
  function cr() {
    y.state.isEnabled = !0;
  }
  function pi() {
    y.hide(), y.state.isEnabled = !1;
  }
  function mi() {
    clearTimeout(r), clearTimeout(i), cancelAnimationFrame(o);
  }
  function gi(w) {
    if (process.env.NODE_ENV !== "production" && At(y.state.isDestroyed, Ln("setProps")), !y.state.isDestroyed) {
      J("onBeforeUpdate", [y, w]), ci();
      var R = y.props, $ = Wc(n, Object.assign({}, R, zc(w), {
        ignoreAttributes: !0
      }));
      y.props = $, wt(), R.interactiveDebounce !== $.interactiveDebounce && (v(), p = Bc(ui, $.interactiveDebounce)), R.triggerTarget && !$.triggerTarget ? $n(R.triggerTarget).forEach(function(G) {
        G.removeAttribute("aria-expanded");
      }) : $.triggerTarget && n.removeAttribute("aria-expanded"), Te(), oe(), E && E(R, $), y.popperInstance && (fi(), Ht().forEach(function(G) {
        requestAnimationFrame(G._tippy.popperInstance.forceUpdate);
      })), J("onAfterUpdate", [y, w]);
    }
  }
  function yi(w) {
    y.setProps({
      content: w
    });
  }
  function mh() {
    process.env.NODE_ENV !== "production" && At(y.state.isDestroyed, Ln("show"));
    var w = y.state.isVisible, R = y.state.isDestroyed, $ = !y.state.isEnabled, G = dt.isTouch && !y.props.touch, U = Cs(y.props.duration, 0, je.duration);
    if (!(w || R || $ || G) && !F().hasAttribute("disabled") && (J("onShow", [y], !1), y.props.onShow(y) !== !1)) {
      if (y.state.isVisible = !0, B() && (x.style.visibility = "visible"), oe(), q(), y.state.isMounted || (x.style.transition = "none"), B()) {
        var Ne = ne(), qe = Ne.box, Nn = Ne.content;
        Ts([qe, Nn], 0);
      }
      f = function() {
        var sn;
        if (!(!y.state.isVisible || c)) {
          if (c = !0, x.offsetHeight, x.style.transition = y.props.moveTransition, B() && y.props.animation) {
            var is = ne(), bi = is.box, Dn = is.content;
            Ts([bi, Dn], U), $c([bi, Dn], "visible");
          }
          we(), Te(), Hc(Ms, y), (sn = y.popperInstance) == null || sn.forceUpdate(), J("onMount", [y]), y.props.animation && B() && Ie(U, function() {
            y.state.isShown = !0, J("onShown", [y]);
          });
        }
      }, kt();
    }
  }
  function gh() {
    process.env.NODE_ENV !== "production" && At(y.state.isDestroyed, Ln("hide"));
    var w = !y.state.isVisible, R = y.state.isDestroyed, $ = !y.state.isEnabled, G = Cs(y.props.duration, 1, je.duration);
    if (!(w || R || $) && (J("onHide", [y], !1), y.props.onHide(y) !== !1)) {
      if (y.state.isVisible = !1, y.state.isShown = !1, c = !1, s = !1, B() && (x.style.visibility = "hidden"), v(), pe(), oe(!0), B()) {
        var U = ne(), Ne = U.box, qe = U.content;
        y.props.animation && (Ts([Ne, qe], G), $c([Ne, qe], "hidden"));
      }
      we(), Te(), y.props.animation ? B() && Ke(G, y.unmount) : y.unmount();
    }
  }
  function yh(w) {
    process.env.NODE_ENV !== "production" && At(y.state.isDestroyed, Ln("hideWithInteractivity")), Z().addEventListener("mousemove", p), Hc(Di, p), p(w);
  }
  function bh() {
    process.env.NODE_ENV !== "production" && At(y.state.isDestroyed, Ln("unmount")), y.state.isVisible && y.hide(), y.state.isMounted && (hi(), Ht().forEach(function(w) {
      w._tippy.unmount();
    }), x.parentNode && x.parentNode.removeChild(x), Ms = Ms.filter(function(w) {
      return w !== y;
    }), y.state.isMounted = !1, J("onHidden", [y]));
  }
  function vh() {
    process.env.NODE_ENV !== "production" && At(y.state.isDestroyed, Ln("destroy")), !y.state.isDestroyed && (y.clearDelayTimeouts(), y.unmount(), ci(), delete n._tippy, y.state.isDestroyed = !0, J("onDestroy", [y]));
  }
}
function ir(n, e) {
  e === void 0 && (e = {});
  var t = je.plugins.concat(e.plugins || []);
  process.env.NODE_ENV !== "production" && (iv(n), Lf(e, t)), Zb();
  var r = Object.assign({}, e, {
    plugins: t
  }), i = Jb(n);
  if (process.env.NODE_ENV !== "production") {
    var o = qr(r.content), s = i.length > 1;
    At(o && s, ["tippy() was passed an Element as the `content` prop, but more than", "one tippy instance was created by this invocation. This means the", "content element will only be appended to the last tippy instance.", `

`, "Instead, pass the .innerHTML of the element, or use a function that", "returns a cloned version of the element instead.", `

`, `1) content: element.innerHTML
`, "2) content: () => element.cloneNode(true)"].join(" "));
  }
  var l = i.reduce(function(a, c) {
    var u = c && dv(c, r);
    return u && a.push(u), a;
  }, []);
  return qr(n) ? l[0] : l;
}
ir.defaultProps = je;
ir.setDefaultProps = lv;
ir.currentInput = dt;
Object.assign({}, yf, {
  effect: function(e) {
    var t = e.state, r = {
      popper: {
        position: t.options.strategy,
        left: "0",
        top: "0",
        margin: "0"
      },
      arrow: {
        position: "absolute"
      },
      reference: {}
    };
    Object.assign(t.elements.popper.style, r.popper), t.styles = r, t.elements.arrow && Object.assign(t.elements.arrow.style, r.arrow);
  }
});
ir.setDefaultProps({
  render: Pf
});
class fv {
  constructor({ editor: e, element: t, view: r, tippyOptions: i = {}, updateDelay: o = 250, shouldShow: s }) {
    this.preventHide = !1, this.shouldShow = ({ view: l, state: a, from: c, to: u }) => {
      const { doc: d, selection: f } = a, { empty: h } = f, p = !d.textBetween(c, u).length && Zl(a.selection), m = this.element.contains(document.activeElement);
      return !(!(l.hasFocus() || m) || h || p || !this.editor.isEditable);
    }, this.mousedownHandler = () => {
      this.preventHide = !0;
    }, this.dragstartHandler = () => {
      this.hide();
    }, this.focusHandler = () => {
      setTimeout(() => this.update(this.editor.view));
    }, this.blurHandler = ({ event: l }) => {
      var a;
      if (this.preventHide) {
        this.preventHide = !1;
        return;
      }
      l != null && l.relatedTarget && (!((a = this.element.parentNode) === null || a === void 0) && a.contains(l.relatedTarget)) || (l == null ? void 0 : l.relatedTarget) !== this.editor.view.dom && this.hide();
    }, this.tippyBlurHandler = (l) => {
      this.blurHandler({ event: l });
    }, this.handleDebouncedUpdate = (l, a) => {
      const c = !(a != null && a.selection.eq(l.state.selection)), u = !(a != null && a.doc.eq(l.state.doc));
      !c && !u || (this.updateDebounceTimer && clearTimeout(this.updateDebounceTimer), this.updateDebounceTimer = window.setTimeout(() => {
        this.updateHandler(l, c, u, a);
      }, this.updateDelay));
    }, this.updateHandler = (l, a, c, u) => {
      var d, f, h;
      const { state: p, composing: m } = l, { selection: g } = p;
      if (m || !a && !c)
        return;
      this.createTooltip();
      const { ranges: T } = g, S = Math.min(...T.map((x) => x.$from.pos)), y = Math.max(...T.map((x) => x.$to.pos));
      if (!((d = this.shouldShow) === null || d === void 0 ? void 0 : d.call(this, {
        editor: this.editor,
        element: this.element,
        view: l,
        state: p,
        oldState: u,
        from: S,
        to: y
      }))) {
        this.hide();
        return;
      }
      (f = this.tippy) === null || f === void 0 || f.setProps({
        getReferenceClientRect: ((h = this.tippyOptions) === null || h === void 0 ? void 0 : h.getReferenceClientRect) || (() => {
          if (ff(p.selection)) {
            let x = l.nodeDOM(S);
            if (x) {
              const E = x.dataset.nodeViewWrapper ? x : x.querySelector("[data-node-view-wrapper]");
              if (E && (x = E.firstChild), x)
                return x.getBoundingClientRect();
            }
          }
          return hf(l, S, y);
        })
      }), this.show();
    }, this.editor = e, this.element = t, this.view = r, this.updateDelay = o, s && (this.shouldShow = s), this.element.addEventListener("mousedown", this.mousedownHandler, { capture: !0 }), this.view.dom.addEventListener("dragstart", this.dragstartHandler), this.editor.on("focus", this.focusHandler), this.editor.on("blur", this.blurHandler), this.tippyOptions = i, this.element.remove(), this.element.style.visibility = "visible";
  }
  createTooltip() {
    const { element: e } = this.editor.options, t = !!e.parentElement;
    this.element.tabIndex = 0, !(this.tippy || !t) && (this.tippy = ir(e, {
      duration: 0,
      getReferenceClientRect: null,
      content: this.element,
      interactive: !0,
      trigger: "manual",
      placement: "top",
      hideOnClick: "toggle",
      ...this.tippyOptions
    }), this.tippy.popper.firstChild && this.tippy.popper.firstChild.addEventListener("blur", this.tippyBlurHandler));
  }
  update(e, t) {
    const { state: r } = e, i = r.selection.from !== r.selection.to;
    if (this.updateDelay > 0 && i) {
      this.handleDebouncedUpdate(e, t);
      return;
    }
    const o = !(t != null && t.selection.eq(e.state.selection)), s = !(t != null && t.doc.eq(e.state.doc));
    this.updateHandler(e, o, s, t);
  }
  show() {
    var e;
    (e = this.tippy) === null || e === void 0 || e.show();
  }
  hide() {
    var e;
    (e = this.tippy) === null || e === void 0 || e.hide();
  }
  destroy() {
    var e, t;
    !((e = this.tippy) === null || e === void 0) && e.popper.firstChild && this.tippy.popper.firstChild.removeEventListener("blur", this.tippyBlurHandler), (t = this.tippy) === null || t === void 0 || t.destroy(), this.element.removeEventListener("mousedown", this.mousedownHandler, { capture: !0 }), this.view.dom.removeEventListener("dragstart", this.dragstartHandler), this.editor.off("focus", this.focusHandler), this.editor.off("blur", this.blurHandler);
  }
}
const Bf = (n) => new ie({
  key: typeof n.pluginKey == "string" ? new ue(n.pluginKey) : n.pluginKey,
  view: (e) => new fv({ view: e, ...n })
});
ge.create({
  name: "bubbleMenu",
  addOptions() {
    return {
      element: null,
      tippyOptions: {},
      pluginKey: "bubbleMenu",
      updateDelay: void 0,
      shouldShow: null
    };
  },
  addProseMirrorPlugins() {
    return this.options.element ? [
      Bf({
        pluginKey: this.options.pluginKey,
        editor: this.editor,
        element: this.options.element,
        tippyOptions: this.options.tippyOptions,
        updateDelay: this.options.updateDelay,
        shouldShow: this.options.shouldShow
      })
    ] : [];
  }
});
class hv {
  getTextContent(e) {
    return uf(e, { textSerializers: Xl(this.editor.schema) });
  }
  constructor({ editor: e, element: t, view: r, tippyOptions: i = {}, shouldShow: o }) {
    this.preventHide = !1, this.shouldShow = ({ view: s, state: l }) => {
      const { selection: a } = l, { $anchor: c, empty: u } = a, d = c.depth === 1, f = c.parent.isTextblock && !c.parent.type.spec.code && !c.parent.textContent && c.parent.childCount === 0 && !this.getTextContent(c.parent);
      return !(!s.hasFocus() || !u || !d || !f || !this.editor.isEditable);
    }, this.mousedownHandler = () => {
      this.preventHide = !0;
    }, this.focusHandler = () => {
      setTimeout(() => this.update(this.editor.view));
    }, this.blurHandler = ({ event: s }) => {
      var l;
      if (this.preventHide) {
        this.preventHide = !1;
        return;
      }
      s != null && s.relatedTarget && (!((l = this.element.parentNode) === null || l === void 0) && l.contains(s.relatedTarget)) || (s == null ? void 0 : s.relatedTarget) !== this.editor.view.dom && this.hide();
    }, this.tippyBlurHandler = (s) => {
      this.blurHandler({ event: s });
    }, this.editor = e, this.element = t, this.view = r, o && (this.shouldShow = o), this.element.addEventListener("mousedown", this.mousedownHandler, { capture: !0 }), this.editor.on("focus", this.focusHandler), this.editor.on("blur", this.blurHandler), this.tippyOptions = i, this.element.remove(), this.element.style.visibility = "visible";
  }
  createTooltip() {
    const { element: e } = this.editor.options, t = !!e.parentElement;
    this.element.tabIndex = 0, !(this.tippy || !t) && (this.tippy = ir(e, {
      duration: 0,
      getReferenceClientRect: null,
      content: this.element,
      interactive: !0,
      trigger: "manual",
      placement: "right",
      hideOnClick: "toggle",
      ...this.tippyOptions
    }), this.tippy.popper.firstChild && this.tippy.popper.firstChild.addEventListener("blur", this.tippyBlurHandler));
  }
  update(e, t) {
    var r, i, o;
    const { state: s } = e, { doc: l, selection: a } = s, { from: c, to: u } = a;
    if (t && t.doc.eq(l) && t.selection.eq(a))
      return;
    if (this.createTooltip(), !((r = this.shouldShow) === null || r === void 0 ? void 0 : r.call(this, {
      editor: this.editor,
      view: e,
      state: s,
      oldState: t
    }))) {
      this.hide();
      return;
    }
    (i = this.tippy) === null || i === void 0 || i.setProps({
      getReferenceClientRect: ((o = this.tippyOptions) === null || o === void 0 ? void 0 : o.getReferenceClientRect) || (() => hf(e, c, u))
    }), this.show();
  }
  show() {
    var e;
    (e = this.tippy) === null || e === void 0 || e.show();
  }
  hide() {
    var e;
    (e = this.tippy) === null || e === void 0 || e.hide();
  }
  destroy() {
    var e, t;
    !((e = this.tippy) === null || e === void 0) && e.popper.firstChild && this.tippy.popper.firstChild.removeEventListener("blur", this.tippyBlurHandler), (t = this.tippy) === null || t === void 0 || t.destroy(), this.element.removeEventListener("mousedown", this.mousedownHandler, { capture: !0 }), this.editor.off("focus", this.focusHandler), this.editor.off("blur", this.blurHandler);
  }
}
const Hf = (n) => new ie({
  key: typeof n.pluginKey == "string" ? new ue(n.pluginKey) : n.pluginKey,
  view: (e) => new hv({ view: e, ...n })
});
ge.create({
  name: "floatingMenu",
  addOptions() {
    return {
      element: null,
      tippyOptions: {},
      pluginKey: "floatingMenu",
      shouldShow: null
    };
  },
  addProseMirrorPlugins() {
    return this.options.element ? [
      Hf({
        pluginKey: this.options.pluginKey,
        editor: this.editor,
        element: this.options.element,
        tippyOptions: this.options.tippyOptions,
        shouldShow: this.options.shouldShow
      })
    ] : [];
  }
});
tr({
  name: "BubbleMenu",
  props: {
    pluginKey: {
      type: [String, Object],
      default: "bubbleMenu"
    },
    editor: {
      type: Object,
      required: !0
    },
    updateDelay: {
      type: Number,
      default: void 0
    },
    tippyOptions: {
      type: Object,
      default: () => ({})
    },
    shouldShow: {
      type: Function,
      default: null
    }
  },
  setup(n, { slots: e }) {
    const t = Be(null);
    return Zr(() => {
      const { updateDelay: r, editor: i, pluginKey: o, shouldShow: s, tippyOptions: l } = n;
      i.registerPlugin(Bf({
        updateDelay: r,
        editor: i,
        element: t.value,
        pluginKey: o,
        shouldShow: s,
        tippyOptions: l
      }));
    }), ei(() => {
      const { pluginKey: r, editor: i } = n;
      i.unregisterPlugin(r);
    }), () => {
      var r;
      return ti("div", { ref: t }, (r = e.default) === null || r === void 0 ? void 0 : r.call(e));
    };
  }
});
function Kc(n) {
  return Oh((e, t) => ({
    get() {
      return e(), n;
    },
    set(r) {
      n = r, requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          t();
        });
      });
    }
  }));
}
class pv extends N0 {
  constructor(e = {}) {
    return super(e), this.contentComponent = null, this.appContext = null, this.reactiveState = Kc(this.view.state), this.reactiveExtensionStorage = Kc(this.extensionStorage), this.on("beforeTransaction", ({ nextState: t }) => {
      this.reactiveState.value = t, this.reactiveExtensionStorage.value = this.extensionStorage;
    }), Mh(this);
  }
  get state() {
    return this.reactiveState ? this.reactiveState.value : this.view.state;
  }
  get storage() {
    return this.reactiveExtensionStorage ? this.reactiveExtensionStorage.value : super.storage;
  }
  /**
   * Register a ProseMirror plugin.
   */
  registerPlugin(e, t) {
    const r = super.registerPlugin(e, t);
    return this.reactiveState && (this.reactiveState.value = r), r;
  }
  /**
   * Unregister a ProseMirror plugin.
   */
  unregisterPlugin(e) {
    const t = super.unregisterPlugin(e);
    return this.reactiveState && t && (this.reactiveState.value = t), t;
  }
}
const mv = tr({
  name: "EditorContent",
  props: {
    editor: {
      default: null,
      type: Object
    }
  },
  setup(n) {
    const e = Be(), t = Ch();
    return Th(() => {
      const r = n.editor;
      r && r.options.element && e.value && Eh(() => {
        if (!e.value || !r.options.element.firstChild)
          return;
        const i = ji(e.value);
        e.value.append(...r.options.element.childNodes), r.contentComponent = t.ctx._, t && (r.appContext = {
          ...t.appContext,
          // Vue internally uses prototype chain to forward/shadow injects across the entire component chain
          // so don't use object spread operator or 'Object.assign' and just set `provides` as is on editor's appContext
          // @ts-expect-error forward instance's 'provides' into appContext
          provides: t.provides
        }), r.setOptions({
          element: i
        }), r.createNodeViews();
      });
    }), ei(() => {
      const r = n.editor;
      r && (r.contentComponent = null, r.appContext = null);
    }), { rootEl: e };
  },
  render() {
    return ti("div", {
      ref: (n) => {
        this.rootEl = n;
      }
    });
  }
});
tr({
  name: "FloatingMenu",
  props: {
    pluginKey: {
      // TODO: TypeScript breaks :(
      // type: [String, Object as PropType<Exclude<FloatingMenuPluginProps['pluginKey'], string>>],
      type: null,
      default: "floatingMenu"
    },
    editor: {
      type: Object,
      required: !0
    },
    tippyOptions: {
      type: Object,
      default: () => ({})
    },
    shouldShow: {
      type: Function,
      default: null
    }
  },
  setup(n, { slots: e }) {
    const t = Be(null);
    return Zr(() => {
      const { pluginKey: r, editor: i, tippyOptions: o, shouldShow: s } = n;
      i.registerPlugin(Hf({
        pluginKey: r,
        editor: i,
        element: t.value,
        tippyOptions: o,
        shouldShow: s
      }));
    }), ei(() => {
      const { pluginKey: r, editor: i } = n;
      i.unregisterPlugin(r);
    }), () => {
      var r;
      return ti("div", { ref: t }, (r = e.default) === null || r === void 0 ? void 0 : r.call(e));
    };
  }
});
tr({
  name: "NodeViewContent",
  props: {
    as: {
      type: String,
      default: "div"
    }
  },
  render() {
    return ti(this.as, {
      style: {
        whiteSpace: "pre-wrap"
      },
      "data-node-view-content": ""
    });
  }
});
tr({
  name: "NodeViewWrapper",
  props: {
    as: {
      type: String,
      default: "div"
    }
  },
  inject: ["onDragStart", "decorationClasses"],
  render() {
    var n, e;
    return ti(this.as, {
      // @ts-ignore
      class: this.decorationClasses,
      style: {
        whiteSpace: "normal"
      },
      "data-node-view-wrapper": "",
      // @ts-ignore (https://github.com/vuejs/vue-next/issues/3031)
      onDragstart: this.onDragStart
    }, (e = (n = this.$slots).default) === null || e === void 0 ? void 0 : e.call(n));
  }
});
const gv = (n = {}) => {
  const e = xh();
  return Zr(() => {
    e.value = new pv(n);
  }), ei(() => {
    var t, r, i;
    const o = (t = e.value) === null || t === void 0 ? void 0 : t.options.element, s = o == null ? void 0 : o.cloneNode(!0);
    (r = o == null ? void 0 : o.parentNode) === null || r === void 0 || r.replaceChild(s, o), (i = e.value) === null || i === void 0 || i.destroy();
  }), e;
}, yv = /^\s*>\s$/, bv = ce.create({
  name: "blockquote",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  content: "block+",
  group: "block",
  defining: !0,
  parseHTML() {
    return [
      { tag: "blockquote" }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["blockquote", Y(this.options.HTMLAttributes, n), 0];
  },
  addCommands() {
    return {
      setBlockquote: () => ({ commands: n }) => n.wrapIn(this.name),
      toggleBlockquote: () => ({ commands: n }) => n.toggleWrap(this.name),
      unsetBlockquote: () => ({ commands: n }) => n.lift(this.name)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Shift-b": () => this.editor.commands.toggleBlockquote()
    };
  },
  addInputRules() {
    return [
      Yn({
        find: yv,
        type: this.type
      })
    ];
  }
}), vv = /(?:^|\s)(\*\*(?!\s+\*\*)((?:[^*]+))\*\*(?!\s+\*\*))$/, wv = /(?:^|\s)(\*\*(?!\s+\*\*)((?:[^*]+))\*\*(?!\s+\*\*))/g, kv = /(?:^|\s)(__(?!\s+__)((?:[^_]+))__(?!\s+__))$/, Sv = /(?:^|\s)(__(?!\s+__)((?:[^_]+))__(?!\s+__))/g, xv = mt.create({
  name: "bold",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  parseHTML() {
    return [
      {
        tag: "strong"
      },
      {
        tag: "b",
        getAttrs: (n) => n.style.fontWeight !== "normal" && null
      },
      {
        style: "font-weight=400",
        clearMark: (n) => n.type.name === this.name
      },
      {
        style: "font-weight",
        getAttrs: (n) => /^(bold(er)?|[5-9]\d{2,})$/.test(n) && null
      }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["strong", Y(this.options.HTMLAttributes, n), 0];
  },
  addCommands() {
    return {
      setBold: () => ({ commands: n }) => n.setMark(this.name),
      toggleBold: () => ({ commands: n }) => n.toggleMark(this.name),
      unsetBold: () => ({ commands: n }) => n.unsetMark(this.name)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-b": () => this.editor.commands.toggleBold(),
      "Mod-B": () => this.editor.commands.toggleBold()
    };
  },
  addInputRules() {
    return [
      Gn({
        find: vv,
        type: this.type
      }),
      Gn({
        find: kv,
        type: this.type
      })
    ];
  },
  addPasteRules() {
    return [
      Tn({
        find: wv,
        type: this.type
      }),
      Tn({
        find: Sv,
        type: this.type
      })
    ];
  }
}), Cv = "listItem", qc = "textStyle", Jc = /^\s*([-+*])\s$/, Tv = ce.create({
  name: "bulletList",
  addOptions() {
    return {
      itemTypeName: "listItem",
      HTMLAttributes: {},
      keepMarks: !1,
      keepAttributes: !1
    };
  },
  group: "block list",
  content() {
    return `${this.options.itemTypeName}+`;
  },
  parseHTML() {
    return [
      { tag: "ul" }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["ul", Y(this.options.HTMLAttributes, n), 0];
  },
  addCommands() {
    return {
      toggleBulletList: () => ({ commands: n, chain: e }) => this.options.keepAttributes ? e().toggleList(this.name, this.options.itemTypeName, this.options.keepMarks).updateAttributes(Cv, this.editor.getAttributes(qc)).run() : n.toggleList(this.name, this.options.itemTypeName, this.options.keepMarks)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Shift-8": () => this.editor.commands.toggleBulletList()
    };
  },
  addInputRules() {
    let n = Yn({
      find: Jc,
      type: this.type
    });
    return (this.options.keepMarks || this.options.keepAttributes) && (n = Yn({
      find: Jc,
      type: this.type,
      keepMarks: this.options.keepMarks,
      keepAttributes: this.options.keepAttributes,
      getAttributes: () => this.editor.getAttributes(qc),
      editor: this.editor
    })), [
      n
    ];
  }
}), Ev = /(^|[^`])`([^`]+)`(?!`)/, Mv = /(^|[^`])`([^`]+)`(?!`)/g, Ov = mt.create({
  name: "code",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  excludes: "_",
  code: !0,
  exitable: !0,
  parseHTML() {
    return [
      { tag: "code" }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["code", Y(this.options.HTMLAttributes, n), 0];
  },
  addCommands() {
    return {
      setCode: () => ({ commands: n }) => n.setMark(this.name),
      toggleCode: () => ({ commands: n }) => n.toggleMark(this.name),
      unsetCode: () => ({ commands: n }) => n.unsetMark(this.name)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-e": () => this.editor.commands.toggleCode()
    };
  },
  addInputRules() {
    return [
      Gn({
        find: Ev,
        type: this.type
      })
    ];
  },
  addPasteRules() {
    return [
      Tn({
        find: Mv,
        type: this.type
      })
    ];
  }
}), Av = /^```([a-z]+)?[\s\n]$/, Nv = /^~~~([a-z]+)?[\s\n]$/, Dv = ce.create({
  name: "codeBlock",
  addOptions() {
    return {
      languageClassPrefix: "language-",
      exitOnTripleEnter: !0,
      exitOnArrowDown: !0,
      defaultLanguage: null,
      HTMLAttributes: {}
    };
  },
  content: "text*",
  marks: "",
  group: "block",
  code: !0,
  defining: !0,
  addAttributes() {
    return {
      language: {
        default: this.options.defaultLanguage,
        parseHTML: (n) => {
          var e;
          const { languageClassPrefix: t } = this.options, o = [...((e = n.firstElementChild) === null || e === void 0 ? void 0 : e.classList) || []].filter((s) => s.startsWith(t)).map((s) => s.replace(t, ""))[0];
          return o || null;
        },
        rendered: !1
      }
    };
  },
  parseHTML() {
    return [
      {
        tag: "pre",
        preserveWhitespace: "full"
      }
    ];
  },
  renderHTML({ node: n, HTMLAttributes: e }) {
    return [
      "pre",
      Y(this.options.HTMLAttributes, e),
      [
        "code",
        {
          class: n.attrs.language ? this.options.languageClassPrefix + n.attrs.language : null
        },
        0
      ]
    ];
  },
  addCommands() {
    return {
      setCodeBlock: (n) => ({ commands: e }) => e.setNode(this.name, n),
      toggleCodeBlock: (n) => ({ commands: e }) => e.toggleNode(this.name, "paragraph", n)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Alt-c": () => this.editor.commands.toggleCodeBlock(),
      // remove code block when at start of document or code block is empty
      Backspace: () => {
        const { empty: n, $anchor: e } = this.editor.state.selection, t = e.pos === 1;
        return !n || e.parent.type.name !== this.name ? !1 : t || !e.parent.textContent.length ? this.editor.commands.clearNodes() : !1;
      },
      // exit node on triple enter
      Enter: ({ editor: n }) => {
        if (!this.options.exitOnTripleEnter)
          return !1;
        const { state: e } = n, { selection: t } = e, { $from: r, empty: i } = t;
        if (!i || r.parent.type !== this.type)
          return !1;
        const o = r.parentOffset === r.parent.nodeSize - 2, s = r.parent.textContent.endsWith(`

`);
        return !o || !s ? !1 : n.chain().command(({ tr: l }) => (l.delete(r.pos - 2, r.pos), !0)).exitCode().run();
      },
      // exit node on arrow down
      ArrowDown: ({ editor: n }) => {
        if (!this.options.exitOnArrowDown)
          return !1;
        const { state: e } = n, { selection: t, doc: r } = e, { $from: i, empty: o } = t;
        if (!o || i.parent.type !== this.type || !(i.parentOffset === i.parent.nodeSize - 2))
          return !1;
        const l = i.after();
        return l === void 0 ? !1 : r.nodeAt(l) ? n.commands.command(({ tr: c }) => (c.setSelection(H.near(r.resolve(l))), !0)) : n.commands.exitCode();
      }
    };
  },
  addInputRules() {
    return [
      sl({
        find: Av,
        type: this.type,
        getAttributes: (n) => ({
          language: n[1]
        })
      }),
      sl({
        find: Nv,
        type: this.type,
        getAttributes: (n) => ({
          language: n[1]
        })
      })
    ];
  },
  addProseMirrorPlugins() {
    return [
      // this plugin creates a code block for pasted content from VS Code
      // we can also detect the copied code language
      new ie({
        key: new ue("codeBlockVSCodeHandler"),
        props: {
          handlePaste: (n, e) => {
            if (!e.clipboardData || this.editor.isActive(this.type.name))
              return !1;
            const t = e.clipboardData.getData("text/plain"), r = e.clipboardData.getData("vscode-editor-data"), i = r ? JSON.parse(r) : void 0, o = i == null ? void 0 : i.mode;
            if (!t || !o)
              return !1;
            const { tr: s, schema: l } = n.state, a = l.text(t.replace(/\r\n?/g, `
`));
            return s.replaceSelectionWith(this.type.create({ language: o }, a)), s.selection.$from.parent.type !== this.type && s.setSelection(L.near(s.doc.resolve(Math.max(0, s.selection.from - 2)))), s.setMeta("paste", !0), n.dispatch(s), !0;
          }
        }
      })
    ];
  }
}), Rv = ce.create({
  name: "doc",
  topNode: !0,
  content: "block+"
});
function Iv(n = {}) {
  return new ie({
    view(e) {
      return new Lv(e, n);
    }
  });
}
class Lv {
  constructor(e, t) {
    var r;
    this.editorView = e, this.cursorPos = null, this.element = null, this.timeout = -1, this.lastDragEvent = null, this.width = (r = t.width) !== null && r !== void 0 ? r : 1, this.color = t.color === !1 ? void 0 : t.color || "black", this.class = t.class, this.handlers = ["dragover", "dragend", "drop", "dragleave"].map((i) => {
      let o = (s) => {
        this[i](s);
      };
      return e.dom.addEventListener(i, o), { name: i, handler: o };
    });
  }
  destroy() {
    this.handlers.forEach(({ name: e, handler: t }) => this.editorView.dom.removeEventListener(e, t));
  }
  update(e, t) {
    if (this.cursorPos != null && t.doc != e.state.doc)
      if (this.lastDragEvent) {
        let r = this.computeTarget(this.lastDragEvent);
        r == this.cursorPos ? this.updateOverlay() : this.setCursor(r);
      } else
        this.updateOverlay();
  }
  setCursor(e) {
    e != this.cursorPos && (this.cursorPos = e, e == null ? (this.element.parentNode.removeChild(this.element), this.element = null) : this.updateOverlay());
  }
  updateOverlay() {
    let e = this.editorView.state.doc.resolve(this.cursorPos), t = !e.parent.inlineContent, r, i = this.editorView.dom, o = i.getBoundingClientRect(), s = o.width / i.offsetWidth, l = o.height / i.offsetHeight;
    if (t) {
      let d = e.nodeBefore, f = e.nodeAfter;
      if (d || f) {
        let h = this.editorView.nodeDOM(this.cursorPos - (d ? d.nodeSize : 0));
        if (h) {
          let p = h.getBoundingClientRect(), m = d ? p.bottom : p.top;
          d && f && (m = (m + this.editorView.nodeDOM(this.cursorPos).getBoundingClientRect().top) / 2);
          let g = this.width / 2 * l;
          r = { left: p.left, right: p.right, top: m - g, bottom: m + g };
        }
      }
    }
    if (!r) {
      let d = this.editorView.coordsAtPos(this.cursorPos), f = this.width / 2 * s;
      r = { left: d.left - f, right: d.left + f, top: d.top, bottom: d.bottom };
    }
    let a = this.editorView.dom.offsetParent;
    this.element || (this.element = a.appendChild(document.createElement("div")), this.class && (this.element.className = this.class), this.element.style.cssText = "position: absolute; z-index: 50; pointer-events: none;", this.color && (this.element.style.backgroundColor = this.color)), this.element.classList.toggle("prosemirror-dropcursor-block", t), this.element.classList.toggle("prosemirror-dropcursor-inline", !t);
    let c, u;
    if (!a || a == document.body && getComputedStyle(a).position == "static")
      c = -pageXOffset, u = -pageYOffset;
    else {
      let d = a.getBoundingClientRect(), f = d.width / a.offsetWidth, h = d.height / a.offsetHeight;
      c = d.left - a.scrollLeft * f, u = d.top - a.scrollTop * h;
    }
    this.element.style.left = (r.left - c) / s + "px", this.element.style.top = (r.top - u) / l + "px", this.element.style.width = (r.right - r.left) / s + "px", this.element.style.height = (r.bottom - r.top) / l + "px";
  }
  scheduleRemoval(e) {
    clearTimeout(this.timeout), this.timeout = setTimeout(() => this.setCursor(null), e);
  }
  computeTarget(e) {
    let t = this.editorView.posAtCoords({ left: e.clientX, top: e.clientY }), r = t && t.inside >= 0 && this.editorView.state.doc.nodeAt(t.inside), i = r && r.type.spec.disableDropCursor, o = typeof i == "function" ? i(this.editorView, t, e) : i;
    if (!t || o)
      return null;
    let s = t.pos;
    if (this.editorView.dragging && this.editorView.dragging.slice) {
      let l = Xu(this.editorView.state.doc, s, this.editorView.dragging.slice);
      l != null && (s = l);
    }
    return s;
  }
  dragover(e) {
    if (!this.editorView.editable)
      return;
    this.lastDragEvent = e;
    let t = this.computeTarget(e);
    t != null && (this.setCursor(t), this.scheduleRemoval(5e3));
  }
  dragend() {
    this.scheduleRemoval(20);
  }
  drop() {
    this.scheduleRemoval(20);
  }
  dragleave(e) {
    this.editorView.dom.contains(e.relatedTarget) || this.setCursor(null);
  }
}
const Pv = ge.create({
  name: "dropCursor",
  addOptions() {
    return {
      color: "currentColor",
      width: 1,
      class: void 0
    };
  },
  addProseMirrorPlugins() {
    return [
      Iv(this.options)
    ];
  }
});
class le extends H {
  /**
  Create a gap cursor.
  */
  constructor(e) {
    super(e, e);
  }
  map(e, t) {
    let r = e.resolve(t.map(this.head));
    return le.valid(r) ? new le(r) : H.near(r);
  }
  content() {
    return A.empty;
  }
  eq(e) {
    return e instanceof le && e.head == this.head;
  }
  toJSON() {
    return { type: "gapcursor", pos: this.head };
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.pos != "number")
      throw new RangeError("Invalid input for GapCursor.fromJSON");
    return new le(e.resolve(t.pos));
  }
  /**
  @internal
  */
  getBookmark() {
    return new ua(this.anchor);
  }
  /**
  @internal
  */
  static valid(e) {
    let t = e.parent;
    if (t.inlineContent || !Bv(e) || !Hv(e))
      return !1;
    let r = t.type.spec.allowGapCursor;
    if (r != null)
      return r;
    let i = t.contentMatchAt(e.index()).defaultType;
    return i && i.isTextblock;
  }
  /**
  @internal
  */
  static findGapCursorFrom(e, t, r = !1) {
    e: for (; ; ) {
      if (!r && le.valid(e))
        return e;
      let i = e.pos, o = null;
      for (let s = e.depth; ; s--) {
        let l = e.node(s);
        if (t > 0 ? e.indexAfter(s) < l.childCount : e.index(s) > 0) {
          o = l.child(t > 0 ? e.indexAfter(s) : e.index(s) - 1);
          break;
        } else if (s == 0)
          return null;
        i += t;
        let a = e.doc.resolve(i);
        if (le.valid(a))
          return a;
      }
      for (; ; ) {
        let s = t > 0 ? o.firstChild : o.lastChild;
        if (!s) {
          if (o.isAtom && !o.isText && !P.isSelectable(o)) {
            e = e.doc.resolve(i + o.nodeSize * t), r = !1;
            continue e;
          }
          break;
        }
        o = s, i += t;
        let l = e.doc.resolve(i);
        if (le.valid(l))
          return l;
      }
      return null;
    }
  }
}
le.prototype.visible = !1;
le.findFrom = le.findGapCursorFrom;
H.jsonID("gapcursor", le);
class ua {
  constructor(e) {
    this.pos = e;
  }
  map(e) {
    return new ua(e.map(this.pos));
  }
  resolve(e) {
    let t = e.resolve(this.pos);
    return le.valid(t) ? new le(t) : H.near(t);
  }
}
function zf(n) {
  return n.isAtom || n.spec.isolating || n.spec.createGapCursor;
}
function Bv(n) {
  for (let e = n.depth; e >= 0; e--) {
    let t = n.index(e), r = n.node(e);
    if (t == 0) {
      if (r.type.spec.isolating)
        return !0;
      continue;
    }
    for (let i = r.child(t - 1); ; i = i.lastChild) {
      if (i.childCount == 0 && !i.inlineContent || zf(i.type))
        return !0;
      if (i.inlineContent)
        return !1;
    }
  }
  return !0;
}
function Hv(n) {
  for (let e = n.depth; e >= 0; e--) {
    let t = n.indexAfter(e), r = n.node(e);
    if (t == r.childCount) {
      if (r.type.spec.isolating)
        return !0;
      continue;
    }
    for (let i = r.child(t); ; i = i.firstChild) {
      if (i.childCount == 0 && !i.inlineContent || zf(i.type))
        return !0;
      if (i.inlineContent)
        return !1;
    }
  }
  return !0;
}
function zv() {
  return new ie({
    props: {
      decorations: jv,
      createSelectionBetween(n, e, t) {
        return e.pos == t.pos && le.valid(t) ? new le(t) : null;
      },
      handleClick: Fv,
      handleKeyDown: $v,
      handleDOMEvents: { beforeinput: Vv }
    }
  });
}
const $v = Wl({
  ArrowLeft: Ri("horiz", -1),
  ArrowRight: Ri("horiz", 1),
  ArrowUp: Ri("vert", -1),
  ArrowDown: Ri("vert", 1)
});
function Ri(n, e) {
  const t = n == "vert" ? e > 0 ? "down" : "up" : e > 0 ? "right" : "left";
  return function(r, i, o) {
    let s = r.selection, l = e > 0 ? s.$to : s.$from, a = s.empty;
    if (s instanceof L) {
      if (!o.endOfTextblock(t) || l.depth == 0)
        return !1;
      a = !1, l = r.doc.resolve(e > 0 ? l.after() : l.before());
    }
    let c = le.findGapCursorFrom(l, e, a);
    return c ? (i && i(r.tr.setSelection(new le(c))), !0) : !1;
  };
}
function Fv(n, e, t) {
  if (!n || !n.editable)
    return !1;
  let r = n.state.doc.resolve(e);
  if (!le.valid(r))
    return !1;
  let i = n.posAtCoords({ left: t.clientX, top: t.clientY });
  return i && i.inside > -1 && P.isSelectable(n.state.doc.nodeAt(i.inside)) ? !1 : (n.dispatch(n.state.tr.setSelection(new le(r))), !0);
}
function Vv(n, e) {
  if (e.inputType != "insertCompositionText" || !(n.state.selection instanceof le))
    return !1;
  let { $from: t } = n.state.selection, r = t.parent.contentMatchAt(t.index()).findWrapping(n.state.schema.nodes.text);
  if (!r)
    return !1;
  let i = C.empty;
  for (let s = r.length - 1; s >= 0; s--)
    i = C.from(r[s].createAndFill(null, i));
  let o = n.state.tr.replace(t.pos, t.pos, new A(i, 0, 0));
  return o.setSelection(L.near(o.doc.resolve(t.pos + 1))), n.dispatch(o), !1;
}
function jv(n) {
  if (!(n.selection instanceof le))
    return null;
  let e = document.createElement("div");
  return e.className = "ProseMirror-gapcursor", ee.create(n.doc, [me.widget(n.selection.head, e, { key: "gapcursor" })]);
}
const Wv = ge.create({
  name: "gapCursor",
  addProseMirrorPlugins() {
    return [
      zv()
    ];
  },
  extendNodeSchema(n) {
    var e;
    const t = {
      name: n.name,
      options: n.options,
      storage: n.storage
    };
    return {
      allowGapCursor: (e = V(D(n, "allowGapCursor", t))) !== null && e !== void 0 ? e : null
    };
  }
}), _v = ce.create({
  name: "hardBreak",
  addOptions() {
    return {
      keepMarks: !0,
      HTMLAttributes: {}
    };
  },
  inline: !0,
  group: "inline",
  selectable: !1,
  linebreakReplacement: !0,
  parseHTML() {
    return [
      { tag: "br" }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["br", Y(this.options.HTMLAttributes, n)];
  },
  renderText() {
    return `
`;
  },
  addCommands() {
    return {
      setHardBreak: () => ({ commands: n, chain: e, state: t, editor: r }) => n.first([
        () => n.exitCode(),
        () => n.command(() => {
          const { selection: i, storedMarks: o } = t;
          if (i.$from.parent.type.spec.isolating)
            return !1;
          const { keepMarks: s } = this.options, { splittableMarks: l } = r.extensionManager, a = o || i.$to.parentOffset && i.$from.marks();
          return e().insertContent({ type: this.name }).command(({ tr: c, dispatch: u }) => {
            if (u && a && s) {
              const d = a.filter((f) => l.includes(f.type.name));
              c.ensureMarks(d);
            }
            return !0;
          }).run();
        })
      ])
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Enter": () => this.editor.commands.setHardBreak(),
      "Shift-Enter": () => this.editor.commands.setHardBreak()
    };
  }
}), Uv = ce.create({
  name: "heading",
  addOptions() {
    return {
      levels: [1, 2, 3, 4, 5, 6],
      HTMLAttributes: {}
    };
  },
  content: "inline*",
  group: "block",
  defining: !0,
  addAttributes() {
    return {
      level: {
        default: 1,
        rendered: !1
      }
    };
  },
  parseHTML() {
    return this.options.levels.map((n) => ({
      tag: `h${n}`,
      attrs: { level: n }
    }));
  },
  renderHTML({ node: n, HTMLAttributes: e }) {
    return [`h${this.options.levels.includes(n.attrs.level) ? n.attrs.level : this.options.levels[0]}`, Y(this.options.HTMLAttributes, e), 0];
  },
  addCommands() {
    return {
      setHeading: (n) => ({ commands: e }) => this.options.levels.includes(n.level) ? e.setNode(this.name, n) : !1,
      toggleHeading: (n) => ({ commands: e }) => this.options.levels.includes(n.level) ? e.toggleNode(this.name, "paragraph", n) : !1
    };
  },
  addKeyboardShortcuts() {
    return this.options.levels.reduce((n, e) => ({
      ...n,
      [`Mod-Alt-${e}`]: () => this.editor.commands.toggleHeading({ level: e })
    }), {});
  },
  addInputRules() {
    return this.options.levels.map((n) => sl({
      find: new RegExp(`^(#{${Math.min(...this.options.levels)},${n}})\\s$`),
      type: this.type,
      getAttributes: {
        level: n
      }
    }));
  }
});
var ho = 200, be = function() {
};
be.prototype.append = function(e) {
  return e.length ? (e = be.from(e), !this.length && e || e.length < ho && this.leafAppend(e) || this.length < ho && e.leafPrepend(this) || this.appendInner(e)) : this;
};
be.prototype.prepend = function(e) {
  return e.length ? be.from(e).append(this) : this;
};
be.prototype.appendInner = function(e) {
  return new Kv(this, e);
};
be.prototype.slice = function(e, t) {
  return e === void 0 && (e = 0), t === void 0 && (t = this.length), e >= t ? be.empty : this.sliceInner(Math.max(0, e), Math.min(this.length, t));
};
be.prototype.get = function(e) {
  if (!(e < 0 || e >= this.length))
    return this.getInner(e);
};
be.prototype.forEach = function(e, t, r) {
  t === void 0 && (t = 0), r === void 0 && (r = this.length), t <= r ? this.forEachInner(e, t, r, 0) : this.forEachInvertedInner(e, t, r, 0);
};
be.prototype.map = function(e, t, r) {
  t === void 0 && (t = 0), r === void 0 && (r = this.length);
  var i = [];
  return this.forEach(function(o, s) {
    return i.push(e(o, s));
  }, t, r), i;
};
be.from = function(e) {
  return e instanceof be ? e : e && e.length ? new $f(e) : be.empty;
};
var $f = /* @__PURE__ */ function(n) {
  function e(r) {
    n.call(this), this.values = r;
  }
  n && (e.__proto__ = n), e.prototype = Object.create(n && n.prototype), e.prototype.constructor = e;
  var t = { length: { configurable: !0 }, depth: { configurable: !0 } };
  return e.prototype.flatten = function() {
    return this.values;
  }, e.prototype.sliceInner = function(i, o) {
    return i == 0 && o == this.length ? this : new e(this.values.slice(i, o));
  }, e.prototype.getInner = function(i) {
    return this.values[i];
  }, e.prototype.forEachInner = function(i, o, s, l) {
    for (var a = o; a < s; a++)
      if (i(this.values[a], l + a) === !1)
        return !1;
  }, e.prototype.forEachInvertedInner = function(i, o, s, l) {
    for (var a = o - 1; a >= s; a--)
      if (i(this.values[a], l + a) === !1)
        return !1;
  }, e.prototype.leafAppend = function(i) {
    if (this.length + i.length <= ho)
      return new e(this.values.concat(i.flatten()));
  }, e.prototype.leafPrepend = function(i) {
    if (this.length + i.length <= ho)
      return new e(i.flatten().concat(this.values));
  }, t.length.get = function() {
    return this.values.length;
  }, t.depth.get = function() {
    return 0;
  }, Object.defineProperties(e.prototype, t), e;
}(be);
be.empty = new $f([]);
var Kv = /* @__PURE__ */ function(n) {
  function e(t, r) {
    n.call(this), this.left = t, this.right = r, this.length = t.length + r.length, this.depth = Math.max(t.depth, r.depth) + 1;
  }
  return n && (e.__proto__ = n), e.prototype = Object.create(n && n.prototype), e.prototype.constructor = e, e.prototype.flatten = function() {
    return this.left.flatten().concat(this.right.flatten());
  }, e.prototype.getInner = function(r) {
    return r < this.left.length ? this.left.get(r) : this.right.get(r - this.left.length);
  }, e.prototype.forEachInner = function(r, i, o, s) {
    var l = this.left.length;
    if (i < l && this.left.forEachInner(r, i, Math.min(o, l), s) === !1 || o > l && this.right.forEachInner(r, Math.max(i - l, 0), Math.min(this.length, o) - l, s + l) === !1)
      return !1;
  }, e.prototype.forEachInvertedInner = function(r, i, o, s) {
    var l = this.left.length;
    if (i > l && this.right.forEachInvertedInner(r, i - l, Math.max(o, l) - l, s + l) === !1 || o < l && this.left.forEachInvertedInner(r, Math.min(i, l), o, s) === !1)
      return !1;
  }, e.prototype.sliceInner = function(r, i) {
    if (r == 0 && i == this.length)
      return this;
    var o = this.left.length;
    return i <= o ? this.left.slice(r, i) : r >= o ? this.right.slice(r - o, i - o) : this.left.slice(r, o).append(this.right.slice(0, i - o));
  }, e.prototype.leafAppend = function(r) {
    var i = this.right.leafAppend(r);
    if (i)
      return new e(this.left, i);
  }, e.prototype.leafPrepend = function(r) {
    var i = this.left.leafPrepend(r);
    if (i)
      return new e(i, this.right);
  }, e.prototype.appendInner = function(r) {
    return this.left.depth >= Math.max(this.right.depth, r.depth) + 1 ? new e(this.left, new e(this.right, r)) : new e(this, r);
  }, e;
}(be);
const qv = 500;
class it {
  constructor(e, t) {
    this.items = e, this.eventCount = t;
  }
  // Pop the latest event off the branch's history and apply it
  // to a document transform.
  popEvent(e, t) {
    if (this.eventCount == 0)
      return null;
    let r = this.items.length;
    for (; ; r--)
      if (this.items.get(r - 1).selection) {
        --r;
        break;
      }
    let i, o;
    t && (i = this.remapping(r, this.items.length), o = i.maps.length);
    let s = e.tr, l, a, c = [], u = [];
    return this.items.forEach((d, f) => {
      if (!d.step) {
        i || (i = this.remapping(r, f + 1), o = i.maps.length), o--, u.push(d);
        return;
      }
      if (i) {
        u.push(new at(d.map));
        let h = d.step.map(i.slice(o)), p;
        h && s.maybeStep(h).doc && (p = s.mapping.maps[s.mapping.maps.length - 1], c.push(new at(p, void 0, void 0, c.length + u.length))), o--, p && i.appendMap(p, o);
      } else
        s.maybeStep(d.step);
      if (d.selection)
        return l = i ? d.selection.map(i.slice(o)) : d.selection, a = new it(this.items.slice(0, r).append(u.reverse().concat(c)), this.eventCount - 1), !1;
    }, this.items.length, 0), { remaining: a, transform: s, selection: l };
  }
  // Create a new branch with the given transform added.
  addTransform(e, t, r, i) {
    let o = [], s = this.eventCount, l = this.items, a = !i && l.length ? l.get(l.length - 1) : null;
    for (let u = 0; u < e.steps.length; u++) {
      let d = e.steps[u].invert(e.docs[u]), f = new at(e.mapping.maps[u], d, t), h;
      (h = a && a.merge(f)) && (f = h, u ? o.pop() : l = l.slice(0, l.length - 1)), o.push(f), t && (s++, t = void 0), i || (a = f);
    }
    let c = s - r.depth;
    return c > Gv && (l = Jv(l, c), s -= c), new it(l.append(o), s);
  }
  remapping(e, t) {
    let r = new zr();
    return this.items.forEach((i, o) => {
      let s = i.mirrorOffset != null && o - i.mirrorOffset >= e ? r.maps.length - i.mirrorOffset : void 0;
      r.appendMap(i.map, s);
    }, e, t), r;
  }
  addMaps(e) {
    return this.eventCount == 0 ? this : new it(this.items.append(e.map((t) => new at(t))), this.eventCount);
  }
  // When the collab module receives remote changes, the history has
  // to know about those, so that it can adjust the steps that were
  // rebased on top of the remote changes, and include the position
  // maps for the remote changes in its array of items.
  rebased(e, t) {
    if (!this.eventCount)
      return this;
    let r = [], i = Math.max(0, this.items.length - t), o = e.mapping, s = e.steps.length, l = this.eventCount;
    this.items.forEach((f) => {
      f.selection && l--;
    }, i);
    let a = t;
    this.items.forEach((f) => {
      let h = o.getMirror(--a);
      if (h == null)
        return;
      s = Math.min(s, h);
      let p = o.maps[h];
      if (f.step) {
        let m = e.steps[h].invert(e.docs[h]), g = f.selection && f.selection.map(o.slice(a + 1, h));
        g && l++, r.push(new at(p, m, g));
      } else
        r.push(new at(p));
    }, i);
    let c = [];
    for (let f = t; f < s; f++)
      c.push(new at(o.maps[f]));
    let u = this.items.slice(0, i).append(c).append(r), d = new it(u, l);
    return d.emptyItemCount() > qv && (d = d.compress(this.items.length - r.length)), d;
  }
  emptyItemCount() {
    let e = 0;
    return this.items.forEach((t) => {
      t.step || e++;
    }), e;
  }
  // Compressing a branch means rewriting it to push the air (map-only
  // items) out. During collaboration, these naturally accumulate
  // because each remote change adds one. The `upto` argument is used
  // to ensure that only the items below a given level are compressed,
  // because `rebased` relies on a clean, untouched set of items in
  // order to associate old items with rebased steps.
  compress(e = this.items.length) {
    let t = this.remapping(0, e), r = t.maps.length, i = [], o = 0;
    return this.items.forEach((s, l) => {
      if (l >= e)
        i.push(s), s.selection && o++;
      else if (s.step) {
        let a = s.step.map(t.slice(r)), c = a && a.getMap();
        if (r--, c && t.appendMap(c, r), a) {
          let u = s.selection && s.selection.map(t.slice(r));
          u && o++;
          let d = new at(c.invert(), a, u), f, h = i.length - 1;
          (f = i.length && i[h].merge(d)) ? i[h] = f : i.push(d);
        }
      } else s.map && r--;
    }, this.items.length, 0), new it(be.from(i.reverse()), o);
  }
}
it.empty = new it(be.empty, 0);
function Jv(n, e) {
  let t;
  return n.forEach((r, i) => {
    if (r.selection && e-- == 0)
      return t = i, !1;
  }), n.slice(t);
}
class at {
  constructor(e, t, r, i) {
    this.map = e, this.step = t, this.selection = r, this.mirrorOffset = i;
  }
  merge(e) {
    if (this.step && e.step && !e.selection) {
      let t = e.step.merge(this.step);
      if (t)
        return new at(t.getMap().invert(), t, this.selection);
    }
  }
}
class jt {
  constructor(e, t, r, i, o) {
    this.done = e, this.undone = t, this.prevRanges = r, this.prevTime = i, this.prevComposition = o;
  }
}
const Gv = 20;
function Yv(n, e, t, r) {
  let i = t.getMeta(kn), o;
  if (i)
    return i.historyState;
  t.getMeta(Zv) && (n = new jt(n.done, n.undone, null, 0, -1));
  let s = t.getMeta("appendedTransaction");
  if (t.steps.length == 0)
    return n;
  if (s && s.getMeta(kn))
    return s.getMeta(kn).redo ? new jt(n.done.addTransform(t, void 0, r, qi(e)), n.undone, Gc(t.mapping.maps), n.prevTime, n.prevComposition) : new jt(n.done, n.undone.addTransform(t, void 0, r, qi(e)), null, n.prevTime, n.prevComposition);
  if (t.getMeta("addToHistory") !== !1 && !(s && s.getMeta("addToHistory") === !1)) {
    let l = t.getMeta("composition"), a = n.prevTime == 0 || !s && n.prevComposition != l && (n.prevTime < (t.time || 0) - r.newGroupDelay || !Xv(t, n.prevRanges)), c = s ? Os(n.prevRanges, t.mapping) : Gc(t.mapping.maps);
    return new jt(n.done.addTransform(t, a ? e.selection.getBookmark() : void 0, r, qi(e)), it.empty, c, t.time, l ?? n.prevComposition);
  } else return (o = t.getMeta("rebased")) ? new jt(n.done.rebased(t, o), n.undone.rebased(t, o), Os(n.prevRanges, t.mapping), n.prevTime, n.prevComposition) : new jt(n.done.addMaps(t.mapping.maps), n.undone.addMaps(t.mapping.maps), Os(n.prevRanges, t.mapping), n.prevTime, n.prevComposition);
}
function Xv(n, e) {
  if (!e)
    return !1;
  if (!n.docChanged)
    return !0;
  let t = !1;
  return n.mapping.maps[0].forEach((r, i) => {
    for (let o = 0; o < e.length; o += 2)
      r <= e[o + 1] && i >= e[o] && (t = !0);
  }), t;
}
function Gc(n) {
  let e = [];
  for (let t = n.length - 1; t >= 0 && e.length == 0; t--)
    n[t].forEach((r, i, o, s) => e.push(o, s));
  return e;
}
function Os(n, e) {
  if (!n)
    return null;
  let t = [];
  for (let r = 0; r < n.length; r += 2) {
    let i = e.map(n[r], 1), o = e.map(n[r + 1], -1);
    i <= o && t.push(i, o);
  }
  return t;
}
function Qv(n, e, t) {
  let r = qi(e), i = kn.get(e).spec.config, o = (t ? n.undone : n.done).popEvent(e, r);
  if (!o)
    return null;
  let s = o.selection.resolve(o.transform.doc), l = (t ? n.done : n.undone).addTransform(o.transform, e.selection.getBookmark(), i, r), a = new jt(t ? l : o.remaining, t ? o.remaining : l, null, 0, -1);
  return o.transform.setSelection(s).setMeta(kn, { redo: t, historyState: a });
}
let As = !1, Yc = null;
function qi(n) {
  let e = n.plugins;
  if (Yc != e) {
    As = !1, Yc = e;
    for (let t = 0; t < e.length; t++)
      if (e[t].spec.historyPreserveItems) {
        As = !0;
        break;
      }
  }
  return As;
}
const kn = new ue("history"), Zv = new ue("closeHistory");
function e1(n = {}) {
  return n = {
    depth: n.depth || 100,
    newGroupDelay: n.newGroupDelay || 500
  }, new ie({
    key: kn,
    state: {
      init() {
        return new jt(it.empty, it.empty, null, 0, -1);
      },
      apply(e, t, r) {
        return Yv(t, r, e, n);
      }
    },
    config: n,
    props: {
      handleDOMEvents: {
        beforeinput(e, t) {
          let r = t.inputType, i = r == "historyUndo" ? Vf : r == "historyRedo" ? jf : null;
          return !i || !e.editable ? !1 : (t.preventDefault(), i(e.state, e.dispatch));
        }
      }
    }
  });
}
function Ff(n, e) {
  return (t, r) => {
    let i = kn.getState(t);
    if (!i || (n ? i.undone : i.done).eventCount == 0)
      return !1;
    if (r) {
      let o = Qv(i, t, n);
      o && r(e ? o.scrollIntoView() : o);
    }
    return !0;
  };
}
const Vf = Ff(!1, !0), jf = Ff(!0, !0), t1 = ge.create({
  name: "history",
  addOptions() {
    return {
      depth: 100,
      newGroupDelay: 500
    };
  },
  addCommands() {
    return {
      undo: () => ({ state: n, dispatch: e }) => Vf(n, e),
      redo: () => ({ state: n, dispatch: e }) => jf(n, e)
    };
  },
  addProseMirrorPlugins() {
    return [
      e1(this.options)
    ];
  },
  addKeyboardShortcuts() {
    return {
      "Mod-z": () => this.editor.commands.undo(),
      "Shift-Mod-z": () => this.editor.commands.redo(),
      "Mod-y": () => this.editor.commands.redo(),
      // Russian keyboard layouts
      "Mod-я": () => this.editor.commands.undo(),
      "Shift-Mod-я": () => this.editor.commands.redo()
    };
  }
}), n1 = ce.create({
  name: "horizontalRule",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  group: "block",
  parseHTML() {
    return [{ tag: "hr" }];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["hr", Y(this.options.HTMLAttributes, n)];
  },
  addCommands() {
    return {
      setHorizontalRule: () => ({ chain: n, state: e }) => {
        if (!D0(e, e.schema.nodes[this.name]))
          return !1;
        const { selection: t } = e, { $from: r, $to: i } = t, o = n();
        return r.parentOffset === 0 ? o.insertContentAt({
          from: Math.max(r.pos - 1, 0),
          to: i.pos
        }, {
          type: this.name
        }) : ff(t) ? o.insertContentAt(i.pos, {
          type: this.name
        }) : o.insertContent({ type: this.name }), o.command(({ tr: s, dispatch: l }) => {
          var a;
          if (l) {
            const { $to: c } = s.selection, u = c.end();
            if (c.nodeAfter)
              c.nodeAfter.isTextblock ? s.setSelection(L.create(s.doc, c.pos + 1)) : c.nodeAfter.isBlock ? s.setSelection(P.create(s.doc, c.pos)) : s.setSelection(L.create(s.doc, c.pos));
            else {
              const d = (a = c.parent.type.contentMatch.defaultType) === null || a === void 0 ? void 0 : a.create();
              d && (s.insert(u, d), s.setSelection(L.create(s.doc, u + 1)));
            }
            s.scrollIntoView();
          }
          return !0;
        }).run();
      }
    };
  },
  addInputRules() {
    return [
      pf({
        find: /^(?:---|—-|___\s|\*\*\*\s)$/,
        type: this.type
      })
    ];
  }
}), r1 = /(?:^|\s)(\*(?!\s+\*)((?:[^*]+))\*(?!\s+\*))$/, i1 = /(?:^|\s)(\*(?!\s+\*)((?:[^*]+))\*(?!\s+\*))/g, o1 = /(?:^|\s)(_(?!\s+_)((?:[^_]+))_(?!\s+_))$/, s1 = /(?:^|\s)(_(?!\s+_)((?:[^_]+))_(?!\s+_))/g, l1 = mt.create({
  name: "italic",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  parseHTML() {
    return [
      {
        tag: "em"
      },
      {
        tag: "i",
        getAttrs: (n) => n.style.fontStyle !== "normal" && null
      },
      {
        style: "font-style=normal",
        clearMark: (n) => n.type.name === this.name
      },
      {
        style: "font-style=italic"
      }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["em", Y(this.options.HTMLAttributes, n), 0];
  },
  addCommands() {
    return {
      setItalic: () => ({ commands: n }) => n.setMark(this.name),
      toggleItalic: () => ({ commands: n }) => n.toggleMark(this.name),
      unsetItalic: () => ({ commands: n }) => n.unsetMark(this.name)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-i": () => this.editor.commands.toggleItalic(),
      "Mod-I": () => this.editor.commands.toggleItalic()
    };
  },
  addInputRules() {
    return [
      Gn({
        find: r1,
        type: this.type
      }),
      Gn({
        find: o1,
        type: this.type
      })
    ];
  },
  addPasteRules() {
    return [
      Tn({
        find: i1,
        type: this.type
      }),
      Tn({
        find: s1,
        type: this.type
      })
    ];
  }
}), a1 = ce.create({
  name: "listItem",
  addOptions() {
    return {
      HTMLAttributes: {},
      bulletListTypeName: "bulletList",
      orderedListTypeName: "orderedList"
    };
  },
  content: "paragraph block*",
  defining: !0,
  parseHTML() {
    return [
      {
        tag: "li"
      }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["li", Y(this.options.HTMLAttributes, n), 0];
  },
  addKeyboardShortcuts() {
    return {
      Enter: () => this.editor.commands.splitListItem(this.name),
      Tab: () => this.editor.commands.sinkListItem(this.name),
      "Shift-Tab": () => this.editor.commands.liftListItem(this.name)
    };
  }
}), c1 = "listItem", Xc = "textStyle", Qc = /^(\d+)\.\s$/, u1 = ce.create({
  name: "orderedList",
  addOptions() {
    return {
      itemTypeName: "listItem",
      HTMLAttributes: {},
      keepMarks: !1,
      keepAttributes: !1
    };
  },
  group: "block list",
  content() {
    return `${this.options.itemTypeName}+`;
  },
  addAttributes() {
    return {
      start: {
        default: 1,
        parseHTML: (n) => n.hasAttribute("start") ? parseInt(n.getAttribute("start") || "", 10) : 1
      },
      type: {
        default: null,
        parseHTML: (n) => n.getAttribute("type")
      }
    };
  },
  parseHTML() {
    return [
      {
        tag: "ol"
      }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    const { start: e, ...t } = n;
    return e === 1 ? ["ol", Y(this.options.HTMLAttributes, t), 0] : ["ol", Y(this.options.HTMLAttributes, n), 0];
  },
  addCommands() {
    return {
      toggleOrderedList: () => ({ commands: n, chain: e }) => this.options.keepAttributes ? e().toggleList(this.name, this.options.itemTypeName, this.options.keepMarks).updateAttributes(c1, this.editor.getAttributes(Xc)).run() : n.toggleList(this.name, this.options.itemTypeName, this.options.keepMarks)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Shift-7": () => this.editor.commands.toggleOrderedList()
    };
  },
  addInputRules() {
    let n = Yn({
      find: Qc,
      type: this.type,
      getAttributes: (e) => ({ start: +e[1] }),
      joinPredicate: (e, t) => t.childCount + t.attrs.start === +e[1]
    });
    return (this.options.keepMarks || this.options.keepAttributes) && (n = Yn({
      find: Qc,
      type: this.type,
      keepMarks: this.options.keepMarks,
      keepAttributes: this.options.keepAttributes,
      getAttributes: (e) => ({ start: +e[1], ...this.editor.getAttributes(Xc) }),
      joinPredicate: (e, t) => t.childCount + t.attrs.start === +e[1],
      editor: this.editor
    })), [
      n
    ];
  }
}), d1 = ce.create({
  name: "paragraph",
  priority: 1e3,
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  group: "block",
  content: "inline*",
  parseHTML() {
    return [
      { tag: "p" }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["p", Y(this.options.HTMLAttributes, n), 0];
  },
  addCommands() {
    return {
      setParagraph: () => ({ commands: n }) => n.setNode(this.name)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Alt-0": () => this.editor.commands.setParagraph()
    };
  }
}), f1 = /(?:^|\s)(~~(?!\s+~~)((?:[^~]+))~~(?!\s+~~))$/, h1 = /(?:^|\s)(~~(?!\s+~~)((?:[^~]+))~~(?!\s+~~))/g, p1 = mt.create({
  name: "strike",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  parseHTML() {
    return [
      {
        tag: "s"
      },
      {
        tag: "del"
      },
      {
        tag: "strike"
      },
      {
        style: "text-decoration",
        consuming: !1,
        getAttrs: (n) => n.includes("line-through") ? {} : !1
      }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["s", Y(this.options.HTMLAttributes, n), 0];
  },
  addCommands() {
    return {
      setStrike: () => ({ commands: n }) => n.setMark(this.name),
      toggleStrike: () => ({ commands: n }) => n.toggleMark(this.name),
      unsetStrike: () => ({ commands: n }) => n.unsetMark(this.name)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Shift-s": () => this.editor.commands.toggleStrike()
    };
  },
  addInputRules() {
    return [
      Gn({
        find: f1,
        type: this.type
      })
    ];
  },
  addPasteRules() {
    return [
      Tn({
        find: h1,
        type: this.type
      })
    ];
  }
}), m1 = ce.create({
  name: "text",
  group: "inline"
}), g1 = ge.create({
  name: "starterKit",
  addExtensions() {
    const n = [];
    return this.options.bold !== !1 && n.push(xv.configure(this.options.bold)), this.options.blockquote !== !1 && n.push(bv.configure(this.options.blockquote)), this.options.bulletList !== !1 && n.push(Tv.configure(this.options.bulletList)), this.options.code !== !1 && n.push(Ov.configure(this.options.code)), this.options.codeBlock !== !1 && n.push(Dv.configure(this.options.codeBlock)), this.options.document !== !1 && n.push(Rv.configure(this.options.document)), this.options.dropcursor !== !1 && n.push(Pv.configure(this.options.dropcursor)), this.options.gapcursor !== !1 && n.push(Wv.configure(this.options.gapcursor)), this.options.hardBreak !== !1 && n.push(_v.configure(this.options.hardBreak)), this.options.heading !== !1 && n.push(Uv.configure(this.options.heading)), this.options.history !== !1 && n.push(t1.configure(this.options.history)), this.options.horizontalRule !== !1 && n.push(n1.configure(this.options.horizontalRule)), this.options.italic !== !1 && n.push(l1.configure(this.options.italic)), this.options.listItem !== !1 && n.push(a1.configure(this.options.listItem)), this.options.orderedList !== !1 && n.push(u1.configure(this.options.orderedList)), this.options.paragraph !== !1 && n.push(d1.configure(this.options.paragraph)), this.options.strike !== !1 && n.push(p1.configure(this.options.strike)), this.options.text !== !1 && n.push(m1.configure(this.options.text)), n;
  }
}), y1 = mt.create({
  name: "underline",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  parseHTML() {
    return [
      {
        tag: "u"
      },
      {
        style: "text-decoration",
        consuming: !1,
        getAttrs: (n) => n.includes("underline") ? {} : !1
      }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["u", Y(this.options.HTMLAttributes, n), 0];
  },
  addCommands() {
    return {
      setUnderline: () => ({ commands: n }) => n.setMark(this.name),
      toggleUnderline: () => ({ commands: n }) => n.toggleMark(this.name),
      unsetUnderline: () => ({ commands: n }) => n.unsetMark(this.name)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-u": () => this.editor.commands.toggleUnderline(),
      "Mod-U": () => this.editor.commands.toggleUnderline()
    };
  }
}), b1 = "aaa1rp3bb0ott3vie4c1le2ogado5udhabi7c0ademy5centure6ountant0s9o1tor4d0s1ult4e0g1ro2tna4f0l1rica5g0akhan5ency5i0g1rbus3force5tel5kdn3l0ibaba4pay4lfinanz6state5y2sace3tom5m0azon4ericanexpress7family11x2fam3ica3sterdam8nalytics7droid5quan4z2o0l2partments8p0le4q0uarelle8r0ab1mco4chi3my2pa2t0e3s0da2ia2sociates9t0hleta5torney7u0ction5di0ble3o3spost5thor3o0s4w0s2x0a2z0ure5ba0by2idu3namex4d1k2r0celona5laycard4s5efoot5gains6seball5ketball8uhaus5yern5b0c1t1va3cg1n2d1e0ats2uty4er2rlin4st0buy5t2f1g1h0arti5i0ble3d1ke2ng0o3o1z2j1lack0friday9ockbuster8g1omberg7ue3m0s1w2n0pparibas9o0ats3ehringer8fa2m1nd2o0k0ing5sch2tik2on4t1utique6x2r0adesco6idgestone9oadway5ker3ther5ussels7s1t1uild0ers6siness6y1zz3v1w1y1z0h3ca0b1fe2l0l1vinklein9m0era3p2non3petown5ital0one8r0avan4ds2e0er0s4s2sa1e1h1ino4t0ering5holic7ba1n1re3c1d1enter4o1rn3f0a1d2g1h0anel2nel4rity4se2t2eap3intai5ristmas6ome4urch5i0priani6rcle4sco3tadel4i0c2y3k1l0aims4eaning6ick2nic1que6othing5ud3ub0med6m1n1o0ach3des3ffee4llege4ogne5m0mbank4unity6pany2re3uter5sec4ndos3struction8ulting7tact3ractors9oking4l1p2rsica5untry4pon0s4rses6pa2r0edit0card4union9icket5own3s1uise0s6u0isinella9v1w1x1y0mru3ou3z2dad1nce3ta1e1ing3sun4y2clk3ds2e0al0er2s3gree4livery5l1oitte5ta3mocrat6ntal2ist5si0gn4v2hl2iamonds6et2gital5rect0ory7scount3ver5h2y2j1k1m1np2o0cs1tor4g1mains5t1wnload7rive4tv2ubai3pont4rban5vag2r2z2earth3t2c0o2deka3u0cation8e1g1mail3erck5nergy4gineer0ing9terprises10pson4quipment8r0icsson6ni3s0q1tate5t1u0rovision8s2vents5xchange6pert3osed4ress5traspace10fage2il1rwinds6th3mily4n0s2rm0ers5shion4t3edex3edback6rrari3ero6i0delity5o2lm2nal1nce1ial7re0stone6mdale6sh0ing5t0ness6j1k1lickr3ghts4r2orist4wers5y2m1o0o0d1tball6rd1ex2sale4um3undation8x2r0ee1senius7l1ogans4ntier7tr2ujitsu5n0d2rniture7tbol5yi3ga0l0lery3o1up4me0s3p1rden4y2b0iz3d0n2e0a1nt0ing5orge5f1g0ee3h1i0ft0s3ves2ing5l0ass3e1obal2o4m0ail3bh2o1x2n1odaddy5ld0point6f2odyear5g0le4p1t1v2p1q1r0ainger5phics5tis4een3ipe3ocery4up4s1t1u0cci3ge2ide2tars5ru3w1y2hair2mburg5ngout5us3bo2dfc0bank7ealth0care8lp1sinki6re1mes5iphop4samitsu7tachi5v2k0t2m1n1ockey4ldings5iday5medepot5goods5s0ense7nda3rse3spital5t0ing5t0els3mail5use3w2r1sbc3t1u0ghes5yatt3undai7ibm2cbc2e1u2d1e0ee3fm2kano4l1m0amat4db2mo0bilien9n0c1dustries8finiti5o2g1k1stitute6urance4e4t0ernational10uit4vestments10o1piranga7q1r0ish4s0maili5t0anbul7t0au2v3jaguar4va3cb2e0ep2tzt3welry6io2ll2m0p2nj2o0bs1urg4t1y2p0morgan6rs3uegos4niper7kaufen5ddi3e0rryhotels6properties14fh2g1h1i0a1ds2m1ndle4tchen5wi3m1n1oeln3matsu5sher5p0mg2n2r0d1ed3uokgroup8w1y0oto4z2la0caixa5mborghini8er3nd0rover6xess5salle5t0ino3robe5w0yer5b1c1ds2ease3clerc5frak4gal2o2xus4gbt3i0dl2fe0insurance9style7ghting6ke2lly3mited4o2ncoln4k2ve1ing5k1lc1p2oan0s3cker3us3l1ndon4tte1o3ve3pl0financial11r1s1t0d0a3u0ndbeck6xe1ury5v1y2ma0drid4if1son4keup4n0agement7go3p1rket0ing3s4riott5shalls7ttel5ba2c0kinsey7d1e0d0ia3et2lbourne7me1orial6n0u2rck0msd7g1h1iami3crosoft7l1ni1t2t0subishi9k1l0b1s2m0a2n1o0bi0le4da2e1i1m1nash3ey2ster5rmon3tgage6scow4to0rcycles9v0ie4p1q1r1s0d2t0n1r2u0seum3ic4v1w1x1y1z2na0b1goya4me2vy3ba2c1e0c1t0bank4flix4work5ustar5w0s2xt0direct7us4f0l2g0o2hk2i0co2ke1on3nja3ssan1y5l1o0kia3rton4w0ruz3tv4p1r0a1w2tt2u1yc2z2obi1server7ffice5kinawa6layan0group9lo3m0ega4ne1g1l0ine5oo2pen3racle3nge4g0anic5igins6saka4tsuka4t2vh3pa0ge2nasonic7ris2s1tners4s1y3y2ccw3e0t2f0izer5g1h0armacy6d1ilips5one2to0graphy6s4ysio5ics1tet2ures6d1n0g1k2oneer5zza4k1l0ace2y0station9umbing5s3m1n0c2ohl2ker3litie5rn2st3r0axi3ess3ime3o0d0uctions8f1gressive8mo2perties3y5tection8u0dential9s1t1ub2w0c2y2qa1pon3uebec3st5racing4dio4e0ad1lestate6tor2y4cipes5d0umbrella9hab3ise0n3t2liance6n0t0als5pair3ort3ublican8st0aurant8view0s5xroth6ich0ardli6oh3l1o1p2o0cks3deo3gers4om3s0vp3u0gby3hr2n2w0e2yukyu6sa0arland6fe0ty4kura4le1on3msclub4ung5ndvik0coromant12ofi4p1rl2s1ve2xo3b0i1s2c0b1haeffler7midt4olarships8ol3ule3warz5ience5ot3d1e0arch3t2cure1ity6ek2lect4ner3rvices6ven3w1x0y3fr2g1h0angrila6rp3ell3ia1ksha5oes2p0ping5uji3w3i0lk2na1gles5te3j1k0i0n2y0pe4l0ing4m0art3ile4n0cf3o0ccer3ial4ftbank4ware6hu2lar2utions7ng1y2y2pa0ce3ort2t3r0l2s1t0ada2ples4r1tebank4farm7c0group6ockholm6rage3e3ream4udio2y3yle4u0cks3pplies3y2ort5rf1gery5zuki5v1watch4iss4x1y0dney4stems6z2tab1ipei4lk2obao4rget4tamotors6r2too4x0i3c0i2d0k2eam2ch0nology8l1masek5nnis4va3f1g1h0d1eater2re6iaa2ckets5enda4ps2res2ol4j0maxx4x2k0maxx5l1m0all4n1o0day3kyo3ols3p1ray3shiba5tal3urs3wn2yota3s3r0ade1ing4ining5vel0ers0insurance16ust3v2t1ube2i1nes3shu4v0s2w1z2ua1bank3s2g1k1nicom3versity8o2ol2ps2s1y1z2va0cations7na1guard7c1e0gas3ntures6risign5mögensberater2ung14sicherung10t2g1i0ajes4deo3g1king4llas4n1p1rgin4sa1ion4va1o3laanderen9n1odka3lvo3te1ing3o2yage5u2wales2mart4ter4ng0gou5tch0es6eather0channel12bcam3er2site5d0ding5ibo2r3f1hoswho6ien2ki2lliamhill9n0dows4e1ners6me2oodside6rk0s2ld3w2s1tc1f3xbox3erox4ihuan4n2xx2yz3yachts4hoo3maxun5ndex5e1odobashi7ga2kohama6u0tube6t1un3za0ppos4ra3ero3ip2m1one3uerich6w2", v1 = "ελ1υ2бг1ел3дети4ею2католик6ом3мкд2он1сква6онлайн5рг3рус2ф2сайт3рб3укр3қаз3հայ3ישראל5קום3ابوظبي5رامكو5لاردن4بحرين5جزائر5سعودية6عليان5مغرب5مارات5یران5بارت2زار4يتك3ھارت5تونس4سودان3رية5شبكة4عراق2ب2مان4فلسطين6قطر3كاثوليك6وم3مصر2ليسيا5وريتانيا7قع4همراه5پاکستان7ڀارت4कॉम3नेट3भारत0म्3ोत5संगठन5বাংলা5ভারত2ৰত4ਭਾਰਤ4ભારત4ଭାରତ4இந்தியா6லங்கை6சிங்கப்பூர்11భారత్5ಭಾರತ4ഭാരതം5ලංකා4คอม3ไทย3ລາວ3გე2みんな3アマゾン4クラウド4グーグル4コム2ストア3セール3ファッション6ポイント4世界2中信1国1國1文网3亚马逊3企业2佛山2信息2健康2八卦2公司1益2台湾1灣2商城1店1标2嘉里0大酒店5在线2大拿2天主教3娱乐2家電2广东2微博2慈善2我爱你3手机2招聘2政务1府2新加坡2闻2时尚2書籍2机构2淡马锡3游戏2澳門2点看2移动2组织机构4网址1店1站1络2联通2谷歌2购物2通販2集团2電訊盈科4飞利浦3食品2餐厅2香格里拉3港2닷넷1컴2삼성2한국2", fl = "numeric", hl = "ascii", pl = "alpha", Er = "asciinumeric", yr = "alphanumeric", ml = "domain", Wf = "emoji", w1 = "scheme", k1 = "slashscheme", Ns = "whitespace";
function S1(n, e) {
  return n in e || (e[n] = []), e[n];
}
function hn(n, e, t) {
  e[fl] && (e[Er] = !0, e[yr] = !0), e[hl] && (e[Er] = !0, e[pl] = !0), e[Er] && (e[yr] = !0), e[pl] && (e[yr] = !0), e[yr] && (e[ml] = !0), e[Wf] && (e[ml] = !0);
  for (const r in e) {
    const i = S1(r, t);
    i.indexOf(n) < 0 && i.push(n);
  }
}
function x1(n, e) {
  const t = {};
  for (const r in e)
    e[r].indexOf(n) >= 0 && (t[r] = !0);
  return t;
}
function Pe(n = null) {
  this.j = {}, this.jr = [], this.jd = null, this.t = n;
}
Pe.groups = {};
Pe.prototype = {
  accepts() {
    return !!this.t;
  },
  /**
   * Follow an existing transition from the given input to the next state.
   * Does not mutate.
   * @param {string} input character or token type to transition on
   * @returns {?State<T>} the next state, if any
   */
  go(n) {
    const e = this, t = e.j[n];
    if (t)
      return t;
    for (let r = 0; r < e.jr.length; r++) {
      const i = e.jr[r][0], o = e.jr[r][1];
      if (o && i.test(n))
        return o;
    }
    return e.jd;
  },
  /**
   * Whether the state has a transition for the given input. Set the second
   * argument to true to only look for an exact match (and not a default or
   * regular-expression-based transition)
   * @param {string} input
   * @param {boolean} exactOnly
   */
  has(n, e = !1) {
    return e ? n in this.j : !!this.go(n);
  },
  /**
   * Short for "transition all"; create a transition from the array of items
   * in the given list to the same final resulting state.
   * @param {string | string[]} inputs Group of inputs to transition on
   * @param {Transition<T> | State<T>} [next] Transition options
   * @param {Flags} [flags] Collections flags to add token to
   * @param {Collections<T>} [groups] Master list of token groups
   */
  ta(n, e, t, r) {
    for (let i = 0; i < n.length; i++)
      this.tt(n[i], e, t, r);
  },
  /**
   * Short for "take regexp transition"; defines a transition for this state
   * when it encounters a token which matches the given regular expression
   * @param {RegExp} regexp Regular expression transition (populate first)
   * @param {T | State<T>} [next] Transition options
   * @param {Flags} [flags] Collections flags to add token to
   * @param {Collections<T>} [groups] Master list of token groups
   * @returns {State<T>} taken after the given input
   */
  tr(n, e, t, r) {
    r = r || Pe.groups;
    let i;
    return e && e.j ? i = e : (i = new Pe(e), t && r && hn(e, t, r)), this.jr.push([n, i]), i;
  },
  /**
   * Short for "take transitions", will take as many sequential transitions as
   * the length of the given input and returns the
   * resulting final state.
   * @param {string | string[]} input
   * @param {T | State<T>} [next] Transition options
   * @param {Flags} [flags] Collections flags to add token to
   * @param {Collections<T>} [groups] Master list of token groups
   * @returns {State<T>} taken after the given input
   */
  ts(n, e, t, r) {
    let i = this;
    const o = n.length;
    if (!o)
      return i;
    for (let s = 0; s < o - 1; s++)
      i = i.tt(n[s]);
    return i.tt(n[o - 1], e, t, r);
  },
  /**
   * Short for "take transition", this is a method for building/working with
   * state machines.
   *
   * If a state already exists for the given input, returns it.
   *
   * If a token is specified, that state will emit that token when reached by
   * the linkify engine.
   *
   * If no state exists, it will be initialized with some default transitions
   * that resemble existing default transitions.
   *
   * If a state is given for the second argument, that state will be
   * transitioned to on the given input regardless of what that input
   * previously did.
   *
   * Specify a token group flags to define groups that this token belongs to.
   * The token will be added to corresponding entires in the given groups
   * object.
   *
   * @param {string} input character, token type to transition on
   * @param {T | State<T>} [next] Transition options
   * @param {Flags} [flags] Collections flags to add token to
   * @param {Collections<T>} [groups] Master list of groups
   * @returns {State<T>} taken after the given input
   */
  tt(n, e, t, r) {
    r = r || Pe.groups;
    const i = this;
    if (e && e.j)
      return i.j[n] = e, e;
    const o = e;
    let s, l = i.go(n);
    if (l ? (s = new Pe(), Object.assign(s.j, l.j), s.jr.push.apply(s.jr, l.jr), s.jd = l.jd, s.t = l.t) : s = new Pe(), o) {
      if (r)
        if (s.t && typeof s.t == "string") {
          const a = Object.assign(x1(s.t, r), t);
          hn(o, a, r);
        } else t && hn(o, t, r);
      s.t = o;
    }
    return i.j[n] = s, s;
  }
};
const W = (n, e, t, r, i) => n.ta(e, t, r, i), se = (n, e, t, r, i) => n.tr(e, t, r, i), Zc = (n, e, t, r, i) => n.ts(e, t, r, i), M = (n, e, t, r, i) => n.tt(e, t, r, i), Tt = "WORD", gl = "UWORD", _f = "ASCIINUMERICAL", Uf = "ALPHANUMERICAL", Gr = "LOCALHOST", yl = "TLD", bl = "UTLD", Ji = "SCHEME", Fn = "SLASH_SCHEME", da = "NUM", vl = "WS", fa = "NL", Mr = "OPENBRACE", Or = "CLOSEBRACE", po = "OPENBRACKET", mo = "CLOSEBRACKET", go = "OPENPAREN", yo = "CLOSEPAREN", bo = "OPENANGLEBRACKET", vo = "CLOSEANGLEBRACKET", wo = "FULLWIDTHLEFTPAREN", ko = "FULLWIDTHRIGHTPAREN", So = "LEFTCORNERBRACKET", xo = "RIGHTCORNERBRACKET", Co = "LEFTWHITECORNERBRACKET", To = "RIGHTWHITECORNERBRACKET", Eo = "FULLWIDTHLESSTHAN", Mo = "FULLWIDTHGREATERTHAN", Oo = "AMPERSAND", Ao = "APOSTROPHE", No = "ASTERISK", Wt = "AT", Do = "BACKSLASH", Ro = "BACKTICK", Io = "CARET", pn = "COLON", ha = "COMMA", Lo = "DOLLAR", ct = "DOT", Po = "EQUALS", pa = "EXCLAMATION", Ge = "HYPHEN", Ar = "PERCENT", Bo = "PIPE", Ho = "PLUS", zo = "POUND", Nr = "QUERY", ma = "QUOTE", Kf = "FULLWIDTHMIDDLEDOT", ga = "SEMI", ut = "SLASH", Dr = "TILDE", $o = "UNDERSCORE", qf = "EMOJI", Fo = "SYM";
var Jf = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ALPHANUMERICAL: Uf,
  AMPERSAND: Oo,
  APOSTROPHE: Ao,
  ASCIINUMERICAL: _f,
  ASTERISK: No,
  AT: Wt,
  BACKSLASH: Do,
  BACKTICK: Ro,
  CARET: Io,
  CLOSEANGLEBRACKET: vo,
  CLOSEBRACE: Or,
  CLOSEBRACKET: mo,
  CLOSEPAREN: yo,
  COLON: pn,
  COMMA: ha,
  DOLLAR: Lo,
  DOT: ct,
  EMOJI: qf,
  EQUALS: Po,
  EXCLAMATION: pa,
  FULLWIDTHGREATERTHAN: Mo,
  FULLWIDTHLEFTPAREN: wo,
  FULLWIDTHLESSTHAN: Eo,
  FULLWIDTHMIDDLEDOT: Kf,
  FULLWIDTHRIGHTPAREN: ko,
  HYPHEN: Ge,
  LEFTCORNERBRACKET: So,
  LEFTWHITECORNERBRACKET: Co,
  LOCALHOST: Gr,
  NL: fa,
  NUM: da,
  OPENANGLEBRACKET: bo,
  OPENBRACE: Mr,
  OPENBRACKET: po,
  OPENPAREN: go,
  PERCENT: Ar,
  PIPE: Bo,
  PLUS: Ho,
  POUND: zo,
  QUERY: Nr,
  QUOTE: ma,
  RIGHTCORNERBRACKET: xo,
  RIGHTWHITECORNERBRACKET: To,
  SCHEME: Ji,
  SEMI: ga,
  SLASH: ut,
  SLASH_SCHEME: Fn,
  SYM: Fo,
  TILDE: Dr,
  TLD: yl,
  UNDERSCORE: $o,
  UTLD: bl,
  UWORD: gl,
  WORD: Tt,
  WS: vl
});
const xt = /[a-z]/, fr = new RegExp("\\p{L}", "u"), Ds = new RegExp("\\p{Emoji}", "u"), Ct = /\d/, Rs = /\s/, eu = "\r", Is = `
`, C1 = "️", T1 = "‍", Ls = "￼";
let Ii = null, Li = null;
function E1(n = []) {
  const e = {};
  Pe.groups = e;
  const t = new Pe();
  Ii == null && (Ii = tu(b1)), Li == null && (Li = tu(v1)), M(t, "'", Ao), M(t, "{", Mr), M(t, "}", Or), M(t, "[", po), M(t, "]", mo), M(t, "(", go), M(t, ")", yo), M(t, "<", bo), M(t, ">", vo), M(t, "（", wo), M(t, "）", ko), M(t, "「", So), M(t, "」", xo), M(t, "『", Co), M(t, "』", To), M(t, "＜", Eo), M(t, "＞", Mo), M(t, "&", Oo), M(t, "*", No), M(t, "@", Wt), M(t, "`", Ro), M(t, "^", Io), M(t, ":", pn), M(t, ",", ha), M(t, "$", Lo), M(t, ".", ct), M(t, "=", Po), M(t, "!", pa), M(t, "-", Ge), M(t, "%", Ar), M(t, "|", Bo), M(t, "+", Ho), M(t, "#", zo), M(t, "?", Nr), M(t, '"', ma), M(t, "/", ut), M(t, ";", ga), M(t, "~", Dr), M(t, "_", $o), M(t, "\\", Do), M(t, "・", Kf);
  const r = se(t, Ct, da, {
    [fl]: !0
  });
  se(r, Ct, r);
  const i = se(r, xt, _f, {
    [Er]: !0
  }), o = se(r, fr, Uf, {
    [yr]: !0
  }), s = se(t, xt, Tt, {
    [hl]: !0
  });
  se(s, Ct, i), se(s, xt, s), se(i, Ct, i), se(i, xt, i);
  const l = se(t, fr, gl, {
    [pl]: !0
  });
  se(l, xt), se(l, Ct, o), se(l, fr, l), se(o, Ct, o), se(o, xt), se(o, fr, o);
  const a = M(t, Is, fa, {
    [Ns]: !0
  }), c = M(t, eu, vl, {
    [Ns]: !0
  }), u = se(t, Rs, vl, {
    [Ns]: !0
  });
  M(t, Ls, u), M(c, Is, a), M(c, Ls, u), se(c, Rs, u), M(u, eu), M(u, Is), se(u, Rs, u), M(u, Ls, u);
  const d = se(t, Ds, qf, {
    [Wf]: !0
  });
  M(d, "#"), se(d, Ds, d), M(d, C1, d);
  const f = M(d, T1);
  M(f, "#"), se(f, Ds, d);
  const h = [[xt, s], [Ct, i]], p = [[xt, null], [fr, l], [Ct, o]];
  for (let m = 0; m < Ii.length; m++)
    zt(t, Ii[m], yl, Tt, h);
  for (let m = 0; m < Li.length; m++)
    zt(t, Li[m], bl, gl, p);
  hn(yl, {
    tld: !0,
    ascii: !0
  }, e), hn(bl, {
    utld: !0,
    alpha: !0
  }, e), zt(t, "file", Ji, Tt, h), zt(t, "mailto", Ji, Tt, h), zt(t, "http", Fn, Tt, h), zt(t, "https", Fn, Tt, h), zt(t, "ftp", Fn, Tt, h), zt(t, "ftps", Fn, Tt, h), hn(Ji, {
    scheme: !0,
    ascii: !0
  }, e), hn(Fn, {
    slashscheme: !0,
    ascii: !0
  }, e), n = n.sort((m, g) => m[0] > g[0] ? 1 : -1);
  for (let m = 0; m < n.length; m++) {
    const g = n[m][0], T = n[m][1] ? {
      [w1]: !0
    } : {
      [k1]: !0
    };
    g.indexOf("-") >= 0 ? T[ml] = !0 : xt.test(g) ? Ct.test(g) ? T[Er] = !0 : T[hl] = !0 : T[fl] = !0, Zc(t, g, g, T);
  }
  return Zc(t, "localhost", Gr, {
    ascii: !0
  }), t.jd = new Pe(Fo), {
    start: t,
    tokens: Object.assign({
      groups: e
    }, Jf)
  };
}
function Gf(n, e) {
  const t = M1(e.replace(/[A-Z]/g, (l) => l.toLowerCase())), r = t.length, i = [];
  let o = 0, s = 0;
  for (; s < r; ) {
    let l = n, a = null, c = 0, u = null, d = -1, f = -1;
    for (; s < r && (a = l.go(t[s])); )
      l = a, l.accepts() ? (d = 0, f = 0, u = l) : d >= 0 && (d += t[s].length, f++), c += t[s].length, o += t[s].length, s++;
    o -= d, s -= f, c -= d, i.push({
      t: u.t,
      // token type/name
      v: e.slice(o - c, o),
      // string value
      s: o - c,
      // start index
      e: o
      // end index (excluding)
    });
  }
  return i;
}
function M1(n) {
  const e = [], t = n.length;
  let r = 0;
  for (; r < t; ) {
    let i = n.charCodeAt(r), o, s = i < 55296 || i > 56319 || r + 1 === t || (o = n.charCodeAt(r + 1)) < 56320 || o > 57343 ? n[r] : n.slice(r, r + 2);
    e.push(s), r += s.length;
  }
  return e;
}
function zt(n, e, t, r, i) {
  let o;
  const s = e.length;
  for (let l = 0; l < s - 1; l++) {
    const a = e[l];
    n.j[a] ? o = n.j[a] : (o = new Pe(r), o.jr = i.slice(), n.j[a] = o), n = o;
  }
  return o = new Pe(t), o.jr = i.slice(), n.j[e[s - 1]] = o, o;
}
function tu(n) {
  const e = [], t = [];
  let r = 0, i = "0123456789";
  for (; r < n.length; ) {
    let o = 0;
    for (; i.indexOf(n[r + o]) >= 0; )
      o++;
    if (o > 0) {
      e.push(t.join(""));
      for (let s = parseInt(n.substring(r, r + o), 10); s > 0; s--)
        t.pop();
      r += o;
    } else
      t.push(n[r]), r++;
  }
  return e;
}
const Yr = {
  defaultProtocol: "http",
  events: null,
  format: nu,
  formatHref: nu,
  nl2br: !1,
  tagName: "a",
  target: null,
  rel: null,
  validate: !0,
  truncate: 1 / 0,
  className: null,
  attributes: null,
  ignoreTags: [],
  render: null
};
function ya(n, e = null) {
  let t = Object.assign({}, Yr);
  n && (t = Object.assign(t, n instanceof ya ? n.o : n));
  const r = t.ignoreTags, i = [];
  for (let o = 0; o < r.length; o++)
    i.push(r[o].toUpperCase());
  this.o = t, e && (this.defaultRender = e), this.ignoreTags = i;
}
ya.prototype = {
  o: Yr,
  /**
   * @type string[]
   */
  ignoreTags: [],
  /**
   * @param {IntermediateRepresentation} ir
   * @returns {any}
   */
  defaultRender(n) {
    return n;
  },
  /**
   * Returns true or false based on whether a token should be displayed as a
   * link based on the user options.
   * @param {MultiToken} token
   * @returns {boolean}
   */
  check(n) {
    return this.get("validate", n.toString(), n);
  },
  // Private methods
  /**
   * Resolve an option's value based on the value of the option and the given
   * params. If operator and token are specified and the target option is
   * callable, automatically calls the function with the given argument.
   * @template {keyof Opts} K
   * @param {K} key Name of option to use
   * @param {string} [operator] will be passed to the target option if it's a
   * function. If not specified, RAW function value gets returned
   * @param {MultiToken} [token] The token from linkify.tokenize
   * @returns {Opts[K] | any}
   */
  get(n, e, t) {
    const r = e != null;
    let i = this.o[n];
    return i && (typeof i == "object" ? (i = t.t in i ? i[t.t] : Yr[n], typeof i == "function" && r && (i = i(e, t))) : typeof i == "function" && r && (i = i(e, t.t, t)), i);
  },
  /**
   * @template {keyof Opts} L
   * @param {L} key Name of options object to use
   * @param {string} [operator]
   * @param {MultiToken} [token]
   * @returns {Opts[L] | any}
   */
  getObj(n, e, t) {
    let r = this.o[n];
    return typeof r == "function" && e != null && (r = r(e, t.t, t)), r;
  },
  /**
   * Convert the given token to a rendered element that may be added to the
   * calling-interface's DOM
   * @param {MultiToken} token Token to render to an HTML element
   * @returns {any} Render result; e.g., HTML string, DOM element, React
   *   Component, etc.
   */
  render(n) {
    const e = n.render(this);
    return (this.get("render", null, n) || this.defaultRender)(e, n.t, n);
  }
};
function nu(n) {
  return n;
}
function Yf(n, e) {
  this.t = "token", this.v = n, this.tk = e;
}
Yf.prototype = {
  isLink: !1,
  /**
   * Return the string this token represents.
   * @return {string}
   */
  toString() {
    return this.v;
  },
  /**
   * What should the value for this token be in the `href` HTML attribute?
   * Returns the `.toString` value by default.
   * @param {string} [scheme]
   * @return {string}
   */
  toHref(n) {
    return this.toString();
  },
  /**
   * @param {Options} options Formatting options
   * @returns {string}
   */
  toFormattedString(n) {
    const e = this.toString(), t = n.get("truncate", e, this), r = n.get("format", e, this);
    return t && r.length > t ? r.substring(0, t) + "…" : r;
  },
  /**
   *
   * @param {Options} options
   * @returns {string}
   */
  toFormattedHref(n) {
    return n.get("formatHref", this.toHref(n.get("defaultProtocol")), this);
  },
  /**
   * The start index of this token in the original input string
   * @returns {number}
   */
  startIndex() {
    return this.tk[0].s;
  },
  /**
   * The end index of this token in the original input string (up to this
   * index but not including it)
   * @returns {number}
   */
  endIndex() {
    return this.tk[this.tk.length - 1].e;
  },
  /**
  	Returns an object  of relevant values for this token, which includes keys
  	* type - Kind of token ('url', 'email', etc.)
  	* value - Original text
  	* href - The value that should be added to the anchor tag's href
  		attribute
  		@method toObject
  	@param {string} [protocol] `'http'` by default
  */
  toObject(n = Yr.defaultProtocol) {
    return {
      type: this.t,
      value: this.toString(),
      isLink: this.isLink,
      href: this.toHref(n),
      start: this.startIndex(),
      end: this.endIndex()
    };
  },
  /**
   *
   * @param {Options} options Formatting option
   */
  toFormattedObject(n) {
    return {
      type: this.t,
      value: this.toFormattedString(n),
      isLink: this.isLink,
      href: this.toFormattedHref(n),
      start: this.startIndex(),
      end: this.endIndex()
    };
  },
  /**
   * Whether this token should be rendered as a link according to the given options
   * @param {Options} options
   * @returns {boolean}
   */
  validate(n) {
    return n.get("validate", this.toString(), this);
  },
  /**
   * Return an object that represents how this link should be rendered.
   * @param {Options} options Formattinng options
   */
  render(n) {
    const e = this, t = this.toHref(n.get("defaultProtocol")), r = n.get("formatHref", t, this), i = n.get("tagName", t, e), o = this.toFormattedString(n), s = {}, l = n.get("className", t, e), a = n.get("target", t, e), c = n.get("rel", t, e), u = n.getObj("attributes", t, e), d = n.getObj("events", t, e);
    return s.href = r, l && (s.class = l), a && (s.target = a), c && (s.rel = c), u && Object.assign(s, u), {
      tagName: i,
      attributes: s,
      content: o,
      eventListeners: d
    };
  }
};
function ns(n, e) {
  class t extends Yf {
    constructor(i, o) {
      super(i, o), this.t = n;
    }
  }
  for (const r in e)
    t.prototype[r] = e[r];
  return t.t = n, t;
}
const O1 = ns("email", {
  isLink: !0,
  toHref() {
    return "mailto:" + this.toString();
  }
}), ru = ns("text"), A1 = ns("nl"), Pi = ns("url", {
  isLink: !0,
  /**
  	Lowercases relevant parts of the domain and adds the protocol if
  	required. Note that this will not escape unsafe HTML characters in the
  	URL.
  		@param {string} [scheme] default scheme (e.g., 'https')
  	@return {string} the full href
  */
  toHref(n = Yr.defaultProtocol) {
    return this.hasProtocol() ? this.v : `${n}://${this.v}`;
  },
  /**
   * Check whether this URL token has a protocol
   * @return {boolean}
   */
  hasProtocol() {
    const n = this.tk;
    return n.length >= 2 && n[0].t !== Gr && n[1].t === pn;
  }
}), Je = (n) => new Pe(n);
function N1({
  groups: n
}) {
  const e = n.domain.concat([Oo, No, Wt, Do, Ro, Io, Lo, Po, Ge, da, Ar, Bo, Ho, zo, ut, Fo, Dr, $o]), t = [Ao, pn, ha, ct, pa, Ar, Nr, ma, ga, bo, vo, Mr, Or, mo, po, go, yo, wo, ko, So, xo, Co, To, Eo, Mo], r = [Oo, Ao, No, Do, Ro, Io, Lo, Po, Ge, Mr, Or, Ar, Bo, Ho, zo, Nr, ut, Fo, Dr, $o], i = Je(), o = M(i, Dr);
  W(o, r, o), W(o, n.domain, o);
  const s = Je(), l = Je(), a = Je();
  W(i, n.domain, s), W(i, n.scheme, l), W(i, n.slashscheme, a), W(s, r, o), W(s, n.domain, s);
  const c = M(s, Wt);
  M(o, Wt, c), M(l, Wt, c), M(a, Wt, c);
  const u = M(o, ct);
  W(u, r, o), W(u, n.domain, o);
  const d = Je();
  W(c, n.domain, d), W(d, n.domain, d);
  const f = M(d, ct);
  W(f, n.domain, d);
  const h = Je(O1);
  W(f, n.tld, h), W(f, n.utld, h), M(c, Gr, h);
  const p = M(d, Ge);
  M(p, Ge, p), W(p, n.domain, d), W(h, n.domain, d), M(h, ct, f), M(h, Ge, p);
  const m = M(s, Ge), g = M(s, ct);
  M(m, Ge, m), W(m, n.domain, s), W(g, r, o), W(g, n.domain, s);
  const b = Je(Pi);
  W(g, n.tld, b), W(g, n.utld, b), W(b, n.domain, s), W(b, r, o), M(b, ct, g), M(b, Ge, m), M(b, Wt, c);
  const T = M(b, pn), S = Je(Pi);
  W(T, n.numeric, S);
  const y = Je(Pi), O = Je();
  W(y, e, y), W(y, t, O), W(O, e, y), W(O, t, O), M(b, ut, y), M(S, ut, y);
  const x = M(l, pn), E = M(a, pn), k = M(E, ut), I = M(k, ut);
  W(l, n.domain, s), M(l, ct, g), M(l, Ge, m), W(a, n.domain, s), M(a, ct, g), M(a, Ge, m), W(x, n.domain, y), M(x, ut, y), M(x, Nr, y), W(I, n.domain, y), W(I, e, y), M(I, ut, y);
  const j = [
    [Mr, Or],
    // {}
    [po, mo],
    // []
    [go, yo],
    // ()
    [bo, vo],
    // <>
    [wo, ko],
    // （）
    [So, xo],
    // 「」
    [Co, To],
    // 『』
    [Eo, Mo]
    // ＜＞
  ];
  for (let K = 0; K < j.length; K++) {
    const [B, F] = j[K], Z = M(y, B);
    M(O, B, Z);
    const ne = Je(Pi);
    W(Z, e, ne);
    const X = Je();
    W(Z, t, X), M(Z, F, y), W(ne, e, ne), W(ne, t, X), W(X, e, ne), W(X, t, X), M(ne, F, y), M(X, F, y);
  }
  return M(i, Gr, b), M(i, fa, A1), {
    start: i,
    tokens: Jf
  };
}
function D1(n, e, t) {
  let r = t.length, i = 0, o = [], s = [];
  for (; i < r; ) {
    let l = n, a = null, c = null, u = 0, d = null, f = -1;
    for (; i < r && !(a = l.go(t[i].t)); )
      s.push(t[i++]);
    for (; i < r && (c = a || l.go(t[i].t)); )
      a = null, l = c, l.accepts() ? (f = 0, d = l) : f >= 0 && f++, i++, u++;
    if (f < 0)
      i -= u, i < r && (s.push(t[i]), i++);
    else {
      s.length > 0 && (o.push(Ps(ru, e, s)), s = []), i -= f, u -= f;
      const h = d.t, p = t.slice(i - u, i);
      o.push(Ps(h, e, p));
    }
  }
  return s.length > 0 && o.push(Ps(ru, e, s)), o;
}
function Ps(n, e, t) {
  const r = t[0].s, i = t[t.length - 1].e, o = e.slice(r, i);
  return new n(o, t);
}
const R1 = typeof console < "u" && console && console.warn || (() => {
}), I1 = "until manual call of linkify.init(). Register all schemes and plugins before invoking linkify the first time.", re = {
  scanner: null,
  parser: null,
  tokenQueue: [],
  pluginQueue: [],
  customSchemes: [],
  initialized: !1
};
function L1() {
  return Pe.groups = {}, re.scanner = null, re.parser = null, re.tokenQueue = [], re.pluginQueue = [], re.customSchemes = [], re.initialized = !1, re;
}
function iu(n, e = !1) {
  if (re.initialized && R1(`linkifyjs: already initialized - will not register custom scheme "${n}" ${I1}`), !/^[0-9a-z]+(-[0-9a-z]+)*$/.test(n))
    throw new Error(`linkifyjs: incorrect scheme format.
1. Must only contain digits, lowercase ASCII letters or "-"
2. Cannot start or end with "-"
3. "-" cannot repeat`);
  re.customSchemes.push([n, e]);
}
function P1() {
  re.scanner = E1(re.customSchemes);
  for (let n = 0; n < re.tokenQueue.length; n++)
    re.tokenQueue[n][1]({
      scanner: re.scanner
    });
  re.parser = N1(re.scanner.tokens);
  for (let n = 0; n < re.pluginQueue.length; n++)
    re.pluginQueue[n][1]({
      scanner: re.scanner,
      parser: re.parser
    });
  return re.initialized = !0, re;
}
function ba(n) {
  return re.initialized || P1(), D1(re.parser.start, n, Gf(re.scanner.start, n));
}
ba.scan = Gf;
function Xf(n, e = null, t = null) {
  if (e && typeof e == "object") {
    if (t)
      throw Error(`linkifyjs: Invalid link type ${e}; must be a string`);
    t = e, e = null;
  }
  const r = new ya(t), i = ba(n), o = [];
  for (let s = 0; s < i.length; s++) {
    const l = i[s];
    l.isLink && (!e || l.t === e) && r.check(l) && o.push(l.toFormattedObject(r));
  }
  return o;
}
const va = "[\0-   ᠎ -\u2029 　]", B1 = new RegExp(va), H1 = new RegExp(`${va}$`), z1 = new RegExp(va, "g");
function $1(n) {
  return n.length === 1 ? n[0].isLink : n.length === 3 && n[1].isLink ? ["()", "[]"].includes(n[0].value + n[2].value) : !1;
}
function F1(n) {
  return new ie({
    key: new ue("autolink"),
    appendTransaction: (e, t, r) => {
      const i = e.some((c) => c.docChanged) && !t.doc.eq(r.doc), o = e.some((c) => c.getMeta("preventAutolink"));
      if (!i || o)
        return;
      const { tr: s } = r, l = Ky(t.doc, [...e]);
      if (Qy(l).forEach(({ newRange: c }) => {
        const u = Jy(r.doc, c, (h) => h.isTextblock);
        let d, f;
        if (u.length > 1)
          d = u[0], f = r.doc.textBetween(d.pos, d.pos + d.node.nodeSize, void 0, " ");
        else if (u.length) {
          const h = r.doc.textBetween(c.from, c.to, " ", " ");
          if (!H1.test(h))
            return;
          d = u[0], f = r.doc.textBetween(d.pos, c.to, void 0, " ");
        }
        if (d && f) {
          const h = f.split(B1).filter(Boolean);
          if (h.length <= 0)
            return !1;
          const p = h[h.length - 1], m = d.pos + f.lastIndexOf(p);
          if (!p)
            return !1;
          const g = ba(p).map((b) => b.toObject(n.defaultProtocol));
          if (!$1(g))
            return !1;
          g.filter((b) => b.isLink).map((b) => ({
            ...b,
            from: m + b.start + 1,
            to: m + b.end + 1
          })).filter((b) => r.schema.marks.code ? !r.doc.rangeHasMark(b.from, b.to, r.schema.marks.code) : !0).filter((b) => n.validate(b.value)).filter((b) => n.shouldAutoLink(b.value)).forEach((b) => {
            ta(b.from, b.to, r.doc).some((T) => T.mark.type === n.type) || s.addMark(b.from, b.to, n.type.create({
              href: b.href
            }));
          });
        }
      }), !!s.steps.length)
        return s;
    }
  });
}
function V1(n) {
  return new ie({
    key: new ue("handleClickLink"),
    props: {
      handleClick: (e, t, r) => {
        var i, o;
        if (r.button !== 0 || !e.editable)
          return !1;
        let s = r.target;
        const l = [];
        for (; s.nodeName !== "DIV"; )
          l.push(s), s = s.parentNode;
        if (!l.find((f) => f.nodeName === "A"))
          return !1;
        const a = df(e.state, n.type.name), c = r.target, u = (i = c == null ? void 0 : c.href) !== null && i !== void 0 ? i : a.href, d = (o = c == null ? void 0 : c.target) !== null && o !== void 0 ? o : a.target;
        return c && u ? (window.open(u, d), !0) : !1;
      }
    }
  });
}
function j1(n) {
  return new ie({
    key: new ue("handlePasteLink"),
    props: {
      handlePaste: (e, t, r) => {
        const { state: i } = e, { selection: o } = i, { empty: s } = o;
        if (s)
          return !1;
        let l = "";
        r.content.forEach((c) => {
          l += c.textContent;
        });
        const a = Xf(l, { defaultProtocol: n.defaultProtocol }).find((c) => c.isLink && c.value === l);
        return !l || !a ? !1 : n.editor.commands.setMark(n.type, {
          href: a.href
        });
      }
    }
  });
}
function ln(n, e) {
  const t = [
    "http",
    "https",
    "ftp",
    "ftps",
    "mailto",
    "tel",
    "callto",
    "sms",
    "cid",
    "xmpp"
  ];
  return e && e.forEach((r) => {
    const i = typeof r == "string" ? r : r.scheme;
    i && t.push(i);
  }), !n || n.replace(z1, "").match(new RegExp(
    // eslint-disable-next-line no-useless-escape
    `^(?:(?:${t.join("|")}):|[^a-z]|[a-z0-9+.-]+(?:[^a-z+.-:]|$))`,
    "i"
  ));
}
const W1 = mt.create({
  name: "link",
  priority: 1e3,
  keepOnSplit: !1,
  exitable: !0,
  onCreate() {
    this.options.validate && !this.options.shouldAutoLink && (this.options.shouldAutoLink = this.options.validate, console.warn("The `validate` option is deprecated. Rename to the `shouldAutoLink` option instead.")), this.options.protocols.forEach((n) => {
      if (typeof n == "string") {
        iu(n);
        return;
      }
      iu(n.scheme, n.optionalSlashes);
    });
  },
  onDestroy() {
    L1();
  },
  inclusive() {
    return this.options.autolink;
  },
  addOptions() {
    return {
      openOnClick: !0,
      linkOnPaste: !0,
      autolink: !0,
      protocols: [],
      defaultProtocol: "http",
      HTMLAttributes: {
        target: "_blank",
        rel: "noopener noreferrer nofollow",
        class: null
      },
      isAllowedUri: (n, e) => !!ln(n, e.protocols),
      validate: (n) => !!n,
      shouldAutoLink: (n) => !!n
    };
  },
  addAttributes() {
    return {
      href: {
        default: null,
        parseHTML(n) {
          return n.getAttribute("href");
        }
      },
      target: {
        default: this.options.HTMLAttributes.target
      },
      rel: {
        default: this.options.HTMLAttributes.rel
      },
      class: {
        default: this.options.HTMLAttributes.class
      }
    };
  },
  parseHTML() {
    return [
      {
        tag: "a[href]",
        getAttrs: (n) => {
          const e = n.getAttribute("href");
          return !e || !this.options.isAllowedUri(e, {
            defaultValidate: (t) => !!ln(t, this.options.protocols),
            protocols: this.options.protocols,
            defaultProtocol: this.options.defaultProtocol
          }) ? !1 : null;
        }
      }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return this.options.isAllowedUri(n.href, {
      defaultValidate: (e) => !!ln(e, this.options.protocols),
      protocols: this.options.protocols,
      defaultProtocol: this.options.defaultProtocol
    }) ? ["a", Y(this.options.HTMLAttributes, n), 0] : [
      "a",
      Y(this.options.HTMLAttributes, { ...n, href: "" }),
      0
    ];
  },
  addCommands() {
    return {
      setLink: (n) => ({ chain: e }) => {
        const { href: t } = n;
        return this.options.isAllowedUri(t, {
          defaultValidate: (r) => !!ln(r, this.options.protocols),
          protocols: this.options.protocols,
          defaultProtocol: this.options.defaultProtocol
        }) ? e().setMark(this.name, n).setMeta("preventAutolink", !0).run() : !1;
      },
      toggleLink: (n) => ({ chain: e }) => {
        const { href: t } = n;
        return this.options.isAllowedUri(t, {
          defaultValidate: (r) => !!ln(r, this.options.protocols),
          protocols: this.options.protocols,
          defaultProtocol: this.options.defaultProtocol
        }) ? e().toggleMark(this.name, n, { extendEmptyMarkRange: !0 }).setMeta("preventAutolink", !0).run() : !1;
      },
      unsetLink: () => ({ chain: n }) => n().unsetMark(this.name, { extendEmptyMarkRange: !0 }).setMeta("preventAutolink", !0).run()
    };
  },
  addPasteRules() {
    return [
      Tn({
        find: (n) => {
          const e = [];
          if (n) {
            const { protocols: t, defaultProtocol: r } = this.options, i = Xf(n).filter((o) => o.isLink && this.options.isAllowedUri(o.value, {
              defaultValidate: (s) => !!ln(s, t),
              protocols: t,
              defaultProtocol: r
            }));
            i.length && i.forEach((o) => e.push({
              text: o.value,
              data: {
                href: o.href
              },
              index: o.start
            }));
          }
          return e;
        },
        type: this.type,
        getAttributes: (n) => {
          var e;
          return {
            href: (e = n.data) === null || e === void 0 ? void 0 : e.href
          };
        }
      })
    ];
  },
  addProseMirrorPlugins() {
    const n = [], { protocols: e, defaultProtocol: t } = this.options;
    return this.options.autolink && n.push(F1({
      type: this.type,
      defaultProtocol: this.options.defaultProtocol,
      validate: (r) => this.options.isAllowedUri(r, {
        defaultValidate: (i) => !!ln(i, e),
        protocols: e,
        defaultProtocol: t
      }),
      shouldAutoLink: this.options.shouldAutoLink
    })), this.options.openOnClick === !0 && n.push(V1({
      type: this.type
    })), this.options.linkOnPaste && n.push(j1({
      editor: this.editor,
      defaultProtocol: this.options.defaultProtocol,
      type: this.type
    })), n;
  }
}), _1 = ge.create({
  name: "placeholder",
  addOptions() {
    return {
      emptyEditorClass: "is-editor-empty",
      emptyNodeClass: "is-empty",
      placeholder: "Write something …",
      showOnlyWhenEditable: !0,
      showOnlyCurrent: !0,
      includeChildren: !1
    };
  },
  addProseMirrorPlugins() {
    return [
      new ie({
        key: new ue("placeholder"),
        props: {
          decorations: ({ doc: n, selection: e }) => {
            const t = this.editor.isEditable || !this.options.showOnlyWhenEditable, { anchor: r } = e, i = [];
            if (!t)
              return null;
            const o = this.editor.isEmpty;
            return n.descendants((s, l) => {
              const a = r >= l && r <= l + s.nodeSize, c = !s.isLeaf && es(s);
              if ((a || !this.options.showOnlyCurrent) && c) {
                const u = [this.options.emptyNodeClass];
                o && u.push(this.options.emptyEditorClass);
                const d = me.node(l, l + s.nodeSize, {
                  class: u.join(" "),
                  "data-placeholder": typeof this.options.placeholder == "function" ? this.options.placeholder({
                    editor: this.editor,
                    node: s,
                    pos: l,
                    hasAnchor: a
                  }) : this.options.placeholder
                });
                i.push(d);
              }
              return this.options.includeChildren;
            }), ee.create(n, i);
          }
        }
      })
    ];
  }
}), U1 = ce.create({
  name: "taskList",
  addOptions() {
    return {
      itemTypeName: "taskItem",
      HTMLAttributes: {}
    };
  },
  group: "block list",
  content() {
    return `${this.options.itemTypeName}+`;
  },
  parseHTML() {
    return [
      {
        tag: `ul[data-type="${this.name}"]`,
        priority: 51
      }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["ul", Y(this.options.HTMLAttributes, n, { "data-type": this.name }), 0];
  },
  addCommands() {
    return {
      toggleTaskList: () => ({ commands: n }) => n.toggleList(this.name, this.options.itemTypeName)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Shift-9": () => this.editor.commands.toggleTaskList()
    };
  }
}), K1 = /^\s*(\[([( |x])?\])\s$/, q1 = ce.create({
  name: "taskItem",
  addOptions() {
    return {
      nested: !1,
      HTMLAttributes: {},
      taskListTypeName: "taskList",
      a11y: void 0
    };
  },
  content() {
    return this.options.nested ? "paragraph block*" : "paragraph+";
  },
  defining: !0,
  addAttributes() {
    return {
      checked: {
        default: !1,
        keepOnSplit: !1,
        parseHTML: (n) => {
          const e = n.getAttribute("data-checked");
          return e === "" || e === "true";
        },
        renderHTML: (n) => ({
          "data-checked": n.checked
        })
      }
    };
  },
  parseHTML() {
    return [
      {
        tag: `li[data-type="${this.name}"]`,
        priority: 51
      }
    ];
  },
  renderHTML({ node: n, HTMLAttributes: e }) {
    return [
      "li",
      Y(this.options.HTMLAttributes, e, {
        "data-type": this.name
      }),
      [
        "label",
        [
          "input",
          {
            type: "checkbox",
            checked: n.attrs.checked ? "checked" : null
          }
        ],
        ["span"]
      ],
      ["div", 0]
    ];
  },
  addKeyboardShortcuts() {
    const n = {
      Enter: () => this.editor.commands.splitListItem(this.name),
      "Shift-Tab": () => this.editor.commands.liftListItem(this.name)
    };
    return this.options.nested ? {
      ...n,
      Tab: () => this.editor.commands.sinkListItem(this.name)
    } : n;
  },
  addNodeView() {
    return ({ node: n, HTMLAttributes: e, getPos: t, editor: r }) => {
      const i = document.createElement("li"), o = document.createElement("label"), s = document.createElement("span"), l = document.createElement("input"), a = document.createElement("div"), c = () => {
        var u, d;
        l.ariaLabel = ((d = (u = this.options.a11y) === null || u === void 0 ? void 0 : u.checkboxLabel) === null || d === void 0 ? void 0 : d.call(u, n, l.checked)) || `Task item checkbox for ${n.textContent || "empty task item"}`;
      };
      return c(), o.contentEditable = "false", l.type = "checkbox", l.addEventListener("mousedown", (u) => u.preventDefault()), l.addEventListener("change", (u) => {
        if (!r.isEditable && !this.options.onReadOnlyChecked) {
          l.checked = !l.checked;
          return;
        }
        const { checked: d } = u.target;
        r.isEditable && typeof t == "function" && r.chain().focus(void 0, { scrollIntoView: !1 }).command(({ tr: f }) => {
          const h = t();
          if (typeof h != "number")
            return !1;
          const p = f.doc.nodeAt(h);
          return f.setNodeMarkup(h, void 0, {
            ...p == null ? void 0 : p.attrs,
            checked: d
          }), !0;
        }).run(), !r.isEditable && this.options.onReadOnlyChecked && (this.options.onReadOnlyChecked(n, d) || (l.checked = !l.checked));
      }), Object.entries(this.options.HTMLAttributes).forEach(([u, d]) => {
        i.setAttribute(u, d);
      }), i.dataset.checked = n.attrs.checked, l.checked = n.attrs.checked, o.append(l, s), i.append(o, a), Object.entries(e).forEach(([u, d]) => {
        i.setAttribute(u, d);
      }), {
        dom: i,
        contentDOM: a,
        update: (u) => u.type !== this.type ? !1 : (i.dataset.checked = u.attrs.checked, l.checked = u.attrs.checked, c(), !0)
      };
    };
  },
  addInputRules() {
    return [
      Yn({
        find: K1,
        type: this.type,
        getAttributes: (n) => ({
          checked: n[n.length - 1] === "x"
        })
      })
    ];
  }
});
let wl, kl;
if (typeof WeakMap < "u") {
  let n = /* @__PURE__ */ new WeakMap();
  wl = (e) => n.get(e), kl = (e, t) => (n.set(e, t), t);
} else {
  const n = [];
  let t = 0;
  wl = (r) => {
    for (let i = 0; i < n.length; i += 2) if (n[i] == r) return n[i + 1];
  }, kl = (r, i) => (t == 10 && (t = 0), n[t++] = r, n[t++] = i);
}
var ae = class {
  constructor(n, e, t, r) {
    this.width = n, this.height = e, this.map = t, this.problems = r;
  }
  findCell(n) {
    for (let e = 0; e < this.map.length; e++) {
      const t = this.map[e];
      if (t != n) continue;
      const r = e % this.width, i = e / this.width | 0;
      let o = r + 1, s = i + 1;
      for (let l = 1; o < this.width && this.map[e + l] == t; l++) o++;
      for (let l = 1; s < this.height && this.map[e + this.width * l] == t; l++) s++;
      return {
        left: r,
        top: i,
        right: o,
        bottom: s
      };
    }
    throw new RangeError(`No cell with offset ${n} found`);
  }
  colCount(n) {
    for (let e = 0; e < this.map.length; e++) if (this.map[e] == n) return e % this.width;
    throw new RangeError(`No cell with offset ${n} found`);
  }
  nextCell(n, e, t) {
    const { left: r, right: i, top: o, bottom: s } = this.findCell(n);
    return e == "horiz" ? (t < 0 ? r == 0 : i == this.width) ? null : this.map[o * this.width + (t < 0 ? r - 1 : i)] : (t < 0 ? o == 0 : s == this.height) ? null : this.map[r + this.width * (t < 0 ? o - 1 : s)];
  }
  rectBetween(n, e) {
    const { left: t, right: r, top: i, bottom: o } = this.findCell(n), { left: s, right: l, top: a, bottom: c } = this.findCell(e);
    return {
      left: Math.min(t, s),
      top: Math.min(i, a),
      right: Math.max(r, l),
      bottom: Math.max(o, c)
    };
  }
  cellsInRect(n) {
    const e = [], t = {};
    for (let r = n.top; r < n.bottom; r++) for (let i = n.left; i < n.right; i++) {
      const o = r * this.width + i, s = this.map[o];
      t[s] || (t[s] = !0, !(i == n.left && i && this.map[o - 1] == s || r == n.top && r && this.map[o - this.width] == s) && e.push(s));
    }
    return e;
  }
  positionAt(n, e, t) {
    for (let r = 0, i = 0; ; r++) {
      const o = i + t.child(r).nodeSize;
      if (r == n) {
        let s = e + n * this.width;
        const l = (n + 1) * this.width;
        for (; s < l && this.map[s] < i; ) s++;
        return s == l ? o - 1 : this.map[s];
      }
      i = o;
    }
  }
  static get(n) {
    return wl(n) || kl(n, J1(n));
  }
};
function J1(n) {
  if (n.type.spec.tableRole != "table") throw new RangeError("Not a table node: " + n.type.name);
  const e = G1(n), t = n.childCount, r = [];
  let i = 0, o = null;
  const s = [];
  for (let c = 0, u = e * t; c < u; c++) r[c] = 0;
  for (let c = 0, u = 0; c < t; c++) {
    const d = n.child(c);
    u++;
    for (let p = 0; ; p++) {
      for (; i < r.length && r[i] != 0; ) i++;
      if (p == d.childCount) break;
      const m = d.child(p), { colspan: g, rowspan: b, colwidth: T } = m.attrs;
      for (let S = 0; S < b; S++) {
        if (S + c >= t) {
          (o || (o = [])).push({
            type: "overlong_rowspan",
            pos: u,
            n: b - S
          });
          break;
        }
        const y = i + S * e;
        for (let O = 0; O < g; O++) {
          r[y + O] == 0 ? r[y + O] = u : (o || (o = [])).push({
            type: "collision",
            row: c,
            pos: u,
            n: g - O
          });
          const x = T && T[O];
          if (x) {
            const E = (y + O) % e * 2, k = s[E];
            k == null || k != x && s[E + 1] == 1 ? (s[E] = x, s[E + 1] = 1) : k == x && s[E + 1]++;
          }
        }
      }
      i += g, u += m.nodeSize;
    }
    const f = (c + 1) * e;
    let h = 0;
    for (; i < f; ) r[i++] == 0 && h++;
    h && (o || (o = [])).push({
      type: "missing",
      row: c,
      n: h
    }), u++;
  }
  (e === 0 || t === 0) && (o || (o = [])).push({ type: "zero_sized" });
  const l = new ae(e, t, r, o);
  let a = !1;
  for (let c = 0; !a && c < s.length; c += 2) s[c] != null && s[c + 1] < t && (a = !0);
  return a && Y1(l, s, n), l;
}
function G1(n) {
  let e = -1, t = !1;
  for (let r = 0; r < n.childCount; r++) {
    const i = n.child(r);
    let o = 0;
    if (t) for (let s = 0; s < r; s++) {
      const l = n.child(s);
      for (let a = 0; a < l.childCount; a++) {
        const c = l.child(a);
        s + c.attrs.rowspan > r && (o += c.attrs.colspan);
      }
    }
    for (let s = 0; s < i.childCount; s++) {
      const l = i.child(s);
      o += l.attrs.colspan, l.attrs.rowspan > 1 && (t = !0);
    }
    e == -1 ? e = o : e != o && (e = Math.max(e, o));
  }
  return e;
}
function Y1(n, e, t) {
  n.problems || (n.problems = []);
  const r = {};
  for (let i = 0; i < n.map.length; i++) {
    const o = n.map[i];
    if (r[o]) continue;
    r[o] = !0;
    const s = t.nodeAt(o);
    if (!s) throw new RangeError(`No cell with offset ${o} found`);
    let l = null;
    const a = s.attrs;
    for (let c = 0; c < a.colspan; c++) {
      const u = e[(i + c) % n.width * 2];
      u != null && (!a.colwidth || a.colwidth[c] != u) && ((l || (l = X1(a)))[c] = u);
    }
    l && n.problems.unshift({
      type: "colwidth mismatch",
      pos: o,
      colwidth: l
    });
  }
}
function X1(n) {
  if (n.colwidth) return n.colwidth.slice();
  const e = [];
  for (let t = 0; t < n.colspan; t++) e.push(0);
  return e;
}
function Oe(n) {
  let e = n.cached.tableNodeTypes;
  if (!e) {
    e = n.cached.tableNodeTypes = {};
    for (const t in n.nodes) {
      const r = n.nodes[t], i = r.spec.tableRole;
      i && (e[i] = r);
    }
  }
  return e;
}
const Ut = new ue("selectingCells");
function Mn(n) {
  for (let e = n.depth - 1; e > 0; e--) if (n.node(e).type.spec.tableRole == "row") return n.node(0).resolve(n.before(e + 1));
  return null;
}
function Q1(n) {
  for (let e = n.depth; e > 0; e--) {
    const t = n.node(e).type.spec.tableRole;
    if (t === "cell" || t === "header_cell") return n.node(e);
  }
  return null;
}
function st(n) {
  const e = n.selection.$head;
  for (let t = e.depth; t > 0; t--) if (e.node(t).type.spec.tableRole == "row") return !0;
  return !1;
}
function rs(n) {
  const e = n.selection;
  if ("$anchorCell" in e && e.$anchorCell) return e.$anchorCell.pos > e.$headCell.pos ? e.$anchorCell : e.$headCell;
  if ("node" in e && e.node && e.node.type.spec.tableRole == "cell") return e.$anchor;
  const t = Mn(e.$head) || Z1(e.$head);
  if (t) return t;
  throw new RangeError(`No cell found around position ${e.head}`);
}
function Z1(n) {
  for (let e = n.nodeAfter, t = n.pos; e; e = e.firstChild, t++) {
    const r = e.type.spec.tableRole;
    if (r == "cell" || r == "header_cell") return n.doc.resolve(t);
  }
  for (let e = n.nodeBefore, t = n.pos; e; e = e.lastChild, t--) {
    const r = e.type.spec.tableRole;
    if (r == "cell" || r == "header_cell") return n.doc.resolve(t - e.nodeSize);
  }
}
function Sl(n) {
  return n.parent.type.spec.tableRole == "row" && !!n.nodeAfter;
}
function ew(n) {
  return n.node(0).resolve(n.pos + n.nodeAfter.nodeSize);
}
function wa(n, e) {
  return n.depth == e.depth && n.pos >= e.start(-1) && n.pos <= e.end(-1);
}
function Qf(n, e, t) {
  const r = n.node(-1), i = ae.get(r), o = n.start(-1), s = i.nextCell(n.pos - o, e, t);
  return s == null ? null : n.node(0).resolve(o + s);
}
function On(n, e, t = 1) {
  const r = {
    ...n,
    colspan: n.colspan - t
  };
  return r.colwidth && (r.colwidth = r.colwidth.slice(), r.colwidth.splice(e, t), r.colwidth.some((i) => i > 0) || (r.colwidth = null)), r;
}
function Zf(n, e, t = 1) {
  const r = {
    ...n,
    colspan: n.colspan + t
  };
  if (r.colwidth) {
    r.colwidth = r.colwidth.slice();
    for (let i = 0; i < t; i++) r.colwidth.splice(e, 0, 0);
  }
  return r;
}
function tw(n, e, t) {
  const r = Oe(e.type.schema).header_cell;
  for (let i = 0; i < n.height; i++) if (e.nodeAt(n.map[t + i * n.width]).type != r) return !1;
  return !0;
}
var te = class Et extends H {
  constructor(e, t = e) {
    const r = e.node(-1), i = ae.get(r), o = e.start(-1), s = i.rectBetween(e.pos - o, t.pos - o), l = e.node(0), a = i.cellsInRect(s).filter((u) => u != t.pos - o);
    a.unshift(t.pos - o);
    const c = a.map((u) => {
      const d = r.nodeAt(u);
      if (!d) throw new RangeError(`No cell with offset ${u} found`);
      const f = o + u + 1;
      return new nd(l.resolve(f), l.resolve(f + d.content.size));
    });
    super(c[0].$from, c[0].$to, c), this.$anchorCell = e, this.$headCell = t;
  }
  map(e, t) {
    const r = e.resolve(t.map(this.$anchorCell.pos)), i = e.resolve(t.map(this.$headCell.pos));
    if (Sl(r) && Sl(i) && wa(r, i)) {
      const o = this.$anchorCell.node(-1) != r.node(-1);
      return o && this.isRowSelection() ? Et.rowSelection(r, i) : o && this.isColSelection() ? Et.colSelection(r, i) : new Et(r, i);
    }
    return L.between(r, i);
  }
  content() {
    const e = this.$anchorCell.node(-1), t = ae.get(e), r = this.$anchorCell.start(-1), i = t.rectBetween(this.$anchorCell.pos - r, this.$headCell.pos - r), o = {}, s = [];
    for (let a = i.top; a < i.bottom; a++) {
      const c = [];
      for (let u = a * t.width + i.left, d = i.left; d < i.right; d++, u++) {
        const f = t.map[u];
        if (o[f]) continue;
        o[f] = !0;
        const h = t.findCell(f);
        let p = e.nodeAt(f);
        if (!p) throw new RangeError(`No cell with offset ${f} found`);
        const m = i.left - h.left, g = h.right - i.right;
        if (m > 0 || g > 0) {
          let b = p.attrs;
          if (m > 0 && (b = On(b, 0, m)), g > 0 && (b = On(b, b.colspan - g, g)), h.left < i.left) {
            if (p = p.type.createAndFill(b), !p) throw new RangeError(`Could not create cell with attrs ${JSON.stringify(b)}`);
          } else p = p.type.create(b, p.content);
        }
        if (h.top < i.top || h.bottom > i.bottom) {
          const b = {
            ...p.attrs,
            rowspan: Math.min(h.bottom, i.bottom) - Math.max(h.top, i.top)
          };
          h.top < i.top ? p = p.type.createAndFill(b) : p = p.type.create(b, p.content);
        }
        c.push(p);
      }
      s.push(e.child(a).copy(C.from(c)));
    }
    const l = this.isColSelection() && this.isRowSelection() ? e : s;
    return new A(C.from(l), 1, 1);
  }
  replace(e, t = A.empty) {
    const r = e.steps.length, i = this.ranges;
    for (let s = 0; s < i.length; s++) {
      const { $from: l, $to: a } = i[s], c = e.mapping.slice(r);
      e.replace(c.map(l.pos), c.map(a.pos), s ? A.empty : t);
    }
    const o = H.findFrom(e.doc.resolve(e.mapping.slice(r).map(this.to)), -1);
    o && e.setSelection(o);
  }
  replaceWith(e, t) {
    this.replace(e, new A(C.from(t), 0, 0));
  }
  forEachCell(e) {
    const t = this.$anchorCell.node(-1), r = ae.get(t), i = this.$anchorCell.start(-1), o = r.cellsInRect(r.rectBetween(this.$anchorCell.pos - i, this.$headCell.pos - i));
    for (let s = 0; s < o.length; s++) e(t.nodeAt(o[s]), i + o[s]);
  }
  isColSelection() {
    const e = this.$anchorCell.index(-1), t = this.$headCell.index(-1);
    if (Math.min(e, t) > 0) return !1;
    const r = e + this.$anchorCell.nodeAfter.attrs.rowspan, i = t + this.$headCell.nodeAfter.attrs.rowspan;
    return Math.max(r, i) == this.$headCell.node(-1).childCount;
  }
  static colSelection(e, t = e) {
    const r = e.node(-1), i = ae.get(r), o = e.start(-1), s = i.findCell(e.pos - o), l = i.findCell(t.pos - o), a = e.node(0);
    return s.top <= l.top ? (s.top > 0 && (e = a.resolve(o + i.map[s.left])), l.bottom < i.height && (t = a.resolve(o + i.map[i.width * (i.height - 1) + l.right - 1]))) : (l.top > 0 && (t = a.resolve(o + i.map[l.left])), s.bottom < i.height && (e = a.resolve(o + i.map[i.width * (i.height - 1) + s.right - 1]))), new Et(e, t);
  }
  isRowSelection() {
    const e = this.$anchorCell.node(-1), t = ae.get(e), r = this.$anchorCell.start(-1), i = t.colCount(this.$anchorCell.pos - r), o = t.colCount(this.$headCell.pos - r);
    if (Math.min(i, o) > 0) return !1;
    const s = i + this.$anchorCell.nodeAfter.attrs.colspan, l = o + this.$headCell.nodeAfter.attrs.colspan;
    return Math.max(s, l) == t.width;
  }
  eq(e) {
    return e instanceof Et && e.$anchorCell.pos == this.$anchorCell.pos && e.$headCell.pos == this.$headCell.pos;
  }
  static rowSelection(e, t = e) {
    const r = e.node(-1), i = ae.get(r), o = e.start(-1), s = i.findCell(e.pos - o), l = i.findCell(t.pos - o), a = e.node(0);
    return s.left <= l.left ? (s.left > 0 && (e = a.resolve(o + i.map[s.top * i.width])), l.right < i.width && (t = a.resolve(o + i.map[i.width * (l.top + 1) - 1]))) : (l.left > 0 && (t = a.resolve(o + i.map[l.top * i.width])), s.right < i.width && (e = a.resolve(o + i.map[i.width * (s.top + 1) - 1]))), new Et(e, t);
  }
  toJSON() {
    return {
      type: "cell",
      anchor: this.$anchorCell.pos,
      head: this.$headCell.pos
    };
  }
  static fromJSON(e, t) {
    return new Et(e.resolve(t.anchor), e.resolve(t.head));
  }
  static create(e, t, r = t) {
    return new Et(e.resolve(t), e.resolve(r));
  }
  getBookmark() {
    return new nw(this.$anchorCell.pos, this.$headCell.pos);
  }
};
te.prototype.visible = !1;
H.jsonID("cell", te);
var nw = class eh {
  constructor(e, t) {
    this.anchor = e, this.head = t;
  }
  map(e) {
    return new eh(e.map(this.anchor), e.map(this.head));
  }
  resolve(e) {
    const t = e.resolve(this.anchor), r = e.resolve(this.head);
    return t.parent.type.spec.tableRole == "row" && r.parent.type.spec.tableRole == "row" && t.index() < t.parent.childCount && r.index() < r.parent.childCount && wa(t, r) ? new te(t, r) : H.near(r, 1);
  }
};
function rw(n) {
  if (!(n.selection instanceof te)) return null;
  const e = [];
  return n.selection.forEachCell((t, r) => {
    e.push(me.node(r, r + t.nodeSize, { class: "selectedCell" }));
  }), ee.create(n.doc, e);
}
function iw({ $from: n, $to: e }) {
  if (n.pos == e.pos || n.pos < e.pos - 6) return !1;
  let t = n.pos, r = e.pos, i = n.depth;
  for (; i >= 0 && !(n.after(i + 1) < n.end(i)); i--, t++) ;
  for (let o = e.depth; o >= 0 && !(e.before(o + 1) > e.start(o)); o--, r--) ;
  return t == r && /row|table/.test(n.node(i).type.spec.tableRole);
}
function ow({ $from: n, $to: e }) {
  let t, r;
  for (let i = n.depth; i > 0; i--) {
    const o = n.node(i);
    if (o.type.spec.tableRole === "cell" || o.type.spec.tableRole === "header_cell") {
      t = o;
      break;
    }
  }
  for (let i = e.depth; i > 0; i--) {
    const o = e.node(i);
    if (o.type.spec.tableRole === "cell" || o.type.spec.tableRole === "header_cell") {
      r = o;
      break;
    }
  }
  return t !== r && e.parentOffset === 0;
}
function sw(n, e, t) {
  const r = (e || n).selection, i = (e || n).doc;
  let o, s;
  if (r instanceof P && (s = r.node.type.spec.tableRole)) {
    if (s == "cell" || s == "header_cell") o = te.create(i, r.from);
    else if (s == "row") {
      const l = i.resolve(r.from + 1);
      o = te.rowSelection(l, l);
    } else if (!t) {
      const l = ae.get(r.node), a = r.from + 1, c = a + l.map[l.width * l.height - 1];
      o = te.create(i, a + 1, c);
    }
  } else r instanceof L && iw(r) ? o = L.create(i, r.from) : r instanceof L && ow(r) && (o = L.create(i, r.$from.start(), r.$from.end()));
  return o && (e || (e = n.tr)).setSelection(o), e;
}
const lw = new ue("fix-tables");
function th(n, e, t, r) {
  const i = n.childCount, o = e.childCount;
  e: for (let s = 0, l = 0; s < o; s++) {
    const a = e.child(s);
    for (let c = l, u = Math.min(i, s + 3); c < u; c++) if (n.child(c) == a) {
      l = c + 1, t += a.nodeSize;
      continue e;
    }
    r(a, t), l < i && n.child(l).sameMarkup(a) ? th(n.child(l), a, t + 1, r) : a.nodesBetween(0, a.content.size, r, t + 1), t += a.nodeSize;
  }
}
function nh(n, e) {
  let t;
  const r = (i, o) => {
    i.type.spec.tableRole == "table" && (t = aw(n, i, o, t));
  };
  return e ? e.doc != n.doc && th(e.doc, n.doc, 0, r) : n.doc.descendants(r), t;
}
function aw(n, e, t, r) {
  const i = ae.get(e);
  if (!i.problems) return r;
  r || (r = n.tr);
  const o = [];
  for (let a = 0; a < i.height; a++) o.push(0);
  for (let a = 0; a < i.problems.length; a++) {
    const c = i.problems[a];
    if (c.type == "collision") {
      const u = e.nodeAt(c.pos);
      if (!u) continue;
      const d = u.attrs;
      for (let f = 0; f < d.rowspan; f++) o[c.row + f] += c.n;
      r.setNodeMarkup(r.mapping.map(t + 1 + c.pos), null, On(d, d.colspan - c.n, c.n));
    } else if (c.type == "missing") o[c.row] += c.n;
    else if (c.type == "overlong_rowspan") {
      const u = e.nodeAt(c.pos);
      if (!u) continue;
      r.setNodeMarkup(r.mapping.map(t + 1 + c.pos), null, {
        ...u.attrs,
        rowspan: u.attrs.rowspan - c.n
      });
    } else if (c.type == "colwidth mismatch") {
      const u = e.nodeAt(c.pos);
      if (!u) continue;
      r.setNodeMarkup(r.mapping.map(t + 1 + c.pos), null, {
        ...u.attrs,
        colwidth: c.colwidth
      });
    } else if (c.type == "zero_sized") {
      const u = r.mapping.map(t);
      r.delete(u, u + e.nodeSize);
    }
  }
  let s, l;
  for (let a = 0; a < o.length; a++) o[a] && (s == null && (s = a), l = a);
  for (let a = 0, c = t + 1; a < i.height; a++) {
    const u = e.child(a), d = c + u.nodeSize, f = o[a];
    if (f > 0) {
      let h = "cell";
      u.firstChild && (h = u.firstChild.type.spec.tableRole);
      const p = [];
      for (let g = 0; g < f; g++) {
        const b = Oe(n.schema)[h].createAndFill();
        b && p.push(b);
      }
      const m = (a == 0 || s == a - 1) && l == a ? c + 1 : d - 1;
      r.insert(r.mapping.map(m), p);
    }
    c = d;
  }
  return r.setMeta(lw, { fixTables: !0 });
}
function yt(n) {
  const e = n.selection, t = rs(n), r = t.node(-1), i = t.start(-1), o = ae.get(r);
  return {
    ...e instanceof te ? o.rectBetween(e.$anchorCell.pos - i, e.$headCell.pos - i) : o.findCell(t.pos - i),
    tableStart: i,
    map: o,
    table: r
  };
}
function rh(n, { map: e, tableStart: t, table: r }, i) {
  let o = i > 0 ? -1 : 0;
  tw(e, r, i + o) && (o = i == 0 || i == e.width ? null : 0);
  for (let s = 0; s < e.height; s++) {
    const l = s * e.width + i;
    if (i > 0 && i < e.width && e.map[l - 1] == e.map[l]) {
      const a = e.map[l], c = r.nodeAt(a);
      n.setNodeMarkup(n.mapping.map(t + a), null, Zf(c.attrs, i - e.colCount(a))), s += c.attrs.rowspan - 1;
    } else {
      const a = o == null ? Oe(r.type.schema).cell : r.nodeAt(e.map[l + o]).type, c = e.positionAt(s, i, r);
      n.insert(n.mapping.map(t + c), a.createAndFill());
    }
  }
  return n;
}
function cw(n, e) {
  if (!st(n)) return !1;
  if (e) {
    const t = yt(n);
    e(rh(n.tr, t, t.left));
  }
  return !0;
}
function uw(n, e) {
  if (!st(n)) return !1;
  if (e) {
    const t = yt(n);
    e(rh(n.tr, t, t.right));
  }
  return !0;
}
function dw(n, { map: e, table: t, tableStart: r }, i) {
  const o = n.mapping.maps.length;
  for (let s = 0; s < e.height; ) {
    const l = s * e.width + i, a = e.map[l], c = t.nodeAt(a), u = c.attrs;
    if (i > 0 && e.map[l - 1] == a || i < e.width - 1 && e.map[l + 1] == a) n.setNodeMarkup(n.mapping.slice(o).map(r + a), null, On(u, i - e.colCount(a)));
    else {
      const d = n.mapping.slice(o).map(r + a);
      n.delete(d, d + c.nodeSize);
    }
    s += u.rowspan;
  }
}
function fw(n, e) {
  if (!st(n)) return !1;
  if (e) {
    const t = yt(n), r = n.tr;
    if (t.left == 0 && t.right == t.map.width) return !1;
    for (let i = t.right - 1; dw(r, t, i), i != t.left; i--) {
      const o = t.tableStart ? r.doc.nodeAt(t.tableStart - 1) : r.doc;
      if (!o) throw new RangeError("No table found");
      t.table = o, t.map = ae.get(o);
    }
    e(r);
  }
  return !0;
}
function hw(n, e, t) {
  var r;
  const i = Oe(e.type.schema).header_cell;
  for (let o = 0; o < n.width; o++) if (((r = e.nodeAt(n.map[o + t * n.width])) === null || r === void 0 ? void 0 : r.type) != i) return !1;
  return !0;
}
function ih(n, { map: e, tableStart: t, table: r }, i) {
  let o = t;
  for (let c = 0; c < i; c++) o += r.child(c).nodeSize;
  const s = [];
  let l = i > 0 ? -1 : 0;
  hw(e, r, i + l) && (l = i == 0 || i == e.height ? null : 0);
  for (let c = 0, u = e.width * i; c < e.width; c++, u++) if (i > 0 && i < e.height && e.map[u] == e.map[u - e.width]) {
    const d = e.map[u], f = r.nodeAt(d).attrs;
    n.setNodeMarkup(t + d, null, {
      ...f,
      rowspan: f.rowspan + 1
    }), c += f.colspan - 1;
  } else {
    var a;
    const d = l == null ? Oe(r.type.schema).cell : (a = r.nodeAt(e.map[u + l * e.width])) === null || a === void 0 ? void 0 : a.type, f = d == null ? void 0 : d.createAndFill();
    f && s.push(f);
  }
  return n.insert(o, Oe(r.type.schema).row.create(null, s)), n;
}
function pw(n, e) {
  if (!st(n)) return !1;
  if (e) {
    const t = yt(n);
    e(ih(n.tr, t, t.top));
  }
  return !0;
}
function mw(n, e) {
  if (!st(n)) return !1;
  if (e) {
    const t = yt(n);
    e(ih(n.tr, t, t.bottom));
  }
  return !0;
}
function gw(n, { map: e, table: t, tableStart: r }, i) {
  let o = 0;
  for (let c = 0; c < i; c++) o += t.child(c).nodeSize;
  const s = o + t.child(i).nodeSize, l = n.mapping.maps.length;
  n.delete(o + r, s + r);
  const a = /* @__PURE__ */ new Set();
  for (let c = 0, u = i * e.width; c < e.width; c++, u++) {
    const d = e.map[u];
    if (!a.has(d)) {
      if (a.add(d), i > 0 && d == e.map[u - e.width]) {
        const f = t.nodeAt(d).attrs;
        n.setNodeMarkup(n.mapping.slice(l).map(d + r), null, {
          ...f,
          rowspan: f.rowspan - 1
        }), c += f.colspan - 1;
      } else if (i < e.height && d == e.map[u + e.width]) {
        const f = t.nodeAt(d), h = f.attrs, p = f.type.create({
          ...h,
          rowspan: f.attrs.rowspan - 1
        }, f.content), m = e.positionAt(i + 1, c, t);
        n.insert(n.mapping.slice(l).map(r + m), p), c += h.colspan - 1;
      }
    }
  }
}
function yw(n, e) {
  if (!st(n)) return !1;
  if (e) {
    const t = yt(n), r = n.tr;
    if (t.top == 0 && t.bottom == t.map.height) return !1;
    for (let i = t.bottom - 1; gw(r, t, i), i != t.top; i--) {
      const o = t.tableStart ? r.doc.nodeAt(t.tableStart - 1) : r.doc;
      if (!o) throw new RangeError("No table found");
      t.table = o, t.map = ae.get(t.table);
    }
    e(r);
  }
  return !0;
}
function ou(n) {
  const e = n.content;
  return e.childCount == 1 && e.child(0).isTextblock && e.child(0).childCount == 0;
}
function bw({ width: n, height: e, map: t }, r) {
  let i = r.top * n + r.left, o = i, s = (r.bottom - 1) * n + r.left, l = i + (r.right - r.left - 1);
  for (let a = r.top; a < r.bottom; a++) {
    if (r.left > 0 && t[o] == t[o - 1] || r.right < n && t[l] == t[l + 1]) return !0;
    o += n, l += n;
  }
  for (let a = r.left; a < r.right; a++) {
    if (r.top > 0 && t[i] == t[i - n] || r.bottom < e && t[s] == t[s + n]) return !0;
    i++, s++;
  }
  return !1;
}
function su(n, e) {
  const t = n.selection;
  if (!(t instanceof te) || t.$anchorCell.pos == t.$headCell.pos) return !1;
  const r = yt(n), { map: i } = r;
  if (bw(i, r)) return !1;
  if (e) {
    const o = n.tr, s = {};
    let l = C.empty, a, c;
    for (let u = r.top; u < r.bottom; u++) for (let d = r.left; d < r.right; d++) {
      const f = i.map[u * i.width + d], h = r.table.nodeAt(f);
      if (!(s[f] || !h))
        if (s[f] = !0, a == null)
          a = f, c = h;
        else {
          ou(h) || (l = l.append(h.content));
          const p = o.mapping.map(f + r.tableStart);
          o.delete(p, p + h.nodeSize);
        }
    }
    if (a == null || c == null) return !0;
    if (o.setNodeMarkup(a + r.tableStart, null, {
      ...Zf(c.attrs, c.attrs.colspan, r.right - r.left - c.attrs.colspan),
      rowspan: r.bottom - r.top
    }), l.size > 0) {
      const u = a + 1 + c.content.size, d = ou(c) ? a + 1 : u;
      o.replaceWith(d + r.tableStart, u + r.tableStart, l);
    }
    o.setSelection(new te(o.doc.resolve(a + r.tableStart))), e(o);
  }
  return !0;
}
function lu(n, e) {
  const t = Oe(n.schema);
  return vw(({ node: r }) => t[r.type.spec.tableRole])(n, e);
}
function vw(n) {
  return (e, t) => {
    const r = e.selection;
    let i, o;
    if (r instanceof te) {
      if (r.$anchorCell.pos != r.$headCell.pos) return !1;
      i = r.$anchorCell.nodeAfter, o = r.$anchorCell.pos;
    } else {
      var s;
      if (i = Q1(r.$from), !i) return !1;
      o = (s = Mn(r.$from)) === null || s === void 0 ? void 0 : s.pos;
    }
    if (i == null || o == null || i.attrs.colspan == 1 && i.attrs.rowspan == 1) return !1;
    if (t) {
      let l = i.attrs;
      const a = [], c = l.colwidth;
      l.rowspan > 1 && (l = {
        ...l,
        rowspan: 1
      }), l.colspan > 1 && (l = {
        ...l,
        colspan: 1
      });
      const u = yt(e), d = e.tr;
      for (let h = 0; h < u.right - u.left; h++) a.push(c ? {
        ...l,
        colwidth: c && c[h] ? [c[h]] : null
      } : l);
      let f;
      for (let h = u.top; h < u.bottom; h++) {
        let p = u.map.positionAt(h, u.left, u.table);
        h == u.top && (p += i.nodeSize);
        for (let m = u.left, g = 0; m < u.right; m++, g++)
          m == u.left && h == u.top || d.insert(f = d.mapping.map(p + u.tableStart, 1), n({
            node: i,
            row: h,
            col: m
          }).createAndFill(a[g]));
      }
      d.setNodeMarkup(o, n({
        node: i,
        row: u.top,
        col: u.left
      }), a[0]), r instanceof te && d.setSelection(new te(d.doc.resolve(r.$anchorCell.pos), f ? d.doc.resolve(f) : void 0)), t(d);
    }
    return !0;
  };
}
function ww(n, e) {
  return function(t, r) {
    if (!st(t)) return !1;
    const i = rs(t);
    if (i.nodeAfter.attrs[n] === e) return !1;
    if (r) {
      const o = t.tr;
      t.selection instanceof te ? t.selection.forEachCell((s, l) => {
        s.attrs[n] !== e && o.setNodeMarkup(l, null, {
          ...s.attrs,
          [n]: e
        });
      }) : o.setNodeMarkup(i.pos, null, {
        ...i.nodeAfter.attrs,
        [n]: e
      }), r(o);
    }
    return !0;
  };
}
function kw(n) {
  return function(e, t) {
    if (!st(e)) return !1;
    if (t) {
      const r = Oe(e.schema), i = yt(e), o = e.tr, s = i.map.cellsInRect(n == "column" ? {
        left: i.left,
        top: 0,
        right: i.right,
        bottom: i.map.height
      } : n == "row" ? {
        left: 0,
        top: i.top,
        right: i.map.width,
        bottom: i.bottom
      } : i), l = s.map((a) => i.table.nodeAt(a));
      for (let a = 0; a < s.length; a++) l[a].type == r.header_cell && o.setNodeMarkup(i.tableStart + s[a], r.cell, l[a].attrs);
      if (o.steps.length === 0) for (let a = 0; a < s.length; a++) o.setNodeMarkup(i.tableStart + s[a], r.header_cell, l[a].attrs);
      t(o);
    }
    return !0;
  };
}
function au(n, e, t) {
  const r = e.map.cellsInRect({
    left: 0,
    top: 0,
    right: n == "row" ? e.map.width : 1,
    bottom: n == "column" ? e.map.height : 1
  });
  for (let i = 0; i < r.length; i++) {
    const o = e.table.nodeAt(r[i]);
    if (o && o.type !== t.header_cell) return !1;
  }
  return !0;
}
function Xr(n, e) {
  return e = e || { useDeprecatedLogic: !1 }, e.useDeprecatedLogic ? kw(n) : function(t, r) {
    if (!st(t)) return !1;
    if (r) {
      const i = Oe(t.schema), o = yt(t), s = t.tr, l = au("row", o, i), a = au("column", o, i), c = (n === "column" ? l : n === "row" && a) ? 1 : 0, u = n == "column" ? {
        left: 0,
        top: c,
        right: 1,
        bottom: o.map.height
      } : n == "row" ? {
        left: c,
        top: 0,
        right: o.map.width,
        bottom: 1
      } : o, d = n == "column" ? a ? i.cell : i.header_cell : n == "row" ? l ? i.cell : i.header_cell : i.cell;
      o.map.cellsInRect(u).forEach((f) => {
        const h = f + o.tableStart, p = s.doc.nodeAt(h);
        p && s.setNodeMarkup(h, d, p.attrs);
      }), r(s);
    }
    return !0;
  };
}
Xr("row", { useDeprecatedLogic: !0 });
Xr("column", { useDeprecatedLogic: !0 });
const Sw = Xr("cell", { useDeprecatedLogic: !0 });
function xw(n, e) {
  if (e < 0) {
    const t = n.nodeBefore;
    if (t) return n.pos - t.nodeSize;
    for (let r = n.index(-1) - 1, i = n.before(); r >= 0; r--) {
      const o = n.node(-1).child(r), s = o.lastChild;
      if (s) return i - 1 - s.nodeSize;
      i -= o.nodeSize;
    }
  } else {
    if (n.index() < n.parent.childCount - 1) return n.pos + n.nodeAfter.nodeSize;
    const t = n.node(-1);
    for (let r = n.indexAfter(-1), i = n.after(); r < t.childCount; r++) {
      const o = t.child(r);
      if (o.childCount) return i + 1;
      i += o.nodeSize;
    }
  }
  return null;
}
function cu(n) {
  return function(e, t) {
    if (!st(e)) return !1;
    const r = xw(rs(e), n);
    if (r == null) return !1;
    if (t) {
      const i = e.doc.resolve(r);
      t(e.tr.setSelection(L.between(i, ew(i))).scrollIntoView());
    }
    return !0;
  };
}
function Cw(n, e) {
  const t = n.selection.$anchor;
  for (let r = t.depth; r > 0; r--) if (t.node(r).type.spec.tableRole == "table")
    return e && e(n.tr.delete(t.before(r), t.after(r)).scrollIntoView()), !0;
  return !1;
}
function Bi(n, e) {
  const t = n.selection;
  if (!(t instanceof te)) return !1;
  if (e) {
    const r = n.tr, i = Oe(n.schema).cell.createAndFill().content;
    t.forEachCell((o, s) => {
      o.content.eq(i) || r.replace(r.mapping.map(s + 1), r.mapping.map(s + o.nodeSize - 1), new A(i, 0, 0));
    }), r.docChanged && e(r);
  }
  return !0;
}
function Tw(n) {
  if (n.size === 0) return null;
  let { content: e, openStart: t, openEnd: r } = n;
  for (; e.childCount == 1 && (t > 0 && r > 0 || e.child(0).type.spec.tableRole == "table"); )
    t--, r--, e = e.child(0).content;
  const i = e.child(0), o = i.type.spec.tableRole, s = i.type.schema, l = [];
  if (o == "row") for (let a = 0; a < e.childCount; a++) {
    let c = e.child(a).content;
    const u = a ? 0 : Math.max(0, t - 1), d = a < e.childCount - 1 ? 0 : Math.max(0, r - 1);
    (u || d) && (c = xl(Oe(s).row, new A(c, u, d)).content), l.push(c);
  }
  else if (o == "cell" || o == "header_cell") l.push(t || r ? xl(Oe(s).row, new A(e, t, r)).content : e);
  else return null;
  return Ew(s, l);
}
function Ew(n, e) {
  const t = [];
  for (let i = 0; i < e.length; i++) {
    const o = e[i];
    for (let s = o.childCount - 1; s >= 0; s--) {
      const { rowspan: l, colspan: a } = o.child(s).attrs;
      for (let c = i; c < i + l; c++) t[c] = (t[c] || 0) + a;
    }
  }
  let r = 0;
  for (let i = 0; i < t.length; i++) r = Math.max(r, t[i]);
  for (let i = 0; i < t.length; i++)
    if (i >= e.length && e.push(C.empty), t[i] < r) {
      const o = Oe(n).cell.createAndFill(), s = [];
      for (let l = t[i]; l < r; l++) s.push(o);
      e[i] = e[i].append(C.from(s));
    }
  return {
    height: e.length,
    width: r,
    rows: e
  };
}
function xl(n, e) {
  const t = n.createAndFill();
  return new Rl(t).replace(0, t.content.size, e).doc;
}
function Mw({ width: n, height: e, rows: t }, r, i) {
  if (n != r) {
    const o = [], s = [];
    for (let l = 0; l < t.length; l++) {
      const a = t[l], c = [];
      for (let u = o[l] || 0, d = 0; u < r; d++) {
        let f = a.child(d % a.childCount);
        u + f.attrs.colspan > r && (f = f.type.createChecked(On(f.attrs, f.attrs.colspan, u + f.attrs.colspan - r), f.content)), c.push(f), u += f.attrs.colspan;
        for (let h = 1; h < f.attrs.rowspan; h++) o[l + h] = (o[l + h] || 0) + f.attrs.colspan;
      }
      s.push(C.from(c));
    }
    t = s, n = r;
  }
  if (e != i) {
    const o = [];
    for (let s = 0, l = 0; s < i; s++, l++) {
      const a = [], c = t[l % e];
      for (let u = 0; u < c.childCount; u++) {
        let d = c.child(u);
        s + d.attrs.rowspan > i && (d = d.type.create({
          ...d.attrs,
          rowspan: Math.max(1, i - d.attrs.rowspan)
        }, d.content)), a.push(d);
      }
      o.push(C.from(a));
    }
    t = o, e = i;
  }
  return {
    width: n,
    height: e,
    rows: t
  };
}
function Ow(n, e, t, r, i, o, s) {
  const l = n.doc.type.schema, a = Oe(l);
  let c, u;
  if (i > e.width) for (let d = 0, f = 0; d < e.height; d++) {
    const h = t.child(d);
    f += h.nodeSize;
    const p = [];
    let m;
    h.lastChild == null || h.lastChild.type == a.cell ? m = c || (c = a.cell.createAndFill()) : m = u || (u = a.header_cell.createAndFill());
    for (let g = e.width; g < i; g++) p.push(m);
    n.insert(n.mapping.slice(s).map(f - 1 + r), p);
  }
  if (o > e.height) {
    const d = [];
    for (let p = 0, m = (e.height - 1) * e.width; p < Math.max(e.width, i); p++) {
      const g = p >= e.width ? !1 : t.nodeAt(e.map[m + p]).type == a.header_cell;
      d.push(g ? u || (u = a.header_cell.createAndFill()) : c || (c = a.cell.createAndFill()));
    }
    const f = a.row.create(null, C.from(d)), h = [];
    for (let p = e.height; p < o; p++) h.push(f);
    n.insert(n.mapping.slice(s).map(r + t.nodeSize - 2), h);
  }
  return !!(c || u);
}
function uu(n, e, t, r, i, o, s, l) {
  if (s == 0 || s == e.height) return !1;
  let a = !1;
  for (let c = i; c < o; c++) {
    const u = s * e.width + c, d = e.map[u];
    if (e.map[u - e.width] == d) {
      a = !0;
      const f = t.nodeAt(d), { top: h, left: p } = e.findCell(d);
      n.setNodeMarkup(n.mapping.slice(l).map(d + r), null, {
        ...f.attrs,
        rowspan: s - h
      }), n.insert(n.mapping.slice(l).map(e.positionAt(s, p, t)), f.type.createAndFill({
        ...f.attrs,
        rowspan: h + f.attrs.rowspan - s
      })), c += f.attrs.colspan - 1;
    }
  }
  return a;
}
function du(n, e, t, r, i, o, s, l) {
  if (s == 0 || s == e.width) return !1;
  let a = !1;
  for (let c = i; c < o; c++) {
    const u = c * e.width + s, d = e.map[u];
    if (e.map[u - 1] == d) {
      a = !0;
      const f = t.nodeAt(d), h = e.colCount(d), p = n.mapping.slice(l).map(d + r);
      n.setNodeMarkup(p, null, On(f.attrs, s - h, f.attrs.colspan - (s - h))), n.insert(p + f.nodeSize, f.type.createAndFill(On(f.attrs, 0, s - h))), c += f.attrs.rowspan - 1;
    }
  }
  return a;
}
function fu(n, e, t, r, i) {
  let o = t ? n.doc.nodeAt(t - 1) : n.doc;
  if (!o) throw new Error("No table found");
  let s = ae.get(o);
  const { top: l, left: a } = r, c = a + i.width, u = l + i.height, d = n.tr;
  let f = 0;
  function h() {
    if (o = t ? d.doc.nodeAt(t - 1) : d.doc, !o) throw new Error("No table found");
    s = ae.get(o), f = d.mapping.maps.length;
  }
  Ow(d, s, o, t, c, u, f) && h(), uu(d, s, o, t, a, c, l, f) && h(), uu(d, s, o, t, a, c, u, f) && h(), du(d, s, o, t, l, u, a, f) && h(), du(d, s, o, t, l, u, c, f) && h();
  for (let p = l; p < u; p++) {
    const m = s.positionAt(p, a, o), g = s.positionAt(p, c, o);
    d.replace(d.mapping.slice(f).map(m + t), d.mapping.slice(f).map(g + t), new A(i.rows[p - l], 0, 0));
  }
  h(), d.setSelection(new te(d.doc.resolve(t + s.positionAt(l, a, o)), d.doc.resolve(t + s.positionAt(u - 1, c - 1, o)))), e(d);
}
const Aw = Wl({
  ArrowLeft: Hi("horiz", -1),
  ArrowRight: Hi("horiz", 1),
  ArrowUp: Hi("vert", -1),
  ArrowDown: Hi("vert", 1),
  "Shift-ArrowLeft": zi("horiz", -1),
  "Shift-ArrowRight": zi("horiz", 1),
  "Shift-ArrowUp": zi("vert", -1),
  "Shift-ArrowDown": zi("vert", 1),
  Backspace: Bi,
  "Mod-Backspace": Bi,
  Delete: Bi,
  "Mod-Delete": Bi
});
function Gi(n, e, t) {
  return t.eq(n.selection) ? !1 : (e && e(n.tr.setSelection(t).scrollIntoView()), !0);
}
function Hi(n, e) {
  return (t, r, i) => {
    if (!i) return !1;
    const o = t.selection;
    if (o instanceof te) return Gi(t, r, H.near(o.$headCell, e));
    if (n != "horiz" && !o.empty) return !1;
    const s = oh(i, n, e);
    if (s == null) return !1;
    if (n == "horiz") return Gi(t, r, H.near(t.doc.resolve(o.head + e), e));
    {
      const l = t.doc.resolve(s), a = Qf(l, n, e);
      let c;
      return a ? c = H.near(a, 1) : e < 0 ? c = H.near(t.doc.resolve(l.before(-1)), -1) : c = H.near(t.doc.resolve(l.after(-1)), 1), Gi(t, r, c);
    }
  };
}
function zi(n, e) {
  return (t, r, i) => {
    if (!i) return !1;
    const o = t.selection;
    let s;
    if (o instanceof te) s = o;
    else {
      const a = oh(i, n, e);
      if (a == null) return !1;
      s = new te(t.doc.resolve(a));
    }
    const l = Qf(s.$headCell, n, e);
    return l ? Gi(t, r, new te(s.$anchorCell, l)) : !1;
  };
}
function Nw(n, e) {
  const t = n.state.doc, r = Mn(t.resolve(e));
  return r ? (n.dispatch(n.state.tr.setSelection(new te(r))), !0) : !1;
}
function Dw(n, e, t) {
  if (!st(n.state)) return !1;
  let r = Tw(t);
  const i = n.state.selection;
  if (i instanceof te) {
    r || (r = {
      width: 1,
      height: 1,
      rows: [C.from(xl(Oe(n.state.schema).cell, t))]
    });
    const o = i.$anchorCell.node(-1), s = i.$anchorCell.start(-1), l = ae.get(o).rectBetween(i.$anchorCell.pos - s, i.$headCell.pos - s);
    return r = Mw(r, l.right - l.left, l.bottom - l.top), fu(n.state, n.dispatch, s, l, r), !0;
  } else if (r) {
    const o = rs(n.state), s = o.start(-1);
    return fu(n.state, n.dispatch, s, ae.get(o.node(-1)).findCell(o.pos - s), r), !0;
  } else return !1;
}
function Rw(n, e) {
  var t;
  if (e.button != 0 || e.ctrlKey || e.metaKey) return;
  const r = hu(n, e.target);
  let i;
  if (e.shiftKey && n.state.selection instanceof te)
    o(n.state.selection.$anchorCell, e), e.preventDefault();
  else if (e.shiftKey && r && (i = Mn(n.state.selection.$anchor)) != null && ((t = Bs(n, e)) === null || t === void 0 ? void 0 : t.pos) != i.pos)
    o(i, e), e.preventDefault();
  else if (!r) return;
  function o(a, c) {
    let u = Bs(n, c);
    const d = Ut.getState(n.state) == null;
    if (!u || !wa(a, u)) if (d) u = a;
    else return;
    const f = new te(a, u);
    if (d || !n.state.selection.eq(f)) {
      const h = n.state.tr.setSelection(f);
      d && h.setMeta(Ut, a.pos), n.dispatch(h);
    }
  }
  function s() {
    n.root.removeEventListener("mouseup", s), n.root.removeEventListener("dragstart", s), n.root.removeEventListener("mousemove", l), Ut.getState(n.state) != null && n.dispatch(n.state.tr.setMeta(Ut, -1));
  }
  function l(a) {
    const c = a, u = Ut.getState(n.state);
    let d;
    if (u != null) d = n.state.doc.resolve(u);
    else if (hu(n, c.target) != r && (d = Bs(n, e), !d))
      return s();
    d && o(d, c);
  }
  n.root.addEventListener("mouseup", s), n.root.addEventListener("dragstart", s), n.root.addEventListener("mousemove", l);
}
function oh(n, e, t) {
  if (!(n.state.selection instanceof L)) return null;
  const { $head: r } = n.state.selection;
  for (let i = r.depth - 1; i >= 0; i--) {
    const o = r.node(i);
    if ((t < 0 ? r.index(i) : r.indexAfter(i)) != (t < 0 ? 0 : o.childCount)) return null;
    if (o.type.spec.tableRole == "cell" || o.type.spec.tableRole == "header_cell") {
      const s = r.before(i), l = e == "vert" ? t > 0 ? "down" : "up" : t > 0 ? "right" : "left";
      return n.endOfTextblock(l) ? s : null;
    }
  }
  return null;
}
function hu(n, e) {
  for (; e && e != n.dom; e = e.parentNode) if (e.nodeName == "TD" || e.nodeName == "TH") return e;
  return null;
}
function Bs(n, e) {
  const t = n.posAtCoords({
    left: e.clientX,
    top: e.clientY
  });
  if (!t) return null;
  let { inside: r, pos: i } = t;
  return r >= 0 && Mn(n.state.doc.resolve(r)) || Mn(n.state.doc.resolve(i));
}
var Iw = class {
  constructor(e, t) {
    this.node = e, this.defaultCellMinWidth = t, this.dom = document.createElement("div"), this.dom.className = "tableWrapper", this.table = this.dom.appendChild(document.createElement("table")), this.table.style.setProperty("--default-cell-min-width", `${t}px`), this.colgroup = this.table.appendChild(document.createElement("colgroup")), Cl(e, this.colgroup, this.table, t), this.contentDOM = this.table.appendChild(document.createElement("tbody"));
  }
  update(e) {
    return e.type != this.node.type ? !1 : (this.node = e, Cl(e, this.colgroup, this.table, this.defaultCellMinWidth), !0);
  }
  ignoreMutation(e) {
    return e.type == "attributes" && (e.target == this.table || this.colgroup.contains(e.target));
  }
};
function Cl(n, e, t, r, i, o) {
  let s = 0, l = !0, a = e.firstChild;
  const c = n.firstChild;
  if (c) {
    for (let d = 0, f = 0; d < c.childCount; d++) {
      const { colspan: h, colwidth: p } = c.child(d).attrs;
      for (let m = 0; m < h; m++, f++) {
        const g = i == f ? o : p && p[m], b = g ? g + "px" : "";
        if (s += g || r, g || (l = !1), a)
          a.style.width != b && (a.style.width = b), a = a.nextSibling;
        else {
          const T = document.createElement("col");
          T.style.width = b, e.appendChild(T);
        }
      }
    }
    for (; a; ) {
      var u;
      const d = a.nextSibling;
      (u = a.parentNode) === null || u === void 0 || u.removeChild(a), a = d;
    }
    l ? (t.style.width = s + "px", t.style.minWidth = "") : (t.style.width = "", t.style.minWidth = s + "px");
  }
}
const We = new ue("tableColumnResizing");
function Lw({ handleWidth: n = 5, cellMinWidth: e = 25, defaultCellMinWidth: t = 100, View: r = Iw, lastColumnResizable: i = !0 } = {}) {
  const o = new ie({
    key: We,
    state: {
      init(s, l) {
        var a;
        const c = (a = o.spec) === null || a === void 0 || (a = a.props) === null || a === void 0 ? void 0 : a.nodeViews, u = Oe(l.schema).table.name;
        return r && c && (c[u] = (d, f) => new r(d, t, f)), new Pw(-1, !1);
      },
      apply(s, l) {
        return l.apply(s);
      }
    },
    props: {
      attributes: (s) => {
        const l = We.getState(s);
        return l && l.activeHandle > -1 ? { class: "resize-cursor" } : {};
      },
      handleDOMEvents: {
        mousemove: (s, l) => {
          Bw(s, l, n, i);
        },
        mouseleave: (s) => {
          Hw(s);
        },
        mousedown: (s, l) => {
          zw(s, l, e, t);
        }
      },
      decorations: (s) => {
        const l = We.getState(s);
        if (l && l.activeHandle > -1) return Ww(s, l.activeHandle);
      },
      nodeViews: {}
    }
  });
  return o;
}
var Pw = class Yi {
  constructor(e, t) {
    this.activeHandle = e, this.dragging = t;
  }
  apply(e) {
    const t = this, r = e.getMeta(We);
    if (r && r.setHandle != null) return new Yi(r.setHandle, !1);
    if (r && r.setDragging !== void 0) return new Yi(t.activeHandle, r.setDragging);
    if (t.activeHandle > -1 && e.docChanged) {
      let i = e.mapping.map(t.activeHandle, -1);
      return Sl(e.doc.resolve(i)) || (i = -1), new Yi(i, t.dragging);
    }
    return t;
  }
};
function Bw(n, e, t, r) {
  if (!n.editable) return;
  const i = We.getState(n.state);
  if (i && !i.dragging) {
    const o = Fw(e.target);
    let s = -1;
    if (o) {
      const { left: l, right: a } = o.getBoundingClientRect();
      e.clientX - l <= t ? s = pu(n, e, "left", t) : a - e.clientX <= t && (s = pu(n, e, "right", t));
    }
    if (s != i.activeHandle) {
      if (!r && s !== -1) {
        const l = n.state.doc.resolve(s), a = l.node(-1), c = ae.get(a), u = l.start(-1);
        if (c.colCount(l.pos - u) + l.nodeAfter.attrs.colspan - 1 == c.width - 1) return;
      }
      sh(n, s);
    }
  }
}
function Hw(n) {
  if (!n.editable) return;
  const e = We.getState(n.state);
  e && e.activeHandle > -1 && !e.dragging && sh(n, -1);
}
function zw(n, e, t, r) {
  var i;
  if (!n.editable) return !1;
  const o = (i = n.dom.ownerDocument.defaultView) !== null && i !== void 0 ? i : window, s = We.getState(n.state);
  if (!s || s.activeHandle == -1 || s.dragging) return !1;
  const l = n.state.doc.nodeAt(s.activeHandle), a = $w(n, s.activeHandle, l.attrs);
  n.dispatch(n.state.tr.setMeta(We, { setDragging: {
    startX: e.clientX,
    startWidth: a
  } }));
  function c(d) {
    o.removeEventListener("mouseup", c), o.removeEventListener("mousemove", u);
    const f = We.getState(n.state);
    f != null && f.dragging && (Vw(n, f.activeHandle, mu(f.dragging, d, t)), n.dispatch(n.state.tr.setMeta(We, { setDragging: null })));
  }
  function u(d) {
    if (!d.which) return c(d);
    const f = We.getState(n.state);
    if (f && f.dragging) {
      const h = mu(f.dragging, d, t);
      gu(n, f.activeHandle, h, r);
    }
  }
  return gu(n, s.activeHandle, a, r), o.addEventListener("mouseup", c), o.addEventListener("mousemove", u), e.preventDefault(), !0;
}
function $w(n, e, { colspan: t, colwidth: r }) {
  const i = r && r[r.length - 1];
  if (i) return i;
  const o = n.domAtPos(e);
  let s = o.node.childNodes[o.offset].offsetWidth, l = t;
  if (r)
    for (let a = 0; a < t; a++) r[a] && (s -= r[a], l--);
  return s / l;
}
function Fw(n) {
  for (; n && n.nodeName != "TD" && n.nodeName != "TH"; ) n = n.classList && n.classList.contains("ProseMirror") ? null : n.parentNode;
  return n;
}
function pu(n, e, t, r) {
  const i = t == "right" ? -r : r, o = n.posAtCoords({
    left: e.clientX + i,
    top: e.clientY
  });
  if (!o) return -1;
  const { pos: s } = o, l = Mn(n.state.doc.resolve(s));
  if (!l) return -1;
  if (t == "right") return l.pos;
  const a = ae.get(l.node(-1)), c = l.start(-1), u = a.map.indexOf(l.pos - c);
  return u % a.width == 0 ? -1 : c + a.map[u - 1];
}
function mu(n, e, t) {
  const r = e.clientX - n.startX;
  return Math.max(t, n.startWidth + r);
}
function sh(n, e) {
  n.dispatch(n.state.tr.setMeta(We, { setHandle: e }));
}
function Vw(n, e, t) {
  const r = n.state.doc.resolve(e), i = r.node(-1), o = ae.get(i), s = r.start(-1), l = o.colCount(r.pos - s) + r.nodeAfter.attrs.colspan - 1, a = n.state.tr;
  for (let c = 0; c < o.height; c++) {
    const u = c * o.width + l;
    if (c && o.map[u] == o.map[u - o.width]) continue;
    const d = o.map[u], f = i.nodeAt(d).attrs, h = f.colspan == 1 ? 0 : l - o.colCount(d);
    if (f.colwidth && f.colwidth[h] == t) continue;
    const p = f.colwidth ? f.colwidth.slice() : jw(f.colspan);
    p[h] = t, a.setNodeMarkup(s + d, null, {
      ...f,
      colwidth: p
    });
  }
  a.docChanged && n.dispatch(a);
}
function gu(n, e, t, r) {
  const i = n.state.doc.resolve(e), o = i.node(-1), s = i.start(-1), l = ae.get(o).colCount(i.pos - s) + i.nodeAfter.attrs.colspan - 1;
  let a = n.domAtPos(i.start(-1)).node;
  for (; a && a.nodeName != "TABLE"; ) a = a.parentNode;
  a && Cl(o, a.firstChild, a, r, l, t);
}
function jw(n) {
  return Array(n).fill(0);
}
function Ww(n, e) {
  const t = [], r = n.doc.resolve(e), i = r.node(-1);
  if (!i) return ee.empty;
  const o = ae.get(i), s = r.start(-1), l = o.colCount(r.pos - s) + r.nodeAfter.attrs.colspan - 1;
  for (let c = 0; c < o.height; c++) {
    const u = l + c * o.width;
    if ((l == o.width - 1 || o.map[u] != o.map[u + 1]) && (c == 0 || o.map[u] != o.map[u - o.width])) {
      var a;
      const d = o.map[u], f = s + d + i.nodeAt(d).nodeSize - 1, h = document.createElement("div");
      h.className = "column-resize-handle", !((a = We.getState(n)) === null || a === void 0) && a.dragging && t.push(me.node(s + d, s + d + i.nodeAt(d).nodeSize, { class: "column-resize-dragging" })), t.push(me.widget(f, h));
    }
  }
  return ee.create(n.doc, t);
}
function _w({ allowTableNodeSelection: n = !1 } = {}) {
  return new ie({
    key: Ut,
    state: {
      init() {
        return null;
      },
      apply(e, t) {
        const r = e.getMeta(Ut);
        if (r != null) return r == -1 ? null : r;
        if (t == null || !e.docChanged) return t;
        const { deleted: i, pos: o } = e.mapping.mapResult(t);
        return i ? null : o;
      }
    },
    props: {
      decorations: rw,
      handleDOMEvents: { mousedown: Rw },
      createSelectionBetween(e) {
        return Ut.getState(e.state) != null ? e.state.selection : null;
      },
      handleTripleClick: Nw,
      handleKeyDown: Aw,
      handlePaste: Dw
    },
    appendTransaction(e, t, r) {
      return sw(r, nh(r, t), n);
    }
  });
}
function Tl(n, e) {
  return e ? ["width", `${Math.max(e, n)}px`] : ["min-width", `${n}px`];
}
function yu(n, e, t, r, i, o) {
  var s;
  let l = 0, a = !0, c = e.firstChild;
  const u = n.firstChild;
  if (u !== null)
    for (let d = 0, f = 0; d < u.childCount; d += 1) {
      const { colspan: h, colwidth: p } = u.child(d).attrs;
      for (let m = 0; m < h; m += 1, f += 1) {
        const g = i === f ? o : p && p[m], b = g ? `${g}px` : "";
        if (l += g || r, g || (a = !1), c) {
          if (c.style.width !== b) {
            const [T, S] = Tl(r, g);
            c.style.setProperty(T, S);
          }
          c = c.nextSibling;
        } else {
          const T = document.createElement("col"), [S, y] = Tl(r, g);
          T.style.setProperty(S, y), e.appendChild(T);
        }
      }
    }
  for (; c; ) {
    const d = c.nextSibling;
    (s = c.parentNode) === null || s === void 0 || s.removeChild(c), c = d;
  }
  a ? (t.style.width = `${l}px`, t.style.minWidth = "") : (t.style.width = "", t.style.minWidth = `${l}px`);
}
class Uw {
  constructor(e, t) {
    this.node = e, this.cellMinWidth = t, this.dom = document.createElement("div"), this.dom.className = "tableWrapper", this.table = this.dom.appendChild(document.createElement("table")), this.colgroup = this.table.appendChild(document.createElement("colgroup")), yu(e, this.colgroup, this.table, t), this.contentDOM = this.table.appendChild(document.createElement("tbody"));
  }
  update(e) {
    return e.type !== this.node.type ? !1 : (this.node = e, yu(e, this.colgroup, this.table, this.cellMinWidth), !0);
  }
  ignoreMutation(e) {
    return e.type === "attributes" && (e.target === this.table || this.colgroup.contains(e.target));
  }
}
function Kw(n, e, t, r) {
  let i = 0, o = !0;
  const s = [], l = n.firstChild;
  if (!l)
    return {};
  for (let d = 0, f = 0; d < l.childCount; d += 1) {
    const { colspan: h, colwidth: p } = l.child(d).attrs;
    for (let m = 0; m < h; m += 1, f += 1) {
      const g = t === f ? r : p && p[m];
      i += g || e, g || (o = !1);
      const [b, T] = Tl(e, g);
      s.push([
        "col",
        { style: `${b}: ${T}` }
      ]);
    }
  }
  const a = o ? `${i}px` : "", c = o ? "" : `${i}px`;
  return { colgroup: ["colgroup", {}, ...s], tableWidth: a, tableMinWidth: c };
}
function bu(n, e) {
  return n.createAndFill();
}
function qw(n) {
  if (n.cached.tableNodeTypes)
    return n.cached.tableNodeTypes;
  const e = {};
  return Object.keys(n.nodes).forEach((t) => {
    const r = n.nodes[t];
    r.spec.tableRole && (e[r.spec.tableRole] = r);
  }), n.cached.tableNodeTypes = e, e;
}
function Jw(n, e, t, r, i) {
  const o = qw(n), s = [], l = [];
  for (let c = 0; c < t; c += 1) {
    const u = bu(o.cell);
    if (u && l.push(u), r) {
      const d = bu(o.header_cell);
      d && s.push(d);
    }
  }
  const a = [];
  for (let c = 0; c < e; c += 1)
    a.push(o.row.createChecked(null, r && c === 0 ? s : l));
  return o.table.createChecked(null, a);
}
function Gw(n) {
  return n instanceof te;
}
const $i = ({ editor: n }) => {
  const { selection: e } = n.state;
  if (!Gw(e))
    return !1;
  let t = 0;
  const r = cf(e.ranges[0].$from, (o) => o.type.name === "table");
  return r == null || r.node.descendants((o) => {
    if (o.type.name === "table")
      return !1;
    ["tableCell", "tableHeader"].includes(o.type.name) && (t += 1);
  }), t === e.ranges.length ? (n.commands.deleteTable(), !0) : !1;
}, Yw = ce.create({
  name: "table",
  // @ts-ignore
  addOptions() {
    return {
      HTMLAttributes: {},
      resizable: !1,
      renderWrapper: !1,
      handleWidth: 5,
      cellMinWidth: 25,
      // TODO: fix
      View: Uw,
      lastColumnResizable: !0,
      allowTableNodeSelection: !1
    };
  },
  content: "tableRow+",
  tableRole: "table",
  isolating: !0,
  group: "block",
  parseHTML() {
    return [{ tag: "table" }];
  },
  renderHTML({ node: n, HTMLAttributes: e }) {
    const { colgroup: t, tableWidth: r, tableMinWidth: i } = Kw(n, this.options.cellMinWidth), o = [
      "table",
      Y(this.options.HTMLAttributes, e, {
        style: r ? `width: ${r}` : `min-width: ${i}`
      }),
      t,
      ["tbody", 0]
    ];
    return this.options.renderWrapper ? ["div", { class: "tableWrapper" }, o] : o;
  },
  addCommands() {
    return {
      insertTable: ({ rows: n = 3, cols: e = 3, withHeaderRow: t = !0 } = {}) => ({ tr: r, dispatch: i, editor: o }) => {
        const s = Jw(o.schema, n, e, t);
        if (i) {
          const l = r.selection.from + 1;
          r.replaceSelectionWith(s).scrollIntoView().setSelection(L.near(r.doc.resolve(l)));
        }
        return !0;
      },
      addColumnBefore: () => ({ state: n, dispatch: e }) => cw(n, e),
      addColumnAfter: () => ({ state: n, dispatch: e }) => uw(n, e),
      deleteColumn: () => ({ state: n, dispatch: e }) => fw(n, e),
      addRowBefore: () => ({ state: n, dispatch: e }) => pw(n, e),
      addRowAfter: () => ({ state: n, dispatch: e }) => mw(n, e),
      deleteRow: () => ({ state: n, dispatch: e }) => yw(n, e),
      deleteTable: () => ({ state: n, dispatch: e }) => Cw(n, e),
      mergeCells: () => ({ state: n, dispatch: e }) => su(n, e),
      splitCell: () => ({ state: n, dispatch: e }) => lu(n, e),
      toggleHeaderColumn: () => ({ state: n, dispatch: e }) => Xr("column")(n, e),
      toggleHeaderRow: () => ({ state: n, dispatch: e }) => Xr("row")(n, e),
      toggleHeaderCell: () => ({ state: n, dispatch: e }) => Sw(n, e),
      mergeOrSplit: () => ({ state: n, dispatch: e }) => su(n, e) ? !0 : lu(n, e),
      setCellAttribute: (n, e) => ({ state: t, dispatch: r }) => ww(n, e)(t, r),
      goToNextCell: () => ({ state: n, dispatch: e }) => cu(1)(n, e),
      goToPreviousCell: () => ({ state: n, dispatch: e }) => cu(-1)(n, e),
      fixTables: () => ({ state: n, dispatch: e }) => (e && nh(n), !0),
      setCellSelection: (n) => ({ tr: e, dispatch: t }) => {
        if (t) {
          const r = te.create(e.doc, n.anchorCell, n.headCell);
          e.setSelection(r);
        }
        return !0;
      }
    };
  },
  addKeyboardShortcuts() {
    return {
      Tab: () => this.editor.commands.goToNextCell() ? !0 : this.editor.can().addRowAfter() ? this.editor.chain().addRowAfter().goToNextCell().run() : !1,
      "Shift-Tab": () => this.editor.commands.goToPreviousCell(),
      Backspace: $i,
      "Mod-Backspace": $i,
      Delete: $i,
      "Mod-Delete": $i
    };
  },
  addProseMirrorPlugins() {
    return [
      ...this.options.resizable && this.editor.isEditable ? [
        Lw({
          handleWidth: this.options.handleWidth,
          cellMinWidth: this.options.cellMinWidth,
          defaultCellMinWidth: this.options.cellMinWidth,
          View: this.options.View,
          lastColumnResizable: this.options.lastColumnResizable
        })
      ] : [],
      _w({
        allowTableNodeSelection: this.options.allowTableNodeSelection
      })
    ];
  },
  extendNodeSchema(n) {
    const e = {
      name: n.name,
      options: n.options,
      storage: n.storage
    };
    return {
      tableRole: V(D(n, "tableRole", e))
    };
  }
}), Xw = ce.create({
  name: "tableRow",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  content: "(tableCell | tableHeader)*",
  tableRole: "row",
  parseHTML() {
    return [
      { tag: "tr" }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["tr", Y(this.options.HTMLAttributes, n), 0];
  }
}), Qw = ce.create({
  name: "tableHeader",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  content: "block+",
  addAttributes() {
    return {
      colspan: {
        default: 1
      },
      rowspan: {
        default: 1
      },
      colwidth: {
        default: null,
        parseHTML: (n) => {
          const e = n.getAttribute("colwidth");
          return e ? e.split(",").map((r) => parseInt(r, 10)) : null;
        }
      }
    };
  },
  tableRole: "header_cell",
  isolating: !0,
  parseHTML() {
    return [
      { tag: "th" }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["th", Y(this.options.HTMLAttributes, n), 0];
  }
}), Zw = ce.create({
  name: "tableCell",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  content: "block+",
  addAttributes() {
    return {
      colspan: {
        default: 1
      },
      rowspan: {
        default: 1
      },
      colwidth: {
        default: null,
        parseHTML: (n) => {
          const e = n.getAttribute("colwidth");
          return e ? e.split(",").map((r) => parseInt(r, 10)) : null;
        }
      }
    };
  },
  tableRole: "cell",
  isolating: !0,
  parseHTML() {
    return [
      { tag: "td" }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["td", Y(this.options.HTMLAttributes, n), 0];
  }
}), ek = /(?:^|\s)(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/, tk = ce.create({
  name: "image",
  addOptions() {
    return {
      inline: !1,
      allowBase64: !1,
      HTMLAttributes: {}
    };
  },
  inline() {
    return this.options.inline;
  },
  group() {
    return this.options.inline ? "inline" : "block";
  },
  draggable: !0,
  addAttributes() {
    return {
      src: {
        default: null
      },
      alt: {
        default: null
      },
      title: {
        default: null
      }
    };
  },
  parseHTML() {
    return [
      {
        tag: this.options.allowBase64 ? "img[src]" : 'img[src]:not([src^="data:"])'
      }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["img", Y(this.options.HTMLAttributes, n)];
  },
  addCommands() {
    return {
      setImage: (n) => ({ commands: e }) => e.insertContent({
        type: this.name,
        attrs: n
      })
    };
  },
  addInputRules() {
    return [
      pf({
        find: ek,
        type: this.type,
        getAttributes: (n) => {
          const [, , e, t, r] = n;
          return { src: t, alt: e, title: r };
        }
      })
    ];
  }
});
function nk(n) {
  var e;
  const { char: t, allowSpaces: r, allowToIncludeChar: i, allowedPrefixes: o, startOfLine: s, $position: l } = n, a = r && !i, c = R0(t), u = new RegExp(`\\s${c}$`), d = s ? "^" : "", f = i ? "" : c, h = a ? new RegExp(`${d}${c}.*?(?=\\s${f}|$)`, "gm") : new RegExp(`${d}(?:^)?${c}[^\\s${f}]*`, "gm"), p = ((e = l.nodeBefore) === null || e === void 0 ? void 0 : e.isText) && l.nodeBefore.text;
  if (!p)
    return null;
  const m = l.pos - p.length, g = Array.from(p.matchAll(h)).pop();
  if (!g || g.input === void 0 || g.index === void 0)
    return null;
  const b = g.input.slice(Math.max(0, g.index - 1), g.index), T = new RegExp(`^[${o == null ? void 0 : o.join("")}\0]?$`).test(b);
  if (o !== null && !T)
    return null;
  const S = m + g.index;
  let y = S + g[0].length;
  return a && u.test(p.slice(y - 1, y + 1)) && (g[0] += " ", y += 1), S < l.pos && y >= l.pos ? {
    range: {
      from: S,
      to: y
    },
    query: g[0].slice(t.length),
    text: g[0]
  } : null;
}
const rk = new ue("suggestion");
function ik({ pluginKey: n = rk, editor: e, char: t = "@", allowSpaces: r = !1, allowToIncludeChar: i = !1, allowedPrefixes: o = [" "], startOfLine: s = !1, decorationTag: l = "span", decorationClass: a = "suggestion", decorationContent: c = "", decorationEmptyClass: u = "is-empty", command: d = () => null, items: f = () => [], render: h = () => ({}), allow: p = () => !0, findSuggestionMatch: m = nk }) {
  let g;
  const b = h == null ? void 0 : h(), T = new ie({
    key: n,
    view() {
      return {
        update: async (S, y) => {
          var O, x, E, k, I, j, K;
          const B = (O = this.key) === null || O === void 0 ? void 0 : O.getState(y), F = (x = this.key) === null || x === void 0 ? void 0 : x.getState(S.state), Z = B.active && F.active && B.range.from !== F.range.from, ne = !B.active && F.active, X = B.active && !F.active, oe = !ne && !X && B.query !== F.query, J = ne || Z && oe, we = oe || Z, Te = X || Z && oe;
          if (!J && !we && !Te)
            return;
          const v = Te && !J ? B : F, N = S.dom.querySelector(`[data-decoration-id="${v.decorationId}"]`);
          g = {
            editor: e,
            range: v.range,
            query: v.query,
            text: v.text,
            items: [],
            command: (z) => d({
              editor: e,
              range: v.range,
              props: z
            }),
            decorationNode: N,
            // virtual node for popper.js or tippy.js
            // this can be used for building popups without a DOM node
            clientRect: N ? () => {
              var z;
              const { decorationId: _ } = (z = this.key) === null || z === void 0 ? void 0 : z.getState(e.state), q = S.dom.querySelector(`[data-decoration-id="${_}"]`);
              return (q == null ? void 0 : q.getBoundingClientRect()) || null;
            } : null
          }, J && ((E = b == null ? void 0 : b.onBeforeStart) === null || E === void 0 || E.call(b, g)), we && ((k = b == null ? void 0 : b.onBeforeUpdate) === null || k === void 0 || k.call(b, g)), (we || J) && (g.items = await f({
            editor: e,
            query: v.query
          })), Te && ((I = b == null ? void 0 : b.onExit) === null || I === void 0 || I.call(b, g)), we && ((j = b == null ? void 0 : b.onUpdate) === null || j === void 0 || j.call(b, g)), J && ((K = b == null ? void 0 : b.onStart) === null || K === void 0 || K.call(b, g));
        },
        destroy: () => {
          var S;
          g && ((S = b == null ? void 0 : b.onExit) === null || S === void 0 || S.call(b, g));
        }
      };
    },
    state: {
      // Initialize the plugin's internal state.
      init() {
        return {
          active: !1,
          range: {
            from: 0,
            to: 0
          },
          query: null,
          text: null,
          composing: !1
        };
      },
      // Apply changes to the plugin state from a view transaction.
      apply(S, y, O, x) {
        const { isEditable: E } = e, { composing: k } = e.view, { selection: I } = S, { empty: j, from: K } = I, B = { ...y };
        if (B.composing = k, E && (j || e.view.composing)) {
          (K < y.range.from || K > y.range.to) && !k && !y.composing && (B.active = !1);
          const F = m({
            char: t,
            allowSpaces: r,
            allowToIncludeChar: i,
            allowedPrefixes: o,
            startOfLine: s,
            $position: I.$from
          }), Z = `id_${Math.floor(Math.random() * 4294967295)}`;
          F && p({
            editor: e,
            state: x,
            range: F.range,
            isActive: y.active
          }) ? (B.active = !0, B.decorationId = y.decorationId ? y.decorationId : Z, B.range = F.range, B.query = F.query, B.text = F.text) : B.active = !1;
        } else
          B.active = !1;
        return B.active || (B.decorationId = null, B.range = { from: 0, to: 0 }, B.query = null, B.text = null), B;
      }
    },
    props: {
      // Call the keydown hook if suggestion is active.
      handleKeyDown(S, y) {
        var O;
        const { active: x, range: E } = T.getState(S.state);
        return x && ((O = b == null ? void 0 : b.onKeyDown) === null || O === void 0 ? void 0 : O.call(b, { view: S, event: y, range: E })) || !1;
      },
      // Setup decorator on the currently active suggestion.
      decorations(S) {
        const { active: y, range: O, decorationId: x, query: E } = T.getState(S);
        if (!y)
          return null;
        const k = !(E != null && E.length), I = [a];
        return k && I.push(u), ee.create(S.doc, [
          me.inline(O.from, O.to, {
            nodeName: l,
            class: I.join(" "),
            "data-decoration-id": x,
            "data-decoration-content": c
          })
        ]);
      }
    }
  });
  return T;
}
function ok({ editor: n, overrideSuggestionOptions: e, extensionName: t, char: r = "@" }) {
  const i = new ue();
  return {
    editor: n,
    char: r,
    pluginKey: i,
    command: ({ editor: o, range: s, props: l }) => {
      var a, c, u;
      const d = o.view.state.selection.$to.nodeAfter;
      ((a = d == null ? void 0 : d.text) === null || a === void 0 ? void 0 : a.startsWith(" ")) && (s.to += 1), o.chain().focus().insertContentAt(s, [
        {
          type: t,
          attrs: { ...l, mentionSuggestionChar: r }
        },
        {
          type: "text",
          text: " "
        }
      ]).run(), (u = (c = o.view.dom.ownerDocument.defaultView) === null || c === void 0 ? void 0 : c.getSelection()) === null || u === void 0 || u.collapseToEnd();
    },
    allow: ({ state: o, range: s }) => {
      const l = o.doc.resolve(s.from), a = o.schema.nodes[t];
      return !!l.parent.type.contentMatch.matchType(a);
    },
    ...e
  };
}
function lh(n) {
  return (n.options.suggestions.length ? n.options.suggestions : [n.options.suggestion]).map((e) => ok({
    // @ts-ignore `editor` can be `undefined` when converting the document to HTML with the HTML utility
    editor: n.editor,
    overrideSuggestionOptions: e,
    extensionName: n.name,
    char: e.char
  }));
}
function vu(n, e) {
  const t = lh(n), r = t.find((i) => i.char === e);
  return r || (t.length ? t[0] : null);
}
const sk = ce.create({
  name: "mention",
  priority: 101,
  addOptions() {
    return {
      HTMLAttributes: {},
      renderText({ node: n, suggestion: e }) {
        var t, r;
        return `${(t = e == null ? void 0 : e.char) !== null && t !== void 0 ? t : "@"}${(r = n.attrs.label) !== null && r !== void 0 ? r : n.attrs.id}`;
      },
      deleteTriggerWithBackspace: !1,
      renderHTML({ options: n, node: e, suggestion: t }) {
        var r, i;
        return [
          "span",
          Y(this.HTMLAttributes, n.HTMLAttributes),
          `${(r = t == null ? void 0 : t.char) !== null && r !== void 0 ? r : "@"}${(i = e.attrs.label) !== null && i !== void 0 ? i : e.attrs.id}`
        ];
      },
      suggestions: [],
      suggestion: {}
    };
  },
  group: "inline",
  inline: !0,
  selectable: !1,
  atom: !0,
  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: (n) => n.getAttribute("data-id"),
        renderHTML: (n) => n.id ? {
          "data-id": n.id
        } : {}
      },
      label: {
        default: null,
        parseHTML: (n) => n.getAttribute("data-label"),
        renderHTML: (n) => n.label ? {
          "data-label": n.label
        } : {}
      },
      // When there are multiple types of mentions, this attribute helps distinguish them
      mentionSuggestionChar: {
        default: "@",
        parseHTML: (n) => n.getAttribute("data-mention-suggestion-char"),
        renderHTML: (n) => ({
          "data-mention-suggestion-char": n.mentionSuggestionChar
        })
      }
    };
  },
  parseHTML() {
    return [
      {
        tag: `span[data-type="${this.name}"]`
      }
    ];
  },
  renderHTML({ node: n, HTMLAttributes: e }) {
    const t = vu(this, n.attrs.mentionSuggestionChar);
    if (this.options.renderLabel !== void 0)
      return console.warn("renderLabel is deprecated use renderText and renderHTML instead"), [
        "span",
        Y({ "data-type": this.name }, this.options.HTMLAttributes, e),
        this.options.renderLabel({
          options: this.options,
          node: n,
          suggestion: t
        })
      ];
    const r = { ...this.options };
    r.HTMLAttributes = Y({ "data-type": this.name }, this.options.HTMLAttributes, e);
    const i = this.options.renderHTML({
      options: r,
      node: n,
      suggestion: t
    });
    return typeof i == "string" ? [
      "span",
      Y({ "data-type": this.name }, this.options.HTMLAttributes, e),
      i
    ] : i;
  },
  renderText({ node: n }) {
    const e = {
      options: this.options,
      node: n,
      suggestion: vu(this, n.attrs.mentionSuggestionChar)
    };
    return this.options.renderLabel !== void 0 ? (console.warn("renderLabel is deprecated use renderText and renderHTML instead"), this.options.renderLabel(e)) : this.options.renderText(e);
  },
  addKeyboardShortcuts() {
    return {
      Backspace: () => this.editor.commands.command(({ tr: n, state: e }) => {
        let t = !1;
        const { selection: r } = e, { empty: i, anchor: o } = r;
        if (!i)
          return !1;
        e.doc.nodesBetween(o - 1, o, (a, c) => {
          if (a.type.name === this.name)
            return t = !0, n.insertText(this.options.deleteTriggerWithBackspace ? "" : this.options.suggestion.char || "", c, c + a.nodeSize), !1;
        });
        let s = new It(), l = 0;
        return e.doc.nodesBetween(o - 1, o, (a, c) => {
          if (a.type.name === this.name)
            return t = !0, s = a, l = c, !1;
        }), t && n.insertText(this.options.deleteTriggerWithBackspace ? "" : s.attrs.mentionSuggestionChar, l, l + s.nodeSize), t;
      })
    };
  },
  addProseMirrorPlugins() {
    return lh(this).map(ik);
  }
}), Le = {
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
function lk(n) {
  const e = JSON.parse(n);
  return {
    type: e.type ?? "unknown",
    requestId: e.requestId,
    payload: e.payload ?? {}
  };
}
function wu(n) {
  return JSON.stringify({
    type: n.type,
    ...n.requestId ? { requestId: n.requestId } : {},
    payload: n.payload
  });
}
const ak = 2e4, ck = 1e3, uk = 1e4;
class dk {
  constructor(e) {
    lt(this, "socket", null);
    lt(this, "pending", /* @__PURE__ */ new Map());
    lt(this, "reconnectAttempt", 0);
    lt(this, "reconnectTimer", null);
    lt(this, "closed", !1);
    lt(this, "url");
    lt(this, "status", "disconnected");
    lt(this, "onStatusChange", null);
    lt(this, "onEvent", null);
    this.url = fk(e);
  }
  connect() {
    this.closed = !1, this.setStatus("connecting");
    try {
      const e = new WebSocket(this.url);
      this.socket = e, e.onopen = () => this.handleOpen(), e.onmessage = (t) => this.handleMessage(t.data), e.onerror = () => {
      }, e.onclose = () => this.handleClose();
    } catch {
      this.handleClose();
    }
  }
  close() {
    var e;
    this.closed = !0, this.clearReconnectTimer(), (e = this.socket) == null || e.close(), this.socket = null, this.rejectAll("Connection closed"), this.setStatus("disconnected");
  }
  getStatus() {
    return this.status;
  }
  execute(e, t, r = ak) {
    return new Promise((i, o) => {
      if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
        o("Not connected");
        return;
      }
      const s = hk(), l = window.setTimeout(() => {
        this.pending.delete(s), o(`Command '${e}' timed out`);
      }, r);
      this.pending.set(s, { resolve: i, reject: o, timer: l }), this.socket.send(
        wu({
          type: Le.COMMAND_EXECUTE,
          requestId: s,
          payload: { commandId: e, params: t }
        })
      );
    });
  }
  sendRaw(e, t) {
    !this.socket || this.socket.readyState !== WebSocket.OPEN || this.socket.send(wu({ type: e, payload: t }));
  }
  handleOpen() {
    this.reconnectAttempt = 0, this.setStatus("connected");
  }
  handleMessage(e) {
    var r;
    let t;
    try {
      t = lk(String(e));
    } catch {
      return;
    }
    if (t.type === Le.COMMAND_RESULT) {
      this.resolvePending(t.requestId, t.payload);
      return;
    }
    t.type === Le.ERROR && this.rejectPending(t.requestId, t.payload.message ?? "Unknown error"), (r = this.onEvent) == null || r.call(this, t);
  }
  handleClose() {
    this.socket = null, this.rejectAll("Connection lost"), this.setStatus("disconnected"), !this.closed && this.scheduleReconnect();
  }
  scheduleReconnect() {
    this.clearReconnectTimer();
    const e = Math.min(ck * 2 ** this.reconnectAttempt, uk);
    this.reconnectAttempt += 1, this.reconnectTimer = window.setTimeout(() => this.connect(), e);
  }
  clearReconnectTimer() {
    this.reconnectTimer !== null && (window.clearTimeout(this.reconnectTimer), this.reconnectTimer = null);
  }
  resolvePending(e, t) {
    if (!e) return;
    const r = this.pending.get(e);
    r && (this.pending.delete(e), window.clearTimeout(r.timer), r.resolve(t));
  }
  rejectPending(e, t) {
    if (!e) return;
    const r = this.pending.get(e);
    r && (this.pending.delete(e), window.clearTimeout(r.timer), r.reject(t));
  }
  rejectAll(e) {
    this.pending.forEach((t) => {
      window.clearTimeout(t.timer), t.reject(e);
    }), this.pending.clear();
  }
  setStatus(e) {
    var t;
    this.status = e, (t = this.onStatusChange) == null || t.call(this, e);
  }
}
function fk(n) {
  return `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}${n}`;
}
function hk() {
  const n = new Uint8Array(16);
  if (typeof crypto < "u" && typeof crypto.getRandomValues == "function")
    crypto.getRandomValues(n);
  else
    for (let t = 0; t < n.length; t++)
      n[t] = Math.floor(Math.random() * 256);
  n[6] = n[6] & 15 | 64, n[8] = n[8] & 63 | 128;
  const e = Array.from(n, (t) => t.toString(16).padStart(2, "0"));
  return [
    e.slice(0, 4).join(""),
    e.slice(4, 6).join(""),
    e.slice(6, 8).join(""),
    e.slice(8, 10).join(""),
    e.slice(10, 16).join("")
  ].join("-");
}
const pk = /* @__PURE__ */ new Set();
function Fi(n) {
  pk.forEach((e) => e(n));
}
const ku = Be(null), Qr = {
  get transport() {
    var n;
    return (n = ku.value) == null ? void 0 : n.transport;
  },
  get collaboration() {
    var n;
    return ((n = ku.value) == null ? void 0 : n.collaboration) ?? { enabled: !1, cursorsEnabled: !1 };
  }
}, mk = 4e3, Pn = Be([]);
let gk = 1;
const Rr = {
  get list() {
    return Pn.value;
  },
  push(n) {
    const e = gk++;
    Pn.value.push({ id: e, message: n.message, kind: n.kind ?? "info" }), window.setTimeout(() => {
      Pn.value = Pn.value.filter((t) => t.id !== e);
    }, mk);
  },
  remove(n) {
    Pn.value = Pn.value.filter((e) => e.id !== n);
  }
}, Ir = nr(/* @__PURE__ */ new Map());
function Bn(n) {
  let e = Ir.get(n);
  return e || (e = { revision: 0, rows: [], loading: !1, error: null }, Ir.set(n, e)), e;
}
const Lr = {
  get caches() {
    return Ir;
  },
  invalidate(n) {
    Bn(n).revision += 1;
  },
  revision(n) {
    return Bn(n).revision;
  },
  rows(n) {
    return Bn(n).rows;
  },
  loading(n) {
    return Bn(n).loading;
  },
  error(n) {
    return Bn(n).error;
  },
  async loadList(n, e, t) {
    const r = Bn(n);
    r.loading = !0, r.error = null;
    try {
      const i = await mn.execute(e, t ?? {});
      i.status === "ERROR" ? (r.error = i.error ?? "Command failed", r.rows = []) : r.rows = Array.isArray(i.value) ? i.value : [];
    } catch (i) {
      r.error = String(i), r.rows = [];
    } finally {
      r.loading = !1;
    }
  },
  clearAll() {
    Ir.clear();
  },
  refreshAll() {
    Ir.forEach((n) => {
      n.revision += 1;
    });
  },
  reportCommandError(n, e) {
    Rr.push({ message: `Command '${n}' failed: ${String(e)}`, kind: "error" });
  }
};
function yk() {
  const n = nr(/* @__PURE__ */ new Map());
  function e(a, c, u) {
    let d = n.get(a);
    d || (d = /* @__PURE__ */ new Map(), n.set(a, d)), d.set(c, u);
  }
  function t(a, c) {
    const u = r(a, c, !0);
    return e(a, c, !u), !u;
  }
  function r(a, c, u) {
    var d;
    return ((d = n.get(a)) == null ? void 0 : d.get(c)) ?? u;
  }
  function i(a, c) {
    return r(a, c.id, c.visible ?? !0);
  }
  function o(a, c) {
    return c.filter((u) => i(a, u)).sort((u, d) => u.order - d.order);
  }
  function s(a) {
    return Array.isArray(a.layers) && a.layers.length > 0;
  }
  function l(a) {
    e(a.pageId, a.layerId, a.visible);
  }
  return {
    overrides: n,
    setVisible: e,
    toggle: t,
    isVisible: r,
    isLayerVisible: i,
    getVisibleLayers: o,
    hasLayers: s,
    handleLayerEvent: l
  };
}
const bk = yk(), Fe = nr({
  participants: [],
  localSessionId: null
}), Wn = {
  get participants() {
    return Fe.participants;
  },
  get count() {
    return Fe.participants.length;
  },
  get localSessionId() {
    return Fe.localSessionId;
  },
  get localParticipant() {
    return Fe.participants.find((n) => n.sessionId === Fe.localSessionId);
  },
  setLocalSessionId(n) {
    Fe.localSessionId = n;
  },
  updateParticipants(n) {
    Fe.participants = n;
  },
  addParticipant(n) {
    Fe.participants.find((e) => e.sessionId === n.sessionId) || Fe.participants.push(n);
  },
  removeParticipant(n) {
    Fe.participants = Fe.participants.filter((e) => e.sessionId !== n);
  },
  clear() {
    Fe.participants = [], Fe.localSessionId = null;
  }
}, $t = nr({
  cursors: /* @__PURE__ */ new Map()
}), vk = 1e4, El = /* @__PURE__ */ new Set();
function hr() {
  for (const n of El) n();
}
const Vo = {
  get all() {
    return Array.from($t.cursors.values());
  },
  getCursorsForObject(n, e) {
    return this.all.filter((t) => t.entityType === n && t.objectId === e);
  },
  getCursorsBySession(n) {
    return this.all.filter((e) => e.sessionId === n);
  },
  updateCursor(n) {
    $t.cursors.set(n.sessionId, {
      ...n,
      lastSeen: Date.now()
    }), hr();
  },
  removeCursor(n) {
    $t.cursors.delete(n), hr();
  },
  removeObjectCursors(n, e) {
    for (const [t, r] of $t.cursors)
      r.entityType === n && r.objectId === e && $t.cursors.delete(t);
    hr();
  },
  purgeStale() {
    const n = Date.now();
    for (const [e, t] of $t.cursors)
      n - t.lastSeen > vk && $t.cursors.delete(e);
    hr();
  },
  clear() {
    $t.cursors.clear(), hr();
  },
  subscribe(n) {
    return El.add(n), () => {
      El.delete(n);
    };
  }
}, Hs = Be("disconnected"), Xi = Be(null);
let Ye = null, Vi = null;
const mn = {
  get wsStatus() {
    return Hs.value;
  },
  get projectId() {
    return Xi.value;
  },
  get isConnected() {
    return Hs.value === "connected";
  },
  get localParticipant() {
    return Wn.localParticipant;
  },
  init() {
    var e;
    const n = ((e = Qr.transport) == null ? void 0 : e.wsPath) ?? "/ws";
    Ye = new dk(n), Ye.onStatusChange = (t) => {
      Hs.value = t, t === "connected" ? (zs(), Vi && xk(Vi)) : t === "disconnected" && Wn.clear();
    }, Ye.onEvent = (t) => Sk(t), Ye.connect();
  },
  execute(n, e) {
    return Ye ? Ye.execute(n, e) : Promise.reject(new Error("Session not initialized"));
  },
  sendRaw(n, e) {
    Ye && Ye.sendRaw(n, e);
  },
  async createProject() {
    const n = await $s("project.create", null), e = Su(n);
    return Xi.value = e, Vi = e, Lr.refreshAll(), zs(), e;
  },
  async openProject(n) {
    const e = await $s("project.open", { projectId: n });
    return Xi.value = Su(e), Vi = n, Lr.refreshAll(), zs(), n;
  },
  async executeCommand(n, e) {
    const t = await $s(n, e);
    return t.status === "ERROR" && Lr.reportCommandError(n, t.error ?? "Command failed"), t;
  }
};
function zs() {
  var n;
  !((n = Qr.collaboration) != null && n.enabled) || !Ye || Ye.sendRaw(Le.CLIENT_IDENTITY, {
    name: wk(),
    color: kk()
  });
}
function wk() {
  const n = ["Swift", "Calm", "Bright", "Bold", "Kind"], e = ["Fox", "Owl", "Bear", "Wolf", "Hawk"], t = n[Math.floor(Math.random() * n.length)], r = e[Math.floor(Math.random() * e.length)];
  return `${t} ${r}`;
}
function kk() {
  return `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`;
}
async function $s(n, e) {
  if (!Ye) throw new Error("Session not initialized");
  const t = await Ye.execute(n, e);
  if (t.status === "ERROR")
    throw new Error(t.error ?? `Command '${n}' failed`);
  return t;
}
function Su(n) {
  const e = n.value;
  if (e && typeof e.projectId == "string") return e.projectId;
  throw new Error("Command result did not contain projectId");
}
function Sk(n) {
  var e;
  switch (n.type) {
    case Le.PROJECT_EVENT: {
      const t = n.payload, r = t.projectId;
      typeof r == "string" && (Xi.value = r), t.type === "layer.visibility" && bk.handleLayerEvent({
        pageId: t.pageId,
        layerId: t.layerId,
        visible: t.visible
      }), Fi({ kind: Le.PROJECT_EVENT, payload: t });
      break;
    }
    case Le.OBJECT_CHANGED: {
      const t = n.payload.entityType;
      typeof t == "string" && Lr.invalidate(t), Fi({ kind: Le.OBJECT_CHANGED, payload: n.payload });
      break;
    }
    case Le.PRESENCE_LIST: {
      const t = n.payload.participants;
      Array.isArray(t) && Wn.updateParticipants(t);
      break;
    }
    case Le.PRESENCE_JOIN: {
      const t = n.payload;
      t != null && t.sessionId && Wn.addParticipant(t);
      break;
    }
    case Le.PRESENCE_LEAVE: {
      const t = n.payload.sessionId;
      t && (Wn.removeParticipant(t), Vo.removeCursor(t));
      break;
    }
    case Le.CURSOR_UPDATE: {
      const t = n.payload, r = t.sessionId;
      if (r && ((e = Qr.collaboration) != null && e.cursorsEnabled)) {
        const i = Wn.participants.find((o) => o.sessionId === r);
        Vo.updateCursor({
          sessionId: r,
          name: t.name ?? (i == null ? void 0 : i.name) ?? "Anonymous",
          color: t.color ?? (i == null ? void 0 : i.color) ?? "#999",
          entityType: t.entityType,
          objectId: t.objectId,
          position: t.position,
          selection: t.selection
        });
      }
      break;
    }
    case Le.ERROR: {
      const t = n.payload.message ?? "Unknown error";
      Rr.push({ message: t, kind: "error" }), Fi({ kind: Le.ERROR, payload: n.payload });
      break;
    }
    default:
      Fi({ kind: n.type, payload: n.payload });
  }
}
function xk(n) {
  mn.openProject(n).catch(() => {
  });
}
const ah = "rt.locale", Ck = /\{\{\s*([^{}\s]+)\s*\}\}/g;
function Tk(n) {
  var r;
  if (!n) return "en";
  const e = localStorage.getItem(ah);
  if (e && n.locales.includes(e)) return e;
  const t = (r = navigator.language) == null ? void 0 : r.split("-")[0];
  return t && n.locales.includes(t) ? t : n.defaultLocale;
}
const de = nr({
  config: null,
  locale: "en"
});
function ch(n, e) {
  return e ? n.replace(/\{(\w+)\}/g, (t, r) => {
    const i = e[r];
    return i == null ? t : String(i);
  }) : n;
}
function Ek(n, e) {
  const t = typeof (e == null ? void 0 : e.count) == "number" ? e.count : void 0;
  if (t !== void 0) {
    const r = t === 1 ? `${n}_one` : `${n}_many`;
    if (Mk(r)) return r;
  }
  return n;
}
function Mk(n) {
  var t, r;
  const e = ((t = de.config) == null ? void 0 : t.messages[de.locale]) ?? ((r = de.config) == null ? void 0 : r.messages[de.config.defaultLocale]);
  return e != null && n in e;
}
function uh(n, e) {
  var i, o;
  const t = ((i = de.config) == null ? void 0 : i.messages[de.locale]) ?? ((o = de.config) == null ? void 0 : o.messages[de.config.defaultLocale]) ?? {}, r = Ek(n, e);
  return ch(t[r] ?? n, e);
}
function dh(n, e) {
  return n.includes("{{") ? n.replace(Ck, (t, r) => uh(r, e)) : n;
}
function Ml(n) {
  if (typeof n == "string")
    return dh(n);
  if (Array.isArray(n))
    return n.map((e) => Ml(e));
  if (n !== null && typeof n == "object") {
    const e = n, t = {};
    for (const r of Object.keys(e)) t[r] = Ml(e[r]);
    return t;
  }
  return n;
}
function Ok(n, e, t) {
  var o;
  const r = ((o = de.config) == null ? void 0 : o.messages[n]) ?? {}, i = t && typeof t.count == "number" ? `${e}_${t.count === 1 ? "one" : "many"}` : e;
  return ch(r[i] ?? r[e] ?? e, t);
}
const fh = {
  get loaded() {
    return de.config !== null;
  },
  get defaultLocale() {
    var n;
    return ((n = de.config) == null ? void 0 : n.defaultLocale) ?? "en";
  },
  get locales() {
    var n;
    return ((n = de.config) == null ? void 0 : n.locales) ?? ["en"];
  },
  get locale() {
    return de.locale;
  },
  t: uh,
  tr: dh,
  deepTranslate: Ml,
  /** Initializes from workspace config, respecting stored/browser locale. */
  init(n) {
    de.config = n, de.locale = Tk(n);
  },
  setLocale(n) {
    !de.config || !de.config.locales.includes(n) || (de.locale = n, localStorage.setItem(ah, n));
  },
  /** Available locales other than the current one (for a switcher). */
  otherLocales: Mt(() => {
    var n;
    return ((n = de.config) == null ? void 0 : n.locales.filter((e) => e !== de.locale)) ?? [];
  }),
  translateFor: Ok
};
function Ak(n, e) {
  return { ...e, ...n };
}
function Nk(n, e) {
  return Mt(() => fh.deepTranslate(Ak(n, e)));
}
Be(null);
Be([]);
Be([]);
Be([]);
nr({ overlays: [] });
const Dk = /^\$([\w.]+)$/;
function Rk(n, e) {
  const t = n.split(".");
  let r = e[t[0]];
  for (let i = 1; i < t.length && r != null; i++)
    r = r[t[i]];
  return r;
}
function Ol(n, e) {
  if (typeof n == "string") {
    const t = Dk.exec(n);
    if (t) {
      const r = Rk(t[1], e);
      if (r !== void 0) return r;
    }
    return n;
  }
  if (Array.isArray(n))
    return n.map((t) => Ol(t, e));
  if (n !== null && typeof n == "object") {
    const t = {};
    for (const [r, i] of Object.entries(n))
      t[r] = Ol(i, e);
    return t;
  }
  return n;
}
function hh(n, e) {
  return n ? Ol(n, e) : {};
}
async function ph(n, e) {
  if (!(n != null && n.command)) return { value: null, error: null };
  try {
    const t = await mn.execute(n.command, hh(n.params, e));
    return t.status === "ERROR" ? { value: null, error: t.error ?? `Command '${n.command}' failed` } : { value: t.value, error: null };
  } catch (t) {
    return { value: null, error: String(t) };
  }
}
function Ik(n, e) {
  const t = Be(null), r = Be(null), i = Be(!1);
  async function o() {
    const s = n();
    if (!(s != null && s.command)) {
      t.value = null, r.value = null, i.value = !1;
      return;
    }
    i.value = !0;
    const l = await ph(s, e());
    t.value = l.value, r.value = l.error, i.value = !1;
  }
  return br(
    () => {
      var l;
      const s = (l = n()) == null ? void 0 : l.entityType;
      return s ? Lr.revision(s) : 0;
    },
    () => o()
  ), br(n, () => o()), Zr(() => o()), { value: t, error: r, loading: i, reload: o };
}
function Lk(n, e, t) {
  const r = Vo.getCursorsForObject(e, t), i = [];
  for (const o of r) {
    if (!o.position || typeof o.position != "object") continue;
    const s = o.position, l = s.from, a = s.to ?? l;
    if (l == null || l < 0) continue;
    a != null && a > l && i.push(
      me.inline(l, a, {
        style: `background-color: ${o.color}22; border-bottom: 2px solid ${o.color}`
      })
    );
    const c = document.createElement("span");
    c.className = "rt-remote-caret", c.style.cssText = `position:relative;display:inline-block;width:2px;background:${o.color};`;
    const u = document.createElement("span");
    u.className = "rt-remote-caret__label", u.style.cssText = `
      position:absolute;top:-1.4em;left:0;
      padding:1px 4px;border-radius:3px;
      background:${o.color};color:#fff;
      font-size:11px;line-height:1.3;white-space:nowrap;pointer-events:none;
    `, u.textContent = o.name, c.appendChild(u), i.push(
      me.widget(l, c, { side: -1, key: `caret-${o.sessionId}` })
    );
  }
  return ee.create(n.state.doc, i);
}
const Pk = ge.create({
  name: "remoteCursors",
  addOptions() {
    return {
      entityType: "",
      objectId: ""
    };
  },
  addProseMirrorPlugins() {
    const n = this, e = new ue("remoteCursors");
    let t = 0;
    return [
      new ie({
        key: e,
        state: {
          init: () => ee.empty,
          apply(r, i) {
            return i;
          }
        },
        props: {
          decorations(r) {
            return this.getState(r);
          }
        },
        view: (r) => {
          function i() {
            if (!e.get(r.state)) return;
            t++;
            const a = Lk(r, n.options.entityType, n.options.objectId), c = r.state.tr.setMeta(e, { decorations: a, version: t });
            r.dispatch(c);
          }
          const o = Vo.subscribe(i), s = setInterval(i, 500);
          return { destroy() {
            o(), clearInterval(s);
          } };
        }
      })
    ];
  }
}), Bk = {
  key: 0,
  class: "ui-richtext__toolbar"
}, Hk = ["title", "onClick"], zk = /* @__PURE__ */ tr({
  __name: "UiRichText",
  props: {
    config: {},
    context: {}
  },
  setup(n) {
    const e = n, t = fh.t, r = Nk(e.config, {
      contentFormat: "html",
      placeholder: ""
    }), i = Mt(() => {
      var v;
      return ((v = r.value.content) == null ? void 0 : v.entityType) ?? "";
    }), o = Mt(() => {
      var v, N;
      return ((N = (v = e.context) == null ? void 0 : v.row) == null ? void 0 : N.id) ?? "";
    }), s = Mt(() => r.value.content), { value: l, error: a } = Ik(
      () => s.value,
      () => e.context ?? {}
    ), c = Mt(() => !r.value.readonly && r.value.disabled !== !0), u = Mt(() => r.value.height), d = Mt(() => {
      var z, _;
      const v = r.value.extensions ?? [], N = (q) => {
        var Ke;
        const pe = v.find((Ie) => Ie.name === q);
        return pe ? ((Ke = pe.options) == null ? void 0 : Ke.enabled) !== !1 : !0;
      };
      return [
        ...N("placeholder") ? [_1.configure({ placeholder: r.value.placeholder })] : [],
        ...N("link") ? [W1.configure({ openOnClick: !1, autolink: !0 })] : [],
        ...N("image") ? [tk.configure({ inline: !1, allowBase64: !0 })] : [],
        ...N("task") ? [U1, q1.configure({ nested: !0 })] : [],
        ...N("table") ? [
          Yw.configure({ resizable: !0 }),
          Xw,
          Qw,
          Zw
        ] : [],
        y1,
        ...(z = r.value.mentions) != null && z.command ? [E(r.value.mentions)] : [],
        ...(_ = Qr.collaboration) != null && _.cursorsEnabled ? [Pk.configure({ entityType: i, objectId: o })] : [],
        g1.configure({
          heading: N("heading") ? { levels: [1, 2, 3] } : !1,
          codeBlock: N("codeBlock") ? {} : !1
        })
      ];
    });
    let f = [], h = { items: [], command: null }, p = 0, m = null;
    function g(v) {
      const N = (z) => Array.isArray(z) ? z.filter((_) => !!_ && typeof _ == "object").map((_) => ({ id: String(_.id ?? ""), label: String(_.label ?? _.id ?? "") })) : [];
      return Array.isArray(v) ? N(v) : v && typeof v == "object" && Array.isArray(v.items) ? N(v.items) : [];
    }
    async function b() {
      const v = r.value.mentions;
      if (!(v != null && v.command)) return;
      const { value: N, error: z } = await ph({ command: v.command, params: v.params }, e.context ?? {});
      if (z) {
        Rr.push({ message: z, kind: "error" });
        return;
      }
      f = g(N);
    }
    function T(v) {
      const N = v.toLowerCase();
      return f.filter((z) => z.label.toLowerCase().includes(N)).slice(0, 8);
    }
    function S() {
      m == null || m.remove(), m = null;
    }
    function y() {
      const v = h.items;
      if (!v.length) return;
      m || (m = document.createElement("div"), m.className = "rt-mention-popup", document.body.appendChild(m));
      const N = m;
      N.innerHTML = "", v.forEach((z, _) => {
        const q = document.createElement("button");
        q.type = "button", q.className = `rt-mention-popup__item${_ === p ? " rt-mention-popup__item--active" : ""}`, q.textContent = z.label, q.addEventListener("mousedown", (pe) => pe.preventDefault()), q.addEventListener("click", () => {
          h.command && h.command(z);
        }), N.appendChild(q);
      });
    }
    function O(v) {
      const N = v == null ? void 0 : v();
      !N || !m || (m.style.left = `${Math.min(N.left, window.innerWidth - 240)}px`, m.style.top = `${N.bottom + 4}px`);
    }
    function x() {
      let v = null;
      return {
        onStart(N) {
          h = { items: N.items, command: N.command }, p = 0, v = N.clientRect, y(), O(v);
        },
        onUpdate(N) {
          h = { items: N.items, command: N.command }, p = 0, v = N.clientRect, y(), O(v);
        },
        onKeyDown(N) {
          if (!m) return !1;
          const { event: z } = N;
          if (z.key === "ArrowDown")
            return z.preventDefault(), p = (p + 1) % h.items.length, y(), !0;
          if (z.key === "ArrowUp")
            return z.preventDefault(), p = (p - 1 + h.items.length) % h.items.length, y(), !0;
          if (z.key === "Enter") {
            z.preventDefault();
            const _ = h.items[p];
            return _ && N.command(_), !0;
          }
          return z.key === "Escape" ? (z.preventDefault(), S(), !0) : !1;
        },
        onExit() {
          S();
        }
      };
    }
    function E(v) {
      return sk.configure({
        HTMLAttributes: { class: "rt-mention" },
        renderLabel: ({ node: N }) => `${v.trigger ?? "@"}${String(N.attrs.label ?? N.attrs.id ?? "")}`,
        suggestion: {
          char: v.trigger ?? "@",
          items: ({ query: N }) => T(N),
          command: ({ editor: N, range: z, props: _ }) => {
            const q = _;
            N.chain().focus().insertContentAt(z, { type: "mention", attrs: { id: q.id, label: q.label } }).run();
          },
          render: x
        }
      });
    }
    const k = gv({
      editable: c.value,
      content: "",
      extensions: d.value
    });
    let I = null, j = null;
    function K() {
      var N, z, _;
      if (!k.value || !((N = Qr.collaboration) != null && N.cursorsEnabled)) return;
      const v = k.value.state.selection;
      !v || !i.value || !o.value || mn.sendRaw("cursor.update", {
        entityType: i.value,
        objectId: o.value,
        position: { from: v.from, to: v.to },
        selection: { anchor: v.anchor, head: v.head },
        name: ((z = mn.localParticipant) == null ? void 0 : z.name) ?? "Anonymous",
        color: ((_ = mn.localParticipant) == null ? void 0 : _.color) ?? "#999"
      });
    }
    function B() {
      j && clearTimeout(j), j = setTimeout(K, 200);
    }
    function F(v) {
      return k.value ? v === "json" ? JSON.stringify(k.value.getJSON()) : k.value.getHTML() : "";
    }
    function Z() {
      var v;
      !c.value || !((v = r.value.save) != null && v.command) || (I && clearTimeout(I), I = setTimeout(() => {
        ne();
      }, 600));
    }
    async function ne() {
      var N;
      if (!((N = r.value.save) != null && N.command)) return;
      const v = { ...r.value.save.params ?? {}, content: F(r.value.contentFormat ?? "html") };
      try {
        await mn.executeCommand(r.value.save.command, hh(v, e.context ?? {})), Rr.push({ message: t("core.editor.saved"), kind: "success" });
      } catch {
      }
    }
    br(
      () => l.value,
      (v) => {
        if (v != null && k.value)
          if (r.value.contentFormat === "json")
            try {
              k.value.commands.setContent(JSON.parse(String(v)));
            } catch {
            }
          else
            k.value.commands.setContent(String(v));
      }
    ), br(
      () => c.value,
      (v) => {
        var N;
        return (N = k.value) == null ? void 0 : N.setEditable(v);
      }
    ), br(
      () => k.value,
      (v) => {
        v && (v.setEditable(c.value), v.on("update", () => Z()), v.on("selectionUpdate", () => B()));
      }
    );
    const X = [
      "undo",
      "redo",
      "heading1",
      "heading2",
      "heading3",
      "bold",
      "italic",
      "underline",
      "strike",
      "code",
      "bulletList",
      "orderedList",
      "taskList",
      "blockquote",
      "codeBlock",
      "link",
      "image",
      "table"
    ], oe = Mt(() => r.value.toolbar === !1 ? [] : r.value.toolbar ?? X), J = {
      undo: { label: t("core.editor.undo"), icon: "↩", action: () => {
        var v;
        return (v = k.value) == null ? void 0 : v.chain().focus().undo().run();
      }, disabled: () => {
        var v;
        return !((v = k.value) != null && v.can().undo());
      } },
      redo: { label: t("core.editor.redo"), icon: "↪", action: () => {
        var v;
        return (v = k.value) == null ? void 0 : v.chain().focus().redo().run();
      }, disabled: () => {
        var v;
        return !((v = k.value) != null && v.can().redo());
      } },
      heading1: { label: "H1", icon: "H1", action: () => {
        var v;
        return (v = k.value) == null ? void 0 : v.chain().focus().toggleHeading({ level: 1 }).run();
      }, active: () => {
        var v;
        return ((v = k.value) == null ? void 0 : v.isActive("heading", { level: 1 })) ?? !1;
      } },
      heading2: { label: "H2", icon: "H2", action: () => {
        var v;
        return (v = k.value) == null ? void 0 : v.chain().focus().toggleHeading({ level: 2 }).run();
      }, active: () => {
        var v;
        return ((v = k.value) == null ? void 0 : v.isActive("heading", { level: 2 })) ?? !1;
      } },
      heading3: { label: "H3", icon: "H3", action: () => {
        var v;
        return (v = k.value) == null ? void 0 : v.chain().focus().toggleHeading({ level: 3 }).run();
      }, active: () => {
        var v;
        return ((v = k.value) == null ? void 0 : v.isActive("heading", { level: 3 })) ?? !1;
      } },
      bold: { label: t("core.editor.bold"), icon: "B", action: () => {
        var v;
        return (v = k.value) == null ? void 0 : v.chain().focus().toggleBold().run();
      }, active: () => {
        var v;
        return ((v = k.value) == null ? void 0 : v.isActive("bold")) ?? !1;
      } },
      italic: { label: t("core.editor.italic"), icon: "I", action: () => {
        var v;
        return (v = k.value) == null ? void 0 : v.chain().focus().toggleItalic().run();
      }, active: () => {
        var v;
        return ((v = k.value) == null ? void 0 : v.isActive("italic")) ?? !1;
      } },
      underline: { label: t("core.editor.underline"), icon: "U", action: () => {
        var v;
        return (v = k.value) == null ? void 0 : v.chain().focus().toggleUnderline().run();
      }, active: () => {
        var v;
        return ((v = k.value) == null ? void 0 : v.isActive("underline")) ?? !1;
      } },
      strike: { label: t("core.editor.strike"), icon: "S", action: () => {
        var v;
        return (v = k.value) == null ? void 0 : v.chain().focus().toggleStrike().run();
      }, active: () => {
        var v;
        return ((v = k.value) == null ? void 0 : v.isActive("strike")) ?? !1;
      } },
      code: { label: t("core.editor.code"), icon: "</>", action: () => {
        var v;
        return (v = k.value) == null ? void 0 : v.chain().focus().toggleCode().run();
      }, active: () => {
        var v;
        return ((v = k.value) == null ? void 0 : v.isActive("code")) ?? !1;
      } },
      bulletList: { label: t("core.editor.bulletList"), icon: "•", action: () => {
        var v;
        return (v = k.value) == null ? void 0 : v.chain().focus().toggleBulletList().run();
      }, active: () => {
        var v;
        return ((v = k.value) == null ? void 0 : v.isActive("bulletList")) ?? !1;
      } },
      orderedList: { label: t("core.editor.orderedList"), icon: "1.", action: () => {
        var v;
        return (v = k.value) == null ? void 0 : v.chain().focus().toggleOrderedList().run();
      }, active: () => {
        var v;
        return ((v = k.value) == null ? void 0 : v.isActive("orderedList")) ?? !1;
      } },
      taskList: { label: t("core.editor.taskList"), icon: "☑", action: () => {
        var v;
        return (v = k.value) == null ? void 0 : v.chain().focus().toggleTaskList().run();
      }, active: () => {
        var v;
        return ((v = k.value) == null ? void 0 : v.isActive("taskList")) ?? !1;
      } },
      blockquote: { label: t("core.editor.blockquote"), icon: "❝", action: () => {
        var v;
        return (v = k.value) == null ? void 0 : v.chain().focus().toggleBlockquote().run();
      }, active: () => {
        var v;
        return ((v = k.value) == null ? void 0 : v.isActive("blockquote")) ?? !1;
      } },
      codeBlock: { label: t("core.editor.codeBlock"), icon: "{ }", action: () => {
        var v;
        return (v = k.value) == null ? void 0 : v.chain().focus().toggleCodeBlock().run();
      }, active: () => {
        var v;
        return ((v = k.value) == null ? void 0 : v.isActive("codeBlock")) ?? !1;
      } },
      link: { label: t("core.editor.link"), icon: "🔗", action: () => we(), active: () => {
        var v;
        return ((v = k.value) == null ? void 0 : v.isActive("link")) ?? !1;
      } },
      image: { label: t("core.editor.image"), icon: "🖼", action: () => Te(), disabled: () => !c.value },
      table: { label: t("core.editor.table"), icon: "⊞", action: () => {
        var v;
        return (v = k.value) == null ? void 0 : v.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: !0 }).run();
      }, active: () => {
        var v;
        return ((v = k.value) == null ? void 0 : v.isActive("table")) ?? !1;
      } }
    };
    function we() {
      if (!k.value) return;
      const v = k.value.getAttributes("link").href, N = window.prompt(t("core.editor.linkPrompt"), v ?? "https://");
      N !== null && (N ? k.value.chain().focus().extendMarkRange("link").setLink({ href: N }).run() : k.value.chain().focus().extendMarkRange("link").unsetLink().run());
    }
    function Te() {
      if (!k.value) return;
      const v = window.prompt(t("core.editor.imagePrompt"));
      v && k.value.chain().focus().setImage({ src: v }).run();
    }
    return Zr(() => {
      a.value && Rr.push({ message: a.value, kind: "error" }), b();
    }), ei(() => {
      var v;
      I && clearTimeout(I), j && clearTimeout(j), S(), (v = k.value) == null || v.destroy();
    }), (v, N) => (wi(), ki("div", {
      class: "ui-richtext",
      style: Ah(u.value ? { height: u.value } : void 0)
    }, [
      ji(r).toolbar !== !1 && c.value ? (wi(), ki("div", Bk, [
        (wi(!0), ki(Nh, null, Dh(oe.value, (z) => {
          var _, q, pe, Ke, Ie, bt;
          return wi(), ki("button", {
            key: z,
            class: Sa(["ui-richtext__btn", { "ui-richtext__btn--active": (q = (_ = J[z]) == null ? void 0 : _.active) == null ? void 0 : q.call(_), "ui-richtext__btn--disabled": (Ke = (pe = J[z]) == null ? void 0 : pe.disabled) == null ? void 0 : Ke.call(pe) }]),
            title: (Ie = J[z]) == null ? void 0 : Ie.label,
            onClick: (vt) => {
              var wt;
              return (wt = J[z]) == null ? void 0 : wt.action();
            }
          }, Rh((bt = J[z]) == null ? void 0 : bt.icon), 11, Hk);
        }), 128))
      ])) : Ih("", !0),
      Lh("div", {
        class: Sa(["ui-richtext__editor", { "ui-richtext__editor--readonly": !c.value }])
      }, [
        Ph(ji(mv), { editor: ji(k) }, null, 8, ["editor"])
      ], 2)
    ], 4));
  }
}), $k = (n, e) => {
  const t = n.__vccOpts || n;
  for (const [r, i] of e)
    t[r] = i;
  return t;
}, _k = /* @__PURE__ */ $k(zk, [["__scopeId", "data-v-02e41a58"]]);
export {
  _k as default
};
