import React, { useState, useEffect } from "react";
import { api, IMAGE_BASE_URL } from "../../../services/api";
import { Plus, Trash2, ChevronUp, ChevronDown, ChevronsUp, ChevronsDown } from "lucide-react";
import RichTextEditor from "../../../components/admin/RichTextEditor";

const InTheMediaManager = () => {
  const [formData, setFormData] = useState({
    mainTitle: "",
    subtitle: "",
  });
  const [items, setItems] = useState([]);
  const [files, setFiles] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [expandedItems, setExpandedItems] = useState(new Set());

  const fetchSectionData = async () => {
    setIsLoading(true);
    try {
      const responseData = await api.getPayanaWayPage();
      const { inTheMedia } = responseData;
      if (inTheMedia) {
        setFormData({
          mainTitle: inTheMedia.mainTitle || "",
          subtitle: inTheMedia.subtitle || "",
        });
        setItems(inTheMedia.items || []);
      }
    } catch (error) {
      console.error("Error fetching 'In The Media' data:", error);
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

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const handleFileChange = (index, e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles({ ...files, [index]: e.target.files[0] });
    }
  };

  const addItem = () => {
    setItems([...items, { 
      image: "", 
      publishedBy: "", 
      authorName: "", 
      date: "", 
      description: "",
      url: "" 
    }]);
    setExpandedItems((prev) => new Set(prev).add(items.length));
  };

  const removeItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    
    const updatedFiles = { ...files };
    delete updatedFiles[index];
    
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

  const moveItemUp = (index) => {
    if (index === 0) return;
    const updatedItems = [...items];
    const temp = updatedItems[index - 1];
    updatedItems[index - 1] = updatedItems[index];
    updatedItems[index] = temp;
    setItems(updatedItems);

    const newFiles = { ...files };
    const tempFile = newFiles[index - 1];
    newFiles[index - 1] = newFiles[index];
    newFiles[index] = tempFile;
    if (newFiles[index - 1] === undefined) delete newFiles[index - 1];
    if (newFiles[index] === undefined) delete newFiles[index];
    setFiles(newFiles);
  };

  const moveItemDown = (index) => {
    if (index === items.length - 1) return;
    const updatedItems = [...items];
    const temp = updatedItems[index + 1];
    updatedItems[index + 1] = updatedItems[index];
    updatedItems[index] = temp;
    setItems(updatedItems);

    const newFiles = { ...files };
    const tempFile = newFiles[index + 1];
    newFiles[index + 1] = newFiles[index];
    newFiles[index] = tempFile;
    if (newFiles[index + 1] === undefined) delete newFiles[index + 1];
    if (newFiles[index] === undefined) delete newFiles[index];
    setFiles(newFiles);
  };

  const toggleCollapse = (index) => {
    setExpandedItems((prev) => {
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
    form.append("itemsData", JSON.stringify(items));
    
    Object.keys(files).forEach(index => {
      form.append(`itemImage_${index}`, files[index]);
    });

    try {
      const responseData = await api.updateInTheMedia(form);
      const { page, imageStats } = responseData;
      
      if (page.inTheMedia) {
        setFormData({
          mainTitle: page.inTheMedia.mainTitle || "",
          subtitle: page.inTheMedia.subtitle || "",
        });
        setItems(page.inTheMedia.items || []);
      }
      
      let successMsg = "Section updated successfully!";
      if (imageStats && imageStats.length > 0) {
        successMsg += " Compression saved: ";
        const details = imageStats.map((stat) => `${stat.field} (${stat.savedPercent}%)`).join(", ");
        successMsg += details;
      }
      
      showAutoHidingMessage("success", successMsg, 5000);
      setFiles({});
      
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
              placeholder="In The Media"
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

        {/* Items Management */}
        <div className="bg-gray-50 p-6 rounded-md border border-gray-200">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-[#4A3B2A]">Media Items</h3>
          </div>

          <div className="space-y-6">
            {items.length === 0 ? (
              <p className="text-gray-500 text-center py-4 italic">No media items added yet. Click "Add New Item" to create one.</p>
            ) : (
              items.map((item, index) => (
                <div key={index} className="bg-white p-5 rounded-md border border-gray-200 shadow-sm relative group">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-2 order-2 sm:order-2 ml-auto">
                      <button
                        type="button"
                        onClick={() => moveItemUp(index)}
                        disabled={index === 0}
                        className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronUp size={20} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveItemDown(index)}
                        disabled={index === items.length - 1}
                        className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronDown size={20} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl border border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Remove Item"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleCollapse(index)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
                        title={!expandedItems.has(index) ? "Expand Item" : "Collapse Item"}
                      >
                        {!expandedItems.has(index) ? <ChevronsDown size={20} /> : <ChevronsUp size={20} />}
                      </button>
                    </div>
                  </div>
                  
                  <div className={`flex flex-col gap-4`}>
                    
                    {/* Collapsed State Preview */}
                    {!expandedItems.has(index) && (
                      <div className="flex items-center gap-4 cursor-pointer" onClick={() => toggleCollapse(index)}>
                        <div className="w-16 h-12 bg-gray-100 rounded border border-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                           {item.image ? (
                             <img src={`${IMAGE_BASE_URL}${item.image}`} alt="Preview" className="w-full h-full object-cover" />
                           ) : (
                             <span className="text-xs text-gray-400">No Img</span>
                           )}
                        </div>
                        <div className="flex-1 overflow-hidden">
                           <p className="text-sm font-medium text-gray-800 truncate">
                             {item.publishedBy ? `[${item.publishedBy}] ` : ""}{item.description ? item.description.replace(/<[^>]*>?/gm, '').split('\n')[0] : "Empty Item"}
                           </p>
                           <p className="text-xs text-gray-500 truncate">
                             {item.authorName ? `${item.authorName} • ` : ""}{item.date || "No date"}
                           </p>
                        </div>
                      </div>
                    )}
 
                    {/* Expanded State */}
                    {expandedItems.has(index) && (
                      <div className="flex-1 space-y-6">
                        
                        {/* Image Upload */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                          <label className="block text-sm font-semibold text-[#4A3B2A] mb-3">Item Image (1920x1080px)</label>
                          <div className="flex flex-col md:flex-row items-start gap-6">
                            {item.image && (
                              <div className="w-full md:w-40 h-48 md:h-28 flex-shrink-0">
                                <img src={`${IMAGE_BASE_URL}${item.image}`} alt={`Item ${index}`} className="w-full h-full object-cover rounded-lg border border-gray-200 shadow-sm" />
                              </div>
                            )}
                            <div className="flex-1 w-full">
                              <input
                                type="file"
                                onChange={(e) => handleFileChange(index, e)}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#4A3B2A] file:text-white hover:file:bg-[#3a2e20] transition-colors cursor-pointer border border-dashed border-gray-300 p-4 rounded-xl bg-white"
                                accept="image/*"
                              />
                              <p className="mt-2 text-xs text-gray-500">Upload a landscape image. It will be automatically optimized.</p>
                            </div>
                          </div>
                        </div>
 
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-[#4A3B2A] mb-2">Published By</label>
                            <input
                              type="text"
                              value={item.publishedBy}
                              onChange={(e) => handleItemChange(index, "publishedBy", e.target.value)}
                              placeholder="e.g., National Geographic"
                              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4A3B2A] focus:border-[#4A3B2A]"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-[#4A3B2A] mb-2">Author Name</label>
                            <input
                              type="text"
                              value={item.authorName}
                              onChange={(e) => handleItemChange(index, "authorName", e.target.value)}
                              placeholder="e.g., John Doe"
                              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4A3B2A] focus:border-[#4A3B2A]"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-[#4A3B2A] mb-2">Date</label>
                            <input
                              type="text"
                              value={item.date}
                              onChange={(e) => handleItemChange(index, "date", e.target.value)}
                              placeholder="e.g., Oct 2023"
                              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4A3B2A] focus:border-[#4A3B2A]"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-[#4A3B2A] mb-2">Article URL (Optional)</label>
                            <input
                              type="text"
                              value={item.url || ""}
                              onChange={(e) => handleItemChange(index, "url", e.target.value)}
                              placeholder="e.g., https://example.com/article"
                              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4A3B2A] focus:border-[#4A3B2A]"
                            />
                          </div>
                        </div>
 
                        {/* Description */}
                        <div>
                          <label className="block text-sm font-semibold text-[#4A3B2A] mb-2">Description</label>
                          <RichTextEditor
                            value={item.description}
                            onChange={(val) => handleItemChange(index, "description", val)}
                            rows={4}
                            placeholder="Briefly describe the article... (supports **bold**, *italic*, - bullets)"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Full Width Add Item Button */}
          <button
            type="button"
            onClick={addItem}
            className="w-full mt-6 flex justify-center items-center gap-2 bg-[#F3EFE9] text-[#4A3B2A] border-2 border-dashed border-[#4A3B2A]/30 py-4 rounded-xl hover:bg-[#e8e3dc] hover:border-[#4A3B2A]/50 transition-all font-medium"
          >
            <Plus size={20} /> Add New Media Item
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

export default InTheMediaManager;
