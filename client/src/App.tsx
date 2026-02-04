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
import Manselyeok from "./pages/Manselyeok";
import LifelongSaju from "./pages/LifelongSaju";
import YearlyFortune from "./pages/YearlyFortune";
import DailyFortune from "./pages/DailyFortune";
import Compatibility from "./pages/Compatibility";
import Tojeong from "./pages/Tojeong";
import Psychology from "./pages/Psychology";
import Astrology from "./pages/Astrology";
import Tarot from "./pages/Tarot";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";

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
      <Route path="/daily-fortune" component={DailyFortune} />
      <Route path="/compatibility" component={Compatibility} />
      <Route path="/tojeong" component={Tojeong} />
      <Route path="/psychology" component={Psychology} />
      <Route path="/astrology" component={Astrology} />
      <Route path="/tarot" component={Tarot} />
      <Route path="/about" component={About} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/contact" component={Contact} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <GNB />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
