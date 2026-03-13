import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet-async";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <>
      <Helmet>
        <title>페이지를 찾을 수 없습니다 (404) | 무운</title>
        <meta name="description" content="요청하신 페이지를 찾을 수 없습니다." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen bg-background text-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-8xl font-bold text-primary/30 mb-4 select-none">404</div>
          <h1 className="text-2xl font-bold text-white mb-3">
            페이지를 찾을 수 없습니다
          </h1>
          <p className="text-slate-400 mb-8 leading-relaxed">
            요청하신 페이지가 삭제되었거나 주소가 변경되었습니다.
            <br />
            URL을 다시 확인하거나 홈으로 이동해 주세요.
          </p>
          <div
            id="not-found-button-group"
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Button
              onClick={() => setLocation("/")}
              className="bg-primary hover:bg-primary/90 text-background font-semibold px-6"
            >
              <Home className="w-4 h-4 mr-2" />
              홈으로 이동
            </Button>
            <Button
              onClick={() => setLocation("/dream")}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 px-6"
            >
              <Search className="w-4 h-4 mr-2" />
              꿈해몽 보기
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
