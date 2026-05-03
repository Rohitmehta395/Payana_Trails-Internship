import { API_BASE_URL, withAdminAuth } from "./config";

/**
 * Fetches destination records from the backend.
 *
 * When `isAdmin` is true, the request includes admin authentication
 * and asks the backend to return admin-level destination data.
 *
 * @param {boolean} isAdmin - Whether to fetch destinations for the admin panel.
 * @returns {Promise<Object>} Destination list returned by the API.
 * @throws {Error} Throws an error if destinations cannot be fetched.
 */
export const getDestinations = async (isAdmin = false) => {
  try {
    const url = isAdmin
      ? `${API_BASE_URL}/destinations?admin=true`
      : `${API_BASE_URL}/destinations`;

    const response = await fetch(url, {
      // Public requests do not need headers; admin requests include the auth token.
      headers: isAdmin ? withAdminAuth() : undefined,
    });

    if (!response.ok) throw new Error("Failed to fetch destinations");

    return await response.json();
  } catch (error) {
    console.error("API Error (getDestinations):", error);
    throw error;
  }
};

/**
 * Creates a new destination from the admin panel.
 *
 * Uses FormData because destination details may include uploaded files,
 * such as images. The Content-Type header is intentionally not set manually,
 * because the browser automatically adds the multipart boundary.
 *
 * @param {FormData} formData - Destination fields and uploaded files.
 * @returns {Promise<Object>} Newly created destination response data.
 * @throws {Error} Throws an error if the destination cannot be added.
 */
export const addDestination = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/destinations`, {
      method: "POST",
      // Adds admin authorization headers for protected create access.
      headers: withAdminAuth(),
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to add destination");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Updates an existing destination by ID from the admin panel.
 *
 * Uses FormData because the update may include text fields and uploaded files.
 *
 * @param {string|number} id - Destination ID to update.
 * @param {FormData} formData - Updated destination fields and uploaded files.
 * @returns {Promise<Object>} Updated destination response data.
 * @throws {Error} Throws an error if the destination cannot be updated.
 */
export const updateDestination = async (id, formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/destinations/${id}`, {
      method: "PUT",
      // Adds admin authorization headers for protected update access.
      headers: withAdminAuth(),
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update destination");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Deletes a destination by ID from the admin panel.
 *
 * @param {string|number} id - Destination ID to delete.
 * @returns {Promise<Object>} API response after successful deletion.
 * @throws {Error} Throws an error if the destination cannot be deleted.
 */
export const deleteDestination = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/destinations/${id}`, {
      method: "DELETE",
      // Adds admin authorization headers for protected delete access.
      headers: withAdminAuth(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete destination");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Toggles a destination's active/inactive status from the admin panel.
 *
 * @param {string|number} id - Destination ID whose status should be toggled.
 * @returns {Promise<Object>} API response containing the updated destination status.
 * @throws {Error} Throws an error if the destination status cannot be changed.
 */
export const toggleDestinationStatus = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/destinations/${id}/toggle`, {
      method: "PATCH",
      // Adds admin authorization headers for protected status updates.
      headers: withAdminAuth(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to toggle destination status");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Updates the display order of destinations from the admin panel.
 *
 * @param {Array<Object>} items - Ordered destination items, usually containing IDs and sort positions.
 * @returns {Promise<Object>} API response after destinations are reordered.
 * @throws {Error} Throws an error if the destination order cannot be updated.
 */
export const reorderDestinations = async (items) => {
  try {
    const response = await fetch(`${API_BASE_URL}/destinations/reorder`, {
      method: "PUT",
      // Reorder data is sent as JSON and requires admin authorization.
      headers: withAdminAuth({ "Content-Type": "application/json" }),
      body: JSON.stringify({ items }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to reorder destinations");
    }

    return data;
  } catch (error) {
    throw error;
  }
};
