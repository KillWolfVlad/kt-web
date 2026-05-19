import { useState, useMemo } from "react";
import { useSettings, type Settings } from "./hooks/useSettings";
import { useMovies } from "./hooks/useMovies";
import { useFilters } from "./hooks/useFilters";
import { Navbar } from "./components/Navbar";
import { SettingsDialog } from "./components/SettingsDialog";
import { FiltersDialog } from "./components/FiltersDialog";
import { MovieCard } from "./components/MovieCard";
import { MovieViewDialog } from "./components/MovieViewDialog";
import type { Movie } from "./types";

function App() {
  const { settings, save, isFirstVisit } = useSettings();
  const { filters, setFilters } = useFilters();
  const [showSettings, setShowSettings] = useState(isFirstVisit);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const { movies, loading, error } = useMovies(settings.dataSourceUrl);

  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      if (filters.name) {
        const q = filters.name.toLowerCase();
        if (
          !movie.nameRU.toLowerCase().includes(q) &&
          !movie.nameOriginal.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      if (filters.minRating !== null) {
        if (movie.ratingFloat < filters.minRating) {
          return false;
        }
      }
      return true;
    });
  }, [movies, filters]);

  const handleSave = (newSettings: Settings) => {
    save(newSettings);
    setShowSettings(false);
  };

  const handleApplyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setShowFilters(false);
  };

  const hasSource = settings.dataSourceUrl.length > 0;

  return (
    <>
      <Navbar
        onOpenFilters={() => setShowFilters(true)}
        onOpenSettings={() => setShowSettings(true)}
      />
      {hasSource && loading && (
        <div className="spinner">🎬</div>
      )}
      {hasSource && error && (
        <div className="error-box">{error}</div>
      )}
      {hasSource && !loading && !error && filteredMovies.length > 0 && (
        <div className="movies-grid">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.filmID} movie={movie} onClick={setSelectedMovie} />
          ))}
        </div>
      )}
      {hasSource && !loading && !error && filteredMovies.length === 0 && movies.length > 0 && (
        <div className="error-box">Фильмы не найдены</div>
      )}
      {showSettings && (
        <SettingsDialog
          initialSettings={settings}
          onSave={handleSave}
          onClose={() => setShowSettings(false)}
        />
      )}
      {showFilters && (
        <FiltersDialog
          initialFilters={filters}
          onApply={handleApplyFilters}
          onClose={() => setShowFilters(false)}
        />
      )}
      {selectedMovie && (
        <MovieViewDialog
          movie={selectedMovie}
          webhookUrl={settings.webhookUrl}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </>
  );
}

export default App;
