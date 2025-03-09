import { useQueryClient } from "@tanstack/react-query";
import { cancelAndGetPrev } from "../utils/helpers";

function useOptimistic<T, TArg extends unknown[]>({
  mutateFn,
  apiCall,
  queryKey,
}: {
  mutateFn: (data: T, ...args: TArg) => T;
  apiCall: (...args: TArg) => Promise<void>;
  queryKey: unknown[];
}) {
  const client = useQueryClient();
  const main = async (...args: TArg) => {
    const prev = await cancelAndGetPrev<T>(client, queryKey);
    client.setQueryData(queryKey, (old: T) =>
      old ? mutateFn(old, ...args) : old,
    );

    try {
      await apiCall(...args);
    } catch (error) {
      /**
       * TODO: Add error handler, toast probs
       */
      console.log(error);
      client.setQueryData(queryKey, prev);
    }
  };

  return main;
}

export default useOptimistic;
