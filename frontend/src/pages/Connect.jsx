import React from 'react';
import CommonHero from '../components/common/CommonHero';
import usePageHeroImages from '../hooks/usePageHeroImages';

const Connect = () => {
  const { images: heroImgs } = usePageHeroImages("connect");

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
      {/* Rest of your Connect content goes here */}
    </div>
  );
}

export default Connect;