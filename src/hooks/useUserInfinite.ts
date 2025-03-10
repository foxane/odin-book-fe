import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../utils/services";
import { cancelAndGetPrev, modifyFollow } from "../utils/helpers";

export type InfiniteUser = InfiniteData<User[]>;

function useUserInfinite(queryKey: unknown[]) {
  const client = useQueryClient();

  const follow = useMutation({
    mutationFn: async (user: User) => {
      const url = `/users/${user.id}/follow`;
      if (user.isFollowed) await api.axios.delete(url);
      else await api.axios.post(url);
    },

    onMutate: async (user: User) => {
      const prev = await cancelAndGetPrev(client, queryKey);
      client.setQueryData(queryKey, (old: InfiniteUser | undefined) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) =>
            page.map((el) => (el.id === user.id ? modifyFollow(el, true) : el)),
          ),
        };
      });
      return { prev };
    },

    onError: (error, __, context) => {
      console.log(error);
      return context?.prev && client.setQueryData(queryKey, context.prev);
    },
  });

  return { follow };
}

export default useUserInfinite;
