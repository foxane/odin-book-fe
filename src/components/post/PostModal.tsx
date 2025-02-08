import { useEffect, useRef, useState } from "react";
import Modal from "../ui/Modal";
import { removePTag } from "../../lib/utils";
import { AlertOctagonIcon, NotebookPenIcon } from "lucide-react";

interface Props {
  post: Post;
  submit: (post: Post) => void;
  onClose: () => void;
}

export function UpdatePostModal({ post, onClose, submit }: Props) {
  const textRef = useRef<HTMLTextAreaElement | null>(null);
  const [text, setText] = useState(removePTag(post.text));

  const handleSubmit = () => {
    const updated: Post = { ...post, text };
    submit(updated);
    onClose();
  };

  useEffect(() => {
    if (!textRef.current) return;

    textRef.current.style.height = "auto";
    textRef.current.style.height = `${textRef.current.scrollHeight.toString()}px`;
  }, [text]);

  return (
    <Modal visible={true} onClose={onClose}>
      <div className="space-y-5">
        <p className="card-title">
          <NotebookPenIcon />
          Update post
        </p>
        <textarea
          ref={textRef}
          placeholder="Whats on your mind?"
          className="textarea w-full resize-none border-0 border-b-4 border-primary bg-base-200/40"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button className="btn btn-neutral" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function DeletePostModal({ post, onClose, submit }: Props) {
  const handleSubmit = () => {
    submit(post);
    onClose();
  };

  return (
    <Modal visible={true} onClose={onClose}>
      <div className="space-y-5">
        <div className="card-title">
          <AlertOctagonIcon />
          <p>Delete post</p>
        </div>

        <p className="">This action cannot be undone!</p>

        <div className="flex items-center justify-end gap-2">
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-md btn-error" onClick={handleSubmit}>
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}
