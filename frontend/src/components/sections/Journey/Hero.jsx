import React from "react";
import CreamBtn from "../../common/buttons/CreamBtn";

export default function Hero() {
  return (
    // Removed the pt-24 from this main wrapper so it snaps to the very top edge of the screen
    <div className="flex flex-col md:flex-row min-h-screen w-full font-['Lato',_sans-serif] bg-[#F3EFE9]">
      {/* Content Section */}
      {/* Added pt-32 (padding-top) here so the background reaches the top, but the text is pushed safely down below the floating header */}
      <div className="flex-1 flex flex-col justify-center items-center md:items-start px-8 pt-32 pb-16 md:px-[10%] text-[#4A3B2A] text-center md:text-left min-h-[50vh] md:min-h-screen">
        <div className="w-full max-w-[500px] flex flex-col items-center md:items-start">
          <h1 className="text-4xl md:text-[3.5vw] font-bold mb-6 leading-[1.1] tracking-[2px] font-serif">
            CURATED
            <br />
            JOURNEYS
          </h1>

          <div className="w-15 h-0.5 bg-[#4A3B2A] mb-8"></div>

          <p className="text-lg md:text-xl font-light leading-[1.8] mb-10">
            Each journey is thoughtfully designed to explore landscapes,
            wildlife, and culture at an unhurried pace.
          </p>

          <CreamBtn
            text="Begin Exploring"
            className="px-8 py-4 border border-[#4A3B2A] !bg-transparent text-[#4A3B2A] text-sm uppercase tracking-[2px] hover:!bg-[#4A3B2A] hover:!text-[#F3EFE9] transition-colors duration-400 ease-in-out font-semibold !rounded-none"
          />
        </div>
      </div>

      {/* Image Section */}
      <div
        className="flex-1 min-h-[50vh] md:min-h-screen bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1523805009345-7448845a9e53?q=80&w=2072&auto=format&fit=crop')",
        }}
      ></div>
    </div>
  );
}
