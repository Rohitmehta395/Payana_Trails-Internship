import { API_BASE_URL } from "./config";

/**
 * Fetches all page hero configurations.
 *
 * This is mainly used in the admin panel to get the full page hero map
 * along with available page keys.
 *
 * @returns {Promise<Object>} All page hero data returned by the API.
 * @throws {Error} Throws an error if page heroes cannot be fetched.
 */
export const getAllPageHeroes = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/page-heroes`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch page heroes");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetches hero images for a specific page.
 *
 * Slashes in the page key are replaced with `~` so nested page paths
 * can be safely passed as a URL path parameter.
 *
 * A timestamp query parameter is added to avoid browser caching and
 * ensure the latest hero images are fetched.
 *
 * @param {string} pageKey - Page identifier or route key.
 * @returns {Promise<Object>} Hero images for the selected page.
 * @throws {Error} Throws an error if hero images cannot be fetched.
 */
export const getPageHeroImages = async (pageKey) => {
  try {
    const pk = pageKey.replace(/\//g, "~");

    const response = await fetch(
      `${API_BASE_URL}/page-heroes/${pk}?t=${Date.now()}`,
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch page hero images");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Previews image compression stats before saving hero images.
 *
 * This request uploads selected files only for preview purposes.
 * It does not permanently save or update page hero images.
 *
 * @param {string} pageKey - Page identifier or route key.
 * @param {File|File[]} files - Single file or array of files to preview.
 * @returns {Promise<Object>} Image compression preview data.
 * @throws {Error} Throws an error if compression preview fails.
 */
export const previewPageHeroCompression = async (pageKey, files) => {
  const pk = pageKey.replace(/\//g, "~");
  const formData = new FormData();

  // Normalize a single file or multiple files into an array.
  const fileArr = Array.isArray(files) ? files : [files];

  // Append only valid file values to the request payload.
  fileArr
    .filter(Boolean)
    .forEach((file) => formData.append("pageHeroImages", file));

  // Avoid sending an empty request when no files are selected.
  if (![...formData.keys()].length) return { imageStats: [] };

  try {
    const response = await fetch(
      `${API_BASE_URL}/page-heroes/${pk}/preview-compression`,
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to preview compression");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Uploads new hero images for a page.
 *
 * Desktop images are appended under `pageHeroImages`.
 * Mobile images are appended under `pageHeroImagesMobile`.
 * Desktop and mobile files are expected to be paired by index on the backend.
 *
 * Uses FormData because this request contains image uploads.
 * The Content-Type header is intentionally not set manually because the
 * browser automatically adds the correct multipart boundary.
 *
 * @param {string} pageKey - Page identifier or route key.
 * @param {File|File[]} desktopFiles - Desktop hero image file or files.
 * @param {File|File[]} [mobileFiles=[]] - Optional mobile hero image file or files.
 * @param {string} [alt=""] - Alt text to apply to uploaded hero images.
 * @returns {Promise<Object>} API response after successful upload.
 * @throws {Error} Throws an error if upload fails or files are too large.
 */
export const uploadPageHeroImages = async (
  pageKey,
  desktopFiles,
  mobileFiles = [],
  alt = "",
) => {
  const pk = pageKey.replace(/\//g, "~");
  const formData = new FormData();

  // Normalize desktop files into an array.
  const dArr = Array.isArray(desktopFiles) ? desktopFiles : [desktopFiles];

  // Normalize mobile files into an array while allowing an empty value.
  const mArr = Array.isArray(mobileFiles)
    ? mobileFiles
    : mobileFiles
      ? [mobileFiles]
      : [];

  // Add desktop hero images.
  dArr.forEach((file) => formData.append("pageHeroImages", file));

  // Add mobile hero images only when provided.
  mArr
    .filter(Boolean)
    .forEach((file) => formData.append("pageHeroImagesMobile", file));

  // Add shared alt text for the uploaded images.
  formData.append("alt", alt);

  try {
    const response = await fetch(`${API_BASE_URL}/page-heroes/${pk}/images`, {
      method: "POST",
      body: formData,
    });

    // Handle upload size errors separately for a clearer user message.
    if (response.status === 413) {
      throw new Error("Files are too large. Please reduce image size.");
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to upload hero images");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Updates the display order of hero images for a page.
 *
 * @param {string} pageKey - Page identifier or route key.
 * @param {Array<string|number>} orderedIds - Hero image IDs in the desired order.
 * @returns {Promise<Object>} API response after images are reordered.
 * @throws {Error} Throws an error if hero image reorder fails.
 */
export const reorderPageHeroImages = async (pageKey, orderedIds) => {
  const pk = pageKey.replace(/\//g, "~");

  try {
    const response = await fetch(
      `${API_BASE_URL}/page-heroes/${pk}/images/reorder`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to reorder hero images");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Updates a single hero image for a page.
 *
 * The payload may include text updates, status changes, desktop image
 * replacement, mobile image replacement, or mobile image removal.
 *
 * @param {string} pageKey - Page identifier or route key.
 * @param {string|number} imageId - Hero image ID to update.
 * @param {Object} payload - Hero image update values.
 * @param {string} [payload.alt] - Updated image alt text.
 * @param {boolean} [payload.isActive] - Whether the image should be active.
 * @param {File} [payload.file] - Replacement desktop image file.
 * @param {File} [payload.mobileFile] - Replacement mobile image file.
 * @param {boolean} [payload.removeMobile] - Whether to remove the current mobile image.
 * @returns {Promise<Object>} Updated hero image response data.
 * @throws {Error} Throws an error if the hero image cannot be updated.
 */
export const updatePageHeroImage = async (pageKey, imageId, payload) => {
  const pk = pageKey.replace(/\//g, "~");
  const formData = new FormData();

  // Add only fields that were explicitly provided.
  if (payload.alt !== undefined) formData.append("alt", payload.alt);

  if (payload.isActive !== undefined) {
    formData.append("isActive", payload.isActive);
  }

  if (payload.removeMobile) formData.append("removeMobile", "true");

  // Add replacement desktop image when provided.
  if (payload.file) formData.append("pageHeroImages", payload.file);

  // Add replacement mobile image when provided.
  if (payload.mobileFile) {
    formData.append("pageHeroImagesMobile", payload.mobileFile);
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/page-heroes/${pk}/images/${imageId}`,
      {
        method: "PATCH",
        body: formData,
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update hero image");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Deletes a single hero image from a page.
 *
 * @param {string} pageKey - Page identifier or route key.
 * @param {string|number} imageId - Hero image ID to delete.
 * @returns {Promise<Object>} API response after successful deletion.
 * @throws {Error} Throws an error if the hero image cannot be deleted.
 */
export const deletePageHeroImage = async (pageKey, imageId) => {
  const pk = pageKey.replace(/\//g, "~");

  try {
    const response = await fetch(
      `${API_BASE_URL}/page-heroes/${pk}/images/${imageId}`,
      {
        method: "DELETE",
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete hero image");
    }

    return data;
  } catch (error) {
    throw error;
  }
};
