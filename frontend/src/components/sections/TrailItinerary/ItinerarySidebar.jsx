import React from "react";
import { Compass, Trees, Home, Sparkles, PlaneLanding, PlaneTakeoff } from "lucide-react";

const ItinerarySidebar = ({
  itineraryDays,
  transformed,
  openDay,
  focusDay,
  scrollToId,
}) => {
  return (
    <aside className="h-max lg:sticky lg:top-24">
      <div className="rounded-[32px] border border-[#E5D7C5] bg-[#FCF8F2] p-6 shadow-[0_18px_40px_rgba(74,59,42,0.05)]">
        <div className="text-center">
          <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-[#8B6B50]">
            Journey notes
          </p>

          <h2 className="mt-4 font-serif text-[clamp(1.5rem,5vw,2rem)] leading-tight text-[#4A3B2A] break-words">
            Follow the trail, one chapter at a time.
          </h2>
        </div>

        <div className="mt-6 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="flex flex-col items-center text-center rounded-2xl border border-[#E5D7C5] bg-white p-3 md:p-4">
            <Compass className="h-3.5 w-3.5 md:h-4 md:w-4 text-[#8B6B50]" />
            <p className="mt-2 md:mt-3 text-[9px] md:text-[10px] uppercase tracking-[0.18em] text-[#8B6B50]">
              Route
            </p>
            <p className="mt-1 text-xs md:text-sm font-medium text-[#4A3B2A]">Day by day</p>
          </div>

          <div className="flex flex-col items-center text-center rounded-2xl border border-[#E5D7C5] bg-white p-3 md:p-4">
            <Trees className="h-3.5 w-3.5 md:h-4 md:w-4 text-[#8B6B50]" />
            <p className="mt-2 md:mt-3 text-[9px] md:text-[10px] uppercase tracking-[0.18em] text-[#8B6B50]">
              Stops
            </p>
            <p className="mt-1 text-xs md:text-sm font-medium text-[#4A3B2A]">
              Curated moments
            </p>
          </div>

          <div className="flex flex-col items-center text-center rounded-2xl border border-[#E5D7C5] bg-white p-3 md:p-4 xs:col-span-2 sm:col-span-1">
            <Home className="h-3.5 w-3.5 md:h-4 md:w-4 text-[#8B6B50]" />
            <p className="mt-2 md:mt-3 text-[9px] md:text-[10px] uppercase tracking-[0.18em] text-[#8B6B50]">
              Comfort
            </p>
            <p className="mt-1 text-xs md:text-sm font-medium text-[#4A3B2A]">
              Stay + meals
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="mb-3 text-[14px] font-semibold uppercase tracking-[0.16em] text-[#8B6B50]">
            Browse the days
          </p>

          <div className="max-h-[none] lg:max-h-[50vh] space-y-3 overflow-auto pr-1">
            {itineraryDays.map((day, index) => (
              <button
                key={`${day.title}-${index}`}
                type="button"
                onClick={() => focusDay(index)}
                className={`w-full rounded-2xl border px-4 py-3 text-left transition-all duration-300 ${
                  openDay === index
                    ? "border-[#8B6B50]/30 bg-white shadow-[0_12px_30px_rgba(74,59,42,0.06)]"
                    : "border-[#E5D7C5] bg-[#FAF7F2] hover:border-[#8B6B50]/25 hover:bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-all ${
                      openDay === index
                        ? "bg-[#4A3B2A] text-[#FDFBF7]"
                        : "bg-[#FDFBF7] text-[#8B6B50]"
                    }`}
                  >
                    {index + 1}
                  </span>

                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[#8B6B50]">
                      Day {index + 1}
                    </p>
                    <p className="truncate text-sm font-medium text-[#4A3B2A]">
                      {day.title}
                    </p>
                  </div>
                </div>
              </button>
            ))}

            {/* Additional Shortcuts */}
            {transformed.optionalExperiences?.some((ex) => ex?.trim()) && (
              <button
                type="button"
                onClick={() => scrollToId("itinerary-optional")}
                className="w-full rounded-2xl border border-[#E5D7C5] bg-[#FAF7F2] px-4 py-3 text-left transition-all duration-300 hover:border-[#8B6B50]/25 hover:bg-white"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#FDFBF7] text-[#8B6B50]">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[#8B6B50]">
                      Suggested
                    </p>
                    <p className="truncate text-sm font-medium text-[#4A3B2A]">
                      Optional Experiences
                    </p>
                  </div>
                </div>
              </button>
            )}

            {(transformed.flights?.domesticIntro?.trim() ||
              transformed.flights?.domesticLines?.some((l) => l?.trim())) && (
              <button
                type="button"
                onClick={() => scrollToId("itinerary-domestic")}
                className="w-full rounded-2xl border border-[#E5D7C5] bg-[#FAF7F2] px-4 py-3 text-left transition-all duration-300 hover:border-[#8B6B50]/25 hover:bg-white"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#FDFBF7] text-[#8B6B50]">
                    <PlaneLanding className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[#8B6B50]">
                      Internal
                    </p>
                    <p className="truncate text-sm font-medium text-[#4A3B2A]">
                      Domestic Flights · Trains · Cruises
                    </p>
                  </div>
                </div>
              </button>
            )}

            {(transformed.flights?.internationalIntro?.trim() ||
              transformed.flights?.arrivalAirport?.trim() ||
              transformed.flights?.departureAirport?.trim()) && (
              <button
                type="button"
                onClick={() => scrollToId("itinerary-international")}
                className="w-full rounded-2xl border border-[#E5D7C5] bg-[#FAF7F2] px-4 py-3 text-left transition-all duration-300 hover:border-[#8B6B50]/25 hover:bg-white"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#FDFBF7] text-[#8B6B50]">
                    <PlaneTakeoff className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[#8B6B50]">
                      Logistics
                    </p>
                    <p className="truncate text-sm font-medium text-[#4A3B2A]">
                      International Flights
                    </p>
                  </div>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ItinerarySidebar;
