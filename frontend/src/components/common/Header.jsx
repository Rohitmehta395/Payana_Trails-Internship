import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import { api } from "../../services/api";
import {
  DESTINATION_GEOGRAPHIES,
  buildDestinationListingPath,
  getDestinationGeography,
} from "../../constants/destinationGeographies";

// Importing React Icons
import { FiChevronDown, FiChevronRight, FiMenu, FiX } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

const buildDestinationsSubmenu = (destinations) =>
  DESTINATION_GEOGRAPHIES.map((geography) => {
    const countries = destinations
      .filter(
        (destination) => getDestinationGeography(destination) === geography,
      )
      .map((destination) => ({
        name: destination.name,
        path: buildDestinationListingPath({
          geography,
          destination: destination.name,
        }),
      }));

    return {
      name: geography,
      path: buildDestinationListingPath({ geography }),
      submenu: countries.length > 0 ? countries : undefined,
    };
  });

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUiHidden, setIsUiHidden] = useState(false);
  const [destinations, setDestinations] = useState([]);

  const location = useLocation();
  // State to track which mobile submenus are open
  const [mobileMenuState, setMobileMenuState] = useState({});

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleUiToggle = (e) => {
      setIsUiHidden(e.detail);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("toggle-ui-mode", handleUiToggle);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("toggle-ui-mode", handleUiToggle);
    };
  }, []);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await api.getDestinations();
        setDestinations(data);
      } catch (error) {
        console.error("Error fetching header destinations:", error);
      }
    };

    fetchDestinations();
  }, []);

  const handleNavClick = () => {
    window.scrollTo(0, 0);
    setIsMenuOpen(false);
    setMobileMenuState({});
  };

  const toggleMobileMenu = (menuName, e) => {
    e.preventDefault();
    setMobileMenuState((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  const destinationSubmenu = buildDestinationsSubmenu(destinations);

  // Updated navigation structure with nested submenus
  const navItems = [
    { name: "Home", path: "/" },
    {
      name: "Journeys",
      path: "/journeys",
      submenu: [
        {
          name: "Trails",
          path: "/journeys",
          submenu: [
            { name: "Signature Trails", path: "/journeys/signature" },
            { name: "Wildlife Trails", path: "/journeys/wildlife" },
            { name: "Heritage Trails", path: "/journeys/heritage" },
            { name: "Cultural & Immersive Trails", path: "/journeys/cultural" },
          ],
        },
        {
          name: "Destinations",
          path: buildDestinationListingPath(),
          submenu: destinationSubmenu,
        },
      ],
    },
    { name: "Payana Way", path: "/payana-way" },
    // { name: "Stories", path: "/stories" },
    { name: "Connect", path: "/connect" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full pointer-events-none transition-all duration-700 ${
        isUiHidden ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      <div className="flex justify-center w-full pt-4">
        <div
          className={`pointer-events-auto transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] 
          flex flex-col bg-[#F3EFE9]
          ${
            isScrolled || isMenuOpen
              ? "w-full max-w-full rounded-none mt-[-16px] px-6 sm:px-12 shadow-md py-1 border-transparent"
              : "w-[92%] max-w-[1100px] rounded-[100px] px-6 py-1.5 shadow-lg border border-[#4A3B2A]/10"
          }`}
        >
          {/* Top Bar (Logo, Desktop Nav, Hamburger) */}
          <div className="flex items-center justify-between h-12 sm:h-14 gap-4 relative z-20">
            <Link
              to="/"
              className="flex items-center gap-2 shrink-0 group"
              onClick={handleNavClick}
            >
              <img
                src={logo}
                alt="Payana Trails Logo"
                className="h-8 w-auto sm:h-10 transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    "https://placehold.co/150x70/F3EFE9/4A3B2A?text=Logo";
                }}
              />
              <span className="text-[#4A3B2A] text-lg lg:text-xl font-serif italic font-semibold whitespace-nowrap">
                Payana Trails
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center justify-center flex-1">
              <div className="flex items-center text-[#4A3B2A] font-semibold text-[15px] xl:text-[17px]">
                {navItems.map((item, index) => (
                  <div key={index} className="flex items-center">
                    {/* Render Dropdown logic if submenu exists */}
                    {item.submenu ? (
                      <div className="relative group">
                        <Link
                          to={item.path}
                          className="flex items-center gap-1 hover:opacity-60 transition-opacity whitespace-nowrap py-4"
                          onClick={handleNavClick}
                        >
                          {item.name}
                          <FiChevronDown className="w-4 h-4 transition-transform" />
                        </Link>

                        {/* Primary Dropdown Container */}
                        <div className="absolute left-0 top-full hidden group-hover:block w-[260px] pt-2">
                          <div className="bg-[#F3EFE9] rounded-2xl shadow-xl border border-[#4A3B2A]/10 p-2 flex flex-col gap-1 relative z-50">
                            {item.submenu.map((sub, sIdx) => (
                              <div key={sIdx}>
                                {/* Nested Dropdown (Destinations) */}
                                {sub.submenu ? (
                                  <div className="relative group/sub">
                                    <Link
                                      to={sub.path}
                                      className="flex items-center justify-between px-4 py-2.5 hover:bg-[#E3D5C4] rounded-xl transition-colors cursor-pointer"
                                      onClick={handleNavClick}
                                    >
                                      {sub.name}
                                      <FiChevronRight className="w-4 h-4 transition-transform" />
                                    </Link>

                                    {/* Secondary Dropdown Container */}
                                    <div className="absolute left-full top-0 hidden group-hover/sub:block w-[300px] pl-2">
                                      <div className="bg-[#F3EFE9] rounded-2xl shadow-xl border border-[#4A3B2A]/10 p-2 flex flex-col gap-1 max-h-[240px] overflow-y-auto custom-scrollbar">
                                        {sub.submenu.map((sub2, s2Idx) => (
                                          <div key={s2Idx}>
                                            {sub2.submenu ? (
                                              <div className="relative group/sub2">
                                                <Link
                                                  to={sub2.path}
                                                  className="flex items-center justify-between px-4 py-2.5 hover:bg-[#E3D5C4] rounded-xl transition-colors"
                                                  onClick={handleNavClick}
                                                >
                                                  {sub2.name}
                                                  <FiChevronDown className="w-4 h-4 transition-transform group-hover/sub2:rotate-180" />
                                                </Link>

                                                <div className="hidden group-hover/sub2:block mt-1 pr-2">
                                                  <div className="bg-[#4A3B2A]/5 rounded-xl p-1 flex flex-col gap-0.5">
                                                    {sub2.submenu.map(
                                                      (sub3, s3Idx) => (
                                                        <Link
                                                          key={s3Idx}
                                                          to={sub3.path}
                                                          className="px-4 py-1.5 hover:bg-[#E3D5C4] rounded-lg text-[13.5px] opacity-80 hover:opacity-100 transition-all font-medium"
                                                          onClick={
                                                            handleNavClick
                                                          }
                                                        >
                                                          {sub3.name}
                                                        </Link>
                                                      ),
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            ) : (
                                              <Link
                                                to={sub2.path}
                                                className="block px-4 py-2 hover:bg-[#E3D5C4] rounded-xl transition-colors"
                                                onClick={handleNavClick}
                                              >
                                                {sub2.name}
                                              </Link>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  /* Standard Dropdown Link */
                                  <Link
                                    to={sub.path}
                                    className="block px-4 py-2.5 hover:bg-[#E3D5C4] rounded-xl transition-colors"
                                    onClick={handleNavClick}
                                  >
                                    {sub.name}
                                  </Link>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Standard Link (No Dropdown) */
                      <Link
                        to={item.path}
                        onClick={handleNavClick}
                        className="hover:opacity-60 transition-opacity whitespace-nowrap py-4"
                      >
                        {item.name}
                      </Link>
                    )}

                    {/* Separator Line */}
                    {index < navItems.length - 1 && (
                      <span className="mx-3 opacity-20 select-none">|</span>
                    )}
                  </div>
                ))}
              </div>
            </nav>

            {/* ====== MODIFIED DESKTOP CONTACT BUTTON ====== */}
            <div className="hidden lg:flex shrink-0">
              <div className="flex items-center bg-[#4A3B2A] text-[#F3EFE9] rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 overflow-hidden">
                {/* WhatsApp Icon Link */}
                <a
                  href="https://wa.me/918660460512?text=Hello!%20I%20would%20like%20to%20plan%20a%20journey%20with%20Payana%20Trails."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center pl-5 pr-3 py-2 hover:bg-[#68533B] transition-colors border-r border-[#F3EFE9]/20"
                  title="Chat on WhatsApp"
                >
                  <FaWhatsapp className="w-4 h-4" />
                </a>
                {/* Phone Number Link */}
                <a
                  href="tel:+918660460512"
                  className="pr-5 pl-3 py-2 text-[14px] font-medium hover:bg-[#68533B] transition-colors tracking-wide"
                  title="Call Us"
                >
                  +91 86604 60512
                </a>
              </div>
            </div>
            {/* =============================================== */}

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-[#4A3B2A]"
            >
              {isMenuOpen ? (
                <FiX className="w-6 h-6" strokeWidth="2.5" />
              ) : (
                <FiMenu className="w-6 h-6" strokeWidth="2.5" />
              )}
            </button>
          </div>

          {/* Mobile Navigation Dropdown */}
          <div
            className={`lg:hidden transition-all duration-500 overflow-hidden ${
              isMenuOpen
                ? "max-h-[80vh] opacity-100 pb-6 overflow-y-auto"
                : "max-h-0 opacity-0"
            }`}
          >
            <nav className="flex flex-col gap-1 border-t border-[#4A3B2A]/10 pt-4">
              {navItems.map((item, index) => (
                <div key={index}>
                  {/* Mobile Dropdown Logic */}
                  {item.submenu ? (
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between px-4 py-2">
                        <Link
                          to={item.path}
                          className="text-[#4A3B2A] text-lg font-semibold flex-1"
                          onClick={handleNavClick}
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={(e) => toggleMobileMenu(item.name, e)}
                          className="p-2 text-[#4A3B2A] bg-[#4A3B2A]/5 rounded-md"
                        >
                          <FiChevronDown
                            className={`w-4 h-4 transition-transform ${
                              mobileMenuState[item.name] ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </div>

                      {/* First Level Mobile Submenu */}
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          mobileMenuState[item.name]
                            ? "max-h-[1000px]"
                            : "max-h-0"
                        }`}
                      >
                        <div className="pl-6 flex flex-col gap-2 pt-2 border-l-2 border-[#4A3B2A]/10 ml-6 mb-2">
                          {item.submenu.map((sub, sIdx) => (
                            <div key={sIdx}>
                              {sub.submenu ? (
                                <div className="flex flex-col">
                                  <div className="flex items-center justify-between pr-4">
                                    <Link
                                      to={sub.path}
                                      className="text-[#4A3B2A]/90 text-base font-medium flex-1"
                                      onClick={handleNavClick}
                                    >
                                      {sub.name}
                                    </Link>
                                    <button
                                      onClick={(e) =>
                                        toggleMobileMenu(sub.name, e)
                                      }
                                      className="p-1.5 text-[#4A3B2A] bg-[#4A3B2A]/5 rounded-md"
                                    >
                                      <FiChevronDown
                                        className={`w-4 h-4 transition-transform ${
                                          mobileMenuState[sub.name]
                                            ? "rotate-180"
                                            : ""
                                        }`}
                                      />
                                    </button>
                                  </div>

                                  {/* Second Level Mobile Submenu */}
                                  <div
                                    className={`overflow-hidden transition-all duration-300 ${
                                      mobileMenuState[sub.name]
                                        ? "max-h-[600px]"
                                        : "max-h-0"
                                    }`}
                                  >
                                    <div className="pl-4 flex flex-col gap-2 pt-2 border-l-2 border-[#4A3B2A]/10 ml-2 mt-1">
                                      {sub.submenu.map((sub2, s2Idx) => (
                                        <div key={s2Idx}>
                                          {sub2.submenu ? (
                                            <div className="flex flex-col">
                                              <div className="flex items-center justify-between pr-4">
                                                <Link
                                                  to={sub2.path}
                                                  className="text-[#4A3B2A]/80 text-sm font-medium flex-1"
                                                  onClick={handleNavClick}
                                                >
                                                  {sub2.name}
                                                </Link>
                                                <button
                                                  onClick={(e) =>
                                                    toggleMobileMenu(
                                                      sub2.name,
                                                      e,
                                                    )
                                                  }
                                                  className="p-1.5 text-[#4A3B2A] bg-[#4A3B2A]/5 rounded-md"
                                                >
                                                  <FiChevronDown
                                                    className={`w-4 h-4 transition-transform ${
                                                      mobileMenuState[sub2.name]
                                                        ? "rotate-180"
                                                        : ""
                                                    }`}
                                                  />
                                                </button>
                                              </div>

                                              <div
                                                className={`overflow-hidden transition-all duration-300 ${
                                                  mobileMenuState[sub2.name]
                                                    ? "max-h-[500px]"
                                                    : "max-h-0"
                                                }`}
                                              >
                                                <div className="pl-4 flex flex-col gap-2 pt-2 border-l-2 border-[#4A3B2A]/10 ml-2 mt-1">
                                                  {sub2.submenu.map(
                                                    (sub3, s3Idx) => (
                                                      <Link
                                                        key={s3Idx}
                                                        to={sub3.path}
                                                        className="text-[#4A3B2A]/70 text-sm font-medium hover:text-[#4A3B2A]"
                                                        onClick={handleNavClick}
                                                      >
                                                        {sub3.name}
                                                      </Link>
                                                    ),
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          ) : (
                                            <Link
                                              to={sub2.path}
                                              className="text-[#4A3B2A]/70 text-sm font-medium hover:text-[#4A3B2A]"
                                              onClick={handleNavClick}
                                            >
                                              {sub2.name}
                                            </Link>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <Link
                                  to={sub.path}
                                  className="text-[#4A3B2A]/90 text-base font-medium block pr-4"
                                  onClick={handleNavClick}
                                >
                                  {sub.name}
                                </Link>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Standard Mobile Link */
                    <Link
                      to={item.path}
                      className="text-[#4A3B2A] text-lg font-semibold px-4 py-2 block"
                      onClick={handleNavClick}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}

              {/* ====== MODIFIED MOBILE CONTACT BUTTON ====== */}
              <div className="px-4 py-4 mt-2 border-t border-[#4A3B2A]/10">
                <div className="flex items-center w-full bg-[#4A3B2A] text-[#F3EFE9] rounded-full shadow-md overflow-hidden text-[16px] font-medium">
                  {/* WhatsApp Icon Link */}
                  <a
                    href="https://wa.me/918660460512?text=Hello!%20I%20would%20like%20to%20plan%20a%20journey%20with%20Payana%20Trails."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center py-3 px-5 hover:bg-[#68533B] transition-colors duration-300 border-r border-[#F3EFE9]/20"
                    title="Chat on WhatsApp"
                  >
                    <FaWhatsapp className="w-5 h-5" />
                  </a>
                  {/* Phone Number Link */}
                  <a
                    href="tel:+918660460512"
                    className="flex-1 flex items-center justify-center py-3 hover:bg-[#68533B] transition-colors duration-300 tracking-wide"
                    title="Call Us"
                  >
                    +91 86604 60512
                  </a>
                </div>
              </div>
              {/* ============================================== */}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
