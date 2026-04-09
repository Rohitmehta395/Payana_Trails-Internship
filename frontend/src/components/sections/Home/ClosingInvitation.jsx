import React from "react";
import closingImg from "../../../assets/Home/ClosingInvitation/closing-invitation.webp";
import BrownBtn from "../../common/buttons/BrownBtn";

// Importing React Icons
import { FiMail, FiPhone } from "react-icons/fi";

const ClosingInvitation = () => {
  return (
    <section className="bg-[#F3EFE9] w-full py-8 sm:py-12 lg:py-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* 1. Image Section - Restored your original styling */}
          <div className="w-full lg:w-1/2 shrink-0 p-2 sm:p-4">
            {/* 1a. Container to anchor the overlay, shadow, and hover effect */}
            <div
              className="relative border-[8px] border-[#4A3B2A] rounded-[24px] 
              overflow-hidden /* Ensures overlay stays in bounds */
              shadow-[8px_8px_0px_rgba(74,59,42,0.6)] 
              hover:shadow-[16px_16px_0px_rgba(74,59,42,0.4)] 
              hover:-translate-y-2 hover:-translate-x-2 hover:scale-[1.02]
              transition-all duration-500 ease-out"
            >
              {/* 1b. The actual image */}
              <img
                src={closingImg}
                alt="Traveler walking towards sunrise"
                className="w-full h-auto object-cover 
                sepia-[0.2] hover:sepia-0 /* Kept original effect */"
              />

              {/* 1c. Color/Opacity Overlay (using pseudo-element style) */}
              <div className="absolute inset-0 bg-[#4A3B2A] opacity-20 transition-opacity duration-300 hover:opacity-10 pointer-events-none"></div>
            </div>
          </div>

          {/* 2. Text Section */}
          <div className="w-full lg:w-1/2 flex flex-col items-center text-center">
            {/* Elegant Quote */}
            <p className="text-[#4A3B2A] text-[18px] sm:text-[20px] font-serif italic mb-4 opacity-90">
              "Travel, when designed with care, becomes a memory."
            </p>

            {/* Main Heading */}
            <h3 className="text-[#4A3B2A] text-[28px] sm:text-[36px] font-serif font-bold leading-tight mb-4">
              Let's design a journey that’s truly yours.
            </h3>

            {/* Supporting Paragraph */}
            <p className="text-[#4A3B2A]/80 text-[16px] sm:text-[18px] font-sans font-normal leading-relaxed mb-8 max-w-lg">
              Each journey is thoughtfully crafted and tailored to suit you,
              even beyond the trails or destinations listed on our website.
            </p>

            {/* Action Button */}
            <BrownBtn
              text="Connect With Us &rarr;"
              className="px-8 py-3 sm:px-10 sm:py-4 text-[16px] sm:text-[18px] font-medium shadow-md hover:shadow-lg w-fit mb-10 transition-all duration-300"
            />

            {/* Contact Section - Fully Responsive with React Icons */}
            <div className="flex flex-col items-center gap-4 border-t border-[#4A3B2A]/10 pt-8 w-full">
              <p className="text-[#4A3B2A]/70 text-[13px] sm:text-[14px] uppercase tracking-widest font-sans font-semibold">
                Prefer speaking directly?
              </p>

              {/* flex-col on mobile, flex-row on larger screens */}
              <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 sm:gap-6 w-full">
                {/* Email */}
                <a
                  href="mailto:info@payanatrails.com"
                  className="flex items-center gap-2 text-[#4A3B2A] hover:text-[#7A634A] transition-colors duration-300 font-sans text-[14px] sm:text-[16px] font-medium whitespace-nowrap"
                >
                  <FiMail className="w-[18px] h-[18px]" strokeWidth="2.5" />
                  info@payanatrails.com
                </a>

                {/* Vertical Divider - Hidden on mobile, visible on sm+ */}
                <span className="hidden sm:inline text-[#4A3B2A]/30 font-light">
                  |
                </span>

                {/* Phone/WhatsApp */}
                <a
                  href="tel:+918660460512"
                  className="flex items-center gap-2 text-[#4A3B2A] hover:text-[#7A634A] transition-colors duration-300 font-sans text-[14px] sm:text-[16px] font-medium whitespace-nowrap"
                >
                  <FiPhone className="w-[18px] h-[18px]" strokeWidth="2.5" />
                  +91 8660460512
                  <span className="font-normal text-[13px] opacity-70 ml-1 hidden sm:inline">
                    (Call/WhatsApp)
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClosingInvitation;
