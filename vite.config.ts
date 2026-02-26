import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "path";
import { defineConfig } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";


const plugins = [react(), tailwindcss(), jsxLocPlugin(), vitePluginManusRuntime()];

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),

  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    // 성능 최적화: 코드 분할
    rollupOptions: {
      output: {
        manualChunks: {
          // React 코어 라이브러리 분리
          'vendor-react': ['react', 'react-dom'],
          // 라우팅 (wouter 사용)
          'vendor-router': ['wouter'],
          // 차트/시각화 라이브러리 분리 (용량이 큼)
          'vendor-charts': ['recharts'],
          // 애니메이션 라이브러리 분리
          'vendor-animation': ['framer-motion'],
          // 폼 및 유효성 검사
          'vendor-form': ['react-hook-form', '@hookform/resolvers', 'zod'],
          // 데이터 패칭
          'vendor-query': ['@tanstack/react-query'],
        },
      },
    },
    // 최소화 설정
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // 청킹 전략
    chunkSizeWarningLimit: 1000,
    // 소스맵 비활성화 (프로덕션)
    sourcemap: false,
    // Pre-rendering 후 정적 파일 생성
    reportCompressedSize: false,
  },
  server: {
    port: 3000,
    strictPort: false,
    host: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1",
    ],
    fs: {
      strict: true,
      deny: ["**/..*"],
    },
    middlewareMode: false,
  },
  // 성능 최적화: 프리로드 힌트
  ssr: {
    noExternal: ['recharts'],
  },
});
