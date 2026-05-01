import React from "react";
import ImageUploadField from "../../home-page/ImageUploadField";
import FormField from "../../home-page/FormField";
import TextAreaField from "../../home-page/TextAreaField";

const GiftJourneySectionForm = ({
  data,
  onChange,
  onFileSelect,
  compressionStats,
  compressionLoading,
  children,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h3 className="text-xl font-bold text-[#4A3B2A] border-b pb-2">Gift A Journey Section</h3>
      
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
      
      <FormField
        label="Subtitle"
        name="subtitle"
        value={data.subtitle}
        onChange={handleChange}
      />
      
      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
        <h4 className="font-bold text-[#4A3B2A] text-sm uppercase tracking-wider">Feature Block 1</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Label" name="block1Label" value={data.block1Label} onChange={handleChange} />
          <FormField label="Title" name="block1Title" value={data.block1Title} onChange={handleChange} />
        </div>
        <TextAreaField label="Body Text" name="block1Body" value={data.block1Body} onChange={handleChange} rows={2} />
      </div>

      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
        <h4 className="font-bold text-[#4A3B2A] text-sm uppercase tracking-wider">Feature Block 2</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Label" name="block2Label" value={data.block2Label} onChange={handleChange} />
          <FormField label="Title" name="block2Title" value={data.block2Title} onChange={handleChange} />
        </div>
        <TextAreaField label="Body Text" name="block2Body" value={data.block2Body} onChange={handleChange} rows={2} />
      </div>

      <ImageUploadField
        label="Image"
        currentImage={data.image}
        onFileSelect={onFileSelect}
        compressionStats={compressionStats}
        isLoading={compressionLoading}
      />

      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
        <h4 className="font-bold text-[#4A3B2A] text-sm uppercase tracking-wider">Floating Image Card</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Label" name="imageBlockLabel" value={data.imageBlockLabel} onChange={handleChange} />
          <FormField label="Title" name="imageBlockTitle" value={data.imageBlockTitle} onChange={handleChange} />
        </div>
        <FormField label="Body Text" name="imageBlockBody" value={data.imageBlockBody} onChange={handleChange} />
      </div>

      {children}
    </div>
  );
};

export default GiftJourneySectionForm;
