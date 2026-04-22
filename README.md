# FeedbackFlow

React + TypeScript + Vite dashboard for feedback analytics and game statistics.

## Local запуск

1. Створи `.env` у корені проєкту.
2. Додай змінні:

```env
API_ENDPOINT=
PROJECT_ID=
DATABASE_ID=
FEEDBACK_COLLECTION_ID=
GAME_DATA_COLLECTION_ID=
```

3. Запусти:

```bash
npm install
npm run dev
```

## GitHub Pages

У репозиторії вже є workflow для автоматичного деплою на GitHub Pages після пушу в `main`.

Перед першим деплоєм треба додати в GitHub repository variables:

- `API_ENDPOINT`
- `PROJECT_ID`
- `DATABASE_ID`
- `FEEDBACK_COLLECTION_ID`
- `GAME_DATA_COLLECTION_ID`

Після цього:

1. Push у `main`
2. У GitHub відкрий `Settings` -> `Pages`
3. У `Source` вибери `GitHub Actions`

Після успішного workflow сайт буде доступний у GitHub Pages URL цього репозиторію.
