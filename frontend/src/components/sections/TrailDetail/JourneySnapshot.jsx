import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  LuMapPin,
  LuPalette,
  LuLeaf,
  LuSun,
  LuFileText,
  LuMap,
  LuTag,
} from "react-icons/lu";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const JourneySnapshot = ({ trail }) => {
  const snapshotItems = useMemo(() => {
    const items = [
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

    if (trail.pricing) {
      items.push({
        icon: LuTag,
        label: "Pricing",
        value: trail.pricing,
      });
    }

    return items;
  }, [trail]);

  // Transform trail route into visual nodes/steps
  const routeSteps = useMemo(() => {
    if (!trail.trailRoute) return [];
    // Split by arrows (→, ->, >), comma, or separated hyphens
    return trail.trailRoute
      .split(/\s*→\s*|\s*->\s*|\s*>\s*|\s*,\s*|\s+-\s+/)
      .filter((step) => step.trim() !== "");
  }, [trail.trailRoute]);

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="w-full overflow-hidden rounded-3xl border border-[#4A3B2A]/10 bg-white shadow-[0_8px_30px_rgba(74,59,42,0.04)]"
    >
      {/* Top Section: Standard Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y divide-[#4A3B2A]/5 lg:flex lg:flex-row lg:divide-x lg:divide-y-0 relative z-10 border-b border-[#4A3B2A]/5">
        {snapshotItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              variants={itemVariants}
              key={item.label}
              className={`group flex flex-1 flex-col items-center justify-center p-6 sm:p-8 text-center transition-all duration-500 hover:bg-[#F3EFE9]/50 ${
                idx === snapshotItems.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div className="relative mb-4 flex items-center justify-center">
                <div className="absolute inset-0 scale-50 rounded-full bg-[#4A3B2A]/0 transition-all duration-500 group-hover:scale-150 group-hover:bg-[#4A3B2A]/5 blur-md" />
                <Icon
                  className="relative z-10 h-7 w-7 text-[#D4A373] transition-all duration-500 group-hover:-translate-y-1 group-hover:scale-110 group-hover:text-[#4A3B2A]"
                  strokeWidth={1.5}
                />
              </div>

              <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[#4A3B2A]/40 transition-colors duration-300 group-hover:text-[#4A3B2A]/70">
                {item.label}
              </p>

              <p className="text-base font-semibold text-[#3D2C20] md:text-[1.05rem]">
                {item.value}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Improved Bottom Section: Visual Trail Route Timeline */}
      {routeSteps.length > 0 && (
        <motion.div 
          variants={itemVariants}
          className="group relative bg-[#F3EFE9]/50 p-8 sm:p-12 transition-colors duration-500 hover:bg-[#F3EFE9]"
        >
          {/* Header */}
          <div className="mb-12 flex flex-col items-center justify-center gap-4 text-center sm:mb-16 sm:flex-row sm:justify-between sm:text-left">
            <div className="flex flex-col">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#D4A373]">
                Trail Route
              </p>
              <h3 className="font-serif text-3xl font-medium text-[#4A3B2A]">
                Journey Sequence
              </h3>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#4A3B2A]/5 transition-transform duration-500 group-hover:rotate-12 group-hover:bg-white group-hover:scale-110 group-hover:shadow-sm">
              <LuMap
                className="h-6 w-6 shrink-0 text-[#4A3B2A]/40 transition-colors duration-300 group-hover:text-[#D4A373]"
                strokeWidth={1.5}
              />
            </div>
          </div>

          {/* Visual Stepper/Timeline */}
          <div className="relative mx-auto w-full max-w-4xl">
            {/* Desktop Horizontal View */}
            <div className="hidden sm:flex items-start justify-between relative">
               {/* Background connection line */}
               <div className="absolute left-[5%] top-[5px] h-[2px] w-[90%] bg-[#4A3B2A]/10 z-0 origin-left" />
               
               {routeSteps.map((step, index) => (
                 <motion.div 
                   key={step + index} 
                   className="relative z-10 flex flex-col items-center flex-1 px-4"
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.5, delay: index * 0.15 }}
                   viewport={{ once: true }}
                 >
                   {/* Node Dot */}
                   <div className="mb-5 flex h-3 w-3 items-center justify-center rounded-full bg-[#D4A373] ring-[6px] ring-[#F3EFE9] transition-all duration-300 group-hover:ring-white hover:scale-150 hover:bg-[#4A3B2A] hover:shadow-[0_0_20px_rgba(74,59,42,0.15)] cursor-pointer" />
                   {/* Location Name */}
                   <p className="text-center text-sm font-semibold tracking-wide text-[#4A3B2A] md:text-[15px]">
                     {step}
                   </p>
                 </motion.div>
               ))}
            </div>

            {/* Mobile Vertical View */}
            <div className="flex flex-col sm:hidden relative ml-2">
              {/* Background connection line */}
              <div className="absolute left-[5px] top-2 bottom-4 w-[2px] bg-[#4A3B2A]/10 z-0 origin-top" />
              
              {routeSteps.map((step, index) => (
                 <motion.div 
                   key={step + index} 
                   className="relative z-10 flex items-center gap-6 mb-8 last:mb-0"
                   initial={{ opacity: 0, x: -20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   transition={{ duration: 0.5, delay: index * 0.15 }}
                   viewport={{ once: true }}
                 >
                   {/* Node Dot */}
                   <div className="flex h-3 w-3 shrink-0 items-center justify-center rounded-full bg-[#D4A373] ring-[5px] ring-[#F3EFE9]" />
                   {/* Location Name */}
                   <p className="text-left text-base font-semibold tracking-wide text-[#4A3B2A]">
                     {step}
                   </p>
                 </motion.div>
               ))}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default JourneySnapshot;
