import React from "react";
import { Link } from "react-router-dom";

const GiftJourneySection = ({ heroImgs }) => {
  return (
    <section
      id="gift-section"
      className="py-4 md:py-16 px-4 md:px-8 bg-[#F3EFE9] relative z-10 border-t border-[#4A3B2A]/5"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left Content Block */}
          <div className="order-2 lg:order-1 pt-8 lg:pt-0 pl-0 lg:pl-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-[1.5px] bg-[#D4A373]"></div>
              <span className="text-[#D4A373] uppercase tracking-[0.32em] font-bold text-md">
                A Gift to Remember
              </span>
              <div className="w-10 h-[1.5px] bg-[#D4A373]"></div>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#4A3B2A] leading-[1.05] tracking-tight mb-6">
              Gift an extraordinary <br />
              <span className="italic font-light text-[#4A3B2A]/85">
                experience.
              </span>
            </h2>

            <p className="text-[#4A3B2A]/70 text-lg leading-relaxed max-w-xl mb-10">
              Surprise your loved ones with the gift of a lifetime. Whether it's
              a curated journey or travel credits, give them an adventure they
              will cherish forever.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-10 max-w-2xl">
              <div className="rounded-[1.5rem] border border-[#4A3B2A]/10 bg-white/80 p-5">
                <p className="text-[#D4A373] uppercase tracking-[0.22em] text-[10px] font-bold mb-2">
                  Flexible
                </p>
                <p className="text-[#4A3B2A] font-serif text-2xl leading-none mb-2">
                  Credits
                </p>
                <p className="text-[#4A3B2A]/60 text-sm leading-relaxed">
                  Allow them to choose their own perfect destination.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-[#4A3B2A]/10 bg-white/80 p-5">
                <p className="text-[#D4A373] uppercase tracking-[0.22em] text-[10px] font-bold mb-2">
                  Curated
                </p>
                <p className="text-[#4A3B2A] font-serif text-2xl leading-none mb-2">
                  Journeys
                </p>
                <p className="text-[#4A3B2A]/60 text-sm leading-relaxed">
                  Gift a fully planned, breathtaking signature trail.
                </p>
              </div>
            </div>

            <div className="relative inline-block group">
              <Link
                to="/connect/gift-a-journey"
                className="relative z-10 flex items-center justify-center px-10 py-5 bg-[#4A3B2A] text-white font-bold tracking-[0.2em] uppercase text-sm border border-[#4A3B2A] transition-all duration-500 overflow-hidden shadow-lg"
              >
                <span className="absolute inset-0 bg-[#795939] transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                <span className="relative z-20 flex items-center gap-4 group-hover:text-white transition-colors duration-500">
                  Gift a Journey
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
              <div className="absolute inset-0 border border-[#D4A373]/40 translate-x-3 translate-y-3 z-0 transition-transform duration-500 group-hover:translate-x-4 group-hover:translate-y-4"></div>
            </div>
          </div>

          {/* Right Image Block */}
          <div className="order-1 lg:order-2 relative flex justify-end">
            <div className="relative w-full lg:w-[90%] aspect-[4/5] md:aspect-[5/6] rounded-[2rem] overflow-hidden shadow-[0_24px_50px_rgba(74,59,42,0.15)] md:border-[10px] border-[#F3EFE9]">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[12s] ease-out hover:scale-105"
                style={{
                  backgroundImage: `url(${heroImgs?.[0]?.desktop || "https://images.unsplash.com/photo-1512418490979-9ce792e5e453?q=80&w=2000&auto=format&fit=crop"})`,
                }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#4A3B2A]/25 via-transparent to-transparent"></div>
            </div>

            {/* Floating small card */}
            <div className="absolute -bottom-6 right-6 md:right-auto md:-left-8 bg-white text-[#4A3B2A] rounded-2xl border border-[#D4A373]/20 shadow-[0_18px_35px_rgba(74,59,42,0.2)] px-6 py-5">
              <p className="text-[#D4A373] uppercase tracking-[0.25em] text-[10px] font-bold mb-2">
                Memorable
              </p>
              <p className="text-[#4A3B2A] font-serif text-2xl leading-none mb-1">
                Surprises
              </p>
              <div className="flex items-center gap-2 text-[#4A3B2A]/50 text-sm mt-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                  />
                </svg>
                <span>Gift beautifully</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GiftJourneySection;
