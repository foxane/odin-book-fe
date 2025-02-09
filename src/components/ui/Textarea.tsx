import { useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  handleChange: (s: string) => void;
  maxLength?: number;
}

function Textarea({ className, value, handleChange, maxLength = 300 }: Props) {
  const textRef = useRef<HTMLTextAreaElement | null>(null);

  const _handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length > maxLength) return;
    handleChange(e.target.value);
  };

  useEffect(() => {
    if (!textRef.current) return;
    const { style } = textRef.current;

    // Height autosize
    style.height = "auto";
    style.height = `${textRef.current.scrollHeight.toString()}px`;

    if (value.length >= maxLength) style.borderColor = "red";
    else style.borderColor = "";
  }, [value, maxLength]);

  return (
    <textarea
      ref={textRef}
      value={value}
      onChange={_handleChange}
      className={twMerge(
        "textarea w-full resize-none rounded-none border-0 border-b-4 border-primary",
        className,
      )}
    />
  );
}

export default Textarea;
