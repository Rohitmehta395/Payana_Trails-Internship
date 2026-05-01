import React, { useEffect, useRef, useState } from "react";

const contactItems = [
  {
    id: "email",
    label: "Email Us",
    value: "info@payanatrails.com",
    href: "mailto:info@payanatrails.com",
    actionLabel: "Send a Mail",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    id: "phone",
    label: "Phone / WhatsApp",
    value: "+91 86604 60512",
    href: "https://wa.me/918660460512",
    actionLabel: "Chat on WhatsApp",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        />
      </svg>
    ),
  },
  {
    id: "meet",
    label: "Google Meet",
    value: "Schedule a virtual meeting with us",
    href: "https://calendar.app.google/UyT5meYWKpCyKy7S7",
    actionLabel: "Book a Meeting",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
        />
      </svg>
    ),
  },
];

const ContactDetailsSection = ({ data }) => {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="contact-details-section"
      ref={sectionRef}
      className="py-10 md:py-12 px-4 md:px-8 bg-[#F3EFE9] relative z-10 overflow-hidden"
    >
      {/* Subtle top divider line */}
      <div className="absolute top-0 left-8 right-8 h-[1px] bg-[#4A3B2A]/10" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div
          className="text-center mb-8"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-6 h-[1px] bg-[#4A3B2A]/30" />
            <span className="text-[#4A3B2A]/50 uppercase tracking-[0.35em] font-bold text-[12px]">
              {data?.typographyText || "Get In Touch"}
            </span>
            <div className="w-6 h-[1px] bg-[#4A3B2A]/30" />
          </div>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl text-[#4A3B2A] leading-tight tracking-tight mb-4"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 400,
              }}
            >
              {data?.titleBold || "Let's"} <span style={{ fontStyle: "italic", fontWeight: 300, color: "rgba(74,59,42,0.7)" }}>{data?.titleItalic || "Connect"}</span>
            </h2>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
          {contactItems.map((item, index) => {
            const dynamicValue = data?.[item.id] || item.value;
            let dynamicHref = item.href;
            if (item.id === "email" && data?.email) dynamicHref = `mailto:${data.email}`;
            if (item.id === "phone" && data?.phone) dynamicHref = `https://wa.me/${data.phone.replace(/[^0-9]/g, '')}`;
            if (item.id === "meet" && data?.meetLink) dynamicHref = data.meetLink;

            const cardStyle = {
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(24px)",
              transition: `opacity 0.6s ease ${0.1 + index * 0.1}s, transform 0.6s ease ${0.1 + index * 0.1}s`,
            };

            const Inner = (
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="w-10 h-10 rounded-full bg-[#4A3B2A]/8 flex items-center justify-center text-[#4A3B2A] group-hover:bg-[#4A3B2A]/15 transition-colors duration-400 shrink-0 mt-0.5">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {item.icon.props.children}
                  </svg>
                </div>

                {/* Content */}
                <div className="flex flex-col min-w-0">
                  <p className="text-[#4A3B2A]/50 uppercase tracking-[0.25em] text-[10px] font-bold mb-1">
                    {item.label}
                  </p>
                  <p className="text-[#4A3B2A] font-sans italic text-base leading-snug mb-2 truncate">
                    {dynamicValue}
                  </p>
                  {dynamicHref && (
                    <span className="inline-flex items-center gap-1.5 text-[#4A3B2A]/40 text-[10px] uppercase tracking-widest group-hover:text-[#4A3B2A]/70 transition-colors duration-400">
                      {item.actionLabel}
                      <svg
                        className="w-3 h-3 transform group-hover:translate-x-1 transition-transform duration-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </span>
                  )}
                </div>
              </div>
            );

            const cardBase =
              "group relative bg-white/60 backdrop-blur-sm border border-[#4A3B2A]/10 rounded-xl px-5 py-4 hover:shadow-xl hover:bg-white/80 hover:border-[#4A3B2A]/20 hover:-translate-y-1 transition-all duration-500";

            return dynamicHref ? (
              <a
                key={item.id}
                href={dynamicHref}
                target="_blank"
                rel="noopener noreferrer"
                className={cardBase}
                style={cardStyle}
              >
                {Inner}
              </a>
            ) : (
              <div key={item.id} className={cardBase} style={cardStyle}>
                {Inner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ContactDetailsSection;
