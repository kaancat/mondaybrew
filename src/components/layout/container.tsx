import { ElementType, forwardRef, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Width = "default" | "tight" | "full";

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  as?: ElementType;
  width?: Width;
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ as: Component = "div", width = "default", className, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          "layout-container",
          width === "tight" && "layout-container-tight",
          width === "full" && "layout-container-full",
          className,
        )}
        {...props}
      />
    );
  },
);

Container.displayName = "Container";

