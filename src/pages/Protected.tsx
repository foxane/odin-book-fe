import { Navigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";

interface Props {
  page: React.ReactNode;
}

export default function ProtectRoute({ page }: Props) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to={"/auth"} replace />;
  }

  return page;
}
