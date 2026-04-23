import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUserPlus, FaGift, FaHeart } from "react-icons/fa6";
import BrownBtn from "../../common/buttons/BrownBtn";
import referFriendPic from "../../../assets/Home/Refer/referFriendPic.webp";
import giftAJourney from "../../../assets/Home/Refer/Gift.webp";
import useHomePageData from "../../../hooks/useHomePageData";
import { IMAGE_BASE_URL } from "../../../services/api";

const ShareExperience = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: homeData } = useHomePageData();

  const referGiftData = homeData?.referAndGiftSection || {
    referYourFriends: {
      title: "Refer Your Friends",
      subtitle: "Know someone who loves meaningful travel? Invite them to discover a thoughtfully curated Payana Trails journey. Both of you will receive a special benefit on your next Payana Trails journey.",
      heroImage: null
    },
    giftAJourney: {
      title: "Gift a Journey",
      subtitle: "Surprise your loved ones with an unforgettable experience. Gift a curated Payana Trails journey or a travel voucher to create memories that last a lifetime.",
      heroImage: null
    },
    mainTitleBold: "Journeys are meaningful when",
    mainTitleItalic: "Shared",
    mainSubtitle: "Whether travelling with a companion or gifting an experience of a lifetime, we make sharing easy and rewarding.",
  };
  return (
    <section
      id="share-section"
      className="relative w-full bg-[#F3EFE9] py-24 px-6 lg:px-12 overflow-hidden font-sans"
    >


      <div className="max-w-[1200px] mx-auto relative z-10">
        {/* === HEADER === */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#4A3B2A]/10 text-[#4A3B2A] text-sm font-semibold tracking-wider uppercase mb-5 shadow-sm">
            <FaHeart size={14} className="animate-pulse" />
            <span>Share The Magic</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold font-serif text-[#4A3B2A] leading-tight mb-5 drop-shadow-sm">
            {referGiftData.mainTitleBold}{" "}
            <span className="italic font-light">{referGiftData.mainTitleItalic}</span>
          </h2>
          <p className="text-[#4A3B2A]/80 text-lg max-w-2xl mx-auto leading-relaxed">
            {referGiftData.mainSubtitle}
          </p>
        </div>

        {/* === GRID LAYOUT === */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Card 1: Refer a Friend */}
          <div className="group relative flex flex-col bg-white/40 rounded-[2.5rem] p-6 sm:p-8 transition-all duration-500 border border-[#4A3B2A]/10 hover:bg-white/70 hover:shadow-2xl hover:shadow-[#4A3B2A]/10 hover:-translate-y-2">
            {/* Image Container */}
            <div className="relative h-64 sm:h-80 w-full rounded-[2rem] overflow-hidden mb-8 shadow-inner">
              <div className="absolute inset-0 bg-[#4A3B2A]/20 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none"></div>
              <img
                src={referGiftData.referYourFriends?.heroImage ? `${IMAGE_BASE_URL}${referGiftData.referYourFriends.heroImage}` : referFriendPic}
                alt={referGiftData.referYourFriends?.title || "Friends traveling together"}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              {/* Floating Icon Badge */}
              <div className="absolute top-4 left-4 z-20 bg-[#F3EFE9] p-3.5 rounded-full shadow-lg text-[#4A3B2A] transform -rotate-12 group-hover:rotate-0 transition-transform duration-500">
                <FaUserPlus size={22} />
              </div>
            </div>

            {/* Content */}
            <h3 className="text-2xl lg:text-3xl font-bold font-serif text-[#4A3B2A] mb-3">
              {referGiftData.referYourFriends?.title}
            </h3>
            <p className="text-[#4A3B2A]/80 mb-8 grow leading-relaxed text-[16px] whitespace-pre-line">
              {referGiftData.referYourFriends?.subtitle}
            </p>

            {/* Using your custom Button */}
            <div className="mt-auto">
              <BrownBtn
                text="Explore Referral Program"
                className="w-full sm:w-auto shadow-md hover:shadow-lg"
                onClick={() =>
                  navigate("/connect#referral-section", {
                    state: {
                      from: location.pathname,
                      section: "share-section",
                    },
                  })
                }
              />
            </div>
          </div>

          {/* Card 2: Gift a Journey */}
          <div className="group relative flex flex-col bg-white/40 rounded-[2.5rem] p-6 sm:p-8 transition-all duration-500 border border-[#4A3B2A]/10 hover:bg-white/70 hover:shadow-2xl hover:shadow-[#4A3B2A]/10 hover:-translate-y-2">
            {/* Image Container */}
            <div className="relative h-64 sm:h-80 w-full rounded-[2rem] overflow-hidden mb-8 shadow-inner">
              <div className="absolute inset-0 bg-[#4A3B2A]/20 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none"></div>
              <img
                src={referGiftData.giftAJourney?.heroImage ? `${IMAGE_BASE_URL}${referGiftData.giftAJourney.heroImage}` : giftAJourney}
                alt={referGiftData.giftAJourney?.title || "Gifting a journey"}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              {/* Floating Icon Badge */}
              <div className="absolute top-4 left-4 z-20 bg-[#F3EFE9] p-3.5 rounded-full shadow-lg text-[#4A3B2A] transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
                <FaGift size={22} />
              </div>
            </div>

            {/* Content */}
            <h3 className="text-2xl lg:text-3xl font-bold font-serif text-[#4A3B2A] mb-3">
              {referGiftData.giftAJourney?.title}
            </h3>
            <p className="text-[#4A3B2A]/80 mb-8 grow leading-relaxed text-[16px] whitespace-pre-line">
              {referGiftData.giftAJourney?.subtitle}
            </p>

            {/* Using your custom Button */}
            <div className="mt-auto">
              <BrownBtn
                text="Explore Gift Cards"
                className="w-full sm:w-auto shadow-md hover:shadow-lg"
                onClick={() =>
                  navigate("/connect#gift-section", {
                    state: {
                      from: location.pathname,
                      section: "share-section",
                    },
                  })
                }
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShareExperience;
