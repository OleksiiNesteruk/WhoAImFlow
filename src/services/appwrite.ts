import { Client, Databases, Query, Models } from "appwrite";

// Appwrite configuration using environment variables
const client = new Client();
client
  .setEndpoint(import.meta.env.API_ENDPOINT)
  .setProject(import.meta.env.PROJECT_ID);

const databases = new Databases(client);

// Database and collection IDs from environment variables
const DATABASE_ID = import.meta.env.DATABASE_ID;
const FEEDBACK_COLLECTION_ID = import.meta.env.FEEDBACK_COLLECTION_ID;

export interface Feedback {
  $id: string;
  rating: number;
  message: string;
  name: string;
  user_id: string;
  created_at: string;
}

function isFeedback(doc: Models.Document): doc is Models.Document & Feedback {
  return (
    typeof doc.rating === "number" &&
    typeof doc.message === "string" &&
    typeof doc.name === "string" &&
    typeof doc.user_id === "string" &&
    typeof doc.created_at === "string"
  );
}

function documentToFeedback(doc: Models.Document): Feedback {
  if (!isFeedback(doc)) {
    throw new Error("Document is missing required Feedback properties");
  }
  return {
    $id: doc.$id,
    rating: doc.rating,
    message: doc.message,
    name: doc.name,
    user_id: doc.user_id,
    created_at: doc.created_at,
  };
}

const QUERY_LIMIT = 100000;
export const getFeedbacks = async () => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      FEEDBACK_COLLECTION_ID,
      [Query.limit(QUERY_LIMIT)]
    );

    return response.documents.map(documentToFeedback);
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    return [];
  }
};

export const getFilteredFeedbacks = async (
  searchTerm: string = "",
  sortField: string = "created_at",
  sortOrder: "asc" | "desc" = "desc",
  minRating?: number,
  maxRating?: number
) => {
  try {
    const queries = [Query.limit(QUERY_LIMIT)];

    if (minRating !== undefined) {
      queries.push(Query.greaterThanEqual("rating", minRating));
    }
    if (maxRating !== undefined) {
      queries.push(Query.lessThanEqual("rating", maxRating));
    }

    if (sortOrder === "asc") {
      queries.push(Query.orderAsc(sortField));
    } else {
      queries.push(Query.orderDesc(sortField));
    }

    const response = await databases.listDocuments(
      DATABASE_ID,
      FEEDBACK_COLLECTION_ID,
      queries
    );

    let feedbacks = response.documents.map(documentToFeedback);

    if (searchTerm && searchTerm.trim() !== "") {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      feedbacks = feedbacks.filter(
        (feedback) =>
          feedback.message.toLowerCase().includes(lowerCaseSearchTerm) ||
          feedback.name.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    return feedbacks;
  } catch (error) {
    console.error("Error fetching filtered feedbacks:", error);
    return [];
  }
};
