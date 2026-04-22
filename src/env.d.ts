/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly API_ENDPOINT: string;
  readonly PROJECT_ID: string;
  readonly DATABASE_ID: string;
  readonly FEEDBACK_COLLECTION_ID: string;
  readonly GAME_DATA_COLLECTION_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
