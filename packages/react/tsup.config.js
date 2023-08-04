import autoprefixer from "autoprefixer";
import fs from "fs/promises";
import path from "path";
import postcss from "postcss";
import postcssModules from "postcss-modules";
import tailwindcss from "tailwindcss";
import { defineConfig } from "tsup";
import config from "./tailwind.config.js";

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
    esbuildPlugins: [
      {
        name: "css-module",
        setup(build) {
          build.onResolve(
            { filter: /\.module\.css$/, namespace: "file" },
            (args) => ({
              path: `${args.path}#css-module`,
              namespace: "css-module",
              pluginData: {
                pathDir: path.join(args.resolveDir, args.path),
              },
            })
          );
          build.onLoad(
            { filter: /#css-module$/, namespace: "css-module" },
            async (args) => {
              const { pluginData } = args;

              const source = await fs.readFile(pluginData.pathDir, "utf8");

              let cssModule = {};
              const result = await postcss([
                postcssModules({
                  getJSON(_, json) {
                    cssModule = json;
                  },
                }),
                tailwindcss(config),
                autoprefixer(),
              ]).process(source, { from: pluginData.pathDir });

              return {
                pluginData: { css: result.css },
                contents: `import "${
                  pluginData.pathDir
                }"; export default ${JSON.stringify(cssModule)}`,
              };
            }
          );
          build.onResolve(
            { filter: /\.module\.css$/, namespace: "css-module" },
            (args) => ({
              path: path.join(args.resolveDir, args.path, "#css-module-data"),
              namespace: "css-module",
              pluginData: args.pluginData,
            })
          );
          build.onLoad(
            { filter: /#css-module-data$/, namespace: "css-module" },
            (args) => ({
              contents: args.pluginData.css,
              loader: "css",
            })
          );
        },
      },
    ],
  },
]);
