import React, { useRef } from "react";
import { motion as Motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { IMAGE_BASE_URL } from "../../../services/api";

const VoicesSection = ({ data }) => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const { title, subtitle, image } = data || {};

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
      className="relative overflow-hidden bg-[#F3EFE9] py-16 md:py-24"
    >
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
              <div className="aspect-[16/9]">
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
            <Motion.div variants={fadeUp} className="mb-8 flex items-center gap-4">
              <div className="h-px w-12 bg-[#4A3B2A]/40" />
              <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#4A3B2A]/60">
                Testimonials
              </span>
            </Motion.div>

            <Motion.h2
              variants={fadeUp}
              className="mb-6 font-serif text-4xl font-semibold leading-tight text-[#4A3B2A] md:text-5xl lg:text-6xl"
            >
              {title || "Voices from the Trail"}
            </Motion.h2>

            <Motion.div variants={fadeUp} className="mb-8 h-0.5 w-16 bg-[#4A3B2A]/30" />

            <Motion.p
              variants={fadeUp}
              className="max-w-md text-lg font-light leading-relaxed text-[#4A3B2A]/70"
            >
              {subtitle || "Hear from those who have journeyed with us."}
            </Motion.p>

            <Motion.div variants={fadeUp} className="mt-10">
              <button
                type="button"
                onClick={() => navigate("/stories/testimonials")}
                className="group inline-flex items-center gap-4 bg-[#4A3B2A] px-7 py-3 text-xs font-medium uppercase tracking-[0.2em] text-[#F3EFE9] transition-all duration-300 hover:bg-[#3A2E20]"
              >
                <span>Read Testimonials</span>
                <span className="block h-px w-7 bg-[#F3EFE9]/70 transition-all duration-500 group-hover:w-10" />
              </button>
            </Motion.div>
          </div>
        </div>
      </Motion.div>
    </section>
  );
};

export default VoicesSection;
