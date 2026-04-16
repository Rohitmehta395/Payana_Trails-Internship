import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    // If it's a POP navigation (back/forward button), let the browser 
    // handle its own scroll restoration.
    if (navType === "POP") return;

    // If there's a hash, we want to scroll to the element after a short delay
    // to give the page time to render.
    if (hash) {
      setTimeout(() => {
        const id = hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 200);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash, navType]);

  return null;
};

export default ScrollToTop;
