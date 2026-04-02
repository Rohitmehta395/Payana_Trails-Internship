import React from "react";
import { IMAGE_BASE_URL } from "../../../services/api";

const TrailList = ({ trails, loadingTrails, handleEdit, handleDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F3EFE9] text-[#4A3B2A] text-sm uppercase tracking-wider">
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
              <th className="p-4 font-semibold border-b border-gray-200 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {loadingTrails ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">
                  Loading trails...
                </td>
              </tr>
            ) : trails.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">
                  No trails found. Click "Add New Trail" to create one.
                </td>
              </tr>
            ) : (
              trails.map((trail) => (
                <tr
                  key={trail._id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4">
                    <img
                      src={`${IMAGE_BASE_URL}${trail.routeMap}`}
                      alt={trail.trailName}
                      className="w-16 h-10 object-cover rounded shadow-sm border border-gray-200"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/64x40?text=No+Img";
                      }}
                    />
                  </td>
                  <td className="p-4 font-medium text-gray-900">
                    {trail.trailName}
                  </td>
                  <td className="p-4">
                    <span className="bg-[#F3EFE9] text-[#4A3B2A] px-2.5 py-1 rounded-full text-xs font-semibold">
                      {trail.trailTheme}
                    </span>
                  </td>
                  <td className="p-4">{trail.trailDestination}</td>

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
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrailList;
