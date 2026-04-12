import React, { useState } from "react";
import { CalendarDays } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { IMAGE_BASE_URL } from "../../../services/api";
import DraggableTableBody from "../../../components/admin/DraggableTableBody";
import StatusToggle from "../../../components/admin/StatusToggle";
import ItineraryEditorPanel from "./ItineraryEditorPanel";

const hasItineraryContent = (day) =>
  day?.title?.trim() ||
  day?.points?.some((point) => point?.trim()) ||
  day?.accommodation?.trim() ||
  day?.meals?.trim();

const TrailListPanel = ({
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
    }),
  );

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

  const handleImageError = (event) => {
    if (event.target.dataset.errorHandled) {
      event.target.src =
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
      return;
    }

    event.target.dataset.errorHandled = "true";
    event.target.onerror = null;
    event.target.src = "https://placehold.co/64x40?text=No+Img";
  };

  const toggleItinerary = (trailId) => {
    setActiveItineraryId((prev) => (prev === trailId ? null : trailId));
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[#F3EFE9] text-sm uppercase tracking-wider text-[#4A3B2A]">
                <th className="w-10 p-4" />
                <th className="border-b border-gray-200 p-4 font-semibold">Image</th>
                <th className="border-b border-gray-200 p-4 font-semibold">
                  Trail Name
                </th>
                <th className="border-b border-gray-200 p-4 font-semibold">Theme</th>
                <th className="border-b border-gray-200 p-4 font-semibold">
                  Destination
                </th>
                <th className="border-b border-gray-200 p-4 text-center font-semibold">
                  Status
                </th>
                <th className="border-b border-gray-200 p-4 text-right font-semibold">
                  Actions
                </th>
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
                renderRow={(trail) => {
                  const liveDays = (trail.itinerary || []).filter(hasItineraryContent);
                  const draftDays = (trail.itineraryDraft || []).filter(
                    hasItineraryContent,
                  );
                  const hasDraftChanges =
                    JSON.stringify(draftDays) !== JSON.stringify(liveDays);

                  return (
                    <>
                      <td className="p-4">
                        <img
                          src={`${IMAGE_BASE_URL}${trail.heroImage}`}
                          alt={trail.trailName}
                          className="h-10 w-16 rounded border border-gray-200 object-cover shadow-sm"
                          onError={handleImageError}
                        />
                      </td>

                      <td className="p-4 font-medium text-gray-900">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span>{trail.trailName}</span>
                            {trail.status === "draft" && (
                              <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800">
                                Draft
                              </span>
                            )}
                          </div>

                          {(liveDays.length > 0 || draftDays.length > 0) && (
                            <div className="flex flex-wrap items-center gap-1.5">
                              {liveDays.length > 0 && (
                                <span
                                  className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                                    trail.status === "published"
                                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                                      : "border-amber-200 bg-amber-100 text-amber-800"
                                  }`}
                                >
                                  <CalendarDays size={11} />
                                  {liveDays.length}-day itinerary
                                </span>
                              )}
                              {hasDraftChanges && (
                                <span className="rounded-full border border-stone-200 bg-[#FEF3C6] px-2 py-0.5 text-[10px] font-semibold text-stone-700">
                                  DRAFT
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="rounded-full bg-[#F3EFE9] px-2.5 py-1 text-xs font-semibold text-[#4A3B2A]">
                          {trail.trailTheme}
                        </span>
                      </td>

                      <td className="p-4">{trail.trailDestination}</td>

                      <td className="p-4 text-center">
                        <StatusToggle
                          isActive={trail.isActive}
                          onToggle={() => handleToggle(trail._id)}
                        />
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(trail)}
                            className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-800"
                          >
                            Edit
                          </button>
                          <span className="text-gray-300">|</span>
                          <button
                            onClick={() => toggleItinerary(trail._id)}
                            className={`inline-flex items-center gap-1 text-sm font-medium transition-colors ${
                              activeItineraryId === trail._id
                                ? "text-[#4A3B2A] underline"
                                : "text-[#7B6147] hover:text-[#4A3B2A]"
                            }`}
                            title="Manage day-wise itinerary"
                          >
                            <CalendarDays size={14} />
                            Itinerary
                          </button>
                          <span className="text-gray-300">|</span>
                          <button
                            onClick={() => handleDelete(trail._id)}
                            className="text-sm font-medium text-red-600 transition-colors hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </>
                  );
                }}
                renderExpandedRow={(trail) =>
                  activeItineraryId === trail._id ? (
                    <tr key={`itinerary-${trail._id}`}>
                      <td colSpan="7" className="bg-[#FDFAF6] px-4 pb-5 pt-0">
                        <ItineraryEditorPanel
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

export default TrailListPanel;
