import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaYoutube,
  FaInstagram,
  FaWhatsapp,
  FaFacebook,
  FaLocationDot,
  FaEnvelope,
  FaPhone,
  FaLinkedin,
} from "react-icons/fa6";
import logoImg from "/logo.webp";
import { useNewsletter } from "../../context/NewsletterContext";
import { api, IMAGE_BASE_URL } from "../../services/api";

const Footer = () => {
  const { openNewsletterModal } = useNewsletter();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const result = await api.getFooter();
        if (result && Object.keys(result).length > 0) {
          setData(result);
        }
      } catch (error) {
        console.error("Failed to fetch footer data", error);
      }
    };
    fetchFooter();
  }, []);

  // --- Fallbacks / Defaults ---
  const brandLogo = data?.logo ? `${IMAGE_BASE_URL}${data.logo}` : logoImg;
  const brandName = data?.brandName || "Payana Trails";
  const subtitle = data?.subtitle || "Crafting meaningful journeys through thoughtful, immersive travel experiences.";
  const motto = data?.motto || "Journeys, thoughtfully curated!";
  const mapButtonText = data?.mapButtonText || "VIEW ON MAP";
  const mapLink = data?.mapLink || "https://maps.google.com/?q=Sowmya+Springs+Basavanagudi+Bangalore";
  const address = data?.address || "110, Sowmya Springs, Basavanagudi, Bangalore - 560 004";
  const email = data?.email || "info@payanatrails.com";
  const phone = data?.phone || "+91 8660460512";
  const copyrightText = data?.copyrightText || `© ${new Date().getFullYear()} Payana Trails. All Rights Reserved.`;

  // Social icons mapping
  const socialIconMap = {
    WhatsApp: { icon: FaWhatsapp, color: "text-[#25D366]", hover: "hover:bg-[#25D366]", defaultUrl: "https://wa.me/918660460512" },
    Facebook: { icon: FaFacebook, color: "text-[#1877F2]", hover: "hover:bg-[#1877F2]", defaultUrl: "https://www.facebook.com/payanatrails/" },
    Instagram: { icon: FaInstagram, color: "text-[#E1306C]", hover: "hover:bg-[#E1306C]", defaultUrl: "https://www.instagram.com/payanatrails/" },
    YouTube: { icon: FaYoutube, color: "text-[#FF0000]", hover: "hover:bg-[#FF0000]", defaultUrl: "https://www.youtube.com/@PayanaTrails" },
    LinkedIn: { icon: FaLinkedin, color: "text-[#0077B5]", hover: "hover:bg-[#0077B5]", defaultUrl: "https://www.linkedin.com/company/payana-trails/" },
  };

  const socialLinks = (data?.socialLinks?.length > 0 ? data.socialLinks : Object.keys(socialIconMap).map(platform => ({
    platform,
    url: socialIconMap[platform].defaultUrl
  }))).map(link => ({
    ...link,
    url: link.url || socialIconMap[link.platform]?.defaultUrl || ""
  }));

  const footerMenus = data?.columns?.length > 0 ? data.columns : [
    {
      heading: "Journeys",
      links: [
        { label: "Signature Trails", url: "/journeys/signature" },
        { label: "Wildlife Trails", url: "/journeys/wildlife" },
        { label: "Heritage Trails", url: "/journeys/heritage" },
        { label: "Cultural & Immersive Trails", url: "/journeys/cultural" },
      ],
    },
    {
      heading: "The Payana Way",
      links: [
        { label: "A Journey Begins", url: "/payana-way#ajourneybegins" },
        { label: "The Payana Difference", url: "/payana-way#the-payana-difference" },
        { label: "Journeys with Purpose", url: "/payana-way#journeys-with-purpose" },
        { label: "In the Media", url: "/payana-way#in-the-media" },
      ],
    },
    {
      heading: "Stories",
      links: [
        { label: "Travel Stories", url: "/stories#travel-stories" },
        { label: "Stories from our Guests", url: "/stories#guest-stories" },
        { label: "Voices from the Trail", url: "/stories#voices-from-the-trail" },
        { label: "Newsletter", url: "/stories#newsletter" },
      ],
    },
    {
      heading: "Connect",
      links: [
        { label: "Enquiry", url: "/connect#enquiry-section" },
        { label: "FAQs", url: "/connect#faq-section" },
        { label: "Refer Your Friends", url: "/connect#referral-section" },
        { label: "Gift a Journey", url: "/connect#gift-section" },
        { label: "Connect With Us", url: "/connect#contact-details-section" },
      ],
    },
  ];

  const bottomLinks = data?.bottomLinks?.length > 0 ? data.bottomLinks : [
    { label: "Home", url: "/" },
    { label: "Journeys", url: "/journeys" },
    { label: "Payana Way", url: "/payana-way" },
    { label: "Stories", url: "/stories" },
    { label: "Connect", url: "/connect" },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-[#4A3B2A] to-[#2E2419] w-full pt-10 pb-6 overflow-hidden font-sans">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#F3EFE9] opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 z-10">
        {/* === TOP SECTION (Logo + 4 Columns) === */}
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-8">
          {/* Left: Brand & Socials */}
          <div className="flex flex-col items-center lg:items-start gap-4 lg:w-1/4">
            <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
              <img
                src={brandLogo}
                alt={brandName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover shadow-lg border-2 border-[#F3EFE9]/20"
              />
              <span className="text-[#F3EFE9] text-2xl italic tracking-wide font-serif drop-shadow-md">
                {brandName}
              </span>
            </div>

            <p className="text-[#F3EFE9]/80 text-sm text-center lg:text-left max-w-xs leading-snug whitespace-pre-line">
              {subtitle}
            </p>

            <div className="flex gap-3 mt-1 flex-wrap justify-center lg:justify-start">
              {socialLinks.map((social, index) => {
                const config = socialIconMap[social.platform];
                if (!config || !social.url) return null;
                const Icon = config.icon;
                return (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.platform}
                    className={`group w-9 h-9 bg-[#F3EFE9] rounded-full flex items-center justify-center transition-all duration-300 shadow-md hover:-translate-y-1 ${config.hover}`}
                  >
                    <Icon
                      className={`${config.color} group-hover:text-white transition-colors duration-300`}
                      size={social.platform === "Facebook" ? 18 : 20}
                    />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Right: 4-Column Navigation */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:w-3/4 w-full mt-6 lg:mt-0">
            {footerMenus.map((menu, index) => (
              <div
                key={index}
                className="flex flex-col text-[#F3EFE9] text-left"
              >
                <h4 className="font-semibold text-[16px] mb-3 tracking-wider font-serif uppercase text-[#F3EFE9]/90 border-b border-[#F3EFE9]/20 pb-1 inline-block">
                  {menu.heading || menu.title}
                </h4>
                <ul className="flex flex-col gap-2">
                  {(menu.links || []).map((link, idx) => (
                    <li key={idx}>
                      <Link
                        to={link.url || link.path}
                        className="text-[14px] opacity-70 hover:opacity-100 hover:text-white transition-all duration-300 inline-block hover:translate-x-1"
                        onClick={() => {
                          const target = link.url || link.path;
                          if (target && !target.includes("#")) {
                            window.scrollTo(0, 0);
                          }
                        }}
                      >
                        {link.label || link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* === MIDDLE SECTION: CONTACT INFO === */}
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-6 mt-8 pt-6 border-t border-[#F3EFE9]/10 text-[#F3EFE9]">
          {/* Address */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-xl gap-2">
            <h3 className="font-bold text-[18px] tracking-wide font-serif text-[#F3EFE9] drop-shadow-sm">
              {motto}
            </h3>
            <div className="flex flex-col sm:flex-row items-center gap-3 opacity-80 group">
              {mapLink && (
                <a
                  href={mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-medium uppercase tracking-wider bg-[#F3EFE9]/10 hover:bg-[#F3EFE9]/20 text-[#F3EFE9] px-3 py-1.5 rounded-full border border-[#F3EFE9]/20 transition-all duration-300 flex items-center gap-1.5 shrink-0"
                >
                  <FaLocationDot size={12} className="text-[#F3EFE9]/70 group-hover:text-white transition-colors" />
                  {mapButtonText}
                </a>
              )}
              <address className="not-italic text-[14px] leading-snug whitespace-pre-line text-center sm:text-left">
                {address}
              </address>
            </div>
          </div>

          {/* Contact Links */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center mt-3 lg:mt-0 bg-black/10 px-4 py-3 rounded-xl border border-white/5 shadow-inner">
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-2 text-[14px] transition-all duration-300 opacity-80 hover:opacity-100 hover:text-white group"
            >
              <div className="w-8 h-8 bg-[#F3EFE9]/10 rounded-full flex items-center justify-center group-hover:bg-[#F3EFE9]/20 transition-colors">
                <FaEnvelope size={14} />
              </div>
              {email}
            </a>

            {/* Divider for larger screens */}
            <div className="hidden sm:block w-px h-6 bg-[#F3EFE9]/20"></div>

            <a
              href={`tel:${phone.replace(/\s+/g, "")}`}
              className="flex items-center gap-2 text-[14px] transition-all duration-300 opacity-80 hover:opacity-100 hover:text-white group"
            >
              <div className="w-8 h-8 bg-[#F3EFE9]/10 rounded-full flex items-center justify-center group-hover:bg-[#F3EFE9]/20 transition-colors">
                <FaPhone size={14} />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-semibold tracking-widest leading-none">
                  {phone}
                </span>
              </div>
            </a>
          </div>
        </div>

        {/* === DIVIDER === */}
        <hr className="border-[#F3EFE9] opacity-10 my-6" />

        {/* === BOTTOM SECTION === */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[#F3EFE9] text-[13px]">
          {/* Bottom inline links */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-medium tracking-wide opacity-70">
            {bottomLinks.map((link, index) => (
              <React.Fragment key={index}>
                <Link
                  to={link.url}
                  className="hover:text-white hover:opacity-100 transition-colors"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  {link.label}
                </Link>

                {index < bottomLinks.length - 1 && (
                  <span className="opacity-40 font-light select-none">|</span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Copyright */}
          <div className="font-medium tracking-wide text-center md:text-right opacity-60">
            {copyrightText}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
