import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import CommonHero from "../components/common/CommonHero";
import storiesImg from "../assets/Home/Stories/stories-moments.webp";
import usePageHeroImages from "../hooks/usePageHeroImages";
import { IMAGE_BASE_URL } from "../services/api";

const Stories = () => {
  const { images: heroImgs } = usePageHeroImages("stories");
  const location = useLocation();
  const testimonial = location.state?.testimonial;
  const contentRef = useRef(null);

  useEffect(() => {
    if (testimonial && contentRef.current) {
      // Small delay to ensure render is complete before scrolling
      setTimeout(() => {
        contentRef.current.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [testimonial]);

  return (
    <div className="bg-[#F3EFE9] min-h-screen">
      <CommonHero
        title="STORIES"
        subtitle="TALES FROM THE TRAILS"
        images={heroImgs}
        bgImage={storiesImg}
        breadcrumbs={[
          { label: "HOME", path: "/" },
          { label: "STORIES" },
        ]}
      />
      
      {/* Testimonial Focus Section */}
      {testimonial && (
        <section ref={contentRef} className="py-16 md:py-24 px-6 lg:px-8 max-w-5xl mx-auto font-sans">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
            <div className="md:w-5/12 h-64 md:h-auto relative">
              <img 
                src={`${IMAGE_BASE_URL}${testimonial.url}`} 
                alt={testimonial.alt || "Testimonial"} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:w-7/12 p-8 md:p-12 flex flex-col justify-center">
              {testimonial.alt && (
                <h3 className="text-3xl font-serif font-bold text-[#4A3B2A] mb-4">
                  {testimonial.alt}
                </h3>
              )}
              <div className="w-12 h-1 bg-[#4A3B2A]/20 mb-6 rounded-full" />
              <p className="text-gray-700 leading-loose text-lg whitespace-pre-wrap">
                {testimonial.fullContent || testimonial.shortDescription || "No story content provided."}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Rest of your Stories content goes here */}
    </div>
  );
};

export default Stories;
