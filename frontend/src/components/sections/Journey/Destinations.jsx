import React, { useState, useEffect } from "react";
import CommonHero from "../../common/CommonHero";
import destinationsImg from "../../../assets/Journey/Destination_Main.webp";
import JourneySearchBar from "./JourneySearchBar";
import DestinationCard from "../../common/cards/DestinationCard";
import BrownBtn from "../../common/buttons/BrownBtn";
import { api, IMAGE_BASE_URL } from "../../../services/api";

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(8);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 4);
  };

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await api.getDestinations();
        setDestinations(data);
      } catch (err) {
        console.error("Error fetching destinations:", err);
        setError("Failed to load destinations.");
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  // Filter based on searchQuery
  const filteredDestinations = destinations.filter((dest) =>
    dest.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#F3EFE9] min-h-screen font-['Lato',sans-serif]">
      <CommonHero
        title="OUR DESTINATIONS"
        description="The world is full of wonders waiting to be explored. Our handpicked destinations offer a gateway to extraordinary experiences."
        bgImage={destinationsImg}
        breadcrumbs={[
          { label: "HOME", path: "/" },
          { label: "JOURNEY", path: "/journeys" },
          { label: "DESTINATIONS" },
        ]}
      />
      
      <div className="max-w-7xl mx-auto pt-2 pb-16 px-6 md:px-12">
        {/* Premium Floating Search Bar */}
        {!loading && !error && (
          <JourneySearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        )}

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A3B2A]"></div>
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 py-10 font-bold">
            {error}
          </div>
        )}

        {/* Not Found via Search */}
        {!loading && !error && filteredDestinations.length === 0 && destinations.length > 0 && (
          <div className="text-center text-[#4A3B2A]/70 py-10 text-lg">
            No destinations match your search criteria.
          </div>
        )}

        {/* Empty DB */}
        {!loading && !error && destinations.length === 0 && (
          <div className="text-center text-[#4A3B2A]/70 py-10 text-lg">
            No destinations available at the moment.
          </div>
        )}

        {/* Results Grid & Load More */}
        {!loading && !error && filteredDestinations.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 justify-items-center">
              {filteredDestinations.slice(0, visibleCount).map((dest, index) => (
                <div
                  key={dest._id}
                  className="animate-fade-in-up w-full flex justify-center"
                  style={{ animationDelay: `${(index % 4) * 150}ms` }}
                >
                  <DestinationCard 
                     name={dest.name} 
                     image={`${IMAGE_BASE_URL}${dest.heroImage}`} 
                  />
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {visibleCount < filteredDestinations.length && (
              <div className="flex justify-center mt-12 md:mt-16">
                <BrownBtn text="Load More" onClick={handleLoadMore} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Destinations;
