import React, { createContext, useState, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";

const NewsletterContext = createContext();

export const useNewsletter = () => {
  const context = useContext(NewsletterContext);
  if (!context) {
    throw new Error("useNewsletter must be used within a NewsletterProvider");
  }
  return context;
};

export const NewsletterProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  const openNewsletterModal = () => setIsModalOpen(true);
  const closeNewsletterModal = () => {
    setIsModalOpen(false);
    if (window.location.hash === "#newsletter" || window.location.hash === "#subscribe") {
      window.history.replaceState(null, null, window.location.pathname);
    }
  };

  useEffect(() => {
    if (location.hash === "#newsletter" || location.hash === "#subscribe") {
      setIsModalOpen(true);
    }
  }, [location.hash]);

  return (
    <NewsletterContext.Provider
      value={{
        isModalOpen,
        openNewsletterModal,
        closeNewsletterModal,
      }}
    >
      {children}
    </NewsletterContext.Provider>
  );
};
