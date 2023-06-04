import A11yDialog from "a11y-dialog";
import { texts } from "./data/texts";

const modal = document.querySelector("#lessons");
const dialog = new A11yDialog(modal);
const modalTitle = modal.querySelector("[data-lesson-title]");
const modalContent = modal.querySelector("[data-lesson-content]");

document.addEventListener("click", (ev) => {
	const trigger = ev.target.closest("[data-lesson-trigger]");

	if (trigger) {
		modalContent.innerHTML = "";
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
				<p class="text-3xl lg:text-5xl font-chinese">
					${line}
					<button type="button" class="ml-1 align-middle" data-speach="${line}" title="Speak"><svg focusable="false" class="w-6 lg:w-6 fill-blue-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"></path><path d="M5.889 16H2a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h3.889l5.294-4.332a.5.5 0 0 1 .817.387v15.89a.5.5 0 0 1-.817.387L5.89 16zm13.517 4.134l-1.416-1.416A8.978 8.978 0 0 0 21 12a8.982 8.982 0 0 0-3.304-6.968l1.42-1.42A10.976 10.976 0 0 1 23 12c0 3.223-1.386 6.122-3.594 8.134zm-3.543-3.543l-1.422-1.422A3.993 3.993 0 0 0 16 12c0-1.43-.75-2.685-1.88-3.392l1.439-1.439A5.991 5.991 0 0 1 18 12c0 1.842-.83 3.49-2.137 4.591z"></path></svg></button>
				</p>
				<p class="text-lg lg:text-2xl font-mono">${pinyinLines[index]}</p>
				<p class="text-slate-500 font-mono">${englishLines[index]}</p>
			`;
			modalContent.appendChild(lineNode);
		});
	}
});
