import { twMerge } from "tailwind-merge";
import usePost from "../hooks/usePost";

export default function IndexPage() {
  const { query, mutation } = usePost();

  return (
    <div className="container mx-auto">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          const text = formData.get("text") as string;

          if (!text) return;
          mutation.mutate({ text });
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
          disabled={mutation.isPending}
        >
          Post
        </button>
      </form>

      <section className="space-y-4">
        {query.data?.map((el) => (
          <div
            key={el.id}
            className={twMerge("p-2 shadow-lg", el.pending && "animate-pulse")}
          >
            <div className="card-title">
              <p>{el.user.name}</p>
              {el.pending && (
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
              <button className="btn">Like {el._count.likedBy}</button>
              <button className="btn">Comment</button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
