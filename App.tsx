import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AppBar } from "./components/AppBar";
import { BottomNav } from "./components/BottomNav";
import { useEffect, lazy, Suspense } from "react";
import { useLocation } from "wouter";
import { initGA, trackPageView } from "@/lib/ga4";
import { Analytics } from "@vercel/analytics/react";
import { HelmetProvider } from "react-helmet-async";
import Footer from "./components/Footer";

// 홈 페이지는 즉시 로드 (LCP 최적화)
import Home from "./pages/Home";

// 나머지 페이지는 lazy loading으로 코드 스플리팅
const Manselyeok = lazy(() => import("./pages/Manselyeok"));
const LifelongSaju = lazy(() => import("./pages/LifelongSaju"));
const YearlyFortune = lazy(() => import("./pages/YearlyFortune"));
const YearlyFortuneDetail = lazy(() => import("./pages/YearlyFortuneDetail"));
const DailyFortune = lazy(() => import("./pages/DailyFortune"));
const Compatibility = lazy(() => import("./pages/Compatibility"));
const Tojeong = lazy(() => import("./pages/Tojeong"));
const Psychology = lazy(() => import("./pages/Psychology"));
const Astrology = lazy(() => import("./pages/Astrology"));
const Tarot = lazy(() => import("./pages/Tarot"));
const TarotHistory = lazy(() => import("./pages/TarotHistory"));
const About = lazy(() => import("./pages/About"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Contact = lazy(() => import("./pages/Contact"));
const FamilySaju = lazy(() => import("./pages/FamilySaju"));
const HybridCompatibility = lazy(() => import("./pages/HybridCompatibility"));
const FortuneDictionary = lazy(() => import("./pages/FortuneDictionary"));
const DictionaryDetail = lazy(() => import("./pages/DictionaryDetail"));
const LuckyLunch = lazy(() => import("./pages/LuckyLunch"));
const Guide = lazy(() => import("./pages/Guide"));
const GuideDetail = lazy(() => import("./pages/GuideDetail"));
const DreamInterpretation = lazy(() => import("./pages/DreamInterpretation"));
const DreamDetail = lazy(() => import("./pages/DreamDetail"));
const PastLife = lazy(() => import("./pages/PastLife"));
const Naming = lazy(() => import("./pages/Naming"));
const More = lazy(() => import("./pages/More"));

// 최소한의 로딩 스피너 (CLS 방지)
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function Router() {
  const [location] = useLocation();

  useEffect(() => {
    initGA();
  }, []);

  useEffect(() => {
    trackPageView(location);
    // 페이지 이동 시 스크롤을 맨 위로 초기화
    window.scrollTo(0, 0);
    // 추가 보장: 다음 프레임에서도 스크롤 초기화
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
  }, [location]);

  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/manselyeok" component={Manselyeok} />
        <Route path="/lifelong-saju" component={LifelongSaju} />
        <Route path="/yearly-fortune" component={YearlyFortune} />
        <Route path="/yearly-fortune/:birthDate" component={YearlyFortuneDetail} />
        <Route path="/daily-fortune" component={DailyFortune} />
        <Route path="/compatibility" component={Compatibility} />
        <Route path="/tojeong" component={Tojeong} />
        <Route path="/psychology" component={Psychology} />
        <Route path="/astrology" component={Astrology} />
        <Route path="/tarot" component={Tarot} />
        <Route path="/tarot-history" component={TarotHistory} />
        <Route path="/about" component={About} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        <Route path="/family-saju" component={FamilySaju} />
        <Route path="/hybrid-compatibility" component={HybridCompatibility} />
        <Route path="/fortune-dictionary" component={FortuneDictionary} />
        <Route path="/dictionary/:id" component={DictionaryDetail} />
        <Route path="/lucky-lunch" component={LuckyLunch} />
        <Route path="/contact" component={Contact} />
        <Route path="/guide" component={Guide} />
        <Route path="/guide/:id" component={GuideDetail} />
        <Route path="/dream" component={DreamInterpretation} />
        <Route path="/dream/:slug" component={DreamDetail} />
        <Route path="/past-life" component={PastLife} />
        <Route path="/naming" component={Naming} />
        <Route path="/more" component={More} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <ThemeProvider defaultTheme="light">
          <TooltipProvider>
            <Toaster />
            <div className="mu-page-shell">
              <div className="mu-page-shell__inner">
                <AppBar />
                <main style={{ paddingBottom: 0, flex: 1 }}>
                  <Router />
                </main>
                <BottomNav />
                <Analytics />
                <Footer />
              </div>
            </div>
          </TooltipProvider>
        </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
