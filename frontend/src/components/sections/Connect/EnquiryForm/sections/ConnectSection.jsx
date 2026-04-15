import React from "react";
import { connectOptions } from "../constants.jsx";

const ConnectSection = ({ formData, handleSelectChange }) => {
  return (
    <div>
      <h4 className="text-lg font-medium text-[#4A3B2A] mb-4">
        How would you like to connect?
      </h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {connectOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => handleSelectChange("connectMethod", opt.value)}
            className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2
              ${
                formData.connectMethod === opt.value
                  ? "border-[#4A3B2A] bg-[#4A3B2A]/10 text-[#4A3B2A]"
                  : "border-[#4A3B2A]/10 bg-white text-[#4A3B2A]/70 hover:border-[#4A3B2A]/30 hover:bg-[#F3EFE9]/50"
              }`}
          >
            <span className="text-xl">{opt.icon}</span>
            <span className="text-xs font-medium">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ConnectSection;
