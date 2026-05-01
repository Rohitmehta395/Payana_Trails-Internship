import React, { useState, useEffect } from "react";
import CommonHero from "../components/common/CommonHero";
import usePageHeroImages from "../hooks/usePageHeroImages";
import { api } from "../services/api";
import EnquirySection from "../components/sections/Connect/EnquirySection";
import FAQSection from "../components/sections/Connect/FAQSection";
import ReferFriendSection from "../components/sections/Connect/ReferFriendSection";
import GiftJourneySection from "../components/sections/Connect/GiftJourneySection";
import ContactDetailsSection from "../components/sections/Connect/ContactDetailsSection";
import SocialMediaSection from "../components/sections/Connect/SocialMediaSection";
import TawkChat from "../components/common/TawkChat";

const Connect = () => {
  const { images: heroImgs } = usePageHeroImages("connect");
  const [faqs, setFaqs] = useState([]);
  const [connectData, setConnectData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [faqsData, pageData] = await Promise.all([
          api.getFAQs(),
          api.getConnectPage().catch(() => null)
        ]);
        setFaqs(faqsData.slice(0, 3));
        setConnectData(pageData);
      } catch (err) {
        console.error("Failed to fetch connect data:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-[#F3EFE9] min-h-screen">
      <CommonHero
        title="CONNECT"
        subtitle="REACH OUT TO US"
        images={heroImgs}
        breadcrumbs={[{ label: "HOME", path: "/" }, { label: "CONNECT" }]}
      />
      <EnquirySection data={connectData?.enquirySection} />
      <ReferFriendSection data={connectData?.referFriendSection} />
      <GiftJourneySection data={connectData?.giftJourneySection} />
      <FAQSection faqs={faqs} data={connectData?.faqSection} />
      <ContactDetailsSection data={connectData?.connectSection} />
      <SocialMediaSection data={connectData?.connectSection?.socialMedia} />
      <TawkChat />
    </div>
  );
};

export default Connect;
