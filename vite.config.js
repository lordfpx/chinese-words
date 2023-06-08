import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		VitePWA({
			registerType: "autoUpdate",
			devOptions: {
				enabled: true,
			},
			workbox: {
				globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
				maximumFileSizeToCacheInBytes: 3000000,
			},
		}),
	],
});
