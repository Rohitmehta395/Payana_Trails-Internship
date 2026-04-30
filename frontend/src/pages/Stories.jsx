import React, { useEffect } from "react";
import CommonHero from "../components/common/CommonHero";
import storiesImg from "../assets/Home/Stories/stories-moments.webp";
import usePageHeroImages from "../hooks/usePageHeroImages";
import { api } from "../services/api";
import TravelStories from "../components/sections/Stories/TravelStories";
import VoicesSection from "../components/sections/Stories/VoicesSection";
import StoriesNewsletter from "../components/sections/Stories/StoriesNewsletter";

const Stories = () => {
  const { images: heroImgs } = usePageHeroImages("stories");
  const [storiesData, setStoriesData] = React.useState(null);

  useEffect(() => {
    api
      .getStoriesPage()
      .then((data) => setStoriesData(data))
      .catch((err) => console.error("Failed to load stories page:", err));
  }, []);

  return (
    <div className="bg-[#F3EFE9] min-h-screen">
      <CommonHero
        title="STORIES"
        subtitle="TALES FROM THE TRAILS"
        images={heroImgs}
        bgImage={storiesImg}
        breadcrumbs={[{ label: "HOME", path: "/" }, { label: "STORIES" }]}
      />

      {/* Travel Stories Section */}
      <TravelStories data={storiesData} />

      {/* Voices from the Trail Section */}
      <VoicesSection data={storiesData?.voicesSection} />

      {/* Newsletter Section */}
      <StoriesNewsletter data={storiesData?.newsletterSection} />
    </div>
  );
};

export default Stories;
