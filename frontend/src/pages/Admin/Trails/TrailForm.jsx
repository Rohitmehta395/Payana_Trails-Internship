import React from "react";

const TrailForm = ({
  formData,
  handleChange,
  handleFileChange,
  handleSubmit,
  loading,
  isEditing,
  resetForm,
  setShowForm,
}) => {
  const inputClasses =
    "w-full p-2.5 border border-gray-300 rounded text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#4A3B2A] focus:border-[#4A3B2A] transition-colors";

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-fade-in">
      <div className="h-1 w-full bg-[#4A3B2A]"></div>
      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Trail Theme
              </label>
              <select
                name="trailTheme"
                value={formData.trailTheme}
                onChange={handleChange}
                className={`${inputClasses} bg-white`}
                required
              >
                <option value="Wildlife">Wildlife</option>
                <option value="Heritage">Heritage</option>
                <option value="Cultural">Cultural</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Trail Type
              </label>
              <input
                type="text"
                name="trailType"
                value={formData.trailType}
                onChange={handleChange}
                className={inputClasses}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Trail Name
              </label>
              <input
                type="text"
                name="trailName"
                value={formData.trailName}
                onChange={handleChange}
                className={inputClasses}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Destination
              </label>
              <input
                type="text"
                name="trailDestination"
                value={formData.trailDestination}
                onChange={handleChange}
                className={inputClasses}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Subtitle
              </label>
              <input
                type="text"
                name="trailSubTitle"
                value={formData.trailSubTitle}
                onChange={handleChange}
                className={inputClasses}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Duration
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className={inputClasses}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Journey Date
              </label>
              <input
                type="date"
                name="journeyDate"
                value={formData.journeyDate}
                onChange={handleChange}
                className={inputClasses}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Route
              </label>
              <input
                type="text"
                name="trailRoute"
                value={formData.trailRoute}
                onChange={handleChange}
                className={inputClasses}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Visa Requirement
              </label>
              <input
                type="text"
                name="visa"
                value={formData.visa}
                onChange={handleChange}
                className={inputClasses}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Best Time To Travel
              </label>
              <input
                type="text"
                name="bestTimeToTravel"
                value={formData.bestTimeToTravel}
                onChange={handleChange}
                className={inputClasses}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Comfort Level
              </label>
              <input
                type="text"
                name="comfortLevel"
                value={formData.comfortLevel}
                onChange={handleChange}
                className={inputClasses}
                required
              />
            </div>

            {/* IMAGE UPLOAD */}
            <div className="md:col-span-2 bg-gray-50 p-4 rounded-md border border-gray-200 border-dashed">
              <label className="block text-sm font-semibold text-[#4A3B2A] mb-2">
                {isEditing
                  ? "Upload New Route Map (Leave empty to keep existing)"
                  : "Upload Route Map / Image"}
              </label>
              <input
                id="imageInput"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className={`${inputClasses} bg-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#F3EFE9] file:text-[#4A3B2A] hover:file:bg-[#e6dfd3] cursor-pointer`}
                required={!isEditing}
              />
            </div>

            {/* TEXT AREAS */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Overview
              </label>
              <textarea
                name="overview"
                value={formData.overview}
                onChange={handleChange}
                rows="3"
                className={`${inputClasses} resize-none`}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Is This Journey For You?
              </label>
              <textarea
                name="isThisJourneyForYou"
                value={formData.isThisJourneyForYou}
                onChange={handleChange}
                rows="2"
                className={`${inputClasses} resize-none`}
                required
              />
            </div>

            {/* BULLET ARRAYS */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Highlights (Max 6 - Comma Separated)
              </label>
              <input
                type="text"
                name="highlights"
                value={formData.highlights}
                onChange={handleChange}
                className={inputClasses}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                What's Included (Max 8 - Comma Separated)
              </label>
              <input
                type="text"
                name="whatsIncluded"
                value={formData.whatsIncluded}
                onChange={handleChange}
                className={inputClasses}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                What's Not Included (Max 8 - Comma Separated)
              </label>
              <input
                type="text"
                name="whatsNotIncluded"
                value={formData.whatsNotIncluded}
                onChange={handleChange}
                className={inputClasses}
                required
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-5">
            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowForm(false);
              }}
              className="px-6 py-2.5 rounded text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#4A3B2A] text-[#F3EFE9] px-8 py-2.5 rounded text-sm font-medium hover:bg-[#3a2d20] disabled:opacity-50 transition-colors shadow-sm"
            >
              {loading
                ? "Saving..."
                : isEditing
                  ? "Update Trail"
                  : "Save Trail"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrailForm;
