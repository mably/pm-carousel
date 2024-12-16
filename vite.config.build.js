// vite.config.js
const path = require("path")

const resolvePath = (absolutePath) => path.resolve(__dirname, absolutePath)

export default {
	build: {
		minify: false,
		terserOptions: {
			compress: false,
			mangle: false,
		},
		outDir: "dist",
		lib: {
			entry: resolvePath("./main.js"),
			name: "pm-carousel",
		},
	},
}
