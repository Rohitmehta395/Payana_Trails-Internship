import React from "react";
import CommonHero from "../../../common/CommonHero";
import usePageHeroImages from "../../../../hooks/usePageHeroImages";
import ReferralForm from "./ReferralForm";

const ReferralPage = () => {
  const { images: heroImgs } = usePageHeroImages("connect");

  return (
    <div className="bg-[#F3EFE9] min-h-screen">
      <CommonHero
        title="REFER A FRIEND"
        subtitle="SHARE THE JOURNEY"
        images={heroImgs}
        breadcrumbs={[
          { label: "HOME", path: "/" },
          { label: "CONNECT", path: "/connect" },
          { label: "REFERRAL" },
        ]}
      />
      <div className="py-24">
        <ReferralForm />
      </div>
    </div>
  );
};

export default ReferralPage;
