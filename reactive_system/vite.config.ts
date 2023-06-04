import { defineConfig } from "vite";

export default defineConfig({
	build: {
		lib: {
			name: "reactive-v3",
			entry: "./src/index.ts",
		},
	},
});
