"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

import type {
  ServicesSplitProps,
  ServicesSplitTab,
  ServicesSplitService,
  ServicesSplitMedia,
  ServicesSplitCta,
} from "./services-split.types";

const DEFAULT_EASING: [number, number, number, number] = [0.22, 0.61, 0.36, 1];

type NormalizedTab = ServicesSplitTab & { id: string; services: ServicesSplitService[] };

type NormalizedData = {
  tabs: NormalizedTab[];
};

const DEFAULT_CONTENT: Required<Pick<ServicesSplitProps, "eyebrow" | "title" | "description">> & NormalizedData = {
  eyebrow: "Our Pillars",
  title: "Expert care tailored to how your brand grows.",
  description:
    "Two teams, one partnership. Switch between Marketing and Web to explore the specialist services we bring together.",
  tabs: [
    {
      id: "marketing",
      label: "Marketing",
      services: [
        {
          id: "marketing-full-funnel",
          label: "Full-Funnel Performance",
          description:
            "Campaign architecture that follows your customer from awareness to retention with measurable milestones along the way.",
          summary: "Multi-channel campaigns engineered for compounding growth.",
          primaryCta: {
            label: "Explore marketing",
            href: "#",
            variant: "primary",
          },
          secondaryCta: {
            label: "Book intro call",
            href: "#",
            variant: "secondary",
          },
        },
        {
          id: "marketing-paid-search",
          label: "Paid Search",
          description:
            "High-intent capture on Google and Microsoft Ads with creative testing, negative keyword hygiene, and live dashboards.",
          summary: "Capture intent, protect brand terms, and scale conversion volume.",
          primaryCta: {
            label: "Start a campaign",
            href: "#",
            variant: "primary",
          },
        },
        {
          id: "marketing-paid-social",
          label: "Paid Social",
          description:
            "Stories and feeds that convert. We iterate fast across Meta, TikTok, and LinkedIn with creative sprints and cohort reporting.",
          summary: "Creative-led growth for Meta, TikTok, and LinkedIn.",
          primaryCta: {
            label: "See social playbook",
            href: "#",
            variant: "primary",
          },
        },
        {
          id: "marketing-email",
          label: "E-Mail Marketing",
          description:
            "Lifecycle flows, broadcast campaigns, and segmentation that keeps customers moving forward without feeling spammed.",
          summary: "Automations and campaigns that feel personal and perform.",
          primaryCta: {
            label: "Review lifecycle",
            href: "#",
            variant: "primary",
          },
        },
      ],
    },
    {
      id: "web",
      label: "Web",
      services: [
        {
          id: "web-sites",
          label: "Hjemmesider",
          description:
            "Conversion-first marketing sites built with Next.js, tuned for performance, localization, and a design system you can scale.",
          summary: "Flagship marketing sites that load fast and edit faster.",
          primaryCta: {
            label: "Plan your build",
            href: "#",
            variant: "primary",
          },
          secondaryCta: {
            label: "See case studies",
            href: "#",
            variant: "secondary",
          },
        },
        {
          id: "web-digital-products",
          label: "Digital Products",
          description:
            "From prototypes to production-ready apps. We deliver resilient frontends, CMS workflows, and documentation that grows with you.",
          summary: "Ship new product surfaces without compromising reliability.",
          primaryCta: {
            label: "Scope a product",
            href: "#",
            variant: "primary",
          },
        },
        {
          id: "web-ai",
          label: "AI",
          description:
            "Pragmatic AI integrations powered by your real workflows—assistants, automation, and data loops that actually save time.",
          summary: "Embed AI where it compounds, not where it adds noise.",
          primaryCta: {
            label: "Workshop ideas",
            href: "#",
            variant: "primary",
          },
        },
        {
          id: "web-ecommerce",
          label: "eCommerce",
          description:
            "Composable commerce experiences with fast product discovery, checkout clarity, and analytics wired in from day one.",
          summary: "Better merchandising, faster checkouts, happier customers.",
          primaryCta: {
            label: "Optimize store",
            href: "#",
            variant: "primary",
          },
        },
      ],
    },
  ],
};

