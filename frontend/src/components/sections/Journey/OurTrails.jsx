import React from "react";
import { motion } from "framer-motion";
import Wildlife_Icon from "../../../assets/Journey/Trails_Icons/Wildlife.webp";
import Heritage_Icon from "../../../assets/Journey/Trails_Icons/Heritage.webp";
import Cultural_Icon from "../../../assets/Journey/Trails_Icons/Culture.webp";

const trailsData = [
  {
    id: 1,
    title: "Wildlife Trails",
    description:
      "Safari landscapes and wildlife encounters across iconic reserves.",
    icon: Wildlife_Icon,
    path: "/journeys/wildlife",
  },
  {
    id: 2,
    title: "Heritage Trails",
    description: "Journeys through sites of exceptional cultural significance.",
    icon: Heritage_Icon,
    path: "/journeys/heritage",
  },
  {
    id: 3,
    title: "Cultural & Immersive Trails",
    description:
      "Experience the living culture of a destination — its people, traditions, food, art, and spiritual life.",
    icon: Cultural_Icon,
    path: "/journeys/cultural",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function OurTrails() {
  return (
    <section className="py-12 bg-[#F3EFE9] relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#4A3B2A]/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold font-serif text-[#4A3B2A] mb-4"
          >
            Our Trails
          </motion.h2>

          <div className="w-[60px] h-[2px] bg-[#4A3B2A] mx-auto mb-6"></div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-[#4A3B2A]/80"
          >
            Choose your path. Whether you seek the thrill of the wild, the
            echoes of history, or the heartbeat of local communities, we have a
            journey for you.
          </motion.p>
        </div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {trailsData.map((trail) => (
            <motion.a
              href={trail.path}
              key={trail.id}
              variants={cardVariants}
              className="group bg-white p-8 rounded-3xl shadow-sm border border-[#4A3B2A]/10 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-[#4A3B2A]/40"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#4A3B2A]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <img
                  src={trail.icon}
                  alt={trail.title}
                  className="w-full h-full object-contain rounded-2xl"
                />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-[#4A3B2A] mb-3">
                {trail.title}
              </h3>

              <p className="text-[#4A3B2A]/70 leading-relaxed mb-6">
                {trail.description}
              </p>

              {/* CTA */}
              <div className="flex items-center text-sm font-semibold text-[#4A3B2A] opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                Explore Trail
                <svg
                  className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
