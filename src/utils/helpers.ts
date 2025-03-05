import { NavigateOptions, To, useNavigate } from "react-router-dom";

export const useTypedNavigate = () => {
  return useNavigate() as (
    to: To,
    options?: NavigateOptions & { state?: unknown },
  ) => void;
};
