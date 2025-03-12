import { Outlet } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import DrawerLeft from "../../components/common/DrawerLeft";
import DrawerRight from "../../components/common/DrawerRight";
import { NotifProvider } from "../../context/NotifContext";

export default function AppLayout() {
  return (
    <NotifProvider>
      <div className="relative mx-auto lg:container">
        <DrawerLeft>
          <DrawerRight>
            <Navbar />
            <main className="mx-auto mt-3 w-full max-w-3xl px-2">
              <Outlet />
            </main>
          </DrawerRight>
        </DrawerLeft>
      </div>
    </NotifProvider>
  );
}
