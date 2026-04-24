import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IMAGE_BASE_URL } from "../../../services/api";
import BrownBtn from "../../common/buttons/BrownBtn";

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

const InTheMedia = ({ data }) => {
  const [visibleCount, setVisibleCount] = useState(3);
  
  if (!data || !data.items?.length) return null;

  const handleViewMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  const visibleItems = data.items.slice(0, visibleCount);
  const hasMore = visibleCount < data.items.length;

  return (
    <section id="in-the-media" className="relative overflow-hidden bg-[#FAF5F1] py-16 md:py-24">
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
          className="mb-20 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#4A3B2A] mb-4">
            {data.mainTitle || "In The Media"}
          </h2>
          <p className="text-lg text-[#4A3B2A]/70 max-w-2xl mx-auto italic">
            {data.subtitle || "Journeys and reflections, captured through published articles."}
          </p>
          <div className="w-24 h-1 bg-[#4A3B2A]/20 mx-auto mt-8 rounded-full" />
        </motion.div>

        {/* Content Items */}
        <div className="space-y-24 md:space-y-32">
          <AnimatePresence mode="popLayout">
            {visibleItems.map((item, index) => {
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={index}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-10%" }}
                  variants={fadeUp}
                  layout
                  className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-10 md:gap-16 lg:gap-24`}
                >
                  {/* Image Section */}
                  <div className="w-full md:w-1/2 group relative">
                    <motion.div
                      variants={imageReveal}
                      className={`absolute inset-0 border border-[#4A3B2A]/20 rounded-2xl transition-transform duration-700 ease-out z-0 ${
                        isEven ? "translate-x-4 translate-y-4 group-hover:translate-x-6 group-hover:translate-y-6" : "-translate-x-4 translate-y-4 group-hover:-translate-x-6 group-hover:translate-y-6"
                      }`}
                    />
                    <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl aspect-video w-full z-10">
                      <img
                        src={`${IMAGE_BASE_URL}${item.image}`}
                        alt={item.publishedBy || "Media Article"}
                        className="h-full w-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#4A3B2A]/20 to-transparent opacity-60 pointer-events-none" />
                    </div>
                  </div>

                  {/* Text Section */}
                  <div className="w-full md:w-1/2 space-y-4">
                    <div className="flex flex-wrap items-center gap-3 text-sm font-semibold uppercase tracking-widest text-[#4A3B2A]/60">
                      <span className="bg-[#4A3B2A] text-white px-3 py-1 rounded text-[10px] tracking-normal">
                        {item.publishedBy || "Published"}
                      </span>
                      {item.date && (
                        <>
                          <span className="w-1 h-1 bg-[#4A3B2A]/30 rounded-full" />
                          <span>{item.date}</span>
                        </>
                      )}
                    </div>
                    
                    <h3 className="text-2xl lg:text-3xl font-bold text-[#4A3B2A] leading-tight">
                      {item.authorName ? `Article by ${item.authorName}` : "Featured Journey"}
                    </h3>
                    
                    <div className="w-12 h-0.5 bg-[#4A3B2A]/20" />
                    
                    <p className="text-base md:text-lg text-[#4A3B2A]/80 leading-relaxed italic">
                      "{item.description}"
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* View More Button */}
        {hasMore && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-24 flex justify-center"
          >
            <BrownBtn 
              text="View More Stories" 
              onClick={handleViewMore}
              className="px-10 py-3 text-xl shadow-lg hover:shadow-xl transform transition-all active:scale-95"
            />
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default InTheMedia;
