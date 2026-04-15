import React, { memo } from "react";
import { FiAlertCircle } from "react-icons/fi";

export const InputField = memo(
  ({
    icon: Icon,
    name,
    label,
    type = "text",
    required = true,
    placeholder,
    value,
    onChange,
    onBlur,
    error,
  }) => (
    <div className="space-y-2">
      {(label || Icon) && (
        <label className="flex items-center gap-2 text-sm font-medium text-[#4A3B2A]">
          {Icon && <Icon size={16} className="text-[#4A3B2A]/60" />}
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`w-full px-4 py-3 bg-white border rounded-xl transition-all duration-200 outline-none
          ${error ? "border-red-300 focus:border-red-400 ring-1 ring-red-200" : "border-[#4A3B2A]/10 focus:border-[#4A3B2A] focus:ring-2 focus:ring-[#4A3B2A]/10"}
          text-[#4A3B2A] placeholder:text-[#4A3B2A]/30`}
        />
      </div>
      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
          <FiAlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  ),
);

export const SelectField = memo(
  ({
    icon: Icon,
    name,
    label,
    options,
    value,
    required = true,
    placeholder,
    onChange,
    onBlur,
    error,
  }) => (
    <div className="space-y-2">
      {(label || Icon) && (
        <label className="flex items-center gap-2 text-sm font-medium text-[#4A3B2A]">
          {Icon && <Icon size={16} className="text-[#4A3B2A]/60" />}
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`w-full px-4 py-3 bg-white border rounded-xl appearance-none transition-all duration-200 outline-none cursor-pointer
          ${error ? "border-red-300 focus:border-red-400 ring-1 ring-red-200" : "border-[#4A3B2A]/10 focus:border-[#4A3B2A] focus:ring-2 focus:ring-[#4A3B2A]/10"}
          text-[#4A3B2A]`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt, idx) => (
            <option key={idx} value={typeof opt === "string" ? opt : opt.value}>
              {typeof opt === "string" ? opt : opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg
            className="w-5 h-5 text-[#4A3B2A]/40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
          <FiAlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  ),
);
