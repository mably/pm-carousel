const ATTR = "data-pm-carousel";
const ATTRPAGING = `${ATTR}-paging`;
const ATTRWRAPPER = `${ATTR}-wrapper`;
const ATTROVERFLOW = `${ATTR}-overflow`;
const ATTRITEM = `${ATTR}-item`;
const ATTRPREV = `${ATTR}-prev`;
const ATTRNEXT = `${ATTR}-next`;
const ATTRPLAYSTOP = `${ATTR}-playstop`;
const TRANSITION = "transform .5s ease-in-out";
const TRANSITION_SWIPE = "transform .1s ease-out";
const ACTIVECLASS = "is-active";
const SLIDE_MIN_RATIO = 6;
const buildActions = {
  playstop: function() {
    if (!this.nodes.playstop) return;
    this.nodes.playstop.hidden = !this.currentSettings.autoplay;
  },
  wrapper: function() {
    const startSpace = this.currentSettings.noStartSpace ? 0 : this.currentSettings.spaceAround;
    this.nodes.overflow.style.transform = `translateX(${this.activePage * -100 + startSpace}%)`;
    if (this.currentSettings.noStartSpace) {
      this.nodes.overflow.style.paddingRight = this.currentSettings.spaceAround + "%";
    } else {
      this.nodes.overflow.style.paddingRight = startSpace + "%";
      this.nodes.overflow.style.paddingLeft = startSpace + "%";
    }
    this.nodes.overflow.style.transition = TRANSITION;
    this.nodes.overflow.style.display = "flex";
    this.nodes.wrapper.style.overflow = "hidden";
    this.el.classList.add(ACTIVECLASS);
  },
  slides: function() {
    const newSlides = [];
    this.nodes.items.forEach((node, index) => {
      node.setAttribute("tabindex", "-1");
      node.setAttribute(ATTR + "-item", index);
      node.style.flex = `1 0 ${100 / this.currentSettings.group}%`;
      node.style.overflow = "hidden";
    });
    while (this.nodes.items.length > 0) {
      newSlides.push(this.nodes.items.splice(0, this.currentSettings.group));
    }
    this.nodes.items = newSlides;
    this.pagesLength = this.nodes.items.length;
  },
  paging: function() {
    if (!this.nodes.paging) return;
    let newPage, btnString;
    const pages = document.createDocumentFragment();
    this.nodes.paging.innerHTML = "";
    this.nodes.pages = [];
    this.nodes.items.forEach((_node, index) => {
      btnString = this._templates.pagingTpl;
      newPage = document.createElement("div");
      newPage.innerHTML = btnString.replace("{nbr}", ++index);
      this.nodes.pages.push(newPage.firstElementChild);
      pages.appendChild(newPage.firstElementChild);
    });
    this.nodes.paging.append(pages);
    this.nodes.paging.hidden = false;
  }
};
function build() {
  const elements = ["slides", "wrapper", "playstop", "paging"];
  elements.forEach((action) => buildActions[action].call(this));
}
function init() {
  this.activePage = 0;
  this._interval = null;
  this.autoplayStatus = "stop";
  this._metrics = {
    touchstartX: 0,
    touchmoveX: 0,
    moveX: 0,
    slideWidth: 0
  };
  build.call(this);
  this.changeActive(this.activePage);
  if (this.currentSettings.autoplay > 1 && this.nodes.playstop) {
    this.autoplayStatus = "play";
    this.play();
  } else {
    this.stop();
  }
}
function updateScroll() {
  this._metrics.slideWidth = this.nodes.overflow.scrollWidth / this.nodes.size * this.currentSettings.group;
  this._metrics.distance = this.activePage * this._metrics.slideWidth;
  if (!this.currentSettings.allowIncompleteLastPage && this.activePage === this.pagesLength - 1) {
    this._metrics.distance = this.nodes.overflow.scrollWidth - this._metrics.slideWidth;
    if (this.currentSettings.spaceAround) {
      this._metrics.distance -= parseInt(
        window.getComputedStyle(this.nodes.overflow).getPropertyValue("padding-right"),
        10
      );
    }
  }
  this.nodes.overflow.style.transform = `translateX(${-this._metrics.distance}px`;
}
function updateNavBtns() {
  const updateBtn = (type, condition) => {
    const node = this.nodes[type];
    if (!node) return;
    const template = this._templates[type];
    node.innerHTML = template.tpl.replace(
      "{text}",
      condition ? template.lastLabel : template.label
    );
    this.currentSettings.loop ? node.hidden = false : node.hidden = condition;
  };
  const isFirstPage = this.activePage === 0;
  const isLastPage = this.activePage === this.pagesLength - 1;
  updateBtn("prev", isFirstPage);
  updateBtn("next", isLastPage);
}
function disableKeyboardNavigation(element) {
  const focusableElements = element.querySelectorAll(
    "a, button, input, textarea, select, [tabindex]"
  );
  focusableElements.forEach((el) => {
    if (!el.hasAttribute("data-original-tabindex")) {
      el.setAttribute("data-original-tabindex", el.getAttribute("tabindex"));
    }
    el.setAttribute("tabindex", "-1");
    el.setAttribute("aria-hidden", "true");
  });
}
function enableKeyboardNavigation(element) {
  const focusableElements = element.querySelectorAll(
    '[tabindex="-1"], [aria-hidden="true"]'
  );
  focusableElements.forEach((el) => {
    const originalTabIndex = el.getAttribute("data-original-tabindex");
    if (originalTabIndex !== null) {
      if (originalTabIndex === "null") {
        el.removeAttribute("tabindex");
      } else {
        el.setAttribute("tabindex", originalTabIndex);
      }
      el.removeAttribute("data-original-tabindex");
    }
    el.removeAttribute("aria-hidden");
  });
}
function setActive() {
  this.visibleSlides = [];
  if (this.nodes.paging) {
    this.nodes.pages.forEach((node, index) => {
      let pageBtn = node.querySelector("button") || node;
      if (index === this.activePage) {
        pageBtn.setAttribute("aria-current", "true");
        node.classList.add(ACTIVECLASS);
      } else {
        pageBtn.removeAttribute("aria-current");
        node.classList.remove(ACTIVECLASS);
      }
    });
  }
  this.nodes.items.forEach((nodes, index) => {
    nodes.forEach((node, indexFirstItem) => {
      const isActiveSlide = index === this.activePage;
      if (isActiveSlide) {
        node.removeAttribute("aria-hidden");
        if (this.supportsInert) {
          node.inert = false;
        } else {
          enableKeyboardNavigation(node);
        }
        this.visibleSlides.push(node);
        if (this.focused && indexFirstItem === 0 && this.autoplayStatus !== "play") {
          node.focus({ preventScroll: true });
        }
      } else {
        node.setAttribute("aria-hidden", "true");
        if (this.supportsInert) {
          node.inert = true;
        } else {
          disableKeyboardNavigation(node);
        }
      }
    });
  });
  updateScroll.call(this);
  updateNavBtns.call(this);
}
function extend() {
  const extended = {};
  let deep = false;
  let i = 0;
  const length = arguments.length;
  if (Object.prototype.toString.call(arguments[0]) === "[object Boolean]") {
    deep = arguments[0];
    i++;
  }
  const merge = function(obj) {
    for (const prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        if (deep && Object.prototype.toString.call(obj[prop]) === "[object Object]") {
          extended[prop] = extend(true, extended[prop], obj[prop]);
        } else {
          extended[prop] = obj[prop];
        }
      }
    }
  };
  for (; i < length; i++) {
    const obj = arguments[i];
    merge(obj);
  }
  return extended;
}
function toJson(string) {
  try {
    return JSON.parse(string);
  } catch (error) {
    return {};
  }
}
const DEFAULT = {
  default: {
    loop: true,
    group: 1,
    spaceAround: 0,
    noStartSpace: false,
    autoplay: 0,
    allowIncompleteLastPage: false
  }
};
function getConfig(settings = {}) {
  const getMqConfig = () => {
    const updatedMqConfig = this.settings.responsive.slice().reverse().find(
      (mqConfigs) => window.matchMedia(`(min-width: ${mqConfigs.minWidth})`).matches
    );
    return updatedMqConfig ? { ...this.settings.default, ...updatedMqConfig } : this.settings.default;
  };
  let timeout;
  let checkDebounce = false;
  const onMatchMedia = () => {
    if (checkDebounce) return;
    checkDebounce = true;
    timeout = setTimeout(() => {
      this.currentSettings = getMqConfig.call(this);
      if (this.currentSettings.disable === true || this.currentSettings.disable === "auto" && this.currentSettings.group >= this.nodes.size) {
        this.disable();
      } else {
        this.reinit();
      }
      checkDebounce = false;
      clearTimeout(timeout);
    }, 200);
  };
  const elSettings = toJson(this.el.getAttribute(ATTR));
  this.settings = extend(true, {}, DEFAULT, settings, elSettings);
  let config = this.settings.default;
  if (this.settings.responsive) {
    this.settings.responsive.sort(
      (a, b) => parseInt(a.minWidth, 10) - parseInt(b.minWidth, 10)
    );
    config = getMqConfig.call(this);
    this.settings.responsive.forEach((config2) => {
      const mql = window.matchMedia(`(min-width: ${config2.minWidth})`);
      mql.addEventListener("change", onMatchMedia.bind(this));
    });
  }
  return config;
}
function getNodes() {
  const nodes = {
    paging: this.el.querySelector(`[${ATTRPAGING}]`),
    prev: this.el.querySelector(`[${ATTRPREV}]`),
    next: this.el.querySelector(`[${ATTRNEXT}]`),
    playstop: this.el.querySelector(`[${ATTRPLAYSTOP}]`),
    overflow: this.el.querySelector(`[${ATTROVERFLOW}]`),
    wrapper: this.el.querySelector(`[${ATTRWRAPPER}]`),
    items: [...this.el.querySelectorAll(`[${ATTRITEM}]`)]
  };
  nodes.size = nodes.items.length;
  return nodes;
}
function getTemplates() {
  const templates = {};
  const createTemplate = (node, attr, keys) => {
    var _a;
    if (node) {
      const labels = (_a = node.getAttribute(attr)) == null ? void 0 : _a.split("|");
      if (labels && labels.length === keys.length) {
        return {
          tpl: node.innerHTML,
          ...Object.fromEntries(keys.map((key, i) => [key, labels[i]]))
        };
      }
    }
    return null;
  };
  if (this.nodes) {
    templates.playstop = createTemplate(this.nodes.playstop, ATTRPLAYSTOP, [
      "playLabel",
      "stopLabel"
    ]);
    templates.prev = createTemplate(this.nodes.prev, ATTRPREV, [
      "label",
      "lastLabel"
    ]);
    templates.next = createTemplate(this.nodes.next, ATTRNEXT, [
      "label",
      "lastLabel"
    ]);
    if (this.nodes.paging) {
      templates.pagingTpl = this.nodes.paging.innerHTML;
    }
  }
  return templates;
}
function onClick(ev) {
  const targetNode = ev.target;
  const actions = {
    [`${ATTR}-playstop`]: () => this.toggleAutoplay(),
    [`${ATTR}-prev`]: () => this.changeActive(this.activePage - 1),
    [`${ATTR}-next`]: () => this.changeActive(this.activePage + 1),
    [`${ATTR}-paging`]: () => {
      const targetBtn = targetNode.closest(`[${ATTR}-paging] li`);
      if (targetBtn) {
        const newActive = this.nodes.pages.indexOf(targetBtn);
        this.changeActive(newActive);
      }
    }
  };
  for (const [selector, action] of Object.entries(actions)) {
    if (targetNode.closest(`[${selector}]`)) {
      if (selector !== `${ATTR}-playstop`) {
        this.stop();
      }
      action();
      break;
    }
  }
}
function onKeydown(event) {
  const keyActions = {
    ArrowUp: () => this.changeActive(this.activePage - 1),
    ArrowLeft: () => this.changeActive(this.activePage - 1),
    ArrowDown: () => this.changeActive(this.activePage + 1),
    ArrowRight: () => this.changeActive(this.activePage + 1),
    Home: () => this.changeActive(0),
    End: () => this.changeActive(this.pagesLength - 1)
  };
  const action = keyActions[event.key];
  if (action) {
    action();
    event.preventDefault();
  }
}
const timeouts = {
  onTouchStart: null,
  onTouchMove: null,
  onTouchEnd: null
};
function handleRequestAnimationFrame(type, callback) {
  if (timeouts[type]) {
    window.cancelAnimationFrame(timeouts[type]);
  }
  timeouts[type] = window.requestAnimationFrame(callback);
}
function onTouchStart(ev) {
  handleRequestAnimationFrame("onTouchStart", () => {
    this.stop();
    this.nodes.overflow.style.transition = "none";
    this._metrics.touchstartX = Math.round(ev.touches[0].pageX);
    this._metrics.touchstartY = Math.round(ev.touches[0].pageY);
    this._metrics.slideWidth = this.nodes.wrapper.offsetWidth;
    this._metrics.isScrolling = false;
    this._metrics.isSwiping = false;
  });
}
function onTouchMove(ev) {
  handleRequestAnimationFrame("onTouchMove", () => {
    this._metrics.moveX = this._metrics.touchstartX - Math.round(ev.touches[0].pageX);
    this._metrics.moveY = this._metrics.touchstartY - Math.round(ev.touches[0].pageY);
    if (!this._metrics.isScrolling && !this._metrics.isSwiping) {
      if (Math.abs(this._metrics.moveX) > Math.abs(this._metrics.moveY)) {
        this._metrics.isSwiping = true;
      } else {
        this._metrics.isScrolling = true;
      }
    }
    if (this._metrics.isSwiping) {
      document.documentElement.style.overflow = "hidden";
      this.nodes.overflow.style.transform = `translateX(${-this._metrics.distance - this._metrics.moveX}px)`;
    }
  });
}
function onTouchEnd() {
  handleRequestAnimationFrame("onTouchEnd", () => {
    if (!this._metrics.isSwiping) {
      return;
    }
    const goToNext = this._metrics.moveX > this._metrics.slideWidth / SLIDE_MIN_RATIO;
    const goToPrev = this._metrics.moveX < -this._metrics.slideWidth / SLIDE_MIN_RATIO;
    document.documentElement.style.removeProperty("overflow");
    let newActive = this.activePage;
    this._metrics.moveX = 0;
    this._metrics.isScrolling = false;
    this._metrics.isSwiping = false;
    if (!goToNext && !goToPrev) {
      this.nodes.overflow.style.transition = TRANSITION;
      this.nodes.overflow.style.transform = `translateX(${-this._metrics.distance}px)`;
      return;
    }
    goToNext ? newActive += 1 : newActive -= 1;
    this.changeActive(newActive, true);
  });
}
function manageEvents(add = true) {
  const method = add ? "addEventListener" : "removeEventListener";
  const handleFocusIn = (event) => {
    this.focused = true;
    !event.target.closest(`[${ATTRPLAYSTOP}]`) ? this.pause() : this.play();
  };
  const handleFocusOut = () => {
    this.focused = false;
    this.play.bind(this);
  };
  ["touchstart", "touchmove", "touchend"].forEach((event, index) => {
    const handler = [onTouchStart, onTouchMove, onTouchEnd][index];
    this.nodes.wrapper[method](event, handler.bind(this));
  });
  this.el[method]("click", onClick.bind(this));
  this.el[method]("keydown", onKeydown.bind(this));
  this.el[method]("focusin", handleFocusIn);
  this.el[method]("focusout", handleFocusOut);
  this.el[method]("mouseenter", this.pause.bind(this));
  this.el[method]("mouseleave", this.play.bind(this));
}
function addEvents() {
  manageEvents.call(this, true);
}
function removeEvents() {
  manageEvents.call(this, false);
}
const supportsInert = (() => {
  const testElement = document.createElement("div");
  testElement.setAttribute("inert", "");
  return testElement.inert === true;
})();
class Plugin {
  constructor(el, settings) {
    this.el = el;
    this.supportsInert = supportsInert;
    this.currentSettings = getConfig.call(this, settings);
    this.nodes = getNodes.call(this);
    this._templates = getTemplates.call(this);
    addEvents.call(this);
    if (!(this.currentSettings.disable === true || this.currentSettings.disable === "auto" && this.currentSettings.group >= this.nodes.size)) {
      init.call(this);
    }
  }
  play() {
    if (!this.nodes.playstop || this.autoplayStatus === "stop") {
      return;
    }
    this.pause();
    this.currentSettings.loop = true;
    this.autoplayStatus = "play";
    this.nodes.playstop.classList.add("is-playing");
    this.nodes.playstop.innerHTML = this._templates.playstop.tpl.replace(
      "{text}",
      this._templates.playstop.playLabel
    );
    let newActive = this.activePage;
    this._interval = window.setInterval(() => {
      newActive++;
      if (newActive > this.pagesLength - 1) {
        newActive = 0;
      }
      this.changeActive(newActive);
    }, this.currentSettings.autoplay);
  }
  pause() {
    window.clearInterval(this._interval);
  }
  stop() {
    if (!this.nodes.playstop) return;
    this.autoplayStatus = "stop";
    this.nodes.playstop.classList.remove("is-playing");
    this.nodes.playstop.innerHTML = this._templates.playstop.tpl.replace(
      "{text}",
      this._templates.playstop.stopLabel
    );
    window.clearInterval(this._interval);
  }
  toggleAutoplay() {
    if (!this.nodes.playstop) return;
    if (this.autoplayStatus === "play") {
      this.stop();
    } else if (this.autoplayStatus === "stop") {
      this.autoplayStatus = "play";
      this.play();
    }
  }
  changeActive(newActive, isSwipe) {
    this.activePage = newActive;
    if (this.activePage < 0) {
      this.activePage = this.currentSettings.loop && !isSwipe ? this.pagesLength - 1 : 0;
    }
    if (this.activePage > this.pagesLength - 1) {
      this.activePage = this.currentSettings.loop && !isSwipe ? 0 : this.pagesLength - 1;
    }
    if (isSwipe) {
      this.nodes.overflow.style.transition = TRANSITION_SWIPE;
    } else {
      this.nodes.overflow.style.transition = TRANSITION;
    }
    setActive.call(this);
  }
  reinit() {
    this.disable();
    this.nodes.items = [...this.el.querySelectorAll(`[${ATTRITEM}]`)];
    init.call(this);
  }
  disable() {
    this.stop();
    removeEvents.call(this);
    if (this.nodes.paging) {
      this.nodes.paging.hidden = true;
    }
    if (this.nodes.prev) {
      this.nodes.prev.hidden = true;
    }
    if (this.nodes.next) {
      this.nodes.next.hidden = true;
    }
    if (this.nodes.playstop) {
      this.nodes.playstop.hidden = true;
    }
    this.nodes.overflow.removeAttribute("style");
    this.nodes.wrapper.removeAttribute("style");
    this.nodes.items.forEach((nodes) => {
      if (Array.isArray(nodes)) {
        nodes.forEach((node) => {
          node.removeAttribute("tabindex");
          node.removeAttribute("aria-hidden");
          node.removeAttribute("style");
        });
      }
    });
    this.el.classList.remove(ACTIVECLASS);
  }
}
const initPmCarousel = (node, settings) => {
  if (!node.pmCarousel && node.hasAttribute(ATTR)) {
    node.pmCarousel = new Plugin(node, settings);
  }
};
const pmCarousel = function(settings = {}, nodes) {
  if (!nodes) return;
  nodes = nodes instanceof NodeList ? [...nodes] : [nodes];
  nodes.forEach((node) => initPmCarousel(node, settings));
};
window.pmCarousel = pmCarousel;
export {
  pmCarousel as default
};
