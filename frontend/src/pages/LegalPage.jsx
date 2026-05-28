import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../services/api";
import RichTextRenderer from "../components/common/RichTextRenderer";
import CommonHero from "../components/common/CommonHero";
import usePageHeroImages from "../hooks/usePageHeroImages";

const TYPE_CONFIG = {
  "privacy-policy": {
    title: "Privacy Policy",
    breadcrumbLabel: "PRIVACY POLICY",
  },
  "terms-and-conditions": {
    title: "Terms & Conditions",
    breadcrumbLabel: "TERMS & CONDITIONS",
  },
};

const LegalPage = ({ type: typeProp }) => {
  const params = useParams();
  // Support both prop-based and route-param-based type
  const type = typeProp || params.type;
  const config = TYPE_CONFIG[type];

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { images, loading: heroLoading } = usePageHeroImages(type);

  useEffect(() => {
    if (!type || !config) return;
    setLoading(true);
    api
      .getLegalPage(type)
      .then((result) => {
        setData(result);
      })
      .catch((err) => {
        console.error("Failed to fetch legal page:", err);
      })
      .finally(() => setLoading(false));
  }, [type]);

  if (!config) {
    return (
      <div className="bg-[#F3EFE9] min-h-screen flex items-center justify-center">
        <p className="text-[#4A3B2A]/50 text-sm tracking-wider">
          Page not found.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#F3EFE9] min-h-screen">
      {/* ── Header / Breadcrumbs ─────────────────────────────────── */}
      <CommonHero
        title={data?.title || config.title}
        description={
          data?.lastPublishedAt
            ? `Last updated: ${new Date(data.lastPublishedAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}`
            : undefined
        }
        images={images}
        breadcrumbs={[
          { label: "HOME", path: "/" },
          { label: config.breadcrumbLabel },
        ]}
      />

      {/* ── Content ──────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        {loading ? (
          <div className="flex justify-center py-20">
            <div
              className="w-10 h-10 border-3 rounded-full animate-spin"
              style={{
                borderColor: "#4A3B2A20",
                borderTopColor: "#4A3B2A",
                borderWidth: "3px",
              }}
            />
          </div>
        ) : !data?.content || data.isDraft ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#4A3B2A]/5 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-[#4A3B2A]/30"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-[#4A3B2A]/50 text-sm tracking-wider">
              This page is currently being prepared.
            </p>
            <p className="text-[#4A3B2A]/30 text-xs tracking-wider mt-2">
              Please check back soon.
            </p>
          </div>
        ) : (
          <article className="legal-page-content">
            <RichTextRenderer
              text={data.content}
              className="legal-content-renderer"
              paragraphClass="text-[#374151] leading-relaxed mb-4"
            />
          </article>
        )}
      </div>

      {/* Additional styling for legal page content */}
      <style>{`
        .legal-content-renderer .wmde-markdown {
          font-family: inherit;
          color: #374151;
          line-height: 1.85;
          background-color: transparent !important;
        }
        .legal-content-renderer .wmde-markdown h1 {
          font-size: 1.75rem;
          font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
          font-weight: 700;
          color: #4A3B2A;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          border-bottom: 2px solid rgba(74, 59, 42, 0.1);
          padding-bottom: 0.75rem;
        }
        .legal-content-renderer .wmde-markdown h2 {
          font-size: 1.375rem;
          font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
          font-weight: 700;
          color: #4A3B2A;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          border-bottom: none;
          padding-bottom: 0;
        }
        .legal-content-renderer .wmde-markdown h3 {
          font-size: 1.125rem;
          font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
          font-weight: 600;
          color: #4A3B2A;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .legal-content-renderer .wmde-markdown p {
          margin-bottom: 1rem;
          line-height: 1.85;
          font-size: 0.9375rem;
          color: #374151;
        }
        .legal-content-renderer .wmde-markdown ul,
        .legal-content-renderer .wmde-markdown ol {
          padding-left: 1.5rem;
          margin: 1rem 0;
        }
        .legal-content-renderer .wmde-markdown li {
          margin-bottom: 0.5rem;
          line-height: 1.75;
          font-size: 0.9375rem;
        }
        .legal-content-renderer .wmde-markdown a {
          color: #4A3B2A;
          font-weight: 500;
          text-decoration: underline;
          text-underline-offset: 3px;
          text-decoration-color: rgba(74, 59, 42, 0.3);
          transition: all 0.2s;
        }
        .legal-content-renderer .wmde-markdown a:hover {
          text-decoration-color: #4A3B2A;
        }
        .legal-content-renderer .wmde-markdown blockquote {
          border-left: 3px solid rgba(74, 59, 42, 0.2);
          padding-left: 1.25rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #4A3B2A;
          background-color: rgba(74, 59, 42, 0.03);
          padding: 1rem 1.25rem;
          border-radius: 0 0.375rem 0.375rem 0;
        }
        .legal-content-renderer .wmde-markdown hr {
          margin: 2.5rem 0;
          border: 0;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(74, 59, 42, 0.15), transparent);
        }
        .legal-content-renderer .wmde-markdown strong {
          color: #1f2937;
          font-weight: 600;
        }
        @media (min-width: 768px) {
          .legal-content-renderer .wmde-markdown h1 { font-size: 2rem; }
          .legal-content-renderer .wmde-markdown h2 { font-size: 1.5rem; }
          .legal-content-renderer .wmde-markdown h3 { font-size: 1.25rem; }
        }
      `}</style>
    </div>
  );
};

export default LegalPage;
