import React from "react";
import Header from "../Header";
import Footer from "../Footer";
import NewsletterModal from "../NewsletterModal";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F3EFE9] font-sans">
      <Header />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
      <NewsletterModal />
    </div>
  );
};

export default Layout;
