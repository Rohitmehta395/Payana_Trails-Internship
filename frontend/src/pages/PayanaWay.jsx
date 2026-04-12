import React from "react";
import CommonHero from "../components/common/CommonHero";
import heroImg from "../assets/Home/PayanaWay/Payana-way.webp";
import usePageHeroImages from "../hooks/usePageHeroImages";

const PayanaWay = () => {
  const { images: heroImgs } = usePageHeroImages("payana-way");
  const heroBg = heroImgs.length > 0 ? (heroImgs[0].desktop || heroImgs[0]) : heroImg;

  return (
    <div className="bg-[#F3EFE9] min-h-screen">
      <CommonHero
        title="PAYANA WAY"
        subtitle="A JOURNEY TO FIND ONESELF"
        bgImage={heroBg}
        breadcrumbs={[
          { label: "HOME", path: "/" },
          { label: "PAYANA WAY" },
        ]}
      />
      {/* Rest of your Payana Way content goes here */}
    </div>
  );
};

export default PayanaWay;
