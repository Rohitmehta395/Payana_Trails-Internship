import React, { useState } from "react";
import TravelStoriesManager from "./TravelStoriesManager";
import BlogList from "./BlogList";
import BlogForm from "./BlogForm";

// view: "section" | "blogList" | "blogForm"
const StoriesManager = () => {
  const [activeTab, setActiveTab] = useState("travelStories");
  const [blogView, setBlogView] = useState("list"); // "list" | "form"
  const [editBlog, setEditBlog] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const tabs = [
    { id: "travelStories", label: "Travel Stories Section" },
    { id: "blogManagement", label: "Blog Management" },
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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6" aria-label="Stories Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === "blogManagement") {
                  setBlogView("list");
                  setEditBlog(null);
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
      </div>
    </div>
  );
};

export default StoriesManager;
