import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import postService from "../services/post";
import useAuth from "./useAuth";

export default function usePost() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["posts"],
    queryFn: () => postService.getAllPost(),
  });

  const mutation = useMutation({
    mutationFn: (p: PostPayload) => postService.createPost(p),

    onMutate: async (post) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      const prev = queryClient.getQueryData<Post[]>(["posts"]);
      const formattedText = post.text
        .split("\n")
        .map((line) => `<p>${line}</p>`)
        .join("");

      const newPost = {
        ...post,
        user,
        id: Date.now(),
        text: formattedText,
        pending: true,
      };

      queryClient.setQueryData(["posts"], (oldPosts: Post[] | undefined) => {
        if (oldPosts) return [newPost, ...oldPosts];
        else return [newPost];
      });

      // In case something fail or smth, read the fucking docs
      return { prev };
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
    },

    onError: (_err, _newPost, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["posts"], ctx.prev);
    },
  });

  return { query, mutation };
}
