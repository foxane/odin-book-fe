import { Outlet } from "react-router-dom";
import Drawer from "./Drawer";
import Navbar from "../../components/navbar/Navbar";

export default function AppLayout() {
  return (
    <div className="container relative mx-auto">
      <Navbar />
      <Drawer>
        <main className="mx-auto mt-3 w-full max-w-3xl">
          <Outlet />
        </main>
      </Drawer>
    </div>
  );
}
