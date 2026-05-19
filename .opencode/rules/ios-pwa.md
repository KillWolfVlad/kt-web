# iOS PWA

## Зум при вводе текста

На iOS Safari при фокусе на `<input>` / `<textarea>` с `font-size < 16px` происходит автоматический зум страницы, который ломает верстку.

### Решение

1. В `index.html` в meta viewport добавить `maximum-scale=1.0, user-scalable=no`:
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
   ```

2. В `main.css` на `html` добавить `touch-action: manipulation`:
   ```css
   html {
     touch-action: manipulation;
   }
   ```
   Это убирает задержку 300ms на тапах и предотвращает double-tap зум.
