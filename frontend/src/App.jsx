import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/common/layout/Layout";
import Home from "./pages/Home";
import Journeys from "./pages/Journeys";
import PayanaWay from "./pages/PayanaWay";
import Stories from "./pages/Stories";
import Connect from "./pages/Connect";

import TrailDetails from "./pages/TrailDetails";

// Import standard journey sections
import Wildlife from "./components/sections/Journey/Wildlife";
import Heritage from "./components/sections/Journey/Heritage";
import Cultural from "./components/sections/Journey/Cultural";
import SignatureTrailsPage from "./components/sections/Journey/SignatureTrailsPage";

// Import Destinations
import Destinations from "./components/sections/Journey/Destinations";

//Admin
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/journeys" element={<Journeys />} />
                <Route path="/journeys/wildlife" element={<Wildlife />} />
                <Route path="/journeys/heritage" element={<Heritage />} />
                <Route
                  path="/journeys/signature"
                  element={<SignatureTrailsPage />}
                />
                <Route path="/journeys/cultural" element={<Cultural />} />
                <Route
                  path="/journeys/destinations"
                  element={<Destinations />}
                />
                <Route path="/payana-way" element={<PayanaWay />} />
                <Route path="/stories" element={<Stories />} />
                <Route path="/connect" element={<Connect />} />
                <Route path="/trails/:slug" element={<TrailDetails />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
