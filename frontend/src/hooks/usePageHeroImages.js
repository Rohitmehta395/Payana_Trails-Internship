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
function transformImages(rawImages) {
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
 * DB-first strategy:
 *  - While the DB fetch is in flight → images = [], loading = true
 *    (Hero will show a branded skeleton, not fallback images)
 *  - Once the DB fetch resolves with active images → images = DB images, loading = false
 *  - If the DB fetch resolves with no active images OR errors → images = fallbackImages, loading = false
 *
 * If prefetchPageHeroImages(pageKey) was already called and the fetch
 * resolved before the hook first runs, we skip loading entirely (zero flicker).
 */
const usePageHeroImages = (pageKey, fallbackImages = []) => {
  const entry = prefetchCache[pageKey];

  // Determine the initial synchronous state.
  // If the prefetch already resolved before this hook first runs, we can
  // skip the loading phase entirely.
  const resolvedSync = entry && entry.data !== null;
  const erroredSync = entry && entry.error !== null && entry.data === null;

  const getInitialImages = () => {
    if (resolvedSync) {
      const active = transformImages(entry.data?.images || []);
      return active.length > 0 ? active : fallbackImages;
    }
    if (erroredSync) {
      return fallbackImages;
    }
    // Still loading – return empty so Hero shows skeleton
    return [];
  };

  const [images, setImages] = useState(getInitialImages);
  // loading=false only when we have a definitive result (DB images OR fallback after error/empty)
  const [loading, setLoading] = useState(!resolvedSync && !erroredSync);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    // Already resolved synchronously — nothing to do.
    if (resolvedSync || erroredSync) return;

    let cancelled = false;

    const handleData = (data) => {
      if (cancelled || !mounted.current) return;
      if (data && (data.images || []).length > 0) {
        const active = transformImages(data.images);
        if (active.length > 0) {
          setImages(active);
        } else {
          // DB has images but none are active → use fallback
          setImages(fallbackImages);
        }
      } else {
        // DB returned empty → use fallback
        setImages(fallbackImages);
      }
      setLoading(false);
    };

    const handleError = (err) => {
      if (cancelled || !mounted.current) return;
      console.warn(
        `usePageHeroImages(${pageKey}): DB fetch failed, using fallback images`,
        err?.message
      );
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
      api.getPageHeroImages(pageKey).then(handleData).catch(handleError);
    }

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageKey]);

  return { images, loading };
};

export default usePageHeroImages;
