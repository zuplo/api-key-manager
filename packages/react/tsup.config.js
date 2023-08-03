import { defineConfig } from "tsup";

const cfg = {
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: false,
  dts: true,
  format: ["esm", "cjs"],
};

export default defineConfig([
  {
    ...cfg,
    entry: {
      index: "src/index.tsx",
    },
    external: ["react", "dayjs"],
    outDir: "dist",
    esbuildOptions: (options) => {
      // Append "use client" to the top of the react entry point
      options.banner = {
        js: '"use client";',
      };
    },
  },
]);
