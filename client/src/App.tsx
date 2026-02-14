import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import { GNB } from "./components/GNB";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { initGA, trackPageView } from "@/lib/ga4";
import { Analytics } from "@vercel/analytics/react";
import { HelmetProvider } from "react-helmet-async";
import Manselyeok from "./pages/Manselyeok";
import LifelongSaju from "./pages/LifelongSaju";
import YearlyFortune from "./pages/YearlyFortune";
import YearlyFortuneDetail from "./pages/YearlyFortuneDetail";
import DailyFortune from "./pages/DailyFortune";
import Compatibility from "./pages/Compatibility";
import Tojeong from "./pages/Tojeong";
import Psychology from "./pages/Psychology";
import Astrology from "./pages/Astrology";
import Tarot from "./pages/Tarot";
import TarotHistory from "./pages/TarotHistory";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import FamilySaju from "./pages/FamilySaju";
import HybridCompatibility from "./pages/HybridCompatibility";
import FortuneDictionary from "./pages/FortuneDictionary";
import DictionaryDetail from "./pages/DictionaryDetail";
import LuckyLunch from "./pages/LuckyLunch";

function Router() {
  const [location] = useLocation();

  useEffect(() => {
    initGA();
  }, []);

  useEffect(() => {
    trackPageView(location);
  }, [location]);

  return (
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
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <ThemeProvider defaultTheme="dark">
          <TooltipProvider>
            <Toaster />
            <GNB />
            <Router />
            <Analytics />
          </TooltipProvider>
        </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
