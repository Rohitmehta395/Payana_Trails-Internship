import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, IMAGE_BASE_URL } from "../services/api";
import HeroSection from "../components/sections/TrailDetail/HeroSection";
import ContentSection from "../components/sections/TrailDetail/ContentSection";
import JourneySnapshot from "../components/sections/TrailDetail/JourneySnapshot";
import TrailInclusionsSection from "../components/sections/TrailDetail/TrailInclusionsSection";
import TrailRouteSection from "../components/sections/TrailDetail/TrailRouteSection";
import MovingGallery from "../components/sections/TrailDetail/MovingGallery";
import BrownBtn from "../components/common/buttons/BrownBtn";
import CreamBtn from "../components/common/buttons/CreamBtn";
import { parseTrailHighlight } from "../utils/trailUtils";

const TrailDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trail, setTrail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrail = async () => {
      try {
        const data = await api.getTrailById(id);
        setTrail(data);
      } catch (error) {
        console.error("Failed to fetch trail details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrail();
  }, [id]);

  const transformed = useMemo(() => {
    if (!trail) return null;
    return {
      ...trail,
      heroImageUrl: trail.heroImage
        ? `${IMAGE_BASE_URL}${trail.heroImage}`
        : "",
      routeMapUrl: trail.routeMap ? `${IMAGE_BASE_URL}${trail.routeMap}` : "",
      gallery: (trail.trailImages || []).map(
        (img) => `${IMAGE_BASE_URL}${img}`,
      ),
    };
  }, [trail]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F3EFE9]">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-[#4A3B2A]/20 border-t-[#4A3B2A]" />
      </div>
    );
  }

  if (!transformed) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#F3EFE9] p-6 text-center">
        <h1 className="font-sans text-4xl text-[#4A3B2A]">Trail not found</h1>
        <BrownBtn text="Back to Trails" onClick={() => navigate("/journeys")} />
      </div>
    );
  }

  const highlightsList = transformed.highlights || [];

  return (
    <div className="bg-[#F3EFE9] pb-20">
      <HeroSection trail={transformed} />

      <ContentSection title="Overview">
        <p>{transformed.overview}</p>
      </ContentSection>

      <ContentSection title="Journey Snapshot">
        <JourneySnapshot trail={transformed} />
      </ContentSection>

      <ContentSection title="Trail Highlights">
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {highlightsList.length > 0 ? (
            highlightsList.map((point, idx, arr) => {
              const isLastAndOdd =
                arr.length % 2 !== 0 && idx === arr.length - 1;

              const highlight = parseTrailHighlight(point);

              return (
                <div
                  key={idx}
                  className={`group flex flex-col sm:flex-row items-start gap-4 rounded-2xl bg-white p-5 md:p-6 border border-[#4A3B2A]/5 shadow-[0_4px_20px_rgba(74,59,42,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(74,59,42,0.08)] ${
                    isLastAndOdd ? "md:col-span-2" : "md:col-span-1"
                  }`}
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F3EFE9] font-sans text-lg font-bold text-[#4A3B2A] transition-colors duration-300 group-hover:bg-[#4A3B2A] group-hover:text-[#F3EFE9]">
                    {String(idx + 1).padStart(2, "0")}
                  </div>

                  <div className="flex flex-col pt-1">
                    {highlight.title && (
                      <h3 className="font-sans text-[1.15rem] font-semibold text-[#3D2C20]">
                        {highlight.title}
                      </h3>
                    )}

                    {highlight.description && (
                      <p className="mt-1.5 text-[15px] leading-relaxed text-[#5A4738]/80">
                        {highlight.description}
                      </p>
                    )}

                    {!highlight.title && !highlight.description && (
                      <p className="font-sans text-[1.15rem] font-semibold text-[#3D2C20]">
                        {typeof point === "string"
                          ? point
                          : "Highlight details"}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="col-span-full text-[#5A4738]/80">
              No highlights available for this trail.
            </p>
          )}
        </div>
      </ContentSection>

      <ContentSection title="Is This Journey For You?">
        <p>{transformed.isThisJourneyForYou}</p>
      </ContentSection>

      <TrailRouteSection trail={transformed} />

      <TrailInclusionsSection
        includedItems={transformed.whatsIncluded || []}
        excludedItems={transformed.whatsNotIncluded || []}
      />

      <ContentSection title="Visions of the Path">
        <MovingGallery
          images={transformed.gallery}
          trailName={transformed.trailName}
        />
      </ContentSection>

      <section className="mx-auto mt-4 flex max-w-7xl flex-wrap gap-4 px-6 md:px-10">
        <CreamBtn
          text="View Itinerary"
          className="!px-8 !py-3 !text-base !border !border-[#4A3B2A]/20"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        />
        <BrownBtn
          text="Enquire Now"
          className="!px-8 !py-3 !text-base"
          onClick={() => navigate("/connect")}
        />
      </section>
    </div>
  );
};

export default TrailDetails;
