---
status: done
---

# 2026-05-23-1-rating-dual-slider

## Цель

Заменить обычный `<input type="number">` для фильтра по рейтингу на dual-slider (range slider с двумя ползунками) для ввода минимального и максимального значения рейтинга.

## Макет строки фильтра

```
0.0  ●━━━━━━━━━━●  10.0  ⌫
```

- Слева — значение `minRating` (минимум)
- Справа — значение `maxRating` (максимум)
- Между ними — кастомный range с двумя ползунками
- Справа — кнопка очистки ⌫ (всегда видна)

Все элементы на одной строке (flex-контейнер).

## Изменения

### 1. `src/hooks/useFilters.ts`

В `Filters` поле `minRating` заменить на два поля:
- `minRating: number | null`
- `maxRating: number | null`

Дефолтные значения: оба `null`.

### 2. `src/App.tsx`

Обновить фильтрацию: проверять `minRating !== null` (item.rating >= minRating) и `maxRating !== null` (item.rating <= maxRating).

Обновить `hasActiveFilters`: проверять `filters.minRating !== null || filters.maxRating !== null`.

### 3. `src/components/FiltersDialog.tsx`

Заменить инпут рейтинга на кастомный div-based dual-slider через Pointer Events API.

Логика:
- Одно состояние `rating: { min: number; max: number }`, инициализируется из `initialFilters` (если null — дефолт 0/10)
- `onPointerDown` на `.range-track`:
  - Определить ближайший ползунок к точке клика, используя `rating.min/rating.max` из замыкания (а НЕ из функционального обновления `setRating`)
  - Выставить `dragging.current` ДО вызова `setRating`, чтобы document-слушатель `pointermove` гарантированно видел активный ползунок
  - `setRating` с функциональным обновлением для самой смены значения
- `preventDefault()` вызывается только для `pointerType === "mouse"`, чтобы не подавлять pointer события на тач-устройствах
- `pointermove`/`pointerup`/`pointercancel` слушаются на `document` через `useEffect` — без `setPointerCapture`, чтобы избежать потери захвата при React ререндерах
- При нажатии "Применить" — если значение на границе (0/10) передаётся null, иначе число
- При нажатии очистки — сбросить на дефолт (0 и 10)

Визуальные элементы:
- `.range-track-bg` — фоновая линия трека (серый цвет)
- `.range-fill` — заливка между ползунками (акцентный цвет)
- `.range-thumb` — два div с `position: absolute; left: X%`
- `.rating-value` — моноширинный шрифт для отображения значений

### 4. `src/components/FiltersDialog.css`

Добавить стили:
- `.rating-slider-row` — flex-контейнер для всей строки
- `.rating-value` — ширина 3em, моноширинный шрифт
- `.range-wrapper` — flex:1
- `.range-track` — `touch-action: none`, cursor: pointer, height: 36px
- `.range-track-bg`, `.range-fill` — `pointer-events: none`
- `.range-thumb` — 16px круг, `pointer-events: none`
- Все `:hover` эффекты обёрнуты в `@media (hover: hover)` для предотвращения sticky hover на тач-устройствах
- `.range-track:hover .range-thumb` НЕТ — масштабирование thumb только при `.range-thumb:active` (нажатии), чтобы наведение на трек не создавало визуального эффекта на кнопке очистки рядом

### 5. Дизайн-система

Использовать только CSS-переменные из дизайн-системы (см. `rules/design-system.md`).
