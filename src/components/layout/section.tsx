import { ElementType, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container, ContainerProps } from "@/components/layout/container";

type SectionPadding = "default" | "sm" | "lg" | "none";

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  width?: ContainerProps["width"];
  padding?: SectionPadding;
  bleed?: boolean;
  innerClassName?: string;
  children: ReactNode;
}

export function Section({
  as: Component = "section",
  width = "default",
  padding = "default",
  bleed = false,
  className,
  innerClassName,
  children,
  ...props
}: SectionProps) {
  return (
    <Component
      className={cn(
        "layout-section",
        padding === "sm" && "layout-section-sm",
        padding === "lg" && "layout-section-lg",
        padding === "none" && "layout-section-none",
        bleed && "full-bleed",
        className,
      )}
      {...props}
    >
      <Container width={width} className={innerClassName}>
        {children}
      </Container>
    </Component>
  );
}

