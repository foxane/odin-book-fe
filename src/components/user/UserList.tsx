import { UseInfiniteQueryResult } from "@tanstack/react-query";
import UserCard from "./UserCard";
import useUserInfinite, { InfiniteUser } from "../../hooks/useUserInfinite";
import InfiniteScrollObserver from "../common/InfiniteScrollObserver";
import LoadingOrEmptyCard from "../common/LoadingOrEmptyCard";

interface Props {
  query: UseInfiniteQueryResult<InfiniteUser>;
  queryKey: unknown[];
  buttonMode?: boolean;
}

function UserList({ query, queryKey, buttonMode }: Props) {
  const { follow } = useUserInfinite(queryKey);
  const users = query.data?.pages.flat() ?? [];

  return (
    <section className="space-y-1">
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

      {users.length === 0 && <LoadingOrEmptyCard isLoading={query.isLoading} />}

      <InfiniteScrollObserver query={query} buttonMode={buttonMode} />
    </section>
  );
}

export default UserList;
