import React from "react";
import { FiUser, FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { InputField } from "../FormFields";
import { validateField } from "../validation";
import CountryCodeDropdown from "../../../../common/CountryCodeDropdown";

const ContactSection = ({ formData, touched, handleChange, handleCountryChange, handleBlur }) => {
  return (
    <div>
      <h4 className="text-base sm:text-lg font-medium text-[#4A3B2A] mb-5 flex items-center gap-2">
        <FiUser className="text-[#4A3B2A] shrink-0" /> Contact Information
      </h4>
      <div className="grid md:grid-cols-2 gap-6">
        <InputField
          icon={FiUser}
          name="name"
          label="Full Name"
          placeholder="John Doe"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.name && validateField("name", formData.name)}
        />
        <InputField
          icon={FiMail}
          name="email"
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.email && validateField("email", formData.email)}
        />
        <div>
          <InputField
            icon={FiPhone}
            name="phone"
            label="Phone / WhatsApp"
            placeholder="98765 43210"
            value={formData.phone}
            onChange={handleChange}
            addonBefore={
              <CountryCodeDropdown
                value={formData.countryCode}
                iso={formData.countryIso}
                onChange={handleCountryChange}
              />
            }
            onBlur={handleBlur}
            error={touched.phone && validateField("phone", formData.phone)}
          />
        </div>
        <div>
          <InputField
            icon={FiMapPin}
            name="currentLocation"
            label="Current Location *"
            placeholder="City, Country"
            value={formData.currentLocation}
            onChange={handleChange}
            onBlur={handleBlur}
            required={true}
            error={touched.currentLocation && !formData.currentLocation && "Location is required"}
          />
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
