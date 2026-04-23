import React, { useState, useRef, useEffect } from "react";
import useHomePageData from "../../../hooks/useHomePageData";
import { IMAGE_BASE_URL } from "../../../services/api";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const TestimonialsSection = () => {
  const { data: homeData } = useHomePageData();
  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);

  const testimonialsData = homeData?.testimonials || {};
  const images = (testimonialsData.images || [])
    .filter((img) => img.isActive !== false)
    .sort((a, b) => a.order - b.order);

  const title = testimonialsData.title || "Testimonials";
  const subtitle =
    testimonialsData.subtitle || "What our travellers say about us";

  const handleImageClick = (index) => {
    setCurrentIndex(index);
    setModalOpen(true);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  // Auto slide effect for the carousel (optional, but requested as "auto or manual sliding")
  useEffect(() => {
    if (modalOpen) return;
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [modalOpen]);

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!modalOpen) return;
      if (e.key === "Escape") setModalOpen(false);
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modalOpen, images.length]);

  if (images.length === 0) return null;

  return (
    <section className="bg-[#F3EFE9] w-full py-14 sm:py-8 font-sans">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-6">
            <div className="h-[1px] w-12 md:w-24 bg-[#4A3B2A] opacity-30"></div>
            <h2 className="text-3xl md:text-4xl font-serif text-[#4A3B2A] tracking-wide text-center">
              {title}
            </h2>
            <div className="h-[1px] w-12 md:w-24 bg-[#4A3B2A] opacity-30"></div>
          </div>
          {subtitle && (
            <p className="text-[#4A3B2A] text-xl sm:text-2xl font-serif italic mt-6 opacity-80 whitespace-pre-line">
              {subtitle}
            </p>
          )}
        </div>

        {/* Carousel Container */}
        <div className="relative group">
          {/* Navigation Buttons for Carousel */}
          {images.length > 3 && (
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
            className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8 pt-4 px-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {images.map((img, idx) => (
              <div
                key={img._id}
                onClick={() => handleImageClick(idx)}
                className="flex-none w-[280px] sm:w-[320px] md:w-[380px] aspect-[4/5] rounded-2xl overflow-hidden snap-center cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-4 border-white/50"
              >
                <img
                  src={`${IMAGE_BASE_URL}${img.url}`}
                  alt={img.alt || `Testimonial ${idx + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full-Screen Modal View */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm">
          {/* Close Button */}
          <button
            onClick={() => setModalOpen(false)}
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50"
          >
            <X size={28} />
          </button>

          {/* Prev Button */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 sm:p-4 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors z-50"
            >
              <ChevronLeft size={32} />
            </button>
          )}

          {/* Next Button */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 sm:p-4 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors z-50"
            >
              <ChevronRight size={32} />
            </button>
          )}

          {/* Image Container */}
          <div
            className="relative w-full h-full flex items-center justify-center p-4 sm:p-12"
            onClick={() => setModalOpen(false)}
          >
            <img
              src={`${IMAGE_BASE_URL}${images[currentIndex].url}`}
              alt={
                images[currentIndex].alt || `Testimonial ${currentIndex + 1}`
              }
              className="max-w-full max-h-full object-contain drop-shadow-2xl select-none"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image
            />

            {/* Image Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 text-white text-sm font-medium rounded-full tracking-widest backdrop-blur-md">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TestimonialsSection;
