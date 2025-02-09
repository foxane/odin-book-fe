import { twMerge } from "tailwind-merge";
import { useState } from "react";
import { CheckCircle, ImageIcon } from "lucide-react";
import Textarea from "../ui/Textarea";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  submit: (p: PostPayload) => void;
}

export default function PostForm({ submit, ...props }: Props) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (text.length < 3) return;
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
