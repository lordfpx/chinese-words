// https://www.lexilogos.com/keyboard/chinese_pinyin.htm

import "./style.scss";

import { vocabulary } from "./vocabulary";
import prepareObj from "./prepare-obj";

import tableify from "tableify";
import Tablesort from "tablesort";

function replaceAccent(string) {
	return string
		.replace(/[āáǎà]/g, "a")
		.replace(/[ēéěè]/g, "e")
		.replace(/[īíǐì]/g, "i")
		.replace(/[ōóǒò]/g, "o")
		.replace(/[ūúǔù]/g, "u");
}

const tableWrapperNode = document.querySelector("[data-table]");
tableWrapperNode.innerHTML = tableify(prepareObj(vocabulary));

new Tablesort(document.querySelector("table"));

const detailsNode = document.querySelector("[data-details]");
const detailsIframeNode = document.querySelector("[data-details-iframe]");
const trNodes = [...tableWrapperNode.querySelectorAll("tbody tr")];
detailsIframeNode.src = `https://www.mdbg.net/chinese/dictionary?page=worddict&wdrst=1&wdqb=${
	trNodes[0].querySelector("[data-details-open]").textContent
}`;

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
const sanitizedWords = trNodes.map((node) => replaceAccent(node.textContent));

inputNode.addEventListener("input", (ev) => {
	sanitizedWords.forEach(
		(word, index) => (trNodes[index].hidden = !word.includes(ev.target.value))
	);
});

unfilterNode.addEventListener("click", () => {
	trNodes.forEach((node) => (node.hidden = false));
	inputNode.value = "";
});
