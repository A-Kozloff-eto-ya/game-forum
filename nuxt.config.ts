// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
	compatibilityDate: "2024-11-01",
	devtools: { enabled: true },

	// 	routeRules: {
	//     "/directus/**": {
	//       proxy: {
	//         to: `${import.meta.env.DIRECTUS_URL}/**`,
	//       },
	//     },
	//   },

	vite: {
		plugins: [
			tailwindcss(),
		],
		build: {
			sourcemap: false, // Отключаем source maps в продакшене
		},
		// Игнорируем некорректные source maps
		// esbuild: {
		// 	drop: ['console', 'debugger'], // Удаляем console.log и debugger
		// },
	},
	css: ['~/assets/index.css'],
	modules: [
		"@nuxtjs/color-mode",
		"@nuxtjs/color-mode",
		"@nuxt/ui",
		"@nuxt/image",
		"@nuxt/icon",
		'@pinia/nuxt'
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