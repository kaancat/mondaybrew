"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import * as Accordion from "@radix-ui/react-accordion";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronDown } from "lucide-react";

/**
 * FAQ Component - Client-side interactive FAQ with category navigation
 * 
 * Left side: Category navigation
 * Right side: Expandable questions and answers using Radix Accordion
 * 
 * Purpose: Display frequently asked questions organized by category
 * Why: Provides an intuitive, accessible way for users to find answers
 */

interface FAQItem {
  question: string;
  answer: string;
  cta?: {
    label?: string | null;
    href?: string | null;
    variant?: string | null;
    reference?: {
      slug?: string | null;
      locale?: string | null;
    } | null;
  } | null;
}

interface FAQCategory {
  id: string;
  label: string;
  questions: FAQItem[];
}

interface FAQClientProps {
  title?: string;
  subheading?: string;
  titleAlignment?: "left" | "center" | "right";
  categories?: FAQCategory[];
}

// Placeholder data - will be replaced with Sanity CMS data
const placeholderData: FAQCategory[] = [
  {
    id: "marketing",
    label: "Marketing",
    questions: [
      {
        question: "Hvad er Full-Funnel Performance Marketing?",
        answer:
          "Full-Funnel Performance Marketing dækker hele kundens rejse fra awareness til konvertering. Vi optimerer hver fase af tragten for at maksimere ROI gennem databaserede strategier på tværs af alle platforme.",
      },
      {
        question: "Hvilke platforme arbejder I med?",
        answer:
          "Vi arbejder med alle større platforme inklusiv Google Ads, Meta (Facebook & Instagram), LinkedIn, TikTok og programmatic advertising. Vi vælger de platforme der giver bedst værdi for netop jeres målgruppe.",
      },
      {
        question: "Hvor lang tid tager det at se resultater?",
        answer:
          "Det afhænger af jeres udgangspunkt og mål. Typisk ser vi de første positive tendenser indenfor 4-6 uger, mens signifikante forbedringer normalt kommer efter 3-4 måneder med løbende optimering.",
      },
      {
        question: "Hvordan måler I success?",
        answer:
          "Vi sætter klare KPI'er baseret på jeres forretningsmål - det kan være ROAS, CPA, conversion rate eller andre relevante metrics. I får løbende transparent rapportering og adgang til dashboards i real-time.",
      },
    ],
  },
  {
    id: "web",
    label: "Web & Development",
    questions: [
      {
        question: "Hvilke teknologier bruger I?",
        answer:
          "Vi bygger primært med moderne tech stacks som Next.js, React, og TypeScript for frontend, kombineret med headless CMS løsninger som Sanity. Dette sikrer performance, skalerbarhed og fremtidssikring.",
      },
      {
        question: "Laver I også e-commerce løsninger?",
        answer:
          "Ja, vi udvikler skræddersyede e-commerce løsninger baseret på jeres behov. Vi arbejder både med Shopify Plus til hurtige launches og custom løsninger når der er behov for avanceret funktionalitet.",
      },
      {
        question: "Kan I hjælpe med integration af AI?",
        answer:
          "Absolut! Vi implementerer AI-løsninger som chatbots, personalisering, content generation og automatisering. Vi fokuserer på praktiske anvendelser der skaber reel værdi for jeres forretning og brugere.",
      },
    ],
  },
  {
    id: "cases",
    label: "Cases & Resultater",
    questions: [
      {
        question: "Kan jeg se konkrete eksempler på jeres arbejde?",
        answer:
          "Ja, vi har et udvalg af cases der viser konkrete resultater for vores kunder. Besøg vores case-side for at se projekter inden for forskellige brancher og se de resultater vi har opnået.",
      },
      {
        question: "Arbejder I med virksomheder i min branche?",
        answer:
          "Vi har erfaring på tværs af mange brancher inklusiv e-commerce, B2B, SaaS, finance og retail. Vores datadrevne tilgang fungerer på tværs af industrier, og vi bringer læring fra forskellige sektorer med os.",
      },
      {
        question: "Hvad er jeres typiske projektstørrelse?",
        answer:
          "Vi arbejder med alt fra startups til etablerede virksomheder. Vores projekter spænder typisk fra 50.000 kr. for mindre websites til flere millioner for omfattende marketing kampagner eller komplekse web-platforme.",
      },
    ],
  },
  {
    id: "company",
    label: "Om MondayBrew",
    questions: [
      {
        question: "Hvem er MondayBrew?",
        answer:
          "Vi er et bureau der kombinerer performance marketing med moderne web development. Vores team består af specialister inden for strategi, paid media, development og design - alt samlet under ét tag.",
      },
      {
        question: "Hvor er I lokaliseret?",
        answer:
          "Vi holder til på Vesterbrogade 74 i København, men arbejder med kunder over hele Danmark og internationalt. Meget af vores arbejde kan foregå remote, men vi elsker også face-to-face møder.",
      },
      {
        question: "Hvordan kommer vi i gang?",
        answer:
          "Book et uforpligtende møde via vores kontaktside eller ring direkte på (+45) 42 21 10 65. Vi starter typisk med at forstå jeres mål og udfordringer, og kommer derefter med en skræddersyet plan.",
      },
      {
        question: "Hvad koster det at arbejde med jer?",
        answer:
          "Prisen afhænger af scope og kompleksitet. Vi arbejder både med projektbaserede aftaler og månedlige retainers. Efter et indledende møde laver vi et transparent tilbud baseret på jeres specifikke behov.",
      },
    ],
  },
];

