import React from "react";

/**
 * RichTextRenderer
 * Parses and renders rich text stored with lightweight markup:
 *   **text**   → <strong>
 *   *text*     → <em>  (single asterisks, not part of **)
 *   - text     → <li> inside <ul> (line must start with "- ")
 *   plain text / blank lines → rendered as paragraphs / <br />
 *
 * Props:
 *   text          - the raw string from DB
 *   className     - extra classes on the wrapper element
 *   paragraphClass - classes applied to each <p> / text block
 */
const RichTextRenderer = ({ text = "", className = "", paragraphClass = "" }) => {
  if (!text) return null;

  /**
   * Parse inline markup (**bold**, *italic*) within a plain string segment.
   * Returns an array of React nodes.
   */
  const parseInline = (str, keyPrefix) => {
    // Regex: match **...** first, then *...*
    const parts = str.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={`${keyPrefix}-b-${i}`}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("*") && part.endsWith("*")) {
        return <em key={`${keyPrefix}-i-${i}`}>{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  const lines = text.split("\n");

  // Group consecutive bullet lines together
  const segments = [];
  let bulletBuffer = [];

  const flushBullets = () => {
    if (bulletBuffer.length > 0) {
      segments.push({ type: "bullets", items: [...bulletBuffer] });
      bulletBuffer = [];
    }
  };

  lines.forEach((line) => {
    if (line.startsWith("- ")) {
      bulletBuffer.push(line.slice(2));
    } else {
      flushBullets();
      segments.push({ type: "line", content: line });
    }
  });
  flushBullets();

  // Render segments
  const nodes = [];
  let paraBuffer = [];
  let key = 0;

  const flushPara = () => {
    if (paraBuffer.length > 0) {
      nodes.push(
        <p key={key++} className={paragraphClass}>
          {paraBuffer.map((seg, i) => (
            <React.Fragment key={i}>
              {i > 0 && <br />}
              {parseInline(seg, `p${key}-${i}`)}
            </React.Fragment>
          ))}
        </p>
      );
      paraBuffer = [];
    }
  };

  segments.forEach((seg) => {
    if (seg.type === "bullets") {
      flushPara();
      nodes.push(
        <ul key={key++} className="list-disc list-inside space-y-1 my-2 pl-2">
          {seg.items.map((item, i) => (
            <li key={i}>{parseInline(item, `li${key}-${i}`)}</li>
          ))}
        </ul>
      );
    } else if (seg.content === "") {
      // Empty line — flush current para, start new one
      flushPara();
    } else {
      paraBuffer.push(seg.content);
    }
  });

  flushPara();

  return <div className={className}>{nodes}</div>;
};

export default RichTextRenderer;
