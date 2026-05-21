import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { api } from "../services/api";
import CommonHero from "../components/common/CommonHero";
import heroImg from "../assets/Home/PayanaWay/Payana-way.webp";
import usePageHeroImages from "../hooks/usePageHeroImages";
import AJourneyBegins from "../components/sections/PayanaWay/AJourneyBegins";
import ThePayanaDifference from "../components/sections/PayanaWay/ThePayanaDifference";
import JourneysWithPurpose from "../components/sections/PayanaWay/JourneysWithPurpose";
import InTheMedia from "../components/sections/PayanaWay/InTheMedia";

const PayanaWay = () => {
  const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://payanatrails.com").replace("www.", "");
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
      <Helmet>
        <title>Payana Way | Payana Trails</title>
        <meta name="description" content="Discover the Payana Way and our philosophy." />
        <link rel="canonical" href={`${SITE_URL}/payana-way`} />
        <meta property="og:url" content={`${SITE_URL}/payana-way`} />
      </Helmet>
      <CommonHero
        title="PAYANA WAY"
        subtitle="A JOURNEY TO FIND ONESELF"
        images={heroImgs}
        bgImage={heroImg}
        breadcrumbs={[{ label: "HOME", path: "/" }, { label: "PAYANA WAY" }]}
      />

      {pageData?.aJourneyBegins && (
        <AJourneyBegins data={pageData.aJourneyBegins} />
      )}
      {pageData?.thePayanaDifference && (
        <ThePayanaDifference data={pageData.thePayanaDifference} />
      )}
      {pageData?.journeysWithPurpose && (
        <JourneysWithPurpose data={pageData.journeysWithPurpose} />
      )}
      {pageData?.inTheMedia && <InTheMedia data={pageData.inTheMedia} />}
    </div>
  );
};

export default PayanaWay;
