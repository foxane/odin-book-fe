interface Post {
  id: number;
  createdAt: string;
  text: string;
  user: User;
  userId: string;
  isLiked: boolean;
  _count: {
    likedBy: number;
  };
  isPending?: boolean; // Pending is frontend only to apply pending state on optimistic update
}

interface PostPayload {
  text: string;
}
