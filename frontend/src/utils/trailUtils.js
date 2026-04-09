/**
 * Parses a trail highlight string or object.
 * Handles: "*Location* Description", "Location : Description", "Location - Description"
 */
export const parseTrailHighlight = (highlight) => {
  if (!highlight) return { title: "", description: "" };

  if (typeof highlight === "object" && highlight !== null) {
    return {
      title: highlight.title || highlight.name || "",
      description: highlight.description || highlight.desc || "",
    };
  }

  if (typeof highlight === "string") {
    const text = highlight.trim();

    if (text.startsWith("*") && text.includes("*", 1)) {
      const parts = text.split("*");
      return {
        title: parts[1] ? parts[1].trim() : "",
        description: parts.slice(2).join("*").trim(),
      };
    }

    const separator = text.includes(":")
      ? ":"
      : text.match(/\s+-\s+/)
        ? text.match(/\s+-\s+/)[0]
        : null;

    if (separator) {
      const parts = text.split(separator);
      return {
        title: parts[0].trim(),
        description: parts.slice(1).join(separator).trim(),
      };
    }

    return { title: text, description: "" };
  }

  return { title: String(highlight), description: "" };
};
