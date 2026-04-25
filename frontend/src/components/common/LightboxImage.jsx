import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useMotionValue, useAnimation } from "framer-motion";
import { X, Maximize2, ZoomIn, ZoomOut } from "lucide-react";

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

  // Separate motion values for position (drag) and scale
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scaleControls = useAnimation();
  const isDragging = useRef(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Reset everything when closing
  useEffect(() => {
    if (!isOpen) {
      setIsZoomed(false);
      x.set(0);
      y.set(0);
      scaleControls.set({ scale: 1 });
    }
  }, [isOpen]);

  // Lock scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const toggleLightbox = () => setIsOpen((prev) => !prev);

  const handleZoomIn = (e) => {
    e?.stopPropagation();
    scaleControls.start({ scale: 2.5, transition: { type: "spring", stiffness: 250, damping: 25 } });
    setIsZoomed(true);
  };

  const handleZoomOut = (e) => {
    e?.stopPropagation();
    // Snap position back to center first, then scale down
    x.set(0);
    y.set(0);
    scaleControls.start({ scale: 1, transition: { type: "spring", stiffness: 250, damping: 25 } });
    setIsZoomed(false);
  };

  const handleImageClick = (e) => {
    e.stopPropagation();
    // If the user was dragging, don't toggle zoom
    if (isDragging.current) {
      isDragging.current = false;
      return;
    }
    if (isZoomed) {
      handleZoomOut(e);
    } else {
      handleZoomIn(e);
    }
  };

  return (
    <>
      <div className={`relative group cursor-pointer ${containerClassName}`}>
        <div 
          className={`relative overflow-hidden ${rounded} bg-[#4A3B2A]/5 border border-[#4A3B2A]/10 shadow-lg ${className}`}
          onClick={toggleLightbox}
        >
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-[#4A3B2A]/10 backdrop-blur-[2px]">
            <div className="bg-[#4A3B2A]/60 backdrop-blur-md p-5 rounded-full border border-white/20 shadow-2xl transform scale-90 group-hover:scale-100 transition-all duration-500">
              <Maximize2 className="text-white w-10 h-10" strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </div>

      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={!isZoomed ? toggleLightbox : undefined}
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md overflow-hidden"
            >
              {/* Toolbar */}
              <div className="fixed top-6 right-6 md:top-8 md:right-10 flex items-center gap-3 z-[100]">
                <button
                  onClick={isZoomed ? handleZoomOut : handleZoomIn}
                  className="text-white/70 hover:text-white transition-colors p-2 pointer-events-auto cursor-pointer bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm"
                  title={isZoomed ? "Zoom Out" : "Zoom In"}
                >
                  {isZoomed ? <ZoomOut size={28} strokeWidth={1.5} /> : <ZoomIn size={28} strokeWidth={1.5} />}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleLightbox(); }}
                  className="text-white/70 hover:text-white transition-colors p-2 pointer-events-auto cursor-pointer bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm"
                  title="Close"
                >
                  <X size={28} strokeWidth={1.5} />
                </button>
              </div>

              {/* Hint text */}
              <p className="fixed bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-xs tracking-widest uppercase pointer-events-none">
                {isZoomed ? "Drag to pan · Click image to zoom out" : "Click image to zoom · Click outside to close"}
              </p>

              {/*
                TWO-LAYER APPROACH:
                - Outer motion.div: handles drag (x, y) only — no scale
                - Inner motion.img: handles scale only — no drag / position
              */}
              <motion.div
                style={{ x, y }}
                drag={isZoomed}
                dragElastic={0}
                dragMomentum={false}
                onDragStart={() => { isDragging.current = true; }}
                onDragEnd={() => {
                  // Keep isDragging true briefly so the subsequent onClick is suppressed
                  setTimeout(() => { isDragging.current = false; }, 50);
                }}
                className={`pointer-events-auto ${isZoomed ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"}`}
                onClick={handleImageClick}
              >
                <motion.img
                  animate={scaleControls}
                  src={src}
                  alt={alt}
                  className="max-w-[90vw] max-h-[90vh] object-contain shadow-2xl rounded-lg select-none block"
                  draggable={false}
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
