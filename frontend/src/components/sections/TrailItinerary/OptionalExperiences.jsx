import React from "react";
import { Sparkles } from "lucide-react";

const OptionalExperiences = ({ lines }) => {
  const filled = (lines || []).filter((l) => l && l.trim());
  if (!filled.length) return null;

  return (
    <div
      id="itinerary-optional"
      className="w-full rounded-[28px] border border-[#E5D7C5]/80 bg-[#FAF7F2] p-6 md:p-8 shadow-[0_12px_30px_rgba(74,59,42,0.04)] scroll-mt-24"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5D7C5] bg-[#FDFBF7] text-[#8B6B50]">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-[#8B6B50]">
            Optional Experiences & Journey Enhancements
          </p>
          <p className="text-sm text-[#8B6B50]">
            Additional experiences along the way - some included, others
            available to add.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {filled.map((line, idx) => (
          <div
            key={idx}
            className="flex gap-4 rounded-2xl border border-white/60 bg-white/70 px-4 py-4"
          >
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#4A3B2A] text-xs font-semibold text-[#FDFBF7]">
              {String(idx + 1).padStart(2, "0")}
            </div>
            <p className="text-[15px] leading-relaxed text-[#5A4738] md:text-base pt-0.5">
              {line.trim()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OptionalExperiences;
