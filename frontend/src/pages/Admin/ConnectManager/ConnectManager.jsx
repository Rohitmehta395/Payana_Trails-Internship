import React, { useState, useEffect } from "react";
import ConnectForm from "../../../components/admin/connect/ConnectForm";
import { api } from "../../../services/api";

const ConnectManager = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await api.getConnectPage();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch connect page data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      const result = await api.updateConnectPage(formData);
      setData(result);
      return result;
    } catch (error) {
      console.error("Failed to save connect page data", error);
      throw error;
    }
  };

  if (loading) {
    return <div className="text-[#4A3B2A] p-4 font-medium">Loading Connect Page Settings...</div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
      <ConnectForm initialData={data} onSave={handleSave} />
    </div>
  );
};

export default ConnectManager;
