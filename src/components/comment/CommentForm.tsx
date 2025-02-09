import { useState } from "react";
import Textarea from "../ui/Textarea";
import type { UseQueryResult } from "@tanstack/react-query";
import { createComment } from "../../services/comment";
import { twMerge } from "tailwind-merge";

interface Props {
  post: Post;
  query: UseQueryResult<IComment[]>;
}

export default function CommentForm({ post, query }: Props) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setText("");
    await createComment({ text }, post);
    await query.refetch();
    setLoading(false);
  };

  return (
    <div className="flex items-end gap-4">
      <div className="relative flex-1">
        <Textarea
          value={text}
          handleChange={setText}
          placeholder="Enter your comment"
        />
      </div>

      <button
        disabled={loading}
        onClick={() => void handleSubmit()}
        className={twMerge("btn btn-primary", loading && "loading")}
      >
        Submit
      </button>
    </div>
  );
}
