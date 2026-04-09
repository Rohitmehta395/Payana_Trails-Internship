import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  LuArrowRight,
  LuMap,
  LuMapPin,
  LuMountain,
  LuRoute,
  LuTrees,
} from "react-icons/lu";
import { parseTrailHighlight } from "../../../utils/trailUtils";

const floatingParticles = [
  "left-[8%] top-[12%]",
  "left-[18%] top-[72%]",
  "left-[42%] top-[18%]",
  "right-[10%] top-[16%]",
  "right-[18%] top-[64%]",
  "right-[34%] bottom-[10%]",
];

const stepOffsets = ["lg:ml-0", "lg:ml-8", "lg:ml-3", "lg:ml-10", "lg:ml-5"];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const getRouteCaption = (steps, rawRoute) => {
  if (steps.length > 1) {
    return `${steps[0]} to ${steps[steps.length - 1]}`;
  }

  if (rawRoute) {
    return rawRoute;
  }

  return "A thoughtfully mapped route.";
};

const parseTrailRoute = (route) => {
  if (!route) return [];

  const normalizedRoute = String(route)
    .replace(/\r\n/g, "\n")
    .replace(/\s*(?:->|=>|~>|\u2192|\u2794|\u27A1|\u27F6)\s*/g, " > ")
    .trim();

  const steps = normalizedRoute
    .split(
      /\s*>\s*|\s*\|\s*|\s*,\s*|\n+|\s+(?:-|\u2013|\u2014)\s+(?=[A-Z0-9])/,
    )
    .map((step) => step.trim().replace(/^(?:\*|-|\u2022|\u00B7)\s*/, ""))
    .filter(Boolean);

  return steps.length > 0 ? steps : [normalizedRoute];
};

