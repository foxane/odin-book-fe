import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { api } from "../../utils/services";
import { DEFAULT_API_CURSOR_LIMIT } from "../../utils/constants";
import PostList from "../../components/post/PostList";
import UserList from "../../components/user/UserList";
import useDebounce from "../../hooks/useDebounce";

function SearchPage() {
  const client = useQueryClient();
  const [_query, setQuery] = useState("");
  const query = useDebounce(_query);

  const postQuery = useInfiniteQuery({
    enabled: !!query,
    queryKey: ["posts", query],
    initialPageParam: "",
    queryFn: ({ pageParam }) =>
      api.axios
        .get<Post[]>(`/posts?search=${query}&cursor=${pageParam}`)
        .then((data) => data.data),
    getNextPageParam: (page) =>
      page.length < DEFAULT_API_CURSOR_LIMIT
        ? undefined
        : page.at(-1)?.id.toString(),
  });

  const userQuery = useInfiniteQuery({
    enabled: !!query,
    queryKey: ["users", query],
    initialPageParam: "",
    queryFn: ({ pageParam }) =>
      api.axios
        .get<User[]>(`/users?search=${query}&cursor=${pageParam}`)
        .then((data) => data.data),
    getNextPageParam: (page) =>
      page.length < DEFAULT_API_CURSOR_LIMIT
        ? undefined
        : page.at(-1)?.id.toString(),
  });

  const isLoading = postQuery.isLoading || userQuery.isLoading;

  /**
   * Autofocus input after search
   */
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current && !isLoading) inputRef.current.focus();
  }, [inputRef, isLoading]);

  /**
   * Clear old cache
   */
  useEffect(() => {
    client.removeQueries({ type: "inactive" });
  }, [query, client]);

  return (
    <div>
      <form className="card p-4 shadow-md">
        <label className="input w-full border">
          <SearchIcon opacity={0.5} />
          <input
            ref={inputRef}
            autoFocus
            disabled={isLoading}
            type="search"
            placeholder="Search on twittard..."
            value={_query}
            onChange={({ target }) => setQuery(target.value)}
          />
        </label>
      </form>

      <div className="tabs tabs-border flex space-y-6">
        <input
          type="radio"
          name="search-tab"
          className="tab grow"
          aria-label="Posts"
          defaultChecked
        />
        <div className="tab-content">
          <PostList query={postQuery} queryKey={["posts", query]} buttonMode />
        </div>

        <input
          type="radio"
          name="search-tab"
          className="tab grow"
          aria-label="Users"
        />
        <div className="tab-content">
          <UserList query={userQuery} queryKey={["users", query]} buttonMode />
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
