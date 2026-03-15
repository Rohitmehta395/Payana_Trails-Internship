import React from "react";
import closingImg from "../../../assets/Home/ClosingInvitation/closing-invitation.jpg";
import BrownBtn from "../../common/buttons/BrownBtn";

const ClosingInvitation = () => {
  return (
    <section className="bg-[#F3EFE9] w-full py-16 sm:py-16 lg:py-10">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* 1. Image Section */}
          <div className="w-full lg:w-1/2 shrink-0">
            <img
              src={closingImg}
              alt="Traveler walking towards sunrise"
              className="w-full h-auto object-cover border-[8px] border-[#4A3B2A] rounded-[24px] shadow-lg"
            />
          </div>

          {/* 2. Text Section */}
          <div className="w-full lg:w-1/2 flex flex-col items-center text-center">
            <p className="text-[#4A3B2A] text-[20px] sm:text-[24px] lg:text-[24px] font-sans italic leading-relaxed mb-4">
              Travel, when designed with care,{" "}
              <br className="hidden sm:block" /> becomes memory.
            </p>
            <h3 className="text-[#4A3B2A] text-[22px] sm:text-[26px] lg:text-[28px] font-bold mb-8">
              Let's design a journey that suits you.
            </h3>

            {/* Action Button */}
            <BrownBtn
              text="Speak to a Travel Curator &rarr;"
              className="px-6 py-3 sm:px-8 sm:py-4 text-[16px] sm:text-[18px] shadow-md hover:shadow-lg w-fit"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClosingInvitation;
