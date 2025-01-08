import {
	ATTR,
	ACTIVECLASS,
	ATTRITEM,
	TRANSITION,
	TRANSITION_SWIPE,
} from "./src/constants"

import init from "./src/init"
import setActive from "./src/setActive"
import getConfig from "./src/getConfig"
import getNodes from "./src/getNodes"
import getTemplates from "./src/getTemplates"
import { addEvents, removeEvents } from "./src/events"

// test `inert` support
const supportsInert = (() => {
	const testElement = document.createElement("div")
	testElement.setAttribute("inert", "")
	return testElement.inert === true
})()

class Plugin {
	constructor(el, settings) {
		this.el = el
		this.supportsInert = supportsInert

		this.currentSettings = getConfig.call(this, settings)

		this.nodes = getNodes.call(this)
		this._templates = getTemplates.call(this)

		addEvents.call(this)

		if (
			!(
				this.currentSettings.disable === true ||
				(this.currentSettings.disable === "auto" &&
					this.currentSettings.group >= this.nodes.size)
			)
		) {
			init.call(this)
		}
	}

	play() {
		// "stop" status !== pause
		if (!this.nodes.playstop || this.autoplayStatus === "stop") {
			return
		}

		this.pause() // clear interval

		// can't autoplay without loop
		this.currentSettings.loop = true
		this.autoplayStatus = "play"
		this.nodes.playstop.classList.add("is-playing")

		this.nodes.playstop.innerHTML = this._templates.playstop.tpl.replace(
			"{text}",
			this._templates.playstop.playLabel
		)

		let newActive = this.activePage
		this._interval = window.setInterval(() => {
			newActive++

			// must loop even with loop: false
			if (newActive > this.pagesLength - 1) {
				newActive = 0
			}

			this.changeActive(newActive)
		}, this.currentSettings.autoplay)
	}

	pause() {
		window.clearInterval(this._interval)
	}

	stop() {
		if (!this.nodes.playstop) return

		this.autoplayStatus = "stop"
		this.nodes.playstop.classList.remove("is-playing")

		this.nodes.playstop.innerHTML = this._templates.playstop.tpl.replace(
			"{text}",
			this._templates.playstop.stopLabel
		)
		window.clearInterval(this._interval)
	}

	toggleAutoplay() {
		if (!this.nodes.playstop) return

		if (this.autoplayStatus === "play") {
			this.stop()
		} else if (this.autoplayStatus === "stop") {
			this.autoplayStatus = "play"
			this.play()
		}
	}

	changeActive(newActive, isSwipe) {
		this.activePage = newActive

		if (this.activePage < 0) {
			this.activePage =
				this.currentSettings.loop && !isSwipe ? this.pagesLength - 1 : 0
		}

		if (this.activePage > this.pagesLength - 1) {
			this.activePage =
				this.currentSettings.loop && !isSwipe ? 0 : this.pagesLength - 1
		}

		if (isSwipe) {
			this.nodes.overflow.style.transition = TRANSITION_SWIPE
		} else {
			this.nodes.overflow.style.transition = TRANSITION
		}

		setActive.call(this)
	}

	reinit() {
		this.disable()
		this.nodes.items = [...this.el.querySelectorAll(`[${ATTRITEM}]`)]
		init.call(this)
	}

	disable() {
		this.stop()
		removeEvents.call(this)

		if (this.nodes.paging) {
			this.nodes.paging.hidden = true
		}

		if (this.nodes.prev) {
			this.nodes.prev.hidden = true
		}

		if (this.nodes.next) {
			this.nodes.next.hidden = true
		}

		if (this.nodes.playstop) {
			this.nodes.playstop.hidden = true
		}

		this.nodes.overflow.removeAttribute("style")
		this.nodes.wrapper.removeAttribute("style")

		this.nodes.items.forEach((nodes) => {
			// Items may have not been initialized yet.
			if (Array.isArray(nodes)) {
				nodes.forEach((node) => {
					node.removeAttribute("tabindex")
					node.removeAttribute("aria-hidden")
					node.removeAttribute("style")
				})
			}
		})

		this.el.classList.remove(ACTIVECLASS)
	}
}

const initPmCarousel = (node, settings) => {
	if (!node.pmCarousel && node.hasAttribute(ATTR)) {
		node.pmCarousel = new Plugin(node, settings)
	}
}

const pmCarousel = function (settings = {}, nodes) {
	if (!nodes) return

	nodes = nodes instanceof NodeList ? [...nodes] : [nodes]

	nodes.forEach((node) => initPmCarousel(node, settings))
}

window.pmCarousel = pmCarousel

export default pmCarousel
