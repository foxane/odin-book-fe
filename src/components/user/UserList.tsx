import { UseInfiniteQueryResult } from "@tanstack/react-query";
import UserCard from "./UserCard";
import useUserInfinite, { InfiniteUser } from "../../hooks/useUserInfinite";
import InfiniteScrollObserver from "../common/InfiniteScrollObserver";

interface Props {
  query: UseInfiniteQueryResult<InfiniteUser>;
  queryKey: unknown[];
}

function UserList({ query, queryKey }: Props) {
  const { follow } = useUserInfinite(queryKey);
  const users = query.data?.pages.flat() ?? [];

  return (
    <section className="space-y-2">
      {users.map((el) => (
        <UserCard
          user={el}
          key={el.id}
          follow={() => {
            follow.mutate(el);
            console.log("hi");
          }}
        />
      ))}

      <InfiniteScrollObserver query={query} />
    </section>
  );
}

export default UserList;
