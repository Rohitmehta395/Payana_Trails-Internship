import React, { useState, useEffect } from "react";
import { api } from "../../../services/api";
import TrailList from "./TrailList";
import TrailForm from "./TrailForm";
import useScrollToTop from "../../../hooks/useScrollToTop";

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
  };

  const [formData, setFormData] = useState(initialFormState);
  const [imageFile, setImageFile] = useState(null);
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [trailImageFiles, setTrailImageFiles] = useState([]);
  const [existingTrailImages, setExistingTrailImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // --- FETCH TRAILS ON LOAD ---
  const fetchExistingTrails = async () => {
    setLoadingTrails(true);
    try {
      const data = await api.getTrails("All", true); // pass isAdmin=true to get all trails
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

  // --- FORM HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleHeroImageChange = (e) => {
    setHeroImageFile(e.target.files[0]);
  };

  const handleTrailImagesChange = (e) => {
    setTrailImageFiles(Array.from(e.target.files));
  };

  const removeExistingTrailImage = (imgUrl) => {
    setExistingTrailImages((prev) => prev.filter((img) => img !== imgUrl));
    setImagesToDelete((prev) => [...prev, imgUrl]);
  };

  const removeQueuedTrailImage = (index) => {
    setTrailImageFiles((prev) => prev.filter((_, i) => i !== index));
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
    setIsEditing(false);
    setCurrentTrailId(null);
    if (document.getElementById("imageInput")) document.getElementById("imageInput").value = "";
    if (document.getElementById("heroImageInput")) document.getElementById("heroImageInput").value = "";
    if (document.getElementById("trailImagesInput")) document.getElementById("trailImagesInput").value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    if (!isEditing && (!imageFile || !heroImageFile)) {
      setMessage({ type: "error", text: "Please select both Route Map and Hero Image." });
      setLoading(false);
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append("trailName", formData.trailName);

      Object.keys(formData).forEach((key) => {
        if (key === "trailName") return;
        if (key === "highlights") {
          const arrayValue = formData.highlights
            .filter((h) => h.title.trim() || h.description.trim())
            .map((h) => {
              if (h.title.trim() && h.description.trim()) {
                return `*${h.title.trim()}* ${h.description.trim()}`;
              } else if (h.title.trim()) {
                return `*${h.title.trim()}*`;
              } else {
                return h.description.trim();
              }
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

      if (isEditing) {
        submitData.append("existingTrailImages", JSON.stringify(existingTrailImages));
        submitData.append("imagesToDelete", JSON.stringify(imagesToDelete));
      }

      if (isEditing) {
        await api.updateTrail(currentTrailId, submitData);
        setMessage({ type: "success", text: "Trail updated successfully!" });
      } else {
        await api.createTrail(submitData);
        setMessage({ type: "success", text: "Trail created successfully!" });
      }

      resetForm();
      setShowForm(false);
      fetchExistingTrails();

      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Operation failed." });
    } finally {
      setLoading(false);
    }
  };

  // --- EDIT & DELETE HANDLERS ---
  const handleEdit = (trail) => {
    setExistingTrailImages(trail.trailImages || []);
    setImagesToDelete([]);
    setHeroImageFile(null);
    setTrailImageFiles([]);

    setFormData({
      ...trail,
      journeyDate: trail.journeyDate ? trail.journeyDate.split("T")[0] : "",
      highlights: trail.highlights && trail.highlights.length > 0 
        ? trail.highlights.map((h) => {
            const match = h.match(/^\*(.*?)\*\s*(.*)$/);
            if (match) return { title: match[1], description: match[2] };
            
            const matchTitleOnly = h.match(/^\*(.*?)\*$/);
            if (matchTitleOnly) return { title: matchTitleOnly[1], description: "" };

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
    setTrails(newTrails); // optimistic UI update
    try {
      const payload = newTrails.map((trail, index) => ({ id: trail._id, order: index }));
      await api.reorderTrails(payload);
    } catch (error) {
      console.error("Failed to reorder", error);
      setMessage({ type: "error", text: "Failed to save new order." });
      fetchExistingTrails(); // Revert
    }
  };

  const handleToggle = async (id) => {
    // Optimistic UI update
    setTrails((prev) =>
      prev.map((t) => (t._id === id ? { ...t, isActive: !t.isActive } : t))
    );
    try {
      await api.toggleTrailStatus(id);
    } catch (error) {
      console.error("Failed to toggle trail status", error);
      setMessage({ type: "error", text: "Failed to update trail status." });
      fetchExistingTrails(); // Revert on failure
    }
  };

  return (
    <div ref={sectionRef} className="space-y-6">
      {/* TOP ACTIONS BAR */}
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

      {/* RENDER FORM COMPONENT IF OPEN */}
      {showForm && (
        <TrailForm
          formData={formData}
          handleChange={handleChange}
          handleFileChange={handleFileChange}
          handleSubmit={handleSubmit}
          loading={loading}
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
        />
      )}

      {/* RENDER LIST COMPONENT */}
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
