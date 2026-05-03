import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";
import HeroSection from "../components/sections/TrailDetail/HeroSection";
import ContentSection from "../components/sections/TrailDetail/ContentSection";
import JourneySnapshot from "../components/sections/TrailDetail/JourneySnapshot";
import TrailInclusionsSection from "../components/sections/TrailDetail/TrailInclusionsSection";
import TrailRouteSection from "../components/sections/TrailDetail/TrailRouteSection";
import MovingGallery, {
  Particles,
} from "../components/sections/TrailDetail/MovingGallery";
import BrownBtn from "../components/common/buttons/BrownBtn";
import { transformTrailMedia } from "../utils/trailPresentation";

const TrailDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [trail, setTrail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrail = async () => {
      try {
        const data = await api.getTrailById(slug);
        setTrail(data);
      } catch (error) {
        console.error("Failed to fetch trail details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrail();
  }, [slug]);

  const transformed = useMemo(() => {
    return transformTrailMedia(trail);
  }, [trail]);

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Loading… | Payana Trails</title>
        </Helmet>
        <div className="flex min-h-screen items-center justify-center bg-[#F3EFE9]">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-[#4A3B2A]/20 border-t-[#4A3B2A]" />
        </div>
      </>
    );
  }

  if (!transformed) {
    return (
      <>
        <Helmet>
          <title>Trail Not Found | Payana Trails</title>
        </Helmet>
        <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#F3EFE9] p-6 text-center">
          <h1 className="font-sans text-4xl text-[#4A3B2A]">Trail not found</h1>
          <BrownBtn
            text="Back to Trails"
            onClick={() => navigate("/journeys")}
          />
        </div>
      </>
    );
  }

  // Build absolute OG values
  const SITE_URL = import.meta.env.VITE_SITE_URL || "http://localhost:5173";
  const ogTitle = `${transformed.trailName} | Payana Trails`;
  const ogDescription = (
    transformed.overview || "Discover this amazing trail with Payana Trails."
  )
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
  const ogImage = transformed.heroImageUrl || `${SITE_URL}/heroBg-desktop.webp`;
  const ogUrl = `${SITE_URL}/trails/${transformed.slug || slug}`;

  return (
    <>
      <Helmet>
        <title>{ogTitle}</title>
        <meta name="description" content={ogDescription} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Payana Trails" />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content={ogUrl} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={ogTitle} />
        <meta name="twitter:description" content={ogDescription} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>

      <div className="bg-[#F3EFE9] pb-20">
        <HeroSection trail={transformed} />

        <ContentSection title="Overview">
          <p>{transformed.overview}</p>
        </ContentSection>

        <ContentSection title="Journey Snapshot">
          <JourneySnapshot trail={transformed} />
        </ContentSection>

        <ContentSection title="Is This Journey For You?">
          <p>{transformed.isThisJourneyForYou}</p>
        </ContentSection>

        <TrailRouteSection trail={transformed} />

        {/* Unified Essentials & Moments Section */}
        <section className="mx-auto w-full max-w-7xl px-4 py-6 md:px-10 md:py-12">
          <div className="relative overflow-hidden rounded-3xl md:rounded-[2.5rem] border border-[#4A3B2A]/12 bg-[linear-gradient(145deg,#fffdf8_0%,#f9f3e9_50%,#f2e9d8_100%)] shadow-[0_20px_50px_rgba(74,59,42,0.1)]">
            <Particles />
            <TrailInclusionsSection
              includedItems={transformed.whatsIncluded || []}
              excludedItems={transformed.whatsNotIncluded || []}
              trailSlug={transformed.slug || slug}
              trailState={trail}
              isWrapped={true}
              hasItinerary={
                (Array.isArray(transformed.itinerary) &&
                  transformed.itinerary.length > 0) ||
                (Array.isArray(transformed.optionalExperiences) &&
                  transformed.optionalExperiences.some((ex) => ex?.trim())) ||
                (transformed.flights &&
                  (transformed.flights.domesticIntro?.trim() ||
                    (transformed.flights.domesticLines &&
                      transformed.flights.domesticLines.some((l) =>
                        l?.trim(),
                      )) ||
                    transformed.flights.internationalIntro?.trim() ||
                    transformed.flights.arrivalAirport?.trim() ||
                    transformed.flights.departureAirport?.trim()))
              }
            />

            <MovingGallery
              images={transformed.gallery}
              trailName={transformed.trailName}
              isWrapped={true}
            />
          </div>
        </section>
      </div>
    </>
  );
};

export default TrailDetails;
