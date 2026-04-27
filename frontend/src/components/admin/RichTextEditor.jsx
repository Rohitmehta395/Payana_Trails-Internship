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
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !onImageUpload) return;

    setIsUploading(true);
    try {
      const url = await onImageUpload(file);
      if (url) {
        const imageMarkdown = `\n![Image Description](${url})\n`;
        
        // Insert at cursor position if we have selection data, otherwise append to end
        // Use value.length if selection is 0 (likely initial state)
        const insertPos = selection.start || value.length;
        const newValue = 
          value.substring(0, insertPos) + 
          imageMarkdown + 
          value.substring(selection.end || insertPos);
        
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
    <div className={`rich-text-editor-container ${className}`} data-color-mode="light">
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
              const src = props.src?.startsWith("http") 
                ? props.src 
                : `${IMAGE_BASE_URL}${props.src?.startsWith("/") ? "" : "/"}${props.src}`;
              
              return (
                <span className="block my-4">
                  <img 
                    {...props} 
                    src={src} 
                    alt={props.alt} 
                    style={{ maxWidth: '100%', borderRadius: '0.5rem', display: 'block', margin: '0 auto' }} 
                  />
                  {props.alt && props.alt !== "Image Description" && (
                    <span className="block text-center text-[11px] text-gray-500 mt-2 font-light italic">
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
          }
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
