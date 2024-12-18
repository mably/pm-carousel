import {
	ATTRPAGING,
	ATTRPREV,
	ATTRNEXT,
	ATTRPLAYSTOP,
	ATTRWRAPPER,
	ATTRITEM,
	ATTROVERFLOW,
} from "./constants"

function getNodes() {
	const nodes = {
		paging: this.el.querySelector(`[${ATTRPAGING}]`),
		prev: this.el.querySelector(`[${ATTRPREV}]`),
		next: this.el.querySelector(`[${ATTRNEXT}]`),
		playstop: this.el.querySelector(`[${ATTRPLAYSTOP}]`),
		overflow: this.el.querySelector(`[${ATTROVERFLOW}]`),
		wrapper: this.el.querySelector(`[${ATTRWRAPPER}]`),
		items: [...this.el.querySelectorAll(`[${ATTRITEM}]`)],
	}
	nodes.size = nodes.items.length
	return nodes
}

export default getNodes
