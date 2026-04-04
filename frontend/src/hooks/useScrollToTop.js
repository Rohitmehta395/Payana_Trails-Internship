import { useRef } from "react";

/**
 * useScrollToTop
 *
 * Returns a [ref, scrollToTop] pair.
 * - Attach `ref` to the outermost wrapper div of your admin section.
 * - Call `scrollToTop()` in any handler (e.g. handleEdit) to smoothly
 *   scroll the nearest scrollable ancestor back to the top of the section.
 *
 * Works correctly inside the admin panel's inner `overflow-y-auto` container,
 * unlike `window.scrollTo()` which has no effect there.
 *
 * Usage:
 *   const [sectionRef, scrollToTop] = useScrollToTop();
 *   ...
 *   <div ref={sectionRef}>...</div>
 *   ...
 *   const handleEdit = (item) => {
 *     scrollToTop();
 *     // rest of edit logic
 *   };
 */
const useScrollToTop = () => {
  const ref = useRef(null);

  const scrollToTop = () => {
    if (!ref.current) return;

    // Walk up the DOM to find the nearest scrollable ancestor
    let parent = ref.current.parentElement;
    while (parent) {
      const { overflowY } = window.getComputedStyle(parent);
      const isScrollable =
        (overflowY === "auto" || overflowY === "scroll") &&
        parent.scrollHeight > parent.clientHeight;

      if (isScrollable) {
        parent.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      parent = parent.parentElement;
    }

    // Fallback: scroll the section element itself into view
    ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return [ref, scrollToTop];
};

export default useScrollToTop;
