# TODOS

- [ ] **LOW** Notification page

  - [x] Create model for notification
  - [x] Update controller to craete notification where necessary
    - [x] New follower
    - [x] New post from followed user
    - [x] Post liked
    - [x] Post commented
    - [x] Comment liked
  - [ ] Craete notification endpoint
    - [x] **GET** /notifications Get all notifications for the authenticated user
    - [x] **PATCH** /notifications/:id/read Mark a single notification as read
    - [x] **PATCH** /notifications/read-all Mark all notifications as read
    - [ ] **DELETE** /notifications/:id Delete a single notification
    - [ ] **DELETE** /notifications/clear Delete all read notifications
  - [x] Create notification page with basic styling

---

- [ ] **HIGH** Message page

  - [x] Create model for messages
  - [ ] Setup socket.io (server & client)
  - [ ] Design backend events
  - [ ] Implement basic styling

---

- [ ] **LOW** Redesign UserCard structure (or user list in general, User page is working fine)

  - Affected files:
    - [ ] `src/App.tsx`
    - [ ] `src/component/user/UserCard.tsx`
    - [ ] `src/pages/user/FollowingSection.tsx`
    - [ ] `src/pages/user/FollowerSection.tsx`

---

- [ ] **LOW** Change all `findMany` queries to infinite queries (Paused, waiting for User lists to take shape)
  - [x] Post resource
  - [x] Comment resource
  - [ ] User resource

---

- [x] **LOW** Create endpoint to get unread notification count

---

- [ ] **VERY LOW** Create online status
