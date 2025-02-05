import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import postService from "../services/post";
import useAuth from "./useAuth";

export default function useFeed() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["posts"],
    queryFn: () => postService.getAllPost(),
  });

  const createMutation = useMutation({
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
        isPending: true,
      };

      queryClient.setQueryData(["posts"], (oldPosts: Post[] | undefined) => {
        if (oldPosts) return [newPost, ...oldPosts];
        else return [newPost];
      });

      return { prev };
    },

    onError: (_err, _newPost, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["posts"], ctx.prev);
    },

    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (p: Post) => postService.updatePost(p),

    onMutate: async (updated) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      const prev = queryClient.getQueryData<Post[]>(["posts"]);

      const formattedText = updated.text
        .split("\n")
        .map((line) => `<p>${line}</p>`)
        .join("");

      queryClient.setQueryData(["posts"], (oldPosts: Post[] | undefined) => {
        if (!oldPosts) return oldPosts;
        return oldPosts.map((post) =>
          post.id === updated.id
            ? { ...post, text: formattedText, isPending: true }
            : post,
        );
      });

      return { prev };
    },

    onError: (_err, _updated, context) => {
      if (context?.prev) {
        queryClient.setQueryData(["posts"], context.prev);
      }
    },

    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const likeMutation = useMutation({
    mutationFn: (p: Post) => postService.likePost(p.id),

    onMutate: async (post) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      const prev = queryClient.getQueryData<Post[]>(["posts"]);

      queryClient.setQueryData(["posts"], (oldPosts: Post[] | undefined) => {
        if (!oldPosts) return oldPosts;
        return oldPosts.map((el) =>
          el.id === post.id
            ? { ...el, _count: { likedBy: el._count.likedBy++ } }
            : el,
        );
      });

      return { prev };
    },

    onError: (_err, _updated, context) => {
      if (context?.prev) {
        queryClient.setQueryData(["posts"], context.prev);
      }
    },

    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (p: Post) => postService.deletePost(p.id),

    onMutate: async (toDelete) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      const prev = queryClient.getQueryData(["posts"]);

      queryClient.setQueryData(["posts"], (oldPosts: Post[] | undefined) => {
        if (!oldPosts) return oldPosts;
        return oldPosts.filter((el) => el.id !== toDelete.id);
      });

      return { prev };
    },

    onError: (_err, _updated, context) => {
      if (context?.prev) {
        queryClient.setQueryData(["posts"], context.prev);
      }
    },

    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return {
    query,
    createMutation,
    updateMutation,
    likeMutation,
    deleteMutation,
  };
}
