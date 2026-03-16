import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import BrownBtn from "./buttons/BrownBtn";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUiHidden, setIsUiHidden] = useState(false); // NEW: State for Cinematic Mode

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    // NEW: Listen for the custom event from the Hero component
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
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Journeys", path: "/journeys" },
    { name: "Payana Way", path: "/payana-way" },
    { name: "Stories", path: "/stories" },
    { name: "Connect", path: "/connect" },
  ];

  return (
    <header
      // NEW: Added transform/opacity to hide the header smoothly
      className={`fixed top-0 left-0 z-50 w-full pointer-events-none transition-all duration-700 ${
        isUiHidden ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      <div className="flex justify-center w-full pt-4">
        <div
          className={`pointer-events-auto transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] 
          flex flex-col overflow-hidden bg-[#F3EFE9]
          ${
            isScrolled || isMenuOpen
              ? "w-full max-w-full rounded-none mt-[-16px] px-6 sm:px-12 shadow-md py-1 border-transparent"
              : "w-[92%] max-w-[1100px] rounded-[100px] px-6 py-1.5 shadow-lg border border-[#4A3B2A]/10"
          }`}
        >
          <div className="flex items-center justify-between h-12 sm:h-14 gap-4">
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

            <nav className="hidden lg:flex items-center justify-center flex-1">
              <div className="flex items-center text-[#4A3B2A] font-semibold text-[15px] xl:text-[17px]">
                {navItems.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <Link
                      to={item.path}
                      onClick={handleNavClick}
                      className="hover:opacity-60 transition-opacity whitespace-nowrap"
                    >
                      {item.name}
                    </Link>
                    {index < navItems.length - 1 && (
                      <span className="mx-3 opacity-20 select-none">|</span>
                    )}
                  </div>
                ))}
              </div>
            </nav>

            <div className="hidden lg:flex shrink-0">
              <Link to="/signup" onClick={handleNavClick}>
                <BrownBtn text="Sign Up" className="scale-90" />
              </Link>
            </div>

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

          <div
            className={`lg:hidden transition-all duration-500 ${isMenuOpen ? "max-h-[400px] opacity-100 pb-6" : "max-h-0 opacity-0"}`}
          >
            <nav className="flex flex-col gap-1 border-t border-[#4A3B2A]/10 pt-4">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="text-[#4A3B2A] text-lg font-bold px-4 py-2"
                  onClick={handleNavClick}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
