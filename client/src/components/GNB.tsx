import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { 
  Menu, 
  Calendar, 
  User, 
  BookOpen, 
  Sparkles, 
  Heart, 
  BrainCircuit, 
  Info,
  ChevronRight
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { name: "만세력", href: "/manselyeok", icon: Calendar, description: "나의 타고난 기운 확인" },
  { name: "평생사주", href: "/lifelong-saju", icon: User, description: "인생의 전체적인 흐름" },
  { name: "토정비결", href: "/tojeong", icon: BookOpen, description: "전통 방식으로 보는 운세" },
  { name: "신년운세", href: "/yearly-fortune", icon: Sparkles, description: "2026년 병오년 운세" },
  { name: "궁합", href: "/compatibility", icon: Heart, description: "상대방과의 조화" },
  { name: "심리테스트", href: "/psychology", icon: BrainCircuit, description: "나도 모르는 내 마음" },
  { name: "소개", href: "/about", icon: Info, description: "MUUN 서비스 이야기" },
];

export function GNB() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
              <Sparkles className="w-5 h-5 text-background" />
            </div>
            <span className="text-xl font-black tracking-tighter text-primary">
              MUUN
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative py-2 transition-colors hover:text-primary",
                  location === item.href
                    ? "text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary"
                    : "text-foreground/60"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-background/95 backdrop-blur-2xl border-l border-white/10 p-0">
              <div className="flex flex-col h-full">
                <SheetHeader className="p-6 border-b border-white/5">
                  <SheetTitle className="text-left flex items-center gap-2">
                    <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-background" />
                    </div>
                    <span className="text-primary font-black tracking-tighter">MUUN</span>
                  </SheetTitle>
                </SheetHeader>
                
                <div className="flex-1 overflow-y-auto py-4 px-2">
                  <div className="grid gap-1">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = location === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "group flex items-center gap-4 p-4 rounded-xl transition-all duration-200",
                            isActive 
                              ? "bg-primary/10 text-primary" 
                              : "hover:bg-white/5 text-foreground/70 hover:text-foreground"
                          )}
                        >
                          <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                            isActive ? "bg-primary text-background" : "bg-white/5 group-hover:bg-primary/20 group-hover:text-primary"
                          )}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-bold">{item.name}</div>
                            <div className="text-[11px] opacity-50 font-medium">{item.description}</div>
                          </div>
                          <ChevronRight className={cn(
                            "w-4 h-4 transition-transform",
                            isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                          )} />
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div className="p-6 border-t border-white/5 bg-white/5">
                  <p className="text-[10px] text-center text-foreground/40 font-medium uppercase tracking-widest">
                    © 2026 MUUN Celestial Services
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
