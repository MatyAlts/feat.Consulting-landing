import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealItemProps {
  children: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
}

export function ScrollRevealItem({ 
  children, 
  threshold = 0.1, 
  rootMargin = "-45% 0px -45% 0px",
  className = ""
}: ScrollRevealItemProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(40px)",
        filter: isVisible ? "blur(0px)" : "blur(10px)",
        transition: "all 1000ms cubic-bezier(0, 0, 0.2, 1)",
      }}
    >
      {children}
    </div>
  );
}
