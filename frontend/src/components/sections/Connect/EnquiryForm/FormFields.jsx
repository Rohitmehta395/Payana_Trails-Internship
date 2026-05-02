import React, { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    addonBefore,
  }) => (
    <div className="space-y-2">
      {(label || Icon) && (
        <label className="flex items-center gap-2 text-sm font-medium text-[#4A3B2A]">
          {Icon && <Icon size={16} className="text-[#4A3B2A]/60" />}
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <div className={`relative ${addonBefore ? 'flex gap-2' : ''}`}>
        {addonBefore && <div className="shrink-0">{addonBefore}</div>}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`w-full px-4 py-3 bg-white border rounded-xl transition-all duration-200 outline-none
          ${error ? "border-red-300 focus:border-red-400 ring-1 ring-red-200" : "border-[#4A3B2A]/10 focus:border-[#4A3B2A] focus:ring-2 focus:ring-[#4A3B2A]/10"}
          text-[#4A3B2A] placeholder:text-[#4A3B2A]/30 ${addonBefore ? "flex-1" : ""}`}
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
  }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const dropdownRef = React.useRef(null);

    React.useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find(
      (opt) => (typeof opt === "string" ? opt : opt.value) === value
    );
    const displayLabel = selectedOption
      ? typeof selectedOption === "string"
        ? selectedOption
        : selectedOption.label
      : placeholder;

    const handleSelect = (val) => {
      // Simulate event object for existing onChange handlers
      onChange({ target: { name, value: val } });
      setIsOpen(false);
    };

    return (
      <div className="space-y-2 relative" ref={dropdownRef}>
        {(label || Icon) && (
          <label className="flex items-center gap-2 text-sm font-medium text-[#4A3B2A]">
            {Icon && <Icon size={16} className="text-[#4A3B2A]/60" />}
            {label} {required && <span className="text-red-400">*</span>}
          </label>
        )}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            onBlur={onBlur}
            className={`w-full px-4 py-3 bg-white border rounded-xl transition-all duration-200 outline-none flex items-center justify-between text-left
            ${
              error
                ? "border-red-300 focus:border-red-400 ring-1 ring-red-200"
                : "border-[#4A3B2A]/10 focus:border-[#4A3B2A] focus:ring-2 focus:ring-[#4A3B2A]/10"
            }
            ${!selectedOption ? "text-[#4A3B2A]/30" : "text-[#4A3B2A]"}`}
          >
            <span className="truncate pr-4">{displayLabel}</span>
            <svg
              className={`w-5 h-5 text-[#4A3B2A]/40 transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
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
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute z-[100] left-0 right-0 mt-2 bg-white border border-[#4A3B2A]/10 rounded-2xl shadow-2xl overflow-hidden py-2 max-h-[300px] overflow-y-auto custom-scrollbar"
              >
                {options.map((opt, idx) => {
                  const optVal = typeof opt === "string" ? opt : opt.value;
                  const optLabel = typeof opt === "string" ? opt : opt.label;
                  const isSelected = optVal === value;

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelect(optVal)}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-all duration-200 flex items-center justify-between
                      ${
                        isSelected
                          ? "bg-[#4A3B2A] text-white"
                          : "text-[#4A3B2A] hover:bg-[#F3EFE9]"
                      }`}
                    >
                      <span className="truncate pr-4">{optLabel}</span>
                      {isSelected && (
                        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {error && (
          <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
            <FiAlertCircle size={12} /> {error}
          </p>
        )}
      </div>
    );
  }
);
