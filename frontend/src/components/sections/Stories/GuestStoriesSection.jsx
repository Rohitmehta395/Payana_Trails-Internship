import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { IMAGE_BASE_URL } from "../../../services/api";

const ExternalStoryCard = ({ blog, index }) => {
  return (
    <motion.a
      href={blog.externalUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.55,
        delay: index * 0.07,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="group cursor-pointer flex flex-col bg-[#FAF7F4] hover:bg-white transition-colors duration-300 border border-[#4A3B2A]/10 hover:border-[#4A3B2A]/25 hover:shadow-lg"
    >
      <div className="relative overflow-hidden" style={{ paddingTop: "62%" }}>
        {blog.featuredImage ? (
          <img
            src={`${IMAGE_BASE_URL}${blog.featuredImage}`}
            alt={blog.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-[#4A3B2A]/10 flex items-center justify-center">
            <span className="text-[#4A3B2A]/30 text-xs tracking-widest uppercase">
              No Image
            </span>
          </div>
        )}
        <span className="absolute top-4 left-4 px-3 py-1 text-[10px] tracking-[0.2em] uppercase font-medium bg-[#4A3B2A] text-[#F3EFE9]">
          {blog.category}
        </span>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-3 text-[11px] tracking-widest uppercase text-[#4A3B2A]/60 font-bold mb-3">
          {blog.location || blog.destination ? (
            <span className="text-right ml-auto">
              {[blog.location, blog.destination].filter(Boolean).join(", ")}
            </span>
          ) : (
            <span className="h-4"></span>
          )}
        </div>
        <h3 className="text-lg font-serif font-semibold text-[#4A3B2A] leading-snug mb-3 group-hover:text-[#3A2E20] transition-colors line-clamp-2">
          {blog.title}
        </h3>
        {blog.author && (
          <p className="text-xs tracking-widest uppercase text-[#4A3B2A]/80 font-medium mb-3">
            By {blog.author}
          </p>
        )}
        <p className="text-sm text-[#4A3B2A]/60 leading-relaxed line-clamp-3 flex-1">
          {blog.excerpt}
        </p>
        <div className="mt-4 flex items-center gap-2 text-[11px] tracking-widest uppercase text-[#4A3B2A] font-medium">
          <span>Read on External Site ↗</span>
          <span className="w-6 h-px bg-[#4A3B2A] group-hover:w-12 transition-all duration-400" />
        </div>
      </div>
    </motion.a>
  );
};

const GuestStoriesSection = ({ data }) => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const guestScrollRef = useRef(null);

  const scroll = (direction) => {
    if (guestScrollRef.current) {
      const container = guestScrollRef.current;
      const scrollAmount = container.offsetWidth / (window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1);
      container.scrollBy({
        left: direction === "next" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const guestSection = data || {};
  const mainTitle = guestSection.title || "Stories from Our Guests";
  const subtitle = guestSection.subtitle || "Hear from those who have journeyed with us.";
  const image = guestSection.image || null;
  const stories = guestSection.stories || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.08 },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  return (
    <section
      id="guest-stories"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#F3EFE9] py-10 md:py-16"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, #4A3B2A 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="container relative z-10 mx-auto max-w-7xl px-6"
      >
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <motion.div variants={fadeUp} className="mb-8 flex items-center gap-4">
              <div className="h-px w-12 bg-[#4A3B2A]/40" />
              <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#4A3B2A]/60">
                Shared Experiences
              </span>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="mb-6 font-serif text-3xl font-semibold leading-tight text-[#4A3B2A] md:text-4xl lg:text-5xl"
            >
              {mainTitle}
            </motion.h2>

            <motion.div variants={fadeUp} className="mb-8 h-0.5 w-16 bg-[#4A3B2A]/30" />

            <motion.p
              variants={fadeUp}
              className="max-w-md text-lg font-light leading-relaxed text-[#4A3B2A]/70"
            >
              {subtitle}
            </motion.p>
          </div>

          <motion.div
            variants={fadeUp}
            className="group relative overflow-hidden bg-[#4A3B2A]/10 lg:col-span-7"
          >
            <div className="aspect-[16/7]">
              {image ? (
                <>
                  <img
                    src={`${IMAGE_BASE_URL}${image}`}
                    alt={mainTitle}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#4A3B2A]/25 via-transparent to-transparent opacity-80" />
                </>
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-xs uppercase tracking-[0.3em] text-[#4A3B2A]/35">
                    Landscape Image
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {stories.length > 0 && (
          <motion.div variants={fadeUp} className="mt-14 md:mt-20">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-px w-10 bg-[#4A3B2A]/40" />
                <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#4A3B2A]/60">
                  Latest Guest Stories
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => scroll("prev")}
                  className="flex h-10 w-10 items-center justify-center border border-[#4A3B2A]/20 bg-[#FAF7F4] text-[#4A3B2A] transition-all hover:bg-[#4A3B2A] hover:text-[#F3EFE9]"
                  aria-label="Previous story"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                </button>
                <button
                  onClick={() => scroll("next")}
                  className="flex h-10 w-10 items-center justify-center border border-[#4A3B2A]/20 bg-[#FAF7F4] text-[#4A3B2A] transition-all hover:bg-[#4A3B2A] hover:text-[#F3EFE9]"
                  aria-label="Next story"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>

            <div
              ref={guestScrollRef}
              className="flex gap-7 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {stories.map((story, index) => (
                <div key={story._id} className="min-w-full md:min-w-[calc(50%-14px)] lg:min-w-[calc(33.333%-18.66px)] snap-start">
                  <ExternalStoryCard
                    blog={story}
                    index={index}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          variants={fadeUp}
          className="mt-12 flex justify-center"
        >
          <button
            type="button"
            onClick={() => navigate("/stories/external", { state: { scrollToBlogs: true } })}
            className="group inline-flex items-center gap-4 bg-[#4A3B2A] px-7 py-3 text-xs font-medium uppercase tracking-[0.2em] text-[#F3EFE9] transition-all duration-300 hover:bg-[#3A2E20]"
          >
            <span>Explore Guest Stories</span>
            <span className="block h-px w-7 bg-[#F3EFE9]/70 transition-all duration-500 group-hover:w-10" />
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default GuestStoriesSection;
