import React, { useEffect, useState } from "react";
import { api, IMAGE_BASE_URL } from "../../../services/api";

const VoicesManager = () => {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image: null,
  });
  const [currentImage, setCurrentImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [imageStats, setImageStats] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(0);

  const showMsg = (type, text, ms = 5000) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), ms);
  };

  useEffect(() => {
    let ignore = false;

    const loadData = async () => {
      setIsLoading(true);
      try {
        const pageData = await api.getStoriesPage();

        if (ignore) return;

        const vs = pageData?.voicesSection || {};
        setFormData((prev) => ({
          ...prev,
          title: vs.title || "Voices from the Trail",
          subtitle: vs.subtitle || "Hear from those who have journeyed with us.",
        }));
        setCurrentImage(vs.image || "");
      } catch {
        if (!ignore) showMsg("error", "Failed to load section data.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    loadData();

    return () => {
      ignore = true;
    };
  }, []);

  const handleInput = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const form = new FormData();
    form.append("title", formData.title);
    form.append("subtitle", formData.subtitle);
    if (formData.image) form.append("image", formData.image);

    try {
      const res = await api.updateVoicesSection(form);
      const vs = res.page?.voicesSection || {};
      setCurrentImage(vs.image || "");
      setImageStats(res.imageStats || []);
      setFormData((prev) => ({
        ...prev,
        image: null,
      }));
      setFileInputKey((key) => key + 1);

      let msg = "Voices from the Trail section updated!";
      if (res.imageStats?.length) {
        msg +=
          " Compression: " +
          res.imageStats
            .map((stat) => `${stat.field} (${stat.savedPercent}% saved)`)
            .join(", ");
      }
      showMsg("success", msg, 6000);
    } catch (err) {
      showMsg("error", err.message || "Failed to save.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <p className="py-4 text-gray-500">Loading...</p>;

  const inputClass =
    "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#4A3B2A] focus:outline-none focus:ring-[#4A3B2A]";
  const fileInputClass =
    "block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-[#F3EFE9] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[#4A3B2A] hover:file:bg-[#E5DFD3]";

  return (
    <div className="space-y-6">
      {message.text && (
        <div
          className={`rounded-md p-4 text-sm ${
            message.type === "success"
              ? "border border-green-200 bg-green-50 text-green-800"
              : "border border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInput}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
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

        <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Image (single image, recommended 16:9 or similar landscape format)
          </label>
          {currentImage && (
            <div className="mb-3">
              <p className="mb-1 text-xs text-gray-500">Current:</p>
              <img
                src={`${IMAGE_BASE_URL}${currentImage}`}
                alt="Current Voices Section"
                className="h-36 w-auto rounded border border-gray-200 bg-white object-contain"
              />
            </div>
          )}
          <input
            key={fileInputKey}
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFile}
            className={fileInputClass}
          />
          <p className="mt-2 text-xs text-gray-500">
            The uploaded image is compressed automatically when saved. Replacing it
            deletes the previous image.
          </p>
        </div>

        {imageStats.length > 0 && (
          <div className="rounded-md border border-green-200 bg-green-50 p-4 text-sm">
            <p className="mb-2 font-medium text-green-800">Compression Results:</p>
            <ul className="space-y-1">
              {imageStats.map((stat) => (
                <li key={`${stat.field}-${stat.originalName}`} className="text-green-700">
                  <strong>{stat.field}</strong> - {stat.originalName}:{" "}
                  {(stat.originalSize / 1024).toFixed(0)}KB to{" "}
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
            className="rounded-md bg-[#4A3B2A] px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-[#3A2E20] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save Section"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VoicesManager;
