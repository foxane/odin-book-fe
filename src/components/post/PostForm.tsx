import { CheckCircleIcon, ImagePlusIcon } from "lucide-react";
import ImagePreview from "./ImagePreview";
import usePostForm from "./usePostForm";
import useAutoResize from "../../hooks/useAutoResize";

function PostForm() {
  const { formState, handleSubmit, register, resetField, watch } =
    usePostForm();
  const { errors, isSubmitting } = formState;
  const { ref, ...textRules } = register("text", {
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

  const textRef = useAutoResize(watch("text"));

  return (
    <form
      onSubmit={handleSubmit}
      className="border-base-content/10 space-y-4 border p-4 shadow-lg"
    >
      <div>
        <label className="floating-label">
          <textarea
            ref={(e) => {
              textRef.current = e;
              ref(e);
            }}
            {...textRules}
            className="textarea max-h-52 w-full resize-none"
            placeholder="What's on your mind?"
          />
          <span>Whats on your mind?</span>
        </label>
      </div>

      {formState.isDirty && (
        <div className="">
          <p className="validator-hint text-error">{errors.text?.message}</p>
          <p className="validator-hint text-error">{errors.image?.message}</p>
        </div>
      )}

      <div className="flex space-x-1">
        <div>
          <input
            id="imageInput"
            type="file"
            className="hidden"
            {...register("image", {
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
            })}
          />

          <button
            type="button"
            className="btn btn-sm"
            onClick={() => document.getElementById("imageInput")?.click()}
          >
            <ImagePlusIcon size={20} />
            Add image
          </button>
        </div>

        <button
          type="button"
          className="btn btn-sm"
          onClick={() => {
            console.log("Open poll form");
          }}
        >
          <CheckCircleIcon size={20} />
          Create Poll
        </button>

        <button
          disabled={isSubmitting}
          type="submit"
          className="btn btn-primary btn-sm ms-auto"
        >
          Submit
        </button>
      </div>

      <ImagePreview
        image={watch("image")?.[0]}
        remove={() => resetField("image")}
      />
    </form>
  );
}

export default PostForm;
