import React from "react";
import Hero from "../components/sections/Home/Hero";
import ExploreOurTrails from "../components/sections/Home/ExploreOurTrails";
import SignatureTrails from "../components/sections/Home/SignatureTrails";
import PayanaWay from "../components/sections/Home/PayanaWay";
import StoriesMoments from "../components/sections/Home/StoriesMoments";
import ClosingInvitation from "../components/sections/Home/ClosingInvitation";
import ShareExperience from "../components/sections/Home/ShareExperience";

//HardCoded Hero Images
//Desktop
import heroBg from "../assets/Home/hero/Desktop/heroBg.webp";
// import imgD1 from "../assets/Home/hero/Desktop/1.Lioness_with_cubs_Kenya.webp";
import imgD2 from "../assets/Home/hero/Desktop/2.Giraffe_couple_Tanzania.webp";
import imgD3 from "../assets/Home/hero/Desktop/3.Pyramids_and_Camels_Egypt.webp";
import imgD4 from "../assets/Home/hero/Desktop/4.Rose_City_of_Petra_Jordan.webp";
import imgD5 from "../assets/Home/hero/Desktop/5.Tanah_Lot_Bali_Indonesia.webp";
import imgD6 from "../assets/Home/hero/Desktop/6.Halong_Bay_Vietnam.webp";
import imgD7 from "../assets/Home/hero/Desktop/7.Borneo_Orangutan_Malaysia.webp";
import imgD8 from "../assets/Home/hero/Desktop/8.Angkor_Wat_Cambodia.webp";
import imgD9 from "../assets/Home/hero/Desktop/9.Tigers_Nest_Bhutan.webp";
import imgD10 from "../assets/Home/hero/Desktop/10.Great_Wall_of_China_Landscape.webp";
import imgD11 from "../assets/Home/hero/Desktop/11.Floating_Market_Thailand.webp";
import imgD12 from "../assets/Home/hero/Desktop/12.Mount_Kailas_Tibet.webp";
//Mobile
import heroBgMob from "../assets/Home/hero/Mobile/heroBg.webp";
// import imgM1 from "../assets/Home/hero/Mobile/1.LionesswithcubsKenya-Portrait.webp";
import imgM2 from "../assets/Home/hero/Mobile/2.Cheetah-Tanzania-Portrait.webp";
import imgM3 from "../assets/Home/hero/Mobile/3.PyramidsandCamels-Egypt-Portrait.webp";
import imgM4 from "../assets/Home/hero/Mobile/4.Rose CityofPetra-Jordan-Portrait.webp";
import imgM5 from "../assets/Home/hero/Mobile/5.Bali-Indonesia-Portrait.webp";
import imgM6 from "../assets/Home/hero/Mobile/6.HalongBay-Vietnam-Portrait.webp";
import imgM7 from "../assets/Home/hero/Mobile/7.Borneo-Orangutan-Malaysia-Portrait.webp";
import imgM8 from "../assets/Home/hero/Mobile/8.TaProhmTemple-Cambodia-Portrait.webp";
import imgM9 from "../assets/Home/hero/Mobile/9.TigersNest-Bhutan-Portrait.webp";
import imgM10 from "../assets/Home/hero/Mobile/10.GreatWallofChina-Portrait.webp";
import imgM11 from "../assets/Home/hero/Mobile/11.FloatingMarket-Thailand-Portrait.webp";
import imgM12 from "../assets/Home/hero/Mobile/12.MountKailas-Tibet-Portrait.webp";

const Home = () => {
  const heroImages = [
    { desktop: heroBg, mobile: heroBgMob },
    // { desktop: imgD1, mobile: imgM1 },
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
  return (
    <div>
      <Hero images={heroImages} />
      <ExploreOurTrails />
      {/* <SignatureTrails /> */}
      <PayanaWay />
      <StoriesMoments />
      <ClosingInvitation />
      <ShareExperience />
    </div>
  );
};

export default Home;
