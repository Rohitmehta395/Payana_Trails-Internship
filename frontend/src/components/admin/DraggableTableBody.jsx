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
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

const SortableRow = ({ item, renderRow }) => {
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
  );
};

const DraggableTableBody = ({ items, onReorder, renderRow }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active && over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item._id === active.id);
      const newIndex = items.findIndex((item) => item._id === over.id);
      
      const newItems = arrayMove(items, oldIndex, newIndex);
      onReorder(newItems);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <tbody className="text-sm text-gray-700 bg-white">
        <SortableContext
          items={items.map((i) => i._id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((item) => (
            <SortableRow key={item._id} item={item} renderRow={renderRow} />
          ))}
        </SortableContext>
      </tbody>
    </DndContext>
  );
};

export default DraggableTableBody;
