import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize2 } from "lucide-react";

const LightboxImage = ({ 
  src, 
  alt, 
  className = "", 
  containerClassName = "",
  rounded = "rounded-2xl md:rounded-[3rem]"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Reset zoom when closing
  useEffect(() => {
    if (!isOpen) {
      setIsZoomed(false);
    }
  }, [isOpen]);

  // Lock scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const toggleLightbox = () => setIsOpen(!isOpen);
  const toggleZoom = (e) => {
    e.stopPropagation();
    setIsZoomed(!isZoomed);
  };

  return (
    <>
      <div className={`relative group cursor-pointer ${containerClassName}`}>
        {/* Main Image Container */}
        <div 
          className={`relative overflow-hidden ${rounded} bg-[#4A3B2A]/5 border border-[#4A3B2A]/10 shadow-lg ${className}`}
          onClick={toggleLightbox}
        >
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          />
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-[#4A3B2A]/10 backdrop-blur-[2px]">
             <div className="bg-[#4A3B2A]/60 backdrop-blur-md p-5 rounded-full border border-white/20 shadow-2xl transform scale-90 group-hover:scale-100 transition-all duration-500">
                <Maximize2 className="text-white w-10 h-10" strokeWidth={1.5} />
             </div>
          </div>
        </div>
      </div>

      {/* Lightbox Overlay using Portal */}
      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleLightbox}
              className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-10 ${isZoomed ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-out"}`}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full h-full flex items-center justify-center pointer-events-none overflow-hidden"
              >
                {/* Close Button */}
                {!isZoomed && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLightbox();
                    }}
                    className="fixed top-6 right-6 md:top-10 md:right-12 text-white/70 hover:text-white transition-colors p-2 pointer-events-auto cursor-pointer z-[100]"
                  >
                    <X size={40} strokeWidth={1.5} />
                  </button>
                )}

                <motion.img
                  drag={isZoomed}
                  dragConstraints={{ left: -500, right: 500, top: -500, bottom: 500 }}
                  dragElastic={0}
                  dragMomentum={false}
                  initial={{ scale: 1 }}
                  animate={{ 
                    scale: isZoomed ? 2 : 1,
                    x: isZoomed ? undefined : 0,
                    y: isZoomed ? undefined : 0
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 300 }}
                  src={src}
                  alt={alt}
                  className={`max-w-full max-h-full object-contain shadow-2xl pointer-events-auto ${isZoomed ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in rounded-lg"}`}
                  onClick={toggleZoom}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default LightboxImage;
