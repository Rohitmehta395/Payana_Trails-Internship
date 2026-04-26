import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { api, IMAGE_BASE_URL } from "../services/api";
import CommonHero from "../components/common/CommonHero";
import usePageHeroImages from "../hooks/usePageHeroImages";
import storiesImg from "../assets/Home/Stories/stories-moments.webp";

const CATEGORIES = [
  "All",
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

// ─── Blog Card ───────────────────────────────────────────────────────────────
const BlogCard = ({ blog, index }) => {
  const navigate = useNavigate();
  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.25, 0.1, 0.25, 1] }}
      onClick={() => navigate(`/stories/blogs/${blog.slug}`)}
      className="group cursor-pointer flex flex-col bg-[#FAF7F4] hover:bg-white transition-colors duration-300 border border-[#4A3B2A]/10 hover:border-[#4A3B2A]/25 hover:shadow-lg"
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ paddingTop: "62%" }}>
        {blog.featuredImage ? (
          <img
            src={`${IMAGE_BASE_URL}${blog.featuredImage}`}
            alt={blog.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-[#4A3B2A]/10 flex items-center justify-center">
            <span className="text-[#4A3B2A]/30 text-xs tracking-widest uppercase">No Image</span>
          </div>
        )}
        {/* Category badge */}
        <span className="absolute top-4 left-4 px-3 py-1 text-[10px] tracking-[0.2em] uppercase font-medium bg-[#4A3B2A] text-[#F3EFE9]">
          {blog.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-3 text-[10px] tracking-widest uppercase text-[#4A3B2A]/50 font-medium mb-3">
          <span>{formatDate(blog.publishDate)}</span>
          {blog.destination && (
            <>
              <span className="w-1 h-1 rounded-full bg-[#4A3B2A]/30" />
              <span>{blog.destination}</span>
            </>
          )}
        </div>
        <h3 className="text-lg font-serif font-semibold text-[#4A3B2A] leading-snug mb-3 group-hover:text-[#3A2E20] transition-colors line-clamp-2">
          {blog.title}
        </h3>
        <p className="text-sm text-[#4A3B2A]/60 leading-relaxed line-clamp-3 flex-1">
          {blog.excerpt}
        </p>
        <div className="mt-4 flex items-center gap-2 text-[11px] tracking-widest uppercase text-[#4A3B2A] font-medium">
          <span>Read More</span>
          <span className="w-6 h-px bg-[#4A3B2A] group-hover:w-12 transition-all duration-400" />
        </div>
      </div>
    </motion.article>
  );
};

// ─── Featured Blog (full-width) ───────────────────────────────────────────────
const FeaturedBlogHero = ({ blog }) => {
  const navigate = useNavigate();
  if (!blog) return null;
  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
      onClick={() => navigate(`/stories/blogs/${blog.slug}`)}
      className="group cursor-pointer relative w-full overflow-hidden bg-[#4A3B2A]"
      style={{ minHeight: "520px" }}
    >
      {blog.featuredImage && (
        <img
          src={`${IMAGE_BASE_URL}${blog.featuredImage}`}
          alt={blog.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105 opacity-60"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f05]/80 via-[#1a0f05]/30 to-transparent" />

      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-14 lg:p-16">
        <span className="inline-block px-3 py-1 text-[10px] tracking-[0.3em] uppercase font-semibold bg-[#F3EFE9]/15 backdrop-blur-sm text-[#F3EFE9] border border-[#F3EFE9]/20 mb-4 w-fit">
          {blog.category}
        </span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold text-[#F3EFE9] leading-tight mb-4 max-w-3xl group-hover:text-white transition-colors">
          {blog.title}
        </h2>
        {blog.excerpt && (
          <p className="text-[#F3EFE9]/75 text-base md:text-lg max-w-2xl leading-relaxed mb-6 line-clamp-2">
            {blog.excerpt}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-5 text-[11px] tracking-widest uppercase text-[#F3EFE9]/60 font-medium">
          {blog.author && <span>{blog.author}</span>}
          <span>{formatDate(blog.publishDate)}</span>
          {blog.destination && <span>{blog.destination}</span>}
          <div className="flex items-center gap-2 text-[#F3EFE9] ml-auto">
            <span>Read Story</span>
            <span className="w-8 h-px bg-[#F3EFE9] group-hover:w-16 transition-all duration-500" />
          </div>
        </div>
      </div>
    </motion.article>
  );
};

// ─── Featured Carousel ────────────────────────────────────────────────────────
const FeaturedCarousel = ({ blogs }) => {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const scrollRef = useRef(null);

  const scrollTo = (dir) => {
    if (!scrollRef.current) return;
    const card = scrollRef.current.firstChild;
    const cardW = card ? card.offsetWidth + 24 : 320;
    scrollRef.current.scrollBy({ left: dir * cardW * 2, behavior: "smooth" });
  };

  if (!blogs || blogs.length === 0) return null;

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-5">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#4A3B2A]/50 font-medium">
          More Featured Stories
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scrollTo(-1)}
            className="w-9 h-9 border border-[#4A3B2A]/20 hover:border-[#4A3B2A] hover:bg-[#4A3B2A] hover:text-[#F3EFE9] text-[#4A3B2A] transition-all duration-300 flex items-center justify-center text-sm"
          >
            ←
          </button>
          <button
            onClick={() => scrollTo(1)}
            className="w-9 h-9 border border-[#4A3B2A]/20 hover:border-[#4A3B2A] hover:bg-[#4A3B2A] hover:text-[#F3EFE9] text-[#4A3B2A] transition-all duration-300 flex items-center justify-center text-sm"
          >
            →
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-2 scroll-smooth"
        style={{ scrollbarWidth: "none" }}
      >
        {blogs.map((blog) => (
          <article
            key={blog._id}
            onClick={() => navigate(`/stories/blogs/${blog.slug}`)}
            className="group cursor-pointer flex-shrink-0 w-72 md:w-80 border border-[#4A3B2A]/10 hover:border-[#4A3B2A]/25 hover:shadow-md transition-all duration-300 bg-[#FAF7F4]"
          >
            <div className="relative overflow-hidden" style={{ paddingTop: "65%" }}>
              {blog.featuredImage ? (
                <img
                  src={`${IMAGE_BASE_URL}${blog.featuredImage}`}
                  alt={blog.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="absolute inset-0 bg-[#4A3B2A]/8" />
              )}
              <span className="absolute top-3 left-3 px-2 py-0.5 text-[9px] tracking-[0.2em] uppercase font-semibold bg-[#4A3B2A] text-[#F3EFE9]">
                {blog.category}
              </span>
            </div>
            <div className="p-5">
              <p className="text-[9px] tracking-widest uppercase text-[#4A3B2A]/40 font-medium mb-2">
                {formatDate(blog.publishDate)}
              </p>
              <h4 className="text-sm font-serif font-semibold text-[#4A3B2A] leading-snug line-clamp-2 group-hover:text-[#3A2E20] transition-colors">
                {blog.title}
              </h4>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

// ─── Main BlogsListing Page ───────────────────────────────────────────────────
const BlogsListing = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { images: heroImgs } = usePageHeroImages("stories");

  // State
  const [allFeatured, setAllFeatured] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState(
    location.state?.category || "All"
  );
  const [destinationInput, setDestinationInput] = useState("");
  const [destinationFilter, setDestinationFilter] = useState("");

  const LIMIT = 6;

  const fetchFeatured = useCallback(async () => {
    try {
      const data = await api.getBlogs({ featured: true, all: true });
      setAllFeatured(data.blogs || []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchBlogs = useCallback(
    async (page = 1, append = false) => {
      if (append) setLoadingMore(true);
      else setLoading(true);
      try {
        const params = { page, limit: LIMIT };
        if (selectedCategory !== "All") params.category = selectedCategory;
        if (destinationFilter) params.destination = destinationFilter;
        const data = await api.getBlogs(params);
        const fetched = data.blogs || [];
        setTotal(data.total || 0);
        setBlogs((prev) => (append ? [...prev, ...fetched] : fetched));
        setCurrentPage(page);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [selectedCategory, destinationFilter]
  );

  useEffect(() => {
    fetchFeatured();
  }, []);

  useEffect(() => {
    fetchBlogs(1);
  }, [selectedCategory, destinationFilter]);

  const handleDestinationSearch = (e) => {
    e.preventDefault();
    setDestinationFilter(destinationInput.trim());
  };

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
  };

  const hasMore = blogs.length < total;

  // Featured split
  const primaryFeatured = allFeatured[0] || null;
  const restFeatured = allFeatured.slice(1);

  return (
    <div className="bg-[#F3EFE9] min-h-screen">
      <CommonHero
        title="TRAVEL STORIES"
        subtitle="REFLECTIONS FROM THE ROAD"
        images={heroImgs}
        bgImage={storiesImg}
        breadcrumbs={[
          { label: "HOME", path: "/" },
          { label: "STORIES", path: "/stories" },
          { label: "BLOGS" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">

        {/* ── Featured Section ────────────────────────────── */}
        {allFeatured.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px w-12 bg-[#4A3B2A]/40" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#4A3B2A]/60 font-medium">
                Featured
              </span>
            </div>
            <FeaturedBlogHero blog={primaryFeatured} />
            {restFeatured.length > 0 && (
              <div className="mt-8">
                <FeaturedCarousel blogs={restFeatured} />
              </div>
            )}
          </section>
        )}

        {/* ── Search & Filter Section ─────────────────────── */}
        <section className="mb-14">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center">
            {/* Destination Search */}
            <form
              onSubmit={handleDestinationSearch}
              className="flex items-stretch gap-0 flex-1 max-w-md border border-[#4A3B2A]/20 hover:border-[#4A3B2A]/40 focus-within:border-[#4A3B2A] transition-colors"
            >
              <input
                type="text"
                value={destinationInput}
                onChange={(e) => {
                  setDestinationInput(e.target.value);
                  if (!e.target.value.trim()) setDestinationFilter("");
                }}
                placeholder="Search by destination..."
                className="flex-1 px-4 py-3 text-sm bg-transparent text-[#4A3B2A] placeholder-[#4A3B2A]/40 focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-[#4A3B2A] text-[#F3EFE9] text-xs tracking-wider uppercase font-medium hover:bg-[#3A2E20] transition-colors"
              >
                Search
              </button>
            </form>

            {/* Active filters indicator */}
            {(destinationFilter || selectedCategory !== "All") && (
              <button
                onClick={() => {
                  setDestinationFilter("");
                  setDestinationInput("");
                  setSelectedCategory("All");
                }}
                className="text-xs tracking-wider uppercase text-[#4A3B2A]/60 hover:text-[#4A3B2A] border border-[#4A3B2A]/20 px-4 py-3 transition-colors"
              >
                Clear Filters ×
              </button>
            )}
          </div>
        </section>

        {/* ── Category Chips ──────────────────────────────── */}
        <section className="mb-14">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`px-5 py-2 text-xs tracking-wider uppercase font-medium transition-all duration-300 border ${
                  selectedCategory === cat
                    ? "bg-[#4A3B2A] text-[#F3EFE9] border-[#4A3B2A]"
                    : "bg-transparent text-[#4A3B2A]/70 border-[#4A3B2A]/20 hover:border-[#4A3B2A]/50 hover:text-[#4A3B2A]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* ── Blogs Grid ──────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="h-px w-10 bg-[#4A3B2A]/40" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#4A3B2A]/60 font-medium">
                {selectedCategory !== "All" ? selectedCategory : "All Stories"}
                {destinationFilter && ` · ${destinationFilter}`}
              </span>
            </div>
            {total > 0 && (
              <span className="text-xs text-[#4A3B2A]/50">
                {total} {total === 1 ? "story" : "stories"}
              </span>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse bg-[#4A3B2A]/6 aspect-[4/5]" />
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#4A3B2A]/50 text-sm tracking-wider">
                No stories found. Try adjusting your filters.
              </p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedCategory}-${destinationFilter}`}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {blogs.map((blog, i) => (
                  <BlogCard key={blog._id} blog={blog} index={i} />
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {/* Load More */}
          {hasMore && !loading && (
            <div className="mt-14 flex justify-center">
              <button
                onClick={() => fetchBlogs(currentPage + 1, true)}
                disabled={loadingMore}
                className="group inline-flex items-center gap-4 border border-[#4A3B2A]/30 hover:border-[#4A3B2A] px-10 py-4 text-xs tracking-[0.25em] uppercase font-medium text-[#4A3B2A] hover:bg-[#4A3B2A] hover:text-[#F3EFE9] transition-all duration-300 disabled:opacity-60"
              >
                {loadingMore ? (
                  <span className="flex items-center gap-3">
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Loading...
                  </span>
                ) : (
                  <>
                    <span>Load More Stories</span>
                    <span className="w-5 h-px bg-current group-hover:w-10 transition-all duration-500" />
                  </>
                )}
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default BlogsListing;
