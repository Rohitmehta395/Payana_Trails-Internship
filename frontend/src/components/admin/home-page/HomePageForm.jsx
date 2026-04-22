import React, { useState } from "react";
import HeroSectionForm from "./sections/HeroSectionForm";
import ThePayanaWayForm from "./sections/ThePayanaWayForm";
import StoriesVoicesForm from "./sections/StoriesVoicesForm";
import NewsletterSectionForm from "./sections/NewsletterSectionForm";
import ConnectSectionForm from "./sections/ConnectSectionForm";
import ReferGiftSectionForm from "./sections/ReferGiftSectionForm";
import { Loader2, Save } from "lucide-react";

// Default fallback content as per user request
const defaultData = {
  heroSection: {
    headerTitle: "Curated Journeys for Travellers who value Stories over Sightseeing",
    subtitle: "Small groups. Deeper experiences. Thoughtfully designed journeys.",
  },
  thePayanaWay: {
    title: "The Payana Way",
    subtitle: "A more thoughtful way to experience the world",
    quote: "We believe travel should be unhurried, immersive and deeply meaningful. Our journeys are thoughtfully designed to let you slow down, travel at ease, and connect with each destination. Because true travel is not about seeing more, but experiencing more.",
    highlights: [
      "Personalised Journeys",
      "Curated Experiences",
      "Slow & Immersive Travel",
      "Seamless & Transparent",
    ],
  },
  storiesAndVoices: {
    title: "Stories & Voices from the Trails",
    quote: "Travel isn’t about how many places you see. It’s about the moments that stay with you.",
  },
  newsletterSection: {
    title: "Subscribe to - The Payana Journal",
    subtitle: "New trails, journey updates, and curated travel experiences",
  },
  connectSection: {
    quote: "Travel, when designed with care, becomes a memory.",
    title: "Let's design a journey that’s truly yours.",
    subtitle: "Each journey is thoughtfully crafted and tailored to suit you, even beyond the trails or destinations listed on our website.",
    email: "info@payanatrails.com",
    number: "+91 8660460512",
  },
  referAndGiftSection: {
    mainTitleBold: "Journeys are meaningful when",
    mainTitleItalic: "Shared",
    mainSubtitle: "Whether travelling with a companion or gifting an experience of a lifetime, we make sharing easy and rewarding.",
    referYourFriends: {
      title: "Refer Your Friends",
      subtitle: "Know someone who loves meaningful travel? Invite them to discover a thoughtfully curated Payana Trails journey. Both of you will receive a special benefit on your next Payana Trails journey.",
    },
    giftAJourney: {
      title: "Gift a Journey",
      subtitle: "Surprise your loved ones with an unforgettable experience. Gift a curated Payana Trails journey or a travel voucher to create memories that last a lifetime.",
    },
  },
};

// Helper for deep merging initial data with default data
const mergeData = (initial, defaults) => {
  if (!initial) return defaults;
  return {
    ...defaults,
    ...initial,
    heroSection: { ...defaults.heroSection, ...initial.heroSection },
    thePayanaWay: { ...defaults.thePayanaWay, ...initial.thePayanaWay },
    storiesAndVoices: { ...defaults.storiesAndVoices, ...initial.storiesAndVoices },
    newsletterSection: { ...defaults.newsletterSection, ...initial.newsletterSection },
    connectSection: { ...defaults.connectSection, ...initial.connectSection },
    referAndGiftSection: {
      ...defaults.referAndGiftSection,
      ...initial.referAndGiftSection,
      referYourFriends: {
        ...defaults.referAndGiftSection.referYourFriends,
        ...initial.referAndGiftSection?.referYourFriends
      },
      giftAJourney: {
        ...defaults.referAndGiftSection.giftAJourney,
        ...initial.referAndGiftSection?.giftAJourney
      }
    }
  };
};

const HomePageForm = ({ initialData, onSave }) => {
  const [activeTab, setActiveTab] = useState("hero");
  const [data, setData] = useState(() => mergeData(initialData, defaultData));
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const tabs = [
    { id: "hero", label: "Hero Section" },
    { id: "payanaWay", label: "The Payana Way" },
    { id: "stories", label: "Stories & Voices" },
    { id: "newsletter", label: "Newsletter" },
    { id: "connect", label: "Connect" },
    { id: "referGift", label: "Refer & Gift" },
  ];

  const handleSectionChange = (section, newData) => {
    setData((prev) => ({ ...prev, [section]: newData }));
  };

  const handleFileSelect = (fieldName, file) => {
    setFiles((prev) => ({ ...prev, [fieldName]: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("data", JSON.stringify(data));

    Object.entries(files).forEach(([key, file]) => {
      formData.append(key, file);
    });

    try {
      await onSave(formData);
      setMessage({ type: "success", text: "Home Page content updated successfully!" });
      setFiles({}); // Clear selected files after successful save
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to update home page content." });
    } finally {
      setLoading(false);
    }
  };

  const SaveButton = () => (
    <div className="mt-6 flex justify-end">
      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 px-6 py-2 bg-[#4A3B2A] text-white rounded-md font-medium hover:bg-[#3a2d20] transition-colors disabled:opacity-70"
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
        Save Section
      </button>
    </div>
  );

  return (
    <div>
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
              activeTab === tab.id
                ? "bg-[#4A3B2A] text-white shadow-md"
                : "bg-gray-200 text-[#4A3B2A] hover:bg-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {message.text}
          </div>
        )}

        {activeTab === "hero" && (
          <HeroSectionForm 
            data={data.heroSection || {}} 
            onChange={(d) => handleSectionChange("heroSection", d)} 
          >
            <SaveButton />
          </HeroSectionForm>
        )}

        {activeTab === "payanaWay" && (
          <ThePayanaWayForm 
            data={data.thePayanaWay || {}} 
            onChange={(d) => handleSectionChange("thePayanaWay", d)} 
            onFileSelect={handleFileSelect}
          >
            <SaveButton />
          </ThePayanaWayForm>
        )}

        {activeTab === "stories" && (
          <StoriesVoicesForm 
            data={data.storiesAndVoices || {}} 
            onChange={(d) => handleSectionChange("storiesAndVoices", d)} 
            onFileSelect={handleFileSelect}
          >
            <SaveButton />
          </StoriesVoicesForm>
        )}

        {activeTab === "newsletter" && (
          <NewsletterSectionForm 
            data={data.newsletterSection || {}} 
            onChange={(d) => handleSectionChange("newsletterSection", d)} 
          >
            <SaveButton />
          </NewsletterSectionForm>
        )}

        {activeTab === "connect" && (
          <ConnectSectionForm 
            data={data.connectSection || {}} 
            onChange={(d) => handleSectionChange("connectSection", d)} 
            onFileSelect={handleFileSelect}
          >
            <SaveButton />
          </ConnectSectionForm>
        )}

        {activeTab === "referGift" && (
          <ReferGiftSectionForm 
            data={data.referAndGiftSection || {}} 
            onChange={(d) => handleSectionChange("referAndGiftSection", d)} 
            onFileSelect={handleFileSelect}
          >
            <SaveButton />
          </ReferGiftSectionForm>
        )}
      </form>
    </div>
  );
};

export default HomePageForm;
