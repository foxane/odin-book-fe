import { twMerge } from "tailwind-merge";
import { useState } from "react";
import { CheckCircle, ImageIcon, InfoIcon } from "lucide-react";
import Textarea from "../ui/Textarea";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  submit: (p: PostPayload) => void;
}

const CHAR_LIMIT = 300;

export default function PostForm({ submit, ...props }: Props) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    setText("");
    submit({ text });
  };

  return (
    <div
      className={twMerge("mx-auto max-w-xl bg-base-100 p-3", props.className)}
    >
      <div className="card space-y-4">
        <div className="relative">
          <Textarea
            handleChange={setText}
            value={text}
            placeholder="Whats on your mind?"
          />

          <span className="absolute right-2 bottom-2 label text-sm">
            {text.length}/{CHAR_LIMIT}
          </span>

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
