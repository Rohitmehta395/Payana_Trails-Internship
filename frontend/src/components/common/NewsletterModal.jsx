import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaXmark, FaEnvelopeOpenText, FaWhatsapp } from "react-icons/fa6";
import { useNewsletter } from "../../context/NewsletterContext";
import { api } from "../../services/api";
import BrownBtn from "./buttons/BrownBtn";

const NewsletterModal = () => {
  const { isModalOpen, closeNewsletterModal } = useNewsletter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
  });
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobile") {
      // Allow only numbers, +, -, ( , ) and spaces
      const filteredValue = value.replace(/[^0-9+\s()-]/g, "");
      setFormData({ ...formData, [name]: filteredValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      await api.subscribeNewsletter(formData);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setMessage(err.message || "Something went wrong. Please try again.");
    }
  };

  if (!isModalOpen) return null;

  return (
    <AnimatePresence>
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeNewsletterModal}
            className="absolute inset-0 bg-[#4A3B2A]/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-xl bg-[#F3EFE9] rounded-3xl overflow-hidden shadow-2xl border border-[#4A3B2A]/10"
          >
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#4A3B2A]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            
            {/* Close Button */}
            <button
              onClick={closeNewsletterModal}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#4A3B2A]/10 text-[#4A3B2A] transition-colors z-10"
              aria-label="Close modal"
            >
              <FaXmark size={24} />
            </button>

            <div className="p-8 sm:p-12">
              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 bg-[#4A3B2A] rounded-full flex items-center justify-center text-[#F3EFE9] mx-auto mb-6">
                    <FaEnvelopeOpenText size={32} />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#4A3B2A] mb-4">
                    Thank you for subscribing.
                  </h3>
                  <p className="text-[#4A3B2A]/80 text-lg leading-relaxed">
                    We look forward to sharing thoughtfully curated journeys and travel stories that inspire you.
                  </p>
                  <button
                    onClick={closeNewsletterModal}
                    className="mt-8 text-[#4A3B2A] font-semibold underline underline-offset-4 hover:opacity-70 transition-opacity"
                  >
                    Back to exploring
                   </button>
                </motion.div>
              ) : (
                <>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-[#4A3B2A]/10 rounded-full flex items-center justify-center text-[#4A3B2A]">
                      <FaEnvelopeOpenText size={20} />
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#4A3B2A]">
                        Join Our Newsletter
                      </h2>
                      <p className="text-[#4A3B2A]/70 text-sm">
                        Stay connected with stories that matter.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label htmlFor="fullName" className="block text-xs font-bold tracking-widest text-[#4A3B2A]/60 uppercase mb-2 ml-1">
                        Full Name
                      </label>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full bg-white border border-[#4A3B2A]/20 rounded-xl px-4 py-3 text-[#4A3B2A] placeholder-[#4A3B2A]/30 focus:outline-none focus:ring-2 focus:ring-[#4A3B2A]/20 transition-all"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-xs font-bold tracking-widest text-[#4A3B2A]/60 uppercase mb-2 ml-1">
                        Email Address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-white border border-[#4A3B2A]/20 rounded-xl px-4 py-3 text-[#4A3B2A] placeholder-[#4A3B2A]/30 focus:outline-none focus:ring-2 focus:ring-[#4A3B2A]/20 transition-all"
                      />
                    </div>

                    <div>
                      <label htmlFor="mobile" className="block text-xs font-bold tracking-widest text-[#4A3B2A]/60 uppercase mb-2 ml-1 flex items-center gap-2">
                        Mobile Number <span className="text-[10px] lowercase font-normal italic opacity-70">(Optional / WhatsApp preferred)</span>
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#25D366]">
                          <FaWhatsapp size={18} />
                        </div>
                        <input
                          id="mobile"
                          name="mobile"
                          type="tel"
                          placeholder="+91 00000 00000"
                          pattern="[0-9+\s()-]*"
                          inputMode="tel"
                          value={formData.mobile}
                          onChange={handleChange}
                          className="w-full bg-white border border-[#4A3B2A]/20 rounded-xl pl-11 pr-4 py-3 text-[#4A3B2A] placeholder-[#4A3B2A]/30 focus:outline-none focus:ring-2 focus:ring-[#4A3B2A]/20 transition-all"
                        />
                      </div>
                    </div>

                    {status === "error" && (
                      <p className="text-red-600 text-sm font-medium mt-2 ml-1 italic">
                        {message}
                      </p>
                    )}

                    <div className="pt-4">
                      <BrownBtn
                        text={status === "loading" ? "Subscribing..." : "Subscribe to our Newsletter \u2192"}
                        className="w-full py-4 text-lg shadow-xl shadow-[#4A3B2A]/10"
                        disabled={status === "loading"}
                        type="submit"
                      />
                    </div>
                  </form>
                  
                  <p className="mt-6 text-center text-[#4A3B2A]/50 text-[11px] leading-relaxed">
                    By subscribing, you agree to receive our travel stories and curated journeys. <br />
                    We respect your privacy. Unsubscribe at any time.
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default NewsletterModal;
