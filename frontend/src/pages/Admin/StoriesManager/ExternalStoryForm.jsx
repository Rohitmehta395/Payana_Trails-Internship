import React, { useState, useEffect, useRef, useCallback } from "react";
import { api, IMAGE_BASE_URL } from "../../../services/api";

const CATEGORIES = [
  "Heritage Trails",
  "Wildlife Encounters",
  "Cultural Windows",
  "Journey Insights",
  "Photo Essays",
  "Travel Anecdotes",
];

const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const ExternalStoryForm = ({ editStory = null, onSaved, onCancel }) => {
  const isEdit = !!editStory;

  const defaultForm = {
    title: "",
    excerpt: "",
    author: "",
    category: "Journey Insights",
    destination: "",
    location: "",
    externalUrl: "",
    isDraft: false,
    featuredImage: null,
  };

  const [formData, setFormData] = useState(() =>
    isEdit
      ? {
          ...defaultForm,
          title: editStory.title || "",
          excerpt: editStory.excerpt || "",
          author: editStory.author || "",
          category: editStory.category || "Journey Insights",
          destination: editStory.destination || "",
          location: editStory.location || "",
          externalUrl: editStory.externalUrl || "",
          isDraft: editStory.isDraft || false,
          featuredImage: null,
        }
      : defaultForm
  );

  const [availableDestinations, setAvailableDestinations] = useState([]);
  const [isOtherDestination, setIsOtherDestination] = useState(false);

  const [currentImage, setCurrentImage] = useState(
    isEdit ? editStory.featuredImage || "" : ""
  );
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [imageStats, setImageStats] = useState([]);
  const [autosaveStatus, setAutosaveStatus] = useState("");
  const autosaveTimer = useRef(null);
  const savedStoryId = useRef(isEdit ? editStory._id : null);

  const showMsg = (type, text, ms = 5000) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), ms);
  };

  useEffect(() => {
    api.getDestinations(true).then(data => {
      const names = [...new Set(data.map(d => d.name))].sort();
      setAvailableDestinations(names);
      if (formData.destination && !names.includes(formData.destination)) {
        setIsOtherDestination(true);
      }
    }).catch(err => console.error("Error fetching destinations:", err));
  }, []);

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "destinationSelect") {
      if (value === "Other") {
        setIsOtherDestination(true);
        setFormData(prev => ({ ...prev, destination: "" }));
      } else {
        setIsOtherDestination(false);
        setFormData(prev => ({ ...prev, destination: value }));
      }
      return;
    }
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

  const triggerAutosave = useCallback(async () => {
    if (!savedStoryId.current) return;
    setAutosaveStatus("saving");
    try {
      await api.autosaveExternalStory(savedStoryId.current, {
        title: formData.title,
        excerpt: formData.excerpt,
        author: formData.author,
        category: formData.category,
        destination: formData.destination,
        location: formData.location,
        externalUrl: formData.externalUrl,
      });
      setAutosaveStatus("saved");
      setTimeout(() => setAutosaveStatus(""), 2500);
    } catch {
      setAutosaveStatus("");
    }
  }, [formData]);

  useEffect(() => {
    if (!isEdit) return;
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
    fd.append("author", formData.author);
    fd.append("category", formData.category);
    fd.append("destination", formData.destination);
    fd.append("location", formData.location);
    fd.append("externalUrl", formData.externalUrl);
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
    if (!formData.externalUrl.trim()) {
      showMsg("error", "External URL is required.");
      return;
    }
    setIsSaving(true);
    try {
      let res;
      if (isEdit) {
        res = await api.updateExternalStory(editStory._id, buildFormData(asDraft));
      } else {
        res = await api.createExternalStory(buildFormData(asDraft));
        savedStoryId.current = res.blog._id;
      }
      setCurrentImage(res.blog.featuredImage || "");
      setImageStats(res.imageStats || []);
      let msg = isEdit
        ? "Story updated successfully!"
        : asDraft
        ? "Draft saved!"
        : "Story published!";
      if (res.imageStats?.length) {
        msg +=
          " Compression: " +
          res.imageStats.map((s) => `${s.field} (${s.savedPercent}%)`).join(", ");
      }
      showMsg("success", msg, 6000);
      if (onSaved) onSaved(res.blog);
    } catch (err) {
      showMsg("error", err.message || "Failed to save story.");
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-[#4A3B2A] focus:border-[#4A3B2A] focus:outline-none";
  const fileInputClass =
    "block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#F3EFE9] file:text-[#4A3B2A] hover:file:bg-[#E5DFD3]";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#4A3B2A]">
          {isEdit ? `Editing: ${editStory.title}` : "Add External Story"}
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            External URL <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            name="externalUrl"
            value={formData.externalUrl}
            onChange={handleInput}
            required
            placeholder="https://example.com/blog-post"
            className={inputClass}
          />
        </div>

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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInput}
              placeholder="e.g. Amber Fort, Jaipur"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destination
            </label>
            <div className="space-y-2">
              <select
                name="destinationSelect"
                value={isOtherDestination ? "Other" : formData.destination}
                onChange={handleInput}
                className={inputClass}
              >
                <option value="">Select a destination</option>
                {availableDestinations.map((dest) => (
                  <option key={dest} value={dest}>
                    {dest}
                  </option>
                ))}
                <option value="Other">Other (Type manually)</option>
              </select>

              {isOtherDestination && (
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleInput}
                  placeholder="Type destination name..."
                  className={inputClass + " border-blue-200 bg-blue-50/30"}
                />
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Featured Image (Optional)
          </label>
          <p className="text-xs text-gray-500 mb-3">
            If left blank, we'll try to fetch the image from the External URL automatically.
          </p>
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
            {isSaving ? "Publishing…" : isEdit ? "Update Story" : "Publish Story"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExternalStoryForm;
