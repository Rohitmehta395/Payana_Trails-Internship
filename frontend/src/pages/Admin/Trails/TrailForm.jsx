import React from "react";
import { IMAGE_BASE_URL } from "../../../services/api";

const TrailForm = ({
  formData,
  handleChange,
  handleFileChange,
  handleAction,
  loading,
  isSaving,
  lastSaved,
  isEditing,
  resetForm,
  setShowForm,
  handleHighlightChange,
  addHighlight,
  removeHighlight,
  handleHeroImageChange,
  handleTrailImagesChange,
  handleItineraryPdfChange,
  toggleAutoCompressItineraryPdf,
  clearSelectedItineraryPdf,
  toggleRemoveCurrentItineraryPdf,
  itineraryPdfNotice,
  existingTrailImages,
  removeExistingTrailImage,
  trailImageFiles,
  removeQueuedTrailImage,
  itineraryPdfFile,
  itineraryPdfMarkedForRemoval,
  routeMapPreview,
  heroImagePreview,
  routeMapFileName,
  heroImageFileName,
  compressionPreviews,
  compressionPreviewLoading,
  formatCompressionStat,
  pdfCompressionStats,
  pdfCompressing,
}) => {
  const inputClasses =
    "w-full p-2.5 border border-gray-300 rounded text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#4A3B2A] focus:border-[#4A3B2A] transition-colors";

  const renderCompressionPreview = (field) => {
    const stats = compressionPreviews?.[field] || [];

    if (compressionPreviewLoading?.[field]) {
      return (
        <p className="mt-3 text-xs font-medium text-amber-700">
          Checking compression...
        </p>
      );
    }

    if (stats.length === 0) return null;

    return (
      <div className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 p-3">
        <p className="text-xs font-semibold text-emerald-800">
          Compression preview
        </p>
        <ul className="mt-2 space-y-1 text-xs text-emerald-700">
          {stats.map((stat, index) => (
            <li key={`${field}-${stat.originalName}-${index}`}>
              {formatCompressionStat(stat)}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // ── PDF Compression Stats Badge ─────────────────────────────────────────
  const PdfCompressionBadge = () => {
    if (!pdfCompressionStats) return null;
    const { originalSize, compressedSize, savedPercent, didCompress } = pdfCompressionStats;
    const fmtBytes = (b) =>
      b >= 1024 * 1024
        ? `${(b / (1024 * 1024)).toFixed(2)} MB`
        : `${(b / 1024).toFixed(0)} KB`;
    const fillWidth = didCompress ? Math.max(10, 100 - Math.abs(savedPercent)) : 100;
    const isLarger = savedPercent < 0;

    return (
      <div className="mt-3 rounded-md border border-[#4A3B2A]/20 bg-[#F3EFE9] p-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-[#4A3B2A] uppercase tracking-wide">
            {didCompress ? "✦ PDF Compressed" : "PDF Upload Stats"}
          </p>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
              isLarger
                ? "bg-amber-100 text-amber-800"
                : didCompress
                ? "bg-emerald-100 text-emerald-800"
                : "bg-stone-100 text-stone-600"
            }`}
          >
            {isLarger
              ? `+${Math.abs(savedPercent)}% larger`
              : didCompress
              ? `${savedPercent}% smaller`
              : "No change"}
          </span>
        </div>
        {/* Progress bar: shows compressed size relative to original */}
        <div className="mb-2 h-2 w-full rounded-full bg-stone-200 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              isLarger ? "bg-amber-400" : "bg-emerald-500"
            }`}
            style={{ width: `${fillWidth}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-stone-500">
          <span>Before: <span className="font-semibold text-stone-700">{fmtBytes(originalSize)}</span></span>
          <span>→</span>
          <span>After: <span className="font-semibold text-stone-700">{fmtBytes(compressedSize)}</span></span>
        </div>
      </div>
    );
  };

  // ── PDF Compressing Spinner ────────────────────────────────────────
  const PdfCompressingSpinner = () => {
    if (!pdfCompressing) return null;
    return (
      <div className="mt-3 flex items-center gap-3 rounded-md border border-[#4A3B2A]/20 bg-[#F3EFE9] px-4 py-3">
        {/* Spinning ring */}
        <div className="relative flex-shrink-0 h-8 w-8">
          <svg
            className="animate-spin h-8 w-8"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="16" cy="16" r="13"
              stroke="#E5D7C5"
              strokeWidth="3"
            />
            <path
              d="M16 3 A13 13 0 0 1 29 16"
              stroke="#4A3B2A"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div>
          <p className="text-xs font-semibold text-[#4A3B2A]">
            Compressing PDF via ILovePDF…
          </p>
          <p className="text-[10px] text-stone-400 mt-0.5">
            This may take 10–30 seconds. Please wait.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-fade-in">
      <div className="h-1 w-full bg-[#4A3B2A]"></div>
      <div className="p-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-2">
          <h3 className="text-lg font-bold text-[#4A3B2A] flex items-center gap-3">
            {isEditing ? "Edit Trail" : "New Trail"}
            <span
              className={`px-2 py-0.5 mt-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${formData.status === "published" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}
            >
              {formData.status === "published" ? "Published" : "Draft"}
            </span>
          </h3>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            {isSaving && (
              <span className="text-amber-600 font-medium animate-pulse">
                Autosaving...
              </span>
            )}
            {!isSaving && lastSaved && (
              <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
            )}
          </div>
        </div>
        <form className="space-y-5">
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
              >
                <option value="Wildlife">Wildlife</option>
                <option value="Heritage">Heritage</option>
                <option value="Cultural">Cultural</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Trail Type (Optional)
              </label>
              <input
                type="text"
                name="trailType"
                value={formData.trailType}
                onChange={handleChange}
                className={inputClasses}
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
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Pricing (Optional - e.g. Starting from ₹1,20,000)
              </label>
              <input
                type="text"
                name="pricing"
                value={formData.pricing}
                onChange={handleChange}
                className={inputClasses}
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
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Visa Requirement (Optional)
              </label>
              <input
                type="text"
                name="visa"
                value={formData.visa}
                onChange={handleChange}
                className={inputClasses}
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
              />
            </div>

            {/* IMAGE UPLOAD */}
            <div className="md:col-span-2 bg-gray-50 p-4 rounded-md border border-gray-200 border-dashed">
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-2">
                    {routeMapFileName
                      ? "New Route Map Preview"
                      : isEditing
                        ? "Current Route Map"
                        : "Route Map Preview"}
                  </p>
                  {routeMapPreview ? (
                    <img
                      src={routeMapPreview}
                      alt="Route map preview"
                      className="w-24 h-20 object-contain rounded-lg border border-gray-200 bg-white shadow-sm"
                    />
                  ) : (
                    <div className="w-24 h-20 rounded-lg border border-dashed border-gray-300 bg-white flex items-center justify-center text-[11px] text-gray-400 text-center px-2">
                      Route map preview will appear here
                    </div>
                  )}
                </div>

                <div className="flex-1 w-full">
                  <label className="block text-sm font-semibold text-[#4A3B2A] mb-2">
                    {isEditing ? "Upload New Route Map" : "Upload Route Map"}
                  </label>
                  <p className="text-xs text-gray-500 mb-3">
                    {isEditing
                      ? "Leave empty to keep the current route map."
                      : "Upload the route map used in the trail detail page."}
                  </p>
                  <input
                    id="imageInput"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className={`${inputClasses} bg-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#F3EFE9] file:text-[#4A3B2A] hover:file:bg-[#e6dfd3] cursor-pointer`}
                  />
                  {routeMapFileName && (
                    <p className="mt-2 text-xs text-[#4A3B2A]">
                      Selected file: {routeMapFileName}
                    </p>
                  )}
                  {renderCompressionPreview("routeMap")}
                </div>
              </div>
            </div>

            {/* HERO IMAGE UPLOAD */}
            <div className="md:col-span-2 bg-gray-50 p-4 rounded-md border border-gray-200 border-dashed">
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-2">
                    {heroImageFileName
                      ? "New Hero Image Preview"
                      : isEditing
                        ? "Current Hero Image"
                        : "Hero Image Preview"}
                  </p>
                  {heroImagePreview ? (
                    <img
                      src={heroImagePreview}
                      alt="Hero image preview"
                      className="w-24 h-20 object-cover rounded-lg border border-gray-200 bg-white shadow-sm"
                    />
                  ) : (
                    <div className="w-24 h-20 rounded-lg border border-dashed border-gray-300 bg-white flex items-center justify-center text-[11px] text-gray-400 text-center px-2">
                      Hero image preview will appear here
                    </div>
                  )}
                </div>

                <div className="flex-1 w-full">
                  <label className="block text-sm font-semibold text-[#4A3B2A] mb-1">
                    {isEditing ? "Upload New Hero Image" : "Upload Hero Image"}
                  </label>
                  <p className="text-xs text-gray-500 mb-3">
                    Recommended size: 1920x1080. This image is also used in
                    trail cards.
                    {isEditing
                      ? " Leave empty to keep the current hero image."
                      : ""}
                  </p>
                  <input
                    id="heroImageInput"
                    type="file"
                    accept="image/*"
                    onChange={handleHeroImageChange}
                    className={`${inputClasses} bg-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#F3EFE9] file:text-[#4A3B2A] hover:file:bg-[#e6dfd3] cursor-pointer`}
                  />
                  {heroImageFileName && (
                    <p className="mt-2 text-xs text-[#4A3B2A]">
                      Selected file: {heroImageFileName}
                    </p>
                  )}
                  {renderCompressionPreview("heroImage")}
                </div>
              </div>
            </div>

            {/* TRAIL IMAGES UPLOAD (MULTIPLE) */}
            <div className="md:col-span-2 bg-gray-50 p-4 rounded-md border border-gray-200 border-dashed">
              <label className="block text-sm font-semibold text-[#4A3B2A] mb-1">
                Trail Gallery Images
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Add all additional images related to this particular trail here.
                You can select multiple files.
              </p>
              <input
                id="trailImagesInput"
                type="file"
                accept="image/*"
                multiple
                onChange={handleTrailImagesChange}
                className={`${inputClasses} bg-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#F3EFE9] file:text-[#4A3B2A] hover:file:bg-[#e6dfd3] cursor-pointer`}
              />
              {renderCompressionPreview("trailImages")}

              {/* EXISTING TRAIL IMAGES PREVIEW */}
              {isEditing &&
                existingTrailImages &&
                existingTrailImages.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-gray-600 mb-2">
                      Existing Images:
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {existingTrailImages.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={`${IMAGE_BASE_URL}${img}`}
                            alt="trail gallery piece"
                            className="w-20 h-20 object-cover rounded shadow-sm border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingTrailImage(img)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove Image"
                          >
                            X
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* QUEUED NEW IMAGES PREVIEW */}
              {trailImageFiles && trailImageFiles.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold text-gray-600 mb-2">
                    New Images to Upload:
                  </p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {trailImageFiles.map((file, idx) => (
                      <li
                        key={idx}
                        className="flex justify-between items-center bg-white p-2 rounded border border-gray-200"
                      >
                        <span className="truncate flex-1 font-medium">
                          {file.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeQueuedTrailImage(idx)}
                          className="text-red-500 font-bold ml-2 px-2 hover:bg-red-50 rounded"
                        >
                          X
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
              />
            </div>

            {/* BULLET ARRAYS */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Highlights (Max 8)
              </label>
              {formData.highlights.map((highlight, index) => (
                <div key={index} className="flex gap-2 mb-2 items-start">
                  <input
                    type="text"
                    placeholder="Title (will be bold)"
                    value={highlight.title}
                    onChange={(e) =>
                      handleHighlightChange(index, "title", e.target.value)
                    }
                    className={`${inputClasses} flex-1 font-semibold`}
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={highlight.description}
                    onChange={(e) =>
                      handleHighlightChange(
                        index,
                        "description",
                        e.target.value,
                      )
                    }
                    className={`${inputClasses} flex-2`}
                  />
                  {formData.highlights.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeHighlight(index)}
                      className="p-2.5 text-red-500 hover:bg-red-50 rounded"
                      title="Remove"
                    >
                      X
                    </button>
                  )}
                </div>
              ))}
              {formData.highlights.length < 8 && (
                <button
                  type="button"
                  onClick={addHighlight}
                  className="mt-1 text-sm text-[#4A3B2A] font-medium hover:underline"
                >
                  + Add Another Highlight
                </button>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                What's Included (Max 8 - One per line)
              </label>
              <textarea
                name="whatsIncluded"
                value={formData.whatsIncluded}
                onChange={handleChange}
                rows="4"
                className={`${inputClasses} resize-none`}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                What's Not Included (Max 8 - One per line)
              </label>
              <textarea
                name="whatsNotIncluded"
                value={formData.whatsNotIncluded}
                onChange={handleChange}
                rows="4"
                className={`${inputClasses} resize-none`}
              />
            </div>

            <div className="md:col-span-2 rounded-md border border-dashed border-gray-200 bg-gray-50 p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <label className="block text-sm font-semibold text-[#4A3B2A]">
                    Upload Itinerary PDF (Optional)
                  </label>
                  <p className="mt-1 text-xs text-gray-500">
                    Add a downloadable itinerary PDF. The final saved file must
                    be 1 MB or smaller.
                  </p>
                </div>

                <div className="rounded-md border border-[#E5D7C5] bg-white px-3 py-2.5 min-w-[160px]">
                  <div className="flex items-center justify-between gap-3 mb-1.5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                      Auto Compress
                    </p>
                    <button
                      type="button"
                      onClick={toggleAutoCompressItineraryPdf}
                      aria-pressed={formData.autoCompressItineraryPdf === "true"}
                      className={`inline-flex w-[60px] items-center rounded-full p-1 transition-colors ${
                        formData.autoCompressItineraryPdf === "true"
                          ? "bg-[#4A3B2A]"
                          : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-[9px] font-semibold text-[#4A3B2A] shadow-sm transition-transform ${
                          formData.autoCompressItineraryPdf === "true"
                            ? "translate-x-[28px]"
                            : "translate-x-0"
                        }`}
                      >
                        {formData.autoCompressItineraryPdf === "true" ? "On" : "Off"}
                      </span>
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-400 leading-relaxed">
                    {formData.autoCompressItineraryPdf === "true"
                      ? "PDFs over 1 MB will be auto-compressed via ILovePDF before saving."
                      : "Only PDFs already under 1 MB are accepted. Turn on to allow larger files."}
                  </p>
                </div>
              </div>

              <input
                id="itineraryPdfInput"
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleItineraryPdfChange}
                className={`${inputClasses} mt-4 bg-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#F3EFE9] file:text-[#4A3B2A] hover:file:bg-[#e6dfd3] cursor-pointer`}
              />

              {itineraryPdfFile && (
                <div className="mt-3 flex flex-col gap-2 rounded-md border border-[#E5D7C5] bg-white p-3 text-sm text-gray-700 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-medium text-[#4A3B2A]">
                      Selected PDF: {itineraryPdfFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Size: {(itineraryPdfFile.size / (1024 * 1024)).toFixed(2)}{" "}
                      MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={clearSelectedItineraryPdf}
                    className="rounded border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Clear Selected PDF
                  </button>
                </div>
              )}

              {!itineraryPdfFile &&
                formData.itineraryPdf &&
                !itineraryPdfMarkedForRemoval && (
                  <div className="mt-3 flex flex-col gap-2 rounded-md border border-[#E5D7C5] bg-white p-3 text-sm text-gray-700 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-medium text-[#4A3B2A]">
                        Current PDF:{" "}
                        {formData.itineraryPdfName || "Itinerary PDF"}
                      </p>
                      <a
                        href={`${IMAGE_BASE_URL}${formData.itineraryPdf}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-medium text-[#4A3B2A] underline underline-offset-2"
                      >
                        View current PDF
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={toggleRemoveCurrentItineraryPdf}
                      className="rounded border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      Remove Current PDF
                    </button>
                  </div>
                )}

              {!itineraryPdfFile && itineraryPdfMarkedForRemoval && (
                <div className="mt-3 flex flex-col gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 md:flex-row md:items-center md:justify-between">
                  <p>The current itinerary PDF will be removed on save.</p>
                  <button
                    type="button"
                    onClick={toggleRemoveCurrentItineraryPdf}
                    className="rounded border border-amber-300 px-3 py-2 text-sm font-medium text-amber-800 hover:bg-amber-100"
                  >
                    Undo Remove
                  </button>
                </div>
              )}

              {itineraryPdfNotice?.text && (
                <div
                  className={`mt-3 rounded-md border p-3 text-sm ${
                    itineraryPdfNotice.type === "error"
                      ? "border-red-200 bg-red-50 text-red-700"
                      : itineraryPdfNotice.type === "success"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-amber-200 bg-amber-50 text-amber-800"
                  }`}
                >
                  {itineraryPdfNotice.text}
                </div>
              )}

              <PdfCompressingSpinner />
              <PdfCompressionBadge />
            </div>
          </div>

          {/* PDF Compressing status bar — visible near the save buttons */}
          {pdfCompressing && (
            <div className="mt-6 flex items-center gap-3 rounded-md border border-[#4A3B2A]/25 bg-[#F3EFE9] px-5 py-3.5">
              <svg
                className="animate-spin h-5 w-5 flex-shrink-0"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle cx="12" cy="12" r="10" stroke="#E5D7C5" strokeWidth="3" />
                <path
                  d="M12 2 A10 10 0 0 1 22 12"
                  stroke="#4A3B2A"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              <div>
                <p className="text-sm font-semibold text-[#4A3B2A]">
                  Compressing PDF via ILovePDF — please wait…
                </p>
                <p className="text-xs text-stone-400 mt-0.5">
                  This typically takes 10–30 seconds. Do not close the page.
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-5">
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
              type="button"
              onClick={(e) => handleAction(e, "draft")}
              disabled={loading || isSaving}
              className="px-8 py-2.5 rounded text-sm font-medium text-[#4A3B2A] bg-white border border-[#4A3B2A] hover:bg-orange-50 disabled:opacity-50 transition-colors shadow-sm"
            >
              {loading && formData.status === "draft"
                ? "Saving..."
                : "Save Draft"}
            </button>
            <button
              type="button"
              onClick={(e) => handleAction(e, "published")}
              disabled={loading || isSaving}
              className="bg-[#4A3B2A] text-[#F3EFE9] px-8 py-2.5 rounded text-sm font-medium hover:bg-[#3a2d20] disabled:opacity-50 transition-colors shadow-sm"
            >
              {loading && formData.status === "published"
                ? "Publishing..."
                : "Publish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrailForm;
