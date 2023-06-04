import { defineConfig } from "vite";
import coolPlugin from "./babelTransform";
export default defineConfig({ plugins: [coolPlugin()] });
