"use client";

import { TextImageClient, type TextImageResolvedImage } from "./text-image.client";
import { TextImageTabs } from "./text-image.tabs.client";

export function TextImageSwitch(props: {
  variant?: "default" | "tabs" | null;
  eyebrow?: string;
  title?: string;
  body?: string;
  image: TextImageResolvedImage | null;
  imagePosition: "left" | "right";
  tabs?: { id: string; label: string; title?: string; body?: string }[];
  cta?: { label: string; href: string; variant: "default" | "secondary" | "outline" | "ghost" | "link" } | null;
}) {
  const { variant, tabs = [], ...rest } = props;
  const useTabs = (variant === "tabs" || tabs.length > 0) && tabs.length > 0;
  if (useTabs) {
    return <TextImageTabs {...rest} tabs={tabs} />;
  }
  return <TextImageClient {...rest} />;
}

