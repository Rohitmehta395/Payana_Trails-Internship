import React, { useState, useEffect } from "react";
import { api, IMAGE_BASE_URL } from "../../../services/api";
import { Plus, Trash2, GripVertical, ChevronUp, ChevronDown, ChevronsUp, ChevronsDown } from "lucide-react";

const JourneysWithPurposeManager = () => {
  const [formData, setFormData] = useState({
    mainTitle: "",
    subtitle: "",
  });
  const [blocks, setBlocks] = useState([]);
  const [files, setFiles] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [expandedBlocks, setExpandedBlocks] = useState(new Set());

  const fetchSectionData = async () => {
    setIsLoading(true);
    try {
      const responseData = await api.getPayanaWayPage();
      const { journeysWithPurpose } = responseData;
      if (journeysWithPurpose) {
        setFormData({
          mainTitle: journeysWithPurpose.mainTitle || "",
          subtitle: journeysWithPurpose.subtitle || "",
        });
        setBlocks(journeysWithPurpose.blocks || []);
      }
    } catch (error) {
      console.error("Error fetching 'Journeys with Purpose' data:", error);
      setMessage({ type: "error", text: "Failed to load section data." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSectionData();
  }, []);

  const handleTextChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBlockChange = (index, field, value) => {
    const updatedBlocks = [...blocks];
    updatedBlocks[index][field] = value;
    setBlocks(updatedBlocks);
  };

  const handleFileChange = (index, e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles({ ...files, [index]: e.target.files[0] });
    }
  };

  const addBlock = () => {
    setBlocks([...blocks, { image: "", description: "" }]);
    setExpandedBlocks((prev) => new Set(prev).add(blocks.length));
  };

  const removeBlock = (index) => {
    const updatedBlocks = blocks.filter((_, i) => i !== index);
    setBlocks(updatedBlocks);
    
    // Remove from files
    const updatedFiles = { ...files };
    delete updatedFiles[index];
    
    // Shift remaining file indices
    const newFiles = {};
    Object.keys(updatedFiles).forEach(key => {
        let oldIdx = parseInt(key);
        if (oldIdx > index) {
            newFiles[oldIdx - 1] = updatedFiles[oldIdx];
        } else {
            newFiles[oldIdx] = updatedFiles[oldIdx];
        }
    });
    setFiles(newFiles);
  };

  const moveBlockUp = (index) => {
    if (index === 0) return;
    const updatedBlocks = [...blocks];
    const temp = updatedBlocks[index - 1];
    updatedBlocks[index - 1] = updatedBlocks[index];
    updatedBlocks[index] = temp;
    setBlocks(updatedBlocks);

    // Swap files
    const newFiles = { ...files };
    const tempFile = newFiles[index - 1];
    newFiles[index - 1] = newFiles[index];
    newFiles[index] = tempFile;
    if (newFiles[index - 1] === undefined) delete newFiles[index - 1];
    if (newFiles[index] === undefined) delete newFiles[index];
    setFiles(newFiles);
  };

  const moveBlockDown = (index) => {
    if (index === blocks.length - 1) return;
    const updatedBlocks = [...blocks];
    const temp = updatedBlocks[index + 1];
    updatedBlocks[index + 1] = updatedBlocks[index];
    updatedBlocks[index] = temp;
    setBlocks(updatedBlocks);

    // Swap files
    const newFiles = { ...files };
    const tempFile = newFiles[index + 1];
    newFiles[index + 1] = newFiles[index];
    newFiles[index] = tempFile;
    if (newFiles[index + 1] === undefined) delete newFiles[index + 1];
    if (newFiles[index] === undefined) delete newFiles[index];
    setFiles(newFiles);
  };

  const toggleCollapse = (index) => {
    setExpandedBlocks((prev) => {
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

    const form = new FormData();
    form.append("mainTitle", formData.mainTitle);
    form.append("subtitle", formData.subtitle);
    form.append("blocksData", JSON.stringify(blocks));
    
    Object.keys(files).forEach(index => {
      form.append(`blockImage_${index}`, files[index]);
    });

    try {
      const responseData = await api.updateJourneysWithPurpose(form);
      const { page, imageStats } = responseData;
      
      if (page.journeysWithPurpose) {
        setFormData({
          mainTitle: page.journeysWithPurpose.mainTitle || "",
          subtitle: page.journeysWithPurpose.subtitle || "",
        });
        setBlocks(page.journeysWithPurpose.blocks || []);
      }
      
      let successMsg = "Section updated successfully!";
      if (imageStats && imageStats.length > 0) {
        successMsg += " Compression saved: ";
        const details = imageStats.map((stat) => `${stat.field} (${stat.savedPercent}%)`).join(", ");
        successMsg += details;
      }
      
      showAutoHidingMessage("success", successMsg, 5000);
      setFiles({});
      
      // Reset file inputs
      const fileInputs = document.querySelectorAll('input[type="file"]');
      fileInputs.forEach(input => input.value = "");
      
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
        
        {/* Main Title & Subtitle */}
        <div className="bg-gray-50 p-6 rounded-md border border-gray-200 space-y-4">
          <h3 className="text-lg font-bold text-[#4A3B2A] mb-4">Header Content</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Main Title</label>
            <input
              type="text"
              name="mainTitle"
              value={formData.mainTitle}
              onChange={handleTextChange}
              placeholder="Journeys with Purpose"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4A3B2A] focus:border-[#4A3B2A]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
            <input
              type="text"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleTextChange}
              placeholder="Subtitle text..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4A3B2A] focus:border-[#4A3B2A]"
            />
          </div>
        </div>

        {/* Blocks Management */}
        <div className="bg-gray-50 p-6 rounded-md border border-gray-200">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-[#4A3B2A]">Content Blocks</h3>
          </div>

          <div className="space-y-6">
            {blocks.length === 0 ? (
              <p className="text-gray-500 text-center py-4 italic">No blocks added yet. Click "Add New Block" to create one.</p>
            ) : (
              blocks.map((block, index) => (
                <div key={index} className="bg-white p-5 rounded-md border border-gray-200 shadow-sm relative group">
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => moveBlockUp(index)}
                      disabled={index === 0}
                      className="w-10 h-10 flex items-center justify-center rounded-2xl border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronUp size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveBlockDown(index)}
                      disabled={index === blocks.length - 1}
                      className="w-10 h-10 flex items-center justify-center rounded-2xl border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronDown size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeBlock(index)}
                      className="w-10 h-10 flex items-center justify-center rounded-2xl border border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Remove Block"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleCollapse(index)}
                      className="w-10 h-10 flex items-center justify-center rounded-2xl border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
                      title={!expandedBlocks.has(index) ? "Expand Block" : "Collapse Block"}
                    >
                      {!expandedBlocks.has(index) ? <ChevronsDown size={20} /> : <ChevronsUp size={20} />}
                    </button>
                  </div>
                  
                  <div className={`flex flex-col gap-4 ${!expandedBlocks.has(index) ? "" : "pr-[180px] pt-2"}`}>
                    
                    {/* Collapsed State Preview */}
                    {!expandedBlocks.has(index) && (
                      <div className="flex items-center gap-4 pr-[180px] cursor-pointer" onClick={() => toggleCollapse(index)}>
                        <div className="w-16 h-12 bg-gray-100 rounded border border-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                           {block.image ? (
                             <img src={`${IMAGE_BASE_URL}${block.image}`} alt="Preview" className="w-full h-full object-cover" />
                           ) : (
                             <span className="text-xs text-gray-400">No Img</span>
                           )}
                        </div>
                        <div className="flex-1 overflow-hidden">
                           <p className="text-sm font-medium text-gray-800 truncate">
                             {block.description ? block.description.split('\n')[0] : "Empty Description"}
                           </p>
                           <p className="text-xs text-gray-500 truncate">
                             {block.description ? block.description.length + " characters" : "Please add a description"}
                           </p>
                        </div>
                      </div>
                    )}

                    {/* Expanded State */}
                    {expandedBlocks.has(index) && (
                      <div className="flex-1 space-y-6">
                        
                        {/* Image Upload */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                          <label className="block text-sm font-semibold text-[#4A3B2A] mb-3">Block Image (Landscape)</label>
                          <div className="flex items-start gap-6">
                            {block.image && (
                              <div className="w-40 h-28 flex-shrink-0">
                                <img src={`${IMAGE_BASE_URL}${block.image}`} alt={`Block ${index}`} className="w-full h-full object-cover rounded-lg border border-gray-200 shadow-sm" />
                              </div>
                            )}
                            <div className="flex-1">
                              <input
                                type="file"
                                onChange={(e) => handleFileChange(index, e)}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#4A3B2A] file:text-white hover:file:bg-[#3a2e20] transition-colors cursor-pointer border border-dashed border-gray-300 p-4 rounded-xl bg-white"
                                accept="image/*"
                              />
                              <p className="mt-2 text-xs text-gray-500">Upload a high-quality landscape image. It will be automatically optimized.</p>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <div>
                          <label className="block text-sm font-semibold text-[#4A3B2A] mb-2">Description</label>
                          <textarea
                            value={block.description}
                            onChange={(e) => handleBlockChange(index, "description", e.target.value)}
                            placeholder="Write the content here... (newlines will be preserved)"
                            rows="7"
                            className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-[#4A3B2A] focus:border-[#4A3B2A] resize-y whitespace-pre-wrap bg-gray-50 shadow-inner"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Full Width Add Block Button */}
          <button
            type="button"
            onClick={addBlock}
            className="w-full mt-6 flex justify-center items-center gap-2 bg-[#F3EFE9] text-[#4A3B2A] border-2 border-dashed border-[#4A3B2A]/30 py-4 rounded-xl hover:bg-[#e8e3dc] hover:border-[#4A3B2A]/50 transition-all font-medium"
          >
            <Plus size={20} /> Add New Block
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

export default JourneysWithPurposeManager;
