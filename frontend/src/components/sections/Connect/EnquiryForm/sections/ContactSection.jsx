import React from "react";
import { FiUser, FiMail, FiPhone } from "react-icons/fi";
import { InputField, SectionHeader } from "../FormUI";

const ContactSection = ({ formData, touched, validateField, handleChange, handleBlur }) => {
  return (
    <div>
      <SectionHeader icon={FiUser} title="Contact Information" />
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
