import { useRef, type ReactNode } from "react";
import { Icon } from "./icon";
import { cn } from "@/lib/utils";

interface CarouselProps {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}

/** Carrossel horizontal com scroll suave e setas em telas maiores. */
export function HorizontalCarousel({ children, className, ariaLabel }: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(280, el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <div className="group/carousel relative">
      <div
        ref={trackRef}
        aria-label={ariaLabel}
        className={cn(
          "scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2",
          className,
        )}
      >
        {children}
      </div>

      <CarouselArrow direction="left" onClick={() => scrollBy(-1)} />
      <CarouselArrow direction="right" onClick={() => scrollBy(1)} />
    </div>
  );
}

function CarouselArrow({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Rolar para a esquerda" : "Rolar para a direita"}
      className={cn(
        "absolute top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-border bg-background/85 text-foreground opacity-0 shadow-soft backdrop-blur-md transition-opacity duration-150 hover:bg-surface-3 group-hover/carousel:opacity-100 md:grid",
        direction === "left" ? "-left-4" : "-right-4",
      )}
    >
      <Icon name={direction === "left" ? "chevron_left" : "chevron_right"} size={22} />
    </button>
  );
}
