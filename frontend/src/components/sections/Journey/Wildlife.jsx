import React, { useState, useEffect } from "react";
import CommonHero from "../../common/CommonHero";
import wildlifeImg from "../../../assets/Journey/Wildlife_Main.avif";
import EOTCard from "../../common/cards/EOTCard";

const Wildlife = () => {
  const [trails, setTrails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrails = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/trails");
        if (!response.ok) {
          throw new Error("Failed to fetch trails");
        }
        const data = await response.json();
        
        // Filter only wildlife trails
        const wildlifeTrails = data.filter(trail => trail.trailTheme === "Wildlife");
        setTrails(wildlifeTrails);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching wildlife trails:", err);
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

  return (
    <div className="bg-[#F3EFE9] min-h-screen">
      <CommonHero
        title="Explore Our Wildlife Trails"
        description="Where every sighting unfolds at nature’s pace, in journeys designed for depth and comfort."
        bgImage={wildlifeImg}
        breadcrumbs={[
          { label: "HOME", path: "/" },
          { label: "JOURNEY", path: "/journeys" },
          { label: "WILDLIFE" },
        ]}
      />
      
      <div className="max-w-7xl mx-auto py-16 px-6 md:px-12">
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

        {!loading && !error && trails.length === 0 && (
          <div className="text-center text-[#4A3B2A]/70 py-10 text-lg">
            No wildlife trails available at the moment.
          </div>
        )}

        {!loading && !error && trails.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 justify-items-center">
            {trails.map((trail) => (
              <EOTCard
                key={trail._id}
                title={trail.trailName}
                description={trail.trailSubTitle}
                location={trail.trailDestination}
                duration={trail.duration}
                date={formatDate(trail.journeyDate)}
                trail={trail.trailRoute}
                imgSrc={trail.heroImage ? `http://localhost:8000${trail.heroImage}` : null}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wildlife;
