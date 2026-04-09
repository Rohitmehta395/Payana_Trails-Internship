import React from "react";

const ContentSection = ({ title, children, className = "" }) => (
  <section
    className={`mx-auto w-full max-w-7xl px-6 py-8 md:px-10 ${className}`}
  >
    <div className="rounded-3xl border border-[#4A3B2A]/10 bg-[#FFF9F1] p-6 shadow-[0_12px_35px_rgba(74,59,42,0.08)] md:p-8">
      <h2 className="font-serif text-3xl text-[#4A3B2A] md:text-4xl">
        {title}
      </h2>
      <div className="mt-5 text-[#5A4738] leading-relaxed">{children}</div>
    </div>
  </section>
);

export default ContentSection;
