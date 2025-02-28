import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { api, postService } from "../utils/services";

function usePostMutation(queryKey: readonly unknown[]) {
  const client = useQueryClient();

  const createPost = async (payload: FormData) => {
    const { data: newPost } = await toast.promise(
      api.axios.post<Post>("/post", payload),
      {
        pending: "Creating new post...",
        error: "Create post failed",
        success: "Post created",
      },
    );
    client.setQueryData(queryKey, (data: InfiniteData<Post[]>) => ({
      ...data,
      pages: [[newPost, ...data.pages[0]], ...data.pages.slice(1)],
    }));

    return true;
  };

  const updatePost = async (post: Post) => {
    const updatedPost = await toast.promise(postService.update(post), {
      pending: "Updating post...",
      error: "Update post failed",
      success: "Post updated",
    });

    client.setQueryData(queryKey, (data: InfiniteData<Post[]>) => ({
      ...data,
      pages: data.pages.map((page) =>
        page.map((el) => (el.id === post.id ? updatedPost : el)),
      ),
    }));
  };

  const deletePost = async (post: Post) => {
    await toast.promise(postService.delete(post), {
      pending: "Deleting post...",
      error: "Delete post failed",
      success: "Post deleted",
    });

    client.setQueryData(queryKey, (data: InfiniteData<Post[]>) => ({
      ...data,
      pages: data.pages.map((page) => page.filter((el) => el.id !== post.id)),
    }));
  };

  const likePost = async (post: Post) => {
    const prevData = client.getQueryData<InfiniteData<Post[]>>(queryKey);
    client.setQueryData(queryKey, (data: InfiniteData<Post[]>) => ({
      ...data,
      pages: data.pages.map((page) =>
        page.map((el) =>
          el.id === post.id
            ? {
                ...el,
                isLiked: !post.isLiked,
                _count: {
                  likedBy: post._count.likedBy + (post.isLiked ? -1 : +1),
                  comment: post._count.comment,
                },
              }
            : el,
        ),
      ),
    }));
    try {
      await postService.like(post);
    } catch (error) {
      console.log(error);
      toast.error("Like post failed");
      client.setQueryData(queryKey, prevData);
    }
  };

  return { createPost, updatePost, likePost, deletePost };
}

export default usePostMutation;
