import React, { useRef, useState } from "react";
import { IMAGE_BASE_URL } from "../../../services/api";

const ImageUploadField = ({ label, currentImage, onImageSelect }) => {
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onImageSelect(file);
    }
  };

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
    </div>
  );
};

export default ImageUploadField;
