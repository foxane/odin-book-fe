import { SearchIcon } from "lucide-react";
import { useState } from "react";
import useDebounce from "../hooks/useDebounce";
import { useInfiniteQuery } from "@tanstack/react-query";
import { postService, userService } from "../utils/services";
import PostCard from "../components/post/PostCard";
import UserCard from "../components/UserCard";
import useUserInfinite from "../hooks/useUserInfinite";
import usePostMutation from "../hooks/usePostInfinite";

function SearchPage() {
  const [s, setS] = useState("");
  const search = useDebounce(s);

  const post = useInfiniteQuery({
    enabled: !!search,
    queryKey: ["posts", search],
    initialPageParam: "",
    queryFn: ({ pageParam }) => postService.getMany(pageParam, search),
    getNextPageParam: (prevPages) =>
      prevPages.length < 10 ? undefined : prevPages.at(-1)?.id.toString(),
  });
  const { deletePost, likePost, updatePost } = usePostMutation([
    "posts",
    search,
  ]);
  const postsData = post.data?.pages.flat() ?? [];

  const user = useInfiniteQuery({
    enabled: !!search,
    queryKey: ["users", search],
    initialPageParam: "",
    queryFn: ({ pageParam }) => userService.getMany(pageParam, search),
    getNextPageParam: (prevPages) =>
      prevPages.length < 10 ? undefined : prevPages.at(-1)?.id.toString(),
  });
  const userMutation = useUserInfinite(["users", search]);
  const usersData = user.data?.pages.flat() ?? [];

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2 p-2">
        <label className="input grow">
          <SearchIcon size={20} opacity={0.5} />
          <input
            type="search"
            placeholder="Search"
            onChange={(e) => setS(e.target.value)}
          />
        </label>
      </div>

      <div className="tabs tabs-box space-y-2">
        <input
          type="radio"
          name="tab"
          className="tab grow"
          aria-label="Post"
          defaultChecked
        />
        <div className="tab-content space-y-3">
          {postsData.map((el) => (
            <PostCard
              post={el}
              key={el.id}
              action={{
                delete: deletePost,
                like: likePost,
                update: updatePost,
              }}
            />
          ))}
          {post.isLoading && <div className="loading mx-auto" />}
          {!post.isLoading && postsData.length === 0 && (
            <p className="text-center italic opacity-50">
              No post with &quot;{search}&quot; found
            </p>
          )}
          {post.hasNextPage && (
            <button
              disabled={post.isFetching}
              className="btn btn-primary btn-sm mx-auto block"
              onClick={() => post.fetchNextPage()}
            >
              {post.isFetching ? (
                <span className="loading"></span>
              ) : (
                "Load more"
              )}
            </button>
          )}
        </div>

        <input type="radio" name="tab" className="tab grow" aria-label="User" />
        <div className="tab-content space-y-2">
          {user.isLoading && <div className="loading mx-auto" />}
          {!user.isLoading && usersData.length === 0 && (
            <p className="text-center italic opacity-50">
              No user with &quot;{search}&quot; name found
            </p>
          )}
          {usersData.map((el) => (
            <UserCard
              user={el}
              key={el.id}
              follow={userMutation.follow.mutate}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
