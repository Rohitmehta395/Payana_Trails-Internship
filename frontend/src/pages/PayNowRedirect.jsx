import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCreditCard, FaCircleExclamation, FaHouse } from "react-icons/fa6";
import { api } from "../services/api";

const PayNowRedirect = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payUrl, setPayUrl] = useState("");
  const redirectAttempted = useRef(false);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const result = await api.getFooter();
        if (result && result.payNowEnabled && result.payNowUrl) {
          setPayUrl(result.payNowUrl);
          setLoading(false);

          // Attempt to open in a new tab immediately (preventing double open in React StrictMode)
          if (!redirectAttempted.current) {
            redirectAttempted.current = true;
            window.open(result.payNowUrl, "_blank");
          }
        } else {
          setError("The online payment portal is currently inactive or not configured. Please contact our support team.");
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to load payment settings", err);
        setError("Unable to load payment configuration. Please check your internet connection and try again.");
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, []);

  return (
    <div className="min-h-[80dvh] bg-[#F3EFE9] flex items-center justify-center px-4 py-40">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-[#4A3B2A]/5 text-center"
      >
        {loading ? (
          <div className="py-10">
            <div className="w-12 h-12 border-4 border-[#4A3B2A]/20 border-t-[#4A3B2A] rounded-full animate-spin mx-auto mb-6" />
            <p className="text-[#4A3B2A] font-semibold tracking-wide uppercase text-sm opacity-80">
              Preparing payment portal...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center py-4">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-600 mx-auto mb-6">
              <FaCircleExclamation size={40} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#4A3B2A] mb-4">
              Payment Gateway Offline
            </h1>
            <p className="text-[#4A3B2A]/70 mb-8 leading-relaxed text-sm">
              {error}
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-[#4A3B2A] text-[#F3EFE9] px-6 py-3 rounded-full font-medium hover:bg-[#3d3022] transition-colors"
            >
              <FaHouse size={18} />
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center py-2">
            <div className="w-20 h-20 bg-[#4A3B2A]/5 text-[#4A3B2A] rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <FaCreditCard size={36} />
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#4A3B2A] mb-4">
              Payment Redirection
            </h1>
            
            <p className="text-[#4A3B2A]/70 mb-8 leading-relaxed text-sm">
              Redirecting you to the secure checkout page...
            </p>

            <a
              href={payUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-[#4A3B2A] text-[#F3EFE9] px-8 py-3.5 rounded-full font-bold uppercase tracking-wider text-xs hover:bg-[#3d3022] transition-colors cursor-pointer mb-6"
            >
              Proceed to Payment
            </a>

            <div className="text-[11px] text-[#4A3B2A]/60 leading-normal max-w-xs">
              <p className="mb-1">
                A payment window should open automatically.
              </p>
              <p>
                If your browser blocked the automatic redirect, please click the button above.
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PayNowRedirect;
