import React from "react";
import { motion } from "framer-motion";
import { FiGift, FiStar, FiHeart } from "react-icons/fi";

const GiftSidebar = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="lg:col-span-1"
    >
      <div className="lg:sticky lg:top-8 space-y-8">
        <div>
          <span className="text-[#4A3B2A] font-semibold text-md uppercase tracking-wider">
            Gift A Journey
          </span>
          <h2 className="text-4xl font-bold text-[#4A3B2A] mt-2 leading-tight">
            Surprise Your <br />
            <span className="text-[#4A3B2A] italic">Loved Ones</span>
          </h2>
          <p className="text-[#4A3B2A]/70 mt-4 text-lg">
            Gift a journey. Create a memory that lasts a lifetime.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#4A3B2A]/10 space-y-4">
          <h3 className="font-semibold text-[#4A3B2A] flex items-center gap-2">
            <FiStar className="text-[#4A3B2A]" /> Why Gift a Journey?
          </h3>
          <p className="text-sm text-[#4A3B2A]/70">
            Experiences are the most valuable gifts. Whether it's a birthday, anniversary, or just because, a curated trail is a story waiting to be told.
          </p>
          <div className="pt-2">
            <div className="flex items-center gap-3 text-sm text-[#4A3B2A]">
              <FiGift className="text-[#4A3B2A]/60" />
              <span>Personalized Vouchers</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-[#4A3B2A] mt-2">
              <FiHeart className="text-[#4A3B2A]/60" />
              <span>Curated with Love</span>
            </div>
          </div>
        </div>

        <div className="bg-[#4A3B2A]/5 p-6 rounded-2xl border border-[#4A3B2A]/10">
          <p className="text-[#4A3B2A] italic text-sm">
            "The greatest gift you can give is a world beyond imagination."
          </p>
          <p className="text-[#4A3B2A] font-medium mt-2 text-xs">— Payana Trails Team</p>
        </div>
      </div>
    </motion.div>
  );
};

export default GiftSidebar;
