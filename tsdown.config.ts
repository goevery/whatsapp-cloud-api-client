import { defineConfig } from "tsdown";

export default defineConfig({
  format: ["esm", "cjs"],
  entry: { main: "./src/index.ts", schemas: "./src/schemas/index.ts" },
});
