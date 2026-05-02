import React, { useState, useRef, useEffect } from "react";
import { Loader2, Save, Upload, Trash2, Plus, X, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { api, IMAGE_BASE_URL } from "../../../services/api";

// ─── Default / fallback values ───────────────────────────────────────────────
const DEFAULT_DATA = {
  brandName: "Payana Trails",
  subtitle: "Crafting meaningful journeys through thoughtful, immersive travel experiences.",
  socialLinks: [
    { platform: "WhatsApp", url: "" },
    { platform: "Facebook", url: "" },
    { platform: "Instagram", url: "" },
    { platform: "YouTube", url: "" },
    { platform: "LinkedIn", url: "" },
  ],
  columns: [
    {
      heading: "JOURNEYS",
      links: [
        { label: "Signature Trails", url: "/journeys/signature" },
        { label: "Wildlife Trails", url: "/journeys/wildlife" },
        { label: "Heritage Trails", url: "/journeys/heritage" },
        { label: "Cultural & Immersive Trails", url: "/journeys/cultural" },
      ]
    },
    {
      heading: "THE PAYANA WAY",
      links: [
        { label: "A Journey Begins", url: "/payana-way#journey-begins" },
        { label: "The Payana Difference", url: "/payana-way#difference" },
        { label: "Journeys with Purpose", url: "/payana-way#purpose" },
        { label: "In the Media", url: "/payana-way#media" },
      ]
    },
    {
      heading: "STORIES",
      links: [
        { label: "Travel Stories", url: "/stories" },
        { label: "Stories from our Guests", url: "/stories/external" },
        { label: "Voices from the Trail", url: "/stories#voices" },
        { label: "Newsletter", url: "/#newsletter" },
      ]
    },
    {
      heading: "CONNECT",
      links: [
        { label: "Enquiry", url: "/connect" },
        { label: "FAQs", url: "/connect#faq" },
        { label: "Refer Your Friends", url: "/connect#refer" },
        { label: "Gift a Journey", url: "/connect#gift" },
        { label: "Connect With Us", url: "/connect#contact" },
      ]
    }
  ],
  motto: "Journeys, thoughtfully curated!",
  mapButtonText: "VIEW ON MAP",
  mapLink: "",
  address: "110, Sowmya Springs, Basavanagudi, Bangalore - 560 004",
  email: "info@payanatrails.com",
  phone: "+91 8660460512",
  bottomLinks: [
    { label: "Home", url: "/" },
    { label: "Journeys", url: "/journeys" },
    { label: "Payana Way", url: "/payana-way" },
    { label: "Stories", url: "/stories" },
    { label: "Connect", url: "/connect" },
  ],
  copyrightText: "© 2026 Payana Trails. All Rights Reserved.",
};

const mergeData = (initial, defaults) => {
  if (!initial || Object.keys(initial).length === 0) return defaults;
  return {
    ...defaults,
    ...initial,
    socialLinks: initial.socialLinks?.length ? initial.socialLinks : defaults.socialLinks,
    columns: initial.columns?.length ? initial.columns : defaults.columns.map(c => ({...c})),
    bottomLinks: initial.bottomLinks?.length ? initial.bottomLinks : defaults.bottomLinks,
  };
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const FormField = ({ label, id, value, onChange, hint, type = "text" }) => (
  <div className="mb-4">
    <label
      htmlFor={id}
      className="block text-sm font-semibold text-[#4A3B2A] mb-1"
    >
      {label}
    </label>
    {hint && <p className="text-xs text-gray-500 mb-1 italic">{hint}</p>}
    {type === "textarea" ? (
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#4A3B2A] focus:outline-none focus:ring-2 focus:ring-[#4A3B2A]/10 focus:border-[#4A3B2A]/30 transition-all bg-gray-50/30"
      />
    ) : (
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#4A3B2A] focus:outline-none focus:ring-2 focus:ring-[#4A3B2A]/10 focus:border-[#4A3B2A]/30 transition-all bg-gray-50/30"
      />
    )}
  </div>
);

// ─── Main Form ────────────────────────────────────────────────────────────────
// --- Sortable Item Component ---
const SortableLinkItem = ({ 
  link, 
  linkIdx, 
  colIdx, 
  updateColumnLink, 
  removeColumnLink 
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 0,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`flex gap-4 items-start bg-gray-50/30 p-4 rounded-xl border border-gray-100 hover:border-[#4A3B2A]/20 transition-all group ${isDragging ? "shadow-lg ring-2 ring-[#4A3B2A]/10 bg-white" : ""}`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="mt-7 text-gray-300 hover:text-[#4A3B2A] cursor-grab active:cursor-grabbing transition-colors"
      >
        <GripVertical size={20} />
      </button>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Label</label>
          <input
            type="text"
            placeholder="e.g. Signature Trails"
            value={link.label}
            onChange={(e) => updateColumnLink(colIdx, linkIdx, "label", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#4A3B2A] font-medium focus:ring-2 focus:ring-[#4A3B2A]/5 focus:border-[#4A3B2A]/30 transition-all bg-white"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Redirect URL</label>
          <input
            type="text"
            placeholder="e.g. /journeys/signature"
            value={link.url}
            onChange={(e) => updateColumnLink(colIdx, linkIdx, "url", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-600 font-mono focus:ring-2 focus:ring-[#4A3B2A]/5 focus:border-[#4A3B2A]/30 transition-all bg-white"
          />
        </div>
      </div>
      
      <button
        type="button"
        onClick={() => removeColumnLink(colIdx, linkIdx)}
        className="mt-6 p-2 text-gray-300 hover:text-red-500 hover:bg-white rounded-lg transition-all shadow-sm opacity-0 group-hover:opacity-100 border border-transparent hover:border-red-100"
      >
        <X size={18} />
      </button>
    </div>
  );
};

const FooterForm = ({ initialData, onSave, onDeleteLogo, activeTab }) => {
  const [data, setData] = useState(() => {
    const merged = mergeData(initialData, DEFAULT_DATA);
    return {
      ...merged,
      columns: merged.columns.map(col => ({
        ...col,
        links: col.links.map((link, idx) => ({
          ...link,
          id: link.id || `${Date.now()}-${Math.random()}-${idx}`
        }))
      }))
    };
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const fileRef = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px movement required to start dragging
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event, colIdx) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const updatedColumns = [...data.columns];
      const column = updatedColumns[colIdx];
      const oldIndex = column.links.findIndex((l) => l.id === active.id);
      const newIndex = column.links.findIndex((l) => l.id === over.id);

      column.links = arrayMove(column.links, oldIndex, newIndex);
      setData({ ...data, columns: updatedColumns });
    }
  };

  useEffect(() => {
    if (initialData) {
      const merged = mergeData(initialData, DEFAULT_DATA);
      setData({
        ...merged,
        columns: merged.columns.map((col, cIdx) => ({
          ...col,
          links: col.links.map((link, lIdx) => ({
            ...link,
            id: link.id || `init-${cIdx}-${lIdx}-${Date.now()}`
          }))
        }))
      });
    }
  }, [initialData]);

  // ── Logo handlers ──
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

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

  // ── Array management helpers ──
  const updateSocialLink = (index, field, value) => {
    const newList = [...data.socialLinks];
    newList[index] = { ...newList[index], [field]: value };
    setData({ ...data, socialLinks: newList });
  };

  const updateColumnHeading = (colIndex, value) => {
    const newCols = [...data.columns];
    newCols[colIndex] = { ...newCols[colIndex], heading: value };
    setData({ ...data, columns: newCols });
  };

  const updateColumnLink = (colIndex, linkIndex, field, value) => {
    const newCols = [...data.columns];
    const newLinks = [...newCols[colIndex].links];
    newLinks[linkIndex] = { ...newLinks[linkIndex], [field]: value };
    newCols[colIndex] = { ...newCols[colIndex], links: newLinks };
    setData({ ...data, columns: newCols });
  };

  const addColumnLink = (colIndex) => {
    const newCols = [...data.columns];
    const newId = `link-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    newCols[colIndex].links.push({ label: "", url: "", id: newId });
    setData({ ...data, columns: newCols });
  };

  const removeColumnLink = (colIndex, linkIndex) => {
    const newCols = [...data.columns];
    newCols[colIndex].links.splice(linkIndex, 1);
    setData({ ...data, columns: newCols });
  };

  const updateBottomLink = (index, field, value) => {
    const newList = [...data.bottomLinks];
    newList[index] = { ...newList[index], [field]: value };
    setData({ ...data, bottomLinks: newList });
  };

  const addBottomLink = () => {
    const newId = `bottom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setData({ ...data, bottomLinks: [...data.bottomLinks, { label: "", url: "", id: newId }] });
  };

  const removeBottomLink = (index) => {
    const newList = [...data.bottomLinks];
    newList.splice(index, 1);
    setData({ ...data, bottomLinks: newList });
  };

  // ── Form submit ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    if (logoFile) {
      formData.append("footerLogo", logoFile);
    }

    try {
      await onSave(formData);
      setMessage({ type: "success", text: "Footer settings updated successfully!" });
      setLogoFile(null);
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to update footer settings." });
    } finally {
      setLoading(false);
    }
  };

  const currentLogo = initialData?.logo;

  const renderSection = () => {
    switch (activeTab) {
      case "brand":
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-start gap-8 flex-wrap">
              {/* Preview box */}
              <div className="flex-shrink-0">
                <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                  Current Logo
                </p>
                <div className="h-24 w-24 flex items-center justify-center bg-[#f8f4f4] border border-gray-200 rounded-md p-1">
                  {logoPreview || currentLogo ? (
                    <img
                      src={logoPreview || `${IMAGE_BASE_URL}${currentLogo}`}
                      alt="Footer logo preview"
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
                <p className="text-[10px] text-gray-400 mt-2 font-medium">
                  Aspect Ratio: 1:1 (Square)
                </p>
              </div>

              {/* Upload control */}
              <div className="flex-1 min-w-[280px]">
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
                  <p className="text-xs text-emerald-700 mt-2 font-medium flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 w-fit">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    {logoFile.name} selected
                  </p>
                )}
                <div className="mt-4 text-[11px] text-gray-500 space-y-2 max-w-lg">
                  <p className="flex items-center gap-2">
                    <span className="text-gray-400">📐</span> Recommended size: <strong className="text-gray-700">512 × 512 px</strong> (1:1 ratio)
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-gray-400">🖼️</span> Formats: <span className="text-gray-700">PNG, SVG, WebP (transparent background recommended)</span>
                  </p>
                  <p className="flex items-center gap-2 text-amber-600 font-medium">
                    <span className="text-amber-500">⚠️</span> Uploading a new logo will delete the previous one.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <FormField
                label="Brand Name"
                id="footer-brand-name"
                value={data.brandName}
                onChange={(v) => setData({ ...data, brandName: v })}
                hint="Used as the main title in the footer brand section"
              />
              <FormField
                label="Subtitle"
                id="footer-subtitle"
                type="textarea"
                value={data.subtitle}
                onChange={(v) => setData({ ...data, subtitle: v })}
                hint="Line breaks will be preserved in the frontend display"
              />
            </div>
          </div>
        );
      case "social":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {data.socialLinks.map((link, idx) => (
              <div key={idx} className="p-5 border border-gray-100 rounded-2xl bg-gray-50/50 flex flex-col gap-3 group hover:border-[#4A3B2A]/20 transition-all">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#4A3B2A] uppercase tracking-widest">{link.platform}</span>
                </div>
                <input
                  type="text"
                  placeholder={`Enter ${link.platform} Profile URL`}
                  value={link.url}
                  onChange={(e) => updateSocialLink(idx, "url", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm text-[#4A3B2A] focus:outline-none focus:ring-2 focus:ring-[#4A3B2A]/10 bg-white"
                />
              </div>
            ))}
          </div>
        );
      case "columns":
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-1 gap-10">
              {data.columns.map((col, colIdx) => (
                <div key={colIdx} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="bg-gray-50/50 px-6 py-6 border-b border-gray-200">
                    <div className="flex-1">
                        <input
                          type="text"
                          value={col.heading}
                          onChange={(e) => updateColumnHeading(colIdx, e.target.value)}
                          className="w-full border-none bg-transparent p-0 text-xl font-bold text-[#4A3B2A] focus:ring-0 placeholder-gray-300"
                          placeholder="COLUMN HEADING"
                        />
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-bold text-[#4A3B2A] uppercase tracking-wide">Navigation Links</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <DndContext 
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={(e) => handleDragEnd(e, colIdx)}
                      >
                        <SortableContext 
                          items={col.links.map(l => l.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          {col.links.map((link, linkIdx) => (
                            <SortableLinkItem 
                              key={link.id}
                              link={link}
                              linkIdx={linkIdx}
                              colIdx={colIdx}
                              updateColumnLink={updateColumnLink}
                              removeColumnLink={removeColumnLink}
                            />
                          ))}
                        </SortableContext>
                      </DndContext>
                    </div>

                    <button
                      type="button"
                      onClick={() => addColumnLink(colIdx)}
                      className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-sm font-bold text-gray-400 hover:text-[#4A3B2A] hover:border-[#4A3B2A]/30 hover:bg-[#F3EFE9]/10 transition-all flex items-center justify-center gap-2 mt-4"
                    >
                      <Plus size={18} /> Add New Link to Column
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "location":
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* First Row: Brand & Map */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h4 className="text-xs font-bold text-[#4A3B2A] mb-4 uppercase tracking-widest border-b border-gray-50 pb-2">Location Brand</h4>
                    <FormField
                    label="Quote / Motto"
                    id="footer-motto"
                    value={data.motto}
                    onChange={(v) => setData({ ...data, motto: v })}
                    hint="Displayed above the address, e.g. 'Journeys, thoughtfully curated!'"
                    />
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h4 className="text-xs font-bold text-[#4A3B2A] mb-4 uppercase tracking-widest border-b border-gray-50 pb-2">Map Integration</h4>
                    <div className="grid grid-cols-1 gap-4">
                        <FormField
                        label="Map Button Text"
                        id="footer-map-btn"
                        value={data.mapButtonText}
                        onChange={(v) => setData({ ...data, mapButtonText: v })}
                        />
                        <FormField
                        label="Google Maps URL"
                        id="footer-map-link"
                        value={data.mapLink}
                        onChange={(v) => setData({ ...data, mapLink: v })}
                        hint="The destination URL when clicking 'View on Map'"
                        />
                    </div>
                </div>
            </div>

            {/* Second Row: Contact Info */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h4 className="text-xs font-bold text-[#4A3B2A] mb-4 uppercase tracking-widest border-b border-gray-50 pb-2">Contact Information</h4>
                <FormField
                label="Physical Address"
                id="footer-address"
                type="textarea"
                value={data.address}
                onChange={(v) => setData({ ...data, address: v })}
                hint="Full office or registered address"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-4">
                    <FormField
                    label="Official Email"
                    id="footer-email"
                    value={data.email}
                    onChange={(v) => setData({ ...data, email: v })}
                    />
                    <FormField
                    label="Primary Phone"
                    id="footer-phone"
                    value={data.phone}
                    onChange={(v) => setData({ ...data, phone: v })}
                    />
                </div>
            </div>
          </div>
        );
      case "bottom":
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-6 border-b border-gray-50 pb-4">
                  <div>
                    <h4 className="text-xs font-bold text-[#4A3B2A] uppercase tracking-widest">Bottom Inline Links</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Visible at the very bottom of every page</p>
                  </div>
                  <button
                    type="button"
                    onClick={addBottomLink}
                    className="flex items-center gap-2 px-4 py-2 bg-[#4A3B2A] text-white rounded-xl text-xs font-bold hover:bg-[#3a2d20] transition-all shadow-md shadow-[#4A3B2A]/10 active:scale-95"
                    >
                    <Plus size={14} /> Add Link
                  </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.bottomLinks.map((link, idx) => (
                  <div key={idx} className="flex gap-4 items-center p-5 border border-gray-100 rounded-2xl bg-gray-50/30 group hover:border-[#4A3B2A]/10 transition-all relative">
                    <div className="flex-1 space-y-4">
                      <div>
                        <label className="block text-[9px] font-bold text-gray-400 mb-1 uppercase tracking-tighter">Label</label>
                        <input
                            type="text"
                            placeholder="e.g. Terms of Service"
                            value={link.label}
                            onChange={(e) => updateBottomLink(idx, "label", e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2 text-xs text-[#4A3B2A] font-bold focus:ring-2 focus:ring-[#4A3B2A]/5 focus:border-[#4A3B2A]/20 transition-all bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-gray-400 mb-1 uppercase tracking-tighter">Redirect URL</label>
                        <input
                            type="text"
                            placeholder="/terms"
                            value={link.url}
                            onChange={(e) => updateBottomLink(idx, "url", e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2 text-[10px] text-gray-500 font-mono focus:ring-2 focus:ring-[#4A3B2A]/5 focus:border-[#4A3B2A]/20 transition-all bg-white"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeBottomLink(idx)}
                      className="absolute -top-2 -right-2 w-7 h-7 bg-white text-gray-300 hover:text-red-500 border border-gray-100 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-md hover:scale-110 active:scale-90"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              {data.bottomLinks.length === 0 && (
                <div className="py-12 text-center border-2 border-dashed border-gray-100 rounded-2xl">
                    <p className="text-sm font-medium text-gray-400 italic">No bottom links added yet.</p>
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h4 className="text-xs font-bold text-[#4A3B2A] mb-4 uppercase tracking-widest border-b border-gray-50 pb-2">Copyright Settings</h4>
                <FormField
                label="Copyright Text"
                id="footer-copyright"
                value={data.copyrightText}
                onChange={(v) => setData({ ...data, copyrightText: v })}
                hint="Use standard format, e.g. © 2026 Payana Trails. All Rights Reserved."
                />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Status message */}
      {message && (
        <div className={`mb-8 p-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
          message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm shadow-emerald-100/50" : "bg-red-50 text-red-700 border border-red-100 shadow-sm shadow-red-100/50"
        }`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${message.type === "success" ? "bg-emerald-500" : "bg-red-500"} text-white`}>
            {message.type === "success" ? "✓" : "!"}
          </div>
          {message.text}
        </div>
      )}

      {/* Render selected section */}
      <div className="min-h-[400px]">
        {renderSection()}
      </div>

      {/* Save Button */}
      <div className="mt-12 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-3 px-10 py-4 bg-[#4A3B2A] text-white rounded-2xl font-semibold shadow-xl shadow-[#4A3B2A]/20 hover:bg-[#3a2d20] hover:scale-[1.03] active:scale-[0.97] transition-all disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
        >
          {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
          Save Footer Section
        </button>
      </div>
    </form>
  );
};

export default FooterForm;
