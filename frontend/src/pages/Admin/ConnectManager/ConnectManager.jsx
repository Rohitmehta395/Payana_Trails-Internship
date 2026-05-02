import React, { useState, useEffect } from "react";
import ConnectForm from "../../../components/admin/connect/ConnectForm";
import { api } from "../../../services/api";

const ConnectManager = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("connectActiveTab") || "enquiry";
  });

  useEffect(() => {
    localStorage.setItem("connectActiveTab", activeTab);
  }, [activeTab]);

  const tabs = [
    { id: "enquiry", label: "Enquiry" },
    { id: "referFriend", label: "Refer a Friend" },
    { id: "giftJourney", label: "Gift a Journey" },
    { id: "faq", label: "FAQ" },
    { id: "connect", label: "Connect" },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await api.getConnectPage();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch connect page data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      const result = await api.updateConnectPage(formData);
      setData(result);
      return result;
    } catch (error) {
      console.error("Failed to save connect page data", error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="text-[#4A3B2A] p-4 font-medium">
        Loading Connect Page Settings...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav
          className="flex space-x-8 px-6 overflow-x-auto no-scrollbar"
          aria-label="Connect Tabs"
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
        <ConnectForm
          initialData={data}
          onSave={handleSave}
          activeTab={activeTab}
        />
      </div>
    </div>
  );
};

export default ConnectManager;
