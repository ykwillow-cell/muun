import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Manselyeok from "./pages/Manselyeok";
import LifelongSaju from "./pages/LifelongSaju";
import YearlyFortune from "./pages/YearlyFortune";
import Compatibility from "./pages/Compatibility";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/manselyeok" component={Manselyeok} />
      <Route path="/lifelong-saju" component={LifelongSaju} />
      <Route path="/yearly-fortune" component={YearlyFortune} />
      <Route path="/compatibility" component={Compatibility} />
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
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
