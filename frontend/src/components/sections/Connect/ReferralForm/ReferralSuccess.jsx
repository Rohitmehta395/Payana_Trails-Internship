import React from "react";
import { motion } from "framer-motion";
import { FiGift } from "react-icons/fi";

const ReferralSuccess = ({ onAction }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-8 md:p-12 text-center space-y-6"
    >
      <div className="w-20 h-20 bg-[#4A3B2A]/10 rounded-full flex items-center justify-center mx-auto text-[#4A3B2A]">
        <FiGift size={40} />
      </div>
      
      <div className="space-y-3">
        <h3 className="text-2xl font-bold text-[#4A3B2A]">Thank You for Referring!</h3>
        <p className="text-[#4A3B2A]/70 max-w-sm mx-auto">
          As a gesture of gratitude, you will receive a Payana Travel Credit once your friend completes their journey. Details will be shared with you via email.
        </p>
      </div>

      <button
        onClick={onAction}
        className="px-8 py-3 bg-[#4A3B2A] text-[#F3EFE9] rounded-xl font-medium hover:bg-[#3A2E21] transition-all duration-200"
      >
        Refer Another Friend
      </button>
    </motion.div>
  );
};

export default ReferralSuccess;
