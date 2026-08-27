import { cn } from "@/lib/utils";

export function WzSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-linear-to-r from-surface-2 via-surface-3 to-surface-2",
        className,
      )}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="w-[168px] shrink-0 sm:w-[196px]">
      <WzSkeleton className="aspect-square w-full rounded-2xl" />
      <WzSkeleton className="mt-3 h-3 w-16" />
      <WzSkeleton className="mt-2 h-4 w-full" />
      <WzSkeleton className="mt-2 h-3 w-2/3" />
    </div>
  );
}

export function RowSkeleton() {
  return (
    <div>
      <WzSkeleton className="mb-4 h-5 w-40" />
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return <WzSkeleton className="aspect-[16/10] w-full rounded-3xl sm:aspect-[21/8]" />;
}
