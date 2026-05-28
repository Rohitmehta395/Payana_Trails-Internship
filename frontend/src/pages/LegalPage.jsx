import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../services/api";
import CommonHero from "../components/common/CommonHero";
import usePageHeroImages from "../hooks/usePageHeroImages";

const TYPE_CONFIG = {
  "privacy-policy": {
    title: "PRIVACY POLICY",
    breadcrumbLabel: "PRIVACY POLICY",
    subtitle: "HOW WE PROTECT YOUR DATA",
    leftHeader: (
      <>
        PRIVACY<br/>FIRST.
      </>
    ),
    leftDescription: "We are committed to protecting your privacy and ensuring your personal information is handled with care.",
    symbol: "§",
  },
  "terms-and-conditions": {
    title: "TERMS & CONDITIONS",
    breadcrumbLabel: "TERMS & CONDITIONS",
    subtitle: "THE RULES OF THE TRAIL",
    leftHeader: (
      <>
        OUR<br/>TERMS.
      </>
    ),
    leftDescription: "Please read these terms and conditions carefully before booking a journey with Payana Trails.",
    symbol: "§",
  },
};

const LegalAccordion = ({ id, heading, content, isOpen, onClick, index }) => {
  const num = (index + 1).toString().padStart(2, "0");

  return (
    <div
      id={id}
      className={`group/accordion overflow-hidden transition-all duration-200 ease-out border-b border-[#4A3B2A]/20 ${
        isOpen
          ? "bg-[#4A3B2A]/[0.04]"
          : "bg-transparent hover:bg-[#4A3B2A]/[0.02]"
      }`}
    >
      <button
        onClick={onClick}
        className="w-full flex items-center py-6 md:py-8 px-4 md:px-6 focus:outline-none text-left cursor-pointer"
      >
        <span
          className={`text-xl md:text-3xl font-light w-12 md:w-20 shrink-0 transition-colors duration-200 ease-out ${
            isOpen ? "text-[#4A3B2A]" : "text-[#4A3B2A]/40"
          }`}
        >
          {num}
        </span>
        <span
          className={`font-bold text-lg md:text-2xl flex-1 pr-6 tracking-wide transition-colors duration-200 ${isOpen ? "text-[#4A3B2A]" : "text-[#4A3B2A]/80"}`}
        >
          {heading}
        </span>
        <div className="shrink-0 relative w-6 h-6 flex items-center justify-center">
          <span
            className={`absolute w-full h-0.5 bg-[#4A3B2A] transition-all duration-200 ease-out ${
              isOpen ? "rotate-45" : "rotate-0"
            }`}
          ></span>
          <span
            className={`absolute w-full h-0.5 bg-[#4A3B2A] transition-all duration-200 ease-out ${
              isOpen ? "-rotate-45" : "rotate-90"
            }`}
          ></span>
        </div>
      </button>

      <div
        className={`grid transition-all duration-200 ease-out px-4 md:px-6 ${
          isOpen
            ? "grid-rows-[1fr] opacity-100 pb-8"
            : "grid-rows-[0fr] opacity-0 pb-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="pl-12 md:pl-20 pr-4 md:pr-12">
            <p className="leading-relaxed whitespace-pre-wrap text-base md:text-lg font-medium text-[#4A3B2A]/80">
              {content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const LegalPage = ({ type: typeProp }) => {
  const params = useParams();
  const type = typeProp || params.type;
  const config = TYPE_CONFIG[type];

  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState(0);

  const { images } = usePageHeroImages(type);

  useEffect(() => {
    if (!type || !config) return;
    setLoading(true);
    setSearchQuery("");
    setOpenIndex(0);
    api
      .getLegalSections(type)
      .then((result) => {
        setSections(result || []);
      })
      .catch((err) => {
        console.error("Failed to fetch legal sections:", err);
      })
      .finally(() => setLoading(false));
  }, [type, config]);

  useEffect(() => {
    setOpenIndex(searchQuery ? null : 0);
  }, [searchQuery]);

  if (!config) {
    return (
      <div className="bg-[#F3EFE9] min-h-screen flex items-center justify-center">
        <p className="text-[#4A3B2A]/50 text-sm tracking-wider">
          Page not found.
        </p>
      </div>
    );
  }

  const filteredSections = sections.filter(
    (section) =>
      section.heading.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-[#F3EFE9] min-h-screen pb-32">
      {/* ── Header / Breadcrumbs ─────────────────────────────────── */}
      <CommonHero
        title={config.title}
        subtitle={config.subtitle}
        images={images}
        breadcrumbs={[
          { label: "HOME", path: "/" },
          { label: config.breadcrumbLabel },
        ]}
      />

      {/* ── Content ──────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 mt-16 md:mt-32">
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A3B2A]"></div>
          </div>
        ) : sections.length === 0 ? (
          <div className="text-center py-32 text-[#4A3B2A]/60 italic font-medium text-lg">
            This page is currently being updated. Please check back later.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-start">
            {/* Left Column: Magazine-style massive sticky header */}
            <div className="lg:col-span-4 lg:sticky lg:top-36">
              <div className="relative">
                {/* Decorative background element behind text */}
                <span className="absolute -top-10 -left-6 text-9xl text-[#4A3B2A]/5 font-serif pointer-events-none select-none">
                  {config.symbol}
                </span>
                <h2 className="relative text-5xl md:text-7xl font-black text-[#4A3B2A] uppercase leading-[0.85] tracking-tighter">
                  {config.leftHeader}
                </h2>
                <div className="w-16 h-1.5 bg-[#4A3B2A] mt-8 mb-6"></div>
                <p className="text-[#4A3B2A]/70 font-medium text-lg max-w-sm">
                  {config.leftDescription}
                </p>
              </div>
            </div>

            {/* Right Column: Search + Inverting Accordion */}
            <div className="lg:col-span-8 flex flex-col">
              {/* Search Bar */}
              <div className="relative w-full group mb-8">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#D4A373]">
                  <svg className="h-5 w-5 text-[#4A3B2A]/40 group-focus-within:text-[#D4A373] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search sections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/60 border border-[#4A3B2A]/10 focus:border-[#D4A373] focus:bg-white rounded-xl outline-none focus:ring-0 text-[#4A3B2A] placeholder:text-[#4A3B2A]/40 transition-all font-medium shadow-sm hover:shadow-md focus:shadow-lg"
                />
              </div>

              <div className="flex flex-col border-t-2 border-[#4A3B2A]">
                {filteredSections.length > 0 ? (
                  filteredSections.map((section, index) => (
                    <LegalAccordion
                      key={section._id}
                      id={`section-${section._id}`}
                      index={index}
                      heading={section.heading}
                      content={section.content}
                      isOpen={openIndex === index}
                      onClick={() => handleToggle(index)}
                    />
                  ))
                ) : (
                  <div className="py-16 text-center">
                    <div className="w-16 h-16 mx-auto bg-[#4A3B2A]/5 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-[#4A3B2A]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-[#4A3B2A]/60 italic font-medium text-lg">
                      No sections found matching "{searchQuery}"
                    </p>
                    <button 
                      onClick={() => setSearchQuery("")}
                      className="mt-4 text-[#D4A373] font-bold text-sm tracking-widest uppercase hover:text-[#4A3B2A] transition-colors cursor-pointer"
                    >
                      Clear Search
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LegalPage;
