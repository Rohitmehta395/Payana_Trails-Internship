import {
  ADMIN_BASE_URL,
  withAdminAuth,
  getFileNameFromDisposition,
} from "./config";

/**
 * Logs in an admin user using the provided credentials.
 *
 * @param {Object} credentials - Admin login credentials, usually email and password.
 * @returns {Promise<Object>} Login response data, such as token and admin details.
 * @throws {Error} Throws an error if login fails.
 */
export const adminLogin = async (credentials) => {
  try {
    const response = await fetch(`${ADMIN_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    // Stop execution if the API returns an error response.
    if (!response.ok) throw new Error(data.message || "Login failed");

    return data;
  } catch (error) {
    console.error("API Error (adminLogin):", error);
    throw error;
  }
};

/**
 * Sends a password reset OTP to the admin's email address.
 *
 * @param {string} email - Admin email address.
 * @returns {Promise<Object>} API response confirming OTP delivery.
 * @throws {Error} Throws an error if the OTP request fails.
 */
export const adminForgotPassword = async (email) => {
  try {
    const response = await fetch(`${ADMIN_BASE_URL}/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    // Handle unsuccessful OTP request responses.
    if (!response.ok) throw new Error(data.message || "Failed to send OTP");

    return data;
  } catch (error) {
    console.error("API Error (adminForgotPassword):", error);
    throw error;
  }
};

/**
 * Resets the admin password using the OTP and new password details.
 *
 * @param {Object} payload - Reset password data, usually email, OTP, and new password.
 * @returns {Promise<Object>} API response after successful password reset.
 * @throws {Error} Throws an error if OTP verification or password reset fails.
 */
export const adminResetPassword = async (payload) => {
  try {
    const response = await fetch(`${ADMIN_BASE_URL}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    // Handle invalid OTP or failed reset responses.
    if (!response.ok) throw new Error(data.message || "Invalid OTP");

    return data;
  } catch (error) {
    console.error("API Error (adminResetPassword):", error);
    throw error;
  }
};

/**
 * Fetches the list of available form exports for the authenticated admin.
 *
 * @returns {Promise<Object>} Form export data returned by the API.
 * @throws {Error} Throws an error if form exports cannot be loaded.
 */
export const getAdminFormExports = async () => {
  try {
    const response = await fetch(`${ADMIN_BASE_URL}/form-exports`, {
      // Adds admin authentication headers to the request.
      headers: withAdminAuth(),
    });

    const data = await response.json();

    // Handle failed export list requests.
    if (!response.ok) {
      throw new Error(data.message || "Failed to load form exports");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Downloads a form export file for the selected form type and file format.
 *
 * @param {string} formType - Type of form to export.
 * @param {string} format - File format to download, such as csv, xlsx, or pdf.
 * @returns {Promise<{ blob: Blob, fileName: string }>} Downloaded file blob and resolved file name.
 * @throws {Error} Throws an error if the file download fails.
 */
export const downloadAdminFormExport = async (formType, format) => {
  try {
    const response = await fetch(
      `${ADMIN_BASE_URL}/form-exports/${formType}/download?format=${format}`,
      {
        // Adds admin authentication headers to access protected export downloads.
        headers: withAdminAuth(),
      },
    );

    if (!response.ok) {
      let message = "Failed to download form export";

      try {
        // Some failed download responses return JSON error details.
        const errorData = await response.json();
        message = errorData.message || message;
      } catch (parseError) {
        // Ignore JSON parsing errors because successful downloads usually return binary data.
      }

      throw new Error(message);
    }

    // Convert the successful binary response into a Blob for file download handling.
    const blob = await response.blob();

    // Try to read the file name from the Content-Disposition header.
    // Fall back to a generated name when the header is missing.
    const fileName = getFileNameFromDisposition(
      response.headers.get("content-disposition"),
      `${formType}.${format}`,
    );

    return {
      blob,
      fileName,
    };
  } catch (error) {
    throw error;
  }
};
