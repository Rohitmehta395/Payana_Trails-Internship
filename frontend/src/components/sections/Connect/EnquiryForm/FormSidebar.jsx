import React from "react";
import { motion } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";

const FormSidebar = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="lg:col-span-1"
    >
      <div className="lg:sticky lg:top-8 space-y-8">
        <div>
          <span className="text-[#4A3B2A] font-semibold text-md uppercase tracking-wider">
            Start Your Journey
          </span>
          <h2 className="text-4xl font-bold text-[#4A3B2A] mt-2 leading-tight">
            Design Your <br />
            <span className="text-[#4A3B2A] italic">Personal Trail</span>
          </h2>
          <p className="text-[#4A3B2A]/70 mt-4 text-lg">
            Share your travel preferences and we'll craft a unique journey just
            for you.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#4A3B2A]/10 space-y-4">
          <h3 className="font-semibold text-[#4A3B2A] flex items-center gap-2">
            <FiCheckCircle className="text-[#4A3B2A]" /> What happens next?
          </h3>
          <ul className="space-y-3 text-sm text-[#4A3B2A]/70">
            <li className="flex gap-3">
              <span className="font-medium text-[#4A3B2A]">1.</span> We'll
              review your preferences within 24 hours.
            </li>
            <li className="flex gap-3">
              <span className="font-medium text-[#4A3B2A]">2.</span> A Trail
              Curator will contact you via your preferred method.
            </li>
            <li className="flex gap-3">
              <span className="font-medium text-[#4A3B2A]">3.</span> You'll
              receive a personalized itinerary draft.
            </li>
          </ul>
        </div>

        <div className="bg-[#4A3B2A]/5 p-6 rounded-2xl border border-[#4A3B2A]/10">
          <p className="text-[#4A3B2A] italic">
            "Every journey begins with a conversation. Let's make yours
            unforgettable."
          </p>
          <p className="text-[#4A3B2A] font-medium mt-2">
            — Payana Trails Team
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default FormSidebar;
