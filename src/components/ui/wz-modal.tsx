import { useEffect, type ReactNode } from "react";
import { Icon } from "./icon";
import { cn } from "@/lib/utils";

interface WzModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  labelledBy?: string;
  className?: string;
}

export function WzModal({ open, onClose, children, labelledBy, className }: WzModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    const scrollY = window.scrollY;
    const body = document.body.style;
    const prev = {
      position: body.position,
      top: body.top,
      left: body.left,
      right: body.right,
      width: body.width,
      overflow: body.overflow,
    };

    body.position = "fixed";
    body.top = `-${scrollY}px`;
    body.left = "0";
    body.right = "0";
    body.width = "100%";
    body.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      body.position = prev.position;
      body.top = prev.top;
      body.left = prev.left;
      body.right = prev.right;
      body.width = prev.width;
      body.overflow = prev.overflow;
      window.scrollTo(0, scrollY);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-end justify-center overflow-y-auto bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-6 animate-in fade-in duration-150"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "relative w-full max-w-2xl overflow-hidden border border-border bg-card shadow-lift",
          "rounded-t-3xl sm:rounded-3xl",
          "animate-in slide-in-from-bottom-4 duration-200",
          className,
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-4 right-4 z-10 grid h-10 w-10 place-items-center rounded-full border border-border bg-background/70 text-foreground backdrop-blur-md transition-colors hover:bg-surface-3"
        >
          <Icon name="close" size={20} />
        </button>
        {children}
      </div>
    </div>
  );
}
