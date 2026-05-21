import { useState, useEffect, useCallback } from "react";
import type { MediaItem } from "../types";
import { useScrollLock } from "../hooks/useScrollLock";
import { useSwipeToClose } from "../hooks/useSwipeToClose";
import "./SettingsDialog.css";
import "./MediaViewDialog.css";

interface Props {
  item: MediaItem;
  webhookUrl: string | null;
  onClose: () => void;
}

export function MediaViewDialog({ item, webhookUrl, onClose }: Props) {
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [callingIndex, setCallingIndex] = useState<number | null>(null);

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

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const copyToClipboard = useCallback(async (text: string) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();

    let success = false;
    try {
      success = document.execCommand("copy");
    } catch {
      /* execCommand недоступен */
    } finally {
      document.body.removeChild(textarea);
    }

    if (success) {
      setToast({ message: "Magnet-ссылка скопирована", type: "success" });
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setToast({ message: "Magnet-ссылка скопирована", type: "success" });
    } catch {
      setToast({ message: "Не удалось скопировать ссылку", type: "error" });
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

  const dateLabel = item.contentType === "movies" ? "Премьера" : "Период";

  return (
    <>
      <div className="overlay" onClick={onClose}>
        <div
          className={`dialog media-view-dialog${isSwipingActive ? " swiping" : ""}`}
          style={swipeStyle}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <button className="close-button" type="button" onClick={onClose}>
            ✕
          </button>
          <h2>{item.title}</h2>
          <div className="media-view-content">
            <p className="media-view-field">
              <a
                href={`https://www.kinopoisk.ru/film/${encodeURIComponent(String(item.id))}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Кинопоиск
              </a>
            </p>
            <p className="media-view-field"><strong>Рейтинг:</strong> {item.rating}</p>
            {item.ageRating && (
              <p className="media-view-field"><strong>Возрастной рейтинг:</strong> {item.ageRating}+</p>
            )}
            <p className="media-view-field"><strong>{dateLabel}:</strong> {item.dateInfo}</p>
            {item.filmLength && (
              <p className="media-view-field"><strong>Длительность:</strong> {item.filmLength}</p>
            )}
            {item.genres.length > 0 && (
              <p className="media-view-field"><strong>Жанр:</strong> {item.genres.join(", ")}</p>
            )}
            {item.countries.length > 0 && (
              <p className="media-view-field"><strong>Страна:</strong> {item.countries.join(", ")}</p>
            )}
            {item.directors && (
              <p className="media-view-field"><strong>Режиссеры:</strong> {item.directors}</p>
            )}
            {item.actors && (
              <p className="media-view-field"><strong>Актеры:</strong> {item.actors}</p>
            )}
            {item.description && (
              <p className="media-view-field media-view-description">
                <strong>Описание:</strong> {item.description}
              </p>
            )}
            {item.torrents.length > 0 && (
              <div className="torrents-section">
                <h3>Торренты</h3>
                {item.torrents.map((t, i) => (
                  <div key={i} className="torrent-row">
                    <span className="torrent-info">
                      {t.prefix && <>{t.prefix} </>}
                      {t.quality} / {t.date} / {t.audio} / ↑{t.seeders} ↓{t.leechers} / {t.size}
                    </span>
                    <div className="torrent-actions">
                      {t.torrentLink && (
                        <a
                          href={t.torrentLink}
                          className="torrent-btn"
                          title="Скачать торрент"
                          download
                        >
                          💾
                        </a>
                      )}
                      <button
                        className="torrent-btn"
                        title="Копировать magnet-ссылку"
                        onClick={() => copyToClipboard(t.magnetLink)}
                      >
                        🔗
                      </button>
                      {webhookUrl && (
                        <button
                          className="torrent-btn"
                          title="Отправить на WebHook"
                          disabled={callingIndex === i}
                          onClick={() => callWebhook(t.magnetLink, i)}
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
