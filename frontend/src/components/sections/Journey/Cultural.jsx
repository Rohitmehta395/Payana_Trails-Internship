import React, { useState, useEffect } from "react";
import CommonHero from "../../common/CommonHero";
import culturalImg from "../../../assets/Journey/Cultural_Main.webp";
import EOTCard from "../../common/cards/EOTCard";
import JourneySearchBar from "./JourneySearchBar";
import { api, IMAGE_BASE_URL } from "../../../services/api";
import usePageHeroImages from "../../../hooks/usePageHeroImages";

const Cultural = () => {
  const [trails, setTrails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { images: heroImgs } = usePageHeroImages("journeys/cultural");
  const heroBg = heroImgs.length > 0 ? (heroImgs[0].desktop || heroImgs[0]) : culturalImg;

  useEffect(() => {
    const fetchTrails = async () => {
      try {
        const data = await api.getTrails();
        
        // Filter only cultural trails
        const culturalTrails = data.filter(trail => trail.trailTheme === "Cultural");
        setTrails(culturalTrails);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching cultural trails:", err);
        setError("Failed to load trails. Please try again later.");
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

  const filteredTrails = trails.filter(trail => 
    trail.trailName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trail.trailDestination?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#F3EFE9] min-h-screen font-['Lato',sans-serif]">
      <CommonHero
        title="Explore Our Cultural & Immersive Trails"
        description="Meaningful encounters that connect you with the people, traditions and spirit of each destination."
        bgImage={heroBg}
        breadcrumbs={[
          { label: "HOME", path: "/" },
          { label: "JOURNEY", path: "/journeys" },
          { label: "CULTURAL & IMMERSIVE" },
        ]}
      />

      <div className="max-w-7xl mx-auto pt-2 pb-16 px-6 md:px-12">
        {/* Premium Floating Search Bar */}
        {!loading && !error && (
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

        {!loading &&
          !error &&
          filteredTrails.length === 0 &&
          trails.length > 0 && (
            <div className="text-center text-[#4A3B2A]/70 py-10 text-lg">
              No trails match your search criteria.
            </div>
          )}

        {!loading && !error && trails.length === 0 && (
          <div className="text-center text-[#4A3B2A]/70 py-10 text-lg">
            No cultural & immersive trails available at the moment.
          </div>
        )}

        {!loading && !error && filteredTrails.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 justify-items-center">
            {filteredTrails.map((trail) => (
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
                  trail.heroImage ? `${IMAGE_BASE_URL}${trail.heroImage}` : null
                }
                trailSlug={trail.slug}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cultural;
