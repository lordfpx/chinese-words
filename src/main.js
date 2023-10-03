// https://www.lexilogos.com/keyboard/chinese_pinyin.htm

import "./modal.scss";
import "./style.scss";

import { vocabulary } from "./data/vocabulary";
import { json2table } from "./json2table";
import Tablesort from "tablesort";
import HanziWriter from "hanzi-writer";

import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
	onOfflineReady() {},
	onRegisterError(error) {
		console.warn({ error });
	},
});

// Enregistrement du service worker
if ("serviceWorker" in navigator) {
	navigator.serviceWorker
		.register("sw.js")
		.then(function (registration) {
			console.log("Service Worker enregistré avec succès:", registration);
		})
		.catch(function (error) {
			console.log("Échec de l'enregistrement du Service Worker:", error);
		});
}

// Exemple d'utilisation de la fonctionnalité hors ligne
if (navigator.onLine) {
	console.log("Le navigateur est en ligne.");
} else {
	console.log("Le navigateur est hors ligne.");
}

const msg = new SpeechSynthesisUtterance();

function getVoices() {
	const voices = window.speechSynthesis.getVoices();
	const voice = voices.find((voice) => voice.lang === "zh-TW");
	msg.voice = voice;
	msg.rate = 0.7;
	msg.volume = 1;
}

getVoices();

window.speechSynthesis.addEventListener("voiceschanged", getVoices);

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
const sort = new Tablesort(document.querySelector("table"));

const inputNode = document.querySelector("[data-table-filter]");
const unfilterNode = document.querySelector("[data-table-unfilter]");
const detailsNode = document.querySelector("[data-details]");
const trNodes = [...tableWrapperNode.querySelectorAll("tbody tr")];

const sanitizedWords = trNodes.map((node) => cleanString(node.textContent));

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
		window.speechSynthesis.cancel();
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
	sort.refresh();
});

// put focus on filter field
window.addEventListener("keydown", (ev) => {
	const isAlphabeticKey = ev.key.length === 1 && /[a-z]/i.test(ev.key);
	const isInputFocused = document.activeElement.tagName === "INPUT";

	if (isAlphabeticKey && !ev.ctrlKey && !ev.metaKey && !isInputFocused) {
		inputNode.focus();
	}

	if (ev.key === "Escape") {
		inputNode.value = "";
		inputNode.dispatchEvent(new CustomEvent("input"));
	}
});

window.chineseExport = () => {
	return vocabulary.reduce((acc, item, index) => {
		return acc + item.char + ";" + item.eng + "\n";
	}, "");
};
