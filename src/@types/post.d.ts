interface Post {
  id: number;
  createdAt: string;
  text: string;
  user: User;
  userId: string;
  _count: {
    likedBy: number;
  };
  pending?: boolean; // Pending is frontend only to apply pending state on optimistic update
}

interface PostPayload {
  text: string;
}
