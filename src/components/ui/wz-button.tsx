import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger" | "download";
type Size = "sm" | "md" | "lg" | "icon";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-[background,color,transform,box-shadow] duration-150 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-soft hover:bg-primary/90",
  secondary:
    "bg-surface-2 text-foreground border border-border hover:bg-surface-3",
  ghost: "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
  outline:
    "border border-primary/60 text-primary hover:bg-primary/10",
  danger: "bg-destructive/15 text-destructive hover:bg-destructive/25",
  download:
    "w-full bg-linear-to-r from-primary to-primary-soft text-primary-foreground shadow-glow hover:brightness-110 text-base",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-7 text-base",
  icon: "h-10 w-10 p-0",
};

interface WzButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children?: ReactNode;
}

export function WzButton({
  variant = "primary",
  size = "md",
  className,
  ...props
}: WzButtonProps) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props} />
  );
}

export function wzButtonClass(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}
