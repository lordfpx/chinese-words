/** @type {import('tailwindcss').Config} */

module.exports = {
	mode: "jit", // <--- enable JIT
	content: ["index.html", "./src/**/*.{html,js}"],
	theme: {
		extend: {},
	},
	plugins: [],
};
