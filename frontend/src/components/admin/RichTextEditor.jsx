import React, { useRef, useState } from "react";
import { 
  Bold, Italic, List, Eye, EyeOff, Image as ImageIcon, Loader2, 
  Heading1, Heading2, Heading3, Quote, Link as LinkIcon, Minus, Strikethrough 
} from "lucide-react";
import RichTextRenderer from "../common/RichTextRenderer";

/**
 * RichTextEditor
 * Admin textarea with comprehensive markdown-style formatting toolbar.
 */
const RichTextEditor = ({
  value = "",
  onChange,
  onImageUpload, // Function(file) => Promise<url>
  rows = 5,
  placeholder = "Write content here...",
  className = "",
}) => {
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showHeadings, setShowHeadings] = useState(false);

  /** Helper to insert/wrap text */
  const insertText = (prefix, suffix = "", isBlock = false) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end);

    let newValue;
    let newStart, newEnd;

    if (isBlock) {
      // Find start of current line
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const lineEnd = value.indexOf("\n", end);
      const actualLineEnd = lineEnd === -1 ? value.length : lineEnd;
      
      const lineContent = value.slice(lineStart, actualLineEnd);
      
      if (lineContent.startsWith(prefix)) {
        // Toggle off
        newValue = value.slice(0, lineStart) + lineContent.slice(prefix.length) + value.slice(actualLineEnd);
        newStart = Math.max(lineStart, start - prefix.length);
        newEnd = Math.max(lineStart, end - prefix.length);
      } else {
        // Toggle on
        newValue = value.slice(0, lineStart) + prefix + lineContent + value.slice(actualLineEnd);
        newStart = start + prefix.length;
        newEnd = end + prefix.length;
      }
    } else {
      // Inline toggle
      if (selected.startsWith(prefix) && selected.endsWith(suffix) && selected.length >= (prefix.length + suffix.length)) {
        // Unwrap
        const inner = selected.slice(prefix.length, suffix.length ? -suffix.length : undefined);
        newValue = value.slice(0, start) + inner + value.slice(end);
        newStart = start;
        newEnd = start + inner.length;
      } else {
        // Wrap
        newValue = value.slice(0, start) + prefix + selected + suffix + value.slice(end);
        newStart = start + prefix.length;
        newEnd = end + prefix.length;
      }
    }

    onChange(newValue);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(newStart, newEnd);
    });
  };

  const toggleBold = () => insertText("**", "**");
  const toggleItalic = () => insertText("*", "*");
  const toggleStrike = () => insertText("~~", "~~");
  const toggleH1 = () => insertText("# ", "", true);
  const toggleH2 = () => insertText("## ", "", true);
  const toggleH3 = () => insertText("### ", "", true);
  const toggleQuote = () => insertText("> ", "", true);
  const toggleBullet = () => insertText("- ", "", true);
  
  const insertHR = () => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const imageMarkdown = `\n---\n`;
    const newValue = value.slice(0, start) + imageMarkdown + value.slice(start);
    onChange(newValue);
    setTimeout(() => el.setSelectionRange(start + imageMarkdown.length, start + imageMarkdown.length), 0);
  };

  const insertLink = () => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end) || "link text";
    const url = prompt("Enter URL:", "https://");
    if (!url) return;
    
    const linkMarkdown = `[${selected}](${url})`;
    const newValue = value.slice(0, start) + linkMarkdown + value.slice(end);
    onChange(newValue);
    setTimeout(() => el.setSelectionRange(start + linkMarkdown.length, start + linkMarkdown.length), 0);
  };

  /** Handle Image Upload */
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !onImageUpload) return;

    setIsUploading(true);
    try {
      const url = await onImageUpload(file);
      if (url) {
        const el = textareaRef.current;
        const start = el.selectionStart;
        const end = el.selectionEnd;
        const imageMarkdown = `\n![Image Description](${url})\n`;
        const newValue = value.slice(0, start) + imageMarkdown + value.slice(end);
        onChange(newValue);
        requestAnimationFrame(() => {
          el.focus();
          const newPos = start + imageMarkdown.length;
          el.setSelectionRange(newPos, newPos);
        });
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const toolbarBtn =
    "p-1.5 rounded hover:bg-[#E5DFD3] text-[#4A3B2A] transition-colors flex items-center justify-center disabled:opacity-50 relative group/btn";

  return (
    <div className={`border border-gray-300 rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-[#4A3B2A] focus-within:border-[#4A3B2A] ${className}`}>
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        className="hidden"
        accept="image/*"
      />

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-1 px-2 py-1.5 bg-[#F3EFE9] border-b border-gray-300">
        {/* Group 1: Typography */}
        <div className="flex items-center gap-0.5 bg-white/50 p-0.5 rounded border border-gray-200">
          <button type="button" title="Bold" onClick={toggleBold} className={toolbarBtn}><Bold size={14} strokeWidth={2.5} /></button>
          <button type="button" title="Italic" onClick={toggleItalic} className={toolbarBtn}><Italic size={14} strokeWidth={2.5} /></button>
          <button type="button" title="Strikethrough" onClick={toggleStrike} className={toolbarBtn}><Strikethrough size={14} strokeWidth={2} /></button>
        </div>

        {/* Group 2: Headers */}
        <div className="flex items-center gap-0.5 bg-white/50 p-0.5 rounded border border-gray-200 relative">
          <button 
            type="button" 
            title="Headings" 
            onClick={() => setShowHeadings(!showHeadings)} 
            className={`${toolbarBtn} ${showHeadings ? "bg-[#E5DFD3]" : ""}`}
          >
            <Heading1 size={14} strokeWidth={2.5} />
            {showHeadings && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 shadow-xl rounded-md z-50 flex flex-col p-1 min-w-[40px] animate-in fade-in slide-in-from-top-1">
                <button type="button" onClick={() => { toggleH1(); setShowHeadings(false); }} className="p-2 hover:bg-gray-100 rounded text-left flex items-center gap-2"><Heading1 size={14} /><span className="text-[10px] font-bold uppercase tracking-tighter">H1</span></button>
                <button type="button" onClick={() => { toggleH2(); setShowHeadings(false); }} className="p-2 hover:bg-gray-100 rounded text-left flex items-center gap-2"><Heading2 size={14} /><span className="text-[10px] font-bold uppercase tracking-tighter">H2</span></button>
                <button type="button" onClick={() => { toggleH3(); setShowHeadings(false); }} className="p-2 hover:bg-gray-100 rounded text-left flex items-center gap-2"><Heading3 size={14} /><span className="text-[10px] font-bold uppercase tracking-tighter">H3</span></button>
              </div>
            )}
          </button>
        </div>

        {/* Group 3: Blocks */}
        <div className="flex items-center gap-0.5 bg-white/50 p-0.5 rounded border border-gray-200">
          <button type="button" title="Bullet List" onClick={toggleBullet} className={toolbarBtn}><List size={14} strokeWidth={2.5} /></button>
          <button type="button" title="Blockquote" onClick={toggleQuote} className={toolbarBtn}><Quote size={14} strokeWidth={2.5} /></button>
          <button type="button" title="Horizontal Rule" onClick={insertHR} className={toolbarBtn}><Minus size={14} strokeWidth={2.5} /></button>
        </div>

        {/* Group 4: Links & Media */}
        <div className="flex items-center gap-0.5 bg-white/50 p-0.5 rounded border border-gray-200">
          <button type="button" title="Insert Link" onClick={insertLink} className={toolbarBtn}><LinkIcon size={14} strokeWidth={2.5} /></button>
          {onImageUpload && (
            <button type="button" title="Upload Image" onClick={() => fileInputRef.current?.click()} disabled={isUploading} className={toolbarBtn}>
              {isUploading ? <Loader2 size={14} className="animate-spin" /> : <ImageIcon size={14} strokeWidth={2.5} />}
            </button>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Preview toggle */}
        <button
          type="button"
          title={showPreview ? "Hide preview" : "Show formatted preview"}
          onClick={() => setShowPreview((p) => !p)}
          className={`${toolbarBtn} text-xs gap-1 px-3 py-1 bg-white border border-gray-200 ${showPreview ? "bg-[#E5DFD3] border-[#4A3B2A]/30" : ""}`}
        >
          {showPreview ? <EyeOff size={13} /> : <Eye size={13} />}
          <span className="hidden sm:inline text-[11px] font-bold uppercase tracking-wider">Preview</span>
        </button>
      </div>

      {/* ── Textarea ── */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        onFocus={() => setShowHeadings(false)}
        className="w-full px-4 py-3 text-sm text-gray-800 bg-white focus:outline-none resize-y leading-relaxed font-mono"
      />

      {/* ── Live Preview Panel ── */}
      {showPreview && (
        <div className="border-t border-gray-200 bg-gray-50 px-5 py-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
            <span className="w-4 h-px bg-gray-300" />
            Live Preview
          </p>
          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm max-w-3xl mx-auto">
            {value.trim() ? (
              <RichTextRenderer
                text={value}
                className="text-base text-gray-800 leading-loose"
                paragraphClass="mb-6"
              />
            ) : (
              <p className="text-sm text-gray-400 italic text-center py-10">Start writing to see the preview...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
