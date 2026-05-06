import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion as Motion, useInView, AnimatePresence } from "framer-motion";
import { X, User } from "lucide-react";
import CommonHero from "../components/common/CommonHero";
import CursorMessage from "../components/common/CursorMessage";
import storiesImg from "../assets/Home/Stories/stories-moments.webp";
import usePageHeroImages from "../hooks/usePageHeroImages";
import useHomePageData from "../hooks/useHomePageData";
import { IMAGE_BASE_URL } from "../services/api";

const formatMonthYearForDisplay = (val) => {
  if (!val) return "";
  if (!/^\d{4}-\d{2}$/.test(val)) return val;
  const [year, month] = val.split("-");
  const d = new Date(year, month - 1);
  return d.toLocaleString("en-US", { month: "short", year: "numeric" });
};

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

        <div className="flex w-full flex-col p-10 sm:p-14 overflow-y-auto">
          {/* Top Profile Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10 border-b border-[#4A3B2A]/5 pb-10">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-xl flex-shrink-0">
              {testimonial.url ? (
                <img
                  src={`${IMAGE_BASE_URL}${testimonial.url}`}
                  alt={testimonial.alt || "Guest"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#4A3B2A]/10 flex items-center justify-center">
                  <User size={48} className="text-[#4A3B2A]/20" />
                </div>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left pt-2">
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-3">
                <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#4A3B2A]">
                  {testimonial.alt}
                </h3>
                {testimonial.monthYear && (
                  <span className="text-xs tracking-[0.2em] uppercase font-bold text-[#4A3B2A]/40">
                    {formatMonthYearForDisplay(testimonial.monthYear)}
                  </span>
                )}
              </div>

              {testimonial.destination && (
                <div className="flex items-center justify-center sm:justify-start gap-3">
                  <div className="h-px w-8 bg-[#4A3B2A]/20" />
                  <p className="text-sm tracking-widest uppercase font-semibold text-[#4A3B2A]/60">
                    {testimonial.destination}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Testimonial Story */}
          <div className="relative">
            <div className="absolute -top-6 -left-6 opacity-[0.05] pointer-events-none">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="#4A3B2A">
                <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C14.9124 8 14.017 7.10457 14.017 6V3H21.017V15C21.017 18.3137 18.3307 21 15.017 21H14.017ZM3.017 21L3.017 18C3.017 16.8954 3.91243 16 5.017 16H8.017C8.56928 16 9.017 15.5523 9.017 15V9C9.017 8.44772 8.56928 8 8.017 8H5.017C3.91243 8 3.017 7.10457 3.017 6V3H10.017V15C10.017 18.3137 7.33071 21 4.017 21H3.017Z" />
              </svg>
            </div>
            <p className="whitespace-pre-wrap font-sans text-lg sm:text-xl leading-relaxed text-[#4A3B2A]/80 italic">
              {testimonial.fullContent ||
                testimonial.shortDescription ||
                "No story content provided."}
            </p>
          </div>
        </div>
      </Motion.div>
    </Motion.div>
  );
};

