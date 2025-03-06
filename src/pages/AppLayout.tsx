import { Outlet } from "react-router-dom";
import Drawer from "../components/Drawer";
import Navbar from "../components/navbar/Navbar";

export default function AppLayout() {
  return (
    <div>
      <Navbar />
      <Drawer>
        {/* Height is 100vh - navbar height */}
        {/* TODO: create new util class for it */}
        <div className="flex min-h-[calc(100vh-3.5rem)] justify-between">
          <main className="">
            stuff
            <Outlet />
          </main>

          <aside className="hidden min-w-52 sm:block">other stuff</aside>
        </div>
      </Drawer>
    </div>
  );
}
