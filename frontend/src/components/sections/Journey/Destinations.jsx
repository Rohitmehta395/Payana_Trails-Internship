import React, { useState, useEffect } from "react";
import CommonHero from "../../common/CommonHero";
import destinationsImg from "../../../assets/Journey/Destination_Main.webp";
import JourneySearchBar from "./JourneySearchBar";
import DestinationCard from "../../common/cards/DestinationCard";
import BrownBtn from "../../common/buttons/BrownBtn";
import { api, IMAGE_BASE_URL } from "../../../services/api";
import { Link, useSearchParams } from "react-router-dom";
import EOTCard from "../../common/cards/EOTCard";
import {
  buildDestinationListingPath,
  getDestinationGeography,
} from "../../../constants/destinationGeographies";

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [trails, setTrails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trailsLoading, setTrailsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trailsError, setTrailsError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(8);
  const [searchParams] = useSearchParams();
  const geographyFilter = searchParams.get("geography") || "";
  const destinationFilter = searchParams.get("destination") || "";
  const initialSearchQuery = searchParams.get("search") || "";

  const normalizeValue = (value = "") =>
    value.trim().toLowerCase().replace(/\s+/g, " ");

  const matchesDestination = (trailDestination, destinationName) => {
    const normalizedTrailDestination = normalizeValue(trailDestination);
    const normalizedDestinationName = normalizeValue(destinationName);

    if (!normalizedTrailDestination || !normalizedDestinationName) {
      return false;
    }

    return (
      normalizedTrailDestination === normalizedDestinationName ||
      normalizedTrailDestination.includes(normalizedDestinationName) ||
      normalizedDestinationName.includes(normalizedTrailDestination)
    );
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 4);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {
    setSearchQuery(initialSearchQuery);
  }, [initialSearchQuery]);

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

  useEffect(() => {
    const fetchTrails = async () => {
      try {
        const data = await api.getTrails();
        setTrails(data);
      } catch (err) {
        console.error("Error fetching destination trails:", err);
        setTrailsError("Failed to load trails for this destination.");
      } finally {
        setTrailsLoading(false);
      }
    };

    fetchTrails();
  }, []);

  useEffect(() => {
    setVisibleCount(8);
  }, [searchQuery, geographyFilter]);

  // Filter based on searchQuery
  const filteredDestinations = destinations.filter((dest) => {
    const matchesSearch = dest.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesGeography = !geographyFilter
      || getDestinationGeography(dest) === geographyFilter;

    return matchesSearch && matchesGeography;
  });

  const selectedDestination = destinations.find((dest) =>
    normalizeValue(dest.name) === normalizeValue(destinationFilter),
  );

  const selectedDestinationTrails = selectedDestination
    ? trails.filter((trail) =>
        matchesDestination(trail.trailDestination, selectedDestination.name),
      )
    : [];

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
        {!loading && !error && !selectedDestination && (
          <JourneySearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
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
        {!loading &&
          !error &&
          filteredDestinations.length === 0 &&
          destinations.length > 0 && (
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

        {!loading && !error && selectedDestination && (
          <>
            <div className="mb-10">
              <div className="relative overflow-hidden rounded-[28px] border border-[#4A3B2A]/10 bg-[linear-gradient(135deg,#F8F2EA_0%,#EFE4D5_100%)] px-6 py-6 md:px-8 md:py-7 shadow-[0_18px_40px_rgba(74,59,42,0.08)]">
                <div className="absolute -top-14 right-0 h-32 w-32 rounded-full bg-white/25 blur-2xl"></div>
                <div className="absolute -bottom-12 left-10 h-24 w-24 rounded-full bg-[#D7C3AA]/35 blur-2xl"></div>

                <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center rounded-full border border-[#4A3B2A]/15 bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#4A3B2A]/65">
                      Destination
                    </span>
                    <h2 className="text-3xl md:text-4xl font-serif text-[#4A3B2A] leading-none">
                      {selectedDestination.name} Trails
                    </h2>
                    <span className="inline-flex items-center rounded-full bg-[#4A3B2A]/8 px-3.5 py-1.5 text-sm font-semibold text-[#4A3B2A] border border-[#4A3B2A]/10">
                      {selectedDestinationTrails.length}{" "}
                      {selectedDestinationTrails.length === 1
                        ? "Trail"
                        : "Trails"}
                    </span>
                  </div>

                  <Link
                    to="/journeys/destinations"
                    className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-[#4A3B2A] px-5 py-3 text-sm font-semibold text-[#F3EFE9] shadow-[0_12px_24px_rgba(74,59,42,0.18)] hover:bg-[#3A2C1C] transition-all duration-300"
                  >
                    <span className="text-base leading-none">&larr;</span>
                    <span>All Destinations</span>
                  </Link>
                </div>
              </div>
            </div>

            {trailsLoading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#4A3B2A]"></div>
              </div>
            )}

            {!trailsLoading && trailsError && (
              <div className="text-center text-red-500 py-8 font-medium">
                {trailsError}
              </div>
            )}

            {!trailsLoading &&
              !trailsError &&
              selectedDestinationTrails.length === 0 && (
                <div className="text-center text-[#4A3B2A]/70 py-8 text-lg">
                  No trails are available for {selectedDestination.name} right
                  now.
                </div>
              )}

            {!trailsLoading &&
              !trailsError &&
              selectedDestinationTrails.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 justify-items-center">
                  {selectedDestinationTrails.map((trail) => (
                    <EOTCard
                      key={trail._id}
                      title={trail.trailName}
                      description={trail.trailSubTitle}
                      location={trail.trailDestination}
                      duration={trail.duration}
                      date={formatDate(trail.journeyDate)}
                      trail={trail.trailRoute}
                      trailType={trail.trailType || ""}
                      imgSrc={
                        trail.heroImage
                          ? `${IMAGE_BASE_URL}${trail.heroImage}`
                          : null
                      }
                      trailId={trail._id}
                    />
                  ))}
                </div>
              )}
          </>
        )}

        {/* Results Grid & Load More */}
        {!loading &&
          !error &&
          !selectedDestination &&
          filteredDestinations.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 justify-items-center">
                {filteredDestinations
                  .slice(0, visibleCount)
                  .map((dest, index) => (
                    <div
                      key={dest._id}
                      className="animate-fade-in-up w-full flex justify-center"
                      style={{ animationDelay: `${(index % 4) * 150}ms` }}
                    >
                      <DestinationCard
                        name={dest.name}
                        image={`${IMAGE_BASE_URL}${dest.heroImage}`}
                        to={buildDestinationListingPath({
                          geography: getDestinationGeography(dest),
                          destination: dest.name,
                        })}
                        isSelected={matchesDestination(
                          dest.name,
                          destinationFilter,
                        )}
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
