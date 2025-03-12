export default class ChatSummaryDummy implements ChatSummary {
  id = Date.now();
  lastMessage = null;
  unreadCount = 0;
  isDummy = true;

  otherUser: {
    id: number;
    name: string;
    avatar: string | null;
    lastSeen: string | null;
  };

  constructor(target: User) {
    this.otherUser = target;
  }
}
