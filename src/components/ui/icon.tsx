import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface IconProps {
  name: string;
  className?: string | undefined;
  filled?: boolean | undefined;
  size?: number | undefined;
  weight?: number | undefined;
}


/** Ícone Material Symbols com controle de preenchimento/peso. */
export function Icon({ name, className, filled, size = 20, weight = 400 }: IconProps) {
  const style: CSSProperties = {
    fontSize: size,
    fontVariationSettings: `"FILL" ${filled ? 1 : 0}, "wght" ${weight}, "GRAD" 0, "opsz" 24`,
  };
  return (
    <span aria-hidden className={cn("material-symbols-outlined", className)} style={style}>
      {name}
    </span>
  );
}
