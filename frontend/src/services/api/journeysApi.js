import { API_BASE_URL } from "./config";

/**
 * Fetches journey records from the backend.
 *
 * When a category is provided, the request filters journeys by that category.
 * When no category is provided, all public journeys are fetched.
 *
 * @param {string} [category] - Optional journey category used to filter results.
 * @returns {Promise<Object>} Journey list returned by the API.
 * @throws {Error} Throws an error if journeys cannot be fetched.
 */
export const getJourneys = async (category) => {
  try {
    const url = category
      ? `${API_BASE_URL}/journeys?category=${category}`
      : `${API_BASE_URL}/journeys`;

    const response = await fetch(url);

    if (!response.ok) throw new Error("Failed to fetch journeys");

    return await response.json();
  } catch (error) {
    console.error("API Error (getJourneys):", error);
    throw error;
  }
};
