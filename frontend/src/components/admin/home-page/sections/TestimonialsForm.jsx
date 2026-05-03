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
  ArrowRight,
  Edit2,
  X,
  User,
} from "lucide-react";

const SortableImageCard = ({ image, onDelete, onEdit }) => {
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

  const imgSrc = image.url ? `${IMAGE_BASE_URL}${image.url}` : null;

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

      <div className="relative w-full aspect-video bg-gray-100 overflow-hidden flex items-center justify-center">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={image.alt || "Testimonial"}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.src = "https://placehold.co/400x225?text=Image";
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400 p-4 text-center">
            <User size={32} className="opacity-20 text-[#4A3B2A]" />
          </div>
        )}
        {image.destination && (
          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-medium">
            {image.destination}
          </div>
        )}
      </div>

      <div className="px-3 py-2 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-semibold text-gray-700 truncate">
            {image.alt || <span className="italic text-gray-300">No name</span>}
          </p>
          {image.monthYear && (
            <span className="text-[10px] text-gray-400">
              {formatMonthYearForDisplay(image.monthYear)}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 line-clamp-2">
          {image.shortDescription || (
            <span className="italic text-gray-300">No short description</span>
          )}
        </p>
      </div>

      <div className="px-3 pb-3 flex items-center justify-between gap-2 mt-auto">
        <button
          onClick={() => onEdit(image)}
          className="flex-1 flex items-center justify-center p-1.5 text-blue-500 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-xs"
          title="Edit details"
        >
          <Edit2 size={12} className="mr-1" /> Edit
        </button>
        <button
          onClick={() => onDelete(image._id)}
          className="flex-1 flex items-center justify-center p-1.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-xs"
          title="Delete image"
        >
          <Trash2 size={12} className="mr-1" /> Delete
        </button>
      </div>
    </div>
  );
};

const formatMonthYearForInput = (val) => {
  if (!val) return "";
  if (/^\d{4}-\d{2}$/.test(val)) return val;
  const d = new Date(val);
  if (!isNaN(d.getTime())) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  }
  return "";
};

const formatMonthYearForDisplay = (val) => {
  if (!val) return "";
  if (!/^\d{4}-\d{2}$/.test(val)) return val;
  const [year, month] = val.split("-");
  const d = new Date(year, month - 1);
  return d.toLocaleString("en-US", { month: "short", year: "numeric" });
};

