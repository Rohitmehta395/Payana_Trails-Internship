import { API_BASE_URL, withAdminAuth } from "./config";

/**
 * Fetches header configuration from the backend.
 *
 * This usually includes public header content such as logo,
 * navigation links, and other header settings.
 *
 * @returns {Promise<Object>} Header data returned by the API.
 * @throws {Error} Throws an error if header data cannot be fetched.
 */
export const getHeader = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/header`);

    if (!response.ok) throw new Error("Failed to fetch header data");

    return await response.json();
  } catch (error) {
    console.error("API Error (getHeader):", error);
    throw error;
  }
};

/**
 * Updates header configuration from the admin panel.
 *
 * Uses FormData because the header update may include an uploaded logo file.
 * The Content-Type header is intentionally not set manually because the
 * browser automatically adds the correct multipart boundary for FormData.
 *
 * @param {FormData} formData - Header fields and optional logo file.
 * @returns {Promise<Object>} Updated header response data.
 * @throws {Error} Throws an error if the header update fails or the logo file is too large.
 */
export const updateHeader = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/header`, {
      method: "PUT",
      // Adds admin authorization headers for protected update access.
      headers: withAdminAuth(),
      body: formData,
    });

    // Handle file size errors separately for a clearer user message.
    if (response.status === 413) {
      throw new Error("Logo file too large. Please upload a smaller image.");
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update header");
    }

    return data;
  } catch (error) {
    console.error("API Error (updateHeader):", error);
    throw error;
  }
};

/**
 * Deletes the current header logo from the admin panel.
 *
 * @returns {Promise<Object>} API response after the logo is deleted.
 * @throws {Error} Throws an error if the header logo cannot be deleted.
 */
export const deleteHeaderLogo = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/header/logo`, {
      method: "DELETE",
      // Adds admin authorization headers for protected delete access.
      headers: withAdminAuth(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete logo");
    }

    return data;
  } catch (error) {
    console.error("API Error (deleteHeaderLogo):", error);
    throw error;
  }
};

/**
 * Fetches footer configuration from the backend.
 *
 * This usually includes public footer content such as logo,
 * links, contact details, social links, and copyright text.
 *
 * @returns {Promise<Object>} Footer data returned by the API.
 * @throws {Error} Throws an error if footer data cannot be fetched.
 */
export const getFooter = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/footer`);

    if (!response.ok) throw new Error("Failed to fetch footer data");

    return await response.json();
  } catch (error) {
    console.error("API Error (getFooter):", error);
    throw error;
  }
};

/**
 * Updates footer configuration from the admin panel.
 *
 * Uses FormData because the footer update may include an uploaded logo file.
 * The Content-Type header is intentionally not set manually because the
 * browser automatically adds the correct multipart boundary for FormData.
 *
 * @param {FormData} formData - Footer fields and optional logo file.
 * @returns {Promise<Object>} Updated footer response data.
 * @throws {Error} Throws an error if the footer update fails or the logo file is too large.
 */
export const updateFooter = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/footer`, {
      method: "PUT",
      // Adds admin authorization headers for protected update access.
      headers: withAdminAuth(),
      body: formData,
    });

    // Handle file size errors separately for a clearer user message.
    if (response.status === 413) {
      throw new Error("Logo file too large. Please upload a smaller image.");
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update footer");
    }

    return data;
  } catch (error) {
    console.error("API Error (updateFooter):", error);
    throw error;
  }
};

/**
 * Deletes the current footer logo from the admin panel.
 *
 * @returns {Promise<Object>} API response after the logo is deleted.
 * @throws {Error} Throws an error if the footer logo cannot be deleted.
 */
export const deleteFooterLogo = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/footer/logo`, {
      method: "DELETE",
      // Adds admin authorization headers for protected delete access.
      headers: withAdminAuth(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete logo");
    }

    return data;
  } catch (error) {
    console.error("API Error (deleteFooterLogo):", error);
    throw error;
  }
};
