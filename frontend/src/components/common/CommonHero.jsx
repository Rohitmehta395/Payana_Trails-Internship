import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiChevronDown } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const CommonHero = ({ title, description, images = [], bgImage, breadcrumbs }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  // Normalize images: convert bgImage string into the array format if needed
  const heroImages =
    images.length > 0
      ? images
      : bgImage
      ? [{ desktop: bgImage, mobile: bgImage }]
      : [];

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const fadeUpItem = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const renderBackButton = () => (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 text-[#F3EFE9] text-xs md:text-sm tracking-widest uppercase opacity-90 hover:opacity-100 transition-all duration-300 bg-[#4A3B2A]/60 hover:bg-[#4A3B2A]/90 px-5 py-2.5 rounded-full border border-[#F3EFE9]/30 backdrop-blur-md shadow-lg group"
    >
      <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
      <span>Go Back</span>
    </button>
  );

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="relative w-full h-[60vh] md:h-[100vh] flex flex-col justify-center items-center text-center overflow-hidden bg-[#110C08]"
    >
      {/* Background Image Slider (Cross-fade) */}
      <div className="absolute inset-0 z-0">
        {heroImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-[1500ms] ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Mobile Background */}
            <div
              className="absolute inset-0 bg-cover bg-center sm:hidden"
              style={{ backgroundImage: `url(${img.mobile || img.desktop || img})` }}
            />
            {/* Desktop Background */}
            <div
              className="absolute inset-0 bg-cover bg-center hidden sm:block"
              style={{ backgroundImage: `url(${img.desktop || img})` }}
            />
          </div>
        ))}
        
        {/* Background Gradient Overlays for Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#4A3B2A]/40 via-transparent to-[#4A3B2A]/60 z-10" />
        <div className="absolute inset-0 bg-black/20 z-10" />
      </div>

      {/* Top Left Controls: Back Button (Desktop Only) */}
      <motion.div
        variants={fadeUpItem}
        className="hidden md:block absolute top-24 left-6 md:top-32 md:left-12 z-10"
      >
        {renderBackButton()}
      </motion.div>

      {/* Main text content */}
      <div className="relative z-10 flex flex-col items-center px-4 max-w-5xl mx-auto mt-12 md:mt-16 text-[#F3EFE9]">
        {title && (
          <motion.h1
            variants={fadeUpItem}
            className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold leading-tight mb-4 md:mb-6 uppercase tracking-wider drop-shadow-xl"
          >
            {title}
          </motion.h1>
        )}

        {description && (
          <motion.p
            variants={fadeUpItem}
            className="text-sm md:text-base lg:text-lg font-medium leading-relaxed max-w-3xl drop-shadow-lg text-[#F3EFE9]"
          >
            {description}
          </motion.p>
        )}

        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <motion.nav
            variants={fadeUpItem}
            className="mt-8 flex items-center space-x-2 bg-[#4A3B2A]/80 backdrop-blur-md border border-[#F3EFE9]/30 rounded-full px-6 py-2.5 text-[#F3EFE9] text-sm md:text-base font-semibold shadow-xl hover:bg-[#4A3B2A]/95 transition-all duration-300"
          >
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {crumb.path ? (
                  <Link
                    to={crumb.path}
                    className="hover:text-white hover:underline underline-offset-4 decoration-[#F3EFE9]/50 transition-all duration-300 drop-shadow-sm"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="opacity-100 tracking-wide drop-shadow-sm">
                    {crumb.label}
                  </span>
                )}
                {index < breadcrumbs.length - 1 && (
                  <span className="opacity-70 text-xs font-bold tracking-tighter mx-1 drop-shadow-sm">
                    &gt;&gt;
                  </span>
                )}
              </React.Fragment>
            ))}
          </motion.nav>
        )}

        {/* Go Back Button (Mobile Only) */}
        <motion.div
          variants={fadeUpItem}
          className="md:hidden mt-8 flex justify-center w-full"
        >
          {renderBackButton()}
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        variants={fadeUpItem}
        className="hidden md:block absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
      >
        <button
          onClick={() => {
            window.scrollTo({
              top: window.innerHeight,
              behavior: "smooth",
            });
          }}
          className="group flex flex-col items-center gap-2"
        >
          <div className="flex items-center gap-3 bg-[#4A3B2A]/30 hover:bg-[#4A3B2A]/50 backdrop-blur-md border border-[#F3EFE9]/20 px-6 py-3 rounded-full transition-all duration-500 shadow-2xl cursor-pointer">
            <span className="text-[#F3EFE9] text-[10px] md:text-xs tracking-[0.3em] uppercase font-medium opacity-80 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Scroll to Explore
            </span>
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-[#F3EFE9] cursor-pointer"
            >
              <FiChevronDown className="w-4 h-4 md:w-5 md:h-5" />
            </motion.div>
          </div>
        </button>
      </motion.div>
    </motion.section>
  );
};

export default CommonHero;
