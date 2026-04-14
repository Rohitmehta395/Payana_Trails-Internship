import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelopeCircleCheck, FaCircleExclamation, FaHouse } from "react-icons/fa6";
import { api } from "../services/api";

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleUnsubscribe = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Invalid unsubscription link. No token provided.");
        return;
      }

      try {
        const response = await api.unsubscribeNewsletter(token);
        setStatus("success");
        setMessage(response.message || "You have been successfully unsubscribed.");
      } catch (err) {
        setStatus("error");
        setMessage(err.message || "Failed to unsubscribe. The link may be expired or invalid.");
      }
    };

    handleUnsubscribe();
  }, [token]);

  return (
    <div className="min-h-[80dvh] bg-[#F3EFE9] flex items-center justify-center px-4 py-40">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-[#4A3B2A]/5 text-center"
      >
        {status === "loading" && (
          <div className="py-10">
            <div className="w-12 h-12 border-4 border-[#4A3B2A]/20 border-t-[#4A3B2A] rounded-full animate-spin mx-auto mb-6" />
            <p className="text-[#4A3B2A] font-medium">Processing your request...</p>
          </div>
        )}

        {status === "success" && (
          <>
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6">
              <FaEnvelopeCircleCheck size={40} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#4A3B2A] mb-4">
              Unsubscribed
            </h1>
            <p className="text-[#4A3B2A]/70 mb-8 leading-relaxed">
              {message}
              <br />
              We're sorry to see you go, but we respect your choice.
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-600 mx-auto mb-6">
              <FaCircleExclamation size={40} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#4A3B2A] mb-4">
              Oops!
            </h1>
            <p className="text-[#4A3B2A]/70 mb-8 leading-relaxed">
              {message}
            </p>
          </>
        )}

        {status !== "loading" && (
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-[#4A3B2A] text-[#F3EFE9] px-6 py-3 rounded-full font-medium hover:bg-[#3d3022] transition-colors"
          >
            <FaHouse size={18} />
            Back to Home
          </Link>
        )}
      </motion.div>
    </div>
  );
};

export default Unsubscribe;
