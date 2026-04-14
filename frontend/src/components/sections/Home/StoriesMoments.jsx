import React from "react";
import CreamBtn from "../../common/buttons/CreamBtn";
import BrownBtn from "../../common/buttons/BrownBtn";
import storyImg from "../../../assets/Home/Stories/stories-moments.webp";
import { FaEnvelopeOpenText } from "react-icons/fa6";
import { useNewsletter } from "../../../context/NewsletterContext";

const StoriesMoments = () => {
  const { openNewsletterModal } = useNewsletter();

  return (
    <section className="bg-[#F3EFE9] w-full py-16 sm:py-20 lg:py-16">
      {/* === Header Section === */}
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-6">
          <div className="h-px w-12 md:w-24 bg-[#4A3B2A] opacity-30"></div>
          <h2 className="text-3xl md:text-4xl font-serif text-[#4A3B2A] tracking-wide text-center">
            Stories & Voices from the Trails
          </h2>
          <div className="h-[1px] w-12 md:w-24 bg-[#4A3B2A] opacity-30"></div>
        </div>
      </div>
      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner Container */}
        <div className="relative w-full h-100 sm:h-112.5 lg:h-125 rounded-4xl overflow-hidden shadow-xl group">
          {/* 1. Background Image */}
          <img
            src={storyImg}
            alt="Quiet travel moments"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
          />

          {/* 2. Uniform Overlay */}
          <div className="absolute inset-0 bg-[#c9bebd]/20 transition-opacity duration-300"></div>

          {/* 3. Quote Text */}
          <div className="absolute inset-0 flex items-start justify-end z-10">
            {/* Gradient overlay ONLY on right side */}
            <div className="absolute inset-0 bg-gradient-to-l from-black/50 via-black/20 to-transparent"></div>

            {/* Text container */}
            <div className="relative mt-4 sm:mt-8 lg:mt-8 mr-6 sm:mr-8 max-w-md lg:max-w-lg text-right">
              <h2 className="text-white text-[16px] sm:text-[20px] lg:text-[22px] font-sans italic font-semibold leading-relaxed tracking-wide">
                “Travel isn’t about how many places you see.<br /> It’s about the
                moments that stay with you.”
              </h2>
            </div>
          </div>

          {/* 4. Action Button */}
          <div className="absolute bottom-8 sm:bottom-12 left-6 sm:left-12 z-10">
            <CreamBtn
              text="Explore Our Travel Stories &rarr;"
              className="px-6 py-3 sm:px-8 sm:py-3.5 text-[15px] sm:text-[16px] shadow-lg hover:shadow-xl font-bold"
            />
          </div>
        </div>

        {/* === NEWSLETTER SUBSCRIPTION BAR === */}
        <div className="mt-12 relative overflow-hidden bg-white/60 border border-[#4A3B2A]/10 rounded-4xl p-8 sm:px-12 sm:py-10 shadow-sm transition-all duration-300 hover:shadow-lg hover:bg-white/80 flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left: Text Info */}
          <div className="flex items-center gap-5 text-center sm:text-left flex-col sm:flex-row w-full lg:w-auto">
            <div className="w-14 h-14 shrink-0 bg-[#4A3B2A]/10 rounded-full flex items-center justify-center text-[#4A3B2A]">
              <FaEnvelopeOpenText size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold font-serif text-[#4A3B2A] mb-2">
                Stay Inspired
              </h3>
              <p className="text-[#4A3B2A]/80 text-[16px] max-w-md leading-relaxed">
                Get handpicked travel stories, exclusive journeys, and a touch
                of magic delivered directly to your inbox.
              </p>
            </div>
          </div>

          {/* Right: Action Button */}
          <div className="shrink-0 w-full sm:w-auto">
            <BrownBtn
              text="Subscribe to our Newsletter &rarr;"
              className="w-full sm:w-auto px-8 py-4 shadow-md hover:shadow-xl shadow-[#4A3B2A]/20"
              onClick={openNewsletterModal}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoriesMoments;
