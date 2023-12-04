import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        inventory: resolve(__dirname, "src/inventory/index.html"),
        search: resolve(__dirname, "src/search/index.html"),
        product: resolve(__dirname, "src/product/index.html"),
        grocery: resolve(__dirname, "src/grocery/index.html"),
      },
    },
  },
});
