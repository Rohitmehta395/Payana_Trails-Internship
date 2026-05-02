import React, { useState } from "react";
import EnquirySectionForm from "./sections/EnquirySectionForm";
import ReferFriendSectionForm from "./sections/ReferFriendSectionForm";
import GiftJourneySectionForm from "./sections/GiftJourneySectionForm";
import FAQSectionForm from "./sections/FAQSectionForm";
import ConnectSectionForm from "./sections/ConnectSectionForm";
import { Loader2, Save } from "lucide-react";
import { api } from "../../../services/api";

const defaultData = {
  enquirySection: {
    typographyText: "Tailored For You",
    titleBold: "Craft Your",
    titleItalic: "Journey.",
    subtitle: "Travel is the only thing you buy that makes you richer.",
  },
  referFriendSection: {
    typographyText: "Refer A Friend",
    titleBold: "Share the journey",
    titleItalic: "with someone special.",
    subtitle: "Introduce friends and family to Payana Trails.",
    block1Label: "Thoughtful",
    block1Title: "Invites",
    block1Body: "A refined way to introduce others to the Payana experience.",
    block2Label: "Exclusive",
    block2Title: "Benefits",
    block2Body: "Unlock rewards while sharing exceptional journeys with your circle.",
    imageBlockLabel: "Referral Program",
    imageBlockTitle: "Share Payana",
    imageBlockBody: "Invite friends to travel beautifully.",
  },
  giftJourneySection: {
    typographyText: "Gift A Journey",
    titleBold: "Gift an extraordinary",
    titleItalic: "experience.",
    subtitle: "Surprise your loved ones with the gift of a lifetime.",
    block1Label: "Flexible",
    block1Title: "Credits",
    block1Body: "Allow them to choose their own perfect destination.",
    block2Label: "Curated",
    block2Title: "Journeys",
    block2Body: "Gift a fully planned, breathtaking signature trail.",
    imageBlockLabel: "Memorable",
    imageBlockTitle: "Surprises",
    imageBlockBody: "Gift beautifully.",
  },
  faqSection: {
    typographyText: "Knowledge Base",
    titleBold: "Frequently Asked",
    titleItalic: "Questions",
    subtitle: "Everything you need to know.",
  },
  connectSection: {
    typographyText: "Get In Touch",
    titleBold: "Let's",
    titleItalic: "Connect",
    email: "info@payanatrails.com",
    phone: "+91 8660460512",
    meetLink: "",
    socialMedia: {
      titleBold: "Follow Our",
      titleItalic: "Journey",
      subtitle: "Join our community across platforms.",
      items: [
        { text: "", link: "" },
        { text: "", link: "" },
        { text: "", link: "" },
        { text: "", link: "" },
        { text: "", link: "" }
      ]
    }
  }
};

const mergeData = (initial, defaults) => {
  if (!initial) return defaults;
  return {
    ...defaults,
    ...initial,
    enquirySection: { ...defaults.enquirySection, ...initial.enquirySection },
    referFriendSection: { ...defaults.referFriendSection, ...initial.referFriendSection },
    giftJourneySection: { ...defaults.giftJourneySection, ...initial.giftJourneySection },
    faqSection: { ...defaults.faqSection, ...initial.faqSection },
    connectSection: { 
      ...defaults.connectSection, 
      ...initial.connectSection,
      socialMedia: {
        ...defaults.connectSection.socialMedia,
        ...initial.connectSection?.socialMedia
      }
    }
  };
};

const ConnectForm = ({ initialData, onSave, activeTab }) => {
  const [data, setData] = useState(() => mergeData(initialData, defaultData));
  const [files, setFiles] = useState({});
  const [compressionPreviews, setCompressionPreviews] = useState({});
  const [compressionLoading, setCompressionLoading] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSectionChange = (section, newData) => {
    setData((prev) => ({ ...prev, [section]: newData }));
  };

  const handleFileSelect = async (fieldName, file) => {
    setFiles((prev) => ({ ...prev, [fieldName]: file }));
    await previewCompression(fieldName, file);
  };

  const previewCompression = async (fieldName, file) => {
    setCompressionPreviews((prev) => ({ ...prev, [fieldName]: [] }));
    setCompressionLoading((prev) => ({ ...prev, [fieldName]: Boolean(file) }));

    if (!file) {
      setCompressionLoading((prev) => ({ ...prev, [fieldName]: false }));
      return;
    }

    try {
      const result = await api.previewConnectPageImageCompression({ [fieldName]: file });
      setCompressionPreviews((prev) => ({ ...prev, [fieldName]: result.imageStats || [] }));
    } catch (err) {
      console.error("Failed to preview connect page image compression", err);
      setCompressionPreviews((prev) => ({ ...prev, [fieldName]: [] }));
    } finally {
      setCompressionLoading((prev) => ({ ...prev, [fieldName]: false }));
    }
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
      setMessage({ type: "success", text: "Connect Page content updated successfully!" });
      setFiles({});
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to update connect page content." });
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
      <form onSubmit={handleSubmit}>
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {message.text}
          </div>
        )}

        {activeTab === "enquiry" && (
          <EnquirySectionForm 
            data={data.enquirySection} 
            onChange={(d) => handleSectionChange("enquirySection", d)} 
            onFileSelectLeft={(file) => handleFileSelect("enquiryLeftImage", file)}
            onFileSelectRight={(file) => handleFileSelect("enquiryRightImage", file)}
            compressionStatsLeft={compressionPreviews.enquiryLeftImage}
            compressionLoadingLeft={compressionLoading.enquiryLeftImage}
            compressionStatsRight={compressionPreviews.enquiryRightImage}
            compressionLoadingRight={compressionLoading.enquiryRightImage}
          >
            <SaveButton />
          </EnquirySectionForm>
        )}

        {activeTab === "referFriend" && (
          <ReferFriendSectionForm 
            data={data.referFriendSection} 
            onChange={(d) => handleSectionChange("referFriendSection", d)} 
            onFileSelect={(file) => handleFileSelect("referFriendImage", file)}
            compressionStats={compressionPreviews.referFriendImage}
            compressionLoading={compressionLoading.referFriendImage}
          >
            <SaveButton />
          </ReferFriendSectionForm>
        )}

        {activeTab === "giftJourney" && (
          <GiftJourneySectionForm 
            data={data.giftJourneySection} 
            onChange={(d) => handleSectionChange("giftJourneySection", d)} 
            onFileSelect={(file) => handleFileSelect("giftJourneyImage", file)}
            compressionStats={compressionPreviews.giftJourneyImage}
            compressionLoading={compressionLoading.giftJourneyImage}
          >
            <SaveButton />
          </GiftJourneySectionForm>
        )}

        {activeTab === "faq" && (
          <FAQSectionForm 
            data={data.faqSection} 
            onChange={(d) => handleSectionChange("faqSection", d)} 
          >
            <SaveButton />
          </FAQSectionForm>
        )}

        {activeTab === "connect" && (
          <ConnectSectionForm 
            data={data.connectSection} 
            onChange={(d) => handleSectionChange("connectSection", d)} 
          >
            <SaveButton />
          </ConnectSectionForm>
        )}
      </form>
    </div>
  );
};

export default ConnectForm;
