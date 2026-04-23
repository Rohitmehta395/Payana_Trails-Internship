import React, { useState } from "react";
import AJourneyBeginsManager from "./AJourneyBeginsManager";

const PayanaWayManager = () => {
  const [activeTab, setActiveTab] = useState("aJourneyBegins");

  const tabs = [
    {
      id: "aJourneyBegins",
      label: "A Journey Begins",
      render: () => <AJourneyBeginsManager />,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === tab.id
                    ? "border-[#4A3B2A] text-[#4A3B2A]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="p-6">
        {tabs.find((tab) => tab.id === activeTab)?.render()}
      </div>
    </div>
  );
};

export default PayanaWayManager;
