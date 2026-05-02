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
    <section className="bg-[#F3EFE9] w-full py-12 sm:py-14 font-sans">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* === Header Section === */}
        <div className="text-center mb-10 sm:mb-16">
          <div className="flex items-center justify-center gap-3 sm:gap-6">
            <div className="h-px w-8 md:w-24 bg-[#4A3B2A] opacity-30"></div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#4A3B2A] tracking-wide text-center">
              {wayData.title}
            </h2>
            <div className="h-[1px] w-8 md:w-24 bg-[#4A3B2A] opacity-30"></div>
          </div>
          <p className="text-[#4A3B2A] text-lg sm:text-2xl md:text-3xl font-serif italic mt-4 sm:mt-6 opacity-90 px-4">
            {wayData.subtitle}
          </p>
        </div>

        {/* === Main Content Card === */}
        <div className="group/main flex flex-col lg:flex-row items-stretch gap-10 lg:gap-16 bg-[#E3D5C4] rounded-tr-[3rem] sm:rounded-tr-[4rem] rounded-bl-[3rem] sm:rounded-bl-[4rem] rounded-tl-2xl rounded-br-2xl p-6 sm:p-10 lg:p-14 shadow-2xl transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
          {/* 1. Image Section */}
          <div className="w-full lg:w-[45%] shrink-0 relative flex flex-col aspect-[5/4] sm:aspect-video lg:aspect-auto lg:min-h-[350px]">
            {/* Offset decorative frame */}
            <div className="absolute inset-0 border border-[#4A3B2A]/20 rounded-tr-[2.5rem] sm:rounded-tr-[3rem] rounded-bl-[2.5rem] sm:rounded-bl-[3rem] rounded-tl-xl rounded-br-xl translate-x-2 translate-y-2 sm:translate-x-3 sm:translate-y-3 transition-transform duration-500 ease-out group-hover/main:translate-x-4 group-hover/main:translate-y-4"></div>

            {/* Image Container */}
            <div className="relative overflow-hidden rounded-tr-[2.5rem] sm:rounded-tr-[3rem] rounded-bl-[2.5rem] sm:rounded-bl-[3rem] rounded-tl-xl rounded-br-xl shadow-lg bg-[#4A3B2A]/5 h-full w-full">
              <img
                src={wayData.heroImage ? `${IMAGE_BASE_URL}${wayData.heroImage}` : wildlifeImg}
                alt={wayData.title}
                className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover/main:scale-105"
              />
              <div className="absolute inset-0 bg-[#F3EFE9]/10 transition-opacity duration-500 group-hover/main:opacity-0"></div>
            </div>
          </div>

          {/* 2. Text Section */}
          <div className="w-full lg:w-[55%] flex flex-col justify-center text-[#4A3B2A] py-2 lg:py-4 items-center lg:items-start text-center lg:text-left">
            {/* Description with subtle quote marks */}
            <div className="relative mb-8 sm:mb-10 w-full">
              <span className="text-4xl sm:text-5xl absolute -top-4 sm:-top-6 left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0 sm:-left-4 text-[#4A3B2A]/15 font-serif leading-none">
                "
              </span>
              <p className="text-[15px] sm:text-[18px] font-sans italic leading-relaxed opacity-90 relative z-10 whitespace-pre-line px-4 lg:px-0">
                {wayData.quote}
              </p>
            </div>

            {/* Features List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 sm:gap-y-6 mb-10 sm:mb-12 w-full">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group/item flex items-center justify-center lg:justify-start gap-3 sm:gap-4 cursor-default"
                >
                  <div className="h-[2px] w-5 sm:w-6 bg-[#4A3B2A]/30 transition-all duration-500 ease-out group-hover/item:w-8 group-hover/item:bg-[#4A3B2A]"></div>
                  <span className="text-[14px] sm:text-[16px] font-medium tracking-wide opacity-90 transition-all duration-500 group-hover/item:opacity-100 group-hover/item:translate-x-1">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* Action Button */}
            <div className="flex justify-center lg:justify-start w-full lg:w-auto">
              <BrownBtn
                text="Explore The Payana Way &rarr;"
                className="w-full sm:w-fit px-8 py-3 sm:py-4 text-[15px] sm:text-[18px] shadow-lg transition-transform duration-300 hover:-translate-y-1"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PayanaWay;
