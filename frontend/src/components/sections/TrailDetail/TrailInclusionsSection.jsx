import React from "react";
import { motion } from "framer-motion";
import {
  LuCheck,
  LuCompass,
  LuShield,
  LuSparkles,
  LuStar,
  LuX,
  LuArrowRight,
  LuFileText,
} from "react-icons/lu";
import { useNavigate, useLocation } from "react-router-dom";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
};

const floatingSymbols = [
  {
    symbol: "+",
    className: "left-[6%] top-[10%] text-2xl text-[#A18160]/30",
    distance: 16,
    duration: 8,
    rotate: 8,
  },
  {
    symbol: "*",
    className: "left-[22%] top-[78%] text-xl text-[#7A8F6C]/25",
    distance: -14,
    duration: 9,
    rotate: -10,
  },
  {
    symbol: "o",
    className: "left-[46%] top-[18%] text-lg text-[#A18160]/22",
    distance: 12,
    duration: 7,
    rotate: 6,
  },
  {
    symbol: "+",
    className: "right-[19%] top-[12%] text-xl text-[#B98A72]/30",
    distance: -15,
    duration: 10,
    rotate: -6,
  },
  {
    symbol: "*",
    className: "right-[8%] top-[56%] text-2xl text-[#7A8F6C]/24",
    distance: 18,
    duration: 11,
    rotate: 10,
  },
  {
    symbol: "o",
    className: "right-[28%] bottom-[10%] text-lg text-[#A18160]/22",
    distance: -11,
    duration: 8,
    rotate: -8,
  },
];

const sectionChips = [];

const sanitizeItems = (items = []) =>
  items
    .map((item) => String(item || "").trim())
    .filter(Boolean);

const cardConfigs = {
  included: {
    title: "What's Included",
    eyebrow: "Already covered on the trail",
    description:
      "The comforts, support, and curated touches already built into the experience.",
    Icon: LuCheck,
    cardClassName:
      "border-[#4A3B2A]/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,242,233,0.98)_100%)] shadow-[0_18px_42px_rgba(74,59,42,0.12)]",
    glowClassName: "bg-[#A18160]/35",
    iconWrapClassName:
      "border-[#4A3B2A]/15 bg-[#4A3B2A] text-[#F8F2E9] shadow-[0_14px_30px_rgba(74,59,42,0.24)]",
    eyebrowClassName: "text-[#6B513C]",
    titleClassName: "text-[#2F2319]",
    bodyClassName: "text-[#5E4938]",
    chipClassName:
      "border-[#4A3B2A]/12 bg-white/75 text-[#4A3B2A] shadow-[0_8px_18px_rgba(74,59,42,0.08)]",
    itemClassName:
      "border-[#4A3B2A]/10 bg-white/78 text-[#2F2319] shadow-[0_12px_28px_rgba(74,59,42,0.08)]",
    itemIconClassName: "bg-[#4A3B2A] text-[#F8F2E9]",
    itemGlowClassName: "bg-[#A18160]/30",
    fadeClassName: "from-[#F8F2E9]",
    scrollThumbClassName: "[&::-webkit-scrollbar-thumb]:bg-[#4A3B2A]/15 hover:[&::-webkit-scrollbar-thumb]:bg-[#4A3B2A]/25",
    scrollIndicatorClassName: "bg-[#4A3B2A]/5 text-[#6B513C]",
  },
  excluded: {
    title: "What's Not Included",
    eyebrow: "Best planned separately",
    description:
      "The extras you may want to carry, arrange, or budget for before the journey begins.",
    Icon: LuX,
    cardClassName:
      "border-[#4A3B2A]/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,242,233,0.98)_100%)] shadow-[0_18px_42px_rgba(74,59,42,0.12)]",
    glowClassName: "bg-[#A18160]/35",
    iconWrapClassName:
      "border-[#4A3B2A]/15 bg-[#4A3B2A] text-[#F8F2E9] shadow-[0_14px_30px_rgba(74,59,42,0.24)]",
    eyebrowClassName: "text-[#6B513C]",
    titleClassName: "text-[#2F2319]",
    bodyClassName: "text-[#5E4938]",
    chipClassName:
      "border-[#4A3B2A]/12 bg-white/75 text-[#4A3B2A] shadow-[0_8px_18px_rgba(74,59,42,0.08)]",
    itemClassName:
      "border-[#4A3B2A]/10 bg-white/78 text-[#2F2319] shadow-[0_12px_28px_rgba(74,59,42,0.08)]",
    itemIconClassName: "bg-[#4A3B2A] text-[#F8F2E9]",
    itemGlowClassName: "bg-[#A18160]/30",
    fadeClassName: "from-[#F8F2E9]",
    scrollThumbClassName: "[&::-webkit-scrollbar-thumb]:bg-[#4A3B2A]/15 hover:[&::-webkit-scrollbar-thumb]:bg-[#4A3B2A]/25",
    scrollIndicatorClassName: "bg-[#4A3B2A]/5 text-[#6B513C]",
  },
};

