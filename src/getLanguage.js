const language = localStorage.getItem("language") || "english";
const langSelect = document.querySelector("[data-language]");
langSelect.value = language;

function updateLanguage(event) {
	localStorage.setItem("language", event.target.value);
	location.reload();
}

langSelect.addEventListener("change", updateLanguage);

export default language;
