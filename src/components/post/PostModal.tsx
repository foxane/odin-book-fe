import { useState } from "react";
import Modal from "../ui/Modal";
import { removePTag } from "../../lib/utils";

interface Props {
  post: Post;
  submit: (post: Post) => void;
  onClose: () => void;
}

export function UpdatePostModal({ post, onClose, submit }: Props) {
  const [text, setText] = useState(removePTag(post.text));

  const handleSubmit = () => {
    const updated: Post = { ...post, text };
    submit(updated);
    onClose();
  };

  return (
    <Modal visible={true} onClose={onClose}>
      <p>Update post</p>
      <textarea value={text} onChange={(e) => setText(e.target.value)} />
      <button className="btn btn-primary" onClick={handleSubmit}>
        Submit
      </button>
      <button onClick={onClose}>Cancel</button>
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
      <p>Delete post</p>
      <button className="btn-danger btn" onClick={handleSubmit}>
        Delete
      </button>
      <button onClick={onClose}>Cancel</button>
    </Modal>
  );
}
