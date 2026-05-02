import React, { useState, useEffect } from "react";
import { api, IMAGE_BASE_URL } from "../../../services/api";

const DEFAULT_TRAILS = [
  { title: "Wildlife Trails", iconImage: "" },
  { title: "Heritage Trails", iconImage: "" },
  { title: "Cultural & Immersive Trails", iconImage: "" },
];

const JourneyOurTrailsManager = () => {
  const [formData, setFormData] = useState({
    containerTitle: "",
    mainTitle: "",
    subtitle: "",
  });
  const [trails, setTrails] = useState(DEFAULT_TRAILS.map((t) => ({ ...t })));
  const [trailIconFiles, setTrailIconFiles] = useState([null, null, null]);
  const [currentIconImages, setCurrentIconImages] = useState(["", "", ""]);
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
      if (data?.ourTrails) {
        setFormData({
          containerTitle: data.ourTrails.containerTitle || "",
          mainTitle: data.ourTrails.mainTitle || "",
          subtitle: data.ourTrails.subtitle || "",
        });

        const fetchedTrails = data.ourTrails.trails || [];
        const merged = DEFAULT_TRAILS.map((def, i) => ({
          title: fetchedTrails[i]?.title || def.title,
          iconImage: fetchedTrails[i]?.iconImage || "",
        }));
        setTrails(merged);
        setCurrentIconImages(merged.map((t) => t.iconImage));
      }
    } catch (error) {
      console.error("Error fetching Our Trails data:", error);
      showAutoHidingMessage("error", "Failed to load section data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTrailTitleChange = (index, value) => {
    setTrails((prev) =>
      prev.map((t, i) => (i === index ? { ...t, title: value } : t))
    );
  };

  const handleIconFileChange = (index, e) => {
    const file = e.target.files?.[0] || null;
    setTrailIconFiles((prev) => prev.map((f, i) => (i === index ? file : f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const form = new FormData();
      form.append("containerTitle", formData.containerTitle);
      form.append("mainTitle", formData.mainTitle);
      form.append("subtitle", formData.subtitle);

      const trailsData = trails.map((t, i) => ({
        title: t.title,
        iconImage: currentIconImages[i] || "",
      }));
      form.append("trailsData", JSON.stringify(trailsData));

      // Append icon files with dynamic field names
      trailIconFiles.forEach((file, i) => {
        if (file) {
          form.append(`trailIcon_${i}`, file);
        }
      });

      const responseData = await api.updateJourneyOurTrailsSection(form);
      const { page, imageStats } = responseData;

      // Update current icon images from response
      if (page?.ourTrails?.trails) {
        setCurrentIconImages(
          page.ourTrails.trails.map((t) => t.iconImage || "")
        );
        setTrails(
          page.ourTrails.trails.map((t, i) => ({
            title: t.title || DEFAULT_TRAILS[i]?.title || "",
            iconImage: t.iconImage || "",
          }))
        );
      }

      // Reset file inputs
      setTrailIconFiles([null, null, null]);

      let successMsg = "Our Trails section updated successfully!";
      if (imageStats && imageStats.length > 0) {
        successMsg += " Compression saved: ";
        successMsg += imageStats
          .map((stat) => `${stat.field} (${stat.savedPercent}%)`)
          .join(", ");
      }

      showAutoHidingMessage("success", successMsg, 6000);
    } catch (error) {
      console.error("Error saving Our Trails section:", error);
      showAutoHidingMessage("error", "Failed to save Our Trails section.");
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
        {/* Section Header Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Container Title{" "}
              <span className="text-gray-400 font-normal">(small badge label)</span>
            </label>
            <input
              type="text"
              name="containerTitle"
              value={formData.containerTitle}
              onChange={handleFormChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4A3B2A] focus:border-[#4A3B2A]"
              placeholder="e.g. Trail Collections"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Main Title
            </label>
            <input
              type="text"
              name="mainTitle"
              value={formData.mainTitle}
              onChange={handleFormChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4A3B2A] focus:border-[#4A3B2A]"
              placeholder="e.g. Our Trails"
            />
          </div>
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subtitle
          </label>
          <textarea
            name="subtitle"
            value={formData.subtitle}
            onChange={handleFormChange}
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4A3B2A] focus:border-[#4A3B2A]"
            placeholder="Choose your path. Whether you seek..."
          />
          <p className="mt-1 text-xs text-gray-500">
            Use <strong>Enter / new lines</strong> to create line breaks on the
            frontend.
          </p>
        </div>

        {/* Trail Items */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wider">
            Trail Items
          </h3>
          <div className="space-y-6">
            {trails.map((trail, index) => (
              <div
                key={index}
                className="bg-gray-50 p-5 rounded-md border border-gray-200"
              >
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  Trail {index + 1}
                </p>

                {/* Trail Title */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={trail.title}
                    onChange={(e) =>
                      handleTrailTitleChange(index, e.target.value)
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4A3B2A] focus:border-[#4A3B2A]"
                    placeholder={`e.g. ${DEFAULT_TRAILS[index]?.title}`}
                  />
                </div>

                {/* Icon Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icon Image
                  </label>

                  {currentIconImages[index] ? (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">
                        Current Image:
                      </p>
                      <img
                        src={`${IMAGE_BASE_URL}${currentIconImages[index]}`}
                        alt={`Trail ${index + 1} icon`}
                        className="h-20 w-20 object-contain rounded-md bg-white border border-gray-200 p-1"
                      />
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 mb-2 italic">
                      No image uploaded. Hardcoded fallback icon will be used.
                    </p>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleIconFileChange(index, e)}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#F3EFE9] file:text-[#4A3B2A] hover:file:bg-[#E5DFD3]"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Uploaded to{" "}
                    <code className="bg-gray-100 px-1 rounded">
                      uploads/journey/ourTrails/
                    </code>
                    . Image will be compressed automatically.
                  </p>
                </div>
              </div>
            ))}
          </div>
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

export default JourneyOurTrailsManager;
