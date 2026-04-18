import React from "react";
import { Link } from "react-router-dom";
import CommonHero from "../components/common/CommonHero";
import usePageHeroImages from "../hooks/usePageHeroImages";
import ReferralForm from "../components/sections/Connect/ReferralForm/ReferralForm";
import GiftForm from "../components/sections/Connect/GiftForm/GiftForm";

const Connect = () => {
  const { images: heroImgs } = usePageHeroImages("connect");
  const [enquiryData, setEnquiryData] = React.useState(null);

  return (
    <div className="bg-[#F3EFE9] min-h-screen">
      <CommonHero
        title="CONNECT"
        subtitle="REACH OUT TO US"
        images={heroImgs}
        breadcrumbs={[{ label: "HOME", path: "/" }, { label: "CONNECT" }]}
      />
      {/* Editorial Grade Enquiry Intro Section */}
      <section className="py-24 px-4 md:px-8 bg-white relative z-10 overflow-hidden">
        {/* Subtle background text watermark */}
        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -ml-24 text-[20rem] font-serif italic font-bold text-[#F3EFE9]/50 select-none pointer-events-none z-0 tracking-tighter mix-blend-multiply hidden lg:block">
          Explore
        </div>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24 relative z-10">
          {/* Left Typography Side */}
          <div className="w-full lg:w-1/2 relative text-left">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-[2px] bg-[#D4A373]"></div>
              <span className="text-[#D4A373] uppercase tracking-[0.3em] font-bold text-sm">
                Tailored For You
              </span>
            </div>

            <h2 className="text-5xl md:text-6xl lg:text-[5rem] font-bold text-[#4A3B2A] leading-[1.05] mb-8 tracking-tight font-serif drop-shadow-sm">
              Craft Your <br />
              <span className="italic font-light text-[#4A3B2A]/90">
                Legacy.
              </span>
            </h2>

            <p className="text-[#4A3B2A]/70 text-lg md:text-xl font-medium max-w-lg mb-12 leading-relaxed">
              Travel is the only thing you buy that makes you richer. Share your
              vision with our destination experts and we will curate an
              itinerary that transcends the ordinary.
            </p>

            <div className="relative inline-block group">
              <Link
                to="/connect/enquiry"
                className="relative z-10 flex items-center justify-center px-10 py-5 bg-[#4A3B2A] text-white font-bold tracking-[0.2em] uppercase text-sm border border-[#4A3B2A] transition-all duration-500 overflow-hidden"
              >
                <span className="absolute inset-0 bg-[#D4A373] transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                <span className="relative z-20 flex items-center gap-4 group-hover:text-white transition-colors duration-500">
                  Begin Enquiry
                  <svg
                    className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
              </Link>
              {/* Decorative off-center outline */}
              <div className="absolute inset-0 border border-[#4A3B2A]/20 translate-x-3 translate-y-3 z-0 transition-transform duration-500 group-hover:translate-x-4 group-hover:translate-y-4"></div>
            </div>
          </div>

          {/* Right Imagery Side - Clean Elegance */}
          <div className="w-full lg:w-1/2 relative flex flex-col md:flex-row justify-end mt-12 lg:mt-0">
             {/* Back Image (Offset) */}
             <div className="hidden md:block absolute top-0 right-16 lg:right-24 w-3/5 aspect-[3/4] rounded-tr-[5rem] rounded-bl-[5rem] overflow-hidden shadow-lg mt-8 opacity-90 transition-transform duration-700 hover:-translate-y-2">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] hover:scale-110"
                  style={{ backgroundImage: `url(${heroImgs?.[1] || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2000&auto=format&fit=crop'})` }}
                ></div>
                <div className="absolute inset-0 bg-[#4A3B2A]/5 mix-blend-multiply"></div>
             </div>
             
             {/* Front Image - Main Focus */}
             <div className="relative z-10 w-full md:w-3/4 lg:w-[70%] aspect-[4/5] rounded-tl-[5rem] rounded-br-[5rem] overflow-hidden shadow-[0_30px_60px_rgba(74,59,42,0.15)] md:border-[10px] border-white ml-auto lg:mr-0 lg:mt-24 transition-transform duration-700 hover:-translate-y-2">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-[15s] hover:scale-110"
                  style={{ backgroundImage: `url(${heroImgs?.[0] || 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=2000&auto=format&fit=crop'})` }}
                ></div>
                {/* Very subtle inward shadow for depth, no heavy text overlays */}
                <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.1)] pointer-events-none"></div>
             </div>

             {/* Minimalist Floating Accent */}
             <div className="absolute -bottom-6 left-4 md:left-8 md:bottom-16 bg-white/95 backdrop-blur-md px-6 py-4 rounded-2xl shadow-[0_15px_40px_rgba(74,59,42,0.1)] z-20 flex items-center gap-5 border border-[#4A3B2A]/5 transform transition-transform duration-500 hover:-translate-y-1">
               <div className="w-12 h-12 rounded-full bg-[#4A3B2A]/5 flex items-center justify-center shrink-0">
                 <svg className="w-6 h-6 text-[#D4A373]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                 </svg>
               </div>
               <div>
                 <p className="text-[#4A3B2A] font-bold text-[15px] leading-tight mb-1">Tailor Made</p>
                 <p className="text-[#4A3B2A]/60 text-[13px] font-medium leading-tight">Expertly curated for you</p>
               </div>
             </div>
          </div>
        </div>
      </section>
      {/* Premium FAQs Section Link */}
      <section className="py-20 px-4 md:px-8 bg-[#F3EFE9] relative z-10">
        <div className="max-w-6xl mx-auto relative group">
          {/* Decorative background border */}
          <div className="absolute inset-0 border border-[#4A3B2A]/20 transform translate-x-3 translate-y-3 transition-transform duration-500 group-hover:translate-x-4 group-hover:translate-y-4"></div>

          <div className="relative bg-white/80 backdrop-blur-sm p-10 md:p-16 flex flex-col md:flex-row items-center justify-between border border-[#4A3B2A]/10 shadow-[0_10px_40px_rgba(74,59,42,0.05)] transition-all duration-500 hover:shadow-[0_15px_50px_rgba(74,59,42,0.08)]">
            <div className="text-center md:text-left mb-8 md:mb-0 md:pr-12">
              <div className="inline-flex items-center justify-center p-3 bg-[#4A3B2A]/5 rounded-full mb-4 md:hidden">
                <svg
                  className="w-6 h-6 text-[#4A3B2A]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#4A3B2A] mb-4 uppercase tracking-[0.15em] leading-tight flex items-center md:justify-start justify-center gap-4">
                <svg
                  className="w-8 h-8 text-[#4A3B2A] hidden md:block opacity-60"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                FAQs
              </h2>
              <p className="text-[#4A3B2A]/70 max-w-lg font-medium text-sm md:text-base leading-relaxed">
                Have questions about our exclusive trails, booking process, or
                experiences? Browse our frequently asked questions.
              </p>
            </div>

            {/* Left Content Half */}
            <div className="w-full md:w-1/2 bg-[#4A3B2A] p-12 lg:p-24 relative overflow-hidden flex flex-col justify-center border-r-2 border-white/10">
              {/* Decorative background grid and lighting */}
              <div
                className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_transparent_0%,_#4A3B2A_100%),linear-gradient(rgba(255,255,255,0.1)_1px,_transparent_1px),linear-gradient(90deg,_rgba(255,255,255,0.1)_1px,_transparent_1px)]"
                style={{ backgroundSize: "100% 100%, 40px 40px, 40px 40px" }}
              ></div>
              <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#D4A373] opacity-20 blur-[100px] rounded-full group-hover:opacity-30 transition-opacity duration-700"></div>

              <div className="relative z-10 w-full md:max-w-md mx-auto">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-8 h-[2px] bg-[#D4A373] transition-all duration-500 group-hover:w-20"></div>
                  <span className="text-[#D4A373] uppercase tracking-[0.3em] font-bold text-xs md:text-sm">
                    Community Network
                  </span>
                </div>

                <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#F3EFE9] leading-[1.05] mb-6 drop-shadow-md">
                  Invite Those <br />
                  <span className="italic font-light text-[#F3EFE9]/90">
                    Who Matter.
                  </span>
                </h2>

                <p className="text-[#F3EFE9]/70 text-lg font-medium leading-relaxed mb-12">
                  Introduce your favorite people to Payana Trails and enjoy
                  exclusive rewards towards your next magnificent escape.
                </p>

            <Link
              to="/connect/faqs"
              className="relative inline-flex items-center justify-center px-10 py-4 bg-[#4A3B2A] text-[#F3EFE9] font-bold text-sm uppercase tracking-[0.2em] overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 group/btn w-full md:w-auto text-center"
            >
              <span className="absolute inset-0 w-full h-full bg-white/10 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-500 ease-out"></span>
              <span className="relative flex items-center gap-3">
                Explore FAQs
                <svg
                  className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </section>

      <ReferralForm initialData={enquiryData} />
      <GiftForm initialData={enquiryData} />
    </div>
  );
};

export default Connect;
