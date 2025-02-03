import { Outlet } from "react-router-dom";

import Footer from "./components/Footer";
import useAuth from "./hooks/useAuth";
import UserMenu from "./components/navbar/UserMenu";
import Navbar from "./components/navbar/Navbar";

function App() {
  const { user } = useAuth();

  return (
    <div className="">
      <Navbar />

      <main>
        {user && <UserMenu user={user} />}

        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default App;
