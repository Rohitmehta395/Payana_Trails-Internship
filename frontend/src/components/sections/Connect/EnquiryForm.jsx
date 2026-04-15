import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { api } from "../../../services/api";
import { FiSend } from "react-icons/fi";

// Sub-components
import FormSidebar from "./EnquiryForm/FormSidebar";
import FormSuccess from "./EnquiryForm/FormSuccess";
import ContactSection from "./EnquiryForm/sections/ContactSection";
import TravelSection from "./EnquiryForm/sections/TravelSection";
import AdditionalSection from "./EnquiryForm/sections/AdditionalSection";
import ConnectSection from "./EnquiryForm/sections/ConnectSection";

const EnquiryForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    trailName: "",
    otherDestination: "",
    travelMonth: "",
    travelYear: "",
    guests: "2",
    roomPreference: "Standard",
    message: "",
    connectMethod: "eMail",
  });
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await api.getDestinations();
        setDestinations(data);
      } catch (err) {
        console.error("Failed to fetch destinations:", err);
      }
    };
    fetchDestinations();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (!touched[name]) setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const validateField = (name, value) => {
    if (!value && name !== "otherDestination" && name !== "message")
      return "This field is required";
    if (name === "email" && value && !/^\S+@\S+\.\S+$/.test(value))
      return "Please enter a valid email";
    return null;
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

    try {
      await api.submitEnquiry(formData);
      setSubmitted(true);
      
      if (formData.connectMethod === "Google Meet") {
        window.open(
          "https://calendar.app.google/UyT5meYWKpCyKy7S7",
          "_blank",
          "noopener,noreferrer"
        );
      }
      
      setFormData({
        name: "",
        email: "",
        phone: "",
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
        top: document.getElementById("enquiry-form-section").offsetTop - 100,
        behavior: "smooth",
      });
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return <FormSuccess onReset={() => setSubmitted(false)} />;
  }

  return (
    <section id="enquiry-form-section" className="py-16 px-4 bg-[#F3EFE9]">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          <FormSidebar />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-3xl shadow-xl border border-[#4A3B2A]/10 overflow-hidden">
              <div className="p-6 md:p-8 border-b border-[#4A3B2A]/10 bg-[#F3EFE9]/30">
                <h3 className="text-xl font-semibold text-[#4A3B2A]">Enquiry Form</h3>
                <p className="text-[#4A3B2A]/60 text-sm mt-1">Fields marked with * are required</p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
                <ContactSection 
                  formData={formData} 
                  touched={touched} 
                  validateField={validateField} 
                  handleChange={handleChange} 
                  handleBlur={handleBlur} 
                />
                
                <TravelSection 
                  formData={formData} 
                  destinations={destinations} 
                  touched={touched} 
                  validateField={validateField} 
                  handleSelectChange={handleSelectChange} 
                  handleChange={handleChange} 
                  handleBlur={handleBlur} 
                />

                <AdditionalSection 
                  formData={formData} 
                  touched={touched} 
                  validateField={validateField} 
                  handleSelectChange={handleSelectChange} 
                  handleChange={handleChange} 
                />

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
                    <span className="text-sm">{error}</span>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-[#4A3B2A] text-[#F3EFE9] rounded-xl font-semibold text-lg hover:bg-[#3A2E21] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#4A3B2A]/20"
                >
                  {loading ? "Processing..." : <>Submit Enquiry <FiSend /></>}
                </button>

                <p className="text-xs text-[#4A3B2A]/50 text-center mt-4">
                  By submitting, you agree to our privacy policy and terms.
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EnquiryForm;
