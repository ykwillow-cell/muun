import { Link } from 'wouter';
import { ArrowUpRight } from 'lucide-react';

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

export default function RelatedServices({ title = '함께 보면 좋은 서비스', services }: RelatedServicesProps) {
  if (!services || services.length === 0) return null;

  return (
    <section className="my-10">
      <div className="mu-glass-panel overflow-hidden p-5 sm:p-6">
        <div>
          <span className="mu-divider-text">Related services</span>
          <h2 className="mt-3 text-[24px] font-extrabold tracking-[-0.05em] text-slate-900">{title}</h2>
        </div>

        <div className="mt-5 mu-auto-grid-220">
          {services.map((service) => (
            <Link key={service.href} href={service.href} className="mu-link-card p-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6B5FFF]/10 text-[22px]">
                  <span aria-hidden="true">{service.emoji}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-[17px] font-extrabold tracking-[-0.04em] text-slate-900">{service.label}</h3>
                    <ArrowUpRight size={16} className="text-slate-400" aria-hidden="true" />
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{service.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
