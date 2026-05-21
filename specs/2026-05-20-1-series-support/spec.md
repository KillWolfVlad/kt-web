---
status: done
---

# 2026-05-20-1-series-support

## Цель

Добавить поддержку сериалов как второго источника данных. Реализовать переключение между фильмами и сериалами по клику на бренд в Navbar. Спроектировать общий интерфейс `MediaItem`, в который мапятся оба источника, чтобы в будущем можно было добавлять новые типы контента.

## Архитектурное решение

Создать универсальный слой (`MediaItem`/`MediaTorrent`) поверх схематичных форматов `Movie` и `Series`. Каждый источник маппится через адаптер в общий интерфейс. Все UI-компоненты работают только с `MediaItem`.

## Изменения

### 1. `src/types.ts` — общие интерфейсы

Добавить:

```typescript
export type ContentType = 'movies' | 'series';

export interface MediaItem {
  id: number;
  title: string;
  poster: string;
  countries: string[];
  genres: string[];
  directors: string | null;
  actors: string | null;
  description: string | null;
  rating: number;
  dateInfo: string;
  filmLength: string | null;
  torrents: MediaTorrent[];
  ageRating: string | null;
  contentType: ContentType;
}

export interface MediaTorrent {
  date: string;
  magnetLink: string;
  seeders: number;
  leechers: number;
  quality: string;
  size: string;
  audio: string;
  torrentLink: string | null;
  prefix: string | null;
}
```

Старые `Movie` и `Torrent` остаются в `types.ts` для использования адаптерами.

### 2. `src/adapters/movieAdapter.ts` — новый файл

Две функции-адаптера:

- `adaptMovie(movie: Movie): MediaItem`
- `adaptMovieTorrent(torrent: Torrent): MediaTorrent`

Маппинг полей:

| Movie | MediaItem |
|-------|-----------|
| `filmID` | `id` |
| `nameRU` | `title` |
| `posterURL` | `poster` |
| `country` | `countries` (split по `, `) |
| `genre` (строка) | `genres` (split по `, `) |
| `directors` | `directors` |
| `actors` | `actors` (если пустая строка → null) |
| `description` | `description` (если пустая строка → null) |
| `ratingFloat` | `rating` |
| `premierDate` | `dateInfo` |
| `filmLength` | `filmLength` (если пустая строка → null) |
| `torrents` | `torrents` (map adaptMovieTorrent) |
| `ratingAgeLimits` | `ageRating` (если пустая строка → null) |
| — | `contentType` ('movies') |

| Torrent | MediaTorrent |
|---------|--------------|
| `date` | `date` |
| `magnet` | `magnetLink` |
| `seeders` | `seeders` |
| `leechers` | `leechers` |
| `type` | `quality` (если `dv` true: `{type} [DV]`, иначе `{type}`) |
| `size` (number, bytes) | `size` (formatted: перевести в GB (1024-based) с округлением до 1 знака, если < 1 GB — в MB (1024-based)) |
| `audio` | `audio` |
| `link` | `torrentLink` |
| — | `prefix` (null) |

### 3. `src/adapters/seriesAdapter.ts` — новый файл

Две функции-адаптера:

- `adaptSeries(series: Series): MediaItem`
- `adaptSeriesTorrent(torrent: SeriesTorrent): MediaTorrent`

Маппинг полей:

| Series | MediaItem |
|--------|-----------|
| `filmId` | `id` |
| `nameRU` | `title` |
| `poster` | `poster` |
| `country` | `countries` (split по `, `) |
| `genres` (array) | `genres` |
| — | `directors` (null) |
| — | `actors` (null) |
| `desc` | `description` |
| `ratingKp` | `rating` |
| `years` | `dateInfo` |
| — | `filmLength` (null) |
| `torrents` | `torrents` (map adaptSeriesTorrent) |
| — | `ageRating` (null) |
| — | `contentType` ('series') |

