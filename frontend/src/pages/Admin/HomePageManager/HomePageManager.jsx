import React, { useState, useEffect } from "react";
import HomePageForm from "../../../components/admin/home-page/HomePageForm";
import { api } from "../../../services/api";

const HomePageManager = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("homePageActiveTab") || "hero";
  });

  useEffect(() => {
    localStorage.setItem("homePageActiveTab", activeTab);
  }, [activeTab]);

  const tabs = [
    { id: "hero", label: "Hero Section" },
    { id: "payanaWay", label: "The Payana Way" },
    { id: "stories", label: "Stories & Voices" },
    { id: "newsletter", label: "Newsletter" },
    { id: "connect", label: "Connect" },
    { id: "referGift", label: "Refer & Gift" },
  ];

  useEffect(() => {
    if (!tabs.find(t => t.id === activeTab)) {
      setActiveTab("hero");
    }
  }, [activeTab, tabs]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await api.getHomePage();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch home page data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      const result = await api.updateHomePage(formData);
      setData(result);
      return result;
    } catch (error) {
      console.error("Failed to save home page data", error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="text-[#4A3B2A] p-4 font-medium">
        Loading Home Page Settings...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav
          className="flex space-x-8 px-6 overflow-x-auto no-scrollbar"
          aria-label="Home Page Tabs"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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

      <div className="p-6">
        <HomePageForm
          initialData={data}
          onSave={handleSave}
          activeTab={activeTab}
        />
      </div>
    </div>
  );
};

export default HomePageManager;
