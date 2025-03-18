import { User } from "lucide-react";
import { api } from "../../utils/services";
import { authErrorHandler, AuthResponse } from "../../utils/authHelper";
import useAuth from "../../context/AuthContext";
import { useAuthPageContext } from "./useAuthPage";
import { toast } from "react-toastify";

function GuestLogin() {
  const { setLoading, setError } = useAuthPageContext();
  const login = useAuth((s) => s.login);

  const handleGuestLogin = async () => {
    setLoading("Retrieving guest account data...");
    try {
      const { data } = await api.axios.get<AuthResponse>("/auth/guest");
      await login(data.token, data.user);
    } catch (error: unknown) {
      const cleanError = authErrorHandler(error);
      toast.error(cleanError.message);
      setError(cleanError);
      console.log(error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <button className="btn btn-soft" onClick={handleGuestLogin}>
      <User />
      Continue as Guest
    </button>
  );
}

export default GuestLogin;
