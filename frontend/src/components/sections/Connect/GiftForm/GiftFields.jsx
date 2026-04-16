import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiAlertCircle, FiMap, FiCreditCard } from "react-icons/fi";
import CountryCodeDropdown from "../../../common/CountryCodeDropdown";

const GiftFields = ({ formData, touched, trails = [], handleChange, handleCountryChange, handleBlur }) => {
  const inputClasses = (name) => `
    w-full px-4 py-3 rounded-xl border transition-all outline-none bg-[#F3EFE9]/10 placeholder:text-[#4A3B2A]/30
    ${touched[name] && !formData[name] && ![
        'senderPhone', 'recipientPhone', 'recipientLocation', 'occasion', 'personalMessage', 'journeyDetails', 'giftValue'
    ].includes(name)
      ? "border-red-400 focus:border-red-400"
      : "border-[#4A3B2A]/10 focus:border-[#4A3B2A]/30 focus:ring-0"}
  `;

  // Custom function for conditional required fields
  const isFieldRequired = (name) => {
    if (name === 'journeyDetails') return !formData.giftValue;
    if (name === 'giftValue') return !formData.journeyDetails;
    return !['senderPhone', 'recipientPhone', 'recipientLocation', 'occasion', 'personalMessage'].includes(name);
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

        <div className="relative group">
          <label className="block text-sm font-medium text-[#4A3B2A]/80 mb-2 ml-1">Your Location *</label>
          <input
            type="text"
            name="senderLocation"
            value={formData.senderLocation}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="City, Country"
            className={inputClasses("senderLocation")}
            required
          />
          <ErrorMessage name="senderLocation" />
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

        <div className="relative group">
          <label className="block text-sm font-medium text-[#4A3B2A]/80 mb-2 ml-1">Recipient's Location (Optional)</label>
          <input
            type="text"
            name="recipientLocation"
            value={formData.recipientLocation}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="City, Country"
            className={inputClasses("recipientLocation")}
          />
        </div>
      </div>

      <hr className="border-[#4A3B2A]/10" />

      {/* Gift Configuration */}
      <div className="space-y-10">
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold text-[#4A3B2A] tracking-tight">Select Your Gift Type</h3>
          <p className="text-[#4A3B2A]/40 text-xs uppercase tracking-[0.2em] font-medium">Choose one path for your recipient</p>
        </div>

        <div className="grid md:grid-cols-[1fr,auto,1fr] gap-4 md:gap-0 items-stretch relative">
          {/* Specific Journey Option */}
          <motion.div 
            layout
            className={`
              relative p-6 md:p-8 rounded-[2rem] border transition-all duration-700
              ${formData.journeyDetails ? "bg-[#4A3B2A]/5 border-[#4A3B2A]/20 shadow-2xl shadow-[#4A3B2A]/10 z-10 scale-[1.02]" : "bg-white border-[#4A3B2A]/10"}
              ${formData.giftValue ? "filter grayscale(1) blur(3px) opacity-30 pointer-events-none scale-[0.96]" : "hover:border-[#4A3B2A]/30"}
            `}
          >
            <div className="flex flex-col h-full space-y-6">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl transition-all duration-500 ${formData.journeyDetails ? "bg-[#4A3B2A] text-[#F3EFE9] rotate-12" : "bg-[#F3EFE9] text-[#4A3B2A]"}`}>
                  <FiMap size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-[#4A3B2A] text-lg">Specific Journey</h4>
                  <p className="text-xs text-[#4A3B2A]/50">Gift a curated trail experience</p>
                </div>
              </div>

              <div className="relative flex-1 space-y-4">
                <div className="relative">
                  <select
                    name="journeyDetails"
                    value={formData.journeyDetails}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`
                      w-full px-4 py-4 rounded-[1.25rem] border transition-all outline-none bg-white/50 appearance-none cursor-pointer text-[#4A3B2A]
                      ${touched.journeyDetails && !formData.journeyDetails && !formData.giftValue ? "border-red-300" : "border-[#4A3B2A]/5 focus:border-[#4A3B2A]/30"}
                    `}
                    required={!formData.giftValue}
                  >
                    <option value="" disabled>Select a Journey</option>
                    {trails.map((t, idx) => (
                      <option key={idx} value={`${t.trailName} (${t.trailDestination})`}>
                        {t.trailName} ({t.trailDestination})
                      </option>
                    ))}
                    <option value="Others">Others (Please specify)</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-[#4A3B2A]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                <AnimatePresence>
                  {formData.journeyDetails === "Others" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="relative overflow-hidden"
                    >
                      <input
                        type="text"
                        name="otherDestination"
                        value={formData.otherDestination}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Specify Destination (e.g., Andaman Islands)"
                        className={`
                          w-full px-4 py-3 rounded-xl border transition-all outline-none bg-white/40 placeholder:text-[#4A3B2A]/30 text-[#4A3B2A]
                          ${touched.otherDestination && !formData.otherDestination ? "border-red-300" : "border-[#4A3B2A]/5 focus:border-[#4A3B2A]/30"}
                        `}
                        required
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <AnimatePresence>
                  {formData.giftValue && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex items-center justify-center rounded-[1.25rem] bg-white/10 backdrop-blur-[2px] z-10"
                    >
                      <div className="bg-[#4A3B2A] text-[#F3EFE9] px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl flex items-center gap-2">
                        <FiAlertCircle size={14} className="text-orange-400" />
                        Option Locked
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <ErrorMessage name="journeyDetails" />
            </div>
          </motion.div>

          {/* Divider */}
          <div className="flex md:flex-col items-center justify-center p-4">
            <div className="h-px md:h-full w-full md:w-px bg-gradient-to-r md:bg-gradient-to-b from-transparent via-[#4A3B2A]/10 to-transparent relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#F3EFE9] p-3 rounded-full border border-[#4A3B2A]/5 shadow-inner">
                <span className="text-[10px] font-black text-[#4A3B2A]/20 uppercase tracking-[0.2em] italic">OR</span>
              </div>
            </div>
          </div>

          {/* Travel Credit Option */}
          <motion.div 
            layout
            className={`
              relative p-6 md:p-8 rounded-[2rem] border transition-all duration-700
              ${formData.giftValue ? "bg-[#4A3B2A]/5 border-[#4A3B2A]/20 shadow-2xl shadow-[#4A3B2A]/10 z-10 scale-[1.02]" : "bg-white border-[#4A3B2A]/10"}
              ${formData.journeyDetails ? "filter grayscale(1) blur(3px) opacity-30 pointer-events-none scale-[0.96]" : "hover:border-[#4A3B2A]/30"}
            `}
          >
            <div className="flex flex-col h-full space-y-6">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl transition-all duration-500 ${formData.giftValue ? "bg-[#4A3B2A] text-[#F3EFE9] -rotate-12" : "bg-[#F3EFE9] text-[#4A3B2A]"}`}>
                  <FiCreditCard size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-[#4A3B2A] text-lg">Travel Credit</h4>
                  <p className="text-xs text-[#4A3B2A]/50">Let them choose their own path</p>
                </div>
              </div>

              <div className="relative flex-1">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4A3B2A]/30 font-bold">₹</span>
                  <input
                    type="text"
                    name="giftValue"
                    value={formData.giftValue}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter amount (e.g. 50,000)"
                    className={`
                      w-full pl-8 pr-4 py-4 rounded-[1.25rem] border transition-all outline-none bg-white/50 placeholder:text-[#4A3B2A]/20 text-[#4A3B2A] font-medium
                      ${touched.giftValue && !formData.giftValue && !formData.journeyDetails ? "border-red-300" : "border-[#4A3B2A]/5 focus:border-[#4A3B2A]/30"}
                    `}
                  />
                </div>

                <AnimatePresence>
                  {formData.journeyDetails && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex items-center justify-center rounded-[1.25rem] bg-white/10 backdrop-blur-[2px]"
                    >
                      <div className="bg-[#4A3B2A] text-[#F3EFE9] px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl flex items-center gap-2">
                        <FiAlertCircle size={14} className="text-orange-400" />
                        Option Locked
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <ErrorMessage name="giftValue" />
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
            <div className="space-y-2">
                <label className="block text-sm font-medium text-[#4A3B2A]/80 mb-2 ml-1">Occasion</label>
                <input
                    type="text"
                    name="occasion"
                    value={formData.occasion}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g. Birthday, Anniversary, or just because!"
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
