import { IMAGE_BASE_URL } from "../services/api";

export const transformTrailMedia = (trail) => {
  if (!trail) return null;

  return {
    ...trail,
    heroImageUrl: trail.heroImage ? `${IMAGE_BASE_URL}${trail.heroImage}` : "",
    routeMapUrl: trail.routeMap ? `${IMAGE_BASE_URL}${trail.routeMap}` : "",
    itineraryPdfUrl: trail.itineraryPdf ? `${IMAGE_BASE_URL}${trail.itineraryPdf}` : "",
    gallery: Array.isArray(trail.trailImages)
      ? trail.trailImages.map((image) => `${IMAGE_BASE_URL}${image}`)
      : [],
  };
};

export const normalizePublicItinerary = (days = []) =>
  days
    .map((day, index) => {
      const points = Array.isArray(day?.points)
        ? day.points
            .map((point) => (typeof point === "string" ? point.trim() : ""))
            .filter(Boolean)
        : [];

      const title =
        typeof day?.title === "string" && day.title.trim()
          ? day.title.trim()
          : `Day ${index + 1} unfolds`;

      return {
        title,
        points,
        accommodation:
          typeof day?.accommodation === "string" ? day.accommodation.trim() : "",
        meals: typeof day?.meals === "string" ? day.meals.trim() : "",
      };
    })
    .filter(
      (day) =>
        day.title || day.points.length > 0 || day.accommodation || day.meals,
    );
