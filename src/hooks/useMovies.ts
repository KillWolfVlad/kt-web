import { useState, useEffect } from "react";
import type { Movie } from "../types";

export function useMovies(dataSourceUrl: string) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!dataSourceUrl) {
      setMovies([]);
      setLoading(false);
      setError(null);
      return;
    }

    const abortController = new AbortController();

    setLoading(true);
    setError(null);

    fetch(dataSourceUrl, { signal: abortController.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        return res.json() as Promise<{ movies: Movie[] }>;
      })
      .then((data) => {
        setMovies(data.movies);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Unknown error");
        setLoading(false);
      });

    return () => abortController.abort();
  }, [dataSourceUrl]);

  return { movies, loading, error };
}
