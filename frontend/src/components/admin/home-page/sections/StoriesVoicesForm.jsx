import React from "react";
import ImageUploadField from "../ImageUploadField";

const StoriesVoicesForm = ({ data, onChange, onFileSelect, compressionStats, compressionLoading, children }) => {
  const handleChange = (e) => {
    onChange({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div className="mb-8 border border-gray-200 rounded-lg p-6 bg-gray-50">
      <h2 className="text-xl font-bold text-[#4A3B2A] mb-4">3. Stories & Voices</h2>
      <div className="grid grid-cols-1 gap-4 mb-4">
        <div>
          <label className="block text-sm font-semibold text-[#4A3B2A] mb-1">Title</label>
          <input type="text" name="title" value={data.title || ""} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A3B2A]" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#4A3B2A] mb-1">Quote</label>
          <textarea name="quote" value={data.quote || ""} onChange={handleChange} rows={2} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A3B2A]" />
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

export default StoriesVoicesForm;
