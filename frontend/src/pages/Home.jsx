import React from "react";
import { Helmet } from "react-helmet-async";
import Hero from "../components/sections/Home/Hero";
import ExploreOurTrails from "../components/sections/Home/ExploreOurTrails";
import SignatureTrails from "../components/sections/Home/SignatureTrails";
import PayanaWay from "../components/sections/Home/PayanaWay";
import StoriesMoments from "../components/sections/Home/StoriesMoments";
import ClosingInvitation from "../components/sections/Home/ClosingInvitation";
import ShareExperience from "../components/sections/Home/ShareExperience";
import usePageHeroImages from "../hooks/usePageHeroImages";

//HardCoded Hero Images
//Desktop
// import imgD1 from "../assets/Home/hero/Desktop/4.Lioness_with_cubs_Kenya.webp";
import imgD2 from "../assets/Home/hero/Desktop/1.Rose_City_of_Petra_Jordan.webp";
import imgD3 from "../assets/Home/hero/Desktop/3.Pyramids_and_Camels_Egypt.webp";
import imgD4 from "../assets/Home/hero/Desktop/2.Giraffe_couple_Tanzania.webp";
import imgD5 from "../assets/Home/hero/Desktop/5.Tanah_Lot_Bali_Indonesia.webp";
import imgD6 from "../assets/Home/hero/Desktop/6.Halong_Bay_Vietnam.webp";
import imgD7 from "../assets/Home/hero/Desktop/7.Borneo_Orangutan_Malaysia.webp";
import imgD8 from "../assets/Home/hero/Desktop/8.Angkor_Wat_Cambodia.webp";
import imgD9 from "../assets/Home/hero/Desktop/9.Tigers_Nest_Bhutan.webp";
import imgD10 from "../assets/Home/hero/Desktop/10.Great_Wall_of_China_Landscape.webp";
import imgD11 from "../assets/Home/hero/Desktop/11.Floating_Market_Thailand.webp";
import imgD12 from "../assets/Home/hero/Desktop/12.Mount_Kailas_Tibet.webp";

//Mobile
// import imgM1 from "../assets/Home/hero/Mobile/1.LionesswithcubsKenya-Portrait.webp";
import imgM2 from "../assets/Home/hero/Mobile/1.Rose CityofPetra-Jordan-Portrait.jpg";
import imgM3 from "../assets/Home/hero/Mobile/3.PyramidsandCamels-Egypt-Portrait.jpg";
import imgM4 from "../assets/Home/hero/Mobile/2.Cheetah-Tanzania-Portrait.jpg";
import imgM5 from "../assets/Home/hero/Mobile/5.Bali-Indonesia-Portrait.jpg";
import imgM6 from "../assets/Home/hero/Mobile/6.HalongBay-Vietnam-Portrait.jpg";
import imgM7 from "../assets/Home/hero/Mobile/7.Borneo-Orangutan-Malaysia-Portrait.jpg";
import imgM8 from "../assets/Home/hero/Mobile/8.TaProhmTemple-Cambodia-Portrait.jpg";
import imgM9 from "../assets/Home/hero/Mobile/9.TigersNest-Bhutan-Portrait.jpg";
import imgM10 from "../assets/Home/hero/Mobile/10.GreatWallofChina-Portrait.jpg";
import imgM11 from "../assets/Home/hero/Mobile/11.FloatingMarket-Thailand-Portrait.jpg";
import imgM12 from "../assets/Home/hero/Mobile/12.MountKailas-Tibet-Portrait.jpg";
import ExploreDestination from "../components/sections/Home/ExploreDestination";

// Static fallback images
const FALLBACK_IMAGES = [
  { desktop: "/heroBg-desktop.webp", mobile: "/heroBg-mobile.jpg" },
  { desktop: imgD2, mobile: imgM2 },
  { desktop: imgD3, mobile: imgM3 },
  { desktop: imgD4, mobile: imgM4 },
  { desktop: imgD5, mobile: imgM5 },
  { desktop: imgD6, mobile: imgM6 },
  { desktop: imgD7, mobile: imgM7 },
  { desktop: imgD8, mobile: imgM8 },
  { desktop: imgD9, mobile: imgM9 },
  { desktop: imgD10, mobile: imgM10 },
  { desktop: imgD11, mobile: imgM11 },
  { desktop: imgD12, mobile: imgM12 },
];

const Home = () => {
  const SITE_URL = import.meta.env.VITE_SITE_URL || "http://localhost:5173";
  const OG_IMAGE = `${SITE_URL}/heroBg-desktop.webp`;

  // Pull images from DB; fall back to static assets if DB has none
  const { images: heroImages } = usePageHeroImages("home", FALLBACK_IMAGES);
  return (
    <>
      <Helmet>
        <title>Payana Trails | Thoughtfully Designed Journeys</title>
        <meta name="description" content="Small groups. Deeper experiences. Discover our curated trails around the world." />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Payana Trails" />
        <meta property="og:title" content="Payana Trails | Thoughtfully Designed Journeys" />
        <meta property="og:description" content="Small groups. Deeper experiences. Discover our curated trails around the world." />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content={SITE_URL} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Payana Trails | Thoughtfully Designed Journeys" />
        <meta name="twitter:description" content="Small groups. Deeper experiences. Discover our curated trails around the world." />
        <meta name="twitter:image" content={OG_IMAGE} />
      </Helmet>

      <div>
      <Hero images={heroImages} />
      <ExploreOurTrails />
      {/* <SignatureTrails /> */}
      <ExploreDestination />
      <PayanaWay />
      <StoriesMoments />
      <ClosingInvitation />
      <ShareExperience />
      </div>
    </>
  );
};

export default Home;
