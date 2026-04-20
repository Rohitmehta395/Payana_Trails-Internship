import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import CommonHero from '../../../common/CommonHero';
import usePageHeroImages from '../../../../hooks/usePageHeroImages';
import EnquiryForm from '../EnquiryForm';
import ReferralForm from '../ReferralForm/ReferralForm';
import GiftForm from '../GiftForm/GiftForm';

const EnquiryPage = () => {
  const navigate = useNavigate();
  const { images: heroImgs } = usePageHeroImages("connect");
  const [enquiryData, setEnquiryData] = useState(null);

  // We can choose to show referral / gift forms on the enquiry page after successful submission
  // Or just keep it as a standalone form page. We include them conditionally or below the form.

  return (
    <div className="bg-[#F3EFE9] min-h-screen">
      <CommonHero
        title="ENQUIRE"
        subtitle="START YOUR JOURNEY"
        images={heroImgs}
        breadcrumbs={[
          { label: "HOME", path: "/" },
          { label: "CONNECT", path: "/connect" },
          { label: "ENQUIRE" },
        ]}
      />
      
      <div className="pb-16 pt-8">
        <EnquiryForm onSuccess={setEnquiryData} />
        
        {/* Back Button */}
        {!enquiryData && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => navigate(-1)}
              className="group relative flex items-center justify-center gap-3 overflow-hidden rounded-full bg-[#4A3B2A] px-10 py-4 font-sans text-base font-semibold text-[#F8F2E9] shadow-[0_10px_20px_rgba(74,59,42,0.15)] transition-all duration-300 hover:shadow-[0_15px_30px_rgba(74,59,42,0.25)] hover:-translate-y-1"
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
              <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
              <span className="relative z-10">Back to Previous</span>
            </button>
          </div>
        )}
      </div>

      {/* Conditionally show additional forms after a successful enquiry, to provide a seamless flow */}
      {enquiryData && (
        <div className="animate-fade-in-up">
          <ReferralForm initialData={enquiryData} />
          <GiftForm initialData={enquiryData} />
          
          {/* Back Button after success as well, but maybe with a different perspective */}
          <div className="py-12 flex justify-center">
             <button
              onClick={() => navigate(-1)}
              className="group relative flex items-center justify-center gap-3 overflow-hidden rounded-full border-2 border-[#4A3B2A] px-10 py-4 font-sans text-base font-semibold text-[#4A3B2A] transition-all duration-300 hover:bg-[#4A3B2A] hover:text-[#F8F2E9]"
            >
              <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
              <span>Go Back</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnquiryPage;
