---
status: done
---

# 2026-05-18-10-deploy

- Реализуй GitHub Actions для деплоя приложения в GitHub Pages
  - Используй один job в workflow
  - Сборка приложения должна происходить с переменной окружения `VITE_GIT_COMMIT_SHA`, равной `${{ github.sha }}`
  - **ВАЖНО**: У GitHub Pages настроен кастомный домен, поэтому смена базы не нужна
  - GitHub Actions должен вызываться по требования и при пуше в `master`
  - Используй Node.js Current LTS для сборки приложения
  - Используй последние версии GitHub Actions:
    - `actions/checkout@v6`
    - `actions/setup-node@v6`
    - `actions/upload-pages-artifact@v5`
    - `actions/deploy-pages@v5`
