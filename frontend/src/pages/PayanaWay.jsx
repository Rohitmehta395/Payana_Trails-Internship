import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import CommonHero from "../components/common/CommonHero";
import heroImg from "../assets/Home/PayanaWay/Payana-way.webp";
import usePageHeroImages from "../hooks/usePageHeroImages";
import AJourneyBegins from "../components/sections/PayanaWay/AJourneyBegins";
import ThePayanaDifference from "../components/sections/PayanaWay/ThePayanaDifference";
import JourneysWithPurpose from "../components/sections/PayanaWay/JourneysWithPurpose";

const PayanaWay = () => {
  const { images: heroImgs } = usePageHeroImages("payana-way");
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const responseData = await api.getPayanaWayPage();
        setPageData(responseData);
      } catch (error) {
        console.error("Error fetching Payana Way page data:", error);
      }
    };
    fetchPageData();
  }, []);

  return (
    <div className="bg-[#F3EFE9] min-h-screen">
      <CommonHero
        title="PAYANA WAY"
        subtitle="A JOURNEY TO FIND ONESELF"
        images={heroImgs}
        bgImage={heroImg}
        breadcrumbs={[
          { label: "HOME", path: "/" },
          { label: "PAYANA WAY" },
        ]}
      />
      
      {pageData?.aJourneyBegins && <AJourneyBegins data={pageData.aJourneyBegins} />}
      {pageData?.thePayanaDifference && <ThePayanaDifference data={pageData.thePayanaDifference} />}
      {pageData?.journeysWithPurpose && <JourneysWithPurpose data={pageData.journeysWithPurpose} />}
      
      {/* Rest of your Payana Way content goes here */}
    </div>
  );
};

export default PayanaWay;
