import { Outlet } from "react-router-dom";

import Footer from "./components/Footer";
import Navbar from "./components/navbar/Navbar";

function App() {
  return (
    <div>
      <Navbar />

      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default App;
