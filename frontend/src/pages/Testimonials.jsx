import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion as Motion, useInView, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import CommonHero from "../components/common/CommonHero";
import storiesImg from "../assets/Home/Stories/stories-moments.webp";
import usePageHeroImages from "../hooks/usePageHeroImages";
import useHomePageData from "../hooks/useHomePageData";
import { IMAGE_BASE_URL } from "../services/api";

const TestimonialModal = ({ testimonial, onClose }) => {
  if (!testimonial) return null;

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 sm:p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <Motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-[#FAF7F4] shadow-2xl flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/50 text-[#4A3B2A] backdrop-blur-md transition-colors hover:bg-white md:bg-[#4A3B2A]/10 md:hover:bg-[#4A3B2A]/20"
        >
          <X size={18} />
        </button>

        <div className="h-64 w-full md:h-auto md:w-5/12 relative">
          {testimonial.url ? (
            <img
              src={`${IMAGE_BASE_URL}${testimonial.url}`}
              alt={testimonial.alt || "Testimonial"}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#4A3B2A]/10">
              <span className="text-xs uppercase tracking-widest text-[#4A3B2A]/30">
                No Image
              </span>
            </div>
          )}
        </div>

        <div className="flex w-full flex-col justify-center p-8 md:w-7/12 lg:p-12 overflow-y-auto max-h-[60vh] md:max-h-[90vh]">
          {testimonial.alt && (
            <h3 className="mb-4 font-serif text-2xl font-bold leading-snug text-[#4A3B2A] lg:text-3xl">
              {testimonial.alt}
            </h3>
          )}
          <div className="mb-6 h-0.5 w-12 bg-[#4A3B2A]/20" />
          <p className="whitespace-pre-wrap font-sans text-base leading-relaxed text-[#4A3B2A]/80 italic lg:text-lg">
            "{testimonial.fullContent || testimonial.shortDescription || "No story content provided."}"
          </p>
        </div>
      </Motion.div>
    </Motion.div>
  );
};

const TestimonialCard = ({ testimonial, index, isFocused, onClick }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    if (isFocused && cardRef.current) {
      setTimeout(() => {
        cardRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 500);
      onClick(); // auto open if focused
    }
  }, [isFocused]);

  return (
    <Motion.article
      ref={cardRef}
      variants={{
        hidden: { opacity: 0, y: 32 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.55, delay: index * 0.07, ease: [0.25, 0.1, 0.25, 1] },
        },
      }}
      onClick={onClick}
      className={`group cursor-pointer flex flex-col bg-[#FAF7F4] hover:bg-white transition-all duration-300 border ${
        isFocused
          ? "border-[#4A3B2A] shadow-xl"
          : "border-[#4A3B2A]/10 hover:border-[#4A3B2A]/25 hover:shadow-lg"
      }`}
    >
      <div className="relative overflow-hidden" style={{ paddingTop: "62%" }}>
        {testimonial.url ? (
          <img
            src={`${IMAGE_BASE_URL}${testimonial.url}`}
            alt={testimonial.alt || "Testimonial"}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-[#4A3B2A]/10 flex items-center justify-center">
            <span className="text-[#4A3B2A]/30 text-xs tracking-widest uppercase">No Image</span>
          </div>
        )}
        <span className="absolute top-4 left-4 px-3 py-1 text-[10px] tracking-[0.2em] uppercase font-medium bg-[#4A3B2A] text-[#F3EFE9]">
          Testimonial
        </span>
      </div>

      <div className="p-6 flex flex-col flex-1">
        {testimonial.alt && (
          <h3 className="text-lg font-serif font-semibold text-[#4A3B2A] leading-snug mb-3 group-hover:text-[#3A2E20] transition-colors line-clamp-2">
            {testimonial.alt}
          </h3>
        )}
        <p className="text-sm text-[#4A3B2A]/60 leading-relaxed line-clamp-2 flex-1 italic">
          "{testimonial.fullContent || testimonial.shortDescription || "No story content provided."}"
        </p>
        <div className="mt-4 flex items-center gap-2 text-[11px] tracking-widest uppercase text-[#4A3B2A] font-medium">
          <span>Read More</span>
          <span className="w-6 h-px bg-[#4A3B2A] group-hover:w-12 transition-all duration-400" />
        </div>
      </div>
    </Motion.article>
  );
};

const Testimonials = () => {
  const { images: heroImgs } = usePageHeroImages("stories");
  const { data: homeData, loading } = useHomePageData();
  const location = useLocation();
  const focusTestimonial = location.state?.testimonial;
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);

  const testimonialsData = homeData?.testimonials || {};
  const images = (testimonialsData.images || [])
    .filter((img) => img.isActive !== false)
    .sort((a, b) => a.order - b.order);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.08 },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  return (
    <div className="bg-[#F3EFE9] min-h-screen">
      <CommonHero
        title="VOICES FROM THE TRAIL"
        subtitle="TESTIMONIALS"
        images={heroImgs}
        bgImage={storiesImg}
        breadcrumbs={[
          { label: "HOME", path: "/" },
          { label: "STORIES", path: "/stories" },
          { label: "TESTIMONIALS" }
        ]}
      />

      <section id="testimonials-section" ref={sectionRef} className="py-16 md:py-24 px-6 lg:px-8 max-w-7xl mx-auto font-sans">
        <Motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className="text-center mb-16 flex flex-col items-center">
            <Motion.div variants={fadeUp} className="mb-6 flex items-center gap-4 justify-center">
              <div className="h-px w-8 bg-[#4A3B2A]/40" />
              <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#4A3B2A]/60">
                Community
              </span>
              <div className="h-px w-8 bg-[#4A3B2A]/40" />
            </Motion.div>

            <Motion.h2 variants={fadeUp} className="text-4xl lg:text-5xl font-bold font-serif text-[#4A3B2A] leading-tight mb-5">
              {testimonialsData.titleBold || "Share Your"} <span className="italic font-light">{testimonialsData.titleItalic || "Experience"}</span>
            </Motion.h2>
            
            <Motion.p variants={fadeUp} className="text-[#4A3B2A] text-lg font-light leading-relaxed max-w-2xl text-center opacity-80 whitespace-pre-line mt-2">
              {testimonialsData.subtitle || "What our travellers say about us"}
            </Motion.p>
          </div>

          {loading ? (
            <div className="text-center py-20 text-[#4A3B2A]/70 text-sm tracking-widest uppercase">Loading testimonials...</div>
          ) : images.length === 0 ? (
            <div className="text-center py-20 text-[#4A3B2A]/70 text-sm tracking-widest uppercase">No testimonials available.</div>
          ) : (
            <Motion.div
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
            >
              {images.map((testimonial, index) => (
                <TestimonialCard 
                  key={testimonial._id} 
                  testimonial={testimonial} 
                  index={index}
                  isFocused={focusTestimonial?._id === testimonial._id}
                  onClick={() => setSelectedTestimonial(testimonial)}
                />
              ))}
            </Motion.div>
          )}
        </Motion.div>
      </section>

      <AnimatePresence>
        {selectedTestimonial && (
          <TestimonialModal 
            testimonial={selectedTestimonial} 
            onClose={() => setSelectedTestimonial(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Testimonials;
