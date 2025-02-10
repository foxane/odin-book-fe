import { InfoIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  handleChange: (s: string) => void;
  maxLength?: number;
}

function Textarea({
  className,
  value,
  handleChange,
  maxLength = 300,
  ...props
}: Props) {
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
    <>
      <textarea
        ref={textRef}
        value={value}
        onChange={_handleChange}
        className={twMerge(
          "textarea w-full resize-none rounded border-0 border-b-4 border-primary ring ring-base-300",
          className,
        )}
        {...props}
      ></textarea>

      <span className="absolute right-2 bottom-2 label text-sm">
        {value.length}/{maxLength}
      </span>

      <div className="tooltip absolute tooltip-left top-2 right-2 z-[2]">
        <InfoIcon opacity={0.6} size={20} />
        <div className="tooltip-content flex flex-col p-2 text-xs">
          <span>
            You can use &lt;b&gt; and &lt;i&gt; to make text bold and italic
          </span>
        </div>
      </div>
    </>
  );
}

export default Textarea;
