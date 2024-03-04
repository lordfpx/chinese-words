// https://www.lexilogos.com/keyboard/chinese_pinyin.htm

import "./modal.scss";
import "./style.scss";

import { vocabulary1 } from "./data/vocabulary-1";
import { vocabulary2 } from "./data/vocabulary-2";
import { json2table } from "./json2table";
import Tablesort from "tablesort";

import { registerSW } from "virtual:pwa-register";

const vocabulary = vocabulary1.concat(vocabulary2);

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
// if (navigator.onLine) {
// 	console.log("Le navigateur est en ligne.");
// } else {
// 	console.log("Le navigateur est hors ligne.");
// }

const msg = new SpeechSynthesisUtterance();

function getVoices() {
	const voices = window.speechSynthesis.getVoices();
	const voice = voices.find((voice) => voice.lang === "zh-TW");
	msg.voice = voice;
	msg.rate = 1;
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

const tableWrapperNode = document.querySelector("[data-table]");
tableWrapperNode.appendChild(json2table(vocabulary));
const sort = new Tablesort(document.querySelector("table"));

const inputNode = document.querySelector("[data-table-filter]");
const unfilterNode = document.querySelector("[data-table-unfilter]");
const trNodes = [...tableWrapperNode.querySelectorAll("tbody tr")];

const sanitizedWords = trNodes.map((node) => cleanString(node.textContent));

document.addEventListener("click", (ev) => {
	const speachNode = ev.target.closest("[data-speach]");

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
