import React from "react";
import { motion } from "framer-motion";
import { IMAGE_BASE_URL } from "../../../services/api";
import RichTextRenderer from "../../common/RichTextRenderer";
import LightboxImage from "../../common/LightboxImage";
import SectionHeader from "../../common/SectionHeader";

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
        <SectionHeader
          title={data.mainTitle || "Journeys with Purpose"}
          subtitle={data.subtitle || "Journeys that enrich you, while leaving a positive difference behind."}
        />

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

                      <LightboxImage
                        src={`${IMAGE_BASE_URL}${block.image}`}
                        alt={`Journey block ${index + 1}`}
                        className="aspect-video"
                        containerClassName="z-10"
                        rounded="rounded-[1.5rem]"
                      />
                    </motion.div>
                  )}

                  {/* Text Section */}
                  <div className="relative z-0 pt-2 md:pt-4">
                    <RichTextRenderer
                      text={block.description}
                      className="text-base md:text-lg lg:text-xl font-light text-justify text-[#4A3B2A]/90 leading-[1.85]"
                      paragraphClass="mb-3"
                    />
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
