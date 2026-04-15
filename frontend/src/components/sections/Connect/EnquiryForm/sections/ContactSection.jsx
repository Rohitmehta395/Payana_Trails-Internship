import React from "react";
import { FiUser, FiMail, FiPhone } from "react-icons/fi";
import { InputField } from "../FormFields";
import { validateField } from "../validation";

const ContactSection = ({ formData, touched, handleChange, handleBlur }) => {
  return (
    <div>
      <h4 className="text-lg font-medium text-[#4A3B2A] mb-4 flex items-center gap-2">
        <FiUser className="text-[#4A3B2A]" /> Contact Information
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
        <div className="md:col-span-2">
          <InputField
            icon={FiPhone}
            name="phone"
            label="Phone / WhatsApp"
            placeholder="+91 98765 43210"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.phone && validateField("phone", formData.phone)}
          />
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
