import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft } from "react-icons/fi";
import { LuCalendarDays, LuClock3, LuMapPin } from "react-icons/lu";

// Animation Variants for staggered revealing
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const HeroSection = ({ trail, backUrl = "/journeys" }) => {
  // Set to null instead of a string so the filter below catches it
  const formattedDate = trail.journeyDate
    ? new Date(trail.journeyDate).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : null;

  // Route is removed; filter safely removes Date if it is null
  const heroMeta = [
    {
      icon: LuMapPin,
      value: trail.trailDestination,
    },
    {
      icon: LuCalendarDays,
      value: formattedDate,
    },
    {
      icon: LuClock3,
      value: trail.duration,
    },
  ].filter((item) => item.value);

  return (
    <section className="relative isolate overflow-hidden bg-[#1F160E]">
      {/* Background Image with Slow Zoom-Out Animation */}
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <img
          src={trail.heroImageUrl}
          alt={trail.trailName}
          className="h-full w-full object-cover"
          loading="eager"
        />
      </motion.div>

      {/* Cinematic Gradient Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(34,24,16,0.2)_0%,rgba(34,24,16,0.6)_90%,rgba(34,24,16,0.95)_100%)]" />

      {/* Content Container */}
      <div className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col justify-end px-6 pb-16 pt-32 text-[#F3EFE9] md:px-12 md:pb-20 lg:px-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-5xl"
        >
          {/* Back Button */}
          <motion.div variants={itemVariants} className="mb-8">
            <Link
              to={backUrl}
              onClick={() => window.scrollTo(0, 0)}
              className="group inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium tracking-wide backdrop-blur-md transition-all duration-300 hover:bg-white/15 hover:pr-6"
            >
              <FiArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              <span>Back to Trails</span>
            </Link>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl font-serif leading-[1.1] tracking-tight drop-shadow-lg md:text-7xl lg:text-[5rem]"
          >
            {trail.trailName}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-3xl text-lg font-light leading-relaxed text-[#F3EFE9]/80 md:text-2xl"
          >
            {trail.trailSubTitle}
          </motion.p>

          {/* Decorative Divider */}
          <motion.div
            variants={itemVariants}
            className="my-8 h-[1px] w-24 bg-[linear-gradient(90deg,rgba(243,239,233,0.4)_0%,rgba(243,239,233,0)_100%)]"
          />

          {/* Meta Information Tags (Pill Style) */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
            {heroMeta.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                  whileHover={{
                    y: -2,
                    backgroundColor: "rgba(255,255,255,0.15)",
                  }}
                  className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-[#F3EFE9] shadow-lg backdrop-blur-md transition-colors duration-300 md:text-base"
                >
                  <Icon className="h-5 w-5 text-[#F3EFE9]/70" />
                  <span className="tracking-wide">{item.value}</span>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
