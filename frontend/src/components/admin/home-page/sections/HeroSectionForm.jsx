import React from "react";

const HeroSectionForm = ({ data, onChange, children }) => {
  const handleChange = (e) => {
    onChange({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div className="mb-8 border border-gray-200 rounded-lg p-6 bg-gray-50">
      <h2 className="text-xl font-bold text-[#4A3B2A] mb-4">1. Hero Section</h2>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-semibold text-[#4A3B2A] mb-1">Header Title</label>
          <input
            type="text"
            name="headerTitle"
            value={data.headerTitle || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A3B2A]"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#4A3B2A] mb-1">Subtitle</label>
          <textarea
            name="subtitle"
            value={data.subtitle || ""}
            onChange={handleChange}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A3B2A]"
            required
          />
        </div>
      </div>
      {children}
    </div>
  );
};

export default HeroSectionForm;
