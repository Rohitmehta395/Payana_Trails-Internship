import React from "react";
import CommonHero from "../../../common/CommonHero";
import usePageHeroImages from "../../../../hooks/usePageHeroImages";
import GiftForm from "./GiftForm";

const GiftPage = () => {
  const { images: heroImgs } = usePageHeroImages("connect");

  return (
    <div>
      <CommonHero
        title="GIFT A JOURNEY"
        subtitle="SHARE AN EXPERIENCE"
        images={heroImgs}
        breadcrumbs={[
          { label: "HOME", path: "/" },
          { label: "CONNECT", path: "/connect" },
          { label: "GIFT A JOURNEY" },
        ]}
      />
      <div className="py-24">
        <GiftForm />
      </div>
    </div>
  );
};

export default GiftPage;
