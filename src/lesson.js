import A11yDialog from "a11y-dialog";
import { texts } from "./data/texts";

const modal = document.querySelector("#lessons");
const dialog = new A11yDialog(modal);
const modalTitle = modal.querySelector("[data-lesson-title]");
const modalContent = modal.querySelector("[data-lesson-content]");

document.addEventListener("click", (ev) => {
	const trigger = ev.target.closest("[data-lesson-trigger]");

	if (trigger) {
		const lessonNbr = trigger.getAttribute("data-lesson-trigger");
		modalTitle.textContent = `Lesson ${lessonNbr}`;

		const { chinese, pinyin, english } = texts.find(
			(lesson) => lesson.lesson === lessonNbr
		);

		const chineseLines = chinese.split("\n");
		const pinyinLines = pinyin.split("\n");
		const englishLines = english.split("\n");

		chineseLines.forEach((line, index) => {
			const lineNode = document.createElement("div");
			lineNode.innerHTML = `
				<p class="text-2xl lg:text-4xl">${line}</p>
				<p class="text-lg lg:text-xl">${pinyinLines[index]}</p>
				<p class="text-slate-500">${englishLines[index]}</p>
			`;
			modalContent.appendChild(lineNode);
		});
	}
});
