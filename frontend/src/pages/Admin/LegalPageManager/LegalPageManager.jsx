import React, { useState, useEffect, useRef, useCallback } from "react";
import { api } from "../../../services/api";
import RichTextEditor from "../../../components/admin/RichTextEditor";

const PAGE_TYPES = [
  { type: "privacy-policy", label: "Privacy Policy" },
  { type: "terms-and-conditions", label: "Terms & Conditions" },
];

const LegalPageEditor = ({ type, label }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isDraft, setIsDraft] = useState(true);
  const [lastPublishedAt, setLastPublishedAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [autosaveStatus, setAutosaveStatus] = useState("");
  const autosaveTimer = useRef(null);
  const hasLoaded = useRef(false);

  const showMsg = (msgType, text, ms = 5000) => {
    setMessage({ type: msgType, text });
    setTimeout(() => setMessage({ type: "", text: "" }), ms);
  };

  // Fetch data on mount
  useEffect(() => {
    setLoading(true);
    hasLoaded.current = false;
    api
      .getLegalPageAdmin(type)
      .then((data) => {
        // If there's autosaved draft data, restore it
        if (data.draftData) {
          setTitle(data.draftData.title ?? data.title ?? label);
          setContent(data.draftData.content ?? data.content ?? "");
        } else {
          setTitle(data.title || label);
          setContent(data.content || "");
        }
        setIsDraft(data.isDraft !== false);
        setLastPublishedAt(data.lastPublishedAt || null);
        // Allow autosave after initial load settles
        setTimeout(() => {
          hasLoaded.current = true;
        }, 500);
      })
      .catch((err) => {
        console.error("Failed to load legal page:", err);
        setTitle(label);
        hasLoaded.current = true;
      })
      .finally(() => setLoading(false));
  }, [type, label]);

  // Autosave logic — debounce 3 seconds after changes
  const triggerAutosave = useCallback(async () => {
    setAutosaveStatus("saving");
    try {
      await api.autosaveLegalPage(type, { title, content });
      setAutosaveStatus("saved");
      setTimeout(() => setAutosaveStatus(""), 2500);
    } catch {
      setAutosaveStatus("");
    }
  }, [type, title, content]);

  useEffect(() => {
    if (!hasLoaded.current) return;
    clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      triggerAutosave();
    }, 3000);
    return () => clearTimeout(autosaveTimer.current);
  }, [title, content, triggerAutosave]);

  const handleSave = async (asDraft) => {
    if (!title.trim()) {
      showMsg("error", "Title is required.");
      return;
    }
    setIsSaving(true);
    try {
      const result = await api.updateLegalPage(type, {
        title: title.trim(),
        content,
        isDraft: asDraft,
      });
      setIsDraft(asDraft);
      if (!asDraft && result.page?.lastPublishedAt) {
        setLastPublishedAt(result.page.lastPublishedAt);
      }
      showMsg(
        "success",
        asDraft ? "Draft saved successfully!" : "Published successfully!",
        6000
      );
    } catch (err) {
      showMsg("error", err.message || "Failed to save.");
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-[#4A3B2A] focus:border-[#4A3B2A] focus:outline-none";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-[#4A3B2A]/20 border-t-[#4A3B2A] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-lg font-semibold text-[#4A3B2A]">{label}</h3>
          <div className="flex items-center gap-3 mt-1">
            {isDraft ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                Draft
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                Published
              </span>
            )}
            {lastPublishedAt && (
              <span className="text-xs text-gray-400">
                Last published:{" "}
                {new Date(lastPublishedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
          </div>
        </div>
        {autosaveStatus && (
          <span
            className={`text-xs ${
              autosaveStatus === "saving" ? "text-blue-500" : "text-green-600"
            }`}
          >
            {autosaveStatus === "saving" ? "Autosaving…" : "Draft saved ✓"}
          </span>
        )}
      </div>

      {/* Messages */}
      {message.text && (
        <div
          className={`p-4 rounded-md text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Page Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={`Enter ${label.toLowerCase()} title...`}
          className={inputClass}
        />
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Page Content (Rich Text)
        </label>
        <RichTextEditor
          value={content}
          onChange={(val) => setContent(val || "")}
          rows={20}
          placeholder={`Write your ${label.toLowerCase()} content here... Use the toolbar for headings, bold, italic, lists, and more.`}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={() => handleSave(true)}
          disabled={isSaving}
          className="px-5 py-2 border border-[#4A3B2A]/30 text-[#4A3B2A] rounded-md text-sm font-medium hover:border-[#4A3B2A] transition-colors disabled:opacity-60 cursor-pointer"
        >
          {isSaving ? "Saving…" : "Save as Draft"}
        </button>
        <button
          type="button"
          onClick={() => handleSave(false)}
          disabled={isSaving}
          className="px-6 py-2 bg-[#4A3B2A] text-white rounded-md text-sm font-medium hover:bg-[#3A2E20] transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSaving ? "Publishing…" : "Publish"}
        </button>
      </div>
    </div>
  );
};

const LegalPageManager = () => {
  const [activeType, setActiveType] = useState(PAGE_TYPES[0].type);

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="flex border-b border-gray-200">
        {PAGE_TYPES.map((pt) => (
          <button
            key={pt.type}
            onClick={() => setActiveType(pt.type)}
            className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px cursor-pointer ${
              activeType === pt.type
                ? "border-[#4A3B2A] text-[#4A3B2A]"
                : "border-transparent text-gray-500 hover:text-[#4A3B2A] hover:border-gray-300"
            }`}
          >
            {pt.label}
          </button>
        ))}
      </div>

      {/* Editor for active type */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {PAGE_TYPES.map((pt) =>
          pt.type === activeType ? (
            <LegalPageEditor key={pt.type} type={pt.type} label={pt.label} />
          ) : null
        )}
      </div>
    </div>
  );
};

export default LegalPageManager;
