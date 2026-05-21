import { useState, useEffect } from "react";
import type { ContentType, MediaItem } from "../types";
import { adaptMovie } from "../adapters/movieAdapter";
import { adaptSeries } from "../adapters/seriesAdapter";
import type { Movie } from "../types";
import type { Series } from "../types";

export function useContent(
  url: string | null,
  contentType: ContentType,
): {
  items: MediaItem[];
  loading: boolean;
  error: string | null;
} {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (url === null) {
      setItems([]);
      setLoading(false);
      setError(null);
      return;
    }

    const abortController = new AbortController();

    setLoading(true);
    setError(null);

    fetch(url, { signal: abortController.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        return res.json() as Promise<
          { movies: Movie[] } | { series: Series[] }
        >;
      })
      .then((data) => {
        if (contentType === "movies") {
          setItems((data as { movies: Movie[] }).movies.map(adaptMovie));
        } else {
          setItems((data as { series: Series[] }).series.map(adaptSeries));
        }
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Unknown error");
        setLoading(false);
      });

    return () => abortController.abort();
  }, [url, contentType]);

  return { items, loading, error };
}
