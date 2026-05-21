# Схема данных источника по сериалам

## Корневые поля

| Поле | Тип | Обязательность | Описание |
|------|-----|----------------|----------|
| `series` | `array<Series>` | required | Массив сериалов |

## Series

| Поле | Тип | Обязательность | Описание |
|------|-----|----------------|----------|
| `filmId` | `number` | required | ID сериала |
| `nameRU` | `string` | required | Название на русском |
| `nameOrig` | `string` | optional (может быть null) | Оригинальное название |
| `poster` | `string` | required | URL постера |
| `desc` | `string` | required | Описание сюжета |
| `torrentDate` | `string` | required | Дата обновления торрентов (YYYY-MM-DD) |
| `genres` | `array<string>` | required | Массив жанров |
| `country` | `string` | required | Страна производства |
| `ratingKp` | `number` | required | Рейтинг Кинопоиска |
| `years` | `string` | required | Годы выпуска |
| `torrents` | `array<Torrent>` | required | Массив торрентов |
| `trailer` | `string` | optional (может быть null) | URL трейлера |
| `backdrop` | `string` | optional (может быть null) | URL фонового изображения |
| `lastEpisode` | `number` | required | Номер последней вышедшей серии |

## Torrent

| Поле | Тип | Обязательность | Описание |
|------|-----|----------------|----------|
| `date` | `string` | required | Дата добавления торрента (YYYY-MM-DD) |
| `magnet` | `string` | required | Magnet-ссылка |
| `resolution` | `string` | required | Разрешение (1080p, 2160p и т.д.) |
| `quality` | `string` | required | Качество (WEB-DL, WEBRip и т.д.) |
| `hevc` | `boolean` | required | Наличие HEVC-кодека |
| `dv` | `boolean` | required | Наличие Dolby Vision |
| `hdr` | `string` | required | HDR-формат (может быть пустым) |
| `size` | `string` | required | Размер (строка, например "36.20 GB") |
| `sid` | `number` | required | Количество сидов |
| `pir` | `number` | required | Количество пиров |
| `voice` | `array<string>` | required | Языки/типы озвучки |
| `seasons` | `object` | required | Объект сезонов (ключ — номер сезона, значение — количество серий) |
