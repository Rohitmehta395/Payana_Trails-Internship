import React, { useRef, useState } from "react";
import { Bold, Italic, List, Eye, EyeOff } from "lucide-react";
import RichTextRenderer from "../common/RichTextRenderer";

/**
 * RichTextEditor
 * Admin textarea with bold/italic/bullet toolbar, live preview, and toggle support.
 *
 * Markup stored in DB:
 *   **text**  → bold
 *   *text*    → italic (single asterisks only)
 *   - text    → bullet (at start of line)
 *
 * Toolbar buttons TOGGLE: applying bold to already-bolded text removes the markers.
 */
const RichTextEditor = ({
  value = "",
  onChange,
  rows = 5,
  placeholder = "Write content here...",
  className = "",
}) => {
  const textareaRef = useRef(null);
  const [showPreview, setShowPreview] = useState(false);

  /** Toggle **bold** markers around the current selection */
  const toggleBold = () => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end);

    let newValue;
    let newStart, newEnd;

    // Check if selection is already wrapped in **...**
    if (selected.startsWith("**") && selected.endsWith("**") && selected.length > 4) {
      // Unwrap
      const inner = selected.slice(2, -2);
      newValue = value.slice(0, start) + inner + value.slice(end);
      newStart = start;
      newEnd = start + inner.length;
    } else {
      // Check if surrounding chars are ** (selection without the markers)
      const before = value.slice(Math.max(0, start - 2), start);
      const after = value.slice(end, end + 2);
      if (before === "**" && after === "**") {
        // Remove surrounding **
        newValue =
          value.slice(0, start - 2) + selected + value.slice(end + 2);
        newStart = start - 2;
        newEnd = newStart + selected.length;
      } else {
        // Wrap
        newValue = value.slice(0, start) + "**" + selected + "**" + value.slice(end);
        newStart = start + 2;
        newEnd = end + 2;
      }
    }

    onChange(newValue);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(newStart, newEnd);
    });
  };

  /** Toggle *italic* markers around the current selection */
  const toggleItalic = () => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end);

    let newValue;
    let newStart, newEnd;

    // Check if selection itself is *...*  (not **)
    if (
      selected.startsWith("*") &&
      selected.endsWith("*") &&
      selected.length > 2 &&
      !selected.startsWith("**")
    ) {
      // Unwrap
      const inner = selected.slice(1, -1);
      newValue = value.slice(0, start) + inner + value.slice(end);
      newStart = start;
      newEnd = start + inner.length;
    } else {
      // Check surrounding single * (not **)
      const charBefore = value.slice(start - 1, start);
      const charAfter = value.slice(end, end + 1);
      const doubleBefore = value.slice(start - 2, start);
      const doubleAfter = value.slice(end, end + 2);
      if (
        charBefore === "*" &&
        charAfter === "*" &&
        doubleBefore !== "**" &&
        doubleAfter !== "**"
      ) {
        // Remove surrounding *
        newValue =
          value.slice(0, start - 1) + selected + value.slice(end + 1);
        newStart = start - 1;
        newEnd = newStart + selected.length;
      } else {
        // Wrap
        newValue = value.slice(0, start) + "*" + selected + "*" + value.slice(end);
        newStart = start + 1;
        newEnd = end + 1;
      }
    }

    onChange(newValue);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(newStart, newEnd);
    });
  };

  /** Toggle bullet "- " at the start of the current line */
  const toggleBullet = () => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const lineContent = value.slice(lineStart);

    let newValue;
    let newCursor;

    if (lineContent.startsWith("- ")) {
      newValue = value.slice(0, lineStart) + value.slice(lineStart + 2);
      newCursor = Math.max(lineStart, start - 2);
    } else {
      newValue = value.slice(0, lineStart) + "- " + value.slice(lineStart);
      newCursor = start + 2;
    }

    onChange(newValue);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(newCursor, newCursor);
    });
  };

  const toolbarBtn =
    "p-1.5 rounded hover:bg-[#E5DFD3] text-[#4A3B2A] transition-colors flex items-center justify-center";

  return (
    <div className={`border border-gray-300 rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-[#4A3B2A] focus-within:border-[#4A3B2A] ${className}`}>
      {/* ── Toolbar ── */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 bg-[#F3EFE9] border-b border-gray-300">
        <button
          type="button"
          title="Bold — select text then click (click again to remove)"
          onClick={toggleBold}
          className={toolbarBtn}
        >
          <Bold size={14} strokeWidth={2.5} />
        </button>
        <button
          type="button"
          title="Italic — select text then click (click again to remove)"
          onClick={toggleItalic}
          className={toolbarBtn}
        >
          <Italic size={14} strokeWidth={2.5} />
        </button>
        <div className="w-px h-3.5 bg-gray-300 mx-1" />
        <button
          type="button"
          title="Bullet list — toggles '- ' on the current line"
          onClick={toggleBullet}
          className={toolbarBtn}
        >
          <List size={14} strokeWidth={2.5} />
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Preview toggle */}
        <button
          type="button"
          title={showPreview ? "Hide preview" : "Show formatted preview"}
          onClick={() => setShowPreview((p) => !p)}
          className={`${toolbarBtn} text-xs gap-1 px-2 ${showPreview ? "bg-[#E5DFD3]" : ""}`}
        >
          {showPreview ? <EyeOff size={13} /> : <Eye size={13} />}
          <span className="hidden sm:inline text-[11px]">Preview</span>
        </button>
      </div>

      {/* ── Textarea ── */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none resize-y leading-relaxed"
      />

      {/* ── Live Preview Panel ── */}
      {showPreview && (
        <div className="border-t border-gray-200 bg-gray-50 px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
            Preview
          </p>
          {value.trim() ? (
            <RichTextRenderer
              text={value}
              className="text-sm text-gray-800 leading-relaxed"
              paragraphClass="mb-1.5"
            />
          ) : (
            <p className="text-xs text-gray-400 italic">Nothing to preview yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
