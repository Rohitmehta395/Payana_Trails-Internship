import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";
import CountryCodeDropdown from "../../../common/CountryCodeDropdown";

const ReferralFields = ({ formData, touched, handleChange, handleCountryChange, handleBlur }) => {
  const inputClasses = (name) => `
    w-full px-4 py-3 rounded-xl border transition-all outline-none bg-[#F3EFE9]/10 placeholder:text-[#4A3B2A]/30
    ${touched[name] && !formData[name] && name !== 'referrerPhone' && name !== 'friendPhone' && name !== 'message'
      ? "border-red-400 focus:border-red-400"
      : "border-[#4A3B2A]/10 focus:border-[#4A3B2A]/30 focus:ring-0"}
  `;

  const ErrorMessage = ({ name }) => (
    <AnimatePresence>
      {touched[name] && !formData[name] && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="flex items-center gap-1.5 mt-1.5 text-red-500 text-xs ml-1"
        >
          <FiAlertCircle size={12} />
          <span>This field is required</span>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Your Name */}
        <div className="relative group">
          <label className="block text-sm font-medium text-[#4A3B2A]/80 mb-2 ml-1">
            Your Name *
          </label>
          <input
            type="text"
            name="referrerName"
            value={formData.referrerName}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className={inputClasses("referrerName")}
            placeholder="Name"
          />
          <ErrorMessage name="referrerName" />
        </div>

        {/* Your Email */}
        <div className="relative group">
          <label className="block text-sm font-medium text-[#4A3B2A]/80 mb-2 ml-1">
            Your Email *
          </label>
          <input
            type="email"
            name="referrerEmail"
            value={formData.referrerEmail}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className={inputClasses("referrerEmail")}
            placeholder="email@example.com"
          />
          <ErrorMessage name="referrerEmail" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Your Mobile */}
        <div className="relative group">
          <label className="block text-sm font-medium text-[#4A3B2A]/80 mb-2 ml-1">
            Your Mobile Number (Optional)
          </label>
          <div className="flex gap-2">
            <div className="shrink-0">
              <CountryCodeDropdown
                value={formData.referrerCountryCode}
                iso={formData.referrerCountryIso}
                onChange={(val) => handleCountryChange('referrer', val)}
              />
            </div>
            <input
              type="tel"
              name="referrerPhone"
              value={formData.referrerPhone}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${inputClasses("referrerPhone")} flex-1`}
              placeholder="98765 43210"
            />
          </div>
        </div>

        {/* Friend's Name */}
        <div className="relative group">
          <label className="block text-sm font-medium text-[#4A3B2A]/80 mb-2 ml-1">
            Friend's Name *
          </label>
          <input
            type="text"
            name="friendName"
            value={formData.friendName}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className={inputClasses("friendName")}
            placeholder="Friend's Name"
          />
          <ErrorMessage name="friendName" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Friend's Email */}
        <div className="relative group">
          <label className="block text-sm font-medium text-[#4A3B2A]/80 mb-2 ml-1">
            Friend's Email *
          </label>
          <input
            type="email"
            name="friendEmail"
            value={formData.friendEmail}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className={inputClasses("friendEmail")}
            placeholder="friend@example.com"
          />
          <ErrorMessage name="friendEmail" />
        </div>

        {/* Friend's Mobile */}
        <div className="relative group">
          <label className="block text-sm font-medium text-[#4A3B2A]/80 mb-2 ml-1">
            Friend's Mobile Number (Optional)
          </label>
          <div className="flex gap-2">
            <div className="shrink-0">
              <CountryCodeDropdown
                value={formData.friendCountryCode}
                iso={formData.friendCountryIso}
                onChange={(val) => handleCountryChange('friend', val)}
              />
            </div>
            <input
              type="tel"
              name="friendPhone"
              value={formData.friendPhone}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${inputClasses("friendPhone")} flex-1`}
              placeholder="98765 43210"
            />
          </div>
        </div>
      </div>

      {/* Message */}
      <div className="relative group">
        <div className="flex justify-between items-center ml-1 mb-2">
          <label className="text-sm font-medium text-[#4A3B2A]/80">
            Write your message here
          </label>
          <span className={`text-[10px] ${formData.message.length > 280 ? 'text-red-500' : 'text-[#4A3B2A]/40'}`}>
            {formData.message.length}/300
          </span>
        </div>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          onBlur={handleBlur}
          maxLength={300}
          rows={3}
          className={`${inputClasses("message")} resize-none`}
          placeholder="Share something special..."
        />
      </div>
    </div>
  );
};

export default ReferralFields;
