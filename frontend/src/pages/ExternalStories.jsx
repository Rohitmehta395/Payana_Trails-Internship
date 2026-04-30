import React, { useState, useEffect, useCallback, useRef } from "react";
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

const ExternalStoryCard = ({ blog, index }) => {
  return (
    <motion.a
      href={blog.externalUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.25, 0.1, 0.25, 1] }}
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
            <span className="text-[#4A3B2A]/30 text-xs tracking-widest uppercase">No Image</span>
          </div>
        )}
        <span className="absolute top-4 left-4 px-3 py-1 text-[10px] tracking-[0.2em] uppercase font-medium bg-[#4A3B2A] text-[#F3EFE9]">
          {blog.category}
        </span>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-3 text-[11px] tracking-widest uppercase text-[#4A3B2A]/60 font-bold mb-3">
          {(blog.location || blog.destination) ? (
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

const ExternalStories = () => {
  const { images: heroImgs } = usePageHeroImages("stories");

  const [blogs, setBlogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [availableDestinations, setAvailableDestinations] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef(null);

  const [destinationInput, setDestinationInput] = useState("");
  const [destinationFilter, setDestinationFilter] = useState("");

  const LIMIT = 9;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchDestinations = useCallback(async () => {
    try {
      const data = await api.getDestinations();
      const names = [...new Set(data.map((d) => d.name))].sort();
      setAvailableDestinations(names);
    } catch (err) {
      console.error("Error fetching destinations:", err);
    }
  }, []);

  useEffect(() => {
    fetchDestinations();
  }, [fetchDestinations]);

  const fetchBlogs = useCallback(
    async (page = 1, append = false) => {
      if (append) setLoadingMore(true);
      else setLoading(true);
      try {
        const params = { page, limit: LIMIT };
        if (selectedCategory !== "All") params.category = selectedCategory;
        if (destinationFilter) params.destination = destinationFilter;
        const data = await api.getExternalStories(params);
        const fetched = data.stories || [];
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
    [selectedCategory]
  );

  useEffect(() => {
    fetchBlogs(1);
  }, [selectedCategory, destinationFilter, fetchBlogs]);

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
  };

  const handleDestinationSearch = (e) => {
    e.preventDefault();
    setDestinationFilter(destinationInput.trim());
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (dest) => {
    setDestinationInput(dest);
    setDestinationFilter(dest);
    setShowSuggestions(false);
  };

  const filteredSuggestions = availableDestinations.filter((d) =>
    d.toLowerCase().includes(destinationInput.toLowerCase())
  );

  const hasMore = blogs.length < total;

  return (
    <div className="bg-[#F3EFE9] min-h-screen">
      <CommonHero
        title="GUEST STORIES"
        subtitle="MOMENTS FROM OUR TRAVELLERS"
        images={heroImgs}
        bgImage={storiesImg}
        breadcrumbs={[
          { label: "HOME", path: "/" },
          { label: "STORIES", path: "/stories" },
          { label: "GUEST STORIES" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        
        {/* Search & Filter Section */}
        <section className="mb-14">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center">
            {/* Destination Search */}
            <div className="relative flex-1 max-w-md" ref={dropdownRef}>
              <form
                onSubmit={handleDestinationSearch}
                className="flex items-stretch gap-0 border border-[#4A3B2A]/20 hover:border-[#4A3B2A]/40 focus-within:border-[#4A3B2A] transition-colors bg-white/50"
              >
                <input
                  type="text"
                  value={destinationInput}
                  onFocus={() => setShowSuggestions(true)}
                  onChange={(e) => {
                    setDestinationInput(e.target.value);
                    setShowSuggestions(true);
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

              {/* Suggestions Dropdown */}
              <AnimatePresence>
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute top-full left-0 right-0 mt-1 bg-[#FAF7F4] border border-[#4A3B2A]/10 shadow-xl z-50 max-h-60 overflow-y-auto"
                  >
                    {filteredSuggestions.map((dest, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSuggestionClick(dest)}
                        className="w-full text-left px-4 py-3 text-sm text-[#4A3B2A] hover:bg-[#4A3B2A] hover:text-[#F3EFE9] transition-colors border-b border-[#4A3B2A]/5 last:border-0 font-medium"
                      >
                        {dest}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

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

        {/* Category Chips */}
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

        {/* Grid */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="h-px w-10 bg-[#4A3B2A]/40" />
              <span className="text-xs tracking-[0.3em] uppercase text-[#4A3B2A]/60 font-medium">
                {selectedCategory !== "All" ? selectedCategory : "All Guest Stories"}
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
                No external stories found.
              </p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedCategory}-${destinationFilter}`}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {blogs.map((blog, i) => (
                  <ExternalStoryCard key={blog._id} blog={blog} index={i} />
                ))}
              </motion.div>
            </AnimatePresence>
          )}

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

export default ExternalStories;
