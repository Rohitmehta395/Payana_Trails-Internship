import React, { useState, useEffect } from "react";
import { api } from "../../../services/api";
import TrailForm from "./TrailForm";
import TrailList from "./TrailList";

const AddTrail = () => {
  // --- UI STATE ---
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTrailId, setCurrentTrailId] = useState(null);

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
    highlights: "",
    whatsIncluded: "",
    whatsNotIncluded: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // --- FETCH TRAILS ON LOAD ---
  const fetchExistingTrails = async () => {
    setLoadingTrails(true);
    try {
      const data = await api.getTrails("All");
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

  const resetForm = () => {
    setFormData(initialFormState);
    setImageFile(null);
    setIsEditing(false);
    setCurrentTrailId(null);
    if (document.getElementById("imageInput"))
      document.getElementById("imageInput").value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    if (!isEditing && !imageFile) {
      setMessage({ type: "error", text: "Please select a route map image." });
      setLoading(false);
      return;
    }

    try {
      const submitData = new FormData();

      Object.keys(formData).forEach((key) => {
        if (["highlights", "whatsIncluded", "whatsNotIncluded"].includes(key)) {
          const arrayValue = formData[key]
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
          submitData.append(key, JSON.stringify(arrayValue));
        } else {
          submitData.append(key, formData[key]);
        }
      });

      if (imageFile) {
        submitData.append("routeMap", imageFile);
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
    setFormData({
      ...trail,
      journeyDate: trail.journeyDate ? trail.journeyDate.split("T")[0] : "",
      highlights: trail.highlights ? trail.highlights.join(", ") : "",
      whatsIncluded: trail.whatsIncluded ? trail.whatsIncluded.join(", ") : "",
      whatsNotIncluded: trail.whatsNotIncluded
        ? trail.whatsNotIncluded.join(", ")
        : "",
    });
    setIsEditing(true);
    setCurrentTrailId(trail._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  return (
    <div className="space-y-6">
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
        />
      )}

      {/* RENDER LIST COMPONENT */}
      <TrailList
        trails={trails}
        loadingTrails={loadingTrails}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default AddTrail;
