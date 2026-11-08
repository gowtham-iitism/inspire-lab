import { defineConfig } from "vite";
import { resolve } from "node:path";

const pages = ["index.html","about.html","research.html","projects.html","publications.html","people.html","news.html","contact.html"];

export default defineConfig({
  base: "/inspire-lab/",
  build: {
    rollupOptions: {
      input: Object.fromEntries(pages.map((page) => [page.replace(".html", ""), resolve(process.cwd(), page)])),
      recruitment: resolve(__dirname, "recruitment.html")
    }
  }
});
