import React, { useState } from "react";
import CreamBtn from "../buttons/CreamBtn";
import CursorMessage from "../CursorMessage";

const SignatureCard = ({ imgSrc, title, desc, btnText = "View Journey" }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full max-w-[340px] h-[420px] sm:h-[450px] rounded-[32px] overflow-hidden shadow-lg group cursor-pointer mx-auto"
    >
      <CursorMessage message="Click to know more" isVisible={isHovered} />
      {/* 1. Background Image */}
      <img
        src={imgSrc}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* 2. Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a140f] via-[#1a140f]/50 to-transparent opacity-90 transition-opacity duration-300"></div>

      {/* 3. Content Container */}
      <div className="absolute bottom-0 w-full p-5 sm:p-6 flex flex-col z-10">
        {/* Title */}
        <h3 className="text-white text-[24px] sm:text-[28px] font-bold leading-tight mb-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-[#F3EFE9] text-[14px] sm:text-[15px] italic mb-5 sm:mb-6 line-clamp-3 leading-relaxed">
          {desc}
        </p>

        {/* Action Button */}
        <CreamBtn
          text={btnText}
          className="w-full py-3 sm:py-3.5 text-[18px] sm:text-[20px] shadow-md hover:shadow-lg"
        />
      </div>
    </div>
  );
};

export default SignatureCard;
