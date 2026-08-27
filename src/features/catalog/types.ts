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
  isFeatured?: boolean;
  createdAt?: FirestoreTimestampLike | null;
}

export type GameAppInput = Omit<GameApp, "id">;

export interface Genre {
  id: string;
  name: string;
}
