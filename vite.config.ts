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
    // 성능 최적화: 코드 분할 (클라이언트 빌드 전용, SSR 빌드에서는 적용되지 않음)
    rollupOptions: {
      output: {
        manualChunks(id, { isEntry }) {
          // SSR 빌드에서는 manualChunks 사용 안 함
          if (process.env.VITE_SSR) return;
          if (id.includes('node_modules')) {
            if (id.includes('recharts')) return 'vendor-charts';
            if (id.includes('framer-motion')) return 'vendor-animation';
            if (id.includes('@tanstack/react-query')) return 'vendor-query';
            if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('/zod/')) return 'vendor-form';
            if (id.includes('wouter')) return 'vendor-router';
            if (id.includes('/react-dom/') || id.includes('/react/')) return 'vendor-react';
          }
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
