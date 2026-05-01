import React from "react";

const TextAreaField = ({ label, name, value, onChange, required, rows = 3, ...props }) => (
  <div>
    <label className="block text-sm font-semibold text-[#4A3B2A] mb-1">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      rows={rows}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A3B2A]"
      {...props}
    />
  </div>
);

export default TextAreaField;
