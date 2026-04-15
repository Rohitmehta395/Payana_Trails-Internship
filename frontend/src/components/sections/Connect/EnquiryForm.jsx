import React, { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../../services/api";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiUsers,
  FiMessageSquare,
  FiSend,
  FiCheckCircle,
  FiAlertCircle,
  FiVideo,
  FiMessageCircle,
} from "react-icons/fi";

// ---------- Reusable Stable Input Components ----------
const InputField = memo(
  ({
    icon: Icon,
    name,
    label,
    type = "text",
    required = true,
    placeholder,
    value,
    onChange,
    onBlur,
    error,
  }) => (
    <div className="space-y-2">
      {(label || Icon) && (
        <label className="flex items-center gap-2 text-sm font-medium text-[#4A3B2A]">
          {Icon && <Icon size={16} className="text-[#4A3B2A]/60" />}
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`w-full px-4 py-3 bg-white border rounded-xl transition-all duration-200 outline-none
          ${error ? "border-red-300 focus:border-red-400 ring-1 ring-red-200" : "border-[#4A3B2A]/10 focus:border-[#4A3B2A] focus:ring-2 focus:ring-[#4A3B2A]/10"}
          text-[#4A3B2A] placeholder:text-[#4A3B2A]/30`}
        />
      </div>
      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
          <FiAlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  ),
);

const SelectField = memo(
  ({
    icon: Icon,
    name,
    label,
    options,
    value,
    required = true,
    placeholder,
    onChange,
    onBlur,
    error,
  }) => (
    <div className="space-y-2">
      {(label || Icon) && (
        <label className="flex items-center gap-2 text-sm font-medium text-[#4A3B2A]">
          {Icon && <Icon size={16} className="text-[#4A3B2A]/60" />}
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`w-full px-4 py-3 bg-white border rounded-xl appearance-none transition-all duration-200 outline-none cursor-pointer
          ${error ? "border-red-300 focus:border-red-400 ring-1 ring-red-200" : "border-[#4A3B2A]/10 focus:border-[#4A3B2A] focus:ring-2 focus:ring-[#4A3B2A]/10"}
          text-[#4A3B2A]`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt, idx) => (
            <option key={idx} value={typeof opt === "string" ? opt : opt.value}>
              {typeof opt === "string" ? opt : opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg
            className="w-5 h-5 text-[#4A3B2A]/40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
          <FiAlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  ),
);

// ---------- Main Component ----------
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

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentYear = new Date().getFullYear();
  const years = [
    currentYear.toString(),
    (currentYear + 1).toString(),
    (currentYear + 2).toString(),
  ];
  const guestOptions = Array.from({ length: 11 }, (_, i) => (i + 2).toString());
  const roomPreferences = ["Luxury", "Premium", "Standard"];
  const connectOptions = [
    { label: "Phone Call", value: "Phone call", icon: <FiPhone /> },
    { label: "Email", value: "eMail", icon: <FiMail /> },
    { label: "WhatsApp", value: "WhatsApp Message", icon: <FiMessageCircle /> },
    { label: "Google Meet", value: "Google Meet", icon: <FiVideo /> },
  ];

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
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError("Please enter a valid email address.");
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
          "noopener,noreferrer",
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
            <h2 className="text-3xl font-bold text-[#4A3B2A] mb-4">
              Thank You!
            </h2>
            <p className="text-[#4A3B2A]/70 mb-8 max-w-md mx-auto">
              Your enquiry has been received. We'll get back to you shortly to
              start planning your perfect journey.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="px-8 py-3 bg-[#4A3B2A] text-[#F3EFE9] rounded-xl font-medium hover:bg-[#3A2E21] transition-colors"
            >
              Send Another Enquiry
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="enquiry-form-section" className="py-16 px-4 bg-[#F3EFE9]">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="lg:sticky lg:top-8 space-y-8">
              <div>
                <span className="text-[#4A3B2A] font-semibold text-sm uppercase tracking-wider">
                  Start Your Journey
                </span>
                <h2 className="text-4xl font-bold text-[#4A3B2A] mt-2 leading-tight">
                  Design Your <br />
                  <span className="text-[#4A3B2A] italic">Personal Trail</span>
                </h2>
                <p className="text-[#4A3B2A]/70 mt-4 text-lg">
                  Share your travel preferences and we'll craft a unique journey
                  just for you.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#4A3B2A]/10 space-y-4">
                <h3 className="font-semibold text-[#4A3B2A] flex items-center gap-2">
                  <FiCheckCircle className="text-[#4A3B2A]" /> What happens
                  next?
                </h3>
                <ul className="space-y-3 text-sm text-[#4A3B2A]/70">
                  <li className="flex gap-3">
                    <span className="font-medium text-[#4A3B2A]">1.</span> We'll
                    review your preferences within 24 hours.
                  </li>
                  <li className="flex gap-3">
                    <span className="font-medium text-[#4A3B2A]">2.</span> A
                    travel expert will contact you via your preferred method.
                  </li>
                  <li className="flex gap-3">
                    <span className="font-medium text-[#4A3B2A]">3.</span>{" "}
                    You'll receive a personalized itinerary draft.
                  </li>
                </ul>
              </div>

              <div className="bg-[#4A3B2A]/5 p-6 rounded-2xl border border-[#4A3B2A]/10">
                <p className="text-[#4A3B2A] italic">
                  "Every journey begins with a conversation. Let's make yours
                  unforgettable."
                </p>
                <p className="text-[#4A3B2A] font-medium mt-2">
                  — Payana Trails Team
                </p>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-3xl shadow-xl border border-[#4A3B2A]/10 overflow-hidden">
              <div className="p-6 md:p-8 border-b border-[#4A3B2A]/10 bg-[#F3EFE9]/30">
                <h3 className="text-xl font-semibold text-[#4A3B2A]">
                  Enquiry Form
                </h3>
                <p className="text-[#4A3B2A]/60 text-sm mt-1">
                  Fields marked with * are required
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
                {/* Contact */}
                <div>
                  <h4 className="text-lg font-medium text-[#4A3B2A] mb-4 flex items-center gap-2">
                    <FiUser className="text-[#4A3B2A]" /> Contact Information
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <InputField
                      icon={FiUser}
                      name="name"
                      label="Full Name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        touched.name && validateField("name", formData.name)
                      }
                    />
                    <InputField
                      icon={FiMail}
                      name="email"
                      label="Email Address"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        touched.email && validateField("email", formData.email)
                      }
                    />
                    <div className="md:col-span-2">
                      <InputField
                        icon={FiPhone}
                        name="phone"
                        label="Phone / WhatsApp"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={
                          touched.phone &&
                          validateField("phone", formData.phone)
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Travel */}
                <div>
                  <h4 className="text-lg font-medium text-[#4A3B2A] mb-4 flex items-center gap-2">
                    <FiMapPin className="text-[#4A3B2A]" /> Travel Plans
                  </h4>
                  <div className="space-y-6">
                    <SelectField
                      icon={FiMapPin}
                      name="trailName"
                      label="Trail / Destination"
                      placeholder="Select a trail"
                      options={[
                        ...destinations.map((d) => ({
                          label: d.name,
                          value: d.name,
                        })),
                        { label: "Others (Please specify)", value: "Others" },
                      ]}
                      value={formData.trailName}
                      onChange={(e) =>
                        handleSelectChange("trailName", e.target.value)
                      }
                      onBlur={handleBlur}
                      error={
                        touched.trailName &&
                        validateField("trailName", formData.trailName)
                      }
                    />

                    <AnimatePresence>
                      {formData.trailName === "Others" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <InputField
                            icon={FiMapPin}
                            name="otherDestination"
                            label="Specify Destination"
                            placeholder="e.g., Andaman Islands"
                            value={formData.otherDestination}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                              touched.otherDestination &&
                              validateField(
                                "otherDestination",
                                formData.otherDestination,
                              )
                            }
                            required={false}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-[#4A3B2A] mb-2">
                          <FiCalendar size={16} className="text-[#4A3B2A]/60" />{" "}
                          Travel Month <span className="text-red-400">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <SelectField
                            name="travelMonth"
                            placeholder="Month"
                            options={months}
                            value={formData.travelMonth}
                            required={false}
                            onChange={(e) =>
                              handleSelectChange("travelMonth", e.target.value)
                            }
                            onBlur={handleBlur}
                            error={
                              touched.travelMonth &&
                              validateField("travelMonth", formData.travelMonth)
                            }
                          />
                          <SelectField
                            name="travelYear"
                            placeholder="Year"
                            options={years}
                            value={formData.travelYear}
                            required={false}
                            onChange={(e) =>
                              handleSelectChange("travelYear", e.target.value)
                            }
                            onBlur={handleBlur}
                            error={
                              touched.travelYear &&
                              validateField("travelYear", formData.travelYear)
                            }
                          />
                        </div>
                      </div>
                      <SelectField
                        icon={FiUsers}
                        name="guests"
                        label="Number of Guests"
                        placeholder="Select"
                        options={guestOptions}
                        value={formData.guests}
                        onChange={(e) =>
                          handleSelectChange("guests", e.target.value)
                        }
                        onBlur={handleBlur}
                        error={
                          touched.guests &&
                          validateField("guests", formData.guests)
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Additional */}
                <div>
                  <h4 className="text-lg font-medium text-[#4A3B2A] mb-4 flex items-center gap-2">
                    <FiMessageSquare className="text-[#4A3B2A]" /> Additional
                    Details
                  </h4>
                  <div className="space-y-6">
                    <SelectField
                      name="roomPreference"
                      label="Room Preference"
                      placeholder="Select preference"
                      options={roomPreferences}
                      value={formData.roomPreference}
                      onChange={(e) =>
                        handleSelectChange("roomPreference", e.target.value)
                      }
                      onBlur={handleBlur}
                      error={
                        touched.roomPreference &&
                        validateField("roomPreference", formData.roomPreference)
                      }
                    />
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-[#4A3B2A]">
                        <FiMessageSquare
                          size={16}
                          className="text-[#4A3B2A]/60"
                        />{" "}
                        Message (Optional)
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us more about your travel style, special requests, or anything else..."
                        className="w-full px-4 py-3 bg-white border border-[#4A3B2A]/10 rounded-xl focus:border-[#4A3B2A] focus:ring-2 focus:ring-[#4A3B2A]/10 outline-none transition-all duration-200 min-h-[120px] resize-y text-[#4A3B2A] placeholder:text-[#4A3B2A]/30"
                      />
                    </div>
                  </div>
                </div>

                {/* Connect */}
                <div>
                  <h4 className="text-lg font-medium text-[#4A3B2A] mb-4">
                    How would you like to connect?
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {connectOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() =>
                          handleSelectChange("connectMethod", opt.value)
                        }
                        className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2
                          ${
                            formData.connectMethod === opt.value
                              ? "border-[#4A3B2A] bg-[#4A3B2A]/10 text-[#4A3B2A]"
                              : "border-[#4A3B2A]/10 bg-white text-[#4A3B2A]/70 hover:border-[#4A3B2A]/30 hover:bg-[#F3EFE9]/50"
                          }`}
                      >
                        <span className="text-xl">{opt.icon}</span>
                        <span className="text-xs font-medium">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

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
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EnquiryForm;
