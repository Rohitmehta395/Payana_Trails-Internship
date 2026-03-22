import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import BrownBtn from "./buttons/BrownBtn";

// Inline Chevron SVGs for dropdown arrows
const ChevronDown = ({ className = "" }) => (
  <svg
    className={`w-4 h-4 transition-transform ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.5"
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

const ChevronRight = ({ className = "" }) => (
  <svg
    className={`w-4 h-4 transition-transform ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.5"
      d="M9 5l7 7-7 7"
    />
  </svg>
);

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUiHidden, setIsUiHidden] = useState(false);

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

  // Updated navigation structure with nested submenus
  const navItems = [
    { name: "Home", path: "/" },
    {
      name: "Journeys",
      path: "/journeys",
      submenu: [
        { name: "Wildlife Trails", path: "/journeys/wildlife" },
        { name: "Heritage Trails", path: "/journeys/heritage" },
        { name: "Cultural & Immersive Trails", path: "/journeys/cultural" },
        {
          name: "Destinations",
          path: "/journeys/destinations",
          submenu: [
            { name: "Vietnam", path: "/destinations/vietnam" },
            { name: "Kenya", path: "/destinations/kenya" },
            { name: "Jordan", path: "/destinations/jordan" },
            { name: "India", path: "/destinations/india" },
          ],
        },
      ],
    },
    { name: "Payana Way", path: "/payana-way" },
    { name: "Stories", path: "/stories" },
    { name: "Connect", path: "/connect" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full pointer-events-none transition-all duration-700 ${
        isUiHidden ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      <div className="flex justify-center w-full pt-4">
        {/* Removed overflow-hidden from this wrapper so absolute dropdowns can bleed out */}
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
                        >
                          {item.name}
                          <ChevronDown />
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
                                    >
                                      {sub.name}
                                      <ChevronRight />
                                    </Link>

                                    {/* Secondary Dropdown Container */}
                                    <div className="absolute left-full top-0 hidden group-hover/sub:block w-[200px] pl-2">
                                      <div className="bg-[#F3EFE9] rounded-2xl shadow-xl border border-[#4A3B2A]/10 p-2 flex flex-col gap-1">
                                        {sub.submenu.map((sub2, s2Idx) => (
                                          <Link
                                            key={s2Idx}
                                            to={sub2.path}
                                            className="px-4 py-2 hover:bg-[#E3D5C4] rounded-xl transition-colors"
                                            onClick={handleNavClick}
                                          >
                                            {sub2.name}
                                          </Link>
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

            {/* Desktop Sign Up Button */}
            <div className="hidden lg:flex shrink-0">
              <Link to="/signup" onClick={handleNavClick}>
                <BrownBtn text="Sign Up" className="scale-90" />
              </Link>
            </div>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-[#4A3B2A]"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                {isMenuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M3 12h18M3 6h18M3 18h18" />
                )}
              </svg>
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
                          <ChevronDown
                            className={
                              mobileMenuState[item.name] ? "rotate-180" : ""
                            }
                          />
                        </button>
                      </div>

                      {/* First Level Mobile Submenu */}
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          mobileMenuState[item.name]
                            ? "max-h-[500px]"
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
                                      <ChevronDown
                                        className={
                                          mobileMenuState[sub.name]
                                            ? "rotate-180"
                                            : ""
                                        }
                                      />
                                    </button>
                                  </div>

                                  {/* Second Level Mobile Submenu */}
                                  <div
                                    className={`overflow-hidden transition-all duration-300 ${
                                      mobileMenuState[sub.name]
                                        ? "max-h-[300px]"
                                        : "max-h-0"
                                    }`}
                                  >
                                    <div className="pl-4 flex flex-col gap-2 pt-2 border-l-2 border-[#4A3B2A]/10 ml-2 mt-1">
                                      {sub.submenu.map((sub2, s2Idx) => (
                                        <Link
                                          key={s2Idx}
                                          to={sub2.path}
                                          className="text-[#4A3B2A]/70 text-sm font-medium hover:text-[#4A3B2A]"
                                          onClick={handleNavClick}
                                        >
                                          {sub2.name}
                                        </Link>
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

              {/* Mobile Sign Up Button */}
              <div className="px-4 py-4 mt-2 border-t border-[#4A3B2A]/10">
                <Link to="/signup" onClick={handleNavClick}>
                  <BrownBtn
                    text="Sign Up"
                    className="w-full justify-center flex"
                  />
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
