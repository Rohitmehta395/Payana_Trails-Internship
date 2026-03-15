import React from "react";
import wildlifeImg from "../../../assets/Home/PayanaWay/Payana-way.png";
import CreamBtn from "../../common/buttons/CreamBtn";

const PayanaWay = () => {
  const features = [
    "Small Groups",
    "Gentle Pace",
    "Expert Curators",
    "Carefully Chosen Stays",
  ];

  return (
    <section className="bg-[#F3EFE9] w-full py-16 sm:py-24 font-sans">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        {/* === Header Section === */}
        <div className="text-center mb-16">
          <h2 className="text-[#4A3B2A] text-4xl sm:text-5xl font-bold tracking-widest uppercase mb-4 relative inline-block group cursor-default">
            The Payana Way
            {/* Animated underline that expands from the center on hover */}
            <span className="absolute -bottom-2 left-1/2 w-0 h-[2px] bg-[#4A3B2A] transition-all duration-500 ease-out group-hover:w-1/2 group-hover:-translate-x-full"></span>
            <span className="absolute -bottom-2 right-1/2 w-0 h-[2px] bg-[#4A3B2A] transition-all duration-500 ease-out group-hover:w-1/2"></span>
          </h2>
          <p className="text-[#4A3B2A] text-2xl sm:text-3xl font-serif italic mt-6 opacity-90">
            A more thoughtful way to travel
          </p>
        </div>

        {/* === Main Content Card === */}
        {/* Notice the asymmetrical rounded corners (tr & bl) for an organic, premium shape */}
        <div className="group/main flex flex-col lg:flex-row items-center gap-12 lg:gap-16 bg-[#4A3B2A] rounded-tr-[4rem] rounded-bl-[4rem] rounded-tl-2xl rounded-br-2xl p-6 sm:p-10 lg:p-14 shadow-2xl transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
          {/* 1. Image Section - 100% visible, no forced cropping */}
          <div className="w-full lg:w-[45%] shrink-0 relative mt-4 lg:mt-0">
            {/* Offset decorative frame that shifts outward when you hover over the card */}
            <div className="absolute inset-0 border border-[#F3EFE9]/30 rounded-tr-[3rem] rounded-bl-[3rem] rounded-tl-xl rounded-br-xl translate-x-3 translate-y-3 transition-transform duration-500 ease-out group-hover/main:translate-x-5 group-hover/main:translate-y-5"></div>

            {/* Image Container */}
            <div className="relative overflow-hidden rounded-tr-[3rem] rounded-bl-[3rem] rounded-tl-xl rounded-br-xl shadow-lg bg-[#F3EFE9]/5">
              <img
                src={wildlifeImg}
                alt="The Payana Way"
                className="w-full h-auto object-cover transition-transform duration-1000 ease-out group-hover/main:scale-105"
              />
              <div className="absolute inset-0 bg-[#4A3B2A]/10 transition-opacity duration-500 group-hover/main:opacity-0"></div>
            </div>
          </div>

          {/* 2. Text Section */}
          <div className="w-full lg:w-[55%] flex flex-col justify-center text-[#F3EFE9]">
            {/* Description with subtle quote marks */}
            <div className="relative mb-10">
              <span className="text-5xl absolute -top-6 -left-4 text-[#F3EFE9]/10 font-serif leading-none">
                "
              </span>
              <p className="text-[16px] sm:text-[18px] font-sans italic leading-relaxed opacity-90 relative z-10">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur.
              </p>
            </div>

            {/* Features List - Minimalist expanding lines */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 mb-12">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group/item flex items-center gap-4 cursor-default"
                >
                  {/* Line expands from 24px to 48px on hover */}
                  <div className="h-[2px] w-6 bg-[#F3EFE9]/30 transition-all duration-500 ease-out group-hover/item:w-8 group-hover/item:bg-[#F3EFE9]"></div>  

                  {/* Text slides slightly to the right */}
                  <span className="text-[17px] font-medium tracking-wide opacity-80 transition-all duration-500 group-hover/item:opacity-100 group-hover/item:translate-x-1">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* Action Button */}
            <div className="flex justify-start">
              <CreamBtn
                text="Discover The Payana Way &rarr;"
                className="w-full sm:w-fit px-8 py-4 text-[16px] sm:text-[18px] shadow-lg transition-transform duration-300 hover:-translate-y-1"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PayanaWay;
