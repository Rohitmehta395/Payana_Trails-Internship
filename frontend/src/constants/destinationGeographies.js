export const DESTINATION_GEOGRAPHIES = [
  "Indian Subcontinent",
  "Southeast Asia",
  "East Asia",
  "West Asia",
  "Africa",
];

const LEGACY_DESTINATION_GEOGRAPHY_BY_NAME = {
  bali: "Southeast Asia",
  bhutan: "Indian Subcontinent",
  borneo: "Southeast Asia",
  cambodia: "Southeast Asia",
  china: "East Asia",
  egypt: "Africa",
  india: "Indian Subcontinent",
  jordan: "West Asia",
  kenya: "Africa",
  tanzania: "Africa",
  vietnam: "Southeast Asia",
};

const normalizeValue = (value = "") =>
  value.trim().toLowerCase().replace(/\s+/g, " ");

export const getDestinationGeography = (destination) => {
  const explicitGeography = destination?.geography;

  if (DESTINATION_GEOGRAPHIES.includes(explicitGeography)) {
    return explicitGeography;
  }

  return LEGACY_DESTINATION_GEOGRAPHY_BY_NAME[normalizeValue(destination?.name)] || "";
};

export const buildDestinationListingPath = ({
  geography = "",
  destination = "",
  search = "",
} = {}) => {
  const params = new URLSearchParams();

  if (geography) {
    params.set("geography", geography);
  }

  if (destination) {
    params.set("destination", destination);
  }

  if (search) {
    params.set("search", search);
  }

  const query = params.toString();
  return query ? `/journeys/destinations?${query}` : "/journeys/destinations";
};
