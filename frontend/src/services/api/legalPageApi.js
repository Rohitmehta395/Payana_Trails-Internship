import { API_BASE_URL, withAdminAuth } from "./config";

export const getLegalSections = async (type, isAdmin = false) => {
  try {
    const url = isAdmin
      ? `${API_BASE_URL}/legal-sections/${type}?admin=true`
      : `${API_BASE_URL}/legal-sections/${type}`;

    const options = isAdmin ? { headers: withAdminAuth() } : {};
    const response = await fetch(url, options);

    if (!response.ok) throw new Error("Failed to fetch legal sections");

    return await response.json();
  } catch (error) {
    console.error("API Error (getLegalSections):", error);
    throw error;
  }
};

export const createLegalSection = async (type, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/legal-sections/${type}`, {
      method: "POST",
      headers: withAdminAuth({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    });

    const resData = await response.json();

    if (!response.ok) {
      throw new Error(resData.message || "Failed to create section");
    }

    return resData;
  } catch (error) {
    throw error;
  }
};

export const updateLegalSection = async (type, id, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/legal-sections/${type}/${id}`, {
      method: "PUT",
      headers: withAdminAuth({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    });

    const resData = await response.json();

    if (!response.ok) {
      throw new Error(resData.message || "Failed to update section");
    }

    return resData;
  } catch (error) {
    throw error;
  }
};

export const deleteLegalSection = async (type, id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/legal-sections/${type}/${id}`, {
      method: "DELETE",
      headers: withAdminAuth(),
    });

    const resData = await response.json();

    if (!response.ok) {
      throw new Error(resData.message || "Failed to delete section");
    }

    return resData;
  } catch (error) {
    throw error;
  }
};

export const reorderLegalSections = async (type, payload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/legal-sections/${type}/reorder`, {
      method: "PUT",
      headers: withAdminAuth({ "Content-Type": "application/json" }),
      body: JSON.stringify(payload),
    });

    const resData = await response.json();

    if (!response.ok) {
      throw new Error(resData.message || "Failed to reorder sections");
    }

    return resData;
  } catch (error) {
    throw error;
  }
};

export const toggleLegalSectionStatus = async (type, id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/legal-sections/${type}/${id}/toggle`, {
      method: "PATCH",
      headers: withAdminAuth(),
    });

    const resData = await response.json();

    if (!response.ok) {
      throw new Error(resData.message || "Failed to toggle section");
    }

    return resData;
  } catch (error) {
    throw error;
  }
};