const AddTestimonialForm = ({ onUploaded, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    destination: "",
    monthYear: "",
    shortDescription: "",
    fullContent: "",
    image: null,
  });
  const [availableDestinations, setAvailableDestinations] = useState([]);
  const [isOtherDestination, setIsOtherDestination] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileRef = useRef();

  useEffect(() => {
    api
      .getDestinations(true)
      .then((data) => {
        const names = [...new Set(data.map((d) => d.name))].sort();
        setAvailableDestinations(names);
      })
      .catch((err) => console.error("Error fetching destinations:", err));
  }, []);

  const handleInput = (e) => {
    const { name, value } = e.target;
    if (name === "destinationSelect") {
      if (value === "Other") {
        setIsOtherDestination(true);
        setFormData((prev) => ({ ...prev, destination: "" }));
      } else {
        setIsOtherDestination(false);
        setFormData((prev) => ({ ...prev, destination: value }));
      }
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setMessage({ type: "error", text: "Name is required." });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const extraData = {
        alt: formData.name,
        destination: formData.destination,
        monthYear: formData.monthYear,
        shortDescription: formData.shortDescription,
        fullContent: formData.fullContent,
      };
      
      const imagesToUpload = formData.image ? [formData.image] : [];
      await api.uploadTestimonialImages(imagesToUpload, extraData);
      onUploaded();
    } catch (err) {
      setMessage({
        type: "error",
        text: err.message || "Failed to add testimonial.",
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4A3B2A] focus:border-[#4A3B2A] text-sm";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <h3 className="font-bold text-[#4A3B2A]">Add New Testimonial</h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {message && (
          <div
            className={`p-3 rounded-lg text-sm ${message.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}
          >
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Name (with Location)
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInput}
              className={inputClass}
              placeholder="e.g. John Doe, New York"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Destination
            </label>
            <div className="space-y-2">
              <select
                name="destinationSelect"
                value={isOtherDestination ? "Other" : formData.destination}
                onChange={handleInput}
                className={inputClass}
              >
                <option value="">Select a destination</option>
                {availableDestinations.map((dest) => (
                  <option key={dest} value={dest}>
                    {dest}
                  </option>
                ))}
                <option value="Other">Other (Type manually)</option>
              </select>
              {isOtherDestination && (
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleInput}
                  className={inputClass + " bg-blue-50/30 border-blue-200"}
                  placeholder="Type destination..."
                />
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
            Month / Year
          </label>
          <input
            type="month"
            name="monthYear"
            value={formatMonthYearForInput(formData.monthYear)}
            onChange={handleInput}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
            Short Description (2-line preview)
          </label>
          <textarea
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleInput}
            className={inputClass}
            rows="2"
            placeholder="Brief summary..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
            Full Description
          </label>
          <textarea
            name="fullContent"
            value={formData.fullContent}
            onChange={handleInput}
            className={inputClass}
            rows="4"
            placeholder="The complete story..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
            Testimonial Image (Optional)
          </label>
          <div
            onClick={() => fileRef.current?.click()}
            className={`mt-1 border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${preview ? "border-emerald-200 bg-emerald-50/30" : "border-gray-200 hover:border-[#4A3B2A]/50 bg-gray-50"}`}
          >
            <input
              type="file"
              ref={fileRef}
              onChange={handleFile}
              accept="image/*"
              className="hidden"
            />
            {preview ? (
              <div className="flex flex-col items-center gap-2">
                <img
                  src={preview}
                  alt="Preview"
                  className="h-24 object-contain rounded border border-emerald-100"
                />
                <p className="text-xs text-emerald-600 font-medium">
                  Click to change image
                </p>
              </div>
            ) : (
              <div className="py-4">
                <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Click to upload image</p>
                <p className="text-[10px] text-gray-400 mt-2 italic">
                  Recommended: Square image (512x512px). Leave blank if guest
                  prefers not to share their image.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-2 bg-[#4A3B2A] text-white rounded-lg text-sm font-medium hover:bg-[#3a2d20] transition-colors flex items-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Adding...
              </>
            ) : (
              <>
                <Check size={16} /> Save Testimonial
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

const TestimonialsForm = ({ data, onChange, children, onRefresh }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalMessage, setGlobalMessage] = useState(null);
  const [editingImage, setEditingImage] = useState(null);
  const [editFormData, setEditFormData] = useState({
    alt: "",
    shortDescription: "",
    fullContent: "",
    destination: "",
    monthYear: "",
    imageFile: null,
    imagePreview: null,
  });
  const [isAdding, setIsAdding] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [availableDestinations, setAvailableDestinations] = useState([]);
  const [isOtherDestinationEdit, setIsOtherDestinationEdit] = useState(false);

  useEffect(() => {
    api
      .getDestinations(true)
      .then((data) => {
        const names = [...new Set(data.map((d) => d.name))].sort();
        setAvailableDestinations(names);
      })
      .catch((err) => console.error("Error fetching destinations:", err));
  }, []);

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
    if (
      !window.confirm("Delete this testimonial image? This cannot be undone.")
    )
      return;
    try {
      await api.deleteTestimonialImage(imageId);
      setImages((prev) => prev.filter((img) => img._id !== imageId));
      showMessage("success", "Image deleted.");
    } catch (err) {
      showMessage("error", err.message || "Failed to delete image");
    }
  };

  const handleEditClick = (image) => {
    setEditingImage(image);
    const names = availableDestinations;
    const isOther = image.destination && !names.includes(image.destination);
    setIsOtherDestinationEdit(isOther);
    setEditFormData({
      alt: image.alt || "",
      shortDescription: image.shortDescription || "",
      fullContent: image.fullContent || "",
      destination: image.destination || "",
      monthYear: image.monthYear || "",
      imageFile: null,
      imagePreview: image.url ? `${IMAGE_BASE_URL}${image.url}` : null,
    });
  };

  const handleSaveEdit = async () => {
    if (!editingImage) return;
    setIsSavingEdit(true);
    const formData = new FormData();
    formData.append("alt", editFormData.alt);
    formData.append("shortDescription", editFormData.shortDescription);
    formData.append("fullContent", editFormData.fullContent);
    formData.append("destination", editFormData.destination);
    formData.append("monthYear", editFormData.monthYear);
    
    if (editFormData.imageFile) {
      formData.append("testimonialImage", editFormData.imageFile);
    }

    try {
      const result = await api.updateTestimonialImage(editingImage._id, formData);
      const updatedImage = result.page.testimonials.images.find(img => img._id === editingImage._id);
      
      setImages((prev) =>
        prev.map((img) =>
          img._id === editingImage._id ? updatedImage : img,
        ),
      );
      showMessage("success", "Testimonial updated successfully.");
      setEditingImage(null);
    } catch (err) {
      showMessage("error", err.message || "Failed to update testimonial");
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditFormData((prev) => ({
        ...prev,
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <p className="text-sm text-gray-500">
          Update the titles and manage testimonial images. (Changes here will
          reflect on home page)
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title (Bold Part)
            </label>
            <input
              type="text"
              value={data?.titleBold || ""}
              onChange={(e) => onChange({ ...data, titleBold: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4A3B2A] focus:border-[#4A3B2A]"
              placeholder="e.g. Share Your"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title (Italic Part)
            </label>
            <input
              type="text"
              value={data?.titleItalic || ""}
              onChange={(e) =>
                onChange({ ...data, titleItalic: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4A3B2A] focus:border-[#4A3B2A]"
              placeholder="e.g. Experience"
            />
          </div>
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

        {!isAdding ? (
          <div className="flex justify-center py-4">
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 px-6 py-3 bg-[#4A3B2A] text-white rounded-xl font-bold shadow-lg hover:bg-[#3a2d20] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Upload size={20} />
              Add Testimonial
            </button>
          </div>
        ) : (
          <AddTestimonialForm
            onUploaded={() => {
              setIsAdding(false);
              fetchImages();
              if (onRefresh) onRefresh();
            }}
            onCancel={() => setIsAdding(false)}
          />
        )}

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
                      onEdit={handleEditClick}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-[#4A3B2A]">
                Edit Testimonial
              </h3>
              <button
                onClick={() => setEditingImage(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6 flex-1 overflow-y-auto max-h-[70vh]">
              {/* Image Update Section */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-full sm:w-32 shrink-0">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Image Preview</p>
                  <div className="aspect-square rounded-full overflow-hidden border-2 border-gray-200 bg-white relative group shadow-sm flex items-center justify-center">
                    {editFormData.imagePreview ? (
                      <img
                        src={editFormData.imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-400 p-2 text-center">
                        <User size={32} className="opacity-20 text-[#4A3B2A]" />
                      </div>
                    )}
                    <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleEditImageChange}
                      />
                      <span className="text-white text-[10px] font-bold uppercase tracking-wider">Change</span>
                    </label>
                  </div>
                </div>
                <div className="flex-1 space-y-3 w-full">
                  <label className="block text-sm font-medium text-gray-700">
                    Replace Testimonial Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditImageChange}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#4A3B2A]/10 file:text-[#4A3B2A] hover:file:bg-[#4A3B2A]/20 cursor-pointer"
                  />
                  <p className="text-[10px] text-gray-400 mt-2 italic">
                    Recommended: Square image (512x512px). Image will be auto-compressed.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name / Location
                  </label>
                  <input
                    type="text"
                    value={editFormData.alt}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, alt: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4A3B2A] focus:border-[#4A3B2A]"
                    placeholder="e.g. John Doe, Mumbai"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Destination
                  </label>
                  <div className="space-y-2">
                    <select
                      value={isOtherDestinationEdit ? "Other" : editFormData.destination}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "Other") {
                          setIsOtherDestinationEdit(true);
                          setEditFormData({ ...editFormData, destination: "" });
                        } else {
                          setIsOtherDestinationEdit(false);
                          setEditFormData({ ...editFormData, destination: val });
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4A3B2A] focus:border-[#4A3B2A]"
                    >
                      <option value="">Select a destination</option>
                      {availableDestinations.map((dest) => (
                        <option key={dest} value={dest}>{dest}</option>
                      ))}
                      <option value="Other">Other (Type manually)</option>
                    </select>
                    {isOtherDestinationEdit && (
                      <input
                        type="text"
                        value={editFormData.destination}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, destination: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-blue-200 bg-blue-50/30 rounded-md focus:ring-[#4A3B2A] focus:border-[#4A3B2A]"
                        placeholder="Type destination..."
                      />
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Month / Year
                </label>
                <input
                  type="month"
                  value={formatMonthYearForInput(editFormData.monthYear)}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, monthYear: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4A3B2A] focus:border-[#4A3B2A]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Description (2-line preview)
                </label>
                <textarea
                  value={editFormData.shortDescription}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, shortDescription: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4A3B2A] focus:border-[#4A3B2A]"
                  rows="2"
                  placeholder="A short preview of the testimonial..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Content
                </label>
                <textarea
                  value={editFormData.fullContent}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, fullContent: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4A3B2A] focus:border-[#4A3B2A]"
                  rows="6"
                  placeholder="The complete testimonial story..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
              <button
                onClick={() => setEditingImage(null)}
                className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isSavingEdit}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-5 py-2.5 text-sm font-medium text-white bg-[#4A3B2A] rounded-lg hover:bg-[#3a2d20] transition-colors flex items-center"
                disabled={isSavingEdit}
              >
                {isSavingEdit ? (
                  <>
                    <Loader2 size={16} className="animate-spin mr-2" />{" "}
                    Saving...
                  </>
                ) : (
                  <>
                    <Check size={16} className="mr-2" /> Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialsForm;
