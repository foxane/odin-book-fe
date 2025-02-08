import { useEffect, useState } from "react";

export const useIntersection = (
  element: React.RefObject<HTMLDivElement>,
  rootMargin: string,
) => {
  const [isVisible, setState] = useState(false);

  useEffect(() => {
    if (!element.current) return;

    const current = element.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setState(entry.isIntersecting);
      },
      { rootMargin },
    );
    observer.observe(current);

    return () => observer.unobserve(current);
  }, [element, rootMargin]);

  return isVisible;
};
