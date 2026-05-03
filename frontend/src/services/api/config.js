/**
 * Base API URL for public/user-facing API requests.
 *
 * Uses the Vite environment variable when available.
 * Falls back to the local backend API during development.
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

/**
 * Base API URL for admin-specific API requests.
 *
 * Uses the Vite admin environment variable when available.
 * Falls back to the local admin API during development.
 */
export const ADMIN_BASE_URL =
  import.meta.env.VITE_ADMIN_BASE_URL || "http://localhost:8000/api/admin";

/**
 * Base URL for loading uploaded/static images.
 *
 * If VITE_API_BASE_URL is available, remove the `/api` suffix
 * so images can be requested from the backend root URL.
 */
export const IMAGE_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL.replace("/api", "")
  : "http://localhost:8000";

/**
 * Reads the admin authentication token from session storage.
 *
 * The window check prevents errors during server-side rendering
 * or environments where browser APIs are unavailable.
 *
 * @returns {string|null} Admin token if available, otherwise null.
 */
export const getAdminToken = () => {
  if (typeof window === "undefined") return null;

  return window.sessionStorage.getItem("adminToken");
};

/**
 * Adds the admin Authorization header to a request header object.
 *
 * If no admin token exists, the original headers are returned unchanged.
 *
 * @param {Object} headers - Existing request headers.
 * @returns {Object} Headers with Authorization added when a token exists.
 */
export const withAdminAuth = (headers = {}) => {
  const token = getAdminToken();

  // Return the original headers when the admin is not authenticated.
  if (!token) return headers;

  return {
    ...headers,
    Authorization: `Bearer ${token}`,
  };
};

/**
 * Extracts a file name from the Content-Disposition response header.
 *
 * Supports both:
 * - UTF-8 encoded filenames, for example: filename*=UTF-8''report.csv
 * - Plain filenames, for example: filename="report.csv"
 *
 * Falls back to the provided default file name when no valid filename exists.
 *
 * @param {string|null} contentDisposition - Content-Disposition header value.
 * @param {string} fallbackFileName - Default file name to use if extraction fails.
 * @returns {string} Extracted or fallback file name.
 */
export const getFileNameFromDisposition = (
  contentDisposition,
  fallbackFileName,
) => {
  if (!contentDisposition) return fallbackFileName;

  // Match RFC 5987 / UTF-8 encoded filenames.
  const utfMatch = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);

  if (utfMatch?.[1]) {
    return decodeURIComponent(utfMatch[1]);
  }

  // Match regular quoted or unquoted filenames.
  const plainMatch = contentDisposition.match(/filename="?([^";]+)"?/i);

  if (plainMatch?.[1]) {
    return plainMatch[1];
  }

  return fallbackFileName;
};
