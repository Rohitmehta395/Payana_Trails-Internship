import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Compass, ArrowLeft } from "lucide-react";
import BrownBtn from "../../common/buttons/BrownBtn";

export const LoadingState = () => (
  <>
    <Helmet>
      <title>Loading Itinerary | Payana Trails</title>
    </Helmet>
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FDFBF7] px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,107,80,0.08),transparent_48%)]" />
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="relative mb-6 h-16 w-16">
          <div className="absolute inset-0 rounded-full border border-[#E5D7C5]" />
          <div className="absolute inset-2 rounded-full border-4 border-[#E5D7C5] border-t-[#8B6B50] animate-spin" />
        </div>
        <h2 className="font-serif text-2xl text-[#4A3B2A]">
          Unfolding the journey...
        </h2>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#8B6B50]">
          Gathering the trail details and preparing the day-by-day route.
        </p>
      </div>
    </div>
  </>
);

export const NotFoundState = ({ onBack }) => (
  <>
    <Helmet>
      <title>Trail Not Found | Payana Trails</title>
    </Helmet>
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FDFBF7] px-6 py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,107,80,0.08),transparent_48%)]" />
      <div className="relative z-10 w-full max-w-2xl rounded-[36px] border border-[#E5D7C5] bg-white p-8 text-center shadow-[0_24px_60px_rgba(74,59,42,0.08)] md:p-10">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-[#E5D7C5] bg-[#FAF7F2] text-[#8B6B50]">
          <Compass className="h-9 w-9" />
        </div>
        <h1 className="font-serif text-[clamp(2rem,6vw,3rem)] text-[#4A3B2A] md:text-5xl leading-tight">
          Trail not found
        </h1>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-[#8B6B50]">
          We could not locate this itinerary. It may have been moved or
          removed.
        </p>
        <div className="mt-8 flex justify-center">
          <BrownBtn text="Back to Trails" onClick={onBack} />
        </div>
      </div>
    </div>
  </>
);

export const ComingSoonState = ({ ogTitle, ogDescription, trailName, slug }) => (
  <>
    <Helmet>
      <title>{ogTitle}</title>
      <meta name="description" content={ogDescription} />
    </Helmet>
    <div className="relative min-h-screen overflow-hidden bg-[#FDFBF7] px-6 py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,107,80,0.08),transparent_50%)]" />
      <div className="relative z-10 mx-auto flex min-h-[80vh] max-w-3xl items-center">
        <div className="w-full rounded-[36px] border border-[#E5D7C5] bg-white p-8 text-center shadow-[0_24px_60px_rgba(74,59,42,0.08)] md:p-10">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-[#E5D7C5] bg-[#FAF7F2] text-[#8B6B50]">
            <Compass className="h-10 w-10" />
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8B6B50]">
            Journey in the making
          </p>
          <h1 className="mt-4 font-serif text-[clamp(2rem,6vw,3rem)] text-[#4A3B2A] md:text-5xl leading-tight">
            Detailed itinerary coming soon
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-[#8B6B50]">
            We are shaping the day-by-day experience for{" "}
            <strong className="font-medium text-[#5A4738]">{trailName}</strong>.
            Check back soon for the full journey.
          </p>
          <Link
            to={`/trails/${slug}`}
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#E5D7C5] bg-[#FAF7F2] px-7 py-3 text-sm font-medium text-[#4A3B2A] transition hover:border-[#8B6B50]/30 hover:bg-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to trail
          </Link>
        </div>
      </div>
    </div>
  </>
);
