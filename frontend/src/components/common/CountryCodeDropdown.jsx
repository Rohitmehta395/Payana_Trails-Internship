import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { countries } from "../../utils/countries";

const CountryCodeDropdown = ({ value, iso, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  const selectedCountry = countries.find((c) => c.iso === iso) || 
                          countries.find((c) => c.code === value) || {
                            name: "India",
                            code: "+91",
                            iso: "IN",
                          };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCountries = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.includes(search)
  );

  return (
    <div className="relative w-[110px] sm:w-[120px]" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setSearch("");
        }}
        className="w-full h-full min-h-[48px] bg-white border border-[#4A3B2A]/20 rounded-xl px-2 py-3 text-[#4A3B2A] focus:outline-none focus:ring-2 focus:ring-[#4A3B2A]/20 transition-all flex items-center justify-between"
      >
        <div className="flex flex-col items-start leading-none ml-1 overflow-hidden w-[60px] sm:w-[70px]">
          <span className="text-xs sm:text-sm font-semibold truncate">{selectedCountry.code}</span>
          <span className="text-[9px] uppercase opacity-60 truncate w-full text-left">{selectedCountry.iso}</span>
        </div>
        <FaChevronDown
          size={12}
          className={`transition-transform duration-300 opacity-70 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[calc(100%+8px)] left-0 w-[240px] bg-white border border-[#4A3B2A]/10 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col"
          >
            <div className="p-3 border-b border-[#4A3B2A]/10 bg-[#F3EFE9]/30 relative">
              <FaSearch size={12} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#4A3B2A]/40" />
              <input
                type="text"
                placeholder="Search country or code"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
                className="w-full bg-white border border-[#4A3B2A]/20 rounded-lg pl-8 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#4A3B2A]/20 text-[#4A3B2A]"
              />
            </div>
            <div className="max-h-[220px] overflow-y-auto w-full custom-scrollbar">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((c, index) => (
                  <button
                    key={`${c.iso}-${index}`}
                    type="button"
                    className="w-full text-left px-4 py-2 text-sm hover:bg-[#F3EFE9] transition-colors flex justify-between items-center"
                    onClick={() => {
                      if (onChange) onChange({ code: c.code, iso: c.iso });
                      setIsOpen(false);
                    }}
                  >
                    <span className="text-[#4A3B2A] truncate pr-2" title={c.name}>{c.name}</span>
                    <span className="text-[#4A3B2A]/60 flex-shrink-0 text-xs font-mono">{c.code}</span>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-[#4A3B2A]/50">
                  No countries found.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CountryCodeDropdown;
