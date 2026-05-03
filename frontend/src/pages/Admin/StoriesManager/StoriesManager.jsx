import React, { useState } from "react";
import TravelStoriesManager from "./TravelStoriesManager";
import VoicesManager from "./VoicesManager";
import BlogList from "./BlogList";
import BlogForm from "./BlogForm";
import NewsletterManager from "./NewsletterManager";
import ExternalStoryList from "./ExternalStoryList";
import ExternalStoryForm from "./ExternalStoryForm";
import GuestStoriesManager from "./GuestStoriesManager";
import TestimonialsManager from "./TestimonialsManager";

// view: "section" | "blogList" | "blogForm"
const StoriesManager = () => {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("storiesActiveTab") || "travelStories";
  });

  React.useEffect(() => {
    localStorage.setItem("storiesActiveTab", activeTab);
  }, [activeTab]);
  const [blogView, setBlogView] = useState("list"); // "list" | "form"
  const [editBlog, setEditBlog] = useState(null);

  const [externalView, setExternalView] = useState("list");
  const [editExternalStory, setEditExternalStory] = useState(null);

  const [refreshKey, setRefreshKey] = useState(0);
  const tabs = [
    { id: "travelStories", label: "Travel Stories" },
    { id: "blogManagement", label: "Blog Management" },
    { id: "externalStories", label: "External Stories" },
    { id: "voices", label: "Voices from the Trail" },
    { id: "testimonials", label: "Testimonials" },
    { id: "newsletter", label: "Newsletter Section" },
  ];

  const handleEditBlog = (blog) => {
    setEditBlog(blog);
    setBlogView("form");
  };

  const handleCreateNew = () => {
    setEditBlog(null);
    setBlogView("form");
  };

  const handleSaved = () => {
    setRefreshKey((k) => k + 1);
    setBlogView("list");
    setEditBlog(null);
  };

  const handleCancel = () => {
    setBlogView("list");
    setEditBlog(null);
  };

  const handleEditExternal = (story) => {
    setEditExternalStory(story);
    setExternalView("form");
  };

  const handleCreateExternal = () => {
    setEditExternalStory(null);
    setExternalView("form");
  };

  const handleSavedExternal = () => {
    setRefreshKey((k) => k + 1);
    setExternalView("list");
    setEditExternalStory(null);
  };

  const handleCancelExternal = () => {
    setExternalView("list");
    setEditExternalStory(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav
          className="flex space-x-8 px-6 overflow-x-auto"
          aria-label="Stories Tabs"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === "blogManagement") {
                  setBlogView("list");
                  setEditBlog(null);
                }
                if (tab.id === "externalStories") {
                  setExternalView("list");
                  setEditExternalStory(null);
                }
              }}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-[#4A3B2A] text-[#4A3B2A]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === "travelStories" && <TravelStoriesManager />}
        {activeTab === "voices" && <VoicesManager />}
        {activeTab === "testimonials" && <TestimonialsManager />}
        {activeTab === "newsletter" && <NewsletterManager />}

        {activeTab === "blogManagement" && (
          <>
            {blogView === "list" && (
              <BlogList
                onEdit={handleEditBlog}
                onCreateNew={handleCreateNew}
                refreshKey={refreshKey}
              />
            )}
            {blogView === "form" && (
              <BlogForm
                editBlog={editBlog}
                onSaved={handleSaved}
                onCancel={handleCancel}
              />
            )}
          </>
        )}

        {activeTab === "externalStories" && (
          <>
            {externalView === "list" && (
              <>
                <GuestStoriesManager />
                <ExternalStoryList
                  onEdit={handleEditExternal}
                  onCreateNew={handleCreateExternal}
                  refreshKey={refreshKey}
                />
              </>
            )}
            {externalView === "form" && (
              <ExternalStoryForm
                editStory={editExternalStory}
                onSaved={handleSavedExternal}
                onCancel={handleCancelExternal}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StoriesManager;
