"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
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
      headline: "We help brands grow across the full funnel.",
      description: "From acquisition to retention, we plan and optimize the touchpoints that matter.",
      services: [
        {
          id: "marketing-full-funnel",
          title: "Full-Funnel Performance",
          summary:
            "Campaign architecture that follows your customer from awareness to retention with measurable milestones along the way.",
          description:
            "We design experiments and reporting loops that connect every stage of the funnel, so we can re-invest in what compounds.",
          ctas: [
            { id: "marketing-full-funnel-primary", label: "Explore marketing", href: "#", style: "primary" },
            { id: "marketing-full-funnel-secondary", label: "Book intro call", href: "#", style: "secondary" },
          ],
        },
        {
          id: "marketing-paid-search",
          title: "Paid Search",
          summary:
            "High-intent capture on Google and Microsoft Ads with creative testing, negative keyword hygiene, and live dashboards.",
          description:
            "From keyword mining to smart bidding calibration, we keep your account efficient while scaling profitable conversions.",
          ctas: [{ id: "marketing-paid-search-primary", label: "Start a campaign", href: "#", style: "primary" }],
        },
        {
          id: "marketing-paid-social",
          title: "Paid Social",
          summary:
            "Stories and feeds that convert. We iterate fast across Meta, TikTok, and LinkedIn with creative sprints and cohort reporting.",
          description:
            "Lean into creative volume and audience insights to keep your acquisition curve healthy across every platform.",
          ctas: [{ id: "marketing-paid-social-primary", label: "See social playbook", href: "#", style: "primary" }],
        },
        {
          id: "marketing-email",
          title: "E-Mail Marketing",
          summary:
            "Lifecycle flows, broadcast campaigns, and segmentation that keeps customers moving without feeling spammed.",
          description:
            "Automations and newsletters tuned for retention—mixing personalization, testing, and deliverability best practice.",
          ctas: [{ id: "marketing-email-primary", label: "Review lifecycle", href: "#", style: "primary" }],
        },
      ],
    },
    {
      id: "web",
      label: "Web",
      headline: "We design and ship fast, resilient web experiences.",
      description: "Websites, products, and commerce—built to scale and easy to maintain.",
      services: [
        {
          id: "web-sites",
          title: "Hjemmesider",
          summary:
            "Conversion-first marketing sites built with Next.js, tuned for performance, localization, and a design system you can scale.",
          description:
            "Launch a flagship experience with CMS workflows, modular sections, and analytics wired in from day one.",
          ctas: [
            { id: "web-sites-primary", label: "Plan your build", href: "#", style: "primary" },
            { id: "web-sites-secondary", label: "See case studies", href: "#", style: "secondary" },
          ],
        },
        {
          id: "web-crm",
          title: "CRM",
          summary:
            "Implementations and automations that keep your pipeline visible and optimised across marketing and sales teams.",
          description:
            "We audit, migrate, and extend tools like HubSpot and Salesforce so your data syncs cleanly across the stack.",
          ctas: [{ id: "web-crm-primary", label: "Map your CRM", href: "#", style: "primary" }],
        },
        {
          id: "web-ai",
          title: "AI",
          summary:
            "Pragmatic AI integrations powered by your real workflows—assistants, automation, and data loops that actually save time.",
          description:
            "Experiment quickly with prototypes, then harden the winners into production features with clear guardrails.",
          ctas: [{ id: "web-ai-primary", label: "Workshop ideas", href: "#", style: "primary" }],
        },
        {
          id: "web-ecommerce",
          title: "eCommerce",
          summary:
            "Composable commerce experiences with fast product discovery, checkout clarity, and analytics wired in from day one.",
          description:
            "Optimise merchandising, PDP storytelling, and retention journeys with a modern commerce stack.",
          ctas: [{ id: "web-ecommerce-primary", label: "Optimise store", href: "#", style: "primary" }],
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

    const normalizedTabs = sourceTabs.reduce<NormalizedTab[]>((acc, tab, tabIndex) => {
      const label = tab.label?.trim();
      if (!label) return acc;

      const id = tab.id?.trim() || slugify(`${label}-${tabIndex}`);
      const headline = tab.headline?.trim();
      const descriptionCopy = tab.description?.trim();
      const services = (tab.services ?? [])
        .map((service, serviceIndex) => {
          const serviceTitle = service.title?.trim();
          if (!serviceTitle) return null;
          const serviceId = service.id?.trim() || slugify(`${id}-${serviceTitle}-${serviceIndex}`);

          return {
            ...service,
            title: serviceTitle,
            id: serviceId,
            ctas: service.ctas?.map((cta, ctaIndex) => ({
              ...cta,
              id: cta.id?.trim() || slugify(`${serviceId}-cta-${ctaIndex}`),
            })),
          } as ServicesSplitService;
        })
        .filter((service): service is ServicesSplitService => Boolean(service && service.id));

      if (!services.length) return acc;

      acc.push({
        ...tab,
        id,
        label,
        headline,
        description: descriptionCopy,
        services,
      } satisfies NormalizedTab);

      return acc;
    }, []);

    return { tabs: normalizedTabs };
  }, [tabs]);

  const [activeTabId, setActiveTabId] = useState<string>(() => normalized.tabs[0]?.id ?? "");
  const [activeServiceId, setActiveServiceId] = useState<string>(() => normalized.tabs[0]?.services[0]?.id ?? "");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const tabCount = normalized.tabs.length;

  const focusTabAtIndex = (index: number) => {
    const nextTab = normalized.tabs[index];
    if (!nextTab) return;
    setActiveTabId(nextTab.id);
    setActiveServiceId(nextTab.services[0]?.id ?? "");
    tabRefs.current[index]?.focus();
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!tabCount) return;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const nextIndex = (index + direction + tabCount) % tabCount;
      focusTabAtIndex(nextIndex);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusTabAtIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusTabAtIndex(tabCount - 1);
    }
  };

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

  const fallbackTitle = title ?? DEFAULT_CONTENT.title;
  const fallbackDescription = description ?? DEFAULT_CONTENT.description;
  const activeHeadline = activeTab.headline ?? fallbackTitle;
  const activeDescription = activeTab.description ?? fallbackDescription;

  return (
    <section className={cn("py-24", className)}>
      <Container className="grid gap-12 md:grid-cols-2 lg:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)]">
        <div className="flex flex-col">
          {eyebrow ? (
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:color-mix(in_oklch,var(--mb-ink)_58%,var(--mb-bg)_42%)]">
              {eyebrow}
            </span>
          ) : null}
          {activeHeadline ? (
            <h2 className="mt-3 text-[clamp(32px,6vw,58px)] font-semibold leading-[1.05] tracking-tight text-[color:var(--mb-ink)]">
              {activeHeadline}
            </h2>
          ) : null}
          {activeDescription ? (
            <p className="mt-5 max-w-xl text-[clamp(16px,1.9vw,20px)] leading-relaxed text-[color:color-mix(in_oklch,var(--mb-ink)_68%,var(--mb-bg)_32%)]">
              {activeDescription}
            </p>
          ) : null}

          <div
            role="tablist"
            aria-label="Service pillars"
            aria-orientation="horizontal"
            className="mt-10 flex flex-wrap items-center gap-2 rounded-[5px] bg-[color:var(--surface-dark)] p-1 text-[color:color-mix(in_oklch,var(--mb-bg)_84%,var(--surface-dark)_16%)] shadow-[0_20px_60px_rgba(18,15,33,0.22)]"
          >
            {normalized.tabs.map((tab, tabIndex) => {
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
                  ref={(node) => {
                    tabRefs.current[tabIndex] = node;
                  }}
                  onClick={() => {
                    setActiveTabId(tab.id);
                    setActiveServiceId(tab.services[0]?.id ?? "");
                  }}
                  onKeyDown={(event) => handleTabKeyDown(event, tabIndex)}
                  className={cn(
                    "relative inline-flex items-center justify-center rounded-[4px] px-4 py-2 text-[15px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--mb-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--surface-dark)]",
                    isActive
                      ? "border-b-2 border-[color:var(--mb-accent)] bg-[color:color-mix(in_oklch,var(--surface-dark)_55%,white_45%)] text-[color:var(--mb-bg)]"
                      : "text-[color:color-mix(in_oklch,var(--mb-bg)_72%,var(--surface-dark)_28%)] hover:bg-[color:color-mix(in_oklch,var(--surface-dark)_70%,white_30%)] hover:text-[color:var(--mb-bg)]",
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
                className="divide-y divide-[color:color-mix(in_oklch,var(--mb-ink)_18%,var(--mb-bg)_82%)] border-b border-[color:color-mix(in_oklch,var(--mb-ink)_18%,var(--mb-bg)_82%)]"
              >
                {activeTab.services.map((service) => {
                  const isActiveService = service.id === activeService?.id;

                  return (
                    <motion.li key={service.id} variants={itemVariants}>
                      <button
                        type="button"
                        className={cn(
                          "group flex w-full items-center justify-between gap-6 px-0 py-4 text-left text-[20px] font-medium transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--mb-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--surface-dark)]",
                          isActiveService
                            ? "font-semibold text-[color:var(--mb-ink)]"
                            : "text-[color:color-mix(in_oklch,var(--mb-ink)_62%,var(--mb-bg)_38%)] hover:text-[color:var(--mb-ink)]",
                        )}
                        onClick={() => setActiveServiceId(service.id)}
                        aria-current={isActiveService ? "true" : undefined}
                      >
                        <span className="truncate">{service.title}</span>
                        <span
                          className={cn(
                            "inline-flex size-9 min-h-9 min-w-9 items-center justify-center text-[color:color-mix(in_oklch,var(--mb-ink)_58%,var(--mb-bg)_42%)] transition-transform duration-200 group-hover:translate-x-[0.35rem]",
                            isActiveService && "text-[color:var(--mb-ink)]",
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
                className="rounded-[5px] border border-[color:color-mix(in_oklch,var(--mb-ink)_70%,var(--mb-bg)_30%)] bg-[color:var(--mb-ink)] p-6 text-[color:var(--mb-bg)] shadow-[0_36px_110px_rgba(18,15,33,0.28)]"
              >
                {renderMedia(activeService.media)}

                <div className="mt-6 flex flex-col gap-4">
                  <header className="space-y-3">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:color-mix(in_oklch,var(--mb-bg)_75%,var(--mb-ink)_25%)]">
                      {activeTab.label}
                    </p>
                    <h3 className="text-[clamp(24px,3vw,34px)] font-semibold leading-tight text-[color:var(--mb-bg)]">
                      {activeService.detailTitle || activeService.title}
                    </h3>
                    {activeService.summary ? (
                      <p className="text-[17px] leading-relaxed text-[color:color-mix(in_oklch,var(--mb-bg)_82%,var(--mb-ink)_18%)]">
                        {activeService.summary}
                      </p>
                    ) : null}
                  </header>

                  {activeService.description ? (
                    <p className="text-[16px] leading-relaxed text-[color:color-mix(in_oklch,var(--mb-bg)_76%,var(--mb-ink)_24%)]">
                      {activeService.description}
                    </p>
                  ) : null}

                  <div className="mt-2 flex flex-wrap gap-3">
                    {activeService.ctas?.map((cta, index) => (
                      <CtaButton key={cta.id || `${activeService.id}-cta-${index}`} cta={cta} index={index} />
                    ))}
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
  const wrapperClasses = "relative w-full overflow-hidden rounded-[5px] bg-[color:color-mix(in_oklch,var(--mb-bg)_90%,var(--mb-ink)_10%)]";
  const heightClasses = "h-[clamp(340px,40vh,500px)]";

  if (!media) {
    return (
      <div className={`flex ${heightClasses} items-center justify-center rounded-[5px] bg-[color:color-mix(in_oklch,var(--mb-bg)_90%,var(--mb-ink)_10%)] text-sm text-[color:color-mix(in_oklch,var(--mb-ink)_55%,var(--mb-bg)_45%)]`}>
        Add media in Sanity
      </div>
    );
  }

  if (media.type === "image") {
    return (
      <div className={`${wrapperClasses} ${heightClasses}`}>
        <Image
          src={media.src}
          alt={media.alt || "Service visual"}
          fill
          className="object-cover"
          sizes="(min-width: 1280px) 60vw, (min-width: 768px) 70vw, 100vw"
          placeholder={media.blurDataURL ? "blur" : undefined}
          blurDataURL={media.blurDataURL}
        />
      </div>
    );
  }

  return (
    <div className={`${wrapperClasses} ${heightClasses}`}>
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

function CtaButton({ cta, index }: { cta: ServicesSplitCta; index: number }) {
  if (!cta.href) return null;
  const resolvedVariant: "primary" | "secondary" = (() => {
    if (cta.style === "secondary") return "secondary";
    if (cta.style === "primary") return "primary";
    return index === 0 ? "primary" : "secondary";
  })();
  const baseStyles =
    "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[999px] px-6 py-[0.65rem] text-sm font-semibold leading-[1.05] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--mb-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--mb-ink)]";

  if (resolvedVariant === "primary") {
    return (
      <Link
        href={cta.href}
        target={cta.target}
        rel={cta.rel}
        className={cn(
          baseStyles,
          "bg-[color:var(--mb-accent)] text-[color:var(--mb-bg)] hover:bg-[color:color-mix(in_oklch,var(--mb-accent)_88%,white_12%)]",
        )}
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
        "border border-[color:color-mix(in_oklch,var(--mb-ink)_16%,var(--mb-bg)_84%)] bg-[color:var(--surface-base)] text-[color:color-mix(in_oklch,var(--mb-ink)_72%,var(--mb-bg)_28%)] hover:border-[color:color-mix(in_oklch,var(--mb-ink)_22%,var(--mb-bg)_78%)] hover:text-[color:var(--mb-ink)]",
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
