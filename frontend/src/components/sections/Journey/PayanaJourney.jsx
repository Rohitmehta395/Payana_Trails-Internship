import React, { useState, useEffect } from "react";

export default function PayanaJourneyFocused() {
  const [mounted, setMounted] = useState(false);
  const [isHoveringLandscape, setIsHoveringLandscape] = useState(false);

  useEffect(() => {
    // Triggers the initial entrance animation
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative w-full min-h-[85vh] flex items-center justify-center bg-[#F3EFE9] text-[#4A3B2A] px-6 py-24 md:px-12 font-sans overflow-hidden">
      {/* Background Image Container */}
      <div
        className={`absolute inset-0 pointer-events-none transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isHoveringLandscape ? "opacity-80 scale-105" : "opacity-30 scale-100"
        }`}
      >
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000"
          alt="Cinematic landscape"
          className="w-full h-full object-cover"
        />
        {/* Protective Overlay: Keeps text legible when image opacity increases */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#F3EFE9]/80 via-[#F3EFE9]/40 to-transparent"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center gap-12">
        {/* Staggered Quote */}
        <div className="flex flex-col gap-3 md:gap-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight">
            <span className="block overflow-hidden pb-1">
              <span
                className={`block transition-transform duration-[1200ms] delay-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${mounted ? "translate-y-0 opacity-100" : "translate-y-[110%] opacity-0"}`}
              >
                "Every Payana journey
              </span>
            </span>
            <span className="block overflow-hidden pb-1 text-[#4A3B2A]/70 italic font-light">
              <span
                className={`block transition-transform duration-[1200ms] delay-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${mounted ? "translate-y-0 opacity-100" : "translate-y-[110%] opacity-0"}`}
              >
                is carefully designed
              </span>
            </span>
          </h2>

          <div className="overflow-hidden pt-4 md:pt-6">
            <p
              className={`text-lg md:text-2xl lg:text-3xl font-sans font-light leading-relaxed max-w-2xl mx-auto transition-transform duration-[1200ms] delay-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${mounted ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}
            >
              to balance exploration with comfort and time to absorb the{" "}
              {/* Interactive Hover Word */}
              <span
                className="relative inline-block cursor-crosshair text-[#4A3B2A] font-medium border-b border-[#4A3B2A]/40 hover:border-[#4A3B2A] transition-colors duration-300"
                onMouseEnter={() => setIsHoveringLandscape(true)}
                onMouseLeave={() => setIsHoveringLandscape(false)}
              >
                landscape.
              </span>
              "
            </p>
          </div>
        </div>

        {/* New Button Style: Outlined Pill that fills on hover */}
        <div
          className={`pt-8 transition-all duration-1000 delay-[800ms] ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <a
            href="/payana-way"
            className="group relative inline-flex items-center gap-4 px-8 py-4 border border-[#4A3B2A] text-[#4A3B2A] hover:bg-[#4A3B2A] hover:text-[#F3EFE9] uppercase tracking-[0.2em] text-xs font-semibold rounded-full transition-all duration-500 overflow-hidden"
          >
            <span>Discover The Payana Way</span>
            <span className="transform transition-transform duration-500 group-hover:translate-x-1">
              &rarr;
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
