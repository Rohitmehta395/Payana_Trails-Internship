import React, { useState, useEffect, useRef } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { api, IMAGE_BASE_URL } from "../../../services/api";
import DraggableTableBody from "../../../components/admin/DraggableTableBody";

const CATEGORIES = [
  "All",
  "Heritage Trails",
  "Wildlife Encounters",
  "Cultural Windows",
  "Journey Insights",
  "Photo Essays",
  "Travel Anecdotes",
];

const ExternalStoryList = ({ onEdit, onCreateNew, refreshKey }) => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [deleting, setDeleting] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const reorderTimer = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const showMsg = (type, text, ms = 4000) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), ms);
  };

  const fetchStories = async () => {
    setLoading(true);
    try {
      const params = {};
      if (categoryFilter !== "All") params.category = categoryFilter;
      const data = await api.getExternalStoriesAdmin(params);
      setStories(data.stories || []);
    } catch (err) {
      showMsg("error", "Failed to load external stories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, [categoryFilter, refreshKey]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIdx = stories.findIndex((b) => b._id === active.id);
      const newIdx = stories.findIndex((b) => b._id === over.id);
      const reordered = arrayMove(stories, oldIdx, newIdx);
      setStories(reordered);

      clearTimeout(reorderTimer.current);
      reorderTimer.current = setTimeout(async () => {
        try {
          const items = reordered.map((b, i) => ({ id: b._id, order: i }));
          await api.reorderExternalStories(items);
        } catch {
          showMsg("error", "Failed to save order.");
        }
      }, 800);
    }
  };

  const handleDelete = async (story) => {
    if (
      !window.confirm(
        `Delete "${story.title}"? This will permanently remove all images.`
      )
    )
      return;
    setDeleting(story._id);
    try {
      await api.deleteExternalStory(story._id);
      setStories((prev) => prev.filter((b) => b._id !== story._id));
      showMsg("success", "Story deleted.");
    } catch (err) {
      showMsg("error", "Failed to delete story.");
    } finally {
      setDeleting(null);
    }
  };

  const selectClass =
    "px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-[#4A3B2A] focus:border-[#4A3B2A] focus:outline-none bg-white";

  return (
    <div className="space-y-4">
      {message.text && (
        <div
          className={`p-3 rounded-md text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600">Filter by Category:</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={selectClass}
          >
            {CATEGORIES.map((c) => (
               <option key={c} value={c}>
                 {c}
               </option>
            ))}
          </select>
        </div>
        <button
          onClick={onCreateNew}
          className="px-5 py-2 bg-[#4A3B2A] text-white rounded-md text-sm font-medium hover:bg-[#3A2E20] transition-colors"
        >
          + Add External Story
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm py-6 text-center">Loading stories...</p>
      ) : stories.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm">
          No external stories found. Click "Add External Story" to add one.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border border-gray-200">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-8" />
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-14">
                    Image
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Category
                  </th>
                  <th className="py-3 px-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-3 px-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <DraggableTableBody
                items={stories}
                renderRow={(story) => (
                  <>
                    <td className="py-3 px-4">
                      {story.featuredImage ? (
                        <img
                          src={`${IMAGE_BASE_URL}${story.featuredImage}`}
                          alt={story.title}
                          className="w-14 h-10 object-cover rounded"
                        />
                      ) : (
                        <div className="w-14 h-10 bg-gray-100 rounded" />
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900 line-clamp-1 max-w-xs">
                        {story.title}
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell text-gray-500 text-xs">
                      {story.category}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${
                          story.isDraft
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {story.isDraft ? "Draft" : "Published"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEdit(story)}
                          className="text-xs text-[#4A3B2A] border border-[#4A3B2A]/30 hover:border-[#4A3B2A] px-3 py-1 rounded transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(story)}
                          disabled={deleting === story._id}
                          className="text-xs text-red-600 border border-red-200 hover:border-red-400 px-3 py-1 rounded transition-colors disabled:opacity-50"
                        >
                          {deleting === story._id ? "Deleting…" : "Delete"}
                        </button>
                      </div>
                    </td>
                  </>
                )}
              />
            </table>
          </DndContext>
        </div>
      )}
    </div>
  );
};

export default ExternalStoryList;
