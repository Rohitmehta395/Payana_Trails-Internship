import React, { useState, useEffect, useCallback, useRef } from "react";
import { api, IMAGE_BASE_URL } from "../../../../services/api";
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
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Upload,
  Trash2,
  Check,
  AlertCircle,
  ImageIcon,
  Loader2,
  Monitor,
  ArrowRight
} from "lucide-react";

const SortableImageCard = ({
  image,
  onDelete,
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

  const imgSrc = `${IMAGE_BASE_URL}${image.url}`;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group bg-white rounded-xl border-2 overflow-hidden flex flex-col transition-all duration-200 ${
        isDragging
          ? "border-[#4A3B2A] shadow-2xl opacity-70 scale-105"
          : "border-gray-200 hover:border-[#4A3B2A]/40 shadow-sm hover:shadow-md"
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 z-10 p-1 bg-white/80 rounded-md text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        title="Drag to reorder"
      >
        <GripVertical size={14} />
      </button>

      <div className="relative w-full aspect-video bg-gray-100 overflow-hidden">
        <img
          src={imgSrc}
          alt={image.alt || "Testimonial"}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.src = "https://placehold.co/400x225?text=Image";
          }}
        />
      </div>

      <div className="px-3 py-2 flex-1">
        <p className="text-xs text-gray-500 truncate">
          {image.alt || (
            <span className="italic text-gray-300">No caption</span>
          )}
        </p>
      </div>

      <div className="px-3 pb-3 flex items-center justify-end gap-2">
        <button
          onClick={() => onDelete(image._id)}
          className="flex-1 flex items-center justify-center p-1.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          title="Delete image"
        >
          <Trash2 size={14} /> Delete
        </button>
      </div>
    </div>
  );
};

const UploadZone = ({ onUploaded }) => {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [message, setMessage] = useState(null);
  const [imageStats, setImageStats] = useState([]);
  const fileRef = useRef();

  const handleFiles = (selected) => {
    const arr = Array.from(selected);
    setFiles(arr);
    setPreviews(arr.map((f) => URL.createObjectURL(f)));
    setMessage(null);
    setImageStats([]);
  };

  const handleUpload = async () => {
    if (!files.length) return;
    setUploading(true);
    setMessage(null);
    setImageStats([]);
    try {
      const response = await api.uploadTestimonialImages(files, "Testimonial");
      setMessage({
        type: "success",
        text: `${files.length} image(s) uploaded!`,
      });
      if (response.imageStats) {
        setImageStats(response.imageStats);
      }
      setFiles([]);
      setPreviews([]);
      if (onUploaded) onUploaded();
      
      setTimeout(() => {
        setMessage(null);
        setImageStats([]);
      }, 4000); // 4 seconds so they have time to read the compression stats
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Upload failed." });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
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
              isDragOver || files.length > 0 ? "bg-[#4A3B2A]/10" : "bg-gray-100"
            }`}
          >
            <Monitor
              size={26}
              className={
                isDragOver || files.length > 0
                  ? "text-[#4A3B2A]"
                  : "text-gray-400"
              }
            />
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

      {previews.length > 0 && (
        <div className="grid gap-2 grid-cols-3 sm:grid-cols-4">
          {previews.map((src, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-100"
              style={{ aspectRatio: "16/9" }}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={uploading || files.length === 0}
        type="button"
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
              ? `Upload ${files.length} image(s)`
              : `Select images above to upload`}
          </>
        )}
      </button>

      {message && (
        <div
          className={`text-sm rounded-xl px-4 py-3 border flex flex-col gap-2 ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" ? (
              <Check size={14} />
            ) : (
              <AlertCircle size={14} />
            )}
            <span className="font-medium">{message.text}</span>
          </div>
          
          {imageStats && imageStats.length > 0 && (
            <div className="mt-2 space-y-2 border-t border-emerald-200/50 pt-2">
              <p className="text-xs font-semibold text-emerald-800">Compression Results:</p>
              {imageStats.map((stat, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs bg-white/50 px-2 py-1.5 rounded">
                  <span className="truncate max-w-[150px]" title={stat.originalName}>{stat.originalName}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-600/70 line-through">{(stat.originalSize / 1024).toFixed(1)} KB</span>
                    <ArrowRight size={10} className="text-emerald-400" />
                    <span className="font-semibold text-emerald-700">{(stat.compressedSize / 1024).toFixed(1)} KB</span>
                    <span className="bg-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded text-[10px] font-bold">
                      -{stat.savedPercent}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const TestimonialsForm = ({ data, onChange, children, onRefresh }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalMessage, setGlobalMessage] = useState(null);

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
      const response = await api.getHomePage();
      const fetchedImages = response?.testimonials?.images || [];
      const sorted = [...fetchedImages].sort((a, b) => a.order - b.order);
      setImages(sorted);
    } catch (err) {
      showMessage("error", err.message || "Failed to load images");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex((img) => img._id === active.id);
    const newIndex = images.findIndex((img) => img._id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const newOrder = arrayMove(images, oldIndex, newIndex);
    setImages(newOrder);

    try {
      await api.reorderTestimonials(newOrder.map((img) => img._id));
    } catch (err) {
      showMessage("error", "Failed to save new order");
      fetchImages(); // revert
    }
  };

  const handleDelete = async (imageId) => {
    if (!window.confirm("Delete this testimonial image? This cannot be undone."))
      return;
    try {
      await api.deleteTestimonialImage(imageId);
      setImages((prev) => prev.filter((img) => img._id !== imageId));
      showMessage("success", "Image deleted.");
    } catch (err) {
      showMessage("error", err.message || "Failed to delete image");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-[#4A3B2A] mb-1">
          Testimonials Content
        </h3>
        <p className="text-sm text-gray-500">
          Update the titles and manage testimonial images.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Section Title
          </label>
          <input
            type="text"
            value={data?.title || ""}
            onChange={(e) => onChange({ ...data, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4A3B2A] focus:border-[#4A3B2A]"
            placeholder="e.g. Testimonials"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Section Subtitle
          </label>
          <textarea
            value={data?.subtitle || ""}
            onChange={(e) => onChange({ ...data, subtitle: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4A3B2A] focus:border-[#4A3B2A] min-h-[100px] resize-y"
            placeholder="e.g. What our travellers say about us"
          />
        </div>
      </div>

      {children}

      <div className="mt-8 pt-8 border-t border-gray-200 space-y-6">
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

        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Upload size={18} className="text-[#4A3B2A]" />
            <h3 className="font-semibold text-[#4A3B2A]">
              Add Testimonial Images
            </h3>
          </div>
          <UploadZone onUploaded={() => {
            fetchImages();
            if (onRefresh) onRefresh();
          }} />
        </div>

        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <ImageIcon size={18} className="text-[#4A3B2A]" />
              <h3 className="font-semibold text-[#4A3B2A]">
                Managed Images
                <span className="ml-2 text-sm font-normal text-gray-400">
                  ({images.length} total)
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

          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-400">
              <Loader2 size={24} className="animate-spin mr-2" />
              Loading images…
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <ImageIcon size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No testimonial images yet</p>
              <p className="text-xs mt-1">
                Upload some images above to get started.
              </p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={images.map((img) => img._id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((img) => (
                    <SortableImageCard
                      key={img._id}
                      image={img}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsForm;
