import React, { useState, useEffect } from "react";
import { api, IMAGE_BASE_URL } from "../../../services/api";
import DraggableTableBody from "../../../components/admin/DraggableTableBody";

const DestinationManager = () => {
  const [destinations, setDestinations] = useState([]);
  const [name, setName] = useState("");
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // UI State
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    setFetching(true);
    try {
      const data = await api.getDestinations();
      setDestinations(data);
    } catch (error) {
      console.error("Error fetching destinations", error);
    } finally {
      setFetching(false);
    }
  };

  const resetForm = () => {
    setName("");
    setHeroImageFile(null);
    setIsEditing(false);
    setCurrentId(null);
    if (document.getElementById("heroImageInput")) {
      document.getElementById("heroImageInput").value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!isEditing && (!name || !heroImageFile)) {
      setMessage({ type: "error", text: "Please fill all fields and select an image." });
      return;
    }
    
    if (isEditing && !name) {
      setMessage({ type: "error", text: "Destination name is required." });
      return;
    }
    
    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    if (heroImageFile) {
      formData.append("heroImage", heroImageFile);
    }

    try {
      if (isEditing) {
        await api.updateDestination(currentId, formData);
        setMessage({ type: "success", text: "Destination updated successfully!" });
      } else {
        await api.addDestination(formData);
        setMessage({ type: "success", text: "Destination added successfully!" });
      }
      resetForm();
      setShowForm(false);
      fetchDestinations();
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Failed to save destination." });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (dest) => {
    setName(dest.name);
    setHeroImageFile(null); 
    setIsEditing(true);
    setCurrentId(dest._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this destination?")) return;
    try {
      await api.deleteDestination(id);
      setMessage({ type: "success", text: "Destination deleted successfully!" });
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

  return (
    <div className="space-y-6">
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
          <form onSubmit={handleSubmit} className="bg-[#F8F6F3] p-6 rounded-xl border border-[#4A3B2A]/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A3B2A] focus:border-transparent"
                  placeholder="e.g. Kenya"
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hero Image (Recommended: 1920x1080 px) {isEditing && <span className="text-gray-400 text-xs">(Leave empty to keep existing)</span>}
                </label>
                <input 
                  id="heroImageInput"
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setHeroImageFile(e.target.files[0])}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A3B2A] focus:border-transparent bg-white"
                  required={!isEditing} 
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="mt-6 bg-[#4A3B2A] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#3d3022] transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : isEditing ? "Update Destination" : "Add Destination"}
            </button>
          </form>
        </div>
      )}

      {!showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-sm">
                <th className="p-4 w-10"></th>
                <th className="p-4 font-medium uppercase min-w-[120px]">Image</th>
                <th className="p-4 font-medium uppercase w-full">Destination Name</th>
                <th className="p-4 font-medium uppercase text-center w-48">Actions</th>
              </tr>
            </thead>
            {fetching ? (
              <tbody>
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600"></div>
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : destinations.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">
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
                    <td className="p-4 font-bold text-[#4A3B2A]">
                      {dest.name}
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
