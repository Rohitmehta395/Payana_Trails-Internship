import React, { useRef } from "react";
import { motion as Motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { IMAGE_BASE_URL } from "../../../services/api";
import useHomePageData from "../../../hooks/useHomePageData";

const TestimonialCard = ({ testimonial, index }) => {
  const navigate = useNavigate();

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
      className="group cursor-pointer flex flex-col bg-[#FAF7F4] hover:bg-white transition-all duration-300 border border-[#4A3B2A]/10 hover:border-[#4A3B2A]/25 hover:shadow-lg"
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
            <span className="text-[#4A3B2A]/30 text-xs tracking-widest uppercase">
              No Image
            </span>
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

const VoicesSection = ({ data }) => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const { data: homeData } = useHomePageData();

  const { title, subtitle, image } = data || {};

  const testimonials = (homeData?.testimonials?.images || [])
    .filter((img) => img.isActive !== false)
    .sort((a, b) => a.order - b.order)
    .slice(0, 3);

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
            <div className="mb-8 flex items-center gap-4">
              <div className="h-px w-10 bg-[#4A3B2A]/40" />
              <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#4A3B2A]/60">
                Latest Testimonials
              </span>
            </div>

            <Motion.div
              variants={containerVariants}
              className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3"
            >
              {testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={testimonial._id}
                  testimonial={testimonial}
                  index={index}
                />
              ))}
            </Motion.div>
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