| Series Torrent | MediaTorrent |
|----------------|--------------|
| `date` | `date` |
| `magnet` | `magnetLink` |
| `sid` | `seeders` |
| `pir` | `leechers` |
| `quality + ' ' + resolution` | `quality` |
| `size` (string) | `size` |
| `voice` (array) | `audio` (join ', ') |
| — | `torrentLink` (null) |
| `seasons` | `prefix` (forEach key: если count === 0 → `[S{key}]`, иначе → `[S{key} 1-{count}]`, склеить через пробел) |

### 4. `src/hooks/useMovies.ts` → `src/hooks/useContent.ts`

Переименовать и расширить:

```typescript
function useContent(
  url: string | null,
  contentType: ContentType
): {
  items: MediaItem[];
  loading: boolean;
  error: string | null;
}
```

Логика:
- Если `url === null` → `{ items: [], loading: false, error: null }`
- `fetch(url)`, AbortController при смене url
- Если `contentType === 'movies'`: `res.json() as Promise<{ movies: Movie[] }>`, затем `.movies.map(adaptMovie)`
- Если `contentType === 'series'`: `res.json() as Promise<{ series: Series[] }>`, затем `.series.map(adaptSeries)`
- Возвращает `{ items, loading, error }`

Старый `useMovies.ts` удалить.

### 5. `src/hooks/useSettings.ts` — система миграции

Настройки хранятся в `localStorage` под ключом `kt-settings` в виде JSON объекта. Для совместимости нужна последовательная система миграции.

#### Текущее состояние (до изменений)

В `localStorage`:
- Ключ `moviesDataUrl` (старый, может отсутствовать) — строка с URL
- Ключ `kt-settings` — JSON: `{ dataSourceUrl: string, webhookUrl: string }`

#### Реализация миграций

```typescript
const STORAGE_KEY = "kt-settings";
const OLD_STORAGE_KEY = "moviesDataUrl";

const SETTINGS_VERSION = 1;

interface Settings {
  version: number;
  moviesUrl: string | null;
  seriesUrl: string | null;
  webhookUrl: string | null;
  contentType: ContentType;
}

const migrations: Array<(s: Record<string, unknown>) => void> = [
  // 0 → 1: kt-settings без version → moviesUrl + seriesUrl + contentType
  // (старый migrateFromOldStorage создаёт объект без version,
  //  он остаётся как pre-migration шаг — читает moviesDataUrl и пишет dataSourceUrl в kt-settings)
  (s) => {
    const old = s.dataSourceUrl as string | undefined;
    s.moviesUrl = old && old.trim() ? old : null;
    delete s.dataSourceUrl;
    s.seriesUrl = null;
    s.webhookUrl = s.webhookUrl ?? null;
    s.contentType = "movies";
  },
];
```

Логика загрузки:

1. Если `kt-settings` уже существует:
   - Пропустить pre-migration из `OLD_STORAGE_KEY` полностью
   - Перейти к шагу 3

2. Если `kt-settings` не существует, проверить `OLD_STORAGE_KEY` (`moviesDataUrl`):
   - Если есть — прочитать значение, записать как `dataSourceUrl` в новый `kt-settings`, установить `version: 0`
   - Удалить `OLD_STORAGE_KEY`
   - Если нет — перейти к дефолтному значению

3. Прочитать `kt-settings`, распарсить JSON. Если поле `version` отсутствует — установить `version: 0`.

4. Пока `settings.version < SETTINGS_VERSION`:
   - Применить `migrations[settings.version]`
   - `settings.version++`

5. Если после миграций версия изменилась — сохранить обновлённые настройки

6. Вернуть актуальные `Settings`

Значение по умолчанию (если `kt-settings` отсутствует):
```typescript
const defaults: Settings = {
  version: SETTINGS_VERSION,
  moviesUrl: null,
  seriesUrl: null,
  webhookUrl: null,
  contentType: "movies",
};
```

Сигнатура хука:
```typescript
export function useSettings(): {
  settings: Settings;
  save: (s: Settings) => void;
  isFirstVisit: boolean;
}
```

- `save()` — записывает `{ ...s, version: SETTINGS_VERSION }` в `localStorage`
- `isFirstVisit` — `true` если оба `moviesUrl` и `seriesUrl` равны null

