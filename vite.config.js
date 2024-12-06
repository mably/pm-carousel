// vite.config.js
export default {
	build: {
		minify: false,
		terserOptions: {
			compress: false,
			mangle: false,
		},
		outDir: "docs",
	},
}
