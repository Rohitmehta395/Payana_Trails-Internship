import React, { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { IMAGE_BASE_URL } from "../../../services/api";

const CATEGORIES = [
  "Heritage Trails",
  "Wildlife Encounters",
  "Cultural Windows",
  "Journey Insights",
  "Photo Essays",
  "Travel Anecdotes",
];

const TravelStories = ({ data }) => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const mainTitle = data?.travelStories?.mainTitle || "Travel Stories";
  const subtitle =
    data?.travelStories?.subtitle ||
    "Reflections, insights, and moments from journeys across the world";
  const image1 = data?.travelStories?.image1 || null;
  const image2 = data?.travelStories?.image2 || null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 36 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.85, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  const imageReveal = {
    hidden: { opacity: 0, scale: 0.96, y: 24 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 1.1, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.18 },
    }),
  };

  return (
    <section
      id="travel-stories"
      ref={sectionRef}
      className="relative py-8 md:py-12 bg-[#F3EFE9] overflow-hidden"
    >
      {/* Decorative noise texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, #4A3B2A 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-start"
        >
          {/* LEFT: Text Column */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center pt-4 lg:pt-12">
            {/* Section label */}
            <motion.div variants={fadeUp} className="flex items-center gap-4 mb-8">
              <div className="h-px w-12 bg-[#4A3B2A]/40" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#4A3B2A]/60 font-medium">
                Stories & Reflections
              </span>
            </motion.div>

            {/* Main title */}
            <motion.h2
              variants={fadeUp}
              className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-[#4A3B2A] leading-tight mb-6"
            >
              {mainTitle}
            </motion.h2>

            {/* Accent line */}
            <motion.div
              variants={fadeUp}
              className="w-16 h-0.5 bg-[#4A3B2A]/30 mb-8"
            />

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              className="text-[#4A3B2A]/70 text-lg leading-relaxed font-light mb-10 max-w-md"
            >
              {subtitle}
            </motion.p>

            {/* Category pills */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mb-12">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() =>
                    navigate("/stories/blogs", { state: { category: cat } })
                  }
                  className="px-4 py-1.5 text-xs tracking-wider uppercase border border-[#4A3B2A]/25 text-[#4A3B2A]/70 rounded-full hover:bg-[#4A3B2A] hover:text-[#F3EFE9] hover:border-[#4A3B2A] transition-all duration-300 font-medium"
                >
                  {cat}
                </button>
              ))}
            </motion.div>

            {/* CTA button */}
            <motion.div variants={fadeUp}>
              <button
                onClick={() => navigate("/stories/blogs")}
                className="group inline-flex items-center gap-4 bg-[#4A3B2A] text-[#F3EFE9] px-8 py-4 text-sm tracking-[0.2em] uppercase font-medium hover:bg-[#3A2E20] transition-all duration-300 relative overflow-hidden"
              >
                <span className="relative z-10">Explore Stories</span>
                <span className="relative z-10 w-8 h-px bg-[#F3EFE9]/60 group-hover:w-14 transition-all duration-500 block" />
              </button>
            </motion.div>
          </div>

          {/* RIGHT: Two Vertical Images */}
          <div className="lg:col-span-6 xl:col-span-7">
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {/* Image 1 — taller */}
              <motion.div
                custom={0}
                variants={imageReveal}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="group relative overflow-hidden rounded-sm"
                style={{ paddingTop: "150%" }}
              >
                {image1 ? (
                  <>
                    <img
                      src={`${IMAGE_BASE_URL}${image1}`}
                      alt="Travel Story"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#4A3B2A]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </>
                ) : (
                  <div className="absolute inset-0 bg-[#4A3B2A]/10 flex items-center justify-center">
                    <span className="text-[#4A3B2A]/30 text-xs tracking-widest uppercase">
                      Image 1
                    </span>
                  </div>
                )}
              </motion.div>

              {/* Image 2 — offset lower */}
              <motion.div
                custom={1}
                variants={imageReveal}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="group relative overflow-hidden rounded-sm mt-12"
                style={{ paddingTop: "150%" }}
              >
                {image2 ? (
                  <>
                    <img
                      src={`${IMAGE_BASE_URL}${image2}`}
                      alt="Travel Story"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#4A3B2A]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </>
                ) : (
                  <div className="absolute inset-0 bg-[#4A3B2A]/8 flex items-center justify-center">
                    <span className="text-[#4A3B2A]/30 text-xs tracking-widest uppercase">
                      Image 2
                    </span>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TravelStories;
