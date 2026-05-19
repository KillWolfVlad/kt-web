import { useState, useEffect } from "react";
import type { Settings } from "../hooks/useSettings";
import "./SettingsDialog.css";

interface Props {
  initialSettings: Settings;
  onSave: (settings: Settings) => void;
  onClose: () => void;
}

export function SettingsDialog({ initialSettings, onSave, onClose }: Props) {
  const [dataSourceUrl, setDataSourceUrl] = useState(
    initialSettings.dataSourceUrl,
  );
  const [webhookUrl, setWebhookUrl] = useState(initialSettings.webhookUrl);

  const canSave = dataSourceUrl.trim().length > 0;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleOverlayClick = () => {
    if (canSave) {
      onClose();
    }
  };

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      dataSourceUrl: dataSourceUrl.trim(),
      webhookUrl: webhookUrl.trim(),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave();
  };

  return (
    <div className="overlay" onClick={handleOverlayClick}>
      <form className="dialog" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <button
          className="close-button"
          type="button"
          disabled={!canSave}
          onClick={canSave ? onClose : undefined}
        >
          ✕
        </button>
        <h2>Настройки</h2>
        <label>
          Источник данных (data.json)
          <input
            type="text"
            value={dataSourceUrl}
            onChange={(e) => setDataSourceUrl(e.target.value)}
            placeholder="https://example.com/data.json"
          />
        </label>
        <label>
          WebHook (опционально)
          <input
            type="text"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="https://example.com/webhook"
          />
        </label>
        <button
          className="save-button"
          type="submit"
          disabled={!canSave}
        >
          Сохранить
        </button>
        <div className="dialog-footer">
          <span>Git Commit: {import.meta.env.VITE_GIT_COMMIT_SHA?.slice(0, 6) || "<dev>"}</span>
          <span>Лицензия: Apache License 2.0</span>
          <span>Исходный код: <a href="https://github.com/KillWolfVlad/kt-web" target="_blank" rel="noopener noreferrer">https://github.com/KillWolfVlad/kt-web</a></span>
        </div>
      </form>
    </div>
  );
}
