import React, { useState, useEffect } from "react";
import { api, IMAGE_BASE_URL } from "../../../services/api";

const TravelStoriesManager = () => {
  const [formData, setFormData] = useState({
    mainTitle: "",
    subtitle: "",
    image1: null,
    image2: null,
  });
  const [currentImages, setCurrentImages] = useState({ image1: "", image2: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [imageStats, setImageStats] = useState([]);

  const showMsg = (type, text, ms = 5000) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), ms);
  };

  useEffect(() => {
    setIsLoading(true);
    api
      .getStoriesPage()
      .then((data) => {
        const ts = data?.travelStories || {};
        setFormData((prev) => ({
          ...prev,
          mainTitle: ts.mainTitle || "",
          subtitle: ts.subtitle || "",
        }));
        setCurrentImages({ image1: ts.image1 || "", image2: ts.image2 || "" });
      })
      .catch(() => showMsg("error", "Failed to load section data."))
      .finally(() => setIsLoading(false));
  }, []);

  const handleInput = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFile = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const form = new FormData();
    form.append("mainTitle", formData.mainTitle);
    form.append("subtitle", formData.subtitle);
    if (formData.image1) form.append("image1", formData.image1);
    if (formData.image2) form.append("image2", formData.image2);

    try {
      const res = await api.updateTravelStoriesSection(form);
      const ts = res.page?.travelStories || {};
      setCurrentImages({ image1: ts.image1 || "", image2: ts.image2 || "" });
      setImageStats(res.imageStats || []);
      setFormData((prev) => ({ ...prev, image1: null, image2: null }));

      let msg = "Travel Stories section updated!";
      if (res.imageStats?.length) {
        msg +=
          " Compression: " +
          res.imageStats
            .map((s) => `${s.field} (${s.savedPercent}% saved)`)
            .join(", ");
      }
      showMsg("success", msg, 6000);
    } catch (err) {
      showMsg("error", err.message || "Failed to save.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <p className="text-gray-500 py-4">Loading...</p>;

  const inputClass =
    "w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-[#4A3B2A] focus:border-[#4A3B2A] focus:outline-none";
  const fileInputClass =
    "block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#F3EFE9] file:text-[#4A3B2A] hover:file:bg-[#E5DFD3]";

  return (
    <div className="space-y-6">
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
        {/* Text fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Main Title
            </label>
            <input
              type="text"
              name="mainTitle"
              value={formData.mainTitle}
              onChange={handleInput}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subtitle
            </label>
            <input
              type="text"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleInput}
              required
              className={inputClass}
            />
          </div>
        </div>

        {/* Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {["image1", "image2"].map((key, i) => (
            <div key={key} className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vertical Image {i + 1} (Portrait, e.g. 900×1350px)
              </label>
              {currentImages[key] && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-1">Current:</p>
                  <img
                    src={`${IMAGE_BASE_URL}${currentImages[key]}`}
                    alt={`Image ${i + 1}`}
                    className="h-32 w-auto object-contain rounded bg-white border border-gray-200"
                  />
                </div>
              )}
              <input
                type="file"
                name={key}
                accept="image/*"
                onChange={handleFile}
                className={fileInputClass}
              />
            </div>
          ))}
        </div>

        {/* Compression stats */}
        {imageStats.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm">
            <p className="font-medium text-blue-800 mb-2">Compression Results:</p>
            <ul className="space-y-1">
              {imageStats.map((stat, i) => (
                <li key={i} className="text-blue-700">
                  <strong>{stat.field}</strong> — {stat.originalName}:{" "}
                  {(stat.originalSize / 1024).toFixed(0)}KB →{" "}
                  {(stat.compressedSize / 1024).toFixed(0)}KB (
                  <span className="font-semibold text-green-700">
                    {stat.savedPercent}% saved
                  </span>
                  )
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2 bg-[#4A3B2A] text-white rounded-md text-sm font-medium transition-colors hover:bg-[#3A2E20] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving…" : "Save Section"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TravelStoriesManager;
