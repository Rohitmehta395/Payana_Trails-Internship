import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../../../services/api";
import { FiSend, FiAlertCircle } from "react-icons/fi";

// Sub-components
import FormSidebar from "./EnquiryForm/FormSidebar";
import FormSuccess from "./EnquiryForm/FormSuccess";
import ContactSection from "./EnquiryForm/sections/ContactSection";
import TravelSection from "./EnquiryForm/sections/TravelSection";
import AdditionalSection from "./EnquiryForm/sections/AdditionalSection";
import ConnectSection from "./EnquiryForm/sections/ConnectSection";

// Helpers
import { validateField } from "./EnquiryForm/validation";

const EnquiryForm = ({ onSuccess }) => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+91",
    countryIso: "IN",
    phone: "",
    currentLocation: "",
    trailName: "",
    otherDestination: "",
    travelMonth: "",
    travelYear: "",
    guests: "2",
    roomPreference: "Standard",
    message: "",
    connectMethod: "eMail",
  });
  const [trails, setTrails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState({});

  useEffect(() => {
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

  useEffect(() => {
    if (location.state?.trailName) {
      // If we already have trails, find the match to get the full formatted name
      if (trails.length > 0) {
        const match = trails.find(t => t.trailName === location.state.trailName);
        if (match) {
          setFormData((prev) => ({ 
            ...prev, 
            trailName: `${match.trailName} (${match.trailDestination})` 
          }));
          return;
        }
      }
      // Otherwise set the name as-is (TravelSection will handle display or it'll be updated once trails load)
      setFormData((prev) => ({ ...prev, trailName: location.state.trailName }));
    }
  }, [location.state, trails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (!touched[name]) setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleCountryChange = ({ code, iso }) => {
    setFormData((prev) => ({ ...prev, countryCode: code, countryIso: iso }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    const requiredFields = [
      "name",
      "email",
      "phone",
      "currentLocation",
      "trailName",
      "travelMonth",
      "travelYear",
    ];
    const missing = requiredFields.filter((field) => !formData[field]);
    if (missing.length > 0) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      await api.submitEnquiry(formData);
      if (onSuccess) onSuccess(formData);
      setSubmitted(true);
      if (formData.connectMethod === "Google Meet") {
        window.open(
          "https://calendar.app.google/UyT5meYWKpCyKy7S7",
          "_blank",
          "noopener,noreferrer",
        );
      }
      setFormData({
        name: "",
        email: "",
        phone: "",
        currentLocation: "",
        trailName: "",
        otherDestination: "",
        travelMonth: "",
        travelYear: "",
        guests: "2",
        roomPreference: "Standard",
        message: "",
        connectMethod: "eMail",
      });
      setTouched({});
      window.scrollTo({
        top: document.getElementById("enquiry-section").offsetTop - 100,
        behavior: "smooth",
      });
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="enquiry-section" className="py-12 md:py-16 px-4 bg-[#F3EFE9] scroll-mt-24">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Sidebar */}
          <FormSidebar />

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl border border-[#4A3B2A]/10 relative z-10 overflow-hidden">
              {submitted ? (
                <FormSuccess onReset={() => setSubmitted(false)} />
              ) : (
                <>
                  <div className="p-5 md:p-8 border-b border-[#4A3B2A]/10 bg-[#F3EFE9]/30 rounded-t-2xl md:rounded-t-3xl flex items-center justify-between">
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-[#4A3B2A]">
                        Enquiry Form
                      </h3>
                      <p className="text-[#4A3B2A]/60 text-xs md:text-sm mt-1">
                        Fields marked with * are required
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="p-5 md:p-8 space-y-8">
                    {/* Contact Section */}
                    <ContactSection
                      formData={formData}
                      touched={touched}
                      handleChange={handleChange}
                      handleCountryChange={handleCountryChange}
                      handleBlur={handleBlur}
                    />

                    {/* Travel Section */}
                    <TravelSection
                      formData={formData}
                      touched={touched}
                      trails={trails}
                      handleChange={handleChange}
                      handleSelectChange={handleSelectChange}
                      handleBlur={handleBlur}
                    />

                    {/* Additional Section */}
                    <AdditionalSection
                      formData={formData}
                      touched={touched}
                      handleChange={handleChange}
                      handleSelectChange={handleSelectChange}
                      handleBlur={handleBlur}
                    />

                    {/* Connect Section */}
                    <ConnectSection
                      formData={formData}
                      handleSelectChange={handleSelectChange}
                    />

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-600"
                      >
                        <FiAlertCircle size={20} />{" "}
                        <span className="text-sm">{error}</span>
                      </motion.div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-[#4A3B2A] text-[#F3EFE9] rounded-xl font-semibold text-lg hover:bg-[#3A2E21] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#4A3B2A]/20"
                    >
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 text-[#F3EFE9]"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          Submit Enquiry <FiSend />
                        </>
                      )}
                    </button>

                    <p className="text-xs text-[#4A3B2A]/50 text-center mt-4">
                      By submitting, you agree to our privacy policy and terms.
                    </p>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EnquiryForm;
