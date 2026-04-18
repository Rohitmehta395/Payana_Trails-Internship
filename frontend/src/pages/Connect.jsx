import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CommonHero from "../components/common/CommonHero";
import usePageHeroImages from "../hooks/usePageHeroImages";
import GiftForm from "../components/sections/Connect/GiftForm/GiftForm";
import { api } from "../services/api";

const faqIcons = [
  // Icon 1: Planning / Clipboard
  <path
    key="icon1"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.5"
    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
  />,
  // Icon 2: Booking / Credit Card
  <path
    key="icon2"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.5"
    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
  />,
  // Icon 3: On the Ground / Map Compass
  <path
    key="icon3"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.5"
    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
  />,
];

const Connect = () => {
  const { images: heroImgs } = usePageHeroImages("connect");
  const [enquiryData, setEnquiryData] = useState(null);
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
      {/* Editorial Grade Enquiry Intro Section */}
      <section className="py-24 px-4 md:px-8 bg-[#F3EFE9] relative z-10 overflow-hidden">
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
                className="relative z-10 flex items-center justify-center px-10 py-5 bg-[#4A3B2A] text-[#F3EFE9] font-bold tracking-[0.2em] uppercase text-sm border border-[#4A3B2A] transition-all duration-500 overflow-hidden"
              >
                <span className="absolute inset-0 bg-[#795939] transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                <span className="relative z-20 flex items-center gap-4 group-hover:text-[#F3EFE9] transition-colors duration-500">
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
                style={{
                  backgroundImage: `url(${heroImgs?.[1] || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2000&auto=format&fit=crop"})`,
                }}
              ></div>
              <div className="absolute inset-0 bg-[#4A3B2A]/5 mix-blend-multiply"></div>
            </div>

            {/* Front Image - Main Focus */}
            <div className="relative z-10 w-full md:w-3/4 lg:w-[70%] aspect-[4/5] rounded-tl-[5rem] rounded-br-[5rem] overflow-hidden shadow-[0_30px_60px_rgba(74,59,42,0.15)] md:border-[10px] border-white ml-auto lg:mr-0 lg:mt-24 transition-transform duration-700 hover:-translate-y-2">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[15s] hover:scale-110"
                style={{
                  backgroundImage: `url(${heroImgs?.[0] || "https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=2000&auto=format&fit=crop"})`,
                }}
              ></div>
              {/* Very subtle inward shadow for depth, no heavy text overlays */}
              <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.1)] pointer-events-none"></div>
            </div>

            {/* Minimalist Floating Accent */}
            <div className="absolute -bottom-6 left-4 md:left-8 md:bottom-16 bg-white/80 backdrop-blur-md px-6 py-4 rounded-2xl shadow-[0_15px_40px_rgba(74,59,42,0.1)] z-20 flex items-center gap-5 border border-[#4A3B2A]/5 transform transition-transform duration-500 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-full bg-[#4A3B2A]/5 flex items-center justify-center shrink-0">
                <svg
                  className="w-6 h-6 text-[#D4A373]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <p className="text-[#4A3B2A] font-bold text-[15px] leading-tight mb-1">
                  Tailor Made
                </p>
                <p className="text-[#4A3B2A]/60 text-[13px] font-medium leading-tight">
                  Expertly curated for you
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      {/* Elegance FAQ Section */}
      <section className="py-4 md:py-8 px-4 md:px-8 bg-[#F3EFE9] relative z-10 overflow-hidden">
        {/* Subtle background watermark */}
        <div className="absolute top-0 right-0 text-[15rem] font-serif italic font-bold text-[#F3EFE9]/40 select-none pointer-events-none z-0 tracking-tighter mix-blend-multiply hidden lg:block">
          ?
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-8 h-[1px] bg-[#D4A373]"></div>
              <span className="text-[#D4A373] uppercase tracking-[0.3em] font-bold text-xs md:text-sm">
                Knowledge Base
              </span>
              <div className="w-8 h-[1px] bg-[#D4A373]"></div>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#4A3B2A] leading-tight tracking-tight">
              Frequently Asked{" "}
              <span className="italic font-light">Questions</span>
            </h2>
            <p className="text-[#4A3B2A]/70 text-base md:text-lg max-w-2xl mx-auto mt-4">
              Everything you need to know before embarking on your Payana
              journey.
            </p>
          </div>

          {/* FAQ Category Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
            {faqs.map((faq, index) => (
              <Link
                key={faq._id}
                to={`/connect/faqs#faq-${faq._id}`}
                className="group relative bg-white/60 backdrop-blur-sm p-8 rounded-2xl border border-[#4A3B2A]/10 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 block flex flex-col h-full"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4A373]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-12 h-12 rounded-full bg-[#4A3B2A]/5 flex items-center justify-center mb-6 group-hover:bg-[#D4A373]/20 transition-colors shrink-0">
                    <svg
                      className="w-6 h-6 text-[#4A3B2A] group-hover:text-[#D4A373]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {faqIcons[index % faqIcons.length]}
                    </svg>
                  </div>
                  <h3 className="text-2xl font-serif text-[#4A3B2A] mb-3 line-clamp-2">
                    {faq.question}
                  </h3>
                  <p className="text-[#4A3B2A]/60 text-sm leading-relaxed mb-4 flex-grow line-clamp-3">
                    {faq.answer}
                  </p>
                  <span className="inline-flex items-center text-[#D4A373] text-sm font-medium tracking-wide group-hover:gap-2 transition-all mt-auto pt-2">
                    Explore answer
                    <svg
                      className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
            
            {faqs.length === 0 && (
              <div className="col-span-full text-center py-12 text-[#4A3B2A]/60 italic font-medium text-lg">
                Loading FAQs...
              </div>
            )}
          </div>

          {/* Call to Action Button */}
          <div className="flex justify-center">
            <Link
              to="/connect/faqs"
              className="group relative inline-flex items-center justify-center px-10 py-5 bg-[#4A3B2A] text-[#F3EFE9] font-bold tracking-[0.2em] uppercase text-sm border border-[#4A3B2A] overflow-hidden rounded-sm shadow-lg hover:shadow-xl transition-all duration-500"
            >
              <span className="absolute inset-0 bg-[#795939] transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
              <span className="relative z-20 flex items-center gap-4 group-hover:text-[#F3EFE9] transition-colors duration-500">
                View All FAQs
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
          </div>
        </div>
      </section>

      {/* Highly Unique Split-Medallion Referral Link */}
      <section className="py-24 px-4 md:px-8 bg-white relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="relative w-full flex flex-col md:flex-row rounded-[2rem] overflow-hidden shadow-[0_30px_60px_rgba(74,59,42,0.15)] group h-auto md:h-[600px]">
            {/* Spinning Medallion (Center Overlap) */}
            <div className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-[#D4A373] rounded-full z-20 border-[6px] border-white items-center justify-center shadow-2xl transition-transform duration-700 group-hover:scale-[1.15]">
              {/* Rotating Text Ring */}
              <svg
                viewBox="0 0 100 100"
                className="absolute inset-0 w-full h-full animate-[spin_15s_linear_infinite]"
              >
                {/* Invisible circle path for text to follow */}
                <path
                  id="referralTextPath"
                  d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
                  fill="none"
                />
                <text className="text-[12px] font-bold tracking-[0.3em] uppercase fill-[#4A3B2A]">
                  <textPath href="#referralTextPath" startOffset="0%">
                    {" "}
                    • REFER A FRIEND • SHARE THE JOURNEY
                  </textPath>
                </text>
              </svg>
              {/* Center Arrow / Icon */}
              <div className="bg-white text-[#4A3B2A] w-14 h-14 rounded-full flex items-center justify-center transform -rotate-45 group-hover:rotate-0 transition-transform duration-500 shadow-md">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </div>
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
                  to="/connect/refer"
                  className="inline-flex items-center gap-4 text-[#F3EFE9] font-bold tracking-[0.2em] uppercase text-sm border-b border-[#D4A373] pb-2 transition-all duration-300 hover:text-[#D4A373] group/link"
                >
                  View Referral Program
                  <svg
                    className="w-5 h-5 transform transition-transform duration-300 group-hover/link:translate-x-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Right Image Half */}
            <div className="w-full md:w-1/2 relative min-h-[400px] md:min-h-full overflow-hidden">
              {/* The mobile medallion (only visible on mobile, overlapping slightly differently) */}
              <div className="md:hidden absolute top-4 right-4 w-24 h-24 bg-[#D4A373] rounded-full z-20 border-[4px] border-white flex items-center justify-center shadow-xl">
                <svg
                  viewBox="0 0 100 100"
                  className="absolute inset-0 w-full h-full animate-[spin_15s_linear_infinite]"
                >
                  <path
                    id="referralTextPathMobile"
                    d="M 50, 50 m -34, 0 a 34,34 0 1,1 68,0 a 34,34 0 1,1 -68,0"
                    fill="none"
                  />
                  <text className="text-[13px] font-bold tracking-[0.2em] uppercase fill-[#4A3B2A]">
                    <textPath href="#referralTextPathMobile" startOffset="0%">
                      {" "}
                      • REFER A FRIEND • SHARE{" "}
                    </textPath>
                  </text>
                </svg>
              </div>

              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[15s] group-hover:scale-110 ease-out"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1542314831-c6a4d14cdce8?q=80&w=2000&auto=format&fit=crop')`,
                }}
              ></div>
              {/* Soft sepia tone overlay */}
              <div className="absolute inset-0 bg-[#4A3B2A]/20 mix-blend-multiply"></div>
              {/* Inner vignette shadow */}
              <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(74,59,42,0.3)] pointer-events-none"></div>
            </div>
          </div>
        </div>
      </section>

      <GiftForm initialData={enquiryData} />
    </div>
  );
};

export default Connect;
