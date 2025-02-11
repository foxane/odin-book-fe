import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const useAuth = () => {
  const context = useContext(AuthContext) as IAuthContext | undefined;
  if (!context) throw new Error("useAuth called outside provider");

  return context;
};

export default useAuth;
