import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddTrail from "./Trails/AddTrail";
import DestinationManager from "./Destinations/DestinationManager";
import HeroImageManager from "./HeroImages/HeroImageManager";
import FAQManager from "./FAQs/FAQManager";
import FormExportsManager from "./FormExports/FormExportsManager";
import HomePageManager from "./HomePageManager/HomePageManager";
import PayanaWayManager from "./PayanaWayManager/PayanaWayManager";
import StoriesManager from "./StoriesManager/StoriesManager";
import ConnectManager from "./ConnectManager/ConnectManager";
import JourneyManager from "./JourneyManager/JourneyManager";
import HeaderManager from "./HeaderManager/HeaderManager";
import FooterManager from "./FooterManager/FooterManager";
import { api, IMAGE_BASE_URL } from "../../services/api";
import { updateFavicon } from "../../utils/favicon";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("adminActiveTab") || "trails";
  });

  useEffect(() => {
    localStorage.setItem("adminActiveTab", activeTab);
  }, [activeTab]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const tabs = [
    {
      id: "trails",
      label: "Trail Management",
      heading: "Trail Management",
      iconPath:
        "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
      render: () => <AddTrail />,
    },
    {
      id: "destinations",
      label: "Destinations",
      heading: "Destinations Management",
      iconPath:
        "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      render: () => <DestinationManager />,
    },
    {
      id: "heroImages",
      label: "Hero Images",
      heading: "Hero Image Management",
      iconPath:
        "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
      render: () => <HeroImageManager />,
    },
    {
      id: "faqs",
      label: "FAQs Management",
      heading: "FAQs Management",
      iconPath:
        "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      render: () => <FAQManager />,
    },
    {
      id: "formExports",
      label: "Form Exports",
      heading: "Form Exports",
      iconPath:
        "M12 10v6m0 0l-3-3m3 3l3-3m3 5H6a2 2 0 01-2-2V8a2 2 0 012-2h3.586A2 2 0 0011 5.414l.414-.414A2 2 0 0112.828 4H18a2 2 0 012 2v10a2 2 0 01-2 2z",
      render: () => <FormExportsManager />,
    },
    {
      id: "homePage",
      label: "Home Page",
      heading: "Home Page Content",
      iconPath:
        "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
      render: () => <HomePageManager />,
    },
    {
      id: "journeyPage",
      label: "Journey Page",
      heading: "Journey Page Content",
      iconPath:
        "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7",
      render: () => <JourneyManager />,
    },
    {
      id: "payanaWay",
      label: "Payana Way",
      heading: "Payana Way Content",
      iconPath: "M13 10V3L4 14h7v7l9-11h-7z",
      render: () => <PayanaWayManager />,
    },
    {
      id: "stories",
      label: "Stories Page",
      heading: "Stories Content",
      iconPath:
        "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
      render: () => <StoriesManager />,
    },
    {
      id: "connect",
      label: "Connect Page",
      heading: "Connect Page Content",
      iconPath:
        "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
      render: () => <ConnectManager />,
    },
    {
      id: "header",
      label: "Header Section",
      heading: "Header Settings",
      iconPath: "M4 6h16M4 12h16M4 18h7",
      render: () => <HeaderManager />,
    },
    {
      id: "footer",
      label: "Footer Section",
      heading: "Footer Settings",
      iconPath: "M4 6h16M4 12h16M13 18h7",
      render: () => <FooterManager />,
    },
  ];
  const activeSection = tabs.find((tab) => tab.id === activeTab) || tabs[0];

  useEffect(() => {
    const token = sessionStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
    }

    // Sync favicon in admin panel
    const syncFavicon = async () => {
      try {
        const headerData = await api.getHeader();
        updateFavicon(headerData?.logo ? `${IMAGE_BASE_URL}${headerData.logo}` : null);
      } catch (err) {
        console.error("Failed to sync favicon in admin", err);
      }
    };
    syncFavicon();
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <div className="flex h-screen bg-[#F3EFE9] font-sans relative overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2">
          <div className="text-[#4A3B2A]">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
            </svg>
          </div>
          <span className="font-bold text-[#4A3B2A]">Admin Panel</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-[#4A3B2A] hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
        >
          {isSidebarOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-[60] w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0 md:flex h-screen md:sticky md:top-0
      `}>
        {/* Logo/Header */}
        <div className="p-6 flex-shrink-0 flex items-center gap-3">
          <div className="text-[#4A3B2A]">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
            </svg>
          </div>
          <span className="font-bold text-lg text-[#4A3B2A]">Admin Panel</span>
        </div>

        {/* Menu Items - Scrollable */}
        <nav className="flex-1 overflow-y-auto px-4 space-y-1 py-2 custom-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-sm font-medium ${
                activeTab === tab.id
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
                  d={tab.iconPath}
                ></path>
              </svg>
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Bottom Actions - Fixed at bottom */}
        <div className="p-4 border-t border-gray-200 space-y-2 flex-shrink-0">
          <button
            onClick={() => window.open("/", "_blank")}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#4A3B2A] transition-colors cursor-pointer"
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
            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors cursor-pointer"
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
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 w-full overflow-y-auto custom-scrollbar pt-16 md:pt-0">
        <div className="p-4 md:p-8 max-w-6xl mx-auto w-full">
          {/* Header Text */}
          <div className="mb-8 text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-[#4A3B2A] mb-1">
              {activeSection.heading}
            </h1>
            <p className="text-gray-600 text-sm">
              Manage your website content and settings.
            </p>
          </div>

          {/* Render Active Component */}
          {activeSection.render()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
