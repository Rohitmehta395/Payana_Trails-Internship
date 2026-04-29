import React, { useEffect, useMemo, useState } from "react";
import { api, IMAGE_BASE_URL } from "../../../services/api";

const CATEGORIES = [
  "Heritage Trails",
  "Wildlife Encounters",
  "Cultural Windows",
  "Journey Insights",
  "Photo Essays",
  "Travel Anecdotes",
];

const TravelStoriesManager = () => {
  const [formData, setFormData] = useState({
    mainTitle: "",
    subtitle: "",
    image: null,
    selectedBlogs: {},
  });
  const [currentImage, setCurrentImage] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [imageStats, setImageStats] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(0);

  const blogsByCategory = useMemo(() => {
    return CATEGORIES.reduce((acc, category) => {
      acc[category] = blogs.filter(
        (blog) => blog.category === category && !blog.isDraft
      );
      return acc;
    }, {});
  }, [blogs]);

  const showMsg = (type, text, ms = 5000) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), ms);
  };

  useEffect(() => {
    let ignore = false;

    const loadData = async () => {
      setIsLoading(true);
      try {
        const [pageData, blogData] = await Promise.all([
          api.getStoriesPage(),
          api.getBlogsAdmin(),
        ]);

        if (ignore) return;

        const ts = pageData?.travelStories || {};
        setFormData((prev) => ({
          ...prev,
          mainTitle: ts.mainTitle || "",
          subtitle: ts.subtitle || "",
          selectedBlogs: ts.selectedBlogs || {},
        }));
        setCurrentImage(ts.image || ts.image1 || "");
        setBlogs(blogData.blogs || []);
      } catch {
        if (!ignore) showMsg("error", "Failed to load section data.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    loadData();

    return () => {
      ignore = true;
    };
  }, []);

  const handleInput = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleBlogSelect = (category, blogId) => {
    setFormData((prev) => ({
      ...prev,
      selectedBlogs: {
        ...prev.selectedBlogs,
        [category]: blogId,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const form = new FormData();
    form.append("mainTitle", formData.mainTitle);
    form.append("subtitle", formData.subtitle);
    form.append("selectedBlogs", JSON.stringify(formData.selectedBlogs));
    if (formData.image) form.append("image", formData.image);

    try {
      const res = await api.updateTravelStoriesSection(form);
      const ts = res.page?.travelStories || {};
      setCurrentImage(ts.image || ts.image1 || "");
      setImageStats(res.imageStats || []);
      setFormData((prev) => ({
        ...prev,
        image: null,
        selectedBlogs: ts.selectedBlogs || prev.selectedBlogs,
      }));
      setFileInputKey((key) => key + 1);

      let msg = "Travel Stories section updated!";
      if (res.imageStats?.length) {
        msg +=
          " Compression: " +
          res.imageStats
            .map((stat) => `${stat.field} (${stat.savedPercent}% saved)`)
            .join(", ");
      }
      showMsg("success", msg, 6000);
    } catch (err) {
      showMsg("error", err.message || "Failed to save.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <p className="py-4 text-gray-500">Loading...</p>;

  const inputClass =
    "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#4A3B2A] focus:outline-none focus:ring-[#4A3B2A]";
  const fileInputClass =
    "block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-[#F3EFE9] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[#4A3B2A] hover:file:bg-[#E5DFD3]";

  return (
    <div className="space-y-6">
      {message.text && (
        <div
          className={`rounded-md p-4 text-sm ${
            message.type === "success"
              ? "border border-green-200 bg-green-50 text-green-800"
              : "border border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Main Title
            </label>
            <input
              type="text"
              name="mainTitle"
              value={formData.mainTitle}
              onChange={handleInput}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Subtitle
            </label>
            <input
              type="text"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleInput}
              required
              className={inputClass}
            />
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Landscape Image (single image, recommended 16:9)
          </label>
          {currentImage && (
            <div className="mb-3">
              <p className="mb-1 text-xs text-gray-500">Current:</p>
              <img
                src={`${IMAGE_BASE_URL}${currentImage}`}
                alt="Current Travel Stories"
                className="h-36 w-auto rounded border border-gray-200 bg-white object-contain"
              />
            </div>
          )}
          <input
            key={fileInputKey}
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFile}
            className={fileInputClass}
          />
          <p className="mt-2 text-xs text-gray-500">
            The uploaded image is compressed automatically when saved. Replacing it
            deletes the previous Travel Stories image.
          </p>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-4">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-[#4A3B2A]">
              Category Blog Selection
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Choose one published blog for each category on the Stories page.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {CATEGORIES.map((category) => {
              const categoryBlogs = blogsByCategory[category] || [];
              return (
                <div key={category}>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {category}
                  </label>
                  <select
                    value={formData.selectedBlogs?.[category] || ""}
                    onChange={(e) => handleBlogSelect(category, e.target.value)}
                    className={inputClass}
                  >
                    <option value="">
                      {categoryBlogs.length
                        ? "Use first blog in this category"
                        : "No published blogs available"}
                    </option>
                    {categoryBlogs.map((blog) => (
                      <option key={blog._id} value={blog._id}>
                        {blog.title}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        </div>

        {imageStats.length > 0 && (
          <div className="rounded-md border border-green-200 bg-green-50 p-4 text-sm">
            <p className="mb-2 font-medium text-green-800">Compression Results:</p>
            <ul className="space-y-1">
              {imageStats.map((stat) => (
                <li key={`${stat.field}-${stat.originalName}`} className="text-green-700">
                  <strong>{stat.field}</strong> - {stat.originalName}:{" "}
                  {(stat.originalSize / 1024).toFixed(0)}KB to{" "}
                  {(stat.compressedSize / 1024).toFixed(0)}KB (
                  <span className="font-semibold text-green-700">
                    {stat.savedPercent}% saved
                  </span>
                  )
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-md bg-[#4A3B2A] px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-[#3A2E20] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save Section"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TravelStoriesManager;
