"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type MobileBottomSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
};

export function MobileBottomSheet({
  open,
  onOpenChange,
  children,
  className,
}: MobileBottomSheetProps) {
  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onOpenChange]);

  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleOverlayClick = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  return (
    <AnimatePresence mode="wait">
      {open && (
        <div className="fixed inset-0 z-[9999]" role="dialog" aria-modal="true">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 0.61, 0.36, 1] }}
            className="absolute inset-0 bg-[color:var(--mobile-nav-overlay)] backdrop-blur-[8px]"
            style={{ WebkitBackdropFilter: "blur(8px)" }}
            onClick={handleOverlayClick}
            aria-hidden="true"
          />

          {/* Container for close button + bottom sheet */}
          <div className="absolute inset-x-0 bottom-0 flex flex-col">
            {/* Close button positioned above the sheet */}
            <div className="flex justify-end px-6 pb-3">
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
                onClick={() => onOpenChange(false)}
                className="inline-flex items-center justify-center rounded-full bg-[color:var(--mobile-nav-surface)] border border-[color:var(--mobile-nav-border)] p-2.5 text-[color:var(--mobile-nav-muted)] shadow-lg transition hover:text-[color:var(--mobile-nav-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nav-toggle-ring)] focus-visible:ring-offset-2"
                aria-label="Close menu"
              >
                <X className="size-5" aria-hidden="true" />
              </motion.button>
            </div>

            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.4, ease: [0.25, 0.62, 0.32, 1] }}
              className={cn(
                "flex flex-col bg-[color:var(--mobile-nav-surface)] text-[color:var(--mobile-nav-text)]",
                "max-h-[82vh] overflow-hidden",
                "rounded-t-[16px] border-t border-[color:var(--mobile-nav-border)]",
                "shadow-[0_-12px_48px_rgba(8,6,20,0.2)]",
                className
              )}
            >
              {children}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

type MobileBottomSheetTriggerProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

export function MobileBottomSheetTrigger({
  children,
  onClick,
  className,
}: MobileBottomSheetTriggerProps) {
  return (
    <button type="button" onClick={onClick} className={className}>
      {children}
    </button>
  );
}

type MobileBottomSheetCloseProps = {
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
};

export function MobileBottomSheetClose({
  children,
  onClose,
  className,
}: MobileBottomSheetCloseProps) {
  return (
    <button type="button" onClick={onClose} className={className}>
      {children}
    </button>
  );
}
