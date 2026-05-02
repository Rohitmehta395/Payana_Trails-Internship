import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DestinationCard from "../../common/cards/DestinationCard";
import BrownBtn from "../../common/buttons/BrownBtn";
import { Link } from "react-router-dom";
import { api, IMAGE_BASE_URL } from "../../../services/api";
import {
  buildDestinationListingPath,
  getDestinationGeography,
} from "../../../constants/destinationGeographies";

const DEFAULT_CONTENT = {
  mainTitle: "Our Destinations",
  subtitle:
    "The world is full of wonders waiting to be explored. Our handpicked destinations offer a gateway to extraordinary experiences.",
};

const OurDestinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth > 768 ? clientWidth / 2 : clientWidth;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await api.getDestinations();
        const sortedData = data.sort((a, b) => {
          return a.name.localeCompare(b.name);
        });
        setDestinations(sortedData);
      } catch (err) {
        console.error("Error fetching destinations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  // Fetch dynamic section content
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await api.getJourneyPage();
        if (data?.ourDestinations) {
          setContent({
            mainTitle:
              data.ourDestinations.mainTitle || DEFAULT_CONTENT.mainTitle,
            subtitle:
              data.ourDestinations.subtitle || DEFAULT_CONTENT.subtitle,
          });
        }
      } catch (err) {
        console.error("Failed to load Our Destinations section content:", err);
      }
    };
    fetchContent();
  }, []);

  return (
    <section className="relative w-full py-12 md:py-12 px-6 md:px-12 lg:px-24 bg-[#F3EFE9]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center mb-16 text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-[#4A3B2A] mb-6 font-serif">
            {content.mainTitle}
          </h2>

          {/* Divider Line matching the Hero section */}
          <div className="w-[60px] h-[2px] bg-[#4A3B2A] mb-6"></div>

          <p className="text-lg md:text-xl text-[#4A3B2A]/80 font-light leading-relaxed">
            {content.subtitle.split("\n").map((line, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <br />}
                {line}
              </React.Fragment>
            ))}
          </p>
        </div>

        {/* Carousel Slider for Cards */}
        <div className="relative group/slider">
          <button 
            onClick={() => scroll('left')} 
            className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-10 bg-white/90 shadow-md p-2 rounded-full text-[#4A3B2A] hover:bg-[#4A3B2A] hover:text-white transition-colors duration-300 backdrop-blur-sm opacity-0 group-hover/slider:opacity-100 hidden md:block"
            aria-label="Previous destination"
          >
            <ChevronLeft size={24} />
          </button>

          <div 
            ref={scrollContainerRef} 
            className="flex gap-6 md:gap-8 overflow-x-auto snap-x snap-mandatory hide-scrollbar scroll-smooth pb-4"
          >
            {loading ? (
              <div className="w-full flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4A3B2A]"></div>
              </div>
            ) : destinations.length === 0 ? (
              <div className="w-full text-center text-[#4A3B2A]/70 py-10">No destinations available.</div>
            ) : (
              destinations.map((dest, index) => (
                <div
                  key={dest._id}
                  className="animate-fade-in-up flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-24px)] snap-start flex justify-center"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <DestinationCard
                    name={dest.name}
                    image={`${IMAGE_BASE_URL}${dest.heroImage}`}
                    to={buildDestinationListingPath({
                      geography: getDestinationGeography(dest),
                      destination: dest.name,
                    })}
                  />
                </div>
              ))
            )}
          </div>

          <button 
            onClick={() => scroll('right')} 
            className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-10 bg-white/90 shadow-md p-2 rounded-full text-[#4A3B2A] hover:bg-[#4A3B2A] hover:text-white transition-colors duration-300 backdrop-blur-sm opacity-0 group-hover/slider:opacity-100 hidden md:block"
            aria-label="Next destination"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Call to Action Button */}
        <div className="flex justify-center mt-12 md:mt-16">
          <Link to="/journeys/destinations">
            <BrownBtn
              text={
                <span className="flex items-center gap-2 p-2 text-sm md:text-base">
                  View All Destinations
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
                </span>
              }
              className="group"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OurDestinations;
