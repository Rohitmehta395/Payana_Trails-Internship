import React from 'react';
import { Link } from 'react-router-dom';
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

      {/* FAQs Section Link */}
      {/* Premium FAQs Section Link */}
      <section className="py-20 px-4 md:px-8 bg-[#F3EFE9] relative z-10">
        <div className="max-w-5xl mx-auto relative group">
          {/* Decorative background border */}
          <div className="absolute inset-0 border border-[#4A3B2A]/20 transform translate-x-3 translate-y-3 transition-transform duration-500 group-hover:translate-x-4 group-hover:translate-y-4"></div>
          
          <div className="relative bg-white/80 backdrop-blur-sm p-10 md:p-16 flex flex-col md:flex-row items-center justify-between border border-[#4A3B2A]/10 shadow-[0_10px_40px_rgba(74,59,42,0.05)] transition-all duration-500 hover:shadow-[0_15px_50px_rgba(74,59,42,0.08)]">
            <div className="text-center md:text-left mb-8 md:mb-0 md:pr-12">
              <div className="inline-flex items-center justify-center p-3 bg-[#4A3B2A]/5 rounded-full mb-4 md:hidden">
                <svg className="w-6 h-6 text-[#4A3B2A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#4A3B2A] mb-4 uppercase tracking-[0.15em] leading-tight flex items-center md:justify-start justify-center gap-4">
                <svg className="w-8 h-8 text-[#4A3B2A] hidden md:block opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                FAQs
              </h2>
              <p className="text-[#4A3B2A]/70 max-w-lg font-medium text-sm md:text-base leading-relaxed">
                Have questions about our exclusive trails, booking process, or experiences? Browse our frequently asked questions.
              </p>
            </div>
            
            <Link
              to="/connect/faqs"
              className="relative inline-flex items-center justify-center px-10 py-4 bg-[#4A3B2A] text-[#F3EFE9] font-bold text-sm uppercase tracking-[0.2em] overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 group/btn w-full md:w-auto text-center"
            >
              <span className="absolute inset-0 w-full h-full bg-white/10 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-500 ease-out"></span>
              <span className="relative flex items-center gap-3">
                Explore FAQs
                <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Connect;