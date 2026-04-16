import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiAlertCircle } from "react-icons/fi";
import { api } from "../../../../services/api";
import ReferralFields from "./ReferralFields";
import ReferralSuccess from "./ReferralSuccess";
import ReferralSidebar from "./ReferralSidebar";

const ReferralForm = ({ initialData = {} }) => {
  const [formData, setFormData] = useState({
    referrerName: initialData?.name || "",
    referrerEmail: initialData?.email || "",
    referrerCountryCode: "+91",
    referrerCountryIso: "IN",
    referrerPhone: initialData?.phone || "",
    referrerLocation: "",
    friendName: "",
    friendEmail: "",
    friendCountryCode: "+91",
    friendCountryIso: "IN",
    friendPhone: "",
    friendLocation: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (fieldPrefix, { code, iso }) => {
    setFormData((prev) => ({
      ...prev,
      [`${fieldPrefix}CountryCode`]: code,
      [`${fieldPrefix}CountryIso`]: iso,
    }));
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
    if (!formData.referrerName || !formData.referrerEmail || !formData.referrerLocation || !formData.friendName || !formData.friendEmail) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      await api.submitReferral(formData);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Failed to submit referral. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData((prev) => ({
      ...prev,
      friendName: "",
      friendEmail: "",
      friendPhone: "",
      friendLocation: "",
      message: "",
    }));
    setSubmitted(false);
    setError(null);
  };

  return (
    <section id="referral-section" className="py-24 px-4 bg-[#F3EFE9] border-t border-[#4A3B2A]/5">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Form on Left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 order-2 lg:order-1"
          >
            <div className="bg-white rounded-3xl shadow-xl border border-[#4A3B2A]/10 min-h-[500px] flex flex-col justify-center relative z-10">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <ReferralSuccess key="success" onAction={resetForm} />
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-6 md:p-8 space-y-8"
                  >
                    <div className="border-b border-[#4A3B2A]/10 pb-6 mb-6">
                      <h3 className="text-2xl font-bold text-[#4A3B2A]">
                        Referral Details
                      </h3>
                      <p className="text-[#4A3B2A]/60 text-sm mt-1">
                        Fields marked with * are required
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                      <ReferralFields
                        formData={formData}
                        touched={touched}
                        handleChange={handleChange}
                        handleCountryChange={handleCountryChange}
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

                      {/* Important Notes */}
                      <div className="bg-[#4A3B2A]/5 p-6 rounded-2xl border border-[#4A3B2A]/10 space-y-3">
                        <p className="text-xs font-bold text-[#4A3B2A] uppercase tracking-widest opacity-60">
                          Note:
                        </p>
                        <ul className="space-y-2">
                          {[
                            "Referrals of immediate family members are not eligible for Payana Travel Credit.",
                            "Details regarding Payana Travel Credit and redemption modes will be shared via email.",
                            "Payana Travel Credit is valid only for redemption against a future booking made with Payana Trails and cannot be used for past journeys.",
                          ].map((text, i) => (
                            <li key={i} className="flex gap-2 text-[13px] md:text-sm text-[#4A3B2A]/80 leading-relaxed">
                              <span className="mt-1.5 w-1 h-1 rounded-full bg-[#4A3B2A]/30 shrink-0" />
                              <span>{text}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-[#4A3B2A] text-[#F3EFE9] rounded-xl font-semibold text-lg hover:bg-[#3A2E21] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#4A3B2A]/20"
                      >
                        {loading ? "Processing..." : (
                          <>
                            Submit Referral <FiSend />
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
        <ReferralSidebar />
        </div>
      </div>
    </section>
  );
};

export default ReferralForm;
