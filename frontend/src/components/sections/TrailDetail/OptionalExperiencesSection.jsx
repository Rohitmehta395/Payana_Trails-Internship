import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Check } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const OptionalExperiencesSection = ({ experiences = [] }) => {
  const filled = experiences.filter((ex) => ex && ex.trim());
  if (!filled.length) return null;

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-12 md:px-10">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
        className="relative overflow-hidden rounded-[2.5rem] border border-[#4A3B2A]/10 bg-white/60 p-8 shadow-[0_20px_50px_rgba(74,59,42,0.06)] backdrop-blur-sm md:p-12"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,107,80,0.05),transparent_40%)]" />

        <div className="relative mb-10 flex flex-col items-center gap-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#4A3B2A]/10 bg-white/80 px-4 py-2 text-[13px] font-semibold uppercase tracking-[0.2em] text-[#8B6B50]">
            <Sparkles className="h-4 w-4" />
            Curated Add-ons
          </div>
          <h2 className="font-serif text-3xl font-medium text-[#4A3B2A] md:text-4xl">
            Suggested Optional Experiences
          </h2>
          <p className="max-w-2xl text-[15px] leading-relaxed text-[#8B6B50]">
            Enrich your journey with these handpicked moments. While not included in the primary package, 
            each experience is designed to deepen your connection with the heart of the trail.
          </p>
        </div>

        <div className="relative grid gap-6 md:grid-cols-2">
          {filled.map((experience, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="group flex gap-5 rounded-3xl border border-[#4A3B2A]/8 bg-white p-6 transition-all duration-500 hover:border-[#4A3B2A]/20 hover:shadow-[0_15px_35px_rgba(74,59,42,0.08)]"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#F3EFE9] text-[#8B6B50] transition-colors duration-500 group-hover:bg-[#4A3B2A] group-hover:text-white">
                <Check className="h-6 w-6" />
              </div>
              <div className="flex-1 space-y-2 pt-1">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#D4A373]">
                  Experience {idx + 1}
                </p>
                <p className="text-base leading-relaxed text-[#4A3B2A]">
                  {experience}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default OptionalExperiencesSection;
