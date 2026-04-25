import React from "react";
import { motion } from "framer-motion";

/**
 * SectionHeader — a premium, animated section header used across
 * all Payana Way sections.
 *
 * Props:
 *   title    {string}  — main section title
 *   subtitle {string}  — sub-line beneath the title
 *   align    {string}  — "left" (default) | "center"
 */
const SectionHeader = ({ title, subtitle, align = "left" }) => {
  const isCenter = align === "center";

  /* ── animation variants ─────────────────────────────────── */
  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
  };

  const tagVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
  };

  const lineVariants = {
    hidden: { scaleX: 0 },
    show: { scaleX: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <motion.div
      className={`relative w-full ${isCenter ? "text-center" : "text-left"} mb-16 md:mb-20`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={containerVariants}
    >
      {/* ── decorative vertical accent line (left only) ───── */}
      {!isCenter && (
        <motion.div
          variants={lineVariants}
          style={{ originX: 0 }}
          className="h-[3px] w-20 bg-gradient-to-r from-[#4A3B2A] to-[#4A3B2A]/20 rounded-full mb-5"
        />
      )}



      {/* ── main title ───────────────────────────────────── */}
      <motion.h2
        variants={titleVariants}
        className="text-3xl md:text-4xl lg:text-5xl font-black uppercase leading-[1.1] tracking-tight text-[#4A3B2A]"
      >
        {title}
      </motion.h2>

      {/* ── separator line ───────────────────────────────── */}
      {subtitle && (
        <motion.div
          variants={lineVariants}
          style={{ originX: isCenter ? 0.5 : 0 }}
          className={`h-px bg-gradient-to-r from-[#4A3B2A]/30 via-[#4A3B2A]/10 to-transparent mt-5 mb-4 ${
            isCenter ? "mx-auto w-28" : "w-full max-w-xs"
          }`}
        />
      )}

      {/* ── subtitle ─────────────────────────────────────── */}
      {subtitle && (
        <motion.p
          variants={subtitleVariants}
          className={`text-sm md:text-[15px] font-medium uppercase tracking-[0.22em] text-[#4A3B2A]/60 leading-relaxed ${
            isCenter ? "mx-auto max-w-lg" : "max-w-xl"
          }`}
        >
          {subtitle}
        </motion.p>
      )}

      {/* ── bottom glow blob ─────────────────────────────── */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -bottom-6 ${
          isCenter ? "left-1/2 -translate-x-1/2" : "left-0"
        } w-48 h-12 bg-[#4A3B2A]/6 blur-2xl rounded-full`}
      />
    </motion.div>
  );
};

export default SectionHeader;
