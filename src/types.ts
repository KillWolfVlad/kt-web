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
