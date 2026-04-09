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
import TrailActionButtons from "../components/sections/TrailDetail/TrailActionButtons";

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

  return (
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

      <TrailActionButtons />
    </div>
  );
};

export default TrailDetails;
