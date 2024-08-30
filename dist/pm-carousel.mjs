const n = "data-pm-carousel", T = `${n}-paging`, E = `${n}-wrapper`, _ = `${n}-overflow`, f = `${n}-item`, m = `${n}-prev`, y = `${n}-next`, w = `${n}-playstop`, S = "transform .5s ease-in-out", l = "is-active", P = {
  playstop: function() {
    this.nodes.playstop && (this.nodes.playstop.hidden = !this.currentSettings.autoplay);
  },
  wrapper: function() {
    const t = this.currentSettings.noStartSpace ? 0 : this.currentSettings.spaceAround;
    this.nodes.overflow.style.transform = `translateX(${this.activePage * -100 + t}%)`, this.currentSettings.noStartSpace ? this.nodes.overflow.style.paddingRight = this.currentSettings.spaceAround + "%" : (this.nodes.overflow.style.paddingRight = t + "%", this.nodes.overflow.style.paddingLeft = t + "%"), this.nodes.overflow.style.transition = S, this.nodes.overflow.style.display = "flex", this.nodes.wrapper.style.overflow = "hidden", this.el.classList.add(l);
  },
  slides: function() {
    const t = [];
    for (this.nodes.items.forEach((e, s) => {
      e.setAttribute("tabindex", "-1"), e.setAttribute(n + "-item", s), e.style.flex = `1 0 ${100 / this.currentSettings.group}%`, e.style.overflow = "hidden";
    }); this.nodes.items.length > 0; )
      t.push(this.nodes.items.splice(0, this.currentSettings.group));
    this.nodes.items = t, this.pagesLength = this.nodes.items.length;
  },
  paging: function() {
    if (!this.nodes.paging) return;
    let t, e;
    const s = document.createDocumentFragment();
    this.nodes.paging.innerHTML = "", this.nodes.pages = [], this.nodes.items.forEach((i, r) => {
      e = this.nodes.pagingTpl.innerHTML, t = document.createElement("div"), t.innerHTML = e.replace("{nbr}", ++r), this.nodes.pages.push(t.firstElementChild), s.appendChild(t.firstElementChild);
    }), this.nodes.paging.append(s), this.nodes.paging.hidden = !1;
  }
};
function x() {
  ["slides", "wrapper", "playstop", "paging"].forEach((e) => P[e].call(this));
}
function u() {
  this.activePage = 0, this._interval = null, this.autoplayStatus = "stop", this._metrics = {
    touchstartX: 0,
    touchmoveX: 0,
    moveX: 0,
    slideWidth: 0
  }, x.call(this), this.changeActive(this.activePage), this.currentSettings.autoplay > 1 && this.nodes.playstop ? (this.autoplayStatus = "play", this.play()) : this.stop();
}
function $() {
  this._metrics.slideWidth = this.visibleSlides[0].offsetWidth * this.currentSettings.group, this._metrics.distance = this.activePage * this._metrics.slideWidth, this.activePage === this.pagesLength - 1 && (this._metrics.distance = this.nodes.overflow.scrollWidth - this._metrics.slideWidth, this.currentSettings.spaceAround && (this._metrics.distance -= parseInt(
    window.getComputedStyle(this.nodes.overflow).getPropertyValue("padding-right"),
    10
  ))), this.nodes.overflow.style.transform = `translateX(${-this._metrics.distance}px`;
}
function M() {
  this.nodes.prev && (this.nodes.prev.innerHTML = this._templates.prev.tpl.replace(
    "{text}",
    this.activePage === 0 ? this._templates.prev.lastLabel : this._templates.prev.label
  ), this.currentSettings.loop ? this.nodes.prev.hidden = !1 : this.nodes.prev.hidden = this.activePage === 0);
}
function q() {
  this.nodes.next && (this.nodes.next.innerHTML = this._templates.next.tpl.replace(
    "{text}",
    this.activePage === this.pagesLength - 1 ? this._templates.next.lastLabel : this._templates.next.label
  ), this.currentSettings.loop ? this.nodes.next.hidden = !1 : this.nodes.next.hidden = this.activePage === this.pagesLength - 1);
}
function X() {
  this.visibleSlides = [], this.nodes.paging && this.nodes.pages.forEach((t, e) => {
    let s = t;
    const i = t.querySelector("button");
    i && (s = i), e === this.activePage ? (s.setAttribute("aria-current", "true"), t.classList.add(l)) : (s.removeAttribute("aria-current"), t.classList.remove(l));
  }), this.nodes.items.forEach((t, e) => {
    t.forEach((s, i) => {
      e === this.activePage ? (i === 0 && this.autoplayStatus !== "play" && s.focus({ preventScroll: !0 }), s.setAttribute("aria-hidden", "false"), this.visibleSlides.push(s)) : s.setAttribute("aria-hidden", "true");
    });
  }), $.call(this), M.call(this), q.call(this);
}
function A() {
  const t = {};
  let e = !1, s = 0;
  const i = arguments.length;
  Object.prototype.toString.call(arguments[0]) === "[object Boolean]" && (e = arguments[0], s++);
  const r = function(a) {
    for (const o in a)
      Object.prototype.hasOwnProperty.call(a, o) && (e && Object.prototype.toString.call(a[o]) === "[object Object]" ? t[o] = A(!0, t[o], a[o]) : t[o] = a[o]);
  };
  for (; s < i; s++) {
    const a = arguments[s];
    r(a);
  }
  return t;
}
function C(t) {
  try {
    return JSON.parse(t);
  } catch {
    return {};
  }
}
function b() {
  const t = this.settings.responsive.slice().reverse().find(
    (e) => window.matchMedia(`(min-width: ${e.minWidth})`).matches
  );
  return t ? { ...this.settings.default, ...t } : this.settings.default;
}
let g, h = !1;
function R() {
  h || (h = !0, g = setTimeout(() => {
    this.currentSettings = b.call(this), this.currentSettings.disable ? this.disable() : this.reinit(), h = !1, clearTimeout(g);
  }, 200));
}
const W = {
  default: {
    loop: !0,
    group: 1,
    spaceAround: 0,
    noStartSpace: !1,
    autoplay: 0
  }
};
function O(t) {
  const e = C(this.el.getAttribute(n));
  this.settings = A(!0, W, t, e);
  let s = this.settings.default;
  return this.settings.responsive && (this.settings.responsive.sort(
    (i, r) => parseInt(i.minWidth, 10) - parseInt(r.minWidth, 10)
  ), s = b.call(this), this.settings.responsive.forEach((i) => {
    window.matchMedia(`(min-width: ${i.minWidth})`).addEventListener("change", R.bind(this));
  })), s;
}
function k() {
  var e;
  const t = {
    paging: this.el.querySelector(`[${T}]`),
    prev: this.el.querySelector(`[${m}]`),
    next: this.el.querySelector(`[${y}]`),
    playstop: this.el.querySelector(`[${w}]`),
    overflow: this.el.querySelector(`[${_}]`),
    wrapper: this.el.querySelector(`[${E}]`),
    items: [].slice.call(this.el.querySelectorAll(`[${f}]`))
  };
  return t.paging && (t.pagingTpl = (e = t.paging) == null ? void 0 : e.cloneNode(!0)), t;
}
function H(t) {
  let e = this.activePage;
  const s = t.target, i = s.closest(`[${n}-playstop]`), r = s.closest(`[${n}-prev]`), a = s.closest(`[${n}-next]`), o = s.closest(`[${n}-paging]`);
  if (i) {
    this.toggleAutoplay();
    return;
  } else if (r)
    e--;
  else if (a)
    e++;
  else if (o && o.querySelector("button")) {
    const L = s.closest(`[${n}-paging] li`);
    e = this.nodes.pages.indexOf(L);
  } else
    return;
  this.stop(), this.changeActive(e);
}
function I(t) {
  let e = !1;
  switch (t.key) {
    case "ArrowUp":
    case "ArrowLeft":
      e = !0, this.changeActive(this.activePage - 1);
      break;
    case "ArrowDown":
    case "ArrowRight":
      e = !0, this.changeActive(this.activePage + 1);
      break;
    case "Home":
      e = !0, this.changeActive(0);
      break;
    case "End":
      e = !0, this.changeActive(this.pagesLength - 1);
      break;
  }
  e && t.preventDefault();
}
let c, p, d;
function N(t) {
  c && window.cancelAnimationFrame(c), c = window.requestAnimationFrame(() => {
    this.stop(), this.nodes.overflow.style.transition = "none", this._metrics.touchstartX = Math.round(t.touches[0].pageX), this._metrics.slideWidth = this.nodes.wrapper.offsetWidth;
  });
}
function F(t) {
  p && window.cancelAnimationFrame(p), p = window.requestAnimationFrame(() => {
    this._metrics.touchmoveX = Math.round(t.touches[0].pageX), this._metrics.moveX = this._metrics.touchstartX - this._metrics.touchmoveX, this.nodes.overflow.style.transform = `translateX(${-this._metrics.distance - this._metrics.moveX}px)`;
  });
}
function D() {
  d && window.cancelAnimationFrame(d), d = window.requestAnimationFrame(() => {
    let t = this.activePage;
    if (this.nodes.overflow.style.transition = S, this._metrics.moveX > this._metrics.slideWidth / 3)
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
function B() {
  const t = H.bind(this), e = N.bind(this), s = F.bind(this), i = D.bind(this), r = I.bind(this), a = this.pause.bind(this), o = this.play.bind(this);
  this.el.addEventListener("click", t), this.el.addEventListener("keydown", r), this.nodes.wrapper.addEventListener("touchstart", e), this.nodes.wrapper.addEventListener("touchmove", s), this.nodes.wrapper.addEventListener("touchend", i), this.el.addEventListener("mouseenter", a), this.el.addEventListener("mouseleave", o);
}
class V {
  constructor(e, s) {
    if (this.el = e, this.currentSettings = O.call(this, s), this.nodes = k.call(this), this._templates = {}, B.call(this), this.nodes.playstop) {
      const i = this.nodes.playstop.getAttribute(w).split("|");
      this._templates.playstop = {
        tpl: this.nodes.playstop.innerHTML,
        playLabel: i[0],
        stopLabel: i[1]
      };
    }
    if (this.nodes.prev) {
      const i = this.nodes.prev.getAttribute(m).split("|");
      this._templates.prev = {
        tpl: this.nodes.prev.innerHTML,
        label: i[0],
        lastLabel: i[1]
      };
    }
    if (this.nodes.next) {
      const i = this.nodes.next.getAttribute(y).split("|");
      this._templates.next = {
        tpl: this.nodes.next.innerHTML,
        label: i[0],
        lastLabel: i[1]
      };
    }
    this.currentSettings.disable || u.call(this);
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
    this.activePage = e, this.activePage < 0 && (this.activePage = this.currentSettings.loop && !s ? this.pagesLength - 1 : 0), this.activePage > this.pagesLength - 1 && (this.activePage = this.currentSettings.loop && !s ? 0 : this.pagesLength - 1), X.call(this);
  }
  reinit() {
    this.disable(), this.nodes.items = [].slice.call(this.el.querySelectorAll(`[${f}]`)), u.call(this);
  }
  disable() {
    this.stop(), this.nodes.wrapper.removeEventListener("touchstart", this.onTouchStart), this.nodes.wrapper.removeEventListener("touchmove", this.onTouchMove), this.nodes.wrapper.removeEventListener("touchend", this.onTouchEnd), this.el.removeEventListener("click", this.onClick), this.el.removeEventListener("keydown", this.onKeydown), this.el.removeEventListener("mouseenter", this.onMouseEnter), this.el.removeEventListener("mouseleave", this.onMouseLeave), this.nodes.paging.hidden = !0, this.nodes.prev.hidden = !0, this.nodes.next.hidden = !0, this.nodes.playstop.hidden = !0, this.nodes.overflow.removeAttribute("style"), this.nodes.wrapper.removeAttribute("style"), this.nodes.items.forEach((e) => {
      e == null || e.forEach((s) => {
        s.removeAttribute("tabindex"), s.removeAttribute("aria-hidden"), s.removeAttribute("style");
      });
    }), this.el.classList.remove(l);
  }
}
const v = (t, e) => {
  !t.pmCarousel && t.hasAttribute(n) && (t.pmCarousel = new V(t, e));
}, j = function(t = {}, e) {
  e !== null && (e = e || document.querySelectorAll(`[${n}]`), e.length ? e.forEach((s) => v(s, t)) : v(e, t));
};
window.pmCarousel = j;
export {
  j as default
};
