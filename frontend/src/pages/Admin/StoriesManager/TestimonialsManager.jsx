import React, { useState, useEffect } from "react";
import TestimonialsForm from "../../../components/admin/home-page/sections/TestimonialsForm";
import { api } from "../../../services/api";
import { Loader2, Save } from "lucide-react";

const TestimonialsManager = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

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

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("data", JSON.stringify(data));

    try {
      await api.updateHomePage(formData);
      setMessage({ type: "success", text: "Testimonials updated successfully!" });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to update testimonials." });
    } finally {
      setSaving(false);
    }
  };

  const handleSectionChange = (newData) => {
    setData((prev) => ({ ...prev, testimonials: newData }));
  };

  if (loading) return <div className="p-4 text-[#4A3B2A] font-medium">Loading Testimonials...</div>;

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.text}
        </div>
      )}
      
      <TestimonialsForm
        data={data.testimonials || {}}
        onChange={handleSectionChange}
        onRefresh={fetchData}
      >
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-[#4A3B2A] text-white rounded-md font-medium hover:bg-[#3a2d20] transition-colors disabled:opacity-70"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Save Section
          </button>
        </div>
      </TestimonialsForm>
    </div>
  );
};

export default TestimonialsManager;
