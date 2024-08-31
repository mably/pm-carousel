const n = "data-pm-carousel", x = `${n}-paging`, _ = `${n}-wrapper`, P = `${n}-overflow`, y = `${n}-item`, b = `${n}-prev`, w = `${n}-next`, g = `${n}-playstop`, A = "transform .5s ease-in-out", l = "is-active", $ = {
  playstop: function() {
    this.nodes.playstop && (this.nodes.playstop.hidden = !this.currentSettings.autoplay);
  },
  wrapper: function() {
    const t = this.currentSettings.noStartSpace ? 0 : this.currentSettings.spaceAround;
    this.nodes.overflow.style.transform = `translateX(${this.activePage * -100 + t}%)`, this.currentSettings.noStartSpace ? this.nodes.overflow.style.paddingRight = this.currentSettings.spaceAround + "%" : (this.nodes.overflow.style.paddingRight = t + "%", this.nodes.overflow.style.paddingLeft = t + "%"), this.nodes.overflow.style.transition = A, this.nodes.overflow.style.display = "flex", this.nodes.wrapper.style.overflow = "hidden", this.el.classList.add(l);
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
function M() {
  ["slides", "wrapper", "playstop", "paging"].forEach((e) => $[e].call(this));
}
function f() {
  this.activePage = 0, this._interval = null, this.autoplayStatus = "stop", this._metrics = {
    touchstartX: 0,
    touchmoveX: 0,
    moveX: 0,
    slideWidth: 0
  }, M.call(this), this.changeActive(this.activePage), this.currentSettings.autoplay > 1 && this.nodes.playstop ? (this.autoplayStatus = "play", this.play()) : this.stop();
}
function q() {
  this._metrics.slideWidth = this.visibleSlides[0].offsetWidth * this.currentSettings.group, this._metrics.distance = this.activePage * this._metrics.slideWidth, this.activePage === this.pagesLength - 1 && (this._metrics.distance = this.nodes.overflow.scrollWidth - this._metrics.slideWidth, this.currentSettings.spaceAround && (this._metrics.distance -= parseInt(
    window.getComputedStyle(this.nodes.overflow).getPropertyValue("padding-right"),
    10
  ))), this.nodes.overflow.style.transform = `translateX(${-this._metrics.distance}px`;
}
function X() {
  this.nodes.prev && (this.nodes.prev.innerHTML = this._templates.prev.tpl.replace(
    "{text}",
    this.activePage === 0 ? this._templates.prev.lastLabel : this._templates.prev.label
  ), this.currentSettings.loop ? this.nodes.prev.hidden = !1 : this.nodes.prev.hidden = this.activePage === 0);
}
function C() {
  this.nodes.next && (this.nodes.next.innerHTML = this._templates.next.tpl.replace(
    "{text}",
    this.activePage === this.pagesLength - 1 ? this._templates.next.lastLabel : this._templates.next.label
  ), this.currentSettings.loop ? this.nodes.next.hidden = !1 : this.nodes.next.hidden = this.activePage === this.pagesLength - 1);
}
function I(t) {
  t.querySelectorAll(
    "a, button, input, textarea, select, [tabindex]"
  ).forEach((s) => {
    s.hasAttribute("data-original-tabindex") || s.setAttribute("data-original-tabindex", s.getAttribute("tabindex")), s.setAttribute("tabindex", "-1"), s.setAttribute("aria-hidden", "true");
  });
}
function R(t) {
  t.querySelectorAll(
    '[tabindex="-1"], [aria-hidden="true"]'
  ).forEach((s) => {
    const i = s.getAttribute("data-original-tabindex");
    i !== null && (i === "null" ? s.removeAttribute("tabindex") : s.setAttribute("tabindex", i), s.removeAttribute("data-original-tabindex")), s.removeAttribute("aria-hidden");
  });
}
function W() {
  this.visibleSlides = [], this.nodes.paging && this.nodes.pages.forEach((t, e) => {
    let s = t;
    const i = t.querySelector("button");
    i && (s = i), e === this.activePage ? (s.setAttribute("aria-current", "true"), t.classList.add(l)) : (s.removeAttribute("aria-current"), t.classList.remove(l));
  }), this.nodes.items.forEach((t, e) => {
    t.forEach((s, i) => {
      e === this.activePage ? (s.removeAttribute("aria-hidden"), this.supportsInert ? s.inert = !1 : R(s), this.visibleSlides.push(s), setTimeout(() => {
        i === 0 && this.autoplayStatus !== "play" && s.focus({ preventScroll: !0 });
      }, 0)) : (s.setAttribute("aria-hidden", "true"), this.supportsInert ? s.inert = !0 : I(s));
    });
  }), q.call(this), X.call(this), C.call(this);
}
function S() {
  const t = {};
  let e = !1, s = 0;
  const i = arguments.length;
  Object.prototype.toString.call(arguments[0]) === "[object Boolean]" && (e = arguments[0], s++);
  const r = function(o) {
    for (const a in o)
      Object.prototype.hasOwnProperty.call(o, a) && (e && Object.prototype.toString.call(o[a]) === "[object Object]" ? t[a] = S(!0, t[a], o[a]) : t[a] = o[a]);
  };
  for (; s < i; s++) {
    const o = arguments[s];
    r(o);
  }
  return t;
}
function O(t) {
  try {
    return JSON.parse(t);
  } catch {
    return {};
  }
}
function L() {
  const t = this.settings.responsive.slice().reverse().find(
    (e) => window.matchMedia(`(min-width: ${e.minWidth})`).matches
  );
  return t ? { ...this.settings.default, ...t } : this.settings.default;
}
let v, c = !1;
function k() {
  c || (c = !0, v = setTimeout(() => {
    this.currentSettings = L.call(this), this.currentSettings.disable ? this.disable() : this.reinit(), c = !1, clearTimeout(v);
  }, 200));
}
const N = {
  default: {
    loop: !0,
    group: 1,
    spaceAround: 0,
    noStartSpace: !1,
    autoplay: 0
  }
};
function F(t) {
  const e = O(this.el.getAttribute(n));
  this.settings = S(!0, N, t, e);
  let s = this.settings.default;
  return this.settings.responsive && (this.settings.responsive.sort(
    (i, r) => parseInt(i.minWidth, 10) - parseInt(r.minWidth, 10)
  ), s = L.call(this), this.settings.responsive.forEach((i) => {
    window.matchMedia(`(min-width: ${i.minWidth})`).addEventListener("change", k.bind(this));
  })), s;
}
function H() {
  var e;
  const t = {
    paging: this.el.querySelector(`[${x}]`),
    prev: this.el.querySelector(`[${b}]`),
    next: this.el.querySelector(`[${w}]`),
    playstop: this.el.querySelector(`[${g}]`),
    overflow: this.el.querySelector(`[${P}]`),
    wrapper: this.el.querySelector(`[${_}]`),
    items: [].slice.call(this.el.querySelectorAll(`[${y}]`))
  };
  return t.paging && (t.pagingTpl = (e = t.paging) == null ? void 0 : e.cloneNode(!0)), t;
}
function D(t) {
  let e = this.activePage;
  const s = t.target, i = s.closest(`[${n}-playstop]`), r = s.closest(`[${n}-prev]`), o = s.closest(`[${n}-next]`), a = s.closest(`[${n}-paging]`);
  if (i) {
    this.toggleAutoplay();
    return;
  } else if (r)
    e--;
  else if (o)
    e++;
  else if (a && a.querySelector("button")) {
    const h = s.closest(`[${n}-paging] li`);
    e = this.nodes.pages.indexOf(h);
  } else
    return;
  this.stop(), this.changeActive(e);
}
function B(t) {
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
let p, u, d;
function K(t) {
  p && window.cancelAnimationFrame(p), p = window.requestAnimationFrame(() => {
    this.stop(), this.nodes.overflow.style.transition = "none", this._metrics.touchstartX = Math.round(t.touches[0].pageX), this._metrics.slideWidth = this.nodes.wrapper.offsetWidth;
  });
}
function V(t) {
  u && window.cancelAnimationFrame(u), u = window.requestAnimationFrame(() => {
    this._metrics.touchmoveX = Math.round(t.touches[0].pageX), this._metrics.moveX = this._metrics.touchstartX - this._metrics.touchmoveX, this.nodes.overflow.style.transform = `translateX(${-this._metrics.distance - this._metrics.moveX}px)`;
  });
}
function j() {
  d && window.cancelAnimationFrame(d), d = window.requestAnimationFrame(() => {
    let t = this.activePage;
    if (this.nodes.overflow.style.transition = A, this._metrics.moveX > this._metrics.slideWidth / 3)
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
function G() {
  const t = D.bind(this), e = K.bind(this), s = V.bind(this), i = j.bind(this), r = B.bind(this), o = this.pause.bind(this), a = this.play.bind(this), h = function(T) {
    T.target.closest(`[${g}]`) ? this.play() : this.pause();
  }, E = this.play.bind(this);
  this.el.addEventListener("click", t), this.el.addEventListener("keydown", r), this.el.addEventListener("focusin", h.bind(this)), this.el.addEventListener("focusout", E.bind(this)), this.nodes.wrapper.addEventListener("touchstart", e), this.nodes.wrapper.addEventListener("touchmove", s), this.nodes.wrapper.addEventListener("touchend", i), this.el.addEventListener("mouseenter", o), this.el.addEventListener("mouseleave", a);
}
function J() {
  const t = document.createElement("div");
  return t.setAttribute("inert", ""), t.inert === !0;
}
class U {
  constructor(e, s) {
    if (this.el = e, this.currentSettings = F.call(this, s), this.nodes = H.call(this), this._templates = {}, this.supportsInert = J(), G.call(this), this.nodes.playstop) {
      const i = this.nodes.playstop.getAttribute(g).split("|");
      this._templates.playstop = {
        tpl: this.nodes.playstop.innerHTML,
        playLabel: i[0],
        stopLabel: i[1]
      };
    }
    if (this.nodes.prev) {
      const i = this.nodes.prev.getAttribute(b).split("|");
      this._templates.prev = {
        tpl: this.nodes.prev.innerHTML,
        label: i[0],
        lastLabel: i[1]
      };
    }
    if (this.nodes.next) {
      const i = this.nodes.next.getAttribute(w).split("|");
      this._templates.next = {
        tpl: this.nodes.next.innerHTML,
        label: i[0],
        lastLabel: i[1]
      };
    }
    this.currentSettings.disable || f.call(this);
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
    this.activePage = e, this.activePage < 0 && (this.activePage = this.currentSettings.loop && !s ? this.pagesLength - 1 : 0), this.activePage > this.pagesLength - 1 && (this.activePage = this.currentSettings.loop && !s ? 0 : this.pagesLength - 1), W.call(this);
  }
  reinit() {
    this.disable(), this.nodes.items = [].slice.call(this.el.querySelectorAll(`[${y}]`)), f.call(this);
  }
  disable() {
    this.stop(), this.nodes.wrapper.removeEventListener("touchstart", this.onTouchStart), this.nodes.wrapper.removeEventListener("touchmove", this.onTouchMove), this.nodes.wrapper.removeEventListener("touchend", this.onTouchEnd), this.el.removeEventListener("click", this.onClick), this.el.removeEventListener("keydown", this.onKeydown), this.el.removeEventListener("mouseenter", this.onMouseEnter), this.el.removeEventListener("mouseleave", this.onMouseLeave), this.nodes.paging.hidden = !0, this.nodes.prev.hidden = !0, this.nodes.next.hidden = !0, this.nodes.playstop.hidden = !0, this.nodes.overflow.removeAttribute("style"), this.nodes.wrapper.removeAttribute("style"), this.nodes.items.forEach((e) => {
      e == null || e.forEach((s) => {
        s.removeAttribute("tabindex"), s.removeAttribute("aria-hidden"), s.removeAttribute("style");
      });
    }), this.el.classList.remove(l);
  }
}
const m = (t, e) => {
  !t.pmCarousel && t.hasAttribute(n) && (t.pmCarousel = new U(t, e));
}, Y = function(t = {}, e) {
  e !== null && (e = e || document.querySelectorAll(`[${n}]`), e.length ? e.forEach((s) => m(s, t)) : m(e, t));
};
window.pmCarousel = Y;
export {
  Y as default
};
