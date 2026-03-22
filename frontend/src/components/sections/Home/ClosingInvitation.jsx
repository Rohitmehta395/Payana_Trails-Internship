import React from "react";
import closingImg from "../../../assets/Home/ClosingInvitation/closing-invitation.webp";
import BrownBtn from "../../common/buttons/BrownBtn";

const ClosingInvitation = () => {
  return (
    <section className="bg-[#F3EFE9] w-full py-2 sm:py-8 lg:py-10">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* 1. Image Section - 3D Hover Transform */}
          <div className="w-full lg:w-1/2 shrink-0 p-2 sm:p-4">
            <img
              src={closingImg}
              alt="Traveler walking towards sunrise"
              className="w-full h-auto object-cover border-[8px] border-[#4A3B2A] rounded-[24px] 
              shadow-[8px_8px_0px_rgba(74,59,42,0.6)] 
              hover:shadow-[16px_16px_0px_rgba(74,59,42,0.4)] 
              hover:-translate-y-2 hover:-translate-x-2 hover:scale-[1.02]
              transition-all duration-500 ease-out 
              sepia-[0.2] hover:sepia-0"
            />
          </div>

          {/* 2. Text Section */}
          <div className="w-full lg:w-1/2 flex flex-col items-center text-center">
            <p className="text-[#4A3B2A] text-[20px] sm:text-[24px] lg:text-[24px] font-sans italic leading-relaxed mb-4">
              Travel, when designed with care,{" "}
              <br className="hidden sm:block" /> becomes memory.
            </p>
            <h3 className="text-[#4A3B2A] text-[20px] sm:text-[24px] lg:text-[24px] font-bold mb-8 font-serif">
              Let's design a journey that suits you.
            </h3>

            {/* Action Button */}
            <BrownBtn
              text="Connect With Us &rarr;"
              className="px-6 py-3 sm:px-8 sm:py-4 text-[16px] sm:text-[18px] shadow-md hover:shadow-lg w-fit"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClosingInvitation;
