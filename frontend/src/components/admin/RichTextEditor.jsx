import React, { useState, useRef } from "react";
import MDEditor, { commands } from "@uiw/react-md-editor";
import { ImageIcon, Loader2 } from "lucide-react";
import { IMAGE_BASE_URL } from "../../services/api";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

/**
 * RichTextEditor
 * Uses @uiw/react-md-editor for robust markdown editing.
 */
const RichTextEditor = ({
  value = "",
  onChange,
  onImageUpload, // Function(file) => Promise<url>
  rows = 5,
  placeholder = "Write content here...",
  className = "",
}) => {
  const height = rows * 25 + 100;
  const [isUploading, setIsUploading] = useState(false);
  const [imageAlignment, setImageAlignment] = useState("default");
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !onImageUpload) return;

    setIsUploading(true);
    try {
      const url = await onImageUpload(file);
      if (url) {
        const alignmentTag =
          imageAlignment === "left" || imageAlignment === "right"
            ? ` | ${imageAlignment}`
            : "";
        const imageMarkdown = `\n![Image Description${alignmentTag}](${url})\n`;
        
        // Insert at cursor position if we have selection data, otherwise append to end
        const insertPos = (selection.start !== undefined && selection.start !== null) ? selection.start : value.length;
        const newValue = 
          value.substring(0, insertPos) + 
          imageMarkdown + 
          value.substring(selection.end !== undefined ? selection.end : insertPos);
        
        onChange(newValue);
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const imageUploadCommand = {
    name: "image-upload",
    keyCommand: "image-upload",
    buttonProps: { "aria-label": "Upload Image", title: "Upload Image" },
    icon: isUploading ? (
      <Loader2 size={12} className="animate-spin" />
    ) : (
      <ImageIcon size={12} />
    ),
    execute: (state) => {
      // Store current selection before opening file dialog
      setSelection({ start: state.selection.start, end: state.selection.end });
      fileInputRef.current?.click();
    },
  };

  return (
    <div
      className={`rich-text-editor-container ${className}`}
      data-color-mode="light"
    >
      <div className="mb-2 flex items-center justify-end gap-2 text-xs text-gray-600">
        <label htmlFor="imageAlignment" className="font-medium text-[#4A3B2A]">
          Image alignment
        </label>
        <select
          id="imageAlignment"
          value={imageAlignment}
          onChange={(e) => setImageAlignment(e.target.value)}
          className="rounded border border-gray-300 px-2 py-1 focus:border-[#4A3B2A] focus:outline-none"
        >
          <option value="default">Default</option>
          <option value="left">Left</option>
          <option value="right">Right</option>
        </select>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        className="hidden"
        accept="image/*"
      />
      <MDEditor
        value={value}
        onChange={onChange}
        height={height}
        placeholder={placeholder}
        extraCommands={[
          commands.codeLive,
          commands.codeEdit,
          commands.codePreview,
          commands.fullscreen,
        ]}
        previewOptions={{
          components: {
            img: ({ node, ...props }) => {
              const altText = props.alt || "";
              const match = altText.match(/\|\s*(left|right)\s*$/i);
              const alignment = match?.[1]?.toLowerCase() || null;
              const cleanAlt = altText
                .replace(/\s*\|\s*(left|right)\s*$/i, "")
                .trim();
              
              const src = props.src?.startsWith("http")
                ? props.src
                : `${IMAGE_BASE_URL}${props.src?.startsWith("/") ? "" : "/"}${props.src}`;

              const isAligned = alignment === "left" || alignment === "right";

              return (
                <span 
                  className={`blog-inline-image ${alignment ? `blog-inline-image--${alignment}` : ""}`}
                  style={{
                    display: isAligned ? "inline-block" : "block",
                    float: alignment === "left" ? "left" : alignment === "right" ? "right" : "none",
                    width: isAligned ? "50%" : "100%",
                    margin: isAligned 
                      ? (alignment === "left" ? "0.5rem 1.5rem 1rem 0" : "0.5rem 0 1rem 1.5rem")
                      : "1.5rem auto",
                    clear: isAligned ? "none" : "both",
                  }}
                >
                  <img
                    {...props}
                    src={src}
                    alt={cleanAlt || props.alt}
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "0.5rem",
                      display: "block",
                    }}
                  />
                  {cleanAlt && cleanAlt !== "Image Description" && (
                    <span className="block text-center text-[11px] text-gray-500 mt-2 font-light italic">
                      {cleanAlt}
                    </span>
                  )}
                </span>
              );
            },
            p: ({ node, children }) => {
              const childrenArray = React.Children.toArray(children);
              const isOnlyImage = childrenArray.length === 1 && 
                React.isValidElement(childrenArray[0]) && 
                childrenArray[0].props?.className?.includes("blog-inline-image");

              if (isOnlyImage) {
                return <>{children}</>;
              }
              return <p className="mb-4">{children}</p>;
            },
            a: ({ node, ...props }) => {
              return (
                <a {...props} target="_blank" rel="noopener noreferrer">
                  {props.children}
                </a>
              );
            },
          },
        }}
        commands={[
          commands.bold,
          commands.italic,
          commands.strikethrough,
          commands.hr,
          commands.title,
          commands.divider,
          commands.link,
          commands.quote,
          commands.code,
          onImageUpload ? imageUploadCommand : commands.image,
          commands.divider,
          commands.unorderedListCommand,
          commands.orderedListCommand,
          commands.checkedListCommand,
        ]}
      />
      <style>{`
        .rich-text-editor-container .w-md-editor {
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          box-shadow: none;
        }
        .rich-text-editor-container .w-md-editor-toolbar {
          background-color: #f3efe9;
          border-bottom: 1px solid #d1d5db;
          border-radius: 0.375rem 0.375rem 0 0;
        }
        .rich-text-editor-container .w-md-editor-content {
          background-color: white;
        }
        .rich-text-editor-container .w-md-editor-toolbar button {
          color: #4a3b2a;
        }
        .rich-text-editor-container .w-md-editor-toolbar button:hover {
          background-color: #e5dfd3;
        }
        .rich-text-editor-container .w-md-editor-preview {
          background-color: #f9fafb;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
