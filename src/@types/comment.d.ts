interface IComment extends Post {
  postId: number;
}

interface CommentPayload {
  text: string;
}
