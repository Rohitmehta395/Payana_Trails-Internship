import { API_BASE_URL, withAdminAuth } from "./config";

/**
 * Uploads one or more testimonial images for the home page.
 *
 * Uses FormData because this request includes image files and may also
 * include extra metadata such as alt text, title, status, or ordering values.
 * The Content-Type header is intentionally not set manually because the
 * browser automatically adds the correct multipart boundary.
 *
 * @param {File|File[]} files - Single testimonial image file or array of files.
 * @param {Object} [extraData={}] - Additional testimonial fields to send with the upload.
 * @returns {Promise<Object>} API response after successful testimonial upload.
 * @throws {Error} Throws an error if upload fails or files are too large.
 */
export const uploadTestimonialImages = async (files, extraData = {}) => {
  try {
    const formData = new FormData();

    // Normalize a single file or multiple files into an array.
    const fileArr = Array.isArray(files) ? files : [files];

    // Add testimonial image files using the field name expected by the backend.
    fileArr.forEach((file) => formData.append("testimonialImages", file));

    // Add optional metadata fields when they have valid values.
    Object.entries(extraData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    const response = await fetch(`${API_BASE_URL}/home-page/testimonials`, {
      method: "POST",
      // Adds admin authorization headers for protected upload access.
      headers: withAdminAuth(),
      body: formData,
    });

    // Handle payload size errors separately for a clearer user message.
    if (response.status === 413) {
      throw new Error("Files are too large. Max size is 20MB.");
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to upload testimonials");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Updates the display order of testimonial images.
 *
 * @param {Array<string|number>} orderedIds - Testimonial image IDs in the desired order.
 * @returns {Promise<Object>} API response after testimonials are reordered.
 * @throws {Error} Throws an error if testimonials cannot be reordered.
 */
export const reorderTestimonials = async (orderedIds) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/home-page/testimonials/reorder`,
      {
        method: "PUT",
        // Reorder data is sent as JSON and requires admin authorization.
        headers: withAdminAuth({ "Content-Type": "application/json" }),
        body: JSON.stringify({ orderedIds }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to reorder testimonials");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Deletes a testimonial image by ID.
 *
 * @param {string|number} imageId - Testimonial image ID to delete.
 * @returns {Promise<Object>} API response after successful deletion.
 * @throws {Error} Throws an error if the testimonial image cannot be deleted.
 */
export const deleteTestimonialImage = async (imageId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/home-page/testimonials/${imageId}`,
      {
        method: "DELETE",
        // Adds admin authorization headers for protected delete access.
        headers: withAdminAuth(),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete testimonial image");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Updates a testimonial image or its metadata.
 *
 * Supports both FormData and plain object payloads:
 * - FormData is used when replacing an image file.
 * - JSON is used when updating metadata only.
 *
 * @param {string|number} imageId - Testimonial image ID to update.
 * @param {FormData|Object} payload - Updated image file or metadata fields.
 * @returns {Promise<Object>} Updated testimonial image response data.
 * @throws {Error} Throws an error if the testimonial image cannot be updated.
 */
export const updateTestimonialImage = async (imageId, payload) => {
  try {
    const isFormData = payload instanceof FormData;
    const headers = withAdminAuth();

    // Only set Content-Type manually for JSON payloads.
    // FormData must let the browser set the multipart boundary.
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(
      `${API_BASE_URL}/home-page/testimonials/${imageId}`,
      {
        method: "PUT",
        headers,
        body: isFormData ? payload : JSON.stringify(payload),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update testimonial image");
    }

    return data;
  } catch (error) {
    throw error;
  }
};
