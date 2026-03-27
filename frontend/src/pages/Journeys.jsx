import React from "react";
import Hero from "../components/sections/Journey/Hero";
import SignatureJourneys from "../components/sections/Journey/SignatureJourneys";
import OurTrails from "../components/sections/Journey/OurTrails";
import OurDestinations from "../components/sections/Journey/OurDestinations";

// If you have local images, you would import them here like this:
// import journeyDesktop1 from "../assets/Journey/desktop-1.jpg";
// import journeyMobile1 from "../assets/Journey/mobile-1.jpg";

const Journeys = () => {
  // 1. Define your array of images as objects with 'desktop' and 'mobile' keys
  const heroImages = [
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

  return (
    <>
      {/* 2. Pass the correctly structured array to the Hero component */}
      <Hero images={heroImages} />
      <SignatureJourneys />
      <OurTrails />
      <OurDestinations />
    </>
  );
};

export default Journeys;
