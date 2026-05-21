import type { Series, SeriesTorrent, MediaItem, MediaTorrent } from "../types";

export function adaptSeriesTorrent(torrent: SeriesTorrent): MediaTorrent {
  const seasonsPrefix = Object.entries(torrent.seasons)
    .map(([key, count]) =>
      count === 0 ? `[S${key}]` : `[S${key} 1-${count}]`,
    )
    .join(" ");

  return {
    date: torrent.date,
    magnetLink: torrent.magnet,
    seeders: torrent.sid,
    leechers: torrent.pir,
    quality: `${torrent.quality} ${torrent.resolution}`,
    size: torrent.size,
    audio: torrent.voice.join(", "),
    torrentLink: null,
    prefix: seasonsPrefix,
  };
}

export function adaptSeries(series: Series): MediaItem {
  return {
    id: series.filmId,
    title: series.nameRU,
    poster: series.poster,
    countries: series.country.split(", "),
    genres: series.genres,
    directors: null,
    actors: null,
    description: series.desc || null,
    rating: series.ratingKp,
    dateInfo: series.years,
    filmLength: null,
    torrents: series.torrents.map(adaptSeriesTorrent),
    ageRating: null,
    contentType: "series",
  };
}
