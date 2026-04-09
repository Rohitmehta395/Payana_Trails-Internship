import React from "react";
import { motion } from "framer-motion";
import {
  LuCheck,
  LuCompass,
  LuShield,
  LuSparkles,
  LuStar,
  LuX,
} from "react-icons/lu";

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
    AccentIcon: LuShield,
    countLabel: "Included",
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
    countClassName:
      "border-[#4A3B2A]/12 bg-white/80 text-[#4A3B2A] shadow-[0_8px_18px_rgba(74,59,42,0.08)]",
    itemClassName:
      "border-[#4A3B2A]/10 bg-white/78 text-[#2F2319] shadow-[0_12px_28px_rgba(74,59,42,0.08)]",
    itemMetaClassName: "text-[#6B513C]",
    itemIconClassName: "bg-[#4A3B2A] text-[#F8F2E9]",
    itemGlowClassName: "bg-[#A18160]/30",
    watermarkClassName: "text-[#4A3B2A]/7",
    orbitClassName: "border-[#4A3B2A]/12 bg-white/55 text-[#4A3B2A]/70",
  },
  excluded: {
    title: "What's Not Included",
    eyebrow: "Best planned separately",
    description:
      "The extras you may want to carry, arrange, or budget for before the journey begins.",
    Icon: LuX,
    AccentIcon: LuCompass,
    countLabel: "Excluded",
    cardClassName:
      "border-white/10 bg-[linear-gradient(160deg,#5D3D2B_0%,#3D2B1F_100%)] shadow-[0_20px_50px_rgba(39,24,17,0.26)]",
    glowClassName: "bg-[#C68C76]/24",
    iconWrapClassName:
      "border-white/10 bg-[#F5E5CF] text-[#5D3D2B] shadow-[0_14px_32px_rgba(0,0,0,0.22)]",
    eyebrowClassName: "text-[#E5C7AA]",
    titleClassName: "text-[#FFF4E6]",
    bodyClassName: "text-[#E8D6C2]",
    chipClassName:
      "border-white/10 bg-white/10 text-[#F2E3D2] shadow-[0_8px_20px_rgba(0,0,0,0.14)]",
    countClassName:
      "border-white/10 bg-white/15 text-[#FFF0E1] shadow-[0_8px_20px_rgba(0,0,0,0.16)]",
    itemClassName:
      "border-[#4A3B2A]/10 bg-[#F3EFE9] text-[#4A3B2A] shadow-[0_14px_28px_rgba(0,0,0,0.08)]",
    itemMetaClassName: "text-[#4A3B2A]/60",
    itemIconClassName: "bg-[#4A3B2A] text-[#F8F2E9]",
    itemGlowClassName: "bg-[#C68C76]/15",
    watermarkClassName: "text-white/7",
    orbitClassName: "border-white/10 bg-white/10 text-[#F6E8D8]/70",
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
    AccentIcon,
    countLabel,
    cardClassName,
    glowClassName,
    iconWrapClassName,
    eyebrowClassName,
    titleClassName,
    bodyClassName,
    chipClassName,
    countClassName,
    itemClassName,
    itemMetaClassName,
    itemIconClassName,
    itemGlowClassName,
    watermarkClassName,
    orbitClassName,
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
      <div
        aria-hidden="true"
        className={`absolute right-5 top-4 h-24 w-24 ${watermarkClassName}`}
      >
        <Icon className="h-full w-full" />
      </div>

      <motion.div
        aria-hidden="true"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, ease: "linear", repeat: Infinity }}
        className={`absolute bottom-5 right-5 flex h-14 w-14 items-center justify-center rounded-full border backdrop-blur-sm ${orbitClassName}`}
      >
        <AccentIcon className="h-5 w-5" />
      </motion.div>

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

          <div
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold backdrop-blur-sm ${countClassName}`}
          >
            <span>{String(items.length).padStart(2, "0")}</span>
            <span>{countLabel}</span>
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

        <div className="mt-7 space-y-3">
          {items.length > 0 ? (
            items.map((item, index) => (
              <motion.div
                key={`${type}-${index}-${item}`}
                variants={itemVariants}
                whileHover={{ x: 6 }}
                className={`relative overflow-hidden rounded-[1.35rem] border p-4 pr-12 md:p-5 ${itemClassName}`}
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
                    <p
                      className={`text-[10px] font-semibold uppercase tracking-[0.3em] ${itemMetaClassName}`}
                    >
                      Item {String(index + 1).padStart(2, "0")}
                    </p>
                    <p className="mt-1.5 text-sm leading-6 md:text-[15px]">
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
      </div>
    </motion.div>
  );
};

const TrailInclusionsSection = ({
  includedItems = [],
  excludedItems = [],
}) => {
  const safeIncludedItems = sanitizeItems(includedItems);
  const safeExcludedItems = sanitizeItems(excludedItems);

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-8 md:px-10">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.18 }}
        variants={containerVariants}
        className="relative overflow-hidden rounded-[2.4rem] border border-[#4A3B2A]/10 bg-[linear-gradient(135deg,#fffdf8_0%,#f7ecda_48%,#f0e1c6_100%)] shadow-[0_24px_70px_rgba(74,59,42,0.12)]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.92),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(122,143,108,0.12),transparent_30%),radial-gradient(circle_at_center_right,rgba(198,140,118,0.14),transparent_28%)]" />
        <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(74,59,42,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(74,59,42,0.08)_1px,transparent_1px)] [background-size:28px_28px]" />

        {floatingSymbols.map((particle, index) => (
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

        <div className="relative p-6 md:p-8 lg:p-10">
          <motion.div
            variants={itemVariants}
            className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
          >
            <div className="w-full">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#4A3B2A]/10 bg-white/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6B513C] backdrop-blur-sm">
                <LuSparkles className="h-4 w-4" />
                Trail Essentials
              </div>

              <h2 className="mt-5 font-serif text-[clamp(1.8rem,3.5vw,2.4rem)] leading-[1.1] tracking-tight text-[#2F2319] lg:whitespace-nowrap">
                What the journey covers, and what you should plan on your own.
              </h2>
            </div>

            {sectionChips.length > 0 && (
              <div className="flex flex-wrap gap-2.5 lg:max-w-sm lg:justify-end">
                {sectionChips.map((chip, index) => (
                  <motion.div
                    key={chip}
                    variants={itemVariants}
                    whileHover={{ y: -2 }}
                    className="inline-flex items-center gap-2 rounded-full border border-[#4A3B2A]/10 bg-white/70 px-4 py-2 text-sm font-medium text-[#5D4837] shadow-[0_10px_22px_rgba(74,59,42,0.06)] backdrop-blur-sm"
                  >
                    {index === 0 ? (
                      <LuCheck className="h-4 w-4 text-[#355441]" />
                    ) : index === 1 ? (
                      <LuShield className="h-4 w-4 text-[#7A8F6C]" />
                    ) : (
                      <LuX className="h-4 w-4 text-[#9B5C43]" />
                    )}
                    {chip}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="mt-10 grid gap-6 lg:grid-cols-2"
          >
            <InclusionCard type="included" items={safeIncludedItems} />
            <InclusionCard type="excluded" items={safeExcludedItems} />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default TrailInclusionsSection;
