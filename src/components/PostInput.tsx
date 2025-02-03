import { useState } from "react";
import postService from "../services/post";
import { InfoIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";

export default function PostInput(
  props: React.HTMLAttributes<HTMLFormElement>,
) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text) return;

    postService
      .createPost({ text })
      .then((post) => {
        console.log(post);
      })
      .catch((err: unknown) => {
        console.log(err);
      });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={twMerge("card w-fit items-center gap-2", props.className)}
      {...props}
    >
      <div className="card border border-neutral p-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          name="text"
          className="textarea"
          placeholder="Start typing..."
          minLength={3}
          maxLength={300}
        />

        <div>
          <span className="text-sm">{text.length}/300</span>
          <span
            className="tooltip tooltip-right"
            data-tip="You can use &lt;b&gt; and &lt;i&gt; to craete bold and italictext"
          >
            <InfoIcon />
          </span>
        </div>
      </div>

      <button type="submit" className="btn btn-sm btn-primary">
        Create Post
      </button>
    </form>
  );
}
