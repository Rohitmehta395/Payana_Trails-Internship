/**
 * Preloads a single image by creating an in-memory Image element,
 * waiting for the `onload` event, then calling `.decode()` if supported.
 *
 * - Resolves `true` once the image is fully ready to paint.
 * - Resolves `false` on network error or decode failure (never rejects),
 *   so callers can always `await` without wrapping in try/catch.
 *
 * @param {string} src - The image URL to preload.
 * @returns {Promise<boolean>}
 */
export function preloadImage(src) {
  if (!src) return Promise.resolve(false);

  return new Promise((resolve) => {
    const img = new Image();

    img.onload = () => {
      if (typeof img.decode === "function") {
        img
          .decode()
          .then(() => resolve(true))
          .catch(() => resolve(true)); // decode failed but image loaded; still usable
      } else {
        resolve(true);
      }
    };

    img.onerror = () => resolve(false);

    img.src = src;
  });
}
