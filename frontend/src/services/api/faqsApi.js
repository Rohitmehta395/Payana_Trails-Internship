import { API_BASE_URL, withAdminAuth } from "./config";

/**
 * Fetches FAQ records from the backend.
 *
 * When `isAdmin` is true, the admin query parameter is added so the backend
 * can return admin-level FAQ data, such as inactive or hidden FAQs.
 *
 * @param {boolean} isAdmin - Whether to fetch FAQs for the admin panel.
 * @returns {Promise<Object>} FAQ list returned by the API.
 * @throws {Error} Throws an error if FAQs cannot be fetched.
 */
export const getFAQs = async (isAdmin = false) => {
  try {
    const url = isAdmin
      ? `${API_BASE_URL}/faqs?admin=true`
      : `${API_BASE_URL}/faqs`;

    const response = await fetch(url);

    if (!response.ok) throw new Error("Failed to fetch FAQs");

    return await response.json();
  } catch (error) {
    console.error("API Error (getFAQs):", error);
    throw error;
  }
};

/**
 * Creates a new FAQ from the admin panel.
 *
 * @param {Object} faqData - FAQ data, usually including question, answer, and status/order fields.
 * @returns {Promise<Object>} Newly created FAQ response data.
 * @throws {Error} Throws an error if the FAQ cannot be created.
 */
export const createFAQ = async (faqData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/faqs`, {
      method: "POST",
      // FAQ data is sent as JSON and requires admin authorization.
      headers: withAdminAuth({ "Content-Type": "application/json" }),
      body: JSON.stringify(faqData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create FAQ");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Updates an existing FAQ by ID from the admin panel.
 *
 * @param {string|number} id - FAQ ID to update.
 * @param {Object} faqData - Updated FAQ data.
 * @returns {Promise<Object>} Updated FAQ response data.
 * @throws {Error} Throws an error if the FAQ cannot be updated.
 */
export const updateFAQ = async (id, faqData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/faqs/${id}`, {
      method: "PUT",
      // FAQ update data is sent as JSON and requires admin authorization.
      headers: withAdminAuth({ "Content-Type": "application/json" }),
      body: JSON.stringify(faqData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update FAQ");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Deletes an FAQ by ID from the admin panel.
 *
 * @param {string|number} id - FAQ ID to delete.
 * @returns {Promise<Object>} API response after successful deletion.
 * @throws {Error} Throws an error if the FAQ cannot be deleted.
 */
export const deleteFAQ = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/faqs/${id}`, {
      method: "DELETE",
      // Adds admin authorization headers for protected delete access.
      headers: withAdminAuth(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete FAQ");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Toggles an FAQ's active/inactive status from the admin panel.
 *
 * @param {string|number} id - FAQ ID whose status should be toggled.
 * @returns {Promise<Object>} API response containing the updated FAQ status.
 * @throws {Error} Throws an error if the FAQ status cannot be toggled.
 */
export const toggleFAQStatus = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/faqs/${id}/toggle`, {
      method: "PATCH",
      // Adds admin authorization headers for protected status updates.
      headers: withAdminAuth(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to toggle FAQ");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Updates the display order of FAQs from the admin panel.
 *
 * @param {Array<Object>} items - Ordered FAQ items, usually containing IDs and sort positions.
 * @returns {Promise<Object>} API response after FAQs are reordered.
 * @throws {Error} Throws an error if the FAQ order cannot be updated.
 */
export const reorderFAQs = async (items) => {
  try {
    const response = await fetch(`${API_BASE_URL}/faqs/reorder`, {
      method: "PUT",
      // Reorder data is sent as JSON and requires admin authorization.
      headers: withAdminAuth({ "Content-Type": "application/json" }),
      body: JSON.stringify({ items }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to reorder FAQs");
    }

    return data;
  } catch (error) {
    throw error;
  }
};
