import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import EOTCard from "../../common/cards/EOTCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { api, IMAGE_BASE_URL } from "../../../services/api";

const DEFAULT_CONTENT = {
  mainTitle: "Signature Journeys",
  subtitle:
    "Discover our carefully curated experiences, blending rich heritage, immersive culture, breathtaking landscapes and unforgettable wildlife encounters.",
};

const SignatureJourneys = () => {
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [content, setContent] = useState(DEFAULT_CONTENT);

  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const fetchTrails = async () => {
      try {
        const data = await api.getTrails();

        // Filter only signature journeys (based on trailType containing 'signature' or being exactly 'Signature Journey')
        const signatureTrips = data.filter(
          (trail) =>
            trail.trailType &&
            trail.trailType.toLowerCase().includes("signature")
        );

        setJourneys(signatureTrips);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching signature journeys:", err);
        setError("Failed to load journeys. Please try again later.");
        setLoading(false);
      }
    };

    fetchTrails();
  }, []);

  // Fetch dynamic section content
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await api.getJourneyPage();
        if (data?.signatureJourneys) {
          setContent({
            mainTitle:
              data.signatureJourneys.mainTitle || DEFAULT_CONTENT.mainTitle,
            subtitle:
              data.signatureJourneys.subtitle || DEFAULT_CONTENT.subtitle,
          });
        }
      } catch (err) {
        console.error("Failed to load Signature Journeys section content:", err);
      }
    };
    fetchContent();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      day: "2-digit", 
      month: "short", 
      year: "numeric" 
    });
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCardsToShow(1);
      } else if (window.innerWidth < 1024) {
        setCardsToShow(2);
      } else {
        setCardsToShow(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Ensure currentIndex is valid when cardsToShow changes
  useEffect(() => {
    if (journeys.length > 0 && currentIndex + cardsToShow > journeys.length) {
      setCurrentIndex(Math.max(0, journeys.length - cardsToShow));
    }
  }, [cardsToShow, journeys.length, currentIndex]);

  const nextSlide = () => {
    if (currentIndex + cardsToShow < journeys.length) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const visibleCards = journeys.slice(currentIndex, currentIndex + cardsToShow);

  return (
    <section className="w-full bg-[#F3EFE9] py-16 sm:py-20 lg:py-24 px-4 sm:px-6 md:px-12 lg:px-24 font-sans relative overflow-hidden">
      {/* Section Header */}
      <div className="flex flex-col items-center mb-12 sm:mb-16 text-center max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#4A3B2A] mb-4 sm:mb-6 font-serif leading-tight px-4">
          {content.mainTitle}
        </h2>

        {/* Divider Line */}
        <div className="w-[60px] h-[2px] bg-[#4A3B2A] mb-6 sm:mb-8 opacity-40"></div>

        <p className="text-base sm:text-lg md:text-xl text-[#4A3B2A]/80 font-light leading-relaxed px-4">
          {content.subtitle.split("\n").map((line, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <br />}
              {line}
            </React.Fragment>
          ))}
        </p>
      </div>

      {/* States */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A3B2A]"></div>
        </div>
      )}

      {error && (
        <div className="text-center text-red-500 py-10 font-bold">{error}</div>
      )}

      {/* Carousel */}
      {!loading && !error && journeys.length === 0 && (
        <div className="text-center text-[#4A3B2A]/70 py-10 text-lg italic">
          No signature journeys available at the moment.
        </div>
      )}

      {!loading && !error && journeys.length > 0 && (
        <div className="max-w-[1400px] mx-auto">
          {/* Main Carousel Wrapper */}
          <div className="flex flex-col items-center gap-8 w-full">
            <div className="flex items-center justify-center gap-4 w-full">
              {/* Desktop/Tablet Left Arrow */}
              <button
                onClick={prevSlide}
                disabled={currentIndex === 0}
                className={`hidden sm:flex items-center justify-center w-12 h-12 rounded-full border border-[#4A3B2A]/20 bg-white shadow-sm transition-all duration-300 z-10 shrink-0
                  ${currentIndex === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-[#E3D5C4] hover:scale-105 cursor-pointer text-[#4A3B2A]"}`}
              >
                <ChevronLeft size={24} />
              </button>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full justify-items-center transition-all duration-500 max-w-[1250px]">
                {visibleCards.map((journey) => (
                  <div key={journey._id} className="w-full flex justify-center">
                    <EOTCard
                      title={journey.trailName}
                      description={journey.trailSubTitle}
                      location={journey.trailDestination}
                      duration={journey.duration}
                      date={formatDate(journey.journeyDate)}
                      trail={journey.trailRoute}
                      trailType={journey.trailType || ""}
                      imgSrc={
                        journey.heroImage
                          ? `${IMAGE_BASE_URL}${journey.heroImage}`
                          : null
                      }
                      trailSlug={journey.slug}
                      pricing={journey.pricing}
                    />
                  </div>
                ))}
              </div>

              {/* Desktop/Tablet Right Arrow */}
              <button
                onClick={nextSlide}
                disabled={currentIndex + cardsToShow >= journeys.length}
                className={`hidden sm:flex items-center justify-center w-12 h-12 rounded-full border border-[#4A3B2A]/20 bg-white shadow-sm transition-all duration-300 z-10 shrink-0
                  ${currentIndex + cardsToShow >= journeys.length ? "opacity-30 cursor-not-allowed" : "hover:bg-[#E3D5C4] hover:scale-105 cursor-pointer text-[#4A3B2A]"}`}
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Mobile Arrows (Below Cards) */}
            <div className="flex sm:hidden items-center justify-center gap-8 mt-2">
              <button
                onClick={prevSlide}
                disabled={currentIndex === 0}
                className={`flex items-center justify-center w-14 h-14 rounded-full border border-[#4A3B2A]/20 bg-white shadow-md transition-all duration-300
                  ${currentIndex === 0 ? "opacity-30 cursor-not-allowed" : "active:scale-95 text-[#4A3B2A]"}`}
              >
                <ChevronLeft size={28} />
              </button>
              <button
                onClick={nextSlide}
                disabled={currentIndex + cardsToShow >= journeys.length}
                className={`flex items-center justify-center w-14 h-14 rounded-full border border-[#4A3B2A]/20 bg-white shadow-md transition-all duration-300
                  ${currentIndex + cardsToShow >= journeys.length ? "opacity-30 cursor-not-allowed" : "active:scale-95 text-[#4A3B2A]"}`}
              >
                <ChevronRight size={28} />
              </button>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 sm:mt-16 flex justify-center">
            <Link
              to="/journeys/signature"
              onClick={() => window.scrollTo(0, 0)}
              className="group inline-flex items-center gap-3 rounded-full bg-[#4A3B2A] px-10 py-4 text-base font-semibold text-[#F3EFE9] shadow-[0_14px_28px_rgba(74,59,42,0.16)] transition-all duration-300 hover:bg-[#3A2C1C] hover:-translate-y-1"
            >
              <span>Explore Signature Trails</span>
              <ChevronRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      )}
    </section>
  );
};

export default SignatureJourneys;
