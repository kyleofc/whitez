import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import { Icon } from "@/components/ui/icon";
import { wzButtonClass } from "@/components/ui/wz-button";

interface Promo {
  id: string;
  bannerUrl: string;
  linkUrl: string;
  order?: number;
}

function usePromos(): { promos: Promo[]; error: string | null; loaded: boolean } {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const q = query(collection(getDb(), "promos"), orderBy("order", "asc"));
    return onSnapshot(
      q,
      (snap) => {
        const next: Promo[] = [];
        snap.forEach((d) => next.push({ id: d.id, ...(d.data() as object) } as Promo));
        setPromos(next);
        setLoaded(true);
        setError(null);
      },
      (err) => {
        setError(err.message);
        setLoaded(true);
      },
    );
  }, []);

  return { promos, error, loaded };
}

/** Banners promocionais avulsos — mesmo visual do carrossel de fixados. */
export function PromoBanners() {
  const { promos, error } = usePromos();

  if (error || promos.length === 0) return null;

  return (
    <div className="scrollbar-none mb-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
      {promos.map((promo, i) => {
        const label = `Ver tutorial link ${promo.order ?? i + 1}`;
        return (
          <article
            key={promo.id}
            className="relative aspect-[16/10] w-full shrink-0 snap-center overflow-hidden rounded-3xl border border-border bg-surface shadow-lift sm:aspect-[21/8]"
          >
            <img
              src={promo.bannerUrl}
              alt="Promo"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-r from-background via-background/80 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-t from-background/95 via-transparent to-transparent" />

            <div className="relative flex h-full flex-col justify-end gap-3 p-5 sm:max-w-lg sm:justify-center sm:p-10">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-1 text-[10px] font-bold tracking-[0.14em] text-primary uppercase">
                  <Icon name="local_fire_department" size={13} filled />
                  Destaque
                </span>
                <span className="rounded-full border border-border bg-surface/70 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase backdrop-blur-sm">
                  Tutoriais
                </span>
              </div>

              <div className="mt-1">
                <a
                  href={promo.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={wzButtonClass("primary", "md")}
                >
                  <Icon name="play_arrow" size={18} filled />
                  {label.toUpperCase()}
                </a>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
