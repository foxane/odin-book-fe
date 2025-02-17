import { SearchIcon } from "lucide-react";
import { useState } from "react";
import useDebounce from "../../hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { postService, userService } from "../../utils/services";
import PostCard from "../../components/post/PostCard";
import UserCard from "../../components/user/UserCard";

function SearchPage() {
  const [s, setS] = useState("");
  const search = useDebounce(s);

  const post = useQuery({
    queryKey: ["post", search],
    queryFn: () => postService.getMany("", search),
    enabled: !!search,
  });

  const user = useQuery({
    queryKey: ["user", search],
    queryFn: () => userService.getMany("", search),
    enabled: !!search,
  });

  return (
    <div className="space-y-2">
      <form className="flex items-center space-x-2 p-2">
        <label className="input grow">
          <SearchIcon size={20} opacity={0.5} />
          <input
            type="search"
            placeholder="Search"
            onChange={(e) => setS(e.target.value)}
          />
        </label>
      </form>

      <div className="tabs tabs-box space-y-2">
        <input
          type="radio"
          name="tab"
          className="tab grow"
          aria-label="Post"
          defaultChecked
        />
        <div className="tab-content space-y-2">
          {post.data?.map((el) => <PostCard post={el} key={el.id} />)}
          {post.isLoading && <div className="loading mx-auto" />}
          {!post.isLoading && post.data?.length === 0 && (
            <p className="text-center italic opacity-50">
              No post with &quot;{search}&quot; found
            </p>
          )}
        </div>

        <input type="radio" name="tab" className="tab grow" aria-label="User" />
        <div className="tab-content space-y-2">
          {user.isLoading && <div className="loading mx-auto" />}
          {!user.isLoading && user.data?.length === 0 && (
            <p className="text-center italic opacity-50">
              No user with &quot;{search}&quot; name found
            </p>
          )}
          {user.data?.map((el) => <UserCard user={el} key={el.id} />)}
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
