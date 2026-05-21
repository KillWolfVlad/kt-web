import type { MediaItem } from "../types";
import { getCountryFlag } from "../utils/countryFlags";
import "./MediaCard.css";

interface Props {
  item: MediaItem;
  onClick: (item: MediaItem) => void;
}

export function MediaCard({ item, onClick }: Props) {
  const flag = getCountryFlag(item.countries);

  return (
    <div className="media-card" onClick={() => onClick(item)}>
      <img
        className="media-card__poster"
        src={item.poster}
        alt={item.title}
        loading="lazy"
      />
      <div className="media-card__overlay">
        <div className="media-card__title">
          {flag && <span className="media-card__flag">{flag}</span>}
          {item.title}
        </div>
        <div className="media-card__rating">⭐ {item.rating}</div>
      </div>
    </div>
  );
}
