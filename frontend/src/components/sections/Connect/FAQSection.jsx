import React from "react";
import { Link } from "react-router-dom";

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

const FAQSection = ({ faqs }) => {
  return (
    <section
      id="faq-section"
      className="py-10 md:py-14 px-4 md:px-8 bg-[#F3EFE9] relative z-10 overflow-hidden"
    >
      {/* Subtle background watermark */}
      <div className="absolute top-0 right-0 text-[15rem] font-serif italic font-bold text-[#F3EFE9]/40 select-none pointer-events-none z-0 tracking-tighter mix-blend-multiply hidden lg:block">
        ?
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-10">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-8 h-[1px] bg-[#D4A373]"></div>
            <span className="text-[#D4A373] uppercase tracking-[0.3em] font-bold text-xs md:text-sm">
              Knowledge Base
            </span>
            <div className="w-8 h-[1px] bg-[#D4A373]"></div>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#4A3B2A] leading-tight tracking-tight">
            Frequently Asked{" "}
            <span className="italic font-light">Questions</span>
          </h2>
          <p className="text-[#4A3B2A]/70 text-sm md:text-base max-w-2xl mx-auto mt-3">
            Everything you need to know before embarking on your Payana journey.
          </p>
        </div>

        {/* FAQ Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          {faqs.map((faq, index) => (
            <Link
              key={faq._id}
              to={`/connect/faqs#faq-${faq._id}`}
              className="group relative bg-white/60 backdrop-blur-sm p-5 rounded-2xl border border-[#4A3B2A]/10 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 block flex flex-col h-full"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4A373]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-10 h-10 rounded-full bg-[#4A3B2A]/5 flex items-center justify-center mb-4 group-hover:bg-[#D4A373]/20 transition-colors shrink-0">
                  <svg
                    className="w-5 h-5 text-[#4A3B2A] group-hover:text-[#D4A373]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {faqIcons[index % faqIcons.length]}
                  </svg>
                </div>
                <h3 className="text-xl font-serif text-[#4A3B2A] mb-2 line-clamp-2">
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
        <div className="flex justify-center mt-8">
          <div className="relative inline-block group">
            <Link
              to="/connect/faqs#faq-section"
              className="relative z-10 flex items-center justify-center px-8 py-4 bg-[#4A3B2A] text-[#F3EFE9] font-bold tracking-[0.2em] uppercase text-sm border border-[#4A3B2A] transition-all duration-500 overflow-hidden"
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
            {/* Decorative off-center outline */}
            <div className="absolute inset-0 border border-[#4A3B2A]/20 translate-x-3 translate-y-3 z-0 transition-transform duration-500 group-hover:translate-x-4 group-hover:translate-y-4"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
