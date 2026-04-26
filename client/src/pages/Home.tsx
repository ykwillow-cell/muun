import { FormEvent, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation } from "wouter";
import {
  Calendar,
  ChevronRight,
  CirclePlus,
  Hash,
  Heart,
  House,
  IdCard,
  NotebookPen,
  ScanLine,
  Sparkles,
  SquarePen,
} from "lucide-react";
import { useCanonical } from "@/lib/use-canonical";
import { setHomeOGTags } from "@/lib/og-tags";
import {
  OrganizationSchema,
  BreadcrumbListSchema,
  WebApplicationSchema,
  SiteNavigationSchema,
} from "@/components/SchemaMarkup";

type CoreService = {
  title: string;
  desc: string;
  tag: string;
  href: string;
  icon: typeof Sparkles;
  wide?: boolean;
};
const coreServices: CoreService[] = [
  {
    title: "평생사주",
    desc: "내 사주의 큰 흐름",
    tag: "대표",
    href: "/lifelong-saju",
    icon: Sparkles,
  },
  {
    title: "2026 신년운세",
    desc: "올해 운세 한눈에",
    tag: "시즌",
    href: "/yearly-fortune",
    icon: Calendar,
  },
  {
    title: "궁합 보기",
    desc: "연애·결혼 궁합 확인",
    tag: "인기",
    href: "/compatibility",
    icon: Heart,
    wide: true,
  },
];

type MoreService = {
  title: string;
  desc: string;
  href: string;
  icon: typeof Sparkles;
  tag?: string;
  featured?: boolean;
};
const moreServices: MoreService[] = [
  {
    title: "만세력",
    desc: "사주 네 기둥 확인",
    href: "/manselyeok",
    icon: Calendar,
  },
  { title: "토정비결", desc: "월별 흐름 보기", href: "/tojeong", icon: IdCard },
  {
    title: "점성술",
    desc: "네이탈 차트 분석",
    href: "/astrology",
    icon: ScanLine,
    tag: "인기",
  },
  { title: "타로", desc: "질문 중심 리딩", href: "/tarot", icon: NotebookPen },
  {
    title: "작명소",
    desc: "이름 후보 비교",
    href: "/naming",
    icon: SquarePen,
    tag: "NEW",
  },
  {
    title: "전체 서비스",
    desc: "모두 보기",
    href: "/more",
    icon: CirclePlus,
    featured: true,
  },
];

const columns = [
  {
    title: "2026년 병오년",
    desc: "한해운 분석",
    date: "4월 24일 · 5분",
    href: "/guide",
  },
  {
    title: "병오년 러브",
    desc: "커리어 분석",
    date: "4월 23일 · 5분",
    href: "/guide",
  },
];

const terms = [
  { term: "일주", desc: "나를 나타내는 기둥" },
  { term: "용신", desc: "필요한 오행" },
  { term: "대운", desc: "10년 흐름 순서" },
  { term: "십신", desc: "관계와 역할" },
];

