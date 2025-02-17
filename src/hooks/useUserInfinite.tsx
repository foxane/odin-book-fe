import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../utils/services";

export default function useUserInfinite(queryKey: readonly unknown[]) {
  const client = useQueryClient();
  const followMutation = useMutation({
    mutationFn: (user: User) => userService.follow(user),
    onSettled: () => client.invalidateQueries({ queryKey }),
  });

  return {
    follow: followMutation,
  };
}
