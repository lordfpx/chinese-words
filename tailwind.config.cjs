/** @type {import('tailwindcss').Config} */

module.exports = {
	mode: "jit", // <--- enable JIT
	purge: ["./index.html", "./**/*.{vue,js,ts,jsx,tsx}"], // you still need purge paths so it knows where to find classes
	content: ["./**/*.{html,js}"],
	theme: {
		extend: {},
	},
	plugins: [],
};
