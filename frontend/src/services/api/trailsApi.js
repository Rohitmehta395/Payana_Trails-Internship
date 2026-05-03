import { API_BASE_URL, withAdminAuth } from "./config";

/**
 * Fetches trail records from the backend.
 *
 * When a category is provided, trails are filtered by that category.
 * When `isAdmin` is true, admin authentication is included and the backend
 * can return admin-level trail data, such as inactive or hidden records.
 *
 * @param {string} [category="All"] - Trail category filter. Use "All" to fetch every category.
 * @param {boolean} [isAdmin=false] - Whether to fetch trails for the admin panel.
 * @returns {Promise<Object>} Trail list returned by the API.
 * @throws {Error} Throws an error if trails cannot be fetched.
 */
export const getTrails = async (category = "All", isAdmin = false) => {
  try {
    const params = new URLSearchParams();

    // Add category filter only when a specific category is selected.
    if (category !== "All") params.set("category", category);

    // Add admin flag only for admin requests.
    if (isAdmin) params.set("admin", "true");

    const url = `${API_BASE_URL}/trails${
      params.toString() ? "?" + params.toString() : ""
    }`;

    const response = await fetch(url, {
      // Public requests do not need headers; admin requests include the auth token.
      headers: isAdmin ? withAdminAuth() : undefined,
    });

    if (!response.ok) throw new Error("Failed to fetch trails");

    return await response.json();
  } catch (error) {
    console.error("API Error (getTrails):", error);
    throw error;
  }
};

/**
 * Fetches a single trail by ID or slug.
 *
 * When `isAdmin` is true, the admin query parameter and authentication
 * headers are included so protected trail details can be returned.
 *
 * @param {string|number} identifier - Trail ID or slug.
 * @param {boolean} [isAdmin=false] - Whether to fetch admin-level trail details.
 * @returns {Promise<Object>} Trail detail data returned by the API.
 * @throws {Error} Throws an error if trail details cannot be fetched.
 */
export const getTrailById = async (identifier, isAdmin = false) => {
  try {
    const suffix = isAdmin ? "?admin=true" : "";

    const response = await fetch(
      `${API_BASE_URL}/trails/${identifier}${suffix}`,
      {
        // Public requests do not need headers; admin requests include the auth token.
        headers: isAdmin ? withAdminAuth() : undefined,
      },
    );

    if (!response.ok) throw new Error("Failed to fetch trail details");

    return await response.json();
  } catch (error) {
    console.error("API Error (getTrailById):", error);
    throw error;
  }
};

/**
 * Sends selected trail images to the backend for compression preview.
 *
 * This request does not create or update a trail. It only returns image
 * compression statistics, such as estimated optimized size or savings.
 *
 * @param {Object} filesByField - Object where each key is a form field name and each value is a File or array of Files.
 * @returns {Promise<Object>} Image compression preview data.
 * @throws {Error} Throws an error if the compression preview request fails.
 */
