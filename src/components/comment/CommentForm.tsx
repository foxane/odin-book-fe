import useAutoResize from "../../hooks/useAutoResize";
import { ImagePlusIcon } from "lucide-react";
import useCommentForm from "./useCommentForm";

function CommentForm({ postId }: { postId: string }) {
  const { formState, handleSubmit, register, watch } = useCommentForm(postId);

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
    <div>
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
              placeholder="Post a comment"
            />
            <span>Post a comment</span>
          </label>
        </div>

        {formState.isDirty && (
          <div className="">
            <p className="validator-hint text-error">
              {formState.errors.text?.message}
            </p>
          </div>
        )}

        <div className="flex space-x-1">
          <div>
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
            disabled={formState.isSubmitting}
            type="submit"
            className="btn btn-primary btn-sm ms-auto"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default CommentForm;
