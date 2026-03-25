import React, { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

interface TextSegment {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

interface StaggeredCharacterTextProps {
  text?: string;
  segments?: TextSegment[];
  className?: string;
  style?: React.CSSProperties;
  align?: "left" | "center" | "right";
}

interface CharacterProps {
  char: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
  style?: React.CSSProperties;
  className?: string;
}

function Character({ char, index, total, progress, style: segmentStyle, className: segmentClassName = "" }: CharacterProps) {
  // Calculate relative start and end within the [0, 1] progress
  const start = index / total;
  const end = Math.min(1, (index + 1) / total + 0.1); 
  
  const opacity = useTransform(progress, [start, end], [0.2, 1]);

  return (
    <motion.span
      style={{ ...segmentStyle, opacity, whiteSpace: char === " " ? "pre" : "normal" }}
      className={`inline-block ${segmentClassName}`}
    >
      {char}
    </motion.span>
  );
}

export function StaggeredCharacterText({
  text,
  segments,
  className = "",
  style = {},
  align = "left",
}: StaggeredCharacterTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollElementRef = useRef<HTMLElement>(null);
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    const main = document.querySelector("main");
    if (main) {
      (scrollElementRef as any).current = main;
      setIsReady(true);
    }
  }, []);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    container: isReady ? scrollElementRef : undefined,
    offset: ["start 0.9", "center 0.5"],
  });

  const { scrollYProgress: exitProgress } = useScroll({
    target: containerRef,
    container: isReady ? scrollElementRef : undefined,
    offset: ["start 0.2", "start 0.1"],
  });

  const containerOpacity = useTransform(exitProgress, [0, 1], [1, 0.2]);

  const allSegments = segments || (text ? [{ text }] : []);
  const totalChars = allSegments.reduce((acc, s) => acc + s.text.replace(/\n/g, "").length, 0);
  let globalCharCount = 0;

  return (
    <motion.div
      ref={containerRef}
      className={className}
      style={{ ...style, opacity: containerOpacity }}
    >
      <div className={`flex flex-wrap ${align === "right" ? "justify-end" : align === "center" ? "justify-center" : "justify-start"}`}>
        {allSegments.map((segment, segmentIndex) => {
          const segmentLines = segment.text.split("\n");
          return (
            <React.Fragment key={`segment-${segmentIndex}`}>
              {segmentLines.map((line, lineIndex) => {
                const chars = line.split("");
                return (
                  <React.Fragment key={`line-${segmentIndex}-${lineIndex}`}>
                    {chars.map((char, charIndex) => {
                      const charIndexInContext = globalCharCount++;
                      return (
                        <Character
                          key={`char-${segmentIndex}-${lineIndex}-${charIndex}`}
                          char={char}
                          index={charIndexInContext}
                          total={totalChars}
                          progress={scrollYProgress}
                          style={segment.style}
                          className={segment.className}
                        />
                      );
                    })}
                    {lineIndex < segmentLines.length - 1 && <div className="w-full" />}
                  </React.Fragment>
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
    </motion.div>
  );
}
