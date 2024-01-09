export const json2table = (obj) => {
	const table = document.createElement("table");
	const tr = document.createElement("tr");
	const th = document.createElement("th");
	const td = document.createElement("td");

	function charCelDisplay(string) {
		const fragment = document.createDocumentFragment();
		const btn = document.createElement("button");
		btn.setAttribute("type", "button");

		const words = string.split("/");

		words.forEach((word, index) => {
			if (index > 0) {
				fragment.appendChild(document.createElement("br"));
			}

			const speachBtn = btn.cloneNode();
			speachBtn.classList.add("mr-2", "lg:mr-4");
			speachBtn.setAttribute("data-speach", word);
			speachBtn.setAttribute("title", `Speak ${word}`);
			speachBtn.innerHTML = `<svg focusable="false" class="w-4 lg:w-6 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M5.889 16H2a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h3.889l5.294-4.332a.5.5 0 0 1 .817.387v15.89a.5.5 0 0 1-.817.387L5.89 16zm13.517 4.134l-1.416-1.416A8.978 8.978 0 0 0 21 12a8.982 8.982 0 0 0-3.304-6.968l1.42-1.42A10.976 10.976 0 0 1 23 12c0 3.223-1.386 6.122-3.594 8.134zm-3.543-3.543l-1.422-1.422A3.993 3.993 0 0 0 16 12c0-1.43-.75-2.685-1.88-3.392l1.439-1.439A5.991 5.991 0 0 1 18 12c0 1.842-.83 3.49-2.137 4.591z" fill="rgba(0,0,0,1)"/></svg>`;

			word.split("").forEach((letter) => {
				const newBtn = btn.cloneNode();
				newBtn.setAttribute("data-a11y-dialog-show", "character-draw");
				newBtn.setAttribute("data-character-open", letter);
				newBtn.classList.add("font-chinese");
				newBtn.textContent = letter;
				fragment.appendChild(newBtn);
			});
			fragment.appendChild(speachBtn);
		});

		return fragment;
	}

	function lessonCelDisplay(string) {
		let node;

		if (Array.isArray(string)) {
			node = document.createElement("div");
			node.classList.add("space-x-4");

			string.forEach((btn) => {
				var btnNode = document.createElement("button");
				btnNode.setAttribute("type", "button");
				btnNode.setAttribute("data-a11y-dialog-show", "lessons");
				btnNode.setAttribute("data-lesson-trigger", btn);
				btnNode.textContent = `${btn}`;
				node.appendChild(btnNode);
			});
		} else {
			node = document.createElement("button");
			node.setAttribute("type", "button");
			node.setAttribute("data-a11y-dialog-show", "lessons");
			node.setAttribute("data-lesson-trigger", string);
			node.textContent = `${string}`;
		}

		return node;
	}

	function buildHead() {
		const thead = document.createElement("thead");
		const newTr = tr.cloneNode();

		let newTh = th.cloneNode();
		newTh.textContent = "Chinese";
		newTr.appendChild(newTh);

		newTh = th.cloneNode();
		newTh.textContent = "English";
		newTr.appendChild(newTh);

		newTh = th.cloneNode();
		newTh.textContent = "Type";
		newTr.appendChild(newTh);

		newTh = th.cloneNode();
		newTh.textContent = "Lesson";
		newTr.appendChild(newTh);

		thead.appendChild(newTr);

		return thead;
	}

	function buildBody() {
		const tbody = document.createElement("tbody");

		obj.forEach((word) => {
			const newTr = tr.cloneNode();
			let newTd = td.cloneNode();

			// char + pinyin

			const pinyinDiv = document.createElement("div");
			pinyinDiv.setAttribute(
				"class",
				"lg:text-2xl font-mono lg:inline-block lg:mr-4"
			);
			pinyinDiv.textContent = word.pinyin;
			newTd.appendChild(pinyinDiv);

			const charDiv = document.createElement("div");
			charDiv.setAttribute(
				"class",
				"whitespace-nowrap text-3xl lg:text-5xl lg:mb-2 lg:inline-block"
			);
			charDiv.appendChild(charCelDisplay(word.char));
			newTd.setAttribute("data-sort", word.pinyin);
			newTd.appendChild(charDiv);

			newTr.appendChild(newTd);

			// eng
			newTd = td.cloneNode();
			newTd.textContent = word.eng;
			newTr.appendChild(newTd);

			// type
			newTd = td.cloneNode();
			newTd.textContent = word.type;
			newTr.appendChild(newTd);

			// lesson
			newTd = td.cloneNode();
			newTd.appendChild(lessonCelDisplay(word.lesson));
			newTr.appendChild(newTd);

			tbody.appendChild(newTr);
		});

		return tbody;
	}

	table.appendChild(buildHead());
	table.appendChild(buildBody());

	return table;
};
