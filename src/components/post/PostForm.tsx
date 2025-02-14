import { useState } from "react";
import { CheckCircle, ImageIcon } from "lucide-react";
import Textarea from "../Textarea";

interface Props {
  submit: (p: FormData) => void;
}

export default function PostForm({ submit }: Props) {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = () => {
    if (text.length < 3) return;

    const formData = new FormData();
    formData.append("text", text);
    if (imageFile) {
      formData.append("user-upload", imageFile);
    }

    setText("");
    setImageFile(null);
    setImagePreview(null);
    submit(formData);
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setImagePreview(URL.createObjectURL(file));
      setImageFile(file);
    }
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
          <input
            onChange={onImageChange}
            type="file"
            className="hidden"
            id="post-image"
          />
          <label
            htmlFor="post-image"
            className="btn tooltip btn-square btn-ghost flex items-center"
            data-tip="Upload image"
          >
            <ImageIcon className="mx-auto" />
          </label>

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

        {imagePreview && (
          <img
            className="h-24 w-24 rounded-lg"
            src={imagePreview}
            alt="image"
          />
        )}
      </div>
    </div>
  );
}
