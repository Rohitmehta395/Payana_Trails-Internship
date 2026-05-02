import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Wildlife_Icon from "../../../assets/Journey/Trails_Icons/Wildlife.webp";
import Heritage_Icon from "../../../assets/Journey/Trails_Icons/Heritage.webp";
import Cultural_Icon from "../../../assets/Journey/Trails_Icons/Culture.webp";
import CursorMessage from "../../common/CursorMessage";
import { api, IMAGE_BASE_URL } from "../../../services/api";

// Static path/route data keyed by index — never changes
const TRAIL_PATHS = [
  "/journeys/wildlife",
  "/journeys/heritage",
  "/journeys/cultural",
];

// Fallback icon images keyed by index
const FALLBACK_ICONS = [Wildlife_Icon, Heritage_Icon, Cultural_Icon];

const DEFAULT_CONTENT = {
  containerTitle: "Trail Collections",
  mainTitle: "Our Trails",
  subtitle:
    "Choose your path. Whether you seek the thrill of the wild, the echoes of history, or the heartbeat of local communities, we have a journey for you.",
  trails: [
    { title: "Wildlife Trails", iconImage: "" },
    { title: "Heritage Trails", iconImage: "" },
    { title: "Cultural & Immersive Trails", iconImage: "" },
  ],
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.18,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" },
  },
};

export default function OurTrails() {
  const [hoveredId, setHoveredId] = useState(null);
  const [content, setContent] = useState(DEFAULT_CONTENT);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await api.getJourneyPage();
        if (data?.ourTrails) {
          setContent({
            containerTitle:
              data.ourTrails.containerTitle || DEFAULT_CONTENT.containerTitle,
            mainTitle: data.ourTrails.mainTitle || DEFAULT_CONTENT.mainTitle,
            subtitle: data.ourTrails.subtitle || DEFAULT_CONTENT.subtitle,
            trails:
              data.ourTrails.trails && data.ourTrails.trails.length > 0
                ? data.ourTrails.trails
                : DEFAULT_CONTENT.trails,
          });
        }
      } catch (err) {
        console.error("Failed to load Our Trails section content:", err);
      }
    };
    fetchContent();
  }, []);

  return (
    <section
      id="our-trails"
      className="relative overflow-hidden bg-[#F3EFE9] py-20 md:py-28 scroll-mt-20 md:scroll-mt-28"
    >
      <div className="absolute inset-x-0 inset-y-6 md:inset-y-10 mx-auto w-[96%] max-w-[84rem] rounded-[48px] bg-[linear-gradient(135deg,rgba(238,228,213,0.85)_0%,rgba(247,242,234,0.4)_55%,rgba(223,207,187,0.55)_100%)]"></div>
      <div className="absolute top-10 left-[8%] h-48 w-48 rounded-full bg-[#D7C3AA]/30 blur-3xl"></div>
      <div className="absolute right-[6%] bottom-24 h-56 w-56 rounded-full bg-[#4A3B2A]/8 blur-3xl"></div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center rounded-full border border-[#4A3B2A]/15 bg-white/70 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#4A3B2A]/70 shadow-sm">
            {content.containerTitle}
          </div>

          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-5 text-4xl font-bold font-serif text-[#4A3B2A] md:text-5xl lg:text-6xl"
          >
            {content.mainTitle}
          </motion.h2>

          <div className="mx-auto mb-6 h-[2px] w-16 bg-[#4A3B2A]"></div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-2xl text-lg leading-relaxed text-[#4A3B2A]/78 md:text-xl"
          >
            {content.subtitle.split("\n").map((line, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <br />}
                {line}
              </React.Fragment>
            ))}
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3"
        >
          {content.trails.map((trail, index) => {
            // Use admin-uploaded image if available, otherwise fall back to hardcoded
            const iconSrc = trail.iconImage
              ? `${IMAGE_BASE_URL}${trail.iconImage}`
              : FALLBACK_ICONS[index] || FALLBACK_ICONS[0];

            return (
              <motion.div key={index} variants={cardVariants}>
                <Link
                  onMouseEnter={() => setHoveredId(index)}
                  onMouseLeave={() => setHoveredId(null)}
                  to={TRAIL_PATHS[index]}
                  className="group relative flex aspect-square flex-col items-center overflow-hidden rounded-[32px] border border-[#4A3B2A]/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(246,239,230,0.92)_100%)] p-8 text-center shadow-[0_20px_50px_rgba(74,59,42,0.08)] transition-all duration-300 hover:-translate-y-2 hover:border-[#4A3B2A]/22 hover:shadow-[0_28px_60px_rgba(74,59,42,0.14)]"
                >
                  <CursorMessage
                    message="Click to know more"
                    isVisible={hoveredId === index}
                  />
                  <div className="absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(74,59,42,0.25),transparent)]"></div>

                  <div className="mb-auto flex w-full flex-col items-center">
                    <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-[22px] bg-[linear-gradient(145deg,#fff8ef_0%,#eadcc9_52%,#d9c1a1_100%)] shadow-[inset_0_2px_12px_rgba(255,255,255,0.75),0_12px_24px_rgba(74,59,42,0.08)] transition-transform duration-300 group-hover:scale-105 md:h-35 md:w-35">
                      <div className="flex h-25 w-25 items-center justify-center rounded-2xl bg-white/50 md:h-30 md:w-30">
                        <img
                          src={iconSrc}
                          alt={trail.title}
                          className="h-16 w-16 object-contain md:h-24 md:w-24 rounded-xl"
                        />
                      </div>
                    </div>

                    <h3 className="max-w-[14rem] text-xl font-bold leading-tight text-[#4A3B2A] md:text-2xl">
                      {trail.title}
                    </h3>
                  </div>

                  <div className="mt-8">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#4A3B2A]/12 bg-white/75 px-4 py-1.5 text-md font-semibold text-[#4A3B2A] shadow-sm transition-all duration-300 group-hover:border-[#4A3B2A]/22 group-hover:bg-[#4A3B2A] group-hover:text-[#F3EFE9]">
                      Explore Trails
                      <svg
                        className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
