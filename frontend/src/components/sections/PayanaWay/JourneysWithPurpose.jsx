import React from "react";
import { motion } from "framer-motion";
import { IMAGE_BASE_URL } from "../../../services/api";

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

// Custom side-profile airplane icon for thematic travel branding
const SideProfileAirplane = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M21.5 13C21.5 14.1 20.6 15 19.5 15H4C2.9 15 2 14.1 2 13V11C2 9.9 2.9 9 4 9H9.5L13.5 3H16L14 9H18L20 6H21.5L20.5 9.5C21.1 10.1 21.5 11 21.5 12V13Z"
      fill="#4A3B2A"
    />
  </svg>
);

// Helper function to format text in quotes to be semibold and italic
const formatDescription = (text) => {
  if (!text) return null;

  // Split the text by double or single quotes (keeping the quotes in the parts array)
  const parts = text.split(/((?:"[^"]+")|(?:'[^']+'))/g);

  return parts.map((part, index) => {
    // Check if the current part is wrapped in quotes
    if (
      (part.startsWith('"') && part.endsWith('"')) ||
      (part.startsWith("'") && part.endsWith("'"))
    ) {
      return (
        <span key={index} className="font-semibold italic text-[#4A3B2A]">
          {part}
        </span>
      );
    }
    return part;
  });
};

const JourneysWithPurpose = ({ data }) => {
  if (!data || !data.blocks?.length) return null;

  return (
    <section id="journeys-with-purpose" className="relative overflow-hidden bg-[#F3EFE9] py-10 md:py-16">
      {/* Architectural Dot Grid Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(#4A3B2A 2px, transparent 2px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="container relative mx-auto max-w-7xl px-4 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUp}
          className="mb-24 w-full relative z-10"
        >
          {/* Outer glow/shadow for depth */}
          <div className="absolute inset-0 bg-[#4A3B2A]/5 blur-2xl rounded-[3rem] transform translate-y-4" />

          <div className="relative border border-[#4A3B2A]/15 bg-[#FAF5F1] rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 lg:px-12 shadow-[0_10px_40px_rgba(74,59,42,0.05)] backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <h2 className="text-3xl font-bold uppercase tracking-[0.08em] text-[#4A3B2A] md:text-3xl lg:text-4xl">
                  {data.mainTitle || "Journeys with Purpose"}
                </h2>
              </div>

              <div className="text-sm font-bold uppercase tracking-[0.25em] text-[#4A3B2A]/60 flex items-center gap-3">
                <div className="w-12 h-[2px] bg-[#4A3B2A]/40" />
                <span>
                  {data.subtitle ||
                    "Journeys that enrich you, while leaving a positive difference behind."}
                </span>
              </div>
            </div>

            {/* Decorative concentric circles to add complexity to the header */}
            <div className="hidden md:flex relative w-16 h-16 items-center justify-center opacity-20">
              <div className="absolute inset-0 border border-[#4A3B2A] rounded-full animate-[spin_10s_linear_infinite]" />
              <div className="absolute inset-2 border border-[#4A3B2A] border-dashed rounded-full animate-[spin_15s_linear_infinite_reverse]" />
              <div className="w-2 h-2 bg-[#4A3B2A] rounded-full" />
            </div>
          </div>
        </motion.div>

        {/* Content Blocks */}
        <div className="space-y-24 md:space-y-36">
          {data.blocks.map((block, index) => {
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-15%" }}
                variants={fadeUp}
                className="relative"
              >
                {/* Thematic Animated Divider (Hidden on first block) */}
                {index > 0 && (
                  <div className="absolute -top-16 md:-top-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
                    <div className="w-px h-12 bg-gradient-to-b from-transparent to-[#4A3B2A]/20" />
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <SideProfileAirplane />
                    </motion.div>
                    <div className="w-px h-12 bg-gradient-to-t from-transparent to-[#4A3B2A]/20" />
                  </div>
                )}

                <div className="clearfix mt-8">
                  {/* Image Section (Larger 55% width, Floated with Architectural Border) */}
                  {block.image && (
                    <motion.div
                      variants={imageReveal}
                      className={`w-full sm:w-[55%] mb-10 group relative z-10 ${
                        isEven
                          ? "sm:float-left sm:mr-10 lg:mr-16"
                          : "sm:float-right sm:ml-10 lg:ml-16"
                      }`}
                    >
                      {/* Offset Wireframe Border for visual complexity */}
                      <div
                        className={`absolute inset-0 border border-[#4A3B2A]/30 rounded-[1.5rem] transition-transform duration-700 ease-out z-0 ${
                          isEven
                            ? "translate-x-4 translate-y-4 group-hover:translate-x-6 group-hover:translate-y-6"
                            : "-translate-x-4 translate-y-4 group-hover:-translate-x-6 group-hover:translate-y-6"
                        }`}
                      />

                      <div className="relative overflow-hidden rounded-[1.5rem] bg-[#FAF5F1] shadow-[0_20px_50px_rgba(74,59,42,0.15)] aspect-video w-full z-10">
                        <img
                          src={`${IMAGE_BASE_URL}${block.image}`}
                          alt={`Journey block ${index + 1}`}
                          className="h-full w-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-[#4A3B2A]/10 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-0" />
                      </div>
                    </motion.div>
                  )}

                  {/* Text Section (Wraps around image, Drop Caps removed) */}
                  <div className="relative z-0 pt-2 md:pt-4">
                    <p className="whitespace-pre-wrap text-base md:text-lg lg:text-xl font-light text-justify text-[#4A3B2A]/90 leading-[1.85]">
                      {formatDescription(block.description)}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default JourneysWithPurpose;
