import React, { useState, useEffect, useRef, useCallback } from "react";
import { api, IMAGE_BASE_URL } from "../../../services/api";
import RichTextEditor from "../../../components/admin/RichTextEditor";

const CATEGORIES = [
  "Heritage Trails",
  "Wildlife Encounters",
  "Cultural Windows",
  "Journey Insights",
  "Photo Essays",
  "Travel Anecdotes",
];

const toISODate = (dateStr) => {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toISOString().split("T")[0];
  } catch {
    return "";
  }
};

const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const BlogForm = ({ editBlog = null, onSaved, onCancel }) => {
  const isEdit = !!editBlog;

  const defaultForm = {
    title: "",
    excerpt: "",
    content: "",
    author: "",
    featured: false,
    publishDate: new Date().toISOString().split("T")[0],
    category: "Journey Insights",
    destination: "",
    isDraft: false,
    featuredImage: null,
  };

  const [formData, setFormData] = useState(() =>
    isEdit
      ? {
          ...defaultForm,
          title: editBlog.title || "",
          excerpt: editBlog.excerpt || "",
          content: editBlog.content || "",
          author: editBlog.author || "",
          featured: editBlog.featured || false,
          publishDate: toISODate(editBlog.publishDate),
          category: editBlog.category || "Journey Insights",
          destination: editBlog.destination || "",
          isDraft: editBlog.isDraft || false,
          featuredImage: null,
        }
      : defaultForm
  );

  const [currentImage, setCurrentImage] = useState(
    isEdit ? editBlog.featuredImage || "" : ""
  );
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [imageStats, setImageStats] = useState([]);
  const [autosaveStatus, setAutosaveStatus] = useState(""); // "saving" | "saved" | ""
  const autosaveTimer = useRef(null);
  const savedBlogId = useRef(isEdit ? editBlog._id : null);

  const showMsg = (type, text, ms = 5000) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), ms);
  };

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFile = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, featuredImage: e.target.files[0] }));
    }
  };

  // Autosave logic — only for existing blogs or after first save
  const triggerAutosave = useCallback(async () => {
    if (!savedBlogId.current) return;
    setAutosaveStatus("saving");
    try {
      await api.autosaveBlog(savedBlogId.current, {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        author: formData.author,
        featured: formData.featured,
        publishDate: formData.publishDate,
        category: formData.category,
        destination: formData.destination,
      });
      setAutosaveStatus("saved");
      setTimeout(() => setAutosaveStatus(""), 2500);
    } catch {
      setAutosaveStatus("");
    }
  }, [formData]);

  useEffect(() => {
    if (!isEdit) return; // Only autosave for existing
    clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      triggerAutosave();
    }, 3000);
    return () => clearTimeout(autosaveTimer.current);
  }, [formData, triggerAutosave, isEdit]);

  const buildFormData = (asDraft) => {
    const fd = new FormData();
    fd.append("title", formData.title);
    fd.append("excerpt", formData.excerpt);
    fd.append("content", formData.content);
    fd.append("author", formData.author);
    fd.append("featured", formData.featured);
    fd.append("publishDate", formData.publishDate);
    fd.append("category", formData.category);
    fd.append("destination", formData.destination);
    fd.append("isDraft", asDraft ? "true" : "false");
    if (formData.featuredImage) fd.append("featuredImage", formData.featuredImage);
    return fd;
  };

  const handleSubmit = async (e, asDraft = false) => {
    e?.preventDefault();
    if (!formData.title.trim()) {
      showMsg("error", "Title is required.");
      return;
    }
    setIsSaving(true);
    try {
      let res;
      if (isEdit) {
        res = await api.updateBlog(editBlog._id, buildFormData(asDraft));
      } else {
        res = await api.createBlog(buildFormData(asDraft));
        savedBlogId.current = res.blog._id;
      }
      setCurrentImage(res.blog.featuredImage || "");
      setImageStats(res.imageStats || []);
      let msg = isEdit
        ? "Blog updated successfully!"
        : asDraft
        ? "Draft saved!"
        : "Blog published!";
      if (res.imageStats?.length) {
        msg +=
          " Compression: " +
          res.imageStats.map((s) => `${s.field} (${s.savedPercent}%)`).join(", ");
      }
      showMsg("success", msg, 6000);
      if (onSaved) onSaved(res.blog);
    } catch (err) {
      showMsg("error", err.message || "Failed to save blog.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditorImageUpload = async (file) => {
    const slug = editBlog?.slug || slugify(formData.title);
    if (!slug) {
      alert("Please enter a title first to enable image uploads.");
      return null;
    }
    try {
      const res = await api.uploadBlogEditorImage(slug, file);
      return res.url;
    } catch (error) {
      throw error;
    }
  };

  const inputClass =
    "w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-[#4A3B2A] focus:border-[#4A3B2A] focus:outline-none";
  const fileInputClass =
    "block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#F3EFE9] file:text-[#4A3B2A] hover:file:bg-[#E5DFD3]";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#4A3B2A]">
          {isEdit ? `Editing: ${editBlog.title}` : "Create New Blog"}
        </h3>
        <div className="flex items-center gap-3">
          {autosaveStatus && (
            <span
              className={`text-xs ${
                autosaveStatus === "saving" ? "text-blue-500" : "text-green-600"
              }`}
            >
              {autosaveStatus === "saving" ? "Autosaving…" : "Draft saved ✓"}
            </span>
          )}
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-1 rounded-md"
            >
              ← Back
            </button>
          )}
        </div>
      </div>

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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInput}
            required
            placeholder="Enter blog title..."
            className={inputClass}
          />
          {formData.title && (
            <p className="text-xs text-gray-400 mt-1">
              Slug: <code>{slugify(formData.title)}</code>
            </p>
          )}
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Short Excerpt
          </label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleInput}
            rows={3}
            placeholder="A brief description of the blog (shown in cards)..."
            className={inputClass + " resize-none"}
          />
        </div>

        {/* Full Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Content (Rich Text)
          </label>
          <RichTextEditor
            value={formData.content}
            onChange={(val) => setFormData((prev) => ({ ...prev, content: val }))}
            onImageUpload={handleEditorImageUpload}
            rows={16}
            placeholder="Start your story here... Use the toolbar above for Headers, Links, Quotes, and Images. Supports full Markdown-style formatting!"
          />
        </div>

        {/* Row: Author + Destination */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleInput}
              placeholder="Author name"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destination
            </label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleInput}
              placeholder="e.g. Rajasthan, India"
              className={inputClass}
            />
          </div>
        </div>

        {/* Row: Category + Publish Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInput}
              className={inputClass}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Publish Date
            </label>
            <input
              type="date"
              name="publishDate"
              value={formData.publishDate}
              onChange={handleInput}
              className={inputClass}
            />
          </div>
        </div>

        {/* Featured toggle */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-md">
          <input
            type="checkbox"
            id="featured"
            name="featured"
            checked={formData.featured}
            onChange={handleInput}
            className="w-4 h-4 accent-[#4A3B2A] cursor-pointer"
          />
          <label htmlFor="featured" className="text-sm font-medium text-gray-700 cursor-pointer">
            Featured Blog
            <span className="block text-xs text-gray-400 font-normal mt-0.5">
              Featured blogs appear at the top of the blogs listing page
            </span>
          </label>
        </div>

        {/* Featured Image */}
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Featured Image (1920×1080px recommended)
          </label>
          {currentImage && (
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-1">Current:</p>
              <img
                src={`${IMAGE_BASE_URL}${currentImage}`}
                alt="Featured"
                className="h-36 w-auto object-contain rounded bg-white border border-gray-200"
              />
            </div>
          )}
          <input
            type="file"
            name="featuredImage"
            accept="image/*"
            onChange={handleFile}
            className={fileInputClass}
          />
        </div>

        {/* Compression stats */}
        {imageStats.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm">
            <p className="font-medium text-blue-800 mb-1">Compression Results:</p>
            {imageStats.map((stat, i) => (
              <p key={i} className="text-blue-700">
                <strong>{stat.field}</strong>: {(stat.originalSize / 1024).toFixed(0)}KB →{" "}
                {(stat.compressedSize / 1024).toFixed(0)}KB (
                <span className="text-green-700 font-semibold">{stat.savedPercent}% saved</span>)
              </p>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={isSaving}
            className="px-5 py-2 border border-[#4A3B2A]/30 text-[#4A3B2A] rounded-md text-sm font-medium hover:border-[#4A3B2A] transition-colors disabled:opacity-60"
          >
            {isSaving ? "Saving…" : "Save as Draft"}
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2 bg-[#4A3B2A] text-white rounded-md text-sm font-medium hover:bg-[#3A2E20] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSaving ? "Publishing…" : isEdit ? "Update Blog" : "Publish Blog"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
