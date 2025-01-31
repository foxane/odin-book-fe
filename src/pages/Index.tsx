import useAuth from "../hooks/useAuth";

export default function IndexPage() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Welcome {user?.name}</h1>
      <button className="btn btn-sm font-bold btn-warning" onClick={logout}>
        Logout
      </button>
    </div>
  );
}
