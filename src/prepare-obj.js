export default (obj) => {
	const l = (string) => {
		const div = document.createElement("div");
		const button = document.createElement("button");
		button.innerText = string;
		button.type = "button";
		button.setAttribute("data-details-open", string);

		div.appendChild(button);

		return div.outerHTML;
	};

	let newObj = [...obj];

	newObj.map((word) => (word.char = l(word.char)));

	return newObj;
};
