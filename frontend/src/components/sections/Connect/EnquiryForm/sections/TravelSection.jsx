import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMapPin, FiCalendar, FiUsers } from "react-icons/fi";
import { InputField, SelectField } from "../FormFields";
import { validateField } from "../validation";
import { months, years, guestOptions } from "../constants.jsx";

const TravelSection = ({
  formData,
  touched,
  destinations,
  handleChange,
  handleSelectChange,
  handleBlur,
}) => {
  return (
    <div>
      <h4 className="text-lg font-medium text-[#4A3B2A] mb-4 flex items-center gap-2">
        <FiMapPin className="text-[#4A3B2A]" /> Travel Plans
      </h4>
      <div className="space-y-6">
        <SelectField
          icon={FiMapPin}
          name="trailName"
          label="Trail / Destination"
          placeholder="Select a trail"
          options={[
            ...destinations.map((d) => ({
              label: d.name,
              value: d.name,
            })),
            { label: "Others (Please specify)", value: "Others" },
          ]}
          value={formData.trailName}
          onChange={(e) => handleSelectChange("trailName", e.target.value)}
          onBlur={handleBlur}
          error={touched.trailName && validateField("trailName", formData.trailName)}
        />

        <AnimatePresence>
          {formData.trailName === "Others" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <InputField
                icon={FiMapPin}
                name="otherDestination"
                label="Specify Destination"
                placeholder="e.g., Andaman Islands"
                value={formData.otherDestination}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.otherDestination &&
                  validateField("otherDestination", formData.otherDestination)
                }
                required={false}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[#4A3B2A] mb-2">
              <FiCalendar size={16} className="text-[#4A3B2A]/60" /> Travel
              Month <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <SelectField
                name="travelMonth"
                placeholder="Month"
                options={months}
                value={formData.travelMonth}
                required={false}
                onChange={(e) =>
                  handleSelectChange("travelMonth", e.target.value)
                }
                onBlur={handleBlur}
                error={
                  touched.travelMonth &&
                  validateField("travelMonth", formData.travelMonth)
                }
              />
              <SelectField
                name="travelYear"
                placeholder="Year"
                options={years}
                value={formData.travelYear}
                required={false}
                onChange={(e) =>
                  handleSelectChange("travelYear", e.target.value)
                }
                onBlur={handleBlur}
                error={
                  touched.travelYear &&
                  validateField("travelYear", formData.travelYear)
                }
              />
            </div>
          </div>
          <SelectField
            icon={FiUsers}
            name="guests"
            label="Number of Guests"
            placeholder="Select"
            options={guestOptions}
            value={formData.guests}
            onChange={(e) => handleSelectChange("guests", e.target.value)}
            onBlur={handleBlur}
            error={touched.guests && validateField("guests", formData.guests)}
          />
        </div>
      </div>
    </div>
  );
};

export default TravelSection;
