import React, { useRef } from "react";
import { FaHeart } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import useHomePageData from "../../../hooks/useHomePageData";
import { IMAGE_BASE_URL } from "../../../services/api";
import { ChevronLeft, ChevronRight, ArrowRight, User } from "lucide-react";

const formatMonthYearForDisplay = (val) => {
  if (!val) return "";
  if (!/^\d{4}-\d{2}$/.test(val)) return val;
  const [year, month] = val.split("-");
  const d = new Date(year, month - 1);
  return d.toLocaleString("en-US", { month: "short", year: "numeric" });
};

const TestimonialsSection = () => {
  const { data: homeData } = useHomePageData();
  const navigate = useNavigate();
  const carouselRef = useRef(null);

  const testimonialsData = homeData?.testimonials || {};
  const images = (testimonialsData.images || [])
    .filter((img) => img.isActive !== false)
    .sort((a, b) => a.order - b.order);

  const titleBold = testimonialsData.titleBold || "Share Your";
  const titleItalic = testimonialsData.titleItalic || "Experience";
  const subtitle =
    testimonialsData.subtitle || "What our travellers say about us";

  const handleImageClick = (img) => {
    navigate("/stories/testimonials", { state: { testimonial: img } });
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      const card = carouselRef.current.querySelector(":scope > div");
      if (card) {
        const gap = window.innerWidth >= 640 ? 24 : 16;
        carouselRef.current.scrollBy({
          left: -(card.offsetWidth + gap),
          behavior: "smooth",
        });
      }
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      const card = carouselRef.current.querySelector(":scope > div");
      if (card) {
        const gap = window.innerWidth >= 640 ? 24 : 16;
        carouselRef.current.scrollBy({
          left: card.offsetWidth + gap,
          behavior: "smooth",
        });
      }
    }
  };

  if (images.length === 0) return null;

  return (
    <section className="bg-[#F3EFE9] w-full py-8 sm:py-8 font-sans">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#4A3B2A]/10 text-[#4A3B2A] text-sm font-semibold tracking-wider uppercase mb-5 shadow-sm">
            <FaHeart size={14} className="animate-pulse" />
            <span>Testimonials</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold font-serif text-[#4A3B2A] leading-tight mb-5 drop-shadow-sm">
            {titleBold} <span className="italic font-light">{titleItalic}</span>
          </h2>
          {subtitle && (
            <p className="text-[#4A3B2A] text-md sm:text-xl font-serif italic mt-2 opacity-80 whitespace-pre-line">
              {subtitle}
            </p>
          )}
        </div>

        {/* Carousel Container */}
        <div className="relative group/carousel">
          {/* Desktop Navigation Buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-12 z-20 p-3 bg-white text-[#4A3B2A] rounded-full shadow-xl hover:bg-[#4A3B2A] hover:text-white transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 hidden md:flex items-center justify-center border border-[#4A3B2A]/10"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={24} strokeWidth={2.5} />
              </button>
              <button
                onClick={scrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-12 z-20 p-3 bg-white text-[#4A3B2A] rounded-full shadow-xl hover:bg-[#4A3B2A] hover:text-white transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 hidden md:flex items-center justify-center border border-[#4A3B2A]/10"
                aria-label="Next testimonial"
              >
                <ChevronRight size={24} strokeWidth={2.5} />
              </button>
            </>
          )}

          {/* Carousel Track */}
          <div
            ref={carouselRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-hide pb-10 pt-4 px-4 md:px-0"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {images.map((img, idx) => (
              <div
                key={img._id}
                onClick={() => handleImageClick(img)}
                className="flex-none w-[280px] sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)] h-[250px] sm:h-[260px] bg-white rounded-2xl p-5 sm:p-6 snap-start cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-[#4A3B2A]/5 flex flex-col group relative overflow-hidden"
              >
                {/* Quotation Mark Icon */}
                <div className="absolute -top-4 -right-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                  <svg
                    width="120"
                    height="120"
                    viewBox="0 0 24 24"
                    fill="#4A3B2A"
                  >
                    <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C14.9124 8 14.017 7.10457 14.017 6V3H21.017V15C21.017 18.3137 18.3307 21 15.017 21H14.017ZM3.017 21L3.017 18C3.017 16.8954 3.91243 16 5.017 16H8.017C8.56928 16 9.017 15.5523 9.017 15V9C9.017 8.44772 8.56928 8 8.017 8H5.017C3.91243 8 3.017 7.10457 3.017 6V3H10.017V15C10.017 18.3137 7.33071 21 4.017 21H3.017Z" />
                  </svg>
                </div>

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex-1 pb-4">
                    <p className="text-[#4A3B2A]/80 text-sm sm:text-base leading-relaxed line-clamp-3 font-serif italic">
                      "
                      {img.shortDescription ||
                        "An unforgettable journey through the heart of nature..."}
                      "
                    </p>
                  </div>

                  <div className="flex items-center gap-4 mt-auto pt-5 border-t border-[#4A3B2A]/10">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#4A3B2A]/10 flex-shrink-0 group-hover:border-[#4A3B2A]/30 transition-colors shadow-sm flex items-center justify-center bg-gray-50">
                      {img.url ? (
                        <img
                          src={`${IMAGE_BASE_URL}${img.url}`}
                          alt={img.alt || "Guest"}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex items-center justify-center bg-[#4A3B2A]/10 w-full h-full" title="This guest preferred not to share an image">
                          <User size={24} className="text-[#4A3B2A]/20" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-serif font-bold text-sm sm:text-base text-[#4A3B2A] truncate">
                          {img.alt}
                        </h4>
                        {img.monthYear && (
                          <span className="text-[10px] text-gray-400 whitespace-nowrap mt-1">
                            {formatMonthYearForDisplay(img.monthYear)}
                          </span>
                        )}
                      </div>
                      {img.destination && (
                        <p className="text-[10px] tracking-[0.15em] uppercase font-bold text-[#4A3B2A]/40 truncate">
                          {img.destination}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Arrows (Below Carousel) */}
          <div className="flex md:hidden items-center justify-center gap-6 mt-2">
            <button
              onClick={scrollLeft}
              className="flex items-center justify-center w-12 h-12 rounded-full border border-[#4A3B2A]/20 bg-white shadow-md active:scale-95 transition-all text-[#4A3B2A]"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={scrollRight}
              className="flex items-center justify-center w-12 h-12 rounded-full border border-[#4A3B2A]/20 bg-white shadow-md active:scale-95 transition-all text-[#4A3B2A]"
              aria-label="Next testimonial"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
