const r = "data-pm-carousel", S = `${r}-paging`, w = `${r}-wrapper`, T = `${r}-overflow`, f = `${r}-item`, m = `${r}-prev`, v = `${r}-next`, p = `${r}-playstop`, y = "transform .5s ease-in-out", c = "is-active", E = {
  playstop: function() {
    this.nodes.playstop && (this.nodes.playstop.hidden = !this.currentSettings.autoplay);
  },
  wrapper: function() {
    const t = this.currentSettings.noStartSpace ? 0 : this.currentSettings.spaceAround;
    this.nodes.overflow.style.transform = `translateX(${this.activePage * -100 + t}%)`, this.currentSettings.noStartSpace ? this.nodes.overflow.style.paddingRight = this.currentSettings.spaceAround + "%" : (this.nodes.overflow.style.paddingRight = t + "%", this.nodes.overflow.style.paddingLeft = t + "%"), this.nodes.overflow.style.transition = y, this.nodes.overflow.style.display = "flex", this.nodes.wrapper.style.overflow = "hidden", this.el.classList.add(c);
  },
  slides: function() {
    const t = [];
    for (this.nodes.items.forEach((e, s) => {
      e.setAttribute("tabindex", "-1"), e.setAttribute(r + "-item", s), e.style.flex = `1 0 ${100 / this.currentSettings.group}%`, e.style.overflow = "hidden";
    }); this.nodes.items.length > 0; )
      t.push(this.nodes.items.splice(0, this.currentSettings.group));
    this.nodes.items = t, this.pagesLength = this.nodes.items.length;
  },
  paging: function() {
    if (!this.nodes.paging) return;
    let t, e;
    const s = document.createDocumentFragment();
    this.nodes.paging.innerHTML = "", this.nodes.pages = [], this.nodes.items.forEach((i, a) => {
      e = this._templates.pagingTpl, t = document.createElement("div"), t.innerHTML = e.replace("{nbr}", ++a), this.nodes.pages.push(t.firstElementChild), s.appendChild(t.firstElementChild);
    }), this.nodes.paging.append(s), this.nodes.paging.hidden = !1;
  }
};
function L() {
  ["slides", "wrapper", "playstop", "paging"].forEach((e) => E[e].call(this));
}
function g() {
  this.activePage = 0, this._interval = null, this.autoplayStatus = "stop", this._metrics = {
    touchstartX: 0,
    touchmoveX: 0,
    moveX: 0,
    slideWidth: 0
  }, L.call(this), this.changeActive(this.activePage), this.currentSettings.autoplay > 1 && this.nodes.playstop ? (this.autoplayStatus = "play", this.play()) : this.stop();
}
function P() {
  this._metrics.slideWidth = this.visibleSlides[0].offsetWidth * this.currentSettings.group, this._metrics.distance = this.activePage * this._metrics.slideWidth, this.activePage === this.pagesLength - 1 && (this._metrics.distance = this.nodes.overflow.scrollWidth - this._metrics.slideWidth, this.currentSettings.spaceAround && (this._metrics.distance -= parseInt(
    window.getComputedStyle(this.nodes.overflow).getPropertyValue("padding-right"),
    10
  ))), this.nodes.overflow.style.transform = `translateX(${-this._metrics.distance}px`;
}
function x() {
  const t = (i, a) => {
    const n = this.nodes[i];
    if (!n) return;
    const o = this._templates[i];
    n.innerHTML = o.tpl.replace(
      "{text}",
      a ? o.lastLabel : o.label
    ), this.currentSettings.loop ? n.hidden = !1 : n.hidden = a;
  }, e = this.activePage === 0, s = this.activePage === this.pagesLength - 1;
  t("prev", e), t("next", s);
}
function _(t) {
  t.querySelectorAll(
    "a, button, input, textarea, select, [tabindex]"
  ).forEach((s) => {
    s.hasAttribute("data-original-tabindex") || s.setAttribute("data-original-tabindex", s.getAttribute("tabindex")), s.setAttribute("tabindex", "-1"), s.setAttribute("aria-hidden", "true");
  });
}
function $(t) {
  t.querySelectorAll(
    '[tabindex="-1"], [aria-hidden="true"]'
  ).forEach((s) => {
    const i = s.getAttribute("data-original-tabindex");
    i !== null && (i === "null" ? s.removeAttribute("tabindex") : s.setAttribute("tabindex", i), s.removeAttribute("data-original-tabindex")), s.removeAttribute("aria-hidden");
  });
}
function M() {
  this.visibleSlides = [], this.nodes.paging && this.nodes.pages.forEach((t, e) => {
    let s = t.querySelector("button") || t;
    e === this.activePage ? (s.setAttribute("aria-current", "true"), t.classList.add(c)) : (s.removeAttribute("aria-current"), t.classList.remove(c));
  }), this.nodes.items.forEach((t, e) => {
    t.forEach((s, i) => {
      e === this.activePage ? (s.removeAttribute("aria-hidden"), this.supportsInert ? s.inert = !1 : $(s), this.visibleSlides.push(s), i === 0 && this.autoplayStatus !== "play" && s.focus({ preventScroll: !0 })) : (s.setAttribute("aria-hidden", "true"), this.supportsInert ? s.inert = !0 : _(s));
    });
  }), P.call(this), x.call(this);
}
function b() {
  const t = {};
  let e = !1, s = 0;
  const i = arguments.length;
  Object.prototype.toString.call(arguments[0]) === "[object Boolean]" && (e = arguments[0], s++);
  const a = function(n) {
    for (const o in n)
      Object.prototype.hasOwnProperty.call(n, o) && (e && Object.prototype.toString.call(n[o]) === "[object Object]" ? t[o] = b(!0, t[o], n[o]) : t[o] = n[o]);
  };
  for (; s < i; s++) {
    const n = arguments[s];
    a(n);
  }
  return t;
}
function X(t) {
  try {
    return JSON.parse(t);
  } catch {
    return {};
  }
}
const q = {
  default: {
    loop: !0,
    group: 1,
    spaceAround: 0,
    noStartSpace: !1,
    autoplay: 0
  }
};
function I(t = {}) {
  const e = () => {
    const l = this.settings.responsive.slice().reverse().find(
      (h) => window.matchMedia(`(min-width: ${h.minWidth})`).matches
    );
    return l ? { ...this.settings.default, ...l } : this.settings.default;
  };
  let s, i = !1;
  const a = () => {
    i || (i = !0, s = setTimeout(() => {
      this.currentSettings = e.call(this), this.currentSettings.disable ? this.disable() : this.reinit(), i = !1, clearTimeout(s);
    }, 200));
  }, n = X(this.el.getAttribute(r));
  this.settings = b(!0, {}, q, t, n);
  let o = this.settings.default;
  return this.settings.responsive && (this.settings.responsive.sort(
    (l, h) => parseInt(l.minWidth, 10) - parseInt(h.minWidth, 10)
  ), o = e.call(this), this.settings.responsive.forEach((l) => {
    window.matchMedia(`(min-width: ${l.minWidth})`).addEventListener("change", a.bind(this));
  })), o;
}
function R() {
  return {
    paging: this.el.querySelector(`[${S}]`),
    prev: this.el.querySelector(`[${m}]`),
    next: this.el.querySelector(`[${v}]`),
    playstop: this.el.querySelector(`[${p}]`),
    overflow: this.el.querySelector(`[${T}]`),
    wrapper: this.el.querySelector(`[${w}]`),
    items: [...this.el.querySelectorAll(`[${f}]`)]
  };
}
function W() {
  const t = {}, e = (s, i, a) => {
    var n;
    if (s) {
      const o = (n = s.getAttribute(i)) == null ? void 0 : n.split("|");
      if (o && o.length === a.length)
        return {
          tpl: s.innerHTML,
          ...Object.fromEntries(a.map((l, h) => [l, o[h]]))
        };
    }
    return null;
  };
  return this.nodes && (t.playstop = e(this.nodes.playstop, p, [
    "playLabel",
    "stopLabel"
  ]), t.prev = e(this.nodes.prev, m, [
    "label",
    "lastLabel"
  ]), t.next = e(this.nodes.next, v, [
    "label",
    "lastLabel"
  ]), this.nodes.paging && (t.pagingTpl = this.nodes.paging.innerHTML)), t;
}
function C(t) {
  const e = t.target, s = {
    [`${r}-playstop`]: () => this.toggleAutoplay(),
    [`${r}-prev`]: () => this.changeActive(this.activePage - 1),
    [`${r}-next`]: () => this.changeActive(this.activePage + 1),
    [`${r}-paging`]: () => {
      const i = e.closest(`[${r}-paging] li`);
      if (i) {
        const a = this.nodes.pages.indexOf(i);
        this.changeActive(a);
      }
    }
  };
  for (const [i, a] of Object.entries(s))
    if (e.closest(`[${i}]`)) {
      i !== `${r}-playstop` && this.stop(), a();
      break;
    }
}
function O(t) {
  const s = {
    ArrowUp: () => this.changeActive(this.activePage - 1),
    ArrowLeft: () => this.changeActive(this.activePage - 1),
    ArrowDown: () => this.changeActive(this.activePage + 1),
    ArrowRight: () => this.changeActive(this.activePage + 1),
    Home: () => this.changeActive(0),
    End: () => this.changeActive(this.pagesLength - 1)
  }[t.key];
  s && (s(), t.preventDefault());
}
const u = {
  onTouchStart: null,
  onTouchMove: null,
  onTouchEnd: null
};
function d(t, e) {
  u[t] && window.cancelAnimationFrame(u[t]), u[t] = window.requestAnimationFrame(e);
}
function N(t) {
  d("onTouchStart", () => {
    this.stop(), this.nodes.overflow.style.transition = "none", this._metrics.touchstartX = Math.round(t.touches[0].pageX), this._metrics.slideWidth = this.nodes.wrapper.offsetWidth;
  });
}
function F(t) {
  d("onTouchMove", () => {
    this._metrics.touchmoveX = Math.round(t.touches[0].pageX), this._metrics.moveX = this._metrics.touchstartX - this._metrics.touchmoveX, this.nodes.overflow.style.transform = `translateX(${-this._metrics.distance - this._metrics.moveX}px)`;
  });
}
function H() {
  d("onTouchEnd", () => {
    let t = this.activePage;
    if (this.nodes.overflow.style.transition = y, this._metrics.moveX > this._metrics.slideWidth / 3)
      t++;
    else if (this._metrics.moveX < -this._metrics.slideWidth / 3)
      t--;
    else {
      this.nodes.overflow.style.transform = `translateX(${-this._metrics.distance}px)`;
      return;
    }
    this.changeActive(t, !0);
  });
}
function A(t = !0) {
  const e = t ? "addEventListener" : "removeEventListener", s = (i) => {
    i.target.closest(`[${p}]`) ? this.play() : this.pause();
  };
  ["touchstart", "touchmove", "touchend"].forEach((i, a) => {
    const n = [N, F, H][a];
    this.nodes.wrapper[e](i, n.bind(this));
  }), this.el[e]("click", C.bind(this)), this.el[e]("keydown", O.bind(this)), this.el[e]("focusin", s), this.el[e]("focusout", this.play.bind(this)), this.el[e]("mouseenter", this.pause.bind(this)), this.el[e]("mouseleave", this.play.bind(this));
}
function k() {
  A.call(this, !0);
}
function j() {
  A.call(this, !1);
}
const B = (() => {
  const t = document.createElement("div");
  return t.setAttribute("inert", ""), t.inert === !0;
})();
class D {
  constructor(e, s) {
    this.el = e, this.supportsInert = B, this.currentSettings = I.call(this, s), this.nodes = R.call(this), this._templates = W.call(this), k.call(this), this.currentSettings.disable || g.call(this);
  }
  play() {
    if (!this.nodes.playstop || this.autoplayStatus === "stop")
      return;
    this.pause(), this.currentSettings.loop = !0, this.autoplayStatus = "play", this.nodes.playstop.classList.add("is-playing"), this.nodes.playstop.innerHTML = this._templates.playstop.tpl.replace(
      "{text}",
      this._templates.playstop.playLabel
    );
    let e = this.activePage;
    this._interval = window.setInterval(() => {
      e++, e > this.pagesLength - 1 && (e = 0), this.changeActive(e);
    }, this.currentSettings.autoplay);
  }
  pause() {
    window.clearInterval(this._interval);
  }
  stop() {
    this.nodes.playstop && (this.autoplayStatus = "stop", this.nodes.playstop.classList.remove("is-playing"), this.nodes.playstop.innerHTML = this._templates.playstop.tpl.replace(
      "{text}",
      this._templates.playstop.stopLabel
    ), window.clearInterval(this._interval));
  }
  toggleAutoplay() {
    this.nodes.playstop && (this.autoplayStatus === "play" ? this.stop() : this.autoplayStatus === "stop" && (this.autoplayStatus = "play", this.play()));
  }
  changeActive(e, s) {
    this.activePage = e, this.activePage < 0 && (this.activePage = this.currentSettings.loop && !s ? this.pagesLength - 1 : 0), this.activePage > this.pagesLength - 1 && (this.activePage = this.currentSettings.loop && !s ? 0 : this.pagesLength - 1), M.call(this);
  }
  reinit() {
    this.disable(), this.nodes.items = [...this.el.querySelectorAll(`[${f}]`)], g.call(this);
  }
  disable() {
    this.stop(), j.call(this), this.nodes.paging.hidden = !0, this.nodes.prev.hidden = !0, this.nodes.next.hidden = !0, this.nodes.playstop.hidden = !0, this.nodes.overflow.removeAttribute("style"), this.nodes.wrapper.removeAttribute("style"), this.nodes.items.forEach((e) => {
      e == null || e.forEach((s) => {
        s.removeAttribute("tabindex"), s.removeAttribute("aria-hidden"), s.removeAttribute("style");
      });
    }), this.el.classList.remove(c);
  }
}
const V = (t, e) => {
  !t.pmCarousel && t.hasAttribute(r) && (t.pmCarousel = new D(t, e));
}, K = function(t = {}, e) {
  e && (e = e instanceof NodeList ? [...e] : [e], e.forEach((s) => V(s, t)));
};
window.pmCarousel = K;
export {
  K as default
};
