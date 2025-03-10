import { Outlet } from "react-router-dom";
import Drawer from "./Drawer";
import Navbar from "../../components/navbar/Navbar";

export default function AppLayout() {
  return (
    <div className="relative mx-auto lg:container">
      <Navbar />
      <Drawer>
        <main className="mx-auto mt-3 w-full max-w-3xl px-2">
          <Outlet />
        </main>
      </Drawer>
    </div>
  );
}
