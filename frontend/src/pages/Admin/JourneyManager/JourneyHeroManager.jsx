import React, { useState, useEffect } from "react";
import { api } from "../../../services/api";

const JourneyHeroManager = () => {
  const [formData, setFormData] = useState({
    miniTitle: "",
    mainTitle: "",
    subtitle: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const showAutoHidingMessage = (type, text, timeout = 4000) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), timeout);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await api.getJourneyPage();
      if (data?.hero) {
        setFormData({
          miniTitle: data.hero.miniTitle || "",
          mainTitle: data.hero.mainTitle || "",
          subtitle: data.hero.subtitle || "",
        });
      }
    } catch (error) {
      console.error("Error fetching Hero section data:", error);
      showAutoHidingMessage("error", "Failed to load section data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.updateJourneyHeroSection(formData);
      showAutoHidingMessage("success", "Hero section updated successfully!");
    } catch (error) {
      console.error("Error saving Hero section:", error);
      showAutoHidingMessage("error", "Failed to save Hero section.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-gray-500">Loading section data...</div>;
  }

  return (
    <div className="space-y-6">
      {message.text && (
        <div
          className={`p-4 rounded-md ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mini Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mini Title
          </label>
          <input
            type="text"
            name="miniTitle"
            value={formData.miniTitle}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4A3B2A] focus:border-[#4A3B2A]"
            placeholder="e.g. Explore Our World"
          />
          <p className="mt-1 text-xs text-gray-500">
            Displayed as a small label above the main title.
          </p>
        </div>

        {/* Main Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Main Title{" "}
            <span className="text-gray-400 font-normal">(displayed in UPPERCASE)</span>
          </label>
          <textarea
            name="mainTitle"
            value={formData.mainTitle}
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4A3B2A] focus:border-[#4A3B2A] font-mono text-sm"
            placeholder={"e.g. JOURNEYS THAT STAY,\nLONG AFTER YOU RETURN"}
          />
          <p className="mt-1 text-xs text-gray-500">
            Use <strong>Enter / new lines</strong> to create line breaks on the
            frontend. Text is automatically displayed in uppercase.
          </p>
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subtitle
          </label>
          <textarea
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4A3B2A] focus:border-[#4A3B2A]"
            placeholder="Trails designed for those who value depth over distance..."
          />
          <p className="mt-1 text-xs text-gray-500">
            Use <strong>Enter / new lines</strong> to create line breaks on the
            frontend.
          </p>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className={`px-6 py-2 bg-[#4A3B2A] text-white rounded-md transition-colors ${
              isSaving ? "opacity-70 cursor-not-allowed" : "hover:bg-[#3A2E20]"
            }`}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JourneyHeroManager;
