// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
	compatibilityDate: "2024-11-01",
	devtools: { enabled: true },

	routeRules: {
		"/directus/**": { proxy: `${import.meta.env.API_URL}/**` },
	},
	vite: {
		plugins: [
			tailwindcss(),
		],
	},
	css: ['~/assets/index.css'],
	modules: [
		"@nuxtjs/color-mode",
		"@nuxtjs/color-mode",
		"@nuxt/ui",
		"@nuxt/image",
		"@nuxt/icon",
	],
	ui: {
		theme: {
			colors: ['primary', 'error']
		}
	},
	image: {
		directus: {
			// This URL needs to include the final `assets/` directory
			baseURL: 'http://localhost:8055/assets'
		}
	}
});