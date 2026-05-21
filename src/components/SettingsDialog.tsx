import { useState, useEffect } from "react";
import { useScrollLock } from "../hooks/useScrollLock";
import { useSwipeToClose } from "../hooks/useSwipeToClose";
import "./SettingsDialog.css";

interface Props {
  moviesUrl: string | null;
  seriesUrl: string | null;
  webhookUrl: string | null;
  onSave: (settings: { moviesUrl: string | null; seriesUrl: string | null; webhookUrl: string | null }) => void;
  onClose: () => void;
  isRequired: boolean;
}

export function SettingsDialog({
  moviesUrl,
  seriesUrl,
  webhookUrl,
  onSave,
  onClose,
  isRequired,
}: Props) {
  const [moviesUrlState, setMovieUrlState] = useState(moviesUrl ?? "");
  const [seriesUrlState, setSeriesUrlState] = useState(seriesUrl ?? "");
  const [webhookUrlState, setWebhookUrlState] = useState(webhookUrl ?? "");

  const canSave = moviesUrlState.trim().length > 0 || seriesUrlState.trim().length > 0;
  const canClose = !isRequired;

  useScrollLock(true);

  const { swipeStyle, isSwipingActive, onTouchStart, onTouchMove, onTouchEnd } =
    useSwipeToClose(onClose, canClose);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && canClose) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, canClose]);

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      moviesUrl: moviesUrlState.trim() || null,
      seriesUrl: seriesUrlState.trim() || null,
      webhookUrl: webhookUrlState.trim() || null,
    });
  };

  const handleOverlayClick = () => {
    if (canClose) onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave();
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
        <button
          className="close-button"
          type="button"
          disabled={!canClose}
          onClick={canClose ? onClose : undefined}
        >
          ✕
        </button>
        <h2>Настройки</h2>
        <div className="dialog-scrollable">
          <label>
            URL фильмов
            <input
              type="text"
              value={moviesUrlState}
              onChange={(e) => setMovieUrlState(e.target.value)}
              placeholder="https://example.com/movies.json"
            />
          </label>
          <label>
            URL сериалов
            <input
              type="text"
              value={seriesUrlState}
              onChange={(e) => setSeriesUrlState(e.target.value)}
              placeholder="https://example.com/series.json"
            />
          </label>
          <label>
            Webhook URL (опционально)
            <input
              type="text"
              value={webhookUrlState}
              onChange={(e) => setWebhookUrlState(e.target.value)}
              placeholder="https://example.com/webhook"
            />
          </label>
          <div className="dialog-footer">
            <span>Git Commit: {import.meta.env.VITE_GIT_COMMIT_SHA?.slice(0, 6) || "<dev>"}</span>
            <span>Лицензия: Apache License 2.0</span>
            <span>Исходный код: <a href="https://github.com/KillWolfVlad/kt-web" target="_blank" rel="noopener noreferrer">https://github.com/KillWolfVlad/kt-web</a></span>
          </div>
        </div>
        <button
          className="save-button"
          type="submit"
          disabled={!canSave}
        >
          Сохранить
        </button>
      </form>
    </div>
  );
}
