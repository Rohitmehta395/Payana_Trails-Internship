import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, FileText, Sparkles } from "lucide-react";

const TrailActionButtons = ({ trailSlug, trailState, hasItinerary = false }) => {
  const navigate = useNavigate();
  const [isHoveringEnquire, setIsHoveringEnquire] = useState(false);

  const handleEnquireClick = () => {
    // Slight delay before navigation for effect
    setTimeout(() => {
      navigate("/connect#enquiry-section");
    }, 400);
  };

  const handleItineraryClick = () => {
    if (!trailSlug || !hasItinerary) return;

    navigate(`/trails/${trailSlug}/itinerary`, {
      state: trailState ? { trail: trailState } : undefined,
    });
  };

  return (
    <section className="relative mx-auto mt-12 mb-8 flex max-w-7xl flex-wrap justify-center gap-6 px-6 md:px-10">
      {/* View Itinerary Button */}
      <motion.button
        whileHover={hasItinerary ? { scale: 1.02 } : undefined}
        whileTap={hasItinerary ? { scale: 0.98 } : undefined}
        onClick={handleItineraryClick}
        disabled={!hasItinerary}
        className={`group relative flex items-center justify-center gap-2 overflow-hidden rounded-full border px-8 py-4 font-sans text-base font-semibold transition-all duration-300 ${
          hasItinerary
            ? "border-[#4A3B2A]/20 bg-[#F3EFE9] text-[#4A3B2A] hover:border-[#4A3B2A]/40 hover:bg-white hover:shadow-lg"
            : "cursor-not-allowed border-[#4A3B2A]/10 bg-[#E9E0D4] text-[#4A3B2A]/45"
        }`}
      >
        <span className="relative z-10 flex items-center gap-2">
          <FileText
            className={`h-5 w-5 transition-transform duration-300 ${
              hasItinerary ? "group-hover:-translate-y-0.5" : ""
            }`}
          />
          {hasItinerary ? "View Itinerary" : "Itinerary Coming Soon"}
        </span>
        {/* Subtle hover background effect */}
        {hasItinerary && (
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-[#4A3B2A]/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        )}
      </motion.button>

      {/* Enquire Now Button */}
      <motion.div
        className="relative"
        onMouseEnter={() => setIsHoveringEnquire(true)}
        onMouseLeave={() => setIsHoveringEnquire(false)}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleEnquireClick}
          className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-full bg-[#4A3B2A] px-10 py-4 font-sans text-base font-semibold text-[#F3EFE9] shadow-[0_4px_20px_rgba(74,59,42,0.3)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(74,59,42,0.4)]"
        >
          {/* Shine effect overlay */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
          
          <span className="relative z-10 flex items-center gap-2">
            Enquire Now
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            <motion.div
              animate={{ 
                rotate: isHoveringEnquire ? [0, 15, -15, 0] : 0,
                scale: isHoveringEnquire ? [1, 1.2, 1] : 1
              }}
              transition={{ duration: 0.5, repeat: isHoveringEnquire ? Infinity : 0, repeatDelay: 1 }}
            >
              <Sparkles className="h-4 w-4 text-[#D4A373]" />
            </motion.div>
          </span>
        </motion.button>
      </motion.div>
    </section>
  );
};

export default TrailActionButtons;
