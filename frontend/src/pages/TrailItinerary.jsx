import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LuArrowRight, LuSparkles } from "react-icons/lu";
import { api } from "../services/api";
import {
  normalizePublicItinerary,
  transformTrailMedia,
} from "../utils/trailPresentation";
import { ArrowLeft } from "lucide-react";

// Sub-components
import {
  LoadingState,
  NotFoundState,
  ComingSoonState,
} from "../components/sections/TrailItinerary/ItineraryStates";
import ItineraryHeader from "../components/sections/TrailItinerary/ItineraryHeader";
import ItinerarySidebar from "../components/sections/TrailItinerary/ItinerarySidebar";
import DayCard from "../components/sections/TrailItinerary/DayCard";
import OptionalExperiences from "../components/sections/TrailItinerary/OptionalExperiences";
import FlightsSection from "../components/sections/TrailItinerary/FlightsSection";

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
  const [openDay, setOpenDay] = useState(null);
  const [isHoveringEnquire, setIsHoveringEnquire] = useState(false);

  const handleEnquireClick = () => {
    setTimeout(() => {
      navigate("/connect/enquiry#enquiry-section", { 
        state: { 
          from: location.pathname,
          section: 'itinerary-footer',
          trailName: transformed?.trailName 
        } 
      });
    }, 400);
  };

  useEffect(() => {
    setOpenDay(null);
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
    setOpenDay(null);
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

  if (loading) return <LoadingState />;

  if (!transformed) {
    return <NotFoundState onBack={() => navigate("/journeys")} />;
  }

  if (!itineraryDays.length) {
    return (
      <ComingSoonState
        ogTitle={ogTitle}
        ogDescription={ogDescription}
        trailName={transformed.trailName}
        slug={transformed.slug}
      />
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
        <ItineraryHeader
          transformed={transformed}
          itineraryDaysLength={itineraryDays.length}
        />

        <section className="relative mx-auto max-w-[82rem] px-6 py-12 md:px-10 md:py-16 lg:px-12">
          <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#8B6B50]/20 to-transparent md:inset-x-10 lg:inset-x-12" />

          <div className="grid gap-8 lg:grid-cols-[380px_minmax(0,1fr)] xl:gap-10">
            {/* Sidebar with Navigation */}
            <ItinerarySidebar
              itineraryDays={itineraryDays}
              transformed={transformed}
              openDay={openDay}
              focusDay={focusDay}
              scrollToId={scrollToId}
            />

            <div className="space-y-5 md:space-y-6">
              {/* Introduction Card */}
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
              <div className="mt-8 flex justify-center">
                <div className="group relative max-w-2xl overflow-hidden rounded-2xl border border-[#D4A373]/20 bg-[#D4A373]/5 px-6 py-4 backdrop-blur-sm transition-all duration-300 hover:bg-[#D4A373]/10">
                  {/* Subtle shine effect */}
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                  
                  <div className="relative flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D4A373]/20 text-[#D4A373]">
                      <LuSparkles className="h-5 w-5" />
                    </div>
                    <p className="text-sm leading-relaxed text-[#8B6B50] md:text-[15px] italic">
                      This is an indicative itinerary. Every Payana Trails journey
                      is curated and personalized to match your interests and travel
                      style.
                    </p>
                  </div>
                </div>
              </div>
              </div>

              {/* Day Cards List */}
              {itineraryDays.map((day, index) => (
                <DayCard
                  key={`${day.title}-${index}`}
                  day={day}
                  dayNumber={index + 1}
                  isOpen={openDay === index}
                  onToggle={() => toggleDay(index)}
                />
              ))}

              {/* Optional Experiences */}
              <OptionalExperiences
                lines={transformed.optionalExperiences || []}
              />

              {/* Voyages / Flights */}
              <FlightsSection flights={transformed.flights} />
            </div>
          </div>
        </section>
        <div className="mb-12 flex flex-wrap items-center justify-center gap-6 px-6">
          <Link
            to={`/trails/${transformed.slug}/#trail-essentials`}
            className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-full border border-[#4A3B2A]/10 bg-[#4A3B2A] px-8 py-4 font-sans text-base font-semibold text-[#F8F2E9] shadow-[0_4px_20px_rgba(74,59,42,0.3)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(74,59,42,0.4)]"
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
            <span className="relative z-10 flex items-center gap-2">
              <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
              View Full Trail
            </span>
          </Link>

          <motion.div
            className="relative"
            onMouseEnter={() => setIsHoveringEnquire(true)}
            onMouseLeave={() => setIsHoveringEnquire(false)}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEnquireClick}
              className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-full bg-[#4A3B2A] px-10 py-4 font-sans text-base font-semibold text-[#F8F2E9] shadow-[0_4px_20px_rgba(74,59,42,0.3)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(74,59,42,0.4)]"
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />

              <span className="relative z-10 flex items-center gap-2">
                Enquire Now
                <LuArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                <motion.div
                  animate={{
                    rotate: isHoveringEnquire ? [0, 15, -15, 0] : 0,
                    scale: isHoveringEnquire ? [1, 1.2, 1] : 1,
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: isHoveringEnquire ? Infinity : 0,
                    repeatDelay: 1,
                  }}
                >
                  <LuSparkles className="h-4 w-4 text-[#D4A373]" />
                </motion.div>
              </span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default TrailItinerary;
