import { useState } from "react";
import Textarea from "../Textarea";
import { twMerge } from "tailwind-merge";

interface Props {
  post: Post;
  submit: ({ c, p }: { c: CommentPayload; p: Post }) => void;
}

export default function CommentForm({ post, submit }: Props) {
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
          value={text}
          handleChange={setText}
          placeholder="Enter your comment"
        />
      </div>

      <button
        onClick={handleSubmit}
        className={twMerge(
          "btn btn-sm btn-primary disabled:bg-primary flex justify-center",
        )}
      >
        Submit
      </button>
    </div>
  );
}
