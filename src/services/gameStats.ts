import { Client, Databases, Query, Models } from "appwrite";
import sampleData from "../data/sampleGameData.json"; // Adjust the import path as necessary

// Flag to use sample data (for demonstration)
const USE_SAMPLE_DATA = false;
const QUERY_LIMIT = 100000;

// Only initialize Appwrite client if not using sample data
let client: Client;
let databases: Databases;

if (!USE_SAMPLE_DATA) {
  // Check if environment variables are defined
  const apiEndpoint = import.meta.env.API_ENDPOINT;
  const projectId = import.meta.env.PROJECT_ID;

  if (!apiEndpoint || !projectId) {
    console.warn("Appwrite credentials not found in environment variables.");
  } else {
    client = new Client();
    client.setEndpoint(apiEndpoint).setProject(projectId);
    databases = new Databases(client);
  }
}

// Database ID from environment variables
const DATABASE_ID = import.meta.env.DATABASE_ID;
// Game data collection ID - you'll need to add this to your environment variables
const GAME_DATA_COLLECTION_ID = import.meta.env.GAME_DATA_COLLECTION_ID;
console.log("Game Data Collection ID:", GAME_DATA_COLLECTION_ID);

export interface GameData {
  $id: string;
  user_id: string;
  world: string;
  neurons: number;
  timestamp: string;
  stars: number;
  correct: number;
  incorrect: number;
  skipped: number;
  missed: number;
}

function isGameData(doc: Models.Document): doc is Models.Document & GameData {
  return (
    typeof doc.user_id === "string" &&
    typeof doc.world === "string" &&
    typeof doc.neurons === "number" &&
    typeof doc.timestamp === "string" &&
    typeof doc.stars === "number" &&
    typeof doc.correct === "number" &&
    typeof doc.incorrect === "number" &&
    typeof doc.skipped === "number" &&
    typeof doc.missed === "number"
  );
}

// Convert document to GameData
function documentToGameData(doc: Models.Document): GameData {
  if (!isGameData(doc)) {
    throw new Error("Document is missing required GameData properties");
  }
  return {
    $id: doc.$id,
    user_id: doc.user_id,
    world: doc.world,
    neurons: doc.neurons,
    timestamp: doc.timestamp,
    stars: doc.stars,
    correct: doc.correct,
    incorrect: doc.incorrect,
    skipped: doc.skipped,
    missed: doc.missed,
  };
}

// Get all game data - use with caution as it could be a large dataset
export const getAllGameData = async () => {
  if (USE_SAMPLE_DATA) {
    return sampleData.gameData as GameData[];
  }

  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      GAME_DATA_COLLECTION_ID,
      [Query.limit(QUERY_LIMIT)]
    );

    return response.documents.map(documentToGameData);
  } catch (error) {
    console.error("Error fetching game data:", error);
    return [];
  }
};

// Get game data for a specific user
export const getUserGameData = async (userId: string) => {
  if (USE_SAMPLE_DATA) {
    return (sampleData.gameData as GameData[]).filter(
      (data) => data.user_id === userId
    );
  }

  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      GAME_DATA_COLLECTION_ID,
      [Query.equal("user_id", userId), Query.limit(QUERY_LIMIT)]
    );

    return response.documents.map(documentToGameData);
  } catch (error) {
    console.error(`Error fetching game data for user ${userId}:`, error);
    return [];
  }
};

// Get game data for a specific world
export const getWorldData = async (worldName: string) => {
  if (USE_SAMPLE_DATA) {
    return (sampleData.gameData as GameData[]).filter(
      (data) => data.world === worldName
    );
  }

  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      GAME_DATA_COLLECTION_ID,
      [Query.equal("world", worldName), Query.limit(QUERY_LIMIT)]
    );

    return response.documents.map(documentToGameData);
  } catch (error) {
    console.error(`Error fetching data for world ${worldName}:`, error);
    return [];
  }
};

// Get leaderboard based on stars
export const getLeaderboard = async (limit: number = 10) => {
  if (USE_SAMPLE_DATA) {
    return [...(sampleData.gameData as GameData[])]
      .sort((a, b) => b.stars - a.stars)
      .slice(0, limit);
  }

  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      GAME_DATA_COLLECTION_ID,
      [Query.orderDesc("stars"), Query.limit(limit)]
    );

    return response.documents.map(documentToGameData);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }
};

