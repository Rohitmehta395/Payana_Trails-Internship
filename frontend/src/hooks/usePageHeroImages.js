import { useState, useEffect } from "react";
import { api, IMAGE_BASE_URL } from "../services/api";

/**
 * usePageHeroImages(pageKey, fallbackImages)
 *
 * Fetches hero images for a given page from the DB.
 * Falls back to `fallbackImages` if the DB returns nothing.
 *
 * @param {string}  pageKey        - Canonical page key (e.g. "home", "journeys/wildlife")
 * @param {Array}   fallbackImages - Static image objects to use when DB has no images
 *                                   Each item: { desktop: string, mobile?: string } or just a string URL
 * @returns {{ images: Array, loading: boolean }}
 *   images: Array of { desktop: string, mobile: string } suitable for Hero / CommonHero
 */
const usePageHeroImages = (pageKey, fallbackImages = []) => {
  const [images, setImages] = useState(fallbackImages);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchImages = async () => {
      try {
        const data = await api.getPageHeroImages(pageKey);
        if (cancelled) return;

        const activeImages = (data.images || [])
          .filter((img) => img.isActive)
          .sort((a, b) => a.order - b.order);

        if (activeImages.length > 0) {
          // Transform DB records into the { desktop, mobile } shape used by Hero components
          const transformed = activeImages.map((img) => ({
            desktop: `${IMAGE_BASE_URL}${img.url}`,
            // Use dedicated mobile URL if set; otherwise fall back to desktop
            mobile: img.mobileUrl
              ? `${IMAGE_BASE_URL}${img.mobileUrl}`
              : `${IMAGE_BASE_URL}${img.url}`,
            alt: img.alt || "",
            _id: img._id,
          }));
          setImages(transformed);
        } else {
          // No DB images → keep fallback
          setImages(fallbackImages);
        }
      } catch (err) {
        if (!cancelled) {
          console.warn(`usePageHeroImages(${pageKey}): using fallback images`, err.message);
          setImages(fallbackImages);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchImages();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageKey]);

  return { images, loading };
};

export default usePageHeroImages;
