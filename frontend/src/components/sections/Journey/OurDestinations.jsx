import React from "react";
import DestinationCard from "../../common/cards/DestinationCard";
import BrownBtn from "../../common/buttons/BrownBtn";
import bhutanImg from "../../../assets/Home/ExploreByDestination/bhutan.jpg";

const OurDestinations = () => {
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
        {/* Section Header */}
        <div className="flex flex-col items-center mb-16 text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-[#4A3B2A] mb-6 font-serif">
            Our Destinations
          </h2>

          {/* Divider Line matching the Hero section */}
          <div className="w-[60px] h-[2px] bg-[#4A3B2A] mb-6"></div>

          <p className="text-lg md:text-xl text-[#4A3B2A]/80 font-light leading-relaxed">
            The world is full of wonders waiting to be explored. Our handpicked
            destinations offer a gateway to extraordinary experiences.
          </p>
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

export default OurDestinations;
