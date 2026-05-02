import React, { useState } from "react";
import { LuMapPin, LuCalendarDays } from "react-icons/lu";
import { Link } from "react-router-dom";
import CursorMessage from "../CursorMessage";

const EOTCard = ({
  imgSrc,
  title = "Vietnam Mosaic – From Delta to the Bay",
  description = "A comprehensive journey through Vietnam's iconic highlights.",
  location = "Vietnam",
  duration = "7D - 6N",
  date = "Oct 12 - Oct 18",
  trail = "Siem Reap - Ho Chi Minh City - Da Nang - Hanoi",
  trailType = "",
  trailSlug,
  pricing,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const cardContent = (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative overflow-hidden w-full h-full max-w-[400px] p-4 bg-linear-to-bl from-[#CDBB9E] to-[#E3D5C4] border-[6px] border-[#5C4033] outline-1 outline-[#3A281F] ring-2 ring-inset ring-[#8B6A55]/30 rounded-[2.2rem] shadow-[0_10px_30px_rgba(92,64,51,0.2),inset_0_4px_15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(92,64,51,0.3)] font-sans flex flex-col"
    >
      <CursorMessage message="Click to know more" isVisible={isHovered} />
      {/* --- Aesthetic Cloud Spots (Background) --- */}
      <div className="absolute -top-10 -right-10 w-52 h-52 bg-white/40 rounded-full blur-2xl pointer-events-none z-0"></div>
      <div className="absolute top-1/2 -left-12 w-64 h-64 bg-white/30 rounded-full blur-[50px] pointer-events-none z-0"></div>
      <div className="absolute -bottom-10 right-10 w-48 h-48 bg-[#FAF6F0]/40 rounded-full blur-2xl pointer-events-none z-0"></div>

      {/* Image Section */}
      <div className="relative z-10 w-full h-[260px] shrink-0 rounded-[1.8rem] overflow-hidden mb-4 shadow-inner">
        <img
          src={
            imgSrc ||
            "https://images.unsplash.com/photo-1555921015-5532091f6026?q=80&w=1000&auto=format&fit=crop"
          }
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* 1) Top Left Badge — only shown when a trailType is set */}
        {trailType && (
          <div className="absolute top-4 left-4">
            <div className="bg-[#4A3B2A] text-[#F3EFE9] px-3 py-1.5 rounded-xl text-sm sm:text-base font-semibold tracking-wide shadow-md overflow-hidden">
              <span className="truncate block">{trailType}</span>
            </div>
          </div>
        )}

        {/* Bottom Right Badge (Calendar & Date) */}
        {date && (
          <div className="absolute bottom-4 right-4">
            <div className="bg-[#4A3B2A]/90 backdrop-blur-md text-[#F3EFE9] px-3 py-1.5 rounded-xl text-xs sm:text-[13px] font-semibold tracking-wide shadow-md flex items-center gap-1.5 shrink-0">
              <LuCalendarDays
                className="w-[14px] h-[14px] shrink-0"
                strokeWidth="2.5"
              />
              <span className="truncate">{date}</span>
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="relative z-10 px-1 sm:px-2 pb-1 flex-1 flex flex-col gap-2 sm:gap-3">
        {/* Title, Separator Line & Description Group */}
        <div className="flex flex-col items-center w-full">
          {/* Title */}
          <div className="min-h-[2.4rem] sm:min-h-[2.8rem] flex items-center justify-center w-full">
            <h3 className="text-[19px] sm:text-[21px] font-bold text-[#4A3B2A] text-center leading-tight line-clamp-2 px-1">
              {title}
            </h3>
          </div>

          {/* Separator Line */}
          <hr className="w-[60%] border-[#4A3B2A]/20 my-1 sm:my-1.5" />

          {/* 2) Description (Sub-Heading) */}
          <div className="min-h-[2.4rem] sm:min-h-[2.6rem] flex items-center justify-center w-full">
            <p className="text-[#4A3B2A]/80 text-[14px] sm:text-[16px] text-center font-medium line-clamp-2 w-full px-2">
              {description}
            </p>
          </div>
        </div>

        {/* Pricing centered in available space */}
        {pricing ? (
          <div className="flex-1 flex items-center justify-center w-full py-0.5 sm:py-1">
            <span className="text-[#4A3B2A] text-[13px] sm:text-[15px] font-bold bg-[#4A3B2A]/5 px-3 py-1 rounded-full border border-[#4A3B2A]/10 shadow-sm">
              {pricing}
            </span>
          </div>
        ) : (
          <div className="flex-1" />
        )}

        {/* Info Row: Location (Left) and Duration (Right) */}
        <div className="flex justify-between items-center w-full text-[#4A3B2A] mt-auto gap-2">
          {/* 3) Location (Country Name) */}
          <div className="flex items-center gap-1 sm:gap-1.5 justify-start overflow-hidden">
            <LuMapPin
              className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] shrink-0"
              strokeWidth="2.5"
            />
            <span className="text-[14px] sm:text-[16px] font-bold truncate">
              {location}
            </span>
          </div>

          {/* Duration */}
          <div className="flex justify-end shrink-0">
            <div className="px-2 sm:px-3 py-1 rounded-full border border-[#4A3B2A]/20 text-[11px] sm:text-[13px] font-bold tracking-wide bg-white/40 whitespace-nowrap shadow-sm backdrop-blur-sm">
              {duration}
            </div>
          </div>
        </div>

        {/* 4) Trail Route Text */}
        <div className="bg-[#F3EFE9]/70 backdrop-blur-sm rounded-2xl p-3 sm:p-4 flex justify-center items-center shadow-inner border border-[#4A3B2A]/10 w-full mt-1 min-h-[60px] sm:min-h-[72px]">
          <span className="text-[#4A3B2A]/80 text-[13px] sm:text-[15px] text-center font-medium line-clamp-2 block w-full px-1 sm:px-2">
            {trail}
          </span>
        </div>
      </div>
    </div>
  );

  if (!trailSlug) return cardContent;

  return (
    <Link to={`/trails/${trailSlug}`} className="block h-full">
      {cardContent}
    </Link>
  );
};

export default EOTCard;
