import { Outlet } from "react-router-dom";
import { Slide } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { useTheme } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Drawer from "./components/Drawer";

export default function App() {
  return (
    <div className="border-base-content/30 mx-auto max-w-7xl">
      <Drawer>
        <Navbar />
        <main>
          <Outlet />
        </main>
      </Drawer>

      <ToastContainer
        theme={useTheme().isDark ? "dark" : "light"}
        position="bottom-right"
        transition={Slide}
        hideProgressBar
        closeButton
        closeOnClick
      />
    </div>
  );
}
