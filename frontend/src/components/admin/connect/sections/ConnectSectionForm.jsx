import React from "react";
import FormField from "../../home-page/FormField";

const ConnectSectionForm = ({
  data,
  onChange,
  children,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  const handleSocialMediaChange = (e) => {
    const { name, value } = e.target;
    onChange({
      ...data,
      socialMedia: {
        ...data.socialMedia,
        [name]: value
      }
    });
  };

  const handleSocialItemChange = (index, field, value) => {
    const newItems = [...data.socialMedia.items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange({
      ...data,
      socialMedia: {
        ...data.socialMedia,
        items: newItems
      }
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h3 className="text-xl font-bold text-[#4A3B2A] border-b pb-2">Connect Section</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField
          label="Typography Text"
          name="typographyText"
          value={data.typographyText}
          onChange={handleChange}
        />
        <FormField
          label="Title (Bold part)"
          name="titleBold"
          value={data.titleBold}
          onChange={handleChange}
        />
        <FormField
          label="Title (Italic part)"
          name="titleItalic"
          value={data.titleItalic}
          onChange={handleChange}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField
          label="Email"
          name="email"
          type="email"
          value={data.email}
          onChange={handleChange}
        />
        <FormField
          label="Phone Number"
          name="phone"
          value={data.phone}
          onChange={handleChange}
        />
        <FormField
          label="Meet Link"
          name="meetLink"
          value={data.meetLink}
          onChange={handleChange}
        />
      </div>

      <div className="mt-8">
        <h4 className="text-lg font-bold text-[#4A3B2A] border-b pb-2 mb-4">Social Media Section</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <FormField
            label="Social Title (Bold)"
            name="titleBold"
            value={data.socialMedia?.titleBold || ""}
            onChange={handleSocialMediaChange}
          />
          <FormField
            label="Social Title (Italic)"
            name="titleItalic"
            value={data.socialMedia?.titleItalic || ""}
            onChange={handleSocialMediaChange}
          />
          <FormField
            label="Social Subtitle"
            name="subtitle"
            value={data.socialMedia?.subtitle || ""}
            onChange={handleSocialMediaChange}
          />
        </div>

        <div className="space-y-4">
          <h5 className="font-semibold text-gray-700">Social Media Links (Up to 5)</h5>
          {data.socialMedia?.items?.map((item, idx) => (
            <div key={idx} className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-wrap gap-4 items-center">
              <span className="font-medium text-gray-600 w-8">{idx + 1}.</span>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Text / Label"
                  value={item.text || ""}
                  onChange={(e) => handleSocialItemChange(idx, "text", e.target.value)}
                />
                <FormField
                  label="Link URL"
                  value={item.link || ""}
                  onChange={(e) => handleSocialItemChange(idx, "link", e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {children}
    </div>
  );
};

export default ConnectSectionForm;
