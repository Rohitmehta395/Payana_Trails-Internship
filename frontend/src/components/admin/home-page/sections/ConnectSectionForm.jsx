import React from "react";
import ImageUploadField from "../ImageUploadField";

const ConnectSectionForm = ({ data, onChange, onFileSelect, compressionStats, compressionLoading, children }) => {
  const handleChange = (e) => {
    onChange({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div className="mb-8 border border-gray-200 rounded-lg p-6 bg-gray-50">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-[#4A3B2A] mb-1">Quote</label>
          <input type="text" name="quote" value={data.quote || ""} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A3B2A]" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#4A3B2A] mb-1">Title</label>
          <input type="text" name="title" value={data.title || ""} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A3B2A]" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#4A3B2A] mb-1">Subtitle</label>
          <input type="text" name="subtitle" value={data.subtitle || ""} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A3B2A]" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#4A3B2A] mb-1">Email</label>
          <input type="email" name="email" value={data.email || ""} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A3B2A]" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#4A3B2A] mb-1">Phone Number</label>
          <input type="text" name="number" value={data.number || ""} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A3B2A]" />
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

export default ConnectSectionForm;
