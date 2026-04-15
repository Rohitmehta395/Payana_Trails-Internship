import React from "react";
import { FiMessageSquare } from "react-icons/fi";
import { SelectField, SectionHeader } from "../FormUI";
import { roomPreferences } from "../constants";

const AdditionalSection = ({
  formData,
  touched,
  validateField,
  handleSelectChange,
  handleChange,
}) => {
  return (
    <div>
      <SectionHeader icon={FiMessageSquare} title="Additional Details" />
      <div className="space-y-6">
        <SelectField
          name="roomPreference"
          label="Room Preference"
          placeholder="Select preference"
          options={roomPreferences}
          value={formData.roomPreference}
          onChange={(e) => handleSelectChange("roomPreference", e.target.value)}
          error={
            touched.roomPreference && validateField("roomPreference", formData.roomPreference)
          }
        />
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-[#4A3B2A]">
            <FiMessageSquare size={16} className="text-[#4A3B2A]/60" /> Message
            (Optional)
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us more about your travel style, special requests, or anything else..."
            className="w-full px-4 py-3 bg-white border border-[#4A3B2A]/10 rounded-xl focus:border-[#4A3B2A] focus:ring-2 focus:ring-[#4A3B2A]/10 outline-none transition-all duration-200 min-h-[120px] resize-y text-[#4A3B2A] placeholder:text-[#4A3B2A]/30"
          />
        </div>
      </div>
    </div>
  );
};

export default AdditionalSection;
