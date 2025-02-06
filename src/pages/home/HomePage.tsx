import { useState } from "react";
import usePostMutation from "../../hooks/usePostMutation";
import Feed from "./feed/Feed";
import { removePTag } from "../../lib/utils";

export default function IndexPage() {
  const { createPost, updatePost } = usePostMutation(["posts"]);
  const [toUpdate, setToUpdate] = useState<Post | null>(null);

  return (
    <div className="container mx-auto">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          const text = formData.get("text") as string;

          if (!text) return;
          createPost.mutate({ text });
        }}
      >
        <textarea
          minLength={3}
          maxLength={300}
          name="text"
          className="textarea"
          placeholder="What's on your mind?"
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={createPost.isPending}
        >
          Post
        </button>
      </form>

      <section className="space-y-4">
        <Feed />

        <dialog className="modal" id="update-post-modal">
          <div className="modal-box">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!toUpdate) return;

                console.log("Why am i submitting>");

                updatePost.mutate(toUpdate);
              }}
            >
              <p className="pb-5 text-lg font-semibold">Update post</p>

              <textarea
                minLength={3}
                maxLength={300}
                name="text"
                className="textarea w-full"
                value={removePTag(toUpdate?.text ?? "")}
                onChange={(e) => {
                  if (!toUpdate) return;
                  setToUpdate({ ...toUpdate, text: e.target.value });
                }}
              />

              <div className="modal-action">
                <button className="btn">Cancel</button>
                <button type="submit" className="btn btn-primary">
                  Update
                </button>
              </div>
            </form>
          </div>
        </dialog>
      </section>
    </div>
  );
}
