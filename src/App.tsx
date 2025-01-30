import { AuthContext } from "./context/AuthContext";
import { useContext, useState } from "react";

function App() {
  const { login, user, error } = useContext(AuthContext);
  const [cred, setCred] = useState({ email: "", password: "" });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void login(cred);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setCred({
      ...cred,
      [name]: value,
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="card gap-2 p-2">
        <div className="join">
          <div>
            <label className="validator input join-item">
              <input type="email" placeholder="mail@site.com" required />
            </label>
            <div className="validator-hint hidden">
              Enter valid email address
            </div>
          </div>
        </div>
        <input
          type="password"
          name="password"
          onChange={handleChange}
          value={cred.password}
          required
        />
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>

      <input type="checkbox" value="dark" className="theme-controller toggle" />

      {user && <div>{user.name}</div>}
      {error && <div>{error.message}</div>}
    </>
  );
}

export default App;
