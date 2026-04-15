import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiAlertCircle } from "react-icons/fi";
import { api } from "../../../../services/api";
import GiftFields from "./GiftFields";
import GiftSuccess from "./GiftSuccess";
import GiftSidebar from "./GiftSidebar";

const GiftForm = ({ initialData = {} }) => {
  const [formData, setFormData] = useState({
    senderName: initialData?.name || "",
    senderEmail: initialData?.email || "",
    senderPhone: initialData?.phone || "",
    recipientName: "",
    recipientEmail: "",
    recipientPhone: "",
    giftType: "Journey",
    journeyDetails: "",
    giftValue: "",
    occasion: "",
    personalMessage: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic validation
    const required = [
      "senderName", 
      "senderEmail", 
      "recipientName", 
      "recipientEmail",
      formData.giftType === "Journey" ? "journeyDetails" : "giftValue"
    ];

    const missing = required.filter(field => !formData[field]);
    if (missing.length > 0) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      await api.submitGift(formData);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Failed to submit gift request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData((prev) => ({
      ...prev,
      recipientName: "",
      recipientEmail: "",
      recipientPhone: "",
      giftType: "Journey",
      journeyDetails: "",
      giftValue: "",
      occasion: "",
      personalMessage: "",
    }));
    setSubmitted(false);
    setError(null);
  };

  return (
    <section id="gift-section" className="py-24 px-4 bg-[#F3EFE9] border-t border-[#4A3B2A]/5">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Form on Left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 order-2 lg:order-1"
          >
            <div className="bg-white rounded-3xl shadow-xl border border-[#4A3B2A]/10 overflow-hidden min-h-[600px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <GiftSuccess key="success" onAction={resetForm} />
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-6 md:p-8 space-y-8"
                  >
                    <div className="border-b border-[#4A3B2A]/10 pb-6 mb-6">
                      <h3 className="text-xl font-semibold text-[#4A3B2A]">
                        Gifting Details
                      </h3>
                      <p className="text-[#4A3B2A]/60 text-sm mt-1">
                        Fields marked with * are required
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                      <GiftFields
                        formData={formData}
                        touched={touched}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                      />

                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-600"
                        >
                          <FiAlertCircle size={20} />
                          <span className="text-sm">{error}</span>
                        </motion.div>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-[#4A3B2A] text-[#F3EFE9] rounded-xl font-semibold text-lg hover:bg-[#3A2E21] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#4A3B2A]/20"
                      >
                        {loading ? "Processing..." : (
                          <>
                            Submit Gift Request <FiSend />
                          </>
                        )}
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Sidebar on Right */}
          <GiftSidebar />
        </div>
      </div>
    </section>
  );
};

export default GiftForm;
