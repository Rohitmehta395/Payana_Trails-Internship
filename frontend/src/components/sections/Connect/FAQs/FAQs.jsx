import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import CommonHero from "../../../common/CommonHero";
import { api } from "../../../../services/api";
import usePageHeroImages from "../../../../hooks/usePageHeroImages";

const FAQAccordion = ({ id, question, answer, isOpen, onClick, index }) => {
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
        className="w-full flex items-center py-6 md:py-8 px-4 md:px-6 focus:outline-none text-left"
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
          {question}
        </span>
        <div className="shrink-0 relative w-6 h-6 flex items-center justify-center">
          {/* A plus/cross icon built with 2 spans */}
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
              {answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const FAQs = () => {
  const { hash } = useLocation();
  const { images: heroImgs } = usePageHeroImages("connect/faqs");
  const [faqs, setFaqs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState(0); // Open the first one by default to show off the design
  const [loading, setLoading] = useState(true);

  // Filter FAQs based on search query
  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    // Reset open index when searching to avoid mismatched toggles
    setOpenIndex(searchQuery ? null : 0);
  }, [searchQuery]);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const data = await api.getFAQs();
        setFaqs(data);
        
        if (hash && hash.startsWith("#faq-")) {
          const faqId = hash.replace("#faq-", "");
          const targetIndex = data.findIndex(f => f._id === faqId);
          if (targetIndex !== -1) {
            setOpenIndex(targetIndex);
            setTimeout(() => {
              const element = document.getElementById(`faq-${faqId}`);
              if (element) {
                // Scroll accounting for sticky header
                const y = element.getBoundingClientRect().top + window.scrollY - 150;
                window.scrollTo({ top: y, behavior: "smooth" });
              }
            }, 100);
          }
        }
      } catch (err) {
        console.error("Failed to fetch FAQs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFAQs();
  }, [hash]);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-[#F3EFE9] min-h-screen pb-32">
      <CommonHero
        title="FREQUENTLY ASKED QUESTIONS"
        subtitle="EVERYTHING YOU NEED TO KNOW"
        images={heroImgs}
        breadcrumbs={[
          { label: "HOME", path: "/" },
          { label: "CONNECT", path: "/connect" },
          { label: "FAQS" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 mt-16 md:mt-32">
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A3B2A]"></div>
          </div>
        ) : faqs.length === 0 ? (
          <div className="text-center py-32 text-[#4A3B2A]/60 italic font-medium text-lg">
            No frequently asked questions are available right now. Please check
            back later.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-start">
            {/* Left Column: Magazine-style massive sticky header */}
            <div className="lg:col-span-4 lg:sticky lg:top-36">
              <div className="relative">
                {/* Decorative background element behind text */}
                <span className="absolute -top-10 -left-6 text-9xl text-[#4A3B2A]/5 font-serif pointer-events-none select-none">
                  ?
                </span>
                <h2 className="relative text-5xl md:text-7xl font-black text-[#4A3B2A] uppercase leading-[0.85] tracking-tighter">
                  CURIOUS
                  <br />
                  MINDS
                  <br />
                  ASK.
                </h2>
                <div className="w-16 h-1.5 bg-[#4A3B2A] mt-8 mb-6"></div>
                <p className="text-[#4A3B2A]/70 font-medium text-lg max-w-sm">
                  We've curated the most common questions to ensure your next
                  adventure with Payana Trails is absolutely seamless.
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
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/60 border border-[#4A3B2A]/10 focus:border-[#D4A373] focus:bg-white rounded-xl outline-none focus:ring-0 text-[#4A3B2A] placeholder:text-[#4A3B2A]/40 transition-all font-medium shadow-sm hover:shadow-md focus:shadow-lg"
                />
              </div>

              <div className="flex flex-col border-t-2 border-[#4A3B2A]">
                {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, index) => (
                  <FAQAccordion
                    key={faq._id}
                    id={`faq-${faq._id}`}
                    index={index}
                    question={faq.question}
                    answer={faq.answer}
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
                    No FAQs found matching "{searchQuery}"
                  </p>
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="mt-4 text-[#D4A373] font-bold text-sm tracking-widest uppercase hover:text-[#4A3B2A] transition-colors"
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

export default FAQs;
