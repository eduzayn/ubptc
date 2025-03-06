import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        admin: resolve(__dirname, "public/admin/index.html"),
        adminDashboard: resolve(__dirname, "public/admin/dashboard/index.html"),
        adminLogin: resolve(__dirname, "public/admin/login/index.html"),
        painel: resolve(__dirname, "public/painel/index.html"),
      },
    },
  },
});
