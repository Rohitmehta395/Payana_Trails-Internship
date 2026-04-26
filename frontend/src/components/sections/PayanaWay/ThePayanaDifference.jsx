import React from "react";
import { motion } from "framer-motion";
import { IMAGE_BASE_URL } from "../../../services/api";
import RichTextRenderer from "../../common/RichTextRenderer";
import LightboxImage from "../../common/LightboxImage";
import SectionHeader from "../../common/SectionHeader";

const ease = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay, ease },
  }),
};

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

// Splits entries into rows so no row ever has a lone orphan card.
// Rules for 4-column preference:
//   n % 4 === 0  → rows of 4
//   n % 4 === 3  → rows of 4, last row of 3
//   n % 4 === 2  → rows of 4, last row of 2
//   n % 4 === 1  → rows of 4, but reroute last 5 into [3, 2] (avoids 4+1)
const chunkArray = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );

const getVisualRows = (entries) => {
  const n = entries.length;
  if (n === 0) return [];
  if (n <= 4) return [entries];

  const rem = n % 4;
  if (rem === 0) return chunkArray(entries, 4);

  if (rem === 3) {
    const front = chunkArray(entries.slice(0, n - 3), 4);
    return [...front, entries.slice(n - 3)];
  }

  if (rem === 2) {
    const front = chunkArray(entries.slice(0, n - 2), 4);
    return [...front, entries.slice(n - 2)];
  }

  // rem === 1: 5, 9, 13…
  if (n === 5) return [entries.slice(0, 3), entries.slice(3)];
  const front = chunkArray(entries.slice(0, n - 5), 4);
  return [...front, entries.slice(n - 5, n - 2), entries.slice(n - 2)];
};



const ThePayanaDifference = ({ data }) => {
  if (!data || !data.entries?.length) return null;

  return (
    <section
      id="the-payana-difference"
      className="relative bg-[#F3EFE9] overflow-hidden"
    >
      {/* ── Section Header ───────────────────────────────────────────── */}
      <div className="container mx-auto max-w-7xl px-6 pt-12 pb-8 md:pt-16 md:pb-10">
        <SectionHeader
          title={data.mainTitle || "The Payana Difference"}
          subtitle={data.subtitle || "Our Philosophy"}
        />
      </div>

      {/* ── Full-Width Landscape Image (Lightbox-enabled) ─────────────── */}
      {data.mainImage && (
        <motion.div
          initial={{ opacity: 0, scale: 1.03 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1.1, ease }}
          className="w-full relative"
        >
          {/* LightboxImage fills the container; gradient overlay sits on top */}
          <LightboxImage
            src={`${IMAGE_BASE_URL}${data.mainImage}`}
            alt="The Payana Difference"
            className="h-[260px] md:h-[360px] lg:h-[420px]"
            containerClassName="w-full"
            rounded=""
          />
          {/* Bottom-fade gradient — pointer-events-none so lightbox clicks pass through */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#F3EFE9] via-transparent to-[#4A3B2A]/8 pointer-events-none z-10" />
          {/* Thin brand line at top */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#4A3B2A]/30 to-transparent pointer-events-none z-10" />
        </motion.div>
      )}

      {/* ── Entries Grid ─────────────────────────────────────────────── */}
      <div className="container mx-auto max-w-7xl px-6 pb-14 md:pb-20 -mt-8 md:-mt-12 relative z-10 space-y-4">
        {getVisualRows(data.entries).map((row, rowIdx) => {
          const cols =
            row.length === 1
              ? "grid-cols-1 max-w-sm mx-auto w-full"
              : row.length === 2
              ? "grid-cols-1 sm:grid-cols-2"
              : row.length === 3
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

          return (
            <motion.div
              key={rowIdx}
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              className={`grid gap-4 ${cols}`}
            >
              {row.map((entry) => {
                const index = data.entries.indexOf(entry);
                return (
                  <motion.article
                    key={index}
                    variants={fadeUp}
                    custom={index * 0.05}
                    className="group relative flex flex-col h-full min-h-[380px] bg-[#FAF5F1] border border-[#4A3B2A]/12 rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(74,59,42,0.06)] hover:shadow-[0_8px_32px_rgba(74,59,42,0.12)] hover:border-[#4A3B2A]/25 transition-all duration-500"
                  >
                    {/* Accent bar on top — animates on hover */}
                    <div className="h-[3px] bg-[#4A3B2A]/10 group-hover:bg-[#4A3B2A]/40 transition-colors duration-500" />

                    <div className="flex flex-col flex-1 p-5 md:p-6">
                      {/* Index badge */}
                      <div className="flex items-center gap-3 mb-4">
                        <span className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[#4A3B2A]/20 bg-[#F3EFE9] text-xs font-bold tracking-wider text-[#4A3B2A] group-hover:bg-[#4A3B2A] group-hover:text-[#FAF5F1] group-hover:border-transparent transition-all duration-400 shrink-0">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className="h-px flex-1 bg-[#4A3B2A]/15 group-hover:bg-[#4A3B2A]/30 transition-colors duration-400" />
                      </div>

                      {/* Title */}
                      <h3 className="text-lg md:text-xl font-bold leading-snug tracking-wide text-[#4A3B2A] mb-2">
                        {entry.title}
                      </h3>

                      {/* Subtitle */}
                      {entry.subtitle && (
                        <p className="text-sm italic text-[#4A3B2A]/65 mb-3 leading-relaxed">
                          {entry.subtitle}
                        </p>
                      )}

                      {/* Description */}
                      {entry.description && (
                        <RichTextRenderer
                          text={entry.description}
                          className="text-sm font-light leading-relaxed text-[#4A3B2A]/80 mt-2"
                          paragraphClass="mb-2"
                        />
                      )}
                    </div>

                    {/* Watermark index */}
                    <span className="absolute -right-3 -bottom-4 text-[72px] font-black leading-none text-[#4A3B2A]/[0.04] select-none pointer-events-none transition-transform duration-700 group-hover:scale-110">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </motion.article>
                );
              })}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default ThePayanaDifference;
