import React from "react";
import { motion } from "framer-motion";
import { 
  Plane, 
  PlaneLanding, 
  PlaneTakeoff, 
  Info,
  MapPin
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const FlightDetailsSection = ({ flights }) => {
  if (!flights) return null;

  const {
    domesticIntro,
    domesticLines = [],
    internationalIntro,
    arrivalAirport,
    arrivalOptions = [],
    departureAirport,
    departureOptions = [],
  } = flights;

  const hasDomestic = domesticIntro?.trim() || domesticLines.some(l => l?.trim());
  const hasInternational = internationalIntro?.trim() || 
                           arrivalAirport?.trim() || arrivalOptions.some(o => o?.trim()) ||
                           departureAirport?.trim() || departureOptions.some(o => o?.trim());

  if (!hasDomestic && !hasInternational) return null;

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-12 md:px-10">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
        className="relative overflow-hidden rounded-[2.5rem] bg-[#4A3B2A] p-8 text-[#FDFBF7] shadow-[0_30px_60px_rgba(74,59,42,0.25)] md:p-12 lg:p-16"
      >
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(212,163,115,0.4),transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:40px_40px]" />

        <div className="relative mb-12 flex flex-col items-center gap-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[13px] font-semibold uppercase tracking-[0.2em] text-[#D4A373] backdrop-blur-md">
            <Plane className="h-4 w-4" />
            Air Travel
          </div>
          <h2 className="font-serif text-3xl font-medium text-[#FDFBF7] md:text-5xl">
            Flight Logistics
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-[#FDFBF7]/70 md:text-base">
            Essential information regarding your domestic connections and international arrival/departure arrangements.
          </p>
        </div>

        <div className="relative grid gap-8 lg:grid-cols-2">
          {/* ── Domestic Section ── */}
          {hasDomestic && (
            <motion.div variants={itemVariants} className="flex flex-col rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4A373] text-[#4A3B2A]">
                  <PlaneLanding className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#D4A373]">
                    Part of your journey
                  </h3>
                  <p className="font-serif text-2xl text-[#FDFBF7]">Domestic Flights</p>
                </div>
              </div>

              {domesticIntro?.trim() && (
                <div className="mb-6 flex items-start gap-3 rounded-2xl border border-white/10 bg-[#FDFBF7]/5 p-4 text-sm italic text-[#FDFBF7]/80">
                  <Info className="h-4 w-4 shrink-0 mt-0.5" />
                  <p>{domesticIntro.trim()}</p>
                </div>
              )}

              <div className="space-y-3">
                {domesticLines.filter(l => l?.trim()).map((line, idx) => (
                  <div key={idx} className="flex items-center gap-4 rounded-2xl bg-white/5 px-5 py-4 transition-colors hover:bg-white/10">
                    <MapPin className="h-4 w-4 text-[#D4A373]" />
                    <p className="text-[15px] font-medium text-[#FDFBF7]/90">{line.trim()}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── International Section ── */}
          {hasInternational && (
            <motion.div variants={itemVariants} className="flex flex-col rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#4A3B2A]">
                  <PlaneTakeoff className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/60">
                    Travel Assistance
                  </h3>
                  <p className="font-serif text-2xl text-[#FDFBF7]">International Flights</p>
                </div>
              </div>

              {internationalIntro?.trim() && (
                <p className="mb-8 text-sm leading-relaxed text-[#FDFBF7]/70">
                  {internationalIntro.trim()}
                </p>
              )}

              <div className="space-y-6">
                {/* Arrival */}
                {(arrivalAirport?.trim() || arrivalOptions.some(o => o?.trim())) && (
                  <div className="space-y-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#D4A373]">Arrival Arrangements</p>
                    <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
                      {arrivalAirport?.trim() && (
                        <p className="mb-4 text-lg font-serif italic text-[#FDFBF7]">{arrivalAirport.trim()}</p>
                      )}
                      <div className="space-y-2">
                        {arrivalOptions.filter(o => o?.trim()).map((opt, idx) => (
                          <div key={idx} className="flex items-start gap-3 text-[13px] text-[#FDFBF7]/60">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D4A373]" />
                            <p>{opt.trim()}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Departure */}
                {(departureAirport?.trim() || departureOptions.some(o => o?.trim())) && (
                  <div className="space-y-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#D4A373]">Departure Arrangements</p>
                    <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
                      {departureAirport?.trim() && (
                        <p className="mb-4 text-lg font-serif italic text-[#FDFBF7]">{departureAirport.trim()}</p>
                      )}
                      <div className="space-y-2">
                        {departureOptions.filter(o => o?.trim()).map((opt, idx) => (
                          <div key={idx} className="flex items-start gap-3 text-[13px] text-[#FDFBF7]/60">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D4A373]" />
                            <p>{opt.trim()}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
};

export default FlightDetailsSection;
