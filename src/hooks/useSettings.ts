import { useState } from "react";

const STORAGE_KEY = "kt-settings";
const OLD_STORAGE_KEY = "moviesDataUrl";

function migrateFromOldStorage() {
  const oldRaw = localStorage.getItem(OLD_STORAGE_KEY);
  if (oldRaw === null) return;

  let oldValue: string;
  try {
    oldValue = JSON.parse(oldRaw);
  } catch {
    oldValue = oldRaw;
  }

  const current = localStorage.getItem(STORAGE_KEY);
  if (current) {
    try {
      const parsed = JSON.parse(current);
      if (parsed.dataSourceUrl) return;
    } catch {
      /* ignore */
    }
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ dataSourceUrl: oldValue, webhookUrl: "" }),
  );
  localStorage.removeItem(OLD_STORAGE_KEY);
}

export interface Settings {
  dataSourceUrl: string;
  webhookUrl: string;
}

export function useSettings() {
  migrateFromOldStorage();

  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as Settings;
      }
    } catch {
      /* ignore */
    }
    return { dataSourceUrl: "", webhookUrl: "" };
  });

  const save = (newSettings: Settings) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
    setSettings(newSettings);
  };

  const isFirstVisit = localStorage.getItem(STORAGE_KEY) === null;

  return { settings, save, isFirstVisit };
}
