import React from "react";
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
import logoImg from "/logo.svg";
import { useNewsletter } from "../../context/NewsletterContext";

const Footer = () => {
  const { openNewsletterModal } = useNewsletter();
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Journeys", path: "/journeys" },
    { name: "Payana Way", path: "/payana-way" },
    { name: "Stories", path: "/stories" },
    { name: "Connect", path: "/connect" },
  ];

  // Social media icons
  const socialLinks = [
    {
      name: "WhatsApp",
      icon: (
        <FaWhatsapp
          className="text-[#25D366] group-hover:text-white transition-colors duration-300"
          size={20}
        />
      ),
      href: "https://wa.me/918660460512",
      bgHover: "hover:bg-[#25D366]",
    },
    {
      name: "Facebook",
      icon: (
        <FaFacebook
          className="text-[#1877F2] group-hover:text-white transition-colors duration-300"
          size={18}
        />
      ),
      href: "https://www.facebook.com/payanatrails/",
      bgHover: "hover:bg-[#1877F2]",
    },
    {
      name: "Instagram",
      icon: (
        <FaInstagram
          className="text-[#E1306C] group-hover:text-white transition-colors duration-300"
          size={20}
        />
      ),
      href: "https://www.instagram.com/payanatrails/",
      bgHover: "hover:bg-[#E1306C]",
    },
    {
      name: "YouTube",
      icon: (
        <FaYoutube
          className="text-[#FF0000] group-hover:text-white transition-colors duration-300"
          size={20}
        />
      ),
      href: "https://www.youtube.com/@PayanaTrails",
      bgHover: "hover:bg-[#FF0000]",
    },
    // Added LinkedIn here
    {
      name: "LinkedIn",
      icon: (
        <FaLinkedin
          className="text-[#0077B5] group-hover:text-white transition-colors duration-300"
          size={20}
        />
      ),
      href: "https://www.linkedin.com/company/payana-trails/",
      bgHover: "hover:bg-[#0077B5]",
    },
  ];

  const footerMenus = [
    {
      title: "Journeys",
      links: [
        { name: "Signature Trails", path: "/journeys/signature" },
        { name: "Wildlife Trails", path: "/journeys/wildlife" },
        { name: "Heritage Trails", path: "/journeys/heritage" },
        { name: "Cultural & Immersive Trails", path: "/journeys/cultural" },
      ],
    },
    {
      title: "The Payana Way",
      links: [
        { name: "A Journey Begins", path: "/journey" },
        { name: "The Payana Difference", path: "/philosophy" },
        { name: "Responsible Travel", path: "/responsible-travel" },
        { name: "In the Media", path: "/media" },
      ],
    },
    {
      title: "Stories",
      links: [
        { name: "Travel Stories", path: "/stories" },
        { name: "Voices from the Trail", path: "/voices" },
        { name: "Newsletter", path: "/newsletter" },
      ],
    },
    {
      title: "Connect",
      links: [
        { name: "Enquiry", path: "/connect/enquiry" },
        { name: "Connect With Us", path: "/connect" },
        { name: "FAQs", path: "/connect/faqs" },
        { name: "Refer Your Friends", path: "/connect#referral-section" },
        { name: "Gift a Journey", path: "/connect#gift-section" },
      ],
    },
  ];

  const currentYear = new Date().getFullYear();

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
                src={logoImg}
                alt="Payana Trails"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover shadow-lg border-2 border-[#F3EFE9]/20"
              />
              <span className="text-[#F3EFE9] text-2xl italic tracking-wide font-serif drop-shadow-md">
                Payana Trails
              </span>
            </div>

            <p className="text-[#F3EFE9]/80 text-sm text-center lg:text-left max-w-xs leading-snug">
              Crafting meaningful journeys through thoughtful, immersive travel experiences.
            </p>

            <div className="flex gap-3 mt-1 flex-wrap justify-center lg:justify-start">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className={`group w-9 h-9 bg-[#F3EFE9] rounded-full flex items-center justify-center transition-all duration-300 shadow-md hover:-translate-y-1 ${social.bgHover}`}
                >
                  {social.icon}
                </a>
              ))}
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
                  {menu.title}
                </h4>
                <ul className="flex flex-col gap-2">
                  {menu.links.map((link, idx) => (
                    <li key={idx}>
                      <Link
                        to={link.path}
                        className="text-[14px] opacity-70 hover:opacity-100 hover:text-white transition-all duration-300 inline-block hover:translate-x-1"
                        onClick={(e) => {
                          if (link.name === "Newsletter") {
                            e.preventDefault();
                            openNewsletterModal();
                          } else {
                            if (!link.path.includes("#")) {
                              window.scrollTo(0, 0);
                            }
                          }
                        }}
                      >
                        {link.name}
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
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-md gap-2">
            <h3 className="font-bold text-[18px] tracking-wide font-serif text-[#F3EFE9] drop-shadow-sm">
              Journeys, thoughtfully curated!
            </h3>
            <div className="flex items-start gap-2 opacity-80">
              <FaLocationDot
                className="mt-1 text-[#F3EFE9]/70 shrink-0"
                size={14}
              />
              <address className="not-italic text-[14px] leading-snug">
                110, Sowmya Springs, Basavanagudi, Bangalore - 560 004
              </address>
            </div>
          </div>

          {/* Contact Links */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center mt-3 lg:mt-0 bg-black/10 px-4 py-3 rounded-xl border border-white/5 shadow-inner">
            <a
              href="mailto:info@payanatrails.com"
              className="flex items-center gap-2 text-[14px] transition-all duration-300 opacity-80 hover:opacity-100 hover:text-white group"
            >
              <div className="w-8 h-8 bg-[#F3EFE9]/10 rounded-full flex items-center justify-center group-hover:bg-[#F3EFE9]/20 transition-colors">
                <FaEnvelope size={14} />
              </div>
              info@payanatrails.com
            </a>

            {/* Divider for larger screens */}
            <div className="hidden sm:block w-px h-6 bg-[#F3EFE9]/20"></div>

            <a
              href="tel:+918660460512"
              className="flex items-center gap-2 text-[14px] transition-all duration-300 opacity-80 hover:opacity-100 hover:text-white group"
            >
              <div className="w-8 h-8 bg-[#F3EFE9]/10 rounded-full flex items-center justify-center group-hover:bg-[#F3EFE9]/20 transition-colors">
                <FaPhone size={14} />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-semibold tracking-widest leading-none">
                  +91 8660460512
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
            {navLinks.map((link, index) => (
              <React.Fragment key={index}>
                <Link
                  to={link.path}
                  className="hover:text-white hover:opacity-100 transition-colors"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  {link.name}
                </Link>

                {index < navLinks.length - 1 && (
                  <span className="opacity-40 font-light select-none">|</span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Copyright */}
          <div className="font-medium tracking-wide text-center md:text-right opacity-60">
            © {currentYear} Payana Trails. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
