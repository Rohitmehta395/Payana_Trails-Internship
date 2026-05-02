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
    senderCountryCode: "+91",
    senderCountryIso: "IN",
    senderPhone: initialData?.phone || "",
    senderLocation: "",
    recipientName: "",
    recipientEmail: "",
    recipientCountryCode: "+91",
    recipientCountryIso: "IN",
    recipientPhone: "",
    recipientLocation: "",
    giftType: "Journey",
    journeyDetails: "",
    otherDestination: "", // New field for manual entry
    giftValue: "",
    occasion: "",
    personalMessage: "",
  });

  const [trails, setTrails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState({});

  React.useEffect(() => {
    const fetchTrails = async () => {
      try {
        const data = await api.getTrails();
        setTrails(data);
      } catch (err) {
        console.error("Failed to fetch trails:", err);
      }
    };
    fetchTrails();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const nextData = { ...prev, [name]: value };

      if (name === "journeyDetails" && value !== "Others") {
        nextData.otherDestination = "";
      }

      return nextData;
    });
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
    const required = [
      "senderName",
      "senderEmail",
      "senderLocation",
      "recipientName",
      "recipientEmail",
    ];

    const missing = required.filter((field) => !formData[field]);
    const hasJourney = Boolean(formData.journeyDetails);
    const hasCredit = Boolean(String(formData.giftValue).trim());

    if (missing.length > 0) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    if (!hasJourney && !hasCredit) {
      setError(
        "Please choose one of the 2 options: Specific Journey or Travel Credit.",
      );
      setLoading(false);
      return;
    }

    if (hasJourney && hasCredit) {
      setError(
        "Choose one of the 2 options: Specific Journey or Travel Credit.",
      );
      return;
    }

    // Special validation for "Other" journey
    if (formData.journeyDetails === "Others" && !formData.otherDestination) {
      setError("Please specify the journey details.");
      setLoading(false);
      return;
    }

    try {
      // Determine gift type dynamically and format journey details
      const submissionData = {
        ...formData,
        giftType: formData.journeyDetails ? "Journey" : "Credit",
        // If "Others" was selected, use the manual entry for the final submission
        journeyDetails:
          formData.journeyDetails === "Others"
            ? formData.otherDestination
            : formData.journeyDetails,
      };
      await api.submitGift(submissionData);
      setSubmitted(true);
    } catch (err) {
      setError(
        err.message || "Failed to submit gift request. Please try again.",
      );
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
      recipientLocation: "",
      giftType: "Journey",
      journeyDetails: "",
      otherDestination: "",
      giftValue: "",
      occasion: "",
      personalMessage: "",
    }));
    setSubmitted(false);
    setError(null);
  };

  return (
    <section
      id="gift-section"
      className="px-4 bg-[#F3EFE9] border-t border-[#4A3B2A]/5"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Form on Left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 order-2 lg:order-1"
          >
            <div className="bg-white rounded-3xl shadow-xl border border-[#4A3B2A]/10 min-h-[600px] flex flex-col justify-center relative z-10">
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
                      <h3 className="text-2xl font-bold text-[#4A3B2A]">
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
                        trails={trails}
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

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-[#4A3B2A] text-[#F3EFE9] rounded-xl font-semibold text-lg hover:bg-[#3A2E21] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#4A3B2A]/20"
                      >
                        {loading ? (
                          "Processing..."
                        ) : (
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
