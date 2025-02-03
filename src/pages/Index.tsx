// import { useEffect, useState } from "react";
// import PostInput from "../components/PostInput";
// import postService from "../services/post";
// import PostCard from "../components/PostCard";

export default function IndexPage() {
  // const [posts, setPosts] = useState<Post[] | null>(null);

  // useEffect(() => {
  //   postService
  //     .getAllPost()
  //     .then((posts) => setPosts(posts))
  //     .catch((err: unknown) => console.log(err));
  // });

  return (
    <div className="h-screen">
      {/* <PostInput /> */}

      {/* {posts?.map((el) => <PostCard key={el.id} post={el} />)} */}

      <p>Feed</p>
    </div>
  );
}
