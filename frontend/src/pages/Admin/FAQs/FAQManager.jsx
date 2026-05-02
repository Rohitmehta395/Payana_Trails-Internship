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

const FAQManager = () => {
  const [faqs, setFaqs] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isActive, setIsActive] = useState(true);
  
  // State for bulk creation
  const [bulkFaqs, setBulkFaqs] = useState([{ question: "", answer: "", isActive: true }]);
  
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
      const oldIndex = faqs.findIndex((item) => item._id === active.id);
      const newIndex = faqs.findIndex((item) => item._id === over.id);
      
      const newItems = arrayMove(faqs, oldIndex, newIndex);
      handleReorder(newItems);
    }
  };

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    setFetching(true);
    try {
      const data = await api.getFAQs(true); // admin=true to get all
      setFaqs(data);
    } catch (error) {
      console.error("Error fetching FAQs", error);
    } finally {
      setFetching(false);
    }
  };

  const resetForm = () => {
    setQuestion("");
    setAnswer("");
    setIsActive(true);
    setBulkFaqs([{ question: "", answer: "", isActive: true }]);
    setIsEditing(false);
    setCurrentId(null);
  };

  const handleBulkChange = (index, field, value) => {
    const updated = [...bulkFaqs];
    updated[index][field] = value;
    setBulkFaqs(updated);
  };

  const addBulkRow = () => {
    setBulkFaqs([...bulkFaqs, { question: "", answer: "", isActive: true }]);
  };

  const removeBulkRow = (index) => {
    setBulkFaqs(bulkFaqs.filter((_, i) => i !== index));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      if (isEditing) {
        if (!question.trim() || !answer.trim()) {
          setMessage({ type: "error", text: "Please enter both question and answer." });
          setLoading(false);
          return;
        }
        await api.updateFAQ(currentId, { question, answer, isActive });
        setMessage({ type: "success", text: "FAQ updated successfully!" });
      } else {
        const validFaqs = bulkFaqs.filter(f => f.question.trim() && f.answer.trim());
        if (validFaqs.length === 0) {
          setMessage({ type: "error", text: "Please fill out at least one valid question and answer." });
          setLoading(false);
          return;
        }
        
        // Execute all API creation calls in parallel
        await Promise.all(validFaqs.map(faqData => api.createFAQ(faqData)));
        setMessage({ type: "success", text: `${validFaqs.length} new FAQ${validFaqs.length > 1 ? 's' : ''} added successfully!` });
      }

      fetchFAQs();
      resetForm();
      setShowForm(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: error.message || "Failed to save FAQ." });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (faq) => {
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setIsActive(faq.isActive);
    setIsEditing(true);
    setCurrentId(faq._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this FAQ?"))
      return;
    try {
      await api.deleteFAQ(id);
      setMessage({ type: "success", text: "FAQ deleted successfully!" });
      fetchFAQs();
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error(error);
      alert("Failed to delete.");
    }
  };

  const handleReorder = async (newFaqs) => {
    setFaqs(newFaqs); // Optimistic UI update
    try {
      const payload = newFaqs.map((f, index) => ({
        id: f._id,
        order: index,
      }));
      await api.reorderFAQs(payload);
    } catch (error) {
      console.error("Failed to save reorder", error);
      setMessage({ type: "error", text: "Failed to save new order." });
      fetchFAQs(); // revert on fail
    }
  };

  const handleToggle = async (id) => {
    // Optimistic UI update
    setFaqs((prev) =>
      prev.map((f) => (f._id === id ? { ...f, isActive: !f.isActive } : f)),
    );
    try {
      await api.toggleFAQStatus(id);
    } catch (error) {
      console.error("Failed to toggle FAQ status", error);
      setMessage({ type: "error", text: "Failed to update FAQ status." });
      fetchFAQs(); // revert on failure
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        
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
          {showForm ? "Cancel / Close Form" : "+ Add FAQs"}
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
            {isEditing ? "Edit FAQ" : "New FAQs (Bulk Creation Supported)"}
          </h3>
          <form onSubmit={handleSave} className="bg-[#F8F6F3] p-6 rounded-xl border border-[#4A3B2A]/10">
            {isEditing ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Question
                  </label>
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A3B2A] focus:border-transparent"
                    placeholder="e.g. How do I book a journey?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Answer
                  </label>
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A3B2A] focus:border-transparent bg-white"
                    placeholder="Provide a detailed answer here..."
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
                {bulkFaqs.map((faq, index) => (
                  <div key={index} className="space-y-4 pb-6 border-b border-[#4A3B2A]/10 last:border-0 last:pb-0 relative animate-[fadeIn_0.3s_ease-out]">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-[#4A3B2A] text-sm uppercase tracking-wider">FAQ #{index + 1}</h4>
                      {bulkFaqs.length > 1 && (
                        <button type="button" onClick={() => removeBulkRow(index)} className="text-red-500 hover:text-red-700 text-xs font-semibold px-2 py-1 rounded hover:bg-red-50">
                          Remove FAQ
                        </button>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Question</label>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => handleBulkChange(index, "question", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A3B2A] focus:border-transparent"
                        placeholder="e.g. How do I book a journey?"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Answer</label>
                      <textarea
                        value={faq.answer}
                        onChange={(e) => handleBulkChange(index, "answer", e.target.value)}
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A3B2A] focus:border-transparent bg-white"
                        placeholder="Provide a detailed answer here..."
                      ></textarea>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={faq.isActive}
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
                  + Add Another FAQ Block
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
                 {loading ? "Saving..." : isEditing ? "Save Edits" : "Save All FAQs"}
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
                      Question
                    </th>
                    <th className="p-4 font-medium uppercase w-auto min-w-[250px]">
                      Answer Preview
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
                ) : faqs.length === 0 ? (
                  <tbody>
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-gray-500">
                        No FAQs added yet.
                      </td>
                    </tr>
                  </tbody>
                ) : (
                  <DraggableTableBody
                    items={faqs}
                    renderRow={(faq) => (
                      <>
                        <td className="p-4 font-bold text-[#4A3B2A] max-w-xs truncate">
                          {faq.question}
                        </td>
                        <td className="p-4 text-gray-600 truncate max-w-sm">
                          {faq.answer.substring(0, 80)}{faq.answer.length > 80 ? '...' : ''}
                        </td>
                        <td className="p-4 text-center">
                          <StatusToggle
                            isActive={faq.isActive}
                            onToggle={() => handleToggle(faq._id)}
                          />
                        </td>
                        <td className="p-4">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEdit(faq)}
                              className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(faq._id)}
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

export default FAQManager;
