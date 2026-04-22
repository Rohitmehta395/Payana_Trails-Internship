import React from "react";
import wildlifeImg from "../../../assets/Home/PayanaWay/Payana-way.webp";
import BrownBtn from "../../common/buttons/BrownBtn";
import useHomePageData from "../../../hooks/useHomePageData";
import { IMAGE_BASE_URL } from "../../../services/api";

const PayanaWay = () => {
  const { data: homeData } = useHomePageData();

  const wayData = homeData?.thePayanaWay || {
    title: "The Payana Way",
    subtitle: "A more thoughtful way to experience the world",
    quote: "We believe travel should be unhurried, immersive and deeply meaningful. Our journeys are thoughtfully designed to let you slow down, travel at ease, and connect with each destination. Because true travel is not about seeing more, but experiencing more.",
    highlights: [
      "Personalised Journeys",
      "Curated Experiences",
      "Slow & Immersive Travel",
      "Seamless & Transparent",
    ],
    heroImage: null
  };

  const features = wayData.highlights?.length === 4 ? wayData.highlights : [
    "Personalised Journeys",
    "Curated Experiences",
    "Slow & Immersive Travel",
    "Seamless & Transparent",
  ];

  return (
    <section className="bg-[#F3EFE9] w-full py-2 sm:py-14 font-sans">
      <div className="max-w-350 mx-auto px-6 lg:px-8">
        {/* === Header Section === */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-6">
            <div className="h-px w-12 md:w-24 bg-[#4A3B2A] opacity-30"></div>
            <h2 className="text-3xl md:text-4xl font-serif text-[#4A3B2A] tracking-wide text-center">
              {wayData.title}
            </h2>
            <div className="h-[1px] w-12 md:w-24 bg-[#4A3B2A] opacity-30"></div>
          </div>
          <p className="text-[#4A3B2A] text-2xl sm:text-3xl font-serif italic mt-6 opacity-90">
            {wayData.subtitle}
          </p>
        </div>

        {/* === Main Content Card === */}
        {/* Changed to items-stretch to make both columns equal height, updated bg to darker cream */}
        <div className="group/main flex flex-col lg:flex-row items-stretch gap-12 lg:gap-16 bg-[#E3D5C4] rounded-tr-[4rem] rounded-bl-[4rem] rounded-tl-2xl rounded-br-2xl p-6 sm:p-10 lg:p-14 shadow-2xl transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
          {/* 1. Image Section - Now stretches to match text height */}
          <div className="w-full lg:w-[45%] shrink-0 relative mt-4 lg:mt-0 flex flex-col min-h-[300px]">
            {/* Offset decorative frame - inverted border color */}
            <div className="absolute inset-0 border border-[#4A3B2A]/20 rounded-tr-[3rem] rounded-bl-[3rem] rounded-tl-xl rounded-br-xl translate-x-3 translate-y-3 transition-transform duration-500 ease-out group-hover/main:translate-x-5 group-hover/main:translate-y-5"></div>

            {/* Image Container - takes up full height of parent */}
            <div className="relative overflow-hidden rounded-tr-[3rem] rounded-bl-[3rem] rounded-tl-xl rounded-br-xl shadow-lg bg-[#4A3B2A]/5 h-full w-full flex-1">
              <img
                src={wayData.heroImage ? `${IMAGE_BASE_URL}${wayData.heroImage}` : wildlifeImg}
                alt={wayData.title}
                className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover/main:scale-105"
              />
              <div className="absolute inset-0 bg-[#F3EFE9]/10 transition-opacity duration-500 group-hover/main:opacity-0"></div>
            </div>
          </div>

          {/* 2. Text Section - Text color inverted to brown */}
          <div className="w-full lg:w-[55%] flex flex-col justify-center text-[#4A3B2A] py-4">
            {/* Description with subtle quote marks */}
            <div className="relative mb-10">
              <span className="text-5xl absolute -top-6 -left-4 text-[#4A3B2A]/15 font-serif leading-none">
                "
              </span>
              <p className="text-[16px] sm:text-[18px] font-sans italic leading-relaxed opacity-90 relative z-10 whitespace-pre-line">
                {wayData.quote}
              </p>
            </div>

            {/* Features List - Minimalist expanding lines updated to brown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 mb-12">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group/item flex items-center gap-4 cursor-default"
                >
                  {/* Line expands from 24px to 48px on hover */}
                  <div className="h-[2px] w-6 bg-[#4A3B2A]/30 transition-all duration-500 ease-out group-hover/item:w-8 group-hover/item:bg-[#4A3B2A]"></div>

                  {/* Text slides slightly to the right */}
                  <span className="text-[16px] font-medium tracking-wide opacity-90 transition-all duration-500 group-hover/item:opacity-100 group-hover/item:translate-x-1">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* Action Button - Replaced with BrownBtn */}
            <div className="flex justify-start">
              <BrownBtn
                text="Explore The Payana Way &rarr;"
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
