import { API_BASE_URL, withAdminAuth } from "./config";

/**
 * Submits contact form data to the backend.
 *
 * @param {Object} formData - Contact form values entered by the user.
 * @returns {Promise<Object>} API response after successful submission.
 * @throws {Error} Throws an error if the contact form submission fails.
 */
export const submitContact = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    // Stop execution if the API returns an unsuccessful response.
    if (!response.ok) throw new Error("Failed to submit contact form");

    return await response.json();
  } catch (error) {
    console.error("API Error (submitContact):", error);
    throw error;
  }
};

/**
 * Submits an enquiry form to the backend.
 *
 * @param {Object} formData - Enquiry form values entered by the user.
 * @returns {Promise<Object>} API response after successful enquiry submission.
 * @throws {Error} Throws an error if the enquiry submission fails.
 */
export const submitEnquiry = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/enquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      // Read the backend error message when available.
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to submit enquiry");
    }

    return await response.json();
  } catch (error) {
    console.error("API Error (submitEnquiry):", error);
    throw error;
  }
};

/**
 * Submits referral form data to the backend.
 *
 * @param {Object} referralData - Referral form values entered by the user.
 * @returns {Promise<Object>} API response after successful referral submission.
 * @throws {Error} Throws an error if the referral submission fails.
 */
export const submitReferral = async (referralData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/referrals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(referralData),
    });

    if (!response.ok) {
      // Use the API-provided error message if one exists.
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to submit referral");
    }

    return await response.json();
  } catch (error) {
    console.error("API Error (submitReferral):", error);
    throw error;
  }
};

/**
 * Submits gift request data to the backend.
 *
 * @param {Object} giftData - Gift request form values entered by the user.
 * @returns {Promise<Object>} API response after successful gift request submission.
 * @throws {Error} Throws an error if the gift request submission fails.
 */
export const submitGift = async (giftData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/gifts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(giftData),
    });

    if (!response.ok) {
      // Read detailed validation or server error message from the backend.
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to submit gift request");
    }

    return await response.json();
  } catch (error) {
    console.error("API Error (submitGift):", error);
    throw error;
  }
};

/**
 * Fetches the connect page content from the backend.
 *
 * @returns {Promise<Object>} Connect page data.
 * @throws {Error} Throws an error if the connect page cannot be fetched.
 */
export const getConnectPage = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/connect-page`);

    if (!response.ok) throw new Error("Failed to fetch connect page");

    return await response.json();
  } catch (error) {
    console.error("API Error (getConnectPage):", error);
    throw error;
  }
};

/**
 * Updates connect page content from the admin panel.
 *
 * Uses FormData because the connect page update may include uploaded files,
 * such as images. The Content-Type header is intentionally not set manually,
 * because the browser automatically adds the correct multipart boundary.
 *
 * @param {FormData} formData - Connect page fields and uploaded files.
 * @returns {Promise<Object>} Updated connect page response data.
 * @throws {Error} Throws an error if the update fails or uploaded files are too large.
 */
export const updateConnectPage = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/connect-page`, {
      method: "PUT",
      // Adds admin authorization headers for protected update access.
      headers: withAdminAuth(),
      body: formData,
    });

    // Handle payload size errors separately for a clearer user message.
    if (response.status === 413) {
      throw new Error("Files are too large. Please upload smaller files.");
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update connect page");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Sends selected connect page images to the backend for compression preview.
 *
 * This does not update the page. It only returns image compression statistics,
 * such as estimated compressed size or optimization details.
 *
 * @param {Object} filesByField - Object where each key is a form field name and each value is a File or array of Files.
 * @returns {Promise<Object>} Image compression preview data.
 * @throws {Error} Throws an error if the compression preview request fails.
 */
export const previewConnectPageImageCompression = async (filesByField) => {
  const previewData = new FormData();

  // Convert each field value into one or more files and append them to FormData.
  Object.entries(filesByField).forEach(([field, value]) => {
    const files = Array.isArray(value) ? value : [value];

    files.filter(Boolean).forEach((file) => previewData.append(field, file));
  });

  // Avoid sending an empty request when no files are selected.
  if (![...previewData.keys()].length) {
    return { imageStats: [] };
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/connect-page/preview-image-stats`,
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
