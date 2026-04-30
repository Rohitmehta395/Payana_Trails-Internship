import React, { useRef } from "react";
import { motion as Motion, useInView } from "framer-motion";
import { useNewsletter } from "../../../context/NewsletterContext";

const StoriesNewsletter = ({ data }) => {
  const { openNewsletterModal } = useNewsletter();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const { title, subtitle } = data || {};

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
      className="relative overflow-hidden bg-[#F3EFE9] py-8 md:py-12"
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
        className="container relative z-10 mx-auto max-w-4xl px-6 text-center"
      >
        <Motion.div
          variants={fadeUp}
          className="mb-6 flex items-center justify-center gap-4"
        >
          <div className="h-px w-8 bg-[#4A3B2A]/40" />
          <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#4A3B2A]/60">
            Stay Connected
          </span>
          <div className="h-px w-8 bg-[#4A3B2A]/40" />
        </Motion.div>

        <Motion.h2
          variants={fadeUp}
          className="mb-6 font-serif text-4xl font-semibold leading-tight text-[#4A3B2A] md:text-5xl"
        >
          {title || "The Payana Journal"}
        </Motion.h2>

        <Motion.div
          variants={fadeUp}
          className="mx-auto mb-8 h-0.5 w-16 bg-[#4A3B2A]/30"
        />

        <Motion.p
          variants={fadeUp}
          className="mx-auto mb-10 max-w-2xl text-lg font-light leading-relaxed text-[#4A3B2A]/70"
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
      </Motion.div>
    </section>
  );
};

export default StoriesNewsletter;
