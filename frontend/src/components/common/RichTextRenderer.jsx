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
   * Parse inline markup (**bold**, *italic*, ~~strike~~, ![img](url), [link](url)) within a plain string segment.
   * Returns an array of React nodes.
   */
  const parseInline = (str, keyPrefix) => {
    // Regex: match ![alt](url), [text](url), **...**, *...*, ~~...~~
    const regex = /(!\[[^\]]*\]\([^)]+\)|\[[^\]]*\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*|~~[^~]+~~)/g;
    const parts = str.split(regex);

    return parts.map((part, i) => {
      // 1. Image: ![alt](url)
      if (part.startsWith("![") && part.includes("](")) {
        const alt = part.match(/!\[(.*?)\]/)?.[1] || "Blog Image";
        const url = part.match(/\((.*?)\)/)?.[1] || "";
        if (!url) return null;
        const fullUrl = url.startsWith("http") ? url : `${import.meta.env.VITE_API_URL || "http://localhost:8000"}${url}`;

        return (
          <span key={`${keyPrefix}-img-${i}`} className="block my-8 group">
            <img src={fullUrl} alt={alt} className="w-full h-auto rounded-lg shadow-md border border-gray-100 transition-transform duration-500 group-hover:scale-[1.01]" loading="lazy" />
            {alt && <span className="block text-center text-xs text-gray-500 mt-3 font-light tracking-wide italic">{alt}</span>}
          </span>
        );
      }

      // 2. Link: [text](url)
      if (part.startsWith("[") && part.includes("](")) {
        const text = part.match(/\[(.*?)\]/)?.[1] || "";
        const url = part.match(/\((.*?)\)/)?.[1] || "";
        return (
          <a key={`${keyPrefix}-link-${i}`} href={url} target="_blank" rel="noopener noreferrer" className="text-[#4A3B2A] font-medium underline underline-offset-4 decoration-[#4A3B2A]/30 hover:decoration-[#4A3B2A] transition-all">
            {text}
          </a>
        );
      }

      // 3. Bold: **text**
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={`${keyPrefix}-b-${i}`} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
      }

      // 4. Italic: *text*
      if (part.startsWith("*") && part.endsWith("*")) {
        return <em key={`${keyPrefix}-i-${i}`} className="italic">{part.slice(1, -1)}</em>;
      }

      // 5. Strikethrough: ~~text~~
      if (part.startsWith("~~") && part.endsWith("~~")) {
        return <del key={`${keyPrefix}-s-${i}`} className="line-through opacity-70">{part.slice(2, -2)}</del>;
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
    const trimmed = line.trim();
    if (line.startsWith("- ")) {
      bulletBuffer.push(line.slice(2));
    } else {
      flushBullets();
      if (trimmed.startsWith("### ")) {
        segments.push({ type: "h3", content: trimmed.slice(4) });
      } else if (trimmed.startsWith("## ")) {
        segments.push({ type: "h2", content: trimmed.slice(3) });
      } else if (trimmed.startsWith("# ")) {
        segments.push({ type: "h1", content: trimmed.slice(2) });
      } else if (trimmed.startsWith("> ")) {
        segments.push({ type: "quote", content: trimmed.slice(2) });
      } else if (trimmed === "---") {
        segments.push({ type: "hr" });
      } else if (line.match(/^!\[[^\]]*\]\([^)]+\)$/)) {
        segments.push({ type: "image-line", content: line });
      } else {
        segments.push({ type: "line", content: line });
      }
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
    switch (seg.type) {
      case "h1":
        flushPara();
        nodes.push(<h1 key={key++} className="text-3xl md:text-4xl font-serif font-bold text-[#4A3B2A] mt-10 mb-6">{parseInline(seg.content, `h1-${key}`)}</h1>);
        break;
      case "h2":
        flushPara();
        nodes.push(<h2 key={key++} className="text-2xl md:text-3xl font-serif font-bold text-[#4A3B2A] mt-8 mb-4">{parseInline(seg.content, `h2-${key}`)}</h2>);
        break;
      case "h3":
        flushPara();
        nodes.push(<h3 key={key++} className="text-xl md:text-2xl font-serif font-semibold text-[#4A3B2A] mt-6 mb-3">{parseInline(seg.content, `h3-${key}`)}</h3>);
        break;
      case "quote":
        flushPara();
        nodes.push(
          <blockquote key={key++} className="border-l-4 border-[#4A3B2A]/20 pl-6 my-8 italic text-lg text-gray-700 bg-gray-50/50 py-4 pr-4 rounded-r-lg leading-relaxed">
            {parseInline(seg.content, `q-${key}`)}
          </blockquote>
        );
        break;
      case "hr":
        flushPara();
        nodes.push(<hr key={key++} className="my-12 border-0 h-px bg-gradient-to-r from-transparent via-[#4A3B2A]/20 to-transparent" />);
        break;
      case "bullets":
        flushPara();
        nodes.push(
          <ul key={key++} className="list-disc list-outside space-y-2 my-6 pl-4 text-gray-700">
            {seg.items.map((item, i) => (<li key={i}>{parseInline(item, `li${key}-${i}`)}</li>))}
          </ul>
        );
        break;
      case "image-line":
        flushPara();
        nodes.push(<div key={key++}>{parseInline(seg.content, `img-line-${key}`)}</div>);
        break;
      case "line":
        if (seg.content === "") {
          flushPara();
        } else {
          paraBuffer.push(seg.content);
        }
        break;
    }
  });

  flushPara();

  return <div className={`rich-text-content ${className}`}>{nodes}</div>;
};

export default RichTextRenderer;
