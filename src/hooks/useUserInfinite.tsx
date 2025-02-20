import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../utils/services";

interface Pages {
  pageParams: string;
  pages: User[][];
}

export default function useUserInfinite(queryKey: readonly unknown[]) {
  const client = useQueryClient();
  const followMutation = useMutation({
    mutationFn: (user: User) => userService.follow(user),
    onMutate: async (user) => {
      await client.cancelQueries({ queryKey });
      const prev = client.getQueryData<Pages>(queryKey);

      client.setQueryData(queryKey, {
        ...prev,
        pages: prev?.pages.map((page) =>
          page.map((el) =>
            el.id === user.id ? { ...el, isFollowed: true } : el,
          ),
        ),
      });
    },
    onSettled: () => client.invalidateQueries({ queryKey }),
  });

  return {
    follow: followMutation,
  };
}
