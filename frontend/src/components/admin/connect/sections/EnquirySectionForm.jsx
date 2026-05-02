import React from "react";
import ImageUploadField from "../../home-page/ImageUploadField";
import FormField from "../../home-page/FormField";

const EnquirySectionForm = ({
  data,
  onChange,
  onFileSelectLeft,
  onFileSelectRight,
  compressionStatsLeft,
  compressionLoadingLeft,
  compressionStatsRight,
  compressionLoadingRight,
  children,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ImageUploadField
          label="Left Image"
          currentImage={data.leftImage}
          onFileSelect={onFileSelectLeft}
          compressionStats={compressionStatsLeft}
          isLoading={compressionLoadingLeft}
        />
        
        <ImageUploadField
          label="Right Image"
          currentImage={data.rightImage}
          onFileSelect={onFileSelectRight}
          compressionStats={compressionStatsRight}
          isLoading={compressionLoadingRight}
        />
      </div>

      {children}
    </div>
  );
};

export default EnquirySectionForm;
