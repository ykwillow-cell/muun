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
  ChevronRight,
  Star,
  Zap,
  History,
  Share2
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const navItems = [
  { name: "만세력", href: "/manselyeok", icon: Calendar, description: "나의 타고난 기운 확인" },
  { name: "평생사주", href: "/lifelong-saju", icon: User, description: "인생의 전체적인 흐름" },
  { name: "토정비결", href: "/tojeong", icon: BookOpen, description: "전통 방식으로 보는 운세" },
  { name: "오늘의 운세", href: "/daily-fortune", icon: Zap, description: "매일 확인하는 나의 행운" },
  { name: "신년운세", href: "/yearly-fortune", icon: Sparkles, description: "2026년 병오년 운세" },
  { name: "궁합", href: "/compatibility", icon: Heart, description: "상대방과의 조화" },
  { name: "점성술", href: "/astrology", icon: Star, description: "별들이 들려주는 나의 운명" },
  { name: "심리테스트", href: "/psychology", icon: BrainCircuit, description: "나도 모르는 내 마음" },
  { name: "AI 타로", href: "/tarot", icon: Sparkles, description: "AI가 읽어주는 운명의 카드" },
  { name: "내 타로 기록", href: "/tarot-history", icon: History, description: "지난 상담 기록 조회" },
  { name: "소개", href: "/about", icon: Info, description: "MUUN 서비스 이야기" },
  { name: "문의", href: "/contact", icon: Info, description: "문의 및 피드백" },
];

export function GNB() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: '무운 (MUUN) - 무료 사주 및 운세',
      text: '회원가입 없이 바로 보는 30년 내공의 명리학 운세 서비스',
      url: window.location.origin,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.origin);
        toast.success("링크가 클립보드에 복사되었습니다.");
      }
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/60 backdrop-blur-2xl">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center group-hover:rotate-12 transition-all duration-500 shadow-[0_0_20px_rgba(255,215,0,0.2)]">
              <Sparkles className="w-5 h-5 text-background" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-primary">
              MUUN
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-10 text-[13px] font-semibold tracking-wide">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative py-1 transition-all duration-300 hover:text-primary",
                  location === item.href
                    ? "text-primary after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-primary after:rounded-full"
                    : "text-foreground/50"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1">
          {/* 공유 버튼 - 터치 영역 44px 확보 */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleShare}
            className="text-foreground/70 hover:bg-white/5 w-11 h-11 md:w-10 md:h-10 flex items-center justify-center"
            aria-label="Share"
          >
            <Share2 className="h-5 w-5" />
          </Button>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              {/* 메뉴 버튼 - 터치 영역 44px 확보 */}
              <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10 w-11 h-11 flex items-center justify-center">
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
                            "group flex items-center gap-4 p-4 rounded-xl transition-all duration-200 min-h-[44px]",
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
