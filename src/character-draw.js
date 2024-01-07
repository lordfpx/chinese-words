import HanziWriter from "hanzi-writer";
import A11yDialog from "a11y-dialog";

const modal = document.querySelector("#character-draw");
new A11yDialog(modal);

const tableWrapperNode = document.querySelector("[data-table]");
const trNodes = [...tableWrapperNode.querySelectorAll("tbody tr")];

const writer = HanziWriter.create(
	"character-target",
	trNodes[0].querySelector("[data-character-open]").textContent,
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
	const openNode = ev.target.closest("[data-character-open]");
	const modeNode = ev.target.closest("[data-mode]");

	if (openNode) {
		writer.setCharacter(openNode.dataset.characterOpen);
		writer.animateCharacter();
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
});
