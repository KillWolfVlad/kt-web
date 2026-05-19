# Схема данных data.json

## Корневые поля

| Поле | Тип | Обязательность | Описание |
|------|-----|----------------|----------|
| `count` | `number` | required | Количество фильмов |
| `updated` | `number` | required | Unix timestamp последнего обновления |
| `movies` | `array<Movie>` | required | Массив фильмов |

## Movie

| Поле | Тип | Обязательность | Описание |
|------|-----|----------------|----------|
| `filmID` | `number` | required | ID фильма |
| `nameRU` | `string` | required | Название на русском |
| `nameOriginal` | `string` | required | Оригинальное название |
| `year` | `string` | required | Год выпуска |
| `country` | `string` | required | Страна производства |
| `genre` | `string` | required | Жанры через запятую |
| `directors` | `string` | required | Режиссёры через запятую |
| `actors` | `string` | optional (может быть пустой) | Актёры через запятую |
| `description` | `string` | optional (может быть пустой) | Описание сюжета |
| `slogan` | `string` | optional (всегда пустая) | Слоган фильма |
| `rating` | `string` | required | Рейтинг (строка) |
| `ratingFloat` | `number` | required | Рейтинг (число) |
| `ratingKP` | `string` | optional (может быть пустой) | Рейтинг Кинопоиска |
| `ratingKPCount` | `number` | required | Количество оценок на Кинопоиске |
| `ratingIMDb` | `string` | optional (может быть пустой) | Рейтинг IMDb |
| `ratingIMDbCount` | `number` | required | Количество оценок на IMDb |
| `ratingMPAA` | `string` | optional (может быть пустой) | Рейтинг MPAA (PG-13, R и т.д.) |
| `ratingAgeLimits` | `string` | optional (может быть пустой) | Возрастные ограничения |
| `filmLength` | `string` | required | Длительность (формат H:MM) |
| `premierDate` | `string` | required | Дата премьеры (YYYY-MM-DD) |
| `premierType` | `string` | required | Тип премьеры (Мир, Россия и т.д.) |
| `posterURL` | `string` | required | URL постера (маленький) |
| `bigPosterURL` | `string` | required | URL постера (большой) |
| `trailerURL` | `string` | optional (всегда пустая) | URL трейлера |
| `have4K` | `boolean` | required | Наличие 4K-версии |
| `new` | `boolean` | required | Признак новинки |
| `torrents` | `array<Torrent>` | required | Массив торрентов |
| `torrentsDate` | `string` | required | Дата обновления торрентов |

## Torrent

| Поле | Тип | Обязательность | Описание |
|------|-----|----------------|----------|
| `audio` | `string` | required | Язык аудиодорожки (D — дубляж, R — русский, L — английский и т.д.) |
| `date` | `string` | required | Дата добавления торрента |
| `dv` | `boolean` | optional | Наличие Dolby Vision |
| `leechers` | `number` | required | Количество личеров |
| `license` | `boolean` | required | Лицензионная раздача |
| `link` | `string` | required | Ссылка на скачивание торрент-файла |
| `magnet` | `string` | required | Magnet-ссылка |
| `quality` | `number` | required | Код качества |
| `seeders` | `number` | required | Количество сидеров |
| `size` | `number` | required | Размер в байтах |
| `type` | `string` | required | Тип/качество (BDRip 1080p, WEB-DLRip и т.д.) |
