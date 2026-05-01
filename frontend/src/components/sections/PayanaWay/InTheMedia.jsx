import React, { useRef } from "react";
import { motion } from "framer-motion";
import { IMAGE_BASE_URL } from "../../../services/api";
import RichTextRenderer from "../../common/RichTextRenderer";
import LightboxImage from "../../common/LightboxImage";
import SectionHeader from "../../common/SectionHeader";

const InTheMedia = ({ data }) => {
  const scrollContainerRef = useRef(null);

  if (!data || !data.items?.length) return null;

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  return (
    <section
      id="in-the-media"
      className="relative overflow-hidden bg-[#F3EFE9] py-8 md:py-16"
    >
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
          title={data.mainTitle || "In The Media"}
          subtitle={data.subtitle || "Journeys and reflections, captured through published articles."}
        />

        <div className="relative -mt-6 md:-mt-10">
          {/* Navigation Buttons */}
          <div className="flex justify-end gap-3 mb-6">
            <button 
              onClick={scrollLeft} 
              className="p-3 rounded-full bg-transparent border border-[#4A3B2A]/20 text-[#4A3B2A] hover:bg-[#4A3B2A] hover:text-[#F3EFE9] transition-colors focus:outline-none"
              aria-label="Scroll left"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={scrollRight} 
              className="p-3 rounded-full bg-transparent border border-[#4A3B2A]/20 text-[#4A3B2A] hover:bg-[#4A3B2A] hover:text-[#F3EFE9] transition-colors focus:outline-none"
              aria-label="Scroll right"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Cards Scroll Container */}
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-6 md:gap-8 pb-8 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* Inject custom CSS for webkit hidden scrollbar */}
            <style dangerouslySetInnerHTML={{__html: `
              .hide-scrollbar::-webkit-scrollbar {
                display: none;
              }
            `}} />
            
            {data.items.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex-none w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-21.33px)] snap-start group bg-transparent rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#4A3B2A]/10 flex flex-col hide-scrollbar"
              >
                {/* Image Section */}
                <div className="w-full aspect-video overflow-hidden border-b border-[#4A3B2A]/10">
                  <LightboxImage
                    src={`${IMAGE_BASE_URL}${item.image}`}
                    alt={item.publishedBy || "Media Article"}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    rounded="rounded-none"
                  />
                </div>

                {/* Text Section */}
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-widest text-[#4A3B2A]/60 mb-3">
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

                  <h3 className="text-xl md:text-2xl font-bold text-[#4A3B2A] leading-tight mb-4">
                    {item.authorName
                      ? `Article by ${item.authorName}`
                      : "Featured Journey"}
                  </h3>

                  <div className="flex-grow">
                    <RichTextRenderer
                      text={item.description}
                      className="text-sm md:text-base text-[#4A3B2A]/80 leading-relaxed line-clamp-4"
                      paragraphClass="mb-2"
                    />
                  </div>

                  {item.url && (
                    <div className="pt-5 mt-4 border-t border-[#4A3B2A]/10">
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[#4A3B2A] font-bold text-sm hover:text-[#4A3B2A]/80 group/link transition-colors"
                      >
                        Read Full Article
                        <svg 
                          className="w-4 h-4 transition-transform group-hover/link:translate-x-1" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InTheMedia;
