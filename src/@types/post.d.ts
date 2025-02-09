interface Post {
  id: number;
  createdAt: string;
  text: string;
  user: User;
  userId: string;
  isLiked: boolean;
  _count: {
    likedBy: number;
    comment: number;
  };

  /**
   * Frontend only props
   */
  isPending?: boolean; // Mutation state
  status?: "create" | "update" | "delete"; // Mutation action
}

interface PostPayload {
  text: string;
}

interface PostAndCommentAction {
  update: (c: Post | IComment) => void;
  delete: (c: Post | IComment) => void;
  like: (c: Post | IComment) => void;
}

type MutateFn = (c: Post | IComment) => void;
