import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// GitHub Pages serves a project site from a subpath (https://<user>.github.io/lama/).
// Override with VITE_BASE for a custom domain or a different repo name.
export default defineConfig({
  base: process.env.VITE_BASE ?? "/imanpresentation/",
  plugins: [react(), tailwindcss()],
});
