// Access the environment variable in Vite
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const ADMIN_BASE_URL =
  import.meta.env.VITE_ADMIN_BASE_URL || "http://localhost:8000/api/admin";

export const IMAGE_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL.replace("/api", "")
  : "http://localhost:8000";

const getAdminToken = () => {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem("adminToken");
};

const withAdminAuth = (headers = {}) => {
  const token = getAdminToken();
  if (!token) return headers;

  return {
    ...headers,
    Authorization: `Bearer ${token}`,
  };
};

export const api = {
  // 1. Fetch Trails (For ExploreOurTrails component)
  getTrails: async (category = "All", isAdmin = false) => {
    try {
      const params = new URLSearchParams();
      if (category !== "All") params.set("category", category);
      if (isAdmin) params.set("admin", "true");
      const url = `${API_BASE_URL}/trails${params.toString() ? "?" + params.toString() : ""}`;

      const response = await fetch(url, {
        headers: isAdmin ? withAdminAuth() : undefined,
      });
      if (!response.ok) throw new Error("Failed to fetch trails");
      return await response.json();
    } catch (error) {
      console.error("API Error (getTrails):", error);
      throw error;
    }
  },

  getTrailById: async (identifier, isAdmin = false) => {
    try {
      const suffix = isAdmin ? "?admin=true" : "";
      const response = await fetch(`${API_BASE_URL}/trails/${identifier}${suffix}`, {
        headers: isAdmin ? withAdminAuth() : undefined,
      });
      if (!response.ok) throw new Error("Failed to fetch trail details");
      return await response.json();
    } catch (error) {
      console.error("API Error (getTrailById):", error);
      throw error;
    }
  },

  // 2. Fetch Journeys (For your Journeys pages)
  getJourneys: async (category) => {
    try {
      const url = category
        ? `${API_BASE_URL}/journeys?category=${category}`
        : `${API_BASE_URL}/journeys`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch journeys");
      return await response.json();
    } catch (error) {
      console.error("API Error (getJourneys):", error);
      throw error;
    }
  },

  // 3. Submit Contact Form (For the /connect page)
  submitContact: async (formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to submit contact form");
      return await response.json();
    } catch (error) {
      console.error("API Error (submitContact):", error);
      throw error;
    }
  },

  // 4. Submit Enquiry Form (For the premium form)
  submitEnquiry: async (formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/enquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit enquiry");
      }
      return await response.json();
    } catch (error) {
      console.error("API Error (submitEnquiry):", error);
      throw error;
    }
  },

  // 5. Submit Referral Form
  submitReferral: async (referralData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/referrals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(referralData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit referral");
      }
      return await response.json();
    } catch (error) {
      console.error("API Error (submitReferral):", error);
      throw error;
    }
  },

  // 6. Submit Gift Form
  submitGift: async (giftData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/gifts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(giftData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit gift request");
      }
      return await response.json();
    } catch (error) {
      console.error("API Error (submitGift):", error);
      throw error;
    }
  },

  // --- ADMIN ROUTES ---
  adminLogin: async (credentials) => {
    try {
      const response = await fetch(`${ADMIN_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");
      return data;
    } catch (error) {
      console.error("API Error (adminLogin):", error);
      throw error;
    }
  },

  adminForgotPassword: async (email) => {
    try {
      const response = await fetch(`${ADMIN_BASE_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to send OTP");
      return data;
    } catch (error) {
      console.error("API Error (adminForgotPassword):", error);
      throw error;
    }
  },

  adminResetPassword: async (payload) => {
    try {
      const response = await fetch(`${ADMIN_BASE_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Invalid OTP");
      return data;
    } catch (error) {
      console.error("API Error (adminResetPassword):", error);
      throw error;
    }
  },

  // --- TRAILS ADMIN ROUTES ---
  previewTrailImageCompression: async (filesByField) => {
    const previewData = new FormData();

    Object.entries(filesByField).forEach(([field, value]) => {
      const files = Array.isArray(value) ? value : [value];
      files.filter(Boolean).forEach((file) => previewData.append(field, file));
    });

    if (![...previewData.keys()].length) {
      return { imageStats: [] };
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/trails/preview-image-stats`,
        {
          method: "POST",
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
  },

  createTrail: async (trailFormData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/trails`, {
        method: "POST",
        headers: withAdminAuth(),
        body: trailFormData,
      });

      if (response.status === 413) {
        throw new Error("Files are too large. Please upload smaller images (limit: 1MB on your VPS).");
      }

      let data;
      try {
        data = await response.json();
      } catch (err) {
        throw new Error(`Server error (${response.status}). If uploading images, they might be too large.`);
      }

      if (!response.ok) {
        console.error("API Error Response Data:", data);
        throw new Error(data.message || "Failed to create trail");
      }
      return data;
    } catch (error) {
      throw error;
    }
  },

  updateTrail: async (id, trailFormData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/trails/${id}`, {
        method: "PUT",
        headers: withAdminAuth(),
        body: trailFormData, // FormData handles Content-Type automatically
      });

      if (response.status === 413) {
        throw new Error("Files are too large. Please upload smaller images (limit: 1MB on your VPS).");
      }

      let data;
      try {
        data = await response.json();
      } catch (err) {
        throw new Error(`Server error (${response.status}). If uploading images, they might be too large.`);
      }

      if (!response.ok) {
        console.error("API Error Response Data:", data);
        throw new Error(data.message || "Failed to update trail");
      }
      return data;
    } catch (error) {
      throw error;
    }
  },

  deleteTrail: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/trails/${id}`, {
        method: "DELETE",
        headers: withAdminAuth(),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to delete trail");
      return data;
    } catch (error) {
      throw error;
    }
  },

  reorderTrails: async (items) => {
    try {
      const response = await fetch(`${API_BASE_URL}/trails/reorder`, {
        method: "PUT",
        headers: withAdminAuth({ "Content-Type": "application/json" }),
        body: JSON.stringify({ items }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to reorder trails");
      return data;
    } catch (error) {
      throw error;
    }
  },

  toggleTrailStatus: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/trails/${id}/toggle`, {
        method: "PATCH",
        headers: withAdminAuth(),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to toggle trail status");
      return data;
    } catch (error) {
      throw error;
    }
  },

  updateTrailItinerary: async (id, itinerary, mode = "save", optionalExperiences, flights) => {
    try {
      const response = await fetch(`${API_BASE_URL}/trails/${id}/itinerary`, {
        method: "PATCH",
        headers: withAdminAuth({ "Content-Type": "application/json" }),
        body: JSON.stringify({ itinerary, mode, optionalExperiences, flights }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to save itinerary");
      return data;
    } catch (error) {
      throw error;
    }
  },

  // --- DESTINATION ROUTES ---
  getDestinations: async (isAdmin = false) => {
    try {
      const url = isAdmin
        ? `${API_BASE_URL}/destinations?admin=true`
        : `${API_BASE_URL}/destinations`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch destinations");
      return await response.json();
    } catch (error) {
      console.error("API Error (getDestinations):", error);
      throw error;
    }
  },

  addDestination: async (formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/destinations`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to add destination");
      return data;
    } catch (error) {
      throw error;
    }
  },

  updateDestination: async (id, formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/destinations/${id}`, {
        method: "PUT",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to update destination");
      return data;
    } catch (error) {
      throw error;
    }
  },

  deleteDestination: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/destinations/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to delete destination");
      return data;
    } catch (error) {
      throw error;
    }
  },

  toggleDestinationStatus: async (id) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/destinations/${id}/toggle`,
        {
          method: "PATCH",
        },
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to toggle destination status");
      return data;
    } catch (error) {
      throw error;
    }
  },

  reorderDestinations: async (items) => {
    try {
      const response = await fetch(`${API_BASE_URL}/destinations/reorder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to reorder destinations");
      return data;
    } catch (error) {
      throw error;
    }
  },

  // --- PAGE HERO IMAGE ROUTES ---
  /** Fetch all pages (admin: full map + page keys) */
  getAllPageHeroes: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/page-heroes`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch page heroes");
      return data;
    } catch (error) {
      throw error;
    }
  },

  /** Fetch hero images for a specific page (public or admin) */
  getPageHeroImages: async (pageKey) => {
    try {
      const pk = pageKey.replace(/\//g, "~");
      const response = await fetch(`${API_BASE_URL}/page-heroes/${pk}?t=${Date.now()}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch page hero images");
      return data;
    } catch (error) {
      throw error;
    }
  },

  /** Preview compression stats without saving */
  previewPageHeroCompression: async (pageKey, files) => {
    const pk = pageKey.replace(/\//g, "~");
    const formData = new FormData();
    const fileArr = Array.isArray(files) ? files : [files];
    fileArr.filter(Boolean).forEach((f) => formData.append("pageHeroImages", f));
    if (![...formData.keys()].length) return { imageStats: [] };
    try {
      const response = await fetch(
        `${API_BASE_URL}/page-heroes/${pk}/preview-compression`,
        { method: "POST", body: formData }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to preview compression");
      return data;
    } catch (error) {
      throw error;
    }
  },

  /** Upload new hero images (appended). desktopFiles and mobileFiles paired by index. */
  uploadPageHeroImages: async (pageKey, desktopFiles, mobileFiles = [], alt = "") => {
    const pk = pageKey.replace(/\//g, "~");
    const formData = new FormData();
    const dArr = Array.isArray(desktopFiles) ? desktopFiles : [desktopFiles];
    const mArr = Array.isArray(mobileFiles)  ? mobileFiles  : (mobileFiles ? [mobileFiles] : []);
    dArr.forEach((f) => formData.append("pageHeroImages", f));
    mArr.filter(Boolean).forEach((f) => formData.append("pageHeroImagesMobile", f));
    formData.append("alt", alt);
    try {
      const response = await fetch(
        `${API_BASE_URL}/page-heroes/${pk}/images`,
        { method: "POST", body: formData }
      );
      if (response.status === 413)
        throw new Error("Files are too large. Please reduce image size.");
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to upload hero images");
      return data;
    } catch (error) {
      throw error;
    }
  },

  /** Reorder images for a page */
  reorderPageHeroImages: async (pageKey, orderedIds) => {
    const pk = pageKey.replace(/\//g, "~");
    try {
      const response = await fetch(
        `${API_BASE_URL}/page-heroes/${pk}/images/reorder`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderedIds }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to reorder hero images");
      return data;
    } catch (error) {
      throw error;
    }
  },

  /** Edit a single image.
   *  payload: { alt?, isActive?, file? (desktop), mobileFile?, removeMobile? }
   */
  updatePageHeroImage: async (pageKey, imageId, payload) => {
    const pk = pageKey.replace(/\//g, "~");
    const formData = new FormData();
    if (payload.alt      !== undefined) formData.append("alt",           payload.alt);
    if (payload.isActive !== undefined) formData.append("isActive",      payload.isActive);
    if (payload.removeMobile)           formData.append("removeMobile",  "true");
    if (payload.file)                   formData.append("pageHeroImages",       payload.file);
    if (payload.mobileFile)             formData.append("pageHeroImagesMobile", payload.mobileFile);
    try {
      const response = await fetch(
        `${API_BASE_URL}/page-heroes/${pk}/images/${imageId}`,
        { method: "PATCH", body: formData }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update hero image");
      return data;
    } catch (error) {
      throw error;
    }
  },

  /** Delete a single image */
  deletePageHeroImage: async (pageKey, imageId) => {
    const pk = pageKey.replace(/\//g, "~");
    try {
      const response = await fetch(
        `${API_BASE_URL}/page-heroes/${pk}/images/${imageId}`,
        { method: "DELETE" }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete hero image");
      return data;
    } catch (error) {
      throw error;
    }
  },

  // --- NEWSLETTER ROUTES ---
  subscribeNewsletter: async (subscriberData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscriberData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to subscribe");
      return data;
    } catch (error) {
      console.error("API Error (subscribeNewsletter):", error);
      throw error;
    }
  },

  unsubscribeNewsletter: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/newsletter/unsubscribe/${token}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to unsubscribe");
      return data;
    } catch (error) {
      console.error("API Error (unsubscribeNewsletter):", error);
      throw error;
    }
  },
};
