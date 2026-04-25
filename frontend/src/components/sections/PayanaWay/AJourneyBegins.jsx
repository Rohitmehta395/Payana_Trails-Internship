import React from "react";
import { motion } from "framer-motion";
import { IMAGE_BASE_URL } from "../../../services/api";
import RichTextRenderer from "../../common/RichTextRenderer";
import LightboxImage from "../../common/LightboxImage";
import SectionHeader from "../../common/SectionHeader";

const AJourneyBegins = ({ data }) => {
  if (!data) return null;

  // Animation variants for smooth, staggered reveals
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  const ease = [0.16, 1, 0.3, 1];

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease },
    },
  };

  const imageReveal = {
    hidden: { opacity: 0, scale: 0.95 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1.2, ease },
    },
  };

  return (
    <section
      id="ajourneybegins"
      className="relative py-20 md:py-12 bg-[#F3EFE9] overflow-hidden"
    >
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(circle_at_center,#4A3B2A_1px,transparent_1px)] bg-size-[24px_24px]"></div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Header Section */}
        <SectionHeader
          title={data.mainTitle || "A Journey Begins"}
          subtitle={data.subtitle || "Journeys and reflections, captured through published articles."}
        />

        {/* Top Section: Left Image & Right Description (Quote) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-8 md:mb-12">
          {/* Left: Landscape Image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full lg:col-span-7 relative group"
          >
            {data.adminImage && (
              <div className="relative w-full pr-4 pb-4 md:pr-6 md:pb-6">
                {/* Decorative Offset Border for Landscape */}
                <div className="absolute top-4 left-4 right-0 bottom-0 border border-[#4A3B2A]/30 rounded-2xl md:rounded-[3rem] transition-transform duration-700 ease-out group-hover:translate-x-2 group-hover:translate-y-2 z-0"></div>

                <LightboxImage
                  src={`${IMAGE_BASE_URL}${data.adminImage}`}
                  alt={data.name || "Admin"}
                  className="aspect-video"
                  containerClassName="z-10"
                />
              </div>
            )}
          </motion.div>

          {/* Right: First Description / Quote */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="w-full lg:col-span-5 relative flex flex-col justify-center"
          >
            {/* Giant decorative quote mark */}
            <span className="absolute -top-16 -left-6 md:-top-24 md:-left-10 text-[8rem] md:text-[12rem] text-[#4A3B2A]/5 font-serif leading-none select-none pointer-events-none">
              "
            </span>

            {data.description && (
              <motion.div
                variants={itemVariants}
                className="relative z-10"
              >
                <RichTextRenderer
                  text={data.description}
                  className="text-xl md:text-xl lg:text-2xl font-light text-[#4A3B2A] leading-snug md:leading-relaxed mb-4"
                  paragraphClass="mb-2"
                />
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Bottom Section: Full Width Paragraph & Signature */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="w-full"
        >
          {data.paragraph && (
            <motion.div
              variants={itemVariants}
              className="text-md md:text-lg lg:text-xl font-normal text-[#4A3B2A] leading-relaxed md:leading-loose opacity-100 mb-8 bg-[#FAF5F1] p-8 rounded-2xl md:rounded-[3rem] border-4 border-[#c48a68]/30"
            >
              <RichTextRenderer
                text={data.paragraph}
                className=""
                paragraphClass="mb-2"
              />
            </motion.div>
          )}

          {/* Signature & Details */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col md:flex-row md:items-end justify-between gap-8"
          >
            <div>
              {data.name && (
                <h3 className="text-2xl md:text-3xl font-bold text-[#4A3B2A] tracking-wide mb-2">
                  {data.name}
                </h3>
              )}
              {data.occupation && (
                <p className="text-md md:text-lg tracking-widest uppercase text-[#4A3B2A]/70">
                  {data.occupation}
                </p>
              )}
            </div>

            {data.signatureImage && (
              <div className="shrink-0">
                <img
                  src={`${IMAGE_BASE_URL}${data.signatureImage}`}
                  alt={`${data.name} signature`}
                  className="h-16 md:h-24 object-contain opacity-90 mix-blend-multiply"
                />
              </div>
            )}
          </motion.div>
        </motion.div>
        {/* Elegant Divider */}
        <motion.div
          variants={itemVariants}
          className="w-full h-px bg-[#4A3B2A]/20 mt-8"
        />
      </div>
    </section>
  );
};

export default AJourneyBegins;
