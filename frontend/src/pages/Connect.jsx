import React from 'react';
import CommonHero from '../components/common/CommonHero';
import usePageHeroImages from '../hooks/usePageHeroImages';
import EnquiryForm from '../components/sections/Connect/EnquiryForm';
import ReferralForm from '../components/sections/Connect/ReferralForm/ReferralForm';
import GiftForm from '../components/sections/Connect/GiftForm/GiftForm';

const Connect = () => {
  const { images: heroImgs } = usePageHeroImages("connect");
  const [enquiryData, setEnquiryData] = React.useState(null);

  return (
    <div className="bg-[#F3EFE9] min-h-screen">
      <CommonHero
        title="CONNECT"
        subtitle="REACH OUT TO US"
        images={heroImgs}
        breadcrumbs={[
          { label: "HOME", path: "/" },
          { label: "CONNECT" },
        ]}
      />
      
      <EnquiryForm onSuccess={setEnquiryData} />
      <ReferralForm initialData={enquiryData} />
      <GiftForm initialData={enquiryData} />
    </div>
  );
}

export default Connect;