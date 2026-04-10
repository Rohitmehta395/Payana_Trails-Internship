import React from "react";
import {
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

const TrailList = ({ trails, loadingTrails, handleEdit, handleDelete, handleReorder, handleToggle }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
    // Prevent infinite loop if the placeholder also fails
    if (e.target.dataset.errorHandled) {
      // Last resort: transparent pixel
      e.target.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
      return;
    }
    
    e.target.dataset.errorHandled = "true";
    e.target.onerror = null; // Basic protection
    e.target.src = "https://placehold.co/64x40?text=No+Img";
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
                <th className="p-4 font-semibold border-b border-gray-200">
                  Image
                </th>
                <th className="p-4 font-semibold border-b border-gray-200">
                  Trail Name
                </th>
                <th className="p-4 font-semibold border-b border-gray-200">
                  Theme
                </th>
                <th className="p-4 font-semibold border-b border-gray-200">
                  Destination
                </th>
                <th className="p-4 font-semibold border-b border-gray-200 text-center">
                  Status
                </th>
                <th className="p-4 font-semibold border-b border-gray-200 text-right">
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
                  renderRow={(trail) => (
                    <>
                      <td className="p-4">
                        <img
                          src={`${IMAGE_BASE_URL}${trail.heroImage}`}
                          alt={trail.trailName}
                          className="w-16 h-10 object-cover rounded shadow-sm border border-gray-200"
                          onError={handleImageError}
                        />
                      </td>
                      <td className="p-4 font-medium text-gray-900 flex items-center gap-2">
                        {trail.trailName}
                        {trail.status === 'draft' && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="bg-[#F3EFE9] text-[#4A3B2A] px-2.5 py-1 rounded-full text-xs font-semibold">
                          {trail.trailTheme}
                        </span>
                      </td>
                      <td className="p-4">{trail.trailDestination}</td>

                      {/* TOGGLE BUTTON */}
                      <td className="p-4 text-center">
                        <StatusToggle
                          isActive={trail.isActive}
                          onToggle={() => handleToggle(trail._id)}
                        />
                      </td>

                      {/* EDIT / DELETE BUTTONS */}
                      <td className="p-4 text-right space-x-3">
                        <button
                          onClick={() => handleEdit(trail)}
                          className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(trail._id)}
                          className="text-red-600 hover:text-red-800 font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                />
              )}
          </table>
        </DndContext>
      </div>
    </div>
  );
};

export default TrailList;
