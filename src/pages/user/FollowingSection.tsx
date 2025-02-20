import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, userService } from "../../utils/services";
import UserCard from "../../components/UserCard";

function FollowingSection({ userId }: { userId: string }) {
  const usersKey = ["following", userId];
  const query = useQuery({
    queryKey: usersKey,
    queryFn: async () => {
      const { data } = await api.axios.get<User[]>(
        `/users/${userId}/following`,
      );
      return data;
    },
  });
  const client = useQueryClient();

  const followMutation = useMutation({
    mutationFn: userService.follow,
    onMutate: async (toFollow) => {
      await client.cancelQueries({ queryKey: usersKey });
      const prev = client.getQueryData(usersKey);

      client.setQueryData(usersKey, (old: User[] | undefined) =>
        old
          ? old.map((el) =>
              el.id !== toFollow.id ? el : { ...el, isFollowed: true },
            )
          : old,
      );

      return { prev };
    },
    onError: (_, __, ctx) =>
      ctx?.prev && client.setQueryData(usersKey, ctx.prev),
    onSettled: () => client.invalidateQueries({ queryKey: usersKey }),
  });

  return (
    <div>
      {query.data?.map((el) => (
        <UserCard follow={followMutation.mutate} user={el} key={el.id} />
      ))}
    </div>
  );
}

export default FollowingSection;
