import { Outlet } from "react-router-dom";
import { Slide } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { useTheme } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Drawer from "./components/Drawer";
import { ArrowUp } from "lucide-react";

export default function App() {
  return (
    <div className="border-base-content/30 mx-auto max-w-7xl">
      <Drawer>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex grow flex-col p-3">
            <Outlet />
          </main>
        </div>
      </Drawer>

      <ToastContainer
        theme={useTheme().isDark ? "dark" : "light"}
        position="bottom-right"
        transition={Slide}
        hideProgressBar
        closeButton
        closeOnClick
      />

      <div className="fixed bottom-10 right-10">
        <button
          className="btn btn-circle btn-outline btn-primary btn-lg"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <ArrowUp size={30} />
        </button>
      </div>
    </div>
  );
}
