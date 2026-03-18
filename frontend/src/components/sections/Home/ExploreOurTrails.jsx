import React from "react";
// Ensure your image imports are correct based on your file structure!
import wildlifeImg from "../../../assets/Home/Whatwedo/wildlife.webp";
import unescoImg from "../../../assets/Home/Whatwedo/unesco.webp";
import culturalImg from "../../../assets/Home/Whatwedo/cultural.webp";
import EOTCard from "../../common/cards/EOTCard";
import BrownBtn from "../../common/buttons/BrownBtn";

const ExploreOurTrails = () => {
  // Added the new data fields to match the new EOTCard layout
  const services = [
    {
      id: 1,
      title: "Wildlife Trails",
      subtitle: "Discover the majestic beasts of the savannah",
      location: "Kenya & Tanzania",
      duration: "10D - 9N",
      date: "12 Aug 2026",
      cities: "Nairobi - Masai Mara - Serengeti - Arusha",
      imgSrc: wildlifeImg,
    },
    {
      id: 2,
      title: "The Mekong Heritage",
      subtitle: "From the ancient Angkor to the picturesque Halong",
      location: "Cambodia & Vietnam",
      duration: "7D - 6N",
      date: "18 Jun 2026",
      cities: "Siem Reap - Ho Chi Minh City - Da Nang - Hanoi",
      imgSrc: unescoImg,
    },
    {
      id: 3,
      title: "Cultural Escapes",
      subtitle: "Immersive experiences through ancient traditions",
      location: "Japan & South Korea",
      duration: "14D - 13N",
      date: "05 Oct 2026",
      cities: "Tokyo - Kyoto - Seoul - Jeju Island",
      imgSrc: culturalImg,
    },
  ];

  return (
    <section className="bg-[#F3EFE9] w-full py-8 sm:py-8 lg:py-8 px-4 sm:px-6 lg:px-8">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto">
        
        {/* Section Title */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 mb-12 sm:mb-16">
          <div className="h-[1px] w-12 md:w-24 bg-[#4A3B2A] opacity-30"></div>
          <h2 className="text-3xl md:text-4xl font-serif text-[#4A3B2A] tracking-wide text-center">
            Explore Our Trails
          </h2>
          <div className="h-[1px] w-12 md:w-24 bg-[#4A3B2A] opacity-30"></div>
        </div>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {services.map((service) => (
            <EOTCard
              key={service.id}
              title={service.title}
              subtitle={service.subtitle}
              location={service.location}
              duration={service.duration}
              date={service.date}
              cities={service.cities}
              imgSrc={service.imgSrc}
            />
          ))}
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
            onClick={() => console.log("Navigate to trails page")}
            className="group px-8 py-4 sm:px-10 text-lg font-semibold min-w-[240px] shadow-md hover:shadow-lg transition-all duration-300"
          />
        </div>
      </div>
    </section>
  );
};

export default ExploreOurTrails; 