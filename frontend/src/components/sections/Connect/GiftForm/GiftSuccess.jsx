import React from "react";
import { motion } from "framer-motion";
import { FiCheckCircle, FiHeart } from "react-icons/fi";

const GiftSuccess = ({ onAction }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="p-8 md:p-12 text-center flex flex-col items-center justify-center min-h-[500px]"
    >
      <div className="w-24 h-24 bg-[#4A3B2A]/10 rounded-3xl flex items-center justify-center mb-8 relative">
        <FiCheckCircle size={48} className="text-[#4A3B2A]" />
        <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border border-[#4A3B2A]/10"
        >
            <FiHeart size={16} className="text-red-500 fill-red-500" />
        </motion.div>
      </div>

      <h2 className="text-3xl font-bold text-[#4A3B2A] mb-4">Your Gift is Being Prepared</h2>
      <p className="text-[#4A3B2A]/70 mb-2 max-w-md mx-auto text-lg font-medium">
        Thank you for choosing to Gift a Journey with Payana Trails.
      </p>
      <p className="text-[#4A3B2A]/60 mb-10 max-w-sm mx-auto">
        We will carefully curate your gift and share the details with you shortly via email.
      </p>

      <button
        onClick={onAction}
        className="px-10 py-4 bg-[#4A3B2A] text-[#F3EFE9] rounded-xl font-bold text-lg hover:bg-[#3A2E21] transition-all transform hover:scale-105 shadow-xl shadow-[#4A3B2A]/20"
      >
        Gift Another Journey
      </button>
    </motion.div>
  );
};

export default GiftSuccess;
