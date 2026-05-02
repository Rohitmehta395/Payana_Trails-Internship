import React from "react";

const NewsletterSectionForm = ({ data, onChange, children }) => {
  const handleChange = (e) => {
    onChange({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div className="mb-8 border border-gray-200 rounded-lg p-6 bg-gray-50">
      
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-semibold text-[#4A3B2A] mb-1">Title</label>
          <input type="text" name="title" value={data.title || ""} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A3B2A]" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#4A3B2A] mb-1">Subtitle</label>
          <input type="text" name="subtitle" value={data.subtitle || ""} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A3B2A]" />
        </div>
      </div>
      {children}
    </div>
  );
};

export default NewsletterSectionForm;
