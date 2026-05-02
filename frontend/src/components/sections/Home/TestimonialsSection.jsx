import React, { useRef } from "react";
import { FaHeart } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import useHomePageData from "../../../hooks/useHomePageData";
import { IMAGE_BASE_URL } from "../../../services/api";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

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
    <section className="bg-[#F3EFE9] w-full py-14 sm:py-8 font-sans">
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
        <div className="relative group">
          {/* Navigation Buttons for Carousel */}
          {images.length > 1 && (
            <>
              <button
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-6 z-10 p-2 sm:p-3 bg-[#4A3B2A] text-[#F3EFE9] rounded-full shadow-lg hover:bg-[#3a2d20] transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-0"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={scrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-6 z-10 p-2 sm:p-3 bg-[#4A3B2A] text-[#F3EFE9] rounded-full shadow-lg hover:bg-[#3a2d20] transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-0"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Carousel Track */}
          <div
            ref={carouselRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8 pt-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {images.map((img, idx) => (
              <div
                key={img._id}
                onClick={() => handleImageClick(img)}
                className="flex-none w-full sm:w-[calc((100%-1.5rem)/2)] md:w-[calc((100%-2*1.5rem)/3)] lg:w-[calc((100%-2*1.5rem)/3)] h-[340px] sm:h-[380px] bg-[#F8F5F2] rounded-2xl overflow-hidden snap-start cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 flex flex-col group"
              >
                {/* Image Section (Top 50%) */}
                <div className="h-1/2 w-full overflow-hidden relative">
                  <img
                    src={`${IMAGE_BASE_URL}${img.url}`}
                    alt={img.alt || `Testimonial ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Text Section (Bottom 50%) */}
                <div className="h-1/2 p-5 sm:p-6 flex flex-col justify-between">
                  <div>
                    {img.alt && (
                      <h4 className="font-serif font-bold text-lg text-[#4A3B2A] mb-2">
                        {img.alt}
                      </h4>
                    )}
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {img.shortDescription ||
                        "Read about this beautiful journey experience..."}
                    </p>
                  </div>

                  <div className="flex items-center text-[#4A3B2A] font-semibold text-sm mt-3 pt-3 border-t border-gray-100 group-hover:text-[#6a5439] transition-colors">
                    <span>Click to read more</span>
                    <ArrowRight
                      size={16}
                      className="ml-2 transform group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
