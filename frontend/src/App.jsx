import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/common/ScrollToTop";
import Layout from "./components/common/layout/Layout";
import Home from "./pages/Home";
import Journeys from "./pages/Journeys";
import PayanaWay from "./pages/PayanaWay";
import Stories from "./pages/Stories";
import Connect from "./pages/Connect";
import EnquiryPage from "./components/sections/Connect/EnquiryForm/EnquiryPage";
import FAQs from "./components/sections/Connect/FAQs/FAQs";
import ReferralPage from "./components/sections/Connect/ReferralForm/ReferralPage";
import GiftPage from "./components/sections/Connect/GiftForm/GiftPage";
import NotFound from "./pages/NotFound";

import TrailDetails from "./pages/TrailDetails";
import TrailItinerary from "./pages/TrailItinerary";

// Import standard journey sections
import Wildlife from "./components/sections/Journey/Wildlife";
import Heritage from "./components/sections/Journey/Heritage";
import Cultural from "./components/sections/Journey/Cultural";
import SignatureTrailsPage from "./components/sections/Journey/SignatureTrailsPage";

// Import Destinations
import Destinations from "./components/sections/Journey/Destinations";

import { NewsletterProvider } from "./context/NewsletterContext";
import Unsubscribe from "./pages/Unsubscribe";

//Admin
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";

const App = () => {
  return (
    <Router>
      <NewsletterProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  <Route index element={<Home />} />
                  <Route path="journey" element={<Navigate to="/journeys" replace />} />
                  <Route path="journeys" element={<Journeys />} />
                  <Route path="journeys/wildlife" element={<Wildlife />} />
                  <Route path="journeys/heritage" element={<Heritage />} />
                  <Route
                    path="journeys/signature"
                    element={<SignatureTrailsPage />}
                  />
                  <Route path="journeys/cultural" element={<Cultural />} />
                  <Route
                    path="journeys/destinations"
                    element={<Destinations />}
                  />
                  <Route path="payana-way" element={<PayanaWay />} />
                  <Route path="stories" element={<Stories />} />
                  <Route path="connect" element={<Connect />} />
                  <Route path="connect/enquiry" element={<EnquiryPage />} />
                  <Route path="connect/faqs" element={<FAQs />} />
                  <Route path="connect/refer" element={<ReferralPage />} />
                  <Route path="connect/gift-a-journey" element={<GiftPage />} />
                  <Route path="unsubscribe" element={<Unsubscribe />} />
                  <Route path="trails/:slug" element={<TrailDetails />} />
                  <Route
                    path="trails/:slug/itinerary"
                    element={<TrailItinerary />}
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </NewsletterProvider>
    </Router>
  );
};

export default App;
