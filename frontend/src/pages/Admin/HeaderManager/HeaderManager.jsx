import React, { useState, useEffect } from "react";
import HeaderForm from "../../../components/admin/header/HeaderForm";
import { api } from "../../../services/api";

const HeaderManager = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await api.getHeader();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch header data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      const result = await api.updateHeader(formData);
      setData(result);
      return result;
    } catch (error) {
      console.error("Failed to save header data", error);
      throw error;
    }
  };

  const handleDeleteLogo = async () => {
    try {
      const result = await api.deleteHeaderLogo();
      setData(result);
      return result;
    } catch (error) {
      console.error("Failed to delete header logo", error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="text-[#4A3B2A] p-4 font-medium">
        Loading Header Settings...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
      <HeaderForm
        initialData={data}
        onSave={handleSave}
        onDeleteLogo={handleDeleteLogo}
      />
    </div>
  );
};

export default HeaderManager;
