// Access the environment variable in Vite
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const ADMIN_BASE_URL =
  import.meta.env.VITE_ADMIN_BASE_URL || "http://localhost:8000/admin";

export const api = {
  // 1. Fetch Trails (For ExploreOurTrails component)
  getTrails: async (category = "All") => {
    try {
      const url =
        category === "All"
          ? `${API_BASE_URL}/trails`
          : `${API_BASE_URL}/trails?category=${category}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch trails");
      return await response.json();
    } catch (error) {
      console.error("API Error (getTrails):", error);
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
};
