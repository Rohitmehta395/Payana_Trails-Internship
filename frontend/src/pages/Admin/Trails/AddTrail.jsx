import React, { useState } from "react";
import { api } from "../../../services/api";

const AddTrail = () => {
  const [formData, setFormData] = useState({
    category: "Wildlife",
    title: "",
    description: "",
    location: "",
    duration: "",
    date: "",
    trail: "",
    imgSrc: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await api.createTrail(formData);
      setMessage({ type: "success", text: "Trail added successfully!" });
      setFormData({
        category: "Wildlife",
        title: "",
        description: "",
        location: "",
        duration: "",
        date: "",
        trail: "",
        imgSrc: "",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to add trail.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Styled with #4A3B2A focus rings
  const inputClasses =
    "w-full p-2.5 border border-gray-300 rounded text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#4A3B2A] focus:border-[#4A3B2A] transition-colors";

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Brown Top Border Line */}
      <div className="h-1 w-full bg-[#4A3B2A]"></div>

      <div className="p-8">
        <h2 className="text-[1.1rem] font-bold text-[#4A3B2A] mb-6">
          Add New Trail
        </h2>

        {message.text && (
          <div
            className={`p-4 mb-6 rounded text-sm ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Row 1: Title & Category */}
            <div>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Trail Title"
                className={inputClasses}
                required
              />
            </div>
            <div>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`${inputClasses} bg-white cursor-pointer`}
                required
              >
                <option value="Wildlife">Wildlife</option>
                <option value="Heritage">Heritage</option>
                <option value="Cultural">Cultural</option>
              </select>
            </div>

            {/* Row 2: Location & Duration */}
            <div>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Location (e.g., Kenya)"
                className={inputClasses}
                required
              />
            </div>
            <div>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="Duration (e.g., 5 Days)"
                className={inputClasses}
                required
              />
            </div>

            {/* Row 3: Date & Route */}
            <div>
              <input
                type="text"
                name="date"
                value={formData.date}
                onChange={handleChange}
                placeholder="Date/Season (e.g., Jul - Oct)"
                className={inputClasses}
                required
              />
            </div>
            <div>
              <input
                type="text"
                name="trail"
                value={formData.trail}
                onChange={handleChange}
                placeholder="Route (e.g., Nairobi - Masai Mara)"
                className={inputClasses}
                required
              />
            </div>

            {/* Row 4: Image URL (Full Width) */}
            <div className="md:col-span-2">
              <input
                type="text"
                name="imgSrc"
                value={formData.imgSrc}
                onChange={handleChange}
                placeholder="Image URL / Path"
                className={inputClasses}
                required
              />
            </div>

            {/* Row 5: Description (Full Width) */}
            <div className="md:col-span-2">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                rows="4"
                className={`${inputClasses} resize-none`}
                required
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#4A3B2A] text-[#F3EFE9] px-8 py-2.5 rounded text-sm font-medium hover:bg-[#3a2d20] disabled:opacity-50 transition-colors shadow-sm"
            >
              {loading ? "Adding..." : "Add Trail"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTrail;
