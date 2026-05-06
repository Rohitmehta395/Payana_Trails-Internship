/**
 * Dynamically updates the site's favicon.
 * 
 * @param {string} url - The URL of the new favicon image.
 * @param {string} [fallbackUrl='/logo.svg'] - The fallback URL if the main URL is invalid.
 */
export const updateFavicon = (url, fallbackUrl = "/logo.svg") => {
  const link = document.querySelector("link[rel~='icon']");
  if (!link) return;

  const finalUrl = url || fallbackUrl;
  link.href = finalUrl;

  // Update type based on extension
  if (finalUrl.endsWith(".svg")) {
    link.type = "image/svg+xml";
  } else if (finalUrl.endsWith(".png")) {
    link.type = "image/png";
  } else if (finalUrl.endsWith(".webp")) {
    link.type = "image/webp";
  } else {
    link.type = "image/x-icon";
  }
};
