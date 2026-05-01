import React, { useState, useRef } from "react";
import MDEditor, { commands } from "@uiw/react-md-editor";
import { 
  ImageIcon, 
  Loader2, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify 
} from "lucide-react";
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
          imageAlignment === "left" || imageAlignment === "right" || imageAlignment === "center"
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

  const alignLeftCommand = {
    name: "align-left",
    keyCommand: "align-left",
    buttonProps: { "aria-label": "Align Left", title: "Align Left" },
    icon: <AlignLeft size={13} />,
    execute: (state, api) => {
      const selectedText = state.selectedText.trim();
      const regex = /^<div style="text-align:\s*(left|center|right|justify)">\s*([\s\S]*?)\s*<\/div>$/i;
      const match = selectedText.match(regex);

      if (match) {
        const [_, currentAlign, content] = match;
        if (currentAlign === "left") {
          api.replaceSelection(content.trim());
        } else {
          api.replaceSelection(`<div style="text-align: left">\n\n${content.trim()}\n\n</div>`);
        }
      } else {
        api.replaceSelection(`<div style="text-align: left">\n\n${state.selectedText || " "}\n\n</div>`);
      }
    },
  };

  const alignCenterCommand = {
    name: "align-center",
    keyCommand: "align-center",
    buttonProps: { "aria-label": "Align Center", title: "Align Center" },
    icon: <AlignCenter size={13} />,
    execute: (state, api) => {
      const selectedText = state.selectedText.trim();
      const regex = /^<div style="text-align:\s*(left|center|right|justify)">\s*([\s\S]*?)\s*<\/div>$/i;
      const match = selectedText.match(regex);

      if (match) {
        const [_, currentAlign, content] = match;
        if (currentAlign === "center") {
          api.replaceSelection(content.trim());
        } else {
          api.replaceSelection(`<div style="text-align: center">\n\n${content.trim()}\n\n</div>`);
        }
      } else {
        api.replaceSelection(`<div style="text-align: center">\n\n${state.selectedText || " "}\n\n</div>`);
      }
    },
  };

  const alignRightCommand = {
    name: "align-right",
    keyCommand: "align-right",
    buttonProps: { "aria-label": "Align Right", title: "Align Right" },
    icon: <AlignRight size={13} />,
    execute: (state, api) => {
      const selectedText = state.selectedText.trim();
      const regex = /^<div style="text-align:\s*(left|center|right|justify)">\s*([\s\S]*?)\s*<\/div>$/i;
      const match = selectedText.match(regex);

      if (match) {
        const [_, currentAlign, content] = match;
        if (currentAlign === "right") {
          api.replaceSelection(content.trim());
        } else {
          api.replaceSelection(`<div style="text-align: right">\n\n${content.trim()}\n\n</div>`);
        }
      } else {
        api.replaceSelection(`<div style="text-align: right">\n\n${state.selectedText || " "}\n\n</div>`);
      }
    },
  };

  const alignJustifyCommand = {
    name: "align-justify",
    keyCommand: "align-justify",
    buttonProps: { "aria-label": "Align Justify", title: "Align Justify" },
    icon: <AlignJustify size={13} />,
    execute: (state, api) => {
      const selectedText = state.selectedText.trim();
      const regex = /^<div style="text-align:\s*(left|center|right|justify)">\s*([\s\S]*?)\s*<\/div>$/i;
      const match = selectedText.match(regex);

      if (match) {
        const [_, currentAlign, content] = match;
        if (currentAlign === "justify") {
          api.replaceSelection(content.trim());
        } else {
          api.replaceSelection(`<div style="text-align: justify">\n\n${content.trim()}\n\n</div>`);
        }
      } else {
        api.replaceSelection(`<div style="text-align: justify">\n\n${state.selectedText || " "}\n\n</div>`);
      }
    },
  };

  return (
    <div
      className={`rich-text-editor-container ${className}`}
      data-color-mode="light"
    >
      <div className="mb-3 flex items-center justify-end gap-3 text-xs text-gray-600 bg-gray-50/50 p-2 rounded-lg border border-gray-100">
        <span className="font-medium text-[#4A3B2A] flex items-center gap-1.5">
          <ImageIcon size={14} /> Image upload alignment:
        </span>
        <div className="flex bg-white rounded-md border border-gray-200 p-0.5 shadow-sm">
          {[
            { id: 'left', icon: <AlignLeft size={14} />, label: 'Left Float' },
            { id: 'default', icon: <AlignCenter size={14} />, label: 'Full Width / Center' },
            { id: 'right', icon: <AlignRight size={14} />, label: 'Right Float' }
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setImageAlignment(opt.id)}
              className={`p-1.5 rounded-sm transition-all ${
                imageAlignment === opt.id 
                  ? "bg-[#4A3B2A] text-white shadow-inner" 
                  : "text-gray-500 hover:bg-gray-100 hover:text-[#4A3B2A]"
              }`}
              title={opt.label}
            >
              {opt.icon}
            </button>
          ))}
        </div>
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
              const match = altText.match(/\|\s*(left|right|center)\s*$/i);
              const alignment = match?.[1]?.toLowerCase() || null;
              const cleanAlt = altText
                .replace(/\s*\|\s*(left|right|center)\s*$/i, "")
                .trim();
              
              const src = props.src?.startsWith("http")
                ? props.src
                : `${IMAGE_BASE_URL}${props.src?.startsWith("/") ? "" : "/"}${props.src}`;

              const isAligned = alignment === "left" || alignment === "right";
              const isCentered = alignment === "center";

              return (
                <span 
                  className={`blog-inline-image ${alignment ? `blog-inline-image--${alignment}` : ""}`}
                  style={{
                    display: isCentered ? "flex" : "block",
                    flexDirection: "column",
                    alignItems: "center",
                    float: alignment === "left" ? "left" : alignment === "right" ? "right" : "none",
                    width: isAligned ? "42%" : "100%",
                    margin: isAligned 
                      ? (alignment === "left" ? "0.75rem 2.5rem 1.75rem 0" : "0.75rem 0 1.75rem 2.5rem")
                      : "1.5rem auto",
                    clear: "none",
                  }}
                >
                  <img
                    {...props}
                    src={src}
                    alt={cleanAlt || props.alt}
                    style={{
                      width: isCentered ? "70%" : "100%",
                      height: "auto",
                      borderRadius: "0.5rem",
                      display: "block",
                      margin: isCentered ? "0 auto" : "0",
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

              const filteredChildren = newChildren.filter(child => {
                if (typeof child === 'string' && !child.trim()) return false;
                return true;
              });

              const imageChildren = filteredChildren.filter(child => 
                React.isValidElement(child) && 
                child.props?.className?.includes("blog-inline-image")
              );

              const isOnlyImages = filteredChildren.length > 0 && 
                                imageChildren.length === filteredChildren.length;

              if (isOnlyImages) {
                if (imageChildren.length > 1) {
                  return (
                    <div className="blog-image-grid-preview">
                      {newChildren}
                    </div>
                  );
                }
                return <>{newChildren}</>;
              }
              return (
                <p 
                  className="mb-4" 
                  style={alignment ? { textAlign: alignment, clear: 'none', display: 'block' } : {}}
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
          },
        }}
        commands={[
          commands.bold,
          commands.italic,
          commands.strikethrough,
          commands.hr,
          commands.divider,
          alignLeftCommand,
          alignCenterCommand,
          alignRightCommand,
          alignJustifyCommand,
          commands.divider,
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
        .rich-text-editor-container .blog-image-grid-preview {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin: 1.5rem 0;
          clear: both;
        }
        .rich-text-editor-container .blog-image-grid-preview .blog-inline-image {
          width: 100% !important;
          float: none !important;
          margin: 0 !important;
          clear: none !important;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
