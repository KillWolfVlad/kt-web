import { useState, useEffect, useCallback, useRef } from "react";
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

const RATING_MIN = 0;
const RATING_MAX = 10;

function formatRating(value: number): string {
  return value.toFixed(1);
}

function roundStep(value: number): number {
  return Math.round(value * 10) / 10;
}

export function FiltersDialog({ initialFilters, onApply, onClose }: Props) {
  const [name, setName] = useState(initialFilters.name);
  const [rating, setRating] = useState<{ min: number; max: number }>({
    min: initialFilters.minRating ?? RATING_MIN,
    max: initialFilters.maxRating ?? RATING_MAX,
  });

  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<"min" | "max" | null>(null);

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

  const getValueFromPosition = useCallback((clientX: number): number => {
    const track = trackRef.current;
    if (!track) return RATING_MIN;
    const rect = track.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return roundStep(RATING_MIN + ratio * (RATING_MAX - RATING_MIN));
  }, []);

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      const value = getValueFromPosition(e.clientX);
      setRating((prev) => {
        if (dragging.current === "min") {
          return { ...prev, min: Math.min(value, prev.max) };
        }
        return { ...prev, max: Math.max(value, prev.min) };
      });
    };

    const handleUp = () => {
      dragging.current = null;
    };

    document.addEventListener("pointermove", handleMove);
    document.addEventListener("pointerup", handleUp);
    document.addEventListener("pointercancel", handleUp);

    return () => {
      document.removeEventListener("pointermove", handleMove);
      document.removeEventListener("pointerup", handleUp);
      document.removeEventListener("pointercancel", handleUp);
    };
  }, [getValueFromPosition]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType === "mouse") {
        e.preventDefault();
      }
      const value = getValueFromPosition(e.clientX);

      const distToMin = Math.abs(value - rating.min);
      const distToMax = Math.abs(value - rating.max);

      if (distToMin < distToMax) {
        dragging.current = "min";
      } else {
        dragging.current = "max";
      }

      setRating((prev) => {
        if (dragging.current === "min") {
          return { ...prev, min: Math.min(value, prev.max) };
        }
        return { ...prev, max: Math.max(value, prev.min) };
      });
    },
    [getValueFromPosition, rating],
  );

  const handleOverlayClick = () => {
    onClose();
  };

  const handleApply = () => {
    onApply({
      name: name.trim(),
      minRating: rating.min === RATING_MIN ? null : rating.min,
      maxRating: rating.max === RATING_MAX ? null : rating.max,
    });
  };

  const handleClear = () => {
    onApply({ name: "", minRating: null, maxRating: null });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleApply();
  };

  const handleClearRating = useCallback(() => {
    setRating({ min: RATING_MIN, max: RATING_MAX });
  }, []);

  const percentMin =
    ((rating.min - RATING_MIN) / (RATING_MAX - RATING_MIN)) * 100;
  const percentMax =
    ((rating.max - RATING_MIN) / (RATING_MAX - RATING_MIN)) * 100;

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
                ⌫
              </button>
            </div>
          </label>
          <label>
            Рейтинг
            <div className="rating-slider-row">
              <span className="rating-value">{formatRating(rating.min)}</span>
              <div className="range-wrapper">
                <div
                  className="range-track"
                  ref={trackRef}
                  onPointerDown={handlePointerDown}
                >
                  <div className="range-track-bg" />
                  <div
                    className="range-fill"
                    style={{
                      left: `${percentMin}%`,
                      width: `${percentMax - percentMin}%`,
                    }}
                  />
                  <div
                    className="range-thumb"
                    style={{ left: `${percentMin}%` }}
                  />
                  <div
                    className="range-thumb"
                    style={{ left: `${percentMax}%` }}
                  />
                </div>
              </div>
              <span className="rating-value">{formatRating(rating.max)}</span>
              <button
                className="clear-button"
                type="button"
                onClick={handleClearRating}
                title="Очистить"
              >
                ⌫
              </button>
            </div>
          </label>
        </div>
        <div className="dialog-actions">
          <button
            className="clear-all-button"
            type="button"
            onClick={handleClear}
          >
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
