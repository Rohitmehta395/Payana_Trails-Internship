import React, { useEffect, useState } from "react";
import { api } from "../../../services/api";

const NewsletterManager = () => {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const showMsg = (type, text, ms = 5000) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), ms);
  };

  useEffect(() => {
    let ignore = false;

    const loadData = async () => {
      setIsLoading(true);
      try {
        const pageData = await api.getStoriesPage();

        if (ignore) return;

        const ns = pageData?.newsletterSection || {};
        setFormData({
          title: ns.title || "The Payana Journal",
          subtitle: ns.subtitle || "Subscribe to receive our latest stories, journey updates, and exclusive reflections directly in your inbox.",
        });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await api.updateNewsletterSection(formData);
      showMsg("success", "Newsletter section updated!");
    } catch (err) {
      showMsg("error", err.message || "Failed to save.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <p className="py-4 text-gray-500">Loading...</p>;

  const inputClass =
    "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#4A3B2A] focus:outline-none focus:ring-[#4A3B2A]";

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
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInput}
              required
              className={inputClass}
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Subtitle
            </label>
            <textarea
              name="subtitle"
              value={formData.subtitle}
              onChange={handleInput}
              required
              rows={3}
              className={inputClass}
            />
          </div>
        </div>

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

export default NewsletterManager;
