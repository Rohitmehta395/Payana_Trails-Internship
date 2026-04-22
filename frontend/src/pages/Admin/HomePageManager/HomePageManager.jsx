import React, { useState, useEffect } from "react";
import HomePageForm from "../../../components/admin/home-page/HomePageForm";
import { api } from "../../../services/api";

const HomePageManager = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await api.getHomePage();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch home page data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      const result = await api.updateHomePage(formData);
      setData(result);
      return result;
    } catch (error) {
      console.error("Failed to save home page data", error);
      throw error;
    }
  };

  if (loading) {
    return <div className="text-[#4A3B2A] p-4 font-medium">Loading Home Page Settings...</div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
      <HomePageForm initialData={data} onSave={handleSave} />
    </div>
  );
};

export default HomePageManager;
