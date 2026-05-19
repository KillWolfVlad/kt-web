import { useState, useEffect, useCallback } from "react";
import type { Movie } from "../types";
import "./SettingsDialog.css";
import "./MovieViewDialog.css";

interface Props {
  movie: Movie;
  webhookUrl: string;
  onClose: () => void;
}

export function MovieViewDialog({ movie, webhookUrl, onClose }: Props) {
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [callingIndex, setCallingIndex] = useState<number | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast({ message: "Magnet-ссылка скопирована", type: "success" });
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setToast({ message: "Magnet-ссылка скопирована", type: "success" });
    }
  }, []);

  const callWebhook = useCallback(async (magnet: string, index: number) => {
    if (!webhookUrl) return;
    setCallingIndex(index);
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "DOWNLOAD_BY_MAGNET_LINK",
          magnetLink: magnet,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setToast({ message: "Запрос отправлен", type: "success" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Неизвестная ошибка";
      setToast({ message: msg, type: "error" });
    } finally {
      setCallingIndex(null);
    }
  }, [webhookUrl]);

  return (
    <>
      <div className="overlay" onClick={onClose}>
        <div className="dialog movie-view-dialog" onClick={(e) => e.stopPropagation()}>
          <h2>{movie.nameRU}</h2>
          <div className="movie-view-content">
            <p className="movie-view-field">
              <a
                href={`https://www.kinopoisk.ru/film/${encodeURIComponent(String(movie.filmID))}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Кинопоиск
              </a>
            </p>
            <p className="movie-view-field"><strong>Страна:</strong> {movie.country}</p>
            <p className="movie-view-field"><strong>Жанр:</strong> {movie.genre}</p>
            {movie.ratingAgeLimits && (
              <p className="movie-view-field"><strong>Возрастной рейтинг:</strong> {movie.ratingAgeLimits}+</p>
            )}
            <p className="movie-view-field"><strong>Длительность:</strong> {movie.filmLength}</p>
            {movie.directors && (
              <p className="movie-view-field"><strong>Режиссеры:</strong> {movie.directors}</p>
            )}
            {movie.actors && (
              <p className="movie-view-field"><strong>Актеры:</strong> {movie.actors}</p>
            )}
            {movie.description && (
              <p className="movie-view-field movie-view-description">
                <strong>Описание:</strong> {movie.description}
              </p>
            )}
            {movie.torrents.length > 0 && (
              <div className="torrents-section">
                <h3>Торренты</h3>
                {movie.torrents.map((t, i) => (
                  <div key={i} className="torrent-row">
                    <span className="torrent-info">
                      {t.type} / {t.date} / {t.audio} / Seeders: {t.seeders} / Leechers: {t.leechers}
                    </span>
                    <div className="torrent-actions">
                      <a
                        href={t.link}
                        className="torrent-btn"
                        title="Скачать торрент"
                        download
                      >
                        💾
                      </a>
                      <button
                        className="torrent-btn"
                        title="Копировать magnet-ссылку"
                        onClick={() => copyToClipboard(t.magnet)}
                      >
                        🔗
                      </button>
                      {webhookUrl && (
                        <button
                          className="torrent-btn"
                          title="Отправить на WebHook"
                          disabled={callingIndex === i}
                          onClick={() => callWebhook(t.magnet, i)}
                        >
                          🏡
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="dialog-actions">
            <button className="save-button" onClick={onClose}>
              Закрыть
            </button>
          </div>
        </div>
      </div>
      {toast && (
        <div className={`toast toast--${toast.type}`} onClick={() => setToast(null)}>
          {toast.message}
        </div>
      )}
    </>
  );
}
