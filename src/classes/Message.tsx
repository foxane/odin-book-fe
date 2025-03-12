export default class MessageDummy implements Message {
  id = Date.now();
  createdAt = new Date();
  media = [];
  status: MsgStatus = "PENDING";

  chat?: Chat | null | undefined;
  chatId?: number | null | undefined;
  readAt?: Date | null | undefined;
  text?: string | null | undefined;
  user: User;
  userId: number;

  constructor(text: string, chatId: number, user: User) {
    this.text = text;
    this.chatId = chatId;
    this.user = user;
    this.userId = user.id;
  }
}
