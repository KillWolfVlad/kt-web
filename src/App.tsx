import { useState, useMemo, useEffect } from "react";
import { useSettings } from "./hooks/useSettings";
import { useContent } from "./hooks/useContent";
import { useFilters } from "./hooks/useFilters";
import { Navbar } from "./components/Navbar";
import { SettingsDialog } from "./components/SettingsDialog";
import { FiltersDialog } from "./components/FiltersDialog";
import { MediaCard } from "./components/MediaCard";
import { MediaViewDialog } from "./components/MediaViewDialog";
import type { MediaItem } from "./types";

function App() {
  const { settings, save, isFirstVisit } = useSettings();
  const { moviesUrl, seriesUrl, webhookUrl, contentType } = settings;
  const { filters, setFilters } = useFilters();
  const [showSettings, setShowSettings] = useState(isFirstVisit);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  const currentUrl = useMemo(
    () => (contentType === "movies" ? moviesUrl : seriesUrl),
    [contentType, moviesUrl, seriesUrl],
  );
  const { items, loading, error } = useContent(currentUrl, contentType);

  useEffect(() => {
    if (contentType === "movies" && !moviesUrl && seriesUrl) {
      save({ ...settings, contentType: "series" });
    } else if (contentType === "series" && !seriesUrl && moviesUrl) {
      save({ ...settings, contentType: "movies" });
    }
  }, [moviesUrl, seriesUrl, contentType, save, settings]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (filters.name) {
        const q = filters.name.toLowerCase();
        if (!item.title.toLowerCase().includes(q)) {
          return false;
        }
      }
      if (filters.minRating !== null) {
        if (item.rating < filters.minRating) {
          return false;
        }
      }
      return true;
    });
  }, [items, filters]);

  const handleSave = (newSettings: {
    moviesUrl: string | null;
    seriesUrl: string | null;
    webhookUrl: string | null;
  }) => {
    save({
      ...settings,
      moviesUrl: newSettings.moviesUrl,
      seriesUrl: newSettings.seriesUrl,
      webhookUrl: newSettings.webhookUrl,
    });
    setShowSettings(false);
  };

  const handleApplyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setShowFilters(false);
  };

  const handleToggleContent = () => {
    const newType = contentType === "movies" ? "series" : "movies";
    save({ ...settings, contentType: newType });
    setSelectedItem(null);
  };

  const hasSource = moviesUrl !== null || seriesUrl !== null;
  const hasMultipleSources = moviesUrl !== null && seriesUrl !== null;

  return (
    <>
      <Navbar
        contentType={contentType}
        onToggleContent={handleToggleContent}
        hasMultipleSources={hasMultipleSources}
        onOpenFilters={() => setShowFilters(true)}
        onOpenSettings={() => setShowSettings(true)}
        hasActiveFilters={filters.name !== "" || filters.minRating !== null}
      />
      {hasSource && loading && (
        <div className="spinner">{contentType === "movies" ? "🎬" : "📺"}</div>
      )}
      {hasSource && error && (
        <div className="error-box">{error}</div>
      )}
      {hasSource && !loading && !error && filteredItems.length > 0 && (
        <div className="movies-grid">
          {filteredItems.map((item) => (
            <MediaCard key={item.id} item={item} onClick={setSelectedItem} />
          ))}
        </div>
      )}
      {hasSource && !loading && !error && filteredItems.length === 0 && items.length > 0 && (
        <div className="error-box">Ничего не найдено</div>
      )}
      {showSettings && (
        <SettingsDialog
          moviesUrl={moviesUrl}
          seriesUrl={seriesUrl}
          webhookUrl={webhookUrl}
          onSave={handleSave}
          onClose={() => setShowSettings(false)}
          isRequired={isFirstVisit}
        />
      )}
      {showFilters && (
        <FiltersDialog
          initialFilters={filters}
          onApply={handleApplyFilters}
          onClose={() => setShowFilters(false)}
        />
      )}
      {selectedItem && (
        <MediaViewDialog
          item={selectedItem}
          webhookUrl={webhookUrl}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </>
  );
}

export default App;
