import { useState } from "react";
import Textarea from "../ui/Textarea";
import { twMerge } from "tailwind-merge";

interface Props {
  post: Post;
  cancel: () => void;
  submit: ({ c, p }: { c: CommentPayload; p: Post }) => void;
}

export default function CommentForm({ post, submit, cancel }: Props) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (text.length < 3) return;
    submit({ c: { text }, p: post });
    setText("");
  };

  return (
    <div className="grid grid-cols-5 items-end gap-3">
      <div className="relative col-span-4 flex-1">
        <Textarea
          autoFocus
          value={text}
          handleChange={setText}
          placeholder="Enter your comment"
        />
      </div>

      <div className="flex flex-col gap-2">
        <button className="btn" onClick={() => cancel()}>
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          className={twMerge(
            "btn flex justify-center btn-sm btn-primary disabled:bg-primary",
          )}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
