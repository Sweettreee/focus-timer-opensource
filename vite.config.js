import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true, // 5173 포트가 이미 사용 중이라면, 에러를 발생시켜 혼선 차단
  },
});
