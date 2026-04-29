import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BrownBtn from "../../common/buttons/BrownBtn";

export default function PayanaJourneyFocused() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative w-full min-h-[85vh] flex items-center justify-center px-6 py-24 md:px-12 font-sans overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000"
          alt="Cinematic landscape"
          className="w-full h-full object-cover"
        />

        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-[#4A3B2A]/20" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center gap-12 text-[#F3EFE9] drop-shadow-[0_3px_8px_rgba(74,59,42,0.85)]">
        <div className="flex flex-col gap-3 md:gap-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight">
            <span
              className={`block transition-all duration-[1200ms] delay-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                mounted
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              "Every Payana journey
            </span>

            <span
              className={`block italic font-light transition-all duration-[1200ms] delay-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                mounted ? "translate-y-0 opacity-90" : "translate-y-8 opacity-0"
              }`}
            >
              is carefully designed
            </span>
          </h2>

          <p
            className={`text-lg md:text-2xl lg:text-3xl font-sans font-semibold leading-relaxed max-w-2xl mx-auto pt-4 md:pt-6 transition-all duration-[1200ms] delay-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            to balance exploration with comfort and time to absorb the{" "}
            <span className="inline-block border-b border-[#F3EFE9]/60">
              landscape.
            </span>
            "
          </p>
        </div>

        {/* Call to Action Button */}
        <div className="flex justify-center mt-12 md:mt-16">
          <Link to="/payana-way">
            <BrownBtn
              className="group"
              text={
                <span className="flex items-center gap-2 p-2 uppercase tracking-[0.2em] text-xs font-semibold">
                  Discover The Payana Way
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              }
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
