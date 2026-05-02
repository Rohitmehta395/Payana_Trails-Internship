import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

// A simple particle component to generate floating particles around the gallery
export const Particles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate particles purely on the client side to prevent hydration mismatches if applicable
    const generateParticles = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      scale: Math.random() * 0.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
      duration: Math.random() * 8 + 6,
      width: Math.random() * 8 + 4,
    }));
    setParticles(generateParticles);
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-3xl">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-[#8C7662]/40"
          initial={{
            left: p.left,
            top: p.top,
            scale: p.scale,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -80, 0],
            x: [0, 40, -20, 0],
            opacity: [p.opacity, p.opacity + 0.3, p.opacity],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            width: p.width,
            height: p.width,
            filter: "blur(1px)",
          }}
        />
      ))}
    </div>
  );
};

const MovingGallery = ({ images = [], trailName = "Trail", isWrapped = false }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const interval = setInterval(() => {
      setStartIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3500); // 3.5 sec interval for smoother consumption
    return () => clearInterval(interval);
  }, [images]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIndex === null) return;
      if (e.key === "ArrowRight") {
        setSelectedIndex((prev) => (prev + 1) % images.length);
      }
      if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
      }
      if (e.key === "Escape") {
        setSelectedIndex(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, images.length]);

  if (!images || images.length === 0) {
    return <p className="text-[#7A6351]">No trail images available yet.</p>;
  }

  const getGridImages = () => {
    const gridImages = [];
    for (let i = 0; i < 4; i++) {
      const originalIndex = (startIndex + i) % images.length;
      gridImages.push({
        id: `${originalIndex}-${images[originalIndex]}`, // ensure unique key per actual image in that slot
        src: images[originalIndex],
        originalIndex,
        idx: i,
      });
    }
    return gridImages;
  };

  const currentImages = getGridImages();

  const gridLayoutStyles = [
    "md:col-span-2 md:row-span-2", // 1st Image: Large Left
    "md:col-span-1 md:row-span-1", // 2nd Image: Top Right 1
    "md:col-span-1 md:row-span-1", // 3rd Image: Top Right 2
    "md:col-span-2 md:row-span-1", // 4th Image: Bottom Right Wide
  ];

  const handleNext = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className={isWrapped ? "relative w-full" : "relative mx-auto w-full max-w-7xl px-4 py-8 md:px-10 md:py-12"}>
      <div className={`relative overflow-hidden ${
        isWrapped
          ? ""
          : "rounded-[2.5rem] border border-[#4A3B2A]/12 bg-[linear-gradient(145deg,#fffdf8_0%,#f9f3e9_50%,#f2e9d8_100%)] p-6 md:p-10 lg:p-12 shadow-[0_20px_50px_rgba(74,59,42,0.1)]"
      }`}>
        {/* Dynamic Background Particles */}
        {!isWrapped && <Particles />}

        {/* Header Section */}
        <div className={`relative z-10 ${isWrapped ? "mb-6 pt-8 md:pt-10 px-6 md:px-10" : "mb-8 md:mb-10"}`}>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#4A3B2A]/10 bg-white/70 px-4 py-2 text-[13px] md:text-[15px] font-semibold uppercase tracking-[0.28em] text-[#6B513C] backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            Glimpses of the Trail
          </div>

          <h2 className="mt-4 md:mt-5 font-serif text-[clamp(1.7rem,4vw,2.4rem)] leading-[1.1] tracking-tight text-[#2F2319]">
            Moments along the trail that stay with you.
          </h2>
        </div>

        {/* Grid Layout Container */}
        <div className={`relative z-10 grid grid-cols-1 gap-4 md:h-[600px] md:grid-cols-4 md:grid-rows-2 ${isWrapped ? "px-6 pb-12 md:px-10 md:pb-16" : ""}`}>
          {currentImages.map((img, index) => (
            <motion.div
              key={index} // Using pure index so layout wrapper stays constant, only content animates
              className={`group relative h-64 overflow-hidden rounded-2xl bg-[#E8E1D9] border border-[#4A3B2A]/10 shadow-[0_4px_20px_rgba(74,59,42,0.06)] md:h-auto ${gridLayoutStyles[index]} cursor-pointer`}
              whileHover={{ y: -4, scale: 0.995 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              onClick={() => setSelectedIndex(img.originalIndex)}
            >
              <AnimatePresence>
                <motion.img
                  key={img.id}
                  src={img.src}
                  alt={`${trailName} gallery ${index + 1}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>

              {/* Hover Glassmorphism Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-[#2B2117]/0 opacity-0 transition-all duration-500 group-hover:bg-[#2B2117]/30 group-hover:opacity-100">
                <div className="translate-y-8 transform rounded-full border border-white/20 bg-white/20 p-4 text-white shadow-xl backdrop-blur-md transition-all duration-500 group-hover:translate-y-0">
                  <Maximize2 size={28} strokeWidth={1.5} />
                </div>
              </div>

              {/* Subtle Gradient Overlay at bottom for depth */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1A1612]/95 p-4 md:p-10 backdrop-blur-xl"
          >
            <div className="absolute right-6 top-6 z-50">
              <button
                onClick={() => setSelectedIndex(null)}
                className="rounded-full bg-white/10 p-3 text-white/80 transition-all hover:bg-white/20 hover:text-white"
                aria-label="Close modal"
              >
                <X size={28} />
              </button>
            </div>

            {/* Background click to close */}
            <div
              className="absolute inset-0"
              onClick={() => setSelectedIndex(null)}
            />

            <motion.div
              key={selectedIndex} // Triggers animation on index change
              initial={{ scale: 0.95, opacity: 0, x: 20 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              exit={{ scale: 0.95, opacity: 0, x: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative mx-auto flex items-center justify-center max-h-full max-w-7xl w-full"
            >
              {/* Prev Button */}
              {images.length > 1 && (
                <button
                  onClick={handlePrev}
                  className="absolute left-2 md:-left-12 z-50 rounded-full bg-white/10 p-3 text-white/80 transition-all hover:bg-white/20 hover:text-white backdrop-blur-md"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={32} />
                </button>
              )}

              <img
                src={images[selectedIndex]}
                alt={`${trailName} full view ${selectedIndex + 1}`}
                className="max-h-[85vh] w-auto max-w-full rounded-2xl border border-white/10 object-contain shadow-[0_20px_60px_rgba(0,0,0,0.5)] z-40"
              />

              {/* Next Button */}
              {images.length > 1 && (
                <button
                  onClick={handleNext}
                  className="absolute right-2 md:-right-12 z-50 rounded-full bg-white/10 p-3 text-white/80 transition-all hover:bg-white/20 hover:text-white backdrop-blur-md"
                  aria-label="Next image"
                >
                  <ChevronRight size={32} />
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MovingGallery;
