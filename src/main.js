// https://www.lexilogos.com/keyboard/chinese_pinyin.htm

import "./style.scss";

import { vocabulary } from "./vocabulary";
import prepareObj from "./prepare-obj";

import tableify from "tableify";
import Tablesort from "tablesort";

function cleanString(string) {
	return string
		.replace(/[āáǎà]/g, "a")
		.replace(/[ēéěè]/g, "e")
		.replace(/[īíǐì]/g, "i")
		.replace(/[ōóǒò]/g, "o")
		.replace(/[ūúǔù]/g, "u")
		.replaceAll(" ", "")
		.toUpperCase();
}

// const optionsQueryParams = "&dmsm=0&wdrst=1&rfs=1&dhlm=0";
const optionsQueryParams = "&wdrst=1";
let isOpened = false;

const tableWrapperNode = document.querySelector("[data-table]");
tableWrapperNode.innerHTML = tableify(prepareObj(vocabulary));
new Tablesort(document.querySelector("table"));

const inputNode = document.querySelector("[data-table-filter]");
const unfilterNode = document.querySelector("[data-table-unfilter]");
const detailsNode = document.querySelector("[data-details]");
const detailsIframeNode = document.querySelector("[data-details-iframe]");
const trNodes = [...tableWrapperNode.querySelectorAll("tbody tr")];

const sanitizedWords = trNodes.map((node) => cleanString(node.textContent));

// load iframe on the 1st word
detailsIframeNode.src = `https://www.mdbg.net/chinese/dictionary?page=worddict${optionsQueryParams}&wdqb=${
	trNodes[0].querySelector("[data-details-open]").textContent
}`;

// iframe loaded
detailsIframeNode.addEventListener("load", () => {
	detailsIframeNode.style.opacity = 1;
	inputNode.focus();
});

document.addEventListener("click", (ev) => {
	const openNode = ev.target.closest("[data-details-open]");
	const toggleNode = ev.target.closest("[data-details-toggle]");

	if (openNode) {
		detailsIframeNode.style.opacity = 0;
		detailsIframeNode.src = `https://www.mdbg.net/chinese/dictionary?page=worddict${optionsQueryParams}&wdqb=${openNode.dataset.detailsOpen}`;

		if (!isOpened) {
			isOpened = true;
			detailsNode.style.transform = "translateY(0)";
		}
	}

	if (toggleNode) {
		if (isOpened) {
			detailsNode.style.transform = "translateY(100%)";
		} else {
			detailsNode.style.transform = "translateY(0)";
		}
		isOpened = !isOpened;
	}
});

// filter
inputNode.addEventListener("input", (ev) => {
	sanitizedWords.forEach(
		(word, index) =>
			(trNodes[index].hidden = !word
				.toUpperCase()
				.includes(cleanString(ev.target.value)))
	);
});

// remove filter
unfilterNode.addEventListener("click", () => {
	trNodes.forEach((node) => (node.hidden = false));
	inputNode.value = "";
});

// put focus on filter field
window.addEventListener("keydown", (ev) => {
	if (
		ev.keyCode >= 65 &&
		ev.keyCode <= 90 &&
		!ev.ctrlKey &&
		!ev.metaKey &&
		document.activeElement.tagName !== "INPUT"
	) {
		inputNode.focus();
	}

	if (ev.key === "Escape") {
		inputNode.value = "";
		inputNode.dispatchEvent(new CustomEvent("input"));
	}
});
