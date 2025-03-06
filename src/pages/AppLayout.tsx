import { useEffect } from "react";
import useAuth from "../context/AuthContext";

export default function AppLayout() {
  const logout = useAuth((s) => s.logout);
  const user = useAuth((s) => s.user);
  const socket = useAuth((s) => s.socket);

  useEffect(() => {
    if (!socket) return;
    const handleConnect = () => console.log("connected, ", socket.connected);

    socket.on("connect", () => handleConnect);
    socket.on("disconnect", () => handleConnect);

    return () => {
      socket.off("connect", () => handleConnect);
      socket.off("disconnect", () => handleConnect);
    };
  }, [socket]);

  return (
    <div>
      <p>Hello, {user?.name}</p>
      <button onClick={logout} className="btn btn-error">
        Logout
      </button>
    </div>
  );
}
