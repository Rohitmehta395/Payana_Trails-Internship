import React, { useRef, useState } from "react";
import { motion as Motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { IMAGE_BASE_URL } from "../../../services/api";
import { User } from "lucide-react";
import useHomePageData from "../../../hooks/useHomePageData";
import CursorMessage from "../../common/CursorMessage";

const formatMonthYearForDisplay = (val) => {
  if (!val) return "";
  if (!/^\d{4}-\d{2}$/.test(val)) return val;
  const [year, month] = val.split("-");
  const d = new Date(year, month - 1);
  return d.toLocaleString("en-US", { month: "short", year: "numeric" });
};

const TestimonialCard = ({ testimonial, index }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Motion.article
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
      onClick={() =>
        navigate("/stories/testimonials", { state: { testimonial } })
      }
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group cursor-pointer flex flex-col bg-[#FAF7F4] hover:bg-white transition-all duration-300 border border-[#4A3B2A]/5 hover:border-[#4A3B2A]/15 hover:shadow-xl rounded-2xl p-5 sm:p-6 h-[250px] sm:h-[260px] relative overflow-hidden"
    >
      <CursorMessage message="Click to read more" isVisible={isHovered} />
      {/* Quotation Mark Decal */}
      <div className="absolute top-2 right-2 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="#4A3B2A">
          <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C14.9124 8 14.017 7.10457 14.017 6V3H21.017V15C21.017 18.3137 18.3307 21 15.017 21H14.017ZM3.017 21L3.017 18C3.017 16.8954 3.91243 16 5.017 16H8.017C8.56928 16 9.017 15.5523 9.017 15V9C9.017 8.44772 8.56928 8 8.017 8H5.017C3.91243 8 3.017 7.10457 3.017 6V3H10.017V15C10.017 18.3137 7.33071 21 4.017 21H3.017Z" />
        </svg>
      </div>

      <div className="flex-1 pb-4">
        <p className="text-[#4A3B2A]/70 text-sm sm:text-base leading-relaxed line-clamp-3 font-serif italic">
          "
          {testimonial.shortDescription ||
            testimonial.fullContent ||
            "A journey that transformed our perspective on the wild..."}
          "
        </p>
      </div>

      <div className="flex items-center gap-4 mt-auto pt-5 border-t border-[#4A3B2A]/10">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#4A3B2A]/10 group-hover:border-[#4A3B2A]/30 transition-colors shadow-sm flex-shrink-0 flex items-center justify-center bg-[#4A3B2A]/5">
          {testimonial.url ? (
            <img
              src={`${IMAGE_BASE_URL}${testimonial.url}`}
              alt={testimonial.alt || "Guest"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center bg-[#4A3B2A]/10 w-full h-full" title="This guest preferred not to share an image">
              <User size={24} className="text-[#4A3B2A]/20" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <h3 className="text-sm sm:text-base font-serif font-bold text-[#4A3B2A] truncate">
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

const VoicesSection = ({ data }) => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const { data: homeData } = useHomePageData();

  const testimonialScrollRef = useRef(null);

  const scroll = (direction) => {
    if (testimonialScrollRef.current) {
      const container = testimonialScrollRef.current;
      const scrollAmount =
        container.offsetWidth /
        (window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1);
      container.scrollBy({
        left: direction === "next" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const { title, subtitle, image } = data || {};

  const testimonials = (homeData?.testimonials?.images || [])
    .filter((img) => img.isActive !== false)
    .sort((a, b) => a.order - b.order);

  const fadeUp = {
    hidden: { opacity: 0, y: 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.08 },
    },
  };

  return (
    <section
      id="voices-from-the-trail"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#F3EFE9] py-10 md:py-16"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, #4A3B2A 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <Motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="container relative z-10 mx-auto max-w-7xl px-6"
      >
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <Motion.div
              variants={fadeUp}
              className="group relative overflow-hidden bg-[#4A3B2A]/10"
            >
              <div className="aspect-[16/7]">
                {image ? (
                  <>
                    <img
                      src={`${IMAGE_BASE_URL}${image}`}
                      alt={title || "Voices from the Trail"}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#4A3B2A]/25 via-transparent to-transparent opacity-80" />
                  </>
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-xs uppercase tracking-[0.3em] text-[#4A3B2A]/35">
                      Landscape Image
                    </span>
                  </div>
                )}
              </div>
            </Motion.div>
          </div>

          <div className="lg:col-span-5 order-1 lg:order-2">
            <Motion.div
              variants={fadeUp}
              className="mb-8 flex items-center gap-4"
            >
              <div className="h-px w-12 bg-[#4A3B2A]/40" />
              <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#4A3B2A]/60">
                Testimonials
              </span>
            </Motion.div>

            <Motion.h2
              variants={fadeUp}
              className="mb-6 font-serif text-3xl font-semibold leading-tight text-[#4A3B2A] md:text-4xl lg:text-5xl"
            >
              {title || "Voices from the Trail"}
            </Motion.h2>

            <Motion.div
              variants={fadeUp}
              className="mb-8 h-0.5 w-16 bg-[#4A3B2A]/30"
            />

            <Motion.p
              variants={fadeUp}
              className="max-w-md text-lg font-light leading-relaxed text-[#4A3B2A]/70"
            >
              {subtitle || "Hear from those who have journeyed with us."}
            </Motion.p>
          </div>
        </div>

        {testimonials.length > 0 && (
          <Motion.div variants={fadeUp} className="mt-14 md:mt-20">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-px w-10 bg-[#4A3B2A]/40" />
                <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#4A3B2A]/60">
                  Latest Testimonials
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => scroll("prev")}
                  className="flex h-10 w-10 items-center justify-center border border-[#4A3B2A]/20 bg-[#FAF7F4] text-[#4A3B2A] transition-all hover:bg-[#4A3B2A] hover:text-[#F3EFE9]"
                  aria-label="Previous testimonial"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => scroll("next")}
                  className="flex h-10 w-10 items-center justify-center border border-[#4A3B2A]/20 bg-[#FAF7F4] text-[#4A3B2A] transition-all hover:bg-[#4A3B2A] hover:text-[#F3EFE9]"
                  aria-label="Next testimonial"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            <div
              ref={testimonialScrollRef}
              className="flex gap-7 overflow-x-auto overflow-y-hidden pb-4 hide-scrollbar snap-x snap-mandatory"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial._id}
                  className="min-w-full md:min-w-[calc(50%-14px)] lg:min-w-[calc(33.333%-18.66px)] snap-start"
                >
                  <TestimonialCard testimonial={testimonial} index={index} />
                </div>
              ))}
            </div>
          </Motion.div>
        )}

        <Motion.div variants={fadeUp} className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={() =>
              navigate("/stories/testimonials#testimonials-section")
            }
            className="group inline-flex items-center gap-4 bg-[#4A3B2A] px-7 py-3 text-xs font-medium uppercase tracking-[0.2em] text-[#F3EFE9] transition-all duration-300 hover:bg-[#3A2E20]"
          >
            <span>Read Testimonials</span>
            <span className="block h-px w-7 bg-[#F3EFE9]/70 transition-all duration-500 group-hover:w-10" />
          </button>
        </Motion.div>
      </Motion.div>
    </section>
  );
};

export default VoicesSection;