const normalizeText = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const TrailRouteSection = ({ trail }) => {
  const routeSteps = useMemo(
    () => parseTrailRoute(trail?.trailRoute),
    [trail?.trailRoute],
  );
  const parsedHighlights = useMemo(
    () =>
      (trail?.highlights || [])
        .map((highlight) => parseTrailHighlight(highlight))
        .filter((highlight) => highlight.title || highlight.description),
    [trail?.highlights],
  );
  const stepHighlights = useMemo(
    () =>
      routeSteps.map((step, index) => {
        const normalizedStep = normalizeText(step);
        const matchedHighlight = parsedHighlights.find((highlight) => {
          const normalizedTitle = normalizeText(highlight.title);

          return (
            normalizedTitle &&
            (normalizedTitle === normalizedStep ||
              normalizedTitle.includes(normalizedStep) ||
              normalizedStep.includes(normalizedTitle))
          );
        });

        return matchedHighlight || parsedHighlights[index] || null;
      }),
    [parsedHighlights, routeSteps],
  );

  const scenicIcons = [LuMapPin, LuTrees, LuMountain];
  const mapAreaMinHeightClass =
    routeSteps.length <= 2
      ? "min-h-[260px] sm:min-h-[300px] lg:min-h-[340px]"
      : routeSteps.length <= 4
        ? "min-h-[300px] sm:min-h-[360px] lg:min-h-[420px]"
        : "min-h-[360px] sm:min-h-[420px] lg:min-h-[520px]";
  const mapImageMaxHeightClass =
    routeSteps.length <= 2
      ? "max-h-[320px] sm:max-h-[360px] lg:max-h-[400px]"
      : routeSteps.length <= 4
        ? "max-h-[380px] sm:max-h-[430px] lg:max-h-[470px]"
        : "max-h-[420px] sm:max-h-[500px] lg:max-h-[560px]";

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-8 md:px-10">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
        className="relative overflow-hidden rounded-[2rem] border border-[#4A3B2A]/8 bg-[linear-gradient(135deg,#fffdf8_0%,#f8eddc_46%,#f2e0c5_100%)] shadow-[0_20px_55px_rgba(74,59,42,0.12)]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.92),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(166,132,99,0.08),transparent_36%)]" />
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(rgba(74,59,42,0.1)_1px,transparent_1px)] [background-size:24px_24px]" />

        {floatingParticles.map((position, index) => (
          <motion.span
            key={position}
            aria-hidden="true"
            className={`absolute h-2.5 w-2.5 rounded-full bg-[#fff8ef]/80 shadow-[0_0_0_6px_rgba(255,248,239,0.22)] ${position}`}
            animate={{
              y: [0, index % 2 === 0 ? -14 : 12, 0],
              opacity: [0.35, 0.85, 0.35],
              scale: [0.9, 1.1, 0.9],
            }}
            transition={{
              duration: 5 + index,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        <div className="relative p-6 md:p-8 lg:p-10">
          <motion.div variants={itemVariants} className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#4A3B2A]/10 bg-white/70 px-4 py-2 text-[15px] font-semibold uppercase tracking-[0.28em] text-[#6B513C] backdrop-blur-sm">
              <LuRoute className="h-4 w-4" />
              Trail Route
            </div>

            <h2 className="mt-5 w-full max-w-none overflow-hidden text-ellipsis whitespace-nowrap font-serif text-[clamp(1.75rem,3.2vw,2.75rem)] leading-tight tracking-tight text-[#2F2319]">
              Follow the path as the journey naturally unfolds.
            </h2>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-[#4A3B2A]">
              {trail?.trailDestination && (
                <div className="inline-flex items-center gap-2 rounded-full border border-[#4A3B2A]/10 bg-[#fffaf4]/80 px-4 py-2 shadow-sm">
                  <LuMapPin className="h-4 w-4 text-[#7C5A3D]" />
                  <span>{trail.trailDestination}</span>
                </div>
              )}
              {trail?.duration && (
                <div className="inline-flex items-center gap-2 rounded-full border border-[#4A3B2A]/10 bg-[#fffaf4]/80 px-4 py-2 shadow-sm">
                  <LuMap className="h-4 w-4 text-[#7C5A3D]" />
                  <span>{trail.duration}</span>
                </div>
              )}
            </div>
          </motion.div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:items-stretch lg:gap-10">
            <motion.div variants={itemVariants} className="relative">
              <div className="relative rounded-[1.75rem] border border-[#4A3B2A]/8 bg-[linear-gradient(180deg,rgba(255,252,248,0.96)_0%,rgba(248,239,223,0.98)_100%)] p-5 shadow-[0_14px_38px_rgba(74,59,42,0.1)] md:p-6">
                <div className="pointer-events-none absolute bottom-5 left-6 top-8 w-px bg-[linear-gradient(180deg,rgba(132,98,66,0)_0%,rgba(132,98,66,0.8)_12%,rgba(132,98,66,0.3)_100%)] md:left-8" />

                <motion.div variants={containerVariants} className="space-y-4">
                  {routeSteps.length > 0 ? (
                    routeSteps.map((step, index) => {
                      const Icon = scenicIcons[index % scenicIcons.length];
                      const stepOffset = stepOffsets[index % stepOffsets.length];
                      const stepHighlight = stepHighlights[index];
                      const helperText = stepHighlight?.description;

                      return (
                        <motion.div
                          key={`${step}-${index}`}
                          variants={itemVariants}
                          className={`relative flex items-start gap-4 rounded-[1.35rem] border border-[rgba(74,59,42,0.08)] bg-white/72 p-4 shadow-[0_10px_25px_rgba(74,59,42,0.08)] backdrop-blur-sm ${stepOffset}`}
                        >
                          <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#6E523A]/15 bg-[#4A3B2A] text-[#F8F1E7] shadow-lg">
                            <Icon className="h-5 w-5" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8D6A4C]">
                              Stop {String(index + 1).padStart(2, "0")}
                            </p>
                            <h3 className="mt-1 font-serif text-[1.3rem] leading-tight text-[#2F2319] md:text-[1.45rem]">
                              {stepHighlight?.title || step}
                            </h3>

                            {helperText && (
                              <p className="mt-2 text-[15px] leading-7 text-[#5E4938] md:text-base">
                                {helperText}
                              </p>
                            )}
                          </div>

                          {index !== routeSteps.length - 1 && (
                            <div className="absolute -bottom-6 left-6 hidden h-10 w-12 rounded-b-full border-b-2 border-l-2 border-dashed border-[#8E6D4E]/45 lg:block" />
                          )}
                        </motion.div>
                      );
                    })
                  ) : (
                    <motion.div
                      variants={itemVariants}
                      className="rounded-[1.35rem] border border-dashed border-[#4A3B2A]/20 bg-white/70 p-5 text-[#5D4837]"
                    >
                      Route details will appear here once the trail path is added.
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="relative h-full">
              <div className="relative flex h-full flex-col overflow-hidden rounded-4xl border border-[rgba(74,59,42,0.1)] bg-[linear-gradient(180deg,rgba(74,59,42,0.92)_0%,rgba(51,39,28,0.96)_100%)] p-4 shadow-[0_18px_45px_rgba(74,59,42,0.18)] md:p-5">
                <div className="absolute inset-x-6 top-5 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.24em] text-[#F8F1E7]/60">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[rgba(255,255,255,0.06)] px-3 py-2 backdrop-blur-sm">
                    <LuMap className="h-4 w-4" />
                    Route View
                  </span>
                  <span>{routeSteps.length || 0} stops</span>
                </div>

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(248,241,231,0.08),transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0))]" />

                <motion.div
                  initial={{ opacity: 0, scale: 0.96, rotate: -1.5 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                  className="relative mt-14 flex-1 overflow-hidden rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,#f8f1e7_0%,#e6cfab_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
                >
                  <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(74,59,42,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(74,59,42,0.18)_1px,transparent_1px)] bg-size-[24px_24px]" />

                  {trail?.routeMapUrl ? (
                    <div
                      className={`relative z-10 flex h-full items-center justify-center p-5 sm:p-7 ${mapAreaMinHeightClass}`}
                    >
                      <motion.img
                        src={trail.routeMapUrl}
                        alt={`${trail?.trailName || "Trail"} route map`}
                        className={`w-full object-contain ${mapImageMaxHeightClass}`}
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      />
                    </div>
                  ) : (
                    <div
                      className={`relative z-10 flex h-full flex-col items-center justify-center gap-6 p-8 text-center text-[#4A3B2A] ${mapAreaMinHeightClass}`}
                    >
                      <div className="flex items-center gap-3">
                        {routeSteps.slice(0, 3).map((step, index) => (
                          <React.Fragment key={`${step}-${index}`}>
                            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#4A3B2A]/10 bg-white/80 shadow-sm">
                              <LuMapPin className="h-5 w-5 text-[#6D5036]" />
                            </div>
                            {index < Math.min(routeSteps.length, 3) - 1 && (
                              <LuArrowRight className="h-5 w-5 text-[#6D5036]/60" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                      <p className="max-w-sm text-sm leading-6 text-[#5E4938]">
                        Upload a route map to showcase the full path visually.
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default TrailRouteSection;
