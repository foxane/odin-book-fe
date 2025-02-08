import { twMerge } from "tailwind-merge";
import { useEffect, useRef, useState } from "react";
import { CheckCircle, ImageIcon, InfoIcon } from "lucide-react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  submit: (p: PostPayload) => void;
}

export default function PostForm({ submit, ...props }: Props) {
  const textRef = useRef<HTMLTextAreaElement | null>(null);
  const [text, setText] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleSubmit = () => {
    setText("");
    submit({ text });
  };

  useEffect(() => {
    if (!textRef.current) return;

    textRef.current.style.height = "auto";
    textRef.current.style.height = `${textRef.current.scrollHeight.toString()}px`;
  }, [text]);

  return (
    <div
      className={twMerge("mx-auto max-w-xl bg-base-100 p-3", props.className)}
    >
      <div className="card space-y-4">
        <div>
          <textarea
            ref={textRef}
            placeholder="Whats on your mind?"
            className="textarea w-full resize-none rounded-none border-0 border-b-4 border-primary"
            value={text}
            onChange={handleChange}
          />

          <div className="tooltip absolute tooltip-left top-2 right-2 z-[2]">
            <InfoIcon opacity={0.6} size={20} />
            <div className="tooltip-content flex flex-col p-2 text-xs">
              <span>
                You can use &lt;b&gt; and &lt;i&gt; to make text bold and italic
              </span>
            </div>
          </div>
        </div>

        <div className="card-actions">
          <button
            className="btn tooltip btn-square btn-ghost"
            data-tip="Upload image"
          >
            <ImageIcon className="mx-auto" />
          </button>

          <button
            className="btn tooltip btn-square btn-ghost"
            data-tip="Create poll"
          >
            <CheckCircle className="mx-auto" />
          </button>

          <button
            className="btn ms-auto btn-sm btn-primary"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
