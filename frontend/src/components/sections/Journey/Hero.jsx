import React from "react";
import { motion } from "framer-motion";
import { Compass, Map, Minus } from "lucide-react";
import BrownBtn from "../../common/buttons/BrownBtn";

export default function Hero() {
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

  return (
    <div className="relative w-full h-screen min-h-[750px] bg-[#F3EFE9] flex items-center overflow-hidden font-sans">
      {/* Background Image */}
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute right-0 top-0 w-full md:w-[75%] lg:w-[65%] h-full z-0"
      >
        <img
          src="https://images.unsplash.com/photo-1523805009345-7448845a9e53?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Sunset Safari Landscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#F3EFE9] via-[#F3EFE9]/40 to-transparent md:w-1/2" />
      </motion.div>

      {/* Main Content Wrapper */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex items-center px-4 sm:px-8 md:px-12 lg:px-16">
        {/* Hero Card */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative bg-[#F3EFE9] rounded-[2rem] p-8 md:p-12 w-full max-w-[420px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden"
        >
          {/* Top Right Decorative Elements */}
          <div className="absolute top-8 right-8 flex flex-col items-end text-[#4A3B2A] opacity-60">
            <Compass strokeWidth={1} size={28} />
            <div className="flex items-center mt-2 -mr-3 gap-1">
              <Minus strokeWidth={1} className="w-4 h-4" />
              <Minus strokeWidth={1} className="w-4 h-4" />
            </div>
          </div>

          {/* Bottom Right Decorative Elements */}
          <div className="absolute bottom-8 right-8 text-[#4A3B2A] opacity-60">
            <Map strokeWidth={1} size={32} />
            <div className="absolute -bottom-16 -left-20 w-32 h-32 border-[0.5px] border-[#4A3B2A]/20 rounded-full" />
          </div>

          {/* Text Content */}
          <div className="relative z-20">
            <motion.h1
              variants={itemVariants}
              className="text-[1.5rem] md:text-2xl font-semibold leading-[1.1] font-serif text-[#4A3B2A] mb-6"
            >
              JOURNEYS THAT STAY,
              <br />
              LONG AFTER YOU RETURN
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-[#4A3B2A] text-[18px] leading-relaxed mb-10 pr-4 font-light relative"
            >
              Trails designed for those who value depth over distance – shaped
              by stories, places and experiences that stay with you.
              <span className="inline-flex items-center mx-1 align-middle opacity-80">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B89474] mix-blend-multiply relative z-10" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#4A3B2A] -ml-1.5 mix-blend-multiply" />
              </span>
            </motion.p>

            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block"
            >
              <BrownBtn
                text="EXPLORE YOUR JOURNEY"
                className="!px-7 !py-3.5 !rounded !text-[13px] !tracking-[0.15em] !font-medium"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
