import React from "react";
import ImageUploadField from "../ImageUploadField";

const ReferGiftSectionForm = ({ data, onChange, onFileSelect, children }) => {
  const handleReferChange = (e) => {
    onChange({ ...data, referYourFriends: { ...data.referYourFriends, [e.target.name]: e.target.value } });
  };

  const handleGiftChange = (e) => {
    onChange({ ...data, giftAJourney: { ...data.giftAJourney, [e.target.name]: e.target.value } });
  };

  return (
    <div className="mb-8 border border-gray-200 rounded-lg p-6 bg-gray-50">
      <h2 className="text-xl font-bold text-[#4A3B2A] mb-6">6. Refer and Gift Section</h2>
      
      {/* Main Titles */}
      <div className="mb-6 p-4 border border-gray-200 rounded bg-white">
        <h3 className="text-lg font-semibold text-[#4A3B2A] mb-4">Main Headers</h3>
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-[#4A3B2A] mb-1">Main Title (Bold part)</label>
            <input type="text" name="mainTitleBold" value={data.mainTitleBold || ""} onChange={(e) => onChange({...data, mainTitleBold: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A3B2A]" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#4A3B2A] mb-1">Main Title (Italic part)</label>
            <input type="text" name="mainTitleItalic" value={data.mainTitleItalic || ""} onChange={(e) => onChange({...data, mainTitleItalic: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A3B2A]" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#4A3B2A] mb-1">Main Subtitle</label>
            <textarea name="mainSubtitle" value={data.mainSubtitle || ""} onChange={(e) => onChange({...data, mainSubtitle: e.target.value})} rows={2} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A3B2A]" />
          </div>
        </div>
      </div>

      {/* Refer Your Friends Sub-section */}
      <div className="mb-6 p-4 border border-gray-200 rounded bg-white">
        <h3 className="text-lg font-semibold text-[#4A3B2A] mb-4">A. Refer Your Friends</h3>
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-[#4A3B2A] mb-1">Title</label>
            <input type="text" name="title" value={data.referYourFriends?.title || ""} onChange={handleReferChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A3B2A]" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#4A3B2A] mb-1">Subtitle</label>
            <textarea name="subtitle" value={data.referYourFriends?.subtitle || ""} onChange={handleReferChange} rows={2} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A3B2A]" />
          </div>
        </div>
        <ImageUploadField 
          label="Hero Image" 
          currentImage={data.referYourFriends?.heroImage} 
          onImageSelect={(file) => onFileSelect("referFriendsHeroImage", file)} 
        />
      </div>

      {/* Gift a Journey Sub-section */}
      <div className="p-4 border border-gray-200 rounded bg-white">
        <h3 className="text-lg font-semibold text-[#4A3B2A] mb-4">B. Gift a Journey</h3>
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-[#4A3B2A] mb-1">Title</label>
            <input type="text" name="title" value={data.giftAJourney?.title || ""} onChange={handleGiftChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A3B2A]" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#4A3B2A] mb-1">Subtitle</label>
            <textarea name="subtitle" value={data.giftAJourney?.subtitle || ""} onChange={handleGiftChange} rows={2} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A3B2A]" />
          </div>
        </div>
        <ImageUploadField 
          label="Hero Image" 
          currentImage={data.giftAJourney?.heroImage} 
          onImageSelect={(file) => onFileSelect("giftJourneyHeroImage", file)} 
        />
      </div>

      {children}
    </div>
  );
};

export default ReferGiftSectionForm;
