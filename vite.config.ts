import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-dom/client",
      "@tanstack/react-router",
      "@tanstack/react-query",
      "lexical",
      "@lexical/react/LexicalComposer",
      "@lexical/react/LexicalRichTextPlugin",
      "@lexical/react/LexicalContentEditable",
      "@lexical/react/LexicalHistoryPlugin",
      "@lexical/react/LexicalListPlugin",
      "@lexical/react/LexicalLinkPlugin",
      "@lexical/react/LexicalComposerContext",
      "@lexical/rich-text",
      "@lexical/list",
      "@lexical/link",
      "@lexical/utils",
    ],
    exclude: [],
  },
  server: {
    warmup: {
      clientFiles: [
        "./src/main.tsx",
        "./src/App.tsx",
        "./src/domains/**/index.tsx",
        "./src/shared/components/ui/*.tsx",
      ],
    },
  },
});
