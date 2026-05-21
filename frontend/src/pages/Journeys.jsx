import React from "react";
import { Helmet } from "react-helmet-async";
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
  const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://payanatrails.com").replace("www.", "");
  // Pull hero images from the DB; falls back to static Unsplash images
  const { images: heroImages } = usePageHeroImages("journeys", FALLBACK_IMAGES);

  return (
    <>
      <Helmet>
        <title>Journeys | Payana Trails</title>
        <meta name="description" content="Explore our signature journeys and destinations around the world." />
        <link rel="canonical" href={`${SITE_URL}/journeys`} />
        <meta property="og:url" content={`${SITE_URL}/journeys`} />
      </Helmet>
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
