import { API_BASE_URL, withAdminAuth } from "./config";

/**
 * Fetches the Stories page content from the backend.
 *
 * @returns {Promise<Object>} Stories page data returned by the API.
 * @throws {Error} Throws an error if Stories page data cannot be fetched.
 */
export const getStoriesPage = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/stories`);

    if (!response.ok) throw new Error("Failed to fetch stories page data");

    return await response.json();
  } catch (error) {
    console.error("API Error (getStoriesPage):", error);
    throw error;
  }
};

/**
 * Updates the Travel Stories section on the Stories page.
 *
 * Uses FormData because this section may include uploaded media files.
 * The Content-Type header is intentionally not set manually because the
 * browser automatically adds the correct multipart boundary.
 *
 * @param {FormData} formData - Updated Travel Stories section fields and files.
 * @returns {Promise<Object>} Updated section response data.
 * @throws {Error} Throws an error if the section update fails.
 */
export const updateTravelStoriesSection = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/stories/travel-stories`, {
      method: "PUT",
      // Adds admin authorization headers for protected update access.
      headers: withAdminAuth(),
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to update Travel Stories section",
      );
    }

    return data;
  } catch (error) {
    console.error("API Error (updateTravelStoriesSection):", error);
    throw error;
  }
};

/**
 * Updates the Voices section on the Stories page.
 *
 * @param {FormData} formData - Updated Voices section fields and files.
 * @returns {Promise<Object>} Updated section response data.
 * @throws {Error} Throws an error if the section update fails.
 */
export const updateVoicesSection = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/stories/voices-section`, {
      method: "PUT",
      // Adds admin authorization headers for protected update access.
      headers: withAdminAuth(),
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update Voices section");
    }

    return data;
  } catch (error) {
    console.error("API Error (updateVoicesSection):", error);
    throw error;
  }
};

/**
 * Updates the Newsletter section on the Stories page.
 *
 * @param {FormData} formData - Updated Newsletter section fields and files.
 * @returns {Promise<Object>} Updated section response data.
 * @throws {Error} Throws an error if the section update fails.
 */
export const updateNewsletterSection = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/stories/newsletter-section`, {
      method: "PUT",
      // Adds admin authorization headers for protected update access.
      headers: withAdminAuth(),
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update Newsletter section");
    }

    return data;
  } catch (error) {
    console.error("API Error (updateNewsletterSection):", error);
    throw error;
  }
};

/**
 * Updates the Guest Stories section on the Stories page.
 *
 * @param {FormData} formData - Updated Guest Stories section fields and files.
 * @returns {Promise<Object>} Updated section response data.
 * @throws {Error} Throws an error if the section update fails.
 */
