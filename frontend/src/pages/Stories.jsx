import React from "react";
import CommonHero from "../components/common/CommonHero";
import storiesImg from "../assets/Home/Stories/stories-moments.webp";
import usePageHeroImages from "../hooks/usePageHeroImages";

const Stories = () => {
  const { images: heroImgs } = usePageHeroImages("stories");
  const heroBg = heroImgs.length > 0 ? (heroImgs[0].desktop || heroImgs[0]) : storiesImg;

  return (
    <div className="bg-[#F3EFE9] min-h-screen">
      <CommonHero
        title="STORIES"
        subtitle="TALES FROM THE TRAILS"
        bgImage={heroBg}
        breadcrumbs={[
          { label: "HOME", path: "/" },
          { label: "STORIES" },
        ]}
      />
      {/* Rest of your Stories content goes here */}
    </div>
  );
};

export default Stories;
