import React from "react";
import { motion } from "framer-motion";
import { IMAGE_BASE_URL } from "../../../services/api";

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
        {/* Full Width Top Header */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-8 md:mb-10"
        >
          <motion.div
            variants={fadeUp}
            className="w-full rounded-[2rem] border border-[#4A3B2A]/10 bg-[#FAF5F1]/80 px-6 py-6 text-left shadow-sm backdrop-blur-sm md:px-8 md:py-8 lg:rounded-[2.5rem]"
          >
            <div className="mb-4 flex items-center justify-start gap-3">
              <span className="h-px w-10 bg-[#4A3B2A]/35" />

              <p className="text-sm font-bold uppercase tracking-[0.35em] text-[#4A3B2A]/65">
                Our Philosophy
              </p>
            </div>

            <h2 className="text-3xl font-bold uppercase leading-[1.05] tracking-[0.08em] text-[#4A3B2A] md:whitespace-nowrap md:text-3xl lg:text-4xl">
              The Payana Difference
            </h2>
          </motion.div>
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
                        <p className="mt-4 whitespace-pre-wrap text-sm font-light leading-relaxed text-[#4A3B2A]/85 md:text-base">
                          {entry.description}
                        </p>
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