### 6. `src/components/Navbar.tsx` — переключение источника

Пропсы:

```typescript
interface NavbarProps {
  contentType: ContentType;
  onToggleContent: () => void;
  hasActiveFilters: boolean;
  onOpenFilters: () => void;
  onOpenSettings: () => void;
}
```

Логика:
- Если `contentType === 'movies'` → `<span className="navbar-brand">KT Web</span>`
- Если `contentType === 'series'` → `<span className="navbar-brand">ST Web</span>`
- `onClick` на `.navbar-brand` → `onToggleContent()`
- `.navbar-brand` имеет `cursor: pointer`

### 7. `src/components/MovieCard.tsx` → `src/components/MediaCard.tsx`

Переименовать файл и компонент. Пропсы:

```typescript
interface MediaCardProps {
  item: MediaItem;
  onClick: (item: MediaItem) => void;
}
```

- Использует `item.poster` (вместо `movie.posterURL`)
- `getCountryFlag(item.countries)` — функция меняет сигнатуру с `country: string` на `countries: string[]`, удаляя внутренний split
- `item.title` (вместо `movie.nameRU`)
- `item.rating` (вместо `movie.rating`)

Файл `MovieCard.css` переименовать в `MediaCard.css`.

### 8. `src/components/MovieViewDialog.tsx` → `src/components/MediaViewDialog.tsx`

Переименовать файл и компонент. Пропсы:

```typescript
interface MediaViewDialogProps {
  item: MediaItem;
  webhookUrl: string | null;
  onClose: () => void;
}
```

Рендер:

- **Заголовок**: `item.title`
- **Кинопоиск**: ссылка на `https://www.kinopoisk.ru/film/{item.id}`
- **Рейтинг**: `item.rating`
- **Возрастной рейтинг**: `item.ageRating` (если не null)
- **Дата/период**: `item.dateInfo` с подписью:
  - Для `movies`: "Премьера: {dateInfo}"
  - Для `series`: "Период: {dateInfo}"
- **Длительность**: `item.filmLength` (если не null)
- **Жанры**: `item.genres.join(', ')` (скрыть строку, если массив пустой)
- **Страна**: `item.countries.join(', ')`
- **Режиссёры**: `item.directors` (если не null)
- **Актёры**: `item.actors` (если не null)
- **Описание**: `item.description` (если не null)

**Торренты:**

Строка торрента состоит из двух частей на одной строке:

**Левая часть** — текст через слеш:
`{prefix} {quality} / {date} / {audio} / ↑{seeders} ↓{leechers} / {size}`

- Если `torrent.prefix` не null — выводится перед quality через пробел (без слеша)
- Пример (сериал): `[S1] WEB-DL 1080p / 2025-03-15 / Русский, Английский / ↑45 ↓12 / 4.20 GB`
- Пример (фильм): `BDRip 1080p [DV] / 2025-03-15 / D / ↑100 ↓5 / 8.50 GB`

**Правая часть** — кнопки:
- 💾 — скачать .torrent (только если `torrent.torrentLink` не null)
- 🔗 — копировать `torrent.magnetLink`
- 🏡 — отправить webhook (только если `webhookUrl` не null)

Файл `MovieViewDialog.css` переименовать в `MediaViewDialog.css`.

### 9. `src/components/SettingsDialog.tsx` — два URL

- Поле "Movie data URL" → переименовать в "URL фильмов", связать с `moviesUrl`
- Новое поле "URL сериалов", связать с `seriesUrl`
- Поле "Webhook URL" — оставить как есть
- Для работы приложения достаточно хотя бы одного URL (фильмы или сериалы)

Пропсы:

```typescript
interface SettingsDialogProps {
  moviesUrl: string | null;
  seriesUrl: string | null;
  webhookUrl: string | null;
  onSave: (settings: { moviesUrl: string | null; seriesUrl: string | null; webhookUrl: string | null }) => void;
  onClose: () => void;
  isRequired: boolean;
}
```

