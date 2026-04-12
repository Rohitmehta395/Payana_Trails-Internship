import React from "react";
import Hero from "../components/sections/Journey/Hero";
import SignatureJourneys from "../components/sections/Journey/SignatureJourneys";
import OurTrails from "../components/sections/Journey/OurTrails";
import OurDestinations from "../components/sections/Journey/OurDestinations";
import PayanaJourney from "../components/sections/Journey/PayanaJourney";
import usePageHeroImages from "../hooks/usePageHeroImages";

// Static fallback images for the Journeys page
const FALLBACK_IMAGES = [
  {
    desktop:
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    mobile:
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    desktop:
      "https://images.unsplash.com/photo-1523805009345-7448845a9e53?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    mobile:
      "https://images.unsplash.com/photo-1523805009345-7448845a9e53?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
];

const Journeys = () => {
  // Pull hero images from the DB; falls back to static Unsplash images
  const { images: heroImages } = usePageHeroImages("journeys", FALLBACK_IMAGES);

  return (
    <>
      {/* Pass the correctly structured array to the Hero component */}
      <Hero images={heroImages} />
      <SignatureJourneys />
      <OurTrails />
      <OurDestinations />
      <PayanaJourney />
    </>
  );
};

export default Journeys;
