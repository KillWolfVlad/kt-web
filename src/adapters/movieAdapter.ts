import type { Movie, Torrent, MediaItem, MediaTorrent } from "../types";

export function adaptMovieTorrent(torrent: Torrent): MediaTorrent {
  const quality = torrent.dv ? `${torrent.type} [DV]` : torrent.type;
  const size =
    torrent.size < 1024 * 1024 * 1024
      ? `${(torrent.size / (1024 * 1024)).toFixed(1)} MB`
      : `${(torrent.size / (1024 * 1024 * 1024)).toFixed(1)} GB`;

  return {
    date: torrent.date,
    magnetLink: torrent.magnet,
    seeders: torrent.seeders,
    leechers: torrent.leechers,
    quality,
    size,
    audio: torrent.audio,
    torrentLink: torrent.link,
    prefix: null,
  };
}

export function adaptMovie(movie: Movie): MediaItem {
  return {
    id: movie.filmID,
    title: movie.nameRU,
    poster: movie.posterURL,
    countries: movie.country.split(", "),
    genres: movie.genre.split(", "),
    directors: movie.directors || null,
    actors: movie.actors || null,
    description: movie.description || null,
    rating: movie.ratingFloat,
    dateInfo: movie.premierDate,
    filmLength: movie.filmLength || null,
    torrents: movie.torrents.map(adaptMovieTorrent),
    ageRating: movie.ratingAgeLimits || null,
    contentType: "movies",
  };
}
