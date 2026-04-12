import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddTrail from "./Trails/AddTrail";
import DestinationManager from "./Destinations/DestinationManager";
import HeroImageManager from "./HeroImages/HeroImageManager";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("trails");
  // tabs: "trails" | "destinations" | "heroImages"

  useEffect(() => {
    const token = sessionStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <div className="flex h-screen bg-[#F3EFE9] font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between hidden md:flex">
        <div>
          {/* Logo/Header */}
          <div className="p-6 flex items-center gap-3">
            <div className="text-[#4A3B2A]">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
              </svg>
            </div>
            <span className="font-bold text-lg text-[#4A3B2A]">
              Admin Panel
            </span>
          </div>

          {/* Menu Items */}
          <nav className="px-4 space-y-1 mt-2">
            <button
              onClick={() => setActiveTab("trails")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-sm font-medium ${
                activeTab === "trails"
                  ? "bg-[#4A3B2A] text-[#F3EFE9]"
                  : "text-gray-500 hover:bg-[#F3EFE9] hover:text-[#4A3B2A]"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                ></path>
              </svg>
              Trail Management
            </button>

            <button
              onClick={() => setActiveTab("destinations")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-sm font-medium ${
                activeTab === "destinations"
                  ? "bg-[#4A3B2A] text-[#F3EFE9]"
                  : "text-gray-500 hover:bg-[#F3EFE9] hover:text-[#4A3B2A]"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              Destinations
            </button>

            <button
              onClick={() => setActiveTab("heroImages")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-sm font-medium ${
                activeTab === "heroImages"
                  ? "bg-[#4A3B2A] text-[#F3EFE9]"
                  : "text-gray-500 hover:bg-[#F3EFE9] hover:text-[#4A3B2A]"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
              Hero Images
            </button>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#4A3B2A] transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              ></path>
            </svg>
            Back to Website
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              ></path>
            </svg>
            Logout Account
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-6xl mx-auto">
          {/* Header Text */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#4A3B2A] mb-1">
              {activeTab === "trails" && "Trail Management"}
              {activeTab === "destinations" && "Destinations Management"}
              {activeTab === "heroImages" && "Hero Image Management"}
            </h1>
            <p className="text-gray-600 text-sm">
              Manage your website content and settings.
            </p>
          </div>

          {/* Render Active Component */}
          {activeTab === "trails" && <AddTrail />}
          {activeTab === "destinations" && <DestinationManager />}
          {activeTab === "heroImages" && <HeroImageManager />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
