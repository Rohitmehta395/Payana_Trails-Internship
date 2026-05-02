import React, { useState } from "react";
import JourneyHeroManager from "./JourneyHeroManager";
import JourneySignatureManager from "./JourneySignatureManager";
import JourneyOurTrailsManager from "./JourneyOurTrailsManager";
import JourneyOurDestinationsManager from "./JourneyOurDestinationsManager";
import JourneyPayanaJourneyManager from "./JourneyPayanaJourneyManager";

const JourneyManager = () => {
  const [activeTab, setActiveTab] = useState("hero");

  const tabs = [
    {
      id: "hero",
      label: "Hero Section",
      render: () => <JourneyHeroManager />,
    },
    {
      id: "signatureJourneys",
      label: "Signature Journeys",
      render: () => <JourneySignatureManager />,
    },
    {
      id: "ourTrails",
      label: "Our Trails",
      render: () => <JourneyOurTrailsManager />,
    },
    {
      id: "ourDestinations",
      label: "Our Destinations",
      render: () => <JourneyOurDestinationsManager />,
    },
    {
      id: "payanaJourney",
      label: "Payana Journey",
      render: () => <JourneyPayanaJourneyManager />,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="border-b border-gray-200">
        <nav
          className="flex space-x-8 px-6 overflow-x-auto"
          aria-label="Journey Manager Tabs"
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
        {tabs.find((tab) => tab.id === activeTab)?.render()}
      </div>
    </div>
  );
};

export default JourneyManager;
