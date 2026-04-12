import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Upload,
  Trash2,
  Edit3,
  Check,
  X,
  Eye,
  EyeOff,
  Image as ImageIcon,
  ChevronDown,
  Info,
  Loader2,
  Zap,
  Home,
  Map,
  Leaf,
  BookOpen,
  Mail,
  MapPin,
  Star,
  Binoculars,
  Landmark,
  Drama,
  MonitorCheck,
  ArrowRight,
  Layers,
  Smartphone,
  Monitor,
  AlertCircle,
} from "lucide-react";
import { api, IMAGE_BASE_URL } from "../../../services/api";

// ─── Constants ───────────────────────────────────────────────────────────────

// Icon components per page (Lucide icons, no emojis)
const PAGE_META = {
  home: { label: "Home", Icon: Home, path: "/", group: "main" },
  journeys: { label: "Journeys", Icon: Map, path: "/journeys", group: "main" },
  "payana-way": {
    label: "Payana Way",
    Icon: Leaf,
    path: "/payana-way",
    group: "main",
  },
  stories: {
    label: "Stories",
    Icon: BookOpen,
    path: "/stories",
    group: "main",
  },
  connect: { label: "Connect", Icon: Mail, path: "/connect", group: "main" },
  "journeys/destinations": {
    label: "Destinations",
    Icon: MapPin,
    path: "/journeys/destinations",
    group: "journeys",
  },
  "journeys/signature": {
    label: "Signature Trails",
    Icon: Star,
    path: "/journeys/signature",
    group: "journeys",
  },
  "journeys/wildlife": {
    label: "Wildlife Trails",
    Icon: Binoculars,
    path: "/journeys/wildlife",
    group: "journeys",
  },
  "journeys/heritage": {
    label: "Heritage Trails",
    Icon: Landmark,
    path: "/journeys/heritage",
    group: "journeys",
  },
  "journeys/cultural": {
    label: "Cultural Trails",
    Icon: Drama,
    path: "/journeys/cultural",
    group: "journeys",
  },
};

// ─── Utility ─────────────────────────────────────────────────────────────────

