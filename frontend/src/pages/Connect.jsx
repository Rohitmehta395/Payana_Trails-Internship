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

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const data = await api.getFAQs();
        setFaqs(data.slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch FAQs:", err);
      }
    };
    fetchFAQs();
  }, []);

  return (
    <div className="bg-[#F3EFE9] min-h-screen">
      <CommonHero
        title="CONNECT"
        subtitle="REACH OUT TO US"
        images={heroImgs}
        breadcrumbs={[{ label: "HOME", path: "/" }, { label: "CONNECT" }]}
      />
      <EnquirySection />
      <ReferFriendSection />
      <GiftJourneySection />
      <FAQSection faqs={faqs} />
      <ContactDetailsSection />
      <SocialMediaSection />
      <TawkChat />
    </div>
  );
};

export default Connect;
