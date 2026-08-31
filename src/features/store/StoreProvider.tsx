import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { getDb, getFirebaseAuth } from "@/lib/firebase";
import { useFavorites } from "@/features/favorites/useFavorites";
import { logoutAdmin } from "@/features/catalog/api";

import type { GameApp, Genre } from "@/features/catalog/types";

export type SectionId = "home" | "favorites" | "admin";

interface StoreValue {
  apps: GameApp[];
  genres: Genre[];
  loading: boolean;
  isAdmin: boolean;
  adminUnlocked: boolean;
  logout: () => Promise<void>;
  section: SectionId;
  setSection: (section: SectionId) => void;

  search: string;
  setSearch: (value: string) => void;
  activeGenre: string | null;
  setActiveGenre: (genre: string | null) => void;
  favorites: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  selectedAppId: string | null;
  openApp: (id: string) => void;
  closeApp: () => void;
  editingApp: GameApp | null;
  setEditingApp: (app: GameApp | null) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

/** SHA-256 da palavra-chave secreta — nunca fica em texto puro no bundle. */
const ADMIN_SEARCH_CODE_HASH =
  "26c76b75ec584d3d823525951d3d1bd63c720ae3d0d1ce285c6bd3fbb407b274";

async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [apps, setApps] = useState<GameApp[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [section, setSectionState] = useState<SectionId>("home");
  const [search, setSearchState] = useState("");
  const [activeGenre, setActiveGenre] = useState<string | null>(null);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [editingApp, setEditingApp] = useState<GameApp | null>(null);

  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  // Listeners realtime do Firestore (apps + gêneros)
  useEffect(() => {
    const db = getDb();
    const appsQuery = query(collection(db, "apps"), orderBy("createdAt", "desc"));
    const unsubApps = onSnapshot(appsQuery, (snapshot) => {
      const next: GameApp[] = [];
      snapshot.forEach((d) => next.push({ id: d.id, ...(d.data() as object) } as GameApp));
      setApps(next);
      setLoading(false);
    });
    const unsubGenres = onSnapshot(collection(db, "genres"), (snapshot) => {
      const next: Genre[] = [];
      snapshot.forEach((d) => next.push({ id: d.id, ...(d.data() as object) } as Genre));
      next.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      setGenres(next);
    });
    return () => {
      unsubApps();
      unsubGenres();
    };
  }, []);

  // Estado de autenticação do admin
  useEffect(() => {
    return onAuthStateChanged(getFirebaseAuth(), (user) => setIsAdmin(!!user));
  }, []);

  // Deep link #/app/:id (abertura inicial + navegação por hash)
  useEffect(() => {
    const sync = () => {
      const hash = window.location.hash;
      setSelectedAppId(hash.startsWith("#/app/") ? hash.replace("#/app/", "") : null);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const openApp = useCallback((id: string) => {
    window.location.hash = `#/app/${id}`;
    setSelectedAppId(id);
  }, []);

  const closeApp = useCallback(() => {
    setSelectedAppId(null);
    if (window.location.hash.startsWith("#/app/")) {
      history.pushState("", document.title, window.location.pathname + window.location.search);
    }
  }, []);

  const setSection = useCallback((next: SectionId) => setSectionState(next), []);

  const [adminUnlocked, setAdminUnlocked] = useState(false);

  const logout = useCallback(async () => {
    await logoutAdmin();
    setAdminUnlocked(false);
    setSectionState("home");
  }, []);

  // Código secreto na busca abre o painel admin (comportamento original)
  const setSearch = useCallback((value: string) => {
    setSearchState(value);
    const trimmed = value.trim().toLowerCase();
    if (trimmed.length < 6) return;
    void sha256Hex(trimmed).then((hash) => {
      if (hash === ADMIN_SEARCH_CODE_HASH) {
        setAdminUnlocked(true);
        setSectionState("admin");
        setSearchState("");
      }
    });
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      apps,
      genres,
      loading,
      isAdmin,
      adminUnlocked,
      logout,

      section,
      setSection,
      search,
      setSearch,
      activeGenre,
      setActiveGenre,
      favorites,
      isFavorite,
      toggleFavorite,
      selectedAppId,
      openApp,
      closeApp,
      editingApp,
      setEditingApp,
    }),
    [
      apps,
      genres,
      loading,
      isAdmin,
      section,
      setSection,
      search,
      setSearch,
      activeGenre,
      favorites,
      isFavorite,
      toggleFavorite,
      selectedAppId,
      openApp,
      closeApp,
      editingApp,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore precisa estar dentro de <StoreProvider>");
  return ctx;
}
