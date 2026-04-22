# WhoAImFlow

WhoAImFlow is a web dashboard for tracking player feedback and in-game performance data in one place. It helps teams turn raw feedback entries and gameplay records into clear, actionable insights.

## Who It's For

This product is built for game teams, product owners, analysts, and admins who need a simple internal dashboard to monitor player sentiment and review gameplay statistics without digging through raw database records.

## Core Features

- Feedback summary with average rating, total submissions, and rating distribution
- Searchable feedback table with sorting and rating filters
- Game statistics overview with player activity and answer-performance metrics
- Admin-only sections for protected data views
- Appwrite-backed data loading for feedback and game records
- GitHub Pages deployment via GitHub Actions

## Tech Stack

- React 19
- TypeScript
- Vite
- Material UI
- Appwrite

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/OleksiiNesteruk/WhoAImFlow.git
cd WhoAImFlow
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root and add:

```env
API_ENDPOINT=
PROJECT_ID=
DATABASE_ID=
FEEDBACK_COLLECTION_ID=
GAME_DATA_COLLECTION_ID=
```

4. Start the development server:

```bash
npm run dev
```

5. Build for production:

```bash
npm run build
```

## Deployment

This repository includes a GitHub Actions workflow for GitHub Pages deployment.

Before the first deployment, add these repository variables in GitHub:

- `API_ENDPOINT`
- `PROJECT_ID`
- `DATABASE_ID`
- `FEEDBACK_COLLECTION_ID`
- `GAME_DATA_COLLECTION_ID`

Then open `Settings -> Pages` and set the source to `GitHub Actions`.
