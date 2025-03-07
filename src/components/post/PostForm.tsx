import { SubmitHandler, useForm } from "react-hook-form";
import { api } from "../../utils/services";
import { ImagePlusIcon } from "lucide-react";
import { useEffect, useRef } from "react";

interface PostPayload {
  text: string;
  image?: FileList;
}

function PostForm() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm<PostPayload>();

  /**
   * Field rules
   */
  const { ref: textRefHook, ...textRules } = register("text", {
    required: "Post cannot be empty",
    minLength: {
      message: "Post need to be at least 3 characters long",
      value: 3,
    },
    maxLength: {
      message: "Post cannot exceed 300 characters",
      value: 300,
    },
  });

  const imageRules = register("image", {
    validate: (files) => {
      const file = files?.[0];
      if (!file) return true;

      const maxSize = 1024 * 1024 * 10;
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

      if (file.size > maxSize) {
        return `File size cannot exceed ${maxSize / 1024 / 1024}MB`;
      }
      if (!allowedTypes.includes(file.type)) {
        return "Only JPEG, PNG, and GIF files are allowed";
      }

      return true;
    },
  });

  const onSubmit: SubmitHandler<PostPayload> = async (data) => {
    const payload = new FormData();
    payload.append("text", data.text);
    if (data.image) payload.append("user-upload", data.image[0]);

    /**
     * TODO: Create optimistic update
     */
    try {
      const { data: post } = await api.axios.post<Post>("/posts", payload);
      console.log(post);
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  const imagePreview = watch("image")?.[0];
  const textValue = watch("text");

  const textRef = useRef<HTMLTextAreaElement | null>(null);
  useEffect(() => {
    if (!textRef.current) return;
    const { style } = textRef.current;

    // Height autosize
    style.height = "auto";
    style.height = `${textRef.current.scrollHeight.toString()}px`;
  }, [textValue]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border-base-content/10 space-y-3 border p-4 shadow-lg"
    >
      <div>
        <label className="floating-label">
          <textarea
            {...textRules}
            ref={(e) => {
              textRefHook(e);
              textRef.current = e;
            }}
            className="textarea w-full resize-none"
            placeholder="What's on your mind?"
          />
          <span>Whats on your mind?</span>
        </label>
        <span className="validator-hint text-error">
          {errors.text?.message}
        </span>
      </div>

      <div className="flex">
        <div>
          <label tabIndex={0} className="btn">
            <ImagePlusIcon />
            Add image
            <input type="file" className="hidden" {...imageRules} />
          </label>
          <p className="validator-hint text-error">{errors.image?.message}</p>
        </div>

        <button
          disabled={isSubmitting}
          type="submit"
          className="btn btn-primary ms-auto"
        >
          Submit
        </button>
      </div>

      {imagePreview && (
        <div className="indicator">
          <img
            src={URL.createObjectURL(imagePreview)}
            alt="Preview"
            className="h-20 w-20 object-cover"
          />
          <button
            onClick={() => resetField("image")}
            className="indicator-item badge badge-error hover cursor-pointer"
          >
            X
          </button>
        </div>
      )}
    </form>
  );
}

export default PostForm;
