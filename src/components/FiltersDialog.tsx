import { useState, useEffect } from "react";
import type { Filters } from "../hooks/useFilters";
import { useScrollLock } from "../hooks/useScrollLock";
import { useSwipeToClose } from "../hooks/useSwipeToClose";
import "./SettingsDialog.css";
import "./FiltersDialog.css";

interface Props {
  initialFilters: Filters;
  onApply: (filters: Filters) => void;
  onClose: () => void;
}

export function FiltersDialog({ initialFilters, onApply, onClose }: Props) {
  const [name, setName] = useState(initialFilters.name);
  const [minRating, setMinRating] = useState(
    initialFilters.minRating ?? null,
  );
  const [ratingInput, setRatingInput] = useState(
    initialFilters.minRating?.toString() ?? "",
  );

  useScrollLock(true);

  const { swipeStyle, isSwipingActive, onTouchStart, onTouchMove, onTouchEnd } =
    useSwipeToClose(onClose);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleOverlayClick = () => {
    onClose();
  };

  const handleApply = () => {
    onApply({
      name: name.trim(),
      minRating,
    });
  };

  const handleClear = () => {
    onApply({ name: "", minRating: null });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleApply();
  };

  const handleRatingChange = (value: string) => {
    setRatingInput(value);
    if (value === "") {
      setMinRating(null);
    } else {
      const num = Number(value);
      if (!Number.isNaN(num)) {
        setMinRating(num);
      }
    }
  };

  return (
    <div className="overlay" onClick={handleOverlayClick}>
      <form
        className={`dialog${isSwipingActive ? " swiping" : ""}`}
        style={swipeStyle}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <button className="close-button" type="button" onClick={onClose}>
          ✕
        </button>
        <h2>Фильтры</h2>
        <div className="dialog-scrollable">
          <label>
            Название фильма
            <div className="filter-input-row">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Введите название"
              />
              <button
                className="clear-button"
                type="button"
                onClick={() => setName("")}
                title="Очистить"
              >
                ✕
              </button>
            </div>
          </label>
          <label>
            Рейтинг ({">="})
            <div className="filter-input-row">
              <input
                type="number"
                value={ratingInput}
                onChange={(e) => handleRatingChange(e.target.value)}
                placeholder="0"
                min={0}
                max={10}
                step={0.1}
              />
              <button
                className="clear-button"
                type="button"
                onClick={() => {
                  setRatingInput("");
                  setMinRating(null);
                }}
                title="Очистить"
              >
                ✕
              </button>
            </div>
          </label>
        </div>
        <div className="dialog-actions">
          <button className="clear-all-button" type="button" onClick={handleClear}>
            Очистить
          </button>
          <button className="save-button" type="submit">
            Применить
          </button>
        </div>
      </form>
    </div>
  );
}