Логика:
- Поля URL фильмов и URL сериалов — обычные текстовые инпуты
- Если поле пустое → при сохранении передаётся `null`
- Кнопка "Сохранить" активна если хотя бы одно из полей (фильмы или сериалы) не пустое
- `isRequired` — если `true`, диалог нельзя закрыть (крестик, Escape, оверлей заблокированы), можно только сохранить

### 10. `src/App.tsx` — управление состоянием

```typescript
const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
const { settings, save, isFirstVisit } = useSettings();
const { moviesUrl, seriesUrl, webhookUrl, contentType } = settings;
const currentUrl = useMemo(
  () => (contentType === "movies" ? moviesUrl : seriesUrl),
  [contentType, moviesUrl, seriesUrl],
);
const { items, loading, error } = useContent(currentUrl, contentType);
```

### 11. `vite.config.ts` — тестовые эндпоинты

- Переименовать `/test/data.json` → `/test/movies.json`, переменная `KT_DATA_URL` → `KT_MOVIES_URL`
- Добавить `/test/series.json` с переменной `KT_SERIES_URL`
- Обновить `.env.example`

```env
KT_MOVIES_URL=http://localhost:3000/movies.json
KT_SERIES_URL=http://localhost:3000/series.json
```

При переключении `contentType`:
- Обновляется `settings.contentType` через `save({ ...settings, contentType: newType })`
- Сброс `selectedItem` в null
- Текущий URL пересчитывается, `useContent` загружает данные из нового источника

`isFirstVisit` — `true` если оба URL равны null → показать `SettingsDialog` с `isRequired={true}`.

Если для текущего `contentType` URL равен null, а для другого задан — при клике на бренд переключение работает в обычном режиме (`useContent(null, contentType)` вернёт пустой список).

Если текущий `contentType === 'movies'`, но `moviesUrl` стал null, а `seriesUrl` не null — автоматически переключиться на `'series'` (и наоборот). Логика выполняется при загрузке и при изменении URL в настройках.

**Импорт компонентов:**
- `MediaCard` вместо `MovieCard`
- `MediaViewDialog` вместо `MovieViewDialog`

**Рендер:**
- `<Navbar contentType={contentType} onToggleContent={() => save({ ...settings, contentType: contentType === 'movies' ? 'series' : 'movies' })} />`
- По `loading` — спиннер (без изменений)
- По `error` — ошибка (без изменений)
- `items.length === 0 && !loading && !error` — "Ничего не найдено" (без изменений)
- `items.map(item => <MediaCard ... />)` — сетка
- `<SettingsDialog moviesUrl={moviesUrl} seriesUrl={seriesUrl} webhookUrl={webhookUrl} isRequired={isFirstVisit} />`
- `<MediaViewDialog item={selectedItem!} />`

## Поведение переключения

1. Пользователь нажимает на "KT Web" в Navbar
2. `contentType` меняется на `'series'`
3. Текст бренда → "ST Web"
4. `currentUrl` → `seriesUrl`
5. `useContent` сбрасывает предыдущие данные, загружает новые
6. Все UI-компоненты переиспользуются, т.к. работают с `MediaItem`
7. При обратном клике — всё симметрично

## Список файлов

### Новые
- `src/adapters/movieAdapter.ts`
- `src/adapters/seriesAdapter.ts`

### Переименованные
- `src/hooks/useMovies.ts` → `src/hooks/useContent.ts`
- `src/components/MovieCard.tsx` → `src/components/MediaCard.tsx`
- `src/components/MovieCard.css` → `src/components/MediaCard.css`
- `src/components/MovieViewDialog.tsx` → `src/components/MediaViewDialog.tsx`
- `src/components/MovieViewDialog.css` → `src/components/MediaViewDialog.css`

### Изменяемые
- `src/types.ts`
- `src/utils/countryFlags.ts` — сигнатура `getCountryFlag` с `country: string` на `countries: string[]`
- `src/hooks/useSettings.ts`
- `src/components/Navbar.tsx`
- `src/components/SettingsDialog.tsx`
- `src/App.tsx`
- `vite.config.ts`
- `.env.example`
