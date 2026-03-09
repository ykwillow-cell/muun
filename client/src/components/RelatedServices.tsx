/**
 * RelatedServices.tsx
 * 각 서비스 페이지 하단에 표시되는 관련 서비스 내부 링크 섹션
 * - SEO 내부 링크 구조 강화 목적
 * - 페이지 체류 시간 및 탐색 경험 향상
 */
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

export interface ServiceLink {
  href: string;
  label: string;
  description: string;
  emoji: string;
}

interface RelatedServicesProps {
  title?: string;
  services: ServiceLink[];
}

export default function RelatedServices({ title = "함께 보면 좋은 서비스", services }: RelatedServicesProps) {
  if (!services || services.length === 0) return null;

  return (
    <section className="w-full max-w-4xl mx-auto my-8 px-4">
      <div className="border border-border/50 rounded-2xl overflow-hidden bg-background/60 backdrop-blur-sm">
        <div className="px-6 py-4 border-b border-border/50">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        </div>
        <ul className="divide-y divide-border/30">
          {services.map((service) => (
            <li key={service.href}>
              <Link href={service.href}>
                <a className="flex items-center justify-between px-6 py-4 hover:bg-primary/5 transition-colors group">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl" aria-hidden="true">{service.emoji}</span>
                    <div>
                      <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {service.label}
                      </p>
                      <p className="text-sm text-foreground/60 mt-0.5">{service.description}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-foreground/30 group-hover:text-primary transition-colors flex-shrink-0" />
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
