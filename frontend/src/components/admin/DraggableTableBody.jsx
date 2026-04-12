import React from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

const SortableRow = ({ item, renderRow, renderExpandedRow }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...(isDragging ? { opacity: 0.5, backgroundColor: "#f9fafb", zIndex: 10 } : {}),
  };

  return (
    <>
      <tr
        ref={setNodeRef}
        style={style}
        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
          isDragging ? "shadow-md relative" : ""
        }`}
      >
        {/* Drag Handle Column */}
        <td className="p-4 w-10">
          <button
            {...attributes}
            {...listeners}
            className="text-gray-400 hover:text-gray-600 cursor-grab focus:outline-none"
          >
            <GripVertical size={20} />
          </button>
        </td>
        {renderRow(item)}
      </tr>
      {/* Optional expanded row (e.g. itinerary editor) */}
      {renderExpandedRow && renderExpandedRow(item)}
    </>
  );
};

const DraggableTableBody = ({ items, renderRow, renderExpandedRow }) => {
  return (
    <tbody className="text-sm text-gray-700 bg-white">
      <SortableContext
        items={items.map((i) => i._id)}
        strategy={verticalListSortingStrategy}
      >
        {items.map((item) => (
          <SortableRow
            key={item._id}
            item={item}
            renderRow={renderRow}
            renderExpandedRow={renderExpandedRow}
          />
        ))}
      </SortableContext>
    </tbody>
  );
};

export default DraggableTableBody;