const TestimonialCard = ({ testimonial, index, isFocused, onClick }) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

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
          transition: {
            duration: 0.55,
            delay: index * 0.07,
            ease: [0.25, 0.1, 0.25, 1],
          },
        },
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group cursor-pointer flex flex-col transition-all duration-300 border rounded-2xl p-6 sm:p-8 min-h-[280px] relative overflow-hidden ${
        isFocused
          ? "bg-white border-[#4A3B2A] shadow-xl"
          : "bg-[#FAF7F4] border-[#4A3B2A]/5 hover:bg-white hover:border-[#4A3B2A]/15 hover:shadow-xl"
      }`}
    >
      <CursorMessage message="Click to read more" isVisible={isHovered} />
      {/* Quotation Mark Decal */}
      <div className="absolute top-2 right-2 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="#4A3B2A">
          <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C14.9124 8 14.017 7.10457 14.017 6V3H21.017V15C21.017 18.3137 18.3307 21 15.017 21H14.017ZM3.017 21L3.017 18C3.017 16.8954 3.91243 16 5.017 16H8.017C8.56928 16 9.017 15.5523 9.017 15V9C9.017 8.44772 8.56928 8 8.017 8H5.017C3.91243 8 3.017 7.10457 3.017 6V3H10.017V15C10.017 18.3137 7.33071 21 4.017 21H3.017Z" />
        </svg>
      </div>

      <div className="flex-1">
        <p className="text-[#4A3B2A]/70 text-base sm:text-lg leading-relaxed line-clamp-5 font-serif italic mb-8">
          "
          {testimonial.shortDescription ||
            testimonial.fullContent ||
            "A journey that transformed our perspective on the wild..."}
          "
        </p>
      </div>

      <div className="flex items-center gap-4 pt-6 border-t border-[#4A3B2A]/10">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#4A3B2A]/10 group-hover:border-[#4A3B2A]/30 transition-colors shadow-sm flex-shrink-0">
          {testimonial.url ? (
            <img
              src={`${IMAGE_BASE_URL}${testimonial.url}`}
              alt={testimonial.alt || "Guest"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#4A3B2A]/10 flex items-center justify-center">
              <User size={24} className="text-[#4A3B2A]/20" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <h3 className="text-base font-serif font-bold text-[#4A3B2A] truncate">
              {testimonial.alt}
            </h3>
            {testimonial.monthYear && (
              <span className="text-[10px] text-gray-400 whitespace-nowrap mt-1">
                {formatMonthYearForDisplay(testimonial.monthYear)}
              </span>
            )}
          </div>
          {testimonial.destination && (
            <p className="text-[10px] tracking-[0.15em] uppercase font-bold text-[#4A3B2A]/40 truncate">
              {testimonial.destination}
            </p>
          )}
        </div>
      </div>
    </Motion.article>
  );
};

const Testimonials = () => {
  const { images: heroImgs } = usePageHeroImages("stories");
  const { data: homeData, loading } = useHomePageData();
   const location = useLocation();
   const navigate = useNavigate();
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
          { label: "TESTIMONIALS" },
        ]}
      />

      <section
        id="testimonials-section"
        ref={sectionRef}
        className="py-16 md:py-24 px-6 lg:px-8 max-w-7xl mx-auto font-sans"
      >
        <Motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className="text-center mb-16 flex flex-col items-center">
            <Motion.div
              variants={fadeUp}
              className="mb-6 flex items-center gap-4 justify-center"
            >
              <div className="h-px w-8 bg-[#4A3B2A]/40" />
              <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#4A3B2A]/60">
                Community
              </span>
              <div className="h-px w-8 bg-[#4A3B2A]/40" />
            </Motion.div>

            <Motion.h2
              variants={fadeUp}
              className="text-4xl lg:text-5xl font-bold font-serif text-[#4A3B2A] leading-tight mb-5"
            >
              {testimonialsData.titleBold || "Share Your"}{" "}
              <span className="italic font-light">
                {testimonialsData.titleItalic || "Experience"}
              </span>
            </Motion.h2>

            <Motion.p
              variants={fadeUp}
              className="text-[#4A3B2A] text-lg font-light leading-relaxed max-w-2xl text-center opacity-80 whitespace-pre-line mt-2"
            >
              {testimonialsData.subtitle || "What our travellers say about us"}
            </Motion.p>
          </div>

          {loading ? (
            <div className="text-center py-20 text-[#4A3B2A]/70 text-sm tracking-widest uppercase">
              Loading testimonials...
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-20 text-[#4A3B2A]/70 text-sm tracking-widest uppercase">
              No testimonials available.
            </div>
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
 
       {/* Bottom Back Button */}
       <div className="pb-24 flex justify-center">
         <button
           onClick={() => navigate(-1)}
           className="group inline-flex items-center gap-4 border border-[#4A3B2A]/30 hover:border-[#4A3B2A] px-10 py-4 text-xs tracking-[0.25em] uppercase font-medium text-[#4A3B2A] hover:bg-[#4A3B2A] hover:text-[#F3EFE9] transition-all duration-300"
         >
           <span className="w-5 h-px bg-current group-hover:w-10 transition-all duration-500" />
           <span>Back</span>
         </button>
       </div>

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
