import React, { useEffect, useRef, useState } from 'react';

interface StaggerRevealProps {
    children: React.ReactNode;
    staggerDelay?: number;
    baseDelay?: number;
    className?: string;
    triggerOnce?: boolean;
    rootMargin?: string;
}

// Estilos infalibles para la máscara y animación sin depender de React.
const CSS_STYLES = `
  .stagger-mask {
    overflow: hidden;
    display: inline-flex;
    vertical-align: baseline;
    padding-bottom: 0.15em;
    margin-bottom: -0.15em;
    padding-top: 0.1em;
    margin-top: -0.1em;
  }
  .stagger-word {
    display: inline-block;
    transform: translateY(110%);
    opacity: 0;
    transition: transform 0.55s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.35s ease-out;
  }
  .is-revealed .stagger-word {
    transform: translateY(0);
    opacity: 1;
  }
`;

function wrapWords(node: React.ReactNode): React.ReactNode {
    if (typeof node === 'string') {
        const segments = node.split(/(\s+)/);
        return segments.map((segment, i) => {
            if (segment.trim() === '') return segment;
            return (
                <span key={i} className="stagger-mask">
                    <span className="stagger-word">{segment}</span>
                </span>
            );
        });
    }

    if (React.isValidElement(node)) {
        const el = node as React.ReactElement<any>;
        if (el.props.className?.includes('stagger-word')) {
            return el;
        }
        return React.cloneElement(el, {
            ...el.props,
            children: React.Children.map(el.props.children, wrapWords)
        });
    }

    if (Array.isArray(node)) return node.map(wrapWords);
    return node;
}

export function StaggerReveal({ children, staggerDelay = 50, baseDelay = 0, className = '', triggerOnce = true, rootMargin = '0px 0px -33% 0px' }: StaggerRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (triggerOnce) observer.disconnect();
                } else if (!triggerOnce) {
                    setIsVisible(false);
                }
            },
            { threshold: 0.1, rootMargin }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [triggerOnce, rootMargin]);

    // Set individual transition delays ONLY ONCE on mount
    useEffect(() => {
        if (ref.current) {
            const words = ref.current.querySelectorAll('.stagger-word');
            words.forEach((word, index) => {
                (word as HTMLElement).style.transitionDelay = `${baseDelay + (index * staggerDelay)}ms`;
            });
        }
    }, [staggerDelay, baseDelay, children]);

    return (
        <>
            <style>{CSS_STYLES}</style>
            <div ref={ref} className={`${className} ${isVisible ? 'is-revealed' : ''}`}>
                {React.Children.map(children, wrapWords)}
            </div>
        </>
    );
}
