// https://www.lexilogos.com/keyboard/chinese_pinyin.htm

import "./style.scss";

import { vocabulary } from "./vocabulary";
import prepareObj from "./prepare-obj";

import tableify from "tableify";
import Tablesort from "tablesort";

const tableWrapperNode = document.querySelector("[data-table]");
tableWrapperNode.innerHTML = tableify(prepareObj(vocabulary));

new Tablesort(document.querySelector("table"));

const detailsNode = document.querySelector("[data-details]");
const detailsIframeNode = document.querySelector("[data-details-iframe]");

document.addEventListener("click", (ev) => {
	const openNode = ev.target.closest("[data-details-open]");
	const closeNode = ev.target.closest("[data-details-close]");

	if (openNode) {
		detailsNode.hidden = false;
		detailsIframeNode.src = `https://www.mdbg.net/chinese/dictionary?page=worddict&wdrst=1&wdqb=${openNode.dataset.detailsOpen}`;
	}

	if (closeNode) {
		detailsNode.hidden = true;
		detailsIframeNode.src = "";
	}
});

// filter
const inputNode = document.querySelector("[data-table-filter]");
const unfilterNode = document.querySelector("[data-table-unfilter]");
const trNode = tableWrapperNode.querySelectorAll("tbody tr");

inputNode.addEventListener("input", (ev) => {
	trNode.forEach(
		(node) => (node.hidden = !node.textContent.includes(ev.target.value))
	);
	unfilterNode.hidden = !ev.target.value;
});

unfilterNode.addEventListener("click", () => {
	trNode.forEach((node) => (node.hidden = false));
	inputNode.value = "";
	unfilterNode.hidden = true;
});
