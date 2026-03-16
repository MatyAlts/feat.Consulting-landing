import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { saveScrollAnchor } from "../../utils/scrollRestore";

export default function StickyFooter() {
  const [variant, setVariant] = useState<"default" | "cta">("default");
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const lastScrollTop = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleVariantChange = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && detail.variant) {
        setVariant(detail.variant);
      }
    };

    window.addEventListener("sticky-footer-variant", handleVariantChange);
    return () =>
      window.removeEventListener("sticky-footer-variant", handleVariantChange);
  }, []);

  useEffect(() => {
    const THRESHOLD = 3;

    const updateProgress = (target: HTMLElement) => {
      const scrollTop = target.scrollTop;
      const maxScroll = target.scrollHeight - target.clientHeight;

      let scrollableRange = 0;
      let currentLevel = 0;

      const hero = target.querySelector("#hero") as HTMLElement | null;
      if (hero) {
        const heroHeight = hero.offsetHeight;
        scrollableRange = Math.max(0, maxScroll - heroHeight);
        currentLevel = Math.max(0, scrollTop - heroHeight);
      } else {
        scrollableRange = maxScroll;
        currentLevel = scrollTop;
      }

      let pageProgress = 0;
      if (scrollableRange > 0) {
        pageProgress = Math.max(0, Math.min(1, currentLevel / scrollableRange));
      }

      setProgress(pageProgress);

      if (Math.abs(scrollTop - lastScrollTop.current) > THRESHOLD) {
        if (scrollTop > 50) {
          setIsVisible(scrollTop > lastScrollTop.current);
        } else {
          setIsVisible(false);
        }
        lastScrollTop.current = scrollTop;
      }
      ticking.current = false;
    };

    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "MAIN" ||
        target.classList?.contains("snap-container")
      ) {
        if (!ticking.current) {
          requestAnimationFrame(() => updateProgress(target));
          ticking.current = true;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, {
      capture: true,
      passive: true,
    });

    const mainEl = document.querySelector("main");
    if (mainEl) updateProgress(mainEl as HTMLElement);

    return () =>
      window.removeEventListener("scroll", handleScroll, { capture: true });
  }, []);

  return (
    <motion.div
      initial={false}
      animate={{
        height: variant === "cta" ? 104 : 53,
        y: isVisible ? 0 : "100%",
        backgroundColor: variant === "cta" ? "#D2D3FF" : "#FCFAF3",
        borderTopLeftRadius: variant === "cta" ? "19.97px" : "0px",
        borderTopRightRadius: variant === "cta" ? "19.97px" : "0px",
      }}
      transition={{
        height: { duration: 0.5, ease: [0.32, 0.72, 0, 1] },
        y: { duration: 0.4, ease: "easeInOut" },
        backgroundColor: { duration: 0.5 },
        borderRadius: { duration: 0.5 },
      }}
      className="fixed bottom-0 left-0 right-0 z-50 overflow-hidden"
      style={{
        background:
          variant === "cta"
            ? "linear-gradient(to bottom, #DBE9EE 0%, #D2D3FF 100%)"
            : undefined,
        borderTop: variant === "cta" ? "none" : "1px solid rgba(2, 27, 48, 0.1)",
      }}
    >
      <div className="flex flex-col items-center w-full h-full relative">
        <AnimatePresence mode="wait">
          {variant === "cta" ? (
            <motion.div
              key="cta"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex flex-col items-center w-full"
            >
              <Link
                to="/contact"
                onClick={() => {
                  saveScrollAnchor();
                  localStorage.removeItem("selectedTier");
                }}
                className="rounded-full flex items-center justify-center transition-transform active:scale-95 shadow-lg"
                style={{
                  width: "299.26px",
                  height: "59.56px",
                  backgroundColor: "#191432",
                  marginTop: "11.72px",
                  marginBottom: "4px",
                }}
              >
                <span
                  className="text-white font-['Fustat'] font-medium"
                  style={{ fontSize: "18.75px" }}
                >
                  Direct your Growth →
                </span>
              </Link>
              <p
                className="font-['Lato'] font-light"
                style={{
                  fontSize: "14.56px",
                  color: "#191627",
                  opacity: 0.8,
                  marginBottom: "11.72px",
                }}
              >
                No obligation. Just alignment.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="default"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center h-full w-full"
            >
              <Link
                to="/contact"
                onClick={() => {
                  saveScrollAnchor();
                  localStorage.removeItem("selectedTier");
                }}
                className="text-brand-dark text-[15px] font-medium flex items-center gap-1"
              >
                Direct your Growth <span className="text-[12px]">-&gt;</span>
              </Link>

              <div className="absolute bottom-0 left-0 w-full h-[5px] overflow-hidden">
                <div
                  className="h-full will-change-transform origin-left"
                  style={{
                    backgroundColor: "#5C63C3",
                    transform: `scaleX(${progress})`,
                    transition: "transform 150ms cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
