import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { api } from "../../../services/api";
import DraggableTableBody from "../../../components/admin/DraggableTableBody";
import StatusToggle from "../../../components/admin/StatusToggle";

const PAGE_TYPES = [
  { type: "privacy-policy", label: "Privacy Policy" },
  { type: "terms-and-conditions", label: "Terms & Conditions" },
];

const LegalSectionEditor = ({ type, label }) => {
  const [sections, setSections] = useState([]);
  const [heading, setHeading] = useState("");
  const [content, setContent] = useState("");
  const [isActive, setIsActive] = useState(true);
  
  // State for bulk creation
  const [bulkSections, setBulkSections] = useState([{ heading: "", content: "", isActive: true }]);
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active && over && active.id !== over.id) {
      const oldIndex = sections.findIndex((item) => item._id === active.id);
      const newIndex = sections.findIndex((item) => item._id === over.id);
      
      const newItems = arrayMove(sections, oldIndex, newIndex);
      handleReorder(newItems);
    }
  };

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchSections();
  }, [type]);

  const fetchSections = async () => {
    setFetching(true);
    try {
      const data = await api.getLegalSections(type, true); // admin=true
      setSections(data);
    } catch (error) {
      console.error(`Error fetching ${label} sections`, error);
    } finally {
      setFetching(false);
    }
  };

  const resetForm = () => {
    setHeading("");
    setContent("");
    setIsActive(true);
    setBulkSections([{ heading: "", content: "", isActive: true }]);
    setIsEditing(false);
    setCurrentId(null);
  };

  const handleBulkChange = (index, field, value) => {
    const updated = [...bulkSections];
    updated[index][field] = value;
    setBulkSections(updated);
  };

  const addBulkRow = () => {
    setBulkSections([...bulkSections, { heading: "", content: "", isActive: true }]);
  };

  const removeBulkRow = (index) => {
    setBulkSections(bulkSections.filter((_, i) => i !== index));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      if (isEditing) {
        if (!heading.trim() || !content.trim()) {
          setMessage({ type: "error", text: "Please enter both heading and content." });
          setLoading(false);
          return;
        }
        await api.updateLegalSection(type, currentId, { heading, content, isActive });
        setMessage({ type: "success", text: "Section updated successfully!" });
      } else {
        const validSections = bulkSections.filter(s => s.heading.trim() && s.content.trim());
        if (validSections.length === 0) {
          setMessage({ type: "error", text: "Please fill out at least one valid heading and content." });
          setLoading(false);
          return;
        }
        
        // Execute all API creation calls in parallel
        await Promise.all(validSections.map(data => api.createLegalSection(type, data)));
        setMessage({ type: "success", text: `${validSections.length} new section${validSections.length > 1 ? 's' : ''} added successfully!` });
      }

      fetchSections();
      resetForm();
      setShowForm(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: error.response?.data?.message || error.message || "Failed to save section." });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (section) => {
    setHeading(section.heading);
    setContent(section.content);
    setIsActive(section.isActive);
    setIsEditing(true);
    setCurrentId(section._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this section?"))
      return;
    try {
      await api.deleteLegalSection(type, id);
      setMessage({ type: "success", text: "Section deleted successfully!" });
      fetchSections();
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error(error);
      alert("Failed to delete.");
    }
  };

  const handleReorder = async (newSections) => {
    setSections(newSections); // Optimistic UI update
    try {
      const payload = newSections.map((s, index) => ({
        id: s._id,
        order: index,
      }));
      await api.reorderLegalSections(type, payload);
    } catch (error) {
      console.error("Failed to save reorder", error);
      setMessage({ type: "error", text: "Failed to save new order." });
      fetchSections(); // revert on fail
    }
  };

  const handleToggle = async (id) => {
    // Optimistic UI update
    setSections((prev) =>
      prev.map((s) => (s._id === id ? { ...s, isActive: !s.isActive } : s)),
    );
    try {
      await api.toggleLegalSectionStatus(type, id);
    } catch (error) {
      console.error("Failed to toggle section status", error);
      setMessage({ type: "error", text: "Failed to update section status." });
      fetchSections(); // revert on failure
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-[#4A3B2A]">{label} Sections</h3>
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
          {showForm ? "Cancel / Close Form" : "+ Add Section"}
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
          <h3 className="text-lg font-bold text-[#4A3B2A] flex items-center gap-3 mb-6">
            {isEditing ? `Edit ${label} Section` : `New ${label} Sections (Bulk Creation Supported)`}
          </h3>
          <form onSubmit={handleSave} className="bg-[#F8F6F3] p-6 rounded-xl border border-[#4A3B2A]/10">
            {isEditing ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Heading
                  </label>
                  <input
                    type="text"
                    value={heading}
                    onChange={(e) => setHeading(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A3B2A] focus:border-transparent"
                    placeholder="e.g. Information We Collect"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows="6"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A3B2A] focus:border-transparent bg-white"
                    placeholder="Provide the section details here..."
                  ></textarea>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded text-[#4A3B2A] focus:ring-[#4A3B2A]"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    Visible on website
                  </label>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {bulkSections.map((section, index) => (
                  <div key={index} className="space-y-4 pb-6 border-b border-[#4A3B2A]/10 last:border-0 last:pb-0 relative animate-[fadeIn_0.3s_ease-out]">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-[#4A3B2A] text-sm uppercase tracking-wider">Section #{index + 1}</h4>
                      {bulkSections.length > 1 && (
                        <button type="button" onClick={() => removeBulkRow(index)} className="text-red-500 hover:text-red-700 text-xs font-semibold px-2 py-1 rounded hover:bg-red-50">
                          Remove Section
                        </button>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Heading</label>
                      <input
                        type="text"
                        value={section.heading}
                        onChange={(e) => handleBulkChange(index, "heading", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A3B2A] focus:border-transparent"
                        placeholder="e.g. Information We Collect"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Content</label>
                      <textarea
                        value={section.content}
                        onChange={(e) => handleBulkChange(index, "content", e.target.value)}
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A3B2A] focus:border-transparent bg-white"
                        placeholder="Provide the section details here..."
                      ></textarea>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={section.isActive}
                        onChange={(e) => handleBulkChange(index, "isActive", e.target.checked)}
                        className="rounded text-[#4A3B2A] focus:ring-[#4A3B2A]"
                      />
                      <label className="text-xs font-medium text-gray-700">Visible on website immediately</label>
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addBulkRow}
                  className="w-full py-3 border-2 border-dashed border-[#4A3B2A]/30 text-[#4A3B2A] font-semibold rounded-lg hover:border-[#4A3B2A] hover:bg-[#4A3B2A]/5 transition-colors"
                >
                  + Add Another Section Block
                </button>
              </div>
            )}

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
                 type="submit"
                 disabled={loading}
                 className="bg-[#4A3B2A] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#3d3022] disabled:opacity-50 transition-colors"
               >
                 {loading ? "Saving..." : isEditing ? "Save Edits" : "Save All Sections"}
               </button>
            </div>
          </form>
        </div>
      )}

      {!showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-sm">
                    <th className="p-4 w-10"></th>
                    <th className="p-4 font-medium uppercase w-1/3 min-w-[200px]">
                      Heading
                    </th>
                    <th className="p-4 font-medium uppercase w-auto min-w-[250px]">
                      Content Preview
                    </th>
                    <th className="p-4 font-medium uppercase text-center min-w-[120px]">
                      Visibility
                    </th>
                    <th className="p-4 font-medium uppercase text-center min-w-[150px]">
                      Actions
                    </th>
                  </tr>
                </thead>
                {fetching ? (
                  <tbody>
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-gray-500">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600"></div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                ) : sections.length === 0 ? (
                  <tbody>
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-gray-500">
                        No sections added yet.
                      </td>
                    </tr>
                  </tbody>
                ) : (
                  <DraggableTableBody
                    items={sections}
                    renderRow={(section) => (
                      <>
                        <td className="p-4 font-bold text-[#4A3B2A] max-w-xs truncate">
                          {section.heading}
                        </td>
                        <td className="p-4 text-gray-600 truncate max-w-sm">
                          {section.content.substring(0, 80)}{section.content.length > 80 ? '...' : ''}
                        </td>
                        <td className="p-4 text-center">
                          <StatusToggle
                            isActive={section.isActive}
                            onToggle={() => handleToggle(section._id)}
                          />
                        </td>
                        <td className="p-4">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEdit(section)}
                              className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(section._id)}
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
          </DndContext>
        </div>
      )}
    </div>
  );
};

const LegalPageManager = () => {
  const [activeType, setActiveType] = useState(PAGE_TYPES[0].type);

  return (
    <div className="space-y-6">
      <div className="flex border-b border-gray-200">
        {PAGE_TYPES.map((pt) => (
          <button
            key={pt.type}
            onClick={() => setActiveType(pt.type)}
            className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px cursor-pointer ${
              activeType === pt.type
                ? "border-[#4A3B2A] text-[#4A3B2A]"
                : "border-transparent text-gray-500 hover:text-[#4A3B2A] hover:border-gray-300"
            }`}
          >
            {pt.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {PAGE_TYPES.map((pt) =>
          pt.type === activeType ? (
            <LegalSectionEditor key={pt.type} type={pt.type} label={pt.label} />
          ) : null
        )}
      </div>
    </div>
  );
};

export default LegalPageManager;