export const updateGuestStoriesSection = async (formData) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/stories/guest-stories-section`,
      {
        method: "PUT",
        // Adds admin authorization headers for protected update access.
        headers: withAdminAuth(),
        body: formData,
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update Guest Stories section");
    }

    return data;
  } catch (error) {
    console.error("API Error (updateGuestStoriesSection):", error);
    throw error;
  }
};

/**
 * Fetches public blogs with optional filters and pagination.
 *
 * Supported filters include category, destination, featured status,
 * page number, result limit, and whether to fetch all records.
 *
 * @param {Object} [params={}] - Optional blog query parameters.
 * @param {string} [params.category] - Blog category filter.
 * @param {string} [params.destination] - Destination filter.
 * @param {boolean} [params.featured] - Whether to fetch only featured blogs.
 * @param {number|string} [params.page] - Page number for pagination.
 * @param {number|string} [params.limit] - Number of blogs per page.
 * @param {boolean} [params.all] - Whether to request all blogs.
 * @returns {Promise<Object>} Blog list returned by the API.
 * @throws {Error} Throws an error if blogs cannot be fetched.
 */
export const getBlogs = async (params = {}) => {
  try {
    const query = new URLSearchParams();

    // Add only query parameters that were provided.
    if (params.category) query.set("category", params.category);
    if (params.destination) query.set("destination", params.destination);
    if (params.featured) query.set("featured", "true");
    if (params.page) query.set("page", params.page);
    if (params.limit) query.set("limit", params.limit);
    if (params.all) query.set("all", "true");

    const url = `${API_BASE_URL}/stories/blogs${
      query.toString() ? "?" + query.toString() : ""
    }`;

    const response = await fetch(url);

    if (!response.ok) throw new Error("Failed to fetch blogs");

    return await response.json();
  } catch (error) {
    console.error("API Error (getBlogs):", error);
    throw error;
  }
};

/**
 * Fetches blogs for the admin panel.
 *
 * Admin requests include authentication headers and may return inactive,
 * draft, or otherwise hidden blog records depending on backend behavior.
 *
 * @param {Object} [params={}] - Optional admin blog query parameters.
 * @param {string} [params.category] - Blog category filter.
 * @returns {Promise<Object>} Admin blog list returned by the API.
 * @throws {Error} Throws an error if admin blogs cannot be fetched.
 */
export const getBlogsAdmin = async (params = {}) => {
  try {
    const query = new URLSearchParams();

    if (params.category) query.set("category", params.category);

    const url = `${API_BASE_URL}/stories/blogs/admin${
      query.toString() ? "?" + query.toString() : ""
    }`;

    const response = await fetch(url, {
      // Adds admin authorization headers for protected admin access.
      headers: withAdminAuth(),
    });

    if (!response.ok) throw new Error("Failed to fetch admin blogs");

    return await response.json();
  } catch (error) {
    console.error("API Error (getBlogsAdmin):", error);
    throw error;
  }
};

/**
 * Fetches a single blog using its URL slug.
 *
 * @param {string} slug - Blog slug used in the public URL.
 * @returns {Promise<Object>} Blog data returned by the API.
 * @throws {Error} Throws an error if the blog cannot be fetched.
 */
export const getBlogBySlug = async (slug) => {
  try {
    const response = await fetch(`${API_BASE_URL}/stories/blogs/slug/${slug}`);

    if (!response.ok) throw new Error("Failed to fetch blog");

    return await response.json();
  } catch (error) {
    console.error("API Error (getBlogBySlug):", error);
    throw error;
  }
};

/**
 * Creates a new blog from the admin panel.
 *
 * Uses FormData because a blog may include uploaded images,
 * cover media, or other file fields.
 *
 * @param {FormData} formData - Blog fields and uploaded files.
 * @returns {Promise<Object>} Newly created blog response data.
 * @throws {Error} Throws an error if the blog cannot be created.
 */
export const createBlog = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/stories/blogs`, {
      method: "POST",
      // Adds admin authorization headers for protected create access.
      headers: withAdminAuth(),
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create blog");
    }

    return data;
  } catch (error) {
    console.error("API Error (createBlog):", error);
    throw error;
  }
};

/**
 * Updates an existing blog by ID from the admin panel.
 *
 * Uses FormData because the update may include text fields and uploaded files.
 *
 * @param {string|number} id - Blog ID to update.
 * @param {FormData} formData - Updated blog fields and uploaded files.
 * @returns {Promise<Object>} Updated blog response data.
 * @throws {Error} Throws an error if the blog cannot be updated.
 */
export const updateBlog = async (id, formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/stories/blogs/${id}`, {
      method: "PUT",
      // Adds admin authorization headers for protected update access.
      headers: withAdminAuth(),
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update blog");
    }

    return data;
  } catch (error) {
    console.error("API Error (updateBlog):", error);
    throw error;
  }
};

/**
 * Deletes a blog by ID from the admin panel.
 *
 * @param {string|number} id - Blog ID to delete.
 * @returns {Promise<Object>} API response after successful deletion.
 * @throws {Error} Throws an error if the blog cannot be deleted.
 */
export const deleteBlog = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/stories/blogs/${id}`, {
      method: "DELETE",
      // Adds admin authorization headers for protected delete access.
      headers: withAdminAuth(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete blog");
    }

    return data;
  } catch (error) {
    console.error("API Error (deleteBlog):", error);
    throw error;
  }
};

