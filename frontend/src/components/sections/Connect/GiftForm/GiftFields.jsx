import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";
import CountryCodeDropdown from "../../../common/CountryCodeDropdown";

const GiftFields = ({ formData, touched, handleChange, handleCountryChange, handleBlur }) => {
  const inputClasses = (name) => `
    w-full px-4 py-3 rounded-xl border transition-all outline-none bg-[#F3EFE9]/10 placeholder:text-[#4A3B2A]/30
    ${touched[name] && !formData[name] && ![
        'senderPhone', 'recipientPhone', 'occasion', 'personalMessage', 'journeyDetails', 'giftValue'
    ].includes(name)
      ? "border-red-400 focus:border-red-400"
      : "border-[#4A3B2A]/10 focus:border-[#4A3B2A]/30 focus:ring-0"}
  `;

  // Custom function for conditional required fields
  const isFieldRequired = (name) => {
    if (name === 'journeyDetails') return formData.giftType === 'Journey';
    if (name === 'giftValue') return formData.giftType === 'Credit';
    return !['senderPhone', 'recipientPhone', 'occasion', 'personalMessage'].includes(name);
  };

  const ErrorMessage = ({ name }) => (
    <AnimatePresence>
      {touched[name] && !formData[name] && isFieldRequired(name) && (
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
    <div className="space-y-8">
      {/* Sender Details */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="relative">
          <label className="block text-sm font-medium text-[#4A3B2A]/80 mb-2 ml-1">Your Name *</label>
          <input
            type="text"
            name="senderName"
            value={formData.senderName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="John Doe"
            className={inputClasses("senderName")}
            required
          />
          <ErrorMessage name="senderName" />
        </div>
        <div className="relative">
          <label className="block text-sm font-medium text-[#4A3B2A]/80 mb-2 ml-1">Your Email *</label>
          <input
            type="email"
            name="senderEmail"
            value={formData.senderEmail}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="john@example.com"
            className={inputClasses("senderEmail")}
            required
          />
          <ErrorMessage name="senderEmail" />
        </div>
        <div className="relative">
          <label className="block text-sm font-medium text-[#4A3B2A]/80 mb-2 ml-1">Your Mobile (Optional)</label>
          <div className="flex gap-2">
            <div className="shrink-0">
              <CountryCodeDropdown
                value={formData.senderCountryCode}
                iso={formData.senderCountryIso}
                onChange={(val) => handleCountryChange('sender', val)}
              />
            </div>
            <input
              type="tel"
              name="senderPhone"
              value={formData.senderPhone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="98765 43210"
              className={`${inputClasses("senderPhone")} flex-1`}
            />
          </div>
        </div>
      </div>

      <hr className="border-[#4A3B2A]/10" />

      {/* Recipient Details */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="relative">
          <label className="block text-sm font-medium text-[#4A3B2A]/80 mb-2 ml-1">Recipient's Name *</label>
          <input
            type="text"
            name="recipientName"
            value={formData.recipientName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Jane Smith"
            className={inputClasses("recipientName")}
            required
          />
          <ErrorMessage name="recipientName" />
        </div>
        <div className="relative">
          <label className="block text-sm font-medium text-[#4A3B2A]/80 mb-2 ml-1">Recipient's Email *</label>
          <input
            type="email"
            name="recipientEmail"
            value={formData.recipientEmail}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="jane@example.com"
            className={inputClasses("recipientEmail")}
            required
          />
          <ErrorMessage name="recipientEmail" />
        </div>
        <div className="relative">
          <label className="block text-sm font-medium text-[#4A3B2A]/80 mb-2 ml-1">Recipient's Mobile (Optional)</label>
          <div className="flex gap-2">
            <div className="shrink-0">
              <CountryCodeDropdown
                value={formData.recipientCountryCode}
                iso={formData.recipientCountryIso}
                onChange={(val) => handleCountryChange('recipient', val)}
              />
            </div>
            <input
              type="tel"
              name="recipientPhone"
              value={formData.recipientPhone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="98765 43210"
              className={`${inputClasses("recipientPhone")} flex-1`}
            />
          </div>
        </div>
      </div>

      <hr className="border-[#4A3B2A]/10" />

      {/* Gift Configuration */}
      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-medium text-[#4A3B2A]/80 ml-1">Gift Type *</label>
          <div className="flex flex-wrap gap-4">
            {['Journey', 'Credit'].map((type) => (
              <label 
                key={type}
                className={`
                  flex-1 min-w-[140px] flex items-center justify-center gap-2 px-6 py-3 rounded-xl border transition-all duration-200 cursor-pointer
                  ${formData.giftType === type 
                    ? "border-[#4A3B2A] bg-[#4A3B2A]/5 text-[#4A3B2A] font-bold shadow-sm" 
                    : "border-[#4A3B2A]/10 bg-[#F3EFE9]/10 text-[#4A3B2A]/60 hover:border-[#4A3B2A]/30"}
                `}
              >
                <input
                  type="radio"
                  name="giftType"
                  value={type}
                  checked={formData.giftType === type}
                  onChange={handleChange}
                  className="hidden"
                />
                {type === 'Journey' ? 'Specific Journey' : 'Travel Credit'}
              </label>
            ))}
          </div>
        </div>

        {formData.giftType === 'Journey' ? (
          <div className="relative space-y-2">
            <label className="block text-sm font-medium text-[#4A3B2A]/80 mb-2 ml-1">Mention the Journey *</label>
            <textarea
              name="journeyDetails"
              value={formData.journeyDetails}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. Wildlife Trail in Kenya..."
              className={`
                ${inputClasses("journeyDetails")} min-h-[100px] resize-none
                ${touched.journeyDetails && !formData.journeyDetails ? "border-red-400" : ""}
              `}
              required
            />
            <ErrorMessage name="journeyDetails" />
          </div>
        ) : (
          <div className="relative space-y-2">
            <label className="block text-sm font-medium text-[#4A3B2A]/80 mb-2 ml-1">Gift Value (INR) *</label>
            <input
              type="text"
              name="giftValue"
              value={formData.giftValue}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. 50,000"
              className={`
                ${inputClasses("giftValue")}
                ${touched.giftValue && !formData.giftValue ? "border-red-400" : ""}
              `}
              required
            />
            <ErrorMessage name="giftValue" />
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="block text-sm font-medium text-[#4A3B2A]/80 mb-2 ml-1">Occasion</label>
                <input
                    type="text"
                    name="occasion"
                    value={formData.occasion}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g. Birthday..."
                    className={inputClasses("occasion")}
                />
            </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#4A3B2A]/80 mb-2 ml-1">Personal Message</label>
          <textarea
            name="personalMessage"
            value={formData.personalMessage}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Write your heartfelt message here..."
            className={`${inputClasses("personalMessage")} min-h-[120px] resize-none`}
          />
        </div>
      </div>
    </div>
  );
};

export default GiftFields;
