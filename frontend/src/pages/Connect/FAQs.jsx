import React, { useState, useEffect } from "react";
import CommonHero from "../../components/common/CommonHero";
import usePageHeroImages from "../../hooks/usePageHeroImages";
import { api } from "../../services/api";

const FAQAccordion = ({ question, answer, isOpen, onClick, index }) => {
  const num = (index + 1).toString().padStart(2, "0");

  return (
    <div
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
        <span className={`font-bold text-lg md:text-2xl flex-1 pr-6 tracking-wide transition-colors duration-200 ${isOpen ? "text-[#4A3B2A]" : "text-[#4A3B2A]/80"}`}>
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
          isOpen ? "grid-rows-[1fr] opacity-100 pb-8" : "grid-rows-[0fr] opacity-0 pb-0"
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
  const { images: heroImgs } = usePageHeroImages("connect/faqs");
  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(0); // Open the first one by default to show off the design
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const data = await api.getFAQs();
        setFaqs(data);
      } catch (err) {
        console.error("Failed to fetch FAQs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFAQs();
  }, []);

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
            No frequently asked questions are available right now. Please check back later.
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
                  CURIOUS<br />MINDS<br />ASK.
                </h2>
                <div className="w-16 h-1.5 bg-[#4A3B2A] mt-8 mb-6"></div>
                <p className="text-[#4A3B2A]/70 font-medium text-lg max-w-sm">
                  We've curated the most common questions to ensure your next adventure with Payana Trails is absolutely seamless.
                </p>
              </div>
            </div>

            {/* Right Column: Inverting Accordion */}
            <div className="lg:col-span-8 flex flex-col border-t-2 border-[#4A3B2A]">
              {faqs.map((faq, index) => (
                <FAQAccordion
                  key={faq._id}
                  index={index}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openIndex === index}
                  onClick={() => handleToggle(index)}
                />
              ))}
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQs;
