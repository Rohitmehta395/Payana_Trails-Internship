import React, { useState, useEffect } from "react";
import { api, IMAGE_BASE_URL } from "../../../services/api";
import { Plus, Trash2, GripVertical, ChevronUp, ChevronDown, ChevronsUp, ChevronsDown } from "lucide-react";
import RichTextEditor from "../../../components/admin/RichTextEditor";

const ThePayanaDifferenceManager = () => {
  const [formData, setFormData] = useState({
    mainTitle: "",
    subtitle: "",
    mainImage: null,
  });
  const [entries, setEntries] = useState([]);
  const [currentMainImage, setCurrentMainImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [expandedEntries, setExpandedEntries] = useState(new Set());

  const fetchSectionData = async () => {
    setIsLoading(true);
    try {
      const responseData = await api.getPayanaWayPage();
      const { thePayanaDifference } = responseData;
      if (thePayanaDifference) {
        setFormData({
          mainTitle: thePayanaDifference.mainTitle || "",
          subtitle: thePayanaDifference.subtitle || "",
          mainImage: null,
        });
        setEntries(thePayanaDifference.entries || []);
        setCurrentMainImage(thePayanaDifference.mainImage || "");
      }
    } catch (error) {
      console.error("Error fetching 'The Payana Difference' data:", error);
      setMessage({ type: "error", text: "Failed to load section data." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSectionData();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({ ...prev, mainImage: e.target.files[0] }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEntryChange = (index, field, value) => {
    const updatedEntries = [...entries];
    updatedEntries[index][field] = value;
    setEntries(updatedEntries);
  };

  const addEntry = () => {
    setEntries([...entries, { title: "", subtitle: "", description: "" }]);
    setExpandedEntries((prev) => new Set(prev).add(entries.length));
  };

  const removeEntry = (index) => {
    const updatedEntries = entries.filter((_, i) => i !== index);
    setEntries(updatedEntries);
  };

  const moveEntryUp = (index) => {
    if (index === 0) return;
    const updatedEntries = [...entries];
    const temp = updatedEntries[index - 1];
    updatedEntries[index - 1] = updatedEntries[index];
    updatedEntries[index] = temp;
    setEntries(updatedEntries);
  };

  const moveEntryDown = (index) => {
    if (index === entries.length - 1) return;
    const updatedEntries = [...entries];
    const temp = updatedEntries[index + 1];
    updatedEntries[index + 1] = updatedEntries[index];
    updatedEntries[index] = temp;
    setEntries(updatedEntries);
  };

  const toggleCollapse = (index) => {
    setExpandedEntries((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const showAutoHidingMessage = (type, text, timeout = 3000) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), timeout);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    if (!currentMainImage && !formData.mainImage) {
      showAutoHidingMessage("error", "Main Image is required.");
      setIsSaving(false);
      return;
    }

    const form = new FormData();
    form.append("mainTitle", formData.mainTitle);
    form.append("subtitle", formData.subtitle);
    form.append("entriesData", JSON.stringify(entries));
    if (formData.mainImage) form.append("mainImage", formData.mainImage);

    try {
      const responseData = await api.updateThePayanaDifference(form);
      const { page, imageStats } = responseData;
      
      if (page.thePayanaDifference) {
        setCurrentMainImage(page.thePayanaDifference.mainImage || "");
        setEntries(page.thePayanaDifference.entries || []);
      }
      
      let successMsg = "Section updated successfully!";
      if (imageStats && imageStats.length > 0) {
        successMsg += " Compression saved: ";
        const details = imageStats.map((stat) => `${stat.field} (${stat.savedPercent}%)`).join(", ");
        successMsg += details;
      }
      
      showAutoHidingMessage("success", successMsg, 5000);
      setFormData((prev) => ({ ...prev, mainImage: null }));
      // Reset file input
      const fileInput = document.getElementById("tp_mainImage");
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Error saving data:", error);
      showAutoHidingMessage("error", "Failed to save section data.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading data...</div>;
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Main Header Information */}
        <div className="bg-gray-50 p-6 rounded-md border border-gray-200">
          <h3 className="text-lg font-bold text-[#4A3B2A] mb-4">Header Content</h3>
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
        </div>

        {/* Main Image Upload */}
        <div className="bg-gray-50 p-6 rounded-md border border-gray-200">
          <h3 className="text-lg font-bold text-[#4A3B2A] mb-4">Main Image</h3>
          {currentMainImage && (
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-1">Current Image:</p>
              <img src={`${IMAGE_BASE_URL}${currentMainImage}`} alt="Main" className="h-48 object-cover rounded-md bg-white border border-gray-200" />
            </div>
          )}
          <input
            id="tp_mainImage"
            type="file"
            name="mainImage"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#4A3B2A] file:text-white hover:file:bg-[#3a2e20] transition-colors"
            accept="image/*"
          />
        </div>

        {/* Entries Management */}
        <div className="bg-gray-50 p-6 rounded-md border border-gray-200">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-[#4A3B2A]">Entries List</h3>
          </div>

          <div className="space-y-6">
            {entries.length === 0 ? (
              <p className="text-gray-500 text-center py-4 italic">No entries added yet. Click "Add Entry" to create one.</p>
            ) : (
              entries.map((entry, index) => (
                <div key={index} className="bg-white p-5 rounded-md border border-gray-200 shadow-sm relative group">
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => moveEntryUp(index)}
                      disabled={index === 0}
                      className="w-10 h-10 flex items-center justify-center rounded-2xl border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronUp size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveEntryDown(index)}
                      disabled={index === entries.length - 1}
                      className="w-10 h-10 flex items-center justify-center rounded-2xl border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronDown size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeEntry(index)}
                      className="w-10 h-10 flex items-center justify-center rounded-2xl border border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Remove Entry"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleCollapse(index)}
                      className="w-10 h-10 flex items-center justify-center rounded-2xl border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
                      title={!expandedEntries.has(index) ? "Expand Entry" : "Collapse Entry"}
                    >
                      {!expandedEntries.has(index) ? <ChevronsDown size={20} /> : <ChevronsUp size={20} />}
                    </button>
                  </div>
                  
                  <div className={`flex flex-col gap-4 ${!expandedEntries.has(index) ? "" : "pr-[180px] pt-2"}`}>
                    
                    {/* Collapsed State Preview */}
                    {!expandedEntries.has(index) && (
                      <div className="flex items-center gap-4 pr-[180px] cursor-pointer" onClick={() => toggleCollapse(index)}>
                        <div className="w-12 h-12 bg-[#F3EFE9] text-[#4A3B2A] rounded-lg border border-[#4A3B2A]/20 flex-shrink-0 flex items-center justify-center font-bold text-lg">
                           {String(index + 1).padStart(2, "0")}
                        </div>
                        <div className="flex-1 overflow-hidden">
                           <p className="text-sm font-medium text-gray-800 truncate">
                             {entry.title || "Untitled Entry"}
                           </p>
                           <p className="text-xs text-gray-500 truncate">
                             {entry.subtitle || "No subtitle"}
                           </p>
                        </div>
                      </div>
                    )}

                    {/* Expanded State */}
                    {expandedEntries.has(index) && (
                      <div className="flex-1 space-y-6">
                        <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 space-y-5">
                          
                          <div>
                            <label className="block text-sm font-semibold text-[#4A3B2A] mb-2">Title</label>
                            <input
                              type="text"
                              value={entry.title}
                              onChange={(e) => handleEntryChange(index, "title", e.target.value)}
                              placeholder="e.g., Designed for Seniors, at the Right Pace"
                              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:ring-[#4A3B2A] focus:border-[#4A3B2A] bg-white shadow-sm"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-semibold text-[#4A3B2A] mb-2">Subtitle</label>
                            <input
                              type="text"
                              value={entry.subtitle}
                              onChange={(e) => handleEntryChange(index, "subtitle", e.target.value)}
                              placeholder="e.g., Because comfort is not a luxury — it is essential."
                              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:ring-[#4A3B2A] focus:border-[#4A3B2A] bg-white shadow-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-[#4A3B2A] mb-2">Description</label>
                            <RichTextEditor
                              value={entry.description}
                              onChange={(val) => handleEntryChange(index, "description", val)}
                              rows={5}
                              placeholder="Write the content here... (supports **bold**, *italic*, - bullets)"
                            />
                          </div>
                          
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Full Width Add Entry Button */}
          <button
            type="button"
            onClick={addEntry}
            className="w-full mt-6 flex justify-center items-center gap-2 bg-[#F3EFE9] text-[#4A3B2A] border-2 border-dashed border-[#4A3B2A]/30 py-4 rounded-xl hover:bg-[#e8e3dc] hover:border-[#4A3B2A]/50 transition-all font-medium"
          >
            <Plus size={20} /> Add New Entry
          </button>
        </div>

        <div className="flex flex-col items-end gap-4 pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-[#4A3B2A] text-white px-8 py-3 rounded-md hover:bg-[#3a2e20] transition-colors disabled:opacity-50 font-medium"
          >
            {isSaving ? "Saving..." : "Save Section"}
          </button>
          
          {message.text && (
            <div className={`w-full p-4 rounded-md ${message.type === "success" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`}>
              {message.text}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default ThePayanaDifferenceManager;
