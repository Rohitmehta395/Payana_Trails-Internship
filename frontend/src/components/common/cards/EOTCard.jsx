import React from "react";
import { LuLuggage, LuMapPin, LuCalendarDays } from "react-icons/lu";

const EOTCard = ({
  imgSrc,
  title = "Vietnam Mosaic – From Delta to the Bay",
  description = "A comprehensive journey through Vietnam's iconic highlights.",
  category = "Small Group Adventures / Couple & Family Escapes",
  location = "Vietnam",
  duration = "7D - 6N",
  date = "Oct 12 - Oct 18",
  trail = "Siem Reap - Ho Chi Minh City - Da Nang - Hanoi",
}) => {
  return (
    <div className="group w-full max-w-[400px] p-4 bg-linear-to-bl from-[#E3D5C4] to-[#F3EFE9] border-[3px] border-[#4A3B2A] rounded-[2.5rem] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl font-sans">
      {/* Image Section */}
      <div className="relative w-full h-[260px] rounded-3xl overflow-hidden mb-5 shadow-sm">
        <img
          src={
            imgSrc ||
            "https://images.unsplash.com/photo-1555921015-5532091f6026?q=80&w=1000&auto=format&fit=crop"
          }
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Top Left Badge (Now Location) */}
        <div className="absolute top-4 left-4 bg-[#4A3B2A] text-[#F3EFE9] px-3 py-1.5 rounded-xl text-sm font-semibold tracking-wide shadow-md flex items-center gap-1.5">
          <LuMapPin className="w-[16px] h-[16px] shrink-0" strokeWidth="2.5" />
          <span className="truncate max-w-[150px]">{location}</span>
        </div>

        {/* Bottom Category Overlay */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[92%] bg-[#F3EFE9]/95 backdrop-blur-sm text-[#4A3B2A] py-2.5 px-3 rounded-[14px] flex items-center justify-center gap-2 shadow-md">
          <LuLuggage className="w-4 h-4 shrink-0" />
          <span className="text-xs sm:text-[13px] font-bold truncate">
            {category}
          </span>
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

          {/* 1-Line Description */}
          <p className="text-[#4A3B2A]/80 text-[14px] text-center font-medium truncate w-full px-2">
            {description}
          </p>
        </div>

        {/* Info Row: Duration (Left) and Date (Right) */}
        <div className="flex justify-between items-center w-full text-[#4A3B2A] mt-1">
          {/* Duration */}
          <div className="flex justify-start">
            <div className="px-3 py-1 rounded-full border border-[#4A3B2A]/20 text-[12px] sm:text-[13px] font-bold tracking-wide bg-white/40 whitespace-nowrap shadow-sm">
              {duration}
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center gap-1 justify-end">
            <LuCalendarDays className="w-[17px] h-[17px] shrink-0" />
            <span className="text-[13px] sm:text-[14px] font-bold truncate">
              {date}
            </span>
          </div>
        </div>

        {/* Trail Route Text */}
        <div className="bg-white rounded-2xl p-4 flex justify-center items-center shadow-sm border border-[#4A3B2A]/5 w-full mt-1">
          <span className="text-[#4A3B2A] font-serif font-semibold text-center text-[13px] sm:text-[12.5px] block w-full">
            {trail}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EOTCard;
