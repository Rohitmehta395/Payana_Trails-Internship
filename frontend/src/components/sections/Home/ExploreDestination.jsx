import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await api.getDestinations();
        setDestinations(data.slice(0, 4)); // Only show up to 4 on home
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

        {/* Responsive Grid for Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {loading ? (
            <div className="col-span-full flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4A3B2A]"></div>
            </div>
          ) : destinations.length === 0 ? (
            <div className="col-span-full text-center text-[#4A3B2A]/70 py-10">
              No destinations available.
            </div>
          ) : (
            destinations.map((dest, index) => (
              <div
                key={dest._id}
                className="animate-fade-in-up w-full flex justify-center"
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
