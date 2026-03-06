import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

// 삭제된 페이지 URL 리다이렉트 규칙
const deletedUrls = [
  // Dictionary 페이지
  '/dictionary/baekho-sal', '/dictionary/bi-gyeop', '/dictionary/byeong-hwa',
  '/dictionary/chung', '/dictionary/dae-un', '/dictionary/earthly-branches',
  '/dictionary/eul-mok', '/dictionary/fire-element', '/dictionary/gi-sin',
  '/dictionary/gi-to', '/dictionary/gong-mang', '/dictionary/gwanseong',
  '/dictionary/gwimun-sal', '/dictionary/gye-su', '/dictionary/hap',
  '/dictionary/heavenly-stems', '/dictionary/hui-sin', '/dictionary/hwagae-sal',
  '/dictionary/hyeong', '/dictionary/im-su', '/dictionary/inseong',
  '/dictionary/jaeseong', '/dictionary/jeong-hwa', '/dictionary/metal-element',
  '/dictionary/mu-to', '/dictionary/sam-jae', '/dictionary/se-un',
  '/dictionary/siksang', '/dictionary/sin-geum', '/dictionary/wonjin-sal',
  '/dictionary/wood-element', '/dictionary/yin-yang-five-elements', '/dictionary/yong-sin',
  // Dream 페이지
  '/dream/가위', '/dream/강도', '/dream/개', '/dream/거미', '/dream/거북이',
  '/dream/거울', '/dream/거지', '/dream/결혼', '/dream/경찰', '/dream/고래',
  '/dream/고양이', '/dream/과일', '/dream/기린', '/dream/기본', '/dream/길',
  '/dream/꽃', '/dream/나무', '/dream/냉장고', '/dream/노인', '/dream/눈신체',
  '/dream/달', '/dream/닭', '/dream/대통령', '/dream/도둑', '/dream/도망치는꿈',
  '/dream/돈', '/dream/동굴', '/dream/동물', '/dream/돼지', '/dream/떨어지는꿈',
  '/dream/똥', '/dream/물', '/dream/바늘', '/dream/바다', '/dream/밥',
  '/dream/벌', '/dream/보석', '/dream/봉황', '/dream/불', '/dream/비',
  '/dream/비행기', '/dream/사냥하는꿈', '/dream/사자', '/dream/산', '/dream/상어',
  '/dream/샘물', '/dream/소', '/dream/손가락', '/dream/술', '/dream/숲',
  '/dream/시계', '/dream/시험', '/dream/씨앗', '/dream/아이', '/dream/안개',
  '/dream/양', '/dream/얼음', '/dream/연예인', '/dream/예수님', '/dream/우는꿈',
  '/dream/웃는꿈', '/dream/원숭이', '/dream/의사', '/dream/이별', '/dream/이사',
  '/dream/입', '/dream/죽음', '/dream/쥐', '/dream/지네', '/dream/지진',
  '/dream/집', '/dream/쫓기는꿈', '/dream/책', '/dream/천둥번개', '/dream/침대',
  '/dream/코', '/dream/코끼리', '/dream/태양', '/dream/토끼', '/dream/폭포',
  '/dream/하늘', '/dream/하늘을나는꿈', '/dream/학교', '/dream/호랑이', '/dream/홍수',
  '/dream/화내는꿈', '/dream/화산폭발', '/dream/화해하는꿈', '/dream/흙', '/dream/TV'
];

// 인코딩된 버전도 포함
const deletedUrlsWithEncoded = deletedUrls.flatMap(url => {
  const encoded = encodeURI(url);
  return encoded === url ? [url] : [url, encoded];
});

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  
  // 삭제된 페이지 URL 리다이렉트 미들웨어
  app.use((req, res, next) => {
    if (deletedUrlsWithEncoded.includes(req.path)) {
      return res.redirect(301, '/');
    }
    next();
  });
  
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
