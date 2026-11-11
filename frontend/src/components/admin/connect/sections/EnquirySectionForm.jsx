import React from "react";
import ImageUploadField from "../../home-page/ImageUploadField";
import FormField from "../../home-page/FormField";
import enquiry1 from "../../../../assets/connect/enquiry1.webp";
import enquiry2 from "../../../../assets/connect/enquiry2.webp";

const EnquirySectionForm = ({
  data = {},
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-[#F3EFE9]/40 rounded-xl border border-[#4A3B2A]/10">
        <ImageUploadField
          label="Back Image (Visual Left / Background)"
          helperText="The offset background photo behind the main front card."
          currentImage={data.leftImage}
          defaultImage={enquiry1}
          onImageSelect={onFileSelectLeft}
          onFileSelect={onFileSelectLeft}
          onRemove={() => onChange({ ...data, leftImage: "" })}
          compressionStats={compressionStatsLeft}
          compressionLoading={compressionLoadingLeft}
        />
        
        <ImageUploadField
          label="Front Image (Visual Right / Main Focus)"
          helperText="The primary foreground card photo with rounded borders."
          currentImage={data.rightImage}
          defaultImage={enquiry2}
          onImageSelect={onFileSelectRight}
          onFileSelect={onFileSelectRight}
          onRemove={() => onChange({ ...data, rightImage: "" })}
          compressionStats={compressionStatsRight}
          compressionLoading={compressionLoadingRight}
        />
      </div>

      {children}
    </div>
  );
};

export default EnquirySectionForm;
