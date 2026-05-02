import React, { useState, useEffect } from "react";
import { api, IMAGE_BASE_URL } from "../../../services/api";

const JourneyPayanaJourneyManager = () => {
  const [formData, setFormData] = useState({
    italicText: "",
    normalText: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [currentImage, setCurrentImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const showAutoHidingMessage = (type, text, timeout = 5000) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), timeout);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await api.getJourneyPage();
      if (data?.payanaJourney) {
        setFormData({
          italicText: data.payanaJourney.italicText || "",
          normalText: data.payanaJourney.normalText || "",
        });
        setCurrentImage(data.payanaJourney.image || "");
      }
    } catch (error) {
      console.error("Error fetching Payana Journey data:", error);
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

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const form = new FormData();
      form.append("italicText", formData.italicText);
      form.append("normalText", formData.normalText);
      if (imageFile) {
        form.append("image", imageFile);
      }

      const responseData = await api.updateJourneyPayanaJourneySection(form);
      const { page, imageStats } = responseData;

      if (page?.payanaJourney?.image !== undefined) {
        setCurrentImage(page.payanaJourney.image || "");
      }

      setImageFile(null);

      let successMsg = "Payana Journey section updated successfully!";
      if (imageStats && imageStats.length > 0) {
        successMsg += " Compression saved: ";
        successMsg += imageStats
          .map((stat) => `${stat.field} (${stat.savedPercent}%)`)
          .join(", ");
      }

      showAutoHidingMessage("success", successMsg, 6000);
    } catch (error) {
      console.error("Error saving Payana Journey section:", error);
      showAutoHidingMessage("error", "Failed to save Payana Journey section.");
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
        {/* Italic Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Italic Text{" "}
            <span className="text-gray-400 font-normal">
              (displayed in italic on frontend)
            </span>
          </label>
          <textarea
            name="italicText"
            value={formData.italicText}
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4A3B2A] focus:border-[#4A3B2A] font-mono text-sm"
            placeholder={`Every Payana journey\nis carefully designed`}
          />
          <p className="mt-1 text-xs text-gray-500">
            <strong>Line 1</strong> (before Enter) → shown non-italic with an opening quote <code>&quot;</code>.<br />
            <strong>Line 2</strong> (after Enter) → shown in italic. Use Enter to split them.
          </p>
        </div>

        {/* Normal Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Normal Text{" "}
            <span className="text-gray-400 font-normal">
              (displayed below in regular style)
            </span>
          </label>
          <textarea
            name="normalText"
            value={formData.normalText}
            onChange={handleChange}
            required
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4A3B2A] focus:border-[#4A3B2A]"
            placeholder="e.g. to balance exploration with comfort and time to absorb the landscape."
          />
          <p className="mt-1 text-xs text-gray-500">
            Use <strong>Enter / new lines</strong> to create line breaks on the
            frontend.
          </p>
        </div>

        {/* Background Image */}
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Background Image
          </label>

          {currentImage ? (
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-1">Current Image:</p>
              <img
                src={`${IMAGE_BASE_URL}${currentImage}`}
                alt="Payana Journey background"
                className="h-32 w-full object-cover rounded-md bg-white border border-gray-200"
              />
            </div>
          ) : (
            <p className="text-xs text-gray-400 mb-2 italic">
              No image uploaded. The hardcoded fallback image will be used.
            </p>
          )}

          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#F3EFE9] file:text-[#4A3B2A] hover:file:bg-[#E5DFD3]"
          />
          <p className="mt-1 text-xs text-gray-500">
            Uploaded to{" "}
            <code className="bg-gray-100 px-1 rounded">
              uploads/journey/payanaWay/
            </code>
            . Image will be compressed automatically. Old image will be deleted
            when replaced.
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

export default JourneyPayanaJourneyManager;
