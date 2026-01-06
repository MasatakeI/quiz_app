/// <reference types="vitest" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],

  test: {
    globals: true, // expect などを global で使えるようにする
    environment: "jsdom", // ブラウザ環境をシミュレート
    setupFiles: ["./src/setupTests.js"], // 初期設定ファイルを指定
  },
});
