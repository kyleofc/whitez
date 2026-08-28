import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { getDb } from "@/lib/firebase";

interface Promo {
  id: string;
  bannerUrl: string;
  linkUrl: string;
  order?: number;
}

function usePromos(): Promo[] {
  const [promos, setPromos] = useState<Promo[]>([]);
  useEffect(() => {
    const q = query(collection(getDb(), "promos"), orderBy("order", "asc"));
    return onSnapshot(q, (snap) => {
      const next: Promo[] = [];
      snap.forEach((d) => next.push({ id: d.id, ...(d.data() as object) } as Promo));
      setPromos(next);
    });
  }, []);
  return promos;
}

export function PromoBanners() {
  const promos = usePromos();
  if (promos.length === 0) return null;

  return (
    <div className="mb-10 grid gap-4 sm:grid-cols-2">
      {promos.map((promo) => (
        <a
          key={promo.id}
          href={promo.linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block overflow-hidden rounded-2xl border border-border bg-surface transition-transform hover:scale-[1.01]"
        >
          <img
            src={promo.bannerUrl}
            alt="Promo"
            loading="lazy"
            className="aspect-[16/7] w-full object-cover"
          />
        </a>
      ))}
    </div>
  );
}
