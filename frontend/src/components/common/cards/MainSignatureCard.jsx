import React, { useState } from "react";
import CreamBtn from "../buttons/CreamBtn";
import CursorMessage from "../CursorMessage";

const MainSignatureCard = ({
  image,
  title,
  desc,
  btnText = "View Journey",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-[#4A3B2A] rounded-4xl p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 lg:gap-10 w-full max-w-300 mx-auto shadow-xl"
    >
      <CursorMessage message="Click to know more" isVisible={isHovered} />
      {/* 1. Image Section */}
      <div className="w-full lg:w-[55%] shrink-0 h-75 sm:h-100 lg:h-112.5">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover border-8 border-[#F3EFE9] rounded-3xl shadow-sm"
        />
      </div>

      {/* 2. Text Content Section */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center py-2 lg:py-4">
        {/* Title */}
        <h2 className="text-[#F3EFE9] text-[28px] sm:text-[32px] lg:text-[36px] font-bold mb-4 leading-tight">
          {title}
        </h2>

        {/* Description */}
        <p className="text-[#F3EFE9] text-[15px] sm:text-[16px] lg:text-[16px] italic leading-relaxed mb-8 opacity-90">
          {desc}
        </p>

        {/* Action Button */}
        <div className="mt-auto lg:mt-0">
          <CreamBtn
            text={btnText}
            className="w-fit px-8 py-3 sm:py-3.5 text-[18px] sm:text-[20px] shadow-md hover:shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default MainSignatureCard;
