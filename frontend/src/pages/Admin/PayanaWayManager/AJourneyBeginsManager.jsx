import React, { useState, useEffect } from "react";

import { api, IMAGE_BASE_URL } from "../../../services/api";
import RichTextEditor from "../../../components/admin/RichTextEditor";

const AJourneyBeginsManager = () => {
  const [formData, setFormData] = useState({
    mainTitle: "",

    subtitle: "",

    description: "",

    paragraph: "",

    name: "",

    occupation: "",

    adminImage: null,

    signatureImage: null,
  });

  const [currentImages, setCurrentImages] = useState({
    adminImage: "",

    signatureImage: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  const [message, setMessage] = useState({ type: "", text: "" });

  const fetchSectionData = async () => {
    setIsLoading(true);

    try {
      const responseData = await api.getPayanaWayPage();

      const { aJourneyBegins } = responseData;

      if (aJourneyBegins) {
        setFormData({
          mainTitle: aJourneyBegins.mainTitle || "",

          subtitle: aJourneyBegins.subtitle || "",

          description: aJourneyBegins.description || "",

          paragraph: aJourneyBegins.paragraph || "",

          name: aJourneyBegins.name || "",

          occupation: aJourneyBegins.occupation || "",

          adminImage: null,

          signatureImage: null,
        });

        setCurrentImages({
          adminImage: aJourneyBegins.adminImage || "",

          signatureImage: aJourneyBegins.signatureImage || "",
        });
      }
    } catch (error) {
      console.error("Error fetching 'A Journey Begins' data:", error);

      setMessage({ type: "error", text: "Failed to load section data." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSectionData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;

    if (files && files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const showAutoHidingMessage = (type, text, timeout = 3000) => {
    setMessage({ type, text });

    setTimeout(() => setMessage({ type: "", text: "" }), timeout);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSaving(true);

    // Validate mandatory images for new uploads if there are no existing images

    if (!currentImages.adminImage && !formData.adminImage) {
      showAutoHidingMessage("error", "Admin Image is required.");

      setIsSaving(false);

      return;
    }

    if (!currentImages.signatureImage && !formData.signatureImage) {
      showAutoHidingMessage("error", "Signature Image is required.");

      setIsSaving(false);

      return;
    }

    const form = new FormData();

    const dataToSend = {
      mainTitle: formData.mainTitle,

      subtitle: formData.subtitle,

      description: formData.description,

      paragraph: formData.paragraph,

      name: formData.name,

      occupation: formData.occupation,
    };

    form.append("data", JSON.stringify(dataToSend));

    if (formData.adminImage) form.append("adminImage", formData.adminImage);

    if (formData.signatureImage)
      form.append("signatureImage", formData.signatureImage);

    try {
      const responseData = await api.updateAJourneyBegins(form);

      const { page, imageStats } = responseData;

      if (page.aJourneyBegins) {
        setCurrentImages({
          adminImage: page.aJourneyBegins.adminImage || "",

          signatureImage: page.aJourneyBegins.signatureImage || "",
        });
      }

      let successMsg = "Section updated successfully!";

      if (imageStats && imageStats.length > 0) {
        successMsg += " Compression saved: ";

        const details = imageStats

          .map((stat) => `${stat.field} (${stat.savedPercent}%)`)

          .join(", ");

        successMsg += details;
      }

      showAutoHidingMessage("success", successMsg, 5000);

      setFormData((prev) => ({
        ...prev,

        adminImage: null,

        signatureImage: null,
      }));
    } catch (error) {
      console.error("Error saving data:", error);

      showAutoHidingMessage("error", "Failed to save section data.");
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
          className={`p-4 rounded-md ${message.type === "success" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Main Title
            </label>

            <input
              type="text"
              name="mainTitle"
              value={formData.mainTitle}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4A3B2A] focus:border-[#4A3B2A]"
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
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4A3B2A] focus:border-[#4A3B2A]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>

          <RichTextEditor
            value={formData.description}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, description: val }))
            }
            rows={4}
            placeholder="Write the description here... (supports **bold**, *italic*, - bullets)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Paragraph
          </label>

          <RichTextEditor
            value={formData.paragraph}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, paragraph: val }))
            }
            rows={4}
            placeholder="Write the paragraph here... (supports **bold**, *italic*, - bullets)"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name (Bold on UI)
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4A3B2A] focus:border-[#4A3B2A]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Occupation / Title (Italic on UI)
            </label>

            <input
              type="text"
              name="occupation"
              value={formData.occupation}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4A3B2A] focus:border-[#4A3B2A]"
              placeholder="e.g. Founder & Trail Curator"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Image (1920x1080px)
            </label>

            {currentImages.adminImage && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-1">Current Image:</p>

                <img
                  src={`${IMAGE_BASE_URL}${currentImages.adminImage}`}
                  alt="Admin"
                  className="w-full h-48 md:h-32 object-contain rounded-md bg-white border border-gray-200"
                />
              </div>
            )}

            <input
              type="file"
              name="adminImage"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#F3EFE9] file:text-[#4A3B2A] hover:file:bg-[#E5DFD3]"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Signature Image (500x300px)
            </label>

            {currentImages.signatureImage && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-1">Current Image:</p>

                <img
                  src={`${IMAGE_BASE_URL}${currentImages.signatureImage}`}
                  alt="Signature"
                  className="w-full h-24 md:h-16 object-contain rounded-md bg-white border border-gray-200"
                />
              </div>
            )}

            <input
              type="file"
              name="signatureImage"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#F3EFE9] file:text-[#4A3B2A] hover:file:bg-[#E5DFD3]"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className={`px-6 py-2 bg-[#4A3B2A] text-white rounded-md transition-colors ${isSaving ? "opacity-70 cursor-not-allowed" : "hover:bg-[#3A2E20]"}`}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AJourneyBeginsManager;
