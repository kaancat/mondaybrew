"use client";
import { useEffect, useRef } from "react";

type Props = { id: string };

export function TypeformEmbed({ id }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const script = document.createElement("script");
    script.src = "https://embed.typeform.com/next/embed.js";
    script.async = true;
    ref.current.appendChild(script);
    return () => { script.remove(); };
  }, []);
  return (
    <div
      ref={ref}
      data-tf-live={id}
      className="w-full min-h-[600px]"
      style={{
        // Prevent transform interference with mobile menu
        transform: 'none',
        willChange: 'auto',
        isolation: 'auto'
      }}
    />
  );
}

