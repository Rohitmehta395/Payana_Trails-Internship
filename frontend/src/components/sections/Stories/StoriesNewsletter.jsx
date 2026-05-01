import React, { useRef } from "react";
import { motion as Motion, useInView } from "framer-motion";
import { useNewsletter } from "../../../context/NewsletterContext";
import { IMAGE_BASE_URL } from "../../../services/api";

const StoriesNewsletter = ({ data }) => {
  const { openNewsletterModal } = useNewsletter();
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
      id="newsletter"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#F3EFE9] py-16 md:py-24"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
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
          <div className="lg:col-span-5">
            <Motion.div
              variants={fadeUp}
              className="mb-6 flex items-center gap-4"
            >
              <div className="h-px w-8 bg-[#4A3B2A]/40" />
              <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#4A3B2A]/60">
                Stay Connected
              </span>
            </Motion.div>

            <Motion.h2
              variants={fadeUp}
              className="mb-6 font-serif text-4xl font-semibold leading-tight text-[#4A3B2A] md:text-5xl"
            >
              {title || "The Payana Journal"}
            </Motion.h2>

            <Motion.div
              variants={fadeUp}
              className="mb-8 h-0.5 w-16 bg-[#4A3B2A]/30"
            />

            <Motion.p
              variants={fadeUp}
              className="mb-10 text-lg font-light leading-relaxed text-[#4A3B2A]/70"
            >
              {subtitle ||
                "Subscribe to receive our latest stories, journey updates, and exclusive reflections directly in your inbox."}
            </Motion.p>

            <Motion.div variants={fadeUp}>
              <button
                type="button"
                onClick={openNewsletterModal}
                className="group inline-flex items-center gap-4 bg-[#4A3B2A] px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-[#F3EFE9] transition-all duration-300 hover:bg-[#3A2E20]"
              >
                <span>Subscribe Now</span>
                <span className="block h-px w-7 bg-[#F3EFE9]/70 transition-all duration-500 group-hover:w-12" />
              </button>
            </Motion.div>
          </div>

          <div className="lg:col-span-7">
            <Motion.div
              variants={fadeUp}
              className="group relative overflow-hidden bg-[#4A3B2A]/10"
            >
              <div className="aspect-[16/7]">
                {image ? (
                  <>
                    <img
                      src={`${IMAGE_BASE_URL}${image}`}
                      alt={title || "The Payana Journal"}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#4A3B2A]/25 via-transparent to-transparent opacity-80" />
                  </>
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-xs uppercase tracking-[0.3em] text-[#4A3B2A]/35">
                      Journal Image
                    </span>
                  </div>
                )}
              </div>
            </Motion.div>
          </div>
        </div>
      </Motion.div>
    </section>
  );
};

export default StoriesNewsletter;
