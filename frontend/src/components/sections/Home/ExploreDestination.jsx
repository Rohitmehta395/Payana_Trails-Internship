import React from "react";
import DestinationCard from "../../common/cards/DestinationCard";
import BrownBtn from "../../common/buttons/BrownBtn";
import bhutanImg from "../../../assets/Home/ExploreByDestination/bhutan.jpg";

const ExploreDestination = () => {
  const destinations = [
    {
      name: "Kenya",
      image:
        "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=800&auto=format&fit=crop",
    },
    {
      name: "Tanzania",
      image:
        "https://images.unsplash.com/photo-1523805009345-7448845a9e53?q=80&w=800&auto=format&fit=crop",
    },
    {
      name: "Jordan",
      image:
        "https://images.unsplash.com/photo-1541410965313-d53b3c16ef17?q=80&w=800&auto=format&fit=crop",
    },
    {
      name: "Bhutan",
      image: bhutanImg, 
    },
  ];

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
          {destinations.map((dest, index) => (
            <div
              key={index}
              className="animate-fade-in-up w-full flex justify-center"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <DestinationCard name={dest.name} image={dest.image} />
            </div>
          ))}
        </div>

        {/* Call to Action Button */}
        <div className="flex justify-center mt-12 md:mt-16">
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
        </div>
      </div>
    </section>
  );
};

export default ExploreDestination;
