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

  return (
    <div className={`rich-text-renderer-container ${className}`} data-color-mode="light">
      <MDEditor.Markdown 
        source={text} 
        style={{ 
          backgroundColor: 'transparent',
          color: 'inherit',
          fontFamily: 'inherit'
        }}
        components={{
          img: ({ node, ...props }) => {
            const src = props.src?.startsWith("http") 
              ? props.src 
              : `${IMAGE_BASE_URL}${props.src?.startsWith("/") ? "" : "/"}${props.src}`;
            
            return (
              <span className="block my-8 group">
                <img 
                  {...props} 
                  src={src} 
                  alt={props.alt}
                  className="w-full h-auto rounded-lg shadow-md border border-gray-100 transition-transform duration-500 group-hover:scale-[1.01]"
                  loading="lazy"
                />
                {props.alt && props.alt !== "Image Description" && (
                  <span className="block text-center text-xs text-gray-500 mt-3 font-light tracking-wide italic">
                    {props.alt}
                  </span>
                )}
              </span>
            );
          },
          a: ({ node, ...props }) => {
            return (
              <a 
                {...props} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                {props.children}
              </a>
            );
          }
        }}
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
      `}</style>
    </div>
  );
};

export default RichTextRenderer;