/**
 * Updates the display order of blogs from the admin panel.
 *
 * @param {Array<Object>} items - Ordered blog items, usually containing IDs and sort positions.
 * @returns {Promise<Object>} API response after blogs are reordered.
 * @throws {Error} Throws an error if blogs cannot be reordered.
 */
export const reorderBlogs = async (items) => {
  try {
    const response = await fetch(`${API_BASE_URL}/stories/blogs/reorder`, {
      method: "PUT",
      // Reorder data is sent as JSON and requires admin authorization.
      headers: withAdminAuth({ "Content-Type": "application/json" }),
      body: JSON.stringify({ items }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to reorder blogs");
    }

    return data;
  } catch (error) {
    console.error("API Error (reorderBlogs):", error);
    throw error;
  }
};

/**
 * Autosaves draft blog data for an existing blog.
 *
 * This is useful for preserving unsaved editor changes without publishing
 * or fully updating the blog record.
 *
 * @param {string|number} id - Blog ID to autosave.
 * @param {Object} draftData - Draft blog data to save.
 * @returns {Promise<Object>} Autosave response data.
 * @throws {Error} Throws an error if the autosave request fails.
 */
export const autosaveBlog = async (id, draftData) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/stories/blogs/${id}/autosave`,
      {
        method: "PATCH",
        // Draft data is sent as JSON and requires admin authorization.
        headers: withAdminAuth({ "Content-Type": "application/json" }),
        body: JSON.stringify({ draftData }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to autosave blog");
    }

    return data;
  } catch (error) {
    console.error("API Error (autosaveBlog):", error);
    throw error;
  }
};

/**
 * Uploads an image from the blog editor.
 *
 * The uploaded image is associated with the blog identified by its slug
 * and can be inserted into rich text/editor content.
 *
 * @param {string} slug - Blog slug used to associate the image with a blog.
 * @param {File} file - Image file selected in the editor.
 * @returns {Promise<Object>} Uploaded image response data.
 * @throws {Error} Throws an error if the image upload fails.
 */
export const uploadBlogEditorImage = async (slug, file) => {
  try {
    const formData = new FormData();

    // Add the editor image file using the field name expected by the backend.
    formData.append("image", file);

    const response = await fetch(
      `${API_BASE_URL}/stories/blogs/editor-image/${slug}`,
      {
        method: "POST",
        // Adds admin authorization headers for protected upload access.
        headers: withAdminAuth(),
        body: formData,
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to upload editor image");
    }

    return data;
  } catch (error) {
    console.error("API Error (uploadBlogEditorImage):", error);
    throw error;
  }
};

/**
 * Fetches public external stories with optional filters and pagination.
 *
 * @param {Object} [params={}] - Optional external story query parameters.
 * @param {string} [params.category] - External story category filter.
 * @param {string} [params.destination] - Destination filter.
 * @param {number|string} [params.page] - Page number for pagination.
 * @param {number|string} [params.limit] - Number of records per page.
 * @param {boolean} [params.all] - Whether to request all external stories.
 * @returns {Promise<Object>} External story list returned by the API.
 * @throws {Error} Throws an error if external stories cannot be fetched.
 */
export const getExternalStories = async (params = {}) => {
  try {
    const query = new URLSearchParams();

    // Add only query parameters that were provided.
    if (params.category) query.set("category", params.category);
    if (params.destination) query.set("destination", params.destination);
    if (params.page) query.set("page", params.page);
    if (params.limit) query.set("limit", params.limit);
    if (params.all) query.set("all", "true");

    const url = `${API_BASE_URL}/external-stories${
      query.toString() ? "?" + query.toString() : ""
    }`;

    const response = await fetch(url);

    if (!response.ok) throw new Error("Failed to fetch external stories");

    return await response.json();
  } catch (error) {
    console.error("API Error (getExternalStories):", error);
    throw error;
  }
};

/**
 * Fetches external stories for the admin panel.
 *
 * Admin requests include authentication headers and may return records
 * that are hidden, inactive, or unavailable in the public endpoint.
 *
 * @param {Object} [params={}] - Optional admin external story query parameters.
 * @param {string} [params.category] - External story category filter.
 * @returns {Promise<Object>} Admin external story list returned by the API.
 * @throws {Error} Throws an error if admin external stories cannot be fetched.
 */
export const getExternalStoriesAdmin = async (params = {}) => {
  try {
    const query = new URLSearchParams();

    if (params.category) query.set("category", params.category);

    const url = `${API_BASE_URL}/external-stories/admin${
      query.toString() ? "?" + query.toString() : ""
    }`;

    const response = await fetch(url, {
      // Adds admin authorization headers for protected admin access.
      headers: withAdminAuth(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch admin external stories");
    }

    return await response.json();
  } catch (error) {
    console.error("API Error (getExternalStoriesAdmin):", error);
    throw error;
  }
};

/**
 * Creates a new external story from the admin panel.
 *
 * Uses FormData because an external story may include uploaded images,
 * logos, thumbnails, or other media fields.
 *
 * @param {FormData} formData - External story fields and uploaded files.
 * @returns {Promise<Object>} Newly created external story response data.
 * @throws {Error} Throws an error if the external story cannot be created.
 */
export const createExternalStory = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/external-stories`, {
      method: "POST",
      // Adds admin authorization headers for protected create access.
      headers: withAdminAuth(),
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create external story");
    }

    return data;
  } catch (error) {
    console.error("API Error (createExternalStory):", error);
    throw error;
  }
};

