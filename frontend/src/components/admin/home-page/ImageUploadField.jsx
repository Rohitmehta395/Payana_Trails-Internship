import React, { useRef, useState, useEffect } from "react";
import { IMAGE_BASE_URL } from "../../../services/api";
import { Loader2, Trash2 } from "lucide-react";

const formatBytes = (bytes = 0) => {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
  if (bytes >= 1024) {
    return `${(bytes / 1024).toFixed(0)} KB`;
  }
  return `${bytes} B`;
};

const getImageUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${IMAGE_BASE_URL}${url}`;
};

const ImageUploadField = ({
  label,
  helperText,
  currentImage,
  defaultImage,
  onImageSelect,
  onFileSelect,
  onRemove,
  compressionStats,
  compressionLoading,
  isLoading,
}) => {
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [imgError, setImgError] = useState(false);

  // Sync / clear preview when currentImage changes or resets
  useEffect(() => {
    setPreview(null);
    setImgError(false);
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  }, [currentImage]);

  const handleSelect = onImageSelect || onFileSelect;
  const isCompressing = compressionLoading ?? isLoading;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImgError(false);
      setPreview(URL.createObjectURL(file));
      if (typeof handleSelect === "function") {
        handleSelect(file);
      }
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileRef.current) {
      fileRef.current.value = "";
    }
    if (typeof handleSelect === "function") {
      handleSelect(null);
    }
    if (typeof onRemove === "function") {
      onRemove();
    }
  };

  const stat = compressionStats && compressionStats.length > 0 ? compressionStats[0] : null;

  // Determine what to display:
  // 1. Newly selected file preview
  // 2. Custom image url from backend
  // 3. Fallback default bundled image
  const hasCustomImage = Boolean(currentImage && !imgError);
  const displaySrc = preview || (hasCustomImage ? getImageUrl(currentImage) : defaultImage);
  const isDefault = !preview && !hasCustomImage && Boolean(defaultImage);

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-semibold text-[#4A3B2A]">{label}</label>
        {isDefault && (
          <span className="text-xs px-2 py-0.5 bg-amber-50 text-amber-800 rounded border border-amber-200 font-medium">
            Default Site Image
          </span>
        )}
        {!isDefault && hasCustomImage && !preview && (
          <span className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded border border-emerald-200 font-medium">
            Custom Image Active
          </span>
        )}
        {preview && (
          <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-800 rounded border border-blue-200 font-medium">
            New Image Selected (Unsaved)
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        {displaySrc && (
          <div className="relative w-32 h-20 bg-gray-100 rounded-md overflow-hidden border border-gray-200 shrink-0 shadow-sm">
            <img
              src={displaySrc}
              alt="Preview"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="px-4 py-2 border border-[#4A3B2A] text-[#4A3B2A] rounded-md text-sm font-medium hover:bg-[#F3EFE9] transition-colors shadow-sm"
            >
              {preview || currentImage ? "Change Image" : "Upload Image"}
            </button>
            {(preview || currentImage) && onRemove && (
              <button
                type="button"
                onClick={handleRemove}
                title="Reset to default image"
                className="px-3 py-2 border border-red-200 text-red-600 rounded-md text-sm hover:bg-red-50 transition-colors flex items-center gap-1"
              >
                <Trash2 size={14} />
                Reset
              </button>
            )}
          </div>
          <input
            type="file"
            ref={fileRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          {helperText && <p className="text-xs text-gray-500 mt-1">{helperText}</p>}
          <p className="text-xs text-gray-400 mt-0.5">Recommended: 1920x1080 (16:9)</p>
        </div>
      </div>
      <div className="mt-2">
        {isCompressing ? (
          <div className="inline-flex items-center gap-2 text-gray-600 text-sm">
            <Loader2 size={14} className="animate-spin" />
            Checking compression...
          </div>
        ) : stat ? (
          <div className="mt-2 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
            Compression: {formatBytes(stat.originalSize)} → {formatBytes(stat.compressedSize)} ({stat.savedPercent}% saved)
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ImageUploadField;
