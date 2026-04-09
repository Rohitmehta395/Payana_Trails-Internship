import React, { useMemo } from "react";
import {
  LuMapPin,
  LuPalette,
  LuLeaf,
  LuSun,
  LuFileText,
  LuMap,
} from "react-icons/lu";

const JourneySnapshot = ({ trail }) => {
  const snapshotItems = useMemo(() => {
    return [
      {
        icon: LuMapPin,
        label: "Destination",
        value: trail.trailDestination || "Multiple locations",
      },
      {
        icon: LuPalette,
        label: "Theme",
        value: trail.trailTheme || "Curated",
      },
      {
        icon: LuLeaf,
        label: "Comfort",
        value: trail.comfortLevel || "Balanced",
      },
      {
        icon: LuSun,
        label: "Best Season",
        value: trail.bestTimeToTravel || "All year",
      },
      {
        icon: LuFileText,
        label: "Visa",
        value: trail.visa || "Check requirements",
      },
    ];
  }, [trail]);

  // Transform trail route into visual nodes/steps
  const routeSteps = useMemo(() => {
    if (!trail.trailRoute) return [];
    // Assume route is string separated by '>' or '->' or ',' - parse safely
    return trail.trailRoute
      .split(/\s*>\s*|\s*,\s*/)
      .filter((step) => step.trim() !== "");
  }, [trail.trailRoute]);

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-white/5 bg-[#4A3B2A] shadow-xl">
      {/* Top Section: Standard Items */}
      <div className="flex flex-col divide-y divide-white/10 lg:flex-row lg:divide-x lg:divide-y-0">
        {snapshotItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="group flex flex-1 flex-col items-center justify-center p-6 text-center transition-colors duration-300 hover:bg-white/5"
            >
              {/* Icon */}
              <Icon
                className="mb-3 h-6 w-6 text-[#F3EFE9] transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110"
                strokeWidth={1.5}
              />

              {/* Label */}
              <p className="mb-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-[#F3EFE9]/60">
                {item.label}
              </p>

              {/* Value */}
              <p className="text-sm font-semibold text-[#F3EFE9] md:text-base">
                {item.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Improved Bottom Section: Visual Trail Route Timeline */}
      {routeSteps.length > 0 && (
        <div className="group border-t border-white/10 bg-transparent p-6 transition-colors duration-300 hover:bg-white/5 sm:p-10">
          {/* Header */}
          <div className="mb-8 flex flex-col items-center justify-center gap-3 text-center sm:mb-10 sm:flex-row sm:justify-between sm:text-left">
            <div className="flex flex-col">
              <p className="mb-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-[#F3EFE9]/60">
                Trail Route
              </p>
              <h3 className="font-serif text-2xl font-light text-[#F3EFE9]">
                Journey Sequence
              </h3>
            </div>
            <LuMap
              className="h-10 w-10 shrink-0 text-[#F3EFE9]/30 transition-transform duration-300 group-hover:scale-110 group-hover:text-[#F3EFE9]/50"
              strokeWidth={1}
            />
          </div>

          {/* Visual Stepper/Timeline */}
          <div className="flex flex-col items-center sm:block">
            {/* Timeline wrapper: grid/flex combination for clean layout */}
            <div className="grid w-full grid-cols-1 gap-y-4 sm:flex sm:items-start sm:gap-x-0 sm:gap-y-0">
              {routeSteps.map((step, index) => {
                const isLast = index === routeSteps.length - 1;

                return (
                  <div
                    key={`${step}-${index}`}
                    className="flex flex-1 items-start gap-x-4 sm:relative sm:block sm:gap-x-0"
                  >
                    {/* Node & Connector Wrapper */}
                    <div className="flex flex-col items-center sm:flex-row sm:items-center">

                      {/* Connector Line (visible except last item) */}
                      {!isLast && (
                        <>
                          {/* Vertical line for mobile */}
                          <div className="h-10 w-[2px] bg-[#F3EFE9]/10 transition-colors duration-300 group-hover:bg-[#F3EFE9]/20 sm:hidden" />
                          {/* Horizontal line for desktop (positioned absolutely) */}
                          <div className="hidden flex-grow h-[2px] bg-[#F3EFE9]/10 transition-colors duration-300 group-hover:bg-[#F3EFE9]/20 sm:block" />
                        </>
                      )}
                    </div>

                    {/* Content (City/Location Name) */}
                    <div className="flex-grow pt-1 text-left sm:absolute sm:left-[-1.25rem] sm:right-[-1.25rem] sm:top-[-2.5rem] sm:pt-0 sm:text-center">
                      <p className="text-sm font-medium leading-tight text-[#F3EFE9] transition-transform duration-300 group-hover:-translate-y-px md:text-base">
                        {step}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JourneySnapshot;
