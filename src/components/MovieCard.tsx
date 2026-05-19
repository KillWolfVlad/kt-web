import type { Movie } from "../types";
import { getCountryFlag } from "../utils/countryFlags";
import "./MovieCard.css";

interface Props {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

export function MovieCard({ movie, onClick }: Props) {
  const flag = getCountryFlag(movie.country);

  return (
    <div className="movie-card" onClick={() => onClick(movie)}>
      <img
        className="movie-card__poster"
        src={movie.posterURL}
        alt={movie.nameRU}
        loading="lazy"
      />
      <div className="movie-card__overlay">
        <div className="movie-card__title">
          {flag && <span className="movie-card__flag">{flag}</span>}
          {movie.nameRU}
        </div>
        <div className="movie-card__rating">⭐ {movie.rating}</div>
      </div>
    </div>
  );
}
