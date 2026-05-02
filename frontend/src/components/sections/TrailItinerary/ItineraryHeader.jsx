import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Compass, Trees } from "lucide-react";

const ItineraryHeader = ({ transformed, itineraryDaysLength }) => {
  return (
    <section className="relative isolate overflow-hidden bg-[#1F160E]">
      <motion.div
        initial={{ scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.6, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <img
          src={transformed.heroImageUrl || "/heroBg-desktop.webp"}
          alt={transformed.trailName}
          className="h-full w-full object-cover"
          loading="eager"
        />
      </motion.div>

      {/* lighter hero overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(31,22,14,0.14)_0%,rgba(31,22,14,0.24)_38%,rgba(31,22,14,0.46)_72%,rgba(31,22,14,0.62)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(253,251,247,0.16),transparent_34%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(139,107,80,0.10),transparent_28%)]" />

      <motion.div
        animate={{ y: [0, -14, 0], rotate: [0, 4, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute left-[7%] top-[16%] text-white/10"
      >
        <Compass className="h-28 w-28 md:h-40 md:w-40" strokeWidth={1} />
      </motion.div>

      <motion.div
        animate={{ y: [0, 18, 0], rotate: [0, -6, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute bottom-[12%] right-[6%] text-white/10"
      >
        <Trees className="h-36 w-36 md:h-52 md:w-52" strokeWidth={1} />
      </motion.div>

      <div className="relative mx-auto flex min-h-[75vh] sm:min-h-[85vh] w-full max-w-[82rem] items-end px-6 pb-12 pt-24 md:px-10 md:pb-16 lg:px-12 lg:pb-20 lg:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="w-full max-w-4xl"
        >
          <Link
            to={`/trails/${transformed.slug}`}
            className="mb-6 md:mb-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 md:px-5 md:py-2.5 text-xs md:text-sm font-medium tracking-wide text-[#E5D7C5] backdrop-blur-md transition-all duration-300 hover:bg-white/15 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5 md:h-4 md:w-4" />
            Back to trail
          </Link>

          <p className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.28em] text-[#E5D7C5]/90">
            Payana Trails • Detailed itinerary
          </p>

          <h1 className="mt-4 md:mt-5 font-serif text-[clamp(2.1rem,8vw,4.5rem)] leading-[1.02] text-[#FDFBF7] drop-shadow-[0_8px_24px_rgba(0,0,0,0.22)] md:text-6xl lg:text-[4.5rem]">
            {transformed.trailName}
          </h1>

          <p className="mt-5 md:mt-6 max-w-2xl text-base leading-relaxed text-[#F3EFE9] md:text-lg">
            Follow the trail one day at a time, with each chapter revealing the
            pace, highlights, and practical details that shape the journey.
          </p>

          <div className="mt-6 md:mt-7 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2.5 md:px-5 md:py-3 text-xs md:text-sm font-medium text-[#FDFBF7] backdrop-blur-md">
            <Compass className="h-4 w-4 text-[#E5D7C5]" />
            {itineraryDaysLength} curated day
            {itineraryDaysLength > 1 ? "s" : ""}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ItineraryHeader;
