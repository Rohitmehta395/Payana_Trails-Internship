import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import CreamBtn from "../../common/buttons/CreamBtn";
import useHomePageData from "../../../hooks/useHomePageData";
import { preloadImage } from "../../../utils/imageUtils";

// ---------------------------------------------------------------------------
// Hero – renders only after the first DB image has been preloaded + decoded.
// ---------------------------------------------------------------------------
export default function Hero({ images = [], loading = false }) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isUiHidden, setIsUiHidden] = useState(false);
  const [firstImageReady, setFirstImageReady] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);
  const { data: homeData } = useHomePageData();

  const heroData = homeData?.heroSection || {
    headerTitle:
      "Curated Journeys for Travellers who value Stories over Sightseeing",
    subtitle:
      "Small groups. Deeper experiences. Journeys, thoughtfully curated!",
  };

  // Track viewport for choosing the correct preload src
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    setIsMobile(mq.matches);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Preload + decode the first image before showing the hero
  useEffect(() => {
    if (loading || images.length === 0) return;

    const firstImg = images[0];
    const src = isMobile
      ? firstImg.mobile || firstImg.desktop
      : firstImg.desktop || firstImg.mobile;

    // Fire preload; reveal hero once the image is ready to paint
    preloadImage(src).then(() => {
      setFirstImageReady(true);
    });
  }, [loading, images, isMobile]);

  // Carousel auto-advance (only after hero is visible)
  useEffect(() => {
    if (!firstImageReady || images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [firstImageReady, images.length]);

  const toggleUi = () => {
    const newState = !isUiHidden;
    setIsUiHidden(newState);
    window.dispatchEvent(
      new CustomEvent("toggle-ui-mode", { detail: newState })
    );
  };

  // While the DB fetch is in flight or the image hasn't decoded yet, keep
  // the section fully transparent and non-interactive so nothing is visible.
  // Once ready, fade in smoothly — no flash, no skeleton, no layout shift.
  const isReady = !loading && images.length > 0 && firstImageReady;
  const firstImg = images[0] ?? null;

  return (
    <section
      className="relative w-full h-[100dvh] flex flex-col justify-end overflow-hidden pb-24 sm:pb-28 lg:pb-32"
      style={{
        opacity: isReady ? 1 : 0,
        visibility: isReady ? "visible" : "hidden",
        transition: isReady ? "opacity 0.6s ease" : "none",
        background: "transparent",
      }}
    >
      {/* LCP preload hints for the first image */}
      <Helmet>
        {firstImg?.desktop && (
          <link
            rel="preload"
            as="image"
            href={firstImg.desktop}
            media="(min-width: 640px)"
          />
        )}
        {firstImg?.mobile && (
          <link
            rel="preload"
            as="image"
            href={firstImg.mobile}
            media="(max-width: 639px)"
          />
        )}
      </Helmet>

      {/* ------------------------------------------------------------------ */}
      {/* Background Image Layer – uses <picture>/<img> for proper           */}
      {/* fetchPriority, loading, and decoding attributes on the first image. */}
      {/* ------------------------------------------------------------------ */}
      {images.map((img, index) => {
        const isFirst = index === 0;
        return (
          <div
            key={img._id || index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-[2500ms] ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={index !== currentIndex}
          >
            {/* Mobile image */}
            <picture className="absolute inset-0 w-full h-full sm:hidden">
              <img
                src={img.mobile || img.desktop}
                alt={img.alt || ""}
                className="w-full h-full object-cover object-center"
                loading={isFirst ? "eager" : "lazy"}
                fetchPriority={isFirst ? "high" : "low"}
                decoding={isFirst ? "async" : "async"}
                draggable={false}
              />
            </picture>

            {/* Desktop image */}
            <picture className="absolute inset-0 w-full h-full hidden sm:block">
              <img
                src={img.desktop || img.mobile}
                alt={img.alt || ""}
                className="w-full h-full object-cover object-center"
                loading={isFirst ? "eager" : "lazy"}
                fetchPriority={isFirst ? "high" : "low"}
                decoding={isFirst ? "async" : "async"}
                draggable={false}
              />
            </picture>

            {/* Gradient Overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-t from-[#4A3B2A]/70 via-transparent to-transparent sm:from-[#4A3B2A]/30 sm:h-[50%] sm:bottom-0 sm:top-auto w-full transition-opacity duration-500 ${
                isUiHidden ? "opacity-0" : "opacity-100"
              }`}
            />
          </div>
        );
      })}

      {/* ------------------------------------------------------------------ */}
      {/* Content Layer                                                       */}
      {/* ------------------------------------------------------------------ */}
      <div
        className={`relative z-10 w-full max-w-400 mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pointer-events-none transition-all duration-700 ${
          isUiHidden ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
        }`}
      >
        <div className="max-w-md mx-auto sm:mx-0 sm:max-w-xl lg:max-w-2xl pointer-events-auto text-center sm:text-left">
          <h1 className="text-[#F3EFE9] text-2xl sm:text-3xl lg:text-[36px] italic font-bold leading-[1.1] mb-6 [text-shadow:0_4px_15px_#4A3B2A,0_0_30px_#4A3B2A]">
            {heroData.headerTitle}
          </h1>

          <p className="text-[#F3EFE9] text-sm sm:text-md lg:text-[16px] font-medium mb-8 sm:mb-10 [text-shadow:0_2px_10px_#4A3B2A]">
            {heroData.subtitle}
          </p>

          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 sm:gap-3 mb-8 sm:mb-10">
            {[
              { icon: "🦁", text: "WILDLIFE" },
              { icon: "🏛️", text: "HERITAGE" },
              { icon: "🌿", text: "CULTURAL & IMMERSIVE" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-[#4A3B2A]/40 backdrop-blur-md border border-[#F3EFE9]/30"
              >
                <span className="text-sm sm:text-lg">{item.icon}</span>
                <span className="text-[#F3EFE9] text-[10px] sm:text-xs font-bold tracking-widest">
                  {item.text}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-center sm:justify-start w-full drop-shadow-[0_4px_15px_rgba(74,59,42,0.5)]">
            <CreamBtn
              text="Plan Your Journey &rarr;"
              onClick={() => navigate("/journeys")}
              className="py-3 px-8 sm:px-10 text-[16px] sm:text-[18px] w-[90%] sm:w-auto"
            />
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Dots Indicator                                                      */}
      {/* ------------------------------------------------------------------ */}
      <div
        className={`absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 z-20 w-32 h-6 pointer-events-none mask-[linear-gradient(to_right,transparent,black_20%,black_80%,transparent)] transition-opacity duration-500 ${
          isUiHidden ? "opacity-0" : "opacity-100"
        }`}
      >
        <div
          className="absolute top-0 left-1/2 flex gap-2 h-full items-center transition-transform duration-500 ease-out pointer-events-auto"
          style={{ transform: `translateX(-${currentIndex * 20 + 6}px)` }}
        >
          {images.map((_, index) => (
            <div
              key={index}
              className="w-3 flex justify-center cursor-pointer"
              onClick={() => setCurrentIndex(index)}
            >
              <button
                className={`rounded-full transition-all duration-500 shadow-[0_2px_5px_#4A3B2A] ${
                  currentIndex === index
                    ? "bg-[#F3EFE9] w-3 h-3 opacity-100"
                    : "bg-[#F3EFE9]/60 hover:bg-[#F3EFE9]/90 w-2 h-2 opacity-60"
                }`}
                aria-label={`View image ${index + 1}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Cinematic Toggle Eye Button                                         */}
      {/* ------------------------------------------------------------------ */}
      <button
        onClick={toggleUi}
        className="absolute bottom-6 right-6 sm:bottom-8 sm:right-10 z-30 p-3 rounded-full bg-[#4A3B2A]/40 hover:bg-[#4A3B2A]/70 backdrop-blur-md border border-[#F3EFE9]/30 transition-all duration-300 group"
        aria-label={isUiHidden ? "Show UI" : "Hide UI"}
      >
        {isUiHidden ? (
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 text-[#F3EFE9] opacity-80 group-hover:opacity-100"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
            <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
            <line x1="2" y1="2" x2="22" y2="22" />
          </svg>
        ) : (
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 text-[#F3EFE9] opacity-80 group-hover:opacity-100 hover:cursor-pointer"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
    </section>
  );
}
