import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BrownBtn from "../../common/buttons/BrownBtn";
import { api, IMAGE_BASE_URL } from "../../../services/api";

// Fallback image (current hardcoded image as backup)
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000";

const DEFAULT_CONTENT = {
  italicText: "Every Payana journey\nis carefully designed",
  normalText:
    "to balance exploration with comfort and time to absorb the landscape.",
  image: "",
};

// Render text with preserved line breaks
const renderWithBreaks = (text) =>
  text.split("\n").map((line, idx) => (
    <React.Fragment key={idx}>
      {idx > 0 && <br />}
      {line}
    </React.Fragment>
  ));

export default function PayanaJourneyFocused() {
  const [mounted, setMounted] = useState(false);
  const [content, setContent] = useState(DEFAULT_CONTENT);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await api.getJourneyPage();
        if (data?.payanaJourney) {
          setContent({
            italicText:
              data.payanaJourney.italicText || DEFAULT_CONTENT.italicText,
            normalText:
              data.payanaJourney.normalText || DEFAULT_CONTENT.normalText,
            image: data.payanaJourney.image || "",
          });
        }
      } catch (err) {
        console.error("Failed to load Payana Journey section content:", err);
      }
    };
    fetchContent();
  }, []);

  // Resolve image URL: admin-uploaded > fallback
  const backgroundImage = content.image
    ? `${IMAGE_BASE_URL}${content.image}`
    : FALLBACK_IMAGE;

  // Split italicText on the first \n:
  //   - lines[0]  → non-italic (with opening quote)
  //   - lines[1+] → italic
  const italicLines = content.italicText.split("\n");
  const nonItalicPart = italicLines[0] || "";
  const italicPart = italicLines.slice(1).join("\n");

  return (
    <section className="relative w-full min-h-[85vh] flex items-center justify-center px-6 py-24 md:px-12 font-sans overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src={backgroundImage}
          alt="Cinematic landscape"
          className="w-full h-full object-cover"
        />
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-[#4A3B2A]/20" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center gap-12 text-[#F3EFE9] drop-shadow-[0_3px_8px_rgba(74,59,42,0.85)]">
        <div className="flex flex-col gap-3 md:gap-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight">
            {/* Non-italic first line with opening quote */}
            <span
              className={`block transition-all duration-[1200ms] delay-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                mounted
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              &quot;{nonItalicPart}
            </span>

            {/* Italic remaining lines — only render if there are any */}
            {italicPart && (
              <span
                className={`block italic font-light transition-all duration-[1200ms] delay-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  mounted
                    ? "translate-y-0 opacity-90"
                    : "translate-y-8 opacity-0"
                }`}
              >
                {renderWithBreaks(italicPart)}
              </span>
            )}
          </h2>

          {/* Normal text paragraph */}
          <p
            className={`text-lg md:text-2xl lg:text-3xl font-sans font-semibold leading-relaxed max-w-2xl mx-auto pt-4 md:pt-6 transition-all duration-[1200ms] delay-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            {renderWithBreaks(content.normalText)}&quot;
          </p>
        </div>

        {/* Call to Action Button */}
        <div className="flex justify-center mt-12 md:mt-16">
          <Link to="/payana-way">
            <BrownBtn
              className="group"
              text={
                <span className="flex items-center gap-2 p-2 uppercase tracking-[0.2em] text-xs font-semibold">
                  Discover The Payana Way
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              }
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
