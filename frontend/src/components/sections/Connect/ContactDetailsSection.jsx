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

const ContactDetailsSection = () => {
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
      className="py-12 md:py-12 px-4 md:px-8 bg-[#F3EFE9] relative z-10 overflow-hidden"
    >
      {/* Large decorative watermark */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18rem] font-serif italic font-bold select-none pointer-events-none z-0 tracking-tighter hidden lg:block"
        style={{ color: "rgba(74,59,42,0.04)" }}
      >
        Hello
      </div>

      {/* Subtle top divider line */}
      <div className="absolute top-0 left-8 right-8 h-[1px] bg-[#4A3B2A]/10" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div
          className="text-center mb-16 md:mb-20"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(28px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-8 h-[1px] bg-[#4A3B2A]/30" />
            <span className="text-[#4A3B2A]/50 uppercase tracking-[0.35em] font-bold text-xs md:text-sm">
              Get In Touch
            </span>
            <div className="w-8 h-[1px] bg-[#4A3B2A]/30" />
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#4A3B2A] leading-tight tracking-tight mb-5">
            Let's{" "}
            <span className="italic font-light text-[#4A3B2A]/80">Connect</span>
          </h2>

          <p className="text-[#4A3B2A]/60 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Whether you have a question, a dream destination, or simply wish to
            say hello — we are always here for you.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {contactItems.map((item, index) => {
            const cardStyle = {
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(36px)",
              transition: `opacity 0.65s ease ${0.15 + index * 0.12}s, transform 0.65s ease ${0.15 + index * 0.12}s`,
            };

            const Inner = (
              <div className="flex flex-col h-full">
                {/* Icon */}
                <div className="w-12 h-12 rounded-full bg-[#4A3B2A]/8 flex items-center justify-center mb-6 text-[#4A3B2A] group-hover:bg-[#4A3B2A]/15 transition-colors duration-400 shrink-0">
                  {item.icon}
                </div>

                {/* Label */}
                <p className="text-[#4A3B2A]/50 uppercase tracking-[0.28em] text-[10px] font-bold mb-2">
                  {item.label}
                </p>

                {/* Value */}
                <p className="text-[#4A3B2A] font-sans italic text-xl leading-snug mt-auto">
                  {item.value}
                </p>

                {/* Bottom action link */}
                {item.href && (
                  <div className="mt-5 pt-5 border-t border-[#4A3B2A]/10">
                    <span className="inline-flex items-center gap-2 text-[#4A3B2A]/40 text-xs uppercase tracking-widest group-hover:text-[#4A3B2A]/70 transition-colors duration-400">
                      {item.actionLabel}
                      <svg
                        className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform duration-400"
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
                  </div>
                )}
              </div>
            );

            const cardBase =
              "group relative bg-white/60 backdrop-blur-sm border border-[#4A3B2A]/10 rounded-2xl p-7 hover:shadow-xl hover:bg-white/80 hover:border-[#4A3B2A]/20 hover:-translate-y-1 transition-all duration-500 flex flex-col";

            return item.href ? (
              <a
                key={item.id}
                href={item.href}
                target={item.id !== "email" ? "_blank" : undefined}
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
