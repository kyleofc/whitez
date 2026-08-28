export interface DownloadLink {
  name: string;
  url: string;
}

export interface FirestoreTimestampLike {
  seconds?: number;
  toDate?: () => Date;
}

export interface GameApp {
  id: string;
  title: string;
  icon?: string;
  banner?: string;
  category?: string;
  version?: string;
  size?: string;
  architecture?: string[];
  description?: string;
  links?: DownloadLink[];
  /** Links diretos — nunca exibidos no site, só usados pelo webhook privado do Discord. */
  directLinks?: DownloadLink[];
  downloads?: number;
  isFeatured?: boolean;
  createdAt?: FirestoreTimestampLike | null;
}

export type GameAppInput = Omit<GameApp, "id">;

export interface Genre {
  id: string;
  name: string;
}

export interface Suggestion {
  id: string;
  appName: string;
  details?: string;
  timestamp?: FirestoreTimestampLike | null;
}
