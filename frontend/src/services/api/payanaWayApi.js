import { API_BASE_URL, withAdminAuth } from "./config";

/**
 * Fetches Payana Way page content from the backend.
 *
 * @returns {Promise<Object>} Payana Way page data returned by the API.
 * @throws {Error} Throws an error if Payana Way data cannot be fetched.
 */
export const getPayanaWayPage = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/payana-way`);

    if (!response.ok) throw new Error("Failed to fetch Payana Way data");

    return await response.json();
  } catch (error) {
    console.error("API Error (getPayanaWayPage):", error);
    throw error;
  }
};

/**
 * Updates the "A Journey Begins" section on the Payana Way page.
 *
 * Uses FormData because this section may include uploaded media files.
 * The Content-Type header is intentionally not set manually because the
 * browser automatically adds the correct multipart boundary.
 *
 * @param {FormData} formData - Updated section fields and uploaded files.
 * @returns {Promise<Object>} Updated section response data.
 * @throws {Error} Throws an error if the section update fails.
 */
export const updateAJourneyBegins = async (formData) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/payana-way/a-journey-begins`,
      {
        method: "PUT",
        // Adds admin authorization headers for protected update access.
        headers: withAdminAuth(),
        body: formData,
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update A Journey Begins");
    }

    return data;
  } catch (error) {
    console.error("API Error (updateAJourneyBegins):", error);
    throw error;
  }
};

/**
 * Updates the "The Payana Difference" section on the Payana Way page.
 *
 * Uses FormData because this section may include uploaded media files.
 *
 * @param {FormData} formData - Updated section fields and uploaded files.
 * @returns {Promise<Object>} Updated section response data.
 * @throws {Error} Throws an error if the section update fails.
 */
export const updateThePayanaDifference = async (formData) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/payana-way/the-payana-difference`,
      {
        method: "PUT",
        // Adds admin authorization headers for protected update access.
        headers: withAdminAuth(),
        body: formData,
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update The Payana Difference");
    }

    return data;
  } catch (error) {
    console.error("API Error (updateThePayanaDifference):", error);
    throw error;
  }
};

/**
 * Updates the "Journeys with Purpose" section on the Payana Way page.
 *
 * Uses FormData because this section may include uploaded media files.
 *
 * @param {FormData} formData - Updated section fields and uploaded files.
 * @returns {Promise<Object>} Updated section response data.
 * @throws {Error} Throws an error if the section update fails.
 */
export const updateJourneysWithPurpose = async (formData) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/payana-way/journeys-with-purpose`,
      {
        method: "PUT",
        // Adds admin authorization headers for protected update access.
        headers: withAdminAuth(),
        body: formData,
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update Journeys with Purpose");
    }

    return data;
  } catch (error) {
    console.error("API Error (updateJourneysWithPurpose):", error);
    throw error;
  }
};

/**
 * Updates the "In The Media" section on the Payana Way page.
 *
 * Uses FormData because this section may include media items,
 * uploaded files, logos, links, or related media content.
 *
 * @param {FormData} formData - Updated media section fields and uploaded files.
 * @returns {Promise<Object>} Updated media section response data.
 * @throws {Error} Throws an error if the section update fails.
 */
export const updateInTheMedia = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/payana-way/in-the-media`, {
      method: "PUT",
      // Adds admin authorization headers for protected update access.
      headers: withAdminAuth(),
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update In The Media");
    }

    return data;
  } catch (error) {
    console.error("API Error (updateInTheMedia):", error);
    throw error;
  }
};
