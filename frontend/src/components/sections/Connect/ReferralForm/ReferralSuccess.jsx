import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiGift, FiArrowLeft } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";

const ReferralSuccess = ({ onAction }) => {
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          const from = location.state?.from || -1;
          const section = location.state?.section;
          const target = (typeof from === 'string' && section) ? `${from}#${section}` : from;
          navigate(target);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, location.state]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-8 md:p-12 text-center space-y-8 flex flex-col items-center justify-center min-h-[500px]"
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

      <div className="flex flex-col items-center gap-6">
        <button
          onClick={onAction}
          className="px-8 py-3 bg-[#4A3B2A] text-[#F3EFE9] rounded-xl font-medium hover:bg-[#3A2E21] transition-all duration-200"
        >
          Refer Another Friend
        </button>

        <div className="flex items-center gap-2 text-sm text-[#4A3B2A]/50 bg-[#F3EFE9]/50 px-4 py-2 rounded-full">
            <FiArrowLeft size={14} />
            <span>Redirecting you back to your journey in <b>{countdown}s</b></span>
        </div>
      </div>
    </motion.div>
  );
};

export default ReferralSuccess;
