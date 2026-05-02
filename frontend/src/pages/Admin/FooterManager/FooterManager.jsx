import React, { useState, useEffect } from "react";
import FooterForm from "../../../components/admin/footer/FooterForm";
import { api } from "../../../services/api";

const FooterManager = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("brand");

  const tabs = [
    { id: "brand", label: "Brand Details" },
    { id: "social", label: "Social Media" },
    { id: "columns", label: "Link Columns" },
    { id: "location", label: "Location & Info" },
    { id: "bottom", label: "Bottom Footer" },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await api.getFooter();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch footer data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      const result = await api.updateFooter(formData);
      setData(result);
      return result;
    } catch (error) {
      console.error("Failed to save footer data", error);
      throw error;
    }
  };

  const handleDeleteLogo = async () => {
    try {
      const result = await api.deleteFooterLogo();
      setData(result);
      return result;
    } catch (error) {
      console.error("Failed to delete footer logo", error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="text-[#4A3B2A] p-4 font-medium italic animate-pulse">
        Loading Footer Settings...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6 overflow-x-auto no-scrollbar" aria-label="Footer Tabs">
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
        <FooterForm
          initialData={data}
          onSave={handleSave}
          onDeleteLogo={handleDeleteLogo}
          activeTab={activeTab}
        />
      </div>
    </div>
  );
};

export default FooterManager;
