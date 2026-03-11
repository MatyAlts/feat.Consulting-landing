import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function StickyFooter() {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const lastScrollTop = useRef(0);
  const ticking = useRef(false);

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
    <div
      className={[
        "fixed bottom-0 left-0 right-0 z-50 h-[53px]",
        "bg-[#FCFAF3] border-t border-brand-dark/10",
        "transition-transform duration-500 ease-in-out",
        isVisible ? "translate-y-0" : "translate-y-full",
      ].join(" ")}
    >
      <div className="flex items-center justify-center gap-12 h-full px-4 relative">
        <Link
          to="/contact"
          onClick={() => localStorage.removeItem("selectedTier")}
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
      </div>
    </div>
  );
}
