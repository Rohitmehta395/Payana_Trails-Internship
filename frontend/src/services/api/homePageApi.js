import { API_BASE_URL, withAdminAuth } from "./config";

/**
 * Fetches home page content from the backend.
 *
 * @returns {Promise<Object>} Home page data returned by the API.
 * @throws {Error} Throws an error if home page data cannot be fetched.
 */
export const getHomePage = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/home-page`);

    if (!response.ok) throw new Error("Failed to fetch home page data");

    return await response.json();
  } catch (error) {
    console.error("API Error (getHomePage):", error);
    throw error;
  }
};

/**
 * Updates home page content from the admin panel.
 *
 * Uses FormData because the home page update may include uploaded files,
 * such as banner images, gallery images, or other media assets.
 * The Content-Type header is intentionally not set manually because the
 * browser automatically adds the correct multipart boundary for FormData.
 *
 * @param {FormData} formData - Home page fields and uploaded files.
 * @returns {Promise<Object>} Updated home page response data.
 * @throws {Error} Throws an error if the home page update fails.
 */
export const updateHomePage = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/home-page`, {
      method: "PUT",
      // Adds admin authorization headers for protected update access.
      headers: withAdminAuth(),
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update home page");
    }

    return data;
  } catch (error) {
    console.error("API Error (updateHomePage):", error);
    throw error;
  }
};

/**
 * Sends selected home page images to the backend for compression preview.
 *
 * This request does not update the home page. It only returns image
 * compression statistics, such as estimated optimized size or savings.
 *
 * @param {Object} filesByField - Object where each key is a form field name and each value is a File or array of Files.
 * @returns {Promise<Object>} Image compression preview data.
 * @throws {Error} Throws an error if the compression preview request fails.
 */
export const previewHomePageImageCompression = async (filesByField) => {
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
    const response = await fetch(
      `${API_BASE_URL}/home-page/preview-image-stats`,
      {
        method: "POST",
        // Adds admin authorization headers for protected preview access.
        headers: withAdminAuth(),
        body: previewData,
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to preview image compression");
    }

    return data;
  } catch (error) {
    throw error;
  }
};
