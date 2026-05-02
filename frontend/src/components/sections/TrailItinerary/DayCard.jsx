import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Home, Coffee, Compass } from "lucide-react";

const DayCard = ({ day, dayNumber, isOpen, onToggle }) => {
  const panelId = `day-panel-${dayNumber}`;

  return (
    <motion.article
      layout
      id={`itinerary-day-${dayNumber}`}
      className={`group relative scroll-mt-28 overflow-hidden rounded-[28px] border transition-all duration-500 ${
        isOpen
          ? "border-[#8B6B50]/35 bg-white shadow-[0_20px_60px_rgba(74,59,42,0.08)]"
          : "border-[#E5D7C5] bg-[#FCF8F2] shadow-[0_12px_30px_rgba(74,59,42,0.04)] hover:-translate-y-1 hover:border-[#8B6B50]/25 hover:shadow-[0_18px_40px_rgba(74,59,42,0.08)]"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,107,80,0.10),transparent_34%)]" />

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="relative z-10 flex w-full flex-col gap-6 px-6 py-6 text-left md:px-8 md:py-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 md:gap-6">
            <div
              className={`flex h-12 w-12 md:h-16 md:w-16 flex-shrink-0 items-center justify-center rounded-2xl border text-base md:text-xl font-semibold transition-all duration-300 ${
                isOpen
                  ? "border-[#8B6B50]/25 bg-[#4A3B2A] text-[#FDFBF7]"
                  : "border-[#E5D7C5] bg-[#FDFBF7] text-[#8B6B50]"
              }`}
            >
              {String(dayNumber).padStart(2, "0")}
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-1.5 md:mb-3 flex flex-wrap items-center gap-1.5 md:gap-2">
                <span className="rounded-full border border-[#E5D7C5] bg-[#FDFBF7] px-2 md:px-3 py-0.5 md:py-1 text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8B6B50]">
                  Day {dayNumber}
                </span>
                {day.accommodation && (
                  <span className="rounded-full bg-[#8B6B50]/8 px-2 md:px-3 py-0.5 md:py-1 text-[9px] md:text-xs font-medium text-[#8B6B50]">
                    Stay
                  </span>
                )}
                {day.meals && (
                  <span className="rounded-full bg-[#4A3B2A]/6 px-2 md:px-3 py-0.5 md:py-1 text-[9px] md:text-xs font-medium text-[#5A4738]">
                    Meals
                  </span>
                )}
              </div>

              <h3 className="font-serif text-[clamp(1.15rem,4.5vw,1.5rem)] leading-tight text-[#4A3B2A] md:text-[1.5rem]">
                {day.title}
              </h3>
            </div>
          </div>

          <div
            className={`flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
              isOpen
                ? "border-[#8B6B50]/25 bg-[#8B6B50] text-white"
                : "border-[#E5D7C5] bg-[#FDFBF7] text-[#8B6B50] group-hover:border-[#8B6B50]/25 group-hover:bg-[#FAF7F2]"
            }`}
          >
            {isOpen ? (
              <Minus className="h-4 w-4 md:h-5 md:w-5" />
            ) : (
              <Plus className="h-4 w-4 md:h-5 md:w-5" />
            )}
          </div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="relative z-10 flex flex-col gap-6 border-t border-[#4A3B2A]/10 px-6 pb-6 pt-2 md:px-8 md:pb-8">
              {/* Day Highlights */}
              <div className="w-full rounded-[24px] border border-[#E5D7C5]/80 bg-[#FAF7F2] p-5 md:p-6">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5D7C5] bg-[#FDFBF7] text-[#8B6B50]">
                    <Compass className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-[#8B6B50]">
                      Day highlights
                    </p>
                    <p className="text-sm text-[#8B6B50]">
                      Key experiences, route insights, and meaningful stops
                      along the way.
                    </p>
                  </div>
                </div>

                {day.points && day.points.length > 0 ? (
                  <div className="space-y-4">
                    {day.points.map((point, idx) => (
                      <div
                        key={idx}
                        className="flex gap-4 rounded-2xl border border-white/60 bg-white/70 px-3 py-3 md:px-4 md:py-4"
                      >
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#4A3B2A] text-xs font-semibold text-[#FDFBF7]">
                          {String(idx + 1).padStart(2, "0")}
                        </div>
                        <p className="text-[15px] leading-relaxed text-[#5A4738] md:text-base">
                          {point}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-[#E5D7C5] bg-white/70 px-4 py-5 text-sm italic text-[#8B6B50]">
                    Details for this day are currently being curated.
                  </div>
                )}
              </div>

              {/* Accommodation & Meals */}
              <div className="grid gap-4 md:grid-cols-2 md:gap-6">
                {day.accommodation && (
                  <div className="rounded-[24px] border border-[#E5D7C5] bg-white p-4 md:p-5">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FAF7F2] text-[#8B6B50]">
                        <Home className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-[#8B6B50]">
                          Accommodation
                        </p>
                        <p className="text-sm text-[#8B6B50]">
                          Where the day settles in.
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-medium leading-relaxed text-[#4A3B2A] md:text-base">
                      {day.accommodation}
                    </p>
                  </div>
                )}

                {day.meals && (
                  <div className="rounded-[24px] border border-[#E5D7C5] bg-white p-4 md:p-5">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FAF7F2] text-[#8B6B50]">
                        <Coffee className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-[#8B6B50]">
                          Meals included
                        </p>
                        <p className="text-sm text-[#8B6B50]">
                          Fuel planned for the route.
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-medium leading-relaxed text-[#4A3B2A] md:text-base">
                      {day.meals}
                    </p>
                  </div>
                )}

                {!day.accommodation && !day.meals && (
                  <div className="col-span-1 rounded-[24px] border border-dashed border-[#E5D7C5] bg-white p-5 md:col-span-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8B6B50]">
                      Practical notes
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-[#5A4738]">
                      Accommodation and meal details are not available for this
                      chapter yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
};

export default DayCard;
