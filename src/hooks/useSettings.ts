import { useState } from "react";
import type { ContentType } from "../types";

const STORAGE_KEY = "kt-settings";
const OLD_STORAGE_KEY = "moviesDataUrl";
const SETTINGS_VERSION = 1;

export interface Settings {
  version: number;
  moviesUrl: string | null;
  seriesUrl: string | null;
  webhookUrl: string | null;
  contentType: ContentType;
}

const defaults: Settings = {
  version: SETTINGS_VERSION,
  moviesUrl: null,
  seriesUrl: null,
  webhookUrl: null,
  contentType: "movies",
};

const migrations: Array<(s: Record<string, unknown>) => void> = [
  (s) => {
    const old = s.dataSourceUrl as string | undefined;
    s.moviesUrl = old && old.trim() ? old : null;
    delete s.dataSourceUrl;
    s.seriesUrl = null;
    s.webhookUrl = s.webhookUrl ?? null;
    s.contentType = "movies";
  },
];

function loadSettings(): Settings {
  const exists = localStorage.getItem(STORAGE_KEY);
  let raw: string | null = exists;

  if (exists === null) {
    const oldRaw = localStorage.getItem(OLD_STORAGE_KEY);
    if (oldRaw !== null) {
      let oldValue: string;
      try {
        oldValue = JSON.parse(oldRaw);
      } catch {
        oldValue = oldRaw;
      }
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ dataSourceUrl: oldValue, webhookUrl: "", version: 0 }),
      );
      localStorage.removeItem(OLD_STORAGE_KEY);
      raw = localStorage.getItem(STORAGE_KEY);
    }
  }

  if (raw === null) {
    return { ...defaults };
  }

  let settings: Record<string, unknown>;
  try {
    settings = JSON.parse(raw);
  } catch {
    return { ...defaults };
  }

  if (typeof settings.version !== "number") {
    settings.version = 0;
  }

  let version = settings.version as number;
  while (version < SETTINGS_VERSION) {
    migrations[version](settings);
    version++;
  }
  settings.version = version;

  if (version !== (JSON.parse(raw).version ?? 0)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }

  return settings as unknown as Settings;
}

export function useSettings(): {
  settings: Settings;
  save: (s: Settings) => void;
  isFirstVisit: boolean;
} {
  const [settings, setSettings] = useState<Settings>(loadSettings);

  const save = (newSettings: Settings) => {
    const toSave = { ...newSettings, version: SETTINGS_VERSION };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    setSettings(toSave);
  };

  const isFirstVisit = settings.moviesUrl === null && settings.seriesUrl === null;

  return { settings, save, isFirstVisit };
}
