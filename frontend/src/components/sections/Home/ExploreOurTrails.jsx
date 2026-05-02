import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api, IMAGE_BASE_URL } from "../../../services/api";
import EOTCard from "../../common/cards/EOTCard";
import BrownBtn from "../../common/buttons/BrownBtn";
import CreamBtn from "../../common/buttons/CreamBtn";

const ExploreOurTrails = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  const categories = ["All", "Wildlife", "Heritage", "Cultural"];

  useEffect(() => {
    const fetchTrails = async () => {
      try {
        const data = await api.getTrails();
        const formattedTrails = data.map((trail) => {
          let dateStr = "";
          if (trail.journeyDate) {
            dateStr = new Date(trail.journeyDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            });
          }

          return {
            id: trail._id,
            category: trail.trailTheme,
            title: trail.trailName,
            description: trail.trailSubTitle,
            location: trail.trailDestination,
            duration: trail.duration,
            date: dateStr,
            trail: trail.trailRoute,
            trailType: trail.trailType || "",
            slug: trail.slug,
            pricing: trail.pricing,
            // Assuming the hero image is returned as a relative path
            imgSrc: trail.heroImage
              ? `${IMAGE_BASE_URL}${trail.heroImage}`
              : undefined,
          };
        });
        // Sort: signature trails first, then the rest (preserve original order within each group)
        const sorted = [...formattedTrails].sort((a, b) => {
          const aIsSig = a.trailType?.toLowerCase().includes("signature") ? 0 : 1;
          const bIsSig = b.trailType?.toLowerCase().includes("signature") ? 0 : 1;
          return aIsSig - bIsSig;
        });
        setServices(sorted);
      } catch (error) {
        console.error("Failed to fetch trails for Explore Our Trails", error);
      }
    };
    fetchTrails();
  }, []);

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

  const filteredServices = services.filter((service) =>
    activeCategory === "All" ? true : service.category === activeCategory,
  );

  // Ensure currentIndex is valid when cardsToShow changes (e.g. on resize)
  useEffect(() => {
    if (
      filteredServices.length > 0 &&
      currentIndex + cardsToShow > filteredServices.length
    ) {
      setCurrentIndex(Math.max(0, filteredServices.length - cardsToShow));
    }
  }, [cardsToShow, filteredServices.length, currentIndex]);

  const visibleCards = filteredServices.slice(
    currentIndex,
    currentIndex + cardsToShow,
  );

  const handleFilterClick = (category) => {
    setActiveCategory(category);
    setCurrentIndex(0);
  };

  const nextSlide = () => {
    if (currentIndex + cardsToShow < filteredServices.length) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <section className="bg-[#F3EFE9] w-full py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden">
      {/* Increased max-w to 1400px so 3x400px cards + arrows fit perfectly without shrinking */}
      <div className="max-w-[1400px] mx-auto">
        {/* Section Title */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 mb-8">
          <div className="h-[1px] w-12 md:w-24 bg-[#4A3B2A] opacity-30"></div>
          <h2 className="text-3xl md:text-4xl font-serif text-[#4A3B2A] tracking-wide text-center">
            Explore Our Trails
          </h2>
          <div className="h-[1px] w-12 md:w-24 bg-[#4A3B2A] opacity-30"></div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-12">
          {categories.map((cat) => (
            <CreamBtn
              key={cat}
              text={cat}
              onClick={() => handleFilterClick(cat)}
              className={
                activeCategory === cat
                  ? "!bg-[#4A3B2A] !text-[#F3EFE9] !border-[#4A3B2A] shadow-md"
                  : "!bg-white !text-[#4A3B2A]/80 border border-[#4A3B2A]/15 shadow-sm hover:!bg-[#E3D5C4]"
              }
            />
          ))}
        </div>

        {/* Carousel Area */}
        <div className="flex flex-col items-center gap-8 w-full">
          <div className="flex items-center justify-center gap-2 md:gap-4 w-full">
            {/* Left Arrow (Desktop/Tablet) */}
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className={`hidden sm:flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border border-[#4A3B2A]/20 bg-white shadow-sm transition-all duration-300 z-10 shrink-0
                ${currentIndex === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-[#E3D5C4] hover:scale-105 cursor-pointer text-[#4A3B2A]"}`}
            >
              <svg
                className="w-5 h-5 md:w-6 md:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full justify-items-center transition-all duration-500 max-w-[1250px]">
              {visibleCards.length > 0 ? (
                visibleCards.map((service) => (
                  <EOTCard
                    key={service.id}
                    title={service.title}
                    description={service.description}
                    location={service.location}
                    duration={service.duration}
                    date={service.date}
                    trail={service.trail}
                    trailType={service.trailType}
                    imgSrc={service.imgSrc}
                    trailSlug={service.slug}
                    pricing={service.pricing}
                  />
                ))
              ) : (
                <div className="col-span-1 sm:col-span-2 lg:col-span-3 py-12 text-center text-[#4A3B2A]/60 italic font-serif text-lg">
                  No trails currently available in this category.
                </div>
              )}
            </div>

            {/* Right Arrow (Desktop/Tablet) */}
            <button
              onClick={nextSlide}
              disabled={currentIndex + cardsToShow >= filteredServices.length}
              className={`hidden sm:flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border border-[#4A3B2A]/20 bg-white shadow-sm transition-all duration-300 z-10 shrink-0
                ${currentIndex + cardsToShow >= filteredServices.length ? "opacity-30 cursor-not-allowed" : "hover:bg-[#E3D5C4] hover:scale-105 cursor-pointer text-[#4A3B2A]"}`}
            >
              <svg
                className="w-5 h-5 md:w-6 md:h-6"
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
            </button>
          </div>

          {/* Mobile Arrows (Below Cards) */}
          <div className="flex sm:hidden items-center justify-center gap-6">
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className={`flex items-center justify-center w-12 h-12 rounded-full border border-[#4A3B2A]/20 bg-white shadow-md transition-all duration-300
                ${currentIndex === 0 ? "opacity-30 cursor-not-allowed" : "active:scale-95 text-[#4A3B2A]"}`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              disabled={currentIndex + cardsToShow >= filteredServices.length}
              className={`flex items-center justify-center w-12 h-12 rounded-full border border-[#4A3B2A]/20 bg-white shadow-md transition-all duration-300
                ${currentIndex + cardsToShow >= filteredServices.length ? "opacity-30 cursor-not-allowed" : "active:scale-95 text-[#4A3B2A]"}`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* CTA Button Wrapper */}
        <div className="flex justify-center mt-12 sm:mt-16">
          <BrownBtn
            text={
              <span className="flex items-center justify-center gap-2">
                View All Trails
                <svg
                  className="w-5 h-5 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  ></path>
                </svg>
              </span>
            }
            onClick={() => {
              navigate("/journeys#our-trails");
            }}
            className="group px-8 py-4 sm:px-10 text-lg font-semibold min-w-[240px] shadow-md hover:shadow-lg transition-all duration-300"
          />
        </div>
      </div>
    </section>
  );
};

export default ExploreOurTrails;