export const previewTrailImageCompression = async (filesByField) => {
  const previewData = new FormData();

  // Convert each field value into one or more files and append them to FormData.
  Object.entries(filesByField).forEach(([field, value]) => {
    const files = Array.isArray(value) ? value : [value];

    files.filter(Boolean).forEach((file) => previewData.append(field, file));
  });

  // Avoid sending an empty preview request when no image files are selected.
  if (![...previewData.keys()].length) {
    return { imageStats: [] };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/trails/preview-image-stats`, {
      method: "POST",
      // Adds admin authorization headers for protected preview access.
      headers: withAdminAuth(),
      body: previewData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to preview image compression");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Creates a new trail from the admin panel.
 *
 * Uses FormData because a trail may include uploaded files, such as images.
 * The Content-Type header is intentionally not set manually because the
 * browser automatically adds the correct multipart boundary.
 *
 * @param {FormData} trailFormData - Trail fields and uploaded files.
 * @returns {Promise<Object>} Newly created trail response data.
 * @throws {Error} Throws an error if the trail cannot be created or files are too large.
 */
export const createTrail = async (trailFormData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/trails`, {
      method: "POST",
      // Adds admin authorization headers for protected create access.
      headers: withAdminAuth(),
      body: trailFormData,
    });

    // Handle payload size errors separately for a clearer user message.
    if (response.status === 413) {
      throw new Error(
        "Files are too large. Please upload smaller files (limit: 1MB on your VPS).",
      );
    }

    let data;

    try {
      data = await response.json();
    } catch (err) {
      // Some server errors may not return valid JSON.
      throw new Error(
        `Server error (${response.status}). If uploading images, they might be too large.`,
      );
    }

    if (!response.ok) {
      console.error("API Error Response Data:", data);
      throw new Error(data.message || "Failed to create trail");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Updates an existing trail by ID from the admin panel.
 *
 * Uses FormData because the update may include text fields and uploaded files.
 * The Content-Type header is intentionally not set manually because the
 * browser automatically adds the correct multipart boundary.
 *
 * @param {string|number} id - Trail ID to update.
 * @param {FormData} trailFormData - Updated trail fields and uploaded files.
 * @returns {Promise<Object>} Updated trail response data.
 * @throws {Error} Throws an error if the trail cannot be updated or files are too large.
 */
export const updateTrail = async (id, trailFormData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/trails/${id}`, {
      method: "PUT",
      // Adds admin authorization headers for protected update access.
      headers: withAdminAuth(),
      body: trailFormData,
    });

    // Handle payload size errors separately for a clearer user message.
    if (response.status === 413) {
      throw new Error(
        "Files are too large. Please upload smaller files (limit: 1MB on your VPS).",
      );
    }

    let data;

    try {
      data = await response.json();
    } catch (err) {
      // Some server errors may not return valid JSON.
      throw new Error(
        `Server error (${response.status}). If uploading images, they might be too large.`,
      );
    }

    if (!response.ok) {
      console.error("API Error Response Data:", data);
      throw new Error(data.message || "Failed to update trail");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Deletes a trail by ID from the admin panel.
 *
 * @param {string|number} id - Trail ID to delete.
 * @returns {Promise<Object>} API response after successful deletion.
 * @throws {Error} Throws an error if the trail cannot be deleted.
 */
export const deleteTrail = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/trails/${id}`, {
      method: "DELETE",
      // Adds admin authorization headers for protected delete access.
      headers: withAdminAuth(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete trail");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Duplicates an existing trail by ID.
 *
 * This is useful in the admin panel when creating a new trail based on
 * an existing trail's content and structure.
 *
 * @param {string|number} id - Trail ID to duplicate.
 * @returns {Promise<Object>} Duplicated trail response data.
 * @throws {Error} Throws an error if the trail cannot be duplicated.
 */
export const duplicateTrail = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/trails/${id}/duplicate`, {
      method: "POST",
      // Adds admin authorization headers for protected duplicate access.
      headers: withAdminAuth(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to duplicate trail");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Updates the display order of trails from the admin panel.
 *
 * @param {Array<Object>} items - Ordered trail items, usually containing IDs and sort positions.
 * @returns {Promise<Object>} API response after trails are reordered.
 * @throws {Error} Throws an error if trails cannot be reordered.
 */
export const reorderTrails = async (items) => {
  try {
    const response = await fetch(`${API_BASE_URL}/trails/reorder`, {
      method: "PUT",
      // Reorder data is sent as JSON and requires admin authorization.
      headers: withAdminAuth({ "Content-Type": "application/json" }),
      body: JSON.stringify({ items }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to reorder trails");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Toggles a trail's active/inactive status from the admin panel.
 *
 * @param {string|number} id - Trail ID whose status should be toggled.
 * @returns {Promise<Object>} API response containing the updated trail status.
 * @throws {Error} Throws an error if the trail status cannot be changed.
 */
export const toggleTrailStatus = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/trails/${id}/toggle`, {
      method: "PATCH",
      // Adds admin authorization headers for protected status updates.
      headers: withAdminAuth(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to toggle trail status");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Updates or autosaves a trail itinerary.
 *
 * The `mode` value allows the backend to distinguish between a normal save
 * and other supported actions, such as autosave or draft handling.
 *
 * @param {string|number} id - Trail ID whose itinerary should be updated.
 * @param {Array<Object>|Object} itinerary - Itinerary data to save.
 * @param {string} [mode="save"] - Save mode used by the backend.
 * @param {Array<Object>} [optionalExperiences] - Optional experiences associated with the itinerary.
 * @param {Array<Object>} [flights] - Flight details associated with the itinerary.
 * @returns {Promise<Object>} API response after itinerary update.
 * @throws {Error} Throws an error if the itinerary cannot be saved.
 */
export const updateTrailItinerary = async (
  id,
  itinerary,
  mode = "save",
  optionalExperiences,
  flights,
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/trails/${id}/itinerary`, {
      method: "PATCH",
      // Itinerary data is sent as JSON and requires admin authorization.
      headers: withAdminAuth({ "Content-Type": "application/json" }),
      body: JSON.stringify({ itinerary, mode, optionalExperiences, flights }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to save itinerary");
    }

    return data;
  } catch (error) {
    throw error;
  }
};
