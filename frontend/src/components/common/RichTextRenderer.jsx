import React from "react";
import MDEditor from "@uiw/react-md-editor";
import { IMAGE_BASE_URL } from "../../services/api";
import "@uiw/react-markdown-preview/markdown.css";

/**
 * RichTextRenderer
 * Renders markdown content using @uiw/react-md-editor's Markdown component.
 * Includes custom styling and image caption support.
 */
const RichTextRenderer = ({
  text = "",
  className = "",
  paragraphClass = "",
}) => {
  if (!text) return null;

  const parseImageAlignment = (altText = "") => {
    const match = altText.match(/\|\s*(left|right|center)\s*$/i);
    const alignment = match?.[1]?.toLowerCase() || null;
    const cleanAlt = altText.replace(/\s*\|\s*(left|right|center)\s*$/i, "").trim();
    return { alignment, cleanAlt };
  };

  // Pre-process to handle custom alignment markers while keeping content in one flow
  // This allows text alignment to work alongside floated images
  const processedText = text.replace(/<div style="text-align:\s*(left|center|right|justify)">([\s\S]*?)<\/div>/gi, (match, align, content) => {
    // Apply marker to every paragraph-like block in the content
    return content
      .split("\n")
      .map(line => line.trim() ? `[align-${align.toLowerCase()}]${line}` : line)
      .join("\n");
  });

  const components = {
    img: ({ node, ...props }) => {
      const src = props.src?.startsWith("http")
        ? props.src
        : `${IMAGE_BASE_URL}${props.src?.startsWith("/") ? "" : "/"}${props.src}`;
      const { alignment, cleanAlt } = parseImageAlignment(
        props.alt || "",
      );
      
      const isAligned = alignment === "left" || alignment === "right";
      const isCentered = alignment === "center";

      const wrapperClass = isAligned
        ? `blog-inline-image blog-inline-image--${alignment}`
        : isCentered
          ? "blog-image-center"
          : "blog-image-full my-8 group block";

      return (
        <span className={wrapperClass}>
          <img
            {...props}
            src={src}
            alt={cleanAlt || props.alt}
            className={`h-auto rounded-lg shadow-md border border-gray-100 transition-transform duration-500 ${isCentered ? 'mx-auto' : 'w-full'}`}
            style={isCentered ? { maxWidth: '70%', display: 'block' } : {}}
            loading="lazy"
          />
          {cleanAlt && cleanAlt !== "Image Description" && (
            <span className="block text-center text-xs text-gray-500 mt-3 font-light tracking-wide italic">
              {cleanAlt}
            </span>
          )}
        </span>
      );
    },
    p: ({ node, children }) => {
      const childrenArray = React.Children.toArray(children);
      let alignment = null;

      // Extract alignment from marker if present
      const newChildren = childrenArray.map(child => {
        if (typeof child === 'string') {
          const match = child.match(/^\[align-(left|center|right|justify)\]/);
          if (match) {
            alignment = match[1];
            return child.replace(match[0], '');
          }
        }
        return child;
      });
      
      // Filter out whitespace/empty strings/newlines to accurately check content
      const filteredChildren = newChildren.filter(child => {
        if (typeof child === 'string' && !child.trim()) return false;
        return true;
      });

      // Check if all children are images (inline or full)
      const imageChildren = filteredChildren.filter(child => 
        React.isValidElement(child) && 
        (child.props?.className?.includes("blog-inline-image") || 
         child.props?.className?.includes("blog-image-full") ||
         child.props?.className?.includes("blog-image-center"))
      );

      const isOnlyImages = filteredChildren.length > 0 && 
                        imageChildren.length === filteredChildren.length;

      if (isOnlyImages) {
        if (imageChildren.length > 1) {
          return (
            <div className="blog-image-grid my-10">
              {newChildren}
            </div>
          );
        }
        return <>{newChildren}</>;
      }

      return (
        <p 
          className={paragraphClass} 
          style={alignment ? { textAlign: alignment, display: 'block', clear: 'none' } : {}}
        >
          {newChildren}
        </p>
      );
    },
    a: ({ node, ...props }) => {
      return (
        <a {...props} target="_blank" rel="noopener noreferrer">
          {props.children}
        </a>
      );
    },
  };

  return (
    <div
      className={`rich-text-renderer-container ${className}`}
      data-color-mode="light"
    >
      <MDEditor.Markdown
        source={processedText}
        style={{
          backgroundColor: "transparent",
          color: "inherit",
          fontFamily: "inherit",
        }}
        components={components}
      />
      <style>{`
        .rich-text-renderer-container .wmde-markdown {
          font-family: inherit;
          color: #374151;
          line-height: 1.75;
          background-color: transparent !important;
        }
        .rich-text-renderer-container .wmde-markdown h1 {
          font-size: 1.875rem;
          font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
          font-weight: 700;
          color: #4A3B2A;
          margin-top: 2.5rem;
          margin-bottom: 1.5rem;
          border-bottom: none;
          padding-bottom: 0;
        }
        @media (min-width: 768px) {
          .rich-text-renderer-container .wmde-markdown h1 { font-size: 2.25rem; }
        }
        .rich-text-renderer-container .wmde-markdown h2 {
          font-size: 1.5rem;
          font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
          font-weight: 700;
          color: #4A3B2A;
          margin-top: 2rem;
          margin-bottom: 1rem;
          border-bottom: none;
          padding-bottom: 0;
        }
        @media (min-width: 768px) {
          .rich-text-renderer-container .wmde-markdown h2 { font-size: 1.875rem; }
        }
        .rich-text-renderer-container .wmde-markdown h3 {
          font-size: 1.25rem;
          font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
          font-weight: 600;
          color: #4A3B2A;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        @media (min-width: 768px) {
          .rich-text-renderer-container .wmde-markdown h3 { font-size: 1.5rem; }
        }
        .rich-text-renderer-container .wmde-markdown blockquote {
          border-left: 4px solid rgba(74, 59, 42, 0.2);
          padding-left: 1.5rem;
          margin: 2rem 0;
          font-style: italic;
          font-size: 1.125rem;
          color: #374151;
          background-color: rgba(249, 250, 251, 0.5);
          padding: 1rem;
          border-radius: 0 0.5rem 0.5rem 0;
          line-height: 1.625;
        }
        .rich-text-renderer-container .wmde-markdown hr {
          margin: 3rem 0;
          border: 0;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(74, 59, 42, 0.2), transparent);
        }
        .rich-text-renderer-container .wmde-markdown ul {
          list-style-type: disc;
          list-style-position: outside;
          padding-left: 1rem;
          margin: 1.5rem 0;
        }
        .rich-text-renderer-container .wmde-markdown li { margin-bottom: 0.5rem; }
        .rich-text-renderer-container .wmde-markdown p {
          margin-bottom: 1.5rem;
          line-height: 1.8;
          font-size: 1rem;
          color: #1f2937;
        }
        .rich-text-renderer-container .wmde-markdown a {
          color: #4A3B2A;
          font-weight: 500;
          text-decoration: underline;
          text-underline-offset: 4px;
          text-decoration-color: rgba(74, 59, 42, 0.3);
          transition: all 0.2s;
        }
        .rich-text-renderer-container .wmde-markdown a:hover { text-decoration-color: #4A3B2A; }
        .rich-text-renderer-container .wmde-markdown .blog-image-full {
          width: 100%;
          display: block;
          clear: both;
          margin: 2.5rem 0;
        }
        .rich-text-renderer-container .wmde-markdown .blog-image-center {
          width: 100%;
          display: block;
          clear: both;
          margin: 2.5rem 0;
          text-align: center;
        }
        .rich-text-renderer-container .wmde-markdown .blog-inline-image {
          width: 100%;
          margin: 2rem 0;
          display: block;
          clear: both;
        }
        /* Grid for multiple consecutive images */
        .rich-text-renderer-container .wmde-markdown .blog-image-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          clear: both;
          margin: 2.5rem 0;
        }
        @media (min-width: 640px) {
          .rich-text-renderer-container .wmde-markdown .blog-image-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .rich-text-renderer-container .wmde-markdown .blog-image-grid {
            /* Support 3 columns if there are 3+ images */
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          }
        }
        .rich-text-renderer-container .wmde-markdown .blog-image-grid .blog-inline-image,
        .rich-text-renderer-container .wmde-markdown .blog-image-grid .blog-image-full {
          width: 100% !important;
          float: none !important;
          margin: 0 !important;
          height: 100%;
        }
        .rich-text-renderer-container .wmde-markdown .blog-image-grid .blog-inline-image img,
        .rich-text-renderer-container .wmde-markdown .blog-image-grid .blog-image-full img {
          height: 100%;
          object-fit: cover;
        }

        @media (min-width: 768px) {
          .rich-text-renderer-container .wmde-markdown .blog-inline-image {
            width: 42%;
            display: block !important;
            float: none;
          }
          .rich-text-renderer-container .wmde-markdown .blog-inline-image--left {
            float: left !important;
            margin: 0.75rem 2.5rem 1.75rem 0 !important;
            clear: both !important; /* Forces vertical stacking to avoid squeezing */
          }
          .rich-text-renderer-container .wmde-markdown .blog-inline-image--right {
            float: right !important;
            margin: 0.75rem 0 1.75rem 2.5rem !important;
            clear: both !important; /* Forces vertical stacking to avoid squeezing */
          }
        }
        .rich-text-renderer-container .wmde-markdown::after {
          content: "";
          display: table;
          clear: both;
        }
      `}</style>
    </div>
  );
};

export default RichTextRenderer;
