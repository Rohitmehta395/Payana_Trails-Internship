import React, { useRef } from "react";
import { motion as Motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { IMAGE_BASE_URL } from "../../../services/api";

const CATEGORIES = [
  "Heritage Trails",
  "Wildlife Encounters",
  "Cultural Windows",
  "Journey Insights",
  "Photo Essays",
  "Travel Anecdotes",
];

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const StoryCard = ({ blog, category, index }) => {
  const navigate = useNavigate();

  if (!blog) return null;

  return (
    <Motion.article
      variants={{
        hidden: { opacity: 0, y: 32 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.55, delay: index * 0.07, ease: [0.25, 0.1, 0.25, 1] },
        },
      }}
      onClick={() => navigate(`/stories/blogs/${blog.slug}`)}
      className="group cursor-pointer flex flex-col bg-[#FAF7F4] hover:bg-white transition-colors duration-300 border border-[#4A3B2A]/10 hover:border-[#4A3B2A]/25 hover:shadow-lg"
    >
      <div className="relative overflow-hidden" style={{ paddingTop: "62%" }}>
        {blog.featuredImage ? (
          <img
            src={`${IMAGE_BASE_URL}${blog.featuredImage}`}
            alt={blog.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-[#4A3B2A]/10 flex items-center justify-center">
            <span className="text-[#4A3B2A]/30 text-xs tracking-widest uppercase">No Image</span>
          </div>
        )}
        <span className="absolute top-4 left-4 px-3 py-1 text-[10px] tracking-[0.2em] uppercase font-medium bg-[#4A3B2A] text-[#F3EFE9]">
          {category}
        </span>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-3 text-[11px] tracking-widest uppercase text-[#4A3B2A]/60 font-bold mb-3">
          <span>{formatDate(blog.publishDate)}</span>
          {(blog.location || blog.destination) && (
            <span className="text-right">
              {[blog.location, blog.destination].filter(Boolean).join(", ")}
            </span>
          )}
        </div>
        <h3 className="text-lg font-serif font-semibold text-[#4A3B2A] leading-snug mb-3 group-hover:text-[#3A2E20] transition-colors line-clamp-2">
          {blog.title}
        </h3>
        {blog.excerpt && (
          <p className="text-sm text-[#4A3B2A]/60 leading-relaxed line-clamp-3 flex-1">
            {blog.excerpt}
          </p>
        )}
        <div className="mt-4 flex items-center gap-2 text-[11px] tracking-widest uppercase text-[#4A3B2A] font-medium">
          <span>Read More</span>
          <span className="w-6 h-px bg-[#4A3B2A] group-hover:w-12 transition-all duration-400" />
        </div>
      </div>
    </Motion.article>
  );
};

const TravelStories = ({ data }) => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const travelStories = data?.travelStories || {};
  const mainTitle = travelStories.mainTitle || "Travel Stories";
  const subtitle =
    travelStories.subtitle ||
    "Reflections, insights, and moments from journeys across the world";
  const image = travelStories.image || travelStories.image1 || null;
  const categoryBlogs = travelStories.categoryBlogs || {};
  const featuredBlogs = travelStories.featuredBlogs || [];
  const showFeatured = travelStories.showFeatured || false;

  const displayStories = showFeatured
    ? featuredBlogs.map((blog) => ({
        category: blog.category,
        blog,
      }))
    : CATEGORIES.map((category) => ({
        category,
        blog: categoryBlogs[category],
      }));

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
      id="travel-stories"
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

      <Motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="container relative z-10 mx-auto max-w-7xl px-6"
      >
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Motion.div variants={fadeUp} className="mb-8 flex items-center gap-4">
              <div className="h-px w-12 bg-[#4A3B2A]/40" />
              <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#4A3B2A]/60">
                Stories & Reflections
              </span>
            </Motion.div>

            <Motion.h2
              variants={fadeUp}
              className="mb-6 font-serif text-4xl font-semibold leading-tight text-[#4A3B2A] md:text-5xl lg:text-6xl"
            >
              {mainTitle}
            </Motion.h2>

            <Motion.div variants={fadeUp} className="mb-8 h-0.5 w-16 bg-[#4A3B2A]/30" />

            <Motion.p
              variants={fadeUp}
              className="max-w-md text-lg font-light leading-relaxed text-[#4A3B2A]/70"
            >
              {subtitle}
            </Motion.p>
          </div>

          <Motion.div
            variants={fadeUp}
            className="group relative overflow-hidden bg-[#4A3B2A]/10 lg:col-span-7"
          >
            <div className="aspect-[16/9]">
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
          </Motion.div>
        </div>

        <Motion.div variants={fadeUp} className="mt-14 md:mt-20">
          <div className="mb-8 flex items-center gap-4">
            <div className="h-px w-10 bg-[#4A3B2A]/40" />
            <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#4A3B2A]/60">
              Selected Stories
            </span>
          </div>

          <Motion.div
            variants={containerVariants}
            className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3"
          >
            {displayStories.map(({ category, blog }, index) => (
              <StoryCard
                key={blog?._id || category}
                blog={blog}
                category={category}
                index={index}
              />
            ))}
          </Motion.div>
        </Motion.div>

        <Motion.div
          variants={fadeUp}
          className="mt-12 flex flex-wrap items-center justify-center gap-3"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => navigate("/stories/blogs", { state: { category: cat } })}
              className="border border-[#4A3B2A]/25 px-4 py-2 text-xs font-medium uppercase tracking-wider text-[#4A3B2A]/70 transition-all duration-300 hover:border-[#4A3B2A] hover:bg-[#4A3B2A] hover:text-[#F3EFE9]"
            >
              {cat}
            </button>
          ))}

          <button
            type="button"
            onClick={() => navigate("/stories/blogs")}
            className="group inline-flex items-center gap-4 bg-[#4A3B2A] px-7 py-3 text-xs font-medium uppercase tracking-[0.2em] text-[#F3EFE9] transition-all duration-300 hover:bg-[#3A2E20]"
          >
            <span>Explore Stories</span>
            <span className="block h-px w-7 bg-[#F3EFE9]/70 transition-all duration-500 group-hover:w-10" />
          </button>
        </Motion.div>
      </Motion.div>
    </section>
  );  
};

export default TravelStories;