const formatBytes = (bytes = 0) => {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${bytes} B`;
};

// ─── Sortable Image Card ──────────────────────────────────────────────────────

const SortableImageCard = ({
  image,
  variant,
  pageKey,
  onDelete,
  onRemoveMobile,
  onToggleActive,
  onEdit,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const hasMobile = !!image.mobileUrl;
  const isMobileView = variant === "mobile";
  const imgSrc = isMobileView
    ? `${IMAGE_BASE_URL}${image.mobileUrl}`
    : `${IMAGE_BASE_URL}${image.url}`;
  const imgAspect = isMobileView ? "aspect-[3/4]" : "aspect-video";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group bg-white rounded-xl border-2 overflow-hidden flex flex-col transition-all duration-200 ${
        isDragging
          ? "border-[#4A3B2A] shadow-2xl opacity-70 scale-105"
          : image.isActive
            ? "border-gray-200 hover:border-[#4A3B2A]/40 shadow-sm hover:shadow-md"
            : "border-dashed border-gray-300 opacity-60"
      }`}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 z-10 p-1 bg-white/80 rounded-md text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        title="Drag to reorder"
      >
        <GripVertical size={14} />
      </button>

      {/* Status badge */}
      <div className="absolute top-2 right-2 z-10">
        <span
          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
            image.isActive
              ? "bg-emerald-100 text-emerald-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {image.isActive ? "Active" : "Hidden"}
        </span>
      </div>

      {/* Image preview — variant-aware */}
      <div
        className={`relative w-full ${imgAspect} bg-gray-100 overflow-hidden`}
      >
        <img
          src={imgSrc}
          alt={image.alt || (isMobileView ? "Mobile" : "Desktop")}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.src = isMobileView
              ? "https://placehold.co/200x267?text=Mobile"
              : "https://placehold.co/400x225?text=Desktop";
          }}
        />
        {/* Variant label */}
        <div className="absolute bottom-0 inset-x-0 bg-black/40 flex items-center justify-center gap-0.5 py-0.5">
          {isMobileView ? (
            <>
              <Smartphone size={9} className="text-white" />
              <span className="text-[9px] text-white font-semibold">
                Mobile
              </span>
            </>
          ) : (
            <>
              <Monitor size={9} className="text-white" />
              <span className="text-[9px] text-white font-semibold">
                Desktop
              </span>
            </>
          )}
        </div>
        {/* Desktop mode: show mobile badge if mobile version exists */}
        {!isMobileView && hasMobile && (
          <div className="absolute top-1 left-1 flex items-center gap-0.5 bg-[#4A3B2A]/70 rounded px-1 py-0.5">
            <Smartphone size={8} className="text-white" />
            <span className="text-[8px] text-white font-medium">+M</span>
          </div>
        )}
      </div>

      {/* Caption / alt */}
      <div className="px-3 py-2 flex-1">
        <p className="text-xs text-gray-500 truncate">
          {image.alt || (
            <span className="italic text-gray-300">No caption</span>
          )}
        </p>
      </div>

      {/* Actions */}
      <div className="px-3 pb-3 flex items-center gap-2">
        <button
          onClick={() => onEdit(image)}
          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          title="Edit image"
        >
          <Edit3 size={12} />
          Edit
        </button>
        {/* Hide/show — only meaningful in desktop mode (order is shared) */}
        {isMobileView ? (
          // Mobile mode: remove just the mobile file, keep desktop entry
          <button
            onClick={() => onRemoveMobile(image._id)}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
            title="Remove mobile image"
          >
            <Trash2 size={12} />
            Remove
          </button>
        ) : (
          <>
            <button
              onClick={() => onToggleActive(image._id)}
              className={`flex items-center justify-center p-1.5 rounded-lg transition-colors ${
                image.isActive
                  ? "text-amber-600 bg-amber-50 hover:bg-amber-100"
                  : "text-emerald-600 bg-emerald-50 hover:bg-emerald-100"
              }`}
              title={image.isActive ? "Hide image" : "Show image"}
            >
              {image.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
            <button
              onClick={() => onDelete(image._id)}
              className="flex items-center justify-center p-1.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              title="Delete image (desktop + mobile)"
            >
              <Trash2 size={14} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// ─── Edit Image Modal ─────────────────────────────────────────────────────────

const EditModal = ({ image, pageKey, onClose, onSave }) => {
  const [alt, setAlt] = useState(image.alt || "");
  // Desktop state
  const [newDesktopFile, setNewDesktopFile] = useState(null);
  const [desktopPreview, setDesktopPreview] = useState(null);
  const [desktopStat, setDesktopStat] = useState(null);
  // Mobile state
  const [newMobileFile, setNewMobileFile] = useState(null);
  const [mobilePreview, setMobilePreview] = useState(null);
  const [mobileStat, setMobileStat] = useState(null);
  const [removeMobile, setRemoveMobile] = useState(false);

  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const desktopRef = useRef();
  const mobileRef = useRef();

  const previewCompression = async (file, variant) => {
    try {
      const formData = new FormData();
      const field =
        variant === "mobile" ? "pageHeroImagesMobile" : "pageHeroImages";
      formData.append(field, file);
      const pk = pageKey.replace(/\//g, "~");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000/api"}/page-heroes/${pk}/preview-compression`,
        { method: "POST", body: formData },
      );
      const data = await res.json();
      return (data.imageStats || [])[0] || null;
    } catch {
      return null;
    }
  };

  const handleDesktopFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewDesktopFile(file);
    setDesktopPreview(URL.createObjectURL(file));
    setPreviewLoading(true);
    setDesktopStat(await previewCompression(file, "desktop"));
    setPreviewLoading(false);
  };

  const handleMobileFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewMobileFile(file);
    setMobilePreview(URL.createObjectURL(file));
    setRemoveMobile(false);
    setPreviewLoading(true);
    setMobileStat(await previewCompression(file, "mobile"));
    setPreviewLoading(false);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(image._id, {
        alt,
        file: newDesktopFile || undefined,
        mobileFile: newMobileFile || undefined,
        removeMobile,
      });
      onClose();
    } catch (err) {
      alert(err.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const StatPill = ({ stat }) =>
    stat ? (
      <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-1 mt-1.5">
        <Zap size={11} />
        {formatBytes(stat.originalSize)} → {formatBytes(stat.compressedSize)}
        <span className="font-bold">({stat.savedPercent}% saved)</span>
      </div>
    ) : null;

  const currentMobile = image.mobileUrl && !removeMobile;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#4A3B2A] px-6 py-4 flex items-center justify-between shrink-0">
          <h3 className="text-white font-semibold">Edit Hero Image</h3>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          <div className="p-6 space-y-5">
            {/* Desktop + Mobile side-by-side preview */}
            <div className="grid grid-cols-2 gap-4">
              {/* Desktop */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Monitor size={14} className="text-[#4A3B2A]" />
                  <span className="text-sm font-semibold text-[#4A3B2A]">
                    Desktop
                  </span>
                  <span className="text-[10px] text-gray-400 ml-1">
                    1920 × 1080
                  </span>
                </div>
                <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                  <img
                    src={desktopPreview || `${IMAGE_BASE_URL}${image.url}`}
                    alt="desktop preview"
                    className="w-full h-full object-cover"
                  />
                  {desktopPreview && (
                    <div className="absolute top-1.5 right-1.5 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                      New
                    </div>
                  )}
                </div>
                <StatPill stat={desktopStat} />
                <button
                  onClick={() => desktopRef.current?.click()}
                  className="mt-2 w-full border border-dashed border-gray-300 hover:border-[#4A3B2A] rounded-xl py-2 text-xs text-gray-500 hover:text-[#4A3B2A] transition-colors flex items-center justify-center gap-1.5"
                >
                  <Upload size={12} />
                  {newDesktopFile
                    ? newDesktopFile.name.slice(0, 22) + "…"
                    : "Replace desktop image"}
                </button>
                <input
                  ref={desktopRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleDesktopFile}
                />
              </div>

              {/* Mobile */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Smartphone size={14} className="text-[#4A3B2A]" />
                  <span className="text-sm font-semibold text-[#4A3B2A]">
                    Mobile
                  </span>
                  <span className="text-[10px] text-gray-400 ml-1">
                    768 × 1024
                  </span>
                </div>

                {currentMobile || mobilePreview ? (
                  <>
                    <div
                      className="relative rounded-xl overflow-hidden bg-gray-100 border border-gray-200"
                      style={{ aspectRatio: "3/4" }}
                    >
                      <img
                        src={
                          mobilePreview || `${IMAGE_BASE_URL}${image.mobileUrl}`
                        }
                        alt="mobile preview"
                        className="w-full h-full object-cover"
                      />
                      {mobilePreview && (
                        <div className="absolute top-1.5 right-1.5 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                          New
                        </div>
                      )}
                    </div>
                    <StatPill stat={mobileStat} />
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => mobileRef.current?.click()}
                        className="flex-1 border border-dashed border-gray-300 hover:border-[#4A3B2A] rounded-xl py-2 text-xs text-gray-500 hover:text-[#4A3B2A] transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Upload size={11} />
                        {newMobileFile
                          ? newMobileFile.name.slice(0, 16) + "…"
                          : "Replace"}
                      </button>
                      <button
                        onClick={() => {
                          setRemoveMobile(true);
                          setMobilePreview(null);
                          setMobileStat(null);
                          setNewMobileFile(null);
                        }}
                        className="px-3 py-2 border border-red-200 text-red-500 hover:bg-red-50 rounded-xl text-xs flex items-center gap-1 transition-colors"
                        title="Remove mobile image"
                      >
                        <Trash2 size={11} /> Remove
                      </button>
                    </div>
                  </>
                ) : removeMobile ? (
                  <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-red-200 bg-red-50 text-red-500 text-xs py-6 gap-2">
                    <AlertCircle size={20} />
                    <p>Mobile image will be removed on save.</p>
                    <button
                      onClick={() => setRemoveMobile(false)}
                      className="underline text-[11px]"
                    >
                      Undo
                    </button>
                  </div>
                ) : (
                  <>
                    <div
                      onClick={() => mobileRef.current?.click()}
                      className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 hover:border-[#4A3B2A]/50 rounded-xl cursor-pointer transition-colors bg-gray-50 hover:bg-[#F3EFE9]/40 gap-2 py-6"
                      style={{ aspectRatio: "3/4" }}
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <Smartphone size={20} className="text-gray-400" />
                      </div>
                      <p className="text-xs text-gray-400 text-center px-2">
                        No mobile image
                        <br />
                        <span className="text-[10px]">
                          Click to add (optional)
                        </span>
                      </p>
                    </div>
                  </>
                )}
                <input
                  ref={mobileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleMobileFile}
                />
              </div>
            </div>

            {previewLoading && (
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Loader2 size={12} className="animate-spin" /> Calculating
                compression…
              </div>
            )}

            {/* Alt text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Caption / Alt Text
              </label>
              <input
                type="text"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                placeholder="Describe the image…"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A3B2A]/30 focus:border-[#4A3B2A]"
              />
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 pt-2 flex gap-3 border-t border-gray-100 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-[#4A3B2A] text-white hover:bg-[#3a2d20] text-sm font-medium transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Check size={16} />
            )}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Upload Zone ──────────────────────────────────────────────────────────────

/**
 * UploadZone
 * ----------
 * Single-panel dropzone. Variant comes from the parent toggle.
 *   variant = "desktop" → sends pageHeroImages field, creates new entries
 *   variant = "mobile"  → sends pageHeroImagesMobile field, attaches to existing
 */
const UploadZone = ({ pageKey, variant, onUploaded }) => {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [stats, setStats] = useState([]);

  const [compressionLoading, setCompressionLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [message, setMessage] = useState(null);
  const fileRef = useRef();

  // Reset when variant or page changes
  useEffect(() => {
    setFiles([]);
    setPreviews([]);
    setStats([]);
    setMessage(null);
  }, [variant, pageKey]);

  const previewCompression = async (arr) => {
    setCompressionLoading(true);
    try {
      const pk = pageKey.replace(/\//g, "~");
      const fd = new FormData();
      const field =
        variant === "mobile" ? "pageHeroImagesMobile" : "pageHeroImages";
      arr.forEach((f) => fd.append(field, f));
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000/api"}/page-heroes/${pk}/preview-compression`,
        { method: "POST", body: fd },
      );
      const data = await res.json();
      setStats(data.imageStats || []);
    } catch {
      setStats([]);
    }
    setCompressionLoading(false);
  };

  const handleFiles = (selected) => {
    const arr = Array.from(selected);
    setFiles(arr);
    setPreviews(arr.map((f) => URL.createObjectURL(f)));
    setMessage(null);
    previewCompression(arr);
  };

  const handleUpload = async () => {
    if (!files.length) return;
    setUploading(true);
    setMessage(null);
    try {
      if (variant === "mobile") {
        await api.uploadPageHeroImages(pageKey, [], files); // desktop=[], mobile=files
      } else {
        await api.uploadPageHeroImages(pageKey, files, []);
      }
      setMessage({
        type: "success",
        text: `${files.length} ${variant} image(s) uploaded!`,
      });
      setFiles([]);
      setPreviews([]);
      setStats([]);
      onUploaded();
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Upload failed." });
    } finally {
      setUploading(false);
    }
  };

  const isPortrait = variant === "mobile";
  const specText = isPortrait
    ? "768 × 1024 px (3:4 portrait)"
    : "1920 × 1080 px (16:9 landscape)";

  return (
    <div className="space-y-4">
      {/* Spec hint */}
      <div className="flex items-center gap-2 text-xs text-[#4A3B2A]/70 bg-[#F3EFE9] rounded-xl px-4 py-2.5 border border-[#4A3B2A]/10">
        <Info size={13} className="shrink-0 text-[#4A3B2A]/50" />
        <span>
          <span className="font-semibold text-[#4A3B2A]">
            {isPortrait ? "Mobile images:" : "Desktop images:"}
          </span>{" "}
          {specText} · Auto-compressed to WebP
        </span>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 ${
          isDragOver
            ? "border-[#4A3B2A] bg-[#4A3B2A]/5 scale-[1.01]"
            : files.length > 0
              ? "border-[#4A3B2A]/40 bg-[#F3EFE9]/30"
              : "border-gray-300 hover:border-[#4A3B2A]/50 hover:bg-gray-50"
        }`}
        style={{ minHeight: 140 }}
      >
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="flex flex-col items-center justify-center gap-3 p-8">
          <div
            className={`p-4 rounded-full transition-colors ${
              isDragOver
                ? "bg-[#4A3B2A]/10"
                : files.length > 0
                  ? "bg-[#4A3B2A]/10"
                  : "bg-gray-100"
            }`}
          >
            {isPortrait ? (
              <Smartphone
                size={26}
                className={
                  isDragOver || files.length > 0
                    ? "text-[#4A3B2A]"
                    : "text-gray-400"
                }
              />
            ) : (
              <Monitor
                size={26}
                className={
                  isDragOver || files.length > 0
                    ? "text-[#4A3B2A]"
                    : "text-gray-400"
                }
              />
            )}
          </div>
          {files.length > 0 ? (
            <div className="text-center">
              <p className="font-semibold text-[#4A3B2A] text-sm">
                {files.length} file(s) ready
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Click to change selection
              </p>
            </div>
          ) : (
            <div className="text-center">
              <p className="font-medium text-gray-700 text-sm">
                {isDragOver
                  ? "Drop images here"
                  : "Drop images or click to browse"}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Multiple images supported
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Preview grid */}
      {previews.length > 0 && (
        <div
          className={`grid gap-2 ${
            isPortrait
              ? "grid-cols-4 sm:grid-cols-6"
              : "grid-cols-3 sm:grid-cols-4"
          }`}
        >
          {previews.map((src, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-100"
              style={{ aspectRatio: isPortrait ? "3/4" : "16/9" }}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
              {compressionLoading ? (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <Loader2 size={12} className="animate-spin text-white" />
                </div>
              ) : stats[i] ? (
                <div
                  className={`absolute bottom-0 inset-x-0 text-[9px] font-bold text-center py-0.5 ${
                    stats[i].savedPercent >= 0
                      ? "bg-emerald-600/90 text-white"
                      : "bg-amber-500/90 text-white"
                  }`}
                >
                  {stats[i].savedPercent >= 0
                    ? `↓${stats[i].savedPercent}%`
                    : `↑${Math.abs(stats[i].savedPercent)}%`}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {/* Compression detail rows */}
      {!compressionLoading && stats.length > 0 && (
        <div className="space-y-1">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="flex items-center justify-between text-[11px] bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-100"
            >
              <span className="text-gray-500 truncate max-w-[55%]">
                {stat.originalName}
              </span>
              <span className="flex items-center gap-1.5 shrink-0">
                <span className="text-gray-400">
                  {formatBytes(stat.originalSize)}
                </span>
                <span className="text-gray-300">→</span>
                <span className="font-medium text-gray-700">
                  {formatBytes(stat.compressedSize)}
                </span>
                <span
                  className={`font-bold ${
                    stat.savedPercent >= 0
                      ? "text-emerald-600"
                      : "text-amber-500"
                  }`}
                >
                  (
                  {stat.savedPercent >= 0
                    ? `${stat.savedPercent}%`
                    : `+${Math.abs(stat.savedPercent)}%`}
                  )
                </span>
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Upload button — always visible once files are chosen */}
      <button
        onClick={handleUpload}
        disabled={uploading || files.length === 0}
        className={`w-full py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${
          files.length === 0
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-[#4A3B2A] text-white hover:bg-[#3a2d20] shadow-sm hover:shadow"
        }`}
      >
        {uploading ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Uploading…
          </>
        ) : (
          <>
            <Upload size={15} />
            {files.length > 0
              ? `Upload ${files.length} ${variant} image(s)`
              : `Select images above to upload`}
          </>
        )}
      </button>

      {/* Result message */}
      {message && (
        <div
          className={`text-sm rounded-xl px-4 py-3 border flex items-center gap-2 ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {message.type === "success" ? (
            <Check size={14} />
          ) : (
            <AlertCircle size={14} />
          )}
          {message.text}
        </div>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const HeroImageManager = () => {
  const [selectedPage, setSelectedPage] = useState("home");
  const [uploadVariant, setUploadVariant] = useState("desktop"); // "desktop" | "mobile"
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingImage, setEditingImage] = useState(null);
  const [globalMessage, setGlobalMessage] = useState(null);
  const [pageSelectOpen, setPageSelectOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor),
  );

  const showMessage = (type, text) => {
    setGlobalMessage({ type, text });
    setTimeout(() => setGlobalMessage(null), 4000);
  };

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getPageHeroImages(selectedPage);
      const sorted = (data.images || []).sort((a, b) => a.order - b.order);
      setImages(sorted);
    } catch (err) {
      showMessage("error", err.message || "Failed to load images");
    } finally {
      setLoading(false);
    }
  }, [selectedPage]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // Drag-to-reorder
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex((img) => img._id === active.id);
    const newIndex = images.findIndex((img) => img._id === over.id);
    const newOrder = arrayMove(images, oldIndex, newIndex);
    setImages(newOrder);

    try {
      await api.reorderPageHeroImages(
        selectedPage,
        newOrder.map((img) => img._id),
      );
    } catch (err) {
      showMessage("error", "Failed to save new order");
      fetchImages(); // revert
    }
  };

  const handleDelete = async (imageId) => {
    if (
      !window.confirm(
        "Delete this hero image and its mobile version? This cannot be undone.",
      )
    )
      return;
    try {
      await api.deletePageHeroImage(selectedPage, imageId);
      setImages((prev) => prev.filter((img) => img._id !== imageId));
      showMessage("success", "Image deleted.");
    } catch (err) {
      showMessage("error", err.message || "Failed to delete image");
    }
  };

  const handleRemoveMobile = async (imageId) => {
    if (
      !window.confirm(
        "Remove the mobile version of this image? The desktop image will be kept.",
      )
    )
      return;
    try {
      const result = await api.updatePageHeroImage(selectedPage, imageId, {
        removeMobile: true,
      });
      const sorted = (result.page.images || []).sort(
        (a, b) => a.order - b.order,
      );
      setImages(sorted);
      showMessage("success", "Mobile image removed.");
    } catch (err) {
      showMessage("error", err.message || "Failed to remove mobile image");
    }
  };

  const handleToggleActive = async (imageId) => {
    const img = images.find((i) => i._id === imageId);
    if (!img) return;
    try {
      const result = await api.updatePageHeroImage(selectedPage, imageId, {
        isActive: !img.isActive,
      });
      const sorted = (result.page.images || []).sort(
        (a, b) => a.order - b.order,
      );
      setImages(sorted);
    } catch (err) {
      showMessage("error", err.message || "Failed to update image");
    }
  };

  const handleEditSave = async (imageId, payload) => {
    const result = await api.updatePageHeroImage(
      selectedPage,
      imageId,
      payload,
    );
    const sorted = (result.page.images || []).sort((a, b) => a.order - b.order);
    setImages(sorted);
    showMessage("success", "Image updated.");
  };

  const meta = PAGE_META[selectedPage];

  return (
    <div className="space-y-6">
      {/* Edit modal */}
      {editingImage && (
        <EditModal
          image={editingImage}
          pageKey={selectedPage}
          onClose={() => setEditingImage(null)}
          onSave={handleEditSave}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        <div>
          <h2 className="text-lg font-bold text-[#4A3B2A]">
            Hero Image Manager
          </h2>
        </div>

        {/* Page selector */}
        <div className="relative shrink-0">
          <button
            onClick={() => setPageSelectOpen((p) => !p)}
            className="flex items-center gap-2.5 bg-[#4A3B2A] text-[#F3EFE9] pl-3 pr-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#3a2d20] transition-all shadow-sm"
          >
            {/* Icon badge */}
            <span className="w-6 h-6 flex items-center justify-center bg-white/15 rounded-md">
              {meta?.Icon && <meta.Icon size={13} strokeWidth={2} />}
            </span>
            <span>{meta?.label}</span>
            <ChevronDown
              size={14}
              className={`ml-0.5 transition-transform duration-200 ${pageSelectOpen ? "rotate-180" : ""}`}
            />
          </button>

          {pageSelectOpen && (
            <div className="absolute right-0 top-full mt-2 z-30 bg-white rounded-2xl border border-gray-100 shadow-2xl w-64 overflow-hidden">
              {/* Header */}
              <div className="px-4 pt-3 pb-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Select page to manage
                </p>
              </div>

              {/* Main pages */}
              <div className="px-2 pb-1">
                <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  Main Pages
                </p>
                {Object.entries(PAGE_META)
                  .filter(([, m]) => m.group === "main")
                  .map(([key, m]) => {
                    const active = key === selectedPage;
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          setSelectedPage(key);
                          setPageSelectOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-left transition-all duration-150 ${
                          active
                            ? "bg-[#4A3B2A] text-white"
                            : "text-gray-700 hover:bg-[#F3EFE9] hover:text-[#4A3B2A]"
                        }`}
                      >
                        <span
                          className={`w-7 h-7 flex items-center justify-center rounded-lg shrink-0 ${
                            active ? "bg-white/20" : "bg-[#F3EFE9]"
                          }`}
                        >
                          <m.Icon
                            size={14}
                            strokeWidth={2}
                            className={active ? "text-white" : "text-[#4A3B2A]"}
                          />
                        </span>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`font-medium leading-tight truncate ${active ? "text-white" : "text-gray-800"}`}
                          >
                            {m.label}
                          </p>
                          <p
                            className={`text-[11px] truncate ${active ? "text-white/60" : "text-gray-400"}`}
                          >
                            {m.path}
                          </p>
                        </div>
                        {active && (
                          <ArrowRight
                            size={13}
                            className="text-white/70 shrink-0"
                          />
                        )}
                      </button>
                    );
                  })}
              </div>

              {/* Divider */}
              <div className="mx-4 my-1.5 border-t border-gray-100" />

              {/* Journey sub-pages */}
              <div className="px-2 pb-2">
                <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  Journey Sub-Pages
                </p>
                {Object.entries(PAGE_META)
                  .filter(([, m]) => m.group === "journeys")
                  .map(([key, m]) => {
                    const active = key === selectedPage;
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          setSelectedPage(key);
                          setPageSelectOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-left transition-all duration-150 ${
                          active
                            ? "bg-[#4A3B2A] text-white"
                            : "text-gray-700 hover:bg-[#F3EFE9] hover:text-[#4A3B2A]"
                        }`}
                      >
                        <span
                          className={`w-7 h-7 flex items-center justify-center rounded-lg shrink-0 ${
                            active ? "bg-white/20" : "bg-[#F3EFE9]"
                          }`}
                        >
                          <m.Icon
                            size={14}
                            strokeWidth={2}
                            className={active ? "text-white" : "text-[#4A3B2A]"}
                          />
                        </span>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`font-medium leading-tight truncate ${active ? "text-white" : "text-gray-800"}`}
                          >
                            {m.label}
                          </p>
                          <p
                            className={`text-[11px] truncate ${active ? "text-white/60" : "text-gray-400"}`}
                          >
                            {m.path}
                          </p>
                        </div>
                        {active && (
                          <ArrowRight
                            size={13}
                            className="text-white/70 shrink-0"
                          />
                        )}
                      </button>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Global message */}
      {globalMessage && (
        <div
          className={`px-4 py-3 rounded-xl text-sm border ${
            globalMessage.type === "success"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {globalMessage.text}
        </div>
      )}

      {/* Upload section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* Section header with Desktop / Mobile toggle */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Upload size={18} className="text-[#4A3B2A]" />
            <h3 className="font-semibold text-[#4A3B2A]">
              Add Images to "{meta?.label}"
            </h3>
          </div>
          {/* Device toggle */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setUploadVariant("desktop")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                uploadVariant === "desktop"
                  ? "bg-[#4A3B2A] text-white shadow-sm"
                  : "text-gray-500 hover:text-[#4A3B2A]"
              }`}
            >
              <Monitor size={13} />
              Desktop
            </button>
            <button
              onClick={() => setUploadVariant("mobile")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                uploadVariant === "mobile"
                  ? "bg-[#4A3B2A] text-white shadow-sm"
                  : "text-gray-500 hover:text-[#4A3B2A]"
              }`}
            >
              <Smartphone size={13} />
              Mobile
            </button>
          </div>
        </div>
        <UploadZone
          key={`${selectedPage}-${uploadVariant}`}
          pageKey={selectedPage}
          variant={uploadVariant}
          onUploaded={fetchImages}
        />
      </div>

      {/* Image grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* Grid header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <ImageIcon size={18} className="text-[#4A3B2A]" />
            <h3 className="font-semibold text-[#4A3B2A]">
              {uploadVariant === "mobile" ? "Mobile Images" : "Desktop Images"}
              <span className="ml-2 text-sm font-normal text-gray-400">
                {uploadVariant === "mobile" ? (
                  <>
                    ({images.filter((i) => i.mobileUrl).length} with
                    mobile&#160;·&#160;
                    {
                      images.filter((i) => i.mobileUrl && i.isActive).length
                    }{" "}
                    active)
                  </>
                ) : (
                  <>
                    ({images.length} total&#160;·&#160;
                    {images.filter((i) => i.isActive).length} active)
                  </>
                )}
              </span>
            </h3>
          </div>
          {images.length > 1 && (
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <GripVertical size={12} />
              Drag cards to reorder
            </p>
          )}
        </div>

        {/* Grid body */}
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <Loader2 size={24} className="animate-spin mr-2" />
            Loading images…
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <ImageIcon size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No hero images yet for "{meta?.label}"</p>
            <p className="text-xs mt-1">
              Upload some images above to get started.
            </p>
          </div>
        ) : uploadVariant === "mobile" &&
          images.filter((i) => i.mobileUrl).length === 0 ? (
          /* Mobile empty state */
          <div className="text-center py-16 text-gray-400">
            <Smartphone size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No mobile images yet</p>
            <p className="text-xs mt-1 max-w-xs mx-auto">
              Upload mobile images above, or open <strong>Edit</strong> on any
              desktop image to add a mobile version.
            </p>
          </div>
        ) : (
          (() => {
            const displayImages =
              uploadVariant === "mobile"
                ? images.filter((img) => img.mobileUrl)
                : images;
            return (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={displayImages.map((img) => img._id)}
                  strategy={horizontalListSortingStrategy}
                >
                  <div
                    className={`grid gap-4 ${
                      uploadVariant === "mobile"
                        ? "grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
                        : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                    }`}
                  >
                    {displayImages.map((img) => (
                      <SortableImageCard
                        key={img._id}
                        image={img}
                        variant={uploadVariant}
                        pageKey={selectedPage}
                        onDelete={handleDelete}
                        onRemoveMobile={handleRemoveMobile}
                        onToggleActive={handleToggleActive}
                        onEdit={setEditingImage}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            );
          })()
        )}
      </div>

      {/* Info footer */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-gray-100 bg-[#F3EFE9]/60">
          <div className="w-6 h-6 flex items-center justify-center bg-[#4A3B2A]/10 rounded-md">
            <Info size={13} className="text-[#4A3B2A]" />
          </div>
          <p className="text-sm font-semibold text-[#4A3B2A]">How it works</p>
        </div>
        <div className="px-5 py-4 grid sm:grid-cols-2 gap-x-8 gap-y-2.5">
          {[
            {
              Icon: MonitorCheck,
              text: (
                <>
                  Images are auto-resized to <strong>1920 × 1080 px</strong> and
                  converted to <strong>WebP</strong> at 80% quality.
                </>
              ),
            },
            {
              Icon: GripVertical,
              text: (
                <>
                  Drag cards to change order. The first active image appears
                  first in the slideshow.
                </>
              ),
            },
            {
              Icon: EyeOff,
              text: (
                <>
                  Hidden images are preserved in the database but won't appear
                  on the live site.
                </>
              ),
            },
            {
              Icon: Layers,
              text: (
                <>
                  Pages fall back to their built-in static images if no DB
                  images are active.
                </>
              ),
            },
          ].map(({ Icon, text }, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span className="mt-0.5 shrink-0 w-6 h-6 flex items-center justify-center bg-[#F3EFE9] rounded-md">
                <Icon size={13} className="text-[#4A3B2A]/70" strokeWidth={2} />
              </span>
              <p className="text-xs text-gray-500 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroImageManager;