export default function Home() {
  useCanonical("/");
  const [, navigate] = useLocation();

  const [birthInput, setBirthInput] = useState("");
  const [hasBirth, setHasBirth] = useState(false);

  useEffect(() => {
    setHomeOGTags();
    if (typeof window === "undefined") return;
    setHasBirth(!!window.localStorage.getItem("muun_user_birth"));
  }, []);

  const submitBirth = (e: FormEvent) => {
    e.preventDefault();
    const digits = birthInput.replace(/\D/g, "");
    if (digits.length < 6) return;

    if (typeof window !== "undefined") {
      const data = {
        birth: digits,
        calType: "solar",
        siju: "unknown",
        savedAt: new Date().toISOString(),
      };
      window.localStorage.setItem("muun_user_birth", JSON.stringify(data));
      setHasBirth(true);
    }

    navigate("/lifelong-saju");
  };

  return (
    <div className="min-h-screen bg-[#f3f3f8] pb-14 text-slate-900">
      <Helmet>
        <title>
          무료 사주 무운 (MuUn) - 회원가입 없는 100% 무료 사주풀이 및 2026년
          운세
        </title>
        <meta
          name="description"
          content="회원가입 없이, 개인정보 저장 없이, 생년월일만으로 바로 확인하는 100% 무료 사주풀이. 2026년 병오년 신년운세, 토정비결, 궁합, 타로, 꿈해몽까지 모두 무료로 이용하세요."
        />
      </Helmet>

      <OrganizationSchema />
      <WebApplicationSchema />
      <SiteNavigationSchema />
      <BreadcrumbListSchema
        items={[{ name: "홈", url: "https://muunsaju.com" }]}
      />

      <section className="bg-[#3f2cb6] px-4 pb-8 pt-5 text-white">
        <div className="mx-auto w-full max-w-[760px]">
          <div className="mb-4 flex flex-wrap gap-2 text-xs font-medium">
            <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1">
              ✓ 회원가입 없음
            </span>
            <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1">
              🔒 정보 저장 안함
            </span>
            <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1">
              ☆ 100% 무료
            </span>
          </div>

          <h1 className="text-[39px] font-extrabold leading-[1.15] tracking-[-0.04em]">
            생년월일로 바로
            <br />
            평생사주 보기
          </h1>
          <p className="mt-3 text-sm text-white/75">
            입력 후 바로 결과 화면으로 이동합니다.
          </p>

          <form
            onSubmit={submitBirth}
            className="mt-5 rounded-[22px] bg-white p-4 text-slate-900 shadow-sm"
          >
            <label
              htmlFor="birth"
              className="text-xs font-semibold text-slate-500"
            >
              생년월일 입력
            </label>
            <div className="mt-2 text-sm font-semibold text-slate-700">
              생년월일 8자리
            </div>
            <input
              id="birth"
              type="text"
              inputMode="numeric"
              maxLength={12}
              placeholder="예) 19930521"
              value={birthInput}
              onChange={e => setBirthInput(e.target.value)}
              className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-[30px] font-semibold tracking-tight placeholder:text-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={birthInput.replace(/\D/g, "").length < 6}
              className="mt-3 h-11 w-full rounded-xl border border-slate-300 text-[15px] font-bold text-slate-800 disabled:opacity-50"
            >
              {hasBirth ? "다시 평생사주 보기" : "생년월일을 입력해주세요"}
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-[760px] px-4 py-6">
        <header className="mb-3 flex items-end justify-between">
          <div>
            <p className="text-xs text-slate-400">핵심 서비스</p>
            <h2 className="text-[34px] font-bold tracking-[-0.03em]">
              지금 바로 볼 수 있는 서비스
            </h2>
          </div>
          <Link
            href="/more"
            className="flex items-center text-sm font-bold text-[#3f2cb6]"
          >
            전체 <ChevronRight size={16} />
          </Link>
        </header>
        <div className="grid grid-cols-2 gap-3">
          {coreServices.map(service => (
            <Link
              key={service.title}
              href={service.href}
              className={`rounded-2xl border border-[#e6e7f2] bg-white p-4 ${service.wide ? "col-span-2" : ""}`}
            >
              <div className="mb-4 flex items-center justify-between">
                <service.icon className="h-5 w-5 text-[#3f2cb6]" />
                <span className="rounded-full bg-[#f4f2ff] px-2 py-1 text-[11px] font-semibold text-[#4a37c9]">
                  {service.tag}
                </span>
              </div>
              <p className="font-bold">{service.title}</p>
              <p className="mt-1 text-sm text-slate-500">{service.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[760px] px-4 pb-4">
        <header className="mb-3 flex items-end justify-between">
          <div>
            <p className="text-xs text-slate-400">추가 서비스</p>
            <h2 className="text-[34px] font-bold tracking-[-0.03em]">
              더 많은 무료 서비스
            </h2>
          </div>
          <Link
            href="/more"
            className="flex items-center text-sm font-bold text-[#3f2cb6]"
          >
            전체 <ChevronRight size={16} />
          </Link>
        </header>
        <div className="grid grid-cols-2 gap-3">
          {moreServices.map(service => (
            <Link
              key={service.title}
              href={service.href}
              className={`rounded-2xl border p-4 ${service.featured ? "border-[#c9c1ff] border-dashed bg-[#f4f1ff]" : "border-[#e6e7f2] bg-white"}`}
            >
              <div className="mb-3 flex items-center justify-between">
                <service.icon
                  className={`h-5 w-5 ${service.featured ? "text-[#4a37c9]" : "text-slate-500"}`}
                />
                {service.tag && (
                  <span className="rounded-full bg-[#fdf0ee] px-2 py-0.5 text-[10px] font-semibold text-[#bf5f28]">
                    {service.tag}
                  </span>
                )}
              </div>
              <p
                className={`font-bold ${service.featured ? "text-[#3f2cb6]" : "text-slate-900"}`}
              >
                {service.title}
              </p>
              <p className="mt-1 text-sm text-slate-500">{service.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[760px] px-4 py-3">
        <div className="rounded-3xl bg-[#3f2cb6] p-6 text-white">
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
            무운에서만
          </span>
          <p className="mt-4 text-2xl font-bold leading-tight">
            가족 오행 함께
            <br />
            분석하기
          </p>
          <Link
            href="/family-saju"
            className="mt-5 inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-bold text-[#3f2cb6]"
          >
            가족 사주 보기 <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-[760px] px-4 py-4">
        <header className="mb-3 flex items-end justify-between">
          <div>
            <p className="text-xs text-slate-400">운세 칼럼</p>
            <h2 className="text-[34px] font-bold tracking-[-0.03em]">칼럼</h2>
          </div>
          <Link
            href="/guide"
            className="flex items-center text-sm font-bold text-[#3f2cb6]"
          >
            전체 <ChevronRight size={16} />
          </Link>
        </header>

        <div className="grid grid-cols-2 gap-3">
          {columns.map(column => (
            <Link
              key={column.title}
              href={column.href}
              className="overflow-hidden rounded-2xl border border-[#e6e7f2] bg-white"
            >
              <div className="h-20 bg-gradient-to-br from-[#e9e5ff] to-[#dcecff]" />
              <div className="p-4">
                <span className="rounded-full bg-[#edf0ff] px-2 py-0.5 text-[11px] font-semibold text-[#3f2cb6]">
                  기운법
                </span>
                <p className="mt-2 font-bold leading-tight">
                  {column.title}
                  <br />
                  {column.desc}
                </p>
                <p className="mt-2 text-xs text-slate-400">{column.date}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[760px] px-4 py-4">
        <header className="mb-3 flex items-end justify-between">
          <div>
            <p className="text-xs text-slate-400">운세 사전</p>
            <h2 className="text-[34px] font-bold tracking-[-0.03em]">
              용어 바로 찾기
            </h2>
          </div>
          <Link
            href="/fortune-dictionary"
            className="flex items-center text-sm font-bold text-[#3f2cb6]"
          >
            전체 <ChevronRight size={16} />
          </Link>
        </header>

        <div className="grid grid-cols-2 gap-3">
          {terms.map(item => (
            <Link
              key={item.term}
              href="/fortune-dictionary"
              className="flex items-center gap-3 rounded-xl border border-[#e6e7f2] bg-white px-3 py-3"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#edeaff] text-[#4330be]">
                <Hash size={14} />
              </span>
              <div>
                <p className="font-semibold">{item.term}</p>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-4 border-t border-[#e3e4ef] bg-[#f7f7fb] px-4 py-6 text-sm text-slate-500">
        <div className="mx-auto max-w-[760px]">
          <div className="mb-3 flex items-center gap-2 text-base font-bold text-[#3f2cb6]">
            <House size={16} /> 무운
          </div>
          <p>
            무료 사주, 궁합, 꿈해몽, 운세 사전을 한곳에서 확인할 수 있습니다.
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
            <div>
              <p className="mb-1 font-bold text-slate-700">주요 서비스</p>
              <p>평생사주 · 신년운세 · 궁합</p>
            </div>
            <div>
              <p className="mb-1 font-bold text-slate-700">콘텐츠</p>
              <p>운세 칼럼 · 사전 · 전체 서비스</p>
            </div>
            <div>
              <p className="mb-1 font-bold text-slate-700">안내</p>
              <p>무운 소개 · 문의하기 · 이용약관</p>
            </div>
          </div>
          <p className="mt-5 text-xs text-slate-400">
            © 2026 MUUN Celestial Services. All rights reserved.
          </p>
        </div>
      </section>
    </div>
  );
}
