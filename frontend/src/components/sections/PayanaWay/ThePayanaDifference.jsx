import React from "react";
import { motion } from "framer-motion";
import { IMAGE_BASE_URL } from "../../../services/api";
import RichTextRenderer from "../../common/RichTextRenderer";

const ease = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      delay,
      ease,
    },
  }),
};

const ThePayanaDifference = ({ data }) => {
  if (!data || !data.entries?.length) return null;

  return (
    <section id="the-payana-difference" className="relative overflow-hidden bg-[#F3EFE9] py-8 md:py-4">
      {/* Soft Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#FAF5F1] blur-3xl opacity-70" />
        <div className="absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-[#FAF5F1] blur-3xl opacity-70" />
      </div>

      <div className="container relative z-10 mx-auto max-w-7xl px-6">
        {/* Header Section (Enhanced Pill Design) */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUp}
          className="mb-16 md:mb-20 w-full relative z-10"
        >
          {/* Outer glow/shadow for depth */}
          <div className="absolute inset-0 bg-[#4A3B2A]/5 blur-2xl rounded-[3rem] transform translate-y-4" />

          <div className="relative border border-[#4A3B2A]/15 bg-[#FAF5F1] rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 lg:px-12 shadow-[0_10px_40px_rgba(74,59,42,0.05)] backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <h2 className="text-3xl md:text-3xl lg:text-4xl font-bold uppercase tracking-[0.08em] text-[#4A3B2A]">
                  {data.mainTitle || "The Payana Difference"}
                </h2>
              </div>
              <div className="text-sm font-bold uppercase tracking-[0.25em] text-[#4A3B2A]/60 flex items-center gap-3">
                <div className="w-12 h-[2px] bg-[#4A3B2A]/40" />
                <span>{data.subtitle || "Our Philosophy"}</span>
              </div>
            </div>

            {/* Decorative concentric circles */}
            <div className="hidden md:flex relative w-16 h-16 items-center justify-center opacity-20">
              <div className="absolute inset-0 border border-[#4A3B2A] rounded-full animate-[spin_10s_linear_infinite]" />
              <div className="absolute inset-2 border border-[#4A3B2A] border-dashed rounded-full animate-[spin_15s_linear_infinite_reverse]" />
              <div className="w-2 h-2 bg-[#4A3B2A] rounded-full" />
            </div>
          </div>
        </motion.div>

        {/* Main Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8 md:py-12">
          {/* Landscape Image */}
          {data.mainImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.9, ease }}
              className="relative h-[300px] overflow-hidden rounded-[2rem] bg-[#FAF5F1] shadow-2xl md:h-[420px] lg:col-span-7 lg:h-[540px] lg:rounded-[3rem]"
            >
              <motion.img
                src={`${IMAGE_BASE_URL}${data.mainImage}`}
                alt="The Payana Difference"
                className="h-full w-full object-cover"
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 1.1, ease }}
              />

              <div className="pointer-events-none absolute inset-0 bg-[#4A3B2A]/10 mix-blend-multiply" />
            </motion.div>
          )}

          {/* Scrollable Entries */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className={`h-[300px] overflow-hidden rounded-[2rem] border border-[#4A3B2A]/10 bg-[#FAF5F1]/80 shadow-sm backdrop-blur-sm md:h-[420px] lg:h-[540px] lg:rounded-[3rem] ${
              data.mainImage ? "lg:col-span-5" : "lg:col-span-8 lg:col-start-3"
            }`}
          >
            <div className="custom-scrollbar h-full overflow-y-auto pr-2">
              <div className="space-y-4 p-5 md:p-7">
                {data.entries.map((entry, index) => (
                  <motion.article
                    key={index}
                    variants={fadeUp}
                    custom={index * 0.06}
                    className="group relative overflow-hidden rounded-[1.5rem] border border-[#4A3B2A]/10 bg-[#F3EFE9] p-5 transition-all duration-500 hover:border-[#4A3B2A]/30 hover:bg-[#FAF5F1] md:p-6"
                  >
                    <div className="absolute -right-6 -top-8 text-[90px] font-black leading-none text-[#4A3B2A]/5 transition-transform duration-700 group-hover:scale-110">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="relative z-10">
                      <div className="mb-5 flex items-center gap-4">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#4A3B2A]/15 bg-[#FAF5F1] text-sm font-bold text-[#4A3B2A] transition-all duration-500 group-hover:bg-[#4A3B2A] group-hover:text-[#FAF5F1]">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <span className="h-px flex-1 bg-[#4A3B2A]/15 transition-colors duration-500 group-hover:bg-[#4A3B2A]/35" />
                      </div>

                      <h3 className="text-xl font-bold leading-tight tracking-wide text-[#4A3B2A] md:text-2xl">
                        {entry.title}
                      </h3>

                      {entry.subtitle && (
                        <p className="mt-3 text-base italic leading-relaxed text-[#4A3B2A]/70 md:text-lg">
                          {entry.subtitle}
                        </p>
                      )}

                      {entry.description && (
                        <RichTextRenderer
                          text={entry.description}
                          className="mt-4 text-sm font-light leading-relaxed text-[#4A3B2A]/85 md:text-base"
                          paragraphClass="mb-2"
                        />
                      )}
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ThePayanaDifference;
