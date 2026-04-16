import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiCheckCircle, FiArrowLeft } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";

const FormSuccess = ({ onReset }) => {
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!location.state?.from) return;

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
      className="p-8 md:p-12 text-center flex flex-col items-center justify-center min-h-[500px]"
    >
      <div className="w-20 h-20 bg-[#4A3B2A]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <FiCheckCircle size={40} className="text-[#4A3B2A]" />
      </div>
      <h2 className="text-3xl font-bold text-[#4A3B2A] mb-4">Thank You!</h2>
      <p className="text-[#4A3B2A]/70 mb-8 max-w-md mx-auto">
        Your enquiry has been received. We'll get back to you shortly to
        start planning your perfect journey.
      </p>
      
      <div className="flex flex-col items-center gap-6">
        <button
          onClick={onReset}
          className="px-8 py-3 bg-[#4A3B2A] text-[#F3EFE9] rounded-xl font-medium hover:bg-[#3A2E21] transition-colors"
        >
          Send Another Enquiry
        </button>

        {location.state?.from && (
          <div className="flex items-center gap-2 text-sm text-[#4A3B2A]/50 bg-[#F3EFE9]/50 px-4 py-2 rounded-full">
            <FiArrowLeft size={14} />
            <span>Redirecting you back to your journey in <b>{countdown}s</b></span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default FormSuccess;
