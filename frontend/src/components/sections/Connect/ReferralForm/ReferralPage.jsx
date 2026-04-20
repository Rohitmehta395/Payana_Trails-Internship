import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import CommonHero from "../../../common/CommonHero";
import usePageHeroImages from "../../../../hooks/usePageHeroImages";
import ReferralForm from "./ReferralForm";

const ReferralPage = () => {
  const navigate = useNavigate();
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
      <div className="py-16">
        <ReferralForm />
        
        {/* Back Button */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => navigate(-1)}
            className="group relative flex items-center justify-center gap-3 overflow-hidden rounded-full bg-[#4A3B2A] px-10 py-4 font-sans text-base font-semibold text-[#F8F2E9] shadow-[0_10px_20px_rgba(74,59,42,0.15)] transition-all duration-300 hover:shadow-[0_15px_30px_rgba(74,59,42,0.25)] hover:-translate-y-1"
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
            <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="relative z-10">Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReferralPage;