const inclusionCards = [
  {
    key: "included",
    type: "included",
    chips: [],
  },
  {
    key: "excluded",
    type: "excluded",
    chips: [],
  },
];

const InclusionCard = ({ type, items }) => {
  const config = cardConfigs[type];
  const {
    title,
    eyebrow,
    description,
    Icon,
    cardClassName,
    glowClassName,
    iconWrapClassName,
    eyebrowClassName,
    titleClassName,
    bodyClassName,
    chipClassName,
    itemClassName,
    itemIconClassName,
    itemGlowClassName,
    fadeClassName,
    scrollThumbClassName,
    scrollIndicatorClassName,
  } = config;

  const card = inclusionCards.find((entry) => entry.type === type);

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -6 }}
      className={`group relative isolate overflow-hidden rounded-[2rem] border p-6 md:p-7 ${cardClassName}`}
    >
      <div
        className={`absolute -left-12 top-12 h-32 w-32 rounded-full blur-3xl ${glowClassName}`}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_34%)]" />
      <div className="absolute inset-0 opacity-[0.14] [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:22px_22px]" />
      <div className="relative">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <motion.div
              animate={{ y: [0, -4, 0], rotate: [0, 4, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.35rem] border ${iconWrapClassName}`}
            >
              <Icon className="h-6 w-6" />
            </motion.div>

            <div>
              <p
                className={`text-[11px] font-semibold uppercase tracking-[0.28em] ${eyebrowClassName}`}
              >
                {eyebrow}
              </p>
              <h3
                className={`mt-2 font-serif text-[1.5rem] leading-tight ${titleClassName} md:text-[1.75rem]`}
              >
                {title}
              </h3>
            </div>
          </div>

        </div>

        <p className={`mt-5 max-w-lg text-sm leading-7 md:text-[15px] ${bodyClassName}`}>
          {description}
        </p>

        {card.chips.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2.5">
            {card.chips.map((chip) => (
              <span
                key={`${type}-${chip}`}
                className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-medium ${chipClassName}`}
              >
                <LuStar className="h-3.5 w-3.5" />
                {chip}
              </span>
            ))}
          </div>
        )}

        <div className="relative mt-7">
          <div className={`max-h-[480px] -mx-2 space-y-3 overflow-y-auto px-2 pb-24 pt-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full ${scrollThumbClassName}`}>
            {items.length > 0 ? (
              items.map((item, index) => (
                <motion.div
                  key={`${type}-${index}-${item}`}
                  variants={itemVariants}
                  whileHover={{ x: 6 }}
                  className={`relative overflow-hidden rounded-[1.35rem] border p-4 md:p-5 ${itemClassName}`}
                >
                  <div
                    className={`absolute -right-5 top-1/2 h-20 w-20 -translate-y-1/2 rounded-full blur-2xl ${itemGlowClassName}`}
                  />
                  <div className="relative flex items-start gap-4">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[1rem] ${itemIconClassName}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm leading-6 md:text-[15px]">
                        {item}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                variants={itemVariants}
                className={`rounded-[1.35rem] border border-dashed p-5 text-sm leading-6 ${itemClassName}`}
              >
                Details for this column have not been added yet.
              </motion.div>
            )}
          </div>

          {items.length > 3 && (
            <div
              className={`pointer-events-none absolute bottom-0 -left-2 right-0 flex h-28 flex-col justify-end bg-gradient-to-t to-transparent pb-0 ${fadeClassName}`}
            >
              <div className="mb-[-1px] flex justify-center">
                <span className={`animate-pulse rounded-t-lg px-4 py-1.5 text-[9px] font-bold uppercase tracking-widest backdrop-blur-md ${scrollIndicatorClassName}`}>
                  Scroll for more ↓
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const TrailInclusionsSection = ({
  includedItems = [],
  excludedItems = [],
  trailSlug,
  trailState,
  hasItinerary = false,
  isWrapped = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isHoveringEnquire, setIsHoveringEnquire] = React.useState(false);
  const [isHoveringItinerary, setIsHoveringItinerary] = React.useState(false);

  const safeIncludedItems = sanitizeItems(includedItems);
  const safeExcludedItems = sanitizeItems(excludedItems);

  const handleEnquireClick = () => {
    setTimeout(() => {
      navigate("/connect#enquiry-section", { 
        state: { 
          from: location.pathname,
          section: 'trail-essentials',
          trailName: trailState?.trailName 
        } 
      });
    }, 400);
  };

  const handleItineraryClick = () => {
    if (!trailSlug || !hasItinerary) return;
    navigate(`/trails/${trailSlug}/itinerary`, {
      state: trailState ? { trail: trailState } : undefined,
    });
  };

  return (
    <section id="trail-essentials" className={isWrapped ? "w-full" : "mx-auto w-full max-w-7xl px-6 py-8 md:px-10"}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.18 }}
        variants={containerVariants}
        className={`relative overflow-hidden ${
          isWrapped
            ? ""
            : "rounded-[2.4rem] border border-[#4A3B2A]/10 bg-[linear-gradient(135deg,#fffdf8_0%,#f7ecda_48%,#f0e1c6_100%)] shadow-[0_24px_70px_rgba(74,59,42,0.12)]"
        }`}
      >
        {!isWrapped && (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.92),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(122,143,108,0.12),transparent_30%),radial-gradient(circle_at_center_right,rgba(198,140,118,0.14),transparent_28%)]" />
            <div className="absolute inset-0 opacity-[0.16] bg-[linear-gradient(rgba(74,59,42,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(74,59,42,0.08)_1px,transparent_1px)] bg-size-[28px_28px]" />
          </>
        )}

        {!isWrapped && floatingSymbols.map((particle, index) => (
          <motion.span
            key={`${particle.symbol}-${particle.className}`}
            aria-hidden="true"
            className={`absolute font-serif ${particle.className}`}
            animate={{
              y: [0, particle.distance, 0],
              rotate: [0, particle.rotate, 0],
              opacity: [0.25, 0.7, 0.25],
              scale: [0.95, 1.08, 0.95],
            }}
            transition={{
              duration: particle.duration,
              delay: index * 0.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {particle.symbol}
          </motion.span>
        ))}

        <div className={`relative ${isWrapped ? "px-6 pt-8 pb-4 md:px-10 md:pt-12 md:pb-6" : "p-6 md:p-8 lg:p-10"}`}>
          <motion.div
            variants={itemVariants}
            className="w-full"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[#4A3B2A]/10 bg-white/70 px-4 py-2 text-[15px] font-semibold uppercase tracking-[0.28em] text-[#6B513C] backdrop-blur-sm">
              <LuSparkles className="h-4 w-4" />
              Trail Essentials
            </div>

            <h2 className="mt-5 font-serif text-[clamp(1.8rem,3.5vw,2.4rem)] leading-[1.1] tracking-tight text-[#2F2319]">
              What the journey covers, and what you should plan on your own.
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="mt-10 grid gap-6 lg:grid-cols-2"
          >
            <InclusionCard type="included" items={safeIncludedItems} />
            <InclusionCard type="excluded" items={safeExcludedItems} />
          </motion.div>

          {/* Action Buttons at the Bottom Center */}
          <motion.div
            variants={itemVariants}
            className={`${isWrapped ? "mt-10" : "mt-12"} flex flex-wrap items-center justify-center gap-6`}
          >
            {/* View Itinerary Button */}
            <motion.button
              whileHover={hasItinerary ? { scale: 1.05 } : undefined}
              whileTap={hasItinerary ? { scale: 0.95 } : undefined}
              onClick={handleItineraryClick}
              disabled={!hasItinerary}
              onMouseEnter={() => setIsHoveringItinerary(true)}
              onMouseLeave={() => setIsHoveringItinerary(false)}
              className={`group relative flex items-center justify-center gap-2 overflow-hidden rounded-full px-8 py-4 font-sans text-base font-semibold transition-all duration-300 ${
                hasItinerary
                  ? "bg-[#4A3B2A] text-[#F8F2E9] shadow-[0_4px_20px_rgba(74,59,42,0.3)] hover:shadow-[0_8px_30px_rgba(74,59,42,0.4)]"
                  : "bg-[#4A3B2A]/80 text-[#F8F2E9]/70 cursor-not-allowed border border-[#4A3B2A]/10 shadow-[0_4px_20px_rgba(74,59,42,0.15)]"
              }`}
            >
              {/* Shine effect overlay */}
              {hasItinerary && (
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
              )}

              <span className="relative z-10 flex items-center gap-2">
                <LuFileText
                  className={`h-5 w-5 transition-transform duration-300 ${
                    hasItinerary ? "group-hover:-translate-y-0.5" : ""
                  }`}
                />
                {hasItinerary ? "View Itinerary" : "Itinerary Coming Soon"}
              </span>
            </motion.button>

            {/* Enquire Now Button */}
            <motion.div
              className="relative"
              onMouseEnter={() => setIsHoveringEnquire(true)}
              onMouseLeave={() => setIsHoveringEnquire(false)}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEnquireClick}
                className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-full bg-[#4A3B2A] px-10 py-4 font-sans text-base font-semibold text-[#F8F2E9] shadow-[0_4px_20px_rgba(74,59,42,0.3)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(74,59,42,0.4)]"
              >
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />

                <span className="relative z-10 flex items-center gap-2">
                  Enquire Now
                  <LuArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  <motion.div
                    animate={{
                      rotate: isHoveringEnquire ? [0, 15, -15, 0] : 0,
                      scale: isHoveringEnquire ? [1, 1.2, 1] : 1,
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: isHoveringEnquire ? Infinity : 0,
                      repeatDelay: 1,
                    }}
                  >
                    <LuSparkles className="h-4 w-4 text-[#D4A373]" />
                  </motion.div>
                </span>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default TrailInclusionsSection;
