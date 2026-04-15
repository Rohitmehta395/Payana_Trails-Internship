import React from "react";
import { FiPhone, FiMail, FiMessageCircle, FiVideo } from "react-icons/fi";

export const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const currentYear = new Date().getFullYear();
export const years = [
  currentYear.toString(),
  (currentYear + 1).toString(),
  (currentYear + 2).toString(),
];

export const guestOptions = Array.from({ length: 11 }, (_, i) => (i + 2).toString());

export const roomPreferences = ["Luxury", "Premium", "Standard"];

export const connectOptions = [
  { label: "Phone Call", value: "Phone call", icon: <FiPhone /> },
  { label: "Email", value: "eMail", icon: <FiMail /> },
  { label: "WhatsApp", value: "WhatsApp Message", icon: <FiMessageCircle /> },
  { label: "Google Meet", value: "Google Meet", icon: <FiVideo /> },
];
