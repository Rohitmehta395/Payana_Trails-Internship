import { useState, useEffect, useRef } from "react";
import { api, IMAGE_BASE_URL } from "../services/api";

// ---------------------------------------------------------------------------
// Module-level prefetch cache
//
// Keys: pageKey string  →  Value: { promise, data | null, error | null }
//
// The cache entry is created (and the fetch started) the FIRST time
// prefetchPageHeroImages() is called for a given page key.  Subsequent
// calls to usePageHeroImages receive the already-in-flight (or resolved)
// promise, so the DB round-trip doesn't add latency on top of the initial
// page render.
// ---------------------------------------------------------------------------

const prefetchCache = {};

/**
 * Kick off (or reuse) a DB fetch for the given page key.
 * Call this as early as possible – ideally at module import time from the
 * page that owns the hero (see Home.jsx).
 */
export function prefetchPageHeroImages(pageKey) {
  if (prefetchCache[pageKey]) return; // already started

  const entry = { promise: null, data: null, error: null };

  entry.promise = api
    .getPageHeroImages(pageKey)
    .then((data) => {
      entry.data = data;
      return data;
    })
    .catch((err) => {
      entry.error = err;
      return null;
    });

  prefetchCache[pageKey] = entry;
}

// ---------------------------------------------------------------------------
// Helper – transform raw DB image records into { desktop, mobile, alt, _id }
// ---------------------------------------------------------------------------
function transformImages(rawImages, IMAGE_BASE_URL) {
  return rawImages
    .filter((img) => img.isActive)
    .sort((a, b) => a.order - b.order)
    .map((img) => ({
      desktop: `${IMAGE_BASE_URL}${img.url}`,
      mobile: img.mobileUrl
        ? `${IMAGE_BASE_URL}${img.mobileUrl}`
        : `${IMAGE_BASE_URL}${img.url}`,
      alt: img.alt || "",
      _id: img._id,
    }));
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * usePageHeroImages(pageKey, fallbackImages)
 *
 * Returns { images, loading }.
 *
 * Behaviour:
 *  1. If prefetchPageHeroImages(pageKey) has already been called and the
 *     fetch is complete, the hook resolves synchronously (loading = false,
 *     images = db or fallback) on the very first render – zero flicker.
 *  2. If the fetch is still in flight, the hook starts with fallback images
 *     (so the hero renders immediately) and switches to DB images once the
 *     promise resolves.
 *  3. If no prefetch was started, it falls back to fetching on mount (old
 *     behaviour), so nothing breaks.
 */
const usePageHeroImages = (pageKey, fallbackImages = []) => {
  const entry = prefetchCache[pageKey];

  // Determine the initial synchronous state.
  // If the prefetch already resolved before this hook first runs, we can
  // skip the loading phase entirely.
  const resolvedSync = entry && entry.data !== null;

  const getInitialImages = () => {
    if (!resolvedSync) return fallbackImages;
    const active = transformImages(entry.data.images || [], IMAGE_BASE_URL);
    return active.length > 0 ? active : fallbackImages;
  };

  const [images, setImages] = useState(getInitialImages);
  // loading=false when we already have DB data; otherwise true until fetch done
  const [loading, setLoading] = useState(!resolvedSync);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  useEffect(() => {
    // Already resolved synchronously — nothing to do.
    if (resolvedSync) return;

    let cancelled = false;

    const handleData = (data) => {
      if (cancelled || !mounted.current) return;
      if (data && (data.images || []).length > 0) {
        const active = transformImages(data.images, IMAGE_BASE_URL);
        if (active.length > 0) {
          setImages(active);
        } else {
          setImages(fallbackImages);
        }
      } else {
        setImages(fallbackImages);
      }
      setLoading(false);
    };

    const handleError = (err) => {
      if (cancelled || !mounted.current) return;
      console.warn(`usePageHeroImages(${pageKey}): using fallback images`, err?.message);
      setImages(fallbackImages);
      setLoading(false);
    };

    if (entry) {
      // Prefetch was started but not yet resolved — attach to the existing promise.
      entry.promise
        .then(() => handleData(entry.data))
        .catch(handleError);
    } else {
      // No prefetch — fetch now (graceful degradation).
      api
        .getPageHeroImages(pageKey)
        .then(handleData)
        .catch(handleError);
    }

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageKey]);

  return { images, loading };
};

export default usePageHeroImages;
