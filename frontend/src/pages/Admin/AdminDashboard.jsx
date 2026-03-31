import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#F3EFE9] p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#4A3B2A]">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2.5 bg-[#4A3B2A] text-[#F3EFE9] rounded-lg hover:bg-[#3d3022] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4A3B2A] transition-colors duration-200 shadow-sm font-medium"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
