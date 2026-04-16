import React from "react";
import { motion } from "framer-motion";
import { FiGift, FiShare2, FiHeart } from "react-icons/fi";

const ReferralSidebar = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="lg:col-span-1"
    >
      <div className="lg:sticky lg:top-8 space-y-8">
        <div>
          <span className="text-[#4A3B2A] font-semibold text-md uppercase tracking-wider">
            Refer Your Friends
          </span>
          <h2 className="text-4xl font-bold text-[#4A3B2A] mt-2 leading-tight">
            Share the Joy of <br />
            <span className="text-[#4A3B2A] italic">Meaningful Travel</span>
          </h2>
          <p className="text-[#4A3B2A]/70 mt-4 text-lg">
            When your friend journeys with us, you receive a Payana Travel Credit for your next experience.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#4A3B2A]/10 space-y-4">
          <h3 className="font-semibold text-[#4A3B2A] flex items-center gap-2">
            <FiGift className="text-[#4A3B2A]" /> Token of Gratitude
          </h3>
          <p className="text-sm text-[#4A3B2A]/70">
            As a guest, you will receive a travel credit once your friend completes their journey. Details will be shared with you via email after submission.
          </p>
          <div className="pt-2">
            <div className="flex items-center gap-3 text-sm text-[#4A3B2A]">
              <FiShare2 className="text-[#4A3B2A]/60" />
              <span>Share the experience</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-[#4A3B2A] mt-2">
              <FiHeart className="text-[#4A3B2A]/60" />
              <span>Spread the love</span>
            </div>
          </div>
        </div>

        <div className="bg-[#4A3B2A]/5 p-6 rounded-2xl border border-[#4A3B2A]/10">
          <p className="text-[#4A3B2A] italic text-sm">
            "A journey is best measured in friends, rather than miles."
          </p>
          <p className="text-[#4A3B2A] font-medium mt-2 text-xs">— Tim Cahill</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ReferralSidebar;
