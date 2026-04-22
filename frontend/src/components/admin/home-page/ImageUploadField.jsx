import React, { useRef, useState } from "react";
import { IMAGE_BASE_URL } from "../../../services/api";
import { Loader2 } from "lucide-react";

const formatBytes = (bytes = 0) => {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
  if (bytes >= 1024) {
    return `${(bytes / 1024).toFixed(0)} KB`;
  }
  return `${bytes} B`;
};

const ImageUploadField = ({ label, currentImage, onImageSelect, compressionStats, compressionLoading }) => {
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onImageSelect(file);
    }
  };

  const stat = compressionStats && compressionStats.length > 0 ? compressionStats[0] : null;

  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-[#4A3B2A] mb-2">{label}</label>
      <div className="flex items-center gap-4">
        {(preview || currentImage) && (
          <div className="w-32 h-20 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
            <img
              src={preview || `${IMAGE_BASE_URL}${currentImage}`}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="px-4 py-2 border border-[#4A3B2A] text-[#4A3B2A] rounded-md text-sm hover:bg-[#F3EFE9] transition-colors"
          >
            Upload New Image
          </button>
          <input
            type="file"
            ref={fileRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          <p className="text-xs text-gray-500 mt-1">Recommended: 1920x1080 (16:9)</p>
        </div>
      </div>
      <div className="mt-2 text-sm text-[#4A3B2A]">
        {compressionLoading ? (
          <div className="inline-flex items-center gap-2 text-gray-600">
            <Loader2 size={14} className="animate-spin" />
            Checking compression...
          </div>
        ) : stat ? (
          <div className="text-sm text-[#4A3B2A]">
            Compression: {formatBytes(stat.originalSize)} → {formatBytes(stat.compressedSize)} ({stat.savedPercent}% saved)
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ImageUploadField;
