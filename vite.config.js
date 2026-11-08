import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  base: "/inspire-lab/",

  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, "index.html"),
        about: resolve(__dirname, "about.html"),
        research: resolve(__dirname, "research.html"),
        projects: resolve(__dirname, "projects.html"),
        publications: resolve(__dirname, "publications.html"),
        people: resolve(__dirname, "people.html"),
        news: resolve(__dirname, "news.html"),
        contact: resolve(__dirname, "contact.html"),
        recruitment: resolve(__dirname, "recruitment.html"),
      },
    },
  },
});
