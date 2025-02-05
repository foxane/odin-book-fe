import { twMerge } from "tailwind-merge";
import useFeed from "../hooks/useFeed";
import { useState } from "react";

export default function IndexPage() {
  const {
    query,
    createMutation,
    updateMutation,
    likeMutation,
    deleteMutation,
  } = useFeed();
  const [toUpdate, setToUpdate] = useState<Post | null>(null);

  const removePTag = (text: string) =>
    text.replace(/<p>/g, "").replace(/<\/p>/g, "\n");

  return (
    <div className="container mx-auto">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          const text = formData.get("text") as string;

          if (!text) return;
          createMutation.mutate({ text });
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
          disabled={createMutation.isPending}
        >
          Post
        </button>
      </form>

      <section className="space-y-4">
        {query.data?.map((el) => (
          <div
            key={el.id}
            className={twMerge(
              "p-2 shadow-lg",
              el.isPending && "animate-pulse",
            )}
          >
            <div className="card-title">
              <p>{el.user.name}</p>
              {el.isPending && (
                <span className="ms-auto text-sm">Posting...</span>
              )}
            </div>

            <div className="card-body">
              {/* FUCK YOUR SELF-XSS */}
              <div>
                <div dangerouslySetInnerHTML={{ __html: el.text }} />
              </div>
            </div>

            <div className="card-actions">
              <button
                disabled={likeMutation.isPending}
                className="btn"
                onClick={() => likeMutation.mutate(el)}
              >
                Like {el.isPending ? 0 : el._count.likedBy}
              </button>
              <button className="btn">Comment</button>
              <button
                className="btn"
                onClick={() => {
                  const modal = document.getElementById(
                    "update-post-modal",
                  ) as HTMLDialogElement;
                  modal.showModal();
                  setToUpdate(el);
                }}
              >
                Update
              </button>
              <button
                className="btn"
                onClick={() => {
                  deleteMutation.mutate(el);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        <dialog className="modal" id="update-post-modal">
          <div className="modal-box">
            <form
              method="dialog"
              onSubmit={() => {
                if (!toUpdate) return;
                updateMutation.mutate(toUpdate);
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
