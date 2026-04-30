import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import CommonHero from "../../../components/common/CommonHero";
import RichTextRenderer from "../../../components/common/RichTextRenderer";
import { api, IMAGE_BASE_URL } from "../../../services/api";

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const SingleBlog = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .getBlogBySlug(slug)
      .then((data) => {
        setBlog(data);
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3EFE9] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#4A3B2A]/30 border-t-[#4A3B2A] rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !blog) {
    return (
      <div className="min-h-screen bg-[#F3EFE9] flex flex-col items-center justify-center gap-6">
        <h1 className="text-3xl font-serif text-[#4A3B2A]">Story Not Found</h1>
        <button
          onClick={() => navigate("/stories/blogs")}
          className="text-sm tracking-widest uppercase text-[#4A3B2A]/60 hover:text-[#4A3B2A] border border-[#4A3B2A]/20 px-6 py-3 transition-colors"
        >
          ← Back to Stories
        </button>
      </div>
    );
  }

  const heroImage = blog.featuredImage
    ? `${IMAGE_BASE_URL}${blog.featuredImage}`
    : null;

  return (
    <div className="bg-[#F3EFE9] min-h-screen">
      {/* Hero */}
      <CommonHero
        title={blog.title}
        images={heroImage ? [{ desktop: heroImage, mobile: heroImage }] : []}
        breadcrumbs={[
          { label: "HOME", path: "/" },
          { label: "STORIES", path: "/stories" },
          { label: "BLOGS", path: "/stories/blogs" },
          { label: blog.category?.toUpperCase() },
        ]}
      />

      {/* Article */}
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <motion.article
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {/* Meta info */}
          <header className="mb-12">
            {/* Category label */}
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-10 bg-[#4A3B2A]/40" />
              <span className="text-[14px] tracking-[0.3em] uppercase text-[#4A3B2A]/60  font-bold">
                {blog.category}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold text-[#4A3B2A] leading-tight mb-6">
              {blog.title}
            </h1>

            {/* Divider */}
            <div className="w-14 h-0.5 bg-[#4A3B2A]/30 mb-6" />

            {/* Meta details */}
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm tracking-widest uppercase text-[#4A3B2A]/65 font-bold">
              {blog.author && (
                <span className="flex items-center gap-3">
                  <span className="w-5 h-px bg-[#4A3B2A]/40" />
                  {blog.author}
                </span>
              )}
              <span>{formatDate(blog.publishDate)}</span>
              {(blog.location || blog.destination) && (
                <span className="flex items-center gap-2.5">
                  <svg
                    className="w-4 h-4 opacity-70"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {[blog.location, blog.destination].filter(Boolean).join(", ")}
                </span>
              )}
            </div>

            {/* Excerpt */}
            {blog.excerpt && (
              <p className="mt-8 text-xl md:text-2xl font-light text-[#4A3B2A]/70 leading-relaxed italic border-l-2 border-[#4A3B2A]/20 pl-6">
                {blog.excerpt}
              </p>
            )}
          </header>

          {/* Full content */}
          <div className="prose-custom">
            <RichTextRenderer
              text={blog.content || ""}
              className="text-base md:text-lg text-[#4A3B2A]/85 leading-loose font-light"
              paragraphClass="mb-6"
            />
          </div>

          {/* Bottom navigation */}
          <footer className="mt-20 pt-10 border-t border-[#4A3B2A]/15">
            <button
              onClick={() => navigate(-1)}
              className="group inline-flex items-center gap-4 text-xs tracking-[0.25em] uppercase font-medium text-[#4A3B2A]/70 hover:text-[#4A3B2A] transition-colors"
            >
              <span className="w-8 h-px bg-current group-hover:w-14 transition-all duration-500" />
              <span>Back to Stories</span>
            </button>
          </footer>
        </motion.article>
      </div>
    </div>
  );
};

export default SingleBlog;
