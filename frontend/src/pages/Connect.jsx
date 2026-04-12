import React from 'react';
import CommonHero from '../components/common/CommonHero';
import usePageHeroImages from '../hooks/usePageHeroImages';

const Connect = () => {
  const { images: heroImgs } = usePageHeroImages("connect");
  // No local fallback image yet for Connect — CommonHero will render with an empty/grey bg
  const heroBg = heroImgs.length > 0 ? (heroImgs[0].desktop || heroImgs[0]) : "";

  return (
    <div className="bg-[#F3EFE9] min-h-screen">
      {heroBg && (
        <CommonHero
          title="CONNECT"
          subtitle="REACH OUT TO US"
          bgImage={heroBg}
          breadcrumbs={[
            { label: "HOME", path: "/" },
            { label: "CONNECT" },
          ]}
        />
      )}
      {/* Rest of your Connect content goes here */}
    </div>
  );
}

export default Connect;