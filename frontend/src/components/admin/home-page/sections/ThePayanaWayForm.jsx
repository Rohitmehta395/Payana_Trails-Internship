import React from "react";
import ImageUploadField from "../ImageUploadField";

const ThePayanaWayForm = ({ data, onChange, onFileSelect, compressionStats, compressionLoading, children }) => {
  const handleChange = (e) => {
    onChange({ ...data, [e.target.name]: e.target.value });
  };

  const handleHighlightChange = (index, value) => {
    const newHighlights = [...(data.highlights || ["", "", "", ""])];
    newHighlights[index] = value;
    onChange({ ...data, highlights: newHighlights });
  };

  return (
    <div className="mb-8 border border-gray-200 rounded-lg p-6 bg-gray-50">
      <h2 className="text-xl font-bold text-[#4A3B2A] mb-4">2. The Payana Way</h2>
      
      <div className="grid grid-cols-1 gap-4 mb-4">
        <div>
          <label className="block text-sm font-semibold text-[#4A3B2A] mb-1">Title</label>
          <input type="text" name="title" value={data.title || ""} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A3B2A]" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#4A3B2A] mb-1">Subtitle</label>
          <input type="text" name="subtitle" value={data.subtitle || ""} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A3B2A]" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#4A3B2A] mb-1">Quote</label>
          <textarea name="quote" value={data.quote || ""} onChange={handleChange} rows={3} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A3B2A]" />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-[#4A3B2A] mb-2">Highlights (Exactly 4)</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[0, 1, 2, 3].map((index) => (
            <input
              key={index}
              type="text"
              value={data.highlights?.[index] || ""}
              onChange={(e) => handleHighlightChange(index, e.target.value)}
              placeholder={`Highlight ${index + 1}`}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A3B2A]"
            />
          ))}
        </div>
      </div>

      <ImageUploadField 
        label="Hero Image" 
        currentImage={data.heroImage} 
        onImageSelect={onFileSelect} 
        compressionStats={compressionStats}
        compressionLoading={compressionLoading}
      />
      {children}
    </div>
  );
};

export default ThePayanaWayForm;