// Statistical analysis functions
export const getWorldStatistics = async (worldName: string) => {
  try {
    const worldData = await getWorldData(worldName);

    if (worldData.length === 0) {
      return null;
    }

    // Calculate statistics
    const stars = worldData.map((data) => data.stars);
    const neurons = worldData.map((data) => data.neurons);
    const correctAnswers = worldData.map((data) => data.correct);
    const incorrectAnswers = worldData.map((data) => data.incorrect);
    const skippedAnswers = worldData.map((data) => data.skipped);
    const missedAnswers = worldData.map((data) => data.missed);

    const totalPlayers = new Set(worldData.map((data) => data.user_id)).size;

    const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
    const avg = (arr: number[]) => sum(arr) / arr.length;

    return {
      worldName,
      totalEntries: worldData.length,
      uniquePlayers: totalPlayers,
      stars: {
        total: sum(stars),
        average: avg(stars),
        highest: Math.max(...stars),
      },
      neurons: {
        total: sum(neurons),
        average: avg(neurons),
        highest: Math.max(...neurons),
      },
      answers: {
        correct: {
          total: sum(correctAnswers),
          average: avg(correctAnswers),
        },
        incorrect: {
          total: sum(incorrectAnswers),
          average: avg(incorrectAnswers),
        },
        skipped: {
          total: sum(skippedAnswers),
          average: avg(skippedAnswers),
        },
        missed: {
          total: sum(missedAnswers),
          average: avg(missedAnswers),
        },
        accuracy:
          (sum(correctAnswers) /
            (sum(correctAnswers) +
              sum(incorrectAnswers) +
              sum(missedAnswers))) *
          100,
      },
    };
  } catch (error) {
    console.error(
      `Error calculating statistics for world ${worldName}:`,
      error
    );
    return null;
  }
};

// Get user progression metrics
export const getUserProgressionMetrics = async (userId: string) => {
  try {
    const userData = await getUserGameData(userId);

    if (userData.length === 0) {
      return null;
    }

    // Group data by world
    const worldGroups = userData.reduce(
      (acc, data) => {
        if (!acc[data.world]) {
          acc[data.world] = [];
        }
        acc[data.world].push(data);
        return acc;
      },
      {} as Record<string, GameData[]>
    );

    // Calculate metrics for each world
    const worldMetrics = Object.entries(worldGroups).map(
      ([worldName, data]) => {
        // Sort by timestamp to analyze progression over time
        const sortedData = [...data].sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

        const firstEntry = sortedData[0];
        const latestEntry = sortedData[sortedData.length - 1];
        const totalCorrect = data.reduce((sum, d) => sum + d.correct, 0);
        const totalIncorrect = data.reduce((sum, d) => sum + d.incorrect, 0);
        const totalMissed = data.reduce((sum, d) => sum + d.missed, 0);
        const totalSkipped = data.reduce((sum, d) => sum + d.skipped, 0);
        const accuracy =
          (totalCorrect / (totalCorrect + totalIncorrect + totalMissed)) * 100;

        return {
          worldName,
          currentNeurons: latestEntry.neurons,
          totalStars: data.reduce((sum, d) => sum + d.stars, 0),
          progressOverTime: sortedData.map((d) => ({
            timestamp: d.timestamp,
            neurons: d.neurons,
            stars: d.stars,
          })),
          improvement: {
            neuronGain: latestEntry.neurons - firstEntry.neurons,
          },
          answers: {
            correct: totalCorrect,
            incorrect: totalIncorrect,
            skipped: totalSkipped,
            missed: totalMissed,
            accuracy: parseFloat(accuracy.toFixed(2)),
          },
        };
      }
    );

    return {
      userId,
      worldsPlayed: Object.keys(worldGroups).length,
      totalStars: userData.reduce((sum, d) => sum + d.stars, 0),
      totalNeurons: Math.max(...userData.map((d) => d.neurons)),
      metrics: worldMetrics,
      overallAccuracy: parseFloat(
        (
          (userData.reduce((sum, d) => sum + d.correct, 0) /
            (userData.reduce((sum, d) => sum + d.correct, 0) +
              userData.reduce((sum, d) => sum + d.incorrect, 0) +
              userData.reduce((sum, d) => sum + d.missed, 0))) *
          100
        ).toFixed(2)
      ),
    };
  } catch (error) {
    console.error(
      `Error calculating progression metrics for user ${userId}:`,
      error
    );
    return null;
  }
};
