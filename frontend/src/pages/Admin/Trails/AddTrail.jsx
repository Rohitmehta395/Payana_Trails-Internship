import React, { useEffect, useRef, useState } from "react";
import { api, IMAGE_BASE_URL } from "../../../services/api";
import TrailList from "./TrailList";
import TrailForm from "./TrailForm";
import useScrollToTop from "../../../hooks/useScrollToTop";
import { useAutoSave } from "../../../hooks/useAutoSave";

const createEmptyCompressionPreviews = () => ({
  routeMap: [],
  heroImage: [],
  trailImages: [],
});

const createEmptyCompressionLoading = () => ({
  routeMap: false,
  heroImage: false,
  trailImages: false,
});

const formatBytes = (bytes = 0) => {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  if (bytes >= 1024) {
    return `${(bytes / 1024).toFixed(0)} KB`;
  }

  return `${bytes} B`;
};

const formatCompressionStat = (stat) => {
  const savedLabel =
    stat.savedPercent >= 0
      ? `${stat.savedPercent}% saved`
      : `${Math.abs(stat.savedPercent)}% larger`;

  return `${stat.originalName}: ${formatBytes(stat.originalSize)} -> ${formatBytes(stat.compressedSize)} (${savedLabel})`;
};

const AddTrail = () => {
  // --- UI STATE ---
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTrailId, setCurrentTrailId] = useState(null);

  const [sectionRef, scrollToTop] = useScrollToTop();

  const [trails, setTrails] = useState([]);
  const [loadingTrails, setLoadingTrails] = useState(true);

  // --- FORM STATE ---
  const initialFormState = {
    trailTheme: "Wildlife",
    trailType: "",
    trailName: "",
    trailDestination: "",
    trailSubTitle: "",
    duration: "",
    journeyDate: "",
    trailRoute: "",
    visa: "",
    bestTimeToTravel: "",
    comfortLevel: "",
    overview: "",
    isThisJourneyForYou: "",
    highlights: [{ title: "", description: "" }],
    whatsIncluded: "",
    whatsNotIncluded: "",
    status: "draft",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [imageFile, setImageFile] = useState(null);
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [trailImageFiles, setTrailImageFiles] = useState([]);
  const [existingTrailImages, setExistingTrailImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [routeMapPreview, setRouteMapPreview] = useState("");
  const [heroImagePreview, setHeroImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [compressionPreviews, setCompressionPreviews] = useState(
    createEmptyCompressionPreviews,
  );
  const [compressionPreviewLoading, setCompressionPreviewLoading] = useState(
    createEmptyCompressionLoading,
  );
  const compressionRequestIds = useRef({
    routeMap: 0,
    heroImage: 0,
    trailImages: 0,
  });

  const resetCompressionPreviewState = () => {
    setCompressionPreviews(createEmptyCompressionPreviews());
    setCompressionPreviewLoading(createEmptyCompressionLoading());
    compressionRequestIds.current = {
      routeMap: 0,
      heroImage: 0,
      trailImages: 0,
    };
  };

  const cancelPendingCompressionPreviews = () => {
    compressionRequestIds.current = {
      routeMap: compressionRequestIds.current.routeMap + 1,
      heroImage: compressionRequestIds.current.heroImage + 1,
      trailImages: compressionRequestIds.current.trailImages + 1,
    };
    setCompressionPreviewLoading(createEmptyCompressionLoading());
  };

  // --- FETCH TRAILS ON LOAD ---
  const fetchExistingTrails = async () => {
    setLoadingTrails(true);
    try {
      const data = await api.getTrails("All", true);
      setTrails(data);
    } catch (error) {
      console.error("Failed to fetch trails", error);
    } finally {
      setLoadingTrails(false);
    }
  };

  useEffect(() => {
    fetchExistingTrails();
  }, []);

  useEffect(() => {
    if (imageFile) {
      const objectUrl = URL.createObjectURL(imageFile);
      setRouteMapPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }

    setRouteMapPreview(
      isEditing && formData.routeMap ? `${IMAGE_BASE_URL}${formData.routeMap}` : "",
    );
  }, [formData.routeMap, imageFile, isEditing]);

  useEffect(() => {
    if (heroImageFile) {
      const objectUrl = URL.createObjectURL(heroImageFile);
      setHeroImagePreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }

    setHeroImagePreview(
      isEditing && formData.heroImage ? `${IMAGE_BASE_URL}${formData.heroImage}` : "",
    );
  }, [formData.heroImage, heroImageFile, isEditing]);

  // --- FORM HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const previewCompression = async (field, files) => {
    const normalizedFiles = (Array.isArray(files) ? files : [files]).filter(Boolean);
    const requestId = compressionRequestIds.current[field] + 1;
    compressionRequestIds.current[field] = requestId;

    setCompressionPreviews((prev) => ({ ...prev, [field]: [] }));

    if (normalizedFiles.length === 0) {
      setCompressionPreviewLoading((prev) => ({ ...prev, [field]: false }));
      return;
    }

    setCompressionPreviewLoading((prev) => ({ ...prev, [field]: true }));

    try {
      const result = await api.previewTrailImageCompression({ [field]: normalizedFiles });

      if (compressionRequestIds.current[field] !== requestId) return;

      const imageStats = result.imageStats || [];
      setCompressionPreviews((prev) => ({ ...prev, [field]: imageStats }));
    } catch (error) {
      if (compressionRequestIds.current[field] !== requestId) return;

      console.error("Failed to preview image compression", error);
      setCompressionPreviews((prev) => ({ ...prev, [field]: [] }));
      setMessage({
        type: "error",
        text: error.message || "Failed to preview image compression.",
      });
    } finally {
      if (compressionRequestIds.current[field] === requestId) {
        setCompressionPreviewLoading((prev) => ({ ...prev, [field]: false }));
      }
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0] || null;
    setImageFile(file);
    await previewCompression("routeMap", file);
  };

  const handleHeroImageChange = async (e) => {
    const file = e.target.files[0] || null;
    setHeroImageFile(file);
    await previewCompression("heroImage", file);
  };

  const handleTrailImagesChange = async (e) => {
    const files = Array.from(e.target.files || []);
    setTrailImageFiles(files);
    await previewCompression("trailImages", files);
  };

  const removeExistingTrailImage = (imgUrl) => {
    setExistingTrailImages((prev) => prev.filter((img) => img !== imgUrl));
    setImagesToDelete((prev) => [...prev, imgUrl]);
  };

  const removeQueuedTrailImage = async (index) => {
    const nextFiles = trailImageFiles.filter((_, i) => i !== index);
    setTrailImageFiles(nextFiles);
    await previewCompression("trailImages", nextFiles);
  };

  const handleHighlightChange = (index, field, value) => {
    const newHighlights = [...formData.highlights];
    newHighlights[index][field] = value;
    setFormData((prev) => ({ ...prev, highlights: newHighlights }));
  };

  const addHighlight = () => {
    if (formData.highlights.length < 8) {
      setFormData((prev) => ({
        ...prev,
        highlights: [...prev.highlights, { title: "", description: "" }],
      }));
    }
  };

  const removeHighlight = (index) => {
    const newHighlights = formData.highlights.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, highlights: newHighlights }));
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setImageFile(null);
    setHeroImageFile(null);
    setTrailImageFiles([]);
    setExistingTrailImages([]);
    setImagesToDelete([]);
    resetCompressionPreviewState();
    setIsEditing(false);
    setCurrentTrailId(null);
    setHasAutosaved(false);
    if (document.getElementById("imageInput")) {
      document.getElementById("imageInput").value = "";
    }
    if (document.getElementById("heroImageInput")) {
      document.getElementById("heroImageInput").value = "";
    }
    if (document.getElementById("trailImagesInput")) {
      document.getElementById("trailImagesInput").value = "";
    }
  };

  const buildFormData = (statusToSave) => {
    const submitData = new FormData();
    submitData.append("trailName", formData.trailName);
    submitData.append("status", statusToSave);

    Object.keys(formData).forEach((key) => {
      if (key === "trailName" || key === "status") return;
      if (key === "highlights") {
        const arrayValue = formData.highlights
          .filter((h) => h.title.trim() || h.description.trim())
          .map((h) => {
            if (h.title.trim() && h.description.trim()) {
              return `*${h.title.trim()}* ${h.description.trim()}`;
            } else if (h.title.trim()) {
              return `*${h.title.trim()}*`;
            }

            return h.description.trim();
          });
        submitData.append(key, JSON.stringify(arrayValue));
      } else if (["whatsIncluded", "whatsNotIncluded"].includes(key)) {
        const arrayValue = formData[key]
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean);
        submitData.append(key, JSON.stringify(arrayValue));
      } else {
        submitData.append(key, formData[key]);
      }
    });

    if (imageFile) submitData.append("routeMap", imageFile);
    if (heroImageFile) submitData.append("heroImage", heroImageFile);
    trailImageFiles.forEach((file) => submitData.append("trailImages", file));

    if (isEditing || hasAutosaved) {
      submitData.append("existingTrailImages", JSON.stringify(existingTrailImages));
      submitData.append("imagesToDelete", JSON.stringify(imagesToDelete));
    }
    return submitData;
  };

  const [hasAutosaved, setHasAutosaved] = useState(false);

  const internalSave = async (status, isAutoSave = false) => {
    cancelPendingCompressionPreviews();
    if (!isAutoSave) {
      setLoading(true);
      setMessage({ type: "", text: "" });
    }

    if (status === 'published' && (!isEditing && !hasAutosaved && (!imageFile || !heroImageFile))) {
      setMessage({
        type: "error",
        text: "Please select both Route Map and Hero Image for published trails.",
      });
      if (!isAutoSave) setLoading(false);
      return false;
    }

    try {
      const submitData = buildFormData(status);
      let responseId = currentTrailId;

      if (isEditing || hasAutosaved) {
        const res = await api.updateTrail(responseId, submitData);
        if (!isAutoSave) setMessage({ type: "success", text: "Trail updated successfully!" });
      } else {
        const res = await api.createTrail(submitData);
        responseId = res.trail._id;
        setCurrentTrailId(responseId);
        setHasAutosaved(true);
        if (!isAutoSave) setMessage({ type: "success", text: "Trail created successfully!" });
      }

      fetchExistingTrails();

      if (!isAutoSave) {
        resetForm();
        setShowForm(false);
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      }
      return true;
    } catch (error) {
      console.error(error);
      if (!isAutoSave) {
        // Use the error message from the API if available
        setMessage({ 
          type: "error", 
          text: error.message || "Operation failed." 
        });
      }
      return false;
    } finally {
      if (!isAutoSave) setLoading(false);
    }
  };

  const handleAction = async (e, targetStatus) => {
    if (e) e.preventDefault();
    await internalSave(targetStatus, false);
  };

  const { isSaving, lastSaved } = useAutoSave(
    { formData, imageFile, heroImageFile, trailImageFiles },
    async () => {
      // Autosave only if we have at least a trail name
      if (!formData.trailName) return;
      await internalSave("draft", true);
    },
    3000,
    showForm // only run autosave when form is open
  );

  // --- EDIT & DELETE HANDLERS ---
  const handleEdit = (trail) => {
    setExistingTrailImages(trail.trailImages || []);
    setImagesToDelete([]);
    setImageFile(null);
    setHeroImageFile(null);
    setTrailImageFiles([]);
    resetCompressionPreviewState();

    setFormData({
      ...trail,
      journeyDate: trail.journeyDate ? trail.journeyDate.split("T")[0] : "",
      highlights:
        trail.highlights && trail.highlights.length > 0
          ? trail.highlights.map((h) => {
              const match = h.match(/^\*(.*?)\*\s*(.*)$/);
              if (match) return { title: match[1], description: match[2] };

              const matchTitleOnly = h.match(/^\*(.*?)\*$/);
              if (matchTitleOnly) {
                return { title: matchTitleOnly[1], description: "" };
              }

              return { title: "", description: h };
            })
          : [{ title: "", description: "" }],
      whatsIncluded: trail.whatsIncluded ? trail.whatsIncluded.join("\n") : "",
      whatsNotIncluded: trail.whatsNotIncluded
        ? trail.whatsNotIncluded.join("\n")
        : "",
    });
    setIsEditing(true);
    setCurrentTrailId(trail._id);
    setShowForm(true);
    scrollToTop();
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this trail? This action cannot be undone.",
      )
    ) {
      try {
        await api.deleteTrail(id);
        fetchExistingTrails();
        setMessage({ type: "success", text: "Trail deleted successfully!" });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } catch (error) {
        alert(error.message || "Failed to delete trail");
      }
    }
  };

  const handleReorder = async (newTrails) => {
    setTrails(newTrails);
    try {
      const payload = newTrails.map((trail, index) => ({
        id: trail._id,
        order: index,
      }));
      await api.reorderTrails(payload);
    } catch (error) {
      console.error("Failed to reorder", error);
      setMessage({ type: "error", text: "Failed to save new order." });
      fetchExistingTrails();
    }
  };

  const handleToggle = async (id) => {
    setTrails((prev) =>
      prev.map((t) => (t._id === id ? { ...t, isActive: !t.isActive } : t)),
    );
    try {
      await api.toggleTrailStatus(id);
    } catch (error) {
      console.error("Failed to toggle trail status", error);
      setMessage({ type: "error", text: "Failed to update trail status." });
      fetchExistingTrails();
    }
  };

  return (
    <div ref={sectionRef} className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-bold text-[#4A3B2A]">
          {showForm
            ? isEditing
              ? "Edit Trail"
              : "Create New Trail"
            : "All Trails"}
        </h2>
        <button
          onClick={() => {
            if (showForm) {
              resetForm();
              setShowForm(false);
            } else {
              setShowForm(true);
            }
          }}
          className={`px-5 py-2 rounded text-sm font-medium transition-colors shadow-sm ${
            showForm
              ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
              : "bg-[#4A3B2A] text-[#F3EFE9] hover:bg-[#3a2d20]"
          }`}
        >
          {showForm ? "Cancel / Close Form" : "+ Add New Trail"}
        </button>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded text-sm ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}
        >
          {message.text}
        </div>
      )}

      {showForm && (
        <TrailForm
          formData={formData}
          handleChange={handleChange}
          handleFileChange={handleFileChange}
          handleAction={handleAction}
          loading={loading}
          isSaving={isSaving}
          lastSaved={lastSaved}
          isEditing={isEditing}
          resetForm={resetForm}
          setShowForm={setShowForm}
          handleHighlightChange={handleHighlightChange}
          addHighlight={addHighlight}
          removeHighlight={removeHighlight}
          handleHeroImageChange={handleHeroImageChange}
          handleTrailImagesChange={handleTrailImagesChange}
          existingTrailImages={existingTrailImages}
          removeExistingTrailImage={removeExistingTrailImage}
          trailImageFiles={trailImageFiles}
          removeQueuedTrailImage={removeQueuedTrailImage}
          routeMapPreview={routeMapPreview}
          heroImagePreview={heroImagePreview}
          routeMapFileName={imageFile?.name || ""}
          heroImageFileName={heroImageFile?.name || ""}
          compressionPreviews={compressionPreviews}
          compressionPreviewLoading={compressionPreviewLoading}
          formatCompressionStat={formatCompressionStat}
        />
      )}

      <TrailList
        trails={trails}
        loadingTrails={loadingTrails}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleReorder={handleReorder}
        handleToggle={handleToggle}
      />
    </div>
  );
};

export default AddTrail;
