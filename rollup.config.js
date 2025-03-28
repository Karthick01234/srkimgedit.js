import { defineConfig } from "rollup";
import babel from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";

const terserOptions = {
  format: {
    comments: (node, comment) => {
      const { value, type } = comment;
      if (type === "comment2") {
        // Keep only JSDoc comments that include "@public"
        return value.includes("@public");
      }
      return false; // Remove all other comments
    },
  },
  compress: {
    drop_console: true, // Remove console logs
    drop_debugger: true, // Remove debugger statements
  },
  mangle: false, // Minify variable names
};

export default defineConfig([
  {
    input: "src/index.js",
    output: [
      { file: "dist/srkimgedit.esm.js", format: "esm" }, // ESM for modern JS
      { file: "dist/srkimgedit.cjs.js", format: "cjs" }, // CommonJS for Node.js
      { file: "dist/srkimgedit.umd.js", format: "umd", name: "SrkImgEdit" }, // UMD for browsers
    ],
    plugins: [babel({ babelHelpers: "bundled" }), terser(terserOptions)],
  },
]);
