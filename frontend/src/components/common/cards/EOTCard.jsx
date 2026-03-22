import React from "react";
import { LuLuggage, LuMapPin, LuCalendarDays } from "react-icons/lu";

const EOTCard = ({
  imgSrc,
  title = "Vietnam Mosaic – From Delta to the Bay",
  description = "A comprehensive journey through Vietnam's iconic highlights.",
  location = "Vietnam",
  duration = "7D - 6N",
  date = "Oct 12 - Oct 18",
  trail = "Siem Reap - Ho Chi Minh City - Da Nang - Hanoi",
}) => {
  return (
    <div className="group w-full max-w-[400px] p-4 bg-linear-to-bl from-[#E3D5C4] to-[#F3EFE9] border-[6px] border-[#5C4033] outline outline-1 outline-[#3A281F] ring-2 ring-inset ring-[#8B6A55]/30 rounded-[2.2rem] shadow-[0_10px_30px_rgba(92,64,51,0.2),inset_0_4px_15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(92,64,51,0.3)] font-sans">
      {/* Image Section */}
      <div className="relative w-full h-[260px] rounded-[1.8rem] overflow-hidden mb-5 shadow-inner">
        <img
          src={
            imgSrc ||
            "https://images.unsplash.com/photo-1555921015-5532091f6026?q=80&w=1000&auto=format&fit=crop"
          }
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* 1) Top Left Badge (Signature Text) - Increased font to text-sm sm:text-base */}
        <div className="absolute top-4 left-4">
          <div className="bg-[#4A3B2A] text-[#F3EFE9] px-3 py-1.5 rounded-xl text-sm sm:text-base font-semibold tracking-wide shadow-md overflow-hidden">
            <span className="truncate block">Signature Heritage Trail</span>
          </div>
        </div>

        {/* Bottom Right Badge (Calendar & Date) */}
        <div className="absolute bottom-4 right-4">
          <div className="bg-[#4A3B2A]/90 backdrop-blur-md text-[#F3EFE9] px-3 py-1.5 rounded-xl text-xs sm:text-[13px] font-semibold tracking-wide shadow-md flex items-center gap-1.5 shrink-0">
            <LuCalendarDays
              className="w-[14px] h-[14px] shrink-0"
              strokeWidth="2.5"
            />
            <span className="truncate">{date}</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-2 pb-1 flex flex-col gap-4">
        {/* Title, Separator Line & Description Group */}
        <div className="flex flex-col items-center w-full">
          {/* Title */}
          <h3 className="text-[21px] font-bold text-[#4A3B2A] text-center leading-tight line-clamp-2">
            {title}
          </h3>

          {/* Separator Line */}
          <hr className="w-[60%] border-[#4A3B2A]/20 my-2.5" />

          {/* 2) Description (Sub-Heading) - Increased font to 16px */}
          <p className="text-[#4A3B2A]/80 text-[16px] text-center font-medium line-clamp-2 w-full px-2">
            {description}
          </p>
        </div>

        {/* Info Row: Location (Left) and Duration (Right) */}
        <div className="flex justify-between items-center w-full text-[#4A3B2A] mt-1 gap-2">
          {/* 3) Location (Country Name) - Increased font to 15px/16px */}
          <div className="flex items-center gap-1.5 justify-start overflow-hidden">
            <LuMapPin
              className="w-[18px] h-[18px] shrink-0"
              strokeWidth="2.5"
            />
            <span className="text-[15px] sm:text-[16px] font-bold truncate">
              {location}
            </span>
          </div>

          {/* Duration */}
          <div className="flex justify-end shrink-0">
            <div className="px-3 py-1 rounded-full border border-[#4A3B2A]/20 text-[12px] sm:text-[13px] font-bold tracking-wide bg-white/40 whitespace-nowrap shadow-sm">
              {duration}
            </div>
          </div>
        </div>

        {/* 4) Trail Route Text - Matches Sub-Heading styling & line-clamp */}
        <div className="bg-[#F3EFE9]/70 rounded-2xl p-4 flex justify-center items-center shadow-inner border border-[#4A3B2A]/10 w-full mt-1">
          <span className="text-[#4A3B2A]/80 text-[16px] text-center font-medium line-clamp-2 block w-full px-2">
            {trail}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EOTCard;
