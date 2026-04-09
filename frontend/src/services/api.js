// Access the environment variable in Vite
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const ADMIN_BASE_URL =
  import.meta.env.VITE_ADMIN_BASE_URL || "http://localhost:8000/admin";

export const IMAGE_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL.replace("/api", "")
  : "http://localhost:8000";

export const api = {
  // 1. Fetch Trails (For ExploreOurTrails component)
  getTrails: async (category = "All", isAdmin = false) => {
    try {
      const params = new URLSearchParams();
      if (category !== "All") params.set("category", category);
      if (isAdmin) params.set("admin", "true");
      const url = `${API_BASE_URL}/trails${params.toString() ? "?" + params.toString() : ""}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch trails");
      return await response.json();
    } catch (error) {
      console.error("API Error (getTrails):", error);
      throw error;
    }
  },

  getTrailById: async (id, isAdmin = false) => {
    try {
      const suffix = isAdmin ? "?admin=true" : "";
      const response = await fetch(`${API_BASE_URL}/trails/${id}${suffix}`);
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
        body: trailFormData,
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to create trail");
      return data;
    } catch (error) {
      throw error;
    }
  },

  updateTrail: async (id, trailFormData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/trails/${id}`, {
        method: "PUT",
        body: trailFormData, // FormData handles Content-Type automatically
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to update trail");
      return data;
    } catch (error) {
      throw error;
    }
  },

  deleteTrail: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/trails/${id}`, {
        method: "DELETE",
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
        headers: { "Content-Type": "application/json" },
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
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to toggle trail status");
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
};
