export interface Movie {
  filmID: number;
  nameRU: string;
  nameOriginal: string;
  year: string;
  country: string;
  genre: string;
  directors: string;
  actors: string;
  description: string;
  slogan: string;
  rating: string;
  ratingFloat: number;
  ratingKP: string;
  ratingKPCount: number;
  ratingIMDb: string;
  ratingIMDbCount: number;
  ratingMPAA: string;
  ratingAgeLimits: string;
  filmLength: string;
  premierDate: string;
  premierType: string;
  posterURL: string;
  bigPosterURL: string;
  trailerURL: string;
  have4K: boolean;
  new: boolean;
  torrents: Torrent[];
  torrentsDate: string;
}

export interface Torrent {
  audio: string;
  date: string;
  dv?: boolean;
  leechers: number;
  license: boolean;
  link: string;
  magnet: string;
  quality: number;
  seeders: number;
  size: number;
  type: string;
}

export interface Series {
  filmId: number;
  nameRU: string;
  nameOrig: string | null;
  poster: string;
  desc: string;
  torrentDate: string;
  genres: string[];
  country: string;
  ratingKp: number;
  years: string;
  torrents: SeriesTorrent[];
  trailer: string | null;
  backdrop: string | null;
  lastEpisode: number;
}

export interface SeriesTorrent {
  date: string;
  magnet: string;
  resolution: string;
  quality: string;
  hevc: boolean;
  dv: boolean;
  hdr: string;
  size: string;
  sid: number;
  pir: number;
  voice: string[];
  seasons: Record<string, number>;
}

export type ContentType = "movies" | "series";

export interface MediaItem {
  id: number;
  title: string;
  poster: string;
  countries: string[];
  genres: string[];
  directors: string | null;
  actors: string | null;
  description: string | null;
  rating: number;
  dateInfo: string;
  filmLength: string | null;
  torrents: MediaTorrent[];
  ageRating: string | null;
  contentType: ContentType;
}

export interface MediaTorrent {
  date: string;
  magnetLink: string;
  seeders: number;
  leechers: number;
  quality: string;
  size: string;
  audio: string;
  torrentLink: string | null;
  prefix: string | null;
}
