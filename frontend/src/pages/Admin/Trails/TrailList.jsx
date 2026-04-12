import React, { useState } from "react";
import {
  CalendarDays,
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { IMAGE_BASE_URL } from "../../../services/api";
import DraggableTableBody from "../../../components/admin/DraggableTableBody";
import StatusToggle from "../../../components/admin/StatusToggle";
import ItineraryEditorPanel from "./ItineraryEditorPanel";

const TrailList = ({
  trails,
  loadingTrails,
  handleEdit,
  handleDelete,
  handleReorder,
  handleToggle,
  handleItinerarySave,
  handleItineraryAutoSave,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Which trail's itinerary editor is open (by _id), null = none
  const [activeItineraryId, setActiveItineraryId] = useState(null);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = trails.findIndex((item) => item._id === active.id);
      const newIndex = trails.findIndex((item) => item._id === over.id);
      const newItems = arrayMove(trails, oldIndex, newIndex);
      handleReorder(newItems);
    }
  };

  const handleImageError = (e) => {
    if (e.target.dataset.errorHandled) {
      e.target.src =
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
      return;
    }
    e.target.dataset.errorHandled = "true";
    e.target.onerror = null;
    e.target.src = "https://placehold.co/64x40?text=No+Img";
  };

  const toggleItinerary = (trailId) => {
    setActiveItineraryId((prev) => (prev === trailId ? null : trailId));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F3EFE9] text-[#4A3B2A] text-sm uppercase tracking-wider">
                <th className="p-4 w-10"></th>
                <th className="p-4 font-semibold border-b border-gray-200">Image</th>
                <th className="p-4 font-semibold border-b border-gray-200">Trail Name</th>
                <th className="p-4 font-semibold border-b border-gray-200">Theme</th>
                <th className="p-4 font-semibold border-b border-gray-200">Destination</th>
                <th className="p-4 font-semibold border-b border-gray-200 text-center">Status</th>
                <th className="p-4 font-semibold border-b border-gray-200 text-right">Actions</th>
              </tr>
            </thead>

            {loadingTrails ? (
              <tbody>
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-500">
                    Loading trails...
                  </td>
                </tr>
              </tbody>
            ) : trails.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-500">
                    No trails found. Click "Add New Trail" to create one.
                  </td>
                </tr>
              </tbody>
            ) : (
              <DraggableTableBody
                items={trails}
                renderRow={(trail) => (
                  <>
                    {/* Image */}
                    <td className="p-4">
                      <img
                        src={`${IMAGE_BASE_URL}${trail.heroImage}`}
                        alt={trail.trailName}
                        className="w-16 h-10 object-cover rounded shadow-sm border border-gray-200"
                        onError={handleImageError}
                      />
                    </td>

                    {/* Trail Name + itinerary badge */}
                    <td className="p-4 font-medium text-gray-900">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span>{trail.trailName}</span>
                          {trail.status === "draft" && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
                              Draft
                            </span>
                          )}
                        </div>
                        {(() => {
                          const filledDays = (trail.itinerary || []).filter(
                            (d) => d.title?.trim() || d.points?.some((p) => p?.trim())
                          );
                          if (!filledDays.length) return null;
                          const isPublished = trail.status === 'published';
                          return (
                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full w-fit border ${
                              isPublished
                                ? 'text-emerald-800 bg-emerald-50 border-emerald-200'
                                : 'text-amber-800 bg-amber-100 border-amber-200'
                            }`}>
                              📅 {filledDays.length}-day itinerary
                            </span>
                          );
                        })()}

                      </div>
                    </td>

                    {/* Theme */}
                    <td className="p-4">
                      <span className="bg-[#F3EFE9] text-[#4A3B2A] px-2.5 py-1 rounded-full text-xs font-semibold">
                        {trail.trailTheme}
                      </span>
                    </td>

                    {/* Destination */}
                    <td className="p-4">{trail.trailDestination}</td>

                    {/* Status toggle */}
                    <td className="p-4 text-center">
                      <StatusToggle
                        isActive={trail.isActive}
                        onToggle={() => handleToggle(trail._id)}
                      />
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 flex-wrap">
                        <button
                          onClick={() => handleEdit(trail)}
                          className="text-blue-600 hover:text-blue-800 font-medium transition-colors text-sm"
                        >
                          Edit
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => toggleItinerary(trail._id)}
                          className={`font-medium transition-colors text-sm flex items-center gap-1 ${
                            activeItineraryId === trail._id
                              ? "text-[#4A3B2A] underline"
                              : "text-[#7B6147] hover:text-[#4A3B2A]"
                          }`}
                          title="Manage day-wise itinerary"
                        >
                          📅 Itinerary
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => handleDelete(trail._id)}
                          className="text-red-600 hover:text-red-800 font-medium transition-colors text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </>
                )}
                renderExpandedRow={(trail) =>
                  activeItineraryId === trail._id ? (
                    <tr key={`itinerary-${trail._id}`}>
                      <td colSpan="7" className="px-4 pb-5 pt-0 bg-[#FDFAF6]">
                        <ItineraryEditor
                          trail={trail}
                          onSave={handleItinerarySave}
                          onAutoSave={handleItineraryAutoSave}
                          onClose={() => setActiveItineraryId(null)}
                        />
                      </td>
                    </tr>
                  ) : null
                }
              />
            )}
          </table>
        </DndContext>
      </div>
    </div>
  );
};

export default TrailList;
