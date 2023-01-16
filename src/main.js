// https://www.lexilogos.com/keyboard/chinese_pinyin.htm

import "./style.scss";

import { vocabulary } from "./vocabulary";

import { json2table } from "./json2table";
import Tablesort from "tablesort";
import HanziWriter from "hanzi-writer";

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
// const optionsQueryParams = "&wdrst=1";
let isOpened = false;

const tableWrapperNode = document.querySelector("[data-table]");
tableWrapperNode.appendChild(json2table(vocabulary));
new Tablesort(document.querySelector("table"));

const inputNode = document.querySelector("[data-table-filter]");
const unfilterNode = document.querySelector("[data-table-unfilter]");
const detailsNode = document.querySelector("[data-details]");
const speachBtnNode = document.querySelector("[data-speach]");
// const detailsIframeNode = document.querySelector("[data-details-iframe]");
const trNodes = [...tableWrapperNode.querySelectorAll("tbody tr")];

const sanitizedWords = trNodes.map((node) => cleanString(node.textContent));

// load iframe on the 1st word
// detailsIframeNode.src = `https://www.mdbg.net/chinese/dictionary?page=worddict${optionsQueryParams}&wdqb=${
// 	trNodes[0].querySelector("[data-details-open]").textContent
// }`;

// iframe loaded
// detailsIframeNode.addEventListener("load", () => {
// 	detailsIframeNode.style.opacity = 1;
// 	inputNode.focus();
// });

const writer = HanziWriter.create(
	"character-target",
	trNodes[0].querySelector("[data-details-open]").textContent,
	{
		width: 300,
		height: 300,
		padding: 0,
		delayBetweenLoops: 2000,
		delayBetweenStrokes: 300,
		strokeAnimationSpeed: 0.7,
	}
);

writer.loopCharacterAnimation();

document.addEventListener("click", (ev) => {
	const openNode = ev.target.closest("[data-details-open]");
	const toggleNode = ev.target.closest("[data-details-toggle]");
	const speachNode = ev.target.closest("[data-speach]");
	const modeNode = ev.target.closest("[data-mode]");

	if (openNode) {
		// detailsIframeNode.style.opacity = 0;
		// detailsIframeNode.src = `https://www.mdbg.net/chinese/dictionary?page=worddict${optionsQueryParams}&wdqb=${openNode.dataset.detailsOpen}`;

		writer.setCharacter(openNode.dataset.detailsOpen);
		writer.animateCharacter();

		if (!isOpened) {
			isOpened = true;
			detailsNode.style.transform = "translateY(0)";
		}
	}

	if (modeNode) {
		const mode = modeNode.getAttribute("data-mode");

		switch (mode) {
			case "play":
				writer.showCharacter();
				writer.showOutline();
				writer.animateCharacter();
				break;
			case "quiz":
				writer.showCharacter();
				writer.showOutline();
				writer.quiz();
				break;
			case "blind-quiz":
				writer.hideCharacter();
				writer.hideOutline();
				writer.quiz({
					showHintAfterMisses: 3,
				});
				break;
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

	if (speachNode) {
		const msg = new SpeechSynthesisUtterance();
		msg.voice = window.speechSynthesis
			.getVoices()
			.find((voice) => voice.lang === "zh-CN");
		msg.pitch = 1;
		msg.rate = 0.7;
		msg.volume = 1;
		msg.text = speachNode.getAttribute("data-speach");
		window.speechSynthesis.speak(msg);
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
