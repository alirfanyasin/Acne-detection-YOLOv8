// src/components/FadeInOnScroll.jsx
import { useEffect, useRef, useState } from "react";

export default function FadeInOnScroll({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`
        transform transition-all duration-1500 ease-[cubic-bezier(0.25,0.8,0.25,1)]
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
        ${className}
      `}
      style={{
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}