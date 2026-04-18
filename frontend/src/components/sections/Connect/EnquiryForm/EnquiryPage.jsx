import React, { useState } from 'react';
import CommonHero from '../../../common/CommonHero';
import usePageHeroImages from '../../../../hooks/usePageHeroImages';
import EnquiryForm from '../EnquiryForm';
import ReferralForm from '../ReferralForm/ReferralForm';
import GiftForm from '../GiftForm/GiftForm';

const EnquiryPage = () => {
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
      </div>

      {/* Conditionally show additional forms after a successful enquiry, to provide a seamless flow */}
      {enquiryData && (
        <div className="animate-fade-in-up">
          <ReferralForm initialData={enquiryData} />
          <GiftForm initialData={enquiryData} />
        </div>
      )}
    </div>
  );
};

export default EnquiryPage;
