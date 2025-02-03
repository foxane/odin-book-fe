interface Post {
  id: number;
  createdAt: string;
  text: string;
  user: User;
  userId: string;
  _count: {
    likedBy: number;
  };
}

interface PostPayload {
  text: string;
}
