import React from "react";
import CommonHero from "../components/common/CommonHero";
import storiesImg from "../assets/Home/Stories/stories-moments.webp";
import usePageHeroImages from "../hooks/usePageHeroImages";

const Stories = () => {
  const { images: heroImgs } = usePageHeroImages("stories");

  return (
    <div className="bg-[#F3EFE9] min-h-screen">
      <CommonHero
        title="STORIES"
        subtitle="TALES FROM THE TRAILS"
        images={heroImgs}
        bgImage={storiesImg}
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
