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

const ExploreDestination = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <section className="relative w-full py-12 md:py-12 px-6 md:px-12 lg:px-24 bg-[#F3EFE9]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header with Decorative Lines */}
        <div className="flex items-center justify-center gap-3 md:gap-6 mb-10 md:mb-16">
          <div className="h-[1px] w-8 md:w-24 bg-[#4A3B2A] opacity-30"></div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif text-[#4A3B2A] tracking-wide text-center">
            Explore by Destination
          </h2>
          <div className="h-[1px] w-8 md:w-24 bg-[#4A3B2A] opacity-30"></div>
        </div>

        {/* Carousel Slider for Cards */}
        <div className="relative group/slider">
          <button 
            onClick={() => scroll('left')} 
            className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 z-20 bg-white/90 shadow-lg p-3 rounded-full text-[#4A3B2A] hover:bg-[#4A3B2A] hover:text-white transition-all duration-300 backdrop-blur-sm opacity-0 group-hover/slider:opacity-100 hidden md:flex items-center justify-center border border-[#4A3B2A]/10"
            aria-label="Previous destination"
          >
            <ChevronLeft size={24} strokeWidth={2.5} />
          </button>

          <div 
            ref={scrollContainerRef} 
            className="flex gap-4 md:gap-8 overflow-x-auto snap-x snap-mandatory hide-scrollbar scroll-smooth pb-6 px-4 md:px-0"
          >
            {loading ? (
              <div className="w-full flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#4A3B2A]"></div>
              </div>
            ) : destinations.length === 0 ? (
              <div className="w-full text-center text-[#4A3B2A]/70 py-20 italic font-serif text-lg">
                No destinations available at the moment.
              </div>
            ) : (
              destinations.map((dest, index) => (
                <div
                  key={dest._id}
                  className="animate-fade-in-up flex-shrink-0 w-[280px] sm:w-[calc(50%-16px)] lg:w-[calc(25%-24px)] snap-start flex justify-center"
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
            className="absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 z-20 bg-white/90 shadow-lg p-3 rounded-full text-[#4A3B2A] hover:bg-[#4A3B2A] hover:text-white transition-all duration-300 backdrop-blur-sm opacity-0 group-hover/slider:opacity-100 hidden md:flex items-center justify-center border border-[#4A3B2A]/10"
            aria-label="Next destination"
          >
            <ChevronRight size={24} strokeWidth={2.5} />
          </button>

          {/* Mobile Arrows (Below Slider) */}
          <div className="flex md:hidden items-center justify-center gap-6 mt-4">
            <button
              onClick={() => scroll('left')}
              className="flex items-center justify-center w-12 h-12 rounded-full border border-[#4A3B2A]/20 bg-white shadow-md active:scale-95 transition-all text-[#4A3B2A]"
              aria-label="Previous destination"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="flex items-center justify-center w-12 h-12 rounded-full border border-[#4A3B2A]/20 bg-white shadow-md active:scale-95 transition-all text-[#4A3B2A]"
              aria-label="Next destination"
            >
              <ChevronRight size={24} />
            </button>
          </div>
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

export default ExploreDestination;
