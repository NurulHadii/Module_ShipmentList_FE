import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  server: {    // <-- this object is added
    port: 8080
  },
  plugins: [vue()],
  resolve: {
    alias: {
      "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js",
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "devextreme/ui": 'devextreme/esm/ui',
    },
  },
  base: "https://boox.app/Config-FE/",
  build: {
    chunkSizeWarningLimit: 3000,
    rollupOptions: {
      treeshake:  false 
    }
  },
});
