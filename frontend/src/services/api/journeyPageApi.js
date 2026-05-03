import { API_BASE_URL, withAdminAuth } from "./config";

/**
 * Fetches Journey page content from the backend.
 *
 * @returns {Promise<Object>} Journey page data returned by the API.
 * @throws {Error} Throws an error if Journey page data cannot be fetched.
 */
export const getJourneyPage = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/journey-page`);

    if (!response.ok) throw new Error("Failed to fetch Journey page data");

    return await response.json();
  } catch (error) {
    console.error("API Error (getJourneyPage):", error);
    throw error;
  }
};

/**
 * Updates the Journey page hero section from the admin panel.
 *
 * This section uses JSON because it usually contains text-based content,
 * such as headings, descriptions, CTA labels, or related configuration.
 *
 * @param {Object} data - Updated hero section data.
 * @returns {Promise<Object>} Updated hero section response data.
 * @throws {Error} Throws an error if the hero section update fails.
 */
export const updateJourneyHeroSection = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/journey-page/hero`, {
      method: "PUT",
      // Sends JSON data and includes admin authorization.
      headers: withAdminAuth({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    });

    const resData = await response.json();

    if (!response.ok) {
      throw new Error(resData.message || "Failed to update Hero section");
    }

    return resData;
  } catch (error) {
    console.error("API Error (updateJourneyHeroSection):", error);
    throw error;
  }
};

/**
 * Updates the Signature Journeys section on the Journey page.
 *
 * @param {Object} data - Updated Signature Journeys section data.
 * @returns {Promise<Object>} Updated Signature Journeys section response data.
 * @throws {Error} Throws an error if the section update fails.
 */
export const updateJourneySignatureSection = async (data) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/journey-page/signature-journeys`,
      {
        method: "PUT",
        // Sends JSON data and includes admin authorization.
        headers: withAdminAuth({ "Content-Type": "application/json" }),
        body: JSON.stringify(data),
      },
    );

    const resData = await response.json();

    if (!response.ok) {
      throw new Error(
        resData.message || "Failed to update Signature Journeys section",
      );
    }

    return resData;
  } catch (error) {
    console.error("API Error (updateJourneySignatureSection):", error);
    throw error;
  }
};

/**
 * Updates the Our Trails section on the Journey page.
 *
 * Uses FormData because this section may include uploaded media files,
 * such as trail images. The Content-Type header is intentionally not set
 * manually because the browser automatically adds the multipart boundary.
 *
 * @param {FormData} formData - Updated Our Trails section fields and files.
 * @returns {Promise<Object>} Updated Our Trails section response data.
 * @throws {Error} Throws an error if the section update fails.
 */
export const updateJourneyOurTrailsSection = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/journey-page/our-trails`, {
      method: "PUT",
      // Adds admin authorization headers for protected update access.
      headers: withAdminAuth(),
      body: formData,
    });

    const resData = await response.json();

    if (!response.ok) {
      throw new Error(resData.message || "Failed to update Our Trails section");
    }

    return resData;
  } catch (error) {
    console.error("API Error (updateJourneyOurTrailsSection):", error);
    throw error;
  }
};

/**
 * Updates the Our Destinations section on the Journey page.
 *
 * This section uses JSON because it usually contains structured destination
 * content or configuration rather than direct file uploads.
 *
 * @param {Object} data - Updated Our Destinations section data.
 * @returns {Promise<Object>} Updated Our Destinations section response data.
 * @throws {Error} Throws an error if the section update fails.
 */
export const updateJourneyOurDestinationsSection = async (data) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/journey-page/our-destinations`,
      {
        method: "PUT",
        // Sends JSON data and includes admin authorization.
        headers: withAdminAuth({ "Content-Type": "application/json" }),
        body: JSON.stringify(data),
      },
    );

    const resData = await response.json();

    if (!response.ok) {
      throw new Error(
        resData.message || "Failed to update Our Destinations section",
      );
    }

    return resData;
  } catch (error) {
    console.error("API Error (updateJourneyOurDestinationsSection):", error);
    throw error;
  }
};

/**
 * Updates the Payana Journey section on the Journey page.
 *
 * Uses FormData because this section may include uploaded media files.
 * The Content-Type header is intentionally not set manually because the
 * browser automatically adds the correct multipart boundary.
 *
 * @param {FormData} formData - Updated Payana Journey section fields and files.
 * @returns {Promise<Object>} Updated Payana Journey section response data.
 * @throws {Error} Throws an error if the section update fails.
 */
export const updateJourneyPayanaJourneySection = async (formData) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/journey-page/payana-journey`,
      {
        method: "PUT",
        // Adds admin authorization headers for protected update access.
        headers: withAdminAuth(),
        body: formData,
      },
    );

    const resData = await response.json();

    if (!response.ok) {
      throw new Error(
        resData.message || "Failed to update Payana Journey section",
      );
    }

    return resData;
  } catch (error) {
    console.error("API Error (updateJourneyPayanaJourneySection):", error);
    throw error;
  }
};
