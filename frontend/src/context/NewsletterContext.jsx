import React, { createContext, useState, useContext } from "react";

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

  const openNewsletterModal = () => setIsModalOpen(true);
  const closeNewsletterModal = () => setIsModalOpen(false);

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
