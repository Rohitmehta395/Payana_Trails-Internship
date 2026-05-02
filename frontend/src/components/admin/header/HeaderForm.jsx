import React, { useState, useRef } from "react";
import { Loader2, Save, Upload, Trash2 } from "lucide-react";
import { api, IMAGE_BASE_URL } from "../../../services/api";

// ─── Default / fallback values ───────────────────────────────────────────────
const DEFAULT_DATA = {
  siteName: "Payana Trails",
  navLabels: {
    home: "Home",
    journey: "Journeys",
    payanaWay: "Payana Way",
    stories: "Stories",
    connect: "Connect",
  },
  mobileNumber: "+91 86604 60512",
};

const mergeData = (initial, defaults) => {
  if (!initial || Object.keys(initial).length === 0) return defaults;
  return {
    ...defaults,
    ...initial,
    navLabels: {
      ...defaults.navLabels,
      ...(initial.navLabels || {}),
    },
  };
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const FormField = ({ label, id, value, onChange, hint }) => (
  <div className="mb-4">
    <label
      htmlFor={id}
      className="block text-sm font-semibold text-[#4A3B2A] mb-1"
    >
      {label}
    </label>
    {hint && <p className="text-xs text-gray-500 mb-1">{hint}</p>}
    <input
      id={id}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-[#4A3B2A] focus:outline-none focus:ring-2 focus:ring-[#4A3B2A]/30"
    />
  </div>
);

// ─── Main Form ────────────────────────────────────────────────────────────────
const HeaderForm = ({ initialData, onSave, onDeleteLogo }) => {
  const [data, setData] = useState(() => mergeData(initialData, DEFAULT_DATA));
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const fileRef = useRef(null);

  // ── Logo upload handler ──
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  // ── Logo delete handler ──
  const handleDeleteLogo = async () => {
    if (!window.confirm("Are you sure you want to delete the custom logo and return to the default?")) return;
    
    setLoading(true);
    try {
      await onDeleteLogo();
      setLogoPreview(null);
      setLogoFile(null);
      setMessage({ type: "success", text: "Custom logo deleted. Using default." });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to delete logo." });
    } finally {
      setLoading(false);
    }
  };

  // ── Nav label change helper ──
  const handleNavLabelChange = (key, value) => {
    setData((prev) => ({
      ...prev,
      navLabels: { ...prev.navLabels, [key]: value },
    }));
  };

  // ── Form submit ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    if (logoFile) {
      formData.append("headerLogo", logoFile);
    }

    try {
      await onSave(formData);
      setMessage({ type: "success", text: "Header settings updated successfully!" });
      setLogoFile(null);
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to update header settings." });
    } finally {
      setLoading(false);
    }
  };

  const currentLogo = initialData?.logo;

  return (
    <form onSubmit={handleSubmit}>
      {/* Status message */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg text-sm ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* ── Logo ─────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <h3 className="text-base font-bold text-[#4A3B2A] mb-4 pb-2 border-b border-gray-100">
          Logo
        </h3>

        <div className="flex items-start gap-6 flex-wrap">
          {/* Preview box */}
          <div className="flex-shrink-0">
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
              Current Logo
            </p>
            <div className="h-16 w-16 flex items-center justify-center bg-[#f8f4f4] border border-gray-200 rounded-md p-1">
              {logoPreview || currentLogo ? (
                <img
                  src={logoPreview || `${IMAGE_BASE_URL}${currentLogo}`}
                  alt="Header logo preview"
                  className="h-full w-full object-contain"
                />
              ) : (
                <span className="text-[10px] text-gray-400 italic text-center">
                  Default Logo
                </span>
              )}
            </div>
            {(logoPreview || currentLogo) && (
              <button
                type="button"
                onClick={handleDeleteLogo}
                className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700 transition-colors"
              >
                <Trash2 size={12} />
                Delete Custom Logo
              </button>
            )}
            <p className="text-xs text-gray-400 mt-1">
              Aspect Ratio: 1:1 (Square)
            </p>
          </div>

          {/* Upload control */}
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
              Upload New Logo
            </p>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 border border-[#4A3B2A] text-[#4A3B2A] rounded-md text-sm hover:bg-[#F3EFE9] transition-colors"
            >
              <Upload size={14} />
              Choose File
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoChange}
            />
            {logoFile && (
              <p className="text-xs text-emerald-700 mt-1 font-medium">
                ✓ {logoFile.name} selected
              </p>
            )}
            <div className="mt-2 text-xs text-gray-500 space-y-0.5">
              <p>📐 Recommended size: <strong>512 × 512 px</strong> (1:1 ratio)</p>
              <p>🖼️ Formats: PNG, SVG, WebP (transparent background recommended)</p>
              <p className="text-amber-600">⚠️ Uploading a new logo will delete the previous one.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Site Name ────────────────────────────────────────────────── */}
      <div className="mb-8">
        <h3 className="text-base font-bold text-[#4A3B2A] mb-4 pb-2 border-b border-gray-100">
          Site Name
        </h3>
        <FormField
          label="Brand Name (shown next to logo)"
          id="header-site-name"
          value={data.siteName}
          onChange={(v) => setData((prev) => ({ ...prev, siteName: v }))}
          hint='Displayed in the header as italic serif text, e.g. "Payana Trails".'
        />
      </div>

      {/* ── Navigation Labels ─────────────────────────────────────────── */}
      <div className="mb-8">
        <h3 className="text-base font-bold text-[#4A3B2A] mb-4 pb-2 border-b border-gray-100">
          Navigation Labels
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
          <FormField
            label="Home"
            id="nav-home"
            value={data.navLabels.home}
            onChange={(v) => handleNavLabelChange("home", v)}
          />
          <FormField
            label="Journey"
            id="nav-journey"
            value={data.navLabels.journey}
            onChange={(v) => handleNavLabelChange("journey", v)}
          />
          <FormField
            label="Payana Way"
            id="nav-payana-way"
            value={data.navLabels.payanaWay}
            onChange={(v) => handleNavLabelChange("payanaWay", v)}
          />
          <FormField
            label="Stories"
            id="nav-stories"
            value={data.navLabels.stories}
            onChange={(v) => handleNavLabelChange("stories", v)}
          />
          <FormField
            label="Connect"
            id="nav-connect"
            value={data.navLabels.connect}
            onChange={(v) => handleNavLabelChange("connect", v)}
          />
        </div>
      </div>

      {/* ── Mobile / WhatsApp Number ──────────────────────────────────── */}
      <div className="mb-8">
        <h3 className="text-base font-bold text-[#4A3B2A] mb-4 pb-2 border-b border-gray-100">
          Contact Number
        </h3>
        <FormField
          label="Mobile / WhatsApp Number"
          id="header-mobile"
          value={data.mobileNumber}
          onChange={(v) => setData((prev) => ({ ...prev, mobileNumber: v }))}
          hint='Include country code — used for both the Call and WhatsApp buttons, e.g. "+91 86604 60512".'
        />
      </div>

      {/* ── Save Button ───────────────────────────────────────────────── */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2 bg-[#4A3B2A] text-white rounded-md font-medium hover:bg-[#3a2d20] transition-colors disabled:opacity-70"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Save Header Settings
        </button>
      </div>
    </form>
  );
};

export default HeaderForm;
