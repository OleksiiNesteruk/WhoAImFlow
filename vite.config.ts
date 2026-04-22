import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: "./",
    plugins: [react()],
    define: {
      // Make all environment variables available to client-side code
      // by individually defining each one
      "import.meta.env.API_ENDPOINT": JSON.stringify(env.API_ENDPOINT),
      "import.meta.env.PROJECT_ID": JSON.stringify(env.PROJECT_ID),
      "import.meta.env.DATABASE_ID": JSON.stringify(env.DATABASE_ID),
      "import.meta.env.FEEDBACK_COLLECTION_ID": JSON.stringify(
        env.FEEDBACK_COLLECTION_ID
      ),
      "import.meta.env.GAME_DATA_COLLECTION_ID": JSON.stringify(
        env.GAME_DATA_COLLECTION_ID
      ),
    },
  };
});
