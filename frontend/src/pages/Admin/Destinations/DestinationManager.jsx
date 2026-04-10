import React, { useState, useEffect } from "react";
import { api, IMAGE_BASE_URL } from "../../../services/api";
import DraggableTableBody from "../../../components/admin/DraggableTableBody";
import StatusToggle from "../../../components/admin/StatusToggle";
import useScrollToTop from "../../../hooks/useScrollToTop";
import { useAutoSave } from "../../../hooks/useAutoSave";
import {
  DESTINATION_GEOGRAPHIES,
  getDestinationGeography,
} from "../../../constants/destinationGeographies";

const DestinationManager = () => {
  // Builds a human-readable compression summary from the imageStats array
  const buildStatsMessage = (stats) => {
    if (!stats || stats.length === 0) return "";
    const fmt = (bytes) => (bytes / 1024).toFixed(0) + " KB";
    const parts = stats.map(
      (s) => `${s.field}: ${fmt(s.originalSize)} → ${fmt(s.compressedSize)} (${s.savedPercent}% saved)`
    );
    return " | Compressed: " + parts.join(", ");
  };
  const [destinations, setDestinations] = useState([]);
  const [name, setName] = useState("");
  const [geography, setGeography] = useState("");
  const [status, setStatus] = useState("draft");
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [currentHeroImage, setCurrentHeroImage] = useState("");
  const [heroImagePreview, setHeroImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [sectionRef, scrollToTop] = useScrollToTop();

  // UI State
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchDestinations();
  }, []);

  useEffect(() => {
    if (heroImageFile) {
      const objectUrl = URL.createObjectURL(heroImageFile);
      setHeroImagePreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }

    setHeroImagePreview(
      currentHeroImage ? `${IMAGE_BASE_URL}${currentHeroImage}` : "",
    );
  }, [currentHeroImage, heroImageFile]);

  const fetchDestinations = async () => {
    setFetching(true);
    try {
      const data = await api.getDestinations(true); // admin=true to get all
      setDestinations(data);
    } catch (error) {
      console.error("Error fetching destinations", error);
    } finally {
      setFetching(false);
    }
  };

  const resetForm = () => {
    setName("");
    setGeography("");
    setStatus("draft");
    setHeroImageFile(null);
    setCurrentHeroImage("");
    setIsEditing(false);
    setCurrentId(null);
    if (document.getElementById("heroImageInput")) {
      document.getElementById("heroImageInput").value = "";
    }
  };

  const buildFormData = (targetStatus) => {
    const fd = new FormData();
    fd.append("name", name);
    fd.append("geography", geography);
    fd.append("status", targetStatus);
    if (heroImageFile) fd.append("heroImage", heroImageFile);
    return fd;
  };

  const [hasAutosaved, setHasAutosaved] = useState(false);

  const internalSave = async (targetStatus, isAutoSave = false) => {
    if (!isAutoSave) {
      setLoading(true);
      setMessage({ type: "", text: "" });
    }

    if (targetStatus === 'published' && (!isEditing && !hasAutosaved && (!name || !geography || !heroImageFile))) {
      setMessage({
        type: "error",
        text: "Please fill all fields, select a geography, and upload an image for published destinations.",
      });
      if (!isAutoSave) setLoading(false);
      return false;
    }

    try {
      const fd = buildFormData(targetStatus);
      let responseId = currentId;

      if (isEditing || hasAutosaved) {
        const result = await api.updateDestination(responseId, fd);
        const statsMsg = buildStatsMessage(result.imageStats);
        if (!isAutoSave) setMessage({ type: "success", text: `Destination updated successfully!${statsMsg}` });
      } else {
        const result = await api.addDestination(fd);
        responseId = result.data._id;
        setCurrentId(responseId);
        setHasAutosaved(true);
        const statsMsg = buildStatsMessage(result.imageStats);
        if (!isAutoSave) setMessage({ type: "success", text: `Destination added successfully!${statsMsg}` });
      }

      fetchDestinations();

      if (!isAutoSave) {
        resetForm();
        setShowForm(false);
        setHasAutosaved(false);
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      }
      return true;
    } catch (error) {
      console.error(error);
      if (!isAutoSave) setMessage({ type: "error", text: error.message || "Failed to save destination." });
      return false;
    } finally {
      if (!isAutoSave) setLoading(false);
    }
  };

  const handleAction = async (e, targetStatus) => {
    if (e) e.preventDefault();
    setStatus(targetStatus);
    await internalSave(targetStatus, false);
  };

  const { isSaving, lastSaved } = useAutoSave(
    { name, geography },
    async () => {
      if (!name) return;
      await internalSave("draft", true);
    },
    3000,
    showForm
  );

  const handleEdit = (dest) => {
    setName(dest.name);
    setGeography(getDestinationGeography(dest));
    setStatus(dest.status || "draft");
    setHeroImageFile(null);
    setCurrentHeroImage(dest.heroImage || "");
    setIsEditing(true);
    setCurrentId(dest._id);
    setShowForm(true);
    scrollToTop();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this destination?"))
      return;
    try {
      await api.deleteDestination(id);
      setMessage({
        type: "success",
        text: "Destination deleted successfully!",
      });
      fetchDestinations();
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error(error);
      alert("Failed to delete.");
    }
  };

  const handleReorder = async (newDestinations) => {
    setDestinations(newDestinations); // Optimistic UI update
    try {
      const payload = newDestinations.map((dest, index) => ({
        id: dest._id,
        order: index,
      }));
      await api.reorderDestinations(payload);
    } catch (error) {
      console.error("Failed to save reorder", error);
      setMessage({ type: "error", text: "Failed to save new order." });
      fetchDestinations(); // revert on fail
    }
  };

  const handleToggle = async (id) => {
    // Optimistic UI update
    setDestinations((prev) =>
      prev.map((d) => (d._id === id ? { ...d, isActive: !d.isActive } : d)),
    );
    try {
      await api.toggleDestinationStatus(id);
    } catch (error) {
      console.error("Failed to toggle destination status", error);
      setMessage({
        type: "error",
        text: "Failed to update destination status.",
      });
      fetchDestinations(); // revert on failure
    }
  };

  return (
    <div ref={sectionRef} className="space-y-6">
      {/* TOP ACTIONS BAR */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-bold text-[#4A3B2A]">
          {showForm
            ? isEditing
              ? "Edit Destination"
              : "Create New Destination"
            : "All Destinations"}
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
          {showForm ? "Cancel / Close Form" : "+ Add New Destination"}
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
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-2">
            <h3 className="text-lg font-bold text-[#4A3B2A] flex items-center gap-3">
              {isEditing ? "Edit Destination" : "New Destination"}
              <span className={`px-2 py-0.5 mt-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${status === 'published' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                {status === 'published' ? 'Published' : 'Draft'}
              </span>
            </h3>
            <div className="text-xs text-gray-500 flex items-center gap-2">
              {isSaving && <span className="text-amber-600 font-medium animate-pulse">Autosaving...</span>}
              {!isSaving && lastSaved && <span>Last saved: {lastSaved.toLocaleTimeString()}</span>}
            </div>
          </div>
          <form className="bg-[#F8F6F3] p-6 rounded-xl border border-[#4A3B2A]/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A3B2A] focus:border-transparent"
                  placeholder="e.g. Kenya"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Geography
                </label>
                <select
                  value={geography}
                  onChange={(e) => setGeography(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A3B2A] focus:border-transparent bg-white"
                >
                  <option value="">Select Geography</option>
                  {DESTINATION_GEOGRAPHIES.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 bg-white/70 p-5 rounded-xl border border-[#4A3B2A]/10 border-dashed">
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-2">
                    {heroImageFile
                      ? "New Image Preview"
                      : isEditing
                        ? "Current Image"
                        : "Image Preview"}
                  </p>
                  {heroImagePreview ? (
                    <img
                      src={heroImagePreview}
                      alt="Destination hero preview"
                      className="w-24 h-32 object-cover rounded-lg border border-gray-200 shadow-sm bg-white"
                    />
                  ) : (
                    <div className="w-24 h-32 rounded-lg border border-dashed border-gray-300 bg-white flex items-center justify-center text-[11px] text-gray-400 text-center px-2">
                      Destination image preview will appear here
                    </div>
                  )}
                </div>

                <div className="flex-1 w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hero Image
                  </label>
                  <p className="text-xs text-gray-500 mb-3">
                    Recommended size: 1080x1920 px.
                    {isEditing ? " Leave empty to keep the current image." : ""}
                  </p>
                  <input
                    id="heroImageInput"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setHeroImageFile(e.target.files[0])}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A3B2A] focus:border-transparent bg-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#F3EFE9] file:text-[#4A3B2A] hover:file:bg-[#e6dfd3] cursor-pointer"
                  />
                  {heroImageFile && (
                    <p className="mt-2 text-xs text-[#4A3B2A]">
                      Selected file: {heroImageFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3 justify-end border-t border-[#4A3B2A]/10 pt-4">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
                className="px-6 py-2 rounded-lg text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
               >
                 Cancel
               </button>
               <button
                 type="button"
                 onClick={(e) => handleAction(e, "draft")}
                 disabled={loading || isSaving}
                 className="px-6 py-2 rounded-lg text-sm font-medium text-[#4A3B2A] bg-white border border-[#4A3B2A] hover:bg-orange-50 disabled:opacity-50 transition-colors shadow-sm"
               >
                 {loading && status === 'draft' ? "Saving..." : "Save Draft"}
               </button>
               <button
                 type="button"
                 onClick={(e) => handleAction(e, "published")}
                 disabled={loading || isSaving}
                 className="bg-[#4A3B2A] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#3d3022] disabled:opacity-50 transition-colors"
               >
                 {loading && status === 'published' ? "Publishing..." : "Publish"}
               </button>
            </div>
          </form>
        </div>
      )}

      {!showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-sm">
                <th className="p-4 w-10"></th>
                <th className="p-4 font-medium uppercase min-w-[120px]">
                  Image
                </th>
                <th className="p-4 font-medium uppercase w-full">
                  Destination Name
                </th>
                <th className="p-4 font-medium uppercase min-w-[200px]">
                  Geography
                </th>
                <th className="p-4 font-medium uppercase text-center">
                  Status
                </th>
                <th className="p-4 font-medium uppercase text-center w-48">
                  Actions
                </th>
              </tr>
            </thead>
            {fetching ? (
              <tbody>
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600"></div>
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : destinations.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    No destinations added yet.
                  </td>
                </tr>
              </tbody>
            ) : (
              <DraggableTableBody
                items={destinations}
                onReorder={handleReorder}
                renderRow={(dest) => (
                  <>
                    <td className="p-4">
                      <img
                        src={`${IMAGE_BASE_URL}${dest.heroImage}`}
                        alt={dest.name}
                        className="w-24 h-16 object-cover rounded shadow-sm border border-gray-200"
                      />
                    </td>
                    <td className="p-4 font-bold text-[#4A3B2A] flex items-center gap-2">
                      {dest.name}
                      {dest.status === 'draft' && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-gray-600">
                      {getDestinationGeography(dest) || "Not set"}
                    </td>
                    <td className="p-4 text-center">
                      <StatusToggle
                        isActive={dest.isActive}
                        onToggle={() => handleToggle(dest._id)}
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(dest)}
                          className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(dest._id)}
                          className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </>
                )}
              />
            )}
          </table>
        </div>
      )}
    </div>
  );
};

export default DestinationManager;
