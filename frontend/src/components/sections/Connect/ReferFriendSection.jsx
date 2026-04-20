import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import referFriendImg from "../../../assets/connect/refer.jpg";

const ReferFriendSection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <section
      id="referral-section"
      className="py-12 md:py-16 px-4 md:px-8 bg-[#F3EFE9] relative z-10"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Image Block */}
          <div className="relative">
            <div className="relative aspect-4/5 md:aspect-[4/3] rounded-4xl overflow-hidden shadow-[0_24px_50px_rgba(74,59,42,0.10)] md:border-4 border-[#F3EFE9]">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[12s] ease-out hover:scale-105"
                style={{
                  backgroundImage: `url(${referFriendImg})`,
                }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#4A3B2A]/18 via-transparent to-transparent"></div>
            </div>

            {/* Floating small card */}
            <div className="absolute -bottom-6 left-6 md:left-8 bg-white rounded-2xl border border-[#4A3B2A]/10 shadow-[0_18px_35px_rgba(74,59,42,0.08)] px-6 py-5">
              <p className="text-[#D4A373] uppercase tracking-[0.25em] text-[10px] font-bold mb-2">
                Referral Program
              </p>
              <p className="text-[#4A3B2A] font-serif text-2xl leading-none mb-1">
                Share Payana
              </p>
              <p className="text-[#4A3B2A]/60 text-sm">
                Invite friends to travel beautifully
              </p>
            </div>
          </div>

          {/* Right Content Block */}
          <div className="pt-8 lg:pt-0">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-[1.5px] bg-[#D4A373]"></div>
              <span className="text-[#D4A373] uppercase tracking-[0.32em] font-bold text-md">
                Refer A Friend
              </span>
              <div className="w-10 h-[1.5px] bg-[#D4A373]"></div>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#4A3B2A] leading-[1.05] tracking-tight mb-4">
              Share the journey <br />
              <span className="italic font-light text-[#4A3B2A]/85">
                with someone special.
              </span>
            </h2>

            <p className="text-[#4A3B2A]/70 text-base leading-relaxed max-w-xl mb-6">
              Introduce friends and family to Payana Trails and let them
              discover travel that feels personal, thoughtful, and deeply
              memorable.
            </p>

            <div className="grid sm:grid-cols-2 gap-3 mb-6 max-w-2xl">
              <div className="rounded-[1.5rem] border border-[#4A3B2A]/10 bg-white/80 p-4">
                <p className="text-[#D4A373] uppercase tracking-[0.22em] text-[10px] font-bold mb-2">
                  Thoughtful
                </p>
                <p className="text-[#4A3B2A] font-serif text-xl leading-none mb-1">
                  Invites
                </p>
                <p className="text-[#4A3B2A]/60 text-sm leading-relaxed">
                  A refined way to introduce others to the Payana experience.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-[#4A3B2A]/10 bg-white/80 p-4">
                <p className="text-[#D4A373] uppercase tracking-[0.22em] text-[10px] font-bold mb-2">
                  Exclusive
                </p>
                <p className="text-[#4A3B2A] font-serif text-xl leading-none mb-1">
                  Benefits
                </p>
                <p className="text-[#4A3B2A]/60 text-sm leading-relaxed">
                  Unlock rewards while sharing exceptional journeys with your
                  circle.
                </p>
              </div>
            </div>

            <div className="relative inline-block group">
              <button
                onClick={() =>
                  navigate("/connect/refer#referral-section", {
                    state: location.state ?? {
                      from: location.pathname,
                      section: "referral-section",
                    },
                  })
                }
                className="relative z-10 flex items-center justify-center px-8 py-4 bg-[#4A3B2A] text-[#F3EFE9] font-bold tracking-[0.2em] uppercase text-sm border border-[#4A3B2A] transition-all duration-500 overflow-hidden"
              >
                <span className="absolute inset-0 bg-[#795939] transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                <span className="relative z-20 flex items-center gap-4 group-hover:text-[#F3EFE9] transition-colors duration-500">
                  Explore Referral Program
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
              </button>
              {/* Decorative off-center outline */}
              <div className="absolute inset-0 border border-[#4A3B2A]/20 translate-x-3 translate-y-3 z-0 transition-transform duration-500 group-hover:translate-x-4 group-hover:translate-y-4"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReferFriendSection;
