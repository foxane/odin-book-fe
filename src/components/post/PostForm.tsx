import { useState } from "react";
import { CheckCircle, ImageIcon } from "lucide-react";
import Textarea from "../Textarea";

interface Props {
  submit: (p: PostPayload) => void;
}

export default function PostForm({ submit }: Props) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (text.length < 3) return;
    setText("");
    submit({ text });
  };

  return (
    <div className="card bg-base-100 border border-gray-300 p-3 dark:border-0">
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
            className="btn btn-sm btn-primary ms-auto"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
