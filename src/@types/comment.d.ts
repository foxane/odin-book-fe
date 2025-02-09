interface IComment extends Post {
  id: number;
  postId: number;
  createdAt: string;
  text: string;
  user: User;
  userId: string;
  isLiked: boolean;
  _count: {
    likedBy: number;
  };

  /**
   * Frontend only props
   */
  isPending?: boolean; // Mutation state
  status?: "create" | "update" | "delete"; // Mutation action
}

interface CommentPayload {
  text: string;
}
