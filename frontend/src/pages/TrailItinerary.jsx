import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  Minus,
  Home,
  Coffee,
  Compass,
  Trees,
  MapPin,
  Sparkles,
  Plane,
  PlaneLanding,
  PlaneTakeoff,
} from "lucide-react";
import BrownBtn from "../components/common/buttons/BrownBtn";
import { api } from "../services/api";
import {
  normalizePublicItinerary,
  transformTrailMedia,
} from "../utils/trailPresentation";

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
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4 md:gap-6">
            <div
              className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border text-lg font-semibold transition-all duration-300 md:h-16 md:w-16 md:text-xl ${
                isOpen
                  ? "border-[#8B6B50]/25 bg-[#4A3B2A] text-[#FDFBF7]"
                  : "border-[#E5D7C5] bg-[#FDFBF7] text-[#8B6B50]"
              }`}
            >
              {String(dayNumber).padStart(2, "0")}
            </div>

            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-[#E5D7C5] bg-[#FDFBF7] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8B6B50]">
                  Day {dayNumber}
                </span>
                {day.accommodation && (
                  <span className="rounded-full bg-[#8B6B50]/8 px-3 py-1 text-xs font-medium text-[#8B6B50]">
                    Stay included
                  </span>
                )}
                {day.meals && (
                  <span className="rounded-full bg-[#4A3B2A]/6 px-3 py-1 text-xs font-medium text-[#5A4738]">
                    Meals Included
                  </span>
                )}
              </div>

              <h3 className="max-w-3xl font-serif text-2xl leading-tight text-[#4A3B2A] md:text-[1.5rem]">
                {day.title}
              </h3>
            </div>
          </div>

          <div
            className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
              isOpen
                ? "border-[#8B6B50]/25 bg-[#8B6B50] text-white"
                : "border-[#E5D7C5] bg-[#FDFBF7] text-[#8B6B50] group-hover:border-[#8B6B50]/25 group-hover:bg-[#FAF7F2]"
            }`}
          >
            {isOpen ? (
              <Minus className="h-5 w-5" />
            ) : (
              <Plus className="h-5 w-5" />
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
              {/* Day Highlights - Now Full Width */}
              <div className="w-full rounded-[24px] border border-[#E5D7C5]/80 bg-[#FAF7F2] p-6">
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
                        className="flex gap-4 rounded-2xl border border-white/60 bg-white/70 px-4 py-4"
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

              {/* Accommodation & Meals - 2 Column Grid */}
              <div className="grid gap-4 md:grid-cols-2 md:gap-6">
                {day.accommodation && (
                  <div className="rounded-[24px] border border-[#E5D7C5] bg-white p-5">
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
                  <div className="rounded-[24px] border border-[#E5D7C5] bg-white p-5">
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

// ─── Optional Experiences Section ────────────────────────────────────────────
const OptionalExperiencesSection = ({ lines }) => {
  const filled = lines.filter((l) => l && l.trim());
  if (!filled.length) return null;

  return (
    <div
      id="itinerary-optional"
      className="w-full rounded-[28px] border border-[#E5D7C5]/80 bg-[#FAF7F2] p-6 md:p-8 shadow-[0_12px_30px_rgba(74,59,42,0.04)] scroll-mt-24"
    >
      {/* Section label */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5D7C5] bg-[#FDFBF7] text-[#8B6B50]">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-[#8B6B50]">
            Optional experiences
          </p>
          <p className="text-sm text-[#8B6B50]">
            Additional experiences along the way - some included, others
            available to add.
          </p>
        </div>
      </div>

      {/* Experience lines */}
      <div className="space-y-4">
        {filled.map((line, idx) => (
          <div
            key={idx}
            className="flex gap-4 rounded-2xl border border-white/60 bg-white/70 px-4 py-4"
          >
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#4A3B2A] text-xs font-semibold text-[#FDFBF7]">
              {String(idx + 1).padStart(2, "0")}
            </div>
            <p className="text-[15px] leading-relaxed text-[#5A4738] md:text-base pt-0.5">
              {line.trim()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Flights Section ──────────────────────────────────────────────────────────
const FlightsSection = ({ flights }) => {
  if (!flights) return null;

  const {
    domesticIntro, domesticLines,
    internationalIntro,
    arrivalAirport, arrivalOptions,
    departureAirport, departureOptions,
  } = flights;

  const filledDomesticLines    = (domesticLines    || []).filter((l) => l && l.trim());
  const filledArrivalOptions   = (arrivalOptions   || []).filter((o) => o && o.trim());
  const filledDepartureOptions = (departureOptions || []).filter((o) => o && o.trim());

  const hasDomestic = domesticIntro?.trim() || filledDomesticLines.length;
  const hasInternational =
    internationalIntro?.trim() ||
    arrivalAirport?.trim()     || filledArrivalOptions.length ||
    departureAirport?.trim()   || filledDepartureOptions.length;

  if (!hasDomestic && !hasInternational) return null;

  return (
    <div className="w-full rounded-[28px] border border-[#E5D7C5]/80 bg-[#FAF7F2] shadow-[0_12px_30px_rgba(74,59,42,0.04)] overflow-hidden">
      {/* Section label */}
      <div className="flex items-center gap-3 px-6 py-6 md:px-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5D7C5] bg-[#FDFBF7] text-[#8B6B50]">
          <Plane className="h-4 w-4" />
        </div>
        <div>
          <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-[#8B6B50]">
            Flights
          </p>
          <p className="text-sm text-[#8B6B50]">
            Domestic and international connections for this journey.
          </p>
        </div>
      </div>

      <div className="space-y-0 border-t border-[#4A3B2A]/10">

        {/* ── Domestic ── */}
        {hasDomestic ? (
          <div id="itinerary-domestic" className="px-6 py-6 md:px-8 scroll-mt-24">
            {/* Sub-label */}
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5D7C5] bg-[#FDFBF7] text-[#8B6B50]">
                <PlaneLanding className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-[#8B6B50]">
                  Domestic flights
                </p>
                {domesticIntro?.trim() && (
                  <p className="mt-0.5 text-sm text-[#8B6B50]">{domesticIntro.trim()}</p>
                )}
              </div>
            </div>

            {filledDomesticLines.length > 0 && (
              <div className="space-y-3">
                {filledDomesticLines.map((line, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 rounded-2xl border border-white/60 bg-white/70 px-4 py-3.5"
                  >
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#4A3B2A] text-xs font-semibold text-[#FDFBF7]">
                      {String(idx + 1).padStart(2, "0")}
                    </div>
                    <p className="text-[15px] leading-relaxed text-[#5A4738] md:text-base pt-0.5">
                      {line.trim()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}

        {/* ── International ── */}
        {hasInternational ? (
          <div id="itinerary-international" className={`px-6 py-6 md:px-8 space-y-5 scroll-mt-24 ${
            hasDomestic ? "border-t border-[#4A3B2A]/10" : ""
          }`}>
            {/* Sub-label */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5D7C5] bg-[#FDFBF7] text-[#8B6B50]">
                <PlaneTakeoff className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-[#8B6B50]">
                  International flights
                </p>
                {internationalIntro?.trim() && (
                  <p className="mt-0.5 text-sm text-[#8B6B50]">{internationalIntro.trim()}</p>
                )}
              </div>
            </div>

            {/* Arrival sub-card */}
            {(arrivalAirport?.trim() || filledArrivalOptions.length > 0) && (
              <div className="rounded-[24px] border border-[#E5D7C5] bg-white p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FAF7F2] text-[#8B6B50]">
                    <PlaneLanding className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8B6B50]">
                      Arrival
                    </p>
                    {arrivalAirport?.trim() && (
                      <p className="text-sm font-medium text-[#4A3B2A]">
                        {arrivalAirport.trim()}
                      </p>
                    )}
                  </div>
                </div>

                {filledArrivalOptions.length > 0 && (
                  <div className="space-y-3">
                    {filledArrivalOptions.map((opt, idx) => (
                      <div
                        key={idx}
                        className="flex gap-4 rounded-2xl border border-[#E5D7C5]/60 bg-[#FAF7F2] px-4 py-3.5"
                      >
                        <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D4A373] shadow-sm" />
                        <p className="text-sm leading-relaxed text-[#5A4738]">
                          {opt.trim()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Departure sub-card */}
            {(departureAirport?.trim() || filledDepartureOptions.length > 0) && (
              <div className="rounded-[24px] border border-[#E5D7C5] bg-white p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FAF7F2] text-[#8B6B50]">
                    <PlaneTakeoff className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8B6B50]">
                      Departure
                    </p>
                    {departureAirport?.trim() && (
                      <p className="text-sm font-medium text-[#4A3B2A]">
                        {departureAirport.trim()}
                      </p>
                    )}
                  </div>
                </div>

                {filledDepartureOptions.length > 0 && (
                  <div className="space-y-3">
                    {filledDepartureOptions.map((opt, idx) => (
                      <div
                        key={idx}
                        className="flex gap-4 rounded-2xl border border-[#E5D7C5]/60 bg-[#FAF7F2] px-4 py-3.5"
                      >
                        <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D4A373] shadow-sm" />
                        <p className="text-sm leading-relaxed text-[#5A4738]">
                          {opt.trim()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const TrailItinerary = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const locationTrail =
    location.state?.trail && location.state.trail.slug === slug
      ? location.state.trail
      : null;

  const [trail, setTrail] = useState(locationTrail);
  const [loading, setLoading] = useState(!locationTrail);
  const [openDay, setOpenDay] = useState(0);

  useEffect(() => {
    setOpenDay(0);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [slug]);

  useEffect(() => {
    if (locationTrail) {
      setTrail(locationTrail);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    const fetchTrail = async () => {
      try {
        const data = await api.getTrailById(slug);
        if (isMounted) setTrail(data);
      } catch (error) {
        console.error("Failed to fetch trail itinerary", error);
        if (isMounted) setTrail(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTrail();

    return () => {
      isMounted = false;
    };
  }, [locationTrail, slug]);

  const transformed = useMemo(() => transformTrailMedia(trail), [trail]);
  const itineraryDays = useMemo(
    () => normalizePublicItinerary(transformed?.itinerary || []),
    [transformed],
  );

  const toggleDay = (index) => {
    setOpenDay((current) => (current === index ? null : index));
  };

  const focusDay = (index) => {
    setOpenDay(index);

    if (typeof window !== "undefined") {
      window.requestAnimationFrame(() => {
        const target = document.getElementById(`itinerary-day-${index + 1}`);
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  };

  const scrollToId = (id) => {
    setOpenDay(null); // Optional: close day accordion if navigating to general section
    if (typeof window !== "undefined") {
      const target = document.getElementById(id);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const SITE_URL = import.meta.env.VITE_SITE_URL || "http://localhost:5173";
  const ogTitle = transformed
    ? `${transformed.trailName} Itinerary | Payana Trails`
    : "Itinerary | Payana Trails";
  const ogDescription = transformed
    ? `Follow ${transformed.trailName} day by day through the saved Payana Trails itinerary.`
    : "";
  const ogImage =
    transformed?.heroImageUrl || `${SITE_URL}/heroBg-desktop.webp`;
  const ogUrl = transformed
    ? `${SITE_URL}/trails/${transformed.slug || slug}/itinerary`
    : SITE_URL;

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Loading Itinerary | Payana Trails</title>
        </Helmet>

        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FDFBF7] px-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,107,80,0.08),transparent_48%)]" />

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="relative mb-6 h-16 w-16">
              <div className="absolute inset-0 rounded-full border border-[#E5D7C5]" />
              <div className="absolute inset-2 rounded-full border-4 border-[#E5D7C5] border-t-[#8B6B50] animate-spin" />
            </div>
            <h2 className="font-serif text-2xl text-[#4A3B2A]">
              Unfolding the journey...
            </h2>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#8B6B50]">
              Gathering the trail details and preparing the day-by-day route.
            </p>
          </div>
        </div>
      </>
    );
  }

  if (!transformed) {
    return (
      <>
        <Helmet>
          <title>Trail Not Found | Payana Trails</title>
        </Helmet>

        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FDFBF7] px-6 py-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,107,80,0.08),transparent_48%)]" />

          <div className="relative z-10 w-full max-w-2xl rounded-[36px] border border-[#E5D7C5] bg-white p-8 text-center shadow-[0_24px_60px_rgba(74,59,42,0.08)] md:p-10">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-[#E5D7C5] bg-[#FAF7F2] text-[#8B6B50]">
              <Compass className="h-9 w-9" />
            </div>

            <h1 className="font-serif text-4xl text-[#4A3B2A] md:text-5xl">
              Trail not found
            </h1>
            <p className="mx-auto mt-4 max-w-md leading-relaxed text-[#8B6B50]">
              We could not locate this itinerary. It may have been moved or
              removed.
            </p>

            <div className="mt-8 flex justify-center">
              <BrownBtn
                text="Back to Trails"
                onClick={() => navigate("/journeys")}
              />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!itineraryDays.length) {
    return (
      <>
        <Helmet>
          <title>{ogTitle}</title>
          <meta name="description" content={ogDescription} />
        </Helmet>

        <div className="relative min-h-screen overflow-hidden bg-[#FDFBF7] px-6 py-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,107,80,0.08),transparent_50%)]" />

          <div className="relative z-10 mx-auto flex min-h-[80vh] max-w-3xl items-center">
            <div className="w-full rounded-[36px] border border-[#E5D7C5] bg-white p-8 text-center shadow-[0_24px_60px_rgba(74,59,42,0.08)] md:p-10">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-[#E5D7C5] bg-[#FAF7F2] text-[#8B6B50]">
                <Compass className="h-10 w-10" />
              </div>

              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8B6B50]">
                Journey in the making
              </p>
              <h1 className="mt-4 font-serif text-4xl text-[#4A3B2A] md:text-5xl">
                Detailed itinerary coming soon
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-[#8B6B50]">
                We are shaping the day-by-day experience for{" "}
                <strong className="font-medium text-[#5A4738]">
                  {transformed.trailName}
                </strong>
                . Check back soon for the full journey.
              </p>

              <Link
                to={`/trails/${transformed.slug}`}
                className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#E5D7C5] bg-[#FAF7F2] px-7 py-3 text-sm font-medium text-[#4A3B2A] transition hover:border-[#8B6B50]/30 hover:bg-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to trail
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{ogTitle}</title>
        <meta name="description" content={ogDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Payana Trails" />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content={ogUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={ogTitle} />
        <meta name="twitter:description" content={ogDescription} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>

      <div className="min-h-screen bg-[#FDFBF7] text-[#4A3B2A] selection:bg-[#8B6B50] selection:text-white">
        <section className="relative isolate overflow-hidden bg-[#1F160E]">
          <motion.div
            initial={{ scale: 1.06 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.6, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img
              src={transformed.heroImageUrl || "/heroBg-desktop.webp"}
              alt={transformed.trailName}
              className="h-full w-full object-cover"
              loading="eager"
            />
          </motion.div>

          {/* lighter hero overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(31,22,14,0.14)_0%,rgba(31,22,14,0.24)_38%,rgba(31,22,14,0.46)_72%,rgba(31,22,14,0.62)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(253,251,247,0.16),transparent_34%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(139,107,80,0.10),transparent_28%)]" />

          <motion.div
            animate={{ y: [0, -14, 0], rotate: [0, 4, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute left-[7%] top-[16%] text-white/10"
          >
            <Compass className="h-28 w-28 md:h-40 md:w-40" strokeWidth={1} />
          </motion.div>

          <motion.div
            animate={{ y: [0, 18, 0], rotate: [0, -6, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute bottom-[12%] right-[6%] text-white/10"
          >
            <Trees className="h-36 w-36 md:h-52 md:w-52" strokeWidth={1} />
          </motion.div>

          <div className="relative mx-auto flex min-h-[85vh] max-w-[82rem] items-end px-6 pb-14 pt-28 md:px-10 md:pb-16 lg:px-12 lg:pb-20">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="max-w-4xl"
            >
              <Link
                to={`/trails/${transformed.slug}`}
                className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium tracking-wide text-[#E5D7C5] backdrop-blur-md transition-all duration-300 hover:bg-white/15 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to trail
              </Link>

              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#E5D7C5]/90">
                Payana Trails • Detailed itinerary
              </p>

              <h1 className="mt-5 font-serif text-5xl leading-[1.02] text-[#FDFBF7] drop-shadow-[0_8px_24px_rgba(0,0,0,0.22)] md:text-6xl lg:text-[4.5rem]">
                {transformed.trailName}
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#F3EFE9] md:text-lg">
                Follow the trail one day at a time, with each chapter revealing
                the pace, highlights, and practical details that shape the
                journey.
              </p>

              <div className="mt-7 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-medium text-[#FDFBF7] backdrop-blur-md">
                <Compass className="h-4 w-4 text-[#E5D7C5]" />
                {itineraryDays.length} curated day
                {itineraryDays.length > 1 ? "s" : ""}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="relative mx-auto max-w-[82rem] px-6 py-12 md:px-10 md:py-16 lg:px-12">
          <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#8B6B50]/20 to-transparent md:inset-x-10 lg:inset-x-12" />

          <div className="grid gap-8 lg:grid-cols-[380px_minmax(0,1fr)] xl:gap-10">
            <aside className="h-max lg:sticky lg:top-24">
              <div className="rounded-[32px] border border-[#E5D7C5] bg-[#FCF8F2] p-6 shadow-[0_18px_40px_rgba(74,59,42,0.05)]">
                <div className="text-center">
                  <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-[#8B6B50]">
                    Journey notes
                  </p>

                  <h2 className="mt-4 font-serif text-3xl leading-tight text-[#4A3B2A]">
                    Follow the trail, one chapter at a time.
                  </h2>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <div className="flex flex-col items-center text-center rounded-2xl border border-[#E5D7C5] bg-white p-4">
                    <Compass className="h-4 w-4 text-[#8B6B50]" />
                    <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-[#8B6B50]">
                      Route
                    </p>
                    <p className="mt-1 text-sm font-medium text-[#4A3B2A]">
                      Day by day
                    </p>
                  </div>

                  <div className="flex flex-col items-center text-center rounded-2xl border border-[#E5D7C5] bg-white p-4">
                    <Trees className="h-4 w-4 text-[#8B6B50]" />
                    <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-[#8B6B50]">
                      Stops
                    </p>
                    <p className="mt-1 text-sm font-medium text-[#4A3B2A]">
                      Curated moments
                    </p>
                  </div>

                  <div className="flex flex-col items-center text-center rounded-2xl border border-[#E5D7C5] bg-white p-4">
                    <Home className="h-4 w-4 text-[#8B6B50]" />
                    <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-[#8B6B50]">
                      Comfort
                    </p>
                    <p className="mt-1 text-sm font-medium text-[#4A3B2A]">
                      Stay + meals
                    </p>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <p className="mb-3 text-[14px] font-semibold uppercase tracking-[0.16em] text-[#8B6B50]">
                    Browse the days
                  </p>

                  <div className="max-h-[50vh] space-y-3 overflow-auto pr-1">
                    {itineraryDays.map((day, index) => (
                      <button
                        key={`${day.title}-${index}`}
                        type="button"
                        onClick={() => focusDay(index)}
                        className={`w-full rounded-2xl border px-4 py-3 text-left transition-all duration-300 ${
                          openDay === index
                            ? "border-[#8B6B50]/30 bg-white shadow-[0_12px_30px_rgba(74,59,42,0.06)]"
                            : "border-[#E5D7C5] bg-[#FAF7F2] hover:border-[#8B6B50]/25 hover:bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-all ${
                              openDay === index
                                ? "bg-[#4A3B2A] text-[#FDFBF7]"
                                : "bg-[#FDFBF7] text-[#8B6B50]"
                            }`}
                          >
                            {index + 1}
                          </span>

                          <div className="min-w-0">
                            <p className="text-[10px] uppercase tracking-[0.18em] text-[#8B6B50]">
                              Day {index + 1}
                            </p>
                            <p className="truncate text-sm font-medium text-[#4A3B2A]">
                              {day.title}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}

                    {/* ── Additional Shortcuts ── */}
                    {transformed.optionalExperiences?.some(ex => ex?.trim()) && (
                      <button
                        type="button"
                        onClick={() => scrollToId("itinerary-optional")}
                        className="w-full rounded-2xl border border-[#E5D7C5] bg-[#FAF7F2] px-4 py-3 text-left transition-all duration-300 hover:border-[#8B6B50]/25 hover:bg-white"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#FDFBF7] text-[#8B6B50]">
                            <Sparkles className="h-4 w-4" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-[10px] uppercase tracking-[0.18em] text-[#8B6B50]">Suggested</p>
                            <p className="truncate text-sm font-medium text-[#4A3B2A]">Optional Experiences</p>
                          </div>
                        </div>
                      </button>
                    )}

                    {(transformed.flights?.domesticIntro?.trim() || transformed.flights?.domesticLines?.some(l => l?.trim())) && (
                      <button
                        type="button"
                        onClick={() => scrollToId("itinerary-domestic")}
                        className="w-full rounded-2xl border border-[#E5D7C5] bg-[#FAF7F2] px-4 py-3 text-left transition-all duration-300 hover:border-[#8B6B50]/25 hover:bg-white"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#FDFBF7] text-[#8B6B50]">
                            <PlaneLanding className="h-4 w-4" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-[10px] uppercase tracking-[0.18em] text-[#8B6B50]">Internal</p>
                            <p className="truncate text-sm font-medium text-[#4A3B2A]">Domestic Flights</p>
                          </div>
                        </div>
                      </button>
                    )}

                    {(transformed.flights?.internationalIntro?.trim() || transformed.flights?.arrivalAirport?.trim() || transformed.flights?.departureAirport?.trim()) && (
                      <button
                        type="button"
                        onClick={() => scrollToId("itinerary-international")}
                        className="w-full rounded-2xl border border-[#E5D7C5] bg-[#FAF7F2] px-4 py-3 text-left transition-all duration-300 hover:border-[#8B6B50]/25 hover:bg-white"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#FDFBF7] text-[#8B6B50]">
                            <PlaneTakeoff className="h-4 w-4" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-[10px] uppercase tracking-[0.18em] text-[#8B6B50]">Logistics</p>
                            <p className="truncate text-sm font-medium text-[#4A3B2A]">International Flights</p>
                          </div>
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </aside>

            <div className="space-y-5 md:space-y-6">
              <div className="rounded-[32px] border border-[#E5D7C5] bg-white p-6 shadow-[0_18px_40px_rgba(74,59,42,0.05)] md:p-8">
                <div className="grid gap-5 md:grid-cols-[1.1fr_0.9fr] md:items-end">
                  <div>
                    <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-[#8B6B50]">
                      Detailed itinerary
                    </p>
                    <h2 className="mt-3 font-serif text-3xl leading-tight text-[#4A3B2A] md:text-4xl">
                      Every day has its own rhythm.
                    </h2>
                  </div>

                  <p className="text-sm leading-relaxed text-[#8B6B50] md:text-base">
                    Explore each chapter to discover the day's highlights, along
                    with included meals and overnight stays where available.
                  </p>
                </div>
              </div>

              {itineraryDays.map((day, index) => (
                <DayCard
                  key={`${day.title}-${index}`}
                  day={day}
                  dayNumber={index + 1}
                  isOpen={openDay === index}
                  onToggle={() => toggleDay(index)}
                />
              ))}

              {/* ── Optional Experiences ── */}
              <OptionalExperiencesSection
                lines={transformed.optionalExperiences || []}
              />

              {/* ── Flights ── */}
              <FlightsSection flights={transformed.flights} />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default TrailItinerary;
