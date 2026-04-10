import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import EOTCard from "../../common/cards/EOTCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { api, IMAGE_BASE_URL } from "../../../services/api";

const SignatureJourneys = () => {
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const fetchTrails = async () => {
      try {
        const data = await api.getTrails();
        
        // Filter only signature journeys (based on trailType containing 'signature' or being exactly 'Signature Journey')
        const signatureTrips = data.filter(trail => 
          trail.trailType && trail.trailType.toLowerCase().includes("signature")
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

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      day: "2-digit", 
      month: "short", 
      year: "numeric" 
    });
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  return (
    <section className="w-full bg-[#F3EFE9] py-20 px-6 md:px-12 lg:px-24 font-['Lato',sans-serif] relative">
      {/* Section Header */}
      <div className="flex flex-col items-center mb-16 text-center max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-[#4A3B2A] mb-6 font-serif">
          Signature Journeys
        </h2>

        {/* Divider Line matching the Hero section */}
        <div className="w-[60px] h-[2px] bg-[#4A3B2A] mb-6"></div>

        <p className="text-lg md:text-xl text-[#4A3B2A]/80 font-light leading-relaxed">
          Discover our carefully curated experiences, blending rich heritage,
          immersive culture, breathtaking landscapes and unforgettable wildlife
          encounters.
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
        <div className="text-center text-[#4A3B2A]/70 py-10 text-lg">
          No signature journeys available at the moment.
        </div>
      )}

      {!loading && !error && journeys.length > 0 && (
        <div className="max-w-7xl mx-auto">
          <div className="relative flex items-center group">
            {/* Left Arrow */}
            <button
              onClick={scrollLeft}
              className="absolute left-0 lg:-left-6 z-20 w-12 h-12 bg-white/80 backdrop-blur border border-[#4A3B2A]/20 text-[#4A3B2A] rounded-full flex items-center justify-center shadow-md hover:bg-[#4A3B2A] hover:text-white transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 disabled:opacity-0"
              aria-label="Previous journeys"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Cards Container */}
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto gap-8 lg:gap-10 px-4 py-8 snap-x snap-mandatory hide-scroll-bar w-full"
              style={{
                scrollbarWidth: "none" /* Firefox */,
                msOverflowStyle: "none" /* IE and Edge */,
              }}
            >
              <style>{`
                .hide-scroll-bar::-webkit-scrollbar {
                  display: none;
                }
              `}</style>

              {journeys.map((journey) => (
                <div
                  key={journey._id}
                  className="snap-center shrink-0 w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.33rem)] max-w-[400px] flex justify-center"
                >
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
                  />
                </div>
              ))}
            </div>

            {/* Right Arrow */}
            <button
              onClick={scrollRight}
              className="absolute right-0 lg:-right-6 z-20 w-12 h-12 bg-white/80 backdrop-blur border border-[#4A3B2A]/20 text-[#4A3B2A] rounded-full flex items-center justify-center shadow-md hover:bg-[#4A3B2A] hover:text-white transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
              aria-label="Next journeys"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="mt-8 flex justify-center">
            <Link
              to="/journeys/signature"
              onClick={() => window.scrollTo(0, 0)}
              className="group inline-flex items-center gap-2 rounded-full bg-[#4A3B2A] px-6 py-3 text-sm md:text-base font-semibold text-[#F3EFE9] shadow-[0_14px_28px_rgba(74,59,42,0.16)] transition-all duration-300 hover:bg-[#3A2C1C] hover:-translate-y-0.5"
            >
              <span>Explore Signature Trails</span>
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      )}
    </section>
  );
};

export default SignatureJourneys;