export function ServicesSplit({
  className,
  eyebrow = DEFAULT_CONTENT.eyebrow,
  title = DEFAULT_CONTENT.title,
  description = DEFAULT_CONTENT.description,
  tabs,
}: ServicesSplitProps) {
  const normalized = useMemo<NormalizedData>(() => {
    const sourceTabs = (tabs && tabs.length ? tabs : DEFAULT_CONTENT.tabs) ?? [];

    const normalizedTabs = sourceTabs
      .map((tab, tabIndex) => {
        const label = tab.label?.trim();
        if (!label) return null;

        const id = tab.id?.trim() || slugify(`${label}-${tabIndex}`);
        const services = (tab.services ?? [])
          .map((service, serviceIndex) => {
            const serviceLabel = service.label?.trim();
            if (!serviceLabel) return null;
            const serviceId = service.id?.trim() || slugify(`${id}-${serviceLabel}-${serviceIndex}`);

            return {
              ...service,
              label: serviceLabel,
              id: serviceId,
            } as ServicesSplitService;
          })
          .filter((service): service is ServicesSplitService => Boolean(service && service.id));

        if (!services.length) return null;

        return {
          ...tab,
          id,
          label,
          services,
        } satisfies NormalizedTab;
      })
      .filter((tab): tab is NormalizedTab => Boolean(tab));

    return { tabs: normalizedTabs };
  }, [tabs]);

  const [activeTabId, setActiveTabId] = useState<string>(() => normalized.tabs[0]?.id ?? "");
  const [activeServiceId, setActiveServiceId] = useState<string>(() => normalized.tabs[0]?.services[0]?.id ?? "");

  useEffect(() => {
    if (!normalized.tabs.length) return;

    const currentTab = normalized.tabs.find((tab) => tab.id === activeTabId) ?? normalized.tabs[0];
    if (currentTab.id !== activeTabId) {
      setActiveTabId(currentTab.id);
      setActiveServiceId(currentTab.services[0]?.id ?? "");
      return;
    }

    const currentService =
      currentTab.services.find((service) => service.id === activeServiceId) ?? currentTab.services[0];
    if (currentService && currentService.id !== activeServiceId) {
      setActiveServiceId(currentService.id);
    } else if (!currentService && currentTab.services[0]) {
      setActiveServiceId(currentTab.services[0].id);
    }
  }, [normalized, activeTabId, activeServiceId]);

  if (!normalized.tabs.length) {
    return null;
  }

  const activeTab = normalized.tabs.find((tab) => tab.id === activeTabId) ?? normalized.tabs[0];
  const activeService =
    activeTab.services.find((service) => service.id === activeServiceId) ?? activeTab.services[0];

  return (
    <section className={cn("py-24", className)}>
      <Container className="grid gap-12 lg:grid-cols-[0.4fr_0.6fr]">
        <div className="flex flex-col">
          {eyebrow ? (
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-black/55">
              {eyebrow}
            </span>
          ) : null}
          {title ? (
            <h2 className="mt-3 text-[clamp(32px,6vw,58px)] font-semibold leading-[1.05] tracking-tight text-black">
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="mt-5 max-w-xl text-[clamp(16px,1.9vw,20px)] leading-relaxed text-black/70">
              {description}
            </p>
          ) : null}

          <div
            role="tablist"
            aria-label="Service pillars"
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            {normalized.tabs.map((tab) => {
              const isActive = tab.id === activeTab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`${tab.id}-service-list`}
                  id={`${tab.id}-tab`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => {
                    setActiveTabId(tab.id);
                    setActiveServiceId(tab.services[0]?.id ?? "");
                  }}
                  className={cn(
                    "rounded-full border px-5 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black/60",
                    isActive
                      ? "border-black bg-black text-white"
                      : "border-black/10 bg-white text-black/70 hover:border-black/30 hover:text-black",
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="mt-8">
            <AnimatePresence mode="wait">
              <motion.ul
                key={activeTab.id}
                role="list"
                aria-labelledby={`${activeTab.id}-tab`}
                id={`${activeTab.id}-service-list`}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={listVariants}
                className="divide-y divide-black/10 overflow-hidden rounded-[5px] border border-black/10 bg-white"
              >
                {activeTab.services.map((service) => {
                  const isActiveService = service.id === activeService?.id;

                  return (
                    <motion.li key={service.id} variants={itemVariants}>
                      <button
                        type="button"
                        className={cn(
                          "group flex w-full items-center justify-between gap-6 px-6 py-5 text-left text-[18px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black/60",
                          isActiveService
                            ? "bg-black/[0.04] text-black"
                            : "text-black/60 hover:bg-black/[0.03] hover:text-black",
                        )}
                        onClick={() => setActiveServiceId(service.id)}
                        aria-current={isActiveService ? "true" : undefined}
                      >
                        <span className="truncate">{service.label}</span>
                        <span
                          className={cn(
                            "inline-flex size-9 min-h-9 min-w-9 items-center justify-center rounded-[5px] border border-transparent bg-black/[0.04] text-black/60 transition-transform group-hover:translate-x-1",
                            isActiveService && "bg-black text-white",
                          )}
                          aria-hidden
                        >
                          <ArrowRight className="size-[18px]" />
                        </span>
                      </button>
                    </motion.li>
                  );
                })}
              </motion.ul>
            </AnimatePresence>
          </div>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait" initial={false}>
            {activeService ? (
              <motion.article
                key={`${activeTab.id}-${activeService.id}`}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={detailVariants}
                className="rounded-[5px] border border-black/10 bg-white p-6 shadow-[0_30px_90px_rgba(15,15,31,0.08)]"
              >
                {renderMedia(activeService.media)}

                <div className="mt-6 flex flex-col gap-4">
                  <header className="space-y-3">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-black/45">
                      {activeTab.label}
                    </p>
                    <h3 className="text-[clamp(24px,3vw,34px)] font-semibold leading-tight text-black">
                      {activeService.title || activeService.label}
                    </h3>
                    {activeService.summary ? (
                      <p className="text-[17px] leading-relaxed text-black/70">
                        {activeService.summary}
                      </p>
                    ) : null}
                  </header>

                  {activeService.description ? (
                    <p className="text-[16px] leading-relaxed text-black/65">
                      {activeService.description}
                    </p>
                  ) : null}

                  <div className="mt-2 flex flex-wrap gap-3">
                    {activeService.primaryCta ? (
                      <CtaButton key="primary" cta={activeService.primaryCta} />
                    ) : null}
                    {activeService.secondaryCta ? (
                      <CtaButton key="secondary" cta={activeService.secondaryCta} variant="secondary" />
                    ) : null}
                  </div>
                </div>
              </motion.article>
            ) : null}
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
}

function renderMedia(media?: ServicesSplitMedia | null) {
  if (!media) {
    return (
      <div className="flex aspect-[8/5] w-full items-center justify-center rounded-[5px] bg-black/[0.04] text-sm text-black/45">
        Add media in Sanity
      </div>
    );
  }

  if (media.type === "image") {
    return (
      <div className="relative aspect-[8/5] w-full overflow-hidden rounded-[5px] bg-black/[0.04]">
        <Image
          src={media.src}
          alt={media.alt || "Service visual"}
          fill
          className="object-cover"
          sizes="(min-width: 1280px) 640px, (min-width: 768px) 60vw, 100vw"
          placeholder={media.blurDataURL ? "blur" : undefined}
          blurDataURL={media.blurDataURL}
        />
      </div>
    );
  }

  return (
    <div className="relative aspect-[8/5] w-full overflow-hidden rounded-[5px] bg-black/[0.04]">
      <video
        src={media.src}
        poster={media.poster}
        className="size-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      />
    </div>
  );
}

function CtaButton({ cta, variant }: { cta: ServicesSplitCta; variant?: "primary" | "secondary" }) {
  const resolvedVariant = variant ?? cta.variant ?? "primary";
  const baseStyles =
    "inline-flex items-center justify-center rounded-[999px] px-6 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black/60";

  if (resolvedVariant === "primary") {
    return (
      <Link
        href={cta.href}
        target={cta.target}
        rel={cta.rel}
        className={cn(baseStyles, "bg-[#FF914D] text-white hover:bg-[#ff7f2e]")}
      >
        {cta.label}
      </Link>
    );
  }

  return (
    <Link
      href={cta.href}
      target={cta.target}
      rel={cta.rel}
      className={cn(
        baseStyles,
        "border border-black/15 bg-white text-black/70 hover:border-black/30 hover:text-black",
      )}
    >
      {cta.label}
    </Link>
  );
}

const listVariants = {
  hidden: {
    opacity: 0,
    y: 12,
    transition: { duration: 0.18, ease: DEFAULT_EASING },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.28,
      ease: DEFAULT_EASING,
      when: "beforeChildren",
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 10,
    transition: { duration: 0.18, ease: DEFAULT_EASING },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: DEFAULT_EASING },
  },
};

const detailVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    transition: { duration: 0.2, ease: DEFAULT_EASING },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.24, ease: DEFAULT_EASING },
  },
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
