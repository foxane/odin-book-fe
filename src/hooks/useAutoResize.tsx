import { useEffect, useRef } from "react";

export default function useAutoResize(value: string) {
  const textRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!textRef.current) return;
    const { style } = textRef.current;

    const resize = () => {
      style.height = "auto";
      style.height = `${textRef.current!.scrollHeight}px`;
    };

    const timeout = setTimeout(resize, 100);
    return () => clearTimeout(timeout);
  }, [value]);

  return textRef;
}
