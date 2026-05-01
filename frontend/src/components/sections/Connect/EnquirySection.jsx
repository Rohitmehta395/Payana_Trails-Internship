import React from "react";
import { Link } from "react-router-dom";
import enquiry1 from "../../../assets/connect/enquiry1.webp";
import enquiry2 from "../../../assets/connect/enquiry2.webp";

import { IMAGE_BASE_URL } from "../../../services/api";

const EnquirySection = ({ data }) => {
  return (
    <section
      id="enquiry-section"
      className="py-2 px-4 md:px-8 bg-[#F3EFE9] relative z-10 overflow-hidden"
    >
      {/* Subtle background text watermark */}
      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -ml-24 text-[20rem] font-serif italic font-bold text-[#F3EFE9]/50 select-none pointer-events-none z-0 tracking-tighter mix-blend-multiply hidden lg:block">
        Explore
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:pt-8 gap-10 lg:gap-16 relative z-10">
        {/* Left Typography Side */}
        <div className="w-full lg:w-1/2 relative text-left lg:pt-20">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-12 h-[2px] bg-[#D4A373]"></div>
            <span className="text-[#D4A373] uppercase tracking-[0.3em] font-bold text-sm">
              {data?.typographyText || "Tailored For You"}
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-[4rem] font-bold text-[#4A3B2A] leading-[1.05] mb-5 tracking-tight font-serif drop-shadow-sm">
            {data?.titleBold || "Craft Your"} <br />
            <span className="italic font-light text-[#4A3B2A]/90">
              {data?.titleItalic || "Journey."}
            </span>
          </h2>

          <p className="text-[#4A3B2A]/70 text-base md:text-lg font-medium max-w-lg mb-8 leading-relaxed">
            {data?.subtitle || "Travel is the only thing you buy that makes you richer. Share your vision with our destination experts and we will curate an itinerary that transcends the ordinary."}
          </p>

          <div className="relative inline-block group">
            <Link
              to="/connect/enquiry#enquiry-section"
              className="relative z-10 flex items-center justify-center px-8 py-4 bg-[#4A3B2A] text-[#F3EFE9] font-bold tracking-[0.2em] uppercase text-sm border border-[#4A3B2A] transition-all duration-500 overflow-hidden"
            >
              <span className="absolute inset-0 bg-[#795939] transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
              <span className="relative z-20 flex items-center gap-4 group-hover:text-[#F3EFE9] transition-colors duration-500">
                Begin Enquiry
                <svg
                  className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </span>
            </Link>
            {/* Decorative off-center outline */}
            <div className="absolute inset-0 border border-[#4A3B2A]/20 translate-x-3 translate-y-3 z-0 transition-transform duration-500 group-hover:translate-x-4 group-hover:translate-y-4"></div>
          </div>
        </div>

        {/* Right Imagery Side - Clean Elegance */}
        <div className="w-full lg:w-1/2 relative flex flex-col md:flex-row justify-end mt-6 lg:mt-0">
          {/* Back Image (Offset) */}
          <div className="hidden md:block absolute top-0 right-16 lg:right-92 w-[60%] aspect-[4/5] rounded-tr-[5rem] rounded-bl-[5rem] overflow-hidden shadow-lg mt-4 opacity-90 transition-transform duration-700 hover:-translate-y-2">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] hover:scale-110"
              style={{
                backgroundImage: `url(${data?.rightImage ? `${IMAGE_BASE_URL}${data.rightImage}` : enquiry1})`,
              }}
            ></div>
            <div className="absolute inset-0 bg-[#4A3B2A]/5 mix-blend-multiply"></div>
          </div>

          {/* Front Image - Main Focus */}
          <div className="relative z-10 w-full md:w-3/4 lg:w-[70%] aspect-[4/5] rounded-tl-[5rem] rounded-br-[5rem] overflow-hidden shadow-[0_30px_60px_rgba(74,59,42,0.15)] md:border-[10px] border-white ml-auto lg:mr-0 lg:mt-8 transition-transform duration-700 hover:-translate-y-2">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[15s] hover:scale-110"
              style={{
                backgroundImage: `url(${data?.leftImage ? `${IMAGE_BASE_URL}${data.leftImage}` : enquiry2})`,
              }}
            ></div>
            {/* Very subtle inward shadow for depth */}
            <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.1)] pointer-events-none"></div>
          </div>

          {/* Minimalist Floating Accent */}
          <div className="absolute -bottom-6 left-4 md:left-8 md:bottom-16 bg-white/80 backdrop-blur-md px-6 py-4 rounded-2xl shadow-[0_15px_40px_rgba(74,59,42,0.1)] z-20 flex items-center gap-5 border border-[#4A3B2A]/5 transform transition-transform duration-500 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-full bg-[#4A3B2A]/5 flex items-center justify-center shrink-0">
              <svg
                className="w-6 h-6 text-[#D4A373]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <p className="text-[#4A3B2A] font-bold text-[15px] leading-tight mb-1">
                Tailor Made
              </p>
              <p className="text-[#4A3B2A]/60 text-[13px] font-medium leading-tight">
                Expertly curated for you
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnquirySection;
