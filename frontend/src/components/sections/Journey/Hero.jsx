import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Compass, Map } from "lucide-react";
import BrownBtn from "../../common/buttons/BrownBtn";
import { api } from "../../../services/api";

// Updated default images to match your new object structure { desktop, mobile }
const defaultImages = [
  {
    desktop:
      "https://images.unsplash.com/photo-1523805009345-7448845a9e53?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    mobile:
      "https://images.unsplash.com/photo-1523805009345-7448845a9e53?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    desktop:
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    mobile:
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
];

// Default content (fallbacks)
const DEFAULT_CONTENT = {
  miniTitle: "Explore Our World",
  mainTitle: "JOURNEYS THAT STAY,\nLONG AFTER YOU RETURN",
  subtitle:
    "Trails designed for those who value depth over distance – shaped by stories, places and experiences that stay with you.",
};

export default function Hero({ images = defaultImages }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [content, setContent] = useState(DEFAULT_CONTENT);

  // Fetch dynamic content
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await api.getJourneyPage();
        if (data?.hero) {
          setContent({
            miniTitle: data.hero.miniTitle || DEFAULT_CONTENT.miniTitle,
            mainTitle: data.hero.mainTitle || DEFAULT_CONTENT.mainTitle,
            subtitle: data.hero.subtitle || DEFAULT_CONTENT.subtitle,
          });
        }
      } catch (err) {
        console.error("Failed to load Hero section content:", err);
      }
    };
    fetchContent();
  }, []);

  // Auto-slide effect
  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4500); // 4.5 seconds per image
    return () => clearInterval(timer);
  }, [images.length]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  // Render main title with line breaks preserved
  const renderMainTitle = (title) => {
    const upper = title.toUpperCase();
    const lines = upper.split("\n");
    return lines.map((line, idx) => (
      <React.Fragment key={idx}>
        {idx > 0 && <br className="hidden sm:block" />}
        {line}
      </React.Fragment>
    ));
  };

  // Render subtitle with line breaks preserved
  const renderSubtitle = (text) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => (
      <React.Fragment key={idx}>
        {idx > 0 && <br />}
        {line}
      </React.Fragment>
    ));
  };

  return (
    <div className="relative w-full h-[100dvh] flex flex-col justify-end sm:justify-center overflow-hidden font-sans bg-[#110C08] pb-24 sm:pb-0">
      {/* Background Image Slider */}
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 w-full h-full z-0"
      >
        {images.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-[2000ms] ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat sm:hidden"
              style={{ backgroundImage: `url(${img.mobile})` }}
            />
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat hidden sm:block"
              style={{ backgroundImage: `url(${img.desktop})` }}
            />
          </div>
        ))}

        {/* Immersive Dark Overlays - Improved for readability */}
        <div className="absolute inset-0 bg-black/5 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/5 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/5 to-transparent hidden md:block z-10" />
      </motion.div>

      {/* Floating Decorative Elements - Hidden on mobile for cleaner look */}
      <motion.div
        animate={{
          y: [0, -15, 0],
          rotate: [0, 5, 0],
          opacity: [0.08, 0.15, 0.08],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute left-[8%] top-[18%] z-10 text-white hidden md:block"
      >
        <Compass className="h-32 w-32 md:h-48 md:w-48" strokeWidth={0.5} />
      </motion.div>

      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -8, 0],
          opacity: [0.08, 0.15, 0.08],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute bottom-[15%] right-[10%] z-10 text-white hidden md:block"
      >
        <Map className="h-36 w-36 md:h-52 md:w-52" strokeWidth={0.5} />
      </motion.div>

      {/* Main Content Wrapper */}
      <div className="relative z-30 w-full max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 sm:pt-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl mx-auto sm:mx-0 text-center sm:text-left"
        >
          {/* Top Label */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center sm:justify-start gap-4 mb-4 sm:mb-6"
          >
            <div className="w-10 h-[1px] bg-[#B89474]" />
            <p className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.35em] text-[#E5D7C5]">
              {content.miniTitle}
            </p>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            variants={itemVariants}
            className="text-[1.75rem] sm:text-[2.75rem] md:text-[3.5rem] lg:text-[3.75rem] font-semibold leading-[1.2] sm:leading-[1.1] font-serif text-[#FDFBF7] mb-6 drop-shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
          >
            {renderMainTitle(content.mainTitle)}
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-[#F3EFE9] text-sm sm:text-lg lg:text-xl leading-relaxed mb-10 max-w-xl mx-auto sm:mx-0 font-light drop-shadow-[0_4px_10px_rgba(0,0,0,0.15)]"
          >
            {renderSubtitle(content.subtitle)}
          </motion.p>

          {/* Button CTA */}
          <div className="flex justify-center sm:justify-start">
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block w-full sm:w-auto"
            >
              <BrownBtn
                text="EXPLORE YOUR JOURNEY"
                onClick={() => {
                  const section = document.getElementById("our-trails");
                  if (section) {
                    section.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="!px-9 !py-4.5 !rounded-full !text-[11px] sm:!text-[12px] !tracking-[0.2em] !font-bold transition-all duration-300 shadow-2xl hover:shadow-[#D4A373]/20 bg-[#694924] hover:bg-[#7d502a] text-white w-full sm:w-auto"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