/**
 * Updates an existing external story by ID from the admin panel.
 *
 * @param {string|number} id - External story ID to update.
 * @param {FormData} formData - Updated external story fields and files.
 * @returns {Promise<Object>} Updated external story response data.
 * @throws {Error} Throws an error if the external story cannot be updated.
 */
export const updateExternalStory = async (id, formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/external-stories/${id}`, {
      method: "PUT",
      // Adds admin authorization headers for protected update access.
      headers: withAdminAuth(),
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update external story");
    }

    return data;
  } catch (error) {
    console.error("API Error (updateExternalStory):", error);
    throw error;
  }
};

/**
 * Deletes an external story by ID from the admin panel.
 *
 * @param {string|number} id - External story ID to delete.
 * @returns {Promise<Object>} API response after successful deletion.
 * @throws {Error} Throws an error if the external story cannot be deleted.
 */
export const deleteExternalStory = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/external-stories/${id}`, {
      method: "DELETE",
      // Adds admin authorization headers for protected delete access.
      headers: withAdminAuth(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete external story");
    }

    return data;
  } catch (error) {
    console.error("API Error (deleteExternalStory):", error);
    throw error;
  }
};

/**
 * Updates the display order of external stories from the admin panel.
 *
 * @param {Array<Object>} items - Ordered external story items, usually containing IDs and sort positions.
 * @returns {Promise<Object>} API response after external stories are reordered.
 * @throws {Error} Throws an error if external stories cannot be reordered.
 */
export const reorderExternalStories = async (items) => {
  try {
    const response = await fetch(`${API_BASE_URL}/external-stories/reorder`, {
      method: "PUT",
      // Reorder data is sent as JSON and requires admin authorization.
      headers: withAdminAuth({ "Content-Type": "application/json" }),
      body: JSON.stringify({ items }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to reorder external stories");
    }

    return data;
  } catch (error) {
    console.error("API Error (reorderExternalStories):", error);
    throw error;
  }
};

/**
 * Autosaves draft data for an existing external story.
 *
 * This preserves unsaved editor changes without fully updating or publishing
 * the external story.
 *
 * @param {string|number} id - External story ID to autosave.
 * @param {Object} draftData - Draft external story data to save.
 * @returns {Promise<Object>} Autosave response data.
 * @throws {Error} Throws an error if the autosave request fails.
 */
export const autosaveExternalStory = async (id, draftData) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/external-stories/${id}/autosave`,
      {
        method: "PATCH",
        // Draft data is sent as JSON and requires admin authorization.
        headers: withAdminAuth({ "Content-Type": "application/json" }),
        body: JSON.stringify({ draftData }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to autosave external story");
    }

    return data;
  } catch (error) {
    console.error("API Error (autosaveExternalStory):", error);
    throw error;
  }
};
