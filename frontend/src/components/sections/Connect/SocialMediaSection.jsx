import React, { useEffect, useRef, useState } from "react";
import {
  FaWhatsapp,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa";

const socialLinks = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    handle: "+91 86604 60512",
    href: "https://wa.me/918660460512",
    Icon: FaWhatsapp,
    brandColor: "#25D366",
    brandBg: "#25D366",
  },
  {
    id: "facebook",
    name: "Facebook",
    handle: "payanatrails",
    href: "https://www.facebook.com/payanatrails/",
    Icon: FaFacebookF,
    brandColor: "#1877F2",
    brandBg: "#1877F2",
  },
  {
    id: "instagram",
    name: "Instagram",
    handle: "@payanatrails",
    href: "https://www.instagram.com/payanatrails/",
    Icon: FaInstagram,
    brandColor: "#E1306C",
    brandBg:
      "radial-gradient(circle at 30% 107%, #ffd676 0%, #f86442 25%, #E1306C 50%, #962fbf 75%, #4f5bd5 100%)",
    isGradient: true,
  },
  {
    id: "youtube",
    name: "YouTube",
    handle: "@PayanaTrails",
    href: "https://www.youtube.com/@PayanaTrails",
    Icon: FaYoutube,
    brandColor: "#FF0000",
    brandBg: "#FF0000",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    handle: "payana-trails",
    href: "https://www.linkedin.com/company/payana-trails/",
    Icon: FaLinkedinIn,
    brandColor: "#0A66C2",
    brandBg: "#0A66C2",
  },
];

const SocialCard = ({ social, visible, index }) => {
  const [hovered, setHovered] = useState(false);

  const iconBg = hovered
    ? social.isGradient
      ? social.brandBg
      : social.brandBg
    : "rgba(74,59,42,0.06)";

  const iconColor = hovered ? "#ffffff" : "rgba(74,59,42,0.6)";

  return (
    <a
      key={social.id}
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex items-center gap-4 bg-white/60 border border-[#4A3B2A]/10 rounded-2xl px-6 py-5 hover:shadow-xl hover:bg-white/80 hover:border-[#4A3B2A]/20 hover:-translate-y-1 transition-all duration-400 w-full sm:w-auto sm:min-w-[210px]"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.6s ease ${0.1 + index * 0.1}s, transform 0.6s ease ${0.1 + index * 0.1}s, background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease, translate 0.4s ease`,
      }}
    >
      {/* Icon circle */}
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-400"
        style={{
          background: iconBg,
          color: iconColor,
        }}
      >
        <social.Icon size={22} />
      </div>

      {/* Text */}
      <div className="text-left flex-1 min-w-0">
        <p
          className="text-[#4A3B2A] font-semibold text-base leading-tight truncate"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {social.name}
        </p>
        <p
          className="text-[#4A3B2A]/45 text-xs mt-0.5 group-hover:text-[#4A3B2A]/65 transition-colors duration-400 truncate"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {social.handle}
        </p>
      </div>

      {/* Arrow */}
      <svg
        className="w-4 h-4 text-[#4A3B2A]/30 ml-auto group-hover:text-[#4A3B2A]/70 group-hover:translate-x-1 transition-all duration-400 shrink-0"
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
    </a>
  );
};

const SocialMediaSection = ({ data }) => {
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
      { threshold: 0.12 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="social-media-section"
      ref={sectionRef}
      className="py-8 md:py-12 px-4 md:px-8 bg-[#F3EFE9] relative z-10 overflow-hidden"
    >
      {/* Watermark */}
      <div
        className="absolute -bottom-8 right-10 text-[16rem] font-bold select-none pointer-events-none z-0 hidden lg:block leading-none"
        style={{
          color: "rgba(74,59,42,0.04)",
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
        }}
      >
        Social
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div
          className="text-center mb-12 md:mb-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.65s ease, transform 0.65s ease",
          }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-6 sm:w-8 h-[1px] bg-[#4A3B2A]/30"></div>
            <span className="text-[#4A3B2A]/50 uppercase tracking-[0.25em] sm:tracking-[0.35em] font-bold text-[10px] sm:text-[12px]">
              Follow Our Journey
            </span>
            <div className="w-6 sm:w-8 h-[1px] bg-[#4A3B2A]/30"></div>
          </div>

          <h2
            className="text-3xl sm:text-4xl lg:text-5xl text-[#4A3B2A] leading-tight tracking-tight mb-4 px-4 sm:px-0"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 400,
            }}
          >
            {data?.titleBold || "Follow Our"}{" "}
            <span
              style={{
                fontStyle: "italic",
                fontWeight: 300,
                color: "rgba(74,59,42,0.7)",
              }}
            >
              {data?.titleItalic || "Journey"}
            </span>
          </h2>

          <p
            className="text-[#4A3B2A]/55 text-sm sm:text-base md:text-lg max-w-lg mx-auto leading-relaxed px-6 sm:px-0"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
          >
            {data?.subtitle ||
              "Join our community across platforms and be the first to discover new trails, stories, and journeys."}
          </p>
        </div>

        {/* Social Cards */}
        <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 md:gap-5 w-full max-w-2xl sm:max-w-none mx-auto px-4 sm:px-0">
          {socialLinks.map((social, index) => {
            const dynamicItem = data?.items && data.items[index];
            const activeLink = {
              ...social,
              name: dynamicItem?.text || social.name,
              href: dynamicItem?.link || social.href,
            };
            if (!activeLink.href) return null;

            return (
              <SocialCard
                key={social.id}
                social={activeLink}
                visible={visible}
                index={index}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SocialMediaSection;
