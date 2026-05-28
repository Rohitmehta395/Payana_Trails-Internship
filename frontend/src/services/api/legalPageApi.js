import { API_BASE_URL, withAdminAuth } from "./config";

/**
 * Fetches a published legal page by type (public).
 *
 * @param {string} type - "privacy-policy" or "terms-and-conditions"
 * @returns {Promise<Object>} Legal page data.
 * @throws {Error} Throws if the page cannot be fetched.
 */
export const getLegalPage = async (type) => {
  try {
    const response = await fetch(`${API_BASE_URL}/legal/${type}`);

    if (!response.ok) throw new Error("Failed to fetch legal page");

    return await response.json();
  } catch (error) {
    console.error("API Error (getLegalPage):", error);
    throw error;
  }
};

/**
 * Fetches a legal page for the admin panel (includes draftData).
 *
 * @param {string} type - "privacy-policy" or "terms-and-conditions"
 * @returns {Promise<Object>} Full legal page data including drafts.
 * @throws {Error} Throws if the admin page cannot be fetched.
 */
export const getLegalPageAdmin = async (type) => {
  try {
    const response = await fetch(`${API_BASE_URL}/legal/${type}/admin`, {
      headers: withAdminAuth(),
    });

    if (!response.ok) throw new Error("Failed to fetch admin legal page");

    return await response.json();
  } catch (error) {
    console.error("API Error (getLegalPageAdmin):", error);
    throw error;
  }
};

/**
 * Creates or updates a legal page (publish or save as draft).
 *
 * @param {string} type - "privacy-policy" or "terms-and-conditions"
 * @param {Object} data - { title, content, isDraft }
 * @returns {Promise<Object>} Updated legal page response.
 * @throws {Error} Throws if the update fails.
 */
export const updateLegalPage = async (type, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/legal/${type}`, {
      method: "PUT",
      headers: withAdminAuth({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to update legal page");
    }

    return result;
  } catch (error) {
    console.error("API Error (updateLegalPage):", error);
    throw error;
  }
};

/**
 * Autosaves draft data for a legal page without publishing.
 *
 * @param {string} type - "privacy-policy" or "terms-and-conditions"
 * @param {Object} draftData - { title, content }
 * @returns {Promise<Object>} Autosave response.
 * @throws {Error} Throws if the autosave fails.
 */
export const autosaveLegalPage = async (type, draftData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/legal/${type}/autosave`, {
      method: "PATCH",
      headers: withAdminAuth({ "Content-Type": "application/json" }),
      body: JSON.stringify({ draftData }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to autosave legal page");
    }

    return result;
  } catch (error) {
    console.error("API Error (autosaveLegalPage):", error);
    throw error;
  }
};
