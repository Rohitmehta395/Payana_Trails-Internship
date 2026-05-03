import { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ScrollToTop from "./components/common/ScrollToTop";
import Layout from "./components/common/layout/Layout";
import { NewsletterProvider } from "./context/NewsletterContext";

// ─── Page-level code splitting ───────────────────────────────────────────────
// Each lazy() call creates a separate chunk that only loads when the route is visited.

import Home from "./pages/Home";

// Public pages
const Journeys = lazy(() => import("./pages/Journeys"));
const PayanaWay = lazy(() => import("./pages/PayanaWay"));
const Stories = lazy(() => import("./pages/Stories"));
const Testimonials = lazy(() => import("./pages/Testimonials"));
const Connect = lazy(() => import("./pages/Connect"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Unsubscribe = lazy(() => import("./pages/Unsubscribe"));
const BlogsListing = lazy(() => import("./pages/BlogsListing"));
const ExternalStories = lazy(() => import("./pages/ExternalStories"));
const TrailDetails = lazy(() => import("./pages/TrailDetails"));
const TrailItinerary = lazy(() => import("./pages/TrailItinerary"));

// Connect sub-pages
const EnquiryPage = lazy(() =>
  import("./components/sections/Connect/EnquiryForm/EnquiryPage")
);
const FAQs = lazy(() =>
  import("./components/sections/Connect/FAQs/FAQs")
);
const ReferralPage = lazy(() =>
  import("./components/sections/Connect/ReferralForm/ReferralPage")
);
const GiftPage = lazy(() =>
  import("./components/sections/Connect/GiftForm/GiftPage")
);

// Journey sub-pages
const Wildlife = lazy(() =>
  import("./components/sections/Journey/Wildlife")
);
const Heritage = lazy(() =>
  import("./components/sections/Journey/Heritage")
);
const Cultural = lazy(() =>
  import("./components/sections/Journey/Cultural")
);
const SignatureTrailsPage = lazy(() =>
  import("./components/sections/Journey/SignatureTrailsPage")
);
const Destinations = lazy(() =>
  import("./components/sections/Journey/Destinations")
);

// Stories sub-pages
const SingleBlog = lazy(() =>
  import("./components/sections/Stories/SingleBlog")
);

// Admin — isolated chunk; heavy editor (1,870 KiB) only loads for admin users
const AdminLogin = lazy(() => import("./pages/Admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard"));

// ─── Minimal loading fallback ─────────────────────────────────────────────────
// Shown while a lazy chunk is being fetched. Matches the site's beige background
// so there's no jarring flash.
const PageLoader = () => (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#F3EFE9",
    }}
  >
    <div
      style={{
        width: 40,
        height: 40,
        border: "3px solid #4A3B2A20",
        borderTop: "3px solid #4A3B2A",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }}
    />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const App = () => {
  return (
    <Router>
      <NewsletterProvider>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            <Route
              path="/*"
              element={
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      <Route index element={<Home />} />
                      <Route
                        path="journey"
                        element={<Navigate to="/journeys" replace />}
                      />
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
                      <Route
                        path="stories/testimonials"
                        element={<Testimonials />}
                      />
                      <Route path="stories/blogs" element={<BlogsListing />} />
                      <Route
                        path="stories/external"
                        element={<ExternalStories />}
                      />
                      <Route
                        path="stories/blogs/:slug"
                        element={<SingleBlog />}
                      />
                      <Route path="connect" element={<Connect />} />
                      <Route
                        path="connect/enquiry"
                        element={<EnquiryPage />}
                      />
                      <Route path="connect/faqs" element={<FAQs />} />
                      <Route path="connect/refer" element={<ReferralPage />} />
                      <Route
                        path="connect/gift-a-journey"
                        element={<GiftPage />}
                      />
                      <Route path="unsubscribe" element={<Unsubscribe />} />
                      <Route path="trails/:slug" element={<TrailDetails />} />
                      <Route
                        path="trails/:slug/itinerary"
                        element={<TrailItinerary />}
                      />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </Layout>
              }
            />
          </Routes>
        </Suspense>
      </NewsletterProvider>
    </Router>
  );
};

export default App;