interface AccordionItemWithAnimationProps {
  item: FAQItem;
  index: number;
  isLightAlt: boolean;
  isDark: boolean;
}

function resolveHref(cta: FAQItem["cta"]): string | null {
  if (!cta) return null;
  const manual = cta.href?.trim();
  if (manual) return manual;
  const slug = cta.reference?.slug?.trim();
  if (slug) {
    const locale = cta.reference?.locale || "da";
    return locale === "en" ? `/en/${slug}` : `/${slug}`;
  }
  return null;
}

function AccordionItemWithAnimation({ item, index, isLightAlt, isDark }: AccordionItemWithAnimationProps) {
  const itemRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const itemElement = itemRef.current;
    if (!itemElement) return;

    const content = itemElement.querySelector('[data-state]');
    if (!content) return;

    const checkState = () => {
      const state = content.getAttribute("data-state");
      const willBeOpen = state === "open";
      
      if (willBeOpen) {
        // Ensure content is rendered before animating open
        setShouldRender(true);
        // Small delay to ensure Radix has rendered the content
        setTimeout(() => setIsOpen(true), 10);
      } else {
        // Start closing animation immediately
        setIsOpen(false);
        // Keep content rendered during animation, then unmount after animation completes
        setTimeout(() => {
          setShouldRender(false);
        }, 300); // Match animation duration
      }
    };

    const observer = new MutationObserver(checkState);
    observer.observe(content, { attributes: true, attributeFilter: ["data-state"] });
    
    // Initial check
    checkState();

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={itemRef}>
      <Accordion.Item
        value={`item-${index}`}
        className="shadow-sm overflow-hidden transition-all hover:shadow-md"
        style={{ borderRadius: "5px" }}
      >
        <Accordion.Header>
          <Accordion.Trigger
            className={cn(
              "group flex w-full items-center justify-between px-6 py-5 text-left transition-all",
              isLightAlt
                ? "bg-white hover:bg-white/90 border border-black/10 data-[state=open]:bg-white data-[state=open]:hover:bg-white"
                : isDark
                  ? "bg-[#F5F7FD] hover:bg-[#F5F7FD]/90 data-[state=open]:bg-[#F5F7FD] data-[state=open]:hover:bg-[#F5F7FD]"
                  : "bg-[#49444b] hover:bg-[#49444b]/90 data-[state=open]:bg-[#49444b] data-[state=open]:hover:bg-[#49444b]",
            )}
          >
            <span
              className={cn(
                "font-medium text-base pr-4",
                isLightAlt
                  ? "text-black"
                  : isDark
                    ? "text-[#343438]"
                    : "text-[color:var(--mb-bg)]",
              )}
            >
              {item.question}
            </span>
            <ChevronDown
              className={cn(
                "w-5 h-5 transition-transform duration-300 group-data-[state=open]:rotate-180 flex-shrink-0",
                isLightAlt
                  ? "text-black/70"
                  : isDark
                    ? "text-[#343438]"
                    : "text-[color:color-mix(in_oklch,var(--mb-bg)_70%,transparent)]",
              )}
            />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content
          className={cn(
            "overflow-hidden",
            isLightAlt
              ? "bg-white/80 border-x border-b border-black/10"
              : isDark
                ? "bg-[#F5F7FD]"
                : "bg-[#49444b]/80",
          )}
          forceMount={shouldRender}
        >
          {shouldRender && (
            <motion.div
              initial={false}
              animate={isOpen ? "open" : "closed"}
              variants={{
                open: {
                  height: "auto",
                  transition: {
                    height: {
                      duration: 0.3,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    },
                  },
                },
                closed: {
                  height: 0,
                  transition: {
                    height: {
                      duration: 0.3,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    },
                  },
                },
              }}
              style={{ overflow: "hidden" }}
            >
              <div className="px-6 pb-6 pt-4">
                <p
                  className={cn(
                    "mb-4",
                    isLightAlt
                      ? "text-black/80"
                      : isDark
                        ? "text-[color:var(--card-foreground)]"
                        : "text-[color:color-mix(in_oklch,var(--mb-bg)_80%,transparent)]",
                  )}
                >
                  {item.answer}
                </p>
                {item.cta?.label && resolveHref(item.cta) && (
                  <Link
                    href={resolveHref(item.cta)!}
                    className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#FF9859] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#e8874f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9859] focus-visible:ring-offset-2"
                  >
                    {item.cta.label}
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </Accordion.Content>
      </Accordion.Item>
    </div>
  );
}

export function FAQClient({
  title = "Ofte Stillede Spørgsmål",
  subheading = "Vores platform er bygget til at hjælpe dig med at arbejde smartere, ikke hårdere. Find svar på de mest stillede spørgsmål.",
  titleAlignment = "center",
  categories = placeholderData,
}: FAQClientProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id ?? "marketing");

  // Prevent hydration mismatch by only applying theme classes after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const isLightAlt = mounted && resolvedTheme === "light-alt";
  const isDark = mounted && resolvedTheme === "dark";

  const currentCategory = categories.find((cat) => cat.id === activeCategory) ?? categories[0];

  // Alignment classes
  const alignmentClasses = {
    left: "text-left",
    center: "text-center mx-auto",
    right: "text-right ml-auto",
  };

  return (
    <div className="relative w-full min-h-[600px]">
      <div className="px-[var(--container-gutter)] py-20">
        {/* Header */}
        <div className={cn("mb-16 max-w-3xl", alignmentClasses[titleAlignment])}>
          <h2
            className={cn(
              "text-4xl md:text-5xl font-bold mb-4",
              isLightAlt ? "text-black" : isDark ? "text-[color:var(--foreground)]" : "",
            )}
          >
            {title}
          </h2>
          {subheading && (
            <p
              className={cn(
                "text-lg",
                isLightAlt ? "text-black/70" : isDark ? "text-[color:var(--muted-foreground)]" : "text-muted-foreground",
              )}
            >
              {subheading}
            </p>
          )}
        </div>

        {/* Two-column layout */}
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[320px_1fr] gap-8 lg:gap-12">
          {/* Left: Categories */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <nav className="flex flex-col gap-4" aria-label="FAQ Categories">
              {categories.map((category) => {
                const isActive = activeCategory === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={cn(
                      "group flex items-center justify-between text-left transition-all duration-200 px-6",
                      isActive
                        ? isLightAlt
                          ? "py-4 bg-white shadow-sm border border-black/10"
                          : isDark
                            ? "py-4 bg-[#F5F7FD] shadow-sm"
                            : "py-4 bg-[#49444b] shadow-sm"
                        : "py-2",
                    )}
                    style={isActive ? { borderRadius: "5px" } : undefined}
                    aria-current={isActive ? "true" : undefined}
                  >
                    <span
                      className={cn(
                        "font-medium transition-colors",
                        isLightAlt
                          ? isActive
                            ? "text-black"
                            : "text-black/70"
                          : isDark
                            ? isActive
                              ? "text-[#343438]"
                              : "text-[color:var(--foreground)]"
                            : isActive
                              ? "text-[color:var(--mb-bg)]"
                              : "text-[#49444b]",
                      )}
                    >
                      {category.label}
                    </span>
                    {isActive && (
                      <ChevronRight
                        className={cn(
                          "w-5 h-5 transition-all translate-x-1",
                          isLightAlt
                            ? "text-black"
                            : isDark
                              ? "text-[#343438]"
                              : "text-[color:var(--mb-bg)]",
                        )}
                      />
                    )}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Right: Questions */}
          <div className="min-w-0">
            <Accordion.Root type="single" collapsible className="flex flex-col gap-4">
              {currentCategory?.questions.map((item, index) => (
                <AccordionItemWithAnimation
                  key={`${activeCategory}-${index}`}
                  item={item}
                  index={index}
                  isLightAlt={isLightAlt}
                  isDark={isDark}
                />
              ))}
            </Accordion.Root>
          </div>
        </div>
      </div>
    </div>
  );
}

