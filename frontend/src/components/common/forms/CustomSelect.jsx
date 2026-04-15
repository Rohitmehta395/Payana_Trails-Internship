import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";

const CustomSelect = ({ label, options, value, onChange, placeholder, icon: Icon, required }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange({ target: { name: label.toLowerCase().replace(/ /g, ""), value: optionValue } });
    setIsOpen(false);
  };

  const selectedOption = options.find(opt => opt.value === value || opt === value);
  const displayValue = selectedOption ? (selectedOption.label || selectedOption) : "";

  return (
    <div className="relative space-y-2" ref={dropdownRef}>
      <label className="text-xs uppercase tracking-widest font-bold text-[#4A3B2A]/60 flex items-center gap-2">
        {Icon && <Icon size={12} />} {label}
      </label>
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-[#F3EFE9]/30 border-b-2 ${isOpen ? "border-[#4A3B2A]" : "border-[#4A3B2A]/10"} py-3 px-1 flex items-center justify-between cursor-pointer transition-all duration-300 group`}
      >
        <span className={`font-sans ${!displayValue ? "text-[#4A3B2A]/40" : "text-[#4A3B2A]"}`}>
          {displayValue || placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-[#4A3B2A]/40 group-hover:text-[#4A3B2A]"
        >
          <FiChevronDown size={18} />
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-[#4A3B2A]/5 overflow-hidden max-h-60 overflow-y-auto custom-scrollbar"
          >
            {options.length === 0 ? (
              <div className="px-5 py-4 text-[#4A3B2A]/40 italic text-sm">No options available</div>
            ) : (
              options.map((option, idx) => {
                const optValue = option.value || option;
                const optLabel = option.label || option;
                const isSelected = value === optValue;

                return (
                  <div
                    key={idx}
                    onClick={() => handleSelect(optValue)}
                    className={`px-5 py-3 hover:bg-[#F3EFE9] transition-colors cursor-pointer text-sm font-sans ${isSelected ? "bg-[#F3EFE9] text-[#4A3B2A] font-medium" : "text-[#4A3B2A]/80"}`}
                  >
                    {optLabel}
                  </div>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {required && <input type="hidden" name={label} value={value} required />}
    </div>
  );
};

export default CustomSelect;
