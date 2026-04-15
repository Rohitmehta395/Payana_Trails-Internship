import React from "react";
import { motion } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";

const FormSuccess = ({ onReset }) => {
  return (
    <section id="enquiry-form-section" className="py-16 px-4 bg-[#F3EFE9]">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-[#4A3B2A]/10 text-center"
        >
          <div className="w-20 h-20 bg-[#4A3B2A]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle size={40} className="text-[#4A3B2A]" />
          </div>
          <h2 className="text-3xl font-bold text-[#4A3B2A] mb-4">Thank You!</h2>
          <p className="text-[#4A3B2A]/70 mb-8 max-w-md mx-auto">
            Your enquiry has been received. We'll get back to you shortly to
            start planning your perfect journey.
          </p>
          <button
            onClick={onReset}
            className="px-8 py-3 bg-[#4A3B2A] text-[#F3EFE9] rounded-xl font-medium hover:bg-[#3A2E21] transition-colors"
          >
            Send Another Enquiry
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default FormSuccess;
